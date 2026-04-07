const table = document.getElementById("table");
const tbody = document.getElementById("tbody");
const delete_button = document.getElementById("delete_button");
const dropdownButton = document.getElementById("dropdownButton");
const sort_text = document.getElementById("sort_text");
const dropdown = document.getElementById("dropdown");
const building_option = document.getElementById("building_option");
const room_option = document.getElementById("room_option");
const date_option = document.getElementById("date_option");
const start_time_option = document.getElementById("start_time_option");
const end_time_option = document.getElementById("end_time_option");
const view_modal = document.getElementById("view_modal")
const view_modal_body = document.getElementById("view_modal_body")
const hide_view_modal = document.getElementById("hide_view_modal")
const confirm_okay = document.getElementById("confirm_okay")
const filterSearch = document.getElementById("filterSearch")
const filterDropdownMenu = document.getElementById("filterDropdownMenu")
const filterDropdownButton = document.getElementById("filterDropdownButton")
const filterDropdownText = document.getElementById("filterDropdownText")
const filterSearchButton = document.getElementById("filterSearchButton")
const clear_filter_button = document.getElementById("clear_filter_button")
const building_filter = document.getElementById("building_filter")
const room_filter = document.getElementById("room_filter")
const date_filter = document.getElementById("date_filter")
const noReservations = document.getElementById("noReservations")
var building;
var room;
var reservationDate;
var reservationStartMinute;
var reservationStartHour;
var reservationEndMinute;
var reservationEndHour;
var seatCount = undefined;
var reservationStartTimeStamp;
var reservationEndTimeStamp;
var creationTimeStart = undefined;
var creationTimeEnd = undefined;
var reservationsToBeDisplayed;
const url = new URLSearchParams(window.location.search);
let reservations;
let listOfReservations = []
class reservation {
    constructor(id, building, roomName, startDate, startTime, endTime, creationDate, creationTime) {
        this.id = id,
            this.building = building;
        this.roomName = roomName;
        this.startDate = startDate;
        this.startTime = startTime;
        this.endTime = endTime;
        this.creationDate = creationDate;
        this.creationTime = creationTime;
    }
}
$(document).ready(async function () {
    let seats;
    reservations = await getReservations();
    console.log(reservations)
    if (Array.isArray(reservations)) {
        showReservations(reservations);
    }

    $("#startHr").prop("disabled", true);
    $("#startMin").prop("disabled", true);
    $("#endHr").prop("disabled", true);
    $("#endMin").prop("disabled", true);
    $("#roomInput").prop("disabled", true);

    $("#buildingInput").on("change", async function (e) {
        try {
            room = undefined
            reservationsToBeDisplayed = undefined;
            building = $(this).val().trim();

            const roomSelect = $("#roomInput");
            roomSelect.empty();
            roomSelect.append('<option value="" disabled selected>Input Room...</option>');

            const roomsInBuildings = await fetch(`/room/building/room-names?buildingName=${building}`);
            const roomsInBuildingsJ = await roomsInBuildings.json();

            roomsInBuildingsJ.forEach(r => {
                roomSelect.append(`<option value="${r.room_name}">${r.room_name}</option>`);
            });

            $("#roomInput").prop("disabled", false);
            updateReservationsList(creationTimeStart, creationTimeEnd, room, building, reservationStartTimeStamp, reservationEndTimeStamp, seatCount)

        }
        catch (err) {
            console.error("Error updating building:", err);
        }
    });

    $("#roomInput").on("change", async function (e) {
        try {
            room = $(this).val().trim();
            reservationsToBeDisplayed = undefined;
            updateReservationsList(creationTimeStart, creationTimeEnd, room, building, reservationStartTimeStamp, reservationEndTimeStamp, seatCount)
        }
        catch (err) {
            console.error("Error updating building:", err);
        }
    });

    $("#reservationDateInput").on("change", async function (e) {
        try {
            reservationDate = $(this).val().trim();
            reservationsToBeDisplayed = undefined;
            updateInitialTimeStampValues()
            $("#startHr").val("")
            $("#startMin").val("")
            $("#endHr").val("")
            $("#endMin").val("")
            $("#startHr").prop("disabled", false);
            $("#startMin").prop("disabled", false);
            $("#endHr").prop("disabled", false);
            $("#endMin").prop("disabled", false);
            console.log("reservationStartTimeStamp: ", reservationStartTimeStamp)
            console.log("reservationEndTimeStamp: ", reservationEndTimeStamp)
            updateReservationsList(creationTimeStart, creationTimeEnd, room, building, reservationStartTimeStamp, reservationEndTimeStamp, seatCount)
        }
        catch (err) {
            console.error("Error updating building:", err);
        }
    });

    $("#startHr").on("change", async function (e) {
        try {
            reservationStartHour = $(this).val().trim();
            reservationsToBeDisplayed = undefined;
            updateTimeStampValues()
            updateReservationsList(creationTimeStart, creationTimeEnd, room, building, reservationStartTimeStamp, reservationEndTimeStamp, seatCount)
        }
        catch (err) {
            console.error("Error updating building:", err);
        }
    });

    $("#startMin").on("change", async function (e) {
        try {
            reservationStartMinute = $(this).val().trim();
            reservationsToBeDisplayed = undefined;
            updateTimeStampValues()
            updateReservationsList(creationTimeStart, creationTimeEnd, room, building, reservationStartTimeStamp, reservationEndTimeStamp, seatCount)
        }
        catch (err) {
            console.error("Error updating building:", err);
        }
    });

    $("#endHr").on("change", async function (e) {
        try {
            reservationEndHour = $(this).val().trim();
            reservationsToBeDisplayed = undefined;
            updateTimeStampValues()
            updateReservationsList(creationTimeStart, creationTimeEnd, room, building, reservationStartTimeStamp, reservationEndTimeStamp, seatCount)
        }
        catch (err) {
            console.error("Error updating building:", err);
        }
    });

    $("#endMin").on("change", async function (e) {
        try {
            reservationEndMinute = $(this).val().trim();
            reservationsToBeDisplayed = undefined;
            updateTimeStampValues()
            updateReservationsList(creationTimeStart, creationTimeEnd, room, building, reservationStartTimeStamp, reservationEndTimeStamp, seatCount)
        }
        catch (err) {
            console.error("Error updating building:", err);
        }
    });
})

