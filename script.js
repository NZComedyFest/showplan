const list =
document.getElementById("showList");

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

function buildPlan(){

let picked =
[...document.querySelectorAll("input:checked")]
.map(x=>Number(x.value));

let chosen =
shows.filter(s=>picked.includes(s.id));

chosen.sort((a,b)=>
new Date(a.date+" "+a.time)
-
new Date(b.date+" "+b.time)
);

let output="<h2>My Festival Plan</h2>";

chosen.forEach(show=>{
output+=`
<div class="show-card">
<b>${show.time}</b><br>
${show.title}<br>
${show.venue}<br>
${show.date}
</div>`;
});

document.getElementById("schedule")
.innerHTML=output;
}
