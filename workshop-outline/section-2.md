# Section 2: A form over the site entity

**Type:** `coding`
**Target time:** 20 min
**Capability added:** The screen renders an editable title and description and can save them back to the site.

> `DataForm` takes three things: the data, a description of the available fields, and a form layout naming which of those fields to show. We supply the data from `@wordpress/core-data`, which already knows how to read and write the `root`/`site` entity, so we never touch `fetch` or the REST API directly.

Docs: [DataViews and DataForm](https://github.com/WordPress/gutenberg/tree/trunk/packages/dataviews) · [`@wordpress/core-data`](https://developer.wordpress.org/block-editor/reference-guides/data/data-core/)

---

## Starting state

A fresh clone. `routes/identity/stage.tsx` renders the placeholder paragraph.

---

## Steps

1. **Replace the import block** at the top of `routes/identity/stage.tsx`. Swap the two existing imports for these:

   ```tsx
   /**
    * WordPress dependencies
    */
   import { Page } from '@wordpress/admin-ui';
   import { store as coreStore } from '@wordpress/core-data';
   import { useDispatch, useSelect } from '@wordpress/data';
   import { DataForm, type Field, type Form } from '@wordpress/dataviews';
   import { decodeEntities } from '@wordpress/html-entities';
   import { __ } from '@wordpress/i18n';
   import { Button } from '@wordpress/ui';

   /**
    * Internal dependencies
    */
   import styles from './style.module.scss';
   import type { SiteSettings } from './types';
   ```

   `SiteSettings` and the stylesheet already exist in the repo. Open `types.ts` if you want to see the shape we are working against.

2. **Describe the fields.** In `routes/identity/stage.tsx`, add below the imports and above `export const stage`:

   ```tsx
   const fields: Field< SiteSettings >[] = [
   	{
   		id: 'title',
   		type: 'text',
   		label: __( 'Title', 'identity' ),
   		description: __( 'The name of your site.', 'identity' ),
   		getValue: ( { item } ) => decodeEntities( item.title ?? '' ),
   	},
   	{
   		id: 'description',
   		type: 'text',
   		label: __( 'Description', 'identity' ),
   		description: __(
   			'In a few words, explain what this site is about.',
   			'identity'
   		),
   		getValue: ( { item } ) => decodeEntities( item.description ?? '' ),
   	},
   ];
   ```

   `getValue` is doing real work here. Settings come back HTML-encoded, so a site called `Ben & Jerry` arrives as `Ben &amp; Jerry`. Without `decodeEntities` the user sees the entity in the input.

3. **Declare the layout.** Add directly below the `fields` array:

   ```tsx
   const form: Form = {
   	layout: { type: 'regular', labelPosition: 'top' },
   	fields: [ 'title', 'description' ],
   };

   // The site entity is a singleton, so it has no record key.
   const SITE_KEY = undefined as unknown as string;
   ```

   Note that `fields` and `form` are separate. The field list is the vocabulary of what *can* be shown; the form picks and orders what *is* shown. That split is what lets the same field definitions drive a form here and a DataViews table elsewhere.

4. **Read the entity.** In `routes/identity/stage.tsx`, add as the first lines inside `export const stage = () => {`:

   ```tsx
   	const { data, hasEdits, isSaving } = useSelect( ( select ) => {
   		const { getEditedEntityRecord, hasEditsForEntityRecord, isSavingEntityRecord } =
   			select( coreStore );

   		return {
   			data: getEditedEntityRecord(
   				'root',
   				'site',
   				SITE_KEY
   			) as SiteSettings,
   			hasEdits: hasEditsForEntityRecord( 'root', 'site', SITE_KEY ),
   			isSaving: isSavingEntityRecord( 'root', 'site', SITE_KEY ),
   		};
   	}, [] );

   	const { editEntityRecord, saveEditedEntityRecord } =
   		useDispatch( coreStore );
   ```

   `getEditedEntityRecord` returns the saved record with any unsaved edits layered on top. That is what makes the form controlled without us holding a single piece of local state.

5. **Render the form.** In `routes/identity/stage.tsx`, replace the placeholder line `<p>{ __( 'The form goes here.', 'identity' ) }</p>` with:

   ```tsx
   			<div className={ styles.form }>
   				<DataForm
   					data={ data }
   					fields={ fields }
   					form={ form }
   					onChange={ ( edits: Partial< SiteSettings > ) =>
   						editEntityRecord( 'root', 'site', SITE_KEY, edits )
   					}
   				/>
   			</div>
   ```

   Every keystroke dispatches `editEntityRecord`, which stages an edit in the store. Nothing has been written to the database yet.

6. **Add the Save action.** In `routes/identity/stage.tsx`, add an `actions` prop to `<Page>`, after `hasPadding`:

   ```tsx
   			actions={
   				<Button
   					variant="solid"
   					tone="brand"
   					size="compact"
   					disabled={ ! hasEdits || isSaving }
   					loading={ isSaving }
   					loadingAnnouncement={ __( 'Saving', 'identity' ) }
   					onClick={ () =>
   						saveEditedEntityRecord( 'root', 'site', SITE_KEY )
   					}
   				>
   					{ __( 'Save', 'identity' ) }
   				</Button>
   			}
   ```

   `hasEdits` is why the button starts disabled and wakes up the moment you type.

7. **Check it.** With `npm run dev` running, reload Settings → Identity. You should see two inputs populated with your site's real title and tagline, a disabled Save button that enables on the first keystroke, and a spinner on save. Change the title, save, and confirm it sticks after a reload.

---

## End state

The screen reads and writes the site's title and description. This state is captured in `code-reference/section-2/` and is the starting point for section 3.

✅ 🎉

---

## Ready to move on?
[Section 3: Media fields](./section-3.md)

## Missing something from this section?
```bash
cp -R code-reference/section-2/. .
```
