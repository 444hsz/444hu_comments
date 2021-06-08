(function () {
    function log(msg, ret) {
        var tag = "%c[444comments]";
        if (ret) return tag + " " + msg;
        else console.debug(tag, "color: #29af0a;", msg);
    }

    function getConfig(key) {
        var cfg = {
            "sites":{
                "default": {
                    "top_button_insert_selector": "div.byline",
                    "comments_section_insert_selector": "article footer.hide-print",
                    "comments_section_html": getCommentsInnerHTMLBlog(),
                    "init_script": function() {
                        require('blog/comment').default();
                    }
                },
                "jo.444.hu": {
                    "button_text_color": "#222"
                },
                "geekz.444.hu": {
                    "comments_section_html": getCommentsInnerHTMLGeekz(),
                    "init_script": function() {
                        require('blog/comment').default();
                        let cd = document.querySelector("meta[itemprop='dateCreated']");
                        if (null !== cd && new Date(cd.getAttribute('content')).getTime() > 1453379951779) {
                            window.disqus_shortname = 'geekzblog';
                        }
                    }
                }
            }
        }
        if (null !== key) return cfg[key];
        else return cfg;
    }

    function getCurrentHostConfigFor(key) {
        var sites = getConfig("sites");
        if (typeof sites[window.location.hostname] !== "undefined" && typeof sites[window.location.hostname][key] !== "undefined")
            return sites[window.location.hostname][key];
        else
            return sites["default"][key];
    }

    function addDockButtons() {
        function toggleDocked() {
            document.getElementById('comments').classList.toggle('docked-comments');
            document.querySelector('.comments-docked-open').classList.toggle('comments-docked-hidden');
            document.querySelector('.comments-docked-close').classList.toggle('comments-docked-hidden');
            document.getElementById('comments').style.width = 'var(--docked-comments-width)';
            document.querySelector("section#comments .comments-docked-resizer").style.right = "calc(var(--docked-comments-width) - var(--docked-comments-resizer-width))";
            if (null !== document.querySelector(".comments-toggle")) document.querySelector(".comments-toggle").click();
        }

        let bl = document.querySelector(getCurrentHostConfigFor("top_button_insert_selector"));
        if (null !== bl) {
            bl.innerHTML = '<div><button class="gae-comment-click-open comments-toggle-top">Hozzászólások</button></div>' + bl.innerHTML;
            document.querySelector('.comments-toggle-top').style.color = getCurrentHostConfigFor("button_text_color");
            document.querySelector('.comments-toggle-top').addEventListener('click', () => {
                if (null !== document.querySelector(".comments-toggle")) document.querySelector(".comments-toggle").click();
                document.getElementById('comments').scrollIntoView();
            });
        }

        document.querySelector('.comments-docked-open>button').addEventListener('click', toggleDocked);
        document.querySelector('.comments-docked-close>a').addEventListener('click', toggleDocked);

        document.querySelector('.comments-docked-open>button').style.color = getCurrentHostConfigFor("button_text_color");
        document.querySelector(".comments-toggle").style.color = getCurrentHostConfigFor("button_text_color");
        document.querySelector(".comments-docked-title").style.color = getCurrentHostConfigFor("button_text_color");
    }

    function addResizeBar() {
        var ce = document.querySelector("section#comments");
        var re = document.querySelector("section#comments .comments-docked-resizer");
        re.addEventListener('mousedown', initResize, false);

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
    }

    function injectInitScript() {
        // init comments button after load
        var script = document.createElement('script');
        (document.head || document.documentElement).prepend(script);
        script.textContent =
        `window.addEventListener('pageshow', () => {
            ` + getCurrentHostConfigFor("init_script")() + `
            if (window.location.hash.startsWith('#comment')) {
                document.querySelector(".comments-toggle").click();
                document.getElementById('comments').scrollIntoView();
            }
            console.debug('` + log("comments section loaded", true) + `');
        });`;
    }

    function getCommentsInnerHTMLGeekz() {
        var html =
        `<!-- comments -->
        <div class="comments-docked-resizer"><div></div></div>
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
                <b>A Geekz kommentszabályzata:</b>
                Csak témába vágó kommenteket várunk! A politikai tartalmú, sértő, személyeskedő és trollkodó, illetve a témához nem kapcsolódó hozzászólásokat figyelmeztetés nélkül töröljük! A többszörös szabályszegőket bannoljuk a Geekzről/444-ről!
            </div>
            <button class="gae-comment-click-open comments-toggle">Hozzászólások</button>
            <div class="ad"><div id="444_aloldal_kommentek"></div></div>
            <div id="disqus_thread" class="freehand layout"></div>
        </div>`;
        return html;
    }

    function getCommentsInnerHTMLBlog() {
        var html =
        `<!-- comments -->
        <div class="comments-docked-resizer"><div></div></div>
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
        return html;
    }

    function init() {
        let af = document.querySelector(getCurrentHostConfigFor("comments_section_insert_selector"));
        if (null === af) {
            log("not on article page, doing nothing");
        } else {
            log("article page detected");
            if (null !== document.getElementById("disqus_thread")) {
                log("comments enabled by 444.hu");
                document.getElementById("comments").innerHTML = getCurrentHostConfigFor("comments_section_html");
            } else {
                log("comments disabled by 444.hu");
                af = document.querySelector(getCurrentHostConfigFor("comments_section_insert_selector"));
                af.innerHTML += '<section id="comments">' + getCurrentHostConfigFor("comments_section_html") + '</section>';
            }

            addResizeBar();
            addDockButtons();
            getCurrentHostConfigFor("init_script")();
        }
    }

    init();
}());
