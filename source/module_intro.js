/**
 * jquery.dialog.
 * jQuery dialog with extensible transitions,
 * iframe & ajax content support.
 *
 * Copyright (c) 2011 Jason Ramos
 * www.stackideas.com
 *
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 */

$.require()
 .library(
    'ui/core',
    'ui/position',
    'throttle-debounce',
    'easing'
 )
 .stylesheet(
    'dialog/default'
 )
 .template(
    'dialog/default'
 )
 .done(function() {
