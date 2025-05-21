/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { BlockControls, InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { __experimentalInputControl as InputControl, PanelBody, RadioControl, RangeControl, SelectControl, ToolbarGroup } from '@wordpress/components';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import './editor.scss';
import { isValidDeezerUrl, setBlockClassName } from './utils';
import { DeezerHorizontalLockup } from './Icons';
import DeezerWidget from './DeezerWidget';
import CardArtist from './CardArtist';
import CardAlbum from './CardAlbum';
import CardCommon from './CardCommon';
import CardTrack from './CardTrack';

/**
 * cards
 */
const cards = {
	artist: CardArtist,
	album: CardAlbum,
	common: CardCommon,
	track: CardTrack,
};

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
	const [ isEditing, setIsEditing ] = useState( !isValidDeezerUrl( attributes.deezerUrl ) );

	const getCard = ( result ) => {
		const Card = cards[ result.type ] || cards.common;
		return <Card result={ result } setDeezerUrl={ setDeezerUrl } />;
	}

	const onInputSearchChange = ( value ) => {
		const url = new URL( deezerWidgetBlockData.restSearchUrl );

		url.searchParams.set( 'query', value );
		url.searchParams.set( 'connection', connection );
		url.searchParams.set( 'rest_key', deezerWidgetBlockData.restKey );

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
		setAttributes( { deezerUrl: value } );
	}

	const setDeezerUrl = ( value ) => {
		setSearchResults( [] );
		setIsEditing( false );
		setAttributes( { deezerUrl: value } );
	}

	const onFormSubmit = () => {
		if ( isValidDeezerUrl( attributes.deezerUrl ) ) {
			setIsEditing( false );
		}
	}

	setBlockClassName( blockProps );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Deezer Widget', 'deezer-widget-block' ) } initialOpen={ true }>
					<RadioControl
						label={ __( 'Theme', 'deezer-widget-block' ) }
						selected={ attributes.theme }
						options={ [
							{ label: __( 'Auto', 'deezer-widget-block' ), value: 'auto' },
							{ label: __( 'Dark', 'deezer-widget-block' ), value: 'dark' },
							{ label: __( 'Light', 'deezer-widget-block' ), value: 'light' },
						] }
						onChange={ ( theme ) => setAttributes( { theme } ) }
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
			{ !isEditing &&
				<BlockControls key="toolbar">
					<ToolbarGroup
						controls={[
							{
								icon: 'edit',
								title: __( 'Edit', 'deezer-widget-block'),
								onClick: () => setIsEditing( true ),
							},
						]}
					/>
				</BlockControls>
			}
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
										{ label: __( 'Default', 'deezer-widget-block' ), value: '' },
										{ label: __( 'Album', 'deezer-widget-block' ), value: 'album' },
										{ label: __( 'Artist', 'deezer-widget-block' ), value: 'artist' },
										{ label: __( 'Playlist', 'deezer-widget-block' ), value: 'playlist' },
										{ label: __( 'Podcast', 'deezer-widget-block' ), value: 'podcast' },
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
													{ getCard( result ) }
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
								{ attributes.deezerUrl && !isValidDeezerUrl( attributes.deezerUrl ) ?
									<p className="wp-block-deezer-widget__form-instruction">{ __( 'Invalid Deezer url', 'deezer-widget-block' ) }</p>
									:
									<p className="wp-block-deezer-widget__form-instruction">{ __( 'Supported contents: Album, Playlist, Track, Artist, Podcast, Episode', 'deezer-widget-block' ) }</p>
								}
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
