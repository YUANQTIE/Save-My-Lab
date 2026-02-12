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
        <img src="../../images/edit.jpg" alt="Edit">
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
