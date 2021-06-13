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
        _commentsSectionTempEl = null,
        _commentsSectionInsertMethod = 0,
        _commentsButtonTopEl = null,
        _forumShortName = "444hu",
        _parentEl = null,
        _headContentAvailable = false;

    _commentsSectionEl.id = "comments";
    _commentsSectionEl.innerHTML =
        `<div class="comments-docked-resizer"><div></div></div>
        <div class="subhead">` +
            `<span class="logo bg-444comments-icon" title=""><span class="comments-docked-title">Kommentek</span></span>` +
            `<span class="comments-title">Uralkodj magadon!</span>` +
            `<span class="comments-docked-toggle">` + 
                `<span class="comments-docked-open"><label class="slider-switch" for="forumToggle">444hsz<input type="checkbox" id="forumToggle"><span class="slider round"></span></label><button id="sidebarToggle" title="Oldalsáv">◨</button></span>` +
                `<span class="comments-docked-close comments-docked-hidden"><a><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAALCAYAAACprHcmAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAADxJREFUeNpi+A8BaUDMgAeD5BEMPBrg8gwENKCI45TAZgADHpMwbMLrRnQ5sk0m2s1EhwZJ4Ux0DAIEGABDKYzoRdlxEwAAAABJRU5ErkJggg=="></a></span>` +
            `</span>
        </div>
        <div class="comments-contents">
            <div>
                <ul class="forum-rules" id="444hu_forum_rules">
                    <li><b>Új kommentelési szabályok érvényesek 2019. december 2-től.</b> <a href="https://444.hu/2019/12/02/valtoznak-a-kommenteles-szabalyai-a-444-en" target="_blank">Itt olvashatod el</a>, hogy mik azok, és <a href="https://444.hu/2019/12/02/ezert-valtoztatunk-a-kommenteles-szabalyain" target="_blank">itt azt</a>, hogy miért vezettük be őket.</li>
                    <li>A 444-en előmoderálás működik, tehát a kommentek egy része csak azután jelenik meg mindenki számára láthatóan, hogy a moderátor jóváhagyta.</li>
                    <li>A legaktívabb kommentelőkből, akik a hozzászólások 90 százalékát írják, létrehoztunk egy szabadlistát (white list). Az ő hozzászólásaik hamarabb megjelennek a cikkek alatt, de a szabályokat nekik is be kell tartaniuk.
                    Aki azt gondolja, hogy ő is ilyen aktív kommentelő, de nem került fel első körben a szabadlistára, az küldje el a Disqus profiljának a linkjét a <a href="mailto:whitelist@444.hu">whitelist@444.hu</a> emailre, és ha január 21. után egy hónap alatt legalább 30 jóváhagyott hozzászólása van, akkor hozzáadjuk.</li>
                </ul>
            </div>
            <button class="gae-comment-click-open comments-toggle bg-444comments-icon">Kommentek mutatása</button>
            <div class="ad"><div id="444_aloldal_kommentek"></div></div>
            <div id="disqus_thread" class="freehand layout"></div>
        </div>`;

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

    function pageIsFociArticle() {
        return _emberRouter.currentRouteName == "foci--reader.post";
    }

    function scrollToHash() {
        if (window.location.hash.startsWith('#comment')) {
            document.querySelector(".comments-toggle").click();
            document.getElementById('comments').scrollIntoView();
        }
    }

    function getDisqusUrl() {
        let url = document.URL;
        if (pageIsFociArticle()) {
            let d = _emberRouter.get("currentRoute.attributes.date");
            if (d && new Date(d) < new Date("2021-06-09")) {
                // convert thread urls to the old address format for older articles
                // last thread on foci.444.hu was: https://foci.444.hu/2021/06/08/gol-nelkuli-foproba-az-eb-elott
                url = url.replace("444.hu/foci/", "foci.444.hu/");
                log("Disqus URL converted to old format: " + url);
            }
        }
        return url;
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

        _re.addEventListener('mousedown', initResize, false);
    }

    function initButtons() {
        function onClickCommentsButton() {
            window.disqus_url = getDisqusUrl();
            let dc = require('disqus/components/disqus-comments'),
                lc = new dc.default(),
                go = Ember.getOwner;
            lc.args = {
                identifier: null,
                url: window.disqus_url,
                title: null,
                categoryId: null
            };
            Ember.getOwner = function() { return { lookup: function() { return { get: function() { return _forumShortName; }}}}}
            lc.loadComments.perform();
            Ember.getOwner = go;
            this.classList.add('hide');
        }
    
        function onClickTopCommentsButton() {
            document.querySelector(".comments-toggle").click();
            document.getElementById("comments").scrollIntoView();
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

        function unloadDisqus() {
            delete window.DISQUS;
            delete window.DISQUS_RECOMMENDATIONS;
            delete window.disqus_config;
            delete window.disqus_recommendations_config;

            let ss = document.evaluate("//script[@src='https://" + _forumShortName + ".disqus.com/embed.js']", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
            if (ss.snapshotLength) {
                for (let i = 0; i < ss.snapshotLength; i++) {
                    let s = ss.snapshotItem(i);
                    s.remove();
                }
            }
        }

        function onClickforumToggle() {
            unloadDisqus();
            _forumShortName = this.checked ? "444hsz" : "444hu";
            document.querySelector(".comments-toggle").click();
        }

        function insertTopCommentsButton() {
            _commentsButtonTopEl = document.createElement("div");
            _commentsButtonTopEl.innerHTML = '<button class="gae-comment-click-open comments-toggle-top">Kommentek</button>';

            let p;
            switch (_commentsSectionInsertMethod) {
                case 0:
                    if (p = document.querySelector('[style="--avatar-width: 40px; --avatar-height: 40px;"]')) {
                        p.style.setProperty("--avatar-width", "180px");
                        p.style.setProperty("background", "none");
                        p.insertBefore(_commentsButtonTopEl, p.firstElementChild);
                        return true;
                    } else {
                        log("failed to insert top comments button");
                    }
                    break;
                case 1:
                case 3:
                    if (p = document.getElementById("toolbar-dropdown-target")) {
                        p.nextElementSibling.insertBefore(_commentsButtonTopEl, p.nextElementSibling.firstElementChild.nextElementSibling);
                        _commentsButtonTopEl.className = p.nextElementSibling.firstElementChild.className;
                        return true;
                    } else {
                        log("failed to insert top comments button");
                    }
                    break;
            }
            _commentsButtonTopEl = null;
            return false;
        }

        document.querySelector(".comments-toggle").onclick = onClickCommentsButton;
        if (insertTopCommentsButton()) {
            document.querySelector(".comments-toggle-top").onclick = onClickTopCommentsButton;
        }
        document.querySelector('.comments-docked-open>button#sidebarToggle').onclick = onClickSidebarToggle;
        document.querySelector('.comments-docked-close>a').onclick = onClickSidebarToggle;
        document.querySelector('.comments-docked-open>label>input#forumToggle').onclick = onClickforumToggle;
        document.querySelector('.comments-docked-open>label>input#forumToggle').checked = !(_forumShortName === "444hu");
    }

    function initCommentsSection() {
        _commentsSectionTempEl = _commentsSectionEl.cloneNode(true);
        switch (_commentsSectionInsertMethod) {
            case 0:
                _parentEl.insertBefore(_commentsSectionTempEl, _parentEl.firstElementChild);
                break;
            case 1:
            case 3:
                _parentEl.insertBefore(_commentsSectionTempEl, null);
                _commentsSectionTempEl.className = _parentEl.firstElementChild.className;
                break;
            case 2:
                _parentEl.insertBefore(_commentsSectionTempEl, null);
                _commentsSectionTempEl.className = _commentsSectionTempEl.previousElementSibling.className;
                break;
        }

    }

    function reset() {
        if (typeof DISQUS !== "undefined") DISQUS.reset();
        if (typeof DISQUS_RECOMMENDATIONS !== "undefined") DISQUS_RECOMMENDATIONS.reset();

        let el;
        if (el = document.querySelector("#ap-article-footer1")) { // normal article
            _commentsSectionInsertMethod = 0;
            _parentEl = el.parentElement;
        }
        else if (el = document.querySelector("aside")) { // livereport list
            _commentsSectionInsertMethod = 1;
            _parentEl = el.previousElementSibling.firstElementChild;
        }
        else if (el = document.querySelector("article > div > footer")) { // livereport single item
            _commentsSectionInsertMethod = 2;
            _parentEl = el.parentElement.parentElement;
        }
        else if (el = document.querySelector("#toolbar-dropdown-target")) { // livereport list with rendered no sidebar
            _commentsSectionInsertMethod = 3;
            _parentEl = el.nextElementSibling.lastElementChild.firstElementChild.firstElementChild;
        }

        if (null !== el) {
            log("Insert method: " + _commentsSectionInsertMethod);
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

            _headContentAvailable = false;

            let btns = document.evaluate("//button[contains(., 'Kommentek mutatása')]", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null );
            if (btns.snapshotLength) {
                for (let i = 0; i < btns.snapshotLength; i++) {
                    let btn = btns.snapshotItem(i);
                    if (!btn.classList.contains('comments-toggle')) {
                        btn.remove();
                        log("Article commentable: yes");
                        break;
                    }
                }
            } else {
                log("Article commentable: no");
            }
            return true;
        }
        return false;
    }

    function init() {
        console.group("%c[444comments]", "color: #29af0a;", "log");
        if (pageIsArticle()) {
            if (reset()) {
                initCommentsSection();
                initSidebar();
                initButtons();
                scrollToHash();
                //trackPageChange(); //TODO: maybe uncomment this after 444 fixed the duplicate head-layout rendering issue
                log("Added comments section for: '" + _emberRouter.get("currentRoute.attributes.slug") + "'");
            } else {
                log("Failed to add comments section for: '" + _emberRouter.get("currentRoute.attributes.slug") + "'");
            }
        } else {
            log("not on article page, doing nothing");
        }
        console.groupEnd();
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
