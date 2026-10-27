// Interactive demos for Lecture 4. Every code panel is copied from
// notes/L04-insertion-merge-sort.md (checked by tools/check.py); the JS twins below replay
// what the Java does, step by step, and give the same results.

const CODE = {
  insertionSort: `public class InsertionSort {
    // Sorts a into non-decreasing order.
    public static void insertionSort(int[] a) {
        for (int j = 1; j < a.length; j++) {
            int key = a[j];
            // Insert a[j] into the sorted prefix a[0..j-1].
            int i = j - 1;
            while (i >= 0 && a[i] > key) {
                a[i + 1] = a[i];   // shift a larger element one place right
                i--;
            }
            a[i + 1] = key;        // drop key into the hole
        }
    }
}`,
  insertionPseudo: `INSERTION-SORT(A)
1  for j = 2 to n
2      key = A[j]
3      // Insert A[j] into the sorted sequence A[1..j-1].
4      i = j - 1
5      while i > 0 and A[i] > key
6          A[i + 1] = A[i]
7          i = i - 1
8      A[i + 1] = key`,
  insertionTrace: `import java.util.Arrays;

public class InsertionSortTrace {
    public static void main(String[] args) {
        int[] a = {5, 2, 4, 6, 1, 3};
        System.out.println("start:          " + show(a, 1));
        for (int j = 1; j < a.length; j++) {
            int key = a[j];
            int i = j - 1;
            int shifts = 0;
            while (i >= 0 && a[i] > key) {
                a[i + 1] = a[i];
                i--;
                shifts++;
            }
            a[i + 1] = key;
            System.out.println("j = " + j + ", key = " + key + ": " + show(a, j + 1)
                    + "   shifts: " + shifts);
        }
    }

    // The array with a bar after the first \`sorted\` elements.
    static String show(int[] a, int sorted) {
        StringBuilder sb = new StringBuilder();
        for (int k = 0; k < a.length; k++) {
            if (k == sorted) {
                sb.append("| ");
            }
            sb.append(a[k]).append(' ');
        }
        return sb.toString().trim();
    }
}`,
  insertionTraceOut: `start:          5 | 2 4 6 1 3
j = 1, key = 2: 2 5 | 4 6 1 3   shifts: 1
j = 2, key = 4: 2 4 5 | 6 1 3   shifts: 1
j = 3, key = 6: 2 4 5 6 | 1 3   shifts: 0
j = 4, key = 1: 1 2 4 5 6 | 3   shifts: 4
j = 5, key = 3: 1 2 3 4 5 6   shifts: 3`,
  invariantOut: `before j = 1: a[0..0] = [5]  invariant true
before j = 2: a[0..1] = [2, 5]  invariant true
before j = 3: a[0..2] = [2, 4, 5]  invariant true
before j = 4: a[0..3] = [2, 4, 5, 6]  invariant true
before j = 5: a[0..4] = [1, 2, 4, 5, 6]  invariant true
loop ended with j = 6 = a.length
whole array sorted: true [1, 2, 3, 4, 5, 6]`,
  costOut: `     n   sorted: tests/shifts reversed: tests/shifts   random: tests/shifts
     6                  5 / 0                20 / 15                 12 / 7
    10                  9 / 0                54 / 45                40 / 31
   100                 99 / 0            5049 / 4950            2584 / 2485
  1000                999 / 0        500499 / 499500        238472 / 237473
 10000               9999 / 0    50004999 / 49995000    25015031 / 25005032`,
  hanoi: `public class Hanoi {
    static int moves = 0;

    // Moves n disks from tower \`from\` to tower \`to\`, using \`via\` as the spare tower.
    static void hanoi(int n, char from, char to, char via) {
        if (n == 1) {
            System.out.println("move disk 1 from " + from + " to " + to);
            moves++;
            return;
        }
        hanoi(n - 1, from, via, to);
        System.out.println("move disk " + n + " from " + from + " to " + to);
        moves++;
        hanoi(n - 1, via, to, from);
    }

    public static void main(String[] args) {
        hanoi(3, 'A', 'C', 'B');
        System.out.println(moves + " moves");
    }
}`,
  selfRef: `public static int f(int n) {
    if (n <= 0) {
        return 0;                   // base case
    } else {
        return f(n / 3 + 1) + n - 1; // recursion
    }
}`,
  selfRefFixed: `public static int f(int n) {
    if (n <= 1) {
        return 0;                    // base case, reached from every n
    } else {
        return f(n / 3 + 1) + n - 1; // n / 3 + 1 < n when n >= 2
    }
}`,
  fib: `static long fibonacci(int n) {
    calls++;
    if (n == 0) {
        return 0;                                // base cases
    }
    if (n == 1) {
        return 1;
    }
    return fibonacci(n - 1) + fibonacci(n - 2); // recursive case
}`,
  fibMemo: `static long fibonacci(int n, long[] memo) {
    calls++;
    if (n <= 1) {
        return n;                                 // base case
    }
    if (memo[n] == 0) {
        memo[n] = fibonacci(n - 1, memo) + fibonacci(n - 2, memo);
    }
    return memo[n];                               // reuse a computed value
}`,
  mergeSortPseudo: `MERGE-SORT(A, p, r)
1  if p < r                     // check for base case
2      q = floor((p + r) / 2)   // divide
3      MERGE-SORT(A, p, q)      // conquer
4      MERGE-SORT(A, q + 1, r)  // conquer
5      MERGE(A, p, q, r)        // combine`,
  mergeSortClass: `import java.util.Arrays;

public class MergeSort {
    // Merges the sorted runs a[l..m] and a[m+1..r] into one sorted run a[l..r].
    static void merge(int[] a, int l, int m, int r) {
        int[] left = Arrays.copyOfRange(a, l, m + 1);
        int[] right = Arrays.copyOfRange(a, m + 1, r + 1);
        int i = 0, j = 0, k = l;
        while (i < left.length && j < right.length) {
            if (left[i] <= right[j]) {   // <= keeps equal keys in order (stable)
                a[k] = left[i];
                i++;
            } else {
                a[k] = right[j];
                j++;
            }
            k++;
        }
        while (i < left.length) {        // copy what is left of either run
            a[k] = left[i];
            i++;
            k++;
        }
        while (j < right.length) {
            a[k] = right[j];
            j++;
            k++;
        }
    }

    // Sorts a[l..r] using merge().
    static void mergeSort(int[] a, int l, int r) {
        if (l < r) {
            int m = l + (r - l) / 2;     // find the middle point
            mergeSort(a, l, m);          // sort the first half
            mergeSort(a, m + 1, r);      // sort the second half
            merge(a, l, m, r);           // merge the sorted halves
        }
    }

    static void mergeSort(int[] a) {
        mergeSort(a, 0, a.length - 1);
    }
}`,
  merge: `// Merges the sorted runs a[l..m] and a[m+1..r] into one sorted run a[l..r].
static void merge(int[] a, int l, int m, int r) {
    int[] left = Arrays.copyOfRange(a, l, m + 1);
    int[] right = Arrays.copyOfRange(a, m + 1, r + 1);
    int i = 0, j = 0, k = l;
    while (i < left.length && j < right.length) {
        if (left[i] <= right[j]) {   // <= keeps equal keys in order (stable)
            a[k] = left[i];
            i++;
        } else {
            a[k] = right[j];
            j++;
        }
        k++;
    }
    while (i < left.length) {        // copy what is left of either run
        a[k] = left[i];
        i++;
        k++;
    }
    while (j < right.length) {
        a[k] = right[j];
        j++;
        k++;
    }
}`,
  mergeSort: `// Sorts a[l..r] using merge().
static void mergeSort(int[] a, int l, int r) {
    if (l < r) {
        int m = l + (r - l) / 2;     // find the middle point
        mergeSort(a, l, m);          // sort the first half
        mergeSort(a, m + 1, r);      // sort the second half
        merge(a, l, m, r);           // merge the sorted halves
    }
}`,
  mergeTraceOut: `compare 2 and 1: take 1 from right
compare 2 and 2: take 2 from left
compare 4 and 2: take 2 from right
compare 4 and 3: take 3 from right
compare 4 and 6: take 4 from left
compare 5 and 6: take 5 from left
compare 7 and 6: take 6 from right
right is empty: copy 7
[1, 2, 2, 3, 4, 5, 6, 7]`,
  recurrence: `public class MergeRecurrence {
    static long t(int n) {
        if (n == 1) {
            return 0;
        }
        return t((n + 1) / 2) + t(n / 2) + n;   // ceil(n/2) and floor(n/2)
    }

    public static void main(String[] args) {
        System.out.printf("%8s %10s %14s%n", "n", "T(n)", "n log2 n");
        for (int n : new int[] {1, 2, 4, 7, 8, 16, 100, 1024, 1000000}) {
            double nlogn = n * (Math.log(n) / Math.log(2));
            System.out.printf("%8d %10d %14.1f%n", n, t(n), nlogn);
        }
    }
}`,
  recurrenceOut: `       n       T(n)       n log2 n
       1          0            0.0
       2          2            2.0
       4          8            8.0
       7         20           19.7
       8         24           24.0
      16         64           64.0
     100        672          664.4
    1024      10240        10240.0
 1000000   19951424     19931568.6`,
  raceOut: `      n       insertion        merge
      8              24           15
     16              75           46
     32             287          117
     64            1206          305
   1000          238467         8675
  10000        25015022       120383
 100000      2499850084      1536269`,
  hybrid: `import java.util.Arrays;

public class HybridSort {
    static final int CUTOFF = 16;

    // Insertion sort on the range a[l..r].
    static void insertionSort(int[] a, int l, int r) {
        for (int j = l + 1; j <= r; j++) {
            int key = a[j];
            int i = j - 1;
            while (i >= l && a[i] > key) {
                a[i + 1] = a[i];
                i--;
            }
            a[i + 1] = key;
        }
    }

    static void hybridSort(int[] a, int l, int r) {
        if (r - l + 1 <= CUTOFF) {
            insertionSort(a, l, r);       // small piece: insertion sort
            return;
        }
        int m = l + (r - l) / 2;
        hybridSort(a, l, m);
        hybridSort(a, m + 1, r);
        MergeSort.merge(a, l, m, r);
    }

    public static void main(String[] args) {
        int[] a = new int[40];
        int x = 2026;
        for (int k = 0; k < a.length; k++) {
            x = (x * 75 + 74) % 65537;
            a[k] = x % 100;
        }
        int[] expected = a.clone();
        Arrays.sort(expected);
        hybridSort(a, 0, a.length - 1);
        System.out.println(Arrays.toString(a));
        System.out.println("matches Arrays.sort: " + Arrays.equals(a, expected));
    }
}`,
  hybridOut: `[0, 1, 2, 8, 15, 15, 15, 15, 16, 17, 19, 21, 24, 30, 34, 35, 36, 47, 48, 49, 50, 59, 60, 66, 67, 68, 68, 73, 75, 76, 77, 82, 89, 96, 96, 96, 97, 97, 98, 98]
matches Arrays.sort: true`,
  quickPseudo: `QUICKSORT(A, p, r)
1  if p < r
2      q = PARTITION(A, p, r)
3      QUICKSORT(A, p, q - 1)
4      QUICKSORT(A, q + 1, r)`,
  partitionPseudo: `PARTITION(A, p, r)
1  x = A[r]                 // the pivot
2  i = p - 1
3  for j = p to r - 1
4      if A[j] <= x
5          i = i + 1
6          exchange A[i] with A[j]
7  exchange A[i + 1] with A[r]
8  return i + 1`,
  quickSortClass: `public class QuickSort {
    static void swap(int[] a, int i, int j) {
        int t = a[i];
        a[i] = a[j];
        a[j] = t;
    }

    // Partitions a[p..r] around the pivot a[r]; returns the pivot's final index.
    static int partition(int[] a, int p, int r) {
        int x = a[r];
        int i = p - 1;
        for (int j = p; j < r; j++) {
            if (a[j] <= x) {
                i++;
                swap(a, i, j);
            }
        }
        swap(a, i + 1, r);
        return i + 1;
    }

    static void quickSort(int[] a, int p, int r) {
        if (p < r) {
            int q = partition(a, p, r);
            quickSort(a, p, q - 1);
            quickSort(a, q + 1, r);
        }
    }
}`,
  partition: `// Partitions a[p..r] around the pivot a[r]; returns the pivot's final index.
static int partition(int[] a, int p, int r) {
    int x = a[r];
    int i = p - 1;
    for (int j = p; j < r; j++) {
        if (a[j] <= x) {
            i++;
            swap(a, i, j);
        }
    }
    swap(a, i + 1, r);
    return i + 1;
}`,
  quickSort: `static void quickSort(int[] a, int p, int r) {
    if (p < r) {
        int q = partition(a, p, r);
        quickSort(a, p, q - 1);
        quickSort(a, q + 1, r);
    }
}`,
  partitionOut: `pivot x = 4
j = 0: 2 <= 4, i = 0, swap -> [2, 8, 7, 1, 3, 5, 6, 4]
j = 1: 8 >  4, i = 0           [2, 8, 7, 1, 3, 5, 6, 4]
j = 2: 7 >  4, i = 0           [2, 8, 7, 1, 3, 5, 6, 4]
j = 3: 1 <= 4, i = 1, swap -> [2, 1, 7, 8, 3, 5, 6, 4]
j = 4: 3 <= 4, i = 2, swap -> [2, 1, 3, 8, 7, 5, 6, 4]
j = 5: 5 >  4, i = 2           [2, 1, 3, 8, 7, 5, 6, 4]
j = 6: 6 >  4, i = 2           [2, 1, 3, 8, 7, 5, 6, 4]
pivot to index 3:                [2, 1, 3, 4, 7, 5, 6, 8]`,
};

