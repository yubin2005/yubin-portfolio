document.addEventListener("DOMContentLoaded", function() {
    // Typing Effect
    const typingEffect = () => {
        const text = "Yubin Li";
        let index = 0;
        const element = document.getElementById("typing-effect");
        
        if (element) {
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

    // Form Handling
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

                // Debugging logs
                console.log("HTTP Status Code:", response.status);
                const responseText = await response.text();
                console.log("Raw Response:", responseText);

                let data;
                try {
                    data = JSON.parse(responseText);
                } catch (jsonError) {
                    console.warn("JSON parse error, handling non-JSON response");
                    data = {};
                }

                // Handle Formspree's success pattern
                if (response.status >= 200 && response.status < 400) {
                    statusMessage.className = "status-message success";
                    statusMessage.innerHTML = `
                        <i class="fas fa-check-circle"></i>
                        Message sent successfully! I'll respond shortly.`;
                    contactForm.reset();
                } else {
                    throw new Error(data.error || `Server responded with status: ${response.status}`);
                }
            } catch (error) {
                // Handle special Formspree success case with non-JSON response
                if (error.message.includes("Failed to parse")) {
                    statusMessage.className = "status-message success";
                    statusMessage.innerHTML = `
                        <i class="fas fa-check-circle"></i>
                        Message sent! Please check your email for confirmation.`;
                } else {
                    statusMessage.className = "status-message error";
                    statusMessage.innerHTML = `
                        <i class="fas fa-exclamation-triangle"></i>
                        Error: ${error.message}`;
                }
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

    // Initialize effects
    typingEffect();
});