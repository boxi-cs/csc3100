// Generated from notes/L14-binary-search-trees.md: every Java block (by class name) and its output.
const CODE = {
  Node: `class Node {
    int key;
    Node left;     // left child, or null
    Node right;    // right child, or null
    Node parent;   // parent, or null for the root

    Node(int key) {
        this.key = key;
    }
}`,
  Trees: `class Trees {
    /** A BST built by inserting the keys in this order (see Section 5). */
    static Node build(int... keys) {
        Node root = null;
        for (int k : keys) {
            root = add(root, null, k);
        }
        return root;
    }

    /** Insert key into the subtree x, whose parent is parent; return the new subtree. */
    static Node add(Node x, Node parent, int key) {
        if (x == null) {
            Node n = new Node(key);
            n.parent = parent;
            return n;
        }
        if (key < x.key) {
            x.left = add(x.left, x, key);
        } else {
            x.right = add(x.right, x, key);
        }
        return x;
    }

    /** A node with the given children, built by hand (no ordering is checked). */
    static Node make(int key, Node left, Node right) {
        Node n = new Node(key);
        n.left = left;
        n.right = right;
        if (left != null) {
            left.parent = n;
        }
        if (right != null) {
            right.parent = n;
        }
        return n;
    }

    /** The tree on one line: key(left,right), "-" for an empty child. */
    static String shape(Node x) {
        if (x == null) {
            return "-";
        }
        if (x.left == null && x.right == null) {
            return String.valueOf(x.key);
        }
        return x.key + "(" + shape(x.left) + "," + shape(x.right) + ")";
    }

    /** The keys in in-order (left subtree, node, right subtree), separated by spaces. */
    static String inorder(Node x) {
        StringBuilder sb = new StringBuilder();
        inorder(x, sb);
        return sb.toString().trim();
    }

    private static void inorder(Node x, StringBuilder sb) {
        if (x != null) {
            inorder(x.left, sb);
            sb.append(x.key).append(' ');
            inorder(x.right, sb);
        }
    }

    /** Height in edges: -1 for the empty tree, 0 for a single node. */
    static int height(Node x) {
        if (x == null) {
            return -1;
        }
        return 1 + Math.max(height(x.left), height(x.right));
    }
}`,
  BstCheck: `class BstCheck {
    /** Is every key in the subtree x strictly between low and high? */
    static boolean isBst(Node x, long low, long high) {
        if (x == null) {
            return true;
        }
        if (x.key <= low || x.key >= high) {
            return false;
        }
        return isBst(x.left, low, x.key) && isBst(x.right, x.key, high);
    }

    static boolean isBst(Node root) {
        return isBst(root, Long.MIN_VALUE, Long.MAX_VALUE);
    }

    /** WRONG: only compares each node with its own children. */
    static boolean childrenInOrder(Node x) {
        if (x == null) {
            return true;
        }
        if (x.left != null && x.left.key >= x.key) {
            return false;
        }
        if (x.right != null && x.right.key <= x.key) {
            return false;
        }
        return childrenInOrder(x.left) && childrenInOrder(x.right);
    }
}`,
  IsItABst: `public class IsItABst {
    public static void main(String[] args) {
        Node a = Trees.build(8, 3, 10, 1, 6, 14, 4, 7, 13);
        Node b = Trees.make(8,
                Trees.make(6, Trees.make(1, null, null),
                        Trees.make(4, Trees.make(3, null, null), Trees.make(7, null, null))),
                Trees.make(10, null, Trees.make(14, Trees.make(13, null, null), null)));
        System.out.println("tree a: " + Trees.shape(a));
        System.out.println("  children in order: " + BstCheck.childrenInOrder(a)
                + ", is a BST: " + BstCheck.isBst(a));
        System.out.println("  in-order: " + Trees.inorder(a));
        System.out.println("tree b: " + Trees.shape(b));
        System.out.println("  children in order: " + BstCheck.childrenInOrder(b)
                + ", is a BST: " + BstCheck.isBst(b));
        System.out.println("  in-order: " + Trees.inorder(b));
        Node c = Trees.make(10,
                Trees.make(5, Trees.make(2, null, null), Trees.make(12, null, null)),
                Trees.make(15, null, null));
        System.out.println("tree c: " + Trees.shape(c));
        System.out.println("  children in order: " + BstCheck.childrenInOrder(c)
                + ", is a BST: " + BstCheck.isBst(c));
        System.out.println("  in-order: " + Trees.inorder(c));
    }
}`,
  TreeSetDemo: `import java.util.TreeSet;

public class TreeSetDemo {
    public static void main(String[] args) {
        TreeSet<Integer> set = new TreeSet<>();
        for (int k : new int[] {15, 6, 18, 3, 7, 17, 20, 2, 4, 13, 9}) {
            set.add(k);
        }
        System.out.println(set);                       // in-order
        System.out.println("contains(13): " + set.contains(13));   // search
        System.out.println("first: " + set.first() + ", last: " + set.last());   // min, max
        System.out.println("higher(15): " + set.higher(15));   // successor
        System.out.println("lower(15): " + set.lower(15));     // predecessor
        System.out.println("higher(20): " + set.higher(20));   // no successor
        set.remove(6);
        System.out.println("after remove(6): " + set);
    }
}`,
  BstSearch: `class BstSearch {
    /** The node with key k in the subtree x, or null. */
    static Node find(Node x, int k) {
        if (x == null || k == x.key) {
            return x;
        }
        if (k < x.key) {
            return find(x.left, k);
        } else {
            return find(x.right, k);
        }
    }

    /** The same search with a loop instead of recursion. */
    static Node findIterative(Node x, int k) {
        while (x != null && k != x.key) {
            if (k < x.key) {
                x = x.left;
            } else {
                x = x.right;
            }
        }
        return x;
    }
}`,
  SearchDemo: `public class SearchDemo {
    static void trace(Node x, int k) {
        StringBuilder path = new StringBuilder("find " + k + ": ");
        while (x != null && k != x.key) {
            path.append(x.key).append(" -> ");
            x = (k < x.key) ? x.left : x.right;
        }
        path.append(x == null ? "null, not found" : x.key + ", found");
        System.out.println(path);
    }

    public static void main(String[] args) {
        Node root = Trees.build(15, 6, 18, 3, 7, 17, 20, 2, 4, 13, 9);
        trace(root, 13);
        trace(root, 17);
        trace(root, 5);
        trace(root, 15);
        System.out.println(BstSearch.find(root, 9).parent.key);
        System.out.println(BstSearch.findIterative(root, 10));
    }
}`,
  BstMinMax: `class BstMinMax {
    /** The node with the smallest key in the non-empty subtree x. */
    static Node findMin(Node x) {
        while (x.left != null) {
            x = x.left;
        }
        return x;
    }

    /** The node with the largest key in the non-empty subtree x. */
    static Node findMax(Node x) {
        while (x.right != null) {
            x = x.right;
        }
        return x;
    }
}`,
  MinMaxDemo: `public class MinMaxDemo {
    public static void main(String[] args) {
        Node root = Trees.build(15, 6, 18, 3, 7, 17, 20, 2, 4, 13, 9);
        System.out.println("min = " + BstMinMax.findMin(root).key);
        System.out.println("max = " + BstMinMax.findMax(root).key);
        Node seven = BstSearch.find(root, 7);
        System.out.println("min of the subtree at 7 = " + BstMinMax.findMin(seven).key);
        System.out.println("max of the subtree at 6 = " + BstMinMax.findMax(root.left).key);
    }
}`,
  BstOrder: `class BstOrder {
    /** The node with the next larger key, or null if x holds the largest key. */
    static Node successor(Node x) {
        if (x.right != null) {                  // case 1
            return BstMinMax.findMin(x.right);
        }
        Node y = x.parent;                      // case 2: go up
        while (y != null && x == y.right) {
            x = y;
            y = y.parent;
        }
        return y;                               // null: no successor
    }

    /** The node with the next smaller key, or null if x holds the smallest key. */
    static Node predecessor(Node x) {
        if (x.left != null) {                   // case 1
            return BstMinMax.findMax(x.left);
        }
        Node y = x.parent;                      // case 2: go up
        while (y != null && x == y.left) {
            x = y;
            y = y.parent;
        }
        return y;                               // null: no predecessor
    }
}`,
  SuccessorDemo: `public class SuccessorDemo {
    static String keyOf(Node n) {
        return n == null ? "none" : String.valueOf(n.key);
    }

    public static void main(String[] args) {
        Node root = Trees.build(15, 6, 18, 3, 7, 17, 20, 2, 4, 13, 9);
        System.out.println("key  pred  succ");
        for (int k : new int[] {2, 3, 4, 6, 7, 9, 13, 15, 17, 18, 20}) {
            Node x = BstSearch.find(root, k);
            System.out.printf("%3d  %4s  %4s%n", k, keyOf(BstOrder.predecessor(x)),
                    keyOf(BstOrder.successor(x)));
        }
    }
}`,
  BinarySearchTree: `class BinarySearchTree {
    Node root;

    void insert(int key) {
        Node z = new Node(key);
        Node y = null;            // trailing pointer: parent of x
        Node x = root;
        while (x != null) {       // find the empty spot
            y = x;
            if (z.key < x.key) {
                x = x.left;
            } else {
                x = x.right;
            }
        }
        z.parent = y;
        if (y == null) {          // the tree was empty
            root = z;
        } else if (z.key < y.key) {
            y.left = z;
        } else {
            y.right = z;
        }
    }

    Node find(int key) {
        return BstSearch.find(root, key);
    }

    @Override
    public String toString() {
        return Trees.shape(root);
    }
}`,
  InsertDemo: `public class InsertDemo {
    public static void main(String[] args) {
        BinarySearchTree t = new BinarySearchTree();
        for (int k : new int[] {12, 5, 18, 2, 9, 15, 19, 1, 3, 17}) {
            t.insert(k);
        }
        System.out.println("before: " + t);
        t.insert(13);
        System.out.println("after:  " + t);
        System.out.println("parent of 13: " + t.find(13).parent.key);

        BinarySearchTree s = new BinarySearchTree();
        for (int k : new int[] {15, 6, 18, 3, 7, 17, 20, 2, 4}) {
            s.insert(k);
            System.out.println("insert " + k + ": " + s);
        }
    }
}`,
  HeightDemo: `import java.util.Random;

public class HeightDemo {
    public static void main(String[] args) {
        int n = 1000;
        int[] keys = new int[n];
        for (int i = 0; i < n; i++) {
            keys[i] = i + 1;
        }
        System.out.println("sorted order:   height " + Trees.height(Trees.build(keys)));

        Random rng = new Random(2026);
        for (int i = n - 1; i > 0; i--) {          // shuffle (Fisher-Yates)
            int j = rng.nextInt(i + 1);
            int tmp = keys[i];
            keys[i] = keys[j];
            keys[j] = tmp;
        }
        System.out.println("shuffled order: height " + Trees.height(Trees.build(keys)));
        System.out.println("floor(log2 n) = " + (31 - Integer.numberOfLeadingZeros(n)));
        System.out.println(Trees.shape(Trees.build(1, 2, 3, 4, 5)));
        System.out.println(Trees.shape(Trees.build(3, 1, 4, 2, 5)));
    }
}`,
  BinarySearchTree2: `class BinarySearchTree {
    Node root;

    void insert(int key) {
        Node z = new Node(key);
        Node y = null;
        Node x = root;
        while (x != null) {
            y = x;
            if (z.key < x.key) {
                x = x.left;
            } else {
                x = x.right;
            }
        }
        z.parent = y;
        if (y == null) {
            root = z;
        } else if (z.key < y.key) {
            y.left = z;
        } else {
            y.right = z;
        }
    }

    Node find(int key) {
        return BstSearch.find(root, key);
    }

    /** Remove node z from this tree. */
    void delete(Node z) {
        if (z.left != null && z.right != null) {      // case 3: two children
            Node y = BstMinMax.findMin(z.right);       // z's successor: no left child
            z.key = y.key;                              // copy y's key into z
            z = y;                                      // now remove y instead
        }
        // cases 1 and 2: z has at most one child
        Node child = (z.left != null) ? z.left : z.right;   // null in case 1
        if (child != null) {
            child.parent = z.parent;
        }
        if (z.parent == null) {                         // z is the root
            root = child;
        } else if (z == z.parent.left) {
            z.parent.left = child;
        } else {
            z.parent.right = child;
        }
    }

    /** Remove the node with this key; return false if there is none. */
    boolean delete(int key) {
        Node z = find(key);
        if (z == null) {
            return false;
        }
        delete(z);
        return true;
    }

    @Override
    public String toString() {
        return Trees.shape(root);
    }
}`,
  DeleteDemo: `public class DeleteDemo {
    static BinarySearchTree example() {
        BinarySearchTree t = new BinarySearchTree();
        for (int k : new int[] {15, 5, 16, 3, 12, 20, 10, 13, 18, 23, 6, 7}) {
            t.insert(k);
        }
        return t;
    }

    public static void main(String[] args) {
        System.out.println("tree:       " + example());
        for (int k : new int[] {13, 16, 5}) {
            BinarySearchTree t = example();
            t.delete(k);
            System.out.println("delete " + k + ":  " + t);
        }
        BinarySearchTree t = example();
        t.delete(15);
        System.out.println("delete 15:  " + t);
        System.out.println("delete 99:  " + t.delete(99));

        BinarySearchTree small = new BinarySearchTree();
        small.insert(1);
        small.insert(2);
        small.delete(1);                       // the root, with one child
        System.out.println("root now " + small + ", its parent " + small.root.parent);
        small.delete(2);                       // the root, a leaf
        System.out.println("empty: " + small);
    }
}`,
  CommuteDemo: `public class CommuteDemo {
    static BinarySearchTree tree(int... keys) {
        BinarySearchTree t = new BinarySearchTree();
        for (int k : keys) {
            t.insert(k);
        }
        return t;
    }

    public static void main(String[] args) {
        BinarySearchTree a = tree(4, 2, 6, 5, 8, 7);
        BinarySearchTree b = tree(4, 2, 6, 5, 8, 7);
        System.out.println("start:            " + a);
        a.delete(5);
        a.delete(6);
        b.delete(6);
        b.delete(5);
        System.out.println("delete 5, then 6: " + a + "   in-order " + Trees.inorder(a.root));
        System.out.println("delete 6, then 5: " + b + "   in-order " + Trees.inorder(b.root));

        BinarySearchTree c = tree(4, 2, 6, 7, 8);
        BinarySearchTree d = tree(4, 2, 6, 8, 7);
        System.out.println("insert 7, then 8: " + c);
        System.out.println("insert 8, then 7: " + d);
    }
}`,
  TreeSort: `public class TreeSort {
    static int comparisons = 0;

    static Node insert(Node root, int key) {
        Node z = new Node(key);
        Node y = null;
        Node x = root;
        while (x != null) {
            y = x;
            comparisons++;
            x = (key < x.key) ? x.left : x.right;
        }
        z.parent = y;
        if (y == null) {
            return z;
        }
        if (key < y.key) {
            y.left = z;
        } else {
            y.right = z;
        }
        return root;
    }

    static int fill(Node x, int[] out, int i) {     // in-order walk into out[i..]
        if (x == null) {
            return i;
        }
        i = fill(x.left, out, i);
        out[i++] = x.key;
        return fill(x.right, out, i);
    }

    static void sort(int[] a) {
        Node root = null;
        for (int v : a) {
            root = insert(root, v);
        }
        fill(root, a, 0);
    }

    public static void main(String[] args) {
        int[] a = {15, 6, 18, 3, 7, 17, 20, 2, 4};
        sort(a);
        System.out.println(java.util.Arrays.toString(a));

        int n = 2000;
        int[] sorted = new int[n];
        int[] mixed = new int[n];
        for (int i = 0; i < n; i++) {
            sorted[i] = i;
            mixed[i] = (int) ((i * 7919L) % n);     // a scrambled order of 0..n-1
        }
        comparisons = 0;
        sort(sorted);
        System.out.println("sorted input: " + comparisons + " comparisons");
        comparisons = 0;
        sort(mixed);
        System.out.println("mixed input:  " + comparisons + " comparisons");
    }
}`,
  LcaDemo: `public class LcaDemo {
    /** The LCA of the nodes with keys a and b, both assumed to be in the tree. */
    static Node lca(Node x, int a, int b) {
        while (x != null) {
            if (a < x.key && b < x.key) {
                x = x.left;
            } else if (a > x.key && b > x.key) {
                x = x.right;
            } else {
                return x;
            }
        }
        return null;
    }

    public static void main(String[] args) {
        Node root = Trees.build(25, 20, 30, 10, 23, 35, 5, 21, 32);
        System.out.println(Trees.shape(root));
        int[][] pairs = {{5, 21}, {10, 30}, {5, 32}, {10, 23}, {10, 5}};
        for (int[] p : pairs) {
            System.out.println("LCA(" + p[0] + ", " + p[1] + ") = " + lca(root, p[0], p[1]).key);
        }
        Node other = Trees.build(15, 10, 20, 5, 13, 12, 14);
        System.out.println(Trees.shape(other));
        System.out.println("LCA(5, 14) = " + lca(other, 5, 14).key);
    }
}`,
  BuildAndDelete: `public class BuildAndDelete {
    public static void main(String[] args) {
        BinarySearchTree t = new BinarySearchTree();
        for (int k : new int[] {50, 30, 70, 20, 40, 60, 80, 35, 45, 65}) {
            t.insert(k);
        }
        System.out.println(t + "  height " + Trees.height(t.root));
        t.delete(30);
        System.out.println(t + "  height " + Trees.height(t.root));
        t.delete(50);
        System.out.println(t + "  height " + Trees.height(t.root));
    }
}`,
  RecursiveMin: `class RecursiveMin {
    static Node findMin(Node x) {
        if (x.left == null) {
            return x;
        }
        return findMin(x.left);
    }
}`,
  RangeQuery: `public class RangeQuery {
    static void printRange(Node x, int lo, int hi) {
        if (x == null) {
            return;
        }
        if (lo < x.key) {
            printRange(x.left, lo, hi);
        }
        if (lo <= x.key && x.key <= hi) {
            System.out.print(x.key + " ");
        }
        if (x.key < hi) {
            printRange(x.right, lo, hi);
        }
    }

    public static void main(String[] args) {
        Node root = Trees.build(15, 6, 18, 3, 7, 17, 20, 2, 4, 13, 9);
        printRange(root, 5, 16);
        System.out.println();
        printRange(root, 16, 100);
        System.out.println();
    }
}`,
  FloorDemo: `public class FloorDemo {
    static Integer floor(Node x, int k) {
        Integer best = null;
        while (x != null) {
            if (x.key == k) {
                return k;
            }
            if (x.key < k) {
                best = x.key;
                x = x.right;
            } else {
                x = x.left;
            }
        }
        return best;
    }

    public static void main(String[] args) {
        Node root = Trees.build(15, 6, 18, 3, 7, 17, 20, 2, 4, 13, 9);
        for (int k : new int[] {14, 13, 5, 1, 99}) {
            System.out.println("floor(" + k + ") = " + floor(root, k));
        }
    }
}`,
  find: `/** The node with key k in the subtree x, or null. */
static Node find(Node x, int k) {
    if (x == null || k == x.key) {
        return x;
    }
    if (k < x.key) {
        return find(x.left, k);
    } else {
        return find(x.right, k);
    }
}`,
  findIterative: `/** The same search with a loop instead of recursion. */
static Node findIterative(Node x, int k) {
    while (x != null && k != x.key) {
        if (k < x.key) {
            x = x.left;
        } else {
            x = x.right;
        }
    }
    return x;
}`,
  findMin: `/** The node with the smallest key in the non-empty subtree x. */
static Node findMin(Node x) {
    while (x.left != null) {
        x = x.left;
    }
    return x;
}`,
  findMax: `/** The node with the largest key in the non-empty subtree x. */
static Node findMax(Node x) {
    while (x.right != null) {
        x = x.right;
    }
    return x;
}`,
  successor: `/** The node with the next larger key, or null if x holds the largest key. */
static Node successor(Node x) {
    if (x.right != null) {                  // case 1
        return BstMinMax.findMin(x.right);
    }
    Node y = x.parent;                      // case 2: go up
    while (y != null && x == y.right) {
        x = y;
        y = y.parent;
    }
    return y;                               // null: no successor
}`,
  predecessor: `/** The node with the next smaller key, or null if x holds the smallest key. */
static Node predecessor(Node x) {
    if (x.left != null) {                   // case 1
        return BstMinMax.findMax(x.left);
    }
    Node y = x.parent;                      // case 2: go up
    while (y != null && x == y.left) {
        x = y;
        y = y.parent;
    }
    return y;                               // null: no predecessor
}`,
  insert: `void insert(int key) {
    Node z = new Node(key);
    Node y = null;            // trailing pointer: parent of x
    Node x = root;
    while (x != null) {       // find the empty spot
        y = x;
        if (z.key < x.key) {
            x = x.left;
        } else {
            x = x.right;
        }
    }
    z.parent = y;
    if (y == null) {          // the tree was empty
        root = z;
    } else if (z.key < y.key) {
        y.left = z;
    } else {
        y.right = z;
    }
}`,
  deleteNode: `/** Remove node z from this tree. */
void delete(Node z) {
    if (z.left != null && z.right != null) {      // case 3: two children
        Node y = BstMinMax.findMin(z.right);       // z's successor: no left child
        z.key = y.key;                              // copy y's key into z
        z = y;                                      // now remove y instead
    }
    // cases 1 and 2: z has at most one child
    Node child = (z.left != null) ? z.left : z.right;   // null in case 1
    if (child != null) {
        child.parent = z.parent;
    }
    if (z.parent == null) {                         // z is the root
        root = child;
    } else if (z == z.parent.left) {
        z.parent.left = child;
    } else {
        z.parent.right = child;
    }
}`,
  isBst: `/** Is every key in the subtree x strictly between low and high? */
static boolean isBst(Node x, long low, long high) {
    if (x == null) {
        return true;
    }
    if (x.key <= low || x.key >= high) {
        return false;
    }
    return isBst(x.left, low, x.key) && isBst(x.right, x.key, high);
}`,
  lca: `/** The LCA of the nodes with keys a and b, both assumed to be in the tree. */
static Node lca(Node x, int a, int b) {
    while (x != null) {
        if (a < x.key && b < x.key) {
            x = x.left;
        } else if (a > x.key && b > x.key) {
            x = x.right;
        } else {
            return x;
        }
    }
    return null;
}`,
};

