// Interactive demos for Lecture 3. CODE and OUT are copied verbatim from
// notes/L03-arrays.md (checked by tools/check.py); the JS twins below replay the Java.

const CODE = {
  linearSearch: "public class LinearSearch {\n    // Return the first index i with a[i] == searchNum, or -1 if there is none.\n    static int search(int[] a, int searchNum) {\n        for (int i = 0; i < a.length; i++) {\n            if (a[i] == searchNum) {\n                return i;\n            }\n        }\n        return -1;\n    }\n}",
  vectorOps: "public class VectorOps {\n    // Element-wise product: result[i] = a1[i] * a2[i].\n    static int[] multiplyArrays(int[] a1, int[] a2) {\n        if (a1.length != a2.length) {\n            throw new IllegalArgumentException(\"Arrays must have the same length\");\n        }\n        int[] a3 = new int[a1.length];               // createArray(n)\n        for (int i = 0; i < a1.length; i++) {\n            a3[i] = a1[i] * a2[i];                   // retrieve, multiply, store\n        }\n        return a3;\n    }\n}",
  dimensionProduct: "import java.util.Arrays;\n\npublic class DimensionProduct {\n    public static void main(String[] args) {\n        int[] a1 = {1, 2, 3};\n        int[] a2 = {4, 5, 6};\n        int[] a3 = VectorOps.multiplyArrays(a1, a2);\n        System.out.println(Arrays.toString(a3));\n        try {\n            VectorOps.multiplyArrays(a1, new int[] {1, 2});\n        } catch (IllegalArgumentException e) {\n            System.out.println(\"Error: \" + e.getMessage());\n        }\n    }\n}",
  judgeScores: "public class JudgeScores {\n    private static final int N_JUDGES = 5;\n\n    public static void main(String[] args) {\n        double[] scores = new double[N_JUDGES];\n        for (int i = 0; i < scores.length; i++) {\n            scores[i] = 7.0 + 0.5 * i;               // store\n        }\n        int a = 1, b = 4;\n        System.out.println(\"scores[(a + b) / 2] = \" + scores[(a + b) / 2]);\n        for (int i = 0; i < scores.length; i++) {    // cycle by index\n            System.out.println(i + \": \" + scores[i]);\n        }\n        double total = 0;\n        for (double value : scores) {                // cycle by value\n            total += value;\n        }\n        System.out.println(\"total = \" + total);\n    }\n}",
  addressTable: "public class AddressTable {\n    public static void main(String[] args) {\n        int[] arr = {11, 9, 17, 89, 1, 90, 19, 5, 3, 23, 43, 99};\n        int base = 200;           // pretend base address\n        int size = Integer.BYTES; // 4 bytes per int\n        for (int i = 0; i < arr.length; i += 3) {\n            System.out.println(\"arr[\" + i + \"] = \" + arr[i] + \" at address \" + (base + i * size));\n        }\n        System.out.println(\"arr[11] is at \" + (base + 11 * size));\n    }\n}",
  defaultValues: "import java.util.Arrays;\n\npublic class DefaultValues {\n    public static void main(String[] args) {\n        int[] counts = new int[5];\n        double[] prices = new double[3];\n        boolean[] seen = new boolean[2];\n        String[] names = new String[3];\n        System.out.println(Arrays.toString(counts));\n        System.out.println(Arrays.toString(prices));\n        System.out.println(Arrays.toString(seen));\n        System.out.println(Arrays.toString(names));\n        names[0] = \"Ada\";\n        names[1] = \"Alan\";\n        System.out.println(Arrays.toString(names) + \", length \" + names.length);\n    }\n}",
  outOfBounds: "public class OutOfBounds {\n    public static void main(String[] args) {\n        int[] arr = {10, 20, 30, 40, 50};\n        System.out.println(\"last element: \" + arr[arr.length - 1]);\n        System.out.println(\"one past the end: \" + arr[arr.length]);\n    }\n}",
  dynamicArray: "import java.util.ArrayList;\n\npublic class DynamicArray {\n    public static void main(String[] args) {\n        ArrayList<Integer> arr = new ArrayList<>();\n        arr.add(10);\n        arr.add(20);\n        arr.add(30);\n        System.out.println(arr + \" size \" + arr.size());\n        arr.add(1, 15);                  // insert 15 at index 1\n        arr.remove(0);                   // remove the element at index 0\n        System.out.println(arr + \" size \" + arr.size());\n        System.out.println(\"arr.get(2) = \" + arr.get(2));\n    }\n}",
  growableArray: "import java.util.Arrays;\n\npublic class GrowableArray {\n    private int[] data = new int[2];\n    private int size = 0;\n\n    void add(int value) {\n        if (size == data.length) {\n            data = Arrays.copyOf(data, 2 * data.length);   // new array, copy, switch\n            System.out.println(\"  grew to capacity \" + data.length);\n        }\n        data[size++] = value;\n    }\n\n    public static void main(String[] args) {\n        GrowableArray g = new GrowableArray();\n        for (int v = 1; v <= 9; v++) {\n            g.add(v);\n        }\n        System.out.println(Arrays.toString(Arrays.copyOf(g.data, g.size)) + \", capacity \" + g.data.length);\n    }\n}",
  matrix: "import java.util.Arrays;\n\npublic class Matrix {\n    public static void main(String[] args) {\n        int[][] a = {{1, 4}, {2, 5}, {3, 6}};\n        System.out.println(\"rows = \" + a.length + \", columns = \" + a[0].length);\n        for (int i = 0; i < a.length; i++) {\n            for (int j = 0; j < a[i].length; j++) {\n                System.out.print(\"a[\" + i + \"][\" + j + \"] = \" + a[i][j] + \"   \");\n            }\n            System.out.println();\n        }\n        System.out.println(\"a[1] = \" + Arrays.toString(a[1]));\n        System.out.println(Arrays.deepToString(a));\n    }\n}",
  multidimensionalArray: "public class MultidimensionalArray {\n    public static void main(String[] args) {\n        int[][] a = {\n            {1, -2, 3},\n            {-4, -5, 6, 9},\n            {7},\n        };\n        for (int i = 0; i < a.length; ++i) {\n            System.out.println(\"The \" + i + \"th row has \" + a[i].length + \" elements: \");\n            for (int j = 0; j < a[i].length; ++j) {\n                System.out.print(a[i][j] + \", \");\n            }\n            System.out.println();\n        }\n    }\n}",
  triangle: "import java.util.Arrays;\n\npublic class Triangle {\n    public static void main(String[] args) {\n        int[][] t = new int[4][];            // 4 rows, none created yet\n        for (int i = 0; i < t.length; i++) {\n            t[i] = new int[i + 1];           // row i has i + 1 cells\n            t[i][0] = t[i][i] = 1;\n            for (int j = 1; j < i; j++) {\n                t[i][j] = t[i - 1][j - 1] + t[i - 1][j];\n            }\n        }\n        System.out.println(Arrays.deepToString(t));\n    }\n}",
  threeDimensionalArray: "public class ThreeDimensionalArray {\n    public static void main(String[] args) {\n        int[][][] test = {\n            {\n                {1, -2, 3},\n                {2, 3, 4}\n            },\n            {\n                {-4, -5, 6, 9},\n                {1},\n                {2, 3}\n            }\n        };\n        for (int[][] array2D : test) {\n            System.out.println(\"The array2D is: \");\n            for (int[] array1D : array2D) {\n                for (int item : array1D) {\n                    System.out.print(item + \", \");\n                }\n                System.out.println();\n            }\n            System.out.println();\n        }\n    }\n}",
  traversal: "public class Traversal {\n    public static void main(String[] args) {\n        int[] arr = {10, 20, 30, 40, 50};\n        int n = arr.length;\n\n        System.out.print(\"Linear Traversal using for loop: \");\n        for (int i = 0; i < n; i++) {\n            System.out.print(arr[i] + \" \");\n        }\n        System.out.println();\n\n        System.out.print(\"Traversal using while loop: \");\n        int i = 0;\n        while (i < n) {\n            System.out.print(arr[i] + \" \");\n            i++;\n        }\n        System.out.println();\n\n        System.out.print(\"Traversal using foreach loop: \");\n        for (int value : arr) {\n            System.out.print(value + \" \");\n        }\n        System.out.println();\n    }\n}",
  sumAverage: "public class SumAverage {\n    public static void main(String[] args) {\n        int[] numbers = {2, -9, 0, 5, 12, -25, 22, 9, 8, 12};\n        int sum = 0;\n        for (int value : numbers) {\n            sum += value;\n        }\n        double average = (double) sum / numbers.length;\n        System.out.println(\"Sum = \" + sum);\n        System.out.println(\"Average = \" + average);\n    }\n}",
  stringToInt: "import java.util.Arrays;\n\npublic class StringToInt {\n    public static void main(String[] args) {\n        String[] strArray = {\"10\", \"20\", \"30\", \"40\", \"50\"};\n        System.out.println(\"Original String Array:\");\n        for (String val : strArray) {\n            System.out.print(val + \" \");\n        }\n        System.out.println(\"\\nThe integer array obtained from string array:\");\n        int[] intArray = new int[strArray.length];\n        for (int i = 0; i < strArray.length; i++) {\n            intArray[i] = Integer.parseInt(strArray[i]);\n        }\n        System.out.println(Arrays.toString(intArray));\n    }\n}",
  searchAndModify: "import java.util.Arrays;\n\npublic class SearchAndModify {\n    public static void main(String[] args) {\n        int[] arr = {10, 20, 30, 40, 50};\n        int target = 30;\n        boolean found = false;\n        for (int i = 0; i < arr.length; i++) {\n            if (arr[i] == target) {\n                found = true;\n                arr[i] += 5;          // increase the element we found by 5\n                break;                // stop at the first match\n            }\n        }\n        if (found) {\n            System.out.println(\"Element found!\");\n        } else {\n            System.out.println(\"Element not found!\");\n        }\n        System.out.println(Arrays.toString(arr));\n    }\n}",
  insertCopy: "import java.util.Arrays;\n\npublic class InsertCopy {\n    public static void main(String[] args) {\n        int[] arr = {10, 20, 30, 40, 50};\n        int index = 2;\n        int element = 25;\n        int[] newArr = new int[arr.length + 1];\n        for (int i = 0, j = 0; i < newArr.length; i++) {\n            if (i == index) {\n                newArr[i] = element;\n            } else {\n                newArr[i] = arr[j];\n                j++;\n            }\n        }\n        System.out.println(Arrays.toString(newArr));\n    }\n}",
  arrayShift: "public class ArrayShift {\n    // data[0..size-1] holds the elements. Insert value at index; return the new size.\n    static int insertAt(int[] data, int size, int index, int value) {\n        if (size == data.length) {\n            throw new IllegalStateException(\"array is full\");\n        }\n        if (index < 0 || index > size) {\n            throw new IndexOutOfBoundsException(\"index \" + index + \", size \" + size);\n        }\n        for (int k = size; k > index; k--) {\n            data[k] = data[k - 1];          // shift right, starting at the end\n        }\n        data[index] = value;\n        return size + 1;\n    }\n\n    // Delete the element at index; return the new size.\n    static int deleteAt(int[] data, int size, int index) {\n        if (index < 0 || index >= size) {\n            throw new IndexOutOfBoundsException(\"index \" + index + \", size \" + size);\n        }\n        for (int k = index; k < size - 1; k++) {\n            data[k] = data[k + 1];          // shift left, starting after the gap\n        }\n        return size - 1;\n    }\n}",
  shiftDemo: "import java.util.Arrays;\n\npublic class ShiftDemo {\n    static String show(int[] data, int size) {\n        return Arrays.toString(Arrays.copyOf(data, size));\n    }\n\n    public static void main(String[] args) {\n        int[] data = new int[8];\n        int size = 0;\n        for (int v = 10; v <= 50; v += 10) {\n            size = ArrayShift.insertAt(data, size, size, v);   // append\n        }\n        System.out.println(\"start:          \" + show(data, size));\n        size = ArrayShift.insertAt(data, size, 2, 25);\n        System.out.println(\"insert 25 at 2: \" + show(data, size));\n        size = ArrayShift.insertAt(data, size, 0, 5);\n        System.out.println(\"insert 5 at 0:  \" + show(data, size));\n        size = ArrayShift.deleteAt(data, size, 3);\n        System.out.println(\"delete at 3:    \" + show(data, size));\n        size = ArrayShift.deleteAt(data, size, 0);\n        System.out.println(\"delete at 0:    \" + show(data, size));\n        size = ArrayShift.deleteAt(data, size, size - 1);\n        System.out.println(\"delete last:    \" + show(data, size));\n    }\n}",
  deleteCopy: "import java.util.Arrays;\n\npublic class DeleteCopy {\n    public static void main(String[] args) {\n        int[] arr = {10, 20, 30, 40, 50};\n        int index = 2;                              // delete the element at index\n        int[] newArr = new int[arr.length - 1];\n        for (int i = 0, j = 0; i < arr.length; i++) {\n            if (i != index) {\n                newArr[j] = arr[i];\n                j++;\n            }\n        }\n        System.out.println(Arrays.toString(newArr));\n    }\n}",
  linearSearchDemo: "public class LinearSearchDemo {\n    public static void main(String[] args) {\n        int[] arr = {20, 12, 30, 25, 16};\n        int[] targets = {30, 35, 16};\n        for (int target : targets) {\n            System.out.println(\"search(\" + target + \") = \" + LinearSearch.search(arr, target));\n        }\n    }\n}",
  binarySearch: "public class BinarySearch {\n    // arr must be sorted in increasing order. Return an index of target, or -1.\n    static int binarySearch(int[] arr, int target) {\n        int left = 0;\n        int right = arr.length - 1;\n        while (left <= right) {\n            int middle = left + (right - left) / 2;\n            if (arr[middle] == target) {\n                return middle;\n            } else if (arr[middle] < target) {\n                left = middle + 1;          // target is in the right half\n            } else {\n                right = middle - 1;         // target is in the left half\n            }\n        }\n        return -1;                          // range is empty: not found\n    }\n}",
  binarySearchDemo: "public class BinarySearchDemo {\n    public static void main(String[] args) {\n        int[] arr = {10, 20, 30, 40, 50};\n        int target = 30;\n        int index = BinarySearch.binarySearch(arr, target);\n        if (index != -1) {\n            System.out.println(\"Element found at index \" + index);\n        } else {\n            System.out.println(\"Element not found!\");\n        }\n        System.out.println(\"binarySearch(35) = \" + BinarySearch.binarySearch(arr, 35));\n    }\n}",
  binarySearchTrace: "public class BinarySearchTrace {\n    static int binarySearch(int[] arr, int target) {\n        int left = 0;\n        int right = arr.length - 1;\n        while (left <= right) {\n            int middle = left + (right - left) / 2;\n            System.out.println(\"  left = \" + left + \", right = \" + right\n                    + \", middle = \" + middle + \", arr[middle] = \" + arr[middle]);\n            if (arr[middle] == target) {\n                return middle;\n            } else if (arr[middle] < target) {\n                left = middle + 1;\n            } else {\n                right = middle - 1;\n            }\n        }\n        System.out.println(\"  left = \" + left + \" > right = \" + right + \": empty range\");\n        return -1;\n    }\n\n    public static void main(String[] args) {\n        int[] arr = {10, 20, 30, 40, 50};\n        for (int target : new int[] {30, 35, 10}) {\n            System.out.println(\"search for \" + target + \":\");\n            System.out.println(\"  result \" + binarySearch(arr, target));\n        }\n    }\n}",
  midpointOverflow: "public class MidpointOverflow {\n    public static void main(String[] args) {\n        int left = 1_500_000_000;\n        int right = 2_000_000_000;\n        System.out.println(\"(left + right) / 2        = \" + (left + right) / 2);\n        System.out.println(\"left + (right - left) / 2 = \" + (left + (right - left) / 2));\n    }\n}",
  passByValue: "public class PassByValue {\n    public static void main(String[] args) {\n        int i = 5;\n        System.out.println(\"before change, i = \" + i);\n        change(i);\n        System.out.println(\"after change, i = \" + i);\n    }\n\n    static void change(int i) {\n        i = 10;               // changes the parameter, a copy\n    }\n}",
  appendExample: "public class AppendExample {\n    public static void main(String[] args) {\n        StringBuffer s = new StringBuffer(\"Hello \");\n        System.out.println(\"before change, s is \" + s);\n        change(s);\n        System.out.println(\"after change, s is \" + s);\n    }\n\n    static void change(StringBuffer t) {\n        t.append(\"world !\");  // changes the object that both s and t point to\n    }\n}",
  reassignExample: "public class ReassignExample {\n    public static void main(String[] args) {\n        StringBuffer s = new StringBuffer(\"Hello \");\n        System.out.println(\"before change, s is \" + s);\n        change(s);\n        System.out.println(\"after change, s is \" + s);\n    }\n\n    static void change(StringBuffer t) {\n        t = new StringBuffer(\"Hi, \");   // t now points to a new object; s is untouched\n        t.append(\"world !\");\n    }\n}",
  arrayParameter: "import java.util.Arrays;\n\npublic class ArrayParameter {\n    static void zeroFirst(int[] a) {\n        a[0] = 0;\n    }\n\n    static void replace(int[] a) {\n        a = new int[] {0, 0, 0};\n    }\n\n    public static void main(String[] args) {\n        int[] x = {7, 8, 9};\n        zeroFirst(x);\n        replace(x);\n        System.out.println(Arrays.toString(x));\n    }\n}",
  swapElements: "import java.util.Arrays;\n\npublic class SwapElements {\n    // Wrong: a and b are copies of the two values.\n    static void swapWrong(int a, int b) {\n        int tmp = a;\n        a = b;\n        b = tmp;               // only the local copies are swapped\n    }\n\n    // Right: the method gets the array (a reference) and two positions.\n    static void swapElements(int[] a, int p1, int p2) {\n        int tmp = a[p1];\n        a[p1] = a[p2];\n        a[p2] = tmp;\n    }\n\n    public static void main(String[] args) {\n        int[] array = {1, 2, 3, 4, 5};\n        int n = array.length;\n        swapWrong(array[0], array[n - 1]);\n        System.out.println(\"after swapWrong:    \" + Arrays.toString(array));\n        swapElements(array, 0, n - 1);\n        System.out.println(\"after swapElements: \" + Arrays.toString(array));\n        for (int i = 0; i < n / 2; i++) {        // swap i with n - i - 1: reverses the array\n            swapElements(array, i, n - i - 1);\n        }\n        System.out.println(\"after the loop:     \" + Arrays.toString(array));\n    }\n}",
  point: "public class Point {\n    public int x, y;\n\n    public Point(int x, int y) {\n        this.x = x;\n        this.y = y;\n    }\n}",
  swapObjects: "public class SwapObjects {\n    static void swap(Point objA, Point objB) {\n        Point tmp = objA;\n        objA = objB;\n        objB = tmp;\n        System.out.println(\"# objA: x=\" + objA.x + \" y=\" + objA.y);\n        System.out.println(\"# objB: x=\" + objB.x + \" y=\" + objB.y);\n        System.out.println();\n    }\n\n    public static void main(String[] args) {\n        Point obj1 = new Point(1, 2);\n        Point obj2 = new Point(10, 20);\n        swap(obj1, obj2);\n        System.out.println(\"obj1: x=\" + obj1.x + \" y=\" + obj1.y);\n        System.out.println(\"obj2: x=\" + obj2.x + \" y=\" + obj2.y);\n    }\n}",
  swapValues: "public class SwapValues {\n    static void swapValues(Point objA, Point objB) {\n        int tempX = objA.x;\n        int tempY = objA.y;\n        objA.x = objB.x;\n        objA.y = objB.y;\n        objB.x = tempX;\n        objB.y = tempY;\n    }\n\n    public static void main(String[] args) {\n        Point obj1 = new Point(1, 2);\n        Point obj2 = new Point(10, 20);\n        swapValues(obj1, obj2);\n        System.out.println(\"obj1: x=\" + obj1.x + \" y=\" + obj1.y);\n        System.out.println(\"obj2: x=\" + obj2.x + \" y=\" + obj2.y);\n    }\n}",
  alias: "import java.util.Arrays;\n\npublic class Alias {\n    public static void main(String[] args) {\n        int[] a = {1, 2, 3};\n        int[] b = a;                  // same array\n        int[] c = a.clone();          // a new array with the same values\n        b[0] = 99;\n        System.out.println(\"a = \" + Arrays.toString(a));\n        System.out.println(\"b = \" + Arrays.toString(b));\n        System.out.println(\"c = \" + Arrays.toString(c));\n        int[] d = {99, 2, 3};\n        System.out.println(\"a == b: \" + (a == b) + \", a == d: \" + (a == d)\n                + \", Arrays.equals(a, d): \" + Arrays.equals(a, d));\n    }\n}",
  letterFrequency: "public class LetterFrequency {\n    public static void main(String[] args) {\n        char[] letters = {'A', 'B', 'C', 'B', 'A'};\n        int[] frequency = new int[26];\n        for (char letter : letters) {\n            frequency[letter - 'A']++;\n        }\n        for (int i = 0; i < frequency.length; i++) {\n            if (frequency[i] > 0) {\n                char letter = (char) ('A' + i);\n                System.out.println(letter + \": \" + frequency[i]);\n            }\n        }\n    }\n}",
  bigIntArray: "public class BigIntArray {\n    private final int chunkBits;      // each chunk holds 2^chunkBits elements\n    private final int[][] chunks;\n    private final long length;\n\n    public BigIntArray(long length, int chunkBits) {\n        this.length = length;\n        this.chunkBits = chunkBits;\n        long chunkSize = 1L << chunkBits;\n        int count = (int) ((length + chunkSize - 1) / chunkSize);  // round up\n        chunks = new int[count][];\n        for (int c = 0; c < count; c++) {\n            long remaining = length - c * chunkSize;\n            chunks[c] = new int[(int) Math.min(chunkSize, remaining)];\n        }\n    }\n\n    public long length() {\n        return length;\n    }\n\n    public int get(long i) {\n        return chunks[(int) (i >>> chunkBits)][(int) (i & ((1L << chunkBits) - 1))];\n    }\n\n    public void set(long i, int value) {\n        chunks[(int) (i >>> chunkBits)][(int) (i & ((1L << chunkBits) - 1))] = value;\n    }\n\n    public int chunkCount() {\n        return chunks.length;\n    }\n}",
  bigIntArrayDemo: "public class BigIntArrayDemo {\n    public static void main(String[] args) {\n        BigIntArray big = new BigIntArray(10, 2);      // chunks of 4 elements\n        for (long i = 0; i < big.length(); i++) {\n            big.set(i, (int) (i * i));\n        }\n        System.out.println(\"chunks: \" + big.chunkCount());\n        System.out.println(\"element 9 = \" + big.get(9) + \" (chunk \" + (9 >>> 2) + \", offset \" + (9 & 3) + \")\");\n        long n = 5_000_000_000L;\n        System.out.println(n + \" elements in chunks of 2^30 need \" + ((n + (1L << 30) - 1) >>> 30) + \" chunks\");\n    }\n}",
  reverse: "import java.util.Arrays;\n\npublic class Reverse {\n    static void reverse(int[] a) {\n        for (int i = 0, j = a.length - 1; i < j; i++, j--) {\n            int tmp = a[i];\n            a[i] = a[j];\n            a[j] = tmp;\n        }\n    }\n\n    public static void main(String[] args) {\n        int[] a = {1, 2, 3, 4, 5, 6};\n        reverse(a);\n        System.out.println(Arrays.toString(a));\n    }\n}",
  checkSorted: "public class CheckSorted {\n    static boolean isSorted(int[] a) {\n        for (int i = 1; i < a.length; i++) {\n            if (a[i - 1] > a[i]) {\n                return false;\n            }\n        }\n        return true;\n    }\n\n    public static void main(String[] args) {\n        System.out.println(isSorted(new int[] {10, 20, 20, 30}));\n        System.out.println(isSorted(new int[] {10, 30, 20}));\n        System.out.println(isSorted(new int[] {}));\n    }\n}",
  leaders: "import java.util.ArrayList;\nimport java.util.Collections;\n\npublic class Leaders {\n    public static void main(String[] args) {\n        int[] a = {16, 17, 4, 3, 5, 2};\n        ArrayList<Integer> leaders = new ArrayList<>();\n        int maxRight = Integer.MIN_VALUE;\n        for (int i = a.length - 1; i >= 0; i--) {   // scan from the right\n            if (a[i] > maxRight) {\n                leaders.add(a[i]);\n                maxRight = a[i];\n            }\n        }\n        Collections.reverse(leaders);\n        System.out.println(leaders);\n    }\n}",
  removeDuplicates: "import java.util.Arrays;\n\npublic class RemoveDuplicates {\n    static int removeDuplicates(int[] a) {\n        if (a.length == 0) {\n            return 0;\n        }\n        int k = 1;                        // a[0..k-1] holds the distinct values so far\n        for (int i = 1; i < a.length; i++) {\n            if (a[i] != a[k - 1]) {\n                a[k] = a[i];\n                k++;\n            }\n        }\n        return k;\n    }\n\n    public static void main(String[] args) {\n        int[] a = {2, 2, 2, 5, 7, 7, 9};\n        int k = removeDuplicates(a);\n        System.out.println(k + \" \" + Arrays.toString(Arrays.copyOf(a, k)));\n    }\n}",
  zeroesToEnd: "import java.util.Arrays;\n\npublic class ZeroesToEnd {\n    static void zeroesToEnd(int[] a) {\n        int k = 0;                        // next position for a non-zero element\n        for (int value : a) {\n            if (value != 0) {\n                a[k++] = value;\n            }\n        }\n        while (k < a.length) {\n            a[k++] = 0;\n        }\n    }\n\n    public static void main(String[] args) {\n        int[] a = {1, 0, 2, 0, 0, 3, 4};\n        zeroesToEnd(a);\n        System.out.println(Arrays.toString(a));\n    }\n}",
  rotate: "import java.util.Arrays;\n\npublic class Rotate {\n    static void reverse(int[] a, int i, int j) {   // reverse a[i..j]\n        for (; i < j; i++, j--) {\n            int tmp = a[i];\n            a[i] = a[j];\n            a[j] = tmp;\n        }\n    }\n\n    static void rotateLeft(int[] a, int d) {\n        int n = a.length;\n        if (n == 0) {\n            return;\n        }\n        d = d % n;\n        reverse(a, 0, d - 1);\n        reverse(a, d, n - 1);\n        reverse(a, 0, n - 1);\n    }\n\n    public static void main(String[] args) {\n        int[] a = {1, 2, 3, 4, 5, 6, 7};\n        rotateLeft(a, 2);\n        System.out.println(Arrays.toString(a));\n    }\n}",
  missingNumber: "public class MissingNumber {\n    static int missing(int[] a) {\n        int n = a.length + 1;\n        long expected = (long) n * (n + 1) / 2;   // 1 + 2 + ... + n\n        long sum = 0;\n        for (int value : a) {\n            sum += value;\n        }\n        return (int) (expected - sum);\n    }\n\n    public static void main(String[] args) {\n        System.out.println(missing(new int[] {1, 2, 4, 6, 3, 7, 8}));\n    }\n}",
  maxSubarraySum: "public class MaxSubarraySum {\n    static int maxSubarraySum(int[] a) {\n        int best = a[0];\n        int endingHere = a[0];        // best sum of a subarray that ends at index i\n        for (int i = 1; i < a.length; i++) {\n            endingHere = Math.max(a[i], endingHere + a[i]);\n            best = Math.max(best, endingHere);\n        }\n        return best;\n    }\n\n    public static void main(String[] args) {\n        System.out.println(maxSubarraySum(new int[] {2, 3, -8, 7, -1, 2, 3}));\n        System.out.println(maxSubarraySum(new int[] {-2, -4}));\n    }\n}",
};

