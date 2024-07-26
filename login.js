document.getElementById('loginForm').onsubmit = function() {
      let email = document.getElementById('email').value;
      let password = document.getElementById('password').value;
  
      if (email === "") {
          alert("Please enter your email.");
          return false;
      }
  
      if (password === "") {
          alert("Please enter your password.");
          return false;
      }
  
      // Replace the following hard-coded credentials with your own logic for validation
      let validEmail = "correctEmail@example.com"; // Example email
      let validPassword = "correctPassword"; // Example password
  
      if (email !== validEmail || password !== validPassword) {
          alert("Incorrect email or password.");
          return false;
      }
  
      return true;
  }
  