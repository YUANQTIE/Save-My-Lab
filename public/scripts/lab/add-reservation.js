const queryString = window.location.search;
const url = new URLSearchParams(queryString);
const adminId = url.get('id');
const successModal = document.getElementById("successModal")
const successConfirm = document.getElementById("successConfirm")
const closeSuccessModal = document.getElementById("closeSuccessModal")
const dateInput = document.getElementById("dateInput")
const startHourInput = document.getElementById("startHourInput")
const startMinuteInput = document.getElementById("startMinuteInput")
const endHourInput = document.getElementById("endHourInput")
const endMinuteInput = document.getElementById("endMinuteInput")
const loading = document.getElementById("loading")
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
var seat_names = [];
var isAnonymous = false;



$(document).ready(function () {
    function showLoader() {
        loading.style.setProperty('display', 'block', 'important');
        loading.classList.remove('hidden');
    }

    function format(hour) {
        if (hour < 10) {
            return '0' + hour
        }
        else
            return hour
    }

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

            $(".seat")
                .removeClass("red blue green cursor-pointer selected")
                .addClass("gray")
                .removeAttr("id")
                .removeAttr("data-name")
                .attr("title", "");

            room = "";
            seats = [];
            seat_names = [];
            $("#confirmBtn").prop("disabled", true);

            building = $(this).val().trim();
            console.log("Building changed to:", building);


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
            $("#confirmBtn").prop("disabled", true);

        } catch (err) {
            console.error("Error updating building:", err);
        }
    });

    $("#roomInput").on("change", async function (e) {
        $(".seat").removeClass("green selected").addClass("gray");
        weekView();
        try {
            room = $(this).val().trim();
            seats = [];
            seat_names = [];

            $("#confirmBtn").prop("disabled", true);

            console.log("Selected room:", room);
            $("#date").removeClass("hidden");
        } catch (err) {
            console.error("Error:", err);
        }
    });

    $("#dateInput").on("change", async function (e) {
        $(".seat").attr("class", "seat");
        try {
            reservationDate = $(this).val().trim();
            seats = [];
            seat_names = [];
            console.log("Selected date:", reservationDate);
            $("#time").removeClass("hidden");
            $("#confirmBtn").prop("disabled", true);

        } catch (err) {
            console.error("Error:", err);
            alert("An error occurred. Check the F12 console.");
        }
    });


    function checkTimeInputs() {
        if ($("#startHourInput").val() && $("#startMinuteInput").val() && !$("#endHourInput").val()) {
            console.log("CALLED DISPLAYENDHOURS")
            displayEndHourInputs(parseInt($("#startHourInput").val().trim()), $("#startMinuteInput").val().trim())
        }
        if ($("#startHourInput").val() && $("#startMinuteInput").val() && $("#endHourInput").val() && !$("#endMinuteInput").val()) {
            console.log("CALLED DISPLAYENDMINUTES")
            displayEndMinuteInputs(parseInt($("#startHourInput").val()), parseInt($("#endHourInput").val()))
        }
        if ($("#startHourInput").val() && $("#startMinuteInput").val() && $("#endHourInput").val() && $("#endMinuteInput").val()) {
            reservationStartHour = $("#startHourInput").val().trim();
            reservationStartMinute = $("#startMinuteInput").val().trim();
            reservationEndHour = $("#endHourInput").val().trim();
            reservationEndMinute = $("#endMinuteInput").val().trim();

            seats = [];
            seat_names = [];

            console.log(reservationStartHour, ":", reservationStartMinute, reservationEndHour, ":", reservationEndMinute)

            $(".seat").removeClass("gray")

            reservationStartTimeStamp = reservationDate + "T" + reservationStartHour + ":" + reservationStartMinute + ":00.000";
            reservationEndTimeStamp = reservationDate + "T" + reservationEndHour + ":" + reservationEndMinute + ":00.000";
        }
    }

    function assignSeatIds(seatArray) {
        $(".seat").removeClass("gray red blue blue-500 red-500 green cursor-pointer selected").attr("title", "").removeAttr("id").removeAttr("data-name");
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

    $("#startHourInput, #startMinuteInput").on("input", async function () {
        endHourInput.innerHTML = `<option value="" disabled selected>--</option>`
        endMinuteInput.innerHTML = `<option value="" disabled selected>--</option>`

    });

    $("#venueInput, #roomInput, #dateInput").on("input", async function () {
        startHourInput.innerHTML = `<option value="" disabled selected>--</option>`
        startMinuteInput.innerHTML = `<option value="" disabled selected>--</option>`
        displayStartTimeInputs()
        endHourInput.innerHTML = `<option value="" disabled selected>--</option>`
        endMinuteInput.innerHTML = `<option value="" disabled selected>--</option>`
    });

    $("#venueInput, #roomInput, #dateInput, #startHourInput, #startMinuteInput, #endHourInput, #endMinuteInput").on("input", async function () {
        checkTimeInputs();
        if (reservationStartTimeStamp && reservationEndTimeStamp && building && room) {
            if (reservationEndTimeStamp > reservationStartTimeStamp) {
                const seatStatuses = await fetch(`/room/seat-status?timeStart=${reservationStartTimeStamp}&timeEnd=${reservationEndTimeStamp}&roomName=${room}`);
                const seatStatusesJson = await seatStatuses.json();

                assignSeatIds(seatStatusesJson);

                $("#endHourInput, #endMinuteInput").removeClass("border-red-600");
                $("#confirmBtn").prop("disabled", seats.length === 0);
            } else {
                
                //$("#endHourInput, #endMinuteInput").addClass("border-red-600").val("");
                $(".seat").addClass("gray").removeClass("cursor-pointer green red blue");
                $("#confirmBtn").prop("disabled", true);
            }
        } else {
            $(".seat").addClass("gray").removeClass("cursor-pointer green red blue");
            $("#confirmBtn").prop("disabled", true);
        }
    });

    $(document).on("click", ".seat.cursor-pointer", function () {
        $(this).toggleClass("green");
        const seatId = $(this).attr("id");
        const seatName = $(this).attr("data-name") || seatId;

        if ($(this).hasClass("green")) {
            seats.push(seatId);
            seat_names.push({ id: seatId, seat_name: seatName });
            console.log("Selected:", seatName);
        }
        else {
            seats = seats.filter(id => id !== seatId);
            seat_names = seat_names.filter(s => s.id !== seatId);
            console.log("Deselected:", seatName);
        }
        seat_names.sort((a, b) => {
            return a.seat_name.localeCompare(b.seat_name, undefined, {
                numeric: true,
                sensitivity: 'base'
            });
        });

        $("#confirmBtn").prop("disabled", seats.length === 0);
    });

    $("#confirmBtn").on("click", function (e) {
        e.preventDefault();

        console.log(seats)

        var seatsString = seat_names.map(seat => seat.seat_name).join(', ');

        console.log(building, room, reservationDate, reservationStartHour, seatsString)

        $('#resVenue').text(building);
        $('#resRoom').text(room);
        $('#resDate').text(reservationDate);
        $('#resTime').text(`${reservationStartHour}:${reservationStartMinute} - ${reservationEndHour}:${reservationEndMinute}`);
        $('#resSeats').text(seatsString);
        $("#confirmModal").removeClass("hidden");
    });

    $(".close-confirm").on("click", function () {
        $("#confirmModal").addClass("hidden");
    });

    $("#anon").on("click", function () {
        const isChecked = $(this).is(":checked");

        if (isChecked) {
            anonymous = true;
        } else {
            anonymous = false;
        }
    });

    $("#confirmOkay").on("click", async function () {
        const $btn = $(this);
        const isAnonymous = $("input[name='anonymous']").is(":checked");
        console.log("New classes:", loading.className);
        $("#confirmText").text("Processing...");
        showLoader()


        try {
            const jason = {
                timeStart: reservationStartTimeStamp,
                timeEnd: reservationEndTimeStamp,
                seats: seats,
                anonymous: isAnonymous
            };

            const res = await fetch(`/reservations/${adminId}/add-admin`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(jason)
            });

            if (res.ok) {
                setTimeout(() => {
                    var seatsString = seat_names.map(seat => seat.seat_name).join(', ');
                    $("#confirmModal").addClass("hidden");
                    $('#successVenue').text(building);
                    $('#successRoom').text(room);
                    $('#successDate').text(reservationDate);
                    $('#successTime').text(`${reservationStartHour}:${reservationStartMinute} - ${reservationEndHour}:${reservationEndMinute}`);
                    $('#successSeats').text(seatsString);
                    successModal.classList.remove("hidden")
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
    closeSuccessModal.addEventListener('click', function (event) {
        successModal.classList.add("hidden")
    });
    successConfirm.addEventListener('click', function (event) {
        successModal.classList.add("hidden")
    });

    function displayStartTimeInputs() {
        if (startHourInput.options.length > 1) return;
        if(startMinuteInput.options.length > 1) return;

        startHourInput.innerHTML = `<option value="" disabled selected>--</option>`;
        startMinuteInput.innerHTML = `<option value="" disabled selected>--</option>`;
        let currentDate = new Date();
        const formattedCurrentDate = currentDate.toLocaleDateString('en-CA')
        let currentTime = currentDate.toLocaleTimeString('en-US', { hour12: false })
        const currentHour = currentDate.getHours()
        const currentMinutes = currentDate.getMinutes()
        let chosenDate = dateInput.value.trim()
        console.log("Chosen Date: ", chosenDate)
        console.log("Current Date: ", formattedCurrentDate)
        if (chosenDate == formattedCurrentDate) {
            for (let i = currentHour; i <= 20; i++) {
                let option = document.createElement("option")
                let hour = format(i)
                option.innerHTML = `<option value="${hour}">${hour}</option>`
                startHourInput.appendChild(option)
            }
            if (currentMinutes < 30) {
                let option = document.createElement("option")
                let firstOption = "00"
                option.innerHTML = `<option value="${firstOption}">${firstOption}</option>`
                startMinuteInput.appendChild(option)
                let option2 = document.createElement("option")
                let secondOption = "30"
                option2.innerHTML = `<option value="${secondOption}">${secondOption}</option>`
                startMinuteInput.appendChild(option2)
            }
            else {
                let option = document.createElement("option")
                let firstOption = "30"
                option.innerHTML = `<option value="${firstOption}">${firstOption}</option>`
                startMinuteInput.appendChild(option)
            }
        }
        else {
            for (let i = 7; i <= 20; i++) {
                let option = document.createElement("option")
                let hour = format(i)
                option.innerHTML = `<option value="${hour}">${hour}</option>`
                startHourInput.appendChild(option)
            }
            let option = document.createElement("option")
            let firstOption = "00"
            option.innerHTML = `<option value="${firstOption}">${firstOption}</option>`
            startMinuteInput.appendChild(option)
            let option2 = document.createElement("option")
            let secondOption = "30"
            option2.innerHTML = `<option value="${secondOption}">${secondOption}</option>`
            startMinuteInput.appendChild(option2)
        }
    }

    function displayEndHourInputs(startHour, startMinute) {
        if (endHourInput.options.length > 1) return;

        endHourInput.innerHTML = `<option value="" disabled selected>--</option>`;
        if (startMinute == "00") {
            console.log("00")
            for (let i = startHour; i <= 21; i++) {
                let option = document.createElement("option")
                let hour = format(i)
                option.innerHTML = `<option value="${hour}">${hour}</option>`
                endHourInput.appendChild(option)
            }
        }
        else {
            console.log("30")
            for (let i = startHour + 1; i <= 21; i++) {
                let option = document.createElement("option")
                let hour = format(i)
                option.innerHTML = `<option value="${hour}">${hour}</option>`
                endHourInput.appendChild(option)
            }
        }
    }

    function displayEndMinuteInputs(startHour, endHour) {
        if (endMinuteInput.options.length > 1) return;

        endMinuteInput.innerHTML = `<option value="" disabled selected>--</option>`;
        if (startHour == endHour) {
            let option = document.createElement("option")
            let firstOption = "30"
            option.innerHTML = `<option value="${firstOption}">${firstOption}</option>`
            endMinuteInput.appendChild(option)
        }
        else if (startHour != endHour && endHour != 21) {
            let option = document.createElement("option")
            let firstOption = "00"
            option.innerHTML = `<option value="${firstOption}">${firstOption}</option>`
            endMinuteInput.appendChild(option)
            let option2 = document.createElement("option")
            let secondOption = "30"
            option2.innerHTML = `<option value="${secondOption}">${secondOption}</option>`
            endMinuteInput.appendChild(option2)
        }
        else {
            let option = document.createElement("option")
            let firstOption = "00"
            option.innerHTML = `<option value="${firstOption}">${firstOption}</option>`
            endMinuteInput.appendChild(option)
        }
    }

})