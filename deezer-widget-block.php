<?php
/**
 * Plugin Name:       Deezer Widget Block
 * Description:       Deezer widget block for Gutenberg
 * Version:           0.1.0
 * Requires at least: 6.7
 * Requires PHP:      7.4
 * Author:            n-langle
 * Author URI:        https://github.com/n-langle
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       deezer-widget-block
 *
 * @package CreateBlock
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class DeezerWidgetBlock {
	/**
	 * Constructor
	 */
	public function __construct() {
		add_action( 'init', [ $this, 'init' ] );
		add_action( 'rest_api_init', [ $this, 'rest_api_init' ] );
	}

	/**
	 * Initialize the block
	 */
	public function init(): void {
		register_block_type_from_metadata( __DIR__ . '/build' );
	}

	/**
	 * Initialize the REST API
	 */
	public function rest_api_init(): void {
		register_rest_route(
			'deezer-widget-block/v1',
			'/deezer-search',
			[
				'methods' => 'GET',
				'callback' => [ $this, 'search' ],
				'permission_callback' => '__return_true',
				'args' => [
					'query' => [
						'type' => 'string',
						'required' => true,
					],
					'connection' => [
						'type' => 'string',
						'required' => false,
						'validate_callback' => function ( $value ) {
							$allowed_values = [
								'',
								'album',
								'artist',
								'history',
								'playlist',
								'podcast',
								'radio',
								'track',
								'user'
							];

							return in_array( $value, $allowed_values, true );
						},
					],
				],
			]
		);
	}

	/**
	 * Search
	 *
	 * @param WP_REST_Request $request
	 * @return array
	 */
	public function search( WP_REST_Request $request ): array {
		$query      = $request->get_param( 'query' );
		$connection = $request->get_param( 'connection' );

		$args = [
			'headers' => [
				'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
			]
		];
	
		$url      = 'https://api.deezer.com/search' . ( $connection ? '/' . $connection : '' ) . '?q=' . urlencode( $query );
		$response = wp_remote_get( $url, $args );
		
		if ( is_wp_error( $response ) || 200 !== (int) wp_remote_retrieve_response_code( $response ) ) {
			return [
				'data'  => [],
				'error' => $response->get_error_message(),
				'url'   => $url,
			];
		}
	
		$body = wp_remote_retrieve_body( $response );
	
		try {
			$data = json_decode( $body, true, 512, JSON_THROW_ON_ERROR );
		} catch ( \Exception $e ) {
			return [
				'data'  => [],
				'error' => $e->getMessage(),
				'url'   => $url,
			];
		}

		$data['error'] = '';
		$data['url']   = $url;
	
		return $data;
	}
}

new DeezerWidgetBlock();