async function showReservations(reservations) {
    tbody.innerHTML = "";
    let listOfReservations = []

    if(reservations.length == 0) {
        noReservations.classList.remove("hidden")
        tbody.classList.add("hidden")
    }
    else{
        noReservations.classList.add("hidden")
        tbody.classList.remove("hidden")
    }

    reservations.forEach(res => {
        const rawStart = res.reservation_start_timestamp.replace('Z', '').replace(' ', 'T');
        const startDate = new Date(rawStart);
        const newStartDate = new Date(res.reservation_start_timestamp)
        const endDate = new Date(res.reservation_end_timestamp);
        const creationDate = new Date(res.creation_timestamp);
        const formattedStartDate = new Intl.DateTimeFormat('en-US', {
            month: 'long',
            day: '2-digit',
            year: 'numeric',
            timeZone: 'UTC'
        }).format(startDate);

        const formattedStartTime = new Intl.DateTimeFormat('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
            timeZone: 'UTC'
        }).format(newStartDate);


        const formattedEndTime = new Intl.DateTimeFormat('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
            timeZone: 'UTC'
        }).format(endDate);

        const formattedCreationDate = new Intl.DateTimeFormat('en-US', {
            month: 'long',
            day: '2-digit',
            year: 'numeric',
        }).format(creationDate);

        const formattedCreationTime = new Intl.DateTimeFormat('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
        }).format(creationDate);

        listOfReservations.push(new reservation(
            res.reservation_id,
            res.building,
            res.room_name,
            startDate,
            formattedStartTime,
            formattedEndTime,
            formattedCreationDate,
            formattedCreationTime)
        );
    });
    listOfReservations.sort((a, b) => b.startDate.getTime() - a.startDate.getTime());
    console.log(listOfReservations)
    for (const res of listOfReservations) {
        const formattedStartDate = new Intl.DateTimeFormat('en-US', {
            month: 'long',
            day: '2-digit',
            year: 'numeric',
            timeZone: 'UTC'
        }).format(res.startDate);
        await addRow(
            res.id,
            res.building,
            res.roomName,
            formattedStartDate,
            res.startTime,
            res.endTime,
            res.creationDate,
            res.creationTime
        );

    }

    sortTableByStatus(tbody)
    showTable()
}

