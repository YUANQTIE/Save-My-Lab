const cur_password_input = document.getElementById("cur_password");
const cur_password_border = document.getElementById("cur_password_border");
const new_password_input = document.getElementById("new_password");
const new_password_border = document.getElementById("new_password_border");
const confirm_password_input = document.getElementById("confirm_password");
const confirm_password_border = document.getElementById("confirm_password_border");
const save_button = document.getElementById("save_changes");
const error = document.getElementById("error");
const error_header = document.getElementById("error_header")
const error_text = document.getElementById("error_text");
const error_button = document.getElementById("error_button");
const border_color = "outline-gray-300";
const error_input_border_size = "w-[250px]";
const error_password_match_size = "w-[370px]";
const error_classList = "hidden mt-3 w-[370px] h-[40px] bg-red-100 border border-red-400 text-red-700 px-[10px] py-[5px] rounded relative";
const success_classList = "mt-3 w-[325px] h-[40px] bg-green-100 border border-green-400 text-green-700 px-[10px] py-[5px] rounded relative";
const profile_image = document.getElementById("profile_image");
const input_file = document.getElementById("input_file");

save_button.addEventListener("click", saveChanges);
input_file.addEventListener("click", changePicture);


function saveChanges() {
    cur_password_border.classList.replace("outline-red-300", border_color);
    new_password_border.classList.replace("outline-red-300", border_color);
    confirm_password_border.classList.replace("outline-red-300", border_color);

    let valid = true;
    if(cur_password_input.value == "") {
        valid = false;
        cur_password_border.classList.replace(border_color, "outline-red-300");
        error_text.innerHTML = "Please fill out all input fields."
        error.classList = error_classList;
        error_button.classList.remove("hidden");
        error.classList.remove("hidden");
        error.classList.replace(error_password_match_size, error_input_border_size);

        cur_password_input.addEventListener("click", (event) => {
            cur_password_border.classList.replace("outline-red-300", border_color);
        });

        error_button.addEventListener("click", (event) => {
            error.classList.add("hidden");
        });
    }

    if(new_password_input.value == "") {
        valid = false;
        new_password_border.classList.replace(border_color, "outline-red-300");
        error_text.innerHTML = "Please fill out all input fields."
        error.classList = error_classList;
        error_button.classList.remove("hidden");
        error.classList.remove("hidden");
        error.classList.replace(error_password_match_size, error_input_border_size);

        new_password_input.addEventListener("click", (event) => {
            new_password_border.classList.replace("outline-red-300", border_color);
        });

        error_button.addEventListener("click", (event) => {
            error.classList.add("hidden");
        });
    }

    if(confirm_password_input.value == "") {
        valid = false;
        confirm_password_border.classList.replace(border_color, "outline-red-300");
        error_text.innerHTML = "Please fill out all input fields."
        error.classList = error_classList;
        error_button.classList.remove("hidden");
        error.classList.remove("hidden");
        error.classList.replace(error_password_match_size, error_input_border_size);

        confirm_password_input.addEventListener("click", (event) => {
            confirm_password_border.classList.replace("outline-red-300", border_color);
        });

        error_button.addEventListener("click", (event) => {
            error.classList.add("hidden");
        });

    }

    if(cur_password_input.value != "" && new_password_input.value != "" && confirm_password_input.value != "") {
        // Check if current password is valid
        // code for that
        // if(cur_password_input) {

        // }
        // Check if new and confirm password are the same
        // Should be else if
        if(new_password_input.value != confirm_password_input.value) {
            valid = false;
            new_password_border.classList.replace(border_color, "outline-red-300");
            confirm_password_border.classList.replace(border_color, "outline-red-300");
            error_text.innerHTML = "New Password and Confirm Password should match.";
            error.classList = error_classList;
            error_button.classList.remove("hidden");
            error.classList.remove("hidden"); 
            error.classList.replace(error_input_border_size, error_password_match_size);

            new_password_input.addEventListener("click", (event) => {
                new_password_border.classList.replace("outline-red-300", border_color);
            });

            confirm_password_input.addEventListener("click", (event) => {
                confirm_password_border.classList.replace("outline-red-300", border_color);
            });

            error_button.addEventListener("click", (event) => {
                error.classList.add("hidden");
            });
        }
    }
    
    if(valid == true) {
        // Send the data to backend
        cur_password_border.classList.replace("outline-red-300", border_color);
        new_password_border.classList.replace("outline-red-300", border_color);
        confirm_password_border.classList.replace("outline-red-300", border_color);
        cur_password_input.value = "";
        new_password_input.value = "";
        confirm_password_input.value = "";
        error_header.innerHTML = "Success!";
        error_text.innerHTML = "You have successfully changed your password."
        error_button.classList.add("hidden");
        error.classList = success_classList;
    }
}

function changePicture() {
    input_file.onchange = function() {
        profile_image.src = URL.createObjectURL(input_file.files[0]);
    }
}
