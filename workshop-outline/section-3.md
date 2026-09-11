# Section 3: Media fields

**Type:** `coding`
**Target time:** 20 min
**Capability added:** The form can pick a logo, an icon, and a social image from the media library.

> A field's `type` picks a default control. When the default is not enough, a field can bring its own via `Edit`. `@wordpress/fields` ships `MediaEdit`, which opens the classic `wp.media` frame and hands back an attachment. This is where the field abstraction earns its keep: three very different-looking controls, three near-identical declarations.

Docs: [`@wordpress/fields`](https://github.com/WordPress/gutenberg/tree/trunk/packages/fields)

---

## Starting state

`code-reference/section-2/`: the form with title and description.

---

## Steps

1. **Import the control.** In `routes/identity/stage.tsx`, add after the `@wordpress/dataviews` import:

   ```tsx
   import { MediaEdit } from '@wordpress/fields';
   ```

2. **Add the logo field.** In `routes/identity/stage.tsx`, add to the end of the `fields` array, after the `description` field:

   ```tsx
   	{
   		id: 'site_logo',
   		type: 'media',
   		label: __( 'Logo', 'identity' ),
   		description: __(
   			'Displayed in your site layout via the Site Logo block.',
   			'identity'
   		),
   		placeholder: __( 'Choose logo', 'identity' ),
   		Edit: MediaEdit,
   		setValue: ( { value }: { value?: number } ) => ( {
   			site_logo: value ?? 0,
   		} ),
   	},
   ```

   `setValue` exists because the control hands back an attachment and the setting stores an ID. `?? 0` matters: clearing the field has to send `0`, not `undefined`, or the removal never reaches the server.

3. **Add the icon and social image fields.** Same shape, twice more. Add them after `site_logo` in the `fields` array:

   ```tsx
   	{
   		id: 'site_icon',
   		type: 'media',
   		label: __( 'Icon', 'identity' ),
   		description: __(
   			'Shown in browser tabs, bookmarks, and mobile apps. Should be square and at least 512 by 512 pixels.',
   			'identity'
   		),
   		placeholder: __( 'Choose icon', 'identity' ),
   		Edit: MediaEdit,
   		setValue: ( { value }: { value?: number } ) => ( {
   			site_icon: value ?? 0,
   		} ),
   	},
   	{
   		id: 'site_social_image',
   		type: 'media',
   		label: __( 'Social image', 'identity' ),
   		description: __(
   			'Shown when a link to this site is shared. Works best at 1200 by 630 pixels.',
   			'identity'
   		),
   		placeholder: __( 'Choose social image', 'identity' ),
   		Edit: MediaEdit,
   		setValue: ( { value }: { value?: number } ) => ( {
   			site_social_image: value ?? 0,
   		} ),
   	},
   ```

   `site_social_image` is the one Core does not have. It reaches the form only because `identity.php` registered it with `show_in_rest` back in section 1.

4. **Show them.** Defining a field does not display it. In `routes/identity/stage.tsx`, replace the `form` constant's field list:

   ```tsx
   	fields: [
   		'title',
   		'description',
   		'site_logo',
   		'site_icon',
   		'site_social_image',
   	],
   ```

   Comment out one of these to prove the point: the field is still defined and still valid, it is just not rendered.

5. **Check it.** Reload the screen. Three pickers below the text inputs. Click one, choose an image, and watch Save enable. Save, reload, and confirm the thumbnail is still there. Setting the icon should change the favicon in your browser tab.

---

## End state

All five fields are editable and saveable. This state is captured in `code-reference/section-3/` and is the starting point for section 4.

✅ 🎉

---

## Ready to move on?
[Section 4: Validation](./section-4.md)

## Missing something from this section?
```bash
cp -R code-reference/section-3/. .
```
