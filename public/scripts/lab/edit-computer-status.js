// get add seat status route but make it so that even yung mga red is clickable - CHECK
// there should be no date and time inputs. make it so that broken time stamp is always NOWWW!! - CHECK
// to get seats that are actually cancelled pala, find the intersection between seats of brokenid and reservationid
// make the broken record first
// make notification record for each reservationId, use the broken Id from the broken record that was just created
// mark every reservationIds in the in the reservationIds selected array as cancelled
// for admin or user view, open the modal if there are 

const queryString = window.location.search;
const url = new URLSearchParams(queryString);

const successModal = document.getElementById("successModal")
const successConfirm = document.getElementById("successConfirm")
const closeSuccessModal = document.getElementById("closeSuccessModal")
const loading = document.getElementById("loading")
var building;

function format(hour) {

    if (hour.length > 1){
        return hour
    }
    else{
        hour = Number(hour);
        if (hour < 10) {
            return '0' + hour;
        } else {
            return String(hour);
        }
    }

}

const currDate = new Date(Date.now()) 
const stringDate = currDate.toLocaleString()
var month = format(stringDate.substring(0,1));
var day = format(stringDate.substring(2,3));
var year = stringDate.substring(4,8);
var minute = stringDate.substring(13,15);
var hour = format(stringDate.substring(10,12));
const brokenStartTimeStamp = year + "-" + month + "-" + day  + "T" + hour + ":" + minute + ":00.000";
var EndTimeStamp = "2100-01-01T23:59:00.000";
var reason;
var room;
var seats = [];
var seat_names = [];
var reservationIds = [];
var isAnonymous = false;



