// Render year
document.getElementById("year").textContent = new Date().getFullYear();

// Handle "email send" with mailto (works on static hosting)
const form = document.getElementById("mailForm");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  const subject = encodeURIComponent(`Message for Ashlynn from ${name}`);
  const body = encodeURIComponent(`From: ${name} <${email}>\n\n${message}`);

  window.location.href = `mailto:ashlynnmohanty@gmail.com?subject=${subject}&body=${body}`;
});

// Load events from events.json (edit that file to update list)
async function loadEvents() {
  try {
    const res = await fetch("events.json", { cache: "no-store" });
    const events = await res.json();

    const ul = document.getElementById("eventsList");
    ul.innerHTML = "";

    // sort by date ascending, but tolerate free text dates
    events.sort((a, b) => new Date(a.when) - new Date(b.when));

    for (const ev of events) {
      const li = document.createElement("li");
      const date = document.createElement("span");
      date.className = "date";
      date.textContent = ev.when || "";
      const txt = document.createElement("span");
      txt.textContent = ev.text || "";
      li.appendChild(date);
      li.appendChild(txt);
      ul.appendChild(li);
    }
  } catch (err) {
    console.error("Failed to load events.json", err);
    document.getElementById("eventsList").innerHTML =
      "<li>Couldn’t load events yet. Try refreshing.</li>";
  }
}
loadEvents();
