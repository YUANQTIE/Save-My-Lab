$(document).ready(function() {

    var editPwId;

    $("#backBtn").on("click", async function(e) {
        e.preventDefault();

        try {
            window.location.href = `/`

        } catch (err) {
            console.error("Login Error:", err);
            alert("An error occurred. Check the F12 console.");
        }
    });


    $("#newPwBtn").on("click", async function(e) {
        e.preventDefault();

        const pw1Input = $("#pw1").val().trim();
        const pw2Input = $("#pw2").val().trim();

        try {

            if (pw1Input === pw2Input){
                console.log("sam smith")
                const res = await fetch(`/admin/edit/password`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        password: pw1Input      
                    })
                });

                const message = await res.text();

                if (message == "Admin password updated successfully"){
                    alert("Password updated successfully.")
                    window.location.href = `/`
                }
                if (message.length > 0 && message != "Admin password updated successfully"){
                    $("#errMes").text(message);
                }

            }
            else{
                $("#pw1Input, #pw2Input").addClass("border-red-500");
                $("#errMes").text("Passwords are not the same.");
            }
            

        } catch (err) {
            console.error("Login Error:", err);
        }
    });

    $("#show_password_btn_1").on("click", async function(e) {
        e.preventDefault();
        const eyeIcons = $("#show_password_btn_1").find('path, line, circle');
        const type = $("#pw1").attr('type') === 'password' ? 'text' : 'password';
        $("#pw1").attr('type', type);

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
        const type = $("#pw2").attr('type') === 'password' ? 'text' : 'password';
        $("#pw2").attr('type', type);

        eyeIcons.each(function() {
            if ($(this).hasClass('hs-password-active:hidden')) {
                $(this).toggleClass('hidden');
            } else if ($(this).hasClass('hs-password-active:block')) {
                $(this).toggleClass('hidden');
            }
        });
    });
});