// Interactive demos for Lecture 15. Every code panel and output is copied from
// notes/L15-avl-trees.md (checked by tools/check.py); the JS engine below replays AvlTree
// step by step, with the same rotation choices and the same log lines.

const CODE = {
  avlNode: `/** A node of a binary search tree that also records its height. */
class AvlNode<T> {
    T element;
    AvlNode<T> left;
    AvlNode<T> right;
    int height;

    AvlNode(T element) {
        this(element, null, null);
    }

    AvlNode(T element, AvlNode<T> left, AvlNode<T> right) {
        this.element = element;
        this.left = left;
        this.right = right;
        this.height = Math.max(height(left), height(right)) + 1;
    }

    /** The height of a subtree: -1 for the empty tree, 0 for a leaf. */
    static int height(AvlNode<?> t) {
        return t == null ? -1 : t.height;
    }
}`,
  treeText: `/** Text views of a tree, and a checker for the AVL properties. */
class TreeText {
    /** One-line form: key(left,right), with - for an empty subtree. */
    static String show(AvlNode<?> t) {
        if (t == null) {
            return "-";
        }
        if (t.left == null && t.right == null) {
            return String.valueOf(t.element);
        }
        return t.element + "(" + show(t.left) + "," + show(t.right) + ")";
    }

    /** balance(t) = height(t.left) - height(t.right). */
    static int balance(AvlNode<?> t) {
        return AvlNode.height(t.left) - AvlNode.height(t.right);
    }

    /** Every node in key order, with its height and balance factor. */
    static String table(AvlNode<?> t) {
        StringBuilder sb = new StringBuilder("key  height  balance\\n");
        addRows(t, sb);
        return sb.toString();
    }

    private static void addRows(AvlNode<?> t, StringBuilder sb) {
        if (t == null) {
            return;
        }
        addRows(t.left, sb);
        int b = balance(t);
        sb.append(String.format("%3s %7d %8s%s%n", t.element, t.height,
                (b > 0 ? "+" : "") + b, Math.abs(b) > 1 ? "  <- unbalanced" : ""));
        addRows(t.right, sb);
    }

    /** True if t is a BST, every stored height is right, and every balance is -1, 0 or +1. */
    static <T extends Comparable<? super T>> boolean isAvl(AvlNode<T> t) {
        return check(t, null, null) != BROKEN;
    }

    private static final int BROKEN = -2;

    /** Returns the height of t, or BROKEN. All keys must lie strictly between lo and hi. */
    private static <T extends Comparable<? super T>> int check(AvlNode<T> t, T lo, T hi) {
        if (t == null) {
            return -1;
        }
        if (lo != null && t.element.compareTo(lo) <= 0 || hi != null && t.element.compareTo(hi) >= 0) {
            return BROKEN;
        }
        int hl = check(t.left, lo, t.element);
        int hr = check(t.right, t.element, hi);
        if (hl == BROKEN || hr == BROKEN || Math.abs(hl - hr) > 1 || t.height != Math.max(hl, hr) + 1) {
            return BROKEN;
        }
        return t.height;
    }
}`,
  plainBst: `/** A binary search tree of ints with no balancing, for comparison. */
class PlainBst {
    private AvlNode<Integer> root;

    void insert(int x) {
        root = insert(x, root);
    }

    private static AvlNode<Integer> insert(int x, AvlNode<Integer> t) {
        if (t == null) {
            return new AvlNode<>(x);
        }
        if (x < t.element) {
            t.left = insert(x, t.left);
        } else if (x > t.element) {
            t.right = insert(x, t.right);
        }                                   // x == t.element: duplicate, do nothing
        t.height = Math.max(AvlNode.height(t.left), AvlNode.height(t.right)) + 1;
        return t;
    }

    int height() {
        return AvlNode.height(root);
    }

    String table() {
        return TreeText.table(root);
    }

    @Override
    public String toString() {
        return TreeText.show(root);
    }
}`,
  shapes: `public class Shapes {
    static PlainBst build(int... keys) {
        PlainBst t = new PlainBst();
        for (int k : keys) {
            t.insert(k);
        }
        return t;
    }

    public static void main(String[] args) {
        PlainBst good = build(4, 2, 6, 1, 3, 5, 7);
        PlainBst bad = build(1, 2, 3, 4, 5, 6, 7);
        System.out.println(good + "  height " + good.height());
        System.out.println(bad + "  height " + bad.height());
        PlainBst chain = build(2, 4, 6, 8, 10);
        System.out.println(chain + "  height " + chain.height());
    }
}`,
  balanceFactors: `public class BalanceFactors {
    static PlainBst build(int... keys) {
        PlainBst t = new PlainBst();
        for (int k : keys) {
            t.insert(k);
        }
        return t;
    }

    public static void main(String[] args) {
        PlainBst a = build(6, 4, 8, 1, 7, 11, 10, 12);
        System.out.println(a);
        System.out.print(a.table());
        PlainBst b = build(6, 4, 8, 1, 5, 7, 11, 3, 2);
        System.out.println(b);
        System.out.print(b.table());
    }
}`,
  minNodes: `public class MinNodes {
    public static void main(String[] args) {
        long[] fib = new long[50];
        fib[1] = 1;
        fib[2] = 1;
        for (int k = 3; k < fib.length; k++) {
            fib[k] = fib[k - 1] + fib[k - 2];
        }
        long[] minNodes = new long[40];
        minNodes[0] = 1;
        minNodes[1] = 2;
        for (int h = 2; h < minNodes.length; h++) {
            minNodes[h] = minNodes[h - 1] + minNodes[h - 2] + 1;
        }
        System.out.println(" h   N(h)  F(h+3)-1  2^(h+1)-1");
        for (int h = 0; h <= 10; h++) {
            System.out.printf("%2d %6d %9d %10d%n", h, minNodes[h], fib[h + 3] - 1, (1L << (h + 1)) - 1);
        }
        long n = 1_000_000;
        int h = 0;
        while (minNodes[h + 1] <= n) {
            h++;
        }
        System.out.println("tallest AVL tree with " + n + " nodes: height " + h);
        System.out.println("shortest tree with " + n + " nodes: height "
                + (63 - Long.numberOfLeadingZeros(n)));
    }
}`,
  rotations: `/** The four AVL rotations. Each returns the new root of the rotated subtree. */
class Rotations {
    private static int height(AvlNode<?> t) {
        return AvlNode.height(t);
    }

    /** Left-left case: right rotation at k2. k2's left child k1 becomes the subtree root. */
    static <T> AvlNode<T> rotateWithLeftChild(AvlNode<T> k2) {
        AvlNode<T> k1 = k2.left;
        k2.left = k1.right;
        k1.right = k2;
        k2.height = Math.max(height(k2.left), height(k2.right)) + 1;
        k1.height = Math.max(height(k1.left), k2.height) + 1;
        return k1;
    }

    /** Right-right case: left rotation at k1. k1's right child k2 becomes the subtree root. */
    static <T> AvlNode<T> rotateWithRightChild(AvlNode<T> k1) {
        AvlNode<T> k2 = k1.right;
        k1.right = k2.left;
        k2.left = k1;
        k1.height = Math.max(height(k1.left), height(k1.right)) + 1;
        k2.height = Math.max(height(k2.right), k1.height) + 1;
        return k2;
    }

    /** Left-right case: left rotation at k3's left child, then right rotation at k3. */
    static <T> AvlNode<T> doubleWithLeftChild(AvlNode<T> k3) {
        k3.left = rotateWithRightChild(k3.left);
        return rotateWithLeftChild(k3);
    }

    /** Right-left case: right rotation at k1's right child, then left rotation at k1. */
    static <T> AvlNode<T> doubleWithRightChild(AvlNode<T> k1) {
        k1.right = rotateWithLeftChild(k1.right);
        return rotateWithRightChild(k1);
    }
}`,
  rotationDemo: `public class RotationDemo {
    static AvlNode<Integer> n(int key, AvlNode<Integer> left, AvlNode<Integer> right) {
        return new AvlNode<>(key, left, right);
    }

    static AvlNode<Integer> leaf(int key) {
        return new AvlNode<>(key);
    }

    public static void main(String[] args) {
        AvlNode<Integer> ll = n(30, n(15, n(13, leaf(5), null), leaf(16)), leaf(40));
        System.out.println("before: " + TreeText.show(ll) + "  balance(30) = " + TreeText.balance(ll));
        ll = Rotations.rotateWithLeftChild(ll);
        System.out.println("after:  " + TreeText.show(ll) + "  AVL? " + TreeText.isAvl(ll));

        AvlNode<Integer> rl = n(7, leaf(4), n(12, n(11, leaf(8), null), leaf(13)));
        System.out.println("before: " + TreeText.show(rl) + "  balance(7) = " + TreeText.balance(rl));
        AvlNode<Integer> wrong = Rotations.rotateWithRightChild(
                n(7, leaf(4), n(12, n(11, leaf(8), null), leaf(13))));
        System.out.println("single: " + TreeText.show(wrong) + "  AVL? " + TreeText.isAvl(wrong));
        rl = Rotations.doubleWithRightChild(rl);
        System.out.println("double: " + TreeText.show(rl) + "  AVL? " + TreeText.isAvl(rl));
        System.out.print(TreeText.table(rl));
    }
}`,
  avlTreeV1: `import java.util.ArrayList;
import java.util.List;

/** An AVL tree: insertion as on the slides. */
public class AvlTree<T extends Comparable<? super T>> {
    private AvlNode<T> root;
    private final List<String> log = new ArrayList<>();

    public void insert(T x) {
        root = insert(x, root);
    }

    private AvlNode<T> insert(T x, AvlNode<T> t) {
        if (t == null) {
            return new AvlNode<>(x);
        }
        int cmp = x.compareTo(t.element);
        if (cmp < 0) {
            t.left = insert(x, t.left);
            if (height(t.left) - height(t.right) == 2) {
                if (x.compareTo(t.left.element) < 0) {
                    log.add("left-left at " + t.element + ": single rotation");
                    t = Rotations.rotateWithLeftChild(t);
                } else {
                    log.add("left-right at " + t.element + ": double rotation");
                    t = Rotations.doubleWithLeftChild(t);
                }
            }
        } else if (cmp > 0) {
            t.right = insert(x, t.right);
            if (height(t.right) - height(t.left) == 2) {
                if (x.compareTo(t.right.element) > 0) {
                    log.add("right-right at " + t.element + ": single rotation");
                    t = Rotations.rotateWithRightChild(t);
                } else {
                    log.add("right-left at " + t.element + ": double rotation");
                    t = Rotations.doubleWithRightChild(t);
                }
            }
        }                                   // cmp == 0: duplicate, do nothing
        t.height = Math.max(height(t.left), height(t.right)) + 1;
        return t;
    }

    public boolean contains(T x) {
        AvlNode<T> t = root;
        while (t != null) {
            int cmp = x.compareTo(t.element);
            if (cmp == 0) {
                return true;
            }
            t = cmp < 0 ? t.left : t.right;
        }
        return false;
    }

    private static int height(AvlNode<?> t) {
        return AvlNode.height(t);
    }

    public int height() {
        return height(root);
    }

    public boolean isAvl() {
        return TreeText.isAvl(root);
    }

    /** The rebalancing steps since the last call, then forget them. */
    public List<String> takeLog() {
        List<String> steps = new ArrayList<>(log);
        log.clear();
        return steps;
    }

    @Override
    public String toString() {
        return TreeText.show(root);
    }
}`,
  insertDemo: `import java.util.List;

public class InsertDemo {
    static AvlTree<Integer> build(int... keys) {
        AvlTree<Integer> t = new AvlTree<>();
        for (int k : keys) {
            t.insert(k);
        }
        t.takeLog();
        return t;
    }

    static void insert(AvlTree<Integer> t, int key) {
        t.insert(key);
        List<String> steps = t.takeLog();
        System.out.println("insert " + key + ": " + t + (steps.isEmpty() ? "" : "   " + steps));
    }

    public static void main(String[] args) {
        AvlTree<Integer> a = build(3, 2, 7, 5);
        System.out.println("start:     " + a);
        insert(a, 9);
        insert(a, 4);

        AvlTree<Integer> b = build(20, 10, 30, 5, 25, 35);
        System.out.println("start:     " + b);
        insert(b, 40);
        insert(b, 45);
        insert(b, 34);

        AvlTree<Integer> c = build(30, 15, 40, 13, 16);
        System.out.println("start:     " + c);
        insert(c, 5);

        AvlTree<Integer> d = build(14, 7, 17, 4, 12, 53, 11, 13);
        System.out.println("start:     " + d);
        insert(d, 8);
        System.out.println("all AVL? " + (a.isAvl() && b.isAvl() && c.isAvl() && d.isAvl()));
    }
}`,
  sortedInsert: `import java.util.List;

public class SortedInsert {
    public static void main(String[] args) {
        AvlTree<Integer> t = new AvlTree<>();
        for (int k = 1; k <= 7; k++) {
            t.insert(k);
            List<String> steps = t.takeLog();
            System.out.println("insert " + k + ": " + t + (steps.isEmpty() ? "" : "   " + steps));
        }
        for (int n : new int[] {1023, 100_000}) {
            AvlTree<Integer> big = new AvlTree<>();
            for (int k = 1; k <= n; k++) {
                big.insert(k);
            }
            System.out.println(n + " sorted keys: AVL height " + big.height()
                    + ", rotations " + big.takeLog().size() + ", a plain BST would have height " + (n - 1));
        }
    }
}`,
  avlTree: `import java.util.ArrayList;
import java.util.List;

/** An AVL tree with insertion, deletion and search. */
public class AvlTree<T extends Comparable<? super T>> {
    private static final int ALLOWED_IMBALANCE = 1;

    private AvlNode<T> root;
    private final List<String> log = new ArrayList<>();

    public void insert(T x) {
        root = insert(x, root);
    }

    public void remove(T x) {
        root = remove(x, root);
    }

    private AvlNode<T> insert(T x, AvlNode<T> t) {
        if (t == null) {
            return new AvlNode<>(x);
        }
        int cmp = x.compareTo(t.element);
        if (cmp < 0) {
            t.left = insert(x, t.left);
        } else if (cmp > 0) {
            t.right = insert(x, t.right);
        }                                   // cmp == 0: duplicate, do nothing
        return balance(t);
    }

    private AvlNode<T> remove(T x, AvlNode<T> t) {
        if (t == null) {
            return null;                    // not found: do nothing
        }
        int cmp = x.compareTo(t.element);
        if (cmp < 0) {
            t.left = remove(x, t.left);
        } else if (cmp > 0) {
            t.right = remove(x, t.right);
        } else if (t.left != null && t.right != null) {
            t.element = findMin(t.right).element;   // two children: copy the successor
            t.right = remove(t.element, t.right);   // then delete the successor
        } else {
            t = (t.left != null) ? t.left : t.right; // zero or one child
        }
        return balance(t);
    }

    /** Restore the balance condition at t (its subtrees are AVL trees) and fix its height. */
    private AvlNode<T> balance(AvlNode<T> t) {
        if (t == null) {
            return null;
        }
        if (height(t.left) - height(t.right) > ALLOWED_IMBALANCE) {
            if (height(t.left.left) >= height(t.left.right)) {
                log.add("left-left at " + t.element + ": single rotation");
                t = Rotations.rotateWithLeftChild(t);
            } else {
                log.add("left-right at " + t.element + ": double rotation");
                t = Rotations.doubleWithLeftChild(t);
            }
        } else if (height(t.right) - height(t.left) > ALLOWED_IMBALANCE) {
            if (height(t.right.right) >= height(t.right.left)) {
                log.add("right-right at " + t.element + ": single rotation");
                t = Rotations.rotateWithRightChild(t);
            } else {
                log.add("right-left at " + t.element + ": double rotation");
                t = Rotations.doubleWithRightChild(t);
            }
        }
        t.height = Math.max(height(t.left), height(t.right)) + 1;
        return t;
    }

    private static <T> AvlNode<T> findMin(AvlNode<T> t) {
        while (t.left != null) {
            t = t.left;
        }
        return t;
    }

    public boolean contains(T x) {
        AvlNode<T> t = root;
        while (t != null) {
            int cmp = x.compareTo(t.element);
            if (cmp == 0) {
                return true;
            }
            t = cmp < 0 ? t.left : t.right;
        }
        return false;
    }

    private static int height(AvlNode<?> t) {
        return AvlNode.height(t);
    }

    public int height() {
        return height(root);
    }

    public int size() {
        return size(root);
    }

    private static int size(AvlNode<?> t) {
        return t == null ? 0 : 1 + size(t.left) + size(t.right);
    }

    public boolean isAvl() {
        return TreeText.isAvl(root);
    }

    public String table() {
        return TreeText.table(root);
    }

    /** The rebalancing steps since the last call, then forget them. */
    public List<String> takeLog() {
        List<String> steps = new ArrayList<>(log);
        log.clear();
        return steps;
    }

    @Override
    public String toString() {
        return TreeText.show(root);
    }
}`,
  deleteDemo: `import java.util.List;

public class DeleteDemo {
    static AvlTree<Integer> build(int... keys) {
        AvlTree<Integer> t = new AvlTree<>();
        for (int k : keys) {
            t.insert(k);
        }
        t.takeLog();
        return t;
    }

    static void remove(AvlTree<Integer> t, int key) {
        t.remove(key);
        List<String> steps = t.takeLog();
        System.out.println("delete " + key + ": " + t + (steps.isEmpty() ? "" : "   " + steps));
    }

    public static void main(String[] args) {
        int[] small = {10, 5, 15, 2, 9, 12, 20, 3, 17, 30};
        AvlTree<Integer> a = build(small);
        System.out.println("start:     " + a);
        remove(a, 17);

        AvlTree<Integer> b = build(small);
        remove(b, 15);
        remove(b, 12);

        AvlTree<Integer> c = build(10, 5, 17, 2, 9, 12, 20, 3, 11, 15, 18, 30, 13, 33);
        System.out.println("start:     " + c + "  height " + c.height());
        remove(c, 9);
        System.out.println("height " + c.height() + ", AVL? " + c.isAvl());
    }
}`,
  randomTest: `import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Random;
import java.util.Set;

public class RandomTest {
    public static void main(String[] args) {
        Random rng = new Random(2026);
        Set<Integer> distinct = new LinkedHashSet<>();
        while (distinct.size() < 100_000) {
            distinct.add(rng.nextInt(1_000_000));
        }
        List<Integer> keys = new ArrayList<>(distinct);   // 100000 different keys, random order
        AvlTree<Integer> t = new AvlTree<>();
        for (int k : keys) {
            t.insert(k);
        }
        report("after 100000 inserts", t);
        for (int i = 0; i < keys.size(); i += 2) {
            t.remove(keys.get(i));
        }
        report("after 50000 deletes", t);
        boolean ok = true;
        for (int i = 0; i < keys.size(); i++) {
            ok &= t.contains(keys.get(i)) == (i % 2 == 1);
        }
        System.out.println("exactly the remaining keys are found? " + ok);
    }

    static void report(String what, AvlTree<Integer> t) {
        int n = t.size();
        double bound = 1.44 * Math.log(n + 2) / Math.log(2);
        System.out.printf("%s: n = %d, height = %d, 1.44 log2(n+2) = %.1f, log2 n = %.1f, AVL? %b, rotations %d%n",
                what, n, t.height(), bound, Math.log(n) / Math.log(2), t.isAvl(), t.takeLog().size());
    }
}`,
  exerciseRuns: `import java.util.List;

public class ExerciseRuns {
    static void run(String title, AvlTree<Integer> t, int[] inserts, int[] deletes) {
        System.out.println(title);
        for (int k : inserts) {
            t.insert(k);
            List<String> steps = t.takeLog();
            if (deletes.length == 0) {
                System.out.println("  insert " + k + ": " + t + (steps.isEmpty() ? "" : "   " + steps));
            }
        }
        if (deletes.length > 0) {
            System.out.println("  start: " + t);
        }
        for (int k : deletes) {
            t.remove(k);
            List<String> steps = t.takeLog();
            System.out.println("  delete " + k + ": " + t + (steps.isEmpty() ? "" : "   " + steps));
        }
    }

    public static void main(String[] args) {
        run("Exercise 2", new AvlTree<>(), new int[] {8, 4, 12, 2, 6, 10, 1, 3, 0}, new int[] {});
        run("Exercise 3", new AvlTree<>(), new int[] {50, 25, 10, 5, 7, 3, 30, 20, 8, 15, 60, 70, 80}, new int[] {});
        int[] perfect = new int[15];
        for (int i = 0; i < 15; i++) {
            perfect[i] = i + 1;
        }
        run("Exercise 4", new AvlTree<>(), perfect, new int[] {1, 3, 2, 5, 7, 6});
    }
}`,
  fibTrees: `import java.util.List;

public class FibTrees {
    static int next;

    /** A smallest AVL tree of height h, keys next, next+1, ... in order. */
    static AvlNode<Integer> fibTree(int h) {
        if (h < 0) {
            return null;
        }
        AvlNode<Integer> left = fibTree(h - 1);
        int key = next++;
        AvlNode<Integer> right = fibTree(h - 2);
        return new AvlNode<>(key, left, right);
    }

    static int size(AvlNode<?> t) {
        return t == null ? 0 : 1 + size(t.left) + size(t.right);
    }

    public static void main(String[] args) {
        for (int h = 0; h <= 6; h++) {
            next = 1;
            AvlNode<Integer> t = fibTree(h);
            System.out.println("h = " + h + ": " + size(t) + " nodes, AVL? " + TreeText.isAvl(t));
        }
        next = 1;
        AvlNode<Integer> t4 = fibTree(4);
        System.out.println(TreeText.show(t4));

        AvlTree<Integer> tree = new AvlTree<>();
        next = 1;
        insertLevelOrder(tree, fibTree(6));
        System.out.println("Fibonacci tree of height 6: " + tree.size() + " nodes, height " + tree.height()
                + ", rotations while building " + tree.takeLog().size());
        tree.remove(tree.size());
        List<String> steps = tree.takeLog();
        System.out.println("delete the largest key: " + steps.size() + " rotations " + steps);
        System.out.println("height now " + tree.height() + ", AVL? " + tree.isAvl());
    }

    /** Insert the keys of t level by level, top to bottom, left to right. */
    static void insertLevelOrder(AvlTree<Integer> tree, AvlNode<Integer> t) {
        java.util.ArrayDeque<AvlNode<Integer>> queue = new java.util.ArrayDeque<>();
        queue.add(t);
        while (!queue.isEmpty()) {
            AvlNode<Integer> node = queue.remove();
            tree.insert(node.element);
            if (node.left != null) {
                queue.add(node.left);
            }
            if (node.right != null) {
                queue.add(node.right);
            }
        }
    }
}`,
  rotateWithLeftChild: `/** Left-left case: right rotation at k2. k2's left child k1 becomes the subtree root. */
static <T> AvlNode<T> rotateWithLeftChild(AvlNode<T> k2) {
    AvlNode<T> k1 = k2.left;
    k2.left = k1.right;
    k1.right = k2;
    k2.height = Math.max(height(k2.left), height(k2.right)) + 1;
    k1.height = Math.max(height(k1.left), k2.height) + 1;
    return k1;
}`,
  rotateWithRightChild: `/** Right-right case: left rotation at k1. k1's right child k2 becomes the subtree root. */
static <T> AvlNode<T> rotateWithRightChild(AvlNode<T> k1) {
    AvlNode<T> k2 = k1.right;
    k1.right = k2.left;
    k2.left = k1;
    k1.height = Math.max(height(k1.left), height(k1.right)) + 1;
    k2.height = Math.max(height(k2.right), k1.height) + 1;
    return k2;
}`,
  doubleWithLeftChild: `/** Left-right case: left rotation at k3's left child, then right rotation at k3. */
static <T> AvlNode<T> doubleWithLeftChild(AvlNode<T> k3) {
    k3.left = rotateWithRightChild(k3.left);
    return rotateWithLeftChild(k3);
}`,
  doubleWithRightChild: `/** Right-left case: right rotation at k1's right child, then left rotation at k1. */
static <T> AvlNode<T> doubleWithRightChild(AvlNode<T> k1) {
    k1.right = rotateWithLeftChild(k1.right);
    return rotateWithRightChild(k1);
}`,
  insertV1: `private AvlNode<T> insert(T x, AvlNode<T> t) {
    if (t == null) {
        return new AvlNode<>(x);
    }
    int cmp = x.compareTo(t.element);
    if (cmp < 0) {
        t.left = insert(x, t.left);
        if (height(t.left) - height(t.right) == 2) {
            if (x.compareTo(t.left.element) < 0) {
                log.add("left-left at " + t.element + ": single rotation");
                t = Rotations.rotateWithLeftChild(t);
            } else {
                log.add("left-right at " + t.element + ": double rotation");
                t = Rotations.doubleWithLeftChild(t);
            }
        }
    } else if (cmp > 0) {
        t.right = insert(x, t.right);
        if (height(t.right) - height(t.left) == 2) {
            if (x.compareTo(t.right.element) > 0) {
                log.add("right-right at " + t.element + ": single rotation");
                t = Rotations.rotateWithRightChild(t);
            } else {
                log.add("right-left at " + t.element + ": double rotation");
                t = Rotations.doubleWithRightChild(t);
            }
        }
    }                                   // cmp == 0: duplicate, do nothing
    t.height = Math.max(height(t.left), height(t.right)) + 1;
    return t;
}`,
  insertV2: `private AvlNode<T> insert(T x, AvlNode<T> t) {
    if (t == null) {
        return new AvlNode<>(x);
    }
    int cmp = x.compareTo(t.element);
    if (cmp < 0) {
        t.left = insert(x, t.left);
    } else if (cmp > 0) {
        t.right = insert(x, t.right);
    }                                   // cmp == 0: duplicate, do nothing
    return balance(t);
}`,
  remove: `private AvlNode<T> remove(T x, AvlNode<T> t) {
    if (t == null) {
        return null;                    // not found: do nothing
    }
    int cmp = x.compareTo(t.element);
    if (cmp < 0) {
        t.left = remove(x, t.left);
    } else if (cmp > 0) {
        t.right = remove(x, t.right);
    } else if (t.left != null && t.right != null) {
        t.element = findMin(t.right).element;   // two children: copy the successor
        t.right = remove(t.element, t.right);   // then delete the successor
    } else {
        t = (t.left != null) ? t.left : t.right; // zero or one child
    }
    return balance(t);
}`,
  balance: `/** Restore the balance condition at t (its subtrees are AVL trees) and fix its height. */
private AvlNode<T> balance(AvlNode<T> t) {
    if (t == null) {
        return null;
    }
    if (height(t.left) - height(t.right) > ALLOWED_IMBALANCE) {
        if (height(t.left.left) >= height(t.left.right)) {
            log.add("left-left at " + t.element + ": single rotation");
            t = Rotations.rotateWithLeftChild(t);
        } else {
            log.add("left-right at " + t.element + ": double rotation");
            t = Rotations.doubleWithLeftChild(t);
        }
    } else if (height(t.right) - height(t.left) > ALLOWED_IMBALANCE) {
        if (height(t.right.right) >= height(t.right.left)) {
            log.add("right-right at " + t.element + ": single rotation");
            t = Rotations.rotateWithRightChild(t);
        } else {
            log.add("right-left at " + t.element + ": double rotation");
            t = Rotations.doubleWithRightChild(t);
        }
    }
    t.height = Math.max(height(t.left), height(t.right)) + 1;
    return t;
}`,
};

