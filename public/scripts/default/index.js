$(document).ready(function() {

    $("#changeToAdmin").on("click", async function(e) {
        $("#cardContainer1").addClass("hidden");
        $("#cardContainer2").removeClass("hidden");
    });

    $("#changeToUser").on("click", async function(e) {
        $("#cardContainer1").removeClass("hidden");
        $("#cardContainer2").addClass("hidden");
    });
    
    $("#loginUserBtn").on("click", async function(e) {
        e.preventDefault();

        const emailInput = $("#userEmailInput").val().trim();
        const passwordInput = $("#userPasswordInput").val().trim();

        console.log("Input Check:", emailInput, passwordInput);

        if (!emailInput || !passwordInput) {
            alert("Please enter both email and password");
            return;
        }

        try {
            const res1 = await fetch(`/user/verify/${emailInput}/${passwordInput}`);
            const isUser = await res1.json();

            if (isUser) {
                const usersRes = await fetch("/user/users");
                const users = await usersRes.json();
                const user = users.find(u => u.email === emailInput);

                window.location.href = `/user/landing?originalId=${user._id}`;
                return;
            }

            else{
                alert("No valid account found");
            }

        } catch (err) {
            console.error("Login Error:", err);
            alert("An error occurred. Check the F12 console.");
        }
    });

    $("#loginAdminBtn").on("click", async function(e) {
        e.preventDefault();

        const emailInput = $("#adminEmailInput").val().trim();
        const passwordInput = $("#adminPasswordInput").val().trim();

        console.log("Input Check:", emailInput, passwordInput);

        if (!emailInput || !passwordInput) {
            alert("Please enter both email and password");
            return;
        }

        try {
            const res2 = await fetch(`/admin/verify/${emailInput}/${passwordInput}`);
            const isAdmin = await res2.json();
            if (isAdmin) {
                const adminsRes = await fetch("/admin/admins");
                const admins = await adminsRes.json();
                const admin = admins.find(a => a.email === emailInput);


                window.location.href = `/admin/landing?id=${admin._id}`;
                return;
            }

            else{
                alert("No valid account found");
            }
            
        } catch (err) {
            console.error("Login Error:", err);
            alert("An error occurred. Check the F12 console.");
        }
    });

    $("#registerUserBtn").on("click", async function(e) {
        e.preventDefault();

        try {
            window.location.href = `/aux/register-user`

        } catch (err) {
            console.error("Login Error:", err);
            alert("An error occurred. Check the F12 console.");
        }
    });

    $("#forgotUserBtn").on("click", async function(e) {
        e.preventDefault();

        try {
            window.location.href = `/aux/forgot-user`

        } catch (err) {
            console.error("Login Error:", err);
            alert("An error occurred. Check the F12 console.");
        }
    });

    $("#registerAdminBtn").on("click", async function(e) {
        e.preventDefault();

        try {
            window.location.href = `/aux/register-admin`

        } catch (err) {
            console.error("Login Error:", err);
            alert("An error occurred. Check the F12 console.");
        }
    });

    $("#forgotAdminBtn").on("click", async function(e) {
        e.preventDefault();

        try {
            window.location.href = `/aux/forgot-admin`

        } catch (err) {
            console.error("Login Error:", err);
            alert("An error occurred. Check the F12 console.");
        }
    });

    $("#show_password_btn_user").on("click", async function(e) {
        e.preventDefault();
        const eyeIcons = $("#show_password_btn_user").find('path, line, circle');
        const type = $("#userPasswordInput").attr('type') === 'password' ? 'text' : 'password';
        $("#userPasswordInput").attr('type', type);

        eyeIcons.each(function() {
            if ($(this).hasClass('hs-password-active:hidden')) {
                $(this).toggleClass('hidden');
            } else if ($(this).hasClass('hs-password-active:block')) {
                $(this).toggleClass('hidden');
            }
        });
    });

    $("#show_password_btn_admin").on("click", async function(e) {
        e.preventDefault();
        const eyeIcons = $("#show_password_btn_admin").find('path, line, circle');
        const type = $("#adminPasswordInput").attr('type') === 'password' ? 'text' : 'password';
        $("#adminPasswordInput").attr('type', type);

        eyeIcons.each(function() {
            if ($(this).hasClass('hs-password-active:hidden')) {
                $(this).toggleClass('hidden');
            } else if ($(this).hasClass('hs-password-active:block')) {
                $(this).toggleClass('hidden');
            }
        });
    });
});