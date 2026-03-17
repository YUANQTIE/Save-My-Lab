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

input_file.addEventListener("click", changePicture);

table.addEventListener("click", deleteRow);

dropdownButton.addEventListener("click", function() {
    dropdown.classList.toggle("hidden");
});

building_option.addEventListener("click", function() {
    sort_text.innerHTML = "Building";
    dropdown.classList.toggle("hidden");
});

room_option.addEventListener("click", function() {
    sort_text.innerHTML = "Room";
    dropdown.classList.toggle("hidden");
});
    
date_option.addEventListener("click", function() {
    sort_text.innerHTML = "Date";
    dropdown.classList.toggle("hidden");
});
    
start_time_option.addEventListener("click", function() {
    sort_text.innerHTML = "Start Time";
    dropdown.classList.toggle("hidden");
});

end_time_option.addEventListener("click", function() {
    sort_text.innerHTML = "End Time";
    dropdown.classList.toggle("hidden");
});


function addRow(building, room, date, startTime, endTime) {
    tbody.innerHTML += `
        <tr>
            <td>${building}</td>
            <td>${room}</td>
            <td>${date}</td>
            <td>${startTime}</td>
            <td>${endTime}</td>
            <td><a href="#" id="view_button" class="font-medium text-fg-brand hover:underline">View</a>
                <a href="#" id="edit_button" class="font-medium text-fg-brand hover:underline">Edit</a>
                <a href="#" id="delete_button" class="delete_button font-medium text-fg-brand hover:underline">Delete</a>
            </td>
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
    input_file.onchange = function() {
        profile_image.src = URL.createObjectURL(input_file.files[0]);
    }
}