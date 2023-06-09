
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
  // Check if issue date is after the current date
  const currentDate = new Date();
  const issueDate = new Date(idate);
  if (issueDate < currentDate && issueDate.toDateString() !== currentDate.toDateString()) {
    alert('Issue date cannot be before the current date.');
    return;
  } else if (issueDate > currentDate && issueDate.toDateString() !== currentDate.toDateString()) {
    alert('Issue date cannot be in the future.');
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

const searchButton = document.getElementById('search-button');
searchButton.addEventListener('click', search);


function search() {
  const searchInput = document.getElementById('search-input').value.toLowerCase();

  db.transaction(function (tx) {
    tx.executeSql('SELECT * FROM issues', [], function (tx, results) {
      let bookFound = false;
      
      // Check each issue for a match with the search query
      for (let i = 0; i < results.rows.length; i++) {
        const issue = results.rows.item(i);
        
        // Check if book name matches the search query
        if (issue.bname.toLowerCase().indexOf(searchInput) !== -1) {
          bookFound = true;
          
          // Display an alert with the book name and exit the loop
          alert(`Book found: ${issue.bname}`);
          break;
        }
      }

      // If no match was found, display a message to the user
      if (!bookFound) {
        alert(`No books found with name '${searchInput}'`);
      }
    });
  });
}




