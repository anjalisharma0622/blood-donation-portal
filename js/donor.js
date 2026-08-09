// ===== donor.js =====
// Handles the "Become a Donor" form: validation + save to localStorage.

(function () {
  const form = document.getElementById("donor-form");
  if (!form) return;

  const phonePattern = /^[0-9]{10}$/;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const fullName = document.getElementById("fullName");
    const age = document.getElementById("age");
    const gender = document.getElementById("gender");
    const bloodGroup = document.getElementById("bloodGroup");
    const city = document.getElementById("city");
    const phone = document.getElementById("phone");
    const email = document.getElementById("email");
    const lastDonation = document.getElementById("lastDonation");

    let valid = true;
    valid = validateField(fullName, "Please enter your full name.") && valid;
    valid = validateField(age, "Age must be between 18 and 65.") && valid;
    valid = validateField(gender, "Please select a gender.") && valid;
    valid = validateField(bloodGroup, "Please select a blood group.") && valid;
    valid = validateField(city, "Please enter your city.") && valid;
    valid = validateField(phone, "Please enter your phone number.") && valid;
    valid = validateField(email, "Please enter your email.") && valid;

    if (phone.value && !phonePattern.test(phone.value)) {
      validateField(phone, "Phone number must be exactly 10 digits.");
      phone.setCustomValidity("invalid");
      valid = false;
    } else {
      phone.setCustomValidity("");
    }

    if (email.value && !emailPattern.test(email.value)) {
      validateField(email, "Please enter a valid email address.");
      email.setCustomValidity("invalid");
      valid = false;
    } else {
      email.setCustomValidity("");
    }

    if (!valid) return;

    const donor = {
      id: Date.now(),
      fullName: fullName.value.trim(),
      age: age.value,
      gender: gender.value,
      bloodGroup: bloodGroup.value,
      city: city.value.trim(),
      phone: phone.value.trim(),
      email: email.value.trim(),
      lastDonation: lastDonation.value || null,
    };

    saveToStorage("donors", donor);
    form.reset();
    showSuccessPopup();
  });
})();