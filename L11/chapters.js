// Chapter content, adapted from notes/L11-quicksort.md. Code and outputs are copied from the note.

const demo = (name, title, instr, hint = "") =>
  `<div class="card demo" data-demo="${name}"><div class="head"><span class="title">${title}</span><span>${instr}</span></div>
   <div class="demo-body"></div>${hint ? `<p class="hint">${hint}</p>` : ""}</div>`;

const callout = (kind, label, body) => `<div class="callout ${kind}"><b>${label}</b>${body}</div>`;
const predict = (q, a) => callout("predict", "PREDICT", `<p>${q}</p><details class="reveal"><summary>Show the answer</summary>${a}</details>`);
const prog = (k) => codeBlock(CODE[k]) + (OUT[k] ? codeBlock(OUT[k], "out") : "");
const M = (s) => `<span class="math">${s}</span>`;
const MB = (s) => `<div class="math-block">${s}</div>`;

// A static row of cells for the figures (classes as in the demos).
const row = (vals, cls = () => "") => qsCells(vals, { cls, idx: () => "" });

const LECTURE = {
  number: 11,
  title: "Quicksort",
  tagline: "Pick a pivot, partition, recurse",
  lead: "Randomized algorithms and expected cost, two ways to partition an array in place, why quicksort is fast on average and slow in the worst case, and why no comparison sort can beat n log n — with every partition step ready to be stepped through.",
  heroDemo: "quickMini",
  heroLabel: "Randomized quicksort · seed 19",
  heroCaption: "Each pivot lands in its final place; the two sides are sorted the same way.",
  whyTitle: "Why quicksort is worth learning",
  whySub: "Three ideas you will meet again and again",
  why: [
    ["The fastest sort in practice", "In place, cache-friendly and typically 2–3 times faster than merge sort: the default sort in many libraries."],
    ["Randomness as a tool", "A random pivot makes every input easy <b>in expectation</b>. You will analyse it with indicator variables."],
    ["A limit on all sorting", "Decision trees show that every comparison sort needs <b>Ω(n log n)</b> comparisons in the worst case."],
  ],
  ctaTitle: "Ready to partition?",
  minutes: "About 75–90 minutes",
  videos: {
    "media/L11-1.mp4": "Lecture 11 · Part 1 — Randomized algorithms and the idea of quicksort (8.3 min)",
    "media/L11-2.mp4": "Lecture 11 · Part 2 — The Lomuto partition and randomized quicksort (9.6 min)",
    "media/L11-3.mp4": "Lecture 11 · Part 3 — Median-of-three quicksort (10.5 min)",
    "media/L11-4.mp4": "Lecture 11 · Part 4 — Running time, stability and the lower bound (10.8 min)",
  },
};