const OUT = {
  IsItABst: `tree a: 8(3(1,6(4,7)),10(-,14(13,-)))
  children in order: true, is a BST: true
  in-order: 1 3 4 6 7 8 10 13 14
tree b: 8(6(1,4(3,7)),10(-,14(13,-)))
  children in order: false, is a BST: false
  in-order: 1 6 3 4 7 8 10 13 14
tree c: 10(5(2,12),15)
  children in order: true, is a BST: false
  in-order: 2 5 12 10 15
`,
  TreeSetDemo: `[2, 3, 4, 6, 7, 9, 13, 15, 17, 18, 20]
contains(13): true
first: 2, last: 20
higher(15): 17
lower(15): 13
higher(20): null
after remove(6): [2, 3, 4, 7, 9, 13, 15, 17, 18, 20]
`,
  SearchDemo: `find 13: 15 -> 6 -> 7 -> 13, found
find 17: 15 -> 18 -> 17, found
find 5: 15 -> 6 -> 3 -> 4 -> null, not found
find 15: 15, found
13
null
`,
  MinMaxDemo: `min = 2
max = 20
min of the subtree at 7 = 7
max of the subtree at 6 = 13
`,
  SuccessorDemo: `key  pred  succ
  2  none     3
  3     2     4
  4     3     6
  6     4     7
  7     6     9
  9     7    13
 13     9    15
 15    13    17
 17    15    18
 18    17    20
 20    18  none
`,
  InsertDemo: `before: 12(5(2(1,3),9),18(15(-,17),19))
after:  12(5(2(1,3),9),18(15(13,17),19))
parent of 13: 15
insert 15: 15
insert 6: 15(6,-)
insert 18: 15(6,18)
insert 3: 15(6(3,-),18)
insert 7: 15(6(3,7),18)
insert 17: 15(6(3,7),18(17,-))
insert 20: 15(6(3,7),18(17,20))
insert 2: 15(6(3(2,-),7),18(17,20))
insert 4: 15(6(3(2,4),7),18(17,20))
`,
  HeightDemo: `sorted order:   height 999
shuffled order: height 18
floor(log2 n) = 9
1(-,2(-,3(-,4(-,5))))
3(1(-,2),4(-,5))
`,
  DeleteDemo: `tree:       15(5(3,12(10(6(-,7),-),13)),16(-,20(18,23)))
delete 13:  15(5(3,12(10(6(-,7),-),-)),16(-,20(18,23)))
delete 16:  15(5(3,12(10(6(-,7),-),13)),20(18,23))
delete 5:  15(6(3,12(10(7,-),13)),16(-,20(18,23)))
delete 15:  16(5(3,12(10(6(-,7),-),13)),20(18,23))
delete 99:  false
root now 2, its parent null
empty: -
`,
  CommuteDemo: `start:            4(2,6(5,8(7,-)))
delete 5, then 6: 4(2,8(7,-))   in-order 2 4 7 8
delete 6, then 5: 4(2,7(-,8))   in-order 2 4 7 8
insert 7, then 8: 4(2,6(-,7(-,8)))
insert 8, then 7: 4(2,6(-,8(7,-)))
`,
  TreeSort: `[2, 3, 4, 6, 7, 15, 17, 18, 20]
sorted input: 1999000 comparisons
mixed input:  38920 comparisons
`,
  LcaDemo: `25(20(10(5,-),23(21,-)),30(-,35(32,-)))
LCA(5, 21) = 20
LCA(10, 30) = 25
LCA(5, 32) = 25
LCA(10, 23) = 20
LCA(10, 5) = 10
15(10(5,13(12,14)),20)
LCA(5, 14) = 10
`,
  BuildAndDelete: `50(30(20,40(35,45)),70(60(-,65),80))  height 3
50(35(20,40(-,45)),70(60(-,65),80))  height 3
60(35(20,40(-,45)),70(65,80))  height 3
`,
  RangeQuery: `6 7 9 13 15 
17 18 20 
`,
  FloorDemo: `floor(14) = 13
floor(13) = 13
floor(5) = 4
floor(1) = null
floor(99) = 20
`,
};

