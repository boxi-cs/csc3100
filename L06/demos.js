// Interactive demos for Lecture 6. CODE and OUT are copied from notes/L06-divide-and-conquer.md
// (checked by tools/check.py); the JS twins below replay what the Java does, step by step.

// Generated from notes/L06-divide-and-conquer.md (checked by tools/check.py): code panels and real outputs.
const CODE = {
  binarySearchClass: "public class BinarySearch {\n    static int calls = 0;   // counts every call, for the analysis below\n\n    /** Returns an index of key in the sorted range arr[left..right], or -1. */\n    static int binarySearch(int[] arr, int key, int left, int right) {\n        calls++;\n        if (left > right) {                       // empty range: key is not there\n            return -1;\n        }\n        if (left == right) {                      // one element left\n            return arr[left] == key ? left : -1;\n        }\n        int middle = left + (right - left) / 2;   // (left + right) / 2, without overflow\n        if (arr[middle] == key) {\n            return middle;\n        } else if (arr[middle] < key) {\n            return binarySearch(arr, key, middle + 1, right);\n        } else {\n            return binarySearch(arr, key, left, middle - 1);\n        }\n    }\n}",
  binarySearch: "/** Returns an index of key in the sorted range arr[left..right], or -1. */\nstatic int binarySearch(int[] arr, int key, int left, int right) {\n    calls++;\n    if (left > right) {                       // empty range: key is not there\n        return -1;\n    }\n    if (left == right) {                      // one element left\n        return arr[left] == key ? left : -1;\n    }\n    int middle = left + (right - left) / 2;   // (left + right) / 2, without overflow\n    if (arr[middle] == key) {\n        return middle;\n    } else if (arr[middle] < key) {\n        return binarySearch(arr, key, middle + 1, right);\n    } else {\n        return binarySearch(arr, key, left, middle - 1);\n    }\n}",
  searchDemo: "public class SearchDemo {\n    public static void main(String[] args) {\n        int[] arr = {1, 3, 5, 6, 16, 78, 100, 135};\n        int[] keys = {100, 7, 1, 135};\n        for (int key : keys) {\n            BinarySearch.calls = 0;\n            int index = BinarySearch.binarySearch(arr, key, 0, arr.length - 1);\n            System.out.println(\"key \" + key + \": index \" + index + \", \" + BinarySearch.calls + \" calls\");\n        }\n    }\n}",
  slideSearchClass: "public class SlideBinarySearch {\n    static int calls = 0;\n\n    // The slide's version: base case for one element, but not for an empty range.\n    static int search(int[] arr, int key, int left, int right) {\n        calls++;\n        if (calls <= 4) {\n            System.out.println(\"call \" + calls + \": left = \" + left + \", right = \" + right);\n        }\n        if (left == right) {\n            if (arr[left] == key) {\n                return left;\n            } else {\n                return -1;\n            }\n        }\n        int middle = (left + right) / 2;\n        if (arr[middle] == key) {\n            return middle;\n        } else if (arr[middle] < key) {\n            return search(arr, key, middle + 1, right);\n        } else {\n            return search(arr, key, left, middle - 1);\n        }\n    }\n\n    public static void main(String[] args) {\n        int[] arr = {1, 3};\n        System.out.println(\"search for 3 returns \" + search(arr, 3, 0, 1));\n        calls = 0;\n        try {\n            search(arr, 0, 0, 1);\n        } catch (StackOverflowError e) {\n            System.out.println(\"search for 0: StackOverflowError\");\n        }\n    }\n}",
  slideSearch: "// The slide's version: base case for one element, but not for an empty range.\nstatic int search(int[] arr, int key, int left, int right) {\n    calls++;\n    if (calls <= 4) {\n        System.out.println(\"call \" + calls + \": left = \" + left + \", right = \" + right);\n    }\n    if (left == right) {\n        if (arr[left] == key) {\n            return left;\n        } else {\n            return -1;\n        }\n    }\n    int middle = (left + right) / 2;\n    if (arr[middle] == key) {\n        return middle;\n    } else if (arr[middle] < key) {\n        return search(arr, key, middle + 1, right);\n    } else {\n        return search(arr, key, left, middle - 1);\n    }\n}",
  worstCase: "public class WorstCase {\n    public static void main(String[] args) {\n        int[] sizes = {1, 2, 3, 4, 7, 8, 100, 1000, 1024, 1025, 1000000};\n        System.out.println(\"      n   worst calls   floor(log2 n) + 1\");\n        for (int n : sizes) {\n            int[] arr = new int[n];\n            for (int i = 0; i < n; i++) {\n                arr[i] = 2 * i;                   // even numbers: odd keys fall in the gaps\n            }\n            int worst = 0;\n            for (int key = -1; key <= 2 * n - 1; key++) {\n                BinarySearch.calls = 0;\n                BinarySearch.binarySearch(arr, key, 0, n - 1);\n                worst = Math.max(worst, BinarySearch.calls);\n            }\n            int log = 31 - Integer.numberOfLeadingZeros(n);   // floor(log2 n)\n            System.out.printf(\"%7d   %11d   %17d%n\", n, worst, log + 1);\n        }\n    }\n}",
  selectionSortClass: "public class SelectionSort {\n    static long comparisons = 0;   // counts maxNum < arr[i]\n\n    /** Sorts arr[0..n-1] into increasing order. */\n    static void selectionSort(int[] arr, int n) {\n        if (n <= 1) {                         // 0 or 1 element: already sorted\n            return;\n        }\n        int maxNum = arr[0];\n        int maxIndex = 0;\n        for (int i = 1; i <= n - 1; i++) {    // find the largest of arr[0..n-1]\n            comparisons++;\n            if (maxNum < arr[i]) {\n                maxNum = arr[i];\n                maxIndex = i;\n            }\n        }\n        arr[maxIndex] = arr[n - 1];           // move it to the end\n        arr[n - 1] = maxNum;\n        selectionSort(arr, n - 1);            // sort the first n - 1\n    }\n}",
  selectionSort: "/** Sorts arr[0..n-1] into increasing order. */\nstatic void selectionSort(int[] arr, int n) {\n    if (n <= 1) {                         // 0 or 1 element: already sorted\n        return;\n    }\n    int maxNum = arr[0];\n    int maxIndex = 0;\n    for (int i = 1; i <= n - 1; i++) {    // find the largest of arr[0..n-1]\n        comparisons++;\n        if (maxNum < arr[i]) {\n            maxNum = arr[i];\n            maxIndex = i;\n        }\n    }\n    arr[maxIndex] = arr[n - 1];           // move it to the end\n    arr[n - 1] = maxNum;\n    selectionSort(arr, n - 1);            // sort the first n - 1\n}",
  selectionSortDemo: "import java.util.Arrays;\n\npublic class SelectionSortDemo {\n    public static void main(String[] args) {\n        int[] arr = {4, 2, 3, 6, 9, 5};\n        SelectionSort.selectionSort(arr, arr.length);\n        System.out.println(Arrays.toString(arr) + \", \" + SelectionSort.comparisons + \" comparisons\");\n\n        System.out.println(\"    n   comparisons   n(n-1)/2\");\n        for (int n : new int[] {10, 100, 1000}) {\n            int[] data = new int[n];\n            for (int i = 0; i < n; i++) {\n                data[i] = (i * 37) % n;           // some order that is not sorted\n            }\n            SelectionSort.comparisons = 0;\n            SelectionSort.selectionSort(data, n);\n            System.out.printf(\"%5d   %11d   %8d%n\", n, SelectionSort.comparisons, n * (n - 1) / 2);\n        }\n    }\n}",
  maxInArrayClass: "public class MaxInArray {\n    static int calls = 0;\n\n    /** The largest of arr[0..n-1], for n >= 1: compare the last element with the rest. */\n    static int maxInArray1(int[] arr, int n) {\n        calls++;\n        if (n == 1) {\n            return arr[0];\n        }\n        int tempMax = maxInArray1(arr, n - 1);\n        return Math.max(arr[n - 1], tempMax);\n    }\n\n    /** The largest of arr[left..right]: the larger of the two halves' maxima. */\n    static int maxInArray2(int[] arr, int left, int right) {\n        calls++;\n        if (left == right) {\n            return arr[left];\n        }\n        int middle = (left + right) / 2;\n        int maxLeft = maxInArray2(arr, left, middle);\n        int maxRight = maxInArray2(arr, middle + 1, right);\n        return Math.max(maxLeft, maxRight);\n    }\n}",
  maxInArray1: "/** The largest of arr[0..n-1], for n >= 1: compare the last element with the rest. */\nstatic int maxInArray1(int[] arr, int n) {\n    calls++;\n    if (n == 1) {\n        return arr[0];\n    }\n    int tempMax = maxInArray1(arr, n - 1);\n    return Math.max(arr[n - 1], tempMax);\n}",
  maxInArray2: "/** The largest of arr[left..right]: the larger of the two halves' maxima. */\nstatic int maxInArray2(int[] arr, int left, int right) {\n    calls++;\n    if (left == right) {\n        return arr[left];\n    }\n    int middle = (left + right) / 2;\n    int maxLeft = maxInArray2(arr, left, middle);\n    int maxRight = maxInArray2(arr, middle + 1, right);\n    return Math.max(maxLeft, maxRight);\n}",
  maxDemo: "public class MaxDemo {\n    public static void main(String[] args) {\n        int[] arr = {4, 2, 3, 6, 9, 5, 8, 1};\n        MaxInArray.calls = 0;\n        System.out.println(\"maxInArray1: \" + MaxInArray.maxInArray1(arr, arr.length)\n                + \", \" + MaxInArray.calls + \" calls\");\n        MaxInArray.calls = 0;\n        System.out.println(\"maxInArray2: \" + MaxInArray.maxInArray2(arr, 0, arr.length - 1)\n                + \", \" + MaxInArray.calls + \" calls\");\n        for (int n : new int[] {1, 5, 16, 1000}) {\n            int[] data = new int[n];\n            MaxInArray.calls = 0;\n            MaxInArray.maxInArray2(data, 0, n - 1);\n            System.out.println(\"n = \" + n + \": maxInArray2 makes \" + MaxInArray.calls + \" calls\");\n        }\n    }\n}",
  recurrences: "public class Recurrences {\n    static long binarySearchT(long n) { return n == 1 ? 1 : binarySearchT(n / 2) + 1; }    // T(n/2) + 1\n    static long selectionT(long n) { return n == 1 ? 1 : selectionT(n - 1) + n; }          // T(n-1) + n\n    static long maxInArray2T(long n) { return n == 1 ? 1 : 2 * maxInArray2T(n / 2) + 1; }  // 2T(n/2) + 1\n    static long mergeT(long n) { return n == 1 ? 1 : 2 * mergeT(n / 2) + n; }              // 2T(n/2) + n\n\n    public static void main(String[] args) {\n        System.out.println(\"   n  T(n/2)+1 log2n+1   T(n-1)+n n(n+1)/2   2T(n/2)+1   2n-1   2T(n/2)+n nlog2n+n\");\n        for (long n = 1; n <= 1024; n *= 4) {\n            int log = 63 - Long.numberOfLeadingZeros(n);\n            System.out.printf(\"%4d  %8d %8d   %8d %8d   %9d %6d   %9d %8d%n\", n,\n                    binarySearchT(n), log + 1, selectionT(n), n * (n + 1) / 2,\n                    maxInArray2T(n), 2 * n - 1, mergeT(n), n * log + n);\n        }\n    }\n}",
  masterCheck: "public class MasterCheck {\n    static void check(int a, int b, double d) {\n        double bd = Math.pow(b, d);\n        String which = Math.abs(a - bd) < 1e-9 ? \"a = b^d\" : a < bd ? \"a < b^d\" : \"a > b^d\";\n        System.out.printf(\"a=%d b=%d d=%.2f  %s  T(n)/bound:\", a, b, d, which);\n        double t = 1;                                    // T(b^0) = T(1)\n        for (int k = 1; k <= 24; k++) {\n            double n = Math.pow(b, k);\n            t = a * t + Math.pow(n, d);                  // T(b^k) = a T(b^(k-1)) + (b^k)^d\n            double bound = which.equals(\"a = b^d\") ? Math.pow(n, d) * Math.log(n) / Math.log(b)\n                    : which.equals(\"a < b^d\") ? Math.pow(n, d)\n                    : Math.pow(n, Math.log(a) / Math.log(b));\n            if (k % 8 == 0) {\n                System.out.printf(\"  k=%d: %.3f\", k, t / bound);\n            }\n        }\n        System.out.println();\n    }\n\n    public static void main(String[] args) {\n        check(1, 2, 0);       // binary search\n        check(2, 2, 1);       // merge sort, maximum subarray\n        check(2, 2, 0);       // maxInArray2\n        check(1, 2, 1);\n        check(8, 2, 2);\n        check(2, 4, 0.5);\n        check(3, 2, 1);       // Karatsuba multiplication\n    }\n}",
  bruteClass: "public class MaxSubarrayBrute {\n    /** Returns {low, high, sum} of a maximum subarray, by trying every subarray: O(n^3). */\n    static int[] bruteForce(int[] a) {\n        int bestSum = Integer.MIN_VALUE, bestLow = 0, bestHigh = 0;\n        for (int i = 0; i < a.length; i++) {\n            for (int j = i; j < a.length; j++) {\n                int sum = 0;\n                for (int k = i; k <= j; k++) {    // sum of a[i..j], from scratch\n                    sum += a[k];\n                }\n                if (sum > bestSum) {\n                    bestSum = sum;\n                    bestLow = i;\n                    bestHigh = j;\n                }\n            }\n        }\n        return new int[] {bestLow, bestHigh, bestSum};\n    }\n\n    /** The same, with prefix sums: r[i] = a[0] + ... + a[i-1], so sum(a[i..j]) = r[j+1] - r[i]. O(n^2). */\n    static int[] prefixSum(int[] a) {\n        int n = a.length;\n        int[] r = new int[n + 1];                 // r[0] = 0: the sum before the array begins\n        for (int i = 1; i <= n; i++) {\n            r[i] = r[i - 1] + a[i - 1];\n        }\n        int bestSum = Integer.MIN_VALUE, bestLow = 0, bestHigh = 0;\n        for (int i = 0; i < n; i++) {\n            for (int j = i; j < n; j++) {         // j starts at i: one-element subarrays count\n                int sum = r[j + 1] - r[i];\n                if (sum > bestSum) {\n                    bestSum = sum;\n                    bestLow = i;\n                    bestHigh = j;\n                }\n            }\n        }\n        return new int[] {bestLow, bestHigh, bestSum};\n    }\n}",
  maxSubarrayClass: "public class MaxSubarray {\n    /** A subarray a[low..high] and its sum. */\n    record Result(int low, int high, int sum) { }\n\n    /** The maximum subarray of a[i..j] that contains both a[k] and a[k + 1]. */\n    static Result maxCrossSubarray(int[] a, int i, int k, int j) {\n        int leftSum = Integer.MIN_VALUE;          // \"minus infinity\"\n        int sum = 0;\n        int maxLeft = k;\n        for (int p = k; p >= i; p--) {            // best part ending at k\n            sum += a[p];\n            if (sum > leftSum) {\n                leftSum = sum;\n                maxLeft = p;\n            }\n        }\n        int rightSum = Integer.MIN_VALUE;\n        sum = 0;\n        int maxRight = k + 1;\n        for (int q = k + 1; q <= j; q++) {        // best part starting at k + 1\n            sum += a[q];\n            if (sum > rightSum) {\n                rightSum = sum;\n                maxRight = q;\n            }\n        }\n        return new Result(maxLeft, maxRight, leftSum + rightSum);\n    }\n\n    /** The maximum subarray of a[i..j], for i <= j. */\n    static Result maxSubarray(int[] a, int i, int j) {\n        if (i == j) {                             // base case: one element\n            return new Result(i, j, a[i]);\n        }\n        int k = (i + j) / 2;                      // divide\n        Result left = maxSubarray(a, i, k);       // conquer\n        Result right = maxSubarray(a, k + 1, j);\n        Result cross = maxCrossSubarray(a, i, k, j);\n        if (left.sum() >= right.sum() && left.sum() >= cross.sum()) {         // combine: case 1\n            return left;\n        } else if (right.sum() >= left.sum() && right.sum() >= cross.sum()) { // case 2\n            return right;\n        } else {                                                              // case 3\n            return cross;\n        }\n    }\n}",
  maxCross: "/** The maximum subarray of a[i..j] that contains both a[k] and a[k + 1]. */\nstatic Result maxCrossSubarray(int[] a, int i, int k, int j) {\n    int leftSum = Integer.MIN_VALUE;          // \"minus infinity\"\n    int sum = 0;\n    int maxLeft = k;\n    for (int p = k; p >= i; p--) {            // best part ending at k\n        sum += a[p];\n        if (sum > leftSum) {\n            leftSum = sum;\n            maxLeft = p;\n        }\n    }\n    int rightSum = Integer.MIN_VALUE;\n    sum = 0;\n    int maxRight = k + 1;\n    for (int q = k + 1; q <= j; q++) {        // best part starting at k + 1\n        sum += a[q];\n        if (sum > rightSum) {\n            rightSum = sum;\n            maxRight = q;\n        }\n    }\n    return new Result(maxLeft, maxRight, leftSum + rightSum);\n}",
  maxSubarray: "/** The maximum subarray of a[i..j], for i <= j. */\nstatic Result maxSubarray(int[] a, int i, int j) {\n    if (i == j) {                             // base case: one element\n        return new Result(i, j, a[i]);\n    }\n    int k = (i + j) / 2;                      // divide\n    Result left = maxSubarray(a, i, k);       // conquer\n    Result right = maxSubarray(a, k + 1, j);\n    Result cross = maxCrossSubarray(a, i, k, j);\n    if (left.sum() >= right.sum() && left.sum() >= cross.sum()) {         // combine: case 1\n        return left;\n    } else if (right.sum() >= left.sum() && right.sum() >= cross.sum()) { // case 2\n        return right;\n    } else {                                                              // case 3\n        return cross;\n    }\n}",
  mssDemo: "import java.util.Arrays;\n\npublic class MaxSubarrayDemo {\n    static String show(int[] a, int low, int high, int sum) {\n        return Arrays.toString(Arrays.copyOfRange(a, low, high + 1)) + \" sum \" + sum\n                + \" (a[\" + low + \"..\" + high + \"])\";\n    }\n\n    public static void main(String[] args) {\n        int[][] tests = {\n            {3, 7, 9, 17, 5, 28, 21, 18, 6, 4},\n            {-3, 7, -9, 17, -5, 28, -21, 18, -6, 4},\n            {-3, -7, -9, -17, -5, -28, -21, -18, -6, -4},\n            {-2, 1, -3, 4, -1, 2, 1, -5, 4},\n        };\n        for (int[] a : tests) {\n            MaxSubarray.Result r = MaxSubarray.maxSubarray(a, 0, a.length - 1);\n            int[] b = MaxSubarrayBrute.bruteForce(a);\n            int[] p = MaxSubarrayBrute.prefixSum(a);\n            System.out.println(show(a, r.low(), r.high(), r.sum()));\n            System.out.println(\"  brute force agrees: \" + (b[2] == r.sum())\n                    + \", prefix sums agree: \" + (p[2] == r.sum()));\n        }\n    }\n}",
  mssCount: "public class MaxSubarrayCount {\n    static long ops = 0;\n\n    static int crossCounted(int[] a, int i, int k, int j) {\n        int leftSum = Integer.MIN_VALUE, rightSum = Integer.MIN_VALUE, sum = 0;\n        for (int p = k; p >= i; p--) {\n            sum += a[p];\n            ops++;\n            leftSum = Math.max(leftSum, sum);\n        }\n        sum = 0;\n        for (int q = k + 1; q <= j; q++) {\n            sum += a[q];\n            ops++;\n            rightSum = Math.max(rightSum, sum);\n        }\n        return leftSum + rightSum;\n    }\n\n    static int divideAndConquer(int[] a, int i, int j) {\n        if (i == j) {\n            return a[i];\n        }\n        int k = (i + j) / 2;\n        int left = divideAndConquer(a, i, k);\n        int right = divideAndConquer(a, k + 1, j);\n        return Math.max(Math.max(left, right), crossCounted(a, i, k, j));\n    }\n\n    public static void main(String[] args) {\n        System.out.println(\"      n     brute force    prefix sums   divide & conquer\");\n        for (int n : new int[] {10, 100, 1000, 10000}) {\n            long brute = (long) n * (n + 1) * (n + 2) / 6;   // additions in the triple loop\n            long prefix = n + (long) n * (n + 1) / 2;        // building r, then one per pair\n            int[] a = new int[n];\n            for (int i = 0; i < n; i++) {\n                a[i] = (i * 37) % 19 - 9;\n            }\n            ops = 0;\n            divideAndConquer(a, 0, n - 1);\n            System.out.printf(\"%7d %15d %14d %18d%n\", n, brute, prefix, ops);\n        }\n    }\n}",
  sumArray: "public class SumArray {\n    static long sumArray(int[] arr, int left, int right) {\n        if (left == right) {\n            return arr[left];\n        }\n        int middle = (left + right) / 2;\n        return sumArray(arr, left, middle) + sumArray(arr, middle + 1, right);\n    }\n\n    public static void main(String[] args) {\n        int[] arr = {4, 2, 3, 6, 9, 5};\n        System.out.println(sumArray(arr, 0, arr.length - 1));\n    }\n}",
  kadane: "public class Kadane {\n    static int maxSubarraySum(int[] a) {\n        int endingHere = a[0];            // best sum of a subarray ending at i\n        int best = a[0];\n        for (int i = 1; i < a.length; i++) {\n            endingHere = Math.max(a[i], endingHere + a[i]);\n            best = Math.max(best, endingHere);\n        }\n        return best;\n    }\n\n    public static void main(String[] args) {\n        System.out.println(maxSubarraySum(new int[] {-3, 7, -9, 17, -5, 28, -21, 18, -6, 4}));\n        System.out.println(maxSubarraySum(new int[] {-3, -7, -9, -17, -5, -28, -21, -18, -6, -4}));\n        System.out.println(maxSubarraySum(new int[] {-2, 1, -3, 4, -1, 2, 1, -5, 4}));\n    }\n}",
};

