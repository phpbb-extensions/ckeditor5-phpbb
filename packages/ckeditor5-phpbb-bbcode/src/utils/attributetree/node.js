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
 * @module bbcode/utils/attributetree/node
 */

/**
 * Interval tree node.
 *
 * Please note that many methods assume that the nodes are in ascending order by start position
 * and that the node intervals are not intersecting.
 */
export default class Node {
	/**
	 * Returns a deep copy of the Node passed.
	 *
	 * @param {Node}	node	The node to be copied.
	 * @param {number}	id		The new ID of the node.
	 *
	 * @return {Node} The deep copy of the node.
	 */
	static clone( node, id ) {
		return new Node(
			id,
			node.start,
			node.end,
			node.nodeAttributes,
			node.text
		);
	}

	/**
	 * Attribute tree node constructor.
	 *
	 * @param {number}						id			The ID of the node.
	 * @param {number}						start		The start offset of the node.
	 * @param {number}						end			The end offset of the node.
	 * @param {Array<Array<string, any>>}	attributes	The attributes that the node has.
	 * @param {string|null}					text		The text associated to this node or null.
	 */
	constructor( id, start, end, attributes, text = null ) {
		/**
		 * The ID of the node.
		 *
		 * @type {number}
		 * @private
		 */
		this._id = id;

		/**
		 * The start position of the node.
		 *
		 * @type {number}
		 * @private
		 */
		this._start = start;

		/**
		 * The end position of the node.
		 *
		 * @type {number}
		 * @private
		 */
		this._end = end;

		/**
		 * Map of the node's attributes.
		 *
		 * @type {Map<string, any>}
		 * @private
		 */
		this._attributes = new Map( attributes );

		/**
		 * The text contained in the node.
		 *
		 * @type {string}
		 * @private
		 */
		this._text = text;

		/**
		 * Array of child nodes.
		 *
		 * @type {Array<Node>}
		 * @private
		 */
		this._children = [];

		/**
		 * The depth of the subtree of this node.
		 *
		 * @type {number}
		 * @private
		 */
		this._subTreeDepth = 0;

		/**
		 * The parent of this node.
		 *
		 * @type {null|Node}
		 * @private
		 */
		this._parent = null;

		/**
		 * Whether or not this node's subtree is sorted.
		 *
		 * @type {boolean}
		 * @private
		 */
		this._isSorted = false;
	}

	/**
	 * Returns the ID of the node.
	 *
	 * @return {number} The ID of the Node.
	 */
	get id() {
		return this._id;
	}

	/**
	 * Returns the start position of the node.
	 *
	 * @return {number} The start position of the node.
	 */
	get start() {
		return this._start;
	}

	/**
	 * Returns the end position of the node.
	 *
	 * @return {number} The end position of the node.
	 */
	get end() {
		return this._end;
	}

	/**
	 * Returns the text of this node.
	 *
	 * @return {string|null} The text associated with this node.
	 */
	get text() {
		return this._text;
	}

	/**
	 * Returns the attributes of this node.
	 *
	 * @return {Map<string, any>} The attributes of this node.
	 */
	get nodeAttributes() {
		return this._attributes;
	}

	/**
	 * Returns the children of this node.
	 *
	 * @return {Array<Node>}
	 */
	get children() {
		return this._children;
	}

	/**
	 * Returns the depth of the subtree of this node.
	 *
	 * @return {number} The depth of the node's subtree.
	 */
	get subTreeDepth() {
		return this._subTreeDepth;
	}

	/**
	 * Returns whether or not this node is a leaf.
	 *
	 * @return {boolean} Whether or not this node is a leaf.
	 */
	get isLeaf() {
		return this._children.length === 0;
	}

	/**
	 * Returns the parent of this node.
	 *
	 * @return {Node|null} The parent of this node or null if this is the root of the tree.
	 */
	get parent() {
		return this._parent;
	}

	/**
	 * Updates the subtree depth of this node and its parents.
	 *
	 * @param {number} proposedDepth The new depth value of one its children + 1.
	 */
	updateDepth( proposedDepth ) {
		if ( this._subTreeDepth < proposedDepth ) {
			this._subTreeDepth = proposedDepth;
		}

		if ( this._parent !== null ) {
			this._parent.updateDepth( proposedDepth + 1 );
		}
	}

	/**
	 * Set the parent of this node.
	 *
	 * @param {Node} parent The parent node.
	 */
	setParent( parent ) {
		this._parent = parent;
	}

	/**
	 * Adds a child node to this node.
	 *
	 * @param {Node} node The child node.
	 */
	addChild( node ) {
		if ( this._start > node.start || this._start < 0 ) {
			this._start = node.start;
		}

		if ( this._end < node.end ) {
			this._end = node.end;
		}

		this._children.push( node );
		node.setParent( this );

		this.updateDepth( node.subTreeDepth + 1 );

		this._isSorted = false;
	}

	/**
	 * Removes a child node from the children array with the specified ID.
	 *
	 * @param {number} id The ID of the node to remove.
	 */
	removeChild( id ) {
		this._children = this._children.filter( child => {
			return child.id !== id;
		} );
	}

	/**
	 * Adds an attribute to this node.
	 *
	 * @param {string}	attributeName	The name of the attribute.
	 * @param {any}		attributeValue	The value of the attribute.
	 */
	addAttribute( attributeName, attributeValue ) {
		this._attributes.set( attributeName, attributeValue );
	}

	/**
	 * Removes an attribute from the node with the given name.
	 *
	 * @param {string} attributeName The name of the attribute.
	 */
	removeAttribute( attributeName ) {
		this._attributes.delete( attributeName );
	}

	/**
	 * Sorts the children nodes and their children by start position.
	 */
	sort() {
		if ( this._isSorted ) {
			return;
		}

		this._children.sort( ( a, b ) => {
			if ( a.start === b.start ) {
				return 0;
			}

			if ( a.start < b.start ) {
				return -1;
			}

			return 1;
		} );

		this._children.forEach( child => {
			child.sort();
		} );

		this._isSorted = true;
	}
}
