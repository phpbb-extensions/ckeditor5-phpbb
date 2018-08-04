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
 * @module bbcode/converters/blocknodeconverters/staticmodelnodeconverter
 */

import ModelRange from '@ckeditor/ckeditor5-engine/src/model/range';
import ViewRange from '@ckeditor/ckeditor5-engine/src/view/range';
import ConversionResult from '../conversionresult';
import NodeConverter from '../nodeconverter';

/**
 * Model block node converter with static outputs.
 */
export default class StaticModelNodeConverter extends NodeConverter {
	/**
	 * Constructor.
	 *
	 * @param {String} modelName	Name of the model node.
	 * @param {String} openingTag	Opening tag.
	 * @param {String} closingTag	Closing tag.
	 * @param {String} priority		Priority string.
	 */
	constructor( modelName, openingTag, closingTag, priority = 'low' ) {
		super( modelName, priority );

		this._openingTag = openingTag;
		this._closingTag = closingTag;
	}

	/**
	 * @inheritDoc
	 */
	process( modelPosition, viewPosition, converter ) {
		const modelNode = modelPosition.nodeAfter;
		const viewNode = viewPosition.nodeAfter;

		const content = converter.processChildren(
			ModelRange.createIn( modelNode ),
			ViewRange.createIn( viewNode )
		);

		return new ConversionResult(
			this._openingTag + content.text + this._closingTag,
			ModelRange.createOn( modelNode ).end,
			ViewRange.createOn( viewNode ).end
		);
	}
}
