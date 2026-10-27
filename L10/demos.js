// Interactive demos. Every code panel is copied from notes/L10-queues.md (checked by
// tools/check.py; the CODE block is generated from the note); the JS twins below replay
// what the Java does, step by step.

const CODE = {
  printSpooler: "import java.util.ArrayDeque;\nimport java.util.Queue;\n\npublic class PrintSpooler {\n    public static void main(String[] args) {\n        Queue<String> jobs = new ArrayDeque<>();\n        jobs.offer(\"report.pdf\");          // enqueue at the rear\n        jobs.offer(\"photo.png\");\n        jobs.offer(\"slides.pptx\");\n        System.out.println(\"waiting: \" + jobs);\n        System.out.println(\"next up: \" + jobs.peek());\n        while (!jobs.isEmpty()) {\n            System.out.println(\"printing \" + jobs.poll());   // dequeue from the front\n        }\n        System.out.println(\"poll on empty: \" + jobs.poll());\n    }\n}",
  printSpoolerOut: "waiting: [report.pdf, photo.png, slides.pptx]\nnext up: report.pdf\nprinting report.pdf\nprinting photo.png\nprinting slides.pptx\npoll on empty: null",
  linkedQueue: "public class LinkedQueue<T> {\n    private static class Node<T> {\n        T element;\n        Node<T> next;\n\n        Node(T element) {\n            this.element = element;\n        }\n    }\n\n    private Node<T> head;   // front: the next element to dequeue\n    private Node<T> tail;   // rear: the most recently enqueued element\n    private int size;\n\n    public boolean isEmpty() {\n        return size == 0;\n    }\n\n    public boolean isFull() {\n        return false;       // a linked list can always grow\n    }\n\n    public int size() {\n        return size;\n    }\n\n    public void enqueue(T e) {\n        Node<T> node = new Node<>(e);\n        if (isEmpty()) {\n            head = node;        // the only node is both front and rear\n        } else {\n            tail.next = node;   // link it behind the current rear\n        }\n        tail = node;\n        size++;\n    }\n\n    public T dequeue() {\n        if (isEmpty()) {\n            throw new IllegalStateException(\"Queue empty\");\n        }\n        T e = head.element;\n        head = head.next;       // unlink the front node\n        if (head == null) {\n            tail = null;        // the queue became empty\n        }\n        size--;\n        return e;\n    }\n\n    public T peek() {\n        if (isEmpty()) {\n            throw new IllegalStateException(\"Queue empty\");\n        }\n        return head.element;\n    }\n\n    @Override\n    public String toString() {\n        StringBuilder sb = new StringBuilder(\"front [\");\n        for (Node<T> p = head; p != null; p = p.next) {\n            sb.append(p.element);\n            if (p.next != null) {\n                sb.append(\" -> \");\n            }\n        }\n        return sb.append(\"] rear\").toString();\n    }\n}",
  linkedQueueDemo: "public class LinkedQueueDemo {\n    public static void main(String[] args) {\n        LinkedQueue<Character> q = new LinkedQueue<>();\n        q.enqueue('A');\n        System.out.println(q);\n        q.enqueue('B');\n        System.out.println(\"enqueue B: \" + q);\n        q.enqueue('C');\n        System.out.println(\"enqueue C: \" + q);\n        char x = q.dequeue();\n        System.out.println(\"dequeue -> \" + x + \": \" + q);\n        System.out.println(\"peek = \" + q.peek() + \", size = \" + q.size());\n    }\n}",
  linkedQueueDemoOut: "front [A] rear\nenqueue B: front [A -> B] rear\nenqueue C: front [A -> B -> C] rear\ndequeue -> A: front [B -> C] rear\npeek = B, size = 2",
  emptyDequeue: "public class EmptyDequeue {\n    public static void main(String[] args) {\n        LinkedQueue<Integer> q = new LinkedQueue<>();\n        q.enqueue(7);\n        System.out.println(q.dequeue());\n        System.out.println(q.dequeue());   // underflow\n    }\n}",
  emptyDequeueOut: "7",
  queueArray: "public class QueueArray {\n    int capacity;\n    int front, rear;\n    ElementType[] array;\n}",
  linearArrayQueue: "public class LinearArrayQueue {\n    private final int[] array;\n    private int front = 0;      // index of the front element\n    private int rear = -1;      // index of the rear element\n    private int size = 0;\n\n    public LinearArrayQueue(int capacity) {\n        array = new int[capacity];\n    }\n\n    public boolean isEmpty() {\n        return size == 0;\n    }\n\n    /** Returns false, and changes nothing, if rear is already at the last cell. */\n    public boolean enqueue(int x) {\n        if (rear == array.length - 1) {\n            return false;\n        }\n        size++;\n        rear++;\n        array[rear] = x;\n        return true;\n    }\n\n    public int dequeue() {\n        if (isEmpty()) {\n            throw new IllegalStateException(\"Queue empty\");\n        }\n        int x = array[front];\n        size--;\n        front++;\n        return x;\n    }\n\n    @Override\n    public String toString() {\n        StringBuilder sb = new StringBuilder(\"[\");\n        for (int i = 0; i < array.length; i++) {\n            sb.append(i >= front && i <= rear ? String.valueOf(array[i]) : \"_\");\n            sb.append(i < array.length - 1 ? \" \" : \"]\");\n        }\n        return sb + \" front=\" + front + \" rear=\" + rear + \" size=\" + size;\n    }\n}",
  linearArrayDemo: "public class LinearArrayDemo {\n    public static void main(String[] args) {\n        LinearArrayQueue q = new LinearArrayQueue(4);\n        for (int x : new int[] {10, 20, 30, 40}) {\n            q.enqueue(x);\n        }\n        System.out.println(q);\n        System.out.println(\"dequeue -> \" + q.dequeue());\n        System.out.println(\"dequeue -> \" + q.dequeue());\n        System.out.println(q);\n        System.out.println(\"enqueue 50 ok? \" + q.enqueue(50));\n    }\n}",
  linearArrayDemoOut: "[10 20 30 40] front=0 rear=3 size=4\ndequeue -> 10\ndequeue -> 20\n[_ _ 30 40] front=2 rear=3 size=2\nenqueue 50 ok? false",
  circularQueue: "public class CircularQueue {\n    private final int[] array;\n    private int front = 0;   // index of the front element\n    private int size = 0;    // number of elements\n\n    public CircularQueue(int capacity) {\n        array = new int[capacity];\n    }\n\n    public boolean isEmpty() {\n        return size == 0;\n    }\n\n    public boolean isFull() {\n        return size == array.length;\n    }\n\n    public int size() {\n        return size;\n    }\n\n    public int front() {\n        return front;\n    }\n\n    /** Index of the rear element (only meaningful when the queue is not empty). */\n    public int rear() {\n        return (front + size - 1) % array.length;\n    }\n\n    public void enqueue(int x) {\n        if (isFull()) {\n            throw new IllegalStateException(\"Queue full\");\n        }\n        int rear = (front + size) % array.length;   // first free cell after the rear\n        array[rear] = x;\n        size++;\n    }\n\n    public int dequeue() {\n        if (isEmpty()) {\n            throw new IllegalStateException(\"Queue empty\");\n        }\n        int x = array[front];\n        front = (front + 1) % array.length;\n        size--;\n        return x;\n    }\n\n    public int peek() {\n        if (isEmpty()) {\n            throw new IllegalStateException(\"Queue empty\");\n        }\n        return array[front];\n    }\n\n    /** The array cells from index 0, with _ for a free cell. */\n    public String cells() {\n        StringBuilder sb = new StringBuilder(\"[\");\n        for (int i = 0; i < array.length; i++) {\n            boolean used = (i - front + array.length) % array.length < size;\n            sb.append(used ? String.valueOf(array[i]) : \"_\");\n            sb.append(i < array.length - 1 ? \" \" : \"]\");\n        }\n        return sb.toString();\n    }\n}",
  circularQueueDemo: "public class CircularQueueDemo {\n    static void show(String what, CircularQueue q) {\n        System.out.printf(\"%-12s %s  front=%d size=%d rear=%d%n\",\n                what, q.cells(), q.front(), q.size(), q.rear());\n    }\n\n    public static void main(String[] args) {\n        CircularQueue q = new CircularQueue(4);\n        q.enqueue(14);\n        show(\"enqueue 14\", q);\n        q.enqueue(22);\n        show(\"enqueue 22\", q);\n        q.enqueue(13);\n        show(\"enqueue 13\", q);\n        int x = q.dequeue();\n        show(\"dequeue \" + x, q);\n        q.enqueue(15);\n        show(\"enqueue 15\", q);\n        q.enqueue(4);\n        show(\"enqueue 4\", q);\n        System.out.println(\"full? \" + q.isFull());\n    }\n}",
  circularQueueDemoOut: "enqueue 14   [14 _ _ _]  front=0 size=1 rear=0\nenqueue 22   [14 22 _ _]  front=0 size=2 rear=1\nenqueue 13   [14 22 13 _]  front=0 size=3 rear=2\ndequeue 14   [_ 22 13 _]  front=1 size=2 rear=2\nenqueue 15   [_ 22 13 15]  front=1 size=3 rear=3\nenqueue 4    [4 22 13 15]  front=1 size=4 rear=0\nfull? true",
  circularQueueFR: "public class CircularQueueFR {\n    private final int[] queue;\n    private int front = -1;\n    private int rear = -1;\n\n    public CircularQueueFR(int max) {\n        queue = new int[max];\n    }\n\n    public boolean isEmpty() {\n        return front == -1;\n    }\n\n    public boolean isFull() {\n        return (rear + 1) % queue.length == front;\n    }\n\n    /** Returns false (overflow) if the queue is full. */\n    public boolean enqueue(int val) {\n        if (isFull()) {\n            return false;\n        }\n        if (isEmpty()) {\n            front = 0;\n            rear = 0;\n        } else {\n            rear = (rear + 1) % queue.length;\n        }\n        queue[rear] = val;\n        return true;\n    }\n\n    public int dequeue() {\n        if (isEmpty()) {\n            throw new IllegalStateException(\"Underflow\");\n        }\n        int val = queue[front];\n        if (front == rear) {          // that was the only element\n            front = -1;\n            rear = -1;\n        } else {\n            front = (front + 1) % queue.length;\n        }\n        return val;\n    }\n\n    public String state() {\n        StringBuilder sb = new StringBuilder(\"[\");\n        for (int i = 0; i < queue.length; i++) {\n            boolean used = !isEmpty()\n                    && (i - front + queue.length) % queue.length\n                       <= (rear - front + queue.length) % queue.length;\n            sb.append(used ? String.valueOf(queue[i]) : \"_\");\n            sb.append(i < queue.length - 1 ? \" \" : \"]\");\n        }\n        return sb + \" front=\" + front + \" rear=\" + rear;\n    }\n}",
  circularQueueFRDemo: "public class CircularQueueFRDemo {\n    public static void main(String[] args) {\n        CircularQueueFR q = new CircularQueueFR(5);\n        System.out.println(\"start        \" + q.state());\n        for (int x : new int[] {10, 20, 30, 40, 50}) {\n            q.enqueue(x);\n            System.out.println(\"enqueue \" + x + \"   \" + q.state());\n        }\n        System.out.println(\"dequeue -> \" + q.dequeue() + \" \" + q.state());\n        System.out.println(\"dequeue -> \" + q.dequeue() + \" \" + q.state());\n        for (int x : new int[] {60, 70, 80}) {\n            boolean ok = q.enqueue(x);\n            System.out.println(\"enqueue \" + x + \"   \" + q.state() + (ok ? \"\" : \"  OVERFLOW\"));\n        }\n    }\n}",
  circularQueueFRDemoOut: "start        [_ _ _ _ _] front=-1 rear=-1\nenqueue 10   [10 _ _ _ _] front=0 rear=0\nenqueue 20   [10 20 _ _ _] front=0 rear=1\nenqueue 30   [10 20 30 _ _] front=0 rear=2\nenqueue 40   [10 20 30 40 _] front=0 rear=3\nenqueue 50   [10 20 30 40 50] front=0 rear=4\ndequeue -> 10 [_ 20 30 40 50] front=1 rear=4\ndequeue -> 20 [_ _ 30 40 50] front=2 rear=4\nenqueue 60   [60 _ 30 40 50] front=2 rear=0\nenqueue 70   [60 70 30 40 50] front=2 rear=1\nenqueue 80   [60 70 30 40 50] front=2 rear=1  OVERFLOW",
  trafficLight: "public class TrafficLight {\n    public static void main(String[] args) {\n        String[] names = {\"RED\", \"YELLOW\", \"GREEN\"};\n        CircularQueue lights = new CircularQueue(3);\n        for (int i = 0; i < names.length; i++) {\n            lights.enqueue(i);\n        }\n        for (int minute = 1; minute <= 7; minute++) {\n            int light = lights.dequeue();   // the light whose turn it is\n            System.out.println(\"minute \" + minute + \": \" + names[light]);\n            lights.enqueue(light);          // back to the end of the line\n        }\n    }\n}",
  trafficLightOut: "minute 1: RED\nminute 2: YELLOW\nminute 3: GREEN\nminute 4: RED\nminute 5: YELLOW\nminute 6: GREEN\nminute 7: RED",
  priorityQueueDemo: "import java.util.PriorityQueue;\n\npublic class PriorityQueueDemo {\n    public static void main(String[] args) {\n        PriorityQueue<Integer> pq = new PriorityQueue<>();\n        for (int x : new int[] {8, 3, 22, 1, 14, 4}) {   // any insertion order\n            pq.add(x);\n        }\n        System.out.println(\"poll() -> \" + pq.poll());\n        pq.add(2);\n        System.out.println(\"add(2); peek() = \" + pq.peek());\n        System.out.println(\"poll() -> \" + pq.poll());\n        pq.add(5);\n        System.out.print(\"add(5); then poll until empty:\");\n        while (!pq.isEmpty()) {\n            System.out.print(\" \" + pq.poll());\n        }\n        System.out.println();\n    }\n}",
  priorityQueueDemoOut: "poll() -> 1\nadd(2); peek() = 2\npoll() -> 2\nadd(5); then poll until empty: 3 4 5 8 14 22",
  priorityQueueOrder: "import java.util.PriorityQueue;\n\npublic class PriorityQueueOrder {\n    public static void main(String[] args) {\n        PriorityQueue<Integer> pq = new PriorityQueue<>();\n        for (int x : new int[] {5, 1, 4, 2, 3}) {\n            pq.add(x);\n        }\n        System.out.println(\"printed:  \" + pq);\n        System.out.print(\"polled:  \");\n        while (!pq.isEmpty()) {\n            System.out.print(\" \" + pq.poll());\n        }\n        System.out.println();\n    }\n}",
  priorityQueueOrderOut: "printed:  [1, 2, 4, 5, 3]\npolled:   1 2 3 4 5",
  sortedListPQ: "public class SortedListPQ {\n    private static class Node {\n        int value;\n        Node next;\n\n        Node(int value, Node next) {\n            this.value = value;\n            this.next = next;\n        }\n    }\n\n    private Node head;   // the smallest value: highest priority\n\n    public boolean isEmpty() {\n        return head == null;\n    }\n\n    /** Inserts x before the first larger value; returns how many nodes it walked past. */\n    public int add(int x) {\n        if (head == null || x < head.value) {\n            head = new Node(x, head);\n            return 0;\n        }\n        Node p = head;\n        int steps = 1;\n        while (p.next != null && p.next.value <= x) {\n            p = p.next;\n            steps++;\n        }\n        p.next = new Node(x, p.next);\n        return steps;\n    }\n\n    public int poll() {\n        if (head == null) {\n            throw new IllegalStateException(\"Priority queue empty\");\n        }\n        int x = head.value;\n        head = head.next;\n        return x;\n    }\n\n    @Override\n    public String toString() {\n        StringBuilder sb = new StringBuilder(\"[\");\n        for (Node p = head; p != null; p = p.next) {\n            sb.append(p.value).append(p.next != null ? \", \" : \"\");\n        }\n        return sb.append(\"]\").toString();\n    }\n}",
  sortedListPQDemo: "public class SortedListPQDemo {\n    public static void main(String[] args) {\n        SortedListPQ pq = new SortedListPQ();\n        for (int x : new int[] {1, 3, 4, 8, 14, 22}) {\n            pq.add(x);\n        }\n        System.out.println(pq);\n        System.out.println(\"poll() -> \" + pq.poll() + \"  \" + pq);\n        System.out.println(\"add(2) walked \" + pq.add(2) + \"  \" + pq);\n        System.out.println(\"poll() -> \" + pq.poll() + \"  \" + pq);\n        System.out.println(\"add(5) walked \" + pq.add(5) + \"  \" + pq);\n    }\n}",
  sortedListPQDemoOut: "[1, 3, 4, 8, 14, 22]\npoll() -> 1  [3, 4, 8, 14, 22]\nadd(2) walked 0  [2, 3, 4, 8, 14, 22]\npoll() -> 2  [3, 4, 8, 14, 22]\nadd(5) walked 2  [3, 4, 5, 8, 14, 22]",
  circularDeque: "public class CircularDeque {\n    private final int[] cells;\n    private int front = 0;\n    private int rear;\n    private int size = 0;\n\n    public CircularDeque(int n) {\n        cells = new int[n];\n        rear = n - 1;   // keeps rear == (front + size - 1) mod n, also when empty\n    }\n\n    public boolean isEmpty() {\n        return size == 0;\n    }\n\n    public boolean isFull() {\n        return size == cells.length;\n    }\n\n    private int forward(int i) {\n        return (i + 1) % cells.length;\n    }\n\n    private int backward(int i) {\n        return (i - 1 + cells.length) % cells.length;\n    }\n\n    public void enqueueFront(int x) {\n        if (isFull()) {\n            throw new IllegalStateException(\"Deque full\");\n        }\n        front = backward(front);\n        cells[front] = x;\n        size++;\n    }\n\n    public void enqueueRear(int x) {\n        if (isFull()) {\n            throw new IllegalStateException(\"Deque full\");\n        }\n        rear = forward(rear);\n        cells[rear] = x;\n        size++;\n    }\n\n    public int dequeueFront() {\n        if (isEmpty()) {\n            throw new IllegalStateException(\"Deque empty\");\n        }\n        int x = cells[front];\n        front = forward(front);\n        size--;\n        return x;\n    }\n\n    public int dequeueRear() {\n        if (isEmpty()) {\n            throw new IllegalStateException(\"Deque empty\");\n        }\n        int x = cells[rear];\n        rear = backward(rear);\n        size--;\n        return x;\n    }\n\n    public int getFront() {\n        if (isEmpty()) {\n            throw new IllegalStateException(\"Deque empty\");\n        }\n        return cells[front];\n    }\n\n    public int getRear() {\n        if (isEmpty()) {\n            throw new IllegalStateException(\"Deque empty\");\n        }\n        return cells[rear];\n    }\n\n    public String state() {\n        StringBuilder sb = new StringBuilder(\"[\");\n        for (int i = 0; i < cells.length; i++) {\n            boolean used = (i - front + cells.length) % cells.length < size;\n            sb.append(used ? String.valueOf(cells[i]) : \"_\");\n            sb.append(i < cells.length - 1 ? \" \" : \"]\");\n        }\n        return sb + \" f=\" + front + \" r=\" + rear;\n    }\n}",
  circularDequeDemo: "public class CircularDequeDemo {\n    public static void main(String[] args) {\n        CircularDeque d = new CircularDeque(5);\n        for (int x : new int[] {1, 2, 3}) {\n            d.enqueueRear(x);\n            System.out.println(\"enqueueRear \" + x + \"  \" + d.state());\n        }\n        d.enqueueFront(5);\n        System.out.println(\"enqueueFront 5  \" + d.state());\n        System.out.println(\"getFront = \" + d.getFront() + \", getRear = \" + d.getRear());\n        System.out.println(\"dequeueFront -> \" + d.dequeueFront() + \"  \" + d.state());\n        System.out.println(\"dequeueRear -> \" + d.dequeueRear() + \"  \" + d.state());\n\n        CircularDeque e = new CircularDeque(5);\n        e.enqueueRear(1);\n        e.enqueueFront(3);\n        e.enqueueFront(2);\n        System.out.println(\"second deque    \" + e.state());\n        System.out.println(\"dequeueRear -> \" + e.dequeueRear() + \"  \" + e.state());\n    }\n}",
  circularDequeDemoOut: "enqueueRear 1  [1 _ _ _ _] f=0 r=0\nenqueueRear 2  [1 2 _ _ _] f=0 r=1\nenqueueRear 3  [1 2 3 _ _] f=0 r=2\nenqueueFront 5  [1 2 3 _ 5] f=4 r=2\ngetFront = 5, getRear = 3\ndequeueFront -> 5  [1 2 3 _ _] f=0 r=2\ndequeueRear -> 3  [1 2 _ _ _] f=0 r=1\nsecond deque    [1 _ _ 2 3] f=3 r=0\ndequeueRear -> 1  [_ _ _ 2 3] f=3 r=4",
  dequeAsBoth: "import java.util.ArrayDeque;\nimport java.util.Deque;\n\npublic class DequeAsBoth {\n    public static void main(String[] args) {\n        Deque<Integer> stack = new ArrayDeque<>();\n        Deque<Integer> queue = new ArrayDeque<>();\n        for (int x = 1; x <= 4; x++) {\n            stack.push(x);        // = addFirst: one end only\n            queue.offerLast(x);   // in at the rear\n        }\n        System.out.print(\"as a stack (LIFO):\");\n        while (!stack.isEmpty()) {\n            System.out.print(\" \" + stack.pop());   // = removeFirst\n        }\n        System.out.print(\"\\nas a queue (FIFO):\");\n        while (!queue.isEmpty()) {\n            System.out.print(\" \" + queue.pollFirst());   // out at the front\n        }\n        System.out.println();\n\n        Deque<String> d = new ArrayDeque<>();\n        d.offerFirst(\"b\");\n        d.offerFirst(\"a\");\n        d.offerLast(\"c\");\n        System.out.println(d + \" first=\" + d.peekFirst() + \" last=\" + d.peekLast());\n    }\n}",
  dequeAsBothOut: "as a stack (LIFO): 4 3 2 1\nas a queue (FIFO): 1 2 3 4\n[a, b, c] first=a last=c",
  stackFromQueues: "import java.util.ArrayDeque;\nimport java.util.Queue;\n\npublic class StackFromQueues<T> {\n    private final Queue<T> q1 = new ArrayDeque<>();   // holds the data, top at the front\n    private final Queue<T> q2 = new ArrayDeque<>();   // auxiliary\n\n    public void push(T data) {\n        while (!q1.isEmpty()) {\n            q2.add(q1.poll());          // move everything to q2\n        }\n        q1.add(data);                   // the new top goes first\n        while (!q2.isEmpty()) {\n            q1.add(q2.poll());          // the rest come back behind it\n        }\n    }\n\n    public T pop() {\n        if (q1.isEmpty()) {\n            throw new IllegalStateException(\"Underflow\");\n        }\n        return q1.poll();\n    }\n\n    public T peek() {\n        return q1.peek();\n    }\n\n    public boolean isEmpty() {\n        return q1.isEmpty();\n    }\n}",
  stackFromQueuesDemo: "public class StackFromQueuesDemo {\n    public static void main(String[] args) {\n        int[] keys = {1, 2, 3, 4, 5};\n        StackFromQueues<Integer> s = new StackFromQueues<>();\n        for (int key : keys) {\n            s.push(key);\n        }\n        for (int i = 0; i < keys.length; i++) {\n            System.out.println(s.pop());\n        }\n    }\n}",
  stackFromQueuesDemoOut: "5\n4\n3\n2\n1",
  offByOne: "public class OffByOne {\n    public static void main(String[] args) {\n        int[] keys = {1, 2, 3, 4, 5};\n        StackFromQueues<Integer> s = new StackFromQueues<>();\n        for (int key : keys) {\n            s.push(key);\n        }\n        for (int i = 0; i <= keys.length; i++) {   // one pop too many\n            System.out.println(s.pop());\n        }\n    }\n}",
  offByOneOut: "5\n4\n3\n2\n1",
  stackFromOneQueue: "import java.util.ArrayDeque;\nimport java.util.Queue;\n\npublic class StackFromOneQueue<T> {\n    private final Queue<T> q = new ArrayDeque<>();\n\n    public void push(T data) {\n        q.add(data);\n        for (int i = 0; i < q.size() - 1; i++) {\n            q.add(q.poll());      // rotate the older elements behind the new one\n        }\n    }\n\n    public T pop() {\n        if (q.isEmpty()) {\n            throw new IllegalStateException(\"Underflow\");\n        }\n        return q.poll();\n    }\n\n    @Override\n    public String toString() {\n        return \"top \" + q;\n    }\n}",
  stackFromOneQueueDemo: "public class StackFromOneQueueDemo {\n    public static void main(String[] args) {\n        StackFromOneQueue<String> s = new StackFromOneQueue<>();\n        for (String x : new String[] {\"a\", \"b\", \"c\"}) {\n            s.push(x);\n            System.out.println(\"push \" + x + \": \" + s);\n        }\n        System.out.println(\"pop -> \" + s.pop() + \": \" + s);\n    }\n}",
  stackFromOneQueueDemoOut: "push a: top [a]\npush b: top [b, a]\npush c: top [c, b, a]\npop -> c: top [b, a]",
  queueFromStacks: "import java.util.ArrayDeque;\nimport java.util.Deque;\n\npublic class QueueFromStacks<T> {\n    private final Deque<T> s1 = new ArrayDeque<>();   // front of the queue on top\n    private final Deque<T> s2 = new ArrayDeque<>();   // auxiliary\n    private long moves = 0;                           // pushes between the stacks\n\n    public void enqueue(T data) {\n        while (!s1.isEmpty()) {\n            s2.push(s1.pop());\n            moves++;\n        }\n        s1.push(data);                // the new element goes to the bottom\n        while (!s2.isEmpty()) {\n            s1.push(s2.pop());\n            moves++;\n        }\n    }\n\n    public T dequeue() {\n        if (s1.isEmpty()) {\n            throw new IllegalStateException(\"Underflow\");\n        }\n        return s1.pop();\n    }\n\n    public long moves() {\n        return moves;\n    }\n}",
  lazyQueueFromStacks: "import java.util.ArrayDeque;\nimport java.util.Deque;\n\npublic class LazyQueueFromStacks<T> {\n    private final Deque<T> in = new ArrayDeque<>();    // newest on top\n    private final Deque<T> out = new ArrayDeque<>();   // oldest on top\n    private long moves = 0;\n\n    public void enqueue(T data) {\n        in.push(data);\n    }\n\n    public T dequeue() {\n        if (out.isEmpty()) {\n            while (!in.isEmpty()) {\n                out.push(in.pop());   // reverses the order: oldest comes to the top\n                moves++;\n            }\n        }\n        if (out.isEmpty()) {\n            throw new IllegalStateException(\"Underflow\");\n        }\n        return out.pop();\n    }\n\n    public long moves() {\n        return moves;\n    }\n}",
  queueFromStacksDemo: "public class QueueFromStacksDemo {\n    public static void main(String[] args) {\n        QueueFromStacks<Integer> eager = new QueueFromStacks<>();\n        LazyQueueFromStacks<Integer> lazy = new LazyQueueFromStacks<>();\n        for (int key = 1; key <= 5; key++) {\n            eager.enqueue(key);\n            lazy.enqueue(key);\n        }\n        System.out.println(eager.dequeue() + \" \" + eager.dequeue());\n        System.out.println(lazy.dequeue() + \" \" + lazy.dequeue());\n\n        int n = 1000;\n        QueueFromStacks<Integer> a = new QueueFromStacks<>();\n        LazyQueueFromStacks<Integer> b = new LazyQueueFromStacks<>();\n        for (int i = 0; i < n; i++) {\n            a.enqueue(i);\n            b.enqueue(i);\n        }\n        for (int i = 0; i < n; i++) {\n            if (a.dequeue() != i || b.dequeue() != i) {\n                System.out.println(\"not FIFO!\");\n            }\n        }\n        System.out.println(n + \" enqueues + dequeues: slide version \" + a.moves()\n                + \" moves, lazy version \" + b.moves() + \" moves\");\n    }\n}",
  queueFromStacksDemoOut: "1 2\n1 2\n1000 enqueues + dequeues: slide version 999000 moves, lazy version 1000 moves",
  exercise1: "public class Exercise1 {\n    public static void main(String[] args) {\n        CircularQueue q = new CircularQueue(5);\n        for (int x = 1; x <= 4; x++) {\n            q.enqueue(x);\n        }\n        for (int k = 0; k < 3; k++) {\n            q.dequeue();\n        }\n        for (int x = 5; x <= 7; x++) {\n            q.enqueue(x);\n        }\n        System.out.println(q.cells() + \" front=\" + q.front() + \" size=\" + q.size()\n                + \" rear=\" + q.rear());\n    }\n}",
  exercise1Out: "[6 7 _ 4 5] front=3 size=4 rear=1",
  frSize: "public int size() {\n    if (isEmpty()) {\n        return 0;\n    }\n    return (rear - front + queue.length) % queue.length + 1;\n}",
  growingQueue: "public class GrowingQueue<T> {\n    private T[] array;\n    private int front = 0;\n    private int size = 0;\n\n    @SuppressWarnings(\"unchecked\")\n    public GrowingQueue() {\n        array = (T[]) new Object[2];\n    }\n\n    public void enqueue(T x) {\n        if (size == array.length) {\n            grow();\n        }\n        array[(front + size) % array.length] = x;\n        size++;\n    }\n\n    public T dequeue() {\n        if (size == 0) {\n            throw new IllegalStateException(\"Queue empty\");\n        }\n        T x = array[front];\n        array[front] = null;            // let the garbage collector reclaim it\n        front = (front + 1) % array.length;\n        size--;\n        return x;\n    }\n\n    public int capacity() {\n        return array.length;\n    }\n\n    @SuppressWarnings(\"unchecked\")\n    private void grow() {\n        T[] bigger = (T[]) new Object[2 * array.length];\n        for (int k = 0; k < size; k++) {\n            bigger[k] = array[(front + k) % array.length];   // in queue order\n        }\n        array = bigger;\n        front = 0;\n    }\n}",
  growingQueueDemo: "public class GrowingQueueDemo {\n    public static void main(String[] args) {\n        GrowingQueue<Integer> q = new GrowingQueue<>();\n        q.enqueue(1);\n        q.enqueue(2);\n        System.out.println(q.dequeue());      // now the next enqueue wraps\n        for (int x = 3; x <= 9; x++) {\n            q.enqueue(x);\n        }\n        System.out.print(\"capacity \" + q.capacity() + \":\");\n        for (int k = 0; k < 8; k++) {\n            System.out.print(\" \" + q.dequeue());\n        }\n        System.out.println();\n    }\n}",
  growingQueueDemoOut: "1\ncapacity 8: 2 3 4 5 6 7 8 9",
  reverseQueue: "import java.util.ArrayDeque;\nimport java.util.Deque;\nimport java.util.Queue;\n\npublic class ReverseQueue {\n    static void reverse(Queue<Integer> q) {\n        Deque<Integer> stack = new ArrayDeque<>();\n        while (!q.isEmpty()) {\n            stack.push(q.poll());\n        }\n        while (!stack.isEmpty()) {\n            q.offer(stack.pop());\n        }\n    }\n\n    public static void main(String[] args) {\n        Queue<Integer> q = new ArrayDeque<>();\n        for (int x = 1; x <= 5; x++) {\n            q.offer(x);\n        }\n        reverse(q);\n        System.out.println(q);\n    }\n}",
  reverseQueueOut: "[5, 4, 3, 2, 1]",
  hotPotato: "import java.util.ArrayDeque;\nimport java.util.Queue;\n\npublic class HotPotato {\n    public static void main(String[] args) {\n        int n = 7;\n        int k = 3;\n        Queue<Integer> circle = new ArrayDeque<>();\n        for (int child = 1; child <= n; child++) {\n            circle.offer(child);\n        }\n        StringBuilder order = new StringBuilder();\n        while (!circle.isEmpty()) {\n            for (int pass = 1; pass < k; pass++) {\n                circle.offer(circle.poll());   // move to the back of the circle\n            }\n            order.append(circle.poll()).append(' ');\n        }\n        System.out.println(order.toString().trim());\n    }\n}",
  hotPotatoOut: "3 6 2 7 5 1 4",
  dequePalindrome: "import java.util.ArrayDeque;\nimport java.util.Deque;\n\npublic class DequePalindrome {\n    static boolean isPalindrome(String s) {\n        Deque<Character> d = new ArrayDeque<>();\n        for (char c : s.toCharArray()) {\n            d.offerLast(c);\n        }\n        while (d.size() > 1) {\n            if (d.pollFirst() != d.pollLast()) {\n                return false;\n            }\n        }\n        return true;\n    }\n\n    public static void main(String[] args) {\n        for (String s : new String[] {\"level\", \"noon\", \"queue\", \"a\", \"\"}) {\n            System.out.println(\"\\\"\" + s + \"\\\" -> \" + isPalindrome(s));\n        }\n    }\n}",
  dequePalindromeOut: "\"level\" -> true\n\"noon\" -> true\n\"queue\" -> false\n\"a\" -> true\n\"\" -> true",
  slidingMax: "import java.util.ArrayDeque;\nimport java.util.Deque;\n\npublic class SlidingMax {\n    public static void main(String[] args) {\n        int[] a = {1, 3, -1, -3, 5, 3, 6, 7};\n        int w = 3;\n        Deque<Integer> d = new ArrayDeque<>();   // indices; their values decrease front to rear\n        StringBuilder out = new StringBuilder();\n        for (int i = 0; i < a.length; i++) {\n            if (!d.isEmpty() && d.peekFirst() <= i - w) {\n                d.pollFirst();                   // that index left the window\n            }\n            while (!d.isEmpty() && a[d.peekLast()] <= a[i]) {\n                d.pollLast();                    // can never be a maximum again\n            }\n            d.offerLast(i);\n            if (i >= w - 1) {\n                out.append(a[d.peekFirst()]).append(' ');\n            }\n        }\n        System.out.println(out.toString().trim());\n    }\n}",
  slidingMaxOut: "3 3 5 5 6 7",
  linkedOps: "public void enqueue(T e) {\n    Node<T> node = new Node<>(e);\n    if (isEmpty()) {\n        head = node;        // the only node is both front and rear\n    } else {\n        tail.next = node;   // link it behind the current rear\n    }\n    tail = node;\n    size++;\n}\n\npublic T dequeue() {\n    if (isEmpty()) {\n        throw new IllegalStateException(\"Queue empty\");\n    }\n    T e = head.element;\n    head = head.next;       // unlink the front node\n    if (head == null) {\n        tail = null;        // the queue became empty\n    }\n    size--;\n    return e;\n}",
  linearOps: "public boolean enqueue(int x) {\n    if (rear == array.length - 1) {\n        return false;\n    }\n    size++;\n    rear++;\n    array[rear] = x;\n    return true;\n}\n\npublic int dequeue() {\n    if (isEmpty()) {\n        throw new IllegalStateException(\"Queue empty\");\n    }\n    int x = array[front];\n    size--;\n    front++;\n    return x;\n}",
  circularOps: "public void enqueue(int x) {\n    if (isFull()) {\n        throw new IllegalStateException(\"Queue full\");\n    }\n    int rear = (front + size) % array.length;   // first free cell after the rear\n    array[rear] = x;\n    size++;\n}\n\npublic int dequeue() {\n    if (isEmpty()) {\n        throw new IllegalStateException(\"Queue empty\");\n    }\n    int x = array[front];\n    front = (front + 1) % array.length;\n    size--;\n    return x;\n}",
  frOps: "public boolean isEmpty() {\n    return front == -1;\n}\n\npublic boolean isFull() {\n    return (rear + 1) % queue.length == front;\n}\n\npublic boolean enqueue(int val) {\n    if (isFull()) {\n        return false;\n    }\n    if (isEmpty()) {\n        front = 0;\n        rear = 0;\n    } else {\n        rear = (rear + 1) % queue.length;\n    }\n    queue[rear] = val;\n    return true;\n}\n\npublic int dequeue() {\n    if (isEmpty()) {\n        throw new IllegalStateException(\"Underflow\");\n    }\n    int val = queue[front];\n    if (front == rear) {          // that was the only element\n        front = -1;\n        rear = -1;\n    } else {\n        front = (front + 1) % queue.length;\n    }\n    return val;\n}",
  sortedOps: "public int add(int x) {\n    if (head == null || x < head.value) {\n        head = new Node(x, head);\n        return 0;\n    }\n    Node p = head;\n    int steps = 1;\n    while (p.next != null && p.next.value <= x) {\n        p = p.next;\n        steps++;\n    }\n    p.next = new Node(x, p.next);\n    return steps;\n}\n\npublic int poll() {\n    if (head == null) {\n        throw new IllegalStateException(\"Priority queue empty\");\n    }\n    int x = head.value;\n    head = head.next;\n    return x;\n}",
  dequeOps: "private int forward(int i) {\n    return (i + 1) % cells.length;\n}\n\nprivate int backward(int i) {\n    return (i - 1 + cells.length) % cells.length;\n}\n\npublic void enqueueFront(int x) {\n    if (isFull()) {\n        throw new IllegalStateException(\"Deque full\");\n    }\n    front = backward(front);\n    cells[front] = x;\n    size++;\n}\n\npublic void enqueueRear(int x) {\n    if (isFull()) {\n        throw new IllegalStateException(\"Deque full\");\n    }\n    rear = forward(rear);\n    cells[rear] = x;\n    size++;\n}\n\npublic int dequeueFront() {\n    if (isEmpty()) {\n        throw new IllegalStateException(\"Deque empty\");\n    }\n    int x = cells[front];\n    front = forward(front);\n    size--;\n    return x;\n}\n\npublic int dequeueRear() {\n    if (isEmpty()) {\n        throw new IllegalStateException(\"Deque empty\");\n    }\n    int x = cells[rear];\n    rear = backward(rear);\n    size--;\n    return x;\n}",
};

