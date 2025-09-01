(function () {
  var config = {
    default: {
      top_button_insert_selector: "div.byline",
      comments_section_insert_selector: "article footer.hide-print",
      comments_section_html: getCommentsInnerHTMLBlog(),
      init_script: function () {
        window.disqus_shortname = "444hsz";
        require("blog/comment").default();
      },
    },
    "jo.444.hu": {
      button_text_color: "#222",
    },
    "geekz.444.hu": {
      comments_section_html: getCommentsInnerHTMLGeekz(),
      init_script: function () {
        require("blog/comment").default();
        let cd = document.querySelector("meta[itemprop='dateCreated']");
        if (
          null !== cd &&
          new Date(cd.getAttribute("content")).getTime() > 1453379951779
        ) {
          window.disqus_shortname = "geekzblog";
        } else {
          window.disqus_shortname = "444hsz";
        }
      },
    },
  };

  function getConfig(key) {
    return typeof config[window.location.hostname] !== "undefined" &&
      typeof config[window.location.hostname][key] !== "undefined"
      ? config[window.location.hostname][key]
      : config["default"][key];
  }

  function log(msg, ret) {
    var tag = "%c[444hsz]";
    if (ret) return tag + " " + msg;
    else console.debug(tag, "color: #29af0a;", msg);
  }

  function addDockButtons() {
    function toggleDocked() {
      document.getElementById("comments").classList.toggle("docked-comments");
      document
        .querySelector(".comments-docked-open")
        .classList.toggle("comments-docked-hidden");
      document
        .querySelector(".comments-docked-close")
        .classList.toggle("comments-docked-hidden");
      document.getElementById("comments").style.width =
        "var(--docked-comments-width)";
      document.querySelector(
        "section#comments .comments-docked-resizer"
      ).style.right =
        "calc(var(--docked-comments-width) - var(--docked-comments-resizer-width))";
      if (null !== document.querySelector(".comments-toggle"))
        document.querySelector(".comments-toggle").click();
    }

    let bl = document.querySelector(getConfig("top_button_insert_selector"));
    if (null !== bl) {
      let tmp = new DOMParser()
        .parseFromString(
          '<button class="gae-comment-click-open comments-toggle-top">Hozzászólások</button>',
          `text/html`
        )
        .getElementsByTagName(`body`)[0].children;
      bl.prepend(...tmp);
      tmp = null;

      document.querySelector(".comments-toggle-top").style.color =
        getConfig("button_text_color");
      document
        .querySelector(".comments-toggle-top")
        .addEventListener("click", () => {
          if (null !== document.querySelector(".comments-toggle"))
            document.querySelector(".comments-toggle").click();
          document.getElementById("comments").scrollIntoView();
        });
    }

    document
      .querySelector(".comments-docked-open>button")
      .addEventListener("click", toggleDocked);
    document
      .querySelector(".comments-docked-close>a")
      .addEventListener("click", toggleDocked);

    document.querySelector(".comments-docked-open>button").style.color =
      getConfig("button_text_color");
    document.querySelector(".comments-toggle").style.color =
      getConfig("button_text_color");
    document.querySelector(".comments-docked-title").style.color =
      getConfig("button_text_color");
  }

  function addResizeBar() {
    var ce = document.querySelector("section#comments");
    var re = document.querySelector(
      "section#comments .comments-docked-resizer"
    );
    re.addEventListener("mousedown", initResize, false);

    function initResize(e) {
      e.preventDefault();
      document.body.style.pointerEvents = "none";
      ce.classList.toggle("dragged");
      document.addEventListener("mousemove", Resize, false);
      document.addEventListener("mouseup", stopResize, false);
    }
    function Resize(e) {
      e.preventDefault();
      var w = document.body.clientWidth - e.clientX;
      if (w >= 335) {
        ce.style.width = w + "px";
        re.style.right = w - 8 + "px";
      }
    }
    function stopResize(e) {
      e.preventDefault();
      document.removeEventListener("mousemove", Resize, false);
      document.removeEventListener("mouseup", stopResize, false);
      document.body.style.pointerEvents = "";
      ce.classList.toggle("dragged");
    }
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
            <!--<div>
                <b>Új kommentelési szabályok érvényesek 2019. december 2-től.</b>
                <a href="https://444.hu/2019/12/02/valtoznak-a-kommenteles-szabalyai-a-444-en" target="_blank">Itt olvashatod el</a>, hogy mik azok, és <a href="https://444.hu/2019/12/02/ezert-valtoztatunk-a-kommenteles-szabalyain" target="_blank">itt azt</a>, hogy miért vezettük be őket.
            </div>-->
            <button class="gae-comment-click-open comments-toggle">Hozzászólások</button>
            <div class="ad"><div id="444_aloldal_kommentek"></div></div>
            <div id="disqus_thread" class="freehand layout"></div>
        </div>`;
    return html;
  }

  function init() {
    let af = document.querySelector(
      getConfig("comments_section_insert_selector")
    );
    if (null === af) {
      log("not on article page, doing nothing");
    } else {
      log("article page detected");
      if (null !== document.getElementById("disqus_thread")) {
        log("comments enabled by 444.hu");
        let tmp = new DOMParser()
          .parseFromString(getConfig("comments_section_html"), `text/html`)
          .getElementsByTagName(`body`)[0].children;
        let cel = document.getElementById("comments");
        cel.innerText = "";
        cel.append(...tmp);
        tmp = null;
      } else {
        log("comments disabled by 444.hu");
        let tmp = new DOMParser()
          .parseFromString(
            '<section id="comments">' +
              getConfig("comments_section_html") +
              "</section>",
            `text/html`
          )
          .getElementsByTagName(`body`)[0].children;
        af.append(...tmp);
        tmp = null;
      }

      addResizeBar();
      addDockButtons();
      getConfig("init_script")();
      log("comments section loaded");
    }
  }

  init();
})();
