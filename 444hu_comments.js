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

    function getConfig() {
        return {
            "sites":{
                "default": {
                    "enable_comments": true,
                    "disqus_link": true,
                    "top_button_insert_selector": "div.byline"
                },
                "444.hu": {},
                "tldr.444.hu": {},
                "jo.444.hu": {},
                "geekz.444.hu": {
                    "disqus_link": false,
                }
            }
        }
    }

    function getCurrentHostConfigFor(key) {
        var cfg = getConfig();
        if (typeof cfg.sites[window.location.hostname] !== "undefined" && typeof cfg.sites[window.location.hostname][key] !== "undefined")
            return cfg.sites[window.location.hostname][key];
        else
            return cfg.sites["default"][key];
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

        if (!getCurrentHostConfigFor("disqus_link")) {
            document.querySelector('.comments-docked-disqus').classList.toggle('comments-docked-disabled');
        }

        var bl = document.querySelector(getCurrentHostConfigFor("top_button_insert_selector"));
        if (null !== bl) {
            bl.innerHTML = '<div><button class="gae-comment-click-open comments-toggle-top">Hozzászólások<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAYAAAA71pVKAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAE5JREFUeNqkk0kOACAIA6n//3ONVxUthSNkJoQFJGOLlUAIMZI8O7AkGJ86O/BToMCpQIWvggp8CKowXBhu23AHBndVcI8E7nlKXzUFGACznQsbX5fhcQAAAABJRU5ErkJggg=="></button></div>' + bl.innerHTML;
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
            <span class="comments-docked-title">Uralkodj magadon!</span>
            <span class="comments-docked-toggle">` + 
                `<span class="comments-docked-open">Hozzászólások panel<svg xmlns="http://www.w3.org/2000/svg" version="1.1" preserveAspectRatio="xMidYMid" class="icon icon-chevron-down"><use xlink:href="/assets/blog/static/icon-defs.svg#icon-chevron-down"></use></svg></span>` + 
                `<span class="comments-docked-disqus comments-docked-hidden"><a title="Megnyitás Disqus-on" href="https://disqus.com/home/discussion/444hu/` + getDisqusSlug() + `" target="_blank"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAALCAYAAACprHcmAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAEZJREFUeNpi/A8EDAjAyIAKkOUYWHAoQtcM1sTEQBj8h2liIlYhIcX/0ZzHyESkQrwmY/UwMR4kS/F/kkxmwRZTuABAgAEAgGoMFyGkJ9wAAAAASUVORK5CYII="></a></span>` +
                `<span class="comments-docked-close comments-docked-hidden"><a href="javascript:void(0)"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAALCAYAAACprHcmAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAE5JREFUeNqEj0kOACAIxKD//zNqYozKxg1oA6M2S0RU+jI2aB24OHZTCecy1zASnhf5lrfgshCc1QjMYMsyUPzoBLIwkUABOoEGfIQhwAAGWRgSNi2CNgAAAABJRU5ErkJggg=="></a></span>` +
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