// ---------- shared bits ----------

(function injectStyle() {
  if (document.getElementById("l04-style")) return;
  const s = document.createElement("style");
  s.id = "l04-style";
  s.textContent = `
  .l4 .cells { flex-wrap: nowrap; gap: 3px; }
  .l4 .cell { width: 44px; height: 40px; font-size: 14px; }
  .l4 .cell.sorted { background: var(--teal-soft); border-color: var(--teal); }
  .l4 .cell.cmp { background: var(--mark); border-color: var(--amber); }
  .l4 .cell.hole { border-style: dashed; color: transparent; background: transparent; }
  .l4 .cell.key { background: var(--amber); border-color: var(--amber); color: var(--paper); }
  .l4 .cell.ghost { visibility: hidden; }
  .l4 .cell.small { background: var(--teal-soft); border-color: var(--teal); }
  .l4 .cell.big { background: var(--card-2); border-color: var(--stone); }
  .l4 .cell.pivot { background: var(--mark); border-color: var(--amber); color: var(--amber); }
  .l4 .cell.done { background: var(--green-soft); border-color: var(--green); color: var(--green); }
  .l4 .cell.taken { opacity: 0.3; }
  .l4 .cell.empty { border-style: dashed; background: transparent; }
  .l4 .rowlab { font: 600 11px var(--mono); color: var(--stone); width: 48px; flex: none; text-align: right; padding-right: 6px; align-self: center; }
  .l4 .row { display: flex; align-items: center; justify-content: center; overflow-x: auto; }
  .l4 .chips { display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; margin: 6px 0; }
  .l4 .chip { font: 600 11px var(--mono); padding: 4px 9px; border-radius: 999px; border: 1px solid var(--line); color: var(--stone); }
  .l4 .chip.on { background: var(--teal); border-color: var(--teal); color: var(--paper); }
  .l4 .chip.ok { background: var(--green-soft); border-color: var(--green); color: var(--green); }
  .l4 .chain { font: 12px var(--mono); color: var(--ink-2); text-align: center; margin: 6px 0; overflow-x: auto; white-space: nowrap; }
  .l4 .legend { display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; font-size: 12px; color: var(--ink-2); margin-top: 6px; }
  .l4 .legend i { display: inline-block; width: 12px; height: 12px; border-radius: 3px; border: 1px solid var(--line); vertical-align: -2px; margin-right: 4px; }
  .l4 pre.code { font-size: 13px; }
  @media (max-width: 600px) {
    .l4 .cell { width: 32px; height: 34px; font-size: 12px; }
    .l4 .rowlab { width: 38px; font-size: 10px; }
    .l4 .ptr { font-size: 10px; }
  }`;
  document.head.appendChild(s);
})();

