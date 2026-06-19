/**
 * D & A Planning co. - Frontend Interaction Architecture Controller
 */

// Consolidated Core Initialization Lifecycle
window.addEventListener("load", () => {
    highlightActivePage();
    initNoButtonInfiniteSlideshow(); 
    initLightboxGallery();
    initInteractiveMapControl();
    initFormValidationEngine();      
    initServicesToTrackingRouter();  
});

/**
 * 1. AUTOMATED INFINITE SLIDESHOW ENGINE (NO BUTTONS REQUIRED)
 */
function initNoButtonInfiniteSlideshow() {
    const gallerySection = document.querySelector("section.gallery-container");
    if (!gallerySection) return; 

    const slideItems = Array.from(gallerySection.querySelectorAll(".gallery-item"));
    if (slideItems.length === 0) return;

    const lightboxContainer = gallerySection.querySelector("#lightbox");
    
    let runningTrack = gallerySection.querySelector(".gallery-container-track");
    if (!runningTrack) {
        runningTrack = document.createElement("div");
        runningTrack.classList.add("gallery-container-track");
        
        slideItems.forEach(item => runningTrack.appendChild(item));
        gallerySection.appendChild(runningTrack);

        if (lightboxContainer) {
            gallerySection.appendChild(lightboxContainer);
        }

        slideItems.forEach(item => {
            const structuralClone = item.cloneNode(true);
            runningTrack.appendChild(structuralClone);
        });
    }

    let currentTranslationX = 0;
    const speedPixelsPerFrame = 1.2; 
    let frameId = null;

    function renderSlideStep() {
        currentTranslationX -= speedPixelsPerFrame;
        const resetThresholdBoundary = runningTrack.scrollWidth / 2;

        if (resetThresholdBoundary <= 0) {
            runningTrack.style.transform = "translateX(0px)";
            frameId = requestAnimationFrame(renderSlideStep);
            return;
        }

        if (Math.abs(currentTranslationX) >= resetThresholdBoundary) {
            currentTranslationX = 0;
        }

        runningTrack.style.transform = `translateX(${currentTranslationX}px)`;
        frameId = requestAnimationFrame(renderSlideStep);
    }

    frameId = requestAnimationFrame(renderSlideStep);

    runningTrack.addEventListener("mouseenter", () => cancelAnimationFrame(frameId));
    runningTrack.addEventListener("mouseleave", () => frameId = requestAnimationFrame(renderSlideStep));
}

/**
 * 2. LIGHTBOX PREVIEW OVERLAY GALLERY
 */
function initLightboxGallery() {
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const closeButton = document.querySelector(".lightbox .close");

    if (!lightbox || !lightboxImg) return;

    document.body.addEventListener("click", (event) => {
        const targetedImage = event.target.closest(".gallery-item img");
        if (!targetedImage) return;

        lightbox.style.display = "flex";
        lightboxImg.src = targetedImage.src;
        lightboxImg.alt = targetedImage.alt;
        document.body.style.overflow = "hidden";
    });

    const closeWindowOverlay = () => {
        lightbox.style.display = "none";
        document.body.style.overflow = "auto";
    };

    if (closeButton) closeButton.addEventListener("click", closeWindowOverlay);
    lightbox.addEventListener("click", (event) => {
        if (event.target === lightbox) closeWindowOverlay();
    });
}

/**
 * 3. MULTI-PAGE NAVIGATION ACTIVE LINKS HIGHLIGHTER
 */
function highlightActivePage() {
    const currentPath = window.location.pathname.split("/").pop();
    const activePage = currentPath === "" ? "index.html" : currentPath.toLowerCase();
    
    const navLinks = document.querySelectorAll(".navigation a, nav a");

    navLinks.forEach(link => {
        const linkHref = link.getAttribute("href");
        
        if (linkHref) {
            const cleanedHref = linkHref.replace("./", "").toLowerCase();
            
            if (cleanedHref === activePage) {
                link.style.color = "var(--orange)";
                link.style.fontWeight = "bold";
                link.style.borderBottom = "2px solid var(--orange)";
                link.style.paddingBottom = "4px";
            } else {
                link.style.color = "var(--white)";
                link.style.borderBottom = "none";
            }
        }
    });
}

/**
 * 4. INTERACTIVE MAP CONTROLLER OVERLAY
 */
function initInteractiveMapControl() {
    const overlay = document.getElementById("mapOverlay");
    const mapWrapper = document.querySelector(".map-wrapper");

    if (!overlay || !mapWrapper) return; 

    overlay.addEventListener("click", () => {
        overlay.classList.add("activated");
    });

    mapWrapper.addEventListener("mouseleave", () => {
        overlay.classList.remove("activated");
    });
}

/**
 * 5. SMART FORM FIELD DATA VALIDATION ENGINE
 */
function initFormValidationEngine() {
    const contactForm = document.getElementById("contactForm");
    if (!contactForm) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Listen for form submission attempt triggers
    contactForm.addEventListener("submit", (event) => {
        let isFormValid = true;

        // Extract input objects cleanly
        const nameField = document.getElementById("name");
        const emailField = document.getElementById("email");
        const subjectField = document.getElementById("subject");
        const messageField = document.getElementById("message");

        // Validate Individual Fields
        if (nameField.value.trim().length < 2) {
            showFieldError(nameField, "nameError", "Please enter your full name.");
            isFormValid = false;
        } else {
            clearFieldError(nameField, "nameError");
        }

        if (!emailRegex.test(emailField.value.trim())) {
            showFieldError(emailField, "emailError", "Please provide a valid email address.");
            isFormValid = false;
        } else {
            clearFieldError(emailField, "emailError");
        }

        if (subjectField.value.trim().length < 3) {
            showFieldError(subjectField, "subjectError", "Subject must be at least 3 characters.");
            isFormValid = false;
        } else {
            clearFieldError(subjectField, "subjectError");
        }

        if (messageField.value.trim().length < 10) {
            showFieldError(messageField, "messageError", "Your message must be at least 10 characters.");
            isFormValid = false;
        } else {
            clearFieldError(messageField, "messageError");
        }

        // Halt transmission sequence if structural rules are violated
        if (!isFormValid) {
            event.preventDefault();
        } else {
            alert("Thank you! Your inquiry was analyzed and transmitted successfully.");
        }
    });

    // Helper functions to inject states dynamically
    function showFieldError(inputElement, errorSpanId, textMessage) {
        inputElement.classList.add("invalid-field");
        inputElement.classList.remove("valid-field");
        document.getElementById(errorSpanId).textContent = textMessage;
    }

    function clearFieldError(inputElement, errorSpanId) {
        inputElement.classList.remove("invalid-field");
        inputElement.classList.add("valid-field");
        document.getElementById(errorSpanId).textContent = "";
    }
}

/**
 * 6. SERVICE SECTIONS ROUTER
 * Auto-links matching service cards on services.html to track.html views
 */
function initServicesToTrackingRouter() {
    // Looks for service element cards on services.html
    const serviceItems = document.querySelectorAll(".service-item");
    if (serviceItems.length === 0) return;

    serviceItems.forEach(card => {
        // Change the cursor pattern to a pointer link indicator on hover
        card.style.cursor = "pointer";

        card.addEventListener("click", () => {
            // Send the user directly across pages to the Tracking platform view layout naturally
            window.location.href = "track.html";
        });
    });
}