const profile_username = document.getElementById("profile_username");
const username_input = document.getElementById("username");
const username_border = document.getElementById("username_border");
const id_input = document.getElementById("idNumber");
const email_input = document.getElementById("email");
const biography_input = document.getElementById("biography");
const save_button = document.getElementById("save_changes");
const error = document.getElementById("error");
const error_header = document.getElementById("error_header");
const error_text = document.getElementById("error_text");
const error_button = document.getElementById("error_button");
const error_classList = "hidden mt-3 w-[240px] h-[40px] bg-red-100 border border-red-400 text-red-700 px-[10px] py-[5px] rounded relative";
const success_classList = "mt-3 w-[315px] h-[40px] bg-green-100 border border-green-400 text-green-700 px-[10px] py-[5px] rounded relative";
const username_border_color = "outline-gray-300";
const profile_image = document.getElementById("profile_image");
const input_file = document.getElementById("input_file");
const userDropdownMenu = document.getElementById("userDropdownMenu")
const search = document.getElementById("search")
const url = new URLSearchParams(window.location.search);

save_button.addEventListener("click", saveChanges);
input_file.addEventListener("click", changePicture);


$(document).ready(function () {
    $("#profile-settings").on("click", async function (e) {
        e.preventDefault();
        try {
            window.location.href = `/user/profile-settings`
        } catch (err) {
            console.error("Login Error:", err);
            alert("An error occurred. Check the F12 console.");
        }
    });

    $("#account-security").on("click", async function (e) {
        e.preventDefault();
        try {
            window.location.href = `/user/account-security`
        } catch (err) {
            console.error("Login Error:", err);
            alert("An error occurred. Check the F12 console.");
        }
    });

    $("#reservations").on("click", async function (e) {
        e.preventDefault();
        try {
            window.location.href = `/user/account-reserve`
        } catch (err) {
            console.error("Login Error:", err);
            alert("An error occurred. Check the F12 console.");
        }
    });
})


//Puts Username
async function updateUsername() {
    const response = await fetch(`/user/edit/username`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: username_input.value })
    });
}

//Puts Bio
async function updateBio() {
    const response = await fetch(`/user/edit/bio`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ bio: biography_input.value })
    });
}

//Puts Profile Picture
async function updateProfilePicture(image) {
    const formData = new FormData();
    formData.append('profile_picture', image);
    const response = await fetch(`/user/edit/profile-picture`, {
        method: 'PUT',
        body: formData
    });
    const result = await response;
    console.log(result)
}

function saveChanges() {
    username_border.classList.replace("outline-red-300", username_border_color);

    let valid = true;
    if (username_input.value == "") {
        valid = false;
        username_border.classList.replace(username_border_color, "outline-red-300");
        error_text.innerHTML = "Username cannot be empty.";
        error.classList = error_classList;
        error_button.classList.remove("hidden");
        error.classList.remove("hidden");
        error_header.innerHTML = "Error!"

        username_input.addEventListener("click", (event) => {
            username_border.classList.replace("outline-red-300", username_border_color);
        });

        error_button.addEventListener("click", (event) => {
            error.classList.add("hidden");
        });
    }

    if (valid == true) {
        updateUsername();
        updateBio();
        username_border.classList.replace("outline-red-300", username_border_color);
        username_input.placeholder = username_input.value;
        profile_username.innerHTML = username_input.value;
        error_header.innerHTML = "Success!";
        error_text.innerHTML = "You have successfully updated your profile."
        error_button.classList.add("hidden");
        error.classList = success_classList;
    }
}

function changePicture() {
    input_file.onchange = function () {
        const image = input_file.files[0];
        profile_image.src =  URL.createObjectURL(image)
        updateProfilePicture(image);
    }
}

async function getUserSearchSuggestions(input) {
    if (input.trim().length === 0) {
        userDropdownMenu.innerHTML = '';
        return;
    }
    const response = await fetch(`/user/searchRecommended?username=${input}`);
    const users = await response.json();
    userDropdownMenu.innerHTML = '';

    if (users.length === 0) {
        const li = document.createElement('li');
        li.className = "px-4 py-2 text-slate-600 text-sm";
        li.textContent = "No User Found";
        userDropdownMenu.appendChild(li);
    }

    for (let i = 0; i < 5 && i < users.length; i++) {
        let searchedUserId = users[i]._id;

        const li = document.createElement('li');
        li.setAttribute('data-id', searchedUserId);
        li.className = "userSuggestion px-4 py-2 text-slate-600 hover:bg-slate-50 text-sm cursor-pointer flex items-center gap-2";
        const img = document.createElement('img');
        console.log(users[i].profile_picture);
        img.src = users[i].profile_picture;
        img.alt = `${users[i].username}'s profile picture`;
        img.className = "w-6 h-6 rounded-full object-cover";
        const usernameSpan = document.createElement('span');
        usernameSpan.textContent = users[i].username;
        li.appendChild(img);
        li.appendChild(usernameSpan);
        userDropdownMenu.appendChild(li);
    }
}

async function viewUser(e) {
    const btn = e.target.closest(".userSuggestion")
    if (!btn) return;
    const user = btn.closest('li')
    const searchedUserId = user.getAttribute('data-id')
    search.value = ""
    userDropdownMenu.innerHTML = '';
    window.location.href = `/user/view-other-user-profile?id=${searchedUserId}`
}

search.addEventListener('input', (e) => {
    userDropdownMenu.innerHTML = ''; 
    getUserSearchSuggestions(e.target.value)
    console.log("Value changed to: " + e.target.value);
});

search.addEventListener('keydown', async (e) => {
  if (e.key === 'Enter') {
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
        window.location.href = `/user/view-other-user-profile?id=${searchedUserId}`
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