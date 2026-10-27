// Chapter content, adapted from notes/L14-binary-search-trees.md. Code and outputs are
// copied from the note (CODE and OUT in demos.js are generated from it).

const demo = (name, title, instr, hint = "") =>
  `<div class="card demo" data-demo="${name}"><div class="head"><span class="title">${title}</span><span>${instr}</span></div>
   <div class="demo-body"></div>${hint ? `<p class="hint">${hint}</p>` : ""}</div>`;

const callout = (kind, label, body) => `<div class="callout ${kind}"><b>${label}</b>${body}</div>`;
const predict = (q, a) => callout("predict", "PREDICT", `<p>${q}</p><details class="reveal"><summary>Show the answer</summary>${a}</details>`);
const out = (name) => codeBlock(OUT[name], "out");

const LECTURE = {
  number: 14,
  title: "Binary Search Trees",
  tagline: "Keys kept in order, one path at a time",
  lead: "A binary search tree keeps its keys sorted and finds, inserts or deletes one by walking a single path. Step through search, successor, insertion with a trailing pointer, and all three cases of deletion — on trees you can change.",
  heroDemo: "searchMini",
  heroLabel: "A live search · find(13)",
  heroCaption: "Each comparison throws away a whole subtree: 4 nodes visited out of 11.",
  whyTitle: "Why binary search trees matter",
  whySub: "Three ideas you will use in every lecture on trees that follows",
  why: [
    ["Sorted and changeable", "A sorted array searches fast but inserts slowly; a list inserts fast but searches slowly. A BST does both in <b>O(h)</b>."],
    ["One path per operation", "Search, min, max, successor, insert, delete: each walks <b>one root-to-leaf path</b>, so the height decides the cost."],
    ["The base of real libraries", "<code>TreeSet</code>, <code>TreeMap</code>, database indexes: all are search trees, kept <b>balanced</b> (Lectures 15–16)."],
  ],
  ctaTitle: "Ready to search a tree?",
  minutes: "About 75–90 minutes",
  videos: {
    "media/L14-1.mp4": "Lecture 14 · Part 1 — What a binary search tree is (11.3 min)",
    "media/L14-2.mp4": "Lecture 14 · Part 2 — Search, minimum, maximum, successor (11.8 min)",
    "media/L14-3.mp4": "Lecture 14 · Part 3 — Insertion and deletion (11.8 min)",
    "media/L14-4.mp4": "Lecture 14 · Part 4 — Three classic problems (11.5 min)",
  },
};

