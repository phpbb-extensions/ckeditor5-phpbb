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
 * @module bbcode/utils/attributetree/treebuilder
 */
import Node from './node.js';

/**
 * Attribute tree builder.
 */
export default class TreeBuilder {
	/**
	 * Tree builder constructor.
	 */
	constructor() {
		/**
		 * The ID of the next node to be inserted.
		 *
		 * @type {number}
		 * @private
		 */
		this._nodeId = 0;

		/**
		 * The root node of the tree or null if no data is added.
		 *
		 * @type {Node}
		 * @private
		 */
		this._root = new Node(
			this._nodeId++,
			-1,
			0,
			[]
		);

		/**
		 * The Node last inserted into the tree.
		 *
		 * @type {Node}
		 * @private
		 */
		this._lastInserted = this._root;

		/**
		 * The node that we will insert childs into.
		 *
		 * @type {Node}
		 * @private
		 */
		this._activeNode = this._root;
	}

	/**
	 * Returns the currently active (focused) node.
	 *
	 * @return {Node} The currently active node.
	 */
	get activeNode() {
		return this._activeNode;
	}

	/**
	 * Adds a leaf to the tree.
	 *
	 * The node will be created under the currently focused node.
	 *
	 * @param {number}						start		Start offset of the node.
	 * @param {number}						end			End offset of the node.
	 * @param {Array<Array<string, any>>}	attributes	Array of attributes that the node has.
	 * @param {string|null}					text		The text associated with the node.
	 *
	 * @return {TreeBuilder} The tree builder.
	 */
	addLeaf( start, end, attributes, text ) {
		const leaf = new Node(
			this._nodeId++,
			start,
			end,
			attributes,
			text
		);

		this._activeNode.addChild( leaf );
		this._lastInserted = leaf;

		return this;
	}

	/**
	 * Adds a node to the root of the tree.
	 *
	 * This function creates a deep copy of the node. The node will be created under the
	 * currently active node.
	 *
	 * @param {Node} node The node to add to the tree.
	 *
	 * @return {TreeBuilder} The TreeBuilder instance.
	 */
	addNode( node ) {
		const copy = Node.clone( node, this._nodeId++ );
		this._activeNode.addChild( copy );
		this._lastInserted = copy;

		return this;
	}

	/**
	 * Returns the attribute tree.
	 *
	 * @return {Node} The attribute tree.
	 */
	getTree() {
		this._root.sort();
		return this._root;
	}

	/**
	 * Places the focus on the last inserted element (making it the active node).
	 */
	focusLastInserted() {
		this._activeNode = this._lastInserted;
	}

	/**
	 * Places the focus on the parent of the currently focused element (making it the active node).
	 */
	focusParent() {
		const parent = this._activeNode.parent;
		this._activeNode = ( parent ) ? parent : this._root;
	}
}