const OUT = {
  shapes: `4(2(1,3),6(5,7))  height 2
1(-,2(-,3(-,4(-,5(-,6(-,7))))))  height 6
2(-,4(-,6(-,8(-,10))))  height 4`,
  balanceFactors: `6(4(1,-),8(7,11(10,12)))
key  height  balance
  1       0        0
  4       1       +1
  6       3       -1
  7       0        0
  8       2       -1
 10       0        0
 11       1        0
 12       0        0
6(4(1(-,3(2,-)),5),8(7,11))
key  height  balance
  1       2       -2  <- unbalanced
  2       0        0
  3       1       +1
  4       3       +2  <- unbalanced
  5       0        0
  6       4       +2  <- unbalanced
  7       0        0
  8       1        0
 11       0        0`,
  minNodes: ` h   N(h)  F(h+3)-1  2^(h+1)-1
 0      1         1          1
 1      2         2          3
 2      4         4          7
 3      7         7         15
 4     12        12         31
 5     20        20         63
 6     33        33        127
 7     54        54        255
 8     88        88        511
 9    143       143       1023
10    232       232       2047
tallest AVL tree with 1000000 nodes: height 27
shortest tree with 1000000 nodes: height 19`,
  rotationDemo: `before: 30(15(13(5,-),16),40)  balance(30) = 2
after:  15(13(5,-),30(16,40))  AVL? true
before: 7(4,12(11(8,-),13))  balance(7) = -2
single: 12(7(4,11(8,-)),13)  AVL? false
double: 11(7(4,8),12(-,13))  AVL? true
key  height  balance
  4       0        0
  7       1        0
  8       0        0
 11       2        0
 12       1       -1
 13       0        0`,
  insertDemo: `start:     3(2,7(5,-))
insert 9: 3(2,7(5,9))
insert 4: 5(3(2,4),7(-,9))   [right-left at 3: double rotation]
start:     20(10(5,-),30(25,35))
insert 40: 20(10(5,-),30(25,35(-,40)))
insert 45: 20(10(5,-),30(25,40(35,45)))   [right-right at 35: single rotation]
insert 34: 20(10(5,-),35(30(25,34),40(-,45)))   [right-left at 30: double rotation]
start:     30(15(13,16),40)
insert 5: 15(13(5,-),30(16,40))   [left-left at 30: single rotation]
start:     14(7(4,12(11,13)),17(-,53))
insert 8: 14(11(7(4,8),12(-,13)),17(-,53))   [right-left at 7: double rotation]
all AVL? true`,
  sortedInsert: `insert 1: 1
insert 2: 1(-,2)
insert 3: 2(1,3)   [right-right at 1: single rotation]
insert 4: 2(1,3(-,4))
insert 5: 2(1,4(3,5))   [right-right at 3: single rotation]
insert 6: 4(2(1,3),5(-,6))   [right-right at 2: single rotation]
insert 7: 4(2(1,3),6(5,7))   [right-right at 5: single rotation]
1023 sorted keys: AVL height 9, rotations 1013, a plain BST would have height 1022
100000 sorted keys: AVL height 16, rotations 99983, a plain BST would have height 99999`,
  deleteDemo: `start:     10(5(2(-,3),9),15(12,20(17,30)))
delete 17: 10(5(2(-,3),9),15(12,20(-,30)))
delete 15: 10(5(2(-,3),9),17(12,20(-,30)))
delete 12: 10(5(2(-,3),9),20(17,30))   [right-right at 17: single rotation]
start:     10(5(2(-,3),9),17(12(11,15(13,-)),20(18,30(-,33))))  height 4
delete 9: 17(10(3(2,5),12(11,15(13,-))),20(18,30(-,33)))   [left-right at 5: double rotation, right-right at 10: single rotation]
height 4, AVL? true`,
  randomTest: `after 100000 inserts: n = 100000, height = 19, 1.44 log2(n+2) = 23.9, log2 n = 16.6, AVL? true, rotations 46621
after 50000 deletes: n = 50000, height = 17, 1.44 log2(n+2) = 22.5, log2 n = 15.6, AVL? true, rotations 14557
exactly the remaining keys are found? true`,
  exerciseRuns: `Exercise 2
  insert 8: 8
  insert 4: 8(4,-)
  insert 12: 8(4,12)
  insert 2: 8(4(2,-),12)
  insert 6: 8(4(2,6),12)
  insert 10: 8(4(2,6),12(10,-))
  insert 1: 8(4(2(1,-),6),12(10,-))
  insert 3: 8(4(2(1,3),6),12(10,-))
  insert 0: 8(2(1(0,-),4(3,6)),12(10,-))   [left-left at 4: single rotation]
Exercise 3
  insert 50: 50
  insert 25: 50(25,-)
  insert 10: 25(10,50)   [left-left at 50: single rotation]
  insert 5: 25(10(5,-),50)
  insert 7: 25(7(5,10),50)   [left-right at 10: double rotation]
  insert 3: 7(5(3,-),25(10,50))   [left-left at 25: single rotation]
  insert 30: 7(5(3,-),25(10,50(30,-)))
  insert 20: 7(5(3,-),25(10(-,20),50(30,-)))
  insert 8: 7(5(3,-),25(10(8,20),50(30,-)))
  insert 15: 10(7(5(3,-),8),25(20(15,-),50(30,-)))   [right-left at 7: double rotation]
  insert 60: 10(7(5(3,-),8),25(20(15,-),50(30,60)))
  insert 70: 10(7(5(3,-),8),25(20(15,-),50(30,60(-,70))))
  insert 80: 10(7(5(3,-),8),25(20(15,-),50(30,70(60,80))))   [right-right at 60: single rotation]
Exercise 4
  start: 8(4(2(1,3),6(5,7)),12(10(9,11),14(13,15)))
  delete 1: 8(4(2(-,3),6(5,7)),12(10(9,11),14(13,15)))
  delete 3: 8(4(2,6(5,7)),12(10(9,11),14(13,15)))
  delete 2: 8(6(4(-,5),7),12(10(9,11),14(13,15)))   [right-right at 4: single rotation]
  delete 5: 8(6(4,7),12(10(9,11),14(13,15)))
  delete 7: 8(6(4,-),12(10(9,11),14(13,15)))
  delete 6: 12(8(4,10(9,11)),14(13,15))   [right-right at 8: single rotation]`,
  fibTrees: `h = 0: 1 nodes, AVL? true
h = 1: 2 nodes, AVL? true
h = 2: 4 nodes, AVL? true
h = 3: 7 nodes, AVL? true
h = 4: 12 nodes, AVL? true
h = 5: 20 nodes, AVL? true
h = 6: 33 nodes, AVL? true
8(5(3(2(1,-),4),7(6,-)),11(10(9,-),12))
Fibonacci tree of height 6: 33 nodes, height 6, rotations while building 0
delete the largest key: 3 rotations [left-left at 32: single rotation, left-left at 29: single rotation, left-left at 21: single rotation]
height now 5, AVL? true`,
};