// ---------------------------------------------------------------------------------------
// Interactive demos. The JS twins below replay the Java in CODE line by line; their results
// match the outputs in OUT (checked by tools/check.py).

(function injectStyle() {
  if (document.getElementById("l14-style")) return;
  const st = document.createElement("style");
  st.id = "l14-style";
  st.textContent = `
    .l14-two { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 10px; }
    .l14-cap { font: 600 12px var(--mono); color: var(--stone); text-align: center; margin: 2px 0 6px; }
    .l14-shape { font: 12px var(--mono); color: var(--ink-2); text-align: center; margin-top: 4px; overflow-wrap: anywhere; }
    .l14-out { display: flex; flex-wrap: wrap; gap: 4px; justify-content: center; margin-top: 8px; min-height: 36px; }
    .l14-out .cell { width: 36px; height: 32px; }
    .controls input.l14-keys { width: 210px; }
    .controls input.l14-num { width: 64px; }
    article p code, article li code, article td code { overflow-wrap: anywhere; }
    @media (max-width: 600px) {
      .l14-two { grid-template-columns: minmax(0, 1fr); }
      .demo .controls select { max-width: 230px; }
      .controls input.l14-keys { width: 100%; }
    }`;
  document.head.appendChild(st);
})();

// Line number (1-based) of the first line of CODE[key] that contains text.
function ln(key, text) {
  const k = CODE[key].split("\n").findIndex((l) => l.includes(text));
  if (k < 0) throw new Error(`L14 demos: "${text}" not found in code panel ${key}`);
  return k + 1;
}

// ---------- the tree model (same algorithms as the Java) ----------

