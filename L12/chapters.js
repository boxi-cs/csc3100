// Chapter content, adapted from notes/L12-more-sorting.md. Code and outputs come from the
// note (CODE and OUT in demos.js), where every program was compiled and run.

const demo = (name, title, instr, hint = "") =>
  `<div class="card demo" data-demo="${name}"><div class="head"><span class="title">${title}</span><span>${instr}</span></div>
   <div class="demo-body"></div>${hint ? `<p class="hint">${hint}</p>` : ""}</div>`;

const callout = (kind, label, body) => `<div class="callout ${kind}"><b>${label}</b>${body}</div>`;
const predict = (q, a) => callout("predict", "PREDICT", `<p>${q}</p><details class="reveal"><summary>Show the answer</summary>${a}</details>`);
const program = (name) => codeBlock(CODE[name]) + codeBlock(OUT[name], "out");

const LECTURE = {
  number: 12,
  title: "More Sorting Algorithms",
  tagline: "ShellSort, and three sorts that never compare",
  lead: "Insertion sort with long jumps, then CountingSort, BucketSort and RadixSort, which sort in linear time by using the values themselves — and a table of all ten classic sorts. Every pass can be stepped through, with your own input.",
  heroDemo: "radixMini",
  heroLabel: "LSD RadixSort · ten queues per pass",
  heroCaption: "Distribute by one digit, collect in queue order, move to the next digit. No two numbers are ever compared.",
  whyTitle: "Why these sorts are worth knowing",
  whySub: "Three ideas that reach beyond sorting",
  why: [
    ["Preprocessing pays", "ShellSort's long jumps make the final insertion sort almost free: <b>cheap early passes</b> remove most of the disorder."],
    ["Values as addresses", "Using a key as an <b>array index</b> beats the n log n limit of comparisons — the same idea as hashing (Lecture 18)."],
    ["Stability is a tool", "RadixSort is correct <b>only because</b> each pass keeps equal keys in order. Stability is something you prove with."],
  ],
  ctaTitle: "Ready to sort without comparing?",
  minutes: "About 75–90 minutes",
  videos: {
    "media/L12-1.mp4": "Lecture 12 · Part 1 — ShellSort, insertion sort with long jumps (10.2 min)",
    "media/L12-2.mp4": "Lecture 12 · Part 2 — How fast ShellSort is, and CountingSort (9.6 min)",
    "media/L12-3.mp4": "Lecture 12 · Part 3 — Stable CountingSort, BucketSort and RadixSort by hand (11.2 min)",
    "media/L12-4.mp4": "Lecture 12 · Part 4 — RadixSort in Java, why it works, and ten sorts compared (10.5 min)",
  },
};

