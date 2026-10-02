(function () {
  "use strict";

  var C = window.CONTENT;
  var S = window.SITE;
  var lang = "fr";
  var step = 0;

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
  // Highlight "TODO" mentions so they are easy to spot before going live
  function todoMark(s) {
    return esc(s).replace(/TODO[^)]*/g, function (m) { return '<span class="todo inline">' + m + "</span>"; });
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
    document.title = T.meta.title;
    var md = document.querySelector('meta[name="description"]');
    if (md) md.setAttribute("content", T.meta.description);

    var url = new URL(location.href);
    url.searchParams.set("lang", l);
    history.replaceState(null, "", url);

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var v = get(T, el.getAttribute("data-i18n"));
      if (typeof v === "string") el.textContent = v;
    });
    document.querySelectorAll(".lang button").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-lang") === l));
    });

    var page = document.body.getAttribute("data-page");
    if (page === "f1") {
      document.title = T.f1.meta.title;
      if (md) md.setAttribute("content", T.f1.meta.description);
    }

    var cv = $("cv-link");
    if (cv) { if (S.cv[l]) { cv.setAttribute("href", S.cv[l]); cv.hidden = false; } else { cv.hidden = true; } }
    if ($("mail-link")) $("mail-link").setAttribute("href", "mailto:" + S.email);
    ["linkedin-hero", "linkedin-contact"].forEach(function (id) { if ($(id)) $(id).setAttribute("href", S.linkedin); });
    document.querySelectorAll("[data-langlink]").forEach(function (a) {
      a.setAttribute("href", a.getAttribute("data-langlink") + "?lang=" + l + (a.getAttribute("data-hash") || ""));
    });

    if ($("facts")) { renderFacts(T); renderAbout(T); renderSkills(T); renderWork(T); renderPath(T); renderDemo(); }
    if ($("f1-root")) renderF1(T);
  }

  /* ---------- sections ---------- */
  function renderFacts(T) {
    $("facts").innerHTML = T.hero.facts.map(function (f) {
      return "<li><strong>" + esc(f[0]) + "</strong><span>" + esc(f[1]) + "</span></li>";
    }).join("");
  }

  function renderAbout(T) {
    $("about-body").innerHTML = T.about.body.map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("");
  }

  function renderSkills(T) {
    $("skills-list").innerHTML = T.skills.groups.map(function (g) {
      var tools = g.tools.map(function (t) {
        return '<li><span class="tool">' + esc(t[0]) + '</span><span class="use">' + esc(t[1]) + "</span></li>";
      }).join("");
      return '<article class="skill"><h3>' + esc(g.name) + "</h3><p>" + esc(g.text) + '</p><ul class="tools">' + tools + "</ul></article>";
    }).join("");
  }

  function workCard(T, w) {
    return '<article class="work-item">' +
      '<div class="work-head"><h4>' + esc(w.title) + '</h4><span class="kind">' + esc(w.kind) + "</span></div>" +
      "<p>" + esc(w.text) + "</p>" +
      '<p class="proves"><span>' + esc(T.work.proves) + "</span> " + esc(w.proves) + "</p>" +
      (w.link ? '<a class="btn small primary" href="' + esc(w.link) + "?lang=" + lang + '">' + esc(w.linkLabel) + "</a>" : "") +
      (w.todo ? '<div class="todo block small">' + esc(w.todo) + "</div>" : "") +
      "</article>";
  }

  function renderWork(T) {
    $("work-list").innerHTML =
      '<h3 class="work-group">' + esc(T.work.proTitle) + '</h3><div class="work">' +
      T.work.pro.map(function (w) { return workCard(T, w); }).join("") + "</div>" +
      '<h3 class="work-group">' + esc(T.work.persoTitle) + '</h3><div class="work">' +
      T.work.perso.map(function (w) { return workCard(T, w); }).join("") + "</div>";
  }

  function renderPath(T) {
    $("timeline").innerHTML = T.path.timeline.map(function (t) {
      return '<li><span class="when">' + todoMark(t.when) + '</span><div><h4>' + esc(t.role) +
        ' <span class="org">' + esc(t.org) + "</span></h4><p>" + esc(t.text) + "</p></div></li>";
    }).join("");
    $("education").innerHTML = T.path.education.map(function (e) {
      return "<li><strong>" + esc(e.name) + "</strong><span>" + todoMark(e.text) + "</span></li>";
    }).join("");
    $("languages").innerHTML = T.path.languages.map(function (l) {
      return "<li><strong>" + esc(l[0]) + "</strong><span>" + esc(l[1]) + "</span></li>";
    }).join("");
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

  /* ---------- init ---------- */
  document.querySelectorAll(".lang button").forEach(function (b) {
    b.addEventListener("click", function () { setLang(b.getAttribute("data-lang")); });
  });
  if ($("demo-prev")) {
    $("demo-prev").addEventListener("click", function () { go(step - 1); });
    $("demo-next").addEventListener("click", function () { go(step === 3 ? 0 : step + 1); });
  }

  setLang(initialLang());
})();
