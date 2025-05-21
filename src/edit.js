/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { __experimentalInputControl as InputControl, SelectControl } from '@wordpress/components';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import './editor.scss';
import { setBlockClassName } from './utils';
import { DeezerHorizontalLockup } from './Icons';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */
export default function Edit({ attributes, setAttributes }) {
	const blockProps = useBlockProps();
	const [ searchQuery, setSearchQuery ] = useState( '' );
	const [ searchResults, setSearchResults ] = useState( [] );
	const [ connection, setConnection ] = useState( '' );

	const onInputSearchChange = ( value ) => {
		const url = new URL( window.location.origin + '/wp-json/deezer-widget-block/v1/deezer-search' );

		url.searchParams.set( 'query', value );
		url.searchParams.set( 'connection', connection );

		fetch( url )
			.then( response => response.json() )
			.then( data => {
				console.log(data);
				setSearchResults( data );
			});
	}

	const onConnectionChange = ( value ) => {
		setConnection( value );

		setSearchResults( [] );
		setSearchQuery( '' );
	}

	const onInputDeezerUrlChange = ( value ) => {
		
	}

	const setInputDeezerUrlValue = ( value ) => {
		setSearchResults( [] );
		setAttributes( { deezerUrl: value } );
	}

	setBlockClassName( blockProps );

	return (
		<div { ...blockProps }>
			<DeezerHorizontalLockup />
			<div className="wp-block-deezer-widget__form">
				<div className="wp-block-deezer-widget__form-row">
					<SelectControl
						label={ __( 'Connections', 'deezer-widget-block' ) }
						labelPosition="top"
						value={ connection }
						options={ [
							{ label: __( 'None', 'deezer-widget-block' ), value: '' },
							{ label: __( 'Album', 'deezer-widget-block' ), value: 'album' },
							{ label: __( 'Artist', 'deezer-widget-block' ), value: 'artist' },
							{ label: __( 'History', 'deezer-widget-block' ), value: 'history' },
							{ label: __( 'Playlist', 'deezer-widget-block' ), value: 'playlist' },
							{ label: __( 'Podcast', 'deezer-widget-block' ), value: 'podcast' },
							{ label: __( 'Radio', 'deezer-widget-block' ), value: 'radio' },
							{ label: __( 'Track', 'deezer-widget-block' ), value: 'track' },
							{ label: __( 'User', 'deezer-widget-block' ), value: 'user' },
						] }
						onChange={ onConnectionChange }
						__next40pxDefaultSize
            			__nextHasNoMarginBottom
					/>
					<div className="wp-block-deezer-widget__form-search">
						<InputControl
							label={ __( 'Search', 'deezer-widget-block' ) }
							placeholder={ __( 'Rick Astley', 'deezer-widget-block' ) }
							value={ searchQuery }
							onChange={ onInputSearchChange }
						/>
						{ searchResults.data && searchResults.data.length > 0 && (
							<ul className="wp-block-deezer-widget__search-results">
								{ searchResults.data.map( result => (
									<li key={ result.id }>
										<img src={ result.album.cover_small } alt={ result.album.title } />
										<div>
											<button onClick={ () => setInputDeezerUrlValue( result.link ) }>{ result.title }</button>
											<button onClick={ () => setInputDeezerUrlValue( result.artist.link ) }>{ result.artist.name }</button>
											<button onClick={ () => setInputDeezerUrlValue( result.album.link ) }>{ result.album.title }</button>
										</div>
									</li>
								) ) }
							</ul>
						) }
					</div>
				</div>
				<div className="wp-block-deezer-widget__form-row">
					<InputControl
						label={ __( 'Deezer url', 'deezer-widget-block' ) }
						placeholder={ __( 'https://www.deezer.com/us/artist/6160', 'deezer-widget-block' ) }
						value={ attributes.deezerUrl }
						onChange={ onInputDeezerUrlChange }
					/>
				</div>
				<div className="wp-block-deezer-widget__form-row">
					<button className="wp-block-deezer-widget__form-submit">{ __( 'Embed', 'deezer-widget-block' ) }</button>
				</div>
			</div>
		</div>
	);
}
