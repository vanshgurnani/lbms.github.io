
// Open a connection to the database
const db = openDatabase('lms', '1.0', 'My Database', 2 * 1024 * 1024);

// Create the issues table if it doesn't exist
db.transaction(function (tx) {
  tx.executeSql('CREATE TABLE IF NOT EXISTS issues (id INTEGER PRIMARY KEY AUTOINCREMENT, idate DATE, bname TEXT, sno INTEGER)');
});

// Function to add a new issue to the database
function addIssue(event) {
  event.preventDefault();

  const idate = document.getElementById('idate').value;
  const bname = document.getElementById('bname').value;
  const sno = parseInt(document.getElementById('sno').value);

  if (!idate  || !bname || isNaN(sno) || sno <= 0) {
    alert('Please fill in all fields and enter a valid serial number.');
    return;
  }

  db.transaction(function (tx) {
    // Check if book already exists in issues table
    tx.executeSql('SELECT * FROM issues WHERE bname = ?', [bname], function (tx, results) {
      if (results.rows.length > 0) {
        alert('Book is already issued.');
        return;
      }

      // If book does not exist, insert new record
      tx.executeSql('INSERT INTO issues (idate, bname, sno) VALUES (?, ?, ?)', [idate, bname, sno], function () {
        alert('Issue added successfully!');
        document.getElementById('issueform').reset();
        getIssues();
      });
    });
  });
}


// Function to retrieve the issues from the database and populate the table
function getIssues() {
  db.transaction(function (tx) {
    tx.executeSql('SELECT * FROM issues', [], function (tx, results) {
      const issueTable = document.getElementById('issue-table');
      issueTable.innerHTML = '';

      // Create table header
      const headerRow = document.createElement('tr');
      const dateHeader = document.createElement('th');
      dateHeader.textContent = 'Date';
      const bookHeader = document.createElement('th');
      bookHeader.textContent = 'Book Name';
      const snoHeader = document.createElement('th');
      snoHeader.textContent = 'Serial No';
      const actionsHeader = document.createElement('th');
      actionsHeader.textContent = 'Actions';
      headerRow.appendChild(dateHeader);
      headerRow.appendChild(bookHeader);
      headerRow.appendChild(snoHeader);
      headerRow.appendChild(actionsHeader);
      issueTable.appendChild(headerRow);

      // Create table rows
      for (let i = 0; i < results.rows.length; i++) {
        const issue = results.rows.item(i);
        const row = document.createElement('tr');
        const dateCell = document.createElement('td');
        dateCell.textContent = issue.idate;
        const bookCell = document.createElement('td');
        bookCell.textContent = issue.bname;
        const snoCell = document.createElement('td');
        snoCell.textContent = issue.sno;
        const actionsCell = document.createElement('td');
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', function () {
          deleteIssue(issue.id);
        });
        actionsCell.appendChild(deleteButton);
        row.appendChild(dateCell);
        row.appendChild(bookCell);
        row.appendChild(snoCell);
        row.appendChild(actionsCell);
        issueTable.appendChild(row);
      }
    });
  });
}


// Function to delete an issue from the database
function deleteIssue(id) {
  db.transaction(function (tx) {
    tx.executeSql('DELETE FROM issues WHERE id = ?', [id], function () {
      alert('Issue deleted successfully!');
      getIssues();
    });
  });
}

// Display the initial list of issues
getIssues();

function logout() {
  // Clear session data
  sessionStorage.clear();

  alert("Logged out!");

  // Redirect to login page
  window.location.href = "index.html";
}