const OUT = {
  searchDemo: "key 100: index 6, 3 calls\nkey 7: index -1, 3 calls\nkey 1: index 0, 3 calls\nkey 135: index 7, 4 calls",
  slideSearch: "call 1: left = 0, right = 1\ncall 2: left = 1, right = 1\nsearch for 3 returns 1\ncall 1: left = 0, right = 1\ncall 2: left = 0, right = -1\ncall 3: left = 0, right = -1\ncall 4: left = 0, right = -1\nsearch for 0: StackOverflowError",
  worstCase: "      n   worst calls   floor(log2 n) + 1\n      1             1                   1\n      2             2                   2\n      3             2                   2\n      4             3                   3\n      7             3                   3\n      8             4                   4\n    100             7                   7\n   1000            10                  10\n   1024            11                  11\n   1025            11                  11\n1000000            20                  20",
  selectionSortDemo: "[2, 3, 4, 5, 6, 9], 15 comparisons\n    n   comparisons   n(n-1)/2\n   10            45         45\n  100          4950       4950\n 1000        499500     499500",
  maxDemo: "maxInArray1: 9, 8 calls\nmaxInArray2: 9, 15 calls\nn = 1: maxInArray2 makes 1 calls\nn = 5: maxInArray2 makes 9 calls\nn = 16: maxInArray2 makes 31 calls\nn = 1000: maxInArray2 makes 1999 calls",
  recurrences: "   n  T(n/2)+1 log2n+1   T(n-1)+n n(n+1)/2   2T(n/2)+1   2n-1   2T(n/2)+n nlog2n+n\n   1         1        1          1        1           1      1           1        1\n   4         3        3         10       10           7      7          12       12\n  16         5        5        136      136          31     31          80       80\n  64         7        7       2080     2080         127    127         448      448\n 256         9        9      32896    32896         511    511        2304     2304\n1024        11       11     524800   524800        2047   2047       11264    11264",
  masterCheck: "a=1 b=2 d=0.00  a = b^d  T(n)/bound:  k=8: 1.125  k=16: 1.063  k=24: 1.042\na=2 b=2 d=1.00  a = b^d  T(n)/bound:  k=8: 1.125  k=16: 1.063  k=24: 1.042\na=2 b=2 d=0.00  a > b^d  T(n)/bound:  k=8: 1.996  k=16: 2.000  k=24: 2.000\na=1 b=2 d=1.00  a < b^d  T(n)/bound:  k=8: 1.996  k=16: 2.000  k=24: 2.000\na=8 b=2 d=2.00  a > b^d  T(n)/bound:  k=8: 1.996  k=16: 2.000  k=24: 2.000\na=2 b=4 d=0.50  a = b^d  T(n)/bound:  k=8: 1.125  k=16: 1.063  k=24: 1.042\na=3 b=2 d=1.00  a > b^d  T(n)/bound:  k=8: 2.922  k=16: 2.997  k=24: 3.000",
  mssDemo: "[3, 7, 9, 17, 5, 28, 21, 18, 6, 4] sum 118 (a[0..9])\n  brute force agrees: true, prefix sums agree: true\n[17, -5, 28] sum 40 (a[3..5])\n  brute force agrees: true, prefix sums agree: true\n[-3] sum -3 (a[0..0])\n  brute force agrees: true, prefix sums agree: true\n[4, -1, 2, 1] sum 6 (a[3..6])\n  brute force agrees: true, prefix sums agree: true",
  mssCount: "      n     brute force    prefix sums   divide & conquer\n     10             220             65                 34\n    100          171700           5150                672\n   1000       167167000         501500               9976\n  10000    166716670000       50015000             133616",
  sumArray: "29",
  kadane: "40\n-3\n6",
};

