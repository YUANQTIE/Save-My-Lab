var building;
var room;
var reason;
var date = "2000-01-01";
var hour;
var minute;
var timestamp;
var brokensToBeDisplayed;
const tbody = document.getElementById("tbody")
class broken {
    constructor(id, building, roomName, startDate, startTime, reason) {
        this.id = id,
        this.building = building;
        this.roomName = roomName;
        this.startDate = startDate;
        this.startTime = startTime;
        this.reason = reason;
    }
}


$(document).ready(function () {

    async function showBrokens(brokens) {
        tbody.innerHTML = "";

        const listOfBrokens = brokens.map(res => ({
            brokenId: res.broken_id,
            building: res.building,
            roomName: res.room_name,
            reason: res.reason,
            startTimestampStr: res.broken_start_timestamp
        }));

        listOfBrokens.sort((a, b) => b.startTimestampStr.localeCompare(a.startTimestampStr));

        for (const res of listOfBrokens) {
            const [datePart, timePart] = res.startTimestampStr.split('T');
            const [year, month, day] = datePart.split('-');
            const [hourStr, minute] = timePart.split(':');

            let hour = parseInt(hourStr, 10);
            const ampm = hour >= 12 ? 'PM' : 'AM';
            if (hour > 12) 
                hour -= 12;
            if (hour === 0) 
                hour = 12;

            const monthName = new Date(`${year}-${month}-01`).toLocaleString('en-US', { month: 'long' });
            const formattedStart = `${monthName} ${parseInt(day)}, ${year}, ${hour}:${minute} ${ampm}`;

            await addRow(
                res.brokenId,
                res.building,
                res.roomName,
                formattedStart,
                res.reason
            );
        }
    }


    async function addRow(brokenId, building, room, formattedTimeStamp, reason) {
        const tr = document.createElement('tr');
        tr.setAttribute('data-id', brokenId);
        tr.className = "odd:bg-neutral-primary even:bg-neutral-secondary-soft border-b border-default";
        const uniqueDialogId = `dialog-${brokenId}`
        
        tr.innerHTML = `<td class="py-3 text-slate-800 pl-[19px] text-sm text-center">${building}</td>
                    <td class="py-3 text-slate-800 px-4 text-sm text-center">${room}</td>
                    <td class="py-3 text-slate-800 px-4 text-sm text-center">${reason}</td>
                    <td class="py-3 text-slate-800 px-4 text-sm text-center">${formattedTimeStamp}</td>
                    <td class="py-3 pl-4">
                        <div class="flex gap-3 justify-center items-center">
                            <button class = "seatBtn button icon-button text-slate-600 hover:bg-[#34493e]/5 hover:border-[#34493e]/20 hover:text-[#34493e]">
                                <img src="/images/seat.png" alt="View" class="w-5 h-5">
                            </button>
                            <button class="resolve button icon-button button-green hover:text-white hover:bg-green-500">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 0 1 9 9v.375M10.125 2.25A3.375 3.375 0 0 1 13.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 0 1 3.375 3.375M9 15l2.25 2.25L15 12" />
                                </svg>
                            </button>
                        </div>
                    </td>`;
        tbody.appendChild(tr);
    }

    function updateInitialTimeStampValues() {
        timestamp = date + "T00:00:00.000";
    }

    function updateTimeStampValues() {
        if (hour && minute) {
            timestamp = date+ "T" + hour + ":" + minute + ":00.000";
        }
    }

    $("#buildingInput").on("change", async function (e) {
        try {
            room = undefined
            brokensToBeDisplayed = undefined;
            building = $(this).val().trim();

            const roomSelect = $("#roomInput");
            roomSelect.empty();
            roomSelect.append('<option value="" disabled selected>Input Room...</option>');

            const roomsInBuildings = await fetch(`/room/building/room-names?buildingName=${building}`);
            const roomsInBuildingsJ = await roomsInBuildings.json();

            roomsInBuildingsJ.forEach(r => {
                roomSelect.append(`<option value="${r.room_name}">${r.room_name}</option>`);
            });

            $("#roomInput").prop("disabled", false);
            updateBrokensList(building, room, reason, timestamp)

        }
        catch (err) {
            console.error("Error updating building:", err);
        }
    });

    $("#roomInput").on("change", async function (e) {
        try {
            room = $(this).val().trim();
            brokensToBeDisplayed = undefined;
            updateBrokensList(building, room, reason, timestamp)
        }
        catch (err) {
            console.error("Error updating building:", err);
        }
    });

    $("#maintenanceDateInput").on("change", async function (e) {
        try {
            date = $(this).val().trim();
            brokensToBeDisplayed = undefined;
            updateInitialTimeStampValues()
            $("#startHr").val("")
            $("#startMin").val("")
            $("#startHr").prop("disabled", false);
            $("#startMin").prop("disabled", false);
            updateBrokensList(building, room, reason, timestamp)
        }
        catch (err) {
            console.error("Error updating building:", err);
        }
    });

    $("#reasonInput").on("change", async function (e) {
        try {
            reason = $(this).val().trim();
            brokensToBeDisplayed = undefined;
            updateBrokensList(building, room, reason, timestamp)
        }
        catch (err) {
            console.error("Error updating building:", err);
        }
    });

    $("#startHr").on("change", async function (e) {
        try {
            hour = $(this).val().trim();
            brokensToBeDisplayed = undefined;
            updateTimeStampValues()
            updateBrokensList(building, room, reason, timestamp)
        }
        catch (err) {
            console.error("Error updating building:", err);
        }
    });

    $("#startMin").on("change", async function (e) {
        try {
            minute = $(this).val().trim();
            brokensToBeDisplayed= undefined;
            updateTimeStampValues()
            updateBrokensList(building, room, reason, timestamp)
        }
        catch (err) {
            console.error("Error updating building:", err);
        }
    });

     $("#resetBtn").on("click", async function (e) {
        try {
            $("#buildingInput").val("")
            $("#roomInput").val("")
            $("#dateInput").val("")
            $("#reasonInput").val("")
            $("#startHr").val("")
            $("#startMin").val("")
            $("#startHr").prop("disabled", true);
            $("#startMin").prop("disabled", true);
            $("#roomInput").prop("disabled", true);
            building = undefined;
            room = undefined;
            reason = undefined;
            date = "2000-01-01";
            hour = undefined;
            minute = undefined
            timestamp = undefined;
            brokensToBeDisplayed = undefined;
            updateBrokensList(building, room, reason, timestamp);
        }
        catch (err) {
            console.error("")
        }
    });

    $(document).on("click", ".resolve", function(e) {
        e.preventDefault();

        const row = $(this).closest("tr");
        const brokenId = row.data("id");

        $.post("/admin/resolve-computer", {
            brokenId: brokenId
        }).done(function () {
            window.location.href = "/admin/resolve-computer";
        });
    });

    $(document).on("click", ".seatBtn", async function (e) {
        try {
            const brokenId = $(this).closest("tr").data("id");

            const response = await fetch(`/broken/${brokenId}/seats`);

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

    async function updateBrokensList(buildingInput, roomInput, reasonInput, timestampInput) {
        try {
            const response = await fetch(`/broken/brokens/filter?roomName=${roomInput || ""}&building=${buildingInput || ""}&reason=${reasonInput || ""}&brokenTimeStart=${timestampInput || ""}`);

            if (!response.ok) {
                console.log("Error");
                return;
            }

            const brokensToBeDisplayed = await response.json();

            showBrokens(brokensToBeDisplayed)

        } catch (error) {
            console.error("Failed to fetch reservations:", error)
        }
    }

    updateInitialTimeStampValues()
    updateBrokensList(building, room, reason, timestamp)
    $("#startHr").prop("disabled", true);
    $("#startMin").prop("disabled", true);
    $("#roomInput").prop("disabled", true);
})