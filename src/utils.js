export const setBlockClassName = ( blockProps ) => {
	if ( blockProps.className ) {
		blockProps.className = blockProps.className.replace( 'wp-block-n-langle-deezer-widget-block', 'wp-block-deezer-widget' );
	}
};
