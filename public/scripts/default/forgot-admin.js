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

    $("#emailBtn").on("click", async function(e) {
        e.preventDefault();

        const emailInput = $("#emailInput").val().trim();

        try {
            const response = await fetch(`/admin/forgot?email=${emailInput}`);

            if (!response.ok) {
                const errorData = await response.json();
                $("#errMes").text(errorData.message);
                $("#emailInput").addClass("border-red-500");
                return;
            }

            const data = await response.json(); 
            editPwId = data._id;

            $("#pw1, #pw2, #newPw").removeClass("hidden");
            $("#emailBtn").addClass("hidden");

        } catch (err) {
            console.error("Fetch Error:", err);
        }
    });

    $("#newPwBtn").on("click", async function(e) {
        e.preventDefault();

        const pw1Input = $("#pw1Input").val().trim();
        const pw2Input = $("#pw2Input").val().trim();

        try {

            if (pw1Input === pw2Input){
                const res = await fetch(`/admin/edit/password?originalId=${editPwId}`, {
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
});