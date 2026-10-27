// Interactive demos for Lecture 5. Every code panel is copied from
// notes/L05-asymptotic-notations.md (checked by tools/check.py); the JS twins below count
// operations exactly as the Java programs in the note do, and the bound checkers use the
// same "last n where it fails" search as FindN0, LogVsPower and ExpVsPower.

const CODE = {
  // The note's pseudocode, without its "1   " line labels (the panel numbers the lines).
  sumPseudo: `tempSum = 0
for i = 0 to n - 1
    tempSum += A[i]
return tempSum`,
  searchPseudo: `for i = 0 to n - 1
    if A[i] == x
        return i
return -1`,
  maxSubPseudo: `maxSum = A[0]
for i = 0 to n - 1
    subSumFromI = 0
    for j = i to n - 1
        subSumFromI += A[j]
        if subSumFromI > maxSum
            maxSum = subSumFromI
return maxSum`,
  sumCount: `public class SumCount {
    static long ops = 0;   // basic operations, counted as in the table

    static int sum(int[] a, int n) {
        int tempSum = 0;
        ops += 1;                       // line 1: assignment
        ops += 1;                       // line 2: i = 0
        for (int i = 0; i < n; i++) {
            ops += 1;                   // line 2: the test i < n that succeeds
            tempSum += a[i];
            ops += 2;                   // line 3: index a[i], add
            ops += 1;                   // line 2: i++
        }
        ops += 1;                       // line 2: the last test i < n, which fails
        ops += 1;                       // line 4: return
        return tempSum;
    }

    public static void main(String[] args) {
        int[] sizes = {0, 1, 2, 5, 10, 100, 1000};
        for (int n : sizes) {
            ops = 0;
            sum(new int[n], n);
            System.out.println("n = " + n + ": counted " + ops + ", 4n + 4 = " + (4 * n + 4));
        }
    }
}`,
  sumCountOut: `n = 0: counted 4, 4n + 4 = 4
n = 1: counted 8, 4n + 4 = 8
n = 2: counted 12, 4n + 4 = 12
n = 5: counted 24, 4n + 4 = 24
n = 10: counted 44, 4n + 4 = 44
n = 100: counted 404, 4n + 4 = 404
n = 1000: counted 4004, 4n + 4 = 4004`,
  linearSearchCount: `public class LinearSearchCount {
    static int comparisons = 0;

    static int linearSearch(int[] a, int n, int x) {
        for (int i = 0; i < n; i++) {
            comparisons++;              // line 2: a[i] == x
            if (a[i] == x) {
                return i;
            }
        }
        return -1;
    }

    public static void main(String[] args) {
        int[] a = {3, 7, 9, 12, 13, 18, 20, 23, 27};
        int[] targets = {3, 20, 27, 5};
        for (int x : targets) {
            comparisons = 0;
            int index = linearSearch(a, a.length, x);
            System.out.println("search " + x + ": index " + index + ", " + comparisons + " comparisons");
        }
    }
}`,
  linearSearchOut: `search 3: index 0, 1 comparisons
search 20: index 6, 7 comparisons
search 27: index 8, 9 comparisons
search 5: index -1, 9 comparisons`,
  maxSubArrayCount: `public class MaxSubArrayCount {
    static long ops = 0;

    static int maxSubArraySum(int[] a, int n) {
        int maxSum = a[0];
        ops += 2;                                  // line 1
        ops += 1;                                  // line 2: i = 0
        for (int i = 0; i < n; i++) {
            ops += 1;                              // line 2: test i < n (true)
            int subSumFromI = 0;
            ops += 1;                              // line 3
            ops += 1;                              // line 4: j = i
            for (int j = i; j < n; j++) {
                ops += 1;                          // line 4: test j < n (true)
                subSumFromI += a[j];
                ops += 2;                          // line 5
                ops += 1;                          // line 6: the comparison
                if (subSumFromI > maxSum) {
                    maxSum = subSumFromI;
                    ops += 1;                      // line 7
                }
                ops += 1;                          // line 4: j++
            }
            ops += 1;                              // line 4: last test (false)
            ops += 1;                              // line 2: i++
        }
        ops += 1;                                  // line 2: last test (false)
        ops += 1;                                  // line 8: return
        return maxSum;
    }

    static void run(int[] a) {
        int n = a.length;
        ops = 0;
        int best = maxSubArraySum(a, n);
        System.out.println(java.util.Arrays.toString(a) + ": max " + best + ", "
                + ops + " ops, bound 3n^2 + 8n + 5 = " + (3 * n * n + 8 * n + 5));
    }

    public static void main(String[] args) {
        run(new int[] {4});
        run(new int[] {-1, 4});
        run(new int[] {2, -5, 3, 1, -2, 4});
        run(new int[] {-3, -3, 4, 1, 1});
        run(new int[] {1, 2, 3, 4, 5, 6, 7, 8, 9, 10});
    }
}`,
  maxSubArrayOut: `[4]: max 4, 15 ops, bound 3n^2 + 8n + 5 = 16
[-1, 4]: max 4, 32 ops, bound 3n^2 + 8n + 5 = 33
[2, -5, 3, 1, -2, 4]: max 6, 143 ops, bound 3n^2 + 8n + 5 = 161
[-3, -3, 4, 1, 1]: max 6, 114 ops, bound 3n^2 + 8n + 5 = 120
[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]: max 55, 339 ops, bound 3n^2 + 8n + 5 = 385`,
  findN0: `public class FindN0 {
    static long g(long n) { return 3 * n * n + 8 * n + 5; }
    static long f(long n) { return n * n; }

    public static void main(String[] args) {
        long limit = 1_000_000;
        int[] cs = {3, 4, 5, 8, 16};
        for (int c : cs) {
            long lastBad = 0;                   // the last n with g(n) > c * f(n)
            for (long n = 1; n <= limit; n++) {
                if (g(n) > c * f(n)) {
                    lastBad = n;
                }
            }
            if (lastBad == limit) {
                System.out.println("c = " + c + ": fails at every n up to " + limit);
            } else {
                System.out.println("c = " + c + ": g(n) <= c * n^2 for all n >= " + (lastBad + 1));
            }
        }
    }
}`,
  findN0Out: `c = 3: fails at every n up to 1000000
c = 4: g(n) <= c * n^2 for all n >= 9
c = 5: g(n) <= c * n^2 for all n >= 5
c = 8: g(n) <= c * n^2 for all n >= 3
c = 16: g(n) <= c * n^2 for all n >= 1`,
  logBase: `public class LogBase {
    public static void main(String[] args) {
        long[] ns = {10, 1000, 1_000_000, 1_000_000_000};
        for (long n : ns) {
            double log2 = Math.log(n) / Math.log(2);
            double log10 = Math.log10(n);
            System.out.printf("n = %d: log2 n = %.3f, log10 n = %.3f, ratio %.4f%n",
                    n, log2, log10, log2 / log10);
        }
    }
}`,
  logBaseOut: `n = 10: log2 n = 3.322, log10 n = 1.000, ratio 3.3219
n = 1000: log2 n = 9.966, log10 n = 3.000, ratio 3.3219
n = 1000000: log2 n = 19.932, log10 n = 6.000, ratio 3.3219
n = 1000000000: log2 n = 29.897, log10 n = 9.000, ratio 3.3219`,
  logVsPower: `public class LogVsPower {
    public static void main(String[] args) {
        // n = 2^k, so (log2 n)^2 = k^2 and sqrt(n) = 2^(k/2).
        for (int k = 2; k <= 24; k += 2) {
            long logSquared = (long) k * k;
            long root = 1L << (k / 2);
            String winner = logSquared > root ? "log^2 bigger" : logSquared == root ? "equal" : "sqrt bigger";
            System.out.println("n = 2^" + k + ": (log n)^2 = " + logSquared + ", sqrt n = " + root + "  " + winner);
        }
        // When does n^0.0001 pass (log2 n)^2?  With n = 2^k: 2^(k/10000) > k^2,
        // i.e. k / 10000 > 2 * log2(k).  Find the last k where it does not hold.
        long lastBad = 0;
        for (long k = 2; k <= 10_000_000; k++) {
            if (k / 10000.0 <= 2 * Math.log(k) / Math.log(2)) {
                lastBad = k;
            }
        }
        System.out.println("n^0.0001 > (log n)^2 for all n = 2^k with k >= " + (lastBad + 1));
    }
}`,
  logVsPowerOut: `n = 2^2: (log n)^2 = 4, sqrt n = 2  log^2 bigger
n = 2^4: (log n)^2 = 16, sqrt n = 4  log^2 bigger
n = 2^6: (log n)^2 = 36, sqrt n = 8  log^2 bigger
n = 2^8: (log n)^2 = 64, sqrt n = 16  log^2 bigger
n = 2^10: (log n)^2 = 100, sqrt n = 32  log^2 bigger
n = 2^12: (log n)^2 = 144, sqrt n = 64  log^2 bigger
n = 2^14: (log n)^2 = 196, sqrt n = 128  log^2 bigger
n = 2^16: (log n)^2 = 256, sqrt n = 256  equal
n = 2^18: (log n)^2 = 324, sqrt n = 512  sqrt bigger
n = 2^20: (log n)^2 = 400, sqrt n = 1024  sqrt bigger
n = 2^22: (log n)^2 = 484, sqrt n = 2048  sqrt bigger
n = 2^24: (log n)^2 = 576, sqrt n = 4096  sqrt bigger
n^0.0001 > (log n)^2 for all n = 2^k with k >= 369939`,
  expVsPower: `public class ExpVsPower {
    public static void main(String[] args) {
        long lastBad = 0;                         // last n with n^10 >= 2^n
        for (long n = 1; n <= 1000; n++) {
            if (10 * Math.log(n) / Math.log(2) >= n) {
                lastBad = n;
            }
        }
        System.out.println("2^n > n^10 for all n >= " + (lastBad + 1));
        int[] ns = {10, 30, 58, 59, 100};
        for (int n : ns) {
            System.out.printf("n = %d: log2(n^10) = %.2f, log2(2^n) = %d%n", n, 10 * Math.log(n) / Math.log(2), n);
        }
    }
}`,
  expVsPowerOut: `2^n > n^10 for all n >= 59
n = 10: log2(n^10) = 33.22, log2(2^n) = 10
n = 30: log2(n^10) = 49.07, log2(2^n) = 30
n = 58: log2(n^10) = 58.58, log2(2^n) = 58
n = 59: log2(n^10) = 58.83, log2(2^n) = 59
n = 100: log2(n^10) = 66.44, log2(2^n) = 100`,
  growthTable: `public class GrowthTable {
    public static void main(String[] args) {
        System.out.printf("%-10s%6s%6s%6s%6s%6s%12s%n", "", "n=1", "n=2", "n=4", "n=8", "n=16", "n=32");
        String[] names = {"1", "log n", "n", "n log n", "n^2", "n^3", "2^n"};
        for (String name : names) {
            System.out.printf("%-10s", name);
            for (int k = 0; k <= 5; k++) {
                long n = 1L << k;                 // n = 2^k, so log2 n = k exactly
                long v = switch (name) {
                    case "1" -> 1;
                    case "log n" -> k;
                    case "n" -> n;
                    case "n log n" -> n * k;
                    case "n^2" -> n * n;
                    case "n^3" -> n * n * n;
                    default -> 1L << n;           // 2^n
                };
                System.out.printf(k == 5 ? "%12d" : "%6d", v);
            }
            System.out.println();
        }
    }
}`,
  growthTableOut: `             n=1   n=2   n=4   n=8  n=16        n=32
1              1     1     1     1     1           1
log n          0     1     2     3     4           5
n              1     2     4     8    16          32
n log n        0     2     8    24    64         160
n^2            1     4    16    64   256        1024
n^3            1     8    64   512  4096       32768
2^n            2     4    16   256 65536  4294967296`,
  thetaRatio: `public class ThetaRatio {
    static double log2(double x) { return Math.log(x) / Math.log(2); }

    public static void main(String[] args) {
        long[] ns = {2, 16, 1024, 1_000_000, 1_000_000_000L};
        for (long n : ns) {
            double g = (3.0 * n * n + 2 * Math.sqrt(n)) * (n * log2(n) + n);
            double f = (double) n * n * n * log2(n);
            System.out.printf("n = %d: g(n) / (n^3 log n) = %.4f%n", n, g / f);
        }
    }
}`,
  thetaRatioOut: `n = 2: g(n) / (n^3 log n) = 7.4142
n = 16: g(n) / (n^3 log n) = 3.7891
n = 1024: g(n) / (n^3 log n) = 3.3001
n = 1000000: g(n) / (n^3 log n) = 3.1505
n = 1000000000: g(n) / (n^3 log n) = 3.1003`,
  searchGrowth: `public class SearchGrowth {
    // Worst case of binary search on n sorted elements: floor(log2 n) + 1 comparisons.
    static int binaryWorst(long n) {
        return 64 - Long.numberOfLeadingZeros(n);
    }

    public static void main(String[] args) {
        long[] ns = {10, 1000, 1_000_000, 1_000_000_000L};
        for (long n : ns) {
            System.out.println("n = " + n + ": linear " + n + ", binary " + binaryWorst(n));
        }
    }
}`,
  searchGrowthOut: `n = 10: linear 10, binary 4
n = 1000: linear 1000, binary 10
n = 1000000: linear 1000000, binary 20
n = 1000000000: linear 1000000000, binary 30`,
  loopCounts: `public class LoopCounts {
    static long a(int n) { long count = 0; for (int i = 0; i < n; i++) for (int j = 0; j < 100; j++) count++; return count; }
    static long b(int n) { long count = 0; for (int i = 1; i < n; i = i * 2) count++; return count; }
    static long c(int n) { long count = 0; for (int i = 0; i < n; i++) for (int j = 0; j < i; j++) count++; return count; }
    static long d(int n) { long count = 0; for (int i = 0; i < n; i++) count++; for (long j = 0; j < (long) n * n; j++) count++; return count; }

    public static void main(String[] args) {
        int[] ns = {10, 100, 1000};
        for (int n : ns) {
            System.out.println("n = " + n + ": (a) " + a(n) + ", (b) " + b(n) + ", (c) " + c(n) + ", (d) " + d(n));
        }
    }
}`,
  loopCountsOut: `n = 10: (a) 1000, (b) 4, (c) 45, (d) 110
n = 100: (a) 10000, (b) 7, (c) 4950, (d) 10100
n = 1000: (a) 100000, (b) 10, (c) 499500, (d) 1001000`,
};