// ---------- widget styles (this lecture only) ----------

function injectL10Style() {
  if (document.getElementById("l10-style")) return;
  const s = document.createElement("style");
  s.id = "l10-style";
  s.textContent = `
  .qv-grid { display: grid; grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr); gap: 14px; margin-top: 12px; }
  .qv-grid.nocode { grid-template-columns: minmax(0, 1fr); }
  .qv-grid pre.code { margin: 0; font-size: 12.5px; max-height: 420px; overflow: auto; }
  .qv-side .msg { margin-top: 0; }
  .qv-side .console { max-height: 140px; }
  .qv-extra { margin-top: 6px; }
  .qv-extra input[type="text"] { width: 260px; font: 13px var(--mono); }
  .qv-extra label { max-width: 100%; }
  .qv-extra select { max-width: 100%; }
  .qv-legend { font-size: 12px; color: var(--stone); margin: 4px 0 0; }
  .qv-two { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 12px; }
  .qv-panel { background: var(--paper-2); border-radius: 10px; padding: 10px; min-width: 0; }
  .qv-panel h4 { margin: 0 0 4px; font: 600 13px var(--mono); color: var(--teal); }
  .qv-panel .ret { font: 12.5px var(--mono); color: var(--ink-2); margin-top: 6px; overflow-wrap: anywhere; }
  .qv-panel .ret b { color: var(--green); }
  .cell.empty { background: var(--paper-2); border-style: dashed; color: var(--stone); }
  .cell.hi { background: var(--mark); border-color: var(--amber); }
  .cell.new { background: var(--green-soft); border-color: var(--green); }
  .cell.gone { background: var(--red-soft); border-color: var(--red); color: var(--red); }
  .ptr.r { color: var(--amber); }
  .qv-cells-wrap { overflow-x: auto; }
  .qv-ringrow { display: grid; grid-template-columns: minmax(0, 260px) minmax(0, 1fr); gap: 12px; align-items: center; }
  .lq { display: flex; align-items: flex-start; gap: 0; flex-wrap: wrap; padding: 6px 2px; row-gap: 10px; }
  .lq-col { display: flex; flex-direction: column; align-items: center; }
  .lq-node { display: flex; border: 1.5px solid var(--ink-2); border-radius: 7px; background: var(--card); font: 600 15px var(--mono); }
  .lq-node .v { padding: 8px 10px; min-width: 26px; text-align: center; }
  .lq-node .nx { padding: 8px 6px; border-left: 1px solid var(--line); color: var(--stone); font-size: 12px; min-width: 16px; text-align: center; }
  .lq-node.new { border-color: var(--green); background: var(--green-soft); border-style: dashed; }
  .lq-node.new.linked { border-style: solid; }
  .lq-node.hi { border-color: var(--amber); background: var(--mark); }
  .lq-node.gone { opacity: 0.45; border-style: dashed; }
  .lq-arrow { align-self: flex-start; padding: 9px 4px 0; color: var(--ink-2); font: 600 15px var(--mono); }
  .lq-gap { width: 26px; }
  .lq-lab { font: 600 11px var(--mono); color: var(--teal); min-height: 15px; }
  .lq-lab.r { color: var(--amber); }
  .stk-row { display: flex; gap: 14px; flex-wrap: wrap; justify-content: center; }
  .stk { display: flex; flex-direction: column; align-items: center; min-width: 90px; }
  .stk-body { display: flex; flex-direction: column-reverse; gap: 4px; border: 2px solid var(--ink-2); border-top: none; border-radius: 0 0 8px 8px; padding: 6px; min-height: 150px; min-width: 70px; justify-content: flex-start; }
  .stk-body .cell { width: 56px; height: 30px; font-size: 14px; }
  .stk h4 { margin: 0 0 4px; font: 600 13px var(--mono); color: var(--teal); }
  .stk small { font: 11px var(--mono); color: var(--stone); margin-top: 4px; }
  .qrow { display: grid; grid-template-columns: 54px minmax(0, 1fr); align-items: center; gap: 8px; margin: 4px 0; }
  .qrow > b { font: 600 13px var(--mono); color: var(--teal); }
  .qrow .cells { justify-content: flex-start; margin: 0; }
  .qrow .cell { width: 40px; height: 34px; font-size: 14px; }
  @media (max-width: 900px) {
    .qv-grid, .qv-two, .qv-ringrow { grid-template-columns: minmax(0, 1fr); }
    .qv-ringrow svg { max-width: 260px; margin: 0 auto; }
  }
  @media (max-width: 600px) {
    .qv-extra input[type="text"] { width: 100%; }
    .qrow .cell { width: 32px; height: 30px; font-size: 13px; }
    .lq-node .v { padding: 6px 7px; min-width: 20px; }
  }`;
  document.head.appendChild(s);
}

