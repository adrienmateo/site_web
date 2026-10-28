/* Accueil « nuit » : scène illustrée à droite, texte à gauche.
   Construit la scène (image + bulle + cube + yeux) selon la taille d'écran, fait tomber le nom lettre par lettre,
   et gère les deux étiquettes (Fonctionnel / Technique) au survol, en FR et en EN. */
(function () {
  "use strict";
  var hero = document.getElementById("top"); if (!hero) return;
  var DIR = "hero-night/";

  /* scène animée en calques (positions en pixels d'une image 1280 × 720) :
     décor fixe, planète qui tourne (WebGL, à l'infini), robot qui marche en boucle par-dessus. */
  var V = { w: 1280, h: 720, still: "decor.webp", robot: "robot.webp", band: "sol.webp",
            rob: { x: 820, y: 250, w: 270, h: 330 },
            sphere: { x: 753, y: 262, w: 144, h: 144 }, cube: { x: 1072, y: 280, w: 130, h: 142 },
            moon: [78.5, 22.9, 34],
            planet: { cx: 943.75, cy: 1686.05, r: 1152.96, depth: 210, speed: 60, bandW: 7244, tiles: 4 } };
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
    var still = reduced ? "robot-fixe.webp" : S.still;
    var fig = document.createElement("figure"); fig.className = "nt-scene is-v " + (mob ? "is-m" : "is-d");
    fig.innerHTML =
      '<div class="nt-view"><div class="nt-world">' +
        '<img class="nt-art" src="' + DIR + still + '" alt="" width="' + W + '" height="' + H + '" decoding="async">' +
        (reduced ? "" : '<canvas class="nt-ground" aria-hidden="true"></canvas>' +
          '<img class="nt-robot" src="' + DIR + S.robot + '" alt="" style="' + box(S.rob) + '">') +
        '<i class="nt-moon" style="left:' + S.moon[0] + "%;top:" + S.moon[1] + "%;width:" + S.moon[2] + '%"></i>' +
        '<div class="nt-obj nt-sphere" style="' + box(S.sphere) + '">' +
          '<button class="nt-hot" type="button"><span class="nt-tip nt-tip-l"><b></b><span></span></span></button></div>' +
        '<div class="nt-obj nt-cube" style="' + box(S.cube) + '">' +
          '<button class="nt-hot" type="button"><span class="nt-tip nt-tip-r"><b></b><span></span></span></button></div>' +
      "</div></div>";
    hero.appendChild(fig);
    if (!reduced) planet(fig.querySelector(".nt-ground"), fig.querySelector(".nt-art"));
    lang();
  }

  /* la planète : on reprend le sol du décor (lumière, ombre) et on fait défiler la texture du sol en rond, à vitesse constante */
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches, stopPlanet = null;
  function planet(cv, art) {
    if (stopPlanet) stopPlanet();
    var gl = cv.getContext("webgl", { premultipliedAlpha: true, alpha: true, antialias: false }); if (!gl) { cv.remove(); return; }
    var P = V.planet, band = new Image(), ready = 0, raf = 0, alive = true, t0 = performance.now(), seen = true;
    var vs = "attribute vec2 p;varying vec2 uv;void main(){uv=p*.5+.5;uv.y=1.-uv.y;gl_Position=vec4(p,0.,1.);}";
    var fs = "precision highp float;varying vec2 uv;uniform sampler2D st,bd;uniform float t;" +
      "const vec2 C=vec2(" + P.cx.toFixed(2) + "," + P.cy.toFixed(2) + ");const float R=" + P.r.toFixed(2) + ",D=" + P.depth.toFixed(1) +
      ",BW=" + P.bandW.toFixed(1) + ",TL=" + P.tiles.toFixed(1) + ",SP=" + P.speed.toFixed(1) + ";" +
      "void main(){vec2 q=uv*vec2(" + V.w + ".," + V.h + ".);vec2 d=q-C;float r=length(d);float a=clamp(R+.5-r,0.,1.);" +
      "if(a<=0.){gl_FragColor=vec4(0.);return;}" +
      "vec3 b=texture2D(st,uv).rgb;float row=R+6.-r;float k=.5;" +
      "if(row<D-1.){float u=mod(atan(d.x,-d.y)*R-SP*t,BW);float tw=BW/TL;float ti=floor(u/tw);" +
      "vec2 bu=vec2((u-ti*tw)/tw,(ti*D+row+.5)/(TL*D));k=texture2D(bd,bu).r;k=mix(k,.5,smoothstep(D-40.,D-1.,row));}" +
      "vec3 o=mix(2.*b*k,1.-2.*(1.-b)*(1.-k),step(.5,b));gl_FragColor=vec4(o*a,a);}";
    function sh(type, src) { var o = gl.createShader(type); gl.shaderSource(o, src); gl.compileShader(o); return o; }
    var pr = gl.createProgram(); gl.attachShader(pr, sh(gl.VERTEX_SHADER, vs)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) { cv.remove(); return; }
    gl.useProgram(pr);
    var buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(pr, "p"); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    function tex(unit, img, name) {
      var tx = gl.createTexture(); gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, tx);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      [gl.TEXTURE_WRAP_S, gl.TEXTURE_WRAP_T].forEach(function (w) { gl.texParameteri(gl.TEXTURE_2D, w, gl.CLAMP_TO_EDGE); });
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.uniform1i(gl.getUniformLocation(pr, name), unit);
    }
    var uT = gl.getUniformLocation(pr, "t");
    function size() {
      var r = cv.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = Math.max(1, Math.round(r.width * dpr)); cv.height = Math.max(1, Math.round(r.height * dpr)); gl.viewport(0, 0, cv.width, cv.height);
    }
    function frame(now) {
      if (!alive) return; raf = requestAnimationFrame(frame); if (!seen) return;
      gl.uniform1f(uT, (now - t0) / 1000); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
    function go() { if (++ready < 2) return; tex(0, art, "st"); tex(1, band, "bd"); size(); cv.classList.add("on"); raf = requestAnimationFrame(frame); }
    if (art.complete && art.naturalWidth) go(); else art.addEventListener("load", go);
    band.onload = go; band.src = DIR + V.band;
    var ro = window.ResizeObserver ? new ResizeObserver(size) : null; if (ro) ro.observe(cv);
    var io = window.IntersectionObserver ? new IntersectionObserver(function (e) { seen = e[0].isIntersecting; }) : null; if (io) io.observe(cv);
    stopPlanet = function () { alive = false; cancelAnimationFrame(raf); if (ro) ro.disconnect(); if (io) io.disconnect(); };
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

  /* sur la scène : curseur normal, pas de fil rouge */
  hero.addEventListener("pointermove", function (e) { if (e.pointerType === "mouse") document.documentElement.classList.add("cursor-scene"); });
  hero.addEventListener("pointerleave", function () { document.documentElement.classList.remove("cursor-scene"); });

  build();
  (mq.addEventListener ? mq.addEventListener("change", build) : mq.addListener(build));
  new MutationObserver(lang).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
})();
