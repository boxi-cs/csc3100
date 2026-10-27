// Code panels and outputs, copied from notes/L01-introduction.md (checked by tools/check.py).
const CODE = {
  logs: `public class Logs {
    // log base 2, by the change-of-base rule
    static double log2(double x) {
        return Math.log(x) / Math.log(2);
    }

    // floor(log2 n) for n >= 1: how many times n can be halved before it reaches 1
    static int halvings(int n) {
        int count = 0;
        while (n > 1) {
            n = n / 2;
            count++;
        }
        return count;
    }

    public static void main(String[] args) {
        int[] xs = {1, 2, 1024, 65536, 1000000};
        for (int x : xs) {
            System.out.printf("x = %7d   log2(x) = %7.3f   halvings = %d%n", x, log2(x), halvings(x));
        }
        int n = 10;
        System.out.println("2^n + 2^n = " + ((1 << n) + (1 << n)) + ",  2^(n+1) = " + (1 << (n + 1)));
    }
}`,
  series: `public class Series {
    public static void main(String[] args) {
        int n = 100;
        long sum = 0, squares = 0;
        for (int i = 1; i <= n; i++) {
            sum += i;
            squares += (long) i * i;
        }
        System.out.println("1 + ... + 100      = " + sum + "   formula " + n * (n + 1) / 2);
        System.out.println("1^2 + ... + 100^2  = " + squares + "   formula " + n * (n + 1) * (2 * n + 1) / 6);

        int k = 3;
        int terms = 0;
        for (int i = 1; i <= k; i++) {
            terms += 3 * i - 1;
        }
        System.out.println("2 + 5 + 8          = " + terms + "   formula " + k * (3 * k + 1) / 2);

        double a = 0.5, partial = 0;
        for (int i = 0; i <= 20; i++) {
            partial += Math.pow(a, i);
            if (i == 1 || i == 5 || i == 20) {
                System.out.printf("sum of 0.5^i, i = 0..%-2d = %.7f   bound 1/(1 - a) = %.1f%n", i, partial, 1 / (1 - a));
            }
        }
        long powers = 0;
        for (int i = 0; i <= 10; i++) {
            powers += 1L << i;
        }
        System.out.println("1 + 2 + ... + 2^10 = " + powers + "   formula 2^11 - 1 = " + ((1L << 11) - 1));
    }
}`,
  fibCounterexample: `public class FibCounterexample {
    public static void main(String[] args) {
        long previous = 1, current = 1;   // F(0) = 1, F(1) = 1, as on the slides
        for (int k = 1; k <= 12; k++) {
            long square = (long) k * k;
            String verdict = current <= square ? "ok" : "FAILS";
            System.out.printf("k = %2d   F(k) = %3d   k^2 = %3d   %s%n", k, current, square, verdict);
            if (current > square) {
                System.out.println("counterexample: k = " + k);
                break;
            }
            long next = current + previous;
            previous = current;
            current = next;
        }
    }
}`,
  euclidNumbers: `public class EuclidNumbers {
    // The smallest prime factor of n >= 2 (n itself if n is prime).
    static long smallestPrimeFactor(long n) {
        for (long d = 2; d * d <= n; d++) {
            if (n % d == 0) {
                return d;
            }
        }
        return n;
    }

    public static void main(String[] args) {
        long[] primes = {2, 3, 5, 7, 11, 13, 17};
        long product = 1;
        for (long q : primes) {
            product *= q;
            long p = product + 1;
            long f = smallestPrimeFactor(p);
            String kind = f == p ? "prime" : "= " + f + " * " + p / f;
            System.out.printf("primes up to %2d: product + 1 = %6d   %s%n", q, p, kind);
        }
    }
}`,
  fullNode: `class FullNode {
    FullNode left, right;   // both null (a leaf) or both non-null

    FullNode() { }                                  // a leaf

    FullNode(FullNode left, FullNode right) {       // an internal node
        this.left = left;
        this.right = right;
    }

    boolean isLeaf() {
        return left == null;
    }

    static int leaves(FullNode t) {
        return t.isLeaf() ? 1 : leaves(t.left) + leaves(t.right);
    }

    static int internal(FullNode t) {
        return t.isLeaf() ? 0 : internal(t.left) + internal(t.right) + 1;
    }
}`,
  leafCount: `import java.util.ArrayList;
import java.util.List;
import java.util.Random;

public class LeafCount {
    public static void main(String[] args) {
        Random random = new Random(3100);
        FullNode root = new FullNode();
        List<FullNode> leafList = new ArrayList<>();
        leafList.add(root);
        for (int splits = 0; splits <= 5; splits++) {
            System.out.println("leaves = " + FullNode.leaves(root) + ", internal = " + FullNode.internal(root));
            FullNode leaf = leafList.remove(random.nextInt(leafList.size()));
            leaf.left = new FullNode();          // the leaf becomes internal,
            leaf.right = new FullNode();         // with two new leaves
            leafList.add(leaf.left);
            leafList.add(leaf.right);
        }
    }
}`,
  intForms: `public class IntForms {
    public static void main(String[] args) {
        int big = Integer.MAX_VALUE;
        System.out.println("largest int:     " + big);
        System.out.println("largest int + 1: " + (big + 1));
        System.out.println("5 in bits:  " + Integer.toBinaryString(5));
        System.out.println("-5 in bits: " + Integer.toBinaryString(-5));
        System.out.println("0.1 + 0.2 = " + (0.1 + 0.2));
    }
}`,
  account: `interface Account {
    void deposit(int amount);    // amount > 0
    void withdraw(int amount);   // 0 < amount <= balance
    int getBalance();
}`,
  simpleAccount: `class SimpleAccount implements Account {
    private int balance = 0;     // one number: the current balance

    public void deposit(int amount) {
        if (amount <= 0) {
            throw new IllegalArgumentException("deposit must be positive");
        }
        balance += amount;
    }

    public void withdraw(int amount) {
        if (amount <= 0 || amount > balance) {
            throw new IllegalArgumentException("cannot withdraw " + amount);
        }
        balance -= amount;
    }

    public int getBalance() {
        return balance;
    }
}`,
  ledgerAccount: `import java.util.ArrayList;
import java.util.List;

class LedgerAccount implements Account {
    private final List<Integer> changes = new ArrayList<>();   // every deposit (+) and withdrawal (-)

    public void deposit(int amount) {
        if (amount <= 0) {
            throw new IllegalArgumentException("deposit must be positive");
        }
        changes.add(amount);
    }

    public void withdraw(int amount) {
        if (amount <= 0 || amount > getBalance()) {
            throw new IllegalArgumentException("cannot withdraw " + amount);
        }
        changes.add(-amount);
    }

    public int getBalance() {
        int sum = 0;
        for (int c : changes) {
            sum += c;
        }
        return sum;
    }
}`,
  bankClient: `public class BankClient {
    static void useAccount(String label, Account account) {
        account.deposit(100);
        account.withdraw(30);
        account.deposit(50);
        System.out.println(label + ": balance = " + account.getBalance());
        try {
            account.withdraw(500);
        } catch (IllegalArgumentException e) {
            System.out.println(label + ": " + e.getMessage() + ", balance still " + account.getBalance());
        }
    }

    public static void main(String[] args) {
        useAccount("simple", new SimpleAccount());
        useAccount("ledger", new LedgerAccount());
    }
}`,
  intList: `interface IntList {
    void insert(int position, int x);   // 0 <= position <= size(); later elements move one place back
    boolean isEmpty();
    void clear();
    int size();
    int get(int position);              // 0 <= position < size()
    int remove(int position);           // returns the removed element
}`,
  integerSet: `interface IntegerSet {
    boolean add(int x);            // adds x; false if x was already in the set
    boolean contains(int x);       // the slides' search(integer, SetA)
    int size();
    int[] toSortedArray();         // the elements in increasing order
    IntegerSet emptyCopy();        // a new, empty set of the same kind

    default IntegerSet union(IntegerSet other) {
        IntegerSet result = emptyCopy();
        for (int x : toSortedArray()) result.add(x);
        for (int x : other.toSortedArray()) result.add(x);
        return result;
    }

    default IntegerSet intersection(IntegerSet other) {
        IntegerSet result = emptyCopy();
        for (int x : toSortedArray()) {
            if (other.contains(x)) result.add(x);
        }
        return result;
    }

    default IntegerSet difference(IntegerSet other) {   // elements of this set that are not in other
        IntegerSet result = emptyCopy();
        for (int x : toSortedArray()) {
            if (!other.contains(x)) result.add(x);
        }
        return result;
    }
}`,
  arrayIntegerSet: `import java.util.Arrays;

class ArrayIntegerSet implements IntegerSet {
    private int[] items = new int[4];
    private int count = 0;
    long probes = 0;                       // elements compared so far (for measuring only)

    public boolean contains(int x) {
        for (int i = 0; i < count; i++) {
            probes++;
            if (items[i] == x) return true;
        }
        return false;
    }

    public boolean add(int x) {
        if (contains(x)) return false;
        if (count == items.length) items = Arrays.copyOf(items, 2 * count);   // full: double the array
        items[count++] = x;
        return true;
    }

    public int size() { return count; }

    public int[] toSortedArray() {
        int[] copy = Arrays.copyOf(items, count);
        Arrays.sort(copy);
        return copy;
    }

    public IntegerSet emptyCopy() { return new ArrayIntegerSet(); }

    public String toString() { return "array " + Arrays.toString(Arrays.copyOf(items, count)); }
}`,
  hashIntegerSet: `import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

class HashIntegerSet implements IntegerSet {
    private static final int BUCKETS = 7;
    private final List<List<Integer>> table = new ArrayList<>();
    private int count = 0;
    long probes = 0;

    HashIntegerSet() {
        for (int b = 0; b < BUCKETS; b++) table.add(new ArrayList<>());
    }

    private List<Integer> bucketOf(int x) {
        return table.get(Math.floorMod(x, BUCKETS));
    }

    public boolean contains(int x) {
        for (int y : bucketOf(x)) {
            probes++;
            if (y == x) return true;
        }
        return false;
    }

    public boolean add(int x) {
        if (contains(x)) return false;
        bucketOf(x).add(x);
        count++;
        return true;
    }

    public int size() { return count; }

    public int[] toSortedArray() {
        int[] all = new int[count];
        int i = 0;
        for (List<Integer> bucket : table) {
            for (int y : bucket) all[i++] = y;
        }
        Arrays.sort(all);
        return all;
    }

    public IntegerSet emptyCopy() { return new HashIntegerSet(); }

    public String toString() { return "buckets " + table; }
}`,
  setClient: `import java.util.Arrays;

public class SetClient {
    static IntegerSet build(IntegerSet s, int... xs) {
        for (int x : xs) s.add(x);
        return s;
    }

    static void run(IntegerSet a, IntegerSet b) {
        build(a, 12, 5, 26, 19, 33, 8);
        build(b, 5, 8, 40, 12);
        System.out.println("  A = " + Arrays.toString(a.toSortedArray()) + ",  B = " + Arrays.toString(b.toSortedArray()));
        System.out.println("  A contains 19? " + a.contains(19) + ",  A contains 7? " + a.contains(7));
        System.out.println("  A union B        = " + Arrays.toString(a.union(b).toSortedArray()));
        System.out.println("  A intersection B = " + Arrays.toString(a.intersection(b).toSortedArray()));
        System.out.println("  A difference B   = " + Arrays.toString(a.difference(b).toSortedArray()));
        System.out.println("  inside A: " + a);
    }

    public static void main(String[] args) {
        System.out.println("ArrayIntegerSet:");
        run(new ArrayIntegerSet(), new ArrayIntegerSet());
        System.out.println("HashIntegerSet:");
        run(new HashIntegerSet(), new HashIntegerSet());

        ArrayIntegerSet slow = new ArrayIntegerSet();
        HashIntegerSet fast = new HashIntegerSet();
        for (int x = 0; x < 700; x++) {
            slow.add(x);
            fast.add(x);
        }
        slow.probes = 0;
        fast.probes = 0;
        slow.contains(699);
        fast.contains(699);
        System.out.println("700 elements, contains(699): array probes " + slow.probes + ", hash probes " + fast.probes);
    }
}`,
  sortSpec: `import java.util.Arrays;

public class SortSpec {
    // Does output satisfy the sorting specification for input?
    static boolean isSortedPermutation(int[] input, int[] output) {
        for (int i = 1; i < output.length; i++) {
            if (output[i - 1] > output[i]) return false;      // not in order
        }
        int[] a = input.clone();
        int[] b = output.clone();
        Arrays.sort(a);
        Arrays.sort(b);
        return Arrays.equals(a, b);                            // same elements, same counts
    }

    public static void main(String[] args) {
        int[] input = {31, 41, 59, 26, 41, 58};
        int[] good = input.clone();
        Arrays.sort(good);
        System.out.println(Arrays.toString(good) + " -> " + isSortedPermutation(input, good));
        int[] ordered = {1, 2, 3, 4, 5, 6};
        System.out.println(Arrays.toString(ordered) + " -> " + isSortedPermutation(input, ordered));
        int[] shuffled = {26, 31, 41, 58, 59, 41};
        System.out.println(Arrays.toString(shuffled) + " -> " + isSortedPermutation(input, shuffled));
    }
}`,
  bfsLayers: `import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Queue;

public class BfsLayers {
    // Visit order of breadth-first search from vertex 0; the queue is passed in.
    static List<Integer> bfs(int[][] adjacent, Queue<Integer> queue) {
        boolean[] seen = new boolean[adjacent.length];
        List<Integer> order = new ArrayList<>();
        queue.add(0);
        seen[0] = true;
        while (!queue.isEmpty()) {
            int v = queue.remove();
            order.add(v);
            for (int w : adjacent[v]) {
                if (!seen[w]) {
                    seen[w] = true;
                    queue.add(w);
                }
            }
        }
        return order;
    }

    public static void main(String[] args) {
        int[][] adjacent = {{1, 2}, {0, 3, 4}, {0, 5}, {1}, {1, 5}, {2, 4}};
        System.out.println("ArrayDeque: " + bfs(adjacent, new ArrayDeque<>()));
        System.out.println("LinkedList: " + bfs(adjacent, new LinkedList<>()));
    }
}`,
  setOrder: `import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.TreeSet;

public class SetOrder {
    public static void main(String[] args) {
        List<Integer> values = List.of(100, 3, 42, 17);
        Set<Integer> hash = new HashSet<>(values);
        Set<Integer> tree = new TreeSet<>(values);
        System.out.println("HashSet: " + hash);
        System.out.println("TreeSet: " + tree);
    }
}`,
  arrayIntList: `import java.util.Arrays;

class ArrayIntList implements IntList {
    private int[] items = new int[8];
    private int count = 0;
    long shifts = 0;                         // elements moved (for measuring only)

    public void insert(int position, int x) {
        if (position < 0 || position > count) throw new IndexOutOfBoundsException("position " + position);
        if (count == items.length) items = Arrays.copyOf(items, 2 * count);
        for (int i = count; i > position; i--) {   // make a gap at position
            items[i] = items[i - 1];
            shifts++;
        }
        items[position] = x;
        count++;
    }

    public boolean isEmpty() { return count == 0; }

    public void clear() { count = 0; }

    public int size() { return count; }

    public int get(int position) {
        if (position < 0 || position >= count) throw new IndexOutOfBoundsException("position " + position);
        return items[position];                      // one step, wherever position is
    }

    public int remove(int position) {
        int x = get(position);
        for (int i = position; i < count - 1; i++) {  // close the gap
            items[i] = items[i + 1];
            shifts++;
        }
        count--;
        return x;
    }

    public String toString() { return Arrays.toString(Arrays.copyOf(items, count)); }
}`,
  linkedIntList: `class LinkedIntList implements IntList {
    private static class Node {
        int value;
        Node next;

        Node(int value, Node next) {
            this.value = value;
            this.next = next;
        }
    }

    private Node head = null;                // first node, or null when empty
    private int count = 0;
    long hops = 0;                           // links followed (for measuring only)

    private Node nodeAt(int position) {      // walk from the head
        Node p = head;
        for (int i = 0; i < position; i++) {
            p = p.next;
            hops++;
        }
        return p;
    }

    public void insert(int position, int x) {
        if (position < 0 || position > count) throw new IndexOutOfBoundsException("position " + position);
        if (position == 0) {
            head = new Node(x, head);
        } else {
            Node before = nodeAt(position - 1);
            before.next = new Node(x, before.next);
        }
        count++;
    }

    public boolean isEmpty() { return count == 0; }

    public void clear() {
        head = null;
        count = 0;
    }

    public int size() { return count; }

    public int get(int position) {
        if (position < 0 || position >= count) throw new IndexOutOfBoundsException("position " + position);
        return nodeAt(position).value;
    }

    public int remove(int position) {
        int x = get(position);
        if (position == 0) {
            head = head.next;
        } else {
            Node before = nodeAt(position - 1);
            before.next = before.next.next;
        }
        count--;
        return x;
    }

    public String toString() {
        StringBuilder sb = new StringBuilder();
        for (Node p = head; p != null; p = p.next) sb.append(p.value).append(" -> ");
        return sb.append("null").toString();
    }
}`,
  listClient: `public class ListClient {
    static void script(IntList list) {
        list.insert(0, 10);
        list.insert(1, 20);
        list.insert(2, 30);
        list.insert(0, 5);          // at the front
        list.insert(2, 15);         // in the middle
        System.out.println("  after inserts:  " + list + "   size " + list.size());
        System.out.println("  get(4) = " + list.get(4));
        System.out.println("  remove(0) = " + list.remove(0) + ", now " + list);
    }

    public static void main(String[] args) {
        ArrayIntList array = new ArrayIntList();
        LinkedIntList linked = new LinkedIntList();
        System.out.println("ArrayIntList:");
        script(array);
        System.out.println("LinkedIntList:");
        script(linked);
        System.out.println("array shifts = " + array.shifts + ", linked hops = " + linked.hops);
    }
}`,
  selection: `import java.util.Arrays;

class Selection {
    static long comparisons = 0;    // element comparisons (for measuring only)
    static boolean trace = false;

    // Solution 1 with a library sort: sort ascending, the k-th largest is k-th from the end.
    static int kthLargestBySorting(int[] input, int k) {
        int[] a = input.clone();
        Arrays.sort(a);
        return a[a.length - k];
    }

    // Solution 1 with a simple quadratic sort (bubble sort, descending).
    static int kthLargestByBubbleSort(int[] input, int k) {
        int[] a = input.clone();
        for (int pass = 0; pass < a.length - 1; pass++) {
            for (int i = 0; i < a.length - 1 - pass; i++) {
                comparisons++;
                if (a[i] < a[i + 1]) {
                    int t = a[i];
                    a[i] = a[i + 1];
                    a[i + 1] = t;
                }
            }
        }
        return a[k - 1];
    }

    // Solution 2: keep the k largest seen so far in top[0..k-1], in descending order.
    static int kthLargestByKeeping(int[] input, int k) {
        int[] top = new int[k];
        for (int i = 0; i < k; i++) {
            placeDescending(top, i, input[i]);          // step 1: sort the first k
        }
        if (trace) System.out.println("first " + k + " sorted: " + Arrays.toString(top));
        for (int i = k; i < input.length; i++) {
            int x = input[i];
            comparisons++;
            if (x <= top[k - 1]) {                      // step 2.1: ignore
                if (trace) System.out.println("read " + x + ": <= " + top[k - 1] + ", ignored");
                continue;
            }
            int bumped = top[k - 1];
            placeDescending(top, k - 1, x);             // step 2.2: place it, bump the last
            if (trace) System.out.println("read " + x + ": placed, " + bumped + " bumped out -> " + Arrays.toString(top));
        }
        return top[k - 1];                              // step 3
    }

    // top[0..last-1] is in descending order. Put x in its place among top[0..last],
    // overwriting top[last] (an empty cell, or the element being bumped out).
    static void placeDescending(int[] top, int last, int x) {
        int j = last;
        while (j > 0) {
            comparisons++;
            if (top[j - 1] >= x) break;
            top[j] = top[j - 1];                        // move the smaller element one place down
            j--;
        }
        top[j] = x;
    }
}`,
  selectionDemo: `public class SelectionDemo {
    public static void main(String[] args) {
        int[] data = {12, 5, 31, 8, 19, 40, 2, 27, 19, 33};
        Selection.trace = true;
        int answer = Selection.kthLargestByKeeping(data, 3);
        Selection.trace = false;
        System.out.println("3rd largest, solution 2: " + answer);
        System.out.println("3rd largest, solution 1: " + Selection.kthLargestBySorting(data, 3));
        for (int k = 1; k <= data.length; k++) {
            System.out.print(Selection.kthLargestByKeeping(data, k) + (k < data.length ? " " : "\\n"));
        }
    }
}`,
  selectionCost: `import java.util.Random;

public class SelectionCost {
    public static void main(String[] args) {
        Random random = new Random(1);
        for (int n = 1000; n <= 8000; n *= 2) {
            int[] data = new int[n];
            for (int i = 0; i < n; i++) data[i] = random.nextInt(1_000_000);
            int k = n / 2;
            Selection.comparisons = 0;
            Selection.kthLargestByBubbleSort(data, k);
            long bubble = Selection.comparisons;
            Selection.comparisons = 0;
            Selection.kthLargestByKeeping(data, k);
            long keeping = Selection.comparisons;
            System.out.printf("N = %4d, k = N/2:  solution 1 (bubble) %,11d   solution 2 %,11d%n", n, bubble, keeping);
        }
    }
}`,
  powerVsCube: `public class PowerVsCube {
    public static void main(String[] args) {
        for (int n = 1; n <= 20; n++) {
            long power = 1L << n;
            long cube = (long) n * n * n;
            if (power <= cube) System.out.print(n + " ");
        }
        System.out.println();
    }
}`,
  treeSize: `public class TreeSize {
    static int size(FullNode t) {
        return t.isLeaf() ? 1 : size(t.left) + size(t.right) + 1;
    }

    public static void main(String[] args) {
        FullNode leaf = new FullNode();
        FullNode t = new FullNode(new FullNode(new FullNode(), new FullNode()), new FullNode());
        for (FullNode tree : new FullNode[] {leaf, t}) {
            System.out.println("internal " + FullNode.internal(tree) + ", nodes " + size(tree));
        }
    }
}`,
  quickSelect: `import java.util.Random;

public class QuickSelect {
    // Put a[hi] (the pivot) in its final place for descending order; return that index.
    static int partition(int[] a, int lo, int hi) {
        int pivot = a[hi];
        int store = lo;
        for (int i = lo; i < hi; i++) {
            if (a[i] > pivot) {                  // larger elements go to the front
                int t = a[i]; a[i] = a[store]; a[store] = t;
                store++;
            }
        }
        int t = a[hi]; a[hi] = a[store]; a[store] = t;
        return store;
    }

    static int quickSelect(int[] input, int k) {
        int[] a = input.clone();
        int lo = 0, hi = a.length - 1, target = k - 1;
        while (true) {
            int p = partition(a, lo, hi);
            if (p == target) return a[p];
            if (p < target) lo = p + 1; else hi = p - 1;   // continue on one side only
        }
    }

    public static void main(String[] args) {
        int[] data = {12, 5, 31, 8, 19, 40, 2, 27, 19, 33};
        System.out.println("3rd largest: " + quickSelect(data, 3));
        Random random = new Random(7);
        int agree = 0;
        for (int trial = 0; trial < 1000; trial++) {
            int[] xs = new int[1 + random.nextInt(50)];
            for (int i = 0; i < xs.length; i++) xs[i] = random.nextInt(100);
            int k = 1 + random.nextInt(xs.length);
            if (quickSelect(xs, k) == Selection.kthLargestBySorting(xs, k)) agree++;
        }
        System.out.println(agree + " of 1000 random tests agree");
    }
}`,
  keeping: `// Solution 2: keep the k largest seen so far in top[0..k-1], in descending order.
static int kthLargestByKeeping(int[] input, int k) {
    int[] top = new int[k];
    for (int i = 0; i < k; i++) {
        placeDescending(top, i, input[i]);          // step 1: sort the first k
    }
    if (trace) System.out.println("first " + k + " sorted: " + Arrays.toString(top));
    for (int i = k; i < input.length; i++) {
        int x = input[i];
        comparisons++;
        if (x <= top[k - 1]) {                      // step 2.1: ignore
            if (trace) System.out.println("read " + x + ": <= " + top[k - 1] + ", ignored");
            continue;
        }
        int bumped = top[k - 1];
        placeDescending(top, k - 1, x);             // step 2.2: place it, bump the last
        if (trace) System.out.println("read " + x + ": placed, " + bumped + " bumped out -> " + Arrays.toString(top));
    }
    return top[k - 1];                              // step 3
}

// top[0..last-1] is in descending order. Put x in its place among top[0..last],
// overwriting top[last] (an empty cell, or the element being bumped out).
static void placeDescending(int[] top, int last, int x) {
    int j = last;
    while (j > 0) {
        comparisons++;
        if (top[j - 1] >= x) break;
        top[j] = top[j - 1];                        // move the smaller element one place down
        j--;
    }
    top[j] = x;
}`,
};