// ---------- helpers ----------

// 1-based number of the first line of `code` (from line `from` on) that contains `needle`.
function lineOf(code, needle, from = 1) {
  const lines = code.split("\n");
  for (let k = from - 1; k < lines.length; k++) if (lines[k].includes(needle)) return k + 1;
  throw new Error("lineOf: not found: " + needle);
}

// "enq 14, enq 22, deq" -> [{op: "enq", arg: "14"}, {op: "deq", arg: null}]. Unknown ops are dropped.
function parseOps(text, known, max = 30) {
  return String(text).split(/[,;\n]+/).map((t) => t.trim()).filter(Boolean)
    .map((t) => { const m = t.match(/^([A-Za-z]+)\s*(\S+)?$/); return m ? { op: m[1].toLowerCase(), arg: m[2] ?? null } : null; })
    .filter((o) => o && known.includes(o.op)).slice(0, max);
}

// A row of array cells. vals[k] === null draws a free cell.
function cellsHTML(vals, { front = -1, rear = -1, idx = true, cls = {}, fLabel = "front", rLabel = "rear" } = {}) {
  return `<div class="qv-cells-wrap"><div class="cells">` + vals.map((v, k) => `<div class="cellcol">
      <div class="cell${v === null ? " empty" : ""} ${cls[k] || ""}">${v === null ? "" : esc(v)}</div>
      ${idx ? `<div class="cellidx">${k}</div>` : ""}
      <div class="ptr">${k === front ? fLabel : ""}</div><div class="ptr r">${k === rear ? rLabel : ""}</div></div>`).join("") +
    `</div></div>`;
}

