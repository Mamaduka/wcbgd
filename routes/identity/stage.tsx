/**
 * WordPress dependencies
 */
import { Page } from '@wordpress/admin-ui';
import { __ } from '@wordpress/i18n';

export const stage = () => {
	return (
		<Page
			title={ __( 'Identity', 'identity' ) }
			subTitle={ __(
				'Manage how your site presents itself.',
				'identity'
			) }
			hasPadding
		>
			<p>{ __( 'The form goes here.', 'identity' ) }</p>
		</Page>
	);
};
