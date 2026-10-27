// Interactive demos for Lecture 7 (Lists). Every code panel is copied from
// notes/L07-lists.md (checked by tools/check.py); the JS twins below replay what the Java
// does, link by link, and give the same results as the runs shown in the note.

const CODE = {
  insertSorted: `static int insertSorted(int[] a, int n, int x) {
    int i = n - 1;
    int moves = 0;
    while (i >= 0 && a[i] > x) {
        a[i + 1] = a[i];          // shift one cell to the right
        i--;
        moves++;
    }
    a[i + 1] = x;
    return moves;
}`,
  deleteValue: `static int deleteValue(int[] a, int n, int x) {
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
}`,
  node: `class Node {
    int element;
    Node next;

    Node(int x) {
        element = x;
        next = null;
    }
}`,
  traverse: `public class TraverseDemo {
    static void printList(Node head) {
        Node curr = head;
        while (curr != null) {
            System.out.print(curr.element + " -> ");
            curr = curr.next;             // follow the link
        }
        System.out.println("null");
    }

    static int size(Node head) {
        int count = 0;
        for (Node curr = head; curr != null; curr = curr.next) {
            count++;
        }
        return count;
    }

    // Position (from 1) of the first node holding key, or -1 if there is none.
    static int find(Node head, int key) {
        int pos = 1;
        for (Node curr = head; curr != null; curr = curr.next) {
            if (curr.element == key) {
                return pos;
            }
            pos++;
        }
        return -1;
    }

    public static void main(String[] args) {
        Node head = new Node(34);
        head.next = new Node(12);
        head.next.next = new Node(52);
        head.next.next.next = new Node(16);
        head.next.next.next.next = new Node(12);

        printList(head);
        System.out.println("size = " + size(head));
        System.out.println("find(52) = " + find(head, 52));
        System.out.println("find(12) = " + find(head, 12));
        System.out.println("find(99) = " + find(head, 99));
        printList(null);                  // the empty list
    }
}`,
  find: `static int find(Node head, int key) {
    int pos = 1;
    for (Node curr = head; curr != null; curr = curr.next) {
        if (curr.element == key) {
            return pos;
        }
        pos++;
    }
    return -1;
}`,
  insertFirst: `public void insertFirst(int x) {
    Node newNode = new Node(x);
    newNode.next = head;          // 1. the new node points to the old first node
    head = newNode;               // 2. the head points to the new node
}`,
  insertLast: `public void insertLast(int x) {
    Node newNode = new Node(x);
    if (head == null) {           // case 1: the new node is the only node
        head = newNode;
        return;
    }
    Node current = head;          // case 2: walk to the last node
    while (current.next != null) {
        current = current.next;
    }
    current.next = newNode;       // the old last node points to the new one
}`,
  insertAfter: `public boolean insertAfter(int key, int x) {
    Node target = head;
    while (target != null && target.element != key) {
        target = target.next;
    }
    if (target == null) {
        return false;
    }
    Node newNode = new Node(x);
    newNode.next = target.next;
    target.next = newNode;
    return true;
}`,
  insertAfterWrong: `public boolean insertAfterWrong(int key, int x) {   // BUG: the links in the wrong order
    Node target = head;
    while (target != null && target.element != key) {
        target = target.next;
    }
    if (target == null) {
        return false;
    }
    Node newNode = new Node(x);
    target.next = newNode;        // the rest of the list is now unreachable...
    newNode.next = target.next;   // ...and newNode points to itself
    return true;
}`,
  deleteFirst: `public Node deleteFirst() {
    if (head == null) {
        return null;              // nothing to delete
    }
    Node temp = head;
    head = head.next;             // the second node (or null) becomes the first
    return temp;
}`,
  deleteLast: `public Node deleteLast() {
    if (head == null) {
        return null;
    }
    if (head.next == null) {      // one node: the list becomes empty
        Node temp = head;
        head = null;
        return temp;
    }
    Node curr = head;
    while (curr.next.next != null) {   // stop at the second-to-last node
        curr = curr.next;
    }
    Node temp = curr.next;
    curr.next = null;             // it is now the last node
    return temp;
}`,
  deleteAfter: `public void deleteAfter(int key) {
    Node temp = head;
    while (temp != null && temp.element != key) {
        temp = temp.next;
    }
    if (temp != null && temp.next != null) {
        temp.next = temp.next.next;
    }
}`,
  insertAt: `void insert(int x, int p) {
    Node tmpNode = new Node(x);           // the new node
    Node prevNode = head;                 // start at the dummy head (position 0)
    for (int i = 0; i < p - 1; i++) {     // move p - 1 steps
        if (prevNode.next == null) {      // p is past the end: stop at the last node
            break;
        }
        prevNode = prevNode.next;
    }
    tmpNode.next = prevNode.next;         // link the new node in after prevNode
    prevNode.next = tmpNode;
}`,
  deleteAt: `void delete(int p) {
    Node prevNode = head;                 // the dummy head
    for (int i = 0; i < p - 1; i++) {     // go to position p - 1
        if (prevNode.next == null) {
            break;
        }
        prevNode = prevNode.next;
    }
    Node targetNode = prevNode.next;
    if (targetNode != null) {             // p is past the end: nothing to delete
        prevNode.next = targetNode.next;  // bypass the target node
    }
}`,
  dummyHeadDemo: `public class DummyHeadDemo {
    public static void main(String[] args) {
        DummyHeadList list = new DummyHeadList();
        int[] values = {34, 12, 52, 16, 12};
        for (int k = 0; k < values.length; k++) {
            list.insert(values[k], k + 1);
        }
        list.printList();
        System.out.println("find(52) = " + list.find(52));

        list.insert(99, 3);
        list.printList();
        list.insert(7, 100);       // past the end: appended
        list.printList();
        list.insert(1, 0);         // p <= 1: goes to the front
        list.printList();

        list.delete(1);            // the first element
        list.printList();
        list.delete(list.find(52));
        list.printList();
        list.delete(100);          // no such position: nothing happens
        list.printList();
        list.makeEmpty();
        list.printList();
    }
}`,
  add: `public void add(int x) {
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
}`,
  growDemo: `public class GrowDemo {
    public static void main(String[] args) {
        IntArrayList list = new IntArrayList();
        for (int x = 1; x <= 17; x++) {
            list.add(x);
        }
        System.out.println("size " + list.size() + ", capacity " + list.capacity());
        System.out.println("copies in total: " + list.copies() + " (fewer than 2 * 17 = 34)");
    }
}`,
  singlyLinkedList: `public class SinglyLinkedList {
    private Node head;                    // the first node, or null if the list is empty

    public boolean isEmpty() {
        return head == null;
    }

    public void insertFirst(int x) {
        Node newNode = new Node(x);
        newNode.next = head;
        head = newNode;
    }

    public void insertLast(int x) {
        Node newNode = new Node(x);
        if (head == null) {
            head = newNode;
            return;
        }
        Node current = head;
        while (current.next != null) {
            current = current.next;
        }
        current.next = newNode;
    }

    // Insert x after the first node holding key. Returns false if key is not in the list.
    public boolean insertAfter(int key, int x) {
        Node target = head;
        while (target != null && target.element != key) {
            target = target.next;
        }
        if (target == null) {
            return false;
        }
        Node newNode = new Node(x);
        newNode.next = target.next;
        target.next = newNode;
        return true;
    }

    public Node deleteFirst() {
        if (head == null) {
            return null;
        }
        Node temp = head;
        head = head.next;
        return temp;
    }

    public Node deleteLast() {
        if (head == null) {
            return null;
        }
        if (head.next == null) {
            Node temp = head;
            head = null;
            return temp;
        }
        Node curr = head;
        while (curr.next.next != null) {
            curr = curr.next;
        }
        Node temp = curr.next;
        curr.next = null;
        return temp;
    }

    // Delete the node right after the first node holding key (if both exist).
    public void deleteAfter(int key) {
        Node temp = head;
        while (temp != null && temp.element != key) {
            temp = temp.next;
        }
        if (temp != null && temp.next != null) {
            temp.next = temp.next.next;
        }
    }

    public boolean search(int key) {
        for (Node curr = head; curr != null; curr = curr.next) {
            if (curr.element == key) {
                return true;
            }
        }
        return false;
    }

    public void printLinkedList() {
        StringBuilder sb = new StringBuilder("head -> ");
        for (Node curr = head; curr != null; curr = curr.next) {
            sb.append(curr.element).append(" -> ");
        }
        System.out.println(sb.append("null"));
    }
}`,
  linkedListMain: `public class LinkedListMain {
    public static void main(String[] args) {
        SinglyLinkedList myLinkedList = new SinglyLinkedList();
        myLinkedList.insertFirst(5);
        myLinkedList.insertFirst(6);
        myLinkedList.insertFirst(7);
        myLinkedList.insertFirst(1);
        myLinkedList.insertLast(2);
        myLinkedList.printLinkedList();       // 1 -> 7 -> 6 -> 5 -> 2

        myLinkedList.deleteAfter(1);          // removes 7, the node after 1
        myLinkedList.printLinkedList();

        myLinkedList.insertAfter(5, 9);
        myLinkedList.printLinkedList();
        System.out.println("deleteFirst: " + myLinkedList.deleteFirst().element);
        System.out.println("deleteLast: " + myLinkedList.deleteLast().element);
        myLinkedList.printLinkedList();
        System.out.println("search(9) = " + myLinkedList.search(9) + ", search(7) = " + myLinkedList.search(7));

        SinglyLinkedList empty = new SinglyLinkedList();
        System.out.println("deleteFirst on empty: " + empty.deleteFirst());
        empty.insertLast(42);                 // the slide version throws here
        empty.printLinkedList();
        empty.deleteLast();
        System.out.println("isEmpty: " + empty.isEmpty());
    }
}`,
  findMiddleNode: `public static Node findMiddleNode(Node head) {
    Node slowPointer, fastPointer;
    slowPointer = fastPointer = head;
    while (fastPointer != null) {
        fastPointer = fastPointer.next;
        if (fastPointer != null && fastPointer.next != null) {
            slowPointer = slowPointer.next;
            fastPointer = fastPointer.next;
        }
    }
    return slowPointer;
}`,
  middleNode: `public static Node middleNode(Node head) {
    Node slow = head;
    Node fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
    }
    return slow;
}`,
  reverse: `public static Node reverseLinkedList(Node currentNode) {
    Node previousNode = null;
    Node nextNode;
    while (currentNode != null) {
        nextNode = currentNode.next;      // save the rest of the list
        currentNode.next = previousNode;  // reverse this link
        previousNode = currentNode;       // move both pointers one node on
        currentNode = nextNode;
    }
    return previousNode;
}`,
  reverseDemo: `public class ReverseDemo {
    public static void main(String[] args) {
        Node head = ListAlgorithms.fromValues(5, 6, 7, 1, 2);
        System.out.println(ListAlgorithms.toText(head));
        Node reverseHead = ListAlgorithms.reverseLinkedList(head);
        System.out.println("After reversing");
        System.out.println(ListAlgorithms.toText(reverseHead));
        System.out.println("old head now: " + head.element + " -> " + head.next);
    }
}`,
  middleDemo: `public class MiddleDemo {
    public static void main(String[] args) {
        for (int n = 1; n <= 6; n++) {
            int[] values = new int[n];
            for (int k = 0; k < n; k++) {
                values[k] = k + 1;
            }
            Node head = ListAlgorithms.fromValues(values);
            System.out.println("[" + ListAlgorithms.toText(head) + "]  first middle: "
                    + ListAlgorithms.findMiddleNode(head).element
                    + ", second middle: " + ListAlgorithms.middleNode(head).element);
        }
    }
}`,
  dnode: `class DNode {
    int element;
    DNode prev;
    DNode next;

    DNode(int x) {
        element = x;
    }
}`,
  dllInsertAfter: `public void insertAfter(DNode at, int x) {
    DNode node = new DNode(x);
    node.prev = at;                   // 1
    node.next = at.next;              // 2
    if (at.next == null) {
        tail = node;
    } else {
        at.next.prev = node;          // 3
    }
    at.next = node;                   // 4
}`,
  dllRemove: `public void remove(DNode node) {
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
}`,
  doublyDemo: `public class DoublyDemo {
    public static void main(String[] args) {
        DoublyLinkedList list = new DoublyLinkedList();
        list.insertLast(13);
        list.insertLast(15);
        list.insertLast(19);
        list.insertLast(57);
        System.out.println("forward:  " + list.forward());
        System.out.println("backward: " + list.backward());

        list.insertFirst(8);
        list.insertAfter(list.find(15), 17);
        System.out.println("after insertFirst(8), insertAfter(15, 17): " + list.forward());

        list.remove(list.find(19));          // O(1) once we hold the node
        System.out.println("after remove(19): " + list.forward() + "  |  backward: " + list.backward());

        System.out.println("deleteFirst: " + list.deleteFirst().element + ", deleteLast: " + list.deleteLast().element);
        System.out.println("now: " + list.forward() + "  |  backward: " + list.backward());
    }
}`,
  circular: `public class CircularLinkedList {
    private Node last;                    // the last node; last.next is the first. null if empty

    public boolean isEmpty() {
        return last == null;
    }

    public void insertFirst(int x) {
        Node node = new Node(x);
        if (last == null) {
            node.next = node;             // one node: it links to itself
            last = node;
        } else {
            node.next = last.next;        // new node -> old first
            last.next = node;             // last -> new node, which is now first
        }
    }

    public void insertLast(int x) {
        insertFirst(x);                   // put it between last and first...
        last = last.next;                 // ...and call it the last
    }

    public int deleteFirst() {            // the list must not be empty
        Node first = last.next;
        if (first == last) {
            last = null;                  // it was the only node
        } else {
            last.next = first.next;
        }
        return first.element;
    }

    // Position (from 1) of the first occurrence of key, or -1.
    public int search(int key) {
        if (last == null) {
            return -1;
        }
        Node curr = last.next;
        int pos = 1;
        do {
            if (curr.element == key) {
                return pos;
            }
            curr = curr.next;
            pos++;
        } while (curr != last.next);      // stop when we are back at the first node
        return -1;
    }

    public String toText() {
        if (last == null) {
            return "(empty)";
        }
        StringBuilder sb = new StringBuilder();
        Node curr = last.next;
        do {
            sb.append(curr.element).append(" -> ");
            curr = curr.next;
        } while (curr != last.next);
        return sb.append("(back to ").append(last.next.element).append(")").toString();
    }
}`,
  circularDemo: `public class CircularDemo {
    public static void main(String[] args) {
        CircularLinkedList list = new CircularLinkedList();
        list.insertLast(15);
        list.insertLast(19);
        list.insertLast(57);
        list.insertFirst(13);
        System.out.println(list.toText());
        System.out.println("search(19) = " + list.search(19) + ", search(99) = " + list.search(99));
        System.out.println("deleteFirst: " + list.deleteFirst());
        System.out.println(list.toText());
        while (!list.isEmpty()) {
            list.deleteFirst();
        }
        System.out.println(list.toText());
    }
}`,
  roundRobinLoop: `while (curr != null) {
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
}`,
  doublyCircular: `public class DoublyCircularList {
    private final DNode sentinel = new DNode(0);   // sentinel.next = first, sentinel.prev = last

    public DoublyCircularList() {
        sentinel.next = sentinel;
        sentinel.prev = sentinel;
    }

    // Link a new node holding x in between a and its successor.
    private void linkAfter(DNode a, int x) {
        DNode node = new DNode(x);
        node.prev = a;
        node.next = a.next;
        a.next.prev = node;
        a.next = node;
    }

    public void insertFirst(int x) {
        linkAfter(sentinel, x);
    }

    public void insertLast(int x) {
        linkAfter(sentinel.prev, x);
    }

    public void remove(DNode node) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
    }

    public DNode first() {
        return sentinel.next == sentinel ? null : sentinel.next;
    }

    public DNode last() {
        return sentinel.prev == sentinel ? null : sentinel.prev;
    }

    public String forward() {
        StringBuilder sb = new StringBuilder();
        for (DNode curr = sentinel.next; curr != sentinel; curr = curr.next) {
            sb.append(curr.element).append(' ');
        }
        return sb.toString().trim();
    }

    public String backward() {
        StringBuilder sb = new StringBuilder();
        for (DNode curr = sentinel.prev; curr != sentinel; curr = curr.prev) {
            sb.append(curr.element).append(' ');
        }
        return sb.toString().trim();
    }
}`,
  doublyCircularDemo: `public class DoublyCircularDemo {
    public static void main(String[] args) {
        DoublyCircularList list = new DoublyCircularList();
        list.insertLast(2);
        list.insertLast(3);
        list.insertFirst(1);
        System.out.println("forward: " + list.forward() + "  |  backward: " + list.backward());
        System.out.println("first.prev = " + list.first().prev.prev.element + " (through the sentinel)");
        list.remove(list.last());
        list.remove(list.first());
        System.out.println("after removing both ends: " + list.forward());
        list.remove(list.first());
        System.out.println("empty: first() = " + list.first() + ", forward = \\"" + list.forward() + "\\"");
    }
}`,
};

