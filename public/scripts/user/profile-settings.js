const profile_username = document.getElementById("profile_username");
const username_input = document.getElementById("username");
const username_border = document.getElementById("username_border");
const email_input = document.getElementById("email");
const biography_input = document.getElementById("biography");
const save_button = document.getElementById("save_changes");
const error = document.getElementById("error");
const error_header = document.getElementById("error_header");
const error_text = document.getElementById("error_text");
const error_button = document.getElementById("error_button");
const error_classList = "hidden mt-3 w-[240px] h-[40px] bg-red-100 border border-red-400 text-red-700 px-[10px] py-[5px] rounded relative";
const success_classList = "mt-3 w-[305px] h-[40px] bg-green-100 border border-green-400 text-green-700 px-[10px] py-[5px] rounded relative";
const username_border_color = "outline-gray-300";
const profile_image = document.getElementById("profile_image");
const input_file = document.getElementById("input_file");

save_button.addEventListener("click", saveChanges);
input_file.addEventListener("click", changePicture);


function saveChanges() {
    username_border.classList.replace("outline-red-300", username_border_color);

    let valid = true;
    if(username_input.value == "") {
        valid = false;
        username_border.classList.replace(username_border_color, "outline-red-300");
        error_text.innerHTML = "Username cannot be empty.";
        error.classList = error_classList;
        error_button.classList.remove("hidden");
        error.classList.remove("hidden");

        username_input.addEventListener("click", (event) => {
            username_border.classList.replace("outline-red-300", username_border_color);
        });

        error_button.addEventListener("click", (event) => {
            error.classList.add("hidden");
        });
    }
    
    if(valid == true) {
        // Send the data to backend
        username_border.classList.replace("outline-red-300", username_border_color);
        error_header.innerHTML = "Success!";
        error_text.innerHTML = "You have successfully updated your profile."
        error_button.classList.add("hidden");
        error.classList = success_classList;
        profile_username.innerHTML = username_input.value;
    }
}

function changePicture() {
    input_file.onchange = function() {
        profile_image.src = URL.createObjectURL(input_file.files[0]);
    }
}