let NODE_ID = 0;
function mkNode(key) { return { id: NODE_ID++, key, left: null, right: null, parent: null }; }

// BinarySearchTree.insert from the note: equal keys go right.
function bstInsert(root, key) {
  const z = mkNode(key);
  let y = null, x = root;
  while (x) { y = x; x = key < x.key ? x.left : x.right; }
  z.parent = y;
  if (!y) return z;
  if (key < y.key) y.left = z; else y.right = z;
  return root;
}
function buildTree(keys) { let r = null; keys.forEach((k) => { r = bstInsert(r, k); }); return r; }

// Parse the one-line shape "8(3(1,6),10(-,14))" (any binary tree, ordered or not).
function parseShape(s) {
  let i = 0;
  s = s.replace(/\s+/g, "");
  function tree() {
    if (s[i] === "-") { i++; return null; }
    const m = s.slice(i).match(/^-?\d+/);
    const n = mkNode(Number(m[0]));
    i += m[0].length;
    if (s[i] === "(") {
      i++; n.left = tree(); i++; n.right = tree(); i++;
      if (n.left) n.left.parent = n;
      if (n.right) n.right.parent = n;
    }
    return n;
  }
  return tree();
}

function shapeOf(x) {
  if (!x) return "-";
  if (!x.left && !x.right) return String(x.key);
  return `${x.key}(${shapeOf(x.left)},${shapeOf(x.right)})`;
}
function inorderKeys(x, out = []) { if (x) { inorderKeys(x.left, out); out.push(x.key); inorderKeys(x.right, out); } return out; }
function heightOf(x) { return x ? 1 + Math.max(heightOf(x.left), heightOf(x.right)) : -1; }
function findNode(x, k) { while (x && x.key !== k) x = k < x.key ? x.left : x.right; return x; }
function keyStr(n) { return n ? String(n.key) : "null"; }

// A frozen picture of the tree: nodes placed by in-order rank (x) and depth (y).
function view(root) {
  const nodes = [], edges = [];
  let rank = 0;
  (function walk(n, d) {
    if (!n) return;
    walk(n.left, d + 1);
    nodes.push({ id: n.id, key: n.key, rank: rank++, depth: d });
    walk(n.right, d + 1);
    if (n.left) edges.push([n.id, n.left.id]);
    if (n.right) edges.push([n.id, n.right.id]);
  })(root, 0);
  return { nodes, edges };
}

const MARK_STYLE = {
  "": ["var(--card)", "var(--ink-2)", 1.4],
  path: ["var(--teal-soft)", "var(--teal)", 1.6],
  cur: ["var(--mark)", "var(--amber)", 2.6],
  found: ["var(--green-soft)", "var(--green)", 2.2],
  gone: ["var(--red-soft)", "var(--red)", 2.2],
  new: ["var(--green-soft)", "var(--green)", 2.6],
  target: ["var(--card)", "var(--green)", 2.2],
  dim: ["var(--paper-2)", "var(--line)", 1.2],
};

