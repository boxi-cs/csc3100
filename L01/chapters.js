// Chapter content, adapted from notes/L01-introduction.md (both Lecture 1 decks:
// "Introduction" and "Review & ADT Intro"). Code and outputs come from CODE / OUT in demos.js.

const demo = (name, title, instr, hint = "") =>
  `<div class="card demo" data-demo="${name}"><div class="head"><span class="title">${title}</span><span>${instr}</span></div>
   <div class="demo-body"></div>${hint ? `<p class="hint">${hint}</p>` : ""}</div>`;

const callout = (kind, label, body) => `<div class="callout ${kind}"><b>${label}</b>${body}</div>`;
const predict = (q, a) => callout("predict", "PREDICT", `<p>${q}</p><details class="reveal"><summary>Show the answer</summary>${a}</details>`);
const out = (key) => codeBlock(OUT[key], "out");
const frac = (a, b) => `<span style="display:inline-flex;flex-direction:column;vertical-align:middle;text-align:center;line-height:1.15"><span style="border-bottom:1px solid currentColor;padding:0 3px">${a}</span><span style="padding:0 3px">${b}</span></span>`;

const LECTURE = {
  number: 1,
  title: "Introduction and ADTs",
  tagline: "The mathematics we count with, and the words we build with",
  lead: "Logarithms, series and four ways to prove things; then type, data type, abstract data type and data structure; and finally the selection problem, which shows why a working program is not yet a good one. Every idea has a demo you can step through.",
  heroDemo: "intSetMini",
  heroLabel: "One ADT, two data structures · IntegerSet",
  heroCaption: "Same operations, same answers. The unsorted array checks every element; the hash table checks one bucket.",
  whyTitle: "Why this lecture comes first",
  whySub: "Three habits the rest of the course depends on",
  why: [
    ["Count, don't guess", "Running times are written with <b>logarithms</b> and <b>sums</b>. A million elements can be halved only 20 times; 1 + 2 + … + N is about N²/2."],
    ["Prove, don't just test", "Ten passing cases prove nothing; one <b>counterexample</b> disproves. <b>Induction</b> is how we show a loop or a recursive method is right for every input."],
    ["Separate what from how", "An <b>ADT</b> says what the operations do; a <b>data structure</b> decides what they cost. Choosing the structure is choosing the cost."],
  ],
  ctaTitle: "Ready to review the mathematics?",
  minutes: "About 70–90 minutes",
  videos: {
    "media/L01-1.mp4": "Lecture 1 · Part 1 — Exponents, logarithms and series (9.5 min)",
    "media/L01-2.mp4": "Lecture 1 · Part 2 — How to prove things (9.6 min)",
    "media/L01-3.mp4": "Lecture 1 · Part 3 — Data types, abstraction and ADTs (10.2 min)",
    "media/L01-4.mp4": "Lecture 1 · Part 4 — Data structures, algorithms and the selection problem (10.5 min)",
  },
};

