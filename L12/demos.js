// Interactive demos for Lecture 12. CODE and OUT are copied from notes/L12-more-sorting.md
// (checked by tools/check.py); the JS twins below replay the Java step by step.

const CODE = {
  ShellSort: `public class ShellSort {
    /** ShellSort with Shell's increments n/2, n/4, ..., 1. */
    public static void shellSort(int[] a) {
        int j;
        for (int gap = a.length / 2; gap > 0; gap /= 2) {
            // insertion sort on the elements that are gap apart
            for (int i = gap; i < a.length; i++) {
                int tmp = a[i];
                for (j = i; j >= gap && tmp < a[j - gap]; j -= gap) {
                    a[j] = a[j - gap];
                }
                a[j] = tmp;
            }
        }
    }

    /** Make a gap-sorted; return the number of shifts. */
    public static long gapInsertionSort(int[] a, int gap) {
        long shifts = 0;
        for (int i = gap; i < a.length; i++) {
            int tmp = a[i];
            int j = i;
            while (j >= gap && tmp < a[j - gap]) {
                a[j] = a[j - gap];
                j -= gap;
                shifts++;
            }
            a[j] = tmp;
        }
        return shifts;
    }

    /** ShellSort with the given increments, largest first (the last must be 1). */
    public static long shellSort(int[] a, int[] gaps) {
        long shifts = 0;
        for (int gap : gaps) {
            shifts += gapInsertionSort(a, gap);
        }
        return shifts;
    }

    /** Shell's increments n/2, n/4, ..., 1. */
    public static int[] halvingGaps(int n) {
        int count = 0;
        for (int g = n / 2; g > 0; g /= 2) {
            count++;
        }
        int[] gaps = new int[count];
        int k = 0;
        for (int g = n / 2; g > 0; g /= 2) {
            gaps[k++] = g;
        }
        return gaps;
    }

    /** Knuth's increments 1, 4, 13, 40, ... below n, largest first. */
    public static int[] knuthGaps(int n) {
        int count = 0;
        for (int h = 1; h < Math.max(n, 2); h = 3 * h + 1) {
            count++;
        }
        int[] gaps = new int[count];
        int h = 1;
        for (int k = count - 1; k >= 0; k--) {
            gaps[k] = h;
            h = 3 * h + 1;
        }
        return gaps;
    }
}`,
  ShellExample: `import java.util.Arrays;

public class ShellExample {
    public static void main(String[] args) {
        int[] original = {81, 94, 11, 96, 12, 35, 17, 95, 28, 58, 41, 75, 15};
        int[] a = original.clone();
        for (int gap : new int[] {5, 3, 1}) {
            long shifts = ShellSort.gapInsertionSort(a, gap);
            System.out.println(gap + "-sorted " + Arrays.toString(a) + "  shifts: " + shifts);
        }

        int[] b = original.clone();
        System.out.println("insertion sort alone: "
                + ShellSort.gapInsertionSort(b, 1) + " shifts");

        int[] c = original.clone();
        System.out.println("halving gaps " + Arrays.toString(ShellSort.halvingGaps(c.length)));
        ShellSort.shellSort(c);
        System.out.println("shellSort    " + Arrays.toString(c));
    }
}`,
  ShellWorstCase: `import java.util.Arrays;
import java.util.Random;

public class ShellWorstCase {
    /** Smallest n/2 values in the even positions, largest n/2 in the odd ones. */
    static int[] badInput(int n) {
        int[] a = new int[n];
        for (int t = 0; t < n / 2; t++) {
            a[2 * t] = n / 2 - t;
            a[2 * t + 1] = n - t;
        }
        return a;
    }

    public static void main(String[] args) {
        int[] a = {4, 12, 1, 10, 3, 11, 2, 9};
        for (int gap : new int[] {4, 2, 1}) {
            long shifts = ShellSort.gapInsertionSort(a, gap);
            System.out.println("gap " + gap + ": " + Arrays.toString(a) + "  shifts " + shifts);
        }

        System.out.println();
        System.out.println("     n  last pass  (n/2)(n/2-1)/2  halving total  Knuth total");
        for (int n = 64; n <= 4096; n *= 4) {
            int[] b = badInput(n);
            int[] gaps = ShellSort.halvingGaps(n);
            long before = 0;
            for (int k = 0; k < gaps.length - 1; k++) {
                before += ShellSort.gapInsertionSort(b, gaps[k]);
            }
            long last = ShellSort.gapInsertionSort(b, 1);
            long knuth = ShellSort.shellSort(badInput(n), ShellSort.knuthGaps(n));
            System.out.printf("%6d %10d %15d %14d %12d%n",
                    n, last, (long) (n / 2) * (n / 2 - 1) / 2, before + last, knuth);
        }

        System.out.println();
        System.out.println("random input, total shifts");
        System.out.println("     n  insertion     halving       Knuth");
        Random rng = new Random(3100);
        for (int n = 1000; n <= 100000; n *= 10) {
            int[] r = new int[n];
            for (int i = 0; i < n; i++) {
                r[i] = rng.nextInt(1000000);
            }
            long ins = ShellSort.gapInsertionSort(r.clone(), 1);
            long half = ShellSort.shellSort(r.clone(), ShellSort.halvingGaps(n));
            long knuth = ShellSort.shellSort(r.clone(), ShellSort.knuthGaps(n));
            System.out.printf("%6d %10d %11d %11d%n", n, ins, half, knuth);
        }
    }
}`,
  CountingSort: `public class CountingSort {
    /** Sort s, whose values are integers in [0, m - 1]. Time O(m + n). */
    public static void countingSort(int[] s, int m) {
        int[] b = new int[m];                 // m buckets, all empty (0)
        for (int i = 0; i < s.length; i++) {  // put each element in its bucket
            b[s[i]]++;
        }
        int i = 0;
        for (int j = 0; j < m; j++) {         // write the buckets back into s, in order
            for (int r = 1; r <= b[j]; r++) {
                s[i] = j;
                i++;
            }
        }
    }

    /** Sort any ints: shift every value by the minimum, so the buckets are min..max. */
    public static void countingSortRange(int[] s) {
        if (s.length == 0) {
            return;
        }
        int min = s[0];
        int max = s[0];
        for (int x : s) {
            min = Math.min(min, x);
            max = Math.max(max, x);
        }
        int[] b = new int[max - min + 1];
        for (int x : s) {
            b[x - min]++;
        }
        int i = 0;
        for (int j = 0; j < b.length; j++) {
            for (int r = 1; r <= b[j]; r++) {
                s[i++] = j + min;
            }
        }
    }
}`,
  CountingExample: `import java.util.Arrays;

public class CountingExample {
    public static void main(String[] args) {
        int[] s = {4, 2, 1, 2, 0, 3, 2, 1, 4, 0, 2, 3, 0};
        CountingSort.countingSort(s, 5);
        System.out.println(Arrays.toString(s));

        int[] t = {4, 3, 2, 1, 5, 2, 4, 1, 2, 0, 4, 2, 0};   // the exercise: values 0..5
        CountingSort.countingSort(t, 6);
        System.out.println(Arrays.toString(t));

        int[] u = {3, -2, 7, 0, -2, 5, -9};
        CountingSort.countingSortRange(u);
        System.out.println(Arrays.toString(u));
    }
}`,
  Card: `record Card(int key, String label) {
    @Override
    public String toString() {
        return key + label;
    }
}`,
  StableCountingSort: `public class StableCountingSort {
    /** Stable sort of records whose keys are in [0, m - 1]. Returns a new array. */
    public static Card[] sort(Card[] a, int m) {
        int[] count = new int[m];
        for (Card c : a) {
            count[c.key()]++;
        }
        for (int k = 1; k < m; k++) {
            count[k] += count[k - 1];         // count[k] = number of keys <= k
        }
        Card[] out = new Card[a.length];
        for (int i = a.length - 1; i >= 0; i--) {
            int k = a[i].key();
            count[k]--;
            out[count[k]] = a[i];
        }
        return out;
    }
}`,
  StableCountingExample: `import java.util.Arrays;

public class StableCountingExample {
    public static void main(String[] args) {
        Card[] a = {new Card(2, "a"), new Card(0, "b"), new Card(2, "c"), new Card(1, "d"),
                    new Card(0, "e"), new Card(2, "f"), new Card(1, "g")};
        System.out.println("input  " + Arrays.toString(a));
        System.out.println("sorted " + Arrays.toString(StableCountingSort.sort(a, 3)));
    }
}`,
  BucketSort: `import java.util.ArrayList;
import java.util.List;

public class BucketSort {
    /** Put each value x of a (0 <= x < 1) into bucket floor(n * x). */
    public static List<List<Double>> distribute(double[] a) {
        int n = a.length;
        List<List<Double>> b = new ArrayList<>();
        for (int j = 0; j < n; j++) {
            b.add(new ArrayList<>());
        }
        for (double x : a) {
            b.get((int) (n * x)).add(x);
        }
        return b;
    }

    /** Stable insertion sort of one bucket. */
    public static void insertionSort(List<Double> list) {
        for (int i = 1; i < list.size(); i++) {
            double tmp = list.get(i);
            int j = i;
            while (j > 0 && list.get(j - 1) > tmp) {
                list.set(j, list.get(j - 1));
                j--;
            }
            list.set(j, tmp);
        }
    }

    /** Sort values in [0, 1). */
    public static void bucketSort(double[] a) {
        List<List<Double>> b = distribute(a);
        int i = 0;
        for (List<Double> bucket : b) {       // buckets in order 0..n-1
            insertionSort(bucket);
            for (double x : bucket) {
                a[i++] = x;
            }
        }
    }
}`,
  BucketExample: `import java.util.Arrays;
import java.util.List;

public class BucketExample {
    static void show(double[] a) {
        List<List<Double>> b = BucketSort.distribute(a);
        for (int j = 0; j < b.size(); j++) {
            if (!b.get(j).isEmpty()) {
                System.out.println("  B[" + j + "] " + b.get(j));
            }
        }
        BucketSort.bucketSort(a);
        System.out.println("  sorted " + Arrays.toString(a));
    }

    public static void main(String[] args) {
        System.out.println("slide example");
        show(new double[] {0.78, 0.17, 0.39, 0.26, 0.72, 0.94, 0.21, 0.12, 0.23, 0.68});
        System.out.println("exercise");
        show(new double[] {0.81, 0.65, 0.91, 0.61, 0.55, 0.71});
    }
}`,
  RadixSort: `import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.List;
import java.util.Queue;

public class RadixSort {
    /** The d-th least significant decimal digit of x >= 0 (d = 0 is the ones digit). */
    public static int digit(int x, int d) {
        for (int i = 0; i < d; i++) {
            x /= 10;                          // integer division drops the last digit
        }
        return x % 10;
    }

    /** Stable sort of a by its d-th least significant digit, with ten queues. */
    public static void sortByDigit(int[] a, int d) {
        List<Queue<Integer>> c = new ArrayList<>();
        for (int i = 0; i < 10; i++) {
            c.add(new ArrayDeque<>());        // ten empty queues
        }
        for (int i = 0; i < a.length; i++) {  // put a[i] into the queue of its digit
            c.get(digit(a[i], d)).add(a[i]);
        }
        int j = 0;
        for (int i = 0; i < 10; i++) {        // copy the queues back into a, in order
            while (!c.get(i).isEmpty()) {
                a[j] = c.get(i).remove();
                j++;
            }
        }
    }

    /** Sort non-negative integers below 10^digits. */
    public static void radixSort(int[] a, int digits) {
        for (int d = 0; d < digits; d++) {
            sortByDigit(a, d);                // sort by the d-th least significant digit
        }
    }
}`,
  RadixTrace: `public class RadixTrace {
    static String fmt(int[] a) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < a.length; i++) {
            sb.append(i == 0 ? "" : ", ").append(String.format("%03d", a[i]));
        }
        return sb.toString();
    }

    public static void main(String[] args) {
        int[] a = {170, 45, 75, 90, 2, 24, 802, 66};
        System.out.println("input   " + fmt(a));
        String[] names = {"ones", "tens", "hundreds"};
        for (int d = 0; d < 3; d++) {
            RadixSort.sortByDigit(a, d);
            System.out.println("pass " + (d + 1) + "  " + fmt(a) + "   (by " + names[d] + ")");
        }

        int[] b = {25, 32, 93, 22, 34};
        RadixSort.radixSort(b, 2);
        System.out.println(java.util.Arrays.toString(b));

        int[] c = {123, 251, 369, 278, 451, 222};
        for (int d = 0; d < 3; d++) {
            RadixSort.sortByDigit(c, d);
            System.out.println("exercise pass " + (d + 1) + ": " + java.util.Arrays.toString(c));
        }
    }
}`,
  MsdWrongOrder: `import java.util.Arrays;

public class MsdWrongOrder {
    public static void main(String[] args) {
        int[] a = {478, 430, 356};
        for (int d = 2; d >= 0; d--) {        // most significant digit first: wrong
            RadixSort.sortByDigit(a, d);
            System.out.println("by digit " + d + ": " + Arrays.toString(a));
        }
        int[] b = {478, 430, 356};
        RadixSort.radixSort(b, 3);            // LSD first: right
        System.out.println("LSD:        " + Arrays.toString(b));
    }
}`,
  Exercise1: `import java.util.Arrays;

public class Exercise1 {
    public static void main(String[] args) {
        int[] a = {9, 8, 7, 6, 5, 4, 3, 2, 1};
        for (int gap : ShellSort.halvingGaps(a.length)) {
            long shifts = ShellSort.gapInsertionSort(a, gap);
            System.out.println("gap " + gap + ": " + Arrays.toString(a) + "  shifts " + shifts);
        }
    }
}`,
  SortLetters: `public class SortLetters {
    static String sortLetters(String s) {
        int[] count = new int[26];
        for (int i = 0; i < s.length(); i++) {
            count[s.charAt(i) - 'a']++;
        }
        StringBuilder sb = new StringBuilder();
        for (int j = 0; j < 26; j++) {
            for (int r = 0; r < count[j]; r++) {
                sb.append((char) ('a' + j));
            }
        }
        return sb.toString();
    }

    public static void main(String[] args) {
        System.out.println(sortLetters("datastructures"));
        System.out.println(sortLetters("shellsort"));
    }
}`,
  Exercise4: `import java.util.Arrays;

public class Exercise4 {
    public static void main(String[] args) {
        for (int n : new int[] {13, 100, 1000}) {
            System.out.println(n + ": " + Arrays.toString(ShellSort.knuthGaps(n)));
        }
        int[] a = {81, 94, 11, 96, 12, 35, 17, 95, 28, 58, 41, 75, 15};
        for (int gap : ShellSort.knuthGaps(a.length)) {
            long shifts = ShellSort.gapInsertionSort(a, gap);
            System.out.println("gap " + gap + ": " + Arrays.toString(a) + "  shifts " + shifts);
        }
    }
}`,
  RadixCounting: `import java.util.Arrays;

public class RadixCounting {
    static void sortByDigit(int[] a, int d) {
        int[] count = new int[10];
        for (int x : a) {
            count[RadixSort.digit(x, d)]++;
        }
        for (int k = 1; k < 10; k++) {
            count[k] += count[k - 1];
        }
        int[] out = new int[a.length];
        for (int i = a.length - 1; i >= 0; i--) {   // right to left keeps it stable
            int k = RadixSort.digit(a[i], d);
            out[--count[k]] = a[i];
        }
        System.arraycopy(out, 0, a, 0, a.length);
    }

    public static void main(String[] args) {
        int[] a = {170, 45, 75, 90, 2, 24, 802, 66};
        for (int d = 0; d < 3; d++) {
            sortByDigit(a, d);
        }
        System.out.println(Arrays.toString(a));
    }
}`,
  MsdRadix: `import java.util.Arrays;

public class MsdRadix {
    static void msdSort(int[] a, int lo, int hi, int d) {
        if (hi - lo <= 1 || d < 0) {
            return;
        }
        int[] count = new int[11];
        for (int i = lo; i < hi; i++) {
            count[RadixSort.digit(a[i], d) + 1]++;
        }
        for (int k = 1; k <= 10; k++) {
            count[k] += count[k - 1];       // bucket k starts at lo + count[k]
        }
        int[] start = count.clone();
        int[] out = new int[hi - lo];
        for (int i = lo; i < hi; i++) {
            out[count[RadixSort.digit(a[i], d)]++] = a[i];
        }
        System.arraycopy(out, 0, a, lo, hi - lo);
        for (int k = 0; k < 10; k++) {     // each bucket on its own, by the next digit
            msdSort(a, lo + start[k], lo + start[k + 1], d - 1);
        }
    }

    public static void main(String[] args) {
        int[] a = {478, 430, 356, 170, 45, 75, 90, 2, 24, 802, 66};
        msdSort(a, 0, a.length, 2);
        System.out.println(Arrays.toString(a));
    }
}`,
  shellSortMethod: `/** ShellSort with Shell's increments n/2, n/4, ..., 1. */
public static void shellSort(int[] a) {
    int j;
    for (int gap = a.length / 2; gap > 0; gap /= 2) {
        // insertion sort on the elements that are gap apart
        for (int i = gap; i < a.length; i++) {
            int tmp = a[i];
            for (j = i; j >= gap && tmp < a[j - gap]; j -= gap) {
                a[j] = a[j - gap];
            }
            a[j] = tmp;
        }
    }
}`,
  countingSortMethod: `/** Sort s, whose values are integers in [0, m - 1]. Time O(m + n). */
public static void countingSort(int[] s, int m) {
    int[] b = new int[m];                 // m buckets, all empty (0)
    for (int i = 0; i < s.length; i++) {  // put each element in its bucket
        b[s[i]]++;
    }
    int i = 0;
    for (int j = 0; j < m; j++) {         // write the buckets back into s, in order
        for (int r = 1; r <= b[j]; r++) {
            s[i] = j;
            i++;
        }
    }
}`,
  stableSortMethod: `/** Stable sort of records whose keys are in [0, m - 1]. Returns a new array. */
public static Card[] sort(Card[] a, int m) {
    int[] count = new int[m];
    for (Card c : a) {
        count[c.key()]++;
    }
    for (int k = 1; k < m; k++) {
        count[k] += count[k - 1];         // count[k] = number of keys <= k
    }
    Card[] out = new Card[a.length];
    for (int i = a.length - 1; i >= 0; i--) {
        int k = a[i].key();
        count[k]--;
        out[count[k]] = a[i];
    }
    return out;
}`,
  bucketSortMethod: `/** Sort values in [0, 1). */
public static void bucketSort(double[] a) {
    List<List<Double>> b = distribute(a);
    int i = 0;
    for (List<Double> bucket : b) {       // buckets in order 0..n-1
        insertionSort(bucket);
        for (double x : bucket) {
            a[i++] = x;
        }
    }
}`,
  distributeMethod: `/** Put each value x of a (0 <= x < 1) into bucket floor(n * x). */
public static List<List<Double>> distribute(double[] a) {
    int n = a.length;
    List<List<Double>> b = new ArrayList<>();
    for (int j = 0; j < n; j++) {
        b.add(new ArrayList<>());
    }
    for (double x : a) {
        b.get((int) (n * x)).add(x);
    }
    return b;
}`,
  sortByDigitMethod: `/** Stable sort of a by its d-th least significant digit, with ten queues. */
public static void sortByDigit(int[] a, int d) {
    List<Queue<Integer>> c = new ArrayList<>();
    for (int i = 0; i < 10; i++) {
        c.add(new ArrayDeque<>());        // ten empty queues
    }
    for (int i = 0; i < a.length; i++) {  // put a[i] into the queue of its digit
        c.get(digit(a[i], d)).add(a[i]);
    }
    int j = 0;
    for (int i = 0; i < 10; i++) {        // copy the queues back into a, in order
        while (!c.get(i).isEmpty()) {
            a[j] = c.get(i).remove();
            j++;
        }
    }
}`,
};

