$.dialog = function(options)
{
    if (window.parentDialog)
        return window.parentDialog.update(options);

    var globalDialog = $('.foundry-dialog.global');

    if (globalDialog.length < 1)
    {
        globalDialog = $($.View('jquery.dialog')).addClass('global').appendTo('body');
    }

    globalDialog.implement('dialog_', options, function(){});
};
