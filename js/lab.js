(function () {
  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function iconClass(platform) {
    if (platform === "email") return "fa fa-envelope";
    if (platform === "scholar") return "fa fa-graduation-cap";
    if (platform === "github") return "fa-brands fa-github";
    if (platform === "homepage") return "fa fa-home";
    return "fa fa-link";
  }

  function createMemberCard(member) {
    var links = Object.keys(member.links || {})
      .map(function (platform) {
        var href = member.links[platform];
        var target = href.indexOf("mailto:") === 0 || href === "index.html" ? "" : ' target="_blank"';
        return (
          '<a class="member-link" href="' + href + '"' + target + ">" +
          '<i class="' + iconClass(platform) + '"></i> ' + escapeHtml(platform) +
          "</a>"
        );
      })
      .join("");

    return (
      '<article class="member-card">' +
      '  <h4 class="member-name">' + escapeHtml(member.name || "") + "</h4>" +
      '  <p class="member-title">' + escapeHtml(member.title || "") + "</p>" +
      (member.bio ? '  <p class="member-bio">' + escapeHtml(member.bio) + "</p>" : "") +
      '  <div class="member-links">' + links + "</div>" +
      "</article>"
    );
  }

  function renderMemberSection(containerId, members, emptyText) {
    var container = document.getElementById(containerId);
    if (!container) return;

    if (!members || !members.length) {
      container.innerHTML = '<p class="empty-text">' + escapeHtml(emptyText) + "</p>";
      return;
    }
    container.innerHTML = members.map(createMemberCard).join("");
  }

  function renderOpenings(openings) {
    var positions = document.getElementById("openings-positions");
    var topics = document.getElementById("openings-topics");
    var contact = document.getElementById("openings-contact");
    var intro = document.getElementById("openings-intro");

    if (intro) intro.textContent = openings.intro || "";

    if (positions) {
      positions.innerHTML = (openings.positions || [])
        .map(function (item) {
          return (
            "<li><b>" + escapeHtml(item.name) + "</b> (" + escapeHtml(item.term) + "): " +
            escapeHtml(item.details) + "</li>"
          );
        })
        .join("");
    }

    if (topics) {
      topics.innerHTML = (openings.research_topics || [])
        .map(function (topic) { return "<li>" + escapeHtml(topic) + "</li>"; })
        .join("");
    }

    if (contact) {
      var materials = (openings.contact && openings.contact.materials ? openings.contact.materials : [])
        .map(function (m) { return "<li>" + escapeHtml(m) + "</li>"; })
        .join("");
      var email = openings.contact && openings.contact.email ? openings.contact.email : "";
      var subject = openings.contact && openings.contact.subject_format ? openings.contact.subject_format : "";
      contact.innerHTML =
        "<p><b>Email:</b> <a href=\"mailto:" + escapeHtml(email) + "\">" + escapeHtml(email) + "</a></p>" +
        "<p><b>Email subject format:</b> " + escapeHtml(subject) + "</p>" +
        "<p><b>Suggested materials:</b></p>" +
        "<ul>" + materials + "</ul>";
    }
  }

  async function initLabPage() {
    var root = document.getElementById("lab-page-root");
    if (!root) return;

    try {
      var response = await fetch("data/lab.json");
      if (!response.ok) throw new Error("Failed to load lab data.");
      var data = await response.json();

      renderOpenings(data.openings || {});
      renderMemberSection("lead-members", data.members && data.members.lead, "No lead member listed yet.");
      renderMemberSection("phd-members", data.members && data.members.phd_students, "Recruiting PhD students.");
      renderMemberSection("master-members", data.members && data.members.master_students, "Recruiting Master students.");
      renderMemberSection("visiting-members", data.members && data.members.visiting_students, "Recruiting visiting students.");
      renderMemberSection("alumni-members", data.members && data.members.alumni, "No alumni listed yet.");
    } catch (error) {
      console.error(error);
      root.innerHTML = "<p>Failed to load Lab page content. Please check data/lab.json.</p>";
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initLabPage);
  } else {
    initLabPage();
  }
})();