const OUT = {
  dimensionProduct: "[4, 10, 18]\nError: Arrays must have the same length",
  judgeScores: "scores[(a + b) / 2] = 8.0\n0: 7.0\n1: 7.5\n2: 8.0\n3: 8.5\n4: 9.0\ntotal = 40.0",
  addressTable: "arr[0] = 11 at address 200\narr[3] = 89 at address 212\narr[6] = 19 at address 224\narr[9] = 23 at address 236\narr[11] is at 244",
  defaultValues: "[0, 0, 0, 0, 0]\n[0.0, 0.0, 0.0]\n[false, false]\n[null, null, null]\n[Ada, Alan, null], length 3",
  outOfBounds: "last element: 50",
  dynamicArray: "[10, 20, 30] size 3\n[15, 20, 30] size 3\narr.get(2) = 30",
  growableArray: "  grew to capacity 4\n  grew to capacity 8\n  grew to capacity 16\n[1, 2, 3, 4, 5, 6, 7, 8, 9], capacity 16",
  matrix: "rows = 3, columns = 2\na[0][0] = 1   a[0][1] = 4   \na[1][0] = 2   a[1][1] = 5   \na[2][0] = 3   a[2][1] = 6   \na[1] = [2, 5]\n[[1, 4], [2, 5], [3, 6]]",
  multidimensionalArray: "The 0th row has 3 elements: \n1, -2, 3, \nThe 1th row has 4 elements: \n-4, -5, 6, 9, \nThe 2th row has 1 elements: \n7, ",
  triangle: "[[1], [1, 1], [1, 2, 1], [1, 3, 3, 1]]",
  threeDimensionalArray: "The array2D is: \n1, -2, 3, \n2, 3, 4, \n\nThe array2D is: \n-4, -5, 6, 9, \n1, \n2, 3, \n",
  traversal: "Linear Traversal using for loop: 10 20 30 40 50 \nTraversal using while loop: 10 20 30 40 50 \nTraversal using foreach loop: 10 20 30 40 50 ",
  sumAverage: "Sum = 36\nAverage = 3.6",
  stringToInt: "Original String Array:\n10 20 30 40 50 \nThe integer array obtained from string array:\n[10, 20, 30, 40, 50]",
  searchAndModify: "Element found!\n[10, 20, 35, 40, 50]",
  insertCopy: "[10, 20, 25, 30, 40, 50]",
  shiftDemo: "start:          [10, 20, 30, 40, 50]\ninsert 25 at 2: [10, 20, 25, 30, 40, 50]\ninsert 5 at 0:  [5, 10, 20, 25, 30, 40, 50]\ndelete at 3:    [5, 10, 20, 30, 40, 50]\ndelete at 0:    [10, 20, 30, 40, 50]\ndelete last:    [10, 20, 30, 40]",
  deleteCopy: "[10, 20, 40, 50]",
  linearSearchDemo: "search(30) = 2\nsearch(35) = -1\nsearch(16) = 4",
  binarySearchDemo: "Element found at index 2\nbinarySearch(35) = -1",
  binarySearchTrace: "search for 30:\n  left = 0, right = 4, middle = 2, arr[middle] = 30\n  result 2\nsearch for 35:\n  left = 0, right = 4, middle = 2, arr[middle] = 30\n  left = 3, right = 4, middle = 3, arr[middle] = 40\n  left = 3 > right = 2: empty range\n  result -1\nsearch for 10:\n  left = 0, right = 4, middle = 2, arr[middle] = 30\n  left = 0, right = 1, middle = 0, arr[middle] = 10\n  result 0",
  midpointOverflow: "(left + right) / 2        = -397483648\nleft + (right - left) / 2 = 1750000000",
  passByValue: "before change, i = 5\nafter change, i = 5",
  appendExample: "before change, s is Hello \nafter change, s is Hello world !",
  reassignExample: "before change, s is Hello \nafter change, s is Hello ",
  arrayParameter: "[0, 8, 9]",
  swapElements: "after swapWrong:    [1, 2, 3, 4, 5]\nafter swapElements: [5, 2, 3, 4, 1]\nafter the loop:     [1, 4, 3, 2, 5]",
  swapObjects: "# objA: x=10 y=20\n# objB: x=1 y=2\n\nobj1: x=1 y=2\nobj2: x=10 y=20",
  swapValues: "obj1: x=10 y=20\nobj2: x=1 y=2",
  alias: "a = [99, 2, 3]\nb = [99, 2, 3]\nc = [1, 2, 3]\na == b: true, a == d: false, Arrays.equals(a, d): true",
  letterFrequency: "A: 2\nB: 2\nC: 1",
  bigIntArrayDemo: "chunks: 3\nelement 9 = 81 (chunk 2, offset 1)\n5000000000 elements in chunks of 2^30 need 5 chunks",
  reverse: "[6, 5, 4, 3, 2, 1]",
  checkSorted: "true\nfalse\ntrue",
  leaders: "[17, 5, 2]",
  removeDuplicates: "4 [2, 5, 7, 9]",
  zeroesToEnd: "[1, 2, 3, 4, 0, 0, 0]",
  rotate: "[3, 4, 5, 6, 7, 1, 2]",
  missingNumber: "5",
  maxSubarraySum: "11\n-2",
};