// ---------- shared bits for this lecture ----------

(function injectStyle() {
  if (document.getElementById("l06-style")) return;
  const s = document.createElement("style");
  s.id = "l06-style";
  s.textContent = `
  .l6-frames .fr-view { min-height: 60px; }
  .l6-algebra { font-family: "Cambria Math", "STIX Two Math", Georgia, serif; font-size: 17px; line-height: 1.9; background: var(--paper-2); border-radius: 10px; padding: 10px 14px; overflow-x: auto; }
  .l6-algebra div { white-space: nowrap; opacity: 0.55; }
  .l6-algebra div.cur { opacity: 1; color: var(--teal); font-weight: 600; }
  .l6-algebra div.done { opacity: 0.9; }
  .l6-cells .cell.sorted { background: var(--green-soft); border-color: var(--green); color: var(--green); }
  .l6-cells .cell.pick { background: var(--teal-soft); border-color: var(--teal); }
  .l6-cells .cell.cur { box-shadow: 0 0 0 2px var(--amber) inset; }
  .l6-cells .cell.mid { background: var(--mark); border-color: var(--amber); }
  .l6-cells .cellcol.split { border-left: 2px dashed var(--red); padding-left: 4px; margin-left: 2px; }
  .l6-legend { display: flex; flex-wrap: wrap; gap: 12px; font-size: 12px; color: var(--ink-2); justify-content: center; margin: 4px 0 2px; }
  .l6-legend i { display: inline-block; width: 12px; height: 12px; border-radius: 3px; vertical-align: -2px; margin-right: 4px; border: 1px solid var(--line); }
  .l6-level-table { overflow-x: auto; }
  .l6-level-table table { border-collapse: collapse; width: 100%; font-size: 13px; margin: 8px 0 0; }
  .l6-level-table th, .l6-level-table td { border: 1px solid var(--line); padding: 4px 8px; text-align: right; white-space: nowrap; }
  .l6-level-table th { background: var(--card-2); font-weight: 600; }
  .l6-level-table tr.cur td { background: var(--mark); }
  .l6-level-table tr.future td { color: var(--stone); opacity: 0.5; }
  .l6-verdict { margin-top: 10px; padding: 10px 12px; border-radius: 8px; background: var(--teal-soft); font-size: 14px; }
  .l6-verdict.bad { background: var(--red-soft); }
  .l6-master { display: grid; gap: 10px; }
  .l6-master .math-block { margin: 6px 0; font-size: 17px; }
  .l6-plotnote { font-size: 13px; color: var(--ink-2); margin: 8px 0 0; }
  .l6-sums { display: flex; flex-wrap: wrap; gap: 8px 18px; justify-content: center; font: 500 13px var(--mono); color: var(--ink-2); margin: 4px 0; }
  .l6-sums b { color: var(--ink); }
  @media (max-width: 600px) { .l6-algebra { font-size: 15px; } }
  `;
  document.head.appendChild(s);
})();

