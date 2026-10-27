// Chapter content, adapted from notes/L07-lists.md. Code and outputs are copied from the note.

const demo = (name, title, instr, hint = "") =>
  `<div class="card demo" data-demo="${name}"><div class="head"><span class="title">${title}</span><span>${instr}</span></div>
   <div class="demo-body"></div>${hint ? `<p class="hint">${hint}</p>` : ""}</div>`;

const callout = (kind, label, body) => `<div class="callout ${kind}"><b>${label}</b>${body}</div>`;
const predict = (q, a) => callout("predict", "PREDICT", `<p>${q}</p><details class="reveal"><summary>Show the answer</summary>${a}</details>`);
const out = (text) => codeBlock(text, "out");

const SORTED_ARRAY_DEMO = `public class SortedArrayDemo {
    // Insert x into the sorted part a[0..n-1]. Returns how many elements were moved.
    static int insertSorted(int[] a, int n, int x) {
        int i = n - 1;
        int moves = 0;
        while (i >= 0 && a[i] > x) {
            a[i + 1] = a[i];          // shift one cell to the right
            i--;
            moves++;
        }
        a[i + 1] = x;
        return moves;
    }

    // Delete the first x from a[0..n-1]. Returns how many elements were moved, or -1.
    static int deleteValue(int[] a, int n, int x) {
        int k = 0;
        while (k < n && a[k] != x) {
            k++;
        }
        if (k == n) {
            return -1;                // not found
        }
        int moves = 0;
        for (int j = k; j < n - 1; j++) {
            a[j] = a[j + 1];          // shift one cell to the left
            moves++;
        }
        return moves;
    }

    static void print(int[] a, int n) {
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < n; i++) {
            sb.append(i > 0 ? ", " : "").append(a[i]);
        }
        System.out.println(sb.append("]"));
    }

    public static void main(String[] args) {
        int[] id = new int[10];       // capacity 10, fixed when the array is created
        int[] start = {1000, 1010, 1050, 2000, 2040};
        System.arraycopy(start, 0, id, 0, start.length);
        int n = start.length;
        print(id, n);

        int moved = insertSorted(id, n, 1005);
        n++;
        System.out.println("insert 1005: moved " + moved + " elements");
        print(id, n);

        moved = deleteValue(id, n, 1010);
        n--;
        System.out.println("delete 1010: moved " + moved + " elements");
        print(id, n);
    }
}`;

const DUMMY_HEAD_LIST = `public class DummyHeadList {
    private final Node head = new Node(0);   // dummy head: its element is never used

    // Insert x so that it becomes the p-th element (p = 1 is the front).
    public void insert(int x, int p) {
        Node tmpNode = new Node(x);
        Node prevNode = head;
        for (int i = 0; i < p - 1; i++) {
            if (prevNode.next == null) {
                break;
            }
            prevNode = prevNode.next;
        }
        tmpNode.next = prevNode.next;
        prevNode.next = tmpNode;
    }

    // Delete the p-th element; do nothing if there is no such element.
    public void delete(int p) {
        Node prevNode = head;
        for (int i = 0; i < p - 1; i++) {
            if (prevNode.next == null) {
                break;
            }
            prevNode = prevNode.next;
        }
        Node targetNode = prevNode.next;
        if (targetNode != null) {
            prevNode.next = targetNode.next;
        }
    }

    // Position (from 1) of the first occurrence of key, or -1.
    public int find(int key) {
        int pos = 1;
        for (Node curr = head.next; curr != null; curr = curr.next) {
            if (curr.element == key) {
                return pos;
            }
            pos++;
        }
        return -1;
    }

    public void makeEmpty() {
        head.next = null;
    }

    public void printList() {
        StringBuilder sb = new StringBuilder();
        for (Node curr = head.next; curr != null; curr = curr.next) {
            sb.append(curr.element).append(' ');
        }
        System.out.println(sb.length() == 0 ? "(empty)" : sb.toString().trim());
    }
}`;

const INT_ARRAY_LIST = `public class IntArrayList {
    private int[] data = new int[1];
    private int size = 0;
    private int copies = 0;             // elements copied by resizing, for the demo

    public void add(int x) {
        if (size == data.length) {      // full: make a new array twice as large
            int[] bigger = new int[2 * data.length];
            for (int i = 0; i < size; i++) {
                bigger[i] = data[i];
                copies++;
            }
            System.out.println("  full at size " + size + ": capacity " + data.length + " -> " + bigger.length);
            data = bigger;
        }
        data[size] = x;
        size++;
    }

    public int size() {
        return size;
    }

    public int capacity() {
        return data.length;
    }

    public int copies() {
        return copies;
    }
}`;

const LIST_HELPERS = `// Helpers for the demos: build a list from values, and print one.
public static Node fromValues(int... values) {
    Node head = null;
    for (int k = values.length - 1; k >= 0; k--) {
        Node node = new Node(values[k]);
        node.next = head;
        head = node;
    }
    return head;
}

public static String toText(Node head) {
    StringBuilder sb = new StringBuilder();
    for (Node curr = head; curr != null; curr = curr.next) {
        sb.append(sb.length() > 0 ? " " : "").append(curr.element);
    }
    return sb.toString();
}`;

const DOUBLY_LINKED_LIST = `public class DoublyLinkedList {
    private DNode head;                   // first node, or null
    private DNode tail;                   // last node, or null

    public void insertFirst(int x) {
        DNode node = new DNode(x);
        node.next = head;
        if (head == null) {
            tail = node;                  // it is also the last node
        } else {
            head.prev = node;
        }
        head = node;
    }

    public void insertLast(int x) {
        DNode node = new DNode(x);
        node.prev = tail;
        if (tail == null) {
            head = node;
        } else {
            tail.next = node;
        }
        tail = node;
    }

    // Insert x right after the node \`at\` (which must be in this list).
    public void insertAfter(DNode at, int x) {
        DNode node = new DNode(x);
        node.prev = at;                   // 1
        node.next = at.next;              // 2
        if (at.next == null) {
            tail = node;
        } else {
            at.next.prev = node;          // 3
        }
        at.next = node;                   // 4
    }

    // Unlink a node of this list in O(1): its neighbours point past it.
    public void remove(DNode node) {
        if (node.prev == null) {
            head = node.next;
        } else {
            node.prev.next = node.next;
        }
        if (node.next == null) {
            tail = node.prev;
        } else {
            node.next.prev = node.prev;
        }
    }

    public DNode deleteFirst() {
        DNode node = head;
        if (node != null) {
            remove(node);
        }
        return node;
    }

    public DNode deleteLast() {
        DNode node = tail;
        if (node != null) {
            remove(node);
        }
        return node;
    }

    public DNode find(int key) {
        for (DNode curr = head; curr != null; curr = curr.next) {
            if (curr.element == key) {
                return curr;
            }
        }
        return null;
    }

    public String forward() {
        StringBuilder sb = new StringBuilder();
        for (DNode curr = head; curr != null; curr = curr.next) {
            sb.append(curr.element).append(' ');
        }
        return sb.toString().trim();
    }

    public String backward() {
        StringBuilder sb = new StringBuilder();
        for (DNode curr = tail; curr != null; curr = curr.prev) {
            sb.append(curr.element).append(' ');
        }
        return sb.toString().trim();
    }
}`;

const ROUND_ROBIN = `class Process {
    String name;
    int remaining;
    Process next;

    Process(String name, int remaining) {
        this.name = name;
        this.remaining = remaining;
    }
}

public class RoundRobin {
    public static void main(String[] args) {
        String[] names = {"P1", "P2", "P3", "P4"};
        int[] burst = {5, 3, 1, 4};
        int quantum = 2;

        Process last = null;                     // build the circle, keeping the last node
        for (int k = 0; k < names.length; k++) {
            Process p = new Process(names[k], burst[k]);
            if (last == null) {
                p.next = p;
            } else {
                p.next = last.next;
                last.next = p;
            }
            last = p;
        }

        int time = 0;
        Process prev = last;                     // the node before the current one
        Process curr = last.next;
        StringBuilder order = new StringBuilder();
        while (curr != null) {
            int run = Math.min(quantum, curr.remaining);
            curr.remaining -= run;
            System.out.print("t=" + time + ".." + (time + run) + "  " + curr.name);
            time += run;
            if (curr.remaining > 0) {
                System.out.println("  (" + curr.remaining + " left)");
                prev = curr;
                curr = curr.next;
            } else {
                System.out.println("  done");
                order.append(curr.name).append(" at ").append(time).append("; ");
                if (curr.next == curr) {         // it was the last process
                    curr = null;
                } else {
                    prev.next = curr.next;       // unlink it from the circle
                    curr = curr.next;
                }
            }
        }
        System.out.println("finished: " + order.toString().trim());
    }
}`;

