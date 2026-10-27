// Chapter content, adapted from notes/L10-queues.md. Code and outputs come from CODE (demos.js),
// which is copied from the note.

const demo = (name, title, instr, hint = "") =>
  `<div class="card demo" data-demo="${name}"><div class="head"><span class="title">${title}</span><span>${instr}</span></div>
   <div class="demo-body"></div>${hint ? `<p class="hint">${hint}</p>` : ""}</div>`;

const callout = (kind, label, body) => `<div class="callout ${kind}"><b>${label}</b>${body}</div>`;
const predict = (q, a) => callout("predict", "PREDICT", `<p>${q}</p><details class="reveal"><summary>Show the answer</summary>${a}</details>`);
const java = (k) => codeBlock(CODE[k]);
const output = (k) => codeBlock(CODE[k], "out");
const program = (k) => java(k) + output(k + "Out");
const solution = (body) => `<details class="reveal"><summary>Solution</summary>${body}</details>`;

const LECTURE = {
  number: 10,
  title: "Queues",
  tagline: "First in, first out",
  lead: "The stack's mirror image: insert at the rear, remove at the front. Linear and circular queues, priority queues and deques — with every pointer, wrap-around and transfer stepped through.",
  heroDemo: "fifoMini",
  heroLabel: "A live queue · enqueue at the rear, dequeue at the front",
  heroCaption: "Whoever joined first leaves first. No one is served from the middle.",
  whyTitle: "Why queues matter",
  whySub: "Three ideas you will use far beyond this lecture",
  why: [
    ["Fairness and order", "Print jobs, network packets and processes waiting for the CPU are served <b>in arrival order</b>: a queue."],
    ["A trick with indices", "A <b>circular array</b> turns a row of cells into a ring with one <code>%</code>. Ring buffers are everywhere in systems code."],
    ["A family of structures", "Change the rule and you get a <b>priority queue</b> (most urgent first) or a <b>deque</b> (both ends) — both reappear later in the course."],
  ],
  ctaTitle: "Ready to join the queue?",
  minutes: "About 60–75 minutes",
  videos: {
    "media/L10-1.mp4": "Lecture 10 · Part 1 — FIFO, and the linear queue (9.1 min)",
    "media/L10-2.mp4": "Lecture 10 · Part 2 — The circular queue (9.2 min)",
    "media/L10-3.mp4": "Lecture 10 · Part 3 — Priority queues and deques (9.7 min)",
    "media/L10-4.mp4": "Lecture 10 · Part 4 — Stacks from queues, queues from stacks (9.4 min)",
  },
};

