/* Accueil « nuit » : scène illustrée à droite, texte à gauche.
   Construit la scène (image + bulle + cube + yeux) selon la taille d'écran, fait tomber le nom lettre par lettre,
   et gère les deux étiquettes (Fonctionnel / Technique) au survol, en FR et en EN. */
(function () {
  "use strict";
  var hero = document.getElementById("top"); if (!hero) return;
  var DIR = "hero-night/";

  /* positions en pixels de l'image d'origine : l'image est découpée en calques (fond, bulle, cube) */
  var SC = {
    d: { w: 1376, h: 768, art: "scene-d.webp", lid: "#98240F",
         sphere: { f: "sphere-d.webp", x: 837, y: 270, w: 165, h: 165 },
         cube:   { f: "cube-d.webp",   x: 1149, y: 294, w: 149, h: 158 },
         eyes: [[1026, 346, 17, 25], [1084, 345, 17, 25]],
         moon: [80.4, 23.4, 34], glow: [66.6, 45.8, 14] },
    m: { w: 2048, h: 2048, art: "scene-m.webp", lid: "#A71904",
         sphere: { f: "sphere-m.webp", x: 815, y: 653, w: 385, h: 385 },
         cube:   { f: "cube-m.webp",   x: 1532, y: 696, w: 343, h: 367 },
         eyes: [[1257, 820, 36, 57], [1388, 819, 37, 56]],
         moon: [70, 22.3, 46], glow: [49.1, 41.3, 20] }
  };
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
    var S = mq.matches ? SC.m : SC.d, W = S.w, H = S.h;
    var box = function (o) { return "left:" + pc(o.x, W) + ";top:" + pc(o.y, H) + ";width:" + pc(o.w, W) + ";aspect-ratio:" + o.w + "/" + o.h; };
    var lids = S.eyes.map(function (e) {
      return '<i class="nt-lid" style="left:' + pc(e[0], W) + ";top:" + pc(e[1], H) + ";width:" + pc(e[2], W) + ";height:" + pc(e[3], H) + ";background:" + S.lid + '"></i>';
    }).join("");
    var fig = document.createElement("figure"); fig.className = "nt-scene " + (mq.matches ? "is-m" : "is-d");
    fig.innerHTML =
      '<div class="nt-view"><div class="nt-world">' +
        '<img class="nt-art" src="' + DIR + S.art + '" alt="" width="' + W + '" height="' + H + '" decoding="async">' +
        '<i class="nt-moon" style="left:' + S.moon[0] + "%;top:" + S.moon[1] + "%;width:" + S.moon[2] + '%"></i>' +
        '<i class="nt-glow" style="left:' + S.glow[0] + "%;top:" + S.glow[1] + "%;width:" + S.glow[2] + '%"></i>' +
        lids +
        '<div class="nt-obj nt-sphere" style="' + box(S.sphere) + '"><img src="' + DIR + S.sphere.f + '" alt="">' +
          '<button class="nt-hot" type="button"><span class="nt-tip nt-tip-l"><b></b><span></span></span></button></div>' +
        '<div class="nt-obj nt-cube" style="' + box(S.cube) + '"><img src="' + DIR + S.cube.f + '" alt="">' +
          '<button class="nt-hot" type="button"><span class="nt-tip nt-tip-r"><b></b><span></span></span></button></div>' +
      "</div></div>";
    hero.appendChild(fig);
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