const LECTURE = {
  number: 7,
  title: "Lists",
  tagline: "Nodes, links, and not breaking the chain",
  lead: "The List ADT, and the linked structures that implement it: singly, doubly, circular and doubly circular lists. Every insertion, deletion and pointer trick here can be stepped through one reference at a time.",
  heroDemo: "linkMini",
  heroLabel: "insertAfter(1, 9) · link by link",
  heroCaption: "First point the new node at the rest of the list, then redirect the old link. Never the other way round.",
  whyTitle: "Why linked lists are worth learning",
  whySub: "Three ideas you will use in every later data structure",
  why: [
    ["Structure from references", "A node and a <b>next</b> reference are enough to build lists, stacks, queues, hash-table chains and, later, trees and graphs."],
    ["A trade-off you can name", "Arrays give O(1) <b>access</b>; linked lists give O(1) <b>insert and delete</b> once you are at the place. No structure fits every job."],
    ["Pointer discipline", "Save before you overwrite, handle the empty list, draw it first. The <b>two-pointer</b> tricks (middle, reverse, cycles) are classic interview questions."],
  ],
  ctaTitle: "Ready to link some nodes?",
  minutes: "About 75–90 minutes",
  videos: {
    "media/L07-1.mp4": "Lecture 7 · Part 1 — The List ADT and the singly linked list (9.1 min)",
    "media/L07-2.mp4": "Lecture 7 · Part 2 — Inserting and deleting without breaking the chain (10.9 min)",
    "media/L07-3.mp4": "Lecture 7 · Part 3 — A singly linked list in Java, and two classic exercises (8.3 min)",
    "media/L07-4.mp4": "Lecture 7 · Part 4 — Doubly, circular and doubly circular lists (10.9 min)",
  },
};

