# Section 4: Validation

**Type:** `coding`
**Target time:** 10 min
**Capability added:** An over-long description reports an error and blocks saving.

> Validation lives on the field, not on the form and not on the input. `useFormValidity` walks the fields named by the form, collects the results, and gives you both a per-field validity object to hand back to `DataForm` and a single boolean for the Save button.

---

## Starting state

`code-reference/section-3/`: all five fields, no validation.

---

## Steps

1. **Import the hook and `sprintf`.** In `routes/identity/stage.tsx`, replace the `@wordpress/dataviews` and `@wordpress/i18n` imports with:

   ```tsx
   import {
   	DataForm,
   	useFormValidity,
   	type Field,
   	type Form,
   } from '@wordpress/dataviews';
   ```

   and

   ```tsx
   import { __, sprintf } from '@wordpress/i18n';
   ```

2. **Add the limit.** In `routes/identity/stage.tsx`, add above the `fields` array:

   ```tsx
   const DESCRIPTION_MAX_LENGTH = 200;
   ```

3. **Add the rule.** In `routes/identity/stage.tsx`, replace the `description` field's `description` property and add an `isValid` block, so the whole field reads:

   ```tsx
   	{
   		id: 'description',
   		type: 'text',
   		label: __( 'Description', 'identity' ),
   		description: sprintf(
   			/* translators: %d: maximum number of characters. */
   			__(
   				'In a few words, explain what this site is about. Up to %d characters.',
   				'identity'
   			),
   			DESCRIPTION_MAX_LENGTH
   		),
   		getValue: ( { item } ) => decodeEntities( item.description ?? '' ),
   		// A `maxLength` rule would be passed to the input as the native
   		// attribute, which silently truncates. This reports instead.
   		isValid: {
   			custom: ( item: SiteSettings ) => {
   				const length = ( item.description ?? '' ).length;
   				return length > DESCRIPTION_MAX_LENGTH
   					? sprintf(
   							/* translators: %d: maximum number of characters. */
   							__(
   								'Keep the description to %d characters or fewer.',
   								'identity'
   							),
   							DESCRIPTION_MAX_LENGTH
   					  )
   					: null;
   			},
   		},
   	},
   ```

   Read the comment out loud. There is a built-in `maxLength` rule, and it is the wrong tool: it becomes the native `maxlength` attribute, which stops the twenty-first character from appearing and never tells the user why. A `custom` rule lets the user type past the limit and explains the problem. Returning a string means invalid, `null` means valid.

4. **Run the rules.** In `routes/identity/stage.tsx`, add after the `useDispatch` call:

   ```tsx
   	const { validity, isValid } = useFormValidity( data, fields, form );
   ```

   It takes `form` as well as `fields` because only rendered fields are checked. A field you removed from the layout in section 3 cannot block a save.

5. **Use the results.** Two one-line edits. In the Save `<Button>`, replace the `disabled` prop:

   ```tsx
   					disabled={ ! hasEdits || ! isValid || isSaving }
   ```

   And in `<DataForm>`, add after `form={ form }`:

   ```tsx
   					validity={ validity }
   ```

6. **Check it.** Paste a long paragraph into Description. The error should appear under the field and Save should go disabled. Trim it back and both recover.

---

## End state

The form refuses to save an invalid description and says why. This state is captured in `code-reference/section-4/` and is the starting point for section 5.

✅ 🎉

---

## Ready to move on?
[Section 5: Wiring up the preview](./section-5.md)

## Missing something from this section?
```bash
cp -R code-reference/section-4/. .
```
