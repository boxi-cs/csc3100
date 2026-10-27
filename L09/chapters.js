// Chapter content, adapted from notes/L09-stacks.md. Code and outputs come from CODE / OUT in demos.js.

const demo = (name, title, instr, hint = "") =>
  `<div class="card demo" data-demo="${name}"><div class="head"><span class="title">${title}</span><span>${instr}</span></div>
   <div class="demo-body"></div>${hint ? `<p class="hint">${hint}</p>` : ""}</div>`;

const callout = (kind, label, body) => `<div class="callout ${kind}"><b>${label}</b>${body}</div>`;
const predict = (q, a) => callout("predict", "PREDICT", `<p>${q}</p><details class="reveal"><summary>Show the answer</summary>${a}</details>`);
const out = (key) => codeBlock(OUT[key], "out");
const table = (head, rows) => `<div style="overflow-x:auto"><table><thead><tr>${head.map((h) => `<th>${h}</th>`).join("")}</tr></thead>
  <tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;

const LECTURE = {
  number: 9,
  title: "Stacks",
  tagline: "Last in, first out",
  lead: "Plates, the call stack, brackets and calculators — one simple rule, two implementations, two classic applications. Every push and pop here can be stepped through.",
  heroDemo: "lifoMini",
  heroLabel: "A live stack · push A, B, C, pop, push D, pop, pop",
  heroCaption: "Only the top can be touched. The last element in is the first one out.",
  whyTitle: "Why stacks are worth learning",
  whySub: "Three ideas you will use far beyond this lecture",
  why: [
    ["The rule behind every method call", "Each call pushes a <b>frame</b> on the call stack; each return pops one. Recursion is a stack in disguise."],
    ["O(1) with very little code", "On a linked list or an array, <b>push</b> and <b>pop</b> touch a fixed number of cells, however big the stack is."],
    ["A tool for nested structure", "Matching brackets, evaluating <b>postfix</b> expressions, undo, back buttons: whenever the latest unfinished thing must finish first."],
  ],
  ctaTitle: "Ready to push and pop?",
  minutes: "About 60–75 minutes",
  videos: {
    "media/L09-1.mp4": "Lecture 9 · Part 1 — What a stack is, on a linked list (8.4 min)",
    "media/L09-2.mp4": "Lecture 9 · Part 2 — A stack on an array (10.2 min)",
    "media/L09-3.mp4": "Lecture 9 · Part 3 — Balanced symbols (7.3 min)",
    "media/L09-4.mp4": "Lecture 9 · Part 4 — Evaluating postfix expressions (9.8 min)",
  },
};

const CHAPTERS = [
  {
    slug: "1-idea", nav: "The idea", title: "What Is a Stack?",
    subtitle: "One end, last in, first out",
    abstract: "A pile of plates and the call stack of a Java program follow the same rule: you can only add or remove at the top, so the newest element leaves first.",
    tags: ["LIFO", "push / pop / top", "call stack", "overflow"],
    hero: "lifoMini", heroCaption: "Push puts an element on the top; pop takes the top one off.",
    sections: [
      { id: "video-1", title: "Watch: What a stack is, on a linked list", html: `
        <div class="card video" data-video="media/L09-1.mp4"></div>` },
      { id: "examples", title: "Stacks you already know", html: `
        <p>Think of a pile of plates in a canteen, or a stack of food trays. Clean plates go on the top, and the next customer takes a plate from the top. Nobody pulls one out of the middle. The plate put on the pile <b>last</b> is taken <b>first</b>.</p>
        <p>Your programs already use a stack too. When a method is called, Java creates a <b>frame</b> (an <b>activation record</b>) holding its parameters and local variables. The frames of all methods that have started but not yet returned form the <b>call stack</b>: a call pushes a frame, a return pops the top frame, and only the top frame runs. For a recursive <code>f(n)</code> the frames of <code>f(n)</code>, <code>f(n - 1)</code>, <code>f(n - 2)</code>, … pile up and come off in the opposite order (Lecture 6).</p>
        <p>The frames also explain a classic surprise:</p>
        ${codeBlock(CODE.callStack)}
        ${predict("What do the two lines print?", `${out("callStack")}<p><code>change(sb)</code> pushes a new frame. Its parameter <code>text</code> is a new variable holding a <em>copy</em> of the reference in <code>sb</code>. Reassigning <code>text</code> changes only that copy; <code>append</code> then changes the new object. When <code>change</code> returns, its frame is popped and <code>main</code> carries on with its own <code>sb</code>, still <code>"Hello "</code>. (Without the reassignment, <code>text.append</code> would change the object both variables share, and <code>main</code> would see it.)</p>`)}
        ${demo("callStack", "Demo 1 · The call stack of CallStackDemo", "← → keys step", "Watch two frames, two variables and two objects. The frame pushed last, <code>change</code>, is the first one popped.")}
        ${callout("note", "NOTE", `<p>The slide uses <code>StringBuffer</code> and calls the class <code>test</code>. <code>StringBuilder</code> has the same methods and is the one to use in single-threaded code, and Java class names start with a capital letter.</p>`)}` },
      { id: "lifo", title: "Definition: last in, first out", html: `
        <p>A <b>stack</b> is a linear data structure in which elements are added and removed at one end only, the <b>top</b>. It follows the <b>Last-In-First-Out (LIFO)</b> rule: the element removed is always the one added most recently. (Some books say FILO, first in last out: the same rule.)</p>
        <p>There are only two ways to change a stack: <b>push(e)</b> puts <code>e</code> on the top, and <b>pop()</b> removes the top element and returns it. Everything else only looks. To reach an element below the top you must pop everything above it first.</p>
        ${predict("Start with an empty stack. Do <code>push(A)</code>, <code>push(B)</code>, <code>push(C)</code>, <code>pop()</code>, <code>push(D)</code>, <code>pop()</code>, <code>pop()</code>. Which elements do the three pops return, and what is left?",
          `<p>After the three pushes the stack is A B C, with C on top. The first pop returns <b>C</b>. D goes on top of B; the next pops return <b>D</b> and then <b>B</b>. Only <b>A</b> is left. C came out before D even though D is newer, because C was popped before D was pushed.</p>`)}
        ${demo("lifo", "Demo 2 · Push, pop, top", "edit the operations, then step", "Try your own sequence, for example <code>push 1 2 3, pop, pop, pop, pop</code>. The last pop is an underflow.")}` },
      { id: "ops", title: "The operations of the stack ADT", html: `
        ${table(["operation", "what it does", "if the stack is empty"], [
          ["<code>push(x)</code>", "put <code>x</code> on the top", "—"],
          ["<code>pop()</code>", "remove the top element and return it", "<b>underflow</b>: nothing to pop"],
          ["<code>top()</code>", "return the top element without removing it (Java's library calls it <code>peek</code>)", "nothing to return"],
          ["<code>isEmpty()</code>", "is the stack empty?", "<code>true</code>"],
          ["<code>size()</code>", "the number of elements", "0"],
          ["<code>makeEmpty()</code>", "remove all elements", "—"]])}
        <p>Popping or reading the top of an empty stack is <b>underflow</b>. A stack with a fixed capacity can also <b>overflow</b>: pushing onto a full stack. Our classes follow the slides and return <code>null</code> on underflow and <code>false</code> on overflow; Java's library classes throw an exception. Either way, the caller should check <code>isEmpty()</code> first.</p>` },
      { id: "kinds", title: "Fixed-size and dynamic-size stacks", html: `
        <ul><li>A <b>fixed-size stack</b> has a capacity chosen when it is created. Once full, a push <b>overflows</b>. It is usually stored in a plain array.</li>
        <li>A <b>dynamic-size stack</b> grows when it is full and can shrink as elements are removed. It is stored in a <b>linked list</b>, which grows and shrinks one node at a time, or in a <b>dynamic array</b> (Java's <code>ArrayList</code>, C++'s <code>vector</code>), which moves to a bigger array when it runs out of room.</li></ul>
        <p>Chapter 2 builds the linked-list stack; Chapter 3 builds the fixed array stack and then a growing one.</p>` },
    ],
    takeaways: ["Only the top can be touched: LIFO.", "push and pop change it; top, isEmpty, size look.", "Underflow on empty; overflow on a full fixed stack."],
  },
  {
    slug: "2-linked", nav: "Linked list", title: "A Stack on a Linked List",
    subtitle: "The top is the first node",
    abstract: "Insert and delete at the front of a singly linked list cost O(1). Put the top of the stack there, behind a header node, and push and pop are four-line methods.",
    tags: ["header node", "push", "pop", "O(1)"],
    hero: "linkedMini", heroCaption: "push 11, 22, 33, then pop them: the newest node is always right after the header.",
    sections: [
      { id: "header", title: "Nodes and the header node", html: `
        <p>Each element lives in a <b>node</b> that also holds a reference to the next node. The top of the stack is the <b>first</b> node, because the front of a singly linked list is where inserting and deleting take O(1) time (Lecture 7).</p>
        <p>Like the slides, we put a <b>header node</b> (a dummy node with no element) in front. The field <code>head</code> always refers to the header, and <code>head.next</code> is the top, or <code>null</code> when the stack is empty. So push and pop never change <code>head</code>, only <code>head.next</code>.</p>` },
      { id: "push", title: "Push", html: `
        <p>Make a new node holding <code>x</code>, make it point to the old top (<code>head.next</code>), and make the header point to the new node:</p>
        ${codeBlock(CODE.linkedPush)}
        ${callout("pitfall", "PITFALL · THE ORDER OF THE TWO LINKS", `<p>If you write <code>head.next = tmpNode</code> first, the only reference to the old top is overwritten, and <code>tmpNode.next = head.next</code> then makes the new node point to <em>itself</em>: the rest of the stack is lost.</p>`)}
        <p>Push touches a fixed number of references whatever the size of the stack: <b>O(1)</b>.</p>` },
      { id: "pop", title: "Pop and top", html: `
        <p>To pop: remember the first node, make the header skip it, return its element. This is "delete the first node" of a linked list. <code>top</code> returns the first element without unlinking it.</p>
        ${codeBlock(CODE.linkedPopTop)}
        <p>The unlinked node is unreachable, so the garbage collector reclaims it. Both methods are <b>O(1)</b>.</p>
        ${demo("linked", "Demo 3 · Re-linking nodes", "edit the operations, then step", "Amber arrows are the reference that just changed. On push, nothing in the stack changes until line 5; on pop, the old top is cut off at line 14.")}` },
      { id: "class", title: "The whole class", html: `
        <p>The complete class adds the operations the slides list but do not write: <code>isEmpty</code> (the header points to nothing), <code>size</code> (a counter kept by push and pop, so O(1) too) and <code>makeEmpty</code>. <code>toString</code> lists the elements from the top down.</p>
        ${codeBlock(CODE.linkedClass)}
        ${callout("note", "NOTE", `<p>The slides store <code>Object</code> elements. These notes use a <b>generic</b> type parameter <code>E</code>, so a <code>LinkedStack&lt;Integer&gt;</code> accepts only integers and <code>pop()</code> returns an <code>Integer</code> without a cast. The algorithm is the same.</p>`)}
        ${codeBlock(CODE.linkedDemo)}
        ${out("linkedDemo")}` },
    ],
    takeaways: ["Top = first node after the header.", "Push and pop = insert and delete at the front.", "O(1) each; no capacity limit."],
  },
  {
    slug: "3-array", nav: "Array", title: "A Stack on an Array",
    subtitle: "topOfStack, overflow, and growing by doubling",
    abstract: "Keep the elements in an array, bottom at index 0, and one integer that says where the top is. Push and pop are one line each. A doubling array removes the capacity limit and still costs O(1) per push on average.",
    tags: ["topOfStack", "isFull", "doubling", "amortised O(1)", "ArrayDeque"],
    hero: "arrayMini", heroCaption: "topOfStack moves up on push and down on pop.",
    sections: [
      { id: "video-2", title: "Watch: A stack on an array", html: `
        <div class="card video" data-video="media/L09-2.mp4"></div>` },
      { id: "fields", title: "Fields and constructor", html: `
        <p>The array holds the elements, bottom element at index 0. The integer <code>topOfStack</code> is the <b>index of the top element</b>; an empty stack has <code>topOfStack = -1</code>, so the size is always <code>topOfStack + 1</code>.</p>
        ${callout("pitfall", "SLIDE ERRATUM · WHAT topOfStack MEANS", `<p>Slides 12–15 say that <code>topOfStack</code> "records the current number of elements". It does not: it is the <em>index</em> of the top element, one less than the number of elements. With 1, 2, 3 in cells 0, 1, 2, <code>topOfStack</code> is 2 while the stack holds 3 elements, and an empty stack has −1, not 0. That is why push writes <code>array[++topOfStack]</code> (move up, then store) and pop reads <code>array[topOfStack--]</code> (read, then move down).</p>`)}
        ${codeBlock(CODE.arrayHead)}
        <p>The constructor never makes an array smaller than <code>MIN_STACK_SIZE = 5</code>: asking for 2 cells gives 5. (Java cannot create an array of a type parameter, so we create an <code>Object[]</code> and cast it; the annotation silences the warning. With the slides' <code>Object[]</code> no cast is needed.) The stack is full when the top sits in the last cell, index <code>array.length - 1</code>.</p>
        ${callout("note", "NOTE", `<p>The pictures on slides 13–14 show a stack with capacity 4, which this class cannot make: <code>new ArrayStack&lt;&gt;(4)</code> gets 5 cells. Demo 4 applies the rule.</p>`)}` },
      { id: "ops", title: "Push, pop and top", html: `
        ${codeBlock(CODE.arrayOps)}
        <p>Each method does a comparison, an array access and an increment or decrement: <b>O(1)</b>.</p>
        ${predict("On an empty stack with capacity 5, do <code>push(1)</code>, <code>push(2)</code>, <code>push(3)</code>, <code>top()</code>, <code>pop()</code>. What is <code>topOfStack</code> after each?",
          `${table(["operation", "topOfStack before", "cell", "topOfStack after", "stack (bottom → top)"], [
            ["<code>push(1)</code>", "−1", "<code>array[0] = 1</code>", "0", "1"],
            ["<code>push(2)</code>", "0", "<code>array[1] = 2</code>", "1", "1 2"],
            ["<code>push(3)</code>", "1", "<code>array[2] = 3</code>", "2", "1 2 3"],
            ["<code>top()</code>", "2", "read <code>array[2]</code> → 3", "2", "1 2 3"],
            ["<code>pop()</code>", "2", "read <code>array[2]</code> → 3", "1", "1 2"]])}`)}
        ${demo("array", "Demo 4 · The array stack", "set maxElements and operations, then step", "With the default operations the stack fills up at 5 and <code>push(7)</code> returns false. Switch to <b>GrowingArrayStack</b> to watch the array double instead.")}
        ${callout("pitfall", "PITFALL · ++ ON THE WRONG SIDE", `<p><code>array[topOfStack++] = x</code> stores at the <em>old</em> index and then moves up. Starting from −1, the first push writes to <code>array[-1]</code> and throws <code>ArrayIndexOutOfBoundsException</code>. Prefix <code>++</code> in push, postfix <code>--</code> in pop: mirror images.</p>`)}
        <p>The slide's pop is <code>return array[topOfStack--];</code>. It works, but leaves a reference to the popped object in the array, so the garbage collector cannot reclaim it until the cell is overwritten (a "loitering" reference). Setting the cell to <code>null</code> fixes that.</p>` },
      { id: "class", title: "The whole class", html: `
        ${codeBlock(CODE.arrayClass)}
        <p><code>makeEmpty</code> clears the cells one by one, which is O(n). Setting <code>topOfStack = -1</code> alone would be O(1) but would leave every element reachable from the array.</p>
        ${codeBlock(CODE.arrayDemo)}
        ${out("arrayDemo")}
        <p>The sixth push overflows: <code>push</code> returns <code>false</code> and nothing changes. <code>LinkedStack.toString</code> prints the top first and <code>ArrayStack.toString</code> the bottom first; both describe the same kind of stack.</p>` },
      { id: "growing", title: "A dynamic array: grow when full", html: `
        <p>A fixed capacity is a nuisance: too small and pushes fail, too large and memory is wasted. A <b>dynamic array</b> removes the limit. When a push finds the array full, it allocates an array <b>twice as large</b> and copies the elements over. To give memory back, a pop that leaves the array a quarter full halves it.</p>
        ${codeBlock(CODE.growing)}
        ${codeBlock(CODE.growingDemo)}
        ${out("growingDemo")}
        <p><b>Why is this still fast?</b> One push can cost O(n) when it triggers a copy, but copies are rare: after a copy to capacity 2k, the next one comes only after another k pushes. Over <span class="math">n</span> pushes the copies move at most 4 + 8 + … + n &lt; 2n elements (28 &lt; 34 above), so the total work is O(n): <b>amortised O(1)</b> per push.</p>
        ${demo("growth", "Demo 5 · Doubling vs growing by one", "drag n")}
        <ul><li>The array must grow by a <b>factor</b>. Growing by one cell copies 1 + 2 + … + n ≈ n²/2 elements.</li>
        <li>Shrink at <b>one quarter</b>, not one half. Otherwise a stack sitting at the boundary could alternate push, pop, push, pop and copy the whole array every time.</li></ul>` },
      { id: "compare", title: "Linked list or array?", html: `
        ${table(["", "linked list", "fixed array", "growing array"], [
          ["push / pop / top", "O(1)", "O(1)", "O(1) amortised (one push may be O(n))"],
          ["capacity", "unlimited", "fixed: push can overflow", "unlimited"],
          ["memory per element", "element + <code>next</code> + object header", "element only", "element only"],
          ["unused memory", "none", "the empty cells", "up to 3/4 after shrinking, 1/2 after growing"],
          ["layout", "nodes scattered in memory", "one contiguous block", "one contiguous block"]])}
        <p>The slides summarise this as "a list saves space, an array is faster". Both halves need care.</p>
        <ul><li><b>Space.</b> A list never reserves unused cells, so it beats a large, mostly empty array. But each node costs more than a cell: a <code>next</code> reference and an object header on top of the element. For a mostly full stack the array uses <em>less</em> memory.</li>
        <li><b>Speed.</b> Both are O(1), so the difference is a constant factor, and it is real. A list push <b>allocates</b> a node every time; an array push writes into a cell that already exists. And an array is one <b>contiguous</b> block: loading one cell brings its neighbours into the <b>cache</b>, so the next push or pop usually finds its cell there. Linked nodes can be anywhere, and each may be a cache miss.</li></ul>
        <p>In practice, array-based stacks (with growing) are the usual choice.</p>` },
      { id: "library", title: "Stacks in the Java library", html: `
        <p><code>java.util.Stack&lt;E&gt;</code> is an old class (it extends <code>Vector</code>); its documentation recommends the <code>Deque&lt;E&gt;</code> interface instead, implemented by <code>ArrayDeque&lt;E&gt;</code>, a growing circular array. Its <code>push</code>, <code>pop</code> and <code>peek</code> work on the front, so it behaves as a stack.</p>
        ${codeBlock(CODE.library)}
        ${out("library")}
        <p>Unlike our classes, the library's <code>pop</code> signals underflow with an exception, while <code>peek</code> returns <code>null</code>. This program stops with <code>java.util.NoSuchElementException</code>:</p>
        ${codeBlock(CODE.libraryUnderflow)}
        ${out("libraryUnderflow")}` },
    ],
    takeaways: ["topOfStack = index of the top; size = topOfStack + 1.", "Doubling gives amortised O(1) push.", "Arrays: less memory when full, cache-friendly, no allocation."],
  },
  {
    slug: "4-balanced", nav: "Brackets", title: "Balanced Symbols",
    subtitle: "A closing symbol must match the latest opener",
    abstract: "Counting brackets is not enough: ( ] and ( [ ) ] have the right counts but are wrong. A stack remembers which opener is still waiting, newest on top.",
    tags: ["( [ {", "push openers", "match on pop", "O(n)"],
    hero: "balancedMini", heroCaption: "( { [ ] } ): every closer pops its own opener.",
    sections: [
      { id: "video-3", title: "Watch: Balanced symbols", html: `
        <div class="card video" data-video="media/L09-3.mp4"></div>` },
      { id: "problem", title: "The problem", html: `
        <p>Programs are full of symbols that come in pairs: <code>( )</code>, <code>[ ]</code>, <code>{ }</code>. A compiler must check that every opening symbol is closed by the matching closing symbol, in the right order. This C fragment is balanced; its symbols, in order, are <code>( ) { [ ] }</code>:</p>
        ${codeBlock(CODE.cCode)}
        ${table(["balanced", "unbalanced", "why unbalanced"], [
          ["<code>( ) { [ ] }</code>", "<code>( ]</code>", "<code>]</code> closes a <code>(</code>"],
          ["<code>( { { } } )</code>", "<code>( ) { ( [ ] ) } ]</code>", "the last <code>]</code> has nothing to close"],
          ["<code>( { [ ] } )</code>", "<code>( ) [ [ ] { }</code>", "one <code>[</code> is never closed"]])}
        <p>Counting is not enough: <code>( ]</code> has one opener and one closer, and <code>( [ ) ]</code> has the right count of each kind, but the pairs cross.</p>` },
      { id: "algorithm", title: "The observation and the algorithm", html: `
        <p>Read the symbols from left to right. An <b>opening</b> symbol can never make the text unbalanced by itself: it just waits to be closed. A <b>closing</b> symbol must close the <b>most recent opener that is still open</b>. "The most recent one still waiting" is exactly what a stack gives you.</p>
        ${callout("pattern", "ALGORITHM", `<ol><li>Make an empty stack.</li>
          <li>Read the symbols one by one.<ul><li><b>Opening symbol:</b> push it.</li>
          <li><b>Closing symbol:</b> if the stack is empty, return <i>false</i>. Otherwise pop; if the popped symbol does not match, return <i>false</i>.</li>
          <li>Any other character: ignore it.</li></ul></li>
          <li>At the end, return <i>true</i> if the stack is empty, <i>false</i> otherwise.</li></ol>`)}
        ${table(["read", "action", "stack after (bottom → top)"], [
          ["<code>(</code>", "opening: push", "<code>(</code>"], ["<code>{</code>", "opening: push", "<code>( {</code>"], ["<code>[</code>", "opening: push", "<code>( { [</code>"],
          ["<code>]</code>", "closing: pop <code>[</code>, matches", "<code>( {</code>"], ["<code>}</code>", "closing: pop <code>{</code>, matches", "<code>(</code>"],
          ["<code>)</code>", "closing: pop <code>(</code>, matches", "(empty)"], ["end", "the stack is empty", "<b>balanced</b>"]])}` },
      { id: "practice", title: "Practice", html: `
        ${predict("Trace <code>{ ( ] [ ] ) }</code> and <code>( ) [ [ ] { }</code>. Where does each one fail?",
          `<p><code>{ ( ] [ ] ) }</code>: push <code>{</code>, push <code>(</code>; then <code>]</code> pops <code>(</code>, which does not match. Return <i>false</i> immediately; the rest is never read.</p>
          <p><code>( ) [ [ ] { }</code>: push <code>(</code>, <code>)</code> pops it; push <code>[</code>, push <code>[</code>; <code>]</code> pops one; push <code>{</code>, <code>}</code> pops it. Every closer matched, but one <code>[</code> is left: <i>false</i>.</p>
          <p>The three ways to fail: a closer that does not match the popped opener, a closer when the stack is empty, and a non-empty stack at the end.</p>`)}
        ${demo("balanced", "Demo 6 · Check the brackets", "pick an example or type your own", "Try the slide examples, the C code, and <code>( [ ) ]</code>. Characters that are not brackets are skipped.")}` },
      { id: "java", title: "In Java", html: `
        ${codeBlock(CODE.balanced)}
        ${out("balanced")}
        <p><b>Cost.</b> Each character is read once and causes at most one push or pop: <b>O(n)</b> time. In the worst case (all openers) the stack holds n symbols: <b>O(n)</b> extra space.</p>
        ${callout("pitfall", "PITFALL", `<p><b>Forgetting the final check.</b> Returning <code>true</code> after the loop instead of <code>stack.isEmpty()</code> accepts <code>( ) [ [ ] { }</code> and even <code>(((</code>. <b>Popping without checking for an empty stack</b> fails on <code>)</code>: our <code>pop</code> returns <code>null</code>, and unboxing <code>null</code> into a <code>char</code> throws a <code>NullPointerException</code>.</p>`)}
        <p>A real compiler also has to skip brackets inside string literals and comments, but the stack is the core of the check.</p>` },
    ],
    takeaways: ["Push openers; a closer pops and must match.", "Fail on mismatch, on empty, or on leftovers.", "O(n) time, O(n) space."],
  },
  {
    slug: "5-postfix", nav: "Expressions", title: "Evaluating Expressions",
    subtitle: "Infix, postfix, and a stack of values",
    abstract: "In postfix each operator comes after its operands, so no parentheses or precedence rules are needed. Reading left to right, every operator applies to the two latest values: a stack.",
    tags: ["precedence", "infix → postfix", "postfix evaluation", "O(n)"],
    hero: "evalMini", heroCaption: "6 2 / 3 - 4 2 * +: operands are pushed, operators pop two and push one.",
    sections: [
      { id: "video-4", title: "Watch: Evaluating postfix expressions", html: `
        <div class="card video" data-video="media/L09-4.mp4"></div>` },
      { id: "rules", title: "Operators, precedence, associativity", html: `
        <p>An expression such as <code>a / b - c + d * e - a * c</code> is made of <b>operands</b> (<code>a</code>, <code>b</code>, …) and <b>operators</b> (<code>+ - * /</code>). Two rules fix its meaning:</p>
        <ul><li><b>Precedence</b>: <code>*</code> and <code>/</code> share one level, <code>+</code> and <code>-</code> another, and <code>*</code>, <code>/</code> bind more tightly.</li>
        <li><b>Associativity</b>: all four are <b>left-associative</b>: among equals, the leftmost goes first. <code>8 - 3 - 2</code> is <code>(8 - 3) - 2 = 3</code>, not 7.</li></ul>
        <p>So the expression means <code>(((a / b) - c) + (d * e)) - (a * c)</code>. <b>Parentheses</b> override precedence: <code>a * (b + c)</code> adds first.</p>` },
      { id: "postfix", title: "Infix and postfix", html: `
        <p>Writing each binary operator <em>between</em> its operands is <b>infix</b>: it needs parentheses and precedence rules. In <b>postfix</b> (<b>reverse Polish notation</b>) each operator comes <b>after</b> its two operands: <code>2 + 3</code> is <code>2 3 +</code>. Postfix needs <b>no parentheses and no precedence rules</b>, which is why compilers translate expressions into a postfix-like form.</p>
        ${table(["infix", "postfix"], [["<code>2 + 3 * 4</code>", "<code>2 3 4 * +</code>"], ["<code>2 * 3 + 4</code>", "<code>2 3 * 4 +</code>"], ["<code>2 * 3 * 4</code>", "<code>2 3 * 4 *</code>"], ["<code>(2 + 3) * 4</code>", "<code>2 3 + 4 *</code>"], ["<code>a / b - c + d * e - a * c</code>", "<code>a b / c - d e * + a c * -</code>"]])}
        <p>Operands must be separated by spaces (<code>2 3</code> is two operands, <code>23</code> is one). The operands keep their infix order; only the operators move.</p>` },
      { id: "derive", title: "Deriving the postfix form by hand", html: `
        <p>Find the operator applied <b>last</b> (the lowest-precedence operator outside all parentheses; among equals, the rightmost). Its operands are the parts on its left and right. Then</p>
        <div class="math-block">postfix(left op right) = postfix(left) &nbsp;postfix(right) &nbsp;op</div>
        <p>and an operand on its own is its own postfix form. For <code>7 / (2 + 3) * 4</code> the last operator is <code>*</code>: postfix = postfix(<code>7 / (2 + 3)</code>) <code>4 *</code> = <code>7</code> postfix(<code>2 + 3</code>) <code>/ 4 *</code> = <b><code>7 2 3 + / 4 *</code></b>.</p>
        ${predict("What is the postfix form of <code>2 * (3 + 2 * 4)</code>?", `<p>The last operator is the first <code>*</code>; its operands are <code>2</code> and <code>(3 + 2 * 4)</code>. Inside, <code>+</code> is last: <code>3</code> postfix(<code>2 * 4</code>) <code>+</code> = <code>3 2 4 * +</code>. So the answer is <b><code>2 3 2 4 * + *</code></b>.</p>`)}
        <p>In Java the same recursion runs on an <b>expression tree</b>: each operator is a node whose two children are its operands (trees come in Lecture 13). <code>parse</code> builds the tree with the precedence and associativity rules; <code>postfix</code> is the three-line rule.</p>
        ${demo("derive", "Demo 7 · The recursive derivation", "pick or type an infix expression", "The root is the operator applied last. Each call returns postfix(left) postfix(right) op; leaves return themselves.")}
        <details class="reveal"><summary>Show the whole class (parser included) and its output</summary>${codeBlock(CODE.infix)}${codeBlock(CODE.infixDemo)}${out("infixDemo")}<p><code>parse</code> assumes a correct expression. Converting with a <b>stack of operators</b> instead is Exercise 8.</p></details>` },
      { id: "evaluate", title: "Evaluating postfix with a stack", html: `
        <p>Reading postfix left to right, each operator applies to the <b>two most recent values</b> not yet used. A stack holds exactly those.</p>
        ${callout("pattern", "ALGORITHM", `<ol><li>Make an empty stack.</li><li>Scan the expression from left to right.<ul>
          <li><b>Operand:</b> push it.</li><li><b>Operator:</b> pop the <b>right</b> operand, then the <b>left</b> one, compute left <i>op</i> right, push the result.</li></ul></li>
          <li>At the end the result is the only value on the stack.</li></ol>`)}
        <p>The first value popped was pushed last, so it is the <b>right</b> operand: for <code>8 2 -</code> the pops give 2 and then 8, and the result is 8 − 2 = 6.</p>
        ${table(["read", "action", "stack after"], [["6", "push", "6"], ["2", "push", "6 2"], ["/", "pop 2, pop 6, push 6 / 2 = 3", "3"], ["3", "push", "3 3"], ["-", "pop 3, pop 3, push 0", "0"], ["4", "push", "0 4"], ["2", "push", "0 4 2"], ["*", "pop 2, pop 4, push 8", "0 8"], ["+", "pop 8, pop 0, push 8", "8"], ["end", "the answer", "<b>8</b>"]])}
        ${predict("Evaluate <code>2 3 2 4 * + *</code>. What is the largest number of values on the stack at any moment?", `<p>Push 2, 3, 2, 4 (four values, the most). <code>*</code>: 2 · 4 = 8, stack 2 3 8. <code>+</code>: 3 + 8 = 11, stack 2 11. <code>*</code>: 2 · 11 = <b>22</b>.</p>`)}
        ${demo("evalPostfix", "Demo 8 · Evaluate postfix", "pick or type a postfix expression", "Try <code>8 2 -</code> to see the pop order, <code>3 +</code> and <code>3 4</code> for malformed input, and <code>4 0 /</code>.")}` },
      { id: "java", title: "In Java", html: `
        <p>Tokens are separated by spaces. The operands are <code>int</code>s, so <code>/</code> is integer division, rounding towards zero.</p>
        ${codeBlock(CODE.evaluator)}
        ${codeBlock(CODE.postfixDemo)}
        ${out("postfixDemo")}
        <p><code>7 2 3 + / 4 *</code> gives 4, not 5.6, because 7 / 5 is 1 in integer arithmetic. A malformed expression is caught by the stack: with too few operands an operator finds it empty, with too many more than one value is left.</p>
        ${codeBlock(CODE.badPostfix)}
        ${out("badPostfix")}
        <p>The second call stops with <code>IllegalArgumentException: missing operand for +</code>; <code>"3 4"</code> would stop with <code>not a single expression</code>.</p>
        <p><b>Cost.</b> Each token causes one push, or two pops and a push: <b>O(n)</b> time, at most n values on the stack.</p>
        ${callout("pitfall", "PITFALL · THE ORDER OF THE POPS", `<p><code>int left = stack.pop(); int right = stack.pop();</code> looks natural but swaps the operands: <code>8 2 -</code> would give −6. Addition and multiplication hide the bug, so always test with <code>-</code> and <code>/</code>.</p>`)}` },
    ],
    takeaways: ["Postfix: operator after operands, no parentheses.", "postfix(l op r) = postfix(l) postfix(r) op.", "Evaluate: push operands; operator pops right, then left."],
  },
  {
    slug: "6-summary", nav: "Summary", title: "Summary and Practice",
    subtitle: "Check yourself, then write some stacks",
    abstract: "A one-page map of the lecture, a self-check quiz, nine exercises with solutions, and the key terms.",
    tags: ["knowledge map", "self-check", "exercises"],
    hero: "toc",
    sections: [
      { id: "map", title: "Knowledge map", html: `<div class="map">
        <div class="card"><h3>The stack ADT</h3><ul><li>Access only at the <b>top</b>: LIFO</li><li><code>push</code>, <code>pop</code> change it</li><li><code>top</code>, <code>isEmpty</code>, <code>size</code> look</li><li>Underflow · overflow</li></ul></div>
        <div class="card"><h3>Linked list</h3><ul><li>Top = first node after the header</li><li>Push / pop at the front: O(1)</li><li>No capacity limit</li><li>Extra <code>next</code> per element</li></ul></div>
        <div class="card"><h3>Array</h3><ul><li><code>topOfStack</code> = index of top, −1 if empty</li><li><code>array[++topOfStack] = x</code></li><li><code>array[topOfStack--]</code></li><li>Fixed: overflow · doubling: amortised O(1)</li></ul></div>
        <div class="card"><h3>Which one?</h3><ul><li>Array: no allocation per push, cache-friendly</li><li>List: never reserves unused cells</li><li>Java: <code>Deque&lt;E&gt; s = new ArrayDeque&lt;&gt;()</code></li></ul></div>
        <div class="card"><h3>Balanced symbols</h3><ul><li>Push openers</li><li>Closer pops; must match</li><li>Stack empty at the end</li><li>O(n)</li></ul></div>
        <div class="card"><h3>Expressions</h3><ul><li>Precedence + left-associativity</li><li>Postfix: no parentheses</li><li>Evaluate: push operands; operator pops right, left</li><li>O(n)</li></ul></div></div>` },
      { id: "check", title: "Check your understanding", html: `<div data-demo="quiz"><div class="demo-body"></div></div>` },
      { id: "exercises", title: "Exercises", html: `
        <p>★ trace by hand · ★★ write code · ★★★ design. Every program below has been compiled and run.</p>
        <h3>Exercise 1 ★ (trace)</h3><p>What does this program print?</p>
        ${codeBlock(CODE.ex1)}
        <details class="reveal"><summary>Solution</summary>${out("ex1")}<p>After <code>a b</code>, pop prints <code>b</code>. Push <code>c d</code>: the stack is <code>a c d</code>; pops print <code>d</code>, <code>c</code>. Push <code>e</code>: <code>a e</code>; the loop prints <code>e</code>, <code>a</code>.</p></details>
        <h3>Exercise 2 ★ (trace)</h3><p>An <code>ArrayStack&lt;Integer&gt;</code> is created with <code>new ArrayStack&lt;&gt;(3)</code>. Give its capacity and <code>topOfStack</code> after each of <code>push(7)</code>, <code>push(8)</code>, <code>pop()</code>, <code>push(9)</code>, <code>push(10)</code>, <code>push(11)</code>, <code>push(12)</code>, <code>push(13)</code>. Which push returns <code>false</code>?</p>
        <details class="reveal"><summary>Solution</summary><p>Capacity 5 (raised to <code>MIN_STACK_SIZE</code>). <code>topOfStack</code> goes 0, 1, 0, 1, 2, 3, 4; then <code>push(13)</code> finds the stack full, returns <code>false</code>, and <code>topOfStack</code> stays 4. The stack is 7 9 10 11 12. (Check it in Demo 4.)</p></details>
        <h3>Exercise 3 ★ (trace)</h3><p>Trace the balanced-symbols algorithm on <code>[ ( ) ] { ( } )</code>. Where does it stop, and why?</p>
        <details class="reveal"><summary>Solution</summary><p>Push <code>[</code>, <code>(</code>; <code>)</code> pops <code>(</code>; <code>]</code> pops <code>[</code>; push <code>{</code>, <code>(</code>; then <code>}</code> pops <code>(</code>, which does <b>not</b> match. It returns <i>false</i> at the seventh symbol. (It is a preset in Demo 6.)</p></details>
        <h3>Exercise 4 ★ (convert)</h3><p>Convert to postfix: (a) <code>(a + b) * (c - d) / e</code>; (b) <code>a - b * c + d</code>; (c) <code>a * (b - (c + d))</code>.</p>
        <details class="reveal"><summary>Solution</summary><p>(a) <code>a b + c d - * e /</code> (the <code>/</code> is applied last). (b) <code>a b c * - d +</code>. (c) <code>a b c d + - *</code>. Check them in Demo 7.</p></details>
        <h3>Exercise 5 ★ (evaluate)</h3><p>Evaluate <code>5 1 2 + 4 * + 3 -</code> with a stack. Show the stack after each operator.</p>
        <details class="reveal"><summary>Solution</summary><p>After <code>+</code>: 5 3. After <code>*</code>: 5 12. After <code>+</code>: 17. Push 3, then <code>-</code>: <b>14</b>. It is the postfix form of <code>5 + (1 + 2) * 4 - 3</code>.</p></details>
        <h3>Exercise 6 ★★</h3><p>Write <code>reverse(String s)</code> that reverses a string using a stack of characters.</p>
        <details class="reveal"><summary>Solution</summary><p>Push every character, then pop them all: they come out in reverse order.</p>${codeBlock(CODE.reverse)}${out("reverse")}</details>
        <h3>Exercise 7 ★★★</h3><p>Two stacks in one array: implement two stacks sharing one array of capacity n, so that a push fails only when the <em>whole</em> array is full. <i>Hint:</i> one stack grows from the left end, the other from the right.</p>
        <details class="reveal"><summary>Solution</summary><p>Stack 0 keeps its top at <code>top0</code> (from −1, growing up); stack 1 at <code>top1</code> (from n, growing down). The array is full when the tops are next to each other.</p>${codeBlock(CODE.twoStacks)}${out("twoStacks")}</details>
        <h3>Exercise 8 ★★★</h3><p>Infix to postfix with a stack (Weiss §3.6.3). Scan left to right. Write each operand to the output at once. Keep operators and <code>(</code> on a stack: for an operator, first pop to the output every operator with <b>greater or equal</b> precedence (stop at <code>(</code>), then push it; for <code>(</code>, push; for <code>)</code>, pop to the output until the <code>(</code> and discard both. At the end pop everything left. Check it against the table in Chapter 5.</p>
        <details class="reveal"><summary>Solution</summary><p>"Greater or equal" makes equal operators leave in left-to-right order: left-associativity.</p>${codeBlock(CODE.shunting)}${out("shunting")}<p>With <code>PostfixEvaluator</code> this is a complete calculator: infix → postfix → value, with two stacks.</p></details>
        <h3>Exercise 9 ★★★</h3><p>Design a stack of integers with <code>push</code>, <code>pop</code> and <code>getMin()</code> (the smallest element currently in the stack), all O(1).</p>
        <details class="reveal"><summary>Solution</summary><p>Keep a second stack holding, for every element, the minimum at the moment it was pushed. Its top is the current minimum, and popping both together restores the previous one.</p>${codeBlock(CODE.minStack)}${out("minStack")}</details>` },
      { id: "terms", title: "Key terms and further reading", html: `
        <p class="tags">${["stack", "top", "LIFO (FILO)", "push", "pop", "top / peek", "underflow", "overflow", "header node", "topOfStack", "fixed-size stack", "dynamic-size stack", "dynamic array", "amortised O(1)", "call stack", "frame (activation record)", "balanced symbols", "operand", "operator", "precedence", "associativity", "infix", "postfix (reverse Polish)", "expression tree"].map((t) => `<span class="tag">${t}</span>`).join("")}</p>
        <ul><li>M. A. Weiss, <em>Data Structures and Algorithm Analysis in Java</em>, 3rd ed., §3.6 The Stack ADT: implementations, balancing symbols, postfix expressions, infix-to-postfix conversion, method calls.</li>
        <li>T. H. Cormen et al., <em>Introduction to Algorithms</em>, 4th ed., §10.1 (stacks and queues on arrays) and Chapter 16 (amortised analysis, for the doubling array).</li>
        <li>The Java documentation of <code>java.util.Deque</code> and <code>java.util.ArrayDeque</code>.</li></ul>` },
    ],
    takeaways: ["LIFO: one end, O(1) push and pop.", "List or array; doubling keeps it amortised O(1).", "Brackets and postfix: the latest unfinished thing first."],
  },
];

const QUIZ = [
  { q: "A stack is empty. After <code>push(1)</code>, <code>push(2)</code>, <code>pop()</code>, <code>push(3)</code>, <code>push(4)</code>, <code>pop()</code>, what does <code>top()</code> return?",
    opts: ["1", "2", "3", "4"],
    a: 2, why: "The pops remove 2 and then 4. The stack is 1 3 (size 2), with 3 on top." },
  { q: "In <code>ArrayStack</code>, the stack holds 4 elements. What is <code>topOfStack</code>?",
    opts: ["4", "3", "5", "−1"],
    a: 1, why: "<code>topOfStack</code> is the <em>index</em> of the top element (cells 0–3), not the number of elements. The size is <code>topOfStack + 1</code>. (Slides 12–15 describe it wrongly.)" },
  { q: "Why is the top of a linked-list stack the <b>first</b> node, not the last?",
    opts: ["Because the last node has no <code>next</code>", "Because inserting and deleting at the front of a singly linked list is O(1); deleting the last node needs the node before it, which takes O(n) to find", "Because Java requires it", "It does not matter: both ends are O(1)"],
    a: 1, why: "Push and pop are insert-at-front and delete-at-front. Popping at the tail of a singly linked list would have to walk the whole list to find the new last node." },
  { q: "Which of these is balanced?",
    opts: ["<code>[ ( ] )</code>", "<code>{ [ ( ) ] }</code>", "<code>( ( )</code>", "<code>) (</code>"],
    a: 1, why: "<code>[ ( ] )</code> fails at <code>]</code> (it pops <code>(</code>); <code>( ( )</code> leaves a <code>(</code>; <code>) (</code> fails at once on an empty stack." },
  { q: "What is the postfix form of <code>(a + b) * c - d</code>?",
    opts: ["<code>a b c + * d -</code>", "<code>a b + c * d -</code>", "<code>a b + c d - *</code>", "<code>- * + a b c d</code>"],
    a: 1, why: "The last operator is <code>-</code>: postfix(<code>(a + b) * c</code>) <code>d -</code> = <code>a b + c * d -</code>. (The last option is prefix notation.)" },
  { q: "Evaluating <code>9 3 / 2 -</code>, which value is popped <b>first</b> when <code>/</code> is read, and what is the final result?",
    opts: ["9; the result is −1", "3; the result is 1", "3; the result is −1", "9; the result is 1"],
    a: 1, why: "3 was pushed last, so it is popped first and is the <b>right</b> operand: 9 / 3 = 3, then 3 − 2 = 1." },
  { q: "A growing array stack starts with 4 cells and doubles when full. How many element copies do 33 pushes cause?",
    opts: ["33", "60", "124", "528"],
    a: 1, why: "Copies happen at pushes 5, 9, 17 and 33: 4 + 8 + 16 + 32 = 60, less than 2 × 33. That is amortised O(1) per push." },
];
