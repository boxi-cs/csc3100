// Interactive demos for Lecture 11. Every code panel and output is copied from
// notes/L11-quicksort.md (checked by tools/check.py); the JS twins replay what Java does, step
// by step. Random choices use JavaRandom, a port of java.util.Random, so a seed picks the same
// pivots as the Java programs.

const CODE = {
  flipCoinProg: `import java.util.Random;

public class FlipCoin {
    // One run of flipCoin(). Its cost counts 2 basic operations per round:
    // one call of RANDOM(0, 1) and one test of the condition r != 1.
    static int flipCoin(Random rng) {
        int cost = 0;
        int r;
        do {
            r = rng.nextInt(2);   // RANDOM(0, 1)
            cost += 2;
        } while (r != 1);
        return cost;
    }

    public static void main(String[] args) {
        Random rng = new Random(7);
        System.out.print("cost of ten runs:");
        for (int k = 0; k < 10; k++) {
            System.out.print(" " + flipCoin(rng));
        }
        System.out.println();

        int trials = 1_000_000;
        long total = 0;
        for (int k = 0; k < trials; k++) {
            total += flipCoin(rng);
        }
        System.out.printf("average cost of %d runs: %.3f%n", trials, (double) total / trials);
    }
}`,
  partition: `public class Partition {
    /** Partitions arr[left..right] around the value at index pivot; returns the pivot's new index. */
    public static int partition(int[] arr, int left, int right, int pivot) {
        int pivotVal = arr[pivot];         // record the pivot value
        swap(arr, right, pivot);           // park the pivot at the right end
        int nextSmallPos = left;           // where the next value < pivotVal goes
        for (int j = left; j < right; j++) {
            if (arr[j] < pivotVal) {
                swap(arr, nextSmallPos, j);
                nextSmallPos++;
            }
        }
        swap(arr, nextSmallPos, right);    // move the pivot between the two parts
        return nextSmallPos;
    }

    public static void swap(int[] arr, int i, int j) {
        int tmp = arr[i];
        arr[i] = arr[j];
        arr[j] = tmp;
    }
}`,
  partitionTrace: `import java.util.Arrays;

public class PartitionTrace {
    public static void main(String[] args) {
        int[] arr = {4, 2, 3, 6, 9, 5, 7};
        int left = 0, right = 6, pivot = 3;

        int pivotVal = arr[pivot];
        Partition.swap(arr, right, pivot);
        System.out.println("pivotVal = " + pivotVal + ", parked: " + Arrays.toString(arr));
        int nextSmallPos = left;
        for (int j = left; j < right; j++) {
            if (arr[j] < pivotVal) {
                Partition.swap(arr, nextSmallPos, j);
                nextSmallPos++;
                System.out.println("j = " + j + ": small, swap -> " + Arrays.toString(arr)
                        + "  nextSmallPos = " + nextSmallPos);
            } else {
                System.out.println("j = " + j + ": large, skip -> " + Arrays.toString(arr)
                        + "  nextSmallPos = " + nextSmallPos);
            }
        }
        Partition.swap(arr, nextSmallPos, right);
        System.out.println("pivot to " + nextSmallPos + ":       " + Arrays.toString(arr));
    }
}`,
  partitionDemo: `import java.util.Arrays;

public class PartitionDemo {
    public static void main(String[] args) {
        int[] a = {4, 2, 3, 6, 9, 5, 7};
        int p = Partition.partition(a, 0, a.length - 1, 3);
        System.out.println("pivot index 3 -> returns " + p + ": " + Arrays.toString(a));

        int[] b = {10, 80, 30, 90, 40};
        int q = Partition.partition(b, 0, b.length - 1, 4);
        System.out.println("pivot index 4 -> returns " + q + ": " + Arrays.toString(b));
    }
}`,
  randomizedQuickSort: `import java.util.Random;

public class RandomizedQuickSort {
    public static void sort(int[] arr, Random rng) {
        quicksort(arr, 0, arr.length - 1, rng);
    }

    static void quicksort(int[] arr, int left, int right, Random rng) {
        if (left >= right) {
            return;                                          // 0 or 1 element: sorted
        }
        int pivot = left + rng.nextInt(right - left + 1);    // RANDOM(left, right)
        int p = Partition.partition(arr, left, right, pivot);
        quicksort(arr, left, p - 1, rng);                    // values < pivot
        quicksort(arr, p + 1, right, rng);                   // values > pivot
    }
}`,
  quickSortTrace: `import java.util.Arrays;
import java.util.Random;

public class QuickSortTrace {
    // RandomizedQuickSort.quicksort plus one print per call.
    static void quicksort(int[] arr, int left, int right, Random rng, String indent) {
        if (left >= right) {
            return;
        }
        int pivot = left + rng.nextInt(right - left + 1);
        int pivotVal = arr[pivot];
        int p = Partition.partition(arr, left, right, pivot);
        System.out.println(indent + "quicksort(" + left + ", " + right + "): pivot " + pivotVal
                + " -> " + Arrays.toString(Arrays.copyOfRange(arr, left, right + 1)));
        quicksort(arr, left, p - 1, rng, indent + "  ");
        quicksort(arr, p + 1, right, rng, indent + "  ");
    }

    public static void main(String[] args) {
        for (long seed : new long[] {19, 2026}) {
            int[] arr = {13, 81, 92, 43, 31, 65, 57, 26, 75, 0};
            System.out.println("seed " + seed + ":");
            quicksort(arr, 0, arr.length - 1, new Random(seed), "");
            System.out.println(Arrays.toString(arr));
        }
    }
}`,
  median3: `// Sorts a[left], a[center], a[right]; then hides the median at right - 1 and returns it.
static int median3(int[] a, int left, int right) {
    int center = (left + right) / 2;
    if (a[center] < a[left]) {
        swap(a, left, center);
    }
    if (a[right] < a[left]) {
        swap(a, left, right);
    }
    if (a[right] < a[center]) {
        swap(a, center, right);
    }
    swap(a, center, right - 1);          // place the pivot at position right - 1
    return a[right - 1];
}`,
  medianQuickSort: `public class MedianQuickSort {
    // Ranges of at most CUTOFF elements go to insertion sort. Must be at least 2;
    // Weiss uses 10. We use 3 so that the small examples below really partition.
    static final int CUTOFF = 3;

    public static void sort(int[] a) {
        quicksort(a, 0, a.length - 1);
    }

    static void quicksort(int[] a, int left, int right) {
        if (left + CUTOFF <= right) {
            int pivot = median3(a, left, right);
            // Begin partitioning: a[left] <= pivot and a[right - 1] == pivot act as sentinels.
            int i = left, j = right - 1;
            while (true) {
                while (a[++i] < pivot) { }   // skip small values
                while (a[--j] > pivot) { }   // skip large values
                if (i >= j) {
                    break;                   // i and j have crossed
                }
                swap(a, i, j);
            }
            swap(a, i, right - 1);           // restore the pivot
            quicksort(a, left, i - 1);       // sort small elements
            quicksort(a, i + 1, right);      // sort large elements
        } else {
            insertionSort(a, left, right);   // small range: insertion sort is faster
        }
    }

    // Sorts a[left], a[center], a[right]; then hides the median at right - 1 and returns it.
    static int median3(int[] a, int left, int right) {
        int center = (left + right) / 2;
        if (a[center] < a[left]) {
            swap(a, left, center);
        }
        if (a[right] < a[left]) {
            swap(a, left, right);
        }
        if (a[right] < a[center]) {
            swap(a, center, right);
        }
        swap(a, center, right - 1);          // place the pivot at position right - 1
        return a[right - 1];
    }

    static void insertionSort(int[] a, int left, int right) {
        for (int p = left + 1; p <= right; p++) {
            int tmp = a[p];
            int j = p;
            while (j > left && a[j - 1] > tmp) {
                a[j] = a[j - 1];
                j--;
            }
            a[j] = tmp;
        }
    }

    static void swap(int[] a, int i, int j) {
        int tmp = a[i];
        a[i] = a[j];
        a[j] = tmp;
    }
}`,
  median3Trace: `import java.util.Arrays;

public class Median3Trace {
    public static void main(String[] args) {
        int[] a = {8, 1, 4, 9, 6, 3, 5, 2, 7, 0};
        int left = 0, right = a.length - 1;
        int pivot = MedianQuickSort.median3(a, left, right);
        System.out.println("median3:   " + Arrays.toString(a) + "  pivot = " + pivot);

        int i = left, j = right - 1;
        while (true) {
            while (a[++i] < pivot) { }
            while (a[--j] > pivot) { }
            System.out.println("i stops at " + i + " (" + a[i] + "), j stops at " + j + " (" + a[j] + ")");
            if (i >= j) {
                break;
            }
            MedianQuickSort.swap(a, i, j);
            System.out.println("swap:      " + Arrays.toString(a));
        }
        MedianQuickSort.swap(a, i, right - 1);
        System.out.println("restore:   " + Arrays.toString(a) + "  pivot at " + i);
    }
}`,
  medianSortTrace: `import java.util.Arrays;

public class MedianSortTrace {
    // MedianQuickSort.quicksort plus prints.
    static void quicksort(int[] a, int left, int right, String indent) {
        if (left + MedianQuickSort.CUTOFF <= right) {
            int pivot = MedianQuickSort.median3(a, left, right);
            System.out.println(indent + "quicksort(" + left + ", " + right + "): median3 -> "
                    + Arrays.toString(a) + ", pivot " + pivot);
            int i = left, j = right - 1;
            while (true) {
                while (a[++i] < pivot) { }
                while (a[--j] > pivot) { }
                if (i >= j) {
                    break;
                }
                MedianQuickSort.swap(a, i, j);
            }
            MedianQuickSort.swap(a, i, right - 1);
            System.out.println(indent + "  partitioned -> " + Arrays.toString(a) + ", pivot at " + i);
            quicksort(a, left, i - 1, indent + "  ");
            quicksort(a, i + 1, right, indent + "  ");
        } else {
            MedianQuickSort.insertionSort(a, left, right);
            System.out.println(indent + "insertionSort(" + left + ", " + right + ") -> " + Arrays.toString(a));
        }
    }

    public static void main(String[] args) {
        int[] a = {5, 7, 4, 1, 0, 2, 9};
        quicksort(a, 0, a.length - 1, "");
        int[] b = {8, 1, 4, 9, 6, 3, 5, 2, 7, 0};
        MedianQuickSort.sort(b);
        System.out.println(Arrays.toString(b));
    }
}`,
  slideLoop: `// The slides' loop. Don't use it: it can run forever on duplicates.
int i = left + 1, j = right - 2;
while (true) {
    while (a[i] < pivot) { i++; }
    while (a[j] > pivot) { j--; }
    if (i >= j) {
        break;
    }
    swap(a, i, j);
}
swap(a, i, right - 1);`,
  slideLoopStuck: `public class SlideLoopStuck {
    public static void main(String[] args) {
        int[] a = {5, 5, 5, 5, 5};
        int left = 0, right = a.length - 1;
        int pivot = MedianQuickSort.median3(a, left, right);
        int i = left + 1, j = right - 2;        // the slide's loop, with a round counter added
        long rounds = 0;
        while (rounds < 1_000_000) {
            while (a[i] < pivot) { i++; }
            while (a[j] > pivot) { j--; }
            if (i >= j) {
                break;
            }
            MedianQuickSort.swap(a, i, j);
            rounds++;
        }
        System.out.println("after " + rounds + " rounds: i = " + i + ", j = " + j);
    }
}`,
  pairCompared: `import java.util.Random;

public class PairCompared {
    static boolean[][] compared;

    // Randomized quicksort on the ranks 1..n; records every (pivot, element) comparison.
    static void quicksort(int[] arr, int left, int right, Random rng) {
        if (left >= right) {
            return;
        }
        int pivot = left + rng.nextInt(right - left + 1);
        for (int k = left; k <= right; k++) {
            if (k != pivot) {
                compared[arr[k]][arr[pivot]] = true;
                compared[arr[pivot]][arr[k]] = true;
            }
        }
        int p = Partition.partition(arr, left, right, pivot);
        quicksort(arr, left, p - 1, rng);
        quicksort(arr, p + 1, right, rng);
    }

    public static void main(String[] args) {
        int n = 10, runs = 100_000;
        int[][] pairs = {{1, 2}, {3, 6}, {1, 10}};
        int[] hits = new int[pairs.length];
        Random rng = new Random(11);
        for (int r = 0; r < runs; r++) {
            int[] arr = {7, 2, 9, 4, 1, 10, 6, 3, 8, 5};    // the ranks in some order
            compared = new boolean[n + 1][n + 1];
            quicksort(arr, 0, n - 1, rng);
            for (int k = 0; k < pairs.length; k++) {
                if (compared[pairs[k][0]][pairs[k][1]]) {
                    hits[k]++;
                }
            }
        }
        for (int k = 0; k < pairs.length; k++) {
            int i = pairs[k][0], j = pairs[k][1];
            System.out.printf("e%d, e%d: compared in %.3f of runs, 2/(j-i+1) = %.3f%n",
                    i, j, hits[k] / (double) runs, 2.0 / (j - i + 1));
        }
    }
}`,
  countComparisons: `import java.util.Random;

public class CountComparisons {
    static long comparisons;

    // Lomuto quicksort; rng == null always takes arr[right], otherwise RANDOM(left, right).
    static void quicksort(int[] arr, int left, int right, Random rng) {
        if (left >= right) {
            return;
        }
        int pivot = (rng == null) ? right : left + rng.nextInt(right - left + 1);
        comparisons += right - left;    // partition compares every other element with the pivot once
        int p = Partition.partition(arr, left, right, pivot);
        quicksort(arr, left, p - 1, rng);
        quicksort(arr, p + 1, right, rng);
    }

    static int[] sortedArray(int n) {
        int[] a = new int[n];
        for (int k = 0; k < n; k++) {
            a[k] = k + 1;
        }
        return a;
    }

    public static void main(String[] args) {
        Random rng = new Random(3100);
        System.out.println("   n   last pivot   random pivot (avg of 100)   2(n+1)H(n) - 4n");
        for (int n : new int[] {10, 100, 1000}) {
            comparisons = 0;
            quicksort(sortedArray(n), 0, n - 1, null);
            long last = comparisons;

            comparisons = 0;
            for (int t = 0; t < 100; t++) {
                quicksort(sortedArray(n), 0, n - 1, rng);
            }
            double random = comparisons / 100.0;

            double h = 0;
            for (int k = 1; k <= n; k++) {
                h += 1.0 / k;
            }
            double expected = 2 * (n + 1) * h - 4 * n;
            System.out.printf("%4d %12d %18.1f %22.1f%n", n, last, random, expected);
        }
    }
}`,
  stabilityDemo: `public class StabilityDemo {
    record Item(int key, String name) { }

    // Lomuto quicksort on items by key, always using the last item as the pivot.
    static void quicksort(Item[] a, int left, int right) {
        if (left >= right) {
            return;
        }
        int key = a[right].key();
        int next = left;
        for (int j = left; j < right; j++) {
            if (a[j].key() < key) {
                swap(a, next, j);
                next++;
            }
        }
        swap(a, next, right);
        quicksort(a, left, next - 1);
        quicksort(a, next + 1, right);
    }

    static void swap(Item[] a, int i, int j) {
        Item tmp = a[i];
        a[i] = a[j];
        a[j] = tmp;
    }

    public static void main(String[] args) {
        Item[] a = {new Item(5, "5"), new Item(1, "1"), new Item(2, "2"), new Item(1, "1*")};
        quicksort(a, 0, a.length - 1);
        StringBuilder sb = new StringBuilder();
        for (Item it : a) {
            sb.append(it.name()).append(' ');
        }
        System.out.println(sb.toString().trim());
    }
}`,
  lowerBound: `public class LowerBound {
    public static void main(String[] args) {
        System.out.println("  n   ceil(log2 n!)   n log2 n");
        for (int n : new int[] {3, 4, 10, 100, 1000}) {
            double log2Factorial = 0;
            for (int k = 2; k <= n; k++) {
                log2Factorial += Math.log(k) / Math.log(2);
            }
            System.out.printf("%4d %12d %12.0f%n", n, (long) Math.ceil(log2Factorial - 1e-9),
                    n * Math.log(n) / Math.log(2));
        }
    }
}`,
  quickSelect: `import java.util.Random;

public class QuickSelect {
    // Returns the k-th smallest value (k = 1 .. arr.length). Rearranges arr.
    static int select(int[] arr, int k, Random rng) {
        int left = 0, right = arr.length - 1;
        while (left < right) {
            int pivot = left + rng.nextInt(right - left + 1);
            int p = Partition.partition(arr, left, right, pivot);
            if (p == k - 1) {
                return arr[p];           // the pivot is exactly the k-th smallest
            } else if (k - 1 < p) {
                right = p - 1;           // answer is among the smaller values
            } else {
                left = p + 1;            // answer is among the larger values
            }
        }
        return arr[left];
    }

    public static void main(String[] args) {
        Random rng = new Random(5);
        for (int k : new int[] {1, 4, 10}) {
            int[] arr = {13, 81, 92, 43, 31, 65, 57, 26, 75, 0};
            System.out.println("k = " + k + ": " + select(arr, k, rng));
        }
    }
}`,
};

