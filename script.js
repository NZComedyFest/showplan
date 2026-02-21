// Get the container to display shows
const list = document.getElementById("showList");

// 1️⃣ Create checkboxes for all shows
shows.forEach(show => {
  list.innerHTML += `
    <label class="show-option">
      <input type="checkbox" value="${show.id}">
      <b>${show.title}</b>
    </label>
  `;
});

// 2️⃣ Build itinerary
function buildPlan() {
  // Get selected show IDs
  let picked = [...document.querySelectorAll("input:checked")].map(x => Number(x.value));

  // Filter selected shows
  let chosen = shows.filter(s => picked.includes(s.id));

  // Convert to Date objects and calculate end times
  chosen.forEach(s => {
    s.start = new Date(s.date + "T" + s.time);
    s.end = new Date(s.start.getTime() + (s.duration || 1.5) * 60 * 60 * 1000);
  });

  // Sort chronologically
  chosen.sort((a,b) => a.start - b.start);

  // Group by week
  const festivalStart = new Date(Math.min(...chosen.map(s => s.start)));
  let weeks = {};
  chosen.forEach(show => {
    let weekNum = Math.floor((show.start - festivalStart)/(7*24*60*60*1000)) + 1;
    if(!weeks[weekNum]) weeks[weekNum] = [];
    weeks[weekNum].push(show);
  });

  // Build HTML output
  let output = "";

  for(let week in weeks){
    output += `<div class="week-header">Week ${week}</div>`;
    
    // Group by day
    let days = {};
    weeks[week].forEach(show => {
      if(!days[show.date]) days[show.date] = [];
      days[show.date].push(show);
    });

    for(let day in days){
      output += `<div class="day-header">${day}</div>`;
      days[day].forEach(show => {
        let conflict = days[day].some(other => show !== other && show.start < other.end && other.start < show.end);
        output += `<div class="show-card${conflict ? " conflict" : ""}" title="${show.time} — ${show.venue}">
          <div class="show-info"><b>${show.title}</b></div>
          ${conflict ? "⚠️ Conflict" : ""}
        </div>`;
      });
    }
  }

  document.getElementById("schedule").innerHTML = output;
}
