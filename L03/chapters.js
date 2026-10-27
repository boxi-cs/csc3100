// Chapter content, adapted from notes/L03-arrays.md. Code and outputs come from CODE / OUT
// in demos.js, which are copied from the note.

const demo = (name, title, instr, hint = "") =>
  `<div class="card demo" data-demo="${name}"><div class="head"><span class="title">${title}</span><span>${instr}</span></div>
   <div class="demo-body"></div>${hint ? `<p class="hint">${hint}</p>` : ""}</div>`;

const callout = (kind, label, body) => `<div class="callout ${kind}"><b>${label}</b>${body}</div>`;
const predict = (q, a) => callout("predict", "PREDICT", `<p>${q}</p><details class="reveal"><summary>Show the answer</summary>${a}</details>`);
const prog = (key) => codeBlock(CODE[key]) + (OUT[key] !== undefined ? codeBlock(OUT[key], "out") : "");
const sol = (key, after = "") => `<details class="reveal"><summary>Solution</summary>${prog(key)}${after}</details>`;
const pre = (text) => `<pre class="code nonum out" style="overflow-x:auto">${esc(text)}</pre>`;

const LECTURE = {
  number: 3,
  title: "Arrays",
  tagline: "Many values, one name, one step to any of them",
  lead: "The array ADT, how an array sits in memory, multi-dimensional and jagged arrays, insertion and deletion by shifting, linear and binary search, and what a method can change when you pass it an array — with demos you can step through and edit.",
  heroDemo: "addressMini",
  heroLabel: "Random access · address(arr[i]) = base + i × size",
  heroCaption: "Any index costs the same: one multiplication and one addition.",
  whyTitle: "Why arrays come first",
  whySub: "Three ideas that the rest of the course builds on",
  why: [
    ["Random access", "Cells are side by side, so <code>a[i]</code> is found by arithmetic, not by searching: <b>O(1)</b> for any index."],
    ["Order has a price", "Keeping elements contiguous and in order means <b>shifting</b> them on every insertion or deletion in the middle: O(n)."],
    ["Sorted pays off", "On a sorted array, <b>binary search</b> finds a value among a billion in about 30 comparisons."],
  ],
  ctaTitle: "Ready to look inside an array?",
  minutes: "About 70–90 minutes",
  videos: {
    "media/L03-1.mp4": "Lecture 3 · Part 1 — What an array is, in memory (11.4 min)",
    "media/L03-2.mp4": "Lecture 3 · Part 2 — Kinds of arrays, and visiting every cell (10.5 min)",
    "media/L03-3.mp4": "Lecture 3 · Part 3 — Insertion, deletion and search (10.4 min)",
    "media/L03-4.mp4": "Lecture 3 · Part 4 — Passing arrays and objects to methods (10.5 min)",
  },
};

