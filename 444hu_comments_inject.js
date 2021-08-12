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
        _commentsLoaded = false,
        _commentsButtonTopEl = null,
        _defaultForumShortName = "444hu",
        _defaultUserForumShortName = "444hsz",
        _currentForumShortName = _defaultForumShortName,
        _userForumShortName = _defaultUserForumShortName,
        _parentEl = null,
        _headContentAvailable = false,
        _firstLoad = true;

    _commentsSectionEl.id = "comments";
    _commentsSectionEl.innerHTML =
        `<div class="comments-docked-resizer"><div></div></div>
        <div class="subhead">` +
            `<span class="logo bg-444comments-icon" title=""><span class="comments-docked-title">Kommentek</span></span>` +
            `<span class="comments-title">Uralkodj magadon!</span>` +
            `<span class="comments-docked-toggle">` + 
                `<span class="comments-docked-open">
                    <div class="slider-switch-wrapper"><label class="slider-switch" for="forumToggle2">Saját Disqus fórum<input type="checkbox" id="forumToggle2"><span class="slider round"></span></label></div>
                    <button id="settingsToggle" title="Beállítások"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"><path d="M24 13.616v-3.232c-1.651-.587-2.694-.752-3.219-2.019v-.001c-.527-1.271.1-2.134.847-3.707l-2.285-2.285c-1.561.742-2.433 1.375-3.707.847h-.001c-1.269-.526-1.435-1.576-2.019-3.219h-3.232c-.582 1.635-.749 2.692-2.019 3.219h-.001c-1.271.528-2.132-.098-3.707-.847l-2.285 2.285c.745 1.568 1.375 2.434.847 3.707-.527 1.271-1.584 1.438-3.219 2.02v3.232c1.632.58 2.692.749 3.219 2.019.53 1.282-.114 2.166-.847 3.707l2.285 2.286c1.562-.743 2.434-1.375 3.707-.847h.001c1.27.526 1.436 1.579 2.019 3.219h3.232c.582-1.636.75-2.69 2.027-3.222h.001c1.262-.524 2.12.101 3.698.851l2.285-2.286c-.744-1.563-1.375-2.433-.848-3.706.527-1.271 1.588-1.44 3.221-2.021zm-12 2.384c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4z"/></svg></button>
                    <button id="sidebarToggle" title="Oldalsáv"><svg class="flipped" height="19px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g fill="#ffffff" fill-rule="nonzero"><path d="M19.25,4 C20.7688,4 22,5.23122 22,6.75 L22,6.75 L22,17.25 C22,18.7688 20.7688,20 19.25,20 L19.25,20 L4.75,20 C3.23122,20 2,18.7688 2,17.25 L2,17.25 L2,6.75 C2,5.23122 3.23122,4 4.75,4 L4.75,4 Z M19.25,5.5 L9,5.5 L9,18.5 L19.25,18.5 C19.9404,18.5 20.5,17.9404 20.5,17.25 L20.5,6.75 C20.5,6.05964 19.9404,5.5 19.25,5.5 Z"></path></g></g></svg></button>
                </span>` +
                `<span class="comments-docked-close comments-docked-hidden"><a><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAALCAYAAACprHcmAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAADxJREFUeNpi+A8BaUDMgAeD5BEMPBrg8gwENKCI45TAZgADHpMwbMLrRnQ5sk0m2s1EhwZJ4Ux0DAIEGABDKYzoRdlxEwAAAABJRU5ErkJggg=="></a></span>` +
            `</span>
        </div>
        <div class="comments-settings bg-444comments-icon hide">
            <div class="ext-wrapper">
                <div title="Bezár" class="close-button"><svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 24 24" width="20px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg></div>
                <div class="title">Kommentszekció beállítások</div>
                <div class="wrapper">
                    <div class="slider-switch-wrapper"><label class="slider-switch" for="autoloadToggle">Kommentek auto-betöltése<input type="checkbox" id="autoloadToggle"><span class="slider round"></span></label></div>
                    <div class="slider-switch-wrapper"><label class="slider-switch" for="rulesToggle">Kommentelési szabályok<input type="checkbox" id="rulesToggle" checked><span class="slider round"></span></label></div>
                    <div class="slider-switch-wrapper"><label class="slider-switch" for="recommendationsToggle">Disqus ajánlások<input type="checkbox" id="recommendationsToggle"><span class="slider round"></span></label></div>
                    <div class="slider-switch-wrapper">
                        <label class="slider-switch" for="forumToggle">Saját Disqus fórum<input type="checkbox" id="forumToggle"><span class="slider round"></span></label>
                        <ul><li><label class="" for="userForumShortName">Disqus shortname:<span><input type="text" id="userForumShortName" placeholder="444hsz"></span></label></li></ul>
                    </div>
                </div>
            </div>
        </div>
        <div class="comments-contents">
            <div class="forum-rules">
                <div title="Bezár" class="close-button"><svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 24 24" width="20px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg></div>
                <ul class="bg-444comments-icon">
                    <b>
                        (Ezt üzenetet azért látod itt, mert telepítetted a "444 hozzászólások" Chrome extension-t.)<br/><br/>
                        ---<br/><br/>
                        Mélyen tisztelt kommentelők!<br/><br/>
                        Én a fent említett extension fejlesztője vagyok, ez pedig egy szolgálati közlemény lenne.<br/><br/>
                        A mai napon, 2021. augusztus 12-én a 444 teljesen megszüntette a szabad kommentelést a felületen, így ezentúl már csak a Kör tagsággal rendelkező előfizetők szólhatnak hozzá a cikkekhez. A whitelist halott.<br/><br/>
                        Az időzítés váratlan, de nem meglepő, mivel ezt a lépést már korábban bejelentették. Ezért aztán az extension-be néhány verzióval ezelőtt beépítettem egy "saját disqus fórum" funkciót, aminek a segítségével tetszőleges, a 444-től független disqus fórumban kommentelhetők a cikkek. A funkciót a mai nappal élesítettem, ezzel kapcsolatban pedig a következők a tudnivalók:<br/><br/>
                        <li>A hivatalos 444 disqus, és a saját disqus közötti átváltás a toolbaron (URALKODJ MAGADON felirat mellett jobbra) elhelyezett kapcsolóval történik.</li>
                        <li>A kapcsoló állását megjegyzi a böngésző, tehát nem kell minden cikknél átkapcsolni.</li>
                        <li>Az alapértelmezett saját disqus fórum a "444hsz", amit én hoztam létre a szabad kommentelés fenntartása végett.</li>
                        <li>A saját disqus fórum megváltoztatható a Kommentszekció beállításokban (toolbaron fogaskerék ikon).</li>
                        <br/>Üdv,<br/>
                        nerblock (disqus: @nerblock)
                    </b>
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

    function setCookie(name, value, days = 3650) {
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
            if (!_commentsLoaded) {
                _commentsLoaded = true;
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
                Ember.getOwner = function() { return { lookup: function() { return { get: function() { return _currentForumShortName; }}}}}
                lc.loadComments.perform();
                Ember.getOwner = go;
                this.classList.add('hide');
            }
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

            let ss = document.evaluate("//script[@src='https://" + _currentForumShortName + ".disqus.com/embed.js']", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
            if (ss.snapshotLength) {
                for (let i = 0; i < ss.snapshotLength; i++) {
                    let s = ss.snapshotItem(i);
                    s.remove();
                }
            }

            _commentsLoaded = false;
        }

        function onClickforumToggle() {
            unloadDisqus();
            _currentForumShortName = this.checked ? _userForumShortName : _defaultForumShortName;
            document.querySelector('.comments-settings input#forumToggle').checked = this.checked;
            document.querySelector('.comments-docked-open input#forumToggle2').checked = this.checked;
            setCookie("_444comments_user_forum_enabled", +this.checked);
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
            setCookie("_444comments_hide_rules2", 1);
            document.querySelector('.comments-settings label>input#rulesToggle').checked = false;
        }

        function onClickToggleSettings() {
            document.querySelector(".comments-settings").classList.toggle('hide');
        }

        function onClickRulesToggle() {
            document.querySelector(".comments-contents .forum-rules").classList.toggle('hide');
            setCookie("_444comments_hide_rules2", +!this.checked);
        }

        function onClickAutoloadToggle() {
            setCookie("_444comments_autoload_comments", +this.checked);
        }

        function initRecommendationsToggle() {
            function addHideStyle() {
                var style = document.createElement('style');
                style.id = "recommendationsToggleStyle";
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
            if (null == document.querySelector("#recommendationsToggleStyle")) {
                addHideStyle();
            }
        }

        function onChangeUserForumShortname() {
            _userForumShortName = this.value ? this.value : _defaultUserForumShortName;
            setCookie("_444comments_user_forum_shortname", _userForumShortName);
        }

        function onKeypressUserForumShortname(e) {
            return /[a-z\d-]/.test(e.key);
        }

        document.querySelector(".comments-toggle").onclick = onClickCommentsButton;
        if (insertTopCommentsButton()) {
            document.querySelector(".comments-toggle-top").onclick = onClickTopCommentsButton;
        }

        document.querySelector('.comments-docked-open>button#sidebarToggle').onclick = onClickSidebarToggle;
        document.querySelector('.comments-docked-close>a').onclick = onClickSidebarToggle;

        document.querySelector('.comments-settings .close-button').onclick = onClickToggleSettings;
        document.querySelector('.comments-docked-open>button#settingsToggle').onclick = onClickToggleSettings;
        document.querySelector('.comments-settings input#forumToggle').onclick = onClickforumToggle;
        document.querySelector('.comments-settings input#forumToggle').checked = !(_currentForumShortName === _defaultForumShortName);
        document.querySelector('.comments-docked-open input#forumToggle2').onclick = onClickforumToggle;
        document.querySelector('.comments-docked-open input#forumToggle2').checked = !(_currentForumShortName === _defaultForumShortName);

        document.querySelector('.comments-contents .forum-rules .close-button').onclick = onClickCloseRules;
        document.querySelector('.comments-settings input#rulesToggle').onclick = onClickRulesToggle;

        document.querySelector('.comments-settings input#autoloadToggle').onclick = onClickAutoloadToggle;

        document.querySelector('.comments-settings input#userForumShortName').onchange = onChangeUserForumShortname;
        document.querySelector('.comments-settings input#userForumShortName').onkeypress = onKeypressUserForumShortname;

        initRecommendationsToggle();
    }

    function applySettings() {
        if (getCookie("_444comments_user_forum_shortname")) {
            _userForumShortName = getCookie("_444comments_user_forum_shortname");
            document.querySelector('.comments-settings input#userForumShortName').value = _userForumShortName == _defaultUserForumShortName ? "" : _userForumShortName;
        }

        if (getCookie("_444comments_user_forum_enabled") == 1) {
            document.querySelector('.comments-settings input#forumToggle').checked = true;
            document.querySelector('.comments-docked-open input#forumToggle2').checked = true;
            _currentForumShortName = _userForumShortName;
        }

        if (getCookie("_444comments_hide_rules2") == 1) {
            document.querySelector(".comments-contents .forum-rules").classList.add('hide');
            document.querySelector('.comments-settings input#rulesToggle').checked = false;
        }

        if (getCookie("_444comments_show_disqus_recommendations") == 1) {
            document.querySelector('.comments-settings input#recommendationsToggle').click();
        }

        if (getCookie("_444comments_autoload_comments") == 1) {
            document.querySelector('.comments-settings input#autoloadToggle').checked = true;
            document.querySelector(".comments-toggle").click();
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

        _commentsLoaded = false;

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
                    if (_headContentAvailable && !payload.initialRender) {
                        if (_firstLoad || pageChanged()) {
                            _firstLoad = false;
                            init();
                        }
                    }
                break;
            }
        }
    });
}());
