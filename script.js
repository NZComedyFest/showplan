// Build HTML output
let output = "";

// Loop through weeks
for (let week in weeks) {
  output += `<div class="week-header">Week ${week}</div>`;
  
  let days = {};
  weeks[week].forEach(show => {
    let dayStr = show.date;
    if (!days[dayStr]) days[dayStr] = [];
    days[dayStr].push(show);
  });

  for (let day in days) {
    output += `<div class="day-header">${day}</div>`;
    let dayShows = days[day];

    dayShows.forEach(show => {
      // Detect conflicts
      let conflict = false;
      for (let other of dayShows) {
        if (show === other) continue;
        if (show.start < other.end && other.start < show.end) conflict = true;
      }

      output += `<div class="show-card${conflict ? " conflict" : ""}">
        <div class="show-info">
          <b>${show.title}</b>
        </div>
        ${conflict ? "⚠️ Conflict" : ""}
      </div>`;
    });
  }
}

document.getElementById("schedule").innerHTML = output;