const OUT = {
  logs: `x =       1   log2(x) =   0.000   halvings = 0
x =       2   log2(x) =   1.000   halvings = 1
x =    1024   log2(x) =  10.000   halvings = 10
x =   65536   log2(x) =  16.000   halvings = 16
x = 1000000   log2(x) =  19.932   halvings = 19
2^n + 2^n = 2048,  2^(n+1) = 2048`,
  series: `1 + ... + 100      = 5050   formula 5050
1^2 + ... + 100^2  = 338350   formula 338350
2 + 5 + 8          = 15   formula 15
sum of 0.5^i, i = 0..1  = 1.5000000   bound 1/(1 - a) = 2.0
sum of 0.5^i, i = 0..5  = 1.9687500   bound 1/(1 - a) = 2.0
sum of 0.5^i, i = 0..20 = 1.9999990   bound 1/(1 - a) = 2.0
1 + 2 + ... + 2^10 = 2047   formula 2^11 - 1 = 2047`,
  fibCounterexample: `k =  1   F(k) =   1   k^2 =   1   ok
k =  2   F(k) =   2   k^2 =   4   ok
k =  3   F(k) =   3   k^2 =   9   ok
k =  4   F(k) =   5   k^2 =  16   ok
k =  5   F(k) =   8   k^2 =  25   ok
k =  6   F(k) =  13   k^2 =  36   ok
k =  7   F(k) =  21   k^2 =  49   ok
k =  8   F(k) =  34   k^2 =  64   ok
k =  9   F(k) =  55   k^2 =  81   ok
k = 10   F(k) =  89   k^2 = 100   ok
k = 11   F(k) = 144   k^2 = 121   FAILS
counterexample: k = 11`,
  euclidNumbers: `primes up to  2: product + 1 =      3   prime
primes up to  3: product + 1 =      7   prime
primes up to  5: product + 1 =     31   prime
primes up to  7: product + 1 =    211   prime
primes up to 11: product + 1 =   2311   prime
primes up to 13: product + 1 =  30031   = 59 * 509
primes up to 17: product + 1 = 510511   = 19 * 26869`,
  leafCount: `leaves = 1, internal = 0
leaves = 2, internal = 1
leaves = 3, internal = 2
leaves = 4, internal = 3
leaves = 5, internal = 4
leaves = 6, internal = 5`,
  intForms: `largest int:     2147483647
largest int + 1: -2147483648
5 in bits:  101
-5 in bits: 11111111111111111111111111111011
0.1 + 0.2 = 0.30000000000000004`,
  bankClient: `simple: balance = 120
simple: cannot withdraw 500, balance still 120
ledger: balance = 120
ledger: cannot withdraw 500, balance still 120`,
  setClient: `ArrayIntegerSet:
  A = [5, 8, 12, 19, 26, 33],  B = [5, 8, 12, 40]
  A contains 19? true,  A contains 7? false
  A union B        = [5, 8, 12, 19, 26, 33, 40]
  A intersection B = [5, 8, 12]
  A difference B   = [19, 26, 33]
  inside A: array [12, 5, 26, 19, 33, 8]
HashIntegerSet:
  A = [5, 8, 12, 19, 26, 33],  B = [5, 8, 12, 40]
  A contains 19? true,  A contains 7? false
  A union B        = [5, 8, 12, 19, 26, 33, 40]
  A intersection B = [5, 8, 12]
  A difference B   = [19, 26, 33]
  inside A: buckets [[], [8], [], [], [], [12, 5, 26, 19, 33], []]
700 elements, contains(699): array probes 700, hash probes 100`,
  sortSpec: `[26, 31, 41, 41, 58, 59] -> true
[1, 2, 3, 4, 5, 6] -> false
[26, 31, 41, 58, 59, 41] -> false`,
  bfsLayers: `ArrayDeque: [0, 1, 2, 3, 4, 5]
LinkedList: [0, 1, 2, 3, 4, 5]`,
  setOrder: `HashSet: [17, 3, 100, 42]
TreeSet: [3, 17, 42, 100]`,
  listClient: `ArrayIntList:
  after inserts:  [5, 10, 15, 20, 30]   size 5
  get(4) = 30
  remove(0) = 5, now [10, 15, 20, 30]
LinkedIntList:
  after inserts:  5 -> 10 -> 15 -> 20 -> 30 -> null   size 5
  get(4) = 30
  remove(0) = 5, now 10 -> 15 -> 20 -> 30 -> null
array shifts = 9, linked hops = 6`,
  selectionDemo: `first 3 sorted: [31, 12, 5]
read 8: placed, 5 bumped out -> [31, 12, 8]
read 19: placed, 8 bumped out -> [31, 19, 12]
read 40: placed, 12 bumped out -> [40, 31, 19]
read 2: <= 19, ignored
read 27: placed, 19 bumped out -> [40, 31, 27]
read 19: <= 27, ignored
read 33: placed, 27 bumped out -> [40, 33, 31]
3rd largest, solution 2: 31
3rd largest, solution 1: 31
40 33 31 27 19 19 12 8 5 2`,
  selectionCost: `N = 1000, k = N/2:  solution 1 (bubble)     499,500   solution 2     152,906
N = 2000, k = N/2:  solution 1 (bubble)   1,999,000   solution 2     599,521
N = 4000, k = N/2:  solution 1 (bubble)   7,998,000   solution 2   2,414,098
N = 8000, k = N/2:  solution 1 (bubble)  31,996,000   solution 2   9,595,524`,
  powerVsCube: `2 3 4 5 6 7 8 9 `,
  treeSize: `internal 0, nodes 1
internal 2, nodes 5`,
  quickSelect: `3rd largest: 31
1000 of 1000 random tests agree`,
};

