# Section 5: Wiring up the preview

**Type:** `coding`
**Target time:** 10 min
**Capability added:** A live share preview sits beside the form and updates as you type.

> The component is already written and sitting unused in the repo. This section is about wiring, not about building it: what you pass a presentational component, and why passing the edited record is what makes it live.

---

## Starting state

`code-reference/section-4/`: the validated five-field form.

---

## Steps

1. **Read the component first.** Open `routes/identity/components/preview-card/index.tsx`. Two things to notice:

   - It takes a single `data` prop of type `SiteSettings`. It holds no state and selects nothing about edits.
   - It *does* call `useSelect` for one thing: turning `site_social_image` and `site_icon` attachment IDs into URLs via `getEntityRecord( 'postType', 'attachment', id )`. The form gives us IDs, and an `<img>` needs a `src`.

   It is an approximation of a share card, not a faithful render of any one platform.

2. **Import it.** In `routes/identity/stage.tsx`, add `Stack` to the `@wordpress/ui` import:

   ```tsx
   import { Button, Stack } from '@wordpress/ui';
   ```

   and add above the stylesheet import in the internal dependencies block:

   ```tsx
   import { PreviewCard } from './components/preview-card';
   ```

3. **Lay the two columns out.** In `routes/identity/stage.tsx`, wrap the existing `<div className={ styles.form }>` in a `Stack` and add the card beside it, so the body of `<Page>` reads:

   ```tsx
   			<Stack direction="row" gap="2xl" align="flex-start" justify="center">
   				<div className={ styles.form }>
   					<DataForm
   						data={ data }
   						fields={ fields }
   						form={ form }
   						validity={ validity }
   						onChange={ ( edits: Partial< SiteSettings > ) =>
   							editEntityRecord( 'root', 'site', SITE_KEY, edits )
   						}
   					/>
   				</div>
   				<PreviewCard data={ data } />
   			</Stack>
   ```

   Mind the indentation: the `DataForm` block moves one level deeper.

4. **Check it.** Type in the title field and watch the preview change before you save. That is the payoff of section 2's decision to render from `getEditedEntityRecord`: the same edited record drives the form and the preview, so they cannot disagree, and neither one needed a `useState`.

---

## End state

The finished artifact: a client-side admin route with text fields, media pickers, validation, and a live preview, all over the `root`/`site` entity. This state is captured in `code-reference/section-5/`.

✅ 🎉

---

## Take it further

Four things the workshop deliberately left out. Each one is self-contained, and the repo you have is a fine place to try them.

- Add a notice after a successful save. `@wordpress/notices` and the `snackbar` context are the short path.
- Split the form into two panels with `layout: { type: 'panel' }` and see what changes.
- Add a second route at `/advanced` and link between them.
- Point the same `fields` and `form` at a custom post type instead of the site entity.