// ---------- shared bits for this lecture ----------

(function injectStyle() {
  if (document.getElementById("l03-style")) return;
  const s = document.createElement("style");
  s.id = "l03-style";
  s.textContent = `
  .l3-view { background: var(--paper-2); border-radius: 10px; padding: 10px; margin-bottom: 12px; overflow-x: auto; }
  .l3-row { display: flex; gap: 4px; flex-wrap: wrap; justify-content: center; align-items: flex-end; margin: 6px 0; }
  .l3-lab { font: 600 12px var(--mono); color: var(--stone); min-width: 46px; text-align: right; margin-right: 6px; align-self: center; }
  .l3-col { display: flex; flex-direction: column; align-items: center; gap: 2px; }
  .l3-cell { min-width: 44px; height: 40px; padding: 0 4px; display: grid; place-items: center; border: 1px solid var(--line);
    border-radius: 7px; background: var(--card); font: 600 14px var(--mono); transition: background .2s, border-color .2s; }
  .l3-cell.empty { color: var(--stone); font-weight: 400; border-style: dashed; }
  .l3-cell.cur { background: var(--mark); border-color: var(--amber); }
  .l3-cell.done { background: var(--teal-soft); border-color: var(--teal); }
  .l3-cell.ok { background: var(--green-soft); border-color: var(--green); color: var(--green); }
  .l3-cell.bad { background: var(--red-soft); border-color: var(--red); color: var(--red); }
  .l3-cell.out { opacity: .3; }
  .l3-cell.new { background: var(--green-soft); border-color: var(--green); }
  .l3-idx { font: 11px var(--mono); color: var(--stone); }
  .l3-addr { font: 10px var(--mono); color: var(--teal); }
  .l3-ptr { font: 600 11px var(--mono); height: 15px; color: var(--teal); white-space: nowrap; }
  .l3-ptr .m { color: var(--amber); }
  .l3-calc { text-align: center; font: 600 14px var(--mono); margin: 8px 0 2px; }
  .l3-calc .hl { color: var(--amber); }
  .l3-side { display: flex; flex-direction: column; gap: 8px; }
  .l3-side .stats { margin-top: 0; }
  .l3-side .console { margin-top: 0; }
  .l3-grid { display: grid; grid-template-columns: repeat(13, minmax(0, 1fr)); gap: 3px; max-width: 560px; margin: 6px auto; }
  .l3-grid .l3-col .l3-cell { min-width: 0; width: 100%; height: 30px; font-size: 12px; }
  .l3-arrow { text-align: center; font: 12px var(--mono); color: var(--stone); margin: 2px 0; }
  .l3-race .bar { grid-template-columns: 130px 1fr 110px; }
  @media (max-width: 600px) {
    .l3-cell { min-width: 34px; height: 34px; font-size: 12px; }
    .l3-lab { min-width: 0; font-size: 11px; }
    .l3-race .bar { grid-template-columns: 80px minmax(0, 1fr) auto; }
  }`;
  document.head.appendChild(s);
})();