// Phone-width containers get a narrower drawing, so the scaled-down text stays readable.
const narrow = (el) => (el.clientWidth || 720) < 520;

const fmt = (xs) => "[" + xs.join(", ") + "]";

// The pseudo-random arrays of the Java programs: x = (x * 75 + 74) % 65537, starting from 2026.
function scrambled(n) {
  const a = [];
  let x = 2026;
  for (let k = 0; k < n; k++) { x = (x * 75 + 74) % 65537; a.push(x); }
  return a;
}

function cellRow(values, clsOf, opts = {}) {
  const ptrs = opts.ptrs || {};
  return `<div class="row">${opts.label ? `<span class="rowlab">${opts.label}</span>` : ""}<div class="cells">` +
    values.map((v, k) => `<div class="cellcol">${opts.top ? `<div class="ptr">${opts.top[k] || ""}</div>` : ""}<div class="cell ${clsOf(k) || ""}">${v === null || v === undefined ? "" : v}</div>` +
      (opts.idx === false ? "" : `<div class="cellidx">${k}</div>`) + (opts.ptrs ? `<div class="ptr">${ptrs[k] || ""}</div>` : "") + `</div>`).join("") +
    `</div></div>`;
}

// Step player for demos that draw their own picture. build() returns frames; each frame
// may carry {line, msg, msgCls}. render(frame, k) returns the picture's HTML.
function makePlayer(el, o) {
  const mini = !!o.mini;
  el.classList.add("l4");
  el.innerHTML = `<div class="pl-view"></div>
    ${o.code && !mini ? `<div class="pl-code"></div>` : ""}
    ${mini ? "" : `<div class="msg pl-msg"></div>
    <div class="controls">
      <button class="cbtn pl-reset" title="Back to the start">⟲ Reset</button>
      <button class="cbtn pl-back" title="Step back (←)">◀ Back</button>
      <button class="cbtn pl-step on" title="Step (→)">Step ▶</button>
      <button class="cbtn pl-play">Play</button>
      ${o.extraControls || ""}
      <span class="spacer"></span><span class="counter pl-count"></span>
    </div>`}`;
  const $ = (s) => el.querySelector(s);
  let frames = [], i = 0, timer = null, codeLines = [];
  function render() {
    const f = frames[i];
    $(".pl-view").innerHTML = o.render(f, i, frames);
    if (mini) return;
    codeLines.forEach((ln, k) => ln.classList.toggle("hl", k + 1 === f.line));
    const m = $(".pl-msg");
    m.innerHTML = f.msg || "";
    m.className = "msg pl-msg " + (f.msgCls || "");
    $(".pl-count").textContent = `step ${i + 1} / ${frames.length}`;
    $(".pl-back").disabled = $(".pl-reset").disabled = i === 0;
    $(".pl-step").disabled = i === frames.length - 1;
  }
  function stop() { clearInterval(timer); timer = null; if (!mini) $(".pl-play").textContent = "Play"; }
  function play() {
    if (timer) return stop();
    if (i === frames.length - 1) i = 0;
    if (!mini) $(".pl-play").textContent = "Pause";
    timer = setInterval(() => {
      if (i < frames.length - 1) i++;
      else if (mini) i = 0;
      else return stop();
      render();
    }, o.interval || (mini ? 750 : 650));
  }
  function rebuild() {
    stop();
    if (o.code && !mini) {
      $(".pl-code").innerHTML = codeBlock(typeof o.code === "function" ? o.code() : o.code);
      codeLines = [...el.querySelectorAll(".pl-code .ln")];
    }
    frames = o.build();
    i = 0;
    render();
  }
  if (!mini) {
    $(".pl-reset").onclick = () => { stop(); i = 0; render(); };
    $(".pl-back").onclick = () => { stop(); if (i > 0) i--; render(); };
    $(".pl-step").onclick = () => { stop(); if (i < frames.length - 1) i++; render(); };
    $(".pl-play").onclick = play;
    el.tabIndex = 0;
    el.addEventListener("keydown", (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "SELECT") return;
      if (e.key === "ArrowRight") { e.preventDefault(); $(".pl-step").click(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); $(".pl-back").click(); }
    });
  }
  if (o.onMount) o.onMount(el, rebuild);
  rebuild();
  if (mini) play();
  return { rebuild };
}

// A text input that reads at most `max` integers; on change it calls back with the numbers.
function numsInput(cls, value, width = 170) {
  return `<label>array <input type="text" class="${cls}" value="${value}" style="width:${width}px"></label>`;
}
function bindNums(root, cls, fallback, max, cb) {
  const inp = root.querySelector("." + cls);
  inp.onchange = () => {
    const xs = parseNums(inp.value, fallback).slice(0, max).map((x) => Math.max(-99, Math.min(999, x)));
    inp.value = xs.join(", ");
    cb(xs);
  };
}

// ---------- 1. insertion sort ----------

