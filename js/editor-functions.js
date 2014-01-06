(function ($) {
    $.fn.sidebar = function (options) {
        var settings = $.extend({
            // defaults
        }, options);


        var $self = this;

        $self.on("sidebar.hide", function () {
            $self.animate({"top": - $self.height()});
        });

        $self.on("sidebar.show", function () {
            $self.animate({"top": 0});
        });
    };
})($);

(function (window) {
    CodeMirror.commands.autocomplete = function(cm) {
        CodeMirror.showHint(cm, CodeMirror.hint.html);
    };

    $(".controls").sidebar();

    var mixedMode = {
        name: "htmlmixed",
        scriptTypes: [
            {
                matches: /\/x-handlebars-template|\/x-mustache/i,
                mode: null
            },
            {
                matches: /(text|application)\/(x-)?vb(a|script)/i,
                mode: "vbscript"
            }
        ]
    };

    var editor = CodeMirror.fromTextArea($(".htmlDocument")[0], {
        mode: mixedMode,
        tabMode: "indent",
        autoCloseBrackets: true,
        lineNumbers: true,
        extraKeys: {
          "Ctrl-Space": "autocomplete"
        },
        value: "<!doctype html>\n<html>\n  " + document.documentElement.innerHTML + "\n</html>"
    });

    // click on the start button
    $(".run").on("click", function () {
        updateResult();
    });

    $(window).on("keydown", function (e) {
        if (e.ctrlKey && e.which === 13) { updateResult(); }
        if (e.ctrlKey && e.which === 28) {
            $(".controls").trigger("sidebar.hide");
        }
        if (e.ctrlKey && e.which === 40) {
            $(".controls").trigger("sidebar.show");
        }
    });


    // editor.on("change", updateResult);

    function updateResult () {
        var ifrm = $(".result:first")[0];
        ifrm.contentDocument.body.textContent = "";
        var htmlDocumentStr = editor.getValue()
        ifrm.contentDocument.open();
        ifrm.contentDocument.write(htmlDocumentStr);
        ifrm.contentDocument.close();
    }

    updateResult();
})(window);
