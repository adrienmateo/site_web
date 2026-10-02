/* =========================================================
   CONTENU DU SITE — le seul fichier à modifier pour changer
   les textes. Chaque texte existe en français (fr) et en
   anglais (en).
   ========================================================= */

window.SITE = {
  "email": "adrienmateo.soules@gmail.com",
  "linkedin": "https://www.linkedin.com/in/adrien-mat%C3%A9o-soules/",
  "cv": {
    "fr": "",
    "en": ""
  },
  "notionBacklog": "https://app.notion.com/p/Altea-Outdoor-Portail-de-retours-V1-3eda32b763b9814a9231f3080bdc7843",
  "github": "https://github.com/adrienmateo",
  "repoSite": "https://github.com/adrienmateo/site_web",
  "repoF1": "https://github.com/adrienmateo/F1-duel-rythme",
  "dashboardF1": "https://f1-automatisation.netlify.app"
};

window.CONTENT = {
  "fr": {
    "meta": {
      "title": "Adrien-Matéo Soules — Business Analyst IT",
      "description": "Business Analyst IT au profil technico-fonctionnel : du premier atelier à l'adoption de la solution."
    },
    "ui": {
      "skip": "Aller au contenu",
      "close": "Fermer",
      "back": "Retour au portfolio"
    },
    "nav": {
      "about": "À propos",
      "skills": "Compétences",
      "work": "Projets",
      "path": "Parcours",
      "contact": "Contact"
    },
    "hero": {
      "role": "Business Analyst IT",
      "pitch": "Profil technico-fonctionnel. Du premier atelier à l'adoption de la solution.",
      "ctaContact": "Me contacter",
      "ctaCv": "Télécharger mon CV"
    },
    "about": {
      "title": "À propos",
      "body": [
        "Je suis Business Analyst IT, avec un profil technico-fonctionnel. J'interviens sur des projets de mise en place de solutions SaaS et informatiques, du premier atelier à la fin du projet. Je cadre le besoin avec les équipes métier, je construis la solution avec les développeurs, je la teste, puis j'accompagne les utilisateurs jusqu'à son adoption.",
        "Ce qui me caractérise, c'est la curiosité. Je vais chercher le détail, je fouille jusqu'à comprendre comment les choses fonctionnent vraiment, pour que rien ne casse une fois en production. Et quand une tâche se répète, je l'automatise."
      ]
    },
    "skills": {
      "title": "Compétences",
      "lead": "Mes compétences, dans l'ordre où elles interviennent sur un projet. Choisissez une étape ou un outil.",
      "hint": "Sélectionnez une étape pour voir ce que j'y fais et avec quels outils.",
      "toolsTitle": "Boîte à outils",
      "usedIn": "Utilisé pour",
      "steps": [
        {
          "id": "cadrer",
          "name": "Cadrer",
          "tag": "Comprendre le besoin",
          "text": "Ateliers avec les équipes métier, analyse de l'existant, identification des écarts entre le besoin et la solution."
        },
        {
          "id": "concevoir",
          "name": "Concevoir",
          "tag": "Le rendre technique",
          "text": "Spécifications fonctionnelles et techniques, user stories, critères d'acceptance en Gherkin, relais avec l'équipe produit."
        },
        {
          "id": "integrer",
          "name": "Intégrer",
          "tag": "Relier les systèmes",
          "text": "API REST, webhooks, SFTP, flux avec les ERP, les CRM, l'e-commerce et les transporteurs."
        },
        {
          "id": "tester",
          "name": "Tester",
          "tag": "S'assurer que ça tient",
          "text": "Cahiers de recette, analyse des logs, diagnostic et résolution des anomalies."
        },
        {
          "id": "accompagner",
          "name": "Accompagner",
          "tag": "Faire adopter",
          "text": "Formation des key users, coordination jusqu'à l'hypercare, suivi après la mise en production."
        }
      ],
      "auto": {
        "id": "automatiser",
        "name": "Automatiser",
        "tag": "En continu, à chaque étape",
        "text": "Workflows automatisés, agents IA, scripts et petits outils internes qui retirent les tâches répétitives."
      },
      "cats": [
        [
          "fonc",
          "Fonctionnel et gestion de projet"
        ],
        [
          "tech",
          "Technique et IA"
        ],
        [
          "sys",
          "Systèmes intégrés"
        ]
      ],
      "uses": {
        "jira": "Suivi du backlog, des anomalies et des remontées produit.",
        "confluence": "Documentation projet et spécifications partagées.",
        "notion": "Cadrage, notes d'atelier et backlog d'études de cas.",
        "productboard": "Remontée des besoins clients vers l'équipe produit.",
        "trello": "Organisation des tâches au quotidien.",
        "drawio": "Schémas de flux et d'architecture.",
        "excel": "Analyses de données, mapping de champs, suivi de recette.",
        "gsheets": "Tableaux partagés et historiques automatisés.",
        "postman": "Je rejoue les appels API pour isoler un bug.",
        "mongodb": "Requêtes et exports pour diagnostiquer les données.",
        "datadog": "Je remonte les logs pour comprendre une anomalie.",
        "vscode": "Lecture de JSON, scripts et outils internes.",
        "node": "Scripts de calcul et d'automatisation.",
        "github": "Versionner mes projets et les exécuter avec GitHub Actions.",
        "make": "Scénarios automatisés par webhook, avec l'IA intégrée.",
        "n8n": "Workflows d'automatisation entre outils.",
        "claude": "Agents IA, rédaction et analyse automatisées.",
        "sap": "ERP connecté aux flux de commandes et de stock.",
        "cegid": "ERP et CRM retail intégrés aux flux.",
        "nav": "ERP connecté aux flux de commandes.",
        "hubspot": "CRM : suivi de portefeuille et reporting.",
        "shopify": "Plateforme e-commerce reliée aux flux de commandes."
      }
    },
    "work": {
      "title": "Projets",
      "lead": "Ce que je fais, montré plutôt que raconté.",
      "open": "Découvrir",
      "shows": "Ce que ça montre",
      "projects": [
        {
          "id": "methode",
          "title": "Ma méthode de travail",
          "kind": "Pratique professionnelle",
          "text": "Comment je mène un projet d'implémentation, de la conception à l'hypercare.",
          "summary": "Des projets SaaS de 9 mois à 2 ans, en France et à l'international. Le déroulé d'un projet, avec qui je travaille, ce que je livre, et un exemple concret de diagnostic.",
          "shows": "Pilotage, intégration, recette, accompagnement",
          "tags": [
            "Design",
            "Build",
            "Recette",
            "Hypercare"
          ],
          "links": [
            [
              "methode.html",
              "Voir ma méthode",
              true
            ]
          ]
        },
        {
          "id": "backlog",
          "title": "Du besoin au backlog",
          "kind": "Étude de cas",
          "text": "Un portail de retours e-commerce : 38 user stories, un Sprint 1 priorisé et ses wireframes.",
          "summary": "Étude de cas fictive pour illustrer ma démarche de priorisation de backlog : découpage en user stories, estimation, Sprint 1 calibré sur la capacité, critères Gherkin et wireframes.",
          "shows": "Analyse métier, priorisation, spécification",
          "tags": [
            "Notion",
            "User stories",
            "Gherkin",
            "Wireframes"
          ],
          "img": "wf-retour.jpg",
          "links": [
            [
              "backlog.html",
              "Voir l'étude de cas",
              true
            ],
            [
              "@notion",
              "Backlog sur Notion",
              false
            ]
          ]
        },
        {
          "id": "f1",
          "title": "Analyse de performance F1",
          "kind": "Projet personnel",
          "text": "Un dashboard pour comparer les pilotes, et un compte rendu automatique après chaque Grand Prix.",
          "summary": "Un outil web qui compare les performances entre pilotes à partir de l'API OpenF1, et une automatisation qui envoie un résumé de chaque Grand Prix aux personnes inscrites, rédigé par Claude.",
          "shows": "API, données, automatisation, IA appliquée",
          "tags": [
            "OpenF1",
            "GitHub Actions",
            "Make",
            "Claude"
          ],
          "img": "make-f1.png",
          "links": [
            [
              "f1.html",
              "Voir le projet",
              true
            ],
            [
              "@dashboard",
              "Ouvrir le dashboard",
              false
            ],
            [
              "@repoF1",
              "Voir le code",
              false
            ]
          ]
        },
        {
          "id": "site",
          "title": "Ce site",
          "kind": "Projet personnel",
          "text": "Conçu et codé de A à Z, bilingue, hébergé sur GitHub Pages avec mon propre domaine.",
          "summary": "Un site statique en HTML, CSS et JavaScript, sans framework. Contenu bilingue géré dans un seul fichier, déploiement automatique depuis GitHub et nom de domaine configuré chez OVH.",
          "shows": "Autonomie technique, sens du détail",
          "tags": [
            "HTML",
            "CSS",
            "JavaScript",
            "GitHub Pages",
            "DNS"
          ],
          "links": [
            [
              "@repoSite",
              "Voir le code",
              true
            ]
          ]
        }
      ]
    },
    "path": {
      "title": "Parcours",
      "xp": "Expérience",
      "edu": "Formation",
      "certs": "Certifications",
      "certsTodo": "Certifications à ajouter, avec un lien vers chaque justificatif.",
      "langs": "Langues",
      "timeline": [
        {
          "when": "2024 – aujourd'hui",
          "role": "Business Analyst IT",
          "org": "OneStock",
          "text": "Pilotage de multiples projets d'implémentation de bout en bout, de la conception à l'hypercare : spécifications fonctionnelles et techniques, intégration avec ERP, CRM, transporteurs et e-commerce, recette, formation des key users."
        },
        {
          "when": "2023 – 2024",
          "role": "Customer Success Manager (alternance)",
          "org": "Buybox",
          "text": "Portefeuille de 65 comptes B2B piloté en autonomie : onboarding et intégrations clients, reporting de performance, pipeline d'upsell."
        },
        {
          "when": "2022",
          "role": "Chef de projet (stage)",
          "org": "Capgemini Engineering",
          "text": "Cadrage et lancement d'un programme de formation interne à l'échelle du groupe : objectifs, conception, coordination inter-équipes."
        },
        {
          "when": "2022",
          "role": "Assistant de gestion (alternance)",
          "org": "Ecotec",
          "text": "Mise en place d'un CRM et restructuration de la base de données clients."
        }
      ],
      "education": [
        {
          "name": "Toulouse Business School",
          "text": "2021 – 2024 · Programme Grande École, Strategic Innovation Management. Mention Bien, Certificat d'excellence Consulting."
        },
        {
          "name": "Université de Bordeaux",
          "text": "2020 – 2021 · Licence Économie-Gestion, Mention Bien"
        },
        {
          "name": "IUT de Rodez",
          "text": "2018 – 2020 · DUT Gestion des Entreprises et des Administrations"
        }
      ],
      "languages": [
        [
          "Français",
          "langue maternelle"
        ],
        [
          "Anglais",
          "courant, usage professionnel quotidien"
        ],
        [
          "Espagnol",
          "notions (A2)"
        ]
      ]
    },
    "contact": {
      "title": "Travaillons ensemble",
      "lead": "Un poste, un projet ou une question ? Écrivez-moi, je réponds rapidement.",
      "mail": "M'écrire"
    },
    "footer": "Conçu et codé par mes soins, hébergé sur GitHub Pages.",
    "methode": {
      "meta": {
        "title": "Ma méthode de travail — Adrien-Matéo Soules",
        "description": "Comment je mène un projet d'implémentation SaaS, de la conception à l'hypercare."
      },
      "kind": "Pratique professionnelle",
      "title": "Ma méthode de travail",
      "lead": "Des projets d'implémentation SaaS de 9 mois à 2 ans, avec des clients en France et à l'international. Je suis l'interface entre les équipes métier du client, les équipes techniques et le produit.",
      "phasesTitle": "Le déroulé d'un projet",
      "cols": [
        "Ce que je fais",
        "Avec qui",
        "Ce que je livre"
      ],
      "phases": [
        [
          "Design",
          "Ateliers, analyse des écarts entre le besoin et la solution.",
          "Équipes métier du client, Solution Architect",
          "Spécifications fonctionnelles et techniques"
        ],
        [
          "Build",
          "Paramétrage, intégration des flux API avec les ERP, CRM, transporteurs, prestataires de paiement et l'e-commerce.",
          "Développeurs, intégrateurs partenaires",
          "Flux opérationnels, documentation"
        ],
        [
          "Recette",
          "Tests, analyse des logs, diagnostic des anomalies, recette des nouvelles versions.",
          "Key users, équipe produit",
          "Cahiers de recette, remontées produit"
        ],
        [
          "Hypercare",
          "Formation des key users, jusqu'à 15 personnes, et suivi après la mise en production.",
          "Utilisateurs finaux",
          "Supports de formation, plan de montée en compétence"
        ]
      ],
      "principlesTitle": "Mes principes",
      "principles": [
        "Je reformule le besoin avant de le spécifier.",
        "Je vais chercher le détail pour que rien ne casse en production.",
        "Je parle aux équipes techniques sans intermédiaire.",
        "Un outil n'est livré que s'il est adopté."
      ],
      "demoTitle": "Un exemple : diagnostiquer une anomalie",
      "demoLead": "Un cas fictif, mais typique de la recette. Suivez l'enquête comme je la mène : des logs jusqu'à l'explication au client."
    },
    "backlog": {
      "meta": {
        "title": "Du besoin au backlog — Adrien-Matéo Soules",
        "description": "Étude de cas : cadrage d'un portail de retours e-commerce, backlog de 38 user stories, Sprint 1 priorisé, critères Gherkin et wireframes."
      },
      "kind": "Étude de cas",
      "title": "Du besoin au backlog",
      "lead": "Étude de cas fictive pour illustrer ma démarche de priorisation de backlog.",
      "notionCta": "Voir le backlog complet sur Notion",
      "moreTitle": "Pour aller plus loin",
      "moreText": "Le backlog complet des 38 user stories, les critères Gherkin du Sprint 1, les risques et les questions ouvertes sont sur Notion.",
      "contextTitle": "Le contexte",
      "context": "Altea Outdoor est une marque d'équipement outdoor fictive, qui vend sur son site e-commerce et dans 25 magasins en France. Elle veut un portail de retours en self-service.",
      "problemTitle": "Le problème",
      "problem": [
        "Les retours sont déclarés par mail ou formulaire, puis traités à la main.",
        "Environ 12 % des commandes web sont retournées.",
        "Le remboursement prend jusqu'à 3 semaines, sans visibilité pour le client.",
        "Les retours représentent 30 % des tickets du service client."
      ],
      "goalsTitle": "Les objectifs de la V1",
      "goals": [
        "80 % des retours web déclarés via le portail à 3 mois",
        "−40 % de tickets liés aux retours",
        "Remboursement en moins de 7 jours après réception en entrepôt"
      ],
      "scopeTitle": "Le périmètre",
      "inTitle": "Dans la V1",
      "in": [
        "Commandes passées sur le site",
        "Retour par point relais avec étiquette prépayée",
        "Règles d'éligibilité : délai, articles non retournables, frais",
        "Suivi du retour et remboursement après contrôle"
      ],
      "outTitle": "Hors V1",
      "out": [
        "Retour en magasin",
        "Échange et avoir",
        "Commandes passées en magasin",
        "International"
      ],
      "approachTitle": "Ma démarche",
      "approach": [
        [
          "Découper",
          "38 user stories, regroupées en 6 parcours à partir des écrans et du workflow."
        ],
        [
          "Estimer",
          "Chaque story est chiffrée en points, sur l'échelle de Fibonacci."
        ],
        [
          "Prioriser",
          "Le Sprint 1 couvre ce sans quoi rien ne fonctionne : se connecter, déclarer un retour, le voir côté SAV."
        ],
        [
          "Calibrer",
          "29 points engagés pour une capacité de 30, avec deux stories en réserve si le rythme le permet."
        ],
        [
          "Spécifier",
          "Chaque story du Sprint 1 a ses critères d'acceptance en Gherkin, cas d'erreur compris."
        ],
        [
          "Anticiper",
          "Les risques et les questions ouvertes sont posés avant le Refinement, pas découverts pendant."
        ]
      ],
      "backlogTitle": "Le backlog",
      "backlogLead": "38 user stories, réparties par parcours.",
      "parcours": [
        [
          "Demandes de retour",
          15
        ],
        [
          "Réception entrepôt",
          8
        ],
        [
          "Droits",
          6
        ],
        [
          "Espace client",
          4
        ],
        [
          "Pilotage",
          3
        ],
        [
          "Connexion",
          2
        ]
      ],
      "storiesLabel": "stories",
      "sprintTitle": "Le Sprint 1",
      "sprintLead": "Objectif : poser les fondations du portail. Un client déclare un retour, le SAV le voit.",
      "sprintCols": [
        "Story",
        "Rôle",
        "Points"
      ],
      "sprint": [
        [
          "US-01",
          "Se connecter et arriver sur son espace selon son rôle",
          "Tous",
          5
        ],
        [
          "US-02",
          "Voir la liste des demandes de retour de la semaine",
          "Agent SAV",
          8
        ],
        [
          "US-03",
          "Déclarer un retour sur une commande",
          "Client",
          13
        ],
        [
          "US-38",
          "Configurer les frais de retour par catégorie",
          "Admin",
          3
        ]
      ],
      "sprintTotal": "Total engagé",
      "sprintCapacity": "29 / 30 points",
      "reserve": "En réserve : US-11 (scanner un colis à réception) et US-33 (liste des colis attendus).",
      "wfTitle": "Les wireframes",
      "wfLead": "Les 3 écrans du Sprint 1, en basse fidélité. Chaque repère bleu renvoie à une story et à un scénario.",
      "wf": [
        {
          "img": "wf-retour.jpg",
          "title": "Déclarer un retour (US-03)",
          "notes": [
            "Sélection des articles et de la quantité",
            "Motif obligatoire, montré ici en état d'erreur (scénario 4)",
            "Choix du point relais, seul mode de retour en V1",
            "Frais de retour calculés selon la catégorie (US-38)",
            "Valider : la demande apparaît côté SAV (US-02)"
          ]
        },
        {
          "img": "wf-connexion.jpg",
          "title": "Connexion (US-01)",
          "notes": [
            "Un seul écran pour les 4 rôles",
            "Message d'erreur si les identifiants sont faux (scénario 5)",
            "Redirection vers l'espace propre à chaque rôle"
          ]
        },
        {
          "img": "wf-liste-sav.jpg",
          "title": "Demandes de retour, côté SAV (US-02)",
          "notes": [
            "Navigation semaine par semaine",
            "Un code couleur par statut",
            "La nouvelle demande du client arrive en tête de liste",
            "Filtres en pointillés : prévus au Sprint 2 (US-22)"
          ]
        }
      ],
      "gherkinTitle": "Un exemple de critères d'acceptance",
      "gherkinLead": "US-03, déclarer un retour : le cas nominal et le cas d'erreur.",
      "gherkin": "Scénario 3 — Confirmation du retour\nGiven un client ayant rempli tous les champs obligatoires\nWhen il clique sur « Valider »\nThen la demande de retour est créée\nAnd elle apparaît automatiquement dans la liste de l'agent SAV\n\nScénario 4 — Champ manquant\nGiven un client sur le formulaire\nWhen il tente de valider sans avoir rempli tous les champs obligatoires\nThen un message d'erreur s'affiche sur le champ manquant\nAnd la demande n'est pas créée",
      "risksTitle": "Les risques",
      "risks": [
        [
          "Vélocité",
          "Premier sprint sur un nouveau produit : les 29 points sont à confirmer avec les développeurs en début de Refinement."
        ],
        [
          "Suivi du colis en temps réel",
          "Dépend de l'API du transporteur. Reporté au Sprint 2, le temps de clarifier les statuts disponibles."
        ],
        [
          "Frais de retour",
          "Affichés dès le Sprint 1 grâce à US-38. Leur déduction automatique du remboursement arrive au Sprint 2."
        ]
      ],
      "toolsTitle": "Outils",
      "tools": [
        [
          "Notion",
          "cadrage, backlog et Sprint 1"
        ],
        [
          "Gherkin",
          "critères d'acceptance"
        ],
        [
          "Wireframes",
          "écrans du Sprint 1"
        ]
      ]
    },
    "f1": {
      "meta": {
        "title": "Analyse de performance F1 — Adrien-Matéo Soules",
        "description": "Un dashboard pour comparer les pilotes de F1 au-delà du classement, et une automatisation qui résume chaque Grand Prix par mail."
      },
      "back": "Retour au portfolio",
      "kind": "Projet personnel",
      "title": "Analyse de performance F1",
      "lead": "Un outil pour comparer les pilotes au-delà du classement, et une automatisation qui résume chaque Grand Prix.",
      "open": "Ouvrir le dashboard",
      "goals": [
        {
          "title": "Le dashboard : comparer et analyser",
          "text": "Un outil web pour comparer les performances entre pilotes, coéquipiers ou pilotes au choix, et analyser une course en détail : écarts tour par tour, rythme de course sur les tours propres, positions en piste et stratégies de pneus. Les données viennent en direct de l'API publique OpenF1."
        },
        {
          "title": "Le compte rendu : résumer et diffuser",
          "text": "Après chaque Grand Prix, une automatisation calcule les chiffres clés de la course. Claude en rédige un résumé, qui est envoyé par mail aux personnes inscrites. Chaque duel entre coéquipiers est archivé pour suivre les tendances sur la saison."
        }
      ],
      "archTitle": "Architecture",
      "archLead": "Deux usages, un même moteur de calcul.",
      "scrollHint": "Faites glisser le schéma pour l'explorer.",
      "makeTitle": "Le scénario Make",
      "makeText": "Le webhook reçoit les chiffres du Grand Prix envoyés par GitHub Actions. Claude rédige le résumé, puis un routeur envoie le mail aux inscrits et archive chaque duel dans Google Sheets.",
      "makeAlt": "Scénario Make : webhook, Claude, routeur, Gmail, itérateur et Google Sheets",
      "choicesTitle": "Choix de conception",
      "choices": [
        [
          "Un seul code de calcul",
          "Le dashboard et le compte rendu utilisent exactement la même logique : les chiffres du mail sont toujours ceux affichés à l'écran."
        ],
        [
          "Claude rédige, il ne calcule pas",
          "L'IA reçoit des chiffres déjà vérifiés et une consigne qui lui interdit d'inventer. L'analyse reste fiable, la rédaction fluide."
        ],
        [
          "Un secours à chaque étape",
          "Si Claude échoue, le mail part avec les chiffres seuls. Si Make est injoignable, GitHub envoie lui-même le compte rendu."
        ]
      ],
      "stackTitle": "Stack",
      "stack": [
        [
          "OpenF1",
          "API REST publique"
        ],
        [
          "JavaScript",
          "dashboard et graphiques"
        ],
        [
          "Node.js",
          "calcul du compte rendu"
        ],
        [
          "GitHub Actions",
          "exécution à la demande"
        ],
        [
          "Make",
          "orchestration par webhook"
        ],
        [
          "Claude",
          "rédaction du résumé"
        ],
        [
          "Gmail",
          "envoi aux inscrits"
        ],
        [
          "Google Sheets",
          "historique de la saison"
        ],
        [
          "Netlify",
          "hébergement et inscriptions"
        ]
      ],
      "diagram": {
        "top": "Dashboard, à chaque visite",
        "bottom": "Compte rendu, à la demande",
        "chrono": [
          "Chronométrage F1",
          "flux live officiel"
        ],
        "openf1": [
          "OpenF1",
          "API REST, JSON",
          "sans clé, ~3 req/s"
        ],
        "netlify": [
          "Netlify",
          "héberge index.html"
        ],
        "browser": [
          "Navigateur",
          "du visiteur",
          "calcul + graphiques"
        ],
        "dashboard": [
          "Dashboard",
          "écarts entre pilotes",
          "tour par tour, en piste",
          "stratégies pneus"
        ],
        "forms": [
          "Netlify Forms",
          "inscrits au compte rendu"
        ],
        "me": [
          "Moi",
          "Run workflow"
        ],
        "gha": [
          "GitHub Actions",
          "report.mjs, Node.js",
          "calcul du GP + mail"
        ],
        "make": [
          "Make",
          "webhook"
        ],
        "claude": [
          "Claude",
          "rédige le résumé"
        ],
        "gmail": [
          "Gmail",
          "moi + inscrits (Cci)"
        ],
        "sheets": [
          "Google Sheets",
          "1 ligne par duel"
        ],
        "l": {
          "records": "enregistre",
          "records2": "chaque session",
          "fetch": "fetch (CORS)",
          "serves": "sert la page",
          "draws": "trace",
          "subscribe": "s'inscrire",
          "same": "même code",
          "same2": "de calcul",
          "launches": "lance",
          "calls": "8 appels",
          "reads": "lit les inscrits",
          "reads2": "(API Netlify)",
          "post": "POST JSON",
          "facts": "faits",
          "summary": "résumé HTML",
          "iter": "Iterator, 11 duels",
          "fallback": "secours : si Make est injoignable, GitHub envoie lui-même le mail factuel"
        }
      },
      "code": "Voir le code"
    },
    "demo": {
      "title": "Démo : une commande est bloquée",
      "lead": "Un cas fictif, mais typique. Suivez l'enquête comme je la mène : des logs jusqu'à l'explication au client.",
      "prev": "Étape précédente",
      "next": "Étape suivante",
      "restart": "Recommencer",
      "note": "Données fictives",
      "steps": [
        "Les logs",
        "Le payload",
        "Le diagnostic",
        "La résolution"
      ],
      "logsIntro": "Le service client signale que la commande FR-48213 n'est jamais partie. Je commence par les logs. Cliquez sur la ligne en erreur.",
      "payloadIntro": "La requête envoyée au transporteur, telle que le système l'a émise :",
      "payloadFlag": "Le code postal commence par 20 : la commande part en Corse.",
      "responseIntro": "Et la réponse du transporteur :",
      "diagnosis": [
        "Le transporteur configuré par défaut ne livre pas la Corse : il refuse la demande avec une erreur 422.",
        "Aucun transporteur de secours n'est prévu pour ce cas. La commande reste donc en attente, sans alerte.",
        "Ce n'est pas un bug ponctuel : toutes les commandes vers la Corse sont concernées."
      ],
      "techTitle": "Côté technique",
      "tech": [
        "Ajout d'une règle de routage : codes postaux 20xxx vers un transporteur qui dessert l'île.",
        "Appel rejoué dans Postman : 201 Created.",
        "Alerte ajoutée si une expédition échoue plus de 2 fois."
      ],
      "bizTitle": "Côté client",
      "biz": "« Les commandes vers la Corse restaient bloquées, car le transporteur choisi ne livre pas l'île. Elles partent désormais automatiquement avec un autre transporteur, et votre service client est prévenu si un envoi échoue. »"
    }
  },
  "en": {
    "meta": {
      "title": "Adrien-Matéo Soules — IT Business Analyst",
      "description": "IT Business Analyst with a functional and technical profile: from the first workshop to solution adoption."
    },
    "ui": {
      "skip": "Skip to content",
      "close": "Close",
      "back": "Back to portfolio"
    },
    "nav": {
      "about": "About",
      "skills": "Skills",
      "work": "Projects",
      "path": "Background",
      "contact": "Contact"
    },
    "hero": {
      "role": "IT Business Analyst",
      "pitch": "Functional and technical profile. From the first workshop to solution adoption.",
      "ctaContact": "Get in touch",
      "ctaCv": "Download my resume"
    },
    "about": {
      "title": "About",
      "body": [
        "I'm an IT Business Analyst with a functional and technical profile. I work on SaaS and IT implementation projects, from the first workshop to the end of the project. I scope the need with business teams, build the solution with developers, test it, then support users all the way to adoption.",
        "What defines me is curiosity. I go after the details and dig until I understand how things really work, so nothing breaks once in production. And when a task repeats, I automate it."
      ]
    },
    "skills": {
      "title": "Skills",
      "lead": "My skills, in the order they come into play on a project. Pick a step or a tool.",
      "hint": "Select a step to see what I do there and which tools I use.",
      "toolsTitle": "Toolbox",
      "usedIn": "Used for",
      "steps": [
        {
          "id": "cadrer",
          "name": "Scope",
          "tag": "Understand the need",
          "text": "Workshops with business teams, analysis of the current setup, gaps between the need and the solution."
        },
        {
          "id": "concevoir",
          "name": "Design",
          "tag": "Make it technical",
          "text": "Functional and technical specifications, user stories, Gherkin acceptance criteria, liaison with the product team."
        },
        {
          "id": "integrer",
          "name": "Integrate",
          "tag": "Connect the systems",
          "text": "REST APIs, webhooks, SFTP, flows with ERPs, CRMs, e-commerce and carriers."
        },
        {
          "id": "tester",
          "name": "Test",
          "tag": "Make sure it holds",
          "text": "Test plans, log analysis, diagnosing and fixing issues."
        },
        {
          "id": "accompagner",
          "name": "Support",
          "tag": "Drive adoption",
          "text": "Key-user training, coordination through hypercare, follow-up after go-live."
        }
      ],
      "auto": {
        "id": "automatiser",
        "name": "Automate",
        "tag": "Continuously, at every step",
        "text": "Automated workflows, AI agents, scripts and small internal tools that remove repetitive work."
      },
      "cats": [
        [
          "fonc",
          "Functional and project management"
        ],
        [
          "tech",
          "Technical and AI"
        ],
        [
          "sys",
          "Integrated systems"
        ]
      ],
      "uses": {
        "jira": "Tracking the backlog, issues and product feedback.",
        "confluence": "Project documentation and shared specifications.",
        "notion": "Scoping, workshop notes and case-study backlogs.",
        "productboard": "Passing client needs on to the product team.",
        "trello": "Day-to-day task organization.",
        "drawio": "Flow and architecture diagrams.",
        "excel": "Data analysis, field mapping, test tracking.",
        "gsheets": "Shared sheets and automated logs.",
        "postman": "I replay API calls to isolate a bug.",
        "mongodb": "Queries and exports to diagnose data.",
        "datadog": "I trace logs to understand an issue.",
        "vscode": "Reading JSON, scripts and internal tools.",
        "node": "Calculation and automation scripts.",
        "github": "Versioning my projects and running them with GitHub Actions.",
        "make": "Webhook-driven automations with built-in AI.",
        "n8n": "Automation workflows across tools.",
        "claude": "AI agents, automated writing and analysis.",
        "sap": "ERP connected to order and stock flows.",
        "cegid": "Retail ERP and CRM integrated into the flows.",
        "nav": "ERP connected to order flows.",
        "hubspot": "CRM: account portfolio and reporting.",
        "shopify": "E-commerce platform connected to order flows."
      }
    },
    "work": {
      "title": "Projects",
      "lead": "What I do, shown rather than told.",
      "open": "Discover",
      "shows": "What it shows",
      "projects": [
        {
          "id": "methode",
          "title": "How I work",
          "kind": "Professional practice",
          "text": "How I run an implementation project, from design to hypercare.",
          "summary": "SaaS projects lasting 9 months to 2 years, in France and abroad. How a project unfolds, who I work with, what I deliver, and a concrete troubleshooting example.",
          "shows": "Delivery, integration, testing, user support",
          "tags": [
            "Design",
            "Build",
            "UAT",
            "Hypercare"
          ],
          "links": [
            [
              "methode.html",
              "See how I work",
              true
            ]
          ]
        },
        {
          "id": "backlog",
          "title": "From need to backlog",
          "kind": "Case study",
          "text": "An e-commerce returns portal: 38 user stories, a prioritized Sprint 1 and its wireframes.",
          "summary": "A fictional case study to illustrate how I prioritize a backlog: breaking down user stories, estimating, sizing Sprint 1 to capacity, Gherkin criteria and wireframes.",
          "shows": "Business analysis, prioritization, specification",
          "tags": [
            "Notion",
            "User stories",
            "Gherkin",
            "Wireframes"
          ],
          "img": "wf-retour.jpg",
          "links": [
            [
              "backlog.html",
              "See the case study",
              true
            ],
            [
              "@notion",
              "Backlog on Notion",
              false
            ]
          ]
        },
        {
          "id": "f1",
          "title": "F1 performance analysis",
          "kind": "Personal project",
          "text": "A dashboard to compare drivers, and an automated report after every Grand Prix.",
          "summary": "A web tool comparing drivers' performance from the OpenF1 API, and an automation that emails a summary of every Grand Prix to subscribers, written by Claude.",
          "shows": "APIs, data, automation, applied AI",
          "tags": [
            "OpenF1",
            "GitHub Actions",
            "Make",
            "Claude"
          ],
          "img": "make-f1.png",
          "links": [
            [
              "f1.html",
              "See the project",
              true
            ],
            [
              "@dashboard",
              "Open the dashboard",
              false
            ],
            [
              "@repoF1",
              "See the code",
              false
            ]
          ]
        },
        {
          "id": "site",
          "title": "This site",
          "kind": "Personal project",
          "text": "Designed and coded from scratch, bilingual, hosted on GitHub Pages with my own domain.",
          "summary": "A static site in HTML, CSS and JavaScript, no framework. Bilingual content managed in a single file, automatic deployment from GitHub and a domain set up with OVH.",
          "shows": "Technical autonomy, attention to detail",
          "tags": [
            "HTML",
            "CSS",
            "JavaScript",
            "GitHub Pages",
            "DNS"
          ],
          "links": [
            [
              "@repoSite",
              "See the code",
              true
            ]
          ]
        }
      ]
    },
    "path": {
      "title": "Background",
      "xp": "Experience",
      "edu": "Education",
      "certs": "Certifications",
      "certsTodo": "Certifications to add, each with a link to the certificate.",
      "langs": "Languages",
      "timeline": [
        {
          "when": "2024 – present",
          "role": "IT Business Analyst",
          "org": "OneStock",
          "text": "Ran multiple implementation projects end to end, from design to hypercare: functional and technical specifications, integration with ERPs, CRMs, carriers and e-commerce, UAT, key-user training."
        },
        {
          "when": "2023 – 2024",
          "role": "Customer Success Manager (work-study)",
          "org": "Buybox",
          "text": "Managed a portfolio of 65 B2B accounts on my own: onboarding and client integrations, performance reporting, upsell pipeline."
        },
        {
          "when": "2022",
          "role": "Project Manager (internship)",
          "org": "Capgemini Engineering",
          "text": "Scoped and launched a group-wide internal training program: objectives, design, cross-team coordination."
        },
        {
          "when": "2022",
          "role": "Business Assistant (work-study)",
          "org": "Ecotec",
          "text": "Rolled out a CRM and restructured the customer database."
        }
      ],
      "education": [
        {
          "name": "Toulouse Business School",
          "text": "2021 – 2024 · Master in Management (Grande École), Strategic Innovation Management. Graduated with honors, Certificate of Excellence in Consulting."
        },
        {
          "name": "University of Bordeaux",
          "text": "2020 – 2021 · Bachelor's in Economics and Management, with honors"
        },
        {
          "name": "IUT de Rodez",
          "text": "2018 – 2020 · Two-year degree in Business and Administration (DUT GEA)"
        }
      ],
      "languages": [
        [
          "French",
          "native"
        ],
        [
          "English",
          "fluent, used daily at work"
        ],
        [
          "Spanish",
          "basic (A2)"
        ]
      ]
    },
    "contact": {
      "title": "Let's work together",
      "lead": "A role, a project or a question? Write to me, I reply quickly.",
      "mail": "Email me"
    },
    "footer": "Designed and built by me, hosted on GitHub Pages.",
    "methode": {
      "meta": {
        "title": "How I work — Adrien-Matéo Soules",
        "description": "How I run a SaaS implementation project, from design to hypercare."
      },
      "kind": "Professional practice",
      "title": "How I work",
      "lead": "SaaS implementation projects lasting 9 months to 2 years, with clients in France and abroad. I'm the link between the client's business teams, the technical teams and the product team.",
      "phasesTitle": "How a project unfolds",
      "cols": [
        "What I do",
        "Who with",
        "What I deliver"
      ],
      "phases": [
        [
          "Design",
          "Workshops, gap analysis between the need and the solution.",
          "Client business teams, Solution Architect",
          "Functional and technical specifications"
        ],
        [
          "Build",
          "Configuration, API flow integration with ERPs, CRMs, carriers, payment providers and e-commerce.",
          "Developers, partner integrators",
          "Working flows, documentation"
        ],
        [
          "UAT",
          "Testing, log analysis, issue diagnosis, testing new releases.",
          "Key users, product team",
          "Test plans, product feedback"
        ],
        [
          "Hypercare",
          "Training key users, up to 15 people, and follow-up after go-live.",
          "End users",
          "Training materials, upskilling plan"
        ]
      ],
      "principlesTitle": "My principles",
      "principles": [
        "I restate the need before specifying it.",
        "I go after the details so nothing breaks in production.",
        "I talk to technical teams directly.",
        "A tool is only delivered once it's adopted."
      ],
      "demoTitle": "An example: troubleshooting an issue",
      "demoLead": "A fictional case, but a typical one in UAT. Follow the investigation the way I run it: from the logs to the explanation for the client."
    },
    "backlog": {
      "meta": {
        "title": "From need to backlog — Adrien-Matéo Soules",
        "description": "Case study: scoping an e-commerce returns portal, a 38-story backlog, a prioritized Sprint 1, Gherkin criteria and wireframes."
      },
      "kind": "Case study",
      "title": "From need to backlog",
      "lead": "A fictional case study to illustrate how I prioritize a backlog.",
      "notionCta": "See the full backlog on Notion",
      "moreTitle": "Go further",
      "moreText": "The full backlog of 38 user stories, the Sprint 1 Gherkin criteria, the risks and the open questions are on Notion.",
      "contextTitle": "Context",
      "context": "Altea Outdoor is a fictional outdoor gear brand, selling online and in 25 stores across France. It wants a self-service returns portal.",
      "problemTitle": "The problem",
      "problem": [
        "Returns are declared by email or form, then handled manually.",
        "About 12% of online orders are returned.",
        "Refunds take up to 3 weeks, with no visibility for the customer.",
        "Returns account for 30% of customer service tickets."
      ],
      "goalsTitle": "V1 goals",
      "goals": [
        "80% of online returns declared through the portal within 3 months",
        "−40% of return-related tickets",
        "Refund within 7 days of warehouse receipt"
      ],
      "scopeTitle": "Scope",
      "inTitle": "In V1",
      "in": [
        "Online orders",
        "Return via pickup point with a prepaid label",
        "Eligibility rules: deadline, non-returnable items, fees",
        "Return tracking and refund after inspection"
      ],
      "outTitle": "Out of V1",
      "out": [
        "In-store returns",
        "Exchanges and store credit",
        "In-store orders",
        "International"
      ],
      "approachTitle": "My approach",
      "approach": [
        [
          "Break down",
          "38 user stories, grouped into 6 journeys from the screens and the workflow."
        ],
        [
          "Estimate",
          "Each story is sized in points on the Fibonacci scale."
        ],
        [
          "Prioritize",
          "Sprint 1 covers what nothing works without: log in, declare a return, see it on the support side."
        ],
        [
          "Calibrate",
          "29 points committed against a capacity of 30, with two stories in reserve if pace allows."
        ],
        [
          "Specify",
          "Each Sprint 1 story has Gherkin acceptance criteria, error cases included."
        ],
        [
          "Anticipate",
          "Risks and open questions are raised before Refinement, not discovered during it."
        ]
      ],
      "backlogTitle": "The backlog",
      "backlogLead": "38 user stories, split by journey.",
      "parcours": [
        [
          "Return requests",
          15
        ],
        [
          "Warehouse receipt",
          8
        ],
        [
          "Permissions",
          6
        ],
        [
          "Customer area",
          4
        ],
        [
          "Reporting",
          3
        ],
        [
          "Login",
          2
        ]
      ],
      "storiesLabel": "stories",
      "sprintTitle": "Sprint 1",
      "sprintLead": "Goal: lay the portal's foundations. A customer declares a return, support sees it.",
      "sprintCols": [
        "Story",
        "Role",
        "Points"
      ],
      "sprint": [
        [
          "US-01",
          "Log in and land on the right space for your role",
          "All",
          5
        ],
        [
          "US-02",
          "See the week's return requests",
          "Support agent",
          8
        ],
        [
          "US-03",
          "Declare a return on an order",
          "Customer",
          13
        ],
        [
          "US-38",
          "Set return fees by product category",
          "Admin",
          3
        ]
      ],
      "sprintTotal": "Total committed",
      "sprintCapacity": "29 / 30 points",
      "reserve": "In reserve: US-11 (scan a parcel on receipt) and US-33 (list of expected parcels).",
      "wfTitle": "Wireframes",
      "wfLead": "The 3 Sprint 1 screens, low fidelity. Each blue marker points to a story and a scenario.",
      "wf": [
        {
          "img": "wf-retour.jpg",
          "title": "Declare a return (US-03)",
          "notes": [
            "Select items and quantity",
            "Mandatory reason, shown here in its error state (scenario 4)",
            "Pickup point choice, the only return mode in V1",
            "Return fees calculated by category (US-38)",
            "Confirm: the request shows up for support (US-02)"
          ]
        },
        {
          "img": "wf-connexion.jpg",
          "title": "Login (US-01)",
          "notes": [
            "One screen for all 4 roles",
            "Error message on wrong credentials (scenario 5)",
            "Redirect to each role's own space"
          ]
        },
        {
          "img": "wf-liste-sav.jpg",
          "title": "Return requests, support side (US-02)",
          "notes": [
            "Week-by-week navigation",
            "One color per status",
            "The customer's new request arrives at the top",
            "Dashed filters: planned for Sprint 2 (US-22)"
          ]
        }
      ],
      "gherkinTitle": "An example of acceptance criteria",
      "gherkinLead": "US-03, declare a return: the happy path and the error case.",
      "gherkin": "Scenario 3 — Return confirmed\nGiven a customer who has filled in all required fields\nWhen they click \"Confirm\"\nThen the return request is created\nAnd it automatically appears in the support agent's list\n\nScenario 4 — Missing field\nGiven a customer on the form\nWhen they try to confirm without filling in all required fields\nThen an error message shows on the missing field\nAnd the request is not created",
      "risksTitle": "Risks",
      "risks": [
        [
          "Velocity",
          "First sprint on a new product: the 29 points need confirming with the developers at the start of Refinement."
        ],
        [
          "Real-time parcel tracking",
          "Depends on the carrier's API. Moved to Sprint 2 while the available statuses are clarified."
        ],
        [
          "Return fees",
          "Shown from Sprint 1 thanks to US-38. Deducting them automatically from the refund comes in Sprint 2."
        ]
      ],
      "toolsTitle": "Tools",
      "tools": [
        [
          "Notion",
          "scoping, backlog and Sprint 1"
        ],
        [
          "Gherkin",
          "acceptance criteria"
        ],
        [
          "Wireframes",
          "Sprint 1 screens"
        ]
      ]
    },
    "f1": {
      "meta": {
        "title": "F1 performance analysis — Adrien-Matéo Soules",
        "description": "A dashboard to compare F1 drivers beyond the final standings, and an automation that emails a summary of every Grand Prix."
      },
      "back": "Back to portfolio",
      "kind": "Personal project",
      "title": "F1 performance analysis",
      "lead": "A tool to compare drivers beyond the final standings, and an automation that sums up every Grand Prix.",
      "open": "Open the dashboard",
      "goals": [
        {
          "title": "The dashboard: compare and analyze",
          "text": "A web tool to compare drivers' performance, teammates or any two drivers, and analyze a race in detail: lap-by-lap gaps, race pace on clean laps, track position and tyre strategies. Data comes live from the public OpenF1 API."
        },
        {
          "title": "The race report: summarize and share",
          "text": "After each Grand Prix, an automation computes the key figures of the race. Claude writes a summary, which is emailed to subscribers. Every teammate duel is logged to track trends across the season."
        }
      ],
      "archTitle": "Architecture",
      "archLead": "Two uses, one calculation engine.",
      "scrollHint": "Drag the diagram to explore it.",
      "makeTitle": "The Make scenario",
      "makeText": "The webhook receives the Grand Prix figures sent by GitHub Actions. Claude writes the summary, then a router emails subscribers and logs each duel to Google Sheets.",
      "makeAlt": "Make scenario: webhook, Claude, router, Gmail, iterator and Google Sheets",
      "choicesTitle": "Design choices",
      "choices": [
        [
          "One calculation codebase",
          "The dashboard and the race report run exactly the same logic, so the figures in the email always match what's on screen."
        ],
        [
          "Claude writes, it doesn't compute",
          "The AI gets figures that are already checked, with instructions that forbid inventing anything. The analysis stays reliable, the writing reads well."
        ],
        [
          "A fallback at every step",
          "If Claude fails, the email goes out with the figures alone. If Make is unreachable, GitHub sends the report itself."
        ]
      ],
      "stackTitle": "Stack",
      "stack": [
        [
          "OpenF1",
          "public REST API"
        ],
        [
          "JavaScript",
          "dashboard and charts"
        ],
        [
          "Node.js",
          "report calculation"
        ],
        [
          "GitHub Actions",
          "on-demand runs"
        ],
        [
          "Make",
          "webhook orchestration"
        ],
        [
          "Claude",
          "summary writing"
        ],
        [
          "Gmail",
          "sending to subscribers"
        ],
        [
          "Google Sheets",
          "season history"
        ],
        [
          "Netlify",
          "hosting and sign-ups"
        ]
      ],
      "diagram": {
        "top": "Dashboard, on every visit",
        "bottom": "Race report, on demand",
        "chrono": [
          "F1 timing",
          "official live feed"
        ],
        "openf1": [
          "OpenF1",
          "REST API, JSON",
          "no key, ~3 req/s"
        ],
        "netlify": [
          "Netlify",
          "hosts index.html"
        ],
        "browser": [
          "Browser",
          "visitor's",
          "calculation + charts"
        ],
        "dashboard": [
          "Dashboard",
          "gaps between drivers",
          "lap by lap, on track",
          "tyre strategies"
        ],
        "forms": [
          "Netlify Forms",
          "report subscribers"
        ],
        "me": [
          "Me",
          "Run workflow"
        ],
        "gha": [
          "GitHub Actions",
          "report.mjs, Node.js",
          "GP calculation + email"
        ],
        "make": [
          "Make",
          "webhook"
        ],
        "claude": [
          "Claude",
          "writes the summary"
        ],
        "gmail": [
          "Gmail",
          "me + subscribers (Bcc)"
        ],
        "sheets": [
          "Google Sheets",
          "1 row per duel"
        ],
        "l": {
          "records": "records",
          "records2": "every session",
          "fetch": "fetch (CORS)",
          "serves": "serves the page",
          "draws": "draws",
          "subscribe": "subscribe",
          "same": "same",
          "same2": "calculation code",
          "launches": "runs",
          "calls": "8 calls",
          "reads": "reads subscribers",
          "reads2": "(Netlify API)",
          "post": "POST JSON",
          "facts": "facts",
          "summary": "HTML summary",
          "iter": "Iterator, 11 duels",
          "fallback": "fallback: if Make is unreachable, GitHub sends the factual email itself"
        }
      },
      "code": "See the code"
    },
    "demo": {
      "title": "Demo: an order is stuck",
      "lead": "A fictional case, but a typical one. Follow the investigation the way I run it: from the logs to the explanation to the client.",
      "prev": "Previous step",
      "next": "Next step",
      "restart": "Start over",
      "note": "Fictional data",
      "steps": [
        "The logs",
        "The payload",
        "The diagnosis",
        "The fix"
      ],
      "logsIntro": "Customer service reports that order FR-48213 never shipped. I start with the logs. Click the line with the error.",
      "payloadIntro": "The request sent to the carrier, exactly as the system issued it:",
      "payloadFlag": "The postcode starts with 20: the order is going to Corsica.",
      "responseIntro": "And the carrier's response:",
      "diagnosis": [
        "The default carrier doesn't deliver to Corsica: it rejects the request with a 422 error.",
        "No fallback carrier is set up for this case, so the order sits on hold with no alert.",
        "It's not a one-off bug: every order to Corsica is affected."
      ],
      "techTitle": "On the tech side",
      "tech": [
        "Added a routing rule: 20xxx postcodes go to a carrier that serves the island.",
        "Replayed the call in Postman: 201 Created.",
        "Added an alert when a shipment fails more than twice."
      ],
      "bizTitle": "For the client",
      "biz": "“Orders to Corsica were getting stuck because the selected carrier doesn't deliver to the island. They now ship automatically with another carrier, and your customer service team is notified if a shipment fails.”"
    }
  }
};
