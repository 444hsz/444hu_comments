var loaded444comments = false;
document.addEventListener('DOMContentLoaded', function () {
    // only run once (fix for kepek.444.hu)
    if (loaded444comments) return;
    else loaded444comments = true;

    function log(msg, ret) {
        var tag = "[" + chrome.runtime.getManifest().short_name + "]";
        if (ret) return tag + " " + msg;
        else console.debug(tag, msg);
    }

    function getDisqusSlug() {
        var path = window.location.pathname.replace(/\/+$/, "").split("/");
        var slug = path[path.length - 1];
        return slug.replace(/-/g, "_").substr(0, 100);
    }

    function getConfig(key) {
        var cfg = {
            "sites":{
                "default": {
                    "disqus_forum_name": "444hu",
                    "top_button_insert_selector": "div.byline"
                },
                "geekz.444.hu": {
                    "disqus_forum_name": "geekzblog"
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
            document.querySelector('.comments-docked-disqus').classList.toggle('comments-docked-hidden');
            document.querySelector('.comments-toggle-top').classList.toggle('opened');
            document.getElementById('comments').style.width = 'var(--docked-comments-width)';
            document.querySelector("section#comments .comments-docked-resizer").style.right = "calc(var(--docked-comments-width) - var(--docked-comments-resizer-width))";
            if (null !== document.querySelector(".comments-toggle")) document.querySelector(".comments-toggle").click();
        }

        var bl = document.querySelector(getCurrentHostConfigFor("top_button_insert_selector"));
        if (null !== bl) {
            bl.innerHTML = '<div><button class="gae-comment-click-open comments-toggle-top">Hozzászólások<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAYAAAA71pVKAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAEhJREFUeNpi+P//PwMaTsMihhVjE/xPrAG4NBNlAD7NBA0gpBmvAcRoxmkAsZqxGkCKZgwD6GJzGt1DO43uKYzstE10rgIIMACk+NdFeq8++wAAAABJRU5ErkJggg=="></button></div>' + bl.innerHTML;
        }

        document.querySelector('.comments-docked-open').addEventListener('click', toggleDocked);
        document.querySelector('.comments-docked-close').addEventListener('click', toggleDocked);
        document.querySelector('.comments-toggle-top').addEventListener('click', toggleDocked);
        document.querySelector('.comments-toggle-top').addEventListener('click', () => { document.getElementById('comments').scrollIntoView(); });
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
            if (w > 300) {
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

    function initCommentButton() {
        // init comments button after load
        var script = document.createElement('script');
        script.textContent = "window.addEventListener('load', () => {console.debug('" + log("initialized", true) + "');require('blog/comment').default();});";
        (document.head || document.documentElement).prepend(script);
    }

    function init() {
        addResizeBar();
        addDockButtons();
        initCommentButton();
    }

    function getCommentsInnerHTML() {
        var mf = chrome.runtime.getManifest();
        var html = `
        <div class="comments-docked-resizer"><div></div></div>
        <div class="subhead">` +
            `<span class="logo"><a href="https://chrome.google.com/webstore/detail/444hu-comments/lbeeoakjnfiejomcokohmfbfblbhjllo" title="v` + chrome.runtime.getManifest().version + `" target="_blank"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAAPCAYAAACx+QwLAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAFpJREFUeNpi/A8EDAjACKWJFcMF6KkWrxgTwzAHox4c9eCoBwcWsFDBjMFQuo4m0dEkiif5DJTa0RiExSC2DMw4SN3LSKoYCwntO0YSkhWt1I62RUdcHgQIMADPlRkjQbOuPAAAAABJRU5ErkJggg=="><span class="comments-docked-title">Hozzászólások</span></a></span>` +
            `<span class="comments-title">Uralkodj magadon!</span>` +
            `<span class="comments-docked-toggle">` + 
                `<span class="comments-docked-open">Hozzászólások panel<svg xmlns="http://www.w3.org/2000/svg" version="1.1" preserveAspectRatio="xMidYMid" class="icon icon-chevron-down"><use xlink:href="/assets/blog/static/icon-defs.svg#icon-chevron-down"></use></svg></span>` + 
                `<span class="comments-docked-disqus comments-docked-hidden"><a title="Topic megnyitása Disqus-on" href="https://disqus.com/home/discussion/` + getCurrentHostConfigFor("disqus_forum_name") + '/' + getDisqusSlug() + `" target="_blank"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAALCAYAAACprHcmAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAFZJREFUeNqUkQEKwDAIA+Pwrdmb9lpXaWGds7IeiGAiooo18CB4M2vQkU/keDNbXL21Qx+QBCfdKjODtjQzq6/M6TQtFvtwYIO/Zj+faSiUSPhgyS3AAFOjnhIuz2DAAAAAAElFTkSuQmCC"></a></span>` +
                `<span class="comments-docked-close comments-docked-hidden"><a href="javascript:void(0)"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAALCAYAAACprHcmAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAADxJREFUeNpi+A8BaUDMgAeD5BEMPBrg8gwENKCI45TAZgADHpMwbMLrRnQ5sk0m2s1EhwZJ4Ux0DAIEGABDKYzoRdlxEwAAAABJRU5ErkJggg=="></a></span>` +
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

    var af = document.querySelector("article footer.hide-print");
    if (null === af) {
        // only run on article pages
        log("no article found, doing nothing");
    } else {
        if (null !== document.getElementById("disqus_thread")) {
            log("comments enabled by 444.hu");
            document.getElementById("comments").innerHTML = getCommentsInnerHTML();
        } else {
            log("comments disabled by 444.hu");
            af.innerHTML += '<section id="comments"><!-- comments -->' + getCommentsInnerHTML() + '</section>';
        }
        init();
    }
});
