// recursionVisualizer.js
(() => {
  const stackContainer = document.getElementById('stackContainer');
  const consoleEl = document.getElementById('console');
  const runBtn = document.getElementById('runBtn');
  const cancelBtn = document.getElementById('cancelBtn');
  const inputN = document.getElementById('inputN');
  const speedSelect = document.getElementById('speed');

  let cancelled = false;

  function sleep(ms){ return new Promise(resolve => setTimeout(resolve, ms)); }

  function pushFrame(label){
    const frame = document.createElement('div');
    frame.className = 'stack-frame';
    frame.textContent = label;
    frame.setAttribute('data-label', label);
    stackContainer.appendChild(frame);
    // scroll to top so newest appears (container uses column-reverse optionally)
    stackContainer.scrollTop = stackContainer.scrollHeight;
  }

  function popFrame(){
    if (stackContainer.lastElementChild) stackContainer.removeChild(stackContainer.lastElementChild);
  }

  function safeN(){
    const n = parseInt(inputN.value);
    if (Number.isNaN(n)) return null;
    if (n < 0) return null;
    const max = parseInt(inputN.max) || 12;
    return Math.min(n, max);
  }

  async function visualizeFactorial(n){
    if (cancelled) throw new Error('cancelled');
    pushFrame(`factorial(${n})`);
    const delay = parseInt(speedSelect.value) || 300;
    await sleep(delay);
    if (n <= 1){
      consoleEl.textContent += `Returned 1 from factorial(${n})\n`;
      await sleep(delay);
      popFrame();
      return 1;
    }
    const result = n * await visualizeFactorial(n - 1);
    consoleEl.textContent += `Returned ${result} from factorial(${n})\n`;
    await sleep(delay);
    popFrame();
    return result;
  }

  runBtn.addEventListener('click', async () => {
    const n = safeN();
    if (n === null){
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
      const res = await visualizeFactorial(n);
      consoleEl.textContent += `Result: ${res}\n`;
    } catch (e){
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

  // optional: keyboard enter
  inputN.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') runBtn.click();
  });
})();
