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
 * @module bbcode/converters/inlinenodeconverters/inlinenodeconverter
 */

import NodeConverter from '../nodeconverter';

/**
 * Base class for converting the CKEditor5 text model into BBCode representation.
 */
export default class InlineNodeConverter extends NodeConverter {
	/**
	 * Constructor.
	 *
	 * @param {string} modelName The model name of the most relevant attribute for this rule.
	 * @param {string} priority The priority of this rule (Possible values are: highest, high, normal, low, lowest).
	 * @param {Array<string>} attributeNames Array of required model attribute names.
	 */
	constructor( modelName, priority, attributeNames ) {
		super( modelName, priority );

		this._attributeNames = attributeNames;
	}

	/**
	 * Returns whether or not the attribute tree node has the rule's attribute(s).
	 *
	 * @param {module:bbcode/utils/attributetree/node~Node} node
	 *
	 * @return {boolean} True if the node has all attributes relevant for this conversion rules, false otherwise.
	 */
	hasAttribute( node ) {
		const attributes = node.nodeAttributes;

		for ( const attributeName of this._attributeNames ) {
			if ( !attributes.has( attributeName ) ) {
				return false;
			}
		}

		return true;
	}

	/**
	 * Returns the attribute(s) from the node, which are relevant to this rule.
	 *
	 * @param {module:bbcode/utils/attributetree/node~Node} node
	 *
	 * @return {Map<string, any>} The attribute(s) relevant to this conversion rule.
	 */
	getAttributes( node ) {
		const attributeMap = new Map();
		const attributes = node.nodeAttributes;

		for ( const attributeName of this._attributeNames ) {
			const attributeValue = attributes.get( attributeName );
			attributeMap.set( attributeName, attributeValue );
		}

		return attributeMap;
	}

	/**
	 * Compares two sets of attributes.
	 *
	 * @param {Map<string, any>} attributes			The set of active attributes.
	 * @param {Map<string, any>} currentAttributes	The set of attributes present on the node.
	 *
	 * @return {boolean} Whether the to set of attributes are the same.
	 */
	compareAttributes( attributes, currentAttributes ) {
		for ( const key of attributes.keys() ) {
			if ( !currentAttributes.has( key ) ) {
				return false;
			}

			if ( attributes.get( key ) !== currentAttributes.get( key ) ) {
				return false;
			}
		}

		return true;
	}
}
