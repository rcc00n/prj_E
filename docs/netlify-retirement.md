# Historical Netlify publication

This repository preserves its original application/source. Its Netlify configuration intentionally publishes only `ops/netlify-retired/` and a dependency-free Edge Function. Once that commit is published by the existing Netlify integration, all requests return HTTP 410 with an explicit retirement message and `X-Robots-Tag: noindex, nofollow, noarchive`. No application records, images, or source files are included in the static publish directory. Local application commands remain separate.

`node scripts/check_retirement.mjs` executes 30 method/path checks against the actual Edge handler and verifies the isolated publish directory. Netlify also runs this check before building. Verify the real Deploy Preview first, including `/`, an old HTML page, `/api/session`, `/data/users.json`, and an image path; each must return 410, the retirement body, and noindex. After merging, repeat these checks on the main Netlify hostname.

## Scope and rollback

This retires the currently published content through repository configuration. It does not stop provider builds, unpublish/delete the Netlify project, remove old immutable deployment URLs, revoke credentials, erase Git history, or alter DNS/custom-domain settings. Those provider controls require an authenticated owner session. Existing preview/deploy URLs may remain accessible until the provider removes them; do not claim historical data removal from this change.

Source rollback is a revert of the retirement configuration commit, followed by a separately authorized Netlify build. The original source is retained, so no reconstruction is required. A provider-level rollback is also possible for an owner using a previously published deploy. Do not change a protected live site's DNS to point to this historical deployment.

References: [Netlify configuration precedence](https://docs.netlify.com/build/configure-builds/file-based-configuration/), [Edge response API](https://docs.netlify.com/build/edge-functions/api/), [deploy rollback and locking](https://docs.netlify.com/deploy/manage-deploys/manage-deploys-overview/).
