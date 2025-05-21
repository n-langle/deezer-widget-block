/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { __experimentalInputControl as InputControl, PanelBody, RadioControl, RangeControl, SelectControl } from '@wordpress/components';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import './editor.scss';
import { isValidDeezerUrl, setBlockClassName } from './utils';
import { DeezerHorizontalLockup } from './Icons';
import DeezerWidget from './DeezerWidget';

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
	const [ isEditing, setIsEditing ] = useState( false );

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
		if ( !isValidDeezerUrl( value ) ) {
			// show message to user
		}

		setAttributes( { deezerUrl: value } );
	}

	const setInputDeezerUrlValue = ( value ) => {
		setSearchResults( [] );
		setIsEditing( false );
		setAttributes( { deezerUrl: value } );
	}

	const onFormSubmit = () => {
		if ( isValidDeezerUrl( attributes.deezerUrl ) ) {
			console.log( 'onFormSubmit' );
		}
	}

	setBlockClassName( blockProps );

	console.log('isEditing', isEditing, 'isValidDeezerUrl', !isValidDeezerUrl( attributes.deezerUrl ) );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Deezer Widget', 'deezer-widget-block' ) } initialOpen={ true }>
					<RadioControl
						label={ __( 'Mode', 'deezer-widget-block' ) }
						selected={ attributes.mode }
						options={ [
							{ label: __( 'Auto', 'deezer-widget-block' ), value: 'auto' },
							{ label: __( 'Dark', 'deezer-widget-block' ), value: 'dark' },
							{ label: __( 'Light', 'deezer-widget-block' ), value: 'light' },
						] }
						onChange={ ( mode ) => setAttributes( { mode } ) }
					/>
					<RadioControl
						label={ __( 'Show tracklist', 'deezer-widget-block' ) }
						selected={ attributes.showTracklist }
						options={ [
							{ label: __( 'Yes', 'deezer-widget-block' ), value: 'yes' },
							{ label: __( 'No', 'deezer-widget-block' ), value: 'no' },
						] }
						onChange={ ( showTracklist ) => setAttributes( { showTracklist } ) }
					/>
					<RangeControl
						label={ __( 'Width', 'deezer-widget-block' ) }
						value={ attributes.width }
						onChange={ ( width ) => setAttributes( { width } ) }
						min={ 210 }
						max={ 1000 }
						step={ 10 }
						allowReset={ true }
					/>
					<RangeControl
						label={ __( 'Height', 'deezer-widget-block' ) }
						value={ attributes.height }
						onChange={ ( height ) => setAttributes( { height } ) }
						min={ 150 }
						max={ 1000 }
						step={ 10 }
						allowReset={ true }
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				{ ( isEditing || !isValidDeezerUrl( attributes.deezerUrl ) ) ?
					<>
						<DeezerHorizontalLockup />
						<div className="wp-block-deezer-widget__form">
							<div className="wp-block-deezer-widget__form-row">
								<SelectControl
									label={ __( 'Filter', 'deezer-widget-block' ) }
									value={ connection }
									options={ [
										{ label: __( 'None', 'deezer-widget-block' ), value: '' },
										{ label: __( 'Album', 'deezer-widget-block' ), value: 'album' },
										{ label: __( 'Artist', 'deezer-widget-block' ), value: 'artist' },
										{ label: __( 'Playlist', 'deezer-widget-block' ), value: 'playlist' },
										{ label: __( 'Podcast', 'deezer-widget-block' ), value: 'podcast' },
										{ label: __( 'Radio', 'deezer-widget-block' ), value: 'radio' },
										{ label: __( 'Track', 'deezer-widget-block' ), value: 'track' },
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
														<button
															onClick={ () => setInputDeezerUrlValue( result.link ) }
														>{ result.title }</button>
														<button
															onClick={ () => setInputDeezerUrlValue( result.artist.link ) }
														>{ result.artist.name }</button>
														<button
															onClick={ () => setInputDeezerUrlValue( result.album.link ) }
														>{ result.album.title }</button>
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
								{ !isValidDeezerUrl( attributes.deezerUrl ) && (
									<p className="wp-block-deezer-widget__form-error">{ __( 'Invalid Deezer url', 'deezer-widget-block' ) }</p>
								) }
							</div>
							<div className="wp-block-deezer-widget__form-row">
								<button
									className="wp-block-deezer-widget__form-submit"
									onClick={ onFormSubmit }
								>{ __( 'Embed', 'deezer-widget-block' ) }</button>
							</div>
						</div>
					</>
					:
					<DeezerWidget { ...attributes } />
				}
			</div>
		</>
	);
}