// ---------- shared bits ----------

(function injectStyle() {
  if (document.getElementById("l05-style")) return;
  const s = document.createElement("style");
  s.id = "l05-style";
  s.textContent = `
  .l5-ops { display: grid; grid-template-columns: repeat(auto-fit, minmax(110px, 1fr)); gap: 6px; margin: 8px 0; }
  .l5-ops div { background: var(--paper-2); border-radius: 8px; padding: 6px 8px; font: 500 12px var(--mono); }
  .l5-ops div b { display: block; font-size: 16px; }
  .l5-ops div.hot { background: var(--mark); outline: 1.5px solid var(--amber); }
  .l5-grid { overflow-x: auto; margin: 8px 0; }
  .l5-grid table { border-collapse: collapse; margin: 0 auto; font: 500 12px var(--mono); }
  .l5-grid td, .l5-grid th { width: 34px; height: 28px; text-align: center; border: 1px solid var(--line); padding: 0; }
  .l5-grid th { background: var(--card-2, var(--paper-2)); color: var(--stone); font-weight: 500; }
  .l5-grid td.empty { background: var(--paper-2); border-color: transparent; }
  .l5-grid td.done { background: var(--card); }
  .l5-grid td.cur { background: var(--mark); outline: 2px solid var(--amber); }
  .l5-grid td.best { color: var(--green); font-weight: 700; }
  .l5-plot svg { width: 100%; height: auto; display: block; }
  .l5-plot text { font-family: var(--mono); }
  .l5-expr { font-family: "Cambria Math", "STIX Two Math", Georgia, serif; font-size: 20px; text-align: center;
    padding: 16px 10px; background: var(--card); border: 1px solid var(--line); border-radius: 10px; margin: 8px 0;
    overflow-x: auto; white-space: nowrap; }
  .l5-expr .hit { background: var(--mark); border-radius: 4px; padding: 0 3px; outline: 1.5px solid var(--amber); }
  .l5-expr .dead { color: var(--stone); text-decoration: line-through; }
  .l5-expr .ok { color: var(--green); font-weight: 600; }
  .l5-expr .bad { color: var(--red); font-weight: 600; }
  .l5-rule { text-align: center; font: 600 12px var(--mono); color: var(--teal); letter-spacing: 0.04em; }
  .l5-table { overflow-x: auto; }
  .l5-table table { border-collapse: collapse; width: 100%; font: 500 13px var(--mono); margin: 8px 0; }
  .l5-table td, .l5-table th { border: 1px solid var(--line); padding: 5px 8px; text-align: right; }
  .l5-table th:first-child, .l5-table td:first-child { text-align: left; }
  .l5-table tr.hot td { background: var(--mark); }
  .l5-legend { display: flex; flex-wrap: wrap; gap: 6px 14px; justify-content: center; font: 500 12px var(--mono); margin-top: 6px; }
  .l5-legend span::before { content: ""; display: inline-block; width: 14px; height: 3px; margin-right: 5px; vertical-align: middle; background: var(--c); }
  .l5-legend span.dash::before { background: repeating-linear-gradient(90deg, var(--c) 0 4px, transparent 4px 7px); }
  .demo .controls input[type=range] { max-width: 160px; }
  @media (max-width: 600px) { .l5-expr { font-size: 16px; } .l5-grid td, .l5-grid th { width: 30px; height: 26px; } }
  `;
  document.head.appendChild(s);
})();

