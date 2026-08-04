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

    // Gallery carousel arrows.
    //
    // Scrolling itself is handled natively by CSS scroll-snap, so the
    // gallery is fully usable with these buttons absent. They are only
    // shown once wired up, and only when there is content to scroll to.
    const galleryTrack = document.querySelector("#gallery-track");
    const galleryPrev = document.querySelector("#gallery-prev");
    const galleryNext = document.querySelector("#gallery-next");

    if (galleryTrack && galleryPrev && galleryNext) {
        const scrollAmount = () => {
            const slide = galleryTrack.querySelector(".gallery-slide");
            return slide
                ? slide.getBoundingClientRect().width + 18
                : galleryTrack.clientWidth * 0.8;
        };

        const canScroll = () =>
            galleryTrack.scrollWidth - galleryTrack.clientWidth > 4;

        const syncArrows = () => {
            const maxScroll =
                galleryTrack.scrollWidth - galleryTrack.clientWidth;

            galleryPrev.disabled = galleryTrack.scrollLeft <= 4;
            galleryNext.disabled = galleryTrack.scrollLeft >= maxScroll - 4;

            galleryPrev.classList.toggle("is-visible", canScroll());
            galleryNext.classList.toggle("is-visible", canScroll());
        };

        galleryPrev.addEventListener("click", () => {
            galleryTrack.scrollBy({ left: -scrollAmount(), behavior: "smooth" });
        });

        galleryNext.addEventListener("click", () => {
            galleryTrack.scrollBy({ left: scrollAmount(), behavior: "smooth" });
        });

        // Arrow keys move the strip when it has keyboard focus.
        galleryTrack.addEventListener("keydown", (event) => {
            if (event.key === "ArrowRight") {
                event.preventDefault();
                galleryTrack.scrollBy({ left: scrollAmount(), behavior: "smooth" });
            }

            if (event.key === "ArrowLeft") {
                event.preventDefault();
                galleryTrack.scrollBy({ left: -scrollAmount(), behavior: "smooth" });
            }
        });

        galleryTrack.addEventListener("scroll", syncArrows, { passive: true });
        window.addEventListener("resize", syncArrows);
        syncArrows();
    }

    // Reveal sections as they scroll into view.
    //
    // The .reveal-ready flag is only added once we know IntersectionObserver
    // exists, so an older browser shows everything immediately instead of a
    // blank page.
    const revealTargets = document.querySelectorAll(".reveal");

    if (revealTargets.length && "IntersectionObserver" in window) {
        document.documentElement.classList.add("reveal-ready");

        const revealObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-revealed");
                        revealObserver.unobserve(entry.target);
                    }
                });
            },
            { rootMargin: "0px 0px -12% 0px", threshold: 0.1 }
        );

        revealTargets.forEach((target) => revealObserver.observe(target));
    }

    // Highlight the navigation link for whichever section is on screen.
    const navLinks = Array.from(
        document.querySelectorAll(".nav-links a[href^='#']")
    );

    const sections = navLinks
        .map((link) => document.querySelector(link.getAttribute("href")))
        .filter(Boolean);

    if (sections.length && "IntersectionObserver" in window) {
        const setCurrent = (id) => {
            navLinks.forEach((link) => {
                link.classList.toggle(
                    "is-current",
                    link.getAttribute("href") === "#" + id
                );
            });
        };

        const navObserver = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

                if (visible) {
                    setCurrent(visible.target.id);
                }
            },
            { rootMargin: "-45% 0px -45% 0px" }
        );

        sections.forEach((section) => navObserver.observe(section));
    }
});