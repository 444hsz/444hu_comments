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
            document.querySelector('.comments-toggle-top>svg').classList.toggle('opened');
            document.getElementById('comments').style.width = 'var(--docked-comments-width)';
            document.querySelector("section#comments .comments-docked-resizer").style.right = "calc(var(--docked-comments-width) - var(--docked-comments-resizer-width))";
            if (null !== document.querySelector(".comments-toggle")) document.querySelector(".comments-toggle").click();
        }

        document.querySelector("#headline div.byline").innerHTML = '<div><button class="gae-comment-click-open comments-toggle-top">Hozzászólások<svg xmlns="http://www.w3.org/2000/svg" version="1.1" preserveAspectRatio="xMidYMid" class="icon icon-chevron-down"><use xlink:href="/assets/blog/static/icon-defs.svg#icon-chevron-down"></use></svg></button></div>' + document.querySelector("#headline div.byline").innerHTML;
        document.querySelector('.comments-docked-open').addEventListener('click', toggleDocked);
        document.querySelector('.comments-docked-close').addEventListener('click', toggleDocked);
        document.querySelector('.comments-toggle-top').addEventListener('click', toggleDocked);
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
        var html = `
        <div class="comments-docked-resizer"><div></div></div>
        <div class="subhead">
            <span class="logo"><a href="https://chrome.google.com/webstore/detail/444hu-comments/lbeeoakjnfiejomcokohmfbfblbhjllo" title="Powered by 444comments" target="_blank"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAadJREFUeNqsUz1Iw0AYfZcf01qpUtDBwT9QsKJT0UFEUHBQcBFKcXNycurq4OBccHIVQTehgquLDoIU7CKiCKIdBCtIxba2TXJ+aU8bA4lR/OCRd/cu7+57lzBOhWYlCSnbGFUTUjyt792/IqFIwOdqiTXX0FRGwg9FL2omZ1MWZ8KAEco6bWI05ggxBf7KKNeA5TEJi4MMmgzcvADbFybuChwtdBwJfp3o/L1hoK+d4eCaYzjCsDUrI6Q0NN9GIgs8lzhSGRObZwZ6hLFu/sEooDBMdjMsDUn1nJ5KgEwh+cmoKjxg5RTWgJ0FGYUKsH5ikBGvZ+Zl1ELoolsK1EwoGq3cveRI3xp1MU8GlllQZORlNEI4VSWw+X4zuH/FKu8GN0vFuqZQO2ok8NVx1suIDoyQRdZiKhJRxGnnrNBWCBuCPxLmnEYVGy/ahc5W5OjxIIYFRwRvTqNVwozgHQ5NtfEjQk5wujfozPGvedUE4dxN/NV35FVWa4cumtXatIs2QBgVvEw4htWZC6L8e43btKRtPk9o82ot6KHVbNwKm/9bRh8CDADn9bpULKctqQAAAABJRU5ErkJggg=="></a></span>
            <span>Uralkodj magadon!</span>
            <span class="comments-docked-toggle">
                <span class="comments-docked-open">Hozzászólások panel<svg xmlns="http://www.w3.org/2000/svg" version="1.1" preserveAspectRatio="xMidYMid" class="icon icon-chevron-down"><use xlink:href="/assets/blog/static/icon-defs.svg#icon-chevron-down"></use></svg></span>
                <span class="comments-docked-disqus comments-docked-hidden" title="Megnyitás Disqus-on"><a href="https://disqus.com/home/discussion/444hu/` + getDisqusSlug() + `" target="_blank"><svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="external-link-alt" class="svg-inline--fa fa-external-link-alt fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M432,320H400a16,16,0,0,0-16,16V448H64V128H208a16,16,0,0,0,16-16V80a16,16,0,0,0-16-16H48A48,48,0,0,0,0,112V464a48,48,0,0,0,48,48H400a48,48,0,0,0,48-48V336A16,16,0,0,0,432,320ZM488,0h-128c-21.37,0-32.05,25.91-17,41l35.73,35.73L135,320.37a24,24,0,0,0,0,34L157.67,377a24,24,0,0,0,34,0L435.28,133.32,471,169c15,15,41,4.5,41-17V24A24,24,0,0,0,488,0Z"></path></svg></a></span>
                <span class="comments-docked-close comments-docked-hidden" title="Panel bezárása"><svg height="512px" id="Layer_1" version="1.1" viewBox="0 0 512 512" width="512px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M443.6,387.1L312.4,255.4l131.5-130c5.4-5.4,5.4-14.2,0-19.6l-37.4-37.6c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4  L256,197.8L124.9,68.3c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4L68,105.9c-5.4,5.4-5.4,14.2,0,19.6l131.5,130L68.4,387.1  c-2.6,2.6-4.1,6.1-4.1,9.8c0,3.7,1.4,7.2,4.1,9.8l37.4,37.6c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1L256,313.1l130.7,131.1  c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1l37.4-37.6c2.6-2.6,4.1-6.1,4.1-9.8C447.7,393.2,446.2,389.7,443.6,387.1z"/></svg></span>
            </span>
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
