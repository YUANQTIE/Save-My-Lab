const LynnFromLasVegasModals = document.getElementById("LynnFromLasVegasModals");
const area = document.getElementById("chosen-seats");
const closeButton = document.querySelector(".close-button");
const reservationBody = document.getElementById("reservationBody");
const confirmDeleteModal = document.getElementById("confirmDeleteModal");
const confirmYes = document.getElementById("confirmDeleteYes");
const closeConfirm = document.querySelector(".close-confirm");

let pendingDeleteIndex = null;

const contents = [
  {
    building: "Gokongwei Bldg.",
    room: "G205",
    date: "June 9, 2005",
    time: "8:00 AM - 8:30 AM",
    dateReserved: "June 6, 2005",
    timeReserved: "6:20 AM",
    reservedBy: "merry_ong@dlsu.edu.ph",
    seats: ["G205-6", "G205-7", "G205-8", "G205-9", "G205-10", "G205-11"],
    canDelete: false
  },
  {
    building: "Gokongwei Bldg.",
    room: "G205",
    date: "June 9, 2005",
    time: "7:00 AM - 7:30 AM",
    dateReserved: "June 6, 2005",
    timeReserved: "6:30 AM",
    reservedBy: "admin@dlsu.edu.ph",
    seats: ["G205-6", "G205-7", "G205-8", "G205-9", "G205-10", "G205-11"],
    canDelete: true
  },
  {
    building: "Andrew Bldg.",
    room: "A1902",
    date: "June 9, 2005",
    time: "8:30 AM - 9:00 AM",
    dateReserved: "June 6, 2025",
    timeReserved: "12:51 AM",
    reservedBy: "nigel_so@dlsu.edu.ph",
    seats: ["A1902-6", "A1902-7"],
    canDelete: false
  },
  {
    building: "Lasalle Hall",
    room: "LS228",
    date: "October 13, 2023",
    time: "1:30 PM - 2:00 PM",
    dateReserved: "January 2, 2025",
    timeReserved: "7:21 PM",
    reservedBy: "yuan_miguel_panlilio@dlsu.edu.ph",
    seats: ["LS228-1", "LS228-2"],
    canDelete: false
  },
  {
    building: "Yuchengco Building",
    room: "Y604",
    date: "December 7, 2026",
    time: "8:30 PM - 9:00 PM",
    dateReserved: "February 8, 2026",
    timeReserved: "10:40 PM",
    reservedBy: "admin@dlsu.edu.ph",
    seats: ["Y604-13", "Y604-14", "Y604-15"],
    canDelete: true
  },
  {
    building: "Yuchengco Building",
    room: "Y606",
    date: "December 7, 2026",
    time: "8:00 PM - 8:30 PM",
    dateReserved: "February 8, 2026",
    timeReserved: "10:40 PM",
    reservedBy: "princess_tullao@dlsu.edu.ph",
    seats: ["Y606-2"],
    canDelete: false
  }
];

function createRow(res, index) {
  const tr = document.createElement("tr");

  tr.innerHTML = `
    <td>${res.building}</td>
    <td>${res.room}</td>
    <td>${res.date}</td>
    <td>${res.time}</td>
    <td>${res.dateReserved}</td>
    <td>${res.timeReserved}</td>
    <td>${res.reservedBy}</td>
    <td class="actions">
      <button class="button icon-button seat-button" type="button" data-index="${index}">
        <img src="../../images/seat.png" alt="Seats">
      </button>

      <button class="button icon-button edit-button" type="button" data-index="${index}">
        <img src="../../images/edit.png" alt="Edit">
      </button>

      ${
        res.canDelete
          ? `<button class="button icon-button button-red delete-button" type="button" data-index="${index}">
               <img src="../../images/trash.jpg" alt="Delete">
             </button>`
          : ``
      }
    </td>
  `;

  return tr;
}

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
              <a href="#" id="edit_button" class="view_button_class font-medium text-fg-brand hover:underline">Edit</a>
              <button type="button" class="open-modal-btn font-medium text-fg-brand hover:underline">
                Delete
            </button>
              <el-dialog>
                <dialog id="${uniqueDialogId}" aria-labelledby="dialog-title"
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
                        <button id="delete_button" type="button" onclick="this.closest('dialog').close()"
                          class="delete_button_class w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-red-500 sm:ml-3 sm:w-auto">Delete</button>
                        <button type="button" onclick="this.closest('dialog').close()"
                          class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs inset-ring inset-ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">Cancel</button>
                      </div>
                    </el-dialog-panel>
                  </div>
                </dialog>
              </el-dialog>
            </td>
    `;

    // ADD AN EVENT LISTENER TO THE "OPEN" BUTTON
    tr.querySelector('.open-modal-btn').addEventListener('click', () => {
        const dialog = tr.querySelector('dialog');
        if (dialog) dialog.showModal();
    });

    // Append to the table body
    tbody.appendChild(tr);
}

async function deleteRow(e) {
    const btn = e.target.closest(".delete_button_class");
    if (!btn) return;


    const row = btn.closest("tr");
    if (!row) {
        console.error("Could not find the parent row for this button.");
        return;
    }

    const reservationId = row.getAttribute('data-id');

    console.log("Deleting Reservation ID:", reservationId);

    row.remove();
    const response = await fetch(`/reservations/${reservationId}/delete`, { method: 'DELETE' });
    console.log(response)
}


function renderTable() {
  reservationBody.innerHTML = "";
  contents.forEach((res, i) => {
    reservationBody.appendChild(createRow(res, i));
  });
}

function openSeatsModal(seatsArray) {
  area.innerHTML = "";

  seatsArray.forEach(seat => {
    const seatNo = document.createElement("div");
    seatNo.className = "seat-display";
    seatNo.textContent = seat;
    area.appendChild(seatNo);
  });

  LynnFromLasVegasModals.classList.remove("hidden");
}

function closeSeatsModal() {
  LynnFromLasVegasModals.classList.add("hidden");
}

function openConfirmDelete(idx) {
  pendingDeleteIndex = idx;
  confirmDeleteModal.classList.remove("hidden");
}

function closeConfirmDelete() {
  confirmDeleteModal.classList.add("hidden");
  pendingDeleteIndex = null;
}

document.addEventListener("click", (e) => {
  const seatBtn = e.target.closest(".seat-button");
  if (seatBtn) {
    const idx = parseInt(seatBtn.dataset.index, 10);
    openSeatsModal(contents[idx].seats);
    
    return;
  }

  const delBtn = e.target.closest(".delete-button");
  if (delBtn) {
    const idx = parseInt(delBtn.dataset.index, 10);
    openConfirmDelete(idx);
    
    return;
  }

  const editBtn = e.target.closest(".edit-button");
  if (editBtn) {
    const idx = parseInt(editBtn.dataset.index, 10);
    localStorage.setItem("editReservation", JSON.stringify(contents[idx]));
    window.location.href = "edit-reservation.html";
    return;
  }

  if (e.target.classList.contains("modal-backdrop")) {
    closeSeatsModal();
    closeConfirmDelete();
  }
});

closeButton.addEventListener("click", closeSeatsModal);

closeConfirm.addEventListener("click", closeConfirmDelete);

confirmYes.addEventListener("click", () => {
  contents.splice(pendingDeleteIndex, 1);
  renderTable();
  
  closeConfirmDelete();
});

renderTable();
