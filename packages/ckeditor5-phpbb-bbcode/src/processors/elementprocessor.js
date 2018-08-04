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
 * @module bbcode/processors/elementprocessor
 */

/**
 * Element processor base class.
 *
 * This class is responsible for handling the data processors that can be attached to the BBCode
 * converting framework.
 */
export default class ElementProcessor {
	/**
	 * Constructor.
	 *
	 * @param {Array<NodeConverter>} processors The element processors.
	 */
	constructor( processors ) {
		/**
		 * Map of model name and model processor object pairs.
		 *
		 * @type {Map<string, NodeConverter>}
		 * @private
		 */
		this._processors = new Map( processors );

		/**
		 * The converter object.
		 *
		 * @type {Converter}
		 * @private
		 */
		this._converter = null;

		/**
		 * Attributes by priority.
		 *
		 * @type {Map<string, Array<NodeConverter>>}
		 * @private
		 */
		this._priorities = new Map(
			[
				[ 'highest', [] ],
				[ 'high', [] ],
				[ 'normal', [] ],
				[ 'low', [] ],
				[ 'lowest', [] ]
			]
		);

		// Add processors to the priority list.
		for ( const processor of this._processors.values() ) {
			const priorityArray = this._priorities.get( processor.priority );
			priorityArray.push( processor );
		}
	}

	/**
	 * Returns the converter object.
	 *
	 * @return {Converter}
	 */
	get converter() {
		return this._converter;
	}

	/**
	 * Returns the priorities map.
	 *
	 * @return {Map<string, Array<NodeConverter>>}
	 */
	get attributePriorities() {
		return this._priorities;
	}

	/**
	 * Registers a new converter.
	 *
	 * @param {string} name Name of the model element that the processor processes.
	 * @param {NodeConverter} processor The NodeConverter object.
	 */
	register( name, processor ) {
		this._processors.set( name, processor );
		this._priorities.get( processor.priority ).push( processor.name );
	}

	/**
	 * Returns the processor for the model node.
	 *
	 * @param name The name of the model node.
	 *
	 * @return {NodeConverter|null} The corresponding NodeConverter or null if it is not exist.
	 */
	getProcessor( name ) {
		if ( this._processors.has( name ) ) {
			return this._processors.get( name );
		}

		return null;
	}

	/**
	 * Set the converter object.
	 *
	 * @param {Converter} converter The converter.
	 */
	setConverter( converter ) {
		this._converter = converter;
	}
}
