// recursionVisualizerFib.js
(() => {
  // element refs
  const stackContainer = document.getElementById('fibStackContainer');
  const consoleEl = document.getElementById('fibConsole');
  const runBtn = document.getElementById('fibRunBtn');
  const cancelBtn = document.getElementById('fibCancelBtn');
  const inputN = document.getElementById('fibN');
  const speedSelect = document.getElementById('fibSpeed');

  // basic sanity
  if (!stackContainer || !runBtn || !inputN) {
    console.error('Fibonacci visualizer: required elements missing.');
    return;
  }

  let cancelled = false;

  function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

  function pushFrame(label) {
    const frame = document.createElement('div');
    frame.className = 'stack-frame';
    frame.textContent = label;
    frame.dataset.label = label;
    stackContainer.appendChild(frame);
    // keep newest visible (container is column-reverse)
    stackContainer.scrollTop = stackContainer.scrollHeight;
  }

  function popFrame() {
    if (stackContainer.lastElementChild) stackContainer.removeChild(stackContainer.lastElementChild);
  }

  function safeN() {
    const n = parseInt(inputN.value);
    if (Number.isNaN(n)) return null;
    if (n < 0) return null;
    const max = parseInt(inputN.max) || 10;
    return Math.min(n, max);
  }

  // naive Fibonacci visualization (calls fib(n-1) then fib(n-2))
  async function visualizeFib(n) {
    if (cancelled) throw new Error('cancelled');
    pushFrame(`fib(${n})`);
    const delay = parseInt(speedSelect.value) || 350;
    await sleep(delay);

    if (n === 0) {
      consoleEl.textContent += `Returned 0 from fib(0)\n`;
      await sleep(delay);
      popFrame();
      return 0;
    }
    if (n === 1) {
      consoleEl.textContent += `Returned 1 from fib(1)\n`;
      await sleep(delay);
      popFrame();
      return 1;
    }

    // left subtree
    const left = await visualizeFib(n - 1);
    if (cancelled) throw new Error('cancelled');
    // small pause to show the return before branching right
    consoleEl.textContent += `fib(${n-1}) -> ${left}\n`;
    await sleep(delay / 2);

    // right subtree
    const right = await visualizeFib(n - 2);
    if (cancelled) throw new Error('cancelled');
    consoleEl.textContent += `fib(${n-2}) -> ${right}\n`;

    const result = left + right;
    consoleEl.textContent += `Returned ${result} from fib(${n})\n`;
    await sleep(delay);
    popFrame();
    return result;
  }

  runBtn.addEventListener('click', async () => {
    const n = safeN();
    if (n === null) {
      alert('Please enter a valid non-negative integer within allowed range.');
      return;
    }

    // disable controls while running
    runBtn.disabled = true;
    cancelBtn.disabled = false;
    cancelled = false;
    stackContainer.innerHTML = '';
    consoleEl.textContent = '';

    try {
      const res = await visualizeFib(n);
      consoleEl.textContent += `Result: fib(${n}) = ${res}\n`;
    } catch (e) {
      if (e.message === 'cancelled') consoleEl.textContent += 'Visualization cancelled.\n';
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

  inputN.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') runBtn.click();
  });

  console.info('Fibonacci visualizer initialized.');
})();
