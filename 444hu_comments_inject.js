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
                `<span class="comments-docked-open">
                    <button id="settingsToggle" title="Beállítások"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"><path d="M24 13.616v-3.232c-1.651-.587-2.694-.752-3.219-2.019v-.001c-.527-1.271.1-2.134.847-3.707l-2.285-2.285c-1.561.742-2.433 1.375-3.707.847h-.001c-1.269-.526-1.435-1.576-2.019-3.219h-3.232c-.582 1.635-.749 2.692-2.019 3.219h-.001c-1.271.528-2.132-.098-3.707-.847l-2.285 2.285c.745 1.568 1.375 2.434.847 3.707-.527 1.271-1.584 1.438-3.219 2.02v3.232c1.632.58 2.692.749 3.219 2.019.53 1.282-.114 2.166-.847 3.707l2.285 2.286c1.562-.743 2.434-1.375 3.707-.847h.001c1.27.526 1.436 1.579 2.019 3.219h3.232c.582-1.636.75-2.69 2.027-3.222h.001c1.262-.524 2.12.101 3.698.851l2.285-2.286c-.744-1.563-1.375-2.433-.848-3.706.527-1.271 1.588-1.44 3.221-2.021zm-12 2.384c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4z"/></svg></button>
                    <button id="sidebarToggle" title="Oldalsáv"><svg class="flipped" height="19px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g fill="#ffffff" fill-rule="nonzero"><path d="M19.25,4 C20.7688,4 22,5.23122 22,6.75 L22,6.75 L22,17.25 C22,18.7688 20.7688,20 19.25,20 L19.25,20 L4.75,20 C3.23122,20 2,18.7688 2,17.25 L2,17.25 L2,6.75 C2,5.23122 3.23122,4 4.75,4 L4.75,4 Z M19.25,5.5 L9,5.5 L9,18.5 L19.25,18.5 C19.9404,18.5 20.5,17.9404 20.5,17.25 L20.5,6.75 C20.5,6.05964 19.9404,5.5 19.25,5.5 Z"></path></g></g></svg></button>
                </span>` +
                `<span class="comments-docked-close comments-docked-hidden"><a><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAALCAYAAACprHcmAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAADxJREFUeNpi+A8BaUDMgAeD5BEMPBrg8gwENKCI45TAZgADHpMwbMLrRnQ5sk0m2s1EhwZJ4Ux0DAIEGABDKYzoRdlxEwAAAABJRU5ErkJggg=="></a></span>` +
            `</span>
        </div>
        <div class="comments-settings bg-444comments-icon hide">
            <div class="ext-wrapper">
                <div title="Elrejtés" class="close-button"><svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 24 24" width="20px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg></div>
                <div class="title">Kommentszekció beállítások</div>
                <div class="wrapper">
                    <div class="slider-switch-wrapper"><label class="slider-switch" for="rulesToggle">Kommentelési szabályok<input type="checkbox" id="rulesToggle" checked><span class="slider round"></span></label></div>
                    <div class="slider-switch-wrapper"><label class="slider-switch" for="recommendationsToggle">Disqus ajánlások<input type="checkbox" id="recommendationsToggle"><span class="slider round"></span></label></div>
                    <div class="slider-switch-wrapper">
                        <label class="slider-switch" for="forumToggle">Alternatív Disqus fórum<input type="checkbox" id="forumToggle"><span class="slider round"></span></label>
                        <p>Az alternatív fórum a közeljövőben be&shy;ve&shy;ze&shy;tés&shy;re kerülő, csak a 444 támogatói kör számára el&shy;ér&shy;he&shy;tő, fizetős kommentelés alternatívájának lett lét&shy;re&shy;hoz&shy;va. Itt nincs elő&shy;mo&shy;de&shy;rá&shy;ció, white&shy;list és paywall, csak szabad kom&shy;men&shy;tel&shy;és. A funkció egyelőre experi&shy;men&shy;tá&shy;lisnak tekintendő.</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="comments-contents">
            <div class="forum-rules">
                <div title="Elrejtés" class="close-button"><svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 24 24" width="20px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg></div>
                <ul>
                    <li><b>Új kommentelési szabályok érvényesek 2019. december 2-től.</b> <a href="https://444.hu/2019/12/02/valtoznak-a-kommenteles-szabalyai-a-444-en" target="_blank">Itt olvashatod el</a>, hogy mik azok, és <a href="https://444.hu/2019/12/02/ezert-valtoztatunk-a-kommenteles-szabalyain" target="_blank">itt azt</a>, hogy miért kerültek bevezetésre.</li>
                    <li>A 444-en előmoderálás működik, tehát a kommentek egy része csak azután jelenik meg mindenki számára láthatóan, hogy a moderátor jóváhagyta.</li>
                    <li>A legaktívabb kommentelőkből a 444 létrehozott egy szabadlistát (whitelist). Az ő hozzászólásaik előmoderáció nélkül megjelennek a cikkek alatt, de a szabályokat nekik is be kell tartaniuk.
                    Aki azt gondolja, hogy ő is ilyen aktív kommentelő, az küldje el a Disqus profiljának a linkjét a <a href="mailto:whitelist@444.hu">whitelist@444.hu</a> emailre, és ha egy hónap alatt legalább 30 jóváhagyott hozzászólása van, akkor hozzáadják.</li>
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

    function setCookie(name, value, days) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days*24*60*60*1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "")  + expires + "; path=/";
    }

    function getCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
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
            document.querySelector(".comments-settings").classList.add('hide');
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

            if (null !== document.querySelector("#disqus_recommendations")) document.querySelector("#disqus_recommendations").remove();

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

        function onClickCloseRules() {
            this.parentElement.classList.add('hide');
            setCookie("_444comments_hide_rules", 1);
            document.querySelector('.comments-settings label>input#rulesToggle').checked = false;
        }

        function onClickToggleSettings() {
            document.querySelector(".comments-settings").classList.toggle('hide');
        }

        function onClickRulesToggle() {
            document.querySelector(".comments-contents .forum-rules").classList.toggle('hide');
            setCookie("_444comments_hide_rules", +!this.checked);
        }

        function initRecommendationsToggle() {
            function addHideStyle() {
                var style = document.createElement('style');
                style.id = "recommendationsToggleStyle";
                //style.innerHTML = '#disqus_recommendations { display: none; }';
                style.innerHTML = '#disqus_recommendations { visibility: hidden; height: 0; }';
                document.getElementsByTagName('head')[0].appendChild(style);
            }

            function onClickRecommendationsToggle() {
                if (null !== document.querySelector("#recommendationsToggleStyle")) {
                    document.querySelector("#recommendationsToggleStyle").remove();
                    setCookie("_444comments_show_disqus_recommendations", 1);
                } else {
                    addHideStyle();
                    setCookie("_444comments_show_disqus_recommendations", 0);
                }
            }

            document.querySelector('.comments-settings label>input#recommendationsToggle').onclick = onClickRecommendationsToggle;
            addHideStyle();
        }

        document.querySelector(".comments-toggle").onclick = onClickCommentsButton;
        if (insertTopCommentsButton()) {
            document.querySelector(".comments-toggle-top").onclick = onClickTopCommentsButton;
        }

        document.querySelector('.comments-docked-open>button#sidebarToggle').onclick = onClickSidebarToggle;
        document.querySelector('.comments-docked-close>a').onclick = onClickSidebarToggle;

        document.querySelector('.comments-settings .close-button').onclick = onClickToggleSettings;
        document.querySelector('.comments-docked-open>button#settingsToggle').onclick = onClickToggleSettings;
        document.querySelector('.comments-settings label>input#forumToggle').onclick = onClickforumToggle;
        document.querySelector('.comments-settings label>input#forumToggle').checked = !(_forumShortName === "444hu");

        document.querySelector('.comments-contents .forum-rules .close-button').onclick = onClickCloseRules;
        document.querySelector('.comments-settings label>input#rulesToggle').onclick = onClickRulesToggle;

        initRecommendationsToggle();
    }

    function applySettings() {
        if (getCookie("_444comments_hide_rules") == 1) {
            document.querySelector(".comments-contents .forum-rules").classList.add('hide');
            document.querySelector('.comments-settings label>input#rulesToggle').checked = false;
            log("hide rules");
        }

        if (getCookie("_444comments_show_disqus_recommendations") == 1) {
            document.querySelector('.comments-settings label>input#recommendationsToggle').click();
            log("show recommend");
        }
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
                applySettings();
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
