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
const url = new URLSearchParams(window.location.search);
const userId = url.get('id');

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

    const reservations = await getReservations();
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

table.addEventListener("click", deleteRow);

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


function addRow(building, room, date, startTime, endTime) {
    tbody.innerHTML += `
        <tr class="odd:bg-neutral-primary even:bg-neutral-secondary-soft border-b border-default">
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
              <a href="#" id="view_button" class="font-medium text-fg-brand hover:underline">View</a>
              <a href="#" id="edit_button" class="font-medium text-fg-brand hover:underline">Edit</a>
              <button command="show-modal" commandfor="dialog"
                class="rounded-md bg-white py-1.5 text-fg-brand font-medium text-gray-900 hover:underline">Delete</button>
              <el-dialog>
                <dialog id="dialog" aria-labelledby="dialog-title"
                  class="fixed inset-0 size-auto max-h-none max-w-none overflow-y-auto bg-transparent backdrop:bg-transparent">
                  <el-dialog-backdrop
                    class="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"></el-dialog-backdrop>
                  <div tabindex="0"
                    class="flex min-h-full items-end justify-center p-4 text-center focus:outline-none sm:items-center sm:p-0">
                    <el-dialog-panel
                      class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95">
                      <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div class="sm:flex sm:items-start">
                          <div
                            class="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-10">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
                              data-slot="icon" aria-hidden="true" class="size-6 text-red-600">
                              <path
                                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                                stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                          </div>
                          <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                            <h3 id="dialog-title" class="text-base font-semibold text-gray-900">Delete reservation</h3>
                            <div class="mt-2">
                              <p class="text-sm text-gray-500">Are you sure you want to permanently delete your
                                reservation? This action cannot be undone.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                        <button id="delete_button" type="button" command="close" commandfor="dialog"
                          class="delete_button_class w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-red-500 sm:ml-3 sm:w-auto">Delete</button>
                        <button type="button" command="close" commandfor="dialog"
                          class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs inset-ring inset-ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">Cancel</button>
                      </div>
                    </el-dialog-panel>
                  </div>
                </dialog>
              </el-dialog>
            </td>
          </tr>
    `
}

function deleteRow(e) {
    const btn = e.target.closest(".delete_button_class");

    if (!btn) {
        return;
    }

    btn.closest("tr").remove();
}


function changePicture() {
    input_file.onchange = function () {
        profile_image.src = URL.createObjectURL(input_file.files[0]);
    }
}