function traceInsertion(a0) {
  const a = a0.slice();
  const n = a.length;
  const frames = [];
  let tests = 0, shifts = 0;
  const f = (o) => frames.push({ a: a.slice(), tests, shifts, ...o });
  f({ j: null, hole: null, key: null, i: null, sorted: Math.min(1, n), line: 0,
    msg: `The first element alone is a sorted prefix. Insertion sort will insert the other ${Math.max(n - 1, 0)} elements one by one.` });
  for (let j = 1; j < n; j++) {
    const key = a[j];
    f({ j, hole: j, key, i: null, sorted: j, line: 5, msg: `<code>j = ${j}</code>: pick up <code>key = a[${j}] = ${key}</code>. Its cell becomes a hole.` });
    let i = j - 1;
    let hole = j;
    for (;;) {
      tests++;
      if (i >= 0 && a[i] > key) {
        f({ j, hole, key, i, sorted: j, line: 8, msg: `<code>a[${i}] = ${a[i]} &gt; ${key}</code>: it must move right.` });
        a[i + 1] = a[i];
        a[i] = null;
        shifts++;
        hole = i;
        f({ j, hole, key, i, sorted: j, line: 9, msg: `Shift ${a[i + 1]} into <code>a[${i + 1}]</code>; the hole moves left to index ${i}.` });
        i--;
      } else {
        f({ j, hole, key, i: i >= 0 ? i : null, sorted: j, line: 8,
          msg: i < 0 ? `<code>i = -1</code>: we reached the left end, so the test stops (and <code>a[-1]</code> is never read).`
            : `<code>a[${i}] = ${a[i]} &le; ${key}</code>: stop. The hole at index ${i + 1} is where ${key} belongs.` });
        break;
      }
    }
    a[i + 1] = key;
    f({ j, hole: null, key: null, placed: i + 1, i: null, sorted: j + 1, line: 12,
      msg: `Drop ${key} into <code>a[${i + 1}]</code>. Now <code>a[0..${j}]</code> is sorted.`, msgCls: "good" });
  }
  frames.push({ a: a.slice(), tests, shifts, sorted: n, line: 0, done: true,
    msg: `Sorted: <b>${a.join(" ")}</b>. While-tests: ${tests}, shifts: ${shifts}.`, msgCls: "good" });
  return frames;
}

function renderInsertion(f, mini) {
  const n = f.a.length;
  const top = f.a.map((_, k) => (k === f.hole && f.key !== null ? `<span class="m">key</span>` : ""));
  let keyRow = `<div class="row"><div class="cells">` + f.a.map((_, k) =>
    `<div class="cellcol"><div class="cell ${k === f.hole && f.key !== null ? "key" : "ghost"}">${k === f.hole && f.key !== null ? f.key : ""}</div></div>`).join("") + `</div></div>`;
  const ptrs = {};
  if (f.i !== null && f.i !== undefined) ptrs[f.i] = "i";
  if (f.j !== null && f.j !== undefined) ptrs[f.j] = (ptrs[f.j] ? ptrs[f.j] + " " : "") + "j";
  const row = cellRow(f.a.map((v) => v), (k) => {
    if (k === f.hole && f.key !== null) return "hole";
    if (f.done) return "done";
    if (k === f.placed) return "cmp";
    if (k === f.i && f.line === 8) return "cmp";
    return k < f.sorted || (f.hole !== null && f.hole !== undefined && k <= f.j && k !== f.hole) ? "sorted" : "";
  }, { ptrs: mini ? undefined : ptrs, idx: !mini });
  void top;
  const stats = mini ? "" : `<div class="stats"><div class="stat"><small>sorted prefix</small><b>a[0..${Math.max(f.sorted - 1, 0)}]</b></div>
    <div class="stat"><small>while-tests</small><b>${f.tests}</b></div><div class="stat"><small>shifts</small><b>${f.shifts}</b></div></div>`;
  return `<div class="svgbox">${keyRow}${row}</div>${mini ? "" : `<div class="legend"><span><i style="background:var(--teal-soft);border-color:var(--teal)"></i>sorted prefix</span><span><i style="background:var(--amber)"></i>key (lifted out)</span><span><i style="background:var(--mark);border-color:var(--amber)"></i>being compared</span></div>`}${stats}`;
  void n;
}

function demoInsertion(el, { mini = false } = {}) {
  let data = [5, 2, 4, 6, 1, 3];
  makePlayer(el, {
    mini,
    code: CODE.insertionSort,
    build: () => traceInsertion(data),
    render: (f) => renderInsertion(f, mini),
    interval: mini ? 650 : 650,
    extraControls: numsInput("ins-d", data.join(", ")) +
      `<button class="cbtn ins-p" data-p="sorted">sorted</button><button class="cbtn ins-p" data-p="rev">reversed</button>`,
    onMount(root, rebuild) {
      if (mini) return;
      bindNums(root, "ins-d", [5, 2, 4, 6, 1, 3], 9, (xs) => { data = xs; rebuild(); });
      root.querySelectorAll(".ins-p").forEach((b) => {
        b.onclick = () => {
          data = b.dataset.p === "sorted" ? [1, 2, 3, 4, 5, 6] : [6, 5, 4, 3, 2, 1];
          root.querySelector(".ins-d").value = data.join(", ");
          rebuild();
        };
      });
    },
  });
}

// ---------- 2. loop invariant ----------

function demoInvariant(el) {
  let data = [5, 2, 4, 6, 1, 3];
  function build() {
    const orig = data.slice();
    const a = data.slice();
    const n = a.length;
    const frames = [];
    const sameAs = (len) => a.slice(0, len).sort((x, y) => x - y).join() === orig.slice(0, len).sort((x, y) => x - y).join();
    const sorted = (len) => a.slice(0, len).every((v, k) => k === 0 || a[k - 1] <= v);
    for (let j = 1; j < n; j++) {
      frames.push({ a: a.slice(), j, len: j, phase: j === 1 ? "init" : "maint", ok: sorted(j) && sameAs(j), line: 4,
        msg: (j === 1 ? `<b>Initialization.</b> Before the first iteration, <code>j = 1</code>: the prefix <code>a[0..0]</code> is one element, the original one, so it is sorted.`
          : `<b>Maintenance.</b> Before iteration <code>j = ${j}</code>: <code>a[0..${j - 1}]</code> = ${fmt(a.slice(0, j))} holds the original first ${j} elements, sorted.`) });
      const key = a[j];
      let i = j - 1;
      while (i >= 0 && a[i] > key) { a[i + 1] = a[i]; i--; }
      a[i + 1] = key;
      frames.push({ a: a.slice(), j, len: j + 1, phase: "maint", ok: sorted(j + 1) && sameAs(j + 1), line: 12, inserted: i + 1,
        msg: `The body inserts ${key} at index ${i + 1}: everything left of it is ≤ ${key}, everything right of it (up to index ${j}) is &gt; ${key}. So <code>a[0..${j}]</code> is sorted, and <code>j++</code> restores the invariant.` });
    }
    frames.push({ a: a.slice(), j: n, len: n, phase: "term", ok: sorted(n) && sameAs(n), line: 4, msgCls: "good",
      msg: `<b>Termination.</b> The test <code>j &lt; a.length</code> fails when <code>j = ${n}</code> (not ${n - 1}!). Substitute into the invariant: <code>a[0..${n - 1}]</code>, the whole array, is the original elements in sorted order.` });
    return frames;
  }
  makePlayer(el, {
    code: CODE.insertionSort,
    build,
    render: (f) => {
      const chips = [["init", "Initialization"], ["maint", "Maintenance"], ["term", "Termination"]].map(([k, t]) =>
        `<span class="chip ${f.phase === k ? "on" : ""}">${t}</span>`).join("");
      const row = cellRow(f.a, (k) => (k === f.inserted ? "cmp" : k < f.len ? (f.phase === "term" ? "done" : "sorted") : ""),
        { ptrs: { [Math.min(f.j, f.a.length - 1)]: f.j < f.a.length ? "j" : "" } });
      return `<div class="chips">${chips}</div><div class="svgbox">${row}
        <div class="chain">invariant: a[0..${f.len - 1}] is the original a[0..${f.len - 1}], sorted &nbsp;→&nbsp; <b style="color:var(--${f.ok ? "green" : "red"})">${f.ok}</b></div></div>`;
    },
    extraControls: numsInput("inv-d", data.join(", ")),
    onMount(root, rebuild) { bindNums(root, "inv-d", [5, 2, 4, 6, 1, 3], 9, (xs) => { data = xs.length ? xs : [5]; rebuild(); }); },
  });
}

