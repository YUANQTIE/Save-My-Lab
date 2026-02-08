const venueSelect = document.getElementById("venueSelect");
const roomSelect  = document.getElementById("roomSelect");
const dateInput   = document.getElementById("dateInput");
const timeSelect  = document.getElementById("timeSelect");
const roomBox = document.getElementById("roomBox");
const dateBox = document.getElementById("dateBox");
const timeBox = document.getElementById("timeBox");
const confirmBtn = document.getElementById("confirmBtn");
const virusContainer = document.getElementById("virusContainer");
const virusText = document.getElementById("virusText");
const brokenContainer = document.getElementById("brokenContainer");
const brokenText = document.getElementById("brokenText");

const venueRooms = {
  "Gokongwei Building": ["G201", "G202", "G203"],
  "LS Building": ["LS226", "LS227", "LS228"],
  "Yuchengco Building": ["Y604", "Y605", "Y606"],
  "Andrew Building": ["A1903", "A1904", "A1905"]
};

const roomSeatMap = {
  G201: { S1:"G201-1",S2:"G201-2",S3:"G201-3",S4:"G201-4",S5:"G201-5",S6:"G201-6",S7:"G201-7",S8:"G201-8",S9:"G201-9",S10:"G201-10",
    S11:"G201-11",S12:"G201-12",S13:"G201-13",S14:"G201-14",S15:"G201-15",S16:"G201-16",S17:"G201-17",S18:"G201-18",S19:"G201-19",S20:"G201-20",
    S21:"G201-21",S22:"G201-22",S23:"G201-23",S24:"G201-24",S25:"G201-25",S26:"G201-26",S27:"G201-27",S28:"G201-28",S29:"G201-29",S30:"G201-30",
    S31:"G201-31",S32:"G201-32",S33:"G201-33",S34:"G201-34",S35:"G201-35",S36:"G201-36",S37:"G201-37",S38:"G201-38",S39:"G201-39",S40:"G201-40",
    S41:"G201-41",S42:"G201-42",S43:"G201-43",S44:"G201-44",S45:"G201-45"
  },
  G202: { S1:"G202-1",S2:"G202-2",S3:"G202-3",S4:"G202-4",S5:"G202-5",S6:"G202-6",S7:"G202-7",S8:"G202-8",S9:"G202-9",S10:"G202-10",
    S11:"G202-11",S12:"G202-12",S13:"G202-13",S14:"G202-14",S15:"G202-15",S16:"G202-16",S17:"G202-17",S18:"G202-18",S19:"G202-19",S20:"G202-20",
    S21:"G202-21",S22:"G202-22",S23:"G202-23",S24:"G202-24",S25:"G202-25",S26:"G202-26",S27:"G202-27",S28:"G202-28",S29:"G202-29",S30:"G202-30",
    S31:"G202-31",S32:"G202-32",S33:"G202-33",S34:"G202-34",S35:"G202-35",S36:"G202-36",S37:"G202-37",S38:"G202-38",S39:"G202-39",S40:"G202-40",
    S41:"G202-41",S42:"G202-42",S43:"G202-43",S44:"G202-44",S45:"G202-45"
  },
  G203: { S1:"G203-1",S2:"G203-2",S3:"G203-3",S4:"G203-4",S5:"G203-5",S6:"G203-6",S7:"G203-7",S8:"G203-8",S9:"G203-9",S10:"G203-10",
    S11:"G203-11",S12:"G203-12",S13:"G203-13",S14:"G203-14",S15:"G203-15",S16:"G203-16",S17:"G203-17",S18:"G203-18",S19:"G203-19",S20:"G203-20",
    S21:"G203-21",S22:"G203-22",S23:"G203-23",S24:"G203-24",S25:"G203-25",S26:"G203-26",S27:"G203-27",S28:"G203-28",S29:"G203-29",S30:"G203-30",
    S31:"G203-31",S32:"G203-32",S33:"G203-33",S34:"G203-34",S35:"G203-35",S36:"G203-36",S37:"G203-37",S38:"G203-38",S39:"G203-39",S40:"G203-40",
    S41:"G203-41",S42:"G203-42",S43:"G203-43",S44:"G203-44",S45:"G203-45"
  },

  LS226: { S1:"LS226-1",S2:"LS226-2",S3:"LS226-3",S4:"LS226-4",S5:"LS226-5",S6:"LS226-6",S7:"LS226-7",S8:"LS226-8",S9:"LS226-9",S10:"LS226-10",
    S11:"LS226-11",S12:"LS226-12",S13:"LS226-13",S14:"LS226-14",S15:"LS226-15",S16:"LS226-16",S17:"LS226-17",S18:"LS226-18",S19:"LS226-19",S20:"LS226-20",
    S21:"LS226-21",S22:"LS226-22",S23:"LS226-23",S24:"LS226-24",S25:"LS226-25",S26:"LS226-26",S27:"LS226-27",S28:"LS226-28",S29:"LS226-29",S30:"LS226-30",
    S31:"LS226-31",S32:"LS226-32",S33:"LS226-33",S34:"LS226-34",S35:"LS226-35",S36:"LS226-36",S37:"LS226-37",S38:"LS226-38",S39:"LS226-39",S40:"LS226-40"
  },
  LS227: { S1:"LS227-1",S2:"LS227-2",S3:"LS227-3",S4:"LS227-4",S5:"LS227-5",S6:"LS227-6",S7:"LS227-7",S8:"LS227-8",S9:"LS227-9",S10:"LS227-10",
    S11:"LS227-11",S12:"LS227-12",S13:"LS227-13",S14:"LS227-14",S15:"LS227-15",S16:"LS227-16",S17:"LS227-17",S18:"LS227-18",S19:"LS227-19",S20:"LS227-20",
    S21:"LS227-21",S22:"LS227-22",S23:"LS227-23",S24:"LS227-24",S25:"LS227-25",S26:"LS227-26",S27:"LS227-27",S28:"LS227-28",S29:"LS227-29",S30:"LS227-30",
    S31:"LS227-31",S32:"LS227-32",S33:"LS227-33",S34:"LS227-34",S35:"LS227-35",S36:"LS227-36",S37:"LS227-37",S38:"LS227-38",S39:"LS227-39",S40:"LS227-40"
  },
  LS228: { S1:"LS228-1",S2:"LS228-2",S3:"LS228-3",S4:"LS228-4",S5:"LS228-5",S6:"LS228-6",S7:"LS228-7",S8:"LS228-8",S9:"LS228-9",S10:"LS228-10",
    S11:"LS228-11",S12:"LS228-12",S13:"LS228-13",S14:"LS228-14",S15:"LS228-15",S16:"LS228-16",S17:"LS228-17",S18:"LS228-18",S19:"LS228-19",S20:"LS228-20",
    S21:"LS228-21",S22:"LS228-22",S23:"LS228-23",S24:"LS228-24",S25:"LS228-25",S26:"LS228-26",S27:"LS228-27",S28:"LS228-28",S29:"LS228-29",S30:"LS228-30",
    S31:"LS228-31",S32:"LS228-32",S33:"LS228-33",S34:"LS228-34",S35:"LS228-35",S36:"LS228-36",S37:"LS228-37",S38:"LS228-38",S39:"LS228-39",S40:"LS228-40"
  },

  Y604: { S1:"Y604-1",S2:"Y604-2",S3:"Y604-3",S4:"Y604-4",S5:"Y604-5",S6:"Y604-6",S7:"Y604-7",S8:"Y604-8",S9:"Y604-9",S10:"Y604-10",
    S11:"Y604-11",S12:"Y604-12",S13:"Y604-13",S14:"Y604-14",S15:"Y604-15",S16:"Y604-16",S17:"Y604-17",S18:"Y604-18",S19:"Y604-19",S20:"Y604-20",
    S21:"Y604-21",S22:"Y604-22",S23:"Y604-23",S24:"Y604-24",S25:"Y604-25",S26:"Y604-26",S27:"Y604-27",S28:"Y604-28",S29:"Y604-29",S30:"Y604-30",
    S31:"Y604-31",S32:"Y604-32",S33:"Y604-33",S34:"Y604-34",S35:"Y604-35",S36:"Y604-36",S37:"Y604-37",S38:"Y604-38",S39:"Y604-39",S40:"Y604-40",
    S41:"Y604-41",S42:"Y604-42",S43:"Y604-43",S44:"Y604-44",S45:"Y604-45",S46:"Y604-46",S47:"Y604-47",S48:"Y604-48",S49:"Y604-49",S50:"Y604-50",
    S51:"Y604-51",S52:"Y604-52"
  },
  Y605: { S1:"Y605-1",S2:"Y605-2",S3:"Y605-3",S4:"Y605-4",S5:"Y605-5",S6:"Y605-6",S7:"Y605-7",S8:"Y605-8",S9:"Y605-9",S10:"Y605-10",
    S11:"Y605-11",S12:"Y605-12",S13:"Y605-13",S14:"Y605-14",S15:"Y605-15",S16:"Y605-16",S17:"Y605-17",S18:"Y605-18",S19:"Y605-19",S20:"Y605-20",
    S21:"Y605-21",S22:"Y605-22",S23:"Y605-23",S24:"Y605-24",S25:"Y605-25",S26:"Y605-26",S27:"Y605-27",S28:"Y605-28",S29:"Y605-29",S30:"Y605-30",
    S31:"Y605-31",S32:"Y605-32",S33:"Y605-33",S34:"Y605-34",S35:"Y605-35",S36:"Y605-36",S37:"Y605-37",S38:"Y605-38",S39:"Y605-39",S40:"Y605-40",
    S41:"Y605-41",S42:"Y605-42",S43:"Y605-43",S44:"Y605-44",S45:"Y605-45",S46:"Y605-46",S47:"Y605-47",S48:"Y605-48",S49:"Y605-49",S50:"Y605-50",
    S51:"Y605-51",S52:"Y605-52"
  },
  Y606: { S1:"Y606-1",S2:"Y606-2",S3:"Y606-3",S4:"Y606-4",S5:"Y606-5",S6:"Y606-6",S7:"Y606-7",S8:"Y606-8",S9:"Y606-9",S10:"Y606-10",
    S11:"Y606-11",S12:"Y606-12",S13:"Y606-13",S14:"Y606-14",S15:"Y606-15",S16:"Y606-16",S17:"Y606-17",S18:"Y606-18",S19:"Y606-19",S20:"Y606-20",
    S21:"Y606-21",S22:"Y606-22",S23:"Y606-23",S24:"Y606-24",S25:"Y606-25",S26:"Y606-26",S27:"Y606-27",S28:"Y606-28",S29:"Y606-29",S30:"Y606-30",
    S31:"Y606-31",S32:"Y606-32",S33:"Y606-33",S34:"Y606-34",S35:"Y606-35",S36:"Y606-36",S37:"Y606-37",S38:"Y606-38",S39:"Y606-39",S40:"Y606-40",
    S41:"Y606-41",S42:"Y606-42",S43:"Y606-43",S44:"Y606-44",S45:"Y606-45",S46:"Y606-46",S47:"Y606-47",S48:"Y606-48",S49:"Y606-49",S50:"Y606-50",
    S51:"Y606-51",S52:"Y606-52"
  },

  A1903: { S1:"A1903-1",S2:"A1903-2",S3:"A1903-3",S4:"A1903-4",S5:"A1903-5",S6:"A1903-6",S7:"A1903-7",S8:"A1903-8",S9:"A1903-9",S10:"A1903-10",
    S11:"A1903-11",S12:"A1903-12",S13:"A1903-13",S14:"A1903-14",S15:"A1903-15",S16:"A1903-16",S17:"A1903-17",S18:"A1903-18",S19:"A1903-19",S20:"A1903-20",
    S21:"A1903-21",S22:"A1903-22",S23:"A1903-23",S24:"A1903-24",S25:"A1903-25",S26:"A1903-26",S27:"A1903-27",S28:"A1903-28",S29:"A1903-29",S30:"A1903-30",
    S31:"A1903-31",S32:"A1903-32"
  },
  A1904: { S1:"A1904-1",S2:"A1904-2",S3:"A1904-3",S4:"A1904-4",S5:"A1904-5",S6:"A1904-6",S7:"A1904-7",S8:"A1904-8",S9:"A1904-9",S10:"A1904-10",
    S11:"A1904-11",S12:"A1904-12",S13:"A1904-13",S14:"A1904-14",S15:"A1904-15",S16:"A1904-16",S17:"A1904-17",S18:"A1904-18",S19:"A1904-19",S20:"A1904-20",
    S21:"A1904-21",S22:"A1904-22",S23:"A1904-23",S24:"A1904-24",S25:"A1904-25",S26:"A1904-26",S27:"A1904-27",S28:"A1904-28",S29:"A1904-29",S30:"A1904-30",
    S31:"A1904-31",S32:"A1904-32"
  },
  A1905: { S1:"A1905-1",S2:"A1905-2",S3:"A1905-3",S4:"A1905-4",S5:"A1905-5",S6:"A1905-6",S7:"A1905-7",S8:"A1905-8",S9:"A1905-9",S10:"A1905-10",
    S11:"A1905-11",S12:"A1905-12",S13:"A1905-13",S14:"A1905-14",S15:"A1905-15",S16:"A1905-16",S17:"A1905-17",S18:"A1905-18",S19:"A1905-19",S20:"A1905-20",
    S21:"A1905-21",S22:"A1905-22",S23:"A1905-23",S24:"A1905-24",S25:"A1905-25",S26:"A1905-26",S27:"A1905-27",S28:"A1905-28",S29:"A1905-29",S30:"A1905-30",
    S31:"A1905-31",S32:"A1905-32"
  }
};