// ---------- widget styles (only used by this lecture) ----------

(function injectStyle() {
  if (document.getElementById("l07-style")) return;
  const s = document.createElement("style");
  s.id = "l07-style";
  s.textContent = `
  .lp-view { overflow-x: auto; }
  .lp-view svg { margin: 0 auto; }
  .lp-vars { display: flex; flex-wrap: wrap; gap: 6px 14px; font: 12.5px var(--mono); color: var(--ink-2, var(--ink)); padding: 6px 2px 0; }
  .lp-vars span b { color: var(--teal); font-weight: 600; }
  .lp-vars:empty { display: none; }
  .lp-side { display: flex; flex-direction: column; gap: 6px; font: 13px/1.5 var(--mono); }
  .lp-side .row { display: flex; justify-content: space-between; gap: 10px; border: 1px solid var(--line); background: var(--card); border-radius: 7px; padding: 4px 10px; }
  .lp-side .row b { color: var(--teal); font-weight: 600; }
  .lp-side .row.hot { border-color: var(--amber); background: var(--mark); }
  .lp-grid .stack-wrap { min-height: 0; }
  .lp-grid { margin-top: 12px; }
  .lp-out { margin-top: 8px; }
  .mem { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.4fr); gap: 12px; align-items: start; }
  .mem table { border-collapse: collapse; width: 100%; font: 12.5px var(--mono); }
  .mem th, .mem td { border: 1px solid var(--line); padding: 3px 8px; text-align: center; }
  .mem th { background: var(--paper-2); color: var(--stone); font-weight: 500; }
  .mem td.addr { color: var(--stone); }
  .mem tr.cur td { background: var(--mark); }
  .mem tr.hit td { background: var(--green-soft); }
  .mem tr.free td { color: var(--line); }
  .cells .cell.ghost { color: var(--stone); background: var(--paper-2); }
  .cells .cell.empty { color: transparent; background: var(--paper-2); border-style: dashed; }
  @media (max-width: 720px) { .mem { grid-template-columns: 1fr; } }
  `;
  document.head.appendChild(s);
})();

// ---------- small helpers ----------

function parseList(text, fallback, max = 7) {
  if (String(text).trim() === "" || /^empty$/i.test(String(text).trim())) return [];
  return parseNums(text, fallback).slice(0, max);
}

// A tiny model of Java objects: nodes with next/prev references, plus where to draw them.
class Heap {
  constructor(doubly = false) { this.n = {}; this.k = 0; this.doubly = doubly; }
  make(val, col, row = 0, extra = {}) {
    const id = "n" + this.k++;
    this.n[id] = { id, val, next: null, prev: null, col, row, ...extra };
    return id;
  }
  chain(vals, col0 = 0) {
    const ids = vals.map((v, k) => this.make(v, col0 + k));
    ids.forEach((id, k) => {
      this.n[id].next = ids[k + 1] || null;
      if (this.doubly) this.n[id].prev = ids[k - 1] || null;
    });
    return ids;
  }
  drop(id) { delete this.n[id]; }
  // Lay the nodes reachable from `first` out in one row, in list order.
  tidy(first, col0 = 0) {
    let id = first, c = col0;
    const seen = new Set();
    while (id && !seen.has(id)) { seen.add(id); this.n[id].col = c++; this.n[id].row = 0; id = this.n[id].next; }
  }
  val(id) { return id ? this.n[id].val : null; }
}

// Snapshot of the heap for drawing. ptrs: {name: id or null}.
function view(heap, ptrs, extra = {}) {
  const nodes = Object.values(heap.n);
  return {
    doubly: heap.doubly,
    nodes: nodes.map((n) => ({ id: n.id, val: n.val, col: n.col, row: n.row, dummy: !!n.dummy, addr: n.addr,
      cls: (extra.cls || {})[n.id] || "" })),
    next: Object.fromEntries(nodes.map((n) => [n.id, n.next])),
    prev: Object.fromEntries(nodes.map((n) => [n.id, n.prev])),
    ptrs: Object.entries(ptrs).map(([name, id]) => ({ name, id })),
    hot: extra.hot || [],
    hotPtr: extra.hotPtr || [],
    showNull: extra.showNull !== false,
  };
}

let LP_UID = 0;

