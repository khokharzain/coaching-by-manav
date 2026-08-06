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

    // Gallery: automatic glide with manual control.
    //
    // The strip holds the same photographs twice. It advances by nudging
    // scrollLeft each animation frame, and wraps at the halfway point,
    // where the second set sits exactly where the first began — so the
    // loop never visibly restarts.
    //
    // Driving a real scroll container rather than a CSS transform means
    // the arrows, a trackpad, a drag and a swipe all move the same thing.
    const galleryViewport = document.querySelector("#gallery-viewport");
    const galleryPrev = document.querySelector("#gallery-prev");
    const galleryNext = document.querySelector("#gallery-next");
    const galleryToggle = document.querySelector("#gallery-toggle");

    if (galleryViewport) {
        const PIXELS_PER_SECOND = 46;

        const reduceMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        let paused = reduceMotion;
        let pointerHeld = false;
        let resumeTimer = null;
        let lastFrame = null;
        let carry = 0;

        const halfWidth = () => galleryViewport.scrollWidth / 2;

        // Keep the position inside the first copy. Because the second copy
        // is identical, the jump is invisible.
        const wrap = () => {
            const half = halfWidth();
            if (half <= 0) return;

            if (galleryViewport.scrollLeft >= half) {
                galleryViewport.scrollLeft -= half;
            } else if (galleryViewport.scrollLeft < 0) {
                galleryViewport.scrollLeft += half;
            }
        };

        const step = (timestamp) => {
            if (lastFrame === null) lastFrame = timestamp;
            const elapsed = (timestamp - lastFrame) / 1000;
            lastFrame = timestamp;

            if (!paused && !pointerHeld && elapsed < 0.5) {
                // Sub-pixel movement is carried between frames, otherwise
                // rounding stalls the strip at slow speeds.
                carry += PIXELS_PER_SECOND * elapsed;
                const whole = Math.floor(carry);

                if (whole > 0) {
                    carry -= whole;
                    galleryViewport.scrollLeft += whole;
                    wrap();
                }
            }

            window.requestAnimationFrame(step);
        };

        window.requestAnimationFrame(step);

        // Hold the auto advance while a manual scroll settles, so the two
        // are never fighting over the same property.
        const holdThenResume = (ms) => {
            paused = true;
            window.clearTimeout(resumeTimer);

            resumeTimer = window.setTimeout(() => {
                if (!reduceMotion && !galleryViewport.dataset.userPaused) {
                    paused = false;
                }
                lastFrame = null;
            }, ms);
        };

        const nudge = (direction) => {
            const slide = galleryViewport.querySelector(".gallery-slide");
            const distance = slide
                ? slide.getBoundingClientRect().width + 18
                : galleryViewport.clientWidth * 0.7;

            wrap();
            galleryViewport.scrollBy({
                left: direction * distance,
                behavior: "smooth"
            });
            holdThenResume(900);
        };

        if (galleryPrev && galleryNext) {
            galleryPrev.classList.add("is-visible");
            galleryNext.classList.add("is-visible");

            galleryPrev.addEventListener("click", () => nudge(-1));
            galleryNext.addEventListener("click", () => nudge(1));
        }

        galleryViewport.addEventListener("keydown", (event) => {
            if (event.key === "ArrowRight") {
                event.preventDefault();
                nudge(1);
            }

            if (event.key === "ArrowLeft") {
                event.preventDefault();
                nudge(-1);
            }
        });

        // Pause while the visitor is looking, dragging or tabbed in.
        galleryViewport.addEventListener("pointerenter", () => {
            if (!galleryViewport.dataset.userPaused) paused = true;
        });

        galleryViewport.addEventListener("pointerleave", () => {
            pointerHeld = false;
            if (!reduceMotion && !galleryViewport.dataset.userPaused) {
                paused = false;
                lastFrame = null;
            }
        });

        galleryViewport.addEventListener("pointerdown", () => {
            pointerHeld = true;
        });

        window.addEventListener("pointerup", () => {
            pointerHeld = false;
            wrap();
        });

        galleryViewport.addEventListener("focusin", () => {
            paused = true;
        });

        galleryViewport.addEventListener("touchstart", () => {
            pointerHeld = true;
        }, { passive: true });

        galleryViewport.addEventListener("touchend", () => {
            pointerHeld = false;
            holdThenResume(1200);
        });

        // Explicit pause control. Continuously moving content needs one,
        // and hovering does not exist on a touch screen.
        if (galleryToggle) {
            const toggleText =
                galleryToggle.querySelector(".gallery-toggle-text");

            if (reduceMotion) {
                galleryToggle.setAttribute("aria-pressed", "true");
                galleryViewport.dataset.userPaused = "true";
                if (toggleText) toggleText.textContent = "Play";
            }

            galleryToggle.addEventListener("click", () => {
                const nowPaused = !galleryViewport.dataset.userPaused;

                if (nowPaused) {
                    galleryViewport.dataset.userPaused = "true";
                    paused = true;
                } else {
                    delete galleryViewport.dataset.userPaused;
                    paused = false;
                    lastFrame = null;
                }

                galleryToggle.setAttribute("aria-pressed", String(nowPaused));
                if (toggleText) {
                    toggleText.textContent = nowPaused ? "Play" : "Pause";
                }
            });
        }
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