// The cells drawn as a ring (index 0 at the top, clockwise).
function ringSVG(vals, { front = -1, rear = -1, hi = -1, hiCls = "hi", center = "" } = {}) {
  const n = vals.length, W = 300, c = W / 2, r1 = 54, r2 = 94;
  const pt = (r, deg) => { const a = (deg * Math.PI) / 180; return [c + r * Math.cos(a), c + r * Math.sin(a)]; };
  let g = `<svg viewBox="0 0 ${W} ${W}" role="img" aria-label="circular array">`;
  for (let k = 0; k < n; k++) {
    const mid = -90 + (k * 360) / n, a0 = mid - 180 / n, a1 = mid + 180 / n;
    const [x0, y0] = pt(r2, a0), [x1, y1] = pt(r2, a1), [x2, y2] = pt(r1, a1), [x3, y3] = pt(r1, a0);
    const isHi = k === hi;
    const fill = isHi ? (hiCls === "new" ? "var(--green-soft)" : hiCls === "gone" ? "var(--red-soft)" : "var(--mark)")
      : vals[k] === null ? "var(--card)" : "var(--teal-soft)";
    const stroke = isHi ? (hiCls === "new" ? "var(--green)" : hiCls === "gone" ? "var(--red)" : "var(--amber)") : "var(--ink-2)";
    g += `<path d="M${x0},${y0} A${r2},${r2} 0 0 1 ${x1},${y1} L${x2},${y2} A${r1},${r1} 0 0 0 ${x3},${y3} Z" fill="${fill}" stroke="${stroke}" stroke-width="${isHi ? 2.2 : 1.2}"/>`;
    const [tx, ty] = pt((r1 + r2) / 2, mid);
    if (vals[k] !== null) g += `<text x="${tx}" y="${ty + 5}" text-anchor="middle" font-size="15" font-weight="600" fill="var(--ink)">${esc(vals[k])}</text>`;
    const [ix, iy] = pt(r2 + 12, mid);
    g += `<text x="${ix}" y="${iy + 4}" text-anchor="middle" font-size="11" fill="var(--stone)">${k}</text>`;
    const labs = [];
    if (k === front) labs.push(["front", "var(--teal)"]);
    if (k === rear) labs.push(["rear", "var(--amber)"]);
    // Labels sit outside the index number; on the left and right they are anchored outward so
    // they never cover it.
    const cos = Math.cos((mid * Math.PI) / 180);
    const anchor = cos > 0.35 ? "start" : cos < -0.35 ? "end" : "middle";
    const [lx, ly] = pt(anchor === "middle" ? r2 + 34 : r2 + 22, mid);
    labs.forEach(([t, col], j) => {
      const dy = 4 + j * 13 - (labs.length - 1) * 6;   // two labels on one cell sit one above the other
      g += `<text x="${lx}" y="${ly + dy}" text-anchor="${anchor}" font-size="12" font-weight="700" fill="${col}">${t}</text>`;
    });
  }
  if (center) g += `<text x="${c}" y="${c + 4}" text-anchor="middle" font-size="12" fill="var(--ink-2)">${esc(center)}</text>`;
  return g + "</svg>";
}

