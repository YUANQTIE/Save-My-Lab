const venueSelect = document.getElementById("venueSelect");
const roomSelect  = document.getElementById("roomSelect");
const dateInput   = document.getElementById("dateInput");
const startHour   = document.getElementById("startHour");
const startMinute = document.getElementById("startMinute");
const endHour     = document.getElementById("endHour");
const endMinute   = document.getElementById("endMinute");
const timeBox     = document.getElementById("timeBox");
const confirmBtn  = document.getElementById("confirmBtn");
const brokenContainer = document.getElementById("brokenContainer");
const brokenText      = document.getElementById("brokenText");
const brokenSeatIds   = new Set();
const confirmModal    = document.getElementById("confirmModal");
const closeConfirmBtn = document.querySelector(".close-confirm");
const confirmOkayBtn  = document.getElementById("confirmOkay");

const resVenue = document.getElementById("resVenue");
const resRoom  = document.getElementById("resRoom");
const resDate  = document.getElementById("resDate");
const resTime  = document.getElementById("resTime");
const resSeats = document.getElementById("resSeats");

const venueRooms = {
  "Gokongwei Building": ["G201", "G202", "G203", "G205"],
  "LS Building": ["LS226", "LS227", "LS228"],
  "Yuchengco Building": ["Y604", "Y605", "Y606"],
  "Andrew Building": ["A1902", "A1903", "A1904", "A1905"]
};

function buildingLabelToVenueSelectValue(label) {
  const x = (label || "").toLowerCase();

  if (x.includes("gokongwei")) return "Gokongwei Building";
  if (x.includes("andrew")) return "Andrew Building";
  if (x.includes("lasalle") || x.includes("ls")) return "LS Building";
  if (x.includes("yuchengco")) return "Yuchengco Building";

  return "";
}

function showVenueLayout(venue) {
  document.querySelectorAll(".venue-layout").forEach(layout => {
    layout.classList.toggle("hidden", layout.dataset.venue !== venue);
  });

  setSeatsEnabled(true);
}

function populateRooms(venue) {
  const rooms = venueRooms[venue] || [];
  roomSelect.innerHTML = `<option value="" disabled selected>Input Room...</option>`;
  rooms.forEach(r => {
    const opt = document.createElement("option");
    opt.value = r;
    opt.textContent = r;
    roomSelect.appendChild(opt);
  });
}

function toISODate(str) {
  const d = new Date(str);
  if (isNaN(d.getTime())) return "";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function parseOneTime(t) {
  const m = t.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!m) return null;
  let hh = parseInt(m[1], 10);
  const mm = m[2];
  const ap = m[3].toUpperCase();
  if (ap === "AM") { if (hh === 12) hh = 0; }
  else { if (hh !== 12) hh += 12; }
  return { hh: String(hh).padStart(2, "0"), mm };
}

function parseTimeRange(rangeStr) {
  if (!rangeStr || !rangeStr.includes("-")) return null;
  const [aRaw, bRaw] = rangeStr.split("-").map(s => s.trim());
  const a = parseOneTime(aRaw);
  const b = parseOneTime(bRaw);
  if (!a || !b) return null;
  return { sh: a.hh, sm: a.mm, eh: b.hh, em: b.mm };
}

function tagSeatsByOrder() {
  document.querySelectorAll(".venue-layout").forEach(layout => {
    layout.querySelectorAll(".seat").forEach((seat, idx) => {
      seat.dataset.seatNo = String(idx + 1);
    });
  });
}

function clearGreenSeats() {
  document.querySelectorAll(".venue-layout .seat").forEach(seat => {
    seat.classList.remove("green");
  });
}

function getVisibleLayout() {
  return document.querySelector(".venue-layout:not(.hidden)");
}

function markSeatsGreenFromList(roomId, seatIdList) {
  const visibleLayout = getVisibleLayout();
  if (!visibleLayout) return;

  const prefix = `${roomId}-`;

  (seatIdList || []).forEach(seatId => {
    if (!seatId || !seatId.startsWith(prefix)) return;

    const numStr = seatId.split("-").pop();
    const n = parseInt(numStr, 10);
    if (!Number.isFinite(n)) return;

    const seatEl = visibleLayout.querySelector(`.seat[data-seat-no="${n}"]`);
    if (!seatEl) return;

    seatEl.classList.add("green");
  });
}

function timeToMinutes(hhStr, mmStr) {
  const hh = parseInt(String(hhStr).trim(), 10);
  const mm = parseInt(String(mmStr).trim(), 10);
  if (!Number.isFinite(hh) || !Number.isFinite(mm)) return NaN;
  return hh * 60 + mm;
}

function getTimeRangeValue() {
  const sh = startHour.value.trim();
  const sm = startMinute.value.trim();
  const eh = endHour.value.trim();
  const em = endMinute.value.trim();
  if (!sh || !sm || !eh || !em) return "";
  return `${sh}:${sm} - ${eh}:${em}`;
}

function isTimeRangeValid() {
  const start = timeToMinutes(startHour.value, startMinute.value);
  const end   = timeToMinutes(endHour.value, endMinute.value);

  if (!Number.isFinite(start) || !Number.isFinite(end)) {
    timeBox.classList.add("invalid");
    return false;
  }

  const startH = startHour.value.trim();
  const startM = startMinute.value.trim();
  const endH   = endHour.value.trim();
  const endM   = endMinute.value.trim();

  const valid =
    end > start &&
    !(endH === "21" && endM === "30") &&
    !(endH === startH && endM === startM);

  timeBox.classList.toggle("invalid", !valid);
  return valid;
}

