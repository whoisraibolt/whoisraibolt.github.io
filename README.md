# whoisraibolt.com.br

![GitHub language count](https://img.shields.io/github/languages/count/whoisraibolt/whoisraibolt.github.io.svg)
![GitHub top language](https://img.shields.io/github/languages/top/whoisraibolt/whoisraibolt.github.io.svg)
![Libraries.io dependency status for GitHub repo](https://img.shields.io/librariesio/github/whoisraibolt/whoisraibolt.github.io.svg)
![GitHub repo size](https://img.shields.io/github/repo-size/whoisraibolt/whoisraibolt.github.io.svg)
![GitHub](https://img.shields.io/github/license/whoisraibolt/whoisraibolt.github.io.svg)
![Website](https://img.shields.io/website/https/whoisraibolt.github.io.svg?down_message=offline&up_message=online)

My github-hosted personal site - [https://whoisraibolt.com.br](https://whoisraibolt.com.br "https://whoisraibolt.com.br").

## Overview

This repository contains a static personal website hosted with GitHub Pages.

Main highlights:

- Responsive layout and custom styling.
- Dynamic GitHub project cards loaded from GitHub API.
- Multilingual content with language switcher (`pt-BR`, `en`, `es`).
- Dark/light theme toggle.

## Tech Stack

- HTML + CSS
- Vanilla JavaScript (no framework dependency)
- GitHub Pages

## Internationalization

Translations are organized by language under `texts/`:

- `texts/PT-BR/`
- `texts/EN/`
- `texts/ES/`

Each folder contains section files such as `about.txt`, `projects.txt`, and `footer.txt`.

The language loader lives in `javascript/site-i18n.js`.

## GitHub Projects Section

Project cards are rendered by `javascript/angular-github-repo.js` (legacy filename, framework-free implementation).

Data source:

- `https://api.github.com/repos/{owner}/{repo}`

If the API request fails, the UI shows a fallback card instead of breaking the section.

## Local Development

You can open `index.html` directly, but running from a local HTTP server is recommended.

Example with Python:

```bash
python -m http.server 8080
```

Then open:

- `http://localhost:8080`

## Copyright and License

Code released under the [MIT](https://github.com/whoisraibolt/whoisraibolt.github.io/blob/master/LICENSE "MIT") license.
