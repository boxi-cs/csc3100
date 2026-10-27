// Lecture 8 demos. Code panels and outputs come from notes/L08-list-applications.md, which
// tools/check.py compiles and runs; the JS twins below replay the same Java step by step.

// Generated from notes/L08-list-applications.md (every block passed tools/check.py).
// CODE[ClassName] is a whole block; CODE.m_* is one method cut from a block; OUT[ClassName] is its real output.
const CODE = {
  "IntNode": "class IntNode {\n    int data;\n    IntNode next;\n\n    IntNode(int data, IntNode next) {\n        this.data = data;\n        this.next = next;\n    }\n}",
  "DNode": "class DNode {\n    int data;\n    DNode prev, next;\n\n    DNode(int data) {\n        this.data = data;\n    }\n}",
  "CircularDemo": "public class CircularDemo {\n    public static void main(String[] args) {\n        // circular: 7 -> 8 -> 10 -> back to 7\n        IntNode head = new IntNode(7, null);\n        head.next = new IntNode(8, new IntNode(10, head));\n        IntNode p = head;\n        do {\n            System.out.print(p.data + \" \");\n            p = p.next;\n        } while (p != head);\n        System.out.println(\"(back at the head)\");\n\n        // doubly circular: 1 <-> 2 <-> 3, and 3 <-> 1\n        DNode a = new DNode(1), b = new DNode(2), c = new DNode(3);\n        a.next = b; b.next = c; c.next = a;\n        a.prev = c; b.prev = a; c.prev = b;\n        DNode q = a.prev;                    // start at the last node\n        do {\n            System.out.print(q.data + \" \");\n            q = q.prev;\n        } while (q != a.prev);\n        System.out.println(\"(walked backwards)\");\n    }\n}",
  "ArrayPolynomial": "public class ArrayPolynomial {\n    static final int MAX_DEGREE = 3000;\n\n    int[] coeffArray = new int[MAX_DEGREE + 1];   // coeffArray[i] is the coefficient of x^i\n    int highPower;                                 // the degree\n\n    static void zeroPolynomial(ArrayPolynomial poly) {\n        for (int j = 0; j <= MAX_DEGREE; j++) {\n            poly.coeffArray[j] = 0;\n        }\n        poly.highPower = 0;\n    }\n\n    static void addPolynomial(ArrayPolynomial poly1, ArrayPolynomial poly2, ArrayPolynomial polySum) {\n        zeroPolynomial(polySum);\n        polySum.highPower = Math.max(poly1.highPower, poly2.highPower);\n        for (int i = polySum.highPower; i >= 0; i--) {\n            polySum.coeffArray[i] = poly1.coeffArray[i] + poly2.coeffArray[i];\n        }\n    }\n\n    static void multPolynomial(ArrayPolynomial poly1, ArrayPolynomial poly2, ArrayPolynomial polyProd) {\n        zeroPolynomial(polyProd);\n        polyProd.highPower = poly1.highPower + poly2.highPower;\n        if (polyProd.highPower > MAX_DEGREE) {\n            throw new IllegalArgumentException(\"Exceed array size\");\n        }\n        for (int i = 0; i <= poly1.highPower; i++) {\n            for (int j = 0; j <= poly2.highPower; j++) {\n                polyProd.coeffArray[i + j] += poly1.coeffArray[i] * poly2.coeffArray[j];\n            }\n        }\n    }\n\n    void setTerm(int coefficient, int exponent) {\n        coeffArray[exponent] = coefficient;\n        highPower = Math.max(highPower, exponent);\n    }\n\n    @Override\n    public String toString() {\n        StringBuilder sb = new StringBuilder();\n        for (int i = highPower; i >= 0; i--) {\n            int c = coeffArray[i];\n            if (c == 0) continue;\n            if (sb.length() > 0) sb.append(c < 0 ? \" - \" : \" + \");\n            else if (c < 0) sb.append(\"-\");\n            int a = Math.abs(c);\n            if (a != 1 || i == 0) sb.append(a);\n            if (i >= 1) sb.append(\"x\");\n            if (i >= 2) sb.append(\"^\").append(i);\n        }\n        return sb.length() == 0 ? \"0\" : sb.toString();\n    }\n}",
  "ArrayPolyDemo": "public class ArrayPolyDemo {\n    public static void main(String[] args) {\n        ArrayPolynomial p = new ArrayPolynomial();   // 4x^3 + 2x + 1\n        p.setTerm(4, 3); p.setTerm(2, 1); p.setTerm(1, 0);\n        ArrayPolynomial q = new ArrayPolynomial();   // 3x^2 + 5\n        q.setTerm(3, 2); q.setTerm(5, 0);\n\n        ArrayPolynomial sum = new ArrayPolynomial();\n        ArrayPolynomial prod = new ArrayPolynomial();\n        ArrayPolynomial.addPolynomial(p, q, sum);\n        ArrayPolynomial.multPolynomial(p, q, prod);\n        System.out.println(\"P     = \" + p);\n        System.out.println(\"Q     = \" + q);\n        System.out.println(\"P + Q = \" + sum);\n        System.out.println(\"P * Q = \" + prod);\n    }\n}",
  "SparsePolyCost": "public class SparsePolyCost {\n    public static void main(String[] args) {\n        ArrayPolynomial p1 = new ArrayPolynomial();\n        p1.setTerm(10, 1000); p1.setTerm(5, 14); p1.setTerm(1, 0);\n        ArrayPolynomial p2 = new ArrayPolynomial();\n        p2.setTerm(3, 1990); p2.setTerm(-2, 1492); p2.setTerm(11, 1); p2.setTerm(5, 0);\n\n        long inner = (long) (p1.highPower + 1) * (p2.highPower + 1);\n        System.out.println(\"inner-loop steps:  \" + inner);\n        System.out.println(\"useful steps:      \" + 3 * 4);\n        System.out.printf(\"useful fraction:   %.4f%%%n\", 100.0 * 12 / inner);\n\n        ArrayPolynomial prod = new ArrayPolynomial();\n        ArrayPolynomial.multPolynomial(p1, p2, prod);\n        System.out.println(\"degree of product: \" + prod.highPower);\n    }\n}",
  "Term": "class Term {\n    int coefficient;\n    int exponent;\n    Term next;\n\n    Term(int coefficient, int exponent, Term next) {\n        this.coefficient = coefficient;\n        this.exponent = exponent;\n        this.next = next;\n    }\n}",
  "LinkedPolynomial": "public class LinkedPolynomial {\n    /** Build a polynomial from (coefficient, exponent) pairs, highest exponent first. */\n    static Term of(int... pairs) {\n        Term head = null;\n        for (int k = pairs.length - 2; k >= 0; k -= 2) {\n            head = new Term(pairs[k], pairs[k + 1], head);\n        }\n        return head;\n    }\n\n    /** p + q. Both lists must be sorted by decreasing exponent; neither is changed. */\n    static Term add(Term p, Term q) {\n        Term dummy = new Term(0, 0, null);\n        Term tail = dummy;\n        while (p != null && q != null) {\n            if (p.exponent > q.exponent) {\n                tail.next = new Term(p.coefficient, p.exponent, null);\n                p = p.next;\n            } else if (p.exponent < q.exponent) {\n                tail.next = new Term(q.coefficient, q.exponent, null);\n                q = q.next;\n            } else {\n                int c = p.coefficient + q.coefficient;\n                if (c != 0) {\n                    tail.next = new Term(c, p.exponent, null);\n                }\n                p = p.next;\n                q = q.next;\n            }\n            if (tail.next != null) tail = tail.next;\n        }\n        for (Term rest = (p != null) ? p : q; rest != null; rest = rest.next) {\n            tail.next = new Term(rest.coefficient, rest.exponent, null);\n            tail = tail.next;\n        }\n        return dummy.next;\n    }\n\n    /** The single term (c x^e) times the polynomial q. */\n    static Term multiplyByTerm(int c, int e, Term q) {\n        Term dummy = new Term(0, 0, null);\n        Term tail = dummy;\n        for (; q != null; q = q.next) {\n            tail.next = new Term(c * q.coefficient, e + q.exponent, null);\n            tail = tail.next;\n        }\n        return dummy.next;\n    }\n\n    /** p * q: one partial product per term of p, merged into the result one by one. */\n    static Term multiply(Term p, Term q) {\n        Term result = null;\n        for (; p != null; p = p.next) {\n            result = add(result, multiplyByTerm(p.coefficient, p.exponent, q));\n        }\n        return result;\n    }\n\n    static String toString(Term p) {\n        if (p == null) return \"0\";\n        StringBuilder sb = new StringBuilder();\n        for (; p != null; p = p.next) {\n            int c = p.coefficient, e = p.exponent;\n            if (sb.length() > 0) sb.append(c < 0 ? \" - \" : \" + \");\n            else if (c < 0) sb.append(\"-\");\n            int a = Math.abs(c);\n            if (a != 1 || e == 0) sb.append(a);\n            if (e >= 1) sb.append(\"x\");\n            if (e >= 2) sb.append(\"^\").append(e);\n        }\n        return sb.toString();\n    }\n\n    static int countTerms(Term p) {\n        int n = 0;\n        for (; p != null; p = p.next) n++;\n        return n;\n    }\n}",
  "LinkedPolyDemo": "public class LinkedPolyDemo {\n    public static void main(String[] args) {\n        Term p1 = LinkedPolynomial.of(10, 1000, 5, 14, 1, 0);\n        Term p2 = LinkedPolynomial.of(3, 1990, -2, 1492, 11, 1, 5, 0);\n        System.out.println(\"P1      = \" + LinkedPolynomial.toString(p1));\n        System.out.println(\"P2      = \" + LinkedPolynomial.toString(p2));\n        System.out.println(\"P1 + P2 = \" + LinkedPolynomial.toString(LinkedPolynomial.add(p1, p2)));\n        Term prod = LinkedPolynomial.multiply(p1, p2);\n        System.out.println(\"P1 * P2 = \" + LinkedPolynomial.toString(prod));\n        System.out.println(\"terms in P1 * P2: \" + LinkedPolynomial.countTerms(prod));\n\n        Term a = LinkedPolynomial.of(1, 1, 1, 0);    // x + 1\n        Term b = LinkedPolynomial.of(1, 1, -1, 0);   // x - 1\n        System.out.println(\"(x + 1) + (x - 1) = \" + LinkedPolynomial.toString(LinkedPolynomial.add(a, b)));\n        System.out.println(\"(x + 1) * (x - 1) = \" + LinkedPolynomial.toString(LinkedPolynomial.multiply(a, b)));\n    }\n}",
  "Triplet": "class Triplet {\n    int row, col, value;\n\n    Triplet(int row, int col, int value) {\n        this.row = row;\n        this.col = col;\n        this.value = value;\n    }\n}",
  "TripletMatrix": "public class TripletMatrix {\n    /** The non-zero entries of m, in row-major order. */\n    static Triplet[] toTriplets(int[][] m) {\n        int count = 0;\n        for (int[] row : m) {\n            for (int v : row) {\n                if (v != 0) count++;\n            }\n        }\n        Triplet[] t = new Triplet[count];\n        int k = 0;\n        for (int r = 0; r < m.length; r++) {\n            for (int c = 0; c < m[r].length; c++) {\n                if (m[r][c] != 0) t[k++] = new Triplet(r, c, m[r][c]);\n            }\n        }\n        return t;\n    }\n\n    /** The entry at (row, col): scan the triplets; anything not stored is 0. */\n    static int get(Triplet[] t, int row, int col) {\n        for (Triplet x : t) {\n            if (x.row == row && x.col == col) return x.value;\n        }\n        return 0;\n    }\n}",
  "TripletDemo": "public class TripletDemo {\n    public static void main(String[] args) {\n        int[][] m = {\n            {0, 0, 0, 0, 9, 0},\n            {0, 8, 0, 0, 0, 0},\n            {4, 0, 0, 2, 0, 0},\n            {0, 0, 0, 0, 0, 5},\n            {0, 0, 2, 0, 0, 0},\n        };\n        Triplet[] t = TripletMatrix.toTriplets(m);\n        System.out.println(\"row col value\");\n        for (Triplet x : t) {\n            System.out.printf(\"%3d %3d %5d%n\", x.row, x.col, x.value);\n        }\n        System.out.println(\"get(2, 3) = \" + TripletMatrix.get(t, 2, 3));\n        System.out.println(\"get(2, 2) = \" + TripletMatrix.get(t, 2, 2));\n        System.out.println(\"2D array: \" + m.length * m[0].length + \" ints; triplets: \" + 3 * t.length + \" ints\");\n    }\n}",
  "MatrixNode": "class MatrixNode {\n    int row, col, value;\n    MatrixNode next;\n\n    MatrixNode(int row, int col, int value) {\n        this.row = row;\n        this.col = col;\n        this.value = value;\n    }\n}",
  "LinkedMatrixDemo": "public class LinkedMatrixDemo {\n    static MatrixNode fromArray(int[][] m) {\n        MatrixNode dummy = new MatrixNode(0, 0, 0);\n        MatrixNode tail = dummy;\n        for (int r = 0; r < m.length; r++) {\n            for (int c = 0; c < m[r].length; c++) {\n                if (m[r][c] != 0) {\n                    tail.next = new MatrixNode(r, c, m[r][c]);\n                    tail = tail.next;\n                }\n            }\n        }\n        return dummy.next;\n    }\n\n    public static void main(String[] args) {\n        int[][] m = {\n            {0, 0, 3, 0, 4},\n            {0, 0, 5, 7, 0},\n            {0, 0, 0, 0, 0},\n            {0, 2, 6, 0, 0},\n        };\n        StringBuilder sb = new StringBuilder(\"start\");\n        for (MatrixNode p = fromArray(m); p != null; p = p.next) {\n            sb.append(\" -> (\").append(p.row).append(\",\").append(p.col).append(\",\").append(p.value).append(\")\");\n        }\n        System.out.println(sb.append(\" -> null\"));\n    }\n}",
  "CrossNode": "class CrossNode {\n    int row, col, value;\n    CrossNode right, down;\n\n    CrossNode(int row, int col, int value) {\n        this.row = row;\n        this.col = col;\n        this.value = value;\n    }\n}",
  "OrthogonalMatrix": "public class OrthogonalMatrix {\n    final int rows, cols;\n    final CrossNode[] rowHead, colHead;\n    int nonZero;\n\n    OrthogonalMatrix(int rows, int cols) {\n        this.rows = rows;\n        this.cols = cols;\n        rowHead = new CrossNode[rows];\n        colHead = new CrossNode[cols];\n    }\n\n    /** Insert a new non-zero entry, keeping each row sorted by column and each column by row. */\n    void insert(int r, int c, int value) {\n        CrossNode x = new CrossNode(r, c, value);\n        if (rowHead[r] == null || rowHead[r].col > c) {        // new first node of row r\n            x.right = rowHead[r];\n            rowHead[r] = x;\n        } else {\n            CrossNode p = rowHead[r];\n            while (p.right != null && p.right.col < c) p = p.right;\n            x.right = p.right;\n            p.right = x;\n        }\n        if (colHead[c] == null || colHead[c].row > r) {        // new first node of column c\n            x.down = colHead[c];\n            colHead[c] = x;\n        } else {\n            CrossNode p = colHead[c];\n            while (p.down != null && p.down.row < r) p = p.down;\n            x.down = p.down;\n            p.down = x;\n        }\n        nonZero++;\n    }\n\n    /** Walk row r to column c. */\n    int get(int r, int c) {\n        for (CrossNode p = rowHead[r]; p != null && p.col <= c; p = p.right) {\n            if (p.col == c) return p.value;\n        }\n        return 0;\n    }\n\n    String rowToString(int r) {\n        StringBuilder sb = new StringBuilder(\"row \" + r + \":\");\n        for (CrossNode p = rowHead[r]; p != null; p = p.right) {\n            sb.append(\" (\").append(p.row).append(\",\").append(p.col).append(\",\").append(p.value).append(\")\");\n        }\n        return sb.toString();\n    }\n\n    String colToString(int c) {\n        StringBuilder sb = new StringBuilder(\"col \" + c + \":\");\n        for (CrossNode p = colHead[c]; p != null; p = p.down) {\n            sb.append(\" (\").append(p.row).append(\",\").append(p.col).append(\",\").append(p.value).append(\")\");\n        }\n        return sb.toString();\n    }\n}",
  "OrthogonalDemo": "public class OrthogonalDemo {\n    public static void main(String[] args) {\n        int[][] m = {\n            {2, 0, 0, 0},\n            {4, 0, 0, 3},\n            {0, 0, 0, 0},\n            {8, 0, 0, 1},\n            {0, 0, 6, 0},\n        };\n        OrthogonalMatrix om = new OrthogonalMatrix(5, 4);\n        for (int r = 0; r < 5; r++) {\n            for (int c = 0; c < 4; c++) {\n                if (m[r][c] != 0) om.insert(r, c, m[r][c]);\n            }\n        }\n        System.out.println(om.rows + \" x \" + om.cols + \", \" + om.nonZero + \" non-zero entries\");\n        for (int r = 0; r < om.rows; r++) System.out.println(om.rowToString(r));\n        for (int c = 0; c < om.cols; c++) System.out.println(om.colToString(c));\n        System.out.println(\"get(3, 3) = \" + om.get(3, 3) + \", get(3, 2) = \" + om.get(3, 2));\n    }\n}",
  "Node": "class Node {\n    String label;\n    Node next;\n\n    Node(String label, Node next) {\n        this.label = label;\n        this.next = next;\n    }\n}",
  "Intersection": "public class Intersection {\n    static long comparisons;\n\n    /** Method 1: compare every node of L1 with every node of L2. O(MN). */\n    static Node firstCommonBrute(Node head1, Node head2) {\n        for (Node a = head1; a != null; a = a.next) {\n            for (Node b = head2; b != null; b = b.next) {\n                comparisons++;\n                if (a == b) return a;\n            }\n        }\n        return null;                       // no common node\n    }\n\n    /** Method 2 (the slides' version): when a pointer reaches the end, jump to the other head. */\n    static Node firstCommonSwitch(Node head1, Node head2) {\n        Node a = head1, b = head2;\n        while (true) {                      // loops forever if the lists do not intersect!\n            comparisons++;\n            if (a == b) return a;\n            a = (a.next == null) ? head2 : a.next;\n            b = (b.next == null) ? head1 : b.next;\n        }\n    }\n\n    /** Method 2, safe version: walks through null once, so it also stops when there is no common node. */\n    static Node firstCommon(Node head1, Node head2) {\n        Node a = head1, b = head2;\n        while (a != b) {\n            comparisons++;\n            a = (a == null) ? head2 : a.next;\n            b = (b == null) ? head1 : b.next;\n        }\n        return a;                           // the first common node, or null\n    }\n}",
  "IntersectionDemo": "public class IntersectionDemo {\n    public static void main(String[] args) {\n        Node c1 = new Node(\"c1\", new Node(\"c2\", null));\n        Node l1 = new Node(\"a1\", new Node(\"a2\", new Node(\"a3\", c1)));\n        Node l2 = new Node(\"b1\", new Node(\"b2\", c1));\n\n        Intersection.comparisons = 0;\n        Node r = Intersection.firstCommonBrute(l1, l2);\n        System.out.println(\"Method 1:      \" + r.label + \" after \" + Intersection.comparisons + \" comparisons\");\n\n        Intersection.comparisons = 0;\n        r = Intersection.firstCommonSwitch(l1, l2);\n        System.out.println(\"Method 2:      \" + r.label + \" after \" + Intersection.comparisons + \" comparisons\");\n\n        Intersection.comparisons = 0;\n        r = Intersection.firstCommon(l1, l2);\n        System.out.println(\"Method 2 safe: \" + r.label + \" after \" + Intersection.comparisons + \" pointer moves\");\n\n        Node other = new Node(\"d1\", new Node(\"d2\", null));   // shares nothing with L1\n        System.out.println(\"L1 and other:  \" + Intersection.firstCommon(l1, other));\n    }\n}",
  "Cycles": "public class Cycles {\n    /** A list of tail + cycle nodes numbered from 0. If cycle > 0, the last node points back to node tail. */\n    static IntNode build(int tail, int cycle) {\n        int n = tail + cycle;\n        IntNode[] nodes = new IntNode[n];\n        for (int i = n - 1; i >= 0; i--) {\n            nodes[i] = new IntNode(i, i + 1 < n ? nodes[i + 1] : null);\n        }\n        if (cycle > 0) nodes[n - 1].next = nodes[tail];\n        return n == 0 ? null : nodes[0];\n    }\n\n    /** Method 1: follow next at most limit times. Wrong if the list is longer than limit. */\n    static boolean hasCycleBounded(IntNode head, int limit) {\n        IntNode p = head;\n        for (int i = 1; i <= limit; i++) {\n            if (p == null) return false;\n            p = p.next;\n        }\n        return true;                          // \"no null yet, so probably a cycle\"\n    }\n\n    /** Method 2: remember every node visited; a cycle shows up as a node seen twice. */\n    static boolean hasCycleSet(IntNode head) {\n        java.util.Set<IntNode> seen = new java.util.HashSet<>();\n        for (IntNode p = head; p != null; p = p.next) {\n            if (!seen.add(p)) return true;    // add returns false if p was already there\n        }\n        return false;\n    }\n\n    /** Method 3: Floyd's tortoise and hare. O(n) time, O(1) extra space. */\n    static boolean hasCycle(IntNode head) {\n        IntNode slow = head, fast = head;\n        while (fast != null && fast.next != null) {\n            slow = slow.next;                 // one step\n            fast = fast.next.next;            // two steps\n            if (slow == fast) return true;    // compare after moving\n        }\n        return false;\n    }\n\n    /** How many steps Method 3 takes until slow and fast meet (-1 if fast reaches the end). */\n    static int meetingStep(IntNode head) {\n        IntNode slow = head, fast = head;\n        int steps = 0;\n        while (fast != null && fast.next != null) {\n            slow = slow.next;\n            fast = fast.next.next;\n            steps++;\n            if (slow == fast) return steps;\n        }\n        return -1;\n    }\n}",
  "CycleDemo": "public class CycleDemo {\n    public static void main(String[] args) {\n        int[][] cases = {{5, 0}, {2, 6}, {0, 5}, {7, 3}, {3, 4}};\n        System.out.println(\"tail cycle | bounded(10) set   floyd  meet-step\");\n        for (int[] tc : cases) {\n            IntNode head = Cycles.build(tc[0], tc[1]);\n            System.out.printf(\"%4d %5d | %-11b %-5b %-6b %d%n\", tc[0], tc[1],\n                Cycles.hasCycleBounded(head, 10), Cycles.hasCycleSet(head),\n                Cycles.hasCycle(head), Cycles.meetingStep(head));\n        }\n        IntNode longList = Cycles.build(50, 0);\n        System.out.println(\"50 nodes, no cycle: bounded(10) says \" + Cycles.hasCycleBounded(longList, 10)\n            + \", floyd says \" + Cycles.hasCycle(longList));\n    }\n}",
  "SlideCycleBug": "public class SlideCycleBug {\n    // A literal translation of the slide: compare first, then move.\n    static boolean hasCycleSlide(IntNode head) {\n        IntNode a = head, b = head;\n        while (b != null && b.next != null) {\n            if (a == b) return true;\n            a = a.next;\n            b = b.next.next;\n        }\n        return false;\n    }\n\n    public static void main(String[] args) {\n        IntNode acyclic = Cycles.build(5, 0);       // 0 -> 1 -> 2 -> 3 -> 4 -> null\n        System.out.println(\"slide version: \" + hasCycleSlide(acyclic));\n        System.out.println(\"hasCycle:      \" + Cycles.hasCycle(acyclic));\n    }\n}",
  "CharNode": "public class CharNode {\n    char data;\n    CharNode next;\n\n    CharNode(char data, CharNode next) {\n        this.data = data;\n        this.next = next;\n    }\n\n    static CharNode fromString(String s) {\n        CharNode head = null;\n        for (int i = s.length() - 1; i >= 0; i--) head = new CharNode(s.charAt(i), head);\n        return head;\n    }\n\n    static String toString(CharNode head) {\n        StringBuilder sb = new StringBuilder();\n        for (CharNode p = head; p != null; p = p.next) sb.append(p.data).append(\" -> \");\n        return sb.append(\"null\").toString();\n    }\n}",
  "Dedup": "public class Dedup {\n    /** Method 1: for each node, delete all later nodes with the same letter. O(M^2). */\n    static void removeDuplicatesNaive(CharNode head) {\n        for (CharNode a = head; a != null; a = a.next) {\n            CharNode pre = a;\n            CharNode b = a.next;\n            while (b != null) {\n                if (b.data == a.data) {\n                    pre.next = b.next;      // unlink b; pre stays\n                } else {\n                    pre = b;\n                }\n                b = b.next;\n            }\n        }\n    }\n\n    /** Method 2: remember which letters have been seen. O(M). */\n    static void removeDuplicates(CharNode head) {\n        boolean[] seen = new boolean[26];   // all false at the start\n        CharNode pre = null;\n        for (CharNode a = head; a != null; a = a.next) {\n            int index = a.data - 'a';       // 'a' -> 0, 'b' -> 1, ..., 'z' -> 25\n            if (!seen[index]) {\n                seen[index] = true;\n                pre = a;                    // a stays\n            } else {\n                pre.next = a.next;          // a is a repeat: unlink it\n            }\n        }\n    }\n}",
  "DedupDemo": "public class DedupDemo {\n    public static void main(String[] args) {\n        String[] tests = {\"abbac\", \"aaaa\", \"abcabcxyz\", \"z\"};\n        for (String s : tests) {\n            CharNode l1 = CharNode.fromString(s);\n            CharNode l2 = CharNode.fromString(s);\n            Dedup.removeDuplicatesNaive(l1);\n            Dedup.removeDuplicates(l2);\n            System.out.printf(\"%-10s naive: %-34s table: %s%n\", s, CharNode.toString(l1), CharNode.toString(l2));\n        }\n    }\n}",
  "BoxedTable": "public class BoxedTable {\n    public static void main(String[] args) {\n        Boolean[] b = new Boolean[26];\n        System.out.println(\"b[0] is \" + b[0]);\n        if (b[0] == false) System.out.println(\"never printed\");\n    }\n}",
  "Evaluate": "public class Evaluate {\n    static long power(long x, int e) {\n        long result = 1;\n        while (e > 0) {\n            if (e % 2 == 1) result *= x;\n            x *= x;\n            e /= 2;\n        }\n        return result;\n    }\n\n    static long evaluate(Term p, long x) {\n        long sum = 0;\n        for (; p != null; p = p.next) sum += p.coefficient * power(x, p.exponent);\n        return sum;\n    }\n\n    public static void main(String[] args) {\n        Term p = LinkedPolynomial.of(4, 3, 2, 1, 1, 0);   // 4x^3 + 2x + 1\n        System.out.println(evaluate(p, 2) + \" \" + evaluate(p, -1) + \" \" + evaluate(null, 5));\n    }\n}",
  "IntersectByLength": "public class IntersectByLength {\n    static int length(Node p) {\n        int n = 0;\n        for (; p != null; p = p.next) n++;\n        return n;\n    }\n\n    static Node firstCommon(Node a, Node b) {\n        int m = length(a), n = length(b);\n        for (; m > n; m--) a = a.next;\n        for (; n > m; n--) b = b.next;\n        while (a != b) {\n            a = a.next;\n            b = b.next;\n        }\n        return a;                         // null if they never meet\n    }\n\n    public static void main(String[] args) {\n        Node c1 = new Node(\"c1\", new Node(\"c2\", null));\n        Node l1 = new Node(\"a1\", new Node(\"a2\", new Node(\"a3\", c1)));\n        Node l2 = new Node(\"b1\", new Node(\"b2\", c1));\n        System.out.println(firstCommon(l1, l2).label + \" \" + firstCommon(l1, new Node(\"d1\", null)));\n    }\n}",
  "CycleEntrance": "public class CycleEntrance {\n    static IntNode meet(IntNode head) {\n        IntNode slow = head, fast = head;\n        while (fast != null && fast.next != null) {\n            slow = slow.next;\n            fast = fast.next.next;\n            if (slow == fast) return slow;\n        }\n        return null;\n    }\n\n    static IntNode cycleEntrance(IntNode head) {\n        IntNode m = meet(head);\n        if (m == null) return null;\n        IntNode p = head;\n        while (p != m) {\n            p = p.next;\n            m = m.next;\n        }\n        return p;\n    }\n\n    static int cycleLength(IntNode head) {\n        IntNode m = meet(head);\n        if (m == null) return 0;\n        int len = 1;\n        for (IntNode p = m.next; p != m; p = p.next) len++;\n        return len;\n    }\n\n    public static void main(String[] args) {\n        int[][] cases = {{2, 6}, {0, 5}, {7, 3}, {4, 0}};\n        for (int[] tc : cases) {\n            IntNode head = Cycles.build(tc[0], tc[1]);\n            IntNode e = cycleEntrance(head);\n            System.out.println(\"tail \" + tc[0] + \", cycle \" + tc[1] + \": entrance \"\n                + (e == null ? \"none\" : \"node \" + e.data) + \", length \" + cycleLength(head));\n        }\n    }\n}",
  "SparseAdd": "public class SparseAdd {\n    static int compare(Triplet x, Triplet y) {\n        if (x.row != y.row) return Integer.compare(x.row, y.row);\n        return Integer.compare(x.col, y.col);\n    }\n\n    static Triplet[] add(Triplet[] a, Triplet[] b) {\n        Triplet[] out = new Triplet[a.length + b.length];\n        int i = 0, j = 0, k = 0;\n        while (i < a.length && j < b.length) {\n            int cmp = compare(a[i], b[j]);\n            if (cmp < 0) out[k++] = a[i++];\n            else if (cmp > 0) out[k++] = b[j++];\n            else {\n                int v = a[i].value + b[j].value;\n                if (v != 0) out[k++] = new Triplet(a[i].row, a[i].col, v);\n                i++;\n                j++;\n            }\n        }\n        while (i < a.length) out[k++] = a[i++];\n        while (j < b.length) out[k++] = b[j++];\n        return java.util.Arrays.copyOf(out, k);\n    }\n\n    public static void main(String[] args) {\n        Triplet[] a = TripletMatrix.toTriplets(new int[][] {{1, 0, 0}, {0, 0, 2}, {0, 3, 0}});\n        Triplet[] b = TripletMatrix.toTriplets(new int[][] {{0, 0, 4}, {0, 0, -2}, {5, 1, 0}});\n        StringBuilder sb = new StringBuilder();\n        for (Triplet t : add(a, b)) sb.append(\"(\" + t.row + \",\" + t.col + \",\" + t.value + \") \");\n        System.out.println(sb.toString().trim());\n    }\n}",
  "DedupSorted": "public class DedupSorted {\n    static void removeDuplicatesSorted(CharNode head) {\n        CharNode p = head;\n        while (p != null && p.next != null) {\n            if (p.next.data == p.data) p.next = p.next.next;   // skip the repeat, stay at p\n            else p = p.next;\n        }\n    }\n\n    public static void main(String[] args) {\n        CharNode l = CharNode.fromString(\"aabccc\");\n        removeDuplicatesSorted(l);\n        System.out.println(CharNode.toString(l));\n    }\n}",
  "RemoveAllRepeats": "public class RemoveAllRepeats {\n    static CharNode removeRepeated(CharNode head) {\n        int[] count = new int[26];\n        for (CharNode p = head; p != null; p = p.next) count[p.data - 'a']++;\n        CharNode dummy = new CharNode('?', head);\n        CharNode pre = dummy;\n        for (CharNode p = head; p != null; p = p.next) {\n            if (count[p.data - 'a'] > 1) pre.next = p.next;\n            else pre = p;\n        }\n        return dummy.next;\n    }\n\n    public static void main(String[] args) {\n        System.out.println(CharNode.toString(removeRepeated(CharNode.fromString(\"abbac\"))));\n        System.out.println(CharNode.toString(removeRepeated(CharNode.fromString(\"aab\"))));\n        System.out.println(CharNode.toString(removeRepeated(CharNode.fromString(\"aa\"))));\n    }\n}",
  "m_multPolynomial": "static void multPolynomial(ArrayPolynomial poly1, ArrayPolynomial poly2, ArrayPolynomial polyProd) {\n    zeroPolynomial(polyProd);\n    polyProd.highPower = poly1.highPower + poly2.highPower;\n    if (polyProd.highPower > MAX_DEGREE) {\n        throw new IllegalArgumentException(\"Exceed array size\");\n    }\n    for (int i = 0; i <= poly1.highPower; i++) {\n        for (int j = 0; j <= poly2.highPower; j++) {\n            polyProd.coeffArray[i + j] += poly1.coeffArray[i] * poly2.coeffArray[j];\n        }\n    }\n}",
  "m_add": "/** p + q. Both lists must be sorted by decreasing exponent; neither is changed. */\nstatic Term add(Term p, Term q) {\n    Term dummy = new Term(0, 0, null);\n    Term tail = dummy;\n    while (p != null && q != null) {\n        if (p.exponent > q.exponent) {\n            tail.next = new Term(p.coefficient, p.exponent, null);\n            p = p.next;\n        } else if (p.exponent < q.exponent) {\n            tail.next = new Term(q.coefficient, q.exponent, null);\n            q = q.next;\n        } else {\n            int c = p.coefficient + q.coefficient;\n            if (c != 0) {\n                tail.next = new Term(c, p.exponent, null);\n            }\n            p = p.next;\n            q = q.next;\n        }\n        if (tail.next != null) tail = tail.next;\n    }\n    for (Term rest = (p != null) ? p : q; rest != null; rest = rest.next) {\n        tail.next = new Term(rest.coefficient, rest.exponent, null);\n        tail = tail.next;\n    }\n    return dummy.next;\n}",
  "m_multiplyByTerm": "/** The single term (c x^e) times the polynomial q. */\nstatic Term multiplyByTerm(int c, int e, Term q) {\n    Term dummy = new Term(0, 0, null);\n    Term tail = dummy;\n    for (; q != null; q = q.next) {\n        tail.next = new Term(c * q.coefficient, e + q.exponent, null);\n        tail = tail.next;\n    }\n    return dummy.next;\n}",
  "m_multiply": "/** p * q: one partial product per term of p, merged into the result one by one. */\nstatic Term multiply(Term p, Term q) {\n    Term result = null;\n    for (; p != null; p = p.next) {\n        result = add(result, multiplyByTerm(p.coefficient, p.exponent, q));\n    }\n    return result;\n}",
  "m_toTriplets": "/** The non-zero entries of m, in row-major order. */\nstatic Triplet[] toTriplets(int[][] m) {\n    int count = 0;\n    for (int[] row : m) {\n        for (int v : row) {\n            if (v != 0) count++;\n        }\n    }\n    Triplet[] t = new Triplet[count];\n    int k = 0;\n    for (int r = 0; r < m.length; r++) {\n        for (int c = 0; c < m[r].length; c++) {\n            if (m[r][c] != 0) t[k++] = new Triplet(r, c, m[r][c]);\n        }\n    }\n    return t;\n}",
  "m_orthoGet": "/** Walk row r to column c. */\nint get(int r, int c) {\n    for (CrossNode p = rowHead[r]; p != null && p.col <= c; p = p.right) {\n        if (p.col == c) return p.value;\n    }\n    return 0;\n}",
  "m_orthoInsert": "/** Insert a new non-zero entry, keeping each row sorted by column and each column by row. */\nvoid insert(int r, int c, int value) {\n    CrossNode x = new CrossNode(r, c, value);\n    if (rowHead[r] == null || rowHead[r].col > c) {        // new first node of row r\n        x.right = rowHead[r];\n        rowHead[r] = x;\n    } else {\n        CrossNode p = rowHead[r];\n        while (p.right != null && p.right.col < c) p = p.right;\n        x.right = p.right;\n        p.right = x;\n    }\n    if (colHead[c] == null || colHead[c].row > r) {        // new first node of column c\n        x.down = colHead[c];\n        colHead[c] = x;\n    } else {\n        CrossNode p = colHead[c];\n        while (p.down != null && p.down.row < r) p = p.down;\n        x.down = p.down;\n        p.down = x;\n    }\n    nonZero++;\n}",
  "m_colToString": "String colToString(int c) {\n    StringBuilder sb = new StringBuilder(\"col \" + c + \":\");\n    for (CrossNode p = colHead[c]; p != null; p = p.down) {\n        sb.append(\" (\").append(p.row).append(\",\").append(p.col).append(\",\").append(p.value).append(\")\");\n    }\n    return sb.toString();\n}",
  "m_brute": "/** Method 1: compare every node of L1 with every node of L2. O(MN). */\nstatic Node firstCommonBrute(Node head1, Node head2) {\n    for (Node a = head1; a != null; a = a.next) {\n        for (Node b = head2; b != null; b = b.next) {\n            comparisons++;\n            if (a == b) return a;\n        }\n    }\n    return null;                       // no common node\n}",
  "m_switchHeads": "/** Method 2 (the slides' version): when a pointer reaches the end, jump to the other head. */\nstatic Node firstCommonSwitch(Node head1, Node head2) {\n    Node a = head1, b = head2;\n    while (true) {                      // loops forever if the lists do not intersect!\n        comparisons++;\n        if (a == b) return a;\n        a = (a.next == null) ? head2 : a.next;\n        b = (b.next == null) ? head1 : b.next;\n    }\n}",
  "m_safe": "/** Method 2, safe version: walks through null once, so it also stops when there is no common node. */\nstatic Node firstCommon(Node head1, Node head2) {\n    Node a = head1, b = head2;\n    while (a != b) {\n        comparisons++;\n        a = (a == null) ? head2 : a.next;\n        b = (b == null) ? head1 : b.next;\n    }\n    return a;                           // the first common node, or null\n}",
  "m_bounded": "/** Method 1: follow next at most limit times. Wrong if the list is longer than limit. */\nstatic boolean hasCycleBounded(IntNode head, int limit) {\n    IntNode p = head;\n    for (int i = 1; i <= limit; i++) {\n        if (p == null) return false;\n        p = p.next;\n    }\n    return true;                          // \"no null yet, so probably a cycle\"\n}",
  "m_hashSet": "/** Method 2: remember every node visited; a cycle shows up as a node seen twice. */\nstatic boolean hasCycleSet(IntNode head) {\n    java.util.Set<IntNode> seen = new java.util.HashSet<>();\n    for (IntNode p = head; p != null; p = p.next) {\n        if (!seen.add(p)) return true;    // add returns false if p was already there\n    }\n    return false;\n}",
  "m_floyd": "/** Method 3: Floyd's tortoise and hare. O(n) time, O(1) extra space. */\nstatic boolean hasCycle(IntNode head) {\n    IntNode slow = head, fast = head;\n    while (fast != null && fast.next != null) {\n        slow = slow.next;                 // one step\n        fast = fast.next.next;            // two steps\n        if (slow == fast) return true;    // compare after moving\n    }\n    return false;\n}",
  "m_slideBug": "// A literal translation of the slide: compare first, then move.\nstatic boolean hasCycleSlide(IntNode head) {\n    IntNode a = head, b = head;\n    while (b != null && b.next != null) {\n        if (a == b) return true;\n        a = a.next;\n        b = b.next.next;\n    }\n    return false;\n}",
  "m_naive": "/** Method 1: for each node, delete all later nodes with the same letter. O(M^2). */\nstatic void removeDuplicatesNaive(CharNode head) {\n    for (CharNode a = head; a != null; a = a.next) {\n        CharNode pre = a;\n        CharNode b = a.next;\n        while (b != null) {\n            if (b.data == a.data) {\n                pre.next = b.next;      // unlink b; pre stays\n            } else {\n                pre = b;\n            }\n            b = b.next;\n        }\n    }\n}",
  "m_table": "/** Method 2: remember which letters have been seen. O(M). */\nstatic void removeDuplicates(CharNode head) {\n    boolean[] seen = new boolean[26];   // all false at the start\n    CharNode pre = null;\n    for (CharNode a = head; a != null; a = a.next) {\n        int index = a.data - 'a';       // 'a' -> 0, 'b' -> 1, ..., 'z' -> 25\n        if (!seen[index]) {\n            seen[index] = true;\n            pre = a;                    // a stays\n        } else {\n            pre.next = a.next;          // a is a repeat: unlink it\n        }\n    }\n}",
};