const CHAPTERS = [
  {
    slug: "1-random", nav: "Randomness", title: "Quicksort and Randomized Algorithms",
    subtitle: "What a random choice does to running time",
    abstract: "Quicksort is fast on average and slow only with bad luck. To say that precisely we need randomized algorithms and their expected cost.",
    tags: ["sorting problem", "flipCoin", "E[X] = 4"],
    hero: "flipMini", heroCaption: "flipCoin(): keep flipping until a 1 comes up.",
    sections: [
      { id: "video-1", title: "Watch: Randomized algorithms and the idea of quicksort", html: `
        <div class="card video" data-video="media/L11-1.mp4"></div>` },
      { id: "glance", title: "Quicksort at a glance", html: `
        <p>The <b>sorting problem</b>: the input is a sequence of ${M("n")} numbers ${M("⟨a<sub>1</sub>, a<sub>2</sub>, …, a<sub>n</sub>⟩")}; the output is a <b>permutation</b> (reordering) ${M("⟨a′<sub>1</sub>, …, a′<sub>n</sub>⟩")} of the input with ${M("a′<sub>1</sub> ≤ a′<sub>2</sub> ≤ … ≤ a′<sub>n</sub>")}.</p>
        <p>So far we have seen insertion sort (${M("O(n²)")} in the worst case) and merge sort (${M("O(n log n)")}). <b>Quicksort</b>, invented by Tony Hoare in 1959, is the third big one:</p>
        <ul><li>it is the <b>fastest known sorting algorithm in practice</b> for general data;</li>
        <li>its <b>average (expected)</b> running time is ${M("O(n log n)")};</li>
        <li>its <b>worst case</b> is ${M("O(n²)")}, but with a random pivot that is extremely unlikely.</li></ul>
        <p>Quicksort is the default sort for primitive arrays in many libraries; Java's <code>Arrays.sort(int[])</code>, for example, uses a dual-pivot quicksort.</p>` },
      { id: "deterministic", title: "Deterministic and randomized algorithms", html: `
        <p>Every algorithm we have met so far is <b>deterministic</b>: it involves no randomness. Given the same input, it always runs in the same way, no matter how many times we repeat it, and so its running cost (the number of basic operations) is also the same every time.</p>
        <p>A <b>randomized algorithm</b> may use one more basic operation:</p>
        <ul><li>${M("random(x, y)")}: return an integer from ${M("[x, y]")}, chosen <b>uniformly at random</b> (every one of the ${M("y − x + 1")} integers is equally likely).</li></ul>
        <p>Given the same input, a randomized algorithm may run in different ways, because its random choices differ. Its running cost is therefore a <b>random variable</b>.</p>
        <p>A tiny example is <code>flipCoin()</code>, which keeps flipping a fair coin until it shows 1:</p>
        ${codeBlock(`Algorithm flipCoin()
r ← RANDOM(0, 1)
while r ≠ 1
    r ← RANDOM(0, 1)`)}
        <p>Each run may take a different number of rounds. In the worst case it never stops (the coin could show 0 forever), even though the probability of that is zero in the limit. So the “worst-case running time” is not a useful measure for it. For randomized algorithms we study the <b>expected running cost</b> instead.</p>` },
      { id: "expected", title: "Expected running cost", html: `
        <p>Let ${M("X")} be the running cost of a randomized algorithm on a given input. The <b>expected running cost</b> is ${M("E[X]")}, the average of ${M("X")} weighted by probability:</p>
        ${MB("E[X] = Σ<sub>x</sub> x · Pr[X = x]")}
        <p>For <code>flipCoin()</code>, count 2 basic operations per round (one draw, one test of the <code>while</code> condition). The first draw is 1 with probability ½, which costs 2; it takes two rounds with probability ¼, which costs 4; in general</p>
        ${MB("Pr[X = 2i] = 1 / 2<sup>i</sup>, &nbsp; i = 1, 2, 3, …")}
        ${MB("E[X] = Σ<sub>i≥1</sub> 2i · 1/2<sup>i</sup> = 2 · Σ<sub>i≥1</sub> i/2<sup>i</sup> = 2 · 2 = 4 = O(1)")}
        <p>The sum ${M("Σ i/2<sup>i</sup> = 2")} comes from ${M("Σ<sub>k=1</sub><sup>n</sup> k x<sup>k</sup> = (x − (n+1)x<sup>n+1</sup> + n x<sup>n+2</sup>) / (x − 1)²")}: with ${M("x = ½")} it gives ${M("Σ<sub>i=1</sub><sup>n</sup> i/2<sup>i</sup> = 2 − (n+2)/2<sup>n</sup>")}, which tends to 2.</p>
        <p>Let us check this by simulation. <code>rng.nextInt(2)</code> is Java's <code>RANDOM(0, 1)</code>:</p>
        ${prog("flipCoinProg")}
        <p>Single runs vary (2, 8, 4, 6, …), but the average settles at 4, as the formula says.</p>
        ${demo("flipCoin", "Demo 1 · flipCoin, one draw at a time", "← → keys step", "Seed 7 replays the Java program exactly: the ten runs cost 2 2 2 8 2 2 2 4 6 2. The button continues on the same generator, like <code>main</code>, and prints the same 4.001.")}
        ${predict("A die-rolling version keeps rolling a fair six-sided die until it shows 6. With the same cost model (2 per round), what is the expected cost?",
          `<p>Each round succeeds with probability ${M("p = 1/6")}, so the expected number of rounds is ${M("1/p = 6")} and the expected cost is ${M("2 · 6 = 12")}. (For the coin, ${M("p = ½")}: 2 rounds, cost 4.)</p>`)}` },
    ],
    takeaways: ["Randomized: same input, different runs.", "Measure the expected cost E[X].", "flipCoin: E[X] = 4 = O(1)."],
  },
  {
    slug: "2-quicksort", nav: "Quicksort", title: "Randomized Quicksort",
    subtitle: "Pick a random pivot, partition, recurse",
    abstract: "All the work happens in partition: after it, the pivot sits in its final place, and the two sides are independent smaller problems.",
    tags: ["divide and conquer", "Lomuto partition", "in place"],
    hero: "quickMini", heroCaption: "quicksort on 10 numbers with seed 19: the first pivot is 65.",
    sections: [
      { id: "video-2", title: "Watch: The Lomuto partition and randomized quicksort", html: `
        <div class="card video" data-video="media/L11-2.mp4"></div>` },
      { id: "idea", title: "Divide and conquer", html: `
        <p>Quicksort is a <b>divide-and-conquer</b> algorithm with ${M("O(n log n)")} expected running time. Assume for now that the elements are distinct. The idea:</p>
        <ol><li><b>Pick a pivot.</b> Choose one element at random; call its value ${M("v")}.</li>
        <li><b>Partition.</b> Rearrange the elements into three parts: the elements smaller than ${M("v")} (the left part), the pivot itself, and the elements larger than ${M("v")} (the right part).</li>
        <li><b>Recurse.</b> Sort the left part and the right part in the same way, if they have more than one element.</li></ol>
        <p>There is no “combine” work to do: once both parts are sorted, the whole array is sorted, because everything on the left is smaller than the pivot and everything on the right is larger. (Compare merge sort, where splitting is trivial and all the work is in merging. Quicksort puts all the work into the split.)</p>
        <p><b>Example.</b> Sort 13, 81, 92, 43, 31, 65, 57, 26, 75, 0. Suppose 65 is selected as the pivot.</p>
        <div class="card" style="padding:12px 8px">
          ${row([13, 81, 92, 43, 31, 65, 57, 26, 75, 0], (k) => (k === 5 ? "pv" : ""))}
          <p class="hint" style="text-align:center;margin:0">↓ partition around 65</p>
          ${row([13, 43, 31, 57, 26, 0, 65, 81, 92, 75], (k) => (k < 6 ? "sm" : k === 6 ? "pv" : "lg"))}
          <p class="hint" style="text-align:center;margin:0">↓ sort each side the same way</p>
          ${row([0, 13, 26, 31, 43, 57, 65, 75, 81, 92], () => "fin")}
          <p class="hint" style="text-align:center;margin:4px 0 0">nothing left to combine</p>
        </div>
        ${callout("note", "NOTE · DUPLICATES", `<p>The idea also works when values repeat. Elements equal to the pivot can go to either side, or to a group of their own; the algorithm stays correct and only the details of the implementation change. Chapter 3 shows one case where the details matter.</p>`)}` },
      { id: "recursion", title: "The recursion", html: `
        ${codeBlock(`Algorithm quicksort(arr, left, right)
if left ≥ right
    return
pivot ← RANDOM(left, right)          // index of a randomly chosen pivot
p ← partition(arr, left, right, pivot)
quicksort(arr, left, p − 1)
quicksort(arr, p + 1, right)`)}
        <p><code>quicksort(arr, left, right)</code> sorts the part <code>arr[left..right]</code>. The base case is a range with 0 or 1 elements (<code>left &gt;= right</code>), which is already sorted.</p>
        <p>The key step is <b><code>partition(arr, left, right, pivot)</code></b>:</p>
        <ul><li><b>input</b>: the array, the range <code>left..right</code>, and the index <code>pivot</code> of the randomly chosen pivot;</li>
        <li><b>goal</b>: rearrange <code>arr[left..right]</code> into three parts: the left part (smaller than the pivot value), the pivot, and the right part (larger than the pivot value);</li>
        <li><b>return</b>: the pivot's <b>new position</b> <code>p</code>, which splits the problem into the two subproblems <code>left..p−1</code> and <code>p+1..right</code>.</li></ul>
        <p>For example, with <code>arr = [4, 2, 3, 6, 9, 5, 7]</code>, <code>left = 0</code>, <code>right = 6</code> and <code>pivot = 3</code> (value 6), partition produces <code>[4, 2, 3, 5, 6, 7, 9]</code> and returns 4: the pivot value 6 is now at index 4, with smaller values to its left and larger values to its right. Index 4 is exactly where 6 belongs in the sorted array. <b>After partition, the pivot is in its final place</b> and is never moved again.</p>` },
      { id: "lomuto", title: "The Lomuto partition", html: `
        <p>The slides' partition (named after Nico Lomuto) scans the range once from left to right:</p>
        ${codeBlock(`Algorithm partition(arr, left, right, pivot)
pivotVal ← arr[pivot]               // record the pivot value
swap(arr, right, pivot)             // park the pivot at the right end
nextSmallPos ← left                 // where the next value < pivotVal goes
for j from left to right − 1
    if arr[j] < pivotVal
        swap(arr, nextSmallPos, j)
        nextSmallPos ← nextSmallPos + 1
swap(arr, nextSmallPos, right)      // pivot between the two parts
return nextSmallPos`)}
        <p>During the loop the range is divided into four regions:</p>
        <div class="card" style="padding:10px;overflow-x:auto"><div style="display:flex;min-width:460px;font:600 12px var(--mono);text-align:center">
          <div style="flex:3;padding:10px 4px;background:var(--teal-soft);border:1px solid var(--teal);border-radius:6px 0 0 6px">&lt; pivotVal<br><small>left … nextSmallPos−1</small></div>
          <div style="flex:3;padding:10px 4px;background:color-mix(in srgb,var(--amber) 16%,var(--card));border:1px solid var(--amber)">≥ pivotVal<br><small>nextSmallPos … j−1</small></div>
          <div style="flex:3;padding:10px 4px;border:1px solid var(--line)">not yet seen<br><small>j … right−1</small></div>
          <div style="flex:1.4;padding:10px 4px;background:var(--mark);border:2px solid var(--amber);border-radius:0 6px 6px 0">pivot<br><small>right</small></div></div></div>
        <p>When <code>arr[j]</code> is small, swapping it with <code>arr[nextSmallPos]</code> (the first large value) and advancing <code>nextSmallPos</code> extends the small region by one and keeps the large region contiguous. When <code>arr[j]</code> is large, just moving on to <code>j + 1</code> extends the large region. At the end, <code>nextSmallPos</code> is the first large position; swapping the pivot there puts it between the two regions.</p>
        <p>In Java:</p>
        ${codeBlock(CODE.partition)}
        ${callout("note", "NOTE", `<p>The slides write the test once as <code>arr[j] &lt; pivotVal</code> and once as <code>arr[j] &lt; arr[right]</code>. They are the same: after the parking swap the pivot value sits at <code>arr[right]</code>, and the loop never touches <code>arr[right]</code>.</p>`)}
        ${demo("lomuto", "Demo 2 · The Lomuto partition", "edit arr and the pivot, then step", "Teal cells are smaller than the pivot, amber cells are not, and the outlined cell is the one being tested. Try the all-7s example: nothing is smaller, so the pivot ends at the far left.")}` },
      { id: "trace", title: "Tracing a partition", html: `
        <p>Here is the slides' example, <code>[4, 2, 3, 6, 9, 5, 7]</code> with pivot index 3, with a print after every step (the loop is copied from <code>partition</code>):</p>
        ${prog("partitionTrace")}
        <table><thead><tr><th>step</th><th><code>j</code></th><th><code>arr[j]</code></th><th>action</th><th>array afterwards</th><th><code>nextSmallPos</code></th></tr></thead><tbody>
        <tr><td>park pivot</td><td></td><td></td><td>swap <code>arr[6]</code>, <code>arr[3]</code></td><td>4 2 3 <b>7</b> 9 5 <b>6</b></td><td>0</td></tr>
        <tr><td>1–3</td><td>0, 1, 2</td><td>4, 2, 3</td><td>small: swap with itself</td><td>4 2 3 7 9 5 6</td><td>1, 2, 3</td></tr>
        <tr><td>4</td><td>3</td><td>7</td><td>large: skip</td><td>4 2 3 7 9 5 6</td><td>3</td></tr>
        <tr><td>5</td><td>4</td><td>9</td><td>large: skip</td><td>4 2 3 7 9 5 6</td><td>3</td></tr>
        <tr><td>6</td><td>5</td><td>5</td><td>small: swap <code>arr[3]</code>, <code>arr[5]</code></td><td>4 2 3 <b>5</b> 9 <b>7</b> 6</td><td>4</td></tr>
        <tr><td>pivot home</td><td></td><td></td><td>swap <code>arr[4]</code>, <code>arr[6]</code></td><td>4 2 3 5 <b>6</b> 7 <b>9</b></td><td>return 4</td></tr></tbody></table>
        <p>While all the values so far are small, <code>nextSmallPos == j</code> and each “swap” swaps an element with itself. The first real swap happens at <code>j = 5</code>, when the small value 5 jumps over the large block <code>7 9</code>.</p>
        <p>A second example: <code>[10, 80, 30, 90, 40]</code> with the pivot 40 already at the right end.</p>
        ${prog("partitionDemo")}
        ${predict("In the second example, write down <code>j</code>, <code>nextSmallPos</code> and the array after each step. What does partition return?",
          `<p>10 is small (swap with itself, <code>nextSmallPos = 1</code>); 80 is large; 30 is small, so swap 80 and 30 (<code>[10, 30, 80, 90, 40]</code>, <code>nextSmallPos = 2</code>); 90 is large. Finally swap <code>arr[2] = 80</code> with the pivot: <code>[10, 30, 40, 90, 80]</code>, and partition returns <b>2</b>, the index of 40. (Two values, 10 and 30, are smaller than 40, so 40 belongs at index 2.) Check it with the second example in Demo 2.</p>`)}
        ${callout("pitfall", "PITFALL", `<p><b>The returned index equals the number of values smaller than the pivot</b> (plus <code>left</code>). A quick check of any partition trace: count the small values. In the second example there are two, so the answer must be 2, not 3.</p>`)}` },
      { id: "whole", title: "The whole randomized quicksort", html: `
        <p><code>rng.nextInt(right - left + 1)</code> returns an integer from 0 to <code>right - left</code>, so <code>left + rng.nextInt(right - left + 1)</code> is <code>RANDOM(left, right)</code>:</p>
        ${codeBlock(CODE.randomizedQuickSort)}
        <p>To watch the recursion, here is the same method with one print per call, run on the example above with two different random seeds:</p>
        ${prog("quickSortTrace")}
        <p>With seed 19 the first pivot is 65, as in the picture above. With seed 2026 the first pivot is 0, the smallest value: the left part is empty and the right part has 9 elements, a bad split, and the recursion goes one level deeper. Same input, same result, different work: that is a randomized algorithm. (Calls on ranges of 0 or 1 elements return at once and print nothing.)</p>
        ${demo("quick", "Demo 3 · Randomized quicksort", "change the seed, then step", "The demo uses a copy of Java's random number generator, so seed 19 and seed 2026 pick exactly the pivots printed above. Green cells are in their final place.")}
        ${predict("How many times can one element be chosen as a pivot during a whole run of quicksort?",
          `<p><b>At most once.</b> After partition the pivot is in its final place and is excluded from both recursive calls (<code>left..p−1</code> and <code>p+1..right</code>). In the seed-19 run, the pivots were 65, 31, 0, 13, 43, 92, 81; the other three elements (26, 57, 75) were never pivots: they ended up alone in a range of size 1.</p>`)}` },
      { id: "merge", title: "Merge sort vs quicksort", html: `
        <p>Both merge sort and quicksort use <b>divide-and-conquer</b>, but they put the work in different places:</p>
        <table><thead><tr><th></th><th>merge sort</th><th>quicksort</th></tr></thead><tbody>
        <tr><td>divide</td><td>trivial: cut in the middle</td><td>the real work: partition around a pivot</td></tr>
        <tr><td>combine</td><td>the real work: merge two sorted halves</td><td>nothing to do</td></tr>
        <tr><td>extra array</td><td>yes: merging needs a temporary array of size ${M("n")} (copy out, copy back)</td><td>no: partition swaps inside the same array (<b>in place</b>)</td></tr>
        <tr><td>time</td><td>${M("Θ(n log n)")} always</td><td>${M("O(n log n)")} expected, ${M("Θ(n²)")} worst</td></tr></tbody></table>
        <p>In practice quicksort is typically <b>2–3 times faster</b> than merge sort, even though both are ${M("O(n log n)")} (expected, for quicksort). The constant factors decide: partition does a simple sequential scan with few data moves and no extra array, which suits the CPU cache.</p>` },
    ],
    takeaways: ["Partition puts the pivot in its final place.", "Lomuto: small values swap to nextSmallPos.", "In place, no combine step."],
  },
  {
    slug: "3-median", nav: "Median-of-3", title: "Median-of-Three Quicksort",
    subtitle: "A deterministic version that is fast in practice",
    abstract: "Weiss's quicksort picks the median of the first, center and last elements, scans with two pointers that meet in the middle, and hands small ranges to insertion sort.",
    tags: ["median3", "i and j", "cutoff"],
    hero: "medianMini", heroCaption: "One partition of 8 1 4 9 6 3 5 2 7 0 around the median 6.",
    sections: [
      { id: "video-3", title: "Watch: Median-of-three quicksort", html: `
        <div class="card video" data-video="media/L11-3.mp4"></div>` },
      { id: "plan", title: "The plan", html: `
        <p>Random numbers cost time, and a program that behaves differently on every run is harder to test. Weiss's textbook (<em>Data Structures and Algorithm Analysis in Java</em>, Chapter 7) gives a deterministic version that is very good in practice. It differs from the randomized version in three ways: how the pivot is chosen, how partition scans, and what happens for small ranges.</p>
        <ol><li><b>Pivot = median of three.</b> Look at the first, center and last elements of the range, and use their <b>median</b> as the pivot (method <code>median3</code>). The first element alone would be a terrible pivot for already-sorted input; the median of three is never the smallest or the largest value in the range.</li>
        <li><b>Hide the pivot</b> at the second-last position, <code>right − 1</code>.</li>
        <li><b>Two pointers.</b> Start <code>i</code> at the second element (<code>left + 1</code>) and <code>j</code> at the third-last element (<code>right − 2</code>).</li>
        <li>Move <code>i</code> right, skipping over elements <b>smaller</b> than the pivot. Move <code>j</code> left, skipping over elements <b>larger</b> than the pivot. When both have stopped, <code>i</code> points to an element that is not smaller than the pivot (it belongs on the right) and <code>j</code> to one that is not larger (it belongs on the left).</li>
        <li>If <code>i &lt; j</code>, swap <code>a[i]</code> and <code>a[j]</code> and continue scanning. If the pointers have crossed (<code>i ≥ j</code>), stop and swap the pivot (at <code>right − 1</code>) with <code>a[i]</code>.</li></ol>
        <p>In the end every element left of the pivot is smaller than it and every element right of it is larger.</p>` },
      { id: "median3", title: "median3", html: `
        <p><code>median3</code> sorts the three sampled elements in place, so that <code>a[left] &lt;= a[center] &lt;= a[right]</code>, then moves the median to <code>right − 1</code>:</p>
        ${codeBlock(CODE.median3)}
        <p>On <code>8 1 4 9 6 3 5 2 7 0</code> (left = 0, right = 9, center = 4) the three samples are 8, 6 and 0. After the three compare-and-swaps the array is <code>0 1 4 9 6 3 5 2 7 8</code> (the samples are now 0, 6, 8), and the median 6 moves to index 8: <code>0 1 4 9 7 3 5 2 6 8</code>.</p>
        <p>Sorting the three samples is a small bonus: <code>a[left]</code> is now at most the pivot and <code>a[right]</code> at least the pivot, so they are already on the correct sides, and partition only has to look at <code>left + 1 .. right − 2</code>. They also act as <b>sentinels</b>: <code>j</code> cannot run off the left end, because it stops at <code>a[left]</code> (which is not larger than the pivot) at the latest; and <code>i</code> stops at the pivot at <code>right − 1</code> at the latest. So the inner loops need no bounds checks.</p>` },
      { id: "method", title: "The full method", html: `
        ${codeBlock(CODE.medianQuickSort)}
        <p>Three details:</p>
        <ul><li><b><code>a[++i]</code> and <code>a[--j]</code>.</b> <code>i</code> starts at <code>left</code> and <code>j</code> at <code>right − 1</code>, and each inner loop <em>first</em> moves its pointer, then tests. So the first elements examined are <code>left + 1</code> and <code>right − 2</code>, as in the plan, and after every swap both pointers move on. (The slide code writes this differently; see §3.6.)</li>
        <li><b>The cutoff.</b> For tiny ranges the recursion overhead is larger than the work, and insertion sort, which is fast on small or nearly-sorted arrays, wins. The test <code>left + CUTOFF &lt;= right</code> means “the range has more than <code>CUTOFF</code> elements”. <code>CUTOFF</code> must be at least 2: on a 2-element range <code>j</code> would start at <code>left</code> and <code>--j</code> would step outside the range. Weiss uses 10.</li>
        <li><b>Stop on equal keys.</b> Both inner loops stop on elements <em>equal</em> to the pivot (they test <code>&lt;</code> and <code>&gt;</code>, not <code>&lt;=</code> and <code>&gt;=</code>). This causes some unnecessary swaps when there are duplicates, but it makes <code>i</code> and <code>j</code> meet in the middle of a run of equal keys, so an array of all-equal elements is split evenly and still sorts in ${M("O(n log n)")}. Skipping equal keys would let <code>i</code> run all the way to the right: a ${M("Θ(n²)")} split.</li></ul>` },
      { id: "example", title: "Example", html: `
        <p>The slides' example, <code>8 1 4 9 6 3 5 2 7 0</code>, with a print after each step of the first partition:</p>
        ${prog("median3Trace")}
        <ol><li><code>i</code> skips 1 and 4 and stops at 9 (index 3); <code>j</code> stops at once at 2 (index 7), which is smaller than 6. They have not crossed: swap 9 and 2.</li>
        <li><code>i</code> skips 2 and stops at 7 (index 4); <code>j</code> skips 9 and stops at 5 (index 6). Swap 7 and 5.</li>
        <li><code>i</code> skips 5 and 3 and stops at 7 (index 6); <code>j</code> skips 7 and stops at 3 (index 5). Now <code>i &gt; j</code>: the pointers have crossed. Swap <code>a[i] = 7</code> with the pivot at index 8.</li></ol>
        <p>The pivot 6 is at index 6, with <code>0 1 4 2 5 3</code> (all smaller) on its left and <code>9 7 8</code> (all larger) on its right. The two sides are then sorted recursively.</p>
        ${demo("medianPartition", "Demo 4 · median3 and the i/j scan", "← → keys step", "Every test of an inner loop is one step. Dots mark the three samples; teal cells are already on the small side, amber cells on the large side.")}` },
      { id: "exercise", title: "Exercise: sort 5, 7, 4, 1, 0, 2, 9", html: `
        <p>The slides start this one and leave the rest to you. Selecting the pivot: the samples are <code>a[0] = 5</code>, <code>a[3] = 1</code> and <code>a[6] = 9</code>; <code>median3</code> swaps 5 and 1, giving <code>1, 7, 4, 5, 0, 2, 9</code>, so <b>5</b> is the pivot. Then it hides 5 at index 5: <code>1, 7, 4, 2, 0, 5, 9</code>.</p>
        ${predict("Finish the first partition by hand: where do <code>i</code> and <code>j</code> stop, and where does 5 end up?",
          `<p><code>i</code> stops at 7 (index 1) and <code>j</code> at 0 (index 4): swap. Then <code>i</code> skips 4 and 2 and stops at 7 (index 4), <code>j</code> stops at 2 (index 3): crossed, so the pivot goes to index 4: <code>1, 0, 4, 2, 5, 7, 9</code>.</p>`)}
        <p>Here is the whole sort with a print in every call (with <code>CUTOFF = 3</code>), followed by a check that <code>sort</code> also handles the first example:</p>
        ${prog("medianSortTrace")}
        <p>The left part <code>1 0 4 2</code> has 4 elements, more than the cutoff, so it is partitioned again (median of 1, 0, 2 is 1); every other range is small enough for insertion sort.</p>
        ${demo("medianSort", "Demo 5 · The whole median-of-three sort", "one call per step", "The call stack shows which ranges are still waiting. Small ranges go to insertion sort.")}` },
      { id: "stuck", title: "Pitfall: the slides' loop on duplicates", html: `
        ${callout("pitfall", "PITFALL · THE SLIDE VERSION OF THE PARTITION LOOP CAN RUN FOREVER", `<p>The slides start with <code>i = left + 1, j = right − 2</code> and write the inner loops as <code>while (a[i] &lt; pivot) {i++;}</code> and <code>while (a[j] &gt; pivot) {j--;}</code>, so after a swap neither pointer moves unless the swapped values make it move:</p>
        ${codeBlock(CODE.slideLoop)}
        <p>With distinct elements that is fine (after a swap, <code>a[i] &lt; pivot</code> and <code>a[j] &gt; pivot</code>, so both loops move on). But if <code>a[i]</code> and <code>a[j]</code> are both <b>equal to the pivot</b>, the swap changes nothing, both loops stop at once, and the same swap happens again, forever. All-equal data triggers it:</p>
        ${prog("slideLoopStuck")}
        <p>The fix is the one in <code>MedianQuickSort</code>: move the pointers before testing (<code>a[++i]</code>, <code>a[--j]</code>, starting from <code>i = left</code>, <code>j = right − 1</code>), or add <code>i++; j--;</code> after the swap. For distinct keys both forms do exactly the same steps.</p>`)}
        <p>See it in Demo 4: choose the example <code>5, 5, 5, 5, 5</code> and switch to “the slides' loop”. With the fixed loop the same input needs one swap, then the pointers cross in the middle.</p>` },
    ],
    takeaways: ["Pivot = median of first, center, last.", "i and j meet; swap misplaced pairs; stop on equal keys.", "Small ranges: insertion sort."],
  },
  {
    slug: "4-analysis", nav: "Running time", title: "Running Time of Quicksort",
    subtitle: "Worst, best, in between, and expected",
    abstract: "Everything depends on how evenly the pivots split the ranges. Random pivots split well enough on every input: 2(n+1)Hₙ − 4n comparisons in expectation.",
    tags: ["Θ(n²) worst", "Θ(n log n) best", "indicator variables"],
    hero: "splitMini", heroCaption: "A 9-to-1 split: each row of the recursion tree still costs at most n.",
    sections: [
      { id: "video-4", title: "Watch: Running time, stability and the lower bound", html: `
        <div class="card video" data-video="media/L11-4.mp4"></div>` },
      { id: "worst", title: "Worst case", html: `
        <p>Partition on a range of ${M("m")} elements compares each of the other ${M("m − 1")} elements with the pivot once, so it costs ${M("Θ(m)")}. The total cost depends on how evenly the pivots split the ranges.</p>
        <p>The worst split is <b>maximally unbalanced</b>: one side is empty and the other has all the remaining ${M("n − 1")} elements. That happens when the pivot is the smallest or the largest value, e.g. when the last element is always used as the pivot and the input is already sorted. If it happens at every level,</p>
        ${MB("T(n) = T(n − 1) + T(0) + Θ(n), &nbsp; T(1) = Θ(1)")}
        <p>and the recursion tree is a path of depth ${M("n")} whose levels cost ${M("n, n − 1, n − 2, …, 2")}:</p>
        ${MB("T(n) = Σ<sub>k=1</sub><sup>n</sup> k = n(n + 1)/2 = Θ(n²)")}
        ${callout("note", "NOTE", `<p>The slides write the recurrence as ${M("T(n) = T(1) + T(n − 1) + n")}, “one region has one element and the other has ${M("n − 1")}”. With the partitions of this lecture the pivot is not part of either region, so the worst split is ${M("0")} and ${M("n − 1")}; either way ${M("T(n) = T(n − 1) + Θ(n) = Θ(n²)")}.</p>`)}` },
      { id: "best", title: "Best case", html: `
        <p>The best split is <b>balanced</b>: both sides have about ${M("n/2")} elements. Then</p>
        ${MB("T(n) = 2T(n/2) + Θ(n)")}
        <p>the same recurrence as merge sort. The recursion tree has ${M("log₂ n")} levels, each costing ${M("n")} in total, so ${M("T(n) = Θ(n log n)")}.</p>` },
      { id: "nine", title: "Between the two: a 9-to-1 split", html: `
        <p>Suppose every partition puts 10% of the elements on one side and 90% on the other — a split that looks quite bad. Then</p>
        ${MB("Q(n) = Q(9n/10) + Q(n/10) + n")}
        <p>In the recursion tree, every full level costs ${M("n")} (each level splits the same ${M("n")} elements into smaller pieces); deeper levels, where some branches have already ended, cost at most ${M("n")}. The <b>shortest</b> root-to-leaf path keeps taking the 1/10 side and ends after ${M("log<sub>10</sub> n")} levels; the <b>longest</b> keeps taking the 9/10 side and ends after ${M("log<sub>10/9</sub> n")} levels. So</p>
        ${MB("n log<sub>10</sub> n &nbsp;≤&nbsp; Q(n) &nbsp;≤&nbsp; n (log<sub>10/9</sub> n + 1)")}
        <p>Both bounds are constants times ${M("n log n")} (${M("log<sub>10/9</sub> n ≈ 21.9 log<sub>10</sub> n")}), so ${M("Q(n) = Θ(n log n)")}. The same argument works for any constant proportion, 99-to-1 included: <b>any split by a constant fraction gives Θ(n log n)</b>; only splits that peel off a constant <em>number</em> of elements per level are quadratic.</p>
        ${demo("split", "Demo 6 · Recursion trees, level by level", "pick a split and n, then step", "Each row is one level of the recursion tree; each bar is one subproblem, as wide as its size. Compare the depth and the total for the three splits.")}` },
      { id: "expected", title: "Expected running time", html: `
        <p>The running time of quicksort is dominated by the comparisons in partition, and <b>elements are only ever compared with a pivot</b>. So we count comparisons.</p>
        <p>Let ${M("e<sub>1</sub> &lt; e<sub>2</sub> &lt; … &lt; e<sub>n</sub>")} be the elements in sorted order (${M("e<sub>x</sub>")} is the ${M("x")}-th smallest). When are ${M("e<sub>i</sub>")} and ${M("e<sub>j</sub>")} (with ${M("i &lt; j")}) compared?</p>
        <ul><li>Until some element of ${M("{e<sub>i</sub>, e<sub>i+1</sub>, …, e<sub>j</sub>}")} is chosen as a pivot, all of these elements stay together in the same range (a pivot outside them sends all of them to the same side).</li>
        <li>If the first pivot chosen from this set is some ${M("e<sub>k</sub>")} strictly <b>between</b> them, then ${M("e<sub>i</sub>")} goes left and ${M("e<sub>j</sub>")} goes right, and they are <b>never compared</b>.</li>
        <li>If the first pivot chosen from this set is ${M("e<sub>i</sub>")} or ${M("e<sub>j</sub>")} itself, the two <b>are compared</b> (in that partition), exactly once, since a pivot is compared with everything in its range and is never compared again afterwards.</li></ul>
        ${callout("pattern", "OBSERVATION", `<p>${M("e<sub>i</sub>")} and ${M("e<sub>j</sub>")} are compared if and only if one of them is the first among ${M("e<sub>i</sub>, e<sub>i+1</sub>, …, e<sub>j</sub>")} to be picked as a pivot.</p>`)}
        <p>Every element of this set of ${M("j − i + 1")} elements is equally likely to be the first one picked, so</p>
        ${MB("Pr[e<sub>i</sub> and e<sub>j</sub> are compared] = 2 / (j − i + 1)")}
        <p>Neighbours (${M("j = i + 1")}) are always compared (probability 1: nothing lies between them to separate them). The smallest and the largest element are compared only if one of them is the very first pivot: probability ${M("2/n")}.</p>
        ${demo("pairs", "Demo 7 · Are e<sub>i</sub> and e<sub>j</sub> compared?", "pick i and j, then step", "The cells are the elements in sorted order. Every range quicksort works on is a block of neighbours here. The verdict comes from the first pivot that lands in e<sub>i</sub>..e<sub>j</sub>.")}
        <p>A simulation in Java agrees:</p>
        ${prog("pairCompared")}` },
      { id: "sum", title: "Adding it up: indicator random variables", html: `
        <p>Define ${M("X<sub>i,j</sub> = 1")} if ${M("e<sub>i</sub>")} and ${M("e<sub>j</sub>")} are compared and ${M("X<sub>i,j</sub> = 0")} otherwise. Then</p>
        ${MB("E[X<sub>i,j</sub>] = 1 · Pr[X<sub>i,j</sub> = 1] + 0 · Pr[X<sub>i,j</sub> = 0] = 2 / (j − i + 1)")}
        <p>Each pair is compared at most once, so the total number of comparisons is ${M("X = Σ<sub>1≤i&lt;j≤n</sub> X<sub>i,j</sub>")}, and by <b>linearity of expectation</b> (the expectation of a sum is the sum of the expectations, even when the terms are dependent)</p>
        ${MB("E[X] = Σ<sub>1≤i&lt;j≤n</sub> E[X<sub>i,j</sub>] = Σ<sub>1≤i&lt;j≤n</sub> 2 / (j − i + 1)")}
        <p>Group the pairs by their distance ${M("x = j − i")}. Distance 1 has the ${M("n − 1")} pairs ${M("(1,2), (2,3), …, (n−1, n)")}; in general distance ${M("x")} has ${M("n − x")} pairs. So</p>
        ${MB("E[X] = 2 Σ<sub>x=1</sub><sup>n−1</sup> (n − x)/(x + 1) = 2 Σ<sub>x=1</sub><sup>n−1</sup> ((n + 1) − (x + 1))/(x + 1) = 2(n + 1) Σ<sub>x=1</sub><sup>n−1</sup> 1/(x + 1) − 2(n − 1)")}
        <p>The sum is the <b>harmonic series</b> without its first term: ${M("Σ<sub>x=1</sub><sup>n−1</sup> 1/(x+1) = H<sub>n</sub> − 1")}, where ${M("H<sub>n</sub> = 1 + 1/2 + … + 1/n = ln n + O(1) = O(log n)")}. Hence</p>
        ${MB("E[X] = 2(n + 1)(H<sub>n</sub> − 1) − 2(n − 1) = 2(n + 1)H<sub>n</sub> − 4n = O(n log n)")}
        <p>and the expected running time of randomized quicksort is ${M("O(n log n)")}. (More precisely, ${M("E[X] ≈ 2n ln n ≈ 1.39 n log₂ n")}.)</p>
        ${callout("note", "NOTE · EXPECTED TIME HOLDS FOR EVERY INPUT", `<p>The expectation is over the algorithm's own random pivot choices, not over the input. No input is bad for randomized quicksort; only unlucky coin flips are, and they are very unlikely. Compare a deterministic “last element as pivot” quicksort: it is ${M("O(n log n)")} <em>on average over random inputs</em>, but an adversary, or simply an already-sorted file, makes it quadratic every time.</p>`)}
        <p>The counts below compare the two pivot rules on <b>sorted</b> input:</p>
        ${prog("countComparisons")}
        <p>The last-element rule makes exactly ${M("n(n − 1)/2")} comparisons on sorted input (499,500 for ${M("n = 1000")}). The random rule averages close to ${M("2(n+1)H<sub>n</sub> − 4n")} — about 46 times fewer for ${M("n = 1000")}, and the gap grows with ${M("n")}.</p>
        ${demo("race", "Demo 8 · Counting comparisons", "drag n, change the input", "Sorted and reversed inputs ruin the last-element rule; the random rule does not care. Try “all equal” to see Exercise 2 of the last chapter.")}
        ${predict("Which pivot rule turns sorted input into the worst case: (a) last element, (b) random, (c) median of first, center and last?",
          `<p>Only (a). With (c), on sorted input the median of the three samples is the center element, the true median, so every split is perfectly balanced. Median-of-three is not worst-case-proof, though: specially constructed inputs can still force ${M("Θ(n²)")}. Only randomization removes bad inputs altogether (in expectation).</p>`)}` },
    ],
    takeaways: ["Worst Θ(n²), best Θ(n log n).", "Any constant-fraction split: Θ(n log n).", "Random pivot: E[comparisons] = 2(n+1)Hₙ − 4n."],
  },
  {
    slug: "5-compare", nav: "Comparison", title: "Comparing Sorts, and a Lower Bound",
    subtitle: "Stability, extra space, and the n log n barrier",
    abstract: "Quicksort is in place but not stable. And no comparison sort, however clever, can beat Ω(n log n) comparisons in the worst case.",
    tags: ["stable", "decision tree", "log₂(n!)"],
    hero: "decisionMini", heroCaption: "Sorting three keys: every path is at most 3 comparisons.",
    sections: [
      { id: "table", title: "Comparison of sorting algorithms", html: `
        <p>A sorting algorithm is <b>stable</b> if two elements with equal keys appear in the output in the same order as in the input. Stability matters when you sort records by one field after another (e.g. sort students by name, then stably by grade: students with the same grade stay in name order).</p>
        <table><thead><tr><th>algorithm</th><th>stable</th><th>best</th><th>average</th><th>worst</th><th>extra space</th></tr></thead><tbody>
        <tr><td>bubble sort</td><td>yes</td><td>O(n)</td><td>O(n²)</td><td>O(n²)</td><td>O(1)</td></tr>
        <tr><td>insertion sort</td><td>yes</td><td>O(n)</td><td>O(n²)</td><td>O(n²)</td><td>O(1)</td></tr>
        <tr><td>selection sort</td><td>no</td><td>O(n²)</td><td>O(n²)</td><td>O(n²)</td><td>O(1)</td></tr>
        <tr><td>merge sort</td><td>yes</td><td>O(n log n)</td><td>O(n log n)</td><td>O(n log n)</td><td>O(n)</td></tr>
        <tr><td><b>quicksort</b></td><td>no</td><td>O(n log n)</td><td>O(n log n)</td><td>O(n²)</td><td>O(1) array space (O(log n) expected stack)</td></tr></tbody></table>
        <p>(Bubble sort's ${M("O(n)")} best case assumes the version that stops after a pass with no swaps.)</p>
        ${callout("note", "NOTE · QUICKSORT'S EXTRA SPACE", `<p>Partition works in place, so quicksort needs no extra array: ${M("O(1)")} apart from the recursion. The recursion stack itself holds one frame per pending call: ${M("O(log n)")} deep in expectation, but ${M("n")} deep in the worst case. Recursing on the smaller side first and looping on the larger side keeps it ${M("O(log n)")} always.</p>`)}` },
      { id: "stability", title: "Quicksort is not stable", html: `
        <p>A partition swap can carry an element over other elements with the same key. The slides' example, sorting <code>5, 1, 2, 1*</code> (the star only marks the second 1) with the last element as the pivot:</p>
        ${prog("stabilityDemo")}
        <p>The pivot is <code>1*</code>. No key is smaller than 1, so <code>next</code> stays 0, and the final swap sends <code>1*</code> to the front, in front of the other 1. A stable sort would output <code>1 1* 2 5</code>.</p>
        ${demo("stability", "Demo 9 · Watch the order of equal keys", "edit the items, then step", "Mark copies of a key with letters or stars, e.g. <code>3a 1 3b 2 3c</code>. The last step says whether equal keys kept their order.")}
        ${callout("pitfall", "PITFALL", `<p><b>“Quicksort is O(n log n).”</b> Only in expectation (randomized pivot) or on average (fixed pivot rule, random input). Its worst case is ${M("Θ(n²)")}. If you need a guaranteed ${M("O(n log n)")} worst case, or stability, use merge sort.</p>`)}` },
      { id: "lower", title: "How fast can we sort?", html: `
        <p><em>The slides keep this part as extra material (hidden slides); it answers the obvious next question.</em></p>
        <p>We have algorithms with ${M("O(n²)")} and ${M("O(n log n)")} worst-case time. Can we do better, say ${M("O(n)")}? Not if the only thing the algorithm may do with keys is <b>compare</b> them (<code>&lt;</code>, <code>&gt;</code>, <code>=</code>, …). Insertion sort, merge sort, quicksort, bubble sort and selection sort are all <b>comparison sorts</b>.</p>
        ${callout("pattern", "THEOREM", `<p>Every comparison-based sorting algorithm makes ${M("Ω(n log n)")} comparisons in the worst case.</p>`)}
        <p><b>Permutations.</b> An array of ${M("n")} distinct keys can be in any of ${M("n!")} orders. For ${M("n = 3")} there are ${M("3! = 6")}: <code>A[1] A[2] A[3]</code>, <code>A[1] A[3] A[2]</code>, <code>A[2] A[1] A[3]</code>, <code>A[2] A[3] A[1]</code>, <code>A[3] A[1] A[2]</code>, <code>A[3] A[2] A[1]</code>. Sorting is the same as finding out which of the ${M("n!")} permutations puts the input in order.</p>
        <p><b>Decision trees.</b> Fix a comparison sort and an input size ${M("n")}. Its behaviour is described by a <b>decision tree</b>: each internal node is one comparison of two keys, such as ${M("a<sub>1</sub> &lt; a<sub>2</sub>")}?; the two edges below it are the answers yes and no; each leaf is a final answer (a sorted order). Running the algorithm on an input is following one path from the root to a leaf, and the number of comparisons is the length of that path. Each answer cuts down the set of permutations still consistent with what has been seen. For ${M("n = 3")} (keys ${M("a, b, c")}; insertion sort's tree):</p>
        ${demo("decision", "Demo 10 · A decision tree for three keys", "pick an input, then step", "Each answer crosses out the orders it rules out. Every input reaches a leaf after at most 3 comparisons.")}
        ${callout("pattern", "THEOREM", `<p>Any decision tree that sorts ${M("n")} distinct keys has height at least ${M("log₂(n!)")}.</p>`)}
        <p><em>Proof.</em> The algorithm must be able to give each of the ${M("n!")} possible orders as its answer, so the tree has at least ${M("n!")} leaves. A binary tree of height ${M("h")} has at most ${M("2<sup>h</sup>")} leaves. So ${M("2<sup>h</sup> ≥ n!")}, i.e. ${M("h ≥ log₂(n!)")}. ∎</p>
        <p>The height is the worst-case number of comparisons. Finally, ${M("log₂(n!) = Θ(n log n)")}: on one side ${M("n! ≤ n<sup>n</sup>")}, so ${M("log₂(n!) ≤ n log₂ n")}; on the other, the largest ${M("n/2")} factors of ${M("n!")} are each at least ${M("n/2")}, so ${M("n! ≥ (n/2)<sup>n/2</sup>")} and ${M("log₂(n!) ≥ (n/2) log₂(n/2) = Ω(n log n)")}. Therefore every comparison sort needs ${M("Ω(n log n)")} comparisons in the worst case, and merge sort (and randomized quicksort, in expectation) are optimal up to a constant factor.</p>
        ${prog("lowerBound")}
        <p>Three keys need 3 comparisons in the worst case (and the tree above achieves it); 1,000 keys need at least 8,530. Algorithms that beat ${M("n log n")}, such as counting sort and radix sort (next lecture), do so by looking at the keys' digits instead of only comparing them.</p>` },
    ],
    takeaways: ["Quicksort: in place, not stable.", "A decision tree has ≥ n! leaves.", "Comparison sorts need Ω(n log n)."],
  },
  {
    slug: "6-summary", nav: "Summary", title: "Summary and Practice",
    subtitle: "Check yourself, then partition some arrays",
    abstract: "A one-page map of the lecture, six self-check questions, and seven exercises with solutions.",
    tags: ["knowledge map", "self-check", "exercises"],
    hero: "toc",
    sections: [
      { id: "map", title: "Knowledge map", html: `<div class="map">
        <div class="card"><h3>Randomized algorithms</h3><ul><li><code>random(x, y)</code>: uniform integer</li><li>Cost is a random variable</li><li>Measure <b>E[X]</b>; flipCoin: 4</li></ul></div>
        <div class="card"><h3>Quicksort</h3><ul><li>Pick a pivot, <b>partition</b>, recurse</li><li>Pivot ends in its final place</li><li>No combine step; <b>in place</b></li></ul></div>
        <div class="card"><h3>Lomuto partition</h3><ul><li>Park the pivot at <code>right</code></li><li>Small values swap to <code>nextSmallPos</code></li><li>Return = number of smaller values + left</li></ul></div>
        <div class="card"><h3>Median-of-three</h3><ul><li>Median of first, center, last at <code>right − 1</code></li><li><code>i</code>, <code>j</code> meet; stop on equal keys</li><li>Cutoff to insertion sort</li></ul></div>
        <div class="card"><h3>Running time</h3><ul><li>Worst Θ(n²): split 0 / n − 1</li><li>Best and any constant fraction: Θ(n log n)</li><li>Random: Pr = 2/(j−i+1), E = 2(n+1)Hₙ − 4n</li></ul></div>
        <div class="card"><h3>The big picture</h3><ul><li>Merge sort: stable, O(n) extra</li><li>Quicksort: faster, not stable</li><li>Any comparison sort: Ω(n log n)</li></ul></div></div>` },
      { id: "check", title: "Check your understanding", html: `<div data-demo="quiz"><div class="demo-body"></div></div>` },
      { id: "exercises", title: "Exercises", html: `
        <h3>Exercise 1 ★</h3>
        <p>Apply <code>Partition.partition</code> to <code>[3, 8, 2, 5, 1, 4, 7, 6]</code> with pivot index 5. Give the array after each step and the return value.</p>
        <details class="reveal"><summary>Solution</summary><p><code>pivotVal = 4</code>; park it: <code>[3, 8, 2, 5, 1, 6, 7, 4]</code>. <code>j = 0</code>: 3 small, swap with itself, <code>nextSmallPos = 1</code>. <code>j = 1</code>: 8 large. <code>j = 2</code>: 2 small, swap with 8: <code>[3, 2, 8, 5, 1, 6, 7, 4]</code>, <code>nextSmallPos = 2</code>. <code>j = 3</code>: 5 large. <code>j = 4</code>: 1 small, swap with 8: <code>[3, 2, 1, 5, 8, 6, 7, 4]</code>, <code>nextSmallPos = 3</code>. <code>j = 5, 6</code>: 6 and 7 large. Pivot home: swap <code>arr[3]</code> and <code>arr[7]</code>: <code>[3, 2, 1, 4, 8, 6, 7, 5]</code>; return <b>3</b>. (Check it in Demo 2: it is one of the examples.)</p></details>
        <h3>Exercise 2 ★</h3>
        <p>What does the Lomuto partition return on <code>[7, 7, 7, 7, 7]</code> (any pivot)? What does that mean for the running time of <code>RandomizedQuickSort</code> on an array of ${M("n")} equal values?</p>
        <details class="reveal"><summary>Solution</summary><p>No value is <em>smaller</em> than 7, so <code>nextSmallPos</code> stays at <code>left</code> and partition returns 0. Every partition puts all remaining elements on the right: the worst split, so ${M("Θ(n²)")} even with random pivots. The fix is a partition that splits equal keys evenly (like <code>MedianQuickSort</code>, which stops on equal keys) or a three-way partition (<code>&lt; pivot</code>, <code>== pivot</code>, <code>&gt; pivot</code>).</p></details>
        <h3>Exercise 3 ★</h3>
        <p>Change <code>Partition</code> so that quicksort sorts in <b>descending</b> order.</p>
        <details class="reveal"><summary>Solution</summary><p>Change the test to <code>arr[j] &gt; pivotVal</code>: larger values go to the left part.</p></details>
        <h3>Exercise 4 ★★</h3>
        <p>Trace <code>MedianQuickSort.median3</code> on <code>[3, 1, 2]</code> (left = 0, right = 2). Which value is the pivot, and where does it end up?</p>
        <details class="reveal"><summary>Solution</summary><p>center = 1. <code>a[1] = 1 &lt; a[0] = 3</code>: swap → <code>[1, 3, 2]</code>. <code>a[2] = 2 &lt; a[0] = 1</code>? No. <code>a[2] = 2 &lt; a[1] = 3</code>: swap → <code>[1, 2, 3]</code>. Then swap <code>a[center]</code> with <code>a[right − 1]</code>, which is the same position, so nothing changes. The pivot is 2, at index 1. (With <code>CUTOFF = 3</code> the real <code>quicksort</code> sends this range to insertion sort instead.)</p></details>
        <h3>Exercise 5 ★★</h3>
        <p>In a run of randomized quicksort on ${M("n = 100")} distinct keys, what is the probability that the smallest and the second smallest key are compared? The smallest and the largest? What is the expected number of comparisons in which the smallest key takes part?</p>
        <details class="reveal"><summary>Solution</summary><p>${M("2/(2 − 1 + 1) = 1")}; ${M("2/100 = 0.02")}. The smallest key ${M("e<sub>1</sub>")} is compared with ${M("e<sub>j</sub>")} with probability ${M("2/j")}, so the expected number is ${M("Σ<sub>j=2</sub><sup>100</sup> 2/j = 2(H<sub>100</sub> − 1) ≈ 8.37")}.</p></details>
        <h3>Exercise 6 ★★★ (quickselect)</h3>
        <p>To find the ${M("k")}-th smallest value we don't need to sort: after one partition, the pivot's index ${M("p")} tells us whether the answer is the pivot (${M("p = k − 1")}), in the left part (${M("k − 1 &lt; p")}) or in the right part. Recurse (or loop) on <b>one</b> side only. Write it, using <code>Partition</code>.</p>
        <details class="reveal"><summary>Solution</summary><p>The expected running time is ${M("O(n)")}: the expected range sizes shrink geometrically, ${M("n + ¾n + (¾)²n + …")} in a rough analysis.</p>${prog("quickSelect")}</details>
        <h3>Exercise 7 ★★</h3>
        <p>Why must <code>CUTOFF</code> in <code>MedianQuickSort</code> be at least 2? What goes wrong on a range of two elements?</p>
        <details class="reveal"><summary>Solution</summary><p>With two elements, <code>center = left</code> and <code>right − 1 = left</code>. After <code>median3</code>, <code>i = left</code> and <code>j = right − 1 = left</code>. <code>a[++i]</code> looks at <code>a[right]</code>, fine; but <code>a[--j]</code> looks at <code>a[left − 1]</code>, which is outside the range, and outside the array when <code>left = 0</code> (<code>ArrayIndexOutOfBoundsException</code>). With <code>CUTOFF ≥ 2</code> every partitioned range has at least 3 elements, and the sentinel <code>a[left]</code> stops <code>j</code> in time.</p></details>` },
      { id: "terms", title: "Key terms and further reading", html: `
        <p class="tags">${["deterministic algorithm", "randomized algorithm", "uniformly at random", "expected running cost", "pivot", "partition", "Lomuto partition", "in place", "median-of-three", "sentinel", "cutoff", "worst / best split", "recursion tree", "indicator random variable", "linearity of expectation", "harmonic series", "stable sort", "comparison sort", "decision tree", "lower bound"].map((t) => `<span class="tag">${t}</span>`).join("")}</p>
        <ul><li>M. A. Weiss, <em>Data Structures and Algorithm Analysis in Java</em>, Chapter 7 (quicksort is §7.7).</li>
        <li>T. H. Cormen et al., <em>Introduction to Algorithms</em>, Chapter 7 (Quicksort) and §8.1 (lower bounds for sorting).</li>
        <li>The <em>Comparison Sorting Visualization</em> at USFCA: <a href="https://www.cs.usfca.edu/~galles/visualization/ComparisonSort.html" target="_blank" rel="noopener">cs.usfca.edu/~galles/visualization</a></li></ul>` },
    ],
    takeaways: ["Partition, then recurse.", "Random pivots: O(n log n) expected on every input.", "Ω(n log n) for any comparison sort."],
  },
];

const QUIZ = [
  { q: "After <code>Partition.partition(arr, 0, 6, 3)</code> on <code>[4, 2, 3, 6, 9, 5, 7]</code>, which statement is true?",
    opts: ["The whole array is sorted", "6 is at index 4, and it will never move again during quicksort", "6 is at index 3, where it started", "The left part is sorted"],
    a: 1, why: "The result is <code>[4, 2, 3, 5, 6, 7, 9]</code>. Only the pivot is guaranteed to be in its final place; the parts are not sorted yet (<code>4 2 3 5</code> isn't)." },
  { q: "What does <code>partition</code> return on <code>[10, 80, 30, 90, 40]</code> with the pivot at index 4?",
    opts: ["1", "2", "3", "4"],
    a: 1, why: "Two values (10 and 30) are smaller than 40, so 40 goes to index 2: <code>[10, 30, 40, 90, 80]</code>." },
  { q: "Why do we analyse the <b>expected</b> running cost of a randomized algorithm instead of its worst case?",
    opts: ["Because the expected cost is always O(1)", "Because the worst case may be unbounded (e.g. flipCoin can flip 0 forever), even though it is extremely unlikely", "Because randomized algorithms have no worst case input", "Because the expected cost is easier to measure by experiment"],
    a: 1, why: "For flipCoin the cost can be arbitrarily large with tiny probability, so the worst case says nothing useful. E[X] = 4." },
  { q: "In randomized quicksort, what is the probability that the 2nd and the 7th smallest elements are compared?",
    opts: ["1/6", "2/6", "2/7", "1/3 · 1/2"],
    a: 1, why: "They are compared iff one of them is the first pivot picked among e<sub>2</sub>, …, e<sub>7</sub>: 2 / (7 − 2 + 1) = 2/6 = 1/3." },
  { q: "Every partition splits 99 : 1. What is the running time?",
    opts: ["Θ(n²), because the split is so unbalanced", "Θ(n log n): every level costs at most n and there are O(log n) levels", "Θ(n)", "It depends on the input"],
    a: 1, why: "Any split by a constant fraction gives depth log<sub>100/99</sub> n = O(log n), with at most n work per level." },
  { q: "Which statement about sorting is correct?",
    opts: ["Quicksort is stable", "Merge sort sorts in place", "A comparison sort can sort n keys with O(n) comparisons in the worst case if it is clever enough", "Any decision tree for sorting n keys has at least n! leaves, so height ≥ log₂(n!)"],
    a: 3, why: "Quicksort is not stable (5, 1, 2, 1* → 1*, 1, 2, 5); merge sort needs an O(n) array; and the decision-tree argument rules out o(n log n) comparisons." },
];
