$( document ).ready( function() {

	function createLiExp (item) {
		// Creates expandable li tag with proper text.
		let liExp = '<li><div class="node-body"><button class="expand">-</button>' + item.name + '</div>' + '<ul></ul>' + '</li>';

		return liExp;
	}

	function getLeaves (arr) {
		// Serches for the leaves in parsed JSON.
		let parents = [];
		let leaves = [];

		arr.forEach( (item) => {

			if( !parents.includes(item.parent_id) ) {
				parents.push( item.parent_id );
			}
		} );

		arr.forEach( (item) => {

			if( !parents.includes(item.id) ) {
				leaves.push( item );
			}

		} );

		return leaves;
	}

	const url = 'http://test1.web-gu.ru/';

	// Get JSON from URL.
	let jqxhr = $.getJSON( url )
		.done( ( data ) => {
			let shopData = data;

			let leavesObj = getLeaves(shopData);

			// Render the tree.
			let treeBody = $('<ul>').appendTo( 'body' );

			// Search for the root elements and render them.
			for( let i = 0; i < shopData.length; i++ ) {

				if ( shopData[i].parent_id < 0) {
					let liExp = $( createLiExp(shopData[i]) );
					liExp.attr( 'id', shopData[i].id );
					treeBody.append( liExp );

					shopData.splice( i, 1 );
				}
			}

			// Search for remaining nodes and render them.
			while ( shopData.length ) {

				for( let i = 0; i < shopData.length; i++ ) {

					if ( $( '#' + shopData[i].parent_id ).length ) {
						let liExp = $( createLiExp(shopData[i]) );
						liExp.attr( 'id', shopData[i].id );
						$( '#' + shopData[i].parent_id + '>' + 'ul' ).append( liExp );

						shopData.splice( i, 1 );
					}
				}
			}

			// Fix the DOM.
			leavesObj.forEach( (item) => {
				$( '#'+ item.id ).addClass( 'leaf' );
				$( '#' + item.id + ' > div > button').remove();
			} );
			$( 'ul' ).remove( 'ul:empty' );

			// Add handlers to buttons.
			$( '.node-body' ).on( 'click', function() {
				$(this).siblings(":last").toggle( 400 );
			} )

		} )
		.fail ( function () {
			alert( "Не удалось загрузить данные! Попробуйте обновить страницу." );
		} );

} );