// A singly linked list. items: [{v, cls, next: "arrow" | "null" | "gap"}]; labels: {index: [[text, "r"?]]}.
function nodesHTML(items, labels = {}) {
  if (!items.length) return `<div class="lq"><span class="counter">(no nodes: head = null, tail = null)</span></div>`;
  let h = `<div class="lq">`;
  items.forEach((it, k) => {
    const labs = labels[k] || [];
    h += `<div class="lq-col"><div class="lq-node ${it.cls || ""}"><span class="v">${esc(it.v)}</span><span class="nx">${it.next === "arrow" ? "•" : "/"}</span></div>
      ${labs.map(([t, r]) => `<div class="lq-lab${r ? " r" : ""}">${t}</div>`).join("") || `<div class="lq-lab"></div>`}</div>`;
    if (k < items.length - 1) h += it.next === "arrow" ? `<span class="lq-arrow">→</span>` : `<span class="lq-gap"></span>`;
  });
  return h + `</div>`;
}

const fmtList = (xs) => (xs.length ? xs.map((x) => `<b>${esc(x)}</b>`).join(" ") : "—");

// Step-through player for this lecture: a picture on top, then the code (current line
// highlighted), a message, stats and output. build() returns snapshots
// {line, msg, cls, stats: [[label, value, cls]], out: [...], ...view data}.
function makePlayer(el, opts) {
  injectL10Style();
  const mini = !!opts.mini;
  el.innerHTML = `<div class="qv-view"></div>` + (mini ? "" : `
    <div class="qv-grid${opts.code ? "" : " nocode"}">
      ${opts.code ? `<div class="qv-code"></div>` : ""}
      <div class="qv-side"><div class="msg qv-msg"></div><div class="stats qv-stats"></div>${opts.output ? `<div class="console qv-out"></div>` : ""}</div>
    </div>
    <div class="controls">
      <button class="cbtn qv-reset" title="Back to the start">⟲ Reset</button>
      <button class="cbtn qv-back" title="Step back (←)">◀ Back</button>
      <button class="cbtn qv-step on" title="Step (→)">Step ▶</button>
      <button class="cbtn qv-play">Play</button>
      <button class="cbtn qv-end">End</button>
      <span class="spacer"></span><span class="counter qv-count"></span>
    </div>
    ${opts.extraControls ? `<div class="controls qv-extra">${opts.extraControls}</div>` : ""}
    ${opts.legend ? `<p class="qv-legend">${opts.legend}</p>` : ""}`);
  const $ = (q) => el.querySelector(q);
  let snaps = [], i = 0, timer = null, codeLines = [];

  function renderCode() {
    if (mini || !opts.code) return;
    const c = typeof opts.code === "function" ? opts.code() : opts.code;
    $(".qv-code").innerHTML = codeBlock(c);
    codeLines = [...el.querySelectorAll(".qv-code .ln")];
  }
  function render() {
    const s = snaps[i];
    $(".qv-view").innerHTML = opts.view(s, mini);
    if (mini) return;
    codeLines.forEach((ln, k) => ln.classList.toggle("hl", k + 1 === s.line));
    const m = $(".qv-msg");
    m.innerHTML = s.msg || "";
    m.className = "msg qv-msg " + (s.cls || "");
    $(".qv-stats").innerHTML = (s.stats || []).map(([k, v, c]) =>
      `<div class="stat ${c || ""}"><small>${k}</small><b>${v}</b></div>`).join("");
    if (opts.output) { const o = $(".qv-out"); o.textContent = (s.out || []).join("\n"); o.scrollTop = o.scrollHeight; }
    $(".qv-count").textContent = `step ${i + 1} / ${snaps.length}`;
    $(".qv-back").disabled = $(".qv-reset").disabled = i === 0;
    $(".qv-step").disabled = $(".qv-end").disabled = i === snaps.length - 1;
  }
  function stop() { clearInterval(timer); timer = null; if (!mini) $(".qv-play").textContent = "Play"; }
  function play() {
    if (timer) return stop();
    if (i === snaps.length - 1) i = 0;
    if (!mini) $(".qv-play").textContent = "Pause";
    timer = setInterval(() => {
      if (i < snaps.length - 1) { i++; render(); }
      else if (mini) { i = 0; render(); }
      else stop();
    }, mini ? (opts.miniSpeed || 1000) : 800);
  }
  function rebuild() {
    stop();
    renderCode();
    snaps = opts.build();
    i = 0;
    render();
  }
  if (!mini) {
    $(".qv-reset").onclick = () => { stop(); i = 0; render(); };
    $(".qv-back").onclick = () => { stop(); if (i > 0) i--; render(); };
    $(".qv-step").onclick = () => { stop(); if (i < snaps.length - 1) i++; render(); };
    $(".qv-end").onclick = () => { stop(); i = snaps.length - 1; render(); };
    $(".qv-play").onclick = play;
    el.tabIndex = 0;
    el.addEventListener("keydown", (e) => {
      if (["INPUT", "SELECT", "TEXTAREA"].includes(e.target.tagName)) return;
      if (e.key === "ArrowRight") { e.preventDefault(); $(".qv-step").click(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); $(".qv-back").click(); }
    });
  }
  if (opts.onMount && !mini) opts.onMount(el, rebuild);
  rebuild();
  if (mini) play();
  return { rebuild };
}

// Wire a text input of operations (and optional preset select) to rebuild.
function opsInput(root, rebuild, cls, set) {
  const inp = root.querySelector("." + cls);
  inp.onchange = () => { set(inp.value); rebuild(); };
  const pre = root.querySelector("." + cls + "-pre");
  if (pre) pre.onchange = () => { if (!pre.value) return; inp.value = pre.value; set(pre.value); pre.value = ""; rebuild(); };
}

// ---------- Chapter 1: FIFO vs LIFO ----------

function demoFifoLifo(el, { mini = false } = {}) {
  let script = mini ? "in A, in B, in C, out, in D, out, in E, out, out, out" : "in 1, in 2, in 3, out, in 4, out, out";
  function build() {
    const ops = parseOps(script, ["in", "out"]);
    const q = [], s = [], qOut = [], sOut = [];
    const snaps = [];
    const snap = (msg, cls = "", hq = {}, hs = {}) => snaps.push({ q: q.slice(), s: s.slice(), qOut: qOut.slice(), sOut: sOut.slice(), msg, cls, hq, hs,
      stats: [["queue holds", q.length], ["stack holds", s.length]] });
    snap("Both start empty. The same operations go to both: <b>in x</b> inserts, <b>out</b> removes.");
    for (const o of ops) {
      if (o.op === "in") {
        const x = o.arg ?? "?";
        q.push(x); s.push(x);
        snap(`in ${esc(x)}: the queue puts it at the <b>rear</b> (right); the stack puts it on <b>top</b>.`, "", { [q.length - 1]: "new" }, { [s.length - 1]: "new" });
      } else {
        if (!q.length) { snap("out on an empty queue / stack: <b>underflow</b>.", "bad"); continue; }
        const a = q.shift(), b = s.pop();
        qOut.push(a); sOut.push(b);
        snap(`out: the queue gives back <b>${esc(a)}</b>, its oldest element; the stack gives back <b>${esc(b)}</b>, its newest.`, a === b ? "" : "good");
      }
    }
    snaps[snaps.length - 1].msg += ` Queue order: ${qOut.join(", ") || "—"}. Stack order: ${sOut.join(", ") || "—"}.`;
    return snaps;
  }
  function view(sn) {
    const qPanel = `<div class="qv-panel"><h4>Queue · FIFO</h4>
      ${cellsHTML(sn.q.length ? sn.q : [null], { front: sn.q.length ? 0 : -1, rear: sn.q.length ? sn.q.length - 1 : -1, idx: false, cls: sn.hq })}
      <div class="ret">dequeued: ${fmtList(sn.qOut)}</div></div>`;
    if (mini) return qPanel;
    const stk = `<div class="stk"><div class="stk-body">${sn.s.map((v, k) => `<div class="cell ${sn.hs[k] || ""}">${esc(v)}</div>`).join("")}</div><small>bottom</small></div>`;
    return `<div class="qv-two">${qPanel}<div class="qv-panel"><h4>Stack · LIFO (top is up)</h4><div class="stk-row">${stk}</div>
      <div class="ret">popped: ${fmtList(sn.sOut)}</div></div></div>`;
  }
  makePlayer(el, {
    mini, build, view, miniSpeed: 1100,
    extraControls: `<label>operations <input type="text" class="fl-ops" value="${script}"></label>`,
    legend: "Write <code>in x</code> or <code>out</code>, separated by commas, then press Enter.",
    onMount(root, rebuild) { opsInput(root, rebuild, "fl-ops", (v) => { script = v; }); },
  });
}

// ---------- Chapter 2: linked-list queue ----------

function demoLinkedQueue(el, { mini = false } = {}) {
  let script = "enq A, enq B, enq C, deq, deq, deq, enq D";
  if (mini) script = "enq A, enq B, enq C, deq, enq D, deq, deq, deq";
  const C = CODE.linkedOps;
  const L = {
    newNode: lineOf(C, "Node<T> node = new Node<>(e);"), headNode: lineOf(C, "head = node;"),
    link: lineOf(C, "tail.next = node;"), tailNode: lineOf(C, "tail = node;"),
    under: lineOf(C, "throw new IllegalStateException"), take: lineOf(C, "T e = head.element;"),
    unlink: lineOf(C, "head = head.next;"), tailNull: lineOf(C, "tail = null;"), ret: lineOf(C, "return e;"),
  };
  function build() {
    const ops = parseOps(script, ["enq", "deq"]);
    let q = [];
    const out = [];
    const snaps = [];
    const chain = (vals, cls = {}) => vals.map((v, k) => ({ v, cls: cls[k] || "", next: k < vals.length - 1 ? "arrow" : "null" }));
    const labelsFor = (n, offset = 0) => {
      const lab = {};
      if (n) { (lab[offset] ||= []).push(["head"]); (lab[offset + n - 1] ||= []).push(["tail", "r"]); }
      return lab;
    };
    const snap = (line, msg, items, labels, cls = "") => snaps.push({ line, msg, cls, items, labels, out: out.slice(),
      stats: [["size", q.length], ["front (head)", q.length ? q[0] : "—"], ["rear (tail)", q.length ? q[q.length - 1] : "—"]] });
    snap(0, "An empty queue: <code>head</code> and <code>tail</code> are both <code>null</code>.", [], {});
    for (const o of ops) {
      if (o.op === "enq") {
        const e = o.arg ?? "?";
        const items = chain(q);
        if (items.length) items[items.length - 1].next = "gap";
        items.push({ v: e, cls: "new", next: "null" });
        snap(L.newNode, `enqueue(${esc(e)}): make a new node. It is not linked to anything yet.`, items, labelsFor(q.length));
        if (!q.length) {
          const lab = { 0: [["head"]] };
          snap(L.headNode, "The queue was empty, so the new node is the front: <code>head = node</code>.", [{ v: e, cls: "new linked", next: "null" }], lab);
        } else {
          const it2 = chain(q.concat([e]), { [q.length]: "new linked" });
          snap(L.link, `Link it behind the current rear: <code>tail.next = node</code>. No walking: <code>tail</code> already points at ${esc(q[q.length - 1])}.`, it2, labelsFor(q.length));
        }
        q.push(e);
        snap(L.tailNode, `<code>tail = node</code>; <code>size</code> becomes ${q.length}. O(1): a fixed number of steps, however long the queue.`, chain(q, { [q.length - 1]: "new linked" }), labelsFor(q.length));
      } else {
        if (!q.length) { snap(L.under, "dequeue() on an empty queue: <b>underflow</b>, an exception is thrown.", [], {}, "bad"); continue; }
        const e = q[0];
        snap(L.take, `dequeue(): remember the front element, <b>${esc(e)}</b>.`, chain(q, { 0: "hi" }), labelsFor(q.length));
        const rest = q.slice(1);
        const items = [{ v: e, cls: "gone", next: rest.length ? "arrow" : "null" }].concat(chain(rest));
        const lab = {};
        if (rest.length) { lab[1] = [["head"]]; (lab[rest.length] ||= []).push(["tail", "r"]); }
        else lab[0] = [["tail", "r"]];
        snap(L.unlink, rest.length ? `<code>head = head.next</code>: the front node is unlinked. Nothing points to it any more, so Java's garbage collector will reclaim it.`
          : `<code>head = head.next</code> is <code>null</code> now — but <code>tail</code> still points at the removed node!`, items, lab, rest.length ? "" : "bad");
        q = rest;
        if (!q.length) snap(L.tailNull, "So the queue sets <code>tail = null</code> as well. Forgetting this line is a classic bug.", [], {}, "good");
        out.push(e);
        snap(L.ret, `Return <b>${esc(e)}</b>. ${q.length ? `The new front is ${esc(q[0])}.` : "The queue is empty again."}`, chain(q), labelsFor(q.length));
      }
    }
    return snaps;
  }
  makePlayer(el, {
    mini, build, code: C, output: true, miniSpeed: 900,
    view: (s) => nodesHTML(s.items, s.labels),
    extraControls: `<label>operations <input type="text" class="lq-ops" value="${script}"></label>`,
    legend: "Write <code>enq x</code> or <code>deq</code>, separated by commas, then press Enter. The output box shows what <code>dequeue</code> returned.",
    onMount(root, rebuild) { opsInput(root, rebuild, "lq-ops", (v) => { script = v; }); },
  });
}