const CHAPTERS = [
  {
    slug: "1-math", nav: "Math review", title: "Mathematics Review",
    subtitle: "Exponents, logarithms and series",
    abstract: "Running times are written with powers, logarithms and sums. Logarithms count halvings; arithmetic series count nested loops; geometric series bound work that shrinks.",
    tags: ["exponents", "log₂ n", "Σ i = N(N+1)/2", "geometric"],
    hero: "halvingMini", heroCaption: "1000 halves to 1 in 9 steps: ⌊log₂ 1000⌋ = 9.",
    sections: [
      { id: "video-1", title: "Watch: Exponents, logarithms and series", html: `
        <div class="card video" data-video="media/L01-1.mp4"></div>` },
      { id: "exponents", title: "Exponents", html: `
        <p>Analysing a data structure means counting how much work its operations do, and the counts are almost always written with powers, logarithms and sums. For any <span class="math">X</span> &gt; 0:</p>
        <div class="math-block">X<sup>A</sup> · X<sup>B</sup> = X<sup>A+B</sup> &nbsp;&nbsp;·&nbsp;&nbsp; X<sup>A</sup> / X<sup>B</sup> = X<sup>A−B</sup> &nbsp;&nbsp;·&nbsp;&nbsp; (X<sup>A</sup>)<sup>B</sup> = X<sup>AB</sup></div>
        <p>Two consequences are easy to get wrong:</p>
        <div class="math-block">X<sup>N</sup> + X<sup>N</sup> = 2X<sup>N</sup> ≠ X<sup>2N</sup> &nbsp;&nbsp;&nbsp;&nbsp; 2<sup>N</sup> + 2<sup>N</sup> = 2<sup>N+1</sup></div>
        <p>Adding two equal powers <em>doubles the value</em>; it does not double the exponent. For X = 2, doubling the value is the same as adding 1 to the exponent. It is squaring, X<sup>N</sup> · X<sup>N</sup> = X<sup>2N</sup>, that doubles the exponent.</p>` },
      { id: "logs", title: "Logarithms", html: `
        <p><b>Definition.</b> For X &gt; 0, X ≠ 1 and B &gt; 0: &nbsp; X<sup>A</sup> = B &nbsp;if and only if&nbsp; log<sub>X</sub> B = A. A logarithm answers “to which power must I raise X to get B?”. In this course <b>all logarithms are base 2 unless we say otherwise</b>: log n means log<sub>2</sub> n.</p>
        <ul>
          <li><b>Change of base</b>: log<sub>A</sub> B = ${frac("log<sub>C</sub> B", "log<sub>C</sub> A")} for any base C &gt; 0, C ≠ 1. Logarithms in different bases differ only by a constant factor: log<sub>2</sub> n ≈ 3.32 log<sub>10</sub> n.</li>
          <li>log(AB) = log A + log B, &nbsp; log(A/B) = log A − log B, &nbsp; log(A<sup>B</sup>) = B log A.</li>
          <li>log x &lt; x for all x &gt; 0.</li>
          <li>log 1 = 0, log 2 = 1, log 1024 = 10, log 65536 = 16.</li>
        </ul>
        <p><b>Why logarithms appear everywhere.</b> ⌊log<sub>2</sub> n⌋ is the number of times you can halve n (rounding down) before you reach 1. Any algorithm that throws away half its input at every step — binary search, a balanced search tree, a heap — takes about log n steps. A million can be halved only about 20 times.</p>
        <p>Java has no <code>log2</code>, but the change-of-base rule gives one: <code>Math.log</code> is the natural logarithm, so log<sub>2</sub> x = <code>Math.log(x) / Math.log(2)</code>. The program also counts halvings directly:</p>
        ${codeBlock(CODE.logs)}
        ${out("logs")}
        <p>(<code>1 &lt;&lt; n</code> shifts the bits of 1 left by n places, which is 2<sup>n</sup> for 0 ≤ n ≤ 30.)</p>
        ${demo("halving", "Demo 1 · Logarithms count halvings", "set n, then step", "Try 1023 and 1024: one more element, one more halving. Try 1,000,000,000: still only 29 halvings.")}
        ${predict("What does <code>halvings(1000)</code> return? And <code>halvings(1023)</code>?",
          `<p>Both return 9. 2<sup>9</sup> = 512 ≤ 1000 &lt; 1024 = 2<sup>10</sup>, so 1000 halves as 1000 → 500 → 250 → 125 → 62 → 31 → 15 → 7 → 3 → 1: nine halvings. Every number from 512 to 1023 takes nine; 1024 is the first that takes ten. In general <code>halvings(n)</code> = ⌊log<sub>2</sub> n⌋.</p>`)}` },
      { id: "arithmetic", title: "Arithmetic series", html: `
        <p>The two sums we meet most often are</p>
        <div class="math-block">1 + 2 + … + N = ${frac("N(N + 1)", "2")} &nbsp;&nbsp;&nbsp;&nbsp; 1<sup>2</sup> + 2<sup>2</sup> + … + N<sup>2</sup> = ${frac("N(N + 1)(2N + 1)", "6")}</div>
        <p>The first has a picture proof. Write the sum twice, once forwards and once backwards, and add column by column: every column is N + 1, and there are N columns, so twice the sum is N(N + 1). In the staircase picture, two copies of the staircase 1, 2, …, N fit together into an N × (N + 1) rectangle:</p>
        ${demo("gauss", "Demo 2 · Two staircases make a rectangle", "drag N, then step")}
        <p>For large N the first sum is about N²/2 and the second about N³/3. You will meet the first every time a loop runs 1, 2, 3, …, N times in turn — for example the inner loop of insertion sort (Lecture 4).</p>
        <p><b>Example.</b> Find 2 + 5 + 8 + … + (3k − 1). Each term is 3i − 1 for i = 1, …, k, so split the sum:</p>
        <div class="math-block">Σ (3i − 1) = 3 Σ i − Σ 1 = ${frac("3k(k + 1)", "2")} − k = ${frac("k(3k + 1)", "2")}</div>
        <p>Check with k = 3: 2 + 5 + 8 = 15 and 3 · 10 / 2 = 15. (The <em>Introduction</em> deck stops at 3k(k+1)/2 − k; the <em>Review</em> deck simplifies it.)</p>` },
      { id: "geometric", title: "Geometric series", html: `
        <p>For A ≠ 1:</p>
        <div class="math-block">1 + A + A<sup>2</sup> + … + A<sup>N</sup> = ${frac("1 − A<sup>N+1</sup>", "1 − A")}</div>
        <p><b>Derivation.</b> Let S = 1 + A + … + A<sup>N</sup>. Then AS = A + A<sup>2</sup> + … + A<sup>N+1</sup>. Subtract: everything cancels except the first term of S and the last of AS, so S − AS = 1 − A<sup>N+1</sup>; divide by 1 − A.</p>
        <p>If 0 &lt; A &lt; 1, then A<sup>N+1</sup> &gt; 0, so S − AS &lt; 1 and</p>
        <div class="math-block">1 + A + A<sup>2</sup> + … + A<sup>N</sup> ≤ ${frac("1", "1 − A")} &nbsp; for every N</div>
        <p>and the infinite sum equals exactly 1/(1 − A). For example 1 + ½ + ¼ + … &lt; 2. This is why “halve the work at every step” costs only a constant times the first step: n + n/2 + n/4 + … &lt; 2n. For A = 2 the formula gives 1 + 2 + 4 + … + 2<sup>N</sup> = 2<sup>N+1</sup> − 1: one less than the next power of two.</p>
        ${demo("geometric", "Demo 3 · Partial sums never pass 1/(1 − A)", "pick A, then step", "Each new term is A times the one before, so the bars shrink. With A = 0.9 the sum creeps towards 10.")}
        <p>The program checks all four formulas by adding the terms one by one:</p>
        ${codeBlock(CODE.series)}
        ${out("series")}
        ${predict("Without a calculator: what is 1 + 3 + 9 + 27 + 81? And 1 + ⅓ + ⅑ + 1/27 + … (forever)?",
          `<p>The first is the geometric series with A = 3, N = 4: (1 − 3<sup>5</sup>)/(1 − 3) = 242/2 = 121. The second has A = ⅓, so it equals 1/(1 − ⅓) = 3/2.</p>`)}
        ${callout("pitfall", "PITFALL", `<p><b>Checking a formula on a few values is not a proof.</b> The program confirms each formula for one N. That catches typos, but only a proof (Chapter 2) shows that a formula holds for <em>every</em> N. Also watch the types: <code>n * (n + 1) * (2 * n + 1)</code> is an <code>int</code> product, which overflows once n passes about 1000; the loop uses <code>long</code> for the sum of squares for the same reason.</p>`)}` },
    ],
    takeaways: ["2ᴺ + 2ᴺ = 2ᴺ⁺¹, not 2²ᴺ.", "log₂ n = how many halvings; base changes cost a constant.", "Σ i ≈ N²/2; a geometric series with A < 1 stays below 1/(1 − A)."],
  },
  {
    slug: "2-proofs", nav: "Proofs", title: "How to Prove Things",
    subtitle: "Counterexample, contradiction, induction and structural induction",
    abstract: "Data-structure facts are claims about every input. One counterexample disproves such a claim; to prove it we argue by contradiction or by induction — and induction is only as strong as its weakest step.",
    tags: ["counterexample", "Euclid", "induction", "horses"],
    hero: "treeMini", heroCaption: "Each split: one more internal node, one more leaf. Leaves − internal stays 1.",
    sections: [
      { id: "video-2", title: "Watch: How to prove things", html: `
        <div class="card video" data-video="media/L01-2.mp4"></div>` },
      { id: "methods", title: "Four methods", html: `
        <p>“Every binary tree with n leaves has n − 1 internal nodes”, “this loop always ends”, “this algorithm always returns the kth largest” — such statements are about <em>every</em> input, so trying a few cases cannot settle them. The slides use four methods:</p>
        <table><tr><th>to show that a statement is…</th><th>method</th><th>idea</th></tr>
        <tr><td>false</td><td>counterexample</td><td>exhibit one case where it fails</td></tr>
        <tr><td>true</td><td>contradiction</td><td>assume it is false, derive something impossible</td></tr>
        <tr><td>true for all n ≥ n₀</td><td>induction</td><td>basis + “if it holds for n, it holds for n + 1”</td></tr>
        <tr><td>true for all recursive structures</td><td>structural induction</td><td>smallest structures + “if it holds for the parts, it holds for the whole”</td></tr></table>` },
      { id: "counterexample", title: "Proof by counterexample", html: `
        <p>To show that a claim “for all x, P(x)” is <b>false</b>, one x for which P(x) fails is enough: a <b>counterexample</b>. (The <em>Introduction</em> deck calls this “proving a false statement”; more precisely, a counterexample <em>disproves</em> the statement.) “All primes are odd” is false: 2 is prime and even.</p>
        <p><b>Fibonacci.</b> The slides number the sequence from 1: F<sub>0</sub> = 1, F<sub>1</sub> = 1, F<sub>k+1</sub> = F<sub>k</sub> + F<sub>k−1</sub>, so it runs 1, 1, 2, 3, 5, 8, 13, … Claim: F<sub>k</sub> ≤ k² for all k ≥ 1. It holds for a long time — F<sub>10</sub> = 89 ≤ 100 — but F<sub>11</sub> = 144 &gt; 121. A program can search for the counterexample:</p>
        ${codeBlock(CODE.fibCounterexample)}
        ${out("fibCounterexample")}
        ${demo("counterexample", "Demo 4 · Search for a counterexample", "pick a claim, then step", "Ten (or forty) successes in a row prove nothing; the first failure settles it.")}
        <p>Two remarks. Ten successes proved nothing; one failure settles the question. And if k = 0 were allowed, the claim would fail at once, since F<sub>0</sub> = 1 &gt; 0². In fact F<sub>k</sub> grows like 1.618<sup>k</sup>, and an exponential eventually overtakes any power of k, so the claim fails for every k ≥ 11.</p>
        ${predict("Find counterexamples to “n² + n + 41 is prime for every n ≥ 0” and “every odd number greater than 1 is prime”.",
          `<p>n = 40 gives 40² + 40 + 41 = 1681 = 41², yet the value is prime for every n from 0 to 39 — exactly why “it worked for the first forty cases” is no proof. (Pick that claim in Demo 4.) For the second, 9 = 3 · 3.</p>`)}` },
      { id: "contradiction", title: "Proof by contradiction", html: `
        <p>To prove a statement, <b>assume it is false</b> and show that this leads to something impossible. Then the assumption was wrong, so the statement is true.</p>
        <p><b>Theorem (Euclid).</b> There are infinitely many primes.</p>
        <p><b>Proof.</b> Suppose there are only finitely many, p<sub>1</sub>, …, p<sub>n</sub>. Let p = p<sub>1</sub> · p<sub>2</sub> ⋯ p<sub>n</sub> + 1. Dividing p by any p<sub>i</sub> leaves remainder 1, so no p<sub>i</sub> divides p. But p &gt; 1, and every integer greater than 1 has a prime factor. That factor is none of p<sub>1</sub>, …, p<sub>n</sub>: a prime missing from the “complete” list. Contradiction, so there are infinitely many primes. ∎</p>
        ${callout("pitfall", "PITFALL · p ITSELF NEED NOT BE PRIME", `<p>The proof only says that p has a prime factor not on the list. (The slide's wording, “p is composite … hence it must be prime”, mixes the two cases.) With the first six primes, 2 · 3 · 5 · 7 · 11 · 13 + 1 = 30031 = 59 · 509 is not prime — but 59 and 509 are both missing from the list.</p>`)}
        ${codeBlock(CODE.euclidNumbers)}
        ${out("euclidNumbers")}
        ${demo("euclid", "Demo 5 · Multiply the primes, add 1", "step through the list", "In every row the smallest prime factor is larger than every prime on the list, exactly as the proof says.")}
        <p>(26869 = 97 · 277; the program prints only the smallest factor.)</p>` },
      { id: "induction", title: "Proof by induction", html: `
        <p>Induction proves a statement P(n) for <b>all</b> n ≥ n₀ in three parts:</p>
        <ol><li><b>Basis.</b> Show P(n₀) directly, usually for n₀ = 0 or 1.</li>
        <li><b>Induction hypothesis.</b> Assume P(n) for some n ≥ n₀ (or, in <em>strong</em> induction, for all values from n₀ to n).</li>
        <li><b>Inductive step.</b> Using the hypothesis, show P(n + 1).</li></ol>
        <p>Like a row of dominoes: the basis knocks over the first, and the inductive step guarantees that each one knocks over the next.</p>
        <p><b>Example.</b> For every n ≥ 1, 1 + 2 + … + n = n(n + 1)/2. <em>Basis</em>, n = 1: 1 = 1 · 2 / 2. <em>Hypothesis</em>: assume it for n. <em>Step</em>:</p>
        <div class="math-block">1 + … + n + (n + 1) = ${frac("n(n + 1)", "2")} + (n + 1) = ${frac("n(n + 1) + 2(n + 1)", "2")} = ${frac("(n + 1)(n + 2)", "2")}</div>
        <p>which is the formula for n + 1. ∎ The only creative move: find the old sum inside the new one and replace it by the hypothesis.</p>
        ${demo("dominoes", "Demo 6 · Induction as falling dominoes", "step")}
        <p>Induction is also how we prove loops and recursive methods correct: the basis is the base case or the first iteration, and the step is “if the smaller call is right, this call is right”.</p>
        ${predict("Prove by induction that 1 + 2 + 4 + … + 2<sup>n</sup> = 2<sup>n+1</sup> − 1 for all n ≥ 0.",
          `<p>Basis n = 0: 1 = 2¹ − 1. Step: assuming it for n, 1 + … + 2<sup>n</sup> + 2<sup>n+1</sup> = (2<sup>n+1</sup> − 1) + 2<sup>n+1</sup> = 2 · 2<sup>n+1</sup> − 1 = 2<sup>n+2</sup> − 1. The rule 2<sup>N</sup> + 2<sup>N</sup> = 2<sup>N+1</sup> does the work.</p>`)}` },
      { id: "structural", title: "Structural induction", html: `
        <p>Many data structures are defined <b>recursively</b>: a list is empty, or an element followed by a list; a tree is a node with subtrees. <b>Structural induction</b> proves a claim for all of them: prove it for the smallest structures, then show that if it holds for the parts, it holds for a structure built from them.</p>
        <p><b>Definition.</b> Here a binary tree is either a single node with no children (a <b>leaf</b>), or a node with exactly two children that are binary trees. (Later in the course binary trees may have nodes with one child; trees in which every node has 0 or 2 children are then called <b>full</b>.) A node that is not a leaf is an <b>internal node</b>.</p>
        <p><b>Claim.</b> Every such tree with n leaves has n − 1 internal nodes.</p>
        <p><b>Proof</b> (strong induction on the number of leaves). <em>Basis</em>, n = 1: a single node, 0 internal nodes. <em>Hypothesis</em>: the claim holds for every tree with at most n leaves. <em>Step</em>: a tree T with n + 1 ≥ 2 leaves is not a single node, so its root has two subtrees T<sub>1</sub>, T<sub>2</sub>, and leaf(T) = leaf(T<sub>1</sub>) + leaf(T<sub>2</sub>). Each subtree has at least one leaf, so each has <b>at most n</b> leaves and the hypothesis applies. Counting the root:</p>
        <div class="math-block">inter(T) = inter(T<sub>1</sub>) + inter(T<sub>2</sub>) + 1 = (leaf(T<sub>1</sub>) − 1) + (leaf(T<sub>2</sub>) − 1) + 1 = leaf(T) − 1 &nbsp;∎</div>
        ${callout("note", "NOTE · A SLIDE TYPO", `<p>The slide says each subtree has “leaves &lt; n − 1”. The correct bound is ≤ n: one subtree has n leaves when the other is a single leaf.</p>`)}
        <p>Another way to see it: grow any such tree from one leaf by repeatedly turning a leaf into an internal node with two new leaves. Each split adds one internal node and, in net, one leaf, so leaves − internal stays 1 forever.</p>
        ${demo("fullTree", "Demo 7 · Split leaves, watch the counts", "click a leaf or step", "Green squares are leaves, teal circles internal nodes. Whatever you split, the last stat never changes.")}
        <p>The recursive definition becomes a Java class, and the two counting methods have the same shape as the proof — a leaf is the base case, an internal node combines its subtrees:</p>
        ${codeBlock(CODE.fullNode)}
        ${codeBlock(CODE.leafCount)}
        ${out("leafCount")}` },
      { id: "horses", title: "A broken induction: all horses are the same colour", html: `
        <p>Let P(n) be: <em>in any set of n horses, all horses have the same colour.</em> <em>Basis</em>, n = 1: clearly true. <em>Hypothesis</em>: P holds for every set of at most n horses. <em>Step</em>: label n + 1 horses 1, …, n + 1. The sets {1, …, n} and {2, …, n + 1} each have n horses, so each is of one colour. The two sets share a horse, so the colours are the same, and all n + 1 horses match.</p>
        <p>Every sentence sounds reasonable; the conclusion is absurd. Where is the mistake?</p>
        ${demo("horses", "Demo 8 · Where the dominoes stop", "set the number of horses, then step", "Start with 4 horses, then drag the slider to 2.")}
        ${predict("Find the first n for which the inductive step fails.",
          `<p>“The two sets share a horse” needs horses 2, …, n, which exist only if n ≥ 2. Going from n = 1 to n + 1 = 2, the sets are {1} and {2}: no overlap, so nothing links the two colours. The chain breaks at the very first step. (The slide says “not true for n = 2”, meaning a set of two horses; with the labelling of the proof that is the step from n = 1 to n + 1 = 2.) The step works for every n ≥ 2, but that is useless, because P(2) is false.</p>`)}
        ${callout("pitfall", "PITFALL", `<p><b>The inductive step must work for every n ≥ n₀, including the smallest.</b> Check the first transition, n₀ → n₀ + 1, explicitly. A recursive method fails the same way when its recursive case silently assumes at least two elements.</p>`)}` },
    ],
    takeaways: ["One counterexample disproves “for all”.", "Contradiction: assume false, derive the impossible.", "Induction: basis + a step that works from the very first n."],
  },
  {
    slug: "3-abstraction", nav: "Abstraction", title: "Data Types and Data Abstraction",
    subtitle: "What the data means, and how it is stored",
    abstract: "A data type is values plus operations. Its logical form is what it means; its physical form is how it is stored. Data abstraction shows the first and hides the second.",
    tags: ["type", "data type", "logical / physical", "encapsulation"],
    hero: "bankMini", heroCaption: "Same calls, same balance; one stores a number, the other a history.",
    sections: [
      { id: "video-3", title: "Watch: Data types, abstraction and ADTs", html: `
        <div class="card video" data-video="media/L01-3.mp4"></div>` },
      { id: "types", title: "Types, data items and data types", html: `
        <p>The vocabulary follows OpenDSA's <em>Data Structures and Algorithms</em>, §1.2, which the slides cite.</p>
        <ul><li>A <b>type</b> is a collection of values. The Boolean type has two values, <code>true</code> and <code>false</code>; the integers form a type.</li>
        <li>A <b>simple type</b> has values with no subparts, like an integer. An <b>aggregate</b> or <b>composite type</b> has values made of several parts: a bank account record holds a name, an address, an account number and a balance.</li>
        <li>A <b>data item</b> is a piece of information, or a record, whose value is drawn from a type. It is a <b>member</b> of its type.</li>
        <li>A <b>data type</b> is a type <em>together with a collection of operations</em> to manipulate it. An integer variable is a member of the integer data type, and addition is one of its operations.</li></ul>
        <p>The operations are part of the definition: “a sequence of integers” is a type; “a sequence of integers you can append to, index into and sort” is a data type.</p>` },
      { id: "forms", title: "Logical form and physical form", html: `
        <p>A data type has two forms. Its <b>logical form</b> is what it <em>means</em>: the values and operations as the user thinks of them — the ADT. Its <b>physical form</b> is how it is <em>stored</em>: the bits in memory and the code (subroutines) that carry out the operations — the data structure.</p>
        <div class="l1-layers" style="max-width:520px;margin:16px auto">
          <div class="layer"><small>data type · logical form</small><b>ADT</b>: type + operations &nbsp;→&nbsp; data items as the user sees them</div>
          <div class="down">implemented by ↓</div>
          <div class="layer"><small>data type · physical form</small><b>data structure</b>: storage space + subroutines &nbsp;→&nbsp; data items as bits in memory</div>
        </div>
        <p>When you <em>implement</em> an ADT you work with its physical form; when you <em>use</em> it elsewhere you think only about its logical form. Java's <code>int</code> shows the gap. Logically it is “an integer”; physically it is 32 bits in two's complement, which can hold only −2<sup>31</sup> to 2<sup>31</sup> − 1. At the edges the physical form shows through:</p>
        ${codeBlock(CODE.intForms)}
        ${out("intForms")}
        ${demo("intForms", "Demo 9 · An int, logically and physically", "← → add or subtract 1", "Start near MAX_VALUE and press + 1 three times. The bits roll over to the sign bit, and the value jumps to the most negative int.")}
        <p>Neither surprise — wrap-around, or <code>0.1 + 0.2</code> not being <code>0.3</code> — exists in the logical form; both come from the physical form.</p>` },
      { id: "abstraction", title: "Data abstraction", html: `
        <p><b>Data abstraction</b> means showing only the essential features of data while hiding the unnecessary details of how it is implemented: a clear separation between the <em>abstract properties</em> of a data type and the <em>concrete details</em> of its implementation.</p>
        <p><b>A smartphone.</b> You know how to make a call (type a number) and how to get online (open the browser). You do not know — and need not know — how the CPU, memory, battery and radio make the call, how the phone reaches the network, or how it stores your photos.</p>
        <p><b>A bank account</b> offers <code>deposit(amount)</code>, <code>withdraw(amount)</code> and <code>getBalance()</code>. You use them without knowing whether the balance lives in memory, in a file or in a database. In Java, data abstraction is achieved with <b>classes and objects</b>, with <b>abstract data types</b> written as interfaces, and with <b>encapsulation</b>: <code>private</code> fields that code outside the class cannot touch.</p>
        <p>The interface is the <em>what</em>; the two classes are two versions of the <em>how</em>:</p>
        ${codeBlock(CODE.account)}
        ${codeBlock(CODE.simpleAccount)}
        ${codeBlock(CODE.ledgerAccount)}
        <p>A client written against <code>Account</code> cannot tell them apart:</p>
        ${codeBlock(CODE.bankClient)}
        ${out("bankClient")}
        ${demo("bank", "Demo 10 · One interface, two implementations", "edit the calls, then step", "Try <code>deposit 0</code> or <code>withdraw 1000</code>: both classes refuse in the same way.")}
        <p><code>SimpleAccount</code> stores one number; <code>LedgerAccount</code> stores the whole history and adds it up on demand (slower <code>getBalance</code>, but it can print a statement). And because <code>balance</code> is <code>private</code>, no client can break the rules by writing to the field:</p>
        ${codeBlock(`SimpleAccount a = new SimpleAccount();
a.balance = 1000000;   // compile error: balance has private access in SimpleAccount`)}
        <p><b>Benefits</b>, in the slides' two lists:</p>
        <ul><li><b>Modularity</b> (user-friendly): users work with a few clear operations, which reduces complexity and makes programs easier to maintain.</li>
        <li><b>Data independence</b> (designer-friendly): the implementation can change without affecting the users of the data.</li>
        <li><b>Security and integrity</b> (protection): the data is protected from improper access or modification; nobody can set a negative balance.</li></ul>
        ${predict("A bank switches every customer from <code>SimpleAccount</code> to <code>LedgerAccount</code>. Which lines of <code>BankClient</code> must change?",
          `<p>Only <code>new SimpleAccount()</code> in <code>main</code>, which picks the implementation. <code>useAccount</code> is written against the interface and does not change. That is data independence.</p>`)}` },
    ],
    takeaways: ["Data type = values + operations.", "Logical form: meaning. Physical form: storage.", "Interfaces and private fields hide the how."],
  },
  {
    slug: "4-adt", nav: "ADTs", title: "Abstract Data Types and Data Structures",
    subtitle: "What the operations do, and what they cost",
    abstract: "An ADT names the operations and says what they do. A data structure implements them — and decides how much each one costs. An algorithm uses them to solve a task.",
    tags: ["IntegerSet", "interface", "array vs hash", "ADT → DS → algorithm"],
    hero: "listMini", heroCaption: "The same list calls on an array and on a linked list: the work lands in different places.",
    sections: [
      { id: "video-4", title: "Watch: Data structures, algorithms and the selection problem", html: `
        <div class="card video" data-video="media/L01-4.mp4"></div>` },
      { id: "adt", title: "Abstract data types", html: `
        <p>An <b>abstract data type (ADT)</b> is a logical description of a type of data and the operations you can perform on it, <em>without</em> saying how it is implemented. It describes <b>what</b> the data represents, <b>what</b> operations are allowed and <b>what</b> each one does; it says nothing about how the data is stored.</p>
        <p>An ADT is a tool for <b>encapsulation</b> (information hiding): the implementation of the ADT can be kept in one section of the program, and code that uses the ADT can safely ignore it. Common ADTs, all coming up in this course: arrays, lists, stacks, queues, trees and graphs.</p>
        <p><b>Example: a list of integers.</b> Insert an integer at a position; return true if the list is empty; clear the list; return the number of integers; retrieve the integer at a position; delete the integer at a position. The input and output of each operation are clear; the implementation is not mentioned. In Java an ADT is naturally an <b>interface</b>:</p>
        ${codeBlock(CODE.intList)}` },
      { id: "separate", title: "Separating the what from the how", html: `
        <p>An ADT only provides the <em>definition</em> of its operations: names, argument types, result types. The slides write a set of integers like this:</p>
        ${codeBlock(`ADT IntegerSet
    IntegerSet createEmptySet();
    IntegerSet addElementToSet(integer, SetA);
    Boolean    search(integer, SetA);
    IntegerSet intersection(SetA, SetB);
    IntegerSet union(SetA, SetB);
    IntegerSet difference(SetA, SetB);`, "shell")}
        <p>It does not reveal how the set is represented (array? list? tree? hash table?) or how the operations work — and there are many ways. In Java, creating an empty set is a constructor's job, the operations become methods, and <code>union</code>, <code>intersection</code> and <code>difference</code> can be written once, as <code>default</code> methods, using only the other operations:</p>
        ${codeBlock(CODE.integerSet)}
        <p><b>Implementation 1: an unsorted array</b>, in arrival order, no duplicates. <code>contains</code> compares <code>x</code> with every element; <code>probes</code> counts the comparisons.</p>
        ${codeBlock(CODE.arrayIntegerSet)}
        <p><b>Implementation 2: a small hash table</b> with 7 buckets: <code>x</code> goes into bucket <code>x mod 7</code>, and <code>contains</code> looks only in that bucket. (<code>Math.floorMod</code> keeps negative numbers in 0…6. Real hash tables, Lecture 18, grow the number of buckets.)</p>
        ${codeBlock(CODE.hashIntegerSet)}
        <p>The same client runs on both; only the line that creates the sets differs:</p>
        ${codeBlock(CODE.setClient)}
        ${out("setClient")}
        ${demo("intSet", "Demo 11 · IntegerSet: array vs hash table", "edit the values, then step", "Amber cells are the elements compared. Try adding 0, 7, 14, 21, 28: all in bucket 0, and the hash table is no faster than the array.")}
        <p>The answers are identical; only the peek inside differs. The costs are not: with 700 elements the array compares <code>699</code> with all 700 elements; the hash table looks at the 100 in bucket 699 mod 7 = 6.</p>
        ${predict("Why are 12, 19, 26, 33 and 5 all in the same bucket? What does <code>A.contains(40)</code> look at in each implementation?",
          `<p>12, 5, 26, 19 and 33 all leave remainder 5 when divided by 7, so they go to bucket 5, in the order they were added — an unlucky set for this hash function. <code>contains(40)</code>: the array compares 40 with all 6 elements; the hash table looks in bucket 40 mod 7 = 5 and compares with its 5 elements. With a better spread (or more buckets) each bucket would hold one or two. That is Lecture 18.</p>`)}
        ${callout("pitfall", "PITFALL", `<p><b>An ADT promises results, not costs.</b> <code>contains</code> gives the same answer in both, but its running time depends entirely on the data structure. Choosing an implementation is choosing the cost of each operation — what most of this course is about.</p>`)}` },
      { id: "ds", title: "Data structures and algorithms", html: `
        <p>A <b>data structure (DS)</b> is a concrete implementation of an ADT: it specifies the storage and the access mechanisms needed to carry out the operations the ADT defines.</p>
        <table><tr><th>ADT</th><th>data structures that implement it</th><th>in Java's library</th></tr>
        <tr><td>list</td><td>array-based list, linked list</td><td><code>ArrayList</code>, <code>LinkedList</code></td></tr>
        <tr><td>set</td><td>hash table, balanced search tree (e.g. red-black tree)</td><td><code>HashSet</code>, <code>TreeSet</code></td></tr>
        <tr><td>queue</td><td>circular array, linked list</td><td><code>ArrayDeque</code>, <code>LinkedList</code></td></tr></table>
        <p>There are usually several implementations of one ADT because it is rarely possible to make <em>every</em> operation fast at once; some programs use one operation more, some another, and some data sets are small enough not to care. Cars are the same: steer, accelerate and brake are the “ADT” of a car, so you can drive almost any car, though the engines differ.</p>
        <p>An <b>algorithm</b> is a step-by-step procedure that uses ADTs and data structures to solve a task. (The <em>Introduction</em> deck says an algorithm is the “implementation of operations in an ADT”; both are true: the code inside <code>contains</code> is an algorithm, and so is a sort that <em>uses</em> a list.) An algorithm is specified by input and output. For sorting: <b>input</b> a sequence a<sub>1</sub>, …, a<sub>n</sub>; <b>output</b> a permutation a′<sub>1</sub>, …, a′<sub>n</sub> of the input with a′<sub>1</sub> ≤ a′<sub>2</sub> ≤ … ≤ a′<sub>n</sub>. Both halves matter:</p>
        ${codeBlock(CODE.sortSpec)}
        ${out("sortSpec")}` },
      { id: "layers", title: "Three layers", html: `
        <p>Put together: a <b>problem</b> (visit the vertices nearest the start first) is solved by an <b>algorithm</b> (breadth-first search, Lecture 19), which uses an <b>ADT</b> (a queue: add at the back, remove at the front), which is implemented by a <b>data structure</b> (a circular array or a linked list). BFS calls only the queue operations, so switching the implementation is one word:</p>
        ${codeBlock(CODE.bfsLayers)}
        ${out("bfsLayers")}
        ${demo("layers", "Demo 12 · BFS over a queue, two ways", "pick the queue, then step", "Teal: in the queue. Green: visited. Amber: just removed. Switch the implementation and step again — the visit order does not change.")}
        <p>The best implementation depends on memory limits, the expected data size and which operations are used most — and you can change your mind later without touching the algorithm.</p>
        ${callout("pitfall", "PITFALL · AN ADT PROMISES ONLY WHAT IT SAYS", `<p>The set ADT says nothing about order. <code>TreeSet</code> keeps elements sorted; <code>HashSet</code> does not:</p>${codeBlock(CODE.setOrder)}${out("setOrder")}<p>Code that relies on <code>HashSet</code> iterating in some order relies on a detail of the physical form, and may break when the data, the capacity or the Java version changes.</p>`)}` },
      { id: "lists", title: "The list ADT, two ways", html: `
        <p>One ADT, two very different physical forms: <code>IntList</code> with an array, and with a chain of linked nodes. <code>shifts</code> counts elements moved one place in the array; <code>hops</code> counts links followed in the linked list. (Lectures 3 and 7 study both in detail.)</p>
        ${codeBlock(CODE.arrayIntList)}
        ${codeBlock(CODE.linkedIntList)}
        ${codeBlock(CODE.listClient)}
        ${out("listClient")}
        ${demo("intList", "Demo 13 · The same calls on two lists", "edit the calls, then step", "Calls look like <code>insert 0 5</code>, <code>get 4</code>, <code>remove 0</code>. Try five inserts at position 0, then five at the end.")}
        <p>Same list, same answers; the work went to different places. The array's 9 shifts went on inserting at the front and in the middle and on removing the first element, which cost the linked list nothing. The linked list's 6 hops went on walking to the node before each middle insertion and to position 4 for <code>get(4)</code>, which cost the array nothing.</p>
        ${predict("Count the work for <code>insert(0, x)</code> on a list of n elements, in each implementation. And for <code>get(n - 1)</code>?",
          `<p><code>insert(0, x)</code>: the array shifts all n elements; the linked list makes one node and follows no links. <code>get(n - 1)</code>: the array reads one cell; the linked list follows n − 1 links. Neither wins everywhere — which is why both exist.</p>`)}` },
    ],
    takeaways: ["ADT: what. Data structure: how — and how much.", "Write the ADT as an interface; swap implementations freely.", "Algorithm → ADT → data structure."],
  },
  {
    slug: "5-selection", nav: "Selection", title: "The Selection Problem",
    subtitle: "Why a working program is not good enough",
    abstract: "Find the kth largest of N numbers. Two natural solutions are both correct — and both need about N² steps, which for a million numbers is far too many.",
    tags: ["kth largest", "solution 1 / 2", "N² growth", "quickselect"],
    hero: "selectionMini", heroCaption: "Solution 2, k = 3: keep the three largest so far; bump the smallest when a bigger one arrives.",
    sections: [
      { id: "two", title: "Two solutions", html: `
        <p><b>Problem.</b> Given N numbers, find the kth largest, where 1 ≤ k ≤ N. (The slides say “N &gt; k”; k = N, the smallest, is just as well defined.) For <code>12 5 31 8 19 40 2 27 19 33</code> and k = 3 the answer is 31: the largest is 40, then 33, then 31.</p>
        <p><b>Solution 1: sort everything.</b> Read the N numbers into an array, sort it in descending order, return the element in position k.</p>
        <p><b>Solution 2: keep the k largest so far.</b> Read the first k elements into an array and sort them in descending order. Read each remaining element: if it is ≤ the kth element of the array, ignore it; otherwise place it in its correct spot, bumping the last element out. Return the element in position k.</p>
        <p>The invariant of Solution 2: after each element is read, the array holds the k largest elements read so far, in descending order. So at the end its last cell is the kth largest of all.</p>
        ${codeBlock(CODE.selection)}
        ${codeBlock(CODE.selectionDemo)}
        ${out("selectionDemo")}
        ${demo("selection", "Demo 14 · Solution 2, step by step", "edit the data and k, then step", "Amber: the element being read or moved. Teal ring: the cell it is compared with. Red: about to be bumped out. The comparison count matches <code>Selection.comparisons</code>.")}
        <p>The last line runs Solution 2 for every k from 1 to 10 and lists the data in descending order. The duplicate 19 counts twice: the 5th and 6th largest are both 19.</p>
        ${predict("Same data, k = 3. What would Solution 2 do if the last element were 30 instead of 33? And if it were 27?",
          `<p>30 &gt; 27, the third element of <code>[40, 31, 27]</code>, so it is placed between 31 and 27 and 27 is bumped out: <code>[40, 31, 30]</code>, answer 30. 27 is <em>equal</em> to the third element, so step 2.1 ignores it and the answer stays 27. Ignoring equal elements is safe: the kth largest value does not change. (Edit the data in Demo 14 to check.)</p>`)}` },
      { id: "better", title: "Which solution is better?", html: `
        <p>Algorithms can be compared <b>by simulation</b> (run them and measure) or <b>by theoretical analysis</b> (count the steps as a function of the input size). This course is mostly about the second, because it predicts what happens on inputs too large to try. Count element comparisons:</p>
        <ul><li><b>Solution 1</b> with a simple sort such as bubble sort: (N − 1) + (N − 2) + … + 1 = N(N − 1)/2 comparisons, whatever the data — the arithmetic series again.</li>
        <li><b>Solution 2</b>: up to k(k − 1)/2 to sort the first k, then one comparison per remaining element, plus up to k − 1 more for each element that is placed. Worst case (increasing input) about k²/2 + (N − k)k; for k = N/2 that is about ⅜ N².</li></ul>
        <p>Both grow like N². Doubling N quadruples the work:</p>
        ${codeBlock(CODE.selectionCost)}
        ${out("selectionCost")}
        <p>Extrapolate to the slides' example, N = 1,000,000 and k = 500,000: Solution 1 with bubble sort makes about 5 × 10<sup>11</sup> comparisons; Solution 2 about 1.5 × 10<sup>11</sup> on random data and up to 3.75 × 10<sup>11</sup> in the worst case. At about 10<sup>9</sup> simple steps per second that is minutes — and on the slower machines for which this example was first written (Weiss, §1.1), days. Neither finishes in a reasonable time.</p>
        ${demo("selectionCost", "Demo 15 · How the work grows", "drag N")}
        <p><b>Conclusion.</b> Writing a working program is not good enough. Both solutions are correct; both are too slow for large inputs. We want a correct algorithm with minimum resources and minimum running time.</p>` },
      { id: "faster", title: "Is there a better algorithm?", html: `
        <p>Yes — several, and you will meet the tools for them during the course.</p>
        <ul><li><b>A better sort.</b> Solution 1 with an N log N sort (merge sort, Lecture 4, or Java's <code>Arrays.sort</code>) makes about N log<sub>2</sub> N ≈ 2 × 10<sup>7</sup> comparisons for a million numbers — a fraction of a second. Same algorithm, better sort behind step 2.</li>
        <li><b>A heap.</b> Keep the k largest in a min-heap (Lecture 17) instead of a sorted array: bumping costs log k instead of k, about N log k in total.</li>
        <li><b>Quickselect.</b> Partition around a pivot as quicksort does (Lecture 11), then continue only on the side containing the kth largest: on average time proportional to N, with no sorting at all (Exercise 8).</li></ul>
        <p>So the answer to the slides' closing exercise is yes: the right algorithm turns days into milliseconds, which no tuning of Solutions 1 and 2 could do.</p>
        ${callout("pitfall", "PITFALL", `<p><b>“Correct” is not the end of the job.</b> Both solutions pass every small test; their problem appears only when N is large, which is exactly when it matters. Before you write code, estimate how its work grows with the input size. Lectures 5 and 6 give you the notation — O(N²), O(N log N) — to do this precisely.</p>`)}` },
    ],
    takeaways: ["Solution 1: sort all. Solution 2: keep the top k.", "Both ≈ N² comparisons: too slow for N = 10⁶.", "Better: N log N sort, a heap, or quickselect."],
  },
  {
    slug: "6-summary", nav: "Summary", title: "Summary and Practice",
    subtitle: "Check yourself, then practise",
    abstract: "A one-page map of the lecture, a self-check quiz, and nine exercises with solutions.",
    tags: ["knowledge map", "self-check", "exercises"],
    hero: "toc",
    sections: [
      { id: "map", title: "Knowledge map", html: `<div class="map">
        <div class="card"><h3>Exponents and logs</h3><ul><li>2<sup>N</sup> + 2<sup>N</sup> = 2<sup>N+1</sup>, not 2<sup>2N</sup></li><li>log means log<sub>2</sub></li><li>⌊log<sub>2</sub> n⌋ = number of halvings</li><li>change of base: a constant factor</li></ul></div>
        <div class="card"><h3>Series</h3><ul><li>Σ i = N(N+1)/2 ≈ N²/2</li><li>Σ i² = N(N+1)(2N+1)/6</li><li>Σ A<sup>i</sup> = (1 − A<sup>N+1</sup>)/(1 − A)</li><li>≤ 1/(1 − A) when 0 &lt; A &lt; 1</li></ul></div>
        <div class="card"><h3>Proofs</h3><ul><li><b>Counterexample</b> disproves “for all”</li><li><b>Contradiction</b>: infinitely many primes</li><li><b>Induction</b>: basis + step</li><li><b>Structural</b>: leaves = internal + 1</li><li>Horses: the step must work from n₀</li></ul></div>
        <div class="card"><h3>Data types</h3><ul><li>Type = values; data type = values + operations</li><li>Logical form vs physical form</li><li><code>int</code> overflow: the physical form showing</li></ul></div>
        <div class="card"><h3>Abstraction and ADTs</h3><ul><li>Show operations, hide implementation</li><li>ADT → Java <code>interface</code></li><li>Encapsulation: <code>private</code> fields</li><li>Modularity, data independence, integrity</li></ul></div>
        <div class="card"><h3>Structures and algorithms</h3><ul><li>DS = implementation; it sets the costs</li><li>Algorithm → ADT → DS (BFS → queue → array)</li><li>Selection: both simple solutions ≈ N²</li></ul></div></div>` },
      { id: "check", title: "Check your understanding", html: `<div data-demo="quiz"><div class="demo-body"></div></div>` },
      { id: "exercises", title: "Exercises", html: `
        <p>★ apply · ★★ prove or write · ★★★ extend.</p>
        <h3>Exercise 1 ★</h3>
        <p>Simplify log<sub>2</sub>(8<sup>n</sup>), log<sub>4</sub> 64, 2<sup>10</sup> + 2<sup>10</sup> and 4<sup>n</sup> · 2<sup>n</sup>.</p>
        <details class="reveal"><summary>Solution</summary><p>log<sub>2</sub> 8<sup>n</sup> = n log<sub>2</sub> 8 = 3n. log<sub>4</sub> 64 = log<sub>2</sub> 64 / log<sub>2</sub> 4 = 6/2 = 3. 2<sup>10</sup> + 2<sup>10</sup> = 2<sup>11</sup> = 2048. 4<sup>n</sup> · 2<sup>n</sup> = 2<sup>2n</sup> · 2<sup>n</sup> = 2<sup>3n</sup>.</p></details>
        <h3>Exercise 2 ★</h3>
        <p>Find 1 + 3 + 5 + … + (2N − 1), the sum of the first N odd numbers, in closed form; then prove it by induction.</p>
        <details class="reveal"><summary>Solution</summary><p>Σ (2i − 1) = 2 · N(N+1)/2 − N = N². Basis N = 1: 1 = 1². Step: assuming 1 + … + (2N − 1) = N², adding the next odd number gives N² + (2N + 1) = (N + 1)². ∎</p></details>
        <h3>Exercise 3 ★</h3>
        <p>What is 1 + ¼ + 1/16 + … (forever)? Why does an algorithm that does n steps, then n/4, then n/16, … do fewer than 4n/3 steps in total?</p>
        <details class="reveal"><summary>Solution</summary><p>A geometric series with A = ¼: 1/(1 − ¼) = 4/3. The total work is n(1 + ¼ + 1/16 + …) &lt; 4n/3.</p></details>
        <h3>Exercise 4 ★★</h3>
        <p>Disprove “for every positive integer n, 2<sup>n</sup> &gt; n³”. Write a Java loop that finds every counterexample with n ≤ 20.</p>
        <details class="reveal"><summary>Solution</summary><p>n = 2: 4 &lt; 8. The claim fails for n = 2, …, 9; it holds for n = 1 and from n = 10 on (1024 &gt; 1000). Pick “2ⁿ &gt; n³” in Demo 4 to see the first one.</p>${codeBlock(CODE.powerVsCube)}${out("powerVsCube")}</details>
        <h3>Exercise 5 ★★</h3>
        <p>Prove by contradiction that √2 is irrational.</p>
        <details class="reveal"><summary>Solution</summary><p>Suppose √2 = a/b with a, b &gt; 0 in lowest terms. Then a² = 2b², so a² is even, so a is even: a = 2c. Then 4c² = 2b², so b² = 2c² and b is even too — contradicting “lowest terms”. ∎</p></details>
        <h3>Exercise 6 ★★</h3>
        <p>In the trees of §2.5 (every node has 0 or 2 children), prove that a tree with n internal nodes has 2n + 1 nodes. Then write <code>size(FullNode t)</code> and check.</p>
        <details class="reveal"><summary>Solution</summary><p>A tree with n internal nodes has n + 1 leaves, so n + (n + 1) = 2n + 1 nodes. (Directly: a leaf has 0 internal nodes and 1 node; subtrees with n₁ and n₂ internal nodes give n₁ + n₂ + 1 internal and (2n₁+1) + (2n₂+1) + 1 = 2(n₁ + n₂ + 1) + 1 nodes.)</p>${codeBlock(CODE.treeSize)}${out("treeSize")}</details>
        <h3>Exercise 7 ★★</h3>
        <p>Add <code>boolean remove(int x)</code> to the <code>IntegerSet</code> ADT. Write it for <code>ArrayIntegerSet</code> without leaving a gap and without shifting every later element. (Hint: the order of a set's elements does not matter.)</p>
        <details class="reveal"><summary>Solution</summary><p>Move the <em>last</em> element into the hole and shrink the count: one move instead of many. A list could not do this — there the order is part of the ADT.</p>${codeBlock(`public boolean remove(int x) {
    for (int i = 0; i < count; i++) {
        if (items[i] == x) {
            items[i] = items[count - 1];   // fill the hole with the last element
            count--;
            return true;
        }
    }
    return false;
}`)}</details>
        <h3>Exercise 8 ★★★ (the slides' exercise)</h3>
        <p>Write <code>quickSelect(int[] input, int k)</code>: partition around a pivot so that larger elements come first, then continue only in the part containing position k − 1. Check it against <code>Selection.kthLargestBySorting</code> on random data.</p>
        <details class="reveal"><summary>Solution</summary>${codeBlock(CODE.quickSelect)}${out("quickSelect")}<p>Each partition costs time proportional to the part it works on, and on average the part shrinks by a constant factor, so the total is a geometric series: about N + N/2 + N/4 + … &lt; 2N on average. (With the last element as pivot, sorted input is the worst case, about N²/2; a random pivot avoids that. Lecture 11 analyses it.)</p></details>
        <h3>Exercise 9 ★★★</h3>
        <p>The horse “proof” fails. What extra basis case would make the same argument a correct proof, and why can you not provide it?</p>
        <details class="reveal"><summary>Solution</summary><p>The inductive step is valid for every n ≥ 2. So if P(2) — “any two horses have the same colour” — were true, the argument would prove P(n) for all n ≥ 2. But P(2) is false, so the basis cannot be proved. An inductive proof needs both a true basis and a step that connects every case to the next, starting from the basis.</p></details>` },
      { id: "terms", title: "Key terms and further reading", html: `
        <p class="tags">${["exponent", "logarithm", "change of base", "arithmetic series", "geometric series", "counterexample", "proof by contradiction", "induction", "basis", "inductive step", "strong induction", "structural induction", "leaf", "internal node", "full binary tree", "type", "simple type", "composite type", "data item", "data type", "logical form", "physical form", "data abstraction", "encapsulation", "abstract data type (ADT)", "interface", "data structure", "algorithm", "specification", "selection problem", "simulation", "theoretical analysis"].map((t) => `<span class="tag">${t}</span>`).join("")}</p>
        <ul><li>M. A. Weiss, <em>Data Structures and Algorithm Analysis in Java</em>, Chapter 1: the selection problem, the mathematics review and the proof methods.</li>
        <li>T. H. Cormen et al., <em>Introduction to Algorithms</em> (CLRS), Appendix A (summations) and §2.1 (the sorting specification).</li>
        <li>OpenDSA, <em>Data Structures and Algorithms</em>, §1.2 Abstract Data Types. <a href="https://opendsa-server.cs.vt.edu/ODSA/Books/CS3/html/ADT.html" target="_blank" rel="noopener">opendsa-server.cs.vt.edu</a></li></ul>` },
    ],
    takeaways: ["Logs count halvings; series count loops.", "Disprove with one case; prove with induction.", "ADT says what; the data structure decides the cost."],
  },
];

const QUIZ = [
  { q: "Which is equal to 2<sup>20</sup> + 2<sup>20</sup>?",
    opts: ["2<sup>40</sup>", "2<sup>21</sup>", "4<sup>20</sup>", "2<sup>20</sup>"],
    a: 1, why: "Adding two equal powers doubles the value: 2 · 2<sup>20</sup> = 2<sup>21</sup>. 2<sup>40</sup> = 4<sup>20</sup> would be 2<sup>20</sup> · 2<sup>20</sup>." },
  { q: "About how many times can 1,000,000 be halved (integer division) before it reaches 1?",
    opts: ["6", "20", "1000", "500,000"],
    a: 1, why: "⌊log<sub>2</sub> 1,000,000⌋ = 19, about 20 — since 2<sup>20</sup> ≈ 10<sup>6</sup>. That is why binary search on a million elements takes about 20 steps." },
  { q: "You check that a formula holds for n = 1, 2, …, 100 with a program. What have you shown?",
    opts: ["That it holds for every n", "That it holds for n ≤ 100 — a proof for all n needs, e.g., induction", "Nothing at all", "That it fails for some n > 100"],
    a: 1, why: "Testing settles only the cases tested. n² + n + 41 is prime for n = 0 … 39 and not for n = 40. For all n you need a proof; one failing case would have disproved it." },
  { q: "In the “all horses are the same colour” proof, which step is wrong?",
    opts: ["The basis n = 1", "The step from n = 1 to n + 1 = 2: the two sets {1} and {2} do not overlap", "The step from n = 5 to n = 6", "Induction cannot be used for sets"],
    a: 1, why: "The basis is fine and the step works for n ≥ 2. It fails for the first transition, 1 → 2, so no domino after the first falls." },
  { q: "Which statement about an ADT is true?",
    opts: ["It fixes how the data is stored", "It says what the operations do, not how they are implemented or what they cost", "It is the same thing as a data structure", "Java's <code>HashSet</code> is an ADT"],
    a: 1, why: "An ADT is the logical form: the operations and their meaning. A data structure (e.g. a hash table, used by <code>HashSet</code>) is a concrete implementation, and it decides the cost." },
  { q: "A list ADT is implemented with an array and with a linked list. Which operation is cheap in the array but costly in the linked list?",
    opts: ["<code>insert(0, x)</code>", "<code>get(n - 1)</code>", "<code>isEmpty()</code>", "<code>clear()</code>"],
    a: 1, why: "The array reads any cell in one step; the linked list must follow n − 1 links from the head. <code>insert(0, x)</code> is the opposite: n shifts in the array, no hops in the linked list." },
  { q: "Solution 2 of the selection problem, k = 3, holds <code>[40, 31, 27]</code>. The next number read is 27. What happens?",
    opts: ["27 is placed and 27 is bumped out", "27 is ignored", "40 is bumped out", "The array grows to 4 cells"],
    a: 1, why: "27 ≤ top[2] = 27, so step 2.1 ignores it. Equal values cannot change the kth largest." },
  { q: "Why is neither simple selection algorithm good enough for N = 1,000,000, k = 500,000?",
    opts: ["They give wrong answers", "Both make on the order of N² ≈ 10<sup>11</sup>–10<sup>12</sup> comparisons", "Java arrays cannot hold a million numbers", "Sorting is impossible for large N"],
    a: 1, why: "Both are correct, but with a quadratic sort or with k = N/2 both do about N² comparisons. An N log N sort or quickselect does about 10<sup>7</sup> or fewer." },
];