const OUT = {
  ShellExample: `5-sorted [35, 17, 11, 28, 12, 41, 75, 15, 96, 58, 81, 94, 95]  shifts: 6
3-sorted [28, 12, 11, 35, 15, 41, 58, 17, 94, 75, 81, 96, 95]  shifts: 5
1-sorted [11, 12, 15, 17, 28, 35, 41, 58, 75, 81, 94, 95, 96]  shifts: 12
insertion sort alone: 41 shifts
halving gaps [6, 3, 1]
shellSort    [11, 12, 15, 17, 28, 35, 41, 58, 75, 81, 94, 95, 96]`,
  ShellWorstCase: `gap 4: [3, 11, 1, 9, 4, 12, 2, 10]  shifts 3
gap 2: [1, 9, 2, 10, 3, 11, 4, 12]  shifts 6
gap 1: [1, 2, 3, 4, 9, 10, 11, 12]  shifts 6

     n  last pass  (n/2)(n/2-1)/2  halving total  Knuth total
    64        496             496            656          280
   256       8128            8128           9024         1268
  1024     130816          130816         135424         7104
  4096    2096128         2096128        2118656        31600

random input, total shifts
     n  insertion     halving       Knuth
  1000     252428        7274        8800
 10000   25103521      168888      175790
100000 2500370068     2924973     2800201`,
  CountingExample: `[0, 0, 0, 1, 1, 2, 2, 2, 2, 3, 3, 4, 4]
[0, 0, 1, 1, 2, 2, 2, 2, 3, 4, 4, 4, 5]
[-9, -2, -2, 0, 3, 5, 7]`,
  StableCountingExample: `input  [2a, 0b, 2c, 1d, 0e, 2f, 1g]
sorted [0b, 0e, 1d, 1g, 2a, 2c, 2f]`,
  BucketExample: `slide example
  B[1] [0.17, 0.12]
  B[2] [0.26, 0.21, 0.23]
  B[3] [0.39]
  B[6] [0.68]
  B[7] [0.78, 0.72]
  B[9] [0.94]
  sorted [0.12, 0.17, 0.21, 0.23, 0.26, 0.39, 0.68, 0.72, 0.78, 0.94]
exercise
  B[3] [0.65, 0.61, 0.55]
  B[4] [0.81, 0.71]
  B[5] [0.91]
  sorted [0.55, 0.61, 0.65, 0.71, 0.81, 0.91]`,
  RadixTrace: `input   170, 045, 075, 090, 002, 024, 802, 066
pass 1  170, 090, 002, 802, 024, 045, 075, 066   (by ones)
pass 2  002, 802, 024, 045, 066, 170, 075, 090   (by tens)
pass 3  002, 024, 045, 066, 075, 090, 170, 802   (by hundreds)
[22, 25, 32, 34, 93]
exercise pass 1: [251, 451, 222, 123, 278, 369]
exercise pass 2: [222, 123, 251, 451, 369, 278]
exercise pass 3: [123, 222, 251, 278, 369, 451]`,
  MsdWrongOrder: `by digit 2: [356, 478, 430]
by digit 1: [430, 356, 478]
by digit 0: [430, 356, 478]
LSD:        [356, 430, 478]`,
  Exercise1: `gap 4: [1, 4, 3, 2, 5, 8, 7, 6, 9]  shifts 6
gap 2: [1, 2, 3, 4, 5, 6, 7, 8, 9]  shifts 2
gap 1: [1, 2, 3, 4, 5, 6, 7, 8, 9]  shifts 0`,
  SortLetters: `aacderrsstttuu
ehllorsst`,
  Exercise4: `13: [4, 1]
100: [40, 13, 4, 1]
1000: [364, 121, 40, 13, 4, 1]
gap 4: [12, 35, 11, 75, 15, 58, 17, 95, 28, 94, 41, 96, 81]  shifts 9
gap 1: [11, 12, 15, 17, 28, 35, 41, 58, 75, 81, 94, 95, 96]  shifts 20`,
  RadixCounting: `[2, 24, 45, 66, 75, 90, 170, 802]`,
  MsdRadix: `[2, 24, 45, 66, 75, 90, 170, 356, 430, 478, 802]`,
};