// Array cells. opt: cls(k) -> extra class, ptr(k) -> label above, split = index where a dashed line goes before.
function l6Cells(data, opt = {}) {
  return `<div class="cells l6-cells">` + data.map((v, k) => {
    const cls = "cell " + (opt.cls ? opt.cls(k) || "" : "");
    const p = opt.ptr ? opt.ptr(k) || "" : "";
    return `<div class="cellcol${opt.split === k ? " split" : ""}"><div class="ptr">${p}</div><div class="${cls}">${v}</div><div class="cellidx">${k}</div></div>`;
  }).join("") + `</div>`;
}

// A step-through player for demos that are not call stacks: build() -> [{html, msg, msgCls}].
function makeFrames(el, opts) {
  const mini = !!opts.mini;
  el.innerHTML = `<div class="l6-frames"><div class="fr-view"></div>
    ${mini ? "" : `<div class="msg fr-msg"></div>
    <div class="controls">
      <button class="cbtn fr-reset">⟲ Reset</button>
      <button class="cbtn fr-back">◀ Back</button>
      <button class="cbtn fr-step on">Step ▶</button>
      <button class="cbtn fr-play">Play</button>
      ${opts.extraControls || ""}
      <span class="spacer"></span><span class="counter fr-count"></span>
    </div>`}</div>`;
  const $ = (s) => el.querySelector(s);
  let frames = [], i = 0, timer = null;
  function render() {
    const f = frames[i];
    $(".fr-view").innerHTML = f.html;
    if (mini) return;
    $(".fr-msg").innerHTML = f.msg || "";
    $(".fr-msg").className = "msg fr-msg " + (f.msgCls || "");
    $(".fr-count").textContent = `step ${i + 1} / ${frames.length}`;
    $(".fr-back").disabled = $(".fr-reset").disabled = i === 0;
    $(".fr-step").disabled = i === frames.length - 1;
  }
  function stop() { clearInterval(timer); timer = null; if (!mini) $(".fr-play").textContent = "Play"; }
  function play() {
    if (timer) return stop();
    if (i === frames.length - 1) i = 0;
    if (!mini) $(".fr-play").textContent = "Pause";
    timer = setInterval(() => {
      if (i < frames.length - 1) { i++; render(); } else if (mini) { i = 0; render(); } else stop();
    }, opts.interval || (mini ? 1100 : 900));
  }
  function rebuild() { stop(); frames = opts.build(); i = 0; render(); }
  if (!mini) {
    $(".fr-reset").onclick = () => { stop(); i = 0; render(); };
    $(".fr-back").onclick = () => { stop(); if (i > 0) i--; render(); };
    $(".fr-step").onclick = () => { stop(); if (i < frames.length - 1) i++; render(); };
    $(".fr-play").onclick = play;
    el.tabIndex = 0;
    el.addEventListener("keydown", (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "SELECT") return;
      if (e.key === "ArrowRight") { e.preventDefault(); $(".fr-step").click(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); $(".fr-back").click(); }
    });
  }
  if (opts.onMount) opts.onMount(el, rebuild);
  rebuild();
  if (mini) play();
  return { rebuild };
}

const sup = (x) => `<sup>${x}</sup>`;
const fmt = (x) => (Number.isInteger(x) ? x.toLocaleString("en") : (Math.round(x * 100) / 100).toLocaleString("en"));

// ---------- 1. Big-Oh ----------

const BIGOH = {
  lin: { label: "g(n) = 3n + 5, f(n) = n", g: (n) => 3 * n + 5, f: (n) => n, N: 20, c: 4, n0: 5, cMax: 8, gTxt: "3n + 5", fTxt: "n" },
  quad: { label: "g(n) = 100n, f(n) = n²", g: (n) => 100 * n, f: (n) => n * n, N: 200, c: 1, n0: 100, cMax: 4, gTxt: "100n", fTxt: "n²" },
  bad: { label: "g(n) = n², f(n) = 100n", g: (n) => n * n, f: (n) => 100 * n, N: 400, c: 2, n0: 0, cMax: 4, gTxt: "n²", fTxt: "100n" },
};

function demoBigOh(el, { mini = false } = {}) {
  let key = "lin";
  let c = BIGOH[key].c, n0 = BIGOH[key].n0;
  el.innerHTML = `<div class="svgbox bo-svg"></div>${mini ? "" : `<p class="l6-plotnote bo-note"></p>
    <div class="controls"><select class="bo-k">${Object.entries(BIGOH).map(([k, v]) => `<option value="${k}">${v.label}</option>`).join("")}</select>
    <label>c <input type="range" class="bo-c" min="0.5" step="0.5"> <b class="bo-cv mono"></b></label>
    <label>n₀ <input type="range" class="bo-n0" min="0" step="1"> <b class="bo-nv mono"></b></label></div>`}`;
  const $ = (s) => el.querySelector(s);
  function render() {
    const P = BIGOH[key];
    const W = 640, H = 300, L = 46, B = 30, T = 12, R = 14;
    let ymax = 0;
    for (let n = 0; n <= P.N; n++) ymax = Math.max(ymax, P.g(n), c * P.f(n));
    const x = (n) => L + ((W - L - R) * n) / P.N;
    const y = (v) => H - B - ((H - B - T) * v) / ymax;
    const path = (fn) => Array.from({ length: P.N + 1 }, (_, n) => `${n ? "L" : "M"}${x(n).toFixed(1)},${y(fn(n)).toFixed(1)}`).join("");
    let fail = -1;
    for (let n = n0; n <= P.N; n++) if (P.g(n) > c * P.f(n)) { fail = n; break; }
    let svg = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="g(n) against c times f(n)">`;
    svg += `<rect x="${x(n0)}" y="${T}" width="${x(P.N) - x(n0)}" height="${H - B - T}" fill="var(--teal-soft)" opacity="0.6"/>`;
    svg += `<line x1="${L}" y1="${H - B}" x2="${W - R}" y2="${H - B}" stroke="var(--ink-2)"/><line x1="${L}" y1="${T}" x2="${L}" y2="${H - B}" stroke="var(--ink-2)"/>`;
    for (let k = 0; k <= 4; k++) {
      const n = Math.round((P.N * k) / 4);
      svg += `<text x="${x(n)}" y="${H - 10}" font-size="11" text-anchor="middle" fill="var(--stone)">${n}</text>`;
    }
    svg += `<text x="${L - 6}" y="${T + 10}" font-size="11" text-anchor="end" fill="var(--stone)">${fmt(Math.round(ymax))}</text>`;
    svg += `<path d="${path((n) => c * P.f(n))}" fill="none" stroke="var(--teal)" stroke-width="2.4"/>`;
    svg += `<path d="${path(P.g)}" fill="none" stroke="var(--amber)" stroke-width="2.4"/>`;
    svg += `<line x1="${x(n0)}" y1="${T}" x2="${x(n0)}" y2="${H - B}" stroke="var(--teal)" stroke-dasharray="4 3"/>`;
    svg += `<text x="${x(n0) + 4}" y="${T + 12}" font-size="12" fill="var(--teal)">n₀ = ${n0}</text>`;
    if (fail >= 0) svg += `<circle cx="${x(fail)}" cy="${y(P.g(fail))}" r="5" fill="var(--red)"/>`;
    svg += `<text x="${W - R - 4}" y="${H - B - 8}" font-size="12" text-anchor="end"><tspan fill="var(--amber)">g(n) = ${P.gTxt}</tspan>   <tspan fill="var(--teal)">c·f(n) = ${c}·${P.fTxt}</tspan></text>`;
    svg += "</svg>";
    $(".bo-svg").innerHTML = svg;
    if (mini) return;
    $(".bo-cv").textContent = c;
    $(".bo-nv").textContent = n0;
    $(".bo-note").innerHTML = fail < 0
      ? `For every n from ${n0} to ${P.N} (the part of the axis shown), g(n) ≤ ${c}·f(n). ${key === "bad" ? "But keep going: with any fixed c, n² overtakes c·100n once n > 100c. No pair works for <b>all</b> n ≥ n₀, so n² is <b>not</b> O(100n)." : `So c = ${c}, n₀ = ${n0} is a pair that shows g(n) = O(f(n)).`}`
      : `<span style="color:var(--red)">At n = ${fail}, g(n) = ${fmt(P.g(fail))} &gt; ${c}·f(n) = ${fmt(c * P.f(fail))}.</span> This pair does not work: raise c or n₀.`;
  }
  if (!mini) {
    const setRanges = () => {
      const P = BIGOH[key];
      $(".bo-c").max = P.cMax; $(".bo-c").value = c;
      $(".bo-n0").max = P.N; $(".bo-n0").value = n0;
    };
    $(".bo-k").onchange = (e) => { key = e.target.value; c = BIGOH[key].c; n0 = BIGOH[key].n0; setRanges(); render(); };
    $(".bo-c").oninput = (e) => { c = +e.target.value; render(); };
    $(".bo-n0").oninput = (e) => { n0 = +e.target.value; render(); };
    setRanges();
  }
  render();
}

// ---------- 2. Binary search ----------

const BS_ARRAYS = { a8: [1, 3, 5, 6, 16, 78, 100, 135], a2: [1, 3] };

function traceBinarySearch(arr, key, slide) {
  const t = new Tracer();
  const L = slide
    ? { entry: 2, empty: 0, emptyRet: 0, one: 7, oneRet: (hit) => (hit ? 9 : 11), mid: 14, eq: 15, eqRet: 16, lt: 17, ltCall: 18, gtCall: 20 }
    : { entry: 2, empty: 4, emptyRet: 5, one: 7, oneRet: () => 8, mid: 10, eq: 11, eqRet: 12, lt: 13, ltCall: 14, gtCall: 16 };
  const seen = new Set();
  let calls = 0;
  let crash = null;
  function bs(left, right) {
    calls++;
    const size = Math.max(0, right - left + 1);
    const f = t.push(`${slide ? "search" : "binarySearch"}(arr, ${key}, ${left}, ${right})`, { n: size });
    const ex = { left, right };
    t.snap(L.entry, `Call ${calls}: search <code>arr[${left}..${right}]</code>, a range of <b>${size}</b> element${size === 1 ? "" : "s"}.`, "", ex);
    const sig = `${left},${right}`;
    if (slide && seen.has(sig)) {
      crash = "loop";
      f.status = "calls itself again with the same arguments"; f.cls = "err";
      t.snap(L.entry, `This call has <b>exactly the same arguments</b> as an earlier one, so it will do exactly the same thing again, forever. Java keeps pushing frames until the call stack is full: <b>StackOverflowError</b>.`, "bad", ex);
      return null;
    }
    seen.add(sig);
    if (!slide && left > right) {
      f.status = "returns -1"; f.cls = "ret";
      t.snap(L.emptyRet, `<code>left &gt; right</code>: the range is empty, so the key is not there. Return -1.`, "bad", ex);
      t.pop(); return -1;
    }
    if (left === right) {
      const hit = arr[left] === key;
      f.status = `returns ${hit ? left : -1}`; f.cls = "ret";
      t.snap(L.oneRet(hit), `One element left: <code>arr[${left}] = ${arr[left]}</code> ${hit ? "is" : "is not"} the key. Return ${hit ? left : -1}.`, hit ? "good" : "bad", { ...ex, mid: left, found: hit });
      t.pop(); return hit ? left : -1;
    }
    const middle = slide ? Math.trunc((left + right) / 2) : left + Math.trunc((right - left) / 2);
    f.vars = { n: size, middle };
    if (middle < 0 || middle >= arr.length) {
      crash = "index";
      f.status = "ArrayIndexOutOfBoundsException"; f.cls = "err";
      t.snap(L.mid, `<code>middle = ${middle}</code> is outside the array: <b>ArrayIndexOutOfBoundsException</b>.`, "bad", ex);
      return null;
    }
    t.snap(L.mid, `<code>middle = ${middle}</code>${left > right ? ` — even though the range is empty (left &gt; right)` : ""}, and <code>arr[${middle}] = ${arr[middle]}</code>.`, left > right ? "bad" : "", { ...ex, mid: middle });
    if (arr[middle] === key) {
      f.status = `returns ${middle}`; f.cls = "ret";
      t.snap(L.eqRet, `Found ${key} at index ${middle}.`, "good", { ...ex, mid: middle, found: true });
      t.pop(); return middle;
    }
    const goRight = arr[middle] < key;
    const nl = goRight ? middle + 1 : left, nr = goRight ? right : middle - 1;
    f.status = `waiting for the call on ${nl}..${nr}`;
    t.snap(goRight ? L.ltCall : L.gtCall, `${arr[middle]} ${goRight ? "&lt;" : "&gt;"} ${key}: only the ${goRight ? "right" : "left"} part, <code>${nl}..${nr}</code> (${Math.max(0, nr - nl + 1)} element${nr - nl + 1 === 1 ? "" : "s"}), can hold the key. One recursive call on it — the <b>T(n/2)</b> in the recurrence.`, "", { ...ex, mid: middle });
    const r = bs(nl, nr);
    if (r === null) return null;
    f.status = `returns ${r}`; f.cls = "ret";
    t.snap(goRight ? L.ltCall : L.gtCall, `The answer, ${r}, is passed straight back up.`, r >= 0 ? "good" : "", ex);
    t.pop(); return r;
  }
  const r = bs(0, arr.length - 1);
  if (r !== null) {
    t.snap(0, `Result: <b>${r}</b> after <b>${calls}</b> call${calls > 1 ? "s" : ""}. Each call did a constant amount of work <i>a</i>; the range shrank to half each time. Worst case for n = ${arr.length}: ⌊log₂ ${arr.length}⌋ + 1 = ${Math.floor(Math.log2(arr.length)) + 1} calls.`, "good", null);
  }
  return t.snaps;
}

function demoBinarySearch(el, { mini = false } = {}) {
  let arrKey = "a8", key = mini ? 135 : 100, slide = false;
  makeStepper(el, {
    mini,
    code: () => (slide ? CODE.slideSearch : CODE.binarySearch),
    build: () => traceBinarySearch(BS_ARRAYS[arrKey], key, slide),
    renderExtra: (s) => {
      const arr = BS_ARRAYS[arrKey], e = s.extra;
      if (!e) return l6Cells(arr);
      return l6Cells(arr, {
        cls: (k) => (k === e.mid ? (e.found ? "found" : "mid") : k < e.left || k > e.right ? "out" : ""),
        ptr: (k) => [k === e.left ? "left" : "", k === e.mid ? `<span class="m">mid</span>` : "", k === e.right ? "right" : ""].filter(Boolean).join(" "),
      });
    },
    extraControls: `<label>key <input type="number" class="bs-k" value="${key}"></label>
      <select class="bs-a"><option value="a8">arr = 1 3 5 6 16 78 100 135</option><option value="a2">arr = 1 3</option></select>
      <label><input type="checkbox" class="bs-s"> slide's version</label>`,
    onMount(root, rebuild) {
      if (mini) return;
      root.querySelector(".bs-k").onchange = (e) => { key = Math.trunc(+e.target.value || 0); rebuild(); };
      root.querySelector(".bs-a").onchange = (e) => { arrKey = e.target.value; rebuild(); };
      root.querySelector(".bs-s").onchange = (e) => {
        slide = e.target.checked;
        if (slide) { arrKey = "a2"; key = 0; root.querySelector(".bs-a").value = "a2"; root.querySelector(".bs-k").value = 0; }
        rebuild();
      };
    },
  });
}

