// Lecture 0 demos. The Java panel is copied from notes/L00-course-introduction.md (checked by
// tools/check.py); the binary-search player replays binaryComparisons() step by step.

const CODE = {
  binaryComparisons: `static int binaryComparisons(long n, long target) {
    long low = 0, high = n - 1;
    int count = 0;
    while (low <= high) {
        long mid = low + (high - low) / 2;
        count++;
        if (mid == target) {
            return count;
        } else if (mid < target) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }
    return count;
}`,
};

(function injectStyle() {
  if (document.getElementById("l00-style")) return;
  const s = document.createElement("style");
  s.id = "l00-style";
  s.textContent = `
  .l00-range { position: relative; height: 34px; border-radius: 8px; background: var(--paper-2); border: 1px solid var(--line); margin: 10px 0 4px; overflow: hidden; }
  .l00-range .live { position: absolute; top: 0; bottom: 0; background: var(--teal-soft); border-left: 2px solid var(--teal); border-right: 2px solid var(--teal); transition: left .35s, width .35s; }
  .l00-range .mid { position: absolute; top: -2px; bottom: -2px; width: 3px; margin-left: -1px; background: var(--amber); transition: left .35s; }
  .l00-range .tgt { position: absolute; top: 0; bottom: 0; width: 2px; background: var(--green); }
  .l00-axis { display: flex; justify-content: space-between; font: 12px var(--mono); color: var(--stone); }
  .l00-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px; margin: 12px 0; }
  .l00-stats .card { padding: 10px 12px; }
  .l00-stats small { display: block; color: var(--stone); font-size: 12px; }
  .l00-stats b { font: 600 18px var(--mono); overflow-wrap: anywhere; }
  .l00-log { font: 12.5px/1.5 var(--mono); max-height: 170px; overflow: auto; background: var(--paper-2); border-radius: 8px; padding: 8px 10px; }
  .l00-log div.cur { color: var(--amber); font-weight: 600; }
  .l00-two { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  @media (max-width: 720px) { .l00-two { grid-template-columns: 1fr; } }
  .l00-two h4 { margin: 0 0 6px; font-size: 14px; }
  .l00-list { display: flex; flex-wrap: wrap; align-items: center; gap: 2px; min-height: 48px; }
  .l00-node { display: inline-flex; border: 1.5px solid var(--line); border-radius: 7px; font: 600 14px var(--mono); background: var(--card); }
  .l00-node span { padding: 7px 9px; }
  .l00-node i { border-left: 1px dashed var(--line); width: 12px; }
  .l00-node.new { border-color: var(--amber); background: var(--mark); }
  .l00-arrow { color: var(--stone); font: 14px var(--mono); padding: 0 2px; }
  .l00-arrow.new { color: var(--amber); font-weight: 700; }
  .l00-head { font: 600 12px var(--mono); color: var(--teal); margin-right: 4px; }
  .l00-cost { font: 13px var(--mono); color: var(--ink-2); margin-top: 6px; }
  `;
  document.head.appendChild(s);
})();

const fmt = (x) => Number(x).toLocaleString("en-US");

// Snapshots of binaryComparisons(n, target): one per comparison.
function binarySteps(n, target) {
  const steps = [];
  let low = 0, high = n - 1, count = 0;
  while (low <= high) {
    const mid = low + Math.floor((high - low) / 2);
    count++;
    const res = mid === target ? "found" : mid < target ? "right" : "left";
    steps.push({ low, high, mid, count, res });
    if (res === "found") break;
    if (res === "right") low = mid + 1; else high = mid - 1;
  }
  return steps;
}

