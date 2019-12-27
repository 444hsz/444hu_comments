document.addEventListener('DOMContentLoaded', function () {
    // article check
    var af = document.querySelector("article footer.hide-print");
    if (null == af) {
        return;
    }

    // comments enabled check
    if (null !== document.getElementById("disqus_thread")) {
        console.debug("[444comments] comments enabled by 444.hu");
        return;
    }

    // readd comments html
    af.innerHTML +=
    '<section id="comments"><!-- comments -->' +
        '<div class="subhead"><span>Uralkodj magadon!</span></div>' +
        '<div>' +
            '<b>Új kommentelési szabályok érvényesek 2019. december 2-től.</b>' +
            '<a href="https://444.hu/2019/12/02/valtoznak-a-kommenteles-szabalyai-a-444-en" target="_blank">Itt olvashatod el</a>, hogy mik azok, és <a href="https://444.hu/2019/12/02/ezert-valtoztatunk-a-kommenteles-szabalyain" target="_blank">itt azt</a>, hogy miért vezettük be őket.' +
        '</div>' +
        '<button class="gae-comment-click-open comments-toggle">Hozzászólások</button>' +
        '<div class="ad"><div id="444_aloldal_kommentek"></div></div>' +
        '<div id="disqus_thread" class="freehand layout"></div>' +
    '</section>';

    console.debug("[444comments] comments enabled by extension");
});

var script = document.createElement('script');
script.textContent = "window.addEventListener('load', () => {require('blog/comment').default()});";
(document.head || document.documentElement).prepend(script);