// ---------- styles for this lecture's widgets ----------

(function injectStyle() {
  if (document.getElementById("l15-style")) return;
  const s = document.createElement("style");
  s.id = "l15-style";
  s.textContent = `
    .avl-views { display: grid; grid-template-columns: repeat(var(--views, 1), minmax(0, 1fr)); gap: 10px; }
    .avl-cap { font: 600 12px var(--mono); color: var(--stone); margin: 0 0 4px 2px; display: flex; justify-content: space-between; gap: 8px; }
    .avl-cap b { color: var(--ink); font-weight: 600; }
    .avl-svg svg { width: 100%; height: auto; display: block; margin: 0 auto; }
    .avl-log { font: 12px/1.5 var(--mono); color: var(--ink-2); margin-top: 8px; min-height: 18px; overflow-wrap: anywhere; }
    .avl-log b { color: var(--amber); font-weight: 600; }
    .av-code { margin-top: 10px; }
    .av-code pre { margin: 0; }
    .avl-inputs { display: flex; flex-wrap: wrap; gap: 8px 14px; align-items: center; margin: 0 0 10px; font-size: 13px; }
    .avl-inputs input[type=text] { font: 13px var(--mono); padding: 4px 6px; border: 1px solid var(--line); border-radius: 6px; background: var(--card); color: var(--ink); width: 210px; max-width: 100%; }
    .avl-inputs select { font: 13px var(--sans); padding: 3px 4px; border: 1px solid var(--line); border-radius: 6px; background: var(--card); color: var(--ink); max-width: 100%; }
    article p code, article li code, .callout code { overflow-wrap: anywhere; white-space: normal; }
    @media (max-width: 640px) { .avl-views { grid-template-columns: minmax(0, 1fr); } }
  `;
  document.head.appendChild(s);
})();