// Draw a linked structure as SVG: boxes for nodes, arrows for references, labels for variables.
function drawLinks(st) {
  const uid = ++LP_UID;
  const dbl = st.doubly;
  const W = dbl ? 78 : 62, H = 32, G = W + 38, X0 = 26;
  const ROW = [48, 136];
  const byId = Object.fromEntries(st.nodes.map((n) => [n.id, n]));
  const X = (n) => X0 + n.col * G, Y = (n) => ROW[n.row || 0];
  // Reachable from some variable? Unreachable nodes are garbage: drawn faded.
  const reach = new Set();
  const stack = st.ptrs.map((p) => p.id).filter(Boolean);
  while (stack.length) {
    const id = stack.pop();
    if (!id || reach.has(id) || !byId[id]) continue;
    reach.add(id);
    stack.push(st.next[id], st.prev[id]);
  }
  const maxCol = Math.max(0, ...st.nodes.map((n) => n.col));
  const hasRow1 = st.nodes.some((n) => n.row === 1);
  let below = 0;
  st.nodes.forEach((a) => {
    const b = byId[st.next[a.id]];
    if (b && (b.row || 0) === (a.row || 0) && b.col <= a.col) below = Math.max(below, 22 + 7 * (a.col - b.col));
  });
  const VW = X0 + (maxCol + 1) * G + 22;
  const VH = Math.max(hasRow1 ? 210 : 100, ROW[0] + H + below + 14);
  const hot = new Set(st.hot);
  let svg = `<svg viewBox="0 0 ${VW} ${VH}" width="${VW}" role="img" aria-label="linked list" style="width:${VW}px;max-width:max(100%, ${Math.round(VW * 0.7)}px)">
    <defs>
      <marker id="lpa${uid}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="var(--ink)"/></marker>
      <marker id="lph${uid}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="var(--amber)"/></marker>
      <marker id="lpp${uid}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="var(--teal)"/></marker>
    </defs>`;
  const arrow = (d, isHot, faded) => `<path d="${d}" fill="none" stroke="${isHot ? "var(--amber)" : "var(--ink)"}" stroke-width="${isHot ? 2.4 : 1.4}" opacity="${faded ? 0.3 : 1}" marker-end="url(#${isHot ? "lph" : "lpa"}${uid})"/>`;
  const occupied = (row, c) => st.nodes.some((n) => (n.row || 0) === row && Math.abs(n.col - c) < 0.01);
  let links = "";
  st.nodes.forEach((a) => {
    const ax = X(a), ay = Y(a), faded = !reach.has(a.id);
    // next reference
    const nid = st.next[a.id];
    const sx = ax + W - 9, sy = dbl ? ay + 11 : ay + H / 2;
    if (nid === null || nid === undefined) {
      links += `<line x1="${ax + W - 18}" y1="${ay + H}" x2="${ax + W}" y2="${ay}" stroke="var(--stone)" stroke-width="1.2" opacity="${faded ? 0.3 : 1}"/>`;
      if (st.showNull && !occupied(a.row || 0, a.col + 1) && !dbl) {
        links += `<text x="${ax + W + 6}" y="${ay + H / 2 + 4}" font-size="11" fill="var(--stone)" opacity="${faded ? 0.3 : 1}">null</text>`;
      }
    } else if (byId[nid]) {
      const b = byId[nid], bx = X(b), by = Y(b);
      const isHot = hot.has("n:" + a.id);
      const ty = dbl ? by + 11 : by + H / 2;
      if ((b.row || 0) === (a.row || 0) && b.col > a.col) {
        let between = false;
        for (let c = Math.floor(a.col) + 1; c < b.col; c++) if (occupied(a.row || 0, c)) between = true;
        if (!between) links += arrow(`M ${sx} ${sy} L ${bx - 1} ${ty}`, isHot, faded);
        else links += arrow(`M ${sx} ${ay} C ${sx} ${ay - 30}, ${bx + 12} ${by - 30}, ${bx + 12} ${by - 1}`, isHot, faded);
      } else if ((b.row || 0) !== (a.row || 0)) {
        const down = (b.row || 0) > (a.row || 0);
        const y1 = down ? ay + H : ay, y2 = down ? by - 1 : by + H + 1;
        const tx = bx + (dbl ? 30 : 14);
        links += arrow(`M ${sx} ${y1} C ${sx} ${(y1 + y2) / 2}, ${tx} ${(y1 + y2) / 2}, ${tx} ${y2}`, isHot, faded);
      } else if (b === a) {
        links += arrow(`M ${sx} ${ay + H} C ${sx + 6} ${ay + H + 30}, ${ax + W + 34} ${ay + H / 2 + 24}, ${ax + W + 1} ${ay + H / 2}`, isHot, faded);
      } else {
        const d = 22 + 7 * (a.col - b.col);
        const tx = bx + (dbl ? 30 : 14);
        links += arrow(`M ${sx} ${ay + H} C ${sx} ${ay + H + d}, ${tx} ${by + H + d}, ${tx} ${by + H + 1}`, isHot, faded);
      }
    }
    if (!dbl) return;
    // prev reference
    const pid = st.prev[a.id];
    const px = ax + 9, py = ay + H - 11;
    if (pid === null || pid === undefined) {
      links += `<line x1="${ax}" y1="${ay + H}" x2="${ax + 18}" y2="${ay}" stroke="var(--stone)" stroke-width="1.2" opacity="${faded ? 0.3 : 1}"/>`;
    } else if (byId[pid]) {
      const b = byId[pid], bx = X(b), by = Y(b);
      const isHot = hot.has("p:" + a.id);
      if ((b.row || 0) === (a.row || 0) && b.col < a.col) {
        let between = false;
        for (let c = Math.floor(b.col) + 1; c < a.col; c++) if (occupied(a.row || 0, c)) between = true;
        if (!between) links += arrow(`M ${px} ${py} L ${bx + W + 1} ${by + H - 11}`, isHot, faded);
        else links += arrow(`M ${px} ${ay + H} C ${px} ${ay + H + 26}, ${bx + W - 30} ${by + H + 26}, ${bx + W - 30} ${by + H + 1}`, isHot, faded);
      } else if ((b.row || 0) !== (a.row || 0)) {
        const down = (b.row || 0) > (a.row || 0);
        const y1 = down ? ay + H : ay, y2 = down ? by - 1 : by + H + 1;
        const tx = bx + W - 30;
        links += arrow(`M ${px} ${y1} C ${px} ${(y1 + y2) / 2}, ${tx} ${(y1 + y2) / 2}, ${tx} ${y2}`, isHot, faded);
      } else {
        const d = 26 + 6 * (b.col - a.col);
        links += arrow(`M ${px} ${ay} C ${px} ${ay - d}, ${bx + W - 14} ${by - d}, ${bx + W - 14} ${by - 1}`, isHot, faded);
      }
    }
  });
  // nodes
  let boxes = "";
  st.nodes.forEach((n) => {
    const x = X(n), y = Y(n);
    const faded = !reach.has(n.id);
    const fill = n.dummy ? "var(--paper-2)" : n.cls === "new" ? "var(--mark)" : n.cls === "cur" ? "var(--teal-soft)" : n.cls === "found" ? "var(--green-soft)" : n.cls === "bad" ? "var(--red-soft)" : "var(--card)";
    const stroke = n.cls === "new" ? "var(--amber)" : n.cls === "cur" ? "var(--teal)" : n.cls === "found" ? "var(--green)" : n.cls === "bad" ? "var(--red)" : "var(--ink)";
    const op = faded ? 0.3 : 1;
    boxes += `<g opacity="${op}"><rect x="${x}" y="${y}" width="${W}" height="${H}" rx="5" fill="${fill}" stroke="${stroke}" stroke-width="${n.cls ? 2 : 1.2}" ${n.dummy ? 'stroke-dasharray="4 3"' : ""}/>`;
    if (dbl) {
      boxes += `<line x1="${x + 18}" y1="${y}" x2="${x + 18}" y2="${y + H}" stroke="var(--line)"/><line x1="${x + W - 18}" y1="${y}" x2="${x + W - 18}" y2="${y + H}" stroke="var(--line)"/>`;
      boxes += `<text x="${x + W / 2}" y="${y + H / 2 + 5}" font-size="14" font-weight="600" text-anchor="middle" fill="var(--ink)">${n.dummy ? "·" : esc(n.val)}</text>`;
    } else {
      boxes += `<line x1="${x + W - 18}" y1="${y}" x2="${x + W - 18}" y2="${y + H}" stroke="var(--line)"/>`;
      boxes += `<text x="${x + (W - 18) / 2}" y="${y + H / 2 + 5}" font-size="14" font-weight="600" text-anchor="middle" fill="${n.dummy ? "var(--stone)" : "var(--ink)"}">${n.dummy ? "·" : esc(n.val)}</text>`;
    }
    if (n.addr !== undefined) boxes += `<text x="${x + W / 2}" y="${y + H + 14}" font-size="10" text-anchor="middle" fill="var(--stone)">@${n.addr}</text>`;
    if (faded && !n.dummy) boxes += `<text x="${x + W / 2}" y="${y + H + 14}" font-size="10" text-anchor="middle" fill="var(--red)">unreachable</text>`;
    boxes += "</g>";
  });
  // variable labels
  let labels = "";
  const groups = {};
  st.ptrs.forEach((p) => { if (p.id && byId[p.id]) (groups[p.id] = groups[p.id] || []).push(p.name); });
  Object.entries(groups).forEach(([id, names]) => {
    const n = byId[id], x = X(n) + (dbl ? W / 2 : (W - 18) / 2), y = Y(n);
    const isHot = names.some((nm) => st.hotPtr.includes(nm));
    const col = isHot ? "var(--amber)" : "var(--teal)";
    const text = names.join(", ");
    if ((n.row || 0) === 1) {
      labels += `<line x1="${x}" y1="${y + H + 18}" x2="${x}" y2="${y + H + 3}" stroke="${col}" stroke-width="1.5" marker-end="url(#lpp${uid})"/>`;
      labels += `<text x="${x}" y="${y + H + 30}" font-size="11.5" font-weight="600" text-anchor="middle" fill="${col}">${esc(text)}</text>`;
    } else {
      labels += `<line x1="${x}" y1="${y - 16}" x2="${x}" y2="${y - 3}" stroke="${col}" stroke-width="1.5" marker-end="url(#lpp${uid})"/>`;
      labels += `<text x="${x}" y="${y - 21}" font-size="11.5" font-weight="600" text-anchor="middle" fill="${col}">${esc(text)}</text>`;
    }
  });
  if (!st.nodes.length) labels += `<text x="${X0}" y="${ROW[0] + 20}" font-size="12" fill="var(--stone)">(no nodes)</text>`;
  return svg + links + boxes + labels + "</svg>";
}

// Variables that hold null (or are not drawn as labels) are listed under the picture.
function nullVars(st) {
  return st.ptrs.filter((p) => !p.id).map((p) => `<span><b>${esc(p.name)}</b> = null</span>`).join("");
}

// ---------- the player used by every demo here ----------
// opts: build() -> snaps [{draw: html, line, msg, msgCls, vars: [[k, v, hot]], out: [lines]}],
//       code (string or function), sideLabel, console, extraControls, onMount(root, rebuild), mini.
function makePlayer(el, opts) {
  const mini = !!opts.mini;
  const hasCode = !!opts.code && !mini;
  el.innerHTML = `<div class="svgbox lp-view"></div><div class="lp-vars"></div>
    ${hasCode ? `<div class="stepper lp-grid"><div class="lp-code"></div><div class="stack-wrap"><small><span>${opts.sideLabel || "variables"}</span></small><div class="lp-side"></div>${opts.console ? `<div class="console lp-out"></div>` : ""}</div></div>` : ""}
    ${mini ? "" : `<div class="msg lp-msg"></div>
    <div class="controls">
      <button class="cbtn lp-reset" title="Back to the start">⟲ Reset</button>
      <button class="cbtn lp-back" title="Step back (←)">◀ Back</button>
      <button class="cbtn lp-step on" title="Step (→)">Step ▶</button>
      <button class="cbtn lp-play">Play</button>
      ${opts.extraControls || ""}
      <span class="spacer"></span><span class="counter lp-count"></span>
    </div>`}`;
  const $ = (s) => el.querySelector(s);
  let snaps = [], i = 0, timer = null, codeLines = [];
  function render() {
    const s = snaps[i];
    $(".lp-view").innerHTML = s.draw;
    $(".lp-vars").innerHTML = s.under || "";
    if (mini) return;
    if (hasCode) {
      codeLines.forEach((ln, k) => ln.classList.toggle("hl", k + 1 === s.line));
      $(".lp-side").innerHTML = (s.vars || []).map(([k, v, h]) => `<div class="row${h ? " hot" : ""}"><span>${esc(k)}</span><b>${esc(v)}</b></div>`).join("") || `<div class="row"><span>—</span></div>`;
      if (opts.console) { const o = $(".lp-out"); o.textContent = (s.out || []).join("\n"); o.scrollTop = o.scrollHeight; }
    }
    const msg = $(".lp-msg");
    msg.innerHTML = s.msg || "";
    msg.className = "msg lp-msg " + (s.msgCls || "");
    $(".lp-count").textContent = `step ${i + 1} / ${snaps.length}`;
    $(".lp-back").disabled = $(".lp-reset").disabled = i === 0;
    $(".lp-step").disabled = i === snaps.length - 1;
  }
  function stop() { clearInterval(timer); timer = null; if (!mini) $(".lp-play").textContent = "Play"; }
  function play() {
    if (timer) return stop();
    if (i === snaps.length - 1) i = 0;
    if (!mini) $(".lp-play").textContent = "Pause";
    let hold = 0;
    timer = setInterval(() => {
      if (i < snaps.length - 1) { i++; render(); }
      else if (mini) { if (++hold > 2) { hold = 0; i = 0; render(); } }
      else stop();
    }, mini ? 1100 : 900);
  }
  function rebuild() {
    stop();
    if (hasCode) {
      $(".lp-code").innerHTML = codeBlock(typeof opts.code === "function" ? opts.code() : opts.code);
      codeLines = [...el.querySelectorAll(".lp-code .ln")];
    }
    snaps = opts.build();
    i = 0;
    render();
    if (mini) play();
  }
  if (!mini) {
    $(".lp-reset").onclick = () => { stop(); i = 0; render(); };
    $(".lp-back").onclick = () => { stop(); if (i > 0) i--; render(); };
    $(".lp-step").onclick = () => { stop(); if (i < snaps.length - 1) i++; render(); };
    $(".lp-play").onclick = play;
    el.tabIndex = 0;
    el.addEventListener("keydown", (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "SELECT") return;
      if (e.key === "ArrowRight") { e.preventDefault(); $(".lp-step").click(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); $(".lp-back").click(); }
    });
  }
  if (opts.onMount) opts.onMount(el, rebuild);
  rebuild();
  return { rebuild, stop };
}

