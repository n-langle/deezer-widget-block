/**
 * Set the block class name
 *
 * @param {Object} blockProps - The block properties.
 */
export const setBlockClassName = (blockProps) => {
	if (blockProps.className) {
		blockProps.className = blockProps.className.replace('wp-block-n-langle-deezer-widget-block', 'wp-block-deezer-widget');
	}
};

/**
 * Check if the url is a valid Deezer url
 *
 * @param {string} url - The url to check.
 * @return {boolean} True if the url is a valid Deezer url, false otherwise.
 */
export const isValidDeezerUrl = (url) => {
	// podcast url identifier is "show"
	const urlPattern = new RegExp('^https?://(www.)?deezer.com/([a-z]{2}/)?(album|artist|playlist|show|track)/([0-9]+)$');
	return urlPattern.test(url);
};

/**
 * Get the album url
 *
 * @param {string} id - The id of the album.
 * @return {string} The album url.
 */
export const getAlbumUrl = (id) => {
	return `https://www.deezer.com/album/${id}`;
};