function setSeatsEnabled(enabled) {
  document.querySelectorAll(".venue-layout").forEach(layout => {
    const isVisible = !layout.classList.contains("hidden");
    layout.classList.toggle("seats-enabled", enabled && isVisible);
  });
}

function setListBox(boxEl, textEl, setObj) {
  const list = Array.from(setObj);

  if (list.length === 0) {
    boxEl.classList.add("hidden");
    textEl.textContent = "None";
    return;
  }

  list.sort((a, b) => {
    const an = parseInt(a.split("-").pop(), 10);
    const bn = parseInt(b.split("-").pop(), 10);
    if (Number.isFinite(an) && Number.isFinite(bn)) return an - bn;
    return a.localeCompare(b);
  });

  boxEl.classList.remove("hidden");
  textEl.textContent = list.join(", ");
}

function updateStatusUI() {
  setListBox(brokenContainer, brokenText, brokenSeatIds);
}

function seatKey(roomId, seatNo) {
  return `${roomId}-${seatNo}`;
}

function syncBrokenSeatIdsFromGreen() {
  brokenSeatIds.clear();

  const roomId = roomSelect.value;
  if (!roomId) {
    updateStatusUI();
    updateConfirmButton();
    return;
  }

  const visibleLayout = getVisibleLayout();
  if (!visibleLayout) {
    updateStatusUI();
    updateConfirmButton();
    return;
  }

  visibleLayout.querySelectorAll(".seat.green").forEach(seatEl => {
    const seatNo = seatEl.dataset.seatNo;
    if (seatNo) brokenSeatIds.add(seatKey(roomId, seatNo));
  });

  updateStatusUI();
  updateConfirmButton();
}

function updateConfirmButton() {
  const timeOk = Boolean(getTimeRangeValue()) && isTimeRangeValid();

  const ready = Boolean(
    venueSelect.value &&
    roomSelect.value &&
    dateInput.value &&
    timeOk &&
    brokenSeatIds.size > 0
  );

  confirmBtn.disabled = !ready;
}

function validateTimeBoxAndFlow() {
  const timeOk = Boolean(getTimeRangeValue()) && isTimeRangeValid();
  setSeatsEnabled(true); 
  updateConfirmButton();
  return timeOk;
}

function openConfirmModal() {
  confirmModal.classList.remove("hidden");
}

function closeConfirmModal() {
  confirmModal.classList.add("hidden");
}

function fillModalDetails() {
  resVenue.textContent = venueSelect.value || "—";
  resRoom.textContent  = roomSelect.value || "—";
  resDate.textContent  = dateInput.value || "—";
  resTime.textContent  = getTimeRangeValue() || "—";

  syncBrokenSeatIdsFromGreen();
  const seatsList = Array.from(brokenSeatIds);
  resSeats.textContent = seatsList.length ? seatsList.join(", ") : "None";
}

function getRecordToEdit() {
  const raw = localStorage.getItem("editReservation");
  if (raw) {
    try { return JSON.parse(raw); } catch {}
  }
  return (typeof contents !== "undefined" && contents[0]) ? contents[0] : null;
}

function fillUI(r) {
  if (!r) 
    return;

  const venueVal = buildingLabelToVenueSelectValue(r.building);
  venueSelect.value = venueVal;

  showVenueLayout(venueVal);
  populateRooms(venueVal);

  roomSelect.value = r.room || "";
  dateInput.value = toISODate(r.date);

  const tr = parseTimeRange(r.time);
  if (tr) {
    startHour.value = tr.sh;
    startMinute.value = tr.sm;
    endHour.value = tr.eh;
    endMinute.value = tr.em;
  } else {
    startHour.value = "";
    startMinute.value = "";
    endHour.value = "";
    endMinute.value = "";
  }

  clearGreenSeats();
  markSeatsGreenFromList(r.room, r.seats);

  validateTimeBoxAndFlow();
  syncBrokenSeatIdsFromGreen();
}

[startHour, startMinute, endHour, endMinute].forEach(el => {
  el.addEventListener("change", validateTimeBoxAndFlow);
});

document.addEventListener("click", (e) => {
  const seat = e.target.closest(".seat");
  if (!seat) return;

  const v = getVisibleLayout();
  if (!v) return;

  seat.classList.toggle("green");
  syncBrokenSeatIdsFromGreen();
});

venueSelect.addEventListener("change", () => {
  showVenueLayout(venueSelect.value);
  populateRooms(venueSelect.value);

  clearGreenSeats();
  syncBrokenSeatIdsFromGreen();

  validateTimeBoxAndFlow();
});

roomSelect.addEventListener("change", () => {
  clearGreenSeats();
  syncBrokenSeatIdsFromGreen();
  validateTimeBoxAndFlow();
});

dateInput.addEventListener("change", () => {
  validateTimeBoxAndFlow();
});

confirmBtn.addEventListener("click", () => {
  validateTimeBoxAndFlow();

  fillModalDetails();
  openConfirmModal();
});

if (closeConfirmBtn) {
  closeConfirmBtn.addEventListener("click", closeConfirmModal);
}

if (confirmOkayBtn) {
  confirmOkayBtn.addEventListener("click", () => {
    closeConfirmModal();

    const updated = {
      building: venueSelect.value,
      room: roomSelect.value,
      date: dateInput.value,
      time: getTimeRangeValue(),
      seats: Array.from(brokenSeatIds)
    };
    localStorage.setItem("editReservation", JSON.stringify(updated));

    window.location.href = "user-profile.html";
  });
}

const backdrop = document.querySelector("#confirmModal .modal-backdrop");
if (backdrop) {
  backdrop.addEventListener("click", closeConfirmModal);
}

tagSeatsByOrder();
fillUI(getRecordToEdit());
updateStatusUI();
updateConfirmButton();
setSeatsEnabled(true);
