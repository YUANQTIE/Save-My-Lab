const queryString = window.location.search;
const url = new URLSearchParams(queryString);

const reservationId = url.get('resId');
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
var selectedSeats;
var selectedSeatNames;

var newBuilding;
var newRoom;
var newReservationDate;
var newReservationStartMinute;
var newReservationStartHour;
var newReservationEndMinute;
var newReservationEndHour;
var newReservationStartTimeStamp;
var newReservationEndTimeStamp;
var currSeats;
var currSeatNames;

var isAnonymous = false;

$(document).ready(async function () {

    function setCurrSeatsToDefault(){
        currSeats = selectedSeats
        currSeatNames = selectedSeatNames
    }

    function setCurrSeatsToSelecteds(seats, seat_names){
        currSeats = seats
        currSeatNames = seat_names
    }

    function weekView() {
        let today = new Date();
        let nextWk = new Date();
        nextWk.setDate(today.getDate() + 7);
        today = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
        nextWk = `${nextWk.getFullYear()}-${(nextWk.getMonth() + 1).toString().padStart(2, '0')}-${nextWk.getDate().toString().padStart(2, '0')}`;


        $("#dateInput").attr('min', today);
        $("#dateInput").attr('max', nextWk);
    }

    function setInitialTimeStamps(){
        reservationStartTimeStamp = reservationDate + "T" + reservationStartHour + ":" + reservationStartMinute + ":00.000";
        reservationEndTimeStamp = reservationDate + "T" + reservationEndHour + ":" + reservationEndMinute + ":00.000";

        newReservationStartTimeStamp = reservationStartTimeStamp
        newReservationEndTimeStamp = reservationEndTimeStamp


    }

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

    function checkTimeInputs() {
        if ($("#startHourInput").val() && $("#startMinuteInput").val() && !$("#endHourInput").val() && !$("#endMinuteInput").val()) {
            displayEndHourInputs(parseInt($("#startHourInput").val().trim()), $("#startMinuteInput").val().trim())
        }
        if ($("#startHourInput").val() && $("#endHourInput").val() && !$("#endMinuteInput").val()) {
            displayEndMinuteInputs(parseInt($("#startHourInput").val()), parseInt($("#endHourInput").val()))
        }
        if ($("#startHourInput").val() && $("#startMinuteInput").val() && $("#endHourInput").val() && $("#endMinuteInput").val()) {
            newReservationStartHour = $("#startHourInput").val().trim();
            newReservationStartMinute = $("#startMinuteInput").val().trim();
            newReservationEndHour = $("#endHourInput").val().trim();
            newReservationEndMinute = $("#endMinuteInput").val().trim();

            $(".seat").removeClass("gray")

            newReservationStartTimeStamp = $("#dateInput").val() + "T" + $("#startHourInput").val() + ":" + $("#startMinuteInput").val() + ":00.000";
            newReservationEndTimeStamp = $("#dateInput").val() + "T" +  $("#endHourInput").val() + ":" + $("#endMinuteInput").val() + ":00.000";
        }
    }

    function assignSeatIds(seatArray) {
        $(".seat").removeClass("gray red blue blue-500 red-500 green cursor-pointer selected").attr("title", "").removeAttr("id").removeAttr("data-name");
        $(".room-wrapper").addClass("seats-enabled");
        if (building === "Gokongwei Building") {
            $("#goks .seat").each(function (index) {
                const seatInfo = seatArray[index];

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
                    else if (seatInfo.status === "selected") {
                        $(this).addClass("green cursor-pointer selected")
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
                    else if (seatInfo.status === "selected") {
                        $(this).addClass("green cursor-pointer selected")
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
                    else if (seatInfo.status === "selected") {
                        $(this).addClass("green cursor-pointer selected")
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
                    else if (seatInfo.status === "selected") {
                        $(this).addClass("green cursor-pointer selected")
                    }
                    else {
                        $(this).addClass("cursor-pointer")
                    }

                }
            });
        }

    }
    
    function getDate(s){
        reservationDate = s.substring(0, 10);
    }

    function getStartHourAndMinute(s){
        reservationStartHour = s.substring(11, 13);
        reservationStartMinute = s.substring(14, 16);
    }

    function getEndHourAndMinute(s){
        reservationEndHour = s.substring(11, 13);
        reservationEndMinute = s.substring(14, 16);
    }

    function loadVenueInput(){
        $("#venueInput").val(building)
    }

    function loadDateInput(){
        $("#dateInput").val(reservationDate)
    }

    function loadStartTimeInputs() {
        startHourInput.innerHTML = `<option value="" disabled selected>--</option>`;
        startMinuteInput.innerHTML = `<option value="" disabled selected>--</option>`;
        let currentDate = new Date();
        const formattedCurrentDate = currentDate.toLocaleDateString('en-CA')
        const currentHour = currentDate.getHours()
        const currentMinutes = currentDate.getMinutes()
        let chosenDate = dateInput.value.trim()
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

        $("#startHourInput").val(reservationStartHour)
        $("#startMinuteInput").val(reservationStartMinute)
    }

    function loadEndHourInputs(startHour, startMinute) {
        if (endHourInput.options.length > 1) return;

        startHour = parseInt(startHour, 10);     

        endHourInput.innerHTML = `<option value="" disabled selected>--</option>`;
        if (startMinute == "00") {
            for (let i = startHour; i <= 21; i++) {
                let option = document.createElement("option")
                let hour = format(i)
                option.innerHTML = `<option value="${hour}">${hour}</option>`
                endHourInput.appendChild(option)
            }
        }
        else {
            for (let i = startHour + 1; i <= 21; i++) {
                let option = document.createElement("option")
                let hour = format(i)
                option.innerHTML = `<option value="${hour}">${hour}</option>`
                endHourInput.appendChild(option)
            }
        }
        $("#endHourInput").val(reservationEndHour)
    }

    function loadEndMinuteInputs(startHour, endHour) {
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
        $("#endMinuteInput").val(reservationEndMinute)
    }
    
    async function loadRoomInput(){
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

        $("#roomInput").val(room)
    }

    async function getCurrentReservationData(){
        const res = await fetch(`/reservations/specific-reservation`)
        const reservation = await res.json()
        building = reservation.building
        room = reservation.room_name
        reservationStartTimeStamp = reservation.reservation_start_timestamp
        reservationEndTimeStamp = reservation.reservation_end_timestamp
        selectedSeats = reservation.seats
        selectedSeatNames = reservation.seat_names
        getDate(reservationStartTimeStamp)
        getStartHourAndMinute(reservationStartTimeStamp)
        getEndHourAndMinute(reservationEndTimeStamp)
    }

    async function loadPanelInputs(){
        loadVenueInput()
        await loadRoomInput()
        loadDateInput()
        loadStartTimeInputs()
        loadEndHourInputs(reservationStartHour, reservationStartMinute)
        loadEndMinuteInputs(reservationStartHour, reservationEndHour)
        setCurrSeatsToDefault()
    }

    async function loadInitialSeats(){
        setInitialTimeStamps()
        if ($("#startHourInput").val() && $("#startMinuteInput").val() && $("#endHourInput").val() && $("#endMinuteInput").val() && $("#dateInput").val() && $("#venueInput").val() && $("#roomInput").val()) {
            if (reservationEndTimeStamp > reservationStartTimeStamp) {
                const seatStatuses = await fetch(`/room/edit-seat-status?timeStart=${reservationStartTimeStamp}&timeEnd=${reservationEndTimeStamp}&roomName=${room}&selectedSeats=${selectedSeats}`);
                const seatStatusesJson = await seatStatuses.json();

                seatStatusesJson.sort((a, b) => {
                    return a.seat_name.localeCompare(b.seat_name);
                });

                assignSeatIds(seatStatusesJson);

                $("#endHourInput, #endMinuteInput").removeClass("border-red-600");
            } else {
                $("#endHourInput, #endMinuteInput").addClass("border-red-600").val("");
                $(".seat").addClass("gray").removeClass("cursor-pointer green red blue");
            }
        } else {
            $(".seat").addClass("gray").removeClass("cursor-pointer green red blue");
        }
    }

    $(document).on("click", ".seat.cursor-pointer", function () {
        $(this).toggleClass("green");
        const seatId = $(this).attr("id");
        const seatName = $(this).attr("data-name") || seatId;

        if ($(this).hasClass("green")) {
            currSeats.push(seatId);
            currSeatNames.push(seatName);
        }
        else {
            currSeats = currSeats.filter(id => id !== seatId);
            currSeatNames = currSeatNames.filter(name => name !== seatName);
        }

        console.log(currSeatNames)

        $("#confirmBtn").prop("disabled", currSeats.length === 0);
    });

    $("#venueInput").on("change", async function (e) {
        try {

            $(".seat")
                .removeClass("red blue green cursor-pointer selected")
                .addClass("gray")
                .removeAttr("id")
                .removeAttr("data-name")
                .attr("title", "");

            room = "";

            $("#confirmBtn").prop("disabled", true);

            newBuilding = $(this).val().trim();
            building = newBuilding

            const roomSelect = $("#roomInput");
            roomSelect.empty();
            roomSelect.append('<option value="" disabled selected>Input Room...</option>');

            const roomsInBuildings = await fetch(`/room/building/room-names?buildingName=${newBuilding}`);
            const roomsInBuildingsJ = await roomsInBuildings.json();

            roomsInBuildingsJ.forEach(r => {
                roomSelect.append(`<option value="${r.room_name}">${r.room_name}</option>`);
            });

            $("#goks, #ls, #yuch, #andrew, #default").addClass("hidden");

            if (newBuilding === "Gokongwei Building") $("#goks").removeClass("hidden");
            else if (newBuilding === "St. La Salle Hall") $("#ls").removeClass("hidden");
            else if (newBuilding === "Don Enrique T. Yuchengco Hall") $("#yuch").removeClass("hidden");
            else if (newBuilding === "Br. Andrew Gonzales Hall") $("#andrew").removeClass("hidden");

            currSeats = []
            currSeatNames = []

        } catch (err) {
            console.error("Error updating building:", err);
        }
    });

    $("#roomInput").on("change", async function (e) {
        $(".seat").removeClass("green selected").addClass("gray");
        weekView();
        try {
            newRoom = $(this).val().trim();
            currSeats = []
            currSeatNames = []

        } catch (err) {
            console.error("Error:", err);
        }
    });

    $("#dateInput").on("change", async function (e) {
        $(".seat").attr("class", "seat");
        try {
            newReservationDate = $(this).val().trim();
            currSeats = []
            currSeatNames = []

        } catch (err) {
            console.error("Error:", err);
            alert("An error occurred. Check the F12 console.");
        }
    });

    $("#startHourInput, #startMinuteInput, #endHourInput, #endMinuteInput").on("change", async function (e) {
        try {
            currSeats = []
            currSeatNames = []

        } catch (err) {
            console.error("Error:", err);
            alert("An error occurred. Check the F12 console.");
        }
    });

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

    $("#venueInput, #roomInput, #dateInput, #startHourInput, #startMinuteInput, #endHourInput, #endMinuteInput").on("change", async function () {
        checkTimeInputs();

        if ($("#startHourInput").val() && $("#startMinuteInput").val() && $("#endHourInput").val() && $("#endMinuteInput").val() && $("#dateInput").val() && $("#venueInput").val() && $("#roomInput").val()) {
            if (newReservationEndTimeStamp > newReservationStartTimeStamp) {
                var seatStatuses;
                var flag = false;
                if ($("#roomInput").val() === room && $("#dateInput").val() === reservationDate){
                    if ($("#startHourInput").val() === reservationStartHour && $("#startMinuteInput").val() === reservationStartMinute && $("#endHourInput").val() === reservationEndHour && $("#endMinuteInput").val() === reservationEndMinute){
                        setCurrSeatsToDefault()
                        seatStatuses = await fetch(`/room/edit-seat-status?timeStart=${newReservationStartTimeStamp}&timeEnd=${newReservationEndTimeStamp}&roomName=${room}&selectedSeats=${selectedSeats}`);
                    }
                    else{
                        seatStatuses = await fetch(`/room/edit-seat-status-2?timeStart=${newReservationStartTimeStamp}&timeEnd=${newReservationEndTimeStamp}&roomName=${room}&resId=${reservationId}`);
                        flag = true;
                        
                        //route for getting selected seats but the reserved seats should have priority. kapag may time na may reservation, yung reserved dapat di siya magiging
                        //set curr seats to the seats from the route
                    }
                }

                else{
                    seatStatuses = await fetch(`/room/seat-status?timeStart=${newReservationStartTimeStamp}&timeEnd=${newReservationEndTimeStamp}&roomName=${$("#roomInput").val()}`);
                }

                const seatStatusesJson = await seatStatuses.json();

                if (flag){
                    const seatIds = seatStatusesJson
                        .filter(seat => seat.status === "selected")
                        .map(seat => seat._id);

                    const seatNames = seatStatusesJson
                        .filter(seat => seat.status === "selected")
                        .map(seat => seat.seat_name);

                    console.log(seatIds, seatNames)
                    setCurrSeatsToSelecteds(seatIds, seatNames)
                }

                seatStatusesJson.sort((a, b) => {
                    return a.seat_name.localeCompare(b.seat_name);
                });
                
                assignSeatIds(seatStatusesJson);

                $("#endHourInput, #endMinuteInput").removeClass("border-red-600");
            } 
            
            else {
                $("#endHourInput, #endMinuteInput").addClass("border-red-600").val("");
                $(".seat").addClass("gray").removeClass("cursor-pointer green red blue");
            }
        } 
        else {
            $(".seat").addClass("gray").removeClass("cursor-pointer green red blue");
        }

        console.log(currSeatNames)
    });

    $("#confirmBtn").on("click", function (e) {
        e.preventDefault();

        var seatsString = currSeatNames.join(', ');

        console.log(newBuilding, newRoom, newReservationDate, seatsString)

        $('#resVenue').text($("#venueInput").val());
        $('#resRoom').text($("#roomInput").val());
        $('#resDate').text($("#dateInput").val());
        $('#resTime').text(`${$("#startHourInput").val()}:${$("#startMinuteInput").val()} - ${$("#endHourInput").val()}:${$("#endMinuteInput").val()}`);
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
        $("#confirmText").text("Processing...");
        showLoader()

        try {
            const jason = {
                timeStart: newReservationStartTimeStamp,
                timeEnd: newReservationEndTimeStamp,
                seats: currSeats,
                anonymous: isAnonymous
            };

            const res = await fetch(`/reservations/${reservationId}/edit-admin`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(jason)
            });

            if (res.ok) {
                setTimeout(() => {
                    var seatsString = currSeatNames.join(', ');
                    $("#confirmModal").addClass("hidden");
                    $('#successVenue').text($("#venueInput").val());
                    $('#successRoom').text($("#roomInput").val());
                    $('#successDate').text($("#dateInput").val());
                    $('#successTime').text(`${$("#startHourInput").val()}:${$("#startMinuteInput").val()} - ${$("#endHourInput").val()}:${$("#endMinuteInput").val()}`);
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

        window.location.href = `/user/landing`
    });

    function displayStartTimeInputs() {
        startHourInput.innerHTML = `<option value="" disabled selected>--</option>`;
        startMinuteInput.innerHTML = `<option value="" disabled selected>--</option>`;
        let currentDate = new Date();
        const formattedCurrentDate = currentDate.toLocaleDateString('en-CA')
        const currentHour = currentDate.getHours()
        const currentMinutes = currentDate.getMinutes()
        let chosenDate = dateInput.value.trim()

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
            for (let i = startHour; i <= 21; i++) {
                let option = document.createElement("option")
                let hour = format(i)
                option.innerHTML = `<option value="${hour}">${hour}</option>`
                endHourInput.appendChild(option)
            }
        }
        else {
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

    await getCurrentReservationData()
    await loadPanelInputs()
    await loadInitialSeats()

})