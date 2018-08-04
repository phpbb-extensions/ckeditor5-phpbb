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
 * @module bbcode/converters/bbcodedataprocessor
 */

import HtmlDataProcessor from '@ckeditor/ckeditor5-engine/src/dataprocessor/htmldataprocessor';
import Converter from './converters/converter';

/**
 * Data processor for converting CKEditor5 data to bbcode.
 *
 * @implements module:engine/dataprocessor/dataprocessor~DataProcessor
 */
export default class BBCodeDataProcessor {
	/**
	 * Constructor.
	 *
	 * @param {module:engine/controller/datacontroller~DataController} data DataController of CKEditor5.
	 */
	constructor( data ) {
		/**
		 * HTML DataProcessor object.
		 *
		 * @type {HtmlDataProcessor}
		 * @private
		 */
		this._htmlDP = new HtmlDataProcessor();

		/**
		 * BBCodeDataProcessor object.
		 *
		 * @type {BBCodeDataProcessor}
		 * @private
		 */
		this._bbcodeDP = new Converter();
		this._bbcodeDP.init();

		/**
		 * DataController object.
		 *
		 * @type {module:engine/controller/datacontroller~DataController}
		 * @private
		 */
		this._data = data;
	}

	/**
	 * Converts provided HTML string to view tree.
	 *
	 * @param {String} data HTML string.
	 *
	 * @returns {module:engine/view/node~Node|module:engine/view/documentfragment~DocumentFragment|null} Converted view element.
	 */
	toView( data ) {
		return this._htmlDP.toView( data );
	}

	/**
	 * Converts provided view document to BBCode.
	 *
	 * @param {module:engine/view/documentfragment~DocumentFragment} view View document fragment from the editor.
	 *
	 * @returns {String} BBCode string.
	 */
	toData( view ) {
		const modelDocumentFragment = this._data.toModel( view );
		const viewDocumentFragment = this._data.toView( modelDocumentFragment );
		this._bbcodeDP.setMapper( this._data.mapper );
		return this._bbcodeDP.convert( modelDocumentFragment, viewDocumentFragment );
	}
}
