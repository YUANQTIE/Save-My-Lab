const users = [
    {
        username: "merry_ong",
        email: "merry_ong@dlsu.edu.ph",
        profile: "merry-profile.html"
    },
    {
        username: "admin",
        email: "admin@dlsu.edu.ph",
        profile: "admin-profile.html"
    },
    {
        username: "nigel_so",
        email: "nigel_so@dlsu.edu.ph",
        profile: "nigel-profile.html"
    },
    {
        username: "princess_tullao",
        email: "princess_tullao@dlsu.edu.ph",
        profile: "princess-profile.html"
    },
    {
        username: "yuan_panlilio",
        email: "yuan_miguel_panlilio@dlsu.edu.ph",
        profile: "yuan-user-profile.html"
    }
];

function searchUser() {
    let input = document.getElementById("site-search").value.toLowerCase();

    let foundUser = users.find(user =>
        user.username.toLowerCase().includes(input) ||
        user.email.toLowerCase().includes(input)
    );

    if (foundUser) {
        // Redirect to that user's profile
        window.location.href = "yuan-user-profile.html";
    } else {
        alert("User not found");
    }
}
