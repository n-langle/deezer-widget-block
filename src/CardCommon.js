/**
 * CardCommon
 * @param {Object}   result       - The result object.
 * @param {Function} setDeezerUrl - The function to set the deezer url.
 * @return {Element} The CardCommon component.
 */

export default function CardCommon({ result, setDeezerUrl }) {
	return (
		<div className="wp-block-nlangle-deezer-widget__card wp-block-nlangle-deezer-widget__card--common">
			<img src={result.picture_small} alt={result.title} />
			<div className="wp-block-nlangle-deezer-widget__card-content">
				<button className="wp-block-nlangle-deezer-widget__card-title" onClick={() => setDeezerUrl(result.link)}>
					{result.title}
				</button>
			</div>
		</div>
	);
}
