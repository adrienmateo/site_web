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

    var cv = $("cv-link");
    if (S.cv[l]) { cv.setAttribute("href", S.cv[l]); cv.hidden = false; } else { cv.hidden = true; }
    $("mail-link").setAttribute("href", "mailto:" + S.email);
    $("linkedin-hero").setAttribute("href", S.linkedin);
    $("linkedin-contact").setAttribute("href", S.linkedin);

    renderFacts(T); renderAbout(T); renderSkills(T); renderWork(T); renderPath(T); renderDemo();
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

  function renderWork(T) {
    $("work-list").innerHTML = T.work.items.map(function (w) {
      return '<article class="work-item">' +
        '<div class="work-head"><h3>' + esc(w.title) + '</h3><span class="kind">' + esc(w.kind) + "</span></div>" +
        "<p>" + esc(w.text) + "</p>" +
        '<p class="proves"><span>' + esc(T.work.proves) + "</span> " + esc(w.proves) + "</p>" +
        (w.todo ? '<div class="todo block small">' + esc(w.todo) + "</div>" : "") +
        "</article>";
    }).join("");
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
  $("demo-prev").addEventListener("click", function () { go(step - 1); });
  $("demo-next").addEventListener("click", function () { go(step === 3 ? 0 : step + 1); });

  setLang(initialLang());
})();
