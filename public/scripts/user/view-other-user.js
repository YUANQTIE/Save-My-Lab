const table = document.getElementById("table");
const tbody = document.getElementById("tbody");
const profile_username = document.getElementById("profile_username");
const profile_image = document.getElementById("profile_image");
const noReservations = document.getElementById("noReservations")
const url = new URLSearchParams(window.location.search);
const userId = url.get('id');
let reservations;
let listOfReservations = []
class reservation {
    constructor(id, building, roomName, startDate, startTime, endTime) {
        this.id = id,
        this.building = building;
        this.roomName = roomName;
        this.startDate = startDate;
        this.startTime = startTime;
        this.endTime = endTime;
    }
}

$(document).ready(async function () {
    console.log("Profile-Settings Script running");
    $("#profile-settings").on("click", async function (e) {
        e.preventDefault();
        try {
            window.location.href = `/user/view-other-user-profile?id=${userId}`
        } catch (err) {
            console.error("Login Error:", err);
            alert("An error occurred. Check the F12 console.");
        }
    });

    $("#reservations").on("click", async function (e) {
        e.preventDefault();
        try {
            window.location.href = `/user/account-reserve?id=${userId}`
        } catch (err) {
            console.error("Login Error:", err);
            alert("An error occurred. Check the F12 console.");
        }
    });
    reservations = await getReservations();
    console.log("Reservations of Searched User: ", reservations)
    if (Array.isArray(reservations)) {
        showReservations(reservations);
    }
})

async function showReservations(reservations) {
    tbody.innerHTML = "";
    let listOfReservations = []
    if(reservations.length == 0) {
        noReservations.classList.remove("hidden")
    }
    else {
        noReservations.classList.add("hidden")
    }

    reservations.forEach(res => {
        const rawStart = res.reservation_start_timestamp.replace('Z', '').replace(' ', 'T');
        const rawStartDate = new Date(rawStart);
        const startDate = new Date(res.reservation_start_timestamp);
        const endDate = new Date(res.reservation_end_timestamp);
        let currentDate = new Date();
        let currentTime = currentDate.toLocaleTimeString('en-US', { hour12: false })
        let endTime = endDate.toLocaleTimeString('en-GB', {
            timeZone: 'UTC',
            hour12: false
        });
        const formattedCurrentDate = new Intl.DateTimeFormat('en-US', {
            month: 'long',
            day: '2-digit',
            year: 'numeric',
            timeZone: 'UTC'
        }).format(currentDate);

        const formattedStartDate = new Intl.DateTimeFormat('en-US', {
            month: 'long',
            day: '2-digit',
            year: 'numeric',
            timeZone: 'UTC'
        }).format(startDate);

        const convertedStartDate = convertDate(formattedStartDate)
        const convertedCurrentDate = convertDate(formattedCurrentDate)

        if (convertedStartDate < convertedCurrentDate) {
            console.log("Earlier")
            return;
        }


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

        if (convertedStartDate == convertedCurrentDate && endTime < currentTime) {
            console.log("Time earlier")
            return;
        }

        listOfReservations.push(new reservation(
            res.reservation_id,
            res.building,
            res.room_name,
            rawStartDate,
            formattedStartTime,
            formattedEndTime,)
        );
    });
    listOfReservations.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
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
}

function addRow(reservationId, building, room, date, startTime, endTime) {
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
            <td class="border-b border-default px-6 py-4">
              ${room}
            </td>
            <td class="border-b border-default px-6 py-4">
              ${date}
            </td>
            <td class="border-b border-default px-6 py-4">
              ${startTime}
            </td>
            <td class="border-b border-default w-[120px] px-6 py-4">
              ${endTime}
            </td>
        <td class="border-b border-default px-4 py-4 space-x-1.5">
            <div class="flex items-center justify-center">
              <button id="view_button" class = "w-8 h-8 flex items-center justify-center view_button_class text-slate-600 hover:bg-[#34493e]/5 hover:border-[#34493e]/20 hover:text-[#34493e]">
                <img src="/images/seat.png" alt="View" class="w-5 h-5">
              </button>
            </div>
        </td>
    `;

    // Append to the table body
    tbody.appendChild(tr);
}

async function getReservations() {
    const response = await fetch(`/reservations/api/list/${userId}`);
    if (!response.ok) {
        console.error("Server error:", response.status);
        return [];
    }

    return await response.json();
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

table.addEventListener("click", viewRow);

function convertDate(date) {
    const dateObj = new Date(date);

    // Extract parts
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(dateObj.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
}