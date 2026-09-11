<?php
/**
 * Identity plugin for WordPress.
 *
 * @wordpress-plugin
 * Plugin Name:       Identity
 * Plugin URI:        https://github.com/Mamaduka/wcbgd
 * Description:       Identity settings for WordPress.
 * Version:           1.0.0
 * Requires at least: 7.0
 * Requires PHP:      7.4
 * Author:            WordCamp Belgrade 2026
 * Author URI:        https://belgrade.wordcamp.org/2026/
 * License:           GPL-2.0-or-later
 * License URI:       https://spdx.org/licenses/GPL-2.0-or-later.html
 * Text Domain:       identity
 */

namespace Mamaduka\Identity;

/**
 * Prints an admin notice when the plugin has not been built.
 */
function render_build_notice() {
	printf(
		'<div class="notice notice-error"><p>%s</p></div>',
		wp_kses(
			__( 'The Identity plugin has not been built. Run <code>npm install</code> and <code>npm run build</code> in the plugin directory, or <code>npm run dev</code> to build and watch for changes.', 'identity' ),
			array( 'code' => array() )
		)
	);
}

/*
 * Everything this plugin renders lives in `build/`, which is generated and not
 * committed. Bail with a notice rather than fataling on the missing require.
 */
$identity_build_file = plugin_dir_path( __FILE__ ) . 'build/build.php';
if ( ! file_exists( $identity_build_file ) ) {
	add_action( 'admin_notices', __NAMESPACE__ . '\render_build_notice' );
	return;
}

require_once $identity_build_file;

/**
 * Registers the social image setting.
 *
 * Core has no option for the image used when a link to the site is shared, so
 * the plugin adds one. Exposing it via REST puts it on the `root`/`site`
 * entity alongside the title, description, logo, and icon.
 */
function register_settings() {
	register_setting(
		'general',
		'site_social_image',
		array(
			'type'              => 'integer',
			'description'       => __( 'Attachment ID of the image shown when a link to this site is shared.', 'identity' ),
			'default'           => 0,
			'sanitize_callback' => 'absint',
			'show_in_rest'      => true,
		)
	);
}
add_action( 'init', __NAMESPACE__ . '\register_settings' );

/**
 * Registers the Identity settings page.
 */
function register_admin_page() {
	add_options_page(
		__( 'Identity', 'identity' ),
		__( 'Identity', 'identity' ),
		'manage_options',
		'identity-wp-admin',
		'identity_identity_wp_admin_render_page'
	);
}
add_action( 'admin_menu', __NAMESPACE__ . '\register_admin_page' );

/**
 * Enqueues the media modal.
 *
 * The logo and icon pickers open the classic `wp.media` frame, which the boot
 * module does not load. Every other dependency the route bundle reads off a
 * global is already a dependency of boot.
 */
function enqueue_media_assets() {
	// phpcs:ignore WordPress.Security.NonceVerification.Recommended
	if ( ! isset( $_GET['page'] ) || 'identity-wp-admin' !== $_GET['page'] ) {
		return;
	}

	wp_enqueue_media();
}
add_action( 'admin_enqueue_scripts', __NAMESPACE__ . '\enqueue_media_assets' );