// ---------- widget CSS (L12 only) ----------

(function injectL12Css() {
  if (document.getElementById("l12-css")) return;
  const css = `
  .l12-view { background: var(--paper-2); border-radius: 10px; padding: 10px; overflow-x: auto; }
  .l12-row { display: grid; gap: 3px; margin: 4px auto; max-width: 100%; }
  .l12-cellcol { display: flex; flex-direction: column; align-items: center; gap: 2px; min-width: 0; }
  .l12-cell { width: 100%; min-width: 0; height: 36px; display: grid; place-items: center; border: 1px solid var(--line);
    border-radius: 6px; background: var(--card); font: 600 13px var(--mono); position: relative; white-space: nowrap; overflow: hidden; transition: background 0.2s, border-color 0.2s; }
  .l12-cell sub { font-size: 9px; font-weight: 500; color: var(--stone); margin-left: 1px; }
  .l12-cell.dim { opacity: 0.35; }
  .l12-cell.hot { background: var(--mark); border-color: var(--amber); }
  .l12-cell.done { background: var(--green-soft); border-color: var(--green); }
  .l12-cell.hole { border-style: dashed; color: var(--stone); background: transparent; }
  .l12-cell.empty { background: transparent; border-style: dotted; color: var(--stone); font-weight: 400; }
  .l12-idx { font: 10px var(--mono); color: var(--stone); }
  .l12-ptr { font: 600 10px var(--mono); color: var(--teal); height: 14px; white-space: nowrap; }
  .l12-label { font: 600 11px var(--mono); color: var(--stone); margin: 10px 0 2px; letter-spacing: 0.04em; }
  .l12-hist { font: 12px/1.6 var(--mono); margin-top: 8px; overflow-x: auto; white-space: nowrap; }
  .l12-hist div span.l { display: inline-block; min-width: 76px; color: var(--stone); }
  .l12-hist div.now { color: var(--teal); font-weight: 600; }
  .l12-buckets { display: grid; gap: 4px; }
  .l12-bk { display: grid; grid-template-columns: 74px minmax(0, 1fr); align-items: center; gap: 8px; }
  .l12-bk .bi { font: 600 12px var(--mono); color: var(--stone); text-align: right; white-space: nowrap; }
  .l12-bk .bi small { display: block; font-weight: 400; font-size: 9.5px; }
  .l12-bk.hot .bi { color: var(--amber); }
  .l12-chips { display: flex; flex-wrap: wrap; gap: 4px; min-height: 28px; align-items: center; padding: 2px 6px;
    border: 1px solid var(--line); border-radius: 7px; background: var(--card); }
  .l12-bk.hot .l12-chips { border-color: var(--amber); background: var(--mark); }
  .l12-chip { font: 600 12px var(--mono); padding: 2px 7px; border-radius: 5px; background: var(--teal-soft); color: var(--ink); }
  .l12-chip.new { background: var(--amber); color: var(--paper); }
  .l12-chip.ok { background: var(--green-soft); }
  .l12-cols { display: grid; gap: 6px; align-items: end; }
  .l12-col { display: flex; flex-direction: column-reverse; align-items: center; gap: 2px; min-width: 0; }
  .l12-col .tok { width: 100%; max-width: 34px; height: 16px; border-radius: 4px; background: var(--teal-soft);
    border: 1px solid color-mix(in srgb, var(--teal) 40%, transparent); font: 600 10px/14px var(--mono); text-align: center; }
  .l12-col.hot .tok:last-child { background: var(--amber); color: var(--paper); }
  .l12-col .cnt { font: 600 12px var(--mono); }
  .l12-col .lab { font: 11px var(--mono); color: var(--stone); }
  .l12-dig { color: var(--amber); text-decoration: underline; text-underline-offset: 2px; }
  .l12-table { overflow-x: auto; }
  .l12-table table { border-collapse: collapse; width: 100%; font-size: 13px; min-width: 560px; }
  .l12-table th, .l12-table td { border: 1px solid var(--line); padding: 6px 8px; text-align: left; }
  .l12-table th { background: var(--card-2); }
  .l12-table tr.off td { opacity: 0.3; }
  .l12-table tr.pick td:first-child { box-shadow: inset 3px 0 0 var(--green); font-weight: 600; }
  .l12-code { margin-top: 10px; max-height: 360px; overflow: auto; }
  .l12-code pre.code { margin: 0; font-size: 12.5px; }
  .l12-mini-cap { font: 500 11px var(--mono); color: var(--stone); text-align: center; margin-top: 6px; min-height: 1.4em; }
  .controls label { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; flex-wrap: wrap; }
  @media (max-width: 600px) {
    .l12-cell { height: 30px; font-size: 11px; border-radius: 5px; }
    .l12-bk { grid-template-columns: 56px minmax(0, 1fr); gap: 6px; }
    .l12-chip { font-size: 11px; padding: 1px 5px; }
    .controls input[type="text"] { width: 100% !important; }
  }`;
  const st = document.createElement("style");
  st.id = "l12-css";
  st.textContent = css;
  document.head.appendChild(st);
})();