// ---------- AVL engine: a JS twin of AvlTree in the note ----------
// Nodes are {id, k, l, r, h}. Rendering follows node ids, so a node keeps its identity
// through rotations (and through the successor copy in deletion).

let NEXT_ID = 1;
const H = (t) => (t ? t.h : -1);
const fixH = (t) => { t.h = Math.max(H(t.l), H(t.r)) + 1; };
const balOf = (t) => H(t.l) - H(t.r);
const fmtB = (b) => (b > 0 ? "+" + b : b < 0 ? "−" + -b : "0");
function mk(k, l = null, r = null) { const t = { id: NEXT_ID++, k, l, r, h: 0 }; fixH(t); return t; }
function cloneT(t) { return t ? { id: t.id, k: t.k, l: cloneT(t.l), r: cloneT(t.r), h: t.h } : null; }
function showT(t) {
  if (!t) return "-";
  if (!t.l && !t.r) return String(t.k);
  return `${t.k}(${showT(t.l)},${showT(t.r)})`;
}
function sizeT(t) { return t ? 1 + sizeT(t.l) + sizeT(t.r) : 0; }
function nodesOf(t, acc = []) { if (t) { nodesOf(t.l, acc); acc.push(t); nodesOf(t.r, acc); } return acc; }

// Parse the one-line form used in the note: 20(10(5,-),30).
function parseTree(s) {
  let i = 0;
  function p() {
    if (s[i] === "-") { i++; return null; }
    let j = i;
    while (j < s.length && /[0-9]/.test(s[j])) j++;
    const k = Number(s.slice(i, j));
    i = j;
    let l = null, r = null;
    if (s[i] === "(") { i++; l = p(); i++; r = p(); i++; }
    return mk(k, l, r);
  }
  return p();
}

// The four rotations, exactly as in Rotations.java.
function rotateWithLeftChild(k2) {
  const k1 = k2.l; k2.l = k1.r; k1.r = k2;
  fixH(k2); k1.h = Math.max(H(k1.l), k2.h) + 1; return k1;
}
function rotateWithRightChild(k1) {
  const k2 = k1.r; k1.r = k2.l; k2.l = k1;
  fixH(k1); k2.h = Math.max(H(k2.r), k1.h) + 1; return k2;
}
function doubleWithLeftChild(k3) { k3.l = rotateWithRightChild(k3.l); return rotateWithLeftChild(k3); }
function doubleWithRightChild(k1) { k1.r = rotateWithLeftChild(k1.r); return rotateWithRightChild(k1); }

// Plain BST insertion (PlainBst.insert).
function bstInsert(t, x) {
  if (!t) return mk(x);
  if (x < t.k) t.l = bstInsert(t.l, x);
  else if (x > t.k) t.r = bstInsert(t.r, x);
  fixH(t);
  return t;
}

// Fast AVL operations (AvlTree.insert / remove / balance), with the same log lines.
function avlBalance(t, log) {
  if (!t) return null;
  if (H(t.l) - H(t.r) > 1) {
    if (H(t.l.l) >= H(t.l.r)) { log.push(`left-left at ${t.k}: single rotation`); t = rotateWithLeftChild(t); }
    else { log.push(`left-right at ${t.k}: double rotation`); t = doubleWithLeftChild(t); }
  } else if (H(t.r) - H(t.l) > 1) {
    if (H(t.r.r) >= H(t.r.l)) { log.push(`right-right at ${t.k}: single rotation`); t = rotateWithRightChild(t); }
    else { log.push(`right-left at ${t.k}: double rotation`); t = doubleWithRightChild(t); }
  }
  fixH(t);
  return t;
}
function avlInsert(t, x, log = []) {
  if (!t) return mk(x);
  if (x < t.k) t.l = avlInsert(t.l, x, log);
  else if (x > t.k) t.r = avlInsert(t.r, x, log);
  return avlBalance(t, log);
}
function avlRemove(t, x, log = []) {
  if (!t) return null;
  if (x < t.k) t.l = avlRemove(t.l, x, log);
  else if (x > t.k) t.r = avlRemove(t.r, x, log);
  else if (t.l && t.r) {
    let m = t.r; while (m.l) m = m.l;
    t.k = m.k;
    t.r = avlRemove(t.r, t.k, log);
  } else t = t.l || t.r;
  return avlBalance(t, log);
}

