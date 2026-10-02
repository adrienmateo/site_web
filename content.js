/* =========================================================
   CONTENU DU SITE — c'est le seul fichier à modifier pour
   changer les textes. Chaque texte existe en FR et en EN.
   Les éléments marqués TODO sont à compléter.
   ========================================================= */

window.SITE = {
  // TODO : remplace par tes vraies infos
  email: "contact@exemple.com",
  linkedin: "https://www.linkedin.com/in/TODO",
  cv: { fr: "assets/cv-fr.pdf", en: "assets/cv-en.pdf" }
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
        ["4 pays", "de déploiement : France, Royaume-Uni, Québec, Inde"],
        ["65 comptes", "B2B suivis en Customer Success"],
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
          tools: [["N8N", "workflows automatisés"], ["Rovo", "agents IA Atlassian"], ["LLM", "rédaction et analyse automatisées"], ["Tableau", "visualisation de données"]]
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
      items: [
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
        },
        {
          title: "Analyse automatique d'un Grand Prix",
          kind: "Projet personnel",
          text: "Données de course récupérées via l'API publique OpenF1, puis analysées pour comparer le rythme des pilotes, avec un rapport généré après chaque course.",
          proves: "API, données, automatisation de bout en bout",
          todo: "Lien et capture du tableau de bord à ajouter"
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
        { when: "TODO dates", role: "Business Analyst IT", org: "OneStock", text: "Projets d'intégration de bout en bout pour des clients internationaux : ateliers, spécifications, intégrations API, recette et mise en production." },
        { when: "TODO dates", role: "Customer Success Manager", org: "Buybox", text: "Suivi de 65 comptes B2B : onboarding, accompagnement et fidélisation." },
        { when: "TODO dates", role: "Chef de projet junior", org: "Capgemini Engineering", text: "Appui au pilotage de projets : planning, suivi et reporting." },
        { when: "TODO dates", role: "Implémentation CRM", org: "Ecotec", text: "Mise en place d'un CRM : recueil des besoins, paramétrage et accompagnement des utilisateurs." }
      ],
      education: [
        { name: "Toulouse Business School", text: "Programme Grande École, Strategic Innovation Management. Mention Bien, Certificate of Excellence in Consulting." },
        { name: "Université de Bordeaux", text: "Licence Économie-Gestion" },
        { name: "IUT de Rodez", text: "DUT (TODO spécialité)" }
      ],
      languages: [["Français", "langue maternelle"], ["Anglais", "courant, usage professionnel quotidien"]]
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
        ["4 countries", "of rollouts: France, UK, Quebec, India"],
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
          tools: [["N8N", "automated workflows"], ["Rovo", "Atlassian AI agents"], ["LLMs", "automated writing and analysis"], ["Tableau", "data visualization"]]
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
      items: [
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
        },
        {
          title: "Automated Grand Prix analysis",
          kind: "Personal project",
          text: "Race data pulled from the public OpenF1 API and analyzed to compare drivers' pace, with a report generated after every race.",
          proves: "APIs, data, end-to-end automation",
          todo: "Dashboard link and screenshot to add"
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
        { when: "TODO dates", role: "IT Business Analyst", org: "OneStock", text: "End-to-end integration projects for international clients: workshops, specifications, API integrations, UAT and go-live." },
        { when: "TODO dates", role: "Customer Success Manager", org: "Buybox", text: "Managed 65 B2B accounts: onboarding, support and retention." },
        { when: "TODO dates", role: "Junior Project Manager", org: "Capgemini Engineering", text: "Supported project delivery: planning, tracking and reporting." },
        { when: "TODO dates", role: "CRM implementation", org: "Ecotec", text: "Rolled out a CRM: requirements gathering, configuration and user support." }
      ],
      education: [
        { name: "Toulouse Business School", text: "Master in Management (Grande École), Strategic Innovation Management. Graduated with honors, Certificate of Excellence in Consulting." },
        { name: "University of Bordeaux", text: "Bachelor's in Economics and Management" },
        { name: "IUT de Rodez", text: "Two-year technical degree (DUT) (TODO field)" }
      ],
      languages: [["French", "native"], ["English", "fluent, used daily at work"]]
    },
    contact: {
      title: "Let's work together",
      lead: "A role, a project or a question? Write to me, I reply quickly.",
      mail: "Email me"
    },
    footer: "Designed and built by me, hosted on GitHub Pages."
  }
};