// Subsequence colours (readable in light and dark themes).
const L12_HUES = ["#0f8a8f", "#3f74c2", "#8a5cc2", "#2f8d57", "#c2453a", "#9a8a1a", "#c2418f", "#5f7486"];
const tint = (c, pct = 22) => `color-mix(in srgb, ${c} ${pct}%, var(--card))`;

function lineOf(code, needle) {
  const k = code.split("\n").findIndex((l) => l.includes(needle));
  return k + 1;
}

function parseReals(text, fallback) {
  const xs = String(text).split(/[\s,]+/).filter(Boolean).map(Number).filter((x) => Number.isFinite(x) && x >= 0 && x < 1);
  return xs.length ? xs : fallback;
}

// "3, 2a, 2b, 1" -> [{v: 3, tag: ""}, {v: 2, tag: "a"}, ...]
function parseTagged(text, fallback) {
  const xs = String(text).split(/[\s,]+/).filter(Boolean).map((t) => {
    const m = t.match(/^(-?\d+)([a-z]?)$/i);
    return m ? { v: +m[1], tag: m[2] } : null;
  }).filter(Boolean);
  return xs.length ? xs : fallback;
}

// One row of cells. cells: [{html, cls, style, ptr, idx}]
function rowHTML(cells, maxW = 46) {
  const n = cells.length;
  return `<div class="l12-row" style="grid-template-columns: repeat(${n}, minmax(0, ${maxW}px)); justify-content: center">` +
    cells.map((c) => `<div class="l12-cellcol"><div class="l12-ptr">${c.ptr || ""}</div><div class="l12-cell ${c.cls || ""}" style="${c.style || ""}"><span>${c.html}</span></div>${c.idx === undefined ? "" : `<div class="l12-idx">${c.idx}</div>`}</div>`).join("") +
    `</div>`;
}

const tagged = (x) => `${x.v}${x.tag ? `<sub>${x.tag}</sub>` : ""}`;

// Generic step player: view on top, message, controls, optional code panel with a highlighted line.
// opts: build() -> snaps [{msg, msgCls, line}], draw(snap) -> html, code (string or function),
//       mini, extraControls, onMount(root, rebuild), interval, caption(snap) (mini only).
function makePlayer(el, opts) {
  const mini = !!opts.mini;
  el.innerHTML = `<div class="l12-view"></div>
    ${mini ? `<div class="l12-mini-cap"></div>` : `<div class="msg l12-msg"></div>
    <div class="controls">
      <button class="cbtn p-reset" title="Back to the start">⟲ Reset</button>
      <button class="cbtn p-back" title="Step back (←)">◀ Back</button>
      <button class="cbtn p-step on" title="Step (→)">Step ▶</button>
      <button class="cbtn p-play">Play</button>
      <button class="cbtn p-end">End</button>
      ${opts.extraControls || ""}
      <span class="spacer"></span><span class="counter p-count"></span>
    </div>${opts.code ? `<div class="l12-code"></div>` : ""}`}`;
  const $ = (s) => el.querySelector(s);
  let snaps = [], i = 0, timer = null, codeLines = [];
  function render() {
    const s = snaps[i];
    $(".l12-view").innerHTML = opts.draw(s, i);
    if (mini) { $(".l12-mini-cap").innerHTML = opts.caption ? opts.caption(s) : ""; return; }
    const m = $(".l12-msg");
    m.innerHTML = s.msg || "";
    m.className = "msg l12-msg " + (s.msgCls || "");
    codeLines.forEach((ln, k) => ln.classList.toggle("hl", k + 1 === s.line));
    const hl = codeLines[s.line - 1];
    const box = $(".l12-code");
    if (hl && box) {
      const top = hl.offsetTop - box.offsetTop;
      if (top < box.scrollTop || top > box.scrollTop + box.clientHeight - 30) box.scrollTop = Math.max(0, top - 60);
    }
    $(".p-count").textContent = `step ${i + 1} / ${snaps.length}`;
    $(".p-back").disabled = $(".p-reset").disabled = i === 0;
    $(".p-step").disabled = $(".p-end").disabled = i === snaps.length - 1;
  }
  function stop() { clearInterval(timer); timer = null; if (!mini) $(".p-play").textContent = "Play"; }
  function play() {
    if (timer) return stop();
    if (i === snaps.length - 1) i = 0;
    if (!mini) $(".p-play").textContent = "Pause";
    timer = setInterval(() => {
      if (i < snaps.length - 1) i++;
      else if (mini) i = 0;
      else return stop();
      render();
    }, opts.interval || (mini ? 900 : 650));
  }
  function rebuild() {
    stop();
    snaps = opts.build();
    i = 0;
    if (!mini && opts.code) {
      $(".l12-code").innerHTML = codeBlock(typeof opts.code === "function" ? opts.code() : opts.code);
      codeLines = [...el.querySelectorAll(".l12-code .ln")];
    }
    render();
  }
  if (!mini) {
    $(".p-reset").onclick = () => { stop(); i = 0; render(); };
    $(".p-back").onclick = () => { stop(); if (i > 0) i--; render(); };
    $(".p-step").onclick = () => { stop(); if (i < snaps.length - 1) i++; render(); };
    $(".p-end").onclick = () => { stop(); i = snaps.length - 1; render(); };
    $(".p-play").onclick = play;
    el.tabIndex = 0;
    el.addEventListener("keydown", (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "SELECT") return;
      if (e.key === "ArrowRight") { e.preventDefault(); $(".p-step").click(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); $(".p-back").click(); }
    });
  }
  if (opts.onMount) opts.onMount(el, rebuild);
  rebuild();
  if (mini) play();
  return { rebuild };
}

// ---------- ShellSort: one subsequence at a time ----------

function buildShellPhases(items, gaps) {
  const n = items.length;
  const a = items.slice();
  const rows = [{ label: "original", vals: a.slice() }];
  const snaps = [];
  const snap = (gap, r, msg, msgCls = "") => snaps.push({ a: a.slice(), gap, r, rows: rows.slice(), msg, msgCls });
  snap(0, -1, `Increments <b>${gaps.join(", ")}</b>, largest first. Step to sort the subsequences of the first gap.`);
  let total = 0;
  for (const h of gaps) {
    let phase = 0;
    snap(h, -1, `Gap <b>${h}</b>: the elements ${h} apart form ${Math.min(h, n)} subsequence${Math.min(h, n) > 1 ? "s" : ""}, one colour each. Each is insertion-sorted on its own.`);
    for (let r = 0; r < Math.min(h, n); r++) {
      const pos = [];
      for (let k = r; k < n; k += h) pos.push(k);
      if (pos.length < 2) continue;
      const before = pos.map((k) => tagged(a[k])).join(", ");
      let s = 0;
      for (let i = r + h; i < n; i += h) {
        const tmp = a[i];
        let j = i;
        while (j >= h && tmp.v < a[j - h].v) { a[j] = a[j - h]; j -= h; s++; }
        a[j] = tmp;
      }
      phase += s;
      snap(h, r, `Positions ${pos.join(", ")}: ${before} → <b>${pos.map((k) => tagged(a[k])).join(", ")}</b> &nbsp;(${s} shift${s === 1 ? "" : "s"}).`);
    }
    total += phase;
    rows.push({ label: `${h}-sorted`, vals: a.slice(), shifts: phase });
    snap(h, -1, `The array is now <b>${h}-sorted</b>: ${phase} shift${phase === 1 ? "" : "s"} in this pass.`, "good");
  }
  const sorted = a.every((x, k) => k === 0 || a[k - 1].v <= x.v);
  const last = snaps[snaps.length - 1];
  last.msg = sorted
    ? `Sorted, with <b>${total}</b> shifts in total. ${gaps[gaps.length - 1] === 1 ? "The last gap was 1: a plain insertion sort." : ""}`
    : `<b>Not sorted!</b> The last increment was ${gaps[gaps.length - 1]}, not 1, so the array is only ${gaps[gaps.length - 1]}-sorted.`;
  last.msgCls = sorted ? "good" : "bad";
  return snaps;
}