// A smallest AVL tree of height h with keys next, next+1, ... (FibTrees.fibTree).
function fibTree(h, counter = { next: 1 }) {
  if (h < 0) return null;
  const l = fibTree(h - 1, counter);
  const k = counter.next++;
  const r = fibTree(h - 2, counter);
  return mk(k, l, r);
}
function levelOrder(t) {
  const q = t ? [t] : [], out = [];
  while (q.length) { const n = q.shift(); out.push(n.k); if (n.l) q.push(n.l); if (n.r) q.push(n.r); }
  return out;
}

// ---------- recorded operations: every step becomes a frame ----------

function recorder() {
  const R = { root: null, frames: [], log: [] };
  R.attach = (parent, side, n) => { if (!parent) R.root = n; else parent[side] = n; };
  R.snap = (msg, hl = {}, extra = {}) => R.frames.push({ tree: cloneT(R.root), hl, msg, log: R.log.slice(), ...extra });
  return R;
}
const pathHl = (path, extra = {}) => Object.assign(Object.fromEntries(path.map((id) => [id, "path"])), extra);

// balance(t) on the way back up, with an explanation. Returns the new subtree root.
function recBalance(R, t, parent, side, path) {
  if (!t) return null;
  const b = balOf(t);
  if (b > 1 || b < -1) {
    const left = b > 1;
    const y = left ? t.l : t.r;
    const single = left ? H(y.l) >= H(y.r) : H(y.r) >= H(y.l);
    const kase = left ? (single ? "left-left" : "left-right") : (single ? "right-right" : "right-left");
    const z = t.k;
    const roles = { [t.id]: "z", [y.id]: "y" };
    let x = null;
    if (!single) { x = left ? y.r : y.l; roles[x.id] = "x"; }
    R.log.push(`${kase} at ${z}: ${single ? "single" : "double"} rotation`);
    R.snap(`Back at <b>${z}</b>: balance ${fmtB(b)} — <b>unbalanced</b>. The tall side is the ${left ? "left" : "right"}; its child ${y.k} has balance ${fmtB(balOf(y))}` +
      (single ? (balOf(y) === 0 ? " (0: only possible after a deletion)" : ", leaning the same way") : ", leaning the other way (a dog-leg)") +
      `. Case <b>${kase}</b>: ${single ? "single" : "double"} rotation at ${z}.`,
      pathHl(path, { [t.id]: "bad" }), { roles, msgCls: "bad" });
    let n;
    if (single) {
      const moved = left ? y.r : y.l;
      n = left ? rotateWithLeftChild(t) : rotateWithRightChild(t);
      fixH(n);
      R.attach(parent, side, n);
      R.snap(`${left ? "Right" : "Left"} rotation at ${z}: ${y.k} moves up, ${z} becomes its ${left ? "right" : "left"} child` +
        (moved ? `, and ${moved.k} moves across to ${z}` : "") + `. This subtree now has height ${n.h}.`,
        pathHl(path.slice(0, -1), { [n.id]: "cur" }), { roles: { [t.id]: "z", [y.id]: "y" }, msgCls: "good" });
    } else {
      if (left) t.l = rotateWithRightChild(t.l); else t.r = rotateWithLeftChild(t.r);
      R.snap(`Step 1: ${left ? "left" : "right"} rotation at ${y.k} lifts ${x.k} above it. The dog-leg is now a straight line ${z} → ${x.k} → ${y.k}.`,
        pathHl(path, { [t.id]: "bad" }), { roles });
      n = left ? rotateWithLeftChild(t) : rotateWithRightChild(t);
      fixH(n);
      R.attach(parent, side, n);
      R.snap(`Step 2: ${left ? "right" : "left"} rotation at ${z} lifts ${x.k} to the top, with ${left ? y.k : z} and ${left ? z : y.k} as its children. This subtree now has height ${n.h}.`,
        pathHl(path.slice(0, -1), { [n.id]: "cur" }), { roles, msgCls: "good" });
    }
    return n;
  }
  const old = t.h;
  fixH(t);
  R.snap(`Back at ${t.k}: height ${t.h}${t.h === old ? " (unchanged)" : old >= 0 && t.h !== old ? ` (was ${old})` : ""}, balance ${fmtB(b)} — OK.`,
    pathHl(path, { [t.id]: "cur" }));
  return t;
}

function recInsert(R, x) {
  const path = [];
  function ins(t, parent, side) {
    if (!t) {
      const n = mk(x);
      R.attach(parent, side, n);
      R.snap(parent ? `${x} is not in the tree: it becomes a new leaf, the ${side === "l" ? "left" : "right"} child of ${parent.k}.`
        : `${x} goes into the empty tree as the root.`, pathHl(path, { [n.id]: "new" }));
      return n;
    }
    path.push(t.id);
    if (x === t.k) {
      R.snap(`${x} is already in the tree: duplicates are ignored.`, pathHl(path, { [t.id]: "cur" }));
    } else {
      const goLeft = x < t.k;
      R.snap(`${x} ${goLeft ? "<" : ">"} ${t.k}: go ${goLeft ? "left" : "right"}.`, pathHl(path, { [t.id]: "cur" }));
      if (goLeft) ins(t.l, t, "l"); else ins(t.r, t, "r");
    }
    const n = recBalance(R, t, parent, side, path);
    path.pop();
    return n;
  }
  ins(R.root, null, null);
}

function recRemove(R, x) {
  const path = [];
  function rem(t, parent, side, key) {
    if (!t) {
      R.snap(`${key} is not in the tree: nothing to delete.`, pathHl(path));
      return null;
    }
    path.push(t.id);
    let res = t;
    if (key !== t.k) {
      const goLeft = key < t.k;
      R.snap(`${key} ${goLeft ? "<" : ">"} ${t.k}: go ${goLeft ? "left" : "right"}.`, pathHl(path, { [t.id]: "cur" }));
      if (goLeft) rem(t.l, t, "l", key); else rem(t.r, t, "r", key);
    } else if (t.l && t.r) {
      let m = t.r; while (m.l) m = m.l;
      R.snap(`Found ${key}, with two children. Its successor is ${m.k}, the smallest key in its right subtree.`,
        pathHl(path, { [t.id]: "bad", [m.id]: "new" }));
      t.k = m.k;
      R.snap(`Copy ${m.k} into this node; now delete the old ${m.k} from the right subtree.`, pathHl(path, { [t.id]: "cur", [m.id]: "bad" }));
      rem(t.r, t, "r", m.k);
    } else {
      const child = t.l || t.r;
      R.snap(child ? `Found ${key}, with one child: ${child.k} takes its place.` : `Found ${key}, a leaf: remove it.`, pathHl(path, { [t.id]: "bad" }));
      R.attach(parent, side, child);
      res = child;
      path.pop();
      R.snap(`${key} is gone. Now walk back up to the root, correcting heights.`, pathHl(path, child ? { [child.id]: "cur" } : {}));
      return res;   // balance(child) changes nothing: its subtrees are untouched
    }
    const n = recBalance(R, res, parent, side, path);
    path.pop();
    return n;
  }
  rem(R.root, null, null, x);
}

// ---------- tree drawing with animation ----------

// Positions in grid units: x = in-order rank, y = depth.
function layoutTree(t, labelOf = null) {
  const pos = {}, edges = [];
  let i = 0;
  (function walk(n, d) {
    if (!n) return;
    walk(n.l, d + 1);
    pos[n.id] = { x: i++, y: d, k: n.k, h: n.h, b: balOf(n) };
    walk(n.r, d + 1);
    if (n.l) edges.push([n.id, n.l.id]);
    if (n.r) edges.push([n.id, n.r.id]);
  })(t, 0);
  return { pos, edges, n: i };
}

const NODE_STYLE = {
  "": ["var(--card)", "var(--ink-2)"],
  path: ["var(--teal-soft)", "var(--teal)"],
  cur: ["var(--mark)", "var(--amber)"],
  bad: ["var(--red-soft)", "var(--red)"],
  new: ["var(--green-soft)", "var(--green)"],
};

