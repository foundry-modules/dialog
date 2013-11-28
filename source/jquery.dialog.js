$.dialog = function(options) {

    // When dialog is loaded via iframe
    if (window.parentDialog) {
        return window.parentDialog.update(options);
    }

    var dialog = $('.foundryDialog.global'),
        controller = dialog.controllers("dialog")[0];

    // Return dialog controller if no options given
    if (arguments.length < 1 && controller) {
        return controller;
    }

    // Create dialog if element not exist.
    if (dialog.length < 1) {
        dialog = $($.View('dialog/default')).addClass('global').addClass(options.customClass).appendTo('body');
    }

    // Translate options shorthand
    if (typeof options === "string" || $.isDeferred(options)) {

    	var afterShow = arguments[1];

    	options = {
    		content: options,
    		afterShow: ($.isFunction(afterShow)) ? afterShow : $.noop
    	}
    }

    // If it is an existing dialog
    if (controller) {

        controller.update(options);

    } else {

        controller = dialog.addController('Dialog', options);
    }

    return controller;
};
