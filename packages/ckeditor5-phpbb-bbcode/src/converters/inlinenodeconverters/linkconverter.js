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
 * @module bbcode/converters/inlinenodeconverters/linkconverter
 */

import InlineNodeConverter from './inlinenodeconverter';

/**
 * Inlinenodeconverter for links.
 */
export default class LinkConverter extends InlineNodeConverter {
	/**
	 * Constructor.
	 *
	 * @param {String} modelName The name of the model attribute to match this converter with.
	 */
	constructor( modelName ) {
		super( modelName, 'highest', [ modelName ] );

		/**
		 * The closing tag.
		 *
		 * @type {String}
		 * @private
		 */
		this._closingTag = '[/url]';
	}

	/**
	 * @inheritDoc
	 */
	openingTag( attributes ) {
		const href = attributes.get( 'linkHref' );
		return '[url=' + href + ']';
	}

	/**
	 * @inheritDoc
	 */
	closingTag() {
		return this._closingTag;
	}
}
