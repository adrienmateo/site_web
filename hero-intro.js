/* Arrivée sur le site : on part de l'espace, la petite planète tourne avec le robot dessus,
   puis la caméra plonge vers lui jusqu'à l'accueil. Un clic, une touche ou un défilement : on arrive direct sur le site. */
(function () {
  "use strict";
  var root = document.documentElement, hero = document.getElementById("top");
  var count = function () { if (window.ntCountUp) window.ntCountUp(); };
  var force = /[?&]intro=1/.test(location.search);
  var seen = false; try { seen = sessionStorage.getItem("nt-intro") === "1"; } catch (e) {}
  var calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!hero || calm || (seen && !force)) { count(); return; }
  var P = window.NT_PLANET; if (!P) { count(); return; }
  var cv = document.createElement("canvas"), gl = cv.getContext("webgl", { premultipliedAlpha: true, alpha: true });
  if (!gl) { count(); return; }
  try { sessionStorage.setItem("nt-intro", "1"); } catch (e) {}

  root.classList.add("nt-intro");
  var ov = document.createElement("div"); ov.className = "nt-intro-ov"; ov.setAttribute("aria-hidden", "true");
  var rob = document.createElement("img"); rob.className = "nt-intro-rob"; rob.alt = ""; rob.src = P.dir + P.robot;
  var skip = document.createElement("button"); skip.type = "button"; skip.className = "nt-intro-skip";
  skip.textContent = (root.lang || "fr").slice(0, 2) === "en" ? "Skip" : "Passer";
  ov.appendChild(cv); ov.appendChild(rob); ov.appendChild(skip); document.body.appendChild(ov);

  var C = P.planet, FW = P.w, FH = P.h;
  var vs = "attribute vec2 p;varying vec2 uv;void main(){uv=p*.5+.5;uv.y=1.-uv.y;gl_Position=vec4(p,0.,1.);}";
  var fs = "precision highp float;varying vec2 uv;uniform sampler2D st,bd;uniform vec2 scr,T;uniform float S,t,f;" +
    "const vec2 C=vec2(" + C.cx.toFixed(2) + "," + C.cy.toFixed(2) + ");const float R=" + C.r.toFixed(2) + ",D=" + C.depth.toFixed(1) +
    ",BW=" + C.bandW.toFixed(1) + ",TL=" + C.tiles.toFixed(1) + ",SP=" + C.speed.toFixed(1) + ";const vec2 FR=vec2(" + FW + ".," + FH + ".);" +
    "float h(vec2 q){return fract(sin(dot(q,vec2(12.9898,78.233)))*43758.5453);}" +
    "void main(){vec2 s=uv*scr;vec2 q=(s-T)/S;" +
    /* ciel : nuit + quelques étoiles discrètes */
    "vec3 sky=mix(vec3(.055,.067,.086),vec3(.11,.13,.16),smoothstep(1400.,-600.,q.y)*.6);" +
    "vec2 g=floor(s/3.);float st1=step(.9975,h(g))*(.35+.65*h(g+7.))*(1.-f);sky+=vec3(st1)*.55;" +
    /* le décor de l'accueil apparaît à mesure qu'on s'approche */
    "vec2 fu=q/FR;float inF=step(0.,fu.x)*step(fu.x,1.)*step(0.,fu.y)*step(fu.y,1.);" +
    "float e=smoothstep(0.,.3,min(min(fu.x,1.-fu.x)*1.6,min(fu.y,1.-fu.y)));float a=f*inF*e;" +
    "vec3 still=texture2D(st,clamp(fu,0.,1.)).rgb;" +
    "vec2 d=q-C;float r=length(d);float pa=clamp((R+.5-r)*S,0.,1.);" +
    /* planète : ombrage doux éclairé par la lune (en haut à droite) + texture du sol qui tourne */
    "vec2 n=d/R;float z=sqrt(max(0.,1.-dot(n,n)));float lam=clamp(dot(vec3(n.x,-n.y,z),normalize(vec3(.45,.55,.7))),0.,1.);" +
    "vec3 pb=vec3(.10,.115,.14)+vec3(.20,.22,.26)*lam+vec3(.18)*pow(1.-z,6.)*lam;" +
    "float row=R+6.-r;float rr=mod(row,2.*D);rr=rr>D?2.*D-rr:rr;rr=clamp(rr,1.,D-2.);" +
    "float u=mod(atan(d.x,-d.y)*R-SP*t,BW);float tw=BW/TL;float ti=floor(u/tw);" +
    "float k=texture2D(bd,vec2((u-ti*tw)/tw,(ti*D+rr+.5)/(TL*D))).r;k=mix(.5,k,row<D?1.:.6);" +
    "vec3 gb=mix(pb,still,a);vec3 go=mix(2.*gb*k,1.-2.*(1.-gb)*(1.-k),step(.5,gb));" +
    "vec3 bgc=mix(sky,still,a);vec3 o=mix(bgc,go,pa);gl_FragColor=vec4(o,1.);}";
  function sh(type, src) { var o = gl.createShader(type); gl.shaderSource(o, src); gl.compileShader(o); return o; }
  var pr = gl.createProgram(); gl.attachShader(pr, sh(gl.VERTEX_SHADER, vs)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(pr);
  if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) { end(true); return; }
  gl.useProgram(pr);
  var buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  var loc = gl.getAttribLocation(pr, "p"); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  var U = {}; ["scr", "T", "S", "t", "f"].forEach(function (k) { U[k] = gl.getUniformLocation(pr, k); });
  function tex(unit, img, name) {
    var tx = gl.createTexture(); gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, tx);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    [gl.TEXTURE_WRAP_S, gl.TEXTURE_WRAP_T].forEach(function (w) { gl.texParameteri(gl.TEXTURE_2D, w, gl.CLAMP_TO_EDGE); });
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.uniform1i(gl.getUniformLocation(pr, name), unit);
  }
  var dpr = Math.min(window.devicePixelRatio || 1, 2), W = 0, H = 0;
  function size() { W = window.innerWidth; H = window.innerHeight; cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); gl.viewport(0, 0, cv.width, cv.height); }
  size(); window.addEventListener("resize", size);

  /* caméra : départ = planète entière au centre ; arrivée = exactement le cadrage de l'accueil */
  var HOLD = 900, ZOOM = 2300, FADE = 450;
  var ease = function (x) { return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
  var sm = function (a, b, x) { x = Math.min(1, Math.max(0, (x - a) / (b - a))); return x * x * (3 - 2 * x); };
  var F = { x: 955, y: 540 }; // pieds du robot
  function cam(k) {
    var art = hero.querySelector(".nt-art"), r = art ? art.getBoundingClientRect() : { left: 0, top: 0, width: W };
    var S1 = r.width / FW, T1 = { x: r.left, y: r.top };
    var S0 = Math.min(H * .62, W * .7) / (2 * C.r), T0 = { x: W / 2 - C.cx * S0, y: H * .54 - C.cy * S0 };
    var S = Math.exp(Math.log(S0) + (Math.log(S1) - Math.log(S0)) * k);
    var p0 = { x: T0.x + F.x * S0, y: T0.y + F.y * S0 }, p1 = { x: T1.x + F.x * S1, y: T1.y + F.y * S1 };
    var px = p0.x + (p1.x - p0.x) * k, py = p0.y + (p1.y - p0.y) * k;
    return { S: S, x: px - F.x * S, y: py - F.y * S };
  }
  var t0 = window.ntT0 || (window.ntT0 = performance.now()), start = 0, raf = 0, over = false, ready = 0;
  var band = new Image(), still = new Image();
  function draw(now) {
    if (over) return; raf = requestAnimationFrame(draw);
    if (!start) start = now;
    var el = now - start, k = ease(sm(HOLD, HOLD + ZOOM, el)), c = cam(k), f = sm(.62, 1, k);
    gl.uniform2f(U.scr, W, H); gl.uniform2f(U.T, c.x, c.y); gl.uniform1f(U.S, c.S); gl.uniform1f(U.t, (now - t0) / 1000); gl.uniform1f(U.f, f);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    rob.style.transform = "translate(" + (c.x + P.rob.x * c.S) + "px," + (c.y + P.rob.y * c.S) + "px)";
    rob.style.width = (P.rob.w * c.S) + "px";
    if (el >= HOLD + ZOOM) end(false);
  }
  function go() { if (++ready < 2) return; tex(0, still, "st"); tex(1, band, "bd"); ov.classList.add("on"); raf = requestAnimationFrame(draw); }
  still.onload = go; band.onload = go; still.src = P.dir + P.still; band.src = P.dir + P.band;

  function end(quick) {
    if (over) return; over = true; cancelAnimationFrame(raf);
    ["wheel", "touchmove", "keydown"].forEach(function (ev) { window.removeEventListener(ev, skipNow); });
    root.classList.remove("nt-intro"); count();
    ov.classList.add("out"); setTimeout(function () { ov.remove(); }, quick ? 260 : FADE + 50);
    if (quick) ov.style.transitionDuration = ".25s";
  }
  function skipNow(e) { if (e && e.type === "keydown" && ["Tab", "Shift"].indexOf(e.key) > -1) return; end(true); }
  ov.addEventListener("click", function () { end(true); });
  ["wheel", "touchmove", "keydown"].forEach(function (ev) { window.addEventListener(ev, skipNow, { passive: true }); });
  setTimeout(function () { if (!ready || ready < 2) end(true); }, 6000);
  /* pour l'aperçu : rejouer une image précise */
  window.ntIntroSeek = function (ms) { over = true; cancelAnimationFrame(raf); var now = (start || performance.now()); var save = start; start = now - ms; over = false; draw(now); over = true; cancelAnimationFrame(raf); start = save; };
})();
