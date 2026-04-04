var numNotifs;

$(document).ready(async function () {

    let notifications = [];
    let currentIndex = 0;

    async function getSelfUser(){
        const res = await fetch(`/user/self`)
        const user = await res.json()

        console.log(user)

        const un = user.username

        displayWelcomeMessage(un)
    }

    function displayWelcomeMessage(username){
        $("#welcome").text("Welcome, " + username + "!")
    }

    async function checkNotifications() {
        const res = await fetch(`/notif/notifs-user`);
        const notifsJson = await res.json();

        console.log(notifsJson);

        if (Array.isArray(notifsJson) && notifsJson.length > 0) {
            notifications = notifsJson;
            currentIndex = 0;
            showNotification();
        }

        else{
            $("#successModal").addClass("hidden");
            return;
        }
    }

    function showNotification() {
        if (currentIndex >= notifications.length) {
            $("#successModal").addClass("hidden");
            return;
        }

        const notif = notifications[currentIndex];

        var brokenSeats = notif.brokenSeats
        var reservationSeats = notif.reservationSeats
        const building = notif.building
        const roomName = notif.room_name
        const reason = notif.reason 
        const reservationStart = notif.reservationStart
        const reservationEnd = notif.reservationEnd
        const brokenTimestamp = notif.brokenTimestamp

        console.log(reservationStart)
        console.log(reservationEnd)
        console.log(brokenTimestamp)

        const resDate = reservationStart.substring(0,10)
        const resMinuteStart = reservationStart.substring(14,16)
        const resHourStart = reservationStart.substring(11,13)
        const resMinuteEnd= reservationEnd.substring(14,16)
        const resHourEnd = reservationEnd.substring(11,13)
        
        const brokenDate = brokenTimestamp.substring(0,10)
        const brokenMinuteStart = brokenTimestamp.substring(14,16)
        const brokenHourStart = brokenTimestamp.substring(11,13)

        var conflictSeats = brokenSeats.filter(seat => reservationSeats.includes(seat));

        conflictSeats.sort()
        reservationSeats.sort()

        conflictSeats = conflictSeats.join(', ')
        reservationSeats = reservationSeats.join(', ')

        console.log(building)
        console.log(roomName)
        console.log(reason)
        console.log(resDate)
        console.log(resHourStart + ":" + resMinuteStart + " - " + resHourEnd + ":" + resMinuteEnd)
        console.log(reservationSeats)
        console.log(conflictSeats)
        console.log("Computers In Conflict - will be unavailable from " + brokenDate + ", " + brokenHourStart + ":" + brokenMinuteStart)


        $("#venue").text(building)
        $("#room").text(roomName)
        $("#reason").text(reason)
        $("#date").text(resDate)
        $("#time").text(resHourStart + ":" + resMinuteStart + " - " + resHourEnd + ":" + resMinuteEnd)
        $("#seats").text(reservationSeats)
        $("#conflictSeats").text(conflictSeats)
        $("#unavail").text("Computers In Conflict - will be unavailable from " + brokenDate + ", " + brokenHourStart + ":" + brokenMinuteStart)

        $("#successModal").removeClass("hidden");
    }

    $("#successConfirm").on("click", async function () {
        const notif = notifications[currentIndex];
        const notifId = notif._id;

        const res2 = await fetch(`/notif/${notifId}/read`, {
            method: "PUT"
        });

        if (!res2.ok){
            console.log("MALIIIIIIIIIIIIIIIIIIIIIIIII")
        }

        currentIndex++;      
        showNotification();  
    });

    await getSelfUser()
    await checkNotifications();
});