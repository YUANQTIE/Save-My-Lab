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
            updateReservationsList(email, creationTimeStart, creationTimeEnd, room, building, reservationStartTimeStamp, reservationEndTimeStamp, seatCount)
        }
        catch (err) {
            console.error("")
        }
    });

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

    async function updateReservationsList(email, creationTimeStart, creationTimeEnd, room, building, reservationStartTimeStamp, reservationEndTimeStamp, seatCount) {
        try {
            const response = await fetch(`/reservations/reservationsAdmin/filter?reservedBy=${email || ""}&creationTimeStart=${creationTimeStart || ""}&creationTimeEnd=${creationTimeEnd || ""}&roomName=${room || ""}&building=${building || ""}&reservationTimeStart=${reservationStartTimeStamp || ""}&reservationTimeEnd=${reservationEndTimeStamp || ""}&seatCount=${seatCount || ""}`);

            if (!response.ok) {
                console.log("Error");
                return;
            }

            const reservationsToBeDisplayed = await response.json();

            const $tbody = $('#tbody');

            $tbody.empty();

            reservationsToBeDisplayed.forEach(res => {
                const row = `
                    <tr class="border-b border-slate-200" data-id="${res.reservation_id}">
                        <td class="py-3 text-slate-800 pl-[19px] font-medium text-center">${res.building}</td>
                        <td class="py-3 text-slate-800 pl-[19px] font-medium text-center">${res.room_name}</td>
                        <td class="py-3 text-slate-800 pl-[19px] font-medium text-center">${res.date}</td>
                        <td class="py-3 text-slate-800 pl-[19px] font-medium text-center">${res.reservation_start_timestamp}</td>
                        <td class="py-3 text-slate-800 pl-[19px] font-medium text-center">${res.reservation_end_timestamp}</td>
                        <td class="py-3 text-slate-800 pl-[19px] font-medium text-center">${res.reservedBy}</td>
                        <td class="py-3 text-slate-800 pl-[19px] font-medium text-center actions">
                          <div class="flex justify-center gap-3">
                              <button class = "seatBtn button icon-button text-slate-600 hover:bg-[#34493e]/5 hover:border-[#34493e]/20 hover:text-[#34493e]">
                                <img src="/images/seat.png" alt="View" class="w-5 h-5">
                              </button>
                          </div>
                        </td>
                        <td class="py-3 px-8 text-center">
                            <div class="flex ml-12 gap-3">
                                <button class = "button icon-button text-slate-600 hover:bg-[#34493e]/5 hover:border-[#34493e]/20 hover:text-[#34493e]">
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                </svg>

                                </button>
                                <button class = "button icon-button button-red hover:text-white hover:bg-red-500">
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                  </svg>

                                </button>
                            </div>
                        </td>
                    </tr>`;

                $tbody.append(row);
            });

        } catch (error) {
            console.error("Failed to fetch reservations:", error);
        }
    }

});