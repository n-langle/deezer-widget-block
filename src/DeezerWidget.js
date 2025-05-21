/**
 * Deezer Widget
 *
 * @param {Object} attributes - The block attributes.
 * @return {Element} The Deezer widget.
 */
export default function DeezerWidget( { deezerUrl, theme, height, showTracklist } ) {
	const url = new URL( deezerUrl );
	const path = url.pathname.split( '/' );
	const type = path[ path.length - 2 ];
	const id = path[ path.length - 1 ];
	let embedUrl = `https://widget.deezer.com/widget/${ theme }/${ type }/${ id }`;

	if ( type === 'artist' ) {
		embedUrl = embedUrl + '/top_tracks';
	}

	if ( showTracklist === 'no' ) {
		embedUrl = embedUrl + '?tracklist=false';
	}

	return (
		<iframe
			title="deezer-widget"
			src={ embedUrl }
			height={ height || '300px' }
			allowtransparency="true"
			allow="encrypted-media; clipboard-write"
		></iframe>
	);
}
