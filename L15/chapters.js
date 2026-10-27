// Chapter content, adapted from notes/L15-avl-trees.md. Code and outputs are copied from the note.

const demo = (name, title, instr, hint = "") =>
  `<div class="card demo" data-demo="${name}"><div class="head"><span class="title">${title}</span><span>${instr}</span></div>
   <div class="demo-body"></div>${hint ? `<p class="hint">${hint}</p>` : ""}</div>`;

const callout = (kind, label, body) => `<div class="callout ${kind}"><b>${label}</b>${body}</div>`;
const predict = (q, a) => callout("predict", "PREDICT", `<p>${q}</p><details class="reveal"><summary>Show the answer</summary>${a}</details>`);
const out = (name) => codeBlock(OUT[name], "out");
const sol = (body) => `<details class="reveal"><summary>Solution</summary>${body}</details>`;

const LECTURE = {
  number: 15,
  title: "AVL Trees",
  tagline: "Binary search trees that keep themselves balanced",
  lead: "Why a plain BST can collapse into a chain, what makes a tree an AVL tree, why its height is always O(log n), and how single and double rotations repair it after every insertion and deletion — with every step animated.",
  heroDemo: "insertMini",
  heroLabel: "Inserting 1, 2, …, 7 into an AVL tree",
  heroCaption: "Sorted keys would turn a plain BST into a chain. The AVL tree rotates and ends perfectly balanced.",
  whyTitle: "Why AVL trees are worth learning",
  whySub: "Three ideas you will meet again in every balanced search tree",
  why: [
    ["A guarantee, not luck", "A plain BST is fast only if the keys arrive in a good order. An AVL tree is <b>O(log n)</b> for every order, including sorted input."],
    ["A local invariant", "One simple rule at every node — subtree heights differ by at most 1 — is enough to bound the height of the whole tree."],
    ["Rotations", "The <b>rotation</b>, a three-link change that keeps the keys in order, is the repair tool of AVL trees, red-black trees and splay trees alike."],
  ],
  ctaTitle: "Ready to balance a tree?",
  minutes: "About 75–90 minutes",
  videos: {
    "media/L15-1.mp4": "Lecture 15 · Part 1 — Why balance, and the AVL condition (10.8 min)",
    "media/L15-2.mp4": "Lecture 15 · Part 2 — The height bound and the single rotation (11.8 min)",
    "media/L15-3.mp4": "Lecture 15 · Part 3 — Double rotations and insertion (12.0 min)",
    "media/L15-4.mp4": "Lecture 15 · Part 4 — Deletion (10.1 min)",
  },
};

