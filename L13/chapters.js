// Chapter content, adapted from notes/L13-trees.md. Code and outputs come from CODE / OUT in
// demos.js, which are generated from the note.

const demo = (name, title, instr, hint = "") =>
  `<div class="card demo" data-demo="${name}"><div class="head"><span class="title">${title}</span><span>${instr}</span></div>
   <div class="demo-body"></div>${hint ? `<p class="hint">${hint}</p>` : ""}</div>`;

const callout = (kind, label, body) => `<div class="callout ${kind}"><b>${label}</b>${body}</div>`;
const predict = (q, a) => callout("predict", "PREDICT", `<p>${q}</p><details class="reveal"><summary>Show the answer</summary>${a}</details>`);
const prog = (name) => codeBlock(CODE[name]) + (OUT[name] ? codeBlock(OUT[name], "out") : "");
const showClass = (name, label) => `<details class="reveal"><summary>${label}</summary>${codeBlock(CODE[name])}</details>`;

const LECTURE = {
  number: 13,
  title: "Trees and Binary Trees",
  tagline: "The first non-linear data structure",
  lead: "Roots, leaves, depth and height; binary trees stored with pointers or in an array; preorder, inorder and postorder; expression trees and postfix; and rebuilding a tree from two of its traversals — every step can be played back.",
  heroDemo: "traverseMini",
  heroLabel: "Preorder of 8(3(2,5),7(,9))",
  heroCaption: "Amber: the running call. Teal: calls waiting on the stack. Green: visited, numbered in order.",
  whyTitle: "Why trees are worth learning",
  whySub: "Three ideas you will use for the rest of the course",
  why: [
    ["Hierarchies everywhere", "Folders, class hierarchies, HTML pages and parse trees are all <b>trees</b>: one root, and every other node hangs below exactly one parent."],
    ["Recursion's natural home", "Every node is the root of a subtree, so tree algorithms are short <b>recursive</b> methods: deal with the root, recurse on the subtrees."],
    ["The base for fast structures", "Binary search trees, AVL and red-black trees, heaps (Lectures 14–17): all binary trees whose speed depends on the <b>height</b>."],
  ],
  ctaTitle: "Ready to climb the tree?",
  minutes: "About 75–90 minutes",
  videos: {
    "media/L13-1.mp4": "Lecture 13 · Part 1 — Tree vocabulary and binary trees (10.5 min)",
    "media/L13-2.mp4": "Lecture 13 · Part 2 — The binary-tree ADT, linked nodes and arrays (9.6 min)",
    "media/L13-3.mp4": "Lecture 13 · Part 3 — Preorder, inorder and postorder (8.5 min)",
    "media/L13-4.mp4": "Lecture 13 · Part 4 — Expression trees, postfix, and rebuilding a tree (12.1 min)",
  },
};

