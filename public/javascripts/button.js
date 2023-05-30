const button = document.getElementById("myButton");


button.addEventListener("click", function() {
  const fourDayForecast = document.getElementById("four-day-forecast");
  fourDayForecast.classList.toggle("d-none");
});