// ---------- demo widgets (CSS for this lecture only) ----------

const L01_CSS = `
.l1-row { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; margin: 8px 0; }
.l1-chip { font: 600 13px var(--mono); padding: 4px 9px; border-radius: 7px; border: 1px solid var(--line); background: var(--card); }
.l1-chip.on { background: var(--mark); border-color: var(--amber); }
.l1-chip.done { opacity: 0.45; }
.l1-chip.good { background: var(--green-soft); border-color: var(--green); color: var(--green); }
.l1-chip.bad { background: var(--red-soft); border-color: var(--red); color: var(--red); }
.l1-grid2 { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 12px; }
.l1-grid3 { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
.l1-panel { background: var(--paper-2); border-radius: 10px; padding: 10px 12px; min-width: 0; }
.l1-panel > small { display: block; font: 500 11px var(--mono); color: var(--stone); margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.04em; }
.l1-panel .big { font: 600 22px var(--mono); }
.l1-cells { display: flex; flex-wrap: wrap; gap: 4px; }
.l1-cell { min-width: 40px; height: 36px; padding: 0 4px; display: grid; place-items: center; border: 1px solid var(--line); border-radius: 6px; background: var(--card); font: 600 14px var(--mono); position: relative; }
.l1-cell.empty { background: transparent; border-style: dashed; color: var(--stone); font-weight: 400; }
.l1-cell.hot { background: var(--mark); border-color: var(--amber); }
.l1-cell.cmp { box-shadow: 0 0 0 2px var(--teal); }
.l1-cell.new { background: var(--green-soft); border-color: var(--green); color: var(--green); }
.l1-cell.gap { border-style: dashed; opacity: 0.5; }
.l1-cell.bump { background: var(--red-soft); border-color: var(--red); color: var(--red); }
.l1-cell.dim { opacity: 0.35; }
.l1-idx { display: flex; flex-wrap: wrap; gap: 4px; font: 11px var(--mono); color: var(--stone); }
.l1-idx span { min-width: 40px; text-align: center; padding: 0 4px; }
.l1-chain { display: flex; flex-wrap: wrap; align-items: center; gap: 4px; font: 600 14px var(--mono); }
.l1-chain .node { border: 1px solid var(--line); border-radius: 6px; background: var(--card); padding: 6px 9px; }
.l1-chain .node.hot { background: var(--mark); border-color: var(--amber); }
.l1-chain .node.new { background: var(--green-soft); border-color: var(--green); color: var(--green); }
.l1-chain .arrow { color: var(--stone); font-weight: 400; }
.l1-bucket { display: flex; align-items: center; gap: 6px; margin: 3px 0; font: 13px var(--mono); }
.l1-bucket b { width: 22px; color: var(--stone); font-weight: 500; }
.l1-bucket .l1-cell { min-width: 34px; height: 28px; font-size: 13px; }
.l1-bucket.on b { color: var(--amber); }
.l1-table { width: 100%; border-collapse: collapse; font: 13px var(--mono); }
.l1-table td, .l1-table th { border-bottom: 1px solid var(--line); padding: 4px 8px; text-align: right; }
.l1-table th { color: var(--stone); font-weight: 500; }
.l1-table tr.bad td { color: var(--red); font-weight: 600; background: var(--red-soft); }
.l1-table tr.last td { background: var(--mark); }
.l1-scroll { max-height: 280px; overflow: auto; }
.l1-bits { display: flex; flex-wrap: wrap; gap: 8px; }
.l1-bits .byte { display: flex; gap: 1px; }
.l1-bits .bit { width: 17px; height: 26px; display: grid; place-items: center; font: 600 13px var(--mono); border-radius: 3px; background: var(--card); border: 1px solid var(--line); }
.l1-bits .bit.one { background: var(--teal-soft); border-color: var(--teal); color: var(--teal); }
.l1-bits .bit.sign { box-shadow: inset 0 -3px 0 var(--amber); }
.l1-svg text { font-family: var(--mono); }
.l1-svg .leaf { cursor: pointer; }
.l1-layers { display: grid; gap: 6px; }
.l1-layers .layer { border: 1px solid var(--line); border-radius: 8px; padding: 8px 12px; background: var(--card); font-size: 14px; }
.l1-layers .layer small { display: block; font: 500 11px var(--mono); color: var(--stone); text-transform: uppercase; }
.l1-layers .down { text-align: center; color: var(--stone); font: 12px var(--mono); }
@media (max-width: 600px) {
  .l1-grid2, .l1-grid3 { grid-template-columns: minmax(0, 1fr); }
  .l1-cell { min-width: 32px; height: 32px; font-size: 12px; }
  .l1-idx span { min-width: 32px; }
  .l1-bits .bit { width: 13px; height: 22px; font-size: 11px; }
}`;

