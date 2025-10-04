const topics = document.getElementById("topics");
const topicName = topics.dataset.topic;
const listOfTopics = topics.querySelectorAll("li");
const checklist = JSON.parse(localStorage.getItem(topicName)) || createNewChecklist();
const progressBar = document.getElementById("topic-progress-bar");
const progress = document.getElementById("topic-progress");
const progressText = document.getElementById("topic-progress-text");

function createNewChecklist() {
  console.log("New checklist created")
  const cl = {};
  listOfTopics.forEach(item => {
    const unitNum = item.getElementsByClassName("topic-number")[0].textContent;
    cl[unitNum] = false;
  })
  localStorage.setItem(topicName, JSON.stringify(cl));
  return cl;
}

var totalTopics = 0;
var visitedTopics = 0;
function setProgressBar(visited, total) {
  const width = total ? (visited / total) * 100 : 0;
  progress.style.setProperty(`width`, `${width}%`);
  progressText.textContent = `Progress: ${visited} / ${total} Topics`;
}


listOfTopics.forEach(item => {
  const unitNum = item.getElementsByClassName("topic-number")[0].textContent;
  const completed = checklist[unitNum];
  totalTopics++;
  if (completed) { visitedTopics++; }
  item.getElementsByClassName("topic-completed")[0].textContent = completed ? "\u2713" : "\u00A0";
  item.addEventListener('click', visit);
});
setProgressBar(visitedTopics, totalTopics);

function visit(e) {
  const unitNum = e.currentTarget.getElementsByClassName("topic-number")[0].textContent;
  if (!checklist[unitNum]) { 
    visitedTopics++; 
    setProgressBar(visitedTopics, totalTopics);
  }
  checklist[unitNum] = true;
  e.currentTarget.getElementsByClassName("topic-completed")[0].textContent = "\u2713";
  localStorage.setItem(topicName, JSON.stringify(checklist));
  window.location.href = this.dataset.href;
}

