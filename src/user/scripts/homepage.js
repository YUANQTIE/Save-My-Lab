let slideIndex = 1;
showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
  showSlides(slideIndex += n);
}

// Dot controls
function currentSlide(n) {
  showSlides(slideIndex = n);
}

// Show the slide
function showSlides(n) {
  const slides = document.querySelectorAll(".mySlides");
  const dots = document.querySelectorAll(".dot");

  if (n > slides.length) slideIndex = 1;
  if (n < 1) slideIndex = slides.length;

  slides.forEach(slide => slide.classList.add("hidden"));
  dots.forEach(dot => dot.classList.remove("bg-gray-800"));

  slides[slideIndex - 1].classList.remove("hidden");
  dots[slideIndex - 1].classList.add("bg-gray-800");
}