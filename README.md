<!-- markdownlint-disable MD033 MD041 -->
MedLink – Project E
Overview

MedLink is a lightweight tele‑medicine platform built with vanilla Node.js and modern front‑end techniques. It aims to connect patients with certified doctors anywhere in the world. The project supports user authentication, appointment booking, doctor and patient dashboards, internationalization, and theme switching. All of this is achieved without external frameworks – just Node.js core modules on the back‑end and vanilla JavaScript on the front‑end.

The application consists of a minimal HTTP server (server.js) and a collection of static pages and scripts. Data is stored in JSON files (doctors, users and appointments) for ease of development. Passwords are salted and hashed using Node’s built‑in crypto module, sessions are stored in memory, and API responses are delivered as JSON
GitHub
. On the client side, components such as modals, tabs, accordions, counters, parallax effects and 3‑D card tilts are written from scratch with modern browser APIs
GitHub
GitHub
.

Key Features

Authentication & Sessions – Users can sign up or log in via modal forms. The server hashes passwords with PBKDF2 and stores salts and hashes in data/users.json
GitHub
. Successful authentication issues a session cookie which is used for subsequent API calls
GitHub
.

Appointments API – A REST‑style API allows patients to book appointments and both patients and doctors to view their upcoming visits. Endpoints include:

POST /api/signup – create a new user (patient or doctor)
GitHub
.

POST /api/login – verify credentials and establish a session
GitHub
.

GET /api/session – return current user information if the session is valid
GitHub
.

GET /api/doctors?lang=en|ru|all – fetch doctor profiles, optionally filtered by language
GitHub
.

GET /api/patient/{email}/appointments – list a patient’s appointments
GitHub
.

GET /api/doctor/{email}/appointments – list a doctor’s appointments
GitHub
.

POST /api/appointments – create a new appointment (requires a valid session)
GitHub
.

Doctor & Patient Dashboards – Separate dashboard pages display relevant statistics and tables. For doctors, the dashboard greets them by name and shows the number of upcoming visits, the date of the nearest visit and their email
GitHub
. Patients see their next appointment, total visits and contact details
GitHub
.

Data‑Driven – Doctors are defined in data/doctors-en.json and data/doctors-ru.json with fields such as id, name, specialty, country, biography, email, phone and working hours
GitHub
. A sample appointment structure looks like this: { id, docId, patId, doctor, patient, date, service, status }
GitHub
. Users can be pre‑seeded in data/users.json, storing name, email, role, salt and hash
GitHub
.

Internationalization (i18n) – The site supports English and Russian. A comprehensive dictionary defines translations for navigation labels, hero sections, services descriptions and modal texts
GitHub
GitHub
. The setLang function stores the current language in localStorage, updates the DOM via [data‑i18n] attributes and toggles active buttons
GitHub
.

Theme Switching – Users can toggle between light and dark themes. The current theme is persisted in localStorage; the <html> element is updated early to avoid flash of incorrect theme
GitHub
.

Responsive UI & Enhancements – The front end includes a collapsible sidebar for navigation
GitHub
, language buttons
GitHub
, in‑page navigation highlighting via the IntersectionObserver API
GitHub
, scroll‑triggered fade‑ins
GitHub
, parallax effects
GitHub
, rotating quotes
GitHub
, animated counters and accordions
GitHub
GitHub
GitHub
. The landing page showcases top doctors and calls to action
GitHub
.

Project Structure

The repository is organised into the following top‑level files and directories:

Path	Purpose
server.js	Bare‑bones HTTP server that serves static files and exposes the REST API. Uses Node core modules (http, fs, path and crypto)
GitHub
.
auth.js	Client‑side script for authentication. Manages modal visibility and submits login and signup requests to the API
GitHub
.
script.js	Main front‑end script included on most pages. Handles sidebar collapse, language switching, navigation highlighting, hero parallax, review rotation, 3‑D card tilt, session checks and insertion of dashboard links
GitHub
GitHub
GitHub
.
services.js	Logic for the Services page: tabbed content for patient services, accordions for doctor onboarding, scroll‑triggered animations and animated counters
GitHub
GitHub
GitHub
.
doctorCabinet.js	Dashboard logic for doctors: fetches session info, loads appointments, computes statistics and dynamically generates the visits table
GitHub
.
patientCabinet.js	Dashboard logic for patients: similar to doctorCabinet.js but tailored to the patient view
GitHub
GitHub
GitHub
.
i18n.js	Translation dictionary and language switching helper. Defines the English and Russian text strings and updates the DOM based on the selected language
GitHub
GitHub
.
theme.js	Theme switcher for light/dark mode
GitHub
.
data/	Contains JSON files for doctors (doctors-en.json, doctors-ru.json), users (users.json) and appointments (appointments.json).
images/	Image assets referenced from CSS and JSON.
*.html files	Static pages: index.html (home), services.html, doctors.html, doctor-cabinet.html, patient-cabinet.html, etc.
Getting Started
Prerequisites

Node.js – Version ≥ 16 is recommended. The server uses only Node core modules, so no external dependencies are required.

NPM – Optional; used only for running scripts. There are no third‑party packages in this project
GitHub
.