if (typeof document !== "undefined" && !document.getElementById("l01-css")) {
  const st = document.createElement("style");
  st.id = "l01-css";
  st.textContent = L01_CSS;
  document.head.appendChild(st);
}

// Generic step player: build() -> snaps (each with msg, cls), render(snap) -> html.
// Mini players hide the controls and loop by themselves.
function player(el, opts) {
  const mini = !!opts.mini;
  el.innerHTML = `<div class="pl-view"></div>` + (mini ? "" : `<div class="msg pl-msg"></div>
    <div class="controls">
      <button class="cbtn pl-reset" title="Back to the start">⟲ Reset</button>
      <button class="cbtn pl-back" title="Step back (←)">◀ Back</button>
      <button class="cbtn pl-step on" title="Step (→)">Step ▶</button>
      <button class="cbtn pl-play">Play</button>
      ${opts.controls || ""}
      <span class="spacer"></span><span class="counter pl-count"></span>
    </div>`);
  const $ = (q) => el.querySelector(q);
  let snaps = [], i = 0, timer = null;
  function render() {
    const s = snaps[i];
    $(".pl-view").innerHTML = opts.render(s, i, snaps);
    if (opts.afterRender) opts.afterRender(el, s, i);
    if (mini) return;
    const m = $(".pl-msg");
    m.innerHTML = s.msg || "";
    m.className = "msg pl-msg " + (s.cls || "");
    $(".pl-count").textContent = `step ${i + 1} / ${snaps.length}`;
    $(".pl-back").disabled = $(".pl-reset").disabled = i === 0;
    $(".pl-step").disabled = i === snaps.length - 1;
  }
  function stop() { clearInterval(timer); timer = null; if (!mini) $(".pl-play").textContent = "Play"; }
  function play() {
    if (timer) return stop();
    if (i === snaps.length - 1) i = 0;
    if (!mini) $(".pl-play").textContent = "Pause";
    timer = setInterval(() => {
      if (i < snaps.length - 1) i++;
      else if (mini) i = 0;
      else return stop();
      render();
    }, opts.interval || (mini ? 1000 : 750));
  }
  function rebuild(toEnd = false) {
    stop();
    snaps = opts.build();
    i = toEnd ? snaps.length - 1 : 0;
    render();
  }
  if (!mini) {
    $(".pl-reset").onclick = () => { stop(); i = 0; render(); };
    $(".pl-back").onclick = () => { stop(); if (i > 0) i--; render(); };
    $(".pl-step").onclick = () => { stop(); if (i < snaps.length - 1) i++; render(); };
    $(".pl-play").onclick = play;
    el.tabIndex = 0;
    el.addEventListener("keydown", (e) => {
      if (["INPUT", "SELECT", "TEXTAREA"].includes(e.target.tagName)) return;
      if (e.key === "ArrowRight") { e.preventDefault(); $(".pl-step").click(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); $(".pl-back").click(); }
    });
  }
  const api = { rebuild, stop };
  if (opts.onMount) opts.onMount(el, api);
  rebuild();
  if (mini) play();
  return api;
}

const fmt = (x) => x.toLocaleString("en");
const chips = (xs, cls = () => "") => `<div class="l1-row">${xs.map((x, k) => `<span class="l1-chip ${cls(k)}">${x}</span>`).join("")}</div>`;
const stat = (label, value, cls = "") => `<div class="stat ${cls}"><small>${label}</small><b>${value}</b></div>`;

// ---------- 1. halving = log2 ----------

// Twin of Logs.halvings(n): the values n takes, ending at 1.
function halvingSteps(n) {
  const vals = [n];
  while (n > 1) { n = Math.floor(n / 2); vals.push(n); }
  return vals;
}

function demoHalving(el, { mini = false } = {}) {
  let n = mini ? 1000 : 1000;
  player(el, {
    mini,
    build() {
      const vals = halvingSteps(n);
      return vals.map((v, k) => ({
        k, vals,
        msg: k === 0 ? `Start with n = ${fmt(n)}. Halve it (integer division) until it reaches 1.`
          : k < vals.length - 1 ? `${fmt(vals[k - 1])} / 2 = ${fmt(v)} — ${k} halving${k > 1 ? "s" : ""} so far.`
            : `Reached 1 after <b>${k}</b> halving${k === 1 ? "" : "s"}. log₂ ${fmt(n)} = ${Math.log2(n).toFixed(3)}, so halvings(${fmt(n)}) = ⌊log₂ n⌋ = ${k}.`,
        cls: k === vals.length - 1 ? "good" : "",
      }));
    },
    render(s) {
      const top = s.vals[0];
      const bars = s.vals.map((v, k) => k > s.k ? "" :
        `<div class="bar"><span class="mono">${k === 0 ? "n" : "÷2 ×" + k}</span><div class="track"><div class="fill ${k === s.k ? "amber" : ""}" style="width:${Math.max(0.4, 100 * v / top)}%"></div></div><span class="v">${fmt(v)}</span></div>`).join("");
      return `<div class="bars">${bars}</div>` + (mini ? "" :
        `<div class="stats">${stat("halvings so far", s.k)}${stat("log₂ n", Math.log2(top).toFixed(3))}${stat("⌊log₂ n⌋", Math.floor(Math.log2(top) + 1e-9))}</div>`);
    },
    controls: `<label>n <input type="number" class="hv-n" min="1" max="1000000000" value="${n}" style="width:120px;max-width:calc(100vw - 120px)"></label>`,
    onMount(root, api) {
      if (mini) return;
      root.querySelector(".hv-n").onchange = (e) => {
        n = Math.min(1e9, Math.max(1, Math.trunc(+e.target.value) || 1));
        e.target.value = n;
        api.rebuild();
      };
    },
  });
}

// ---------- 1. Gauss staircase ----------

function demoGauss(el) {
  let N = 6;
  player(el, {
    build() {
      const snaps = [{ cols: 0, mirror: false, msg: `Sum 1 + 2 + … + ${N}: column i is a stack of i squares.` }];
      let sum = 0;
      for (let c = 1; c <= N; c++) {
        sum += c;
        snaps.push({ cols: c, mirror: false, msg: `Add column ${c}: running sum ${sum}.` });
      }
      snaps.push({ cols: N, mirror: true, cls: "good",
        msg: `Add a second, upside-down copy (amber). Together they fill a ${N} × ${N + 1} rectangle, so 2 · sum = ${N} · ${N + 1} = ${N * (N + 1)}, and sum = ${N * (N + 1) / 2}.` });
      return snaps;
    },
    render(s) {
      const W = 720, cell = Math.min(44, Math.floor(560 / N), Math.floor(300 / (N + 1)));
      const x0 = (W - N * cell) / 2, H = (N + 1) * cell + 40;
      let g = `<svg class="l1-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="staircase">`;
      for (let c = 1; c <= N; c++) {
        for (let r = 0; r <= N; r++) {           // r = 0 is the bottom row
          const x = x0 + (c - 1) * cell, y = 10 + (N - r) * cell;
          let fill = "none", stroke = "var(--line)";
          if (c <= s.cols && r < c) { fill = "var(--teal-soft)"; stroke = "var(--teal)"; }
          else if (s.mirror && r >= c) { fill = "var(--mark)"; stroke = "var(--amber)"; }
          g += `<rect x="${x + 1}" y="${y + 1}" width="${cell - 2}" height="${cell - 2}" rx="3" fill="${fill}" stroke="${stroke}" stroke-dasharray="${fill === "none" ? "3 3" : ""}"/>`;
        }
        g += `<text x="${x0 + (c - 0.5) * cell}" y="${H - 12}" font-size="12" text-anchor="middle" fill="var(--stone)">${c}</text>`;
      }
      return g + "</svg>";
    },
    controls: `<label>N <input type="range" class="gs-n" min="1" max="12" value="${N}"> <b class="gs-v mono">${N}</b></label>`,
    onMount(root, api) {
      root.querySelector(".gs-n").oninput = (e) => { N = +e.target.value; root.querySelector(".gs-v").textContent = N; api.rebuild(); };
    },
  });
}

// ---------- 1. geometric series ----------

function demoGeometric(el) {
  let A = 0.5;
  const TERMS = 20;
  player(el, {
    build() {
      const snaps = [];
      let partial = 0;
      for (let i = 0; i <= TERMS; i++) {
        partial += A ** i;
        const formula = (1 - A ** (i + 1)) / (1 - A);
        snaps.push({ i, partial, msg: `Add A<sup>${i}</sup> = ${(A ** i).toFixed(7)}. Sum of A<sup>0</sup> … A<sup>${i}</sup> = <b>${partial.toFixed(7)}</b>; formula (1 − A<sup>${i + 1}</sup>)/(1 − A) = ${formula.toFixed(7)}.`,
          cls: i === TERMS ? "good" : "" });
      }
      snaps[TERMS].msg += ` Still below 1/(1 − A) = ${(1 / (1 - A)).toFixed(4)}, and it always will be.`;
      return snaps;
    },
    render(s) {
      const bound = 1 / (1 - A), W = 720, scale = 640 / bound;
      let g = `<svg class="l1-svg" viewBox="0 0 ${W} 110" role="img" aria-label="partial sums">`;
      let x = 20;
      for (let j = 0; j <= s.i; j++) {
        const w = A ** j * scale;
        g += `<rect x="${x}" y="30" width="${Math.max(w, 0.5)}" height="34" fill="${j === s.i ? "var(--amber)" : j % 2 ? "var(--sea)" : "var(--teal)"}" opacity="${j === s.i ? 1 : 0.8}"/>`;
        x += w;
      }
      const bx = 20 + 640;
      g += `<line x1="${bx}" y1="18" x2="${bx}" y2="76" stroke="var(--red)" stroke-width="2" stroke-dasharray="5 4"/>`;
      g += `<text x="${bx}" y="94" font-size="12" text-anchor="end" fill="var(--red)">bound 1/(1 − A) = ${bound.toFixed(3)}</text>`;
      g += `<text x="20" y="94" font-size="12" fill="var(--stone)">0</text>`;
      g += `<text x="20" y="20" font-size="12" fill="var(--ink)">sum = ${s.partial.toFixed(7)}</text></svg>`;
      return g;
    },
    controls: `<label>A <input type="range" class="ge-a" min="0.1" max="0.9" step="0.1" value="${A}"> <b class="ge-v mono">${A}</b></label>`,
    onMount(root, api) {
      root.querySelector(".ge-a").oninput = (e) => { A = +e.target.value; root.querySelector(".ge-v").textContent = A.toFixed(1); api.rebuild(); };
    },
  });
}