function drawShellPhases(s, { history = true } = {}) {
  const cells = s.a.map((x, k) => {
    let style = "", cls = "";
    if (s.gap > 0) {
      const c = L12_HUES[(k % s.gap) % L12_HUES.length];
      style = `border-color:${c};background:${tint(c)}`;
      if (s.r >= 0 && k % s.gap !== s.r) cls = "dim";
    }
    return { html: tagged(x), cls, style, idx: k };
  });
  let h = rowHTML(cells);
  if (history) {
    h += `<div class="l12-hist">` + s.rows.map((r, k) =>
      `<div class="${k === s.rows.length - 1 ? "now" : ""}"><span class="l">${r.label}</span>${r.vals.map((x) => String(x.v).padStart(3, " ") + (x.tag || " ")).join("").replace(/ /g, "&nbsp;")}${r.shifts !== undefined ? `&nbsp;&nbsp;<span style="color:var(--stone)">(${r.shifts} shifts)</span>` : ""}</div>`).join("") + `</div>`;
  }
  return h;
}

const SHELL_DATA = "81, 94, 11, 96, 12, 35, 17, 95, 28, 58, 41, 75, 15";

function demoShellPhases(el, { mini = false, data = SHELL_DATA, gaps = "5, 3, 1" } = {}) {
  let items = parseTagged(data, []);
  let gs = parseNums(gaps, [5, 3, 1]);
  makePlayer(el, {
    mini,
    build: () => buildShellPhases(items, gs),
    draw: (s) => drawShellPhases(s, { history: !mini }),
    caption: (s) => s.gap ? `gap ${s.gap}${s.r >= 0 ? ` · subsequence ${s.r}` : ""}` : "original",
    extraControls: `<label>data <input type="text" class="sp-d" value="${data}" style="width:220px"></label>
      <label>gaps <input type="text" class="sp-g" value="${gaps}" style="width:90px"></label>`,
    onMount(root, rebuild) {
      if (mini) return;
      root.querySelector(".sp-d").onchange = (e) => {
        items = parseTagged(e.target.value, parseTagged(data, [])).slice(0, 16);
        e.target.value = items.map((x) => x.v + x.tag).join(", ");
        rebuild();
      };
      root.querySelector(".sp-g").onchange = (e) => {
        gs = parseNums(e.target.value, [5, 3, 1]).filter((g) => g > 0).slice(0, 6);
        if (!gs.length) gs = [1];
        e.target.value = gs.join(", ");
        rebuild();
      };
    },
  });
}

// ---------- ShellSort: the Java method, line by line ----------

function traceShellSort(data) {
  const C = CODE.shellSortMethod;
  const L = (s) => lineOf(C, s);
  const n = data.length;
  const a = data.slice();
  const t = new Tracer();
  const f = t.push("shellSort(a)", { "a.length": n });
  let shifts = 0;
  const ex = (o = {}) => ({ a: a.slice(), ...o });
  f.status = "shifts so far: 0";
  t.snap(L("int j;"), `Start. <code>a.length = ${n}</code>, so the first gap is ${n} / 2 = ${Math.floor(n / 2)}.`, "", ex());
  for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
    f.vars = { gap };
    t.snap(L("for (int gap"), `<code>gap = ${gap}</code>. Now insertion-sort the elements that are ${gap} apart.`, "", ex({ gap }));
    for (let i = gap; i < n; i++) {
      const tmp = a[i];
      f.vars = { gap, i, tmp };
      t.snap(L("int tmp = a[i]"), `<code>i = ${i}</code>: pick up <code>tmp = a[${i}] = ${tmp}</code>. Its subsequence is positions ${i % gap}, ${i % gap + gap}, …`, "", ex({ gap, i, hole: i, tmp }));
      let j = i;
      for (;;) {
        f.vars = { gap, i, j, tmp };
        if (j >= gap && tmp < a[j - gap]) {
          t.snap(L("for (j = i;"), `<code>j = ${j}</code>: ${tmp} &lt; a[${j - gap}] = ${a[j - gap]}, so move ${a[j - gap]} right by ${gap}.`, "", ex({ gap, i, hole: j, tmp, cmp: j - gap }));
          a[j] = a[j - gap];
          shifts++;
          f.status = `shifts so far: ${shifts}`;
          t.snap(L("a[j] = a[j - gap]"), `<code>a[${j}] = a[${j - gap}]</code> (shift ${shifts}). The gap in the array moves to position ${j - gap}.`, "", ex({ gap, i, hole: j - gap, tmp }));
          j -= gap;
        } else {
          const why = j < gap ? `<code>j = ${j}</code> &lt; gap: the front of the subsequence.` : `${tmp} ≥ a[${j - gap}] = ${a[j - gap]}: stop.`;
          t.snap(L("for (j = i;"), why, "", ex({ gap, i, hole: j, tmp, cmp: j >= gap ? j - gap : undefined }));
          break;
        }
      }
      a[j] = tmp;
      t.snap(L("a[j] = tmp"), `<code>a[${j}] = ${tmp}</code>.`, "", ex({ gap, i, placed: j }));
    }
  }
  f.vars = {};
  f.status = `returns · ${shifts} shifts`;
  f.cls = "ret";
  t.snap(C.split("\n").length, `Sorted, with ${shifts} shifts in total.`, "good", ex({ done: true }));
  return t.snaps;
}

function drawShellArray(x) {
  if (!x) return "";
  const cells = x.a.map((v, k) => {
    let style = "", cls = "", ptr = "";
    if (x.gap) {
      const c = L12_HUES[(k % x.gap) % L12_HUES.length];
      style = `border-color:${c};background:${tint(c)}`;
      if (x.i !== undefined && k % x.gap !== x.i % x.gap) cls = "dim";
    }
    let html = String(v);
    if (x.hole === k) { cls += " hole"; html = "·"; ptr = `j`; }
    if (x.cmp === k) { cls += " hot"; ptr = "j−gap"; }
    if (x.placed === k) cls += " done";
    if (x.done) cls = "done", style = "";
    return { html, cls, style, idx: k, ptr };
  });
  return (x.tmp !== undefined ? `<div class="l12-label" style="text-align:center">tmp = <b style="color:var(--amber)">${x.tmp}</b></div>` : `<div class="l12-label" style="text-align:center">&nbsp;</div>`) + rowHTML(cells);
}

function demoShellStep(el) {
  let data = [81, 94, 11, 96, 12, 35, 17, 95, 28, 58];
  makeStepper(el, {
    code: CODE.shellSortMethod,
    build: () => traceShellSort(data),
    stackLabel: "variables",
    renderExtra: (s) => drawShellArray(s.extra),
    extraControls: `<label>a <input type="text" class="ss-d" value="${data.join(", ")}" style="width:200px"></label>`,
    onMount(root, rebuild) {
      root.querySelector(".ss-d").onchange = (e) => {
        data = parseNums(e.target.value, [81, 94, 11, 96, 12, 35, 17, 95, 28, 58]).slice(0, 13);
        e.target.value = data.join(", ");
        rebuild();
      };
    },
  });
}

// ---------- ShellSort: the bad input for halving gaps ----------

function badInput(n) {
  const a = new Array(n);
  for (let t = 0; t < n / 2; t++) { a[2 * t] = n / 2 - t; a[2 * t + 1] = n - t; }
  return a;
}
function halvingGaps(n) { const g = []; for (let h = Math.floor(n / 2); h > 0; h = Math.floor(h / 2)) g.push(h); return g; }
function knuthGaps(n) { const g = []; for (let h = 1; h < Math.max(n, 2); h = 3 * h + 1) g.unshift(h); return g; }
function gapPass(a, gap) {
  let s = 0;
  for (let i = gap; i < a.length; i++) {
    const tmp = a[i]; let j = i;
    while (j >= gap && tmp < a[j - gap]) { a[j] = a[j - gap]; j -= gap; s++; }
    a[j] = tmp;
  }
  return s;
}

