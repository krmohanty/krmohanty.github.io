// --- Site footer year ---
document.getElementById("year").textContent = new Date().getFullYear();

// --- Events list (unchanged) ---
async function loadEvents() {
  try {
    const res = await fetch("events.json", { cache: "no-store" });
    const events = await res.json();
    const ul = document.getElementById("eventsList");
    ul.innerHTML = "";
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

// --- Formspree email sending (no mail app) ---
// 1) Create a free form at https://formspree.io/ to get an endpoint like:
//    https://formspree.io/f/xxxxabcd
// 2) Paste it below:
const FORMSPREE_ENDPOINT = "https://formspree.io/f/mjkeyedr";

const form = document.getElementById("mailForm");
const sendBtn = form.querySelector("button[type=submit]");

// Add a small status message area under the button
const statusEl = document.createElement("p");
statusEl.id = "statusMsg";
statusEl.className = "hint";
statusEl.style.marginTop = "8px";
form.appendChild(statusEl);

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Basic validation via required attributes already in HTML
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  if (!FORMSPREE_ENDPOINT || FORMSPREE_ENDPOINT.includes("REPLACE_WITH_YOUR_ID")) {
    statusEl.textContent =
      "Set your Formspree endpoint in script.js (FORMSPREE_ENDPOINT).";
    statusEl.style.color = "#ff6fa9";
    return;
  }

  // UI: show sending
  const originalText = sendBtn.textContent;
  sendBtn.textContent = "Sending…";
  sendBtn.disabled = true;
  statusEl.textContent = "";
  statusEl.style.color = "";

  try {
    const resp = await fetch(FORMSPREE_ENDPOINT, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, message }),
    });

    if (resp.ok) {
      // Success
      statusEl.textContent = "Thanks! Your message was sent ✅";
      statusEl.style.color = "#9be09b";
      form.reset();
    } else {
      // Attempt to read error details
      let info = "";
      try {
        const data = await resp.json();
        if (data && data.errors && Array.isArray(data.errors)) {
          info = " " + data.errors.map(e => e.message).join(" ");
        }
      } catch {}
      statusEl.textContent =
        "Sorry, your message could not be sent. Please try again." + info;
      statusEl.style.color = "#ff6fa9";
    }
  } catch (err) {
    console.error(err);
    statusEl.textContent =
      "Network error while sending. Please check your connection and try again.";
    statusEl.style.color = "#ff6fa9";
  } finally {
    sendBtn.textContent = originalText;
    sendBtn.disabled = false;
  }
});