// ---------- Chapter 2: linear array queue ----------

function demoLinearArray(el) {
  let script = "enq 10, enq 20, enq 30, enq 40, deq, deq, enq 50";
  let cap = 4, shift = false;
  const C = CODE.linearOps;
  const L = { full: lineOf(C, "return false;"), store: lineOf(C, "array[rear] = x;"), take: lineOf(C, "int x = array[front];"),
    inc: lineOf(C, "front++;"), under: lineOf(C, "throw new IllegalStateException") };
  function build() {
    const ops = parseOps(script, ["enq", "deq"]);
    const arr = Array(cap).fill(null);
    let front = 0, rear = -1, size = 0, moves = 0;
    const out = [];
    const snaps = [];
    const snap = (line, msg, cls = "", hc = {}) => snaps.push({ line, msg, cls, arr: arr.slice(), front, rear, hc, out: out.slice(),
      stats: [["front", front], ["rear", rear], ["size", `${size} / ${cap}`], ["element moves", moves, shift && moves ? "bad" : ""]] });
    snap(0, `An empty queue of capacity ${cap}: <code>front = 0</code>, <code>rear = -1</code>.${shift ? " Shifting is on: after each dequeue, the rest move one cell left." : ""}`);
    for (const o of ops) {
      if (o.op === "enq") {
        const x = o.arg ?? "?";
        if (rear === cap - 1) {
          const free = cap - size;
          snap(L.full, `enqueue(${esc(x)}): <code>rear</code> is already at the last cell, so it is refused — although ${free} of the ${cap} cells ${free === 1 ? "is" : "are"} free. The queue has <b>run out of room</b>.`, "bad");
          continue;
        }
        size++; rear++; arr[rear] = x;
        snap(L.store, `enqueue(${esc(x)}): <code>size++</code>, <code>rear++</code>, then <code>array[${rear}] = ${esc(x)}</code>.`, "", { [rear]: "new" });
      } else {
        if (!size) { snap(L.under, "dequeue() on an empty queue: underflow.", "bad"); continue; }
        const x = arr[front];
        snap(L.take, `dequeue(): take <code>array[${front}]</code> = <b>${esc(x)}</b>.`, "", { [front]: "hi" });
        arr[front] = null; size--; front++;
        out.push(x);
        if (!shift) {
          snap(L.inc, `<code>size--</code>, <code>front++</code>. <code>front</code> is now ${front}: cells to its left are free, but <code>rear</code> can never go back to use them.`, "", {});
        } else {
          for (let k = front; k <= rear; k++) { arr[k - 1] = arr[k]; moves++; }
          if (rear >= front) arr[rear] = null;
          const moved = rear - front + 1;
          rear--; front = 0;
          snap(0, `Shift: ${moved} element${moved === 1 ? "" : "s"} moved one cell left, so <code>front</code> is 0 again and <code>rear</code> = ${rear}. Room is never wasted, but each dequeue now costs Θ(n) moves.`, moved ? "" : "", {});
        }
      }
    }
    return snaps;
  }
  makePlayer(el, {
    build, code: C, output: true,
    view: (s) => cellsHTML(s.arr, { front: s.front, rear: s.rear, cls: s.hc }),
    extraControls: `<label>operations <input type="text" class="la-ops" value="${script}"></label>
      <label>capacity <select class="la-cap">${[3, 4, 5, 6, 7, 8].map((n) => `<option${n === cap ? " selected" : ""}>${n}</option>`).join("")}</select></label>
      <label><input type="checkbox" class="la-shift"> shift after each dequeue</label>`,
    legend: "The free cells are dashed. Tick “shift” to see solution 1 (keep <code>front</code> at 0) and count the element moves; the code panel shows the plain version.",
    onMount(root, rebuild) {
      opsInput(root, rebuild, "la-ops", (v) => { script = v; });
      root.querySelector(".la-cap").onchange = (e) => { cap = +e.target.value; rebuild(); };
      root.querySelector(".la-shift").onchange = (e) => { shift = e.target.checked; rebuild(); };
    },
  });
}

// ---------- Chapter 3: circular queue (front + size) ----------

function demoCircular(el, { mini = false } = {}) {
  let script = "enq 14, enq 22, enq 13, deq, enq 15, enq 4, enq 9";
  let cap = 4;
  if (mini) { cap = 6; script = "enq 1, enq 2, enq 3, enq 4, deq, deq, enq 5, enq 6, deq, enq 7, enq 8, deq, deq, enq 9, deq, deq, deq, deq, deq"; }
  const C = CODE.circularOps;
  const L = { full: lineOf(C, "Queue full"), slot: lineOf(C, "int rear = (front + size) % array.length;"), inc: lineOf(C, "size++;"),
    under: lineOf(C, "Queue empty"), take: lineOf(C, "int x = array[front];"), adv: lineOf(C, "front = (front + 1) % array.length;") };
  function build() {
    const ops = parseOps(script, ["enq", "deq"]);
    const arr = Array(cap).fill(null);
    let front = 0, size = 0;
    const out = [];
    const snaps = [];
    const rearOf = () => (size ? (front + size - 1) % cap : -1);
    const snap = (line, msg, cls = "", hi = -1, hiCls = "hi") => snaps.push({ line, msg, cls, arr: arr.slice(), front: size ? front : -1, frontIdx: front, rear: rearOf(), hi, hiCls, size, out: out.slice(),
      stats: [["front", front], ["size", `${size} / ${cap}`], ["rear", size ? rearOf() : "—"], ["isFull()", size === cap ? "true" : "false", size === cap ? "bad" : ""]] });
    snap(0, `An empty circular queue of capacity ${cap}: <code>front = 0</code>, <code>size = 0</code>.`);
    for (const o of ops) {
      if (o.op === "enq") {
        const x = o.arg ?? "?";
        if (size === cap) { snap(L.full, `enqueue(${esc(x)}): <code>size == capacity</code>, the queue is full — overflow.`, "bad"); continue; }
        const r = (front + size) % cap;
        snap(L.slot, `enqueue(${esc(x)}): the first free cell is (front + size) % capacity = (${front} + ${size}) % ${cap} = <b>${r}</b>.${front + size >= cap ? " It <b>wrapped round</b> past the end of the array." : ""}`, "", r);
        arr[r] = x; size++;
        snap(L.inc, `Store ${esc(x)} in cell ${r} and increase <code>size</code> to ${size}. The rear is now cell ${r}.`, "", r, "new");
      } else {
        if (!size) { snap(L.under, "dequeue() on an empty queue: underflow.", "bad"); continue; }
        const x = arr[front];
        snap(L.take, `dequeue(): take <code>array[${front}]</code> = <b>${esc(x)}</b>.`, "", front);
        const old = front;
        arr[front] = null; front = (front + 1) % cap; size--;
        out.push(x);
        snap(L.adv, `front = (front + 1) % capacity = (${old} + 1) % ${cap} = <b>${front}</b>${old === cap - 1 ? " — wrapped back to cell 0" : ""}; <code>size</code> = ${size}.`, "", old, "gone");
      }
    }
    return mini ? snaps.filter((s) => s.line !== L.slot && s.line !== L.take) : snaps;
  }
  function view(s) {
    const ring = ringSVG(s.arr, { front: s.size ? s.frontIdx : -1, rear: s.rear, hi: s.hi, hiCls: s.hiCls, center: `size ${s.size}/${s.arr.length}` });
    if (mini) return `<div class="svgbox">${ring}</div>`;
    const cls = s.hi >= 0 ? { [s.hi]: s.hiCls } : {};
    return `<div class="qv-ringrow"><div class="svgbox">${ring}</div><div><div class="counter">the same cells, as the array really is</div>
      ${cellsHTML(s.arr, { front: s.size ? s.frontIdx : -1, rear: s.rear, cls })}</div></div>`;
  }
  makePlayer(el, {
    mini, build, view, code: C, output: true, miniSpeed: 850,
    extraControls: `<label>operations <input type="text" class="cq-ops" value="${script}"></label>
      <label>capacity <select class="cq-cap">${[3, 4, 5, 6, 7, 8].map((n) => `<option${n === cap ? " selected" : ""}>${n}</option>`).join("")}</select></label>
      <label>try <select class="cq-ops-pre"><option value="">a preset…</option>
        <option value="enq 14, enq 22, enq 13, deq, enq 15, enq 4, enq 9">the slides' trace (+ one overflow)</option>
        <option value="enq 14, enq 22, enq 13, deq, enq 15, enq 4, deq, deq, enq 9">the Predict box</option>
        <option value="enq 1, deq, enq 2, deq, enq 3, deq, enq 4, deq, enq 5, deq, enq 6, deq">one in, one out, forever</option></select></label>`,
    legend: "Write <code>enq x</code> or <code>deq</code>, separated by commas, then press Enter. Amber: the cell being computed; green: just written; red: just removed.",
    onMount(root, rebuild) {
      opsInput(root, rebuild, "cq-ops", (v) => { script = v; });
      root.querySelector(".cq-cap").onchange = (e) => { cap = +e.target.value; rebuild(); };
    },
  });
}

// ---------- Chapter 3: circular queue (front / rear = -1) ----------