// Helper to record a snapshot of a heap-based demo.
function recorder(heap) {
  const snaps = [];
  return {
    snaps,
    snap(ptrs, line, msg, more = {}) {
      const v = view(heap, ptrs, more);
      snaps.push({ draw: drawLinks(v), under: nullVars(v), line, msg, msgCls: more.msgCls || "",
        vars: more.vars || Object.entries(ptrs).map(([k, id]) => [k, id ? `node(${heap.val(id)})` : "null", (more.hotPtr || []).includes(k)]),
        out: more.out });
    },
  };
}

// ---------- Ch1: shifting in an array ----------

function demoArrayShift(el, { mini = false } = {}) {
  let start = [1000, 1010, 1050, 2000, 2040], op = "insert", x = 1005;
  const CAP = 10;
  function build() {
    const snaps = [];
    const a = Array(CAP).fill(null);
    start.forEach((v, k) => { a[k] = v; });
    let n = start.length;
    const s = (line, msg, hl = {}, ptr = {}, extra = {}) => snaps.push({ a: a.slice(), n: extra.n ?? n, line, msg, hl, ptr, moves: extra.moves, msgCls: extra.cls || "" });
    if (op === "insert") {
      if (n >= CAP) { s(1, "The array is full (capacity 10): there is no free cell to shift into.", {}, {}, { cls: "bad" }); return snaps; }
      let i = n - 1, moves = 0;
      s(2, `insertSorted(a, n = ${n}, x = ${x}): start at i = n − 1 = ${i}, the last element.`, {}, { [i]: "i" }, { moves });
      while (i >= 0 && a[i] > x) {
        a[i + 1] = a[i];
        moves++;
        s(5, `a[${i}] = ${a[i]} > ${x}, so shift it one cell right: a[${i + 1}] = ${a[i]}. Moves so far: ${moves}.`, { [i + 1]: "mid", [i]: "ghost" }, { [i]: "i" }, { moves, n: n + 1 });
        i--;
      }
      a[i + 1] = x;
      s(9, (i >= 0 ? `a[${i}] = ${a[i]} ≤ ${x}: stop. ` : "i = −1: every element was larger. ") + `Write x into the gap: a[${i + 1}] = ${x}.`, { [i + 1]: "found" }, i >= 0 ? { [i]: "i" } : {}, { moves, n: n + 1 });
      n++;
      s(10, `Done: <b>${moves}</b> element${moves === 1 ? "" : "s"} moved to insert one value. Inserting at the front of n elements moves all n: O(n).`, { [i + 1]: "found" }, {}, { moves, cls: "good" });
    } else {
      let k = 0;
      s(2, `deleteValue(a, n = ${n}, x = ${x}): first find x, starting at k = 0.`, {}, { 0: "k" });
      while (k < n && a[k] !== x) {
        s(4, `a[${k}] = ${a[k]} ≠ ${x}: k++.`, { [k]: "mid" }, { [k]: "k" });
        k++;
      }
      if (k === n) { s(7, `k = n = ${n}: ${x} is not in the array. Return −1; nothing moves.`, {}, {}, { cls: "bad" }); return snaps; }
      s(9, `Found ${x} at index ${k}. Now close the gap: every later element moves one cell left.`, { [k]: "found" }, { [k]: "k" }, { moves: 0 });
      let moves = 0;
      for (let j = k; j < n - 1; j++) {
        a[j] = a[j + 1];
        moves++;
        s(11, `a[${j}] = a[${j + 1}] = ${a[j]}. Moves so far: ${moves}.`, { [j]: "mid", [j + 1]: "ghost" }, { [j]: "j" }, { moves });
      }
      n--;
      a[n] = null;
      s(14, `Done: <b>${moves}</b> element${moves === 1 ? "" : "s"} moved; the caller decreases n to ${n}. Deleting the first of n elements moves n − 1: O(n).`, {}, {}, { moves, cls: "good" });
    }
    return snaps;
  }
  makePlayer(el, {
    mini,
    code: () => (op === "insert" ? CODE.insertSorted : CODE.deleteValue),
    build: () => build().map((s) => ({
      draw: `<div class="cells">${s.a.map((v, k) => `<div class="cellcol"><div class="ptr">${s.ptr[k] || ""}</div><div class="cell ${v === null ? "empty" : k >= s.n ? "out" : s.hl[k] || ""}">${v === null ? "·" : v}</div><div class="cellidx">${k}</div></div>`).join("")}</div>`,
      under: `<span><b>n</b> = ${s.n}</span><span><b>capacity</b> = ${CAP}</span>${s.moves !== undefined ? `<span><b>moves</b> = ${s.moves}</span>` : ""}`,
      line: s.line, msg: s.msg, msgCls: s.msgCls,
      vars: [["n", String(s.n)], ["x", String(x)], ["moves", s.moves === undefined ? "—" : String(s.moves)]],
    })),
    extraControls: mini ? "" : `<select class="as-op"><option value="insert">insert (keep sorted)</option><option value="delete">delete</option></select>
      <label>x <input type="number" class="as-x" value="${x}" style="width:80px"></label>
      <label>array <input type="text" class="as-a" value="${start.join(", ")}" style="width:190px"></label>`,
    onMount(root, rebuild) {
      if (mini) return;
      root.querySelector(".as-op").onchange = (e) => { op = e.target.value; if (op === "delete" && x === 1005) { x = 1010; root.querySelector(".as-x").value = x; } rebuild(); };
      root.querySelector(".as-x").onchange = (e) => { x = Math.trunc(+e.target.value) || 0; rebuild(); };
      root.querySelector(".as-a").onchange = (e) => {
        start = parseNums(e.target.value, [1000, 1010, 1050, 2000, 2040]).slice(0, 9).sort((p, q) => p - q);
        e.target.value = start.join(", ");
        rebuild();
      };
    },
  });
}

// ---------- Ch1/Ch5: the four kinds ----------

function demoKinds(el, { mini = false } = {}) {
  function build() {
    const snaps = [];
    const vals = [7, 8, 10];
    {
      const h = new Heap(); const ids = h.chain(vals);
      snaps.push({ draw: drawLinks(view(h, { head: ids[0] })), msg: "<b>Singly linked list.</b> One reference per node, <code>next</code>. The last node's <code>next</code> is <code>null</code>. Only forwards." });
    }
    {
      const h = new Heap(true); const ids = h.chain(vals);
      snaps.push({ draw: drawLinks(view(h, { head: ids[0], tail: ids[2] })), msg: "<b>Doubly linked list.</b> Each node also has <code>prev</code>. Both ends are <code>null</code>. Forwards and backwards." });
    }
    {
      const h = new Heap(); const ids = h.chain(vals); h.n[ids[2]].next = ids[0];
      snaps.push({ draw: drawLinks(view(h, { head: ids[0] })), msg: "<b>Circular linked list.</b> The last node links back to the first. No <code>null</code> anywhere: start at any node and you come round again." });
    }
    {
      const h = new Heap(true); const ids = h.chain(vals); h.n[ids[2]].next = ids[0]; h.n[ids[0]].prev = ids[2];
      snaps.push({ draw: drawLinks(view(h, { head: ids[0] })), msg: "<b>Doubly circular linked list.</b> <code>prev</code> and <code>next</code>, and both ends wrap round: <code>head.prev</code> is the last node." });
    }
    return snaps;
  }
  makePlayer(el, { mini, build });
}

// ---------- Ch2: traversal and search, in memory ----------

function demoMemoryWalk(el, { mini = false } = {}) {
  let vals = [34, 12, 52, 16, 12], key = 52;
  const SLOTS = [3, 7, 1, 6, 4, 8, 2, 5];
  function build() {
    const h = new Heap();
    const ids = h.chain(vals);
    ids.forEach((id, k) => { h.n[id].addr = SLOTS[k]; });
    const addrOf = (id) => (id ? h.n[id].addr : -1);
    const snaps = [];
    const s = (curr, pos, line, msg, cls = {}, msgCls = "") => {
      const v = view(h, { head: ids[0] || null, curr }, { cls });
      const rows = [];
      for (let a = 1; a <= 8; a++) {
        const id = ids.find((q) => h.n[q].addr === a);
        rows.push(id
          ? `<tr class="${id === curr ? (cls[id] === "found" ? "hit" : "cur") : ""}"><td class="addr">${a}</td><td>${h.n[id].val}</td><td>${h.n[id].next ? addrOf(h.n[id].next) : "−1"}</td></tr>`
          : `<tr class="free"><td class="addr">${a}</td><td>·</td><td>·</td></tr>`);
      }
      snaps.push({
        draw: mini ? drawLinks(v) : `<div class="mem"><table><tr><th>address</th><th>element</th><th>next</th></tr>${rows.join("")}</table><div>${drawLinks(v)}</div></div>`,
        under: `<span><b>head</b> = ${ids.length ? "@" + addrOf(ids[0]) : "null"}</span><span><b>curr</b> = ${curr ? "@" + addrOf(curr) : "null"}</span><span><b>pos</b> = ${pos}</span><span><b>key</b> = ${key}</span>`,
        line, msg, msgCls,
        vars: [["key", String(key)], ["pos", String(pos)], ["curr", curr ? `@${addrOf(curr)} (${h.n[curr].val})` : "null"]],
      });
    };
    let pos = 1;
    let curr = ids[0] || null;
    s(curr, pos, 3, ids.length
      ? `<code>curr = head</code>: the head holds address ${addrOf(curr)}. In memory the nodes are scattered; only the <b>next</b> column keeps the order. (−1 stands for <code>null</code>.)`
      : "The list is empty: <code>head</code> is <code>null</code>, so the loop body never runs.");
    while (curr) {
      if (h.n[curr].val === key) {
        s(curr, pos, 5, `${h.n[curr].val} == ${key}: found at position <b>${pos}</b>. <code>find</code> stops at the first match.`, { [curr]: "found" }, "good");
        return snaps;
      }
      s(curr, pos, 4, `${h.n[curr].val} ≠ ${key}.`, { [curr]: "cur" });
      const nx = h.n[curr].next;
      pos++;
      s(nx, pos, 3, nx ? `<code>pos++</code> → ${pos}; <code>curr = curr.next</code>: read address ${addrOf(nx)} from the next column and jump there.` : `<code>pos++</code>; <code>curr = curr.next</code> is <code>null</code> (next = −1): we fell off the end.`, nx ? { [nx]: "cur" } : {});
      curr = nx;
    }
    s(null, pos, 9, ids.length ? `Every node checked, no ${key}: return <b>−1</b>. A search that fails always visits all n nodes: O(n).` : "Empty list: return <b>−1</b> at once.", {}, "bad");
    return snaps;
  }
  makePlayer(el, {
    mini, code: CODE.find, build,
    extraControls: `<label>list <input type="text" class="mw-l" value="${vals.join(", ")}" style="width:160px"></label>
      <label>key <input type="number" class="mw-k" value="${key}" style="width:70px"></label>`,
    onMount(root, rebuild) {
      if (mini) return;
      root.querySelector(".mw-l").onchange = (e) => { vals = parseList(e.target.value, [34, 12, 52, 16, 12], 8); e.target.value = vals.join(", "); rebuild(); };
      root.querySelector(".mw-k").onchange = (e) => { key = Math.trunc(+e.target.value) || 0; rebuild(); };
    },
  });
}

