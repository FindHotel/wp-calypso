/** @format */

/**
 * External dependencies
 */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { get, noop } from 'lodash';
import Gridicon from 'gridicons';

/**
 * Internal dependencies
 */
import Button from 'components/button';
import TermFormDialog from 'blocks/term-form-dialog';
import QueryTaxonomies from 'components/data/query-taxonomies';
import { getSelectedSiteId } from 'state/ui/selectors';
import { getPostTypeTaxonomy } from 'state/post-types/taxonomies/selectors';
import { getTerms } from 'state/terms/selectors';

class TermSelectorAddTerm extends Component {
	static propTypes = {
		labels: PropTypes.object,
		onSuccess: PropTypes.func,
		taxonomy: PropTypes.string,
		terms: PropTypes.array,
		postType: PropTypes.string,
	};

	static defaultProps = {
		onSuccess: noop,
	};

	constructor( props ) {
		super( props );
		this.state = {
			showDialog: false,
		};
	}

	openDialog = event => {
		event.preventDefault();
		this.setState( { showDialog: true } );
	};

	closeDialog = () => {
		this.setState( { showDialog: false } );
	};

	render() {
		const { siteId, labels, onSuccess, postType, terms, taxonomy } = this.props;
		const totalTerms = terms ? terms.length : 0;
		const classes = classNames( 'term-tree-selector__add-term', {
			'is-compact': totalTerms < 8,
		} );

		return (
			<div className={ classes }>
				{ siteId && <QueryTaxonomies { ...{ siteId, postType } } /> }
				<Button borderless compact onClick={ this.openDialog }>
					<Gridicon icon="folder" /> { labels.add_new_item }
				</Button>
				<TermFormDialog
					showDialog={ this.state.showDialog }
					onClose={ this.closeDialog }
					postType={ postType }
					taxonomy={ taxonomy }
					onSuccess={ onSuccess }
				/>
			</div>
		);
	}
}

export default connect( ( state, { taxonomy, postType } ) => {
	const siteId = getSelectedSiteId( state );
	const taxonomyDetails = getPostTypeTaxonomy( state, siteId, postType, taxonomy );
	const labels = get( taxonomyDetails, 'labels', {} );

	return {
		siteId,
		terms: getTerms( state, siteId, taxonomy ),
		labels,
	};
} )( TermSelectorAddTerm );