// Real outputs, pasted from the runs checked by tools/check.py.
const OUT = {
  flipCoinProg: `cost of ten runs: 2 2 2 8 2 2 2 4 6 2
average cost of 1000000 runs: 4.001`,
  partitionTrace: `pivotVal = 6, parked: [4, 2, 3, 7, 9, 5, 6]
j = 0: small, swap -> [4, 2, 3, 7, 9, 5, 6]  nextSmallPos = 1
j = 1: small, swap -> [4, 2, 3, 7, 9, 5, 6]  nextSmallPos = 2
j = 2: small, swap -> [4, 2, 3, 7, 9, 5, 6]  nextSmallPos = 3
j = 3: large, skip -> [4, 2, 3, 7, 9, 5, 6]  nextSmallPos = 3
j = 4: large, skip -> [4, 2, 3, 7, 9, 5, 6]  nextSmallPos = 3
j = 5: small, swap -> [4, 2, 3, 5, 9, 7, 6]  nextSmallPos = 4
pivot to 4:       [4, 2, 3, 5, 6, 7, 9]`,
  partitionDemo: `pivot index 3 -> returns 4: [4, 2, 3, 5, 6, 7, 9]
pivot index 4 -> returns 2: [10, 30, 40, 90, 80]`,
  quickSortTrace: `seed 19:
quicksort(0, 9): pivot 65 -> [13, 43, 31, 0, 57, 26, 65, 81, 75, 92]
  quicksort(0, 5): pivot 31 -> [13, 26, 0, 31, 57, 43]
    quicksort(0, 2): pivot 0 -> [0, 26, 13]
      quicksort(1, 2): pivot 13 -> [13, 26]
    quicksort(4, 5): pivot 43 -> [43, 57]
  quicksort(7, 9): pivot 92 -> [81, 75, 92]
    quicksort(7, 8): pivot 81 -> [75, 81]
[0, 13, 26, 31, 43, 57, 65, 75, 81, 92]
seed 2026:
quicksort(0, 9): pivot 0 -> [0, 81, 92, 43, 31, 65, 57, 26, 75, 13]
  quicksort(1, 9): pivot 65 -> [43, 31, 13, 57, 26, 65, 81, 75, 92]
    quicksort(1, 5): pivot 13 -> [13, 31, 26, 57, 43]
      quicksort(2, 5): pivot 31 -> [26, 31, 57, 43]
        quicksort(4, 5): pivot 43 -> [43, 57]
    quicksort(7, 9): pivot 75 -> [75, 92, 81]
      quicksort(8, 9): pivot 81 -> [81, 92]
[0, 13, 26, 31, 43, 57, 65, 75, 81, 92]`,
  median3Trace: `median3:   [0, 1, 4, 9, 7, 3, 5, 2, 6, 8]  pivot = 6
i stops at 3 (9), j stops at 7 (2)
swap:      [0, 1, 4, 2, 7, 3, 5, 9, 6, 8]
i stops at 4 (7), j stops at 6 (5)
swap:      [0, 1, 4, 2, 5, 3, 7, 9, 6, 8]
i stops at 6 (7), j stops at 5 (3)
restore:   [0, 1, 4, 2, 5, 3, 6, 9, 7, 8]  pivot at 6`,
  medianSortTrace: `quicksort(0, 6): median3 -> [1, 7, 4, 2, 0, 5, 9], pivot 5
  partitioned -> [1, 0, 4, 2, 5, 7, 9], pivot at 4
  quicksort(0, 3): median3 -> [0, 4, 1, 2, 5, 7, 9], pivot 1
    partitioned -> [0, 1, 4, 2, 5, 7, 9], pivot at 1
    insertionSort(0, 0) -> [0, 1, 4, 2, 5, 7, 9]
    insertionSort(2, 3) -> [0, 1, 2, 4, 5, 7, 9]
  insertionSort(5, 6) -> [0, 1, 2, 4, 5, 7, 9]
[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]`,
  slideLoopStuck: `after 1000000 rounds: i = 1, j = 2`,
  pairCompared: `e1, e2: compared in 1.000 of runs, 2/(j-i+1) = 1.000
e3, e6: compared in 0.499 of runs, 2/(j-i+1) = 0.500
e1, e10: compared in 0.201 of runs, 2/(j-i+1) = 0.200`,
  countComparisons: `   n   last pivot   random pivot (avg of 100)   2(n+1)H(n) - 4n
  10           45               24.4                   24.4
 100         4950              651.7                  647.9
1000       499500            10896.3                10985.9`,
  stabilityDemo: `1* 1 2 5`,
  lowerBound: `  n   ceil(log2 n!)   n log2 n
   3            3            5
   4            5            8
  10           22           33
 100          525          664
1000         8530         9966`,
  quickSelect: `k = 1: 0
k = 4: 31
k = 10: 92`,
};