const CHAPTERS = [
  {
    slug: "1-why", nav: "Why balance", title: "Why Balance a Search Tree",
    subtitle: "A BST is only as fast as it is short",
    abstract: "Every BST operation costs time proportional to the tree's height. The height can be anything from log₂ n to n − 1, and sorted input gives the worst case.",
    tags: ["height", "best and worst case", "complete tree"],
    hero: "bstVsAvlMini", heroCaption: "The same keys: a plain BST (left) and an AVL tree (right).",
    sections: [
      { id: "video-1", title: "Watch: Why balance, and the AVL condition", html: `
        <div class="card video" data-video="media/L15-1.mp4"></div>` },
      { id: "cost", title: "The cost of a BST operation is its height", html: `
        <p>Recall from Lecture 14: in a <b>binary search tree</b> every node's key is larger than all keys in its left subtree and smaller than all keys in its right subtree. <code>find</code> starts at the root and goes left or right at each node, so it visits at most one node per level. <code>insert</code> searches and hangs a new leaf where the search fell off the tree; <code>delete</code> searches and then relinks a constant number of nodes (plus, for a node with two children, one more walk down to its successor). All three take <b>O(h)</b> time, where h is the <b>height</b> of the tree.</p>
        <p>How tall can a tree of n nodes be?</p>
        <ul><li><b>Best case.</b> Level d holds at most 2<sup>d</sup> nodes, so a tree of height h has at most 2<sup>h+1</sup> − 1 nodes. Hence h ≥ ⌊log₂ n⌋. A <b>complete binary tree</b> (all levels full except possibly the last, which is filled from the left) reaches this bound.</li>
        <li><b>Worst case.</b> Every node has one child: a chain, h = n − 1.</li></ul>
        <p>So ⌊log₂ n⌋ ≤ h ≤ n − 1: a BST operation costs Θ(log n) at best and Θ(n) at worst. The worst case is not exotic: inserting keys <em>in sorted order</em> — IDs, timestamps, an already sorted file — produces exactly the chain.</p>
        ${demo("bstVsAvl", "Demo 1 · Plain BST vs AVL tree", "edit the keys, then step", "Try the presets. Sorted keys (ascending or descending) give a chain in the plain BST; the AVL tree stays about log₂ n tall whatever the order.")}` },
      { id: "nodes", title: "Nodes that know their height", html: `
        <p>All programs in this lecture share one node class. Besides the key and the two links, each node stores its <b>height</b>, which AVL trees need at every node. The constructor with two children computes the height from them, so small trees can also be built by hand, bottom-up.</p>
        ${codeBlock(CODE.avlNode)}
        <p>To print a tree on one line we write a node's key followed, if it has children, by <code>(left,right)</code>; an empty subtree is <code>-</code>. So <code>20(10(5,-),30)</code> is the tree with root 20, whose left child 10 has a left child 5, and whose right child is the leaf 30. The helper class <code>TreeText</code> prints this form, a table of heights and balance factors, and checks the AVL properties:</p>
        <details class="reveal"><summary>Show <code>TreeText</code></summary>${codeBlock(CODE.treeText)}</details>
        <p>Here is the plain BST of Lecture 14 on the same nodes, with no balancing. After an insertion each node on the way back up recomputes its height from its children.</p>
        ${codeBlock(CODE.plainBst)}
        <p>The same seven keys in two orders give the two extreme shapes, and sorted keys give a chain:</p>
        ${codeBlock(CODE.shapes)}
        ${out("shapes")}` },
      { id: "complete", title: "Why not keep the tree complete?", html: `
        <p>The ideal would be a tree that is <em>complete</em> after every operation: height ⌊log₂ n⌋, the smallest possible. That is too expensive to maintain. In a complete BST the shape is fixed by n alone, and the keys must be placed in order into that shape, so one insertion can move every node.</p>
        ${demo("complete", "Demo 2 · Insert 2, then rebuild a complete tree", "step through it")}
        <p>The way out is to <b>relax the condition a little</b>. We don't need the <em>smallest</em> height; any height that is O(log n) will do. A BST family that guarantees O(log n) height after every update, at O(log n) cost per update, is called a <b>balanced BST</b>.</p>` },
      { id: "family", title: "Balanced search trees", html: `
        <p>In a BST the order of the keys decides much of the shape, and updates make the tree drift out of balance. Many schemes keep it balanced:</p>
        <ul><li><b>AVL trees</b> (this lecture): the two subtrees of every node differ in height by at most 1.</li>
        <li><b>Red-black trees</b> (Lecture 16): colour the nodes and keep the colouring rules; a little less balanced than AVL, but cheaper to update.</li>
        <li><b>Splay trees</b> and other <b>self-adjusting trees</b>: no balance condition; every access moves the accessed node to the root, which gives O(log n) <em>amortised</em> time.</li>
        <li><b>B-trees</b> and other <b>multiway search trees</b>: nodes with many keys and many children, used by databases and file systems on disk.</li></ul>
        ${callout("note", "NOTE", `<p>The slides write the bounds as “log n ≤ d ≤ n − 1” and “at least O(log n) time”. Precisely: the height is at least ⌊log₂ n⌋, and a lower bound is written with Ω, not O — a BST operation takes Ω(log n) time in the worst case over the keys, whatever the shape.</p>`)}` },
    ],
    takeaways: ["BST operations cost O(height).", "Height ranges from ⌊log₂ n⌋ to n − 1; sorted input is the worst.", "Complete trees cost Θ(n) to maintain: relax to O(log n) height."],
  },
  {
    slug: "2-avl", nav: "Definition", title: "The AVL Tree",
    subtitle: "Every node balanced within one level",
    abstract: "An AVL tree is a BST in which the two subtrees of every node differ in height by at most 1. That local rule is enough to keep the whole tree O(log n) tall.",
    tags: ["height", "balance factor", "N(h)", "Fibonacci trees"],
    hero: "minTreeMini", heroCaption: "The smallest AVL trees of heights 0 to 6.",
    sections: [
      { id: "video-2", title: "Watch: The height bound and the single rotation", html: `
        <div class="card video" data-video="media/L15-2.mp4"></div>` },
      { id: "balance", title: "Height and balance factor", html: `
        <p>The AVL tree was invented in 1962 by the Soviet mathematicians <b>G. M. Adelson-Velsky</b> and <b>E. M. Landis</b>, and is named after their initials. It is the oldest balanced BST.</p>
        <p>The <b>height</b> of a node is the number of edges on the longest path from it down to a leaf. A leaf has height 0, and by convention the <b>empty tree has height −1</b>. With that convention one formula works everywhere:</p>
        <div class="math-block">height(t) = max(height(t.left), height(t.right)) + 1</div>
        <p>The <b>balance factor</b> of a node is</p>
        <div class="math-block">balance(t) = height(t.left) − height(t.right)</div>
        <p>A positive balance factor means the node is <em>left-heavy</em>, a negative one <em>right-heavy</em>.</p>` },
      { id: "definition", title: "Definition", html: `
        <p>An <b>AVL tree</b> is a binary search tree in which <b>every node has balance factor −1, 0 or +1</b>. Its properties are:</p>
        <ol><li><b>Binary tree property</b>: every node has at most two children (as for a BST);</li>
        <li><b>Order property</b>: left subtree &lt; node &lt; right subtree (as for a BST);</li>
        <li><b>Balance condition</b>: −1 ≤ balance(node) ≤ +1 for <em>every</em> node.</li></ol>
        <p>If an update makes some balance factor +2 or −2, the tree must be <b>rebalanced</b> before the update finishes.</p>
        ${demo("balanceCheck", "Demo 3 · Is it an AVL tree?", "edit the keys, then step", "This demo inserts into a <em>plain</em> BST and only reports the balance factors (red = ±2 or worse). Try the two trees from the slides.")}
        <p>The program builds the two trees from the slides: the first is an AVL tree; the second breaks the rule at three nodes — 1 (−2), 4 (+2) and the root 6 (+2). The deepest of the three is node 1.</p>
        ${codeBlock(CODE.balanceFactors)}
        ${out("balanceFactors")}
        ${predict("Without running anything: is the chain <code>1(-,2(-,3))</code> an AVL tree? Which node breaks the rule, and what is its balance factor? Is <code>2(1,3)</code> an AVL tree?",
          `<p>The chain is not: node 1 has an empty left subtree (height −1) and a right subtree of height 1, so its balance is −1 − 1 = −2. Node 2 has balance −1 and the leaf 3 has 0, so node 1 is the only offender. <code>2(1,3)</code> has balance 0 everywhere: an AVL tree (even a perfect one).</p>`)}
        ${callout("pitfall", "PITFALL", `<p><b>Checking only the root.</b> A root with balance 0 can sit on top of two long chains of equal length. The condition is about every node. And remember that an empty subtree has height −1, not 0: a node whose only child is a leaf has balance ±1.</p>`)}` },
      { id: "height", title: "The height of an AVL tree is O(log n)", html: `
        <p>This theorem is what makes AVL trees worth having.</p>
        ${callout("pattern", "THEOREM", `<p>An AVL tree with n nodes has height O(log n).</p>`)}
        <p><b>Proof.</b> Turn the question around: what is the <b>minimum</b> number of nodes N(h) of an AVL tree of height h?</p>
        <ul><li>N(0) = 1 (a single leaf) and N(1) = 2 (a root with one child).</li>
        <li>For h ≥ 2, the root of a smallest tree of height h has one subtree of height h − 1 (that makes the height h) and, by the balance condition, the other of height h − 1 or h − 2. Fewest nodes: h − 2, with both subtrees themselves smallest. So</li></ul>
        <div class="math-block">N(h) = N(h − 1) + N(h − 2) + 1 &nbsp; for h ≥ 2</div>
        <p>which gives 1, 2, 4, 7, 12, 20, 33, … Since N grows, N(h − 1) &gt; N(h − 2), so N(h) &gt; 2 · N(h − 2) &gt; 4 · N(h − 4) &gt; … : every step down by 2 at least doubles the count. Going down to N(0) = 1 or N(1) = 2 gives N(h) ≥ 2<sup>h/2</sup>. Any AVL tree with n nodes and height h has n ≥ N(h) ≥ 2<sup>h/2</sup>, so <b>h ≤ 2 log₂ n = O(log n)</b>. ∎</p>
        ${demo("minTree", "Demo 4 · The smallest AVL trees", "step through the heights", "Each tree is a root with a smallest tree of height h − 1 on the left and one of height h − 2 on the right. Every inner node has balance +1: as lopsided as the rules allow.")}
        <p>The bound is not tight. N(h) = F(h + 3) − 1, where F are the Fibonacci numbers (F(1) = F(2) = 1), which grow like φ<sup>k</sup> with φ ≈ 1.618. That gives the classical bound <b>h &lt; 1.44 log₂(n + 2)</b>: an AVL tree is never more than about 44% taller than the best possible tree. Trees built like the ones in the demo are called <b>Fibonacci trees</b>.</p>
        ${codeBlock(CODE.minNodes)}
        ${out("minNodes")}
        <p>A million keys in an AVL tree are never more than 27 levels deep (the best possible is 19); a plain BST could be 999,999 deep. Since <code>find</code>, <code>insert</code> and <code>delete</code> all cost O(height), <b>all three are O(log n)</b> — provided the rebalancing also costs O(log n). The rest of the lecture shows that it does.</p>
        ${callout("note", "NOTE", `<p>The slides' version of this proof stops the chain at f(2) = 4 and concludes n &gt; 2<sup>h/2+1</sup>. For h = 2 and n = 4 that is 4 &gt; 4, false: the inequality should be ≥ (n ≥ 2<sup>h/2+1</sup>, so h ≤ 2 log₂ n − 2, for even h). The recurrence itself holds from h = 2, not only from h = 3.</p>`)}
        ${predict("What is the smallest AVL tree of height 3? How many nodes does it have?",
          `<p>N(3) = N(2) + N(1) + 1 = 4 + 2 + 1 = 7. One such tree is <code>5(3(2(1,-),4),7(6,-))</code>: a smallest tree of height 2 on the left (4 nodes) and one of height 1 on the right (2 nodes). Every inner node has balance +1.</p>`)}` },
    ],
    takeaways: ["balance = height(left) − height(right); empty tree has height −1.", "AVL: every node's balance is −1, 0 or +1.", "N(h) = N(h−1) + N(h−2) + 1 grows exponentially, so h = O(log n)."],
  },
  {
    slug: "3-rotations", nav: "Rotations", title: "Rotations",
    subtitle: "Change three links, keep the order, fix the balance",
    abstract: "An insertion can only unbalance nodes on its path. At the deepest unbalanced node there are four cases; two need a single rotation, two need a double rotation.",
    tags: ["four cases", "single rotation", "double rotation", "dog-leg"],
    hero: "rotationMini", heroCaption: "rotateWithLeftChild, one link at a time.",
    sections: [
      { id: "video-3", title: "Watch: Double rotations and insertion", html: `
        <div class="card video" data-video="media/L15-3.mp4"></div>` },
      { id: "where", title: "Where an insertion breaks the balance", html: `
        <p>Insert into an AVL tree the BST way: search for the key and, if it is not there, hang a new leaf where the search ended. Inserting 9 into <code>3(2,7(5,-))</code> gives <code>3(2,7(5,9))</code>, still an AVL tree. Inserting 4 next gives <code>3(2,7(5(4,-),9))</code>: node 7 has balance +1, but the root has subtrees of heights 0 and 2, balance −2. It must be repaired.</p>
        <p>Two principles keep the damage local:</p>
        <ol><li><b>Imbalance only occurs on the path from the new leaf to the root.</b> Only those nodes got a new node in their subtrees, so only their heights and balance factors can change.</li>
        <li><b>Rebalance at the deepest unbalanced node.</b> Walk back up from the new leaf, updating heights; the first node whose balance becomes ±2 is the one to fix. We will see that fixing it fixes every node above it too.</li></ol>
        <p>The recursive <code>insert</code> gives both for free: after the recursive call returns into a node, the node recomputes its height, checks its balance, and rotates if needed — from the bottom of the path to the top.</p>` },
      { id: "cases", title: "The four cases", html: `
        <p>Call the deepest unbalanced node <b>z</b>, and let <b>y</b> be its child on the taller side (the new key went there). There are four cases:</p>
        <table><thead><tr><th>case</th><th>the new key is in …</th><th>kind</th><th>fix</th></tr></thead><tbody>
        <tr><td>left-left</td><td>the left subtree of z's left child</td><td>outside</td><td>single rotation (right rotation at z)</td></tr>
        <tr><td>right-right</td><td>the right subtree of z's right child</td><td>outside</td><td>single rotation (left rotation at z)</td></tr>
        <tr><td>left-right</td><td>the right subtree of z's left child</td><td>inside</td><td>double rotation (left at y, then right at z)</td></tr>
        <tr><td>right-left</td><td>the left subtree of z's right child</td><td>inside</td><td>double rotation (right at y, then left at z)</td></tr></tbody></table>
        <p>Left-left and right-right are mirror images, and so are left-right and right-left. In the <b>outside</b> cases the path from z goes the same way twice, in a straight line. In the <b>inside</b> cases it bends — this shape is often called a <b>dog-leg</b>. There are no other possibilities.</p>
        <p>A <b>rotation</b> rearranges a node and one of its children so that the child becomes the parent. It changes a constant number of links, so it costs O(1), and it keeps the in-order sequence of keys, so the tree is still a BST.</p>` },
      { id: "single", title: "Left-left: a single rotation", html: `
        <p>Let z have left child y, let y's subtrees be A and B, and let z's right subtree be C, of height h. Before the insertion y had height h + 1; the new key went into A, which grew from h to h + 1, and B has height h (if it were h − 1, y itself would now be unbalanced and would be the deepest unbalanced node). So A, B, C have heights h + 1, h, h and balance(z) = +2.</p>
        <p>The keys are ordered A &lt; y &lt; B &lt; z &lt; C. A <b>right rotation at z</b> makes y the subtree root with z as its right child; A stays with y, and <b>B moves across</b> to become z's left subtree:</p>
        ${codeBlock(`        z                      y
       / \\                   /   \\
      y   C      ===>       A     z
     / \\                   (h+1) / \\
    A   B                       B   C
  (h+1) (h)                    (h) (h)`, "out")}
        <p>After it, z has height h + 1 and balance 0, and y has height h + 2 and balance 0. The subtree is h + 2 tall — exactly <b>what it was before the insertion</b>, so nothing above it changes.</p>
        <p>Following Weiss's textbook the method is called <code>rotateWithLeftChild</code>: z (named <code>k2</code>) is rotated with its left child <code>k1</code>. Right-right is the mirror image, <code>rotateWithRightChild</code>.</p>
        ${codeBlock(CODE.rotations)}
        <p>The node that moves <em>down</em> gets its height updated first, because the new height of the node that moves up depends on it. The methods return the new subtree root, and the caller must store it: <code>t = rotateWithLeftChild(t)</code>. Forgetting that assignment is the most common rotation bug: the rotated subtree is lost.</p>
        ${demo("rotation", "Demo 5 · A rotation, line by line", "pick a case, then step", "The amber box <b>t</b> is the caller's link. Watch it keep pointing at the old root until the method returns. Heights are shown next to the nodes; switch to “balance” to see the balance factors.")}
        ${callout("note", "NOTE", `<p>On the slides these methods are declared <code>private static AvlNode&lt;Anytype&gt; …</code> inside a generic class. A static method cannot use its class's type parameter, so that does not compile. Here they are <b>static generic methods</b> (<code>static &lt;T&gt; AvlNode&lt;T&gt; …</code>) in their own class; the alternative is to drop <code>static</code>.</p>`)}` },
      { id: "double", title: "Left-right: a double rotation", html: `
        <p>In the left-right case the new key went into B, the <em>middle</em> subtree. A single right rotation at z moves B across to z — and B is exactly the part that is too deep, so the result is unbalanced the other way. (Pick “right-left, single (wrong)” in Demo 5 to see it.) Look one level deeper: let <b>x</b> be B's root, with subtrees B1 and B2. The keys are ordered A &lt; y &lt; B1 &lt; x &lt; B2 &lt; z &lt; C. The fix makes <b>x</b> the root, with y and z as its children:</p>
        <ol><li>a <b>left rotation at y</b> lifts x above y, which turns the dog-leg into a straight left-left line z → x → y;</li>
        <li>a <b>right rotation at z</b> then lifts x above z, exactly as before.</li></ol>
        ${codeBlock(`        z                    z                     x
       / \\                  / \\                  /   \\
      y   C     ===>       x   C     ===>       y     z
     / \\                  / \\                  / \\   / \\
    A   x                y   B2               A  B1 B2  C
       / \\              / \\
      B1  B2           A   B1`, "out")}
        <p>Afterwards y holds A and B1, z holds B2 and C, both have height h + 1, and x has height h + 2: again the height before the insertion. In code the double rotation is literally the two single rotations (<code>doubleWithLeftChild</code>); right-left is the mirror, <code>doubleWithRightChild</code>.</p>
        ${demo("rotationDouble", "Demo 6 · A double rotation", "pick a case, then step")}
        <p>The program runs both kinds of rotation on trees built by hand, including a single rotation used wrongly on the inside case:</p>
        ${codeBlock(CODE.rotationDemo)}
        ${out("rotationDemo")}
        ${predict("Which case is the insertion of 4 into <code>3(2,7(5,9))</code>? Which node becomes the root of the repaired subtree, and what is the final tree?",
          `<p>The deepest unbalanced node is the root 3 (balance −2). We went right at 3 (to 7) and left at 7 (to 5): <b>right-left</b>, an inside case, so a double rotation. A right rotation at 7 lifts 5, then a left rotation at 3 lifts 5 again: <code>5(3(2,4),7(-,9))</code>. The root of the middle subtree always ends on top in a double rotation.</p>`)}
        ${callout("pitfall", "PITFALL", `<p><b>Rotating at the wrong node.</b> The rotation is centred on the <em>deepest</em> unbalanced node z — not on the root and not on the new leaf. And on the slides' figures, “right-rotation on 12” names the node the rotation happens <em>at</em>: 12 goes down to the right and its left child comes up.</p>`)}` },
    ],
    takeaways: ["Only nodes on the insertion path can become unbalanced.", "Outside cases: one rotation. Inside (dog-leg) cases: two.", "A rotation is O(1) and keeps the BST order."],
  },
  {
    slug: "4-insertion", nav: "Insertion", title: "Insertion",
    subtitle: "Insert as in a BST, then repair on the way up",
    abstract: "Insert a leaf, walk back up updating heights, and rotate at the first node whose balance becomes ±2. That one rotation restores the old height, so the insertion is done.",
    tags: ["insert", "worked examples", "one rotation is enough", "O(log n)"],
    hero: "insertMini", heroCaption: "Sorted keys 1 to 7: four right-right rotations, and a perfect tree.",
    sections: [
      { id: "algorithm", title: "The algorithm", html: `
        <p>To insert key x into the AVL tree rooted at t:</p>
        <ol><li>If t is empty, return a new leaf holding x.</li>
        <li>If x &lt; t's key, insert x into the left subtree. When the call returns, the left subtree may have grown by 1. If now height(left) − height(right) = 2, rebalance: if x went into the left subtree of t.left, it is left-left (single rotation); otherwise left-right (double rotation).</li>
        <li>If x &gt; t's key, do the mirror image on the right.</li>
        <li>If x equals t's key, it is a duplicate: do nothing.</li>
        <li>Recompute t's height and return t (or the new subtree root after a rotation).</li></ol>
        <p>This is the code from the slides (Weiss, <em>Data Structures and Algorithm Analysis in Java</em>, §4.4), with a log of every rebalancing added so the examples can show what happened:</p>
        ${codeBlock(CODE.insertV1)}
        <details class="reveal"><summary>Show the whole class <code>AvlTree</code> (first version)</summary>${codeBlock(CODE.avlTreeV1)}</details>
        <p><code>contains</code> is the ordinary BST search: it never changes the tree. Comparing x with <code>t.left.element</code> is enough to tell left-left from left-right, because x lies in the taller subtree of t.left. And because rebalancing happens on the way back up the recursion, the <b>first</b> unbalanced node met is automatically the deepest one.</p>
        ${demo("insert", "Demo 7 · AVL insertion step by step", "edit the keys, then step (or ⏭ to the next insert)", "Teal: the search path. Amber: the node being looked at. Red: unbalanced. Green: the new leaf. Watch the heights after a rotation: “unchanged” all the way up.")}` },
      { id: "examples", title: "Worked examples", html: `
        <p>The program replays the insertion examples from the lecture. Each tree is first built from keys that need no rotation; then the interesting keys are inserted one by one.</p>
        ${codeBlock(CODE.insertDemo)}
        ${out("insertDemo")}
        <p>Trace the second example with heights:</p>
        <ul><li><b>Start</b> <code>20(10(5,-),30(25,35))</code>: leaves 0, nodes 10 and 30 height 1, root 20 height 2.</li>
        <li><b>Insert 40.</b> Path 20 → 30 → 35; 40 becomes 35's right child. Going up: 35 height 1 (balance −1), 30 height 2 (−1), 20 height 3 (−1). No rotation.</li>
        <li><b>Insert 45.</b> Path 20 → 30 → 35 → 40; 45 becomes 40's right child. Going up: 40 height 1 (−1); 35 has −1 on the left and 1 on the right: <b>−2</b>. It is the deepest unbalanced node; we went right, then right: <b>right-right</b>, a left rotation at 35. Now 40 is that subtree's root with children 35 and 45, height 1 — the height before. 30 and 20 keep heights 2 and 3.</li>
        <li><b>Insert 34.</b> Path 20 → 30 → 40 → 35; 34 becomes 35's left child. Going up: 35 height 1, 40 height 2 (+1); 30 has 0 against 2: <b>−2</b>. Right at 30, then left at 40: <b>right-left</b>. A right rotation at 40 lifts 35, a left rotation at 30 lifts 35 again: <code>35(30(25,34),40(-,45))</code>, height 2 as before; 20 keeps height 3.</li></ul>
        <p>The third example is left-left at 30: 15 comes up and 16 moves across to 30. The last one is the slides' exercise: inserting 8 below 11 makes 7 the deepest unbalanced node (−2); right at 7, left at 12: right-left, so a right rotation at 12 and then a left rotation at 7 lift 11 to the top.</p>` },
      { id: "one", title: "One rotation is enough", html: `
        <p>In all four cases the rotated subtree ends with <b>the same height it had before the insertion</b>. Every node above it sees a subtree of unchanged height, so its height and balance factor are what they were before the insertion, when the tree was a valid AVL tree.</p>
        ${callout("pattern", "KEY FACT", `<p>After an insertion, at most <b>one</b> rebalancing (one single or one double rotation) is needed, at the deepest unbalanced node. Above it, nothing changes.</p>`)}
        <p><b>Cost.</b> The search costs O(height) = O(log n). On the way back up each node does O(1) work: compare two heights, maybe rotate (O(1)), recompute its height. So insertion is <b>O(log n)</b> in the worst case.</p>
        ${predict("Insert 1, 2, 3, …, 7 in this order into an empty AVL tree. A plain BST would become a chain of height 6. What does the AVL tree look like, and how many rotations happen?",
          `<p>Every key goes to the right end, so every rotation is right-right. The result is the perfect tree <code>4(2(1,3),6(5,7))</code> after 4 rotations:</p>${codeBlock(CODE.sortedInsert)}${out("sortedInsert")}<p>Sorted input, the worst case for a plain BST, is no problem for an AVL tree: with 2<sup>k</sup> − 1 sorted keys it even produces a perfect tree.</p>`)}
        ${callout("pitfall", "PITFALL", `<p><b>Testing the balance before the heights are updated.</b> The test must use the <em>new</em> height of the child the key went into. In the slides' code that is automatic: <code>t.left = insert(x, t.left)</code> has already stored it. If you write insertion with a loop, update heights bottom-up first, then test.</p>`)}` },
    ],
    takeaways: ["BST insert, then balance each node on the way up.", "The rotated subtree regains its old height: one rotation suffices.", "Insertion costs O(log n)."],
  },
  {
    slug: "5-deletion", nav: "Deletion", title: "Deletion and the Cost of Balance",
    subtitle: "Like insertion, but the repair can travel to the root",
    abstract: "Delete as in a BST, then walk back up rebalancing. The rotation is chosen from the child's balance factor, and one rotation may not be enough: the imbalance can propagate.",
    tags: ["successor", "single or double?", "propagation", "pros and cons"],
    hero: "removeMini", heroCaption: "Delete 9: a double rotation at 5, then a single rotation at the root.",
    sections: [
      { id: "video-4", title: "Watch: Deletion", html: `
        <div class="card video" data-video="media/L15-4.mp4"></div>` },
      { id: "steps", title: "The general steps", html: `
        <ol><li><b>Search</b> downward for the key.</li>
        <li><b>Delete</b> it as in a plain BST: a leaf is removed; a node with one child is replaced by that child; a node with two children gets the key of its <b>successor</b> (the smallest key in its right subtree), and then the successor is deleted from the right subtree instead.</li>
        <li>Walk back up the path to the root, <b>correcting heights</b>; at every node whose balance has become ±2, rebalance with a single or a double rotation.</li></ol>
        <p>The difference from insertion is in step 3: a deletion makes a subtree <em>shorter</em>, and after a rotation the subtree may still be one shorter than before, so the imbalance can <b>propagate upward</b> and several rotations may be needed.</p>` },
      { id: "easy", title: "Easy cases and Case 1: single rotation", html: `
        <p>Take <code>10(5(2(-,3),9),15(12,20(17,30)))</code> (heights: leaves 0; 2 and 20 → 1; 5 and 15 → 2; 10 → 3).</p>
        <ul><li><b>Delete 17</b>, a leaf: 20 still has 30, so it keeps height 1 (balance now −1), and nothing else changes. No rotation.</li>
        <li><b>Delete 15</b> (from the original tree), which has two children. Its successor is 17: copy 17 into the node, then delete the leaf 17 from the right subtree. Result <code>10(5(2(-,3),9),17(12,20(-,30)))</code>. No rotation.</li>
        <li><b>Delete 12</b> next. Node 17 has an empty left subtree (−1) against 20(-,30) of height 1: balance −2. Its right child 20 has balance −1, leaning the same way: <b>right-right</b>, a single left rotation at 17 gives <code>20(17,30)</code>. Above it, 10 has heights 2 and 1: balance +1, fine.</li></ul>
        ${demo("remove", "Demo 8 · AVL deletion step by step", "pick a preset, then step (⏭ jumps to the next delete)", "The presets replay every deletion example of the lecture. “Fibonacci tree” shows the worst case: one rotation per level.")}` },
      { id: "propagation", title: "Case 2: double rotation, and propagation", html: `
        <p>Now take <code>10(5(2(-,3),9),17(12(11,15(13,-)),20(18,30(-,33))))</code>, of height 4, and <b>delete 9</b>. Node 5 is left with 2(-,3) of height 1 against nothing: balance +2. Its left child 2 has balance −1, leaning the <em>other</em> way — a dog-leg, so <b>left-right</b>: a double rotation makes <code>3(2,5)</code>.</p>
        <p>But we are <b>not finished</b>. The subtree that was 2 tall is now 1 tall. The root 10 has heights 1 and 3: balance −2. The imbalance has <b>propagated</b>. At 10 the tall side is the right; its child 17 has balance 0 (both subtrees have height 2). A single left rotation at 10 repairs it: 17 becomes the root, and 17's left subtree 12(…) moves across to 10. Final tree: <code>17(10(3(2,5),12(11,15(13,-))),20(18,30(-,33)))</code>.</p>` },
      { id: "choose", title: "Choosing single or double", html: `
        <p>In insertion we chose the rotation by comparing the new key with the child's key. In deletion there is no new key; the choice comes from the <b>heights</b>. If z has balance +2 and y = z.left:</p>
        <ul><li>balance(y) ≥ 0, i.e. height(y.left) ≥ height(y.right): <b>left-left</b>, single rotation;</li>
        <li>balance(y) = −1: <b>left-right</b>, double rotation.</li></ul>
        <p>Mirror image for −2. Balance(y) = 0 <b>never happens after an insertion</b> (the new key made one of y's subtrees strictly taller), but it does after a deletion, as at node 10 above. Then the <b>single</b> rotation is right: it leaves z with balance +1 and y with −1. A double rotation can fail there, because it gives y's inner subtree away.</p>
        ${callout("note", "NOTE", `<p>The slides show the propagated case twice: fixed by a single rotation at 10, and by a double rotation (12 on top). The single rotation is what the rule prescribes, because 17's balance is 0. The double rotation gives a valid tree here only by luck: it hands 15(13,-), of height 1, to 17 next to 20(…) of height 2. Had 12's <em>left</em> subtree been the taller one, 17 would have got height 0 next to 2: balance −2. Always choose from the child's balance factor.</p>`)}
        <p>Both operations can share one <code>balance</code> method that chooses from heights. The final <code>AvlTree</code> uses it for insertion (equivalent to the slides' test) and adds <code>remove</code>:</p>
        ${codeBlock(CODE.balance)}
        ${codeBlock(CODE.remove)}
        <details class="reveal"><summary>Show the whole final class <code>AvlTree</code></summary>${codeBlock(CODE.avlTree)}</details>
        <p><code>balance</code> runs on every node of the search path, bottom-up, because each recursive call ends with <code>return balance(t)</code>. When the deleted node has two children, the successor is removed by a second recursive <code>remove</code> down the right subtree, so that path is rebalanced too. The program replays the deletion examples:</p>
        ${codeBlock(CODE.deleteDemo)}
        ${out("deleteDemo")}` },
      { id: "cost", title: "The cost of deletion", html: `
        <p>The search costs O(log n), finding the successor at most another O(log n), and each node on the way back up does O(1) work including at most one rotation. A rotation during deletion may leave its subtree one shorter, so the parent may need one too — in the worst case a rotation at every level. There are only O(log n) levels, so <b>deletion is O(log n)</b>, with up to O(log n) rotations.</p>
        <p>A large random test: after 100,000 insertions and 50,000 deletions the tree passes the AVL check, and its height stays well below 1.44 log₂(n + 2).</p>
        ${codeBlock(CODE.randomTest)}
        ${out("randomTest")}
        <p>The height of a random AVL tree is close to log₂ n, far from the worst case.</p>` },
      { id: "proscons", title: "Pros and cons of AVL trees", html: `
        <div class="map" style="grid-template-columns:repeat(auto-fit,minmax(220px,1fr))">
        <div class="card"><h3>Pros</h3><ul><li>Search is O(log n): the tree is always balanced.</li><li>Insertion and deletion are O(log n), rebalancing included.</li><li>Balancing adds only a constant factor to an insertion: one height comparison per node, at most one rotation.</li></ul></div>
        <div class="card"><h3>Cons</h3><ul><li>Harder to program and debug: four rotation cases, and deletion on top.</li><li>Extra space per node for the height (or balance factor: 2 bits).</li><li>Rebalancing costs time; red-black trees (Lecture 16) rotate less on updates.</li><li>Large searches on disk use other structures, e.g. <b>B-trees</b>, whose wide nodes make the tree very shallow.</li></ul></div></div>
        <p><b>Reading.</b> CLRS, Chapter 12 (binary search trees) and Problem 13-3 (AVL trees); Weiss, <em>Data Structures and Algorithm Analysis in Java</em>, §4.4. Next lecture: red-black trees, CLRS Chapter 13.</p>` },
    ],
    takeaways: ["BST delete, then balance each node on the way up.", "Child's balance 0 or same side → single; other side → double.", "Imbalance can propagate: up to O(log n) rotations, still O(log n)."],
  },
  {
    slug: "6-summary", nav: "Summary", title: "Summary and Practice",
    subtitle: "Check yourself, then balance some trees by hand",
    abstract: "A one-page map of the lecture, a self-check quiz, six exercises with solutions, and the key terms.",
    tags: ["knowledge map", "self-check", "exercises"],
    hero: "toc",
    sections: [
      { id: "map", title: "Knowledge map", html: `<div class="map">
        <div class="card"><h3>Why balance</h3><ul><li>BST operations cost O(height)</li><li>⌊log₂ n⌋ ≤ h ≤ n − 1</li><li>Sorted input → chain</li><li>Complete trees: Θ(n) per update</li></ul></div>
        <div class="card"><h3>Definition</h3><ul><li>height(empty) = −1, leaf = 0</li><li>balance = h(left) − h(right)</li><li>AVL: every node in {−1, 0, +1}</li></ul></div>
        <div class="card"><h3>Height bound</h3><ul><li>N(h) = N(h−1) + N(h−2) + 1</li><li>N(h) = F(h+3) − 1</li><li>h ≤ 2 log₂ n; h &lt; 1.44 log₂(n+2)</li></ul></div>
        <div class="card"><h3>Rotations</h3><ul><li>O(1), keep in-order sequence</li><li>Outside (LL, RR): single</li><li>Inside (LR, RL): double; x ends on top</li></ul></div>
        <div class="card"><h3>Insertion</h3><ul><li>Rotate at the deepest unbalanced node</li><li>Subtree regains its old height</li><li>At most one rebalancing · O(log n)</li></ul></div>
        <div class="card"><h3>Deletion</h3><ul><li>Successor for two children</li><li>Choose by the child's balance (0 → single)</li><li>Can propagate: O(log n) rotations · O(log n)</li></ul></div></div>` },
      { id: "check", title: "Check your understanding", html: `<div data-demo="quiz"><div class="demo-body"></div></div>` },
      { id: "exercises", title: "Exercises", html: `
        <p>★ trace · ★★ apply · ★★★ prove or extend. Use Demos 7 and 8 to check your hand traces.</p>
        <h3>Exercise 1 ★ (is it AVL?)</h3>
        <p>For the BST built by inserting 8, 4, 12, 2, 6, 10, 1, 3 with no balancing, give every node's height and balance factor. Is it an AVL tree? Then insert 0 (still without balancing): which nodes become unbalanced, and which is the deepest?</p>
        ${sol(`<p>Before inserting 0 the tree is <code>8(4(2(1,3),6),12(10,-))</code>: heights 1, 3, 6, 10 → 0; 2 and 12 → 1; 4 → 2; 8 → 3. Balance: 2 → 0, 4 → +1, 12 → +1, 8 → +1, leaves 0. It is an AVL tree. After inserting 0 below 1: 1 → +1, 2 → +1, 4 → heights 2 and 0, <b>+2</b>; 8 → heights 3 and 1, <b>+2</b>. The deepest unbalanced node is 4.</p>`)}
        <h3>Exercise 2 ★ (insert)</h3>
        <p>Insert 8, 4, 12, 2, 6, 10, 1, 3, 0 into an empty AVL tree. Which insertion causes a rotation, of which kind, at which node? What is the final tree?</p>
        <h3>Exercise 3 ★★ (all four cases)</h3>
        <p>Insert 50, 25, 10, 5, 7, 3, 30, 20, 8, 15, 60, 70, 80 into an empty AVL tree, drawing the tree after each insertion. Name every rotation.</p>
        <h3>Exercise 4 ★★ (delete)</h3>
        <p>Build the AVL tree from 1, 2, …, 15 (a perfect tree with root 8). Then delete 1, 3, 2, 5, 7, 6 in this order. Which deletions cause rotations?</p>
        ${sol(`<p>The program answers Exercises 2–4. In Exercise 2 only the last key, 0, causes a rotation: left-left at 4, as Exercise 1 predicts. In Exercise 3 every case appears: 10 is left-left at 50, 7 left-right at 10, 3 left-left at 25, 15 right-left at 7, 80 right-right at 60. In Exercise 4, deleting 2 leaves 4 with nothing on the left and 6(5,7) on the right, and deleting 6 leaves 8 with the leaf 4 against 12(…) of height 2. Both times the child on the tall side has balance 0 (6, then 12): single rotations, the case only deletions produce.</p>${codeBlock(CODE.exerciseRuns)}${out("exerciseRuns")}`)}
        <h3>Exercise 5 ★★ (why not balance 0?)</h3>
        <p>Show that after an <em>insertion</em>, the child y of the deepest unbalanced node z never has balance factor 0.</p>
        ${sol(`<p>Say z became +2 because the new key went into its left subtree, rooted at y; y's height grew by 1. If y were the new leaf, z's left subtree would have height 0 and its right subtree −2: impossible. Otherwise the key went into one of y's subtrees, that subtree grew, and y's height grew with it — so the grown subtree is now <em>strictly</em> taller than the other (had they been equal after the growth, y's height would not have changed). So y has balance ±1, never 0. That is why the slides' insertion may decide the case by comparing x with y's key, and why balance 0 only matters in deletion.</p>`)}
        <h3>Exercise 6 ★★★ (Fibonacci trees)</h3>
        <p>Write <code>fibTree(h)</code> that builds a smallest AVL tree of height h with consecutive keys (left: a smallest tree of height h − 1; right: height h − 2). Check with <code>isAvl</code> that it is an AVL tree with N(h) = F(h + 3) − 1 nodes. Then delete its largest key and count the rotations. Why are Fibonacci trees the worst case for deletion?</p>
        ${sol(`${codeBlock(CODE.fibTrees)}${out("fibTrees")}<p>In a Fibonacci tree every inner node has balance +1: each right subtree is already as short as allowed. Deleting the largest key shortens the right spine; each rotation leaves its subtree one shorter, which tips the parent over: one rotation per level on the way up. (Inserting the keys level by level rebuilds the same tree with no rotations, because every intermediate tree is the Fibonacci tree cut off at some depth.) Try the “Fibonacci tree” preset in Demo 8.</p>`)}` },
      { id: "terms", title: "Key terms and further reading", html: `
        <p class="tags">${["balanced BST", "complete binary tree", "AVL tree", "height (empty tree −1)", "balance factor", "balance condition", "N(h)", "Fibonacci tree", "rotation", "single rotation", "double rotation", "left-left / right-right (outside)", "left-right / right-left (inside, dog-leg)", "deepest unbalanced node", "successor", "propagation"].map((t) => `<span class="tag">${t}</span>`).join("")}</p>
        <ul><li>T. H. Cormen et al., <em>Introduction to Algorithms</em> (CLRS), Chapter 12 and Problem 13-3.</li>
        <li>M. A. Weiss, <em>Data Structures and Algorithm Analysis in Java</em>, §4.4 AVL Trees. The code in these notes follows it.</li>
        <li>G. M. Adelson-Velsky and E. M. Landis, “An algorithm for the organization of information”, 1962 — the original paper.</li></ul>` },
    ],
    takeaways: ["AVL = BST + every balance in {−1, 0, +1}.", "Height O(log n) via N(h) = F(h+3) − 1.", "Insert: one rotation. Delete: may propagate. Both O(log n)."],
  },
];

const QUIZ = [
  { q: "Which tree is <b>not</b> an AVL tree?",
    opts: ["<code>2(1,3)</code>", "<code>3(2(1,-),4)</code>", "<code>3(1(-,2),-)</code>", "<code>5(3(2,4),7(-,9))</code>"],
    a: 2, why: "In <code>3(1(-,2),-)</code> the root has a left subtree of height 1 and an empty right subtree (−1): balance +2. The others have every balance in {−1, 0, +1}." },
  { q: "What is the minimum number of nodes in an AVL tree of height 5?",
    opts: ["12", "20", "32", "63"],
    a: 1, why: "N(5) = N(4) + N(3) + 1 = 12 + 7 + 1 = 20 (= F(8) − 1 = 21 − 1). 63 is the <em>maximum</em>, 2<sup>6</sup> − 1." },
  { q: "Insert 30 into the AVL tree <code>20(10,40(25,50))</code>. Which rebalancing happens?",
    opts: ["none", "right-right at 20: single rotation", "right-left at 20: double rotation", "left-left at 40: single rotation"],
    a: 2, why: "30 goes 20 → 40 → 25 → right. Node 20 gets heights 0 and 2: balance −2, the deepest unbalanced node (40 has +1). Right at 20, left at 40: right-left, a double rotation; 25 ends on top: <code>25(20(10,-),40(30,50))</code>." },
  { q: "Why does an insertion need at most one rebalancing?",
    opts: ["Because only the root can become unbalanced", "Because after the rotation the subtree has the same height as before the insertion, so nothing above it changes", "Because a double rotation fixes two nodes at once", "Because insertions only add leaves"],
    a: 1, why: "In all four cases the repaired subtree is exactly as tall as before the insertion, so every ancestor's height and balance are back to their old (valid) values." },
  { q: "During a deletion, z has balance −2 and its right child y has balance 0. What do we do?",
    opts: ["Single left rotation at z", "Double rotation (right at y, then left at z)", "Nothing: balance 0 means y is fine", "Rotate at y only"],
    a: 0, why: "Balance 0 at y only happens in deletions, and then the single left rotation always works: it leaves z with balance −1 and y with +1. A double rotation could leave y unbalanced." },
  { q: "What is the worst-case number of rotations in one AVL <b>deletion</b>?",
    opts: ["0", "1", "2", "O(log n)"],
    a: 3, why: "A rotation in deletion can leave its subtree one shorter, which can unbalance the parent, and so on up to the root: one rotation per level, O(log n) in total (the Fibonacci-tree example)." },
];
