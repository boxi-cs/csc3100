// Chapter content, adapted from notes/L04-insertion-merge-sort.md. Code is copied from the note.

const demo = (name, title, instr, hint = "") =>
  `<div class="card demo" data-demo="${name}"><div class="head"><span class="title">${title}</span><span>${instr}</span></div>
   <div class="demo-body"></div>${hint ? `<p class="hint">${hint}</p>` : ""}</div>`;

const callout = (kind, label, body) => `<div class="callout ${kind}"><b>${label}</b>${body}</div>`;
const predict = (q, a) => callout("predict", "PREDICT", `<p>${q}</p><details class="reveal"><summary>Show the answer</summary>${a}</details>`);
const out = (s) => codeBlock(s, "out");

const LECTURE = {
  number: 4,
  title: "Insertion Sort and Merge Sort",
  tagline: "How it works, why it is correct, how long it takes",
  lead: "Two sorting algorithms, one loop-invariant proof, a step-counting analysis, recursion and divide-and-conquer, and a first look at quicksort — with every shift, merge and partition drawn so you can step through it.",
  heroDemo: "insertionMini",
  heroLabel: "Insertion sort · [5, 2, 4, 6, 1, 3]",
  heroCaption: "Lift the key, shift the larger elements right, drop the key into the hole.",
  whyTitle: "Why this lecture matters",
  whySub: "Three habits you will use for every algorithm in the course",
  why: [
    ["Prove it", "A <b>loop invariant</b> turns “it worked on my example” into “it works on every input”."],
    ["Count it", "The <b>RAM model</b> lets you count steps and see <b>n</b> versus <b>n²</b> before you run anything."],
    ["Split it", "<b>Divide-and-conquer</b> turns a quadratic sort into an <b>n log n</b> one: merge sort and quicksort."],
  ],
  ctaTitle: "Ready to sort a hand of cards?",
  minutes: "About 90–120 minutes",
  videos: {
    "media/L04-1.mp4": "Lecture 4 · Part 1 — Insertion sort (8.7 min)",
    "media/L04-2.mp4": "Lecture 4 · Part 2 — Why it is correct, and how long it takes (9.9 min)",
    "media/L04-3.mp4": "Lecture 4 · Part 3 — Recursion and divide-and-conquer (8.8 min)",
    "media/L04-4.mp4": "Lecture 4 · Part 4 — Merge sort, and a first look at quicksort (9.7 min)",
  },
};