// Demo: binary search on n sorted IDs vs a linear scan.
function demoSearch(el, { mini = false } = {}) {
  let n = 1400000000, target = n - 1;
  el.innerHTML = `
    ${mini ? "" : `<div class="controls" style="margin-top:0">
      <label>IDs <select class="s-n">
        <option value="16">16</option><option value="1000">1,000</option><option value="1000000">1,000,000</option><option value="1400000000" selected>1,400,000,000</option></select></label>
      <label>look for <select class="s-t"><option value="last">the last one</option><option value="first">the first one</option><option value="middle">the middle one</option><option value="random">a random one</option></select></label>
    </div>`}
    <div class="l00-range"><div class="live"></div><div class="tgt"></div><div class="mid"></div></div>
    <div class="l00-axis"><span>0</span><span class="s-max"></span></div>
    <div class="l00-stats">
      <div class="card"><small>candidates in range</small><b class="s-left"></b></div>
      <div class="card"><small>binary search: comparisons</small><b class="s-bin"></b></div>
      ${mini ? "" : `<div class="card"><small>linear scan: comparisons</small><b class="s-lin"></b></div>`}
    </div>
    ${mini ? "" : `<div class="l00-log s-log"></div>
    <div class="msg s-msg"></div>
    <div class="controls">
      <button class="cbtn s-reset">⟲ Reset</button><button class="cbtn s-back">◀ Back</button>
      <button class="cbtn s-step on">Step ▶</button><button class="cbtn s-play">Play</button>
      <span class="spacer"></span><span class="counter s-count"></span></div>`}`;
  const $ = (s) => el.querySelector(s);
  let steps = [], i = -1, timer = null;
  const pct = (x) => `${(100 * x) / n}%`;
  function rebuild() {
    steps = binarySteps(n, target);
    i = mini ? 0 : -1;
    $(".s-max").textContent = fmt(n - 1);
    $(".tgt").style.left = pct(target + 0.5);
    render();
  }
  function render() {
    const s = i >= 0 ? steps[i] : { low: 0, high: n - 1, mid: null, count: 0 };
    const left = s.res === "found" ? 1 : Math.max(0, s.high - s.low + 1);
    $(".live").style.left = pct(s.low);
    $(".live").style.width = `max(3px, ${pct(s.high - s.low + 1)})`;
    $(".mid").style.display = s.mid === null ? "none" : "";
    if (s.mid !== null) $(".mid").style.left = pct(s.mid + 0.5);
    $(".s-left").textContent = fmt(left);
    $(".s-bin").textContent = fmt(s.count);
    if (mini) return;
    $(".s-lin").textContent = fmt(target + 1);
    $(".s-log").innerHTML = steps.slice(0, i + 1).map((t, k) =>
      `<div class="${k === i ? "cur" : ""}">#${t.count}: low=${fmt(t.low)} high=${fmt(t.high)} mid=${fmt(t.mid)} → ${t.res === "found" ? "found it" : t.res === "right" ? "target is larger: keep the right half" : "target is smaller: keep the left half"}</div>`).join("");
    const lg = $(".s-log"); lg.scrollTop = lg.scrollHeight;
    $(".s-msg").innerHTML = i < 0
      ? `Looking for ID number <b>${fmt(target)}</b> among ${fmt(n)} sorted IDs. Press Step.`
      : s.res === "found"
        ? `Found after <b>${s.count}</b> comparisons. A scan from the start would make <b>${fmt(target + 1)}</b>.`
        : `Compare with the middle element ${fmt(s.mid)}, then throw away half: ${fmt(s.res === "right" ? s.high - s.mid : s.mid - s.low)} candidates left.`;
    $(".s-msg").className = "msg s-msg" + (s.res === "found" ? " ok" : "");
    $(".s-count").textContent = `step ${i + 1} / ${steps.length}`;
    $(".s-back").disabled = $(".s-reset").disabled = i < 0;
    $(".s-step").disabled = i === steps.length - 1;
  }
  function stop() { clearInterval(timer); timer = null; if (!mini) $(".s-play").textContent = "Play"; }
  function play() {
    if (timer) return stop();
    if (i === steps.length - 1) i = -1;
    if (!mini) $(".s-play").textContent = "Pause";
    timer = setInterval(() => {
      if (i < steps.length - 1) { i++; render(); } else if (mini) { i = 0; render(); } else stop();
    }, mini ? 700 : 600);
  }
  if (!mini) {
    const pickTarget = () => {
      const t = $(".s-t").value;
      target = t === "last" ? n - 1 : t === "first" ? 0 : t === "middle" ? Math.floor((n - 1) / 2) : Math.floor(Math.random() * n);
    };
    $(".s-n").onchange = (e) => { stop(); n = +e.target.value; pickTarget(); rebuild(); };
    $(".s-t").onchange = () => { stop(); pickTarget(); rebuild(); };
    $(".s-reset").onclick = () => { stop(); i = -1; render(); };
    $(".s-back").onclick = () => { stop(); if (i >= 0) i--; render(); };
    $(".s-step").onclick = () => { stop(); if (i < steps.length - 1) i++; render(); };
    $(".s-play").onclick = play;
    el.tabIndex = 0;
    el.addEventListener("keydown", (e) => {
      if (e.target.tagName === "SELECT") return;
      if (e.key === "ArrowRight") { e.preventDefault(); $(".s-step").click(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); $(".s-back").click(); }
    });
  }
  rebuild();
  if (mini) play();
}

