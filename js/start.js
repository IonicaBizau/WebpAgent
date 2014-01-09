$(document).on("ready", function () {
    var scriptsToLoad = [
        "./semantic/javascript/semantic.js",
        "./code-mirror/codemirror.js",
        "./code-mirror/addon/hint/show-hint.js",
        "./code-mirror/addon/hint/xml-hint.js",
        "./code-mirror/addon/hint/html-hint.js",
        "./code-mirror/mode/xml/xml.js",
        "./code-mirror/mode/javascript/javascript.js",
        "./code-mirror/mode/css/css.js",
        "./code-mirror/mode/vbscript/vbscript.js",
        "./code-mirror/mode/htmlmixed/htmlmixed.js",
        "./js/editor-functions.js"
    ];

    var $body = $("body");
    var howMany = scriptsToLoad.length;
    var $loadedPercent = $(".loaded-percent");

    function loadRecursive (index) {
        if (index >= scriptsToLoad.length) {

            $(".loading-overlay").fadeOut(function () {
                $(this).remove();
                $API.setWindowState("MAXIMIZED");
            });

            return;
        }

        /*
         *  i ........... howMany?
         *  % ........... 100
         *
         * */
        var percent = ((index + 1) * 100 / howMany).toFixed(2);
        $loadedPercent.text(percent);

        loadJsFile(scriptsToLoad[index], function () {
            loadRecursive(++index);
        });
    }

    loadRecursive(0);
});

function loadJsFile (path, callback) {
    var head = document.getElementsByTagName('head')[0];
    var node = document.createElement('script');
    node.src = path;
    onLoad(node, function () {
        callback();
    });
    head.appendChild(node);
}

// Set up load listener
function onLoad (elm, handler) {

    if (typeof elm.onload !== 'undefined') {
        elm.onload = handler;
    } else {
        elm.onreadystatechange = function () {
            if (elm.readyState === 'loaded' || elm.readyState === 'complete' || elm.readyState === 4) {
                elm.onreadystatechange = null;
                handler();
            }
        };
    }
}