const virusSeatIds = new Set();
const brokenSeatIds = new Set();  

function showVenueLayout(venue) {
  document.querySelectorAll(".venue-layout").forEach(layout => {
    layout.classList.toggle("hidden", layout.dataset.venue !== venue);
  });
}

function setSeatsEnabled(enabled) {
  document.querySelectorAll(".venue-layout").forEach(layout => {
    layout.classList.toggle("seats-enabled", enabled);
  });
}

function updateConfirmButton() {
  const ready =
    venueSelect.value &&
    roomSelect.value &&
    dateInput.value &&
    timeSelect.value;

  confirmBtn.disabled = !(ready && (virusSeatIds.size + brokenSeatIds.size > 0));
}

function setListBox(boxEl, textEl, setObj) {
  const list = Array.from(setObj);

  if (list.length === 0) {
    boxEl.classList.add("hidden");
    textEl.textContent = "None";
    return;
  }

  list.sort((a,b) => {
    const an = parseInt(a.split("-").pop(), 10);
    const bn = parseInt(b.split("-").pop(), 10);
    if (Number.isFinite(an) && Number.isFinite(bn)) return an - bn;
    return a.localeCompare(b);
  });

  boxEl.classList.remove("hidden");
  textEl.textContent = list.join(", ");
}

function updateStatusUI() {
  setListBox(virusContainer, virusText, virusSeatIds);
  setListBox(brokenContainer, brokenText, brokenSeatIds);
}

