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
const userDropdownMenu = document.getElementById("userDropdownMenu")
const search = document.getElementById("search")
const noReservations = document.getElementById("noReservations")
const url = new URLSearchParams(window.location.search);
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

    $(document).on("click", ".edit_button_class", function(e) {
        e.preventDefault();

        const row = $(this).closest("tr");
        const reservationId = row.data("id");
        window.location.href = `/user/edit-reservation?resId=${reservationId}`;
    });
    
    $("#profile-settings").on("click", async function (e) {
        e.preventDefault();
        try {
            window.location.href = `/user/profile-settings`
        } catch (err) {
            console.error("Login Error:", err);
            alert("An error occurred. Check the F12 console.");
        }
    });

    $("#account-security").on("click", async function (e) {
        e.preventDefault();
        try {
            window.location.href = `/user/account-security`
        } catch (err) {
            console.error("Login Error:", err);
            alert("An error occurred. Check the F12 console.");
        }
    });

    $("#reservations").on("click", async function (e) {
        e.preventDefault();
        try {
            window.location.href = `/user/account-reserve`
        } catch (err) {
            console.error("Login Error:", err);
            alert("An error occurred. Check the F12 console.");
        }
    });

    reservations = await getReservations();
    console.log(reservations)
    if (Array.isArray(reservations)) {
        showReservations(reservations);
    }
})

async function showReservations(reservations) {
    if(reservations.length == 0) {
        noReservations.classList.remove("hidden")
    }
    else {
        noReservations.classList.add("hidden")
    }
    tbody.innerHTML = "";
    let listOfReservations = []

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

input_file.addEventListener("click", changePicture);

table.addEventListener("click", viewRow);

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


function changePicture() {
    input_file.onchange = function () {
        profile_image.src = URL.createObjectURL(input_file.files[0]);
    }
}

async function getUserSearchSuggestions(input) {
    if (input.trim().length === 0) {
        userDropdownMenu.innerHTML = '';
        return;
    }
    const response = await fetch(`/user/searchRecommended?username=${input}`);
    const users = await response.json();
    userDropdownMenu.innerHTML = '';

    if (users.length === 0) {
        const li = document.createElement('li');
        li.className = "px-4 py-2 text-slate-600 text-sm";
        li.textContent = "No User Found";
        userDropdownMenu.appendChild(li);
    }

    for (let i = 0; i < 5 && i < users.length; i++) {
        let searchedUserId = users[i]._id;

        const li = document.createElement('li');
        li.setAttribute('data-id', searchedUserId);
        li.className = "userSuggestion px-4 py-2 text-slate-600 hover:bg-slate-50 text-sm cursor-pointer flex items-center gap-2";
        const img = document.createElement('img');
        console.log(users[i].profile_picture);
        img.src = users[i].profile_picture;
        img.alt = `${users[i].username}'s profile picture`;
        img.className = "w-6 h-6 rounded-full object-cover";
        const usernameSpan = document.createElement('span');
        usernameSpan.textContent = users[i].username;
        li.appendChild(img);
        li.appendChild(usernameSpan);
        userDropdownMenu.appendChild(li);
    }
}

async function viewUser(e) {
    const btn = e.target.closest(".userSuggestion")
    if (!btn) return;
    const user = btn.closest('li')
    const searchedUserId = user.getAttribute('data-id')
    search.value = ""
    userDropdownMenu.innerHTML = '';
    window.location.href = `/user/view-other-user-profile?id=${searchedUserId}`
}

search.addEventListener('input', (e) => {
    userDropdownMenu.innerHTML = ''; 
    getUserSearchSuggestions(e.target.value)
    console.log("Value changed to: " + e.target.value);
});

search.addEventListener('keydown', async (e) => {
  if (e.key === 'Enter') {
    // Prevent default form submission if necessary
    e.preventDefault(); 
    const username = e.target.value;
    console.log(username)
    userDropdownMenu.innerHTML = ''; 
    search.value = ""
    const response = await fetch(`/user/searchRecommended?username=${username}`)
    const user = await response.json()
    console.log("User: ", user)
    if(user.length == 0) {
        userDropdownMenu.innerHTML = ''; 
        const li = document.createElement('li')
        li.className = "px-4 py-2 text-slate-600 text-sm";
        li.innerHTML = "No User Found"
        userDropdownMenu.appendChild(li)
    }
    else if(user.length == 1) {
        const searchedUserId = user[0]._id
        window.location.href = `/user/view-other-user-profile?id=${searchedUserId}`
    }
    else {
        return
    }
  }
});

window.addEventListener('click', (event) => {
    userDropdownMenu.innerHTML = '';
});

search.addEventListener('click', (e) => {
    userDropdownMenu.innerHTML = ''; 
    getUserSearchSuggestions(e.target.value)
})

userDropdownMenu.addEventListener('click', viewUser);