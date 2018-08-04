/**
 *
 * This file is part of the phpBB BBCode data processor package.
 *
 * @copyright (c) phpBB Limited <https://www.phpbb.com>
 * @license GNU General Public License, version 2 (GPL-2.0)
 *
 * For full copyright and license information, please see
 * the LICENSE file.
 *
 */

'use strict';

/**
 * @module bbcode/processors/inlineelementprocessor
 */

import ElementProcessor from './elementprocessor';
import StaticNodeConverter from '../converters/inlinenodeconverters/staticnodeconverter';
import ConversionResult from '../converters/conversionresult';
import ModelPosition from '@ckeditor/ckeditor5-engine/src/model/position';
import ViewPosition from '@ckeditor/ckeditor5-engine/src/view/position';
import TreeBuilder from '../utils/attributetree/treebuilder';
import LinkConverter from '../converters/inlinenodeconverters/linkconverter';
import TreeMerger from '../utils/attributetree/treemerger';

/**
 * Processor class for inline elements (text nodes).
 *
 * This can be extended by registering NodeConverters on the DataProcessor.
 */
export default class InlineElementProcessor extends ElementProcessor {
	/**
	 * Constructor.
	 */
	constructor() {
		const defaultRules = [
			[
				'bold',
				new StaticNodeConverter( 'bold', '[b]', '[/b]' )
			],
			[
				'underline',
				new StaticNodeConverter( 'underline', '[u]', '[/u]' )
			],
			[
				'italic',
				new StaticNodeConverter( 'italic', '[i]', '[/i]' )
			],
			[
				'linkHref',
				new LinkConverter( 'linkHref' )
			]
		];

		super( defaultRules );
	}

	/**
	 * Converts all consecutive text nodes to BBCode.
	 *
	 * @param {ModelPosition} modelPosition The model position before the first text node to convert.
	 *
	 * @return {ConversionResult} The conversion result.
	 */
	process( modelPosition ) {
		// Build an attribute tree.
		const treeBuilder = new TreeBuilder();

		// Variables for iterating over all consecutive text nodes.
		let endModelPosition, modelNode;
		modelNode = modelPosition.nodeAfter;
		while ( modelNode !== null && modelNode.is( 'text' ) ) {
			// Add a new leaf to the tree.
			treeBuilder.addLeaf(
				modelNode.startOffset,
				modelNode.endOffset,
				modelNode.getAttributes(),
				modelNode.data
			);

			// Iterate to the next node.
			endModelPosition = ModelPosition.createAfter( modelNode );
			modelNode = endModelPosition.nodeAfter;
		}

		let tree = treeBuilder.getTree();
		const treeMerger = new TreeMerger( this.attributePriorities );
		tree = treeMerger.merge( tree );

		// Calculate the last view position.
		const lastModelPosition = ModelPosition.createBefore( endModelPosition.nodeBefore );
		const lastViewPosition = this.converter.mapper.toViewPosition( lastModelPosition );
		const lastViewElement = lastViewPosition.parent;
		const endViewPosition = ViewPosition.createAfter( lastViewElement );

		// Generate text.
		const text = this._treeToString( tree );

		return new ConversionResult( text, endModelPosition, endViewPosition );
	}

	/**
	 * Convert the attribute tree to BBCode.
	 *
	 * @param {Node} tree The attribute tree.
	 *
	 * @return {string} BBCode string.
	 *
	 * @private
	 */
	_treeToString( tree ) {
		let text = ( tree.text === null ) ? '' : tree.text;

		const attributes = tree.nodeAttributes;
		let openingTags = '';
		let closingTags = '';
		for ( const attributeKey of attributes.keys() ) {
			const processor = this.getProcessor( attributeKey );
			if ( processor === null ) {
				continue;
			}

			openingTags += processor.openingTag( attributes );
			closingTags = processor.closingTag( attributes ) + closingTags;
		}

		for ( const child of tree.children ) {
			text += this._treeToString( child );
		}

		return openingTags + text + closingTags;
	}
}