// ---------- 2. counterexample search ----------

function smallestFactor(n) {
  for (let d = 2; d * d <= n; d++) if (n % d === 0) return d;
  return n;
}

const CLAIMS = {
  fib: {
    title: "F(k) ≤ k² for all k ≥ 1  (F(0) = F(1) = 1)",
    head: ["k", "F(k)", "k²", ""],
    rows() {
      const rows = [];
      let prev = 1, cur = 1;                    // F(0), F(1), as in FibCounterexample
      for (let k = 1; k <= 40; k++) {
        rows.push({ n: k, cells: [k, cur, k * k], ok: cur <= k * k });
        if (cur > k * k) break;
        [prev, cur] = [cur, cur + prev];
      }
      return rows;
    },
  },
  euler: {
    title: "n² + n + 41 is prime for all n ≥ 0",
    head: ["n", "n² + n + 41", "smallest factor", ""],
    rows() {
      const rows = [];
      for (let n = 0; n <= 60; n++) {
        const v = n * n + n + 41, f = smallestFactor(v);
        rows.push({ n, cells: [n, v, f === v ? "prime" : `${f} · ${v / f}`], ok: f === v });
        if (f !== v) break;
      }
      return rows;
    },
  },
  power: {
    title: "2ⁿ > n³ for all n ≥ 1",
    head: ["n", "2ⁿ", "n³", ""],
    rows() {
      const rows = [];
      for (let n = 1; n <= 20; n++) {
        rows.push({ n, cells: [n, 2 ** n, n ** 3], ok: 2 ** n > n ** 3 });
        if (!(2 ** n > n ** 3)) break;
      }
      return rows;
    },
  },
};

function demoCounterexample(el) {
  let claim = "fib";
  player(el, {
    build() {
      const C = CLAIMS[claim], rows = C.rows();
      return rows.map((r, k) => ({
        rows: rows.slice(0, k + 1), C,
        msg: r.ok ? `n = ${r.n}: the claim holds. That proves nothing yet — keep looking.`
          : `n = ${r.n}: the claim <b>fails</b>. One counterexample disproves “for all”. (The ${k} successes before it proved nothing.)`,
        cls: r.ok ? "" : "bad",
      }));
    },
    render(s) {
      const body = s.rows.map((r, k) => `<tr class="${r.ok ? (k === s.rows.length - 1 ? "last" : "") : "bad"}">${r.cells.map((c) => `<td>${typeof c === "number" ? fmt(c) : c}</td>`).join("")}<td>${r.ok ? "ok" : "FAILS"}</td></tr>`).join("");
      return `<p class="mono" style="margin:0 0 6px;font-size:13px">claim: ${s.C.title}</p>
        <div class="l1-scroll"><table class="l1-table"><tr>${s.C.head.map((h) => `<th>${h}</th>`).join("")}</tr>${body}</table></div>`;
    },
    afterRender(root) { const sc = root.querySelector(".l1-scroll"); sc.scrollTop = sc.scrollHeight; },
    interval: 450,
    controls: `<select class="ce-c"><option value="fib">F(k) ≤ k²</option><option value="euler">n² + n + 41 is prime</option><option value="power">2ⁿ &gt; n³</option></select>`,
    onMount(root, api) { root.querySelector(".ce-c").onchange = (e) => { claim = e.target.value; api.rebuild(); }; },
  });
}

// ---------- 2. Euclid ----------

function demoEuclid(el) {
  const primes = [2, 3, 5, 7, 11, 13, 17];
  player(el, {
    build() {
      const snaps = [{ k: 0, msg: "Suppose these were <em>all</em> the primes. Step to multiply them and add 1." }];
      let product = 1;
      primes.forEach((q, k) => {
        product *= q;
        const p = product + 1, f = smallestFactor(p);
        snaps.push({ k: k + 1, product, p, f,
          msg: `${primes.slice(0, k + 1).join(" · ")} + 1 = ${fmt(p)}. ` + (f === p
            ? `${fmt(p)} is prime, and it is not on the list.`
            : `${fmt(p)} = ${f} · ${fmt(p / f)} is <b>not</b> prime — but its prime factor ${f} is not on the list either.`) +
            ` Dividing ${fmt(p)} by any listed prime leaves remainder 1.`,
          cls: f === p ? "good" : "" });
      });
      return snaps;
    },
    render(s) {
      const list = chips(primes.map(String), (k) => k < s.k ? "on" : "done");
      if (!s.k) return list + `<div class="stats">${stat("product + 1", "—")}${stat("smallest prime factor", "—")}</div>`;
      return list + `<div class="stats">${stat("product", fmt(s.product))}${stat("p = product + 1", fmt(s.p))}${stat("smallest prime factor", s.f, "good")}${stat("largest prime on the list", primes[s.k - 1])}</div>`;
    },
    interval: 1100,
  });
}

// ---------- 2. induction dominoes ----------

function demoDominoes(el) {
  let N = 6;
  player(el, {
    build() {
      const snaps = [{ fallen: 0, msg: `P(n): 1 + 2 + … + n = n(n + 1)/2. One domino per value of n. Nothing is proved yet.` }];
      snaps.push({ fallen: 1, msg: `<b>Basis</b>, n = 1: left side 1, right side 1 · 2 / 2 = 1. Domino 1 falls.`, cls: "good" });
      for (let n = 1; n < N; n++) {
        const a = n * (n + 1) / 2, b = a + n + 1;
        snaps.push({ fallen: n + 1, msg: `<b>Step</b> n = ${n} → ${n + 1}: by P(${n}), 1 + … + ${n} = ${a}. Add ${n + 1}: ${a} + ${n + 1} = ${b} = ${n + 1} · ${n + 2} / 2. So P(${n + 1}) holds.` });
      }
      snaps[snaps.length - 1].cls = "good";
      snaps[snaps.length - 1].msg += ` The same step works for every n, so every domino falls.`;
      return snaps;
    },
    render(s) {
      const W = 720, H = 130, gap = Math.min(80, 600 / N);
      let g = `<svg class="l1-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="dominoes">`;
      g += `<line x1="20" y1="100" x2="${W - 20}" y2="100" stroke="var(--line)"/>`;
      for (let k = 1; k <= N; k++) {
        const x = 60 + (k - 1) * gap, down = k <= s.fallen;
        const fill = down ? (k === s.fallen ? "var(--amber)" : "var(--teal)") : "var(--card)";
        g += `<g transform="rotate(${down ? 62 : 0} ${x + 12} 100)"><rect x="${x}" y="40" width="12" height="60" rx="2" fill="${fill}" stroke="var(--ink-2)"/></g>`;
        g += `<text x="${x + 6}" y="120" font-size="12" text-anchor="middle" fill="var(--stone)">P(${k})</text>`;
      }
      return g + `<text x="${W - 30}" y="60" font-size="18" text-anchor="end" fill="var(--stone)">…</text></svg>`;
    },
    controls: `<label>dominoes <input type="range" class="dm-n" min="2" max="8" value="${N}"> <b class="dm-v mono">${N}</b></label>`,
    onMount(root, api) { root.querySelector(".dm-n").oninput = (e) => { N = +e.target.value; root.querySelector(".dm-v").textContent = N; api.rebuild(); }; },
  });
}

// ---------- 2. structural induction: splitting leaves ----------

// A tree is described by the list of leaves split so far, each named by its path ("" = root,
// "L", "R", "LR", ...). Splitting turns the leaf into an internal node with two new leaves.
function buildFullTree(splits) {
  const internal = new Set(splits);
  let id = 0;
  function make(path) {
    const node = { id: id++, path, kids: [], leaf: !internal.has(path) };
    if (!node.leaf) node.kids = [make(path + "L"), make(path + "R")];
    return node;
  }
  return make("");
}

function countTree(t) {
  return t.leaf ? { leaves: 1, internal: 0 } : (() => {
    const a = countTree(t.kids[0]), b = countTree(t.kids[1]);
    return { leaves: a.leaves + b.leaves, internal: a.internal + b.internal + 1 };
  })();
}

function demoFullTree(el, { mini = false } = {}) {
  let handle = null;            // the player, for the leaf click handlers
  let at = 0;                   // the step on screen
  let splits = ["", "L", "R", "RL", "LR"];
  let seed = 7;
  const rand = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
  player(el, {
    mini,
    build() {
      const snaps = [];
      for (let k = 0; k <= splits.length; k++) {
        const tree = buildFullTree(splits.slice(0, k)), c = countTree(tree);
        snaps.push({ tree, c, last: k ? splits[k - 1] : null,
          msg: k === 0 ? "A single leaf: 1 leaf, 0 internal nodes. Click any green leaf to split it."
            : `Split leaf “${splits[k - 1] || "root"}”: it becomes internal (+1 internal), and two new leaves replace it (−1 + 2 = +1 leaf). Leaves − internal is still ${c.leaves - c.internal}.`,
          cls: "" });
      }
      return snaps;
    },
    render(s) {
      layoutTree(s.tree);
      const nodes = [];
      (function walk(n) { nodes.push(n); n.kids.forEach(walk); })(s.tree);
      const slots = nodes.filter((n) => n.leaf).length;
      const depth = Math.max(...nodes.map((n) => n.depth));
      const W = mini ? 400 : 720, slotW = W / Math.max(slots, 1), rowH = mini ? 46 : 58, H = (depth + 1) * rowH + 10;
      const cx = (n) => (n.x + 0.5) * slotW, cy = (n) => n.depth * rowH + 22;
      let g = `<svg class="l1-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="binary tree">`;
      nodes.forEach((n) => n.kids.forEach((k) => { g += `<line x1="${cx(n)}" y1="${cy(n)}" x2="${cx(k)}" y2="${cy(k)}" stroke="var(--ink-2)" stroke-width="1.3"/>`; }));
      nodes.forEach((n) => {
        const fresh = s.last !== null && (n.path === s.last + "L" || n.path === s.last + "R");
        if (n.leaf) {
          g += `<rect class="leaf" data-path="${n.path}" x="${cx(n) - 13}" y="${cy(n) - 13}" width="26" height="26" rx="5" fill="${fresh ? "var(--mark)" : "var(--green-soft)"}" stroke="${fresh ? "var(--amber)" : "var(--green)"}" stroke-width="1.6"><title>leaf ${n.path || "root"}: click to split</title></rect>`;
        } else {
          g += `<circle cx="${cx(n)}" cy="${cy(n)}" r="13" fill="${n.path === s.last ? "var(--mark)" : "var(--teal-soft)"}" stroke="${n.path === s.last ? "var(--amber)" : "var(--teal)"}" stroke-width="1.6"/>`;
        }
      });
      g += "</svg>";
      return `<div class="svgbox">${g}</div><div class="stats">${stat("leaves", s.c.leaves)}${stat("internal nodes", s.c.internal)}${stat("leaves − internal", s.c.leaves - s.c.internal, "good")}</div>`;
    },
    afterRender(root, s, i) {
      at = i;
      if (mini) return;
      root.querySelectorAll(".leaf").forEach((r) => {
        r.onclick = () => { splits = splits.slice(0, i).concat([r.dataset.path]); handle.rebuild(true); };
      });
    },
    controls: `<button class="cbtn ft-rand">Split a random leaf</button><button class="cbtn ft-clear">Start over</button>`,
    onMount(root, a) {
      handle = a;
      if (mini) return;
      root.querySelector(".ft-rand").onclick = () => {
        const cur = splits.slice(0, at);
        const leaves = [];
        (function walk(n) { if (n.leaf) leaves.push(n.path); else n.kids.forEach(walk); })(buildFullTree(cur));
        if (cur.length < 14) { splits = cur.concat([leaves[Math.floor(rand() * leaves.length)]]); a.rebuild(true); }
      };
      root.querySelector(".ft-clear").onclick = () => { splits = []; a.rebuild(); };
    },
  });
}

