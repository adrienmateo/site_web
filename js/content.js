/* =========================================================
   CONTENU DU SITE — c'est le seul fichier à modifier pour
   changer les textes. Chaque texte existe en FR et en EN.
   Les éléments marqués TODO sont à compléter.
   ========================================================= */

window.SITE = {
  email: "adrienmateo.soules@gmail.com",
  linkedin: "https://www.linkedin.com/in/adrien-mat%C3%A9o-soules/",
  // CV : déposer cv-fr.pdf / cv-en.pdf dans le dépôt puis renseigner ici (vide = bouton masqué)
  cv: { fr: "", en: "" }
};

window.CONTENT = {
  /* ===================== FRANÇAIS ===================== */
  fr: {
    meta: {
      title: "Adrien-Matéo Soules — Business Analyst",
      description: "Business Analyst, consultant fonctionnel et technique. Je transforme des besoins métier en solutions qui fonctionnent, de l'atelier client jusqu'à l'intégration."
    },
    ui: { skip: "Aller au contenu" },
    nav: { about: "À propos", skills: "Compétences", demo: "Démo", work: "Réalisations", path: "Parcours", contact: "Contact" },
    hero: {
      role: "Business Analyst, consultant fonctionnel et technique",
      pitch: "Je transforme des besoins métier en solutions qui fonctionnent, de l'atelier client jusqu'à l'intégration. Et quand l'outil n'existe pas, je le construis.",
      ctaContact: "Me contacter",
      ctaCv: "Télécharger mon CV",
      photoTodo: "Photo à ajouter : assets/photo.jpg (format portrait, environ 800 × 1000 px)",
      facts: [
        ["Projets multiples", "d'intégration, menés de bout en bout"],
        ["65 comptes", "B2B pilotés en Customer Success"],
        ["FR / EN", "en atelier comme à l'écrit"]
      ]
    },
    about: {
      title: "À propos",
      body: [
        "J'ai commencé côté client, en Customer Success, avant de passer côté projet puis côté technique. Ce parcours me donne une double lecture : je comprends ce qu'un métier attend d'un outil, et je sais comment cet outil fonctionne sous le capot, des API aux flux de données en passant par les logs.",
        "Aujourd'hui Business Analyst IT, je mène des projets d'intégration de bout en bout pour des clients internationaux : ateliers, spécifications, recette, mise en production, puis accompagnement des équipes.",
        "À côté, je construis des outils : automatisations, agents IA, petits utilitaires qui font gagner du temps aux équipes. C'est ma façon de rester au contact de la technique."
      ]
    },
    skills: {
      title: "Compétences",
      lead: "Ce que je sais faire, et avec quels outils je le fais.",
      groups: [
        {
          name: "Analyse métier",
          text: "J'anime les ateliers, je reformule le besoin et je le traduis en spécifications fonctionnelles et techniques, puis en user stories avec critères d'acceptation.",
          tools: [["Confluence", "documentation et spécifications"], ["Jira", "backlog et suivi"], ["Productboard", "priorisation produit"], ["Notion", "cadrage et notes d'atelier"], ["Gherkin", "critères d'acceptation"]]
        },
        {
          name: "Intégration et données",
          text: "Je relie des systèmes entre eux : API REST, webhooks, SFTP, middleware. Je lis un payload, rejoue un appel et isole la cause d'un bug.",
          tools: [["API REST", "conception et tests de flux"], ["Postman", "rejouer et isoler un appel"], ["JSON", "lecture de payloads"], ["MongoDB", "requêtes et exports"], ["Datadog", "analyse de logs"], ["SAP / CEGID", "ERP connectés"]]
        },
        {
          name: "Pilotage et relation client",
          text: "Je tiens le planning et les dépendances entre systèmes, j'anime les comités et la recette avec le client, et j'accompagne les équipes jusqu'à l'adoption.",
          tools: [["Jira", "suivi de projet"], ["Trello", "organisation"], ["HubSpot", "CRM et suivi de comptes"], ["Pack Office", "comités et reporting"]]
        },
        {
          name: "Automatisation et IA",
          text: "Quand une tâche se répète, je l'automatise. Je conçois des workflows et des agents IA qui retirent le travail répétitif aux équipes.",
          tools: [["N8N", "workflows automatisés"], ["Make", "automatisations sans code"], ["Rovo", "agents IA Atlassian"], ["LLM", "rédaction et analyse automatisées"], ["Tableau", "visualisation de données"]]
        }
      ]
    },
    demo: {
      title: "Démo : une commande est bloquée",
      lead: "Un cas fictif, mais typique. Suivez l'enquête comme je la mène : des logs jusqu'à l'explication au client.",
      prev: "Étape précédente",
      next: "Étape suivante",
      restart: "Recommencer",
      note: "Données fictives",
      steps: ["Les logs", "Le payload", "Le diagnostic", "La résolution"],
      logsIntro: "Le service client signale que la commande FR-48213 n'est jamais partie. Je commence par les logs. Cliquez sur la ligne en erreur.",
      payloadIntro: "La requête envoyée au transporteur, telle que le système l'a émise :",
      payloadFlag: "Le code postal commence par 20 : la commande part en Corse.",
      responseIntro: "Et la réponse du transporteur :",
      diagnosis: [
        "Le transporteur configuré par défaut ne livre pas la Corse : il refuse la demande avec une erreur 422.",
        "Aucun transporteur de secours n'est prévu pour ce cas. La commande reste donc en attente, sans alerte.",
        "Ce n'est pas un bug ponctuel : toutes les commandes vers la Corse sont concernées."
      ],
      techTitle: "Côté technique",
      tech: [
        "Ajout d'une règle de routage : codes postaux 20xxx vers un transporteur qui dessert l'île.",
        "Appel rejoué dans Postman : 201 Created.",
        "Alerte ajoutée si une expédition échoue plus de 2 fois."
      ],
      bizTitle: "Côté client",
      biz: "« Les commandes vers la Corse restaient bloquées, car le transporteur choisi ne livre pas l'île. Elles partent désormais automatiquement avec un autre transporteur, et votre service client est prévenu si un envoi échoue. »"
    },
    work: {
      title: "Réalisations",
      lead: "Des preuves concrètes, anonymisées quand il le faut.",
      proves: "Ce que ça montre",
      proTitle: "Projets professionnels",
      persoTitle: "Projets personnels",
      pro: [
        {
          title: "Du besoin au backlog",
          kind: "Étude de cas",
          text: "Cadrage complet d'une plateforme ERP fictive : ateliers, personas, user stories, critères d'acceptation en Gherkin et priorisation du premier sprint.",
          proves: "Analyse métier, rédaction de spécifications",
          todo: "Étude de cas détaillée à ajouter"
        },
        {
          title: "Intégrations e-commerce",
          kind: "Projet client, anonymisé",
          text: "Raccordement de sites e-commerce à un système de gestion des commandes : flux de commandes, de stock et d'expédition entre plusieurs systèmes, du cadrage à la mise en production.",
          proves: "Intégration de systèmes, pilotage",
          todo: "Captures anonymisées à ajouter"
        },
        {
          title: "Agent IA pour une équipe support",
          kind: "Outil interne",
          text: "Conception d'un agent IA qui répond aux questions récurrentes de l'équipe à partir de la documentation : cadrage du besoin, rédaction des instructions, tests.",
          proves: "Automatisation, IA appliquée",
          todo: "Captures (données fictives) et gain mesuré à ajouter"
        }
      ],
      perso: [
        {
          title: "Analyse de performance F1",
          kind: "Dashboard et automatisation",
          text: "Un dashboard pour comparer les performances entre pilotes et analyser une course en détail, et une automatisation qui envoie un résumé de chaque Grand Prix aux personnes inscrites.",
          proves: "API, données, automatisation no-code, IA appliquée",
          link: "f1.html",
          linkLabel: "Voir le projet"
        }
      ]
    },
    method: {
      title: "Ma méthode",
      todo: "Section à rédiger avec mes mots : comment je mène un projet, du cadrage à l'adoption."
    },
    path: {
      title: "Parcours",
      xp: "Expérience",
      edu: "Formation",
      certs: "Certifications",
      certsTodo: "Certifications à ajouter, avec un lien vers chaque justificatif.",
      langs: "Langues",
      timeline: [
        { when: "2024 – aujourd'hui", role: "Business Analyst IT", org: "OneStock", text: "Pilotage de multiples projets d'implémentation de bout en bout, de la conception à l'hypercare : spécifications fonctionnelles et techniques, intégration avec ERP, CRM, transporteurs et e-commerce, recette, formation des key users." },
        { when: "2023 – 2024", role: "Customer Success Manager (alternance)", org: "Buybox", text: "Portefeuille de 65 comptes B2B piloté en autonomie : onboarding et intégrations clients, reporting de performance, pipeline d'upsell." },
        { when: "2022", role: "Chef de projet (stage)", org: "Capgemini Engineering", text: "Cadrage et lancement d'un programme de formation interne à l'échelle du groupe : objectifs, conception, coordination inter-équipes." },
        { when: "2022", role: "Assistant de gestion (alternance)", org: "Ecotec", text: "Mise en place d'un CRM et restructuration de la base de données clients." }
      ],
      education: [
        { name: "Toulouse Business School", text: "2021 – 2024 · Programme Grande École, Strategic Innovation Management. Mention Bien, Certificat d'excellence Consulting." },
        { name: "Université de Bordeaux", text: "2020 – 2021 · Licence Économie-Gestion, Mention Bien" },
        { name: "IUT de Rodez", text: "2018 – 2020 · DUT Gestion des Entreprises et des Administrations" }
      ],
      languages: [["Français", "langue maternelle"], ["Anglais", "courant, usage professionnel quotidien"], ["Espagnol", "notions (A2)"]]
    },
    f1: {
      meta: {
        title: "Analyse de performance F1 — Adrien-Matéo Soules",
        description: "Un dashboard pour comparer les pilotes de F1 au-delà du classement, et une automatisation qui résume chaque Grand Prix par mail."
      },
      back: "Retour au portfolio",
      kind: "Projet personnel",
      title: "Analyse de performance F1",
      lead: "Un outil pour comparer les pilotes au-delà du classement, et une automatisation qui résume chaque Grand Prix.",
      open: "Ouvrir le dashboard",
      goals: [
        { title: "Le dashboard : comparer et analyser", text: "Un outil web pour comparer les performances entre pilotes, coéquipiers ou pilotes au choix, et analyser une course en détail : écarts tour par tour, rythme de course sur les tours propres, positions en piste et stratégies de pneus. Les données viennent en direct de l'API publique OpenF1." },
        { title: "Le compte rendu : résumer et diffuser", text: "Après chaque Grand Prix, une automatisation calcule les chiffres clés de la course. Claude en rédige un résumé, qui est envoyé par mail aux personnes inscrites. Chaque duel entre coéquipiers est archivé pour suivre les tendances sur la saison." }
      ],
      archTitle: "Architecture",
      archLead: "Deux usages, un même moteur de calcul.",
      scrollHint: "Faites glisser le schéma pour l'explorer.",
      makeTitle: "Le scénario Make",
      makeText: "Le webhook reçoit les chiffres du Grand Prix envoyés par GitHub Actions. Claude rédige le résumé, puis un routeur envoie le mail aux inscrits et archive chaque duel dans Google Sheets.",
      makeAlt: "Scénario Make : webhook, Claude, routeur, Gmail, itérateur et Google Sheets",
      choicesTitle: "Choix de conception",
      choices: [
        ["Un seul code de calcul", "Le dashboard et le compte rendu utilisent exactement la même logique : les chiffres du mail sont toujours ceux affichés à l'écran."],
        ["Claude rédige, il ne calcule pas", "L'IA reçoit des chiffres déjà vérifiés et une consigne qui lui interdit d'inventer. L'analyse reste fiable, la rédaction fluide."],
        ["Un secours à chaque étape", "Si Claude échoue, le mail part avec les chiffres seuls. Si Make est injoignable, GitHub envoie lui-même le compte rendu."]
      ],
      stackTitle: "Stack",
      stack: [["OpenF1", "API REST publique"], ["JavaScript", "dashboard et graphiques"], ["Node.js", "calcul du compte rendu"], ["GitHub Actions", "exécution à la demande"], ["Make", "orchestration par webhook"], ["Claude", "rédaction du résumé"], ["Gmail", "envoi aux inscrits"], ["Google Sheets", "historique de la saison"], ["Netlify", "hébergement et inscriptions"]],
      diagram: {
        top: "Dashboard, à chaque visite",
        bottom: "Compte rendu, à la demande",
        chrono: ["Chronométrage F1", "flux live officiel"],
        openf1: ["OpenF1", "API REST, JSON", "sans clé, ~3 req/s"],
        netlify: ["Netlify", "héberge index.html"],
        browser: ["Navigateur", "du visiteur", "calcul + graphiques"],
        dashboard: ["Dashboard", "écarts entre pilotes", "tour par tour, en piste", "stratégies pneus"],
        forms: ["Netlify Forms", "inscrits au compte rendu"],
        me: ["Moi", "Run workflow"],
        gha: ["GitHub Actions", "report.mjs, Node.js", "calcul du GP + mail"],
        make: ["Make", "webhook"],
        claude: ["Claude", "rédige le résumé"],
        gmail: ["Gmail", "moi + inscrits (Cci)"],
        sheets: ["Google Sheets", "1 ligne par duel"],
        l: { records: "enregistre", records2: "chaque session", fetch: "fetch (CORS)", serves: "sert la page", draws: "trace", subscribe: "s'inscrire", same: "même code", same2: "de calcul", launches: "lance", calls: "8 appels", reads: "lit les inscrits", reads2: "(API Netlify)", post: "POST JSON", facts: "faits", summary: "résumé HTML", iter: "Iterator, 11 duels", fallback: "secours : si Make est injoignable, GitHub envoie lui-même le mail factuel" }
      }
    },
    contact: {
      title: "Travaillons ensemble",
      lead: "Un poste, un projet ou une question ? Écrivez-moi, je réponds rapidement.",
      mail: "M'écrire"
    },
    footer: "Site conçu et codé par mes soins, hébergé sur GitHub Pages."
  },

  /* ===================== ENGLISH ===================== */
  en: {
    meta: {
      title: "Adrien-Matéo Soules — Business Analyst",
      description: "Business Analyst bridging business and tech. I turn business needs into solutions that work, from the client workshop to the integration."
    },
    ui: { skip: "Skip to content" },
    nav: { about: "About", skills: "Skills", demo: "Demo", work: "Work", path: "Background", contact: "Contact" },
    hero: {
      role: "Business Analyst, functional and technical consultant",
      pitch: "I turn business needs into solutions that work, from the client workshop to the integration. And when the tool doesn't exist, I build it.",
      ctaContact: "Get in touch",
      ctaCv: "Download my resume",
      photoTodo: "Photo to add: assets/photo.jpg (portrait, about 800 × 1000 px)",
      facts: [
        ["Multiple projects", "integration projects run end to end"],
        ["65 accounts", "B2B accounts managed in Customer Success"],
        ["FR / EN", "in workshops and in writing"]
      ]
    },
    about: {
      title: "About",
      body: [
        "I started on the client side, in Customer Success, then moved into project delivery and on to the technical side. That path gives me a double reading: I understand what a business expects from a tool, and I know how that tool works under the hood, from APIs to data flows and logs.",
        "Today I'm an IT Business Analyst, running end-to-end integration projects for international clients: workshops, specifications, UAT, go-live, then supporting the teams through adoption.",
        "On the side, I build tools: automations, AI agents and small utilities that save teams time. It's how I stay hands-on with the tech."
      ]
    },
    skills: {
      title: "Skills",
      lead: "What I do, and the tools I do it with.",
      groups: [
        {
          name: "Business analysis",
          text: "I run workshops, restate the need and turn it into functional and technical specifications, then into user stories with acceptance criteria.",
          tools: [["Confluence", "documentation and specs"], ["Jira", "backlog and tracking"], ["Productboard", "product prioritization"], ["Notion", "scoping and workshop notes"], ["Gherkin", "acceptance criteria"]]
        },
        {
          name: "Integration and data",
          text: "I connect systems: REST APIs, webhooks, SFTP, middleware. I read a payload, replay a call and isolate the root cause of a bug.",
          tools: [["REST API", "flow design and testing"], ["Postman", "replay and isolate a call"], ["JSON", "reading payloads"], ["MongoDB", "queries and exports"], ["Datadog", "log analysis"], ["SAP / CEGID", "connected ERPs"]]
        },
        {
          name: "Delivery and client relations",
          text: "I own the plan and the dependencies between systems, run steering meetings and UAT with the client, and support teams through to adoption.",
          tools: [["Jira", "project tracking"], ["Trello", "organization"], ["HubSpot", "CRM and account management"], ["MS Office", "steering and reporting"]]
        },
        {
          name: "Automation and AI",
          text: "When a task repeats, I automate it. I design workflows and AI agents that take repetitive work off teams' plates.",
          tools: [["N8N", "automated workflows"], ["Make", "no-code automations"], ["Rovo", "Atlassian AI agents"], ["LLMs", "automated writing and analysis"], ["Tableau", "data visualization"]]
        }
      ]
    },
    demo: {
      title: "Demo: an order is stuck",
      lead: "A fictional case, but a typical one. Follow the investigation the way I run it: from the logs to the explanation to the client.",
      prev: "Previous step",
      next: "Next step",
      restart: "Start over",
      note: "Fictional data",
      steps: ["The logs", "The payload", "The diagnosis", "The fix"],
      logsIntro: "Customer service reports that order FR-48213 never shipped. I start with the logs. Click the line with the error.",
      payloadIntro: "The request sent to the carrier, exactly as the system issued it:",
      payloadFlag: "The postcode starts with 20: the order is going to Corsica.",
      responseIntro: "And the carrier's response:",
      diagnosis: [
        "The default carrier doesn't deliver to Corsica: it rejects the request with a 422 error.",
        "No fallback carrier is set up for this case, so the order sits on hold with no alert.",
        "It's not a one-off bug: every order to Corsica is affected."
      ],
      techTitle: "On the tech side",
      tech: [
        "Added a routing rule: 20xxx postcodes go to a carrier that serves the island.",
        "Replayed the call in Postman: 201 Created.",
        "Added an alert when a shipment fails more than twice."
      ],
      bizTitle: "For the client",
      biz: "“Orders to Corsica were getting stuck because the selected carrier doesn't deliver to the island. They now ship automatically with another carrier, and your customer service team is notified if a shipment fails.”"
    },
    work: {
      title: "Work",
      lead: "Concrete proof, anonymized where needed.",
      proves: "What it shows",
      proTitle: "Professional projects",
      persoTitle: "Personal projects",
      pro: [
        {
          title: "From need to backlog",
          kind: "Case study",
          text: "Full scoping of a fictional ERP platform: workshops, personas, user stories, Gherkin acceptance criteria and first-sprint prioritization.",
          proves: "Business analysis, specification writing",
          todo: "Detailed case study to add"
        },
        {
          title: "E-commerce integrations",
          kind: "Client project, anonymized",
          text: "Connecting e-commerce sites to an order management system: order, stock and shipping flows across several systems, from scoping to go-live.",
          proves: "Systems integration, delivery",
          todo: "Anonymized screenshots to add"
        },
        {
          title: "AI agent for a support team",
          kind: "Internal tool",
          text: "Designed an AI agent that answers the team's recurring questions from the documentation: scoping the need, writing the instructions, testing.",
          proves: "Automation, applied AI",
          todo: "Screenshots (fictional data) and measured gain to add"
        }
      ],
      perso: [
        {
          title: "F1 performance analysis",
          kind: "Dashboard and automation",
          text: "A dashboard to compare drivers' performance and analyze a race in detail, plus an automation that emails a summary of every Grand Prix to subscribers.",
          proves: "APIs, data, no-code automation, applied AI",
          link: "f1.html",
          linkLabel: "See the project"
        }
      ]
    },
    method: {
      title: "How I work",
      todo: "Section to write in my own words: how I run a project, from scoping to adoption."
    },
    path: {
      title: "Background",
      xp: "Experience",
      edu: "Education",
      certs: "Certifications",
      certsTodo: "Certifications to add, each with a link to the certificate.",
      langs: "Languages",
      timeline: [
        { when: "2024 – present", role: "IT Business Analyst", org: "OneStock", text: "Ran multiple implementation projects end to end, from design to hypercare: functional and technical specifications, integration with ERPs, CRMs, carriers and e-commerce, UAT, key-user training." },
        { when: "2023 – 2024", role: "Customer Success Manager (work-study)", org: "Buybox", text: "Managed a portfolio of 65 B2B accounts on my own: onboarding and client integrations, performance reporting, upsell pipeline." },
        { when: "2022", role: "Project Manager (internship)", org: "Capgemini Engineering", text: "Scoped and launched a group-wide internal training program: objectives, design, cross-team coordination." },
        { when: "2022", role: "Business Assistant (work-study)", org: "Ecotec", text: "Rolled out a CRM and restructured the customer database." }
      ],
      education: [
        { name: "Toulouse Business School", text: "2021 – 2024 · Master in Management (Grande École), Strategic Innovation Management. Graduated with honors, Certificate of Excellence in Consulting." },
        { name: "University of Bordeaux", text: "2020 – 2021 · Bachelor's in Economics and Management, with honors" },
        { name: "IUT de Rodez", text: "2018 – 2020 · Two-year degree in Business and Administration (DUT GEA)" }
      ],
      languages: [["French", "native"], ["English", "fluent, used daily at work"], ["Spanish", "basic (A2)"]]
    },
    f1: {
      meta: {
        title: "F1 performance analysis — Adrien-Matéo Soules",
        description: "A dashboard to compare F1 drivers beyond the final standings, and an automation that emails a summary of every Grand Prix."
      },
      back: "Back to portfolio",
      kind: "Personal project",
      title: "F1 performance analysis",
      lead: "A tool to compare drivers beyond the final standings, and an automation that sums up every Grand Prix.",
      open: "Open the dashboard",
      goals: [
        { title: "The dashboard: compare and analyze", text: "A web tool to compare drivers' performance, teammates or any two drivers, and analyze a race in detail: lap-by-lap gaps, race pace on clean laps, track position and tyre strategies. Data comes live from the public OpenF1 API." },
        { title: "The race report: summarize and share", text: "After each Grand Prix, an automation computes the key figures of the race. Claude writes a summary, which is emailed to subscribers. Every teammate duel is logged to track trends across the season." }
      ],
      archTitle: "Architecture",
      archLead: "Two uses, one calculation engine.",
      scrollHint: "Drag the diagram to explore it.",
      makeTitle: "The Make scenario",
      makeText: "The webhook receives the Grand Prix figures sent by GitHub Actions. Claude writes the summary, then a router emails subscribers and logs each duel to Google Sheets.",
      makeAlt: "Make scenario: webhook, Claude, router, Gmail, iterator and Google Sheets",
      choicesTitle: "Design choices",
      choices: [
        ["One calculation codebase", "The dashboard and the race report run exactly the same logic, so the figures in the email always match what's on screen."],
        ["Claude writes, it doesn't compute", "The AI gets figures that are already checked, with instructions that forbid inventing anything. The analysis stays reliable, the writing reads well."],
        ["A fallback at every step", "If Claude fails, the email goes out with the figures alone. If Make is unreachable, GitHub sends the report itself."]
      ],
      stackTitle: "Stack",
      stack: [["OpenF1", "public REST API"], ["JavaScript", "dashboard and charts"], ["Node.js", "report calculation"], ["GitHub Actions", "on-demand runs"], ["Make", "webhook orchestration"], ["Claude", "summary writing"], ["Gmail", "sending to subscribers"], ["Google Sheets", "season history"], ["Netlify", "hosting and sign-ups"]],
      diagram: {
        top: "Dashboard, on every visit",
        bottom: "Race report, on demand",
        chrono: ["F1 timing", "official live feed"],
        openf1: ["OpenF1", "REST API, JSON", "no key, ~3 req/s"],
        netlify: ["Netlify", "hosts index.html"],
        browser: ["Browser", "visitor's", "calculation + charts"],
        dashboard: ["Dashboard", "gaps between drivers", "lap by lap, on track", "tyre strategies"],
        forms: ["Netlify Forms", "report subscribers"],
        me: ["Me", "Run workflow"],
        gha: ["GitHub Actions", "report.mjs, Node.js", "GP calculation + email"],
        make: ["Make", "webhook"],
        claude: ["Claude", "writes the summary"],
        gmail: ["Gmail", "me + subscribers (Bcc)"],
        sheets: ["Google Sheets", "1 row per duel"],
        l: { records: "records", records2: "every session", fetch: "fetch (CORS)", serves: "serves the page", draws: "draws", subscribe: "subscribe", same: "same", same2: "calculation code", launches: "runs", calls: "8 calls", reads: "reads subscribers", reads2: "(Netlify API)", post: "POST JSON", facts: "facts", summary: "HTML summary", iter: "Iterator, 11 duels", fallback: "fallback: if Make is unreachable, GitHub sends the factual email itself" }
      }
    },
    contact: {
      title: "Let's work together",
      lead: "A role, a project or a question? Write to me, I reply quickly.",
      mail: "Email me"
    },
    footer: "Designed and built by me, hosted on GitHub Pages."
  }
};