// scene: {pos, edges, n, hl, roles, label}; bounds: {slots, minY, maxY}.
function sceneSVG(scene, bounds, prev, t, labelMode) {
  const slotW = 46, rowH = 58, padTop = 30;
  const W = Math.max(bounds.slots, 3) * slotW;
  const Hh = (bounds.maxY - bounds.minY) * rowH + padTop + 34;
  const off = (Math.max(bounds.slots, 3) - scene.n) / 2;
  const X = (p) => (p.x + off + 0.5) * slotW;
  const Y = (p) => (p.y - bounds.minY) * rowH + padTop;
  const at = (id) => {
    const p = scene.pos[id];
    const q = prev && prev.pos[id];
    if (!q || t >= 1) return [X(p), Y(p)];
    const [qx, qy] = [prev.X(q), prev.Y(q)];
    return [qx + (X(p) - qx) * t, qy + (Y(p) - qy) * t];
  };
  let g = `<svg viewBox="0 0 ${W} ${Hh}" style="max-width:${Math.round(W * 1.15)}px" role="img" aria-label="tree">`;
  scene.edges.forEach(([a, b, cls]) => {
    if (!scene.pos[a] || !scene.pos[b]) return;
    const [x1, y1] = at(a), [x2, y2] = at(b);
    g += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="var(--${cls === "hot" ? "amber" : "ink-2"})" stroke-width="${cls === "hot" ? 2.4 : 1.4}"${cls === "dash" ? ' stroke-dasharray="4 3"' : ""}/>`;
  });
  if (prev && t < 1) {
    Object.entries(prev.pos).forEach(([id, q]) => {
      if (scene.pos[id]) return;
      g += `<g opacity="${1 - t}"><circle cx="${prev.X(q)}" cy="${prev.Y(q)}" r="16" fill="var(--red-soft)" stroke="var(--red)"/><text x="${prev.X(q)}" y="${prev.Y(q) + 4.5}" text-anchor="middle" font-size="13" fill="var(--ink)">${q.k}</text></g>`;
    });
  }
  Object.entries(scene.pos).forEach(([id, p]) => {
    const [x, y] = at(id);
    const isNew = prev && !prev.pos[id] && t < 1;
    const op = isNew ? t : 1;
    if (p.box) {
      g += `<g opacity="${op}"><rect x="${x - 14}" y="${y - 12}" width="28" height="24" rx="5" fill="var(--paper)" stroke="var(--amber)" stroke-width="1.6"/><text x="${x}" y="${y + 4.5}" text-anchor="middle" font-size="12" font-family="var(--mono)" fill="var(--amber)">${esc(p.k)}</text></g>`;
      return;
    }
    const [fill, stroke] = NODE_STYLE[(scene.hl || {})[id] || ""];
    const strong = (scene.hl || {})[id] && scene.hl[id] !== "path";
    g += `<g opacity="${op}"><circle cx="${x}" cy="${y}" r="16" fill="${fill}" stroke="${stroke}" stroke-width="${strong ? 2.4 : 1.4}"/>`;
    g += `<text x="${x}" y="${y + 4.5}" text-anchor="middle" font-size="13" font-weight="600" fill="var(--ink)">${esc(p.k)}</text>`;
    if (labelMode === "b" && p.b !== undefined) {
      const bad = Math.abs(p.b) > 1;
      g += `<text x="${x + 18}" y="${y - 14}" font-size="11" font-family="var(--mono)" font-weight="${bad ? 700 : 400}" fill="var(--${bad ? "red" : "stone"})">${fmtB(p.b)}</text>`;
    } else if (labelMode === "h" && p.h !== undefined) {
      g += `<text x="${x + 18}" y="${y - 14}" font-size="11" font-family="var(--mono)" fill="var(--teal)">${p.h}</text>`;
    }
    const role = (scene.roles || {})[id];
    if (role) g += `<text x="${x - 19}" y="${y - 13}" text-anchor="end" font-size="12" font-style="italic" font-weight="600" fill="var(--amber)">${esc(role)}</text>`;
    g += `</g>`;
  });
  g += `</svg>`;
  return { svg: g, X, Y };
}

function boundsOf(scenes) {
  let slots = 1, minY = 0, maxY = 0;
  scenes.forEach((s) => {
    slots = Math.max(slots, s.n);
    Object.values(s.pos).forEach((p) => { minY = Math.min(minY, p.y); maxY = Math.max(maxY, p.y); });
  });
  return { slots, minY, maxY };
}

// Step-through player for tree frames. A frame is {scenes: [scene, ...], msg, msgCls, log,
// caps: [caption, ...], code, line, mark}. opts: build() -> frames, views, caps, mini,
// inputs (html above the trees), extraControls, onMount(el, rebuild), label ("b"|"h"|""),
// logLabel, interval.
function makeAvlPlayer(el, opts) {
  const mini = !!opts.mini;
  const views = opts.views || 1;
  el.innerHTML = `${mini ? "" : opts.inputs ? `<div class="avl-inputs">${opts.inputs}</div>` : ""}
    <div class="avl-views" style="--views:${views}">${Array.from({ length: views }, () =>
      `<div class="avl-view"><div class="avl-cap"></div><div class="svgbox avl-svg"></div></div>`).join("")}</div>
    ${mini ? "" : `<div class="av-code"></div><div class="msg av-msg"></div><div class="avl-log"></div>
    <div class="controls">
      <button class="cbtn av-reset" title="Back to the start">⟲ Reset</button>
      <button class="cbtn av-back" title="Step back (←)">◀ Back</button>
      <button class="cbtn av-step on" title="Step (→)">Step ▶</button>
      <button class="cbtn av-play">Play</button>
      ${opts.marks ? `<button class="cbtn av-next" title="Jump to the next operation">Next op ⏭</button>` : ""}
      ${opts.extraControls || ""}
      ${opts.noLabel ? "" : `<label>show <select class="av-lab"><option value="b">balance</option><option value="h">height</option><option value="">nothing</option></select></label>`}
      <span class="spacer"></span><span class="counter av-count"></span>
    </div>`}`;
  const $ = (s) => el.querySelector(s);
  const svgBoxes = [...el.querySelectorAll(".avl-svg")];
  const caps = [...el.querySelectorAll(".avl-cap")];
  let frames = [], bounds = [], i = 0, timer = null, anim = null, last = [], codeKey = null;
  let label = opts.label === undefined ? "b" : opts.label;
  if (!mini && !opts.noLabel) {
    $(".av-lab").value = label;
    $(".av-lab").onchange = (e) => { label = e.target.value; draw(false); };
  }
  const reduce = typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;

  function draw(animate) {
    const f = frames[i];
    cancelAnimationFrame(anim);
    const prev = last;
    const run = (t) => {
      last = f.scenes.map((s, v) => {
        const r = sceneSVG(s, bounds[v], animate ? prev[v] : null, t, label);
        svgBoxes[v].innerHTML = r.svg;
        return { pos: s.pos, X: r.X, Y: r.Y };
      });
    };
    if (animate && !reduce && prev.length) {
      const t0 = performance.now();
      const tick = (now) => {
        const t = Math.min(1, (now - t0) / 380);
        const e = t < 0.5 ? 2 * t * t : 1 - 2 * (1 - t) * (1 - t);
        run(e);
        if (t < 1) anim = requestAnimationFrame(tick);
      };
      anim = requestAnimationFrame(tick);
    } else run(1);
    caps.forEach((c, v) => { c.innerHTML = (f.caps && f.caps[v]) || (opts.caps && opts.caps[v]) || ""; });
    if (mini) return;
    if (f.code) {
      if (codeKey !== f.code) { $(".av-code").innerHTML = codeBlock(f.code); codeKey = f.code; }
      el.querySelectorAll(".av-code .ln").forEach((ln, k) => ln.classList.toggle("hl", k + 1 === f.line));
    } else if (codeKey !== null) { $(".av-code").innerHTML = ""; codeKey = null; }
    const msg = $(".av-msg");
    msg.innerHTML = f.msg || "";
    msg.className = "msg av-msg " + (f.msgCls || "");
    $(".avl-log").innerHTML = f.log ? `<b>${opts.logLabel || "rebalancing so far"}:</b> ${f.log.length ? f.log.map(esc).join(" · ") : "none"}` : "";
    $(".av-count").textContent = `step ${i + 1} / ${frames.length}`;
    $(".av-back").disabled = $(".av-reset").disabled = i === 0;
    $(".av-step").disabled = i === frames.length - 1;
    if (opts.marks) $(".av-next").disabled = i === frames.length - 1;
  }
  function go(k) { stop(); const d = Math.abs(k - i) === 1; i = k; draw(d); }
  function stop() { clearInterval(timer); timer = null; if (!mini) $(".av-play").textContent = "Play"; }
  function play() {
    if (timer) return stop();
    if (i === frames.length - 1) { i = 0; draw(false); }
    if (!mini) $(".av-play").textContent = "Pause";
    timer = setInterval(() => {
      if (i < frames.length - 1) { i++; draw(true); }
      else if (mini) { i = 0; draw(false); }
      else stop();
    }, opts.interval || (mini ? 1000 : 900));
  }
  function rebuild() {
    stop();
    frames = opts.build();
    bounds = Array.from({ length: views }, (_, v) => boundsOf(frames.map((f) => f.scenes[v])));
    i = 0; last = []; codeKey = null;
    draw(false);
  }
  if (!mini) {
    $(".av-reset").onclick = () => go(0);
    $(".av-back").onclick = () => { if (i > 0) go(i - 1); };
    $(".av-step").onclick = () => { if (i < frames.length - 1) go(i + 1); };
    $(".av-play").onclick = play;
    if (opts.marks) $(".av-next").onclick = () => {
      let k = i + 1;
      while (k < frames.length - 1 && !frames[k].mark) k++;
      go(k);
    };
    el.tabIndex = 0;
    el.addEventListener("keydown", (e) => {
      if (["INPUT", "SELECT", "TEXTAREA"].includes(e.target.tagName)) return;
      if (e.key === "ArrowRight") { e.preventDefault(); $(".av-step").click(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); $(".av-back").click(); }
    });
  }
  if (opts.onMount) opts.onMount(el, rebuild);
  rebuild();
  if (mini) play();
  return { rebuild };
}

// A scene for a whole tree.
function treeScene(t, hl = {}, roles = {}) {
  const s = layoutTree(t);
  s.hl = hl; s.roles = roles;
  return s;
}
// Turn recorder frames into player frames.
function recFrames(R, extra = (f) => ({})) {
  return R.frames.map((f) => ({ scenes: [treeScene(f.tree, f.hl, f.roles)], msg: f.msg, msgCls: f.msgCls, log: f.log, mark: f.mark, ...extra(f) }));
}
const keysIn = (text, fallback, max = 20) => {
  const seen = new Set();
  return parseNums(text, fallback).filter((k) => k >= 0 && k < 1000 && !seen.has(k) && seen.add(k)).slice(0, max);
};
function unbalancedNodes(t) {
  return nodesOf(t).filter((n) => Math.abs(balOf(n)) > 1);
}
function depthOf(t, id, d = 0) {
  if (!t) return -1;
  if (t.id === id) return d;
  return Math.max(depthOf(t.l, id, d + 1), depthOf(t.r, id, d + 1));
}

// ---------- Demo: plain BST vs AVL tree ----------

function demoBstVsAvl(el, { mini = false } = {}) {
  let keys = [1, 2, 3, 4, 5, 6, 7];
  makeAvlPlayer(el, {
    mini, views: 2, label: "h",
    inputs: `<label>insert keys <input type="text" class="bva-k" value="1 2 3 4 5 6 7"></label>
      <select class="bva-p"><option value="">presets…</option><option>1 2 3 4 5 6 7</option><option>2 4 6 8 10</option><option>4 2 6 1 3 5 7</option><option>10 9 8 7 6 5 4 3 2 1</option><option>5 1 9 2 8 3 7 4 6</option></select>`,
    build() {
      let bst = null, avl = null;
      const frames = [{ scenes: [treeScene(null), treeScene(null)], caps: ["<b>plain BST</b>", "<b>AVL tree</b>"],
        msg: `Insert ${keys.join(", ")} into an empty plain BST and an empty AVL tree.`, log: [] }];
      const log = [];
      keys.forEach((k) => {
        bst = bstInsert(bst, k);
        const before = log.length;
        avl = avlInsert(avl, k, log);
        const findId = (t) => { let n = t; while (n && n.k !== k) n = k < n.k ? n.l : n.r; return n ? n.id : null; };
        frames.push({
          scenes: [treeScene(cloneT(bst), { [findId(bst)]: "new" }), treeScene(cloneT(avl), { [findId(avl)]: "new" })],
          caps: [`<b>plain BST</b><span>height ${H(bst)}</span>`, `<b>AVL tree</b><span>height ${H(avl)}</span>`],
          msg: `insert ${k}: the BST has height ${H(bst)}, the AVL tree ${H(avl)}.` + (log.length > before ? ` The AVL tree rebalanced: ${log.slice(before).join("; ")}.` : ""),
          log: log.slice(),
        });
      });
      return frames;
    },
    onMount(root, rebuild) {
      const inp = root.querySelector(".bva-k");
      if (!inp) return;
      inp.onchange = () => { keys = keysIn(inp.value, [1, 2, 3, 4, 5, 6, 7], 12); inp.value = keys.join(" "); rebuild(); };
      root.querySelector(".bva-p").onchange = (e) => { if (e.target.value) { inp.value = e.target.value; inp.onchange(); } e.target.value = ""; };
    },
  });
}

// ---------- Demo: keeping a BST complete is expensive ----------

function demoComplete(el) {
  makeAvlPlayer(el, {
    noLabel: true, label: "",
    build() {
      NEXT_ID = 1;
      const a = parseTree("6(4(1,5),9(8,-))");
      const two = bstInsert(cloneT(a), 2);
      const byKey = Object.fromEntries(nodesOf(two).map((n) => [n.k, n.id]));
      const parentOf = (t, m = {}) => { if (t) { [t.l, t.r].forEach((c) => { if (c) m[c.k] = t.k; parentOf(c, m); }); } return m; };
      const bp = parentOf(two);
      const c = parseTree("5(2(1,4),8(6,9))");
      // keep identities by key so nodes slide to their new places
      const relabel = (t) => { if (t) { t.id = byKey[t.k]; relabel(t.l); relabel(t.r); } };
      relabel(c);
      const cp = parentOf(c);
      const moved = nodesOf(c).filter((n) => cp[n.k] !== bp[n.k]);
      const hlMoved = Object.fromEntries(moved.map((n) => [n.id, "bad"]));
      const twoId = byKey[2];
      return [
        { scenes: [treeScene(a)], msg: "A complete BST on 1, 4, 5, 6, 8, 9: every level full except the last, which is filled from the left." },
        { scenes: [treeScene(two, { [twoId]: "new" })], msg: "Insert 2 the BST way: it hangs below 1. The tree is no longer complete (the last level has a gap).", msgCls: "bad" },
        { scenes: [treeScene(c, hlMoved)], msg: `The only complete BST on the seven keys has root 5. ${moved.length} of the 7 nodes have a new parent (red), the root included. In general one insertion can move every node: Θ(n) per update.`, msgCls: "bad" },
      ];
    },
  });
}

// ---------- Demo: heights and balance factors ----------

function demoBalanceCheck(el) {
  let keys = [6, 4, 8, 1, 5, 7, 11, 3, 2];
  makeAvlPlayer(el, {
    label: "b",
    inputs: `<label>insert into a plain BST <input type="text" class="bc-k" value="6 4 8 1 5 7 11 3 2"></label>
      <select class="bc-p"><option value="">presets…</option><option value="6 4 8 1 7 11 10 12">slide tree ✓</option><option value="6 4 8 1 5 7 11 3 2">slide tree ✗</option><option value="1 2 3">chain 1 2 3</option><option value="8 4 12 2 6 10 1 3 0">Exercise 1</option></select>`,
    build() {
      NEXT_ID = 1;
      let t = null;
      const frames = [{ scenes: [treeScene(null)], msg: "Insert the keys one by one into a plain BST (no rebalancing) and watch the balance factors." }];
      keys.forEach((k) => {
        t = bstInsert(t, k);
        const bad = unbalancedNodes(t);
        const hl = Object.fromEntries(bad.map((n) => [n.id, "bad"]));
        const newId = nodesOf(t).find((n) => n.k === k).id;
        if (!hl[newId]) hl[newId] = "new";
        let msg;
        if (!bad.length) msg = `insert ${k}: every balance factor is −1, 0 or +1 — an <b>AVL tree</b>. Height ${t.h}.`;
        else {
          const deepest = bad.reduce((a, n) => (depthOf(t, n.id) > depthOf(t, a.id) ? n : a));
          msg = `insert ${k}: <b>not</b> an AVL tree. Unbalanced: ${bad.map((n) => `${n.k} (${fmtB(balOf(n))})`).join(", ")}. The deepest is ${deepest.k}.`;
        }
        frames.push({ scenes: [treeScene(cloneT(t), hl)], msg, msgCls: bad.length ? "bad" : "good" });
      });
      return frames;
    },
    onMount(root, rebuild) {
      const inp = root.querySelector(".bc-k");
      inp.onchange = () => { keys = keysIn(inp.value, [6, 4, 8, 1, 5, 7, 11, 3, 2], 15); inp.value = keys.join(" "); rebuild(); };
      root.querySelector(".bc-p").onchange = (e) => { if (e.target.value) { inp.value = e.target.value; inp.onchange(); } e.target.value = ""; };
    },
  });
}

// ---------- Demo: smallest AVL trees (Fibonacci trees) ----------

function demoMinTree(el, { mini = false } = {}) {
  const N = [1, 2];
  for (let h = 2; h <= 6; h++) N.push(N[h - 1] + N[h - 2] + 1);
  makeAvlPlayer(el, {
    mini, label: "b", interval: 1400,
    build() {
      NEXT_ID = 1;
      return N.map((n, h) => ({
        scenes: [treeScene(fibTree(h))],
        caps: [`<b>height ${h}</b><span>${n} nodes (a full tree would have ${2 ** (h + 1) - 1})</span>`],
        msg: h < 2 ? `N(${h}) = ${n}: ${h === 0 ? "a single leaf" : "a root with one child"}.`
          : `N(${h}) = N(${h - 1}) + N(${h - 2}) + 1 = ${N[h - 1]} + ${N[h - 2]} + 1 = ${n}. Left: a smallest tree of height ${h - 1}; right: one of height ${h - 2}. Every inner node has balance +1.`,
      }));
    },
  });
}

// ---------- Demo: rotations, line by line ----------

const ROT_CASES = {
  LL: { tree: "30(15(13(5,-),16),40)", fn: "rotateWithLeftChild", title: "left-left at 30" },
  RR: { tree: "20(10,30(25,40(-,45)))", fn: "rotateWithRightChild", title: "right-right at 20" },
  LR: { tree: "30(15(13,20(18,-)),40)", fn: "doubleWithLeftChild", title: "left-right at 30" },
  RL: { tree: "7(4,12(11(8,-),13))", fn: "doubleWithRightChild", title: "right-left at 7" },
  RLW: { tree: "7(4,12(11(8,-),13))", fn: "rotateWithRightChild", title: "right-left at 7, but with a single rotation", wrong: true },
};

function demoRotation(el, { mini = false, kase = "LL" } = {}) {
  let which = kase;
  makeAvlPlayer(el, {
    mini, label: "h",
    extraControls: `<label>case <select class="rot-c"><option value="LL">left-left</option><option value="RR">right-right</option><option value="LR">left-right</option><option value="RL">right-left</option><option value="RLW">right-left, single (wrong)</option></select></label>`,
    build() {
      NEXT_ID = 1;
      const C = ROT_CASES[which];
      const root = parseTree(C.tree);
      const all = nodesOf(root);
      const code = CODE[C.fn];
      let link = root;   // what the caller's variable t points to
      const scene = (pos0, roles, hl = {}, hot = []) => {
        // pointer view: positions from pos0, edges from the current links
        const pos = {};
        all.forEach((n) => { pos[n.id] = { ...pos0.pos[n.id], h: n.h, b: balOf(n) }; });
        pos.t = { x: pos0.pos[link.id].x, y: -1, k: "t", box: true };
        const edges = [["t", link.id, "hot"]];
        all.forEach((n) => [n.l, n.r].forEach((c) => {
          if (c) edges.push([n.id, c.id, hot.some(([a, b]) => a === n.id && b === c.id) ? "hot" : ""]);
        }));
        return { pos, edges, n: pos0.n, hl, roles };
      };
      const frames = [];
      const pos0 = layoutTree(root);
      const single = C.fn.startsWith("rotate");
      const left = C.fn.endsWith("LeftChild");
      if (single) {
        const k2 = root, k1 = left ? root.l : root.r;
        const names = left ? ["k2", "k1"] : ["k1", "k2"];
        const roles = { [k2.id]: names[0] };
        frames.push({ scenes: [scene(pos0, roles, { [k2.id]: "bad" })], code, line: 2,
          msg: `${C.wrong ? "Try" : "Case"} ${C.title}: balance(${k2.k}) = ${fmtB(balOf(k2))}. The caller runs <code>t = ${C.fn}(t)</code>, and t points at ${k2.k}.`, msgCls: "bad" });
        const roles2 = { ...roles, [k1.id]: names[1] };
        frames.push({ scenes: [scene(pos0, roles2, { [k2.id]: "bad", [k1.id]: "cur" })], code, line: 3,
          msg: `${names[1]} is ${k2.k}'s ${left ? "left" : "right"} child, ${k1.k}: the node that will move up.` });
        const inner = left ? k1.r : k1.l;
        if (left) k2.l = k1.r; else k2.r = k1.l;
        frames.push({ scenes: [scene(pos0, roles2, { [k2.id]: "bad", [k1.id]: "cur" }, inner ? [[k2.id, inner.id]] : [])], code, line: 4,
          msg: inner ? `${k1.k}'s inner subtree (rooted at ${inner.k}) moves across: ${k2.k}.${left ? "left" : "right"} now points at ${inner.k}. For a moment both ${k1.k} and ${k2.k} point at it.`
            : `${k1.k} has no inner subtree, so ${k2.k}.${left ? "left" : "right"} becomes null.` });
        if (left) k1.r = k2; else k1.l = k2;
        frames.push({ scenes: [scene(pos0, roles2, { [k2.id]: "bad", [k1.id]: "cur" }, [[k1.id, k2.id]])], code, line: 5,
          msg: `${k1.k}.${left ? "right" : "left"} now points at ${k2.k}: ${k2.k} hangs below ${k1.k}. The links are done; only the drawing is still in the old places.` });
        fixH(k2);
        frames.push({ scenes: [scene(pos0, roles2, { [k2.id]: "cur" })], code, line: 6,
          msg: `${k2.k} moved down, so its height is recomputed first: ${k2.h}.` });
        k1.h = Math.max(H(left ? k1.l : k1.r), k2.h) + 1;
        frames.push({ scenes: [scene(pos0, roles2, { [k1.id]: "cur" })], code, line: 7,
          msg: `Then ${k1.k}, which uses ${k2.k}'s new height: ${k1.h}.` });
        link = k1;
        const fin = layoutTree(k1);
        const bad = unbalancedNodes(k1);
        frames.push({ scenes: [scene(fin, roles2, Object.fromEntries(bad.map((n) => [n.id, "bad"])))], code, line: 8,
          msg: bad.length ? `Returned ${k1.k}, and the caller stores it in t. But ${bad.map((n) => `${n.k} has balance ${fmtB(balOf(n))}`).join(", ")}: a single rotation does not fix the inside case. The middle subtree just moved to the other side.`
            : `Returned ${k1.k}, and the caller stores it: t = ${k1.k}. In-order is unchanged (${nodesOf(k1).map((n) => n.k).join(" ")}), and every balance factor is back in range.`,
          msgCls: bad.length ? "bad" : "good" });
      } else {
        const k3 = root, y = left ? root.l : root.r, x = left ? y.r : y.l;
        const roles = left ? { [k3.id]: "k3", [y.id]: "k1", [x.id]: "k2" } : { [k3.id]: "k1", [y.id]: "k3", [x.id]: "k2" };
        frames.push({ scenes: [scene(pos0, roles, { [k3.id]: "bad" })], code, line: 2,
          msg: `Case ${C.title}: balance(${k3.k}) = ${fmtB(balOf(k3))}, and the path bends at ${y.k} (a dog-leg). ${x.k}, the root of the middle subtree, will end on top.`, msgCls: "bad" });
        if (left) k3.l = rotateWithRightChild(k3.l); else k3.r = rotateWithLeftChild(k3.r);
        frames.push({ scenes: [scene(layoutTree(k3), roles, { [x.id]: "cur" })], code, line: 3,
          msg: `First a ${left ? "left" : "right"} rotation at ${y.k}: ${x.k} moves above ${y.k}. Now ${k3.k} → ${x.k} → ${y.k} is a straight line: the outside case.` });
        const n = left ? rotateWithLeftChild(k3) : rotateWithRightChild(k3);
        link = n;
        frames.push({ scenes: [scene(layoutTree(n), roles, { [x.id]: "cur" })], code, line: 4,
          msg: `Then a ${left ? "right" : "left"} rotation at ${k3.k}: ${x.k} moves up again and becomes the root, with ${(left ? y : k3).k} and ${(left ? k3 : y).k} as its children. All balance factors are in range; the caller stores t = ${x.k}.`, msgCls: "good" });
      }
      return frames;
    },
    onMount(root, rebuild) {
      const sel = root.querySelector(".rot-c");
      if (!sel) return;
      sel.value = which;
      sel.onchange = () => { which = sel.value; rebuild(); };
    },
  });
}

