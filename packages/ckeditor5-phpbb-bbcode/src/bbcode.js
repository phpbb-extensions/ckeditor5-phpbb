/**
 *
 * This file is part of the phpBB _BBCode processor package.
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
 * @module bbcode/bbcode
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import BBCodeDataProcessor from './bbcodedataprocessor';

/**
 * CKEditor5 plugin that loads the bbcode data processor.
 *
 * @extends module:core/plugin~Plugin
 */
export default class BBCode extends Plugin {
	/**
	 * Plugin constructor.
	 *
	 * It ensures that the data processor is set in the first round of
	 * plugin initialization.
	 *
	 * @param {module:core/editor/editor~Editor} editor
	 */
	constructor( editor ) {
		editor.data.processor = new BBCodeDataProcessor( editor.data );

		super( editor );
	}

	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'BBCodeConverter';
	}
}