const OUT = {
  "CircularDemo": "7 8 10 (back at the head)\n3 2 1 (walked backwards)",
  "ArrayPolyDemo": "P     = 4x^3 + 2x + 1\nQ     = 3x^2 + 5\nP + Q = 4x^3 + 3x^2 + 2x + 6\nP * Q = 12x^5 + 26x^3 + 3x^2 + 10x + 5",
  "SparsePolyCost": "inner-loop steps:  1992991\nuseful steps:      12\nuseful fraction:   0.0006%\ndegree of product: 2990",
  "LinkedPolyDemo": "P1      = 10x^1000 + 5x^14 + 1\nP2      = 3x^1990 - 2x^1492 + 11x + 5\nP1 + P2 = 3x^1990 - 2x^1492 + 10x^1000 + 5x^14 + 11x + 6\nP1 * P2 = 30x^2990 - 20x^2492 + 15x^2004 + 3x^1990 - 10x^1506 - 2x^1492 + 110x^1001 + 50x^1000 + 55x^15 + 25x^14 + 11x + 5\nterms in P1 * P2: 12\n(x + 1) + (x - 1) = 2x\n(x + 1) * (x - 1) = x^2 - 1",
  "TripletDemo": "row col value\n  0   4     9\n  1   1     8\n  2   0     4\n  2   3     2\n  3   5     5\n  4   2     2\nget(2, 3) = 2\nget(2, 2) = 0\n2D array: 30 ints; triplets: 18 ints",
  "LinkedMatrixDemo": "start -> (0,2,3) -> (0,4,4) -> (1,2,5) -> (1,3,7) -> (3,1,2) -> (3,2,6) -> null",
  "OrthogonalDemo": "5 x 4, 6 non-zero entries\nrow 0: (0,0,2)\nrow 1: (1,0,4) (1,3,3)\nrow 2:\nrow 3: (3,0,8) (3,3,1)\nrow 4: (4,2,6)\ncol 0: (0,0,2) (1,0,4) (3,0,8)\ncol 1:\ncol 2: (4,2,6)\ncol 3: (1,3,3) (3,3,1)\nget(3, 3) = 1, get(3, 2) = 0",
  "IntersectionDemo": "Method 1:      c1 after 15 comparisons\nMethod 2:      c1 after 8 comparisons\nMethod 2 safe: c1 after 8 pointer moves\nL1 and other:  null",
  "CycleDemo": "tail cycle | bounded(10) set   floyd  meet-step\n   5     0 | false       false false  -1\n   2     6 | true        true  true   6\n   0     5 | true        true  true   5\n   7     3 | true        true  true   9\n   3     4 | true        true  true   4\n50 nodes, no cycle: bounded(10) says true, floyd says false",
  "SlideCycleBug": "slide version: true\nhasCycle:      false",
  "DedupDemo": "abbac      naive: a -> b -> c -> null                table: a -> b -> c -> null\naaaa       naive: a -> null                          table: a -> null\nabcabcxyz  naive: a -> b -> c -> x -> y -> z -> null table: a -> b -> c -> x -> y -> z -> null\nz          naive: z -> null                          table: z -> null",
  "BoxedTable": "b[0] is null",
  "Evaluate": "37 -5 0",
  "IntersectByLength": "c1 null",
  "CycleEntrance": "tail 2, cycle 6: entrance node 2, length 6\ntail 0, cycle 5: entrance node 0, length 5\ntail 7, cycle 3: entrance node 7, length 3\ntail 4, cycle 0: entrance none, length 0",
  "SparseAdd": "(0,0,1) (0,2,4) (2,0,5) (2,1,4)",
  "DedupSorted": "a -> b -> c -> null",
  "RemoveAllRepeats": "c -> null\nb -> null\nnull",
};

