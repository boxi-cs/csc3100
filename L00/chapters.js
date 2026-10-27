// Chapter content, adapted from notes/L00-course-introduction.md. Code is copied from the note.

const demo = (name, title, instr, hint = "") =>
  `<div class="card demo" data-demo="${name}"><div class="head"><span class="title">${title}</span><span>${instr}</span></div>
   <div class="demo-body"></div>${hint ? `<p class="hint">${hint}</p>` : ""}</div>`;

const callout = (kind, label, body) => `<div class="callout ${kind}"><b>${label}</b>${body}</div>`;
const predict = (q, a) => callout("predict", "PREDICT", `<p>${q}</p><details class="reveal"><summary>Show the answer</summary>${a}</details>`);
const lec = (n, t) => `<a href="../L${String(n).padStart(2, "0")}/index.html">L${String(n).padStart(2, "0")}</a>${t ? " " + t : ""}`;

const LECTURE = {
  number: 0,
  title: "Course Introduction",
  tagline: "What this course is about, and how to get good at it",
  lead: "Why data structures matter, what CSC3100 covers, which books to read, and where to practise — with a first taste of how much the right structure can save.",
  heroDemo: "searchMini",
  heroLabel: "Binary search over 1.4 billion sorted IDs",
  heroCaption: "Each comparison throws away half of what is left: 31 comparisons instead of 1.4 billion.",
  whyTitle: "Why data structures are worth learning",
  whySub: "Three ideas that run through the whole course",
  why: [
    ["Store, then manipulate", "A <b>data structure</b> decides how data is stored; an <b>algorithm</b> works on it. You choose them together."],
    ["No structure fits all", "An array is fast to search and slow to update; a linked list is the opposite. Every structure is a <b>trade-off</b>."],
    ["Efficiency you can measure", "<b>Time complexity</b> tells you, before you run anything, how the cost grows with the input."],
  ],
  ctaTitle: "Ready to start?",
  minutes: "About 25 minutes",
  videos: {},
};