const log2 = (x) => Math.log(x) / Math.log(2);
const fmt = (x) => {
  if (!Number.isFinite(x)) return "∞";
  if (Number.isInteger(x) && Math.abs(x) < 1e15) return x.toLocaleString("en");
  if (Math.abs(x) >= 1e6) return x.toExponential(2).replace("e+", "e");
  return String(Math.round(x * 100) / 100);
};

// A simple step player: build() returns snapshots; render(snap, k) draws one.
// Arrow keys step when the demo has focus.
function makeSteps(el, opts) {
  const mini = !!opts.mini;
  el.innerHTML = `<div class="st-view"></div>${mini ? "" : `<div class="msg st-msg"></div>
    <div class="controls">
      <button class="cbtn st-reset" title="Back to the start">⟲ Reset</button>
      <button class="cbtn st-back" title="Step back (←)">◀ Back</button>
      <button class="cbtn st-step on" title="Step (→)">Step ▶</button>
      ${opts.noPlay ? "" : `<button class="cbtn st-play">Play</button>`}
      ${opts.extraControls || ""}
      <span class="spacer"></span><span class="counter st-count"></span>
    </div>`}`;
  const $ = (q) => el.querySelector(q);
  let snaps = [], i = 0, timer = null;
  function render() {
    const s = snaps[i];
    $(".st-view").innerHTML = opts.render(s, i);
    if (mini) return;
    $(".st-msg").innerHTML = s.msg || "";
    $(".st-msg").className = "msg st-msg " + (s.cls || "");
    $(".st-count").textContent = `${opts.countLabel ? opts.countLabel(s, i) : `step ${i + 1} / ${snaps.length}`}`;
    $(".st-back").disabled = $(".st-reset").disabled = i === 0;
    $(".st-step").disabled = i === snaps.length - 1;
  }
  function stop() { clearInterval(timer); timer = null; if (!mini && $(".st-play")) $(".st-play").textContent = "Play"; }
  function play() {
    if (timer) return stop();
    if (i === snaps.length - 1) i = 0;
    if (!mini) $(".st-play").textContent = "Pause";
    timer = setInterval(() => {
      if (i < snaps.length - 1) i++; else if (mini) i = 0; else return stop();
      render();
    }, opts.interval || (mini ? 1100 : 700));
  }
  function rebuild(keep = false) {
    stop();
    const old = i;
    snaps = opts.build();
    i = keep ? Math.min(old, snaps.length - 1) : (opts.start ? opts.start(snaps) : 0);
    render();
  }
  function go(k) { stop(); i = Math.max(0, Math.min(snaps.length - 1, k)); render(); }
  if (!mini) {
    $(".st-reset").onclick = () => go(0);
    $(".st-back").onclick = () => go(i - 1);
    $(".st-step").onclick = () => go(i + 1);
    if ($(".st-play")) $(".st-play").onclick = play;
    el.tabIndex = 0;
    el.addEventListener("keydown", (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "SELECT") return;
      if (e.key === "ArrowRight") { e.preventDefault(); go(i + 1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); go(i - 1); }
    });
  }
  if (opts.onMount) opts.onMount(el, rebuild, go);
  rebuild();
  if (mini && !opts.still) play();
  return { rebuild, go, index: () => i };
}

// A line plot. series: [{pts: [[x, y]], color, label, dash, width}]. Points outside the
// y-range are clipped. Options: xMin, xMax, yMin, yMax, vline {x, label}, shadeFrom,
// dots [{x, y, color}], cursor x, xTicks, yTicks, xFmt, yFmt, logY (y given as log10).
function plotSVG(o) {
  const W = o.W || 720, H = o.H || 300, L = 54, R = 18, T = 14, B = 34;
  const X = (x) => L + ((x - o.xMin) / (o.xMax - o.xMin)) * (W - L - R);
  const Y = (y) => T + (1 - (y - o.yMin) / (o.yMax - o.yMin)) * (H - T - B);
  const clampY = (y) => Math.max(o.yMin - (o.yMax - o.yMin) * 0.02, Math.min(o.yMax + (o.yMax - o.yMin) * 0.02, y));
  let g = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(o.label || "plot")}">`;
  g += `<defs><clipPath id="pc${o.id || 0}"><rect x="${L}" y="${T - 1}" width="${W - L - R}" height="${H - T - B + 2}"/></clipPath></defs>`;
  if (o.shadeFrom != null && o.shadeFrom <= o.xMax) {
    const x0 = X(Math.max(o.shadeFrom, o.xMin));
    g += `<rect x="${x0}" y="${T}" width="${W - R - x0}" height="${H - T - B}" fill="${o.shadeColor || "var(--teal-soft)"}" opacity="0.6"/>`;
  }
  // axes and ticks
  g += `<line x1="${L}" y1="${H - B}" x2="${W - R}" y2="${H - B}" stroke="var(--ink-2, var(--stone))"/>`;
  g += `<line x1="${L}" y1="${T}" x2="${L}" y2="${H - B}" stroke="var(--ink-2, var(--stone))"/>`;
  (o.xTicks || []).forEach((t) => {
    g += `<line x1="${X(t)}" y1="${H - B}" x2="${X(t)}" y2="${H - B + 4}" stroke="var(--stone)"/>`;
    g += `<text x="${X(t)}" y="${H - B + 16}" font-size="11" text-anchor="middle" fill="var(--stone)">${esc(o.xFmt ? o.xFmt(t) : t)}</text>`;
  });
  (o.yTicks || []).forEach((t) => {
    g += `<line x1="${L - 4}" y1="${Y(t)}" x2="${W - R}" y2="${Y(t)}" stroke="var(--line)" stroke-width="0.7"/>`;
    g += `<text x="${L - 7}" y="${Y(t) + 4}" font-size="11" text-anchor="end" fill="var(--stone)">${esc(o.yFmt ? o.yFmt(t) : fmt(t))}</text>`;
  });
  if (o.xLabel) g += `<text x="${W - R}" y="${H - 4}" font-size="11" text-anchor="end" fill="var(--stone)">${esc(o.xLabel)}</text>`;
  if (o.zeroLine) g += `<line x1="${L}" y1="${Y(0)}" x2="${W - R}" y2="${Y(0)}" stroke="var(--ink)" stroke-width="1" stroke-dasharray="3 3"/>`;
  g += `<g clip-path="url(#pc${o.id || 0})">`;
  o.series.forEach((s) => {
    const d = s.pts.filter((p) => Number.isFinite(p[1])).map((p, k) => `${k ? "L" : "M"}${X(p[0]).toFixed(1)} ${Y(clampY(p[1])).toFixed(1)}`).join(" ");
    g += `<path d="${d}" fill="none" stroke="${s.color}" stroke-width="${s.width || 2.2}" ${s.dash ? `stroke-dasharray="6 4"` : ""}/>`;
  });
  (o.dots || []).forEach((p) => {
    if (p.y >= o.yMin && p.y <= o.yMax) g += `<circle cx="${X(p.x)}" cy="${Y(p.y)}" r="${p.r || 3.5}" fill="${p.color}"/>`;
  });
  g += `</g>`;
  if (o.vline && o.vline.x >= o.xMin && o.vline.x <= o.xMax) {
    g += `<line x1="${X(o.vline.x)}" y1="${T}" x2="${X(o.vline.x)}" y2="${H - B}" stroke="var(--amber)" stroke-width="1.6" stroke-dasharray="5 4"/>`;
    g += `<text x="${X(o.vline.x) + 5}" y="${T + 12}" font-size="12" fill="var(--amber)">${esc(o.vline.label)}</text>`;
  }
  if (o.cursor != null && o.cursor >= o.xMin && o.cursor <= o.xMax) {
    g += `<line x1="${X(o.cursor)}" y1="${T}" x2="${X(o.cursor)}" y2="${H - B}" stroke="var(--ink)" stroke-width="1.2"/>`;
  }
  (o.labels || []).forEach((t) => {
    if (t.y >= o.yMin && t.y <= o.yMax && t.x <= o.xMax) {
      g += `<text x="${Math.min(X(t.x) + 4, W - R - 4)}" y="${Y(t.y) - 5}" font-size="12" font-weight="600" text-anchor="${X(t.x) > W - 120 ? "end" : "start"}" fill="${t.color}">${esc(t.text)}</text>`;
    }
  });
  return g + "</svg>";
}

