$.Controller(
    'Dialog',
    {
        pluginName: "dialog",

        defaultOptions: {

            title: '',
            content: undefined,
            buttons: {},

            customClass: "",

            width: 'auto',
            height: 'auto',

            css: {
                position: 'absolute',
                width: 'auto',
                height: 'auto',
                zIndex: 10001
            },

            position: {
                my: 'center center',
                at: 'center center',
                of: window
            },

            offset: 100,

            // TODO: Overlay to be part of EJS
            showOverlay: true,
            overlay: {
                css: {
                    background: '#000',
                    opacity: '0.4',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    zIndex: 10000,
                    width : '100%',
                    height: '100%',
                    display: 'none'
                }
            },

            body: {
                css: {
                    minWidth: 0,
                    minHeight: 0,

                    // If the dialog content immediate element contains margin,
                    // the margin will bleed outside of the parent container
                    // if overflow: 'auto' is not assigned.
                    overflow: 'auto'
                }
            },

            iframe: {
                css: {
                    width: '100%',
                    height: '100%',
                    border: 'none'
                }
            },

            transition: {
                show: 'zoom',
                hide: 'zoom'
            },

            beforeShow: function(){},
            afterShow : function(){},
            beforeHide: function(){},
            afterHide : function(){},

            dialogHead   : '.dialog-head',
            dialogBody   : '.dialog-body',
            dialogFooter : '.dialog-footer',
            dialogTitle  : '.dialog-title',
            dialogContent: '.dialog-content',
            dialogButtons: '.dialog-buttons',
            dialogLoader : '.dialog-loader',
            closeButton  : '.dialog-closeButton'
        }
    },
    function(self){ return {
        ready: false,

        contentReady: false,

        init: function()
        {
            self.setInitOptions(self.options);

            self.initElement = self.element.clone();

            self.element.finalizeContent = function(){ return self.finalizeContent.apply(self, arguments) };

            // Experimental optimization
            // Make a reference to all the static elements on init.
            $.each([
                'dialogHead',
                'dialogBody',
                'dialogFooter',
                'dialogTitle',
                'dialogContent',
                'dialogButtons',
                'dialogLoader'
            ], function(i, name)
            {
                self[name] = self.find(self.options[name]);
            });

            if (self.options.content===undefined) {
                return;
            }

            self.display();
        },

        setInitOptions: function(options)
        {
            self.initOptions = $.extend(true, {}, options);

            // Remove callbacks
            $.each(['beforeShow', 'afterShow', 'beforeHide', 'afterHide'], function(i, name)
            {
                self.initOptions[name] = function(){};
            });
            self.initOptions.title   = null;
            self.initOptions.content = null;
            self.initOptions.buttons = null;
        },

        // Update is called during subsequent $.dialog() calls.
        // A default behaviour of any controller class.
        update: function(options)
        {
            if (options)
            {
                var options = $.extend(true, {}, self.initOptions, options);

                self.setInitOptions(options);

                self.display(options);
            }

            return self;
        },

        displayQueue: [],

        display: function(options)
        {
            if (self.resizing)
                return self.displayQueue.push(options);

            if ($.isPlainObject(options))
                self.options = $.extend(true, {}, self.Class.defaults, options);

            if (!self.ready)
            {
                // TODO: Overlay should be part of dialog template
                if (self.options.showOverlay)
                    self.createOverlay();
            }

            self.contentReady = self.options.content===null;

            var transition = self.options.transition;
            if (typeof transition=='string')
                self.options.transition = { show: transition, hide: transition };

            // Determine content type
            self.contentType = 'html';

            if ($.isUrl(self.options.content))
                self.contentType = 'iframe';

            if ($.isDeferred(self.options.content))
                self.contentType = 'deferred';

            switch (self.contentType)
            {
                case 'html':
                    self.hideLoader();
                    self.show();
                    break;

                case 'iframe':
                    var iframe = $(document.createElement('iframe')),
                        iframeUrl = self.options.content,
                        iframeCss = self.options.iframe.css,
                        iframeButtons = self.options.buttons,
                        dialogContent = self.dialogContent,
                        iframeOptions = $.extend(true, {}, self.options, {
                            content: iframe,
                            buttons: iframeButtons
                        });

                    self.showLoader(function()
                    {
                        onIframeLoaded = (function()
                        {
                            return function(event)
                            {
                                // Expose dialog object to iframe
                                // Inside a try catch because does not work on cross-site domain,
                                // and url checking takes a lot more code to write.
                                try { iframe[0].contentWindow.parentDialog = self; } catch(err) {};

                                self.update(iframeOptions);
                            };
                        })();

                        iframe
                            .appendTo(dialogContent)
                            .css(iframeCss)
                            .css({position: 'absolute', visibility: 'hidden'})
                            .one('load', onIframeLoaded)
                            .attr('src', iframeUrl);
                    });

                    break;

                case 'deferred':
                    var ajax = self.options.content,
                        contentOptions = self.options;

                    self.showLoader(function() {

                        ajax.done(function(html) {

                            self.update($.extend(true, {}, contentOptions, {content: html}));
                        });
                    });

                    break;
            }
        },

        loading: false,

        showLoader: function(callback)
        {
            var showLoaderOverlay = function()
            {
                self.dialogLoader
                    .show()
                    .css(
                    {
                        width: self.dialogBody.width(),
                        height: self.dialogBody.height()
                    })
                    .position({
                        my: 'top left',
                        at: 'top left',
                        of: self.options.dialogContent
                    });

                return callback && callback();
            };

            return (self.ready) ? showLoaderOverlay() : self.update(
            {
                title: self.options.title,
                content: '',
                width: self.initOptions.body.css.minWidth,
                height: self.initOptions.body.css.minHeight,
                afterShow: showLoaderOverlay
            });
        },

        hideLoader: function()
        {
            self.dialogLoader.hide();
        },

        autoSize: function()
        {
            return self.initOptions.css.width=='auto' || self.initOptions.css.height=='auto';
        },

        finalizeContent: function(finale)
        {
            var options = self.options,
                content = options.content;

            self.element
                .css(options.css);

            self.dialogContent
                .css(options.body.css);

            if (options.title!==null)
                self.dialogTitle
                    .html(options.title);

            if (content!==null)
            {
                var isIframe = !$.isString(content) && $(content).is('iframe');

                self.dialogBody
                    .toggleClass('type-iframe', isIframe);

                if (isIframe)
                {
                    // This is a replacement for jQuery's .siblings().
                    // The difference is that this code will go through
                    // not only html elements but also other types of dom nodes,
                    // e.g. text nodes.
                    var parent = content.parent()[0];

                    var i = 0;
                    while(parent.childNodes.length > 1)
                    {
                        var node = parent.childNodes[i];
                        if (node!==content[0])
                            parent.removeChild(node);
                        i++;
                    }

                    content
                        .css({position: 'relative', visibility: 'visible'});
                } else {

                    // Finalize content might be called multiple times during different
                    // transition states. But only the last one should be inserted
                    // with the embedded scripts.

                    var finalContent;

                    if (finale) {
                        finalContent = content;

                        // Store the stripped version into the options
                        options.content = self.stripScript(finalContent);
                    } else {
                        finalContent = self.stripScript(content);
                    }

                    // This is inserted with scripts
                    self.dialogContent
                        .html(finalContent);
                }
            }

            if (!self.contentReady)
                self.finalizeButtons();

            return self.element;
        },

        stripScript: function(html) {

            if (!$.isString(html)) return html;

            var content = $($.parseHTML(html));

            content.find("script").remove();

            return content;
        },

        finalizeSize: function(fast)
        {
            var refElement = self.refElement,
                options = self.options,
                body = options.body,
                content = options.content,
                css = options.css,
                bodyCss = body.css;

            // Create a new ref element
            if (refElement===undefined) {
                refElement = self.refElement = self.initElement.clone().removeClass('global').insertAfter(self.element);

            // Because it could be detached at this moment
            } else {
                refElement.insertAfter(self.element);
            }

            if (!fast)
            {
                refTitle   = refElement.find(options.dialogTitle);
                refBody    = refElement.find(options.dialogBody);
                refFooter  = refElement.find(options.dialogFooter);
                refButtons = refElement.find(options.dialogButtons);

                refElement
                    .css(self.initOptions.css)
                    .css({display: 'block'});

                refTitle
                    .html(options.title);

                if (!$.isEmptyObject(options.buttons))
                {
                    refFooter.show();
                    refButtons.append('<button>test</button>');
                } else {
                    refFooter.hide();
                }

                // Pass 1: Readjust dialog body's dimension based on dialog's content
                var isIframe = !$.isString(content) && $(content).is('iframe');

                var refContent = (isIframe) ? document.createElement('div') : self.stripScript(content);

                bodyCss.width  = (isIframe && options.width=='auto')  ? content.contents().width() : options.width;
                bodyCss.height = (isIframe && options.height=='auto') ? content.contents().height() : options.height;

                refBody
                    .css(bodyCss)
                    .toggleClass('type-iframe', isIframe)
                    .html(refContent);

                var refBodyWidth = refBody.width(),
                    refBodyHeight = refBody.height();

                if (refBody.css("boxSizing")!=="border-box") {
                    bodyCss.width  = refWidth;
                    bodyCss.height = refHeight;
                }

                if (bodyCss.width < bodyCss.minWidth) {
                    bodyCss.width = bodyCss.minWidth;
                }

                if (bodyCss.height < bodyCss.minHeight) {
                    bodyCss.height = bodyCss.minHeight;
                }

                // Pass 2: Re-adjust dialog's dimension based on window's dimension
                var offset         = options.offset,
                    width          = refElement.width(),
                    height         = refElement.height(),
                    maxWidth       = $(window).width() - offset,
                    maxHeight      = $(window).height() - offset,
                    widthExceeded  = width > maxWidth,
                    heightExceeded = height > maxHeight;

                css.width  = (widthExceeded) ? maxWidth : width;
                css.height = (heightExceeded) ? maxHeight : height;

                // Pass 3: Readjust dialog body's dimension based on readjusted dialog's dimension

                if (bodyCss.width!=="auto") {
                    bodyCss.width  -= (width  - css.width);
                }

                if (bodyCss.height!=="auto") {
                    bodyCss.height -= (height - css.height);
                }

                bodyCss.minWidth = bodyCss.minHeight = 'auto';

                // Pass 4: Decide scrollbar visiblity based on readjusted dialog body's dimension.
                refBody.css(bodyCss);

                bodyCss.overflowX = (!widthExceeded  || isIframe || refBody[0].scrollWidth  <= bodyCss.width)  ? 'auto' : 'scroll';
                bodyCss.overflowY = (!heightExceeded || isIframe || refBody[0].scrollHeight <= bodyCss.height) ? 'auto' : 'scroll';

                // Clean up
                refBody.html('');

            }

            // Pass 5: Readjust position based on final dialog dimension
            refElement
                .css(css)
                //  FF3 can't retrieve css positions when element is on display: none;
                // .initialPosition(options.position, true);
                .css('visibility', 'hidden')
                .position(options.position);

            css.top  = refElement.css('top');
            css.left = refElement.css('left')
        },

        finalizeButtons: function()
        {
            var dialogFooter  = self.dialogFooter,
                dialogButtons = self.dialogButtons;

            dialogButtons.empty();

            if ($.isEmptyObject(self.options.buttons))
            {
                dialogFooter.hide();
                return;
            }

            $.each(self.options.buttons, function(i, button)
            {
                var events = $.extend({}, button),
                    classNames  = button.classNames ? button.classNames : '';
                delete events.name;

                $(document.createElement('button'))
                    .attr('type', 'button')
                    .addClass( classNames )
                    .html(button.name)
                    .bind(events)
                    .appendTo(dialogButtons);
            });

            dialogFooter.show();
        },

        show: function(callback)
        {
            if (self.ready && self.resizing) return;

            if (self.refElement)
                self.refElement.remove();

            if (!self.contentReady)
                self.options.beforeShow.apply(self);

            self.resizing = true;

            self.finalizeSize();

            self.element.addClass('resizing');

            self.transition[self.options.transition.show].show
                .apply(self, [function()
                {
                    if (!self.ready)
                    {
                        self.on("resize.dialog scroll.dialog", window, $.debounce(150, function(){ self.refresh() }));
                        self.ready = true;
                    }

                    if (!self.contentReady)
                    {
                        if (callback) callback.apply(self);
                        self.options.afterShow.apply(self);
                    }

                    // Detach shadow dialog
                    self.refElement.detach();

                    self.element.removeClass('resizing');

                    self.contentReady = true;

                    // Let the dialog container wrap to dialog content's final natural size,
                    // so we can avoid all the tedious box model issues.
                    self.element.css({width: 'auto', height: 'auto'});

                    if (self.displayQueue.length > 0)
                    {
                        setTimeout(function(){
                            self.resizing = false;
                            self.display(self.displayQueue.shift());
                        }, 500);
                    } else {
                        self.resizing = false;
                    }

                }]);
        },

        hide: function(callback)
        {
            if (!self.contentReady)
                self.options.beforeHide.apply(self);

            self.transition[self.options.transition.hide].hide
                .apply(self, [function()
                {
                    if (callback) callback.apply(self);
                    self.options.afterHide.apply(self);
                }]);
        },

        refresh: function()
        {
            if (self.closing)
                return;

            self.finalizeSize(true);

            self.resizing = true;

            self.transition[self.options.transition.show].show.apply(self, [function()
            {
                self.resizing = false;

                // Let the dialog container wrap to dialog content's final natural size,
                // so we can avoid all the tedious box model issues.
                self.element.css({width: 'auto', height: 'auto'});
            }]);
        },

        // TODO: Transition parameters
        transition:
        {
            none: {
                show: function(callback)
                {
                    // TODO: Fix IE7 z-index issue.

                    if (!self.ready)
                        self.overlay.show();

                    self.element
                        .finalizeContent()
                        .show(0, callback);
                },

                hide: function(callback)
                {
                    self.overlay.hide();
                    self.element.hide(0, callback);
                }
            },

            fade: {
                show: function(callback)
                {
                    if (!self.ready)
                        self.overlay.fadeOut(0).fadeIn('normal');

                    if (!self.contentReady)
                    {
                        self.element
                            .fadeOut((!self.contentReady) ? 0 : 'fast', function()
                            {
                                self.element
                                    .finalizeContent()
                                    .fadeIn('normal', 'easeInCubic', callback);
                            });

                    } else {
                        self.element.finalizeContent();
                        return callback && callback();
                    }
                },

                hide: function(callback)
                {
                    self.overlay.fadeOut('normal', 'easeOutCubic');
                    self.element.fadeOut('normal', 'easeOutCubic', callback);
                }
            },

            zoom: {
                show: function(callback)
                {
                    var dialogBody = self.dialogBody,
                        dialogFooter = self.dialogFooter,
                        css = self.options.css;

                    if (!self.ready)
                    {
                        self.overlay.fadeIn('fast');

                        self.element
                            .finalizeContent()
                            .css(
                            {
                                top: parseInt(css.top) + (parseInt(css.height) / 2),
                                left: parseInt(css.left) + (parseInt(css.width) / 2),
                                width: 0,
                                height: 0
                            });
                    }

                    if (!self.contentReady)
                    {
                        dialogBody.css({opacity: 0});
                        dialogFooter.css({opacity: 0});
                    }

                    self.element
                        .animate(
                        {
                            top   : css.top,
                            left  : css.left,
                            width : css.width,
                            height: css.height
                        }, 'normal', 'easeInCubic',
                        function()
                        {
                            self.element.finalizeContent(true);

                            dialogBody.css({opacity: 1});
                            dialogFooter.css({opacity: 1});

                            // TODO: Circular reference. IE8 show() callback gets executed when closing. Double check if its fixed.
                            return callback && callback();
                        });
                },
                hide: function(callback)
                {
                    var css = self.options.css;

                    self.element
                        .animate(
                            {
                                top: parseInt(css.top) + (parseInt(css.height) / 2),
                                left: parseInt(css.left) + (parseInt(css.width) / 2),
                                width: 0,
                                height: 0
                            }, 'normal', 'easeOutCubic',
                            function()
                            {
                                self.overlay.fadeOut('fast');
                                return callback && callback();
                            });
                }
            }
        },

        overlay: $('<div></div>'),

        createOverlay: function()
        {
            self.overlay
                .css(self.options.overlay.css)
                .click(function()
                {
                    self.close();
                })
                .appendTo('body');
        },

        closing: false,

        close: function()
        {
            if (self.closing) return;

            self.closing = true;

            self.hide(function()
            {
                self.element.remove();
                self.refElement && self.refElement.remove();
            });

            return self;
        },

        "{closeButton} click": function()
        {
            self.close();
        },

        content: function()
        {
            var dialogContent = self.dialogContent;
            var iframe = dialogContent.find("> iframe");
            return (iframe.length > 0) ? iframe.contents() : dialogContent;
        }
    }}
);
