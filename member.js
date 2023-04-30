// Open a connection to the database
const db = openDatabase('lms', '1.0', 'My Database', 2 * 1024 * 1024);

// Create the members table if it doesn't exist
db.transaction(function (tx) {
  tx.executeSql('CREATE TABLE IF NOT EXISTS members (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, start_date DATE, end_date DATE, type TEXT)');
});

function addMember(event) {
  event.preventDefault();

  const name = document.getElementById('name').value.trim();
  const start_date = document.getElementById('start_date').value.trim();
  const end_date = document.getElementById('end_date').value.trim();
  const type = document.getElementById('type').value.trim();

  // Validate input
  if (!name || !start_date || !end_date || !type) {
    alert('Please fill in all fields.');
    return;
  }

  // Check if email address already exists in the database
  db.transaction(function (tx) {
    tx.executeSql('SELECT * FROM members WHERE name = ?', [name], function (tx, results) {
      if (results.rows.length > 0) {
        alert('A member with this name already exists.');
      } else {
        // Validate start and end dates
        const startDateObj = new Date(start_date);
        const endDateObj = new Date(end_date);
        const timeDiff = Math.abs(endDateObj.getTime() - startDateObj.getTime());
        const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
        if (dayDiff < 15) {
          alert('End date must be at least 15 days after start date.');
          return;
        }

        // Add contact to database
        db.transaction(function (tx) {
          tx.executeSql('INSERT INTO members (name, start_date, end_date, type) VALUES (?, ?, ?, ?)', [name, start_date, end_date, type], function () {
            alert('Member added successfully!');
            document.getElementById('memberform').reset();
            getMembers();
          }, function (tx, error) {
            alert('An error occurred while adding the member details.');
          });
        });
      }
    });
  });
}


// Function to retrieve the members from the database and populate the table
function getMembers() {
  db.transaction(function (tx) {
    tx.executeSql('SELECT * FROM members', [], function (tx, results) {
      const memberTable = document.getElementById('member-table');
      memberTable.innerHTML = '';

      // Create table header
      const headerRow = document.createElement('tr');
      const nameHeader = document.createElement('th');
      nameHeader.textContent = 'Name';
      const startHeader = document.createElement('th');
      startHeader.textContent = 'Start Date';
      const endHeader = document.createElement('th');
      endHeader.textContent = 'End Date';
      const typeHeader = document.createElement('th');
      typeHeader.textContent = 'Member Type';
      const actionsHeader = document.createElement('th');
      actionsHeader.textContent = 'Actions';
      headerRow.appendChild(nameHeader);
      headerRow.appendChild(startHeader);
      headerRow.appendChild(endHeader);
      headerRow.appendChild(typeHeader);
      headerRow.appendChild(actionsHeader);
      memberTable.appendChild(headerRow);

      // Create table rows
      for (let i = 0; i < results.rows.length; i++) {
        const member = results.rows.item(i);
        const row = document.createElement('tr');
        const nameCell = document.createElement('td');
        nameCell.textContent = member.name;
        const startCell = document.createElement('td');
        startCell.textContent = member.start_date;
        const endCell = document.createElement('td');
        endCell.textContent = member.end_date;
        const typeCell = document.createElement('td');
        typeCell.textContent = member.type;
        const actionsCell = document.createElement('td');
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', function () {
          deleteMember(member.id);
        });
        actionsCell.appendChild(deleteButton);
        row.appendChild(nameCell);
        row.appendChild(startCell);
        row.appendChild(endCell);
        row.appendChild(typeCell);
        row.appendChild(actionsCell);
        memberTable.appendChild(row);
      }
    });
  });
}

// Function to delete a member from the database
function deleteMember(id) {
  db.transaction(function (tx) {
    tx.executeSql('DELETE FROM members WHERE id = ?', [id], function () {
      alert('Member deleted successfully!');
      getMembers();
    });
  });
}

// Display the initial list of members
getMembers();

function logout() {
  // Clear session data
  sessionStorage.clear();

  alert("Logged out!");

  // Drop all tables from the database
  db.transaction(function (tx) {
    tx.executeSql('DROP TABLE IF EXISTS issues');
    tx.executeSql('DROP TABLE IF EXISTS return');
    tx.executeSql('DROP TABLE IF EXISTS feeds');
    tx.executeSql('DROP TABLE IF EXISTS contact');
    tx.executeSql('DROP TABLE IF EXISTS members');
  });

  // Redirect to login page
  window.location.href = "index.html";
}