const CHAPTERS = [
  {
    slug: "1-why", nav: "Why", title: "Why Take This Course",
    subtitle: "Storing data well, and working on it fast",
    abstract: "Data structures decide how data is stored; algorithms decide how it is used. The same question can take 31 steps or 1.4 billion, depending on the choice.",
    tags: ["data structures", "algorithms", "trade-offs"],
    hero: "searchMini", heroCaption: "Binary search keeps halving the range of candidates.",
    sections: [
      { id: "what", title: "Data structures and algorithms", html: `
        <p>CSC3100 is a required course and one of the foundations of computer science. It teaches two things that always go together:</p>
        <ul><li><b>Data structures</b>: how to <em>store</em> data so that the operations you need are cheap.</li>
        <li><b>Algorithms</b>: how to <em>manipulate</em> the stored data correctly and efficiently.</li></ul>
        ${callout("pattern", "THE FIRST LESSON", `<p><b>No single data structure fits all scenarios.</b> Each one makes some operations cheap by making others expensive. Choosing a structure means knowing which operations your problem needs most.</p>`)}
        <table><tr><th></th><th>find a value</th><th>insert or delete in the middle</th></tr>
        <tr><td>sorted <b>array</b></td><td>fast (binary search)</td><td>slow: later elements must shift</td></tr>
        <tr><td><b>linked list</b></td><td>slow: walk node by node</td><td>fast: change a few links</td></tr></table>
        <p>An array keeps its elements side by side in memory, so element <i>i</i> can be reached at once, and a sorted array can be searched by halving. But to insert at the front, every element must move one place to the right. A linked list keeps each element in its own node with a link to the next one, so inserting at the front changes only two links — but to find a value you must follow the links one by one.</p>
        ${demo("insertFront", "Demo 1 · Insert at the front: array vs linked list", "step through it (← →), or change the values", "The array's work grows with the number of elements; the list's stays the same. Lectures 3 and 7 look at both in detail.")}` },
      { id: "fast", title: "How much faster is “fast”?", html: `
        <p>Suppose the 1.4 billion Chinese ID numbers are kept sorted, and you want to check whether one number is valid. Scanning from the start may need 1.4 billion comparisons. <b>Binary search</b> compares with the middle element and throws away the half that cannot contain the target:</p>
        ${codeBlock(CODE.binaryComparisons)}
        <p>The full program in the notes runs it for three sizes, always looking for the last ID (the worst case for a scan):</p>
        ${codeBlock("n = 1000: linear 1000, binary 10\nn = 1000000: linear 1000000, binary 20\nn = 1400000000: linear 1400000000, binary 31", "out")}
        ${demo("search", "Demo 2 · Binary search vs a linear scan", "pick a size and a target, then step", "The teal band is the range that may still hold the target; the amber line is the middle element being compared; the green line is the target.")}
        <p>Thirty-one comparisons instead of 1.4 billion. That gap, which keeps growing with the input, is what this course is about. (The code writes <code>low + (high - low) / 2</code> instead of <code>(low + high) / 2</code> because <code>low + high</code> can be larger than the biggest <code>int</code>.)</p>
        ${predict("How many comparisons would binary search need for 2.8 billion IDs?", `<p>About 32. Doubling the input adds only one halving step.</p>`)}` },
    ],
    takeaways: ["Data structure = how to store; algorithm = how to use.", "No single structure fits all scenarios.", "Halving: 31 steps for 1.4 billion items."],
  },
  {
    slug: "2-examples", nav: "Examples", title: "Real Examples",
    subtitle: "Route planning and web search",
    abstract: "Two problems you meet every day, and the data structures behind them.",
    tags: ["graphs", "shortest paths", "indexes"],
    sections: [
      { id: "routes", title: "Route planning", html: `
        <p>A navigation app finds the shortest path between two places.</p>
        <ul><li><b>Input:</b> a road network, a source location and a destination.</li>
        <li><b>Output:</b> a path — a sequence of roads — with the shortest total distance.</li></ul>
        <svg viewBox="0 0 520 190" style="width:100%;max-width:520px;display:block;margin:12px auto" role="img" aria-label="A small road network with the shortest path from S to T highlighted">
          <g font-family="var(--mono)" font-size="13" text-anchor="middle">
            <g stroke="var(--line)" stroke-width="3">
              <line x1="50" y1="95" x2="190" y2="35"/><line x1="50" y1="95" x2="190" y2="155"/>
              <line x1="190" y1="35" x2="330" y2="35"/><line x1="190" y1="155" x2="330" y2="155"/>
              <line x1="190" y1="35" x2="190" y2="155"/><line x1="330" y1="35" x2="470" y2="95"/><line x1="330" y1="155" x2="470" y2="95"/>
            </g>
            <g stroke="var(--amber)" stroke-width="5" stroke-linecap="round">
              <line x1="50" y1="95" x2="190" y2="155"/><line x1="190" y1="155" x2="330" y2="155"/><line x1="330" y1="155" x2="470" y2="95"/>
            </g>
            <g fill="var(--ink-2)"><text x="112" y="55">4</text><text x="112" y="145">2</text><text x="260" y="27">3</text><text x="260" y="175">3</text><text x="178" y="100">1</text><text x="410" y="55">2</text><text x="410" y="145">1</text></g>
            <g fill="var(--card)" stroke="var(--teal)" stroke-width="2">
              <circle cx="50" cy="95" r="16"/><circle cx="190" cy="35" r="16"/><circle cx="190" cy="155" r="16"/><circle cx="330" cy="35" r="16"/><circle cx="330" cy="155" r="16"/><circle cx="470" cy="95" r="16"/>
            </g>
            <g fill="var(--ink)" font-weight="700"><text x="50" y="100">S</text><text x="190" y="40">A</text><text x="190" y="160">B</text><text x="330" y="40">C</text><text x="330" y="160">D</text><text x="470" y="100">T</text></g>
          </g>
        </svg>
        <p>The road network is a <b>graph</b>: places are nodes, roads are edges weighted by their length. The amber path S → B → D → T has length 2 + 3 + 1 = 6, the shortest of all. Lectures 19–23 show how to store a graph and how Dijkstra's, Floyd's and the Bellman-Ford algorithms find such paths in networks with millions of roads.</p>
        ${predict("In the drawing, what is the length of the path S → A → C → T? Is there a path shorter than 6?", `<p>4 + 3 + 2 = 9. No: the other routes are S → A → B → D → T (4 + 1 + 3 + 1 = 9) and S → B → A → C → T (2 + 1 + 3 + 2 = 8), so 6 is the shortest.</p>`)}` },
      { id: "search", title: "Web search", html: `
        <p>A search engine must find, among tens of trillions of web pages, the documents that contain your query words — in a fraction of a second. It cannot read the pages when you ask. Instead it builds an <b>index</b> beforehand: a data structure that maps each word to the pages containing it.</p>
        <table><tr><th>word</th><th>pages that contain it</th></tr>
        <tr><td><code>queue</code></td><td>7, 19, 42, 108, …</td></tr>
        <tr><td><code>stack</code></td><td>3, 19, 56, …</td></tr>
        <tr><td><code>tree</code></td><td>19, 77, 108, …</td></tr></table>
        <p>A query for <i>stack queue</i> looks up two entries and intersects two sorted lists (page 19 is in both). The tools for building such an index — sorting, search trees, hashing — are all in this course.</p>` },
    ],
    takeaways: ["Road network → graph → shortest paths.", "Search engine → index → fast lookup.", "Both are data structures at work."],
  },
  {
    slug: "3-topics", nav: "Topics", title: "What the Course Covers",
    subtitle: "Correct and efficient, structure by structure",
    abstract: "One sentence sums up the course; a table shows which structure is good at what; the plan shows the order.",
    tags: ["complexity", "topic map", "plan"],
    sections: [
      { id: "sentence", title: "The course in one sentence", html: `
        ${callout("pattern", "CSC3100 IN ONE SENTENCE", `<p>How to use computing resources and tools to solve practical problems <b>correctly</b> and <b>efficiently</b>.</p>`)}
        <p>Two abilities support it: <b>logical thinking and mathematics</b>, to prove that an algorithm is correct and to analyse its cost; and skill with <b>data structures, algorithms and programming</b>, to build it.</p>` },
      { id: "map", title: "Which structure is good at what", html: `
        <p>“Efficient” is made precise with <b>time complexity analysis</b> (${lec(5)}, ${lec(6)}). Then the course goes through the main structures, each good at different operations:</p>
        <table><tr><th>structure</th><th>good at</th><th>lectures</th></tr>
        <tr><td>arrays</td><td>sorting and searching, not updates</td><td>${lec(3)}, ${lec(4)}, ${lec(11)}, ${lec(12)}</td></tr>
        <tr><td>lists, stacks, queues</td><td>updates, not searching or sorting</td><td>${lec(7)}–${lec(10)}</td></tr>
        <tr><td>trees: BST, AVL, red-black, heaps</td><td>ordered search, priorities</td><td>${lec(13)}–${lec(17)}</td></tr>
        <tr><td>hash tables</td><td>searching by key</td><td>${lec(18)}</td></tr>
        <tr><td>graphs</td><td>relations: traversal, spanning trees, shortest paths</td><td>${lec(19)}–${lec(23)}</td></tr></table>
        <p>Two families of operations run through the whole course: <b>sorting</b> (insertion, merge, quick, heap and linear-time sorts) and <b>searching and updating</b> on each structure.</p>` },
      { id: "plan", title: "Tentative teaching plan", html: `
        <table><tr><th>week</th><th>content</th><th>week</th><th>content</th></tr>
        <tr><td>1</td><td>course overview, Java basics</td><td>8</td><td>midterm exam</td></tr>
        <tr><td>2</td><td>arrays, insertion and merge sort</td><td>9</td><td>trees</td></tr>
        <tr><td>3</td><td>time complexity</td><td>10</td><td>hashing</td></tr>
        <tr><td>4</td><td>lists</td><td>11</td><td>graphs</td></tr>
        <tr><td>5</td><td>stacks, queues</td><td>12</td><td>graphs</td></tr>
        <tr><td>6</td><td>more sorting algorithms</td><td>13</td><td>graphs, other data structures</td></tr>
        <tr><td>7</td><td>trees</td><td>14</td><td>course review</td></tr></table>
        <p class="meta">The plan may change during the term.</p>
        <p>Throughout the course you will learn how to estimate the time a program takes, how to choose the right data structures for a real problem, and techniques that make a program faster.</p>
        <p><b>How it is taught.</b> Lectures (3 hours a week) cover the main material from the textbook through examples; Java is used to illustrate the data structures. Tutorials (1 hour a week) go over the difficult parts, show more examples and discuss the exercises.</p>` },
    ],
    takeaways: ["Correct and efficient.", "Each structure is good at some operations.", "Sorting, searching and updating throughout."],
  },
  {
    slug: "4-reading", nav: "Reading", title: "Textbook and Resources",
    subtitle: "What to read, and where to watch the structures move",
    abstract: "One textbook, two references and three free resources.",
    tags: ["CLRS", "Weiss", "visualizations"],
    sections: [
      { id: "books", title: "Textbook and references", html: `
        <p><b>Textbook</b></p>
        <ul><li>T. H. Cormen, C. E. Leiserson, R. L. Rivest, C. Stein, <em>Introduction to Algorithms</em>, 3rd edition, MIT Press, 2009 — often called <b>CLRS</b>.</li></ul>
        <p><b>References</b></p>
        <ul><li>M. A. Weiss, <em>Data Structures and Algorithm Analysis in Java</em>, 2nd edition, Addison-Wesley, 2007.</li>
        <li>E. Horowitz, S. Sahni, S. Anderson-Freed, <em>Fundamentals of Data Structures in C</em>.</li></ul>` },
      { id: "free", title: "Free resources", html: `
        <ul><li><em>Think Data Structures</em> (Allen B. Downey): data structures through Java, free online.</li>
        <li><em>Open Data Structures</em> (Pat Morin), Java edition: <a href="https://opendatastructures.org" target="_blank" rel="noopener">opendatastructures.org</a></li>
        <li><em>Data Structure Visualizations</em> (David Galles, University of San Francisco): <a href="https://www.cs.usfca.edu/~galles/visualization/Algorithms.html" target="_blank" rel="noopener">animations</a> of most structures in this course.</li></ul>` },
    ],
    takeaways: ["Textbook: CLRS.", "Java reference: Weiss.", "Watch structures move: USF visualizations."],
  },
  {
    slug: "5-practice", nav: "Practice", title: "How to Do Well",
    subtitle: "Trace by hand, write code, practise on the OJ",
    abstract: "Data structures are learned by writing code. The course's online judge has 100 practice problems sorted by topic and difficulty.",
    tags: ["study tips", "online judge", "100 problems"],
    sections: [
      { id: "tips", title: "Study suggestions", html: `
        <ul><li>Come to the lectures, and read each lecture's and tutorial's slides before class.</li>
        <li>Use examples: trace every algorithm by hand on a small input.</li>
        <li>Data structures are not just reading material: <b>write code</b>, a lot of it.</li></ul>
        <p><b>If the course feels hard</b>, focus on the slides and the examples, and ask the teaching team. <b>If it feels easy</b>, read the analysis in the textbook and try contest problems.</p>` },
      { id: "oj", title: "100 data-structure problems on the OJ", html: `
        <p>The course's Online Judge (<a href="http://oj.cuhk.edu.cn/" target="_blank" rel="noopener">oj.cuhk.edu.cn</a>, campus network only) has 100 practice problems, marked * / ** / *** for easy, normal and difficult, in eight categories:</p>
        <table><tr><th>category</th><th>problems</th></tr>
        <tr><td>array / linked list</td><td>12</td></tr><tr><td>stack / queue</td><td>12</td></tr>
        <tr><td>tree (BST, heap)</td><td>16</td></tr><tr><td>graph (BFS, DFS, MST, shortest paths)</td><td>16</td></tr>
        <tr><td>sorting</td><td>10</td></tr><tr><td>hashing</td><td>8</td></tr>
        <tr><td>recursion / divide and conquer</td><td>16</td></tr><tr><td>strings</td><td>10</td></tr></table>
        <p class="meta">Problem set prepared by Tianci Hou, Yohandi, Ziyi Zhao, Letian Cheng, Yuzhou Lin, Yutian Wang, Yiyu Ren and Frederick Khasanto.</p>` },
    ],
    takeaways: ["Trace by hand on small inputs.", "Write code, a lot of it.", "100 OJ problems in 8 categories."],
  },
  {
    slug: "6-contests", nav: "Contests", title: "ACM-ICPC and the Programming Team",
    subtitle: "Where the material of this course becomes a sport",
    abstract: "Programming contests put data structures under a clock. CUHK-Shenzhen has a team and a contest every spring.",
    tags: ["ACM-ICPC", "online judges", "programming team"],
    sections: [
      { id: "icpc", title: "ACM-ICPC and online judges", html: `
        <p><b>ACM-ICPC</b> (Association for Computing Machinery – International Collegiate Programming Contest) is the best-known programming contest for university students: teams solve algorithmic problems against the clock, and an online judge checks every submission automatically.</p>
        <p>Online judges are the best place to get fluent with this course's material:</p>
        <ul><li>CUHK-Shenzhen OJ (campus only): <a href="http://oj.cuhk.edu.cn/" target="_blank" rel="noopener">oj.cuhk.edu.cn</a></li>
        <li>SJTU OJ: <a href="https://acm.sjtu.edu.cn/OnlineJudge/" target="_blank" rel="noopener">acm.sjtu.edu.cn/OnlineJudge</a></li>
        <li>PKU OJ: <a href="http://poj.org/" target="_blank" rel="noopener">poj.org</a></li></ul>` },
      { id: "team", title: "The CUHK-Shenzhen programming team", html: `
        <p>The team is coached by Yixiang Fang and Chenhao Ma, with student coaches Youran Sun and Runyuan He. The university runs a programming contest every spring:</p>
        <table><tr><th>contest</th><th>date</th><th>hours</th><th>problems</th><th>contestants</th><th>awards</th></tr>
        <tr><td>2023 CUHK-SZ Programming Contest</td><td>2 Apr 2023</td><td>4</td><td>12</td><td>235</td><td>—</td></tr>
        <tr><td>2024 CUHK-SZ Programming Contest</td><td>13 Apr 2024</td><td>4</td><td>10</td><td>380</td><td>66</td></tr>
        <tr><td>2025 GBA International Programming Contest</td><td>19 Apr 2025</td><td>4</td><td>12</td><td>610</td><td>about 100</td></tr></table>
        ${callout("note", "CONTEST BONUS", `<p>Students who have won a prize (first, second or third) in the CUHK-SZ contest, the Guangdong provincial contest (广东省省赛), ICPC/CCPC or NOI/NOIP can apply to be exempted from the four programming assignments. In return they serve as tutorial helpers: they present in tutorials and answer questions in office hours. Applications, with award certificates, go to the teaching team early in the term; the deadline is announced in class.</p>`)}` },
    ],
    takeaways: ["ICPC: algorithms against the clock.", "Practise on online judges.", "Prize winners can help teach."],
  },
  {
    slug: "7-summary", nav: "Summary", title: "Summary and Check",
    subtitle: "The course on one page",
    abstract: "A map of the course and five quick questions.",
    tags: ["course map", "self-check"],
    hero: "toc",
    sections: [
      { id: "map", title: "Course map", html: `<div class="map">
        <div class="card"><h3>Foundations</h3><ul><li>${lec(1, "Introduction and ADTs")}</li><li>${lec(2, "Java basics")}</li><li>${lec(3, "Arrays")}</li></ul></div>
        <div class="card"><h3>Sorting and complexity</h3><ul><li>${lec(4, "Insertion and merge sort")}</li><li>${lec(5, "Asymptotic notations")}</li><li>${lec(6, "Divide and conquer")}</li></ul></div>
        <div class="card"><h3>Linear structures</h3><ul><li>${lec(7, "Lists")}, ${lec(8, "applications")}</li><li>${lec(9, "Stacks")}</li><li>${lec(10, "Queues")}</li></ul></div>
        <div class="card"><h3>More sorting</h3><ul><li>${lec(11, "Quicksort")}</li><li>${lec(12, "More sorting algorithms")}</li></ul></div>
        <div class="card"><h3>Trees</h3><ul><li>${lec(13, "Trees, binary trees")}</li><li>${lec(14, "Binary search trees")}</li><li>${lec(15, "AVL trees")}</li><li>L16–L17 red-black trees, heaps</li></ul></div>
        <div class="card"><h3>Hashing and graphs</h3><ul><li>L18 hashing</li><li>L19–L23 graphs, MST, shortest paths</li><li>L24 Java's data structures</li></ul></div></div>` },
      { id: "check", title: "Check your understanding", html: `<div data-demo="quiz"><div class="demo-body"></div></div>` },
      { id: "terms", title: "Key terms", html: `
        <p class="tags">${["data structure", "algorithm", "array", "linked list", "binary search", "time complexity", "graph", "shortest path", "index", "online judge", "ACM-ICPC"].map((t) => `<span class="tag">${t}</span>`).join("")}</p>` },
    ],
    takeaways: ["Store well, then work fast.", "Pick the structure for the operations.", "Practise: trace, code, OJ."],
  },
];