Installation

Clone the repository

git clone https://github.com/rcc00n/prj_E.git
cd prj_E


Install dependencies

There are none! The project intentionally avoids external packages. However, you may run npm install to initialise the node_modules directory if you plan to add your own dependencies in the future.

Start the server

Use the provided start script or run node server.js directly:

# using npm
npm start

# or directly
node server.js


The server listens on port 8080 and prints the URL on startup
GitHub
. Open your browser to http://localhost:8080 to load the application.

User Workflow

Navigate to the home page and explore top doctors, services and patient reviews. Switch between English and Russian via the language buttons and toggle dark/light mode using the theme button
GitHub
GitHub
.

Use the “Log in / Sign up” button in the sidebar to create a patient or doctor account. A modal appears for login or registration
GitHub
.

After logging in, a dashboard icon appears in the sidebar (patient or doctor) based on your role
GitHub
. Doctors can view their upcoming appointments and patient details
GitHub
, while patients can see their next visit and complete history
GitHub
.

From the Doctors page, search for a specialist by name or specialty and click Book to open the appointment form. Choose a date and service to schedule your visit. The appointment is stored in appointments.json and appears in both dashboards
GitHub
.

API Reference

The server exposes a simple JSON API. All endpoints start with /api/ and return JSON responses. The Content-Type is application/json and the HTTP status code indicates success or error. For endpoints requiring authentication, a valid session cookie (sid) must be present.

Authentication
Method	Endpoint	Body	Response	Notes
POST	/api/signup	{name, email, password, role?}	{} on success	Creates a new user. Roles default to patient. Passwords are hashed with PBKDF2 and stored with a salt
GitHub
. A session cookie is set on success.
POST	/api/login	{email, password}	{} on success	Verifies the user’s credentials and issues a session cookie
GitHub
. Returns 401 on failure.
GET	/api/session	–	{name, email, role}	Returns the current session’s user. Returns 401 if no session exists
GitHub
.
Doctors
Method	Endpoint	Query Params	Response	Notes
GET	/api/doctors	lang = en, ru or all	Array of doctor objects	Reads doctors-<lang>.json and merges languages when all is specified
GitHub
. Each doctor includes id, name, specialty, country, bio, email, phone and hours
GitHub
.
Appointments
Method	Endpoint	Body	Response	Notes
POST	/api/appointments	{ doctorEmail, when, service }	{ ok: true } on success	Requires a valid session cookie. Looks up the doctor by email, then appends an appointment record to appointments.json
GitHub
.
GET	/api/patient/{email}/appointments	–	Array of appointments	Returns appointments where patId matches the patient’s email
GitHub
. Unauthenticated fallback reads the entire file and filters client‑side.
GET	/api/doctor/{email}/appointments	–	Array of appointments	Returns appointments where docId matches the doctor’s email
GitHub
.
Internationalization

All interface text is defined in the i18n.js dictionary. The keys are structured logically (e.g. nav.home, hero.title, svc.opinionP1). The page markup uses data-i18n and data-i18n-placeholder attributes to identify translatable elements. When a user selects a language, setLang() stores the choice, updates the HTML lang attribute, replaces innerHTML/placeholder text and dispatches a langChanged event
GitHub
. Additional languages can be added by extending the T object with new locale keys.
GitHub
GitHub

Theme

The theme.js module implements a simple dark/light switcher. On page load, it checks localStorage for the user’s last choice and adds a .light class to <html> if necessary. Clicking the theme button toggles the class and updates localStorage
GitHub
. The CSS uses the .light modifier to override default dark theme variables.

Extending the Project

This repository is intended as a foundation for more complex tele‑health applications. Possible improvements include:

Database integration – Replace the JSON files with a real database (e.g. PostgreSQL, MongoDB) and use an ORM. Session storage should also be moved out of memory to support multiple instances.

Form validation and error handling – Add client‑side and server‑side validation for email formats, password strength and date/time parsing. Provide more descriptive error responses.

Security enhancements – Use HTTPS in production, implement CSRF protection, rate limiting and secure cookie flags. Increase the PBKDF2 iteration count and consider using argon2 or bcrypt.

Third‑party authentication – Allow users to sign in with OAuth providers (Google, Facebook, etc.).

Responsive design – The current layout is mobile friendly, but additional media queries and accessible styling would improve usability.

Unit tests – Add automated tests for API endpoints and UI components to ensure stability.

Continuous deployment – Set up a CI/CD pipeline to lint code, run tests and deploy to a hosting provider.

Contributing

Contributions are welcome! If you find bugs or have suggestions for enhancements, please open an issue or submit a pull request. When contributing, follow these guidelines:

Fork the repository and create a new branch for your feature.

Write clear commit messages and describe the motivation for the change.

Update the documentation and add tests where applicable.

Ensure that the project builds and runs without errors.

License

This project is licensed under the ISC license, as specified in package.json
GitHub
. Feel free to modify and distribute the code under the terms of that license.

Built with ❤️ by the MedLink team. We hope this project serves as a useful example of how much can be achieved with plain JavaScript and a careful focus on user experience.