// m: {cls: {id: style}, labels: {id: "x"}, notes: {id: "text under the node"}, ghost: {id, side, key}}
function treeSVG(v, m = {}) {
  const W = 720;
  if (!v.nodes.length) {
    return `<svg viewBox="0 0 ${W} 70" role="img" aria-label="empty tree"><text x="${W / 2}" y="40" text-anchor="middle" font-size="14" fill="var(--stone)">empty tree (root = null)</text></svg>`;
  }
  const n = v.nodes.length;
  const maxD = Math.max(...v.nodes.map((d) => d.depth)) + (m.ghost ? 1 : 0);
  const rowH = Math.max(34, Math.min(62, 440 / (maxD + 1)));
  const slotW = Math.min(W / n, 78);
  const off = (W - slotW * n) / 2;
  const R = Math.max(9, Math.min(17, slotW * 0.42, rowH * 0.32));
  const fs = Math.max(9, Math.min(14, R * 0.85));
  const H = (maxD + 1) * rowH + 26 + (m.notes ? 14 : 0);
  const pos = {};
  v.nodes.forEach((d) => { pos[d.id] = [off + (d.rank + 0.5) * slotW, 24 + d.depth * rowH]; });
  const cls = m.cls || {}, labels = m.labels || {}, notes = m.notes || {};
  let g = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="binary search tree">`;
  v.edges.forEach(([a, b]) => {
    const on = (cls[a] && cls[a] !== "dim") && (cls[b] && cls[b] !== "dim" && cls[b] !== "target");
    g += `<line x1="${pos[a][0]}" y1="${pos[a][1]}" x2="${pos[b][0]}" y2="${pos[b][1]}" stroke="var(--${on ? "teal" : "line"})" stroke-width="${on ? 2.2 : 1.4}"/>`;
  });
  if (m.ghost && pos[m.ghost.id]) {
    const [px, py] = pos[m.ghost.id];
    const gx = px + (m.ghost.side === "left" ? -1 : 1) * Math.max(slotW * 0.5, R * 1.6), gy = py + rowH;
    g += `<line x1="${px}" y1="${py}" x2="${gx}" y2="${gy}" stroke="var(--amber)" stroke-width="1.6" stroke-dasharray="4 3"/>`;
    g += `<circle cx="${gx}" cy="${gy}" r="${R}" fill="none" stroke="var(--amber)" stroke-width="1.6" stroke-dasharray="4 3"/>`;
    g += `<text x="${gx}" y="${gy + fs * 0.35}" text-anchor="middle" font-size="${fs * 0.8}" fill="var(--amber)">${m.ghost.key === undefined ? "null" : esc(m.ghost.key)}</text>`;
  }
  v.nodes.forEach((d) => {
    const [x, y] = pos[d.id];
    const [fill, stroke, sw] = MARK_STYLE[cls[d.id] || ""];
    const dash = cls[d.id] === "target" ? ` stroke-dasharray="4 2"` : "";
    g += `<circle cx="${x}" cy="${y}" r="${R}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"${dash}/>`;
    g += `<text x="${x}" y="${y + fs * 0.36}" text-anchor="middle" font-size="${fs}" font-weight="600" fill="${cls[d.id] === "dim" ? "var(--stone)" : "var(--ink)"}">${esc(d.key)}</text>`;
    if (labels[d.id]) g += `<text x="${x + R + 2}" y="${y - R + 4}" font-size="12" font-weight="700" font-family="var(--mono)" fill="var(--amber)">${esc(labels[d.id])}</text>`;
    if (notes[d.id]) g += `<text x="${x}" y="${y + R + 12}" text-anchor="middle" font-size="10" font-family="var(--mono)" fill="var(--ink-2)">${esc(notes[d.id])}</text>`;
  });
  return g + "</svg>";
}

// Record a snapshot of the tree with marks into a Tracer.
function shot(t, line, msg, root, m, msgCls = "") {
  const copy = { cls: { ...(m.cls || {}) }, labels: { ...(m.labels || {}) } };
  if (m.notes) copy.notes = { ...m.notes };
  if (m.ghost) copy.ghost = { ...m.ghost };
  t.snap(line, msg, msgCls, { v: view(root), m: copy });
}
const renderTree = (s) => `<div class="svgbox">${treeSVG(s.extra.v, s.extra.m)}</div>`;

const RUNNING = [15, 6, 18, 3, 7, 17, 20, 2, 4, 13, 9];
const DELETE_EX = [15, 5, 16, 3, 12, 20, 10, 13, 18, 23, 6, 7];
const keysInput = (cls, keys) => `<label>keys inserted <input type="text" class="l14-keys ${cls}" value="${keys.join(", ")}"></label>`;
const numInput = (cls, label, v) => `<label>${label} <input type="number" class="l14-num ${cls}" value="${v}"></label>`;
function readKeys(input, fallback, max = 16) {
  const xs = parseNums(input.value, fallback).slice(0, max);
  input.value = xs.join(", ");
  return xs;
}

// ---------- Demo: is it a BST? (isBst with ranges, recursive) ----------

const CHECK_TREES = {
  a: ["tree a", "8(3(1,6(4,7)),10(-,14(13,-)))"],
  b: ["tree b", "8(6(1,4(3,7)),10(-,14(13,-)))"],
  c: ["tree c", "10(5(2,12),15)"],
};
const showBound = (v) => (v === -Infinity ? "-∞" : v === Infinity ? "+∞" : String(v));

function demoBstCheck(el) {
  let which = "c";
  makeStepper(el, {
    code: CODE.isBst,
    stackLabel: "call stack (newest on top)",
    renderExtra: renderTree,
    extraControls: `<label>tree <select class="chk-t">${Object.entries(CHECK_TREES).map(([k, [n, s]]) => `<option value="${k}"${k === which ? " selected" : ""}>${n}: ${s}</option>`).join("")}</select></label>`,
    onMount(root, rebuild) { root.querySelector(".chk-t").onchange = (e) => { which = e.target.value; rebuild(); }; },
    build() {
      const root = parseShape(CHECK_TREES[which][1]);
      const t = new Tracer();
      const m = { cls: {}, labels: {}, notes: {} };
      const L = { nul: ln("isBst", "if (x == null)"), retT: ln("isBst", "return true"), test: ln("isBst", "x.key <= low"), retF: ln("isBst", "return false"), rec: ln("isBst", "return isBst(x.left") };
      let failed = false;
      function rec(x, low, high, depth) {
        const f = t.push("isBst", { x: keyStr(x), low: showBound(low), high: showBound(high) });
        if (!x) {
          f.status = "returns true";
          shot(t, L.retT, "An empty subtree is always fine: <b>true</b>.", root, m);
          t.pop();
          return true;
        }
        const prev = m.cls[x.id];
        m.cls[x.id] = "cur";
        m.labels[x.id] = "x";
        m.notes[x.id] = `(${showBound(low)}, ${showBound(high)})`;
        shot(t, L.test, `Node ${x.key} must lie strictly between ${showBound(low)} and ${showBound(high)}: the bounds come from <em>all</em> its ancestors.`, root, m);
        delete m.labels[x.id];
        if (x.key <= low || x.key >= high) {
          m.cls[x.id] = "gone";
          f.status = "returns false";
          failed = true;
          shot(t, L.retF, `${x.key} is outside (${showBound(low)}, ${showBound(high)}): <b>false</b>. ${x.parent ? `Its parent ${x.parent.key} alone would not catch this if the bound came from higher up.` : ""}`, root, m, "bad");
          t.pop();
          return false;
        }
        m.cls[x.id] = "found";
        f.status = `checks left with high = ${x.key}`;
        shot(t, L.rec, `${x.key} is in range. Check the left subtree with upper bound ${x.key}, then the right subtree with lower bound ${x.key}.`, root, m);
        const left = rec(x.left, low, x.key, depth + 1);
        let ok = left;
        if (left) {
          f.status = `checks right with low = ${x.key}`;
          shot(t, L.rec, `Left subtree of ${x.key} is fine. Now the right subtree, lower bound ${x.key}.`, root, m);
          ok = rec(x.right, x.key, high, depth + 1);
        }
        f.status = `returns ${ok}`;
        shot(t, L.rec, ok ? `The subtree at ${x.key} is a BST.` : `${left ? "" : "&& stops early: the left side already failed. "}The subtree at ${x.key} is <b>not</b> a BST.`, root, m, ok ? "" : "bad");
        t.pop();
        void prev;
        return ok;
      }
      t.snap(1, `Call <code>isBst(root, -∞, +∞)</code> on ${CHECK_TREES[which][0]}. Every node gets the range its ancestors allow.`, "", { v: view(root), m: { cls: {}, labels: {} } });
      const res = rec(root, -Infinity, Infinity, 0);
      t.snap(L.rec, res ? `<b>true</b>: every node is inside its range, so ${CHECK_TREES[which][0]} is a BST. In-order: ${inorderKeys(root).join(" ")}.` : `<b>false</b>: ${CHECK_TREES[which][0]} is not a BST. In-order: ${inorderKeys(root).join(" ")}, not increasing.`, res ? "good" : "bad", { v: view(root), m: { cls: { ...m.cls }, labels: {}, notes: { ...m.notes } } });
      void failed;
      return t.snaps;
    },
  });
}

// ---------- Demo: search (recursive find) ----------

function demoSearch(el, { mini = false } = {}) {
  let keys = RUNNING.slice(), k = mini ? 13 : 13;
  makeStepper(el, {
    mini,
    code: CODE.find,
    renderExtra: renderTree,
    extraControls: keysInput("s-keys", keys) + numInput("s-k", "find", k),
    onMount(root, rebuild) {
      if (mini) return;
      root.querySelector(".s-keys").onchange = (e) => { keys = readKeys(e.target, RUNNING); rebuild(); };
      root.querySelector(".s-k").onchange = (e) => { k = Math.trunc(Number(e.target.value)) || 0; rebuild(); };
    },
    build() {
      const root = buildTree(keys);
      const t = new Tracer();
      const m = { cls: {}, labels: {} };
      const L = { test: ln("find", "if (x == null || k == x.key)"), ret: ln("find", "return x;"), cmp: ln("find", "if (k < x.key)"), left: ln("find", "return find(x.left"), right: ln("find", "return find(x.right") };
      let steps = 0;
      function rec(x, parent, side) {
        const f = t.push("find", { x: keyStr(x), k });
        if (x) { m.cls[x.id] = "cur"; m.labels = { [x.id]: "x" }; steps++; }
        else { m.labels = {}; m.ghost = { id: parent.id, side }; }
        if (!x || x.key === k) {
          if (x) m.cls[x.id] = "found";
          shot(t, L.test, x ? `k == x.key: <b>${k}</b> found after ${steps} comparison${steps > 1 ? "s" : ""}.` : `x is null: we fell off the tree. ${k} is not here — and this empty spot is exactly where insert(${k}) would put it.`, root, m, x ? "good" : "bad");
          f.status = `returns ${x ? "node " + x.key : "null"}`;
          shot(t, L.ret, `Return ${x ? "the node" : "null"}; every waiting call passes it straight up.`, root, m, x ? "good" : "bad");
          delete m.ghost;
          t.pop();
          return x;
        }
        const goLeft = k < x.key;
        shot(t, L.cmp, `${k} ${goLeft ? "<" : ">"} ${x.key}: by the BST property, ${k} can only be in the <b>${goLeft ? "left" : "right"}</b> subtree. The other subtree is never looked at.`, root, m);
        m.cls[x.id] = "path";
        const child = goLeft ? x.left : x.right;
        f.status = `waits for find(${keyStr(child)})`;
        const r = rec(child, x, goLeft ? "left" : "right");
        m.labels = { [x.id]: "x" };
        f.status = `returns ${keyStr(r)}`;
        shot(t, goLeft ? L.left : L.right, `find(x = ${x.key}) returns what the deeper call returned: ${r ? "node " + r.key : "null"}.`, root, m, r ? "good" : "");
        t.pop();
        return r;
      }
      shot(t, 1, `Search for ${k} starting at the root ${keyStr(root)}. Tree height ${heightOf(root)}.`, root, m);
      if (!root) { t.push("find", { x: "null", k }); t.snap(L.ret, "The tree is empty: return null."); return t.snaps; }
      rec(root, null, null);
      return t.snaps;
    },
  });
}

// ---------- Demo: findMin / findMax ----------

function demoMinMax(el) {
  let keys = RUNNING.slice(), op = "findMin", start = 15;
  makeStepper(el, {
    code: () => CODE[op],
    renderExtra: renderTree,
    extraControls: `<label>method <select class="mm-op"><option>findMin</option><option>findMax</option></select></label>` + numInput("mm-s", "start at", start) + keysInput("mm-keys", keys),
    onMount(root, rebuild) {
      root.querySelector(".mm-op").onchange = (e) => { op = e.target.value; rebuild(); };
      root.querySelector(".mm-s").onchange = (e) => { start = Math.trunc(Number(e.target.value)); rebuild(); };
      root.querySelector(".mm-keys").onchange = (e) => { keys = readKeys(e.target, RUNNING); rebuild(); };
    },
    build() {
      const root = buildTree(keys);
      const t = new Tracer();
      const side = op === "findMin" ? "left" : "right";
      const L = { test: ln(op, `while (x.${side} != null)`), move: ln(op, `x = x.${side};`), ret: ln(op, "return x;") };
      let x = findNode(root, start);
      if (!x) {
        t.push(op, { x: "?" });
        t.snap(1, `${start} is not in the tree. Pick a key that is: ${inorderKeys(root).join(", ")}.`, "bad", { v: view(root), m: {} });
        return t.snaps;
      }
      const f = t.push(op, { x: x.key });
      const m = { cls: {}, labels: {} };
      const at = () => { m.cls[x.id] = "cur"; m.labels = { [x.id]: "x" }; f.vars.x = x.key; };
      at();
      shot(t, 1, `${op}(node ${x.key}): follow <b>${side}</b> pointers until there is none.`, root, m);
      while (x[side]) {
        shot(t, L.test, `x.${side} is ${x[side].key}, not null: keep going.`, root, m);
        m.cls[x.id] = "path";
        x = x[side];
        at();
        shot(t, L.move, `x = x.${side}: now at ${x.key}.`, root, m);
      }
      shot(t, L.test, `x.${side} is null: nothing in this subtree is ${side === "left" ? "smaller" : "larger"} than ${x.key}.`, root, m);
      m.cls[x.id] = "found";
      f.status = `returns node ${x.key}`;
      shot(t, L.ret, `The ${side === "left" ? "minimum" : "maximum"} is <b>${x.key}</b>${x.left || x.right ? " — not a leaf: it may still have a child on the other side" : ""}.`, root, m, "good");
      return t.snaps;
    },
  });
}

// ---------- Demo: successor / predecessor ----------

function demoSucc(el, { mini = false } = {}) {
  let keys = RUNNING.slice(), op = "successor", k = 13;
  makeStepper(el, {
    mini,
    code: () => CODE[op],
    renderExtra: renderTree,
    extraControls: `<label>method <select class="sc-op"><option>successor</option><option>predecessor</option></select></label>` + numInput("sc-k", "of node", k) + keysInput("sc-keys", keys),
    onMount(root, rebuild) {
      if (mini) return;
      root.querySelector(".sc-op").onchange = (e) => { op = e.target.value; rebuild(); };
      root.querySelector(".sc-k").onchange = (e) => { k = Math.trunc(Number(e.target.value)); rebuild(); };
      root.querySelector(".sc-keys").onchange = (e) => { keys = readKeys(e.target, RUNNING); rebuild(); };
    },
    build() {
      const root = buildTree(keys);
      const t = new Tracer();
      const succ = op === "successor";
      const down = succ ? "right" : "left", other = succ ? "left" : "right";
      const helper = succ ? "findMin" : "findMax";
      const L = { c1: ln(op, `if (x.${down} != null)`), c1r: ln(op, `return BstMinMax.${helper}`), y0: ln(op, "Node y = x.parent;"), loop: ln(op, `while (y != null && x == y.${down})`), up: ln(op, "x = y;"), ret: ln(op, "return y;") };
      let x = findNode(root, k);
      if (!x) {
        t.push(op, { x: "?" });
        t.snap(1, `${k} is not in the tree. Pick one of: ${inorderKeys(root).join(", ")}.`, "bad", { v: view(root), m: {} });
        return t.snaps;
      }
      const x0 = x;
      const m = { cls: { [x.id]: "cur" }, labels: { [x.id]: "x" } };
      const f = t.push(op, { x: x.key });
      const word = succ ? "smallest key larger" : "largest key smaller";
      shot(t, 1, `${op}(${x.key}): the node with the ${word} than ${x.key}. In-order: ${inorderKeys(root).join(" ")}.`, root, m);
      if (x[down]) {
        shot(t, L.c1, `Case 1: x has a ${down} subtree. The answer is its ${succ ? "minimum" : "maximum"}.`, root, m);
        let z = x[down];
        m.cls[x0.id] = "path";
        m.cls[z.id] = "cur"; m.labels = { [x0.id]: "x", [z.id]: "m" };
        shot(t, L.c1r, `${helper}(x.${down}): start at ${z.key}…`, root, m);
        while (z[other]) {
          m.cls[z.id] = "path";
          z = z[other];
          m.cls[z.id] = "cur"; m.labels = { [x0.id]: "x", [z.id]: "m" };
          shot(t, L.c1r, `…go ${other} to ${z.key}…`, root, m);
        }
        m.cls[z.id] = "found";
        f.status = `returns node ${z.key}`;
        shot(t, L.c1r, `${op}(${x0.key}) = <b>${z.key}</b> (case 1).`, root, m, "good");
        return t.snaps;
      }
      shot(t, L.c1, `x.${down} is null: case 2, go up.`, root, m);
      let y = x.parent;
      const lab = () => { m.labels = { [x.id]: "x" }; if (y) m.labels[y.id] = "y"; f.vars = { x: x.key, y: keyStr(y) }; };
      if (y) m.cls[y.id] = "path";
      lab();
      shot(t, L.y0, `y = x.parent = ${keyStr(y)}.`, root, m);
      while (y && x === y[down]) {
        shot(t, L.loop, `x is the <b>${down}</b> child of y = ${y.key}, so ${y.key} is ${succ ? "smaller" : "larger"} than x: climb.`, root, m);
        m.cls[x.id] = x === x0 ? "path" : "path";
        x = y; y = y.parent;
        m.cls[x.id] = "path";
        if (y) m.cls[y.id] = "path";
        lab();
        shot(t, L.up, `x = y, y = y.parent: now x = ${x.key}, y = ${keyStr(y)}.`, root, m);
      }
      if (y) {
        shot(t, L.loop, `x is the <b>${other}</b> child of y = ${y.key}: everything we climbed through is in ${y.key}'s ${other} subtree. Stop.`, root, m);
        m.cls[y.id] = "found";
        f.status = `returns node ${y.key}`;
        shot(t, L.ret, `${op}(${x0.key}) = <b>${y.key}</b> (case 2).`, root, m, "good");
      } else {
        shot(t, L.loop, `y is null: we climbed past the root without ever coming from a ${other} child.`, root, m);
        f.status = "returns null";
        shot(t, L.ret, `${x0.key} is the ${succ ? "largest" : "smallest"} key of the <b>whole tree</b>: no ${op}, return null.`, root, m, "bad");
      }
      return t.snaps;
    },
  });
}