function tagSeatSlots() {
  document.querySelectorAll(".venue-layout").forEach(layout => {
    const seats = layout.querySelectorAll(".seat");
    seats.forEach((seat, idx) => {
      seat.dataset.slot = `S${idx + 1}`;
    });
  });
}

function tagSeatBaseColors() {
  document.querySelectorAll(".venue-layout .seat").forEach(seat => {
    seat.dataset.base = seat.classList.contains("red") ? "red" : "black";
  });
}

function populateRoomsForVenue(venue) {
  const rooms = venueRooms[venue] || [];
  roomSelect.innerHTML = `<option value="" disabled selected>Input Room...</option>`;
  rooms.forEach(r => {
    const opt = document.createElement("option");
    opt.value = r;
    opt.textContent = r;
    roomSelect.appendChild(opt);
  });
}

function clearAllSeatMarks(layout) {
  layout.querySelectorAll(".seat").forEach(seat => {
    seat.classList.remove("purple", "blue");
  });

  virusSeatIds.clear();
  brokenSeatIds.clear();
  updateStatusUI();
  updateConfirmButton();
}

function applyRoomToVisibleLayout(roomId) {
  const visibleLayout = document.querySelector(".venue-layout:not(.hidden)");
  if (!visibleLayout) return;

  const map = roomSeatMap[roomId] || {};
  const seats = visibleLayout.querySelectorAll(".seat");

  seats.forEach(seat => {
    delete seat.dataset.seatId;

    const slot = seat.dataset.slot;
    const seatId = map[slot];

    if (seatId) {
      seat.dataset.seatId = seatId;
      seat.classList.remove("hidden");
    } else {
      seat.classList.add("hidden");
    }
  });
}

