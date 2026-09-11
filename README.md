# A Modern Way to Build WordPress Dashboard Pages

**WordCamp Belgrade 2026** · September 19, 2026

## Presenter

Giorgi Mamadashvili, WordPress Core Committer, sponsored full-time by GoDaddy

[@Mamaduka](https://x.com/Mamaduka) · [mamaduka.com](https://mamaduka.com/) · [WordPress.org profile](https://profiles.wordpress.org/mamaduka/)

---

## What we're building

A replacement for the classic Settings → General screen, scoped to one question: **how does this site present itself?** By the end you will have a client-side admin route that renders a `DataForm` over the `root`/`site` entity, with text fields, media pickers, custom validation, and a live share preview beside it.

Five fields, all of them site-facing:

| Field | Setting | Notes |
| --- | --- | --- |
| Title | `blogname` | |
| Description | `blogdescription` | Tagline. Validated to 200 characters. |
| Logo | `site_logo` | Attachment ID. |
| Icon | `site_icon` | Favicon and app icon. |
| Social image | `site_social_image` | Registered by this plugin. Core has no such option. |

---

## Pre-workshop setup

Please do this **before** the day, so we are not all fighting the venue wifi at once.

1. **WordPress 7.0 or newer.** Any local install works: [Studio](https://developer.wordpress.com/studio), `wp-env`, Local, MAMP, your own stack. The route relies on script modules that landed in 7.0, so older versions will not run this plugin.

2. **Node.js 20.19 or newer** (or 22.13+), ideally via [nvm](https://github.com/nvm-sh/nvm) or [fnm](https://github.com/schniz/fnm). The repo ships an `.nvmrc`, so from the plugin directory you can just run:
   ```bash
   nvm use
   ```

3. **Clone it into your site's plugins folder.** Change the first line to match your own WordPress install:
   ```bash
   cd /path/to/your-site/wp-content/plugins
   git clone https://github.com/Mamaduka/wcbgd.git
   ```

4. **Install and build:**
   ```bash
   cd wcbgd
   npm install && npm run build
   ```

5. **Activate** the "Identity" plugin, then open **Settings → Identity**. You should see a page header and the placeholder text "The form goes here." That is the correct starting state.

6. During the workshop, run the watcher instead of rebuilding by hand:
   ```bash
   npm run dev
   ```

---

## Workshop structure

90 minutes: about 70 of building, with the rest for questions at the end.

| # | Section | Type | Time | Capability added |
| --- | --- | --- | --- | --- |
| 1 | [The tour](./workshop-outline/section-1.md) | tour | 10 min | Nothing. Orientation: how the page, the route, and the build fit together. |
| 2 | [A form over the site entity](./workshop-outline/section-2.md) | coding | 20 min | Title and description, editable and saveable. |
| 3 | [Media fields](./workshop-outline/section-3.md) | coding | 20 min | Logo, icon, and social image pickers. |
| 4 | [Validation](./workshop-outline/section-4.md) | coding | 10 min | A description length rule that blocks saving. |
| 5 | [Wiring up the preview](./workshop-outline/section-5.md) | coding | 10 min | A live share preview beside the form. |

Each coding section adds exactly one capability. The end state of section N is the start state of section N+1, with no hidden setup in between.

Start here → **[Section 1](./workshop-outline/section-1.md)**

### Falling behind

Every coding section has a matching folder in `code-reference/` holding that section's finished code. (Section 1 is a tour and changes nothing, so it has no snapshot.) Finishing one section is the same thing as being ready to start the next, so copying a section's folder over your own files puts you back on track.

If you lose the thread partway through section 4, take the finished code from section 3. Run this from the plugin folder:

```bash
cp -R code-reference/section-3/. .
```

Only `routes/identity/stage.tsx` changes during the workshop, so that is the only file you are replacing.

---

## Documentation

- [DataViews and DataForm](https://github.com/WordPress/gutenberg/tree/trunk/packages/dataviews)
- [`@wordpress/build`](https://github.com/WordPress/gutenberg/tree/trunk/packages/build)
- [`@wordpress/admin-ui`](https://github.com/WordPress/gutenberg/tree/trunk/packages/admin-ui)
- [`@wordpress/ui`](https://github.com/WordPress/gutenberg/tree/trunk/packages/ui)
- [`@wordpress/fields`](https://github.com/WordPress/gutenberg/tree/trunk/packages/fields)
- [`@wordpress/core-data`](https://developer.wordpress.org/block-editor/reference-guides/data/data-core/)
- [Settings REST API reference](https://developer.wordpress.org/rest-api/reference/settings/)
