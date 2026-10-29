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
  // texte avec **gras** : échappé puis converti en <strong>
  function rich(s) { return esc(s).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>"); }
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
  var STAT_ICONS = {
    exp: '<path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M3 13h18"/>',
    proj: '<path d="M12 3 3 8l9 5 9-5-9-5Z"/><path d="m3 13 9 5 9-5"/>',
    ai: '<path d="M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8L12 3Z"/><path d="M18 15l.8 2.2L21 18l-2.2.8L18 21l-.8-2.2L15 18l2.2-.8L18 15Z"/>',
    acc: '<circle cx="9" cy="8" r="3.2"/><path d="M3.5 19c.6-3 2.8-4.6 5.5-4.6s4.9 1.6 5.5 4.6"/><path d="M16 5.2a3 3 0 0 1 0 5.6M18 14.6c1.4.6 2.3 2 2.6 4.4"/>',
    pin: '<path d="M12 21s-6.5-5.6-6.5-11A6.5 6.5 0 0 1 18.5 10c0 5.4-6.5 11-6.5 11Z"/><circle cx="12" cy="10" r="2.3"/>',
    lang: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.6 2.6 3.8 5.6 3.8 9s-1.2 6.4-3.8 9c-2.6-2.6-3.8-5.6-3.8-9S9.4 5.6 12 3Z"/>'
  };
  function renderStats(T) {
    var el = $("hero-stats"); if (!el) return;
    el.innerHTML = (T.hero.stats || []).map(function (s) {
      return '<li' + (s[2] ? ' class="tbd"' : "") + '><svg viewBox="0 0 24 24" aria-hidden="true">' + (STAT_ICONS[s[0]] || "") + "</svg>" + rich(s[1]) + "</li>";
    }).join("");
  }

  var PILLAR_ICONS = {
    need: '<path d="M4 5h16v10H9l-5 4V5Z"/><path d="M8 9h8M8 12h5"/>',
    config: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1"/>',
    adopt: '<path d="M5 13l4 4L19 7"/><path d="M3 21h18"/>',
    ai: '<path d="M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8L12 3Z"/><path d="M18 15l.8 2.2L21 18l-2.2.8L18 21l-.8-2.2L15 18l2.2-.8L18 15Z"/>'
  };
  function renderPillars(T) {
    var el = $("pillars"); if (!el || !T.about.pillars) return;
    el.innerHTML = T.about.pillars.map(function (p, i) {
      return '<article class="pillar st' + (p.id === "ai" ? " is-ai" : "") + '" style="--i:' + i + '">' +
        '<div class="pillar-head"><span class="pillar-ic"><svg viewBox="0 0 24 24" aria-hidden="true">' + (PILLAR_ICONS[p.id] || "") + '</svg></span><span class="pillar-n">0' + (i + 1) + "</span></div>" +
        "<h3>" + esc(p.title) + '</h3><ul>' + p.points.map(function (x) { return "<li>" + rich(x) + "</li>"; }).join("") + "</ul></article>";
    }).join("");
  }

  function renderAbout(T) {
    renderStats(T);
    renderPillars(T);
    $("about-body").innerHTML = T.about.body.map(function (p) { return "<p>" + rich(p) + "</p>"; }).join("");
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
      '<div class="step-text"><div><p>' + rich(s.text) + "</p></div></div>";
  }

  function renderSkills(T) {
    var K = T.skills;
    $("skills-frise").innerHTML =
      '<div class="track" aria-hidden="true"><span class="fill" id="frise-fill"></span></div>' +
      K.steps.map(function (s, i) { return '<li class="st" style="--i:' + i + '">' + stepHTML(s, i + 1) + "</li>"; }).join("");
    $("skills-auto").innerHTML = '<div class="st" style="--i:4">' + stepHTML(K.auto, "∞", " auto") + "</div>";
    if ($("skills-method") && K.method) {
      var ph = K.method.phases, xs = [20, 110, 200, 290];
      var art = '<svg class="method-art" viewBox="0 0 310 64" aria-hidden="true"><line class="m-track" x1="20" y1="20" x2="290" y2="20"/><line class="m-prog" x1="20" y1="20" x2="290" y2="20"/>' +
        xs.map(function (x) { return '<circle class="m-node" cx="' + x + '" cy="20" r="7"/>'; }).join("") +
        '<circle class="m-dot" cx="20" cy="20" r="3.5"/>' +
        xs.map(function (x, i) { return '<text class="m-label" x="' + x + '" y="46">' + esc(ph[i][0]) + '</text><text class="m-sub" x="' + x + '" y="60">' + esc(ph[i][1]) + "</text>"; }).join("") + "</svg>";
      $("skills-method").innerHTML = '<a class="method-band" href="methode.html?lang=' + lang + '">' +
        '<span class="method-ic" aria-hidden="true"><i></i><i></i><i></i><i></i></span>' +
        '<span class="method-txt"><span class="method-kicker">' + esc(K.method.kicker) + "</span><b>" + esc(K.method.title) + "</b><span>" + esc(K.method.text) + "</span></span>" +
        '<span class="method-art-wrap">' + art + "</span>" +
        '<span class="method-cta">' + esc(K.method.cta) + '<span class="pj-arrow" aria-hidden="true"></span></span></a>';
    }

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
    $("work-list").innerHTML = T.work.projects.map(function (p, i) {
      return '<article class="fo-card" style="--k:' + i + '" data-project="' + p.id + '">' +
        '<div class="fo-body"><span class="fo-n" aria-hidden="true">' + (i < 9 ? "0" : "") + (i + 1) + "</span>" +
        '<span class="fo-kind">' + esc(p.kind) + '</span><h3 class="fo-title">' + esc(p.title) + '</h3><p class="fo-text">' + esc(p.text) + "</p>" +
        '<ul class="fo-tags">' + p.tags.slice(0, 4).map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ul>" +
        '<button type="button" class="fo-open"><span>' + esc(T.work.open) + '</span><span class="pj-arrow" aria-hidden="true"></span></button></div>' +
        '<div class="fo-img" aria-hidden="true">' + (p.img ? '<img src="' + esc(p.img) + '" alt="" loading="lazy">' : thumb(p)) + "</div></article>";
    }).join("");
    document.querySelectorAll(".fo-card").forEach(function (c) {
      c.addEventListener("click", function () { openProject(c.getAttribute("data-project")); });
    });
  }

  /* ---------- hero: fil rouge entre le nom et la photo ---------- */
  function drawThread(animate) {
    var svg = $("thread"), path = $("thread-path"), last = $("name-last"), img = document.querySelector(".portrait img");
    if (!svg || !last || !img) return;
    if (window.innerWidth <= 860) { svg.style.display = "none"; return; }
    svg.style.display = "";
    var H = svg.getBoundingClientRect(), L = last.parentNode.getBoundingClientRect(), P = img.parentNode.getBoundingClientRect();
    var sx = L.left - H.left + last.offsetWidth + 22, sy = L.top - H.top + L.height * 0.55, ex, ey, d;
    if (P.left > L.left + last.offsetWidth) {
      // deux colonnes : du nom vers la photo, à droite
      ex = P.left - H.left - 14; ey = P.top - H.top + P.height * 0.5;
      var mx = (ex - sx) * 0.55;
      d = "M" + sx + "," + sy + " C" + (sx + mx) + "," + sy + " " + (ex - mx) + "," + ey + " " + ex + "," + ey;
    } else {
      // une colonne (photo au-dessus) : le fil part à droite du nom et remonte vers la photo
      ex = P.right - H.left + 14; ey = P.top - H.top + P.height * 0.6;
      var room = Math.max(60, Math.min(H.width - 12, Math.max(sx, ex) + 110));
      d = "M" + sx + "," + sy + " C" + room + "," + sy + " " + room + "," + ey + " " + ex + "," + ey;
    }
    path.setAttribute("d", d);
    var n1 = svg.querySelector(".n1"), n2 = svg.querySelector(".n2");
    n1.setAttribute("cx", sx); n1.setAttribute("cy", sy); n2.setAttribute("cx", ex); n2.setAttribute("cy", ey);
    var len = path.getTotalLength();
    path.style.strokeDasharray = len; svg.style.setProperty("--len", len);
    if (animate) { path.style.strokeDashoffset = len; void path.getBoundingClientRect(); svg.classList.add("go"); }
    path.style.strokeDashoffset = 0;
    if (!svg._words) startWords(svg, path);
  }

  function startWords(svg, path) {
    var tp = $("thread-text"); if (!tp) return;
    svg._words = true;
    var calm = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var SPEED = 55, START = 2100, t0 = null, cur = "";
    function tick(t) {
      var s = (C[lang].hero.thread || []).join("   ·   ");
      if (s !== cur) { tp.textContent = s; cur = s; }
      if (svg.style.display === "none") { requestAnimationFrame(tick); return; }
      if (t0 === null) t0 = t + START;
      var len = path.getTotalLength(), tl = tp.getComputedTextLength();
      if (calm) { tp.setAttribute("startOffset", Math.max(0, (len - tl) / 2)); return; }
      if (t < t0) { tp.setAttribute("startOffset", -tl - 20); requestAnimationFrame(tick); return; }
      var span = len + tl + 40, k = ((t - t0) / 1000 * SPEED) % span;
      tp.setAttribute("startOffset", (k - tl - 20).toFixed(1));
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
        ' <span class="org">' + esc(t.org) + "</span>" + (t.tag ? '<span class="tl-tag">' + esc(t.tag) + "</span>" : "") + "</h4>" +
        (t.points ? '<ul class="tl-points">' + t.points.map(function (x) { return "<li>" + rich(x) + "</li>"; }).join("") + "</ul>" : "<p>" + rich(t.text) + "</p>") + "</div></li>";
    }).join("");
    $("education").innerHTML = T.path.education.map(function (e, i) {
      return '<li class="st" style="--i:' + (i + 2) + '">' + badge(e) + "<div><strong>" + esc(e.name) + "</strong><span>" + esc(e.text) + "</span></div></li>";
    }).join("");
    $("languages").innerHTML = T.path.languages.map(function (l, i) {
      return '<li class="st lang-item" style="--i:' + (i + 5) + '"><span class="lang-flag">' + (FLAGS[l[2]] || "") + "</span><div><strong>" + esc(l[0]) + "</strong><span>" + esc(l[1]) + "</span></div></li>";
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
    $("bl-approach").innerHTML = B.approach.map(function (a, i) {
      var f = a[2] || {}, k = a[4] ? (a[4].charAt(0) === "#" ? { href: a[4], ext: false } : link(a[4])) : null;
      return '<li class="ap-row"><span class="ap-dot" aria-hidden="true">' + (i + 1) + "</span>" +
        '<h3 class="ap-t">' + esc(a[0]) + "</h3>" +
        '<div class="ap-stat"><span class="ap-fig"><span class="num" data-to="' + f.n + '">' + f.n + "</span>" + (f.unit ? "<small>" + esc(f.unit) + "</small>" : "") + "</span>" +
        (f.label ? '<span class="ap-cap">' + esc(f.label) + "</span>" : "") + "</div>" +
        '<p class="ap-p">' + esc(a[1]) + "</p>" +
        (k ? '<a class="ap-go" href="' + esc(k.href) + '"' + (k.ext ? ' target="_blank" rel="noopener"' : "") + ">" + esc(a[3]) + (k.ext ? " ↗" : " →") + "</a>" : "") + "</li>";
    }).join("");
    approachLive();
    $("bl-sprint").innerHTML = "<thead><tr><th>" + esc(B.sprintCols[0]) + "</th><th></th><th>" + esc(B.sprintCols[1]) + '</th><th class="num">' + esc(B.sprintCols[2]) + "</th></tr></thead><tbody>" +
      B.sprint.map(function (r) {
        return '<tr><td class="code-id">' + esc(r[0]) + "</td><td>" + esc(r[1]) + "</td><td>" + esc(r[2]) + '</td><td class="num">' + r[3] + "</td></tr>";
      }).join("") + '</tbody><tfoot><tr><td colspan="3">' + esc(B.sprintTotal) + '</td><td class="num">' + esc(B.sprintCapacity) + "</td></tr></tfoot>";
    renderWireframes(B);
  }

  /* démarche : le fil rouge se remplit au scroll, les étapes s'allument une à une */
  var apBound = false;
  function approachLive() {
    var box = $("bl-ap"); if (!box) return;
    var rows = [].slice.call(box.querySelectorAll(".ap-row")); if (!rows.length) return;
    var trk = box.querySelector(".ap-trk"), fil = box.querySelector(".ap-fil");
    var calm = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    function ease(p) { return 1 - Math.pow(1 - p, 3); }
    function count(el) {
      var to = +el.getAttribute("data-to"), t0 = null; el.textContent = "0";
      requestAnimationFrame(function f(t) { if (!t0) t0 = t; var p = Math.min(1, (t - t0) / 900); el.textContent = Math.round(to * ease(p)); if (p < 1) requestAnimationFrame(f); });
    }
    function update() {
      var b = $("bl-ap"); if (!b) return;
      var rs = b.querySelectorAll(".ap-row"), br = b.getBoundingClientRect();
      var c = [].map.call(rs, function (r) { var d = r.querySelector(".ap-dot").getBoundingClientRect(); return d.top + d.height / 2 - br.top; });
      var a = c[0], z = c[c.length - 1], line = window.innerHeight * 0.6 - br.top;
      trk.style.top = a + "px"; trk.style.height = Math.max(0, z - a) + "px";
      fil.style.height = (calm ? z - a : Math.max(0, Math.min(z - a, line - a))) + "px";
      [].forEach.call(rs, function (r, i) {
        var on = calm || c[i] <= line;
        r.classList.toggle("on", on);
        if (on && !r.getAttribute("data-seen")) { r.setAttribute("data-seen", "1"); var n = r.querySelector(".num"); if (n && !calm) count(n); }
      });
    }
    box.classList.add("live");
    approachUpdate = update; update();
    if (!apBound) {
      apBound = true;
      window.addEventListener("scroll", function () { if (approachUpdate) requestAnimationFrame(approachUpdate); }, { passive: true });
      window.addEventListener("resize", function () { if (approachUpdate) approachUpdate(); });
    }
  }
  var approachUpdate = null;

  /* wireframes : dossier d'archives ; chaque tirage s'ouvre dans une fenêtre */
  var wfData = null, wfIdx = 0, wfOpener = null, wfBound = false;
  var CH_L = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>', CH_R = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>';
  function wfShow(i) {
    var B = wfData, n = B.wf.length, w;
    wfIdx = (i + n) % n; w = B.wf[wfIdx];
    $("wf-body").innerHTML = '<figure class="wf"><img src="' + esc(w.img) + '" alt="' + esc(w.title) + '">' +
      '<figcaption><h3 id="wf-title">' + esc(w.title) + '</h3><ol class="markers">' + list(w.notes) + "</ol>" +
      '<div class="wf-nav"><button type="button" class="wf-prev" aria-label="' + esc(B.wfPrev) + '">' + CH_L + '</button><span class="wf-count">' + (wfIdx + 1) + " / " + n +
      '</span><button type="button" class="wf-next" aria-label="' + esc(B.wfNext) + '">' + CH_R + "</button></div></figcaption></figure>";
  }
  function wfOpen(i, opener) {
    var d = $("wf-modal"); if (!d) return;
    wfOpener = opener || null; wfShow(i);
    if (typeof d.showModal === "function") d.showModal(); else d.setAttribute("open", "");
  }
  function wfBind() {
    var d = $("wf-modal"); if (!d || wfBound) return; wfBound = true;
    function close() { if (d.close) d.close(); else d.removeAttribute("open"); }
    $("wf-close").addEventListener("click", close);
    d.addEventListener("click", function (e) {
      if (e.target === d) return close();
      if (e.target.closest(".wf-prev")) wfShow(wfIdx - 1);
      else if (e.target.closest(".wf-next")) wfShow(wfIdx + 1);
    });
    d.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") { wfShow(wfIdx - 1); } else if (e.key === "ArrowRight") { wfShow(wfIdx + 1); }
    });
    d.addEventListener("close", function () { if (wfOpener && wfOpener.focus) wfOpener.focus(); });
  }
  var ZOOM = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6"/><path d="M20 20l-4.2-4.2M11 8.5v5M8.5 11h5"/></svg>';
  function renderWireframes(B) {
    var root = $("bl-wf"); if (!root) return;
    wfData = B; wfBind();
    var calm = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    root.innerHTML = '<div class="afd" data-open="false"><div class="afd-shell"><div class="afd-back"></div>' +
      B.wf.map(function (w, i) { return '<span class="afd-sheet" style="--i:' + i + '" aria-hidden="true"></span>'; }).join("") +
      '<button type="button" class="afd-cover" aria-expanded="false" aria-controls="afd-tray"><span class="afd-label">' + esc(B.wfFolder) + '</span><span class="afd-hint">' + esc(B.wfOpen) + "</span></button></div>" +
      '<div class="afd-tray" id="afd-tray" inert><div class="afd-tray-in"><ul class="afd-cards">' +
      B.wf.map(function (w, i) {
        return '<li><button type="button" class="afd-card" style="--i:' + i + '" aria-haspopup="dialog"><span class="afd-ph"><img src="' + esc(w.img) + '" alt="" decoding="async">' +
          '<span class="afd-zoom" aria-hidden="true">' + ZOOM + '</span></span><span class="afd-cap">' + esc(w.title) + "</span></button></li>";
      }).join("") + "</ul></div></div></div>";
    var box = root.querySelector(".afd"), cover = root.querySelector(".afd-cover"), hint = root.querySelector(".afd-hint"), tray = root.querySelector(".afd-tray");
    function reveal() {
      var r = tray.getBoundingClientRect(), c = cover.getBoundingClientRect(), need = r.bottom - window.innerHeight + 24, room = c.top - 90;
      if (need > 0 && room > 0) window.scrollBy({ top: Math.min(need, room), behavior: calm ? "instant" : "smooth" });
    }
    function toggle() {
      var open = box.getAttribute("data-open") !== "true";
      box.setAttribute("data-open", String(open));
      cover.setAttribute("aria-expanded", String(open));
      hint.textContent = open ? B.wfClose : B.wfOpen;
      if (open) { tray.removeAttribute("inert"); setTimeout(reveal, calm ? 0 : 480); } else tray.setAttribute("inert", "");
    }
    cover.addEventListener("click", toggle);
    root.querySelectorAll(".afd-card").forEach(function (b, i) { b.addEventListener("click", function () { wfOpen(i, b); }); });
    root.addEventListener("keydown", function (e) { if (e.key === "Escape" && box.getAttribute("data-open") === "true" && !$("wf-modal").open) { toggle(); cover.focus(); } });
    var d = $("wf-modal"); if (d && d.open) wfShow(wfIdx);
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
  initPillarSettle();
  initThreadCursor();
  document.documentElement.classList.add("ready");

  /* ---------- piliers : se posent un à un au défilement (ordinateur et mobile) ---------- */
  function initPillarSettle() {
    var box = $("pillars"); if (!box) return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var ticking = false;
    function frame() {
      ticking = false;
      var vh = window.innerHeight;
      box.querySelectorAll(".pillar").forEach(function (c, i) {
        var r = c.getBoundingClientRect();
        // 0 quand le haut de la carte entre en bas d'écran, 1 quand il atteint 70 % de la hauteur
        var p = Math.min(1, Math.max(0, (vh - r.top) / (vh * 0.3)));
        var e = 1 - Math.pow(1 - p, 3), side = (i % 2 ? 1 : -1);
        c.style.transform = "translate(" + (side * 26 * (1 - e)) + "px," + (34 * (1 - e)) + "px) rotate(" + (side * 3.5 * (1 - e)) + "deg)";
        c.style.opacity = 0.35 + 0.65 * e;
        if (e > 0.995) { c.style.transform = ""; c.style.opacity = ""; }
      });
    }
    function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    frame();
  }

  /* ---------- curseur « fil rouge » : ordinateur uniquement ---------- */
  function initThreadCursor() {
    if (!window.matchMedia) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var root = document.documentElement;
    var trail = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    trail.setAttribute("class", "cursor-trail"); trail.setAttribute("aria-hidden", "true");
    var path = document.createElementNS("http://www.w3.org/2000/svg", "path"); trail.appendChild(path);
    var ring = document.createElement("div"); ring.className = "cursor-ring"; ring.setAttribute("aria-hidden", "true");
    ring.innerHTML = "<span></span>";
    document.body.appendChild(trail); document.body.appendChild(ring);
    root.classList.add("has-cursor");
    var mx = -100, my = -100, rx = -100, ry = -100, pts = [], visible = false;
    var label = ring.querySelector("span");
    document.addEventListener("mousemove", function (e) {
      mx = e.clientX; my = e.clientY;
      if (!visible) { visible = true; rx = mx; ry = my; root.classList.add("cursor-on"); }
      var t = e.target.closest ? e.target : e.target.parentElement;
      var view = t && t.closest(".pj-row, .method-band, .fo-card");
      var link = !view && t && t.closest("a, button, [role='button'], .tool-btn, .step");
      ring.classList.toggle("is-view", !!view);
      ring.classList.toggle("is-link", !!link);
      label.textContent = view ? (lang === "fr" ? "Voir" : "View") : "";
    }, { passive: true });
    document.addEventListener("mouseleave", function () { visible = false; root.classList.remove("cursor-on"); pts = []; path.setAttribute("d", ""); });
    document.addEventListener("mousedown", function () { ring.classList.add("is-down"); });
    document.addEventListener("mouseup", function () { ring.classList.remove("is-down"); });
    (function loop() {
      rx += (mx - rx) * 0.2; ry += (my - ry) * 0.2;
      ring.style.transform = "translate(" + rx + "px," + ry + "px)";
      if (visible) {
        if (root.classList.contains("cursor-scene")) { pts = []; path.setAttribute("d", ""); rx = mx; ry = my; } else {
        pts.push([rx, ry]); if (pts.length > 8) pts.shift();
        path.setAttribute("d", pts.length > 1 ? "M" + pts.map(function (p) { return p[0].toFixed(1) + "," + p[1].toFixed(1); }).join(" L") : ""); }
      }
      requestAnimationFrame(loop);
    })();
  }
})();
