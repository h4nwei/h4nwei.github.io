(function () {
  function getDestination(paper) {
    if ("journal" in paper) return "journal";
    if ("conference" in paper) return "conference";
    return "preprint";
  }

  function authorHtml(authors, authorLinks, fullName) {
    var updated = authors;
    Object.keys(authorLinks || {}).forEach(function (name) {
      updated = updated.replace(name, '<a href="' + authorLinks[name] + '" target="_blank">' + name + "</a>");
    });
    return updated.replace(fullName, "<b>" + fullName + "</b>");
  }

  function buildExtraLinks(paper, fields) {
    var links = "";
    Object.keys(fields || {}).forEach(function (field) {
      if (paper[field]) {
        links += '<li class="list-inline-item"><a href="' + paper[field] + '" target="_blank">[' + fields[field] + "]</a></li>";
      }
    });
    return links;
  }

  function buildFullItem(paper, fields, authorLinks, fullName) {
    var dest = getDestination(paper);
    var itemClass = paper.highlight ? "full-list-itemhl" : "full-list-item";
    return (
      '<li class="' +
      itemClass +
      '">"' +
      paper.title +
      '." <em>' +
      authorHtml(paper.authors, authorLinks, fullName) +
      ".</em> " +
      paper[dest] +
      ", " +
      paper.year +
      ". " +
      (paper.impact_factor ? "(IF = " + paper.impact_factor + ")" : "") +
      " " +
      (paper.note || "") +
      ' <ul class="full-list">' +
      buildExtraLinks(paper, fields) +
      "</ul></li>"
    );
  }

  function sortByYearDescending(papers) {
    return papers.slice().sort(function (a, b) {
      return Number(b.year || 0) - Number(a.year || 0);
    });
  }

  function groupByYear(papers) {
    var grouped = {};
    papers.forEach(function (paper) {
      var year = String(paper.year || "Unknown");
      if (!grouped[year]) grouped[year] = [];
      grouped[year].push(paper);
    });
    return grouped;
  }

  function renderFull(publications, fields, authorLinks, fullName, filter) {
    var container = document.getElementById("publications-container");
    if (!container) return;

    var filtered = sortByYearDescending(publications).filter(function (paper) {
      return filter === "all" ? true : getDestination(paper) === filter;
    });

    if (!filtered.length) {
      container.innerHTML = '<p class="empty-text">No publications found for this filter.</p>';
      return;
    }

    var grouped = groupByYear(filtered);
    var years = Object.keys(grouped).sort(function (a, b) {
      return Number(b) - Number(a);
    });

    container.innerHTML = years
      .map(function (year) {
        var items = grouped[year]
          .map(function (paper) {
            return buildFullItem(paper, fields, authorLinks, fullName);
          })
          .join("");
        return (
          '<section class="pub-year-group">' +
          '  <h3 class="pub-year-title">' + year + "</h3>" +
          '  <ol class="pub-year-list">' + items + "</ol>" +
          "</section>"
        );
      })
      .join("");
  }

  function setupFullPageFilter(publications, fields, authorLinks, fullName) {
    var buttons = document.querySelectorAll(".pub-filter-btn");
    if (!buttons.length) return;

    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        var filter = button.getAttribute("data-filter");
        buttons.forEach(function (b) {
          b.classList.remove("active");
        });
        button.classList.add("active");
        renderFull(publications, fields, authorLinks, fullName, filter);
      });
    });
  }

  function initPublications() {
    if (!window.data || !data.publications) return;
    var fullName = "Hanwei Zhu";
    var page = document.body.getAttribute("data-page");

    if (page === "publications") {
      renderFull(data.publications, data.fields, data.author_links, fullName, "all");
      setupFullPageFilter(data.publications, data.fields, data.author_links, fullName);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initPublications);
  } else {
    initPublications();
  }
})();
