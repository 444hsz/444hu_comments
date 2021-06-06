(function () {
    var _emberApp = Ember.A(Ember.Namespace.NAMESPACES).filter(n => {return n.name === 'n3'})[0],
        _emberRouter = _emberApp.__container__.lookup('router:main'),
        _lastSlug = _emberRouter.currentRoute.attributes.slug,
        _commentsSectionEl = document.createElement("section"),
        _parentEl = null;

    _commentsSectionEl.id = "comments";
    _commentsSectionEl.innerHTML =
        `<div class="comments-docked-resizer"><div></div></div>
        <div class="subhead">` +
            `<span class="logo" title=""><span class="comments-docked-title">Hozzászólások</span></span>` +
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
            <button class="gae-comment-click-open comments-toggle">Hozzászólások</button>
            <div class="ad"><div id="444_aloldal_kommentek"></div></div>
            <div id="disqus_thread" class="freehand layout"></div>
        </div>`;

    function log(msg, ret) {
        var tag = "[444comments]";
        if (ret) return tag + " " + msg;
        else console.debug(tag, msg);
    }

    function pageChanged() {
        return _lastSlug !== _emberRouter.currentRoute.attributes.slug;
    }

    function trackPageChange() {
        _lastSlug = _emberRouter.currentRoute.attributes.slug;
    }

    function pageIsArticle() {
        return _emberRouter.currentRouteName === "--reader.post";
    }

    function scrollToHash() {
        if (window.location.hash.startsWith('#comment')) {
            document.querySelector(".comments-toggle").click();
            document.getElementById('comments').scrollIntoView();
        }
    }

    function initSidebar() {
        function initResize(e) {
            e.preventDefault();
            document.body.style.pointerEvents = "none";
            ce.classList.toggle("dragged");
            window.addEventListener('mousemove', Resize, false);
            window.addEventListener('mouseup', stopResize, false);
        }

        function Resize(e) {
            e.preventDefault();
            var w = document.body.clientWidth - e.clientX;
            if (w >= 335) {
                ce.style.width =  w + 'px';
                re.style.right =  (w - 8) + 'px';
            }
        }

        function stopResize(e) {
            e.preventDefault();
            window.removeEventListener('mousemove', Resize, false);
            window.removeEventListener('mouseup', stopResize, false);
            document.body.style.pointerEvents = "";
            ce.classList.toggle("dragged");
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

        var ce = document.querySelector("section#comments");
        var re = document.querySelector("section#comments .comments-docked-resizer");
        re.addEventListener('mousedown', initResize, false);
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
            let el = document.querySelector('[style="--avatar-width: 40px; --avatar-height: 40px;"]');
            el.style.setProperty("--avatar-width", "194px");
            el.style.setProperty("background", "none");
            el.innerHTML = '<div><button class="gae-comment-click-open comments-toggle-top">Hozzászólások</button></div>' + el.innerHTML;
        }

        insertTopCommentsButton();

        document.querySelector(".comments-toggle").onclick = onClickCommentsButton;
        document.querySelector(".comments-toggle-top").onclick = onClickTopCommentsButton;
    }

    function initCommentsSection() {
        _parentEl.insertBefore(_commentsSectionEl.cloneNode(true), _parentEl.childNodes[0]);
    }

    function reset() {
        if (typeof DISQUS !== "undefined") {
            DISQUS.reset();
            DISQUS_RECOMMENDATIONS.reset();
        }

        let el = document.querySelector("#ap-article-footer1");
        if (null !== el) {
            _parentEl = el.parentElement;
            _parentEl.childNodes[0].remove();
        }
    }

    function init() {
        if (pageIsArticle()) {
            log("on article page");
            reset();
            initCommentsSection();
            initSidebar();
            initButtons();
            scrollToHash();
            log("comments section loaded");
        } else {
            log("not on article page, doing nothing");
        }
    }

    _emberRouter.on('willTransition', trackPageChange);

    Ember.subscribe("render.component", {
        before(name, timestamp, payload) {},
        after(name, timestamp, payload, beganIndex) {
            if (payload.containerKey == "component:head-layout" && !payload.initialRender && pageChanged()) {
                init();
            }
        }
    });

    init();
}());