function demoShellWorst(el, { mini = false } = {}) {
  let n = mini ? 16 : 16, kind = "halving";
  function build() {
    const a = badInput(n);
    const gaps = kind === "halving" ? halvingGaps(n) : knuthGaps(n);
    const snaps = [{ a: a.slice(), total: 0, pass: null, msg: `The bad input for n = ${n}: the ${n / 2} largest values (amber) sit in the odd positions. Increments: <b>${gaps.join(", ")}</b>.` }];
    let total = 0;
    gaps.forEach((g, k) => {
      const s = gapPass(a, g);
      total += s;
      const last = k === gaps.length - 1;
      const formula = (n / 2) * (n / 2 - 1) / 2;
      let msg = `After the ${g}-sort: ${s} shift${s === 1 ? "" : "s"}.`;
      if (!last && kind === "halving") msg += ` Gap ${g} is even, so amber values only met other amber values: they are all still in odd positions.`;
      if (last) msg += kind === "halving"
        ? ` The final pass had to undo all ${formula} inversions: (n/2)(n/2 − 1)/2 = ${formula}. Total ${total}.`
        : ` Knuth's increments mixed the halves early. Total ${total} shifts (halving needs ${shellTotal(badInput(n), halvingGaps(n))}).`;
      snaps.push({ a: a.slice(), total, pass: { g, s }, msg, msgCls: last ? (kind === "halving" ? "bad" : "good") : "" });
    });
    return snaps;
  }
  function shellTotal(a, gaps) { return gaps.reduce((t, g) => t + gapPass(a, g), 0); }
  function draw(s) {
    const W = 640, H = 150, bw = W / n;
    let g = `<svg viewBox="0 0 ${W} ${H + 18}" role="img" aria-label="array as bars">`;
    s.a.forEach((v, k) => {
      const h = (v / n) * H;
      const big = v > n / 2;
      g += `<rect x="${k * bw + 1}" y="${H - h}" width="${Math.max(bw - 2, 1)}" height="${h}" rx="2" fill="var(--${big ? "amber" : "teal"})" opacity="${big ? 0.85 : 0.7}"/>`;
      if (n <= 16) g += `<text x="${k * bw + bw / 2}" y="${H + 13}" font-size="10" text-anchor="middle" fill="var(--stone)">${v}</text>`;
    });
    g += `</svg>`;
    return g + (mini ? "" : `<div class="stats"><div class="stat"><small>pass</small><b>${s.pass ? "gap " + s.pass.g : "—"}</b></div><div class="stat"><small>shifts this pass</small><b>${s.pass ? s.pass.s : 0}</b></div><div class="stat"><small>total shifts</small><b>${s.total}</b></div></div>`);
  }
  makePlayer(el, {
    mini, build, draw, interval: mini ? 1300 : 900,
    caption: (s) => s.pass ? `after gap ${s.pass.g}: ${s.pass.s} shifts` : "the bad input: large values in odd positions",
    extraControls: `<label>n <select class="sw-n">${[8, 16, 32, 64].map((v) => `<option${v === n ? " selected" : ""}>${v}</option>`).join("")}</select></label>
      <label>increments <select class="sw-k"><option value="halving">halving</option><option value="knuth">Knuth</option></select></label>`,
    onMount(root, rebuild) {
      if (mini) return;
      root.querySelector(".sw-n").onchange = (e) => { n = +e.target.value; rebuild(); };
      root.querySelector(".sw-k").onchange = (e) => { kind = e.target.value; rebuild(); };
    },
  });
}

// ---------- CountingSort ----------

const COUNT_DATA = [4, 2, 1, 2, 0, 3, 2, 1, 4, 0, 2, 3, 0];

function buildCounting(s0) {
  const C = CODE.countingSortMethod;
  const L = (x) => lineOf(C, x);
  const n = s0.length;
  const m = Math.max(...s0) + 1;
  const b = new Array(m).fill(0);
  const out = new Array(n).fill(null);
  const snaps = [];
  const snap = (line, msg, o = {}, msgCls = "") => snaps.push({ line, msg, msgCls, b: b.slice(), out: out.slice(), m, s0, ...o });
  snap(L("int[] b = new int[m]"), `The largest value is ${m - 1}, so <code>m = ${m}</code>: buckets 0 … ${m - 1}, all empty.`);
  for (let i = 0; i < n; i++) {
    b[s0[i]]++;
    snap(L("b[s[i]]++"), `<code>s[${i}] = ${s0[i]}</code> goes into bucket ${s0[i]}: <code>b[${s0[i]}]</code> becomes ${b[s0[i]]}. No comparison was made.`, { i, bucket: s0[i], phase: "count" });
  }
  let i = 0;
  for (let j = 0; j < m; j++) {
    if (b[j] === 0) {
      snap(L("for (int j = 0; j < m"), `Bucket ${j} is empty: nothing to write.`, { bucket: j, phase: "out", wi: i });
      continue;
    }
    for (let r = 1; r <= b[j]; r++) {
      out[i] = j;
      snap(L("s[i] = j"), `Bucket ${j}, copy ${r} of ${b[j]}: <code>s[${i}] = ${j}</code>.`, { bucket: j, phase: "out", wi: i });
      i++;
    }
  }
  snaps[snaps.length - 1].msg += ` Done: ${n} counting steps and ${m} buckets, O(m + n).`;
  snaps[snaps.length - 1].msgCls = "good";
  return snaps;
}

function drawCounting(s, mini = false) {
  const n = s.s0.length;
  let h = `<div class="l12-label">input s</div>` + rowHTML(s.s0.map((v, k) => ({
    html: v, idx: mini ? undefined : k,
    cls: s.phase === "count" ? (k === s.i ? "hot" : k > s.i ? "" : "dim") : s.phase === "out" ? "dim" : "",
    ptr: s.phase === "count" && k === s.i ? "s[i]" : "",
  })), 40);
  const maxTok = 7;
  h += `<div class="l12-label">buckets b[0] … b[${s.m - 1}]</div><div class="l12-cols" style="grid-template-columns: repeat(${s.m}, minmax(0, 46px)); justify-content:center">` +
    s.b.map((c, j) => {
      const toks = Array.from({ length: Math.min(c, maxTok) }, () => `<div class="tok">${j}</div>`).join("");
      return `<div class="l12-col${s.bucket === j ? " hot" : ""}"><div class="lab">b[${j}]</div><div class="cnt" style="color:var(--${s.bucket === j ? "amber" : "ink"})">${c}</div>${c > maxTok ? `<div class="lab">+${c - maxTok}</div>` : ""}${toks}</div>`;
    }).join("") + `</div>`;
  h += `<div class="l12-label">output (written back into s)</div>` + rowHTML(s.out.map((v, k) => ({
    html: v === null ? "" : v, cls: v === null ? "empty" : (k === s.wi && s.phase === "out" ? "hot" : "done"), idx: mini ? undefined : k,
  })), 40);
  return h;
}

function demoCounting(el, { mini = false } = {}) {
  let data = COUNT_DATA.slice();
  makePlayer(el, {
    mini, code: CODE.countingSortMethod,
    build: () => buildCounting(data),
    draw: (s) => drawCounting(s, mini),
    interval: mini ? 450 : 650,
    caption: (s) => s.phase === "count" ? `counting: b[${s.bucket}]++` : s.phase === "out" ? `writing bucket ${s.bucket}` : "m buckets, all empty",
    extraControls: `<label>s (integers 0–15) <input type="text" class="cs-d" value="${data.join(", ")}" style="width:220px"></label>`,
    onMount(root, rebuild) {
      if (mini) return;
      root.querySelector(".cs-d").onchange = (e) => {
        data = parseNums(e.target.value, COUNT_DATA).filter((x) => x >= 0 && x <= 15).slice(0, 16);
        if (!data.length) data = COUNT_DATA.slice();
        e.target.value = data.join(", ");
        rebuild();
      };
    },
  });
}

// ---------- stable CountingSort for records ----------

function buildStableCounting(keys) {
  const C = CODE.stableSortMethod;
  const L = (x) => lineOf(C, x);
  const a = keys.map((k, i) => ({ v: k, tag: String.fromCharCode(97 + i) }));
  const n = a.length, m = Math.max(...keys) + 1;
  const count = new Array(m).fill(0);
  const out = new Array(n).fill(null);
  const snaps = [];
  const snap = (line, msg, o = {}, msgCls = "") => snaps.push({ line, msg, msgCls, a, count: count.slice(), out: out.slice(), m, ...o });
  snap(L("int[] count = new int[m]"), `${n} records with keys in 0 … ${m - 1}. Three phases: count, prefix sums, place from the right.`);
  a.forEach((c, i) => {
    count[c.v]++;
    snap(L("count[c.key()]++"), `Count: record ${tagged(c)} has key ${c.v}, so <code>count[${c.v}]</code> = ${count[c.v]}.`, { i, ck: c.v });
  });
  for (let k = 1; k < m; k++) {
    count[k] += count[k - 1];
    snap(L("count[k] += count[k - 1]"), `Prefix sum: <code>count[${k}]</code> = ${count[k]} records have key ≤ ${k}. Key ${k} will fill positions ${count[k - 1]} … ${count[k] - 1}.`, { ck: k });
  }
  for (let i = n - 1; i >= 0; i--) {
    const k = a[i].v;
    count[k]--;
    out[count[k]] = a[i];
    snap(L("out[count[k]] = a[i]"), `From the right: ${tagged(a[i])} → <code>count[${k}]</code> drops to ${count[k]}, so it goes to <code>out[${count[k]}]</code>.`, { i, ck: k, wo: count[k] });
  }
  const last = snaps[snaps.length - 1];
  last.msg += ` Done. Equal keys kept their input order (look at the letters): the sort is <b>stable</b>.`;
  last.msgCls = "good";
  return snaps;
}