// ---------- 3. counting t_j ----------

function costArray(kind, n) {
  if (kind === "sorted") return Array.from({ length: n }, (_, k) => k);
  if (kind === "reversed") return Array.from({ length: n }, (_, k) => n - k);
  return scrambled(n);
}

function demoCost(el, { mini = false } = {}) {
  let kind = mini ? "reversed" : "reversed";
  let n = mini ? 10 : 10;
  function build() {
    const a = costArray(kind, n);
    const t = [];
    const frames = [{ t: [], sum: 0, msg: `${kind === "random" ? "A pseudo-random" : "A " + kind} array of n = ${n}. For each j (textbook numbering, j = 2..n) we count t<sub>j</sub>, the executions of the while test.` }];
    for (let j = 1; j < n; j++) {
      const key = a[j];
      let i = j - 1, tj = 1;
      while (i >= 0 && a[i] > key) { a[i + 1] = a[i]; i--; tj++; }
      a[i + 1] = key;
      t.push(tj);
      const sum = t.reduce((x, y) => x + y, 0);
      frames.push({ t: t.slice(), sum,
        msg: `j = ${j + 1}: key ${key} made ${tj - 1} shift${tj === 2 ? "" : "s"}, so t<sub>${j + 1}</sub> = ${tj}${kind === "reversed" ? ` = j` : kind === "sorted" ? " (the test fails at once)" : ""}.` });
    }
    const last = frames[frames.length - 1];
    last.msgCls = "good";
    last.msg += ` Total: Σt<sub>j</sub> = ${last.sum}, shifts Σ(t<sub>j</sub> − 1) = ${last.sum - (n - 1)}.`;
    return frames;
  }
  makePlayer(el, {
    mini,
    build,
    interval: mini ? 500 : 600,
    render: (f) => {
      const W = narrow(el) ? 400 : 640, H = 210, maxT = n, bw = (W - 50) / Math.max(n - 1, 1);
      let g = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="t_j bars">`;
      g += `<line x1="40" y1="${H - 26}" x2="${W - 6}" y2="${H - 26}" stroke="var(--line)"/>`;
      for (let k = 0; k < n - 1; k++) {
        const x = 44 + k * bw;
        const ghost = kind === "reversed" ? k + 2 : null;
        if (ghost && !mini) g += `<rect x="${x + 2}" y="${H - 26 - (ghost / maxT) * (H - 50)}" width="${bw - 4}" height="${(ghost / maxT) * (H - 50)}" fill="none" stroke="var(--line)" stroke-dasharray="3 3"/>`;
        if (k < f.t.length) {
          const h = (f.t[k] / maxT) * (H - 50);
          const last = k === f.t.length - 1;
          g += `<rect x="${x + 2}" y="${H - 26 - h}" width="${bw - 4}" height="${h}" rx="3" fill="var(--${last ? "amber" : "teal"})"/>`;
          if (bw > 16) g += `<text x="${x + bw / 2}" y="${H - 30 - h}" font-size="11" text-anchor="middle" fill="var(--ink)">${f.t[k]}</text>`;
        }
        if (bw > 14 || k % 5 === 3) g += `<text x="${x + bw / 2}" y="${H - 10}" font-size="10" text-anchor="middle" fill="var(--stone)">${k + 2}</text>`;
      }
      g += `<text x="6" y="16" font-size="11" fill="var(--stone)">t_j</text><text x="${W - 6}" y="${H - 10}" font-size="10" text-anchor="end" fill="var(--stone)"></text></svg>`;
      if (mini) return `<div class="svgbox">${g}</div>`;
      const best = n - 1, worst = (n * (n + 1)) / 2 - 1;
      return `<div class="svgbox">${g}</div><div class="stats">
        <div class="stat"><small>Σ t_j so far</small><b>${f.sum}</b></div>
        <div class="stat"><small>best case n − 1</small><b>${best}</b></div>
        <div class="stat"><small>worst n(n+1)/2 − 1</small><b>${worst}</b></div>
        <div class="stat"><small>shifts so far</small><b>${f.sum - f.t.length}</b></div></div>`;
    },
    extraControls: `<label>input <select class="cost-k"><option value="sorted">sorted</option><option value="reversed" selected>reversed</option><option value="random">random</option></select></label>
      <label>n <input type="range" class="cost-n" min="2" max="40" value="${n}"> <b class="cost-nv mono">${n}</b></label>`,
    onMount(root, rebuild) {
      if (mini) return;
      root.querySelector(".cost-k").onchange = (e) => { kind = e.target.value; rebuild(); };
      root.querySelector(".cost-n").oninput = (e) => { n = +e.target.value; root.querySelector(".cost-nv").textContent = n; rebuild(); };
    },
  });
}

// ---------- 4. Tower of Hanoi ----------

function hanoiFrames(n) {
  const pegs = { A: [], B: [], C: [] };
  for (let d = n; d >= 1; d--) pegs.A.push(d);
  const frames = [];
  const out = [];
  const calls = [];
  const snap = (msg, moved = null, msgCls = "") => frames.push({
    pegs: { A: pegs.A.slice(), B: pegs.B.slice(), C: pegs.C.slice() }, out: out.slice(), calls: calls.slice(), moved, msg, msgCls,
  });
  snap(`${n} disk${n > 1 ? "s" : ""} on tower A. Goal: move them all to C. Call <code>hanoi(${n}, 'A', 'C', 'B')</code>.`);
  function hanoi(k, from, to, via) {
    calls.push(`hanoi(${k},${from},${to},${via})`);
    const move = () => {
      pegs[to].push(pegs[from].pop());
      out.push(`move disk ${k} from ${from} to ${to}`);
    };
    if (k === 1) {
      move();
      snap(`Base case <code>n = 1</code>: move disk 1 from ${from} to ${to}.`, 1, "good");
      calls.pop();
      return;
    }
    hanoi(k - 1, from, via, to);
    move();
    snap(`The top ${k - 1} disk${k > 2 ? "s are" : " is"} out of the way on ${via}. Move the largest of this call, disk ${k}, from ${from} to ${to}.`, k);
    hanoi(k - 1, via, to, from);
    calls.pop();
  }
  hanoi(n, "A", "C", "B");
  out.push(`${2 ** n - 1} moves`);
  snap(`Done: all ${n} disks are on C after ${2 ** n - 1} = 2<sup>${n}</sup> − 1 moves.`, null, "good");
  return frames;
}

function demoHanoi(el, { mini = false } = {}) {
  let n = 3;
  makePlayer(el, {
    mini,
    interval: mini ? 900 : 800,
    build: () => hanoiFrames(n),
    render: (f) => {
      const W = narrow(el) ? 380 : 600, H = 190, base = H - 26, dh = Math.min(20, 120 / n), u = W / 600;
      let g = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="towers">`;
      g += `<rect x="20" y="${base}" width="${W - 40}" height="6" rx="3" fill="var(--stone)"/>`;
      ["A", "B", "C"].forEach((p, k) => {
        const cx = W / 6 + k * (W / 3);
        g += `<rect x="${cx - 3}" y="${base - 140}" width="6" height="140" rx="3" fill="var(--line)"/>`;
        g += `<text x="${cx}" y="${H - 4}" font-size="13" text-anchor="middle" font-weight="700" fill="var(--ink-2)">${p}</text>`;
        f.pegs[p].forEach((d, h) => {
          const w = (30 + (d / n) * 120) * u;
          const isMoved = d === f.moved && h === f.pegs[p].length - 1;
          g += `<rect x="${cx - w / 2}" y="${base - (h + 1) * dh}" width="${w}" height="${dh - 2}" rx="4" fill="var(--${isMoved ? "amber" : "teal"})" opacity="${0.55 + 0.45 * (d / n)}"/>`;
          if (dh >= 14) g += `<text x="${cx}" y="${base - h * dh - dh / 2 + 3}" font-size="11" text-anchor="middle" fill="var(--paper)">${d}</text>`;
        });
      });
      g += "</svg>";
      if (mini) return `<div class="svgbox">${g}</div>`;
      return `<div class="svgbox">${g}</div><div class="chain">${f.calls.length ? "calls in progress: " + f.calls.join(" → ") : "&nbsp;"}</div>
        <div class="console">${esc(f.out.join("\n"))}</div>`;
    },
    extraControls: `<label>disks <input type="range" class="hn-n" min="1" max="6" value="${n}"> <b class="hn-nv mono">${n}</b></label>`,
    onMount(root, rebuild) {
      if (mini) return;
      root.querySelector(".hn-n").oninput = (e) => { n = +e.target.value; root.querySelector(".hn-nv").textContent = n; rebuild(); };
    },
  });
}