const CHAPTERS = [
  {
    slug: "1-array", nav: "What an array is", title: "What an Array Is",
    subtitle: "The ADT, the Java syntax, and the memory layout behind random access",
    abstract: "An array is a row of numbered cells of one type, side by side in memory. Because the cells are the same size and contiguous, the address of any cell is a simple formula of its index.",
    tags: ["array ADT", "base address", "random access", "default values"],
    hero: "addressMini", heroCaption: "Jumping straight to a cell: the address is computed, not searched for.",
    sections: [
      { id: "video-1", title: "Watch: What an array is, in memory", html: `
        <div class="card video" data-video="media/L03-1.mp4"></div>` },
      { id: "adt", title: "The array ADT", html: `
        <p>Arrays are among the oldest and most important data structures: almost every language has them, they represent vectors and matrices, and stacks, queues, heaps and hash tables are built on them. The simplest kind is the <b>one-dimensional</b> array, a row of cells numbered 0, 1, 2, …</p>
        <p>An <b>abstract data type</b> (ADT) says <em>what</em> operations a type offers, not how they are implemented. The array ADT has three:</p>
        <table><tr><th>operation</th><th>meaning</th><th>in Java</th></tr>
        <tr><td><code>createArray(n)</code></td><td>make an array of n cells</td><td><code>new int[n]</code></td></tr>
        <tr><td><code>retrieve(arr, i)</code></td><td>return the item in position i</td><td><code>arr[i]</code></td></tr>
        <tr><td><code>store(arr, i, item)</code></td><td>put item into position i</td><td><code>arr[i] = item</code></td></tr></table>
        <p>Because the ADT hides the implementation, we can design algorithms against it. <b>Linear search</b> only uses <code>retrieve</code>: look at positions 0, 1, 2, … in turn, and return the first index whose value matches, or −1.</p>
        ${codeBlock(CODE.linearSearch)}
        <p><b>The dimension product.</b> Given vectors a<sub>1</sub> and a<sub>2</sub> of length n, compute a<sub>3</sub> with a<sub>3</sub>[i] = a<sub>1</sub>[i] · a<sub>2</sub>[i]. With the ADT: for each i, retrieve both values, multiply, and store the product in a<sub>3</sub>. In Java, the method also checks that the lengths match, because otherwise <code>a2[i]</code> would run off the end:</p>
        ${codeBlock(CODE.vectorOps)}
        ${prog("dimensionProduct")}
        ${demo("multiply", "Demo 1 · createArray, retrieve, store", "← → keys step", "Make the two arrays different lengths to see the check fire.")}` },
      { id: "java", title: "Arrays in Java: declare, index, loop", html: `
        <p>Use a <b>named constant</b> for the length, so the number appears once and has a name. The index can be any <code>int</code> expression. Loop by index when you need the position; use the <b>for-each</b> loop when you only need the values.</p>
        ${prog("judgeScores")}
        <p><code>scores[(a + b) / 2]</code> is <code>scores[2]</code>, because <code>/</code> on two <code>int</code>s rounds towards zero.</p>` },
      { id: "memory", title: "How an array sits in memory", html: `
        <p>An <b>array</b> is a collection of items of the <b>same type</b> stored in <b>contiguous memory locations</b>. It is a <b>linear</b> data structure: every element except the last has exactly one next element.</p>
        <p>The address of the first cell is the <b>base address</b>. Every cell has the same size, so</p>
        <div class="math-block">address(a[i]) = base + i × (size of one element)</div>
        <p>For 12 <code>int</code>s (4 bytes each) stored from address 200, <code>arr[11]</code> is at 200 + 11 × 4 = 244. The machine does one multiplication and one addition, whatever the index and however long the array: <b>accessing <code>a[i]</code> is O(1)</b>. This is <b>random access</b>, the defining strength of an array, and it is why indices start at 0: the index is the <em>offset</em> from the base.</p>
        ${demo("address", "Demo 2 · Where is arr[i]?", "change the type or the base", "Switch to <code>double</code> (8 bytes) and watch every address change while the access stays one step.")}
        ${prog("addressTable")}
        <p>(Java never shows real addresses, so the base here is made up. C and C++ let you print them, and you would see exactly this pattern.) The <b>length</b> is fixed when the array is created; read it with <code>arr.length</code>, a field with no parentheses.</p>
        ${predict("An array of <code>double</code> (8 bytes each) starts at address 1000. Where is <code>d[5]</code>? Where would it be if indices started at 1?",
          "<p>1000 + 5 × 8 = <b>1040</b>. With indices from 1, the cell numbered 5 is the fifth cell, at 1000 + (5 − 1) × 8 = 1032, so every access would need an extra subtraction.</p>")}` },
      { id: "kinds", title: "Primitive arrays and object arrays", html: `
        <p>A <b>primitive array</b> (<code>int[]</code>, <code>double[]</code>, <code>char[]</code>, …) stores the values themselves. An <b>object array</b> (<code>String[]</code>, any class) stores <b>references</b>: each cell is an arrow to an object elsewhere on the heap, or <code>null</code>. In both cases the variable itself holds a reference to the array, because an array is an object.</p>
        ${pre(`int[] nums = {10, 20, 30, 40};         String[] names = new String[3];
                                        names[0] = "Ada"; ...
nums --> | 10 | 20 | 30 | 40 |          names --> |  •  |  •  |  •  |
                                                     |     |     |
                                                     v     v     v
                                                   "Ada" "Alan" "Grace"`)}
        <p>(A Python list works like a Java object array: every cell is a reference.) The general form is <code>type[] identifier = new type[length];</code>, and Java fills a new array with <b>default values</b>: 0 for numbers, <code>'\\u0000'</code> for <code>char</code>, <code>false</code> for <code>boolean</code>, <code>null</code> for references.</p>
        ${prog("defaultValues")}
        <p>An index outside <code>0 … length − 1</code> is a run-time error: Java checks every access (C does not).</p>
        ${prog("outOfBounds")}
        <p>The second <code>println</code> never prints; the program stops with <code style="overflow-wrap:anywhere">java.lang.ArrayIndexOutOfBoundsException: Index 5 out of bounds for length 5</code>.</p>
        ${callout("pitfall", "PITFALL · OFF BY ONE", "<p>The last element is <code>arr[arr.length - 1]</code>, and a loop runs while <code>i &lt; arr.length</code>, not <code>i &lt;= arr.length</code>.</p>")}` },
      { id: "why", title: "Why do we need arrays?", html: `
        <p>Keep five students' marks in <code>v1 … v5</code> and every sum must name every variable; with 500 students you would need 500 names. An array <b>represents many values with one variable</b>: <code>marks[0] … marks[499]</code>, and one loop handles them all, however many there are.</p>` },
    ],
    takeaways: ["Create, retrieve, store: the array ADT.", "address = base + i × size: O(1) access.", "Indices run 0 … length − 1; Java checks them."],
  },
  {
    slug: "2-types", nav: "Types", title: "Types of Arrays",
    subtitle: "Fixed or dynamic; one, two, three dimensions; and jagged",
    abstract: "Arrays are classified by size (fixed or dynamic) and by dimension. In Java a two-dimensional array is an array of one-dimensional arrays, which is why its rows may have different lengths.",
    tags: ["ArrayList", "matrix", "jagged array", "3-D array"],
    hero: "jaggedMini", heroCaption: "A jagged array: each row is its own array with its own length.",
    sections: [
      { id: "video-2", title: "Watch: Kinds of arrays, and visiting every cell", html: `
        <div class="card video" data-video="media/L03-2.mp4"></div>` },
      { id: "fixed", title: "Fixed-size arrays", html: `
        <p>A Java array has a fixed size: the length is chosen at <code>new</code> and never changes.</p>
        ${codeBlock(`int[] arr1 = new int[5];          // five cells, all 0
int[] arr2 = {1, 2, 3, 4, 5};     // create and initialise in one step`)}
        <p>If you don't know in advance how many elements there will be, a fixed size is awkward: too large wastes memory, too small doesn't fit.</p>` },
      { id: "dynamic", title: "Dynamic arrays", html: `
        <p>A <b>dynamic array</b> changes its size as the program runs. Java's <code>ArrayList</code> (and Python's <code>list</code>) is one:</p>
        ${prog("dynamicArray")}
        <p>Inside, an <code>ArrayList</code> is an ordinary fixed-size array that is only partly full. When it is full, <code>add</code> allocates a <b>bigger array</b> and copies everything across. Copying costs O(n), but because the capacity grows by a constant factor (about 1.5× in <code>ArrayList</code>), it happens rarely, and adding at the end costs O(1) <em>on average</em> (amortised). The idea, with doubling:</p>
        ${prog("growableArray")}` },
      { id: "twod", title: "One- and two-dimensional arrays", html: `
        <p>A <b>one-dimensional</b> array is a single row, each element with one index. A <b>two-dimensional</b> array is a <b>matrix</b>: element <code>a[row][col]</code>. In Java it is literally <b>an array of 1-D arrays</b>: <code>a[i]</code> is row i, itself an <code>int[]</code>.</p>
        ${codeBlock(`int[][] A = new int[3][2];                  // 3 rows, 2 columns, all 0
int[][] A = {{1, 4}, {2, 5}, {3, 6}};       // rows {1, 4}, {2, 5}, {3, 6}`)}
        <p>The six elements are <code>A[0][0], A[0][1], A[1][0], A[1][1], A[2][0], A[2][1]</code>; the three 1-D arrays are <code>A[0], A[1], A[2]</code>. (Java also accepts the C-style <code>int A[][]</code>, but <code>int[][] A</code> keeps the type together.)</p>
        ${prog("matrix")}
        <p><code>a.length</code> is the number of rows; <code>a[i].length</code> is the length of row i.</p>
        ${callout("note", "ROW-MAJOR ORDER", "<p>C stores an R × C matrix row after row in one block, so address(a[i][j]) = base + (i · C + j) × size. Java instead stores each row as a separate array and the outer array holds references to the rows: each row is contiguous, but different rows may be anywhere.</p>")}` },
      { id: "jagged", title: "Jagged arrays", html: `
        <p>Because each row is its own array, the rows of a Java 2-D array <b>may have different lengths</b>: a <b>jagged</b> (ragged) array. Uses: each student takes a different number of courses; a triangular or sparse matrix stores only the cells it needs.</p>
        ${prog("multidimensionalArray")}
        <p>The inner loop runs to <code>a[i].length</code>, the length of <em>this</em> row; <code>a[0].length</code> would be wrong here. (“1th” and “2th” are just what the string concatenation produces.)</p>
        ${demo("jagged", "Demo 3 · Walk a jagged array", "edit the rows, then step", "Type rows separated by semicolons, e.g. <code>1 2; 3; 4 5 6 7</code>.")}
        <p>A jagged array can be built row by row: create the outer array with the number of rows only, then give each row its own length. These are the first rows of Pascal's triangle:</p>
        ${prog("triangle")}` },
      { id: "threed", title: "Three-dimensional arrays", html: `
        <p>A <b>3-D array</b> is an array of 2-D arrays: a stack of matrices, with <code>a[k][i][j]</code> being row i, column j of matrix k. The for-each loop peels off one dimension at a time:</p>
        ${prog("threeDimensionalArray")}
        <p>The loop variable's type tells you what you get: an element of <code>int[][][]</code> is an <code>int[][]</code>, an element of that is an <code>int[]</code>, and an element of that is an <code>int</code>. This array is jagged in two ways: the two matrices have different numbers of rows, and the rows have different lengths.</p>` },
    ],
    takeaways: ["Fixed size, or an ArrayList that grows by copying.", "A 2-D array is an array of row arrays.", "Rows may differ in length: use a[i].length."],
  },
  {
    slug: "3-traversal", nav: "Traversal", title: "Traversal",
    subtitle: "Visit every element once: for, while, for-each",
    abstract: "Traversal is the first of the basic operations: visit each element once, in order, to read it, total it, convert it, or find and change it.",
    tags: ["for", "while", "for-each", "O(n)"],
    hero: "code:traversal", heroCaption: "Three loops, one traversal",
    sections: [
      { id: "loops", title: "Three loops", html: `
        <p>The basic array operations are <b>traversal</b>, <b>insertion</b>, <b>deletion</b> and <b>search</b> (linear and binary). <b>Traversal</b> visits each element once, in order. For <code>arr = {10, 20, 30, 40, 50}</code> the first element is at index 0 and the last at index 4.</p>
        ${prog("traversal")}
        <ul><li>The <b>for</b> loop is the usual choice: index, condition and step on one line.</li>
        <li>The <b>while</b> loop suits loops that may stop for another reason (say, at the first negative number).</li>
        <li>The <b>for-each</b> loop gives the values without indices. It cannot tell you where you are, and assigning to the loop variable does not change the array.</li></ul>
        <p>All three look at each of the n elements once: <b>O(n) time, O(1) extra space</b>.</p>
        ${predict(`What does this print?${codeBlock(`int[] arr = {1, 2, 3};
for (int value : arr) {
    value = value * 10;
}
System.out.println(Arrays.toString(arr));`)}`,
          "<p><code>[1, 2, 3]</code>. <code>value</code> is a copy of each element; changing the copy leaves the array alone. To change the elements, use the indexed loop: <code>arr[i] = arr[i] * 10</code>.</p>")}` },
      { id: "sum", title: "Sum and average", html: `
        ${prog("sumAverage")}
        <p>The cast <code>(double) sum</code> matters: <code>sum / numbers.length</code> divides two <code>int</code>s and gives 3, not 3.6. Casting one operand is enough.</p>
        ${demo("sum", "Demo 4 · A running total", "edit the numbers, then step", "Try numbers whose average is a whole number: Java still prints it as a <code>double</code>, e.g. <code>4.0</code>.")}` },
      { id: "convert", title: "Converting a String array to an int array", html: `
        <p>Traversal also builds one array from another. <code>Integer.parseInt</code> turns the text <code>"10"</code> into the number 10:</p>
        ${prog("stringToInt")}
        <p>Strictly this is a <em>conversion</em> (parsing text), not a cast: <code>(int) "10"</code> does not compile.</p>` },
      { id: "modify", title: "Searching and modifying while traversing", html: `
        <p>A traversal can stop early. Here we look for 30, add 5 to it, and stop with <code>break</code>:</p>
        ${prog("searchAndModify")}
        <p>Only the matching element changes. To add 5 to <em>every</em> element, drop the <code>if</code> and the <code>break</code>.</p>` },
    ],
    takeaways: ["Traversal: each element once, O(n).", "for-each gives copies of the values.", "Cast before dividing to get a double."],
  },
  {
    slug: "4-insert-delete", nav: "Insert & delete", title: "Insertion and Deletion",
    subtitle: "Keeping the order means shifting the neighbours",
    abstract: "To insert in the middle of an array, every later element must move one place right; to delete, one place left. That shifting is why both cost O(n).",
    tags: ["shifting", "partly filled array", "O(n)"],
    hero: "insertMini", heroCaption: "Insert 25 at index 2: shift from the right end, then fill the gap.",
    sections: [
      { id: "video-3", title: "Watch: Insertion, deletion and search", html: `
        <div class="card video" data-video="media/L03-3.mp4"></div>` },
      { id: "insertion", title: "Insertion", html: `
        <p><b>Insertion</b> adds a new element at a given position while keeping the order of the others:</p>
        <ol><li><b>Identify the position</b> where the new element goes.</li><li><b>Shift</b> the elements from there onwards one place to the right.</li><li><b>Insert</b> the new value into the gap.</li><li><b>Update the size</b>, if the array keeps a count.</li></ol>
        <table><tr><th>insert 25 into [10, 20, 30, 40, 50] at</th><th>result</th></tr>
        <tr><td>index 2</td><td><code>[10, 20, 25, 30, 40, 50]</code></td></tr>
        <tr><td>index 0</td><td><code>[25, 10, 20, 30, 40, 50]</code></td></tr>
        <tr><td>the end (index 5)</td><td><code>[10, 20, 30, 40, 50, 25]</code></td></tr></table>
        <p>A Java array cannot grow, so the simplest correct method makes a <b>new array one longer</b> and copies across. Two indices walk along: <code>i</code> in the new array and <code>j</code> in the old one; <code>j</code> does not advance when the new element is placed.</p>
        ${prog("insertCopy")}` },
      { id: "inplace", title: "Insertion by shifting, in place", html: `
        <p>Most real code (including <code>ArrayList</code>) keeps a <b>partly filled array</b>: <code>data</code> with spare room at the end and a count <code>size</code> of the cells in use. Insertion then shifts in place, starting <b>from the right end</b>. Deletion is the mirror image: shift left, starting just after the deleted element.</p>
        ${codeBlock(CODE.arrayShift)}
        ${prog("shiftDemo")}
        ${demo("insert", "Demo 5 · Insert by shifting", "edit arr, index, value; ← →", "Switch the method to “new array (copy)” to replay <code>InsertCopy</code>. Insert at index 0 to see the worst case: every element moves.")}
        ${predict("Someone shifts from the left instead: <code>for (int k = index; k &lt; size; k++) data[k + 1] = data[k];</code>. What happens when 25 is inserted at index 2 of <code>[10, 20, 30, 40, 50]</code>?",
          "<p><code>data[3] = data[2]</code> copies 30 over 40, then <code>data[4] = data[3]</code> copies that 30 over 50, and so on: every cell from index 2 on becomes 30, and then <code>data[2] = 25</code> gives <code>[10, 20, 25, 30, 30, 30]</code>. Shifting right must start at the right end so that each value moves <em>before</em> it is overwritten.</p>")}` },
      { id: "deletion", title: "Deletion", html: `
        <p><b>Deletion</b> removes the element at a given position while keeping the order of the others: identify the position, <b>shift</b> the later elements one place left, update the size. From <code>[10, 20, 30, 40, 50]</code>: deleting index 2 gives <code>[10, 20, 40, 50]</code>; index 0 gives <code>[20, 30, 40, 50]</code>; the last gives <code>[10, 20, 30, 40]</code>. The copying version makes a new array one shorter and skips the deleted position:</p>
        ${prog("deleteCopy")}
        ${demo("remove", "Demo 6 · Delete by shifting", "edit arr and index; ← →", "Delete the last element: nothing moves. Delete index 0: everything after it moves.")}` },
      { id: "cost", title: "The cost", html: `
        <p>Inserting at index k of an array with n elements moves the n − k elements after it; deleting at k moves n − k − 1.</p>
        <table><tr><th>operation</th><th>elements moved</th><th>time</th></tr>
        <tr><td>read or write <code>a[i]</code></td><td>0</td><td>O(1)</td></tr>
        <tr><td>insert / delete at the <b>end</b></td><td>0</td><td>O(1) (if there is room)</td></tr>
        <tr><td>insert / delete at the <b>front</b></td><td>n or n − 1</td><td>O(n)</td></tr>
        <tr><td>insert / delete in the middle</td><td>about n/2 on average</td><td>O(n)</td></tr>
        <tr><td>the copying versions</td><td>always n</td><td>O(n), plus O(n) extra space</td></tr></table>
        <p>This is the big weakness of arrays: changing the <em>middle</em> is slow, because the elements must stay contiguous and in order. The linked list (Lecture 7) fixes exactly this, at the price of losing random access.</p>` },
    ],
    takeaways: ["Insert: shift right, from the right end.", "Delete: shift left, from just after the gap.", "Both O(n); only the end is O(1)."],
  },
  {
    slug: "5-search", nav: "Search", title: "Linear and Binary Search",
    subtitle: "Look at everything, or halve a sorted range",
    abstract: "Linear search works on any array and may look at every element. Binary search needs a sorted array and throws away half of the candidates with each comparison.",
    tags: ["linear search", "binary search", "O(n) vs O(log n)"],
    hero: "binaryMini", heroCaption: "L, M, R close in: each comparison halves the candidates.",
    sections: [
      { id: "linear", title: "Linear search", html: `
        <p><b>Linear search</b> (sequential search) is the simplest search: traverse the array one element at a time, compare each with the target, and return the index of the first match. If none matches, continue to the end and return −1 (<code>LinearSearch.search</code> from Chapter 1).</p>
        ${prog("linearSearchDemo")}
        ${demo("linear", "Demo 7 · Linear search", "edit a and searchNum; ← →", "Search for 35: every element is compared before the method gives up.")}
        <p><b>Cost.</b> Best case 1 comparison; worst case n (last or absent); if the target is present and equally likely anywhere, (n + 1)/2 on average. Linear search is <b>O(n)</b>, and it works on any array, sorted or not.</p>` },
      { id: "binary", title: "Binary search", html: `
        <p><b>Binary search</b> is the efficient search for <b>sorted</b> arrays, by <b>divide and conquer</b>: compare the target with the middle element; if equal, stop; if the target is larger it can only be in the right half; if smaller, only in the left half. Each comparison throws away half of the range, until the target is found or the range is empty.</p>
        ${codeBlock(CODE.binarySearch)}
        ${prog("binarySearchDemo")}
        ${demo("binary", "Demo 8 · Binary search", "edit the array and target; ← →", "Try an <em>unsorted</em> array such as <code>50, 10, 40, 20, 30</code> and search for 10: binary search misses it without any error.")}
        <p>The same loop with a line printed at every step shows the halving:</p>
        ${prog("binarySearchTrace")}
        <p>In words, the search for 35: the middle of 0–4 is 2, and 30 &lt; 35, so only 3–4 remain. The middle of 3–4 is 3, and 40 &gt; 35, so only 3–2 remain, which is empty. Not found after two comparisons instead of five.</p>
        ${predict("Which comparisons does <code>binarySearch</code> make on <code>{3, 8, 15, 21, 30, 42, 57, 64}</code> when searching for 57? And for 4?",
          "<p>For 57: middle 3 (21 &lt; 57, go right to 4–7), middle 5 (42 &lt; 57, go right to 6–7), middle 6 (57, found): three comparisons, returns 6. For 4: middle 3 (21 &gt; 4, go left to 0–2), middle 1 (8 &gt; 4, go left to 0–0), middle 0 (3 &lt; 4, go right to 1–0, empty): three comparisons, returns −1.</p>")}` },
      { id: "midpoint", title: "Why left + (right − left) / 2?", html: `
        <p>It equals <code>(left + right) / 2</code>, but <code>left + right</code> can overflow when the indices are large: an <code>int</code> holds at most 2 147 483 647, and the sum wraps around to a negative number.</p>
        ${prog("midpointOverflow")}` },
      { id: "cost", title: "The cost", html: `
        <p>Each step halves the range: n, n/2, n/4, …, 1. After k steps about n/2<sup>k</sup> elements remain, so at most about log<sub>2</sub> n + 1 steps are needed. Binary search is <b>O(log n)</b>.</p>
        <table><tr><th>n</th><th>linear search, worst case</th><th>binary search, worst case</th></tr>
        <tr><td>8</td><td>8</td><td>4</td></tr><tr><td>1 000</td><td>1 000</td><td>10</td></tr>
        <tr><td>1 000 000</td><td>1 000 000</td><td>20</td></tr><tr><td>1 000 000 000</td><td>1 000 000 000</td><td>30</td></tr></table>
        ${demo("race", "Demo 9 · How many comparisons?", "drag n")}
        ${callout("pitfall", "PITFALL · BINARY SEARCH NEEDS SORTED DATA", "<p>On an unsorted array it does not crash; it silently gives wrong answers, because the half it throws away may contain the target. The method above assumes <b>increasing</b> order. For an array sorted in decreasing order, the two comparisons must be swapped (go <em>left</em> when <code>arr[middle] &lt; target</code>).</p>")}` },
    ],
    takeaways: ["Linear search: any array, O(n).", "Binary search: sorted only, O(log n).", "Use left + (right − left) / 2."],
  },
  {
    slug: "6-references", nav: "References", title: "Passing Arrays and Objects to Methods",
    subtitle: "Java passes everything by value — sometimes the value is an arrow",
    abstract: "A method gets copies of its arguments. For an array or object, the copy is a reference to the same object: the method can change the object, but it cannot make the caller's variable point anywhere else.",
    tags: ["pass-by-value", "reference", "swap", "alias"],
    hero: "code:swapElements", heroCaption: "The wrong swap and the right one",
    sections: [
      { id: "video-4", title: "Watch: Passing arrays and objects to methods", html: `
        <div class="card video" data-video="media/L03-4.mp4"></div>` },
      { id: "rule", title: "Pass-by-value and pass-by-reference", html: `
        <ul><li><b>Pass-by-value</b>: the argument's value is copied into the parameter, a new variable. Assigning to the parameter does not affect the caller.</li>
        <li><b>Pass-by-reference</b>: the method receives the caller's variable itself (its memory location), so assigning to the parameter changes the caller's variable (C++ <code>int&amp; x</code>).</li></ul>
        <p><b>Java always passes by value.</b> But for an array or object, the value in the variable is a <b>reference</b> (an arrow to the object). Passing it copies the <em>arrow</em>, not the object, so caller and method hold two arrows to the <b>same</b> object.</p>
        ${callout("pattern", "THE ONE RULE", "<p>A method <b>can change the object</b> an argument points to (through its copy of the arrow), but it <b>cannot make the caller's variable point somewhere else</b>. The slides call the object examples “pass-by-reference”; what they show is a reference passed by value.</p>")}
        ${demo("refs", "Demo 10 · Variables and objects", "pick an example, then step", "Teal arrows belong to <code>main</code>; amber arrows to the method that is running. Watch which arrows move and which objects change.")}` },
      { id: "primitive", title: "A primitive argument", html: `
        ${prog("passByValue")}
        <p><code>change</code> gets its own <code>i</code>, initialised with a copy of 5. Setting it to 10 does not touch <code>main</code>'s <code>i</code>.</p>` },
      { id: "object", title: "Changing the object vs reassigning the parameter", html: `
        ${prog("appendExample")}
        <p><code>t</code> is a copy of the reference in <code>s</code>, so both point to the same <code>StringBuffer</code>; <code>append</code> changes that object, and <code>main</code> sees it.</p>
        ${prog("reassignExample")}
        <p>Now the first line of <code>change</code> points <code>t</code> at a <b>new</b> object. From then on <code>t</code> and <code>s</code> point to different objects; <code>append</code> changes only the new one, which becomes <code>"Hi, world !"</code> and is thrown away when <code>change</code> returns.</p>
        ${predict(`An array is an object too. After the calls, what is <code>x</code>?${codeBlock(`static void zeroFirst(int[] a) { a[0] = 0; }
static void replace(int[] a) { a = new int[] {0, 0, 0}; }
...
int[] x = {7, 8, 9};
zeroFirst(x);
replace(x);`)}`,
          `<p><code>[0, 8, 9]</code>. <code>zeroFirst</code> changes the array through its copy of the reference, like <code>append</code>. <code>replace</code> only points its own parameter at a new array.</p>${prog("arrayParameter")}`)}` },
      { id: "swap", title: "Swapping two array elements", html: `
        <p>How do we swap element i with element n − i − 1? Passing the two elements passes two <em>numbers</em>, and the method swaps its own copies. Passing the array and two positions works, because the method changes the array's cells through the reference.</p>
        ${prog("swapElements")}
        <p>The loop swaps pairs (0, 4) and (1, 3) and stops at <code>n / 2</code>, reversing <code>[5, 2, 3, 4, 1]</code> to <code>[1, 4, 3, 2, 5]</code>. (Running it to <code>n</code> would swap every pair twice and change nothing.)</p>
        ${demo("refsSwap", "Demo 11 · swapWrong vs swapElements", "← → keys step")}` },
      { id: "objects", title: "Swapping two objects", html: `
        ${codeBlock(CODE.point)}
        ${prog("swapObjects")}
        <p>Inside <code>swap</code> the swap works, but <code>objA</code> and <code>objB</code> are the method's own copies of the references:</p>
        <ol><li>On entry: <code>obj1</code> and <code>objA</code> point to (1, 2); <code>obj2</code> and <code>objB</code> to (10, 20).</li><li><code>tmp = objA</code>: <code>tmp</code> also points to (1, 2).</li><li><code>objA = objB</code>: <code>objA</code> now points to (10, 20).</li><li><code>objB = tmp</code>: <code>objB</code> now points to (1, 2).</li></ol>
        <p><code>obj1</code> and <code>obj2</code> were never assigned. To swap the <em>contents</em>, change the objects through the references:</p>
        ${prog("swapValues")}
        <p>(Python's <code>obj1, obj2 = obj2, obj1</code> swaps two variables in one line. Java has no such statement: swap variables with three assignments where they live, in the caller.) Choose “swap two objects” and “swap the contents” in Demo 10 to watch both.</p>` },
      { id: "alias", title: "Assigning an array copies the reference", html: `
        <p><code>int[] b = a;</code> copies the reference: <code>a</code> and <code>b</code> are two names (<b>aliases</b>) for one array. For an independent copy use <code>a.clone()</code> or <code>Arrays.copyOf(a, a.length)</code>. Likewise <code>==</code> asks “same array?”, while <code>Arrays.equals</code> compares contents.</p>
        ${prog("alias")}
        ${callout("pitfall", "PITFALL · b = a IS NOT A COPY", "<p>Changing <code>b[0]</code> changes <code>a[0]</code>, because there is only one array. And <code>a == d</code> is <code>false</code> even when the contents are equal; use <code>Arrays.equals</code>.</p>")}` },
    ],
    takeaways: ["Java passes by value; for objects the value is a reference.", "Change the object: visible. Reassign the parameter: not.", "b = a makes an alias; clone() makes a copy."],
  },
  {
    slug: "7-summary", nav: "Summary", title: "Summary and Practice",
    subtitle: "Pros and cons, two worked exercises, and practice problems",
    abstract: "A one-page map of the lecture, the trade-offs of arrays, six self-check questions, two worked exercises and eight practice problems with solutions.",
    tags: ["knowledge map", "self-check", "exercises"],
    hero: "toc",
    sections: [
      { id: "map", title: "Knowledge map", html: `<div class="map">
        <div class="card"><h3>What an array is</h3><ul><li>Same type, <b>contiguous</b> cells</li><li>ADT: create, retrieve, store</li><li>address = base + i × size</li><li>Random access: O(1)</li></ul></div>
        <div class="card"><h3>Java arrays</h3><ul><li>Fixed length, <code>arr.length</code></li><li>Defaults: 0, false, null</li><li>Bad index → exception</li><li><code>ArrayList</code> grows by copying</li></ul></div>
        <div class="card"><h3>Dimensions</h3><ul><li>2-D = array of row arrays</li><li>Rows may differ: <b>jagged</b></li><li>Loop to <code>a[i].length</code></li><li>3-D = array of 2-D arrays</li></ul></div>
        <div class="card"><h3>Operations</h3><ul><li>Traversal: O(n)</li><li>Insert: shift right from the end</li><li>Delete: shift left after the gap</li><li>Both O(n); at the end O(1)</li></ul></div>
        <div class="card"><h3>Search</h3><ul><li>Linear: any array, O(n)</li><li>Binary: <b>sorted</b> only, O(log n)</li><li>Mid = left + (right − left) / 2</li></ul></div>
        <div class="card"><h3>References</h3><ul><li>Java passes by value</li><li>Objects: the value is an arrow</li><li>Change object ✓, reassign ✗</li><li><code>b = a</code> is an alias</li></ul></div></div>` },
      { id: "pros", title: "Pros and cons of arrays", html: `
        <p><b>Pros.</b> Given the index, an element is found in one step (O(1)). A sorted array can be searched with binary search (O(log n)). Arrays are compact and are the underlying structure of stacks, queues, heaps, hash tables and dynamic arrays.</p>
        <p><b>Cons.</b> The capacity is fixed at creation; growing means a new array and copying (O(n)). Inserting or deleting between two elements means moving all the later elements first (O(n)).</p>
        <table><tr><th>operation</th><th>unsorted array</th><th>sorted array</th></tr>
        <tr><td>access <code>a[i]</code></td><td>O(1)</td><td>O(1)</td></tr>
        <tr><td>search for a value</td><td>O(n) linear</td><td>O(log n) binary</td></tr>
        <tr><td>insert / delete at the end</td><td>O(1)</td><td>— (order must be kept)</td></tr>
        <tr><td>insert / delete in the middle</td><td>O(n)</td><td>O(n)</td></tr></table>` },
      { id: "check", title: "Check your understanding", html: `<div data-demo="quiz"><div class="demo-body"></div></div>` },
      { id: "frequency", title: "Worked exercise: a letter frequency table", html: `
        <p><em>Given an array of upper-case letters such as <code>{'A', 'B', 'C', 'B', 'A'}</code>, count how often each letter occurs.</em></p>
        <p>Comparing every letter with every other is O(n²). Better: there are only 26 letters, so keep 26 counters and map <code>'A'</code> to index 0, …, <code>'Z'</code> to 25. A <code>char</code> is a number (its Unicode code), so <code>letter - 'A'</code> is exactly that index, and one traversal does all the counting: <b>O(n)</b>.</p>
        ${prog("letterFrequency")}
        ${demo("frequency", "Demo 12 · Counting with an index table", "type letters, then step")}
        <p>Using the value itself as an index into a table of counters is a <b>counting</b> (direct-address) table. It comes back in counting sort and hashing.</p>` },
      { id: "big", title: "Worked exercise: more elements than one array holds", html: `
        <p><em>A Java array has at most <code>Integer.MAX_VALUE</code> (2 147 483 647) elements, and real JVMs refuse slightly fewer. How can we store a larger set?</em></p>
        <p>Use an <b>array of arrays</b>: split the elements into chunks of size C = 2<sup>b</sup>, each its own <code>int[]</code>, kept in an outer array. Element i (a <code>long</code>) lives in chunk <code>i &gt;&gt;&gt; b</code> at offset <code>i &amp; (C − 1)</code>. Access is still O(1).</p>
        ${codeBlock(CODE.bigIntArray)}
        ${prog("bigIntArrayDemo")}
        <p>(The demo uses tiny chunks so it runs anywhere; five billion <code>int</code>s would need 20 GB.)</p>` },
      { id: "exercises", title: "Exercises", html: `
        <p>★ basic · ★★ needs a small idea. Write each as a static method, then test it on an empty array, a one-element array and a normal one.</p>
        <h3>Exercise 1 ★ (reverse an array)</h3><p>Reverse an array in place.</p>
        ${sol("reverse", "<p>Two indices move towards each other and swap; they stop when they meet. O(n) time, O(1) extra space.</p>")}
        <h3>Exercise 2 ★ (check if sorted)</h3><p>Return <code>true</code> if the array is in non-decreasing order.</p>
        ${sol("checkSorted", "<p>Compare each element with the one before it. Starting at <code>i = 1</code> handles lengths 0 and 1 without a special case.</p>")}
        <h3>Exercise 3 ★ (leaders)</h3><p>An element is a <em>leader</em> if it is greater than every element to its right (the last element always is). Find the leaders of <code>{16, 17, 4, 3, 5, 2}</code>.</p>
        ${sol("leaders", "<p>Checking each element against everything to its right is O(n²). Scanning from the right while remembering the largest value so far is one pass, O(n).</p>")}
        <h3>Exercise 4 ★★ (remove duplicates from a sorted array)</h3><p>In place, keep one copy of each value at the front and return how many distinct values there are.</p>
        ${sol("removeDuplicates", "<p>In a sorted array equal values are adjacent, so a value is new exactly when it differs from the last value kept. One pass, no shifting.</p>")}
        <h3>Exercise 5 ★★ (zeroes to the end)</h3><p>Move all zeros to the end, keeping the order of the other elements.</p>
        ${sol("zeroesToEnd", "<p>Deleting each zero by shifting costs O(n) per zero, O(n²) in all. Copying the non-zeros forward with a write index <code>k</code> is O(n); the read position is never behind <code>k</code>, so nothing is overwritten before it is read.</p>")}
        <h3>Exercise 6 ★★ (rotate an array)</h3><p>Rotate left by <code>d</code> positions using O(1) extra space: <code>{1, …, 7}</code> rotated by 2 is <code>{3, 4, 5, 6, 7, 1, 2}</code>.</p>
        ${sol("rotate", "<p>Reverse the first d elements (<code>2 1 | 3 4 5 6 7</code>), reverse the rest (<code>2 1 | 7 6 5 4 3</code>), then reverse the whole array (<code>3 4 5 6 7 1 2</code>). O(n) time, O(1) space.</p>")}
        <h3>Exercise 7 ★★ (missing number)</h3><p>An array holds n − 1 distinct numbers from 1 to n. Find the missing one.</p>
        ${sol("missingNumber", "<p>1 + 2 + … + n = n(n + 1)/2; subtract the actual sum. The sum is a <code>long</code> so it cannot overflow.</p>")}
        <h3>Exercise 8 ★★ (maximum subarray sum)</h3><p>Find the largest sum of a contiguous, non-empty part of the array. For <code>{2, 3, -8, 7, -1, 2, 3}</code> it is 11.</p>
        ${sol("maxSubarraySum", "<p>Trying all O(n²) subarrays is slow. Kadane's algorithm keeps the best sum of a subarray <em>ending at</em> the current position: extend the previous one or start afresh at <code>a[i]</code>, whichever is larger. One pass, O(n).</p>")}
        <p>More practice in the same spirit: print alternate elements, generate all subarrays, two sum, equilibrium index, missing and repeating number, duplicates within distance k, stock buy and sell with multiple transactions, maximum consecutive 1s with k flips.</p>` },
      { id: "terms", title: "Key terms and reading", html: `
        <p class="tags">${["array", "array ADT", "contiguous memory", "base address", "random access", "length", "primitive array", "object array", "default value", "ArrayIndexOutOfBoundsException", "dynamic array", "ArrayList", "capacity", "matrix", "row-major", "jagged array", "traversal", "for-each", "insertion", "deletion", "shifting", "linear search", "binary search", "divide and conquer", "pass-by-value", "reference", "alias", "counting table"].map((t) => `<span class="tag">${t}</span>`).join("")}</p>
        <ul><li>Textbook Chapter 1; write and test the code of this lecture yourself. Next lecture: insertion sort and merge sort (Chapter 2).</li>
        <li>Binary search and its cost: CLRS, <em>Introduction to Algorithms</em> (3rd ed.), Exercise 2.3-5. Arrays and <code>ArrayList</code>: Weiss, <em>Data Structures and Algorithm Analysis in Java</em>, §1.4 and §3.4.</li>
        <li>An animation of array operations: <a href="https://visualgo.net/en/array" target="_blank" rel="noopener">visualgo.net/en/array</a>.</li></ul>` },
    ],
    takeaways: ["O(1) access, O(n) insert/delete in the middle.", "Sorted arrays allow O(log n) search.", "Use the value as an index when the range is small."],
  },
];