function sortTableByStatus(tbody) {
    const rows = Array.from(tbody.querySelectorAll("tr"));

    const order = { "Happening Now": 0, "Scheduled": 1, "Cancelled": 2, "Finished": 3 };

    rows.sort((a, b) => order[a.dataset.status] - order[b.dataset.status]);

    console.log("HELLOOO")

    rows.forEach(row => tbody.appendChild(row));
}

function convertDate(date) {
    const dateObj = new Date(date);

    // Extract parts
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(dateObj.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
}

async function getReservations() {
    const response = await fetch(`/reservations/api/list`);
    if (!response.ok) {
        console.error("Server error:", response.status);
        return [];
    }

    return await response.json();
}

async function getReservationsByBuilding(building) {
    const response = await fetch(`/reservations/api/list?building=${building}`);

    const data = await response.json(); // Save it to a variable first
    return data;
}

async function getReservationsByRoom(room) {

    const response = await fetch(`/reservations/api/list?roomName=${room}`);

    const data = await response.json(); // Save it to a variable first
    return data;
}

async function getReservationsByDate(date) {
    const convertedDate = convertDate(date);
    const startDateObj = new Date(convertedDate + "T00:00:00Z");
    const endDateObj = new Date(convertedDate + "T23:59:59.999Z");
    const formatted_start_time = startDateObj.toISOString();
    console.log(formatted_start_time)
    const formatted_end_time = endDateObj.toISOString();
    console.log(formatted_end_time)
    const response = await fetch(`/reservations/api/list?reservationTimeStart=${formatted_start_time}&reservationTimeEnd=${formatted_end_time}`);

    const data = await response.json();
    return data;
}


table.addEventListener("click", viewRow);

function unshowTable() {
    $("#tbody").addClass("hidden")
    $("#loadingRow").removeClass("hidden")
}
function showTable() {
    $("#tbody").removeClass("hidden")
    $("#loadingRow").addClass("hidden")
}

async function addRow(reservationId, building, room, date, startTime, endTime, resDate, resTime) {
    const tr = document.createElement('tr');
    tr.setAttribute('data-id', reservationId);
    tr.className = "odd:bg-neutral-primary even:bg-neutral-secondary-soft border-b border-default";

    const [editable, happeningNow, cancelled] = await Promise.all([
        fetch(`/reservations/${reservationId}/checkEditable`).then(res => res.json()),
        fetch(`/reservations/${reservationId}/checkHappening`).then(res => res.json()),
        fetch(`/reservations/${reservationId}/checkCancelled`).then(res => res.json())
    ]);


    let statusText = "";

    if (cancelled) {
        tr.innerHTML = `
                <td scope="row" class="border-b border-default px-6 py-4 font-medium text-heading whitespace-nowrap">
                    ${building}
                    </td>
                    <td class="border-b border-default px-4 py-4">
                    ${room}
                    </td>
                    <td class="border-b border-default px-4 py-4">
                    ${date}
                    </td>
                    <td class="border-b border-default px-4 py-4">
                    ${startTime} - ${endTime}
                    </td>
                    <td class="border-b border-default px-4 py-4">
                    ${resDate}
                    </td>
                    <td class="border-b border-default px-4 py-4">
                    ${resTime}
                    </td>
                    <td class="border-b border-default px-4 py-4">
                        <span class="text-sm text-red-600 font-medium leading-none">Cancelled</span>
                    </td>
                <td class="border-b border-default px-4 py-4 space-x-1.5">
                    <div class="flex justify-center items-center">
                    <button id="view_button" class = "w-8 h-8 flex items-center justify-center view_button_class text-slate-600 hover:bg-[#34493e]/5 hover:border-[#34493e]/20 hover:text-[#34493e]">
                        <img src="/images/seat.png" alt="View" class="w-5 h-5">
                    </button>
                    </div>
                </td>
            `;
        statusText = "Cancelled";
    }
    else {
        if (happeningNow) {
            console.log("true")
            tr.innerHTML = `
                <td scope="row" class="border-b border-default px-6 py-4 font-medium text-heading whitespace-nowrap">
                    ${building}
                    </td>
                    <td class="border-b border-default px-4 py-4">
                    ${room}
                    </td>
                    <td class="border-b border-default px-4 py-4">
                    ${date}
                    </td>
                    <td class="border-b border-default px-4 py-4">
                    ${startTime} - ${endTime}
                    </td>
                    <td class="border-b border-default px-4 py-4">
                    ${resDate}
                    </td>
                    <td class="border-b border-default px-4 py-4">
                    ${resTime}
                    </td>
                    <td class="border-b border-default px-4 py-4">
                        <span class="text-sm text-blue-500 font-medium leading-none">Happening Now</span>
                    </td>
                <td class="border-b border-default px-4 py-4 space-x-1.5">
                    <div class="flex justify-center items-center">
                    <button id="view_button" class = "w-8 h-8 flex items-center justify-center view_button_class text-slate-600 hover:bg-[#34493e]/5 hover:border-[#34493e]/20 hover:text-[#34493e]">
                        <img src="/images/seat.png" alt="View" class="w-5 h-5">
                    </button>
                    </div>
                </td>
            `;
            statusText = "Happening Now";
        }
        else {
            if (editable) {
                tr.innerHTML = `
                    <td scope="row" class="border-b border-default px-6 py-4 font-medium text-heading whitespace-nowrap">
                        ${building}
                        </td>
                        <td class="border-b border-default px-4 py-4">
                        ${room}
                        </td>
                        <td class="border-b border-default px-4 py-4">
                        ${date}
                        </td>
                        <td class="border-b border-default px-4 py-4">
                        ${startTime} - ${endTime}
                        </td>
                        <td class="border-b border-default px-4 py-4">
                        ${resDate}
                        </td>
                        <td class="border-b border-default px-4 py-4">
                        ${resTime}
                        </td>
                        <td class="border-b border-default px-4 py-4">
                            <span class="text-sm text-green-500 font-medium leading-none">Scheduled</span>
                        </td>
                    <td class="border-b border-default px-4 py-4 space-x-1.5">
                        <div class="flex justify-center items-center">
                        <button id="view_button" class = "w-8 h-8 flex items-center justify-center view_button_class text-slate-600 hover:bg-[#34493e]/5 hover:border-[#34493e]/20 hover:text-[#34493e]">
                            <img src="/images/seat.png" alt="View" class="w-5 h-5">
                        </button>
                        <button id="edit_button" class = "edit_button_class w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-[#34493e]/5 hover:border-[#34493e]/20 hover:text-[#34493e]">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                            </svg>
                        </button>
                        </div>
                    </td>
                `;
                statusText = "Scheduled";
            }
            else { //res is done na
                tr.innerHTML = `
                    <td scope="row" class="border-b border-default px-6 py-4 font-medium text-heading whitespace-nowrap">
                        ${building}
                        </td>
                        <td class="border-b border-default px-4 py-4">
                        ${room}
                        </td>
                        <td class="border-b border-default px-4 py-4">
                        ${date}
                        </td>
                        <td class="border-b border-default px-4 py-4">
                        ${startTime} - ${endTime}
                        </td>
                        <td class="border-b border-default px-4 py-4">
                        ${resDate}
                        </td>
                        <td class="border-b border-default px-4 py-4">
                        ${resTime}
                        </td>
                        <td class="border-b border-default px-4 py-4">
                            <span class="text-sm font-medium leading-none">Finished</span>
                        </td>
                    <td class="border-b border-default px-4 py-4 space-x-1.5">
                        <div class="flex justify-center items-center">
                        <button id="view_button" class = "w-8 h-8 flex items-center justify-center view_button_class text-slate-600 hover:bg-[#34493e]/5 hover:border-[#34493e]/20 hover:text-[#34493e]">
                            <img src="/images/seat.png" alt="View" class="w-5 h-5">
                        </button>
                        </div>
                    </td>
                `;
                statusText = "Finished";
            }
        }
    }
    tr.dataset.status = statusText;
    tbody.appendChild(tr);
}

$("#view_reservations").on("click", async function (e) {
    e.preventDefault();
    try {
        window.location.href = `/user/view-reservations`
    } catch (err) {
        console.error("Login Error:", err);
        alert("An error occurred. Check the F12 console.");
    }
});

$(document).on("click", ".edit_button_class", function (e) {
    e.preventDefault();

    console.log("I AM CLICKED");

    const row = $(this).closest("tr");
    const reservationId = row.data("id");

    fetch("/user/edit-reservation", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            resId: reservationId
        })
    })
        .then(response => response.json())
        .then(() => {
            window.location.href = "/user/edit-reservation";
        });
});
async function viewRow(e) {
    const btn = e.target.closest(".view_button_class");
    if (!btn) return;

    const row = btn.closest("tr");
    if (!row) {
        console.error("Could not find the parent row for this button.");
        return;
    }

    const reservationId = row.getAttribute('data-id');
    console.log("Viewing Reservation ID:", reservationId);

    const response = await fetch(
        `/reservations/${reservationId}/seats`
    )

    const seats = await response.json()
    console.log(seats)
    view_modal.classList.remove("hidden");

    if (Array.isArray(seats.seats)) {
        view_modal_body.innerHTML = "";

        seats.seats.forEach(seat => {
            const seatNumber = seat.slice(-2)
            const seatChip = document.createElement('span');
            seatChip.className = `
            w-[120px] py-2 rounded-xl font-semibold text-sm
            bg-[#f0f4f2] text-[#1e3a2a] border border-[#1e3a2a]/20
            shadow-sm px-[14px] mr-[7px]
        `;
            // Add an icon for a "premium" touch
            seatChip.innerHTML = `<i class="fa-solid fa-couch opacity-70"></i> Computer ${seatNumber}`;
            view_modal_body.appendChild(seatChip)
        });
    }

    hide_view_modal.addEventListener("click", function () {
        view_modal.classList.add("hidden")
    });

    confirm_okay.addEventListener("click", function () {
        view_modal.classList.add("hidden")
    });
}

