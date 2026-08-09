// ===== storage.js =====
// Small reusable helpers around localStorage, used by donor.js, request.js, search.js.

function getFromStorage(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error(`Could not read "${key}" from storage:`, e);
    return [];
  }
}

function saveToStorage(key, item) {
  const list = getFromStorage(key);
  list.push(item);
  localStorage.setItem(key, JSON.stringify(list));
  return list;
}

function showSuccessPopup() {
  const popup = document.getElementById("success-popup");
  if (!popup) return;
  popup.classList.remove("hidden");
  const closeBtn = document.getElementById("popup-close");
  if (closeBtn) {
    closeBtn.onclick = () => popup.classList.add("hidden");
  }
  popup.onclick = (e) => {
    if (e.target === popup) popup.classList.add("hidden");
  };
}

// Generic field validator: returns true if valid, shows inline error if not.
function validateField(input, message) {
  const errorEl = input.closest(".form-row")?.querySelector(".error-msg");
  const isValid = input.checkValidity();
  if (errorEl) {
    errorEl.textContent = isValid ? "" : message || "This field is required.";
  }
  input.classList.toggle("invalid", !isValid);
  return isValid;
}

// Seed a few sample donors on first-ever visit (any page), so stats and
// Find a Donor aren't empty for a first-time demo.
(function seedSampleDonors() {
  if (localStorage.getItem("donors")) return;
  const samples = [
    { id: 1, fullName: "Rohan Mehta", bloodGroup: "O+", city: "Pune", phone: "9876543210", lastDonation: "2026-04-12" },
    { id: 2, fullName: "Priya Sharma", bloodGroup: "A+", city: "Mumbai", phone: "9876501234", lastDonation: "2026-05-02" },
    { id: 3, fullName: "Karan Singh", bloodGroup: "B-", city: "Pune", phone: "9812345670", lastDonation: "2026-03-20" },
    { id: 4, fullName: "Ananya Rao", bloodGroup: "AB+", city: "Nashik", phone: "9900112233", lastDonation: "2026-06-15" },
    { id: 5, fullName: "Vikram Joshi", bloodGroup: "O-", city: "Pune", phone: "9765432109", lastDonation: "2026-02-28" },
  ];
  localStorage.setItem("donors", JSON.stringify(samples));
})();