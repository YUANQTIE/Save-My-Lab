var building;
var room;
var date;
var hour;
var minute;
var seats;
var seat_names;
var currSeats;
var currSeatNames;
var resolvedSeatNames = [];
var seatsString
const loading1 = document.getElementById("loading1")
const loading2 = document.getElementById("loading2")

$(document).ready(async function () {
    $("#confirmBtn").prop("disabled", true);
    
    async function initalizeBrokenDocument(){
        const res = await fetch(`/broken/broken-info`)
        const brokenDoc = await res.json()

        initalizeInputValues(brokenDoc)
    }

    async function initalizeInputValues(brokenDoc){
        building = brokenDoc.building
        room = brokenDoc.room_name
        date = brokenDoc.broken_start_timestamp.substring(0, 10)
        hour = brokenDoc.broken_start_timestamp.substring(11, 13)
        minute = brokenDoc.broken_start_timestamp.substring(14, 16)
        seats = brokenDoc.seats
        seat_names = brokenDoc.seat_names
        currSeats = seats
        currSeatNames = seat_names

        $("#goks, #ls, #yuch, #andrew, #default").addClass("hidden");

        if (building === "Gokongwei Building") $("#goks").removeClass("hidden");
        else if (building === "St. La Salle Hall") $("#ls").removeClass("hidden");
        else if (building === "Don Enrique T. Yuchengco Hall") $("#yuch").removeClass("hidden");
        else if (building === "Br. Andrew Gonzales Hall") $("#andrew").removeClass("hidden");

        await getBrokensInRoom()
        showInitialInputValues()
    }

    function showInitialInputValues(){
        $("#venueInput").val(building)
        $("#roomInput").val(room)
        $("#dateInput").val(date)
        $("#startHourInput").val(hour)
        $("#startMinuteInput").val(minute)
    }

    async function getBrokensInRoom(){
        const res = await fetch(`/room/resolve?brokenSeats=${seats}&roomName=${room}`)
        const seatsWithStatus = await res.json()
        assignSeatIds(seatsWithStatus.seats)
    }

    function assignSeatIds(seatArray) {
        $(".room-wrapper").addClass("seats-enabled");
        if (building === "Gokongwei Building") {
            $("#goks .seat").each(function (index) {
                const seatInfo = seatArray[index];
                if (seatInfo) {
                    $(this).attr("id", seatInfo.seat_id);
                    $(this).attr("data-name", seatInfo.seat_name);
                    $(this).attr("title", `Seat ${seatInfo.seat_name}`);

                    if (seatInfo.status === "unselected") {
                        $(this).addClass("grey")
                    }

                    else if (seatInfo.status === "selected") {
                        $(this).addClass("green cursor-pointer selected")
                    }
                }
            });
        }

        if (building === "St. La Salle Hall") {
            $("#ls .seat").each(function (index) {
                const seatInfo = seatArray[index];

                if (seatInfo) {
                    $(this).attr("id", seatInfo.seat_id);
                    $(this).attr("data-name", seatInfo.seat_name);
                    $(this).attr("title", `Seat ${seatInfo.seat_name}`);

                    if (seatInfo.status === "unselected") {
                        $(this).addClass("grey")
                    }

                    else if (seatInfo.status === "selected") {
                        $(this).addClass("green cursor-pointer selected")
                    }
                }
            });
        }

        if (building === "Don Enrique T. Yuchengco Hall") {
            $("#yuch .seat").each(function (index) {
                const seatInfo = seatArray[index];

                if (seatInfo) {
                    $(this).attr("id", seatInfo.seat_id);
                    $(this).attr("data-name", seatInfo.seat_name);
                    $(this).attr("title", `Seat ${seatInfo.seat_name}`);

                    if (seatInfo.status === "unselected") {
                        $(this).addClass("grey")
                    }

                    else if (seatInfo.status === "selected") {
                        $(this).addClass("green cursor-pointer selected")
                    }
                }
            });
        }

        if (building === "Br. Andrew Gonzales Hall") {
            $("#andrew .seat").each(function (index) {
                const seatInfo = seatArray[index];
                if (seatInfo) {
                    $(this).attr("id", seatInfo.seat_id);
                    $(this).attr("data-name", seatInfo.seat_name);
                    $(this).attr("title", `Seat ${seatInfo.seat_name}`);

                    if (seatInfo.status === "unselected") {
                        $(this).addClass("grey")
                    }

                    else if (seatInfo.status === "selected") {
                        $(this).addClass("green cursor-pointer selected")
                    }
                }
            });
        }

    }

    $(document).on("click", ".seat.cursor-pointer", function () {
        $(this).toggleClass("green");

        const seatId = $(this).attr("id");
        const seatName = $(this).attr("data-name") || seatId;

        if ($(this).hasClass("green")) {
            if (!currSeats.includes(seatId)) currSeats.push(seatId);
            if (!currSeatNames.includes(seatName)) currSeatNames.push(seatName);
            resolvedSeatNames = resolvedSeatNames.filter(name => name !== seatName);
        } else {
            currSeats = currSeats.filter(id => id !== seatId);
            currSeatNames = currSeatNames.filter(name => name !== seatName);
            if (!resolvedSeatNames.includes(seatName)) resolvedSeatNames.push(seatName);
        }

        console.log(currSeats)

        if (currSeatNames.length > 0){
            $("#resolveBtn").addClass("hidden");
            $("#confirmBtn").removeClass("hidden");
            $("#confirmBtn").prop("disabled", currSeatNames.length === seat_names.length);
        }
            
        else{
            $("#confirmBtn").addClass("hidden");
            $("#resolveBtn").removeClass("hidden");
        }
    });

    $("#confirmBtn").on("click", function (e) {
        e.preventDefault();

        resolvedSeatNames.sort();
        seatsString = resolvedSeatNames.join(', ');

        $('#resConfirmVenue').text(building);
        $('#resConfirmRoom').text(room);
        $('#resConfirmDate').text(date);
        $('#resConfirmTime').text(hour + " : " + minute);
        $('#resConfirmSeats').text(seatsString);
        $("#confirmModal").removeClass("hidden");
    });

    $("#resolveBtn").on("click", function (e) {
        e.preventDefault();

        resolvedSeatNames.sort();
        seatsString = resolvedSeatNames.join(', ');

        $('#resResolveVenue').text(building);
        $('#resResolveRoom').text(room);
        $('#resResolveDate').text(date);
        $('#resResolveTime').text(hour + " : " + minute);
        $('#resResolveSeats').text(seatsString);
        $("#resolveModal").removeClass("hidden");
    });

    $(".close-confirm").on("click", function () {
        $("#confirmModal").addClass("hidden");
        $("#resolveModal").addClass("hidden");
    });

    function showLoader1() {
        loading1.style.setProperty('display', 'block', 'important');
        loading1.classList.remove('hidden');
    }

    function showLoader2() {
        loading2.style.setProperty('display', 'block', 'important');
        loading2.classList.remove('hidden');
    }

    $("#confirmOkay").on("click", async function () {
        const $btn = $(this);
        $("#confirmText").text("Processing...");
        showLoader1()

        try {
            const jason = {
                seats: currSeats,
            };

            const res = await fetch(`/broken/edit`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(jason)
            });

            if (res.ok) {
                setTimeout(() => {
                    $('#successConfirmVenue').text(building);
                    $('#successConfirmRoom').text(room);
                    $('#successConfirmDate').text(date);
                    $('#successConfirmTime').text(hour + " : " + minute);
                    $('#successConfirmSeats').text(seatsString);
                    $("#confirmModal").addClass("hidden");
                    $("#successConfirmModal").removeClass("hidden")
                }, 3000);
            }
            else {
                const errorText = await res.text();
                alert("Error: " + errorText);
                $btn.prop("disabled", false).text("OK");
            }
        } catch (err) {
            console.error("Fetch Error:", err);
            $btn.prop("disabled", false).text("OK");
        }
    });

    $("#resolveOkay").on("click", async function () {
        const $btn = $(this);
        $("#confirmText").text("Processing...");
        showLoader2()

        try {
             const res = await fetch(`/broken/delete`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
            });

            if (res.ok) {
                setTimeout(() => {
                    $('#successResolveVenue').text(building);
                    $('#successResolveRoom').text(room);
                    $('#successResolveDate').text(date);
                    $('#successResolveTime').text(hour + " : " + minute);
                    $('#successResolveSeats').text(seatsString);
                    $("#resolveModal").addClass("hidden");
                    $("#successResolveModal").removeClass("hidden")
                }, 3000);
            }
            else {
                const errorText = await res.text();
                alert("Error: " + errorText);
                $btn.prop("disabled", false).text("OK");
            }
        } catch (err) {
            console.error("Fetch Error:", err);
            $btn.prop("disabled", false).text("OK");
        }
    });

    $(".successConfirm").on("click", async function () {
        $("#successConfirmModal").addClass("hidden")
        $("#successResolveModal").addClass("hidden")

        window.location.href = `/admin/landing`
    });


    await initalizeBrokenDocument()
})