// ---------- shared bits for this lecture ----------

(function injectStyle() {
  if (document.getElementById("l8-style")) return;
  const s = document.createElement("style");
  s.id = "l8-style";
  s.textContent = `
  .l8-view { overflow-x: auto; }
  .l8-view svg { display: block; width: 100%; height: auto; }
  .l8-lbl { font: 600 11px var(--mono); color: var(--stone); margin: 8px 0 4px; }
  .l8-chain { display: flex; flex-wrap: wrap; align-items: flex-end; gap: 6px 0; }
  .l8-col { display: flex; flex-direction: column; align-items: center; }
  .l8-ptr { font: 700 11px var(--mono); height: 15px; color: var(--teal); white-space: nowrap; }
  .l8-ptr .a2 { color: var(--amber); }
  .l8-ptr .r2 { color: var(--red); }
  .l8-node { border: 1.5px solid var(--line); border-radius: 7px; background: var(--card); padding: 4px 7px;
    font: 13px var(--mono); min-width: 30px; text-align: center; color: var(--ink); transition: background .2s, border-color .2s; }
  .l8-node.cur { border-color: var(--teal); background: var(--teal-soft); }
  .l8-node.hl { border-color: var(--amber); background: var(--mark); }
  .l8-node.ok { border-color: var(--green); background: var(--green-soft); }
  .l8-node.bad { border-color: var(--red); background: var(--red-soft); }
  .l8-node.gone { opacity: .35; text-decoration: line-through; }
  .l8-node.nul { border-style: dashed; color: var(--stone); background: transparent; }
  .l8-arr { color: var(--stone); padding: 0 3px 5px; font: 12px var(--mono); }
  .l8-arrays { display: grid; gap: 4px; }
  .l8-arow { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
  .l8-arow > b { font: 600 11px var(--mono); color: var(--stone); min-width: 92px; }
  .l8-cells { display: flex; flex-wrap: wrap; gap: 3px; }
  .l8-cell { width: 40px; border: 1.5px solid var(--line); border-radius: 6px; background: var(--card); text-align: center; font: 13px var(--mono); padding: 2px 0; }
  .l8-cell small { display: block; font-size: 9px; color: var(--stone); }
  .l8-cell.z { color: var(--stone); background: var(--paper-2); }
  .l8-cell.cur { border-color: var(--teal); background: var(--teal-soft); color: var(--ink); }
  .l8-cell.hl { border-color: var(--amber); background: var(--mark); color: var(--ink); }
  .l8-cell.bad { border-color: var(--red); background: var(--red-soft); }
  .l8-mat { border-collapse: collapse; margin: 4px 0; }
  .l8-mat td { padding: 2px; }
  .l8-mat input { width: 34px; height: 30px; text-align: center; font: 13px var(--mono); border: 1.5px solid var(--line);
    border-radius: 6px; background: var(--card); color: var(--ink); }
  .l8-mat input.nz { border-color: var(--teal); background: var(--teal-soft); }
  .l8-mat input.cur { border-color: var(--amber); background: var(--mark); }
  .l8-mat th { font: 10px var(--mono); color: var(--stone); font-weight: 500; }
  .l8-split { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 16px; align-items: start; }
  .l8-trip { border-collapse: collapse; font: 13px var(--mono); }
  .l8-trip th, .l8-trip td { border: 1px solid var(--line); padding: 2px 10px; text-align: right; }
  .l8-trip th { color: var(--stone); font-weight: 500; font-size: 11px; }
  .l8-trip tr.new td { background: var(--mark); }
  .l8-flags { display: flex; flex-wrap: wrap; gap: 2px; }
  .l8-flag { width: 18px; font: 11px var(--mono); text-align: center; border-radius: 4px; border: 1px solid var(--line); color: var(--stone); }
  .l8-flag.on { background: var(--green-soft); border-color: var(--green); color: var(--green); font-weight: 700; }
  .l8-flag.cur { outline: 2px solid var(--amber); }
  .l8-codebox { margin-top: 10px; }
  .l8-codebox summary { cursor: pointer; font: 600 12px var(--mono); color: var(--stone); }
  .l8-codebox pre.code { font-size: 13px; margin: 6px 0 0; }
  .l8-mini .l8-node { font-size: 12px; padding: 3px 5px; }
  .demo .controls label { max-width: 100%; min-width: 0; }
  .demo .controls select, .demo .controls input[type="text"] { min-width: 0; max-width: 100%; flex: 0 1 auto; }
  @media (max-width: 600px) {
    .l8-split { grid-template-columns: minmax(0, 1fr); }
    .l8-cell { width: 34px; }
    .l8-arow > b { min-width: 0; width: 100%; }
  }`;
  document.head.appendChild(s);
})();

