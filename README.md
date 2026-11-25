# MedLink educational demo

A vanilla Node.js and browser-JavaScript study of account sessions, doctor discovery and appointment workflows. It is educational software, not a clinical service or a claim of medical certification. Use synthetic records only; the included visuals are presentation assets and do not verify professional credentials.

## Run and verify

Use Node 22 or newer. There are no runtime npm dependencies.

```sh
node scripts/init_demo_data.js
npm test
npm start
```

Open http://127.0.0.1:8080. Initialization creates empty local user/appointment files only when missing; it never overwrites records. `DEMO_DATA_DIR` can point to separate storage containing those files and the two doctor catalogue JSON files. `PORT` changes the listener port.

## Local synthetic doctor account

Stop the local server first. Set a private `DEMO_DOCTOR_PASSWORD` of 12–128 characters in your shell, then run `node scripts/provision_demo_doctor.js` against your disposable `DEMO_DATA_DIR`. The command adds only `doctor@example.test`, stores a salted password hash, and never overwrites an existing identity. Sign in through the normal login form with that synthetic email and your supplied password. Remove the environment variable afterward. This operator command is not exposed through HTTP and is not a real clinician-provisioning system.

## Boundary and tests

Only `public/` is web-accessible. Source, package files and data JSON are outside that root. Appointment reads require a live session whose email and role match the requested owner; patient creation uses the session identity. Unknown API routes, malformed JSON, unsupported content types and oversized requests fail predictably. Tests create temporary synthetic records and a localhost server, covering anonymous/cross-user reads, privileged signup rejection, local doctor ownership/provisioning, public catalogue access, static traversal and malformed requests. Dashboard scripts use authenticated endpoints only and escape stored user text before HTML rendering.

## Known limits

Sessions and JSON persistence are local to one process. Signup does not verify email or clinician identity, there is no production-grade rate limiting and no clinical compliance assessment. Public signup is patient-only. No public route can assign a doctor role. Locally provisioned doctor accounts are synthetic-demo fixtures, not credential verification. Do not put actual patient information in this application. Existing historical datasets are not certified as synthetic; local record files are excluded from the new source checkout and historical copies require separate owner review. Preserve original authorship when reusing this educational work.
