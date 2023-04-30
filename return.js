
// Open a connection to the database
const db = openDatabase('lms', '1.0', 'My Database', 2 * 1024 * 1024);

// Create the return table if it doesn't exist
db.transaction(function (tx) {
  tx.executeSql('CREATE TABLE IF NOT EXISTS return (id INTEGER PRIMARY KEY AUTOINCREMENT, rdate DATE, bname TEXT, sno INTEGER)');
});


// Function to add a new return1 to the database
function addReturn(event) {
  event.preventDefault();

  const rdate = document.getElementById('rdate').value;
  const bname = document.getElementById('bname').value;
  const sno = document.getElementById('sno').value;

  if (!rdate||!bname||!sno) {
    alert('Please fill in all fields.');
    return;
  }

  const currentDate = new Date();
  const returnDate = new Date(rdate);
  if (returnDate < currentDate && returnDate.toDateString() !== currentDate.toDateString()) {
    alert('Return date cannot be before the current date.');
    return;
  } else if (returnDate > currentDate && returnDate.toDateString() !== currentDate.toDateString()) {
    alert('Return date cannot be in the future.');
    return;
  }

  db.transaction(function (tx) {
    tx.executeSql('INSERT INTO return (rdate, bname, sno) VALUES (?, ?, ?)', [rdate, bname, sno], function () {
      alert('Return added successfully!');
      document.getElementById('returnform').reset();
      getReturn();
    });
  });
}

// Function to retrieve the return from the database and populate the table
function getReturn() {
  db.transaction(function (tx) {
    tx.executeSql('SELECT * FROM return', [], function (tx, results) {
      const returnTable = document.getElementById('return-table');
      returnTable.innerHTML = '';

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
      returnTable.appendChild(headerRow);

      // Create table rows
      for (let i = 0; i < results.rows.length; i++) {
        const return1 = results.rows.item(i);
        const row = document.createElement('tr');
        const dateCell = document.createElement('td');
        dateCell.textContent = return1.rdate;
        const bookCell = document.createElement('td');
        bookCell.textContent = return1.bname;
        const snoCell = document.createElement('td');
        snoCell.textContent = return1.sno;
        const actionsCell = document.createElement('td');
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Return';
        deleteButton.addEventListener('click', function () {
          deleteIssue(return1.id);
        });
        actionsCell.appendChild(deleteButton);
        row.appendChild(dateCell);
        row.appendChild(bookCell);
        row.appendChild(snoCell);
        row.appendChild(actionsCell);
        returnTable.appendChild(row);
      }
    });
  });
}


// Function to delete an return1 from the database
function deleteIssue(id) {
  db.transaction(function (tx) {
    tx.executeSql('DELETE FROM return WHERE id = ?', [id], function () {
      alert('Return deleted successfully!');
      getReturn();
    });
  });
}

// Display the initial list of return
getReturn();


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