// Code panels used by the steppers (PANEL): methods cut out of the programs above, same text.
function lineOf(code, s) {
  const k = code.split("\n").findIndex((l) => l.includes(s));
  if (k < 0) throw new Error("line not found: " + s);
  return k + 1;
}
// The method whose header contains `sig`, with the comment lines just above it, dedented.
function method(code, sig) {
  const lines = code.split("\n");
  let s = lines.findIndex((l) => l.includes(sig));
  const ind = lines[s].match(/^\s*/)[0];
  let e = s + 1;
  while (lines[e] !== ind + "}") e++;
  while (s > 0 && /^\s*(\/\/|\/\*\*|\*)/.test(lines[s - 1])) s--;
  return lines.slice(s, e + 1).map((l) => l.startsWith(ind) ? l.slice(ind.length) : l).join("\n");
}
const PANEL = {
  flipCoin: method(CODE.flipCoinProg, "static int flipCoin"),
  partitionMethod: method(CODE.partition, "public static int partition"),
  quicksortMethod: method(CODE.randomizedQuickSort, "static void quicksort"),
  mqQuicksort: method(CODE.medianQuickSort, "static void quicksort"),
  stabilityQs: method(CODE.stabilityDemo, "static void quicksort"),
};

// ---------- shared helpers ----------

// java.util.Random, ported: the same seed gives the same numbers as the Java programs.
// The 48-bit state is kept as two 24-bit halves so plain JS numbers stay exact.
class JavaRandom {
  constructor(seed) {
    const P = 16777216;
    const s = Math.trunc(seed);
    this.lo = (((s % P) + P) % P) ^ 0xECE66D;
    this.hi = (((Math.floor(s / P) % P) + P) % P) ^ 0x5DE;
  }
  next(bits) {
    const P = 16777216;
    const l = this.lo * 0xECE66D + 0xB;
    const h = (this.hi * 0xECE66D + this.lo * 0x5DE + Math.floor(l / P)) % P;
    this.lo = l % P;
    this.hi = h;
    return Math.floor((this.hi * P + this.lo) / 2 ** (48 - bits));
  }
  nextInt(bound) {
    if ((bound & -bound) === bound) return Math.floor((bound * this.next(31)) / 2 ** 31);
    for (;;) {
      const bits = this.next(31), val = bits % bound;
      if (bits - val + (bound - 1) < 2 ** 31) return val;
    }
  }
}

function swapA(a, i, j) { const t = a[i]; a[i] = a[j]; a[j] = t; }

// Partition.partition, exactly.
function lomuto(a, left, right, pivot) {
  const pivotVal = a[pivot];
  swapA(a, right, pivot);
  let next = left;
  for (let j = left; j < right; j++) if (a[j] < pivotVal) { swapA(a, next, j); next++; }
  swapA(a, next, right);
  return next;
}

if (typeof document !== "undefined" && !document.getElementById("l11-css")) {
  const st = document.createElement("style");
  st.id = "l11-css";
  st.textContent = `
.qs-cells{display:flex;gap:4px;justify-content:safe center;margin:8px 0;overflow-x:auto;padding:2px 2px 6px}
.qs-cells .cellcol{flex:none}
.qs-cells .cell{width:44px;height:40px;font-size:14px}
.qs-cells .cell.sm{background:var(--teal-soft);border-color:var(--teal)}
.qs-cells .cell.lg{background:color-mix(in srgb,var(--amber) 16%,var(--card));border-color:var(--amber)}
.qs-cells .cell.pv{background:var(--mark);border:2px solid var(--amber)}
.qs-cells .cell.fin{background:var(--green-soft);border-color:var(--green);color:var(--green)}
.qs-cells .cell.dim{opacity:.32}
.qs-cells .cell.hot{box-shadow:0 0 0 2px var(--teal)}
.qs-cells .cell.sw{box-shadow:0 0 0 2px var(--red)}
.qs-cells .ptr{min-width:44px;text-align:center;white-space:nowrap}
.qs-cells .ptr .p{color:var(--amber)}
.qs-legend{display:flex;flex-wrap:wrap;gap:6px 12px;justify-content:center;font-size:12px;color:var(--ink-2);margin:2px 0 6px}
.qs-legend i{display:inline-block;width:12px;height:12px;border-radius:3px;border:1px solid var(--line);vertical-align:-2px;margin-right:4px}
.qs-legend i.sm{background:var(--teal-soft);border-color:var(--teal)}
.qs-legend i.lg{background:color-mix(in srgb,var(--amber) 16%,var(--card));border-color:var(--amber)}
.qs-legend i.pv{background:var(--mark);border-color:var(--amber)}
.qs-legend i.fin{background:var(--green-soft);border-color:var(--green)}
.qs-coins{display:flex;flex-wrap:wrap;gap:4px;align-items:center;justify-content:center;min-height:36px;margin:6px 0}
.qs-coin{display:inline-grid;place-items:center;width:30px;height:30px;border-radius:50%;border:2px solid var(--stone);font:600 13px var(--mono);background:var(--card)}
.qs-coin.one{border-color:var(--green);background:var(--green-soft);color:var(--green)}
.qs-runs{font:13px var(--mono);color:var(--ink-2);text-align:center;margin:4px 0}
.qs-runs b{color:var(--ink)}
.qs-perms{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;margin:8px 0}
.qs-perms span{font:600 12px var(--mono);padding:4px 8px;border-radius:6px;border:1px solid var(--teal);background:var(--teal-soft)}
.qs-perms span.gone{opacity:.35;text-decoration:line-through;border-color:var(--line);background:var(--paper-2)}
.qs-sim{font:13px var(--mono);color:var(--ink-2);margin-top:8px}
@media (max-width:600px){
 .qs-cells{gap:2px}
 .qs-cells .cell{width:27px;height:32px;font-size:11px;border-radius:5px}
 .qs-cells .ptr{min-width:27px;font-size:9px}
 .qs-coin{width:24px;height:24px;font-size:11px}
}`;
  document.head.appendChild(st);
}

// Array cells. o.cls(k) -> class string, o.ptr(k) -> label above the cell.
function qsCells(arr, o = {}) {
  return `<div class="qs-cells">` + arr.map((v, k) =>
    `<div class="cellcol"><div class="ptr">${o.ptr ? o.ptr(k) || "" : ""}</div>` +
    `<div class="cell ${o.cls ? o.cls(k) || "" : ""}">${esc(v)}</div>` +
    `<div class="cellidx">${o.idx ? o.idx(k) : k}</div></div>`).join("") + `</div>`;
}

const legend = (items) => `<div class="qs-legend">${items.map(([c, t]) => `<span><i class="${c}"></i>${t}</span>`).join("")}</div>`;

// A stepper for demos without a code panel: build() -> steps, render(step, k, steps) -> html.
function makeSimpleStepper(el, opts) {
  el.innerHTML = `<div class="ss-view"></div>${opts.mini ? "" : `<div class="msg ss-msg"></div>
    <div class="controls">
      <button class="cbtn ss-reset">⟲ Reset</button>
      <button class="cbtn ss-back" title="Step back (←)">◀ Back</button>
      <button class="cbtn ss-step on" title="Step (→)">Step ▶</button>
      <button class="cbtn ss-play">Play</button>
      ${opts.endButton ? `<button class="cbtn ss-end">Skip to end</button>` : ""}
      ${opts.extraControls || ""}
      <span class="spacer"></span><span class="counter ss-count"></span>
    </div>${opts.below || ""}`}`;
  const $ = (s) => el.querySelector(s);
  let steps = [], i = 0, timer = null;
  function render() {
    const s = steps[i];
    $(".ss-view").innerHTML = opts.render(s, i, steps);
    if (opts.mini) return;
    $(".ss-msg").innerHTML = s.msg || "";
    $(".ss-msg").className = "msg ss-msg " + (s.cls || "");
    $(".ss-count").textContent = `step ${i + 1} / ${steps.length}`;
    $(".ss-back").disabled = $(".ss-reset").disabled = i === 0;
    $(".ss-step").disabled = i === steps.length - 1;
    if ($(".ss-end")) $(".ss-end").disabled = i === steps.length - 1;
  }
  function stop() { clearInterval(timer); timer = null; if (!opts.mini) $(".ss-play").textContent = "Play"; }
  function play() {
    if (timer) return stop();
    if (i === steps.length - 1) i = 0;
    if (!opts.mini) $(".ss-play").textContent = "Pause";
    timer = setInterval(() => {
      if (i < steps.length - 1) { i++; render(); }
      else if (opts.mini) { if (opts.onLoop) { steps = opts.build(); } i = 0; render(); }
      else stop();
    }, opts.speed || (opts.mini ? 700 : 600));
  }
  function rebuild() { stop(); steps = opts.build(); i = 0; render(); }
  if (!opts.mini) {
    $(".ss-reset").onclick = () => { stop(); i = 0; render(); };
    $(".ss-back").onclick = () => { stop(); if (i > 0) i--; render(); };
    $(".ss-step").onclick = () => { stop(); if (i < steps.length - 1) i++; render(); };
    if ($(".ss-end")) $(".ss-end").onclick = () => { stop(); i = steps.length - 1; render(); };
    $(".ss-play").onclick = play;
    el.tabIndex = 0;
    el.addEventListener("keydown", (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "SELECT") return;
      if (e.key === "ArrowRight") { e.preventDefault(); $(".ss-step").click(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); $(".ss-back").click(); }
    });
  }
  if (opts.onMount) opts.onMount(el, rebuild);
  rebuild();
  if (opts.mini) play();
  return { rebuild };
}

const numInput = (cls, value, width = 64) => `<input type="number" class="${cls}" value="${value}" style="width:${width}px">`;
const textInput = (cls, value, width = 170) => `<input type="text" class="${cls}" value="${value}" style="width:${width}px">`;

// ---------- 1. flipCoin ----------

