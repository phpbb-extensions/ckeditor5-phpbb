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
 * @module bbcode/utils/attributetree/treemerger
 */

import AttributeInterval from './attributeinterval';
import TreeBuilder from './treebuilder';

/**
 * Attribute tree merger class.
 *
 * This class merges common attributes of tree nodes into one common ancestor where possible.
 */
export default class TreeMerger {
	/**
	 * Tree merger constructor.
	 *
	 * The complete rule set for resolving inline BBCode tags from text attributes.
	 *
	 * @param {Map<string, Array<NodeConverter>>} rules Map of rules with their given priorities.
	 */
	constructor( rules ) {
		this._rules = rules;
	}

	/**
	 * Merge consecutive nodes with the same attributes.
	 *
	 * @param {Node} tree The root of the attribute tree.
	 *
	 * @return {Node} The new attribute key.
	 */
	merge( tree ) {
		let tmpTree = tree;

		const priorities = [ 'highest', 'high', 'normal', 'low', 'lowest' ];
		for ( const priority of priorities ) {
			const ruleset = this._rules.get( priority );
			tmpTree = this._priorityPass( ruleset, tmpTree );
		}

		return tmpTree;
	}

	/**
	 * Processes a set of rules from a priority group.
	 *
	 * @param {Array<InlineNodeConverter>} ruleset Array of rules for the given priority.
	 * @param {Node} tree The attribute tree.
	 *
	 * @return {Node} The new attribute tree with nodes for merged attributes.
	 *
	 * @private
	 */
	_priorityPass( ruleset, tree ) {
		let tmpTree = tree;

		for ( const rule of ruleset ) {
			const treeBuilder = new TreeBuilder();
			this._attributePass( rule, tmpTree, treeBuilder );
			tmpTree = treeBuilder.getTree();
		}

		return tmpTree;
	}

	/**
	 * Merge nodes for a single attribute.
	 *
	 * @param {InlineNodeConverter} rule The rule for the attribute(s).
	 * @param {Node} tree The root of the attribute tree.
	 * @param {TreeBuilder} treeBuilder Array of previously discovered attribute intervals.
	 *
	 * @private
	 */
	_attributePass( rule, tree, treeBuilder ) {
		const attributeIntervals = this._resolveAttributes( rule, tree );
		this._buildTree( tree, treeBuilder, attributeIntervals );
	}

	/**
	 * Returns an array with the intervals of identical attributes. @todo
	 *
	 * @param {InlineNodeConverter} rule The rule for the attribute(s).
	 * @param {Node} tree The root of the attribute tree.
	 * @param {Array<AttributeInterval>} attributeIntervals Array of previously discovered attribute intervals.
	 *
	 * @return {Array<AttributeInterval>} The new array containing the array intervals.
	 *
	 * @private
	 */
	_resolveAttributes( rule, tree, attributeIntervals = [] ) {
		const children = tree.children;
		for ( const child of children ) {
			attributeIntervals = this._resolveAttributes( rule, child, attributeIntervals );
		}

		const hasRuleAttribute = rule.hasAttribute( tree );
		if ( hasRuleAttribute ) {
			const attributes = rule.getAttributes( tree );
			const index = attributeIntervals.length - 1;
			const insertNew = index < 0 ||
				attributeIntervals[ index ].end < tree.start ||
				!rule.compareAttributes( attributeIntervals[ index ].attributes, attributes );

			if ( insertNew ) {
				const interval = new AttributeInterval(
					tree.start,
					tree.end,
					attributes
				);
				attributeIntervals.push( interval );
			} else {
				attributeIntervals[ index ].setEndOffset( tree.end );
			}
		}

		return attributeIntervals;
	}