function demoCircularFR(el) {
  let script = "enq 10, enq 20, enq 30, enq 40, enq 50, deq, deq, enq 60, enq 70, enq 80";
  let max = 5;
  const C = CODE.frOps;
  const enqAt = lineOf(C, "public boolean enqueue");
  const deqAt = lineOf(C, "public int dequeue");
  const L = { over: lineOf(C, "return false;", enqAt), first: lineOf(C, "front = 0;", enqAt), adv: lineOf(C, "rear = (rear + 1) % queue.length;"),
    store: lineOf(C, "queue[rear] = val;"), under: lineOf(C, "Underflow"), take: lineOf(C, "int val = queue[front];"),
    reset: lineOf(C, "front = -1;", deqAt), next: lineOf(C, "front = (front + 1) % queue.length;") };
  function build() {
    const ops = parseOps(script, ["enq", "deq"]);
    const arr = Array(max).fill(null);
    let front = -1, rear = -1;
    const out = [];
    const snaps = [];
    const snap = (line, msg, cls = "", hc = {}) => snaps.push({ line, msg, cls, arr: arr.slice(), front, rear, hc, out: out.slice(),
      stats: [["front", front], ["rear", rear], ["(rear + 1) % MAX", (rear + 1) % max, (rear + 1) % max === front ? "bad" : ""]] });
    snap(0, `Initially <code>front = rear = -1</code>: the queue is empty. MAX = ${max}.`);
    for (const o of ops) {
      if (o.op === "enq") {
        const x = o.arg ?? "?";
        if ((rear + 1) % max === front) { snap(L.over, `enqueue(${esc(x)}): (rear + 1) % MAX = (${rear} + 1) % ${max} = ${front} = front. The cell after the rear is the front: <b>overflow</b>, return false.`, "bad"); continue; }
        if (front === -1) {
          front = 0; rear = 0;
          snap(L.first, `enqueue(${esc(x)}): the queue is empty (front == -1), so set <code>front = rear = 0</code>.`, "", { 0: "hi" });
        } else {
          const old = rear;
          rear = (rear + 1) % max;
          snap(L.adv, `enqueue(${esc(x)}): rear = (rear + 1) % MAX = (${old} + 1) % ${max} = <b>${rear}</b>${old === max - 1 ? " — wrapped round to cell 0" : ""}.`, "", { [rear]: "hi" });
        }
        arr[rear] = x;
        snap(L.store, `<code>queue[${rear}] = ${esc(x)}</code>.`, "", { [rear]: "new" });
      } else {
        if (front === -1) { snap(L.under, "dequeue(): front == -1, the queue is empty: <b>underflow</b>.", "bad"); continue; }
        const x = arr[front];
        snap(L.take, `dequeue(): take <code>queue[${front}]</code> = <b>${esc(x)}</b>.`, "", { [front]: "hi" });
        arr[front] = null;
        out.push(x);
        if (front === rear) {
          front = -1; rear = -1;
          snap(L.reset, "front == rear: that was the only element. Reset <code>front = rear = -1</code> (empty).", "good");
        } else {
          const old = front;
          front = (front + 1) % max;
          snap(L.next, `front = (front + 1) % MAX = (${old} + 1) % ${max} = <b>${front}</b>${old === max - 1 ? " — wrapped round to cell 0" : ""}.`);
        }
      }
    }
    return snaps;
  }
  makePlayer(el, {
    build, code: C, output: true,
    view: (s) => cellsHTML(s.arr, { front: s.front, rear: s.rear, cls: s.hc }),
    extraControls: `<label>operations <input type="text" class="fr-ops" value="${script}"></label>
      <label>MAX <select class="fr-max">${[3, 4, 5, 6, 7, 8].map((n) => `<option${n === max ? " selected" : ""}>${n}</option>`).join("")}</select></label>
      <label>try <select class="fr-ops-pre"><option value="">a preset…</option>
        <option value="enq 10, enq 20, enq 30, enq 40, enq 50, deq, deq, enq 60, enq 70, enq 80">the slides' example (+ 80)</option>
        <option value="enq 1, deq, enq 2, enq 3, deq, deq, deq">emptying and refilling</option></select></label>`,
    legend: "Write <code>enq x</code> or <code>deq</code>, separated by commas, then press Enter. When front or rear is −1, no pointer is drawn.",
    onMount(root, rebuild) {
      opsInput(root, rebuild, "fr-ops", (v) => { script = v; });
      root.querySelector(".fr-max").onchange = (e) => { max = +e.target.value; rebuild(); };
    },
  });
}

// ---------- Chapter 4: priority queue on a sorted linked list ----------

function demoSortedPQ(el, { mini = false } = {}) {
  let init = "1, 3, 4, 8, 14, 22";
  let script = "poll, add 2, poll, add 5";
  if (mini) { init = ""; script = "add 8, add 3, add 14, add 5, poll, add 1, add 9, poll, poll, poll, poll, poll"; }
  const C = CODE.sortedOps;
  const L = { front: lineOf(C, "head = new Node(x, head);"), p0: lineOf(C, "Node p = head;"), loop: lineOf(C, "while (p.next != null"),
    step: lineOf(C, "p = p.next;"), link: lineOf(C, "p.next = new Node(x, p.next);"), under: lineOf(C, "Priority queue empty"),
    take: lineOf(C, "int x = head.value;"), unlink: lineOf(C, "head = head.next;") };
  function build() {
    let list = parseNums(init, []).sort((a, b) => a - b);
    const ops = parseOps(script, ["add", "poll"]);
    const out = [];
    const snaps = [];
    const items = (cls = {}) => list.map((v, k) => ({ v, cls: cls[k] || "", next: k < list.length - 1 ? "arrow" : "null" }));
    const snap = (line, msg, its, labels, cls = "", walked = "—") => snaps.push({ line, msg, cls, items: its, labels, out: out.slice(),
      stats: [["size", list.length], ["highest priority", list.length ? list[0] : "—"], ["nodes walked", walked]] });
    const headLab = () => (list.length ? { 0: [["head"]] } : {});
    snap(0, list.length ? `A min-priority queue kept as a sorted list. The head is the smallest value: the highest priority.` : "An empty priority queue.", items(), headLab());
    for (const o of ops) {
      if (o.op === "add") {
        const x = Math.trunc(Number(o.arg));
        if (!Number.isFinite(x)) continue;
        if (!list.length || x < list[0]) {
          list.unshift(x);
          snap(L.front, `add(${x}): ${list.length === 1 ? "the list is empty" : `${x} &lt; ${list[1]}, the head`}, so the new node becomes the head. Walked 0 nodes.`, items({ 0: "new linked" }), headLab(), "", 0);
          continue;
        }
        let p = 0, steps = 1;
        snap(L.p0, `add(${x}): start with <code>p</code> at the head (${list[0]}).`, items({ 0: "hi" }), { 0: [["head"], ["p", "r"]] }, "", steps);
        while (p + 1 < list.length && list[p + 1] <= x) {
          p++; steps++;
          snap(L.step, `p.next.value = ${list[p]} ≤ ${x}, so move on: <code>p = p.next</code>.`, items({ [p]: "hi" }), { 0: [["head"]], [p]: [...(p === 0 ? [["head"]] : []), ["p", "r"]] }, "", steps);
        }
        const why = p + 1 < list.length ? `p.next.value = ${list[p + 1]} &gt; ${x}` : "p.next is null (end of the list)";
        snap(L.loop, `${why}: stop. ${x} goes right after ${list[p]}.`, items({ [p]: "hi" }), { 0: [["head"]], [p]: [...(p === 0 ? [["head"]] : []), ["p", "r"]] }, "", steps);
        list.splice(p + 1, 0, x);
        snap(L.link, `<code>p.next = new Node(${x}, p.next)</code>: linked in. ${x} has priority number ${p + 2} (counting from the head). Walked ${steps} node${steps === 1 ? "" : "s"}: O(n) in the worst case.`, items({ [p + 1]: "new linked" }), headLab(), "", steps);
      } else {
        if (!list.length) { snap(L.under, "poll() on an empty priority queue: exception.", [], {}, "bad"); continue; }
        snap(L.take, `poll(): the head, <b>${list[0]}</b>, has the highest priority.`, items({ 0: "hi" }), headLab());
        const x = list.shift();
        out.push(x);
        const its = [{ v: x, cls: "gone", next: list.length ? "arrow" : "null" }].concat(items());
        snap(L.unlink, `<code>head = head.next</code>: ${x} is removed and returned, in O(1).`, its, list.length ? { 1: [["head"]] } : {});
      }
    }
    return snaps;
  }
  makePlayer(el, {
    mini, build, code: C, output: true, miniSpeed: 1000,
    view: (s) => nodesHTML(s.items, s.labels),
    extraControls: `<label>start with <input type="text" class="pq-init" value="${init}" style="width:150px"></label>
      <label>operations <input type="text" class="pq-ops" value="${script}"></label>`,
    legend: "Write <code>add x</code> or <code>poll</code>, separated by commas, then press Enter. The output box lists what <code>poll</code> returned: always in increasing order.",
    onMount(root, rebuild) {
      opsInput(root, rebuild, "pq-ops", (v) => { script = v; });
      root.querySelector(".pq-init").onchange = (e) => { init = e.target.value; rebuild(); };
    },
  });
}

// ---------- Chapter 5: deque on a circular array ----------

function demoDeque(el, { mini = false } = {}) {
  let script = "er 1, er 2, er 3, ef 5, gf, gr, df, dr";
  let n = 5;
  if (mini) script = "er 1, er 2, ef 3, ef 4, dr, df, ef 5, er 6, dr, df, df, dr";
  const C = CODE.dequeOps;
  const at = (sig) => lineOf(C, sig);
  const L = {
    ef: lineOf(C, "front = backward(front);"), er: lineOf(C, "rear = forward(rear);"),
    df: lineOf(C, "front = forward(front);"), dr: lineOf(C, "rear = backward(rear);"),
    efFull: lineOf(C, "Deque full", at("enqueueFront")), erFull: lineOf(C, "Deque full", at("enqueueRear")),
    dfEmpty: lineOf(C, "Deque empty", at("dequeueFront")), drEmpty: lineOf(C, "Deque empty", at("dequeueRear")),
  };
  function build() {
    const ops = parseOps(script, ["ef", "er", "df", "dr", "gf", "gr"]);
    const cells = Array(n).fill(null);
    let front = 0, rear = n - 1, size = 0;
    const out = [];
    const snaps = [];
    const order = () => Array.from({ length: size }, (_, k) => cells[(front + k) % n]);
    const snap = (line, msg, cls = "", hc = {}) => snaps.push({ line, msg, cls, cells: cells.slice(), front, rear, size, hc, out: out.slice(),
      stats: [["f", front], ["r", rear], ["size", `${size} / ${n}`], ["front → rear", order().join(" ") || "—"]] });
    const fw = (i) => (i + 1) % n, bw = (i) => (i - 1 + n) % n;
    const wrapNote = (old, now, dir) => (dir < 0 && old === 0 ? ` — ${old} − 1 = −1 is not a valid index, so it wraps to n − 1 = ${now}` : dir > 0 && old === n - 1 ? ` — ${old} + 1 = ${n} is not a valid index, so it wraps to 0` : "");
    snap(0, `An empty deque, n = ${n}: <code>front = 0</code>, <code>rear = n − 1 = ${n - 1}</code>, so that rear = (front + size − 1) mod n holds.`);
    for (const o of ops) {
      const x = o.arg ?? "?";
      if (o.op === "ef" || o.op === "er") {
        if (size === n) { snap(o.op === "ef" ? L.efFull : L.erFull, `${o.op === "ef" ? "enqueueFront" : "enqueueRear"}(${esc(x)}): the deque is full.`, "bad"); continue; }
        if (o.op === "ef") {
          const old = front; front = bw(front); cells[front] = x; size++;
          snap(L.ef, `enqueueFront(${esc(x)}): front = backward(${old}) = (${old} − 1 + ${n}) % ${n} = <b>${front}</b>${wrapNote(old, front, -1)}. Store ${esc(x)} there.`, "", { [front]: "new" });
        } else {
          const old = rear; rear = fw(rear); cells[rear] = x; size++;
          snap(L.er, `enqueueRear(${esc(x)}): rear = forward(${old}) = (${old} + 1) % ${n} = <b>${rear}</b>${wrapNote(old, rear, 1)}. Store ${esc(x)} there.`, "", { [rear]: "new" });
        }
      } else if (o.op === "df" || o.op === "dr") {
        if (!size) { snap(o.op === "df" ? L.dfEmpty : L.drEmpty, `${o.op === "df" ? "dequeueFront" : "dequeueRear"}(): the deque is empty.`, "bad"); continue; }
        if (o.op === "df") {
          const old = front, v = cells[front]; cells[front] = null; front = fw(front); size--; out.push(v);
          snap(L.df, `dequeueFront() returns <b>${esc(v)}</b>; front = forward(${old}) = <b>${front}</b>${wrapNote(old, front, 1)}.`, "", { [old]: "gone" });
        } else {
          const old = rear, v = cells[rear]; cells[rear] = null; rear = bw(rear); size--; out.push(v);
          snap(L.dr, `dequeueRear() returns <b>${esc(v)}</b>; rear = backward(${old}) = <b>${rear}</b>${wrapNote(old, rear, -1)}.`, "", { [old]: "gone" });
        }
      } else {
        if (!size) { snap(0, "The deque is empty: nothing to look at.", "bad"); continue; }
        const k = o.op === "gf" ? front : rear;
        snap(0, `${o.op === "gf" ? "getFront()" : "getRear()"} = <b>${esc(cells[k])}</b> (cell ${k}). Nothing moves.`, "", { [k]: "hi" });
      }
    }
    return snaps;
  }
  makePlayer(el, {
    mini, build, code: C, output: true, miniSpeed: 950,
    view: (s) => (mini ? `<div class="svgbox">${ringSVG(s.cells, { front: s.size ? s.front : -1, rear: s.size ? s.rear : -1, center: `size ${s.size}/${s.cells.length}` })}</div>`
      : cellsHTML(s.cells, { front: s.size ? s.front : -1, rear: s.size ? s.rear : -1, cls: s.hc, fLabel: "f", rLabel: "r" })),
    extraControls: `<label>operations <input type="text" class="dq-ops" value="${script}"></label>
      <label>n <select class="dq-n">${[4, 5, 6, 7, 8].map((k) => `<option${k === n ? " selected" : ""}>${k}</option>`).join("")}</select></label>
      <label>try <select class="dq-ops-pre"><option value="">a preset…</option>
        <option value="er 1, er 2, er 3, ef 5, gf, gr, df, dr">slides 30–32</option>
        <option value="er 1, ef 3, ef 2, dr">slide 33: rear wraps backward</option>
        <option value="ef 7, ef 8, er 9">the Predict box</option>
        <option value="er 1, er 2, er 3, dr, dr, dr">used as a stack</option></select></label>`,
    legend: "<code>ef x</code> enqueueFront · <code>er x</code> enqueueRear · <code>df</code> dequeueFront · <code>dr</code> dequeueRear · <code>gf</code> getFront · <code>gr</code> getRear. Separate with commas, then press Enter.",
    onMount(root, rebuild) {
      opsInput(root, rebuild, "dq-ops", (v) => { script = v; });
      root.querySelector(".dq-n").onchange = (e) => { n = +e.target.value; rebuild(); };
    },
  });
}

