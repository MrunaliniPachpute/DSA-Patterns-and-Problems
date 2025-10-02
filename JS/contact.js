// Contact Form Functionality
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contactForm");
  const submitBtn = form.querySelector(".submit-btn");
  const inputs = form.querySelectorAll("input, textarea");

  // Real-time validation
  inputs.forEach((input) => {
    input.addEventListener("blur", validateField);
    input.addEventListener("input", clearError);
  });

  // Form submission
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (validateForm()) {
      submitForm();
    }
  });

  function validateField(e) {
    const field = e.target;
    const value = field.value.trim();

    // Remove existing error
    clearError(e);

    // Validate based on field type
    if (field.hasAttribute("required") && !value) {
      showError(field, "This field is required");
      return false;
    }

    if (field.type === "email" && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        showError(field, "Please enter a valid email address");
        return false;
      }
    }

    if (field.name === "name" && value && value.length < 2) {
      showError(field, "Name must be at least 2 characters long");
      return false;
    }

    if (field.name === "message" && value && value.length < 10) {
      showError(field, "Message must be at least 10 characters long");
      return false;
    }

    return true;
  }

  function validateForm() {
    let isValid = true;

    inputs.forEach((input) => {
      if (!validateField({ target: input })) {
        isValid = false;
      }
    });

    return isValid;
  }

  function showError(field, message) {
    const formGroup = field.closest(".form-group");

    // Remove any existing error
    const existingError = formGroup.querySelector(".error-message");
    if (existingError) {
      existingError.remove();
    }

    // Add error styling
    field.style.borderColor = "#e74c3c";
    field.style.backgroundColor = "#fdf2f2";

    // Create and add error message
    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message";
    errorDiv.style.cssText = `
      color: #e74c3c;
      font-size: 0.85rem;
      margin-top: 0.5rem;
      display: flex;
      align-items: center;
      gap: 0.3rem;
    `;
    errorDiv.innerHTML = `<span>⚠️</span> ${message}`;

    formGroup.appendChild(errorDiv);
  }

  function clearError(e) {
    const field = e.target;
    const formGroup = field.closest(".form-group");
    const errorMessage = formGroup.querySelector(".error-message");

    if (errorMessage) {
      errorMessage.remove();
    }

    // Reset field styling
    field.style.borderColor = "";
    field.style.backgroundColor = "";
  }

  function submitForm() {
    // Change button to loading state
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML =
      '<span class="btn-text">Sending...</span><span class="btn-icon">⏳</span>';
    submitBtn.disabled = true;
    submitBtn.style.opacity = "0.7";

    // Simulate API call
    setTimeout(() => {
      // Show success message
      showSuccessMessage();

      // Reset form
      form.reset();

      // Reset button
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      submitBtn.style.opacity = "1";

      // Auto-hide success message after 5 seconds
      setTimeout(hideSuccessMessage, 5000);
    }, 1500);
  }

  function showSuccessMessage() {
    // Remove any existing success message
    const existingSuccess = document.querySelector(".success-message");
    if (existingSuccess) {
      existingSuccess.remove();
    }

    const successDiv = document.createElement("div");
    successDiv.className = "success-message";
    successDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #27ae60, #2ecc71);
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 10px;
      box-shadow: 0 10px 30px rgba(46, 204, 113, 0.3);
      z-index: 1000;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 500;
      animation: slideIn 0.5s ease-out;
    `;

    successDiv.innerHTML = `
      <span style="font-size: 1.2rem;">✅</span>
      <span>Thank you! Your message has been sent successfully.</span>
    `;

    // Add animation keyframes if not already added
    if (!document.querySelector("#success-animation-styles")) {
      const style = document.createElement("style");
      style.id = "success-animation-styles";
      style.textContent = `
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes slideOut {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }

    document.body.appendChild(successDiv);
  }

  function hideSuccessMessage() {
    const successMessage = document.querySelector(".success-message");
    if (successMessage) {
      successMessage.style.animation = "slideOut 0.5s ease-out";
      setTimeout(() => {
        if (successMessage.parentNode) {
          successMessage.remove();
        }
      }, 500);
    }
  }

  // Add smooth scroll effect for better UX
  const contactSection = document.querySelector(".contact-section");
  if (contactSection) {
    contactSection.style.scrollBehavior = "smooth";
  }

  // Auto-resize textarea
  const textarea = form.querySelector("textarea");
  if (textarea) {
    textarea.addEventListener("input", function () {
      this.style.height = "auto";
      this.style.height = this.scrollHeight + "px";
    });
  }
});