function drawStableCounting(s) {
  let h = `<div class="l12-label">input a (key + label)</div>` + rowHTML(s.a.map((c, k) => ({
    html: tagged(c), idx: k, cls: k === s.i ? "hot" : "", ptr: k === s.i ? "i" : "",
  })), 46);
  h += `<div class="l12-label">count</div>` + rowHTML(s.count.map((c, k) => ({ html: c, idx: k, cls: k === s.ck ? "hot" : "" })), 46);
  h += `<div class="l12-label">out</div>` + rowHTML(s.out.map((c, k) => ({
    html: c ? tagged(c) : "", idx: k, cls: !c ? "empty" : k === s.wo ? "hot" : "done",
  })), 46);
  return h;
}

function demoStableCounting(el) {
  let keys = [2, 0, 2, 1, 0, 2, 1];
  makePlayer(el, {
    code: CODE.stableSortMethod,
    build: () => buildStableCounting(keys),
    draw: drawStableCounting,
    extraControls: `<label>keys (0–9) <input type="text" class="sc-d" value="${keys.join(", ")}" style="width:170px"></label>`,
    onMount(root, rebuild) {
      root.querySelector(".sc-d").onchange = (e) => {
        keys = parseNums(e.target.value, [2, 0, 2, 1, 0, 2, 1]).filter((x) => x >= 0 && x <= 9).slice(0, 12);
        if (!keys.length) keys = [2, 0, 2, 1, 0, 2, 1];
        e.target.value = keys.join(", ");
        rebuild();
      };
    },
  });
}

// ---------- BucketSort ----------

const BUCKET_DATA = [0.78, 0.17, 0.39, 0.26, 0.72, 0.94, 0.21, 0.12, 0.23, 0.68];

function buildBucket(a) {
  const n = a.length;
  const B = Array.from({ length: n }, () => []);
  const out = [];
  const snaps = [];
  const snap = (msg, o = {}, msgCls = "") => snaps.push({ msg, msgCls, a, B: B.map((l) => l.map((c) => ({ ...c }))), out: out.slice(), n, ...o });
  snap(`${n} values, so ${n} buckets of width 1/${n}. Value x goes to bucket ⌊${n}·x⌋.`);
  a.forEach((x, i) => {
    const j = Math.floor(n * x);
    B[j].push({ x, i });
    snap(`${x} → ⌊${n} × ${x}⌋ = ⌊${+(n * x).toFixed(4)}⌋ = <b>${j}</b>. Appended to the end of B[${j}].`, { i, hot: j, newest: i });
  });
  B.forEach((list, j) => {
    if (list.length < 2) return;
    const before = list.map((c) => c.x).join(", ");
    list.sort((p, q) => p.x - q.x || p.i - q.i);   // insertion sort is stable: same result
    snap(`Insertion-sort B[${j}]: ${before} → <b>${list.map((c) => c.x).join(", ")}</b>.`, { hot: j, sorted: j });
  });
  B.forEach((list, j) => {
    if (!list.length) return;
    list.forEach((c) => out.push(c.x));
    snap(`Concatenate B[${j}]: ${list.map((c) => c.x).join(", ")}.`, { hot: j, done: j });
  });
  const last = snaps[snaps.length - 1];
  const maxLen = Math.max(...B.map((l) => l.length));
  last.msg += ` Sorted. The fullest bucket held ${maxLen} value${maxLen === 1 ? "" : "s"}${maxLen > 2 ? ": these values are not spread evenly" : ""}.`;
  last.msgCls = "good";
  return snaps;
}

function drawBucket(s, mini = false) {
  let h = mini ? "" : `<div class="l12-label">input A</div><div class="l12-chips" style="background:transparent;border:0">${s.a.map((x, i) => `<span class="l12-chip${i === s.i ? " new" : ""}">${x}</span>`).join("")}</div>`;
  h += `<div class="l12-label">buckets</div><div class="l12-buckets">` + s.B.map((list, j) =>
    `<div class="l12-bk${s.hot === j ? " hot" : ""}"><div class="bi">B[${j}]${mini ? "" : `<small>[${+(j / s.n).toFixed(2)}, ${+((j + 1) / s.n).toFixed(2)})</small>`}</div>
      <div class="l12-chips">${list.map((c) => `<span class="l12-chip${c.i === s.newest ? " new" : s.done !== undefined && j <= s.done ? " ok" : ""}">${c.x}</span>`).join("") || `<span style="color:var(--stone);font:12px var(--mono)">/</span>`}</div></div>`).join("") + `</div>`;
  h += `<div class="l12-label">output</div><div class="l12-chips">${s.out.map((x) => `<span class="l12-chip ok">${x}</span>`).join("")}</div>`;
  return h;
}

function demoBucket(el, { mini = false } = {}) {
  let data = BUCKET_DATA.slice();
  makePlayer(el, {
    mini,
    build: () => buildBucket(data),
    draw: (s) => drawBucket(s, mini),
    caption: (s) => s.done !== undefined ? "concatenate" : s.sorted !== undefined ? `sort B[${s.sorted}]` : s.i !== undefined ? "distribute" : "n empty buckets",
    extraControls: `<label>A (reals in [0, 1)) <input type="text" class="bs-d" value="${data.join(", ")}" style="width:260px"></label>`,
    onMount(root, rebuild) {
      if (mini) return;
      root.querySelector(".bs-d").onchange = (e) => {
        data = parseReals(e.target.value, BUCKET_DATA).slice(0, 12);
        e.target.value = data.join(", ");
        rebuild();
      };
    },
  });
}

// ---------- RadixSort ----------

const RADIX_DATA = [170, 45, 75, 90, 2, 24, 802, 66];
const digitOf = (x, d) => Math.floor(x / 10 ** d) % 10;

function radixNum(x, width, d) {
  const s = String(x).padStart(width, "0");
  if (d === undefined || d < 0) return s;
  const p = width - 1 - d;
  return `${s.slice(0, p)}<span class="l12-dig">${s[p]}</span>${s.slice(p + 1)}`;
}

function buildRadix(data, mode) {
  const C = CODE.sortByDigitMethod;
  const L = (x) => lineOf(C, x);
  const width = Math.max(1, ...data.map((x) => String(x).length));
  const a = data.slice();
  const order = [];
  for (let d = 0; d < width; d++) order.push(d);
  if (mode === "msd") order.reverse();
  const names = ["ones", "tens", "hundreds", "thousands"];
  const snaps = [];
  let q = Array.from({ length: 10 }, () => []);
  const snap = (line, msg, o = {}, msgCls = "") => snaps.push({ line, msg, msgCls, a: a.slice(), q: q.map((l) => l.slice()), width, ...o });
  snap(0, `${a.length} numbers, ${width} digit${width > 1 ? "s" : ""} each (leading zeros shown). ${mode === "msd" ? "This run goes from the <b>most</b> significant digit down — watch what goes wrong." : "Passes go from the least significant digit up."}`, { d: -1 });
  order.forEach((d, p) => {
    q = Array.from({ length: 10 }, () => []);
    snap(L("c.add(new ArrayDeque<>())"), `Pass ${p + 1}: by the ${names[d] || d + "-th"} digit (<code>d = ${d}</code>). Ten empty queues.`, { d, pass: p + 1 });
    for (let i = 0; i < a.length; i++) {
      const g = digitOf(a[i], d);
      q[g].push(a[i]);
      snap(L("c.get(digit(a[i], d)).add(a[i])"), `<code>digit(${a[i]}, ${d}) = ${g}</code>: enqueue ${a[i]} at the back of queue ${g}.`, { d, pass: p + 1, i, hotq: g, newest: a[i] });
    }
    let j = 0;
    for (let g = 0; g < 10; g++) {
      if (!q[g].length) continue;
      const moved = q[g].slice();
      while (q[g].length) a[j++] = q[g].shift();
      snap(L("a[j] = c.get(i).remove()"), `Dequeue queue ${g} into a: ${moved.map((x) => radixNum(x, width)).join(", ")} (first in, first out).`, { d, pass: p + 1, hotq: g, filled: j, collecting: true });
    }
    snaps[snaps.length - 1].msg += ` After pass ${p + 1}: ${a.map((x) => radixNum(x, width)).join(", ")}.`;
  });
  const sorted = a.every((x, k) => k === 0 || a[k - 1] <= x);
  const last = snaps[snaps.length - 1];
  last.msg += sorted ? " <b>Sorted.</b>" : " <b>Not sorted!</b> The last pass sorted by the least important digit and undid the earlier passes.";
  last.msgCls = sorted ? "good" : "bad";
  return snaps;
}

