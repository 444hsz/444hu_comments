var loaded444comments = false;
document.addEventListener('DOMContentLoaded', function () {
    (function () {
        // only run once (fix for kepek.444.hu)
        if (loaded444comments) return;
        else loaded444comments = true;

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

        function cfg(key) {
            var cfg = {
                "sites":{
                    "default": { "legacy_frontend": true },
                    "444.hu": { "legacy_frontend": false },
                    "membership.444.hu": { "disabled": true }
                }
            }
            if (null !== key) return cfg[key];
            else return cfg;
        }

        function getConfig(key) {
            var sites = cfg("sites");
            return (typeof sites[window.location.hostname] !== "undefined" && typeof sites[window.location.hostname][key] !== "undefined") ? sites[window.location.hostname][key] : sites["default"][key];
        }

        if (!getConfig("disabled")) {
            if (getConfig("legacy_frontend")) {
                log("Legacy frontend mode");
                injectScript(chrome.runtime.getURL('444hu_comments_inject_legacy.js'));
            } else {
                log("Ember frontend mode");
                injectScript(chrome.runtime.getURL('444hu_comments_inject.js'));
            }
        } else {
            log("Extension is disabled on " + window.location.hostname);
        }
    }());
});
