(function () {
  "use strict";

  var C = window.CONTENT;
  var S = window.SITE;
  var TOOLS = window.TOOLS || [];
  var lang = "fr";
  var step = 0;
  var activeStep = null;
  var activeTool = null;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- helpers ---------- */
  function $(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function get(obj, path) {
    return path.split(".").reduce(function (o, k) { return o ? o[k] : undefined; }, obj);
  }
  function link(target) {
    var map = { "@notion": S.notionBacklog, "@dashboard": S.dashboardF1, "@repoF1": S.repoF1, "@repoSite": S.repoSite };
    if (map[target]) return { href: map[target], ext: true };
    return { href: target + "?lang=" + lang, ext: false };
  }

  /* ---------- language ---------- */
  function initialLang() {
    var q = new URLSearchParams(location.search).get("lang");
    if (q === "fr" || q === "en") return q;
    try {
      var saved = localStorage.getItem("lang");
      if (saved === "fr" || saved === "en") return saved;
    } catch (e) { /* storage unavailable */ }
    return (navigator.language || "fr").toLowerCase().indexOf("fr") === 0 ? "fr" : "en";
  }

  function setLang(l) {
    lang = l;
    try { localStorage.setItem("lang", l); } catch (e) { /* ignore */ }
    var T = C[l];
    document.documentElement.lang = l;
    var page = document.body.getAttribute("data-page");
    var meta = (page && T[page] && T[page].meta) || T.meta;
    document.title = meta.title;
    var md = document.querySelector('meta[name="description"]');
    if (md) md.setAttribute("content", meta.description);

    var url = new URL(location.href);
    url.searchParams.set("lang", l);
    try { history.replaceState(null, "", url); } catch (e) { /* ignore */ }

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var v = get(T, el.getAttribute("data-i18n"));
      if (typeof v === "string") el.textContent = v;
    });
    document.querySelectorAll("[data-i18n-label]").forEach(function (el) {
      var v = get(T, el.getAttribute("data-i18n-label"));
      if (typeof v === "string") el.setAttribute("aria-label", v);
    });
    document.querySelectorAll(".lang button").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-lang") === l));
    });

    var cv = $("cv-link");
    if (cv) { if (S.cv[l]) { cv.setAttribute("href", S.cv[l]); cv.hidden = false; } else { cv.hidden = true; } }
    document.querySelectorAll("[data-href]").forEach(function (a) {
      var k = a.getAttribute("data-href");
      var v = k === "mail" ? "mailto:" + S.email : S[k];
      if (v) a.setAttribute("href", v);
    });
    document.querySelectorAll("[data-langlink]").forEach(function (a) {
      a.setAttribute("href", a.getAttribute("data-langlink") + "?lang=" + l + (a.getAttribute("data-hash") || ""));
    });

    if ($("skills-frise")) { renderAbout(T); renderSkills(T); renderWork(T); renderPath(T); }
    if ($("demo-steps")) renderDemo();
    if ($("f1-root")) renderF1(T);
    if ($("bl-root")) renderBacklog(T);
    if ($("me-root")) renderMethode(T);
  }

  /* ---------- home: about ---------- */
  function renderAbout(T) {
    $("about-body").innerHTML = T.about.body.map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("");
    $("about-facts").innerHTML = (T.about.facts || []).map(function (f, i) {
      return '<div class="st" style="--i:' + i + '"><dt>' + esc(f[0]) + "</dt><dd>" + esc(f[1]) + "</dd></div>";
    }).join("");
  }

  /* ---------- home: skills (frise verticale + boîte à outils) ---------- */
  function toolIcon(t) {
    if (t.path) return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="' + t.path + '"/></svg>' +
      (t.extra ? '<svg class="extra" viewBox="0 0 24 24" aria-hidden="true" style="--brand:' + t.extra.color + '"><path d="' + t.extra.path + '"/></svg>' : "");
    return '<span class="mono" aria-hidden="true">' + esc(t.mono) + "</span>";
  }

  function stepHTML(s, dot, cls) {
    return '<button type="button" class="step' + (cls || "") + '" data-step="' + s.id + '" aria-expanded="false">' +
      '<span class="dot">' + dot + '</span><span class="step-head"><span class="step-name">' + esc(s.name) + '</span><span class="step-tag">' + esc(s.tag) + "</span></span>" +
      '<span class="chev" aria-hidden="true"></span></button>' +
      '<div class="step-text"><div><p>' + esc(s.text) + "</p></div></div>";
  }

  function renderSkills(T) {
    var K = T.skills;
    $("skills-frise").innerHTML =
      '<div class="track" aria-hidden="true"><span class="fill" id="frise-fill"></span></div>' +
      K.steps.map(function (s, i) { return '<li class="st" style="--i:' + i + '">' + stepHTML(s, i + 1) + "</li>"; }).join("");
    $("skills-auto").innerHTML = '<div class="st" style="--i:4">' + stepHTML(K.auto, "∞", " auto") + "</div>";

    var n = 0;
    $("toolbox").innerHTML = K.cats.map(function (c) {
      return '<div class="tool-cat"><h4>' + esc(c[1]) + '</h4><ul class="tool-grid">' +
        TOOLS.filter(function (t) { return t.cat === c[0]; }).map(function (t) {
          n++;
          return '<li class="st" style="--i:' + Math.min(n * 0.6, 14).toFixed(1) + '"><button type="button" class="tool-btn" data-tool="' + t.id + '" style="--brand:' + t.color + '" aria-pressed="false">' +
            '<span class="tool-logo">' + toolIcon(t) + '</span><span class="tool-name">' + esc(t.name) + "</span></button></li>";
        }).join("") + "</ul></div>";
    }).join("");

    document.querySelectorAll("#skills .step").forEach(function (b) {
      b.addEventListener("click", function () { selectStep(b.getAttribute("data-step")); });
    });
    document.querySelectorAll(".tool-btn").forEach(function (b) {
      b.addEventListener("click", function (e) { e.stopPropagation(); selectTool(b.getAttribute("data-tool")); });
    });
    var s = activeStep, t = activeTool;
    activeStep = activeTool = null;
    if (t) selectTool(t); else selectStep(s || null, true);
  }

  function allSteps(K) { return K.steps.concat([K.auto]); }

  function setUse(html) {
    var u = $("tool-use");
    u.innerHTML = html;
    u.classList.remove("swap"); void u.offsetWidth; u.classList.add("swap");
  }

  function selectStep(id, silent) {
    var K = C[lang].skills;
    if (!silent && id === activeStep) id = null;
    activeStep = id; activeTool = null;
    var ids = K.steps.map(function (s) { return s.id; });
    var idx = ids.indexOf(id);
    document.querySelectorAll("#skills .step").forEach(function (b) {
      var on = b.getAttribute("data-step") === id;
      b.classList.toggle("on", on); b.classList.remove("lit");
      b.classList.toggle("done", idx > 0 && ids.indexOf(b.getAttribute("data-step")) >= 0 && ids.indexOf(b.getAttribute("data-step")) < idx);
      b.setAttribute("aria-expanded", String(on));
      b.parentNode.classList.toggle("open", on);
    });
    var fill = $("frise-fill");
    if (fill) fill.style.height = idx < 0 ? "0%" : (idx / (ids.length - 1) * 100) + "%";
    var count = 0;
    document.querySelectorAll(".tool-btn").forEach(function (b) {
      var tool = TOOLS.filter(function (t) { return t.id === b.getAttribute("data-tool"); })[0];
      var lit = id && tool.steps.indexOf(id) >= 0;
      if (lit) count++;
      b.classList.toggle("lit", !!lit);
      b.classList.toggle("dim", !!id && !lit);
      b.classList.remove("sel"); b.setAttribute("aria-pressed", "false");
    });
    var st = allSteps(K).filter(function (s) { return s.id === id; })[0];
    setUse(st ? "<b>" + esc(st.name) + "</b> · " + count + " " + esc(K.stepCount) : esc(K.toolHint));
  }

  function selectTool(id) {
    var K = C[lang].skills;
    if (id === activeTool) { selectStep(null, true); return; }
    activeTool = id; activeStep = null;
    var tool = TOOLS.filter(function (t) { return t.id === id; })[0];
    document.querySelectorAll("#skills .step").forEach(function (b) {
      b.classList.remove("on", "done");
      b.classList.toggle("lit", tool.steps.indexOf(b.getAttribute("data-step")) >= 0);
      b.setAttribute("aria-expanded", "false");
      b.parentNode.classList.remove("open");
    });
    var fill = $("frise-fill"); if (fill) fill.style.height = "0%";
    document.querySelectorAll(".tool-btn").forEach(function (b) {
      var me = b.getAttribute("data-tool") === id;
      b.classList.toggle("sel", me); b.classList.toggle("dim", !me); b.classList.remove("lit");
      b.setAttribute("aria-pressed", String(me));
    });
    var names = allSteps(K).filter(function (s) { return tool.steps.indexOf(s.id) >= 0; }).map(function (s) { return '<span class="use-step">' + esc(s.name) + "</span>"; }).join("");
    setUse("<b>" + esc(tool.name) + "</b> · " + esc(K.uses[id] || "") + ' <span class="use-steps">' + names + "</span>");
  }

  /* ---------- home: projects + modal ---------- */
  function thumb(p) {
    if (p.img) return '<span class="thumb"><img src="' + esc(p.img) + '" alt=""></span>';
    if (p.id === "methode") return '<span class="thumb thumb-phases" aria-hidden="true">' + p.tags.map(function (t, i) { return '<span style="--i:' + i + '">' + esc(t) + "</span>"; }).join("") + "</span>";
    return '<span class="thumb thumb-browser" aria-hidden="true"><span class="bar"><i></i><i></i><i></i><b>adrienmateo-soules.com</b></span><span class="page"><span class="l1"></span><span class="l2"></span><span class="l3"></span><span class="ph"></span></span></span>';
  }

  function renderWork(T) {
    $("work-list").innerHTML = '<ol class="pj-list">' + T.work.projects.map(function (p, i) {
      return '<li class="st" style="--i:' + (i * 2) + '"><button type="button" class="pj-row" data-project="' + p.id + '">' +
        '<span class="pj-thumb" aria-hidden="true">' + thumb(p) + '</span><span class="pj-n">0' + (i + 1) + '</span>' +
        '<span class="pj-title">' + esc(p.title) + '</span><span class="pj-text">' + esc(p.text) + '</span>' +
        '<span class="pj-kind">' + esc(p.kind) + '</span><span class="pj-arrow" aria-hidden="true"></span></button></li>';
    }).join("") + "</ol>";
    var peek = $("peek");
    var fine = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    var calm = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var tx = 0, ty = 0, x = 0, y = 0, raf = null;
    function loop() {
      x += (tx - x) * 0.18; y += (ty - y) * 0.18;
      peek.style.left = x + "px"; peek.style.top = y + "px";
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.5 ? requestAnimationFrame(loop) : null;
    }
    document.querySelectorAll(".pj-row").forEach(function (b) {
      b.addEventListener("click", function () { peek.classList.remove("on"); openProject(b.getAttribute("data-project")); });
      if (!peek || !fine) return;
      b.addEventListener("mouseenter", function (e) {
        if (window.innerWidth < 900) return;
        var p = T.work.projects.filter(function (q) { return q.id === b.getAttribute("data-project"); })[0];
        peek.innerHTML = thumb(p);
        tx = x = e.clientX + 170; ty = y = e.clientY;
        peek.style.left = x + "px"; peek.style.top = y + "px";
        peek.classList.add("on");
      });
      b.addEventListener("mousemove", function (e) {
        tx = e.clientX + 170; ty = e.clientY;
        if (calm) { x = tx; y = ty; peek.style.left = x + "px"; peek.style.top = y + "px"; }
        else if (!raf) raf = requestAnimationFrame(loop);
      });
      b.addEventListener("mouseleave", function () { peek.classList.remove("on"); });
    });
  }

  /* ---------- hero: fil rouge entre le nom et la photo ---------- */
  function drawThread(animate) {
    var svg = $("thread"), path = $("thread-path"), last = $("name-last"), img = document.querySelector(".portrait img");
    if (!svg || !last || !img) return;
    if (window.innerWidth < 900) { svg.style.display = "none"; return; }
    svg.style.display = "";
    var H = svg.getBoundingClientRect(), L = last.parentNode.getBoundingClientRect(), P = img.parentNode.getBoundingClientRect();
    var sx = L.left - H.left + last.offsetWidth + 22, sy = L.top - H.top + L.height * 0.55;
    var ex = P.left - H.left - 14, ey = P.top - H.top + P.height * 0.5;
    var mx = (ex - sx) * 0.55;
    path.setAttribute("d", "M" + sx + "," + sy + " C" + (sx + mx) + "," + sy + " " + (ex - mx) + "," + ey + " " + ex + "," + ey);
    var n1 = svg.querySelector(".n1"), n2 = svg.querySelector(".n2");
    n1.setAttribute("cx", sx); n1.setAttribute("cy", sy); n2.setAttribute("cx", ex); n2.setAttribute("cy", ey);
    var len = path.getTotalLength();
    path.style.strokeDasharray = len; svg.style.setProperty("--len", len);
    if (animate) { path.style.strokeDashoffset = len; void path.getBoundingClientRect(); svg.classList.add("go"); }
    path.style.strokeDashoffset = 0;
    if (!svg._pulse) startPulse(svg, path);
  }

  function startPulse(svg, path) {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var dot = svg.querySelector(".pulse"), t0 = null, DUR = 1600, GAP = 2600, START = 2200;
    svg._pulse = true;
    function tick(t) {
      if (t0 === null) t0 = t + START;
      var k = (t - t0) % (DUR + GAP);
      if (t < t0 || k > DUR || svg.style.display === "none") { dot.style.opacity = 0; }
      else {
        var e = k / DUR, ease = e < .5 ? 2 * e * e : 1 - Math.pow(-2 * e + 2, 2) / 2;
        var pt = path.getPointAtLength(ease * path.getTotalLength());
        dot.setAttribute("cx", pt.x); dot.setAttribute("cy", pt.y);
        dot.style.opacity = Math.min(1, Math.sin(e * Math.PI) * 2);
      }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function openProject(id) {
    var T = C[lang], p = T.work.projects.filter(function (x) { return x.id === id; })[0];
    var m = $("modal");
    $("modal-body").innerHTML = thumb(p) +
      '<div class="modal-text"><span class="tile-kind">' + esc(p.kind) + '</span><h2 id="modal-title">' + esc(p.title) + "</h2><p>" + esc(p.summary) + "</p>" +
      '<p class="proves"><span>' + esc(T.work.shows) + "</span> " + esc(p.shows) + '</p><ul class="tags">' + p.tags.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + '</ul><div class="actions">' +
      p.links.map(function (l) {
        var k = link(l[0]);
        return '<a class="btn' + (l[2] ? " primary" : "") + '" href="' + esc(k.href) + '"' + (k.ext ? ' target="_blank" rel="noopener"' : "") + ">" + esc(l[1]) + "</a>";
      }).join("") + "</div></div>";
    if (typeof m.showModal === "function") m.showModal(); else m.setAttribute("open", "");
  }

  var FLAGS = {
    fr: '<svg viewBox="0 0 3 2" preserveAspectRatio="none" aria-hidden="true"><rect width="1" height="2" fill="#002654"/><rect x="1" width="1" height="2" fill="#fff"/><rect x="2" width="1" height="2" fill="#CE1126"/></svg>',
    es: '<svg viewBox="0 0 3 2" preserveAspectRatio="none" aria-hidden="true"><rect width="3" height="2" fill="#AA151B"/><rect y=".5" width="3" height="1" fill="#F1BF00"/></svg>',
    gb: '<svg viewBox="0 0 60 30" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><clipPath id="gb-t"><path d="M30,15h30v15zv15h-30zh-30v-15zv-15h30z"/></clipPath><rect width="60" height="30" fill="#012169"/><path d="M0,0 60,30M60,0 0,30" stroke="#fff" stroke-width="6"/><path d="M0,0 60,30M60,0 0,30" clip-path="url(#gb-t)" stroke="#C8102E" stroke-width="4"/><path d="M30,0v30M0,15h60" stroke="#fff" stroke-width="10"/><path d="M30,0v30M0,15h60" stroke="#C8102E" stroke-width="6"/></svg>'
  };
  function badge(x) {
    return '<span class="org-logo" aria-hidden="true">' + (x.logo ? '<img src="' + esc(x.logo) + '" alt="">' : "<b>" + esc(x.mono || "") + "</b>") + "</span>";
  }
  function renderPath(T) {
    $("timeline").innerHTML = T.path.timeline.map(function (t, i) {
      return '<li class="st" style="--i:' + i + '">' + badge(t) + '<div><span class="when">' + esc(t.when) + "</span><h4>" + esc(t.role) +
        ' <span class="org">' + esc(t.org) + "</span></h4><p>" + esc(t.text) + "</p></div></li>";
    }).join("");
    $("education").innerHTML = T.path.education.map(function (e, i) {
      return '<li class="st" style="--i:' + (i + 2) + '">' + badge(e) + "<div><strong>" + esc(e.name) + "</strong><span>" + esc(e.text) + "</span></div></li>";
    }).join("");
    $("languages").innerHTML = T.path.languages.map(function (l, i) {
      return '<li class="st lang-item" style="--i:' + (i + 5) + '"><span class="flag">' + (FLAGS[l[2]] || "") + "</span><div><strong>" + esc(l[0]) + "</strong><span>" + esc(l[1]) + "</span></div></li>";
    }).join("");
  }


  /* ---------- method page ---------- */
  function renderMethode(T) {
    var M = T.methode;
    $("me-phases").innerHTML = M.phases.map(function (p, i) {
      return '<li class="phase reveal in" style="--i:' + i + '"><span class="phase-n">' + (i + 1) + "</span><h3>" + esc(p[0]) + "</h3><dl>" +
        "<dt>" + esc(M.cols[0]) + "</dt><dd>" + esc(p[1]) + "</dd><dt>" + esc(M.cols[1]) + "</dt><dd>" + esc(p[2]) + "</dd><dt>" + esc(M.cols[2]) + "</dt><dd>" + esc(p[3]) + "</dd></dl></li>";
    }).join("");
    $("me-principles").innerHTML = M.principles.map(function (p) { return "<li>" + esc(p) + "</li>"; }).join("");
  }

  /* ---------- F1 project page ---------- */
  function box(x, y, w, h, lines, cls) {
    var out = '<g class="d-box' + (cls ? " " + cls : "") + '"><rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="6"/>';
    var lh = 13, total = 15 + (lines.length - 1) * lh;
    var y0 = y + (h - total) / 2 + 11;
    lines.forEach(function (t, i) {
      out += '<text x="' + (x + w / 2) + '" y="' + (i === 0 ? y0 : y0 + 4 + i * lh) + '" class="' + (i === 0 ? "d-t" : "d-s") + '">' + esc(t) + "</text>";
    });
    return out + "</g>";
  }
  function arrow(pts, cls) {
    return '<polyline class="d-line' + (cls ? " " + cls : "") + '" points="' + pts + '" marker-end="url(#d-arrow' + (cls === "d-same" ? "-acc" : "") + ')"/>';
  }
  function label(x, y, t, anchor, cls) {
    return '<text class="d-l' + (cls ? " " + cls : "") + '" x="' + x + '" y="' + y + '" text-anchor="' + (anchor || "start") + '">' + esc(t) + "</text>";
  }

  function diagram(D) {
    var L = D.l, s = "";
    s += '<svg class="arch" viewBox="0 0 1000 640" role="img" aria-label="' + esc(C[lang].f1.archTitle) + '">';
    s += '<defs><marker id="d-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="d-head"/></marker>' +
         '<marker id="d-arrow-acc" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="d-head-acc"/></marker></defs>';
    s += '<rect class="d-panel" x="225" y="12" width="765" height="245" rx="10"/>' + label(975, 36, D.top, "end", "d-panel-l");
    s += '<rect class="d-panel" x="225" y="272" width="765" height="356" rx="10"/>' + label(975, 296, D.bottom, "end", "d-panel-l");
    s += box(20, 45, 170, 50, D.chrono);
    s += box(20, 290, 170, 78, D.openf1, "d-key");
    s += box(245, 45, 155, 50, D.pages);
    s += box(245, 135, 155, 82, D.browser);
    s += box(470, 135, 200, 82, D.site);
    s += box(740, 135, 230, 82, D.archive);
    s += box(245, 304, 155, 64, D.archiveJob);
    s += box(470, 304, 190, 74, D.store);
    s += box(245, 410, 110, 42, D.me);
    s += box(245, 478, 155, 82, D.report);
    s += box(470, 492, 115, 54, D.make);
    s += box(640, 492, 135, 54, D.claude);
    s += box(830, 432, 150, 50, D.gmail);
    s += box(830, 556, 150, 50, D.sheets);
    s += arrow("105,95 105,288") + label(97, 245, L.records, "end");
    s += arrow("322,95 322,133") + label(330, 119, L.sert);
    s += arrow("400,165 468,165") + label(434, 158, L.affiche, "middle");
    s += arrow("400,200 440,200 440,240 855,240 855,219") + label(700, 233, L.first, "middle");
    s += arrow("245,190 150,190 150,288") + label(158, 183, L.fetch);
    s += arrow("245,336 192,336") + label(218, 329, L.calls, "middle");
    s += arrow("400,336 468,336");
    s += arrow("660,336 900,336 900,219") + label(780, 329, L.commit, "middle");
    s += arrow("380,217 380,302", "d-same") + label(374, 262, L.same, "end", "d-acc") + label(374, 276, L.same2, "end", "d-acc");
    s += arrow("380,368 380,476", "d-same");
    s += arrow("300,452 300,476") + label(307, 468, L.launches);
    s += arrow("245,520 120,520 120,370") + label(182, 513, L.calls, "middle");
    s += arrow("400,519 468,519") + label(434, 512, L.post, "middle");
    s += arrow("585,519 638,519") + label(611, 512, L.facts, "middle");
    s += arrow("775,508 805,508 805,457 828,457") + label(800, 485, L.summary, "end");
    s += arrow("775,530 805,530 805,581 828,581") + label(800, 566, L.iter, "end");
    s += arrow("322,560 322,618 990,618 990,447 982,447", "d-dash") + label(656, 612, L.fallback, "middle");
    return s + "</svg>";
  }

  function renderF1(T) {
    var F = T.f1;
    $("f1-goals").innerHTML = F.goals.map(function (g, i) {
      return '<article class="goal"><span class="goal-n">' + (i + 1) + "</span><h3>" + esc(g.title) + "</h3><p>" + esc(g.text) + "</p></article>";
    }).join("");
    $("f1-hero-img").setAttribute("alt", F.heroAlt);
    $("f1-gallery").innerHTML = F.gallery.map(function (g) {
      return '<figure class="shot-card"><a href="' + esc(g.img) + '" target="_blank" rel="noopener"><img src="' + esc(g.img) + '" alt="' + esc(g.title) + '" loading="lazy"></a><figcaption><strong>' + esc(g.title) + "</strong><span>" + esc(g.text) + "</span></figcaption></figure>";
    }).join("");
    $("f1-traits").innerHTML = F.traits.map(function (t) {
      return "<li><h3>" + esc(t[0]) + "</h3><p>" + esc(t[1]) + "</p></li>";
    }).join("");
    $("f1-arch").innerHTML = diagram(F.diagram);
    $("f1-make-img").setAttribute("alt", F.makeAlt);
    $("f1-choices").innerHTML = F.choices.map(function (c) {
      return "<li><h3>" + esc(c[0]) + "</h3><p>" + esc(c[1]) + "</p></li>";
    }).join("");
    $("f1-stack").innerHTML = F.stack.map(function (t) {
      return '<li><span class="tool">' + esc(t[0]) + '</span><span class="use">' + esc(t[1]) + "</span></li>";
    }).join("");
  }

  /* ---------- backlog case study page ---------- */
  function list(arr) { return arr.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join(""); }

  function renderBacklog(T) {
    var B = T.backlog;
    document.querySelectorAll(".notion-link").forEach(function (a) { a.setAttribute("href", S.notionBacklog); });
    $("bl-problem").innerHTML = list(B.problem);
    $("bl-approach").innerHTML = B.approach.map(function (a) {
      return "<li><h3>" + esc(a[0]) + "</h3><p>" + esc(a[1]) + "</p></li>";
    }).join("");
    $("bl-sprint").innerHTML = "<thead><tr><th>" + esc(B.sprintCols[0]) + "</th><th></th><th>" + esc(B.sprintCols[1]) + '</th><th class="num">' + esc(B.sprintCols[2]) + "</th></tr></thead><tbody>" +
      B.sprint.map(function (r) {
        return '<tr><td class="code-id">' + esc(r[0]) + "</td><td>" + esc(r[1]) + "</td><td>" + esc(r[2]) + '</td><td class="num">' + r[3] + "</td></tr>";
      }).join("") + '</tbody><tfoot><tr><td colspan="3">' + esc(B.sprintTotal) + '</td><td class="num">' + esc(B.sprintCapacity) + "</td></tr></tfoot>";
    $("bl-wf").innerHTML = B.wf.map(function (w) {
      return '<figure class="wf"><a href="' + esc(w.img) + '" target="_blank" rel="noopener"><img src="' + esc(w.img) + '" alt="' + esc(w.title) + '" loading="lazy"></a>' +
        "<figcaption><h3>" + esc(w.title) + '</h3><ol class="markers">' + list(w.notes) + "</ol></figcaption></figure>";
    }).join("");
  }

  /* ---------- demo: stuck order investigation ---------- */
  var LOGS = [
    ["09:41:02.114", "INFO",  "order-service", "order.created id=FR-48213 channel=web items=2"],
    ["09:41:02.530", "INFO",  "stock-service", "stock.reserved id=FR-48213 location=WH-LYON"],
    ["09:41:03.002", "INFO",  "routing",       "carrier.selected id=FR-48213 carrier=EXPRESSO default=true"],
    ["09:41:03.418", "ERROR", "shipping",      "shipment.create failed id=FR-48213 http=422"],
    ["09:41:03.420", "WARN",  "shipping",      "retry.skipped id=FR-48213 reason=non_retryable"],
    ["09:41:03.421", "INFO",  "order-service", "order.status id=FR-48213 status=AWAITING_SHIPMENT"]
  ];
  var ERROR_ROW = 3;

  var PAYLOAD = [
    ['POST /v2/shipments', false],
    ['{', false],
    ['  "order_id": "FR-48213",', false],
    ['  "carrier": "EXPRESSO",', false],
    ['  "service": "STANDARD",', false],
    ['  "parcels": [{ "weight_kg": 1.8 }],', false],
    ['  "recipient": {', false],
    ['    "city": "Ajaccio",', false],
    ['    "postcode": "20000",', true],
    ['    "country": "FR"', false],
    ['  }', false],
    ['}', false]
  ];
  var RESPONSE = [
    ['HTTP/1.1 422 Unprocessable Entity', true],
    ['{', false],
    ['  "error": "UNSERVICEABLE_AREA",', true],
    ['  "message": "Destination postcode not served"', false],
    ['}', false]
  ];

  function codeBlock(lines) {
    return '<pre class="code"><code>' + lines.map(function (l) {
      return '<span class="ln' + (l[1] ? " hit" : "") + '">' + esc(l[0]) + "</span>";
    }).join("") + "</code></pre>";
  }

  function renderDemo() {
    var D = C[lang].demo;
    $("demo-steps").innerHTML = D.steps.map(function (s, i) {
      return '<li><button type="button" role="tab" data-step="' + i + '" aria-selected="' + (i === step) + '"' +
        (i === step ? ' class="on"' : "") + '><span class="n">' + (i + 1) + "</span>" + esc(s) + "</button></li>";
    }).join("");

    var html = "";
    if (step === 0) {
      html = '<p class="intro">' + esc(D.logsIntro) + '</p><div class="logs" role="list">' +
        LOGS.map(function (r, i) {
          var cls = "log lvl-" + r[1].toLowerCase();
          var inner = '<span class="t">' + r[0] + '</span><span class="l">' + r[1] + '</span><span class="s">' +
            r[2] + '</span><span class="m">' + esc(r[3]) + "</span>";
          return i === ERROR_ROW
            ? '<button type="button" role="listitem" class="' + cls + ' clickable" id="error-row">' + inner + "</button>"
            : '<div role="listitem" class="' + cls + '">' + inner + "</div>";
        }).join("") + "</div>";
    } else if (step === 1) {
      html = '<p class="intro">' + esc(D.payloadIntro) + "</p>" + codeBlock(PAYLOAD) +
        '<p class="flag">' + esc(D.payloadFlag) + "</p>" +
        '<p class="intro">' + esc(D.responseIntro) + "</p>" + codeBlock(RESPONSE);
    } else if (step === 2) {
      html = '<ol class="diag">' + D.diagnosis.map(function (d) { return "<li>" + esc(d) + "</li>"; }).join("") + "</ol>";
    } else {
      html = '<div class="fix"><div><h4>' + esc(D.techTitle) + "</h4><ul>" +
        D.tech.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") +
        '</ul><pre class="code"><code><span class="ln ok">HTTP/1.1 201 Created</span><span class="ln">{ "shipment_id": "SHP-77120", "carrier": "ISLANDEX" }</span></code></pre></div>' +
        "<div><h4>" + esc(D.bizTitle) + '</h4><blockquote>' + esc(D.biz) + "</blockquote></div></div>";
    }
    $("demo-body").innerHTML = html;

    $("demo-prev").disabled = step === 0;
    $("demo-next").textContent = step === 3 ? D.restart : D.next;

    var err = $("error-row");
    if (err) err.addEventListener("click", function () { go(1); });
    document.querySelectorAll("#demo-steps button").forEach(function (b) {
      b.addEventListener("click", function () { go(Number(b.getAttribute("data-step"))); });
    });
  }

  function go(n) {
    step = Math.max(0, Math.min(3, n));
    renderDemo();
  }

  /* ---------- page behaviors ---------- */
  function initChrome() {
    var bar = document.querySelector(".topbar");
    var prog = $("progress"), photo = document.querySelector(".portrait img");
    var calm = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var ticking = false;
    function frame() {
      ticking = false;
      var y = window.scrollY, max = document.documentElement.scrollHeight - window.innerHeight;
      if (prog) prog.style.transform = "scaleX(" + (max > 0 ? Math.min(1, y / max) : 0) + ")";
      if (photo && !calm && window.innerWidth > 900) photo.style.transform = "translateY(" + Math.min(y * 0.12, 80) + "px)";
    }
    function onScroll() {
      if (bar) bar.classList.toggle("scrolled", window.scrollY > 8);
      if (!ticking) { ticking = true; requestAnimationFrame(frame); }
    }
    window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
      }, { threshold: 0.12 });
      document.querySelectorAll(".reveal:not(.in)").forEach(function (el) { io.observe(el); });

      var links = document.querySelectorAll(".nav a[href^='#']");
      if (links.length) {
        var spy = new IntersectionObserver(function (es) {
          es.forEach(function (e) {
            if (e.isIntersecting) links.forEach(function (a) { a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id); });
          });
        }, { rootMargin: "-45% 0px -50% 0px" });
        links.forEach(function (a) { var s = document.querySelector(a.getAttribute("href")); if (s) spy.observe(s); });
      }
    } else {
      document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("in"); });
    }

    var m = $("modal");
    if (m) {
      m.addEventListener("click", function (e) { if (e.target === m) m.close(); });
      $("modal-close").addEventListener("click", function () { m.close(); });
    }
    document.addEventListener("click", function (e) {
      if (activeTool && !e.target.closest(".tool-btn")) selectStep(null, true);
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && activeTool) selectStep(null, true); });
  }

  /* ---------- init ---------- */
  document.querySelectorAll(".lang button").forEach(function (b) {
    b.addEventListener("click", function () { setLang(b.getAttribute("data-lang")); });
  });
  if ($("demo-prev")) {
    $("demo-prev").addEventListener("click", function () { go(step - 1); });
    $("demo-next").addEventListener("click", function () { go(step === 3 ? 0 : step + 1); });
  }
  setLang(initialLang());
  initChrome();
  if ($("thread")) {
    var go = function () { drawThread(true); };
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { setTimeout(go, 60); }); else setTimeout(go, 200);
    var rt; window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(function () { drawThread(false); }, 120); });
  }
  document.documentElement.classList.add("ready");
})();