// ---------- 5. self-reference: the slide's f and the fixed f ----------

function traceSelfRef(n0, fixed) {
  const t = new Tracer();
  const LIMIT = 9;
  let overflow = false;
  function f(n) {
    const fr = t.push(`f(${n})`, { n });
    t.snap(1, `New frame for <code>f(${n})</code>.`);
    const base = fixed ? n <= 1 : n <= 0;
    t.snap(2, `Is <code>n &lt;= ${fixed ? 1 : 0}</code>? ${base ? "Yes: base case." : "No."}`);
    if (base) { fr.status = "returns 0"; fr.cls = "ret"; t.snap(3, `<code>f(${n})</code> returns 0.`, "good"); t.pop(); return 0; }
    const arg = Math.trunc(n / 3) + 1;
    fr.status = `waiting: f(${arg}) + ${n - 1}`;
    if (t.stack.length >= LIMIT) {
      overflow = true;
      t.stack.forEach((x) => { x.cls = "err"; });
      t.snap(5, `<code>f(${n})</code> calls <code>f(${n} / 3 + 1)</code> = <code>f(${arg})</code> again… The argument never drops below 1, so the stack keeps growing until Java throws <b>StackOverflowError</b>.`, "bad");
      return null;
    }
    t.snap(5, `<code>${n} / 3 + 1 = ${arg}</code> (integer division). Call <code>f(${arg})</code>.${arg >= n ? ` <b>That is not smaller than ${n}!</b>` : ""}`, arg >= n ? "bad" : "");
    const sub = f(arg);
    if (sub === null) return null;
    const r = sub + n - 1;
    fr.status = `returns ${sub} + ${n - 1} = ${r}`; fr.cls = "ret";
    t.snap(5, `<code>f(${arg})</code> returned ${sub}, so <code>f(${n})</code> = ${sub} + ${n} − 1 = <b>${r}</b>.`, "good");
    t.pop();
    return r;
  }
  const r = f(n0);
  if (!overflow) t.snap(0, `Done: <code>f(${n0})</code> = <b>${r}</b>.`, "good");
  return t.snaps;
}

function demoSelfRef(el) {
  let n = 10, fixed = false;
  makeStepper(el, {
    code: () => (fixed ? CODE.selfRefFixed : CODE.selfRef),
    build: () => traceSelfRef(n, fixed),
    extraControls: `<label>version <select class="sr-v"><option value="0">slide (n &lt;= 0)</option><option value="1">fixed (n &lt;= 1)</option></select></label>
      <label>n <input type="range" class="sr-n" min="0" max="30" value="${n}"> <b class="sr-nv mono">${n}</b></label>`,
    onMount(root, rebuild) {
      root.querySelector(".sr-v").onchange = (e) => { fixed = e.target.value === "1"; rebuild(); };
      root.querySelector(".sr-n").oninput = (e) => { n = +e.target.value; root.querySelector(".sr-nv").textContent = n; rebuild(); };
    },
  });
}

// ---------- 6. Fibonacci: plain and memoized ----------

function buildFib(n, memoOn) {
  let id = 0;
  const events = [];
  const memo = {};
  let calls = 0;
  function fib(k) {
    calls++;
    const node = { id: id++, label: `f(${k})`, kids: [] };
    events.push({ type: "enter", id: node.id, line: memoOn ? 3 : 3 });
    let r;
    if (k <= 1) {
      r = k;
    } else if (memoOn && memo[k] !== undefined) {
      r = memo[k];
      node.label = `f(${k}) memo`;
      events.push({ type: "out", text: `fibonacci(${k}): found in memo -> ${r}`, line: 9 });
    } else {
      const a = fib(k - 1); node.kids.push(a.node);
      const b = fib(k - 2); node.kids.push(b.node);
      r = a.r + b.r;
      if (memoOn) { memo[k] = r; events.push({ type: "out", text: `fibonacci(${k}) = ${a.r} + ${b.r} = ${r}, stored in memo[${k}]`, line: 7 }); }
      else events.push({ type: "out", text: `fibonacci(${k}) = ${a.r} + ${b.r} = ${r}`, line: 9 });
    }
    events.push({ type: "exit", id: node.id, value: r });
    return { node, r };
  }
  const root = fib(n).node;
  return { root, events, calls };
}

function demoFib(el) {
  let n = 5, memoOn = false;
  makeTreePlayer(el, {
    width: narrow(el) ? 460 : 720, rowH: 56, nodeW: 72,
    code: () => (memoOn ? CODE.fibMemo : CODE.fib),
    outLabel: "results, in the order they are computed",
    build: () => buildFib(n, memoOn),
    stats: (s) => [["calls so far", s.calls], ["stack depth", s.stack.length],
      ["total calls", `${buildFib(n, memoOn).calls}`], ["fib(" + n + ")", String(buildFib(n, false).events.slice(-1)[0].value)]],
    extraControls: `<label><input type="checkbox" class="fb-m"> memoization</label>
      <label>n <input type="range" class="fb-n" min="1" max="7" value="${n}"> <b class="fb-nv mono">${n}</b></label>`,
    onMount(root, rebuild) {
      root.querySelector(".fb-m").onchange = (e) => { memoOn = e.target.checked; rebuild(); };
      root.querySelector(".fb-n").oninput = (e) => { n = +e.target.value; root.querySelector(".fb-nv").textContent = n; rebuild(); };
    },
  });
}

// ---------- 7. merge ----------

function mergeFrames(left, right) {
  const out = [];
  const frames = [];
  let i = 0, j = 0;
  const f = (o) => frames.push({ i, j, out: out.slice(), ...o });
  f({ line: 5, msg: `Two sorted runs. <code>i</code> points into <code>left</code>, <code>j</code> into <code>right</code>, <code>k</code> into the output.` });
  let comps = 0;
  while (i < left.length && j < right.length) {
    comps++;
    const takeLeft = left[i] <= right[j];
    f({ line: 7, cmp: true, comps, msg: `Compare the two fronts: <code>${left[i]} ${takeLeft ? "&lt;=" : "&gt;"} ${right[j]}</code>${left[i] === right[j] ? " (equal: <code>&lt;=</code> takes the left one, which keeps the sort stable)" : ""}.` });
    if (takeLeft) { out.push(left[i]); i++; f({ line: 8, comps, took: "L", msg: `Take ${out[out.length - 1]} from <code>left</code>.` }); }
    else { out.push(right[j]); j++; f({ line: 11, comps, took: "R", msg: `Take ${out[out.length - 1]} from <code>right</code>.` }); }
  }
  while (i < left.length) { out.push(left[i]); i++; f({ line: 17, comps, took: "L", msg: `<code>right</code> is used up: copy ${out[out.length - 1]} without comparing.` }); }
  while (j < right.length) { out.push(right[j]); j++; f({ line: 22, comps, took: "R", msg: `<code>left</code> is used up: copy ${out[out.length - 1]} without comparing.` }); }
  f({ line: 0, comps, done: true, msgCls: "good", msg: `Merged ${out.length} elements with ${comps} comparisons: <b>${fmt(out)}</b>.` });
  return frames;
}