	/**
	 * Builds a new tree with the attribute intervals merged. @todo
	 *
	 * @param {Node} node A node of the attribute tree.
	 * @param {TreeBuilder} treeBuilder The tree builder.
	 * @param {Array<AttributeInterval>} attributeIntervals The attribute intervals.
	 *
	 * @return {Array<AttributeInterval>} The updated attribute intervals.
	 *
	 * @private
	 */
	_buildTree( node, treeBuilder, attributeIntervals ) {
		// The root element doesn't need to be reinserted.
		if ( node.parent !== null ) {
			treeBuilder.addNode( node );
			treeBuilder.focusLastInserted();
		}

		// If there are no more attributes in the tree, then we just have to copy it.
		if ( attributeIntervals.length === 0 ) {
			this._copyChildren( node, treeBuilder );
			treeBuilder.focusParent();
			return [];
		}

		let currentInterval = attributeIntervals[ 0 ];
		if ( currentInterval.start >= node.end ) {
			this._copyChildren( node, treeBuilder );
			treeBuilder.focusParent();
			return attributeIntervals;
		}

		if ( currentInterval.start === node.start && currentInterval.end === node.end ) {
			this._addAttributeToNode( treeBuilder, currentInterval );
			this._copyChildren( node, treeBuilder, currentInterval );
			treeBuilder.focusParent();
			attributeIntervals.shift();
			return attributeIntervals;
		}

		let end = -1;
		const children = node.children;
		let intervals = attributeIntervals;
		for ( let i = 0; i < children.length; i++ ) {
			const child = children[ i ];

			if ( intervals.length === 0 ) {
				this._copySubtree( child, treeBuilder );
				continue;
			}

			currentInterval = intervals[ 0 ];

			// If no new node was created yet, check if we need to.
			if ( end === -1 ) {
				const hasStarted = currentInterval.start <= child.start;
				const spansTwoChildren = ( i + 1 ) < children.length && currentInterval.end >= children[ i + 1 ].end;
				const createNew = hasStarted && spansTwoChildren;

				if ( createNew ) {
					end = Math.min( currentInterval.end, node.end );
					treeBuilder.addLeaf(
						child.start,
						end,
						currentInterval.attributes,
						null
					);
					treeBuilder.focusLastInserted();
					this._copySubtree( child, treeBuilder, currentInterval );
				} else {
					intervals = this._buildTree( child, treeBuilder, intervals );
				}
			} else {
				this._copySubtree( child, treeBuilder, currentInterval );

				if ( child.end === end ) {
					treeBuilder.focusParent();
					end = -1;
				}
			}

			if ( intervals.length > 0 && currentInterval.end <= child.end ) {
				intervals.shift();
			}
		}

		treeBuilder.focusParent();

		return intervals;
	}

	/**
	 * Copies the complete subtree, and adds the node to the tree builder.
	 *
	 * @param {Node} node The root of the subtree to copy (including the root node).
	 * @param {TreeBuilder} treeBuilder The tree builder instance.
	 * @param {AttributeInterval|null} interval If not null, the attributes specified in the interval will be removed
	 * 											from the subtree.
	 *
	 * @private
	 */
	_copySubtree( node, treeBuilder, interval = null ) {
		treeBuilder.addNode( node );
		treeBuilder.focusLastInserted();

		if ( interval !== null ) {
			this._removeAttributesFromNode( treeBuilder, interval );
		}

		this._copyChildren( node, treeBuilder, interval );

		treeBuilder.focusParent();
	}

	/**
	 * Copies a subtree exluding the root of the tree.
	 *
	 * @param {Node} node The root of the subtree to copy (excluding the root node).
	 * @param {TreeBuilder} treeBuilder The tree builder instance.
	 * @param {AttributeInterval|null} interval If not null, the attributes specified in the interval will be removed
	 * 											from the subtree.
	 *
	 * @private
	 */
	_copyChildren( node, treeBuilder, interval = null ) {
		for ( const child of node.children ) {
			this._copySubtree( child, treeBuilder, interval );
		}
	}

	/**
	 * Removes a set of attributes from the active node in the tree builder.
	 *
	 * @param {TreeBuilder} treeBuilder The tree builder instance.
	 * @param {AttributeInterval} interval The interval with the attributes to remove.
	 *
	 * @private
	 */
	_removeAttributesFromNode( treeBuilder, interval ) {
		const node = treeBuilder.activeNode;

		for ( const key of interval.attributes.keys() ) {
			node.removeAttribute( key );
		}
	}

	/**
	 * Adds a set of attributes to the active node in the tree builder.
	 *
	 * @param {TreeBuilder} treeBuilder The tree builder instance.
	 * @param {AttributeInterval} interval The interval with the attributes to add.
	 *
	 * @private
	 */
	_addAttributeToNode( treeBuilder, interval ) {
		const node = treeBuilder.activeNode;

		for ( const key of interval.attributes.keys() ) {
			const value = interval.attributes.get( key );
			node.addAttribute( key, value );
		}
	}
}