// ---------- 3. Unrolling recurrences ----------

const UNROLL = {
  bs: { label: "T(n) = T(n/2) + a  (binary search)", sizes: [2, 4, 8, 16, 32, 64, 1024], def: 16 },
  sel: { label: "T(n) ≤ T(n−1) + c·n  (selection sort)", sizes: [2, 3, 4, 5, 6, 7, 8], def: 6 },
  max1: { label: "T(n) ≤ T(n−1) + c  (maxInArray1)", sizes: [2, 3, 4, 5, 6, 7, 8], def: 6 },
  max2: { label: "T(n) ≤ 2T(n/2) + c  (maxInArray2)", sizes: [2, 4, 8, 16, 32, 64], def: 8 },
};

function unrollLines(kind, n) {
  // Each line: [math html, explanation].
  const out = [];
  const T = (x) => `T(${x})`;
  if (kind === "bs") {
    const x = Math.log2(n);
    out.push([`${T(n)} = ${T(n / 2)} + a`, `Write down the recurrence for n = ${n}.`]);
    for (let k = 2; k <= x; k++) out.push([`= ${T(n / 2 ** k)} + ${k}a`, `Replace ${T(n / 2 ** (k - 1))} by ${T(n / 2 ** k)} + a. One more <i>a</i> each time.`]);
    out.push([`= ${x}a + b`, `${T(1)} = b. After x = log₂ ${n} = ${x} halvings the range has one element.`]);
    out.push([`T(n) = a·log₂ n + b = O(log n)`, `In general: log₂ n terms <i>a</i>, plus <i>b</i>.`]);
  } else if (kind === "sel" || kind === "max1") {
    const lin = kind === "sel";
    const term = (k) => (lin ? `${k}c` : "c");
    out.push([`${T(n)} ≤ ${T(n - 1)} + ${term(n)}`, `Write down the recurrence for n = ${n}.`]);
    const acc = [term(n)];
    for (let m = n - 1; m >= 2; m--) {
      acc.unshift(term(m));
      out.push([`≤ ${T(m - 1)} + ${acc.join(" + ")}`, `Replace ${T(m)} by ${T(m - 1)} + ${term(m)}.`]);
    }
    if (lin) {
      const s = (n * (n + 1)) / 2 - 1;
      out.push([`= b + ${s}c`, `${T(1)} = b, and 2 + 3 + … + ${n} = ${s}.`]);
      out.push([`T(n) ≤ c·n(n+1)/2 + b = O(n${sup(2)})`, `${n} levels, the k-th costing about c·k: a triangle, n²/2.`]);
    } else {
      out.push([`= b + ${n - 1}c`, `${T(1)} = b, plus ${n - 1} copies of c.`]);
      out.push([`T(n) ≤ c·n + b = O(n)`, `Constant work per call, n calls.`]);
    }
  } else {
    const x = Math.log2(n);
    out.push([`${T(n)} ≤ 2${T(n / 2)} + c`, `Write down the recurrence for n = ${n}.`]);
    const cs = ["c"];
    for (let k = 2; k <= x; k++) {
      cs.push(`${2 ** (k - 1)}c`);
      out.push([`≤ ${2 ** k}${T(n / 2 ** k)} + ${cs.join(" + ")}`, `Replace each ${T(n / 2 ** (k - 1))} by 2${T(n / 2 ** k)} + c. There are ${2 ** (k - 1)} of them, so this adds ${2 ** (k - 1)}c.`]);
    }
    out.push([`= ${n}b + ${n - 1}c`, `${T(1)} = b, and 1 + 2 + … + ${n / 2} = ${n - 1}.`]);
    out.push([`T(n) ≤ bn + cn − c = O(n)`, `The leaves (n of them) dominate.`]);
  }
  return out;
}