// ---------- 2. the horse paradox ----------

function demoHorses(el) {
  let M = 4;                    // M = n + 1 horses in the inductive step
  const COLOURS = ["#8a5a2b", "#d9d4c7"];
  player(el, {
    build() {
      const n = M - 1;
      const snaps = [
        { stage: 0, msg: `Inductive step for n = ${n}: take n + 1 = ${M} horses, labelled 1 … ${M}.` },
        { stage: 1, msg: `Set A = {1, …, ${n}} has n = ${n} horse${n > 1 ? "s" : ""}. By the hypothesis they share one colour.` },
        { stage: 2, msg: `Set B = {2, …, ${M}} also has ${n} horse${n > 1 ? "s" : ""}, so B has one colour too.` },
      ];
      if (n >= 2) {
        snaps.push({ stage: 3, msg: `Horse${n > 2 ? "s" : ""} ${n > 2 ? `2 … ${n} are` : "2 is"} in both sets, so A's colour = B's colour. For n = ${n} this step is valid.`, cls: "good" });
        snaps.push({ stage: 4, msg: `But the step is only useful if every earlier step works too. Set the slider to 2 horses to find the broken link.` });
      } else {
        snaps.push({ stage: 3, msg: `A = {1} and B = {2} share <b>no</b> horse. Nothing links the two colours: the step from 1 horse to 2 fails.`, cls: "bad" });
        snaps.push({ stage: 4, msg: `A brown horse and a white horse: P(2) is false, so the dominoes stop after the first.`, cls: "bad" });
      }
      return snaps;
    },
    render(s) {
      const n = M - 1, W = 720, gap = Math.min(90, 560 / M), x0 = (W - (M - 1) * gap) / 2, H = 190;
      const px = (k) => x0 + (k - 1) * gap;
      let g = `<svg class="l1-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="horses">`;
      if (s.stage >= 1) g += `<rect x="${px(1) - 30}" y="30" width="${px(n) - px(1) + 60}" height="56" rx="14" fill="none" stroke="var(--teal)" stroke-width="2"/><text x="${px(1) - 26}" y="24" font-size="13" fill="var(--teal)">A</text>`;
      if (s.stage >= 2) g += `<rect x="${px(2) - 26}" y="${n >= 2 ? 52 : 30}" width="${px(M) - px(2) + 52}" height="${n >= 2 ? 80 : 56}" rx="14" fill="none" stroke="var(--amber)" stroke-width="2"/><text x="${px(M) + 14}" y="${n >= 2 ? 148 : 102}" font-size="13" fill="var(--amber)">B</text>`;
      for (let k = 1; k <= M; k++) {
        let fill = "var(--card)";
        if (n === 1 && s.stage >= 4) fill = COLOURS[k - 1];
        else if (s.stage >= 3 && n >= 2) fill = COLOURS[0];
        else if ((s.stage >= 1 && k <= n) || (s.stage >= 2 && k >= 2)) fill = COLOURS[0];
        const both = s.stage >= 3 && k >= 2 && k <= n;
        g += `<circle cx="${px(k)}" cy="72" r="20" fill="${fill}" stroke="${both ? "var(--green)" : "var(--ink-2)"}" stroke-width="${both ? 3 : 1.4}"/>`;
        g += `<text x="${px(k)}" y="77" font-size="14" text-anchor="middle" fill="${fill === COLOURS[0] ? "#fff" : "#222"}" font-weight="600">${k}</text>`;
      }
      if (s.stage >= 3) g += `<text x="${W / 2}" y="178" font-size="13" text-anchor="middle" fill="${n >= 2 ? "var(--green)" : "var(--red)"}">${n >= 2 ? "overlap: " + (n > 2 ? `horses 2 … ${n}` : "horse 2") : "overlap: none"}</text>`;
      return g + "</svg>";
    },
    controls: `<label>horses (n + 1) <input type="range" class="hs-m" min="2" max="7" value="${M}"> <b class="hs-v mono">${M}</b></label>`,
    onMount(root, api) { root.querySelector(".hs-m").oninput = (e) => { M = +e.target.value; root.querySelector(".hs-v").textContent = M; api.rebuild(); }; },
  });
}

// ---------- 3. int: logical vs physical form ----------

function demoIntForms(el) {
  let value = 2147483645, logical = 2147483645n;
  el.innerHTML = `<div class="if-view"></div><div class="msg if-msg"></div>
    <div class="controls">
      <button class="cbtn if-dec" title="−1 (←)">◀ − 1</button><button class="cbtn on if-inc" title="+1 (→)">+ 1 ▶</button>
      <button class="cbtn if-set" data-v="2147483647">MAX_VALUE</button><button class="cbtn if-set" data-v="-2147483648">MIN_VALUE</button>
      <button class="cbtn if-set" data-v="5">5</button><button class="cbtn if-set" data-v="-5">−5</button>
      <label>set <input type="number" class="if-in" style="width:130px;max-width:calc(100vw - 120px)"></label>
    </div>`;
  const $ = (q) => el.querySelector(q);
  function render(note = "") {
    const bits = (value >>> 0).toString(2).padStart(32, "0");
    const bytes = [0, 1, 2, 3].map((b) => `<div class="byte">${[...bits.slice(8 * b, 8 * b + 8)].map((c, j) =>
      `<span class="bit ${c === "1" ? "one" : ""} ${b === 0 && j === 0 ? "sign" : ""}">${c}</span>`).join("")}</div>`).join("");
    const same = BigInt(value) === logical;
    $(".if-view").innerHTML = `<div class="l1-grid2">
      <div class="l1-panel"><small>logical form: the integer you meant</small><div class="big">${logical.toLocaleString("en")}</div></div>
      <div class="l1-panel"><small>physical form: the int Java stores</small><div class="big" style="color:${same ? "var(--ink)" : "var(--red)"}">${value.toLocaleString("en")}</div></div></div>
      <div class="l1-panel" style="margin-top:10px"><small>32 bits, two's complement (amber = sign bit)</small><div class="l1-bits">${bytes}</div></div>`;
    const m = $(".if-msg");
    m.innerHTML = note || (same ? "The two forms agree. Press + 1 a few times." : `Overflow: the int wrapped around. Java does not warn you; <code>Math.addExact</code> would throw an <code>ArithmeticException</code> instead.`);
    m.className = "msg if-msg " + (same ? "" : "bad");
  }
  const step = (d) => { value = (value + d) | 0; logical += BigInt(d); render(); };
  $(".if-inc").onclick = () => step(1);
  $(".if-dec").onclick = () => step(-1);
  el.querySelectorAll(".if-set").forEach((b) => { b.onclick = () => { value = +b.dataset.v; logical = BigInt(value); render(); }; });
  $(".if-in").onchange = (e) => {
    const v = Math.trunc(+e.target.value);
    if (!Number.isFinite(v)) return;
    logical = BigInt(v); value = v | 0;
    render(BigInt(value) === logical ? "" : `${v.toLocaleString("en")} does not fit in 32 bits; Java would not even compile this literal as an int. Keeping the low 32 bits gives ${value.toLocaleString("en")}.`);
  };
  el.tabIndex = 0;
  el.addEventListener("keydown", (e) => {
    if (e.target.tagName === "INPUT") return;
    if (e.key === "ArrowRight") { e.preventDefault(); step(1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); step(-1); }
  });
  render();
}

// ---------- 3. bank account: one interface, two implementations ----------

function parseOps(text, names) {
  return text.split(/[,;\n]+/).map((s) => s.trim().split(/\s+/)).filter((p) => names.includes(p[0]))
    .map(([op, a, b]) => ({ op, a: a === undefined ? undefined : Math.trunc(+a), b: b === undefined ? undefined : Math.trunc(+b) }))
    .filter((o) => [o.a, o.b].every((v) => v === undefined || Number.isFinite(v)));
}

// Twin of SimpleAccount and LedgerAccount running the same calls.
function traceBank(ops) {
  let balance = 0;
  const changes = [];
  const snaps = [{ balance, changes: [], msg: "Two new accounts. The client sees only <code>deposit</code>, <code>withdraw</code> and <code>getBalance</code>." }];
  for (const o of ops) {
    let msg, cls = "", err = false;
    const sum = changes.reduce((x, y) => x + y, 0);
    if (o.op === "deposit") {
      if (o.a <= 0) { err = true; msg = `deposit(${o.a}): both throw <code>IllegalArgumentException: deposit must be positive</code>. Nothing changes.`; }
      else { balance += o.a; changes.push(o.a); msg = `deposit(${o.a}): SimpleAccount adds to its one number; LedgerAccount appends +${o.a} to its list.`; }
    } else if (o.op === "withdraw") {
      if (o.a <= 0 || o.a > sum) { err = true; msg = `withdraw(${o.a}): both throw <code>IllegalArgumentException: cannot withdraw ${o.a}</code>. The balance stays ${sum}.`; }
      else { balance -= o.a; changes.push(-o.a); msg = `withdraw(${o.a}): SimpleAccount subtracts; LedgerAccount appends −${o.a} (after adding up ${changes.length - 1} entries to check the balance).`; }
    } else {
      msg = `getBalance() = ${balance} from both. SimpleAccount reads one field; LedgerAccount adds up ${changes.length} entr${changes.length === 1 ? "y" : "ies"}.`;
      cls = "good";
    }
    snaps.push({ balance, changes: changes.slice(), call: `${o.op}(${o.a === undefined ? "" : o.a})`, err, msg, cls: err ? "bad" : cls });
  }
  return snaps;
}

function demoBank(el, { mini = false } = {}) {
  let text = "deposit 100, withdraw 30, deposit 50, getBalance, withdraw 500";
  player(el, {
    mini,
    build: () => traceBank(parseOps(text, ["deposit", "withdraw", "getBalance"])),
    render(s) {
      const client = `<div class="l1-panel"><small>client (sees the interface)</small><div class="mono" style="font-size:14px">${s.call ? `account.${esc(s.call)}` : "—"}</div><div class="big" style="margin-top:6px">${s.balance}</div><div class="counter">balance</div></div>`;
      const simple = `<div class="l1-panel"><small>inside SimpleAccount</small><div class="l1-cells"><span class="l1-cell ${s.err ? "bump" : "hot"}">${s.balance}</span></div><div class="counter" style="margin-top:6px">private int balance</div></div>`;
      const ledger = `<div class="l1-panel"><small>inside LedgerAccount</small><div class="l1-cells">${s.changes.length ? s.changes.map((c, k) => `<span class="l1-cell ${k === s.changes.length - 1 && !s.err && s.call && !s.call.startsWith("get") ? "new" : ""}">${c > 0 ? "+" + c : c}</span>`).join("") : `<span class="l1-cell empty">[ ]</span>`}</div><div class="counter" style="margin-top:6px">private List&lt;Integer&gt; changes</div></div>`;
      return mini ? `<div class="l1-grid2">${simple}${ledger}</div><p class="counter" style="margin:8px 0 0">${s.call ? esc(s.call) : "new accounts"} → balance ${s.balance}</p>` : `<div class="l1-grid3">${client}${simple}${ledger}</div>`;
    },
    controls: `<label>calls <input type="text" class="bk-ops" value="${text}" style="width:300px;max-width:calc(100vw - 120px)"></label>`,
    onMount(root, api) {
      if (mini) return;
      root.querySelector(".bk-ops").onchange = (e) => { text = e.target.value; api.rebuild(); };
    },
  });
}