const CHAPTERS = [
  {
    slug: "1-trees", nav: "Trees", title: "Trees: the Basic Vocabulary",
    subtitle: "Root, parent, child, leaf, path, depth and height",
    abstract: "A tree is empty, or a root with zero or more subtrees. With N nodes it has N − 1 edges, and there is exactly one path from the root to each node.",
    tags: ["root · leaf", "depth vs height", "N − 1 edges"],
    hero: "termsMini", heroCaption: "Depth is counted down from the root, height up from the leaves.",
    sections: [
      { id: "video-1", title: "Watch: Tree vocabulary and binary trees", html: `
        <div class="card video" data-video="media/L13-1.mp4"></div>` },
      { id: "what", title: "What a tree is", html: `
        <p>A family tree, the folders on your disk, the chapters and sections of a book, the classification of living things: all are <b>hierarchies</b>. One thing sits at the top, and everything else hangs below exactly one thing above it. A <b>tree</b> is the data structure for hierarchies. Arrays, lists, stacks and queues put elements in a line; a tree lets an element have several successors.</p>
        <p>The definition is recursive. A <b>tree</b> <span class="math">T</span> is a finite set of <b>nodes</b>, each storing an element, such that either</p>
        <ul><li><span class="math">T</span> is <b>empty</b> (no nodes at all), or</li>
        <li><span class="math">T</span> has one distinguished node <span class="math">r</span>, the <b>root</b>, and the remaining nodes are split into zero or more non-empty <b>subtrees</b> <span class="math">T₁, …, T<sub>k</sub></span>, each itself a tree, whose roots are connected to <span class="math">r</span> by a directed <b>edge</b>.</li></ul>
        <figure class="l13-fig"><div class="svgbox">${treeSVG({ label: "Organism", left: { label: "Plant", left: null, right: null }, right: { label: "Animal", left: { label: "Mammal", left: null, right: null }, right: { label: "Fish", left: null, right: null } } }, { width: 520, rowH: 54, r: 30 })}</div><figcaption>Organism is the root; its subtrees are {Plant} and the tree rooted at Animal.</figcaption></figure>
        ${callout("note", "NOTE · CAN A TREE BE EMPTY?", `<p>The slide says a tree has "one or more" nodes and, two lines later, that "the set can be empty". Both conventions exist. Here <b>a tree may be empty</b>: for binary trees this is essential, because a node's left or right subtree is often empty.</p>`)}
        <p>Two facts follow straight from the definition:</p>
        <ul><li><b>Every node is the root of some subtree</b> — itself and everything below it. That is why almost every tree algorithm is recursive.</li>
        <li><b>A tree with N ≥ 1 nodes has exactly N − 1 edges.</b> Every node except the root has exactly one edge coming into it from above; the root has none.</li></ul>` },
      { id: "family", title: "Parent, child, sibling, leaf", html: `
        <p>If there is an edge from <span class="math">A</span> down to <span class="math">B</span> — <span class="math">B</span> is the root of one of <span class="math">A</span>'s subtrees — then <span class="math">A</span> is the <b>parent</b> of <span class="math">B</span> and <span class="math">B</span> is a <b>child</b> of <span class="math">A</span>. Nodes with the same parent are <b>siblings</b>. A node with no children is a <b>leaf</b>; a node with at least one child is an <b>internal node</b>. Going up repeatedly gives a node's <b>ancestors</b>, going down its <b>descendants</b>.</p>
        <p>In the Organism tree, Animal is the parent of Mammal and Fish, which are siblings, and the leaves are Plant, Mammal and Fish.</p>
        ${callout("note", "NOTE", `<p>The slide defines "parent" through "the left or right sub-tree of A", which only makes sense for binary trees. In a general tree a node may have any number of subtrees: A is the parent of B when B is the root of <em>any</em> of A's subtrees.</p>`)}` },
      { id: "paths", title: "Paths and their length", html: `
        <p>A <b>path</b> from <span class="math">v₁</span> to <span class="math">v<sub>k</sub></span> is a sequence of nodes <span class="math">v₁, v₂, …, v<sub>k</sub></span> in which <span class="math">v<sub>i</sub></span> is the parent of <span class="math">v<sub>i+1</sub></span> for every <span class="math">1 ≤ i ≤ k − 1</span>. Its <b>length</b> is the number of <em>edges</em>, <span class="math">k − 1</span> — not the number of nodes.</p>
        <p>Every node has exactly one parent, so there is only one way up to the root: <b>there is exactly one path from the root to each node.</b> The path from the root to Fish is Organism, Animal, Fish, of length 2.</p>
        ${callout("note", "NOTE · SLIDE CORRECTION", `<p>The slide writes the condition as <span class="math">1 ≤ i &lt; k − 1</span>. It should be <span class="math">1 ≤ i &lt; k</span>; otherwise the last edge, from <span class="math">v<sub>k−1</sub></span> to <span class="math">v<sub>k</sub></span>, is left out.</p>`)}` },
      { id: "depth", title: "Depth and height", html: `
        <p>Depth is measured <em>from the top</em>, height <em>from the bottom</em>:</p>
        <ul><li>The <b>depth</b> of a node is the length of the path from the root to it. The root has depth 0.</li>
        <li>The <b>height</b> of a node is the length of the <em>longest</em> path from it down to a leaf. Every leaf has height 0.</li>
        <li>The <b>height of a tree</b> is the height of its root; the <b>depth of a tree</b> is the largest depth of any node. The two are equal.</li>
        <li>The empty tree has height <span class="math">−1</span> by convention, so that "height = 1 + the larger height of the subtrees" works for leaves too.</li></ul>
        ${demo("terms", "Demo 1 · Depth, height and family", "step, or click a node", "Amber: the selected node and its unique path from the root. Teal: its parent. Green: its children. Dashed: its siblings.")}
        ${predict("In the tree A … I of Demo 1, what are the depth and the height of F? Which nodes have depth 2 and height 0?",
          `<p>F has depth 2 (path A, C, F) and height 2 (path F, G, H). D and E have depth 2 and height 0. Click F and D in Demo 1 to check.</p>`)}` },
      { id: "java", title: "Trees in Java", html: `
        <p>A general tree node keeps its element, its parent and a list of children. Depth walks <em>up</em> to the root; height recurses <em>down</em> into the children:</p>
        ${codeBlock(CODE.depthHeight)}
        ${showClass("TreeNode", "Show the whole TreeNode class")}
        <p>This program builds both trees of the chapter and prints the vocabulary for every node:</p>
        ${prog("TreeTerms")}
        ${callout("pitfall", "PITFALL · EDGES, NOT NODES", `<p>Depth counts edges: the root has depth 0, not 1, and a leaf has height 0. Some books and exam questions count <em>levels</em> from 1 instead (root on level 1). The array slides use levels. Whenever you read a height or depth, check which convention is meant.</p>`)}` },
    ],
    takeaways: ["Empty, or a root with subtrees.", "N nodes, N − 1 edges, one path to each node.", "Depth from the top (root 0); height from the bottom (leaf 0)."],
  },
  {
    slug: "2-binary", nav: "Binary trees", title: "Binary Trees and the ADT",
    subtitle: "At most two children: left and right",
    abstract: "A binary tree is empty or a root with a left and a right binary subtree. Full and complete are different shapes; the ADT is six O(1) operations on linked nodes.",
    tags: ["full · complete", "2^(h+1) − 1", "makeBT", "parent links"],
    hero: "shapesMini", heroCaption: "The four shapes of the slides: full and complete are independent.",
    sections: [
      { id: "video-2", title: "Watch: The binary-tree ADT, linked nodes and arrays", html: `
        <div class="card video" data-video="media/L13-2.mp4"></div>` },
      { id: "binary", title: "Binary trees", html: `
        <p>A <b>binary tree</b> is a tree in which no node has more than two children. The two possible subtrees of a node are its <b>left subtree</b> <span class="math">T<sub>L</sub></span> and <b>right subtree</b> <span class="math">T<sub>R</sub></span>; either or both may be empty.</p>
        <p>Left and right matter: a root with a single child on the left and the same root with that child on the right are <em>different</em> binary trees. So a binary tree is either empty, or a root together with an ordered pair (left binary tree, right binary tree).</p>
        ${figRow([["A(B,)", "A(B,): B is a left child"], ["A(,B)", "A(,B): B is a right child"]])}` },
      { id: "shapes", title: "Full, complete and perfect", html: `
        <ul><li>A <b>full</b> binary tree: every node has <b>zero or two</b> children.</li>
        <li>A <b>complete</b> binary tree: every level is completely filled except possibly the lowest, which is filled <b>from the left</b> with no gaps.</li>
        <li>A <b>perfect</b> binary tree is both, with all leaves at the same depth: <span class="math">2<sup>h+1</sup> − 1</span> nodes for height <span class="math">h</span>.</li></ul>
        ${figRow([["1(2(6,4),3(,5))", "(a) not full, not complete"], ["1(2,3(6,4))", "(b) full, not complete"], ["1(2(6,),3)", "(c) not full, complete"], ["1(2(6,4),3)", "(d) full and complete"]])}
        <p>(a) is not full because 3 has one child, and not complete because 3 has no left child while 5 exists. (b) is full, but its bottom level starts on the right. (c) is complete, but 2 has one child. (d) is both.</p>
        ${demo("shapes", "Demo 2 · Build a shape", "click + to add, a node to remove; then step", "Nodes are labelled by their position number (Chapter 3). A red ring marks a node with exactly one child.")}
        ${callout("note", "NOTE · BOOKS DISAGREE", `<p>The slides' <em>complete</em> is Weiss's complete binary tree and CLRS's <em>nearly complete</em> binary tree (used for heaps, Lecture 17). CLRS uses <em>complete</em> for what we call <em>perfect</em>. <em>Full</em> means the same everywhere.</p>`)}` },
      { id: "count", title: "How many nodes fit?", html: `
        <p>Each node has at most two children, so the number of nodes can at most double from one depth to the next:</p>
        <ul><li>At depth <span class="math">d</span> there are at most <span class="math">2<sup>d</sup></span> nodes.</li>
        <li>A binary tree of height <span class="math">h</span> has at most <span class="math">1 + 2 + … + 2<sup>h</sup> = 2<sup>h+1</sup> − 1</span> nodes, and at least <span class="math">h + 1</span>.</li>
        <li>So a binary tree with <span class="math">n</span> nodes has height between <span class="math">⌊log₂ n⌋</span> (complete) and <span class="math">n − 1</span> (<b>skewed</b>: every node has one child).</li>
        <li>In a full binary tree, leaves = internal nodes + 1. (Edges = 2·internal, and also edges = n − 1 = internal + leaves − 1.)</li></ul>
        <p>Many tree operations take time proportional to the height, which can be anything from about <span class="math">log₂ n</span> to <span class="math">n − 1</span>. Keeping trees short is the subject of Lectures 15 and 16.</p>
        ${predict("A complete binary tree has 20 nodes. What is its height? How many nodes are on its lowest level?",
          `<p><span class="math">⌊log₂ 20⌋ = 4</span>. Depths 0–3 are full and hold 1 + 2 + 4 + 8 = 15 nodes, so the lowest level (depth 4) holds the other 5.</p>`)}` },
      { id: "adt", title: "The binary-tree ADT", html: `
        <p>As with lists and stacks, first <em>what</em> a binary tree can do, then <em>how</em>:</p>
        <table><tr><th>operation</th><th>meaning</th></tr>
        <tr><td><code>create(T)</code></td><td>make <code>T</code> an empty binary tree</td></tr>
        <tr><td><code>isEmpty(T)</code></td><td>true if <code>T</code> is empty</td></tr>
        <tr><td><code>makeBT(T1, element, T2)</code></td><td>a new tree whose root holds <code>element</code>, with left subtree <code>T1</code> and right subtree <code>T2</code></td></tr>
        <tr><td><code>leftChild(T)</code></td><td>error if <code>T</code> is empty, else its left subtree</td></tr>
        <tr><td><code>rightChild(T)</code></td><td>error if <code>T</code> is empty, else its right subtree</td></tr>
        <tr><td><code>data(T)</code></td><td>error if <code>T</code> is empty, else the element in its root</td></tr></table>
        <p><code>makeBT</code> builds trees bottom-up; <code>leftChild</code>, <code>rightChild</code> and <code>data</code> take them apart. Two implementations follow: <b>linked nodes</b>, natural and <span class="math">O(1)</span> for every operation, and an <b>array</b> (Chapter 3), compact for complete trees but awkward in general.</p>` },
      { id: "pointers", title: "Pointer implementation", html: `
        <p>Each node holds <code>element</code>, a <code>parent</code> reference (<code>null</code> for the root) and <code>leftChild</code> / <code>rightChild</code> references (<code>null</code> for an empty subtree). A tree is a reference to its root; the empty tree is <code>null</code>.</p>
        ${codeBlock(CODE.BinaryNode)}
        ${codeBlock(CODE.BinaryTree)}
        ${callout("note", "NOTE · SLIDE CORRECTIONS", `<p>The pseudocode of <code>MakeBT</code> tests <code>bintree1 != NULL</code> and <code>bintree2 != NULL</code>; those should be the parameters <code>T1</code> and <code>T2</code>. The pointer slide also spells one field <code>righChild</code>; it is <code>rightChild</code>.</p>`)}
        <p>Every operation does a constant amount of work: <span class="math">O(1)</span>. Here is the tree <code>A(B(E,),D(,I))</code> of the slides, built bottom-up:</p>
        ${figTree("A(B(E,),D(,I))")}
        ${prog("MakeBTDemo")}
        ${demo("makeBT", "Demo 3 · makeBT links the nodes", "← → keys step", "Solid arrows are child links (teal left, amber right); dashed arrows are parent links. A subtree gets its parent only when something is built on top of it.")}
        ${predict("<code>b</code> was built before <code>t</code>. Right after <code>b</code> is created, what is <code>b.parent</code>? When does it change?",
          `<p><code>makeBT</code> sets <code>rootNode.parent = null</code>, so <code>b.parent</code> is <code>null</code> at first. The last call, <code>makeBT(b, "A", d)</code>, runs <code>t1.parent = rootNode</code>, which points <code>b.parent</code> at the new node A.</p>`)}` },
      { id: "shorthand", title: "A shorthand for writing trees", html: `
        <p>Nested <code>makeBT</code> calls get long. From now on a tree is written as text: a label, optionally followed by <code>(left,right)</code>, with an empty subtree written as nothing. <code>B(E,)</code> is B with left child E and no right child, so the tree above is <code>A(B(E,),D(,I))</code>. The class <code>TreeText</code> turns such text into a tree (with <code>makeBT</code>) and back. How it parses is not part of the lecture; you only need to read the notation. Every demo on this site accepts the same text.</p>
        ${showClass("TreeText", "Show the TreeText class")}
        ${prog("TreeTextDemo")}` },
    ],
    takeaways: ["At most two children; left ≠ right.", "Full: 0 or 2 children. Complete: filled level by level from the left.", "Linked nodes: makeBT and friends are O(1)."],
  },
  {
    slug: "3-array", nav: "Arrays", title: "Storing a Binary Tree in an Array",
    subtitle: "Parent ⌊i/2⌋, children 2i and 2i + 1",
    abstract: "Number the positions level by level from 1. Moving around the tree becomes arithmetic. Perfect for complete trees; a skewed tree of n nodes needs 2ⁿ − 1 slots.",
    tags: ["IDs 1, 2, 3, …", "gaps", "skewed waste", "isComplete"],
    hero: "arrayMini", heroCaption: "Node i, its parent ⌊i/2⌋ and its children 2i, 2i + 1.",
    sections: [
      { id: "numbering", title: "Numbering the positions", html: `
        <p>Number the positions of a binary tree level by level, left to right, starting from 1 at the root: the root's children are 2 and 3, their children 4 to 7, and so on. Call the number of a position its <b>ID</b>. For the node with ID <span class="math">i</span>:</p>
        <ul><li>its <b>parent</b> has ID <span class="math">⌊i/2⌋</span> (for <span class="math">i &gt; 1</span>);</li>
        <li>its <b>left child</b> has ID <span class="math">2i</span>, its <b>right child</b> <span class="math">2i + 1</span>.</li></ul>
        ${codeBlock(CODE.arrayIndex)}
        <p>So the tree fits in an array with node <span class="math">i</span> in <code>a[i]</code>; slot 0 is unused to keep the formulas simple. (With the root in slot 0 they become <span class="math">2i+1</span>, <span class="math">2i+2</span> and <span class="math">⌊(i−1)/2⌋</span>.) A complete tree with <span class="math">n</span> nodes uses exactly IDs <span class="math">1 … n</span>: node <span class="math">i</span> has a left child only if <span class="math">2i ≤ n</span>, a right child only if <span class="math">2i + 1 ≤ n</span>.</p>
        ${figTree("A(B(D,E),C)", "IDs in red. The array is [1]A [2]B [3]C [4]D [5]E.", { layout: "id", tag: (n) => n.id })}` },
      { id: "gaps", title: "Any binary tree, with gaps", html: `
        <p>The numbering works for any binary tree: give each node the ID of its position and leave the slots of missing positions empty. In <code>A(B(E(K,L),),D(H,I))</code>, B has no right child, so slot 5 stays empty. In code the IDs are worked out on the way down: the root gets 1, and a node with ID <span class="math">i</span> passes <span class="math">2i</span> and <span class="math">2i + 1</span> to its children.</p>
        ${showClass("ArrayTree", "Show the ArrayTree class")}
        ${prog("ArrayDemo")}
        ${demo("arrayRep", "Demo 4 · Tree and array side by side", "pick or type a tree, then step", "Amber: node i. Teal: its parent ⌊i/2⌋. Green: its children 2i and 2i + 1. Dashed cells are empty slots.")}` },
      { id: "practice", title: "Practice", html: `
        ${predict("Work out the array of each tree by hand. <b>T1</b> is a chain going left: A, its left child B, and B's left child C, i.e. <code>A(B(C,),)</code>. <b>T2</b> is <code>A(B(,D),C(,E))</code>.",
          `${prog("ArrayPractice")}<p>In T1, C is the left child of B (ID 2), so its ID is 2·2 = 4. In T2, D is the right child of B: 2·2 + 1 = 5; E is the right child of C: 2·3 + 1 = 7.</p>`)}
        ${figRow([["A(B(C,),)", "T1"], ["A(B(,D),C(,E))", "T2"]])}` },
      { id: "waste", title: "When the array wastes space", html: `
        <p>The array needs as many slots as the <em>largest ID</em>, not the number of nodes. A complete tree uses exactly <span class="math">n</span>. A chain that always goes right uses IDs 1, 3, 7, 15, …: <span class="math">2ⁿ − 1</span> slots for <span class="math">n</span> nodes.</p>
        ${prog("Skewed")}
        <p>The array has other drawbacks: <code>makeBT</code> must copy both subtrees into a new array (every ID changes when a subtree moves one level down), so it costs <span class="math">O(n)</span>, not <span class="math">O(1)</span>. That is why the slides call it "inefficient to implement the ADT". Its real use is for <b>complete</b> trees, where it wastes nothing and needs no pointers: the heap of Lecture 17.</p>` },
      { id: "shape-check", title: "Checking the shape in code", html: `
        <p>The IDs give a one-line completeness test: a tree with <span class="math">n</span> nodes is complete exactly when its largest ID is <span class="math">n</span>. Any gap pushes some ID above <span class="math">n</span>.</p>
        ${codeBlock(CODE.isComplete)}
        ${prog("ShapeCheck")}` },
    ],
    takeaways: ["Parent ⌊i/2⌋, children 2i and 2i + 1.", "Complete trees fill a[1..n] exactly.", "Skewed trees need 2ⁿ − 1 slots."],
  },
  {
    slug: "4-traversal", nav: "Traversals", title: "Traversing a Binary Tree",
    subtitle: "Preorder, inorder, postorder — where the root goes",
    abstract: "All three visit the left subtree before the right one; only the moment the root is visited differs. Each takes Θ(n) time: 2n + 1 calls on a tree of n nodes.",
    tags: ["node-left-right", "left-node-right", "left-right-node", "Θ(n)"],
    hero: "code:preorder", heroCaption: "Preorder: visit, then left, then right.",
    sections: [
      { id: "video-3", title: "Watch: Preorder, inorder and postorder", html: `
        <div class="card video" data-video="media/L13-3.mp4"></div>` },
      { id: "strategies", title: "Three strategies", html: `
        <p>To <b>traverse</b> a tree is to visit every node exactly once. "Visit" means whatever we need: print it, add it up, copy it. A binary tree has three classic recursive orders:</p>
        <ul><li><b>Preorder</b> (node–left–right): visit the node, traverse the left subtree in preorder, then the right subtree.</li>
        <li><b>Inorder</b> (left–node–right): left subtree, the node, then the right subtree.</li>
        <li><b>Postorder</b> (left–right–node): left subtree, right subtree, then the node.</li></ul>
        <p>The empty tree is traversed by doing nothing. All three go as deep as possible before backing up: they are forms of <b>depth-first</b> search (Lecture 19).</p>` },
      { id: "by-hand", title: "Preorder, step by step", html: `
        ${figTree("A(B(D,),C(E(,G),F(H,I)))")}
        <p>Expand the rule one subtree at a time; each line replaces the leftmost unfinished part by its own preorder:</p>
        ${codeBlock(`A (A's left) (A's right)
A B (B's left) (A's right)                  B's right is empty
A B D (A's right)                           D is a leaf
A B D C (C's left) (C's right)
A B D C E (E's right) (C's right)           E's left is empty
A B D C E G (C's right)
A B D C E G F (F's left) (F's right)
A B D C E G F H I`, "shell")}
        <p>The root always comes first, and every node comes before everything below it.</p>` },
      { id: "java", title: "The Java code", html: `
        <p>The three methods differ only in where the visit line sits. Here "visit" appends the element to a list:</p>
        ${codeBlock(CODE.preorder)}
        ${codeBlock(CODE.inorder)}
        ${codeBlock(CODE.postorder)}
        ${showClass("Traversals", "Show the whole Traversals class (with the one-argument wrappers)")}
        ${figTree("8(3(2,5),7(,9))", "The slides' example tree 8(3(2,5),7(,9)).")}
        ${predict("Write down the preorder, inorder and postorder of this tree. Where does 8 appear in each?",
          `${prog("TraversalDemo")}<p>8 is first in preorder, last in postorder, and in inorder it sits exactly between its left subtree (2 3 5) and its right subtree (7 9). That last fact is the key to Chapter 6.</p>`)}
        ${demo("traverse", "Demo 5 · Traversal with the call stack", "← → keys step; change order or tree", "Every call on an empty subtree is a frame too: it checks <code>x != null</code> and returns at once.")}
        ${callout("pitfall", "PITFALL · INORDER IS NOT SORTED ORDER", `<p>The inorder 2 3 5 8 7 9 is not sorted, because this tree is not a <em>binary search tree</em>. Next lecture adds the rule "smaller on the left, larger on the right"; only then does inorder come out sorted.</p>`)}` },
      { id: "time", title: "Running time", html: `
        <p>Each traversal takes <span class="math">Θ(n)</span> time on <span class="math">n</span> nodes: every node is visited once and each call does constant work besides its recursive calls. More carefully (CLRS Theorem 12.1): an empty tree costs a constant <span class="math">c</span>; if the left subtree has <span class="math">k</span> nodes,</p>
        <div class="math-block">T(n) ≤ T(k) + T(n − k − 1) + d</div>
        <p>and by induction <span class="math">T(n) ≤ (c + d)n + c</span>, since <span class="math">(c+d)k + c + (c+d)(n−k−1) + c + d = (c+d)n + c</span>. Every node must be visited, so also <span class="math">T(n) = Ω(n)</span>.</p>
        <p>Or count the calls: one per node, plus one per empty subtree reached. <span class="math">n</span> nodes have <span class="math">2n</span> child links, of which <span class="math">n − 1</span> point to nodes, so <span class="math">n + 1</span> are <code>null</code>. Total: <span class="math">2n + 1</span> calls.</p>
        ${prog("CountCalls")}
        <p>The extra <b>space</b> is the call stack: the frames are the nodes on one root-to-node path plus one, at most <span class="math">h + 2</span> deep. That is <span class="math">O(log n)</span> for a complete tree but <span class="math">O(n)</span> for a skewed one.</p>` },
      { id: "exercise", title: "Exercise: the tree 3(9,20(15,7))", html: `
        ${figTree("3(9,20(15,7))")}
        ${predict("Give the preorder, inorder and postorder.", prog("TraversalExercise"))}` },
    ],
    takeaways: ["Only the root's position differs.", "Θ(n): 2n + 1 calls.", "Stack depth ≈ height."],
  },
  {
    slug: "5-expressions", nav: "Expressions", title: "Expression Trees and Postfix",
    subtitle: "Postorder = postfix; evaluate it with a stack",
    abstract: "Operators are internal nodes, operands are leaves. Preorder gives prefix, postorder gives postfix, inorder gives infix without its parentheses.",
    tags: ["prefix · infix · postfix", "stack evaluation", "pop right first"],
    hero: "postfixMini", heroCaption: "2 3 2 4 * + *  =  2 * (3 + 2 * 4)  =  22",
    sections: [
      { id: "video-4", title: "Watch: Expression trees, postfix, and rebuilding a tree", html: `
        <div class="card video" data-video="media/L13-4.mp4"></div>` },
      { id: "trees", title: "Expression trees", html: `
        <p>An expression with binary operators is a binary tree: each operator is an internal node whose subtrees are its operands; each operand is a leaf. The operator applied <em>last</em> is the root. For <span class="math">(A + B) / (C * D) − E * (F − G) + H</span> the last operation is the final <code>+</code> (equal precedence groups from the left):</p>
        ${figTree("+(-(/(+(A,B),*(C,D)),*(E,-(F,G))),H)")}
        ${prog("ExpressionTree")}
        <ul><li>The <b>postorder</b> is the <b>postfix</b> form: each operator right after its operands. That answers the slide's question: <em>for an expression tree, postfix is exactly the postorder.</em></li>
        <li>The <b>preorder</b> is the <b>prefix</b> form: each operator before its operands.</li>
        <li>The <b>inorder</b> is the usual <b>infix</b> form, but <em>without the parentheses</em>: read with the usual precedence, <code>A+B/C*D-E*F-G+H</code> means something else. Parenthesise every operator subtree to get it right (<code>Expressions.infix</code> below).</li></ul>
        ${demo("traverseExpr", "Demo 6 · Postorder of the expression tree", "step; switch to preorder or inorder")}` },
      { id: "notation", title: "Infix and postfix", html: `
        <p><b>Infix</b> puts each operator between its operands and needs precedence rules and parentheses. <b>Postfix</b> puts each operator after its operands; the precedence was settled when the postfix form was written, so it needs <b>no parentheses and no precedence rules</b>.</p>
        <table><tr><th>infix</th><th>postfix</th></tr>
        <tr><td><code>2 + 3 * 4</code></td><td><code>2 3 4 * +</code></td></tr>
        <tr><td><code>2 * 3 + 4</code></td><td><code>2 3 * 4 +</code></td></tr>
        <tr><td><code>2 * 3 * 4</code></td><td><code>2 3 * 4 *</code></td></tr>
        <tr><td><code>(2 + 3) * 4</code></td><td><code>2 3 + 4 *</code></td></tr>
        <tr><td><code>a / b - c + d * e - a * c</code></td><td><code>a b / c - d e * + a c * -</code></td></tr></table>
        <p>Spaces separate tokens: <code>2 3</code> is two operands, <code>23</code> is one. Checking the last row through its tree:</p>
        ${prog("PostfixTable")}` },
      { id: "stack", title: "Evaluating postfix with a stack", html: `
        <p>Read the tokens left to right with a <b>stack</b> (Lecture 9): push each <b>operand</b>; for an <b>operator</b>, pop the <b>right</b> operand, then the <b>left</b> one, apply the operator and push the result. At the end the stack holds exactly one number.</p>
        ${codeBlock(CODE.evalPostfix)}
        ${showClass("Expressions", "Show the whole Expressions class")}
        ${prog("PostfixTrace")}
        ${demo("postfix", "Demo 7 · The postfix stack", "type an expression, then step", "Try <code>8 2 -</code> and <code>7 2 /</code> (integer division), and the invalid <code>1 +</code>.")}
        ${callout("pitfall", "PITFALL · POP THE RIGHT OPERAND FIRST", `<p>For <code>8 2 -</code> the stack is [8, 2]; the first pop gives 2, the <em>right</em> operand, so the answer is 8 − 2 = 6. Popping into <code>left</code> first computes 2 − 8 = −6. <code>+</code> and <code>*</code> don't care, so the bug hides until a <code>-</code> or <code>/</code> appears.</p>`)}` },
      { id: "evaluate", title: "Evaluating the tree itself", html: `
        <p>Evaluating an expression tree directly is a postorder traversal: evaluate the two subtrees, then apply the operator. The stack method does the same computation on nodes that already arrive in postorder.</p>
        ${codeBlock(CODE.evaluate)}
        ${prog("EvaluateTree")}` },
    ],
    takeaways: ["Operators inside, operands at the leaves.", "Postorder = postfix; preorder = prefix.", "Stack: push operands; pop right, pop left, push result."],
  },
  {
    slug: "6-rebuild", nav: "Rebuilding", title: "Rebuilding a Tree from Its Traversals",
    subtitle: "Preorder finds the root; inorder splits left from right",
    abstract: "Preorder + inorder (or inorder + postorder) determine a binary tree with distinct elements, in O(n) with a hash map. Preorder + postorder do not.",
    tags: ["pre + in", "in + post", "pre + post: 4 trees", "duplicates"],
    hero: "rebuildMini", heroCaption: "Preorder ABCDEXZUTY, inorder DCEBAUZTXY.",
    sections: [
      { id: "pre-in", title: "Preorder and inorder determine the tree", html: `
        <p>The preorder alone doesn't determine a tree: <code>A(B,)</code> and <code>A(,B)</code> both have preorder A B. But <b>preorder and inorder</b> together do, if all elements are <b>distinct</b>. Two facts do the work:</p>
        <ol><li>The <b>first</b> element of the preorder is the <b>root</b>.</li>
        <li>In the inorder, everything <b>left of the root</b> is the left subtree and everything <b>right of it</b> the right subtree.</li></ol>
        <p>If the left subtree has <span class="math">k</span> nodes, the preorder splits too: root, then the <span class="math">k</span> left-subtree nodes, then the rest. Repeat on each part.</p>
        <p><b>Example.</b> inorder <code>D C E B A U Z T X Y</code>, preorder <code>A B C D E X Z U T Y</code>.</p>
        <ul><li>Root <b>A</b>. Inorder: <code>D C E B</code> | A | <code>U Z T X Y</code>. Left preorder <code>B C D E</code>, right preorder <code>X Z U T Y</code>.</li>
        <li>Left of A: root <b>B</b>; inorder <code>D C E</code> | B, so B has only a left subtree (preorder <code>C D E</code>).</li>
        <li>Left of B: root <b>C</b>, children D and E.</li>
        <li>Right of A: root <b>X</b>; left <code>U Z T</code> (preorder <code>Z U T</code>), right <code>Y</code>.</li>
        <li>Left of X: root <b>Z</b>, children U and T.</li></ul>
        ${figTree("A(B(C(D,E),),X(Z(U,T),Y))")}
        ${demo("rebuild", "Demo 8 · Rebuild step by step", "edit the sequences, then step", "Amber: the root of the current call. Teal: the left part. Green: the right part. Greyed cells belong to other calls. Nodes are drawn at their inorder position, so the tree's shape appears as the roots are found.")}` },
      { id: "java", title: "The algorithm in Java", html: `
        <p>A call works on a slice of each sequence: preorder positions <code>p … p+n−1</code> and inorder positions <code>i … i+n−1</code> describe the same subtree of <code>n</code> nodes. Scanning for the root would cost <span class="math">O(n)</span> per node (<span class="math">O(n²)</span> on a skewed tree); a <code>HashMap</code> from value to inorder position makes each lookup <span class="math">O(1)</span>, so the rebuild is <span class="math">O(n)</span>. The map also detects duplicates.</p>
        ${codeBlock(CODE.preIn)}
        ${showClass("Rebuild", "Show the whole Rebuild class (with fromPreIn, fromInPost and letters)")}
        ${prog("RebuildDemo")}
        ${predict("Rebuild the tree with preorder [3, 9, 20, 15, 7] and inorder [9, 3, 15, 20, 7] by hand. How many nodes does the left subtree of the root have?",
          `<p>The root is 3. Only 9 is left of 3 in the inorder, so the left subtree has one node. The right part has preorder 20 15 7 and inorder 15 20 7: root 20, children 15 and 7 — the tree <code>3(9,20(15,7))</code> of Chapter 4. Type it into Demo 8 to check.</p>`)}` },
      { id: "in-post", title: "Inorder and postorder also work", html: `
        <p>The slides ask: can a tree be rebuilt from its <b>inorder and postorder</b>? Yes, the same argument mirrored: the <b>last</b> element of the postorder is the root; the inorder splits around it; in the postorder the first <span class="math">k</span> elements are the left subtree and the next <span class="math">n − k − 1</span> the right one, just before the root.</p>
        ${codeBlock(CODE.inPost)}
        <p><code>fromInPost</code> rebuilt the same A … Y tree in the program above. Switch Demo 8 to "inorder + postorder" to watch it.</p>` },
      { id: "pre-post", title: "Preorder and postorder are not enough", html: `
        <p>Both tell you the root, but neither tells you <em>where the left subtree ends</em>. With preorder <code>A B C</code> and postorder <code>C B A</code>, B is A's only child and C is B's only child, but nothing says left or right:</p>
        ${prog("PrePostAmbiguity")}
        ${figRow([["A(,B(,C))", "A(,B(,C))"], ["A(,B(C,))", "A(,B(C,))"], ["A(B(,C),)", "A(B(,C),)"], ["A(B(C,),)", "A(B(C,),)"]])}
        ${callout("note", "NOTE · SLIDE CORRECTION", `<p>The slide says <b>2</b> binary trees have preorder ABC and postorder CBA, and draws the all-left and all-right chains. There are <b>4</b>: B can be A's left or right child and, independently, C can be B's left or right child. Every node with exactly one child doubles the count. (If the tree is <em>full</em>, preorder and postorder do determine it.)</p>`)}
        ${demo("prePost", "Demo 9 · All trees with a given preorder and postorder", "type two sequences, then step through the trees", "Try ABDEC / DEBCA: that tree is full, so only one tree fits.")}` },
      { id: "duplicates", title: "Duplicate values", html: `
        <p>The method finds the root's value at a unique position in the inorder. With duplicates that fails: preorder <code>1 1</code> and inorder <code>1 1</code> fit both <code>1(1,)</code> and <code>1(,1)</code>. The standard fix is to label every node with a <b>unique ID</b> and rebuild from the sequences of IDs. Our <code>fromPreIn</code> refuses duplicates, and also sequences that no tree has:</p>
        ${prog("Duplicates")}` },
    ],
    takeaways: ["Root from pre (first) or post (last).", "Inorder splits left | root | right.", "Pre + post: ambiguous at one-child nodes."],
  },
  {
    slug: "7-summary", nav: "Summary", title: "Summary and Practice",
    subtitle: "Check yourself, then work with trees",
    abstract: "A one-page map of the lecture, seven self-check questions, eight exercises with checked solutions, and the key terms.",
    tags: ["knowledge map", "self-check", "exercises"],
    hero: "toc",
    sections: [
      { id: "map", title: "Knowledge map", html: `<div class="map">
        <div class="card"><h3>Vocabulary</h3><ul><li>Empty, or root + subtrees</li><li>N nodes, N − 1 edges</li><li><b>Depth</b> from the root (root 0)</li><li><b>Height</b> from the leaves (leaf 0, empty −1)</li></ul></div>
        <div class="card"><h3>Binary trees</h3><ul><li>Left and right subtrees</li><li><b>Full</b>: 0 or 2 children</li><li><b>Complete</b>: levels filled from the left</li><li>Height h → ≤ 2<sup>h+1</sup> − 1 nodes</li></ul></div>
        <div class="card"><h3>Implementations</h3><ul><li>Linked nodes: <code>element</code>, <code>parent</code>, <code>leftChild</code>, <code>rightChild</code></li><li>ADT operations <span class="math">O(1)</span></li><li>Array: parent ⌊i/2⌋, children 2i, 2i+1</li></ul></div>
        <div class="card"><h3>Traversals</h3><ul><li>Pre: node, left, right</li><li>In: left, node, right</li><li>Post: left, right, node</li><li><span class="math">Θ(n)</span>, 2n + 1 calls</li></ul></div>
        <div class="card"><h3>Expressions</h3><ul><li>Postorder = postfix</li><li>Preorder = prefix; inorder = infix without ( )</li><li>Stack: pop right, pop left, push result</li></ul></div>
        <div class="card"><h3>Rebuilding</h3><ul><li>Pre + in, or in + post: unique</li><li>Pre + post: not unique</li><li>Needs distinct elements; <span class="math">O(n)</span> with a hash map</li></ul></div></div>` },
      { id: "check", title: "Check your understanding", html: `<div data-demo="quiz"><div class="demo-body"></div></div>` },
      { id: "exercises", title: "Exercises", html: `
        <p>★ by hand · ★★ write a method · ★★★ extend or combine. Every solution below has been compiled and run.</p>
        <h3>Exercise 1 ★ (traverse)</h3>
        <p>Write down the preorder, inorder and postorder of <code>A(B(C(D,E),),X(Z(U,T),Y))</code>, the tree rebuilt in Chapter 6.</p>
        <details class="reveal"><summary>Solution</summary>${prog("Exercise1")}</details>
        <h3>Exercise 2 ★ (array)</h3>
        <p>Draw the array representation of <code>1(2(,4(8,)),3(5,))</code>. Which slots are empty? Is the tree complete?</p>
        <details class="reveal"><summary>Solution</summary><p>4 is the right child of 2, so its ID is 2·2+1 = 5; its left child 8 has ID 10. 5 is the left child of 3: ID 6. Slots 4, 7, 8 and 9 are empty, so the tree is not complete (6 nodes, largest ID 10).</p>${prog("Exercise2")}</details>
        <h3>Exercise 3 ★ (rebuild by hand)</h3>
        <p>Rebuild the tree with inorder <code>4 2 5 1 6 3</code> and postorder <code>4 5 2 6 3 1</code>. Then give its preorder.</p>
        <details class="reveal"><summary>Solution</summary><p>The last of the postorder, 1, is the root. Inorder <code>4 2 5 | 1 | 6 3</code>: a left subtree of 3 nodes (postorder <code>4 5 2</code>: root 2, children 4 and 5) and a right subtree of 2 (postorder <code>6 3</code>: root 3; inorder <code>6 3</code>, so 6 is its <em>left</em> child).</p>${prog("Exercise3")}</details>
        <h3>Exercise 4 ★★</h3>
        <p>Write <code>countLeaves(t)</code> and run it on the four shape trees of Chapter 2. For which of them is leaves = internal nodes + 1?</p>
        <details class="reveal"><summary>Solution</summary>${prog("Exercise4")}<p>It holds for the second and fourth trees, exactly the full ones. A node with one child adds an internal node without adding a leaf.</p></details>
        <h3>Exercise 5 ★★</h3>
        <p>Write <code>mirror(t)</code>, which returns a new tree with left and right swapped at every node. How are the preorder of <code>mirror(t)</code> and the postorder of <code>t</code> related?</p>
        <details class="reveal"><summary>Solution</summary>${prog("Exercise5")}<p>The preorder of the mirror is the postorder of <code>t</code> reversed: node–right–left is left–right–node backwards.</p></details>
        <h3>Exercise 6 ★★ (depth of a value)</h3>
        <p>Write <code>depthOf(t, x)</code>: the depth of the node holding <code>x</code> in a tree with distinct elements, or −1 if <code>x</code> is absent. Don't use the <code>parent</code> fields.</p>
        <details class="reveal"><summary>Solution</summary><p>Search both subtrees; if <code>x</code> is at depth <span class="math">d</span> in a subtree, it is at depth <span class="math">d + 1</span> in the whole tree.</p>${prog("Exercise6")}</details>
        <h3>Exercise 7 ★★★ (level order)</h3>
        <p>A <b>level-order</b> traversal visits the nodes depth by depth, left to right: <code>8 3 7 2 5 9</code> for <code>8(3(2,5),7(,9))</code>. Write it with a <b>queue</b> (Lecture 10): put the root in, then repeatedly take a node out, visit it and put its children in. What does level order have to do with the array IDs?</p>
        <details class="reveal"><summary>Solution</summary>${prog("Exercise7")}<p>Level order visits the nodes in increasing order of their IDs: compare the second line with the array <code>[1]A [2]B [3]D [4]E [5]- [6]H [7]I [8]K [9]L</code> of Chapter 3. Each node passes through the queue once, so it is <span class="math">Θ(n)</span> too. This is breadth-first search (Lecture 19) on a tree.</p></details>
        <h3>Exercise 8 ★★★ (postfix to tree)</h3>
        <p>Turn a postfix expression into its expression tree with a stack of <em>trees</em>: for an operand push a leaf; for an operator pop the right tree, then the left tree, and push <code>makeBT(left, operator, right)</code>. Build the tree of <code>A B + C D * / E F G - * - H +</code> and print it as fully parenthesised infix.</p>
        <details class="reveal"><summary>Solution</summary><p>This is the stack evaluation of Chapter 5, except that the "value" of a subexpression is now its tree.</p>${prog("Exercise8")}</details>` },
      { id: "terms", title: "Key terms and further reading", html: `
        <p class="tags">${["tree", "node", "edge", "root", "subtree", "parent", "child", "sibling", "leaf", "internal node", "ancestor", "descendant", "path", "length", "depth", "height", "binary tree", "full", "complete", "perfect", "skewed", "binary-tree ADT", "makeBT", "array representation", "traversal", "preorder", "inorder", "postorder", "level order", "expression tree", "infix", "prefix", "postfix", "reconstruction"].map((t) => `<span class="tag">${t}</span>`).join("")}</p>
        <ul><li>T. H. Cormen, C. E. Leiserson, R. L. Rivest, C. Stein, <em>Introduction to Algorithms</em>, 3rd ed.: §10.4 (representing rooted trees), §12.1 (tree walks, Theorem 12.1), Appendix B.5 (trees).</li>
        <li>M. A. Weiss, <em>Data Structures and Algorithm Analysis in Java</em>, 3rd ed.: §4.1–4.2 (trees, binary trees, expression trees).</li></ul>` },
    ],
    takeaways: ["Depth down, height up.", "Pointers for any tree; arrays for complete ones.", "Pre/in/post: Θ(n); pre+in or in+post rebuild it."],
  },
];

const QUIZ = [
  { q: "In a tree of height 4, what are the depth of the root and the height of a leaf?",
    opts: ["1 and 1", "0 and 0", "0 and 4", "4 and 0"],
    a: 1, why: "Depth is measured from the root and height from the leaves, both in edges: the root has depth 0 and every leaf has height 0." },
  { q: "Which tree is <b>complete</b> but <b>not full</b>?",
    opts: ["<code>1(2,3(6,4))</code>", "<code>1(2(6,),3)</code>", "<code>1(2(6,4),3)</code>", "<code>1(2(6,4),3(,5))</code>"],
    a: 1, why: "<code>1(2(6,),3)</code>: its bottom level is filled from the left (IDs 1–4, no gap), but node 2 has one child. The first is full but not complete, the third is both, the fourth neither." },
  { q: "In the array representation (root in <code>a[1]</code>), where are the children of the node in <code>a[5]</code>?",
    opts: ["<code>a[6]</code> and <code>a[7]</code>", "<code>a[9]</code> and <code>a[10]</code>", "<code>a[10]</code> and <code>a[11]</code>", "<code>a[2]</code>"],
    a: 2, why: "Left child 2·5 = 10, right child 2·5 + 1 = 11. <code>a[2]</code> is its parent, ⌊5/2⌋." },
  { q: "What is the postorder of <code>8(3(2,5),7(,9))</code>?",
    opts: ["8 3 2 5 7 9", "2 3 5 8 7 9", "2 5 3 9 7 8", "9 7 5 2 3 8"],
    a: 2, why: "Left subtree 2 5 3, right subtree 9 7, then the root 8." },
  { q: "What is the postfix form of <code>(2 + 3) * 4</code>?",
    opts: ["<code>2 3 4 + *</code>", "<code>2 3 + 4 *</code>", "<code>* + 2 3 4</code>", "<code>2 + 3 4 *</code>"],
    a: 1, why: "The root of the tree is <code>*</code> with left operand <code>2 + 3</code>; postorder gives <code>2 3 + 4 *</code>. (<code>* + 2 3 4</code> is the prefix form.)" },
  { q: "How many calls does <code>preorder</code> make on a tree of 10 nodes, counting calls on empty subtrees?",
    opts: ["10", "11", "20", "21"],
    a: 3, why: "One per node plus one per null link: 10 + 11 = 21 = 2n + 1." },
  { q: "Which pair of traversals does <b>not</b> always determine a binary tree with distinct elements?",
    opts: ["preorder + inorder", "inorder + postorder", "preorder + postorder", "all three pairs determine it"],
    a: 2, why: "Preorder and postorder cannot tell whether an only child is a left or a right child: ABC / CBA fits 4 trees." },
];
