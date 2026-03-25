$(document).ready(function() {

    const urlParams = new URLSearchParams(window.location.search);
    const currentId = urlParams.get('originalId');

    console.log(currentId)

    $("#homepageBtn").on("click", async function(e) {
        e.preventDefault();

        try {
            window.location.href = `/user/landing?originalId=${currentId}`

        } catch (err) {
            console.error("Login Error:", err);
            alert("An error occurred. Check the F12 console.");
        }
    });

    $("#profileBtn").on("click", async function(e) {
        e.preventDefault();

        try {
            window.location.href = `/user/profile?originalId=${currentId}`

        } catch (err) {
            console.error("Login Error:", err);
            alert("An error occurred. Check the F12 console.");
        }
    });

    $("#reserveBtn").on("click", async function(e) {
        e.preventDefault();

        try {
            window.location.href = `/user/reserve?originalId=${currentId}`
        } catch (err) {
            console.error("Login Error:", err);
            alert("An error occurred. Check the F12 console.");
        }
    });

    $("#logoutBtn").on("click", async function(e) {
        e.preventDefault();

        try {
            window.location.href = `/`

        } catch (err) {
            console.error("Login Error:", err);
            alert("An error occurred. Check the F12 console.");
        }
    });
});