// 1-based number of the first line of `code` that contains `needle` (0 if none).
function lineOf(code, needle, from = 1) {
  const lines = code.split("\n");
  for (let k = from - 1; k < lines.length; k++) if (lines[k].includes(needle)) return k + 1;
  return 0;
}

// Java's Double.toString for the values these demos produce.
function javaDouble(x) {
  if (Number.isNaN(x)) return "NaN";
  if (!Number.isFinite(x)) return x > 0 ? "Infinity" : "-Infinity";
  const a = Math.abs(x);
  if (a !== 0 && (a < 1e-3 || a >= 1e7)) {
    let [m, e] = x.toExponential().split("e");
    if (!m.includes(".")) m += ".0";
    return `${m}E${+e}`;
  }
  const s = String(x);
  return s.includes(".") ? s : `${s}.0`;
}

const jlist = (xs) => `[${xs.join(", ")}]`;   // Arrays.toString

// A row of array cells. cls(k) -> extra class; ptr(k) -> html above the cell; addr(k) -> text below.
function cellsHTML(vals, { cls = () => "", ptr = null, addr = null, label = "", start = 0 } = {}) {
  return `<div class="l3-row">${label ? `<span class="l3-lab">${label}</span>` : ""}${vals.map((v, k) => `
    <div class="l3-col">${ptr ? `<div class="l3-ptr">${ptr(k) || "&nbsp;"}</div>` : ""}
      <div class="l3-cell ${cls(k)} ${v === "" || v === null ? "empty" : ""}">${v === "" || v === null ? "·" : esc(v)}</div>
      <div class="l3-idx">${k + start}</div>${addr ? `<div class="l3-addr">${addr(k)}</div>` : ""}</div>`).join("")}</div>`;
}

// Generic step player: a picture on top, the code with the current line, a side panel
// (stats + console), a message and the controls. build() -> [{line, msg, msgCls, view, stats, out}].
function makePlayer(el, opts) {
  const mini = !!opts.mini;
  el.innerHTML = `<div class="l3-view pl-view"></div>
    ${mini ? "" : `<div class="stepper"><div class="pl-code"></div>
      <div class="l3-side"><div class="stats pl-stats"></div>${opts.console === false ? "" : `<div><div class="counter" style="margin-bottom:4px">${opts.outLabel || "output"}</div><div class="console pl-out"></div></div>`}</div></div>
    <div class="msg pl-msg"></div>
    <div class="controls">
      <button class="cbtn pl-reset" title="Back to the start">⟲ Reset</button>
      <button class="cbtn pl-back" title="Step back (←)">◀ Back</button>
      <button class="cbtn pl-step on" title="Step (→)">Step ▶</button>
      <button class="cbtn pl-play">Play</button>
      <button class="cbtn pl-end">End</button>
      ${opts.extraControls || ""}
      <span class="spacer"></span><span class="counter pl-count"></span>
    </div>`}`;
  const $ = (s) => el.querySelector(s);
  let snaps = [], i = 0, timer = null, codeLines = [];
  function render() {
    const s = snaps[i];
    $(".pl-view").innerHTML = opts.view(s);
    if (mini) return;
    codeLines.forEach((ln, k) => ln.classList.toggle("hl", k + 1 === s.line));
    const hl = codeLines[s.line - 1];
    if (hl) { const box = hl.closest("pre"); if (box && box.scrollHeight > box.clientHeight) box.scrollTop = hl.offsetTop - box.clientHeight / 2; }
    $(".pl-stats").innerHTML = (s.stats || []).map(([k, v, c]) => `<div class="stat ${c || ""}"><small>${k}</small><b>${v}</b></div>`).join("");
    const o = $(".pl-out");
    if (o) { o.textContent = (s.out || []).join("\n"); o.scrollTop = o.scrollHeight; }
    const msg = $(".pl-msg");
    msg.innerHTML = s.msg || "";
    msg.className = "msg pl-msg " + (s.msgCls || "");
    $(".pl-count").textContent = `step ${i + 1} / ${snaps.length}`;
    $(".pl-back").disabled = $(".pl-reset").disabled = i === 0;
    $(".pl-step").disabled = $(".pl-end").disabled = i === snaps.length - 1;
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
    }, mini ? (opts.speed || 900) : 750);
  }
  function rebuild() {
    stop();
    if (!mini) {
      const code = typeof opts.code === "function" ? opts.code() : opts.code;
      $(".pl-code").innerHTML = codeBlock(code);
      codeLines = [...el.querySelectorAll(".pl-code .ln")];
      const pre = el.querySelector(".pl-code pre");
      if (pre && opts.codeMax) { pre.style.maxHeight = opts.codeMax + "px"; pre.style.overflow = "auto"; }
    }
    snaps = opts.build();
    i = 0;
    render();
  }
  if (!mini) {
    $(".pl-reset").onclick = () => { stop(); i = 0; render(); };
    $(".pl-back").onclick = () => { stop(); if (i > 0) i--; render(); };
    $(".pl-step").onclick = () => { stop(); if (i < snaps.length - 1) i++; render(); };
    $(".pl-end").onclick = () => { stop(); i = snaps.length - 1; render(); };
    $(".pl-play").onclick = play;
    el.tabIndex = 0;
    el.addEventListener("keydown", (e) => {
      if (["INPUT", "SELECT", "TEXTAREA"].includes(e.target.tagName)) return;
      if (e.key === "ArrowRight") { e.preventDefault(); $(".pl-step").click(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); $(".pl-back").click(); }
    });
  }
  if (opts.onMount) opts.onMount(el, rebuild);
  rebuild();
  if (mini) play();
  return { rebuild };
}

const field = (cls, value, width = 170, label = "") =>
  `<label>${label} <input type="text" class="${cls}" value="${value}" style="width:${width}px"></label>`;

// ---------- 1 · address of a[i] ----------

const ELEM_TYPES = { int: [4, "Integer"], long: [8, "Long"], double: [8, "Double"] };

function demoAddress(el, { mini = false } = {}) {
  let vals = [11, 9, 17, 89, 1, 90, 19, 5, 3, 23, 43, 99];
  let base = 200, type = "int";
  const show = (v) => (type === "double" ? javaDouble(v) : String(v));
  const codeFor = () => CODE.addressTable
    .replace("{11, 9, 17, 89, 1, 90, 19, 5, 3, 23, 43, 99}", `{${vals.join(", ")}}`)
    .replace("int[] arr", `${type}[] arr`)
    .replace("int base = 200", `int base = ${base}`)
    .replace("Integer.BYTES; // 4 bytes per int", `${ELEM_TYPES[type][1]}.BYTES; // ${ELEM_TYPES[type][0]} bytes per ${type}`);
  makePlayer(el, {
    mini, speed: 1300, outLabel: "printed",
    code: codeFor,
    extraControls: `${field("ad-vals", vals.join(", "), 200, "values")}
      <label>type <select class="ad-type">${Object.keys(ELEM_TYPES).map((t) => `<option ${t === type ? "selected" : ""}>${t}</option>`).join("")}</select></label>
      <label>base <input type="number" class="ad-base" value="${base}"></label>`,
    build() {
      const size = ELEM_TYPES[type][0];
      if (mini) {
        return [3, 11, 0, 7, 5, 9].map((k) => ({ k }));
      }
      const code = codeFor();
      const out = [];
      const snaps = [];
      for (let i = 0; i < vals.length; i += 3) {
        out.push(`arr[${i}] = ${show(vals[i])} at address ${base + i * size}`);
        snaps.push({ k: i, line: lineOf(code, "\" at address \""), out: out.slice(),
          msg: `To read <code>arr[${i}]</code> the machine does not walk past ${i} cells. It computes the address: ${base} + ${i} × ${size}. One multiplication and one addition, whatever <code>i</code> is: <b>random access</b>, O(1).`,
          stats: [["index i", i], ["element size", `${size} B`], ["address", base + i * size]] });
      }
      out.push(`arr[11] is at ${base + 11 * size}`);
      snaps.push({ k: 11, line: lineOf(code, "arr[11] is at"), out: out.slice(), msgCls: "good",
        msg: `Index 11 costs exactly the same as index 0: ${base} + 11 × ${size} = ${base + 11 * size}.${vals.length <= 11 ? " (This array is shorter than 12, so that address is past its end: Java would refuse to read it.)" : ""}`,
        stats: [["index i", 11], ["element size", `${size} B`], ["address", base + 11 * size]] });
      return snaps;
    },
    view(s) {
      const size = ELEM_TYPES[type][0];
      const v = s.k < vals.length ? show(vals[s.k]) : "out of bounds";
      return cellsHTML(vals.map(show), { cls: (k) => (k === s.k ? "cur" : ""), addr: (k) => base + k * size }) +
        `<div class="l3-calc">address(arr[<span class="hl">${s.k}</span>]) = ${base} + <span class="hl">${s.k}</span> × ${size} = <span class="hl">${base + s.k * size}</span> &nbsp;→&nbsp; ${esc(v)}</div>`;
    },
    onMount(root, rebuild) {
      if (mini) return;
      root.querySelector(".ad-vals").onchange = (e) => { vals = parseNums(e.target.value, vals).slice(0, 12); e.target.value = vals.join(", "); rebuild(); };
      root.querySelector(".ad-type").onchange = (e) => { type = e.target.value; rebuild(); };
      root.querySelector(".ad-base").onchange = (e) => { base = Math.max(0, Math.trunc(+e.target.value) || 0); e.target.value = base; rebuild(); };
    },
  });
}

