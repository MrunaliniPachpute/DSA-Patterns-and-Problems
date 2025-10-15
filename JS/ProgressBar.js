const topics = document.getElementById("topics");
const topicName = topics.dataset.topic;
const listOfTopics = topics.querySelectorAll("li");
const checklist = JSON.parse(localStorage.getItem(topicName)) || createNewChecklist();
const progressBar = document.getElementById("topic-progress-bar");
const progress = document.getElementById("topic-progress");
const progressText = document.getElementById("topic-progress-text");

console.log('ProgressBar.js loaded');
console.log('Topic name:', topicName);
console.log('Number of topics:', listOfTopics.length);
console.log('Checklist from localStorage:', checklist);

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
  console.log(`Progress updated: ${visited} / ${total} (${width.toFixed(1)}%)`);
}

// Calculate and display progress based on localStorage
listOfTopics.forEach(item => {
  const unitNum = item.getElementsByClassName("topic-number")[0].textContent;
  const completed = checklist[unitNum];
  totalTopics++;
  if (completed) { visitedTopics++; }
  item.getElementsByClassName("topic-completed")[0].textContent = completed ? "\u2713" : "\u00A0";
  console.log(`Topic ${unitNum}: ${completed ? 'completed' : 'not completed'}`);
});
setProgressBar(visitedTopics, totalTopics);

