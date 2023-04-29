
// Open a connection to the database
const db = openDatabase('lms', '1.0', 'My Database', 2 * 1024 * 1024);

// Create the contact table if it doesn't exist
db.transaction(function (tx) {
  tx.executeSql('CREATE TABLE IF NOT EXISTS contact (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, pno INTEGER NOT NULL, email varchar(255) UNIQUE)');

});

// Function to add a new contact to the database
function addContact(event) {
  event.preventDefault();

  const name = document.getElementById('name').value.trim();
  const pno = document.getElementById('pno').value.trim();
  const email = document.getElementById('email').value.trim();

  // Validate input
  if (!name || !pno || !email) {
    alert('Please fill in all fields.');
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    alert('Please enter a valid email address.');
    return;
  }

  // Check if email address already exists in the database
  db.transaction(function (tx) {
    tx.executeSql('SELECT * FROM contact WHERE email = ?', [email], function (tx, results) {
      if (results.rows.length > 0) {
        alert('A contact with this email address already exists.');
      } else {
        // Add contact to database
        db.transaction(function (tx) {
          tx.executeSql('INSERT INTO contact (name, pno, email) VALUES (?, ?, ?)', [name, pno, email], function () {
            alert('Contact added successfully!');
            document.getElementById('contactform').reset();
            getContact();
          }, function (tx, error) {
            alert('An error occurred while adding the contact.');
          });
        });
      }
    });
  });
}



// Function to retrieve the contact from the database and populate the table
function getContact() {
  db.transaction(function (tx) {
    tx.executeSql('SELECT * FROM contact', [], function (tx, results) {
      const issueTable = document.getElementById('contact-table');
      issueTable.innerHTML = '';

      // Create table header
      const headerRow = document.createElement('tr');
      const nameHeader = document.createElement('th');
      nameHeader.textContent = 'Name';
      const pnoHeader = document.createElement('th');
      pnoHeader.textContent = 'Phone No';
      const emailHeader = document.createElement('th');
      emailHeader.textContent = 'Email';
      const actionsHeader = document.createElement('th');
      actionsHeader.textContent = 'Actions';
      headerRow.appendChild(nameHeader);
      headerRow.appendChild(pnoHeader);
      headerRow.appendChild(emailHeader);
      headerRow.appendChild(actionsHeader);
      issueTable.appendChild(headerRow);

      // Create table rows
      for (let i = 0; i < results.rows.length; i++) {
        const contact = results.rows.item(i);
        const row = document.createElement('tr');
        const nameCell = document.createElement('td');
        nameCell.textContent = contact.name;
        const pnoCell = document.createElement('td');
        pnoCell.textContent = contact.pno;
        const emailCell = document.createElement('td');
        emailCell.textContent = contact.email;
        const actionsCell = document.createElement('td');
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', function () {
          deleteContact(contact.id);
        });
        actionsCell.appendChild(deleteButton);
        row.appendChild(nameCell);
        row.appendChild(pnoCell);
        row.appendChild(emailCell);
        row.appendChild(actionsCell);
        issueTable.appendChild(row);
      }
    });
  });
}


// Function to delete an contact from the database
function deleteContact(id) {
  db.transaction(function (tx) {
    tx.executeSql('DELETE FROM contact WHERE id = ?', [id], function () {
      alert('Contact deleted successfully!');
      getContact();
    });
  });
}

// Display the initial list of contact
getContact();


function logout() {
  // Clear session data
  sessionStorage.clear();

  
  alert("Logged out!");

  // Delete all data from the contact table
  db.transaction(function (tx) {
    tx.executeSql('DELETE FROM contact', [], function () {
      console.log('All contact data deleted!');
    });
  });

  // Redirect to login page
  window.location.href = "index.html";
}