function traceFlipCoin(seed, runs = 10) {
  const code = PANEL.flipCoin;
  const L = { cost: lineOf(code, "int cost = 0"), draw: lineOf(code, "rng.nextInt(2)"), add: lineOf(code, "cost += 2"),
    test: lineOf(code, "while (r != 1)"), ret: lineOf(code, "return cost") };
  const t = new Tracer();
  const rng = new JavaRandom(seed);
  const costs = [];
  for (let k = 0; k < runs; k++) {
    const flips = [];
    const f = t.push(`flipCoin(rng)  · run ${k + 1}`, { cost: 0 });
    const ex = () => ({ flips: flips.slice(), costs: costs.slice() });
    t.snap(L.cost, `Run ${k + 1} starts with <code>cost = 0</code>.`, "", ex());
    let r;
    do {
      r = rng.nextInt(2);
      flips.push(r);
      f.vars = { cost: f.vars.cost, r };
      t.snap(L.draw, `RANDOM(0, 1) gives <b>${r}</b>.`, "", ex());
      f.vars = { cost: f.vars.cost + 2, r };
      t.snap(L.add, `One draw and one test: <code>cost = ${f.vars.cost}</code>.`, "", ex());
      t.snap(L.test, r === 1 ? "<code>r == 1</code>: the loop ends." : "<code>r != 1</code>: flip again.", r === 1 ? "good" : "", ex());
    } while (r !== 1);
    costs.push(f.vars.cost);
    f.status = `returns ${f.vars.cost}`; f.cls = "ret";
    t.snap(L.ret, `This run cost <b>${f.vars.cost}</b> (${flips.length} round${flips.length > 1 ? "s" : ""}).`, "good", ex());
    t.pop();
  }
  const avg = costs.reduce((x, y) => x + y, 0) / costs.length;
  t.snap(0, `Ten runs: ${costs.join(" ")}. Their average is ${avg.toFixed(1)}; over many runs it settles at E[X] = 4.`, "good", { flips: [], costs });
  return t.snaps;
}

// FlipCoin.main: ten traced runs, then the average of 1,000,000 more runs on the same generator.
function flipCoinAverage(seed, trials = 1000000) {
  const rng = new JavaRandom(seed);
  const one = () => { let c = 0, r; do { r = rng.nextInt(2); c += 2; } while (r !== 1); return c; };
  for (let k = 0; k < 10; k++) one();
  let total = 0;
  for (let k = 0; k < trials; k++) total += one();
  return total / trials;
}

function demoFlipCoin(el, { mini = false } = {}) {
  let seed = 7;
  makeStepper(el, {
    mini,
    code: PANEL.flipCoin,
    build: () => traceFlipCoin(seed),
    stackLabel: "the current run",
    renderExtra: (s) => `<div class="qs-coins">${s.extra.flips.map((r) => `<span class="qs-coin ${r ? "one" : ""}">${r}</span>`).join("") || `<span class="counter">no flips yet</span>`}</div>` +
      `<div class="qs-runs">finished runs: <b>${s.extra.costs.join(" ") || "—"}</b></div>`,
    extraControls: `<label>seed ${numInput("fc-seed", seed, 80)}</label><button class="cbtn fc-sim">Average of 1,000,000 runs</button>`,
    onMount(root, rebuild) {
      if (mini) return;
      root.querySelector(".fc-seed").onchange = (e) => { seed = Math.trunc(+e.target.value || 0); e.target.value = seed; rebuild(); root.querySelector(".fc-out").textContent = ""; };
      root.querySelector(".fc-sim").onclick = () => {
        root.querySelector(".fc-out").textContent = `average cost of 1000000 runs: ${flipCoinAverage(seed).toFixed(3)}  (seed ${seed}, after the ten runs above)`;
      };
      root.insertAdjacentHTML("beforeend", `<div class="qs-sim fc-out"></div>`);
    },
  });
}

// ---------- 2. Lomuto partition ----------

function traceLomuto(data, left, right, pivot) {
  const code = PANEL.partitionMethod;
  const L = { pv: lineOf(code, "int pivotVal"), park: lineOf(code, "swap(arr, right, pivot)"), nsp: lineOf(code, "int nextSmallPos"),
    test: lineOf(code, "if (arr[j] < pivotVal)"), swap: lineOf(code, "swap(arr, nextSmallPos, j)"), inc: lineOf(code, "nextSmallPos++"),
    fin: lineOf(code, "swap(arr, nextSmallPos, right)"), ret: lineOf(code, "return nextSmallPos") };
  const t = new Tracer();
  const a = data.slice();
  const f = t.push(`partition(arr, ${left}, ${right}, ${pivot})`, {});
  const S = (line, msg, cls, o) => t.snap(line, msg, cls, { a: a.slice(), left, right, ...o });
  const pivotVal = a[pivot];
  f.vars = { pivotVal };
  S(L.pv, `Record the pivot value: <code>arr[${pivot}] = ${pivotVal}</code>.`, "", { piv: pivot });
  swapA(a, right, pivot);
  S(L.park, pivot === right ? `The pivot is already at the right end.` : `Swap <code>arr[${right}]</code> and <code>arr[${pivot}]</code>: the pivot is parked at the right end.`, "", { piv: right, sw: [right, pivot] });
  let nsp = left;
  f.vars = { pivotVal, nextSmallPos: nsp };
  S(L.nsp, `<code>nextSmallPos = ${left}</code>: no small values found yet.`, "", { piv: right, nsp, j: left });
  for (let j = left; j < right; j++) {
    f.vars = { pivotVal, nextSmallPos: nsp, j };
    const small = a[j] < pivotVal;
    S(L.test, `Is <code>arr[${j}] = ${a[j]}</code> &lt; ${pivotVal}? ${small ? "Yes: a small value." : "No: it joins the large block."}`, "", { piv: right, nsp, j, look: j });
    if (small) {
      swapA(a, nsp, j);
      S(L.swap, nsp === j ? `<code>nextSmallPos == j</code>, so this swaps <code>arr[${j}]</code> with itself.` : `Swap <code>arr[${nsp}]</code> and <code>arr[${j}]</code>: ${a[nsp]} jumps over the large block.`, "", { piv: right, nsp, j, done: true, sw: [nsp, j] });
      nsp++;
      f.vars = { pivotVal, nextSmallPos: nsp, j };
      S(L.inc, `<code>nextSmallPos = ${nsp}</code>.`, "", { piv: right, nsp, j, done: true });
    }
  }
  f.vars = { pivotVal, nextSmallPos: nsp };
  swapA(a, nsp, right);
  S(L.fin, `Swap the pivot into <code>arr[${nsp}]</code>: ${nsp - left} value${nsp - left === 1 ? " is" : "s are"} smaller than ${pivotVal}, so it belongs at index ${nsp}.`, "", { fin: nsp, sw: [nsp, right] });
  f.status = `returns ${nsp}`; f.cls = "ret";
  S(L.ret, `<code>return ${nsp}</code>. ${pivotVal} is in its final place: smaller values on its left, the others on its right.`, "good", { fin: nsp });
  return t.snaps;
}

function lomutoCells(e) {
  return qsCells(e.a, {
    cls: (k) => {
      if (k < e.left || k > e.right) return "dim";
      const c = [];
      if (e.fin !== undefined) c.push(k === e.fin ? "pv" : k < e.fin ? "sm" : "lg");
      else if (k === e.piv) c.push("pv");
      else if (e.nsp !== undefined && k < e.nsp) c.push("sm");
      else if (e.nsp !== undefined && k < e.j + (e.done ? 1 : 0)) c.push("lg");
      if (e.look === k) c.push("hot");
      if (e.sw && e.sw.includes(k) && e.sw[0] !== e.sw[1]) c.push("sw");
      return c.join(" ");
    },
    ptr: (k) => [
      e.fin === undefined && e.j === k && e.j < e.right ? "j" : "",
      e.fin === undefined && e.nsp === k ? "nsp" : "",
      k === (e.fin !== undefined ? e.fin : e.piv) ? `<span class="p">pivot</span>` : "",
    ].filter(Boolean).join(" "),
  }) + legend([["sm", "&lt; pivot"], ["lg", "≥ pivot"], ["pv", "pivot"]]);
}

const LOMUTO_PRESETS = [
  ["4, 2, 3, 6, 9, 5, 7", 3], ["10, 80, 30, 90, 40", 4], ["3, 8, 2, 5, 1, 4, 7, 6", 5], ["7, 7, 7, 7, 7", 2],
];

function demoLomuto(el) {
  let data = [4, 2, 3, 6, 9, 5, 7], pivot = 3;
  makeStepper(el, {
    code: PANEL.partitionMethod,
    build: () => traceLomuto(data, 0, data.length - 1, pivot),
    renderExtra: (s) => lomutoCells(s.extra),
    extraControls: `<label>arr ${textInput("lo-d", data.join(", "))}</label><label>pivot index ${numInput("lo-p", pivot, 56)}</label>
      <select class="lo-pre"><option value="">examples…</option>${LOMUTO_PRESETS.map(([d, p], k) => `<option value="${k}">[${d}], pivot ${p}</option>`).join("")}</select>`,
    onMount(root, rebuild) {
      const d = root.querySelector(".lo-d"), p = root.querySelector(".lo-p");
      const apply = () => {
        data = parseNums(d.value, [4, 2, 3, 6, 9, 5, 7]).slice(0, 12);
        pivot = Math.min(Math.max(0, Math.trunc(+p.value || 0)), data.length - 1);
        d.value = data.join(", "); p.value = pivot; rebuild();
      };
      d.onchange = apply; p.onchange = apply;
      root.querySelector(".lo-pre").onchange = (e) => {
        if (e.target.value === "") return;
        const [dv, pv] = LOMUTO_PRESETS[+e.target.value];
        d.value = dv; p.value = pv; e.target.value = ""; apply();
      };
    },
  });
}

// ---------- 3. randomized quicksort ----------

const QS_DATA = [13, 81, 92, 43, 31, 65, 57, 26, 75, 0];

