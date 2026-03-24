$(document).ready(function() {
    console.log("Script Loaded and Ready");
    
    $("#loginBtn").on("click", async function(e) {
        e.preventDefault();

        const emailInput = $("#emailInput").val().trim();
        const passwordInput = $("#passwordInput").val().trim();

        console.log("Input Check:", emailInput, passwordInput);

        if (!emailInput || !passwordInput) {
            alert("Please enter both email and password");
            return;
        }

        try {
            const res1 = await fetch(`/user/${emailInput}/${passwordInput}`);
            const isUser = await res1.json();

            if (isUser) {
                const usersRes = await fetch("/user/users");
                const users = await usersRes.json();
                const user = users.find(u => u.email === emailInput);

                window.location.href = `/user/landing?id=${user._id}`;
                return;
            }

            const res2 = await fetch(`/admin/${emailInput}/${passwordInput}`);
            const isAdmin = await res2.json();
            if (isAdmin) {
                const adminsRes = await fetch("/admin/admins");
                const admins = await adminsRes.json();
                const admin = admins.find(a => a.email === emailInput);


                window.location.href = `/admin/landing?id=${admin._id}`;
                return;
            }
            console.log(isUser)
            alert("No valid account found"); //NEED TO MAKE THIS REFLECT IN INDEX.HTML

        } catch (err) {
            console.error("Login Error:", err);
            alert("An error occurred. Check the F12 console.");
        }
    });

    $("#registerBtn").on("click", async function(e) {
        e.preventDefault();

        try {
            window.location.href = `/aux/register`

        } catch (err) {
            console.error("Login Error:", err);
            alert("An error occurred. Check the F12 console.");
        }
    });

    $("#forgotBtn").on("click", async function(e) {
        e.preventDefault();

        try {
            window.location.href = `/aux/forgot`

        } catch (err) {
            console.error("Login Error:", err);
            alert("An error occurred. Check the F12 console.");
        }
    });

    $("#vsaBtn").on("click", async function(e) {
        e.preventDefault();

        try {
            window.location.href = `/aux/vsa`

        } catch (err) {
            console.error("Login Error:", err);
            alert("An error occurred. Check the F12 console.");
        }
    });

    $("#show_password_btn").on("click", async function(e) {
        e.preventDefault();
        const eyeIcons = $("#show_password_btn").find('path, line, circle');
        const type = $("#passwordInput").attr('type') === 'password' ? 'text' : 'password';
        $("#passwordInput").attr('type', type);

        eyeIcons.each(function() {
            if ($(this).hasClass('hs-password-active:hidden')) {
                $(this).toggleClass('hidden');
            } else if ($(this).hasClass('hs-password-active:block')) {
                $(this).toggleClass('hidden');
            }
        });
    });


});