// Demo: insert a value at the front of an array and of a linked list, side by side.
function demoInsertFront(el) {
  let data = [3, 8, 12, 20, 31], value = 1;
  el.innerHTML = `
    <div class="controls" style="margin-top:0">
      <label>values <input type="text" class="f-d" value="${data.join(", ")}"></label>
      <label>insert at front <input type="number" class="f-v" value="${value}"></label></div>
    <div class="l00-two">
      <div><h4>Sorted array</h4><div class="cells f-arr"></div><div class="l00-cost f-ac"></div></div>
      <div><h4>Linked list</h4><div class="l00-list f-list"></div><div class="l00-cost f-lc"></div></div>
    </div>
    <div class="msg f-msg"></div>
    <div class="controls"><button class="cbtn f-reset">⟲ Reset</button><button class="cbtn f-back">◀ Back</button>
      <button class="cbtn f-step on">Step ▶</button><span class="spacer"></span><span class="counter f-count"></span></div>`;
  const $ = (s) => el.querySelector(s);
  let snaps = [], i = 0;
  function build() {
    // Array: grow by one slot, shift from the right end, then write the value at index 0.
    // List: make a node, point it at the old head, move head to it.
    const n = data.length;
    const s = [];
    const arr = [...data, null];
    s.push({ arr: arr.slice(), hot: -1, moves: 0, list: 0, msg: `Insert <b>${value}</b> at the front of both. The array has a free slot at the end.` });
    let moves = 0;
    for (let k = n - 1; k >= 0; k--) {
      arr[k + 1] = arr[k];
      arr[k] = null;
      moves++;
      s.push({ arr: arr.slice(), hot: k + 1, moves, list: Math.min(3, moves), msg: `Array: shift <code>a[${k}]</code> one place right (move ${moves} of ${n}).` + (moves <= 3 ? ` List: ${["make a new node", "point the new node at the old head", "move <code>head</code> to the new node — done"][moves - 1]}.` : " List: already done.") });
    }
    arr[0] = value;
    s.push({ arr: arr.slice(), hot: 0, moves, list: 3, msg: `Array: write ${value} into <code>a[0]</code>. <b>${n}</b> moves for the array, <b>2</b> link changes for the list: the array's cost grows with n, the list's does not.`, done: true });
    return s;
  }
  function render() {
    const s = snaps[i];
    $(".f-arr").innerHTML = s.arr.map((v, k) => `<div class="cell${k === s.hot ? " mid" : ""}${v === null ? " out" : ""}${s.done && k === 0 ? " found" : ""}">${v === null ? "" : v}</div>`).join("");
    $(".f-ac").textContent = `moves: ${s.moves}`;
    const node = (v, cls = "") => `<span class="l00-node ${cls}"><span>${v}</span><i></i></span>`;
    const rest = data.map((v) => node(v)).join(`<span class="l00-arrow">→</span>`) + `<span class="l00-arrow">→ null</span>`;
    let html;
    if (s.list === 0) html = `<span class="l00-head">head →</span>` + rest;
    else if (s.list === 1) html = `<span class="l00-head">head →</span>` + rest + `<div style="width:100%;margin-top:6px">${node(value, "new")} <span class="l00-arrow">(new, not linked yet)</span></div>`;
    else if (s.list === 2) html = `<span class="l00-head">head →</span>` + rest + `<div style="width:100%;margin-top:6px">${node(value, "new")}<span class="l00-arrow new">↗ points at ${data[0]}</span></div>`;
    else html = `<span class="l00-head">head →</span>` + node(value, "new") + `<span class="l00-arrow new">→</span>` + rest;
    $(".f-list").innerHTML = html;
    $(".f-lc").textContent = `link changes: ${Math.max(0, s.list - 1)}`;
    $(".f-msg").innerHTML = s.msg;
    $(".f-msg").className = "msg f-msg" + (s.done ? " ok" : "");
    $(".f-count").textContent = `step ${i + 1} / ${snaps.length}`;
    $(".f-back").disabled = $(".f-reset").disabled = i === 0;
    $(".f-step").disabled = i === snaps.length - 1;
  }
  function rebuild() { snaps = build(); i = 0; render(); }
  $(".f-d").onchange = (e) => { data = parseNums(e.target.value, [3, 8, 12, 20, 31]).slice(0, 9); e.target.value = data.join(", "); rebuild(); };
  $(".f-v").onchange = (e) => { value = Number.isFinite(+e.target.value) ? +e.target.value : 1; rebuild(); };
  $(".f-reset").onclick = () => { i = 0; render(); };
  $(".f-back").onclick = () => { if (i > 0) i--; render(); };
  $(".f-step").onclick = () => { if (i < snaps.length - 1) i++; render(); };
  el.tabIndex = 0;
  el.addEventListener("keydown", (e) => {
    if (e.target.tagName === "INPUT") return;
    if (e.key === "ArrowRight") { e.preventDefault(); $(".f-step").click(); }
    if (e.key === "ArrowLeft") { e.preventDefault(); $(".f-back").click(); }
  });
  rebuild();
}

