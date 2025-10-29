// recursionVisualizerPermutations.js
(() => {
  const stackContainer = document.getElementById('permStackContainer');
  const currentEl = document.getElementById('permCurrent');
  const solutionsEl = document.getElementById('permSolutions');
  const runBtn = document.getElementById('permRunBtn');
  const cancelBtn = document.getElementById('permCancelBtn');
  const inputEl = document.getElementById('permInput');
  const speedSelect = document.getElementById('permSpeed');

  if (!stackContainer || !runBtn || !inputEl) {
    console.error('Permutations visualizer: required elements missing.');
    return;
  }

  const MAX_LEN = 7; // safe demo cap (7! = 5040)
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

  function safeInput(s) {
    if (typeof s !== 'string') return '';
    const str = s.trim();
    if (str.length === 0) return '';
    // cap length
    return str.slice(0, MAX_LEN);
  }

  // swap helper on array
  function swap(arr, i, j) {
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }

  // recursive permute(arr, l)
  async function visualizePermute(arr, l) {
    if (cancelled) throw new Error('cancelled');
    pushFrame(`permute(${l})`);
    const delay = parseInt(speedSelect.value) || 350;
    await sleep(Math.max(30, delay / 2));

    if (l === arr.length - 1) {
      // record permutation
      const perm = arr.join('');
      solutionsEl.textContent += perm + '\n';
      await sleep(delay / 1.5);
      popFrame();
      return;
    }

    for (let i = l; i < arr.length; i++) {
      if (cancelled) throw new Error('cancelled');

      // swap l and i
      swap(arr, l, i);
      currentEl.textContent = arr.join('');
      await sleep(delay / 1.2);

      // recurse
      await visualizePermute(arr, l + 1);
      if (cancelled) throw new Error('cancelled');

      // swap back
      swap(arr, l, i);
      currentEl.textContent = arr.join('');
      await sleep(Math.max(30, delay / 4));
    }

    popFrame();
    await sleep(Math.max(20, delay / 8));
  }

  runBtn.addEventListener('click', async () => {
    const raw = String(inputEl.value || '');
    const s = safeInput(raw);
    if (s.length === 0) {
      alert('Please enter a non-empty string (max ' + MAX_LEN + ' chars).');
      return;
    }

    // prepare UI
    runBtn.disabled = true;
    cancelBtn.disabled = false;
    cancelled = false;
    stackContainer.innerHTML = '';
    currentEl.textContent = '';
    solutionsEl.textContent = '';

    const arr = Array.from(s);
    try {
      await visualizePermute(arr, 0);
      if (!cancelled) {
        solutionsEl.textContent += `\nDone. Total permutations: ${factorial(arr.length)}\n`;
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

  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') runBtn.click();
  });

  // small factorial helper (safe)
  function factorial(n) {
    let r = 1;
    for (let i = 2; i <= n; i++) r *= i;
    return r;
  }

  console.info('Permutations visualizer initialized.');
})();
