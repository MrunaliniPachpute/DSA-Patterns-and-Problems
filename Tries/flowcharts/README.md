# Flowcharts for Tries Problems

This folder contains flowcharts for all 5 problems in the Tries topic. The flowcharts are implemented using Mermaid diagrams directly in the HTML files.

## Implementation Details

- **Technology**: Mermaid.js for interactive flowcharts
- **Integration**: Flowcharts are embedded directly in each problem's HTML page
- **Functionality**: Each page has a "View Flowchart" button that toggles the flowchart visibility
- **Styling**: Uses existing CSS classes for consistent styling

## Problems with Flowcharts

1. **Insert & Search in Trie** (`insertSearchTrie.html`)
   - Shows both insert and search operations
   - Visualizes the trie node creation and traversal process
   - Demonstrates the end-of-word flag handling

2. **Autocomplete / Suggestions** (`autocomplete.html`)
   - Covers the DFS traversal from prefix node
   - Shows how to collect all words with a given prefix
   - Visualizes the recursive word building process

3. **Longest Common Prefix** (`longestCommonPrefix.html`)
   - Implements trie path traversal algorithm
   - Shows the condition for finding common prefix
   - Visualizes the single-child path traversal

4. **Prefix Count / StartsWith** (`prefixCount.html`)
   - Covers simple prefix existence checking
   - Shows the trie traversal for prefix validation
   - Demonstrates early termination when prefix doesn't exist

5. **Word Search in Grid** (`wordSearch.html`)
   - Implements trie + DFS backtracking algorithm
   - Shows the grid traversal and visited cell management
   - Visualizes the recursive exploration of all directions

## Features

- ✅ Interactive toggle button
- ✅ Clear, readable flowcharts
- ✅ Consistent styling with existing design
- ✅ Responsive design
- ✅ No external dependencies (uses CDN for Mermaid)
- ✅ Beginner-friendly visual explanations

## Usage

1. Navigate to any problem page in the Tries topic
2. Scroll to the bottom of the page
3. Click the "View Flowchart" button
4. The flowchart will appear below the problem content
5. Click "Hide Flowchart" to collapse it

## Algorithm Coverage

### Insert & Search in Trie
- **Insert**: Character-by-character traversal, node creation, end-of-word marking
- **Search**: Path validation, end-of-word checking

### Autocomplete
- **DFS Traversal**: Recursive exploration from prefix node
- **Word Collection**: Building complete words from trie paths

### Longest Common Prefix
- **Path Traversal**: Single-child path following
- **Termination**: Multiple children or end-of-word detection

### Prefix Count / StartsWith
- **Simple Traversal**: Character-by-character path validation
- **Early Exit**: Return false if path doesn't exist

### Word Search in Grid
- **Trie Integration**: Using trie for efficient word matching
- **DFS Backtracking**: Grid exploration with visited tracking
- **Multi-directional**: Up, down, left, right movement

The flowcharts help learners understand the trie data structure operations visually alongside the pseudo-code, making the repository more interactive and beginner-friendly.