// ---------- quiz ----------

function demoQuiz(el, questions) {
  el.innerHTML = `<div class="quiz">` + questions.map((q, k) => `<div class="card q" data-k="${k}">
      <p><b>Q${k + 1}.</b> ${q.q}</p>${q.code ? codeBlock(q.code) : ""}
      <div class="opts">${q.opts.map((o, j) => `<button class="opt" data-j="${j}">${o}</button>`).join("")}</div>
      <div class="explain">${q.why}</div></div>`).join("") +
    `<p class="score"></p></div>`;
  let right = 0, done = 0;
  el.querySelectorAll(".q").forEach((qe) => {
    const q = questions[+qe.dataset.k];
    qe.querySelectorAll(".opt").forEach((b) => {
      b.onclick = () => {
        const j = +b.dataset.j;
        qe.querySelectorAll(".opt").forEach((x) => { x.disabled = true; });
        qe.querySelectorAll(".opt")[q.a].classList.add("right");
        if (j !== q.a) b.classList.add("wrong"); else right++;
        qe.classList.add("done");
        done++;
        el.querySelector(".score").textContent = `${right} / ${done} correct` + (done === questions.length ? (right === questions.length ? " — all right!" : " — reread the sections you missed.") : "");
      };
    });
  });
}

const DEMOS = {
  search: (el) => demoSearch(el),
  searchMini: (el) => demoSearch(el, { mini: true }),
  insertFront: (el) => demoInsertFront(el),
  quiz: (el) => demoQuiz(el, QUIZ),
};
