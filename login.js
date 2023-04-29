const passwordInput = document.getElementById('password');
const showPasswordCheckbox = document.getElementById('show-password');

showPasswordCheckbox.addEventListener('change', function () {
  if (showPasswordCheckbox.checked) {
    passwordInput.type = 'text';
  } else {
    passwordInput.type = 'password';
  }
});


// Open a connection to the database
const db = openDatabase('lms', '1.0', 'My Database', 2 * 1024 * 1024);

// Function to validate user credentials and redirect to the issue.html page if successful
function login(event) {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // Validate input
  if (!email || !password) {
    alert('Please fill in all fields.');
    return;
  }

  // Check if email address and password match in the database
  db.transaction(function (tx) {
    tx.executeSql('SELECT * FROM user WHERE email = ? AND password = ?', [email, password], function (tx, results) {
      if (results.rows.length > 0) {
        // Redirect to the issue.html page
        window.location.href = "home.html";
      } else {
        alert('Invalid email address or password.');
      }
    });
  });
}

// Add event listener for the login button
document.getElementById('login-form').addEventListener('submit', login);
