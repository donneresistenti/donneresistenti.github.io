# Donne Resistenti

Sito web della mostra **Donne Resistenti**: racconta, attraverso tutte le sue diverse sfaccettature,
il ruolo delle donne all'interno delle resistenze nella storia e nel mondo.

Sito statico realizzato con [Astro](https://astro.build) e pubblicato su GitHub Pages:
<https://donneresistenti.github.io>.

## Sviluppo

Requisiti: Node.js 22+.

```sh
npm install
npm run dev       # server di sviluppo su http://localhost:4321
npm run build     # type-check + build statica in dist/
npm run preview   # anteprima della build
```

## Struttura

```
src/
  content/stories/     una storia = un file Markdown
  content.config.ts    schema dei campi di una storia
  pages/index.astro    homepage
  pages/storie/        pagina di dettaglio di ogni storia (/storie/<nome-file>/)
  components/          pennellate, foto "strappate", card, header/footer, filtri SVG
  styles/tokens.css    colori, font e spaziature presi dal poster della mostra
```

## Aggiungere una storia

Crea un file in `src/content/stories/`, ad esempio `nome-cognome.md`:

```md
---
title: Nome Cognome
subtitle: Sottotitolo facoltativo
period: 1943–1945
excerpt: Breve testo mostrato nella card in homepage.
cover: ./immagini/nome-cognome.jpg   # facoltativa, percorso relativo al file
coverAlt: Descrizione dell'immagine
order: 1                             # posizione nella griglia
draft: false                         # true = visibile solo in sviluppo
---

Testo della storia in Markdown.
```

Le storie con `draft: true` compaiono solo con `npm run dev` e non vengono pubblicate.
Le tre `storia-segnaposto-*.md` attuali servono solo a vedere la griglia: vanno rimosse
quando arrivano le storie reali.

## Stile

Lo stile è ricavato dal poster introduttivo della mostra (`end 1.psd`, escluso dal repository).

- Colori: rosso `#851E1E`, verde `#60A84E`, carta `#F6F0EB`, inchiostro `#121010`.
- Font: il poster usa PF Fuel Decay/Grime e Helvetica Neue Light. Sul sito sono sostituiti da
  [Bebas Neue](https://fonts.google.com/specimen/Bebas+Neue) (self-hosted via `@fontsource`) con un
  filtro SVG "timbro consumato" (classe `.grunge`), e da Helvetica Neue / Inter Light.
- Pennellate verdi, texture carta e foto "strappate" sono generate in SVG/CSS.

## Pubblicazione

Ogni push su `main` avvia il workflow `.github/workflows/deploy.yml`, che fa la build e pubblica su
GitHub Pages. La prima volta va abilitato in **Settings → Pages → Source: GitHub Actions**.