// 1-based number of the first line of `code` that contains `needle`.
function lineOf(code, needle, after = 0) {
  const lines = code.split("\n");
  for (let k = after; k < lines.length; k++) if (lines[k].includes(needle)) return k + 1;
  return 0;
}

// Generic step player: build() -> snaps [{line, msg, msgCls, ...}], view(snap) -> html.
// opts: code (string | () => string), stats(snap) -> [[label, value, cls]], extraControls, onMount(root, rebuild), mini.
function l8Player(el, opts) {
  const mini = !!opts.mini;
  el.innerHTML = `<div class="svgbox l8-view${mini ? " l8-mini" : ""}"></div>
    ${mini ? "" : `<div class="stats l8-stats"></div><div class="msg l8-msg"></div>
    <div class="controls">
      <button class="cbtn l8-reset" title="Back to the start">⟲ Reset</button>
      <button class="cbtn l8-back" title="Step back (←)">◀ Back</button>
      <button class="cbtn l8-step on" title="Step (→)">Step ▶</button>
      <button class="cbtn l8-play">Play</button>
      <span class="spacer"></span><span class="counter l8-count"></span>
    </div>
    ${opts.extraControls ? `<div class="controls">${opts.extraControls}</div>` : ""}
    ${opts.code ? `<details class="l8-codebox" open><summary>Java (from the notes) — the highlighted line runs next</summary><div class="l8-code"></div></details>` : ""}`}`;
  const $ = (q) => el.querySelector(q);
  let snaps = [], i = 0, timer = null, codeLines = [];
  function renderCode() {
    if (mini || !opts.code) return;
    const code = typeof opts.code === "function" ? opts.code() : opts.code;
    $(".l8-code").innerHTML = codeBlock(code);
    codeLines = [...el.querySelectorAll(".l8-code .ln")];
  }
  function render() {
    const s = snaps[i];
    $(".l8-view").innerHTML = opts.view(s, mini);
    if (mini) return;
    codeLines.forEach((ln, k) => ln.classList.toggle("hl", k + 1 === s.line));
    $(".l8-stats").innerHTML = (opts.stats ? opts.stats(s) : []).map(([k, v, c]) =>
      `<div class="stat ${c || ""}"><small>${k}</small><b>${v}</b></div>`).join("");
    const m = $(".l8-msg");
    m.innerHTML = s.msg || "";
    m.className = "msg l8-msg " + (s.msgCls || "");
    $(".l8-count").textContent = `step ${i + 1} / ${snaps.length}`;
    $(".l8-back").disabled = $(".l8-reset").disabled = i === 0;
    $(".l8-step").disabled = i === snaps.length - 1;
  }
  function stop() { clearInterval(timer); timer = null; if (!mini) $(".l8-play").textContent = "Play"; }
  function play() {
    if (timer) return stop();
    if (i === snaps.length - 1) i = 0;
    if (!mini) $(".l8-play").textContent = "Pause";
    timer = setInterval(() => {
      if (i < snaps.length - 1) i++;
      else if (mini) i = 0;
      else return stop();
      render();
    }, mini ? (opts.miniSpeed || 900) : (opts.speed || 750));
  }
  function rebuild() {
    stop();
    renderCode();
    snaps = opts.build();
    i = 0;
    render();
  }
  if (!mini) {
    $(".l8-reset").onclick = () => { stop(); i = 0; render(); };
    $(".l8-back").onclick = () => { stop(); if (i > 0) i--; render(); };
    $(".l8-step").onclick = () => { stop(); if (i < snaps.length - 1) i++; render(); };
    $(".l8-play").onclick = play;
    el.tabIndex = 0;
    el.addEventListener("keydown", (e) => {
      if (["INPUT", "SELECT", "TEXTAREA"].includes(e.target.tagName)) return;
      if (e.key === "ArrowRight") { e.preventDefault(); $(".l8-step").click(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); $(".l8-back").click(); }
    });
    if (opts.onMount) opts.onMount(el, rebuild);
  }
  rebuild();
  if (mini) play();
  return { rebuild };
}

// A row of nodes. items: [{text, cls, ptr}], ends with an optional "null" box.
function chainHTML(items, { nul = true, arrow = "→" } = {}) {
  const parts = items.map((it, k) =>
    `<div class="l8-col"><div class="l8-ptr">${it.ptr || "&nbsp;"}</div><div class="l8-node ${it.cls || ""}">${esc(it.text)}</div></div>` +
    (k < items.length - 1 || nul ? `<span class="l8-arr">${arrow}</span>` : ""));
  if (nul) parts.push(`<div class="l8-col"><div class="l8-ptr">${items.nulPtr || "&nbsp;"}</div><div class="l8-node nul">null</div></div>`);
  if (!items.length && !nul) return `<div class="l8-chain"><span class="meta">(empty)</span></div>`;
  return `<div class="l8-chain">${parts.join("")}</div>`;
}

const svgDefs = (id) => `<defs>
  <marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="var(--ink-2)"/></marker>
  <marker id="${id}t" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="var(--teal)"/></marker>
</defs>`;
let svgSeq = 0;

// ---------- 1. four kinds of linked list ----------

