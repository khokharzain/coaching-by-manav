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

    // Scroll progress line.
    //
    // Browsers that support scroll-driven CSS animations already handle
    // this in the stylesheet, off the main thread, so this only runs as a
    // fallback. Updates are batched into an animation frame and only
    // change a transform, so nothing is re-laid out while scrolling.
    const progressBar = document.querySelector("#scroll-progress-bar");

    const hasCssScrollTimeline =
        typeof window.CSS !== "undefined" &&
        typeof window.CSS.supports === "function" &&
        window.CSS.supports("animation-timeline", "scroll()");

    if (progressBar && !hasCssScrollTimeline) {
        let queued = false;

        const drawProgress = () => {
            const root = document.documentElement;
            const scrollable = root.scrollHeight - root.clientHeight;

            const progress =
                scrollable > 0
                    ? Math.min(1, Math.max(0, root.scrollTop / scrollable))
                    : 0;

            progressBar.style.transform = "scaleX(" + progress + ")";
            queued = false;
        };

        const queueDraw = () => {
            if (!queued) {
                queued = true;
                window.requestAnimationFrame(drawProgress);
            }
        };

        window.addEventListener("scroll", queueDraw, { passive: true });
        window.addEventListener("resize", queueDraw);
        drawProgress();
    }

    // Gallery pause control.
    //
    // The strip glides via a CSS animation, so it works with scripting
    // disabled. This only adds the ability to stop it, which continuously
    // moving content needs — hovering is not available on a touch screen.
    const galleryMarquee = document.querySelector("#gallery-marquee");
    const galleryToggle = document.querySelector("#gallery-toggle");

    if (galleryMarquee && galleryToggle) {
        const toggleText = galleryToggle.querySelector(".gallery-toggle-text");

        galleryToggle.addEventListener("click", () => {
            const paused = galleryMarquee.classList.toggle("is-paused");

            galleryToggle.setAttribute("aria-pressed", String(paused));

            if (toggleText) {
                toggleText.textContent = paused ? "Play" : "Pause";
            }
        });
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