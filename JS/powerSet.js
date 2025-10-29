// recursionVisualizerSubsets.js
(() => {
  const stackContainer = document.getElementById('psStackContainer');
  const currentEl = document.getElementById('psCurrent');
  const solutionsEl = document.getElementById('psSolutions');
  const runBtn = document.getElementById('psRunBtn');
  const cancelBtn = document.getElementById('psCancelBtn');
  const inputEl = document.getElementById('psInput');
  const speedSelect = document.getElementById('psSpeed');

  if (!stackContainer || !runBtn || !inputEl) {
    console.error('Subsets visualizer: required elements missing.');
    return;
  }

  // ensure default max length
  const MAX_ITEMS = parseInt(inputEl.dataset.max) || 8;

  let cancelled = false;

  function sleep(ms){ return new Promise(resolve => setTimeout(resolve, ms)); }

  function pushFrame(label) {
    const frame = document.createElement('div');
    frame.className = 'stack-frame';
    frame.textContent = label;
    stackContainer.appendChild(frame);
    stackContainer.scrollTop = stackContainer.scrollHeight;
  }

  function popFrame() {
    if (stackContainer.lastElementChild) stackContainer.removeChild(stackContainer.lastElementChild);
  }

  function safeParseItems(raw) {
    if (!raw) return [];
    // split on commas, trim spaces, ignore empty tokens
    const tokens = raw.split(',').map(s => s.trim()).filter(Boolean);
    // cap length
    if (tokens.length > MAX_ITEMS) tokens.length = MAX_ITEMS;
    // convert numeric-looking tokens to numbers (but keep others as strings)
    return tokens.map(t => {
      if (/^-?\d+(\.\d+)?$/.test(t)) return Number(t);
      return t;
    });
  }

  function formatSubset(arr) {
    return '[' + arr.map(x => (typeof x === 'string' ? `"${x}"` : String(x))).join(', ') + ']';
  }

  // visualize backtracking: backtrack(index, current)
  async function visualizeBacktrack(items, index, current) {
    if (cancelled) throw new Error('cancelled');
    pushFrame(`backtrack(${index})`);
    const delay = parseInt(speedSelect.value) || 350;
    await sleep(delay);

    if (index === items.length) {
      // record subset
      solutionsEl.textContent += formatSubset(current) + '\n';
      await sleep(delay);
      popFrame();
      return;
    }

    // include items[index]
    current.push(items[index]);
    currentEl.textContent = formatSubset(current);
    await sleep(delay / 1.2);
    await visualizeBacktrack(items, index + 1, current);
    if (cancelled) throw new Error('cancelled');

    // backtrack: remove last (exclude case)
    current.pop();
    currentEl.textContent = formatSubset(current);
    await sleep(delay / 2);

    // exclude (skip) items[index]
    await visualizeBacktrack(items, index + 1, current);
    if (cancelled) throw new Error('cancelled');

    popFrame();
    await sleep(Math.max(20, delay/6));
  }

  runBtn.addEventListener('click', async () => {
    const items = safeParseItems(inputEl.value);
    if (!Array.isArray(items) || items.length === 0) {
      alert('Please enter at least one item (comma separated).');
      return;
    }

    // disable UI while running
    runBtn.disabled = true;
    cancelBtn.disabled = false;
    cancelled = false;
    stackContainer.innerHTML = '';
    currentEl.textContent = '';
    solutionsEl.textContent = '';
    try {
      await visualizeBacktrack(items, 0, []);
      if (!cancelled) solutionsEl.textContent += `\nTotal subsets: ${Math.pow(2, items.length)} (display capped if max applied)\n`;
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

  // allow Enter to run
  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') runBtn.click();
  });

  console.info('Subsets visualizer initialized.');
})();
