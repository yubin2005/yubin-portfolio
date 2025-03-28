document.addEventListener("DOMContentLoaded", function () {
    // Typing effect
    const typingEffect = () => {
        const text = "Yubin Li";
        let index = 0;
        const element = document.getElementById("typing-effect");

        if (element) {
            element.innerHTML = "";
            function typeWriter() {
                if (index < text.length) {
                    element.innerHTML += text.charAt(index);
                    index++;
                    setTimeout(typeWriter, 150);
                } else {
                    element.style.borderRight = "none";
                }
            }
            typeWriter();
        }
    };

    typingEffect();

    // Mobile menu functionality
    const hamburger = document.querySelector(".hamburger");
    const mobileMenu = document.getElementById("mobileMenu");

    // Ensure mobile menu is hidden initially
    if (mobileMenu) {
        mobileMenu.style.display = "none";
    }

    if (hamburger && mobileMenu) {
        hamburger.addEventListener("click", function() {
            // Toggle hamburger animation
            hamburger.classList.toggle("active");
            
            // Toggle menu visibility
            if (mobileMenu.style.display === "none" || !mobileMenu.style.display) {
                mobileMenu.style.display = "flex";
            } else {
                mobileMenu.style.display = "none";
            }
        });
    }

    // Close menu when clicking on a link (optional)
    const menuLinks = document.querySelectorAll(".mobile-menu a");
    menuLinks.forEach(link => {
        link.addEventListener("click", function() {
            if (mobileMenu.style.display === "flex") {
                mobileMenu.style.display = "none";
                hamburger.classList.remove("active");
            }
        });
    });

    // Contact form handler
    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
        const statusMessage = document.getElementById("statusMessage");
        const submitBtn = contactForm.querySelector("button[type='submit']");

        contactForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const originalBtnHTML = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Sending...`;

            try {
                const response = await fetch(contactForm.action, {
                    method: "POST",
                    body: new FormData(contactForm),
                    headers: { "Accept": "application/json" }
                });

                const responseText = await response.text();
                let data;
                try {
                    data = JSON.parse(responseText);
                } catch {
                    data = {};
                }

                if (response.status >= 200 && response.status < 400) {
                    statusMessage.className = "status-message success";
                    statusMessage.innerHTML = `<i class="fas fa-check-circle"></i> Message sent successfully!`;
                    contactForm.reset();
                } else {
                    throw new Error(data.error || `Server responded with status: ${response.status}`);
                }
            } catch (error) {
                statusMessage.className = "status-message error";
                statusMessage.innerHTML = `<i class="fas fa-exclamation-triangle"></i> Error: ${error.message}`;
            } finally {
                statusMessage.style.display = "block";
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnHTML;
                setTimeout(() => {
                    statusMessage.style.display = "none";
                }, 5000);
            }
        });
    }
});
