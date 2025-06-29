/**
 * CardArtist
 * @param {Object}   result       - The result object.
 * @param {Function} setDeezerUrl - The function to set the deezer url.
 * @return {Element} The CardArtist component.
 */

export default function CardArtist({ result, setDeezerUrl }) {
	return (
		<div className="wp-block-nlangle-deezer-widget__card wp-block-nlangle-deezer-widget__card--artist">
			<img src={result.picture_small} alt={result.name} />
			<div className="wp-block-nlangle-deezer-widget__card-content">
				<button className="wp-block-nlangle-deezer-widget__card-title" onClick={() => setDeezerUrl(result.link)}>
					{result.name}
				</button>
			</div>
		</div>
	);
}
