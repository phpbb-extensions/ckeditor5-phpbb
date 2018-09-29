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
 * @module bbcode/converters/blocknodeconverters/staticviewnodeconverter
 */

import ConversionResult from '../conversionresult';
import NodeConverter from '../nodeconverter';
import ViewRange from '@ckeditor/ckeditor5-engine/src/view/range';

/**
 * Static view to BBCode converter for block elements.
 */
export default class StaticViewNodeConverter extends NodeConverter {
	/**
	 * Constructor.
	 *
	 * @param {String} viewName		Name of the model node.
	 * @param {String} openingTag	Opening tag.
	 * @param {String} closingTag	Closing tag.
	 * @param {String} priority		Priority string.
	 */
	constructor( viewName, openingTag, closingTag, priority = 'low' ) {
		super( viewName, priority, 'view' );

		/**
		 * The opening BBCode tag.
		 *
		 * @type {String}
		 * @private
		 */
		this._openingTag = openingTag;

		/**
		 * The closing BBCode tag.
		 *
		 * @type {String}
		 * @private
		 */
		this._closingTag = closingTag;
	}

	/**
	 * @inheritDoc
	 */
	process( modelPosition, viewPosition, converter ) {
		const viewNode = viewPosition.nodeAfter;
		const innerViewRange = ViewRange.createIn( viewNode );
		const innerModelRange = converter.mapper.toModelRange( innerViewRange );
		const outerViewRange = ViewRange.createOn( viewNode );
		const outerModelRange = converter.mapper.toModelRange( outerViewRange );

		const content = converter.processChildren(
			innerModelRange,
			innerViewRange
		);

		return new ConversionResult(
			this._openingTag + content.text + this._closingTag,
			outerModelRange.end,
			outerViewRange.end
		);
	}
}