// ---------- Demo: insert with a trailing pointer ----------

const INSERT_PRESETS = {
  slide: ["insert 13 into the slide tree", [12, 5, 18, 2, 9, 15, 19, 1, 3, 17], [13]],
  build: ["build 15, 6, 18, 3, 7, 17, 20, 2, 4", [], [15, 6, 18, 3, 7, 17, 20, 2, 4]],
  sorted: ["build 1, 2, 3, 4, 5, 6 (sorted)", [], [1, 2, 3, 4, 5, 6]],
  running: ["build the running tree", [], RUNNING],
};

function demoInsert(el, { mini = false } = {}) {
  let preset = mini ? "running" : "slide";
  let base = INSERT_PRESETS[preset][1].slice(), ins = INSERT_PRESETS[preset][2].slice();
  makeStepper(el, {
    mini,
    code: CODE.insert,
    renderExtra: renderTree,
    stackLabel: "variables",
    extraControls: `<label>example <select class="in-p">${Object.entries(INSERT_PRESETS).map(([k, [n]]) => `<option value="${k}"${k === preset ? " selected" : ""}>${n}</option>`).join("")}</select></label>
      <label>start tree <input type="text" class="l14-keys in-base" value="${base.join(", ")}"></label>
      <label>insert <input type="text" class="l14-keys in-ins" value="${ins.join(", ")}"></label>`,
    onMount(root, rebuild) {
      if (mini) return;
      const b = root.querySelector(".in-base"), i = root.querySelector(".in-ins");
      root.querySelector(".in-p").onchange = (e) => {
        preset = e.target.value;
        base = INSERT_PRESETS[preset][1].slice(); ins = INSERT_PRESETS[preset][2].slice();
        b.value = base.join(", "); i.value = ins.join(", ");
        rebuild();
      };
      b.onchange = () => { base = b.value.trim() ? readKeys(b, []) : []; rebuild(); };
      i.onchange = () => { ins = readKeys(i, [13], 12); rebuild(); };
    },
    build() {
      let root = buildTree(base);
      const t = new Tracer();
      const L = { z: ln("insert", "Node z = new Node(key)"), x0: ln("insert", "Node x = root;"), cmp: ln("insert", "if (z.key < x.key)"), left: ln("insert", "x = x.left;"), right: ln("insert", "x = x.right;"), par: ln("insert", "z.parent = y;"), empty: ln("insert", "root = z;"), yl: ln("insert", "y.left = z;"), yr: ln("insert", "y.right = z;") };
      shot(t, 1, base.length ? `Start tree: ${shapeOf(root)}.` : "Start with an empty tree (root = null).", root, {});
      ins.forEach((key) => {
        const f = t.push(`insert(${key})`, { z: key, x: keyStr(root), y: "null" });
        let y = null, x = root;
        const m = { cls: {}, labels: {} };
        const lab = () => { m.labels = {}; if (x) { m.labels[x.id] = "x"; m.cls[x.id] = "cur"; } if (y) m.labels[y.id] = x && x.id === y.id ? "x,y" : "y"; f.vars = { z: key, x: keyStr(x), y: keyStr(y) }; };
        lab();
        shot(t, L.x0, `Insert ${key}: x starts at the root (${keyStr(root)}), y (the trailing pointer) at null.`, root, m);
        while (x) {
          const goLeft = key < x.key;
          shot(t, L.cmp, `${key} ${goLeft ? "<" : "≥"} ${x.key}: go ${goLeft ? "left" : "right"}. First y = x, so y remembers this node.`, root, m);
          m.cls[x.id] = "path";
          y = x;
          x = goLeft ? x.left : x.right;
          lab();
          if (!x) m.ghost = { id: y.id, side: goLeft ? "left" : "right", key };
          shot(t, goLeft ? L.left : L.right, x ? `x moves to ${x.key}; y = ${y.key} trails one step behind.` : `x is null: the empty spot is found. y = ${y.key} is the node that gets the new child.`, root, m);
        }
        delete m.ghost;
        const z = mkNode(key);
        z.parent = y;
        let line;
        if (!y) { root = z; line = L.empty; }
        else if (key < y.key) { y.left = z; line = L.yl; }
        else { y.right = z; line = L.yr; }
        m.cls[z.id] = "new";
        m.labels = { [z.id]: "z" };
        f.status = "done";
        shot(t, line, !y ? `y is null, so the tree was empty: ${key} becomes the root.` : `${key} ${key < y.key ? "<" : "≥"} ${y.key}: the new leaf ${key} becomes ${y.key}'s <b>${key < y.key ? "left" : "right"}</b> child. Height now ${heightOf(root)}.`, root, m, "good");
        t.pop();
      });
      t.snap(L.par, `Done. Tree: ${shapeOf(root)}, height ${heightOf(root)}, in-order ${inorderKeys(root).join(" ")}.`, "good", { v: view(root), m: {} });
      return t.snaps;
    },
  });
}

// ---------- Demo: delete (three cases) ----------

