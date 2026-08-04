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

    // Branded play overlay for the introduction video.
    //
    // The overlay starts hidden in CSS and is only revealed here, so if
    // JavaScript fails to run the visitor still gets the native video
    // controls rather than an unclickable button covering the poster.
    const introVideo = document.querySelector("#intro-video");
    const introPlayButton = document.querySelector("#intro-video-play");

    if (introVideo && introPlayButton) {
        introPlayButton.classList.add("is-visible");

        const hideOverlay = () => {
            introPlayButton.classList.remove("is-visible");
        };

        introPlayButton.addEventListener("click", () => {
            const started = introVideo.play();

            // Safari returns undefined rather than a promise.
            if (started && typeof started.catch === "function") {
                started.catch(hideOverlay);
            }
        });

        // Hide on play rather than on click, so the overlay stays put
        // if playback is blocked for any reason.
        introVideo.addEventListener("play", hideOverlay);
    }
});