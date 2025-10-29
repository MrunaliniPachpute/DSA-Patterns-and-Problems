// recursionVisualizerNQueens.js
(() => {
  // element refs
  const stackContainer = document.getElementById('nqStackContainer');
  const boardContainer = document.getElementById('nqBoardContainer');
  const solutionsEl = document.getElementById('nqSolutions');
  const runBtn = document.getElementById('nqRunBtn');
  const cancelBtn = document.getElementById('nqCancelBtn');
  const inputN = document.getElementById('nqN');
  const speedSelect = document.getElementById('nqSpeed');

  if (!stackContainer || !boardContainer || !runBtn || !inputN) {
    console.error('N-Queens visualizer: required elements missing.');
    return;
  }

  // safety cap
  if (!inputN.max) inputN.max = '8';

  let cancelled = false;
  let boardEl = null;
  let N = 4;
  let cols, diag1, diag2, board; // sets & board state
  let solutionCount = 0;
  function sleep(ms){ return new Promise(resolve => setTimeout(resolve, ms)); }

  // create board DOM (NxN)
  function buildBoard(n) {
    N = n;
    boardContainer.innerHTML = ''; // clear
    boardEl = document.createElement('div');
    boardEl.className = 'nq-board';
    // set CSS grid
    boardEl.style.gridTemplateColumns = `repeat(${n}, 40px)`;
    boardEl.style.gridTemplateRows = `repeat(${n}, 40px)`;

    for (let r = 0; r < n; r++){
      for (let c = 0; c < n; c++){
        const cell = document.createElement('div');
        cell.className = 'nq-cell ' + (((r+c) % 2 === 0) ? '' : 'dark');
        cell.dataset.r = r;
        cell.dataset.c = c;
        cell.textContent = ''; // 'Q' added later
        boardEl.appendChild(cell);
      }
    }
    boardContainer.appendChild(boardEl);
  }

  function resetState(n) {
    cols = new Set();
    diag1 = new Set(); // r+c
    diag2 = new Set(); // r-c
    board = Array.from({length:n}, () => Array(n).fill('.'));
    solutionCount = 0;
    solutionsEl.textContent = '';
  }

  function setQueen(row, col) {
    board[row][col] = 'Q';
    // update DOM cell
    const idx = row * N + col;
    const cell = boardEl.children[idx];
    cell.classList.add('queen');
    cell.textContent = '♛';
  }

  function removeQueen(row, col) {
    board[row][col] = '.';
    const idx = row * N + col;
    const cell = boardEl.children[idx];
    cell.classList.remove('queen', 'highlight');
    cell.textContent = '';
  }

  function highlightCell(row, col) {
    const idx = row * N + col;
    const cell = boardEl.children[idx];
    cell.classList.add('highlight');
  }
  function unhighlightCell(row, col) {
    const idx = row * N + col;
    const cell = boardEl.children[idx];
    cell.classList.remove('highlight');
  }

  function pushFrame(label) {
    const div = document.createElement('div');
    div.className = 'stack-frame';
    div.textContent = label;
    stackContainer.appendChild(div);
    stackContainer.scrollTop = stackContainer.scrollHeight;
  }

  function popFrame() {
    stackContainer.lastChild?.remove();
  }

  function recordSolution() {
    solutionCount++;
    const snapshot = board.map(row => row.join('')).join('\n');
    solutionsEl.textContent += `Solution ${solutionCount}:\n${snapshot}\n\n`;
    // keep latest visible
    solutionsEl.scrollTop = solutionsEl.scrollHeight;
  }

  function safeN() {
    const n = parseInt(inputN.value);
    if (Number.isNaN(n)) return null;
    if (n < 1) return null;
    const max = parseInt(inputN.max) || 8;
    return Math.min(n, max);
  }

  // main backtracking with visual updates using sets
  async function solveRow(row) {
    if (cancelled) throw new Error('cancelled');
    pushFrame(`solve(${row})`);
    const delay = parseInt(speedSelect.value) || 350;
    await sleep(Math.max(40, delay/2)); // brief pause when entering frame

    if (row === N) {
      // found a solution
      recordSolution();
      await sleep(delay);
      popFrame();
      return;
    }

    for (let col = 0; col < N; col++) {
      if (cancelled) throw new Error('cancelled');

      // check safe
      if (cols.has(col) || diag1.has(row+col) || diag2.has(row-col)) {
        // optionally highlight why unsafe (skip)
        continue;
      }

      // place
      cols.add(col); diag1.add(row+col); diag2.add(row-col);
      setQueen(row, col);
      highlightCell(row, col);
      await sleep(delay);

      // recurse
      await solveRow(row + 1);
      if (cancelled) throw new Error('cancelled');

      // backtrack: remove
      removeQueen(row, col);
      cols.delete(col); diag1.delete(row+col); diag2.delete(row-col);
      await sleep(Math.max(40, delay/2));

      // remove highlight (if still there)
      unhighlightCell(row, col);
      // continue to next col
    }

    // done with this row
    popFrame();
    await sleep(Math.max(20, delay/6));
  }

  // wire up Run button
  runBtn.addEventListener('click', async () => {
    const n = safeN();
    if (n === null) {
      alert('Please enter a valid board size (1–8).');
      return;
    }

    // prepare
    runBtn.disabled = true;
    cancelBtn.disabled = false;
    cancelled = false;
    stackContainer.innerHTML = '';
    solutionsEl.textContent = '';
    buildBoard(n);
    resetState(n);

    try {
      await solveRow(0);
      if (!cancelled) {
        solutionsEl.textContent += `Finished. Solutions found: ${solutionCount}\n`;
      }
    } catch (e) {
      if (e.message === 'cancelled') solutionsEl.textContent += 'Visualization cancelled.\n';
      else console.error(e);
    } finally {
      runBtn.disabled = false;
      cancelBtn.disabled = true;
      cancelled = false;
    }
  });

  cancelBtn.addEventListener('click', () => {
    cancelled = true;
    cancelBtn.disabled = true;
  });

  // allow enter key in input to start
  inputN.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') runBtn.click();
  });

  console.info('N-Queens visualizer initialized.');
})();
