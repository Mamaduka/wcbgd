/**
 * WordPress dependencies
 */
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { decodeEntities } from '@wordpress/html-entities';
import { __ } from '@wordpress/i18n';
import { Card, Text } from '@wordpress/ui';
import { filterURLForDisplay } from '@wordpress/url';

/**
 * Internal dependencies
 */
import type { SiteSettings } from '../../types';
import styles from './style.module.scss';

type PreviewCardProps = {
	data: SiteSettings;
};

/**
 * Approximation of how a link to the site looks when shared. Enough to show
 * what the fields do, not a faithful render of any single platform.
 */
export const PreviewCard = ( { data }: PreviewCardProps ) => {
	const {
		title,
		description,
		url,
		site_social_image: imageId,
		site_icon: iconId,
	} = data ?? {};

	const { imageUrl, iconUrl } = useSelect(
		( select ) => {
			const { getEntityRecord } = select( coreStore );

			return {
				imageUrl: imageId
					? ( getEntityRecord( 'postType', 'attachment', imageId ) as
							| { source_url?: string }
							| undefined )?.source_url
					: undefined,
				iconUrl: iconId
					? ( getEntityRecord( 'postType', 'attachment', iconId ) as
							| { source_url?: string }
							| undefined )?.source_url
					: undefined,
			};
		},
		[ imageId, iconId ]
	);

	return (
		<Card.Root className={ styles.card }>
			<Card.Header>
				<Card.Title variant="heading-sm">{ __( 'Preview', 'identity' ) }</Card.Title>
			</Card.Header>
			<Card.Content>
				<Card.FullBleed>
					<div className={ styles.image }>
						{ imageUrl ? (
							<img src={ imageUrl } alt="" />
						) : (
							<span className={ styles.imagePlaceholder }>
								{ __( 'No social image', 'identity' ) }
							</span>
						) }
					</div>
				</Card.FullBleed>
				<div className={ styles.meta }>
					<Text variant="heading-lg">
						{ decodeEntities( title ?? '' ) }
					</Text>
					{ description && (
						<Text variant="body-md">
							{ decodeEntities( description ) }
						</Text>
					) }
					<div className={ styles.source }>
						{ iconUrl && (
							<img
								className={ styles.icon }
								src={ iconUrl }
								alt=""
							/>
						) }
						<Text variant="body-sm">
							{ url ? filterURLForDisplay( url ) : '' }
						</Text>
					</div>
				</div>
			</Card.Content>
		</Card.Root>
	);
};
