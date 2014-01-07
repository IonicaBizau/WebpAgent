(function ($) {
    $.fn.sidebar = function (options) {
        var settings = $.extend({
            // defaults
        }, options);

        var $self = this;

        $self.on("sidebar.hide", function () {
            $self.stop(true).animate({"top": - $self.height() - 10});
        });

        $self.on("sidebar.show", function () {
            $self.stop(true).animate({"top": 0});
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
        $("#openFileModal").modal("hide");
    });

    // close modal and open file
    $("#saveFileModal .ok-button").on("click", function () {
        var filePath = $("#saveFileModal .file-path").val();
        saveFile(filePath);
        $("#saveFileModal").modal("hide");
    });

    // hide top bar
    $(".controls .hide-topbar").on("click", function () {
        $(".controls").trigger("sidebar.hide");
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

        // <Ctrl-S> - Save file
        if (e.ctrlKey && e.which === 83) { saveFile(); }
    });

    editor.on("change", function () {
        // not saved
        changeSaveState (false);
    });

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
        if (!saved) {
            if (!custom.confirm("Your work is not saved. Do you want to quit?")) {
                return;
            }
        }
        $API.closeWindow();
    }

    var custom = {
        "alert": function (m) {
            return alert(m);
        },
        "confirm": function (m) {
            return confirm(m);
        }
    };

    var savedFilePath;
    function saveFile (filePath) {

        // not yet saved in a file
        if (!savedFilePath && !filePath) {
            $(".controls .save").click();
            return;
        }

        // file path not provided we take it from already saved file
        if (filePath == undefined) {
            filePath = savedFilePath;
        } else {
            savedFilePath = filePath;
        }

        // wrte in file
        $API.writeFile(filePath, editor.getValue());

        // not saved
        changeSaveState (true);
    }

    var saved = false;
    function changeSaveState (newState) {

        // do nothing if we aready have the same state
        if (saved === newState) { return; }

        // set saved state
        saved = Boolean(newState);

        // TODO Update UI
    }
})(window);
