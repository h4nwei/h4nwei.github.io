(function () {
  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function createNewsItem(item) {
    var date = item.date ? "[" + escapeHtml(item.date) + "]" : "";
    var content = item.content_html || escapeHtml(item.content || "");
    return "<li>" + date + (date ? ": " : "") + content + "</li>";
  }

  async function loadNews() {
    var list = document.getElementById("news-list");
    if (!list) return;

    list.setAttribute("aria-busy", "true");
    try {
      var response = await fetch("data/news.json");
      if (!response.ok) throw new Error("Failed to load news");

      var payload = await response.json();
      var items = Array.isArray(payload.news) ? payload.news : [];
      list.innerHTML = items.map(createNewsItem).join("");
    } catch (error) {
      console.error(error);
      list.innerHTML = "<li>Failed to load news.</li>";
    } finally {
      list.setAttribute("aria-busy", "false");
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadNews);
  } else {
    loadNews();
  }
})();