function demoDelete(el, { mini = false } = {}) {
  let keys = DELETE_EX.slice(), k = 5;
  makeStepper(el, {
    mini,
    code: CODE.deleteNode,
    renderExtra: renderTree,
    stackLabel: "variables",
    extraControls: `<label>delete <select class="dl-p"><option value="13">13 (case 1: leaf)</option><option value="16">16 (case 2: one child)</option><option value="5" selected>5 (case 3: two children)</option><option value="15">15 (the root)</option><option value="other">another key…</option></select></label>` + numInput("dl-k", "key", k) + keysInput("dl-keys", keys),
    onMount(root, rebuild) {
      if (mini) return;
      const kin = root.querySelector(".dl-k");
      root.querySelector(".dl-p").onchange = (e) => { if (e.target.value !== "other") { k = Number(e.target.value); kin.value = k; rebuild(); } else kin.focus(); };
      kin.onchange = () => { k = Math.trunc(Number(kin.value)); rebuild(); };
      root.querySelector(".dl-keys").onchange = (e) => { keys = readKeys(e.target, DELETE_EX); rebuild(); };
    },
    build() {
      let root = buildTree(keys);
      const t = new Tracer();
      const L = { c3: ln("deleteNode", "if (z.left != null && z.right != null)"), y: ln("deleteNode", "Node y = BstMinMax.findMin"), copy: ln("deleteNode", "z.key = y.key;"), zy: ln("deleteNode", "z = y;"), child: ln("deleteNode", "Node child ="), cp: ln("deleteNode", "child.parent = z.parent;"), isRoot: ln("deleteNode", "if (z.parent == null)"), root: ln("deleteNode", "root = child;"), pl: ln("deleteNode", "z.parent.left = child;"), pr: ln("deleteNode", "z.parent.right = child;") };
      let z = findNode(root, k);
      if (!z) {
        t.push("delete", { z: "?" });
        t.snap(1, `${k} is not in the tree, so delete(${k}) returns false. Keys: ${inorderKeys(root).join(", ")}.`, "bad", { v: view(root), m: {} });
        return t.snaps;
      }
      const f = t.push("delete(z)", { z: z.key });
      const m = { cls: { [z.id]: "cur" }, labels: { [z.id]: "z" } };
      shot(t, 1, `Delete the node z holding ${z.key}. Tree: ${shapeOf(root)}.`, root, m);
      const kids = (z.left ? 1 : 0) + (z.right ? 1 : 0);
      if (kids === 2) {
        shot(t, L.c3, `${z.key} has <b>two children</b>: case 3. It cannot simply be spliced out.`, root, m);
        let y = z.right;
        m.cls[y.id] = "path"; m.labels[y.id] = "y";
        shot(t, L.y, `Its successor y is the minimum of the right subtree: start at ${y.key}…`, root, m);
        while (y.left) {
          delete m.labels[y.id];
          y = y.left;
          m.cls[y.id] = "path"; m.labels[y.id] = "y";
          shot(t, L.y, `…go left to ${y.key}…`, root, m);
        }
        m.cls[y.id] = "found";
        f.vars = { z: z.key, y: y.key };
        shot(t, L.y, `y = ${y.key}. It has <b>no left child</b> (else that child would be smaller), so removing it is case 1 or 2.`, root, m);
        const old = z.key;
        z.key = y.key;
        m.cls[z.id] = "new";
        f.vars = { z: z.key, y: y.key };
        shot(t, L.copy, `Copy y's key into z: the node that held ${old} now holds ${y.key}. It fits: larger than everything on the left, smaller than the rest on the right.`, root, m);
        delete m.labels[z.id];
        z = y;
        m.labels = { ...m.labels, [z.id]: "z" };
        m.cls[z.id] = "cur";
        f.vars = { z: `old node ${z.key}` };
        shot(t, L.zy, `z = y: from here on we remove the old node ${z.key}.`, root, m);
      } else {
        shot(t, L.c3, `${z.key} has ${kids === 0 ? "no children: <b>case 1</b>" : "one child: <b>case 2</b>"}. Skip case 3.`, root, m);
      }
      const child = z.left || z.right;
      if (child) { m.labels[child.id] = "child"; m.cls[child.id] = m.cls[child.id] || "path"; }
      f.vars = { ...f.vars, child: keyStr(child) };
      shot(t, L.child, child ? `z's only child is ${child.key}: its subtree will move up into z's place.` : "z has no child: child = null, and z's parent will simply point to null.", root, m);
      if (child) {
        child.parent = z.parent;
        shot(t, L.cp, `child.parent = z.parent (${keyStr(z.parent)}).`, root, m);
      }
      m.cls[z.id] = "gone";
      const side = !z.parent ? "root" : z === z.parent.left ? "left" : "right";
      shot(t, L.isRoot, side === "root" ? "z is the root: there is no parent link to change; the tree's root field changes instead." : `z is the <b>${side}</b> child of ${z.parent.key}, so ${z.parent.key}.${side} will point to ${child ? child.key : "null"}.`, root, m);
      let line;
      if (side === "root") { root = child; line = L.root; }
      else if (side === "left") { z.parent.left = child; line = L.pl; }
      else { z.parent.right = child; line = L.pr; }
      delete m.labels[z.id];
      f.status = "done";
      shot(t, line, `Spliced out. Tree: ${shapeOf(root)} (height ${heightOf(root)}). In-order: ${inorderKeys(root).join(" ")}.`, root, m, "good");
      return t.snaps;
    },
  });
}

// ---------- a small generic player for demos without code ----------

function makePlayer(el, opts) {
  el.innerHTML = `<div class="pl-view"></div>
    <div class="msg pl-msg"></div>
    <div class="controls">
      <button class="cbtn pl-reset">⟲ Reset</button><button class="cbtn pl-back">◀ Back</button>
      <button class="cbtn pl-step on">Step ▶</button><button class="cbtn pl-play">Play</button>
      ${opts.extraControls || ""}
      <span class="spacer"></span><span class="counter pl-count"></span></div>`;
  const $ = (q) => el.querySelector(q);
  let snaps = [], i = 0, timer = null;
  function render() {
    const s = snaps[i];
    $(".pl-view").innerHTML = opts.render(s);
    $(".pl-msg").innerHTML = s.msg;
    $(".pl-msg").className = "msg pl-msg " + (s.msgCls || "");
    $(".pl-count").textContent = `step ${i + 1} / ${snaps.length}`;
    $(".pl-back").disabled = $(".pl-reset").disabled = i === 0;
    $(".pl-step").disabled = i === snaps.length - 1;
  }
  function stop() { clearInterval(timer); timer = null; $(".pl-play").textContent = "Play"; }
  function rebuild() { stop(); snaps = opts.build(); i = 0; render(); }
  $(".pl-reset").onclick = () => { stop(); i = 0; render(); };
  $(".pl-back").onclick = () => { stop(); if (i > 0) i--; render(); };
  $(".pl-step").onclick = () => { stop(); if (i < snaps.length - 1) i++; render(); };
  $(".pl-play").onclick = () => {
    if (timer) return stop();
    if (i === snaps.length - 1) i = 0;
    $(".pl-play").textContent = "Pause";
    timer = setInterval(() => { if (i < snaps.length - 1) { i++; render(); } else stop(); }, opts.speed || 700);
  };
  el.tabIndex = 0;
  el.addEventListener("keydown", (e) => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "SELECT") return;
    if (e.key === "ArrowRight") { e.preventDefault(); $(".pl-step").click(); }
    if (e.key === "ArrowLeft") { e.preventDefault(); $(".pl-back").click(); }
  });
  if (opts.onMount) opts.onMount(el, rebuild);
  rebuild();
}

// BinarySearchTree.delete (copy-the-successor version), for the side-by-side demos.
function bstDelete(root, key) {
  let z = findNode(root, key);
  if (!z) return { root, note: `${key} is not in the tree` };
  let note;
  if (z.left && z.right) {
    let y = z.right;
    while (y.left) y = y.left;
    note = `${key} has two children: copy its successor ${y.key} into it, remove the old ${y.key}`;
    z.key = y.key;
    z = y;
  } else note = `${key} has ${z.left || z.right ? "one child: splice it out" : "no children: cut it off"}`;
  const child = z.left || z.right;
  if (child) child.parent = z.parent;
  if (!z.parent) root = child;
  else if (z === z.parent.left) z.parent.left = child;
  else z.parent.right = child;
  return { root, note };
}

// ---------- Demo: do deletions commute? ----------

function demoCommute(el) {
  let keys = [4, 2, 6, 5, 8, 7], a = 5, b = 6, op = "delete";
  makePlayer(el, {
    extraControls: `<label><select class="cm-op"><option value="delete">delete</option><option value="insert">insert</option></select></label>` + numInput("cm-a", "a", a) + numInput("cm-b", "b", b) + keysInput("cm-keys", keys),
    onMount(root, rebuild) {
      root.querySelector(".cm-op").onchange = (e) => {
        op = e.target.value;
        if (op === "insert" && a === 5 && b === 6) { keys = [4, 2, 6]; a = 7; b = 8; }
        if (op === "delete" && a === 7 && b === 8) { keys = [4, 2, 6, 5, 8, 7]; a = 5; b = 6; }
        root.querySelector(".cm-a").value = a; root.querySelector(".cm-b").value = b; root.querySelector(".cm-keys").value = keys.join(", ");
        rebuild();
      };
      root.querySelector(".cm-a").onchange = (e) => { a = Math.trunc(Number(e.target.value)); rebuild(); };
      root.querySelector(".cm-b").onchange = (e) => { b = Math.trunc(Number(e.target.value)); rebuild(); };
      root.querySelector(".cm-keys").onchange = (e) => { keys = readKeys(e.target, [4, 2, 6, 5, 8, 7]); rebuild(); };
    },
    render: (s) => `<div class="l14-two">${s.sides.map((d) => `<div><div class="l14-cap">${d.cap}</div><div class="svgbox">${treeSVG(d.v, d.m)}</div><div class="l14-shape">${esc(d.shape)}</div></div>`).join("")}</div>`,
    build() {
      const snaps = [];
      let r1 = buildTree(keys), r2 = buildTree(keys);
      const cap1 = `${op} ${a}, then ${b}`, cap2 = `${op} ${b}, then ${a}`;
      const doOp = (r, k) => (op === "delete" ? bstDelete(r, k) : { root: bstInsert(r, k), note: `${k} becomes a new leaf` });
      const sides = (m1 = {}, m2 = {}) => [{ cap: cap1, v: view(r1), m: m1, shape: shapeOf(r1) }, { cap: cap2, v: view(r2), m: m2, shape: shapeOf(r2) }];
      const hl = (r, k) => { const n = findNode(r, k); return n ? { cls: { [n.id]: op === "delete" ? "gone" : "new" } } : {}; };
      snaps.push({ sides: sides(hl(r1, a), hl(r2, b)), msg: `Same start tree on both sides. Left: ${op} ${a} first. Right: ${op} ${b} first.` });
      let s1 = doOp(r1, a); r1 = s1.root; let s2 = doOp(r2, b); r2 = s2.root;
      snaps.push({ sides: sides(op === "insert" ? hl(r1, a) : hl(r1, b), op === "insert" ? hl(r2, b) : hl(r2, a)), msg: `Left: ${s1.note}. Right: ${s2.note}.` });
      s1 = doOp(r1, b); r1 = s1.root; s2 = doOp(r2, a); r2 = s2.root;
      const same = shapeOf(r1) === shapeOf(r2);
      snaps.push({ sides: sides(op === "insert" ? hl(r1, b) : {}, op === "insert" ? hl(r2, a) : {}), msg: `Left: ${s1.note}. Right: ${s2.note}.` });
      snaps.push({ sides: sides(), msg: same ? `Same tree: for these keys the two orders commute. In-order: ${inorderKeys(r1).join(" ")}.` : `<b>Different shapes</b> (heights ${heightOf(r1)} and ${heightOf(r2)}), but the same keys in-order: ${inorderKeys(r1).join(" ")} / ${inorderKeys(r2).join(" ")}. The operations do not commute.`, msgCls: same ? "good" : "bad" });
      return snaps;
    },
  });
}