function traceQuick(data, seed) {
  const code = PANEL.quicksortMethod;
  const L = { test: lineOf(code, "if (left >= right)"), ret: lineOf(code, "return;"), pivot: lineOf(code, "int pivot = left"),
    part: lineOf(code, "int p = Partition"), recL: lineOf(code, "quicksort(arr, left, p - 1"), recR: lineOf(code, "quicksort(arr, p + 1, right") };
  L.end = L.recR + 1;
  const t = new Tracer();
  const a = data.slice();
  const rng = new JavaRandom(seed);
  const fin = new Set();
  const ex = (o) => ({ a: a.slice(), fin: new Set(fin), ...o });
  function qs(l, r) {
    const f = t.push(`quicksort(arr, ${l}, ${r})`, {});
    const m = r - l + 1;
    t.snap(L.test, m <= 0 ? `An empty range (left > right).` : `Sort <code>arr[${l}..${r}]</code>: ${m} element${m > 1 ? "s" : ""}.`, "", ex({ l, r }));
    if (l >= r) {
      if (l === r) fin.add(l);
      f.status = m === 1 ? "returns: 1 element is sorted" : "returns: nothing to sort"; f.cls = "ret";
      t.snap(L.ret, m === 1 ? `One element is already sorted: ${a[l]} is in its final place.` : "Nothing to sort.", "good", ex({ l, r }));
      t.pop();
      return;
    }
    const pivot = l + rng.nextInt(r - l + 1);
    const v = a[pivot];
    f.vars = { pivot };
    t.snap(L.pivot, `RANDOM(${l}, ${r}) = ${pivot}: the pivot is <code>arr[${pivot}] = ${v}</code>.`, "", ex({ l, r, piv: pivot }));
    const p = lomuto(a, l, r, pivot);
    fin.add(p);
    f.vars = { pivot, p };
    t.snap(L.part, `partition: ${p - l} smaller, ${r - p} larger. ${v} moves to index ${p}, its final place.`, "", ex({ l, r, p }));
    f.status = `waiting for quicksort(${l}, ${p - 1})`;
    t.snap(L.recL, `First sort the left part, <code>arr[${l}..${p - 1}]</code>.`, "", ex({ l, r, p }));
    qs(l, p - 1);
    f.status = `waiting for quicksort(${p + 1}, ${r})`;
    t.snap(L.recR, `Then the right part, <code>arr[${p + 1}..${r}]</code>.`, "", ex({ l, r, p }));
    qs(p + 1, r);
    f.status = "done"; f.cls = "ret";
    t.snap(L.end, `<code>arr[${l}..${r}]</code> is sorted.`, "good", ex({ l, r }));
    t.pop();
  }
  qs(0, a.length - 1);
  t.snap(0, `Sorted: [${a.join(", ")}].`, "good", ex({}));
  return t.snaps;
}

function quickCells(e) {
  return qsCells(e.a, {
    cls: (k) => {
      const inR = e.l !== undefined && k >= e.l && k <= e.r;
      let c;
      if (k === e.piv || k === e.p) c = "pv";
      else if (inR && e.p !== undefined) c = k < e.p ? "sm" : "lg";
      else if (e.fin.has(k)) c = "fin";
      else c = e.l === undefined || inR ? "" : "dim";
      return c + (k === e.look ? " hot" : "");
    },
    ptr: (k) => [k === e.l ? "l" : "", k === e.r ? "r" : "", k === e.piv || k === e.p ? `<span class="p">pivot</span>` : ""].filter(Boolean).join(" "),
  });
}

function demoQuick(el, { mini = false } = {}) {
  let data = QS_DATA.slice(), seed = 19;
  makeStepper(el, {
    mini,
    code: PANEL.quicksortMethod,
    build: () => traceQuick(data, seed),
    renderExtra: (s) => quickCells(s.extra) + (mini ? "" : legend([["sm", "left part"], ["lg", "right part"], ["pv", "pivot"], ["fin", "in final place"]])),
    extraControls: `<label>arr ${textInput("qs-d", data.join(", "), 200)}</label><label>seed ${numInput("qs-s", seed, 80)}</label>`,
    onMount(root, rebuild) {
      if (mini) return;
      const d = root.querySelector(".qs-d"), s = root.querySelector(".qs-s");
      d.onchange = () => { data = parseNums(d.value, QS_DATA).slice(0, 12); d.value = data.join(", "); rebuild(); };
      s.onchange = () => { seed = Math.trunc(+s.value || 0); s.value = seed; rebuild(); };
    },
  });
}

// ---------- 4. median-of-three partition ----------

const CUTOFF = 3;

function median3Steps(a, left, right, S) {
  const c = Math.floor((left + right) / 2);
  const samp = [left, c, right];
  S(`median3: the samples are <code>a[${left}] = ${a[left]}</code>, <code>a[${c}] = ${a[c]}</code>, <code>a[${right}] = ${a[right]}</code>.`, { samp });
  if (a[c] < a[left]) { swapA(a, left, c); S(`a[center] &lt; a[left]: swap them.`, { samp, sw: [left, c] }); }
  if (a[right] < a[left]) { swapA(a, left, right); S(`a[right] &lt; a[left]: swap them.`, { samp, sw: [left, right] }); }
  if (a[right] < a[c]) { swapA(a, c, right); S(`a[right] &lt; a[center]: swap them.`, { samp, sw: [c, right] }); }
  S(`Now ${a[left]} ≤ ${a[c]} ≤ ${a[right]}: the median ${a[c]} is the pivot.`, { samp, med: c });
  swapA(a, c, right - 1);
  S(c === right - 1 ? `The pivot is already at right − 1 = ${right - 1}.` : `Hide the pivot at right − 1 = ${right - 1} (swap with <code>a[${c}]</code>).`, { piv: right - 1, sw: [c, right - 1] });
  return a[right - 1];
}

function traceMedianPartition(data, mode) {
  const slide = mode === "slide";
  const code = slide ? CODE.slideLoop : PANEL.mqQuicksort;
  const L = slide
    ? { cut: 0, m3: 0, ij: lineOf(code, "int i = left + 1"), iLoop: lineOf(code, "while (a[i] < pivot)"), jLoop: lineOf(code, "while (a[j] > pivot)"),
      test: lineOf(code, "if (i >= j)"), swap: lineOf(code, "swap(a, i, j)"), restore: lineOf(code, "swap(a, i, right - 1)") }
    : { cut: lineOf(code, "if (left + CUTOFF <= right)"), m3: lineOf(code, "int pivot = median3"), ij: lineOf(code, "int i = left, j = right - 1"),
      iLoop: lineOf(code, "a[++i] < pivot"), jLoop: lineOf(code, "a[--j] > pivot"), test: lineOf(code, "if (i >= j)"),
      swap: lineOf(code, "swap(a, i, j)"), restore: lineOf(code, "swap(a, i, right - 1)"), ins: lineOf(code, "insertionSort(a, left, right)") };
  const t = new Tracer();
  const a = data.slice();
  const left = 0, right = a.length - 1;
  const f = t.push(slide ? "the slides' partition loop" : `quicksort(a, ${left}, ${right})`, {});
  const S = (line, msg, cls, o) => t.snap(line, msg, cls || "", { a: a.slice(), left, right, ...o });
  if (left + CUTOFF > right) {
    S(L.cut, `Only ${a.length} element${a.length === 1 ? "" : "s"}, not more than CUTOFF = ${CUTOFF}: no partition.`, "", {});
    a.sort((x, y) => x - y);
    S(slide ? 0 : L.ins, `Insertion sort handles this small range: [${a.join(", ")}]. (Give at least 4 numbers to see a partition.)`, "good", {});
    return t.snaps;
  }
  if (!slide) S(L.cut, `${a.length} elements, more than CUTOFF = ${CUTOFF}: partition.`, "", {});
  const pivot = median3Steps(a, left, right, (msg, o) => S(L.m3, msg, "", o));
  f.vars = { pivot };
  let i = slide ? left + 1 : left, j = slide ? right - 2 : right - 1;
  const st = (o = {}) => ({ piv: right - 1, i, j, ...o });
  f.vars = { pivot, i, j };
  S(L.ij, slide ? `The slides start with <code>i = ${i}</code> and <code>j = ${j}</code>.` : `<code>i = ${i}</code>, <code>j = ${j}</code>. Each inner loop moves its pointer first, then tests.`, "", st());
  let last = null;
  for (let round = 0; round < 3 * a.length; round++) {
    // move i
    for (;;) {
      if (!slide) i++;
      f.vars = { pivot, i, j };
      const go = a[i] < pivot;
      S(L.iLoop, `<code>a[${i}] = ${a[i]}</code> ${go ? "&lt;" : "≥"} ${pivot}: ${go ? "small, keep going" : "<b>i stops</b>"}.`, "", st({ look: i }));
      if (!go) break;
      if (slide) i++;
    }
    for (;;) {
      if (!slide) j--;
      f.vars = { pivot, i, j };
      const go = a[j] > pivot;
      S(L.jLoop, `<code>a[${j}] = ${a[j]}</code> ${go ? "&gt;" : "≤"} ${pivot}: ${go ? "large, keep going" : "<b>j stops</b>"}.`, "", st({ look: j }));
      if (!go) break;
      if (slide) j--;
    }
    if (i >= j) {
      S(L.test, `<code>i = ${i} ≥ j = ${j}</code>: the pointers have crossed. Stop scanning.`, "", st());
      break;
    }
    S(L.test, `<code>i = ${i} &lt; j = ${j}</code>: ${a[i]} belongs on the right and ${a[j]} on the left.`, "", st());
    const key = `${i},${j},${a.join(",")}`;
    swapA(a, i, j);
    if (slide && key === last) {
      S(L.swap, `Same <code>i</code>, same <code>j</code>, same swap of two values equal to the pivot. Nothing changes, so this <b>repeats forever</b>.`, "bad", st({ sw: [i, j] }));
      return t.snaps;
    }
    last = key;
    S(L.swap, a[i] === a[j] ? `Swap <code>a[${i}]</code> and <code>a[${j}]</code>: both equal ${a[i]}, so the array does not change.` : `Swap: ${a[i]} goes left, ${a[j]} goes right.`, slide && a[i] === a[j] ? "bad" : "", st({ sw: [i, j] }));
  }
  swapA(a, i, right - 1);
  f.status = `pivot ${pivot} at ${i}`; f.cls = "ret";
  S(L.restore, `Restore the pivot: swap <code>a[${i}]</code> and <code>a[${right - 1}]</code>. ${pivot} is at index ${i}, its final place.`, "good", { fin: i });
  if (!slide) S(L.restore + 1, `Next the two sides are sorted: <code>quicksort(a, ${left}, ${i - 1})</code> and <code>quicksort(a, ${i + 1}, ${right})</code>.`, "good", { fin: i });
  return t.snaps;
}