// Plot size for the space the demo has: a narrower viewBox keeps the text readable on a phone.
function plotDims(el) {
  const w = (el && el.clientWidth) || 720;
  const W = Math.round(Math.max(340, Math.min(720, w)));
  return { W, H: W < 560 ? Math.round(W * 0.7) : 300 };
}

function niceTicks(lo, hi, count = 5) {
  const span = hi - lo;
  if (span <= 0) return [lo];
  const raw = span / count;
  const p = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * p).find((s) => span / s <= count) || 10 * p;
  const out = [];
  for (let t = Math.ceil(lo / step) * step; t <= hi + 1e-9; t += step) out.push(Math.round(t * 1e6) / 1e6);
  return out;
}

function sample(f, a, b, k = 160) {
  const pts = [];
  for (let s = 0; s <= k; s++) { const x = a + ((b - a) * s) / k; pts.push([x, f(x)]); }
  return pts;
}

function cellsHTML(data, opt = {}) {
  return `<div class="cells">` + data.map((v, k) => {
    let cls = "cell";
    if (opt.out && opt.out(k)) cls += " out";
    if (opt.cur === k) cls += opt.found ? " found" : " mid";
    const p = opt.ptr && opt.ptr(k) ? opt.ptr(k) : "";
    return `<div class="cellcol"><div class="ptr">${p}</div><div class="${cls}">${v}</div><div class="cellidx">${k}</div></div>`;
  }).join("") + `</div>`;
}

// ---------- Chapter 2: counting basic operations ----------

function traceSumOps(a) {
  const n = a.length, t = new Tracer(), per = [0, 0, 0, 0, 0];
  let ops = 0, tempSum = 0;
  const f = t.push("sum(A, n)", { n });
  const add = (line, k) => { ops += k; per[line] += k; f.status = `ops so far: ${ops}`; };
  const ex = (i, hot) => ({ per: per.slice(), ops, i, hot });
  t.snap(0, `Count every basic operation of <code>sum</code> on n = ${n} elements.`, "", ex(-1, 0));
  tempSum = 0; f.vars = { n, tempSum }; add(1, 1);
  t.snap(1, "<code>tempSum = 0</code>: one assignment. <b>+1</b>", "", ex(-1, 1));
  let i = 0; f.vars = { n, i, tempSum }; add(2, 2);
  t.snap(2, `Loop start: assign <code>i = 0</code> and test <code>i &lt; n</code> (0 &lt; ${n}: ${n > 0}). <b>+2</b>`, "", ex(0, 2));
  while (i < n) {
    tempSum += a[i]; f.vars = { n, i, tempSum }; add(3, 2);
    t.snap(3, `<code>tempSum += A[${i}]</code>: index A[${i}] = ${a[i]}, then add. <b>+2</b>`, "", ex(i, 3));
    i++; f.vars = { n, i, tempSum }; add(2, 2);
    t.snap(2, `<code>i++</code> → ${i}, then test ${i} &lt; ${n}: ${i < n}. <b>+2</b>`, "", ex(i, 2));
  }
  add(4, 1);
  t.snap(4, `<code>return tempSum</code> (= ${tempSum}). <b>+1</b>`, "", ex(n, 4));
  t.pop();
  t.snap(0, `Total: <b>${ops}</b> operations, and 4n + 4 = 4·${n} + 4 = <b>${4 * n + 4}</b>. Same count as <code>SumCount</code>.`, "good", ex(n, 0));
  return t.snaps;
}

function opsPanel(per, total, hot, lines, extra = "") {
  return `<div class="l5-ops">${lines.map((k) => `<div class="${hot === k ? "hot" : ""}">line ${k}<b>${per[k]}</b></div>`).join("")}
    <div><span>total</span><b>${total}</b></div>${extra}</div>`;
}

function demoSumOps(el) {
  let n = 4;
  makeStepper(el, {
    code: CODE.sumPseudo, stackLabel: "variables",
    build: () => traceSumOps(Array.from({ length: n }, (_, k) => [5, 2, 8, 1, 9, 4, 7, 3][k])),
    renderExtra: (s) => s.extra ? cellsHTML(Array.from({ length: n }, (_, k) => [5, 2, 8, 1, 9, 4, 7, 3][k]), { cur: s.extra.i >= 0 && s.extra.i < n ? s.extra.i : -1, ptr: (k) => (k === s.extra.i ? "i" : "") }) +
      opsPanel(s.extra.per, s.extra.ops, s.extra.hot, [1, 2, 3, 4], `<div><span>4n + 4</span><b>${4 * n + 4}</b></div>`) : "",
    extraControls: `<label>n <input type="range" class="so-n" min="0" max="8" value="${n}"> <b class="so-nv mono">${n}</b></label>`,
    onMount(root, rebuild) {
      root.querySelector(".so-n").oninput = (e) => { n = +e.target.value; root.querySelector(".so-nv").textContent = n; rebuild(); };
    },
  });
}

const LS_DATA = [3, 7, 9, 12, 13, 18, 20, 23, 27];

function traceLinearSearch(a, x) {
  const t = new Tracer();
  let cmp = 0;
  const f = t.push(`linearSearch(A, ${a.length}, ${x})`, {});
  const ex = (i, found) => ({ i, cmp, found });
  for (let i = 0; i < a.length; i++) {
    f.vars = { i, comparisons: cmp };
    t.snap(1, `i = ${i}.`, "", ex(i));
    cmp++; f.vars = { i, comparisons: cmp };
    if (a[i] === x) {
      t.snap(2, `Compare A[${i}] = ${a[i]} with ${x}: equal. (comparison ${cmp})`, "", ex(i, true));
      f.status = `returns ${i}`; f.cls = "ret";
      t.snap(3, `Return ${i} after <b>${cmp}</b> comparison${cmp > 1 ? "s" : ""}.${cmp === 1 ? " The <b>best case</b>: x is first." : ""}`, "good", ex(i, true));
      return t.snaps;
    }
    t.snap(2, `Compare A[${i}] = ${a[i]} with ${x}: not equal. (comparison ${cmp})`, "", ex(i));
  }
  f.status = "returns -1"; f.cls = "ret";
  t.snap(4, `${x} is not in the array: return -1 after <b>${cmp}</b> comparisons, one per element. The <b>worst case</b>.`, "bad", ex(a.length));
  return t.snaps;
}

function demoLinearSearch(el) {
  let x = 20;
  makeStepper(el, {
    code: CODE.searchPseudo, stackLabel: "variables",
    build: () => traceLinearSearch(LS_DATA, x),
    renderExtra: (s) => s.extra ? cellsHTML(LS_DATA, { cur: s.extra.i, found: s.extra.found, out: (k) => k < s.extra.i, ptr: (k) => (k === s.extra.i ? "i" : "") }) +
      `<div class="stats" style="margin:4px 0 8px"><div class="stat"><small>comparisons</small><b>${s.extra.cmp}</b></div><div class="stat"><small>n</small><b>${LS_DATA.length}</b></div></div>` : "",
    extraControls: `<label>x <input type="number" class="ls-x" value="${x}" style="width:70px"></label>
      <button class="cbtn" data-x="3">3</button><button class="cbtn" data-x="20">20</button><button class="cbtn" data-x="5">5</button>`,
    onMount(root, rebuild) {
      const inp = root.querySelector(".ls-x");
      inp.onchange = () => { x = Math.trunc(+inp.value || 0); rebuild(); };
      root.querySelectorAll("[data-x]").forEach((b) => { b.onclick = () => { x = +b.dataset.x; inp.value = x; rebuild(); }; });
    },
  });
}