// ---------- Ch3: insert and delete with a head reference ----------

const LINK_OPS = {
  insertFirst: "insertFirst(x)",
  insertLast: "insertLast(x)",
  insertAfter: "insertAfter(key, x)",
  insertAfterWrong: "insertAfterWrong(key, x) — bug",
  deleteFirst: "deleteFirst()",
  deleteLast: "deleteLast()",
  deleteAfter: "deleteAfter(key)",
};

function buildLinkOp(op, vals, x, key) {
  const h = new Heap();
  const col0 = op === "insertFirst" ? 1 : 0;
  const ids = h.chain(vals, col0);
  let head = ids[0] || null;
  const R = recorder(h);
  const P = (more) => ({ head, ...more });
  const tidyMsg = (txt) => R.snap(P({}), 0, txt, { msgCls: "good" });
  const walk = (name, line, cond, moveLine) => {
    // Walk `name` from head while cond(node) holds; returns the node where it stops.
    let t = head;
    R.snap(P({ [name]: t }), line, `<code>${name} = head</code>.`, { cls: t ? { [t]: "cur" } : {} });
    while (t && cond(t)) {
      t = h.n[t].next;
      R.snap(P({ [name]: t }), moveLine, t ? `<code>${name} = ${name}.next</code> → node(${h.val(t)}).` : `<code>${name} = ${name}.next</code> → null.`, { cls: t ? { [t]: "cur" } : {} });
    }
    return t;
  };
  if (op === "insertFirst") {
    R.snap(P({}), 1, `insertFirst(${x}) on ${vals.length ? vals.join(" → ") : "the empty list"}.`);
    const nn = h.make(x, 0, 1);
    R.snap(P({ newNode: nn }), 2, `A new node holding ${x}. Nothing points to it yet except the local variable <code>newNode</code>.`, { cls: { [nn]: "new" } });
    h.n[nn].next = head;
    R.snap(P({ newNode: nn }), 3, head ? `Step 1: <code>newNode.next = head</code>: the new node points to the old first node, node(${h.val(head)}).` : "Step 1: <code>newNode.next = head</code> = null (the list was empty).", { hot: ["n:" + nn], cls: { [nn]: "new" } });
    head = nn;
    R.snap(P({ newNode: nn }), 4, "Step 2: <code>head = newNode</code>. The old list is still reachable through the new node, so nothing is lost.", { hotPtr: ["head"], cls: { [nn]: "new" } });
    h.tidy(head);
    tidyMsg("Redrawn in order. Two reference changes, whatever the length: <b>O(1)</b>.");
  } else if (op === "insertLast") {
    R.snap(P({}), 1, `insertLast(${x}) on ${vals.length ? vals.join(" → ") : "the empty list"}.`);
    const nn = h.make(x, Math.max(vals.length, 0), 1);
    R.snap(P({ newNode: nn }), 2, `A new node holding ${x}; its <code>next</code> is null, as the last node's must be.`, { cls: { [nn]: "new" } });
    if (!head) {
      R.snap(P({ newNode: nn }), 3, "<code>head == null</code>: case 1, the new node will be the only node.", { cls: { [nn]: "new" } });
      head = nn;
      R.snap(P({ newNode: nn }), 4, "<code>head = newNode</code>.", { hotPtr: ["head"], cls: { [nn]: "new" } });
      h.tidy(head);
      tidyMsg("A one-node list. Without the <code>if</code>, <code>current.next</code> would throw a NullPointerException (the slide version's bug).");
      return R.snaps;
    }
    R.snap(P({ newNode: nn }), 3, "<code>head != null</code>: case 2, walk to the last node.", { cls: { [nn]: "new" } });
    let c = head;
    R.snap(P({ newNode: nn, current: c }), 7, "<code>current = head</code>.", { cls: { [nn]: "new", [c]: "cur" } });
    while (h.n[c].next) {
      c = h.n[c].next;
      R.snap(P({ newNode: nn, current: c }), 9, `<code>current.next != null</code>, so <code>current = current.next</code> → node(${h.val(c)}).`, { cls: { [nn]: "new", [c]: "cur" } });
    }
    R.snap(P({ newNode: nn, current: c }), 8, `<code>current.next == null</code>: node(${h.val(c)}) is the last node. The walk took ${vals.length - 1} step${vals.length === 2 ? "" : "s"}.`, { cls: { [nn]: "new", [c]: "cur" } });
    h.n[c].next = nn;
    R.snap(P({ newNode: nn, current: c }), 11, "<code>current.next = newNode</code>.", { hot: ["n:" + c], cls: { [nn]: "new" } });
    h.tidy(head);
    tidyMsg("Redrawn in order. One link changed, but finding the end took n − 1 steps: <b>O(n)</b>. A <code>tail</code> reference would make it O(1).");
  } else if (op === "insertAfter" || op === "insertAfterWrong") {
    const wrong = op === "insertAfterWrong";
    R.snap(P({}), 1, `${wrong ? "insertAfterWrong" : "insertAfter"}(key = ${key}, x = ${x}).`);
    const t = walk("target", 2, (q) => h.val(q) !== key, 4);
    if (!t) { R.snap(P({ target: null }), 7, `No node holds ${key}: return false, the list is unchanged.`, { msgCls: "bad" }); return R.snaps; }
    R.snap(P({ target: t }), 3, `node(${key}) found: <code>target</code> stops here.`, { cls: { [t]: "cur" } });
    const nn = h.make(x, h.n[t].col + 0.5, 1);
    const succ = h.n[t].next;
    R.snap(P({ target: t, newNode: nn }), 9, `A new node holding ${x}.`, { cls: { [nn]: "new", [t]: "cur" } });
    if (!wrong) {
      h.n[nn].next = succ;
      R.snap(P({ target: t, newNode: nn }), 10, succ ? `Step 1: <code>newNode.next = target.next</code>: the new node points to node(${h.val(succ)}). The rest of the list now has two arrows into it.` : "Step 1: <code>newNode.next = target.next</code> = null (target is the last node).", { hot: ["n:" + nn], cls: { [nn]: "new", [t]: "cur" } });
      h.n[t].next = nn;
      R.snap(P({ target: t, newNode: nn }), 11, "Step 2: <code>target.next = newNode</code>. Safe: the rest of the list is still reachable through the new node.", { hot: ["n:" + t], cls: { [nn]: "new", [t]: "cur" } });
      h.tidy(head);
      tidyMsg("Redrawn in order. Once <code>target</code> is found, inserting is two link changes: O(1). The walk is O(n) in the worst case.");
    } else {
      h.n[t].next = nn;
      R.snap(P({ target: t, newNode: nn }), 10, succ ? `<code>target.next = newNode</code> first: the only reference to node(${h.val(succ)}) and everything after it is gone. Those nodes are <b>unreachable</b>.` : "<code>target.next = newNode</code>.", { hot: ["n:" + t], cls: { [nn]: "new", [t]: "cur" }, msgCls: succ ? "bad" : "" });
      h.n[nn].next = h.n[t].next;
      R.snap(P({ target: t, newNode: nn }), 11, "<code>newNode.next = target.next</code> — but <code>target.next</code> is now <code>newNode</code> itself. The new node points to itself: a traversal from <code>head</code> now loops forever.", { hot: ["n:" + nn], cls: { [nn]: "bad", [t]: "cur" }, msgCls: "bad" });
    }
  } else if (op === "deleteFirst") {
    R.snap(P({}), 1, `deleteFirst() on ${vals.length ? vals.join(" → ") : "the empty list"}.`);
    if (!head) { R.snap(P({}), 3, "<code>head == null</code>: nothing to delete, return null. (The slide version reads <code>head.next</code> here and throws.)", { msgCls: "bad" }); return R.snaps; }
    const t = head;
    R.snap(P({ temp: t }), 5, "<code>temp = head</code>: keep the first node so we can return it.", { cls: { [t]: "cur" } });
    head = h.n[t].next;
    R.snap(P({ temp: t }), 6, head ? `<code>head = head.next</code>: node(${h.val(head)}) is now first.` : "<code>head = head.next</code> = null: the list is now empty.", { hotPtr: ["head"], cls: { [t]: "cur" } });
    R.snap(P({}), 7, `<code>return temp</code>. When the caller drops it, node(${h.val(t)}) is unreachable and the garbage collector reclaims it.`, {});
    h.drop(t);
    if (head) h.tidy(head);
    tidyMsg("One reference changed: <b>O(1)</b>.");
  } else if (op === "deleteLast") {
    R.snap(P({}), 1, `deleteLast() on ${vals.length ? vals.join(" → ") : "the empty list"}.`);
    if (!head) { R.snap(P({}), 3, "<code>head == null</code>: nothing to delete, return null.", { msgCls: "bad" }); return R.snaps; }
    if (!h.n[head].next) {
      const t = head;
      R.snap(P({ temp: t }), 6, "One node: <code>temp = head</code>.", { cls: { [t]: "cur" } });
      head = null;
      R.snap(P({ temp: t }), 7, "<code>head = null</code>: the list becomes empty.", { hotPtr: ["head"] });
      h.drop(t);
      tidyMsg("Empty list. O(1) in this case.");
      return R.snaps;
    }
    let c = head;
    R.snap(P({ curr: c }), 10, "<code>curr = head</code>. We must stop at the <b>second-to-last</b> node, because only it can be changed to drop the last one.", { cls: { [c]: "cur" } });
    while (h.n[h.n[c].next].next) {
      c = h.n[c].next;
      R.snap(P({ curr: c }), 12, `<code>curr.next.next != null</code>, so <code>curr = curr.next</code> → node(${h.val(c)}).`, { cls: { [c]: "cur" } });
    }
    const t = h.n[c].next;
    R.snap(P({ curr: c, temp: t }), 14, `<code>curr.next.next == null</code>: node(${h.val(c)}) is second-to-last. <code>temp = curr.next</code>.`, { cls: { [c]: "cur" } });
    h.n[c].next = null;
    R.snap(P({ curr: c, temp: t }), 15, `<code>curr.next = null</code>: node(${h.val(c)}) is the new last node.`, { hot: ["n:" + c], cls: { [c]: "cur" } });
    const gone = h.val(t);
    h.drop(t);
    tidyMsg(`Removed node(${gone}). The walk took n − 2 steps: <b>O(n)</b>, even with a tail reference, because a singly linked list cannot step back from the last node.`);
  } else if (op === "deleteAfter") {
    R.snap(P({}), 1, `deleteAfter(key = ${key}).`);
    const t = walk("temp", 2, (q) => h.val(q) !== key, 4);
    if (!t || !h.n[t].next) {
      R.snap(P({ temp: t }), 6, t ? `node(${key}) is the last node: there is no node after it. Nothing to delete.` : `No node holds ${key}. Nothing to delete.`, { msgCls: "bad" });
      return R.snaps;
    }
    const tg = h.n[t].next;
    R.snap(P({ temp: t }), 6, `Found node(${key}); the node after it, node(${h.val(tg)}), is the target.`, { cls: { [t]: "cur", [tg]: "bad" } });
    h.n[tg].row = 1;
    h.n[t].next = h.n[tg].next;
    R.snap(P({ temp: t }), 7, `<code>temp.next = temp.next.next</code>: node(${key}) now skips node(${h.val(tg)}), which nothing references any more.`, { hot: ["n:" + t], cls: { [t]: "cur", [tg]: "bad" } });
    h.drop(tg);
    h.tidy(head);
    tidyMsg("Redrawn in order. Bypassing is one link change: O(1) once you hold the previous node.");
  }
  return R.snaps;
}