// ---------- 1 · multiplyArrays through the ADT ----------

function demoMultiply(el) {
  let a1 = [1, 2, 3], a2 = [4, 5, 6];
  const code = CODE.vectorOps;
  makePlayer(el, {
    code,
    outLabel: "returned array",
    extraControls: `${field("mu-a1", a1.join(", "), 110, "a1")}${field("mu-a2", a2.join(", "), 110, "a2")}`,
    build() {
      const snaps = [];
      const a3 = a1.map(() => null);
      const snap = (line, i, msg, msgCls = "", out = []) => snaps.push({ line, i, a3: a3.slice(), msg, msgCls, out, stats: [["i", i ?? "–"], ["a1.length", a1.length], ["a2.length", a2.length]] });
      snap(lineOf(code, "a1.length != a2.length"), null, `First check the lengths: ${a1.length} and ${a2.length}.`);
      if (a1.length !== a2.length) {
        snap(lineOf(code, "throw new"), null, "The lengths differ, so <code>a2[i]</code> would run off the end. The method throws <code>IllegalArgumentException</code>.", "bad",
          ["Exception: Arrays must have the same length"]);
        return snaps;
      }
      snap(lineOf(code, "new int[a1.length]"), null, `<b>createArray(${a1.length})</b>: a new <code>int[]</code>, filled with 0 until we store into it.`);
      for (let i = 0; i < a1.length; i++) {
        a3[i] = Math.imul(a1[i], a2[i]);
        snap(lineOf(code, "a3[i] = a1[i] * a2[i]"), i, `<b>retrieve</b>(a1, ${i}) = ${a1[i]}, <b>retrieve</b>(a2, ${i}) = ${a2[i]}; <b>store</b>(a3, ${i}, ${a3[i]}).`);
      }
      snap(lineOf(code, "return a3"), null, `Return the new array: <code>${jlist(a3)}</code>. n multiplications: O(n).`, "good", [jlist(a3)]);
      return snaps;
    },
    view: (s) => cellsHTML(a1, { label: "a1", cls: (k) => (k === s.i ? "cur" : "") }) +
      cellsHTML(a2, { label: "a2", cls: (k) => (k === s.i ? "cur" : "") }) +
      cellsHTML(s.a3.map((v) => (v === null ? 0 : v)), { label: "a3", cls: (k) => (k === s.i ? "new" : s.a3[k] === null ? "out" : "done") }),
    onMount(root, rebuild) {
      root.querySelector(".mu-a1").onchange = (e) => { a1 = parseNums(e.target.value, a1).slice(0, 8); e.target.value = a1.join(", "); rebuild(); };
      root.querySelector(".mu-a2").onchange = (e) => { a2 = parseNums(e.target.value, a2).slice(0, 8); e.target.value = a2.join(", "); rebuild(); };
    },
  });
}

// ---------- 2 · jagged arrays ----------

function parseRows(text, fallback) {
  const rows = String(text).split(";").map((r) => parseNums(r, null)).filter((r) => r && r.length);
  return rows.length ? rows.slice(0, 5).map((r) => r.slice(0, 7)) : fallback;
}

function demoJagged(el, { mini = false } = {}) {
  let rows = [[1, -2, 3], [-4, -5, 6, 9], [7]];
  const codeFor = () => CODE.multidimensionalArray.replace(/int\[\]\[\] a = \{[\s\S]*?\n        \};/,
    `int[][] a = {\n${rows.map((r) => `            {${r.join(", ")}},`).join("\n")}\n        };`);
  makePlayer(el, {
    mini, speed: 700, codeMax: 420,
    code: codeFor,
    extraControls: field("jg-rows", rows.map((r) => r.join(" ")).join("; "), 200, "rows (; between rows)"),
    build() {
      const code = codeFor();
      const lHead = lineOf(code, "println(\"The \""), lItem = lineOf(code, "print(a[i][j]"), lEnd = lineOf(code, "System.out.println();");
      const snaps = [];
      const out = [];
      let cur = "";
      const snap = (line, i, j, msg) => snaps.push({ line, i, j, msg, out: [...out, ...(cur ? [cur] : [])], stats: [["i (row)", i ?? "–"], ["j (column)", j ?? "–"], ["a.length", rows.length], ["a[i].length", i === null || i === undefined ? "–" : rows[i].length]] });
      snap(lineOf(code, "int[][] a"), null, null, `<code>a</code> is an array of ${rows.length} rows; each row is its own <code>int[]</code> with its own length.`);
      for (let i = 0; i < rows.length; i++) {
        out.push(`The ${i}th row has ${rows[i].length} elements: `);
        snap(lHead, i, null, `Row ${i}: <code>a[${i}].length</code> is ${rows[i].length}. The inner loop uses <em>this</em> row's length.`);
        for (let j = 0; j < rows[i].length; j++) {
          cur += `${rows[i][j]}, `;
          snap(lItem, i, j, `<code>a[${i}][${j}]</code> = ${rows[i][j]}: row ${i}, then position ${j} inside that row.`);
        }
        out.push(cur); cur = "";
        snap(lEnd, i, null, `End of row ${i}.`);
      }
      snaps[snaps.length - 1].msg = "Done. Each row was traversed up to its own length, so no index went out of bounds.";
      snaps[snaps.length - 1].msgCls = "good";
      return snaps;
    },
    view(s) {
      return `<div class="l3-arrow">a → [ ${rows.map((_, i) => `<b style="color:${i === s.i ? "var(--amber)" : "inherit"}">a[${i}]</b>`).join(", ")} ]</div>` +
        rows.map((r, i) => cellsHTML(r, { label: `a[${i}]`, cls: (j) => (i === s.i && j === s.j ? "cur" : i === s.i ? "done" : "") })).join("");
    },
    onMount(root, rebuild) {
      if (mini) return;
      root.querySelector(".jg-rows").onchange = (e) => { rows = parseRows(e.target.value, rows); e.target.value = rows.map((r) => r.join(" ")).join("; "); rebuild(); };
    },
  });
}

// ---------- 3 · traversal: sum and average ----------

function demoSum(el) {
  let nums = [2, -9, 0, 5, 12, -25, 22, 9, 8, 12];
  const codeFor = () => CODE.sumAverage.replace(/\{2, -9[^}]*\}/, `{${nums.join(", ")}}`);
  makePlayer(el, {
    code: codeFor,
    extraControls: field("su-n", nums.join(", "), 220, "numbers"),
    build() {
      const code = codeFor();
      const snaps = [];
      let sum = 0;
      let upto = 0;
      const snap = (line, k, msg, out = [], cls = "") => snaps.push({ line, k, sum, upto, msg, out, msgCls: cls, stats: [["value", k === null ? "–" : nums[k]], ["sum", sum], ["visited", upto]] });
      snap(lineOf(code, "int sum = 0"), null, "Start the running total at 0.");
      nums.forEach((v, k) => {
        sum = (sum + v) | 0;
        upto = k + 1;
        snap(lineOf(code, "sum += value"), k, `The for-each loop hands us <code>value = ${v}</code> (element ${k}). <code>sum</code> becomes ${sum}.`);
      });
      const avg = javaDouble(sum / nums.length);
      snap(lineOf(code, "double average"), null, `<code>(double) sum / numbers.length</code> = ${sum} / ${nums.length} = ${avg}. Without the cast it would be integer division: ${Math.trunc(sum / nums.length)}.`);
      snap(lineOf(code, "\"Average = \""), null, `Each element was visited exactly once: O(n) time, O(1) extra space.`, [`Sum = ${sum}`, `Average = ${avg}`], "good");
      return snaps;
    },
    view: (s) => cellsHTML(nums, { cls: (k) => (k === s.k ? "cur" : k < s.upto ? "done" : "") }) +
      `<div class="l3-calc">sum = <span class="hl">${s.sum}</span></div>`,
    onMount(root, rebuild) {
      root.querySelector(".su-n").onchange = (e) => { nums = parseNums(e.target.value, nums).slice(0, 12); e.target.value = nums.join(", "); rebuild(); };
    },
  });
}

// ---------- 4 · insertion and deletion ----------

