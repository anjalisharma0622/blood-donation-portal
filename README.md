# 🩸 RedThread — Blood Donation Portal

A frontend-only blood donation platform that connects donors and recipients. Built with plain HTML, CSS, and JavaScript — no framework, no backend, no build step.

## Live Demo

- [Add your live link here after deploying]

## Features

- **Home** — hero section, animated stat counters, testimonials, and a call-to-action banner
- **About** — donation eligibility, benefits, and process
- **Become a Donor** — validated registration form, saved to `localStorage`
- **Find a Donor** — live search and filter by blood group and city
- **Request Blood** — validated blood request form
- **Blood Groups** — compatibility table plus an interactive compatibility checker
- **FAQ** — accessible accordion using native `<details>`/`<summary>`
- **Contact** — contact form, address, and embedded map
- **Dark/Light mode** — toggle with saved preference
- **Fully responsive** — works down to mobile width with a collapsible nav

## Tech Stack

- HTML5
- CSS3 (custom properties for theming, no framework)
- Vanilla JavaScript
- Browser `localStorage` for data persistence

## Running Locally

No build step required. Either:

1. Open `index.html` directly in a browser, or
2. Use a local server (e.g. VS Code's "Live Server" extension) for the best experience

## Notes

- All donor and request data is stored in the browser's `localStorage`, scoped per-browser — it is not shared across devices or visitors.
- A few sample donors are seeded automatically on first visit so the site isn't empty on first load.

## License

Free to use and modify for learning or portfolio purposes.
