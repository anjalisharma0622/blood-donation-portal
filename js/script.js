// ===== script.js =====
// Shared behavior loaded on every page: theme toggle, mobile nav, active link.

(function () {
  const THEME_KEY = "bdp-theme";
  const toggleBtn = document.querySelector(".theme-toggle");
  const root = document.documentElement;

  const darkColors = {
    "--color-white": "#17181a",
    "--color-gray": "#222325",
    "--color-gray-dark": "#a0a0a0",
    "--color-text": "#f0f0f0",
    "--color-bg": "#121314",
    "--color-surface": "#1c1d1f",
    "--color-border": "#2c2d2f",
    "--color-primary-light": "#3a1418",
  };

  function applyTheme(theme) {
    if (theme === "dark") {
      Object.entries(darkColors).forEach(([key, value]) => {
        root.style.setProperty(key, value);
      });
    } else {
      Object.keys(darkColors).forEach((key) => {
        root.style.removeProperty(key);
      });
    }
    updateToggleIcon(theme);
  }

  const savedTheme = localStorage.getItem(THEME_KEY) || "light";
  applyTheme(savedTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const isDark = root.style.getPropertyValue("--color-bg") === "#121314";
      const next = isDark ? "light" : "dark";
      localStorage.setItem(THEME_KEY, next);
      applyTheme(next);
    });
  }

  function updateToggleIcon(theme) {
    if (!toggleBtn) return;
    toggleBtn.textContent = theme === "dark" ? "☀️" : "🌙";
  }

  // Mobile nav toggle
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      navLinks.classList.toggle("open");
    });
  }

  // Highlight the active nav link based on current page
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach((link) => {
    const href = link.getAttribute("href");
    if (href === currentPage) {
      link.classList.add("active");
    }
  });

  // ===== Animated stat counters (real data from localStorage) =====
  const counters = document.querySelectorAll(".stat-number[data-source]");
  if (counters.length) {
    counters.forEach((el) => {
      const source = el.getAttribute("data-source");
      let target = 0;
      if (typeof getFromStorage === "function") {
        if (source === "donors") target = getFromStorage("donors").length;
        else if (source === "requests") target = getFromStorage("requests").length;
        else if (source === "lives") target = getFromStorage("donors").length * 3;
      }
      el.setAttribute("data-target", target);
    });

    const animateCounter = (el) => {
      const target = parseInt(el.getAttribute("data-target"), 10) || 0;
      const duration = 1400;
      const start = performance.now();

      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target).toLocaleString();
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = target.toLocaleString();
      }
      requestAnimationFrame(tick);
    };

    const counterObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((c) => counterObserver.observe(c));
  }

  // ===== Scroll reveal =====
  const revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length) {
    // Only hide elements once we know JS is running and about to manage them.
    revealEls.forEach((el) => el.classList.add("pre-reveal"));

    const revealObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove("pre-reveal");
            entry.target.classList.add("in-view");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  }

  // ===== FAQ accordion =====
  document.querySelectorAll(".faq-question").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".faq-item");
      const wasOpen = item.classList.contains("open");
      document.querySelectorAll(".faq-item.open").forEach((el) => el.classList.remove("open"));
      if (!wasOpen) item.classList.add("open");
    });
  });

  // ===== Contact form =====
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("contactName");
      const email = document.getElementById("contactEmail");
      const message = document.getElementById("contactMessage");

      let valid = true;
      if (typeof validateField === "function") {
        valid = validateField(name, "Please enter your name.") && valid;
        valid = validateField(email, "Please enter a valid email.") && valid;
        valid = validateField(message, "Please enter a message.") && valid;
      }
      if (!valid) return;

      contactForm.reset();
      if (typeof showSuccessPopup === "function") showSuccessPopup();
    });
  }

  // ===== Blood compatibility checker =====
  const checkerSelect = document.getElementById("checkerType");
  if (checkerSelect) {
    const compatibility = {
      "A+": { donateTo: ["A+", "AB+"], receiveFrom: ["A+", "A-", "O+", "O-"] },
      "A-": { donateTo: ["A+", "A-", "AB+", "AB-"], receiveFrom: ["A-", "O-"] },
      "B+": { donateTo: ["B+", "AB+"], receiveFrom: ["B+", "B-", "O+", "O-"] },
      "B-": { donateTo: ["B+", "B-", "AB+", "AB-"], receiveFrom: ["B-", "O-"] },
      "AB+": { donateTo: ["AB+"], receiveFrom: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] },
      "AB-": { donateTo: ["AB+", "AB-"], receiveFrom: ["A-", "B-", "AB-", "O-"] },
      "O+": { donateTo: ["A+", "B+", "AB+", "O+"], receiveFrom: ["O+", "O-"] },
      "O-": { donateTo: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], receiveFrom: ["O-"] },
    };
    const resultEl = document.getElementById("checker-result");

    checkerSelect.addEventListener("change", () => {
      const type = checkerSelect.value;
      if (!type) {
        resultEl.innerHTML = "";
        return;
      }
      const data = compatibility[type];
      resultEl.innerHTML = `
        <div class="checker-card">
          <p><strong>${type}</strong> can donate to: ${data.donateTo.join(", ")}</p>
          <p><strong>${type}</strong> can receive from: ${data.receiveFrom.join(", ")}</p>
        </div>
      `;
    });
  }
})();