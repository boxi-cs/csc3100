// Chapter content, adapted from notes/L05-asymptotic-notations.md. Code is copied from the note.

const demo = (name, title, instr, hint = "") =>
  `<div class="card demo" data-demo="${name}"><div class="head"><span class="title">${title}</span><span>${instr}</span></div>
   <div class="demo-body"></div>${hint ? `<p class="hint">${hint}</p>` : ""}</div>`;

const callout = (kind, label, body) => `<div class="callout ${kind}"><b>${label}</b>${body}</div>`;
const predict = (q, a) => callout("predict", "PREDICT", `<p>${q}</p><details class="reveal"><summary>Show the answer</summary>${a}</details>`);
const m = (s) => `<span class="math">${s}</span>`;
const mb = (s) => `<div class="math-block">${s}</div>`;
const table = (head, rows) => `<div style="overflow-x:auto"><table><tr>${head.map((h) => `<th>${h}</th>`).join("")}</tr>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("")}</table></div>`;

const LECTURE = {
  number: 5,
  title: "Asymptotic Notations",
  tagline: "Measuring an algorithm without a stopwatch",
  lead: "Count basic operations, then keep only how fast the count grows. Big-Oh, Big-Omega and Big-Theta, with the constants c and n₀ you can find by dragging a slider, and growth curves you can race against each other.",
  heroDemo: "growthMini",
  heroLabel: "How the common classes grow",
  heroCaption: "At n = 8 the curves are close; at n = 32, 2ⁿ is over four billion while n log n is 160.",
  whyTitle: "Why asymptotic notation is worth learning",
  whySub: "Three ideas you will use in every lecture from now on",
  why: [
    ["Machine-independent cost", "Count <b>basic operations</b> as a function of the input size n. The count is the same on every computer."],
    ["Only the growth matters", "<b>4n + 4</b> and <b>10000n</b> are both linear; <b>3n² + 8n + 5</b> is quadratic. Constants and lower terms are noise for large n."],
    ["A shared vocabulary", "<b>O</b> (upper bound), <b>Ω</b> (lower bound) and <b>Θ</b> (tight bound) let you compare any two algorithms in one line."],
  ],
  ctaTitle: "Ready to count?",
  minutes: "About 60–75 minutes",
  videos: {
    "media/L05-1.mp4": "Lecture 5 · Part 1 — Counting basic operations (10.1 min)",
    "media/L05-2.mp4": "Lecture 5 · Part 2 — Big-Oh, an upper bound (10.3 min)",
    "media/L05-3.mp4": "Lecture 5 · Part 3 — Rules and growth classes (9.7 min)",
    "media/L05-4.mp4": "Lecture 5 · Part 4 — Big-Omega and Big-Theta (9.1 min)",
  },
};