function demoLinkOps(el, { mini = false, ops = Object.keys(LINK_OPS), op = ops[0], vals = [2, 3, 4], x = 1, key = 3 } = {}) {
  makePlayer(el, {
    mini,
    code: () => CODE[op],
    build: () => buildLinkOp(op, vals, x, key),
    extraControls: `<select class="lo-op">${ops.map((o) => `<option value="${o}"${o === op ? " selected" : ""}>${LINK_OPS[o]}</option>`).join("")}</select>
      <label>list <input type="text" class="lo-l" value="${vals.join(", ")}" style="width:110px"></label>
      <label>x <input type="number" class="lo-x" value="${x}" style="width:60px"></label>
      <label>key <input type="number" class="lo-k" value="${key}" style="width:60px"></label>`,
    onMount(root, rebuild) {
      if (mini) return;
      root.querySelector(".lo-op").onchange = (e) => { op = e.target.value; rebuild(); };
      root.querySelector(".lo-l").onchange = (e) => { vals = parseList(e.target.value, [2, 3, 4], 6); e.target.value = vals.join(", "); rebuild(); };
      root.querySelector(".lo-x").onchange = (e) => { x = Math.trunc(+e.target.value) || 0; rebuild(); };
      root.querySelector(".lo-k").onchange = (e) => { key = Math.trunc(+e.target.value) || 0; rebuild(); };
    },
  });
}

// ---------- Ch3: insert(x, p) and delete(p) with a dummy head ----------

function buildPositional(op, vals, x, p) {
  const h = new Heap();
  const dummy = h.make(0, 0, 0, { dummy: true });
  const ids = h.chain(vals, 1);
  h.n[dummy].next = ids[0] || null;
  const R = recorder(h);
  const vars = (extra) => [["p", String(p)], ...extra];
  let prev = dummy;
  let steps = 0;
  const base = () => ({ head: dummy });
  if (op === "insert") {
    const t = h.make(x, 0.5, 1);
    R.snap({ ...base(), tmpNode: t }, 2, `insert(${x}, ${p}): a new node <code>tmpNode</code> holding ${x}. The dashed node is the dummy head: it stores no element.`, { cls: { [t]: "new" }, vars: vars([["x", String(x)], ["tmpNode", `node(${x})`]]) });
    R.snap({ ...base(), tmpNode: t, prevNode: prev }, 3, "<code>prevNode = head</code>: the dummy head is position 0, the node before position 1.", { cls: { [t]: "new", [prev]: "cur" }, vars: vars([["prevNode", "head (dummy)"]]) });
    let i = 0;
    for (; i < p - 1; i++) {
      if (!h.n[prev].next) {
        R.snap({ ...base(), tmpNode: t, prevNode: prev }, 6, `i = ${i}: <code>prevNode.next == null</code>, so p is past the end. <code>break</code>: we insert after the last node.`, { cls: { [t]: "new", [prev]: "cur" }, vars: vars([["i", String(i)], ["prevNode", `node(${h.val(prev)})`]]) });
        break;
      }
      prev = h.n[prev].next;
      steps++;
      h.n[t].col = h.n[prev].col + 0.5;
      R.snap({ ...base(), tmpNode: t, prevNode: prev }, 8, `i = ${i}: <code>prevNode = prevNode.next</code> → node(${h.val(prev)}), position ${steps}.`, { cls: { [t]: "new", [prev]: "cur" }, vars: vars([["i", String(i)], ["prevNode", `node(${h.val(prev)})`]]) });
    }
    if (i === p - 1 || p - 1 <= 0) {
      R.snap({ ...base(), tmpNode: t, prevNode: prev }, 4, p - 1 <= 0 ? `p − 1 = ${p - 1}: the loop does not run. The new node goes right after the dummy head, at the front.` : `i = ${i} = p − 1: the loop ends. prevNode is at position ${p - 1}.`, { cls: { [t]: "new", [prev]: "cur" }, vars: vars([["i", String(Math.max(i, 0))], ["prevNode", prev === dummy ? "head (dummy)" : `node(${h.val(prev)})`]]) });
    }
    h.n[t].next = h.n[prev].next;
    R.snap({ ...base(), tmpNode: t, prevNode: prev }, 10, "<code>tmpNode.next = prevNode.next</code>.", { hot: ["n:" + t], cls: { [t]: "new", [prev]: "cur" }, vars: vars([["steps walked", String(steps)]]) });
    h.n[prev].next = t;
    R.snap({ ...base(), tmpNode: t, prevNode: prev }, 11, "<code>prevNode.next = tmpNode</code>.", { hot: ["n:" + prev], cls: { [t]: "new", [prev]: "cur" }, vars: vars([["steps walked", String(steps)]]) });
    h.tidy(dummy);
    let pos = 0;
    for (let q = h.n[dummy].next; q && q !== t; q = h.n[q].next) pos++;
    R.snap(base(), 12, `Done: ${x} is now element ${pos + 1}. The loop walked ${steps} step${steps === 1 ? "" : "s"}; the linking is O(1). Best case O(1) (p = 1), worst case O(n) (the end).`, { msgCls: "good", vars: vars([["steps walked", String(steps)]]) });
  } else {
    R.snap({ ...base(), prevNode: prev }, 2, `delete(${p}): <code>prevNode = head</code>, the dummy head (position 0).`, { cls: { [prev]: "cur" }, vars: vars([["prevNode", "head (dummy)"]]) });
    let i = 0;
    for (; i < p - 1; i++) {
      if (!h.n[prev].next) {
        R.snap({ ...base(), prevNode: prev }, 5, `i = ${i}: <code>prevNode.next == null</code>: <code>break</code>.`, { cls: { [prev]: "cur" }, vars: vars([["i", String(i)]]) });
        break;
      }
      prev = h.n[prev].next;
      steps++;
      R.snap({ ...base(), prevNode: prev }, 7, `i = ${i}: <code>prevNode = prevNode.next</code> → node(${h.val(prev)}), position ${steps}.`, { cls: { [prev]: "cur" }, vars: vars([["i", String(i)], ["prevNode", `node(${h.val(prev)})`]]) });
    }
    const tg = h.n[prev].next;
    R.snap({ ...base(), prevNode: prev, targetNode: tg }, 9, tg ? `<code>targetNode = prevNode.next</code> = node(${h.val(tg)}), the element at position ${p < 1 ? 1 : steps + 1}.` : "<code>targetNode = prevNode.next</code> = null.", { cls: tg ? { [prev]: "cur", [tg]: "bad" } : { [prev]: "cur" }, vars: vars([["prevNode", prev === dummy ? "head (dummy)" : `node(${h.val(prev)})`], ["targetNode", tg ? `node(${h.val(tg)})` : "null"]]) });
    if (!tg) {
      R.snap(base(), 10, `There is no element at position ${p}: nothing happens.`, { msgCls: "bad", vars: vars([["steps walked", String(steps)]]) });
      return R.snaps;
    }
    h.n[tg].row = 1;
    h.n[prev].next = h.n[tg].next;
    R.snap({ ...base(), prevNode: prev, targetNode: tg }, 11, "<code>prevNode.next = targetNode.next</code>: bypass the target.", { hot: ["n:" + prev], cls: { [prev]: "cur", [tg]: "bad" }, vars: vars([["steps walked", String(steps)]]) });
    h.drop(tg);
    h.tidy(dummy);
    R.snap(base(), 13, `Done. ${steps} step${steps === 1 ? "" : "s"} walked. Thanks to the dummy head, deleting the first element needed no special case.`, { msgCls: "good", vars: vars([["steps walked", String(steps)]]) });
  }
  return R.snaps;
}

function demoPositional(el) {
  let op = "insert", vals = [34, 12, 52, 16, 12], x = 99, p = 3;
  makePlayer(el, {
    code: () => (op === "insert" ? CODE.insertAt : CODE.deleteAt),
    build: () => buildPositional(op, vals, x, p),
    extraControls: `<select class="ps-op"><option value="insert">insert(x, p)</option><option value="delete">delete(p)</option></select>
      <label>x <input type="number" class="ps-x" value="${x}" style="width:60px"></label>
      <label>p <input type="number" class="ps-p" value="${p}" style="width:56px"></label>
      <label>list <input type="text" class="ps-l" value="${vals.join(", ")}" style="width:140px"></label>`,
    onMount(root, rebuild) {
      root.querySelector(".ps-op").onchange = (e) => { op = e.target.value; rebuild(); };
      root.querySelector(".ps-x").onchange = (e) => { x = Math.trunc(+e.target.value) || 0; rebuild(); };
      root.querySelector(".ps-p").onchange = (e) => { p = Math.max(-1, Math.min(100, Math.trunc(+e.target.value) || 0)); e.target.value = p; rebuild(); };
      root.querySelector(".ps-l").onchange = (e) => { vals = parseList(e.target.value, [34, 12, 52, 16, 12], 6); e.target.value = vals.join(", "); rebuild(); };
    },
  });
}

// ---------- Ch3: a growing array ----------

function demoGrow(el) {
  let N = 17;
  function build() {
    const snaps = [];
    let data = [null], size = 0, copies = 0;
    const out = [];
    const s = (line, msg, hl = {}, cls = "") => snaps.push({
      draw: `<div class="cells">${data.map((v, k) => `<div class="cellcol"><div class="cell ${v === null ? "empty" : hl[k] || ""}" style="width:38px;height:36px;font-size:13px">${v === null ? "·" : v}</div><div class="cellidx">${k}</div></div>`).join("")}</div>`,
      under: `<span><b>size</b> = ${size}</span><span><b>capacity</b> = ${data.length}</span><span><b>copies</b> = ${copies}</span><span><b>2 × size</b> = ${2 * size}</span>`,
      line, msg, msgCls: cls, out: out.slice(),
      vars: [["size", String(size)], ["capacity", String(data.length)], ["copies", String(copies)]],
    });
    s(1, "An empty <code>IntArrayList</code> with capacity 1.");
    for (let x = 1; x <= N; x++) {
      if (size === data.length) {
        const old = data.length;
        const bigger = Array(2 * old).fill(null);
        for (let i = 0; i < size; i++) { bigger[i] = data[i]; copies++; }
        data = bigger;
        out.push(`  full at size ${size}: capacity ${old} -> ${data.length}`);
        const hl = {}; for (let i = 0; i < size; i++) hl[i] = "ghost";
        s(9, `add(${x}): the array is full (size ${size} = capacity ${old}). Allocate ${2 * old} cells and copy the ${size} element${size === 1 ? "" : "s"} across.`, hl, "bad");
      }
      data[size] = x;
      size++;
      s(12, `add(${x}): <code>data[${size - 1}] = ${x}</code>. ${copies} copies so far for ${size} elements.`, { [size - 1]: "found" });
    }
    out.push(`size ${size}, capacity ${data.length}`);
    out.push(`copies in total: ${copies} (fewer than 2 * ${N} = ${2 * N})`);
    s(12, `Done: ${copies} copies for ${N} appends, fewer than 2 × ${N} = ${2 * N}. On average O(1) per <code>add</code>.`, {}, "good");
    return snaps;
  }
  makePlayer(el, {
    code: CODE.add, console: true, sideLabel: "fields", build,
    extraControls: `<label>append 1 … <input type="range" class="gr-n" min="1" max="40" value="${N}"> <b class="gr-nv mono">${N}</b></label>`,
    onMount(root, rebuild) {
      root.querySelector(".gr-n").oninput = (e) => { N = +e.target.value; root.querySelector(".gr-nv").textContent = N; rebuild(); };
    },
  });
}