// ---------- Chapter 6: a stack from queues ----------

function demoStackQueues(el) {
  let keys = "1, 2, 3, 4, 5";
  let mode = "two";
  function code() { return mode === "two" ? CODE.stackFromQueues : CODE.stackFromOneQueue; }
  function build() {
    const C = code();
    const xs = String(keys).split(/[\s,]+/).filter(Boolean).slice(0, 7);
    const q1 = [], q2 = [];
    let moves = 0;
    const out = [];
    const snaps = [];
    const snap = (line, msg, cls = "", h1 = {}, h2 = {}) => snaps.push({ line, msg, cls, q1: q1.slice(), q2: q2.slice(), h1, h2, out: out.slice(),
      stats: [["moves between queues", moves], ["stack size", q1.length], ["top", q1.length ? q1[0] : "—"]] });
    snap(0, mode === "two" ? "The stack lives in q1, top at the <b>front</b>; q2 is scratch space. We push every key, then pop them all."
      : "The stack lives in one queue q, top at the <b>front</b>. We push every key, then pop them all.");
    for (const x of xs) {
      if (mode === "two") {
        while (q1.length) { q2.push(q1.shift()); moves++; snap(lineOf(C, "q2.add(q1.poll());"), `push(${esc(x)}): move ${esc(q2[q2.length - 1])} from q1 to q2.`, "", {}, { [q2.length - 1]: "new" }); }
        q1.push(x);
        snap(lineOf(C, "q1.add(data);"), `q1 is empty, so ${esc(x)} goes in first: it is at the front, the top of the stack.`, "", { 0: "new" });
        while (q2.length) { q1.push(q2.shift()); moves++; snap(lineOf(C, "q1.add(q2.poll());"), `Move ${esc(q1[q1.length - 1])} back from q2 to q1, behind ${esc(x)}.`, "", { [q1.length - 1]: "new" }); }
      } else {
        q1.push(x);
        snap(lineOf(C, "q.add(data);"), `push(${esc(x)}): enqueue it at the rear.`, "", { [q1.length - 1]: "new" });
        for (let k = 0; k < q1.length - 1; k++) { q1.push(q1.shift()); moves++; snap(lineOf(C, "q.add(q.poll());"), `Rotate: take ${esc(q1[q1.length - 1])} from the front and enqueue it again (${k + 1} of ${q1.length - 1}).`, "", { [q1.length - 1]: "new" }); }
      }
    }
    for (let k = 0; k < xs.length; k++) {
      const v = q1.shift();
      out.push(v);
      snap(lineOf(C, mode === "two" ? "return q1.poll();" : "return q.poll();"), `pop() = ${mode === "two" ? "q1" : "q"}.poll() = <b>${esc(v)}</b>, in O(1).`);
    }
    const n = xs.length;
    snaps[snaps.length - 1].msg += ` Popped in LIFO order. Pushing ${n} keys took ${moves} moves (${mode === "two" ? "n(n − 1)" : "n(n − 1)/2"}): Θ(n²) in total.`;
    snaps[snaps.length - 1].cls = "good";
    return snaps;
  }
  function view(s) {
    const row = (name, xs, h) => `<div class="qrow"><b>${name}</b>${cellsHTML(xs.length ? xs : [null], { front: xs.length ? 0 : -1, rear: -1, idx: false, cls: h })}</div>`;
    return `<div class="qv-panel">${row(mode === "two" ? "q1" : "q", s.q1, s.h1)}${mode === "two" ? row("q2", s.q2, s.h2) : ""}<div class="ret">front is on the left · popped: ${fmtList(s.out)}</div></div>`;
  }
  makePlayer(el, {
    build, view, code, output: true,
    extraControls: `<label>keys <input type="text" class="sq-keys" value="${keys}" style="width:150px"></label>
      <label>version <select class="sq-mode"><option value="two">two queues (slide 34)</option><option value="one">one queue, rotate</option></select></label>`,
    legend: "At most 7 keys. Each step is one queue operation.",
    onMount(root, rebuild) {
      root.querySelector(".sq-keys").onchange = (e) => { keys = e.target.value; rebuild(); };
      root.querySelector(".sq-mode").onchange = (e) => { mode = e.target.value; rebuild(); };
    },
  });
}

// ---------- Chapter 6: a queue from two stacks ----------

function demoQueueStacks(el, { mini = false } = {}) {
  let script = "enq 1, enq 2, enq 3, deq, enq 4, deq, deq, deq";
  let mode = mini ? "lazy" : "eager";
  if (mini) script = "enq 1, enq 2, enq 3, deq, enq 4, enq 5, deq, deq, deq, deq";
  function code() { return mode === "eager" ? CODE.queueFromStacks : CODE.lazyQueueFromStacks; }
  function build() {
    const C = code();
    const ops = parseOps(script, ["enq", "deq"]);
    const a = [], b = [];   // eager: s1, s2; lazy: in, out (top = end of the array)
    let moves = 0;
    const out = [];
    const snaps = [];
    const snap = (line, msg, cls = "", ha = {}, hb = {}) => snaps.push({ line, msg, cls, a: a.slice(), b: b.slice(), ha, hb, out: out.slice(),
      stats: [["moves between stacks", moves], ["elements", a.length + b.length]] });
    snap(0, mode === "eager" ? "The queue lives in s1 with its <b>front on top</b>; s2 is scratch space." : "Enqueues go onto <code>in</code>; dequeues come from <code>out</code>, whose top is the oldest element.");
    for (const o of ops) {
      if (o.op === "enq") {
        const x = o.arg ?? "?";
        if (mode === "eager") {
          while (a.length) { b.push(a.pop()); moves++; snap(lineOf(C, "s2.push(s1.pop());"), `enqueue(${esc(x)}): pop ${esc(b[b.length - 1])} off s1 and push it on s2.`, "", {}, { [b.length - 1]: "new" }); }
          a.push(x);
          snap(lineOf(C, "s1.push(data);"), `s1 is empty: push ${esc(x)}. It is at the <b>bottom</b>, where the newest element of the queue belongs.`, "", { 0: "new" });
          while (b.length) { a.push(b.pop()); moves++; snap(lineOf(C, "s1.push(s2.pop());"), `Pop ${esc(a[a.length - 1])} off s2 and push it back on s1.`, "", { [a.length - 1]: "new" }); }
        } else {
          a.push(x);
          snap(lineOf(C, "in.push(data);"), `enqueue(${esc(x)}): just push it on <code>in</code>. O(1).`, "", { [a.length - 1]: "new" });
        }
      } else if (mode === "eager") {
        if (!a.length) { snap(lineOf(C, "Underflow"), "dequeue() on an empty queue: underflow.", "bad"); continue; }
        const v = a.pop(); out.push(v);
        snap(lineOf(C, "return s1.pop();"), `dequeue() = s1.pop() = <b>${esc(v)}</b>, the oldest element, in O(1).`);
      } else {
        if (!b.length) {
          if (!a.length) { snap(lineOf(C, "Underflow"), "dequeue(): both stacks are empty: underflow.", "bad"); continue; }
          while (a.length) { b.push(a.pop()); moves++; snap(lineOf(C, "out.push(in.pop());"), `<code>out</code> is empty, so pour <code>in</code> into it: move ${esc(b[b.length - 1])}. The order reverses.`, "", {}, { [b.length - 1]: "new" }); }
        }
        const v = b.pop(); out.push(v);
        snap(lineOf(C, "return out.pop();"), `dequeue() = out.pop() = <b>${esc(v)}</b>.${b.length ? " The next dequeues need no moves at all." : ""}`);
      }
    }
    snaps[snaps.length - 1].msg += ` Total moves: ${moves}.`;
    return snaps;
  }
  function view(s) {
    const col = (name, xs, h) => `<div class="stk"><h4>${name}</h4><div class="stk-body">${xs.map((v, k) => `<div class="cell ${h[k] || ""}">${esc(v)}</div>`).join("")}</div><small>bottom</small></div>`;
    const names = mode === "eager" ? ["s1", "s2"] : ["in", "out"];
    return `<div class="qv-panel"><div class="stk-row">${col(names[0], s.a, s.ha)}${col(names[1], s.b, s.hb)}</div><div class="ret">dequeued: ${fmtList(s.out)}</div></div>`;
  }
  makePlayer(el, {
    mini, build, view, code, output: true, miniSpeed: 950,
    extraControls: `<label>operations <input type="text" class="qs-ops" value="${script}"></label>
      <label>version <select class="qs-mode"><option value="eager">slide 35 (eager)</option><option value="lazy">lazy (in / out)</option></select></label>`,
    legend: "Write <code>enq x</code> or <code>deq</code>, separated by commas, then press Enter. Compare the move counts of the two versions on the same operations.",
    onMount(root, rebuild) {
      opsInput(root, rebuild, "qs-ops", (v) => { script = v; });
      root.querySelector(".qs-mode").onchange = (e) => { mode = e.target.value; rebuild(); };
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

// Demo registry: each data-demo attribute in chapters.js mounts the DEMOS entry of that name.
const DEMOS = {
  fifoLifo: (el) => demoFifoLifo(el),
  fifoMini: (el) => demoFifoLifo(el, { mini: true }),
  linkedQueue: (el) => demoLinkedQueue(el),
  linkedMini: (el) => demoLinkedQueue(el, { mini: true }),
  linearArray: (el) => demoLinearArray(el),
  circular: (el) => demoCircular(el),
  ringMini: (el) => demoCircular(el, { mini: true }),
  circularFR: (el) => demoCircularFR(el),
  sortedPQ: (el) => demoSortedPQ(el),
  pqMini: (el) => demoSortedPQ(el, { mini: true }),
  deque: (el) => demoDeque(el),
  dequeMini: (el) => demoDeque(el, { mini: true }),
  stackQueues: (el) => demoStackQueues(el),
  queueStacks: (el) => demoQueueStacks(el),
  queueStacksMini: (el) => demoQueueStacks(el, { mini: true }),
  quiz: (el) => demoQuiz(el, QUIZ),
};
