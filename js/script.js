"use strict";

document.addEventListener("DOMContentLoaded", () => {
    // Automatically display the current year in the footer.
    const currentYearElement = document.querySelector("#current-year");

    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    // Temporarily disable the Square booking button
    // until Manav's public Square booking URL is added.
    const squareBookingLink = document.querySelector("#square-booking-link");

    if (squareBookingLink) {
        const bookingUrl = squareBookingLink.getAttribute("href");

        if (!bookingUrl || bookingUrl === "#") {
            squareBookingLink.setAttribute("aria-disabled", "true");

            squareBookingLink.addEventListener("click", (event) => {
                event.preventDefault();
            });
        }
    }
});