const QUIZ = [
  { q: "You mostly <b>insert at the front</b> of a collection of n items. Which structure does less work per insertion?",
    opts: ["a sorted array", "a linked list", "both the same", "it depends on the values"],
    a: 1, why: "The list changes two links whatever n is; the array shifts all n elements one place to the right." },
  { q: "Why is binary search not efficient on a linked list?",
    opts: ["The list is not sorted", "It cannot jump to the middle element; reaching it already takes about n/2 steps", "Lists cannot hold numbers", "Binary search needs recursion"],
    a: 1, why: "Binary search needs to reach the middle at once. A list can only be walked from the head, node by node." },
  { q: "Binary search needs about 20 comparisons for a million sorted items. About how many for a billion?",
    opts: ["about 20", "about 30", "about 2,000", "about 20,000"],
    a: 1, why: "A billion is about a thousand times a million, and 1000 ≈ 2<sup>10</sup>: ten more halvings, so about 30." },
  { q: "In route planning, the road network is best stored as a …",
    opts: ["stack", "queue", "graph", "sorted array"],
    a: 2, why: "Places are nodes and roads are weighted edges: a graph (Lectures 19–23)." },
  { q: "Which statement is the course's first lesson?",
    opts: ["Arrays are always best", "Linked lists are always best", "No single data structure fits all scenarios", "Use whatever the language gives you"],
    a: 2, why: "Every structure trades some operations for others; you choose by what the problem needs most." },
];