const CHAPTERS = [
  {
    slug: "1-efficiency", nav: "Efficiency", title: "How to Measure Efficiency",
    subtitle: "Why we count operations instead of timing programs",
    abstract: "A stopwatch measures one implementation, on one machine, on the inputs you tried. Counting basic operations as a function of n measures the algorithm itself.",
    tags: ["experiments", "basic operations", "worst case"],
    hero: "code:sumPseudo", heroCaption: "sum(A, n): how many basic operations?",
    sections: [
      { id: "video-1", title: "Watch: Counting basic operations", html: `
        <div class="card video" data-video="media/L05-1.mp4"></div>` },
      { id: "experiments", title: "Experiments", html: `
        <p>The most direct way to find out how fast an algorithm is: implement it, run it on some inputs, and time it. In Java:</p>
        ${codeBlock(`long start = System.nanoTime();
int result = sum(data, data.length);
long elapsed = System.nanoTime() - start;     // nanoseconds, different on every run
System.out.println("took " + elapsed / 1_000_000.0 + " ms");`)}
        <p>Experiments are useful, but they have two problems.</p>
        <ul><li><b>They only tell you about the inputs you tried.</b> An algorithm can be fast on the inputs in your experiment and slow on others, for example when the value you search for happens to be near the front of every test array.</li>
        <li><b>They are hard to make fair.</b> To compare two algorithms by timing, both must be implemented by the same person, in the same language, with the same care, and run on the same hardware and software. Change any of these and the numbers change. A time measured on a laptop says little about a supercomputer.</li></ul>` },
      { id: "basic", title: "Basic operations", html: `
        <p>So instead we analyse the algorithm itself. We describe it in <b>pseudocode</b> (or simple Java) and count how many <b>basic operations</b> it performs. A basic operation is a step simple enough that a computer does it in a fixed amount of time:</p>
        ${table(["kind", "examples"], [
          ["arithmetic", "<code>a + b * c + d / e</code>, <code>a % 7</code>"],
          ["assigning a value to a variable", "<code>x = 3</code>"],
          ["indexing an array, reading a field", "<code>arr[i]</code>, <code>arr.length</code>, <code>student.name</code>"],
          ["calling a method", "<code>x = factorial(n)</code> (the call itself, not the work inside)"],
          ["returning from a method", "<code>return y</code>"],
          ["comparison", "<code>x == y</code>, <code>x &gt; y</code>, <code>x &lt; y</code>, <code>x &gt;= y</code>, <code>x &lt;= y</code>, <code>x != y</code>"]])}
        ${callout("pattern", "ASSUMPTION", `<p><b>Each basic operation takes constant time.</b> We don't care whether an addition takes 0.3 or 0.5 nanoseconds; we only count how many there are.</p>`)}` },
      { id: "function", title: "The running time as a function of n", html: `
        <p>The theoretical analysis:</p>
        <ol><li>describes the algorithm in pseudocode;</li>
        <li>expresses the running time as a <b>function of the input size ${m("n")}</b>, written ${m("T(n)")} or ${m("g(n)")};</li>
        <li>takes <b>all possible inputs</b> into account, not only the ones we tried;</li>
        <li>is <b>independent of the hardware and software</b>: the count is the same on every machine.</li></ol>
        <p>Which input should we count for? Usually the <b>worst case</b>: the input of size ${m("n")} that makes the algorithm do the most work. A guarantee is what users need: if a search engine sometimes takes 100 seconds, it does not help that it usually takes 0.1. The <b>average case</b> is hard to define (average over which inputs, with which probabilities?) and is often as bad as the worst case anyway. The <b>best case</b> is rarely interesting: almost any algorithm is fast on some lucky input.</p>` },
    ],
    takeaways: ["Timing measures a program, not an algorithm.", "Count basic operations, each constant time.", "Express the count as T(n), usually for the worst case."],
  },
  {
    slug: "2-counting", nav: "Counting", title: "Counting Basic Operations",
    subtitle: "4n + 4, best and worst cases, and 3n² + 8n + 5",
    abstract: "Three algorithms counted line by line: the sum of an array, linear search, and the maximum subarray sum. The counts are exact, tedious, and mostly noise.",
    tags: ["sum: 4n + 4", "linear search", "maxSubArraySum"],
    hero: "maxSubMini", heroCaption: "maxSubArraySum tries every (i, j): about n²/2 subarrays.",
    sections: [
      { id: "sum", title: "Summing an array", html: `
        ${codeBlock(CODE.sumPseudo)}
        <p>Count each line, using the rule that each basic operation costs 1:</p>
        ${table(["line", "what runs", "count"], [
          ["1", "one assignment", m("1")],
          ["2", "the loop is really <code>for (i = 0; i &lt; n; i++)</code>: assign <code>i = 0</code> once, test <code>i &lt; n</code> n + 1 times (the last test fails), increment <code>i</code> n times", m("2n + 2")],
          ["3", "n times: index <code>A[i]</code> and add", m("2n")],
          ["4", "one return", m("1")]])}
        ${mb("T(n) = 1 + (2n + 2) + 2n + 1 = 4n + 4")}
        <p>(We count <code>i++</code> as one operation and <code>tempSum += A[i]</code> as two. Other books count a little differently. The constants change; as we will see, nothing that matters does.)</p>
        ${demo("sumOps", "Demo 1 · Count the operations of sum(A, n)", "drag n, then step (← →)", "The amber box is the line that just ran. At the end the total equals 4n + 4 for every n.")}
        <p>To check the count, put a counter into the Java version and increase it at every basic operation:</p>
        ${codeBlock(CODE.sumCount)}
        ${codeBlock(CODE.sumCountOut, "out")}
        <p>Counting every single operation like this is tedious, and the exact constants (is it ${m("4n + 4")} or ${m("5n + 3")}?) depend on conventions. The rest of the lecture shows how to keep only what matters: here, that the cost is <b>proportional to n</b>.</p>` },
      { id: "input", title: "The input matters, not only its size", html: `
        <p>The running time depends on the <b>input size</b>: the number of elements the algorithm can access. Passing an array to a method only passes a reference, but the method can read all ${m("n")} elements, so the input size is ${m("n")}.</p>
        <p>For many algorithms the size is not the whole story. <b>Linear search</b> looks for a value <code>x</code> and returns its index, or −1:</p>
        ${codeBlock(CODE.searchPseudo)}
        ${demo("linearSearch", "Demo 2 · Linear search", "pick x, then step", "Try 3 (best case), 20, and 5 (not there: worst case).")}
        ${codeBlock(CODE.linearSearchCount)}
        ${codeBlock(CODE.linearSearchOut, "out")}
        <p>For the same ${m("n = 9")} the cost ranges from 1 comparison (<b>best case</b>: <code>x</code> is first) to 9 (<b>worst case</b>: <code>x</code> is last or missing). The worst case makes ${m("n")} comparisons; its exact count of all basic operations is about ${m("3n + 3")}, again proportional to ${m("n")}.</p>
        ${predict("Linear search on an array of n = 1000 distinct numbers. If <code>x</code> is equally likely to be any of the 1000 elements, how many comparisons does a successful search make on average?",
          `<p>If <code>x</code> is at index i, the search makes i + 1 comparisons. The average is (1 + 2 + ⋯ + 1000)/1000 = 1001/2 = 500.5: about half of the worst case, still proportional to n. This is the sense in which the average case “is often as bad as the worst case”.</p>`)}` },
      { id: "maxsub", title: "Practice: the maximum subarray sum", html: `
        <p>A harder count. <code>maxSubArraySum</code> finds the largest sum of a contiguous piece <code>A[i] + … + A[j]</code> by trying every start <code>i</code> and every end <code>j</code>:</p>
        ${codeBlock(CODE.maxSubPseudo)}
        <p>The inner loop runs ${m("n − i")} times for each ${m("i")}: ${m("n, n − 1, …, 1")} times. Write ${m("S = n + (n − 1) + ⋯ + 1 = n(n + 1)/2")}.</p>
        ${table(["line", "count"], [["1", "2 (index <code>A[0]</code>, assign)"], ["2", m("2n + 2")], ["3", m("n")], ["4", m("(2n + 2) + (2(n−1) + 2) + ⋯ + (2·1 + 2) = 2S + 2n")], ["5", m("2S") + " (index, add)"], ["6", m("S")], ["7", "at most " + m("S") + " (only when the test is true)"], ["8", m("1")]])}
        ${mb("2 + (2n + 2) + n + (2S + 2n) + 2S + S + S + 1 = 6S + 5n + 5 = 3n² + 8n + 5")}
        <p>So the worst case is <b>at most</b> ${m("3n² + 8n + 5")} operations. It is an upper bound rather than the exact worst case: it charges line 7 every time, but no input makes the test true every time (the very first test compares <code>A[0]</code> with itself, and it is false). The exact worst case is a little smaller and much harder to work out. This is typical: exact counts are often hard, while a good upper bound is easy.</p>
        ${demo("maxSub", "Demo 3 · maxSubArraySum, one (i, j) at a time", "edit A, then step", "Row i of the table holds the sums A[i..j]. Green: the current maximum. Line 7 is the only line whose count depends on the values: it runs once per new maximum, never once per cell, so the bound 3n² + 8n + 5 is never reached.")}
        ${codeBlock(CODE.maxSubArrayCount)}
        ${codeBlock(CODE.maxSubArrayOut, "out")}
        <p>Even with the bound in hand, ${m("3n² + 8n + 5")} is more detail than we want. When ${m("n = 1000")}, the ${m("3n²")} term is 3,000,000 while ${m("8n + 5")} is 8,005: the lower terms are noise. What matters is that the count grows like ${m("n²")}: double ${m("n")} and the work roughly quadruples. <b>Asymptotic analysis</b> makes “grows like” precise.</p>` },
    ],
    takeaways: ["sum: 4n + 4 operations.", "Linear search: 1 to n comparisons; the input matters.", "maxSubArraySum: at most 3n² + 8n + 5 — too much detail."],
  },
  {
    slug: "3-big-oh", nav: "Big-Oh", title: "Big-Oh: an Upper Bound",
    subtitle: "g(n) ≤ c · f(n) for all n ≥ n₀",
    abstract: "Big-Oh throws away constant factors and small inputs. To prove g(n) = O(f(n)), exhibit the two constants c and n₀.",
    tags: ["definition", "finding c and n₀", "log bases"],
    hero: "bigOhMini", heroCaption: "3n² + 8n + 5 ≤ 4n² from n₀ = 9 on.",
    sections: [
      { id: "video-2", title: "Watch: Big-Oh, an upper bound", html: `
        <div class="card video" data-video="media/L05-2.mp4"></div>` },
      { id: "definition", title: "The definition", html: `
        <p><em>Asymptotic</em> describes the behaviour of a function as its variable approaches a limit, here as ${m("n → ∞")}. We compare running times by how fast they grow for large ${m("n")}.</p>
        ${callout("pattern", "DEFINITION · BIG-OH", `<p>${m("g(n) = O(f(n))")} if there exist two <b>positive constants</b> ${m("c")} and ${m("n₀")} such that</p>${mb("g(n) ≤ c · f(n) &nbsp; for all n ≥ n₀.")}`)}
        <p>Read it as “${m("g")} grows asymptotically <b>no faster</b> than ${m("f")}”. Usually ${m("g")} is the complicated count and ${m("f")} is a simple function such as ${m("n")} or ${m("n²")}. Each part of the definition throws away something we don't care about:</p>
        <ul><li><b>“for all n ≥ n₀”</b>: we only care about large inputs. Below ${m("n₀")}, ${m("g")} may even be bigger than ${m("c · f")}.</li>
        <li><b>“g(n) ≤ c · f(n)”</b>: ${m("g")} may be bigger than ${m("f")}, as long as it stays below some <em>constant multiple</em> of ${m("f")}. Constant factors (the 3 in ${m("3n²")}, the speed of your machine) are ignored.</li></ul>
        <p>To prove ${m("g(n) = O(f(n))")} you must <b>exhibit</b> ${m("c")} and ${m("n₀")} and show the inequality for every ${m("n ≥ n₀")}. To disprove it you must show that <b>no</b> choice of ${m("c")} and ${m("n₀")} works.</p>` },
      { id: "find", title: "Finding c and n₀", html: `
        <p><b>Example.</b> ${m("3n² + 8n + 5 = O(n²)")}. For ${m("n ≥ 1")} we have ${m("8n ≤ 8n²")} and ${m("5 ≤ 5n²")}, so</p>
        ${mb("3n² + 8n + 5 ≤ 3n² + 8n² + 5n² = 16n² &nbsp; for all n ≥ 1.")}
        <p>So ${m("c = 16, n₀ = 1")} works. Other pairs work too: a smaller ${m("c")} needs a larger ${m("n₀")}. With ${m("c = 4")} we need ${m("n² − 8n − 5 ≥ 0")}, which holds from ${m("n = 9")} on. With ${m("c = 3")} or less no ${m("n₀")} works, because ${m("3n² + 8n + 5 > 3n²")} for every ${m("n")}.</p>
        ${demo("bigOh", "Demo 4 · Find c and n₀", "drag c; move n₀ with ← →", "Shaded: n ≥ n₀. Red dots: places in the shaded region where g(n) &gt; c·f(n). The bound is proved when there are none — the demo checks every integer up to 10⁶, like FindN0.")}
        <p>The program finds the smallest ${m("n₀")} for several values of ${m("c")} by checking ${m("n = 1, …, 10⁶")}. (A check up to a million is evidence, not a proof. The algebra above is the proof.)</p>
        ${codeBlock(CODE.findN0)}
        ${codeBlock(CODE.findN0Out, "out")}
        ${callout("pitfall", "PITFALL", `<p>${m("n₀")} is the point <b>from which on</b> the inequality holds for <em>every</em> larger ${m("n")}, not the first ${m("n")} where it happens to hold. Two curves can cross several times. When you pick ${m("n₀")}, check that ${m("g(n) ≤ c · f(n)")} stays true for all ${m("n ≥ n₀")}, as the program does by recording the <em>last</em> failure.</p>`)}` },
      { id: "examples", title: "Linear functions and logarithms", html: `
        <p><b>Linear functions.</b> For ${m("g(n) = an + b")} with ${m("a, b ≥ 0")}: ${m("g(n) = O(n)")}. <em>Proof.</em> For ${m("n ≥ 1")}, ${m("b ≤ bn")}, so ${m("an + b ≤ (a + b)n")}. Take ${m("c = a + b")}, ${m("n₀ = 1")}. (If ${m("a = b = 0")}, take ${m("c = 1")}: the constant must be positive.) So the sum of an array, ${m("4n + 4")}, is ${m("O(n)")} with ${m("c = 8, n₀ = 1")}.</p>
        <p><b>Logarithms in different bases.</b> For bases ${m("a, b > 1")}: ${m("log<sub>a</sub> n = O(log<sub>b</sub> n)")}. <em>Proof.</em> By the change-of-base formula ${m("log<sub>a</sub> n = log<sub>b</sub> n / log<sub>b</sub> a")}, and ${m("log<sub>b</sub> a")} is a positive constant. Take ${m("c = 1 / log<sub>b</sub> a")}, ${m("n₀ = 1")}.</p>
        <p>So <b>the base of a logarithm does not matter</b> inside ${m("O")}: ${m("O(log₂ n) = O(log₁₀ n)")}, and we simply write ${m("O(log n)")}.</p>
        ${codeBlock(CODE.logBase)}
        ${codeBlock(CODE.logBaseOut, "out")}
        <p>The ratio is always ${m("log₂ 10 ≈ 3.3219")}. In this course, ${m("log n")} means ${m("log₂ n")} unless stated otherwise.</p>` },
      { id: "tight", title: "Practice: is 2n = O(n²)?", html: `
        <p><b>Prove or disprove:</b> ${m("g(n) = 2n = O(n²)")}. We need ${m("2n ≤ cn²")} for all ${m("n ≥ n₀")}. Dividing by ${m("n &gt; 0")}, this is ${m("2 ≤ cn")}. Take ${m("c = 2, n₀ = 1")}. So yes, ${m("2n = O(n²)")}. (Pick the third example in Demo 4.)</p>
        <p>But isn't ${m("2n = O(n)")}? It is. Both statements are true, because Big-Oh is only an <b>upper bound</b>, and a function has many upper bounds:</p>
        ${mb("2n = O(n) = O(n log n) = O(n²) = O(n³) = O(2ⁿ)")}
        <p>Saying “linear search is ${m("O(2ⁿ)")}” is true but useless. We want the <b>tightest</b> upper bound, and to know that a bound is tight we also need a <b>lower bound</b>. That is Big-Omega, in Chapter 5.</p>
        ${predict("True or false? (a) n² = O(n³). (b) n³ = O(n²). (c) 100n + 5 = O(n²). (d) 2ⁿ⁺¹ = O(2ⁿ). (e) 2²ⁿ = O(2ⁿ).",
          `<p>(a) True (c = 1, n₀ = 1). (b) False: n³ ≤ cn² means n ≤ c, which fails for n &gt; c, whatever c is. (c) True, e.g. 100n + 5 ≤ 105n ≤ 105n² for n ≥ 1. (d) True: 2ⁿ⁺¹ = 2 · 2ⁿ, take c = 2. (e) False: 2²ⁿ = 4ⁿ, and 4ⁿ ≤ c · 2ⁿ means 2ⁿ ≤ c, which fails for large n. A constant in the exponent is <em>not</em> a constant factor.</p>`)}` },
    ],
    takeaways: ["O: g ≤ c·f for all n ≥ n₀.", "Smaller c → larger n₀; some c are impossible.", "O is an upper bound; we want the tightest."],
  },
  {
    slug: "4-rules", nav: "Rules", title: "Big-Oh Rules and Growth Classes",
    subtitle: "Simplify a running time in a few steps",
    abstract: "The biggest power eats all; products multiply; sums take the max; log only beats constants; exponentials beat powers. Then: the seven common classes, and two typical mistakes.",
    tags: ["five rules", "1 < log n < n < n log n < n² < n³ < 2ⁿ", "typical mistakes"],
    hero: "growthMini", heroCaption: "The common growth classes, n = 1 to 32.",
    sections: [
      { id: "video-3", title: "Watch: Rules and growth classes", html: `
        <div class="card video" data-video="media/L05-3.mp4"></div>` },
      { id: "poly", title: "Rule (i): polynomials", html: `
        <p>If ${m("a &gt; b ≥ 0")} then ${m("n<sup>a</sup>")} grows faster than ${m("n<sup>b</sup>")}: ${m("n<sup>b</sup> / n<sup>a</sup> → 0")}. In a polynomial the highest power wins: <b>the biggest eats all.</b></p>
        ${callout("pattern", "RULE (i) · POLYNOMIALS", `<p>If ${m("g(n) = a<sub>d</sub>n<sup>d</sup> + a<sub>d−1</sub>n<sup>d−1</sup> + ⋯ + a₁n + a₀")} is a polynomial of degree ${m("d")} (with ${m("g(n) ≥ 0")}), then ${m("g(n) = O(n<sup>d</sup>)")}.</p>`)}
        <p><em>Proof.</em> Each coefficient is at most its absolute value, and for ${m("n ≥ 1")}, ${m("n<sup>i</sup> ≤ n<sup>d</sup>")} for every ${m("i ≤ d")}. So for ${m("n ≥ 1")}:</p>
        ${mb("g(n) ≤ |a<sub>d</sub>|n<sup>d</sup> + ⋯ + |a₀| ≤ (|a<sub>d</sub>| + ⋯ + |a₀|) · n<sup>d</sup>")}
        <p>Take ${m("c = |a<sub>d</sub>| + ⋯ + |a₀|")}, ${m("n₀ = 1")} — exactly how we got ${m("3n² + 8n + 5 ≤ 16n²")}.</p>
        <p>Examples: ${m("n⁴ − n³ + n² = O(n⁴)")}; ${m("1 + 1000000n + n² = O(n²)")}, even though the middle term is bigger than ${m("n²")} until ${m("n = 10⁶")}. The rule also works for <b>non-integer powers</b>: ${m("1 + 1000000n + n<sup>1.5</sup> = O(n<sup>1.5</sup>)")} and ${m("1 + 1000000n<sup>0.3</sup> + n<sup>0.5</sup> = O(n<sup>0.5</sup>)")}.</p>` },
      { id: "product-sum", title: "Rules (ii) and (iii): products and sums", html: `
        ${callout("pattern", "RULE (ii) · PRODUCTS", `<p>If ${m("g₁ = O(f₁)")} and ${m("g₂ = O(f₂)")}, then ${m("g₁ · g₂ = O(f₁ · f₂)")}.</p>`)}
        <p><em>Proof.</em> For ${m("n ≥ max(n₁, n₂)")} both bounds hold, so (for non-negative functions) ${m("g₁g₂ ≤ (c₁c₂) f₁f₂")}. Example: ${m("(n³ + n² + 1)(n⁷ + n¹²) = O(n³ · n¹²) = O(n¹⁵)")}. In code, the product rule is what you use for <b>nested loops</b>: ${m("O(n)")} iterations, each doing ${m("O(n)")} work, cost ${m("O(n²)")}.</p>
        ${callout("pattern", "RULE (iii) · SUMS", `<p>If ${m("g₁ = O(f₁)")} and ${m("g₂ = O(f₂)")}, then ${m("g₁ + g₂ = O(max(f₁, f₂))")}.</p>`)}
        <p><em>Proof.</em> For ${m("n ≥ max(n₁, n₂)")}: ${m("g₁ + g₂ ≤ c₁f₁ + c₂f₂ ≤ (c₁ + c₂) max(f₁, f₂)")}. Example: ${m("(n³ + n² + 1) + (n⁴ + n⁷ + n²⁰ + n³⁰) = O(max(n³, n³⁰)) = O(n³⁰)")}. In code: <b>consecutive blocks</b> — an ${m("O(n)")} loop followed by an ${m("O(n²)")} loop costs ${m("O(n²)")}.</p>
        <p>The sum property extends to ${m("g₁ + g₂ + ⋯ + g<sub>k</sub>")} for any <b>fixed</b> number ${m("k")} of terms. It does <em>not</em> extend to a number of terms that grows with ${m("n")}; see the typical mistakes below.</p>
        ${demo("simplify", "Demo 5 · Simplify with the rules", "pick an expression, then step", "The last example is a trap: watch which rule is misused.")}` },
      { id: "log-exp", title: "Rules (iv) and (v): logs and exponentials", html: `
        ${callout("pattern", "RULE (iv) · LOG ONLY BEATS CONSTANTS", `<p>${m("(log n)<sup>a</sup> / n<sup>b</sup> → 0")} for any ${m("a, b &gt; 0")}. So ${m("(log n)<sup>a</sup> + n<sup>b</sup> = O(n<sup>b</sup>)")}, and among powers of ${m("log n")} the biggest power wins: ${m("(log n)<sup>a</sup> + b(log n)<sup>x</sup> = O((log n)<sup>a</sup>)")} for ${m("b &gt; 0, a &gt; x ≥ 0")}.</p>`)}
        ${callout("pattern", "RULE (v) · EXPONENTIALS BEAT POWERS", `<p>${m("n<sup>k</sup> / a<sup>n</sup> → 0")} for any ${m("a &gt; 1")} and any ${m("k")}. So ${m("aⁿ + n<sup>b</sup> = O(aⁿ)")} for ${m("a &gt; 1")}, and ${m("aⁿ + bⁿ = O(aⁿ)")} for ${m("a &gt; b &gt; 1")}.</p>`)}
        <p>Examples: ${m("(log n)² + n<sup>0.0001</sup> = O(n<sup>0.0001</sup>)")}; ${m("2ⁿ + n<sup>10000</sup> = O(2ⁿ)")}; ${m("2ⁿ + 3ⁿ = O(3ⁿ)")}, because ${m("2ⁿ + 3ⁿ ≤ 2 · 3ⁿ")} for all ${m("n ≥ 1")} (${m("c = 2, n₀ = 1")}).</p>
        <p>These limits can take a long time to show. With ${m("n = 2ᵏ")}, ${m("(log₂ n)² = k²")} and ${m("√n = 2<sup>k/2</sup>")}:</p>
        ${codeBlock(CODE.logVsPower)}
        ${codeBlock(CODE.logVsPowerOut, "out")}
        <p>${m("(log n)²")} is bigger than ${m("√n")} from ${m("n = 4")} all the way to ${m("n = 2¹⁶ = 65536")}, where they are equal, and smaller from then on. For ${m("n<sup>0.0001</sup>")} the crossover is at about ${m("n = 2<sup>370000</sup>")}, a number with more than 100,000 digits.</p>
        ${codeBlock(CODE.expVsPower)}
        ${codeBlock(CODE.expVsPowerOut, "out")}
        ${demo("ratio", "Demo 6 · Who wins in the long run?", "pick a pair, then step (← →)", "The curve is log₂ of the ratio g/f. Above zero, g is bigger. The amber line marks where f takes over for good — the same values as LogVsPower and ExpVsPower.")}
        <p>An asymptotic statement only says what happens <em>eventually</em>. It is still the right tool for comparing algorithms as ${m("n")} grows.</p>` },
      { id: "classes", title: "Common growth classes", html: `
        ${table(["class", "name", "example"], [
          [m("O(1)"), "constant", "read <code>arr[i]</code>"],
          [m("O(log n)"), "logarithmic", "binary search"],
          [m("O(n)"), "linear", "sum of an array, linear search"],
          [m("O(n log n)"), "log-linear", "merge sort"],
          [m("O(n²)"), "quadratic", "insertion sort (worst case), <code>maxSubArraySum</code>"],
          [m("O(n³)"), "cubic", "three nested loops over n"],
          [m("O(2ⁿ)"), "exponential", "trying every subset of n items"]])}
        ${demo("growth", "Demo 7 · Race the growth classes", "step n = 1, 2, 4, …, 32", "Tick “log scale” to see all seven curves at once; on a linear scale, n³ and 2ⁿ leave the chart.")}
        ${codeBlock(CODE.growthTable)}
        ${codeBlock(CODE.growthTableOut, "out")}
        <p>At ${m("n = 32")} an exponential algorithm already needs over four billion steps, while ${m("n log n")} needs 160. Each class in the table is ${m("O")} of every class below it, but not of any class above it.</p>
        ${callout("note", "NOTE", `<p>The slide's table shows ${m("2⁸")} as 235. It is 256, as the program shows.</p>`)}` },
      { id: "mistakes", title: "Typical mistakes", html: `
        <p><b>Mistake 1: the sum property with a growing number of terms.</b> Let ${m("f(n) = 1 + 1 + ⋯ + 1")} (${m("n")} ones). “Each term is ${m("O(1)")}, so ${m("f(n) = O(max(1, …, 1)) = O(1)")}.” But ${m("f(n) = n")}. The sum property holds for a <b>fixed</b> number of terms; here there are ${m("n")}, and applying the rule ${m("n − 1")} times multiplies the constant by up to ${m("n")} — and ${m("c")} must not depend on ${m("n")}. In code: a loop of ${m("n")} iterations with ${m("O(1)")} work each costs ${m("O(n)")}, not ${m("O(1)")}.</p>
        <p><b>Mistake 2: treating “=” as equality.</b> ${m("2n = O(n²)")} and ${m("3n² = O(n²)")}; so ${m("2n = 3n²")}? No. The “=” in ${m("g(n) = O(f(n))")} is notation, read “is”: ${m("g")} <em>belongs to</em> the set of functions that grow no faster than ${m("f")}. (Some books write ${m("g(n) ∈ O(f(n))")}.) It only reads left to right.</p>` },
    ],
    takeaways: ["Biggest power eats all; log only beats constants; exponentials beat powers.", "Products multiply; sums take the max — for a fixed number of terms.", "1 < log n < n < n log n < n² < n³ < 2ⁿ."],
  },
  {
    slug: "5-omega", nav: "Big-Omega", title: "Big-Omega: a Lower Bound",
    subtitle: "g(n) ≥ c · f(n) for all n ≥ n₀",
    abstract: "The mirror image of Big-Oh. g = Ω(f) exactly when f = O(g). All five rules carry over, and Ω has the same weakness: it is not tight.",
    tags: ["definition", "2n ≠ Ω(n²)", "duality"],
    hero: "bigOmegaMini", heroCaption: "4n + 4 ≥ 4n for all n ≥ 1.",
    sections: [
      { id: "video-4", title: "Watch: Big-Omega and Big-Theta", html: `
        <div class="card video" data-video="media/L05-4.mp4"></div>` },
      { id: "definition", title: "The definition", html: `
        ${callout("pattern", "DEFINITION · BIG-OMEGA", `<p>${m("g(n) = Ω(f(n))")} if there exist two <b>positive constants</b> ${m("c")} and ${m("n₀")} such that</p>${mb("g(n) ≥ c · f(n) &nbsp; for all n ≥ n₀.")}`)}
        <p>Read it as “${m("g")} grows asymptotically <b>no slower</b> than ${m("f")}”. The picture is the mirror image of Big-Oh: ${m("c · f(n)")} stays <em>below</em> ${m("g(n)")} from ${m("n₀")} on. Before ${m("n₀")} the curves may cross; from ${m("n₀")} on, ${m("g")} is above.</p>
        ${demo("bigOmega", "Demo 8 · Find c and n₀ for a lower bound", "drag c; move n₀ with ← →", "Red dots: n ≥ n₀ where g(n) &lt; c·f(n). For 2n against n², shrink c as much as you like: the dots never go away.")}` },
      { id: "examples", title: "Examples", html: `
        <p><b>The sum of an array.</b> ${m("4n + 4 = Ω(n)")}: take ${m("c = 4, n₀ = 1")}; ${m("4n + 4 ≥ 4n")} for all ${m("n ≥ 1")}. (Or ${m("c = 1")}: ${m("4n + 4 ≥ n")}.) Together with ${m("4n + 4 = O(n)")}, the sum is “exactly” linear; Chapter 6 names this.</p>
        <p><b>A false lower bound.</b> ${m("2n")} is <b>not</b> ${m("Ω(n²)")}. <em>Proof.</em> Suppose there were positive ${m("c, n₀")} with ${m("2n ≥ cn²")} for all ${m("n ≥ n₀")}. Then ${m("2 ≥ cn")}, i.e. ${m("n ≤ 2/c")}, for all ${m("n ≥ n₀")}. But ${m("2/c")} is a fixed number, and any ${m("n")} larger than both ${m("2/c")} and ${m("n₀")} breaks the inequality. Contradiction.</p>
        <p><b>Big-Oh and Big-Omega are two views of one relation:</b> if ${m("g = Ω(f)")} then ${m("f = O(g)")}, and if ${m("g = O(f)")} then ${m("f = Ω(g)")}. <em>Proof of the first.</em> From ${m("g(n) ≥ c · f(n)")} for ${m("n ≥ n₀")}, divide by ${m("c")}: ${m("f(n) ≤ (1/c) · g(n)")}. So ${m("c′ = 1/c")} (positive) and ${m("n₀′ = n₀")} show ${m("f = O(g)")}.</p>` },
      { id: "rules", title: "The rules carry over", html: `
        <p>All five Big-Oh rules hold for Big-Omega, with the same proofs and the inequalities reversed:</p>
        ${table(["rule", "example"], [
          ["(i) polynomials: the biggest eats all", m("n³ + n² + n = Ω(n³)")],
          ["(ii) products: the big times the big", m("(n + 1)(n + n⁵) = Ω(n · n⁵) = Ω(n⁶)")],
          ["(iii) sums: the bigger of the two", m("(n + 1) + (n + n⁵) = Ω(max(n, n⁵)) = Ω(n⁵)")],
          ["(iv) log only beats constants", m("n<sup>0.000001</sup> + (log n)<sup>1000</sup> = Ω(n<sup>0.000001</sup>)")],
          ["(v) exponentials beat powers", m("1.00001ⁿ + n<sup>999999</sup> = Ω(1.00001ⁿ)")]])}
        <p>(For the polynomial rule with ${m("Ω")}, the leading coefficient must be positive, and the lower terms can only take away a fraction of the top term from some ${m("n₀")} on. For example ${m("n³ − 100n² ≥ ½n³")} once ${m("n ≥ 200")} — the third example in Demo 8.)</p>` },
      { id: "limitation", title: "The limitation of Big-Omega", html: `
        <p>Like Big-Oh, Big-Omega is not tight: it is an <b>asymptotic lower bound</b>, and a function has many lower bounds:</p>
        ${mb("n³ = Ω(n²) = Ω(n log n) = Ω(n) = Ω(1)")}
        <p>Each is true; only ${m("Ω(n³)")} is useful. To say that a bound is the right one, the upper and the lower bound must meet.</p>` },
    ],
    takeaways: ["Ω: g ≥ c·f for all n ≥ n₀.", "g = Ω(f) exactly when f = O(g).", "Ω is a lower bound; there are many."],
  },
  {
    slug: "6-theta", nav: "Big-Theta", title: "Big-Theta and Comparing Algorithms",
    subtitle: "Upper and lower bound together: a tight bound",
    abstract: "When O and Ω agree, g grows at exactly the rate of f. Θ classes let you compare algorithms independently of the machine — as long as the bounds are tight.",
    tags: ["c₁f ≤ g ≤ c₂f", "same Θ = equally good", "binary vs linear search"],
    hero: "bigThetaMini", heroCaption: "3n + 4 sandwiched between 3n and 7n.",
    sections: [
      { id: "definition", title: "The definition", html: `
        ${callout("pattern", "DEFINITION · BIG-THETA", `<p>If ${m("g(n) = O(f(n))")} and ${m("g(n) = Ω(f(n))")}, then ${m("g(n) = Θ(f(n))")}. Equivalently, there are positive constants ${m("c₁, c₂, n₀")} with</p>${mb("c₁ · f(n) ≤ g(n) ≤ c₂ · f(n) &nbsp; for all n ≥ n₀.")}`)}
        <p>${m("g(n) = Θ(f(n))")} means ${m("g")} grows asymptotically <b>at the same rate</b> as ${m("f")}: from ${m("n₀")} on it is sandwiched between two constant multiples of ${m("f")}.</p>
        <p><b>Example.</b> ${m("3n + 4 = Θ(n)")}: ${m("3n ≤ 3n + 4 ≤ 7n")} for all ${m("n ≥ 1")}. The sum of an array, ${m("4n + 4")}, is ${m("Θ(n)")} the same way, and the maximum-subarray count is ${m("Θ(n²)")}: lines 4–6 alone cost ${m("5S + 2n ≥ 2.5n²")}, and the whole count is at most ${m("3n² + 8n + 5 ≤ 16n²")}.</p>
        ${demo("bigTheta", "Demo 9 · Sandwich g between c₁·f and c₂·f", "drag c₁ and c₂; move n₀ with ← →", "The third example is Exercise 2 (n₀ = 12). The last one, 6n² + 20n against n³, has an upper bound but no lower bound.")}` },
      { id: "practice", title: "Practice", html: `
        <ol><li>${m("3n + 4 = Θ(n)")}. Done above.</li>
        <li>${m("n log n + 2n² = Θ(n²)")}. Upper: ${m("log n ≤ n")}, so ${m("g ≤ 3n²")}. Lower: ${m("n log n ≥ 0")} for ${m("n ≥ 1")}, so ${m("g ≥ 2n²")}. So ${m("c₁ = 2, c₂ = 3, n₀ = 1")}.</li>
        <li>${m("(3n² + 2√n)(n log n + n) = Θ(n³ log n)")}: the first factor is ${m("Θ(n²)")}, the second ${m("Θ(n log n)")}, and the product rule multiplies them.</li></ol>
        <p>A numerical check of the third: if ${m("g = Θ(f)")}, the ratio ${m("g/f")} stays between two positive constants. Here it slowly approaches 3, the product of the leading coefficients:</p>
        ${codeBlock(CODE.thetaRatio)}
        ${codeBlock(CODE.thetaRatioOut, "out")}
        <p><b>When do Big-Oh and Big-Omega differ?</b> ${m("6n² + 20n = O(n³)")} is true, but ${m("6n² + 20n ≠ Ω(n³)")}, so ${m("n³")} is not tight; ${m("6n² + 20n = Θ(n²)")} is. This happens in practice: when an exact count is hard, as for <code>maxSubArraySum</code>, we first prove an upper bound, then look for a matching lower bound.</p>
        ${predict("Give the tightest Θ: (a) 5n³ + 2n log n. (b) log₃ n + 7. (c) n² + 2ⁿ. (d) (n + log n)(n + 10).",
          `<p>(a) Θ(n³). (b) Θ(log n): the base is a constant factor. (c) Θ(2ⁿ). (d) Θ(n²): each factor is Θ(n).</p>`)}` },
      { id: "compare", title: "Asymptotic algorithm analysis", html: `
        <p>Running times in ${m("Θ")} form let us compare algorithms <b>independently of the machine</b>.</p>
        <ul><li>If two algorithms have the <b>same</b> ${m("Θ")} class, they are <b>equally good</b> asymptotically. ${m("10000n = Θ(n)")} and ${m("9n = Θ(n)")}: the second is faster by a constant factor, which a faster machine or a better implementation can change; the growth rate is the same.</li>
        <li>An algorithm with a <b>slower growth rate</b> is <b>asymptotically faster</b>: for large enough ${m("n")} it wins, whatever the constants.</li></ul>
        ${demo("constants", "Demo 10 · Constants against growth", "step n (← →)", "A = 10000n and B = 9n are both Θ(n); C = n² is Θ(n²). For small n, C is cheaper than A. From n = 10,000 on, never again.")}
        <p>For example, <b>binary search</b> on a sorted array makes at most ${m("⌊log₂ n⌋ + 1")} comparisons, <b>linear search</b> up to ${m("n")}:</p>
        ${codeBlock(CODE.searchGrowth)}
        ${codeBlock(CODE.searchGrowthOut, "out")}
        ${demo("searchRace", "Demo 11 · Θ(log n) against Θ(n)", "step n by factors of 10", "Each factor of 10 in n costs binary search only 3 or 4 more comparisons.")}
        ${callout("pitfall", "PITFALL", `<p>Be careful when only <b>upper bounds</b> are known. “A is ${m("O(log n)")} and B is ${m("O(n)")}” guarantees that A's worst case grows no faster than ${m("log n")}, but it does not prove that A is faster: B might in fact also be ${m("Θ(log n)")}, and ${m("O(n)")} was just a loose bound. Comparisons are only sure when the bounds are tight (${m("Θ")}). When we cannot get tight bounds, comparing upper bounds compares the <em>guarantees</em>, which is often the best we can do.</p>`)}` },
    ],
    takeaways: ["Θ = O and Ω together: c₁f ≤ g ≤ c₂f.", "Same Θ: equally good; constants don't change the class.", "Slower growth wins for large n — compare tight bounds."],
  },
  {
    slug: "7-summary", nav: "Summary", title: "Summary and Practice",
    subtitle: "Check yourself, then prove and count",
    abstract: "A one-page map of the lecture, six self-check questions, seven exercises with solutions, and the key terms.",
    tags: ["knowledge map", "self-check", "exercises"],
    hero: "toc",
    sections: [
      { id: "map", title: "Knowledge map", html: `<div class="map">
        <div class="card"><h3>Measuring</h3><ul><li>Count <b>basic operations</b>, each constant time</li><li>As a function <b>T(n)</b> of the input size</li><li>Usually the <b>worst case</b></li></ul></div>
        <div class="card"><h3>Counting</h3><ul><li><code>sum</code>: 4n + 4</li><li>linear search: 1 to n comparisons</li><li><code>maxSubArraySum</code>: ≤ 3n² + 8n + 5</li></ul></div>
        <div class="card"><h3>Big-Oh</h3><ul><li>g ≤ c·f for all n ≥ n₀</li><li>Upper bound, “no faster than”</li><li>Prove by exhibiting c and n₀</li></ul></div>
        <div class="card"><h3>Rules</h3><ul><li>Biggest power eats all</li><li>Products multiply; sums take the max (fixed number of terms)</li><li>Log only beats constants; exponentials beat powers</li></ul></div>
        <div class="card"><h3>Big-Omega</h3><ul><li>g ≥ c·f for all n ≥ n₀</li><li>Lower bound, “no slower than”</li><li>g = Ω(f) ⇔ f = O(g)</li></ul></div>
        <div class="card"><h3>Big-Theta</h3><ul><li>c₁f ≤ g ≤ c₂f: tight</li><li>Same Θ: equally good</li><li>1 &lt; log n &lt; n &lt; n log n &lt; n² &lt; n³ &lt; 2ⁿ</li></ul></div></div>` },
      { id: "check", title: "Check your understanding", html: `<div data-demo="quiz"><div class="demo-body"></div></div>` },
      { id: "exercises", title: "Exercises", html: `
        <p>★ apply a definition or rule · ★★ prove · ★★★ analyse code.</p>
        <h3>Exercise 1 ★</h3>
        <p>Simplify to the tightest ${m("O")}: (a) ${m("7n⁵ − 3n² + 100")}; (b) ${m("(n² + 1)(log n + n)")}; (c) ${m("n<sup>1.5</sup> + n log n")}; (d) ${m("3ⁿ + n³ + 2ⁿ")}; (e) ${m("log(n⁵)")}.</p>
        <details class="reveal"><summary>Solution</summary><p>(a) O(n⁵). (b) O(n³): O(n²) · O(n). (c) O(n<sup>1.5</sup>): n log n = n · log n and log n grows slower than n<sup>0.5</sup>. (d) O(3ⁿ). (e) O(log n): log(n⁵) = 5 log n.</p></details>
        <h3>Exercise 2 ★★</h3>
        <p>Prove ${m("½n² − 3n = Θ(n²)")} by giving ${m("c₁, c₂, n₀")}.</p>
        <details class="reveal"><summary>Solution</summary><p>Upper: ½n² − 3n ≤ ½n² for n ≥ 1, so c₂ = ½. Lower: we want ½n² − 3n ≥ c₁n², i.e. ½ − 3/n ≥ c₁. For n ≥ 12, 3/n ≤ ¼, so c₁ = ¼ works. Answer: c₁ = ¼, c₂ = ½, n₀ = 12. (The function is negative for n &lt; 6: n₀ lets us ignore that. Check it in Demo 9.)</p></details>
        <h3>Exercise 3 ★★</h3>
        <p>Prove that ${m("n³ ≠ O(n²)")}.</p>
        <details class="reveal"><summary>Solution</summary><p>Suppose n³ ≤ cn² for all n ≥ n₀. Dividing by n², n ≤ c for all n ≥ n₀. Take n = max(n₀, ⌈c⌉ + 1): then n ≥ n₀ and n &gt; c, a contradiction.</p></details>
        <h3>Exercise 4 ★★</h3>
        <p>Is ${m("2<sup>n+10</sup> = O(2ⁿ)")}? Is ${m("n! = O(2ⁿ)")}?</p>
        <details class="reveal"><summary>Solution</summary><p>2<sup>n+10</sup> = 1024 · 2ⁿ, so yes, with c = 1024. But n! ≠ O(2ⁿ): n! = 2ⁿ · (1/2)(2/2)(3/2)⋯(n/2), and the product of the factors k/2 grows without bound (each factor from k = 4 on is at least 2), so n!/2ⁿ is not bounded by any constant.</p></details>
        <h3>Exercise 5 ★★★</h3>
        <p>Give the ${m("Θ")} class of the number of times <code>count++</code> runs, as a function of ${m("n")}, for each fragment. Then check by running them.</p>
        ${codeBlock(`// (a)
for (int i = 0; i < n; i++)
    for (int j = 0; j < 100; j++)
        count++;
// (b)
for (int i = 1; i < n; i = i * 2)
    count++;
// (c)
for (int i = 0; i < n; i++)
    for (int j = 0; j < i; j++)
        count++;
// (d)
for (int i = 0; i < n; i++)
    count++;
for (int j = 0; j < n * n; j++)
    count++;`)}
        <details class="reveal"><summary>Solution</summary><p>(a) 100n = Θ(n): the inner loop is a constant. (b) ⌈log₂ n⌉ for n ≥ 1: i doubles, so Θ(log n). (c) 0 + 1 + ⋯ + (n − 1) = n(n − 1)/2 = Θ(n²). (d) n + n² = Θ(n²) by the sum property (two blocks, a fixed number).</p>
        ${codeBlock(CODE.loopCounts)}${codeBlock(CODE.loopCountsOut, "out")}
        <p>From n = 100 to n = 1000, (a) grows 10 times, (b) by only 3, (c) and (d) about 100 times: linear, logarithmic, quadratic, quadratic.</p></details>
        <h3>Exercise 6 ★★★</h3>
        <p>Prove the sum property for ${m("Ω")}: if ${m("g₁ = Ω(f₁)")} and ${m("g₂ = Ω(f₂)")} (all functions non-negative), then ${m("g₁ + g₂ = Ω(max(f₁, f₂))")}.</p>
        <details class="reveal"><summary>Solution</summary><p>There are c₁, n₁ and c₂, n₂ with g₁ ≥ c₁f₁ for n ≥ n₁ and g₂ ≥ c₂f₂ for n ≥ n₂. Let c = min(c₁, c₂) &gt; 0 and n₀ = max(n₁, n₂). For n ≥ n₀, g₁ + g₂ ≥ cf₁ + cf₂ ≥ c · max(f₁, f₂), because the sum of two non-negative numbers is at least the larger one.</p></details>
        <h3>Exercise 7 ★★★</h3>
        <p>In <code>maxSubArraySum</code>, which lines' counts are exact, and which is only an upper bound? Use this to show the worst case is ${m("Θ(n²)")} without knowing the exact count of line 7.</p>
        <details class="reveal"><summary>Solution</summary><p>Lines 1–6 and 8 run the same number of times for every input of size n; only line 7 depends on the values. Without line 7 the count is 5S + 5n + 5 with S = n(n + 1)/2, which is at least 2.5n². With line 7 at most S times it is at most 3n² + 8n + 5 ≤ 16n² for n ≥ 1. So every input, in particular the worst one, costs between 2.5n² and 16n²: Θ(n²).</p></details>` },
      { id: "terms", title: "Key terms and further reading", html: `
        <p class="tags">${["basic operation", "input size", "running time T(n)", "best case", "worst case", "average case", "asymptotic", "Big-Oh", "Big-Omega", "Big-Theta", "upper bound", "lower bound", "tight bound", "growth rate", "constant factor", "n₀", "polynomial rule", "product property", "sum property", "logarithmic", "linear", "log-linear", "quadratic", "cubic", "exponential"].map((t) => `<span class="tag">${t}</span>`).join("")}</p>
        <ul><li>T. H. Cormen, C. E. Leiserson, R. L. Rivest, C. Stein, <em>Introduction to Algorithms</em> (CLRS), 4th ed., Chapter 3, <em>Characterizing Running Times</em>. Chapter 2 (counting the operations of insertion sort) is next lecture's reading.</li>
        <li>M. A. Weiss, <em>Data Structures and Algorithm Analysis in Java</em>, Chapter 2, <em>Algorithm Analysis</em>.</li></ul>` },
    ],
    takeaways: ["Count operations; keep the growth.", "O ≤, Ω ≥, Θ both.", "Compare algorithms by tight Θ classes."],
  },
];

const QUIZ = [
  { q: "How many basic operations does <code>sum(A, n)</code> perform, counted as in Chapter 2, and what is its Θ class?",
    opts: ["n, Θ(n)", "4n + 4, Θ(n)", "4n + 4, Θ(4n)", "n², Θ(n²)"],
    a: 1, why: "1 + (2n + 2) + 2n + 1 = 4n + 4. Constants are dropped inside Θ, so it is Θ(n); writing Θ(4n) is not wrong but is never done." },
  { q: "Which pair (c, n₀) proves 3n² + 8n + 5 = O(n²)?",
    opts: ["c = 3, n₀ = 100", "c = 4, n₀ = 5", "c = 4, n₀ = 9", "c = 1, n₀ = 1000"],
    a: 2, why: "3n² + 8n + 5 ≤ 4n² ⇔ n² − 8n − 5 ≥ 0, true from n = 9 on (at n = 8: 261 &gt; 256). With c ≤ 3 no n₀ works." },
  { q: "Which statement is <b>false</b>?",
    opts: ["n log n = O(n²)", "n = O(n log n)", "log₂ n = Θ(log₁₀ n)", "2²ⁿ = O(2ⁿ)"],
    a: 3, why: "2²ⁿ = 4ⁿ, and 4ⁿ / 2ⁿ = 2ⁿ is unbounded. A constant factor in the <em>exponent</em> is not a constant factor." },
  { q: "What is wrong with “1 + 2 + ⋯ + n is a sum of terms that are each O(n), so it is O(n)”?",
    opts: ["Nothing; it is O(n)", "The sum property only holds for a fixed number of terms; the sum is n(n+1)/2 = Θ(n²)", "Each term is O(1), not O(n)", "The sum property needs Ω, not O"],
    a: 1, why: "There are n terms, a number that grows with n. The sum is n(n + 1)/2 = Θ(n²)." },
  { q: "g(n) = 2ⁿ + n¹⁰⁰ + (log n)⁵⁰. Its tightest bound is",
    opts: ["Θ(n¹⁰⁰)", "Θ((log n)⁵⁰)", "Θ(2ⁿ)", "Θ(2ⁿ · n¹⁰⁰)"],
    a: 2, why: "Exponentials beat powers, and powers beat powers of log. A sum takes the biggest, it does not multiply." },
  { q: "Algorithm A is O(log n) and algorithm B is O(n). What can you conclude for certain?",
    opts: ["A is faster than B for large n", "A's worst case grows no faster than log n; nothing certain about which is faster", "B is Θ(n)", "A is Ω(log n)"],
    a: 1, why: "O gives only upper bounds. B might also be Θ(log n). Only tight (Θ) bounds give a certain comparison." },
];
