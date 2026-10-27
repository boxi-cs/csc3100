// Chapter content, adapted from notes/L02-java-basics.md. Code and outputs come from CODE / OUT in demos.js.

const demo = (name, title, instr, hint = "") =>
  `<div class="card demo" data-demo="${name}"><div class="head"><span class="title">${title}</span><span>${instr}</span></div>
   <div class="demo-body"></div>${hint ? `<p class="hint">${hint}</p>` : ""}</div>`;

const callout = (kind, label, body) => `<div class="callout ${kind}"><b>${label}</b>${body}</div>`;
const predict = (q, a) => callout("predict", "PREDICT", `<p>${q}</p><details class="reveal"><summary>Show the answer</summary>${a}</details>`);
const out = (key) => codeBlock(OUT[key], "out");
const prog = (key) => codeBlock(CODE[key]) + (OUT[key] !== undefined ? out(key) : "");
const table = (head, rows) => `<div style="overflow-x:auto"><table><thead><tr>${head.map((h) => `<th>${h}</th>`).join("")}</tr></thead>
  <tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;

const LECTURE = {
  number: 2,
  title: "Java Basics",
  tagline: "The Java you need for data structures",
  lead: "From javac and the JVM to variables, loops, classes, exceptions, strings and files — interactive notes where every object, reference and loop iteration can be stepped through.",
  heroDemo: "variableKindsMini",
  heroLabel: "Static, instance and local variables · new Student(…)",
  heroCaption: "Every object gets its own name; all objects share one static count.",
  whyTitle: "Why this lecture matters",
  whySub: "Every later lecture writes its data structures in Java",
  why: [
    ["Write once, run anywhere", "<code>javac</code> turns source into <b>bytecode</b>, and every operating system's <b>JVM</b> runs the same <code>.class</code> file."],
    ["Values and references", "Eight <b>primitive types</b> hold values; everything else is a <b>reference</b> to an object on the heap. Lists, stacks and trees are built from references."],
    ["Classes are the building blocks", "A node, a list, a stack: each is a <b>class</b> with private fields, a constructor and methods. This lecture shows how to write one."],
  ],
  ctaTitle: "Ready to compile your first program?",
  minutes: "About 90 minutes",
  videos: {
    "media/L02-1.mp4": "Lecture 2 · Part 1 — The JVM and the primitive types (8.6 min)",
    "media/L02-2.mp4": "Lecture 2 · Part 2 — Variables and loops (10.5 min)",
    "media/L02-3.mp4": "Lecture 2 · Part 3 — Classes, objects and exceptions (9.6 min)",
    "media/L02-4.mp4": "Lecture 2 · Part 4 — Arrays, strings, casting and files (10.2 min)",
  },
};

const CHAPTERS = [
  {
    slug: "1-toolchain", nav: "Toolchain", title: "Java, the JDK and the JVM",
    subtitle: "Why Java, and how a program gets from source code to output",
    abstract: "You write Welcome.java, javac compiles it into bytecode, and the JVM on your computer runs the bytecode. That two-step design is what makes Java portable.",
    tags: ["why Java", "JDK ⊃ JRE ⊃ JVM", "javac / java", "bytecode"],
    hero: "pipelineMini", heroCaption: "Source → javac → bytecode → JVM → output.",
    sections: [
      { id: "video-1", title: "Watch: The JVM and the primitive types", html: `
        <div class="card video" data-video="media/L02-1.mp4"></div>` },
      { id: "why", title: "Why Java for this course", html: `
        <p>This course is not only about drawing data structures: you will <b>implement</b> them and the algorithms that use them, and run your code on real inputs. The course uses Java because it is widely used and comparatively easy to learn; because it is <b>platform-independent</b> (“write once, run anywhere”: a program is compiled into <b>bytecode</b> that runs on Windows, macOS and Linux alike); because it powers Android apps, enterprise software and big-data systems such as Hadoop and Spark; and because its standard library has ready-made data structures (<code>ArrayList</code>, <code>LinkedList</code>, <code>HashMap</code>, …). After building a structure yourself you will know what the library version does inside, and what each operation costs.</p>
        ${table(["", "Java", "C / C++"], [
          ["memory", "automatic: the <b>garbage collector</b> frees unreachable objects", "manual (<code>malloc</code>/<code>free</code>, <code>new</code>/<code>delete</code>)"],
          ["pointers", "<b>references</b> only: no arithmetic, no raw addresses", "pointers with arithmetic"],
          ["array bounds", "checked: a bad index throws an exception", "not checked: a bad index corrupts memory"],
          ["platforms", "one compiled program runs on every JVM", "recompile for each platform"],
          ["standard library", "large (collections, files, networking, …)", "smaller (C++ has the STL)"]])}
        ${callout("note", "NOTE · “NO POINTERS”", `<p>The slides say Java has no pointers. More precisely, a variable of a class type holds a <b>reference</b>, an arrow to an object. You can copy and follow it but not do arithmetic on it. A reference can be <code>null</code>, and following <code>null</code> throws a <code>NullPointerException</code>.</p>`)}
        <p><b>What we learn:</b> the JDK, JVM and JRE; keywords; variables; statements; classes and objects; methods; exceptions; arrays, strings and files. <b>What we skip:</b> interfaces, abstract classes, inheritance, GUIs, multi-threading, the internals of garbage collection, networking, web and Android development. Every data structure in the course can be written without them.</p>` },
      { id: "jdk", title: "JDK, JRE and JVM", html: `
        <ul><li>The <b>JVM</b> (Java Virtual Machine) is an abstract machine: a specification of a computer that executes <b>bytecode</b>. The <code>java</code> command implements it.</li>
        <li>The <b>JRE</b> (Java Runtime Environment) is what you need to <em>run</em> a program: a JVM plus the standard libraries.</li>
        <li>The <b>JDK</b> (Java Development Kit) is what you need to <em>write</em> programs: the JRE plus tools, above all the compiler <code>javac</code>.</li></ul>
        ${codeBlock("+------------------------------ JDK -------------------------------+\n|  +---------------------- JRE ----------------------+              |\n|  |   JVM   +   standard class libraries             |  + javac,    |\n|  +--------------------------------------------------+    debugger, |\n|                                                          jar, ...  |\n+--------------------------------------------------------------------+", "out")}
        ${callout("note", "NOTE · PORTABLE BYTECODE, NATIVE JVM", `<p><b>Java is platform-independent, but the JVM is not.</b> The bytecode in a <code>.class</code> file is the same everywhere; each operating system has its own JVM that translates it for its processor. Since Java 11 there is no separate JRE download: install a JDK and you have everything.</p>`)}` },
      { id: "first", title: "The first program", html: `
        ${prog("welcome")}
        <ul><li><code>public class Welcome { … }</code> declares a <b>class</b>. All Java code lives in classes. A public class must be saved in a file of the same name, <code>Welcome.java</code>.</li>
        <li><code>public static void main(String[] args)</code> is the <b>main method</b>, the entry point: the JVM starts the program by calling it.</li>
        <li><code>System.out.println(…)</code> prints its argument and a line break. Statements end with <code>;</code>, and <code>{ }</code> groups them into blocks.</li></ul>
        ${callout("pitfall", "PITFALL · JAVA IS CASE-SENSITIVE", `<p><code>Public class Welcome</code> (capital P), as on the slide, does not compile: <code>Public</code> is not a keyword. Keywords are all lower case; <code>Class</code> is not <code>class</code>, and <code>system.out.println</code> fails too.</p>`)}` },
      { id: "run", title: "From source code to output", html: `
        <p>Running a program takes two steps: <code>javac Welcome.java</code> compiles the source into <code>Welcome.class</code> (bytecode), and <code>java Welcome</code> runs that bytecode on the JVM.</p>
        ${demo("pipeline", "Demo 1 · From Welcome.java to the console", "← → keys step", "Pick “source with a typo” to see a compile-time error send you back to the source. No <code>.class</code> file is written until the program compiles.")}
        <p>A <b>compile-time error</b> (misspelt keyword, missing semicolon, type mismatch) is reported by <code>javac</code> before anything runs. A <b>run-time error</b> (a crash) or a wrong result shows up only when the program runs. Either way you go back to the source, edit, recompile and rerun. Since Java 11, <code>java Welcome.java</code> also compiles a single-file program in memory and runs it.</p>` },
      { id: "setup", title: "Setting up", html: `
        <ol><li>Install a JDK (any recent OpenJDK build, Java 21 or newer).</li>
        <li>Set <code>JAVA_HOME</code> to the JDK folder and add its <code>bin</code> folder to <code>PATH</code> (on Windows <code>%JAVA_HOME%\\bin</code>). Installers on macOS and Linux usually do this.</li>
        <li>Check: <code>java --version</code> and <code>javac --version</code> both print a version.</li>
        <li>Install an editor or IDE: VS Code with the Java extensions, IntelliJ IDEA, Eclipse, …</li></ol>` },
    ],
    takeaways: ["JDK ⊃ JRE ⊃ JVM.", "javac compiles to bytecode; java runs it.", "Same .class file, a JVM per platform."],
  },
  {
    slug: "2-variables", nav: "Variables", title: "Keywords, Types and Variables",
    subtitle: "Eight primitive types, references, and three kinds of variables",
    abstract: "A variable is a named, typed memory location. Where you declare it decides how many copies exist and how long it lives: local, static or instance.",
    tags: ["keywords", "primitive types", "overflow", "local / static / instance"],
    hero: "scopeMini", heroCaption: "A local variable lives only inside its block.",
    sections: [
      { id: "video-2", title: "Watch: Variables and loops", html: `
        <div class="card video" data-video="media/L02-2.mp4"></div>` },
      { id: "keywords", title: "Reserved words", html: `
        <p><b>Keywords</b> (reserved words) such as <code>class</code>, <code>public</code>, <code>static</code>, <code>int</code>, <code>if</code>, <code>new</code>, <code>this</code> have a fixed meaning and cannot be used as <b>identifiers</b> (names of variables, methods or classes). They are case-sensitive.</p>
        ${codeBlock(CODE.keywordAsNameBad)}
        ${codeBlock("KeywordAsName.java:3: error: not a statement\n        String this = \"Hello World!\";\n        ^\nKeywordAsName.java:3: error: ';' expected\n        String this = \"Hello World!\";\n              ^\n2 errors", "out")}
        <p>The messages are confusing because the compiler does not read <code>this</code> as a name at all. When an error makes no sense, look for a keyword or a missing symbol just before the place it points to.</p>
        ${table(["group", "keywords", "meaning"], [
          ["loops", "<code>for</code>, <code>while</code>, <code>do</code>, <code>break</code>, <code>continue</code>", "repeat; leave a loop; skip to the next iteration"],
          ["conditions", "<code>if</code>, <code>else</code>, <code>switch</code>, <code>case</code>", "choose between branches"],
          ["classes and objects", "<code>class</code>, <code>new</code>, <code>this</code>, <code>static</code>", "declare a class; create an object; the current object; belongs to the class"],
          ["exceptions", "<code>try</code>, <code>catch</code>, <code>finally</code>, <code>throw</code>, <code>throws</code>", "detect, handle and announce errors"],
          ["access", "<code>public</code>, <code>protected</code>, <code>private</code>", "who may use a member"],
          ["others", "<code>import</code>, <code>package</code>, <code>return</code>, <code>void</code>", "use other packages; leave a method; no result"]])}
        <p>A <code>try</code> block must be followed by a <code>catch</code> or a <code>finally</code> block. <code>true</code>, <code>false</code> and <code>null</code> are technically <b>literals</b>, not keywords, but are reserved too.</p>` },
      { id: "types", title: "The eight primitive types", html: `
        ${table(["type", "size", "range / values", "literal"], [
          ["<code>boolean</code>", "—", "<code>true</code> or <code>false</code>", "<code>true</code>"],
          ["<code>byte</code>", "8 bits", "−128 … 127", "<code>(byte) 7</code>"],
          ["<code>short</code>", "16 bits", "−32 768 … 32 767", "<code>(short) 7</code>"],
          ["<code>int</code>", "32 bits", "about ±2.1 × 10⁹", "<code>42</code>"],
          ["<code>long</code>", "64 bits", "about ±9.2 × 10¹⁸", "<code>42L</code>"],
          ["<code>float</code>", "32 bits", "about ±3.4 × 10³⁸, ~7 digits", "<code>3.14f</code>"],
          ["<code>double</code>", "64 bits", "about ±1.8 × 10³⁰⁸, ~15–16 digits", "<code>3.14</code>"],
          ["<code>char</code>", "16 bits", "a UTF-16 code unit, 0 … 65 535", "<code>'A'</code>"]])}
        <p>The integer types are signed and stored in <b>two's complement</b>: the highest bit is worth −2⁷ in a byte instead of +2⁷.</p>
        ${prog("primitiveRanges")}
        ${demo("byteBits", "Demo 2 · The eight bits of a byte", "press b++ past 127", "The leftmost bit is the sign bit, worth −128. Adding 1 to 127 = 0111 1111 gives 1000 0000 = −128.")}
        ${callout("pitfall", "PITFALL · OVERFLOW IS SILENT", `<p><code>Integer.MAX_VALUE + 1</code> wraps to the most negative <code>int</code> with no error. Sum many large numbers in a <code>long</code>, and compute a midpoint as <code>low + (high - low) / 2</code>, not <code>(low + high) / 2</code>.</p>`)}
        ${predict("A <code>byte</code> holds 100. What is in it after <code>b += 50</code>? And is <code>0.1</code> added to itself ten times <code>== 1.0</code>?", `<p><b>−106</b> (150 − 256). And ten additions of 0.1 give <code>0.9999999999999999</code>, so <code>== 1.0</code> is <code>false</code>. Compare doubles with a tolerance: <code>Math.abs(x - 1.0) &lt; 1e-9</code>.</p>`)}` },
      { id: "declare", title: "Declaring variables; values and references", html: `
        <p>A <b>variable</b> is a named memory location with a fixed <b>type</b>. You <b>declare</b> it (<code>int count;</code>), optionally <b>initialise</b> it (<code>int age = 20;</code>), and assign to it later (<code>count = 0;</code>). Booleans are <code>true</code>/<code>false</code>, lower case.</p>
        ${prog("varExample")}
        <p><code>50000.50</code> prints as <code>50000.5</code>: a <code>double</code> stores a number, not how it was typed. <code>+</code> with a <code>String</code> on either side means <b>concatenation</b>.</p>
        <p>Java's types come in two families. A <b>primitive</b> variable holds the value. A <b>reference</b> variable (<code>String</code>, arrays, every class) holds an arrow to an object on the <b>heap</b>, or <code>null</code>. So <code>b = a</code> copies the value of an <code>int</code> but copies the <em>arrow</em> of an array or object: both names then refer to the same object (Lecture 3).</p>
        ${codeBlock("int n = 7;              String s = \"hi\";\n\n  n                       s              heap\n+---+                   +---+          +------+\n| 7 |                   | •-+--------> | \"hi\" |\n+---+                   +---+          +------+", "out")}` },
      { id: "local", title: "Local variables", html: `
        ${codeBlock(CODE.guru99Bad)}
        <p>Java has three kinds of variables, told apart by <b>where</b> they are declared. A <b>local variable</b> is declared inside a method, constructor or block. It is created when its declaration runs and destroyed when the block ends; its <b>scope</b> runs from the declaration to the closing <code>}</code>; and it has no default value: reading it before assigning is the compile error <code>variable count might not have been initialized</code>.</p>
        ${prog("localVariables")}
        ${demo("scope", "Demo 3 · Scope of local variables", "← → keys step", "Watch <code>result</code> appear inside the <code>if</code> block and vanish when the block ends. Uncommenting the last line gives <code>error: cannot find symbol</code>.")}` },
      { id: "static", title: "Static and instance variables", html: `
        <p>A <b>static variable</b> (class variable) is declared in the class, outside every method, with <code>static</code>. There is <b>one copy per class</b>, however many objects exist (even none). It is created when the class is loaded and lives until the program ends. Use it as <code>ClassName.variable</code>. A local variable cannot be static.</p>
        ${prog("staticVariables")}
        <p>An <b>instance variable</b> (field) is declared in the class without <code>static</code>. Every object has its <b>own copy</b>, created with the object. It is reached through an object (<code>obj.field</code>), may carry an access modifier, and gets a <b>default value</b> if not initialised: 0, <code>false</code>, <code>'\\u0000'</code> or <code>null</code>.</p>
        ${prog("instanceVariables")}` },
      { id: "together", title: "All three together", html: `
        ${codeBlock(CODE.student)}
        ${prog("variableKinds")}
        ${demo("variableKinds", "Demo 4 · One count, many names", "← → keys step", "The static <code>count</code> sits in the class, not in any object. <code>temp</code> lives only in the frame of <code>describe</code>.")}
        ${predict("Why does the last <code>a.describe()</code> say “Ann is student 2”?", `<p><code>count</code> is static: one variable shared by <code>a</code> and <code>b</code>. Creating <code>b</code> raised it to 2, and <code>a</code> sees the same variable. <code>name</code> is per object.</p>`)}
        ${table(["", "local", "static", "instance"], [
          ["declared", "inside a method or block", "in the class, with <code>static</code>", "in the class, without <code>static</code>"],
          ["copies", "one per call", "one per class", "one per object"],
          ["lifetime", "until the block ends", "the whole program", "as long as the object"],
          ["default value", "none: must be assigned", "yes", "yes"],
          ["accessed as", "<code>name</code>", "<code>ClassName.name</code>", "<code>object.name</code>"]])}` },
    ],
    takeaways: ["8 primitives hold values; the rest are references.", "Integer overflow wraps silently.", "Local · static (one per class) · instance (one per object)."],
  },
  {
    slug: "3-statements", nav: "Statements", title: "Statements and Loops",
    subtitle: "Blocks, if-else, boolean operators, while and for",
    abstract: "Programs choose with if-else and repeat with while and for. Every loop needs a variable that moves towards its stopping condition.",
    tags: ["if / else", "&& || !", "short-circuit", "while", "for", "break / continue"],
    hero: "loopsMini", heroCaption: "while (term >= 0.0001): sum, term and k change every iteration.",
    sections: [
      { id: "if", title: "Blocks and if-else", html: `
        <p>Braces <code>{ }</code> group statements into a <b>block</b>. An <code>if</code> runs its block when the condition is <code>true</code>, the optional <code>else</code> block otherwise. The condition must be a <code>boolean</code>: unlike C, an <code>int</code> is not accepted.</p>
        ${prog("ifElse")}
        ${callout("pitfall", "PITFALL · SAY EXACTLY WHAT ELSE MEANS", `<p>On the slide the <code>else</code> branch prints “i is greater than 15”, but it also runs when <code>i</code> is exactly 15: the opposite of <code>i &lt; 15</code> is <code>i &gt;= 15</code>. Use <code>else if</code> when equality matters.</p>`)}
        ${callout("pitfall", "PITFALL · ALWAYS USE BRACES", `<p>Without braces only <em>one</em> statement belongs to the <code>if</code> or <code>else</code>. A second indented line looks inside the branch but runs every time.</p>`)}` },
      { id: "ops", title: "Relational and logical operators", html: `
        <p>The relational operators <code>&gt;</code>, <code>&lt;</code>, <code>==</code>, <code>&gt;=</code>, <code>&lt;=</code>, <code>!=</code> give a <code>boolean</code>. The logical operators combine booleans: <code>a &amp;&amp; b</code> (both), <code>a || b</code> (at least one), <code>!a</code> (not).</p>
        ${prog("logicalOperators")}
        <p><code>&amp;&amp;</code> and <code>||</code> <b>short-circuit</b>: the right side is evaluated only if needed. In <code>s != null &amp;&amp; s.length() &gt; 0</code>, a <code>null</code> <code>s</code> makes the left side false, so <code>s.length()</code> never runs. Data-structure code relies on this constantly: <code>while (node != null &amp;&amp; node.value &lt; key)</code>.</p>
        ${callout("pitfall", "PITFALL · = VERSUS ==", `<p><code>=</code> assigns, <code>==</code> compares. For objects such as <code>String</code>, <code>==</code> compares <em>references</em>; compare contents with <code>s.equals(t)</code>.</p>`)}` },
      { id: "while", title: "The while loop", html: `
        <p>A <code>while</code> loop runs its body as long as the condition is true; something in the body must make it false eventually. This program adds up e = 1 + 1/1! + 1/2! + … until the next term is below 0.0001:</p>
        ${prog("whileExp")}
        ${demo("loops", "Demo 5 · Step through a loop", "← → keys step", "Change the tolerance and watch how many terms are needed. Switch to the <code>for</code> loop or to <code>break</code>/<code>continue</code>.")}
        <p>The terms 1/0!, …, 1/7! are added (8 terms); the next one, 1/8! ≈ 0.0000248, fails the test.</p>
        ${callout("pitfall", "PITFALL · A LOOP THAT NEVER ENDS", `<p>Forget <code>term = term / k</code> and the condition stays true forever. Before writing a loop, name the variable that moves towards the stopping condition.</p>`)}` },
      { id: "for", title: "The for loop, break and continue", html: `
        <p><code>for (initialisation; condition; update)</code> puts the three parts of a counting loop on one line: the initialisation runs once, then while the condition holds, the body runs followed by the update.</p>
        ${prog("forHarmonic")}
        ${predict("What would the program print with <code>sum += 1 / i;</code>?", `<p><code>1 + 1/2 + 1/3 + ... + 1/100 = 1.0</code>. With two <code>int</code>s, <code>/</code> is <b>integer division</b>: <code>1 / 2</code>, <code>1 / 3</code>, … are all 0. <code>1.0 / i</code> forces <code>double</code> division.</p>`)}
        <p><code>break</code> leaves the loop at once; <code>continue</code> skips the rest of the body and goes on with the next iteration:</p>
        ${prog("breakContinue")}` },
    ],
    takeaways: ["else means “not the condition” — including equality.", "&& and || short-circuit.", "int / int drops the fraction."],
  },
  {
    slug: "4-objects", nav: "Objects", title: "Classes and Objects",
    subtitle: "Fields, constructors, methods, access modifiers and new",
    abstract: "A class is a blueprint; new builds an object from it and returns a reference. Keep fields private and change them only through methods.",
    tags: ["class / object", "constructor", "public / private", "new", "references", "this"],
    hero: "objectsMini", heroCaption: "Turtle u = t copies the reference, not the turtle.",
    sections: [
      { id: "video-3", title: "Watch: Classes, objects and exceptions", html: `
        <div class="card video" data-video="media/L02-3.mp4"></div>` },
      { id: "idea", title: "Class and object", html: `
        <p>A <b>class</b> is a blueprint: it declares the <b>fields</b> (data) and <b>methods</b> (behaviour) common to all objects of one kind. An <b>object</b> is an <b>instance</b> of a class, with its own values for the fields. A class <code>Dog</code> declares a name, a colour and a height, and methods such as <code>getName()</code>; the object <code>tommy</code> has name “Tommy”, colour green, height 17.</p>
        <p>The slides say “everything in Java is an object”. Strictly, the eight primitive types are not objects, but everything else is, and every class descends from <code>Object</code>. Of the four object-oriented ideas — <b>encapsulation</b>, inheritance, polymorphism and abstraction — this course uses the first constantly and the others hardly at all.</p>` },
      { id: "declare", title: "Declaring a class; three kinds of methods", html: `
        <p>A class contains fields and methods. Statements (assignments, loops, …) may appear only <em>inside</em> methods and constructors.</p>
        ${codeBlock(CODE.turtle)}
        <p><b>The main method</b> is called by the JVM at start-up. It is <code>static</code> (it belongs to the class, so no object is needed), and <code>args</code> holds the command-line arguments typed after the class name.</p>
        <p><b>A constructor</b> initialises a new object right after <code>new</code> has allocated it. Its name is the class name and it has no return type, not even <code>void</code> (with <code>void</code> it would be an ordinary method that <code>new</code> never calls). It is optional: a class without one gets a <b>default constructor</b> with no parameters — but only if you write no constructor at all.</p>
        <p><b>A general method</b> has a name, typed parameters, a return type (<code>void</code> for none) and a body: <code>jumpTo</code> changes the object, <code>getX</code> returns a value.</p>` },
      { id: "access", title: "Access modifiers", html: `
        ${table(["modifier", "same class", "same package", "subclass", "everywhere"], [
          ["<code>public</code>", "yes", "yes", "yes", "yes"],
          ["<code>protected</code>", "yes", "yes", "yes", "no"],
          ["none (package-private)", "yes", "yes", "no", "no"],
          ["<code>private</code>", "yes", "no", "no", "no"]])}
        <p>Note that <code>protected</code> also allows the whole package, not only subclasses (the slide's text leaves this out; its table shows it). <b>Fields should be private</b>, used by other classes only through methods: this is <b>encapsulation</b>. A linked list keeps <code>head</code> and <code>size</code> private so that no outside code can break its links.</p>
        ${codeBlock("Turtle t = new Turtle(100, 100);\nt.penDown = true;     // error: penDown has private access in Turtle")}` },
      { id: "new", title: "Creating objects and calling methods", html: `
        <p><code>new</code> allocates an object on the heap, runs the constructor and returns a reference. Methods are called with a dot.</p>
        ${prog("turtleDemo")}
        ${demo("objects", "Demo 6 · Objects, references and the heap", "← → keys step", "There is one turtle all along: <code>Turtle u = t</code> adds a second arrow to it.")}
        ${predict("After <code>Turtle u = t; u.jumpTo(5, 5);</code>, where is <code>t</code>?", `<p>At (5, 5): <code>t</code> and <code>u</code> are two names for one turtle. Only <code>new</code> creates an object.</p>`)}
        <p>The slide's <code>Person</code> example (its getter <code>getAget</code> should be <code>getAge</code>):</p>
        ${codeBlock(CODE.person)}
        ${prog("constructorDemo")}
        <p><b>Garbage collection.</b> Java has no <code>delete</code>. When nothing refers to an object any more it is <b>unreachable</b>, and the garbage collector frees it later. You never free objects by hand, which rules out freeing memory twice or using it after it was freed.</p>` },
      { id: "this", title: "The keyword this", html: `
        <p>Inside a method or constructor, <code>this</code> refers to the <b>current object</b>. Its main use is to tell a field from a parameter with the same name. (Section 9.5 of the notes.)</p>
        ${codeBlock(CODE.itemWrong)}${codeBlock(CODE.item)}
        ${prog("thisDemo")}
        ${demo("thisDemo", "Demo 7 · name = name or this.name = name?", "pick a version, then step", "The constructor's parameter <b>shadows</b> the field: a plain <code>name</code> means the parameter.")}` },
    ],
    takeaways: ["new allocates, constructs, returns a reference.", "Copying a reference never copies the object.", "Private fields + methods = encapsulation."],
  },
  {
    slug: "5-toolbox", nav: "Toolbox", title: "Exceptions, Arrays and Strings",
    subtitle: "Exceptions, packages, comments, arrays, strings, printing, casting, ArrayList",
    abstract: "When something goes wrong, Java throws an exception that you can catch. Arrays have a fixed length; ArrayList grows by copying; strings never change.",
    tags: ["try / catch / finally", "arrays", "immutable String", "casting", "ArrayList"],
    hero: "stringsMini", heroCaption: "s.concat(…) builds a new string; s itself never changes.",
    sections: [
      { id: "video-4", title: "Watch: Arrays, strings, casting and files", html: `
        <div class="card video" data-video="media/L02-4.mp4"></div>` },
      { id: "throw", title: "Throwing and catching exceptions", html: `
        <p>Division by zero, a bad index, a method called on <code>null</code>, input that is not a number: Java reports such problems by <b>throwing an exception</b>. Throwing stops the method at once; the exception travels up the call stack until a method <b>catches</b> it, or else the program stops with a stack trace. A method that may throw a <b>checked</b> exception such as <code>IOException</code> must declare it with <code>throws</code>. The slide's <code>getNatural</code> reads the keyboard; this version parses a <code>String</code>:</p>
        ${codeBlock(CODE.natural)}
        <p>The <code>try</code> block runs normally; if a statement in it throws, the rest of the <code>try</code> block is skipped and the matching <code>catch</code> block runs. <code>finally</code> runs in every case.</p>
        ${prog("catchDemo")}
        ${demo("catchDemo", "Demo 8 · Where does control go?", "edit the inputs, then step", "Try <code>7</code>, <code>12a</code> or an empty input. For a bad input, <code>m = n * 2</code> never runs.")}
        <p>Most exceptions in this course are <b>unchecked</b> ones thrown by Java itself:</p>
        ${prog("commonExceptions")}
        ${codeBlock(CODE.uncaught)}
        ${out("uncaught")}
        <p>The JVM then prints, on the error stream, the exception and the line where it happened:</p>
        ${codeBlock('Exception in thread "main" java.lang.ArrayIndexOutOfBoundsException: Index 3 out of bounds for length 3', "out")}
        ${callout("pitfall", "PITFALL · DON'T SWALLOW EXCEPTIONS", `<p>An empty <code>catch (Exception e) { }</code> hides the error and the program carries on with wrong data. At least print it, and catch only what you can handle.</p>`)}` },
      { id: "packages", title: "Packages, import and comments", html: `
        <p>A <b>package</b> is a named group of classes stored in a folder of the same name. Packages organise programs, make classes easy to find and reuse, and avoid name clashes (<code>java.util.List</code> vs <code>java.awt.List</code>). <code>java.lang</code> (<code>String</code>, <code>Math</code>, <code>System</code>) is imported automatically.</p>
        ${codeBlock("package csc3100.lists;        // this file's classes belong to csc3100.lists\n\nimport java.util.ArrayList;   // one class from another package\nimport java.util.*;           // every class of java.util (not its sub-packages)")}
        ${codeBlock("// a single-line comment\n\n/* a block comment\n   over several lines */\n\n/**\n * A documentation comment (Javadoc).\n * @param n the number of elements\n * @return the sum of the first n elements\n */")}
        <p>Comment <em>why</em>, not what: <code>// skip the sentinel node</code> helps; <code>// i is greater than 5</code> above <code>if (i &gt; 5)</code> does not.</p>` },
      { id: "arrays", title: "Arrays", html: `
        <p>An <b>array</b> is a fixed number of elements of one type, numbered from 0 to <code>length − 1</code>.</p>
        ${prog("arrayBasics")}
        <p><code>array.length</code> is a field (no parentheses; a <code>String</code> has the method <code>length()</code>). New arrays hold default values. An array of objects holds <em>references</em>: <code>new Turtle[100]</code> makes 100 empty slots, not 100 turtles.</p>
        ${predict("What is the maximum size of a Java array?", `<p>Indices and <code>length</code> are <code>int</code>, so at most <code>Integer.MAX_VALUE</code> = 2 147 483 647 elements (most JVMs allow a few fewer). Memory runs out sooner: such an <code>int[]</code> needs 8 GB. To grow beyond an array, allocate a bigger one and copy — what <code>ArrayList</code> does.</p>`)}
        <p>The slides also show a complete file program: read pairs of numbers, write their sums. It is in Chapter 7 (<a href="#/7-files/textfile">§7.1</a>).</p>` },
      { id: "strings", title: "Strings and printing", html: `
        <p>A <code>String</code> is an object holding a sequence of characters, with special support for literals and <code>+</code>. <b>Strings are immutable</b>: <code>concat</code>, <code>toUpperCase</code>, <code>replace</code> return a <em>new</em> string.</p>
        ${prog("stringDemo")}
        ${demo("strings", "Demo 9 · Strings never change", "← → keys step", "Dashed objects are unreachable: nobody refers to them, and the garbage collector will free them.")}
        ${callout("pitfall", "PITFALL", `<p><code>s.concat(…);</code> or <code>s.toUpperCase();</code> on its own line does nothing useful: write <code>s = s.toUpperCase();</code>. And never compare strings with <code>==</code>.</p>`)}
        <p><code>print</code> stays on the line, <code>println</code> ends it, <code>printf</code> formats:</p>
        ${prog("printDemo")}` },
      { id: "casting", title: "Type conversion (casting)", html: `
        <p>Widening (<code>byte → short → int → long → float → double</code>, and <code>char → int</code>) is automatic. Narrowing can lose information and needs a <b>cast</b>:</p>
        ${codeBlock("degrees = radians * 180 / 3.141592653;            // error: incompatible types:\n                                                  //   possible lossy conversion from double to int\ndegrees = (int) (radians * 180 / 3.141592653);    // OK: explicit cast")}
        ${prog("casting")}
        ${demo("casting", "Demo 10 · Casting lab", "type a number", "<code>(int)</code> truncates towards zero; <code>Math.round</code> rounds; <code>(byte)</code> keeps 8 bits.")}` },
      { id: "arraylist", title: "ArrayList", html: `
        <p><code>java.util.ArrayList</code> is a <b>resizable array</b>.</p>
        ${prog("arrayListDemo")}
        <p>Inside, it keeps the elements in an ordinary array whose length is the <b>capacity</b>; <code>size()</code> is how many are in use. When <code>add</code> finds the array full, it allocates one about 1.5 times as long and copies everything over. Copying is rare enough that adding at the end is still fast on average (Lecture 7 builds this).</p>
        ${demo("arrayList", "Demo 11 · Inside an ArrayList", "add and remove", "Press add × 5 a few times and watch the capacity go 10 → 15 → 22 → 33. Removing never shrinks it.")}
        ${callout("note", "NOTE · TWO CORRECTIONS TO THE SLIDE", `<p>Removing elements does <b>not</b> shrink the internal array (call <code>trimToSize()</code> for that). The spare capacity, and storing <code>Integer</code> objects instead of plain numbers, is why an <code>ArrayList</code> uses more memory than an array.</p>`)}
        ${callout("pitfall", "PITFALL · remove(1)", `<p>On an <code>ArrayList&lt;Integer&gt;</code>, <code>list.remove(1)</code> removes the element at <em>index</em> 1. To remove the value 1, write <code>list.remove(Integer.valueOf(1))</code>.</p>`)}` },
    ],
    takeaways: ["throw stops; catch handles; finally always runs.", "Arrays are fixed; ArrayList grows by copying.", "Strings are immutable — compare with equals."],
  },
  {
    slug: "6-examples", nav: "Examples", title: "Worked Examples",
    subtitle: "Fibonacci, GCD, primes, palindromes, characters and strings",
    abstract: "Small programs that use only loops, conditions, methods and strings — and a first look at how much faster a better algorithm can be.",
    tags: ["Fibonacci", "Euclid's GCD", "primes", "palindromes", "charAt", "rotation"],
    hero: "gcdMini", heroCaption: "gcdByEuclid(1071, 462): four calls.",
    sections: [
      { id: "fib", title: "Fibonacci numbers", html: `
        <p>Each Fibonacci number is the sum of the two before it: 0, 1, 1, 2, 3, 5, 8, 13, … A loop keeps the last two in <code>n1</code> and <code>n2</code> and shifts them along:</p>
        ${prog("fibonacciLoop")}
        <p>The slide's second version uses <b>recursion</b> (Lecture 6), keeping <code>n1</code>, <code>n2</code>, <code>n3</code> in static variables:</p>
        ${prog("fibonacciRecursive")}
        <p>The static variables make it hard to reuse: a second call continues where the first one stopped. Passing the last two numbers as parameters is cleaner (Exercise 3).</p>` },
      { id: "gcd", title: "Greatest common divisor", html: `
        <p>gcd(a, b) is the largest integer dividing both: gcd(15, 20) = 5, gcd(7, 5) = 1. <b>Brute force</b> tries every candidate up to the smaller number. (The slide's text counts down, its code counts up; both are correct.) <b>Euclid</b>: a common divisor of a and b also divides a − b, so repeated subtraction — that is, the remainder — keeps the gcd: gcd(a, b) = gcd(b, a mod b), and gcd(a, 0) = a.</p>
        ${prog("gcd")}
        ${demo("gcd", "Demo 12 · Euclid's algorithm", "change a and b, then step", "Try two consecutive Fibonacci numbers such as 832040 and 514229: the slowest case for Euclid, and still only about 30 calls.")}
        <p>Brute force runs min(a, b) times; Euclid needs at most about 2 log₂ min(a, b) calls, because the remainder at least halves every two steps. Lecture 5 gives us the words for this: O(n) versus O(log n).</p>` },
      { id: "prime", title: "Primes and palindromes", html: `
        <p>A <b>prime</b> is an integer greater than 1 whose only divisors are 1 and itself. Try 2, 3, …, n/2; the first divisor found settles it.</p>
        ${prog("primeCheck")}
        ${callout("note", "NOTE · STOP AT √n", `<p>If n = a · b with a ≤ b, then a ≤ √n, so testing while <code>i * i &lt;= n</code> is enough: about 1 000 tries for n = 1 000 003 instead of 500 000.</p>`)}
        <p>A <b>palindrome number</b> reads the same backwards. <code>n % 10</code> is the last digit, <code>n / 10</code> drops it:</p>
        ${prog("palindromeNumber")}
        ${demo("numberLoops", "Demo 13 · Digit and divisor loops", "pick a method and n, then step", "For <code>isPrime</code>, try a large prime such as 9973 and count the divisions.")}
        <p>The second version reads a line with a <code>Scanner</code> (here the input is <code>level</code>) and reverses it as a string:</p>
        ${prog("palindromeString")}` },
      { id: "objects", title: "Creating objects; object vs class", html: `
        ${prog("createObject")}
        <p><code>show</code> is not static, so the static <code>main</code> needs an object to call it on. Other, rare ways to create objects: <code>clone()</code>, the reflection methods <code>Class.newInstance()</code> (deprecated) and <code>Constructor.newInstance()</code>, and <b>deserialisation</b>. In this course, <code>new</code> is all you need.</p>
        ${callout("note", "NOTE · A SLIDE CLAIM", `<p>The slide says no Java program can run without creating an object. <code>Welcome</code> in Chapter 1 never creates an instance of its class: <code>main</code> is static.</p>`)}
        ${table(["object", "class"], [
          ["an instance of a class", "a blueprint for objects"],
          ["created with <code>new</code>, as often as needed", "declared once, with <code>class</code>"],
          ["has its own field values and occupies heap memory", "describes fields and methods; holds no field values (except static ones)"],
          ["<code>new Student(\"Ann\")</code>", "<code>class Student { … }</code>"]])}` },
      { id: "chars", title: "Character codes and string scans", html: `
        <p><b>ASCII</b> numbers 128 characters 0–127: <code>'A'</code> is 65, <code>'a'</code> 97, <code>'0'</code> 48. Java's <code>char</code> is UTF-16, whose first 128 codes are ASCII. Assigning a <code>char</code> to an <code>int</code> widens it; <code>(int) ch</code> is an explicit cast. (The slide's “type-casting” example, <code>int ch1 = 'a';</code>, is again just an assignment.)</p>
        ${prog("asciiValues")}
        <p>To look at every character, run an index from 0 to <code>length() - 1</code> and use <code>charAt(i)</code>:</p>
        ${prog("countCharacters")}
        ${prog("countPunctuation")}
        <p>Strings are immutable, so to change characters we copy into a <code>StringBuilder</code> (the slide's <code>StringBuffer</code> works the same) and use <code>setCharAt</code>:</p>
        ${prog("changeCase")}
        ${demo("scan", "Demo 14 · Scanning a string with charAt", "pick a task, edit the text, then step", "The three programs share one loop; only the test on each character differs.")}` },
      { id: "rotation", title: "Is one string a rotation of another?", html: `
        <p>A <b>rotation</b> of <code>"abcde"</code> moves characters from the front to the back (<code>"deabc"</code>). Every rotation of s appears inside s + s, so: lengths must match, then search the doubled string.</p>
        ${prog("stringRotation")}
        ${demo("rotation", "Demo 15 · Rotation by doubling", "edit the two strings")}
        ${predict("Why is the length test needed? Try <code>\"abcde\"</code> and <code>\"bcd\"</code>.", `<p><code>"abcdeabcde"</code> contains <code>"bcd"</code>, so without the length check the answer would wrongly be <code>true</code>. A rotation uses every character exactly once.</p>`)}` },
    ],
    takeaways: ["Euclid: gcd(a, b) = gcd(b, a mod b).", "n % 10 and n / 10 peel off digits.", "charAt(i) for i from 0 to length() − 1."],
  },
  {
    slug: "7-files", nav: "Files", title: "Files and Input/Output",
    subtitle: "File, byte streams, character streams, buffered lines",
    abstract: "A File names a path. Streams read and write data from start to end: bytes for binary data, characters for text, lines with a BufferedReader.",
    tags: ["File", "FileInputStream", "FileReader", "BufferedReader", "−1 / null", "try-with-resources"],
    hero: "fileReadMini", heroCaption: "read() returns one byte at a time, then −1.",
    sections: [
      { id: "textfile", title: "Reading and writing a text file", html: `
        <p>The slides' complete example reads pairs of numbers and writes their sums. This version creates its input in a temporary folder so it runs anywhere:</p>
        ${prog("sumPairs")}
        <ul><li><code>readLine()</code> returns one line without its line break, or <code>null</code> at the end of the file.</li>
        <li><code>line.split(" ")</code> cuts at spaces; <code>Integer.parseInt</code> converts text to <code>int</code> (or throws <code>NumberFormatException</code>).</li>
        <li>A <code>BufferedWriter</code> collects output in memory; <code>close()</code> or <code>flush()</code> writes it. Forgetting it is the usual cause of an empty output file.</li></ul>` },
      { id: "file", title: "The File class", html: `
        <p>A <code>java.io.File</code> is an <b>abstract pathname</b>, which may or may not exist; creating the object creates nothing on disk. A path is <b>absolute</b> (from the root) or <b>relative</b> (to the folder the program runs in).</p>
        ${table(["method", "does"], [
          ["<code>createNewFile()</code>", "creates an empty file if none exists; <code>true</code> if it did"],
          ["<code>exists()</code>, <code>isFile()</code>, <code>isDirectory()</code>", "test what is on disk"],
          ["<code>getName()</code>, <code>getParent()</code>, <code>getAbsolutePath()</code>", "parts of the path"],
          ["<code>length()</code>", "size in bytes"],
          ["<code>canRead()</code>, <code>canWrite()</code>, <code>isHidden()</code>", "permissions and attributes"],
          ["<code>mkdir()</code>, <code>delete()</code>, <code>renameTo(f)</code>", "make a folder, delete, rename"],
          ["<code>list()</code>, <code>listFiles()</code>", "names, or File objects, in a folder"]])}
        ${prog("fileCreate")}
        <p><code>createNewFile</code> throws the checked <code>IOException</code>, so it needs <code>try</code>/<code>catch</code> or <code>throws</code>.</p>
        ${prog("fileList")}
        <p>The order of <code>list()</code>/<code>listFiles()</code> is not specified, so sort when order matters. In the slide's version, <code>"Is Hidden: "</code> lacks a leading space, so the real output would read <code>…trueIs Hidden: …</code>.</p>` },
      { id: "bytes", title: "Byte streams", html: `
        <p><code>FileOutputStream</code> writes raw <b>bytes</b> (<code>write(int b)</code>, <code>write(byte[] b)</code>) and <code>FileInputStream</code> reads them: <code>read()</code> returns the next byte as an <code>int</code> 0…255, or <b>−1</b> at the end of the file.</p>
        ${prog("byteStreams")}
        ${demo("fileRead", "Demo 16 · Reading a file byte by byte", "edit the contents, then step", "Type a non-ASCII character such as é: it takes two bytes in UTF-8, and casting each byte to <code>char</code> gives the wrong letters.")}
        <p><code>read()</code> returns an <code>int</code> rather than a <code>byte</code> so that −1 can mean “no more data” without clashing with a real byte.</p>` },
      { id: "chars", title: "Character streams", html: `
        <p>For text, use <code>FileWriter</code> (writes strings directly) and <code>FileReader</code>, whose <code>read()</code> returns the next <em>character</em> (0…65 535) or −1. (The slide says <code>FileReader</code> returns bytes; it returns characters decoded from the bytes.) Wrap it in a <code>BufferedReader</code> to read lines.</p>
        ${prog("charStreams")}
        <p><b>Try-with-resources</b> (<code>try (FileWriter w = …) { … }</code>) closes the stream automatically, even when an exception is thrown. Prefer it to calling <code>close()</code> by hand.</p>
        ${table(["", "bytes (binary data)", "characters (text)"], [
          ["read", "<code>FileInputStream</code>", "<code>FileReader</code>, <code>BufferedReader</code> (lines)"],
          ["write", "<code>FileOutputStream</code>", "<code>FileWriter</code>, <code>BufferedWriter</code>"],
          ["one unit", "<code>read()</code> → 0…255, −1 at end", "<code>read()</code> → 0…65 535, −1 at end"]])}` },
    ],
    takeaways: ["File names a path; it creates nothing.", "Read until −1 (or null for lines).", "Close what you open: try-with-resources."],
  },
  {
    slug: "8-summary", nav: "Summary", title: "Summary and Practice",
    subtitle: "Check yourself, then write some Java",
    abstract: "A one-page map of the lecture, eight self-check questions and seven exercises with solutions.",
    tags: ["knowledge map", "self-check", "exercises"],
    hero: "toc",
    sections: [
      { id: "map", title: "Knowledge map", html: `<div class="map">
        <div class="card"><h3>Toolchain</h3><ul><li>JDK ⊃ JRE ⊃ JVM</li><li><code>javac</code> → bytecode → <code>java</code></li><li>compile-time vs run-time errors</li><li>case-sensitive keywords</li></ul></div>
        <div class="card"><h3>Types</h3><ul><li>8 primitives hold values</li><li>references point to heap objects</li><li>overflow wraps; <code>int / int</code> truncates</li><li>narrowing needs a cast</li></ul></div>
        <div class="card"><h3>Variables</h3><ul><li><b>local</b>: block scope, no default</li><li><b>static</b>: one per class</li><li><b>instance</b>: one per object</li></ul></div>
        <div class="card"><h3>Statements</h3><ul><li><code>if</code> / <code>else if</code> / <code>else</code></li><li><code>&amp;&amp;</code>, <code>||</code> short-circuit</li><li><code>while</code>, <code>for</code>, <code>break</code>, <code>continue</code></li></ul></div>
        <div class="card"><h3>Classes</h3><ul><li>fields + constructor + methods</li><li><code>new</code> returns a reference</li><li>private fields, public methods</li><li><code>this</code> = current object; GC frees</li></ul></div>
        <div class="card"><h3>Library</h3><ul><li><code>try</code>/<code>catch</code>/<code>finally</code>, <code>throw</code>/<code>throws</code></li><li>arrays fixed; <code>ArrayList</code> grows by copying</li><li>immutable <code>String</code>, <code>equals</code></li><li>streams: read until −1 / <code>null</code></li></ul></div></div>` },
      { id: "check", title: "Check your understanding", html: `<div data-demo="quiz"><div class="demo-body"></div></div>` },
      { id: "exercises", title: "Exercises", html: `
        <p>★ trace or fix · ★★ write · ★★★ extend.</p>
        <h3>Exercise 1 ★ (fix the program)</h3>
        <p>This program has four errors. Find them without a compiler.</p>
        ${codeBlock("Public class Average {\n    public static void main(String[] args) {\n        int[] marks = {70, 85, 90};\n        int sum;\n        for (int i = 0; i <= marks.length; i++) {\n            sum += marks[i];\n        }\n        System.out.println(\"average = \" + sum / marks.length);\n    }\n}")}
        <details class="reveal"><summary>Solution</summary><p>(1) <code>Public</code> → <code>public</code>. (2) <code>sum</code> is read before it is assigned: <code>int sum = 0;</code>. (3) <code>i &lt;= marks.length</code> reads <code>marks[3]</code> and throws: use <code>&lt;</code>. (4) <code>sum / marks.length</code> is integer division: write <code>(double) sum / marks.length</code>.</p>${prog("average")}</details>
        <h3>Exercise 2 ★ (predict)</h3>
        <p>What does this program print?</p>
        ${codeBlock(CODE.exercise2)}
        <details class="reveal"><summary>Solution</summary>${out("exercise2")}<p>Two objects are created (<code>c = a</code> creates none), so <code>calls</code> is 2 and <code>b.id</code> is 2. <code>c</code> and <code>a</code> are the same object, so <code>c.id = 10</code> changes <code>a.id</code>. <code>s.toUpperCase()</code> is thrown away. <code>7 / 2</code> is 3 and <code>'A' + 3</code> is 68 = <code>'D'</code>.</p></details>
        <h3>Exercise 3 ★★ (Fibonacci without static variables)</h3>
        <p>Write a recursive <code>printFibonacci(int a, int b, int count)</code> that prints <code>count</code> more Fibonacci numbers after <code>a</code> and <code>b</code>, and <code>fibonacci(int n)</code> that returns the n-th number with a loop, using <code>long</code>.</p>
        <details class="reveal"><summary>Solution</summary>${prog("exercise3")}<p>fibonacci(50) = 12 586 269 025 exceeds <code>Integer.MAX_VALUE</code>, hence <code>long</code>.</p></details>
        <h3>Exercise 4 ★★ (a class)</h3>
        <p>Write <code>BankAccount</code> with a private <code>double balance</code>, a constructor, <code>deposit</code>, <code>withdraw</code> and <code>getBalance</code>. <code>withdraw</code> throws <code>IllegalArgumentException</code> if the amount exceeds the balance. Test a withdrawal that fails.</p>
        <details class="reveal"><summary>Solution</summary>${codeBlock(CODE.bankAccount)}${prog("bankTest")}<p>Because <code>balance</code> is private, only <code>deposit</code> and <code>withdraw</code> can change it, and <code>withdraw</code> never makes it negative: that guarantee is what encapsulation buys.</p></details>
        <h3>Exercise 5 ★★ (strings)</h3>
        <p>Write <code>countVowels(String s)</code> (a, e, i, o, u in either case) and <code>reverseWords(String s)</code>: <code>"data structures are fun"</code> → <code>"fun are structures data"</code>.</p>
        <details class="reveal"><summary>Solution</summary>${prog("exercise5")}</details>
        <h3>Exercise 6 ★★ (faster prime test)</h3>
        <p>Rewrite <code>isPrime</code> to try only divisors with <code>i * i &lt;= n</code>, and count the primes below 100.</p>
        <details class="reveal"><summary>Solution</summary>${prog("exercise6")}<p>Write <code>i &lt;= n / i</code> instead if n can be near <code>Integer.MAX_VALUE</code>, where <code>i * i</code> could overflow.</p></details>
        <h3>Exercise 7 ★★★ (word count from a file)</h3>
        <p>Write three lines to a temporary file, read them back with a <code>BufferedReader</code>, and print the number of lines, words and characters (not counting line breaks).</p>
        <details class="reveal"><summary>Solution</summary>${prog("wordCount")}</details>` },
      { id: "terms", title: "Key terms and further reading", html: `
        <p class="tags">${["JDK", "JRE", "JVM", "bytecode", "javac", "compile-time error", "run-time error", "keyword", "identifier", "primitive type", "reference type", "two's complement", "overflow", "integer division", "cast", "local variable", "static variable", "instance variable", "scope", "default value", "short-circuit", "class", "object", "field", "method", "constructor", "access modifier", "encapsulation", "new", "this", "shadowing", "heap", "garbage collection", "exception", "checked / unchecked", "try / catch / finally", "package", "import", "Javadoc", "array", "ArrayList", "capacity", "immutable String", "StringBuilder", "stream", "try-with-resources"].map((t) => `<span class="tag">${t}</span>`).join("")}</p>
        <ul><li>Oracle, <em>The Java Tutorials</em>: “Learning the Java Language” and “Basic I/O”. <a href="https://docs.oracle.com/javase/tutorial/" target="_blank" rel="noopener">docs.oracle.com/javase/tutorial</a></li>
        <li>C. S. Horstmann, <em>Core Java, Volume I</em>, chapters 3, 4 and 7.</li>
        <li>M. A. Weiss, <em>Data Structures and Algorithm Analysis in Java</em>, chapter 1.</li>
        <li>B. Eckel, <em>Thinking in Java</em> (recommended in the slides).</li></ul>` },
    ],
    takeaways: ["Compile, then run on the JVM.", "Values vs references; static vs instance.", "Private fields, exceptions, close your streams."],
  },
];

