/**
 * CardTrack
 * @param {Object}   result       - The result object.
 * @param {Function} setDeezerUrl - The function to set the deezer url.
 * @return {Element} The CardTrack component.
 */

import { getAlbumUrl } from './utils';

export default function CardTrack({ result, setDeezerUrl }) {
	return (
		<div className="wp-block-deezer-widget__card wp-block-deezer-widget__card--track">
			<img src={result.album.cover_small} alt={result.album.title} />
			<div className="wp-block-deezer-widget__card-content">
				<button className="wp-block-deezer-widget__card-title" onClick={() => setDeezerUrl(result.link)}>
					{result.title}
				</button>
				<button className="wp-block-deezer-widget__card-artist" onClick={() => setDeezerUrl(result.artist.link)}>
					{result.artist.name}
				</button>
				<button className="wp-block-deezer-widget__card-album" onClick={() => setDeezerUrl(getAlbumUrl(result.album.id))}>
					{result.album.title}
				</button>
			</div>
		</div>
	);
}
