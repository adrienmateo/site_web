# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Recruiters who assess an application for a salaried position: HR and talent acquisition, technical and functional recruiters, and hiring managers. They usually come from a LinkedIn profile, a CV or an application link. They have a few minutes to decide whether to shortlist the candidate, and they need to judge two things quickly: whether the profile fits the role (IT Business Analyst / technical-functional consultant), and whether the technical depth is real or just claimed.

## Product Purpose

The personal portfolio of Adrien-Matéo Soules, an IT Business Analyst and technical-functional consultant based in Toulouse. It exists so that the experience and the way of working can be seen and checked, which a CV cannot do.

Success means the visitor:
- **downloads the CV** (primary conversion), and/or
- **explores the projects** (backlog case study, F1 rhythm duel, this site, the log-investigation demo) to see concretely how he works.

Contact by email and the LinkedIn link support these two goals; they are not the main goal.

## Positioning

A rare double profile, business **and** technical, built on real implementation work at OneStock (an OMS SaaS for international retailers), not on theory:
- **Business + tech:** runs scoping workshops with 20+ business and IT stakeholders, then configures the solution himself and sets up APIs, webhooks and data flows (ERP, CRM, e-commerce, carriers).
- **Real technical depth:** reads logs, Datadog, Elasticsearch, MongoDB, Postman and Swagger, and debugs down to the root cause.
- **Curiosity / debugging:** digs until he understands how things really work, so that nothing breaks in production.
- **AI and automation:** a Rovo AI agent for the support team, internal tools, Make and n8n, LLMs used daily.

## Operating Context

- The visitor checks the site alongside a CV and a LinkedIn profile, often during a sourcing or shortlisting phase.
- Main page `index.html`: About, Skills (interactive steps plus a toolbox), Projects, Background, Contact.
- Detail pages: `methode.html`, `backlog.html`, `f1.html`, plus `mentions-legales.html` and `404.html`.
- External links: Notion backlog, F1 dashboard (`adrienmateo.github.io/F1-duel-rythme`), GitHub repos, LinkedIn.

## Capabilities and Constraints

- Static site in HTML, CSS and vanilla JavaScript, no framework. Hosted on GitHub Pages under the domain `adrienmateo-soules.com` (DNS at OVH).
- **Bilingual FR/EN**: all copy lives in `content.js` (`window.CONTENT.fr` / `.en`); this is the single source for text. Every copy change must exist in both languages.
- Site links and URLs live in `window.SITE` (`content.js`).
- **Open:** the CV link (`SITE.cv.fr` / `SITE.cv.en`) is empty, even though downloading the CV is the main goal. A CV file (FR and EN) still has to be provided.
- **Open:** certifications are announced but not yet listed ("Certifications to add").

## Brand Commitments

- Name: Adrien-Matéo Soules. Title: "Consultant technico-fonctionnel" / "Business Analyst IT".
- Voice: first person, direct, concrete, and factual (figures, tools, deliverables), with no superlatives.
- Existing assets: `photo.jpg`, `og-image.jpg`, school and employer logos (`logo-*.png`), hero video and image (`hero-scene.*`, `hero-night.*`), project captures (`f1-*.jpg`, `wf-*.jpg`, `site-hero.jpg`).

## Evidence on Hand

- Background: OneStock (IT Business Analyst, 2024 to present, 10+ implementation projects), Buybox (CSM, 65 B2B accounts), Capgemini Engineering (project lead, internship), Ecotec (CRM).
- Education: Toulouse Business School (Grande École programme, Mention Bien, Consulting certificate of excellence), Université de Bordeaux, IUT de Rodez.
- Projects: backlog case study (fictional, 38 user stories, wireframes, Notion), F1 rhythm duel (public site and repo, GitHub Actions, Make, Claude), this site (public repo), log-investigation demo (fictional case).
- **Do not invent:** testimonials, client names under NDA, figures that are not in `content.js`, or certifications that have not been provided.

## Product Principles

1. **Proof before claims:** every skill should lead to something visible, such as a project, a demo, code or a concrete figure.
2. **Readable in two minutes:** a recruiter, technical or not, must grasp the profile and the double competence without digging.
3. **Show the technical depth honestly:** tools and debugging are a strength to make visible, but always tied to a business need.
4. **Make the CV easy to get:** the CV download stays reachable everywhere it makes sense.
5. **Perfect FR/EN parity:** no content exists in only one language.
