(function () {
  var assetVersion = "20260403-1";
  var languagePicker = document.getElementById("languagePicker");
  var languageToggle = document.getElementById("languageToggle");
  var languageMenu = document.getElementById("languageMenu");
  if (!languagePicker || !languageToggle || !languageMenu) {
    return;
  }

  var languageButtons = Array.prototype.slice.call(languageMenu.querySelectorAll("[data-lang]"));

  var defaultLanguage = "pt-BR";
  var storageKey = "siteLanguage";
  var languageFolders = {
    "pt-BR": "PT-BR",
    en: "EN",
    es: "ES"
  };
  var sections = ["header", "about", "interests", "timeline", "highlights", "projects", "talks", "contact", "footer"];
  var currentMessages = {};

  window.SiteI18n = window.SiteI18n || {
    get: function (key, fallback) {
      return currentMessages[key] || fallback || "";
    }
  };

  function normalizeLanguage(language) {
    return languageFolders[language] ? language : defaultLanguage;
  }

  function parseTranslationFile(content) {
    var result = {};

    content.split(/\r?\n/).forEach(function (line) {
      var trimmed = line.trim();
      if (!trimmed || trimmed.charAt(0) === "#") {
        return;
      }

      var separatorIndex = trimmed.indexOf("=");
      if (separatorIndex <= 0) {
        return;
      }

      var key = trimmed.slice(0, separatorIndex).trim();
      var value = trimmed.slice(separatorIndex + 1).trim();
      if (key) {
        result[key] = value;
      }
    });

    return result;
  }

  function loadLanguage(language) {
    var folder = languageFolders[language] || languageFolders[defaultLanguage];

    var requests = sections.map(function (section) {
      return fetch("texts/" + folder + "/" + section + ".txt?v=" + assetVersion, { cache: "no-store" })
        .then(function (response) {
          if (!response.ok) {
            throw new Error("Unable to load section " + section);
          }
          return response.text();
        })
        .then(parseTranslationFile)
        .catch(function () {
          return {};
        });
    });

    return Promise.all(requests).then(function (parts) {
      return parts.reduce(function (accumulator, map) {
        Object.keys(map).forEach(function (key) {
          accumulator[key] = map[key];
        });
        return accumulator;
      }, {});
    });
  }

  function applyTranslations(messages) {
    document.querySelectorAll("[data-i18n]").forEach(function (element) {
      var key = element.getAttribute("data-i18n");
      if (messages[key]) {
        element.textContent = messages[key];
      }
    });

    document.querySelectorAll("[data-i18n-html]").forEach(function (element) {
      var key = element.getAttribute("data-i18n-html");
      if (messages[key]) {
        element.innerHTML = messages[key];
      }
    });

    document.querySelectorAll("[data-i18n-attr]").forEach(function (element) {
      var mappings = element.getAttribute("data-i18n-attr").split(";");
      mappings.forEach(function (mapping) {
        var parts = mapping.split(":");
        if (parts.length !== 2) {
          return;
        }

        var attribute = parts[0].trim();
        var key = parts[1].trim();

        if (attribute && key && messages[key]) {
          element.setAttribute(attribute, messages[key]);
        }
      });
    });
  }

  function applyLanguage(language) {
    var normalizedLanguage = normalizeLanguage(language);

    return loadLanguage(normalizedLanguage).then(function (messages) {
      currentMessages = messages;
      applyTranslations(messages);
      document.documentElement.setAttribute("lang", normalizedLanguage);
      localStorage.setItem(storageKey, normalizedLanguage);

      languageButtons.forEach(function (button) {
        var isActive = button.getAttribute("data-lang") === normalizedLanguage;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-pressed", isActive ? "true" : "false");
      });

      document.dispatchEvent(new CustomEvent("site-language-change", {
        detail: {
          language: normalizedLanguage,
          messages: messages
        }
      }));
    });
  }

  var savedLanguage = normalizeLanguage(localStorage.getItem(storageKey) || defaultLanguage);

  applyLanguage(savedLanguage);

  function closeMenu() {
    languagePicker.classList.remove("open");
    languageToggle.setAttribute("aria-expanded", "false");
  }

  function toggleMenu() {
    var isOpen = languagePicker.classList.toggle("open");
    languageToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  }

  languageToggle.addEventListener("click", function (event) {
    event.stopPropagation();
    toggleMenu();
  });

  languageButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      var language = this.getAttribute("data-lang");
      applyLanguage(language).then(closeMenu);
    });
  });

  document.addEventListener("click", function (event) {
    if (!languagePicker.contains(event.target)) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeMenu();
    }
  });
})();