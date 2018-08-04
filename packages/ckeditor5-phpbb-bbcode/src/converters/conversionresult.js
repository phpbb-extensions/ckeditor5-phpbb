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
 * @module bbcode/converters/conversionresult
 */

/**
 * Object wrapping the conversion result.
 *
 * It must contain the processed nodes' BBCode representation and the positions for the next node to be processed
 * both in the view and model. These positions must point before the next node.
 */
export default class ConversionResult {
	/**
	 * Constructor.
	 *
	 * @param {String} text The output text.
	 * @param {module:engine/model/position~Position} modelPosition The next element's position in the model.
	 * @param {module:engine/view/position~Position} viewPosition The next element's position in the view.
	 */
	constructor( text, modelPosition, viewPosition ) {
		/**
		 * The output text.
		 *
		 * @type {String}
		 * @private
		 */
		this._text = text;

		/**
		 * The next element's position in the model.
		 *
		 * @type {module:engine/model/position~Position}
		 * @private
		 */
		this._modelPosition = modelPosition;

		/**
		 * The next element's position in the view.
		 *
		 * @type {module:engine/view/position~Position}
		 * @private
		 */
		this._viewPosition = viewPosition;
	}

	/**
	 * The output text.
	 *
	 * @return {String}
	 */
	get text() {
		return this._text;
	}

	/**
	 * The next element's position in the model to be processed.
	 *
	 * @return {module:engine/model/position~Position}
	 */
	get modelPosition() {
		return this._modelPosition;
	}

	/**
	 * The next element's position in the view to be processed.
	 *
	 * @return {module:engine/view/position~Position}
	 */
	get viewPosition() {
		return this._viewPosition;
	}
}