const QUIZ = [
  { q: "Which part of Java is <b>not</b> the same on Windows and on macOS?",
    opts: ["the <code>.java</code> source file", "the <code>.class</code> bytecode file", "the JVM", "the Java language"],
    a: 2, why: "Bytecode is portable; each operating system has its own JVM that runs it. “Java is platform-independent, but the JVM is not.”" },
  { q: "What does this print?", code: `int i = Integer.MAX_VALUE;
i = i + 1;
System.out.println(i + " " + (7 / 2) + " " + (int) -2.7);`,
    opts: ["<code>2147483648 3.5 -3</code>", "<code>-2147483648 3 -2</code>", "an error: overflow", "<code>-2147483648 3 -3</code>"],
    a: 1, why: "Overflow wraps silently to <code>Integer.MIN_VALUE</code>; <code>7 / 2</code> is integer division, 3; <code>(int)</code> truncates towards zero, −2." },
  { q: "A class has <code>static int count;</code> and <code>int id;</code>. After creating 5 objects, how many <code>count</code> and how many <code>id</code> variables exist?",
    opts: ["1 and 1", "5 and 5", "1 and 5", "5 and 1"],
    a: 2, why: "A static variable has one copy per class; an instance variable one copy per object." },
  { q: "Which statement about a local variable is true?",
    opts: ["It is 0 if you do not initialise it", "It can be used after its block ends", "It must be assigned before it is read, or the program does not compile", "It can be declared <code>static</code>"],
    a: 2, why: "Local variables have no default value, die at the end of their block, and cannot be static. Fields get default values." },
  { q: "After <code>Turtle u = t; u.jumpTo(5, 5);</code>, what is <code>t.getX()</code>?",
    opts: ["Whatever it was before", "5", "0", "It does not compile"],
    a: 1, why: "<code>u = t</code> copies the reference: <code>t</code> and <code>u</code> refer to the same Turtle." },
  { q: "In a constructor <code>Item(String name) { name = name; }</code>, what happens to the field <code>name</code>?",
    opts: ["It is set to the parameter", "Nothing: it keeps its default value <code>null</code>", "Compile error", "It is set to <code>\"name\"</code>"],
    a: 1, why: "The parameter shadows the field, so the parameter is assigned to itself. Write <code>this.name = name;</code>." },
  { q: "What does this print?", code: `String s = "data";
s.toUpperCase();
s.concat("!");
System.out.println(s);`,
    opts: ["<code>DATA!</code>", "<code>DATA</code>", "<code>data</code>", "<code>data!</code>"],
    a: 2, why: "Strings are immutable. Both calls return new strings that are thrown away; <code>s</code> still refers to <code>\"data\"</code>." },
  { q: "An <code>ArrayList</code> has capacity 10 and 10 elements. What happens on <code>add(x)</code>?",
    opts: ["An exception is thrown", "A larger array (capacity 15) is created and all 10 elements are copied into it", "The new element is linked after the last one", "The oldest element is overwritten"],
    a: 1, why: "The internal array is full, so a new one about 1.5 times larger is allocated and the elements copied. Removing elements later does not shrink it." },
];