const CHAPTERS = [
  {
    slug: "1-insertion", nav: "Insertion sort", title: "Sorting and Insertion Sort",
    subtitle: "Sort an array the way you sort a hand of cards",
    abstract: "Insertion sort keeps a sorted prefix and inserts the next element into it, shifting larger elements one place to the right.",
    tags: ["sorting problem", "key", "shift", "stable", "in place"],
    hero: "insertionMini", heroCaption: "The amber cell is the key; teal cells are the sorted prefix.",
    sections: [
      { id: "video-1", title: "Watch: Insertion sort", html: `
        <div class="card video" data-video="media/L04-1.mp4"></div>` },
      { id: "problem", title: "The sorting problem", html: `
        <p><b>Input:</b> a sequence of <span class="math">n</span> numbers ⟨a<sub>1</sub>, a<sub>2</sub>, …, a<sub>n</sub>⟩.<br>
        <b>Output:</b> a <b>permutation</b> (reordering) ⟨a′<sub>1</sub>, a′<sub>2</sub>, …, a′<sub>n</sub>⟩ of the input such that a′<sub>1</sub> ≤ a′<sub>2</sub> ≤ … ≤ a′<sub>n</sub>.</p>
        <ul><li><em>Permutation</em>: the output holds exactly the input values, each as often as it appeared. Turning <code>[3, 1, 2]</code> into <code>[1, 1, 2]</code> is in order but wrong.</li>
        <li><em>≤, not &lt;</em>: equal values are allowed, and all of them are kept.</li></ul>
        <p>The numbers being sorted are called <b>keys</b>; in practice each key carries other data (an ID with a name and a grade), and records are sorted by key. Here the input is stored in an <b>array</b>, so any element can be reached by its index in constant time. There are many sorting algorithms; this lecture covers insertion sort and merge sort, and previews quicksort.</p>` },
      { id: "idea", title: "The idea: a hand of cards", html: `
        <p>Insertion sort is a simple algorithm that works well for <b>a small number of elements</b>. It sorts the way you sort a hand of cards:</p>
        <ul><li>Start with an empty left hand.</li>
        <li>Pick up one card at a time and <b>insert</b> it into the <b>correct position</b>.</li>
        <li>To find that position, compare the new card with the cards in your hand <b>from right to left</b>.</li>
        <li>The cards in the left hand are always <b>sorted</b>.</li></ul>
        <p>In an array, the left hand is the prefix <code>a[0..j-1]</code> and the next card is <code>a[j]</code>. Every card larger than it moves one place to the right to make room.</p>
        <p>The textbook (CLRS) writes it with arrays numbered from 1:</p>
        ${codeBlock(CODE.insertionPseudo, "shell")}
        <p>The <code>while</code> loop moves every element of <code>A[1..j-1]</code> that is larger than <code>key</code> one position right, from right to left, until it meets one that is not larger (or the left end). The hole left behind is where <code>key</code> belongs.</p>` },
      { id: "java", title: "Insertion sort in Java", html: `
        <p>Java arrays run from 0 to <code>n - 1</code>, so the outer loop starts at <code>j = 1</code> and the inner loop stops when <code>i</code> falls below 0:</p>
        ${codeBlock(CODE.insertionSort)}
        <p>The order of the tests in <code>i &gt;= 0 &amp;&amp; a[i] &gt; key</code> matters. When <code>i</code> is <code>-1</code>, <code>&amp;&amp;</code> stops after the first test, so <code>a[-1]</code> is never read. Written the other way round, the loop throws <code>ArrayIndexOutOfBoundsException</code> as soon as <code>key</code> is the smallest value so far.</p>
        ${demo("insertion", "Demo 1 · Insertion sort, shift by shift", "← → keys step", "Edit the array, or try the sorted and reversed presets and compare the numbers of while-tests and shifts.")}` },
      { id: "trace", title: "A worked example", html: `
        <p>This program sorts the textbook's example and prints the array after each pass; the bar <code>|</code> marks the end of the sorted prefix.</p>
        ${codeBlock(CODE.insertionTrace)}
        ${out(CODE.insertionTraceOut)}
        <p>In pass <code>j = 4</code> the key is 1 and all four elements of <code>2 4 5 6</code> are larger, so all four shift and 1 goes into <code>a[0]</code>. In pass <code>j = 3</code> the key 6 is already larger than 5: the test fails at once and nothing moves.</p>
        ${predict("Trace insertion sort on <code>[31, 41, 59, 26, 41, 58]</code>. How many shifts does each pass make? Does the second 41 end up before or after the first one?",
          `<p>Passes <code>j = 1, 2</code>: 0 shifts. Pass <code>j = 3</code> inserts 26 at the front: 3 shifts, giving <code>26 31 41 59 | 41 58</code>. Pass <code>j = 4</code> moves only 59 (the test <code>41 &gt; 41</code> is false): 1 shift. Pass <code>j = 5</code> moves only 59: 1 shift. Result <code>26 31 41 41 58 59</code>.</p>
          <p>Because the test is <code>&gt;</code> and not <code>&gt;=</code>, an element never jumps over an equal one, so the second 41 stays after the first. A sort with this property is <b>stable</b>.</p>`)}
        <p>Insertion sort is <b>in place</b>: apart from <code>key</code>, <code>i</code> and <code>j</code> it uses no extra memory.</p>
        ${callout("pitfall", "PITFALL", `<p><b>Swapping instead of shifting.</b> Swapping <code>a[i]</code> and <code>a[i + 1]</code> in the inner loop also sorts, but each swap is three assignments where a shift is one. Keep <code>key</code> aside, shift, and write it once at the end.</p>
          <p><b>Starting at <code>j = 0</code>.</b> One element alone is already sorted; the outer loop starts at the second element.</p>`)}` },
    ],
    takeaways: ["Sorted prefix + one new key per pass.", "Shift larger elements right; drop the key in the hole.", "Stable and in place."],
  },
  {
    slug: "2-invariant", nav: "Correctness", title: "Correctness: Loop Invariants",
    subtitle: "Why insertion sort works on every input, not just on examples",
    abstract: "A loop invariant is a statement that holds every time the loop test runs. Show it starts true, stays true, and says something useful at the end.",
    tags: ["initialization", "maintenance", "termination", "induction"],
    hero: "code:insertionSort", heroCaption: "The invariant lives at line 4: before each loop test.",
    sections: [
      { id: "video-2", title: "Watch: Why it is correct, and how long it takes", html: `
        <div class="card video" data-video="media/L04-2.mp4"></div>` },
      { id: "what", title: "What a loop invariant is", html: `
        <p>Tracing shows insertion sort works on <em>one</em> input. To know it works on <em>every</em> input we prove it, using a <b>loop invariant</b>: a statement about the variables that is true each time the loop is about to test its condition. For insertion sort:</p>
        ${callout("pattern", "LOOP INVARIANT · INSERTION SORT", `<p>At the start of each iteration of the <code>for</code> loop, the subarray <code>A[1..j-1]</code> consists of the elements originally in <code>A[1..j-1]</code>, but in sorted order.</p>`)}
        <p>A proof has three parts:</p>
        <ul><li><b>Initialization</b>: it is true before the first iteration.</li>
        <li><b>Maintenance</b>: if it is true before an iteration, it is true before the next one.</li>
        <li><b>Termination</b>: when the loop stops, the invariant (with the reason the loop stopped) shows the algorithm is correct.</li></ul>
        <p>This is like <b>mathematical induction</b>: initialization is the base case and maintenance the inductive step. The difference is that the loop stops, and termination is where the invariant pays off.</p>` },
      { id: "proof", title: "The proof for insertion sort", html: `
        <ul><li><b>Initialization.</b> Before the first iteration <span class="math">j = 2</span>, so <code>A[1..1]</code> is the single original element <code>A[1]</code>, and one element is sorted.</li>
        <li><b>Maintenance.</b> Suppose <code>A[1..j-1]</code> is the original first <span class="math">j − 1</span> elements, sorted. The body shifts <code>A[j-1]</code>, <code>A[j-2]</code>, … right while they are larger than <code>key</code>, stops at the first <code>A[i] ≤ key</code> (or <span class="math">i = 0</span>), and writes <code>key</code> into <code>A[i+1]</code>. Everything left of it is ≤ <code>key</code>; everything right of it, up to position <span class="math">j</span>, is &gt; <code>key</code> and in its old order. So <code>A[1..j]</code> is the original first <span class="math">j</span> elements, sorted, and <code>j++</code> restores the invariant.</li>
        <li><b>Termination.</b> The loop stops when <span class="math">j</span> first exceeds <span class="math">n</span>, that is when <span class="math">j = n + 1</span>. Substituting: <code>A[1..n]</code>, the whole array, holds the original elements in sorted order. ∎</li></ul>
        <p>In Java the invariant reads “<code>a[0..j-1]</code> is the original <code>a[0..j-1]</code>, sorted”; the loop stops at <code>j == a.length</code>.</p>
        ${demo("invariant", "Demo 2 · Watch the invariant hold", "← → keys step", "Each step checks the invariant on the real array. The last step is the termination argument: j has run one past the last index.")}` },
      { id: "pitfalls", title: "Common mistakes", html: `
        ${callout("pitfall", "PITFALL", `<p><b>“The loop stops at j = n.”</b> It does not: the iteration with <span class="math">j = n</span> still runs and inserts the last element. The test fails only at <span class="math">j = n + 1</span>. Substituting <span class="math">j = n</span> only tells you <code>A[1..n-1]</code> is sorted, which is not enough.</p>
          <p><b>Forgetting “the original elements”.</b> “<code>A[1..j-1]</code> is sorted” alone is too weak: overwriting the array with zeros keeps it true. The invariant must also say the elements are a permutation of the input.</p>`)}
        <p>You can even check the invariant while the program runs. The note's <code>InvariantCheck</code> program tests it at the top of every iteration on <code>[5, 2, 4, 6, 1, 3]</code>:</p>
        ${out(CODE.invariantOut)}` },
    ],
    takeaways: ["Invariant: a[0..j-1] is the original prefix, sorted.", "Initialization, maintenance, termination.", "The loop ends at j = n + 1 (1-based), not j = n."],
  },
  {
    slug: "3-analysis", nav: "Running time", title: "Analysing the Running Time",
    subtitle: "Count the steps: best case n, worst case n²",
    abstract: "In the RAM model each primitive operation costs a constant. Add up cost × times for every line and the running time of insertion sort falls out.",
    tags: ["RAM model", "t_j", "best case", "worst case", "average case"],
    hero: "costMini", heroCaption: "t_j on a reversed array of 10: t_j = j, a growing staircase.",
    sections: [
      { id: "ram", title: "The RAM model", html: `
        <p>To compare algorithms we count steps on a simple model computer, the <b>random-access machine (RAM)</b>:</p>
        <ul><li>Instructions run <b>sequentially</b>; there are no concurrent operations.</li>
        <li>Each of these takes a <b>constant</b> time: arithmetic, data movement, condition checking, a function call, and <b>accessing the i-th element of an array</b>.</li></ul>
        <p>For a given input, the running time is the <b>number of primitive operations</b> executed. Each line of pseudocode is a fixed number of operations, so one execution of line <span class="math">k</span> costs a constant <span class="math">c<sub>k</sub></span>; different lines may cost different amounts.</p>` },
      { id: "table", title: "Cost × times for insertion sort", html: `
        <p>Let <span class="math">t<sub>j</sub></span> be <b>the number of times the <code>while</code> test runs for that value of j</b>: once per shift, plus the final failing test. So the body runs <span class="math">t<sub>j</sub> − 1</span> times.</p>
        <table><thead><tr><th>line</th><th>code</th><th>cost</th><th>times</th></tr></thead><tbody>
        <tr><td>1</td><td><code>for j = 2 to n</code></td><td>c<sub>1</sub></td><td>n</td></tr>
        <tr><td>2</td><td><code>key = A[j]</code></td><td>c<sub>2</sub></td><td>n − 1</td></tr>
        <tr><td>3</td><td>comment</td><td>0</td><td>n − 1</td></tr>
        <tr><td>4</td><td><code>i = j - 1</code></td><td>c<sub>4</sub></td><td>n − 1</td></tr>
        <tr><td>5</td><td><code>while i &gt; 0 and A[i] &gt; key</code></td><td>c<sub>5</sub></td><td>Σ<sub>j=2..n</sub> t<sub>j</sub></td></tr>
        <tr><td>6</td><td><code>A[i + 1] = A[i]</code></td><td>c<sub>6</sub></td><td>Σ<sub>j=2..n</sub> (t<sub>j</sub> − 1)</td></tr>
        <tr><td>7</td><td><code>i = i - 1</code></td><td>c<sub>7</sub></td><td>Σ<sub>j=2..n</sub> (t<sub>j</sub> − 1)</td></tr>
        <tr><td>8</td><td><code>A[i + 1] = key</code></td><td>c<sub>8</sub></td><td>n − 1</td></tr></tbody></table>
        <p>Line 1 runs <span class="math">n</span> times, not <span class="math">n − 1</span>: the test runs once more, with <span class="math">j = n + 1</span>, to end the loop. Adding up:</p>
        <div class="math-block">T(n) = c<sub>1</sub>n + c<sub>2</sub>(n−1) + c<sub>4</sub>(n−1) + c<sub>5</sub>Σt<sub>j</sub> + c<sub>6</sub>Σ(t<sub>j</sub>−1) + c<sub>7</sub>Σ(t<sub>j</sub>−1) + c<sub>8</sub>(n−1)</div>
        <p><span class="math">T(n)</span> depends on <span class="math">n</span> <em>and</em> on the <span class="math">t<sub>j</sub></span>, i.e. on which input of size <span class="math">n</span> we sort.</p>` },
      { id: "best", title: "Best case: already sorted", html: `
        <p>Every <code>key</code> is at least <code>A[j-1]</code>, so the test fails the first time: <span class="math">t<sub>j</sub> = 1</span>, Σt<sub>j</sub> = n − 1, and lines 6–7 never run:</p>
        <div class="math-block">T(n) = (c<sub>1</sub> + c<sub>2</sub> + c<sub>4</sub> + c<sub>5</sub> + c<sub>8</sub>) n − (c<sub>2</sub> + c<sub>4</sub> + c<sub>5</sub> + c<sub>8</sub>) = an + b</div>
        <p>A <b>linear</b> function of <span class="math">n</span>: Θ(n) in Lecture 5's notation (the slides write O(n)). Best or worst case, the algorithm is the same and must handle every input; “best case” only names the inputs that make it fast.</p>` },
      { id: "worst", title: "Worst case: reversed", html: `
        <p>Every <code>key</code> is smaller than all of <code>A[1..j-1]</code>, so it is compared with all of them and with the left end: <span class="math">t<sub>j</sub> = j</span>. Then</p>
        <div class="math-block">Σ<sub>j=2..n</sub> j = n(n+1)/2 − 1, &nbsp;&nbsp; Σ<sub>j=2..n</sub> (j − 1) = n(n−1)/2</div>
        <div class="math-block">T(n) = ½(c<sub>5</sub>+c<sub>6</sub>+c<sub>7</sub>) n² + (c<sub>1</sub>+c<sub>2</sub>+c<sub>4</sub>+c<sub>5</sub>/2 − c<sub>6</sub>/2 − c<sub>7</sub>/2 + c<sub>8</sub>) n − (c<sub>2</sub>+c<sub>4</sub>+c<sub>5</sub>+c<sub>8</sub>)</div>
        <p>This is <span class="math">an² + bn + c</span>, a <b>quadratic</b> function: the worst case is Θ(n²). (On the slide the <span class="math">c<sub>7</sub></span> term of the second line is misprinted as <span class="math">c<sub>5</sub></span>; the final coefficients are right.)</p>
        ${demo("cost", "Demo 3 · Count t_j", "← → keys step", "Dashed outlines show the worst case t_j = j. Switch to sorted (all bars 1) and random (about half of the worst case).")}
        ${predict("For a reversed array of n = 6, how many while-tests run in total, and how many shifts? For a sorted array of 6?",
          `<p>Reversed: Σt<sub>j</sub> = 6·7/2 − 1 = <b>20</b> tests and 6·5/2 = <b>15</b> shifts. Sorted: <b>5</b> tests, no shifts. The note's <code>InsertionCost</code> program counts them for real, also on a pseudo-random array:</p>${out(CODE.costOut)}
          <p>Multiplying <span class="math">n</span> by 10 multiplies the reversed and random counts by about 100: quadratic growth. The random column is close to half the reversed one.</p>`)}` },
      { id: "average", title: "Why the worst case?", html: `
        <p>We usually concentrate on the <b>worst-case running time</b>:</p>
        <ul><li>It is a <b>guaranteed upper bound</b> for every input of size <span class="math">n</span>.</li>
        <li>For some algorithms the worst case occurs often, e.g. searching for an <b>absent item</b>.</li>
        <li>The <b>average case</b> is often about as bad. On random input, <code>key</code> is on average larger than about half of <code>A[1..j-1]</code>, so <span class="math">t<sub>j</sub> ≈ j/2</span>: about half the worst case, but <b>still quadratic</b>.</li></ul>
        <p>The average case is also harder to compute, since it needs a probability distribution over inputs that real data may not follow.</p>` },
    ],
    takeaways: ["T(n) = Σ cost × times.", "Sorted: t_j = 1 → linear. Reversed: t_j = j → quadratic.", "Analyse the worst case: a guarantee."],
  },
  {
    slug: "4-recursion", nav: "Recursion", title: "Recursion and Divide-and-Conquer",
    subtitle: "Solve a problem by solving smaller copies of it",
    abstract: "Divide into subproblems, conquer them recursively, combine the answers. Recursion needs a base case that every call actually reaches.",
    tags: ["Tower of Hanoi", "base case", "divide / conquer / combine", "memoization"],
    hero: "hanoiMini", heroCaption: "Tower of Hanoi, 3 disks: 7 moves.",
    sections: [
      { id: "video-3", title: "Watch: Recursion and divide-and-conquer", html: `
        <div class="card video" data-video="media/L04-3.mp4"></div>` },
      { id: "hanoi", title: "Tower of Hanoi", html: `
        <p>Three towers A, B, C and <span class="math">n</span> disks of different sizes start on A, largest at the bottom. Move them all to C. Rules: (1) move one disk at a time; (2) only the top disk of a tower may move; (3) never put a larger disk on a smaller one.</p>
        ${callout("pattern", "A SOLUTION BY RECURSION", `<ul><li>If <span class="math">n = 1</span>, move the disk from A to C and stop.</li>
          <li>Otherwise: move the top <span class="math">n − 1</span> disks from A to B (using C as spare); move the largest disk from A to C; move the <span class="math">n − 1</span> disks from B to C (using A as spare).</li></ul>`)}
        <p>“Move <span class="math">n − 1</span> disks” is the same puzzle with one disk fewer, so we solve it the same way.</p>
        ${codeBlock(CODE.hanoi)}
        ${out("move disk 1 from A to C\nmove disk 2 from A to B\nmove disk 1 from C to B\nmove disk 3 from A to C\nmove disk 1 from B to A\nmove disk 2 from B to C\nmove disk 1 from A to C\n7 moves")}
        ${demo("hanoi", "Demo 4 · Tower of Hanoi", "← → keys step", "The line above the console shows the recursive calls still in progress when each move happens.")}
        <p>The number of moves satisfies <span class="math">T(1) = 1</span>, <span class="math">T(n) = 2T(n − 1) + 1</span>, so <span class="math">T(n) = 2<sup>n</sup> − 1</span>: 7 for 3 disks, 1023 for 10, more than 10<sup>18</sup> for 64.</p>` },
      { id: "dc", title: "Divide-and-conquer", html: `
        <ol><li><b>Divide</b> the problem into subproblems that are smaller instances of the same problem.</li>
        <li><b>Conquer</b> the subproblems by solving them recursively. <b>Base case:</b> when a subproblem is small enough, solve it directly (brute force).</li>
        <li><b>Combine</b> the subproblem solutions into a solution of the original problem.</li></ol>
        <svg viewBox="0 0 520 200" role="img" aria-label="divide and conquer diagram" style="max-width:520px;margin:10px auto">
          <defs><marker id="dcah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="var(--stone)"/></marker></defs>
          <rect x="200" y="6" width="120" height="30" rx="8" fill="var(--teal-soft)" stroke="var(--teal)"/><text x="260" y="26" font-size="13" text-anchor="middle" fill="var(--ink)">problem</text>
          <rect x="60" y="66" width="130" height="30" rx="8" fill="var(--mark)" stroke="var(--amber)"/><text x="125" y="86" font-size="12" text-anchor="middle" fill="var(--ink)">subproblem</text>
          <rect x="330" y="66" width="130" height="30" rx="8" fill="var(--mark)" stroke="var(--amber)"/><text x="395" y="86" font-size="12" text-anchor="middle" fill="var(--ink)">subproblem</text>
          <rect x="60" y="120" width="130" height="30" rx="8" fill="var(--mark)" stroke="var(--amber)"/><text x="125" y="140" font-size="12" text-anchor="middle" fill="var(--ink)">sub-solution</text>
          <rect x="330" y="120" width="130" height="30" rx="8" fill="var(--mark)" stroke="var(--amber)"/><text x="395" y="140" font-size="12" text-anchor="middle" fill="var(--ink)">sub-solution</text>
          <rect x="200" y="164" width="120" height="30" rx="8" fill="var(--teal-soft)" stroke="var(--teal)"/><text x="260" y="184" font-size="13" text-anchor="middle" fill="var(--ink)">solution</text>
          <line x1="235" y1="36" x2="140" y2="64" stroke="var(--stone)" marker-end="url(#dcah)"/><line x1="285" y1="36" x2="380" y2="64" stroke="var(--stone)" marker-end="url(#dcah)"/>
          <line x1="125" y1="96" x2="125" y2="118" stroke="var(--stone)" marker-end="url(#dcah)"/><line x1="395" y1="96" x2="395" y2="118" stroke="var(--stone)" marker-end="url(#dcah)"/>
          <line x1="140" y1="150" x2="230" y2="164" stroke="var(--stone)" marker-end="url(#dcah)"/><line x1="380" y1="150" x2="290" y2="164" stroke="var(--stone)" marker-end="url(#dcah)"/>
          <text x="330" y="54" font-size="11" fill="var(--stone)">divide</text><text x="6" y="112" font-size="11" fill="var(--stone)">conquer</text><text x="330" y="166" font-size="11" fill="var(--stone)">combine</text>
        </svg>
        <p>Divide-and-conquer is most commonly implemented with <b>recursion</b>. Classic examples: merge sort, quicksort, binary search, fast modular exponentiation, Euclid's GCD, fast matrix multiplication, and multiplying <span class="math">n</span>-bit integers. (Binary search, fast exponentiation and Euclid keep only one subproblem; some authors call them “decrease-and-conquer”.)</p>` },
      { id: "self", title: "Recursion: self-reference", html: `
        <p>A <b>recursive function</b> is defined in terms of itself. A correct recursive definition</p>
        <ul><li>has a <b>stopping point (base case)</b> that <b>must be reached</b> from every allowed input, and</li>
        <li>evaluates itself on a value moved <b>from higher to lower</b>, towards the base case.</li></ul>
        <p>The slides illustrate this with the function below. It has a base case, but look at the argument of the recursive call:</p>
        ${codeBlock(CODE.selfRef)}
        ${predict("What happens when you call <code>f(1)</code>? And <code>f(2)</code>?",
          `<p><code>f(1)</code> calls <code>f(1 / 3 + 1)</code> = <code>f(1)</code> again (integer division: <code>1 / 3</code> is 0), forever. <code>f(2)</code> calls <code>f(1)</code> and is stuck the same way. In fact <code>n / 3 + 1 ≥ 1</code> for every <code>n ≥ 0</code>, so no call with <code>n ≥ 1</code> ever reaches <code>n &lt;= 0</code>. Java throws <code>StackOverflowError</code>; the note's program prints <code>f(0) = 0</code> and then crashes.</p>`)}
        <p>The fix is to stop at 1. For <code>n ≥ 2</code>, <code>n / 3 + 1 &lt; n</code> (2 → 1, 3 → 2, 10 → 4), so every chain ends:</p>
        ${codeBlock(CODE.selfRefFixed)}
        ${out("f(0) = 0  f(1) = 0  f(2) = 1  f(3) = 3  f(4) = 4  f(5) = 5  f(6) = 8  f(7) = 9  f(8) = 10  f(9) = 12  f(10) = 13  ")}
        ${demo("selfRef", "Demo 5 · Does the base case get reached?", "← → keys step", "Pick the slide's version and any n ≥ 1: the frames pile up with the same argument. Switch to the fixed version and the chain ends.")}` },
      { id: "fib", title: "Fibonacci and memoization", html: `
        <p><span class="math">F<sub>0</sub> = 0</span>, <span class="math">F<sub>1</sub> = 1</span>, <span class="math">F<sub>n</sub> = F<sub>n−1</sub> + F<sub>n−2</sub></span>. The definition translates directly (the slides show it in Python; here it is in Java, with a call counter):</p>
        ${codeBlock(CODE.fib)}
        ${out("0 1 1 2 3 5 8 13 21 34 \nfibonacci(10) = 55 took 177 calls\nfibonacci(20) = 6765 took 21891 calls\nfibonacci(30) = 832040 took 2692537 calls\nfibonacci(40) = 102334155 took 331160281 calls")}
        <p>Correct, but slow: the same subproblems are solved again and again, and the number of calls grows like 1.6<sup>n</sup>. <b>Memoization</b> remembers each answer the first time and reuses it (0 in <code>memo</code> means “not computed yet”, safe because only F<sub>0</sub> is 0):</p>
        ${codeBlock(CODE.fibMemo)}
        ${out("0 1 1 2 3 5 8 13 21 34 \nfibonacci(10) = 55 took 19 calls\nfibonacci(20) = 6765 took 39 calls\nfibonacci(30) = 832040 took 59 calls\nfibonacci(40) = 102334155 took 79 calls\nfibonacci(90) = 2880067194370816120 took 179 calls")}
        ${demo("fib", "Demo 6 · The Fibonacci call tree", "step, then tick memoization", "Without memo the tree repeats whole subtrees. With memo every repeated call is a single lookup, and the tree becomes a chain with short side branches: 2n − 1 calls.")}
        <p>Fibonacci's subproblems <em>overlap</em>, so it is not divide-and-conquer in the merge-sort sense; memoization is the first step towards <b>dynamic programming</b>.</p>` },
    ],
    takeaways: ["Divide · conquer recursively · combine.", "Every call must move towards a base case it can reach.", "Overlapping subproblems → memoize."],
  },
  {
    slug: "5-merge-sort", nav: "Merge sort", title: "Merge Sort",
    subtitle: "Split in half, sort both halves, merge",
    abstract: "Merge sort does all its work in merge, which combines two sorted runs in linear time. Halving gives log n levels, so the total is n log n.",
    tags: ["merge", "recursion tree", "n log n", "stable", "hybrid sort"],
    hero: "mergeMini", heroCaption: "Merge sort on 8 numbers: divide down to single elements, merge back up.",
    sections: [
      { id: "video-4", title: "Watch: Merge sort, and a first look at quicksort", html: `
        <div class="card video" data-video="media/L04-4.mp4"></div>` },
      { id: "idea", title: "The idea", html: `
        <p>Each subproblem is to sort a subarray <code>A[p..r]</code>; at the start <span class="math">p = 1, r = n</span> (in Java <code>0</code> and <code>n - 1</code>).</p>
        <ol><li><b>Divide</b> it into <code>A[p..q]</code> and <code>A[q+1..r]</code>, where <span class="math">q</span> is the middle point.</li>
        <li><b>Conquer</b> by recursively sorting both subarrays.</li>
        <li><b>Combine</b> by <b>merging</b> the two sorted subarrays.</li></ol>
        ${codeBlock(CODE.mergeSortPseudo, "shell")}
        <p>The base case is a subarray of one element, which is sorted already: <code>p &lt; r</code> fails. For example <code>A L G O R I T H M S</code> divides into <code>A L G O R</code> and <code>I T H M S</code>; sorting each gives <code>A G L O R</code> and <code>H I M S T</code>; merging gives <code>A G H I L M O R S T</code>.</p>` },
      { id: "merge", title: "Merge", html: `
        <p>How do we merge two sorted runs efficiently? Think of two sorted piles of cards, face up, smallest on top. Repeatedly <b>choose the smaller of the two top cards</b>, remove it from its pile, and put it on the output. When one pile is empty, put the rest of the other on the output. Every step places one card, so merging <span class="math">n</span> cards takes at most <span class="math">n</span> steps: <b>linear time</b>.</p>
        <p>In Java we copy the two runs into <code>left</code> and <code>right</code> first, then fill <code>a[l..r]</code> from them:</p>
        ${codeBlock(CODE.merge)}
        ${demo("merge", "Demo 7 · Merge two sorted runs", "← → keys step", "Edit the runs (they are sorted for you). Watch the moment one run empties: the rest is copied without comparisons.")}
        <p>The note's <code>MergeTrace</code> program prints the same steps for the default runs:</p>
        ${out(CODE.mergeTraceOut)}
        <p>Eight elements, seven comparisons, one copy. On a tie (the two 2s) <code>&lt;=</code> takes the left one first, so merge sort is <b>stable</b>.</p>
        ${callout("pitfall", "PITFALL", `<p><b>Forgetting the leftovers.</b> The main loop stops when <em>one</em> run is used up; without the two copy loops, the rest of the other run is lost.</p>
          <p><b>Merging by overwriting.</b> Writing into <code>a[l..r]</code> while still reading from it destroys values not yet merged; that is why <code>merge</code> copies the runs first. Merge sort needs Θ(n) extra memory; insertion sort needs none.</p>`)}` },
      { id: "algorithm", title: "The whole algorithm", html: `
        ${codeBlock(CODE.mergeSortClass)}
        <p>The middle is <code>l + (r - l) / 2</code> rather than <code>(l + r) / 2</code>: same value, but <code>l + r</code> can overflow <code>int</code> for huge arrays. The one-argument <code>mergeSort(a)</code> is a wrapper that starts the recursion on the whole array.</p>
        ${demo("mergeTree", "Demo 8 · The merge sort recursion tree", "← → step · edit up to 8 numbers", "Each box is one call, labelled with its input; the green line under it is its sorted output. The console prints exactly what the note's MergeSortTrace prints.")}
        ${predict("How many calls does <code>mergeSort</code> make on 7 elements? How many of them call <code>merge</code>?",
          `<p>A call on 2 or more elements makes two calls; a call on one element makes none. So there are <span class="math">2n − 1</span> calls: <b>13</b> for <span class="math">n = 7</span>. The 7 single-element calls are base cases; the other <b>6</b> each call <code>merge</code> once.</p>`)}` },
      { id: "time", title: "Running time", html: `
        <p>Divide is Θ(1); conquer is <span class="math">T(⌈n/2⌉) + T(⌊n/2⌋)</span>; combine (merge) is Θ(n). Counting at most <span class="math">n</span> comparisons per merge:</p>
        <div class="math-block">T(n) ≤ 0 if n = 1, &nbsp;&nbsp; T(n) ≤ T(⌈n/2⌉) + T(⌊n/2⌋) + n otherwise</div>
        <p>Draw the <b>recursion tree</b> for <span class="math">n = 2<sup>k</sup></span>: the root merges <span class="math">n</span> elements; its two children merge <span class="math">n/2</span> each, <span class="math">n</span> in total; the next level again <span class="math">n</span> in total. Every level costs <span class="math">n</span>, and there are <span class="math">log<sub>2</sub> n</span> levels of merges, so <span class="math">T(n) = n log<sub>2</sub> n</span>, and in general <b>T(n) = O(n log n)</b>.</p>
        ${codeBlock(CODE.recurrence)}
        ${out(CODE.recurrenceOut)}
        <p>For powers of two the columns agree exactly. Lecture 6 solves such recurrences in general.</p>` },
      { id: "compare", title: "Merge sort versus insertion sort", html: `
        <p>Merge sort's <span class="math">O(n log n)</span> grows far more slowly than insertion sort's <span class="math">O(n²)</span>: at <span class="math">n = 10<sup>6</sup></span>, <span class="math">n² = 10<sup>12</sup></span> but <span class="math">n log<sub>2</sub> n ≈ 2 × 10<sup>7</sup></span>. But <span class="math">O</span> hides constants: merge sort pays for calls and copying, insertion sort has a tight inner loop. So <b>insertion sort may be faster on small inputs</b> (the slides suggest <span class="math">n ≤ 30</span>; the real crossover depends on machine and code), while <b>for large enough inputs merge sort always wins</b>.</p>
        ${demo("race", "Demo 9 · Count the comparisons", "drag n", "Random input uses the same pseudo-random numbers as the note's SortRace program, so n = 8, 16, 32, 64 and 1000 match its table.")}
        ${out(CODE.raceOut)}
        <p><b>What is your thinking now?</b> Use each algorithm where it is strong. A <b>hybrid sort</b> runs merge sort but sorts every subarray of at most <span class="math">x</span> elements with insertion sort: <span class="math">n/x</span> small lists, each sorted in <span class="math">O(x²)</span>, then <span class="math">log<sub>2</sub>(n/x)</span> levels of merging. Java's <code>Arrays.sort</code> for objects (TimSort) and Python's <code>sort</code> both work this way. Writing one is Exercise 5.</p>` },
    ],
    takeaways: ["Merge two sorted runs in linear time.", "log n levels × n per level = n log n.", "Insertion sort for small pieces, merge sort for the big picture."],
  },
  {
    slug: "6-quicksort", nav: "Quicksort", title: "A First Look at Quicksort",
    subtitle: "Partition around a pivot, then sort both sides",
    abstract: "Quicksort does its work when dividing: partition puts the pivot in its final place with smaller elements left and larger ones right. Lecture 11 covers it in depth.",
    tags: ["pivot", "partition", "Lomuto", "average n log n", "worst n²"],
    hero: "partitionMini", heroCaption: "Partition around the last element: teal ≤ pivot, grey > pivot.",
    sections: [
      { id: "idea", title: "The idea", html: `
        <ol><li>Pick an element as the <b>pivot</b>.</li>
        <li><b>Partition</b> the array into three parts: elements <b>≤ the pivot</b>, the pivot itself (one element), and elements <b>&gt; the pivot</b>.</li>
        <li>Apply quicksort <b>recursively</b> to the first and third parts.</li></ol>
        <p>There is no combine step: once both sides are sorted, the whole array is. Merge sort works when combining; quicksort works when dividing. Versions differ in how they <b>pick the pivot</b>: first element, last element, a random element, or the median. The <b>average</b> running time is <span class="math">O(n log n)</span>; the worst case is Θ(n²).</p>
        ${codeBlock(CODE.quickPseudo, "shell")}` },
      { id: "partition", title: "Partition", html: `
        <p>The key is <code>PARTITION</code>, which rearranges <code>A[p..r]</code> <b>in place</b>, using the last element as the pivot (Lomuto's scheme, as in CLRS):</p>
        ${codeBlock(CODE.partitionPseudo, "shell")}
        <p>While it runs, <code>A[p..i]</code> holds elements ≤ <span class="math">x</span>, <code>A[i+1..j-1]</code> holds elements &gt; <span class="math">x</span>, <code>A[j..r-1]</code> is not yet examined, and <code>A[r]</code> is the pivot. So <span class="math">i</span> marks the <b>last</b> element known to be ≤ the pivot, and <span class="math">j</span> the <b>first</b> unexamined one. Finally the pivot is swapped into index <span class="math">i + 1</span>, its final position.</p>
        ${codeBlock(CODE.quickSortClass)}
        ${demo("partition", "Demo 10 · Partition step by step", "← → keys step", "Edit the array; the last element is always the pivot.")}
        <p>The note's <code>PartitionTrace</code> on the textbook example:</p>
        ${out(CODE.partitionOut)}` },
      { id: "tree", title: "Quicksort on an example", html: `
        ${predict("Partition <code>[30, 10, 90, 20, 80, 40, 50, 70]</code> around its last element. Where does 70 end up, and what are the two parts?",
          `<p>Five elements (30, 10, 20, 40, 50) are ≤ 70, so 70 lands at index 5. The left part is <code>30 10 20 40 50</code>; the right part is <code>80 90</code> — not <code>90 80</code>: the last swap, which puts 70 in place, moves 90 to the end. So the right side's pivot is 90, not 80.</p>`)}
        ${demo("quickTree", "Demo 11 · The pivot tree", "← → step", "Each box is a call with its subarray before partitioning; the green text is its pivot. Try the sorted input to see the Θ(n²) worst case: every partition peels off one element.")}
        ${out("[30, 10, 90, 20, 80, 40, 50, 70] pivot 70\n  [30, 10, 20, 40, 50] pivot 50\n    [30, 10, 20, 40] pivot 40\n      [30, 10, 20] pivot 20\n        10\n        30\n      { }\n    { }\n  [80, 90] pivot 90\n    80\n    { }\n[10, 20, 30, 40, 50, 70, 80, 90]")}
        <p>Reading the pivot tree left subtree → node → right subtree (an <b>in-order</b> traversal, Lecture 13) gives the sorted order <code>10 20 30 40 50 70 80 90</code>. The left side is lopsided because 50 and 40 are the largest values of their parts; with an unlucky pivot every time, quicksort needs <span class="math">n</span> levels instead of <span class="math">log<sub>2</sub> n</span>.</p>` },
    ],
    takeaways: ["Pivot, partition, recurse; no combine step.", "Partition is in place and linear.", "Average n log n; worst case n² with bad pivots."],
  },
  {
    slug: "7-summary", nav: "Summary", title: "Summary and Practice",
    subtitle: "Check yourself, then write some sorts",
    abstract: "A one-page map of the lecture, a self-check quiz, seven exercises with solutions, and the key terms.",
    tags: ["knowledge map", "self-check", "exercises"],
    hero: "toc",
    sections: [
      { id: "map", title: "Knowledge map", html: `<div class="map">
        <div class="card"><h3>Insertion sort</h3><ul><li>Insert <code>a[j]</code> into sorted <code>a[0..j-1]</code></li><li>Shift larger elements right</li><li>In place, stable</li></ul></div>
        <div class="card"><h3>Correctness</h3><ul><li><b>Loop invariant</b></li><li>Initialization · maintenance · termination</li><li>Loop ends at j = n + 1</li></ul></div>
        <div class="card"><h3>Running time</h3><ul><li>RAM model: Σ cost × times</li><li>Best (sorted) Θ(n)</li><li>Worst (reversed) and average Θ(n²)</li></ul></div>
        <div class="card"><h3>Recursion</h3><ul><li>Base case must be <b>reached</b></li><li>Hanoi: 2<sup>n</sup> − 1 moves</li><li>Overlapping calls → memoize</li></ul></div>
        <div class="card"><h3>Merge sort</h3><ul><li>Divide · conquer · combine</li><li><code>merge</code> is linear</li><li>O(n log n), Θ(n) extra memory, stable</li></ul></div>
        <div class="card"><h3>Quicksort</h3><ul><li>Pivot + <code>partition</code> (in place)</li><li>No combine step</li><li>Average O(n log n), worst Θ(n²)</li></ul></div></div>` },
      { id: "check", title: "Check your understanding", html: `<div data-demo="quiz"><div class="demo-body"></div></div>` },
      { id: "exercises", title: "Exercises", html: `
        <h3>Exercise 1 ★ (trace)</h3>
        <p>Trace insertion sort on <code>[4, 3, 2, 10, 12, 1, 5, 6]</code>. Write the array after each pass and count the shifts.</p>
        <details class="reveal"><summary>Solution</summary><p><code>3 4 2 10 12 1 5 6</code> (1), <code>2 3 4 10 12 1 5 6</code> (2), unchanged (0), unchanged (0), <code>1 2 3 4 10 12 5 6</code> (5), <code>1 2 3 4 5 10 12 6</code> (2), <code>1 2 3 4 5 6 10 12</code> (2). Total 12 shifts.</p></details>
        <h3>Exercise 2 ★ (descending)</h3>
        <p>Change <code>insertionSort</code> to sort into non-increasing order. Which single character changes?</p>
        <details class="reveal"><summary>Solution</summary><p><code>a[i] &gt; key</code> becomes <code>a[i] &lt; key</code>: shift the elements <em>smaller</em> than the key. On <code>[5, 2, 4, 6, 1, 3]</code> the result is:</p>${out("[6, 5, 4, 3, 2, 1]")}</details>
        <h3>Exercise 3 ★★ (inner invariant)</h3>
        <p>State a loop invariant for the inner <code>while</code> loop and use it to show that, when the loop stops, <code>a[i + 1]</code> is the right place for <code>key</code>.</p>
        <details class="reveal"><summary>Solution</summary><p>Invariant: “<code>a[i+2..j]</code> holds the elements originally in <code>a[i+1..j-1]</code>, each larger than <code>key</code>, and <code>a[0..i]</code> is unchanged and sorted.” It holds at the start (<code>i = j - 1</code>: the range is empty). Each iteration copies <code>a[i]</code> (which is &gt; <code>key</code>) to <code>a[i+1]</code> and decrements <code>i</code>. The loop stops when <code>i &lt; 0</code> or <code>a[i] &lt;= key</code>; then all of <code>a[0..i]</code> is ≤ <code>key</code> (sorted, last element ≤ key) and all of <code>a[i+2..j]</code> is &gt; <code>key</code>, so <code>key</code> belongs at <code>a[i+1]</code>.</p></details>
        <h3>Exercise 4 ★★ (merge sort trace)</h3>
        <p>Draw the divide and merge steps of merge sort on <code>M E R G E S O R T</code>. How many calls are made?</p>
        <details class="reveal"><summary>Solution</summary><p>The middle of <code>0..8</code> is 4: <code>M E R G E | S O R T</code>; then <code>M E R | G E</code> and <code>S O | R T</code>; then <code>M E | R</code>, <code>G | E</code>, <code>S | O</code>, <code>R | T</code>; then <code>M | E</code>. Merges: <code>E M</code>, <code>E M R</code>, <code>E G</code>, <code>E E G M R</code>, <code>O S</code>, <code>R T</code>, <code>O R S T</code>, <code>E E G M O R R S T</code>. Calls: 2 · 9 − 1 = 17.</p></details>
        <h3>Exercise 5 ★★★ (hybrid sort, the homework)</h3>
        <p>Implement merge sort that switches to insertion sort for subarrays of at most <code>CUTOFF</code> elements.</p>
        <details class="reveal"><summary>Solution</summary><p>Insertion sort on a range <code>a[l..r]</code> starts <code>j</code> at <code>l + 1</code> and stops <code>i</code> at <code>l</code>; the merge step reuses <code>MergeSort.merge</code>.</p>${codeBlock(CODE.hybrid)}${out(CODE.hybridOut)}<p>With 40 elements and <code>CUTOFF = 16</code> the array splits into halves of 20, then four pieces of 10, which insertion sort handles. Time it on a million elements with different cutoffs to find the best one on your machine.</p></details>
        <h3>Exercise 6 ★★ (merge sort's best case)</h3>
        <p>Does merge sort run faster on an already sorted array? Count the comparisons in <code>merge</code> for sorted input of size <span class="math">n = 2<sup>k</sup></span>.</p>
        <details class="reveal"><summary>Solution</summary><p>A little. Every element of <code>left</code> is ≤ every element of <code>right</code>, so merging two runs of length <span class="math">m</span> makes only <span class="math">m</span> comparisons. Comparisons halve to <span class="math">½ n log<sub>2</sub> n</span>, but the copying is unchanged: still Θ(n log n). Merge sort has no linear best case.</p></details>
        <h3>Exercise 7 ★★ (quicksort's worst case)</h3>
        <p>What does <code>partition</code> do on <code>[1, 2, 3, 4, 5]</code>? How many partitions does quicksort make?</p>
        <details class="reveal"><summary>Solution</summary><p>The pivot 5 is the largest: every element is ≤ 5, <code>i</code> reaches index 3, and 5 stays put. The left part is <code>[1, 2, 3, 4]</code>, the right part is empty. The same happens at every level: 4 partitions on sizes 5, 4, 3, 2, with 4 + 3 + 2 + 1 = 10 comparisons; in general <span class="math">n(n − 1)/2</span>, Θ(n²).</p></details>` },
      { id: "terms", title: "Key terms and reading", html: `
        <p class="tags">${["sorting problem", "key", "permutation", "insertion sort", "in place", "stable", "loop invariant", "initialization", "maintenance", "termination", "RAM model", "best / worst / average case", "recursion", "base case", "Tower of Hanoi", "memoization", "divide-and-conquer", "merge sort", "merge", "recursion tree", "hybrid sort", "quicksort", "pivot", "partition"].map((t) => `<span class="tag">${t}</span>`).join("")}</p>
        <ul><li>Cormen, Leiserson, Rivest, Stein, <em>Introduction to Algorithms</em> (3rd ed.), Chapter 2 (§2.1 insertion sort and loop invariants, §2.2 analysis, §2.3 merge sort) and §7.1 (partition and quicksort).</li>
        <li>M. A. Weiss, <em>Data Structures and Algorithm Analysis in Java</em>, §7.2 (insertion sort) and §7.6 (merge sort).</li>
        <li>Next lecture: asymptotic notation (O, Ω, Θ), CLRS Chapter 3.</li></ul>` },
    ],
    takeaways: ["Insertion sort: n² worst, n best.", "Merge sort: n log n always.", "Prove with invariants; count with the RAM model."],
  },
];

const QUIZ = [
  { q: "Insertion sort is run on an array that is already sorted. How many times does the <code>while</code> test run in total for <span class=\"math\">n</span> elements?",
    opts: ["0", "n − 1", "n(n − 1)/2", "n(n + 1)/2 − 1"],
    a: 1, why: "Each key is at least the element before it, so the test fails at once: t<sub>j</sub> = 1 for each of the n − 1 passes." },
  { q: "In the textbook's 1-based pseudocode, what is the value of <span class=\"math\">j</span> when the <code>for</code> loop of insertion sort stops?",
    opts: ["n − 1", "n", "n + 1", "it depends on the input"],
    a: 2, why: "The iteration with j = n still runs (it inserts the last element). The test fails at j = n + 1, and the invariant then says A[1..n] is sorted." },
  { q: "Which change makes insertion sort <b>unstable</b>?",
    opts: ["Starting the outer loop at j = 1", "Changing <code>a[i] &gt; key</code> to <code>a[i] &gt;= key</code>", "Using <code>i--</code> instead of <code>i = i - 1</code>", "Copying the array first"],
    a: 1, why: "With <code>&gt;=</code>, a key jumps over elements equal to it, so equal keys swap their original order." },
  { q: "What is wrong with <code>f(n)</code>: <code>if (n &lt;= 0) return 0; else return f(n / 3 + 1) + n - 1;</code>?",
    opts: ["Nothing", "It has no base case", "For every n ≥ 1 the argument never drops below 1, so the base case is never reached", "Integer division is not allowed in recursion"],
    a: 2, why: "n / 3 + 1 ≥ 1 for all n ≥ 0, and f(1) calls f(1). The fix is the base case n &lt;= 1." },
  { q: "Merging two sorted runs of lengths 4 and 4 makes at most how many comparisons?",
    opts: ["4", "7", "8", "16"],
    a: 1, why: "Each comparison places one element; the last element is always copied without comparing. So at most 8 − 1 = 7." },
  { q: "Why is merge sort O(n log n)?",
    opts: ["Each merge is O(log n) and there are n merges", "Each level of the recursion tree does O(n) merging work, and there are about log<sub>2</sub> n levels", "It never compares the same pair twice", "It uses a temporary array"],
    a: 1, why: "Halving gives log<sub>2</sub> n levels; the merges on one level together touch all n elements." },
  { q: "After <code>partition</code> on <code>[30, 10, 90, 20, 80, 40, 50, 70]</code>, the right part is…",
    opts: ["[90, 80], pivot 80 next", "[80, 90], pivot 90 next", "[70, 80, 90]", "empty"],
    a: 1, why: "Swapping 20, 40 and 50 into the small region pushes 90 and 80 to indices 5 and 6; the final swap puts 70 at index 5 and sends 90 to the end. So the right part is [80, 90] and its pivot is 90." },
];
