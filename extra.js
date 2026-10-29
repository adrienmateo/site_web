(function () {
  var root = document.documentElement;
  var calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 3. Carrousel d'images ---------- */
  var SLIDES = [
    ["f1-gp.jpg", "f1", "Duel de rythme F1", "Le Grand Prix en un coup d'œil", "The Grand Prix at a glance"],
    ["f1-duels.jpg", "f1", "Duel de rythme F1", "Duels de pilotes", "Driver duels"],
    ["f1-moments.jpg", "f1", "Duel de rythme F1", "Moments clés de la course", "Key race moments"],
    ["make-f1.png", "f1", "Duel de rythme F1", "Scénario Make du compte rendu", "Make scenario for the recap"],
    ["wf-retour.jpg", "backlog", "Du besoin au backlog", "Wireframe : créer un retour", "Wireframe: create a return"],
    ["wf-connexion.jpg", "backlog", "Du besoin au backlog", "Wireframe : connexion", "Wireframe: sign-in"],
    ["wf-liste-sav.jpg", "backlog", "Du besoin au backlog", "Wireframe : liste SAV", "Wireframe: support list"],
    ["site-hero.jpg", "site", "Ce site", "Page d'accueil", "Home page"]
  ];
  function buildCarousel() {
    var list = document.getElementById("work-list"); if (!list || document.getElementById("carousel")) return;
    var en = (root.lang || "fr").indexOf("en") === 0;
    var c = document.createElement("div"); c.className = "carousel reveal in"; c.id = "carousel";
    c.innerHTML = '<div class="car-track" id="car-track">' + SLIDES.map(function (s, i) {
      var n = (i < 9 ? "0" : "") + (i + 1);
      return '<button type="button" class="car-item" data-project="' + s[1] + '" aria-label="' + s[2] + " : " + (en ? s[4] : s[3]) + '">' +
        '<div class="car-img"><img src="' + s[0] + '" alt="" loading="lazy"></div>' +
        '<div class="car-cap"><span class="n">N° ' + n + '</span><div><b>' + s[2] + '</b> <span>· ' + (en ? s[4] : s[3]) + "</span></div></div></button>";
    }).join("") + '</div><div class="car-nav"><div class="car-dots" id="car-dots">' + SLIDES.map(function () { return "<i></i>"; }).join("") +
      '</div><div class="car-btns"><button type="button" id="car-prev" aria-label="Précédent"><svg viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6"/></svg></button>' +
      '<button type="button" id="car-next" aria-label="Suivant"><svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg></button></div></div>';
    list.parentNode.insertBefore(c, list);
    var track = document.getElementById("car-track"), dots = document.querySelectorAll("#car-dots i");
    var prev = document.getElementById("car-prev"), next = document.getElementById("car-next");
    function step() { var it = track.querySelector(".car-item"); return it ? it.getBoundingClientRect().width + 18 : 300; }
    function update() {
      var i = Math.round(track.scrollLeft / step());
      dots.forEach(function (d, k) { d.classList.toggle("on", k === Math.min(i, dots.length - 1)); });
      prev.disabled = track.scrollLeft < 4; next.disabled = track.scrollLeft > track.scrollWidth - track.clientWidth - 4;
    }
    prev.addEventListener("click", function () { track.scrollBy({ left: -step(), behavior: "smooth" }); });
    next.addEventListener("click", function () { track.scrollBy({ left: step(), behavior: "smooth" }); });
    track.addEventListener("scroll", function () { requestAnimationFrame(update); }, { passive: true });
    track.querySelectorAll(".car-item").forEach(function (b) {
      b.addEventListener("click", function () { var r = document.querySelector('.pj-row[data-project="' + b.dataset.project + '"]'); if (r) r.click(); });
    });
    update();
  }
  // buildCarousel();  (carrousel retiré de cet aperçu)

  /* ---------- Projets : la pile de cartes se tasse au scroll ---------- */
  (function () {
    if (calm) return;
    var ticking = false;
    function stack() {
      ticking = false;
      var cards = document.querySelectorAll(".fo-card"); if (cards.length < 2) return;
      var p = [];
      for (var i = 0; i < cards.length - 1; i++) {
        var r = cards[i].getBoundingClientRect(), n = cards[i + 1].getBoundingClientRect();
        var step = parseFloat(getComputedStyle(cards[i + 1]).top) - parseFloat(getComputedStyle(cards[i]).top);
        var full = cards[i].offsetHeight + 28 - step;
        p[i] = full > 0 ? Math.max(0, Math.min(1, 1 - (n.top - r.top - step) / full)) : 0;
      }
      p[cards.length - 1] = 0;
      for (var k = 0; k < cards.length; k++) {
        var sum = 0; for (var j = k; j < cards.length; j++) sum += p[j];
        cards[k].style.transform = sum ? "scale(" + (1 - 0.04 * sum).toFixed(4) + ")" : "";
        cards[k].style.setProperty("--d", Math.min(0.6, 0.28 * sum).toFixed(3));
      }
    }
    function req() { if (!ticking) { ticking = true; requestAnimationFrame(stack); } }
    window.addEventListener("scroll", req, { passive: true });
    window.addEventListener("resize", req);
    var list = document.getElementById("work-list");
    if (list && "MutationObserver" in window) new MutationObserver(req).observe(list, { childList: true });
    req();
  })();

  /* ---------- chiffres animés ---------- */
  function countUp() {
    document.querySelectorAll(".hero .stats strong, .scr-page .stats strong").forEach(function (el) {
      var m = el.textContent.match(/^(\d+)(.*)$/); if (!m || calm) return;
      var n = +m[1], rest = m[2], t0 = null;
      el.textContent = "0" + rest;
      requestAnimationFrame(function f(t) { if (!t0) t0 = t; var p = Math.min(1, (t - t0) / 1300);
        el.textContent = Math.round(n * (1 - Math.pow(1 - p, 3))) + rest; if (p < 1) requestAnimationFrame(f); });
    });
  }


  /* ---------- 1. La phrase qui s'allume mot par mot ---------- */
  var TAG = { fr: "Du premier atelier à la mise en production, je fais le lien entre le *métier* et la *technique*.",
              en: "From the first workshop to go-live, I connect the *business* and the *technology*." };
  function buildTagline() {
    var sec = document.getElementById("tagline");
    if (!sec) { sec = document.createElement("section"); sec.className = "section wrap"; sec.id = "tagline";
      sec.innerHTML = '<p class="tagline" id="tagline-text"></p>';
      var after = document.getElementById("about"); after.parentNode.insertBefore(sec, after.nextSibling); }
    var en = (root.lang || "fr").indexOf("en") === 0;
    document.getElementById("tagline-text").innerHTML = TAG[en ? "en" : "fr"].split(" ").map(function (w) {
      var acc = /^\*.*\*[.,]?$/.test(w); return '<span class="w' + (acc ? " acc" : "") + '">' + w.replace(/\*/g, "") + "</span>"; }).join(" ");
    lightWords();
  }
  var tickT = false;
  function lightWords() {
    var line = window.innerHeight * .62;
    document.querySelectorAll("#tagline .w").forEach(function (w) { w.classList.toggle("on", calm || w.getBoundingClientRect().top < line); });
  }
  window.addEventListener("scroll", function () { if (tickT) return; tickT = true; requestAnimationFrame(function () { tickT = false; lightWords(); }); }, { passive: true });
  buildTagline();

  /* ---------- 4. Menu mobile plein écran ---------- */
  (function () {
    var inner = document.querySelector(".topbar-inner"); if (!inner) return;
    var b = document.createElement("button"); b.type = "button"; b.className = "burger"; b.setAttribute("aria-label", "Menu"); b.setAttribute("aria-expanded", "false");
    b.innerHTML = "<i></i><i></i>"; inner.appendChild(b);
    var m = document.createElement("nav"); m.className = "mmenu"; m.setAttribute("aria-label", "Menu");
    function fill() { m.innerHTML = [].slice.call(document.querySelectorAll("body > header .nav a")).map(function (a, k) {
      return '<a href="' + a.getAttribute("href") + '" style="--k:' + Math.min(k, 6) + '"><span>0' + (k + 1) + "</span>" + a.textContent + "</a>"; }).join("");
      // le CV en dernier, mis en avant
      var cv = document.querySelector(".topbar .tb-cv");
      if (cv && !cv.hidden) m.insertAdjacentHTML("beforeend", '<a class="mm-cv" href="' + cv.getAttribute("href") + '" download style="--k:6">' + cv.textContent + "</a>"); }
    fill(); document.body.appendChild(m);
    function set(o) { root.classList.toggle("menu-open", o); b.setAttribute("aria-expanded", String(o)); }
    b.addEventListener("click", function () { fill(); set(!root.classList.contains("menu-open")); });
    m.addEventListener("click", function (e) { if (e.target.closest("a")) set(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") set(false); });
  })();

  // la phrase suit la langue choisie
  document.querySelectorAll(".lang button").forEach(function (b) { b.addEventListener("click", function () { setTimeout(buildTagline, 0); }); });


  /* ---------- Accueil : vidéo de la scène + écran de code net par-dessus ---------- */
  (function () {
    var hero = document.getElementById("top"); if (!hero || hero.querySelector(".hero-scene") || document.documentElement.hasAttribute("data-hero-night")) return;
    var img = hero.querySelector(".portrait img");
    var av = document.createElement("img"); av.className = "hero-avatar hero-in"; av.style.setProperty("--i", "0");
    av.src = img ? img.getAttribute("src") : ""; av.alt = ""; av.width = 72; av.height = 72;
    var textCol = hero.querySelector(".hero-name").parentNode; textCol.insertBefore(av, textCol.firstChild);

    var W = 1280, H = 720;
    var CODE = ['<b>POST</b> /v1/orders', '<i>200 OK</i> · 142 ms', '{', ' "order_id":', '  "FR-10482",', ' "status":', '  "allocated"', '}', '<i>✓</i> webhook'];
    var fig = document.createElement("figure"); fig.className = "hero-scene hero-in"; fig.style.setProperty("--i", "9"); fig.setAttribute("aria-hidden", "true");
    fig.innerHTML = '<div class="scene-layer"><div class="scene-stage">' +
      '<video class="scene-video" muted loop playsinline autoplay preload="auto" poster="hero-scene.jpg">' +
      '<source src="hero-scene.webm" type="video/webm"><source src="hero-scene.mp4" type="video/mp4"></video>' +
      '<div class="scene-code"><div class="code-bar"><span></span><span></span><span></span></div><pre class="code-body"></pre></div></div></div>';
    hero.appendChild(fig);
    var layer = fig.querySelector(".scene-layer"), stage = fig.querySelector(".scene-stage"), vid = fig.querySelector("video"), codeEl = fig.querySelector(".code-body");

    function place() {
      var fw = fig.clientWidth, fh = fig.clientHeight; if (!fw || !fh) return;
      var mobile = getComputedStyle(fig).position === "relative", sc, x, y;
      if (mobile) { sc = Math.max(fw / W, fh / H); x = (fw - W * sc) * .5; y = (fh - H * sc) * .6; }
      else { sc = Math.min(1, fw * .8 / W, fh / H); x = fw - W * sc; y = fh - H * sc; }      // jamais agrandie : pas de perte de pixels
      stage.style.width = W + "px"; stage.style.height = H + "px";
      stage.style.transform = "translate(" + x + "px," + y + "px) scale(" + sc + ")";
    }
    place(); window.addEventListener("resize", place);

    if (calm) { vid.removeAttribute("autoplay"); vid.pause(); }
    var playing = function (on) { if (calm) return; if (on) { var p = vid.play(); if (p && p.catch) p.catch(function () {}); } else vid.pause(); };

    // écran de code : les lignes s'écrivent une à une, puis repartent
    var line = 0, ch = 0, hold = 0;
    function typeTick() {
      if (calm) { codeEl.innerHTML = CODE.join("\n"); return; }
      var txt = CODE.slice(0, line).join("\n"), cur = CODE[line] || "", plain = cur.replace(/<[^>]+>/g, "");
      if (line < CODE.length) {
        ch += 1;
        codeEl.innerHTML = (txt ? txt + "\n" : "") + (ch >= plain.length ? cur : plain.slice(0, ch)) + '<u></u>';
        if (ch >= plain.length) { line++; ch = 0; }
        setTimeout(typeTick, ch === 0 ? 260 : 55);
      } else if (hold++ < 1) { codeEl.innerHTML = CODE.join("\n") + '<u></u>'; setTimeout(typeTick, 4200); }
      else { line = 0; ch = 0; hold = 0; codeEl.innerHTML = '<u></u>'; setTimeout(typeTick, 700); }
    }
    typeTick();

    var mx = 0, my = 0, cx = 0, cy = 0, visible = true;
    (function loop() { requestAnimationFrame(loop); if (!visible || calm) return;
      cx += (mx - cx) * .05; cy += (my - cy) * .05;
      layer.style.transform = "translate3d(" + (-cx * 12).toFixed(2) + "px," + (-cy * 7).toFixed(2) + "px,0) scale(1.03)"; })();
    hero.addEventListener("pointerenter", function (e) { if (e.pointerType === "mouse") root.classList.add("cursor-scene"); });
    hero.addEventListener("pointermove", function (e) { if (e.pointerType !== "mouse") return; var r = hero.getBoundingClientRect(); root.classList.add("cursor-scene");
      mx = (e.clientX - r.left) / r.width - .5; my = (e.clientY - r.top) / r.height - .5; });
    hero.addEventListener("pointerleave", function () { mx = my = 0; root.classList.remove("cursor-scene"); });
    if ("IntersectionObserver" in window) new IntersectionObserver(function (es) { visible = es[0].isIntersecting; playing(visible); }).observe(fig);
  })();

  /* ---------- 2. Ouverture : entrer dans l'écran, qui affiche déjà le site ---------- */
  var mode = "scroll";
  var SIG = {"one":{"p":["M -9.4 759.1 L 9.4 815.8 L 66.1 856.7 L 154.0 866.1 L 274.0 825.2 L 406.0 721.2 L 529.0 595.0 L 662.0 441.0 L 737.0 337.0 L 813.0 242.0 L 882.0 164.0 L 939.0 101.0 L 958.0 94.0 L 876.0 230.0 L 797.0 454.0 L 753.0 611.0 L 750.0 702.4 L 775.0 781.1 L 819.0 796.9 L 910.0 746.4 L 986.0 674.0 L 1030.1 620.0 M 129.0 639.0 L 132.0 554.0 L 167.0 498.0 L 249.0 469.0 L 324.0 466.0 L 441.0 488.0 L 513.0 504.0 L 652.0 520.0 L 813.0 539.0 L 901.0 539.0 L 929.0 526.0 L 958.0 507.0","M 1389.6 488.0 L 1363.6 444.0 L 1319.6 431.0 L 1212.6 466.0 L 1108.8 535.0 L 1023.8 624.0 L 998.6 693.0 L 1004.9 749.6 L 1074.2 784.2 L 1140.4 737.0 L 1237.6 652.0 L 1338.6 548.0 L 1448.6 466.0 L 1593.6 343.0 L 1729.6 208.0 L 1754.6 132.0 L 1751.6 91.0 L 1700.6 79.0 L 1622.6 116.0 L 1571.6 167.0 L 1502.6 277.0 L 1448.6 375.0 L 1354.6 583.0 L 1307.6 733.9 L 1294.6 844.1 L 1319.6 897.6 L 1363.6 913.0 L 1401.6 901.0","M 1411.1 617.0 L 1477.2 513.0 L 1596.6 337.0 L 1489.8 409.0 L 1489.8 435.0 L 1502.5 444.0 L 1700.6 447.0 L 1587.6 586.0 L 1524.5 699.0 L 1540.2 778.0 L 1628.6 771.6 L 1738.6 668.0 L 1779.6 617.0","M 1780.1 617.0 L 1849.4 564.0 L 1871.5 472.0 L 1773.8 714.9 L 1792.7 778.0 L 1865.1 793.7 L 1943.6 730.7 L 1994.6 671.0 L 2028.6 617.0 M 1934.6 324.0 L 1906.1 362.0","M 2126.7 630.0 L 2208.6 589.0 L 2277.6 551.0 L 2312.6 494.0 L 2299.6 450.0 L 2240.6 444.0 L 2123.6 513.0 L 2076.4 548.0 L 2026.0 608.0 L 1994.5 661.0 L 1988.2 711.8 L 2010.2 755.9 L 2092.1 790.5 L 2230.6 755.9 L 2274.6 718.1 L 2337.6 665.0 L 2375.6 617.0","M 2554.6 472.0 L 2447.6 774.8 L 2589.6 614.0 L 2677.6 520.0 L 2740.6 482.0 L 2787.6 463.0 L 2800.6 488.0 L 2737.6 605.0 L 2696.6 699.0 L 2699.6 752.8 L 2734.6 784.2 L 2793.6 774.8 L 2856.6 730.7 L 2919.6 668.0 L 2954.6 617.0","M 3147.6 564.0 L 3373.6 557.0","M 3654.6 264.0 L 3732.6 230.0 L 3773.6 195.0 L 3808.6 154.0 L 3836.6 107.0 L 3858.6 101.0 L 3795.6 271.0 L 3717.6 485.0 L 3635.6 652.0 L 3559.6 781.1 L 3493.6 841.0 L 3430.6 859.9 L 3392.8 815.8 L 3411.7 752.8 L 3525.1 614.0 L 3679.6 444.0 L 3877.6 258.0 L 4000.6 186.0 L 4079.6 167.0 L 4151.6 195.0 L 4186.6 287.0 L 4170.6 485.0 L 4151.6 611.0 L 4117.6 724.4 L 4142.6 718.1 L 4214.6 602.0 L 4391.6 337.0 L 4466.9 230.0 L 4536.3 179.0 L 4586.7 186.0 L 4605.5 211.0 L 4618.2 261.0 L 4580.4 372.0 L 4542.5 450.0 L 4498.4 545.0 L 4476.4 620.0 L 4476.4 699.0 L 4514.2 778.0 L 4611.8 762.2 L 4715.8 671.0 L 4750.4 617.0","M 5276.9 617.0 L 5238.9 668.0 L 5187.9 721.2 L 5112.9 768.5 L 5052.9 781.1 L 5024.9 737.0 L 5036.9 658.0 L 5077.9 526.0 L 5058.9 557.0 L 4957.9 655.0 L 4851.2 743.3 L 4763.0 781.1 L 4718.9 733.9 L 4725.2 646.0 L 4816.5 539.0 L 4929.9 469.0 L 5011.9 444.0 L 5093.9 444.0 L 5105.9 457.0","M 5276.4 617.0 L 5326.8 576.0 L 5361.4 539.0 L 5417.9 463.0 L 5490.9 343.0 L 5524.9 290.0 L 5490.9 283.0 L 5317.3 649.0 L 5301.6 733.9 L 5326.8 778.0 L 5405.5 771.6 L 5499.9 690.0 L 5565.9 617.0 M 5361.4 454.0 L 5565.9 444.0","M 5664.0 630.0 L 5745.9 589.0 L 5814.9 551.0 L 5849.9 494.0 L 5836.9 450.0 L 5777.9 444.0 L 5660.9 513.0 L 5613.7 548.0 L 5563.3 608.0 L 5531.8 661.0 L 5525.5 711.8 L 5547.5 755.9 L 5629.4 790.5 L 5767.9 755.9 L 5811.9 718.1 L 5874.9 665.0 L 5912.9 617.0 M 5871.9 192.0 L 5741.9 271.0","M 6138.9 463.0 L 6085.9 435.0 L 6010.0 485.0 L 5937.6 567.0 L 5903.0 639.0 L 5887.2 724.4 L 5956.5 790.5 L 6044.9 759.1 L 6126.9 690.0 L 6173.9 592.0 L 6182.9 554.0 L 6182.9 516.0 L 6163.9 516.0 M 6110.9 642.0 L 6126.9 699.0 L 6157.9 727.6 L 6198.9 724.4 L 6239.9 690.0 L 6302.9 617.0","M 7405.9 220.0 L 7433.9 179.0 L 7433.9 132.0 L 7377.9 91.0 L 7232.9 110.0 L 7062.9 164.0 L 6980.9 242.0 L 6977.9 315.0 L 7074.9 362.0 L 7229.9 409.0 L 7329.9 463.0 L 7370.9 523.0 L 7364.9 576.0 L 7329.9 630.0 L 7235.9 702.4 L 7084.9 765.4 L 6879.9 806.3 L 6775.9 790.5 L 6741.3 752.8 L 6731.8 671.0 L 6766.4 598.0 L 6829.9 545.0 L 6901.9 507.0 L 7005.9 476.0","M 7613.9 463.0 L 7560.9 435.0 L 7485.0 485.0 L 7412.6 567.0 L 7378.0 639.0 L 7362.2 724.4 L 7431.5 790.5 L 7519.9 759.1 L 7601.9 690.0 L 7648.9 592.0 L 7657.9 554.0 L 7657.9 516.0 L 7638.9 516.0 M 7585.9 642.0 L 7601.9 699.0 L 7632.9 727.6 L 7673.9 724.4 L 7714.9 690.0 L 7777.9 617.0","M 7857.1 491.0 L 7791.0 583.0 L 7756.3 677.0 L 7753.2 743.3 L 7800.4 771.6 L 7888.7 746.4 L 7954.9 661.0 L 8036.9 561.0 L 8102.9 447.0 L 8133.9 457.0 L 8023.9 636.0 L 8014.9 702.4 L 8011.9 746.4 L 8064.9 778.0 L 8130.9 759.1 L 8222.9 680.0 L 8272.9 617.0","M 8279.7 624.0 L 8396.3 535.0 L 8543.9 372.0 L 8650.9 211.0 L 8698.9 138.0 L 8685.9 91.0 L 8616.9 82.0 L 8547.9 126.0 L 8452.9 268.0 L 8345.9 460.0 L 8276.5 602.0 L 8254.5 714.9 L 8282.9 774.8 L 8349.0 781.1 L 8424.9 746.4 L 8499.9 668.0 L 8534.9 617.0","M 8632.0 630.0 L 8713.9 589.0 L 8782.9 551.0 L 8817.9 494.0 L 8804.9 450.0 L 8745.9 444.0 L 8628.9 513.0 L 8581.7 548.0 L 8531.3 608.0 L 8499.8 661.0 L 8493.5 711.8 L 8515.5 755.9 L 8597.4 790.5 L 8735.9 755.9 L 8779.9 718.1 L 8842.9 665.0 L 8880.9 617.0","M 8880.4 617.0 L 8921.4 583.0 L 8946.5 539.0 L 8978.0 472.0 L 9028.9 406.0 L 9160.9 353.0 L 9204.9 346.0 L 9254.9 356.0 L 9261.9 387.0 L 9254.9 419.0 L 9239.9 435.0 M 8965.4 526.0 L 8984.4 567.0 L 9072.9 617.0 L 9109.9 665.0 L 9106.9 711.8 L 9062.9 765.4 L 8990.7 806.3 L 8943.4 828.4 L 8886.7 831.5 L 8877.3 818.9 L 8877.3 784.2 L 8896.1 765.4"],"w":9213.9,"h":1150},"two":{"p":["M -9.4 759.1 L 9.4 815.8 L 66.1 856.7 L 154.0 866.1 L 274.0 825.2 L 406.0 721.2 L 529.0 595.0 L 662.0 441.0 L 737.0 337.0 L 813.0 242.0 L 882.0 164.0 L 939.0 101.0 L 958.0 94.0 L 876.0 230.0 L 797.0 454.0 L 753.0 611.0 L 750.0 702.4 L 775.0 781.1 L 819.0 796.9 L 910.0 746.4 L 986.0 674.0 L 1030.1 620.0 M 129.0 639.0 L 132.0 554.0 L 167.0 498.0 L 249.0 469.0 L 324.0 466.0 L 441.0 488.0 L 513.0 504.0 L 652.0 520.0 L 813.0 539.0 L 901.0 539.0 L 929.0 526.0 L 958.0 507.0","M 1389.6 488.0 L 1363.6 444.0 L 1319.6 431.0 L 1212.6 466.0 L 1108.8 535.0 L 1023.8 624.0 L 998.6 693.0 L 1004.9 749.6 L 1074.2 784.2 L 1140.4 737.0 L 1237.6 652.0 L 1338.6 548.0 L 1448.6 466.0 L 1593.6 343.0 L 1729.6 208.0 L 1754.6 132.0 L 1751.6 91.0 L 1700.6 79.0 L 1622.6 116.0 L 1571.6 167.0 L 1502.6 277.0 L 1448.6 375.0 L 1354.6 583.0 L 1307.6 733.9 L 1294.6 844.1 L 1319.6 897.6 L 1363.6 913.0 L 1401.6 901.0","M 1411.1 617.0 L 1477.2 513.0 L 1596.6 337.0 L 1489.8 409.0 L 1489.8 435.0 L 1502.5 444.0 L 1700.6 447.0 L 1587.6 586.0 L 1524.5 699.0 L 1540.2 778.0 L 1628.6 771.6 L 1738.6 668.0 L 1779.6 617.0","M 1780.1 617.0 L 1849.4 564.0 L 1871.5 472.0 L 1773.8 714.9 L 1792.7 778.0 L 1865.1 793.7 L 1943.6 730.7 L 1994.6 671.0 L 2028.6 617.0 M 1934.6 324.0 L 1906.1 362.0","M 2126.7 630.0 L 2208.6 589.0 L 2277.6 551.0 L 2312.6 494.0 L 2299.6 450.0 L 2240.6 444.0 L 2123.6 513.0 L 2076.4 548.0 L 2026.0 608.0 L 1994.5 661.0 L 1988.2 711.8 L 2010.2 755.9 L 2092.1 790.5 L 2230.6 755.9 L 2274.6 718.1 L 2337.6 665.0 L 2375.6 617.0","M 2554.6 472.0 L 2447.6 774.8 L 2589.6 614.0 L 2677.6 520.0 L 2740.6 482.0 L 2787.6 463.0 L 2800.6 488.0 L 2737.6 605.0 L 2696.6 699.0 L 2699.6 752.8 L 2734.6 784.2 L 2793.6 774.8 L 2856.6 730.7 L 2919.6 668.0 L 2954.6 617.0","M 3147.6 564.0 L 3373.6 557.0","M 3654.6 264.0 L 3732.6 230.0 L 3773.6 195.0 L 3808.6 154.0 L 3836.6 107.0 L 3858.6 101.0 L 3795.6 271.0 L 3717.6 485.0 L 3635.6 652.0 L 3559.6 781.1 L 3493.6 841.0 L 3430.6 859.9 L 3392.8 815.8 L 3411.7 752.8 L 3525.1 614.0 L 3679.6 444.0 L 3877.6 258.0 L 4000.6 186.0 L 4079.6 167.0 L 4151.6 195.0 L 4186.6 287.0 L 4170.6 485.0 L 4151.6 611.0 L 4117.6 724.4 L 4142.6 718.1 L 4214.6 602.0 L 4391.6 337.0 L 4466.9 230.0 L 4536.3 179.0 L 4586.7 186.0 L 4605.5 211.0 L 4618.2 261.0 L 4580.4 372.0 L 4542.5 450.0 L 4498.4 545.0 L 4476.4 620.0 L 4476.4 699.0 L 4514.2 778.0 L 4611.8 762.2 L 4715.8 671.0 L 4750.4 617.0","M 5276.9 617.0 L 5238.9 668.0 L 5187.9 721.2 L 5112.9 768.5 L 5052.9 781.1 L 5024.9 737.0 L 5036.9 658.0 L 5077.9 526.0 L 5058.9 557.0 L 4957.9 655.0 L 4851.2 743.3 L 4763.0 781.1 L 4718.9 733.9 L 4725.2 646.0 L 4816.5 539.0 L 4929.9 469.0 L 5011.9 444.0 L 5093.9 444.0 L 5105.9 457.0","M 5276.4 617.0 L 5326.8 576.0 L 5361.4 539.0 L 5417.9 463.0 L 5490.9 343.0 L 5524.9 290.0 L 5490.9 283.0 L 5317.3 649.0 L 5301.6 733.9 L 5326.8 778.0 L 5405.5 771.6 L 5499.9 690.0 L 5565.9 617.0 M 5361.4 454.0 L 5565.9 444.0","M 5664.0 630.0 L 5745.9 589.0 L 5814.9 551.0 L 5849.9 494.0 L 5836.9 450.0 L 5777.9 444.0 L 5660.9 513.0 L 5613.7 548.0 L 5563.3 608.0 L 5531.8 661.0 L 5525.5 711.8 L 5547.5 755.9 L 5629.4 790.5 L 5767.9 755.9 L 5811.9 718.1 L 5874.9 665.0 L 5912.9 617.0 M 5871.9 192.0 L 5741.9 271.0","M 6138.9 463.0 L 6085.9 435.0 L 6010.0 485.0 L 5937.6 567.0 L 5903.0 639.0 L 5887.2 724.4 L 5956.5 790.5 L 6044.9 759.1 L 6126.9 690.0 L 6173.9 592.0 L 6182.9 554.0 L 6182.9 516.0 L 6163.9 516.0 M 6110.9 642.0 L 6126.9 699.0 L 6157.9 727.6 L 6198.9 724.4 L 6239.9 690.0 L 6302.9 617.0","M 693.0 1320.0 L 721.0 1279.0 L 721.0 1232.0 L 665.0 1191.0 L 520.0 1210.0 L 350.0 1264.0 L 268.0 1342.0 L 265.0 1415.0 L 362.0 1462.0 L 517.0 1509.0 L 617.0 1563.0 L 658.0 1623.0 L 652.0 1676.0 L 617.0 1730.0 L 523.0 1802.4 L 372.0 1865.4 L 167.0 1906.3 L 63.0 1890.5 L 28.4 1852.8 L 18.9 1771.0 L 53.5 1698.0 L 117.0 1645.0 L 189.0 1607.0 L 293.0 1576.0","M 901.0 1563.0 L 848.0 1535.0 L 772.1 1585.0 L 699.7 1667.0 L 665.1 1739.0 L 649.3 1824.4 L 718.6 1890.5 L 807.0 1859.1 L 889.0 1790.0 L 936.0 1692.0 L 945.0 1654.0 L 945.0 1616.0 L 926.0 1616.0 M 873.0 1742.0 L 889.0 1799.0 L 920.0 1827.6 L 961.0 1824.4 L 1002.0 1790.0 L 1065.0 1717.0","M 1144.2 1591.0 L 1078.1 1683.0 L 1043.4 1777.0 L 1040.3 1843.3 L 1087.5 1871.6 L 1175.8 1846.4 L 1242.0 1761.0 L 1324.0 1661.0 L 1390.0 1547.0 L 1421.0 1557.0 L 1311.0 1736.0 L 1302.0 1802.4 L 1299.0 1846.4 L 1352.0 1878.0 L 1418.0 1859.1 L 1510.0 1780.0 L 1560.0 1717.0","M 1566.8 1724.0 L 1683.4 1635.0 L 1831.0 1472.0 L 1938.0 1311.0 L 1986.0 1238.0 L 1973.0 1191.0 L 1904.0 1182.0 L 1835.0 1226.0 L 1740.0 1368.0 L 1633.0 1560.0 L 1563.6 1702.0 L 1541.6 1814.9 L 1570.0 1874.8 L 1636.1 1881.1 L 1712.0 1846.4 L 1787.0 1768.0 L 1822.0 1717.0","M 1919.1 1730.0 L 2001.0 1689.0 L 2070.0 1651.0 L 2105.0 1594.0 L 2092.0 1550.0 L 2033.0 1544.0 L 1916.0 1613.0 L 1868.8 1648.0 L 1818.4 1708.0 L 1786.9 1761.0 L 1780.6 1811.8 L 1802.6 1855.9 L 1884.5 1890.5 L 2023.0 1855.9 L 2067.0 1818.1 L 2130.0 1765.0 L 2168.0 1717.0","M 2167.5 1717.0 L 2208.4 1683.0 L 2233.6 1639.0 L 2265.1 1572.0 L 2316.0 1506.0 L 2448.0 1453.0 L 2492.0 1446.0 L 2542.0 1456.0 L 2549.0 1487.0 L 2542.0 1519.0 L 2527.0 1535.0 M 2252.5 1626.0 L 2271.5 1667.0 L 2360.0 1717.0 L 2397.0 1765.0 L 2394.0 1811.8 L 2350.0 1865.4 L 2277.8 1906.3 L 2230.5 1928.4 L 2173.8 1931.5 L 2164.4 1918.9 L 2164.4 1884.2 L 2183.2 1865.4"],"w":6334.9,"h":2250}};
  try { var q = new URLSearchParams(location.search).get("intro"); if (q) mode = q; } catch (e) {}
  var intro, stage, screen, page, cv, ctx, pts = [], st = { w: 0, h: 0 }, raf = 0, t0 = 0, done = false, onScroll = null, Z = null;
  var phone = function () { return window.innerWidth < 700 || window.innerHeight > window.innerWidth * 1.1; };

  function makeIntro() {
    var ph = phone(), vw = window.innerWidth, vh = window.innerHeight, ar = vw / vh;
    // taille de l'écran : même proportion que la fenêtre, pour que le zoom tombe pile sur la page
    var sw = ph ? Math.min(vw * .66, vh * .64 * ar) : Math.min(720, vw * .8, vh * .62 * ar);
    intro = document.createElement("div"); intro.className = "intro" + (ph ? " is-phone" : ""); intro.setAttribute("aria-hidden", "true");
    intro.innerHTML = '<div class="intro-stage" id="intro-stage"><div class="dev"><div class="dev-screen" id="dev-screen" style="width:' + sw + 'px;height:' + (sw / ar) + 'px">' +
      '<div class="scr-page" id="scr-page"></div><svg class="sig" id="sig" aria-hidden="true"></svg></div></div>' + (ph ? "" : '<div class="lap-base"></div>') + '</div>' +
      '<button type="button" class="intro-skip" id="intro-skip">Passer</button>' +
      "";
    document.body.appendChild(intro);
    var sp = document.createElement("div"); sp.className = "intro-spacer"; sp.id = "intro-spacer";
    var main = document.getElementById("main"); main.insertBefore(sp, main.firstChild);
    stage = document.getElementById("intro-stage"); screen = document.getElementById("dev-screen"); page = document.getElementById("scr-page");
    cv = document.getElementById("sig");
    // aperçu du site : copie de la barre du haut et de l'accueil, rendue à taille réelle puis réduite
    page.style.width = vw + "px"; page.style.height = vh + "px"; page.style.transform = "scale(" + (sw / vw) + ")";
    [document.querySelector(".topbar"), document.getElementById("top")].forEach(function (n) {
      var c = n.cloneNode(true);
      c.querySelectorAll("[id]").forEach(function (e) { e.removeAttribute("id"); }); c.removeAttribute("id");
      c.querySelectorAll(".thread-words").forEach(function (e) { e.remove(); });
      c.querySelectorAll("video").forEach(function (v2) { v2.muted = true; v2.currentTime = 0; v2.pause(); });

      page.appendChild(c);
    });
    document.getElementById("intro-skip").addEventListener("click", finish);
  }

  // le fil rouge entre dans l'écran et écrit le nom, comme une signature
  var sigPaths = [], sigLen = 0;
  function buildSig() {
    var v = SIG[phone() ? "two" : "one"], pad = v.w * (phone() ? .05 : .07), W = v.w + pad * 2, H = v.h + pad * 1.2;
    cv.setAttribute("viewBox", (-pad) + " " + (-pad * .2) + " " + W + " " + H);
    var sw = Math.max(22, W / (phone() ? 120 : 170)), y0 = phone() ? v.h * .38 : v.h * .62;
    var lead = "M " + (-pad * 1.6) + " " + (y0 + v.h * .25) + " C " + (-pad * .6) + " " + (y0 + v.h * .3) + " " + (-pad * .4) + " " + (y0 - v.h * .05) + " 0 " + (y0 - v.h * .02);
    cv.innerHTML = [lead].concat(v.p).map(function (d) { return '<path d="' + d + '" stroke-width="' + sw + '"/>'; }).join("");
    sigPaths = [].slice.call(cv.querySelectorAll("path")); sigLen = 0;
    sigPaths.forEach(function (p) { var L = p.getTotalLength(); p._a = sigLen; p._L = L; sigLen += L; p.style.strokeDasharray = L + " " + (L + 1); p.style.strokeDashoffset = L; });
    t0 = performance.now();
  }
  function draw(now) {
    var k = Math.min(1, (now - t0) / 2300), e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2, at = e * sigLen;
    sigPaths.forEach(function (p) { var r = Math.min(p._L, Math.max(0, at - p._a)); p.style.strokeDashoffset = p._L - r; });
    if (k < 1) raf = requestAnimationFrame(draw);
  }
  var shown = false;
  function showSite() { // le nom s'efface peu à peu, le site apparaît dans l'écran
    if (shown) return; shown = true;
    cv.classList.add("out"); page.classList.add("on"); countUp();
  }

  // zoom : l'écran vient remplir exactement la fenêtre
  function measure() {
    stage.style.transform = "none";
    var s = screen.getBoundingClientRect(), b = stage.getBoundingClientRect(), S = window.innerWidth / s.width;
    var ox = s.left * S / (S - 1), oy = s.top * S / (S - 1);
    stage.style.transformOrigin = (ox - b.left) + "px " + (oy - b.top) + "px";
    Z = S;
  }
  function apply(p) {
    var e = mode === "scroll" ? p : (p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
    stage.style.transform = "scale(" + (1 + (Z - 1) * e) + ")";
    intro.style.setProperty("--chrome", String(1 - Math.min(1, e * 1.6)));
  }

  function finish() {
    if (done) return; done = true;
    if (onScroll) ["scroll", "wheel", "touchstart", "touchmove", "keydown"].forEach(function (ev) { window.removeEventListener(ev, onScroll); });
    root.classList.remove("intro-on");
    root.classList.remove("intro-scroll");
    intro.classList.add("gone");
    cancelAnimationFrame(raf);
  }

  function start() {
    if (calm || root.hasAttribute("data-hero-night")) { countUp(); return; } // accueil « nuit » : pas d'écran d'ouverture, on arrive direct sur le site
    try { history.scrollRestoration = "manual"; } catch (e) {}
    window.scrollTo({ top: 0, behavior: "instant" });
    root.classList.add("intro-on");
    (document.fonts ? document.fonts.ready : Promise.resolve()).then(function () {
      setTimeout(function () { // laisse le site se dessiner (fil rouge compris) avant d'en faire la copie
        if (done) return;
        makeIntro(); buildSig(); raf = requestAnimationFrame(draw);
        if (mode === "auto") {
          setTimeout(showSite, 2600);
          setTimeout(function () {
            var z0 = null; measure();
            requestAnimationFrame(function z(t) { if (done) return; if (!z0) z0 = t; var p = Math.min(1, (t - z0) / 1150); apply(p); if (p < 1) requestAnimationFrame(z); else finish(); });
          }, 3400);
        } else {
          // un seul geste de défilement suffit : la transition se joue ensuite toute seule
          var go = false;
          var play = function () {
            if (go || done) return; go = true; measure();
            var sm = function (p, a, b) { var x = Math.min(1, Math.max(0, (p - a) / (b - a))); return x * x * (3 - 2 * x); };
            var T = 2400, z0 = null;
            requestAnimationFrame(function tick(t) {
              if (done) return; if (!z0) z0 = t; var p = Math.min(1, (t - z0) / T);
              var out = sm(p, 0, .42), inn = sm(p, .2, .62);
              cv.style.opacity = String(1 - out); cv.style.filter = "blur(" + (out * 6) + "px)"; cv.style.transform = "scale(" + (1 + out * .06) + ")";
              page.style.opacity = String(inn); page.style.filter = "blur(" + ((1 - inn) * 4) + "px)";
              if (inn > .4 && !shown) { shown = true; countUp(); }
              apply(sm(p, .55, 1)); if (p < 1) requestAnimationFrame(tick); else finish();
            });
          };
          var ty = null;
          onScroll = function (e) {
            if (e.type === "wheel" && e.deltaY > 4) play();
            else if (e.type === "keydown" && ["ArrowDown", "PageDown", " ", "Spacebar"].indexOf(e.key) > -1) { e.preventDefault(); play(); }
            else if (e.type === "touchstart") ty = e.touches[0].clientY;
            else if (e.type === "touchmove" && ty !== null && ty - e.touches[0].clientY > 12) play();
          };
          ["wheel", "touchstart", "touchmove", "keydown"].forEach(function (ev) { window.addEventListener(ev, onScroll, { passive: ev !== "keydown" }); });
          intro.addEventListener("click", function (e) { if (!e.target.closest(".intro-skip")) play(); });
          // arrivée automatique : une fois la signature écrite, la transition se lance toute seule
          setTimeout(play, 2700);
        }
      }, 150);
    });
  }

  function restart(m) {
    if (onScroll) ["scroll", "wheel", "touchstart", "touchmove", "keydown"].forEach(function (ev) { window.removeEventListener(ev, onScroll); });
    cancelAnimationFrame(raf);
    if (intro) intro.remove();
    var sp = document.getElementById("intro-spacer"); if (sp) sp.remove();
    root.classList.remove("intro-scroll", "intro-on");
    done = false; shown = false; onScroll = null; Z = null; mode = m;
    start();
  }

  start();
})();
