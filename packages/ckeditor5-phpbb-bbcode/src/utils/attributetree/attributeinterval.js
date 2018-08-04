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
 * @module bbcode/utils/attributetree/attributeinterval
 */

/**
 * Class for representing continuous intervals of the same text attributes.
 */
export default class AttributeInterval {
	/**
	 * Constructor.
	 *
	 * @param {number}				start		Start offset.
	 * @param {number}				end			End offset.
	 * @param {Map<string, any>}	attributes	Map of attributes.
	 */
	constructor( start, end, attributes ) {
		this._start = start;
		this._end = end;
		this._attributes = new Map( attributes );
	}

	/**
	 * Returns the start offset of the interval.
	 *
	 * @return {number} The start offset.
	 */
	get start() {
		return this._start;
	}

	/**
	 * Returns the end offset of the interval.
	 *
	 * @return {number} The end offset.
	 */
	get end() {
		return this._end;
	}

	/**
	 * Returns the attribute map belonging to the interval.
	 *
	 * @return {Map<string, any>} The attribute map.
	 */
	get attributes() {
		return this._attributes;
	}

	/**
	 * Sets the end offset of the interval.
	 *
	 * @param {number} endOffset The end offset.
	 */
	setEndOffset( endOffset ) {
		this._end = endOffset;
	}
}
