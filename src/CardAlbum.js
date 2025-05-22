/**
 * CardAlbum
 * @param {Object}   result       - The result object.
 * @param {Function} setDeezerUrl - The function to set the deezer url.
 * @return {Element} The CardAlbum component.
 */

export default function CardAlbum({ result, setDeezerUrl }) {
	return (
		<div className="wp-block-deezer-widget__card wp-block-deezer-widget__card--album">
			<img src={result.cover_small} alt={result.title} />
			<div className="wp-block-deezer-widget__card-content">
				<button className="wp-block-deezer-widget__card-title" onClick={() => setDeezerUrl(result.link)}>
					{result.title}
				</button>
				<button className="wp-block-deezer-widget__card-artist" onClick={() => setDeezerUrl(result.artist.link)}>
					{result.artist.name}
				</button>
			</div>
		</div>
	);
}