// ---------- Demo: AVL insertion ----------

const INSERT_PRESETS = {
  "slides (Section 4.2)": "20 10 30 5 25 35 40 45 34",
  "3 2 7 5 9 4": "3 2 7 5 9 4",
  "sorted 1 to 15": "1 2 3 4 5 6 7 8 9 10 11 12 13 14 15",
  "Exercise 3": "50 25 10 5 7 3 30 20 8 15 60 70 80",
  "slides exercise: insert 8": "14 7 17 4 12 53 11 13 8",
};

function demoInsert(el, { mini = false, keys: init = "20 10 30 5 25 35 40 45 34" } = {}) {
  let keys = parseNums(init, []);
  makeAvlPlayer(el, {
    mini, label: "b", marks: true, interval: mini ? 900 : 900,
    inputs: `<label>insert <input type="text" class="ins-k" value="${keys.join(" ")}"></label>
      <select class="ins-p"><option value="">presets…</option>${Object.entries(INSERT_PRESETS).map(([n, v]) => `<option value="${v}">${n}</option>`).join("")}</select>
      <button class="cbtn ins-r">random</button>`,
    build() {
      NEXT_ID = 1;
      const R = recorder();
      R.snap(`Insert ${keys.join(", ")} into an empty AVL tree, one key at a time.`, {}, { mark: true });
      keys.forEach((k) => {
        R.snap(`<b>insert ${k}</b>: search for it from the root.`, {}, { mark: true });
        recInsert(R, k);
        R.snap(`After inserting ${k}: ${showT(R.root)}. Height ${H(R.root)}.`, {});
      });
      return recFrames(R, (f) => ({ caps: [`<b>AVL tree</b><span>${sizeT(f.tree)} nodes · height ${H(f.tree)}</span>`] }));
    },
    onMount(root, rebuild) {
      const inp = root.querySelector(".ins-k");
      if (!inp) return;
      inp.onchange = () => { keys = keysIn(inp.value, [20, 10, 30], 20); inp.value = keys.join(" "); rebuild(); };
      root.querySelector(".ins-p").onchange = (e) => { if (e.target.value) { inp.value = e.target.value; inp.onchange(); } e.target.value = ""; };
      root.querySelector(".ins-r").onclick = () => {
        const s = new Set();
        while (s.size < 10) s.add(1 + Math.floor(Math.random() * 99));
        inp.value = [...s].join(" "); inp.onchange();
      };
    },
  });
}