venueSelect.addEventListener("change", () => {
  const venue = venueSelect.value;
  showVenueLayout(venue);
  populateRoomsForVenue(venue);

  roomBox.classList.remove("hidden");
  dateBox.classList.add("hidden");
  timeBox.classList.add("hidden");

  roomSelect.selectedIndex = 0;
  dateInput.value = "";
  timeSelect.selectedIndex = 0;

  virusSeatIds.clear();
  brokenSeatIds.clear();
  updateStatusUI();

  setSeatsEnabled(false);
  updateConfirmButton();
});

roomSelect.addEventListener("change", () => {
  dateBox.classList.remove("hidden");
  timeBox.classList.add("hidden");

  dateInput.value = "";
  timeSelect.selectedIndex = 0;

  setSeatsEnabled(false);
  applyRoomToVisibleLayout(roomSelect.value);

  updateConfirmButton();
});

dateInput.addEventListener("change", () => {
  timeBox.classList.remove("hidden");
  timeSelect.selectedIndex = 0;

  setSeatsEnabled(false);
  updateConfirmButton();
});

timeSelect.addEventListener("change", () => {
  setSeatsEnabled(timeSelect.value !== "");
  updateConfirmButton();
});

document.addEventListener("click", (e) => {
  const seat = e.target.closest(".seat");
  if (!seat) return;

  const visibleLayout = document.querySelector(".venue-layout:not(.hidden)");
  if (!visibleLayout || !visibleLayout.classList.contains("seats-enabled")) return;

  const seatId = seat.dataset.seatId;
  if (!seatId) return;

  const base = seat.dataset.base || (seat.classList.contains("red") ? "red" : "black");

  const isBlue = seat.classList.contains("blue");
  const isPurple = seat.classList.contains("purple");

  if (!isBlue && !isPurple) {
    seat.classList.remove("red");
    seat.classList.add("blue");

    virusSeatIds.add(seatId);
    brokenSeatIds.delete(seatId);
  }
  else if (isBlue) {
    seat.classList.remove("blue");
    seat.classList.add("purple");

    virusSeatIds.delete(seatId);
    brokenSeatIds.add(seatId);
  }
  else {
    seat.classList.remove("purple");

    virusSeatIds.delete(seatId);
    brokenSeatIds.delete(seatId);

    if (base === "red") seat.classList.add("red");
    else seat.classList.remove("red");
  }

  updateStatusUI();
  updateConfirmButton();
});

confirmBtn.addEventListener("click", () => {
  if (confirmBtn.disabled) return;

  alert(
    `CONFIRMED!\n\nVenue: ${venueSelect.value}\nRoom: ${roomSelect.value}\nDate: ${dateInput.value}\nTime: ${timeSelect.value}\n\nVirus: ${Array.from(virusSeatIds).join(", ") || "None"}\nBroken: ${Array.from(brokenSeatIds).join(", ") || "None"}`
  );

  const visibleLayout = document.querySelector(".venue-layout:not(.hidden)");
  if (visibleLayout) {
    visibleLayout.querySelectorAll(".seat.purple, .seat.blue").forEach(s => {
      s.classList.remove("purple", "blue");
    });
  }

  virusSeatIds.clear();
  brokenSeatIds.clear();
  updateStatusUI();
  updateConfirmButton();
});

tagSeatSlots();
tagSeatBaseColors();
setSeatsEnabled(false);