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
const url = new URLSearchParams(window.location.search);
const userId = url.get('id');
let reservations;
$(document).ready(async function () {
    console.log("View-Reservations Script running");
    let seats;
    reservations = await getReservations();
    console.log(reservations)
    if (Array.isArray(reservations)) {
        showReservations(reservations);
    }
})

function showReservations(reservations) {
    tbody.innerHTML = "";

    reservations.forEach(res => {
        const startDate = new Date(res.reservation_start_timestamp);
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
        }).format(startDate);


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

        addRow(
            res.reservation_id,
            res.building,
            res.room_name,
            formattedStartDate,
            formattedStartTime,
            formattedEndTime,
            formattedCreationDate,
            formattedCreationTime
        );
    });
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
    const response = await fetch(`/reservations/api/list/${userId}`);
    if (!response.ok) {
        console.error("Server error:", response.status);
        return [];
    }

    return await response.json();
}

async function getReservationsByBuilding(building) {
    const response = await fetch(`/reservations/api/list/${userId}?building=${building}`);

    const data = await response.json(); // Save it to a variable first
    return data;
}

async function getReservationsByRoom(room) {

    const response = await fetch(`/reservations/api/list/${userId}?roomName=${room}`);

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
    const response = await fetch(`/reservations/api/list/${userId}?reservationTimeStart=${formatted_start_time}&reservationTimeEnd=${formatted_end_time}`);

    const data = await response.json();
    return data;
}


table.addEventListener("click", viewRow);

function addRow(reservationId, building, room, date, startTime, endTime, resDate, resTime) {
    const uniqueDialogId = `dialog-${reservationId}`;

    // Create the row element
    const tr = document.createElement('tr');
    tr.setAttribute('data-id', reservationId);
    tr.className = "odd:bg-neutral-primary even:bg-neutral-secondary-soft border-b border-default";

    // Set the internal HTML
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

    // Append to the table body
    tbody.appendChild(tr);
}

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


filterDropdownButton.addEventListener('click', function (event) {
    if (filterDropdownMenu.classList.contains('hidden')) {
        filterDropdownMenu.classList.remove('hidden');
    } else {
        filterDropdownMenu.classList.add('hidden');
    }
    event.stopPropagation();
});

building_filter.addEventListener("click", function () {
    filterDropdownText.innerHTML = "Building"
    filterSearch.placeholder = "Search by building name"
    if (filterDropdownMenu.classList.contains('hidden')) {
        filterDropdownMenu.classList.remove('hidden');
    } else {
        filterDropdownMenu.classList.add('hidden');
    }
});

room_filter.addEventListener("click", function () {
    filterDropdownText.innerHTML = "Room"
    filterSearch.placeholder = "Search by room number"
    if (filterDropdownMenu.classList.contains('hidden')) {
        filterDropdownMenu.classList.remove('hidden');
    } else {
        filterDropdownMenu.classList.add('hidden');
    }
});

date_filter.addEventListener("click", function () {
    filterDropdownText.innerHTML = "Date"
    filterSearch.placeholder = "Search by date"
    if (filterDropdownMenu.classList.contains('hidden')) {
        filterDropdownMenu.classList.remove('hidden');
    } else {
        filterDropdownMenu.classList.add('hidden');
    }
});

clear_filter_button.addEventListener("click", async function () {
    filterDropdownText.innerHTML = "Filter By"
    filterSearch.placeholder = "Choose a filter"
    filterSearch.value = ""
    reservations = await getReservations();
    console.log(reservations)
    if (Array.isArray(reservations)) {
        showReservations(reservations);
    }
    clear_filter_button.classList.add("hidden")
});

filterSearchButton.addEventListener("click", async function () {
    let filterChoice = filterDropdownText.innerHTML;
    let searchInput = filterSearch.value;
    if (filterChoice === "Filter By") {
        filterDropdownButton.classList.add("animate-pulse", "bg-[#1e3a2a]/10", "text-[#1e3a2a]");
        filterDropdownButton.addEventListener("click", function () {
            filterDropdownButton.classList.remove("animate-pulse", "bg-[#1e3a2a]/10", "text-[#1e3a2a]")
        });
    }
    else if (searchInput == '') {
        filterSearch.classList.add("placeholder:text-slate-400", "animate-pulse")
        filterSearch.addEventListener("click", function () {
            filterSearch.classList.remove("placeholder:text-slate-400", "animate-pulse")
        });
    }
    else if (filterChoice === "Building") {
        if (searchInput != "") {
            clear_filter_button.classList.remove("hidden")
        }
        let building = searchInput;
        let filteredReservations = await getReservationsByBuilding(building);
        if (Array.isArray(filteredReservations)) {
            showReservations(filteredReservations);
        }

    }
    else if (filterChoice === "Room") {
        if (searchInput != "") {
            clear_filter_button.classList.remove("hidden")
        }
        let room = searchInput;
        let filteredReservations = await getReservationsByRoom(room);
        if (Array.isArray(filteredReservations)) {
            showReservations(filteredReservations);
        }
    }
    else if (filterChoice === "Date") {
        if (searchInput != "") {
            clear_filter_button.classList.remove("hidden")
        }
        let date = searchInput;
        let filteredReservations = await getReservationsByDate(date);
        if (Array.isArray(filteredReservations)) {
            showReservations(filteredReservations);
        }
    }
});

window.addEventListener('click', (event) => {
    if (!filterDropdownMenu.classList.contains('hidden')) {
        filterDropdownMenu.classList.add('hidden');
    }
});