function demoUnroll(el) {
  let kind = "bs", n = UNROLL.bs.def;
  makeFrames(el, {
    build: () => {
      const lines = unrollLines(kind, n);
      return lines.map((_, k) => ({
        html: `<div class="l6-algebra">${lines.map(([m], j) => `<div class="${j === k ? "cur" : j < k ? "done" : ""}"${j > k ? ' style="visibility:hidden"' : ""}>${m}</div>`).join("")}</div>`,
        msg: lines[k][1],
        msgCls: k === lines.length - 1 ? "good" : "",
      }));
    },
    extraControls: `<select class="ur-k">${Object.entries(UNROLL).map(([k, v]) => `<option value="${k}">${v.label}</option>`).join("")}</select>
      <label>n <select class="ur-n"></select></label>`,
    onMount(root, rebuild) {
      const fillSizes = () => {
        root.querySelector(".ur-n").innerHTML = UNROLL[kind].sizes.map((s) => `<option${s === n ? " selected" : ""}>${s}</option>`).join("");
      };
      root.querySelector(".ur-k").onchange = (e) => { kind = e.target.value; n = UNROLL[kind].def; fillSizes(); rebuild(); };
      root.querySelector(".ur-n").onchange = (e) => { n = +e.target.value; rebuild(); };
      fillSizes();
    },
  });
}

// ---------- 4. Selection sort ----------

function demoSelectionSort(el, { mini = false } = {}) {
  let data = [4, 2, 3, 6, 9, 5];
  makeStepper(el, {
    mini,
    code: CODE.selectionSort,
    build: () => traceSelectionSort(data.slice()),
    renderExtra: (s) => {
      const e = s.extra || {};
      const arr = e.arr || data;
      return l6Cells(arr, {
        cls: (k) => (e.done || k >= e.n ? "sorted" : k === e.i ? "cur" : k === e.maxIndex ? "mid" : k === e.placed ? "sorted" : ""),
        ptr: (k) => [k === e.i ? "i" : "", k === e.maxIndex ? `<span class="m">max</span>` : ""].filter(Boolean).join(" "),
      }) + (mini ? "" : `<div class="l6-legend"><span><i style="background:var(--mark)"></i>current maximum</span><span><i style="box-shadow:0 0 0 2px var(--amber) inset"></i>arr[i]</span><span><i style="background:var(--green-soft)"></i>in its final place</span></div>`);
    },
    extraControls: `<label>arr <input type="text" class="ss-d" value="4, 2, 3, 6, 9, 5" style="width:150px"></label>`,
    onMount(root, rebuild) {
      if (mini) return;
      root.querySelector(".ss-d").onchange = (e) => { data = parseNums(e.target.value, [4, 2, 3, 6, 9, 5]).slice(0, 8); e.target.value = data.join(", "); rebuild(); };
    },
  });
}

// Replays selectionSort on arr (a copy); every snapshot also records the array as it is then.
function traceSelectionSort(arr) {
  const t = new Tracer();
  const snap = t.snap.bind(t);
  t.snap = (line, msg, cls, extra) => snap(line, msg, cls, { ...extra, arr: arr.slice() });
  let comparisons = 0;
  const total = arr.length;
  function ss(n) {
    const f = t.push(`selectionSort(arr, ${n})`, { n });
    t.snap(2, `New call: sort the first <b>${n}</b> element${n === 1 ? "" : "s"}.`, "", { n });
    if (n <= 1) {
      f.status = "returns (base case)"; f.cls = "ret";
      t.snap(4, `n = ${n} ≤ 1: nothing left to do.`, "good", { n });
      t.pop(); return;
    }
    let maxNum = arr[0], maxIndex = 0;
    f.vars = { n, maxNum, maxIndex };
    t.snap(7, `Start the scan: <code>maxNum = arr[0] = ${maxNum}</code>, <code>maxIndex = 0</code>.`, "", { n, maxIndex });
    for (let i = 1; i <= n - 1; i++) {
      comparisons++;
      const bigger = maxNum < arr[i];
      f.vars = { n, i, maxNum, maxIndex };
      t.snap(10, `Is <code>maxNum = ${maxNum} &lt; arr[${i}] = ${arr[i]}</code>? ${bigger ? "Yes: a new maximum." : "No."} (comparisons so far: ${comparisons})`, "", { n, maxIndex, i });
      if (bigger) {
        maxNum = arr[i]; maxIndex = i;
        f.vars = { n, i, maxNum, maxIndex };
        t.snap(12, `<code>maxNum = ${maxNum}</code>, <code>maxIndex = ${maxIndex}</code>.`, "", { n, maxIndex, i });
      }
    }
    arr[maxIndex] = arr[n - 1];
    arr[n - 1] = maxNum;
    f.vars = { n, maxNum, maxIndex };
    t.snap(16, `Swap: the largest, ${maxNum}, goes to index ${n - 1}, its final place. This call's scan made ${n - 1} comparisons — the <b>O(n)</b> part of the recurrence.`, "good", { n: n - 1 });
    f.status = `waiting for selectionSort(arr, ${n - 1})`;
    t.snap(17, `What is left is a smaller problem: sort the first ${n - 1}. That costs <b>T(n − 1)</b>.`, "", { n: n - 1 });
    ss(n - 1);
    f.status = "returns"; f.cls = "ret";
    t.snap(17, `<code>selectionSort(arr, ${n})</code> returns.`, "", { n: 0 });
    t.pop();
  }
  ss(total);
  t.snap(0, `Sorted: [${arr.join(", ")}] with <b>${comparisons}</b> comparisons = ${total}·${total - 1}/2. In general T(n) = T(n−1) + O(n) = O(n²).`, "good", { n: 0 });
  return t.snaps;
}

// ---------- 5. maxInArray2: a recursion tree ----------

function buildMaxTree(data) {
  let id = 0;
  const events = [];
  function mx(l, r) {
    const node = { id: id++, label: l === r ? `[${l}]` : `[${l}..${r}]`, kids: [] };
    events.push({ type: "enter", id: node.id, line: 2 });
    let v;
    if (l === r) {
      v = data[l];
      events.push({ type: "out", text: `maxInArray2(arr, ${l}, ${r}) returns arr[${l}] = ${v}`, line: 5 });
    } else {
      const m = Math.floor((l + r) / 2);
      const a = mx(l, m); node.kids.push(a.node);
      const b = mx(m + 1, r); node.kids.push(b.node);
      v = Math.max(a.v, b.v);
      events.push({ type: "out", text: `maxInArray2(arr, ${l}, ${r}) returns max(${a.v}, ${b.v}) = ${v}`, line: 10 });
    }
    events.push({ type: "exit", id: node.id, value: v });
    return { node, v };
  }
  return { root: mx(0, data.length - 1).node, events };
}

function demoMaxTree(el, { mini = false } = {}) {
  let data = [4, 2, 3, 6, 9, 5, 8, 1];
  makeTreePlayer(el, {
    mini, width: mini ? 420 : 720, rowH: mini ? 52 : 62, nodeW: mini ? 44 : 64, fontSize: mini ? 11 : 0,
    code: CODE.maxInArray2,
    outLabel: "return values, in the order they happen",
    build: () => {
      const r = buildMaxTree(data);
      if (mini) (function walk(n) { n.label = n.label.replace(/\[|\]/g, ""); n.kids.forEach(walk); })(r.root);
      return r;
    },
    stats: (s) => [["calls so far", s.calls], ["stack depth", s.stack.length], ["total calls", `${2 * data.length - 1} = 2n − 1`], ["levels", Math.ceil(Math.log2(data.length)) + 1]],
    extraControls: `<label>arr <input type="text" class="mt-d" value="${data.join(", ")}" style="width:170px"></label>`,
    onMount(root, rebuild) {
      if (mini) return;
      root.querySelector(".mt-d").onchange = (e) => { data = parseNums(e.target.value, [4, 2, 3, 6, 9, 5, 8, 1]).slice(0, 12); e.target.value = data.join(", "); rebuild(); };
    },
  });
}

// ---------- 6. Recursion tree level by level (master theorem) ----------

const MASTER_PRESETS = {
  bs: { label: "T(n) = T(n/2) + 1 · binary search", a: 1, b: 2, d: 0, K: 5 },
  max2: { label: "T(n) = 2T(n/2) + 1 · maxInArray2", a: 2, b: 2, d: 0, K: 4 },
  merge: { label: "T(n) = 2T(n/2) + n · merge sort, max subarray", a: 2, b: 2, d: 1, K: 4 },
  half: { label: "T(n) = T(n/2) + n", a: 1, b: 2, d: 1, K: 5 },
  eight: { label: "T(n) = 8T(n/2) + n²", a: 8, b: 2, d: 2, K: 3 },
  four: { label: "T(n) = 4T(n/2) + n", a: 4, b: 2, d: 1, K: 3 },
  sqrt: { label: "T(n) = 2T(n/4) + √n", a: 2, b: 4, d: 0.5, K: 3 },
  three: { label: "T(n) = 3T(n/3) + n²", a: 3, b: 3, d: 2, K: 3 },
};

const dTxt = (d) => (d === 0.5 ? "0.5" : d === 1 / 3 ? "1/3" : String(d));
const nPow = (d) => (d === 0 ? "1" : d === 1 ? "n" : d === 0.5 ? "√n" : `n${sup(dTxt(d))}`);

function masterVerdict(a, b, d) {
  const bd = b ** d;
  const lg = Math.log(a) / Math.log(b);
  const lgTxt = Math.abs(lg - Math.round(lg)) < 1e-9 ? String(Math.round(lg)) : lg.toFixed(3);
  if (Math.abs(a - bd) < 1e-9) return { cs: 1, rel: "a = b<sup>d</sup>", bound: d === 0 ? "O(log n)" : `O(${nPow(d)} log n)`, why: "every level does the same work, and there are log<sub>b</sub> n + 1 levels" };
  if (a < bd) return { cs: 2, rel: "a &lt; b<sup>d</sup>", bound: d === 0 ? "O(1)" : `O(${nPow(d)})`, why: "the work shrinks geometrically from level to level, so the root dominates" };
  return { cs: 3, rel: "a &gt; b<sup>d</sup>", bound: lgTxt === "1" ? "O(n)" : `O(n<sup>${lgTxt}</sup>)`, why: `the work grows geometrically from level to level, so the leaves dominate (there are a<sup>log<sub>b</sub> n</sup> = n<sup>log<sub>b</sub> a</sup> of them)` };
}

