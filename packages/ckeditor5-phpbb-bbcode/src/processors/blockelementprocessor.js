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
 * @module bbcode/processors/blockelementprocessor
 */

import ElementProcessor from './elementprocessor';
import ModelRange from '@ckeditor/ckeditor5-engine/src/model/range';
import ViewRange from '@ckeditor/ckeditor5-engine/src/view/range';
import ConversionResult from '../converters/conversionresult';
import StaticModelNodeConverter from '../converters/blocknodeconverters/staticmodelnodeconverter';
import StaticViewNodeConverter from '../converters/blocknodeconverters/staticviewnodeconverter';

/**
 * Block element processor.
 *
 * The block element processor is responsible for dispatching non text nodes from the
 * CKEditor5 models to the BlockNodeProcessors.
 */
export default class BlockElementProcessor extends ElementProcessor {
	/**
	 * Constructor.
	 */
	constructor() {
		const defaultRules = [
			[
				'paragraph',
				new StaticModelNodeConverter( 'paragraph', '', '\n\n' )
			],
			[
				'softBreak',
				new StaticModelNodeConverter( 'softBreak', '', '\n' )
			],
			[
				'ul',
				new StaticViewNodeConverter( 'ul', '[list]', '[/list]' )
			],
			[
				'ol',
				new StaticViewNodeConverter( 'ol', '[list=1]', '[/list]' )
			],
			[
				'li',
				new StaticViewNodeConverter( 'li', '[*]', '\n' )
			]
		];

		super( defaultRules );
	}

	/**
	 * Converts block elements to BBCode.
	 *
	 * @param {module:engine/model/position~Position} modelPosition Model position.
	 * @param {module:engine/view/position~Position} viewPosition View position.
	 *
	 * @return {ConversionResult}
	 */
	process( modelPosition, viewPosition ) {
		const modelNode = modelPosition.nodeAfter;
		const modelName = modelNode.name;
		const viewNode = viewPosition.nodeAfter;
		const viewName = viewNode.name;

		const processor = this.getProcessor( modelName, viewName );
		if ( processor === null ) {
			return this._skipNode( modelPosition, viewPosition );
		}

		return processor.process( modelPosition, viewPosition, this.converter );
	}

	/**
	 * Skips a node.
	 *
	 * This method is called when no NodeProcessors are attached to the model element.
	 *
	 * @param {module:engine/model/position~Position} modelPosition Model position.
	 * @param {module:engine/view/position~Position} viewPosition View position.
	 *
	 * @return {ConversionResult}
	 */
	_skipNode( modelPosition, viewPosition ) {
		const modelNode = modelPosition.nodeAfter;
		const viewNode = viewPosition.nodeAfter;
		const modelRange = ModelRange.createOn( modelNode );
		const viewRange = ViewRange.createOn( viewNode );

		let modelEnd = modelRange.end;
		let viewEnd = viewRange.end;

		const viewModelEnd = this.converter.mapper.toModelPosition( viewEnd );

		if ( viewModelEnd.isBefore( modelEnd ) ) {
			viewEnd = this.converter.mapper.toViewPosition( modelEnd );
		}

		if ( modelEnd.isBefore( viewModelEnd ) ) {
			modelEnd = viewModelEnd;
		}

		return new ConversionResult(
			'',
			modelEnd,
			viewEnd
		);
	}
}
