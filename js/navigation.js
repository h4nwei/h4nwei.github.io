(function () {
  var items = [
    { id: "home", href: "index.html", label: "About" },
    { id: "publications", href: "publications.html", label: "Publications" }
  ];

  function createNav(pageId) {
    var links = items
      .map(function (item) {
        var active = item.id === pageId ? ' class="active"' : "";
        var current = item.id === pageId ? ' aria-current="page"' : "";
        return '<a href="' + item.href + '"' + active + current + ">" + item.label + "</a>";
      })
      .join("");

    return (
      '<header class="site-header">' +
      '  <div class="site-header-inner">' +
      '    <a class="site-title" href="index.html">Hanwei Zhu</a>' +
      '    <nav class="site-nav">' +
      links +
      "    </nav>" +
      "  </div>" +
      "</header>"
    );
  }

  function initNavigation() {
    var pageId = document.body.getAttribute("data-page") || "home";
    var mountNode = document.getElementById("site-nav-placeholder");
    if (!mountNode) return;
    mountNode.innerHTML = createNav(pageId);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initNavigation);
  } else {
    initNavigation();
  }
})();