function demoKinds(el, { mini = false, kind: kind0 = "singly" } = {}) {
  let kind = kind0;
  const data = [7, 8, 10];
  const addr = [100, 200, 300];
  function build() {
    const n = data.length, snaps = [];
    const circ = kind === "circular" || kind === "dcircular";
    const dbl = kind === "doubly" || kind === "dcircular";
    snaps.push({ p: null, msg: `head holds address <b>100</b>, the first node. ${{
      singly: "Each node stores its data and the address of the next node; the last <code>next</code> is <code>null</code>.",
      doubly: "Each node also stores the address of the previous node (<code>prev</code>).",
      circular: "The last node's <code>next</code> is 100 again: there is no <code>null</code> anywhere.",
      dcircular: "Circular both ways: the last <code>next</code> is the head, and the head's <code>prev</code> is the last node.",
    }[kind]}` });
    for (let k = 0; k < n; k++) snaps.push({ p: k, dir: 1, msg: `p = ${addr[k]}: visit <b>${data[k]}</b>, then p = p.next = ${k + 1 < n ? addr[k + 1] : circ ? "100" : "null"}.` });
    if (circ) snaps.push({ p: 0, dir: 1, msg: "p is back at the head: a circular traversal stops here (<code>while (p != head)</code> at the end of a <code>do</code>-<code>while</code>).", msgCls: "good" });
    else snaps.push({ p: n, dir: 1, msg: "p == null: the end of the list.", msgCls: "good" });
    if (dbl) {
      const from = circ ? n - 1 : n - 1;
      snaps.push({ p: from, dir: -1, msg: circ ? "Backwards: start at head.prev, which is the last node (300)." : "Backwards from the last node, following <code>prev</code>." });
      for (let k = from - 1; k >= 0; k--) snaps.push({ p: k, dir: -1, msg: `p = p.prev = ${addr[k]}: visit <b>${data[k]}</b>.` });
      snaps.push({ p: circ ? n - 1 : -1, dir: -1, msg: circ ? "p = head.prev again: back where we started." : "head.prev is null: the front of the list.", msgCls: "good" });
    }
    return snaps;
  }
  function view(s) {
    const id = "l8k" + (svgSeq++);
    const circ = kind === "circular" || kind === "dcircular";
    const dbl = kind === "doubly" || kind === "dcircular";
    const W = 720, H = circ ? 210 : 170, n = data.length;
    const nodeW = dbl ? 150 : 110, gap = (W - 120 - n * nodeW) / (n - 1), y = 60, h = 40;
    const x0 = (k) => 100 + k * (nodeW + gap);
    let g = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${kind} linked list">${svgDefs(id)}`;
    g += `<rect x="10" y="${y}" width="56" height="${h}" rx="6" fill="var(--mark)" stroke="var(--amber)"/><text x="38" y="${y + 17}" font-size="11" text-anchor="middle" fill="var(--ink-2)">head</text><text x="38" y="${y + 33}" font-size="13" text-anchor="middle" font-family="var(--mono)" fill="var(--ink)">100</text>`;
    g += `<line x1="66" y1="${y + h / 2}" x2="${x0(0) - 3}" y2="${y + h / 2}" stroke="var(--ink-2)" stroke-width="1.4" marker-end="url(#${id})"/>`;
    for (let k = 0; k < n; k++) {
      const x = x0(k), on = s.p === k;
      const fill = on ? "var(--teal-soft)" : "var(--card)", stroke = on ? "var(--teal)" : "var(--line)";
      const fields = dbl ? [["prev", k > 0 ? addr[k - 1] : circ ? addr[n - 1] : "null"], ["data", data[k]], ["next", k < n - 1 ? addr[k + 1] : circ ? addr[0] : "null"]]
        : [["data", data[k]], ["next", k < n - 1 ? addr[k + 1] : circ ? addr[0] : "null"]];
      const fw = nodeW / fields.length;
      fields.forEach(([lab, v], f) => {
        g += `<rect x="${x + f * fw}" y="${y}" width="${fw}" height="${h}" fill="${lab === "data" ? fill : "var(--paper-2)"}" stroke="${stroke}" stroke-width="${on ? 2 : 1.2}"/>`;
        g += `<text x="${x + f * fw + fw / 2}" y="${y + 25}" font-size="${lab === "data" ? 15 : 12}" font-weight="${lab === "data" ? 700 : 400}" text-anchor="middle" font-family="var(--mono)" fill="var(${lab === "data" ? "--ink" : "--stone"})">${v}</text>`;
      });
      g += `<text x="${x + nodeW / 2}" y="${y + h + 16}" font-size="11" text-anchor="middle" fill="var(--stone)">address ${addr[k]}</text>`;
      if (k < n - 1) {
        g += `<line x1="${x + nodeW}" y1="${y + 12}" x2="${x0(k + 1) - 3}" y2="${y + 12}" stroke="var(--ink-2)" stroke-width="1.4" marker-end="url(#${id})"/>`;
        if (dbl) g += `<line x1="${x0(k + 1)}" y1="${y + h - 10}" x2="${x + nodeW + 3}" y2="${y + h - 10}" stroke="var(--ink-2)" stroke-width="1.4" marker-end="url(#${id})"/>`;
      }
      if (on) g += `<text x="${x + nodeW / 2}" y="${y - 10}" font-size="13" font-weight="700" text-anchor="middle" fill="var(--teal)">p ${s.dir < 0 ? "← prev" : "↓"}</text>`;
    }
    if (circ) {
      const xl = x0(n - 1) + nodeW, xf = x0(0);
      g += `<path d="M ${xl - 10} ${y + h} L ${xl - 10} ${H - 18} L ${xf + 18} ${H - 18} L ${xf + 18} ${y + h + 3}" fill="none" stroke="var(--teal)" stroke-width="1.5" marker-end="url(#${id}t)"/>`;
      g += `<text x="${(xl + xf) / 2}" y="${H - 24}" font-size="11" text-anchor="middle" fill="var(--teal)">last.next = head${dbl ? "  ·  head.prev = last" : ""}</text>`;
    } else if (s.p === n) {
      g += `<text x="${x0(n - 1) + nodeW / 2 + 40}" y="${y - 10}" font-size="13" font-weight="700" text-anchor="middle" fill="var(--green)">p = null</text>`;
    } else if (s.p === -1) {
      g += `<text x="${x0(0) + 20}" y="${y - 10}" font-size="13" font-weight="700" text-anchor="middle" fill="var(--green)">p = null</text>`;
    }
    return g + "</svg>";
  }
  l8Player(el, {
    mini, build, view, miniSpeed: 800,
    extraControls: `<label>kind <select class="k-kind">
      <option value="singly">singly linked</option><option value="doubly">doubly linked</option>
      <option value="circular">circular</option><option value="dcircular">doubly circular</option></select></label>`,
    stats: (s) => [["kind", { singly: "singly", doubly: "doubly", circular: "circular", dcircular: "doubly circ." }[kind]], ["p", s.p === null ? "head" : s.p === data.length || s.p === -1 ? "null" : addr[s.p]]],
    onMount(root, rebuild) {
      const sel = root.querySelector(".k-kind");
      sel.value = kind;
      sel.onchange = () => { kind = sel.value; rebuild(); };
    },
  });
}

// ---------- 2. polynomials ----------

// "4x^3 + 2x + 1" -> [[4, 3], [2, 1], [1, 0]] (coefficient, exponent), highest exponent first, no zero terms.
function parsePoly(text, fallback) {
  const s = String(text).replace(/\s+/g, "").replace(/X/g, "x").replace(/\*\*/g, "^");
  if (!s) return fallback;
  const parts = s.match(/[+-]?[^+-]+/g);
  if (!parts || parts.join("") !== s.replace(/^\+/, "") && parts.join("") !== s) return fallback;
  const byExp = new Map();
  for (const p of parts) {
    const m = p.match(/^([+-]?)(\d*)(x(?:\^(\d+))?)?$/);
    if (!m || (!m[2] && !m[3])) return fallback;
    const c = (m[1] === "-" ? -1 : 1) * (m[2] ? +m[2] : 1);
    const e = m[3] ? (m[4] ? +m[4] : 1) : 0;
    byExp.set(e, (byExp.get(e) || 0) + c);
  }
  return [...byExp.entries()].filter(([, c]) => c !== 0).sort((a, b) => b[0] - a[0]).map(([e, c]) => [c, e]);
}

// Same output as LinkedPolynomial.toString / ArrayPolynomial.toString.
function fmtPoly(terms) {
  if (!terms.length) return "0";
  let s = "";
  for (const [c, e] of terms) {
    if (s) s += c < 0 ? " - " : " + ";
    else if (c < 0) s += "-";
    const a = Math.abs(c);
    if (a !== 1 || e === 0) s += a;
    if (e >= 1) s += "x";
    if (e >= 2) s += "^" + e;
  }
  return s;
}
const fmtTerm = ([c, e]) => `${c}, ${e}`;

// JS twin of LinkedPolynomial.add; records each step for the merge demo.
function mergeTerms(P, Q, snaps, code) {
  const out = [];
  let i = 0, j = 0, cmp = 0;
  const L = (n) => lineOf(code, n);
  const snap = (line, msg, extra = {}) => snaps && snaps.push({ i, j, out: out.slice(), line, msg, cmp, ...extra });
  snap(L("Term tail = dummy"), "Start with an empty result (just the dummy node); <code>p</code> and <code>q</code> point at the two fronts.");
  while (i < P.length && j < Q.length) {
    cmp++;
    const [pc, pe] = P[i], [qc, qe] = Q[j];
    if (pe > qe) { out.push([pc, pe]); snap(L("if (p.exponent > q.exponent)"), `${pe} &gt; ${qe}: copy <b>${fmtPoly([[pc, pe]])}</b> from P and advance <code>p</code>.`, { last: out.length - 1, pi: i, qj: j }); i++; }
    else if (pe < qe) { out.push([qc, qe]); snap(L("} else if (p.exponent < q.exponent)"), `${pe} &lt; ${qe}: copy <b>${fmtPoly([[qc, qe]])}</b> from Q and advance <code>q</code>.`, { last: out.length - 1, pi: i, qj: j }); j++; }
    else {
      const c = pc + qc;
      if (c !== 0) { out.push([c, pe]); snap(L("int c = p.coefficient"), `Equal exponents ${pe}: ${pc} + ${qc} = ${c}. Append <b>${fmtPoly([[c, pe]])}</b>; advance both.`, { last: out.length - 1, pi: i, qj: j }); }
      else snap(L("if (c != 0)"), `Equal exponents ${pe}: ${pc} + ${qc} = 0. Nothing is appended (no zero terms); advance both.`, { msgCls: "bad", pi: i, qj: j });
      i++; j++;
    }
    // Show the pointers after they moved.
    if (snaps) { const s = snaps[snaps.length - 1]; s.i = i; s.j = j; }
  }
  const restP = i < P.length;
  while (i < P.length || j < Q.length) {
    const t = restP ? P[i++] : Q[j++];
    out.push(t);
    snap(L("for (Term rest"), `${restP ? "Q" : "P"} is used up: copy the rest of ${restP ? "P" : "Q"}, <b>${fmtPoly([t])}</b>.`, { last: out.length - 1 });
  }
  snap(L("return dummy.next"), `Result: <b>${esc(fmtPoly(out))}</b> — ${cmp} comparison${cmp === 1 ? "" : "s"} for ${P.length + Q.length} input terms.`, { msgCls: "good", done: true });
  return { out, cmp };
}

function demoPolyMerge(el, { mini = false } = {}) {
  const P0 = "10x^1000 + 5x^14 + 1", Q0 = "3x^1990 - 2x^1492 + 11x + 5";
  let P = parsePoly(P0), Q = parsePoly(Q0);
  const code = CODE.m_add;
  l8Player(el, {
    mini, code, miniSpeed: 1000,
    build: () => { const snaps = []; mergeTerms(P, Q, snaps, code); return snaps; },
    view: (s) => {
      const row = (T, k, name) => T.map((t, x) => ({ text: fmtTerm(t), cls: x < k ? "gone" : x === k ? "cur" : "", ptr: x === k ? name : "" }));
      const pr = row(P, s.i, "p"); if (s.i >= P.length) pr.nulPtr = "p";
      const qr = row(Q, s.j, "q"); if (s.j >= Q.length) qr.nulPtr = "q";
      const res = s.out.map((t, x) => ({ text: fmtTerm(t), cls: x === s.last ? "hl" : "ok", ptr: x === s.out.length - 1 ? "tail" : "" }));
      return `<div class="l8-lbl">P (coefficient, exponent)</div>${chainHTML(pr)}
        <div class="l8-lbl">Q</div>${chainHTML(qr)}
        <div class="l8-lbl">result = P + Q</div>${chainHTML([{ text: "dummy", cls: "nul", ptr: s.out.length ? "" : "tail" }, ...res], { nul: false })}`;
    },
    stats: (s) => [["comparisons", s.cmp], ["terms in result", s.out.length]],
    extraControls: `<label>P <input type="text" class="pm-p" value="${P0}" style="width:210px"></label>
      <label>Q <input type="text" class="pm-q" value="${Q0}" style="width:230px"></label>`,
    onMount(root, rebuild) {
      const fix = (inp, cur, def) => { const v = parsePoly(inp.value, null); if (!v) { inp.value = fmtPoly(cur); return cur; } return v.length ? v : parsePoly(def); };
      root.querySelector(".pm-p").onchange = (e) => { P = fix(e.target, P, P0); rebuild(); };
      root.querySelector(".pm-q").onchange = (e) => { Q = fix(e.target, Q, Q0); rebuild(); };
    },
  });
}

function demoPolyArray(el) {
  let P = parsePoly("4x^3 + 2x + 1"), Q = parsePoly("3x^2 + 5");
  const code = CODE.m_multPolynomial;
  const dense = (T) => { const h = T.length ? T[0][1] : 0; const a = Array(h + 1).fill(0); T.forEach(([c, e]) => { a[e] = c; }); return a; };
  function build() {
    const a = dense(P), b = dense(Q), h1 = a.length - 1, h2 = b.length - 1;
    const prod = Array(h1 + h2 + 1).fill(0);
    const snaps = [];
    let steps = 0, useful = 0;
    snaps.push({ a, b, prod: prod.slice(), steps, useful, line: lineOf(code, "polyProd.highPower = poly1"), msg: `<code>zeroPolynomial</code> clears all slots; <code>polyProd.highPower</code> = ${h1} + ${h2} = ${h1 + h2}.` });
    for (let i = 0; i <= h1; i++) {
      for (let j = 0; j <= h2; j++) {
        steps++;
        const v = a[i] * b[j];
        const waste = a[i] === 0 || b[j] === 0;
        if (!waste) useful++;
        prod[i + j] += v;
        snaps.push({ a, b, prod: prod.slice(), i, j, steps, useful, waste, line: lineOf(code, "polyProd.coeffArray[i + j] +="),
          msg: `i = ${i}, j = ${j}: coeffArray[${i + j}] += ${a[i]} · ${b[j]} = ${v}.${waste ? " <b>Wasted</b>: one factor is 0." : ""}`, msgCls: waste ? "bad" : "" });
      }
    }
    const res = prod.map((c, e) => [c, e]).filter(([c]) => c).reverse();
    snaps.push({ a, b, prod: prod.slice(), steps, useful, line: 0, done: true,
      msg: `P · Q = <b>${esc(fmtPoly(res))}</b>. ${steps} inner steps, only ${useful} with two non-zero factors.`, msgCls: "good" });
    return snaps;
  }
  const cells = (arr, cur, cls) => `<div class="l8-cells">${arr.map((v, k) =>
    `<div class="l8-cell ${k === cur ? cls : v === 0 ? "z" : ""}"><small>[${k}]</small>${v}</div>`).join("")}</div>`;
  l8Player(el, {
    code, build, speed: 600,
    view: (s) => `<div class="l8-arrays">
      <div class="l8-arow"><b>poly1 (i)</b>${cells(s.a, s.i, s.waste && s.a[s.i] === 0 ? "bad" : "cur")}</div>
      <div class="l8-arow"><b>poly2 (j)</b>${cells(s.b, s.j, s.waste && s.b[s.j] === 0 ? "bad" : "cur")}</div>
      <div class="l8-arow"><b>polyProd (i+j)</b>${cells(s.prod, s.i === undefined ? -1 : s.i + s.j, "hl")}</div></div>`,
    stats: (s) => [["inner steps", s.steps], ["useful", s.useful, "good"], ["wasted on zeros", s.steps - s.useful, s.steps - s.useful ? "bad" : ""]],
    extraControls: `<label>P <input type="text" class="pa-p" value="4x^3 + 2x + 1" style="width:150px"></label>
      <label>Q <input type="text" class="pa-q" value="3x^2 + 5" style="width:150px"></label><span class="meta">degree ≤ 7 here</span>`,
    onMount(root, rebuild) {
      const read = (inp, cur) => { const v = parsePoly(inp.value, null); if (!v || !v.length || v[0][1] > 7 || v.some(([, e]) => e < 0)) { inp.value = fmtPoly(cur); return cur; } return v; };
      root.querySelector(".pa-p").onchange = (e) => { P = read(e.target, P); rebuild(); };
      root.querySelector(".pa-q").onchange = (e) => { Q = read(e.target, Q); rebuild(); };
    },
  });
}

