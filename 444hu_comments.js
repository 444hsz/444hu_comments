var loaded444comments = false;
document.addEventListener('DOMContentLoaded', function () {
    // only run once (fix for kepek.444.hu)
    if (loaded444comments) return;
    else loaded444comments = true;

    function getDisqusSlug() {
        var path = window.location.pathname.split("/");
        var slug = path[path.length - 1];
        return slug.replace(/-/g, "_").substr(0, 100);
    }

    function addDockButtons() {
        function toggleDocked() {
            document.getElementById('comments').classList.toggle('docked-comments');
            document.querySelector('.comments-docked-open').classList.toggle('comments-docked-hidden');
            document.querySelector('.comments-docked-close').classList.toggle('comments-docked-hidden');
            document.querySelector('.comments-docked-disqus').classList.toggle('comments-docked-hidden');
            document.getElementById('comments').style.width = 'var(--docked-comments-width)';
            document.querySelector("section#comments .comments-docked-resizer").style.right = "calc(var(--docked-comments-width) - var(--docked-comments-resizer-width))";
            if (null !== document.querySelector(".comments-toggle")) document.querySelector(".comments-toggle").click();
        }

        document.querySelector("#headline div.byline").innerHTML = '<div><button class="gae-comment-click-open comments-toggle-top">Hozzászólások</button></div>' + document.querySelector("#headline div.byline").innerHTML;
        document.querySelector("section#comments div.subhead").innerHTML +=
        `<span class="comments-docked-toggle">
            <span class="comments-docked-open">Hozzászólások panel<svg xmlns="http://www.w3.org/2000/svg" version="1.1" preserveAspectRatio="xMidYMid" class="icon icon-chevron-down"><use xlink:href="/assets/blog/static/icon-defs.svg#icon-chevron-down"></use></svg></span>
            <span class="comments-docked-disqus comments-docked-hidden" title="Megnyitás Disqus-on"><a href="https://disqus.com/home/discussion/444hu/` + getDisqusSlug() + `" target="_blank"><svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="external-link-alt" class="svg-inline--fa fa-external-link-alt fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M432,320H400a16,16,0,0,0-16,16V448H64V128H208a16,16,0,0,0,16-16V80a16,16,0,0,0-16-16H48A48,48,0,0,0,0,112V464a48,48,0,0,0,48,48H400a48,48,0,0,0,48-48V336A16,16,0,0,0,432,320ZM488,0h-128c-21.37,0-32.05,25.91-17,41l35.73,35.73L135,320.37a24,24,0,0,0,0,34L157.67,377a24,24,0,0,0,34,0L435.28,133.32,471,169c15,15,41,4.5,41-17V24A24,24,0,0,0,488,0Z"></path></svg></a></span>
            <span class="comments-docked-close comments-docked-hidden" title="Panel bezárása"><svg class="icon icon-close" viewBox="0 0 805 1024"><path class="path1" d="M62.857 755.429q0-22.857 16-38.857l168-168-168-168q-16-16-16-38.857t16-38.857l77.714-77.714q16-16 38.857-16t38.857 16l168 168 168-168q16-16 38.857-16t38.857 16l77.714 77.714q16 16 16 38.857t-16 38.857l-168 168 168 168q16 16 16 38.857t-16 38.857l-77.714 77.714q-16 16-38.857 16t-38.857-16l-168-168-168 168q-16 16-38.857 16t-38.857-16l-77.714-77.714q-16-16-16-38.857z"></path></svg></span>
        </span>`;
        document.querySelector('.comments-docked-open').addEventListener('click', toggleDocked);
        document.querySelector('.comments-docked-close').addEventListener('click', toggleDocked);
        document.querySelector('.comments-toggle-top').addEventListener('click', toggleDocked);
    }

    function addResizeBar() {
        var ce = document.querySelector("section#comments");
        ce.innerHTML = '<div class="comments-docked-resizer"><img src="data:image/png;base64,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"></div>' + ce.innerHTML;
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
            if (w > 260) {
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
        script.textContent = "window.addEventListener('load', () => {require('blog/comment').default();});";
        (document.head || document.documentElement).prepend(script);
    }

    function init() {
        addResizeBar();
        addDockButtons();
        initCommentButton();
    }

    function getCommentsInnerHTML() {
        var html =
        `<div class="subhead">
            <span class="logo"><a href="https://chrome.google.com/webstore/detail/444hu-comments/lbeeoakjnfiejomcokohmfbfblbhjllo" title="Powered by 444comments" target="_blank"><img src="data:image/png;base64,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"></a></span>
            <span>Uralkodj magadon!</span>
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

    // only run on article pages
    var af = document.querySelector("article footer.hide-print");
    if (null === af) return;

    if (null !== document.getElementById("disqus_thread")) {
        document.getElementById("comments").innerHTML = getCommentsInnerHTML();
        console.debug("[444comments] comments enabled by 444.hu");
    } else {
        af.innerHTML += '<section id="comments"><!-- comments -->' + getCommentsInnerHTML() + '</section>';
        console.debug("[444comments] comments enabled by extension");
    }

    init();
});