function traceMaxSub(a) {
  const n = a.length, t = new Tracer(), per = Array(9).fill(0);
  let ops = 0, ifTrue = 0;
  const grid = Array.from({ length: n }, () => Array(n).fill(null));
  const f = t.push(`maxSubArraySum(A, ${n})`, {});
  const add = (line, k) => { ops += k; per[line] += k; };
  let best = null;
  const ex = (i, j, hot) => ({ grid: grid.map((r) => r.slice()), i, j, hot, per: per.slice(), ops, best: best && best.slice(), ifTrue });
  let maxSum = a[0]; add(1, 2); add(2, 1);
  f.vars = { maxSum };
  t.snap(1, `<code>maxSum = A[0] = ${a[0]}</code>. <b>+2</b> (index, assign), and the outer loop sets <code>i = 0</code>.`, "", ex(-1, -1, 1));
  for (let i = 0; i < n; i++) {
    add(2, 1);
    let sub = 0; add(3, 1); add(4, 1);
    f.vars = { i, subSumFromI: sub, maxSum };
    t.snap(3, `i = ${i}: start a new subarray at index ${i}. <code>subSumFromI = 0</code>.`, "", ex(i, -1, 3));
    for (let j = i; j < n; j++) {
      add(4, 1);
      sub += a[j]; add(5, 2);
      grid[i][j] = sub;
      add(6, 1);
      f.vars = { i, j, subSumFromI: sub, maxSum };
      if (sub > maxSum) {
        maxSum = sub; add(7, 1); ifTrue++; best = [i, j];
        f.vars = { i, j, subSumFromI: sub, maxSum };
        t.snap(7, `A[${i}..${j}] sums to ${sub} &gt; old maxSum: line 7 runs, <code>maxSum = ${sub}</code>.`, "good", ex(i, j, 7));
      } else {
        t.snap(6, `A[${i}..${j}] sums to ${sub}, not &gt; ${maxSum}: line 7 is skipped.`, "", ex(i, j, 6));
      }
      add(4, 1);
    }
    add(4, 1); add(2, 1);
  }
  add(2, 1); add(8, 1);
  f.status = `returns ${maxSum}`; f.cls = "ret";
  const S = (n * (n + 1)) / 2, bound = 3 * n * n + 8 * n + 5;
  t.snap(8, `Return ${maxSum}. Total <b>${ops}</b> operations. The bound 3n² + 8n + 5 = <b>${bound}</b> assumes line 7 runs all ${S} times; here it ran ${ifTrue}, so ${ops} = ${bound} − ${S - ifTrue}.`, "good", ex(-1, -1, 8));
  return t.snaps;
}

function maxSubExtra(a, s, mini) {
  const e = s.extra, n = a.length;
  if (!e) return "";
  let h = `<div class="l5-grid"><table><tr><th>i\\j</th>${a.map((_, j) => `<th>${j}</th>`).join("")}</tr>`;
  for (let i = 0; i < n; i++) {
    h += `<tr><th>${i}</th>`;
    for (let j = 0; j < n; j++) {
      if (j < i) { h += `<td class="empty"></td>`; continue; }
      const v = e.grid[i][j];
      let cls = v == null ? "" : "done";
      if (i === e.i && j === e.j) cls = "cur";
      if (e.best && e.best[0] === i && e.best[1] === j) cls += " best";
      h += `<td class="${cls}">${v == null ? "" : v}</td>`;
    }
    h += `</tr>`;
  }
  h += `</table></div>`;
  if (mini) return h;
  return cellsHTML(a, { cur: e.j >= 0 ? e.j : -1, out: (k) => e.i >= 0 && k < e.i, ptr: (k) => [k === e.i ? "i" : "", k === e.j ? "j" : ""].filter(Boolean).join(" ") }) + h +
    opsPanel(e.per, e.ops, e.hot, [1, 2, 3, 4, 5, 6, 7, 8], `<div><span>bound</span><b>${3 * n * n + 8 * n + 5}</b></div>`);
}

function demoMaxSub(el, { mini = false } = {}) {
  let data = mini ? [-2, 4, -1, 3] : [2, -5, 3, 1, -2, 4];
  makeStepper(el, {
    mini, code: CODE.maxSubPseudo, stackLabel: "variables",
    build: () => traceMaxSub(data),
    renderExtra: (s) => maxSubExtra(data, s, mini),
    extraControls: `<label>A <input type="text" class="ms-d" value="${data.join(", ")}" style="width:150px"></label>`,
    onMount(root, rebuild) {
      if (mini) return;
      root.querySelector(".ms-d").onchange = (e) => { data = parseNums(e.target.value, [2, -5, 3, 1, -2, 4]).slice(0, 8); e.target.value = data.join(", "); rebuild(); };
    },
  });
}

// ---------- Chapters 3, 5, 6: finding c and n0 ----------

const LIMIT = 1_000_000;
const nlog = (n) => n * log2(n);

const BOUNDS = {
  O: [
    { g: "3n² + 8n + 5", f: "n²", gf: (n) => 3 * n * n + 8 * n + 5, ff: (n) => n * n, c: 4, N: 14 },
    { g: "4n + 4", f: "n", gf: (n) => 4 * n + 4, ff: (n) => n, c: 4, N: 12 },
    { g: "2n", f: "n²", gf: (n) => 2 * n, ff: (n) => n * n, c: 2, N: 8 },
    { g: "n²", f: "n", gf: (n) => n * n, ff: (n) => n, c: 5, N: 14 },
  ],
  Omega: [
    { g: "4n + 4", f: "n", gf: (n) => 4 * n + 4, ff: (n) => n, c: 4, N: 12 },
    { g: "2n", f: "n²", gf: (n) => 2 * n, ff: (n) => n * n, c: 0.5, N: 10 },
    { g: "n³ − 100n²", f: "n³", gf: (n) => n * n * n - 100 * n * n, ff: (n) => n * n * n, c: 0.5, N: 300 },
  ],
  Theta: [
    { g: "3n + 4", f: "n", gf: (n) => 3 * n + 4, ff: (n) => n, c1: 3, c2: 7, N: 12 },
    { g: "n log n + 2n²", f: "n²", gf: (n) => nlog(n) + 2 * n * n, ff: (n) => n * n, c1: 2, c2: 3, N: 12 },
    { g: "½n² − 3n", f: "n²", gf: (n) => 0.5 * n * n - 3 * n, ff: (n) => n * n, c1: 0.25, c2: 0.5, N: 24 },
    { g: "6n² + 20n", f: "n³", gf: (n) => 6 * n * n + 20 * n, ff: (n) => n * n * n, c1: 1, c2: 26, N: 12 },
  ],
};

// Does the bound hold at integer n?  (Same tests as FindN0: g <= c f, g >= c f.)
function holds(mode, p, cs, n) {
  const g = p.gf(n), f = p.ff(n);
  if (mode === "O") return g <= cs[0] * f;
  if (mode === "Omega") return g >= cs[0] * f;
  return cs[0] * f <= g && g <= cs[1] * f;
}

// The last n in 1..LIMIT where the bound fails (0 if none), exactly as FindN0 does.
function lastBad(mode, p, cs) {
  let bad = 0;
  for (let n = 1; n <= LIMIT; n++) if (!holds(mode, p, cs, n)) bad = n;
  return bad;
}

const SYM = { O: "O", Omega: "Ω", Theta: "Θ" };

