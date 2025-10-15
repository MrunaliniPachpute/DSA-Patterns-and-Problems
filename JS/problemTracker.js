// JS/problemTracker.js
document.addEventListener('DOMContentLoaded', () => {
  const problemData = {
    title: document.title,
    url: window.location.pathname,
  };
  let recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
  recentlyViewed = recentlyViewed.filter(
    (problem) => problem.url !== problemData.url
  );
  recentlyViewed.unshift(problemData);

  const MAX_ITEMS = 3;
  if (recentlyViewed.length > MAX_ITEMS) {
    recentlyViewed = recentlyViewed.slice(0, MAX_ITEMS);
  }
  localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));

  // Mark problem as visited in the topic's progress tracker
  markProblemAsVisited();
});

function markProblemAsVisited() {
  // Extract topic and problem info from the breadcrumb and URL
  const breadcrumb = document.querySelector('.breadcrumb');
  if (!breadcrumb) {
    console.log('No breadcrumb found');
    return;
  }

  const breadcrumbItems = breadcrumb.querySelectorAll('.breadcrumb-item');
  console.log('Breadcrumb items found:', breadcrumbItems.length);
  
  if (breadcrumbItems.length < 3) {
    console.log('Not enough breadcrumb items (need at least 3: Home > Topic > Problem)');
    return;
  }

  // Get the topic link (second item in breadcrumb, index 1)
  const topicElement = breadcrumbItems[1].querySelector('a');
  if (!topicElement) {
    console.log('No topic link found in breadcrumb');
    return;
  }

  // Extract topic from the href URL
  const topicHref = topicElement.getAttribute('href');
  console.log('Topic href:', topicHref);
  
  const topicFromUrl = extractTopicFromUrl(topicHref);
  console.log('Extracted topic:', topicFromUrl);
  
  if (!topicFromUrl) {
    console.log('Could not extract topic from URL');
    return;
  }

  // Try to find the problem number from the data stored in the topic page
  // We'll use the problem URL to match it
  const currentUrl = window.location.pathname;
  console.log('Current URL:', currentUrl);
  
  const problemNumber = extractProblemNumberFromUrl(currentUrl, topicFromUrl);
  console.log('Problem number:', problemNumber);

  if (problemNumber) {
    // Get the checklist for this topic from localStorage
    let checklist = JSON.parse(localStorage.getItem(topicFromUrl));
    console.log('Current checklist:', checklist);
    
    if (checklist) {
      // Mark this problem as visited
      checklist[problemNumber] = true;
      localStorage.setItem(topicFromUrl, JSON.stringify(checklist));
      console.log('Updated checklist:', checklist);
      console.log('Problem marked as visited!');
    } else {
      console.log('No checklist found in localStorage for topic:', topicFromUrl);
    }
  } else {
    console.log('Could not determine problem number from URL');
  }
}

function extractTopicFromUrl(url) {
  // Map from URL patterns to data-topic values
  const urlToTopicMap = {
    'arrays.html': 'arrays',
    'binarySearch.html': 'binary-search',
    'LL.html': 'll',
    'dp.html': 'dp',
    'graph.html': 'graph',
    'binaryTrees.html': 'binaryTrees',
    'bst.html': 'bst',
    'String.html': 'string',
    'recursion.html': 'recursion',
    'stackAndQueue.html': 'stack-queue',
    'heap.html': 'heap',
    'greedyAlgo.html': 'greedy',
    'tries.html': 'tries',
    'sorting.html': 'sorting',
    'Backtracking.html': 'backtracking',
    'MathProblems.html': 'math',
    'DivideAndConquerProblems.html': 'divide-conquer'
  };

  for (const [urlPattern, topicName] of Object.entries(urlToTopicMap)) {
    if (url && url.includes(urlPattern)) {
      return topicName;
    }
  }
  
  return null;
}