function demoShift(el, { op = "insert", mini = false } = {}) {
  let arr = [10, 20, 30, 40, 50];
  let index = 2, value = 25;
  let mode = "shift";
  const codeFor = () => {
    if (mode === "shift") return CODE.arrayShift;
    if (op === "insert") return CODE.insertCopy.replace("{10, 20, 30, 40, 50}", `{${arr.join(", ")}}`).replace("index = 2", `index = ${index}`).replace("element = 25", `element = ${value}`);
    return CODE.deleteCopy.replace("{10, 20, 30, 40, 50}", `{${arr.join(", ")}}`).replace("index = 2;", `index = ${index};`);
  };
  function buildShift(code) {
    const snaps = [];
    const n = arr.length;
    const data = [...arr, null, null];          // capacity n + 2: room to insert
    let moves = 0;
    const snap = (line, extra, msg, cls = "") => snaps.push({ line, data: data.slice(), size: extra.size ?? n, msg, msgCls: cls, hi: extra.hi ?? -1, src: extra.src ?? -1, gap: extra.gap ?? -1,
      stats: [["size", extra.size ?? n], ["capacity", data.length], ["moves", moves], [op === "insert" ? "insert at" : "delete at", index]] });
    if (op === "insert") {
      const L = lineOf(code, "data[k] = data[k - 1]");
      snap(lineOf(code, "static int insertAt"), {}, `Insert ${value} at index ${index}. The array has room: size ${n}, capacity ${data.length}.`);
      for (let k = n; k > index; k--) {
        data[k] = data[k - 1]; moves++;
        snap(L, { hi: k, src: k - 1 }, `k = ${k}: copy <code>data[${k - 1}]</code> (${data[k]}) one place right into <code>data[${k}]</code>. We start at the <b>right end</b>, so nothing is overwritten before it has moved.`);
      }
      data[index] = value;
      snap(lineOf(code, "data[index] = value"), { hi: index, size: n + 1 }, `The gap at index ${index} is free: store ${value}. The size becomes ${n + 1}.`);
      snap(lineOf(code, "return size + 1"), { size: n + 1 }, `${moves} element${moves === 1 ? "" : "s"} moved (n − index = ${n} − ${index}). Inserting at the front moves all n: O(n).`, "good");
    } else {
      const L = lineOf(code, "data[k] = data[k + 1]");
      snap(lineOf(code, "static int deleteAt"), { gap: index }, `Delete index ${index} (value ${data[index]}). Everything after it must move one place left.`);
      for (let k = index; k < n - 1; k++) {
        data[k] = data[k + 1]; moves++;
        snap(L, { hi: k, src: k + 1 }, `k = ${k}: copy <code>data[${k + 1}]</code> (${data[k]}) into <code>data[${k}]</code>. Deleting shifts from the <b>left</b>, starting just after the gap.`);
      }
      data[n - 1] = null;
      snap(lineOf(code, "return size - 1"), { size: n - 1 }, `${moves} element${moves === 1 ? "" : "s"} moved (n − index − 1). The size becomes ${n - 1}; the old last cell is no longer in use.`, "good");
    }
    return snaps;
  }
  function buildCopy(code) {
    const snaps = [];
    const newLen = op === "insert" ? arr.length + 1 : arr.length - 1;
    const na = Array(newLen).fill(null);
    let copies = 0;
    const out = [];
    const snap = (line, i, j, msg, cls = "") => snaps.push({ line, na: na.slice(), i, j, msg, msgCls: cls, out: out.slice(),
      stats: [["i", i ?? "–"], ["j", j ?? "–"], ["copies", copies], ["new length", newLen]] });
    snap(lineOf(code, "int[] newArr"), null, null, `A Java array cannot grow or shrink, so make a <b>new</b> array of length ${newLen} and copy.`);
    if (op === "insert") {
      for (let i = 0, j = 0; i < newLen; i++) {
        if (i === index) { na[i] = value; snap(lineOf(code, "newArr[i] = element"), i, j, `i = ${i} is the insert position: put ${value} here. <code>j</code> stays at ${j}.`); }
        else { na[i] = arr[j]; copies++; snap(lineOf(code, "newArr[i] = arr[j]"), i, j, `Copy <code>arr[${j}]</code> = ${arr[j]} into <code>newArr[${i}]</code>, then <code>j++</code>.`); j++; }
      }
    } else {
      for (let i = 0, j = 0; i < arr.length; i++) {
        if (i !== index) { na[j] = arr[i]; copies++; snap(lineOf(code, "newArr[j] = arr[i]"), i, j, `Copy <code>arr[${i}]</code> = ${arr[i]} into <code>newArr[${j}]</code>, then <code>j++</code>.`); j++; }
        else snap(lineOf(code, "if (i != index)"), i, j, `i = ${i} is the deleted position: skip it. <code>j</code> stays at ${j}.`);
      }
    }
    out.push(jlist(na));
    snap(lineOf(code, "System.out.println"), null, null, `Every element was copied (${copies} copies): always O(n), plus O(n) extra space for the new array.`, "good");
    return snaps;
  }
  makePlayer(el, {
    mini, speed: 800,
    code: codeFor, codeMax: 460,
    outLabel: "printed",
    extraControls: `<label>method <select class="sh-mode"><option value="shift">in place (shift)</option><option value="copy">new array (copy)</option></select></label>
      ${field("sh-arr", arr.join(", "), 140, "arr")}
      <label>index <input type="number" class="sh-i" value="${index}"></label>
      ${op === "insert" ? `<label>value <input type="number" class="sh-v" value="${value}"></label>` : ""}`,
    build() { const c = codeFor(); return mode === "shift" ? buildShift(c) : buildCopy(c); },
    view(s) {
      if (mode === "shift" || mini) {
        return cellsHTML(s.data, {
          label: "data",
          ptr: (k) => (k === s.hi ? `<span class="m">${s.src >= 0 ? (s.src < k ? "→" : "←") : "▼"}</span>` : k === s.gap ? "gap" : ""),
          cls: (k) => (k === s.hi ? "new" : k === s.src ? "cur" : k === s.gap ? "bad" : s.data[k] === null ? "out" : ""),
        });
      }
      return cellsHTML(arr, { label: "arr", cls: (k) => (op === "insert" ? (k === s.j && s.i !== index ? "cur" : "") : (k === s.i ? (k === index ? "bad" : "cur") : "")) }) +
        cellsHTML(s.na, { label: "newArr", cls: (k) => (op === "insert" ? (k === s.i ? "new" : "") : (k === s.j && s.i !== index ? "new" : "")) });
    },
    onMount(root, rebuild) {
      if (mini) return;
      const clampIdx = () => { index = Math.max(0, Math.min(index, op === "insert" ? arr.length : arr.length - 1)); root.querySelector(".sh-i").value = index; };
      root.querySelector(".sh-mode").onchange = (e) => {
        mode = e.target.value;
        // The console only matters for the copying programs.
        const side = root.querySelector(".pl-out");
        if (side) side.parentElement.style.display = mode === "shift" ? "none" : "";
        rebuild();
      };
      root.querySelector(".pl-out").parentElement.style.display = "none";
      root.querySelector(".sh-arr").onchange = (e) => { arr = parseNums(e.target.value, arr).slice(0, 9); if (op === "delete" && !arr.length) arr = [10]; e.target.value = arr.join(", "); clampIdx(); rebuild(); };
      root.querySelector(".sh-i").onchange = (e) => { index = Math.trunc(+e.target.value) || 0; clampIdx(); rebuild(); };
      const v = root.querySelector(".sh-v");
      if (v) v.onchange = (e) => { value = Math.trunc(+e.target.value) || 0; e.target.value = value; rebuild(); };
    },
  });
}

// ---------- 5 · linear search ----------

function demoLinear(el) {
  let arr = [20, 12, 30, 25, 16], target = 30;
  const code = CODE.linearSearch;
  makePlayer(el, {
    code, outLabel: "returns",
    extraControls: `${field("ls-a", arr.join(", "), 150, "a")}<label>searchNum <input type="number" class="ls-t" value="${target}"></label>`,
    build() {
      const snaps = [];
      let comps = 0;
      const snap = (line, i, msg, cls = "", out = [], hit = -1) => snaps.push({ line, i, hit, msg, msgCls: cls, out, stats: [["i", i ?? "–"], ["comparisons", comps], ["n", arr.length]] });
      for (let i = 0; i < arr.length; i++) {
        comps++;
        if (arr[i] === target) {
          snap(lineOf(code, "a[i] == searchNum"), i, `<code>a[${i}]</code> = ${arr[i]} equals ${target}.`, "", [], i);
          snap(lineOf(code, "return i"), i, `Found at index ${i} after ${comps} comparison${comps > 1 ? "s" : ""}.`, "good", [String(i)], i);
          return snaps;
        }
        snap(lineOf(code, "a[i] == searchNum"), i, `<code>a[${i}]</code> = ${arr[i]} ≠ ${target}: move on.`);
      }
      snap(lineOf(code, "return -1"), null, `Reached the end after ${comps} comparisons (all n): not found, return −1. This is the worst case, O(n).`, "bad", ["-1"]);
      return snaps;
    },
    view: (s) => cellsHTML(arr, { ptr: (k) => (k === s.i ? "i" : ""), cls: (k) => (k === s.hit ? "ok" : k === s.i ? "cur" : s.i !== null && k < s.i ? "out" : s.i === null ? "out" : "") }) +
      `<div class="l3-calc">searchNum = <span class="hl">${target}</span></div>`,
    onMount(root, rebuild) {
      root.querySelector(".ls-a").onchange = (e) => { arr = parseNums(e.target.value, arr).slice(0, 12); e.target.value = arr.join(", "); rebuild(); };
      root.querySelector(".ls-t").onchange = (e) => { target = Math.trunc(+e.target.value) || 0; e.target.value = target; rebuild(); };
    },
  });
}

// ---------- 5 · binary search ----------

function binarySnaps(arr, target, code) {
  const snaps = [];
  let left = 0, right = arr.length - 1, comps = 0;
  const L = (s) => lineOf(code, s);
  const snap = (line, mid, msg, cls = "", res = null) => snaps.push({ line, left, right, mid, msg, msgCls: cls, found: res,
    out: res === null ? [] : [String(res)], stats: [["left", left], ["right", right], ["middle", mid ?? "–"], ["comparisons", comps]] });
  snap(L("int right"), null, `Search for ${target}. The candidates are indices ${left} to ${right}.`);
  while (left <= right) {
    const mid = left + Math.trunc((right - left) / 2);
    comps++;
    snap(L("int middle"), mid, `middle = ${left} + (${right} − ${left}) / 2 = ${mid}; <code>arr[${mid}]</code> = ${arr[mid]}.`);
    if (arr[mid] === target) { snap(L("return middle"), mid, `${arr[mid]} == ${target}: found at index ${mid} after ${comps} comparison${comps > 1 ? "s" : ""}.`, "good", mid); return snaps; }
    if (arr[mid] < target) { left = mid + 1; snap(L("left = middle + 1"), mid, `${arr[mid]} < ${target}, so the target can only be to the right. Throw away indices ≤ ${mid}: left = ${left}.`); }
    else { right = mid - 1; snap(L("right = middle - 1"), mid, `${arr[mid]} > ${target}, so the target can only be to the left. Throw away indices ≥ ${mid}: right = ${right}.`); }
  }
  snap(L("return -1"), null, `left = ${left} > right = ${right}: no candidates left. Not found after ${comps} comparison${comps === 1 ? "" : "s"}.`, "bad", -1);
  return snaps;
}

function demoBinary(el, { mini = false } = {}) {
  let arr = mini ? [3, 8, 15, 21, 30, 42, 57, 64, 71, 88, 95] : [10, 20, 30, 40, 50];
  let target = mini ? 57 : 30;
  const code = CODE.binarySearch;
  const miniTargets = [57, 8, 60, 95];
  makePlayer(el, {
    mini, speed: 1000, outLabel: "returns",
    code,
    extraControls: `${field("bs-a", arr.join(", "), 170, "sorted arr")}<label>target <input type="number" class="bs-t" value="${target}"></label>`,
    build() {
      if (!mini) return binarySnaps(arr, target, code);
      // Mini: run several searches back to back.
      return miniTargets.flatMap((t) => binarySnaps(arr, t, code).map((s) => ({ ...s, t })));
    },
    view(s) {
      const sorted = arr.every((v, k) => k === 0 || arr[k - 1] <= v);
      return cellsHTML(arr, {
        ptr: (k) => [k === s.left ? "L" : "", k === s.mid ? '<span class="m">M</span>' : "", k === s.right ? "R" : ""].filter(Boolean).join(" "),
        cls: (k) => (s.found !== null && s.found >= 0 && k === s.found ? "ok" : k === s.mid ? "cur" : k < s.left || k > s.right ? "out" : ""),
      }) + `<div class="l3-calc">target = <span class="hl">${mini ? s.t : target}</span>${sorted ? "" : ' &nbsp;<span style="color:var(--red)">· this array is NOT sorted: answers may be wrong</span>'}</div>`;
    },
    onMount(root, rebuild) {
      if (mini) return;
      root.querySelector(".bs-a").onchange = (e) => { arr = parseNums(e.target.value, arr).slice(0, 15); e.target.value = arr.join(", "); rebuild(); };
      root.querySelector(".bs-t").onchange = (e) => { target = Math.trunc(+e.target.value) || 0; e.target.value = target; rebuild(); };
    },
  });
}

