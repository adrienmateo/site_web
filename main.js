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
    history.replaceState(null, "", url);

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
  }

  /* ---------- home: skills (frise + toolbox) ---------- */
  function toolIcon(t) {
    if (t.path) return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="' + t.path + '"/></svg>';
    return '<span class="mono" aria-hidden="true">' + esc(t.mono) + "</span>";
  }

  function renderSkills(T) {
    var K = T.skills;
    $("skills-frise").innerHTML =
      '<div class="track" aria-hidden="true"><span class="fill" id="frise-fill"></span></div>' +
      K.steps.map(function (s, i) {
        return '<li><button type="button" class="step" data-step="' + s.id + '" aria-pressed="false">' +
          '<span class="dot">' + (i + 1) + '</span><span class="step-name">' + esc(s.name) + '</span><span class="step-tag">' + esc(s.tag) + "</span></button></li>";
      }).join("");
    $("skills-auto").innerHTML =
      '<button type="button" class="step auto" data-step="' + K.auto.id + '" aria-pressed="false"><span class="dot">∞</span><span class="step-name">' +
      esc(K.auto.name) + '</span><span class="step-tag">' + esc(K.auto.tag) + "</span></button>";

    $("toolbox").innerHTML = K.cats.map(function (c) {
      return '<div class="tool-cat"><h3>' + esc(c[1]) + '</h3><ul class="tool-grid">' +
        TOOLS.filter(function (t) { return t.cat === c[0]; }).map(function (t) {
          return '<li><button type="button" class="tool-btn" data-tool="' + t.id + '" style="--brand:' + t.color + '" aria-pressed="false">' +
            '<span class="tool-logo">' + toolIcon(t) + '</span><span class="tool-name">' + esc(t.name) + "</span></button></li>";
        }).join("") + "</ul></div>";
    }).join("") + '<div class="tool-pop" id="tool-pop" role="dialog" hidden></div>';

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

  function selectStep(id, silent) {
    var K = C[lang].skills;
    if (!silent && id === activeStep) id = null;
    activeStep = id; activeTool = null;
    hidePop();
    var ids = K.steps.map(function (s) { return s.id; });
    var idx = ids.indexOf(id);
    document.querySelectorAll("#skills .step").forEach(function (b) {
      var on = b.getAttribute("data-step") === id;
      b.classList.toggle("on", on); b.classList.remove("lit");
      b.setAttribute("aria-pressed", String(on));
    });
    var fill = $("frise-fill");
    if (fill) fill.style.width = idx < 0 ? "0%" : (idx / (ids.length - 1) * 100) + "%";
    document.querySelectorAll(".tool-btn").forEach(function (b) {
      var tool = TOOLS.filter(function (t) { return t.id === b.getAttribute("data-tool"); })[0];
      var lit = id && tool.steps.indexOf(id) >= 0;
      b.classList.toggle("lit", !!lit);
      b.classList.toggle("dim", !!id && !lit);
      b.classList.remove("sel"); b.setAttribute("aria-pressed", "false");
    });
    var panel = $("step-panel");
    var st = allSteps(K).filter(function (s) { return s.id === id; })[0];
    panel.classList.remove("swap"); void panel.offsetWidth; panel.classList.add("swap");
    panel.innerHTML = st
      ? '<span class="panel-tag">' + esc(st.tag) + "</span><h3>" + esc(st.name) + "</h3><p>" + esc(st.text) + "</p>"
      : '<p class="panel-hint">' + esc(K.hint) + "</p>";
  }

  function selectTool(id) {
    var K = C[lang].skills;
    if (id === activeTool) { selectStep(null, true); return; }
    activeTool = id; activeStep = null;
    var tool = TOOLS.filter(function (t) { return t.id === id; })[0];
    document.querySelectorAll("#skills .step").forEach(function (b) {
      b.classList.remove("on");
      b.classList.toggle("lit", tool.steps.indexOf(b.getAttribute("data-step")) >= 0);
      b.setAttribute("aria-pressed", "false");
    });
    var fill = $("frise-fill"); if (fill) fill.style.width = "0%";
    var btn;
    document.querySelectorAll(".tool-btn").forEach(function (b) {
      var me = b.getAttribute("data-tool") === id;
      if (me) btn = b;
      b.classList.toggle("sel", me); b.classList.toggle("dim", !me); b.classList.remove("lit");
      b.setAttribute("aria-pressed", String(me));
    });
    var names = allSteps(K).filter(function (s) { return tool.steps.indexOf(s.id) >= 0; }).map(function (s) { return '<span class="chip">' + esc(s.name) + "</span>"; }).join("");
    var pop = $("tool-pop");
    pop.innerHTML = '<div class="pop-head"><span class="tool-logo" style="--brand:' + tool.color + '">' + toolIcon(tool) + "</span><strong>" + esc(tool.name) + "</strong></div>" +
      "<p>" + esc(K.uses[id] || "") + '</p><div class="pop-steps"><span>' + esc(K.usedIn) + "</span>" + names + "</div>";
    pop.hidden = false;
    var box = $("toolbox").getBoundingClientRect(), r = btn.getBoundingClientRect();
    var w = Math.min(300, box.width - 8);
    var left = Math.max(4, Math.min(r.left - box.left + r.width / 2 - w / 2, box.width - w - 4));
    pop.style.width = w + "px";
    pop.style.left = left + "px";
    pop.style.top = (r.bottom - box.top + 10) + "px";
    pop.style.setProperty("--arrow", (r.left - box.left + r.width / 2 - left) + "px");
    pop.classList.remove("show"); void pop.offsetWidth; pop.classList.add("show");
    var panel = $("step-panel");
    panel.innerHTML = '<p class="panel-hint">' + esc(K.hint) + "</p>";
  }

  function hidePop() { var p = $("tool-pop"); if (p) { p.hidden = true; p.classList.remove("show"); } }

  /* ---------- home: projects + modal ---------- */
  function thumb(p) {
    if (p.img) return '<span class="thumb"><img src="' + esc(p.img) + '" alt=""></span>';
    if (p.id === "methode") return '<span class="thumb thumb-phases" aria-hidden="true">' + p.tags.map(function (t, i) { return '<span style="--i:' + i + '">' + esc(t) + "</span>"; }).join("") + "</span>";
    return '<span class="thumb thumb-browser" aria-hidden="true"><span class="bar"><i></i><i></i><i></i><b>adrienmateo-soules.com</b></span><span class="page"><span class="l1"></span><span class="l2"></span><span class="l3"></span><span class="ph"></span></span></span>';
  }

  function renderWork(T) {
    $("work-list").innerHTML = T.work.projects.map(function (p) {
      return '<button type="button" class="tile" data-project="' + p.id + '">' + thumb(p) +
        '<span class="tile-body"><span class="tile-kind">' + esc(p.kind) + "</span><span class=\"tile-title\">" + esc(p.title) + '</span><span class="tile-text">' + esc(p.text) + '</span><span class="tile-go">' + esc(T.work.open) + "</span></span></button>";
    }).join("");
    document.querySelectorAll(".tile").forEach(function (b) {
      b.addEventListener("click", function () { openProject(b.getAttribute("data-project")); });
    });
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

  function renderPath(T) {
    $("timeline").innerHTML = T.path.timeline.map(function (t) {
      return '<li><span class="when">' + esc(t.when) + '</span><div><h4>' + esc(t.role) +
        ' <span class="org">' + esc(t.org) + "</span></h4><p>" + esc(t.text) + "</p></div></li>";
    }).join("");
    $("education").innerHTML = T.path.education.map(function (e) {
      return "<li><strong>" + esc(e.name) + "</strong><span>" + esc(e.text) + "</span></li>";
    }).join("");
    $("languages").innerHTML = T.path.languages.map(function (l) {
      return "<li><strong>" + esc(l[0]) + "</strong><span>" + esc(l[1]) + "</span></li>";
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
    s += '<svg class="arch" viewBox="0 0 1000 630" role="img" aria-label="' + esc(C[lang].f1.archTitle) + '">';
    s += '<defs><marker id="d-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="d-head"/></marker>' +
         '<marker id="d-arrow-acc" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="d-head-acc"/></marker></defs>';
    // panels
    s += '<rect class="d-panel" x="225" y="12" width="765" height="312" rx="10"/>' + label(975, 36, D.top, "end", "d-panel-l");
    s += '<rect class="d-panel" x="225" y="340" width="765" height="282" rx="10"/>' + label(975, 364, D.bottom, "end", "d-panel-l");
    // boxes
    s += box(20, 49, 170, 50, D.chrono);
    s += box(20, 258, 170, 78, D.openf1, "d-key");
    s += box(245, 49, 155, 50, D.netlify);
    s += box(245, 139, 155, 82, D.browser);
    s += box(480, 139, 165, 82, D.dashboard);
    s += box(480, 258, 165, 50, D.forms);
    s += box(245, 372, 110, 42, D.me);
    s += box(245, 452, 155, 90, D.gha);
    s += box(480, 462, 115, 54, D.make);
    s += box(650, 462, 135, 54, D.claude);
    s += box(830, 394, 150, 54, D.gmail);
    s += box(830, 528, 150, 54, D.sheets);
    // arrows
    s += arrow("105,99 105,256") + label(113, 160, L.records) + label(113, 174, L.records2);
    s += arrow("245,200 150,200 150,256") + label(160, 193, L.fetch);
    s += arrow("322,99 322,137") + label(330, 123, L.serves);
    s += arrow("400,172 478,172") + label(439, 165, L.draws, "middle");
    s += arrow("400,206 440,206 440,283 478,283") + label(446, 245, L.subscribe);
    s += arrow("378,221 378,450", "d-same") + label(372, 330, L.same, "end", "d-acc") + label(372, 344, L.same2, "end", "d-acc");
    s += arrow("300,414 300,450") + label(307, 436, L.launches);
    s += arrow("245,497 150,497 150,338") + label(196, 490, L.calls, "middle");
    s += arrow("400,470 425,470 425,300 478,300") + label(431, 385, L.reads) + label(431, 399, L.reads2);
    s += arrow("400,489 478,489") + label(439, 482, L.post, "middle");
    s += arrow("595,489 648,489") + label(621, 482, L.facts, "middle");
    s += arrow("785,478 808,478 808,421 828,421") + label(803, 451, L.summary, "end");
    s += arrow("785,500 808,500 808,555 828,555") + label(803, 540, L.iter, "end");
    s += arrow("322,542 322,605 990,605 990,432 982,432", "d-dash") + label(656, 598, L.fallback, "middle");
    return s + "</svg>";
  }

  function renderF1(T) {
    var F = T.f1;
    $("f1-goals").innerHTML = F.goals.map(function (g) {
      return '<article class="goal"><h3>' + esc(g.title) + "</h3><p>" + esc(g.text) + "</p></article>";
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
    function onScroll() { if (bar) bar.classList.toggle("scrolled", window.scrollY > 8); }
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
      if (activeTool && !e.target.closest(".tool-pop")) selectStep(null, true);
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
  document.documentElement.classList.add("ready");
})();
