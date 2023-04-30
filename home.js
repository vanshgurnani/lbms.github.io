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
  