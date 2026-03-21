const table = document.getElementById("table");
const tbody = document.getElementById("tbody");
const delete_button = document.getElementById("delete_button");
const profile_image = document.getElementById("profile_image");
const input_file = document.getElementById("input_file");
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
const url = new URLSearchParams(window.location.search);
const userId = url.get('id');
let reservations;
$(document).ready(async function () {
    console.log("Profile-Settings Script running");
    $("#profile-settings").on("click", async function (e) {
        e.preventDefault();
        try {
            window.location.href = `/user/profile-settings?id=${userId}`
        } catch (err) {
            console.error("Login Error:", err);
            alert("An error occurred. Check the F12 console.");
        }
    });

    $("#account-security").on("click", async function (e) {
        e.preventDefault();
        try {
            window.location.href = `/user/account-security?id=${userId}`
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

    let seats;
    reservations = await getReservations();
    console.log(reservations)
    if (Array.isArray(reservations)) {
        const tbody = document.getElementById("tbody");
        tbody.innerHTML = "";

        reservations.forEach(res => {
            const startDate = new Date(res.reservation_start_timestamp);
            const endDate = new Date(res.reservation_end_timestamp);

            const formattedStartDate = new Intl.DateTimeFormat('en-US', {
                month: 'long',
                day: '2-digit',
                year: 'numeric'
            }).format(startDate);

            const formattedStartTime = new Intl.DateTimeFormat('en-US', {
                hour: 'numeric',
                minute: 'numeric',
                hour12: true
            }).format(startDate);

            const formattedEndTime = new Intl.DateTimeFormat('en-US', {
                hour: 'numeric',
                minute: 'numeric',
                hour12: true
            }).format(endDate);
            addRow(
                res.reservation_id,
                res.building,
                res.room_name,
                formattedStartDate,
                formattedStartTime,
                formattedEndTime
            );
        });
    }
})

async function getReservations() {
    // This matches the new route in Step B
    const response = await fetch(`/reservations/api/list/${userId}`);

    if (!response.ok) {
        console.error("Server error:", response.status);
        return [];
    }

    return await response.json();
}


input_file.addEventListener("click", changePicture);

table.addEventListener("click", viewRow);

dropdownButton.addEventListener("click", function () {
    dropdown.classList.toggle("hidden");
});

building_option.addEventListener("click", function () {
    sort_text.innerHTML = "Building";
    dropdown.classList.toggle("hidden");
});

room_option.addEventListener("click", function () {
    sort_text.innerHTML = "Room";
    dropdown.classList.toggle("hidden");
});

date_option.addEventListener("click", function () {
    sort_text.innerHTML = "Date";
    dropdown.classList.toggle("hidden");
});

start_time_option.addEventListener("click", function () {
    sort_text.innerHTML = "Start Time";
    dropdown.classList.toggle("hidden");
});

end_time_option.addEventListener("click", function () {
    sort_text.innerHTML = "End Time";
    dropdown.classList.toggle("hidden");
});


function addRow(reservationId, building, room, date, startTime, endTime) {
    const uniqueDialogId = `dialog-${reservationId}`;

    // Create the row element
    const tr = document.createElement('tr');
    tr.setAttribute('data-id', reservationId);
    tr.className = "odd:bg-neutral-primary even:bg-neutral-secondary-soft border-b border-default";

    // Set the internal HTML
    tr.innerHTML = `
        <td scope="row" class="px-6 py-4 font-medium text-heading whitespace-nowrap">
              ${building}
            </td>
            <td class="px-6 py-4">
              ${room}
            </td>
            <td class="px-6 py-4">
              ${date}
            </td>
            <td class="px-6 py-4">
              ${startTime}
            </td>
            <td class="w-[120px] px-6 py-4">
              ${endTime}
            </td>
        <td class="px-6 py-4 space-x-1.5">
              <a href="#" id="view_button" class="view_button_class font-medium text-fg-brand hover:underline">View</a>
              <a href="#" id="edit_button" class="edit_button_class font-medium text-fg-brand hover:underline">Edit</a>
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
            console.log(seat)
            view_modal_body.append(seat)
            view_modal_body.append(" ")
        });
    }

    hide_view_modal.addEventListener("click", function () {
        view_modal.classList.add("hidden")
    });

    confirm_okay.addEventListener("click", function () {
        view_modal.classList.add("hidden")
    });
}


function changePicture() {
    input_file.onchange = function () {
        profile_image.src = URL.createObjectURL(input_file.files[0]);
    }
}