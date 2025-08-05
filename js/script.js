const showSignInBtn = document.getElementById('showSignIn');
const showSignUpBtn = document.getElementById('showSignUp');
const signInForm = document.getElementById('signInForm');
const signUpForm = document.getElementById('signUpForm');

showSignInBtn.addEventListener('click', () => {
  signInForm.style.display = 'block';
  signUpForm.style.display = 'none';
  showSignInBtn.classList.add('active');
  showSignUpBtn.classList.remove('active');
});

showSignUpBtn.addEventListener('click', () => {
  signInForm.style.display = 'none';
  signUpForm.style.display = 'block';
  showSignUpBtn.classList.add('active');
  showSignInBtn.classList.remove('active');
});


function getUsers() {
  return JSON.parse(localStorage.getItem('users') || '[]');
}


function saveUsers(users) {
  localStorage.setItem('users', JSON.stringify(users));
}


signUpForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const username = document.getElementById('signup-username').value.trim();
  const email = document.getElementById('signup-email').value.trim();
  const password = document.getElementById('signup-password').value.trim();

  if(username === "" || email === "" || password === "") {
    alert("Please fill in all fields.");
    return;
  }

  let users = getUsers();
  if(users.find(u => u.username === username)) {
    alert("Username already exists!");
    return;
  }

  users.push({ username, email, password });
  saveUsers(users);

  alert("Registration successful! You can now sign in.");
  signUpForm.reset();

  showSignInBtn.click();
});


signInForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const username = document.getElementById('signin-username').value.trim();
  const password = document.getElementById('signin-password').value.trim();

  if(username === "" || password === "") {
    alert("Please fill in all fields.");
    return;
  }

  let users = getUsers();
  let user = users.find(u => u.username === username && u.password === password);
  if(!user) {
    alert("Invalid username or password!");
    return;
  }


  localStorage.setItem('currentUser', JSON.stringify(user));

  console.log("User signed in:", username);
  window.location.href = "home.html";
});
