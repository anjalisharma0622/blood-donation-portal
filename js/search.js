// ===== search.js =====
// Reads donors from localStorage, renders cards, and filters live by blood group + city.

(function () {
  const resultsEl = document.getElementById("donor-results");
  if (!resultsEl) return;

  const noResultsEl = document.getElementById("no-results");
  const bloodGroupSelect = document.getElementById("filterBloodGroup");
  const cityInput = document.getElementById("filterCity");
  const clearBtn = document.getElementById("clear-filters");

  // Seed a few sample donors on first visit so the page isn't empty for a demo.
  function seedSampleDonors() {
    const existing = getFromStorage("donors");
    if (existing.length > 0) return;
    const samples = [
      { id: 1, fullName: "Rohan Mehta", bloodGroup: "O+", city: "Pune", phone: "9876543210", lastDonation: "2026-04-12" },
      { id: 2, fullName: "Priya Sharma", bloodGroup: "A+", city: "Mumbai", phone: "9876501234", lastDonation: "2026-05-02" },
      { id: 3, fullName: "Karan Singh", bloodGroup: "B-", city: "Pune", phone: "9812345670", lastDonation: "2026-03-20" },
      { id: 4, fullName: "Ananya Rao", bloodGroup: "AB+", city: "Nashik", phone: "9900112233", lastDonation: "2026-06-15" },
      { id: 5, fullName: "Vikram Joshi", bloodGroup: "O-", city: "Pune", phone: "9765432109", lastDonation: "2026-02-28" },
    ];
    localStorage.setItem("donors", JSON.stringify(samples));
  }

  function initials(name) {
    return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
  }

  function renderDonors(list) {
    resultsEl.innerHTML = "";
    if (list.length === 0) {
      noResultsEl.classList.remove("hidden");
      return;
    }
    noResultsEl.classList.add("hidden");

    list.forEach((donor) => {
      const card = document.createElement("div");
      card.className = "donor-card";
      card.innerHTML = `
        <div class="donor-card-top">
          <div class="donor-avatar">${initials(donor.fullName || "?")}</div>
          <span class="donor-bg-badge">${donor.bloodGroup || "-"}</span>
        </div>
        <h3>${donor.fullName || "Unnamed donor"}</h3>
        <p class="donor-city">📍 ${donor.city || "Unknown city"}</p>
        <p class="donor-phone">${donor.phone ? "📞 " + donor.phone : ""}</p>
      `;
      resultsEl.appendChild(card);
    });
  }

  function applyFilters() {
    const bg = bloodGroupSelect.value;
    const city = cityInput.value.trim().toLowerCase();
    const all = getFromStorage("donors");

    const filtered = all.filter((donor) => {
      const matchesBg = !bg || donor.bloodGroup === bg;
      const matchesCity = !city || (donor.city || "").toLowerCase().includes(city);
      return matchesBg && matchesCity;
    });

    renderDonors(filtered);
  }

  seedSampleDonors();
  renderDonors(getFromStorage("donors"));

  bloodGroupSelect.addEventListener("change", applyFilters);
  cityInput.addEventListener("input", applyFilters);
  clearBtn.addEventListener("click", () => {
    bloodGroupSelect.value = "";
    cityInput.value = "";
    applyFilters();
  });
})();