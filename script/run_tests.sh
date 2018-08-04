#!/bin/bash
#
# This file is part of the phpBB CKEditor5 package.
#
# @copyright (c) phpBB Limited <https://www.phpbb.com>
# @license GNU General Public License, version 2 (GPL-2.0)
#
# For full copyright and license information, please see
# the LICENSE file.
#

lerna bootstrap

TEST_RESULT=0

for i in $(ls -d packages/*); do
    cd $i
    npm run lint
    if [[ $? -eq 1 ]]; then
        TEST_RESULT=1
    fi
    cd ../..
done

exit $TEST_RESULT
