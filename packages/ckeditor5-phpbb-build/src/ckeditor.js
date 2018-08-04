/**
 *
 * This file is part of the phpBB Forum Software package.
 *
 * @copyright (c) phpBB Limited <https://www.phpbb.com>
 * @license GNU General Public License, version 2 (GPL-2.0)
 *
 * For full copyright and license information, please see
 * the LICENSE file.
 *
 */

'use strict';

import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';

import EssentialsPlugin from '@ckeditor/ckeditor5-essentials/src/essentials';
import ParagraphPlugin from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import BoldPlugin from '@ckeditor/ckeditor5-basic-styles/src/bold';
import ItalicPlugin from '@ckeditor/ckeditor5-basic-styles/src/italic';
import UnderlinePlugin from '@ckeditor/ckeditor5-basic-styles/src/underline';
import LinkPlugin from '@ckeditor/ckeditor5-link/src/link';
import ListPlugin from '@ckeditor/ckeditor5-list/src/list';

import BBCodePlugin from '@phpbb-extensions/ckeditor5-phpbb-bbcode/src/bbcode';

/**
 * CKEditor5 for phpBB.
 */
export default class phpBBCKEditor {
	/**
	 * Constructor.
	 */
	constructor() {
		// The editor plugins.
		this.plugins = [
			EssentialsPlugin,
			ParagraphPlugin,
			BoldPlugin,
			ItalicPlugin,
			UnderlinePlugin,
			LinkPlugin,
			ListPlugin,
			BBCodePlugin
		];

		// Toolbar items.
		this.toolbar_items = [
			'bold',
			'italic',
			'underline',
			'|',
			'bulletedList',
			'numberedList',
			'|',
			'link',
			'|',
			'undo',
			'redo'
		];

		// The editor instance.
		this.editor = null;
	}

	/**
	 * Returns all the plugins.
	 *
	 * @return Array The Array of plugins.
	 */
	getPlugins() {
		return this.plugins;
	}

	/**
	 * Set plugins.
	 *
	 * @param plugins Array of plugins.
	 */
	setPlugins( plugins ) {
		this.plugins = plugins;
	}

	/**
	 * Adds a plugin to the editor.
	 *
	 * @param plugin The plugin object.
	 */
	addPlugin( plugin ) {
		this.plugins.push( plugin );
	}

	/**
	 * Builds a config object for CKEditor.
	 *
	 * @return Object The config object.
	 */
	getEditorConfigObject() {
		return {
			plugins: this.plugins,
			toolbar: this.toolbar_items
		};
	}

	/**
	 * Returns the editor.
	 *
	 * @return The editor object.
	 */
	getEditor() {
		return this.editor;
	}

	/**
	 * Creates the editor.
	 *
	 * @param element The element to create the editor from.
	 *
	 * @return {null|*} Returns the editor instance or null on failure.
	 */
	create( element ) {
		ClassicEditor.create( element, this.getEditorConfigObject() )
			.then( editor => {
				this.editor = editor;
			} )
			.catch( error => {
				console.error( 'Could not create CKEditor instance!' ); // eslint-disable-line no-undef
				console.error( error.stack ); // eslint-disable-line no-undef
			} );

		return this.editor;
	}
}