function medianCells(e) {
  return qsCells(e.a, {
    cls: (k) => {
      const c = [];
      if (e.fin !== undefined) c.push(k === e.fin ? "pv" : k < e.fin ? "sm" : "lg");
      else if (k === e.piv || k === e.med) c.push("pv");
      else if (e.i !== undefined && ((k > e.left && k < e.i) || k === e.left)) c.push("sm");
      else if (e.j !== undefined && ((k > e.j && k < e.right - 1) || k === e.right)) c.push("lg");
      else if (e.samp && !e.samp.includes(k)) c.push("dim");
      if (e.look === k) c.push("hot");
      if (e.sw && e.sw.includes(k) && e.sw[0] !== e.sw[1]) c.push("sw");
      return c.join(" ");
    },
    ptr: (k) => {
      if (e.fin !== undefined) return k === e.fin ? `<span class="p">pivot</span>` : "";
      return [e.i === k ? "i" : "", e.j === k ? "j" : "", k === e.piv ? `<span class="p">pivot</span>` : "",
        e.samp && !e.piv && e.samp.includes(k) ? "•" : ""].filter(Boolean).join(" ");
    },
  });
}

const MEDIAN_PRESETS = ["8, 1, 4, 9, 6, 3, 5, 2, 7, 0", "5, 7, 4, 1, 0, 2, 9", "5, 5, 5, 5, 5", "1, 2, 3, 4, 5, 6, 7, 8"];

function demoMedianPartition(el, { mini = false } = {}) {
  let data = [8, 1, 4, 9, 6, 3, 5, 2, 7, 0], mode = "fixed";
  makeStepper(el, {
    mini,
    code: () => (mode === "slide" ? CODE.slideLoop : PANEL.mqQuicksort),
    build: () => traceMedianPartition(data, mode),
    renderExtra: (s) => medianCells(s.extra) + (mini ? "" : legend([["sm", "≤ pivot side"], ["lg", "≥ pivot side"], ["pv", "pivot"]])),
    extraControls: `<label>a ${textInput("md-d", data.join(", "), 190)}</label>
      <select class="md-pre"><option value="">examples…</option>${MEDIAN_PRESETS.map((d, k) => `<option value="${k}">${d}</option>`).join("")}</select>
      <select class="md-mode"><option value="fixed">fixed loop (a[++i], a[--j])</option><option value="slide">the slides' loop</option></select>`,
    onMount(root, rebuild) {
      if (mini) return;
      const d = root.querySelector(".md-d");
      const apply = () => { data = parseNums(d.value, [8, 1, 4, 9, 6, 3, 5, 2, 7, 0]).slice(0, 12); d.value = data.join(", "); rebuild(); };
      d.onchange = apply;
      root.querySelector(".md-pre").onchange = (e) => { if (e.target.value === "") return; d.value = MEDIAN_PRESETS[+e.target.value]; e.target.value = ""; apply(); };
      root.querySelector(".md-mode").onchange = (e) => { mode = e.target.value; rebuild(); };
    },
  });
}

// ---------- 5. the whole median-of-three sort ----------

function insertionSortRange(a, left, right) {
  for (let p = left + 1; p <= right; p++) {
    const tmp = a[p];
    let j = p;
    while (j > left && a[j - 1] > tmp) { a[j] = a[j - 1]; j--; }
    a[j] = tmp;
  }
}

function median3(a, left, right) {
  const c = Math.floor((left + right) / 2);
  if (a[c] < a[left]) swapA(a, left, c);
  if (a[right] < a[left]) swapA(a, left, right);
  if (a[right] < a[c]) swapA(a, c, right);
  swapA(a, c, right - 1);
  return a[right - 1];
}

// The partition loop of MedianQuickSort; returns the pivot's final index.
function medianPartition(a, left, right) {
  const pivot = median3(a, left, right);
  let i = left, j = right - 1;
  for (;;) {
    while (a[++i] < pivot) { /* skip small */ }
    while (a[--j] > pivot) { /* skip large */ }
    if (i >= j) break;
    swapA(a, i, j);
  }
  swapA(a, i, right - 1);
  return i;
}

function traceMedianSort(data) {
  const code = PANEL.mqQuicksort;
  const L = { cut: lineOf(code, "if (left + CUTOFF <= right)"), m3: lineOf(code, "int pivot = median3"), restore: lineOf(code, "swap(a, i, right - 1)"),
    recL: lineOf(code, "quicksort(a, left, i - 1)"), recR: lineOf(code, "quicksort(a, i + 1, right)"), ins: lineOf(code, "insertionSort(a, left, right)"),
    end: code.split("\n").length };
  const t = new Tracer();
  const a = data.slice();
  const fin = new Set();
  const ex = (o) => ({ a: a.slice(), fin: new Set(fin), ...o });
  function qs(l, r) {
    const f = t.push(`quicksort(a, ${l}, ${r})`, {});
    const m = Math.max(0, r - l + 1);
    const big = l + CUTOFF <= r;
    t.snap(L.cut, `<code>a[${l}..${r}]</code> has ${m} element${m === 1 ? "" : "s"}: ${big ? `more than CUTOFF = ${CUTOFF}, so partition` : "small, so insertion sort"}.`, "", ex({ l, r }));
    if (big) {
      const b = a.slice(l, r + 1);
      const pivot = median3(a, l, r);
      f.vars = { pivot };
      t.snap(L.m3, `median3 of ${b[0]}, ${b[Math.floor((r - l) / 2)]}, ${b[r - l]} is <b>${pivot}</b>; it is hidden at index ${r - 1}.`, "", ex({ l, r, piv: r - 1 }));
      // finish the partition (median3 already done)
      let i = l, j = r - 1;
      for (;;) {
        while (a[++i] < pivot) { /* skip */ }
        while (a[--j] > pivot) { /* skip */ }
        if (i >= j) break;
        swapA(a, i, j);
      }
      swapA(a, i, r - 1);
      fin.add(i);
      f.vars = { pivot, i };
      t.snap(L.restore, `After the i/j scan and the restore, ${pivot} is at index ${i}: [${a.slice(l, r + 1).join(", ")}].`, "", ex({ l, r, p: i }));
      f.status = `waiting for quicksort(${l}, ${i - 1})`;
      t.snap(L.recL, `Sort the small side, <code>a[${l}..${i - 1}]</code>.`, "", ex({ l, r, p: i }));
      qs(l, i - 1);
      f.status = `waiting for quicksort(${i + 1}, ${r})`;
      t.snap(L.recR, `Sort the large side, <code>a[${i + 1}..${r}]</code>.`, "", ex({ l, r, p: i }));
      qs(i + 1, r);
    } else {
      insertionSortRange(a, l, r);
      for (let k = l; k <= r; k++) fin.add(k);
      f.vars = {};
      t.snap(L.ins, m ? `insertionSort(a, ${l}, ${r}) → [${a.slice(l, r + 1).join(", ")}].` : `insertionSort on an empty range does nothing.`, "", ex({ l, r }));
    }
    f.status = "done"; f.cls = "ret";
    t.snap(L.end, `<code>a[${l}..${r}]</code> is sorted.`, "good", ex({ l, r }));
    t.pop();
  }
  qs(0, a.length - 1);
  t.snap(0, `Sorted: [${a.join(", ")}].`, "good", ex({}));
  return t.snaps;
}

function demoMedianSort(el) {
  let data = [5, 7, 4, 1, 0, 2, 9];
  makeStepper(el, {
    code: PANEL.mqQuicksort,
    build: () => traceMedianSort(data),
    renderExtra: (s) => quickCells(s.extra) + legend([["sm", "small side"], ["lg", "large side"], ["pv", "pivot"], ["fin", "in final place"]]),
    extraControls: `<label>a ${textInput("ms-d", data.join(", "), 200)}</label>`,
    onMount(root, rebuild) {
      const d = root.querySelector(".ms-d");
      d.onchange = () => { data = parseNums(d.value, [5, 7, 4, 1, 0, 2, 9]).slice(0, 12); d.value = data.join(", "); rebuild(); };
    },
  });
}

// ---------- 6. recursion trees for different splits ----------

const SPLITS = { half: ["balanced (1 : 1)", 0.5], nine: ["9-to-1", 0.1], worst: ["worst (0 : n − 1)", 0] };

function buildSplitLevels(n, kind) {
  const ratio = SPLITS[kind][1];
  const levels = [];
  let cur = [{ start: 0, size: n }];
  while (cur.length) {
    levels.push(cur);
    const nxt = [];
    for (const nd of cur) {
      if (nd.size < 2) continue;
      const m = nd.size - 1;
      const left = Math.floor(m * ratio);
      if (left > 0) nxt.push({ start: nd.start, size: left });
      if (m - left > 0) nxt.push({ start: nd.start + left + 1, size: m - left });
    }
    cur = nxt;
  }
  return levels;
}

function splitSVG(levels, n, upto, mini) {
  const W = 720, H = mini ? 200 : 300;
  const rowH = Math.min(26, H / levels.length);
  let svg = `<svg viewBox="0 0 ${W} ${Math.max(rowH * levels.length, 40) + 4}" role="img" aria-label="recursion tree as rows of subproblems">`;
  levels.forEach((lv, d) => {
    if (d > upto) return;
    lv.forEach((nd) => {
      const x = (nd.start / n) * W, w = Math.max(0.6, (nd.size / n) * W - (rowH > 6 ? 1.5 : 0.3));
      const active = nd.size >= 2;
      svg += `<rect x="${x.toFixed(2)}" y="${(d * rowH + 2).toFixed(2)}" width="${w.toFixed(2)}" height="${Math.max(0.6, rowH - (rowH > 6 ? 3 : 0.4)).toFixed(2)}" rx="${rowH > 10 ? 3 : 0}" fill="var(--${d === upto ? "amber" : active ? "teal" : "stone"})" opacity="${active ? 0.85 : 0.4}"/>`;
      if (rowH >= 18 && w > 26) svg += `<text x="${(x + w / 2).toFixed(2)}" y="${(d * rowH + rowH / 2 + 5).toFixed(2)}" text-anchor="middle" font-size="11" fill="var(--paper)">${nd.size}</text>`;
    });
  });
  return svg + "</svg>";
}

