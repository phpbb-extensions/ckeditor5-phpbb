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
	 * @param {String} name The CKEditor5 model or view node name.
	 * @param {String} priority Priority string.
	 * @param {String} nameSource 'view' or 'model' to define which name to use during the conversion (defaults to 'model').
	 */
	constructor( name, priority, nameSource = 'model' ) {
		/**
		 * Model name.
		 *
		 * @type {String}
		 * @private
		 */
		this._name = name;

		/**
		 * Priority string.
		 *
		 * @type {String}
		 * @private
		 */
		this._priority = priority;

		/**
		 * Conversion name source.
		 *
		 * @type {String}
		 * @private
		 */
		this._type = nameSource;
	}

	/**
	 * Returns the name of node in the CKEditor5 model.
	 *
	 * @return The model name.
	 */
	get name() {
		return this._name;
	}

	/**
	 * Returns the priority string of the node processor.
	 *
	 * @return The priority string of the node processor.
	 */
	get priority() {
		return this._priority;
	}

	/**
	 * Returns whether to use the model or the view name during the conversion for the specific node.
	 *
	 * @return {String}
	 */
	get nameType() {
		return this._type;
	}
}
