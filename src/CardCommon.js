export default function CardCommon({ result, setDeezerUrl }) {
	return (
		<div className="wp-block-deezer-widget__card wp-block-deezer-widget__card--common">
			<img 
				src={ result.picture_small }
				alt={ result.title }
			/>
			<div className="wp-block-deezer-widget__card-content">
				<button className="wp-block-deezer-widget__card-title" onClick={ () => setDeezerUrl( result.link ) }>{ result.title }</button>
			</div>
		</div>
	);
}