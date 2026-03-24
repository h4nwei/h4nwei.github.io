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

  function renderSelected(publications, fields, authorLinks, fullName) {
    ["preprint", "conference", "journal"].forEach(function (kind) {
      var list = document.querySelector("#selected-publication ul." + kind);
      if (list) list.innerHTML = "";
    });

    publications.forEach(function (paper) {
      if (!paper.highlight) return;
      var dest = getDestination(paper);
      var target = document.querySelector("#selected-publication ul." + dest);
      if (!target) return;

      var yearText = paper.oral ? paper.year + " (<b style='color:red;'>" + paper.oral + "</b>)" : String(paper.year);

      var row =
        "<li>" +
        '  <div class="hflex-container" id="paper">' +
        "    <table>" +
        "      <tr>" +
        '        <td rowspan="4" class="imgtd"><img src="' + (paper.img || "") + '"></td>' +
        '        <td><p class="title">' + paper.title + "</p></td>" +
        "      </tr>" +
        "      <tr><td>" + authorHtml(paper.authors, authorLinks, fullName) + "</td></tr>" +
        "      <tr><td><p class=\"venue\">" + paper[dest] + ", " + yearText + "</p></td></tr>" +
        "      <tr><td>" +
        (paper.pdf ? '<a href="' + paper.pdf + '" target="_blank">[PDF]</a>' : "") +
        (paper.arxiv ? '<a href="' + paper.arxiv + '" target="_blank"><img class="imgbadge arxivbadge"></a>' : "") +
        (paper.github ? '<a href="' + paper.github + '" target="_blank"><img class="imgbadge" src="https://img.shields.io/github/stars/' + paper.github.split("/").slice(-2).join("/") + '?style=social"></a>' : "") +
        (paper.project ? '<a href="' + paper.project + '" target="_blank"><img class="prjbadge" src="https://img.shields.io/badge/Project-' + paper.project.split("/").slice(-2).join("") + '-e9f1f6?style=flat-square"></a>' : "") +
        "      </td></tr>" +
        "    </table>" +
        "  </div>" +
        "</li>";
      target.insertAdjacentHTML("beforeend", row);
    });
  }

  function renderFull(publications, fields, authorLinks, fullName) {
    ["preprint", "conference", "journal"].forEach(function (kind) {
      var list = document.querySelector("#full-publication ol." + kind);
      if (list) list.innerHTML = "";
    });

    publications.forEach(function (paper) {
      var dest = getDestination(paper);
      var target = document.querySelector("#full-publication ol." + dest);
      if (!target) return;

      var itemClass = paper.highlight ? "full-list-itemhl" : "full-list-item";
      var row =
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
        "</ul></li>";

      target.insertAdjacentHTML("beforeend", row);
    });
  }

  function setupFullPageFilter() {
    var buttons = document.querySelectorAll(".pub-filter-btn");
    if (!buttons.length) return;

    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        var filter = button.getAttribute("data-filter");
        buttons.forEach(function (b) {
          b.classList.remove("active");
        });
        button.classList.add("active");

        ["preprint", "conference", "journal"].forEach(function (kind) {
          var section = document.getElementById("section-" + kind);
          if (!section) return;
          section.style.display = filter === "all" || filter === kind ? "block" : "none";
        });
      });
    });
  }

  function initPublications() {
    if (!window.data || !data.publications) return;
    var fullName = "Hanwei Zhu";
    var page = document.body.getAttribute("data-page");

    if (page === "home") {
      renderSelected(data.publications, data.fields, data.author_links, fullName);
    }

    if (page === "publications") {
      renderFull(data.publications, data.fields, data.author_links, fullName);
      setupFullPageFilter();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initPublications);
  } else {
    initPublications();
  }
})();
