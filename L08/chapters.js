// Chapter content, adapted from notes/L08-list-applications.md. Code and outputs are CODE[...] /
// OUT[...] from demos.js, which are copied from the checked note.

const demo = (name, title, instr, hint = "") =>
  `<div class="card demo" data-demo="${name}"><div class="head"><span class="title">${title}</span><span>${instr}</span></div>
   <div class="demo-body"></div>${hint ? `<p class="hint">${hint}</p>` : ""}</div>`;

const callout = (kind, label, body) => `<div class="callout ${kind}"><b>${label}</b>${body}</div>`;
const predict = (q, a) => callout("predict", "PREDICT", `<p>${q}</p><details class="reveal"><summary>Show the answer</summary>${a}</details>`);
const prog = (name) => codeBlock(CODE[name]) + codeBlock(OUT[name], "out");

const LECTURE = {
  number: 8,
  title: "List Applications",
  tagline: "Problems solved with linked lists",
  lead: "Polynomials and sparse matrices that store only what exists, and three pointer puzzles — where two lists meet, whether a list loops, and how to drop repeated letters — with every pointer move animated.",
  heroDemo: "cycleMini",
  heroLabel: "A tortoise and a hare · Floyd's cycle check",
  heroCaption: "slow moves one node, fast moves two. On a cycle the hare gains one node per step, so it must land on the tortoise.",
  whyTitle: "Why this lecture matters",
  whySub: "Three ideas that come back all term",
  why: [
    ["Store only what exists", "A polynomial with 3 terms needs 3 nodes, not 1001 array slots. <b>Sparse</b> data belongs in linked structures."],
    ["Merge sorted lists", "Adding polynomials or sparse matrices is the <b>merge</b> step of merge sort, in O(m + n)."],
    ["Think with two pointers", "Intersection and cycle detection need only <b>two pointers</b> and O(1) extra memory — a classic interview pattern."],
  ],
  ctaTitle: "Ready to put linked lists to work?",
  minutes: "About 75–90 minutes",
  videos: {
    "media/L08-1.mp4": "Lecture 8 · Part 1 — Polynomials as term lists (11.3 min)",
    "media/L08-2.mp4": "Lecture 8 · Part 2 — Sparse matrices (10.0 min)",
    "media/L08-3.mp4": "Lecture 8 · Part 3 — Where two lists meet (9.5 min)",
    "media/L08-4.mp4": "Lecture 8 · Part 4 — Cycles and duplicate letters (11.4 min)",
  },
};

