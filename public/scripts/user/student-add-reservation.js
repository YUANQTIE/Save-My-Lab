var userId;
var building;
var room;
var reservationDate;
var reservationStartMinute;
var reservationStartHour;
var reservationEndMinute;
var reservationEndHour;
var reservationStartTimeStamp;
var reservationEndTimeStamp;
var seats = [];
var anonymous;



$(document).ready(function () {
    function weekView() {
        let today = new Date();
        let nextWk = new Date();
        nextWk.setDate(today.getDate() + 7);
        today = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
        nextWk = `${nextWk.getFullYear()}-${(nextWk.getMonth() + 1).toString().padStart(2, '0')}-${nextWk.getDate().toString().padStart(2, '0')}`;

        console.log(today);
        console.log(nextWk);

        $("#dateInput").attr('min', today);
        $("#dateInput").attr('max', nextWk);
    }

    $(".seat").addClass("gray")


    $("#venueInput").on("change", async function (e) {
        try {
            $(".seat").removeClass("red blue gray cursor-pointer selected");
            building = $(this).val().trim();

            console.log("Selected venue:", building);

            const roomSelect = $("#roomInput");
            roomSelect.empty();

            const roomsInBuildings = await fetch(`/room/building/room-names?buildingName=${building}`)
            const roomsInBuildingsJ = await roomsInBuildings.json()

            roomSelect.append('<option value="" disabled selected>Input Room...</option>');

            roomsInBuildingsJ.forEach(room => {
                roomSelect.append(`<option value="${room.room_name}">${room.room_name}</option>`);
            });

            if (building === "Gokongwei Building") {
                $("#goks").removeClass("hidden")
                $("#ls, #yuch, #andrew, #default").addClass("hidden")
            }

            if (building === "St. La Salle Hall") {
                $("#ls").removeClass("hidden")
                $("#goks, #yuch, #andrew, #default").addClass("hidden")
            }

            if (building === "Don Enrique T. Yuchengco Hall") {
                $("#yuch").removeClass("hidden")
                $("#goks, #ls, #andrew, #default").addClass("hidden")
            }

            if (building === "Br. Andrew Gonzales Hall") {
                $("#andrew").removeClass("hidden")
                $("#goks, #ls, #yuch, #default").addClass("hidden")
            }

            console.log(roomsInBuildingsJ)

            $("#room").removeClass("hidden");

        } catch (err) {
            console.error("Error:", err);
            alert("An error occurred. Check the F12 console.");
        }
    });

    $("#roomInput").on("change", async function (e) {
        $(".seat").removeClass("red blue gray cursor-pointer selected");
        weekView()
        try {
            room = $(this).val().trim();

            console.log("Selected room:", room);

            $("#date").removeClass("hidden");

        } catch (err) {
            console.error("Error:", err);
            alert("An error occurred. Check the F12 console.");
        }
    });

    $("#dateInput").on("change", async function (e) {
        $(".seat").removeClass("red blue gray cursor-pointer selected");
        try {
            reservationDate = $(this).val().trim();

            console.log("Selected date:", reservationDate);

            $("#time").removeClass("hidden");

        } catch (err) {
            console.error("Error:", err);
            alert("An error occurred. Check the F12 console.");
        }
    });


    function checkTimeInputs() {
        if ($("#startHourInput").val() && $("#startMinuteInput").val() && $("#endHourInput").val() && $("#endMinuteInput").val()) {
            reservationStartHour = $("#startHourInput").val().trim();
            reservationStartMinute = $("#startMinuteInput").val().trim();
            reservationEndHour = $("#endHourInput").val().trim();
            reservationEndMinute = $("#endMinuteInput").val().trim();

            console.log(reservationStartHour, ":", reservationStartMinute, reservationEndHour, ":", reservationEndMinute)

            $(".seat").removeClass("gray")

            reservationStartTimeStamp = reservationDate + "T" + reservationStartHour + ":" + reservationStartMinute + ":00.000";
            reservationEndTimeStamp = reservationDate + "T" + reservationEndHour + ":" + reservationEndMinute + ":00.000";

        }

        else {
            $("#confirmBtn").prop("disabled", true);
        }
    }

    function assignSeatIds(seatArray) {
        $(".seat").removeClass("red blue gray cursor-pointer selected");
        $(".room-wrapper").addClass("seats-enabled");
        if (building === "Gokongwei Building") {
            $("#goks .seat").each(function (index) {
                const seatInfo = seatArray[index];

                console.log(this, seatInfo)

                if (seatInfo) {
                    $(this).attr("id", seatInfo._id);
                    $(this).attr("data-name", seatInfo.seat_name);
                    if (seatInfo.reservedBy) {
                        $(this).attr("title", `Seat ${seatInfo.seat_name}; reserved by ${seatInfo.reservedBy}`);
                    }
                    else {
                        $(this).attr("title", `Seat ${seatInfo.seat_name}`);
                    }

                    if (seatInfo.status === "reserved") {
                        $(this).addClass("red")
                    }
                    else if (seatInfo.status === "broken") {
                        $(this).addClass("blue")
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

                console.log(this, seatInfo)

                if (seatInfo) {
                    $(this).attr("id", seatInfo._id);
                    $(this).attr("data-name", seatInfo.seat_name);
                    if (seatInfo.reservedBy) {
                        $(this).attr("title", `Seat ${seatInfo.seat_name}; reserved by ${seatInfo.reservedBy}`);
                    }
                    else {
                        $(this).attr("title", `Seat ${seatInfo.seat_name}`);
                    }

                    if (seatInfo.status === "reserved") {
                        $(this).addClass("red")
                    }
                    else if (seatInfo.status === "broken") {
                        $(this).addClass("blue")
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

                console.log(this, seatInfo)

                if (seatInfo) {
                    $(this).attr("id", seatInfo._id);
                    $(this).attr("data-name", seatInfo.seat_name);
                    if (seatInfo.reservedBy) {
                        $(this).attr("title", `Seat ${seatInfo.seat_name}; reserved by ${seatInfo.reservedBy}`);
                    }
                    else {
                        $(this).attr("title", `Seat ${seatInfo.seat_name}`);
                    }

                    if (seatInfo.status === "reserved") {
                        $(this).addClass("red")
                    }
                    else if (seatInfo.status === "broken") {
                        $(this).addClass("blue")
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

                console.log(this, seatInfo)

                if (seatInfo) {
                    $(this).attr("id", seatInfo._id);
                    $(this).attr("data-name", seatInfo.seat_name);
                    if (seatInfo.reservedBy) {
                        $(this).attr("title", `Seat ${seatInfo.seat_name}; reserved by ${seatInfo.reservedBy}`);
                    }
                    else {
                        $(this).attr("title", `Seat ${seatInfo.seat_name}`);
                    }

                    if (seatInfo.status === "reserved") {
                        $(this).addClass("red")
                    }
                    else if (seatInfo.status === "broken") {
                        $(this).addClass("blue")
                    }
                    else {
                        $(this).addClass("cursor-pointer")
                    }

                }
            });
        }

    }


    $("#Input, #roomInput, #dateInput, #startHourInput, #startMinuteInput, #endHourInput, #endMinuteInput").on("change", async function () {
        checkTimeInputs();

        if (reservationStartTimeStamp && reservationEndTimeStamp) {
            const seatStatuses = await fetch(`/room/seat-status?timeStart=${reservationStartTimeStamp}&timeEnd=${reservationEndTimeStamp}&roomName=${room}`);
            const seatStatusesJson = await seatStatuses.json();

            console.log(seatStatusesJson);

            assignSeatIds(seatStatusesJson)
        }

    });

    function openConfirmModal() {
        if (!confirmModal) return;
        confirmModal.classList.remove("hidden");
    }

    function closeConfirmModal() {
        if (!confirmModal) return;
        confirmModal.classList.add("hidden");
    }


    $(document).on("click", ".seat.cursor-pointer", function () {
        $(this).toggleClass("green");

        const seatId = $(this).attr("id");
        const seatName = $(this).attr("data-name");

        if ($(this).hasClass("green")) {
            seats.push({ id: seatId });
            console.log("Selected:", seatName);
        }
        else {
            seats = seats.filter(s => s.id !== seatId);
            console.log("Deselected:", seatName);
        }

        if (seats.length > 0) {
            $("#confirmBtn").prop("disabled", false);
        }
        else {
            $("#confirmBtn").prop("disabled", true);
        }



        console.log(seats)
    });

    $("#confirmBtn").on("click", function (e) {
        e.preventDefault();
        console.log("OPENING MODAL");
        $("#confirmModal").removeClass("hidden");
    });

    $(".close-confirm").on("click", function () {
        $("#confirmModal").addClass("hidden");
    });



});