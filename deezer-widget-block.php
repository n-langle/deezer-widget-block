<?php
/**
 * Plugin Name:       Deezer Widget Block
 * Description:       Deezer widget block for Gutenberg
 * Version:           0.1.0
 * Requires at least: 6.4
 * Requires PHP:      7.4
 * Author:            n-langle
 * Author URI:        https://github.com/n-langle
 * Repository:        https://github.com/n-langle/deezer-widget-block
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       deezer-widget-block
 *
 * @package CreateBlock
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Deezer Widget Block class
 */
class DeezerWidgetBlock {
	/**
	 * Instance
	 *
	 * @var self
	 */
	private static $instance = null;

	/**
	 * Constructor
	 */
	public function __construct() {
		add_action( 'init', [ $this, 'register_deezer_widget_block' ] );
		add_action( 'rest_api_init', [ $this, 'rest_api_init' ] );
	}

	/**
	 * Register the block
	 */
	public function register_deezer_widget_block(): void {
		register_block_type( __DIR__ . '/build' );

		wp_add_inline_script(
			'n-langle-deezer-widget-block-editor-script',
			'const deezerWidgetBlockData = ' . json_encode(
				[
					'restSearchUrl' => rest_url( '/deezer-widget-block/v1/search' ),
					'restKey'       => $this->get_rest_key(),
				]
			) . ';',
			'before'
		);
	}

	/**
	 * Initialize the REST API
	 */
	public function rest_api_init(): void {
		register_rest_route(
			'deezer-widget-block/v1',
			'/search',
			[
				'methods'             => 'GET',
				'callback'            => [ $this, 'search' ],
				'permission_callback' => function ( $request ) {
					return $request->get_param( 'rest_key' ) === $this->get_rest_key();
				},
				'args'                => [
					'query'      => [
						'type'     => 'string',
						'required' => true,
					],
					'connection' => [
						'type'              => 'string',
						'required'          => false,
						'validate_callback' => function ( $value ) {
							$allowed_values = [
								'',
								'album',
								'artist',
								'playlist',
								'podcast',
								'track',
							];

							return in_array( $value, $allowed_values, true );
						},
					],
					'rest_key'   => [
						'type'     => 'string',
						'required' => true,
					],
				],
			]
		);
	}

	/**
	 * Get the REST key
	 *
	 * @return string
	 */
	public function get_rest_key(): string {
		$rest_key = get_transient( 'deezer_widget_block_rest_key' );

		if ( false !== $rest_key ) {
			return $rest_key;
		}

		$rest_key = sha1( uniqid() );
		set_transient( 'deezer_widget_block_rest_key', $rest_key, WEEK_IN_SECONDS );

		return $rest_key;
	}

	/**
	 * Search
	 *
	 * @param WP_REST_Request $request
	 * @return WP_REST_Response
	 */
	public function search( WP_REST_Request $request ): \WP_REST_Response {
		$query      = $request->get_param( 'query' );
		$connection = $request->get_param( 'connection' );
		$args       = [
			'headers' => [
				'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
			]
		];
		$url        = 'https://api.deezer.com/search' . ( $connection ? '/' . $connection : '' ) . '?q=' . urlencode( $query );
		$response   = wp_remote_get( $url, $args );
		
		if ( is_wp_error( $response ) || 200 !== (int) wp_remote_retrieve_response_code( $response ) ) {
			return rest_ensure_response( [
				'data'       => [],
				'error'      => $response->get_error_message(),
				'deezer_url' => $url,
			] );
		}
	
		$body = wp_remote_retrieve_body( $response );
	
		try {
			$data = json_decode( $body, true, 512, JSON_THROW_ON_ERROR );
		} catch ( \Exception $e ) {
			return rest_ensure_response( [
				'data'       => [],
				'error'      => $e->getMessage(),
				'deezer_url' => $url,
			] );
		}

		$data['error']      = '';
		$data['deezer_url'] = $url;
	
		return rest_ensure_response( $data );
	}

	public static function get_instance(): self {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}

		return self::$instance;
	}
}

/**
 * Initialize the plugin
 */
DeezerWidgetBlock::get_instance();