function demoSplit(el, { mini = false } = {}) {
  let n = mini ? 200 : 100, kind = "nine";
  let levels = [];
  const cost = (lv) => lv.reduce((s, nd) => s + Math.max(0, nd.size - 1), 0);
  makeSimpleStepper(el, {
    mini,
    endButton: true,
    speed: mini ? 450 : 500,
    build() {
      levels = buildSplitLevels(n, kind);
      let total = 0;
      return levels.map((lv, d) => {
        total += cost(lv);
        const last = d === levels.length - 1;
        return { d, c: cost(lv), total, cls: last ? "good" : "",
          msg: last ? `Done after ${levels.length} levels: <b>${total.toLocaleString("en")}</b> comparisons in total (n log₂ n ≈ ${Math.round(n * Math.log2(n)).toLocaleString("en")}, n(n−1)/2 = ${(n * (n - 1) / 2).toLocaleString("en")}).`
            : `Level ${d}: ${lv.length} subproblem${lv.length > 1 ? "s" : ""}, partition cost ${cost(lv).toLocaleString("en")} comparisons (at most n − 1 = ${n - 1}).` };
      });
    },
    render: (s) => `<div class="svgbox">${splitSVG(levels, n, s.d, mini)}</div>` + (mini ? "" :
      `<div class="stats"><div class="stat"><small>depth so far</small><b>${s.d + 1}</b></div><div class="stat"><small>this level</small><b>${s.c.toLocaleString("en")}</b></div><div class="stat"><small>total so far</small><b>${s.total.toLocaleString("en")}</b></div><div class="stat"><small>log₂ n</small><b>${Math.log2(n).toFixed(1)}</b></div></div>`),
    extraControls: `<select class="sp-k">${Object.entries(SPLITS).map(([k, [t]]) => `<option value="${k}" ${k === kind ? "selected" : ""}>${t}</option>`).join("")}</select>
      <label>n = <b class="sp-v mono">${n}</b> <input type="range" class="sp-n" min="3" max="10" step="0.05" value="${Math.log2(n)}"></label>`,
    onMount(root, rebuild) {
      if (mini) return;
      root.querySelector(".sp-k").onchange = (e) => { kind = e.target.value; rebuild(); };
      root.querySelector(".sp-n").oninput = (e) => { n = Math.round(2 ** +e.target.value); root.querySelector(".sp-v").textContent = n; rebuild(); };
    },
  });
}

// ---------- 7. when are e_i and e_j compared? ----------

// Randomized quicksort seen on the ranks 1..n: every range is an interval of ranks, and the
// pivot's rank is uniform in it (the same as a uniform pivot index).
function buildPairRun(n, ei, ej, rng) {
  const steps = [{ intervals: [[1, n]], pivots: [], cur: null, p: null, verdict: null,
    msg: `All ${n} elements start in one range. Watch e${ei} and e${ej}.` }];
  const todo = [[1, n]];
  const pivots = [];
  let verdict = null;
  while (todo.length) {
    const [lo, hi] = todo.pop();
    if (hi - lo + 1 < 2) { if (hi === lo) pivots.push(lo); continue; }
    const p = lo + rng.nextInt(hi - lo + 1);
    pivots.push(p);
    let msg = `Range e${lo}..e${hi}: pivot e${p}, compared with the other ${hi - lo} element${hi - lo > 1 ? "s" : ""}.`;
    let cls = "";
    if (!verdict && lo <= ei && ej <= hi) {
      if (p === ei || p === ej) { verdict = "compared"; cls = "good"; msg += ` e${p} is the first pivot from e${ei}..e${ej}: <b>e${ei} and e${ej} are compared</b>.`; }
      else if (p > ei && p < ej) { verdict = "separated"; cls = "bad"; msg += ` e${p} lies between them: e${ei} goes left, e${ej} goes right, so they are <b>never compared</b>.`; }
      else msg += ` e${ei} and e${ej} stay together.`;
    }
    if (p + 1 <= hi) todo.push([p + 1, hi]);
    if (lo <= p - 1) todo.push([lo, p - 1]);
    steps.push({ cur: [lo, hi], p, pivots: pivots.slice(), verdict, msg, cls });
  }
  steps.push({ cur: null, p: null, pivots: pivots.slice(), verdict, cls: verdict === "compared" ? "good" : "bad",
    msg: `Finished. In this run e${ei} and e${ej} were ${verdict === "compared" ? "compared once" : "never compared"}. Probability: 2/(j − i + 1) = 2/${ej - ei + 1} = ${(2 / (ej - ei + 1)).toFixed(3)}.` });
  return steps;
}

function pairCompared(n, ei, ej, rng) {
  let lo = 1, hi = n;
  for (;;) {
    const p = lo + rng.nextInt(hi - lo + 1);
    if (p === ei || p === ej) return true;
    if (p > ei && p < ej) return false;
    if (p < ei) lo = p + 1; else hi = p - 1;
  }
}

function demoPairs(el) {
  const n = 10;
  let ei = 3, ej = 6, seed = 11;
  const sel = (cls, v) => `<select class="${cls}">${Array.from({ length: n }, (_, k) => `<option ${k + 1 === v ? "selected" : ""}>${k + 1}</option>`).join("")}</select>`;
  makeSimpleStepper(el, {
    build: () => buildPairRun(n, ei, ej, new JavaRandom(seed)),
    render: (s) => qsCells(Array.from({ length: n }, (_, k) => `e${k + 1}`), {
      idx: (k) => k + 1,
      cls: (k) => {
        const r = k + 1;
        const c = [];
        if (r === s.p) c.push("pv");
        else if (s.pivots.includes(r)) c.push("fin");
        else if (s.cur && (r < s.cur[0] || r > s.cur[1])) c.push("dim");
        if (r === ei || r === ej) c.push("hot");
        return c.join(" ");
      },
      ptr: (k) => (k + 1 === ei ? "eᵢ" : k + 1 === ej ? "eⱼ" : ""),
    }) + legend([["pv", "pivot now"], ["fin", "earlier pivot"]]),
    extraControls: `<label>i ${sel("pr-i", ei)}</label><label>j ${sel("pr-j", ej)}</label><label>seed ${numInput("pr-s", seed, 72)}</label>`,
    below: `<div class="controls"><button class="cbtn pr-sim">Run 100,000 times</button><span class="qs-sim pr-out" style="margin:0"></span></div>`,
    onMount(root, rebuild) {
      const fix = () => {
        let a = +root.querySelector(".pr-i").value, b = +root.querySelector(".pr-j").value;
        if (a === b) b = a < n ? a + 1 : a - 1;
        ei = Math.min(a, b); ej = Math.max(a, b);
        root.querySelector(".pr-i").value = ei; root.querySelector(".pr-j").value = ej;
        root.querySelector(".pr-out").textContent = "";
        rebuild();
      };
      root.querySelector(".pr-i").onchange = fix;
      root.querySelector(".pr-j").onchange = fix;
      root.querySelector(".pr-s").onchange = (e) => { seed = Math.trunc(+e.target.value || 0); e.target.value = seed; rebuild(); };
      root.querySelector(".pr-sim").onclick = () => {
        const rng = new JavaRandom(seed + 1);
        let hits = 0;
        const runs = 100000;
        for (let k = 0; k < runs; k++) if (pairCompared(n, ei, ej, rng)) hits++;
        root.querySelector(".pr-out").textContent = `e${ei}, e${ej}: compared in ${(hits / runs).toFixed(3)} of runs; 2/(j-i+1) = ${(2 / (ej - ei + 1)).toFixed(3)}`;
      };
    },
  });
}

// ---------- 8. counting comparisons ----------

function countLomuto(a, rng) {
  let c = 0;
  const stack = [[0, a.length - 1]];
  while (stack.length) {
    const [l, r] = stack.pop();
    if (l >= r) continue;
    const pivot = rng ? l + rng.nextInt(r - l + 1) : r;
    c += r - l;
    const p = lomuto(a, l, r, pivot);
    stack.push([p + 1, r], [l, p - 1]);
  }
  return c;
}

// Key comparisons made by MedianQuickSort (median3, the i/j scans, insertion sort).
function countMedian(a) {
  let c = 0;
  const stack = [[0, a.length - 1]];
  while (stack.length) {
    const [left, right] = stack.pop();
    if (left + CUTOFF <= right) {
      const ctr = Math.floor((left + right) / 2);
      c += 3;
      if (a[ctr] < a[left]) swapA(a, left, ctr);
      if (a[right] < a[left]) swapA(a, left, right);
      if (a[right] < a[ctr]) swapA(a, ctr, right);
      swapA(a, ctr, right - 1);
      const pivot = a[right - 1];
      let i = left, j = right - 1;
      for (;;) {
        while ((c++, a[++i] < pivot)) { /* skip */ }
        while ((c++, a[--j] > pivot)) { /* skip */ }
        if (i >= j) break;
        swapA(a, i, j);
      }
      swapA(a, i, right - 1);
      stack.push([i + 1, right], [left, i - 1]);
    } else {
      for (let p = left + 1; p <= right; p++) {
        const tmp = a[p];
        let j = p;
        while (j > left && (c++, a[j - 1] > tmp)) { a[j] = a[j - 1]; j--; }
        a[j] = tmp;
      }
    }
  }
  return c;
}

function makeInput(n, kind, rng) {
  const a = Array.from({ length: n }, (_, k) => k + 1);
  if (kind === "reversed") a.reverse();
  if (kind === "random") for (let k = n - 1; k > 0; k--) swapA(a, k, rng.nextInt(k + 1));
  if (kind === "equal") a.fill(7);
  return a;
}

function demoRace(el) {
  el.innerHTML = `<div class="controls" style="margin-top:0">
      <label>input <select class="rc-k"><option value="sorted">sorted</option><option value="reversed">reversed</option><option value="random">shuffled</option><option value="equal">all equal</option></select></label>
      <label>n = <b class="rc-v mono"></b></label><input type="range" class="rc-n" min="1" max="3.3" step="0.01" value="3">
    </div><div class="bars rc-bars"></div><p class="hint rc-hint"></p>`;
  const $ = (q) => el.querySelector(q);
  function render() {
    const n = Math.round(10 ** +$(".rc-n").value);
    const kind = $(".rc-k").value;
    $(".rc-v").textContent = n.toLocaleString("en");
    const rng = new JavaRandom(3100);
    const input = makeInput(n, kind, new JavaRandom(42));
    const last = countLomuto(input.slice(), null);
    const runs = kind === "equal" ? 3 : 100;   // all-equal input is quadratic: keep the slider responsive
    let rand = 0;
    for (let t = 0; t < runs; t++) rand += countLomuto(input.slice(), rng);
    rand /= runs;
    const med = countMedian(input.slice());
    let h = 0;
    for (let k = 1; k <= n; k++) h += 1 / k;
    const formula = 2 * (n + 1) * h - 4 * n;
    const rows = [["last element", last, "red"], [`random (avg of ${runs})`, rand, ""], ["median-of-three", med, "amber"], ["2(n+1)Hₙ − 4n", formula, ""]];
    const max = Math.max(...rows.map((r) => r[1]));
    $(".rc-bars").innerHTML = rows.map(([k, v, c]) => `<div class="bar"><span>${k}</span><div class="track"><div class="fill ${c}" style="width:${Math.max(0.4, (100 * v) / max)}%"></div></div><span class="v">${Number.isInteger(v) ? v.toLocaleString("en") : v.toFixed(1)}</span></div>`).join("");
    $(".rc-hint").innerHTML = kind === "equal"
      ? `All keys equal: the Lomuto partition finds no value <em>smaller</em> than the pivot, so every split is 0 / n − 1, even with random pivots (n(n−1)/2 = ${(n * (n - 1) / 2).toLocaleString("en")}). Median-of-three stops on equal keys and splits evenly.`
      : `Key comparisons to sort ${n.toLocaleString("en")} ${kind} numbers. n(n−1)/2 = ${(n * (n - 1) / 2).toLocaleString("en")}; n log₂ n ≈ ${Math.round(n * Math.log2(n)).toLocaleString("en")}.`;
  }
  $(".rc-n").oninput = render;
  $(".rc-k").onchange = render;
  render();
}

