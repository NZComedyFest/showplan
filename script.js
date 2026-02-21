// Get the container to display the schedule
const list = document.getElementById("showList");

// 1️⃣ Create checkboxes for all shows
shows.forEach(show => {
  list.innerHTML += `
    <label class="show-option">
      <input type="checkbox" value="${show.id}">
      <b>${show.title}</b><br>
      ${show.date} ${show.time}<br>
      ${show.venue}
    </label>
  `;
});

// 2️⃣ Function to build the itinerary
function buildPlan() {
  // Get all selected show IDs
  let picked = [...document.querySelectorAll("input:checked")].map(x => Number(x.value));

  // Filter shows the user selected
  let chosen = shows.filter(s => picked.includes(s.id));

  // Convert each show to a Date object for sorting and conflict detection
  chosen.forEach(s => {
    s.start = new Date(s.date + "T" + s.time);
    // Assume each show lasts 1.5 hours (5400000 ms)
    s.end = new Date(s.start.getTime() + 1.5 * 60 * 60 * 1000);
  });

  // Sort shows chronologically
  chosen.sort((a, b) => a.start - b.start);

  // Determine festival start date (earliest show)
  const festivalStart = new Date(Math.min(...chosen.map(s => s.start)));

  // Group shows by week
  let weeks = {}; // {1: [...], 2: [...], ...}
  chosen.forEach(show => {
    let weekNum = Math.floor((show.start - festivalStart) / (7 * 24 * 60 * 60 * 1000)) + 1;
    if (!weeks[weekNum]) weeks[weekNum] = [];
    weeks[weekNum].push(show);
  });

  // Build HTML output
  let output = "";

  for (let week in weeks) {
    output += `<h2>Week ${week}</h2>`;

    // Group shows in this week by day
    let days = {};
    weeks[week].forEach(show => {
      let dayStr = show.date;
      if (!days[dayStr]) days[dayStr] = [];
      days[dayStr].push(show);
    });

    // Loop through days
    for (let day in days) {
      output += `<h3>${day}</h3>`;
      let dayShows = days[day];

      // Check for conflicts within the day
      for (let i = 0; i < dayShows.length; i++) {
        let show = dayShows[i];
        let conflict = false;
        for (let j = 0; j < dayShows.length; j++) {
          if (i === j) continue;
          if (show.start < dayShows[j].end && dayShows[j].start < show.end) {
            conflict = true;
            break;
          }
        }

        output += `<div class="show-card${conflict ? " conflict" : ""}">
          ${show.time} — <b>${show.title}</b> (${show.venue})
          ${conflict ? "⚠️ Conflict with another show" : ""}
        </div>`;
      }
    }
  }

  document.getElementById("schedule").innerHTML = output;
}