// ---------- Ch4: the middle node ----------

function demoMiddle(el) {
  let n = 6, version = "first";
  function build() {
    const h = new Heap();
    const ids = h.chain(Array.from({ length: n }, (_, k) => k + 1));
    const R = recorder(h);
    const first = version === "first";
    const S = first ? "slowPointer" : "slow", F = first ? "fastPointer" : "fast";
    let slow = ids[0], fast = ids[0];
    const snap = (line, msg, more = {}) => R.snap({ head: ids[0], [S]: slow, [F]: fast }, line, msg, { cls: { [slow]: "cur" }, ...more });
    snap(first ? 3 : 3, "Both pointers start at the head.");
    if (first) {
      while (fast) {
        fast = h.n[fast].next;
        snap(5, fast ? `<code>fastPointer = fastPointer.next</code> → node(${h.val(fast)}).` : "<code>fastPointer = fastPointer.next</code> → null.", { hotPtr: [F] });
        if (fast && h.n[fast].next) {
          slow = h.n[slow].next;
          snap(7, `Two more nodes exist, so <code>slowPointer</code> moves one → node(${h.val(slow)}) …`, { hotPtr: [S] });
          fast = h.n[fast].next;
          snap(8, `… and <code>fastPointer</code> moves one more → node(${h.val(fast)}). Fast has gone twice as far as slow.`, { hotPtr: [F] });
        } else if (fast) {
          snap(6, `<code>fastPointer.next</code> is null: no room for slow to move. It stays at node(${h.val(slow)}).`);
        }
      }
      snap(4, "<code>fastPointer == null</code>: the loop ends.");
    } else {
      while (fast && h.n[fast].next) {
        slow = h.n[slow].next;
        snap(5, `<code>slow = slow.next</code> → node(${h.val(slow)}).`, { hotPtr: [S] });
        fast = h.n[h.n[fast].next].next;
        snap(6, fast ? `<code>fast = fast.next.next</code> → node(${h.val(fast)}).` : "<code>fast = fast.next.next</code> → null (it jumped past the last node).", { hotPtr: [F] });
      }
      snap(4, fast ? `<code>fast.next == null</code>: fast is on the last node. The loop ends.` : "<code>fast == null</code>: the loop ends.");
    }
    snap(first ? 11 : 8, `Return node(${h.val(slow)}). ${n % 2 ? "Odd length: the one middle node." : `Even length: the ${first ? "first" : "second"} of the two middle nodes (${n / 2} and ${n / 2 + 1}).`}`, { cls: { [slow]: "found" }, msgCls: "good" });
    return R.snaps;
  }
  makePlayer(el, {
    code: () => (version === "first" ? CODE.findMiddleNode : CODE.middleNode),
    build,
    extraControls: `<select class="md-v"><option value="first">findMiddleNode (slides' Java)</option><option value="second">middleNode (slides' Python)</option></select>
      <label>n <input type="range" class="md-n" min="1" max="7" value="${n}"> <b class="md-nv mono">${n}</b></label>`,
    onMount(root, rebuild) {
      root.querySelector(".md-v").onchange = (e) => { version = e.target.value; rebuild(); };
      root.querySelector(".md-n").oninput = (e) => { n = +e.target.value; root.querySelector(".md-nv").textContent = n; rebuild(); };
    },
  });
}

// ---------- Ch4: reversing a list ----------

function demoReverse(el, { mini = false } = {}) {
  let vals = [5, 6, 7, 1, 2];
  function build() {
    const h = new Heap();
    const ids = h.chain(vals);
    const R = recorder(h);
    let prev = null, curr = ids[0] || null, nxt = null;
    const snap = (line, msg, more = {}) => R.snap({ head: ids[0] || null, previousNode: prev, currentNode: curr, nextNode: nxt }, line, msg,
      { cls: curr ? { [curr]: "cur" } : {}, showNull: true, ...more });
    snap(2, "<code>previousNode = null</code>: the reversed part is empty, and null will be the new end. <code>head</code> is the caller's variable.");
    while (curr) {
      nxt = h.n[curr].next;
      snap(5, nxt ? `Save the rest: <code>nextNode</code> = node(${h.val(nxt)}).` : "Save the rest: <code>nextNode</code> = null (this is the last node).", { hotPtr: ["nextNode"] });
      h.n[curr].next = prev;
      snap(6, prev ? `Reverse the link: node(${h.val(curr)}) now points back to node(${h.val(prev)}).` : `Reverse the link: node(${h.val(curr)}) now points to null: it will be the last node.`, { hot: ["n:" + curr] });
      prev = curr;
      snap(7, `<code>previousNode = currentNode</code>: the reversed part now ends at node(${h.val(prev)}).`, { hotPtr: ["previousNode"] });
      curr = nxt;
      snap(8, curr ? `<code>currentNode = nextNode</code> → node(${h.val(curr)}). Without the saved <code>nextNode</code> we could not get here.` : "<code>currentNode = nextNode</code> → null.", { hotPtr: ["currentNode"] });
    }
    snap(10, prev ? `<code>currentNode == null</code>: return <code>previousNode</code>, node(${h.val(prev)}), the new head. The old head node(${vals[0]}) is now last. O(n) time, O(1) extra space.` : "Empty list: return null.", { cls: prev ? { [prev]: "found" } : {}, msgCls: "good" });
    return R.snaps;
  }
  makePlayer(el, {
    mini, code: CODE.reverse, build,
    extraControls: `<label>list <input type="text" class="rv-l" value="${vals.join(", ")}" style="width:140px"></label>`,
    onMount(root, rebuild) {
      if (mini) return;
      root.querySelector(".rv-l").onchange = (e) => { vals = parseList(e.target.value, [5, 6, 7, 1, 2], 6); e.target.value = vals.join(", "); rebuild(); };
    },
  });
}

// ---------- Ch5: doubly linked list operations ----------

const DLL_OPS = {
  insertAfter: "insertAfter(find(key), x)",
  remove: "remove(find(key))",
  deleteFirst: "deleteFirst() = remove(head)",
  deleteLast: "deleteLast() = remove(tail)",
};

function buildDll(op, vals, x, key) {
  const h = new Heap(true);
  const ids = h.chain(vals);
  let head = ids[0] || null, tail = ids[ids.length - 1] || null;
  const R = recorder(h);
  const P = (more) => ({ head, tail, ...more });
  if (op === "insertAfter") {
    const at = ids.find((q) => h.val(q) === key) || null;
    R.snap(P({ at }), 1, at ? `<code>at = find(${key})</code> → node(${key}). insertAfter(at, ${x}).` : `<code>find(${key})</code> returns null: there is no node to insert after.`, { cls: at ? { [at]: "cur" } : {}, msgCls: at ? "" : "bad" });
    if (!at) return R.snaps;
    const nn = h.make(x, h.n[at].col + 0.5, 1);
    const cls = { [at]: "cur", [nn]: "new" };
    R.snap(P({ at, node: nn }), 2, `A new node holding ${x}; both its references are null.`, { cls });
    h.n[nn].prev = at;
    R.snap(P({ at, node: nn }), 3, "1: <code>node.prev = at</code>.", { cls, hot: ["p:" + nn] });
    h.n[nn].next = h.n[at].next;
    R.snap(P({ at, node: nn }), 4, h.n[nn].next ? `2: <code>node.next = at.next</code> → node(${h.val(h.n[nn].next)}).` : "2: <code>node.next = at.next</code> = null.", { cls, hot: ["n:" + nn] });
    if (!h.n[at].next) {
      tail = nn;
      R.snap(P({ at, node: nn }), 6, "<code>at</code> was the last node, so the new node becomes the <code>tail</code>.", { cls, hotPtr: ["tail"] });
    } else {
      const succ = h.n[at].next;
      h.n[succ].prev = nn;
      R.snap(P({ at, node: nn }), 8, `3: <code>at.next.prev = node</code>: node(${h.val(succ)}) now points back to the new node. Do this <b>before</b> step 4, while <code>at.next</code> still leads to node(${h.val(succ)}).`, { cls, hot: ["p:" + succ] });
    }
    h.n[at].next = nn;
    R.snap(P({ at, node: nn }), 10, "4: <code>at.next = node</code>.", { cls, hot: ["n:" + at] });
    h.tidy(head);
    R.snap(P({}), 11, "Redrawn. Four references set, no walking: O(1) once you hold <code>at</code>.", { msgCls: "good" });
  } else {
    let node = null;
    if (op === "remove") node = ids.find((q) => h.val(q) === key) || null;
    if (op === "deleteFirst") node = head;
    if (op === "deleteLast") node = tail;
    const how = op === "remove" ? `<code>find(${key})</code>` : op === "deleteFirst" ? "<code>head</code>" : "<code>tail</code>";
    R.snap(P({ node }), 1, node ? `remove(node) with node = ${how} = node(${h.val(node)}).` : `${how} is null: nothing to remove.`, { cls: node ? { [node]: "bad" } : {}, msgCls: node ? "" : "bad" });
    if (!node) return R.snaps;
    const pv = h.n[node].prev, nx = h.n[node].next;
    h.n[node].row = 1;
    if (!pv) {
      head = nx;
      R.snap(P({ node }), 3, nx ? `<code>node.prev == null</code>: it is the first node, so <code>head = node.next</code> → node(${h.val(nx)}).` : "<code>node.prev == null</code>: <code>head = node.next</code> = null.", { cls: { [node]: "bad" }, hotPtr: ["head"] });
    } else {
      h.n[pv].next = nx;
      R.snap(P({ node }), 5, `<code>node.prev.next = node.next</code>: node(${h.val(pv)}) now skips forward ${nx ? `to node(${h.val(nx)})` : "to null"}.`, { cls: { [node]: "bad" }, hot: ["n:" + pv] });
    }
    if (!nx) {
      tail = pv;
      R.snap(P({ node }), 8, pv ? `<code>node.next == null</code>: it was the last node, so <code>tail = node.prev</code> → node(${h.val(pv)}). No walk needed: that is the O(1) delete-last a singly linked list cannot do.` : "<code>tail = node.prev</code> = null: the list is empty.", { cls: { [node]: "bad" }, hotPtr: ["tail"] });
    } else {
      h.n[nx].prev = pv;
      R.snap(P({ node }), 10, `<code>node.next.prev = node.prev</code>: node(${h.val(nx)}) now skips back ${pv ? `to node(${h.val(pv)})` : "to null"}.`, { cls: { [node]: "bad" }, hot: ["p:" + nx] });
    }
    h.drop(node);
    if (head) h.tidy(head);
    R.snap(P({}), 12, "Unlinked. At most two references changed, and we never searched for the predecessor: <b>O(1)</b>.", { msgCls: "good" });
  }
  return R.snaps;
}