const CHAPTERS = [
  {
    slug: "1-review", nav: "Kinds of list", title: "Four Kinds of Linked List",
    subtitle: "Singly, doubly, circular and doubly circular",
    abstract: "A linked list keeps each element in its own node and links the nodes with references. Where the links point decides how you can walk the list, and when you have to stop.",
    tags: ["next / prev", "circular", "do-while"],
    hero: "kindsMini", heroCaption: "A circular list: the last node points back to the head.",
    sections: [
      { id: "video-1", title: "Watch: Polynomials as term lists", html: `
        <div class="card video" data-video="media/L08-1.mp4"></div>` },
      { id: "kinds", title: "Four variants", html: `
        <p>A <b>linked list</b> stores its elements in separate <b>nodes</b>; each node holds one element and a reference (a pointer) to the next node. The list itself keeps only a reference to the first node, the <b>head</b>. Lecture 7 met four variants:</p>
        <ul><li><b>Singly linked.</b> Each node has <code>next</code>; the last node's <code>next</code> is <code>null</code>.</li>
        <li><b>Doubly linked.</b> Each node also has <code>prev</code>, so you can walk both ways. The first <code>prev</code> and the last <code>next</code> are <code>null</code>.</li>
        <li><b>Circular.</b> Singly linked, but the last node's <code>next</code> points back to the head.</li>
        <li><b>Doubly circular.</b> Circular both ways: the last <code>next</code> is the head and the head's <code>prev</code> is the last node.</li></ul>
        <p>The slides draw each node at a memory address (100, 200, 300) with the address of the next node written inside it. That is exactly what a Java reference is: a value that says where another object lives.</p>
        ${demo("kinds", "Demo 1 · Walk each kind of list", "pick a kind, then step (← →)", "Watch where the walk ends: at <code>null</code> for the linear lists, back at the start for the circular ones.")}` },
      { id: "nodes", title: "Nodes in Java", html: `
        ${codeBlock(CODE.IntNode)}
        ${codeBlock(CODE.DNode)}
        <p>In a circular list there is no <code>null</code> to stop at, so a traversal stops when it gets back to where it started. A <code>do</code>-<code>while</code> loop fits: it visits the first node and tests afterwards.</p>
        ${prog("CircularDemo")}
        ${callout("pitfall", "PITFALL", `<p>A <code>while (p != head)</code> loop that tests <em>first</em> never enters the loop, because <code>p</code> starts at <code>head</code>. And <code>while (p != null)</code> on a circular list never stops. With circular lists, decide where you start and test for “back at the start”.</p>`)}` },
      { id: "why", title: "Array or list?", html: `
        <table><tr><th>operation</th><th>array</th><th>singly linked list</th></tr>
        <tr><td>read the k-th element</td><td>O(1)</td><td>O(k): walk from the head</td></tr>
        <tr><td>insert/delete after a known node</td><td>O(n): shift the rest</td><td>O(1): change two references</td></tr>
        <tr><td>memory</td><td>fixed block, maybe unused</td><td>one node per element, plus a reference each</td></tr></table>
        <p>The rest of the lecture uses the last two rows: a list stores only what exists, and it can be cut and re-joined cheaply.</p>` },
    ],
    takeaways: ["A node = data + reference(s).", "Linear lists end in null; circular lists come back.", "Circular walks: do-while, stop at the start."],
  },
  {
    slug: "2-polynomials", nav: "Polynomials", title: "Application 1: Polynomials",
    subtitle: "Arrays for dense, linked terms for sparse",
    abstract: "An array indexed by exponent is simple, but a polynomial like 10x¹⁰⁰⁰ + 5x¹⁴ + 1 fills it with zeros. A sorted list of terms stores only what exists, and adding becomes a merge.",
    tags: ["coeffArray", "sparse", "merge", "O(m + n)"],
    hero: "polyMergeMini", heroCaption: "Adding P1 + P2 by merging two sorted term lists.",
    sections: [
      { id: "array", title: "The array representation", html: `
        <p>A polynomial of degree N is <span class="math">P(x) = A<sub>N</sub>x<sup>N</sup> + … + A<sub>1</sub>x + A<sub>0</sub></span>. Each <b>term</b> has a <b>coefficient</b> A<sub>i</sub> and an <b>exponent</b> i. The obvious choice is an array indexed by the exponent: <code>coeffArray[i]</code> holds A<sub>i</sub>, and <code>highPower</code> records the degree.</p>
        ${codeBlock(CODE.ArrayPolynomial)}
        ${callout("note", "NOTE", `<p>The slides write <code>int coeffArray[MaxDegree + 1];</code> inside the class. That is C syntax; in Java an array field is declared <code>int[] coeffArray</code> and created with <code>new int[...]</code>, and constants are written <code>MAX_DEGREE</code>. The slides' <code>Error("Exceed array size")</code> becomes a thrown exception. Passing the result in as a third parameter works in Java because the method receives a reference to the caller's object and fills it in.</p>`)}
        <p>Adding is one pass over the exponents. Multiplying uses <span class="math">(a x<sup>i</sup>)(b x<sup>j</sup>) = ab x<sup>i+j</sup></span>: every term meets every term, and the product lands in slot <code>i + j</code> — several pairs can land in the same slot, hence <code>+=</code>.</p>
        ${prog("ArrayPolyDemo")}
        ${predict("In <code>multPolynomial(p, q, prod)</code> above, how many times does the inner statement run? How many of those multiply two non-zero coefficients? Which slot of <code>prod</code> receives two contributions?",
          `<p><code>i</code> runs over 0..3 and <code>j</code> over 0..2: 4 × 3 = 12 times. P has 3 non-zero terms and Q has 2, so only 6 are useful; the other 6 multiply by a zero. Slot 3 gets 4x³ · 5 = 20x³ and 2x · 3x² = 6x³, total 26x³.</p>`)}
        ${demo("polyArray", "Demo 2 · multPolynomial on arrays", "step through every (i, j) pair", "Red cells are the zero factors: those steps do nothing useful. Type a sparse polynomial such as <code>x^7 + 1</code> to see the waste grow.")}
        <p><b>Cost.</b> <code>zeroPolynomial</code> always loops over all MAX_DEGREE + 1 slots, so <code>addPolynomial</code> is O(MAX_DEGREE). <code>multPolynomial</code> runs its inner statement (h<sub>1</sub>+1)(h<sub>2</sub>+1) times: O(h<sub>1</sub>h<sub>2</sub>).</p>` },
      { id: "sparse", title: "Good or bad? Sparse polynomials", html: `
        <p>The array is fine for <b>dense</b> polynomials. Now take the slides' example:</p>
        <div class="math-block">P<sub>1</sub>(x) = 10x<sup>1000</sup> + 5x<sup>14</sup> + 1 &nbsp;&nbsp;&nbsp; P<sub>2</sub>(x) = 3x<sup>1990</sup> − 2x<sup>1492</sup> + 11x + 5</div>
        <p>P<sub>1</sub> has 3 terms but needs 1001 slots; P<sub>2</sub> has 4 terms and needs 1991. Such a polynomial is <b>sparse</b>: almost all coefficients are zero.</p>
        ${prog("SparsePolyCost")}
        <p>Almost two million multiplications, of which twelve matter: <b>most of the time is spent multiplying zeros</b>, and thousands of slots hold seven numbers.</p>` },
      { id: "linked", title: "The linked representation", html: `
        <p>Store only the terms that exist: one node per term, kept <b>sorted by exponent, highest first</b>.</p>
        ${codeBlock(CODE.Term)}
        <p>P<sub>1</sub> becomes three nodes, (10, 1000) → (5, 14) → (1, 0) → <code>null</code>, and P<sub>2</sub> four, (3, 1990) → (−2, 1492) → (11, 1) → (5, 0) → <code>null</code>. The space is proportional to the number of terms, not to the degree.</p>` },
      { id: "add", title: "Adding: merge the two term lists", html: `
        <p>Because both lists are sorted by exponent, adding them is the <b>merge</b> step of merge sort (Lecture 4). Compare the exponents at the two fronts:</p>
        <ul><li>different exponents: copy the term with the <b>larger</b> exponent and advance in that list;</li>
        <li>equal exponents: add the coefficients, keep the term only if the sum is not zero, and advance in both;</li>
        <li>when one list runs out, copy the rest of the other.</li></ul>
        <p>The result is built at its tail. A <b>dummy</b> (sentinel) node at the front saves a special case for the first term: we always append after <code>tail</code> and return <code>dummy.next</code>.</p>
        ${codeBlock(CODE.LinkedPolynomial)}
        ${prog("LinkedPolyDemo")}
        ${demo("polyMerge", "Demo 3 · add(P, Q) as a merge", "step, or type your own polynomials", "Try <code>x + 1</code> and <code>x - 1</code>: the constant terms cancel and nothing is appended.")}
        <p>Trace P<sub>1</sub> + P<sub>2</sub>: 1990 &gt; 1000, copy 3x<sup>1990</sup>; 1492 &gt; 1000, copy −2x<sup>1492</sup>; 1000 &gt; 1, copy 10x<sup>1000</sup>; 14 &gt; 1, copy 5x<sup>14</sup>; 1 &gt; 0, copy 11x; 0 = 0, add 1 + 5 = 6. Six comparisons for seven input terms, because the equal exponents used up a term from each list at once.</p>
        ${predict("Adding (x + 1) and (x − 1) gives 2x, not 2x + 0. Which line of <code>add</code> makes sure the zero constant term is not stored? Why does <code>tail</code> only move when <code>tail.next</code> is not <code>null</code>?",
          `<p><code>if (c != 0)</code> skips a term whose coefficient sums to zero. Then no node was appended, so <code>tail.next</code> is still <code>null</code> and <code>tail</code> must stay. If zero terms were stored, <code>(x + 1) * (x - 1)</code> would print <code>x^2 + 0x - 1</code>.</p>`)}
        <p><b>Cost of adding.</b> Each comparison copies at least one term and advances at least one list: O(m + n) for lists of m and n terms, against O(MAX_DEGREE) for the array.</p>` },
      { id: "mult", title: "Multiplying", html: `
        <p>The slides' hint: if P has m terms and Q has n, form the m partial products t<sub>1</sub>Q, …, t<sub>m</sub>Q and merge them. Multiplying Q by one term c x<sup>e</sup> multiplies every coefficient by c and adds e to every exponent — the order is unchanged, so each partial product is already sorted. <code>multiply</code> merges them into the result one at a time with <code>add</code>.</p>
        ${demo("polyMult", "Demo 4 · multiply(P, Q)", "step through the partial products", "Press “Slides' P1 · P2”: 12 term products and a few dozen merge steps, against 1,992,991 array steps.")}
        <p><b>Cost.</b> There are mn term products. The result can grow to mn terms, and merging the i-th partial product into it costs O(in + n), so the m merges cost O(n + 2n + … + mn) = <b>O(m²n)</b> in the worst case. Merging the m lists in pairs, as merge sort does, brings it to O(mn log m) (Exercise 7).</p>
        ${callout("pitfall", "PITFALL", `<p><code>add</code> must not modify its inputs. Our version copies every term into new nodes. A version that re-links the input nodes into the result is faster, but then <code>multiply</code> would destroy <code>q</code> the first time it is used, and the second partial product would be wrong.</p>`)}` },
    ],
    takeaways: ["Dense → array; sparse → list of terms.", "Adding sorted term lists = merge, O(m + n).", "Multiply: m partial products, merged."],
  },
  {
    slug: "3-sparse", nav: "Sparse matrices", title: "Application 2: Sparse Matrices",
    subtitle: "Triplets, a list of triplets, and orthogonal lists",
    abstract: "A 40,000 × 2,500 score table has 100 million cells but only about 120,000 scores. Store the non-zero entries as (row, column, value), in an array or in linked lists.",
    tags: ["triplet", "row-major", "orthogonal list"],
    hero: "tripletsMini", heroCaption: "Scanning a matrix row by row and keeping only the non-zero entries.",
    sections: [
      { id: "video-2", title: "Watch: Sparse matrices", html: `
        <div class="card video" data-video="media/L08-2.mp4"></div>` },
      { id: "problem", title: "The problem", html: `
        <p>A university has 40,000 students and 2,500 subjects and wants every student's score in every subject. A 2D array has 40,000 × 2,500 = 100,000,000 entries. If each student takes about 3 subjects, only 120,000 are real scores — about 0.12% of the array. The rest are zeros.</p>
        <p>A streaming company with 10 million users and 10,000 movies would need 10<sup>7</sup> × 10<sup>4</sup> = 10<sup>11</sup> (100 G) entries — 400 GB of <code>int</code>s, nearly all zero. A matrix in which most entries are zero is a <b>sparse matrix</b>; as with polynomials, store only the non-zero entries.</p>` },
      { id: "triplets", title: "First solution: triplets", html: `
        <p>Store each non-zero entry as a <b>triplet</b> (row, column, value), in <b>row-major order</b>: by row, and by column within a row.</p>
        ${codeBlock(CODE.Triplet)}
        ${codeBlock(CODE.TripletMatrix)}
        ${prog("TripletDemo")}
        ${callout("note", "NOTE · SLIDE CORRECTION", `<p>The slides' triplet table for this matrix lists (2, 2, 2). The 2 in row 2 is in column 3 (counting from 0) — the row is <code>4 0 0 2 0 0</code> — so the triplet is (2, 3, 2), as printed above.</p>`)}
        ${demo("triplets", "Demo 5 · From a matrix to triplets", "step, or edit any cell", "Every cell is visited once (O(rc)), but only the non-zero ones are stored. The linked list below is Section 3.3: the same triplets, one node each.")}
        <p>A matrix with r rows, c columns and t non-zero entries takes 3t numbers instead of rc — a win when t &lt; rc/3. For the university, 360,000 numbers instead of 100,000,000. Triplets use the least space, hence “minimum space”. The price: looking up one entry means a scan (O(t), or O(log t) with binary search since the triplets are sorted), and inserting a new entry in the middle shifts the array.</p>` },
      { id: "list", title: "Second solution: a linked list of triplets", html: `
        <p>Put the same triplets into a linked list, still in row-major order. Inserting or deleting an entry no longer shifts anything; it just re-links.</p>
        ${codeBlock(CODE.MatrixNode)}
        ${prog("LinkedMatrixDemo")}
        <p>Row 2 is all zeros, so it contributes no node at all.</p>` },
      { id: "orthogonal", title: "Orthogonal lists", html: `
        <p>One list in row-major order is good for “walk along row 3” but bad for “walk down column 2”: a column's entries are scattered through the whole list. An <b>orthogonal list</b> (or <b>cross-linked list</b>) gives every element node two links: <code>right</code>, the next non-zero entry in the same row, and <code>down</code>, the next in the same column. Each row and each column has a header pointing to its first node.</p>
        <p>The slides draw the textbook version: the header nodes are themselves linked from a top header that stores the size and the number of non-zero entries (5 4 6), and every row and column list is circular, ending back at its header. The Java below keeps the idea but uses two arrays of header references, <code>rowHead[r]</code> and <code>colHead[c]</code>, with <code>null</code> at the end of each list.</p>
        ${codeBlock(CODE.CrossNode)}
        ${codeBlock(CODE.OrthogonalMatrix)}
        ${prog("OrthogonalDemo")}
        ${demo("ortho", "Demo 6 · An orthogonal list", "choose get(r, c) or a column, then step", "Black arrows are <code>right</code> links, teal arrows are <code>down</code> links. Every node is on one row list and one column list.")}
        ${predict("Which nodes does <code>get(3, 2)</code> visit before it returns 0? How many <code>down</code> steps does it take to walk column 0?",
          `<p>It starts at <code>rowHead[3]</code> = (3, 0, 8): column 0 ≤ 2, not equal, so it moves right to (3, 3, 1). Column 3 &gt; 2, so the loop stops and returns 0 — two nodes visited. Column 0 holds (0, 0, 2), (1, 0, 4), (3, 0, 8): two <code>down</code> steps after the header.</p>`)}
        <table><tr><th>representation</th><th>space for t non-zeros</th><th>read (r, c)</th><th>walk a row / column</th><th>insert</th></tr>
        <tr><td>2D array</td><td>r · c</td><td>O(1)</td><td>O(c) / O(r)</td><td>O(1)</td></tr>
        <tr><td>triplet array</td><td>3t (minimum)</td><td>O(log t)</td><td>O(t) / O(t)</td><td>O(t): shift</td></tr>
        <tr><td>list of triplets</td><td>t nodes, 3 ints + 1 link</td><td>O(t)</td><td>O(t) / O(t)</td><td>O(t) to find, O(1) to link</td></tr>
        <tr><td>orthogonal list</td><td>t nodes, 3 ints + 2 links, + r + c headers</td><td>O(row length)</td><td>O(row) / O(column)</td><td>O(row + column)</td></tr></table>` },
    ],
    takeaways: ["Sparse: store (row, col, value) only.", "Triplets: least space; lists: cheap inserts.", "Orthogonal list: walk any row or column."],
  },
  {
    slug: "4-intersection", nav: "Intersection", title: "Exercise 1: Where Two Lists Meet",
    subtitle: "Find the first common node in O(M + N)",
    abstract: "Two lists that share a node share everything after it. Walk L1 then L2 with one pointer, and L2 then L1 with the other: both cover M + N nodes, so they reach the first common node together.",
    tags: ["node identity", "O(MN) → O(M + N)", "two pointers"],
    hero: "intersectMini", heroCaption: "a walks L1 then L2; b walks L2 then L1. They meet at c1.",
    sections: [
      { id: "video-3", title: "Watch: Where two lists meet", html: `
        <div class="card video" data-video="media/L08-3.mp4"></div>` },
      { id: "problem", title: "The problem", html: `
        <p>Two singly linked lists L1 (M nodes) and L2 (N nodes) <b>intersect</b>: from some node on, they share their nodes. In the slides' example L1 is a1 → a2 → a3 → c1 → c2 and L2 is b1 → b2 → c1 → c2. Find the <b>first common node</b>, here c1.</p>
        <p>Once two lists share a node, they share everything after it, because each node has only one <code>next</code>. Two intersecting lists look like a “Y” lying on its side, never like an “X”.</p>
        ${callout("pitfall", "PITFALL · SAME NODE, NOT SAME DATA", `<p>“Common node” means the <em>same node object</em>. In Java, <code>a == b</code> on two references is true exactly when they refer to the same object. Two different nodes that both hold <code>"c1"</code> are not an intersection. Compare references, never <code>a.label.equals(b.label)</code>.</p>`)}
        ${codeBlock(CODE.Node)}` },
      { id: "brute", title: "Method 1: compare every pair", html: `
        <p>Walk L1 with <code>a</code>. For each <code>a</code>, walk all of L2 with <code>b</code> and check <code>a == b</code>. The first <code>a</code> that appears in L2 is the first common node, because the nodes of L1 are tried in order.</p>
        ${codeBlock(CODE.Intersection)}
        <p>In the worst case (the common node is the last node, or there is none) the inner check runs M × N times: <b>O(MN)</b> time, O(1) extra space. Pick “1: every pair” in Demo 7 below to watch it.</p>` },
      { id: "special", title: "A special case: equal lengths", html: `
        <p>If L1 and L2 have the <b>same length</b>, they also have the same number of nodes <em>before</em> the first common node (the shared tail is the same for both). Start one pointer at each head and move them together: they arrive at the first common node at the same moment, within M steps.</p>` },
      { id: "switch", title: "Method 2: make the lengths equal", html: `
        <p>When the lengths differ, make them equal without copying anything. Imagine L1′ = L1 followed by L2 (a1 a2 a3 c1 c2 b1 b2 <b>c1</b> c2) and L2′ = L2 followed by L1 (b1 b2 c1 c2 a1 a2 a3 <b>c1</b> c2). Both have M + N nodes and end in the same nodes, so by the special case two pointers moving together meet at the first common node. We never build L1′ and L2′: <code>a</code> walks L1 and then jumps to the head of L2; <code>b</code> walks L2 and then jumps to the head of L1.</p>
        <p><b>Why they meet.</b> Say L1 has x private nodes, L2 has y, and the common part z, so M = x + z and N = y + z. Pointer <code>a</code> reaches the first common node after x + z + y moves (all of L1, then L2's private part), and <code>b</code> after y + z + x. Same count, same moment. If x = y they meet on the first pass. Either way: at most M + N moves, <b>O(M + N)</b> time, O(1) extra space.</p>
        ${demo("intersect", "Demo 7 · Two pointers on two lists", "choose a method and the lengths, then step", "Set “shared” to 0: the slides' version never stops, the safe version returns null after M + N + 1 moves.")}
        ${prog("IntersectionDemo")}
        ${callout("note", "NOTE", `<p>The slides' Method 2 (<code>firstCommonSwitch</code>) assumes the lists <em>do</em> intersect, as the problem says. If they don't, <code>a</code> and <code>b</code> are never equal and it loops forever. The safe version lets each pointer step onto <code>null</code> once before it jumps: with no common node both become <code>null</code> at the same moment, after M + N + 1 moves, and <code>null</code> is returned.</p>`)}
        ${predict("L1 = a1 → c1 → c2 → c3 and L2 = b1 → b2 → b3 → b4 → c1 → c2 → c3. With the slides' Method 2, list the nodes <code>a</code> visits until it meets <code>b</code>. How many comparisons are made?",
          `<p>Here x = 1, y = 4, z = 3. <code>a</code> visits a1, c1, c2, c3, b1, b2, b3, b4, c1 and <code>b</code> visits b1, b2, b3, b4, c1, c2, c3, a1, c1. They meet at c1 after 8 moves, on the 9th comparison (x + y + z + 1). Set Demo 7 to 1, 4, 3 to check.</p>`)}` },
    ],
    takeaways: ["Compare nodes with ==, not their data.", "Every pair: O(MN).", "Switch heads: both walk M + N, O(M + N)."],
  },
  {
    slug: "5-cycle", nav: "Cycles", title: "Exercise 2: Cycle Detection",
    subtitle: "Does following next ever come back?",
    abstract: "A bounded walk guesses, a hash set remembers every node, and Floyd's tortoise and hare decides in O(n) time with two pointers and no extra memory.",
    tags: ["ρ-shaped list", "hash set", "Floyd", "O(1) space"],
    hero: "cycleMini", heroCaption: "Tail 2, cycle 6: they meet at step 6, the first multiple of 6 that is ≥ 2.",
    sections: [
      { id: "video-4", title: "Watch: Cycles and duplicate letters", html: `
        <div class="card video" data-video="media/L08-4.mp4"></div>` },
      { id: "problem", title: "The problem", html: `
        <p>Given the head of a singly linked list, decide whether it has a <b>cycle</b>: whether following <code>next</code> ever comes back to a node already visited. A cyclic list looks like the letter ρ (rho): a <b>tail</b> of t nodes, then a <b>cycle</b> of x nodes whose last node points back to the cycle's <b>entrance</b>. An acyclic list ends in <code>null</code>. (A circular list is the case t = 0.)</p>
        <p>A broken pointer update can create such a cycle by accident, and then every <code>while (p != null)</code> loop runs forever — so this is a useful check, not just a puzzle. We number the nodes 0, 1, 2, … from the head, and build test lists with a helper:</p>
        ${codeBlock(CODE.Cycles)}` },
      { id: "bounded", title: "Method 1: walk and hope", html: `
        <p>If the list is acyclic, following <code>next</code> reaches <code>null</code> sooner or later. So walk at most <code>limit</code> steps and answer “cyclic” if no <code>null</code> turned up. The trouble is choosing <code>limit</code>: it must exceed the length of every acyclic list you might get, and you don't know that length (if you did, you could just count). Too small, and the answer is wrong; huge, and every cyclic list costs <code>limit</code> steps. Pick “1: bounded walk” in Demo 8 with no cycle and a small limit to see it fail.</p>` },
      { id: "set", title: "Method 2: remember the nodes you have seen", html: `
        <p>Store every visited node; reaching a stored node means you went round a cycle, reaching <code>null</code> means there is none. In a plain list L′ each search costs O(size of L′), so n nodes cost 1 + 2 + … + n = O(n²). In a <b>hash set</b> (Lecture 18) each search and insert is O(1) expected, so the walk is O(n) time — but it needs O(n) extra memory.</p>
        ${callout("note", "NOTE", `<p><code>IntNode</code> does not override <code>equals</code> or <code>hashCode</code>, so the <code>HashSet</code> compares nodes by identity — exactly what we want. If a node class compared data in <code>equals</code>, use an identity set (<code>Collections.newSetFromMap(new IdentityHashMap&lt;&gt;())</code>) instead.</p>`)}` },
      { id: "floyd", title: "Method 3: two runners on a track", html: `
        <p>Two pointers start at the head: the <b>tortoise</b> <code>slow</code> moves one node per step, the <b>hare</b> <code>fast</code> moves two. This is <b>Floyd's cycle-finding algorithm</b>.</p>
        <ul><li><b>Acyclic.</b> The hare runs ahead and finds the end: <code>fast</code> or <code>fast.next</code> becomes <code>null</code>, after about n/2 steps.</li>
        <li><b>Cyclic.</b> The hare enters the cycle first and never leaves. Once the tortoise is on the cycle too, the hare gains exactly <b>one node per step</b>. Let d (0 ≤ d &lt; x) be how far the hare still has to go, forward round the cycle, to reach the tortoise. Each step reduces d by exactly 1, so it goes d, d − 1, …, 1, 0: within x − 1 steps they are on the same node. The hare cannot jump over the tortoise, because the gap shrinks by one, not two.</li></ul>
        ${demo("cycle", "Demo 8 · Tortoise and hare", "set the tail and cycle lengths, then step", "Set cycle x = 0 for a list with no cycle. Compare the four methods on the same list.")}
        <p><b>When exactly do they meet?</b> After s steps the tortoise is at node s and the hare at node 2s. Once both are on the cycle (s ≥ t), they share a node exactly when the hare's extra distance s is a whole number of laps: a multiple of x. So they first meet at <b>the smallest multiple of x that is ≥ t (and ≥ 1)</b>. That is at most t + x − 1 ≤ n steps (x when t = 0): <b>O(n) time, O(1) extra space</b>.</p>
        ${prog("CycleDemo")}
        <p>The last line shows Method 1 failing: a 50-node list without a cycle is reported as cyclic because <code>limit</code> is only 10. The meeting steps match the formula: t = 7, x = 3 meet at step 9, the first multiple of 3 that is ≥ 7.</p>
        ${callout("pitfall", "PITFALL · COMPARE AFTER MOVING", `<p>The slides' version tests <code>if A == B</code> at the <em>top</em> of the loop. Both pointers start at the head, so the very first test is already true, and the method says “cyclic” for every list with at least two nodes. Move first, then compare, as <code>hasCycle</code> does. (Pick “3 as on the slide” in Demo 8 with x = 0.)</p>
          ${prog("SlideCycleBug")}`)}
        ${predict("A list has a tail of 4 nodes and a cycle of 3 (7 nodes). After how many steps do <code>slow</code> and <code>fast</code> first meet, and on which node?",
          `<p>The smallest multiple of 3 that is ≥ 4 is 6, so they meet after 6 steps, at node 6. Check: <code>fast</code> has made 12 moves — 6 to reach node 6, then two laps of the cycle 4 → 5 → 6 → 4 bring it back to node 6.</p>`)}
        <table><tr><th>method</th><th>time</th><th>extra space</th><th>always correct?</th></tr>
        <tr><td>1 bounded walk</td><td>O(limit)</td><td>O(1)</td><td>no: needs limit &gt; length</td></tr>
        <tr><td>2 visited set</td><td>O(n) expected (hash set); O(n²) with a list</td><td>O(n)</td><td>yes</td></tr>
        <tr><td>3 Floyd</td><td>O(n)</td><td>O(1)</td><td>yes</td></tr></table>` },
    ],
    takeaways: ["A cyclic list is a tail plus a loop (ρ).", "Hash set: O(n) time, O(n) memory.", "Floyd: move, then compare; O(n), O(1)."],
  },
  {
    slug: "6-duplicates", nav: "Duplicates", title: "Exercise 3: Removing Duplicate Letters",
    subtitle: "From O(M²) to O(M) with a table of 26 flags",
    abstract: "Deleting from a singly linked list means making the previous node skip. Comparing every pair costs O(M²); remembering which letters were seen costs O(M).",
    tags: ["pre.next = a.next", "boolean[26]", "direct addressing"],
    hero: "dedupMini", heroCaption: "a → b → b → a → c becomes a → b → c.",
    sections: [
      { id: "problem", title: "The problem", html: `
        <p>Each node of a singly linked list holds a lowercase letter. Remove every node whose letter already appeared earlier, keeping the first occurrence: a → b → b → a → c becomes a → b → c.</p>
        ${codeBlock(CODE.CharNode)}
        <p>Deleting a node from a singly linked list means making the node <em>before</em> it skip it: <code>pre.next = node.next</code>. So both methods keep a pointer <code>pre</code> to the last node that stays. The first node always stays, so the head never changes.</p>` },
      { id: "naive", title: "Method 1: compare with all later nodes", html: `
        <p>For each node <code>a</code>, walk the rest with <code>b</code> (and <code>pre</code> one behind), and unlink every later node with the same letter. After an unlink <code>pre</code> stays, because the node after <code>pre</code> has changed; otherwise <code>pre</code> moves up to <code>b</code>. Either way <code>b</code> moves on.</p>
        ${codeBlock(CODE.Dedup)}
        <p>The outer loop runs at most M times and the inner loop at most M − 1: <b>O(M²)</b> time, O(1) extra space.</p>
        ${callout("note", "NOTE · SLIDE CORRECTIONS", `<p>The slides' Method 1 has three slips. It starts with <code>A = L.head.next</code>, which skips the first node, so later copies of the first letter survive (a b b a c keeps both a's). Its inner loop tests <code>B.next != null</code>, which skips the last node and crashes when <code>A</code> is the last node (<code>B</code> is <code>null</code>). And <code>B</code> must move on after an unlink too, not only in the <code>else</code> branch. The version above fixes all three.</p>`)}` },
      { id: "table", title: "Method 2: a table of 26 flags", html: `
        <p>There are only 26 lowercase letters. Keep a <code>boolean[26]</code>: <code>seen[k]</code> is true once the k-th letter has appeared. <code>a.data - 'a'</code> turns a letter into its index in O(1), because <code>char</code> values are numbers and the letters are consecutive. One pass: a new letter is marked and kept; a seen letter is unlinked. <b>O(M)</b> time, and the table is 26 flags whatever M is, so O(1) extra space. This is direct addressing, the simplest form of hashing (Lecture 18); for arbitrary data a <code>HashSet</code> plays the role of the table.</p>
        ${demo("dedup", "Demo 9 · Removing repeated letters", "pick a method, type letters, then step", "Count the steps: the table method looks at each node once; the naive method compares each node with all later ones.")}
        ${prog("DedupDemo")}
        ${callout("pitfall", "PITFALL · boolean, NOT Boolean", `<p>The slides write <code>Boolean b[] = new Boolean[26]</code>. <code>Boolean</code> is the wrapper class, and a new <code>Boolean[]</code> is full of <code>null</code>, not <code>false</code>. The test <code>b[index] == false</code> must then unbox <code>null</code>, and the program stops with a <code>NullPointerException</code> right after printing this line:</p>
          ${prog("BoxedTable")}<p>Use the primitive type <code>boolean[]</code>, which starts all <code>false</code>.</p>`)}
        ${predict("Run Method 2 by hand on c → a → c → c → a → b. Which letters are in <code>seen</code> at the end, and how many unlinks happen?",
          `<p><code>seen</code> holds a, b, c. The 3rd, 4th and 5th nodes (c, c, a) are repeats: three unlinks, leaving c → a → b. At the 4th node <code>pre</code> is still the 2nd node, because the 3rd was unlinked, so <code>pre.next = a.next</code> again skips correctly. Type <code>caccab</code> into Demo 9 to check.</p>`)}` },
    ],
    takeaways: ["Delete = make pre skip the node.", "Every pair: O(M²).", "boolean[26] table: O(M), O(1) space."],
  },
  {
    slug: "7-summary", nav: "Summary", title: "Summary and Practice",
    subtitle: "Check yourself, then write some pointer code",
    abstract: "A one-page map of the lecture, six self-check questions and seven exercises with checked solutions.",
    tags: ["knowledge map", "self-check", "exercises"],
    hero: "toc",
    sections: [
      { id: "map", title: "Knowledge map", html: `<div class="map">
        <div class="card"><h3>Linked lists</h3><ul><li>Singly, doubly, circular, doubly circular</li><li>Circular walk: <code>do</code>-<code>while</code>, stop at the start</li><li>Delete: <code>pre.next = node.next</code></li></ul></div>
        <div class="card"><h3>Polynomials</h3><ul><li>Array by exponent: simple, wastes zeros</li><li>Sorted term list: only real terms</li><li>Add = <b>merge</b>, O(m + n); multiply = merge m partial products</li></ul></div>
        <div class="card"><h3>Sparse matrices</h3><ul><li><b>Triplets</b> (row, col, value): 3t numbers</li><li>List of triplets: cheap inserts</li><li><b>Orthogonal list</b>: <code>right</code> + <code>down</code> links</li></ul></div>
        <div class="card"><h3>Intersection</h3><ul><li>Same node = same reference (<code>==</code>)</li><li>Every pair: O(MN)</li><li>Switch heads: O(M + N), O(1) space</li></ul></div>
        <div class="card"><h3>Cycle detection</h3><ul><li>Bounded walk: unreliable</li><li>Hash set: O(n) time and memory</li><li><b>Floyd</b>: move, then compare; O(n), O(1)</li></ul></div>
        <div class="card"><h3>Duplicates</h3><ul><li>Compare all pairs: O(M²)</li><li><code>boolean[26]</code> table: O(M)</li><li><code>boolean</code>, not <code>Boolean</code></li></ul></div></div>` },
      { id: "check", title: "Check your understanding", html: `<div data-demo="quiz"><div class="demo-body"></div></div>` },
      { id: "exercises", title: "Exercises", html: `
        <p>★ trace or modify · ★★ write · ★★★ extend or prove. Test every method on the smallest cases first: an empty list, one node, two nodes.</p>
        <h3>Exercise 1 ★ (evaluate)</h3>
        <p>Write <code>evaluate(Term p, long x)</code> that returns the value of a linked polynomial at x. Compute x<sup>e</sup> with a loop or with fast power.</p>
        <details class="reveal"><summary>Solution</summary>${prog("Evaluate")}</details>
        <h3>Exercise 2 ★★ (intersection by lengths)</h3>
        <p>Another O(M + N) method: count both lengths, advance the pointer on the longer list by the difference, then move both together until they meet. Write it and explain why it is correct.</p>
        <details class="reveal"><summary>Solution</summary><p>After skipping |M − N| nodes of the longer list, both pointers have the same number of nodes left: the equal-length special case.</p>${prog("IntersectByLength")}</details>
        <h3>Exercise 3 ★★★ (where does the cycle start?)</h3>
        <p>After <code>slow</code> and <code>fast</code> meet, move one pointer back to the head and step <b>both</b> one node at a time. Show that they meet at the cycle's entrance, and write <code>cycleEntrance(head)</code> and <code>cycleLength(head)</code>.</p>
        <details class="reveal"><summary>Solution</summary><p>They meet after s steps at node s, and s is a multiple of the cycle length x. Put <code>p</code> at the head and step <code>p</code> and <code>m</code> together. After t steps <code>p</code> is at node t, the entrance; <code>m</code> has gone t nodes from node s, i.e. s nodes past the entrance — a whole number of laps — so it is at the entrance too. They cannot meet earlier, because <code>p</code> is still on the tail and <code>m</code> never leaves the cycle.</p>${prog("CycleEntrance")}</details>
        <h3>Exercise 4 ★★ (add sparse matrices)</h3>
        <p>Two matrices of the same size are given as triplet arrays in row-major order. Write <code>add(Triplet[] a, Triplet[] b)</code> that returns their sum in row-major order in O(t₁ + t₂) time. Hint: it is the polynomial merge again, with (row, col) in place of the exponent.</p>
        <details class="reveal"><summary>Solution</summary>${prog("SparseAdd")}</details>
        <h3>Exercise 5 ★★ (sorted list)</h3>
        <p>If the letters are <b>sorted</b> (a → a → b → c → c → c), duplicates sit next to each other. Remove them in one pass with no table at all.</p>
        <details class="reveal"><summary>Solution</summary><p>A node is a repeat exactly when it equals the node kept just before it.</p>${prog("DedupSorted")}</details>
        <h3>Exercise 6 ★★ (remove every copy)</h3>
        <p>Delete <em>every</em> node whose letter appears more than once, so a → b → b → a → c becomes just c. The head may now be deleted. Hint: two passes, an <code>int[26]</code> count, and a dummy node in front of the head.</p>
        <details class="reveal"><summary>Solution</summary>${prog("RemoveAllRepeats")}</details>
        <h3>Exercise 7 ★★★ (faster multiplication)</h3>
        <p><code>LinkedPolynomial.multiply</code> merges m partial products into one growing result, O(m²n). Merge them in pairs instead, like the levels of merge sort. Show that this takes O(mn log m) time.</p>
        <details class="reveal"><summary>Solution</summary><p>At every level of pairing, each of the mn term products is in exactly one list being merged, so a level costs O(mn) (merging lists of sizes s and r costs O(s + r)). Each level halves the number of lists, so there are about log₂ m levels: O(mn log m). Terms that combine only make lists shorter, so this is an upper bound.</p></details>` },
      { id: "terms", title: "Key terms and further reading", html: `
        <p class="tags">${["singly / doubly / circular list", "sentinel (dummy) node", "coefficient", "exponent", "dense", "sparse", "merge", "sparse matrix", "triplet", "row-major order", "orthogonal (cross-linked) list", "header node", "node identity", "cycle", "entrance", "Floyd's algorithm (tortoise and hare)", "direct addressing"].map((t) => `<span class="tag">${t}</span>`).join("")}</p>
        <ul><li>T. H. Cormen et al., <em>Introduction to Algorithms</em> (CLRS), 3rd ed., §10.2 Linked lists (including sentinels).</li>
        <li>M. A. Weiss, <em>Data Structures and Algorithm Analysis in Java</em>, Chapter 3: the polynomial ADT and multilists.</li>
        <li>D. E. Knuth, <em>The Art of Computer Programming</em>, Vol. 1 §2.2.6 (orthogonal lists for sparse matrices) and Vol. 2 §3.1 Exercise 6 (cycle detection).</li></ul>` },
    ],
    takeaways: ["Sparse data → linked structures.", "Merge sorted lists in O(m + n).", "Two pointers, O(1) space."],
  },
];

const QUIZ = [
  { q: "Why does <code>multPolynomial</code> on arrays take about two million steps for P<sub>1</sub> · P<sub>2</sub> from the slides?",
    opts: ["Because Java arrays are slow", "Because it loops over all (1000 + 1)(1990 + 1) exponent pairs, though only 3 × 4 pairs are non-zero", "Because the product has degree 2990", "Because <code>zeroPolynomial</code> is called twice"],
    a: 1, why: "The double loop visits every pair of exponents up to the degrees: 1,992,991 pairs. Only 12 pairs multiply two non-zero coefficients; the linked version forms just those 12 products." },
  { q: "In <code>LinkedPolynomial.add</code>, the fronts are (4, 2) and (−4, 2). What happens?",
    opts: ["A term (0, 2) is appended", "Nothing is appended, and both lists advance", "Only p advances", "The method throws an exception"],
    a: 1, why: "Equal exponents: the coefficients sum to 0, <code>if (c != 0)</code> skips the append, and both <code>p</code> and <code>q</code> move on. The result never stores zero terms." },
  { q: "A 1000 × 1000 matrix has 5000 non-zero entries. How many <code>int</code>s does the triplet array use?",
    opts: ["5,000", "15,000", "1,000,000", "3,000,000"],
    a: 1, why: "Three numbers per non-zero entry: 3 × 5000 = 15,000, against 1,000,000 for the full array." },
  { q: "Why must the intersection methods compare <code>a == b</code> rather than <code>a.label.equals(b.label)</code>?",
    opts: ["<code>equals</code> is slower", "Different nodes can hold the same label; the lists meet only where they share a node object", "Labels can be <code>null</code>", "<code>==</code> compares the labels anyway"],
    a: 1, why: "On references, <code>==</code> tests identity: the same object. Two distinct nodes with equal data are not a meeting point." },
  { q: "The slides' cycle check tests <code>if A == B</code> before moving the pointers. What does it return for the acyclic list 0 → 1 → 2 → null?",
    opts: ["false, correctly", "true, wrongly: A and B both start at the head", "It loops forever", "It throws a NullPointerException"],
    a: 1, why: "Both pointers start at the head, so the first comparison is already true. Move first, then compare." },
  { q: "A list has a tail of t = 5 nodes and a cycle of x = 4. At which step does Floyd's method first find slow == fast?",
    opts: ["4", "5", "8", "9"],
    a: 2, why: "They meet at the smallest multiple of x that is ≥ t: the smallest multiple of 4 that is ≥ 5 is 8." },
  { q: "What goes wrong with <code>Boolean[] seen = new Boolean[26]; … if (seen[k] == false)</code>?",
    opts: ["Nothing; it works like <code>boolean[]</code>", "The array starts full of <code>null</code>, and comparing with <code>false</code> unboxes <code>null</code>: NullPointerException", "It uses too much memory", "<code>Boolean</code> cannot be stored in an array"],
    a: 1, why: "Wrapper arrays start as <code>null</code>. Use <code>boolean[]</code>, which starts all <code>false</code>." },
];
