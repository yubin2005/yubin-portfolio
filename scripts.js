document.addEventListener("DOMContentLoaded", function () {
    
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
