var email;
var pw1;
var pw2;

const containsWhitespace = str => /\s/.test(str);

$(document).ready(function() {
    
    $("#backBtn1").on("click", async function(e) {
        e.preventDefault();

        try {
            window.location.href = `/`

        } catch (err) {
            console.error("Login Error:", err);
            alert("An error occurred. Check the F12 console.");
        }
    });
    
    $("#backBtn2").on("click", async function(e) {
        e.preventDefault();

        try {
            if (email){
                $("#emailInput").val(email);
            }

            $("#first").removeClass("hidden");
            $("#second").addClass("hidden");

        } catch (err) {
            console.error("Login Error:", err);
            alert("An error occurred. Check the F12 console.");
        }
    });

    $("#firstBtn").on("click", async function(e) {
        email = $("#emailInput").val().trim();

        if (containsWhitespace(email) || !email.endsWith("@dlsu.edu.ph")){
            $("#emailInput").addClass("border-red-500");
            $("#errMes1").text("Please input a valid DLSU email")
            return
        }

        const isUser = await fetch(`/user/emailCheck?email=${email}`) 
        const isAdmin = await fetch(`/admin/emailCheck?email=${email}`)

        const isActuallyUser = await isUser.json();
        const isActuallyAdmin = await isAdmin.json()
        const isEmailUsed = isActuallyUser || isActuallyAdmin;

        if (isEmailUsed){
            $("#errMes1").text("Email is already registed");
            $("#emailInput").addClass("border-red-500");
            return
        }

        $("#first").addClass("hidden");
        $("#second").removeClass("hidden");
    });

    $("#secondBtn").on("click", async function(e) {
        pw1 = $("#pw1Input").val().trim();
        pw2 = $("#pw2Input").val().trim();

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

                const formData = new FormData();
                formData.append("email", email);
                formData.append("password", pw1);

                const response = await fetch("/admin/add", {
                    method: "POST",
                    body: formData
                });

                if (response.ok) {
                    alert("Admin registered successfully.");
                    window.location.href = "/";
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
    });

    $("#show_password_btn_1").on("click", async function(e) {
        e.preventDefault();
        const eyeIcons = $("#show_password_btn_1").find('path, line, circle');
        const type = $("#pw1Input").attr('type') === 'password' ? 'text' : 'password';
        $("#pw1Input").attr('type', type);

        eyeIcons.each(function() {
            if ($(this).hasClass('hs-password-active:hidden')) {
                $(this).toggleClass('hidden');
            } else if ($(this).hasClass('hs-password-active:block')) {
                $(this).toggleClass('hidden');
            }
        });
    });

    $("#show_password_btn_2").on("click", async function(e) {
        e.preventDefault();
        const eyeIcons = $("#show_password_btn_2").find('path, line, circle');
        const type = $("#pw2Input").attr('type') === 'password' ? 'text' : 'password';
        $("#pw2Input").attr('type', type);

        eyeIcons.each(function() {
            if ($(this).hasClass('hs-password-active:hidden')) {
                $(this).toggleClass('hidden');
            } else if ($(this).hasClass('hs-password-active:block')) {
                $(this).toggleClass('hidden');
            }
        });
    });
});