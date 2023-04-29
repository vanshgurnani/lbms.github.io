
// Open a connection to the database
const db = openDatabase('lms', '1.0', 'My Database', 2 * 1024 * 1024);

// Create the contact table if it doesn't exist
db.transaction(function (tx) {
  tx.executeSql('CREATE TABLE IF NOT EXISTS feeds (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT , email TEXT ,feedback TEXT)');


});

// Function to add a new contact to the database

function addFeedback(event) {
    event.preventDefault();
  
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const feedback = document.getElementById('feedback').value;
  
    if (!name || !email ||!feedback) {
      console.log('Please fill in all fields in Feedback Form');
      alert('Please fill in all fields in Feedback Form');
      return;
    }
  
    db.transaction(function (tx) {
      // Check if feedback already exists in feedback table
      tx.executeSql('SELECT * FROM feeds WHERE email = ?', [email], function (tx, results) {
        if (results.rows.length > 0) {
          console.log('This Email has already submitted feedback.');
          alert('This Email has already submitted feedback.');
          return;
        }
  
        // If feedback does not exist, insert new record
        tx.executeSql('INSERT INTO feeds (name, email,feedback) VALUES (?, ?,?)', [name, email,feedback], function () {
          console.log('Feedback submitted successfully!');
          alert('Feedback submitted successfully!');
          document.getElementById('feedback-form').reset();
          getFeedback();
        });
      });
    });
  }
  



// Function to retrieve the contact from the database and populate the table
function getFeedback() {
  db.transaction(function (tx) {
    tx.executeSql('SELECT * FROM feeds', [], function (tx, results) {
      const issueTable = document.getElementById('feedback-table');
      issueTable.innerHTML = '';

      // Create table header
      const headerRow = document.createElement('tr');
      const nameHeader = document.createElement('th');
      nameHeader.textContent = 'Name';
      const emailHeader = document.createElement('th');
      emailHeader.textContent = 'Email';
      const feedHeader = document.createElement('th');
      feedHeader.textContent = 'Feedback';
      const actionsHeader = document.createElement('th');
      actionsHeader.textContent = 'Actions';
      headerRow.appendChild(nameHeader);
      headerRow.appendChild(emailHeader);
      headerRow.appendChild(feedHeader);
      headerRow.appendChild(actionsHeader);
      issueTable.appendChild(headerRow);

      // Create table rows
      for (let i = 0; i < results.rows.length; i++) {
        const contact = results.rows.item(i);
        const row = document.createElement('tr');
        const nameCell = document.createElement('td');
        nameCell.textContent = contact.name;
        const emailCell = document.createElement('td');
        emailCell.textContent = contact.email;
        const feedCell = document.createElement('td');
        feedCell.textContent = contact.feedback;
        const actionsCell = document.createElement('td');
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', function () {
          deleteFeedback(contact.id);
        });
        actionsCell.appendChild(deleteButton);
        row.appendChild(nameCell);
        row.appendChild(emailCell);
        row.appendChild(feedCell);
        row.appendChild(actionsCell);
        issueTable.appendChild(row);
      }
    });
  });
}


// Function to delete an contact from the database
function deleteFeedback(id) {
  db.transaction(function (tx) {
    tx.executeSql('DELETE FROM feeds WHERE id = ?', [id], function () {
      alert('Feedback deleted successfully!');
      getFeedback();
    });
  });
}

// Display the initial list of contact
getFeedback();


function logout() {
  // Clear session data
  sessionStorage.clear();

  alert("Logged out!");

  // Redirect to login page
  window.location.href = "index.html";
}

