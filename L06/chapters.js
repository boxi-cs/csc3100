// Chapter content, adapted from notes/L06-divide-and-conquer.md. Code and outputs come from CODE / OUT in demos.js.

const demo = (name, title, instr, hint = "") =>
  `<div class="card demo" data-demo="${name}"><div class="head"><span class="title">${title}</span><span>${instr}</span></div>
   <div class="demo-body"></div>${hint ? `<p class="hint">${hint}</p>` : ""}</div>`;

const callout = (kind, label, body) => `<div class="callout ${kind}"><b>${label}</b>${body}</div>`;
const predict = (q, a) => callout("predict", "PREDICT", `<p>${q}</p><details class="reveal"><summary>Show the answer</summary>${a}</details>`);
const out = (key) => codeBlock(OUT[key], "out");
const table = (head, rows) => `<div style="overflow-x:auto"><table><thead><tr>${head.map((h) => `<th>${h}</th>`).join("")}</tr></thead>
  <tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
const mb = (html) => `<div class="math-block" style="overflow-x:auto">${html}</div>`;
const M = (html) => `<span class="math">${html}</span>`;

const LECTURE = {
  number: 6,
  title: "Divide and Conquer, Recursion",
  tagline: "What a recursive algorithm costs",
  lead: "Recurrences, unrolling, recursion trees, the substitution method and the master theorem — then the maximum subarray problem, solved in O(n log n). Every recursion tree here can be grown one call at a time.",
  heroDemo: "levelsMini",
  heroLabel: "A recursion tree, level by level · T(n) = 2T(n/2) + n",
  heroCaption: "Twice as many subproblems, each half the size: every level does the same work, n. With log₂ n levels that is O(n log n).",
  whyTitle: "Why this lecture matters",
  whySub: "Three ideas you will use for every algorithm that calls itself",
  why: [
    ["A cost that refers to itself", "A recursive call costs <b>T</b> of a smaller size. Writing that down gives a <b>recurrence</b>: an equation you can solve."],
    ["A picture that solves it", "A <b>recursion tree</b> adds the work level by level. Whether the levels grow, shrink or stay equal decides the answer."],
    ["A formula for most cases", "The <b>master theorem</b> turns <i>a</i>, <i>b</i> and <i>d</i> into a Big-Oh in one line — for merge sort, binary search, maximum subarray and more."],
  ],
  ctaTitle: "Ready to count what recursion costs?",
  minutes: "About 75–90 minutes",
  videos: {
    "media/L06-1.mp4": "Lecture 6 · Part 1 — Recurrences and binary search (11.1 min)",
    "media/L06-2.mp4": "Lecture 6 · Part 2 — Linear recursion and recursion trees (10.5 min)",
    "media/L06-3.mp4": "Lecture 6 · Part 3 — The master theorem (11.0 min)",
    "media/L06-4.mp4": "Lecture 6 · Part 4 — Maximum subarray (9.6 min)",
  },
};

const CHAPTERS = [
  {
    slug: "1-review", nav: "Review", title: "Asymptotic Notation, Reviewed",
    subtitle: "Big-Oh, Big-Omega, Big-Theta, and the two steps of a worst-case analysis",
    abstract: "Lecture 5 counted the operations of loops. Recursive methods contain one line we cannot count directly: the call to themselves. First, the tools we will need.",
    tags: ["O, Ω, Θ", "c and n₀", "worst case"],
    hero: "bigOhMini", heroCaption: "3n + 5 ≤ 4·n for every n ≥ 5, so 3n + 5 = O(n).",
    sections: [
      { id: "video-1", title: "Watch: Recurrences and binary search", html: `
        <div class="card video" data-video="media/L06-1.mp4"></div>` },
      { id: "notation", title: "Big-Oh, Big-Omega, Big-Theta", html: `
        <p>Let ${M("f(n)")} and ${M("g(n)")} be functions of the input size ${M("n")} with non-negative values.</p>
        <ul><li><b>Big-Oh (upper bound).</b> ${M("g(n) = O(f(n))")} if there are positive constants ${M("c")} and ${M("n<sub>0</sub>")} such that ${M("g(n) ≤ c · f(n)")} for all ${M("n ≥ n<sub>0</sub>")}.</li>
        <li><b>Big-Omega (lower bound).</b> ${M("g(n) = Ω(f(n))")} if there are positive constants ${M("c")} and ${M("n<sub>0</sub>")} such that ${M("g(n) ≥ c · f(n)")} for all ${M("n ≥ n<sub>0</sub>")}.</li>
        <li><b>Big-Theta (tight bound).</b> If ${M("g(n) = O(f(n))")} and ${M("g(n) = Ω(f(n))")}, then ${M("g(n) = Θ(f(n))")}.</li></ul>
        <p>For example, ${M("3n + 5 = O(n)")}: take ${M("c = 4")} and ${M("n<sub>0</sub> = 5")}, because ${M("3n + 5 ≤ 4n")} exactly when ${M("n ≥ 5")}. It is also ${M("Ω(n)")} with ${M("c = 3")}, so ${M("3n + 5 = Θ(n)")}. The constants need not be the smallest possible; we only need <em>some</em> pair that works.</p>
        ${demo("bigOh", "Demo 1 · Find c and n₀", "drag the sliders", "The shaded part is n ≥ n₀. A red dot marks the first n where g(n) is above c·f(n). For “n² vs 100n” no slider setting survives forever.")}
        ${predict(`Is ${M("n<sup>2</sup> = O(100n)")}?`, `<p>No. We would need ${M("n<sup>2</sup> ≤ c · 100n")}, that is ${M("n ≤ 100c")}, for <b>all</b> ${M("n ≥ n<sub>0</sub>")}. Whatever ${M("c")} we choose, it fails once ${M("n &gt; 100c")}. The other way round, ${M("100n = O(n<sup>2</sup>)")} holds with ${M("c = 1")}, ${M("n<sub>0</sub> = 100")}.</p>`)}` },
      { id: "steps", title: "The two steps of a worst-case analysis", html: `
        <ol><li><b>Count.</b> Find the number of basic operations the algorithm executes <b>in the worst case</b>, as a function ${M("T(n)")} of the input size. A <em>basic operation</em> takes constant time: an assignment, a comparison, an arithmetic operation, an array access, a <code>return</code>.</li>
        <li><b>Bound.</b> Describe ${M("T(n)")} with Big-Oh and Big-Omega, and give Big-Theta if you can. In most cases an upper bound, Big-Oh, is what we want.</li></ol>
        <p>For <b>linear search</b> in ${M("n")} elements the worst case is a missing key: ${M("n")} comparisons, ${M("T(n) = c<sub>1</sub>n + c<sub>2</sub> = Θ(n)")}. For <b>binary search</b> the loop halves the range each time: about ${M("log<sub>2</sub> n")} rounds, ${M("Θ(log n)")}. Both came from loops. In this lecture the algorithms are recursive, and the count contains a call we cannot count line by line — yet.</p>` },
    ],
    takeaways: ["O: ≤ c·f(n) for all n ≥ n₀.", "Θ = O and Ω together.", "Count the worst case, then bound it."],
  },
  {
    slug: "2-recurrences", nav: "Recurrences", title: "Recurrences: the Cost of Binary Search",
    subtitle: "A cost written in terms of itself, and how to unroll it",
    abstract: "Every line of recursive binary search costs a constant, except the recursive call. That call is a binary search on half the range, so it costs T(n/2). The result is a recurrence: T(n) = T(n/2) + a.",
    tags: ["recurrence", "unrolling", "T(n) = T(n/2) + a", "a cautionary tale"],
    hero: "searchMini", heroCaption: "binarySearch for 135: four calls on ranges of 8, 4, 2 and 1 elements.",
    sections: [
      { id: "code", title: "Recursive binary search", html: `
        <p>The array is sorted. To look for <code>key</code> in <code>arr[left..right]</code>, compare it with the middle element. Equal: done. Middle smaller than the key: the key can only be in the right half. Otherwise it can only be in the left half. Search that half the same way.</p>
        ${codeBlock(CODE.binarySearchClass)}
        ${codeBlock(CODE.searchDemo)}
        ${predict("Which keys need the most calls? How many calls can an array of 8 elements need at most?", `${out("searchDemo")}
          <p>For 100: 0..7 (middle 3, 6 &lt; 100) → 4..7 (middle 5, 78 &lt; 100) → 6..7 (middle 6): found, 3 calls. For the missing 7: 0..7 → 4..7 (78 &gt; 7) → 4..4, one element, 16 ≠ 7: 3 calls. For 135: 0..7 → 4..7 → 6..7 → 7..7: <b>4 calls</b>, the most an array of 8 can need.</p>`)}
        ${demo("binarySearch", "Demo 2 · Step through binarySearch", "← → keys step", "Each frame on the stack handles about half the range of the one below it. Tick “slide's version” to watch the missing base case go wrong.")}` },
      { id: "tale", title: "A cautionary tale", html: `
        <p>Binary search is famously easy to get wrong. Knuth records that the first binary search was published in 1946, but the first version correct for every ${M("n")} only in 1962. Jon Bentley found that only about 10% of the professional programmers he asked could write a correct one. In 2006 Joshua Bloch reported a bug that had sat for years in Java's own <code>Arrays.binarySearch</code> (and in Bentley's book): <code>(left + right) / 2</code> overflows when <code>left + right</code> exceeds <code>Integer.MAX_VALUE</code>. Writing <code>left + (right - left) / 2</code> gives the same value without the overflow.</p>
        <p>The version on the slides has its own awkward case: a base case for one element, but none for an <b>empty</b> range. With <code>left = 0</code>, <code>right = 1</code> and a key smaller than <code>arr[0]</code>, the next call is on <code>left = 0</code>, <code>right = -1</code>. Here it is, translated line by line:</p>
        ${codeBlock(CODE.slideSearchClass)}
        ${out("slideSearch")}
        <p>With <code>left = 0</code>, <code>right = -1</code>, Java computes <code>middle = (0 + -1) / 2 = 0</code> (integer division rounds towards zero), finds <code>arr[0] = 1 &gt; 0</code>, and calls itself with the same arguments — forever, until the stack runs out. The fix is the extra base case <code>if (left &gt; right) return -1;</code>.</p>
        ${callout("pitfall", "PITFALL", `<p><b>Test the small, awkward cases.</b> An empty range, one element, two elements, a key smaller than everything, a key larger than everything. Most binary-search bugs show up on an array of length 2.</p>`)}` },
      { id: "recurrence", title: "Counting the operations: a recurrence", html: `
        <p>Count line by line in the worst case. Every line except the recursive calls does a constant amount of work. However large the array, their total is some constant: call it ${M("a")}. In each call <b>either</b> the right-half call <b>or</b> the left-half call runs, never both. What does it cost?</p>
        <p>Define ${M("T(n)")} = the number of basic operations binary search executes in the worst case on a range of ${M("n")} elements. The recursive call is a binary search on about ${M("n/2")} elements; we don't know its cost yet, but by our own definition it is ${M("T(n/2)")}. So</p>
        ${mb("T(n) = T(n/2) + a, &nbsp;&nbsp; T(1) = b")}
        <p>where ${M("b")} is the cost of the base case. An equation that defines ${M("T(n)")} in terms of ${M("T")} at smaller values is a <b>recurrence</b> (recurrence relation). It mirrors the code: one recursive call on half the input, plus constant work.</p>` },
      { id: "unroll", title: "Solving it by unrolling", html: `
        <p>Replace ${M("T(n/2)")} using the recurrence itself, again and again, until ${M("T(1)")} appears. This is <b>unrolling</b> (the <em>iteration method</em>, or repeated substitution). A small case: ${M("T(4) = T(2) + a = T(1) + a + a = 2a + b")}. For ${M("n = 2<sup>x</sup>")}:</p>
        ${mb("T(n) = T(n/2) + a = T(n/2<sup>2</sup>) + 2a = T(n/2<sup>3</sup>) + 3a = … = T(n/2<sup>x</sup>) + x·a = a log<sub>2</sub> n + b")}
        <p>After ${M("x")} halvings one element is left, and ${M("x = log<sub>2</sub> n")}. So ${M("T(n) = a log<sub>2</sub> n + b = O(log n)")}.</p>
        ${demo("unroll", "Demo 3 · Unroll a recurrence", "pick one, then step", "Each step replaces the T on the right by its own recurrence. Try the other three recurrences of this lecture too; they come back in Chapters 3 and 4.")}
        ${predict(`Using the same recurrence, what is ${M("T(1024)")} in terms of ${M("a")} and ${M("b")}?`, `<p>${M("1024 = 2<sup>10</sup>")}, so ${M("T(1024) = 10a + b")}.</p>`)}` },
      { id: "general", title: "When n is not a power of 2", html: `
        <p>Pad the array in your mind: let ${M("x")} be the smallest integer with ${M("n ≤ 2<sup>x</sup>")}, so ${M("2<sup>x−1</sup> &lt; n ≤ 2<sup>x</sup>")} and ${M("n′ = 2<sup>x</sup> &lt; 2n")}. Searching ${M("n")} elements is never more work than searching ${M("n′")}, so</p>
        ${mb("T(n) ≤ T(2<sup>x</sup>) = ax + b ≤ a log<sub>2</sub>(2n) + b = a log<sub>2</sub> n + (a + b)")}
        <p>Still ${M("O(log n)")}. The same trick works for every recurrence in this lecture, so from now on we solve for powers of 2 (or of ${M("b")}). A program confirms it: it searches for every element and every gap, and records the largest number of calls.</p>
        ${codeBlock(CODE.worstCase)}
        ${out("worstCase")}
        <p>The worst case is exactly ${M("⌊log<sub>2</sub> n⌋ + 1")} calls: 20 for a million elements.</p>` },
    ],
    takeaways: ["Recursive call on size m costs T(m).", "Binary search: T(n) = T(n/2) + a.", "Unroll: a log₂ n + b = O(log n)."],
  },
  {
    slug: "3-linear", nav: "Linear", title: "Linear Recursion: Selection Sort",
    subtitle: "When the problem shrinks by one, not by half",
    abstract: "Recursive selection sort puts the largest element last and sorts the rest. Its recurrence, T(n) = T(n−1) + O(n), unrolls to a triangle of work: O(n²).",
    tags: ["selection sort", "T(n−1) + cn", "maxInArray1", "O(n²) vs O(n)"],
    hero: "selectionMini", heroCaption: "Scan for the largest, swap it to the end, recurse on the rest.",
    sections: [
      { id: "video-2", title: "Watch: Linear recursion and recursion trees", html: `
        <div class="card video" data-video="media/L06-2.mp4"></div>` },
      { id: "idea", title: "Recursive selection sort", html: `
        <ol><li><b>Scan</b> all ${M("n")} elements to find the position <code>maxIndex</code> of the largest, <code>maxNum</code>.</li>
        <li><b>Swap</b> it with the last element: the largest is now in its final place.</li>
        <li>What is left is a <b>smaller problem</b>: sort the first ${M("n − 1")} elements, the same way.</li></ol>
        <p>On <code>4 2 3 6 9 5</code> the scan finds 9 at index 4 (the maximum changes at <code>i = 3</code> to 6 and at <code>i = 4</code> to 9), the swap gives <code>4 2 3 6 5 | 9</code>, and the call for 5 elements continues:</p>
        ${table(["call", "before the swap", "largest", "after the swap"], [
          ["n = 6", "4 2 3 6 9 5", "9 at index 4", "4 2 3 6 5 | 9"],
          ["n = 5", "4 2 3 6 5", "6 at index 3", "4 2 3 5 | 6 9"],
          ["n = 4", "4 2 3 5", "5 at index 3", "4 2 3 | 5 6 9"],
          ["n = 3", "4 2 3", "4 at index 0", "3 2 | 4 5 6 9"],
          ["n = 2", "3 2", "3 at index 0", "2 | 3 4 5 6 9"],
          ["n = 1", "2", "base case", "2 3 4 5 6 9"],
        ])}
        <p>(When the largest is already last, as for ${M("n = 4")}, the “swap” copies it onto itself.)</p>` },
      { id: "java", title: "In Java", html: `
        ${codeBlock(CODE.selectionSortClass)}
        ${demo("selectionSort", "Demo 4 · Step through selectionSort", "edit arr, then step", "Count the comparisons each call makes: n − 1 for a call on n elements.")}
        ${codeBlock(CODE.selectionSortDemo)}
        ${out("selectionSortDemo")}
        <p>The number of comparisons depends only on ${M("n")}: ${M("(n−1) + (n−2) + … + 1 = n(n−1)/2")}.</p>` },
      { id: "cost", title: "The cost of selection sort", html: `
        <p>The test, the assignments and the swap are ${M("O(1)")}; the loop runs ${M("n − 1")} times with constant work: ${M("O(n)")}. The recursive call sorts ${M("n − 1")} elements: ${M("T(n − 1)")}. So with ${M("T(1) = b")}, ${M("T(n) = T(n−1) + O(n)")}, that is ${M("T(n) ≤ T(n−1) + cn")}. Unroll:</p>
        ${mb("T(n) ≤ T(n−1) + cn ≤ T(n−2) + c(n−1) + cn ≤ … ≤ T(1) + c·2 + c·3 + … + c·n ≤ c·n(n+1)/2 + b")}
        <p>So ${M("T(n) = O(n<sup>2</sup>)")}. The problem shrinks by <b>one</b> per call, so there are ${M("n")} levels, not ${M("log<sub>2</sub> n")}. Since the comparisons alone are ${M("n(n−1)/2")}, it is also ${M("Ω(n<sup>2</sup>)")}, hence ${M("Θ(n<sup>2</sup>)")} — but often the upper bound is all we need.</p>
        ${callout("pitfall", "PITFALL", `<p><b>Don't write ${M("T(n) = T(n−1) + O(n) = O(n)")}.</b> Each level costs ${M("O(n)")}, but there are ${M("n")} levels. Unroll (or use a theorem) before you drop the ${M("T")}.</p>`)}` },
      { id: "max1", title: "Practice: maxInArray1", html: `
        ${codeBlock(CODE.maxInArrayClass)}
        <p><b>Analyse <code>maxInArray1</code>.</b> The test, <code>return arr[0]</code> and <code>Math.max</code> are ${M("O(1)")}; the call on ${M("n − 1")} elements costs ${M("T(n−1)")}. So ${M("T(n) = T(n−1) + O(1)")}: ${M("T(n) ≤ T(n−1) + c")}, with ${M("T(1) = a")}:</p>
        ${mb("T(n) ≤ T(n−2) + 2c ≤ … ≤ T(1) + (n−1)c ≤ cn + a = O(n)")}
        ${predict("Selection sort and maxInArray1 both recurse on n − 1 elements. Why is one O(n²) and the other O(n)?", `<p>Selection sort does ${M("O(n)")} work in each call (the scan); <code>maxInArray1</code> does ${M("O(1)")}. Summing over the ${M("n")} levels: ${M("c(n + (n−1) + … ) = O(n<sup>2</sup>)")} versus ${M("c + c + … = O(n)")}.</p>`)}` },
    ],
    takeaways: ["Shrink by one → n levels.", "T(n−1) + O(n) = O(n²); T(n−1) + O(1) = O(n).", "Unroll before you drop the T."],
  },
  {
    slug: "4-trees", nav: "Trees", title: "Recursion Trees and Substitution",
    subtitle: "Two recursive calls on halves: maxInArray2",
    abstract: "With two recursive calls, unrolling multiplies. A recursion tree organises the same sum level by level; the substitution method proves the answer by induction.",
    tags: ["divide and conquer", "2T(n/2) + c", "recursion tree", "substitution"],
    hero: "maxTreeMini", heroCaption: "maxInArray2 on 8 elements: 15 calls, 4 levels.",
    sections: [
      { id: "max2", title: "maxInArray2: two calls on halves", html: `
        <p><code>maxInArray2</code> (in the class above) splits the range in the middle, finds the maximum of each half recursively, and returns the larger. This is <b>divide and conquer</b>: <em>divide</em> into smaller problems of the same kind, <em>conquer</em> them recursively, <em>combine</em> the answers.</p>
        ${codeBlock(CODE.maxDemo)}
        ${predict("maxInArray2 makes two recursive calls in each call. Does it make more calls than maxInArray1?", `${out("maxDemo")}<p>It makes ${M("2n − 1")} calls: ${M("n")} leaves (single elements) and ${M("n − 1")} splits. About twice as many as <code>maxInArray1</code>, still ${M("O(n)")} — every element must be looked at — but the recursion is only about ${M("log<sub>2</sub> n")} calls deep.</p>`)}
        ${demo("maxTree", "Demo 5 · The recursion tree of maxInArray2", "step, or skip to the end", "One node per call. A call's value appears under it when it returns. Count the nodes on each level: 1, 2, 4, 8 — the levels grow.")}` },
      { id: "unroll2", title: "Unrolling T(n) = 2T(n/2) + c", html: `
        <p>Everything except the two calls is ${M("O(1)")}, and each call is on half the range: ${M("T(n) ≤ 2T(n/2) + c")}, ${M("T(1) = b")}. For ${M("n = 2<sup>x</sup>")} — careful, the 2 multiplies everything inside:</p>
        ${mb("T(n) ≤ 2T(n/2) + c ≤ 4T(n/4) + c + 2c ≤ 8T(n/8) + c + 2c + 4c ≤ … ≤ 2<sup>x</sup>T(1) + c(1 + 2 + … + 2<sup>x−1</sup>) = bn + cn − c")}
        <p>So ${M("T(n) = O(n)")}. For other ${M("n")}, with ${M("n′ = 2<sup>x</sup> &lt; 2n")}: ${M("T(n) ≤ T(n′) ≤ bn′ + cn′ − c ≤ 2bn + 2cn − c")}, still ${M("O(n)")}.</p>` },
      { id: "tree", title: "The recursion-tree method", html: `
        <p>A <b>recursion tree</b> has one node per call; each node holds the work that call does <em>itself</em>. Add the work level by level, then add the levels. For ${M("T(n) = 2T(n/2) + cn")}:</p>
        ${table(["level t", "calls", "size of each", "work per call", "work at this level"], [
          ["0", "1", "n", "cn", "cn"], ["1", "2", "n/2", "cn/2", "cn"], ["2", "4", "n/4", "cn/4", "cn"],
          ["t", "2<sup>t</sup>", "n/2<sup>t</sup>", "cn/2<sup>t</sup>", "cn"], ["log₂ n", "n", "1", "b", "bn"]])}
        <p>Every level above the leaves costs ${M("cn")}, and there are ${M("log<sub>2</sub> n")} of them: ${M("T(n) = cn log<sub>2</sub> n + bn = O(n log n)")}. For ${M("2T(n/2) + c")} the levels cost ${M("c, 2c, 4c, …")}: they grow, and the ${M("n")} leaves dominate: ${M("O(n)")}. For binary search the tree is a chain of ${M("log<sub>2</sub> n + 1")} nodes: ${M("O(log n)")}. How the level sums change from top to bottom is the whole story; Chapter 5 turns it into a theorem.</p>` },
      { id: "substitution", title: "The substitution method", html: `
        <p>Unrolling and trees <em>find</em> an answer; the <b>substitution method</b> <em>proves</em> one: guess the form, then prove it by induction, substituting the guess for the smaller ${M("T")}.</p>
        <p>Take ${M("T(n) = 2T(n/2) + n")}, ${M("T(1) = 1")}. Guess ${M("T(n) = n log<sub>2</sub> n + n")}. Base: ${M("T(1) = 0 + 1 = 1")} ✓. Step: assume it for ${M("n/2")}; then</p>
        ${mb("T(n) = 2(<sup>n</sup>⁄<sub>2</sub> log<sub>2</sub> <sup>n</sup>⁄<sub>2</sub> + <sup>n</sup>⁄<sub>2</sub>) + n = n(log<sub>2</sub> n − 1) + n + n = n log<sub>2</sub> n + n ✓")}
        <p>For Big-Oh an inequality is enough: assuming ${M("T(n/2) ≤ c·(n/2) log<sub>2</sub>(n/2)")} gives ${M("T(n) ≤ cn log<sub>2</sub> n − cn + n ≤ cn log<sub>2</sub> n")} for ${M("c ≥ 1")}; the base cases ${M("n = 2, 3")} need ${M("c ≥ 2")}.</p>
        ${callout("pitfall", "PITFALL · THE CONSTANT MUST NOT GROW", `<p>A wrong “proof” that ${M("2T(n/2) + n = O(n)")}: assume ${M("T(n/2) ≤ cn/2")}; then ${M("T(n) ≤ cn + n = O(n)")}. But the induction must show ${M("T(n) ≤ cn")} with the <b>same</b> ${M("c")}, and we got ${M("(c + 1)n")}. The constant grows at every step, so there is no constant at all.</p>`)}` },
      { id: "check", title: "Checking with a program", html: `
        <p>Compute the four recurrences exactly (all constants 1, ${M("n")} a power of 2) and compare with the closed forms:</p>
        ${codeBlock(CODE.recurrences)}
        ${out("recurrences")}
        <p>Every pair of columns agrees.</p>` },
    ],
    takeaways: ["Tree: one node per call, sum by level.", "2T(n/2) + c = O(n); 2T(n/2) + n = O(n log n).", "Substitution proves a guess by induction."],
  },
  {
    slug: "5-master", nav: "Master", title: "The Master Theorem",
    subtitle: "One formula for T(n) ≤ a·T(n/b) + O(n<sup>d</sup>)",
    abstract: "Split into a subproblems of size n/b and spend O(n<sup>d</sup>) outside the calls. Compare a with b<sup>d</sup>: equal, every level costs the same; smaller, the root wins; larger, the leaves win.",
    tags: ["a, b, d", "three cases", "geometric series", "when it fails"],
    hero: "levelsMini", heroCaption: "Merge sort's tree: every level does n work.",
    sections: [
      { id: "video-3", title: "Watch: The master theorem", html: `
        <div class="card video" data-video="media/L06-3.mp4"></div>` },
      { id: "statement", title: "The statement", html: `
        ${callout("pattern", "MASTER THEOREM (BIG-OH VERSION)", `<p>Let ${M("T(1) = O(1)")} and ${M("T(n) ≤ a · T(n/b) + O(n<sup>d</sup>)")}, where ${M("a ≥ 1")}, ${M("b &gt; 1")}, ${M("d ≥ 0")} are constants. Then</p>
          <ul><li>${M("T(n) = O(n<sup>d</sup> log n)")} if ${M("a = b<sup>d</sup>")};</li><li>${M("T(n) = O(n<sup>d</sup>)")} if ${M("a &lt; b<sup>d</sup>")};</li><li>${M("T(n) = O(n<sup>log<sub>b</sub> a</sup>)")} if ${M("a &gt; b<sup>d</sup>")}.</li></ul>`)}
        <p>${M("n/b")} need not be an integer: rounding up or down does not change the answer. Comparing ${M("a")} with ${M("b<sup>d</sup>")} is the same as comparing ${M("log<sub>b</sub> a")} with ${M("d")}. (With ${M("=")} and ${M("Θ(n<sup>d</sup>)")} in the recurrence, the answers are ${M("Θ")}.)</p>` },
      { id: "intuition", title: "What a, b and d mean", html: `
        <ul><li>${M("a")}, the <b>branching factor</b>: how many recursive calls each call makes.</li>
        <li>${M("b")}, the <b>shrinking factor</b>: each subproblem has size ${M("n/b")}.</li>
        <li>${M("d")}: the work outside the calls, ${M("O(n<sup>d</sup>)")}, to create the subproblems and combine their answers.</li></ul>
        <p>${M("a")} says how fast the number of subproblems <b>grows</b> from one level to the next; ${M("b<sup>d</sup>")} how fast the work per subproblem <b>shrinks</b>. The three cases are a contest between them.</p>
        ${demo("levels", "Demo 6 · Grow the recursion tree, level by level", "pick a recurrence, then step", "Watch the level totals: equal (case 1), shrinking (case 2) or growing (case 3). Each level is the one above times a/b<sup>d</sup>.")}` },
      { id: "examples", title: "Examples", html: `
        ${table(["recurrence", "a, b, d", "compare", "answer"], [
          ["T(n/2) + c (binary search)", "1, 2, 0", "1 = 2⁰", "O(log n)"],
          ["T(n/2) + c₁n", "1, 2, 1", "1 &lt; 2¹", "O(n)"],
          ["2T(n/2) + c₁n<sup>0.5</sup>", "2, 2, 0.5", "2 &gt; 2<sup>0.5</sup> ≈ 1.41", "O(n<sup>log₂2</sup>) = O(n)"],
          ["2T(n/4) + c₁√n", "2, 4, 0.5", "2 = 4<sup>0.5</sup>", "O(√n log n)"],
          ["2T(n/2) + c (maxInArray2)", "2, 2, 0", "2 &gt; 2⁰", "O(n)"],
          ["2T(n/2) + cn (merge sort, max subarray)", "2, 2, 1", "2 = 2¹", "O(n log n)"]])}
        ${demo("master", "Demo 7 · Which case?", "type a, b and d", "")}
        ${predict(`Solve ${M("T(n) ≤ 8T(n/2) + c<sub>1</sub>n<sup>2</sup>")} and ${M("T(n) ≤ 2T(n/8) + c<sub>1</sub>n<sup>1/3</sup>")}.`, `<p>First: ${M("a = 8")}, ${M("b<sup>d</sup> = 2<sup>2</sup> = 4 &lt; 8")}: case 3, ${M("O(n<sup>log<sub>2</sub> 8</sup>) = O(n<sup>3</sup>)")}. Second: ${M("b<sup>d</sup> = 8<sup>1/3</sup> = 2 = a")}: case 1, ${M("O(n<sup>1/3</sup> log n)")}.</p>`)}` },
      { id: "proof", title: "Why it works: the recursion tree", html: `
        <p>(From the backup slides; not examined, but it explains the theorem better than memorising.) Facts we need: ${M("a<sup>log<sub>b</sub> n</sup> = n<sup>log<sub>b</sub> a</sup>")} (so ${M("b<sup>log<sub>b</sub> n</sup> = n")}); for ${M("x &gt; 1")}, ${M("Σ<sub>i=0..k</sub> x<sup>i</sup> = (x<sup>k+1</sup> − 1)/(x − 1) = Θ(x<sup>k</sup>)")}; for ${M("0 &lt; x &lt; 1")}, the sum is at most ${M("1/(1 − x)")}; for ${M("x = 1")} it is ${M("k + 1")}.</p>
        ${table(["level t", "problems", "size of each", "work each", "level total"], [
          ["0", "1", "n", "c n<sup>d</sup>", "c n<sup>d</sup>"], ["1", "a", "n/b", "c (n/b)<sup>d</sup>", "a · c (n/b)<sup>d</sup>"],
          ["t", "a<sup>t</sup>", "n/b<sup>t</sup>", "c (n/b<sup>t</sup>)<sup>d</sup>", "a<sup>t</sup> · c (n/b<sup>t</sup>)<sup>d</sup>"], ["log<sub>b</sub> n", "a<sup>log<sub>b</sub> n</sup>", "1", "c", "a<sup>log<sub>b</sub> n</sup> · c"]])}
        <p>Level ${M("t")} does ${M("c n<sup>d</sup> (a/b<sup>d</sup>)<sup>t</sup>")}. Adding all levels,</p>
        ${mb("T(n) ≤ c n<sup>d</sup> · Σ<sub>t=0..log<sub>b</sub> n</sub> (a/b<sup>d</sup>)<sup>t</sup>")}
        <p>a geometric series with ratio ${M("r = a/b<sup>d</sup>")}:</p>
        <ul><li><b>${M("r = 1")}:</b> every level does ${M("c n<sup>d</sup>")}; ${M("log<sub>b</sub> n + 1")} levels: ${M("O(n<sup>d</sup> log n)")}.</li>
        <li><b>${M("r &lt; 1")}:</b> the sum is at most ${M("1/(1 − r)")}, a constant: ${M("O(n<sup>d</sup>)")} — the root dominates.</li>
        <li><b>${M("r &gt; 1")}:</b> the last level dominates: ${M("Θ(n<sup>d</sup> r<sup>log<sub>b</sub> n</sup>)")}. Since ${M("(b<sup>d</sup>)<sup>log<sub>b</sub> n</sup> = n<sup>d</sup>")}, the ${M("n<sup>d</sup>")} cancels, leaving ${M("a<sup>log<sub>b</sub> n</sup> = n<sup>log<sub>b</sub> a</sup>")} — the number of leaves.</li></ul>` },
      { id: "numeric", title: "A numerical check", html: `
        <p>The program computes ${M("T(n) = aT(n/b) + n<sup>d</sup>")}, ${M("T(1) = 1")}, exactly for ${M("n = b<sup>k</sup>")}, and divides by the theorem's bound. If the theorem is right, the ratio settles to a constant.</p>
        ${codeBlock(CODE.masterCheck)}
        ${out("masterCheck")}
        <p>In every row the ratio approaches a constant: ${M("T(n)")} grows exactly like the bound.</p>` },
      { id: "fails", title: "When the master theorem does not apply", html: `
        <p>It needs <b>${M("a")} subproblems of the same size ${M("n/b")}</b>, with ${M("b &gt; 1")}.</p>
        <p><b>${M("T(n) ≤ a·T(n−1) + c")}.</b> The size goes down by subtraction: there is no ${M("b")}. Unroll: ${M("T(n) ≤ c(1 + a + … + a<sup>n−2</sup>) + a<sup>n−1</sup>T(1)")}: ${M("O(n)")} for ${M("a = 1")}, ${M("O(a<sup>n</sup>)")} for ${M("a ≥ 2")}. The Towers of Hanoi, ${M("T(n) = 2T(n−1) + 1")}, need ${M("2<sup>n</sup> − 1")} moves.</p>
        <p><b>${M("T(n) = T(n/5) + T(7n/10) + n")}</b>, with ${M("T(n) = 1")} for ${M("1 ≤ n ≤ 10")}. Two different sizes. Draw the tree anyway: the root does ${M("n")}; its children have sizes adding to ${M("9n/10")}, so level 1 does at most ${M("(9/10)n")}, level 2 at most ${M("(9/10)<sup>2</sup>n")}, …</p>
        ${mb("T(n) ≤ n(1 + 9/10 + (9/10)<sup>2</sup> + …) = n / (1 − 9/10) = 10n")}
        <p>So ${M("T(n) = O(n)")} (prove ${M("T(n) ≤ 10n")} by substitution to be sure). This is the linear-time selection algorithm, “median of medians”. The key is ${M("1/5 + 7/10 &lt; 1")}.</p>` },
    ],
    takeaways: ["Compare a with b<sup>d</sup>.", "Equal: n<sup>d</sup> log n. Root: n<sup>d</sup>. Leaves: n<sup>log<sub>b</sub> a</sup>.", "Unequal sizes or n − 1: use a tree or unroll."],
  },
  {
    slug: "6-max-subarray", nav: "Max subarray", title: "Maximum Subarray",
    subtitle: "From O(n³) to O(n log n) by divide and conquer",
    abstract: "The best subarray lies in the left half, in the right half, or across the middle. The first two are recursive calls; the third is found in linear time by walking outwards from the middle.",
    tags: ["brute force", "prefix sums", "crossing subarray", "2T(n/2) + O(n)"],
    hero: "mssMini", heroCaption: "maxSubarray on 8 numbers: under each call, the largest subarray sum in its range.",
    sections: [
      { id: "video-4", title: "Watch: Maximum subarray", html: `
        <div class="card video" data-video="media/L06-4.mp4"></div>` },
      { id: "problem", title: "The problem", html: `
        <p><b>Input:</b> an array of integers ${M("A[1], …, A[n]")}. <b>Output:</b> a (contiguous, non-empty) subarray with the largest sum.</p>
        <ul><li><code>3 7 9 17 5 28 21 18 6 4</code>: all positive, the whole array is best, sum 118.</li>
        <li><code>-3 7 -9 17 -5 28 -21 18 -6 4</code>: the best is <code>17 -5 28</code>, sum 40. The −5 is worth taking to reach 28; the −21 is not.</li>
        <li><code>-3 -7 -9 -17 -5 -28 -21 -18 -6 -4</code>: all negative, the best is the single largest element, −3.</li></ul>
        <p>A classic application: the numbers are daily price changes of a stock; the best subarray says when to buy and when to sell.</p>` },
      { id: "brute", title: "Two brute-force algorithms", html: `
        <p><b>Try every subarray.</b> ${M("n(n+1)/2")} pairs ${M("i ≤ j")}, each summed with up to ${M("n")} additions: ${M("O(n<sup>3</sup>)")}. (Any algorithm needs ${M("Ω(n)")}: it must look at every element.)</p>
        <p><b>Prefix sums.</b> Precompute ${M("R[0] = 0")}, ${M("R[i] = R[i−1] + A[i]")}; then the sum of ${M("A[i..j]")} is ${M("R[j] − R[i−1]")}, one subtraction: ${M("O(n<sup>2</sup>)")}. In Java, indices start at 0, so <code>r[i]</code> is the sum of <code>a[0..i-1]</code> and the sum of <code>a[i..j]</code> is <code>r[j + 1] - r[i]</code>.</p>
        ${codeBlock(CODE.bruteClass)}
        ${callout("pitfall", "PITFALL", `<p><b>Don't skip the one-element subarrays.</b> The inner loop must start at <code>j = i</code>, not <code>j = i + 1</code>; otherwise the all-negative example, whose answer is the single element −3, goes wrong.</p>`)}` },
      { id: "dc", title: "Divide and conquer: three cases", html: `
        <p><b>Base case</b> (${M("n = 1")}): the element itself. <b>Recursive case</b>: <em>divide</em> at the middle index ${M("k")} into ${M("A[i..k]")} and ${M("A[k+1..j]")}; <em>conquer</em>: the maximum subarray of each half, recursively; <em>combine</em>. A maximum subarray of ${M("A[i..j]")} lies</p>
        <ol><li>entirely in the <b>left</b> half — the left call's answer;</li><li>entirely in the <b>right</b> half — the right call's answer; or</li><li><b>across the middle</b>: from some ${M("x ≤ k")} to some ${M("y ≥ k+1")}.</li></ol>
        <p>Case 3 is <em>not</em> a smaller copy of the problem — the crossing subarray is not the answer for either half — so it needs its own method.</p>` },
      { id: "cross", title: "Crossing the middle", html: `
        <p>A crossing subarray is ${M("A[x..k]")} plus ${M("A[k+1..y]")}, and the two parts can be chosen independently. So the left part must be the best of all parts <b>ending at ${M("k")}</b>, and the right part the best of all parts <b>starting at ${M("k+1")}</b>. Walk outwards from the middle with a running sum: ${M("(k − i + 1) + (j − k) = j − i + 1")} steps, ${M("Θ(n)")}.</p>
        ${codeBlock(CODE.maxCross)}
        ${demo("cross", "Demo 8 · Walk out from the middle", "edit a, then step", "The default array is the slide's second example. Left from k = 4 the running sums are −5, 12, 3, 10, 7 (best 12); right from 5 they are 28, 7, 25, 19, 23 (best 28): crossing sum 40.")}` },
      { id: "algorithm", title: "The whole algorithm in Java", html: `
        ${codeBlock(CODE.maxSubarrayClass)}
        <p><code>(i + j) / 2</code> rounds down because the indices are not negative. The tests use <code>&gt;=</code>, so on a tie the left case wins; any tied answer is correct.</p>
        ${codeBlock(CODE.mssDemo)}
        ${out("mssDemo")}
        ${demo("mssTree", "Demo 9 · The recursion tree of maxSubarray", "step, or skip to the end", "Each node shows the range it handles; when it returns, the best subarray low..high and its sum appear under it. The output log says which case won.")}` },
      { id: "time", title: "The running time", html: `
        ${table(["step", "cost"], [
          ["base case (n = 1)", "Θ(1)"], ["divide: compute k", "Θ(1)"],
          ["conquer: two calls on ⌈n/2⌉ and ⌊n/2⌋ elements", "T(⌈n/2⌉) + T(⌊n/2⌋)"],
          ["maxCrossSubarray on the whole range", "Θ(n)"], ["combine: best of three", "Θ(1)"]])}
        <p>So ${M("T(n) = 2T(n/2) + O(n)")}: ${M("a = 2 = 2<sup>1</sup> = b<sup>d</sup>")}, case 1, ${M("T(n) = O(n log n)")} — the merge-sort recurrence: ${M("log<sub>2</sub> n")} levels, each scanning ${M("n")} elements in total.</p>
        ${codeBlock(CODE.mssCount)}
        ${out("mssCount")}
        ${demo("race", "Demo 10 · Three algorithms, one array", "drag n", "")}
        <p>For ${M("n = 10 000")}: about 130 thousand additions for divide and conquer, 50 million for prefix sums, 170 billion for brute force. There is even an ${M("O(n)")} algorithm (Exercise 8), but divide and conquer and its analysis carry over to merge sort, quicksort and much more.</p>` },
    ],
    takeaways: ["Left, right, or crossing the middle.", "Crossing: walk outwards, Θ(n).", "2T(n/2) + O(n) = O(n log n)."],
  },
  {
    slug: "7-summary", nav: "Summary", title: "Summary and Practice",
    subtitle: "Check yourself, then solve some recurrences",
    abstract: "A one-page map of the lecture, a self-check quiz, and exercises with solutions.",
    tags: ["knowledge map", "self-check", "exercises"],
    hero: "toc",
    sections: [
      { id: "map", title: "Knowledge map", html: `<div class="map">
        <div class="card"><h3>Recurrences</h3><ul><li>Recursive call on size m costs <b>T(m)</b></li><li>Binary search: T(n/2) + O(1)</li><li>Selection sort: T(n−1) + O(n)</li><li>maxInArray2: 2T(n/2) + O(1)</li></ul></div>
        <div class="card"><h3>Three ways to solve</h3><ul><li><b>Unroll</b> down to T(1)</li><li><b>Recursion tree</b>: sum by level</li><li><b>Substitution</b>: guess, prove by induction</li><li>Solve for powers of 2; pad the rest</li></ul></div>
        <div class="card"><h3>Master theorem</h3><ul><li>T(n) ≤ aT(n/b) + O(n<sup>d</sup>)</li><li>a = b<sup>d</sup>: n<sup>d</sup> log n</li><li>a &lt; b<sup>d</sup>: n<sup>d</sup> (root)</li><li>a &gt; b<sup>d</sup>: n<sup>log<sub>b</sub> a</sup> (leaves)</li></ul></div>
        <div class="card"><h3>When it fails</h3><ul><li>T(n − 1): no b — unroll</li><li>Unequal sizes: tree</li><li>T(n/5) + T(7n/10) + n = O(n)</li></ul></div>
        <div class="card"><h3>Maximum subarray</h3><ul><li>Brute force O(n³)</li><li>Prefix sums O(n²)</li><li>Divide and conquer O(n log n)</li><li>Kadane O(n)</li></ul></div>
        <div class="card"><h3>Binary search, carefully</h3><ul><li>Handle the empty range</li><li>left + (right − left) / 2</li><li>Test length 0, 1, 2</li></ul></div></div>` },
      { id: "check", title: "Check your understanding", html: `<div data-demo="quiz"><div class="demo-body"></div></div>` },
      { id: "exercises", title: "Exercises", html: `
        <p>★ by hand · ★★ write code · ★★★ think harder.</p>
        <h3>Exercise 1 ★</h3>
        <p>Solve with the master theorem, or say why it does not apply: (a) ${M("4T(n/2) + n")}; (b) ${M("4T(n/2) + n<sup>2</sup>")}; (c) ${M("4T(n/2) + n<sup>3</sup>")}; (d) ${M("7T(n/2) + n<sup>2</sup>")}; (e) ${M("T(n/3) + T(2n/3) + n")}; (f) ${M("9T(n/3) + 1")}.</p>
        <details class="reveal"><summary>Solution</summary><p>(a) ${M("4 &gt; 2")}: ${M("O(n<sup>2</sup>)")}. (b) ${M("4 = 2<sup>2</sup>")}: ${M("O(n<sup>2</sup> log n)")}. (c) ${M("4 &lt; 8")}: ${M("O(n<sup>3</sup>)")}. (d) ${M("7 &gt; 4")}: ${M("O(n<sup>log<sub>2</sub> 7</sup>) ≈ O(n<sup>2.81</sup>)")} (Strassen). (e) Unequal sizes: not covered. Every level of the tree sums to at most ${M("n")} and the longest path has ${M("log<sub>3/2</sub> n")} levels: ${M("O(n log n)")}. (f) ${M("9 &gt; 1")}: ${M("O(n<sup>2</sup>)")}.</p></details>
        <h3>Exercise 2 ★</h3>
        <p>Ternary search splits a sorted range into three with two comparisons and recurses into one part. Recurrence and running time? Is it faster than binary search?</p>
        <details class="reveal"><summary>Solution</summary><p>${M("T(n) = T(n/3) + c")}: case 1, ${M("O(log n)")}. About ${M("2 log<sub>3</sub> n ≈ 1.26 log<sub>2</sub> n")} comparisons: same Big-Oh, slightly <em>more</em> work than binary search in the worst case.</p></details>
        <h3>Exercise 3 ★</h3>
        <p>Unroll ${M("T(n) = 3T(n/2) + n")}, ${M("T(1) = 1")}, for ${M("n = 2<sup>x</sup>")}, and check with the master theorem.</p>
        <details class="reveal"><summary>Solution</summary><p>Level ${M("t")} does ${M("n(3/2)<sup>t</sup>")}, so ${M("T(n) = n · ((3/2)<sup>x+1</sup> − 1)/(1/2) = 3 · 3<sup>x</sup> − 2n = 3n<sup>log<sub>2</sub> 3</sup> − 2n")}. Master theorem: ${M("3 &gt; 2")}, ${M("O(n<sup>log<sub>2</sub> 3</sup>) ≈ O(n<sup>1.585</sup>)")} — Karatsuba multiplication.</p></details>
        <h3>Exercise 4 ★★</h3>
        <p>Prove by substitution that ${M("T(n) = 2T(n/2) + 1")}, ${M("T(1) = 1")}, equals ${M("2n − 1")} for powers of 2. Confirm with <code>maxInArray2</code>'s call counter.</p>
        <details class="reveal"><summary>Solution</summary><p>Base: ${M("T(1) = 1 = 2 − 1")}. Step: ${M("T(n) = 2(n − 1) + 1 = 2n − 1")}. The program in Chapter 4 printed 31 calls for ${M("n = 16")}, and 1999 for ${M("n = 1000")}.</p></details>
        <h3>Exercise 5 ★★</h3>
        <p>Write <code>sumArray(arr, left, right)</code> that sums <code>arr[left..right]</code> by splitting in half. Recurrence and running time?</p>
        <details class="reveal"><summary>Solution</summary>${codeBlock(CODE.sumArray)}${out("sumArray")}<p>${M("T(n) = 2T(n/2) + O(1)")}: ${M("O(n)")} by case 3.</p></details>
        <h3>Exercise 6 ★★</h3>
        <p>Trace <code>maxSubarray</code> on <code>{2, -4, 3, -1}</code>: the calls in the order they return, with their results.</p>
        <details class="reveal"><summary>Solution</summary><p><code>(0,0)</code> → (0,0,2); <code>(1,1)</code> → (1,1,−4); cross for 0..1: (0,1,−2); so <code>(0,1)</code> → (0,0,2), case 1. <code>(2,2)</code> → (2,2,3); <code>(3,3)</code> → (3,3,−1); cross for 2..3: (2,3,2); <code>(2,3)</code> → (2,2,3), case 2. Cross for 0..3 with ${M("k = 1")}: left sums −4, −2 (best −2 at 0); right sums 3, 2 (best 3 at 2): (0,2,1). Left 2, right 3, cross 1: the answer is (2,2,3), the subarray <code>[3]</code>. Type the array into Demo 9 to check.</p></details>
        <h3>Exercise 7 ★★</h3>
        <p>Which maximum subarray does the algorithm return for <code>{1, -1, 1}</code>, where <code>[1]</code> (twice) and <code>[1, -1, 1]</code> all have sum 1?</p>
        <details class="reveal"><summary>Solution</summary><p>${M("k = 1")}. Left (0..1) returns (0,0,1); right (2..2) returns (2,2,1); crossing: left running sums −1, 0 (best 0 at 0), right best 1 at 2: (0,2,1). All sums are 1, and the <code>&gt;=</code> tests pick case 1: (0,0,1), the first <code>[1]</code>.</p></details>
        <h3>Exercise 8 ★★★</h3>
        <p>Find an ${M("O(n)")} algorithm. Hint: walk left to right and keep the best sum of a subarray <b>ending at the current index</b>.</p>
        <details class="reveal"><summary>Solution</summary><p>The best subarray ending at ${M("i")} is either <code>a[i]</code> alone or the best one ending at ${M("i − 1")} extended by <code>a[i]</code>. This is <b>Kadane's algorithm</b>.</p>${codeBlock(CODE.kadane)}${out("kadane")}<p>One pass: ${M("Θ(n)")}, matching the ${M("Ω(n)")} lower bound.</p></details>
        <h3>Exercise 9 ★★★</h3>
        <p>A student splits merge sort into <b>three</b> thirds with an ${M("O(n)")} three-way merge. Faster? What about ${M("n")} parts of size 1?</p>
        <details class="reveal"><summary>Solution</summary><p>${M("3T(n/3) + O(n)")}: ${M("3 = 3<sup>1</sup>")}, still ${M("O(n log n)")} — only the base of the log changes. With ${M("n")} parts there is no recursion left; an ${M("n")}-way merge that repeatedly picks the smallest front element is selection sort, ${M("O(n<sup>2</sup>)")}.</p></details>` },
      { id: "terms", title: "Key terms and further reading", html: `
        <p class="tags">${["recurrence", "unrolling (iteration method)", "recursion tree", "substitution method", "divide and conquer", "branching factor", "shrinking factor", "master theorem", "geometric series", "maximum subarray", "crossing subarray", "prefix sum", "brute force"].map((t) => `<span class="tag">${t}</span>`).join("")}</p>
        <ul><li>T. H. Cormen, C. E. Leiserson, R. L. Rivest, C. Stein, <em>Introduction to Algorithms</em>, Chapter 4 (Divide-and-Conquer): the maximum subarray problem (§4.1 in the 3rd edition), the substitution method, recursion trees and the master method.</li>
        <li>M. A. Weiss, <em>Data Structures and Algorithm Analysis in Java</em>, 3rd ed., §2.4.3 (maximum subsequence sum, four algorithms).</li>
        <li>J. Bloch, “Extra, Extra — Read All About It: Nearly All Binary Searches and Mergesorts are Broken”, Google Research Blog, 2006.</li>
        <li>J. Bentley, <em>Programming Pearls</em>, 2nd ed., Columns 4 (binary search) and 8 (maximum subarray).</li></ul>` },
    ],
    takeaways: ["Write the recurrence from the code.", "Tree, unroll, or master theorem.", "Divide and conquer: O(n log n) from 2T(n/2) + O(n)."],
  },
];

const QUIZ = [
  { q: "An algorithm makes three recursive calls on inputs of size n/3 and does O(n) other work. What is its running time?",
    opts: ["O(n)", "O(n log n)", "O(n²)", "O(n<sup>log₃ 3</sup> log² n)"],
    a: 1, why: "T(n) = 3T(n/3) + O(n): a = 3 = 3¹ = b<sup>d</sup>, case 1, O(n log n)." },
  { q: "Unroll T(n) = T(n/2) + a with T(1) = b. What is T(32)?",
    opts: ["32a + b", "5a + b", "6a + b", "a log₂ 32"],
    a: 1, why: "32 = 2⁵: five halvings, each adding a, then T(1) = b." },
  { q: "Selection sort and maxInArray1 both recurse on n − 1 elements. Why is selection sort O(n²)?",
    opts: ["It makes two recursive calls", "Each call does O(n) work (the scan), and there are n levels", "Its recursion is deeper", "Swapping costs O(n)"],
    a: 1, why: "T(n) = T(n−1) + O(n) sums to c(n + (n−1) + … ) = O(n²). maxInArray1 does O(1) per call: O(n)." },
  { q: "In the recursion tree of T(n) = 4T(n/2) + n, which level does the most work?",
    opts: ["the root", "all levels the same", "the leaves", "the middle level"],
    a: 2, why: "Level t has 4<sup>t</sup> nodes of size n/2<sup>t</sup>: 2<sup>t</sup>·n. The levels double, so the leaves dominate: O(n<sup>log₂ 4</sup>) = O(n²)." },
  { q: "Can the master theorem solve T(n) = 2T(n − 1) + 1?",
    opts: ["Yes: a = 2, b = 1, d = 0, case 3", "Yes: case 1, O(log n)", "No: the size shrinks by subtraction, there is no b &gt; 1", "No: d must be at least 1"],
    a: 2, why: "The theorem needs subproblems of size n/b with b &gt; 1. Unrolling gives 2ⁿ − 1 (with T(1) = 1): exponential." },
  { q: "In maxSubarray, why is the crossing case not solved by a recursive call?",
    opts: ["It would make the algorithm O(n²)", "The best crossing subarray is not the answer to a smaller copy of the problem", "Java cannot return three values", "It is always smaller than the other two"],
    a: 1, why: "It is not the maximum subarray of either half. It is found directly, walking out from the middle, in Θ(n)." },
  { q: "What goes wrong in the slide's binary search for key 0 in arr = {1, 3}?",
    opts: ["It returns 1", "It reaches left = 0, right = −1 and calls itself with the same arguments forever", "middle overflows", "Nothing: it returns −1"],
    a: 1, why: "There is no base case for an empty range. (0 + −1) / 2 = 0 in Java, arr[0] &gt; 0, so it calls search(arr, 0, 0, −1) again: StackOverflowError." },
];
