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

$.template("dialog/default", '<div class="foundryDialog global"><div class="dialog-wrap"><div class="in"><div class="dialog-loader"><div class="loader-img"></div></div><div class="dialog-head"><span class="dialog-title"></span><a class="dialog-closeButton">Close</a></div><div class="dialog-body dialog-content"></div><div class="dialog-footer"><div class="dialog-buttons"></div></div></div></div></div>');

$.require()
 .library(
    'mvc/controller',
    'ui/core',
    'ui/position',
    'throttle-debounce',
    'easing'
 )
 .stylesheet(
    'dialog/default'
 )
 .done(function() {
