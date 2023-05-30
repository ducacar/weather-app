const errorButton = document.getElementById('errorButton');
errorButton.addEventListener('click', closeErrorMessage);

function closeErrorMessage() {
    const errorMessage = document.getElementById("error-message");
    errorMessage.style.display = "none";
}