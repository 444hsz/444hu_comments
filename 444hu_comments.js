var loaded444comments = false;
document.addEventListener('DOMContentLoaded', function () {
    // only run once (fix for kepek.444.hu)
    if (loaded444comments) return;
    else loaded444comments = true;

    function addDockButtons() {
        function toggleDocked() {
            document.getElementById('comments').classList.toggle('docked-comments');
            document.querySelector('.comments-docked-open').classList.toggle('comments-docked-hidden');
            document.querySelector('.comments-docked-close').classList.toggle('comments-docked-hidden');
            document.getElementById('comments').style.width = 'var(--docked-comments-width)';
            document.querySelector("section#comments .comments-docked-resizer").style.right = "calc(var(--docked-comments-width) - var(--docked-comments-resizer-width))";
            if (null !== document.querySelector(".comments-toggle"))
                document.querySelector(".comments-toggle").click();
        }

        document.querySelector("#headline div.byline").innerHTML =
            '<div><button class="gae-comment-click-open comments-toggle-top">Hozzászólások</button></div>' +
            document.querySelector("#headline div.byline").innerHTML;

        document.querySelector("section#comments div.subhead").innerHTML +=
            `<span class="comments-docked-toggle">
                <span class="comments-docked-close comments-docked-hidden">bezár<svg xmlns="http://www.w3.org/2000/svg" version="1.1" preserveAspectRatio="xMidYMid" class="icon icon-close"><use xlink:href="/assets/blog/static/icon-defs.svg#icon-close"></use></svg></span>
                <span class="comments-docked-open">Hozzászólások panel<svg xmlns="http://www.w3.org/2000/svg" version="1.1" preserveAspectRatio="xMidYMid" class="icon icon-chevron-down"><use xlink:href="/assets/blog/static/icon-defs.svg#icon-chevron-down"></use></svg></span>
            </span>`;
        document.querySelector('.comments-docked-open').addEventListener('click', toggleDocked);
        document.querySelector('.comments-docked-close').addEventListener('click', toggleDocked);
        document.querySelector('.comments-toggle-top').addEventListener('click', toggleDocked);
    }

    function addResizeBar() {
        var ce = document.querySelector("section#comments");
        ce.innerHTML = '<div class="comments-docked-resizer"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAABkCAYAAABOx/oaAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAIVJREFUeNrs1jEKwCAMBVCt6CjO4v2P4yWc9AYqYocWC34LQoc6mCXwEkjIFGqtreQKemdykCfqCFuhR/KGdbrzB2SMIXLOEWOMiN57ROccYggBMaWEKISY3HPBe27cuHHjF8w5I5ZSEKWUiFprRGMMolJqcqXh9CGufWQ61Ul7bO/BKcAAgRIiMqCaF2AAAAAASUVORK5CYII="></div>' + ce.innerHTML;
        var re = document.querySelector("section#comments .comments-docked-resizer");
        re.addEventListener('mousedown', initResize, false);

        function initResize(e) {
            e.preventDefault();
            document.getElementById("disqus_thread").style.pointerEvents = "none";
            document.getElementById("content-main").style.pointerEvents = "none";
            ce.classList.toggle("dragged");
            window.addEventListener('mousemove', Resize, false);
            window.addEventListener('mouseup', stopResize, false);
        }
        function Resize(e) {
            e.preventDefault();
            var w = document.body.clientWidth - e.clientX;
            if (w > 250) {
                ce.style.width =  w + 'px';
                re.style.right =  (w - 8) + 'px';
            }
        }
        function stopResize(e) {
            window.removeEventListener('mousemove', Resize, false);
            window.removeEventListener('mouseup', stopResize, false);
            document.getElementById("disqus_thread").style.pointerEvents = "";
            document.getElementById("content-main").style.pointerEvents = "";
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

    function patchCommentsHtml() {
        document.getElementById("comments").innerHTML = 
            '<div class="subhead">' + 
                '<span class="logo"><img src="data:image/png;base64,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"></span>' +
                '<span>Uralkodj magadon!</span>' +
            '</div>' +
            '<div class="comments-contents">' +
                '<div>' +
                    '<b>Új kommentelési szabályok érvényesek 2019. december 2-től.</b>' +
                    '<a href="https://444.hu/2019/12/02/valtoznak-a-kommenteles-szabalyai-a-444-en" target="_blank">Itt olvashatod el</a>, hogy mik azok, és <a href="https://444.hu/2019/12/02/ezert-valtoztatunk-a-kommenteles-szabalyain" target="_blank">itt azt</a>, hogy miért vezettük be őket.' +
                '</div>' +
                '<button class="gae-comment-click-open comments-toggle">Hozzászólások</button>' +
                '<div class="ad"><div id="444_aloldal_kommentek"></div></div>' +
                '<div id="disqus_thread" class="freehand layout"></div>' +
            '</div>';
    }

    function addCommentsHtml() {
        af.innerHTML +=
        '<section id="comments"><!-- comments -->' +
            '<div class="subhead">' + 
                '<span class="logo"><img src="data:image/png;base64,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"></span>' +
                '<span>Uralkodj magadon!</span>' +
            '</div>' +
            '<div class="comments-contents">' +
                '<div>' +
                    '<b>Új kommentelési szabályok érvényesek 2019. december 2-től.</b>' +
                    '<a href="https://444.hu/2019/12/02/valtoznak-a-kommenteles-szabalyai-a-444-en" target="_blank">Itt olvashatod el</a>, hogy mik azok, és <a href="https://444.hu/2019/12/02/ezert-valtoztatunk-a-kommenteles-szabalyain" target="_blank">itt azt</a>, hogy miért vezettük be őket.' +
                '</div>' +
                '<button class="gae-comment-click-open comments-toggle">Hozzászólások</button>' +
                '<div class="ad"><div id="444_aloldal_kommentek"></div></div>' +
                '<div id="disqus_thread" class="freehand layout"></div>' +
            '</div>' +
        '</section>';
    }

    // only run on article pages
    var af = document.querySelector("article footer.hide-print");
    if (null === af) return;

    if (null !== document.getElementById("disqus_thread")) {
        patchCommentsHtml();
        console.debug("[444comments] comments enabled by 444.hu");
    } else {
        addCommentsHtml();
        console.debug("[444comments] comments enabled by extension");
    }

    init();
});