const QUIZ = [
  { q: "An <code>int[]</code> (4 bytes per element) starts at address 2000. What is the address of <code>a[25]</code>?",
    opts: ["2025", "2096", "2100", "2104"],
    a: 2, why: "2000 + 25 × 4 = 2100. Index 25 is the 26th cell, but its <em>offset</em> from the base is 25 cells." },
  { q: "What does <code>new boolean[3]</code> contain?",
    opts: ["three <code>null</code>s", "<code>[false, false, false]</code>", "whatever was in memory before", "nothing: it must be initialised before use"],
    a: 1, why: "Java fills a new array with default values: <code>false</code> for <code>boolean</code>, 0 for numbers, <code>null</code> for references." },
  { q: "Inserting into position 0 of a partly filled array holding n elements moves how many elements?",
    opts: ["0", "1", "n / 2", "n"],
    a: 3, why: "All n elements move one place right before the new one goes in: the worst case, O(n)." },
  { q: "Binary search on <code>{10, 20, 30, 40, 50, 60, 70}</code> for 70: which elements are compared, in order?",
    opts: ["10, 20, …, 70", "40, 60, 70", "40, 50, 60, 70", "70"],
    a: 1, why: "middle 3 → 40 &lt; 70, left = 4; middle 5 → 60 &lt; 70, left = 6; middle 6 → 70, found. Three comparisons." },
  { q: "What does this print?",
    code: `static void grow(int[] a) {
    a = new int[a.length + 1];
    a[0] = 42;
}
// in main:
int[] x = {1, 2};
grow(x);
System.out.println(x[0] + " " + x.length);`,
    opts: ["<code>42 3</code>", "<code>1 2</code>", "<code>42 2</code>", "an exception"],
    a: 1, why: "<code>a = new int[...]</code> points the parameter at a new array; the caller's <code>x</code> still points to <code>{1, 2}</code>. A method cannot make the caller's variable point elsewhere." },
  { q: "<code>int[][] t = {{1}, {2, 3}, {4, 5, 6}};</code> What are <code>t.length</code> and <code>t[2].length</code>?",
    opts: ["3 and 3", "6 and 3", "3 and 6", "3 and 2"],
    a: 0, why: "<code>t</code> has 3 rows; row 2 is <code>{4, 5, 6}</code> with 3 elements. A 2-D array is an array of row arrays." },
];
