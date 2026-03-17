const table = document.getElementById("table");
const tbody = document.getElementById("tbody");
const delete_button = document.getElementById("delete_button");
const profile_image = document.getElementById("profile_image");
const input_file = document.getElementById("input_file");

input_file.addEventListener("click", changePicture);

table.addEventListener("click", deleteRow);


function addRow(building, room, date, startTime, endTime) {
    tbody.innerHTML += `
        <tr>
            <th>${building}</th>
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
    const btn = e.target.closest(".delete_button");

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