function extractProblemNumberFromUrl(currentUrl, topicName) {
  // Map URLs to problem numbers for each topic
  const urlToNumberMap = {
    'arrays': {
      'twoSum.html': '01',
      'subarray.html': '02',
      'prodOfArray.html': '03',
      'ContainerWater.html': '04',
      'trappingRainwater.html': '05'
    },
    'binary-search': {
      'basicBinarySearch.html': '01',
      'firstAndLast.html': '02',
      'searchInsertPos.html': '03',
      'peakEl.html': '04',
      'sqrtOrBSOnAnswer.html': '05'
    },
    'll': {
      'ReverseLL.html': '01',
      'DetectCycle.html': '02',
      'MergeSortedLL.html': '03',
      'Palindrome.html': '04',
      'IntersectionLL.html': '05'
    },
    'dp': {
      'climbingStairs.html': '01',
      'houseRobber.html': '02',
      'longestIncreasingSubsequence.html': '03',
      'coinChange.html': '04',
      '0-1Knapsack.html': '05'
    },
    'graph': {
      'numberOfIslands.html': '01',
      'cloneGraph.html': '02',
      'courseSchedule.html': '03',
      'pacificAtlanticWaterFlow.html': '04',
      'cheapestFlightsKStops.html': '05'
    },
    'binaryTrees': {
      'treeTraversal.html': '01',
      'heightDiameter.html': '02',
      'lowestCommonAncestor.html': '03',
      'binaryTreePaths.html': '04',
      'serializeDeserialize.html': '05'
    },
    'bst': {
      'validateBST.html': '01',
      'insertSearchBST.html': '02',
      'kthSmallestLargest.html': '03',
      'lowestCommonAncestorBST.html': '04',
      'rangeSumBST.html': '05'
    },
    'string': {
      'reverseString.html': '01',
      'validAnagram.html': '02',
      'longestSubstring.html': '03',
      'palindromicSubstrings.html': '04',
      'groupAnagrams.html': '05'
    },
    'recursion': {
      'factorial.html': '01',
      'fibonacci.html': '02',
      'power.html': '03',
      'generateParentheses.html': '04',
      'towerOfHanoi.html': '05'
    },
    'stack-queue': {
      'validParentheses.html': '01',
      'minStack.html': '02',
      'dailyTemperatures.html': '03',
      'slidingWindowMaximum.html': '04',
      'queueUsingStacks.html': '05'
    },
    'heap': {
      'kthLargest.html': '01',
      'topKFrequent.html': '02',
      'mergeKSortedLists.html': '03',
      'medianFromStream.html': '04',
      'taskScheduler.html': '05'
    },
    'greedy': {
      'jumpGame.html': '01',
      'gasStation.html': '02',
      'meetingRooms.html': '03',
      'partitionLabels.html': '04',
      'nonOverlappingIntervals.html': '05'
    },
    'tries': {
      'implementTrie.html': '01',
      'wordSearchII.html': '02',
      'addSearchWords.html': '03',
      'longestWord.html': '04',
      'replaceWords.html': '05'
    },
    'sorting': {
      'bubbleSort.html': '01',
      'selectionSort.html': '02',
      'insertionSort.html': '03',
      'mergeSort.html': '04',
      'quickSort.html': '05'
    },
    'backtracking': {
      'subsets.html': '01',
      'combinationSum.html': '02',
      'permutations.html': '03',
      'nQueens.html': '04',
      'sudokuSolver.html': '05'
    },
    'math': {
      'powerOfTwo.html': '01',
      'fizzBuzz.html': '02',
      'happyNumber.html': '03',
      'largestPerimeterTriangle.html': '04',
      'countGoodNumbers.html': '05'
    },
    'divide-conquer': {
      'ClosestPairofPoints.html': '01',
      'Kthlargestelement.html': '02',
      'MaximumSubArray.html': '03',
      'CountInversions.html': '04',
      'Medianof2SortedLists.html': '05'
    }
  };

  const topicMap = urlToNumberMap[topicName];
  if (!topicMap) {
    console.log('No URL mapping found for topic:', topicName);
    return null;
  }

  // Check which problem HTML file is in the current URL
  for (const [filename, number] of Object.entries(topicMap)) {
    if (currentUrl.includes(filename)) {
      console.log(`Matched filename ${filename} to problem number ${number}`);
      return number;
    }
  }

  console.log('No matching filename found in URL');
  return null;
}

const toggleBtn = document.getElementById('toggleBtn');
const flowchart = document.getElementById('flowchart');

if (toggleBtn && flowchart) {
  toggleBtn.addEventListener('click', () => {
    flowchart.classList.toggle('active');
    toggleBtn.textContent = flowchart.classList.contains('active')
      ? 'Hide Flowchart ▼'
      : 'Show Flowchart ▲';
  });
}