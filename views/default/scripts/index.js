const allowedEmails = [
    "yuan_miguel_panlilio@dlsu.edu.ph",
    "nigel_henry_so@dlsu.edu.ph",
    "princess_tullao@dlsu.edu.ph",
    "merry_ong@dlsu.edu.ph",
    "admin_one@dlsu.edu.ph",
    "admin_two@dlsu.edu.ph",
  ]; // right now, all students are redirected to the same page and all techs are redirected to the same page

const password = "password";

const loginForm = document.getElementById("loginForm");
const loginEmail = document.getElementById("loginEmail");
const loginPass = document.getElementById("loginPass");
const eye = document.getElementById("eye");

loginForm.addEventListener("submit", function(e) {
  e.preventDefault();

  const inputEmail = loginEmail.value.trim().toLowerCase();
  const inputPass = loginPass.value.trim().toLowerCase();
  const isAllowed = allowedEmails.includes(inputEmail);
  const isCorrectPassword = (inputPass === password);

  const isAdmin = (inputEmail === "admin_one@dlsu.edu.ph" || inputEmail === "admin_two@dlsu.edu.ph");

  if (isAllowed && isCorrectPassword) {
    if (isAdmin){
      window.location.href = "../lab/see-reservations.html";
    }
    else{
      window.location.href = "../user/user-profile.html";

    }
      
  } 
  else {
    alert("Invalid email or password.");
  }
});

eye.addEventListener("click", function () {
  const type = loginPass.getAttribute("type");

  if (type === "password") {
    loginPass.setAttribute("type", "text"); //converts the type to text
    eye.src = "../../images/eye-close.png";
  } 
  else {
    loginPass.setAttribute("type", "password"); //converts the type to pw, which browser hides into **
    eye.src = "../../images/eye-bukas.png";
  }
});