function updateInitialTimeStampValues() {
    reservationStartTimeStamp = reservationDate + "T00:00:00.000";
    reservationEndTimeStamp = reservationDate + "T23:59:00.000";
}

function updateTimeStampValues() {
    if (reservationStartHour && reservationStartMinute) {
        reservationStartTimeStamp = reservationDate + "T" + reservationStartHour + ":" + reservationStartMinute + ":00.000";
    }
    if (reservationEndHour && reservationEndMinute) {
        reservationEndTimeStamp = reservationDate + "T" + reservationEndHour + ":" + reservationEndMinute + ":00.000";
    }
}

async function updateReservationsList(creationTimeStart, creationDate, room, building, reservationStartTimeStamp, reservationEndTimeStamp, seatCount) {
    try {
        unshowTable()
        const response = await fetch(`/reservations/api/list/?creationTimeStart=${creationTimeStart || ""}&creationTimeEnd=${creationTimeEnd || ""}&roomName=${room || ""}&building=${building || ""}&reservationTimeStart=${reservationStartTimeStamp || ""}&reservationTimeEnd=${reservationEndTimeStamp || ""}&seatCount=${seatCount || ""}`);

        if (!response.ok) {
            console.log("Error");
            return;
        }

        const reservationsToBeDisplayed = await response.json();

        showReservations(reservationsToBeDisplayed)

    } catch (error) {
        console.error("Failed to fetch reservations:", error)
    }
}

$("#resetBtn").on("click", async function (e) {
        try {
            $("#buildingInput").val("")
            $("#roomInput").val("")
            $("#reservationDateInput").val("")
            $("#emailInput").val("")
            $("#startHr").val("")
            $("#startMin").val("")
            $("#endHr").val("")
            $("#endMin").val("")
            $("#startHr").prop("disabled", true);
            $("#startMin").prop("disabled", true);
            $("#endHr").prop("disabled", true);
            $("#endMin").prop("disabled", true);
            $("#roomInput").prop("disabled", true);
            building = undefined;
            room = undefined;
            email = undefined;
            reservationDate = undefined;
            reservationStartMinute = undefined;
            reservationStartHour = undefined;
            reservationEndMinute = undefined;
            reservationEndHour = undefined;
            reservationStartTimeStamp = undefined;
            reservationEndTimeStamp = undefined;
            reservationsToBeDisplayed = undefined;
            updateReservationsList(email, creationTimeStart, creationTimeEnd, room, building, reservationStartTimeStamp, reservationEndTimeStamp, seatCount)
        }
        catch (err) {
            console.error("")
        }
    });