function demoMerge(el) {
  let left = [2, 4, 5, 7], right = [1, 2, 3, 6];
  makePlayer(el, {
    code: CODE.merge,
    build: () => mergeFrames(left, right),
    render: (f) => {
      const total = left.length + right.length;
      const lr = cellRow(left, (k) => (k < f.i ? "taken" : k === f.i && f.cmp ? "cmp" : "sorted"), { label: "left", ptrs: { [f.i]: f.i < left.length ? "i" : "" } });
      const rr = cellRow(right, (k) => (k < f.j ? "taken" : k === f.j && f.cmp ? "cmp" : "sorted"), { label: "right", ptrs: { [f.j]: f.j < right.length ? "j" : "" } });
      const outVals = Array.from({ length: total }, (_, k) => (k < f.out.length ? f.out[k] : ""));
      const or = cellRow(outVals, (k) => (k >= f.out.length ? "empty" : f.done ? "done" : k === f.out.length - 1 && f.took ? "key" : ""), { label: "output", ptrs: { [f.out.length]: f.out.length < total ? "k" : "" } });
      return `<div class="svgbox">${lr}${rr}${or}</div><div class="stats"><div class="stat"><small>comparisons</small><b>${f.comps || 0}</b></div><div class="stat"><small>elements placed</small><b>${f.out.length} / ${total}</b></div></div>`;
    },
    extraControls: `<label>left <input type="text" class="mg-l" value="${left.join(", ")}" style="width:110px"></label><label>right <input type="text" class="mg-r" value="${right.join(", ")}" style="width:110px"></label>`,
    onMount(root, rebuild) {
      const read = (cls, fb) => {
        const inp = root.querySelector(cls);
        const xs = parseNums(inp.value, fb).slice(0, 6).sort((x, y) => x - y);
        inp.value = xs.join(", ");
        return xs;
      };
      root.querySelector(".mg-l").onchange = () => { left = read(".mg-l", [2, 4, 5, 7]); rebuild(); };
      root.querySelector(".mg-r").onchange = () => { right = read(".mg-r", [1, 2, 3, 6]); rebuild(); };
    },
  });
}

// ---------- 8. merge sort recursion tree ----------

function buildMergeSort(data) {
  let id = 0, step = 0;
  const events = [];
  const a = data.slice();
  function ms(l, r, depth) {
    const indent = "  ".repeat(depth);
    const node = { id: id++, label: a.slice(l, r + 1).join(" "), kids: [] };
    events.push({ type: "enter", id: node.id, line: 3 });
    events.push({ type: "out", text: `${indent}${++step}. sort ${fmt(a.slice(l, r + 1))}` });
    if (l < r) {
      const m = l + Math.floor((r - l) / 2);
      node.kids.push(ms(l, m, depth + 1));
      node.kids.push(ms(m + 1, r, depth + 1));
      const merged = a.slice(l, r + 1).sort((x, y) => x - y);
      for (let k = l; k <= r; k++) a[k] = merged[k - l];
      events.push({ type: "out", text: `${indent}   merged -> ${fmt(merged)}`, line: 7 });
    }
    events.push({ type: "exit", id: node.id, value: a.slice(l, r + 1).join(" ") });
    return node;
  }
  const root = ms(0, a.length - 1, 0);
  events.push({ type: "out", text: fmt(a) });
  return { root, events };
}

function demoMergeTree(el, { mini = false } = {}) {
  let data = mini ? [14, 33, 27, 10, 35, 19, 42, 44] : [38, 27, 43, 3, 9, 82, 10];
  makeTreePlayer(el, {
    mini, width: narrow(el) ? 600 : 720, rowH: mini ? 52 : 62, nodeW: 150, fontSize: 11,
    code: CODE.mergeSort,
    outLabel: "what MergeSortTrace prints",
    build: () => buildMergeSort(data),
    stats: (s) => [["calls so far", s.calls], ["stack depth", s.stack.length], ["total calls", `${2 * data.length - 1} (= 2n − 1)`]],
    extraControls: numsInput("ms-d", data.join(", ")),
    onMount(root, rebuild) {
      if (mini) return;
      bindNums(root, "ms-d", [38, 27, 43, 3, 9, 82, 10], 8, (xs) => { data = xs.length ? xs : [1]; rebuild(); });
    },
  });
}

// ---------- 9. growth: insertion vs merge comparisons ----------

function countInsertion(a) {
  let c = 0;
  for (let j = 1; j < a.length; j++) {
    const key = a[j];
    let i = j - 1;
    while (i >= 0) { c++; if (a[i] <= key) break; a[i + 1] = a[i]; i--; }
    a[i + 1] = key;
  }
  return c;
}
function countMerge(a) {
  let c = 0;
  const tmp = new Array(a.length);
  (function ms(l, r) {
    if (l >= r) return;
    const m = l + Math.floor((r - l) / 2);
    ms(l, m); ms(m + 1, r);
    let i = l, j = m + 1, k = l;
    while (i <= m && j <= r) { c++; tmp[k++] = a[i] <= a[j] ? a[i++] : a[j++]; }
    while (i <= m) tmp[k++] = a[i++];
    while (j <= r) tmp[k++] = a[j++];
    for (k = l; k <= r; k++) a[k] = tmp[k];
  })(0, a.length - 1);
  return c;
}

function demoRace(el) {
  const NS = [8, 16, 32, 64, 128, 256, 512, 1000, 2000, 4000];
  el.classList.add("l4");
  el.innerHTML = `<div class="bars rc-bars"></div><div class="stats rc-stats"></div>
    <div class="controls"><label>n <input type="range" class="rc-n" min="0" max="${NS.length - 1}" value="4"> <b class="rc-nv mono"></b></label>
    <label>input <select class="rc-k"><option value="random">random</option><option value="sorted">sorted</option><option value="reversed">reversed</option></select></label>
    <span class="spacer"></span><span class="counter">same pseudo-random data as SortRace.java</span></div>`;
  const $ = (q) => el.querySelector(q);
  function render() {
    const n = NS[+$(".rc-n").value];
    const kind = $(".rc-k").value;
    $(".rc-nv").textContent = n;
    const ins = countInsertion(costArray(kind, n));
    const mer = countMerge(costArray(kind, n));
    const n2 = (n * n) / 2, nlog = n * Math.log2(n);
    const max = Math.max(ins, mer, n2, nlog);
    $(".rc-bars").innerHTML = [["insertion sort", ins, "amber"], ["merge sort", mer, ""], ["n²/2", Math.round(n2), "red"], ["n log₂ n", Math.round(nlog), ""]]
      .map(([k, v, c]) => `<div class="bar"><span class="mono">${k}</span><div class="track"><div class="fill ${c}" style="width:${Math.max(0.4, (100 * v) / max)}%"></div></div><span class="v">${v.toLocaleString("en-US")}</span></div>`).join("");
    const ratio = ins / Math.max(mer, 1);
    $(".rc-stats").innerHTML = `<div class="stat ${ratio > 1 ? "good" : ""}"><small>insertion ÷ merge</small><b>${ratio.toFixed(1)}×</b></div>
      <div class="stat"><small>comparisons, insertion</small><b>${ins.toLocaleString("en-US")}</b></div>
      <div class="stat"><small>comparisons, merge</small><b>${mer.toLocaleString("en-US")}</b></div>`;
  }
  $(".rc-n").oninput = render;
  $(".rc-k").onchange = render;
  render();
}