// Worst-case comparisons: linear n; binary floor(log2 n) + 1.
function demoRace(el) {
  const sizes = [8, 100, 1000, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9, 2147483647];
  let k = 5;
  el.innerHTML = `<div class="l3-race"><div class="bars rc-bars"></div></div>
    <div class="controls"><label>n <input type="range" class="rc-n" min="0" max="${sizes.length - 1}" value="${k}"> <b class="rc-v mono"></b></label></div>`;
  const $ = (q) => el.querySelector(q);
  function render() {
    const n = sizes[k];
    const lin = n, bin = Math.floor(Math.log2(n)) + 1;
    $(".rc-v").textContent = n.toLocaleString("en-US");
    $(".rc-bars").innerHTML = [["linear search", lin, ""], ["binary search", bin, "amber"]].map(([name, v, c]) =>
      `<div class="bar"><span>${name}</span><div class="track"><div class="fill ${c}" style="width:${Math.max(0.6, (100 * Math.log10(v + 1)) / Math.log10(lin + 1))}%"></div></div><span class="v">${v.toLocaleString("en-US")}</span></div>`).join("") +
      `<p class="hint" style="margin:4px 0 0">Worst-case comparisons. Bar lengths are on a log scale, otherwise the binary bar would be invisible.</p>`;
  }
  $(".rc-n").oninput = (e) => { k = +e.target.value; render(); };
  render();
}

// ---------- 6 · references: frames on the left, objects on the right ----------

// A scenario is a list of steps; each step changes the state and points at a line.
// state: frames [{name, vars: [[name, value]]}] where value is a number/string or {ref: id};
//        heap {id: {kind: "sb"|"arr"|"pt", v, dead}}.
const REF_SCENARIOS = {
  primitive: {
    label: "int argument (6.2)", code: () => CODE.passByValue,
    steps: [
      ["int i = 5", (S) => { S.frames = [{ name: "main", vars: [["i", 5]] }]; }, "<code>main</code> has a variable <code>i</code> holding the number 5."],
      ["before change", (S) => S.out.push("before change, i = 5"), "Print it."],
      ["change(i);", (S) => S.frames.push({ name: "change", vars: [["i", 5]] }), "Calling <code>change(i)</code> creates a new frame. Its parameter <code>i</code> is a <b>new variable</b> holding a <b>copy</b> of 5."],
      ["i = 10", (S) => { S.frames[1].vars[0][1] = 10; }, "Assigning to the parameter changes the copy only."],
      ["change(i);", (S) => S.frames.pop(), "<code>change</code> returns; its frame, and its <code>i</code>, disappear."],
      ["after change", (S) => S.out.push("after change, i = 5"), "<code>main</code>'s <code>i</code> was never touched: still 5.", "good"],
    ],
  },
  append: {
    label: "change the object (6.3)", code: () => CODE.appendExample,
    steps: [
      ["new StringBuffer(\"Hello \")", (S) => { S.heap.o1 = { kind: "sb", v: "Hello " }; S.frames = [{ name: "main", vars: [["s", { ref: "o1" }]] }]; }, "<code>s</code> holds a <b>reference</b> (an arrow) to a <code>StringBuffer</code> object on the heap."],
      ["before change", (S) => S.out.push("before change, s is Hello "), "Print it."],
      ["change(s);", (S) => S.frames.push({ name: "change", vars: [["t", { ref: "o1" }]] }), "The call copies the <b>arrow</b>, not the object: <code>t</code> points to the same <code>StringBuffer</code>."],
      ["t.append", (S) => { S.heap.o1.v = "Hello world !"; }, "<code>t.append(...)</code> changes the object that <code>t</code> points to, which is also the one <code>s</code> points to."],
      ["change(s);", (S) => S.frames.pop(), "<code>change</code> returns; the copy <code>t</code> disappears. The object stays, changed."],
      ["after change", (S) => S.out.push("after change, s is Hello world !"), "<code>main</code> sees the change through <code>s</code>.", "good"],
    ],
  },
  reassign: {
    label: "reassign the parameter (6.4)", code: () => CODE.reassignExample,
    steps: [
      ["new StringBuffer(\"Hello \")", (S) => { S.heap.o1 = { kind: "sb", v: "Hello " }; S.frames = [{ name: "main", vars: [["s", { ref: "o1" }]] }]; }, "<code>s</code> points to a <code>StringBuffer</code> holding \"Hello \"."],
      ["before change", (S) => S.out.push("before change, s is Hello "), "Print it."],
      ["change(s);", (S) => S.frames.push({ name: "change", vars: [["t", { ref: "o1" }]] }), "<code>t</code> is a copy of the arrow: both point to \"Hello \"."],
      ["t = new StringBuffer", (S) => { S.heap.o2 = { kind: "sb", v: "Hi, " }; S.frames[1].vars[0][1] = { ref: "o2" }; }, "<code>t = new ...</code> points <code>t</code> at a <b>new</b> object. <code>s</code> is a different variable and still points to \"Hello \"."],
      ["t.append", (S) => { S.heap.o2.v = "Hi, world !"; }, "<code>append</code> changes the new object only."],
      ["change(s);", (S) => { S.frames.pop(); S.heap.o2.dead = true; }, "<code>change</code> returns. Nothing points to \"Hi, world !\" any more: it is garbage, and the garbage collector will reclaim it."],
      ["after change", (S) => S.out.push("after change, s is Hello "), "<code>s</code> is unchanged.", "good"],
    ],
  },
  swapElements: {
    label: "swap array elements (6.5)", code: () => CODE.swapElements,
    steps: [
      ["int[] array = {1, 2, 3, 4, 5}", (S) => { S.heap.a = { kind: "arr", v: [1, 2, 3, 4, 5] }; S.frames = [{ name: "main", vars: [["array", { ref: "a" }]] }]; }, "<code>array</code> holds a reference to an <code>int[]</code> object."],
      ["int n = array.length", (S) => S.frames[0].vars.push(["n", 5]), "<code>n</code> = 5."],
      ["swapWrong(array[0]", (S) => S.frames.push({ name: "swapWrong", vars: [["a", 1], ["b", 5]] }), "<code>swapWrong(array[0], array[n - 1])</code> passes the two <b>numbers</b> 1 and 5. <code>a</code> and <code>b</code> are copies."],
      ["int tmp = a;", (S) => S.frames[1].vars.push(["tmp", 1]), "<code>tmp = a</code>."],
      ["a = b;", (S) => { S.frames[1].vars[0][1] = 5; }, "<code>a = b</code>."],
      ["b = tmp;", (S) => { S.frames[1].vars[1][1] = 1; }, "<code>b = tmp</code>: the copies are swapped …"],
      ["swapWrong(array[0]", (S) => S.frames.pop(), "… and thrown away on return. The array never changed."],
      ["after swapWrong", (S) => S.out.push("after swapWrong:    [1, 2, 3, 4, 5]"), "Print: unchanged.", "bad"],
      ["swapElements(array, 0, n - 1);", (S) => S.frames.push({ name: "swapElements", vars: [["a", { ref: "a" }], ["p1", 0], ["p2", 4]] }), "Now pass the <b>array reference</b> and two positions. <code>a</code> points to the same array as <code>array</code>."],
      ["int tmp = a[p1];", (S) => S.frames[1].vars.push(["tmp", 1]), "<code>tmp = a[0]</code> = 1."],
      ["a[p1] = a[p2];", (S) => { S.heap.a.v[0] = 5; }, "<code>a[0] = a[4]</code>: this writes into the shared array."],
      ["a[p2] = tmp;", (S) => { S.heap.a.v[4] = 1; }, "<code>a[4] = tmp</code>."],
      ["swapElements(array, 0, n - 1);", (S) => S.frames.pop(), "Return. The parameters vanish; the changes to the array remain."],
      ["after swapElements", (S) => S.out.push("after swapElements: [5, 2, 3, 4, 1]"), "Print: swapped.", "good"],
    ],
  },
  swapObjects: {
    label: "swap two objects (6.6)", code: () => CODE.swapObjects,
    steps: [
      ["Point obj1 = new Point(1, 2)", (S) => { S.heap.p1 = { kind: "pt", v: [1, 2] }; S.frames = [{ name: "main", vars: [["obj1", { ref: "p1" }]] }]; }, "<code>obj1</code> points to a <code>Point</code> (1, 2)."],
      ["Point obj2 = new Point(10, 20)", (S) => { S.heap.p2 = { kind: "pt", v: [10, 20] }; S.frames[0].vars.push(["obj2", { ref: "p2" }]); }, "<code>obj2</code> points to (10, 20)."],
      ["swap(obj1, obj2);", (S) => S.frames.push({ name: "swap", vars: [["objA", { ref: "p1" }], ["objB", { ref: "p2" }]] }), "On entry <code>objA</code> and <code>objB</code> are copies of the two arrows."],
      ["Point tmp = objA;", (S) => S.frames[1].vars.push(["tmp", { ref: "p1" }]), "<code>tmp</code> also points to (1, 2)."],
      ["objA = objB;", (S) => { S.frames[1].vars[0][1] = { ref: "p2" }; }, "<code>objA</code> now points to (10, 20)."],
      ["objB = tmp;", (S) => { S.frames[1].vars[1][1] = { ref: "p1" }; }, "<code>objB</code> now points to (1, 2). Inside <code>swap</code>, the swap worked …"],
      ["\"# objA", (S) => S.out.push("# objA: x=10 y=20", "# objB: x=1 y=2", ""), "… as the prints show."],
      ["swap(obj1, obj2);", (S) => S.frames.pop(), "But only <code>swap</code>'s own variables moved. On return they disappear; <code>obj1</code> and <code>obj2</code> were never assigned."],
      ["\"obj2: x=\"", (S) => S.out.push("obj1: x=1 y=2", "obj2: x=10 y=20"), "So <code>main</code> sees no swap.", "bad"],
    ],
  },
  swapValues: {
    label: "swap the contents (6.6)", code: () => CODE.swapValues,
    steps: [
      ["Point obj1 = new Point(1, 2)", (S) => { S.heap.p1 = { kind: "pt", v: [1, 2] }; S.frames = [{ name: "main", vars: [["obj1", { ref: "p1" }]] }]; }, "<code>obj1</code> points to (1, 2)."],
      ["Point obj2 = new Point(10, 20)", (S) => { S.heap.p2 = { kind: "pt", v: [10, 20] }; S.frames[0].vars.push(["obj2", { ref: "p2" }]); }, "<code>obj2</code> points to (10, 20)."],
      ["swapValues(obj1, obj2);", (S) => S.frames.push({ name: "swapValues", vars: [["objA", { ref: "p1" }], ["objB", { ref: "p2" }]] }), "Copies of the two arrows."],
      ["int tempY = objA.y;", (S) => S.frames[1].vars.push(["tempX", 1], ["tempY", 2]), "Save the fields of the first object."],
      ["objA.y = objB.y;", (S) => { S.heap.p1.v = [10, 20]; }, "Write into the <b>object</b> that <code>objA</code> points to: it becomes (10, 20)."],
      ["objB.y = tempY;", (S) => { S.heap.p2.v = [1, 2]; }, "And the other object becomes (1, 2)."],
      ["swapValues(obj1, obj2);", (S) => S.frames.pop(), "Return. The objects themselves were changed."],
      ["\"obj2: x=\"", (S) => S.out.push("obj1: x=10 y=20", "obj2: x=1 y=2"), "<code>main</code> sees swapped contents.", "good"],
    ],
  },
  alias: {
    label: "b = a (6.7)", code: () => CODE.alias,
    steps: [
      ["int[] a = {1, 2, 3}", (S) => { S.heap.x = { kind: "arr", v: [1, 2, 3] }; S.frames = [{ name: "main", vars: [["a", { ref: "x" }]] }]; }, "<code>a</code> points to an array."],
      ["int[] b = a;", (S) => S.frames[0].vars.push(["b", { ref: "x" }]), "<code>b = a</code> copies the <b>arrow</b>. One array, two names (aliases)."],
      ["a.clone()", (S) => { S.heap.y = { kind: "arr", v: [1, 2, 3] }; S.frames[0].vars.push(["c", { ref: "y" }]); }, "<code>clone()</code> makes a second array with the same values."],
      ["b[0] = 99", (S) => { S.heap.x.v[0] = 99; }, "<code>b[0] = 99</code> writes into the array that <code>a</code> also points to."],
      ["\"c = \"", (S) => S.out.push("a = [99, 2, 3]", "b = [99, 2, 3]", "c = [1, 2, 3]"), "<code>a</code> changed too; the clone did not."],
      ["int[] d = {99, 2, 3}", (S) => { S.heap.z = { kind: "arr", v: [99, 2, 3] }; S.frames[0].vars.push(["d", { ref: "z" }]); }, "<code>d</code> is a different array with equal contents."],
      ["Arrays.equals(a, d)", (S) => S.out.push("a == b: true, a == d: false, Arrays.equals(a, d): true"), "<code>==</code> compares arrows (same array?); <code>Arrays.equals</code> compares contents.", "good"],
    ],
  },
};

