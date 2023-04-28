// Open a connection to the database
const db = openDatabase('lms', '1.0', 'My Database', 2 * 1024 * 1024);

// Create the users table if it doesn't exist
db.transaction(function (tx) {
  tx.executeSql('CREATE TABLE IF NOT EXISTS user (id INTEGER PRIMARY KEY AUTOINCREMENT, fname, lname,email,password)');
});

// Function to add a new user to the database
// Function to add a new user to the database
function addUser(event) {
  event.preventDefault();

  const fname = document.getElementById('fname').value;
  const lname = document.getElementById('lname').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // Validate input
  if (!fname || !lname|| !email||!password) {
    alert('Please fill in all fields.');
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    alert('Please enter a valid email address.');
    return;
  }
  if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(password)) {
    alert('Please enter a password that is at least 8 characters long and contains at least one uppercase letter, one lowercase letter, and one number.');
    return;
  }


  // Check if email address already exists in the database
  db.transaction(function (tx) {
    tx.executeSql('SELECT * FROM user WHERE email = ?', [email], function (tx, results) {
      if (results.rows.length > 0) {
        alert('Email address already exists.');
      } else {
        // Add contact to database
        db.transaction(function (tx) {
          tx.executeSql('INSERT INTO user (fname,lname, email,password) VALUES (?, ?, ?,?)', [fname,lname, email,password], function () {
            alert('Signup successfully!');
            document.getElementById('user-form').reset();
            getUsers();
          }, function (tx, error) {
            alert('An error occurred while adding the contact.');
          });
        });
        
      }
    });
  });
  // window.location.href = "issue.html";
  
}
// // Function to get all users from the database and display them in a list
function getUsers() {
  db.transaction(function (tx) {
    tx.executeSql('SELECT * FROM user', [], function (tx, results) {
      const userList = document.getElementById('user-list');
      userList.innerHTML = '';

      for (let i = 0; i < results.rows.length; i++) {
        const user = results.rows.item(i);
        const listItem = document.createElement('li');
        listItem.textContent = user.name + ' (' + user.email + ')';
        userList.appendChild(listItem);
      }
    });
  });
}

// Display the initial list of users
getUsers();