// ---------- 4. IntegerSet: unsorted array vs 7 buckets ----------

// Twin of ArrayIntegerSet and HashIntegerSet: add() calls contains() first; probes count
// the elements compared.
function traceSets(adds, queries) {
  const arr = [], buckets = Array.from({ length: 7 }, () => []);
  let cap = 4, aProbes = 0, hProbes = 0;
  const mod7 = (x) => ((x % 7) + 7) % 7;
  const snap = (extra) => ({ arr: arr.slice(), cap, buckets: buckets.map((b) => b.slice()), aProbes, hProbes, ...extra });
  const snaps = [snap({ msg: "Two empty sets: an array with room for 4 elements, and 7 empty buckets." })];
  function contains(x) {
    let a = 0, h = 0, foundA = -1, foundH = -1;
    for (let i = 0; i < arr.length; i++) { a++; if (arr[i] === x) { foundA = i; break; } }
    const b = buckets[mod7(x)];
    for (let i = 0; i < b.length; i++) { h++; if (b[i] === x) { foundH = i; break; } }
    aProbes += a; hProbes += h;
    return { a, h, found: foundA >= 0, foundA, foundH, scanA: foundA >= 0 ? foundA + 1 : arr.length, scanH: foundH >= 0 ? foundH + 1 : b.length };
  }
  for (const x of adds) {
    const r = contains(x), bk = mod7(x);
    if (!r.found) {
      if (arr.length === cap) cap *= 2;
      arr.push(x);
      buckets[bk].push(x);
    }
    snaps.push(snap({ x, bk, scanA: r.scanA, scanH: r.scanH, added: !r.found,
      msg: `add(${x}): ${r.found ? `already there — nothing added` : `not there, so append it`}. The array compared ${r.a} element${r.a === 1 ? "" : "s"}; the hash set looked only in bucket ${x} mod 7 = ${bk} and compared ${r.h}.` }));
  }
  for (const x of queries) {
    const r = contains(x), bk = mod7(x);
    snaps.push(snap({ x, bk, scanA: r.scanA, scanH: r.scanH, query: true, cls: r.found ? "good" : "",
      msg: `contains(${x}) = <b>${r.found}</b> in both. Array: ${r.a} comparison${r.a === 1 ? "" : "s"}. Hash: bucket ${bk}, ${r.h} comparison${r.h === 1 ? "" : "s"}.` }));
  }
  return snaps;
}

function demoIntSet(el, { mini = false } = {}) {
  let adds = [12, 5, 26, 19, 33, 8], queries = [19, 7, 40];
  player(el, {
    mini,
    build: () => traceSets(adds, queries),
    render(s) {
      const newIdx = s.added ? s.arr.length - 1 : -1;
      const cells = Array.from({ length: s.cap }, (_, k) => {
        if (k >= s.arr.length) return `<span class="l1-cell empty"> </span>`;
        const cls = k === newIdx ? "new" : (s.scanA !== undefined && k < s.scanA ? "hot" : "");
        return `<span class="l1-cell ${cls}">${s.arr[k]}</span>`;
      }).join("");
      const arrPanel = `<div class="l1-panel"><small>ArrayIntegerSet · probes ${s.aProbes}</small><div class="l1-cells">${cells}</div><div class="l1-idx">${Array.from({ length: s.cap }, (_, k) => `<span>${k}</span>`).join("")}</div></div>`;
      const rows = s.buckets.map((b, k) => `<div class="l1-bucket ${k === s.bk ? "on" : ""}"><b>${k}</b>${b.map((v, j) => {
        const cls = k === s.bk && s.added && j === b.length - 1 ? "new" : (k === s.bk && j < s.scanH ? "hot" : "");
        return `<span class="l1-cell ${cls}">${v}</span>`;
      }).join("") || `<span class="counter">·</span>`}</div>`).join("");
      const hashPanel = `<div class="l1-panel"><small>HashIntegerSet · probes ${s.hProbes}</small>${rows}</div>`;
      return (mini && s.x !== undefined ? `<p class="counter" style="margin:0 0 6px">${s.query ? "contains" : "add"}(${s.x})</p>` : "") + `<div class="l1-grid2">${arrPanel}${hashPanel}</div>`;
    },
    interval: mini ? 1100 : 800,
    controls: `<label>add <input type="text" class="is-a" value="${adds.join(", ")}" style="width:170px;max-width:calc(100vw - 120px)"></label>
      <label>then contains <input type="text" class="is-q" value="${queries.join(", ")}" style="width:100px;max-width:calc(100vw - 120px)"></label>`,
    onMount(root, api) {
      if (mini) return;
      root.querySelector(".is-a").onchange = (e) => { adds = parseNums(e.target.value, [12, 5, 26, 19, 33, 8]).slice(0, 14); e.target.value = adds.join(", "); api.rebuild(); };
      root.querySelector(".is-q").onchange = (e) => { queries = parseNums(e.target.value, [19, 7, 40]).slice(0, 6); e.target.value = queries.join(", "); api.rebuild(); };
    },
  });
}

// ---------- 4. three layers: BFS on a queue, two queue implementations ----------

const BFS_ADJ = [[1, 2], [0, 3, 4], [0, 5], [1], [1, 5], [2, 4]];
const BFS_POS = [[90, 90], [250, 40], [250, 150], [420, 20], [420, 100], [420, 180]];

// Twin of BfsLayers.bfs. The queue is drawn as a circular array of capacity 4 or as a chain.
function traceBfs() {
  const seen = Array(6).fill(false), order = [], q = [];
  let head = 0, tail = 0;              // circular-array indices (capacity 4)
  const ring = Array(4).fill(null);
  const snaps = [];
  const snap = (cur, msg) => snaps.push({ cur, msg, seen: seen.slice(), order: order.slice(), q: q.slice(), ring: ring.slice(), head, tail });
  const enqueue = (v) => { q.push(v); ring[tail] = v; tail = (tail + 1) % 4; };
  const dequeue = () => { const v = q.shift(); ring[head] = null; head = (head + 1) % 4; return v; };
  seen[0] = true; enqueue(0);
  snap(-1, "Mark vertex 0 as seen and <code>add</code> it to the queue.");
  while (q.length) {
    const v = dequeue();
    order.push(v);
    const fresh = BFS_ADJ[v].filter((w) => !seen[w]);
    fresh.forEach((w) => { seen[w] = true; enqueue(w); });
    snap(v, `<code>remove()</code> gives ${v}; visit it. ` + (fresh.length ? `Its unseen neighbours ${fresh.join(", ")} are added at the back.` : "No unseen neighbours."));
  }
  snaps[snaps.length - 1].msg += ` Visit order [${order.join(", ")}] — the same with either queue.`;
  snaps[snaps.length - 1].cls = "good";
  return snaps;
}

function demoLayers(el) {
  let impl = "array";
  player(el, {
    build: traceBfs,
    render(s) {
      let g = `<svg class="l1-svg" viewBox="0 0 520 210" role="img" aria-label="graph">`;
      BFS_ADJ.forEach((ns, v) => ns.forEach((w) => { if (v < w) g += `<line x1="${BFS_POS[v][0]}" y1="${BFS_POS[v][1]}" x2="${BFS_POS[w][0]}" y2="${BFS_POS[w][1]}" stroke="var(--line)" stroke-width="2"/>`; }));
      BFS_POS.forEach(([x, y], v) => {
        const visited = s.order.includes(v), inQ = s.q.includes(v);
        const fill = v === s.cur ? "var(--mark)" : visited ? "var(--green-soft)" : inQ ? "var(--teal-soft)" : "var(--card)";
        const stroke = v === s.cur ? "var(--amber)" : visited ? "var(--green)" : inQ ? "var(--teal)" : "var(--line)";
        g += `<circle cx="${x}" cy="${y}" r="18" fill="${fill}" stroke="${stroke}" stroke-width="2"/><text x="${x}" y="${y + 5}" font-size="14" text-anchor="middle" fill="var(--ink)">${v}</text>`;
      });
      g += "</svg>";
      let queue;
      if (impl === "array") {
        queue = `<small>queue as a circular array (capacity 4)</small><div class="l1-cells">${s.ring.map((v) => `<span class="l1-cell ${v === null ? "empty" : ""}">${v === null ? " " : v}</span>`).join("")}</div>
          <div class="l1-idx">${s.ring.map((_, k) => `<span>${k}${k === s.head ? " h" : ""}${k === s.tail ? " t" : ""}</span>`).join("")}</div><div class="counter" style="margin-top:4px">h = head (next to remove), t = tail (next free cell); both wrap around</div>`;
      } else {
        queue = `<small>queue as a linked list</small><div class="l1-chain">head → ${s.q.map((v) => `<span class="node">${v}</span><span class="arrow">→</span>`).join("")} null</div>`;
      }
      return `<div class="l1-grid2"><div class="svgbox">${g}</div><div class="l1-layers">
        <div class="layer"><small>algorithm</small>BFS: visit order [${s.order.join(", ")}]</div><div class="down">uses add / remove ↓</div>
        <div class="layer"><small>ADT</small>queue: [${s.q.join(", ")}] (front first)</div><div class="down">implemented by ↓</div>
        <div class="layer">${queue}</div></div></div>`;
    },
    controls: `<select class="ly-i"><option value="array">ArrayDeque (circular array)</option><option value="linked">LinkedList (linked list)</option></select>`,
    onMount(root, api) { root.querySelector(".ly-i").onchange = (e) => { impl = e.target.value; api.rebuild(); }; },
  });
}

// ---------- 4. IntList: array vs linked list ----------

// Twin of ArrayIntList and LinkedIntList. shifts = elements moved, hops = links followed.
function traceLists(ops) {
  let items = [], cap = 8, shifts = 0, hops = 0;
  const snap = (extra) => ({ items: items.slice(), cap, shifts, hops, ...extra });
  const snaps = [snap({ msg: "Two empty lists. Step through the same calls on both." })];
  for (const o of ops) {
    const n = items.length, call = `${o.op}(${[o.a, o.b].filter((v) => v !== undefined).join(", ")})`;
    const bad = (o.op === "insert" && (o.a < 0 || o.a > n || o.b === undefined)) || (o.op !== "insert" && (o.a === undefined || o.a < 0 || o.a >= n));
    if (bad) { snaps.push(snap({ call, msg: `${call}: position out of range — both throw <code>IndexOutOfBoundsException</code>.`, cls: "bad" })); continue; }
    if (o.op === "insert") {
      const s = n - o.a, h = o.a === 0 ? 0 : o.a - 1;
      if (n === cap) cap *= 2;
      items.splice(o.a, 0, o.b);
      shifts += s; hops += h;
      snaps.push(snap({ call, pos: o.a, moved: s, walked: h, kind: "new",
        msg: `${call}: the array shifts ${s} element${s === 1 ? "" : "s"} one place right to open a gap; the linked list follows ${h} link${h === 1 ? "" : "s"} to the node before position ${o.a}${o.a === 0 ? " (none: the new node becomes the head)" : ""} and relinks two references.` }));
    } else if (o.op === "get") {
      hops += o.a;
      snaps.push(snap({ call, pos: o.a, walked: o.a, moved: 0, kind: "hot", cls: "good",
        msg: `${call} = ${items[o.a]}: the array reads cell ${o.a} directly; the linked list walks ${o.a} link${o.a === 1 ? "" : "s"} from the head.` }));
    } else {
      const x = items[o.a], s = n - 1 - o.a, h = o.a + (o.a === 0 ? 0 : o.a - 1);
      items.splice(o.a, 1);
      shifts += s; hops += h;
      snaps.push(snap({ call, pos: o.a, moved: s, walked: h, kind: "gone",
        msg: `${call} = ${x}: the array shifts ${s} element${s === 1 ? "" : "s"} left to close the gap; the linked list follows ${h} link${h === 1 ? "" : "s"} (in <code>get</code>${o.a ? " and again to the node before" : ""}) and unlinks one node.` }));
    }
  }
  return snaps;
}

