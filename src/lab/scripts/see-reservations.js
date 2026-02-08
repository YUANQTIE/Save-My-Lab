const LynnFromLasVegasModals = document.getElementById("LynnFromLasVegasModals");
const area = document.getElementById("chosen-seats");
const closeButton = document.querySelector(".close-button");

document.querySelectorAll(".seat-button").forEach(button => {button.addEventListener("click", () => {
    const seats = button.dataset.seats.split(",").map(s => s.trim()); //trims the seat names

    area.innerHTML = "";

    seats.forEach(seat => {
      const seatNo = document.createElement("div"); //adds the seat numbers along with the css properties
      seatNo.className = "seat-display";
      seatNo.textContent = seat;
      area.appendChild(seatNo); 
    });

    LynnFromLasVegasModals.classList.remove("hidden"); //makes the pop up appear
  });
});

closeButton.addEventListener("click", () => {
  LynnFromLasVegasModals.classList.add("hidden"); //hides the modal pop up when close button is clicked
});
