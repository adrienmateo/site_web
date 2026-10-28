/* Accueil « nuit » : scène illustrée à droite, texte à gauche.
   Construit la scène (image + bulle + cube + yeux) selon la taille d'écran, fait tomber le nom lettre par lettre,
   et gère les deux étiquettes (Fonctionnel / Technique) au survol, en FR et en EN. */
(function () {
  "use strict";
  var hero = document.getElementById("top"); if (!hero) return;
  var DIR = "hero-night/";

  /* scène animée : vidéo en boucle du robot qui marche (bulle, cube, lune et sol sont dans la vidéo).
     Positions en pixels de la vidéo (1280 × 720) pour les zones de survol. */
  var V = { w: 1280, h: 720, src: "robot-marche.mp4", src_m: "robot-marche-720.mp4", poster: "robot-marche.webp",
            sphere: { x: 753, y: 262, w: 144, h: 144 }, cube: { x: 1072, y: 280, w: 130, h: 142 },
            moon: [78.5, 22.9, 34] };
  var TXT = {
    fr: { f: ["Fonctionnel", "Ateliers, besoins, spécifications"], t: ["Technique", "API, intégrations, débogage"],
          fa: "Côté fonctionnel : ateliers, besoins, spécifications", ta: "Côté technique : API, intégrations, débogage" },
    en: { f: ["Functional", "Workshops, needs, specifications"], t: ["Technical", "APIs, integrations, debugging"],
          fa: "Functional side: workshops, needs, specifications", ta: "Technical side: APIs, integrations, debugging" }
  };
  var mq = window.matchMedia("(max-width: 700px)");
  var pc = function (v, t) { return (v / t * 100).toFixed(3) + "%"; };

  function build() {
    var old = hero.querySelector(".nt-scene"); if (old) old.remove();
    var S = V, W = S.w, H = S.h, mob = mq.matches;
    var box = function (o) { return "left:" + pc(o.x, W) + ";top:" + pc(o.y, H) + ";width:" + pc(o.w, W) + ";aspect-ratio:" + o.w + "/" + o.h; };
    var fig = document.createElement("figure"); fig.className = "nt-scene is-v " + (mob ? "is-m" : "is-d");
    fig.innerHTML =
      '<div class="nt-view"><div class="nt-world">' +
        '<video class="nt-art" muted loop playsinline autoplay preload="auto" poster="' + DIR + S.poster + '" width="' + W + '" height="' + H + '">' +
          '<source src="' + DIR + (mob ? S.src_m : S.src) + '" type="video/mp4"></video>' +
        '<i class="nt-moon" style="left:' + S.moon[0] + "%;top:" + S.moon[1] + "%;width:" + S.moon[2] + '%"></i>' +
        '<div class="nt-obj nt-sphere" style="' + box(S.sphere) + '">' +
          '<button class="nt-hot" type="button"><span class="nt-tip nt-tip-l"><b></b><span></span></span></button></div>' +
        '<div class="nt-obj nt-cube" style="' + box(S.cube) + '">' +
          '<button class="nt-hot" type="button"><span class="nt-tip nt-tip-r"><b></b><span></span></span></button></div>' +
      "</div></div>";
    hero.appendChild(fig);
    var vid = fig.querySelector("video");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { vid.removeAttribute("autoplay"); vid.pause(); }
    else { var p = vid.play(); if (p && p.catch) p.catch(function () {}); }
    lang();
  }

  function lang() {
    var L = (document.documentElement.lang || "fr").slice(0, 2) === "en" ? TXT.en : TXT.fr;
    var set = function (sel, tip, label) {
      var b = hero.querySelector(sel + " .nt-hot"); if (!b) return;
      b.setAttribute("aria-label", label);
      b.querySelector(".nt-tip b").textContent = tip[0]; b.querySelector(".nt-tip span").textContent = tip[1];
    };
    set(".nt-sphere", L.f, L.fa); set(".nt-cube", L.t, L.ta);
  }

  /* avatar au-dessus du nom (même photo que le portrait masqué) */
  (function () {
    if (hero.querySelector(".nt-avatar")) return;
    var img = hero.querySelector(".portrait img"), col = hero.querySelector(".hero-name"); if (!col) return; col = col.parentNode;
    var av = document.createElement("img"); av.className = "nt-avatar hero-in"; av.style.setProperty("--i", "0");
    av.src = img ? img.getAttribute("src") : "photo.jpg"; av.alt = ""; av.width = 72; av.height = 72;
    col.insertBefore(av, col.firstChild);
  })();

  /* le nom tombe lettre par lettre */
  (function () {
    var h1 = hero.querySelector(".hero-name"); if (!h1 || h1.getAttribute("data-split")) return;
    h1.setAttribute("data-split", "1"); h1.setAttribute("aria-label", h1.textContent.replace(/\s+/g, " ").trim());
    var n = 0;
    h1.querySelectorAll(".ln > span").forEach(function (sp) {
      var t = sp.textContent; sp.textContent = ""; sp.setAttribute("aria-hidden", "true");
      Array.prototype.forEach.call(t, function (c) {
        var s = document.createElement("span"); s.className = "nt-ch"; s.textContent = c;
        s.style.setProperty("--c", n++); s.style.setProperty("--r", (Math.random() * 16 - 8).toFixed(1)); sp.appendChild(s);
      });
    });
  })();

  build();
  (mq.addEventListener ? mq.addEventListener("change", build) : mq.addListener(build));
  new MutationObserver(lang).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
})();
