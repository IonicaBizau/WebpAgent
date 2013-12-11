(function (window) {
    CodeMirror.commands.autocomplete = function(cm) {
        CodeMirror.showHint(cm, CodeMirror.hint.html);
    };

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

    editor.on("change", updateResult);

    function updateResult () {
        var ifrm = $(".result:first")[0];
        ifrm.contentDocument.body.textContent = "";
        var htmlDocumentStr = editor.getValue()
        ifrm.contentDocument.open();
        ifrm.contentDocument.write(htmlDocumentStr);
        ifrm.contentDocument.close();
    }

    updateResult();
})i(window);