function demoDll(el, { mini = false } = {}) {
  let op = "insertAfter", vals = [13, 15, 19, 57], x = 17, key = 15;
  makePlayer(el, {
    mini,
    code: () => (op === "insertAfter" ? CODE.dllInsertAfter : CODE.dllRemove),
    build: () => buildDll(op, vals, x, key),
    extraControls: `<select class="dl-op">${Object.entries(DLL_OPS).map(([k, v]) => `<option value="${k}">${v}</option>`).join("")}</select>
      <label>list <input type="text" class="dl-l" value="${vals.join(", ")}" style="width:120px"></label>
      <label>x <input type="number" class="dl-x" value="${x}" style="width:56px"></label>
      <label>key <input type="number" class="dl-k" value="${key}" style="width:56px"></label>`,
    onMount(root, rebuild) {
      if (mini) return;
      root.querySelector(".dl-op").onchange = (e) => { op = e.target.value; rebuild(); };
      root.querySelector(".dl-l").onchange = (e) => { vals = parseList(e.target.value, [13, 15, 19, 57], 5); e.target.value = vals.join(", "); rebuild(); };
      root.querySelector(".dl-x").onchange = (e) => { x = Math.trunc(+e.target.value) || 0; rebuild(); };
      root.querySelector(".dl-k").onchange = (e) => { key = Math.trunc(+e.target.value) || 0; rebuild(); };
    },
  });
}

// ---------- Ch5: round robin on a circular list ----------

function demoRoundRobin(el, { mini = false } = {}) {
  let burst = [5, 3, 1, 4], quantum = 2;
  function build() {
    const names = burst.map((_, k) => "P" + (k + 1));
    const procs = burst.map((b, k) => ({ name: names[k], remaining: b, next: (k + 1) % burst.length, done: null }));
    const snaps = [];
    const out = [];
    let time = 0, curr = 0, prev = burst.length - 1;
    const N = burst.length, R = 92, CX = 170, CY = 128;
    const at = (k) => [CX + R * Math.sin((2 * Math.PI * k) / N), CY - R * Math.cos((2 * Math.PI * k) / N)];
    const draw = (cur, pv, hotLink) => {
      let g = `<svg viewBox="0 0 340 256" width="340" style="width:340px" role="img" aria-label="round robin circle">
        <defs><marker id="rra" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="var(--ink)"/></marker>
        <marker id="rrh" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="var(--amber)"/></marker></defs>`;
      g += `<text x="${CX}" y="${CY - 4}" text-anchor="middle" font-size="13" fill="var(--stone)">time</text><text x="${CX}" y="${CY + 16}" text-anchor="middle" font-size="18" font-weight="700" fill="var(--ink)">${time}</text>`;
      procs.forEach((p, k) => {
        if (p.done !== null) return;
        const [x1, y1] = at(k), [x2, y2] = at(p.next);
        if (p.next === k) {
          g += `<path d="M ${x1 + 18} ${y1 - 14} C ${x1 + 50} ${y1 - 40}, ${x1 + 50} ${y1 + 30}, ${x1 + 22} ${y1 + 10}" fill="none" stroke="var(--ink)" stroke-width="1.3" marker-end="url(#rra)"/>`;
          return;
        }
        const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy), ux = dx / len, uy = dy / len;
        const sx = x1 + ux * 30, sy = y1 + uy * 20, ex = x2 - ux * 30, ey = y2 - uy * 20;
        const mx = (sx + ex) / 2 + uy * 24, my = (sy + ey) / 2 - ux * 24;   // bow to the left of the direction, so a→b and b→a do not overlap
        const hotL = hotLink === k;
        g += `<path d="M ${sx} ${sy} Q ${mx} ${my} ${ex} ${ey}" fill="none" stroke="${hotL ? "var(--amber)" : "var(--ink)"}" stroke-width="${hotL ? 2.4 : 1.3}" marker-end="url(#${hotL ? "rrh" : "rra"})"/>`;
      });
      procs.forEach((p, k) => {
        const [x, y] = at(k);
        const isCur = k === cur, isPrev = k === pv && pv !== cur;
        const fill = p.done !== null ? "var(--paper-2)" : isCur ? "var(--mark)" : "var(--card)";
        const stroke = p.done !== null ? "var(--line)" : isCur ? "var(--amber)" : isPrev ? "var(--teal)" : "var(--ink)";
        g += `<g opacity="${p.done !== null ? 0.45 : 1}"><rect x="${x - 30}" y="${y - 18}" width="60" height="36" rx="7" fill="${fill}" stroke="${stroke}" stroke-width="${isCur || isPrev ? 2 : 1.2}"/>
          <text x="${x}" y="${y - 2}" text-anchor="middle" font-size="13" font-weight="700" fill="var(--ink)">${p.name}</text>
          <text x="${x}" y="${y + 12}" text-anchor="middle" font-size="10.5" fill="var(--stone)">${p.done !== null ? "done@" + p.done : p.remaining + " left"}</text></g>`;
        const lbl = [isCur ? "curr" : "", isPrev ? "prev" : ""].filter(Boolean).join(", ");
        if (lbl && p.done === null) {
          const ox = x + (x >= CX ? 34 : -34), anchor = x >= CX ? "start" : "end";
          g += `<text x="${ox}" y="${y - 20}" text-anchor="${anchor}" font-size="11.5" font-weight="600" fill="${isCur ? "var(--amber)" : "var(--teal)"}">${lbl}</text>`;
        }
      });
      return g + "</svg>";
    };
    const s = (line, msg, cls = "", hotLink = -1, cur = curr, pv = prev) => snaps.push({
      draw: draw(cur, pv, hotLink), line, msg, msgCls: cls, out: out.slice(),
      under: `<span><b>quantum</b> = ${quantum}</span><span><b>time</b> = ${time}</span>`,
      vars: [["time", String(time)], ["curr", cur === null ? "null" : procs[cur].name], ["prev", pv === null ? "null" : procs[pv].name]],
    });
    s(1, `${N} processes in a circle, quantum ${quantum}. Each turn, <code>curr</code> runs for min(quantum, time left).`);
    let guard = 0;
    while (curr !== null && guard++ < 200) {
      const p = procs[curr];
      const run = Math.min(quantum, p.remaining);
      p.remaining -= run;
      const line = `t=${time}..${time + run}  ${p.name}`;
      time += run;
      if (p.remaining > 0) {
        out.push(`${line}  (${p.remaining} left)`);
        s(7, `${p.name} runs ${run}: ${p.remaining} left, so it stays in the circle.`, "", -1);
        prev = curr;
        curr = p.next;
        s(9, `<code>prev = curr; curr = curr.next</code> → ${procs[curr].name}.`, "", prev);
      } else {
        out.push(`${line}  done`);
        p.done = time;
        if (p.next === curr) {
          s(14, `${p.name} finishes at t = ${time}. It was the last process: <code>curr = null</code>.`, "good", -1, null, null);
          curr = null;
        } else {
          procs[prev].next = p.next;
          s(16, `${p.name} finishes at t = ${time}. <code>prev.next = curr.next</code>: ${procs[prev].name} now links straight to ${procs[p.next].name}. That is why we carry <code>prev</code>.`, "good", prev, curr, prev);
          curr = p.next;
          s(17, `<code>curr = curr.next</code> → ${procs[curr].name}.`, "", -1);
        }
      }
    }
    const order = procs.slice().filter((p) => p.done !== null).sort((a, b) => a.done - b.done).map((p) => `${p.name} at ${p.done};`).join(" ");
    out.push(`finished: ${order}`);
    s(20, `All done. Finishing order: ${order}`, "good", -1, null, null);
    return snaps;
  }
  makePlayer(el, {
    mini, code: CODE.roundRobinLoop, console: true, build,
    extraControls: `<label>burst times <input type="text" class="rr-b" value="${burst.join(", ")}" style="width:110px"></label>
      <label>quantum <input type="number" class="rr-q" min="1" max="5" value="${quantum}" style="width:52px"></label>`,
    onMount(root, rebuild) {
      if (mini) return;
      root.querySelector(".rr-b").onchange = (e) => { burst = parseNums(e.target.value, [5, 3, 1, 4]).map((v) => Math.max(1, Math.min(9, v))).slice(0, 6); e.target.value = burst.join(", "); rebuild(); };
      root.querySelector(".rr-q").onchange = (e) => { quantum = Math.max(1, Math.min(5, Math.trunc(+e.target.value) || 1)); e.target.value = quantum; rebuild(); };
    },
  });
}

// ---------- quiz ----------

function demoQuiz(el, questions) {
  el.innerHTML = `<div class="quiz">` + questions.map((q, k) => `<div class="card q" data-k="${k}">
      <p><b>Q${k + 1}.</b> ${q.q}</p>${q.code ? codeBlock(q.code) : ""}
      <div class="opts">${q.opts.map((o, j) => `<button class="opt" data-j="${j}">${o}</button>`).join("")}</div>
      <div class="explain">${q.why}</div></div>`).join("") +
    `<p class="score"></p></div>`;
  let right = 0, done = 0;
  el.querySelectorAll(".q").forEach((qe) => {
    const q = questions[+qe.dataset.k];
    qe.querySelectorAll(".opt").forEach((b) => {
      b.onclick = () => {
        const j = +b.dataset.j;
        qe.querySelectorAll(".opt").forEach((x) => { x.disabled = true; });
        qe.querySelectorAll(".opt")[q.a].classList.add("right");
        if (j !== q.a) b.classList.add("wrong"); else right++;
        qe.classList.add("done");
        done++;
        el.querySelector(".score").textContent = `${right} / ${done} correct` + (done === questions.length ? (right === questions.length ? " — all right!" : " — reread the sections you missed.") : "");
      };
    });
  });
}

// Demo registry: a data-demo attribute in chapters.js mounts the DEMOS entry of that name.
const DEMOS = {
  arrayShift: (el) => demoArrayShift(el),
  arrayMini: (el) => demoArrayShift(el, { mini: true }),
  kinds: (el) => demoKinds(el),
  kindsMini: (el) => demoKinds(el, { mini: true }),
  memoryWalk: (el) => demoMemoryWalk(el),
  walkMini: (el) => demoMemoryWalk(el, { mini: true }),
  linkInsert: (el) => demoLinkOps(el, { ops: ["insertFirst", "insertLast", "insertAfter", "insertAfterWrong"], op: "insertFirst" }),
  linkAfter: (el) => demoLinkOps(el, { ops: ["insertAfter", "insertAfterWrong"], op: "insertAfter", vals: [1, 2, 3], x: 9, key: 1 }),
  linkDelete: (el) => demoLinkOps(el, { ops: ["deleteFirst", "deleteLast", "deleteAfter"], op: "deleteFirst", vals: [1, 2, 3, 4], key: 1 }),
  linkMini: (el) => demoLinkOps(el, { mini: true, op: "insertAfter", vals: [1, 2, 3], x: 9, key: 1 }),
  positional: (el) => demoPositional(el),
  grow: (el) => demoGrow(el),
  middle: (el) => demoMiddle(el),
  reverse: (el) => demoReverse(el),
  reverseMini: (el) => demoReverse(el, { mini: true }),
  dll: (el) => demoDll(el),
  roundRobin: (el) => demoRoundRobin(el),
  quiz: (el) => demoQuiz(el, QUIZ),
};