// ---------- Demo: AVL deletion ----------

const DELETE_PRESETS = {
  "easy: delete 17": ["10 5 15 2 9 12 20 3 17 30", "17"],
  "successor: delete 15, then 12": ["10 5 15 2 9 12 20 3 17 30", "15 12"],
  "propagation: delete 9": ["10 5 17 2 9 12 20 3 11 15 18 30 13 33", "9"],
  "Exercise 4": ["1 2 3 4 5 6 7 8 9 10 11 12 13 14 15", "1 3 2 5 7 6"],
  "Fibonacci tree: delete 33": [levelOrder(fibTree(6)).join(" "), "33"],
};

function demoDelete(el, { mini = false, preset = "propagation: delete 9" } = {}) {
  let [buildKeys, delKeys] = DELETE_PRESETS[preset].map((s) => parseNums(s, []));
  makeAvlPlayer(el, {
    mini, label: "b", marks: true,
    inputs: `<label>build <input type="text" class="del-b" value="${buildKeys.join(" ")}"></label>
      <label>then delete <input type="text" class="del-k" value="${delKeys.join(" ")}" style="width:110px"></label>
      <select class="del-p"><option value="">presets…</option>${Object.keys(DELETE_PRESETS).map((n) => `<option>${n}</option>`).join("")}</select>`,
    build() {
      NEXT_ID = 1;
      const R = recorder();
      buildKeys.forEach((k) => { R.root = avlInsert(R.root, k, []); });
      R.snap(`The AVL tree built from ${buildKeys.join(", ")}. Now delete ${delKeys.join(", ")}.`, {}, { mark: true });
      delKeys.forEach((k) => {
        R.snap(`<b>delete ${k}</b>: search for it from the root.`, {}, { mark: true });
        recRemove(R, k);
        R.snap(`After deleting ${k}: ${showT(R.root)}. Height ${H(R.root)}.`, {});
      });
      return recFrames(R, (f) => ({ caps: [`<b>AVL tree</b><span>${sizeT(f.tree)} nodes · height ${H(f.tree)}</span>`] }));
    },
    onMount(root, rebuild) {
      const b = root.querySelector(".del-b"), d = root.querySelector(".del-k");
      if (!b) return;
      const apply = () => {
        buildKeys = keysIn(b.value, [10, 5, 15], 40); delKeys = keysIn(d.value, [], 8);
        b.value = buildKeys.join(" "); d.value = delKeys.join(" "); rebuild();
      };
      b.onchange = d.onchange = apply;
      root.querySelector(".del-p").onchange = (e) => {
        const p = DELETE_PRESETS[e.target.value];
        if (p) { b.value = p[0]; d.value = p[1]; apply(); }
        e.target.value = "";
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
  bstVsAvl: (el) => demoBstVsAvl(el),
  bstVsAvlMini: (el) => demoBstVsAvl(el, { mini: true }),
  complete: (el) => demoComplete(el),
  balanceCheck: (el) => demoBalanceCheck(el),
  minTree: (el) => demoMinTree(el),
  minTreeMini: (el) => demoMinTree(el, { mini: true }),
  rotation: (el) => demoRotation(el),
  rotationDouble: (el) => demoRotation(el, { kase: "LR" }),
  rotationMini: (el) => demoRotation(el, { mini: true }),
  insert: (el) => demoInsert(el),
  insertMini: (el) => demoInsert(el, { mini: true, keys: "1 2 3 4 5 6 7" }),
  remove: (el) => demoDelete(el),
  removeMini: (el) => demoDelete(el, { mini: true }),
  quiz: (el) => demoQuiz(el, QUIZ),
};
