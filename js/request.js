// ===== request.js =====
// Handles the "Request Blood" form: validation + save to localStorage.

(function () {
  const form = document.getElementById("request-form");
  if (!form) return;

  const phonePattern = /^[0-9]{10}$/;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const patientName = document.getElementById("patientName");
    const bloodGroupNeeded = document.getElementById("bloodGroupNeeded");
    const urgency = document.getElementById("urgency");
    const hospitalName = document.getElementById("hospitalName");
    const city = document.getElementById("reqCity");
    const contactNumber = document.getElementById("contactNumber");

    let valid = true;
    valid = validateField(patientName, "Please enter the patient's name.") && valid;
    valid = validateField(bloodGroupNeeded, "Please select the blood group needed.") && valid;
    valid = validateField(urgency, "Please select urgency.") && valid;
    valid = validateField(hospitalName, "Please enter the hospital name.") && valid;
    valid = validateField(city, "Please enter the city.") && valid;
    valid = validateField(contactNumber, "Please enter a contact number.") && valid;

    if (contactNumber.value && !phonePattern.test(contactNumber.value)) {
      validateField(contactNumber, "Contact number must be exactly 10 digits.");
      contactNumber.setCustomValidity("invalid");
      valid = false;
    } else {
      contactNumber.setCustomValidity("");
    }

    if (!valid) return;

    const request = {
      id: Date.now(),
      patientName: patientName.value.trim(),
      bloodGroupNeeded: bloodGroupNeeded.value,
      urgency: urgency.value,
      hospitalName: hospitalName.value.trim(),
      city: city.value.trim(),
      contactNumber: contactNumber.value.trim(),
      createdAt: new Date().toISOString(),
    };

    saveToStorage("requests", request);
    form.reset();
    showSuccessPopup();
  });
})();