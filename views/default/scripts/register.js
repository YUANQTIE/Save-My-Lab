const Email = document.getElementById("Email");
const Pass1 = document.getElementById("Pass1");
const Pass2 = document.getElementById("Pass2");
const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", function(e) {
    e.preventDefault();

    if (Pass1.value === Pass2.value) {
        alert("Registration successful!");
        window.location.href = "index.html";
    } else {
        alert("Passwords do not match. Please try again.");
    }
});