function demoBound(el, { mode = "O", mini = false } = {}) {
  const presets = BOUNDS[mode];
  let p = presets[0];
  let cs = mode === "Theta" ? [p.c1, p.c2] : [p.c];
  let n0 = 1, bad = lastBad(mode, p, cs);
  const id = Math.floor(Math.random() * 1e9);
  const cSlider = (k, label) => `<label>${label} <input type="range" class="bd-c${k}" min="0.25" max="30" step="0.25" value="${cs[k]}"> <b class="bd-cv${k} mono">${cs[k]}</b></label>`;
  el.innerHTML = `<div class="l5-plot bd-plot"></div><div class="l5-legend bd-leg"></div>
    ${mini ? "" : `<div class="msg bd-msg"></div><div class="stats bd-stats"></div>
    <div class="controls">
      <select class="bd-p">${presets.map((q, k) => `<option value="${k}">g(n) = ${q.g}, f(n) = ${q.f}</option>`).join("")}</select>
      ${mode === "Theta" ? cSlider(0, "c₁") + cSlider(1, "c₂") : cSlider(0, "c")}
      <button class="cbtn bd-back" title="n₀ − 1 (←)">◀ n₀</button>
      <label>n₀ = <b class="bd-n0 mono"></b></label>
      <button class="cbtn bd-fwd on" title="n₀ + 1 (→)">n₀ ▶</button>
      <button class="cbtn bd-best">smallest n₀</button>
    </div>`}`;
  const $ = (q) => el.querySelector(q);
  function render() {
    const N = Math.max(p.N, Math.min(LIMIT, n0 + 3));
    const curves = [[p.gf, "var(--teal)", "g(n)", false]];
    if (mode === "Theta") {
      curves.push([(n) => cs[0] * p.ff(n), "var(--amber)", `${cs[0]}·f(n)`, true]);
      curves.push([(n) => cs[1] * p.ff(n), "var(--red)", `${cs[1]}·f(n)`, true]);
    } else curves.push([(n) => cs[0] * p.ff(n), "var(--amber)", `${cs[0]}·f(n)`, true]);
    const series = curves.map(([fn, color, label, dash]) => ({ pts: sample(fn, 1, N), color, label, dash }));
    let lo = Infinity, hi = -Infinity;
    series.forEach((s) => s.pts.forEach(([, y]) => { lo = Math.min(lo, y); hi = Math.max(hi, y); }));
    // Keep g in view: cap the range at a few times g's maximum.
    let gHi = -Infinity; series[0].pts.forEach(([, y]) => { gHi = Math.max(gHi, y); });
    hi = Math.min(hi, gHi * 2.2);
    lo = Math.min(0, lo);
    const ints = [];
    const stepN = Math.max(1, Math.ceil(N / 60));
    for (let n = 1; n <= N; n += stepN) ints.push(n);
    const dots = ints.filter((n) => n >= n0 && !holds(mode, p, cs, n)).map((n) => ({ x: n, y: p.gf(n), color: "var(--red)", r: 4 }));
    const xt = niceTicks(1, N, 6).filter((t) => t >= 1);
    $(".bd-plot").innerHTML = plotSVG({
      ...plotDims(el), id, xMin: 1, xMax: N, yMin: lo, yMax: hi, series, dots, shadeFrom: n0,
      vline: { x: n0, label: "n₀ = " + n0 }, xTicks: xt, yTicks: niceTicks(lo, hi, 4), xLabel: "n",
      label: `g(n) = ${p.g} against multiples of f(n) = ${p.f}`,
    });
    $(".bd-leg").innerHTML = series.map((s) => `<span class="${s.dash ? "dash" : ""}" style="--c:${s.color}">${s.label === "g(n)" ? `g(n) = ${p.g}` : s.label.replace("f(n)", p.f)}</span>`).join("");
    if (mini) return;
    $(".bd-n0").textContent = n0;
    const rel = mode === "O" ? `g(n) ≤ ${cs[0]}·${p.f}` : mode === "Omega" ? `g(n) ≥ ${cs[0]}·${p.f}` : `${cs[0]}·${p.f} ≤ g(n) ≤ ${cs[1]}·${p.f}`;
    const msg = $(".bd-msg");
    if (bad === LIMIT) {
      msg.className = "msg bd-msg bad";
      msg.innerHTML = `With these constants, ${rel} fails at every n up to 10⁶ (and beyond): <b>no n₀ works</b>. ${mode === "O" && p.f === "n" && p.g === "n²" ? "No constant can work: n² ≤ c·n means n ≤ c." : mode === "Omega" && p.g === "2n" ? "No constant can work: 2n ≥ c·n² means n ≤ 2/c." : mode === "Theta" && p.f === "n³" ? "The lower bound c₁·n³ ≤ 6n² + 20n fails for large n whatever c₁ is: n³ is an upper bound, not a tight one." : "Change the constant" + (mode === "Theta" ? "s." : ".")}`;
    } else if (n0 > bad) {
      msg.className = "msg bd-msg good";
      msg.innerHTML = `${rel} for all n ≥ ${n0} (checked up to 10⁶). So g(n) = ${SYM[mode]}(${p.f}) with ${mode === "Theta" ? `c₁ = ${cs[0]}, c₂ = ${cs[1]}` : `c = ${cs[0]}`}, n₀ = ${n0}.`;
    } else {
      let first = n0; while (holds(mode, p, cs, first)) first++;
      msg.className = "msg bd-msg bad";
      msg.innerHTML = `Not yet: the bound fails at n = ${first} (red dots), which is ≥ n₀. The smallest n₀ for these constants is <b>${bad + 1}</b>.`;
    }
    $(".bd-stats").innerHTML = `<div class="stat"><small>g(${n0})</small><b>${fmt(p.gf(n0))}</b></div>
      ${mode === "Theta" ? `<div class="stat"><small>c₁·f(${n0})</small><b>${fmt(cs[0] * p.ff(n0))}</b></div><div class="stat"><small>c₂·f(${n0})</small><b>${fmt(cs[1] * p.ff(n0))}</b></div>` : `<div class="stat"><small>c·f(${n0})</small><b>${fmt(cs[0] * p.ff(n0))}</b></div>`}
      <div class="stat ${bad === LIMIT ? "bad" : "good"}"><small>smallest n₀</small><b>${bad === LIMIT ? "none" : bad + 1}</b></div>`;
    $(".bd-back").disabled = n0 <= 1;
  }
  function recompute() { bad = lastBad(mode, p, cs); render(); }
  if (!mini) {
    $(".bd-p").onchange = (e) => {
      p = presets[+e.target.value];
      cs = mode === "Theta" ? [p.c1, p.c2] : [p.c];
      cs.forEach((c, k) => { $(`.bd-c${k}`).value = c; $(`.bd-cv${k}`).textContent = c; });
      n0 = 1; recompute();
    };
    cs.forEach((_, k) => {
      $(`.bd-c${k}`).oninput = (e) => { cs[k] = +e.target.value; $(`.bd-cv${k}`).textContent = cs[k]; recompute(); };
    });
    $(".bd-back").onclick = () => { if (n0 > 1) n0--; render(); };
    $(".bd-fwd").onclick = () => { if (n0 < LIMIT) n0++; render(); };
    $(".bd-best").onclick = () => { if (bad < LIMIT) { n0 = bad + 1; render(); } };
    el.tabIndex = 0;
    el.addEventListener("keydown", (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "SELECT") return;
      if (e.key === "ArrowRight") { e.preventDefault(); $(".bd-fwd").click(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); $(".bd-back").click(); }
    });
  } else n0 = bad + 1;   // the mini shows the smallest n0 for the first preset
  render();
}

// ---------- Chapter 4: growth classes ----------

const CLASSES = [
  { name: "1", f: () => 1, v: (n, k) => 1, color: "var(--stone)" },
  { name: "log n", f: (x) => log2(x), v: (n, k) => k, color: "var(--green)" },
  { name: "n", f: (x) => x, v: (n) => n, color: "var(--teal)" },
  { name: "n log n", f: (x) => x * log2(x), v: (n, k) => n * k, color: "var(--sea)" },
  { name: "n²", f: (x) => x * x, v: (n) => n * n, color: "var(--amber)" },
  { name: "n³", f: (x) => x ** 3, v: (n) => n ** 3, color: "var(--red)" },
  { name: "2ⁿ", f: (x) => 2 ** x, v: (n) => 2 ** n, color: "var(--ink)" },
];

function demoGrowth(el, { mini = false } = {}) {
  let logY = false;
  const id = Math.floor(Math.random() * 1e9);
  makeSteps(el, {
    mini, interval: 1300,
    build: () => [0, 1, 2, 3, 4, 5].map((k) => ({ k, n: 2 ** k })).map((s) => ({ ...s,
      msg: s.n === 1 ? "At n = 1 every class is about the same: constants dominate." :
        s.n <= 4 ? `n = ${s.n}: the curves are still close together.` :
          s.n === 8 ? "n = 8: 2ⁿ = 256 has passed n² = 64 and is about to pass n³ = 512." :
            s.n === 16 ? "n = 16: 2ⁿ = 65,536 is off the chart. n log n = 64 is four times n = 16." :
              "n = 32: 2ⁿ is over four billion. n log n = 160, n² = 1,024: this gap is why sorting algorithms matter." })),
    start: (snaps) => (mini ? 3 : 3),
    countLabel: (s) => `n = ${s.n}`,
    render: (s) => {
      const N = Math.max(s.n, 2);
      const yTop = logY ? Math.log10(2 ** N) : Math.max(N * N, 4);
      const series = CLASSES.map((c) => ({ pts: sample((x) => (logY ? Math.log10(Math.max(c.f(x), 1e-3)) : c.f(x)), 1, N, 200), color: c.color, label: c.name }));
      const lab = CLASSES.map((c) => {
        // Put the label where the curve leaves the chart or at the right end.
        let x = N;
        if (!logY && c.f(N) > yTop) { let lo = 1, hi = N; for (let t = 0; t < 40; t++) { const m = (lo + hi) / 2; if (c.f(m) > yTop * 0.92) hi = m; else lo = m; } x = lo; }
        return { x: x * 0.98, y: logY ? Math.log10(Math.max(c.f(x * 0.98), 1e-3)) : c.f(x * 0.98), text: c.name, color: c.color };
      });
      const plot = plotSVG({
        id, xMin: 1, xMax: N, yMin: logY ? -0.2 : 0, yMax: yTop, series, labels: mini ? [] : lab,
        xTicks: niceTicks(1, N, 6).filter((t) => t >= 1), yTicks: logY ? niceTicks(0, yTop, 5) : niceTicks(0, yTop, 4),
        yFmt: logY ? (t) => "10^" + t : undefined, xLabel: "n", ...plotDims(el),
        label: "growth of the common complexity classes",
      });
      if (mini) return `<div class="l5-plot">${plot}</div><div class="l5-legend">${CLASSES.map((c) => `<span style="--c:${c.color}">${c.name}</span>`).join("")}</div>`;
      const table = `<div class="l5-table"><table><tr><th>class</th>${[1, 2, 4, 8, 16, 32].map((n) => `<th>n=${n}</th>`).join("")}</tr>${CLASSES.map((c) => `<tr><td>${c.name}</td>${[0, 1, 2, 3, 4, 5].map((k) => `<td style="${k === s.k ? "background:var(--mark);font-weight:700" : ""}">${c.v(2 ** k, k).toLocaleString("en")}</td>`).join("")}</tr>`).join("")}</table></div>`;
      return `<div class="l5-plot">${plot}</div><div class="l5-legend">${CLASSES.map((c) => `<span style="--c:${c.color}">${c.name}</span>`).join("")}</div>${table}`;
    },
    extraControls: `<label><input type="checkbox" class="gr-log"> log scale</label>`,
    onMount(root, rebuild) {
      if (mini) return;
      root.querySelector(".gr-log").onchange = (e) => { logY = e.target.checked; rebuild(true); };
    },
  });
}