function refsSVG(S) {
  // Narrow screens get a smaller drawing so the text stays readable.
  const narrow = window.innerWidth < 640;
  const W = narrow ? 340 : 600, frameX = 4, frameW = narrow ? 168 : 230, heapX = narrow ? 200 : 360, heapW = narrow ? 136 : 232, rowH = 30;
  const boxX = narrow ? 84 : 120, boxW = narrow ? 76 : 96;
  let y = 30;
  const varPos = [];
  let g = "";
  S.frames.forEach((f, fi) => {
    const top = y, h = 26 + f.vars.length * rowH + 6, isTop = fi === S.frames.length - 1;
    g += `<rect x="${frameX}" y="${top}" width="${frameW}" height="${h}" rx="8" fill="var(--card)" stroke="${isTop ? "var(--teal)" : "var(--line)"}" stroke-width="${isTop ? 2 : 1.2}"/>`;
    g += `<text x="${frameX + 10}" y="${top + 18}" font-size="13" font-weight="700" fill="${isTop ? "var(--teal)" : "var(--ink-2)"}">${esc(f.name)}</text>`;
    f.vars.forEach(([name, val], vi) => {
      const ry = top + 26 + vi * rowH;
      g += `<text x="${frameX + 14}" y="${ry + 19}" font-size="13" fill="var(--ink)">${esc(name)}</text>`;
      g += `<rect x="${frameX + boxX}" y="${ry + 2}" width="${boxW}" height="24" rx="5" fill="var(--paper-2)" stroke="var(--line)"/>`;
      if (val && typeof val === "object") {
        g += `<circle cx="${frameX + boxX + boxW / 2}" cy="${ry + 14}" r="4" fill="${fi === 0 ? "var(--teal)" : "var(--amber)"}"/>`;
        varPos.push({ x: frameX + boxX + boxW / 2, y: ry + 14, ref: val.ref, col: fi === 0 ? "var(--teal)" : "var(--amber)" });
      } else {
        g += `<text x="${frameX + boxX + boxW / 2}" y="${ry + 19}" font-size="13" font-weight="600" text-anchor="middle" fill="var(--ink)">${esc(val)}</text>`;
      }
    });
    y += h + 10;
  });
  const leftH = y;
  // Heap objects.
  let hy = 30;
  const objPos = {};
  Object.entries(S.heap).forEach(([id, o]) => {
    let h = 34, inner = "";
    const op = o.dead ? 0.38 : 1;
    if (o.kind === "arr") {
      const cw = Math.min(40, (heapW - 16) / o.v.length);
      inner = o.v.map((v, k) => `<rect x="${heapX + 8 + k * cw}" y="${hy + 6}" width="${cw - 3}" height="22" rx="4" fill="var(--paper-2)" stroke="var(--line)"/><text x="${heapX + 8 + k * cw + (cw - 3) / 2}" y="${hy + 22}" font-size="12" font-weight="600" text-anchor="middle" fill="var(--ink)">${v}</text>`).join("");
    } else {
      const label = o.kind === "sb" ? `"${o.v}"` : `Point (${o.v[0]}, ${o.v[1]})`;
      inner = `<text x="${heapX + heapW / 2}" y="${hy + 22}" font-size="13" font-weight="600" text-anchor="middle" fill="var(--ink)">${esc(label)}</text>`;
    }
    g += `<g opacity="${op}"><rect x="${heapX}" y="${hy}" width="${heapW}" height="${h}" rx="8" fill="var(--mark)" stroke="var(--amber)"/>${inner}`;
    g += `<text x="${heapX + heapW - 4}" y="${hy + h + 12}" font-size="10" text-anchor="end" fill="var(--stone)">${o.kind === "sb" ? "StringBuffer" : o.kind === "arr" ? "int[]" : "Point"}${o.dead ? " · garbage" : ""}</text></g>`;
    objPos[id] = { x: heapX, y: hy + h / 2 };
    hy += h + 22;
  });
  varPos.forEach((v) => {
    const o = objPos[v.ref];
    if (!o) return;
    const mx = (v.x + o.x) / 2;
    g += `<path d="M ${v.x} ${v.y} C ${mx + 30} ${v.y}, ${mx - 30} ${o.y}, ${o.x - 2} ${o.y}" fill="none" stroke="${v.col}" stroke-width="1.8" marker-end="url(#l3ah)"/>`;
  });
  const H = Math.max(leftH, hy) + 6;
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="variables and objects">
    <defs><marker id="l3ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="var(--ink-2)"/></marker></defs>
    <text x="${frameX}" y="16" font-size="12" fill="var(--stone)">frames (variables)</text>
    <text x="${heapX}" y="16" font-size="12" fill="var(--stone)">heap (objects)</text>${g}</svg>`;
}

function demoRefs(el, { start = "append" } = {}) {
  let key = start;
  makePlayer(el, {
    code: () => REF_SCENARIOS[key].code(), codeMax: 440,
    extraControls: `<label>example <select class="rf-s">${Object.entries(REF_SCENARIOS).map(([k, s]) => `<option value="${k}" ${k === key ? "selected" : ""}>${s.label}</option>`).join("")}</select></label>`,
    build() {
      const sc = REF_SCENARIOS[key];
      const code = sc.code();
      const S = { frames: [], heap: {}, out: [] };
      let lastLine = 1;
      return sc.steps.map(([needle, fn, msg, cls]) => {
        fn(S);
        // Search forward from the previous line first, so repeated text finds the right spot.
        const line = lineOf(code, needle, lastLine) || lineOf(code, needle);
        lastLine = line || lastLine;
        return { line, msg, msgCls: cls || "", out: S.out.slice(), state: JSON.parse(JSON.stringify(S)) };
      });
    },
    view: (s) => refsSVG(s.state),
    onMount(root, rebuild) {
      root.querySelector(".rf-s").onchange = (e) => { key = e.target.value; rebuild(); };
    },
  });
}

// ---------- 7 · letter frequency ----------

function demoFrequency(el) {
  let letters = ["A", "B", "C", "B", "A"];
  const codeFor = () => CODE.letterFrequency.replace("{'A', 'B', 'C', 'B', 'A'}", `{${letters.map((c) => `'${c}'`).join(", ")}}`);
  const AZ = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];
  makePlayer(el, {
    code: codeFor,
    extraControls: field("lf-t", letters.join(""), 160, "letters (A–Z)"),
    build() {
      const code = codeFor();
      const freq = Array(26).fill(0);
      const snaps = [];
      const out = [];
      const snap = (line, k, idx, msg, cls = "") => snaps.push({ line, k, idx, freq: freq.slice(), msg, msgCls: cls, out: out.slice(), stats: [["letter", k === null ? "–" : letters[k]], ["letter − 'A'", idx === null ? "–" : idx]] });
      snap(lineOf(code, "new int[26]"), null, null, "26 counters, all 0: index 0 for 'A', …, 25 for 'Z'.");
      letters.forEach((c, k) => {
        const idx = c.charCodeAt(0) - 65;
        freq[idx]++;
        snap(lineOf(code, "frequency[letter - 'A']++"), k, idx, `'${c}' − 'A' = ${c.charCodeAt(0)} − 65 = ${idx}: add 1 to <code>frequency[${idx}]</code>. No searching: the letter <em>is</em> the index.`);
      });
      for (let i = 0; i < 26; i++) {
        if (freq[i] > 0) { out.push(`${AZ[i]}: ${freq[i]}`); snap(lineOf(code, "System.out.println(letter"), null, i, `<code>frequency[${i}]</code> = ${freq[i]} &gt; 0: print '${AZ[i]}'.`); }
      }
      snaps[snaps.length - 1].msg += ` One pass over the n letters plus one over the 26 counters: O(n + 26) = O(n).`;
      snaps[snaps.length - 1].msgCls = "good";
      return snaps;
    },
    view: (s) => cellsHTML(letters, { cls: (k) => (k === s.k ? "cur" : s.k !== null && k < s.k ? "done" : "") }) +
      `<div class="l3-grid">${AZ.map((c, i) => `<div class="l3-col"><div class="l3-cell ${i === s.idx ? "cur" : s.freq[i] ? "done" : "out"}">${s.freq[i]}</div><div class="l3-idx">${c}</div></div>`).join("")}</div>`,
    onMount(root, rebuild) {
      root.querySelector(".lf-t").onchange = (e) => {
        const ls = [...e.target.value.toUpperCase()].filter((c) => c >= "A" && c <= "Z").slice(0, 16);
        if (ls.length) letters = ls;
        e.target.value = letters.join("");
        rebuild();
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

// Demo registry: each data-demo attribute in chapters.js mounts the DEMOS entry of that name.
const DEMOS = {
  addressMini: (el) => demoAddress(el, { mini: true }),
  address: (el) => demoAddress(el),
  multiply: (el) => demoMultiply(el),
  jagged: (el) => demoJagged(el),
  jaggedMini: (el) => demoJagged(el, { mini: true }),
  sum: (el) => demoSum(el),
  insert: (el) => demoShift(el, { op: "insert" }),
  insertMini: (el) => demoShift(el, { op: "insert", mini: true }),
  remove: (el) => demoShift(el, { op: "delete" }),
  linear: (el) => demoLinear(el),
  binary: (el) => demoBinary(el),
  binaryMini: (el) => demoBinary(el, { mini: true }),
  race: (el) => demoRace(el),
  refs: (el) => demoRefs(el, { start: "primitive" }),
  refsSwap: (el) => demoRefs(el, { start: "swapElements" }),
  frequency: (el) => demoFrequency(el),
  quiz: (el) => demoQuiz(el, QUIZ),
};