const CHAPTERS = [
  {
    slug: "1-bst", nav: "BST", title: "What Is a Binary Search Tree?",
    subtitle: "Smaller keys to the left, larger keys to the right — for every node",
    abstract: "A BST is a binary tree whose in-order walk is sorted. Checking that property means comparing each node with all its ancestors, not only its parent.",
    tags: ["BST property", "in-order is sorted", "O(h)"],
    hero: "insertMini", heroCaption: "Building the running example 15, 6, 18, 3, 7, 17, 20, 2, 4, 13, 9.",
    sections: [
      { id: "video-1", title: "Watch: What a binary search tree is", html: `
        <div class="card video" data-video="media/L14-1.mp4"></div>` },
      { id: "property", title: "The BST property", html: `
        <p>A sorted array finds a key in O(log n) with binary search, but inserting or deleting shifts up to n elements. A linked list inserts in O(1) once it is at the right place, but finding that place is O(n). A <b>binary search tree</b> (BST) keeps its keys in order like the array and links them with pointers like the list.</p>
        <p>A BST is a binary tree in which every node holds a <b>key</b>, and for <b>every</b> node <code>x</code>:</p>
        <ul><li>every key in the <b>left subtree</b> of <code>x</code> is <b>smaller</b> than <code>x.key</code>;</li>
        <li>every key in the <b>right subtree</b> of <code>x</code> is <b>larger</b> than <code>x.key</code>.</li></ul>
        <p>This is the <b>BST property</b>: the nodes are ordered. For now all keys are different (equal keys: Chapter 4). Each node stores its key and three links — left child, right child, parent — and a missing one is <code>null</code> (the slides write NIL). The root is the only node whose parent is <code>null</code>.</p>
        ${codeBlock(CODE.Node)}
        ${callout("note", "NOTE", `<p>The slides call the links <code>leftChild</code> and <code>rightChild</code>; these notes use <code>left</code> and <code>right</code>, as Weiss does. Real trees store a <em>value</em> with each key; we keep only the key, since the value plays no part in the algorithms. The parent link is not needed for searching, but makes successor, predecessor and deletion simpler (as in CLRS).</p>`)}` },
      { id: "tools", title: "Tools for these notes", html: `
        <p>To try the operations we need trees. <code>Trees.build</code> inserts keys one by one with a short recursive insert (Chapter 4 explains insertion properly). <code>Trees.make</code> builds any binary tree by hand, even one that breaks the BST property. <code>Trees.shape</code> prints a tree on one line as <code>key(left,right)</code>, with <code>-</code> for an empty child and just the key for a leaf. So <code>15(6,-)</code> is 15 with left child 6 and no right child.</p>
        <details class="reveal"><summary>Show the class <code>Trees</code></summary>${codeBlock(CODE.Trees)}</details>` },
      { id: "check", title: "Is it a BST?", html: `
        <p>Two binary trees with the same nine keys: tree a is <code>8(3(1,6(4,7)),10(-,14(13,-)))</code> and tree b is <code>8(6(1,4(3,7)),10(-,14(13,-)))</code>.</p>
        ${predict("Which of the two is a BST?", `<p>Tree a is. Tree b is not: 4 is the <em>right</em> child of 6 but smaller than 6, and so is 3 below it. Here a look at each node and its children catches the mistake — but not in general. In tree c, <code>10(5(2,12),15)</code>, every left child is smaller than its parent and every right child larger, yet 12 is in the <em>left</em> subtree of 10 and larger than 10. The BST property is about <em>whole subtrees</em>.</p>`)}
        <p>A correct check passes down the <b>range</b> of keys allowed in each subtree. At the root anything goes; going left from key <code>k</code> makes <code>k</code> the new upper bound, going right makes it the new lower bound.</p>
        ${codeBlock(CODE.BstCheck)}
        ${demo("bstCheck", "Demo 1 · Check a tree with ranges", "pick a tree, then step (← →)", "The range under each node comes from <em>all</em> its ancestors. Try tree c: node 12 is fine next to its parent 5, but its range is (5, 10).")}
        ${codeBlock(CODE.IsItABst)}
        ${out("IsItABst")}
        <p>The in-order lines show an equivalent test. An <b>in-order walk</b> visits the left subtree, the node, then the right subtree (Lecture 13). In a BST everything before a node is smaller and everything after it larger, so:</p>
        <div class="math-block">A binary tree is a BST ⇔ its in-order walk lists the keys in increasing order.</div>
        <p>Trees b and c list a larger key before a smaller one (6 before 3, 12 before 10). This is why BSTs are useful: the tree <em>is</em> a sorted list, stored so that we can jump into it from the top.</p>
        ${callout("pitfall", "PITFALL · CHECKING ONLY PARENT AND CHILDREN", `<p><code>childrenInOrder</code> says <code>true</code> for tree c. A node must be compared with <em>every</em> ancestor: a node in the right subtree of 6 must be larger than 6, however far down it is. Pass a (low, high) range down, or check that the in-order walk increases.</p>`)}` },
      { id: "apps", title: "Applications", html: `
        <ul><li><b>Indexing.</b> A database index or a directory maps keys to records; a search tree finds one without scanning everything. On disk each node holds many keys: the B-trees of multi-level indexing.</li>
        <li><b>A sorted stream.</b> Keys arrive one by one; at any moment ask for the smallest, the largest, or the next key after a given one.</li>
        <li><b>Library collections.</b> Java's <code>TreeSet</code> and <code>TreeMap</code> are balanced BSTs (red-black trees, Lecture 16). A BST can also serve as a priority queue, though Java's <code>PriorityQueue</code> uses a heap (Lecture 17).</li></ul>
        <p>The <code>TreeSet</code> methods are exactly this lecture's operations:</p>
        ${codeBlock(CODE.TreeSetDemo)}
        ${out("TreeSetDemo")}
        <p>Printing the set lists the keys in increasing order, whatever order they were added in: <code>TreeSet</code> walks its tree in-order.</p>` },
      { id: "cost", title: "The BST ADT and its running time", html: `
        <p>A BST supports the <b>dynamic-set operations</b> <code>find</code>, <code>findMin</code>, <code>findMax</code>, <code>successor</code>, <code>predecessor</code>, <code>insert</code> and <code>delete</code>. Each walks along <b>one path</b> — down from the root or up towards it — so each costs <b>O(h)</b>, where <code>h</code> is the <b>height</b>: the number of edges on the longest root-to-leaf path.</p>
        <table><tr><th>case</th><th>height h for n nodes</th><th>cost per operation</th></tr>
        <tr><td>best (perfectly balanced)</td><td>⌊log₂ n⌋, since a tree of height h has at most 2<sup>h+1</sup> − 1 nodes</td><td>Θ(log n)</td></tr>
        <tr><td>worst (a chain)</td><td>n − 1</td><td>Θ(n), like a linked list</td></tr>
        <tr><td>average (random insertion order)</td><td>O(log n) expected (CLRS Thm 12.4)</td><td>Θ(log n)</td></tr></table>
        <p>Chapter 4 shows both extremes with real trees. AVL and red-black trees (Lectures 15–16) keep h = O(log n) always.</p>
        ${callout("note", "NOTE", `<p>Some books count height in <em>nodes</em> (a single node has height 1). The bounds shift by one; the O(h) costs do not change.</p>`)}` },
    ],
    takeaways: ["Left smaller, right larger — for every node.", "BST ⇔ in-order walk is sorted.", "Every operation is O(h)."],
  },
  {
    slug: "2-search", nav: "Search", title: "Search, Minimum and Maximum",
    subtitle: "Each comparison throws away a whole subtree",
    abstract: "Searching compares the key with the node and goes left or right; the minimum is at the end of the left pointers, the maximum at the end of the right pointers.",
    tags: ["find", "findMin", "findMax"],
    hero: "searchMini", heroCaption: "find(13): 15 → 6 → 7 → 13.",
    sections: [
      { id: "video-2", title: "Watch: Search, minimum, maximum, successor", html: `
        <div class="card video" data-video="media/L14-2.mp4"></div>` },
      { id: "idea", title: "The idea", html: `
        <p>Given the root <code>x</code> and a key <code>k</code>, return a node with key <code>k</code>, or <code>null</code>. Compare <code>k</code> with <code>x.key</code>: equal — found; smaller — <code>k</code> can only be in the left subtree; larger — only in the right subtree. If we fall off the tree, <code>k</code> is not there.</p>
        <p>Our running example is the tree built from 15, 6, 18, 3, 7, 17, 20, 2, 4, 13, 9: <code>15(6(3(2,4),7(-,13(9,-))),18(17,20))</code>. Searching for 13: 13 &lt; 15, go left to 6; 13 &gt; 6, right to 7; 13 &gt; 7, right to 13; found. Four nodes out of eleven.</p>` },
      { id: "java", title: "In Java", html: `
        ${codeBlock(CODE.BstSearch)}
        <p>The recursive call is the last thing <code>find</code> does (<em>tail recursion</em>), so it turns directly into the loop of <code>findIterative</code>, which needs no extra stack frames.</p>
        ${demo("search", "Demo 2 · find(x, k), one frame per call", "change k or the keys, then step", "Search for a key that is missing (try 5 or 10): the dashed circle is the empty spot where the search falls off — exactly where <code>insert</code> would put the key.")}
        ${codeBlock(CODE.SearchDemo)}
        ${out("SearchDemo")}
        ${predict("Searching for 5 visits 15, 6, 3, 4. Why 4? Where would 5 be if it were in the tree?", `<p>5 &lt; 15 and 5 &lt; 6: left subtree of 6. 5 &gt; 3: right subtree of 3, which is node 4. 5 &gt; 4: the right child of 4 — which is <code>null</code>. So 5 is not in the tree, and that empty spot is exactly where <code>insert(5)</code> will put it (Chapter 4).</p>`)}
        <p><b>Running time.</b> One level down per step, O(1) work per level: at most h + 1 nodes, <b>O(h)</b>. Best case O(1) (the key is the root); worst case Θ(h), which is Θ(n) for a chain.</p>` },
      { id: "minmax", title: "Minimum and maximum", html: `
        <p>The smallest key is found by following <b>left</b> pointers from the root until there is no left child: the node where we stop has nothing smaller below it, and every ancestor we passed is larger, because we went left from each. The largest key is at the end of the <b>right</b> pointers.</p>
        ${codeBlock(CODE.BstMinMax)}
        ${demo("minMax", "Demo 3 · findMin and findMax", "choose the method and a start node", "Start at 7: it has no left child, so it is the minimum of its own subtree, although it is not a leaf.")}
        ${codeBlock(CODE.MinMaxDemo)}
        ${out("MinMaxDemo")}
        <p>"The minimum of a right subtree" and "the maximum of a left subtree" are exactly what successor and predecessor need. <b>Running time:</b> one step per level, <b>O(h)</b>.</p>
        ${callout("pitfall", "PITFALL", `<p>The minimum is <b>not</b> always a leaf: it is the first node with no left child, and it may have a right child (7 above). And both methods need a non-empty tree: <code>findMin(null)</code> throws a <code>NullPointerException</code>.</p>`)}` },
    ],
    takeaways: ["Smaller: go left. Larger: go right.", "Min: all the way left. Max: all the way right.", "One path: O(h)."],
  },
  {
    slug: "3-successor", nav: "Successor", title: "Successor and Predecessor",
    subtitle: "The next key in sorted order, without comparing keys",
    abstract: "The successor is the minimum of the right subtree — or, if there is none, the first ancestor reached from a left child. The predecessor is the mirror image.",
    tags: ["case 1: subtree", "case 2: climb", "O(h)"],
    hero: "succMini", heroCaption: "successor(13): climb from 13 to 7 to 6, then up-and-right to 15.",
    sections: [
      { id: "def", title: "Definitions", html: `
        <p>The <b>successor</b> of node <code>x</code> is the node with the <b>smallest key larger than <code>x.key</code></b> — the next node in the in-order walk. The <b>predecessor</b> has the <b>largest key smaller than <code>x.key</code></b>. The largest key has no successor; the smallest has no predecessor.</p>
        <p>In the running tree, in-order is 2 3 4 6 7 9 13 15 17 18 20, so successor(15) = 17, successor(13) = 15, successor(9) = 13, predecessor(15) = 13, predecessor(9) = 7, predecessor(7) = 6. Walking the whole tree would be O(n); the tree's shape gives an O(h) method that never compares keys.</p>` },
      { id: "cases", title: "Two cases for the successor", html: `
        <p><b>Case 1: <code>x</code> has a right subtree.</b> Every key there is larger than <code>x.key</code>, and every larger key outside it is larger than all of it. So the successor is the <b>minimum of the right subtree</b>: right once, then left as far as possible. successor(15) = 17; successor(6) = 7.</p>
        <p><b>Case 2: no right subtree.</b> Walk <b>up</b>. While we arrive at a node from its right child, that node is smaller — keep climbing. The first time we arrive from a <b>left</b> child, at node <code>y</code>, everything we climbed through is in <code>y</code>'s left subtree, so <code>y</code> is the successor. <em>Go up until you move up-and-to-the-right.</em></p>
        <ul><li>successor(9): 9 is the left child of 13 → 13.</li>
        <li>successor(13): right child of 7 (climb), 7 is the right child of 6 (climb), 6 is the left child of 15 → 15.</li>
        <li>successor(20): right child of 18, right child of 15 = root. No left-child step ever: 20 is the largest key of the <b>whole tree</b>, no successor.</li></ul>
        ${codeBlock(CODE.BstOrder)}
        ${demo("succ", "Demo 4 · successor and predecessor", "pick a node, then step", "Try successor of 13, 9, 15 and 20, then switch to predecessor. Labels: x and y are the two pointers of case 2; m walks down in case 1.")}` },
      { id: "pred", title: "The predecessor is the mirror image", html: `
        <p>Swap left and right. <b>Case 1:</b> if <code>x</code> has a left subtree, the predecessor is its <b>maximum</b>. <b>Case 2:</b> otherwise climb until you arrive at a node from its <b>right</b> child. Reaching the root first means <code>x</code> is the smallest key of the whole tree.</p>
        <ul><li>predecessor(15): case 1, max of the subtree at 6 = 13. predecessor(13): case 1, max of the subtree at 9 = 9.</li>
        <li>predecessor(9): 9 is the left child of 13 (climb), 13 is the right child of 7 → 7. predecessor(7): right child of 6 → 6.</li>
        <li>predecessor(2): left child of 3, of 6, of 15 = root → none.</li></ul>
        ${codeBlock(CODE.SuccessorDemo)}
        ${out("SuccessorDemo")}
        <p>Each row's <code>succ</code> is the next row's key. <b>Running time:</b> case 1 goes down one path, case 2 up one path: <b>O(h)</b>.</p>
        ${callout("pitfall", "PITFALL", `<p><b>“If we reach the root, x is the largest in the left subtree.”</b> No: if case 2 climbs past the root without ever coming from a left child, every step went up-and-left, so <code>x</code> is the rightmost node of the <b>whole tree</b> — the maximum, with no successor. (Predecessor: the minimum of the whole tree.)</p>`)}
        ${callout("note", "NOTE", `<p>Starting at <code>findMin(root)</code> and calling <code>successor</code> n − 1 times visits every key in order in O(n) total, not O(n·h): each edge is walked at most twice, once down and once up (CLRS Exercise 12.2-8).</p>`)}` },
    ],
    takeaways: ["Case 1: min of the right subtree.", "Case 2: climb until you come from a left child.", "Predecessor: swap left and right."],
  },
  {
    slug: "4-insert", nav: "Insert", title: "Insertion",
    subtitle: "Search for the key, then hang it as a new leaf",
    abstract: "Insertion walks down like a search, with a trailing pointer y one step behind. When the search falls off the tree, the new node becomes y's child. The order of insertion decides the shape.",
    tags: ["trailing pointer", "new leaf", "insertion order"],
    hero: "insertMini", heroCaption: "Each new key walks down from the root and becomes a leaf.",
    sections: [
      { id: "video-3", title: "Watch: Insertion and deletion", html: `
        <div class="card video" data-video="media/L14-3.mp4"></div>` },
      { id: "idea", title: "Search, then hang a new leaf", html: `
        <p>To insert <code>v</code>, search for it. The search falls off the tree at an empty spot — the only place <code>v</code> can go without breaking the BST property. A new node there is a <b>leaf</b>; nothing else moves.</p>
        <p>The search pointer ends up <code>null</code>, which cannot tell us whose child to change. So we walk with <b>two</b> pointers: <code>x</code>, the current node, and <code>y</code>, the <b>trailing pointer</b>, always the parent of <code>x</code>. When <code>x</code> becomes <code>null</code>, <code>y</code> gets the new child: on the left if <code>v &lt; y.key</code>, otherwise on the right. If the tree was empty, <code>y</code> is still <code>null</code> and the new node becomes the root.</p>
        <p><b>Example:</b> insert 13 into <code>12(5(2(1,3),9),18(15(-,17),19))</code>.</p>
        <table><tr><th>step</th><th>x</th><th>y</th><th>comparison</th></tr>
        <tr><td>start</td><td>12</td><td>null</td><td></td></tr>
        <tr><td>1</td><td>18</td><td>12</td><td>13 &gt; 12, go right</td></tr>
        <tr><td>2</td><td>15</td><td>18</td><td>13 &lt; 18, go left</td></tr>
        <tr><td>3</td><td>null</td><td>15</td><td>13 &lt; 15, go left: empty</td></tr></table>
        <p><code>x</code> is <code>null</code>, <code>y</code> is 15, and 13 &lt; 15: the new node becomes 15's left child.</p>` },
      { id: "java", title: "In Java", html: `
        ${codeBlock(CODE.BinarySearchTree)}
        ${demo("insert", "Demo 5 · insert with a trailing pointer", "choose an example or type keys, then step", "Watch y trail one step behind x. The dashed circle is the empty spot that x reaches. Try the sorted example: every key goes right, and the tree becomes a chain.")}
        ${codeBlock(CODE.InsertDemo)}
        ${out("InsertDemo")}
        <p>The second half is the slides' exercise: the BST for 15, 6, 18, 3, 7, 17, 20, 2, 4. The first key is the root forever; each later key walks down and becomes a leaf. Height 3. <b>Running time:</b> one path down, <b>O(h)</b>.</p>
        <p><code>Trees.add</code> from Chapter 1 is the same algorithm written recursively, in Weiss's style: it returns the (possibly new) subtree and the caller stores it back in <code>x.left</code> or <code>x.right</code>.</p>` },
      { id: "equal", title: "Equal keys", html: `
        <p>The code sends an equal key to the <b>right</b> (<code>z.key &lt; x.key</code> is false), so a second copy goes into the right subtree of the first (the CLRS convention): left keys smaller, right keys <b>greater or equal</b>.</p>
        ${callout("note", "NOTE", `<p>The slides' description says “if x.key &lt; v go right, else go left”, which sends equal keys <b>left</b>, while their pseudocode (like ours) sends them right. Either works if used consistently. Libraries do neither: <code>TreeSet</code> ignores a key that is already there, <code>TreeMap</code> replaces its value. To do that, stop the walk when <code>z.key == x.key</code>.</p>`)}` },
      { id: "order", title: "The order of insertion decides the shape", html: `
        <p>Inserting 1, 2, …, n in increasing order makes each key the right child of the previous one: a chain of height n − 1. A random order gives a bushy tree:</p>
        ${codeBlock(CODE.HeightDemo)}
        ${out("HeightDemo")}
        <p>Sorted input: height 999, and a search may walk through all 1000 nodes. Shuffled: height 18 — twice the best possible, 9, and fifty times less than the chain. Sorted or nearly sorted input is common in practice, which is why balanced trees exist.</p>
        ${predict("Insert 1, 2, 3, 4, 5 and then 3, 1, 4, 2, 5. What are the two heights?", `<p>The sorted order gives the chain <code>1(-,2(-,3(-,4(-,5))))</code>, height 4. The order 3, 1, 4, 2, 5 gives <code>3(1(-,2),4(-,5))</code>, height 2 — the same keys, half the height.</p>`)}` },
    ],
    takeaways: ["Walk down with x and a trailing y.", "The new key is always a leaf.", "Sorted input → a chain of height n − 1."],
  },
  {
    slug: "5-delete", nav: "Delete", title: "Deletion",
    subtitle: "No child: cut. One child: splice. Two children: borrow the successor.",
    abstract: "A leaf is cut off, a node with one child is spliced out, and a node with two children takes its successor's key, after which the successor — which has no left child — is removed instead.",
    tags: ["case 1", "case 2", "case 3", "balanced trees"],
    hero: "delMini", heroCaption: "delete 5: copy its successor 6 into it, then splice out the old 6.",
    sections: [
      { id: "cases", title: "Three cases", html: `
        <p>The running example is <code>15(5(3,12(10(6(-,7),-),13)),16(-,20(18,23)))</code>: root 15 with children 5 and 16; 5 has 3 and 12; 12 has 10 and 13; 10 has the left child 6, which has the right child 7; 16 has only the right child 20, whose children are 18 and 23.</p>
        <p><b>Case 1: <code>z</code> is a leaf.</b> Cut it off: the parent's link becomes <code>null</code>. <em>Delete 13:</em> 12's right child becomes <code>null</code>.</p>
        <p><b>Case 2: <code>z</code> has one child.</b> Splice <code>z</code> out: link its parent directly to its only child. The child's subtree moves up a level and stays on the same side of every ancestor, so the BST property holds. <em>Delete 16:</em> 15's right child becomes 20.</p>
        <p><b>Case 3: <code>z</code> has two children.</b> Its parent has one link but <code>z</code> has two subtrees, so we cannot splice. Instead take the <b>successor</b> <code>y</code> = findMin(<code>z.right</code>): its key is larger than all of <code>z</code>'s left subtree and smaller than the rest of the right subtree, so it fits exactly in <code>z</code>'s place.</p>
        <ol><li>find <code>y</code> = findMin(<code>z.right</code>);</li><li>copy <code>y.key</code> into <code>z</code>;</li>
        <li>delete the node <code>y</code>. It has <b>no left child</b> (that child would be smaller, so <code>y</code> would not be the minimum), so this is case 1 or 2.</li></ol>
        <p><em>Delete 5:</em> the successor is 12 → 10 → 6. Copy 6 into 5's node, then splice out the old 6 (case 2): 10's left child becomes 7. Result <code>15(6(3,12(10(7,-),13)),16(-,20(18,23)))</code>.</p>
        ${callout("note", "NOTE", `<p>The predecessor (maximum of the left subtree, which has <b>no right child</b>) works just as well. Section “The trouble with always using the successor” says why it matters.</p>`)}` },
      { id: "java", title: "In Java", html: `
        <p>After case 3 copies the key, what remains is always “remove a node with at most one child”, so cases 1 and 2 share their code: in case 1 the “only child” is <code>null</code>.</p>
        ${codeBlock(CODE.BinarySearchTree2)}
        ${demo("del", "Demo 6 · delete(z) in all three cases", "pick a key, then step", "Red marks the node object that leaves the tree. In case 3 that is the successor's old node, not the node that held the deleted key.")}
        <p>The slides write case 3 with two branches — <code>z.right = y.right</code> when <code>y</code> is <code>z</code>'s right child, otherwise <code>y.parent.left = y.right</code>. Both are what the shared splice does: <code>y</code> has no left child, so its only child is <code>y.right</code>, and <code>y</code> hangs on whichever side of its parent it is on.</p>
        ${codeBlock(CODE.DeleteDemo)}
        ${out("DeleteDemo")}
        ${predict("In <code>delete 5</code>, which <em>node object</em> disappears from the tree: the one that held 5, or the one that held 6?", `<p>The one that held 6. The node that held 5 stays and now holds 6. Fine for a set of integers, but if other parts of a program keep references to nodes, “the node of 6” now points at a detached node. CLRS (3rd ed.) therefore moves the successor <em>node</em> into <code>z</code>'s place (with a helper <code>TRANSPLANT</code>) instead of copying keys. The resulting shape is the same.</p>`)}
        <p><b>Running time.</b> Cases 1 and 2 are O(1) given the node; case 3 adds a walk to the successor, O(h); finding <code>z</code> from a key is O(h). So <b>deletion is O(h)</b>.</p>
        ${callout("pitfall", "PITFALL · FORGETTING THE ROOT", `<p>When <code>z</code> is the root there is no <code>z.parent</code> to update: the tree's <code>root</code> field changes, and the child that moves up must get <code>parent = null</code>. Code that sets <code>root = child</code> and then <em>also</em> tests <code>z == z.parent.left</code> throws a <code>NullPointerException</code>; the parent update belongs in an <code>else</code>.</p>`)}` },
      { id: "why", title: "Why the successor has no left child", html: `
        <p>In case 3, <code>z</code> has a right subtree, so its successor is that subtree's minimum, found by going left until there is no left child. So <code>y</code> has no left child <b>by construction</b>. It may have a right child, so removing it is case 1 or 2 — never case 3 again.</p>` },
      { id: "balance", title: "The trouble with always using the successor", html: `
        <p>Every case-3 deletion takes a node out of a <b>right</b> subtree. After many deletions and insertions the right subtrees thin out and the tree leans left, taller than it needs to be. Choosing at random between successor and predecessor each time helps in experiments, but has no proven bound.</p>
        <p>The rigorous fix is a <b>balanced BST</b> that repairs its shape after each update so that h = O(log n) always: <b>AVL trees</b> (Lecture 15: subtree heights differ by at most 1 at every node) and <b>red-black trees</b> (Lecture 16). Both search exactly as in this lecture and add <b>rotations</b> to insert and delete.</p>` },
    ],
    takeaways: ["Leaf: cut. One child: splice.", "Two children: copy the successor, delete it.", "Always-successor tilts the tree; balance fixes it."],
  },
  {
    slug: "6-problems", nav: "Problems", title: "Three Classic Problems",
    subtitle: "Commuting operations, BST sort, lowest common ancestor",
    abstract: "Insertions and deletions in different orders leave the same keys but different shapes. Inserting n keys and walking in-order sorts them in Θ(n log n) to Θ(n²). In a BST, the LCA of two keys is where their searches part.",
    tags: ["commutative?", "tree sort", "LCA"],
    hero: "lcaMini", heroCaption: "LCA(5, 14): both smaller than 15, then they part at 10.",
    sections: [
      { id: "video-4", title: "Watch: Three classic problems", html: `
        <div class="card video" data-video="media/L14-4.mp4"></div>` },
      { id: "commute", title: "Do insert and delete commute?", html: `
        <p>Two operations <b>commute</b> if doing them in either order gives the same result. Take <code>4(2,6(5,8(7,-)))</code> and delete 5 and 6:</p>
        <ul><li><b>5, then 6.</b> 5 is a leaf: cut it. 6 now has one child, 8: splice it. Result <code>4(2,8(7,-))</code>.</li>
        <li><b>6, then 5.</b> 6 has two children; its successor is 7. Copy 7 into 6's node, cut the leaf 7. Then cut the leaf 5. Result <code>4(2,7(-,8))</code>.</li></ul>
        ${demo("commute", "Demo 7 · Both orders side by side", "step; switch to insert to compare", "The shapes differ, but the in-order walks always agree: the same set of keys.")}
        ${codeBlock(CODE.CommuteDemo)}
        ${out("CommuteDemo")}
        <p>So <b>neither operation commutes</b> as far as the shape goes, though both orders leave the same <em>set</em> of keys. Heights, and so later costs, can differ. Insertions of keys that land in different places (1 and 5 into <code>4(2,6)</code>) do commute; order matters when one new key lands below the other.</p>` },
      { id: "sort", title: "Sorting with a BST", html: `
        <p>Insert the elements one by one into an empty BST, then walk the tree in-order.</p>
        ${codeBlock(CODE.TreeSort)}
        ${out("TreeSort")}
        ${demo("treeSort", "Demo 8 · Tree sort", "choose an input, then step", "Comparisons = the sum of the depths at which the keys land. Sorted input reaches n(n−1)/2.")}
        <p><b>Costs.</b> The in-order walk is Θ(n); the insertions cost the sum of the depths. <b>Worst case Θ(n²)</b>: sorted input, 0 + 1 + … + (n − 1) = n(n − 1)/2 comparisons (1,999,000 for n = 2000). <b>Best case Θ(n log n)</b>: a balanced tree; also the average over random orders.</p>
        <p><b>Compared with other sorts.</b> BST sort makes exactly the comparisons of quicksort with the first element as pivot (the root is the pivot; each subtree is one side of the partition): Θ(n log n) on average, Θ(n²) worst. In practice it is slower than quicksort or merge sort — a node object per key, about four times the memory, pointer chasing instead of array scans. A BST's real strength is keeping data sorted <b>while it changes</b>.</p>` },
      { id: "lca", title: "Lowest common ancestor", html: `
        <p>The <b>lowest common ancestor</b> (LCA) of nodes <code>n1</code> and <code>n2</code> is the deepest node that has both as descendants (a node counts as its own descendant). In a BST the keys show the way. Start at the root: if both keys are smaller, go left; if both are larger, go right; otherwise the keys are on different sides (or one <em>is</em> the current node), and this is the LCA.</p>
        ${codeBlock(CODE.LcaDemo)}
        ${out("LcaDemo")}
        ${demo("lca", "Demo 9 · LCA by one walk down", "pick two keys, then step", "Try a pair where one key is an ancestor of the other, such as 10 and 5.")}
        <p>LCA(10, 5) = 10, because 5 is below 10 and a node is its own descendant. One path down: <b>O(h)</b>.</p>
        ${callout("pitfall", "PITFALL", `<p>The method assumes both keys are in the tree. If one is missing it still returns a node — where the two searches would part. To be safe, <code>find</code> both keys first.</p>`)}` },
    ],
    takeaways: ["Same set, different shapes: no commuting.", "Tree sort: Θ(n log n) to Θ(n²).", "LCA: where the two searches part."],
  },
  {
    slug: "7-summary", nav: "Summary", title: "Summary and Practice",
    subtitle: "Check yourself, then work through the exercises",
    abstract: "A one-page map of the lecture, a self-check quiz, seven exercises with solutions, and the key terms.",
    tags: ["knowledge map", "self-check", "exercises"],
    hero: "toc",
    sections: [
      { id: "map", title: "Knowledge map", html: `<div class="map">
        <div class="card"><h3>The BST property</h3><ul><li>Left subtree smaller, right subtree larger</li><li>For <b>every</b> node, against all ancestors</li><li>⇔ in-order walk is sorted</li></ul></div>
        <div class="card"><h3>Search, min, max</h3><ul><li><code>find</code>: left if smaller, right if larger</li><li><code>findMin</code>: all the way left</li><li><code>findMax</code>: all the way right</li></ul></div>
        <div class="card"><h3>Successor / predecessor</h3><ul><li>Case 1: min of right / max of left subtree</li><li>Case 2: climb until coming from a left / right child</li><li>Climbed past the root: none</li></ul></div>
        <div class="card"><h3>Insert</h3><ul><li>Search with a trailing pointer <code>y</code></li><li>New key becomes a leaf under <code>y</code></li><li>Equal keys: pick a side and stick to it</li></ul></div>
        <div class="card"><h3>Delete</h3><ul><li>Leaf: cut · one child: splice</li><li>Two children: copy successor's key, delete it</li><li>The successor has no left child</li></ul></div>
        <div class="card"><h3>Cost</h3><ul><li>Every operation O(h)</li><li>⌊log₂ n⌋ ≤ h ≤ n − 1</li><li>Balanced trees (AVL, red-black) keep h = O(log n)</li></ul></div></div>
        <table><tr><th>operation</th><th>idea</th><th>time</th></tr>
        <tr><td><code>find(k)</code></td><td>go left if smaller, right if larger</td><td>O(h)</td></tr>
        <tr><td><code>findMin</code> / <code>findMax</code></td><td>follow left / right pointers to the end</td><td>O(h)</td></tr>
        <tr><td><code>successor(x)</code></td><td>min of right subtree; else climb until you come from a left child</td><td>O(h)</td></tr>
        <tr><td><code>predecessor(x)</code></td><td>max of left subtree; else climb until you come from a right child</td><td>O(h)</td></tr>
        <tr><td><code>insert(v)</code></td><td>search with a trailing pointer, hang a new leaf</td><td>O(h)</td></tr>
        <tr><td><code>delete(z)</code></td><td>leaf: cut; one child: splice; two: copy successor, delete it</td><td>O(h)</td></tr></table>` },
      { id: "check", title: "Check your understanding", html: `<div data-demo="quiz"><div class="demo-body"></div></div>` },
      { id: "exercises", title: "Exercises", html: `
        <p>★ trace by hand · ★★ write code · ★★★ prove or design.</p>
        <h3>Exercise 1 ★ (search paths)</h3>
        <p>The keys 1 to 1000 are stored in some BST, and we search for 363. Which sequence could <em>not</em> be the keys visited? (CLRS 12.2-1)<br>a. 2, 252, 401, 398, 330, 344, 397, 363<br>b. 924, 220, 911, 244, 898, 258, 362, 363<br>c. 925, 202, 911, 240, 912, 245, 363</p>
        <details class="reveal"><summary>Solution</summary><p>Each visited key narrows the range where 363 can be: going right from <code>k</code> means all later keys are &gt; k, going left means &lt; k. (a) is possible: the range shrinks (2, ∞), (252, ∞), (252, 401), (252, 398), (330, 398), (344, 398), (344, 397), and 363 lies in it. (b) is possible too. (c) is not: after 911 we go left, so all later keys must be &lt; 911, but 912 appears.</p></details>
        <h3>Exercise 2 ★ (build and delete)</h3>
        <p>Insert 50, 30, 70, 20, 40, 60, 80, 35, 45, 65 into an empty BST. Then delete 30, then 50. Give the tree after each step, and its height.</p>
        <details class="reveal"><summary>Solution</summary>${codeBlock(CODE.BuildAndDelete)}${out("BuildAndDelete")}<p>30 has two children; its successor 35 (the minimum of the subtree at 40) is a leaf. Then 50 has two children; its successor 60 has the right child 65, which moves up to become 70's left child.</p></details>
        <h3>Exercise 3 ★★ (recursive minimum)</h3>
        <p>Write <code>findMin</code> recursively. What is the base case?</p>
        <details class="reveal"><summary>Solution</summary><p>The base case is a node with no left child: it is the minimum.</p>${codeBlock(CODE.RecursiveMin)}</details>
        <h3>Exercise 4 ★★ (range query)</h3>
        <p>Write <code>printRange(x, lo, hi)</code> that prints, in increasing order, every key <code>k</code> with <code>lo ≤ k ≤ hi</code>, without visiting subtrees that cannot contain such keys.</p>
        <details class="reveal"><summary>Solution</summary><p>An in-order walk that skips the left subtree when <code>x.key ≤ lo</code> and the right subtree when <code>x.key ≥ hi</code>. It costs O(h + m), where m is the number of keys printed.</p>${codeBlock(CODE.RangeQuery)}${out("RangeQuery")}</details>
        <h3>Exercise 5 ★★ (floor)</h3>
        <p>Write <code>floor(root, k)</code>: the largest key ≤ <code>k</code>, or <code>null</code> if there is none (like <code>TreeSet.floor</code>). Use one walk down.</p>
        <details class="reveal"><summary>Solution</summary><p>When <code>x.key ≤ k</code>, <code>x.key</code> is a candidate and a better one can only be on the right; when <code>x.key &gt; k</code>, the answer is on the left.</p>${codeBlock(CODE.FloorDemo)}${out("FloorDemo")}</details>
        <h3>Exercise 6 ★★ (delete with the predecessor)</h3>
        <p>Change <code>delete</code> so that case 3 uses the predecessor (the maximum of the left subtree). Delete 5 from <code>15(5(3,12(10(6(-,7),-),13)),16(-,20(18,23)))</code>.</p>
        <details class="reveal"><summary>Solution</summary><p>Only case 3 changes: <code>Node y = BstMinMax.findMax(z.left);</code>. The predecessor has no right child, so the shared splice still applies. The predecessor of 5 is the leaf 3, so the result is <code>15(3(-,12(10(6(-,7),-),13)),16(-,20(18,23)))</code>.</p></details>
        <h3>Exercise 7 ★★★ (height of a random BST)</h3>
        <p>Run <code>HeightDemo</code> with several seeds and larger n. How does the height of a randomly built tree grow with n? Compare with log₂ n.</p>
        <details class="reveal"><summary>Solution</summary><p>It grows like a constant times log n (about 2 to 3 times log₂ n for the n you can try): doubling n adds a roughly constant amount. The sorted order always gives n − 1. (CLRS proves O(log n) expected height; the exact constant is about 4.31 ln n ≈ 2.99 log₂ n for large n.)</p></details>` },
      { id: "terms", title: "Key terms and further reading", html: `
        <p class="tags">${["binary search tree", "BST property", "key", "parent / left / right child", "in-order walk", "height", "dynamic set", "find", "minimum", "maximum", "successor", "predecessor", "trailing pointer", "leaf insertion", "splice out", "case 1 / 2 / 3 deletion", "balanced BST", "AVL tree", "red-black tree", "commutative", "tree sort", "lowest common ancestor"].map((t) => `<span class="tag">${t}</span>`).join("")}</p>
        <ul><li>T. H. Cormen, C. E. Leiserson, R. L. Rivest, C. Stein, <em>Introduction to Algorithms</em>, 3rd ed., MIT Press 2009, Chapter 12. Sections 12.1–12.3 match this lecture; 12.4 proves the O(log n) expected height.</li>
        <li>M. A. Weiss, <em>Data Structures and Algorithm Analysis in Java</em>, 2nd ed., §4.3 (recursive insert and remove) and §4.4 (AVL trees, next lecture).</li>
        <li>Java API: <code>java.util.TreeSet</code> and <code>java.util.TreeMap</code> (<code>floor</code>, <code>ceiling</code>, <code>higher</code>, <code>lower</code>, <code>first</code>, <code>last</code>).</li></ul>` },
    ],
    takeaways: ["Every operation walks one path.", "h decides everything.", "Next: keep h = O(log n) with AVL trees."],
  },
];

const QUIZ = [
  { q: "Is <code>20(10(5,15(12,25)),30)</code> a BST?",
    opts: ["Yes: every node's children are on the correct side", "No: 25 is in the left subtree of 20 but larger than 20", "No: 12 is smaller than 15", "No: 5 should be the root"],
    a: 1, why: "25 is the right child of 15, which is fine locally, but it lies in the <em>left</em> subtree of 20. Every node must be compared with all its ancestors." },
  { q: "In <code>15(6(3(2,4),7(-,13(9,-))),18(17,20))</code>, which nodes does <code>find(10)</code> visit?",
    opts: ["15, 6, 7, 13", "15, 6, 7, 13, 9", "15, 18, 17", "all 11 nodes"],
    a: 1, why: "10 &lt; 15 → 6; 10 &gt; 6 → 7; 10 &gt; 7 → 13; 10 &lt; 13 → 9; 10 &gt; 9 → 9's right child, null. Not found after visiting 15, 6, 7, 13, 9." },
  { q: "In the same tree, what is successor(4), and which case finds it?",
    opts: ["3, case 1", "6, case 1", "6, case 2", "7, case 2"],
    a: 2, why: "4 has no right child: case 2. 4 is the right child of 3 (climb); 3 is the left child of 6, so the successor is 6." },
  { q: "Delete 6 from <code>15(6(3(2,4),7(-,13(9,-))),18(17,20))</code> with the successor method. What is the new tree?",
    opts: ["<code>15(7(3(2,4),13(9,-)),18(17,20))</code>", "<code>15(4(3(2,-),7(-,13(9,-))),18(17,20))</code>", "<code>15(9(3(2,4),7(-,13)),18(17,20))</code>", "<code>15(3(2,4),18(17,20))</code>"],
    a: 0, why: "6 has two children. Its successor is 7, the minimum of the right subtree, which has no left child. Copy 7 into 6's node and splice out the old 7: its right child 13 moves up." },
  { q: "Keys 1, 2, …, n are inserted in increasing order into an empty BST. What is the height, and the cost of one later search?",
    opts: ["⌊log₂ n⌋, O(log n)", "n − 1, Θ(n) in the worst case", "n / 2, Θ(n)", "1, O(1)"],
    a: 1, why: "Each key becomes the right child of the previous one: a chain of height n − 1. Searching for n walks all n nodes." },
  { q: "Why is the successor of a node with two children never itself a node with two children?",
    opts: ["Because it is always a leaf", "Because it is the minimum of a subtree, so it has no left child", "Because it is the parent of z", "It can have two children; then case 3 repeats"],
    a: 1, why: "It is found by going left until there is no left child. It may have a right child (so it is not always a leaf), which makes its removal case 1 or case 2." },
];
