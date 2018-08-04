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
 * @module bbcode/converters/converter
 */

import InlineElementProcessor from '../processors/inlineelementprocessor';
import BlockElementProcessor from '../processors/blockelementprocessor';
import ModelRange from '@ckeditor/ckeditor5-engine/src/model/range';
import ViewRange from '@ckeditor/ckeditor5-engine/src/view/range';
import ConversionResult from './conversionresult';

/**
 * Converter class.
 *
 * Converts CKEditor5 model data to BBCode.
 */
export default class Converter {
	/**
	 * Constructor.
	 */
	constructor() {
		/**
		 * Inline element processor.
		 *
		 * @type {InlineElementProcessor}
		 * @private
		 */
		this._inlineElementProcessor = new InlineElementProcessor();

		/**
		 * Block element processor.
		 *
		 * @type {BlockElementProcessor}
		 * @private
		 */
		this._blockElementProcessor = new BlockElementProcessor();

		/**
		 * Data model mapper.
		 *
		 * @type {module:engine/conversion/mapper~Mapper|null}
		 * @private
		 */
		this._mapper = null;
	}

	/**
	 * Returns the inline element processor.
	 *
	 * @return {InlineElementProcessor}
	 */
	get inlineElementProcessor() {
		return this._inlineElementProcessor;
	}

	/**
	 * Returns the block element processor.
	 *
	 * @return {BlockElementProcessor}
	 */
	get blockElementProcessor() {
		return this._blockElementProcessor;
	}

	/**
	 * Data model mapper.
	 *
	 * @return {module:engine/conversion/mapper~Mapper}
	 */
	get mapper() {
		return this._mapper;
	}

	/**
	 * Sets the data model mapper.
	 *
	 * @param {module:engine/conversion/mapper~Mapper} mapper Data model mapper.
	 */
	setMapper( mapper ) {
		this._mapper = mapper;
	}

	/**
	 * Initializes the Converter object.
	 */
	init() {
		this._blockElementProcessor.setConverter( this );
		this._inlineElementProcessor.setConverter( this );
	}

	/**
	 * Converts CKEditor5's model to BBCode.
	 *
	 * @param {module:engine/model/documentfragment~DocumentFragment} modelDocument CKEditor5's model document fragment.
	 * @param {module:engine/view/documentfragment~DocumentFragment} viewDocument CKEditor5's view document fragment.
	 *
	 * @returns {String} The BBCode string.
	 */
	convert( modelDocument, viewDocument ) {
		if ( modelDocument.isEmpty || viewDocument.isEmpty ) {
			return '';
		}

		if ( !modelDocument.is( 'documentFragment' ) || !viewDocument.is( 'documentFragment' ) ) {
			return '';
		}

		const result = this._convertDocumentFragment( modelDocument, viewDocument );

		return result.trim();
	}

	/**
	 * Converts a document fragment to BBCode.
	 *
	 * @param {module:engine/model/documentfragment~DocumentFragment} modelDocument CKEditor5's model document fragment.
	 * @param {module:engine/view/documentfragment~DocumentFragment} viewDocument CKEditor5's view document fragment.
	 *
	 * @return {String}
	 *
	 * @private
	 */
	_convertDocumentFragment( modelDocument, viewDocument ) {
		const modelRange = ModelRange.createIn( modelDocument );
		const viewRange = ViewRange.createIn( viewDocument );
		const result = this.processChildren( modelRange, viewRange );

		return result.text;
	}

	/**
	 * Processes the children of elements.
	 *
	 * @param {module:engine/model/range~Range} modelRange
	 * @param {module:engine/view/range~Range} viewRange
	 *
	 * @return {ConversionResult} The result from processing the children of the node.
	 *
	 * @private
	 */
	processChildren( modelRange, viewRange ) {
		const modelEnd = modelRange.end;
		const viewEnd = viewRange.end;

		let modelPosition = modelRange.start;
		let viewPosition = viewRange.start;

		let output = '';

		while ( modelPosition.isBefore( modelEnd ) && viewPosition.isBefore( viewEnd ) ) {
			const modelNode = modelPosition.nodeAfter;
			let result;

			if ( modelNode === null ) {
				break;
			} else {
				result = this.processNode( modelPosition, viewPosition );
			}

			output += result.text;
			modelPosition = result.modelPosition;
			viewPosition = result.viewPosition;
		}

		return new ConversionResult( output, modelEnd, viewEnd );
	}

	/**
	 * Converts one or more nodes to the text output.
	 *
	 * @param {module:engine/model/position~Position} modelPosition
	 * @param {module:engine/view/position~Position} viewPosition
	 *
	 * @return {ConversionResult} The result of the conversion.
	 *
	 * @private
	 */
	processNode( modelPosition, viewPosition ) {
		const modelNode = modelPosition.nodeAfter;
		let result;

		if ( modelNode.is( 'text' ) ) {
			result = this._inlineElementProcessor.process( modelPosition );
		} else {
			result = this._blockElementProcessor.process( modelPosition, viewPosition );
		}

		return result;
	}
}
