$.dialog = function(options)
{
    if (window.parentDialog)
        return window.parentDialog.update(options);

    var globalDialog = $('.foundryDialog.global');

    if (globalDialog.length < 1) {
        globalDialog = $($.View('dialog/default')).addClass('global').appendTo('body');
    }

    if (typeof options === "string" || $.isDeferred(options)) {

    	var afterShow = arguments[1];
    	options = {
    		content: options,
    		afterShow: ($.isFunction(afterShow)) ? afterShow : $.noop
    	}
    }

    var dialogController = globalDialog.controllers("dialog")[0];

    if (dialogController) {

    	dialogController.update(options);
    } else {
    	globalDialog.implement('dialog', options, function(){});
    }

    return globalDialog;
};