function drawRadix(s, mini = false) {
  let h = `<div class="l12-label">array a${s.collecting ? " (being refilled)" : ""}</div>` + rowHTML(s.a.map((x, k) => ({
    html: radixNum(x, s.width, s.d),
    cls: s.i === k ? "hot" : s.collecting && k < s.filled ? "done" : s.collecting ? "dim" : "",
    idx: mini ? undefined : k,
  })), 52);
  h += `<div class="l12-label">queues by digit${s.d >= 0 ? ` ${s.d}` : ""}</div><div class="l12-buckets">` + s.q.map((list, g) =>
    `<div class="l12-bk${s.hotq === g ? " hot" : ""}" style="grid-template-columns: 34px minmax(0,1fr)"><div class="bi">${g}</div>
      <div class="l12-chips" style="min-height:24px">${list.map((x) => `<span class="l12-chip${x === s.newest && s.hotq === g ? " new" : ""}">${radixNum(x, s.width, s.d)}</span>`).join("")}</div></div>`).join("") + `</div>`;
  return h;
}

function demoRadix(el, { mini = false, mode = "lsd", data = RADIX_DATA } = {}) {
  let nums = data.slice();
  let m = mode;
  makePlayer(el, {
    mini, code: CODE.sortByDigitMethod,
    build: () => buildRadix(nums, m),
    draw: (s) => drawRadix(s, mini),
    interval: mini ? 650 : 650,
    caption: (s) => s.pass ? `pass ${s.pass} · digit ${s.d}${s.collecting ? " · collect" : " · distribute"}` : "input",
    extraControls: `<label>a (0–9999) <input type="text" class="rx-d" value="${nums.join(", ")}" style="width:220px"></label>
      <label>order <select class="rx-m"><option value="lsd"${m === "lsd" ? " selected" : ""}>LSD first</option><option value="msd"${m === "msd" ? " selected" : ""}>MSD first (wrong)</option></select></label>`,
    onMount(root, rebuild) {
      if (mini) return;
      root.querySelector(".rx-d").onchange = (e) => {
        nums = parseNums(e.target.value, data).filter((x) => x >= 0 && x <= 9999).slice(0, 12);
        if (!nums.length) nums = data.slice();
        e.target.value = nums.join(", ");
        rebuild();
      };
      root.querySelector(".rx-m").onchange = (e) => { m = e.target.value; rebuild(); };
    },
  });
}

// ---------- comparing growth rates ----------

function demoGrowth(el, { mini = false } = {}) {
  const NS = [10, 100, 1000, 10000, 100000, 1000000];
  let k = 3;
  const fmt = (x) => x < 1e6 ? Math.round(x).toLocaleString("en-US") : x.toExponential(1).replace("e+", " × 10^");
  const rows = (n) => [
    ["n² (insertion, worst)", n * n, "red"],
    ["n^1.5 (Shell, Knuth, worst)", n ** 1.5, "amber"],
    ["n^1.25 (Shell, typical)", n ** 1.25, "amber"],
    ["n log₂ n (Merge, Quick)", n * Math.log2(n), ""],
    ["n (Counting, Radix)", n, ""],
  ];
  function render() {
    const n = NS[k];
    const top = Math.log10(n * n);
    el.querySelector(".gr-bars").innerHTML = rows(n).map(([name, v, c]) =>
      `<div class="bar"><span>${name}</span><div class="track"><div class="fill ${c}" style="width:${Math.max(2, (100 * Math.log10(Math.max(v, 1))) / top)}%"></div></div><span class="v">${fmt(v)}</span></div>`).join("");
    el.querySelector(".gr-n").textContent = n.toLocaleString("en-US");
  }
  el.innerHTML = `<div class="l12-label" style="text-align:center">n = <b class="gr-n mono"></b> · bar length on a log scale</div><div class="bars gr-bars"></div>
    ${mini ? "" : `<div class="controls"><label>n <input type="range" class="gr-k" min="0" max="5" value="${k}"></label><span class="spacer"></span><span class="counter">operation counts, constants ignored</span></div>`}`;
  render();
  if (mini) setInterval(() => { k = (k + 1) % NS.length; render(); }, 1400);
  else el.querySelector(".gr-k").oninput = (e) => { k = +e.target.value; render(); };
}

// ---------- the table of ten sorts, filtered ----------

const SORT_ROWS = [
  // name, stable, best, average, worst, space, inPlace, general (comparison), nlognWorst
  ["bubble sort", "yes", "O(n)", "O(n²)", "O(n²)", "O(1)", true, true, false, true],
  ["insertion sort", "yes", "O(n)", "O(n²)", "O(n²)", "O(1)", true, true, false, true],
  ["selection sort", "no*", "O(n²)", "O(n²)", "O(n²)", "O(1)", true, true, false, false],
  ["MergeSort", "yes", "O(n log n)", "O(n log n)", "O(n log n)", "O(n)", false, true, true, true],
  ["HeapSort", "no*", "O(n log n)", "O(n log n)", "O(n log n)", "O(1)", true, true, true, false],
  ["QuickSort", "no*", "O(n log n)", "O(n log n)", "O(n²)", "O(log n) stack", true, true, false, false],
  ["ShellSort", "no*", "O(n log n)", "≈ n^1.25–n^1.3", "O(n²) (halving)", "O(1)", true, true, false, false],
  ["CountingSort", "yes", "O(n + m)", "O(n + m)", "O(n + m)", "O(n + m)", false, false, true, true],
  ["BucketSort", "yes", "O(n)", "O(n)", "O(n²)", "O(n)", false, false, false, true],
  ["RadixSort", "yes", "O(k(n + M))", "O(k(n + M))", "O(k(n + M))", "O(n + M)", false, false, true, true],
];

function demoSortTable(el) {
  el.innerHTML = `<div class="controls" style="margin-top:0">
      <label><input type="checkbox" class="ft-stable"> must be stable</label>
      <label><input type="checkbox" class="ft-place"> O(1) or stack-only extra space</label>
      <label><input type="checkbox" class="ft-worst"> worst case n log n or better</label>
      <label><input type="checkbox" class="ft-gen"> keys only comparable (no digits)</label>
    </div>
    <div class="l12-table"><table><thead><tr><th>algorithm</th><th>stable</th><th>best</th><th>average</th><th>worst</th><th>extra space</th></tr></thead><tbody class="ft-body"></tbody></table></div>
    <p class="msg ft-msg"></p>`;
  const $ = (s) => el.querySelector(s);
  function render() {
    const want = { stable: $(".ft-stable").checked, place: $(".ft-place").checked, worst: $(".ft-worst").checked, gen: $(".ft-gen").checked };
    const ok = (r) => (!want.stable || r[9]) && (!want.place || r[6]) && (!want.worst || r[8]) && (!want.gen || r[7]);
    $(".ft-body").innerHTML = SORT_ROWS.map((r) => `<tr class="${ok(r) ? (Object.values(want).some(Boolean) ? "pick" : "") : "off"}">${r.slice(0, 6).map((c) => `<td>${c}</td>`).join("")}</tr>`).join("");
    const left = SORT_ROWS.filter(ok).map((r) => r[0]);
    $(".ft-msg").innerHTML = !Object.values(want).some(Boolean) ? "Tick a requirement to see which sorts survive. (“no*” means: not stable as usually written.)"
      : left.length ? `Candidates: <b>${left.join(", ")}</b>.` : "No sort in the table meets all of these at once.";
  }
  el.querySelectorAll("input").forEach((c) => { c.onchange = render; });
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

// Demo registry: a data-demo attribute in chapters.js mounts the demo of that name.
const DEMOS = {
  shellPhases: (el) => demoShellPhases(el),
  shellPhasesMini: (el) => demoShellPhases(el, { mini: true }),
  shellStable: (el) => demoShellPhases(el, { data: "3, 2a, 2b, 1", gaps: "2, 1" }),
  shellStep: (el) => demoShellStep(el),
  shellWorst: (el) => demoShellWorst(el),
  shellWorstMini: (el) => demoShellWorst(el, { mini: true }),
  counting: (el) => demoCounting(el),
  countingMini: (el) => demoCounting(el, { mini: true }),
  stableCounting: (el) => demoStableCounting(el),
  bucket: (el) => demoBucket(el),
  bucketMini: (el) => demoBucket(el, { mini: true }),
  radix: (el) => demoRadix(el),
  radixMini: (el) => demoRadix(el, { mini: true }),
  radixMsd: (el) => demoRadix(el, { mode: "msd", data: [478, 430, 356] }),
  growth: (el) => demoGrowth(el),
  growthMini: (el) => demoGrowth(el, { mini: true }),
  sortTable: (el) => demoSortTable(el),
  quiz: (el) => demoQuiz(el, QUIZ),
};