function levelSVG(a, b, K, upto, W = 720) {
  const rowH = 46, H = (K + 1) * rowH + 8;
  let svg = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="recursion tree, level by level">`;
  for (let t = 0; t <= K; t++) {
    const cnt = a ** t;
    const y = t * rowH + 24;
    const size = b ** (K - t);
    const shown = t <= upto;
    const op = shown ? 1 : 0.18;
    const fill = t === upto ? "var(--mark)" : "var(--teal-soft)";
    const stroke = t === upto ? "var(--amber)" : "var(--teal)";
    if (cnt <= 32) {
      const slot = (W - 20) / cnt;
      const w = Math.min(64, slot - 3);
      for (let k = 0; k < cnt; k++) {
        const cx = 10 + slot * (k + 0.5);
        if (t > 0) {
          const parent = Math.floor(k / a);
          const pslot = (W - 20) / a ** (t - 1);
          svg += `<line x1="${10 + pslot * (parent + 0.5)}" y1="${y - rowH + 12}" x2="${cx}" y2="${y - 12}" stroke="var(--line)" opacity="${op}"/>`;
        }
        svg += `<g opacity="${op}"><rect x="${cx - w / 2}" y="${y - 12}" width="${w}" height="24" rx="5" fill="${fill}" stroke="${stroke}"/>`;
        if (w >= 18) svg += `<text x="${cx}" y="${y + 4}" text-anchor="middle" font-size="${w >= 34 ? 12 : 9}" fill="var(--ink)">${size}</text>`;
        svg += `</g>`;
      }
    } else {
      svg += `<g opacity="${op}"><rect x="10" y="${y - 12}" width="${W - 20}" height="24" rx="5" fill="${fill}" stroke="${stroke}"/>`;
      svg += `<text x="${W / 2}" y="${y + 4}" text-anchor="middle" font-size="12" fill="var(--ink)">${fmt(cnt)} subproblems of size ${size}</text></g>`;
    }
  }
  return svg + "</svg>";
}

function buildLevels(a, b, d, K, mini) {
  const n = b ** K;
  const rows = [];
  for (let t = 0; t <= K; t++) {
    const cnt = a ** t, size = b ** (K - t), per = size ** d;
    rows.push({ t, cnt, size, per, tot: cnt * per });
  }
  const maxTot = Math.max(...rows.map((r) => r.tot));
  const v = masterVerdict(a, b, d);
  const r = a / b ** d;
  const frames = [];
  for (let upto = 0; upto <= K + 1; upto++) {
    const last = upto === K + 1;
    const cur = Math.min(upto, K);
    let sum = 0;
    rows.forEach((row) => { if (row.t <= cur) sum += row.tot; });
    const table = `<div class="l6-level-table"><table><thead><tr><th>level t</th><th>problems a<sup>t</sup></th><th>size n/b<sup>t</sup></th><th>work each (size)<sup>d</sup></th><th>level total</th><th style="width:34%"></th></tr></thead><tbody>` +
      rows.map((row) => `<tr class="${!last && row.t === cur ? "cur" : row.t > cur ? "future" : ""}"><td>${row.t}</td><td>${fmt(row.cnt)}</td><td>${fmt(row.size)}</td><td>${fmt(row.per)}</td><td><b>${fmt(row.tot)}</b></td>
        <td style="text-align:left"><div style="height:10px;border-radius:4px;background:var(--${row.t > cur ? "line" : "teal"});width:${Math.max(1, (100 * row.tot) / maxTot)}%"></div></td></tr>`).join("") +
      `</tbody></table></div>`;
    const html = (mini ? "" : `<div class="l6-sums"><span>n = ${b}<sup>${K}</sup> = <b>${fmt(n)}</b></span><span>ratio a/b<sup>d</sup> = <b>${fmt(r)}</b></span><span>sum so far = <b>${fmt(sum)}</b></span></div>`) +
      `<div class="svgbox">${levelSVG(a, b, K, last ? K : cur, mini ? 420 : 720)}</div>` + (mini ? "" : table) +
      (last && !mini ? `<div class="l6-verdict">Total ${fmt(sum)}. Case ${v.cs} (${v.rel}): ${v.why}. <b>T(n) = ${v.bound}</b>.</div>` : "");
    const row = rows[cur];
    const msg = last
      ? `All ${K + 1} levels added: T(${fmt(n)}) = ${fmt(sum)}. Each level is the one above times a/b<sup>d</sup> = ${fmt(r)}.`
      : `Level ${cur}: ${fmt(row.cnt)} subproblem${row.cnt > 1 ? "s" : ""} of size ${fmt(row.size)}, each doing ${fmt(row.size)}<sup>${dTxt(d)}</sup> = ${fmt(row.per)}: level total <b>${fmt(row.tot)}</b>.` +
        (cur > 0 ? ` That is ${fmt(r)} × the level above.` : "");
    frames.push({ html, msg, msgCls: last ? "good" : "" });
  }
  return frames;
}

function demoLevels(el, { mini = false } = {}) {
  let P = { ...MASTER_PRESETS[mini ? "merge" : "merge"] };
  makeFrames(el, {
    mini,
    interval: mini ? 1000 : 1100,
    build: () => buildLevels(P.a, P.b, P.d, P.K, mini),
    extraControls: `<select class="lv-p">${Object.entries(MASTER_PRESETS).map(([k, v]) => `<option value="${k}"${k === "merge" ? " selected" : ""}>${v.label}</option>`).join("")}</select>
      <label>levels log<sub>b</sub> n <input type="range" class="lv-k" min="1" max="6" value="${P.K}"> <b class="lv-kv mono">${P.K}</b></label>`,
    onMount(root, rebuild) {
      if (mini) return;
      const kIn = root.querySelector(".lv-k");
      const maxK = () => Math.max(1, Math.min(6, Math.floor(Math.log(4096) / Math.log(P.a > 1 ? P.a : 2)), Math.floor(Math.log(65536) / Math.log(P.b))));
      root.querySelector(".lv-p").onchange = (e) => {
        P = { ...MASTER_PRESETS[e.target.value] };
        kIn.max = maxK(); kIn.value = P.K; root.querySelector(".lv-kv").textContent = P.K; rebuild();
      };
      kIn.oninput = (e) => { P.K = +e.target.value; root.querySelector(".lv-kv").textContent = P.K; rebuild(); };
      kIn.max = maxK();
    },
  });
}

function demoMaster(el) {
  el.innerHTML = `<div class="l6-master">
    <div class="controls" style="margin-top:0">
      <label>a <input type="number" class="ms-a" value="8" min="1" step="1"></label>
      <label>b <input type="number" class="ms-b" value="2" min="1" step="1"></label>
      <label>d <input type="number" class="ms-d" value="2" min="0" step="0.5"></label>
    </div>
    <div class="ms-out"></div></div>`;
  const $ = (s) => el.querySelector(s);
  function render() {
    const a = +$(".ms-a").value, b = +$(".ms-b").value, d = +$(".ms-d").value;
    if (!(a >= 1) || !(b > 1) || !(d >= 0)) {
      $(".ms-out").innerHTML = `<div class="l6-verdict bad">The theorem needs a ≥ 1, b &gt; 1 and d ≥ 0.</div>`;
      return;
    }
    const v = masterVerdict(a, b, d);
    const bd = b ** d;
    const lg = Math.log(a) / Math.log(b);
    $(".ms-out").innerHTML = `<div class="math-block">T(n) ≤ ${a === 1 ? "" : a}T(n/${b}) + O(${nPow(d)})</div>
      <div class="l6-sums"><span>a = <b>${a}</b></span><span>b<sup>d</sup> = ${b}<sup>${fmt(d)}</sup> = <b>${fmt(bd)}</b></span><span>log<sub>b</sub> a = <b>${fmt(lg)}</b> vs d = <b>${fmt(d)}</b></span></div>
      <div class="l6-verdict">Case ${v.cs}: ${v.rel}, so <b>T(n) = ${v.bound}</b> — ${v.why}.</div>`;
  }
  el.querySelectorAll("input").forEach((i) => { i.oninput = render; });
  render();
}

// ---------- 7. Maximum subarray ----------

const MSS_DEFAULT = [-3, 7, -9, 17, -5, 28, -21, 18, -6, 4];

function traceCross(a) {
  const i = 0, j = a.length - 1, k = Math.floor((i + j) / 2);
  const t = new Tracer();
  const f = t.push(`maxCrossSubarray(a, ${i}, ${k}, ${j})`, {});
  const ex = (o) => ({ k, ...o });
  t.snap(2, `The middle is k = ${k}. A crossing subarray must contain both a[${k}] and a[${k + 1}].`, "", ex({}));
  let leftSum = -Infinity, sum = 0, maxLeft = k;
  f.vars = { leftSum: "−∞", sum };
  t.snap(5, `Walk <b>left</b> from k, keeping a running sum and the best one.`, "", ex({}));
  for (let p = k; p >= i; p--) {
    sum += a[p];
    f.vars = { p, sum, leftSum: leftSum === -Infinity ? "−∞" : leftSum, maxLeft };
    t.snap(7, `p = ${p}: sum of a[${p}..${k}] = <b>${sum}</b>.`, "", ex({ p, maxLeft, scanL: p }));
    if (sum > leftSum) {
      leftSum = sum; maxLeft = p;
      f.vars = { p, sum, leftSum, maxLeft };
      t.snap(10, `${sum} is the best so far: leftSum = ${leftSum}, maxLeft = ${maxLeft}.`, "", ex({ p, maxLeft, scanL: p }));
    }
  }
  let rightSum = -Infinity, maxRight = k + 1;
  sum = 0;
  f.vars = { leftSum, maxLeft, rightSum: "−∞", sum };
  t.snap(15, `Best left part: a[${maxLeft}..${k}], sum ${leftSum}. Now walk <b>right</b> from k + 1.`, "", ex({ maxLeft, leftDone: true }));
  for (let q = k + 1; q <= j; q++) {
    sum += a[q];
    f.vars = { leftSum, maxLeft, q, sum, rightSum: rightSum === -Infinity ? "−∞" : rightSum, maxRight };
    t.snap(17, `q = ${q}: sum of a[${k + 1}..${q}] = <b>${sum}</b>.`, "", ex({ maxLeft, leftDone: true, q, maxRight, scanR: q }));
    if (sum > rightSum) {
      rightSum = sum; maxRight = q;
      f.vars = { leftSum, maxLeft, q, sum, rightSum, maxRight };
      t.snap(20, `${sum} is the best so far: rightSum = ${rightSum}, maxRight = ${maxRight}.`, "", ex({ maxLeft, leftDone: true, q, maxRight, scanR: q }));
    }
  }
  f.status = `returns (${maxLeft}, ${maxRight}, ${leftSum + rightSum})`; f.cls = "ret";
  t.snap(23, `Best crossing subarray: a[${maxLeft}..${maxRight}] with sum ${leftSum} + ${rightSum} = <b>${leftSum + rightSum}</b>. ${a.length} steps in all: Θ(n).`, "good", ex({ maxLeft, maxRight, done: true }));
  return t.snaps;
}

function demoCross(el) {
  let data = MSS_DEFAULT.slice();
  makeStepper(el, {
    code: CODE.maxCross,
    stackLabel: "variables",
    build: () => traceCross(data),
    renderExtra: (s) => {
      const e = s.extra;
      if (!e) return l6Cells(data);
      return l6Cells(data, {
        split: e.k + 1,
        cls: (x) => {
          if (e.done) return x >= e.maxLeft && x <= e.maxRight ? "found" : "out";
          if (e.scanL !== undefined) return x === e.maxLeft ? "pick" : x >= e.scanL && x <= e.k ? "mid" : "";
          if (e.leftDone) {
            if (x >= e.maxLeft && x <= e.k) return "pick";
            if (e.scanR !== undefined) return x === e.maxRight ? "pick" : x > e.k && x <= e.scanR ? "mid" : "";
          }
          return "";
        },
        ptr: (x) => [x === e.k ? "k" : "", x === e.scanL ? "p" : "", x === e.scanR ? "q" : ""].filter(Boolean).join(" "),
      }) + `<div class="l6-legend"><span><i style="background:var(--mark)"></i>in the running sum</span><span><i style="background:var(--teal-soft)"></i>best end so far / best part</span><span><i style="border-left:2px dashed var(--red)"></i>the middle</span></div>`;
    },
    extraControls: `<label>a <input type="text" class="cr-d" value="${data.join(", ")}" style="width:220px"></label>`,
    onMount(root, rebuild) {
      root.querySelector(".cr-d").onchange = (e) => {
        data = parseNums(e.target.value, MSS_DEFAULT).slice(0, 12);
        if (data.length < 2) data = MSS_DEFAULT.slice();
        e.target.value = data.join(", "); rebuild();
      };
    },
  });
}

function mssCross(a, i, k, j) {
  let leftSum = -Infinity, sum = 0, maxLeft = k;
  for (let p = k; p >= i; p--) { sum += a[p]; if (sum > leftSum) { leftSum = sum; maxLeft = p; } }
  let rightSum = -Infinity, maxRight = k + 1;
  sum = 0;
  for (let q = k + 1; q <= j; q++) { sum += a[q]; if (sum > rightSum) { rightSum = sum; maxRight = q; } }
  return { low: maxLeft, high: maxRight, sum: leftSum + rightSum };
}

function buildMssTree(a, short = false) {
  let id = 0;
  const events = [];
  const show = (r) => (short ? String(r.sum) : `${r.low}..${r.high}: ${r.sum}`);
  function ms(i, j) {
    const node = { id: id++, label: i === j ? `[${i}]` : `[${i}..${j}]`, kids: [] };
    events.push({ type: "enter", id: node.id, line: 2 });
    let r;
    if (i === j) {
      r = { low: i, high: j, sum: a[i] };
      events.push({ type: "out", text: `maxSubarray(a, ${i}, ${j}): one element, a[${i}] = ${a[i]}`, line: 4 });
    } else {
      const k = Math.floor((i + j) / 2);
      const L = ms(i, k); node.kids.push(L.node);
      const R = ms(k + 1, j); node.kids.push(R.node);
      const C = mssCross(a, i, k, j);
      let which;
      if (L.r.sum >= R.r.sum && L.r.sum >= C.sum) { r = L.r; which = "case 1 (left)"; }
      else if (R.r.sum >= L.r.sum && R.r.sum >= C.sum) { r = R.r; which = "case 2 (right)"; }
      else { r = C; which = "case 3 (crossing)"; }
      events.push({ type: "out", text: `maxSubarray(a, ${i}, ${j}): left ${L.r.sum}, right ${R.r.sum}, cross ${C.sum} → ${which}: a[${r.low}..${r.high}], sum ${r.sum}`, line: r === L.r ? 11 : r === R.r ? 13 : 15 });
    }
    events.push({ type: "exit", id: node.id, value: show(r) });
    return { node, r };
  }
  return { root: ms(0, a.length - 1).node, events };
}

function demoMssTree(el, { mini = false } = {}) {
  let data = mini ? [-3, 7, -9, 17, -5, 28, -21, 18] : MSS_DEFAULT.slice();
  makeTreePlayer(el, {
    mini, width: mini ? 440 : 760, rowH: mini ? 54 : 64, nodeW: mini ? 48 : 66, fontSize: mini ? 10 : 11,
    code: CODE.maxSubarray,
    outLabel: "results, in the order the calls return",
    build: () => {
      const r = buildMssTree(data, mini);
      if (mini) (function walk(n) { n.label = n.label.replace(/\[|\]/g, ""); n.kids.forEach(walk); })(r.root);
      return r;
    },
    stats: (s) => [["calls so far", s.calls], ["stack depth", s.stack.length], ["total calls", 2 * data.length - 1], ["levels", Math.ceil(Math.log2(data.length)) + 1]],
    extraControls: `<label>a <input type="text" class="mst-d" value="${data.join(", ")}" style="width:220px"></label>`,
    onMount(root, rebuild) {
      if (mini) return;
      root.querySelector(".mst-d").onchange = (e) => { data = parseNums(e.target.value, MSS_DEFAULT).slice(0, 12); e.target.value = data.join(", "); rebuild(); };
    },
  });
}

// Additions done by divide and conquer, counted like MaxSubarrayCount: n per range of size n > 1.
const dcMemo = new Map([[1, 0]]);
function dcOps(n) {
  if (dcMemo.has(n)) return dcMemo.get(n);
  const v = n + dcOps(Math.ceil(n / 2)) + dcOps(Math.floor(n / 2));
  dcMemo.set(n, v);
  return v;
}

function demoRace(el) {
  el.innerHTML = `<div class="controls" style="margin-top:0"><label>array size n = <b class="rc-v mono"></b></label>
    <input type="range" class="rc-n" min="1" max="5" step="0.01" value="3" style="width:240px"></div>
    <div class="bars rc-bars"></div><p class="hint rc-hint"></p>`;
  const $ = (q) => el.querySelector(q);
  function render() {
    const n = Math.round(10 ** +$(".rc-n").value);
    const brute = (n * (n + 1) * (n + 2)) / 6, prefix = n + (n * (n + 1)) / 2, dc = dcOps(n);
    $(".rc-v").textContent = n.toLocaleString("en");
    const lmax = Math.log10(brute + 1);
    $(".rc-bars").innerHTML = [["brute force O(n³)", brute, "red"], ["prefix sums O(n²)", prefix, "amber"], ["divide & conquer O(n log n)", dc, ""]]
      .map(([k, v, c]) => `<div class="bar"><span>${k}</span><div class="track"><div class="fill ${c}" style="width:${Math.max(0.6, (100 * Math.log10(v + 1)) / lmax)}%"></div></div><span class="v">${fmt(v)}</span></div>`).join("");
    $(".rc-hint").innerHTML = `Additions for n = ${n.toLocaleString("en")} (bars on a <b>log scale</b>). At a billion additions per second: brute force ${secs(brute)}, prefix sums ${secs(prefix)}, divide and conquer ${secs(dc)}.`;
  }
  const secs = (v) => (v < 1e6 ? "under a millisecond" : v < 1e9 ? `${(v / 1e6).toFixed(0)} ms` : v < 6e10 ? `${(v / 1e9).toFixed(1)} s` : `${(v / 6e10).toFixed(0)} min`);
  $(".rc-n").oninput = render;
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
  bigOh: (el) => demoBigOh(el),
  bigOhMini: (el) => demoBigOh(el, { mini: true }),
  binarySearch: (el) => demoBinarySearch(el),
  searchMini: (el) => demoBinarySearch(el, { mini: true }),
  unroll: (el) => demoUnroll(el),
  selectionSort: (el) => demoSelectionSort(el),
  selectionMini: (el) => demoSelectionSort(el, { mini: true }),
  maxTree: (el) => demoMaxTree(el),
  maxTreeMini: (el) => demoMaxTree(el, { mini: true }),
  levels: (el) => demoLevels(el),
  levelsMini: (el) => demoLevels(el, { mini: true }),
  master: (el) => demoMaster(el),
  cross: (el) => demoCross(el),
  mssTree: (el) => demoMssTree(el),
  mssMini: (el) => demoMssTree(el, { mini: true }),
  race: (el) => demoRace(el),
  quiz: (el) => demoQuiz(el, QUIZ),
};