// ---------- 10. partition ----------

function partitionFrames(a0) {
  const a = a0.slice();
  const p = 0, r = a.length - 1, x = a[r];
  let i = p - 1;
  const frames = [];
  const f = (o) => frames.push({ a: a.slice(), i, x, ...o });
  f({ j: null, line: 3, msg: `The pivot is the last element, <code>x = ${x}</code>. <code>i = -1</code>: the "≤ x" region is empty.` });
  for (let j = p; j < r; j++) {
    if (a[j] <= x) {
      i++;
      const t = a[i]; a[i] = a[j]; a[j] = t;
      f({ j, line: 8, msg: `<code>a[${j}] = ${a[i]} &lt;= ${x}</code>: grow the small region (<code>i = ${i}</code>) and swap it in${i === j ? " (with itself)" : ""}.` });
    } else {
      f({ j, line: 6, msg: `<code>a[${j}] = ${a[j]} &gt; ${x}</code>: the large region just grows by one; nothing moves.` });
    }
  }
  const t = a[i + 1]; a[i + 1] = a[r]; a[r] = t;
  f({ j: null, q: i + 1, line: 11, msgCls: "good",
    msg: `Swap the pivot into index ${i + 1}, between the regions. ${x} is now in its final place; return ${i + 1}.` });
  return frames;
}

function renderPartition(f, mini) {
  const r = f.a.length - 1;
  const cls = (k) => {
    if (f.q !== undefined) return k === f.q ? "done" : k < f.q ? "small" : "big";
    if (k === r) return "pivot";
    if (k <= f.i) return "small";
    if (f.j !== null && k <= f.j) return "big";
    return "";
  };
  const ptrs = {};
  if (f.i >= 0) ptrs[f.i] = "i";
  if (f.j !== null) ptrs[f.j] = (ptrs[f.j] ? ptrs[f.j] + " " : "") + "j";
  if (f.q === undefined) ptrs[r] = (ptrs[r] ? ptrs[r] + " " : "") + "r";
  const row = cellRow(f.a, cls, { ptrs: mini ? undefined : ptrs, idx: !mini });
  return `<div class="svgbox">${row}${mini ? "" : `<div class="legend"><span><i style="background:var(--teal-soft);border-color:var(--teal)"></i>≤ pivot</span><span><i style="background:var(--card-2);border-color:var(--stone)"></i>&gt; pivot</span><span><i></i>not seen yet</span><span><i style="background:var(--mark);border-color:var(--amber)"></i>pivot</span></div>`}</div>`;
}

function demoPartition(el, { mini = false } = {}) {
  let data = [2, 8, 7, 1, 3, 5, 6, 4];
  makePlayer(el, {
    mini,
    code: CODE.partition,
    interval: mini ? 900 : 650,
    build: () => partitionFrames(data),
    render: (f) => renderPartition(f, mini),
    extraControls: numsInput("pt-d", data.join(", ")),
    onMount(root, rebuild) {
      if (mini) return;
      bindNums(root, "pt-d", [2, 8, 7, 1, 3, 5, 6, 4], 9, (xs) => { data = xs.length ? xs : [1]; rebuild(); });
    },
  });
}

// ---------- 11. quicksort tree ----------

function buildQuickSort(data) {
  let id = 0;
  const events = [];
  const a = data.slice();
  function partition(p, r) {
    const x = a[r];
    let i = p - 1;
    for (let j = p; j < r; j++) if (a[j] <= x) { i++; const t = a[i]; a[i] = a[j]; a[j] = t; }
    const t = a[i + 1]; a[i + 1] = a[r]; a[r] = t;
    return i + 1;
  }
  function qs(p, r, depth) {
    const indent = "  ".repeat(depth);
    if (p > r) {
      const node = { id: id++, label: "{ }", kids: [] };
      events.push({ type: "enter", id: node.id, line: 2 });
      events.push({ type: "out", text: `${indent}{ }` });
      events.push({ type: "exit", id: node.id });
      return node;
    }
    if (p === r) {
      const node = { id: id++, label: String(a[p]), kids: [] };
      events.push({ type: "enter", id: node.id, line: 2 });
      events.push({ type: "out", text: `${indent}${a[p]}` });
      events.push({ type: "exit", id: node.id });
      return node;
    }
    const before = a.slice(p, r + 1);
    const node = { id: id++, label: before.join(" "), kids: [] };
    events.push({ type: "enter", id: node.id, line: 2 });
    const q = partition(p, r);
    events.push({ type: "out", text: `${indent}${fmt(before)} pivot ${a[q]}`, line: 3 });
    node.kids.push(qs(p, q - 1, depth + 1));
    node.kids.push(qs(q + 1, r, depth + 1));
    events.push({ type: "exit", id: node.id, value: `pivot ${a[q]}` });
    return node;
  }
  const root = qs(0, a.length - 1, 0);
  events.push({ type: "out", text: fmt(a) });
  return { root, events };
}

function demoQuickTree(el) {
  let data = [30, 10, 90, 20, 80, 40, 50, 70];
  makeTreePlayer(el, {
    width: narrow(el) ? 460 : 720, rowH: 62, nodeW: 150, fontSize: narrow(el) ? 12 : 11,
    code: CODE.quickSort,
    outLabel: "what QuickSortTrace prints",
    build: () => buildQuickSort(data),
    stats: (s) => [["calls so far", s.calls], ["stack depth", s.stack.length]],
    extraControls: numsInput("qs-d", data.join(", ")) + `<button class="cbtn qs-s">sorted input</button>`,
    onMount(root, rebuild) {
      bindNums(root, "qs-d", [30, 10, 90, 20, 80, 40, 50, 70], 8, (xs) => { data = xs.length ? xs : [1]; rebuild(); });
      root.querySelector(".qs-s").onclick = () => { data = [10, 20, 30, 40, 50, 60]; root.querySelector(".qs-d").value = data.join(", "); rebuild(); };
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
  insertion: (el) => demoInsertion(el),
  insertionMini: (el) => demoInsertion(el, { mini: true }),
  invariant: (el) => demoInvariant(el),
  cost: (el) => demoCost(el),
  costMini: (el) => demoCost(el, { mini: true }),
  hanoi: (el) => demoHanoi(el),
  hanoiMini: (el) => demoHanoi(el, { mini: true }),
  selfRef: (el) => demoSelfRef(el),
  fib: (el) => demoFib(el),
  merge: (el) => demoMerge(el),
  mergeTree: (el) => demoMergeTree(el),
  mergeMini: (el) => demoMergeTree(el, { mini: true }),
  race: (el) => demoRace(el),
  partition: (el) => demoPartition(el),
  partitionMini: (el) => demoPartition(el, { mini: true }),
  quickTree: (el) => demoQuickTree(el),
  quiz: (el) => demoQuiz(el, QUIZ),
};