function demoPolyMult(el) {
  let P = parsePoly("4x^3 + 2x + 1"), Q = parsePoly("3x^2 + 5");
  const code = CODE.m_multiply;
  function build() {
    const snaps = [];
    let result = [], merges = 0;
    snaps.push({ k: -1, part: [], result: [], merges, line: lineOf(code, "Term result = null"), msg: "<code>result</code> starts empty (<code>null</code>, the zero polynomial)." });
    P.forEach(([c, e], k) => {
      const part = Q.map(([qc, qe]) => [c * qc, e + qe]);
      snaps.push({ k, part, result, merges, line: lineOf(code, "result = add(result"), stage: "part",
        msg: `Term ${k + 1} of P is ${esc(fmtPoly([[c, e]]))}. <code>multiplyByTerm</code> gives ${esc(fmtPoly(part))}: coefficients × ${c}, exponents + ${e}. Still sorted.` });
      const r = mergeTerms(result, part, null, CODE.m_add);
      merges += r.cmp;
      result = r.out;
      snaps.push({ k, part, result, merges, line: lineOf(code, "result = add(result"), stage: "merged",
        msg: `<code>add(result, partial)</code> merges it in (${r.cmp} comparison${r.cmp === 1 ? "" : "s"}). result = ${esc(fmtPoly(result))}.` });
    });
    snaps.push({ k: P.length, part: [], result, merges, line: lineOf(code, "return result"), done: true, msgCls: "good",
      msg: `P · Q = <b>${esc(fmtPoly(result))}</b>: ${P.length} × ${Q.length} = ${P.length * Q.length} term products and ${merges} merge comparisons.` });
    return snaps;
  }
  const arrSteps = () => (P[0][1] + 1) * (Q[0][1] + 1);
  l8Player(el, {
    code, build,
    view: (s) => `<div class="l8-lbl">P</div>${chainHTML(P.map((t, k) => ({ text: fmtTerm(t), cls: k === s.k ? "cur" : k < s.k ? "gone" : "", ptr: k === s.k ? "p" : "" })))}
      <div class="l8-lbl">Q</div>${chainHTML(Q.map((t) => ({ text: fmtTerm(t) })))}
      <div class="l8-lbl">partial = multiplyByTerm(p.coefficient, p.exponent, q)</div>${s.part.length ? chainHTML(s.part.map((t) => ({ text: fmtTerm(t), cls: s.stage === "part" ? "hl" : "" }))) : `<div class="meta">—</div>`}
      <div class="l8-lbl">result</div>${s.result.length ? chainHTML(s.result.map((t) => ({ text: fmtTerm(t), cls: s.stage === "merged" ? "ok" : "" }))) : `<div class="meta">null</div>`}`,
    stats: (s) => [["terms in result", s.result.length], ["merge comparisons", s.merges], ["array version steps", arrSteps().toLocaleString("en-US")]],
    extraControls: `<label>P <input type="text" class="pmu-p" value="4x^3 + 2x + 1" style="width:190px"></label>
      <label>Q <input type="text" class="pmu-q" value="3x^2 + 5" style="width:210px"></label>
      <button class="cbtn pmu-slide">Slides' P1 · P2</button>`,
    onMount(root, rebuild) {
      const pi = root.querySelector(".pmu-p"), qi = root.querySelector(".pmu-q");
      const read = (inp, cur) => { const v = parsePoly(inp.value, null); if (!v || !v.length) { inp.value = fmtPoly(cur); return cur; } return v; };
      pi.onchange = () => { P = read(pi, P); rebuild(); };
      qi.onchange = () => { Q = read(qi, Q); rebuild(); };
      root.querySelector(".pmu-slide").onclick = () => {
        pi.value = "10x^1000 + 5x^14 + 1"; qi.value = "3x^1990 - 2x^1492 + 11x + 5";
        P = parsePoly(pi.value); Q = parsePoly(qi.value); rebuild();
      };
    },
  });
}

// ---------- 3. sparse matrices ----------

const MAT14 = [[0, 0, 0, 0, 9, 0], [0, 8, 0, 0, 0, 0], [4, 0, 0, 2, 0, 0], [0, 0, 0, 0, 0, 5], [0, 0, 2, 0, 0, 0]];
const MAT15 = [[0, 0, 3, 0, 4], [0, 0, 5, 7, 0], [0, 0, 0, 0, 0], [0, 2, 6, 0, 0]];
const MAT16 = [[2, 0, 0, 0], [4, 0, 0, 3], [0, 0, 0, 0], [8, 0, 0, 1], [0, 0, 6, 0]];

function demoTriplets(el, { mini = false } = {}) {
  let M = MAT14.map((r) => r.slice());
  const code = CODE.m_toTriplets;
  function build() {
    const snaps = [];
    const R = M.length, C = M[0].length;
    const t = M.flat().filter((v) => v).length;
    const trip = [];
    snaps.push({ trip: [], cur: null, line: lineOf(code, "Triplet[] t = new Triplet[count]"), msg: `First pass: count the non-zero entries, <b>t = ${t}</b>, and allocate <code>new Triplet[${t}]</code>.` });
    for (let r = 0; r < R; r++) {
      for (let c = 0; c < C; c++) {
        const v = M[r][c];
        if (v) trip.push([r, c, v]);
        snaps.push({ trip: trip.slice(), cur: [r, c], added: !!v, line: lineOf(code, "if (m[r][c] != 0) t[k++]"),
          msg: v ? `m[${r}][${c}] = ${v}: store the triplet <b>(${r}, ${c}, ${v})</b>.` : `m[${r}][${c}] = 0: skip.` });
      }
    }
    snaps.push({ trip, cur: null, line: lineOf(code, "return t;"), done: true, msgCls: "good",
      msg: `${t} triplets in row-major order: ${3 * t} ints instead of ${R} × ${C} = ${R * C}.` });
    return snaps;
  }
  function view(s) {
    const R = M.length, C = M[0].length;
    let tb = `<table class="l8-mat"><tr><th></th>${M[0].map((_, c) => `<th>${c}</th>`).join("")}</tr>`;
    for (let r = 0; r < R; r++) {
      tb += `<tr><th>${r}</th>` + M[r].map((v, c) => {
        const cur = s.cur && s.cur[0] === r && s.cur[1] === c;
        return `<td><input ${mini ? "disabled" : ""} data-r="${r}" data-c="${c}" value="${v}" class="${cur ? "cur" : v ? "nz" : ""}" inputmode="numeric" aria-label="m[${r}][${c}]"></td>`;
      }).join("") + "</tr>";
    }
    tb += "</table>";
    if (mini) return `<div class="l8-split">${tb}<div>${tripTable(s)}</div></div>`;
    const chain = chainHTML(s.trip.map((x, k) => ({ text: `${x[0]},${x[1]},${x[2]}`, cls: s.added && k === s.trip.length - 1 ? "hl" : "ok" })));
    return `<div class="l8-split"><div><div class="l8-lbl">matrix m (edit any cell)</div>${tb}</div><div><div class="l8-lbl">triplet array</div>${tripTable(s)}</div></div>
      <div class="l8-lbl">the same triplets as a linked list (Section 3.3)</div>${chain}`;
  }
  const tripTable = (s) => `<table class="l8-trip"><tr><th>row</th><th>col</th><th>value</th></tr>${s.trip.map((x, k) =>
    `<tr class="${s.added && k === s.trip.length - 1 ? "new" : ""}"><td>${x[0]}</td><td>${x[1]}</td><td>${x[2]}</td></tr>`).join("") || `<tr><td colspan="3" style="text-align:center;color:var(--stone)">—</td></tr>`}</table>`;
  const p = l8Player(el, {
    mini, code, build, view, speed: 450, miniSpeed: 350,
    stats: (s) => { const R = M.length, C = M[0].length, t = M.flat().filter((v) => v).length; return [["2D array ints", R * C], ["non-zeros t", t], ["triplet ints", 3 * t, 3 * t < R * C ? "good" : "bad"]]; },
    extraControls: `<button class="cbtn tr-a">Slide 14 matrix</button><button class="cbtn tr-b">Slide 15 matrix</button><button class="cbtn tr-r">Random sparse</button><button class="cbtn tr-z">All zero</button>`,
    onMount(root, rebuild) {
      const set = (m) => { M = m.map((r) => r.slice()); rebuild(); };
      root.querySelector(".tr-a").onclick = () => set(MAT14);
      root.querySelector(".tr-b").onclick = () => set(MAT15);
      root.querySelector(".tr-z").onclick = () => set(M.map((r) => r.map(() => 0)));
      root.querySelector(".tr-r").onclick = () => set(Array.from({ length: 5 }, () => Array.from({ length: 6 }, () => (Math.random() < 0.18 ? 1 + Math.floor(Math.random() * 9) : 0))));
      root.addEventListener("change", (e) => {
        const t = e.target;
        if (t.tagName !== "INPUT" || t.dataset.r === undefined) return;
        const v = parseInt(t.value, 10);
        M[+t.dataset.r][+t.dataset.c] = Number.isFinite(v) ? Math.max(-99, Math.min(99, v)) : 0;
        rebuild();
      });
    },
  });
  return p;
}

function parseMatrix(text, fallback) {
  const rows = String(text).split(/[;\n]/).map((r) => r.trim()).filter(Boolean).map((r) => r.split(/[\s,]+/).map(Number));
  if (!rows.length || rows.length > 6 || rows.some((r) => r.length !== rows[0].length || r.length > 6 || r.some((x) => !Number.isFinite(x)))) return fallback;
  return rows.map((r) => r.map((x) => Math.trunc(x)));
}

function demoOrtho(el) {
  let M = MAT16.map((r) => r.slice());
  let mode = "get", qr = 3, qc = 2;
  function build() {
    const snaps = [];
    const R = M.length, C = M[0].length;
    if (mode === "get") {
      const code = CODE.m_orthoGet;
      const row = M[qr].map((v, c) => [c, v]).filter(([, v]) => v);
      snaps.push({ vis: null, line: lineOf(code, "for (CrossNode p = rowHead[r]"), msg: `<code>get(${qr}, ${qc})</code>: start at <code>rowHead[${qr}]</code>${row.length ? "" : ", which is <code>null</code>: row " + qr + " has no non-zero entries"}.` });
      for (const [c, v] of row) {
        if (c > qc) {
          snaps.push({ vis: [qr, c], line: lineOf(code, "for (CrossNode p = rowHead[r]"), msg: `Column ${c} &gt; ${qc}: the entries are sorted by column, so (${qr}, ${qc}) is not stored. Stop.`, msgCls: "bad" });
          break;
        }
        if (c === qc) { snaps.push({ vis: [qr, c], found: true, line: lineOf(code, "if (p.col == c) return p.value"), msg: `Column ${c} == ${qc}: return <b>${v}</b>.`, msgCls: "good" }); return snaps; }
        snaps.push({ vis: [qr, c], line: lineOf(code, "if (p.col == c) return p.value"), msg: `Node (${qr}, ${c}, ${v}): column ${c} &lt; ${qc}, follow <code>right</code>.` });
      }
      snaps.push({ vis: null, line: lineOf(code, "return 0;"), msg: `Not found: <code>get(${qr}, ${qc})</code> returns <b>0</b>.`, msgCls: "good" });
    } else {
      const code = CODE.m_colToString;
      const col = M.map((r, rr) => [rr, r[qc]]).filter(([, v]) => v);
      snaps.push({ vis: null, line: lineOf(code, "for (CrossNode p = colHead[c]"), msg: `Walk column ${qc}: start at <code>colHead[${qc}]</code>${col.length ? "" : " = <code>null</code>"}.` });
      col.forEach(([rr, v], k) => snaps.push({ vis: [rr, qc], line: lineOf(code, "sb.append(\" (\")"), msg: `Visit (${rr}, ${qc}, ${v}); then follow <code>down</code>${k === col.length - 1 ? ", which is <code>null</code>" : ""}.` }));
      snaps.push({ vis: null, line: lineOf(code, "return sb.toString()"), done: true, msgCls: "good", msg: `Column ${qc} has ${col.length} non-zero entr${col.length === 1 ? "y" : "ies"}: ${col.length} step${col.length === 1 ? "" : "s"}, not ${R}.` });
    }
    return snaps;
  }
  function view(s) {
    const id = "l8o" + (svgSeq++);
    const R = M.length, C = M[0].length;
    const cw = Math.min(120, 630 / C), W = 90 + C * cw, ch = 58, H = 50 + R * ch + 16;
    const nx = (c) => 90 + c * cw + cw / 2, ny = (r) => 50 + r * ch + ch / 2;
    const nw = Math.min(84, cw - 22), nh = 30;
    let g = `<svg viewBox="0 0 ${W} ${H}" style="min-width:${Math.round(W * 0.8)}px" role="img" aria-label="orthogonal list">${svgDefs(id)}`;
    for (let c = 0; c < C; c++) {
      const on = mode === "col" && c === qc;
      g += `<rect x="${nx(c) - 26}" y="6" width="52" height="24" rx="5" fill="${on ? "var(--mark)" : "var(--paper)"}" stroke="${on ? "var(--amber)" : "var(--stone)"}"/><text x="${nx(c)}" y="22" font-size="11" text-anchor="middle" font-family="var(--mono)" fill="var(--ink-2)">col ${c}</text>`;
      const rs = M.map((r, rr) => [rr, r[c]]).filter(([, v]) => v).map(([rr]) => rr);
      let y = 30;
      rs.forEach((rr) => { g += `<line x1="${nx(c) + 10}" y1="${y}" x2="${nx(c) + 10}" y2="${ny(rr) - nh / 2 - 2}" stroke="var(--sea)" stroke-width="1.3" marker-end="url(#${id}t)"/>`; y = ny(rr) + nh / 2; });
    }
    for (let r = 0; r < R; r++) {
      const on = mode === "get" && r === qr;
      g += `<rect x="6" y="${ny(r) - 12}" width="54" height="24" rx="5" fill="${on ? "var(--mark)" : "var(--paper)"}" stroke="${on ? "var(--amber)" : "var(--stone)"}"/><text x="33" y="${ny(r) + 4}" font-size="11" text-anchor="middle" font-family="var(--mono)" fill="var(--ink-2)">row ${r}</text>`;
      const cs = M[r].map((v, c) => [c, v]).filter(([, v]) => v).map(([c]) => c);
      let x = 60;
      cs.forEach((c) => { g += `<line x1="${x}" y1="${ny(r) - 6}" x2="${nx(c) - nw / 2 - 2}" y2="${ny(r) - 6}" stroke="var(--ink-2)" stroke-width="1.3" marker-end="url(#${id})"/>`; x = nx(c) + nw / 2; });
    }
    for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) {
      const v = M[r][c];
      if (!v) continue;
      const vis = s.vis && s.vis[0] === r && s.vis[1] === c;
      const fill = vis ? (s.found ? "var(--green-soft)" : "var(--mark)") : "var(--card)";
      const st = vis ? (s.found ? "var(--green)" : "var(--amber)") : "var(--teal)";
      g += `<rect x="${nx(c) - nw / 2}" y="${ny(r) - nh / 2}" width="${nw}" height="${nh}" rx="6" fill="${fill}" stroke="${st}" stroke-width="${vis ? 2.2 : 1.3}"/>`;
      g += `<text x="${nx(c)}" y="${ny(r) + 5}" font-size="${nw < 60 ? 11 : 14}" text-anchor="middle" font-family="var(--mono)" fill="var(--ink)">${r},${c},${v}</text>`;
    }
    if (mode === "get") g += `<rect x="${nx(qc) - nw / 2 - 4}" y="${ny(qr) - nh / 2 - 4}" width="${nw + 8}" height="${nh + 8}" rx="8" fill="none" stroke="var(--amber)" stroke-dasharray="4 3"/>`;
    g += `<text x="${W - 6}" y="${H - 4}" font-size="10" text-anchor="end" fill="var(--stone)">black → right (same row) · teal ↓ down (same column)</text>`;
    return g + "</svg>";
  }
  const sel = (cls, n, v) => `<select class="${cls}">${Array.from({ length: n }, (_, k) => `<option${k === v ? " selected" : ""}>${k}</option>`).join("")}</select>`;
  l8Player(el, {
    code: () => (mode === "get" ? CODE.m_orthoGet : CODE.m_colToString), build, view,
    stats: () => [["matrix", `${M.length} × ${M[0].length}`], ["non-zeros", M.flat().filter((v) => v).length]],
    extraControls: `<label>do <select class="or-mode"><option value="get">get(r, c)</option><option value="col">walk column c</option></select></label>
      <label>r <span class="or-rs">${sel("or-r", M.length, qr)}</span></label><label>c <span class="or-cs">${sel("or-c", M[0].length, qc)}</span></label>
      <label>matrix <input type="text" class="or-m" value="${MAT16.map((r) => r.join(" ")).join("; ")}" style="width:220px"></label>`,
    onMount(root, rebuild) {
      const hook = () => {
        root.querySelector(".or-r").onchange = (e) => { qr = +e.target.value; rebuild(); };
        root.querySelector(".or-c").onchange = (e) => { qc = +e.target.value; rebuild(); };
      };
      hook();
      root.querySelector(".or-mode").onchange = (e) => { mode = e.target.value; root.querySelector(".or-r").disabled = mode === "col"; rebuild(); };
      root.querySelector(".or-m").onchange = (e) => {
        M = parseMatrix(e.target.value, M);
        e.target.value = M.map((r) => r.join(" ")).join("; ");
        qr = Math.min(qr, M.length - 1); qc = Math.min(qc, M[0].length - 1);
        root.querySelector(".or-rs").innerHTML = sel("or-r", M.length, qr);
        root.querySelector(".or-cs").innerHTML = sel("or-c", M[0].length, qc);
        hook(); rebuild();
      };
    },
  });
}