// ---------- Chapter 4: rules (iv) and (v), the long run ----------

const RATIOS = [
  { name: "(log n)² vs √n", x: "k (n = 2ᵏ)", xMax: 40, step: 1, n: (k) => `2^${k}`,
    lr: (k) => 2 * log2(k) - k / 2, g: "(log n)²", f: "√n",
    note: "(log₂ n)² = k² and √n = 2^(k/2). The log is ahead until k = 16 (n = 65,536), where they are equal; after that √n wins for good." },
  { name: "n¹⁰ vs 2ⁿ", x: "n", xMax: 120, step: 1, n: (x) => String(x),
    lr: (x) => 10 * Math.log(x) / Math.log(2) - x, g: "n¹⁰", f: "2ⁿ",
    note: "2¹ = 2 > 1¹⁰, then n¹⁰ races ahead; from n = 59 on, 2ⁿ is ahead for good." },
  { name: "(log n)² vs n^0.0001", x: "k (n = 2ᵏ)", xMax: 1_000_000, step: 25_000, n: (k) => `2^${k}`,
    lr: (k) => 2 * Math.log(k) / Math.log(2) - k / 10000, g: "(log n)²", f: "n^0.0001",
    note: "The rule still holds, but only for n beyond 2^369939, a number with over 100,000 digits." },
];

// Last x in 2..xMax with log2(g/f) >= 0, as in LogVsPower / ExpVsPower.
function ratioLastBad(r) {
  let bad = 0;
  for (let x = 1; x <= r.xMax; x++) if (r.lr(x) >= 0) bad = x;
  return bad;
}

function demoRatio(el) {
  let r = RATIOS[0], bad = ratioLastBad(r);
  const id = Math.floor(Math.random() * 1e9);
  makeSteps(el, {
    noPlay: false, interval: 250,
    build: () => {
      const xs = [];
      for (let x = r.step === 1 ? 1 : r.step; x <= r.xMax; x += r.step) xs.push(x);
      const xName = r.x.split(" ")[0];
      return xs.map((x) => {
        const v = r.lr(x), after = x > bad;
        return { x, cls: after ? "good" : "",
          msg: `${xName} = ${x.toLocaleString("en")}: ${v > 0 ? `${r.g} is bigger` : v < 0 ? `${r.f} is bigger` : "they are equal"}` +
            (after ? `, and ${r.g} stays smaller from ${xName} = ${(bad + 1).toLocaleString("en")} on.` : `. ${r.f} takes over for good only from ${xName} = ${(bad + 1).toLocaleString("en")}.`) };
      });
    },
    countLabel: (s) => `${r.x.split(" ")[0]} = ${s.x.toLocaleString("en")}`,
    render: (s) => {
      const pts = [];
      const K = 300;
      for (let t = 0; t <= K; t++) { const x = Math.max(1, (r.xMax * t) / K); pts.push([x, r.lr(x)]); }
      let lo = Infinity, hi = -Infinity; pts.forEach(([, y]) => { lo = Math.min(lo, y); hi = Math.max(hi, y); });
      lo = Math.min(lo, -1); hi = Math.max(hi, 1);
      const plot = plotSVG({
        ...plotDims(el), id, xMin: 1, xMax: r.xMax, yMin: lo, yMax: hi, series: [{ pts, color: "var(--teal)" }], zeroLine: true,
        cursor: s.x, vline: { x: bad + 1, label: `${r.x.split(" ")[0]} = ${(bad + 1).toLocaleString("en")}` },
        dots: [{ x: s.x, y: r.lr(s.x), color: "var(--amber)", r: 5 }],
        xTicks: niceTicks(1, r.xMax, 5).filter((t) => t >= 1), yTicks: niceTicks(lo, hi, 5), xLabel: r.x,
        xFmt: (t) => (t >= 1e5 ? t / 1000 + "k" : t), label: `log2 of ${r.g} / ${r.f}`,
      });
      const v = r.lr(s.x);
      return `<div class="l5-plot">${plot}</div>
        <div class="stats"><div class="stat"><small>n</small><b>${r.n(s.x)}</b></div>
        <div class="stat"><small>log₂(${r.g} / ${r.f})</small><b>${v.toFixed(2)}</b></div>
        <div class="stat ${v < 0 ? "good" : "bad"}"><small>bigger</small><b>${v > 0 ? r.g : v < 0 ? r.f : "equal"}</b></div></div>
        <p class="hint">${r.note} The curve is log₂ of the ratio: above the dashed zero line ${r.g} is bigger. A ratio that tends to 0 is a log that goes to −∞.</p>`;
    },
    start: () => 0,
    onMount(root, rebuild) {
      const sel = document.createElement("select");
      sel.innerHTML = RATIOS.map((q, k) => `<option value="${k}">${q.name}</option>`).join("");
      root.querySelector(".controls").insertBefore(sel, root.querySelector(".spacer"));
      sel.onchange = () => { r = RATIOS[+sel.value]; bad = ratioLastBad(r); rebuild(); };
    },
  });
}

// ---------- Chapter 4: simplifying with the rules ----------