const CHAPTERS = [
  {
    slug: "1-queue", nav: "Queue ADT", title: "What a Queue Is",
    subtitle: "Insert at the rear, remove at the front: FIFO",
    abstract: "A queue is the line at a bus stop, written down as an abstract data type: two updates, each at its own end, and one rule — first in, first out.",
    tags: ["enqueue / dequeue", "FIFO vs LIFO", "java.util.Queue"],
    hero: "fifoMini", heroCaption: "enqueue joins at the rear (right); dequeue leaves from the front (left).",
    sections: [
      { id: "video-1", title: "Watch: FIFO, and the linear queue", html: `
        <div class="card video" data-video="media/L10-1.mp4"></div>` },
      { id: "life", title: "Queues in everyday life", html: `
        <p>A queue is the line you join at a shop counter or a bus stop. New people join at the <b>back</b>; the person at the <b>front</b> is served and leaves. Whoever came first is served first. Nobody is served from the middle, and nobody joins in the middle (at least, nobody is supposed to).</p>` },
      { id: "adt", title: "The queue ADT", html: `
        <p>As an abstract data type, a <b>queue</b> holds a sequence of elements and allows two updates, each at a fixed end:</p>
        <ul><li><b>enqueue(e)</b>: insert a new element <code>e</code> at the <b>rear</b> (also called the <em>tail</em> or <em>back</em>);</li>
        <li><b>dequeue()</b>: remove the element at the <b>front</b> (the <em>head</em>) and return it. This is always the element that has been in the queue the longest, the <em>least recently inserted</em> one.</li></ul>
        <p>Together they give the queue its defining rule, <b>First-In-First-Out (FIFO)</b>: the first element enqueued is the first element dequeued. The stack of Lecture 9 follows <b>Last-In-First-Out (LIFO)</b>: a stack inserts and removes at the <em>same</em> end; a queue inserts at one end and removes at the other.</p>
        ${callout("note", "NOTE", "<p>The slides say a queue stores a <em>set</em> S. Read that loosely: a queue may hold the same value several times, and the order matters, so it is really a sequence.</p>")}
        <p>Besides the two updates, a queue usually offers some helpers:</p>
        <table><thead><tr><th>operation</th><th>meaning</th></tr></thead><tbody>
        <tr><td><code>createQueue()</code></td><td>make an empty queue</td></tr>
        <tr><td><code>peek()</code> (or <code>front()</code>)</td><td>return the front element without removing it</td></tr>
        <tr><td><code>isEmpty()</code></td><td>is the queue empty?</td></tr>
        <tr><td><code>isFull()</code></td><td>is there no room for another element? (only for fixed-capacity queues)</td></tr>
        <tr><td><code>size()</code></td><td>how many elements are in the queue</td></tr></tbody></table>
        <p>Dequeuing (or peeking at) an empty queue is an error called <b>underflow</b>; enqueuing into a full fixed-size queue is <b>overflow</b>.</p>
        ${predict("Start with an empty queue and an empty stack. Do the same operations on both: insert 1, insert 2, insert 3, remove, insert 4, remove, remove. Which numbers does each structure give back, in order? What is left in each?",
          "<p>The queue gives back <b>1, 2, 3</b> and still holds 4. The stack gives back <b>3, 4, 2</b> and still holds 1. The queue always returns the oldest element; the stack always returns the newest.</p>")}
        ${demo("fifoLifo", "Demo 1 · The same operations on a queue and a stack", "edit, then step (← →)", "Try <code>in 1, in 2, out, in 3, out</code>: the two structures agree on nothing after the first <code>out</code>.")}` },
      { id: "cs", title: "Queues in computer science", html: `
        <p>Whenever work arrives faster than it can be done, or must be done in arrival order, there is a queue:</p>
        <ul><li><b>Buffers.</b> A music player keeps the next songs of a playlist, or the next chunks of an audio stream, in a queue: data is added at one end while the player consumes it at the other.</li>
        <li><b>Operating systems.</b> Processes waiting for the CPU, packets waiting to be sent over a network, and jobs waiting for a GPU are kept in queues and served in turn.</li>
        <li><b>A shared printer.</b> It prints one job at a time. A job that arrives while the printer is busy waits in the queue; when the printer finishes, it takes the job at the front.</li></ul>
        <p>Java's standard library has a <code>Queue</code> interface. <code>ArrayDeque</code> is the usual class to use for it; <code>offer</code> enqueues, <code>poll</code> dequeues, and <code>peek</code> looks at the front:</p>
        ${program("printSpooler")}
        ${callout("note", "NOTE", "<p><code>Queue</code> has two methods for each operation. <code>offer</code>, <code>poll</code> and <code>peek</code> report failure by returning <code>false</code> or <code>null</code>; <code>add</code>, <code>remove</code> and <code>element</code> throw an exception instead. On an empty queue, <code>poll()</code> returns <code>null</code> but <code>remove()</code> throws <code>NoSuchElementException</code>.</p>")}` },
    ],
    takeaways: ["enqueue at the rear, dequeue at the front.", "FIFO: the oldest element leaves first.", "Java: Queue&lt;T&gt; q = new ArrayDeque&lt;&gt;()."],
  },
  {
    slug: "2-linear", nav: "Linear queue", title: "The Linear Queue",
    subtitle: "On a linked list, and on an array that runs out of room",
    abstract: "Both ends of a queue must be reachable in O(1). A linked list with a tail reference does it; a plain array does it too, until its indices walk off the end.",
    tags: ["LinkedQueue", "head and tail", "array runs out of room"],
    hero: "linkedMini", heroCaption: "Nodes join behind the tail and leave from the head.",
    sections: [
      { id: "example", title: "A worked example", html: `
        <p>A <b>linear queue</b> (or just <em>queue</em>) is a linear data structure that follows FIFO. Picture it as a row of cells with two markers: <code>front</code> on the oldest element and <code>rear</code> on the newest. Start with a queue that holds only <code>A</code>, so <code>front</code> and <code>rear</code> are both on <code>A</code>.</p>
        <ol><li>Enqueue <code>B</code>: <code>B</code> goes behind <code>A</code>, and <code>rear</code> moves to <code>B</code>. The queue is <code>A B</code>.</li>
        <li>Enqueue <code>C</code>: the queue is <code>A B C</code>, <code>rear</code> on <code>C</code>.</li>
        <li>Dequeue: <code>A</code> is removed and returned; <code>front</code> moves to <code>B</code>. The queue is <code>B C</code>.</li></ol>
        <p>The two markers only ever move in one direction, towards the rear. That is harmless for a linked list, but it is the root of the problem with arrays in §2.4.</p>` },
      { id: "ops", title: "The operations", html: `
        <p>A queue implementation must provide <code>enqueue(x)</code> and <code>dequeue()</code>, plus <code>createQueue()</code>, <code>isEmpty()</code> and <code>isFull()</code>. Because the two updates happen at <em>different</em> ends, the implementation must reach both ends quickly. There are two standard choices: a linked list or an array.</p>` },
      { id: "linked", title: "A queue on a linked list", html: `
        <p>The slides build the queue on the linked list of Lecture 7 (one with a dummy header node, so the first real node is <code>L.head.next</code>):</p>
        <ul><li><code>createQueue</code>: allocate the queue and an empty list inside it;</li>
        <li><code>enqueue(Q, e)</code>: insert <code>e</code> at the <b>end</b> of the list;</li>
        <li><code>dequeue(Q)</code>: if the list is empty, report “Queue empty”; otherwise remember the first node's element, delete the first node, and return the element;</li>
        <li><code>isEmpty(Q)</code>: return whether the list is empty;</li>
        <li><code>isFull(Q)</code>: always return false. A linked list grows one node at a time, so it is never full (until the computer runs out of memory).</li></ul>
        <p>For enqueue to be fast, “insert at the end” must not walk the whole list. So the queue keeps a second reference, <code>tail</code>, to the last node. Here it is in Java, without a dummy node: <code>head</code> is the front node and <code>tail</code> the rear node.</p>
        ${java("linkedQueue")}
        <p>The slide example, with <code>A</code> already in the queue:</p>
        ${program("linkedQueueDemo")}
        <p>Each operation changes a constant number of references, so <b>enqueue, dequeue, peek and isEmpty all take O(1) time</b>. The queue uses O(n) memory for n elements, plus one reference per node.</p>
        ${demo("linkedQueue", "Demo 2 · References re-linking", "edit, then step (← →)", "Step through the third <code>deq</code> slowly: after <code>head = head.next</code>, <code>tail</code> still points at the removed node until the next line fixes it.")}
        ${predict("Why is the <em>front</em> of the queue at the <b>head</b> of the list and not at the tail? Suppose we did it the other way round: enqueue at the head, dequeue at the tail. What would each operation cost on a singly linked list?",
          "<p>Enqueue at the head would still be O(1). But to dequeue at the tail we must remove the last node, and that means setting the <code>next</code> of the <em>second-to-last</em> node to <code>null</code>. A singly linked list has no way back from <code>tail</code>, so we would walk from <code>head</code> to find that node: O(n). Removing at the head and adding at the tail are both O(1), so the front goes at the head.</p>")}
        ${callout("pitfall", "PITFALL · FORGETTING TAIL WHEN THE QUEUE EMPTIES", "<p>After dequeuing the last element, <code>head</code> becomes <code>null</code>, but <code>tail</code> still points at the removed node. The next <code>enqueue</code> would then link the new node behind a node that is no longer in the queue, and <code>head</code> would stay <code>null</code>. That is why <code>dequeue</code> sets <code>tail = null</code> when <code>head</code> becomes <code>null</code>.</p>")}
        <p>Dequeuing from an empty queue is underflow; this implementation throws an exception:</p>
        ${program("emptyDequeue")}
        <p>The second <code>dequeue</code> throws <code>IllegalStateException: Queue empty</code>, so nothing more is printed.</p>` },
      { id: "array", title: "A queue on an array", html: `
        <p>An array implementation keeps the elements in consecutive cells, with two indices:</p>
        ${java("queueArray")}
        <ul><li><b>enqueue x</b>: increase <code>size</code> and <code>rear</code>, then set <code>array[rear] = x</code>;</li>
        <li><b>dequeue</b>: take <code>array[front]</code>, decrease <code>size</code>, then increase <code>front</code>.</li></ul>
        <p>(The class on the slide omits the <code>size</code> field that the operations use; the version below has it.) Start with <code>front = 0</code> and <code>rear = -1</code>, so the first enqueue puts its element in cell 0.</p>
        ${java("linearArrayQueue")}
        <p>Both operations are O(1). But watch what happens to the indices:</p>
        ${program("linearArrayDemo")}
        <p><b>The array queue runs out of room.</b> <code>front</code> and <code>rear</code> only ever move right. Once <code>rear</code> reaches the last cell, no more elements can be enqueued, even though the cells before <code>front</code> are free: here the queue holds 2 elements in 4 cells and still refuses a third. A queue that keeps being used (enqueue one, dequeue one, forever) walks off the end of any array, however large.</p>
        ${demo("linearArray", "Demo 3 · The array queue that runs out of room", "edit, then step (← →)", "Then tick “shift after each dequeue” and watch the move counter: room is never wasted, but every dequeue pays for it.")}
        <p>There are two ways out:</p>
        <ol><li><b>Shift.</b> Keep <code>front</code> always at 0: after each dequeue, move every remaining element one cell to the left. This works, but a dequeue now costs Θ(n) moves for a queue of n elements, the same cost as deleting from the front of an array in Lecture 3.</li>
        <li><b>Wrap around.</b> When <code>rear</code> reaches the end of the array, continue at cell 0, which the dequeues have freed. This is the <b>circular queue</b> of the next chapter, and every operation stays O(1).</li></ol>` },
    ],
    takeaways: ["Linked list + tail reference: all O(1).", "Front at the head, rear at the tail.", "Plain array: indices drift right and run out."],
  },
  {
    slug: "3-circular", nav: "Circular", title: "The Circular Queue",
    subtitle: "Bend the array into a ring with one % operator",
    abstract: "When the rear reaches the end of the array, continue at cell 0. Every operation stays O(1), and the only cost is telling a full queue from an empty one.",
    tags: ["ring buffer", "(i + 1) % capacity", "full vs empty"],
    hero: "ringMini", heroCaption: "A stream of enqueues and dequeues chasing each other round a ring of 6 cells.",
    sections: [
      { id: "video-2", title: "Watch: The circular queue", html: `
        <div class="card video" data-video="media/L10-2.mp4"></div>` },
      { id: "wrap", title: "Wrapping around", html: `
        <p>A <b>circular queue</b> is an array queue in which the cell after the last one is the first one: picture the cells bent into a ring. It is also called a <b>ring buffer</b> or <em>circular buffer</em>. Nothing in memory is actually circular; only the index arithmetic is. To step from index <code>i</code> to the next cell, compute</p>
        <div class="math-block">next(i) = (i + 1) mod capacity</div>
        <p>so the indices run 0, 1, …, capacity − 1, 0, 1, … . In Java, <code>%</code> is the remainder operator: with capacity 5, <code>(4 + 1) % 5</code> is 0.</p>
        <p>If there is any free cell in the ring, the next element can go there just by advancing <code>rear</code> one step: this is how the circular queue overcomes the drawback of the linear queue.</p>` },
      { id: "front-size", title: "Front and size", html: `
        <p>The cleanest circular queue stores the index <code>front</code> and the number of elements <code>size</code>; the rear is computed from them. The elements occupy the <code>size</code> cells starting at <code>front</code>, wrapping round:</p>
        <div class="math-block">rear = (front + size − 1) mod capacity</div>
        <p>To enqueue, put the new element in the first free cell after the rear, which is (front + size) mod capacity, then increase <code>size</code>. To dequeue, take <code>array[front]</code>, then set front = (front + 1) mod capacity and decrease <code>size</code>.</p>
        <p>Conversely, if you only know <code>front</code> and <code>rear</code> of a non-empty queue, the size is <code>rear − front + 1</code> when <code>rear ≥ front</code>, and <code>rear − front + 1 + capacity</code> when the queue has wrapped (<code>rear &lt; front</code>).</p>
        ${callout("note", "NOTE · FULL OR EMPTY?", "<p>Why keep <code>size</code> at all, rather than just <code>front</code> and <code>rear</code>? Because with only the two indices, a <b>full</b> queue and an <b>empty</b> queue look the same: in both, the cell after <code>rear</code> is <code>front</code>. Every circular queue needs one extra piece of information to tell them apart. There are three common choices: keep a <code>size</code> counter (this section); use special values such as −1 for an empty queue (§3.3); or never fill the last cell, so that a queue with capacity n holds at most n − 1 elements (the choice made in CLRS, §10.1).</p>")}
        ${java("circularQueue")}
        <p>The slides trace a circular queue of capacity 4: enqueue 14, 22, 13; dequeue; enqueue 15 and 4. The last enqueue wraps round to cell 0.</p>
        ${program("circularQueueDemo")}
        <p>Check the last enqueue by hand: before it, front = 1 and size = 3, so the new element goes to (1 + 3) mod 4 = 0. The queue, read from the front, is 22, 13, 15, 4, and the rear (index 0) is to the <em>left</em> of the front (index 1). That is what wrapped means.</p>
        ${demo("circular", "Demo 4 · A circular queue, as a ring and as an array", "edit, then step (← →)", "The preset “one in, one out, forever” is the case that broke the linear queue: here front and rear simply keep going round.")}
        ${predict("Continue the trace: dequeue twice, then enqueue 9. Which cells hold which values, and what are <code>front</code>, <code>size</code> and <code>rear</code>?",
          "<p>The two dequeues return 22 and 13, leaving front = 3, size = 2: the queue is 15, 4. The enqueue puts 9 at (3 + 2) mod 4 = 1. The cells are <code>[4 9 _ 15]</code> with front = 3, size = 3, rear = (3 + 3 − 1) mod 4 = 1. (Pick “the Predict box” in Demo 4 to check.)</p>")}
        ${callout("pitfall", "PITFALL · FORGETTING THE % CAPACITY", "<p>Without it, <code>front + size</code> runs past the end of the array and Java throws <code>ArrayIndexOutOfBoundsException</code>; the array is only circular because of the modulus. A second trap: when you <em>decrease</em> an index (the deque of Chapter 5 does), <code>-1 % 5</code> is −1 in Java, not 4. Write <code>(i - 1 + capacity) % capacity</code> instead.</p>")}` },
      { id: "front-rear", title: "The front / rear = −1 version", html: `
        <p>The slides also give a version that stores <code>front</code> and <code>rear</code> and uses −1 for “empty”:</p>
        <ul><li>Initially <code>front = rear = -1</code>.</li>
        <li><b>Enqueue.</b> First check for overflow: the queue is full when <code>(rear + 1) % MAX == front</code>. If the queue is empty (<code>front == -1</code>), set <code>front = rear = 0</code>; otherwise advance <code>rear = (rear + 1) % MAX</code>. Then store the value at <code>queue[rear]</code>. (The slide's pseudocode treats “<code>rear == MAX − 1</code> and <code>front != 0</code>” separately by setting <code>rear = 0</code>; the modulus already does exactly that.)</li>
        <li><b>Dequeue.</b> First check for underflow: the queue is empty when <code>front == -1</code>. Take <code>queue[front]</code>. If that was the only element (<code>front == rear</code>), reset <code>front = rear = -1</code>; otherwise advance <code>front = (front + 1) % MAX</code>.</li></ul>
        ${java("circularQueueFR")}
        <p>The slides' example, with <code>MAX = 5</code>: enqueue 10 to 50, dequeue twice, enqueue 60 and 70. We add one more enqueue, of 80, to see the overflow test fire.</p>
        ${program("circularQueueFRDemo")}
        <p>After 70, <code>rear = 1</code> and <code>front = 2</code>: the cell after the rear is the front, so the queue is full, and 80 is refused even though nothing is “at the end” of the array.</p>
        ${demo("circularFR", "Demo 5 · The −1 version, step by step", "edit, then step (← →)", "Watch the stat “(rear + 1) % MAX”: the queue is full exactly when it equals <code>front</code>.")}
        ${predict("In this version, how do you tell an empty queue from a queue with exactly one element? What are <code>front</code> and <code>rear</code> in each case?",
          "<p>Empty: <code>front == rear == -1</code>. One element: <code>front == rear</code>, and both are a real index (0 to MAX − 1). That is why <code>dequeue</code> resets both to −1 when it removes the last element: otherwise a queue that had just become empty would look like one with one element.</p>")}` },
      { id: "uses", title: "Where circular queues are used", html: `
        <ul><li><b>Memory management.</b> A ring buffer reuses the same block of memory forever: cells freed at the front are filled again from the rear, so no memory is wasted and none needs to be allocated while the program runs. Keyboard buffers, audio and network buffers, and logging systems work this way.</li>
        <li><b>Cycling through a fixed set.</b> A traffic light shows red, then yellow, then green, then red again. Taking the front element and putting it straight back at the rear turns a queue into a cycle; operating systems use the same trick (<em>round-robin scheduling</em>) to give each waiting process a turn on the CPU.</li></ul>
        ${program("trafficLight")}` },
      { id: "costs", title: "Costs", html: `
        <table><thead><tr><th></th><th>linked list</th><th>linear array</th><th>array with shifting</th><th>circular array</th></tr></thead><tbody>
        <tr><td>enqueue</td><td>O(1)</td><td>O(1), but may refuse with free cells</td><td>O(1)</td><td>O(1)</td></tr>
        <tr><td>dequeue</td><td>O(1)</td><td>O(1)</td><td>O(n)</td><td>O(1)</td></tr>
        <tr><td>peek, isEmpty</td><td>O(1)</td><td>O(1)</td><td>O(1)</td><td>O(1)</td></tr>
        <tr><td>memory</td><td>one node (element + link) per element</td><td>fixed capacity</td><td>fixed capacity</td><td>fixed capacity</td></tr></tbody></table>
        <p>The circular array is usually the fastest queue in practice: no node is allocated per element, and the cells sit next to each other in memory. Its limit is the fixed capacity; Exercise 3 removes it by doubling the array when it is full, which is what <code>java.util.ArrayDeque</code> does.</p>` },
    ],
    takeaways: ["next(i) = (i + 1) % capacity.", "Keep size (or −1, or a spare cell) to tell full from empty.", "All circular-queue operations are O(1)."],
  },
  {
    slug: "4-priority", nav: "Priority", title: "The Priority Queue",
    subtitle: "The most urgent element leaves first",
    abstract: "Keep the queue's interface, change its rule: what comes out is the element with the highest priority, not the oldest one.",
    tags: ["min / max priority", "java.util.PriorityQueue", "four implementations"],
    hero: "pqMini", heroCaption: "Arrivals in any order; poll always takes the smallest.",
    sections: [
      { id: "video-3", title: "Watch: Priority queues and deques", html: `
        <div class="card video" data-video="media/L10-3.mp4"></div>` },
      { id: "idea", title: "Highest priority first", html: `
        <p>A <b>priority queue</b> looks like a queue — elements go in, elements come out — but each element has a <b>priority</b>, and the element that comes out is always the one with the <b>highest priority</b>, not the one that arrived first. So a priority queue does <b>not</b> follow FIFO. An emergency room is a priority queue: the most urgent patient is treated first, whatever the order of arrival.</p>
        <p>The elements must be <b>comparable</b>, so that “highest priority” makes sense. Usually the priority is a number. Whether a small number or a large one counts as “high” is a choice: a <b>min-priority queue</b> removes the smallest element first, a <b>max-priority queue</b> the largest. Its operations are</p>
        <ul><li><b>insert</b> (Java: <code>add</code> or <code>offer</code>): put an element in;</li>
        <li><b>remove the highest-priority element</b> (Java: <code>poll</code>), and <b>look at it</b> (<code>peek</code>).</li></ul>` },
      { id: "example", title: "An example", html: `
        <p>The slides take a min-priority queue holding 1, 3, 4, 8, 14, 22 (smallest = highest priority) and do: poll, add 2, poll, add 5. Java's <code>PriorityQueue</code> is a min-priority queue by default:</p>
        ${program("priorityQueueDemo")}
        <p>The first poll removes 1. Then 2 is the smallest element, so it gets the highest priority and the next poll removes it. 5 lands between 4 and 8: it has the third-highest priority.</p>
        ${callout("note", "NOTE", "<p>The slides say the elements of a priority queue “are either in an ascending or descending order”. That is how it <em>behaves</em>: elements come <em>out</em> in sorted order. It is not how it must be <em>stored</em>. Java's <code>PriorityQueue</code> keeps a binary heap, which is only partly sorted.</p>")}
        ${program("priorityQueueOrder")}
        ${callout("pitfall", "PITFALL", "<p><b>Printing or iterating over a <code>PriorityQueue</code> does not give sorted order.</b> Only <code>poll</code> (and <code>peek</code>) respect the priorities. Also, elements with <em>equal</em> priority do not come out in arrival order: a priority queue is not “FIFO among ties” unless you add a sequence number to the priority yourself.</p>")}` },
      { id: "impl", title: "Implementations", html: `
        <p>There are four standard ways to implement a priority queue. With n elements:</p>
        <table><thead><tr><th>implementation</th><th>insert</th><th>remove highest</th><th>peek highest</th></tr></thead><tbody>
        <tr><td>unsorted array (or list)</td><td>O(1): append</td><td>O(n): search for it</td><td>O(n)</td></tr>
        <tr><td>sorted array (highest at the end)</td><td>O(n): shift to make room</td><td>O(1): take the last</td><td>O(1)</td></tr>
        <tr><td>sorted linked list (highest at the head)</td><td>O(n): walk to the position</td><td>O(1): unlink the head</td><td>O(1)</td></tr>
        <tr><td>binary search tree</td><td>O(log n) if balanced, O(n) worst</td><td>same</td><td>same</td></tr>
        <tr><td><b>binary heap</b></td><td><b>O(log n)</b></td><td><b>O(log n)</b></td><td><b>O(1)</b></td></tr></tbody></table>
        <p>The <b>heap</b> is the most efficient of these, and it is the subject of Lecture 17. For now, here is the sorted linked list. It is the slide example taken literally: keep the elements in ascending order, so <code>add(5)</code> walks past 3 and 4 and links 5 in front of 8, and <code>poll</code> just removes the head.</p>
        ${java("sortedListPQ")}
        ${program("sortedListPQDemo")}
        ${demo("sortedPQ", "Demo 6 · A sorted-list priority queue", "edit, then step (← →)", "Try adding a large value such as <code>add 99</code>: <code>p</code> walks the whole list. That walk is the O(n) a heap avoids.")}
        <p>Inserting an equal value walks <em>past</em> the existing copies (<code>&lt;=</code> in the loop), so equal values do come out in arrival order in this particular implementation.</p>` },
    ],
    takeaways: ["Highest priority out first: not FIFO.", "Java's PriorityQueue is a min-heap; its toString is not sorted.", "Heap: O(log n) insert and remove (Lecture 17)."],
  },
  {
    slug: "5-deque", nav: "Deque", title: "The Double-Ended Queue",
    subtitle: "Insert and delete at both ends",
    abstract: "A deque does whatever a stack or a queue does, at either end. On a circular array every operation is one modular step forward or backward.",
    tags: ["deque", "wrap backward", "ArrayDeque"],
    hero: "dequeMini", heroCaption: "Elements join and leave at both ends of the ring.",
    sections: [
      { id: "both", title: "Both ends", html: `
        <p>A <b>double-ended queue</b>, or <b>deque</b> (pronounced “deck”), is a generalised queue: elements can be inserted and deleted at <b>both</b> ends. It does not enforce FIFO or LIFO; it supports both, depending on how you use it:</p>
        <ul><li>use only one end (insert and delete at the rear): it is a <b>stack</b>, LIFO;</li>
        <li>insert at one end and delete at the other: it is a <b>queue</b>, FIFO.</li></ul>
        <p>The slides name six operations:</p>
        <table><thead><tr><th>operation</th><th>meaning</th><th><code>java.util.Deque</code></th></tr></thead><tbody>
        <tr><td><code>enqueueFront(x)</code></td><td>insert at the front</td><td><code>offerFirst(x)</code> / <code>addFirst(x)</code></td></tr>
        <tr><td><code>enqueueRear(x)</code></td><td>insert at the rear</td><td><code>offerLast(x)</code> / <code>addLast(x)</code></td></tr>
        <tr><td><code>dequeueFront()</code></td><td>delete (and return) the front element</td><td><code>pollFirst()</code> / <code>removeFirst()</code></td></tr>
        <tr><td><code>dequeueRear()</code></td><td>delete (and return) the rear element</td><td><code>pollLast()</code> / <code>removeLast()</code></td></tr>
        <tr><td><code>getFront()</code></td><td>return the front element</td><td><code>peekFirst()</code> / <code>getFirst()</code></td></tr>
        <tr><td><code>getRear()</code></td><td>return the rear element</td><td><code>peekLast()</code> / <code>getLast()</code></td></tr></tbody></table>
        <p>(The slides write them with underscores, <code>enqueue_front()</code>; these notes use Java's camelCase.)</p>` },
      { id: "circular-deque", title: "A deque on a circular array", html: `
        <p>A deque fits a circular array perfectly. Inserting at the rear and deleting at the front move <code>rear</code> and <code>front</code> forward, as in the circular queue. The two new operations move them <em>backward</em>:</p>
        <ul><li><b>enqueueFront</b>: decrease <code>front</code> by 1, then store the element there. If <code>front</code> was 0, <code>front − 1</code> is −1, which is not a valid index, so wrap to <code>n − 1</code> (the last cell).</li>
        <li><b>dequeueFront</b>: increase <code>front</code> by 1; if it was the last cell, it becomes <code>n</code>, which is invalid, so wrap to 0.</li>
        <li><b>dequeueRear</b>: decrease <code>rear</code> by 1; if it was 0, wrap to <code>n − 1</code>.</li>
        <li><b>enqueueRear</b>: increase <code>rear</code> by 1, wrapping from <code>n − 1</code> to 0.</li></ul>
        <p>All four are one line each with modular arithmetic: forward is <code>(i + 1) % n</code> and backward is <code>(i - 1 + n) % n</code>.</p>
        <p>The class below keeps <code>front</code>, <code>rear</code> and <code>size</code>. It starts with <code>front = 0</code> and <code>rear = n − 1</code>, so that the invariant rear = (front + size − 1) mod n holds even for the empty deque. Then the first element lands at index 0 if it is added at the rear, and at index <code>n − 1</code> if it is added at the front, with no special case.</p>
        ${java("circularDeque")}
        <p>The slides' pictures, with n = 5. First: insert 1, 2, 3 at the rear, then 5 at the front (front wraps from 0 to 4), then delete at the front (front wraps from 4 back to 0), then delete at the rear. Second: a deque whose rear is at index 0, deleting at the rear (rear wraps from 0 to 4).</p>
        ${program("circularDequeDemo")}
        <p>Read the second deque from the front: 2, 3, 1. The front is at index 3 and the rear at index 0; after deleting the rear element 1, the rear wraps back to index 4.</p>
        ${demo("deque", "Demo 7 · A deque on a circular array", "edit, then step (← →)", "The presets replay the slides' pictures. “Used as a stack” only touches the rear: last in, first out.")}
        ${predict("Starting from the empty deque with n = 5, do enqueueFront 7, enqueueFront 8, enqueueRear 9. Where is each number, and what are <code>f</code> and <code>r</code>?",
          "<p>enqueueFront 7: front goes from 0 back to 4, so 7 is at index 4. enqueueFront 8: front goes to 3, so 8 is at index 3. enqueueRear 9: rear goes from 4 (where 7 is) forward to 0, so 9 is at index 0. The cells are <code>[9 _ _ 8 7]</code> with f = 3, r = 0; read from the front, the deque is 8, 7, 9.</p>")}` },
      { id: "arraydeque", title: "Java's ArrayDeque", html: `
        <p><code>java.util.ArrayDeque</code> is a circular-array deque that doubles its array when it is full. It is the class Java recommends for both stacks and queues (rather than the old <code>Stack</code> class, or <code>LinkedList</code>):</p>
        ${program("dequeAsBoth")}
        <p>Every deque operation on a circular array is O(1) (for <code>ArrayDeque</code>, O(1) amortised, counting the occasional doubling).</p>` },
    ],
    takeaways: ["A deque inserts and deletes at both ends.", "Backward step: (i − 1 + n) % n.", "ArrayDeque is Java's stack and queue."],
  },
  {
    slug: "6-convert", nav: "Stack ↔ queue", title: "Stacks from Queues, Queues from Stacks",
    subtitle: "Build one structure from the other's operations",
    abstract: "Two classic exercises that test whether you really understand LIFO and FIFO — and a lesson in amortised cost.",
    tags: ["two queues", "two stacks", "amortised O(1)"],
    hero: "queueStacksMini", heroCaption: "The lazy two-stack queue: pour in → out only when out is empty.",
    sections: [
      { id: "video-4", title: "Watch: Stacks from queues, queues from stacks", html: `
        <div class="card video" data-video="media/L10-4.mp4"></div>` },
      { id: "stack-two-queues", title: "A stack from two queues", html: `
        <p>Keep the stack in queue <code>q1</code> with the <b>top of the stack at the front</b> of <code>q1</code>; <code>q2</code> is only scratch space. Then <code>pop</code> is just <code>q1.poll()</code>. The work is in <code>push(x)</code>:</p>
        <ol><li>move every element from <code>q1</code> to <code>q2</code>;</li>
        <li>enqueue <code>x</code> into the now empty <code>q1</code>, so <code>x</code> is at its front;</li>
        <li>move every element from <code>q2</code> back to <code>q1</code>, behind <code>x</code>.</li></ol>
        ${java("stackFromQueues")}
        ${program("stackFromQueuesDemo")}
        <p><code>pop</code> is O(1). <code>push</code> moves the k elements already in the stack twice, so it costs Θ(k) and pushing n elements costs 2(0 + 1 + … + (n − 1)) = n(n − 1) moves: Θ(n²) in total.</p>
        ${demo("stackQueues", "Demo 8 · A stack from queues", "step (← →), switch version", "Five keys take 20 moves with two queues and 10 with one queue. Both are Θ(n²).")}
        ${callout("pitfall", "PITFALL · THE SLIDE'S TEST LOOP RUNS ONCE TOO OFTEN", "<p>It pops with <code>for (int i = 0; i &lt;= keys.length; i++)</code>: six pops from a stack of five. The sixth pop finds <code>q1</code> empty, and the slide's code then prints <code>Underflow!!</code> and stops the whole program with <code>System.exit(0)</code>. Loop with <code>i &lt; keys.length</code>, as above. With <code>&lt;=</code>, our version prints 5 4 3 2 1 and then throws:</p>")}
        ${program("offByOne")}` },
      { id: "one-queue", title: "One queue is enough", html: `
        <p>The slides mention <b>another idea</b> that needs only one queue: enqueue the new element, then dequeue each of the n − 1 elements that were in front of it and enqueue it again at the rear. The new element ends up at the front.</p>
        ${java("stackFromOneQueue")}
        ${program("stackFromOneQueueDemo")}
        <p>The cost is the same: push is Θ(n) (n − 1 rotations), pop is O(1).</p>` },
      { id: "queue-two-stacks", title: "A queue from two stacks", html: `
        <p>The slides do the mirror image. Keep the queue in stack <code>s1</code> with the <b>front of the queue on top</b>. Then <code>dequeue</code> is <code>s1.pop()</code>. To <code>enqueue(x)</code>, x must go to the <em>bottom</em> of <code>s1</code>: pop everything onto <code>s2</code>, push x, then pop everything back.</p>
        ${java("queueFromStacks")}
        <p>The slides use <code>java.util.Stack</code>; <code>ArrayDeque</code> has the same <code>push</code> and <code>pop</code> and is the recommended stack class. Enqueue is Θ(n) and dequeue O(1).</p>
        <p>There is a much better way, a standard textbook trick. Use <code>in</code> for enqueues and <code>out</code> for dequeues. Enqueue just pushes onto <code>in</code>. Dequeue pops from <code>out</code>; only when <code>out</code> is empty does it first pour <em>all</em> of <code>in</code> into <code>out</code>, which reverses them, so the oldest element ends up on top.</p>
        ${java("lazyQueueFromStacks")}
        <p>Each element is moved from <code>in</code> to <code>out</code> <b>at most once</b> in its life. So n enqueues and n dequeues cost at most n moves in total, although one particular dequeue may cost many: the <b>amortised</b> cost of each operation is O(1).</p>
        ${program("queueFromStacksDemo")}
        <p>The slide version moved elements 999,000 times (n(n − 1)), the lazy one 1,000 times (n).</p>
        ${demo("queueStacks", "Demo 9 · A queue from two stacks", "step (← →), switch version", "Run the same operations in both versions and compare the move counts.")}
        ${predict("With the lazy queue: enqueue 1, 2, 3; dequeue; enqueue 4; dequeue; dequeue; dequeue. What does each dequeue return, and which dequeues pour <code>in</code> into <code>out</code>?",
          "<p>The first dequeue finds <code>out</code> empty and pours 3, 2, 1 across (3 moves), leaving 1 on top of <code>out</code>; it returns 1. Enqueue 4 goes onto <code>in</code>. The next two dequeues return 2 and 3 straight from <code>out</code>. The last dequeue finds <code>out</code> empty again, pours 4 across (1 move) and returns 4. FIFO order 1, 2, 3, 4, with 4 moves for 4 elements. (Demo 9 starts with exactly these operations: switch it to the lazy version.)</p>")}` },
    ],
    takeaways: ["Stack from queues: push Θ(n), pop O(1).", "Queue from stacks (slides): enqueue Θ(n).", "Lazy two-stack queue: O(1) amortised."],
  },
  {
    slug: "7-summary", nav: "Summary", title: "Summary and Practice",
    subtitle: "Check yourself, then build some queues",
    abstract: "A one-page map of the lecture, a self-check quiz, seven exercises with solutions, and the key terms.",
    tags: ["knowledge map", "self-check", "exercises"],
    hero: "toc",
    sections: [
      { id: "map", title: "Knowledge map", html: `<div class="map">
        <div class="card"><h3>Queue ADT</h3><ul><li><b>enqueue</b> at the rear, <b>dequeue</b> at the front</li><li><b>FIFO</b> (stack: LIFO)</li><li>underflow / overflow</li><li>Java: <code>Queue</code> + <code>ArrayDeque</code></li></ul></div>
        <div class="card"><h3>Linear queue</h3><ul><li>Linked list: <code>head</code> = front, <code>tail</code> = rear, all O(1)</li><li>Reset <code>tail</code> when the queue empties</li><li>Plain array: indices drift right and run out</li></ul></div>
        <div class="card"><h3>Circular queue</h3><ul><li><code>(i + 1) % capacity</code></li><li>rear = (front + size − 1) mod capacity</li><li>Full vs empty: size, −1, or a spare cell</li><li>All operations O(1)</li></ul></div>
        <div class="card"><h3>Priority queue</h3><ul><li>Highest priority out first, not FIFO</li><li>Sorted list: insert O(n), poll O(1)</li><li>Heap: O(log n) both (Lecture 17)</li><li><code>PriorityQueue</code> is a min-heap</li></ul></div>
        <div class="card"><h3>Deque</h3><ul><li>Insert and delete at both ends</li><li>Backward: <code>(i - 1 + n) % n</code></li><li>Stack or queue, as you use it</li></ul></div>
        <div class="card"><h3>Stack ↔ queue</h3><ul><li>Stack from queues: push Θ(n)</li><li>Queue from stacks (slides): enqueue Θ(n)</li><li>Lazy two stacks: O(1) amortised</li></ul></div></div>` },
      { id: "check", title: "Check your understanding", html: `<div data-demo="quiz"><div class="demo-body"></div></div>` },
      { id: "exercises", title: "Exercises", html: `
        <h3>Exercise 1 ★ (trace)</h3>
        <p>A <code>CircularQueue</code> has capacity 5. Do: enqueue 1, 2, 3, 4; dequeue three times; enqueue 5, 6, 7. Write the cells (with <code>_</code> for free cells), <code>front</code>, <code>size</code> and <code>rear</code> at the end. Then check with the class (or with Demo 4).</p>
        ${solution(`<p>After four enqueues: <code>[1 2 3 4 _]</code>, front 0, size 4. Three dequeues return 1, 2, 3: front 3, size 1. Enqueue 5 goes to (3 + 1) mod 5 = 4; 6 to (3 + 2) mod 5 = 0; 7 to 1.</p>${program("exercise1")}`)}
        <h3>Exercise 2 ★ (size from two indices)</h3>
        <p>Add a method <code>size()</code> to <code>CircularQueueFR</code>, which stores only <code>front</code> and <code>rear</code>. Hint: three cases: empty, not wrapped, wrapped.</p>
        ${solution(`<p>If <code>front == -1</code> the size is 0. Otherwise it is <code>rear - front + 1</code> if <code>rear &gt;= front</code>, and <code>rear - front + 1 + MAX</code> if the queue has wrapped. Both non-empty cases are <code>(rear - front + MAX) % MAX + 1</code>:</p>${java("frSize")}<p>At the end of the slides' example (front 2, rear 1, MAX 5) this gives (1 − 2 + 5) % 5 + 1 = 5, a full queue.</p>`)}
        <h3>Exercise 3 ★★ (a growing circular queue)</h3>
        <p>Write a generic <code>GrowingQueue&lt;T&gt;</code> on a circular array that never refuses an enqueue: when the array is full, allocate one twice as large and copy the elements into it <b>in queue order, starting at index 0</b>. Why can't you simply copy <code>array[0..n-1]</code> to the same positions in the new array?</p>
        ${solution(`<p>If the queue has wrapped, the front is somewhere in the middle of the old array and the rear is to its left. Copied cell for cell into a larger array, the elements after the wrap point would no longer follow the front cyclically: there would be free cells in between. So copy in queue order: element k (counting from the front) goes to new cell k, and <code>front</code> becomes 0.</p>${java("growingQueue")}${program("growingQueueDemo")}<p>Doubling makes enqueue O(1) amortised: copying n elements happens only after about n/2 cheap enqueues since the previous doubling. <code>java.util.ArrayDeque</code> works this way.</p>`)}
        <h3>Exercise 4 ★★ (reverse a queue)</h3>
        <p>Write <code>static void reverse(Queue&lt;Integer&gt; q)</code> that reverses the order of the elements of <code>q</code>, using one stack as extra storage.</p>
        ${solution(`<p>Dequeue everything onto a stack, then pop everything back into the queue. The stack turns first-in into last-out. O(n) time, O(n) extra space.</p>${program("reverseQueue")}`)}
        <h3>Exercise 5 ★★ (hot potato)</h3>
        <p>n children stand in a circle, numbered 1 to n. Starting from child 1, count k children; the k-th child leaves the circle, and counting starts again from the next child. Print the order in which children leave, for n = 7 and k = 3. Use a queue as the circle.</p>
        ${solution(`<p>A queue rotated by “dequeue, then enqueue again” is a circle (the traffic-light trick of §3.4). Pass the potato k − 1 times, then the child holding it leaves.</p>${program("hotPotato")}<p>Each child leaves after k − 1 rotations, so the simulation takes O(nk) time. The last child left (here 4) is the answer to the famous <em>Josephus problem</em>.</p>`)}
        <h3>Exercise 6 ★★ (palindromes with a deque)</h3>
        <p>Write <code>isPalindrome(String s)</code> using a deque: put all the characters in, then repeatedly remove one from each end and compare.</p>
        ${solution(`${program("dequePalindrome")}<p>Careful: <code>d.pollFirst() != d.pollLast()</code> compares two <code>Character</code> objects. It works here only because Java caches the <code>Character</code> objects for codes 0 to 127; for other characters use <code>!d.pollFirst().equals(d.pollLast())</code>.</p>`)}
        <h3>Exercise 7 ★★★ (sliding-window maximum)</h3>
        <p>Given an array <code>a</code> and a window width <code>w</code>, print the maximum of every window <code>a[i..i+w-1]</code>. Do it in O(n) time with a deque of <em>indices</em>: keep the indices in the deque in decreasing order of their values, drop indices from the front when they leave the window, and from the rear when a new, larger value arrives.</p>
        ${solution(`<p>An index whose value is smaller than a newer value can never be a window maximum again (the newer value stays in the window longer), so it is removed from the rear. The front of the deque is then always the maximum of the current window. Every index is added once and removed at most once, so the total time is O(n).</p>${program("slidingMax")}`)}` },
      { id: "terms", title: "Key terms and further reading", html: `
        <p class="tags">${["queue", "enqueue", "dequeue", "front (head)", "rear (tail)", "FIFO", "LIFO", "underflow", "overflow", "linear queue", "circular queue", "ring buffer", "modular arithmetic", "round-robin", "priority queue", "min / max-priority queue", "heap", "deque", "Queue", "ArrayDeque", "PriorityQueue", "amortised cost"].map((t) => `<span class="tag">${t}</span>`).join("")}</p>
        <ul><li>T. H. Cormen, C. E. Leiserson, R. L. Rivest, C. Stein, <em>Introduction to Algorithms</em>, 4th ed., MIT Press 2022, §10.1 (stacks and queues; its exercises include the deque and the two-stack queue) and Chapter 6 (heaps and priority queues).</li>
        <li>M. A. Weiss, <em>Data Structures and Algorithm Analysis in Java</em>, 3rd ed., Pearson 2012, §3.7 (the queue ADT and its circular-array implementation) and Chapter 6 (priority queues).</li>
        <li>The Java documentation of <code>java.util.Queue</code>, <code>Deque</code>, <code>ArrayDeque</code> and <code>PriorityQueue</code>.</li></ul>` },
    ],
    takeaways: ["FIFO at two ends; O(1) with a list or a ring.", "Priority queue: highest priority first.", "Deque: both ends; ArrayDeque does it all."],
  },
];

const QUIZ = [
  { q: "A queue and a stack receive the same operations: insert a, insert b, remove, insert c, remove. What do they return?",
    opts: ["queue: a, b · stack: b, c", "queue: a, b · stack: b, a", "queue: b, c · stack: a, b", "both: a, b"],
    a: 0, why: "The queue removes its oldest element each time: a, then b. The stack removes its newest: b, then c (inserted after the first remove)." },
  { q: "Why does <code>LinkedQueue</code> keep a <code>tail</code> reference?",
    opts: ["So that dequeue is O(1)", "So that enqueue does not have to walk to the end of the list: O(1) instead of O(n)", "So that the queue can never be full", "Because Java requires it"],
    a: 1, why: "Enqueue adds after the last node. Without <code>tail</code> it would walk from <code>head</code> every time: O(n)." },
  { q: "A <code>CircularQueue</code> has capacity 6, <code>front = 4</code>, <code>size = 3</code>. Where does the next enqueue go?",
    opts: ["index 7", "index 6", "index 1", "index 0"],
    a: 2, why: "(front + size) % capacity = (4 + 3) % 6 = 1. The elements are at 4, 5 and 0, so the rear is at 0 and the next free cell is 1." },
  { q: "In the front / rear = −1 version with MAX = 4, <code>front = 2</code> and <code>rear = 1</code>. The queue is…",
    opts: ["empty", "full", "holding one element", "holding two elements"],
    a: 1, why: "(rear + 1) % MAX = 2 = front: the cell after the rear is the front, so all 4 cells (2, 3, 0, 1) are in use." },
  { q: "What does this print?",
    code: `PriorityQueue<Integer> pq = new PriorityQueue<>();
for (int x : new int[] {7, 2, 9, 4}) {
    pq.add(x);
}
pq.poll();
System.out.println(pq.poll() + " " + pq.peek());`,
    opts: ["2 4", "4 7", "7 2", "4 9"],
    a: 1, why: "It is a min-priority queue. The first poll removes 2; the second returns 4; then the smallest left is 7." },
  { q: "In <code>CircularDeque</code> with n = 5 and <code>front = 0</code>, where does <code>enqueueFront(x)</code> put x?",
    opts: ["index −1", "index 1", "index 4", "it is refused"],
    a: 2, why: "backward(0) = (0 − 1 + 5) % 5 = 4. In Java, <code>-1 % 5</code> is −1, which is why the <code>+ n</code> is needed." },
  { q: "The lazy two-stack queue performs n enqueues and then n dequeues. How many moves from <code>in</code> to <code>out</code> in total?",
    opts: ["n", "2n", "n(n − 1)/2", "n(n − 1)"],
    a: 0, why: "The first dequeue pours all n elements across once; every later dequeue pops from <code>out</code> with no moves. Each element moves at most once." },
];