function demoIntList(el, { mini = false } = {}) {
  let text = "insert 0 10, insert 1 20, insert 2 30, insert 0 5, insert 2 15, get 4, remove 0";
  player(el, {
    mini,
    build: () => traceLists(parseOps(text, ["insert", "get", "remove"])),
    render(s) {
      const cells = Array.from({ length: s.cap }, (_, k) => {
        if (k >= s.items.length) return `<span class="l1-cell empty"> </span>`;
        let cls = "";
        if (s.kind === "new" && k === s.pos) cls = "new";
        else if (s.kind === "hot" && k === s.pos) cls = "hot";
        else if ((s.kind === "new" && k > s.pos) || (s.kind === "gone" && k >= s.pos)) cls = "hot";
        return `<span class="l1-cell ${cls}">${s.items[k]}</span>`;
      }).join("");
      const chain = s.items.map((v, k) => {
        let cls = "";
        if (s.kind === "new" && k === s.pos) cls = "new";
        else if (s.walked && k <= Math.max(0, (s.kind === "hot" ? s.pos : s.pos - 1)) && (s.kind === "hot" || s.pos > 0)) cls = "hot";
        return `<span class="node ${cls}">${v}</span><span class="arrow">→</span>`;
      }).join("");
      const head = (mini && s.call ? `<p class="counter" style="margin:0 0 6px">${s.call}</p>` : "");
      return head + `<div class="l1-grid2">
        <div class="l1-panel"><small>ArrayIntList · shifts ${s.shifts}</small><div class="l1-cells">${cells}</div><div class="l1-idx">${Array.from({ length: s.cap }, (_, k) => `<span>${k}</span>`).join("")}</div></div>
        <div class="l1-panel"><small>LinkedIntList · hops ${s.hops}</small><div class="l1-chain">head → ${chain} null</div></div></div>`;
    },
    controls: `<label>calls <input type="text" class="il-ops" value="${text}" style="width:320px;max-width:calc(100vw - 120px)"></label>`,
    onMount(root, api) {
      if (mini) return;
      root.querySelector(".il-ops").onchange = (e) => { text = e.target.value; api.rebuild(); };
    },
  });
}

// ---------- 5. selection, solution 2 ----------

// Twin of Selection.kthLargestByKeeping and placeDescending; line numbers refer to CODE.keeping.
function traceSelection(data, k) {
  const top = Array(k).fill(null), snaps = [];
  let comps = 0;
  const snap = (line, msg, ex = {}) => snaps.push({ line, msg, top: top.slice(), comps, data, k, ...ex });
  snap(3, `Make <code>top</code>, an array of k = ${k} cells. It will hold the ${k} largest elements read so far, largest first.`, { i: -1 });
  function place(last, x, i) {
    let j = last;
    while (j > 0) {
      comps++;
      if (top[j - 1] >= x) {
        snap(28, `top[${j - 1}] = ${top[j - 1]} ≥ ${x}: stop. ${x} goes in cell ${j}.`, { i, x, cmp: j - 1 });
        break;
      }
      snap(28, `top[${j - 1}] = ${top[j - 1]} &lt; ${x}: ${top[j - 1]} must move down one cell.`, { i, x, cmp: j - 1 });
      top[j] = top[j - 1];
      snap(29, `Copy ${top[j]} from cell ${j - 1} to cell ${j}.`, { i, x, put: j, gap: j - 1 });
      j--;
    }
    top[j] = x;
    snap(32, `Put ${x} in cell ${j}.`, { i, x, put: j, fresh: true });
  }
  for (let i = 0; i < k; i++) {
    snap(5, `Step 1: read ${data[i]} (element ${i}) and place it among the first ${i} sorted cell${i === 1 ? "" : "s"}.`, { i, x: data[i] });
    place(i, data[i], i);
  }
  for (let i = k; i < data.length; i++) {
    const x = data[i];
    comps++;
    if (x <= top[k - 1]) {
      snap(11, `Step 2.1: read ${x}. ${x} ≤ top[${k - 1}] = ${top[k - 1]}, the ${k}th largest so far: <b>ignore</b> it.`, { i, x, cmp: k - 1 });
      continue;
    }
    snap(11, `Step 2.2: read ${x}. ${x} &gt; top[${k - 1}] = ${top[k - 1]}, so ${x} belongs in the top ${k} and ${top[k - 1]} is bumped out.`, { i, x, cmp: k - 1, bump: k - 1 });
    place(k - 1, x, i);
  }
  snap(19, `Step 3: return top[${k - 1}] = <b>${top[k - 1]}</b>, the ${k}th largest, after ${comps} comparisons.`, { i: data.length, done: true, cls: "good" });
  return snaps;
}

function demoSelection(el, { mini = false } = {}) {
  let data = [12, 5, 31, 8, 19, 40, 2, 27, 19, 33], k = 3;
  player(el, {
    mini,
    interval: mini ? 700 : 650,
    build: () => traceSelection(data, k),
    render(s) {
      const stream = `<div class="l1-cells">${s.data.map((v, j) => `<span class="l1-cell ${j === s.i && !s.done ? "hot" : (j < s.i || s.done) ? "dim" : ""}">${v}</span>`).join("")}</div>`;
      const top = `<div class="l1-cells">${s.top.map((v, j) => {
        let cls = v === null ? "empty" : "";
        if (j === s.put && s.fresh) cls = "new";
        else if (j === s.gap) cls = "gap";
        else if (j === s.bump) cls = "bump";
        else if (j === s.put) cls = "hot";
        if (j === s.cmp) cls += " cmp";
        if (s.done && j === s.k - 1) cls = "new";
        return `<span class="l1-cell ${cls}">${v === null ? " " : v}</span>`;
      }).join("")}</div><div class="l1-idx">${s.top.map((_, j) => `<span>${j}</span>`).join("")}</div>`;
      const panels = `<div class="l1-panel"><small>input${s.x !== undefined && !s.done ? ` · reading ${s.x}` : ""}</small>${stream}</div>
        <div class="l1-panel" style="margin-top:8px"><small>top (k = ${s.k}) · comparisons ${s.comps}</small>${top}</div>`;
      if (mini) return panels;
      const code = codeBlock(CODE.keeping, "java", [s.line]);
      return `<div class="stepper"><div>${code}</div><div>${panels}</div></div>`;
    },
    controls: `<label>data <input type="text" class="sl-d" value="${data.join(", ")}" style="width:220px;max-width:calc(100vw - 120px)"></label>
      <label>k <input type="number" class="sl-k" min="1" value="${k}"></label>`,
    onMount(root, api) {
      if (mini) return;
      root.querySelector(".sl-d").onchange = (e) => {
        data = parseNums(e.target.value, [12, 5, 31, 8, 19, 40, 2, 27, 19, 33]).slice(0, 16);
        e.target.value = data.join(", ");
        k = Math.min(k, data.length); root.querySelector(".sl-k").value = k;
        api.rebuild();
      };
      root.querySelector(".sl-k").onchange = (e) => {
        k = Math.min(data.length, Math.max(1, Math.trunc(+e.target.value) || 1));
        e.target.value = k;
        api.rebuild();
      };
    },
  });
}

// ---------- 5. how the work grows ----------

function demoSelectionCost(el) {
  el.innerHTML = `<div class="controls" style="margin-top:0"><label>N = <b class="sc-v mono"></b>, k = N/2</label>
    <input type="range" class="sc-n" min="2" max="7" step="0.01" value="6" style="width:240px;max-width:calc(100vw - 120px)"></div>
    <div class="bars sc-bars"></div><p class="hint sc-hint"></p>`;
  const $ = (q) => el.querySelector(q);
  function render() {
    const N = Math.round(10 ** +$(".sc-n").value), k = Math.floor(N / 2);
    const rows = [
      ["solution 1, bubble sort", N * (N - 1) / 2, "red"],
      ["solution 2, worst case", k * (k - 1) / 2 + (N - k) * k, "amber"],
      ["solution 1, N log N sort", N * Math.log2(N), ""],
      ["quickselect (average)", 3.4 * N, ""],
    ];
    const top = Math.log10(rows[0][1]);
    $(".sc-v").textContent = fmt(N);
    $(".sc-bars").innerHTML = rows.map(([label, v, c]) => {
      const secs = v / 1e9;
      const t = secs < 1e-3 ? "&lt; 1 ms" : secs < 1 ? `${Math.round(secs * 1000)} ms` : secs < 120 ? `${secs.toFixed(1)} s` : secs < 7200 ? `${(secs / 60).toFixed(0)} min` : `${(secs / 3600).toFixed(1)} h`;
      return `<div class="bar"><span>${label}</span><div class="track"><div class="fill ${c}" style="width:${Math.max(1, 100 * Math.log10(Math.max(v, 1)) / top)}%"></div></div><span class="v">${v >= 1e6 ? v.toExponential(1) : fmt(Math.round(v))}<br><small>${t}</small></span></div>`;
    }).join("");
    $(".sc-hint").innerHTML = "Comparisons from the formulas in the note (log scale), and the time at 10⁹ comparisons per second. Slide to N = 1,000,000: the two simple solutions need minutes; the better algorithms need milliseconds.";
  }
  $(".sc-n").oninput = render;
  render();
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
  halving: (el) => demoHalving(el),
  halvingMini: (el) => demoHalving(el, { mini: true }),
  gauss: (el) => demoGauss(el),
  geometric: (el) => demoGeometric(el),
  counterexample: (el) => demoCounterexample(el),
  euclid: (el) => demoEuclid(el),
  dominoes: (el) => demoDominoes(el),
  fullTree: (el) => demoFullTree(el),
  treeMini: (el) => demoFullTree(el, { mini: true }),
  horses: (el) => demoHorses(el),
  intForms: (el) => demoIntForms(el),
  bank: (el) => demoBank(el),
  bankMini: (el) => demoBank(el, { mini: true }),
  intSet: (el) => demoIntSet(el),
  intSetMini: (el) => demoIntSet(el, { mini: true }),
  layers: (el) => demoLayers(el),
  intList: (el) => demoIntList(el),
  listMini: (el) => demoIntList(el, { mini: true }),
  selection: (el) => demoSelection(el),
  selectionMini: (el) => demoSelection(el, { mini: true }),
  selectionCost: (el) => demoSelectionCost(el),
  quiz: (el) => demoQuiz(el, QUIZ),
};
