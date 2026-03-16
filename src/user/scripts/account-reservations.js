const profile_image = document.getElementById("profile_image");
const input_file = document.getElementById("input_file");

input_file.addEventListener("click", changePicture);

function changePicture() {
    input_file.onchange = function() {
        profile_image.src = URL.createObjectURL(input_file.files[0]);
    }
}