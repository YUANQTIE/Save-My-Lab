var building;
var room;
var reservationDate;
var email;
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
const tbody = document.getElementById("tbody")
let listOfReservations = []
class reservation {
    constructor(id, building, roomName, startDate, startTime, endTime, reservedBy, creationDate, creationTime) {
        this.id = id,
            this.building = building;
        this.roomName = roomName;
        this.startDate = startDate;
        this.startTime = startTime;
        this.endTime = endTime;
        this.reservedBy = reservedBy;
        this.creationDate = creationDate;
        this.creationTime = creationTime;
    }
}

$(document).ready(function () {
    updateReservationsList(email, creationTimeStart, creationTimeEnd, room, building, reservationStartTimeStamp, reservationEndTimeStamp, seatCount)
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
            console.log(building, room, reservationDate, email, reservationStartHour, reservationStartMinute, reservationEndHour, reservationEndMinute)

            const roomSelect = $("#roomInput");
            roomSelect.empty();
            roomSelect.append('<option value="" disabled selected>Input Room...</option>');

            const roomsInBuildings = await fetch(`/room/building/room-names?buildingName=${building}`);
            const roomsInBuildingsJ = await roomsInBuildings.json();

            roomsInBuildingsJ.forEach(r => {
                roomSelect.append(`<option value="${r.room_name}">${r.room_name}</option>`);
            });

            $("#roomInput").prop("disabled", false);
            updateReservationsList(email, creationTimeStart, creationTimeEnd, room, building, reservationStartTimeStamp, reservationEndTimeStamp, seatCount)

        }
        catch (err) {
            console.error("Error updating building:", err);
        }
    });

    $("#roomInput").on("change", async function (e) {
        try {
            room = $(this).val().trim();
            reservationsToBeDisplayed = undefined;
            updateReservationsList(email, creationTimeStart, creationTimeEnd, room, building, reservationStartTimeStamp, reservationEndTimeStamp, seatCount)
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
            updateReservationsList(email, creationTimeStart, creationTimeEnd, room, building, reservationStartTimeStamp, reservationEndTimeStamp, seatCount)
        }
        catch (err) {
            console.error("Error updating building:", err);
        }
    });

    $("#emailInput").on("change", async function (e) {
        try {
            email = $(this).val().trim();
            reservationsToBeDisplayed = undefined;
            updateReservationsList(email, creationTimeStart, creationTimeEnd, room, building, reservationStartTimeStamp, reservationEndTimeStamp, seatCount)
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
            updateReservationsList(email, creationTimeStart, creationTimeEnd, room, building, reservationStartTimeStamp, reservationEndTimeStamp, seatCount)
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
            updateReservationsList(email, creationTimeStart, creationTimeEnd, room, building, reservationStartTimeStamp, reservationEndTimeStamp, seatCount)
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
            updateReservationsList(email, creationTimeStart, creationTimeEnd, room, building, reservationStartTimeStamp, reservationEndTimeStamp, seatCount)
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
            updateReservationsList(email, creationTimeStart, creationTimeEnd, room, building, reservationStartTimeStamp, reservationEndTimeStamp, seatCount)
        }
        catch (err) {
            console.error("Error updating building:", err);
        }
    });

    $(document).on("click", ".seatBtn", async function (e) {
        try {
            const reservationId = $(this).closest("tr").data("id");

            console.log("Reservation ID:", reservationId);

            const response = await fetch(`/reservations/${reservationId}/seats`);

            if (!response.ok) {
                console.log("Failed to fetch seats");
                return;
            }

            const seats = await response.json();


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
        catch (err) {
            console.error("Seat button error:", err);
        }
    });

    $("#hide_view_modal").on("click", function () {
        $("#LynnFromLasVegasModals").addClass("hidden");
    });

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

    $("#reservationTable").on("click", deleteRow)



    function updateTimeStampValues() {
        if (reservationStartHour && reservationStartMinute) {
            reservationStartTimeStamp = reservationDate + "T" + reservationStartHour + ":" + reservationStartMinute + ":00.000";
        }
        if (reservationEndHour && reservationEndMinute) {
            reservationEndTimeStamp = reservationDate + "T" + reservationEndHour + ":" + reservationEndMinute + ":00.000";
        }
    }

    function updateInitialTimeStampValues() {
        reservationStartTimeStamp = reservationDate + "T00:00:00.000";
        reservationEndTimeStamp = reservationDate + "T23:59:00.000";
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

    async function showReservations(reservations) {
        tbody.innerHTML = "";
        let listOfReservations = []

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
            console.log("-----------------------------------")
            console.log("res.reservedBy: ", res.reservedBy)
            console.log("formattedStartDate: ", formattedStartDate)
            console.log("formattedStartTime: ", formattedStartTime)
            console.log("formattedEndTime: ", formattedEndTime)
            console.log("-----------------------------------")
            console.log()
            listOfReservations.push(new reservation(
                res.reservation_id,
                res.building,
                res.room_name,
                startDate,
                formattedStartTime,
                formattedEndTime,
                res.reservedBy,
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
                res.reservedBy,
                res.creationDate,
                res.creationTime
            );

        }
    }

    async function addRow(reservationId, building, room, date, startTime, endTime, reservedBy, resDate, resTime) {
        // Create the row element
        const tr = document.createElement('tr');
        tr.setAttribute('data-id', reservationId);
        tr.className = "odd:bg-neutral-primary even:bg-neutral-secondary-soft border-b border-default";
        let response = await fetch(`/reservations/${reservationId}/checkEditable`)
        let editable = await response.json()
        let response2 = await fetch(`/reservations/${reservationId}/checkDeletable`)
        let deletable = await response2.json()
        const uniqueDialogId = `dialog-${reservationId}`

        if (deletable && editable) {
            tr.innerHTML = `<td class="py-3 text-slate-800 pl-[19px] text-sm text-center">${building}</td>
                        <td class="py-3 text-slate-800 px-4 text-sm text-center">${room}</td>
                        <td class="py-3 text-slate-800 px-4 text-sm text-center">${date}</td>
                        <td class="py-3 text-slate-800 px-4 text-sm text-center">${startTime} - ${endTime}</td>
                        <td class="py-3 text-slate-800 px-4 text-sm text-center">${reservedBy}</td>
                        <td class="py-3 text-slate-800 px-4 text-sm text-center">${resDate}</td>
                        <td class="py-3 text-slate-800 px-4 text-sm text-center">${resTime}</td>
                        <td class="py-3 pl-4">
                            <div class="flex gap-3 justify-center items-center">
                                <button class = "seatBtn button icon-button text-slate-600 hover:bg-[#34493e]/5 hover:border-[#34493e]/20 hover:text-[#34493e]">
                                    <img src="/images/seat.png" alt="View" class="w-5 h-5">
                                </button>
                                <button class = "edit button icon-button text-slate-600 hover:bg-[#34493e]/5 hover:border-[#34493e]/20 hover:text-[#34493e]">
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                </svg>

                                </button>
                                <button class = "open-modal-btn button icon-button button-red hover:text-white hover:bg-red-500">
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                  </svg>
                                </button>
                                <el-dialog>
                                <dialog id="${uniqueDialogId}" aria-labelledby="dialog-title" class="fixed inset-0 size-auto max-h-none max-w-none overflow-y-auto bg-transparent backdrop:bg-transparent">
                                    <el-dialog-backdrop class="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"></el-dialog-backdrop>

                                    <div tabindex="0" class="flex min-h-full items-end justify-center p-4 text-center focus:outline-none sm:items-center sm:p-0">
                                    <el-dialog-panel class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95">
                                        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                        <div class="sm:flex sm:items-start">
                                            <div class="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-10">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" data-slot="icon" aria-hidden="true" class="size-6 text-red-600">
                                                <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" stroke-linecap="round" stroke-linejoin="round" />
                                            </svg>
                                            </div>
                                            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                            <h3 id="dialog-title" class="text-base font-semibold text-gray-900">Delete Reservation</h3>
                                            <div class="mt-2">
                                                <p class="text-sm text-gray-500">Are you sure you want to permanently delete your
                                                reservation? This action cannot be undone</p>
                                            </div>
                                            </div>
                                        </div>
                                        </div>
                                        <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                            <button id="delete_button" type="button" onclick="this.closest('dialog').close()" class="delete_button_class inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-red-500 sm:ml-3 sm:w-auto">Delete</button>
                                            <button type="button" onclick="this.closest('dialog').close()" class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs inset-ring inset-ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">Cancel</button>
                                        </div>
                                    </el-dialog-panel>
                                    </div>
                                </dialog>
                                </el-dialog>
                            </div>
                        </td>`;


            tr.querySelector('.open-modal-btn').addEventListener('click', () => {
                const dialog = tr.querySelector('dialog');
                if (dialog) dialog.showModal();
            });
        }
        else if (!deletable && editable) {
            tr.innerHTML = `<td class="py-3 text-slate-800 pl-[19px] text-sm text-center">${building}</td>
                        <td class="py-3 text-slate-800 px-4 text-sm text-center">${room}</td>
                        <td class="py-3 text-slate-800 px-4 text-sm text-center">${date}</td>
                        <td class="py-3 text-slate-800 px-4 text-sm text-center">${startTime} - ${endTime}</td>
                        <td class="py-3 text-slate-800 px-4 text-sm text-center">${reservedBy}</td>
                        <td class="py-3 text-slate-800 px-4 text-sm text-center">${resDate}</td>
                        <td class="py-3 text-slate-800 px-4 text-sm text-center">${resTime}</td>
                        <td class="py-3 pl-4">
                            <div class="flex gap-3 justify-center items-center">
                                <button class = "seatBtn button icon-button text-slate-600 hover:bg-[#34493e]/5 hover:border-[#34493e]/20 hover:text-[#34493e]">
                                    <img src="/images/seat.png" alt="View" class="w-5 h-5">
                                </button>
                                <button class = "edit button icon-button text-slate-600 hover:bg-[#34493e]/5 hover:border-[#34493e]/20 hover:text-[#34493e]">
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                </svg>

                                </button>
                            </div>
                        </td>`;
        }
        else if (deletable && !editable) {
            tr.innerHTML = `<td class="py-3 text-slate-800 pl-[19px] text-sm text-center">${building}</td>
                        <td class="py-3 text-slate-800 px-4 text-sm text-center">${room}</td>
                        <td class="py-3 text-slate-800 px-4 text-sm text-center">${date}</td>
                        <td class="py-3 text-slate-800 px-4 text-sm text-center">${startTime} - ${endTime}</td>
                        <td class="py-3 text-slate-800 px-4 text-sm text-center">${reservedBy}</td>
                        <td class="py-3 text-slate-800 px-4 text-sm text-center">${resDate}</td>
                        <td class="py-3 text-slate-800 px-4 text-sm text-center">${resTime}</td>
                        <td class="py-3 pl-4">
                            <div class="flex gap-3 justify-center items-center">
                                <button class = "seatBtn button icon-button text-slate-600 hover:bg-[#34493e]/5 hover:border-[#34493e]/20 hover:text-[#34493e]">
                                    <img src="/images/seat.png" alt="View" class="w-5 h-5">
                                </button>

                                </button>
                                <button class = "open-modal-btn button icon-button button-red hover:text-white hover:bg-red-500">
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                  </svg>
                                </button>
                                <el-dialog>
                                <dialog id="${uniqueDialogId}" aria-labelledby="dialog-title" class="fixed inset-0 size-auto max-h-none max-w-none overflow-y-auto bg-transparent backdrop:bg-transparent">
                                    <el-dialog-backdrop class="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"></el-dialog-backdrop>

                                    <div tabindex="0" class="flex min-h-full items-end justify-center p-4 text-center focus:outline-none sm:items-center sm:p-0">
                                    <el-dialog-panel class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95">
                                        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                        <div class="sm:flex sm:items-start">
                                            <div class="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-10">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" data-slot="icon" aria-hidden="true" class="size-6 text-red-600">
                                                <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" stroke-linecap="round" stroke-linejoin="round" />
                                            </svg>
                                            </div>
                                            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                            <h3 id="dialog-title" class="text-base font-semibold text-gray-900">Delete Reservation</h3>
                                            <div class="mt-2">
                                                <p class="text-sm text-gray-500">Are you sure you want to permanently delete your
                                                reservation? This action cannot be undone</p>
                                            </div>
                                            </div>
                                        </div>
                                        </div>
                                        <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                            <button id="delete_button" type="button" onclick="this.closest('dialog').close()" class="delete_button_class inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-red-500 sm:ml-3 sm:w-auto">Delete</button>
                                            <button type="button" onclick="this.closest('dialog').close()" class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs inset-ring inset-ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">Cancel</button>
                                        </div>
                                    </el-dialog-panel>
                                    </div>
                                </dialog>
                                </el-dialog>
                            </div>
                        </td>`;
        }
        else {
            tr.innerHTML = `<td class="py-3 text-slate-800 pl-[19px] text-sm text-center">${building}</td>
                        <td class="py-3 text-slate-800 px-4 text-sm text-center">${room}</td>
                        <td class="py-3 text-slate-800 px-4 text-sm text-center">${date}</td>
                        <td class="py-3 text-slate-800 px-4 text-sm text-center">${startTime} - ${endTime}</td>
                        <td class="py-3 text-slate-800 px-4 text-sm text-center">${reservedBy}</td>
                        <td class="py-3 text-slate-800 px-4 text-sm text-center">${resDate}</td>
                        <td class="py-3 text-slate-800 px-4 text-sm text-center">${resTime}</td>
                        <td class="py-3 pl-4">
                            <div class="flex gap-3 justify-center items-center">
                                <button class = "seatBtn button icon-button text-slate-600 hover:bg-[#34493e]/5 hover:border-[#34493e]/20 hover:text-[#34493e]">
                                    <img src="/images/seat.png" alt="View" class="w-5 h-5">
                                </button>
                            </div>
                        </td>`;
        }
        tbody.appendChild(tr);
    }

    $(document).on("click", ".edit", function(e) {
        e.preventDefault();

        console.log("I WAS CLICKED")

        const row = $(this).closest("tr");
        const reservationId = row.data("id");

        console.log("resid", reservationId)
        $.post("/admin/edit-reservation", {
            resId: reservationId
        }).done(function () {
            window.location.href = "/admin/edit-reservation";
        });
    });

    function convertDate(date) {
        const dateObj = new Date(date);

        // Extract parts
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const day = String(dateObj.getDate()).padStart(2, '0');

        const formattedDate = `${year}-${month}-${day}`;
        return formattedDate;
    }


    async function updateReservationsList(email, creationTimeStart, creationDate, room, building, reservationStartTimeStamp, reservationEndTimeStamp, seatCount) {
        try {
            const response = await fetch(`/reservations/reservationsAdmin/filter?reservedBy=${email || ""}&creationTimeStart=${creationTimeStart || ""}&creationTimeEnd=${creationTimeEnd || ""}&roomName=${room || ""}&building=${building || ""}&reservationTimeStart=${reservationStartTimeStamp || ""}&reservationTimeEnd=${reservationEndTimeStamp || ""}&seatCount=${seatCount || ""}`);

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
})