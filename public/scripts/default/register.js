var email;
var pw1;
var pw2;
var id_number;


$(document).ready(function() {
    $("#firstBtn").on("click", async function(e) {
        const containsWhitespace = str => /\s/.test(str);

        email = $("#emailInput").val().trim();
        id_number = Number($("#idNumberInput").val().trim());

        if (email.length === 0){
            $("#errMes1").text("Please input a valid DLSU email");
            $("#emailInput").addClass("border-red-500");
            return
        }

        if (id_number.length === 0 || isNaN(id_number)){
            $("#errMes1").text("Please input a valid ID Number");
            $("#idNumberInput").addClass("border-red-500");
            return
        }

        const isIdNumberInvalidCheck = await fetch(`/user/idNumberCheck?idNumber=${id_number}`);
        const isEmailInvalidCheck = await fetch(`/user/emailCheck?email=${email}`);

        const isIdNumberInvalid = await isIdNumberInvalidCheck.json()
        const isEmailInvalid = await isEmailInvalidCheck.json()


        if (containsWhitespace(email) || !email.toLowerCase().endsWith("@dlsu.edu.ph")) {
            $("#errMes1").text("Please input a valid DLSU email");
            $("#emailInput").addClass("border-red-500");
            return
        }

        if (isEmailInvalid){
            $("#errMes1").text("User is already registed");
            $("#emailInput").addClass("border-red-500");
            return
        }

        if (isNaN(id_number) || id_number.toString().length !== 8 || id_number.toString()[0] !== '1') {
            $("#errMes1").text("Please input a valid 8-digit number that starts with 1");
            $("#idNumberInput").addClass("border-red-500");
            return
        }

        if (isIdNumberInvalid){
            $("#errMes1").text("User is already registed");
            $("#idNumberInput").addClass("border-red-500");
            return
        }
        
        $("#first").addClass("hidden");
        $("#second").removeClass("hidden");
    });

    $("#secondBtn").on("click", async function(e) {

        pw1 = $("#pw1Input").val().trim();
        pw2 = $("#pw2Input").val().trim();

        const containsWhitespace = str => /\s/.test(str);

        try {

            if (pw1 === pw2){

                if (pw1.length < 8){
                    $("#errMes2").text("Password must have minimum 8 characters")
                    $("#pw1Input, #pw2Input").addClass("border-red-500");
                    return
                }

                if (containsWhitespace(pw1)){
                    $("#errMes2").text("Password must have no whitespaces")
                    $("#pw1Input, #pw2Input").addClass("border-red-500");
                    return
                }
                
            }
            else{
                $("#pw1Input, #pw2Input").addClass("border-red-500");
                $("#errMes2").text("Passwords are not the same.");
                return
            }
            

        } catch (err) {
            console.error("Login Error:", err);
        }

        $("#second").addClass("hidden");
        $("#third").removeClass("hidden");
    });

    const defaultImg = "/images/user.png";

    $("#uploadBtn").on("click", function() {
        $("#profilePicInput").click();
    });

    $("#profilePicInput").on("change", function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                $("#previewImg").attr("src", e.target.result);
                $("#removePicBtn").removeClass("hidden");
            };
            reader.readAsDataURL(file);
        }
    });

    $("#removePicBtn").on("click", function() {
        $("#previewImg").attr("src", defaultImg);
        
        $("#profilePicInput").val("");
        
        $(this).addClass("hidden");
    });

    $("#usernameInput").on("input", function() {
        const charCount = $(this).val().length;
        $("#unCharCount").text(`${charCount}/20`);

        if (charCount > 20) {
            $("#unCharCount").addClass("text-red-500");
            $("#usernameInput").addClass("border-red-500");
        } else {
            $("#unCharCount").removeClass("text-red-500");
        }
    });

    $("#bioInput").on("input", function() {
        const charCount = $(this).val().length;
        $("#bioCharCount").text(`${charCount}/60`);

        if (charCount > 60) {
            $("#bioCharCount").addClass("text-red-500");
            $("#bioInput").addClass("border-red-500");
        } else {
            $("#bioCharCount").removeClass("text-red-500");
        }
    });

    $("#thirdBtn").on("click", async function(e) {
        e.preventDefault();
        const username = $("#usernameInput").val().trim();
        const bio = $("#bioInput").val().trim();
        const fileInput = document.getElementById('profilePicInput');

        const containsWhitespace = str => /\s/.test(str);
        
        try {

            const isUsernameInvalidCheck = await fetch(`/user/usernameCheck?username=${username}`);
            const isUsernameInvalid = await isUsernameInvalidCheck.json()

            if (username.length === 0){
                $("#errMes3").text("Please input a username");
                $("#usernameInput").addClass("border-red-500");
                return
            }

            if (username.length > 20){
                $("#errMes3").text("Username exceeds 20 characters");
                $("#usernameInput").addClass("border-red-500");
                return
            }

            if (isUsernameInvalid){
                $("#errMes3").text("Username is already in use");
                $("#usernameInput").addClass("border-red-500");
                return
            }
            
            if (containsWhitespace(username)){
                $("#errMes3").text("Username should not have whitespace.");
                $("#usernameInput").addClass("border-red-500");
                return
            }

            if (bio.length > 60){
                $("#errMes3").text("Bio exceeds 60 characters");
                $("#bioInput").addClass("border-red-500");
                return
            }
            
            const formData = new FormData();
            formData.append("username", username);
            formData.append("bio", bio);
            
            if (fileInput.files.length > 0) {
                formData.append("profile_picture", fileInput.files[0]);
            }

            formData.append("email", email);
            formData.append("password", pw1); 
            formData.append("id_number", id_number);
            formData.append("last_login", NaN);

            const response = await fetch("/user/add", {
                method: "POST",
                body: formData
            });

            if (response.ok) {
                alert("User registered successfully.");
                window.location.href = "/";
            }
        } catch (err) {
            console.error("Registration Error:", err);
        }
    });

});