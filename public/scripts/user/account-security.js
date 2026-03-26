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
const wrong_password_classList = "hidden mt-3 w-[190px] h-[40px] bg-red-100 border border-red-400 text-red-700 px-[10px] py-[5px] rounded relative";
const not_match_error_classList = "hidden mt-3 w-[380px] h-[40px] bg-red-100 border border-red-400 text-red-700 px-[10px] py-[5px] rounded relative";
const error_classList = "hidden mt-3 w-[250px] h-[40px] bg-red-100 border border-red-400 text-red-700 px-[10px] py-[5px] rounded relative";
const success_classList = "mt-3 w-[335px] h-[40px] bg-green-100 border border-green-400 text-green-700 px-[10px] py-[5px] rounded relative";
const profile_image = document.getElementById("profile_image");
const input_file = document.getElementById("input_file");
const userDropdownMenu = document.getElementById("userDropdownMenu")
const search = document.getElementById("search")
const url = new URLSearchParams(window.location.search);
const userId = url.get('originalId');
let password = "wrong"
save_button.addEventListener("click", async () => {
    await getCurPassword()
    saveChanges()
});
input_file.addEventListener("click", changePicture);

$(document).ready(function () {
    console.log("Account-Security Script running");
    $("#profile-settings").on("click", async function (e) {
        e.preventDefault();
        try {
            window.location.href = `/user/profile-settings?originalId=${userId}`
        } catch (err) {
            console.error("Login Error:", err);
            alert("An error occurred. Check the F12 console.");
        }
    });

    $("#account-security").on("click", async function (e) {
        e.preventDefault();
        try {
            window.location.href = `/user/account-security?originalId=${userId}`
        } catch (err) {
            console.error("Login Error:", err);
            alert("An error occurred. Check the F12 console.");
        }
    });

    $("#reservations").on("click", async function (e) {
        e.preventDefault();
        try {
            window.location.href = `/user/account-reserve?originalId=${userId}`
        } catch (err) {
            console.error("Login Error:", err);
            alert("An error occurred. Check the F12 console.");
        }
    });
})

async function getCurPassword() {
    const response = await fetch(`/user/search/${userId}`)
    const user = await response.json();
    password = user.password;
}

async function updatePassword(userId) {
    const response = await fetch(`/user/edit/password/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password: new_password_input.value })
    });
}

function saveChanges() {
    cur_password_border.classList.replace("outline-red-300", border_color);
    new_password_border.classList.replace("outline-red-300", border_color);
    confirm_password_border.classList.replace("outline-red-300", border_color);

    let valid = true;
    if (cur_password_input.value == "") {
        valid = false;
        cur_password_border.classList.replace(border_color, "outline-red-300");
        error_header.innerHTML = "ERROR!"
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

    if (new_password_input.value == "") {
        valid = false;
        new_password_border.classList.replace(border_color, "outline-red-300");
        error_header.innerHTML = "ERROR!"
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

    if (confirm_password_input.value == "") {
        valid = false;
        confirm_password_border.classList.replace(border_color, "outline-red-300");
        error_header.innerHTML = "ERROR!"
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

    if (cur_password_input.value != "" && new_password_input.value != "" && confirm_password_input.value != "") {
        if (password != cur_password_input.value) {
            valid = false;
            cur_password_border.classList.replace(border_color, "outline-red-300");
            error_header.innerHTML = "ERROR!"
            error_text.innerHTML = "Wrong Password";
            error.classList = wrong_password_classList;
            error_button.classList.remove("hidden");
            error.classList.remove("hidden");
            error.classList.replace(error_input_border_size, error_password_match_size);

            cur_password_input.addEventListener("click", (event) => {
                cur_password_border.classList.replace("outline-red-300", border_color);
            });

            error_button.addEventListener("click", (event) => {
                error.classList.add("hidden");
            });
        }
        // Check if new and confirm password are the same
        if (new_password_input.value != confirm_password_input.value) {
            valid = false;
            error_header.innerHTML = "ERROR!"
            new_password_border.classList.replace(border_color, "outline-red-300");
            confirm_password_border.classList.replace(border_color, "outline-red-300");
            error_text.innerHTML = "New Password and Confirm Password should match.";
            error.classList = not_match_error_classList;
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

    if (valid == true) {
        // Send the data to backend
        updatePassword(userId)
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
    input_file.onchange = function () {
        profile_image.src = URL.createObjectURL(input_file.files[0]);
    }
}

async function getUserSearchSuggestions(input) {
    if (input.trim().length === 0) {
        userDropdownMenu.innerHTML = ''; // Clear suggestions
        return; // Don't even call the database
    }
    const response = await fetch(`/user/searchRecommended?username=${input}`)
    const users = await response.json()
    if(users.length == 0) {
        const li = document.createElement('li')
        li.className = "px-4 py-2 text-slate-600 text-sm";
        li.innerHTML = "No User Found"
        userDropdownMenu.appendChild(li)
    }
    console.log("Users: ", users)
    for (let i = 0; i < 5 && i < users.length; i++) {
        let searchedUserId = users[i]._id
        if(userId == searchedUserId) {
            return
        }
        const li = document.createElement('li')
        li.setAttribute('data-id', searchedUserId);
        li.className = "userSuggestion px-4 py-2 text-slate-600 hover:bg-slate-50 text-sm cursor-pointer";
        li.innerHTML = `${users[i].username}`
        userDropdownMenu.appendChild(li)
    }
}

async function viewUser(e) {
    const btn = e.target.closest(".userSuggestion")
    if (!btn) return;
    const user = btn.closest('li')
    const searchedUserId = user.getAttribute('data-id')
    search.value = ""
    userDropdownMenu.innerHTML = '';
    window.location.href = `/user/view-other-user-profile?id=${searchedUserId}&originalId=${userId}`
}

search.addEventListener('input', (e) => {
    userDropdownMenu.innerHTML = ''; 
    getUserSearchSuggestions(e.target.value)
    console.log("Value changed to: " + e.target.value);
});

search.addEventListener('keydown', async (e) => {
  if (e.key === 'Enter') {
    // Prevent default form submission if necessary
    e.preventDefault(); 
    const username = e.target.value;
    console.log(username)
    userDropdownMenu.innerHTML = ''; 
    search.value = ""
    const response = await fetch(`/user/searchRecommended?username=${username}`)
    const user = await response.json()
    console.log("User: ", user)
    if(user.length == 0) {
        userDropdownMenu.innerHTML = ''; 
        const li = document.createElement('li')
        li.className = "px-4 py-2 text-slate-600 text-sm";
        li.innerHTML = "No User Found"
        userDropdownMenu.appendChild(li)
    }
    else if(user.length == 1) {
        const searchedUserId = user[0]._id
        window.location.href = `/user/view-other-user-profile?id=${searchedUserId}&originalId=${userId}`
    }
    else {
        return
    }
  }
});

window.addEventListener('click', (event) => {
    userDropdownMenu.innerHTML = '';
});

search.addEventListener('click', (e) => {
    userDropdownMenu.innerHTML = ''; 
    getUserSearchSuggestions(e.target.value)
})

userDropdownMenu.addEventListener('click', viewUser);
