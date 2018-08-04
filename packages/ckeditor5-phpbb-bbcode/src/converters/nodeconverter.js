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
 * @module bbcode/converters/nodeconverter
 */

/**
 * Base class for all node converters.
 */
export default class NodeConverter {
	/**
	 * Constructor.
	 *
	 * @param {String} modelName The CKEditor5 model node name.
	 * @param {String} priority Priority string.
	 */
	constructor( modelName, priority ) {
		/**
		 * Model name.
		 *
		 * @type {String}
		 * @private
		 */
		this._modelName = modelName;

		/**
		 * Priority string.
		 *
		 * @type {String}
		 * @private
		 */
		this._priority = priority;
	}

	/**
	 * Returns the name of node in the CKEditor5 model.
	 *
	 * @return The model name.
	 */
	get name() {
		return this._modelName;
	}

	/**
	 * Returns the priority string of the node processor.
	 *
	 * @return The priority string of the node processor.
	 */
	get priority() {
		return this._priority;
	}
}