// ---------- 4. intersection ----------

function demoIntersect(el, { mini = false, method: m0 = "switch" } = {}) {
  let X = 3, Y = 2, Z = 2, method = m0;
  // Node ids: a0.., b0.., c0..; "n1"/"n2" are the nulls after L1/L2 (one shared "nc" when Z > 0).
  function nextOf(id) {
    const [t, k] = [id[0], +id.slice(1)];
    if (t === "a") return k + 1 < X ? "a" + (k + 1) : Z ? "c0" : "n1";
    if (t === "b") return k + 1 < Y ? "b" + (k + 1) : Z ? "c0" : "n2";
    if (t === "c") return k + 1 < Z ? "c" + (k + 1) : "nc";
    return null;
  }
  const isNull = (id) => id[0] === "n";
  const head1 = () => (X ? "a0" : Z ? "c0" : "n1");
  const head2 = () => (Y ? "b0" : Z ? "c0" : "n2");
  const label = (id) => (isNull(id) ? "null" : id[0] + (+id.slice(1) + 1));
  const code = () => CODE[{ brute: "m_brute", switch: "m_switchHeads", safe: "m_safe" }[method]];
  function build() {
    const c = code(), snaps = [];
    let cmp = 0;
    const s = (a, b, line, msg, extra = {}) => snaps.push({ a, b, cmp, line: lineOf(c, line), msg, ...extra });
    const M = X + Z, N = Y + Z;
    if (method === "brute") {
      for (let a = head1(); !isNull(a); a = nextOf(a)) {
        for (let b = head2(); !isNull(b); b = nextOf(b)) {
          cmp++;
          if (a === b) { s(a, b, "if (a == b) return a", `a and b are the <b>same node</b>, ${label(a)}: return it. ${cmp} comparisons (worst case M·N = ${M * N}).`, { hit: true, msgCls: "good" }); return snaps; }
          s(a, b, "if (a == b) return a", `Compare ${label(a)} with ${label(b)}: different nodes.`);
        }
      }
      s(null, null, "return null", `No pair matched: the lists share no node. ${cmp} = M·N comparisons.`, { msgCls: "good" });
      return snaps;
    }
    let a = head1(), b = head2();
    if (method === "switch") {
      const cap = 3 * (M + N) + 4;
      while (true) {
        cmp++;
        if (a === b) { s(a, b, "if (a == b) return a", `a == b: both point at <b>${label(a)}</b>, the first common node. ${cmp} comparisons (≤ M + N = ${M + N}).`, { hit: true, msgCls: "good" }); return snaps; }
        s(a, b, "if (a == b) return a", `Compare: a is at ${label(a)}, b at ${label(b)}: different.`);
        if (cmp > cap) { s(a, b, "while (true)", "Still going round: these lists share no node, and the slides' version <b>never stops</b>. Use the safe version.", { msgCls: "bad" }); return snaps; }
        const na = nextOf(a), nb = nextOf(b);
        const ja = isNull(na), jb = isNull(nb);
        a = ja ? head2() : na;
        b = jb ? head1() : nb;
        if (ja || jb) s(a, b, "a = (a.next == null)", `${ja ? "a reached the end of L1 and jumps to the head of L2" : ""}${ja && jb ? "; " : ""}${jb ? "b reached the end of L2 and jumps to the head of L1" : ""}.`);
      }
    }
    // safe: every null is the same value
    const same = (u, v) => u === v || (isNull(u) && isNull(v));
    while (!same(a, b)) {
      cmp++;
      const na = isNull(a) ? head2() : nextOf(a);
      const nb = isNull(b) ? head1() : nextOf(b);
      const msg = `a: ${label(a)} → ${label(na)}${isNull(a) ? " (jump to the head of L2)" : ""}; b: ${label(b)} → ${label(nb)}${isNull(b) ? " (jump to the head of L1)" : ""}.`;
      a = na; b = nb;
      s(a, b, "while (a != b)", msg);
    }
    s(a, b, "return a", isNull(a) ? `Both are <code>null</code> at the same moment: no common node. ${cmp} moves = M + N + 1.` : `a == b == <b>${label(a)}</b>: the first common node, after ${cmp} moves.`, { hit: !isNull(a), msgCls: "good" });
    return snaps;
  }
  function view(s) {
    const id = "l8i" + (svgSeq++);
    const P = Math.max(X, Y), cols = P + Z + 1;
    const W = 720, cw = Math.min(70, (W - 70) / cols), nw = Math.min(52, cw - 12), H = 220;
    const pos = {};
    for (let k = 0; k < X; k++) pos["a" + k] = [60 + (P - X + k) * cw, 50];
    for (let k = 0; k < Y; k++) pos["b" + k] = [60 + (P - Y + k) * cw, 170];
    for (let k = 0; k < Z; k++) pos["c" + k] = [60 + (P + k) * cw + 10, 110];
    if (Z) pos.nc = [60 + (P + Z) * cw + 10, 110];
    else { pos.n1 = [60 + P * cw, 50]; pos.n2 = [60 + P * cw, 170]; }
    let g = `<svg viewBox="0 0 ${Math.max(400, 60 + cols * cw + 30)} ${H}" style="min-width:${mini ? 0 : 380}px" role="img" aria-label="two intersecting lists">${svgDefs(id)}`;
    const cx = (k) => pos[k][0] + nw / 2;
    g += `<text x="8" y="${54}" font-size="13" font-weight="700" fill="var(--ink-2)">L1</text><text x="8" y="${174}" font-size="13" font-weight="700" fill="var(--ink-2)">L2</text>`;
    const edge = (u, v) => {
      if (!pos[u] || !pos[v]) return;
      const [x1, y1] = pos[u], [x2, y2] = pos[v];
      g += `<line x1="${x1 + nw}" y1="${y1}" x2="${x2 - 3}" y2="${y2}" stroke="var(--ink-2)" stroke-width="1.3" marker-end="url(#${id})"/>`;
    };
    const h1 = head1(), h2 = head2();
    g += `<line x1="30" y1="50" x2="${pos[h1][0] - 3}" y2="${pos[h1][1]}" stroke="var(--teal)" stroke-width="1.3" marker-end="url(#${id}t)"/>`;
    g += `<line x1="30" y1="170" x2="${pos[h2][0] - 3}" y2="${pos[h2][1]}" stroke="var(--teal)" stroke-width="1.3" marker-end="url(#${id}t)"/>`;
    Object.keys(pos).forEach((k) => { if (!isNull(k)) edge(k, nextOf(k)); });
    Object.entries(pos).forEach(([k, [x, y]]) => {
      const nul = isNull(k), sh = k[0] === "c";
      const on = s.a === k || s.b === k;
      const fill = s.hit && on ? "var(--green-soft)" : nul ? "none" : sh ? "var(--mark)" : "var(--card)";
      const st = s.hit && on ? "var(--green)" : on ? "var(--teal)" : sh ? "var(--amber)" : "var(--line)";
      g += `<rect x="${x}" y="${y - 15}" width="${nw}" height="30" rx="6" fill="${fill}" stroke="${st}" stroke-width="${on ? 2.2 : 1.3}" ${nul ? 'stroke-dasharray="4 3"' : ""}/>`;
      g += `<text x="${x + nw / 2}" y="${y + 5}" font-size="${nul ? 10 : 13}" text-anchor="middle" font-family="var(--mono)" fill="var(${nul ? "--stone" : "--ink"})">${label(k)}</text>`;
    });
    const mark = (k, txt, col, dy) => { if (!k || !pos[k]) return; g += `<text x="${cx(k)}" y="${pos[k][1] + dy}" font-size="13" font-weight="700" text-anchor="middle" fill="${col}">${txt}</text>`; };
    if (s.a === s.b && s.a) mark(s.a, "a = b", "var(--green)", -22);
    else { mark(s.a, "a", "var(--red)", -22); mark(s.b, "b", "var(--teal)", 32); }
    return g + "</svg>";
  }
  const range = (cls, v, min) => `<input type="range" class="${cls}" min="${min}" max="6" value="${v}"> <b class="${cls}v mono">${v}</b>`;
  l8Player(el, {
    mini, code, build, view, speed: 700,
    stats: (s) => [["M (L1)", X + Z], ["N (L2)", Y + Z], [method === "safe" ? "moves" : "comparisons", s.cmp], ["bound", method === "brute" ? `M·N = ${(X + Z) * (Y + Z)}` : `M+N = ${X + Y + 2 * Z}`]],
    extraControls: `<label>method <select class="in-m"><option value="brute">1: every pair</option><option value="switch">2: switch heads (slides)</option><option value="safe">2: safe version</option></select></label>
      <label>L1 private ${range("in-x", X, 0)}</label><label>L2 private ${range("in-y", Y, 0)}</label><label>shared ${range("in-z", Z, 0)}</label>`,
    onMount(root, rebuild) {
      const m = root.querySelector(".in-m");
      m.value = method;
      m.onchange = () => { method = m.value; rebuild(); };
      [["in-x", (v) => { X = v; }], ["in-y", (v) => { Y = v; }], ["in-z", (v) => { Z = v; }]].forEach(([cls, set]) => {
        root.querySelector("." + cls).oninput = (e) => {
          set(+e.target.value); root.querySelector(`.${cls}v`).textContent = e.target.value;
          if (X + Z === 0) { X = 1; root.querySelector(".in-x").value = 1; root.querySelector(".in-xv").textContent = 1; }
          if (Y + Z === 0) { Y = 1; root.querySelector(".in-y").value = 1; root.querySelector(".in-yv").textContent = 1; }
          rebuild();
        };
      });
    },
  });
}

// ---------- 5. cycle detection ----------

