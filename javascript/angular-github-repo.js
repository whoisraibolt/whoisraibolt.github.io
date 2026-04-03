/**
 * GitHub repository cards without framework dependencies.
 */
(function () {
  "use strict";

  var githubApi = "https://api.github.com/repos/";
  var githubBaseUrl = "https://github.com/";
  var defaults = {
    stars: true,
    forks: true,
    issues: false,
    author: false
  };

  function translate(key, fallback) {
    if (window.SiteI18n && typeof window.SiteI18n.get === "function") {
      return window.SiteI18n.get(key, fallback);
    }
    return fallback;
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function parseOptions(rawOptions) {
    if (!rawOptions) {
      return {};
    }

    try {
      return new Function("return (" + rawOptions + ");")();
    } catch (error) {
      console.warn("Invalid github-repo-options:", rawOptions, error);
      return {};
    }
  }

  function mergeOptions(element) {
    var parsed = parseOptions(element.getAttribute("github-repo-options"));
    return {
      stars: parsed.stars !== undefined ? !!parsed.stars : defaults.stars,
      forks: parsed.forks !== undefined ? !!parsed.forks : defaults.forks,
      issues: parsed.issues !== undefined ? !!parsed.issues : defaults.issues,
      author: parsed.author !== undefined ? !!parsed.author : defaults.author
    };
  }

  function buildStatsHtml(repo, options) {
    var starsLabel = translate("projects.starsLabel", "Stars");
    var forksLabel = translate("projects.forksLabel", "Forks");
    var html = "";

    if (options.stars) {
      html +=
        '<a class="repo-stars" title="' +
        escapeHtml(starsLabel) +
        '" href="' +
        escapeHtml(repo.repoUrl) +
        '/stargazers" target="_blank" rel="noopener noreferrer">' +
        escapeHtml(repo.stargazers) +
        "</a>";
    }

    if (options.forks) {
      html +=
        '<a class="repo-forks" title="' +
        escapeHtml(forksLabel) +
        '" href="' +
        escapeHtml(repo.repoUrl) +
        '/network/members" target="_blank" rel="noopener noreferrer">' +
        escapeHtml(repo.forks) +
        "</a>";
    }

    if (options.issues) {
      html +=
        '<a class="repo-issues" title="Issues" href="' +
        escapeHtml(repo.repoUrl) +
        '/issues" target="_blank" rel="noopener noreferrer">' +
        escapeHtml(repo.issues) +
        "</a>";
    }

    return html;
  }

  function renderRepoCard(element, repo, options) {
    var cloneLabel = translate("projects.cloneButton", "Copy git clone command");
    var description = repo.description || "No description available.";
    var authorHtml = options.author
      ? '<p class="repo-link">@' + escapeHtml(repo.author) + "</p>"
      : "";

    element.innerHTML =
      '<div class="github-box">' +
      '<div class="github-box-header">' +
      '<h3><a href="' +
      escapeHtml(repo.repoUrl) +
      '" target="_blank" rel="noopener noreferrer">' +
      escapeHtml(repo.name) +
      "</a></h3>" +
      '<div class="github-stats">' +
      buildStatsHtml(repo, options) +
      "</div>" +
      "</div>" +
      '<div class="github-box-content">' +
      "<p>" +
      escapeHtml(description) +
      "</p>" +
      authorHtml +
      "</div>" +
      '<div class="github-box-download">' +
      '<div class="repo-clone-actions">' +
      '<button class="repo-clone-icon" type="button" aria-label="' +
      escapeHtml(cloneLabel) +
      '" title="' +
      escapeHtml(cloneLabel) +
      '"></button>' +
      "</div>" +
      "</div>" +
      "</div>";

    var cloneButton = element.querySelector(".repo-clone-icon");
    if (!cloneButton) {
      return;
    }

    cloneButton.addEventListener("click", function () {
      var cloneCommand = "git clone " + repo.repoUrl + ".git";
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(cloneCommand);
      }
    });
  }

  function renderRepoError(element, repoName) {
    var title = translate("projects.title", "Projects");
    var message = "Could not load " + repoName + ".";

    element.innerHTML =
      '<div class="github-box">' +
      '<div class="github-box-header">' +
      '<h3><a href="' +
      escapeHtml(githubBaseUrl + repoName) +
      '" target="_blank" rel="noopener noreferrer">' +
      escapeHtml(title) +
      "</a></h3>" +
      "</div>" +
      '<div class="github-box-content">' +
      "<p>" +
      escapeHtml(message) +
      "</p>" +
      "</div>" +
      "</div>";
  }

  function mapRepoData(repoData) {
    return {
      name: repoData.name,
      description: repoData.description,
      forks: repoData.forks_count,
      issues: repoData.open_issues,
      stargazers: repoData.stargazers_count,
      author: repoData.owner.login,
      repoUrl: githubBaseUrl + repoData.owner.login + "/" + repoData.name
    };
  }

  function loadRepositoryCard(element) {
    var repoName = element.getAttribute("github-repo");
    if (!repoName) {
      return;
    }

    var options = mergeOptions(element);
    element.__repoName = repoName;
    element.__repoOptions = options;

    fetch(githubApi + repoName, { cache: "no-store" })
      .then(function (response) {
        if (!response.ok) {
          throw new Error("GitHub API " + response.status + " for " + repoName);
        }
        return response.json();
      })
      .then(function (data) {
        var repo = mapRepoData(data);
        element.__repoData = repo;
        element.__repoLoadFailed = false;
        renderRepoCard(element, repo, options);
      })
      .catch(function (error) {
        element.__repoLoadFailed = true;
        renderRepoError(element, repoName);
        console.error(error);
      });
  }

  function rerenderCardsFromCache() {
    var elements = document.querySelectorAll("[github-repo]");
    Array.prototype.forEach.call(elements, function (element) {
      if (element.__repoData) {
        renderRepoCard(element, element.__repoData, element.__repoOptions || defaults);
        return;
      }

      if (element.__repoLoadFailed && element.__repoName) {
        renderRepoError(element, element.__repoName);
      }
    });
  }

  function initRepositoryCards() {
    var elements = document.querySelectorAll("[github-repo]");
    Array.prototype.forEach.call(elements, loadRepositoryCard);
  }

  document.addEventListener("site-language-change", rerenderCardsFromCache);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initRepositoryCards);
  } else {
    initRepositoryCards();
  }
})();
