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
 * @module bbcode/converters/inlinenodeconverters/staticnodeconverter
 */

import InlineNodeConverter from './inlinenodeconverter';

/**
 * This class converts text attributes to BBCode tags.
 *
 * The opening and closing tags must be string constants.
 */
export default class StaticNodeConverter extends InlineNodeConverter {
	/**
	 * Constructor.
	 *
	 * @param {string} modelName The name of the model attribute to match this converter with.
	 * @param {string} openingTag The opening BBCode tag.
	 * @param {string} closingTag The closing BBCode tag.
	 * @param {string} priority Priority string (defaults to 'low').
	 * @param {Array<string>} attributes Array of all required model attributes.
	 */
	constructor( modelName, openingTag, closingTag, priority = 'low', attributes = [] ) {
		const attributeArray = ( attributes.length ) ? attributes : [ modelName ];
		super( modelName, priority, attributeArray );

		/**
		 * The opening tag.
		 *
		 * @type {String}
		 * @private
		 */
		this._openingTag = openingTag;

		/**
		 * The closing tag.
		 *
		 * @type {String}
		 * @private
		 */
		this._closingTag = closingTag;
	}

	/**
	 * @inheritDoc
	 */
	openingTag() {
		return this._openingTag;
	}

	/**
	 * @inheritDoc
	 */
	closingTag() {
		return this._closingTag;
	}
}
