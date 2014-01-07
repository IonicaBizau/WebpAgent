(function ($) {
    $.fn.sidebar = function (options) {
        var settings = $.extend({
            // defaults
        }, options);

        var $self = this;

        $self.on("sidebar.hide", function () {
            $self.animate({"top": - $self.height() - 10});
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
    $(".controls .run").on("click", function () {
        updateResult();
    });

    // click on the open button
    $(".controls .open").on("click", function () {
        $("#openFileModal").modal("show");
    });

    // click on the save button
    $(".controls .save").on("click", function () {
        $("#saveFileModal").modal("show");
    });

    // click on the save button
    $(".controls .quit").on("click", closeWindow);

    // close modal and open file
    $("#openFileModal .ok-button").on("click", function () {
        console.debug("Not implemented.");
        $("#openFileModal").modal("close");
    });

    // close modal and open file
    $("#saveFileModal .ok-button").on("click", function () {
        var filePath = $("#saveFileModal .file-path").val();
        $API.writeFile(filePath, editor.getValue());
        $("#saveFileModal").modal("close");
    });

    // key down handlers
    $(window).on("keydown", function (e) {

        // <Ctrl-Enter> - Update result
        if (e.ctrlKey && e.which === 13) { updateResult(); }

        // <Ctrl-Up> - Hide top bar
        if (e.ctrlKey && e.which === 38) { $(".controls").trigger("sidebar.hide"); }

        // <Ctrl-Down> - Show top bar
        if (e.ctrlKey && e.which === 40) { $(".controls").trigger("sidebar.show"); }

        // <Esc> or <Ctrl-W> - Show top bar
        if (e.which === 27 || e.ctrlKey && e.which === 87) { closeWindow(); }
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

    function closeWindow () {
        // TODO Is file saved?
        $API.closeWindow();
    }
})(window);
