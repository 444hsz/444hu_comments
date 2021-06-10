(function () {
    if (typeof Ember === "undefined") return;

    var _emberApp = Ember.A(Ember.Namespace.NAMESPACES).filter(n => {return n.name === 'n3'})[0];
    if (_emberApp) {
        var _emberRouter = _emberApp.__container__.lookup('router:main'),
            _lastUrl = _emberRouter.get("url");
    } else {
        log("frontend app not found, extension is disabled");
        return;
    }

    var _commentsSectionEl = document.createElement("section"),
        _commentsButtonTopEl = null,
        _commentsSectionTempEl = null,
        _parentEl = null,
        _headContentAvailable = false;

    _commentsSectionEl.id = "comments";
    _commentsSectionEl.innerHTML =
        `<div class="comments-docked-resizer"><div></div></div>
        <div class="subhead">` +
            `<span class="logo bg-444comments-icon" title=""><span class="comments-docked-title">Kommentek</span></span>` +
            `<span class="comments-title">Uralkodj magadon!</span>` +
            `<span class="comments-docked-toggle">` + 
                `<span class="comments-docked-open"><button title="Oldalsáv">◨</button></span>` +
                `<span class="comments-docked-close comments-docked-hidden"><a><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAALCAYAAACprHcmAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAADxJREFUeNpi+A8BaUDMgAeD5BEMPBrg8gwENKCI45TAZgADHpMwbMLrRnQ5sk0m2s1EhwZJ4Ux0DAIEGABDKYzoRdlxEwAAAABJRU5ErkJggg=="></a></span>` +
            `</span>
        </div>
        <div class="comments-contents">
            <div>
                <b>Új kommentelési szabályok érvényesek 2019. december 2-től.</b>
                <a href="https://444.hu/2019/12/02/valtoznak-a-kommenteles-szabalyai-a-444-en" target="_blank">Itt olvashatod el</a>, hogy mik azok, és <a href="https://444.hu/2019/12/02/ezert-valtoztatunk-a-kommenteles-szabalyain" target="_blank">itt azt</a>, hogy miért vezettük be őket.
            </div>
            <button class="gae-comment-click-open comments-toggle bg-444comments-icon">Kommentek mutatása</button>
            <div class="ad"><div id="444_aloldal_kommentek"></div></div>
            <div id="disqus_thread" class="freehand layout"></div>
        </div>`;

        function getConfig(key) {
            return (typeof config[window.location.hostname] !== "undefined" && typeof config[window.location.hostname][key] !== "undefined") ? config[window.location.hostname][key] : config["default"][key];
        }

        function log(msg, ret) {
        var tag = "%c[444comments]";
        if (ret) return tag + " " + msg;
        else console.debug(tag, "color: #29af0a;", msg);
    }

    function pageChanged() {
        return _lastUrl !== _emberRouter.get("url");
    }

    function trackPageChange() {
        _lastUrl = _emberRouter.get("url");
        return true;
    }

    function pageIsArticle() {
        return String(_emberRouter.currentRouteName).endsWith("--reader.post");
    }

    function scrollToHash() {
        if (window.location.hash.startsWith('#comment')) {
            document.querySelector(".comments-toggle").click();
            document.getElementById('comments').scrollIntoView();
        }
    }

    function initSidebar() {
        var _ce = document.querySelector("section#comments");
        var _re = document.querySelector("section#comments .comments-docked-resizer");

        function initResize(e) {
            e.preventDefault();
            document.body.style.pointerEvents = "none";
            _ce.classList.toggle("dragged");
            window.addEventListener('mousemove', Resize, false);
            window.addEventListener('mouseup', stopResize, false);
        }

        function Resize(e) {
            e.preventDefault();
            var w = document.body.clientWidth - e.clientX;
            if (w >= 335) {
                _ce.style.width =  w + 'px';
                _re.style.right =  (w - 8) + 'px';
            }
        }

        function stopResize(e) {
            e.preventDefault();
            window.removeEventListener('mousemove', Resize, false);
            window.removeEventListener('mouseup', stopResize, false);
            document.body.style.pointerEvents = "";
            _ce.classList.toggle("dragged");
        }

        function onClickSidebarToggle() {
            document.getElementById('comments').classList.toggle('docked-comments');
            document.querySelector('.comments-docked-open').classList.toggle('comments-docked-hidden');
            document.querySelector('.comments-docked-close').classList.toggle('comments-docked-hidden');
            document.getElementById('comments').style.width = 'var(--docked-comments-width)';
            document.querySelector("section#comments .comments-docked-resizer").style.right = "calc(var(--docked-comments-width) - var(--docked-comments-resizer-width))";
            let el = document.querySelector(".comments-toggle");
            if (null !== el) el.click();
        }

        _re.addEventListener('mousedown', initResize, false);

        document.querySelector('.comments-docked-open>button').onclick = onClickSidebarToggle;
        document.querySelector('.comments-docked-close>a').onclick = onClickSidebarToggle;
    }

    function initButtons() {
        function onClickCommentsButton() {
            window.disqus_url = document.URL;
            let dc = require('disqus/components/disqus-comments'),
                lc = new dc.default(),
                go = Ember.getOwner;
            Ember.getOwner = function() { return { lookup: function() { return { get: function() { return "444hu"; }}}}}
            lc.args = {};
            lc.loadComments.perform();
            Ember.getOwner = go;
            this.classList.add('hide');
        }
    
        function onClickTopCommentsButton() {
            document.querySelector(".comments-toggle").click();
            document.getElementById("comments").scrollIntoView();
        }

        function insertTopCommentsButton() {
            _commentsButtonTopEl = document.createElement("div");
            _commentsButtonTopEl.innerHTML = '<button class="gae-comment-click-open comments-toggle-top">Kommentek</button>';

            let p = document.querySelector('[style="--avatar-width: 40px; --avatar-height: 40px;"]');
            p.style.setProperty("--avatar-width", "180px");
            p.style.setProperty("background", "none");
            p.insertBefore(_commentsButtonTopEl, p.childNodes[0]);
        }

        insertTopCommentsButton();

        document.querySelector(".comments-toggle").onclick = onClickCommentsButton;
        document.querySelector(".comments-toggle-top").onclick = onClickTopCommentsButton;
    }

    function initCommentsSection() {
        _commentsSectionTempEl = _commentsSectionEl.cloneNode(true);
        _parentEl.insertBefore(_commentsSectionTempEl, _parentEl.childNodes[0]);
    }

    function reset() {
        if (typeof DISQUS !== "undefined") {
            DISQUS.reset();
            DISQUS_RECOMMENDATIONS.reset();
        }

        let el = document.querySelector("#ap-article-footer1");
        if (null !== el) {
            if (null !== _commentsButtonTopEl) {
                _commentsButtonTopEl.parentElement.style.setProperty("--avatar-width", "40px");
                _commentsButtonTopEl.parentElement.style.setProperty("background", null);
                _commentsButtonTopEl.remove();
                _commentsButtonTopEl = null;
            }

            if (null !== _commentsSectionTempEl) {
                _commentsSectionTempEl.remove();
                _commentsSectionTempEl = null;
            }

            _parentEl = el.parentElement;
            _headContentAvailable = false;

            let btns = document.evaluate("//button[contains(., 'Kommentek mutatása')]", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null );
            if (btns.snapshotLength) {
                for (let i = 0; i < btns.snapshotLength; i++) {
                    let btn = btns.snapshotItem(i);
                    if (!btn.classList.contains('comments-toggle')) {
                        btn.remove();
                        log("comments enabled by 444.hu");
                        break;
                    }
                }
            } else {
                log("comments disabled by 444.hu");
            }

            return true;
        }

        return false;
    }

    function init() {
        if (pageIsArticle()) {
            if (reset()) {
                initCommentsSection();
                initSidebar();
                initButtons();
                scrollToHash();
                //trackPageChange(); //TODO: maybe uncomment this after 444 fixed the duplicate head-layout rendering issue
                log("added comments section for slug:\n '" + _emberRouter.get("currentRoute.attributes.slug") + "'");
            } else {
                log("adding comments section failed for slug:\n '" + _emberRouter.get("currentRoute.attributes.slug") + "'");
            }
        } else {
            log("not on article page, doing nothing");
        }
    }

    _emberRouter.on('willTransition', trackPageChange);
    _emberRouter.on('didTransition', () => {
        if (!pageIsArticle()) {
            trackPageChange();
        }
        return true;
    });

    Ember.subscribe("render.component", {
        before(name, timestamp, payload) {},
        after(name, timestamp, payload, beganIndex) {
            switch (payload.containerKey) {
                case "component:head-content":
                    if (pageIsArticle()) {
                        _headContentAvailable = true;
                    }
                break;
                case "component:head-layout":
                    if (_headContentAvailable && !payload.initialRender && pageChanged()) {
                        init();
                    }
                break;
            }
        }
    });

    init(); //on the first pageload component:head-layout is rendered serverside, so init needs to be fired manually
}());