const SIMPLIFY = [
  { name: "product: (n³ + n² + 1)(n⁷ + n¹²)", steps: [
    ["g(n) = (n³ + n² + 1) · (n⁷ + n¹²)", "", "Two factors: use the product rule on g₁ = n³ + n² + 1 and g₂ = n⁷ + n¹²."],
    ["(<span class=hit>n³</span> + <span class=dead>n²</span> + <span class=dead>1</span>) · (n⁷ + n¹²)", "RULE (i) · THE BIGGEST EATS ALL", "In g₁ the highest power is n³: g₁ = O(n³)."],
    ["O(n³) · (<span class=dead>n⁷</span> + <span class=hit>n¹²</span>)", "RULE (i)", "In g₂ the highest power is n¹² (not the first term!): g₂ = O(n¹²)."],
    ["O(n³) · O(n¹²) = <span class=ok>O(n¹⁵)</span>", "RULE (ii) · PRODUCTS MULTIPLY", "The product rule: O(n³ · n¹²) = O(n¹⁵)."],
  ] },
  { name: "sum: (n³ + n² + 1) + (n⁴ + n⁷ + n²⁰ + n³⁰)", steps: [
    ["g(n) = (n³ + n² + 1) + (n⁴ + n⁷ + n²⁰ + n³⁰)", "", "Two groups: use the sum property."],
    ["O(n³) + O(n³⁰)", "RULE (i)", "Each group by the polynomial rule."],
    ["O(max(n³, n³⁰)) = <span class=ok>O(n³⁰)</span>", "RULE (iii) · THE BIGGER OF THE TWO", "Two terms is a fixed number, so the sum property applies."],
  ] },
  { name: "log vs power: (log n)² + n^0.0001", steps: [
    ["g(n) = (log n)² + n<sup>0.0001</sup>", "", "A power of log n plus a (tiny) power of n."],
    ["<span class=dead>(log n)²</span> + <span class=hit>n<sup>0.0001</sup></span>", "RULE (iv) · LOG ONLY BEATS CONSTANTS", "Any power of n, however small, eventually beats any power of log n."],
    ["<span class=ok>O(n<sup>0.0001</sup>)</span>", "", "Eventually means very eventually here: n > 2^369939. But asymptotically, this is the answer."],
  ] },
  { name: "exponentials: 2ⁿ + 3ⁿ", steps: [
    ["g(n) = 2ⁿ + 3ⁿ", "", "Two exponentials with bases 2 and 3."],
    ["<span class=dead>2ⁿ</span> + <span class=hit>3ⁿ</span> ≤ 3ⁿ + 3ⁿ = 2·3ⁿ", "RULE (v) · THE BIGGER BASE WINS", "2ⁿ ≤ 3ⁿ for all n ≥ 1, so g(n) ≤ 2·3ⁿ: c = 2, n₀ = 1."],
    ["<span class=ok>O(3ⁿ)</span>", "", "Not O(2ⁿ): 3ⁿ / 2ⁿ = 1.5ⁿ grows without bound, so no constant c works."],
  ] },
  { name: "exponential + power: 2ⁿ + n¹⁰⁰⁰⁰", steps: [
    ["g(n) = 2ⁿ + n<sup>10000</sup>", "", "An exponential plus a huge power."],
    ["<span class=hit>2ⁿ</span> + <span class=dead>n<sup>10000</sup></span>", "RULE (v) · EXPONENTIALS BEAT POWERS", "n^k / aⁿ → 0 for any a > 1 and any k."],
    ["<span class=ok>O(2ⁿ)</span>", "", ""],
  ] },
  { name: "Θ: (3n² + 2√n)(n log n + n)", steps: [
    ["g(n) = (3n² + 2√n) · (n log n + n)", "", "A product of two sums."],
    ["(<span class=hit>3n²</span> + <span class=dead>2n<sup>0.5</sup></span>) · (n log n + n)", "RULE (i) · NON-INTEGER POWERS TOO", "√n = n^0.5 < n²: the first factor is Θ(n²)."],
    ["Θ(n²) · (<span class=hit>n log n</span> + <span class=dead>n</span>)", "RULE (iv)", "n = n·1 and n log n = n·log n; log n beats the constant 1: the second factor is Θ(n log n)."],
    ["Θ(n²) · Θ(n log n) = <span class=ok>Θ(n³ log n)</span>", "RULE (ii)", "Multiply. (The ratio g(n) / (n³ log n) tends to 3 · 1 = 3; see ThetaRatio.)"],
  ] },
  { name: "the trap: 1 + 1 + ⋯ + 1 (n ones)", steps: [
    ["f(n) = 1 + 1 + ⋯ + 1 &nbsp;(n terms)", "", "Each term is O(1). Can we use the sum property?"],
    ["O(max(1, 1, …, 1)) = O(1) &nbsp;<span class=bad>?</span>", "RULE (iii) — MISUSED", "That is what the sum property seems to say…"],
    ["f(n) = n &nbsp;<span class=bad>≠ O(1)</span>", "", "But f(n) = n. The number of terms grows with n, and the sum property only holds for a fixed number of terms."],
    ["<span class=ok>f(n) = Θ(n)</span>", "", "In code: a loop of n iterations with O(1) work each is O(n), not O(1)."],
  ] },
];

function demoSimplify(el) {
  let ex = SIMPLIFY[0];
  makeSteps(el, {
    noPlay: true,
    build: () => ex.steps.map(([expr, rule, msg], k) => ({ expr, rule, msg, cls: k === ex.steps.length - 1 && !ex.name.startsWith("the trap") ? "good" : "" })),
    render: (s) => `<div class="l5-rule">${s.rule || "&nbsp;"}</div><div class="l5-expr">${s.expr}</div>`,
    extraControls: `<select class="si-p">${SIMPLIFY.map((q, k) => `<option value="${k}">${q.name}</option>`).join("")}</select>`,
    onMount(root, rebuild) { root.querySelector(".si-p").onchange = (e) => { ex = SIMPLIFY[+e.target.value]; rebuild(); }; },
  });
}

// ---------- Chapter 6: comparing algorithms ----------

function binaryWorst(n) { return Math.floor(log2(n) + 1e-12) + 1; }

function demoSearchRace(el) {
  const NS = [10, 100, 1000, 10_000, 100_000, 1_000_000, 10_000_000, 100_000_000, 1_000_000_000];
  makeSteps(el, {
    noPlay: false, interval: 900,
    build: () => NS.map((n) => ({ n, msg: `n = ${n.toLocaleString("en")}: linear search up to ${n.toLocaleString("en")} comparisons, binary search at most ${binaryWorst(n)} (⌊log₂ n⌋ + 1).` })),
    start: () => 2,
    countLabel: (s) => `n = ${s.n.toLocaleString("en")}`,
    render: (s) => {
      const lin = s.n, bin = binaryWorst(s.n);
      return `<div class="bars">${[["linear search  Θ(n)", lin, "amber"], ["binary search  Θ(log n)", bin, ""]].map(([k, v, c]) =>
        `<div class="bar"><span>${k}</span><div class="track"><div class="fill ${c}" style="width:${Math.max(0.4, (100 * v) / lin)}%"></div></div><span class="v">${v.toLocaleString("en")}</span></div>`).join("")}</div>
        <div class="stats"><div class="stat"><small>ratio</small><b>${fmt(Math.round(lin / bin))}×</b></div><div class="stat"><small>n × 10 adds</small><b>+3 or +4</b></div></div>`;
    },
  });
}

function demoConstants(el) {
  const ALG = [
    { name: "A: 10000n", f: (n) => 10000 * n, color: "amber" },
    { name: "B: 9n", f: (n) => 9 * n, color: "" },
    { name: "C: n²", f: (n) => n * n, color: "red" },
  ];
  const NS = [1, 10, 100, 1000, 9000, 10_000, 100_000, 1_000_000];
  makeSteps(el, {
    noPlay: false, interval: 1000,
    build: () => NS.map((n) => {
      const v = ALG.map((a) => a.f(n));
      const best = ALG[v.indexOf(Math.min(...v))].name.split(":")[0];
      const msg = n < 9 ? `n = ${n}: C (n²) is cheapest. For tiny inputs constant factors decide.` :
        n < 10000 ? `n = ${n.toLocaleString("en")}: B (9n) wins; C is still cheaper than A, because 10000n > n² while n < 10,000.` :
          n === 10000 ? "n = 10,000: A and C cost exactly the same. Beyond this point C loses to A for ever." :
            `n = ${n.toLocaleString("en")}: C costs ${fmt(v[2] / v[0])}× as much as A. A and B are both Θ(n); B is about 1,111× cheaper than A — a constant that never changes.`;
      return { n, v, best, msg, cls: n > 10000 ? "good" : "" };
    }),
    start: () => 0,
    countLabel: (s) => `n = ${s.n.toLocaleString("en")}`,
    render: (s) => {
      const max = Math.max(...s.v);
      return `<div class="bars">${ALG.map((a, k) => `<div class="bar"><span class="mono">${a.name}</span><div class="track"><div class="fill ${a.color}" style="width:${Math.max(0.4, (100 * s.v[k]) / max)}%"></div></div><span class="v">${fmt(s.v[k])}</span></div>`).join("")}</div>
        <div class="stats"><div class="stat good"><small>cheapest</small><b>${s.best}</b></div></div>`;
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
  sumOps: (el) => demoSumOps(el),
  linearSearch: (el) => demoLinearSearch(el),
  maxSub: (el) => demoMaxSub(el),
  maxSubMini: (el) => demoMaxSub(el, { mini: true }),
  bigOh: (el) => demoBound(el, { mode: "O" }),
  bigOhMini: (el) => demoBound(el, { mode: "O", mini: true }),
  bigOmega: (el) => demoBound(el, { mode: "Omega" }),
  bigOmegaMini: (el) => demoBound(el, { mode: "Omega", mini: true }),
  bigTheta: (el) => demoBound(el, { mode: "Theta" }),
  bigThetaMini: (el) => demoBound(el, { mode: "Theta", mini: true }),
  growth: (el) => demoGrowth(el),
  growthMini: (el) => demoGrowth(el, { mini: true }),
  ratio: (el) => demoRatio(el),
  simplify: (el) => demoSimplify(el),
  searchRace: (el) => demoSearchRace(el),
  constants: (el) => demoConstants(el),
  quiz: (el) => demoQuiz(el, QUIZ),
};