// ---------- 9. stability ----------

function parseItems(text) {
  const items = String(text).split(/[\s,]+/).filter(Boolean).map((tok) => ({ key: parseInt(tok, 10), name: tok })).filter((x) => Number.isFinite(x.key));
  return items.length ? items.slice(0, 10) : [{ key: 5, name: "5" }, { key: 1, name: "1" }, { key: 2, name: "2" }, { key: 1, name: "1*" }];
}

function traceStability(items) {
  const code = PANEL.stabilityQs;
  const L = { test: lineOf(code, "if (left >= right)"), key: lineOf(code, "int key = a[right]"), cmp: lineOf(code, "if (a[j].key() < key)"),
    swap: lineOf(code, "swap(a, next, j)"), fin: lineOf(code, "swap(a, next, right)"), recL: lineOf(code, "quicksort(a, left, next - 1)"),
    recR: lineOf(code, "quicksort(a, next + 1, right)") };
  const t = new Tracer();
  const a = items.slice();
  const fin = new Set();
  const ex = (o) => ({ a: a.map((x) => x.name), fin: new Set(fin), ...o });
  function qs(l, r) {
    t.push(`quicksort(a, ${l}, ${r})`, {});
    t.snap(L.test, l >= r ? `Range ${l}..${r}: at most one item, nothing to do.` : `Sort items ${l}..${r}.`, "", ex({ l, r }));
    if (l >= r) { if (l === r) fin.add(l); t.pop(); return; }
    const key = a[r].key;
    t.snap(L.key, `The pivot is the last item, <b>${esc(a[r].name)}</b> (key ${key}).`, "", ex({ l, r, piv: r }));
    let next = l;
    for (let j = l; j < r; j++) {
      const small = a[j].key < key;
      t.snap(L.cmp, `Key of ${esc(a[j].name)} ${small ? "&lt;" : "≥"} ${key}.`, "", ex({ l, r, piv: r, look: j }));
      if (small) {
        const x = a[next], y = a[j];
        swapA(a, next, j);
        t.snap(L.swap, next === j ? `Swap ${esc(y.name)} with itself.` : `Swap ${esc(x.name)} and ${esc(y.name)}.`, "", ex({ l, r, piv: r }));
        next++;
      }
    }
    const pv = a[r];
    swapA(a, next, r);
    fin.add(next);
    t.snap(L.fin, `The pivot ${esc(pv.name)} jumps to index ${next}` + (a.some((x, k) => k !== next && k >= l && k <= r && x.key === pv.key) ? ` — over an item with the same key.` : "."), "", ex({ l, r, p: next }));
    t.snap(L.recL, `Sort the left part.`, "", ex({ l, r, p: next }));
    qs(l, next - 1);
    t.snap(L.recR, `Sort the right part.`, "", ex({ l, r, p: next }));
    qs(next + 1, r);
    t.pop();
  }
  qs(0, a.length - 1);
  // Stable iff items with equal keys keep their input order.
  const order = new Map(items.map((x, k) => [x, k]));
  const broken = a.find((x, k) => a.slice(k + 1).some((y) => y.key === x.key && order.get(y) < order.get(x)));
  const twin = broken && a.find((y) => y.key === broken.key && order.get(y) < order.get(broken));
  t.snap(0, `Result: ${a.map((x) => esc(x.name)).join(" ")}. ` + (broken ? `<b>Not stable</b>: ${esc(broken.name)} now comes before ${esc(twin.name)}, the reverse of the input order.` : `Equal keys kept their input order this time — but that is luck, not a guarantee.`), broken ? "bad" : "good", ex({}));
  return t.snaps;
}

function demoStability(el) {
  let text = "5, 1, 2, 1*";
  makeStepper(el, {
    code: PANEL.stabilityQs,
    build: () => traceStability(parseItems(text)),
    renderExtra: (s) => quickCells(s.extra),
    extraControls: `<label>items ${textInput("st-d", text, 190)}</label>`,
    onMount(root, rebuild) {
      const d = root.querySelector(".st-d");
      d.onchange = () => { text = parseItems(d.value).map((x) => x.name).join(", "); d.value = text; rebuild(); };
    },
  });
}

// ---------- 10. the decision tree for three keys ----------

const DT_NODES = {
  r: { q: ["a", "b"], x: 360, y: 26, yes: "l", no: "R" },
  l: { q: ["b", "c"], x: 180, y: 96, yes: "abc", no: "l2" },
  R: { q: ["a", "c"], x: 540, y: 96, yes: "bac", no: "R2" },
  l2: { q: ["a", "c"], x: 270, y: 166, yes: "acb", no: "cab" },
  R2: { q: ["b", "c"], x: 630, y: 166, yes: "bca", no: "cba" },
  abc: { x: 90, y: 166 }, bac: { x: 450, y: 166 },
  acb: { x: 210, y: 236 }, cab: { x: 330, y: 236 }, bca: { x: 570, y: 236 }, cba: { x: 690, y: 236 },
};
const DT_PERMS = ["abc", "acb", "bac", "bca", "cab", "cba"];
const DT_INPUTS = [[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]];

function buildDecision(vals) {
  const v = { a: vals[0], b: vals[1], c: vals[2] };
  const steps = [];
  let id = "r";
  const path = ["r"];
  let alive = DT_PERMS.slice();
  steps.push({ id, path: path.slice(), alive: alive.slice(), msg: `Input a = ${v.a}, b = ${v.b}, c = ${v.c}. All 6 orders are still possible.` });
  while (DT_NODES[id].q) {
    const [x, y] = DT_NODES[id].q;
    const yes = v[x] < v[y];
    alive = alive.filter((p) => (p.indexOf(x) < p.indexOf(y)) === yes);
    id = yes ? DT_NODES[id].yes : DT_NODES[id].no;
    path.push(id);
    steps.push({ id, path: path.slice(), alive: alive.slice(), msg: `${x} &lt; ${y}? ${v[x]} &lt; ${v[y]} is <b>${yes ? "yes" : "no"}</b>. ${alive.length} order${alive.length > 1 ? "s" : ""} left.` });
  }
  const last = steps[steps.length - 1];
  last.msg += ` Sorted order: <b>${id.split("").join(" ≤ ")}</b>, after ${path.length - 1} comparisons.`;
  last.cls = "good";
  return steps;
}

function decisionSVG(s) {
  let svg = `<svg viewBox="0 0 760 262" role="img" aria-label="decision tree for sorting three keys">`;
  Object.entries(DT_NODES).forEach(([id, nd]) => {
    if (!nd.q) return;
    [["yes", nd.yes], ["no", nd.no]].forEach(([lab, k]) => {
      const c = DT_NODES[k];
      const on = s.path.includes(id) && s.path.includes(k);
      svg += `<line x1="${nd.x}" y1="${nd.y + 14}" x2="${c.x}" y2="${c.y - 14}" stroke="var(--${on ? "amber" : "line"})" stroke-width="${on ? 2.4 : 1.4}"/>`;
      svg += `<text x="${(nd.x + c.x) / 2 + (lab === "yes" ? -14 : 14)}" y="${(nd.y + c.y) / 2 + 2}" text-anchor="middle" font-size="10" fill="var(--stone)">${lab}</text>`;
    });
  });
  Object.entries(DT_NODES).forEach(([id, nd]) => {
    const cur = s.id === id, seen = s.path.includes(id);
    const leaf = !nd.q;
    const w = leaf ? 64 : 76;
    svg += `<rect x="${nd.x - w / 2}" y="${nd.y - 14}" width="${w}" height="28" rx="${leaf ? 14 : 6}" fill="var(--${cur ? "mark" : seen ? "teal-soft" : leaf ? "paper" : "card"})" stroke="var(--${cur ? "amber" : seen ? "teal" : "line"})" stroke-width="${cur ? 2 : 1.2}"/>`;
    svg += `<text x="${nd.x}" y="${nd.y + 4}" text-anchor="middle" font-size="12" fill="var(--ink)">${leaf ? id.split("").join(" ") : `${nd.q[0]} &lt; ${nd.q[1]} ?`}</text>`;
  });
  return svg + "</svg>";
}

function demoDecision(el, { mini = false } = {}) {
  let k = 4;
  let miniK = 0;
  makeSimpleStepper(el, {
    mini,
    speed: 900,
    onLoop: true,
    build: () => buildDecision(DT_INPUTS[mini ? (miniK = (miniK + 1) % 6) : k]),
    render: (s) => `<div class="svgbox">${decisionSVG(s)}</div>` + (mini ? "" : `<div class="qs-perms">${DT_PERMS.map((p) => `<span class="${s.alive.includes(p) ? "" : "gone"}">${p.split("").join("&lt;")}</span>`).join("")}</div>`),
    extraControls: `<label>input <select class="dt-in">${DT_INPUTS.map((v, j) => `<option value="${j}" ${j === k ? "selected" : ""}>a=${v[0]}, b=${v[1]}, c=${v[2]}</option>`).join("")}</select></label>`,
    onMount(root, rebuild) {
      if (mini) return;
      root.querySelector(".dt-in").onchange = (e) => { k = +e.target.value; rebuild(); };
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

// Demo registry: each data-demo attribute in chapters.js names one of these.
const DEMOS = {
  flipCoin: (el) => demoFlipCoin(el),
  flipMini: (el) => demoFlipCoin(el, { mini: true }),
  lomuto: (el) => demoLomuto(el),
  quick: (el) => demoQuick(el),
  quickMini: (el) => demoQuick(el, { mini: true }),
  medianPartition: (el) => demoMedianPartition(el),
  medianMini: (el) => demoMedianPartition(el, { mini: true }),
  medianSort: (el) => demoMedianSort(el),
  split: (el) => demoSplit(el),
  splitMini: (el) => demoSplit(el, { mini: true }),
  pairs: (el) => demoPairs(el),
  race: (el) => demoRace(el),
  stability: (el) => demoStability(el),
  decision: (el) => demoDecision(el),
  decisionMini: (el) => demoDecision(el, { mini: true }),
  quiz: (el) => demoQuiz(el, QUIZ),
};
