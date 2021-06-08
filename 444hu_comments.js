var loaded444comments = false;
document.addEventListener('DOMContentLoaded', function () {
    (function () {
        // only run once (fix for kepek.444.hu)
        if (loaded444comments) return;
        else loaded444comments = true;

        var config = {
            "default": { "legacy_frontend": true },
            "444.hu": { "legacy_frontend": false },
            "membership.444.hu": { "disabled": true }
        }

        function getConfig(key) {
            return (typeof config[window.location.hostname] !== "undefined" && typeof config[window.location.hostname][key] !== "undefined") ? config[window.location.hostname][key] : config["default"][key];
        }

        function log(msg, ret) {
            var tag = "%c[444comments]";
            if (ret) return tag + " " + msg;
            else console.debug(tag, "color: #29af0a;", msg);
        }

        function injectScript(scriptName) {
            var script = document.createElement('script');
            script.src = scriptName;
            document.head.appendChild(script);
        }

        if (!getConfig("disabled")) {
            if (getConfig("legacy_frontend")) {
                log("Frontend: legacy");
                injectScript(chrome.runtime.getURL('444hu_comments_inject_legacy.js'));
            } else {
                log("Frontend: Ember");
                injectScript(chrome.runtime.getURL('444hu_comments_inject.js'));
            }
        } else {
            log("Extension is disabled on " + window.location.hostname);
        }
    }());
});