function demoCycle(el, { mini = false, method: m0 = "floyd" } = {}) {
  let T = 2, Xc = 6, method = m0, limit = 6;
  const n = () => T + Xc;
  const nxt = (i) => (i === null ? null : i + 1 < n() ? i + 1 : Xc > 0 ? T : null);
  const code = () => CODE[{ floyd: "m_floyd", bug: "m_slideBug", set: "m_hashSet", bounded: "m_bounded" }[method]];
  function build() {
    const c = code(), snaps = [];
    const L = (needle) => lineOf(c, needle);
    let step = 0;
    if (method === "floyd" || method === "bug") {
      let slow = 0, fast = 0;
      const s = (line, msg, extra = {}) => snaps.push({ slow, fast, step, line: L(line), msg, ...extra });
      s(method === "floyd" ? "IntNode slow = head, fast = head" : "IntNode a = head, b = head", "Both pointers start at the head (node 0).");
      while (fast !== null && nxt(fast) !== null) {
        if (method === "bug") {
          if (slow === fast) { s("if (a == b) return true", `The slides' order: compare <b>before</b> moving. a == b already (both at the head), so it returns <b>true</b> — ${Xc ? "right by luck" : "<b>wrong</b>: this list has no cycle"}.`, { meet: true, msgCls: Xc ? "" : "bad" }); return snaps; }
        }
        slow = nxt(slow); fast = nxt(nxt(fast)); step++;
        if (method === "floyd" && slow === fast) { s("if (slow == fast) return true", `Step ${step}: slow and fast are both at node ${slow}. <b>Cycle!</b>`, { meet: true, msgCls: "good" }); return snaps; }
        s(method === "floyd" ? "fast = fast.next.next" : "b = b.next.next", `Step ${step}: slow → node ${slow}, fast → ${fast === null ? "null" : "node " + fast}.${slow !== null && fast !== null && slow >= T && fast >= T && Xc ? ` Both on the cycle; fast is ${((slow - fast) % Xc + Xc) % Xc} behind.` : ""}`);
      }
      s("return false", `fast${fast === null ? "" : ".next"} is null: the hare found the end. <b>No cycle.</b>`, { msgCls: "good", end: true });
      return snaps;
    }
    if (method === "set") {
      const seen = new Set();
      let p = 0;
      const s = (line, msg, extra = {}) => snaps.push({ p, seen: new Set(seen), step, line: L(line), msg, ...extra });
      s("java.util.Set<IntNode> seen", "An empty hash set; p starts at the head.");
      while (p !== null) {
        if (seen.has(p)) { s("if (!seen.add(p)) return true", `Node ${p} is already in the set: we have gone round. <b>Cycle!</b> (set size ${seen.size})`, { meet: true, msgCls: "good" }); return snaps; }
        seen.add(p); step++;
        s("if (!seen.add(p)) return true", `Add node ${p} to the set (size ${seen.size}).`);
        p = nxt(p);
      }
      s("return false", `p is null: <b>no cycle</b>. The set holds all ${seen.size} nodes: O(n) extra memory.`, { msgCls: "good", end: true });
      return snaps;
    }
    // bounded
    let p = 0;
    const s = (line, msg, extra = {}) => snaps.push({ p, step, line: L(line), msg, ...extra });
    s("IntNode p = head", `Follow <code>next</code> at most limit = ${limit} times.`);
    for (let i = 1; i <= limit; i++) {
      if (p === null) { s("if (p == null) return false", "Reached null: <b>acyclic</b>.", { msgCls: "good", end: true }); return snaps; }
      p = nxt(p); step++;
      s("p = p.next", `i = ${i}: p → ${p === null ? "null" : "node " + p}.`);
    }
    const right = Xc > 0;
    s("return true", `No null within ${limit} steps, so it answers <b>cyclic</b> — ${right ? "correct this time" : `<b>wrong</b>: the list has ${n()} nodes and no cycle; the limit was too small`}.`, { msgCls: right ? "" : "bad", meet: right });
    return snaps;
  }
  function view(s) {
    const id = "l8c" + (svgSeq++);
    const N = n(), W = 720;
    const pos = [];
    const R = Xc ? Math.max(48, (Xc * 52) / (2 * Math.PI)) : 0;
    const H = Xc ? 2 * R + 110 : 150, cy = H / 2 + 6;
    const step = Math.min(58, (W - 60 - 2 * R - 40) / Math.max(T, 1));
    for (let i = 0; i < T; i++) pos.push([40 + i * step, cy]);
    const ex = 40 + T * step, ccx = ex + R;
    for (let k = 0; k < Xc; k++) { const th = Math.PI + (k * 2 * Math.PI) / Xc; pos.push([ccx + R * Math.cos(th), cy + R * Math.sin(th)]); }
    const VW = Math.max(400, Xc ? ccx + R + 44 : pos[N - 1][0] + 100);
    let g = `<svg viewBox="0 0 ${VW} ${H}" role="img" aria-label="linked list with tail ${T} and cycle ${Xc}">${svgDefs(id)}`;
    const r = 17;
    const seg = (a, b, col) => {
      const [x1, y1] = a, [x2, y2] = b, d = Math.hypot(x2 - x1, y2 - y1) || 1;
      const ux = (x2 - x1) / d, uy = (y2 - y1) / d;
      g += `<line x1="${x1 + ux * r}" y1="${y1 + uy * r}" x2="${x2 - ux * (r + 2)}" y2="${y2 - uy * (r + 2)}" stroke="${col}" stroke-width="1.4" marker-end="url(#${id}${col.includes("teal") ? "t" : ""})"/>`;
    };
    for (let i = 0; i < N; i++) {
      const j = nxt(i);
      if (j !== null) seg(pos[i], pos[j], i >= T && Xc ? "var(--teal)" : "var(--ink-2)");
    }
    if (!Xc) {
      const last = pos[N - 1];
      g += `<line x1="${last[0] + r}" y1="${cy}" x2="${last[0] + 44}" y2="${cy}" stroke="var(--ink-2)" stroke-width="1.4" marker-end="url(#${id})"/><text x="${last[0] + 50}" y="${cy + 4}" font-size="12" fill="var(--stone)">null</text>`;
    }
    pos.forEach(([x, y], i) => {
      const inSet = s.seen && s.seen.has(i);
      const isS = s.slow === i || s.p === i, isF = s.fast === i && s.p === undefined;
      const meet = s.meet && (isS || isF);
      const fill = meet ? "var(--green-soft)" : inSet ? "var(--teal-soft)" : i >= T ? "var(--mark)" : "var(--card)";
      const st = meet ? "var(--green)" : isS || isF ? "var(--ink)" : i >= T ? "var(--amber)" : "var(--line)";
      g += `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${st}" stroke-width="${isS || isF ? 2.4 : 1.3}"/><text x="${x}" y="${y + 4}" font-size="12" text-anchor="middle" font-family="var(--mono)" fill="var(--ink)">${i}</text>`;
    });
    if (Xc) g += `<text x="${pos[T][0] - 4}" y="${pos[T][1] + 34}" font-size="10" text-anchor="end" fill="var(--amber)">entrance</text>`;
    g += `<text x="40" y="22" font-size="11" fill="var(--stone)">head = node 0 · tail t = ${T} · cycle x = ${Xc}</text>`;
    const lab = (i, txt, col, up) => {
      if (i === null || i === undefined) return;
      const [x, y] = pos[i];
      const out = y < cy - 1 ? -1 : y > cy + 1 ? 1 : up ? -1 : 1;
      g += `<text x="${x}" y="${y + out * 30 + (out > 0 ? 6 : 0)}" font-size="12" font-weight="700" text-anchor="middle" fill="${col}">${txt}</text>`;
    };
    if (s.p !== undefined) lab(s.p, "p", "var(--teal)", true);
    else if (s.slow === s.fast) lab(s.slow, method === "bug" ? "a=b" : "S=F", "var(--green)", true);
    else { lab(s.slow, method === "bug" ? "a" : "slow", "var(--amber)", true); lab(s.fast, method === "bug" ? "b" : "fast", "var(--teal)", false); }
    const nulTxt = (s.fast === null || s.p === null) ? `<text x="${VW - 10}" y="22" font-size="12" text-anchor="end" fill="var(--teal)">${s.p === null ? "p" : "fast"} = null</text>` : "";
    return g + nulTxt + "</svg>";
  }
  const meetStep = () => (Xc ? Xc * Math.max(1, Math.ceil(T / Xc)) : "—");
  l8Player(el, {
    mini, code, build, view, speed: 700, miniSpeed: 800,
    stats: (s) => [["steps", s.step], ["n nodes", n()], method === "set" ? ["set size", s.seen ? s.seen.size : 0] : method === "bounded" ? ["limit", limit] : ["Floyd meets at step", meetStep()]],
    extraControls: `<label>method <select class="cy-m"><option value="floyd">3: Floyd (move, then compare)</option><option value="bug">3 as on the slide</option><option value="set">2: hash set</option><option value="bounded">1: bounded walk</option></select></label>
      <label>tail t <input type="range" class="cy-t" min="0" max="8" value="${T}"> <b class="cy-tv mono">${T}</b></label>
      <label>cycle x <input type="range" class="cy-x" min="0" max="10" value="${Xc}"> <b class="cy-xv mono">${Xc}</b></label>
      <label class="cy-lw" style="display:none">limit <input type="range" class="cy-l" min="1" max="20" value="${limit}"> <b class="cy-lv mono">${limit}</b></label>`,
    onMount(root, rebuild) {
      const m = root.querySelector(".cy-m");
      m.value = method;
      m.onchange = () => { method = m.value; root.querySelector(".cy-lw").style.display = method === "bounded" ? "" : "none"; rebuild(); };
      const hook = (cls, set) => { root.querySelector("." + cls).oninput = (e) => { set(+e.target.value); root.querySelector(`.${cls}v`).textContent = e.target.value; rebuild(); }; };
      hook("cy-t", (v) => { T = v; if (T + Xc === 0) { T = 1; root.querySelector(".cy-t").value = 1; } });
      hook("cy-x", (v) => { Xc = v; if (T + Xc === 0) { Xc = 1; root.querySelector(".cy-x").value = 1; } });
      hook("cy-l", (v) => { limit = v; });
    },
  });
}

// ---------- 6. duplicate letters ----------

function demoDedup(el, { mini = false, method: m0 = "table" } = {}) {
  let word = "abbac", method = m0;
  const code = () => (method === "table" ? CODE.m_table : CODE.m_naive);
  function build() {
    const c = code(), snaps = [], L = (x) => lineOf(c, x);
    const s0 = word.split("");
    const next = s0.map((_, k) => (k + 1 < s0.length ? k + 1 : null));
    const gone = new Set();
    let ops = 0;
    const snap = (ptr, line, msg, extra = {}) => snaps.push({ ptr, gone: new Set(gone), line: L(line), msg, ops, ...extra });
    if (method === "table") {
      const seen = new Set();
      let pre = null;
      snap({}, "boolean[] seen = new boolean[26]", "<code>seen</code> starts all <code>false</code>; <code>pre</code> = null.", { seen: new Set(seen) });
      for (let a = 0; a !== null; a = next[a]) {
        ops++;
        const ch = s0[a];
        if (!seen.has(ch)) {
          seen.add(ch); pre = a;
          snap({ a, pre }, "seen[index] = true", `'${ch}' − 'a' = ${ch.charCodeAt(0) - 97}: not seen yet. Mark it and keep the node (pre = this node).`, { seen: new Set(seen), cur: ch });
        } else {
          next[pre] = next[a]; gone.add(a);
          snap({ a, pre }, "pre.next = a.next", `'${ch}' was seen before: <code>pre.next = a.next</code> unlinks this node.`, { seen: new Set(seen), cur: ch, msgCls: "bad" });
        }
      }
      snap({}, "pre.next = a.next", `Done in one pass: ${ops} node${ops === 1 ? "" : "s"} looked at. Result: <b>${s0.filter((_, k) => !gone.has(k)).join(" → ")} → null</b>.`, { seen: new Set(seen), msgCls: "good", line: 0 });
      snaps[snaps.length - 1].line = 0;
      return snaps;
    }
    snap({}, "for (CharNode a = head", "For each node a, delete every later node with the same letter.");
    for (let a = 0; a !== null; a = next[a]) {
      let pre = a, b = next[a];
      if (b === null) snap({ a }, "while (b != null)", `a = '${s0[a]}' is the last node: nothing after it.`);
      while (b !== null) {
        ops++;
        if (s0[b] === s0[a]) {
          next[pre] = next[b]; gone.add(b);
          snap({ a, b, pre }, "pre.next = b.next", `'${s0[b]}' == '${s0[a]}': unlink b. <code>pre</code> stays.`, { msgCls: "bad" });
        } else {
          snap({ a, b, pre }, "pre = b", `'${s0[b]}' ≠ '${s0[a]}': keep it; pre moves to b.`);
          pre = b;
        }
        b = next[b];
      }
    }
    snap({}, "", `Done: ${ops} comparisons (≤ M(M−1)/2 = ${(s0.length * (s0.length - 1)) / 2}). Result: <b>${s0.filter((_, k) => !gone.has(k)).join(" → ")} → null</b>.`, { msgCls: "good" });
    snaps[snaps.length - 1].line = 0;
    return snaps;
  }
  function view(s) {
    const s0 = word.split("");
    const items = s0.map((ch, k) => {
      const tags = [];
      if (s.ptr.a === k) tags.push(`<span class="a2">a</span>`);
      if (s.ptr.b === k) tags.push("b");
      if (s.ptr.pre === k) tags.push(`<span class="r2">pre</span>`);
      return { text: ch, ptr: tags.join(" "), cls: s.gone.has(k) ? "gone" : s.ptr.b === k || (method === "table" && s.ptr.a === k) ? "cur" : s.ptr.a === k ? "hl" : "" };
    });
    let h = `<div class="l8-lbl">the list (struck-out nodes are unlinked)</div>${chainHTML(items)}`;
    h += `<div class="l8-lbl">after: ${s0.filter((_, k) => !s.gone.has(k)).join(" → ")} → null</div>`;
    if (method === "table" && s.seen && !mini) {
      h += `<div class="l8-lbl">boolean[] seen (index = letter − 'a')</div><div class="l8-flags">${"abcdefghijklmnopqrstuvwxyz".split("").map((ch) =>
        `<span class="l8-flag ${s.seen.has(ch) ? "on" : ""} ${s.cur === ch ? "cur" : ""}">${ch}</span>`).join("")}</div>`;
    }
    return h;
  }
  l8Player(el, {
    mini, code, build, view, speed: 700, miniSpeed: 900,
    stats: (s) => [["M nodes", word.length], [method === "table" ? "nodes looked at" : "comparisons", s.ops], ["removed", s.gone.size]],
    extraControls: `<label>method <select class="dd-m"><option value="table">2: boolean[26], O(M)</option><option value="naive">1: all later nodes, O(M²)</option></select></label>
      <label>letters <input type="text" class="dd-w" value="${word}" maxlength="16" style="width:150px"></label>`,
    onMount(root, rebuild) {
      const m = root.querySelector(".dd-m");
      m.value = method;
      m.onchange = () => { method = m.value; rebuild(); };
      root.querySelector(".dd-w").onchange = (e) => {
        const w = e.target.value.toLowerCase().replace(/[^a-z]/g, "").slice(0, 16);
        word = w || "abbac"; e.target.value = word; rebuild();
      };
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

// Demo registry: data-demo="name" in chapters.js mounts DEMOS[name].
const DEMOS = {
  kinds: (el) => demoKinds(el),
  kindsMini: (el) => demoKinds(el, { mini: true, kind: "circular" }),
  polyArray: (el) => demoPolyArray(el),
  polyMerge: (el) => demoPolyMerge(el),
  polyMergeMini: (el) => demoPolyMerge(el, { mini: true }),
  polyMult: (el) => demoPolyMult(el),
  triplets: (el) => demoTriplets(el),
  tripletsMini: (el) => demoTriplets(el, { mini: true }),
  ortho: (el) => demoOrtho(el),
  intersect: (el) => demoIntersect(el),
  intersectMini: (el) => demoIntersect(el, { mini: true }),
  cycle: (el) => demoCycle(el),
  cycleMini: (el) => demoCycle(el, { mini: true }),
  dedup: (el) => demoDedup(el),
  dedupMini: (el) => demoDedup(el, { mini: true }),
  quiz: (el) => demoQuiz(el, QUIZ),
};