const CHAPTERS = [
  {
    slug: "1-shellsort", nav: "ShellSort", title: "ShellSort: Insertion Sort with Long Jumps",
    subtitle: "Sort the elements h apart, for a shrinking h",
    abstract: "Insertion sort moves an element one position per step. ShellSort first lets elements jump h positions at a time, so the final ordinary insertion sort finds the array almost sorted.",
    tags: ["h-sorted", "increment sequence", "gap insertion sort"],
    hero: "shellPhasesMini", heroCaption: "The slides' example with increments 5, 3, 1: one colour per subsequence.",
    sections: [
      { id: "video-1", title: "Watch: ShellSort, insertion sort with long jumps", html: `
        <div class="card video" data-video="media/L12-1.mp4"></div>` },
      { id: "where", title: "Where we are", html: `
        <p>So far the course has met five sorts. Bubble, insertion and selection sort take <span class="math">Θ(n²)</span> time in the worst case; MergeSort (Lecture 4) and QuickSort (Lecture 11) take <span class="math">Θ(n log n)</span>, QuickSort on average. All five are <b>comparison-based</b>: the only thing they do with two elements is ask “is <span class="math">a &lt; b</span>?”.</p>
        <p>This lecture has two parts.</p>
        <ul><li><b>ShellSort</b> is still comparison-based. It is a small change to insertion sort that breaks insertion sort's quadratic barrier in practice, by comparing elements that are <em>far apart</em> first.</li>
        <li><b>CountingSort, BucketSort and RadixSort</b> do not compare elements with each other. They use the <em>values</em> themselves, as array indices or digits, and when the values are suitable they sort in <b>linear time</b>, which no comparison sort can do.</li></ul>
        ${callout("note", "NOTE · WHY LINEAR TIME NEEDS MORE THAN COMPARISONS", `<p>Any comparison sort needs <span class="math">Ω(n log n)</span> comparisons in the worst case (CLRS §8.1). It must be able to produce each of the <span class="math">n!</span> orderings of its input, and each comparison has only two outcomes, so it needs at least <span class="math">log₂(n!) = Θ(n log n)</span> comparisons to tell them apart. The three non-comparison sorts escape this bound because reading <code>a[i]</code> as an index has up to <span class="math">m</span> outcomes, not two.</p>`)}` },
      { id: "idea", title: "The idea: long jumps", html: `
        <p>Insertion sort moves an element left <b>one position at a time</b>. A small value at the far right has to be shifted past almost every other element, one step per shift. On a reversed array every element does this, which is where the <span class="math">Θ(n²)</span> comes from.</p>
        <p><b>ShellSort</b> (Donald Shell, 1959) insertion-sorts the elements that are <span class="math">h</span> positions apart, for a large <span class="math">h</span>, so a small value can jump left <span class="math">h</span> positions in one move. Then it repeats with a smaller <span class="math">h</span>, until <span class="math">h = 1</span>. The last pass is plain insertion sort, so the result is certainly sorted; the earlier passes are there to make the last pass cheap.</p>
        ${callout("pattern", "DEFINITION · h-SORTED", `<p>An array <code>a</code> is <b>h-sorted</b> if <code>a[i] &lt;= a[i + h]</code> for every <code>i</code> with <code>i + h &lt; n</code>. Equivalently: for each start <code>r = 0, 1, …, h−1</code>, the subsequence <code>a[r], a[r+h], a[r+2h], …</code> is sorted. There are <span class="math">h</span> such subsequences, interleaved. A 1-sorted array is a sorted array.</p>`)}
        <p><b>The steps.</b></p>
        <ol><li>Choose an <b>increment sequence</b> (gap sequence) <span class="math">h₁ &lt; h₂ &lt; … &lt; h<sub>t</sub></span> with <span class="math">h₁ = 1</span>, used in reverse order, largest first.</li>
        <li>For the current increment <span class="math">h</span>, split the array into the <span class="math">h</span> subsequences of elements spaced <span class="math">h</span> apart.</li>
        <li>Sort each subsequence with insertion sort. The array is now <span class="math">h</span>-sorted.</li>
        <li>Move to the next smaller increment and repeat, ending with <span class="math">h = 1</span>.</li></ol>
        <table><thead><tr><th>sequence</th><th>increments</th><th>worst case</th></tr></thead><tbody>
          <tr><td>Shell (halving)</td><td>⌊n/2⌋, ⌊n/4⌋, …, 1</td><td>Θ(n²)</td></tr>
          <tr><td>Hibbard</td><td>1, 3, 7, 15, …, 2<sup>k</sup> − 1</td><td>Θ(n<sup>3/2</sup>)</td></tr>
          <tr><td>Knuth</td><td>1, 4, 13, 40, …, h<sub>i+1</sub> = 3h<sub>i</sub> + 1</td><td>Θ(n<sup>3/2</sup>)</td></tr>
          <tr><td>Sedgewick</td><td>1, 5, 19, 41, 109, …</td><td>O(n<sup>4/3</sup>)</td></tr></tbody></table>` },
      { id: "example", title: "A worked example", html: `
        <p>Take the 13 numbers below and the increments 5, 3, 1 (the sequence 1, 3, 5 used in reverse). With <span class="math">h = 5</span> there are five subsequences: positions {0, 5, 10}, {1, 6, 11}, {2, 7, 12}, {3, 8} and {4, 9}.</p>
        <table><thead><tr><th></th>${[...Array(13).keys()].map((k) => `<th>${k}</th>`).join("")}</tr></thead><tbody>
          <tr><td>original</td>${[81, 94, 11, 96, 12, 35, 17, 95, 28, 58, 41, 75, 15].map((v) => `<td>${v}</td>`).join("")}</tr>
          <tr><td>5-sorted</td>${[35, 17, 11, 28, 12, 41, 75, 15, 96, 58, 81, 94, 95].map((v) => `<td>${v}</td>`).join("")}</tr>
          <tr><td>3-sorted</td>${[28, 12, 11, 35, 15, 41, 58, 17, 94, 75, 81, 96, 95].map((v) => `<td>${v}</td>`).join("")}</tr>
          <tr><td>1-sorted</td>${[11, 12, 15, 17, 28, 35, 41, 58, 75, 81, 94, 95, 96].map((v) => `<td>${v}</td>`).join("")}</tr></tbody></table>
        <p>Check one subsequence: positions 0, 5, 10 hold 81, 35, 41; sorted they are 35, 41, 81, the values in positions 0, 5, 10 of the second row. In the 3-sort, positions 0, 3, 6, 9, 12 hold 35, 28, 75, 58, 95, which become 28, 35, 58, 75, 95.</p>
        ${demo("shellPhases", "Demo 1 · ShellSort one subsequence at a time", "step, or change data and gaps", "Each step insertion-sorts one coloured subsequence. Try gaps <code>5, 3</code> (no final 1) to see an array that is 5-sorted and 3-sorted but not sorted, or <code>1</code> alone for plain insertion sort.")}
        <p>The early passes do a lot of work cheaply: 81 moved from position 0 to position 10 in one move, and 15 from position 12 to position 7. After the 3-sort the array is “almost sorted”.</p>
        ${predict("Before the last pass the array is <code>28 12 11 35 15 41 58 17 94 75 81 96 95</code>. How many shifts does the final insertion sort (h = 1) make? Hint: insertion sort makes one shift per <b>inversion</b>, a pair <code>i &lt; j</code> with <code>a[i] &gt; a[j]</code>.",
          `<p>The inversions are (28,12), (28,11), (28,15), (28,17), (12,11), (35,15), (35,17), (41,17), (58,17), (94,75), (94,81), (96,95): <b>12 shifts</b>. Plain insertion sort on the original row needs 41, one per inversion. The program in the next section prints these counts.</p>`)}` },
      { id: "java", title: "ShellSort in Java", html: `
        <p>The slides' code uses the halving increments <span class="math">n/2, n/4, …, 1</span>. Here it is in a class, together with a version that takes any increment sequence and counts the shifts:</p>
        ${codeBlock(CODE.ShellSort)}
        <p>Read <code>shellSort(int[] a)</code> from the inside out. The two inner loops are insertion sort with every <code>1</code> replaced by <code>gap</code>: <code>tmp</code> is the element being inserted, it is compared with <code>a[j - gap]</code>, the previous element <b>of its own subsequence</b>, and larger elements are shifted <code>gap</code> positions right.</p>
        ${demo("shellStep", "Demo 2 · shellSort(a), line by line", "← → keys step", "The coloured cells are the subsequence of the element being inserted; the dashed cell is the hole that <code>tmp</code> will fill.")}
        ${callout("note", "NOTE · THE CODE INTERLEAVES THE SUBSEQUENCES", `<p>Demo 1 sorted the subsequences one after another. The code walks <code>i</code> from <code>gap</code> to the end, so it inserts one element of subsequence 0, then one of subsequence 1, and so on. The slides call this “slightly different but also correct”: the subsequences use disjoint positions, so any interleaving gives the same <span class="math">h</span>-sorted array.</p>`)}
        ${program("ShellExample")}
        <p>ShellSort with 5, 3, 1 made 6 + 5 + 12 = 23 shifts, against 41 for insertion sort. The saving grows quickly with <span class="math">n</span>, as the next chapter shows.</p>
        ${callout("pitfall", "PITFALL", `<p>Comparing with <code>a[j - 1]</code> instead of <code>a[j - gap]</code>, or starting <code>i</code> at 1 instead of <code>gap</code>, turns the pass into something that is not an <span class="math">h</span>-sort. And never drop the final pass with gap 1: an array that is 5-sorted and 3-sorted need not be sorted.</p>`)}` },
    ],
    takeaways: ["h-sorted: every subsequence h apart is sorted.", "Large gaps first, gap 1 last.", "Inner loops = insertion sort with step gap."],
  },
  {
    slug: "2-shell-analysis", nav: "Shell analysis", title: "How Fast Is ShellSort?",
    subtitle: "The increments decide everything",
    abstract: "With halving increments, a carefully built input keeps the large values apart until the last pass, which then costs Θ(n²). Better increments avoid this. ShellSort is in place but not stable.",
    tags: ["Θ(n²) worst case", "inversions", "stability"],
    hero: "shellWorstMini", heroCaption: "The bad input for n = 16: amber values stay in odd positions until gap 1.",
    sections: [
      { id: "video-2", title: "Watch: How fast ShellSort is, and CountingSort", html: `
        <div class="card video" data-video="media/L12-2.mp4"></div>` },
      { id: "facts", title: "It depends on the increments", html: `
        <p>The running time <b>depends on the increment sequence</b>, and the best sequence is still an open problem. What is known (Weiss §7.4):</p>
        <ul><li>A pass with increment <span class="math">h</span> insertion-sorts <span class="math">h</span> subsequences of length about <span class="math">n/h</span>, so it costs at most about <span class="math">n²/h</span>. Later passes are cheap because they find the array nearly sorted.</li>
        <li>An <span class="math">h</span>-sorted array that is then <span class="math">k</span>-sorted stays <span class="math">h</span>-sorted: earlier work is never undone.</li>
        <li>Halving increments: worst case <span class="math">Θ(n²)</span>. Hibbard's and Knuth's: <span class="math">Θ(n<sup>3/2</sup>)</span>. Sedgewick's: <span class="math">O(n<sup>4/3</sup>)</span>.</li>
        <li>The <b>average case</b> is unknown for most sequences; experiments give roughly <span class="math">n<sup>1.25</sup></span> to <span class="math">n<sup>1.3</sup></span>. The <span class="math">O(n<sup>1.3</sup>)</span> in the slides' summary table is such an empirical figure, not a theorem.</li>
        <li>The <b>best case</b> (sorted input) still runs every pass, and each pass looks at every element once: <span class="math">Θ(n log n)</span> for halving or Knuth increments, not <span class="math">O(n)</span>.</li></ul>` },
      { id: "worst", title: "Why halving can take Θ(n²)", html: `
        ${callout("pattern", "THEOREM (WEISS 7.3)", `<p>The worst-case running time of ShellSort with Shell's halving increments is <span class="math">Θ(n²)</span>.</p>`)}
        <p>The bad input: let <span class="math">n</span> be a power of 2, put the <span class="math">n/2</span> <b>largest</b> numbers in the odd positions 1, 3, 5, … (the “even positions” when counting from 1, as the slides do) and the smallest in positions 0, 2, 4, …. For <span class="math">n = 8</span>: <code>4, 12, 1, 10, 3, 11, 2, 9</code>.</p>
        <p>Every increment except the last is even, and an even gap only compares positions of the same parity. So the large numbers stay in the odd positions until the very last pass:</p>
        <div class="math-block">4, 12, 1, 10, 3, 11, 2, 9 → (4-sort) → 3, 11, 1, 9, 4, 12, 2, 10 → (2-sort) → 1, 9, 2, 10, 3, 11, 4, 12</div>
        <p>The final insertion sort must move each small number left past all the large numbers in front of it. The small number in position <span class="math">2t</span> has <span class="math">t</span> large numbers in front, so the number of inversions is</p>
        <div class="math-block">0 + 1 + 2 + … + (n/2 − 1) = (n/2)(n/2 − 1) / 2 = Θ(n²)</div>
        <p>For <span class="math">n = 8</span> that is 1 + 2 + 3 = 6. The upper bound <span class="math">O(n²)</span> holds because the pass with increment <span class="math">h</span> costs <span class="math">O(n²/h)</span> and <span class="math">Σ n²/h ≤ 2n²</span>.</p>
        ${demo("shellWorst", "Demo 3 · The bad input", "step through the passes", "Switch the increments to Knuth's: they contain odd gaps (13 for n = 16 or 32), which mix the two halves early.")}
        ${program("ShellWorstCase")}
        <p>On the bad input the last halving pass makes exactly <span class="math">(n/2)(n/2 − 1)/2</span> shifts, 16 times more each time <span class="math">n</span> grows by 4. Knuth's increments handle the same input cheaply. On random input both ShellSorts beat insertion sort by orders of magnitude: for <span class="math">n = 100 000</span>, about 2.9 million shifts against 2.5 billion. Halving does well on random data; its worst case needs special inputs like this one.</p>` },
      { id: "stable", title: "ShellSort is not stable", html: `
        <p>A sort is <b>stable</b> if equal keys keep their original relative order. Insertion sort is stable, but ShellSort is not: a long jump can carry one copy of a key past another copy.</p>
        ${predict("Sort <code>3, 2a, 2b, 1</code> (two 2s, labelled) with gaps 2, 1. In which order do the two 2s come out?",
          `<p>The 2-sort sorts positions {0, 2} = (3, 2b) into (2b, 3), and positions {1, 3} = (2a, 1) into (1, 2a), giving <code>2b, 1, 3, 2a</code>. The final insertion sort gives <code>1, 2b, 2a, 3</code>: the 2s have <b>swapped</b>.</p>`)}
        ${demo("shellStable", "Demo 4 · A long jump breaks stability", "step", "Watch 2b: in the gap-2 pass it jumps over 2a. The letters are only labels; the sort compares the numbers.")}
        <p>The “√*” in the slides' table means that any sort can be made stable by sorting (key, original index) pairs, at the cost of extra space.</p>
        ${predict("Is <code>2, 1, 4, 3, 6, 5</code> 2-sorted? Is it 3-sorted? And what are the halving increments for <span class=\"math\">n = 100</span>?",
          `<p>2-sorted: positions 0, 2, 4 hold 2, 4, 6 and positions 1, 3, 5 hold 1, 3, 5, both sorted — yes. 3-sorted: 2 ≤ 3, 1 ≤ 6, 4 ≤ 5 — yes as well. It is not 1-sorted. For <span class="math">n = 100</span>: 50, 25, 12, 6, 3, 1.</p>`)}` },
    ],
    takeaways: ["Speed depends on the increments.", "Halving: even gaps keep halves apart → Θ(n²).", "In place, not stable."],
  },
  {
    slug: "3-counting", nav: "CountingSort", title: "CountingSort",
    subtitle: "The value is the bucket number",
    abstract: "If every key is an integer in [0, m−1], count how often each value occurs and write the values back in order: O(n + m) time, no comparisons. The prefix-sum version moves whole records and is stable.",
    tags: ["O(n + m)", "prefix sums", "stable"],
    hero: "countingMini", heroCaption: "The slides' input: count into five buckets, then write them back in order.",
    sections: [
      { id: "video-3", title: "Watch: Stable CountingSort, BucketSort and RadixSort by hand", html: `
        <div class="card video" data-video="media/L12-3.mp4"></div>` },
      { id: "idea", title: "The idea", html: `
        <p><b>Assume</b> every value is an integer in the range <span class="math">[0, m − 1]</span>, for a known and not too large <span class="math">m</span>. Then:</p>
        <ol><li>Start with <span class="math">m</span> empty buckets, numbered 0 to <span class="math">m − 1</span>.</li>
        <li>Scan the input and put each element <code>s[i]</code> into <b>bucket number <code>s[i]</code></b>: the bucket index <em>is</em> the value.</li>
        <li>Output the buckets in order 0, 1, …, <span class="math">m − 1</span>.</li></ol>
        <p>All copies of a value land in the same bucket, so a bucket only needs to remember <b>how many</b> elements it holds: an array <code>b</code> of <span class="math">m</span> counters is enough.</p>
        <div class="math-block" style="font-family:var(--mono);font-size:15px">input 4 2 1 2 0 3 2 1 4 0 2 3 0<br>b = [3, 2, 4, 2, 2]<br>output 0 0 0 1 1 2 2 2 2 3 3 4 4</div>
        ${callout("note", "NOTE · SLIDE LABELS", `<p>The slide labels the five buckets <code>s[0]</code> … <code>s[4]</code>. They are the counters <code>b[0]</code> … <code>b[4]</code> of the pseudocode, not elements of the input <code>s</code>.</p>`)}` },
      { id: "algorithm", title: "The algorithm and its cost", html: `
        <p>The slides' pseudocode in Java, plus a version for any range of integers:</p>
        ${codeBlock(CODE.CountingSort)}
        <p><b>Running time.</b> Creating <code>b</code> (Java zero-fills it, which is the pseudocode's initialisation loop) costs <span class="math">O(m)</span>; counting costs <span class="math">O(n)</span>; the output loops cost <span class="math">O(m + n)</span> together, because the inner loop runs <span class="math">b[0] + … + b[m−1] = n</span> times in all and the outer loop <span class="math">m</span> times. Total: <b><span class="math">O(m + n)</span> time, <span class="math">O(m)</span> extra space</b> — linear when <span class="math">m = O(n)</span>.</p>
        ${demo("counting", "Demo 5 · countingSort(s, m)", "step, or type your own s", "<code>m</code> is the largest value + 1. No two elements are ever compared.")}
        ${program("CountingExample")}
        ${predict("In the slides' exercise <code>4, 3, 2, 1, 5, 2, 4, 1, 2, 0, 4, 2, 0</code>, what are the counts <code>b[0]</code> … <code>b[5]</code>? What goes wrong with <code>countingSort(t, 5)</code>?",
          `<p><code>b = [2, 2, 4, 1, 3, 1]</code> (they add up to 13). The largest value is 5, so <span class="math">m = 6</span>. With <span class="math">m = 5</span>, <code>b[s[i]]++</code> reaches <code>b[5]</code> and Java throws <code>ArrayIndexOutOfBoundsException</code>. Always check that <span class="math">m</span> exceeds the largest value.</p>`)}` },
      { id: "questions", title: "Large ranges, negatives, limitations", html: `
        <p><b>What if the range is very large?</b> CountingSort spends <span class="math">O(m)</span> time and space on the counters even if most stay 0: sorting 10 numbers in <span class="math">[0, 10⁹)</span> would need a billion counters. Use it only when <span class="math">m = O(n)</span>. Otherwise sort digit by digit with RadixSort (Chapter 5), which needs only 10 counters per pass, or use a comparison sort.</p>
        <p><b>Negative values?</b> Shift them: with minimum <code>min</code>, value <code>x</code> goes to bucket <code>x - min</code>, and bucket <code>j</code> stands for value <code>j + min</code>. That is <code>countingSortRange</code>, with <code>max - min + 1</code> buckets.</p>
        <p><b>Limitations.</b></p>
        <ul><li>Keys must be <b>integers</b>, or map to small integers (letters, grades); it cannot sort arbitrary reals or strings directly.</li>
        <li>The range <span class="math">m</span> must be <b>known</b> and <b>small</b> compared with <span class="math">n</span>.</li>
        <li>The simple version writes the <em>values</em> back, so it only sorts bare keys. Sorting <b>records by a key</b> needs the version in the next section, with an output array of size <span class="math">n</span>.</li></ul>` },
      { id: "stable", title: "Stable CountingSort for records", html: `
        <p>When each element is a record with a key, we must move the records themselves. The standard version (CLRS §8.2) turns counts into <b>positions</b>:</p>
        <ol><li>Count: <code>count[k]</code> = number of records with key <code>k</code>.</li>
        <li>Prefix sums: replace <code>count[k]</code> by the number of records with key <b>≤ k</b>; it is one more than the last position for key <code>k</code>.</li>
        <li>Scan the input <b>from right to left</b>; put each record at position <code>--count[key]</code> of a new array.</li></ol>
        <p>The last record with key <code>k</code> takes the last slot for <code>k</code>, the one before it the slot in front, and so on: equal keys keep their input order, so this CountingSort is <b>stable</b>. RadixSort depends on exactly that.</p>
        ${codeBlock(CODE.Card)}
        ${codeBlock(CODE.StableCountingSort)}
        ${demo("stableCounting", "Demo 6 · Stable CountingSort", "← → keys step", "The letters label the records in input order. Check the letters of equal keys in <code>out</code> at the end.")}
        ${program("StableCountingExample")}
        <p>Counts <code>[2, 2, 3]</code>, prefix sums <code>[2, 4, 7]</code>: key 0 goes to positions 0–1, key 1 to 2–3, key 2 to 4–6. Time <span class="math">O(n + m)</span>, extra space <span class="math">O(n + m)</span>.</p>
        ${callout("pitfall", "PITFALL", `<p>Scanning <b>left to right</b> in step 3 still sorts the keys but reverses equal keys (<code>2f, 2c, 2a</code>). The sort is no longer stable, and a RadixSort built on it gives wrong answers.</p>`)}` },
    ],
    takeaways: ["Integer keys in [0, m−1]: count them.", "O(n + m) time; only when m = O(n).", "Prefix sums + right-to-left = stable."],
  },
  {
    slug: "4-bucket", nav: "BucketSort", title: "BucketSort",
    subtitle: "Uniform reals in [0, 1), n buckets",
    abstract: "Spread n values over n equal buckets by value, sort each small bucket, and concatenate. On uniform input each bucket holds about one value, so the expected time is linear.",
    tags: ["⌊n·x⌋", "expected O(n)", "worst O(n²)"],
    hero: "bucketMini", heroCaption: "Distribute by ⌊n·x⌋, sort each bucket, concatenate.",
    sections: [
      { id: "idea", title: "The idea", html: `
        <p>CountingSort needs integer keys. <b>BucketSort</b> handles reals, under a different assumption: the input comes from a random process that spreads values <b>uniformly over [0, 1)</b>.</p>
        <ol><li>Divide [0, 1) into <span class="math">n</span> equal buckets: bucket <span class="math">j</span> holds the values in <span class="math">[j/n, (j+1)/n)</span>.</li>
        <li>Distribute: value <span class="math">x</span> goes to bucket <span class="math">⌊n·x⌋</span>.</li>
        <li>Sort each bucket (insertion sort in CLRS; the slides suggest QuickSort).</li>
        <li>Go through the buckets in order and list their elements.</li></ol>
        <p>The buckets themselves are in order: every value in bucket <span class="math">j</span> is smaller than every value in bucket <span class="math">j + 1</span>. That is what the slides mean by “buckets are already sorted” — the elements <em>inside</em> a bucket are not, hence step 3. With uniform input each bucket holds about one element, so step 3 is cheap. The buckets are an extra array <code>B[0..n−1]</code> of lists, initially empty.</p>` },
      { id: "example", title: "A worked example", html: `
        <p>Ten values, so ten buckets of width 0.1: bucket <span class="math">⌊10x⌋</span> is just the first decimal digit. .78 → 7, .17 → 1, .39 → 3, .26 → 2, .72 → 7, .94 → 9, .21 → 2, .12 → 1, .23 → 2, .68 → 6. Each value is appended to the end of its list; then B[1] = .17 .12 becomes .12 .17, B[2] = .26 .21 .23 becomes .21 .23 .26, and B[7] = .78 .72 becomes .72 .78. Concatenating B[0] … B[9] gives the sorted list.</p>
        ${demo("bucket", "Demo 7 · bucketSort(A)", "step, or type your own reals", "Try <code>0.1, 0.15, 0.2, 0.05</code>: with n = 4 every value lands in B[0], the worst case.")}` },
      { id: "java", title: "BucketSort in Java", html: `
        ${codeBlock(CODE.BucketSort)}
        ${program("BucketExample")}
        ${predict("In the slides' exercise <code>0.81, 0.65, 0.91, 0.61, 0.55, 0.71</code> there are <span class=\"math\">n = 6</span> values, so the buckets have width 1/6. Which bucket does 0.65 go to? Which buckets hold more than one value?",
          `<p>Bucket ⌊6 × 0.65⌋ = ⌊3.9⌋ = 3. With 6 buckets the bucket is <b>not</b> the first decimal digit: 0.55, 0.61, 0.65 → 3; 0.71, 0.81 → 4; 0.91 → 5. Bucket 3 holds three values and bucket 4 two. These values are not uniform over [0, 1) — all are above 0.5 — so buckets 0–2 stay empty.</p>`)}` },
      { id: "cost", title: "How fast is BucketSort?", html: `
        <table><thead><tr><th>step</th><th>cost</th></tr></thead><tbody>
          <tr><td>create n lists, distribute n values</td><td>O(n)</td></tr>
          <tr><td>insertion-sort bucket j holding n<sub>j</sub> values</td><td>O(n<sub>j</sub>²)</td></tr>
          <tr><td>concatenate</td><td>O(n)</td></tr></tbody></table>
        <div class="math-block">T(n) = Θ(n) + Σ<sub>j</sub> O(n<sub>j</sub>²)</div>
        <ul><li><b>Worst case.</b> All values in one bucket: <span class="math">Σ n<sub>j</sub>² = n²</span>, so <span class="math">Θ(n²)</span> with insertion sort (or <span class="math">Θ(n log n)</span> with a good comparison sort per bucket).</li>
        <li><b>Average case.</b> With uniform input each value lands in bucket <span class="math">j</span> with probability <span class="math">1/n</span>, so <span class="math">E[n<sub>j</sub>] = 1</span> and <span class="math">E[n<sub>j</sub>²] = 2 − 1/n</span> (CLRS §8.4). Then <span class="math">E[T(n)] = Θ(n) + n · O(2 − 1/n) = Θ(n)</span>: <b>expected linear time</b>.</li></ul>
        <p>Extra space: <span class="math">O(n)</span>.</p>
        ${callout("pitfall", "PITFALL · STABILITY AND SKEW", `<p>BucketSort is stable only if values are appended in input order <em>and</em> each bucket is sorted with a stable sort such as insertion sort. With QuickSort inside the buckets, as on the slides, it is not stable; the “√” in the slides' table assumes a stable inner sort. And if the data is skewed, many values share a bucket and the linear time is gone. For values in <span class="math">[lo, hi)</span>, rescale: bucket <span class="math">⌊n(x − lo)/(hi − lo)⌋</span>.</p>`)}` },
    ],
    takeaways: ["Bucket ⌊n·x⌋; buckets are ordered.", "Uniform input → expected O(n).", "All in one bucket → O(n²)."],
  },
  {
    slug: "5-radix", nav: "RadixSort", title: "RadixSort",
    subtitle: "One stable pass per digit, least significant first",
    abstract: "Sort by the ones digit, then the tens, then the hundreds, each time with a stable bucket pass into ten queues. Stability carries the order of the lower digits forward, which is the whole correctness proof.",
    tags: ["LSD", "ten queues", "O(k(n + M))"],
    hero: "radixMini", heroCaption: "The slides' example: three passes, ten queues each.",
    sections: [
      { id: "video-4", title: "Watch: RadixSort in Java, why it works, and ten sorts compared", html: `
        <div class="card video" data-video="media/L12-4.mp4"></div>` },
      { id: "idea", title: "The idea", html: `
        <p>CountingSort is costly in time and space when the range <span class="math">m</span> is large: a million 9-digit numbers would need a billion counters. <b>RadixSort</b> sorts them one <b>digit</b> at a time, with a stable bucket pass of only 10 buckets per digit:</p>
        <ul><li>Sort by the <b>least significant digit</b> (LSD) first, then the next digit, and so on up to the <b>most significant digit</b> (MSD).</li>
        <li>Each pass distributes the numbers into 10 buckets by the current digit and collects them in bucket order. The pass must be <b>stable</b>; a <b>queue</b> per bucket gives this for free, because a queue is first-in, first-out.</li></ul>
        <p>The buckets keep the actual numbers, not only counts, since numbers with the same current digit can differ in other digits.</p>` },
      { id: "examples", title: "Two worked examples", html: `
        <p><b>Example 1.</b> Input 170, 045, 075, 090, 002, 024, 802, 066 (three digits each).</p>
        <ul><li>Pass 1, ones digit: queue 0: 170, 090 · queue 2: 002, 802 · queue 4: 024 · queue 5: 045, 075 · queue 6: 066 → <code>170, 090, 002, 802, 024, 045, 075, 066</code></li>
        <li>Pass 2, tens digit: queue 0: 002, 802 · 2: 024 · 4: 045 · 6: 066 · 7: 170, 075 · 9: 090 → <code>002, 802, 024, 045, 066, 170, 075, 090</code></li>
        <li>Pass 3, hundreds digit: queue 0: 002, 024, 045, 066, 075, 090 · 1: 170 · 8: 802 → <code>002, 024, 045, 066, 075, 090, 170, 802</code>, sorted.</li></ul>
        <p>In pass 3, six numbers share hundreds digit 0, and they come out in the right order <b>because</b> queue 0 kept the order of pass 2, in which they were already sorted by their last two digits.</p>
        ${demo("radix", "Demo 8 · LSD RadixSort with ten queues", "step, or type your own numbers", "The underlined digit is the key of the current pass. Switch the order to “MSD first” to see the passes undo each other.")}
        <p><b>Example 2.</b> 25, 32, 93, 22, 34. Pass 1 by the right digit: 32, 22, 93, 34, 25 (32 stays before 22). Pass 2, a <b>stable</b> sort by the left digit: 22, 25, 32, 34, 93. 22 and 25 share left digit 2 and come out as 22, 25 because 22 was first after pass 1; an unstable pass could output 25, 22.</p>` },
      { id: "java", title: "RadixSort in Java", html: `
        <p>The slides' code is C-like pseudocode with a <code>Queue</code> class. In Java, with <code>ArrayDeque</code> as the queue (<code>add</code> = enqueue, <code>remove</code> = dequeue):</p>
        ${codeBlock(CODE.RadixSort)}
        ${callout("note", "NOTE · DIFFERENCES FROM THE SLIDES' CODE", `<p>The slides write <code>Queue C = new Queue[10];</code> and then call <code>C[i].makeEmpty()</code>. In Java the array needs the type <code>Queue[]</code>, and <code>new Queue[10]</code> creates ten <code>null</code> references, not ten queues: each queue must be created (<code>C[i] = new Queue()</code>) before use, or the first call throws a <code>NullPointerException</code>. The version above creates the ten queues explicitly.</p>`)}
        ${program("RadixTrace")}
        <p>The last three lines answer the slides' exercise: 123, 251, 369, 278, 451, 222 by LSD RadixSort.</p>
        ${predict("What does <code>digit(802, 1)</code> return? And <code>digit(45, 2)</code>?",
          `<p><code>digit(802, 1)</code>: one division gives 80, and 80 % 10 = <b>0</b>, the tens digit. <code>digit(45, 2)</code>: two divisions give 4, then 0, and 0 % 10 = <b>0</b>. A shorter number simply has leading zeros, which is why 45 can be written 045.</p>`)}` },
      { id: "correct", title: "Why LSD RadixSort is correct", html: `
        <p>Let the input be <span class="math">n</span> numbers with <span class="math">k</span> digits in base <span class="math">M</span> (e.g. 236 in base 10: <span class="math">k = 3</span>). Each pass is a stable sort by one digit, from least to most significant.</p>
        ${callout("pattern", "CLAIM", `<p>After <span class="math">i</span> passes, the array is sorted by the numbers formed by their <span class="math">i</span> least significant digits.</p>`)}
        <p><b>Base case</b>, <span class="math">i = 0</span>: no digits considered; any order is sorted by “zero digits”.</p>
        <p><b>Inductive step.</b> Suppose that after <span class="math">i</span> passes the array is sorted by the last <span class="math">i</span> digits. Pass <span class="math">i + 1</span> stably sorts by digit <span class="math">i + 1</span>. Take any two numbers <span class="math">X, Y</span> with <span class="math">(i+1)</span>-th digits <span class="math">X<sub>i+1</sub>, Y<sub>i+1</sub></span>:</p>
        <ul><li><span class="math">X<sub>i+1</sub> &lt; Y<sub>i+1</sub></span>: the pass puts <span class="math">X</span> first — right, since they differ in a more significant digit.</li>
        <li><span class="math">X<sub>i+1</sub> &gt; Y<sub>i+1</sub></span>: <span class="math">Y</span> first — also right.</li>
        <li><span class="math">X<sub>i+1</sub> = Y<sub>i+1</sub></span>: <b>stability</b> keeps their order from before the pass, which by the hypothesis is correct for their last <span class="math">i</span> digits, hence for their last <span class="math">i + 1</span>.</li></ul>
        <p>After <span class="math">k</span> passes the array is sorted by all <span class="math">k</span> digits, that is, sorted. Stability is used only in the third case — and without it, the proof and the algorithm fail.</p>` },
      { id: "time", title: "Running time", html: `
        <p>With <span class="math">n</span> numbers of <span class="math">k</span> digits in base <span class="math">M</span> (digits in <span class="math">{0, …, M − 1}</span>), each pass costs <span class="math">O(M)</span> to create and walk the <span class="math">M</span> queues and <span class="math">O(n)</span> to distribute and copy back the numbers:</p>
        <div class="math-block">T = O(k (M + n)) &nbsp;&nbsp; extra space O(n + M)</div>
        <p>When <span class="math">k</span> is constant and <span class="math">M = O(n)</span>, RadixSort runs in <b>linear time</b>. The summary table's <span class="math">O(nk)</span> assumes <span class="math">M ≤ n</span>.</p>
        <p><b>Choosing the base.</b> <span class="math">k</span> and <span class="math">M</span> trade off. Numbers below 10⁹ have 9 decimal digits; in base <span class="math">2<sup>16</sup> = 65536</span> they have only 2 “digits” (low and high 16 bits): two passes of <span class="math">O(n + 65536)</span>. CountingSort is the extreme case: one digit with <span class="math">M = m</span>.</p>` },
      { id: "msd", title: "Can we start from the most significant digit?", html: `
        <p>Not by running the same stable passes in the opposite order. Sort 478, 430, 356 by hundreds, then tens, then ones:</p>
        <table><thead><tr><th>pass</th><th>key digits</th><th>result</th></tr></thead><tbody>
          <tr><td>hundreds</td><td>4, 4, 3 → 3, 4, 4</td><td>356, 478, 430</td></tr>
          <tr><td>tens</td><td>5, 7, 3 → 3, 5, 7</td><td>430, 356, 478</td></tr>
          <tr><td>ones</td><td>0, 6, 8 → 0, 6, 8</td><td>430, 356, 478</td></tr></tbody></table>
        <p>430, 356, 478 is wrong: the last pass sorts by the <em>least</em> important digit and destroys the order of the more important ones. (The slide lists the first digits as “4, 4, 4”; they are 4, 4, 3.)</p>
        ${demo("radixMsd", "Demo 9 · MSD first, the wrong way", "step", "Same passes, opposite order. Switch back to “LSD first” to fix it.")}
        ${program("MsdWrongOrder")}
        <p><b>MSD RadixSort</b> does work when organised differently: distribute by the most significant digit, then sort <b>each bucket separately and recursively</b> by the next digit, and concatenate. Numbers in different buckets are never compared again. This is how strings are sorted in dictionary order. See Exercise 7 for the code.</p>` },
      { id: "quick", title: "RadixSort or QuickSort?", html: `
        <p>If RadixSort is linear and QuickSort is <span class="math">Θ(n log n)</span>, why do libraries still prefer QuickSort?</p>
        <ul><li><b>Constant factors.</b> RadixSort's <span class="math">Θ(n)</span> hides <span class="math">k</span> passes that touch every element twice and allocate queues. QuickSort's inner loop is a comparison and an index step on a contiguous array, which caches love. <span class="math">log n</span> is only about 20 for a million.</li>
        <li><b>Memory.</b> RadixSort needs <span class="math">O(n + M)</span> extra memory; QuickSort works in place, with an <span class="math">O(log n)</span> recursion stack on average.</li>
        <li><b>Generality.</b> RadixSort needs keys that split into digits. QuickSort sorts anything with a comparison.</li>
        <li>The linear bound needs <span class="math">k</span> constant; for numbers with <span class="math">Θ(log n)</span> digits RadixSort is <span class="math">Θ(n log n)</span> too.</li></ul>` },
    ],
    takeaways: ["One stable pass per digit, LSD first.", "Correct by induction; stability is the key step.", "O(k(n + M)) time, O(n + M) space."],
  },
  {
    slug: "6-compare", nav: "Ten sorts", title: "Ten Classic Sorting Algorithms",
    subtitle: "Time, space and stability side by side",
    abstract: "One table for every sort in the course so far, with four of the slide's cells corrected, and a rule of thumb for choosing.",
    tags: ["comparison table", "stability", "how to choose"],
    hero: "growthMini", heroCaption: "Operation counts of the growth rates in the table, for n from 10 to a million.",
    sections: [
      { id: "table", title: "The table", html: `
        ${demo("sortTable", "Demo 10 · Filter the ten sorts", "tick your requirements")}
        <p><span class="math">m</span> is the key range of CountingSort (the slides' table calls it <span class="math">k</span>); <span class="math">k</span> is the number of digits and <span class="math">M</span> the base of RadixSort. “no*”: not stable as usually written, but can be made stable by sorting (key, original index) pairs, at <span class="math">O(n)</span> extra space. Bubble sort's <span class="math">O(n)</span> best case needs the early exit when a pass makes no swap. HeapSort comes in Lecture 17.</p>` },
      { id: "corrections", title: "Four cells corrected", html: `
        <p>This table differs from the slide's in four places:</p>
        <ul><li><b>ShellSort best case</b>: <span class="math">O(n log n)</span>, not <span class="math">O(n)</span> — even on sorted input it runs about <span class="math">log n</span> passes, each looking at every element.</li>
        <li><b>QuickSort extra space</b>: the recursion stack, <span class="math">O(log n)</span> on average (<span class="math">O(n)</span> in the worst case unless it recurses on the smaller part first), not <span class="math">O(1)</span>.</li>
        <li><b>CountingSort extra space</b>: the stable version needs the output array, so <span class="math">O(n + m)</span>; only the keys-only version gets by with <span class="math">O(m)</span>.</li>
        <li><b>RadixSort</b>: time <span class="math">O(k(n + M))</span>, which is <span class="math">O(nk)</span> only when <span class="math">M = O(n)</span>; extra space includes the <span class="math">M</span> buckets.</li></ul>` },
      { id: "choose", title: "How to choose", html: `
        <ul><li>Small or nearly sorted input: <b>insertion sort</b>.</li>
        <li>General purpose, in place, fast in practice: <b>QuickSort</b> with random pivots.</li>
        <li>Guaranteed <span class="math">O(n log n)</span>, or stability needed: <b>MergeSort</b> (Java's <code>Arrays.sort</code> on objects uses a merge sort for this reason).</li>
        <li>Guaranteed <span class="math">O(n log n)</span> in place: <b>HeapSort</b>.</li>
        <li>Medium arrays, very little code, no recursion: <b>ShellSort</b>.</li>
        <li>Integer keys in a small range: <b>CountingSort</b>. Integers with few digits: <b>RadixSort</b>. Reals spread evenly over a known range: <b>BucketSort</b>.</li></ul>
        ${demo("growth", "Demo 11 · How far apart are the growth rates?", "drag n")}
        <p>At <span class="math">n</span> = a million, <span class="math">n²</span> is <span class="math">10¹²</span> while <span class="math">n log₂ n</span> is about <span class="math">2 × 10⁷</span>: the gap between quadratic and the rest dwarfs the gap between <span class="math">n log n</span> and <span class="math">n</span>. That is why constant factors decide between QuickSort and RadixSort, but never rescue a quadratic sort on large input.</p>` },
    ],
    takeaways: ["Stable + O(n log n) worst: MergeSort.", "Linear time needs assumptions on the keys.", "Quadratic is the gap that matters."],
  },
  {
    slug: "7-summary", nav: "Summary", title: "Summary and Practice",
    subtitle: "Check yourself, then sort by hand and in Java",
    abstract: "A one-page map of the lecture, six self-check questions, and eight exercises with solutions.",
    tags: ["knowledge map", "self-check", "exercises"],
    hero: "toc",
    sections: [
      { id: "map", title: "Knowledge map", html: `<div class="map">
        <div class="card"><h3>ShellSort</h3><ul><li>Insertion-sort elements <b>h apart</b></li><li>Shrink h; last gap is <b>1</b></li><li>In place, <b>not stable</b></li></ul></div>
        <div class="card"><h3>ShellSort cost</h3><ul><li>Depends on the <b>increments</b></li><li>Halving: Θ(n²) on a bad input</li><li>Knuth/Hibbard: Θ(n<sup>3/2</sup>); typical ≈ n<sup>1.25</sup></li></ul></div>
        <div class="card"><h3>CountingSort</h3><ul><li>Integer keys in [0, m−1]</li><li><b>O(n + m)</b> time</li><li>Prefix sums + right-to-left = <b>stable</b></li></ul></div>
        <div class="card"><h3>BucketSort</h3><ul><li>Reals uniform on [0, 1)</li><li>Bucket <b>⌊n·x⌋</b>, sort, concatenate</li><li>Expected O(n), worst O(n²)</li></ul></div>
        <div class="card"><h3>RadixSort</h3><ul><li><b>LSD first</b>, one stable pass per digit</li><li>Ten queues per pass</li><li><b>O(k(n + M))</b>; correct by induction</li></ul></div>
        <div class="card"><h3>The big picture</h3><ul><li>Comparison sorts: <b>Ω(n log n)</b></li><li>Linear sorts assume something about keys</li><li>Choose by size, keys, memory, stability</li></ul></div></div>` },
      { id: "check", title: "Check your understanding", html: `<div data-demo="quiz"><div class="demo-body"></div></div>` },
      { id: "exercises", title: "Exercises", html: `
        <p>★ trace · ★★ write · ★★★ extend. The solutions were compiled and run with the classes of this lecture (<code>ShellSort</code>, <code>RadixSort</code>, …).</p>
        <h3>Exercise 1 ★ (trace ShellSort)</h3>
        <p>Sort <code>9, 8, 7, 6, 5, 4, 3, 2, 1</code> with the halving increments of <code>shellSort</code>. Write the array after each pass and count the shifts.</p>
        <details class="reveal"><summary>Solution</summary><p><span class="math">n = 9</span>, so the increments are 4, 2, 1.</p>${program("Exercise1")}<p>ShellSort makes 6 + 2 + 0 = 8 shifts; the last pass finds the array already sorted. Insertion sort alone would make 36 (every pair is an inversion: 9 · 8 / 2).</p></details>
        <h3>Exercise 2 ★ (trace stable CountingSort)</h3>
        <p>Run the stable CountingSort by hand on the keys <code>3, 1, 3, 0, 1</code> (labels a–e). Show <code>count</code> after counting, after the prefix sums, and the output. (Demo 6 accepts these keys.)</p>
        <details class="reveal"><summary>Solution</summary><p>Counting: <code>count = [1, 2, 0, 2]</code>. Prefix sums: <code>[1, 3, 3, 5]</code>. Right to left: 1e → position <code>--count[1]</code> = 2; 0d → 0; 3c → 4; 1b → 1; 3a → 3. Output <code>0d, 1b, 1e, 3a, 3c</code>: equal keys kept their order.</p></details>
        <h3>Exercise 3 ★★ (CountingSort for letters)</h3>
        <p>Write <code>static String sortLetters(String s)</code> that sorts the lower-case letters of <code>s</code> with CountingSort (26 buckets).</p>
        <details class="reveal"><summary>Solution</summary>${program("SortLetters")}</details>
        <h3>Exercise 4 ★★ (Knuth's increments)</h3>
        <p>Which increments does <code>knuthGaps(n)</code> produce for <span class="math">n</span> = 13, 100 and 1000? Sort the 13 numbers of the worked example with them.</p>
        <details class="reveal"><summary>Solution</summary>${program("Exercise4")}<p>For <span class="math">n = 13</span> Knuth's sequence is just 4, 1 (13 is not below <span class="math">n</span>): 9 + 20 = 29 shifts, a few more than the 23 of 5, 3, 1. Increment sequences only show their differences on larger inputs.</p></details>
        <h3>Exercise 5 ★★ (RadixSort with counting sort)</h3>
        <p>Rewrite <code>sortByDigit</code> without queues: use the stable, prefix-sum CountingSort on the digit, with 10 counters and an output array.</p>
        <details class="reveal"><summary>Solution</summary>${program("RadixCounting")}<p>Two arrays of size <span class="math">n</span> and 10 counters per pass instead of ten linked queues: this is how RadixSort is usually implemented.</p></details>
        <h3>Exercise 6 ★★ (negative numbers)</h3>
        <p>LSD RadixSort as written only handles non-negative numbers (<code>digit</code> of a negative number is negative). How would you sort <code>-5, 12, -30, 7, 0, -1</code>?</p>
        <details class="reveal"><summary>Solution</summary><p>(1) Add <span class="math">−min</span> to every number, radix-sort, subtract it again — the same shift as <code>countingSortRange</code>. Or (2) split into negatives and non-negatives, radix-sort the absolute values of the negatives and reverse them, and put them in front. Either way: <code>-30, -5, -1, 0, 7, 12</code>.</p></details>
        <h3>Exercise 7 ★★★ (MSD RadixSort)</h3>
        <p>Write a recursive MSD RadixSort: distribute <code>a[lo..hi)</code> into ten buckets by digit <code>d</code>, write the buckets back, and recursively sort each bucket with two or more elements by digit <code>d - 1</code>.</p>
        <details class="reveal"><summary>Solution</summary>${program("MsdRadix")}<p>Unlike the wrong-order passes of Demo 9, the recursive calls never mix numbers from different buckets, so a less significant digit can never undo a more significant one.</p></details>
        <h3>Exercise 8 ★★★ (which sort?)</h3>
        <p>Pick a sort and say why: (a) one million exam scores, integers 0–100; (b) one million 64-bit user IDs; (c) 20 names, already almost in order; (d) records that must keep the order of equal keys, with a guaranteed <span class="math">O(n log n)</span> bound.</p>
        <details class="reveal"><summary>Solution</summary><p>(a) CountingSort: <span class="math">m = 101 ≪ n</span>. (b) RadixSort, e.g. with 16-bit digits (4 passes of <span class="math">O(n + 65536)</span>), or QuickSort if memory is tight. (c) Insertion sort: <span class="math">O(n + inversions)</span>, tiny constants. (d) MergeSort: stable and <span class="math">O(n log n)</span> worst case.</p></details>` },
      { id: "terms", title: "Key terms and further reading", html: `
        <p class="tags">${["comparison-based sort", "non-comparison sort", "ShellSort", "increment (gap) sequence", "h-sorted", "inversion", "CountingSort", "prefix sums", "stable sort", "BucketSort", "uniform distribution", "RadixSort", "least significant digit (LSD)", "most significant digit (MSD)", "base (radix)"].map((t) => `<span class="tag">${t}</span>`).join("")}</p>
        <ul><li>T. H. Cormen et al., <em>Introduction to Algorithms</em> (CLRS), Chapter 8: Sorting in linear time — the lower bound, counting sort, radix sort, bucket sort.</li>
        <li>M. A. Weiss, <em>Data Structures and Algorithm Analysis in Java</em>, §7.4 (Shellsort) and §7.11 (linear-time sorts).</li>
        <li>VisuAlgo, sorting animations: <a href="https://visualgo.net/en/sorting" target="_blank" rel="noopener">visualgo.net/en/sorting</a></li></ul>` },
    ],
    takeaways: ["ShellSort: long jumps, then gap 1.", "Counting / Bucket / Radix: values, not comparisons.", "Stability makes RadixSort correct."],
  },
];

const QUIZ = [
  { q: "Which statement about an array that is 5-sorted is always true?",
    opts: ["It is sorted", "<code>a[i] &lt;= a[i + 5]</code> for every valid <code>i</code>", "<code>a[i] &lt;= a[i + 1]</code> for every valid <code>i</code>", "It is also 10-sorted and 1-sorted"],
    a: 1, why: "5-sorted means each subsequence of elements 5 apart is sorted, i.e. <code>a[i] &lt;= a[i+5]</code>. It does follow that it is 10-sorted (chain two steps), but not that it is 1-sorted." },
  { q: "ShellSort with halving increments on <code>4, 12, 1, 10, 3, 11, 2, 9</code>: how many shifts does the <b>last</b> pass (gap 1) make?",
    opts: ["0", "3", "6", "28"],
    a: 2, why: "Before the last pass the array is <code>1, 9, 2, 10, 3, 11, 4, 12</code>, with 1 + 2 + 3 = 6 inversions, and insertion sort makes one shift per inversion." },
  { q: "CountingSort sorts <span class=\"math\">n</span> integers in <span class=\"math\">[0, m − 1]</span>. Its running time is",
    opts: ["O(n log n)", "O(n)", "O(n + m)", "O(n · m)"],
    a: 2, why: "O(m) for the counters and O(n) for counting and writing back. It is linear only when m = O(n)." },
  { q: "In the stable CountingSort, why is the input scanned from <b>right to left</b> when placing records?",
    opts: ["It is faster", "So that equal keys keep their input order", "So that the prefix sums are correct", "To handle negative keys"],
    a: 1, why: "<code>count[k]</code> starts at the end of key k's slots and moves left. Scanning from the right puts the last record with key k in the last slot, so equal keys keep their order." },
  { q: "BucketSort with <span class=\"math\">n = 5</span>: which bucket does 0.47 go to?",
    opts: ["0", "2", "4", "it depends on the other values"],
    a: 1, why: "⌊5 × 0.47⌋ = ⌊2.35⌋ = 2. The bucket depends only on n and the value." },
  { q: "LSD RadixSort, pass 2 (tens digit) on <code>170, 090, 002, 802, 024, 045, 075, 066</code>. Which number comes right after 066 in the output?",
    opts: ["075", "090", "170", "802"],
    a: 2, why: "Tens digits: 7, 9, 0, 0, 2, 4, 7, 6. Queue 7 holds 170 then 075 (in that input order), so after 066 (queue 6) comes 170, then 075. Output: 002, 802, 024, 045, 066, 170, 075, 090." },
  { q: "Why must each pass of LSD RadixSort be stable?",
    opts: ["Otherwise it takes O(n²) time", "So that numbers with the same current digit keep the order given by their lower digits", "Because queues are stable", "It need not be; any sort per digit works"],
    a: 1, why: "In the inductive step, two numbers with equal current digit must stay in the order of the previous passes. Only a stable pass guarantees it." },
];
