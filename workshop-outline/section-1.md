# Section 1: The tour

**Type:** `tour`
**Target time:** 10 min
**Capability added:** None. This section is orientation, so the code state passes through unchanged.

> Before we write anything, let us look at what is already in the repo and why. Everything here is plumbing you would write once per plugin and then forget about. The rest of the workshop happens in a single file.

---

## Starting state

A fresh clone, with `npm install && npm run build` already run. Settings → Identity shows a page header and the words "The form goes here."

---

## Steps

1. **`identity.php` does three things.** Open it and read it top to bottom, roughly 100 lines. Past the guard at the top that warns you when the plugin has not been built, it does this and no more:

   - `register_settings()` registers `site_social_image` with `show_in_rest` set. That is what puts the option on the `root`/`site` REST entity next to `title` and `site_logo`. Core has no option for the image used when a link to your site is shared, so the plugin adds one. This is the whole reason the screen is more than a reskin.
   - `register_admin_page()` calls `add_options_page()`. Nothing unusual.
   - `enqueue_media_assets()` calls `wp_enqueue_media()` on this screen only, because the media pickers we add in section 3 open the classic `wp.media` frame.

   Note what is *not* there: no rendering. The page callback is handed off to the built route.

2. **`build/build.php` is generated, not written.** `identity.php` requires it. It is produced by `@wordpress/build` from the config in `package.json`:

   ```json
   "wpPlugin": {
     "name": "identity",
     "handlePrefix": "identity",
     "pages": [ "identity" ]
   }
   ```

   One entry in `pages` means one admin page bundle. The generated PHP registers the script modules, the styles, and the page shell.

3. **Routes are declared by directory.** Look at `routes/identity/package.json`:

   ```json
   "route": {
     "path": "/",
     "page": "identity"
   }
   ```

   That mounts `routes/identity/stage.tsx` at the root path of the `identity` page. A second directory with `"path": "/advanced"` would give you client-side routing between two screens, with no extra PHP.

4. **`stage.tsx` is the entry point.** It exports one function named `stage`. Right now it renders `Page` from `@wordpress/admin-ui`, which supplies the standard header, title, subtitle, and actions slot. This one file is where we spend the remaining hour.

---

## End state

Unchanged. You should know where the admin page comes from, how the route is wired, and which single file we spend the rest of the hour in.

✅ 🎉

---

## Ready to move on?
[Section 2: A form over the site entity](./section-2.md)
