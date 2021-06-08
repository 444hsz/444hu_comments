(function () {
    var config = {
        "default": {
            "top_button_insert_selector": "div.byline",
            "comments_section_insert_selector": "article footer.hide-print",
            "comments_section_html": getCommentsInnerHTMLBlog,
            "init_script": function() {
                require('blog/comment').default();
            }
        },
        "jo.444.hu": {
            "button_icon_inverted": true,
            "button_text_color": "#222"
        },
        "geekz.444.hu": {
            "comments_section_html": getCommentsInnerHTMLGeekz,
            "init_script": function() {
                require('blog/comment').default();
                let cd = document.querySelector("meta[itemprop='dateCreated']");
                if (null !== cd && new Date(cd.getAttribute('content')).getTime() > 1453379951779) {
                    window.disqus_shortname = 'geekzblog';
                }
            }
        }
    }

    function getConfig(key) {
        return (typeof config[window.location.hostname] !== "undefined" && typeof config[window.location.hostname][key] !== "undefined") ? config[window.location.hostname][key] : config["default"][key];
    }

    function log(msg, ret) {
        var tag = "%c[444comments]";
        if (ret) return tag + " " + msg;
        else console.debug(tag, "color: #29af0a;", msg);
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

        let bl = document.querySelector(getConfig("top_button_insert_selector"));
        if (null !== bl) {
            let cls = getConfig('button_icon_inverted') ? ' inverted' : '';
            bl.innerHTML = '<button class="gae-comment-click-open comments-toggle-top" title="Ugrás a hozzászólásokra"><img class="' + cls + '" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAKNHpUWHRSYXcgcHJvZmlsZSB0eXBlIGV4aWYAAHja7ZhZkhw5DkT/eYo5AneQxwE3s7nBHH8eGFmLpJoelXVbf7VSlREZEckFDjjc0+3//Pu4f/EvJckuF2m11+r5l3vuUTlp/vnX73vw+b4/H97uhR+vu/cbkUuJY3o+ir6eV66Xjy+8jzN+vO7a605sr4FeN94GTDZz5GR9XiTX43M95NdAfT8ntTf5vNQRn+N8PXiX8vpLcod+H8Q+u88XshClVXgqxbhTSJ73mF4rSPYXknKs973Ftys5ieNQUn2thID8sL23o/efA/RDkN/O3M/Rfz/7KfhRX9fTT7Gsrxhx8uWNUL4O/g3xp4nT+4rijzeO+PHLdl5/56x2zn52p7kS0frKKO/eonMHOYtBcrpfq7yEv8K53Ffn1bz6CTjLTyYcnPcQQeW4kMMKGk7Y9zjDZIk57igcY5zAYtdaktjjBKsARrzCiZJ6WqmB3IzbpcTl+L6WcOftd75J1i+/Ao/GwGCBr/zPl/ujm995uXOmhSj49h4r1hUtc1mGIWfvPAUg4bxwKzfAb68X/P5T/pCqIFhumBsbVD+eIUYJH7mVLs6J5wrHpyqCk/UagBAxd2ExIYGAryGVUIOXGCUE4tgASFl5TDkOEAilxMUiY06pRieRkmFuviPhPhtLrNEuw00AQQElAZueFLByLuSP5EYOaUkll1JqkdJc6UVrqrmWWqtUIzkVGE+KVBFp0kVbarmVVpu01nrTHnuCA0uvXXrrvatGp0ykjKU8r1wZcaSRRxl1yGijD52kz8yzzDplttmnrrjSgiZWXbLa6kt3cBum2HmXXbfstvvWQ66ddPIppx457fSj76i9UP3l9Q3Uwgu1eJGy5+QdNa46kbchgtFJMcxALOYA4mIIkNDRMPMt5BwNOcPM90hRlMgii2HjVjDEgDDvEMsJ79h9IPdbuLnSfgu3+P+QcwbdX4GcA7pfcfsCtWV9bl7Eniq0mPp07KLGpi4O9Tvec1rbp+PQcugrTXSxmKFMz057zCdMdr8XuzUylRh6FnFemLItkXWstrWfHO2sn7HyOPtAcfaZ0oo7d8MidWZhEyxUs92rMo87HdgO35ggJGc3wgQxN7vJaMdaLAWndjbOCowahu51Zljb75U4CZqzG1p3H6kwvZ8j9dFqHd0QXBNghW6oLTTIdq89yoS2B+FLq81cjSmaxJl3c9ViQgB2+CJOf3hMu3otoexZWK7TPiDy82NI4B9q4wbsi3vsk/7cx+q5EXlwGZsuMo5R1Tp+1Tb82qXPIxJ5hg4XKJCkPbSoUwbbk80apl8l8kyE+frqrYRcaEczc+S/iYmfjmXF02RYOLu0XmfMwwIJ9qmtWNKdaPjUrffvqTcFiqTChuWCtXOpA6j0LLYDHUetec82GqVmq5g3yeIt21VHcamQ0/lUMq0e0szIZYxArjD+0EbWU5nr2BprXmtuBrFK7b7clbd6D+6rHf3mkR3sxAYO8zTXJVPTc8+dWSiNfIcK+9caobc4/J6ewktetyddQ0l7GKBUmWhl04dYAGd0YzWyWfku7JBDErhjznQnpdRjezbg/cfxQkDDT6v2Hal/rSO5MakMIpGHVAaCcgyDqWm0BGXMaknCClqhtiiQedZWy0AWGNK9A/XAkBkgkBu9rLDWsllL6yt/O27udx8krv2EmkiM2kexxIBRSAwqkOgMN3vasWfkMBmnJAgMekYw3Imk6NwwXwyZmBwqdYuVMsmoMiHJdhIlotK381w1Jbeh913V6xJ/oGWchRDPmiBl+2bhO1koUwLbirUCFdIpytrhZF3u5uuCqjrzzwhvrB0V2kxEMuxLXERZC6W2pI0z40N8QfemkofVPp9dZiFjUcGx7i15pUIevHJ2fINZ3LcoiLSMMmva/qwMkwdlQWReT8UpMhej0majR7UwIcgE0cAzDUKFd8mk5W/IQKmmoJA6lETGEHsK9gSKNx1qjWLZvVsWrUmWQskTLYukrdZscwp7K/v3S6JcdniSAHa4SbBuEqBGBnUwYBqb1gNq94Bcm30M5X6KJAplRvBZ5RK+Xo4+IHjQaRsgggMFeVAoelE4DwrIDF0QSRgwTmt770vu8Hz/MoLuW6H+g6P7uj1YnztdDiV9en9a56Wdgm/IuAQUAWrG9yRtwq9HXIiDXKdNyA6D4m5jSLAoVFqvxSCrKY9q3IoWgnEYYdDLRk1Ukk2t1ifcXYSap/1zx38G+meg73wBkVO/Sl/3yl9qWE5tyKAFL0wTf0t0U9IL80NfRhqPa7/HrAEuGfBXVHRy0gG3T4ddqPRZXbcpIO/uzJrW/F7tuj9f/NQ4tOlgu5YvA8U4CmJoCZyEuvXdeuK7YPL+TTIZESx59C4lT/+f6BL3W6z1G0f3l7Da3zfQq4slb10sHeti2BAaAmfViN536+d99upqQDhIAGxrYEInsZ7/NLCyQyZpTDy0seOU20bqVWw0kgsBvX1ZI3FSUF3o7lY14JJWimbVMBJI6ZQ7bs/PrBPMyLi1TKF3xZXdDsa8omZaVnPWwvhcy/14rvezWtjnb0xIk1oNX4sr2C7WgYr1eINZ9TYWk2DVGnB6hWUlCwtqnKBgsfF/iB8WbKrnZiM6qLtccYgYEBRsIMp73F98wkR4zUdK0oGDtSINBKqZ0kWvFRRT2KUxjnlbXHYXJo1Ma8pAFqvEBq1xiyYU3Bd26BTU8NnpdbddZa3YZj+aCYyuSD8swUYs91FDP0WOhI25KoLMRR1nNlJjmymuURrGgo2EC/8JaEkGxB/twZ4dGn4PNeNyxp2JCE1lq9hDFtA19gKR5ZNwkSoYy8MMam7LdK41c3puWe4xwki+z1uSbPtd5pltv2bnsL31rmRCEUFiSsvDlSFd57C9E8wY1gSL+MmT+6JZCOcYWT121vIxYfv2fPfkJSJ00fr2a8TCV7hPTulPGCWzWS+zFPxCtdRhXunEuVOLuPxNMCMisODmvA5MYpZ0rJyvV6pmVa5X2q4/ZukVaO25kEklmUvsyO6bSAMH/DZ37bdJFJqEJavQJBJ1Wpxv4UjNr2sVb1Mm0n5iHqFitF9WkdEnHmMr3rIL2XLAsuLhlJVZ5rZQXBlzl5NT8Qyxd4lIWmRjY3tSQ7IetNG7JIg8Or4gOtVLHts3Cwh1hb5VtnbiwTqS/YtvaPSoaKxJHpFMBbsToQ37zcMi0soTEXJZLCD5yTzKxplrw7IDpP2EQXib/dqyvOzH1jH5Ho/R2/W6EOstJFxLsGRSC8jJrUNskeoOhEQRiJLqnihEdr9Go55qrqvGBO8FUrqObb+3fPxG8/ETjfv4jWb0GGLFaCKuG+U1I+VeG6X0IAbL+C8c7uvovr4Rpv1gTN9f/ikSVLsVCcU1zRs/BfT5nnu7KW0t+9lGegiTsNdMHdxMHbsPM9OBACRcX9z7k60ntxJ80xz1TNMwzNtVzQrT56x5jfGya721d01D7mKl3H8BxB7AoMAMfOcAAAGEaUNDUElDQyBwcm9maWxlAAB4nH2RPUjDQBzFX9Nqi1Qc2kHEIUN1siAq4ihVLIKF0lZo1cHk0i9oYkhSXBwF14KDH4tVBxdnXR1cBUHwA8TNzUnRRUr8X1JoEePBcT/e3XvcvQOEZo2pZmAcUDXLyCQTYr6wIgZf0YsQIoghIDFTT2UXcvAcX/fw8fUuzrO8z/05+pWiyQCfSDzLdMMiXiee3rR0zvvEUVaRFOJz4jGDLkj8yHXZ5TfOZYcFnhk1cpk54iixWO5iuYtZxVCJp4hjiqpRvpB3WeG8xVmt1Vn7nvyF4aK2nOU6zWEksYgU0hAho44qarAQp1UjxUSG9hMe/iHHnyaXTK4qGDnmsQEVkuMH/4Pf3ZqlyQk3KZwAel5s+2MECO4CrYZtfx/bdusE8D8DV1rHv9EEZj5Jb3S02BEwsA1cXHc0eQ+43AEGn3TJkBzJT1MolYD3M/qmAhC5BfpW3d7a+zh9AHLU1dINcHAIjJYpe83j3aHu3v490+7vB0NQcpRqNYaXAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH5QYIEy85k9BQkgAAAX9JREFUSMe1lj1rVFEQhp85uxgVP2rT+QNEsEwXf4GgNoJiCNja5H+4WIlVulRCUvgXFrVIIwgWakQxoEUgCrpkkyfNWblZzm7u3dx9YeBc5uMdZs6cuTAF6iV1Rd1Sdz2JHXVDva+eownUjrpaCDoJn9S7atQJfiVn3BRH6gt14bSS9D0bXhdLpoa6aTt4ViJ4bHsYqrerwS+o38eMPqrLWYYTAh1UbPbGdNtqGhE8Kji/rSQwiWBQsflV0C+nrH/AfHAvqeeBpTkRLCXgGnB5TgQ3ErDYwOEvsJLlTw37TmqY0TAi1iNiHRjUcegCP2rYfctl3GmY0GEX2AV+T+tDRFyfsQfvU0T8A/ozOAt01Td5Zq4WbPqjHmwUlLfU/TH5UCDZylLqyavRFK7WfGP2xyZ32iRvq6mbl8STmmVZUJ/n80Wgo/aAlL//NxdYi4gj1Ju2j171Je21HPzEwgn1HfAT+Ax8Ab4CD4E7M9yql8DTiBictpfT3JZ+278tx1Y4zfW4UPTWAAAAAElFTkSuQmCC"></button>' + bl.innerHTML;
            document.querySelector('.comments-toggle-top').style.color = getConfig("button_text_color");
            document.querySelector('.comments-toggle-top').addEventListener('click', () => {
                if (null !== document.querySelector(".comments-toggle")) document.querySelector(".comments-toggle").click();
                document.getElementById('comments').scrollIntoView();
            });
        }

        document.querySelector('.comments-docked-open>button').addEventListener('click', toggleDocked);
        document.querySelector('.comments-docked-close>a').addEventListener('click', toggleDocked);

        document.querySelector('.comments-docked-open>button').style.color = getConfig("button_text_color");
        document.querySelector(".comments-toggle").style.color = getConfig("button_text_color");
        document.querySelector(".comments-docked-title").style.color = getConfig("button_text_color");
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

    function getCommentsInnerHTMLGeekz() {
        var html =
        `<!-- comments -->
        <div class="comments-docked-resizer"><div></div></div>
        <div class="subhead">` +
            `<span class="logo bg-444comments-icon" title=""><span class="comments-docked-title">Hozzászólások</span></span>` +
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
            <button class="gae-comment-click-open comments-toggle bg-444comments-icon">Hozzászólások</button>
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
            `<span class="logo bg-444comments-icon" title=""><span class="comments-docked-title">Hozzászólások</span></span>` +
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
            <button class="gae-comment-click-open comments-toggle bg-444comments-icon">Hozzászólások</button>
            <div class="ad"><div id="444_aloldal_kommentek"></div></div>
            <div id="disqus_thread" class="freehand layout"></div>
        </div>`;
        return html;
    }

    function init() {
        let af = document.querySelector(getConfig("comments_section_insert_selector"));
        if (null === af) {
            log("not on article page, doing nothing");
        } else {
            log("article page detected");
            if (null !== document.getElementById("disqus_thread")) {
                log("comments enabled by 444.hu");
                document.getElementById("comments").innerHTML = getConfig("comments_section_html")();
            } else {
                log("comments disabled by 444.hu");
                af = document.querySelector(getConfig("comments_section_insert_selector"));
                af.innerHTML += '<section id="comments">' + getConfig("comments_section_html")() + '</section>';
            }

            addResizeBar();
            addDockButtons();
            getConfig("init_script")();
            log("comments section loaded");
        }
    }

    init();
}());