const CHAPTERS = [
  {
    slug: "1-adt", nav: "List ADT", title: "The List ADT",
    subtitle: "What a list is, and why an array is not always the right home for one",
    abstract: "A list is an ordered sequence with operations like find, insert and delete. An array stores it side by side, which makes access instant and insertion slow. A linked list makes the opposite trade.",
    tags: ["a1 … aN", "find / insert / delete", "array vs linked"],
    hero: "arrayMini", heroCaption: "Inserting 1005 into a sorted array: four elements shift right.",
    sections: [
      { id: "video-1", title: "Watch: The List ADT and the singly linked list", html: `
        <div class="card video" data-video="media/L07-1.mp4"></div>` },
      { id: "list", title: "What a list is", html: `
        <p>A <b>list</b> is an abstract data type (ADT) that holds a <em>finite</em> sequence of values in a definite <em>order</em>. The same value may appear more than once. We write a list as</p>
        <div class="math-block">a<sub>1</sub>, a<sub>2</sub>, a<sub>3</sub>, …, a<sub>N</sub></div>
        <ul><li>The <b>size</b> of the list is N. The list with N = 0 is the <b>empty list</b>.</li>
        <li>In a non-empty list, a<sub>1</sub> is the <b>first</b> element and a<sub>N</sub> the <b>last</b>.</li>
        <li>a<sub>i+1</sub> <b>follows</b> (succeeds) a<sub>i</sub> for i &lt; N, and a<sub>i−1</sub> <b>precedes</b> a<sub>i</sub> for i &gt; 1. a<sub>i+1</sub> is the <b>successor</b> of a<sub>i</sub>; a<sub>i−1</sub> is its <b>predecessor</b>.</li>
        <li>The first element has no predecessor and the last has no successor.</li></ul>
        <p>“Abstract” means the ADT says <em>what</em> a list can do, not <em>how</em> it is stored. An ADT is a set of values plus a set of operations; a data structure is one way to implement it. A list can live in an array or in a linked structure; this lecture is about the second.</p>` },
      { id: "ops", title: "The operations of the List ADT", html: `
        <p>Typical operations (the names vary from book to book):</p>
        <table><tr><th>operation</th><th>what it does</th><th>example on 34, 12, 52, 16, 12</th></tr>
        <tr><td><code>printList</code></td><td>print the elements in order</td><td><code>34 12 52 16 12</code></td></tr>
        <tr><td><code>makeEmpty</code></td><td>remove every element</td><td>the empty list</td></tr>
        <tr><td><code>find(key)</code></td><td>position of the <em>first</em> occurrence of <code>key</code></td><td><code>find(52)</code> → 3, <code>find(12)</code> → 2</td></tr>
        <tr><td><code>insert(key, pos)</code></td><td>insert <code>key</code> so that it becomes the element at position <code>pos</code></td><td><code>insert(99, 3)</code> → 34, 12, 99, 52, 16, 12</td></tr>
        <tr><td><code>delete(pos)</code> / <code>delete(key)</code></td><td>remove the element at a position, or the first one equal to a key</td><td><code>delete(52)</code> → 34, 12, 16, 12</td></tr>
        <tr><td><code>next(pos)</code>, <code>previous(pos)</code></td><td>the position after / before (optional)</td><td></td></tr></table>
        ${callout("note", "NOTE", `<p>Positions in these notes count from <b>1</b>, as on the slides (so <code>find(52)</code> is 3). Java's own <code>java.util.List</code> counts from 0; keep the two apart.</p>`)}` },
      { id: "array", title: "Why not just use an array?", html: `
        <p>An array stores its elements in <em>consecutive</em> memory cells. That gives instant access to element i, but it has two costs when the list changes.</p>
        <ol><li><b>The size is fixed.</b> <code>new int[100]</code> reserves exactly 100 cells. You must know an upper limit on the number of elements in advance, or you will run out of room.</li>
        <li><b>Inserting and deleting in the middle is expensive.</b> To keep the elements side by side, every element after the insertion point must move one cell to the right to make room; after a deletion, every element after the gap must move one cell left to close it.</li></ol>
        <p>Take a sorted array of student IDs, <code>id = [1000, 1010, 1050, 2000, 2040]</code>. To insert 1005 and keep the array sorted, the four IDs after 1000 must shift right. To delete 1010 next, the three IDs after it must shift left.</p>
        ${codeBlock(SORTED_ARRAY_DEMO)}
        ${out(`[1000, 1010, 1050, 2000, 2040]
insert 1005: moved 4 elements
[1000, 1005, 1010, 1050, 2000, 2040]
delete 1010: moved 3 elements
[1000, 1005, 1050, 2000, 2040]`)}
        ${demo("arrayShift", "Demo 1 · Shifting in an array", "← → keys step", "Amber: the cell being written. Grey: an old copy that will be overwritten. Try inserting 999 (everything moves) and 3000 (nothing moves).")}
        <p>In an array of n elements, inserting or deleting at position i moves n − i elements: none at the end, all n at the front, about n/2 on average. So insertion and deletion are <b>O(n)</b> in the worst and average case.</p>
        ${predict("In the same 5-element array, how many elements move to insert 999? To insert 3000?",
          "<p>999 goes to the front, so all 5 move; 3000 goes to the end, so none moves. Same array, best case O(1), worst case O(n).</p>")}` },
      { id: "linked", title: "Linked lists: what they give, what they cost", html: `
        <p>A <b>linked list</b> stores each element in its own small object, a <b>node</b>, together with a reference (a <em>pointer</em>, a <em>link</em>) to the next node. The nodes can be anywhere in memory; the links hold the order together.</p>
        <p><b>Advantages</b></p>
        <ul><li><em>Dynamic size.</em> The list grows by one node when you insert and shrinks by one when you delete. No upper limit has to be fixed in advance, and no space is reserved that is not used.</li>
        <li><em>Cheap insertion and deletion.</em> Nothing is shifted. Once you are at the right place, inserting or deleting changes one or two links: O(1).</li></ul>
        <p><b>Disadvantages</b></p>
        <ul><li><em>More memory per element.</em> Each node stores its element <em>and</em> at least one reference. For a list of <code>int</code>s the reference takes as much space as the data or more (4 bytes on a typical 64-bit JVM with compressed references, 8 without), and each Java object also has a header. An <code>int[]</code> needs 4 bytes per element; a node holding one <code>int</code> takes about 24.</li>
        <li><em>No random access.</em> To reach the i-th element you must follow i − 1 links from the front: O(i), not O(1). Binary search on a linked list is therefore pointless.</li>
        <li><em>Hard to go backwards.</em> From a node you can only reach its successor. Walking the list in reverse, or finding a node's predecessor, means starting again from the front. A doubly linked list (Chapter 5) fixes this at the cost of one more reference per node.</li></ul>
        <table><tr><th></th><th>array</th><th>singly linked list</th></tr>
        <tr><td>access element i</td><td>O(1)</td><td>O(i)</td></tr>
        <tr><td>insert / delete at the front</td><td>O(n) (shift everything)</td><td>O(1)</td></tr>
        <tr><td>insert / delete once you are at the place</td><td>O(n) (shift the rest)</td><td>O(1)</td></tr>
        <tr><td>size</td><td>fixed at creation</td><td>grows and shrinks</td></tr>
        <tr><td>extra memory</td><td>none (but unused capacity)</td><td>one reference per node + object header</td></tr></table>` },
      { id: "kinds", title: "Four kinds of linked list", html: `
        <table><tr><th>kind</th><th>links in each node</th><th>last node links to</th></tr>
        <tr><td>singly linked list</td><td><code>next</code></td><td><code>null</code></td></tr>
        <tr><td>doubly linked list</td><td><code>prev</code> and <code>next</code></td><td><code>null</code> (and the first node's <code>prev</code> is <code>null</code>)</td></tr>
        <tr><td>circular linked list</td><td><code>next</code></td><td>the first node</td></tr>
        <tr><td>doubly circular linked list</td><td><code>prev</code> and <code>next</code></td><td>the first node (and the first's <code>prev</code> is the last)</td></tr></table>
        ${demo("kinds", "Demo 2 · The four kinds", "step through them")}
        <p>Chapters 2–4 are about the singly linked list. Chapter 5 covers the other three.</p>` },
    ],
    takeaways: ["A list: finite, ordered, duplicates allowed.", "Array: O(1) access, O(n) insert/delete.", "Linked list: O(1) insert/delete in place, O(n) to get there."],
  },
  {
    slug: "2-singly", nav: "Singly linked", title: "The Singly Linked List",
    subtitle: "Nodes, the head, and walking the chain",
    abstract: "A chain of nodes, each holding an element and a reference to the next. Keep one reference, the head, and every other node is reached by following links.",
    tags: ["Node", "head", "traverse", "find"],
    hero: "walkMini", heroCaption: "find(52): curr follows the next references from the head.",
    sections: [
      { id: "nodes", title: "Nodes and the head", html: `
        <p>A <b>singly linked list</b> (SLL) is a chain of nodes. Each node has two parts: the <b>element</b> (the data) and <b><code>next</code></b>, a reference to the following node. The last node's <code>next</code> is <code>null</code>. To use the list you only need to keep one reference, the <b>head</b>, to the first node; everything else is reached by following <code>next</code> links.</p>
        ${codeBlock(CODE.node)}
        ${callout("note", "NOTE", `<p>On the slides the constructor is shown in a separate box; it belongs inside the class, as here. The Java implementation later in the slides calls the field <code>data</code> instead of <code>element</code> and builds nodes with <code>new Node()</code> and then sets the field. These notes use <code>element</code> and the constructor everywhere.</p>`)}
        <p>Three pictures of the same idea:</p>
        <ul><li><b>In memory</b> the nodes are wherever the JVM put them: node 1 at some address, node 2 somewhere else, and the order is held only by the <code>next</code> references.</li>
        <li><b>On paper</b> we draw the nodes in a row, left to right, with an arrow from each <code>next</code> to the node it refers to, and a slash or <code>null</code> for the last one.</li>
        <li><b>The empty list</b> is just <code>head == null</code>.</li></ul>
        ${callout("pattern", "TWO MEANINGS OF “HEAD”", `<p>In some code <code>head</code> is a reference to the first real node (the slides' Java implementation, Chapter 4). In other code <code>head</code> is an extra <b>dummy node</b> (a <em>header</em> or <em>sentinel</em>) that stores no element, and the first real node is <code>head.next</code> (the slides' <code>insert</code> and <code>delete</code>, §3.4). Both are common. A dummy head removes the special cases “the list is empty” and “we are changing the first node” from insertion and deletion. Always check which convention the code you read uses.</p>`)}` },
      { id: "traverse", title: "Traversal and search", html: `
        <p>To <b>traverse</b> a list is to visit every node once, from the head, following <code>next</code> until you reach <code>null</code>. Printing, counting and searching are all traversals:</p>
        ${codeBlock(CODE.traverse)}
        ${out(`34 -> 12 -> 52 -> 16 -> 12 -> null
size = 5
find(52) = 3
find(12) = 2
find(99) = -1
null`)}
        ${demo("memoryWalk", "Demo 3 · find(key), in memory", "set a key, then step", "The table is memory: each row is one node at some address. Only the <b>next</b> column holds the order together. Try key 12 (stops at the first match) and 99 (not found).")}
        <p><code>find(12)</code> returns 2, not 5: search stops at the <em>first</em> match. Traversal takes O(n) time; a search takes O(1) in the best case (the key is in the first node) and O(n) in the worst case (the key is last or absent).</p>
        ${predict("What happens if the loop condition is <code>curr.next != null</code> instead of <code>curr != null</code>?",
          "<p>The loop stops <em>at</em> the last node instead of after it, so <code>printList</code> never prints the last element, and on an empty list <code>curr.next</code> throws a <code>NullPointerException</code>. <code>curr.next != null</code> is the right test only when you want to stop on the last node, as <code>insertLast</code> does in §3.2.</p>")}` },
      { id: "operations", title: "The operations of a singly linked list", html: `
        <table><tr><th>operation</th><th>cases to handle</th></tr>
        <tr><td>insert at the beginning</td><td>make the new node the head</td></tr>
        <tr><td>insert at the end</td><td>the list is empty (new node is the only node) / it is not (new node goes after the last)</td></tr>
        <tr><td>insert after a given node</td><td>find that node, then link the new node in after it</td></tr>
        <tr><td>delete at the beginning</td><td>move the head to the second node</td></tr>
        <tr><td>delete at the end</td><td>the list has one node (it becomes empty) / it has more (the second-to-last becomes last)</td></tr>
        <tr><td>delete after a given node</td><td>find that node, then bypass the node after it</td></tr>
        <tr><td>traverse</td><td>visit each node</td></tr>
        <tr><td>search</td><td>compare each element with the key</td></tr></table>` },
    ],
    takeaways: ["Node = element + next.", "Keep the head; follow next until null.", "Search: O(1) best, O(n) worst."],
  },
  {
    slug: "3-insert-delete", nav: "Insert & delete", title: "Insertion and Deletion",
    subtitle: "Change one or two links — in the right order",
    abstract: "Every operation is a few reference changes plus, usually, a walk to the right place. The changes are O(1); the walk is what costs O(n). And the order of the changes decides whether the chain survives.",
    tags: ["insertFirst / Last / After", "insert(x, p)", "dummy head", "growing arrays"],
    hero: "code:insertAt", heroCaption: "The slides' insert(x, p), with a dummy head.",
    sections: [
      { id: "video-2", title: "Watch: Inserting and deleting without breaking the chain", html: `
        <div class="card video" data-video="media/L07-2.mp4"></div>` },
      { id: "draw", title: "Draw a picture before you code", html: `
        ${callout("pattern", "PATTERN · THREE RULES FOR EVERY LINKED-LIST OPERATION", `<ol>
          <li><b>Don't break the chain.</b> If the only reference to the rest of the list is overwritten before it has been saved somewhere, the rest of the list is lost (in Java the garbage collector reclaims it; in C it leaks).</li>
          <li><b>Consider the special cases</b>: the empty list, a list of one node, changing the first node, changing the last node, a position that does not exist.</li>
          <li><b>Draw a picture first</b>: boxes for the nodes, arrows for the links, and number the arrows in the order your code changes them.</li></ol>`)}` },
      { id: "ends", title: "Insert at the beginning and at the end", html: `
        <p><b>At the beginning.</b> Point the new node at the current first node, then make the head point at the new node. Two link changes, O(1). It also works on an empty list: the new node's <code>next</code> becomes <code>null</code>.</p>
        ${codeBlock(CODE.insertFirst)}
        <p>The order matters. If you write <code>head = newNode</code> first, the only reference to the old list is gone, and <code>newNode.next = head</code> then makes the new node point to itself.</p>
        <p><b>At the end.</b> Walk to the last node (the one whose <code>next</code> is <code>null</code>) and set its <code>next</code> to the new node. On an empty list there is no last node: the new node becomes the head. The walk makes this O(n); keeping an extra <code>tail</code> reference to the last node makes it O(1) (Chapter 5).</p>
        ${codeBlock(CODE.insertLast)}
        ${demo("linkInsert", "Demo 4 · Inserting into a singly linked list", "pick an operation, then step", "Clear the list box to try the empty list. Amber arrows are the reference that just changed; faded nodes are unreachable.")}` },
      { id: "after", title: "Insert after a given node", html: `
        <p>To insert after node <code>target</code>: first point the new node at <code>target</code>'s successor, then point <code>target</code> at the new node.</p>
        ${codeBlock(`newNode.next = target.next;       // 1. new node -> the rest of the list
target.next = newNode;            // 2. target -> new node`)}
        ${predict("What goes wrong if the two lines are swapped?",
          "<p>After <code>target.next = newNode</code>, the reference to the old successor is gone, and <code>newNode.next = target.next</code> sets <code>newNode.next</code> to <code>newNode</code> itself. The list now ends in a one-node loop and everything after <code>target</code> is lost. Any traversal then runs forever.</p>")}
        ${codeBlock(CODE.insertAfterWrong)}
        <p>The correct method, <code>insertAfter</code> in §4.2, does the same walk and then the two lines in the right order.</p>
        ${demo("linkAfter", "Demo 5 · Right order, wrong order", "switch to the bug and step", "With the bug, watch the nodes after the target fade out: nothing references them any more.")}` },
      { id: "position", title: "Insert at a position: insert(x, p)", html: `
        <p>The slides' <code>insert(x, p)</code> inserts <code>x</code> so that it becomes the p-th element. It uses a <b>dummy head</b>: <code>head</code> is a node with no element, and the first real node is <code>head.next</code>. To insert at position p we need the node at position p − 1, the <em>previous node</em>; the dummy head is “position 0”, so it is the previous node for p = 1.</p>
        ${codeBlock(CODE.insertAt)}
        <p>Because <code>prevNode</code> always exists (at worst it is the dummy head), there is no special case for an empty list or for inserting at the front: both are just “insert after <code>prevNode</code>”. If p is larger than size + 1, the loop stops at the last node and <code>x</code> is appended. If p ≤ 1, the loop does not run and <code>x</code> goes to the front.</p>
        ${demo("positional", "Demo 6 · insert(x, p) and delete(p)", "set p, then step", "The dashed node is the dummy head. Try p = 1, p = 6 and p = 100, and count the steps walked.")}
        <p><b>Running time.</b> The loop runs min(p − 1, size) times; the linking is O(1).</p>
        <ul><li>best case O(1): insert at the front (p = 1);</li><li>worst case O(n): insert at the end;</li><li>average case O(n): for a position chosen uniformly at random, about n/2 steps.</li></ul>` },
      { id: "delete", title: "Delete at the beginning, at the end, after a node", html: `
        <p><b>At the beginning.</b> Move the head to the second node. The old first node is no longer reachable, and Java's garbage collector reclaims it. O(1). On an empty list there is nothing to delete.</p>
        ${codeBlock(CODE.deleteFirst)}
        <p><b>At the end.</b> If the list has one node, it becomes empty. Otherwise walk to the <em>second-to-last</em> node (<code>curr.next.next == null</code>) and set its <code>next</code> to <code>null</code>. A singly linked list has no way back from the last node, so even with a <code>tail</code> reference this needs the walk: O(n).</p>
        ${codeBlock(CODE.deleteLast)}
        <p><b>After a given node.</b> To delete the node after <code>prev</code>, make <code>prev</code> skip it: <code>prev.next = prev.next.next</code>. The bypassed node is then unreachable.</p>
        ${codeBlock(`if (prev.next != null) {
    prev.next = prev.next.next;   // bypass the target node
}`)}
        ${demo("linkDelete", "Demo 7 · Deleting from a singly linked list", "pick an operation, then step", "Try a one-node list and the empty list for each operation.")}` },
      { id: "delete-p", title: "Delete at a position: delete(p)", html: `
        <p>With the dummy head, deleting the p-th element is: walk to the (p − 1)-th node, then bypass its successor.</p>
        ${codeBlock(CODE.deleteAt)}
        <p>If p is larger than the size, <code>prevNode</code> stops at the last node, <code>targetNode</code> is <code>null</code>, and nothing happens. Running time, as for <code>insert</code>: best O(1) (p = 1), worst O(n), average O(n). (On the slide the <code>for</code> body is an <code>if … break; else …</code> without braces. It is correct, but braces make it much harder to misread.) Choose <code>delete(p)</code> in Demo 6 to step through it.</p>
        <p>Here is a complete class with the dummy head, and a run of the examples from §1.2:</p>
        ${codeBlock(DUMMY_HEAD_LIST)}
        ${codeBlock(CODE.dummyHeadDemo)}
        ${out(`34 12 52 16 12
find(52) = 3
34 12 99 52 16 12
34 12 99 52 16 12 7
1 34 12 99 52 16 12 7
34 12 99 52 16 12 7
34 12 99 16 12 7
34 12 99 16 12 7
(empty)`)}
        ${predict("Starting from the empty list, what does <code>insert(5, 1); insert(6, 1); insert(7, 2); delete(3);</code> leave?",
          "<p><code>insert(5, 1)</code> → 5; <code>insert(6, 1)</code> → 6 5; <code>insert(7, 2)</code> → 6 7 5; <code>delete(3)</code> removes the third element, 5 → <code>6 7</code>.</p>")}` },
      { id: "arrays", title: "And in an array?", html: `
        <p>The slides end this part with a question: given an array <code>A</code> holding n elements, how do you insert a new element x? And how do you delete an element x from an array <code>B</code>?</p>
        <ul><li>If <code>A.length &gt; n</code> there is a free cell. To insert at the end, write <code>A[n] = x</code>. To insert at position i, shift <code>A[i..n-1]</code> one cell right first (§1.3).</li>
        <li>If <code>A.length == n</code> the array is full and cannot grow. Allocate a <b>new, larger array</b>, copy the n elements across, and insert into the new one. If the new array is <em>twice</em> as large, copies are rare: appending N elements one by one, starting from capacity 1, copies 1 + 2 + 4 + … &lt; 2N elements in total, so each append costs O(1) <em>on average</em> (amortized). This is how <code>java.util.ArrayList</code> works (it grows by 1.5× rather than 2×).</li>
        <li>To delete x from <code>B</code>, find it (O(n) unless <code>B</code> is sorted), then shift every later element one cell left to close the gap, and decrease the count. Nothing is freed: the capacity stays the same.</li></ul>
        ${codeBlock(INT_ARRAY_LIST)}
        ${codeBlock(CODE.growDemo)}
        ${out(`  full at size 1: capacity 1 -> 2
  full at size 2: capacity 2 -> 4
  full at size 4: capacity 4 -> 8
  full at size 8: capacity 8 -> 16
  full at size 16: capacity 16 -> 32
size 17, capacity 32
copies in total: 31 (fewer than 2 * 17 = 34)`)}
        ${demo("grow", "Demo 8 · A growing array", "drag N, then step", "Copies happen only when the array is full, and each resize doubles the room. The total stays below 2N.")}
        <p>A growing array fixes the “fixed size” problem, but not the “shift on insert” problem: inserting at the front of an <code>ArrayList</code> is still O(n). That is what linked lists are for.</p>` },
    ],
    takeaways: ["Link the new node to the rest first.", "Walk = O(n); relink = O(1).", "A dummy head removes the front special case."],
  },
  {
    slug: "4-java", nav: "Java & exercises", title: "A Singly Linked List in Java",
    subtitle: "The complete class, then two classic two-pointer exercises",
    abstract: "The slides' implementation with its empty-list bugs fixed, then the middle node with slow and fast pointers and in-place reversal with three pointers.",
    tags: ["SinglyLinkedList", "slow / fast", "reverse"],
    hero: "reverseMini", heroCaption: "reverseLinkedList: every next arrow turns round, one node at a time.",
    sections: [
      { id: "video-3", title: "Watch: A singly linked list in Java, and two classic exercises", html: `
        <div class="card video" data-video="media/L07-3.mp4"></div>` },
      { id: "uses", title: "Where singly linked lists are used", html: `
        <ul><li>To implement other basic structures: <b>stacks</b> (push and pop at the head, both O(1); Lecture 9) and <b>queues</b> (insert at the tail, delete at the head; Lecture 10).</li>
        <li>In <b>hash tables</b>, to keep all the keys that hash to the same slot (<em>separate chaining</em>, Lecture 18). The slide words this as “prevent the collision”; more exactly, chaining <em>resolves</em> collisions: colliding keys share one slot's list.</li>
        <li><b>Undo</b> in an editor: each new action is pushed on the front of a list of past actions.</li></ul>
        <p>Lecture 8 has more applications.</p>` },
      { id: "class", title: "The complete class", html: `
        <p>The slides' Java implementation keeps <code>head</code> as a reference to the first real node (no dummy). Here it is with the special cases handled.</p>
        ${callout("pitfall", "PITFALL · TWO BUGS IN THE SLIDE VERSION", `<p>Both are on the empty list: <code>deleteFirst()</code> reads <code>head.next</code> when <code>head</code> is <code>null</code>, and <code>insertLast</code> reads <code>current.next</code> when <code>head</code> is <code>null</code>; both throw <code>NullPointerException</code>. (Its comment on <code>insertLast</code> also says “insert a node at the start”.)</p>`)}
        ${codeBlock(CODE.singlyLinkedList)}
        <p>The slides' <code>deleteAfter(Node after)</code> takes a node and compares <code>temp.data != after.data</code>, so <code>main</code> has to build a throw-away node just to pass the value 1. Passing the key itself, as here, says the same thing more directly. Like the slide version, it looks for the <em>first</em> node with that key.</p>
        <p>The slides' test program, plus the special cases:</p>
        ${codeBlock(CODE.linkedListMain)}
        ${out(`head -> 1 -> 7 -> 6 -> 5 -> 2 -> null
head -> 1 -> 6 -> 5 -> 2 -> null
head -> 1 -> 6 -> 5 -> 9 -> 2 -> null
deleteFirst: 1
deleteLast: 2
head -> 6 -> 5 -> 9 -> null
search(9) = true, search(7) = false
deleteFirst on empty: null
head -> 42 -> null
isEmpty: true`)}
        <table><tr><th>operation</th><th><code>SinglyLinkedList</code> (head only)</th><th>time</th></tr>
        <tr><td><code>insertFirst</code>, <code>deleteFirst</code>, <code>isEmpty</code></td><td></td><td>O(1)</td></tr>
        <tr><td><code>insertLast</code>, <code>deleteLast</code></td><td>walk to the end</td><td>O(n)</td></tr>
        <tr><td><code>insertAfter</code>, <code>deleteAfter</code>, <code>search</code></td><td>walk to the key</td><td>O(1) best, O(n) worst</td></tr>
        <tr><td><code>printLinkedList</code></td><td>visit all</td><td>O(n)</td></tr></table>` },
      { id: "middle", title: "Exercise 1: the middle node", html: `
        <p><em>Given the head of a linked list, find its middle node.</em> The obvious way is two passes: count the nodes (n), then walk n/2 steps. The neat way is one pass with <b>two pointers</b>: <code>slow</code> moves one node per step and <code>fast</code> moves two. When <code>fast</code> reaches the end, <code>slow</code> has gone half as far, so it is in the middle. This is often called the <em>tortoise and hare</em> technique.</p>
        ${callout("note", "NOTE · THE TWO SLIDE VERSIONS DISAGREE", `<p>For an odd number of nodes the middle is clear. For an even number there are two middle nodes, and the two versions on the slides disagree: the <b>Java</b> version returns the <em>first</em> middle node, the <b>Python</b> version returns the <em>second</em>. Both are correct answers to different specifications; say which one you want. (LeetCode 876 asks for the second.)</p>`)}
        ${codeBlock(CODE.findMiddleNode)}
        ${codeBlock(CODE.middleNode)}
        ${demo("middle", "Demo 9 · Slow and fast pointers", "pick a version and n, then step", "Set n to an even number and compare the two versions.")}
        ${codeBlock(CODE.middleDemo)}
        ${out(`[1]  first middle: 1, second middle: 1
[1 2]  first middle: 1, second middle: 2
[1 2 3]  first middle: 2, second middle: 2
[1 2 3 4]  first middle: 2, second middle: 3
[1 2 3 4 5]  first middle: 3, second middle: 3
[1 2 3 4 5 6]  first middle: 3, second middle: 4`)}
        <p>Both methods, and the helpers <code>fromValues</code> and <code>toText</code>, live in a class <code>ListAlgorithms</code> in the note:</p>
        ${codeBlock(LIST_HELPERS)}
        <p>Trace <code>middleNode</code> on 1 2 3 4 5: (slow, fast) = (1, 1) → (2, 3) → (3, 5); now <code>fast.next</code> is <code>null</code>, so the loop stops and the answer is 3. Each step moves <code>fast</code> two nodes, so the loop runs about n/2 times: <b>O(n) time, O(1) extra space</b>, one pass.</p>
        ${predict("What do the two methods return for an empty list (<code>head == null</code>)?",
          "<p>Both return <code>null</code>: neither loop body runs. Code that then reads <code>.element</code> must check for <code>null</code> first.</p>")}` },
      { id: "reverse", title: "Exercise 2: reverse a linked list", html: `
        <p><em>Given the head of a linked list, reverse it.</em> Walk the list once and turn every <code>next</code> arrow around. Three references are needed:</p>
        <ul><li><code>previousNode</code>: the part already reversed (starts as <code>null</code>, which will be the new end);</li>
        <li><code>currentNode</code>: the node being processed;</li>
        <li><code>nextNode</code>: the rest of the list, saved <em>before</em> <code>currentNode.next</code> is overwritten.</li></ul>
        <p>That last point is rule 1 of §3.1: saving <code>nextNode</code> first is what keeps the chain from breaking. When <code>currentNode</code> becomes <code>null</code>, <code>previousNode</code> is the old last node, which is the new head.</p>
        ${codeBlock(CODE.reverse)}
        ${demo("reverse", "Demo 10 · Reversing in place", "edit the list, then step", "Each loop turn does four things: save, reverse, move previous, move current.")}
        ${codeBlock(CODE.reverseDemo)}
        ${out(`5 6 7 1 2
After reversing
2 1 7 6 5
old head now: 5 -> null`)}
        <p>The old head (5) is now the last node, so its <code>next</code> is <code>null</code>. Each node is visited once and only three extra references are used: <b>O(n) time, O(1) extra space</b>. (The slides' <code>main</code> uses a class <code>LinkedList</code> with <code>addToTheLast</code> and <code>printList</code> that are not shown; this program uses the helpers above instead. A class of your own named <code>LinkedList</code> also clashes in name with <code>java.util.LinkedList</code>, which is confusing.)</p>` },
    ],
    takeaways: ["Handle the empty list in every method.", "Slow/fast: the middle in one pass.", "Save next, then reverse the link."],
  },
  {
    slug: "5-variants", nav: "Other lists", title: "Doubly, Circular and Doubly Circular Lists",
    subtitle: "One more reference, or one link back to the start",
    abstract: "A prev reference makes backward traversal and deleting a node you hold O(1). A link from the last node back to the first makes both ends one step away. Each costs something different.",
    tags: ["prev / next", "tail", "round robin", "sentinel"],
    hero: "kindsMini", heroCaption: "Singly, doubly, circular, doubly circular.",
    sections: [
      { id: "video-4", title: "Watch: Doubly, circular and doubly circular lists", html: `
        <div class="card video" data-video="media/L07-4.mp4"></div>` },
      { id: "doubly", title: "The doubly linked list", html: `
        <p>A <b>doubly linked list</b> (DLL) node has three parts: the element, a reference <code>prev</code> to the previous node, and a reference <code>next</code> to the next node. The first node's <code>prev</code> and the last node's <code>next</code> are <code>null</code>. We usually keep both a <code>head</code> (first node) and a <code>tail</code> (last node).</p>
        ${codeBlock(CODE.dnode)}
        <p>In memory, as on the slides' table, each node is a row with three columns: data, the address of the previous node, and the address of the next node, with −1 standing for <code>null</code>. Head = 1; node 1 holds 13 (prev −1, next 4); node 4 holds 15 (prev 1, next 6); node 6 holds 19 (prev 4, next 8); node 8 holds 57 (prev 6, next −1). Following <code>next</code> from 1 gives 13, 15, 19, 57; following <code>prev</code> from 8 gives them backwards.</p>
        <p>What the extra link buys:</p>
        <ul><li><b>Backward traversal</b>: from the tail, follow <code>prev</code>.</li>
        <li><b>Delete a given node in O(1)</b>: the node knows its predecessor, so no search is needed. In a singly linked list you must walk from the head to find the predecessor: O(n).</li>
        <li><b>Delete the last node in O(1)</b> with a <code>tail</code> reference: <code>tail = tail.prev</code>.</li></ul>
        <p>What it costs: one more reference per node, and every insertion or deletion has up to four links to update instead of two. The operations are the same list as §2.3.</p>
        ${codeBlock(DOUBLY_LINKED_LIST)}
        ${demo("dll", "Demo 11 · Doubly linked insert and remove", "pick an operation, then step", "Upper arrows are next, lower arrows are prev. Remove the last node and notice that nothing walks.")}
        ${codeBlock(CODE.doublyDemo)}
        ${out(`forward:  13 15 19 57
backward: 57 19 15 13
after insertFirst(8), insertAfter(15, 17): 8 13 15 17 19 57
after remove(19): 8 13 15 17 57  |  backward: 57 17 15 13 8
deleteFirst: 8, deleteLast: 57
now: 13 15 17  |  backward: 17 15 13`)}
        <p>Printing the list both ways after every change is a good habit: a forgotten <code>prev</code> update shows up immediately as a backward list that disagrees with the forward one.</p>
        ${predict("In <code>insertAfter</code>, can step 4 (<code>at.next = node</code>) be done before step 3 (<code>at.next.prev = node</code>)?",
          "<p>No. After step 4, <code>at.next</code> is the new node, so step 3 would set the new node's own <code>prev</code> to itself, and the old successor's <code>prev</code> would still point at <code>at</code>. Update the far neighbour before you overwrite the link that leads to it.</p>")}
        <p><b>Applications of doubly linked lists</b></p>
        <ul><li><em>Back and forward navigation</em>: a browser's history, an image viewer's previous/next.</li>
        <li><em>Building other structures</em>: deques, LRU caches (a hash map plus a doubly linked list, so that any entry can be moved to the front in O(1)), and Java's own <code>java.util.LinkedList</code>, which is doubly linked.</li>
        <li><em>Music players</em>: previous and next song, as many times as you like.</li>
        <li><em>Operating systems</em>: a scheduler keeps processes in doubly linked lists, so it can unlink a process from one queue and link it into another in O(1).</li></ul>` },
      { id: "circular", title: "The circular linked list", html: `
        <p>A <b>circular linked list</b> is a singly linked list whose last node links back to the first instead of to <code>null</code>. There is no natural end: from <em>any</em> node you can reach every other node by following <code>next</code>, and the traversal ends when you come back to where you started.</p>
        ${callout("note", "NOTE", `<p>A circular <em>singly</em> linked list still only goes forward; “you can start anywhere” is not the same as “you can go in either direction”. The slide's wording “can traverse in any direction” means the first.</p>`)}
        <p>The memory table on the slides: start = 1; node 1 holds 13 (next 4), node 4 holds 15 (next 6), node 6 holds 19 (next 8), node 8 holds 57 (next <b>1</b>, back to the start).</p>
        <p>The trick is to keep a reference to the <b>last</b> node rather than the first. Then the first node is <code>last.next</code>, so both ends are one step away: insert at the beginning, insert at the end and delete at the beginning are all O(1). That is exactly what a queue needs (Lecture 10). Delete at the end still needs the predecessor of <code>last</code>: O(n).</p>
        ${codeBlock(CODE.circular)}
        ${codeBlock(CODE.circularDemo)}
        ${out(`13 -> 15 -> 19 -> 57 -> (back to 13)
search(19) = 3, search(99) = -1
deleteFirst: 13
15 -> 19 -> 57 -> (back to 15)
(empty)`)}
        <p>The traversals use <code>do … while</code>: the stopping test “are we back at the first node?” is true at the very start, so it must be checked <em>after</em> the first step. A plain <code>while (curr != null)</code> loop would never stop: there is no <code>null</code> in a circular list.</p>` },
      { id: "round-robin", title: "Round-robin scheduling", html: `
        <p><b>Applications of circular linked lists</b></p>
        <ul><li><em>Round-robin CPU scheduling.</em> The scheduler gives each ready process the same time slice (the <em>quantum</em>) in turn, round and round, until it finishes. It is fair and simple, and is one of the most widely used scheduling policies.</li>
        <li><em>Multiplayer games</em>: whose turn is next, in a loop.</li>
        <li><em>Queues</em>: with a reference to the last node, the front is <code>last.next</code> (above).</li></ul>
        <p>Here is round robin with quantum 2 on four processes. The current process runs for min(quantum, time left); a finished process is unlinked from the circle; then we move on to the next process.</p>
        ${codeBlock(ROUND_ROBIN)}
        ${out(`t=0..2  P1  (3 left)
t=2..4  P2  (1 left)
t=4..5  P3  done
t=5..7  P4  (2 left)
t=7..9  P1  (1 left)
t=9..10  P2  done
t=10..12  P4  done
t=12..13  P1  done
finished: P3 at 5; P2 at 10; P4 at 12; P1 at 13;`)}
        ${demo("roundRobin", "Demo 12 · Round robin on a circle", "change the times, then step", "The console prints exactly what the Java program prints. Watch prev.next skip a finished process.")}
        <p>Unlinking needs the <em>previous</em> process, so the loop carries <code>prev</code> along with <code>curr</code>; in a singly linked circle there is no other way back.</p>` },
      { id: "compare", title: "Doubly linked or circular: which is better?", html: `
        <p>Both overcome a limitation of the singly linked list. Which is better depends on which limitation hurts and what you are willing to pay: a trade-off between time and space.</p>
        <table><tr><th></th><th>singly</th><th>singly + <code>tail</code></th><th>doubly + <code>tail</code></th><th>circular (<code>last</code> only)</th><th>doubly circular</th></tr>
        <tr><td>references per node</td><td>1</td><td>1</td><td>2</td><td>1</td><td>2</td></tr>
        <tr><td>insert at front</td><td>O(1)</td><td>O(1)</td><td>O(1)</td><td>O(1)</td><td>O(1)</td></tr>
        <tr><td>insert at end</td><td>O(n)</td><td>O(1)</td><td>O(1)</td><td>O(1)</td><td>O(1)</td></tr>
        <tr><td>delete at front</td><td>O(1)</td><td>O(1)</td><td>O(1)</td><td>O(1)</td><td>O(1)</td></tr>
        <tr><td>delete at end</td><td>O(n)</td><td>O(n)</td><td>O(1)</td><td>O(n)</td><td>O(1)</td></tr>
        <tr><td>delete a node you hold</td><td>O(n)</td><td>O(n)</td><td>O(1)</td><td>O(n)</td><td>O(1)</td></tr>
        <tr><td>traverse backwards</td><td>no (O(n²) or reverse first)</td><td>no</td><td>yes</td><td>no</td><td>yes</td></tr></table>
        <ul><li>A <b>circular</b> list costs no extra space and makes both ends cheap with one reference, which is all a queue or a round-robin scheduler needs. It does not help with deleting at the end, deleting a given node, or going backwards.</li>
        <li>A <b>doubly linked</b> list costs one extra reference per node (and more link updates per operation) and in return makes every local operation O(1) and allows backward traversal.</li>
        <li>Neither speeds up <em>search</em>: finding a key is O(n) in every kind of linked list.</li></ul>` },
      { id: "doubly-circular", title: "The doubly circular linked list", html: `
        <p>A <b>doubly circular linked list</b> combines both: every node has <code>prev</code> and <code>next</code>, the last node's <code>next</code> is the first node, and the first node's <code>prev</code> is the last node. From the first node, <code>first.prev</code> reaches the end in one step.</p>
        <p>The slides' memory table: head = 1; A at 1 (prev 8, next 4), B at 4 (prev 1, next 6), C at 6 (prev 4, next 8), D at 8 (prev 6, next 1).</p>
        <p>A clean way to implement it is with a <b>sentinel</b> node (CLRS §10.2 calls it <code>L.nil</code>): a dummy node that sits in the circle between the last node and the first. In an empty list the sentinel's <code>prev</code> and <code>next</code> point to itself. Every real node then always has a real <code>prev</code> and <code>next</code>, so insertion and deletion have <b>no special cases</b> at all:</p>
        ${codeBlock(CODE.doublyCircular)}
        ${codeBlock(CODE.doublyCircularDemo)}
        ${out(`forward: 1 2 3  |  backward: 3 2 1
first.prev = 3 (through the sentinel)
after removing both ends: 2
empty: first() = null, forward = ""`)}
        <p>With the sentinel, <code>first.prev</code> is the sentinel and <code>first.prev.prev</code> is the last node. Without a sentinel (as in the slides' picture), <code>first.prev</code> is the last node directly, but then the empty list and the one-node list need special cases again.</p>` },
    ],
    takeaways: ["prev buys backward walks and O(1) delete.", "A circle with a last reference: both ends O(1).", "A sentinel removes every special case."],
  },
  {
    slug: "6-summary", nav: "Summary", title: "Summary and Practice",
    subtitle: "Check yourself, then link some nodes",
    abstract: "A one-page map of the lecture, six self-check questions, and seven exercises with solutions that were compiled and run.",
    tags: ["knowledge map", "self-check", "exercises"],
    hero: "toc",
    sections: [
      { id: "map", title: "Knowledge map", html: `<div class="map">
        <div class="card"><h3>The List ADT</h3><ul><li>Finite, ordered, duplicates allowed</li><li><code>find</code>, <code>insert</code>, <code>delete</code>, <code>printList</code>, <code>makeEmpty</code></li><li>An ADT; arrays and linked lists implement it</li></ul></div>
        <div class="card"><h3>Array</h3><ul><li>O(1) access to element i</li><li>Fixed size; O(n) insert/delete (shifting)</li><li>Doubling: amortized O(1) append</li></ul></div>
        <div class="card"><h3>Singly linked list</h3><ul><li>Node = element + <code>next</code>; keep <code>head</code></li><li>Relink O(1), walk O(n)</li><li>No random access, no way back</li></ul></div>
        <div class="card"><h3>Pointer discipline</h3><ul><li>Link the new node to the rest <b>first</b></li><li>Empty list, first node, last node</li><li>Dummy head removes front cases</li></ul></div>
        <div class="card"><h3>Two pointers</h3><ul><li>Slow/fast: the middle in one pass</li><li>prev/curr/next: reverse in place</li><li>O(n) time, O(1) space</li></ul></div>
        <div class="card"><h3>Variants</h3><ul><li><b>Doubly</b>: back walks, O(1) delete of a held node</li><li><b>Circular</b>: <code>last.next</code> is first</li><li><b>Doubly circular</b> + sentinel: no special cases</li></ul></div></div>` },
      { id: "check", title: "Check your understanding", html: `<div data-demo="quiz"><div class="demo-body"></div></div>` },
      { id: "exercises", title: "Exercises", html: `
        <p>★ trace · ★★ write · ★★★ extend. Test every method on the empty list and a one-node list first. The classes <code>Node</code>, <code>DummyHeadList</code> and <code>ListAlgorithms</code> are the ones from the chapters.</p>
        <h3>Exercise 1 ★ (trace)</h3>
        <p>Starting from an empty <code>DummyHeadList</code>, what is printed by <code>insert(4, 1); insert(8, 2); insert(6, 2); insert(2, 1); delete(3); printList();</code>?</p>
        <details class="reveal"><summary>Solution</summary><p>4 → 4 8 → 4 6 8 → 2 4 6 8 → delete the 3rd (6) → <code>2 4 8</code>.</p></details>
        <h3>Exercise 2 ★ (find the bug)</h3>
        <p>This code should delete the last node of a list with at least two nodes. What does it do instead?</p>
        ${codeBlock(`Node curr = head;
while (curr.next != null) {
    curr = curr.next;
}
curr = null;`)}
        <details class="reveal"><summary>Solution</summary><p>It walks to the last node and then sets the <em>local variable</em> <code>curr</code> to <code>null</code>. No link changes, so the list is unchanged. To remove the last node you must change the <code>next</code> of the node <em>before</em> it: stop at the second-to-last node (<code>curr.next.next == null</code>) and set <code>curr.next = null</code>.</p></details>
        <h3>Exercise 3 ★★ (delete by key)</h3>
        <p>Write <code>static Node removeFirst(Node head, int key)</code> that deletes the first node holding <code>key</code> and returns the (possibly new) head.</p>
        <details class="reveal"><summary>Solution</summary>${codeBlock(`public class RemoveDemo {
    static Node removeFirst(Node head, int key) {
        if (head == null) {
            return null;
        }
        if (head.element == key) {           // the first node: the head changes
            return head.next;
        }
        Node prev = head;
        while (prev.next != null && prev.next.element != key) {
            prev = prev.next;
        }
        if (prev.next != null) {
            prev.next = prev.next.next;      // bypass it
        }
        return head;
    }

    public static void main(String[] args) {
        Node head = ListAlgorithms.fromValues(34, 12, 52, 16, 12);
        head = removeFirst(head, 12);
        System.out.println(ListAlgorithms.toText(head));
        head = removeFirst(head, 34);
        System.out.println(ListAlgorithms.toText(head));
        head = removeFirst(head, 99);
        System.out.println(ListAlgorithms.toText(head));
    }
}`)}${out(`34 52 16 12
52 16 12
52 16 12`)}</details>
        <h3>Exercise 4 ★★ (k-th from the end)</h3>
        <p>Return the k-th node from the end in one pass (k = 1 is the last node), or <code>null</code> if the list is shorter than k. Hint: two pointers, with the first one k nodes ahead.</p>
        <details class="reveal"><summary>Solution</summary>${codeBlock(`public class KthFromEnd {
    static Node kthFromEnd(Node head, int k) {
        Node lead = head;
        for (int i = 0; i < k; i++) {          // move lead k nodes ahead
            if (lead == null) {
                return null;
            }
            lead = lead.next;
        }
        Node trail = head;
        while (lead != null) {                 // move both until lead falls off the end
            lead = lead.next;
            trail = trail.next;
        }
        return trail;
    }

    public static void main(String[] args) {
        Node head = ListAlgorithms.fromValues(5, 6, 7, 1, 2);
        System.out.println(kthFromEnd(head, 1).element + " " + kthFromEnd(head, 2).element + " "
                + kthFromEnd(head, 5).element + " " + kthFromEnd(head, 6));
    }
}`)}${out("2 1 5 null")}</details>
        <h3>Exercise 5 ★★ (does it loop?)</h3>
        <p>A bug like the swapped lines of §3.3 can make a list end in a cycle. Write <code>hasCycle(head)</code> in O(n) time and O(1) space. Hint: the slow and fast pointers of §4.3. If there is a cycle, <code>fast</code> eventually laps <code>slow</code>.</p>
        <details class="reveal"><summary>Solution</summary>${codeBlock(`public class CycleDemo {
    static boolean hasCycle(Node head) {
        Node slow = head;
        Node fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
            if (slow == fast) {                // same node, not just the same value
                return true;
            }
        }
        return false;                          // fast reached the end
    }

    public static void main(String[] args) {
        Node head = ListAlgorithms.fromValues(1, 2, 3, 4, 5);
        System.out.println(hasCycle(head));
        head.next.next.next.next.next = head.next.next;   // 5 -> 3: a cycle
        System.out.println(hasCycle(head));
    }
}`)}${out("false\ntrue")}<p>Inside the cycle, the gap between <code>fast</code> and <code>slow</code> shrinks by one node per step, so they meet within one lap. (This is Floyd's cycle-finding algorithm.)</p></details>
        <h3>Exercise 6 ★★★ (merge)</h3>
        <p>Merge two sorted lists into one sorted list by relinking the nodes, without creating new ones (except a dummy head). Running time?</p>
        <details class="reveal"><summary>Solution</summary>${codeBlock(`public class MergeDemo {
    static Node merge(Node a, Node b) {
        Node dummy = new Node(0);              // a dummy head saves the "first node" special case
        Node tail = dummy;
        while (a != null && b != null) {
            if (a.element <= b.element) {
                tail.next = a;
                a = a.next;
            } else {
                tail.next = b;
                b = b.next;
            }
            tail = tail.next;
        }
        tail.next = (a != null) ? a : b;       // append whatever is left
        return dummy.next;
    }

    public static void main(String[] args) {
        Node a = ListAlgorithms.fromValues(1, 4, 9, 12);
        Node b = ListAlgorithms.fromValues(2, 3, 10);
        System.out.println(ListAlgorithms.toText(merge(a, b)));
        System.out.println(ListAlgorithms.toText(merge(null, ListAlgorithms.fromValues(7))));
    }
}`)}${out("1 2 3 4 9 10 12\n7")}<p>O(m + n) time, where m and n are the lengths: each step attaches one node. O(1) extra space. This is the merge step of merge sort (Lecture 4) on linked lists, where it needs no extra array.</p></details>
        <h3>Exercise 7 ★★★ (reverse recursively)</h3>
        <p>Reverse a list with recursion instead of a loop. Hint: reverse the rest of the list first (leap of faith), then attach the first node at its end.</p>
        <details class="reveal"><summary>Solution</summary>${codeBlock(`public class ReverseRecursive {
    static Node reverse(Node head) {
        if (head == null || head.next == null) {
            return head;                       // 0 or 1 node: already reversed
        }
        Node newHead = reverse(head.next);     // the rest, reversed; head.next is now its last node
        head.next.next = head;                 // attach head after it
        head.next = null;                      // head is the new last node
        return newHead;
    }

    public static void main(String[] args) {
        System.out.println(ListAlgorithms.toText(reverse(ListAlgorithms.fromValues(5, 6, 7, 1, 2))));
    }
}`)}${out("2 1 7 6 5")}<p>Still O(n) time, but O(n) stack space: one frame per node. For a list of a million nodes it throws <code>StackOverflowError</code>, so the loop of §4.4 is the better choice in Java.</p></details>` },
      { id: "terms", title: "Key terms and further reading", html: `
        <p class="tags">${["list", "List ADT", "size", "empty list", "predecessor", "successor", "node", "element", "next reference", "head", "dummy head (header, sentinel)", "traversal", "singly linked list", "doubly linked list", "prev reference", "tail", "circular linked list", "doubly circular linked list", "random access", "dynamic array (doubling)", "amortized O(1)", "slow and fast pointers", "in-place reversal", "round-robin scheduling"].map((t) => `<span class="tag">${t}</span>`).join("")}</p>
        <ul><li>T. H. Cormen, C. E. Leiserson, R. L. Rivest, C. Stein, <em>Introduction to Algorithms</em>, 3rd ed., MIT Press 2009, §10.2 Linked lists (sentinels, doubly linked lists).</li>
        <li>M. A. Weiss, <em>Data Structures and Algorithm Analysis in Java</em>, 3rd ed., Pearson 2012, Chapter 3 (§3.1–3.5: the List ADT, <code>ArrayList</code> and <code>LinkedList</code>).</li>
        <li>Java Tutor, to watch references being created and changed: <a href="https://pythontutor.com/java.html" target="_blank" rel="noopener">pythontutor.com/java.html</a></li></ul>` },
    ],
    takeaways: ["Arrays: access. Linked lists: relinking.", "Save before you overwrite; handle empty.", "More links, more O(1) operations, more memory."],
  },
];

const QUIZ = [
  { q: "A singly linked list keeps only a <code>head</code> reference. Which operation is O(1)?",
    opts: ["insert at the end", "delete at the end", "insert at the front", "read the i-th element"],
    a: 2, why: "Inserting at the front changes two references. The end needs a walk of n − 1 steps, and the i-th element needs i − 1 steps." },
  { q: "In <code>insertAfter</code>, what happens if <code>target.next = newNode;</code> runs <em>before</em> <code>newNode.next = target.next;</code>?",
    opts: ["Nothing: the order does not matter", "The new node ends up at the front", "Everything after <code>target</code> is lost and the new node points to itself", "A <code>NullPointerException</code> is thrown"],
    a: 2, why: "The only reference to the old successor is overwritten first. Then <code>target.next</code> is the new node, so the new node links to itself." },
  { q: "A <code>DummyHeadList</code> holds 34 12 52. What does <code>delete(7)</code> do?",
    opts: ["Deletes 52, the last element", "Nothing: there is no 7th element", "Throws a <code>NullPointerException</code>", "Deletes the dummy head"],
    a: 1, why: "The loop stops at the last node when <code>prevNode.next == null</code>; then <code>targetNode</code> is <code>null</code>, so nothing is bypassed." },
  { q: "On the list 1 2 3 4 5 6, what do <code>findMiddleNode</code> (the slides' Java) and <code>middleNode</code> (the slides' Python) return?",
    opts: ["3 and 3", "3 and 4", "4 and 3", "4 and 4"],
    a: 1, why: "For an even length the Java version returns the first middle node (3) and the Python version the second (4)." },
  { q: "You hold a reference to a node in the middle of a list. In which list can you delete that node in O(1)?",
    opts: ["Singly linked list", "Circular linked list with a <code>last</code> reference", "Doubly linked list", "None of them"],
    a: 2, why: "Deleting needs the predecessor. Only the doubly linked node knows it (<code>node.prev</code>); the others need a walk from the start." },
  { q: "A circular singly linked list keeps only a reference to its <b>last</b> node. Which operation is still O(n)?",
    opts: ["insert at the front", "insert at the end", "delete at the front", "delete at the end"],
    a: 3, why: "The front is <code>last.next</code>, so the first three are O(1). Deleting the last node needs its predecessor, which takes a walk round the circle." },
];