// ---------- Demo: sorting with a BST ----------

const SORT_PRESETS = { slide: [15, 6, 18, 3, 7, 17, 20, 2, 4], sorted: [1, 2, 3, 4, 5, 6, 7, 8], balanced: [8, 4, 12, 2, 6, 10, 14, 1, 3, 5, 7] };

function demoTreeSort(el) {
  let data = SORT_PRESETS.slide.slice();
  makePlayer(el, {
    speed: 600,
    extraControls: `<label>input <select class="ts-p"><option value="slide">15, 6, 18, …</option><option value="sorted">already sorted</option><option value="balanced">balanced order</option></select></label>
      <label>array <input type="text" class="l14-keys ts-d" value="${data.join(", ")}"></label>`,
    onMount(root, rebuild) {
      const d = root.querySelector(".ts-d");
      root.querySelector(".ts-p").onchange = (e) => { data = SORT_PRESETS[e.target.value].slice(); d.value = data.join(", "); rebuild(); };
      d.onchange = () => { data = readKeys(d, SORT_PRESETS.slide, 15); rebuild(); };
    },
    render: (s) => `<div class="svgbox">${treeSVG(s.v, s.m)}</div>
      <div class="l14-out">${s.out.map((x) => `<div class="cell found">${x}</div>`).join("") || `<span class="counter">output array fills during the in-order walk</span>`}</div>
      <div class="stats"><div class="stat"><small>comparisons</small><b>${s.cmp}</b></div><div class="stat"><small>height</small><b>${s.h}</b></div><div class="stat"><small>n(n−1)/2</small><b>${data.length * (data.length - 1) / 2}</b></div></div>`,
    build() {
      const snaps = [];
      let root = null, cmp = 0;
      const push = (msg, m = {}, out = [], cls = "") => snaps.push({ v: view(root), m, out: out.slice(), cmp, h: heightOf(root), msg, msgCls: cls });
      push(`Phase 1: insert ${data.join(", ")} one by one into an empty BST.`);
      data.forEach((k) => {
        let x = root, c = 0;
        const z = mkNode(k);
        let y = null;
        while (x) { y = x; c++; x = k < x.key ? x.left : x.right; }
        cmp += c;
        z.parent = y;
        if (!y) root = z; else if (k < y.key) y.left = z; else y.right = z;
        push(`insert ${k}: ${c} comparison${c === 1 ? "" : "s"} on the way down (its depth).`, { cls: { [z.id]: "new" } });
      });
      const out = [];
      const cls = {};
      push(`Phase 2: walk the tree in-order (left subtree, node, right subtree) into the array.`, {}, out);
      (function walk(n) {
        if (!n) return;
        walk(n.left);
        out.push(n.key);
        cls[n.id] = "found";
        push(`Output ${n.key}.`, { cls: { ...cls } }, out);
        walk(n.right);
      })(root);
      snaps[snaps.length - 1].msg = `Sorted: ${out.join(", ")}. ${cmp} comparisons for ${data.length} keys${cmp === data.length * (data.length - 1) / 2 && data.length > 2 ? " — the worst case, n(n−1)/2: sorted input builds a chain" : ""}.`;
      snaps[snaps.length - 1].msgCls = "good";
      return snaps;
    },
  });
}

// ---------- Demo: lowest common ancestor ----------

const LCA_TREES = {
  one: ["slide tree 1", [25, 20, 30, 10, 23, 35, 5, 21, 32], [5, 21]],
  two: ["slide tree 2", [15, 10, 20, 5, 13, 12, 14], [5, 14]],
};

function demoLca(el, { mini = false } = {}) {
  let which = mini ? "two" : "one", a = LCA_TREES[which][2][0], b = LCA_TREES[which][2][1];
  makeStepper(el, {
    mini,
    code: CODE.lca,
    renderExtra: renderTree,
    stackLabel: "variables",
    extraControls: `<label>tree <select class="lc-t"><option value="one">${LCA_TREES.one[0]}</option><option value="two">${LCA_TREES.two[0]}</option></select></label>` + numInput("lc-a", "a", a) + numInput("lc-b", "b", b),
    onMount(root, rebuild) {
      if (mini) return;
      const ai = root.querySelector(".lc-a"), bi = root.querySelector(".lc-b");
      root.querySelector(".lc-t").onchange = (e) => { which = e.target.value; [a, b] = LCA_TREES[which][2]; ai.value = a; bi.value = b; rebuild(); };
      ai.onchange = () => { a = Math.trunc(Number(ai.value)); rebuild(); };
      bi.onchange = () => { b = Math.trunc(Number(bi.value)); rebuild(); };
    },
    build() {
      const root = buildTree(LCA_TREES[which][1]);
      const t = new Tracer();
      const L = { both: ln("lca", "if (a < x.key && b < x.key)"), left: ln("lca", "x = x.left;"), rboth: ln("lca", "else if (a > x.key && b > x.key)"), right: ln("lca", "x = x.right;"), ret: ln("lca", "return x;") };
      const m = { cls: {}, labels: {} };
      const na = findNode(root, a), nb = findNode(root, b);
      if (na) m.cls[na.id] = "target";
      if (nb) m.cls[nb.id] = "target";
      let x = root;
      const f = t.push("lca", { x: keyStr(x), a, b });
      const at = () => { if (x) { m.cls[x.id] = "cur"; m.labels = { [x.id]: "x" }; } f.vars.x = keyStr(x); };
      at();
      shot(t, 1, `LCA(${a}, ${b}): start at the root. The dashed nodes are ${a} and ${b}.${!na || !nb ? " (One of them is not in the tree: the answer below is only where the searches part.)" : ""}`, root, m, !na || !nb ? "bad" : "");
      while (x) {
        if (a < x.key && b < x.key) {
          shot(t, L.both, `${a} and ${b} are both smaller than ${x.key}: both are in the left subtree, and so is their LCA.`, root, m);
          m.cls[x.id] = "path"; x = x.left; at();
          shot(t, L.left, `x = x.left = ${keyStr(x)}.`, root, m);
        } else if (a > x.key && b > x.key) {
          shot(t, L.rboth, `${a} and ${b} are both larger than ${x.key}: go right.`, root, m);
          m.cls[x.id] = "path"; x = x.right; at();
          shot(t, L.right, `x = x.right = ${keyStr(x)}.`, root, m);
        } else {
          shot(t, L.rboth, a === x.key || b === x.key ? `${x.key} is one of the two keys, and the other is below it.` : `${Math.min(a, b)} < ${x.key} < ${Math.max(a, b)}: the two keys are on different sides of ${x.key}. The searches part here.`, root, m);
          m.cls[x.id] = "found";
          f.status = `returns node ${x.key}`;
          shot(t, L.ret, `LCA(${a}, ${b}) = <b>${x.key}</b>.`, root, m, "good");
          return t.snaps;
        }
      }
      f.status = "returns null";
      t.snap(ln("lca", "return null;"), "Fell off the tree: return null.", "bad", { v: view(root), m });
      return t.snaps;
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
  bstCheck: (el) => demoBstCheck(el),
  search: (el) => demoSearch(el),
  searchMini: (el) => demoSearch(el, { mini: true }),
  minMax: (el) => demoMinMax(el),
  succ: (el) => demoSucc(el),
  succMini: (el) => demoSucc(el, { mini: true }),
  insert: (el) => demoInsert(el),
  insertMini: (el) => demoInsert(el, { mini: true }),
  del: (el) => demoDelete(el),
  delMini: (el) => demoDelete(el, { mini: true }),
  commute: (el) => demoCommute(el),
  treeSort: (el) => demoTreeSort(el),
  lca: (el) => demoLca(el),
  lcaMini: (el) => demoLca(el, { mini: true }),
  quiz: (el) => demoQuiz(el, QUIZ),
};
