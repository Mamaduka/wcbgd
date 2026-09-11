/**
 * WordPress dependencies
 */
import { Page } from '@wordpress/admin-ui';
import { store as coreStore } from '@wordpress/core-data';
import { useDispatch, useSelect } from '@wordpress/data';
import { DataForm, type Field, type Form } from '@wordpress/dataviews';
import { MediaEdit } from '@wordpress/fields';
import { decodeEntities } from '@wordpress/html-entities';
import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/ui';

/**
 * Internal dependencies
 */
import styles from './style.module.scss';
import type { SiteSettings } from './types';

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
];

const form: Form = {
	layout: { type: 'regular', labelPosition: 'top' },
	fields: [
		'title',
		'description',
		'site_logo',
		'site_icon',
		'site_social_image',
	],
};

// The site entity is a singleton, so it has no record key.
const SITE_KEY = undefined as unknown as string;

export const stage = () => {
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

	return (
		<Page
			title={ __( 'Identity', 'identity' ) }
			subTitle={ __(
				'Manage how your site presents itself.',
				'identity'
			) }
			hasPadding
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
		>
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
		</Page>
	);
};