$(document).ready(function () {

    function showLoader() {
        loading.style.setProperty('display', 'block', 'important');
        loading.classList.remove('hidden');
    }


    $(".seat").addClass("gray")

    $("#venueInput").on("change", async function (e) {
        try {

            $(".seat")
                .removeClass("red blue green cursor-pointer selected")
                .addClass("gray")
                .removeAttr("id")
                .removeAttr("data-name")
                .attr("title", "");

            room = "";
            $("#roomInput").val("")
            seats = [];
            seat_names = [];
            reservationIds = [];
            $("#confirmBtn").prop("disabled", true);

            building = $(this).val().trim();


            const roomSelect = $("#roomInput");
            roomSelect.empty();
            roomSelect.append('<option value="" disabled selected>Input Room...</option>');

            const roomsInBuildings = await fetch(`/room/building/room-names?buildingName=${building}`);
            const roomsInBuildingsJ = await roomsInBuildings.json();

            roomsInBuildingsJ.forEach(r => {
                roomSelect.append(`<option value="${r.room_name}">${r.room_name}</option>`);
            });

            $("#goks, #ls, #yuch, #andrew, #default").addClass("hidden");

            if (building === "Gokongwei Building") $("#goks").removeClass("hidden");
            else if (building === "St. La Salle Hall") $("#ls").removeClass("hidden");
            else if (building === "Don Enrique T. Yuchengco Hall") $("#yuch").removeClass("hidden");
            else if (building === "Br. Andrew Gonzales Hall") $("#andrew").removeClass("hidden");

            $("#room").removeClass("hidden");
            $(".seat").addClass("gray").removeClass("cursor-pointer green red blue");
            $("#confirmBtn").prop("disabled", true);

        } catch (err) {
            console.error("Error updating building:", err);
        }
    });

    $("#roomInput").on("change", async function (e) {
        $(".seat").removeClass("green selected").addClass("gray");
        try {
            seats = [];
            seat_names = [];
            reservationIds = [];

            $("#confirmBtn").prop("disabled", true);
            $(".seat").addClass("gray").removeClass("cursor-pointer green red blue");
            $("#reasonInput").removeClass("hidden")

            if ($("#venueInput").val() && $("#roomInput").val()) {
                room = $("#roomInput").val()
                if (EndTimeStamp > brokenStartTimeStamp) {
                    
                    console.log(stringDate)
                    console.log(hour, minute)
                    console.log(brokenStartTimeStamp)
                    const seatStatuses = await fetch(`/room/seat-status?timeStart=${brokenStartTimeStamp}&timeEnd=${EndTimeStamp}&roomName=${room}`);
                    const seatStatusesJson = await seatStatuses.json();

                    seatStatusesJson.sort((a, b) => {
                        return a.seat_name.localeCompare(b.seat_name);
                    });

                    assignSeatIds(seatStatusesJson);

                    $("#confirmBtn").prop("disabled", seats.length === 0);
                } else {
                    $(".seat").addClass("gray").removeClass("cursor-pointer green red blue");
                    $("#confirmBtn").prop("disabled", true);
                }
            } else {
                $(".seat").addClass("gray").removeClass("cursor-pointer green red blue");
                $("#confirmBtn").prop("disabled", true);
            }
        } catch (err) {
            console.error("Error:", err);
        }
    });


    function assignSeatIds(seatArray) {
        $(".seat").removeClass("gray red blue blue-500 red-500 green cursor-pointer selected").attr("title", "").removeAttr("id").removeAttr("data-name");
        $(".room-wrapper").addClass("seats-enabled");

        if (building === "Gokongwei Building") {
            $("#goks .seat").each(function (index) {
                const seatInfo = seatArray[index];

                if (seatInfo) {
                    $(this).attr("id", seatInfo._id);
                    $(this).attr("data-name", seatInfo.seat_name);
                    $(this).attr("status", seatInfo.status);
                    if (seatInfo.reservedBy) {
                        $(this).attr("title", `Seat ${seatInfo.seat_name}; reserved by ${seatInfo.reservedBys}`);
                    }
                    else {
                        $(this).attr("title", `Seat ${seatInfo.seat_name}`);
                    }

                    if (seatInfo.status === "broken") {
                        $(this).addClass("blue")
                    }
                    else if (seatInfo.status === "reserved") {
                        $(this).attr("resId", seatInfo.reservationIds);
                        $(this).addClass("red cursor-pointer")
                    }
                    else {
                        $(this).addClass("cursor-pointer")
                    }

                }
            });
        }

        if (building === "St. La Salle Hall") {
            $("#ls .seat").each(function (index) {
                const seatInfo = seatArray[index];

                if (seatInfo) {
                    $(this).attr("id", seatInfo._id);
                    $(this).attr("data-name", seatInfo.seat_name);
                    $(this).attr("status", seatInfo.status);
                    if (seatInfo.reservedBy) {
                        $(this).attr("title", `Seat ${seatInfo.seat_name}; reserved by ${seatInfo.reservedBys}`);
                    }
                    else {
                        $(this).attr("title", `Seat ${seatInfo.seat_name}`);
                    }

                    if (seatInfo.status === "broken") {
                        $(this).addClass("blue")
                    }
                    else if (seatInfo.status === "reserved") {
                        $(this).attr("resId", seatInfo.reservationIds);
                        $(this).addClass("red cursor-pointer")
                    }
                    else {
                        $(this).addClass("cursor-pointer")
                    }

                }
            });
        }

        if (building === "Don Enrique T. Yuchengco Hall") {
            $("#yuch .seat").each(function (index) {
                const seatInfo = seatArray[index];

                if (seatInfo) {
                    $(this).attr("id", seatInfo._id);
                    $(this).attr("data-name", seatInfo.seat_name);
                    $(this).attr("status", seatInfo.status);
                    if (seatInfo.reservedBy) {
                        $(this).attr("title", `Seat ${seatInfo.seat_name}; reserved by ${seatInfo.reservedBys}`);
                    }
                    else {
                        $(this).attr("title", `Seat ${seatInfo.seat_name}`);
                    }

                    if (seatInfo.status === "broken") {
                        $(this).addClass("blue")
                    }
                    else if (seatInfo.status === "reserved") {
                        $(this).attr("resId", seatInfo.reservationIds);
                        $(this).addClass("red cursor-pointer")
                    }
                    else {
                        $(this).addClass("cursor-pointer")
                    }

                }
            });
        }

        if (building === "Br. Andrew Gonzales Hall") {
            $("#andrew .seat").each(function (index) {
                const seatInfo = seatArray[index];

                if (seatInfo) {
                    $(this).attr("id", seatInfo._id);
                    $(this).attr("data-name", seatInfo.seat_name);
                    $(this).attr("status", seatInfo.status);
                    if (seatInfo.reservedBy) {
                        $(this).attr("title", `Seat ${seatInfo.seat_name}; reserved by ${seatInfo.reservedBys}`);
                    }
                    else {
                        $(this).attr("title", `Seat ${seatInfo.seat_name}`);
                    }

                    if (seatInfo.status === "broken") {
                        $(this).addClass("blue")
                    }
                    else if (seatInfo.status === "reserved") {
                        $(this).attr("resId", seatInfo.reservationIds);
                        $(this).addClass("red cursor-pointer")
                    }
                    else {
                        $(this).addClass("cursor-pointer")
                    }

                }
            });
        }

    }

    $(document).on("click", ".seat.cursor-pointer", function () {
        $(this).toggleClass("green");
        const seatId = $(this).attr("id");
        const seatName = $(this).attr("data-name") || seatId;
        const seatStatus= $(this).attr("status") || seatId;

        if ($(this).hasClass("green")) {
            seats.push(seatId);
            seat_names.push(seatName);

            if (seatStatus === "reserved"){
                const resId = $(this).attr("resId")
                reservationIds.push(resId);
            }
        }

        else {
            seats = seats.filter(id => id !== seatId);
            seat_names = seat_names.filter(s => s.id !== seatId);

            if (seatStatus === "reserved"){
                const resId = $(this).attr("resId");
                const index = reservationIds.indexOf(resId);
                if (index > -1) {
                    reservationIds.splice(index, 1); 
                }
            }
        }

        $("#confirmBtn").prop("disabled", seats.length === 0 || $("#reasonInput").val().length === 0);
    });

    $("#reasonInput").on("input", async function (e) {
        try {
            $("#confirmBtn").prop("disabled", seats.length === 0 || $("#reasonInput").val().length === 0)
        } catch (err) {
            console.error("Error:", err);
        }
    });

    $("#confirmBtn").on("click", function (e) {
        e.preventDefault();

        reason = $("#reasonInput").val().trim()
        seat_names.sort();
        seatsString = seat_names.join(', ');

        $('#resVenue').text(building);
        $('#resRoom').text(room);
        $('#resDate').text(year + "-" + month + "-" + day);
        $('#resTime').text(hour + " : " + minute);
        $('#resReason').text(reason);
        $('#resSeats').text(seatsString);
        $("#confirmModal").removeClass("hidden");
    });

    $(".close-confirm").on("click", function () {
        $("#confirmModal").addClass("hidden");
    });

    $("#confirmOkay").on("click", async function () {
        const $btn = $(this);
        $("#confirmText").text("Processing...");

        

        showLoader()
        
        // to get seats that are actually cancelled pala, find the intersection between seats of brokenid and reservationid
        // make the broken record first
        // CONSIDER THAT FOR ANY TIME, THERE CAN BE MORE THAN ONE RESERVATION FOR A CHAIR. SO MAKE A ROUTE IN WHICH IT WILL ALLOW FOR MULTIPLE RESERVATIONSIDS TO BE ASSIGNED TO A CHAIR
        // make notification record for each reservationId, use the broken Id from the broken record that was just created
        // mark every reservationIds in the in the reservationIds selected array as cancelled
        
        try {
            var flag = true
            const brokenJson = {
                seats: seats,
                brokenTimeStart: brokenStartTimeStamp,
                reason: reason
            };

            const res1 = await fetch(`/broken/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(brokenJson)
            });

            const brokenDoc = await res1.json()

            const currBrokenId = brokenDoc.brokenId;


            if (reservationIds.length > 0){
                var reservationIdsDupe = reservationIds.flatMap(entry => entry.split(','));
                var reservationIdsSet = new Set(reservationIdsDupe)
                let reservationIdsArray = Array.from(reservationIdsSet)        

                for (const reservationId of reservationIdsArray){
                    const res2 = await fetch(`/reservations/${reservationId}/cancel`, {
                        method: "PUT"
                    });

                    if (!res2.ok) {
                        console.error(`Failed to cancel reservation ${reservationId}`);
                        flag = false
                    }
                    
                    const notifJson = {
                        brokenId: currBrokenId,
                        reservationId: reservationId,
                    };

                    const res3 = await fetch(`/notif/add`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(notifJson)
                    });

                    if (!res3.ok) {
                        flag = false
                        console.error(`Failed to add notification doc`);
                    }
                }

            }

            if (flag) {
                setTimeout(() => {
                    $("#confirmModal").addClass("hidden");
                    $('#successVenue').text(building);
                    $('#successRoom').text(room);
                    $('#successDate').text(year + "-" + month + "-" + day);
                    $('#successTime').text(hour + " : " + minute);
                    $('#successReason').text(reason);
                    $('#successSeats').text(seatsString);
                    successModal.classList.remove("hidden")
                }, 3000);
            }
            else {
                alert("Error");
                $btn.prop("disabled", false).text("OK");
            }
        } catch (err) {
            console.error("Fetch Error:", err);
            $btn.prop("disabled", false).text("OK");
        }
    });
    
    closeSuccessModal.addEventListener('click', function (event) {
        successModal.classList.add("hidden")
        window.location.href = `/admin/landing`
    });
    successConfirm.addEventListener('click', function (event) {
        successModal.classList.add("hidden")

        window.location.href = `/admin/landing`
    });
})