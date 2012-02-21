$.dialog = function(options)
{
    if (window.parentDialog)
        return window.parentDialog.update(options);

    var globalDialog = $('.foundryDialog.global');

    if (globalDialog.length < 1)
    {
        globalDialog = $($.View('dialog/default')).addClass('global').appendTo('body');
    }

    return globalDialog.implement('dialog', options, function(){});
};
