// Interactive demos for Lecture 9. CODE and OUT are copied verbatim from
// notes/L09-stacks.md (checked by tools/check.py); the JS twins below replay the Java.

const CODE = {
  callStack: "public class CallStackDemo {\n    public static void main(String[] args) {\n        StringBuilder sb = new StringBuilder(\"Hello \");\n        System.out.println(\"before change, sb is \" + sb);\n        change(sb);\n        System.out.println(\"after change, sb is \" + sb);\n    }\n\n    public static void change(StringBuilder text) {\n        text = new StringBuilder(\"Hi \");\n        text.append(\"world !\");\n    }\n}",
  linkedPush: "public void push(E x) {\n    Node<E> tmpNode = new Node<>();\n    tmpNode.element = x;\n    tmpNode.next = head.next;    // the new node points to the old top\n    head.next = tmpNode;         // the header points to the new node\n    size++;\n}",
  linkedPopTop: "public E pop() {\n    if (isEmpty()) {\n        return null;                 // underflow\n    }\n    Node<E> firstNode = head.next;\n    head.next = firstNode.next;      // unlink the top node\n    size--;\n    return firstNode.element;\n}\n\npublic E top() {\n    if (isEmpty()) {\n        return null;\n    }\n    return head.next.element;\n}",
  linkedOps: "public void push(E x) {\n    Node<E> tmpNode = new Node<>();\n    tmpNode.element = x;\n    tmpNode.next = head.next;    // the new node points to the old top\n    head.next = tmpNode;         // the header points to the new node\n    size++;\n}\n\npublic E pop() {\n    if (isEmpty()) {\n        return null;                 // underflow\n    }\n    Node<E> firstNode = head.next;\n    head.next = firstNode.next;      // unlink the top node\n    size--;\n    return firstNode.element;\n}\n\npublic E top() {\n    if (isEmpty()) {\n        return null;\n    }\n    return head.next.element;\n}",
  linkedClass: "public class LinkedStack<E> {\n    private static class Node<E> {\n        E element;\n        Node<E> next;\n    }\n\n    private final Node<E> head = new Node<>();   // header node; head.next is the top\n    private int size = 0;\n\n    public boolean isEmpty() {\n        return head.next == null;\n    }\n\n    public int size() {\n        return size;\n    }\n\n    public void makeEmpty() {\n        head.next = null;\n        size = 0;\n    }\n\n    public void push(E x) {\n        Node<E> tmpNode = new Node<>();\n        tmpNode.element = x;\n        tmpNode.next = head.next;    // the new node points to the old top\n        head.next = tmpNode;         // the header points to the new node\n        size++;\n    }\n\n    public E pop() {\n        if (isEmpty()) {\n            return null;                 // underflow\n        }\n        Node<E> firstNode = head.next;\n        head.next = firstNode.next;      // unlink the top node\n        size--;\n        return firstNode.element;\n    }\n\n    public E top() {\n        if (isEmpty()) {\n            return null;\n        }\n        return head.next.element;\n    }\n\n    @Override\n    public String toString() {           // top first\n        StringBuilder sb = new StringBuilder(\"[\");\n        for (Node<E> p = head.next; p != null; p = p.next) {\n            sb.append(p.element);\n            if (p.next != null) {\n                sb.append(\", \");\n            }\n        }\n        return sb.append(\"]\").toString();\n    }\n}",
  linkedDemo: "public class LinkedStackDemo {\n    public static void main(String[] args) {\n        LinkedStack<Integer> s = new LinkedStack<>();\n        s.push(11);\n        s.push(22);\n        s.push(33);\n        System.out.println(\"after 3 pushes: \" + s + \", size \" + s.size());\n        System.out.println(\"top()  = \" + s.top());\n        System.out.println(\"pop()  = \" + s.pop());\n        System.out.println(\"pop()  = \" + s.pop());\n        System.out.println(\"now:      \" + s + \", size \" + s.size());\n        System.out.println(\"pop()  = \" + s.pop());\n        System.out.println(\"pop()  = \" + s.pop() + \"   (underflow)\");\n        System.out.println(\"isEmpty() = \" + s.isEmpty());\n    }\n}",
  arrayHead: "public class ArrayStack<E> {\n    static final int MIN_STACK_SIZE = 5;\n    private int topOfStack = -1;         // index of the top element; -1 when empty\n    private E[] array;\n\n    @SuppressWarnings(\"unchecked\")\n    public ArrayStack(int maxElements) {\n        int capacity = maxElements;\n        if (maxElements < MIN_STACK_SIZE) {\n            capacity = MIN_STACK_SIZE;\n        }\n        array = (E[]) new Object[capacity];\n    }\n\n    public boolean isFull() {\n        return topOfStack == array.length - 1;\n    }\n    ...\n}",
  arrayOps: "public boolean push(E x) {\n    if (isFull()) {\n        return false;                    // overflow: nothing is stored\n    }\n    array[++topOfStack] = x;             // move up one cell, then store\n    return true;\n}\n\npublic E pop() {\n    if (isEmpty()) {\n        return null;                     // underflow\n    }\n    E x = array[topOfStack];\n    array[topOfStack--] = null;          // clear the cell, then move down\n    return x;\n}\n\npublic E top() {\n    if (isEmpty()) {\n        return null;\n    }\n    return array[topOfStack];\n}",
  arrayClass: "public class ArrayStack<E> {\n    static final int MIN_STACK_SIZE = 5;\n    private int topOfStack = -1;         // index of the top element; -1 when empty\n    private E[] array;\n\n    @SuppressWarnings(\"unchecked\")\n    public ArrayStack(int maxElements) {\n        int capacity = maxElements;\n        if (maxElements < MIN_STACK_SIZE) {\n            capacity = MIN_STACK_SIZE;\n        }\n        array = (E[]) new Object[capacity];\n    }\n\n    public boolean isEmpty() {\n        return topOfStack == -1;\n    }\n\n    public boolean isFull() {\n        return topOfStack == array.length - 1;\n    }\n\n    public int size() {\n        return topOfStack + 1;\n    }\n\n    public int capacity() {\n        return array.length;\n    }\n\n    public void makeEmpty() {\n        while (topOfStack >= 0) {\n            array[topOfStack--] = null;\n        }\n    }\n\n    public boolean push(E x) {\n        if (isFull()) {\n            return false;                    // overflow: nothing is stored\n        }\n        array[++topOfStack] = x;             // move up one cell, then store\n        return true;\n    }\n\n    public E pop() {\n        if (isEmpty()) {\n            return null;                     // underflow\n        }\n        E x = array[topOfStack];\n        array[topOfStack--] = null;          // clear the cell, then move down\n        return x;\n    }\n\n    public E top() {\n        if (isEmpty()) {\n            return null;\n        }\n        return array[topOfStack];\n    }\n\n    @Override\n    public String toString() {               // bottom first, like the array\n        StringBuilder sb = new StringBuilder(\"[\");\n        for (int i = 0; i <= topOfStack; i++) {\n            sb.append(array[i]);\n            if (i < topOfStack) {\n                sb.append(\", \");\n            }\n        }\n        return sb.append(\"]\").toString();\n    }\n}",
  arrayDemo: "public class ArrayStackDemo {\n    public static void main(String[] args) {\n        ArrayStack<Integer> s = new ArrayStack<>(2);     // raised to MIN_STACK_SIZE\n        System.out.println(\"capacity \" + s.capacity());\n        for (int x = 1; x <= 6; x++) {\n            boolean ok = s.push(x);\n            System.out.println(\"push(\" + x + \") -> \" + ok + \"   \" + s + \", size \" + s.size());\n        }\n        System.out.println(\"top() = \" + s.top());\n        System.out.println(\"pop() = \" + s.pop() + \"   \" + s);\n        System.out.println(\"pop() = \" + s.pop() + \"   \" + s);\n        s.makeEmpty();\n        System.out.println(\"after makeEmpty: \" + s + \", pop() = \" + s.pop());\n    }\n}",
  growing: "public class GrowingArrayStack<E> {\n    static final int MIN_STACK_SIZE = 4;\n    private int topOfStack = -1;\n    private E[] array;\n\n    @SuppressWarnings(\"unchecked\")\n    public GrowingArrayStack() {\n        array = (E[]) new Object[MIN_STACK_SIZE];\n    }\n\n    @SuppressWarnings(\"unchecked\")\n    private void resize(int newCapacity) {\n        E[] bigger = (E[]) new Object[newCapacity];\n        for (int i = 0; i <= topOfStack; i++) {\n            bigger[i] = array[i];\n        }\n        array = bigger;\n    }\n\n    public void push(E x) {\n        if (topOfStack == array.length - 1) {\n            resize(2 * array.length);            // full: double the capacity\n        }\n        array[++topOfStack] = x;\n    }\n\n    public E pop() {\n        if (topOfStack == -1) {\n            return null;\n        }\n        E x = array[topOfStack];\n        array[topOfStack--] = null;\n        int size = topOfStack + 1;\n        if (array.length > MIN_STACK_SIZE && size == array.length / 4) {\n            resize(array.length / 2);            // a quarter full: halve it\n        }\n        return x;\n    }\n\n    public int size() {\n        return topOfStack + 1;\n    }\n\n    public int capacity() {\n        return array.length;\n    }\n}",
  growingOps: "public void push(E x) {\n    if (topOfStack == array.length - 1) {\n        resize(2 * array.length);            // full: double the capacity\n    }\n    array[++topOfStack] = x;\n}\n\npublic E pop() {\n    if (topOfStack == -1) {\n        return null;\n    }\n    E x = array[topOfStack];\n    array[topOfStack--] = null;\n    int size = topOfStack + 1;\n    if (array.length > MIN_STACK_SIZE && size == array.length / 4) {\n        resize(array.length / 2);            // a quarter full: halve it\n    }\n    return x;\n}",
  growingDemo: "public class GrowingDemo {\n    public static void main(String[] args) {\n        GrowingArrayStack<Integer> s = new GrowingArrayStack<>();\n        int copies = 0;\n        for (int x = 1; x <= 17; x++) {\n            int before = s.capacity();\n            s.push(x);\n            if (s.capacity() != before) {\n                copies += before;\n                System.out.println(\"push(\" + x + \"): capacity \" + before + \" -> \" + s.capacity()\n                        + \", copied \" + before + \" elements\");\n            }\n        }\n        System.out.println(\"17 pushes, \" + copies + \" element copies in total\");\n        while (s.size() > 0) {\n            int before = s.capacity();\n            int x = s.pop();\n            if (s.capacity() != before) {\n                System.out.println(\"pop() = \" + x + \": size \" + s.size() + \", capacity \"\n                        + before + \" -> \" + s.capacity());\n            }\n        }\n    }\n}",
  library: "import java.util.ArrayDeque;\nimport java.util.Deque;\n\npublic class LibraryStack {\n    public static void main(String[] args) {\n        Deque<String> stack = new ArrayDeque<>();\n        stack.push(\"A\");\n        stack.push(\"B\");\n        stack.push(\"C\");\n        System.out.println(stack + \"  peek = \" + stack.peek());\n        System.out.println(\"pop = \" + stack.pop() + \", then \" + stack);\n        System.out.println(\"peek on empty: \" + new ArrayDeque<String>().peek());\n    }\n}",
  libraryUnderflow: "import java.util.ArrayDeque;\n\npublic class LibraryUnderflow {\n    public static void main(String[] args) {\n        ArrayDeque<String> stack = new ArrayDeque<>();\n        System.out.println(\"isEmpty = \" + stack.isEmpty());\n        stack.pop();                                   // throws NoSuchElementException\n        System.out.println(\"never printed\");\n    }\n}",
  cCode: "int sum = 0;\nfor (int i = 0; i < n; i++) {\n    sum += array[i];\n}\nreturn sum;",
  balanced: "public class BalancedSymbols {\n    static boolean isBalanced(String text) {\n        LinkedStack<Character> stack = new LinkedStack<>();\n        for (int i = 0; i < text.length(); i++) {\n            char c = text.charAt(i);\n            if (c == '(' || c == '[' || c == '{') {\n                stack.push(c);                       // opening: push\n            } else if (c == ')' || c == ']' || c == '}') {\n                if (stack.isEmpty()) {\n                    return false;                    // nothing to close\n                }\n                char open = stack.pop();\n                if (!matches(open, c)) {\n                    return false;                    // wrong kind\n                }\n            }                                        // other characters: ignore\n        }\n        return stack.isEmpty();                      // left-over openers?\n    }\n\n    static boolean matches(char open, char close) {\n        return (open == '(' && close == ')')\n                || (open == '[' && close == ']')\n                || (open == '{' && close == '}');\n    }\n\n    public static void main(String[] args) {\n        String[] tests = {\"( ) { [ ] }\", \"( { { } } )\", \"( { [ ] } )\", \"( ]\",\n            \"( ) { ( [ ] ) } ]\", \"( ) [ [ ] { }\", \"{ ( ] [ ] ) }\", \"( [ ) ]\", \"\"};\n        for (String t : tests) {\n            System.out.println(\"\\\"\" + t + \"\\\" -> \" + isBalanced(t));\n        }\n        String code = \"int sum = 0;\\nfor (int i = 0; i < n; i++) {\\n\"\n                + \"    sum += array[i];\\n}\\nreturn sum;\";\n        System.out.println(\"C code example -> \" + isBalanced(code));\n    }\n}",
  isBalanced: "static boolean isBalanced(String text) {\n    LinkedStack<Character> stack = new LinkedStack<>();\n    for (int i = 0; i < text.length(); i++) {\n        char c = text.charAt(i);\n        if (c == '(' || c == '[' || c == '{') {\n            stack.push(c);                       // opening: push\n        } else if (c == ')' || c == ']' || c == '}') {\n            if (stack.isEmpty()) {\n                return false;                    // nothing to close\n            }\n            char open = stack.pop();\n            if (!matches(open, c)) {\n                return false;                    // wrong kind\n            }\n        }                                        // other characters: ignore\n    }\n    return stack.isEmpty();                      // left-over openers?\n}",
  infix: "public class InfixToPostfix {\n    // An expression tree: a leaf holds an operand; an inner node holds an operator.\n    record Expr(String token, Expr left, Expr right) { }\n\n    static String postfix(Expr e) {\n        if (e.left() == null) {\n            return e.token();                    // an operand is its own postfix\n        }\n        return postfix(e.left()) + \" \" + postfix(e.right()) + \" \" + e.token();\n    }\n\n    private static String[] tokens;\n    private static int pos;\n\n    static Expr parse(String infix) {\n        tokens = infix.replaceAll(\"([()+*/-])\", \" $1 \").trim().split(\"\\\\s+\");\n        pos = 0;\n        return expression();\n    }\n\n    // expression = term { (+ | -) term }: the last + or - is the root (left-associative)\n    private static Expr expression() {\n        Expr e = term();\n        while (pos < tokens.length && (tokens[pos].equals(\"+\") || tokens[pos].equals(\"-\"))) {\n            String op = tokens[pos++];\n            e = new Expr(op, e, term());\n        }\n        return e;\n    }\n\n    // term = factor { (* | /) factor }\n    private static Expr term() {\n        Expr e = factor();\n        while (pos < tokens.length && (tokens[pos].equals(\"*\") || tokens[pos].equals(\"/\"))) {\n            String op = tokens[pos++];\n            e = new Expr(op, e, factor());\n        }\n        return e;\n    }\n\n    // factor = operand | ( expression )\n    private static Expr factor() {\n        String t = tokens[pos++];\n        if (t.equals(\"(\")) {\n            Expr e = expression();\n            pos++;                               // skip \")\"\n            return e;\n        }\n        return new Expr(t, null, null);\n    }\n}",
  postfixRule: "static String postfix(Expr e) {\n    if (e.left() == null) {\n        return e.token();                    // an operand is its own postfix\n    }\n    return postfix(e.left()) + \" \" + postfix(e.right()) + \" \" + e.token();\n}",
  infixDemo: "public class InfixDemo {\n    public static void main(String[] args) {\n        String[] tests = {\"2 + 3 * 4\", \"2 * 3 + 4\", \"2 * 3 * 4\", \"(2 + 3) * 4\",\n            \"a / b - c + d * e - a * c\", \"7 / (2 + 3) * 4\", \"2 * (3 + 2 * 4)\",\n            \"(6 / 2 - 3) + (4 * 2)\", \"8 - 3 - 2\"};\n        for (String t : tests) {\n            System.out.println(t + \"  =>  \" + InfixToPostfix.postfix(InfixToPostfix.parse(t)));\n        }\n    }\n}",
  evaluator: "public class PostfixEvaluator {\n    static int evaluate(String postfix) {\n        LinkedStack<Integer> stack = new LinkedStack<>();\n        for (String token : postfix.trim().split(\"\\\\s+\")) {\n            if (isOperator(token)) {\n                Integer right = stack.pop();         // pushed last = right operand\n                Integer left = stack.pop();\n                if (left == null) {\n                    throw new IllegalArgumentException(\"missing operand for \" + token);\n                }\n                stack.push(apply(token, left, right));\n            } else {\n                stack.push(Integer.parseInt(token)); // operand\n            }\n        }\n        Integer result = stack.pop();\n        if (result == null || !stack.isEmpty()) {\n            throw new IllegalArgumentException(\"not a single expression\");\n        }\n        return result;\n    }\n\n    static boolean isOperator(String token) {\n        return token.equals(\"+\") || token.equals(\"-\") || token.equals(\"*\") || token.equals(\"/\");\n    }\n\n    static int apply(String op, int left, int right) {\n        switch (op) {\n            case \"+\": return left + right;\n            case \"-\": return left - right;\n            case \"*\": return left * right;\n            default:  return left / right;\n        }\n    }\n}",
  evaluate: "static int evaluate(String postfix) {\n    LinkedStack<Integer> stack = new LinkedStack<>();\n    for (String token : postfix.trim().split(\"\\\\s+\")) {\n        if (isOperator(token)) {\n            Integer right = stack.pop();         // pushed last = right operand\n            Integer left = stack.pop();\n            if (left == null) {\n                throw new IllegalArgumentException(\"missing operand for \" + token);\n            }\n            stack.push(apply(token, left, right));\n        } else {\n            stack.push(Integer.parseInt(token)); // operand\n        }\n    }\n    Integer result = stack.pop();\n    if (result == null || !stack.isEmpty()) {\n        throw new IllegalArgumentException(\"not a single expression\");\n    }\n    return result;\n}",
  postfixDemo: "public class PostfixDemo {\n    public static void main(String[] args) {\n        String[] tests = {\"6 2 / 3 - 4 2 * +\", \"2 3 2 4 * + *\", \"7 2 3 + / 4 *\",\n            \"2 3 4 * +\", \"8 3 - 2 -\", \"8 2 -\", \"2 8 -\"};\n        for (String t : tests) {\n            System.out.println(t + \"  =  \" + PostfixEvaluator.evaluate(t));\n        }\n    }\n}",
  badPostfix: "public class BadPostfix {\n    public static void main(String[] args) {\n        System.out.println(PostfixEvaluator.evaluate(\"3 4 +\"));\n        System.out.println(PostfixEvaluator.evaluate(\"3 +\"));    // throws\n    }\n}",
  ex1: "public class Exercise1 {\n    public static void main(String[] args) {\n        LinkedStack<String> s = new LinkedStack<>();\n        s.push(\"a\");\n        s.push(\"b\");\n        System.out.print(s.pop());\n        s.push(\"c\");\n        s.push(\"d\");\n        System.out.print(s.pop());\n        System.out.print(s.pop());\n        s.push(\"e\");\n        while (!s.isEmpty()) {\n            System.out.print(s.pop());\n        }\n        System.out.println();\n    }\n}",
  reverse: "public class Reverse {\n    static String reverse(String s) {\n        LinkedStack<Character> stack = new LinkedStack<>();\n        for (int i = 0; i < s.length(); i++) {\n            stack.push(s.charAt(i));\n        }\n        StringBuilder sb = new StringBuilder();\n        while (!stack.isEmpty()) {\n            sb.append(stack.pop());\n        }\n        return sb.toString();\n    }\n\n    public static void main(String[] args) {\n        System.out.println(reverse(\"stack\"));\n        System.out.println(reverse(\"CSC3100\"));\n        System.out.println(\"[\" + reverse(\"\") + \"]\");\n    }\n}",
  twoStacks: "public class TwoStacks {\n    private final int[] array;\n    private int top0 = -1;\n    private int top1;\n\n    public TwoStacks(int capacity) {\n        array = new int[capacity];\n        top1 = capacity;\n    }\n\n    public boolean push(int which, int x) {\n        if (top0 + 1 == top1) {\n            return false;                        // the two stacks have met\n        }\n        if (which == 0) {\n            array[++top0] = x;\n        } else {\n            array[--top1] = x;\n        }\n        return true;\n    }\n\n    public int pop(int which) {                  // assumes the stack is not empty\n        return which == 0 ? array[top0--] : array[top1++];\n    }\n\n    public static void main(String[] args) {\n        TwoStacks s = new TwoStacks(5);\n        System.out.println(s.push(0, 1) + \" \" + s.push(0, 2) + \" \" + s.push(0, 3)\n                + \" \" + s.push(1, 9) + \" \" + s.push(1, 8) + \" \" + s.push(1, 7));\n        System.out.println(s.pop(0) + \" \" + s.pop(1) + \" \" + s.pop(1));\n    }\n}",
  shunting: "public class ShuntingYard {\n    static int precedence(String op) {\n        return op.equals(\"*\") || op.equals(\"/\") ? 2 : 1;\n    }\n\n    static String toPostfix(String infix) {\n        String[] tokens = infix.replaceAll(\"([()+*/-])\", \" $1 \").trim().split(\"\\\\s+\");\n        LinkedStack<String> ops = new LinkedStack<>();\n        StringBuilder out = new StringBuilder();\n        for (String t : tokens) {\n            if (t.equals(\"(\")) {\n                ops.push(t);\n            } else if (t.equals(\")\")) {\n                while (!ops.top().equals(\"(\")) {\n                    out.append(ops.pop()).append(' ');\n                }\n                ops.pop();                                   // discard \"(\"\n            } else if (PostfixEvaluator.isOperator(t)) {\n                while (!ops.isEmpty() && !ops.top().equals(\"(\")\n                        && precedence(ops.top()) >= precedence(t)) {\n                    out.append(ops.pop()).append(' ');\n                }\n                ops.push(t);\n            } else {\n                out.append(t).append(' ');                   // operand\n            }\n        }\n        while (!ops.isEmpty()) {\n            out.append(ops.pop()).append(' ');\n        }\n        return out.toString().trim();\n    }\n\n    public static void main(String[] args) {\n        String[] tests = {\"2 + 3 * 4\", \"(2 + 3) * 4\", \"a / b - c + d * e - a * c\",\n            \"7 / (2 + 3) * 4\", \"2 * (3 + 2 * 4)\", \"8 - 3 - 2\"};\n        for (String t : tests) {\n            String p = toPostfix(t);\n            boolean same = p.equals(InfixToPostfix.postfix(InfixToPostfix.parse(t)));\n            System.out.println(t + \"  =>  \" + p + \"   (same as section 5.3: \" + same + \")\");\n        }\n    }\n}",
  minStack: "public class MinStack {\n    private final LinkedStack<Integer> values = new LinkedStack<>();\n    private final LinkedStack<Integer> mins = new LinkedStack<>();\n\n    public void push(int x) {\n        values.push(x);\n        mins.push(mins.isEmpty() ? x : Math.min(x, mins.top()));\n    }\n\n    public int pop() {\n        mins.pop();\n        return values.pop();\n    }\n\n    public int getMin() {\n        return mins.top();\n    }\n\n    public static void main(String[] args) {\n        MinStack s = new MinStack();\n        int[] xs = {5, 3, 7, 2, 8};\n        for (int x : xs) {\n            s.push(x);\n            System.out.print(\"push \" + x + \" min \" + s.getMin() + \" | \");\n        }\n        System.out.println();\n        for (int k = 0; k < 4; k++) {\n            int x = s.pop();\n            System.out.print(\"pop \" + x + \" min \" + s.getMin() + \" | \");\n        }\n        System.out.println();\n    }\n}",
};

const OUT = {
  callStack: "before change, sb is Hello \nafter change, sb is Hello ",
  linkedDemo: "after 3 pushes: [33, 22, 11], size 3\ntop()  = 33\npop()  = 33\npop()  = 22\nnow:      [11], size 1\npop()  = 11\npop()  = null   (underflow)\nisEmpty() = true",
  arrayDemo: "capacity 5\npush(1) -> true   [1], size 1\npush(2) -> true   [1, 2], size 2\npush(3) -> true   [1, 2, 3], size 3\npush(4) -> true   [1, 2, 3, 4], size 4\npush(5) -> true   [1, 2, 3, 4, 5], size 5\npush(6) -> false   [1, 2, 3, 4, 5], size 5\ntop() = 5\npop() = 5   [1, 2, 3, 4]\npop() = 4   [1, 2, 3]\nafter makeEmpty: [], pop() = null",
  growingDemo: "push(5): capacity 4 -> 8, copied 4 elements\npush(9): capacity 8 -> 16, copied 8 elements\npush(17): capacity 16 -> 32, copied 16 elements\n17 pushes, 28 element copies in total\npop() = 9: size 8, capacity 32 -> 16\npop() = 5: size 4, capacity 16 -> 8\npop() = 3: size 2, capacity 8 -> 4",
  library: "[C, B, A]  peek = C\npop = C, then [B, A]\npeek on empty: null",
  libraryUnderflow: "isEmpty = true",
  balanced: "\"( ) { [ ] }\" -> true\n\"( { { } } )\" -> true\n\"( { [ ] } )\" -> true\n\"( ]\" -> false\n\"( ) { ( [ ] ) } ]\" -> false\n\"( ) [ [ ] { }\" -> false\n\"{ ( ] [ ] ) }\" -> false\n\"( [ ) ]\" -> false\n\"\" -> true\nC code example -> true",
  infixDemo: "2 + 3 * 4  =>  2 3 4 * +\n2 * 3 + 4  =>  2 3 * 4 +\n2 * 3 * 4  =>  2 3 * 4 *\n(2 + 3) * 4  =>  2 3 + 4 *\na / b - c + d * e - a * c  =>  a b / c - d e * + a c * -\n7 / (2 + 3) * 4  =>  7 2 3 + / 4 *\n2 * (3 + 2 * 4)  =>  2 3 2 4 * + *\n(6 / 2 - 3) + (4 * 2)  =>  6 2 / 3 - 4 2 * +\n8 - 3 - 2  =>  8 3 - 2 -",
  postfixDemo: "6 2 / 3 - 4 2 * +  =  8\n2 3 2 4 * + *  =  22\n7 2 3 + / 4 *  =  4\n2 3 4 * +  =  14\n8 3 - 2 -  =  3\n8 2 -  =  6\n2 8 -  =  -6",
  badPostfix: "7",
  ex1: "bdcea",
  reverse: "kcats\n0013CSC\n[]",
  twoStacks: "true true true true true false\n3 8 9",
  shunting: "2 + 3 * 4  =>  2 3 4 * +   (same as section 5.3: true)\n(2 + 3) * 4  =>  2 3 + 4 *   (same as section 5.3: true)\na / b - c + d * e - a * c  =>  a b / c - d e * + a c * -   (same as section 5.3: true)\n7 / (2 + 3) * 4  =>  7 2 3 + / 4 *   (same as section 5.3: true)\n2 * (3 + 2 * 4)  =>  2 3 2 4 * + *   (same as section 5.3: true)\n8 - 3 - 2  =>  8 3 - 2 -   (same as section 5.3: true)",
  minStack: "push 5 min 5 | push 3 min 3 | push 7 min 3 | push 2 min 2 | push 8 min 2 | \npop 8 min 2 | pop 2 min 3 | pop 7 min 3 | pop 3 min 5 | ",
};

// ---------- styles for this lecture's widgets (injected once) ----------

(function injectStyle() {
  if (document.getElementById("l09-style")) return;
  const st = document.createElement("style");
  st.id = "l09-style";
  st.textContent = `
  .l9-vis { min-width: 0; }
  .l9-side { display: grid; grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr); gap: 14px; }
  .l9-side pre.code { margin: 0; font-size: 13px; }
  .l9-below pre.code { margin: 12px 0 0; font-size: 13px; }
  .l9-panel { background: var(--paper-2); border-radius: 10px; padding: 10px; display: flex; flex-direction: column; gap: 8px; }
  .l9-panel > small { font: 500 11px var(--mono); color: var(--stone); display: flex; justify-content: space-between; gap: 8px; }
  .l9-stk { display: flex; flex-direction: column-reverse; gap: 4px; min-height: 150px; justify-content: flex-start; padding: 0 0 4px; border: 2px solid var(--ink-2); border-top: none; border-radius: 0 0 8px 8px; padding: 6px; }
  .l9-box { font: 600 15px var(--mono); text-align: center; padding: 7px 6px; border: 1px solid var(--line); border-radius: 6px; background: var(--card); position: relative; }
  .l9-box.top { border-color: var(--teal); box-shadow: inset 3px 0 0 var(--teal); }
  .l9-box.top::after { content: "← top"; position: absolute; right: 6px; top: 50%; transform: translateY(-50%); font: 500 10px var(--mono); color: var(--teal); }
  .l9-box.new { animation: l9in 0.25s ease-out; background: var(--teal-soft); }
  .l9-box.hl { background: var(--mark); border-color: var(--amber); }
  .l9-empty { text-align: center; color: var(--stone); font: 12px var(--mono); padding: 8px 0; }
  @keyframes l9in { from { transform: translateY(-8px); opacity: 0; } to { transform: none; opacity: 1; } }
  .l9-chips { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; min-height: 28px; }
  .l9-chip { font: 600 13px var(--mono); padding: 3px 9px; border-radius: 6px; border: 1px solid var(--line); background: var(--card); }
  .l9-chip.out { border-color: var(--amber); background: var(--mark); }
  .l9-chip.bad { border-color: var(--red); background: var(--red-soft); color: var(--red); }
  .l9-chip.good { border-color: var(--green); background: var(--green-soft); color: var(--green); }
  .l9-toks { display: flex; flex-wrap: wrap; gap: 4px; font: 600 15px var(--mono); }
  .l9-tok { min-width: 28px; padding: 5px 7px; text-align: center; border-radius: 6px; border: 1px solid var(--line); background: var(--card); }
  .l9-tok.done { opacity: 0.4; }
  .l9-tok.cur { background: var(--mark); border-color: var(--amber); }
  .l9-tok.bad { background: var(--red-soft); border-color: var(--red); color: var(--red); }
  .l9-text { font: 14px/1.6 var(--mono); white-space: pre-wrap; word-break: break-all; background: var(--card); border: 1px solid var(--line); border-radius: 8px; padding: 8px 10px; }
  .l9-text .sym { color: var(--teal); font-weight: 700; }
  .l9-text .done { opacity: 0.45; }
  .l9-text .cur { background: var(--mark); outline: 1px solid var(--amber); border-radius: 3px; }
  .l9-text .bad { background: var(--red-soft); outline: 1px solid var(--red); color: var(--red); border-radius: 3px; }
  .l9-log { font: 12.5px/1.5 var(--mono); background: var(--code-bg); border: 1px solid var(--line); border-radius: 8px; padding: 6px 10px; min-height: 2.2em; max-height: 140px; overflow: auto; white-space: pre-wrap; }
  .l9-log:empty::before { content: "(no results yet)"; color: var(--stone); }
  .l9-cells .cell { width: 44px; height: 40px; }
  .l9-cells .cell.fill { background: var(--teal-soft); border-color: var(--teal); }
  .l9-cells .cell.hl { background: var(--mark); border-color: var(--amber); }
  .l9-cells .cell.clr { border-style: dashed; }
  .l9-heap { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 10px; font-size: 13px; align-items: center; }
  .l9-heap .obj { font: 600 13px var(--mono); padding: 5px 10px; border-radius: 8px; border: 1px solid var(--line); background: var(--card); }
  .l9-heap .obj.dead { opacity: 0.45; border-style: dashed; }
  .l9-heap .refs { font: 500 11px var(--mono); color: var(--teal); margin-left: 6px; }
  .l9-ops { display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 8px; }
  @media (max-width: 900px) { .l9-side { grid-template-columns: minmax(0, 1fr); } }
  @media (max-width: 600px) {
    .l9-cells .cell { width: 34px; height: 34px; font-size: 12px; }
    .l9-stk { min-height: 110px; }
    .controls input[type="text"] { width: 100% !important; }
  }`;
  document.head.appendChild(st);
})();

// ---------- a generic step player for this lecture ----------
// opts: code (string or fn), layout "side" (code | picture) or "below" (picture, then code),
// build() -> snaps [{line, msg, msgCls, ...}], render(snap) -> html, extraControls, onMount, mini.

function stepPlayer(el, opts) {
  const mini = !!opts.mini;
  const hasCode = !!opts.code && !mini;
  const side = hasCode && opts.layout === "side";
  el.innerHTML = `${side ? `<div class="l9-side"><div class="l9-code"></div><div class="l9-vis"></div></div>`
    : `<div class="l9-vis"></div>${hasCode ? `<div class="l9-below l9-code"></div>` : ""}`}
    ${mini ? "" : `<div class="msg l9-msg"></div>
    <div class="controls">
      <button class="cbtn l9-reset" title="Back to the start">⟲ Reset</button>
      <button class="cbtn l9-back" title="Step back (←)">◀ Back</button>
      <button class="cbtn l9-stepb on" title="Step (→)">Step ▶</button>
      <button class="cbtn l9-play">Play</button>
      ${opts.extraControls || ""}
      <span class="spacer"></span><span class="counter l9-count"></span>
    </div>`}`;
  const $ = (q) => el.querySelector(q);
  let snaps = [], i = 0, timer = null, lines = [];
  function render() {
    const s = snaps[i];
    $(".l9-vis").innerHTML = opts.render(s, i, snaps);
    if (mini) return;
    lines.forEach((ln, k) => ln.classList.toggle("hl", k + 1 === s.line));
    const m = $(".l9-msg");
    m.innerHTML = s.msg || "";
    m.className = "msg l9-msg " + (s.msgCls || "");
    $(".l9-count").textContent = `step ${i + 1} / ${snaps.length}`;
    $(".l9-back").disabled = $(".l9-reset").disabled = i === 0;
    $(".l9-stepb").disabled = i === snaps.length - 1;
  }
  function stop() { clearInterval(timer); timer = null; if (!mini) $(".l9-play").textContent = "Play"; }
  function play() {
    if (timer) return stop();
    if (i === snaps.length - 1) i = 0;
    if (!mini) $(".l9-play").textContent = "Pause";
    timer = setInterval(() => {
      if (i < snaps.length - 1) i++;
      else if (mini) i = 0;
      else return stop();
      render();
    }, mini ? 950 : 750);
  }
  function rebuild() {
    stop();
    if (hasCode) {
      const code = typeof opts.code === "function" ? opts.code() : opts.code;
      $(".l9-code").innerHTML = codeBlock(code);
      lines = [...el.querySelectorAll(".l9-code .ln")];
    }
    snaps = opts.build();
    i = 0;
    render();
  }
  if (!mini) {
    $(".l9-reset").onclick = () => { stop(); i = 0; render(); };
    $(".l9-back").onclick = () => { stop(); if (i) i--; render(); };
    $(".l9-stepb").onclick = () => { stop(); if (i < snaps.length - 1) i++; render(); };
    $(".l9-play").onclick = play;
    el.tabIndex = 0;
    el.addEventListener("keydown", (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "SELECT" || e.target.tagName === "TEXTAREA") return;
      if (e.key === "ArrowRight") { e.preventDefault(); $(".l9-stepb").click(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); $(".l9-back").click(); }
    });
  }
  if (opts.onMount) opts.onMount(el, rebuild);
  rebuild();
  if (mini) play();
  return { rebuild };
}

// A vertical stack picture. items: bottom first.
function stackCol(items, { newTop = false, hlTop = false, title = "stack", note = "" } = {}) {
  const n = items.length;
  const boxes = items.map((v, k) => {
    const top = k === n - 1;
    const cls = ["l9-box", top ? "top" : "", top && newTop ? "new" : "", top && hlTop ? "hl" : ""].join(" ");
    return `<div class="${cls}">${esc(v)}</div>`;
  }).join("");
  return `<div class="l9-panel"><small><span>${title}</span><span>size ${n}${note ? " · " + note : ""}</span></small>
    <div class="l9-stk">${boxes || `<div class="l9-empty">(empty)</div>`}</div></div>`;
}

// "push 11, push 22, pop, top" -> [{op, val}]. "push 1 2 3" pushes three values.
function parseOps(text, fallback) {
  const ops = [];
  String(text).split(/[,;\n]+/).forEach((part) => {
    const p = part.trim();
    let m;
    if ((m = p.match(/^push\s+(.+)$/i))) m[1].trim().split(/\s+/).forEach((v) => ops.push({ op: "push", val: v.slice(0, 6) }));
    else if (/^pop(\(\))?$/i.test(p)) ops.push({ op: "pop" });
    else if (/^(top|peek)(\(\))?$/i.test(p)) ops.push({ op: "top" });
  });
  return ops.length ? ops.slice(0, 24) : fallback;
}
const opsText = (ops) => ops.map((o) => (o.op === "push" ? `push ${o.val}` : o.op)).join(", ");
function opsChips(ops, cur) {
  return `<div class="l9-ops">${ops.map((o, k) => `<span class="l9-tok ${k < cur ? "done" : k === cur ? "cur" : ""}" style="font-size:12px">${esc(o.op === "push" ? `push ${o.val}` : o.op + "()")}</span>`).join("")}</div>`;
}

// ---------- Chapter 1: LIFO with an abstract stack ----------

const LIFO_OPS = "push A, push B, push C, pop, push D, pop, pop";

function traceLifo(ops) {
  const st = [], log = [], snaps = [];
  const s = (cur, msg, extra = {}) => snaps.push({ cur, items: st.slice(), log: log.slice(), msg, ...extra });
  s(-1, "An empty stack. Step through the operations.");
  ops.forEach((o, k) => {
    if (o.op === "push") {
      st.push(o.val);
      s(k, `<code>push(${esc(o.val)})</code>: ${esc(o.val)} goes on the top.`, { newTop: true });
    } else if (o.op === "pop") {
      if (!st.length) { log.push("pop() -> null (underflow)"); s(k, "<code>pop()</code> on an empty stack: <b>underflow</b>. Our classes return <code>null</code>.", { msgCls: "bad" }); return; }
      const v = st.pop();
      log.push(`pop() -> ${v}`);
      s(k, `<code>pop()</code> removes the top element and returns <b>${esc(v)}</b>, the most recent one still there.`, { popped: v });
    } else {
      if (!st.length) { log.push("top() -> null"); s(k, "<code>top()</code> on an empty stack: nothing to return.", { msgCls: "bad" }); return; }
      log.push(`top() -> ${st[st.length - 1]}`);
      s(k, `<code>top()</code> returns <b>${esc(st[st.length - 1])}</b> and leaves it there.`, { hlTop: true });
    }
  });
  const last = snaps[snaps.length - 1];
  last.msg += ` Done: ${st.length ? `${st.length} element${st.length > 1 ? "s" : ""} left, <b>${esc(st[st.length - 1])}</b> on top.` : "the stack is empty."}`;
  return snaps;
}

function demoLifo(el, { mini = false } = {}) {
  let ops = parseOps(LIFO_OPS);
  stepPlayer(el, {
    mini,
    build: () => traceLifo(ops),
    render: (s) => mini
      ? `<div style="max-width:220px;margin:0 auto">${stackCol(s.items, { newTop: s.newTop, hlTop: s.hlTop })}<div class="l9-chips" style="justify-content:center;margin-top:6px">${s.popped ? `<span class="l9-chip out">popped ${esc(s.popped)}</span>` : ""}</div></div>`
      : `${opsChips(ops, s.cur)}<div class="l9-side" style="grid-template-columns:minmax(0,1fr) minmax(0,1fr)">
          ${stackCol(s.items, { newTop: s.newTop, hlTop: s.hlTop })}
          <div class="l9-panel"><small><span>results</span></small><div class="l9-log">${esc(s.log.join("\n"))}</div>
          <div class="l9-chips">${s.popped ? `<span class="l9-chip out">popped ${esc(s.popped)}</span>` : ""}<span class="l9-chip">isEmpty() = ${s.items.length === 0}</span></div></div></div>`,
    extraControls: `<label>operations <input type="text" class="lf-ops" value="${LIFO_OPS}" style="width:300px"></label>`,
    onMount(root, rebuild) {
      if (mini) return;
      root.querySelector(".lf-ops").onchange = (e) => { ops = parseOps(e.target.value, ops); e.target.value = opsText(ops); rebuild(); };
    },
  });
}

// ---------- Chapter 1: the call stack of CallStackDemo ----------

function traceCallStack() {
  const t = new Tracer();
  const heap = [];
  const ex = () => ({ heap: heap.map((o) => ({ ...o, refs: o.refs.slice() })) });
  const main = t.push("main(args)", {});
  t.snap(2, "The program starts: Java pushes a frame for <code>main</code>.", "", ex());
  heap.push({ id: 1, text: "Hello ", refs: ["sb"] });
  main.vars = { sb: "→ #1" };
  t.snap(3, "<code>sb</code> is a local variable of <code>main</code>. It refers to a new object #1, <code>\"Hello \"</code>.", "", ex());
  t.out.push("before change, sb is Hello ");
  t.snap(4, "Print it.", "", ex());
  main.status = "waiting at line 5: change(sb)";
  const ch = t.push("change(text)", { text: "→ #1" });
  heap[0].refs.push("text");
  t.snap(9, "The call pushes a <b>new frame</b>. Its parameter <code>text</code> is a new variable holding a <em>copy</em> of the reference in <code>sb</code>: both refer to #1.", "", ex());
  heap[0].refs = ["sb"];
  heap.push({ id: 2, text: "Hi ", refs: ["text"] });
  ch.vars = { text: "→ #2" };
  t.snap(10, "<code>text</code> now refers to a new object #2. Only the variable in this frame changed; <code>sb</code> in <code>main</code>'s frame still refers to #1.", "", ex());
  heap[1].text = "Hi world !";
  t.snap(11, "<code>append</code> changes object #2, not #1.", "", ex());
  ch.status = "returns"; ch.cls = "ret";
  t.snap(12, "<code>change</code> returns: its frame is popped, and with it the only reference to #2.", "good", ex());
  t.pop();
  heap[1].refs = []; heap[1].dead = true;
  main.status = "running";
  t.snap(5, "Back in <code>main</code>, right after the call. Object #2 is unreachable: the garbage collector will reclaim it.", "", ex());
  t.out.push("after change, sb is Hello ");
  t.snap(6, "<code>sb</code> still refers to #1, which nobody changed: <b>Hello</b> again.", "good", ex());
  main.status = "returns"; main.cls = "ret";
  t.snap(7, "<code>main</code> returns; the call stack is empty and the program ends.", "good", ex());
  t.pop();
  t.snap(0, "Last frame pushed (<code>change</code>) was the first popped: the call stack is a stack.", "good", ex());
  return t.snaps;
}

function demoCallStack(el) {
  makeStepper(el, {
    showConsole: true,
    code: CODE.callStack,
    build: traceCallStack,
    renderExtra: (s) => s.extra ? `<div class="l9-heap"><b style="font-size:12px;color:var(--stone)">OBJECTS</b>${s.extra.heap.map((o) =>
      `<span class="obj ${o.dead ? "dead" : ""}">#${o.id} "${esc(o.text)}"<span class="refs">${o.refs.length ? "← " + o.refs.join(", ") : o.dead ? "unreachable" : ""}</span></span>`).join("") || `<span class="meta">(none yet)</span>`}</div>` : "",
  });
}

// ---------- Chapter 2: the linked-list stack ----------

function linkedSVG(s) {
  const n = s.list.length;
  const gap = 92, nw = 70, nh = 34, y = 112, x0 = 10;
  const cols = Math.max(n + 1, 4);
  const W = x0 + cols * gap + 30, H = 168;
  const X = (k) => x0 + (k + 1) * gap;          // node k (0 = top)
  const arrow = (x1, y1, x2, y2, col = "var(--ink-2)") =>
    `<path d="M ${x1} ${y1} L ${x2 - 2} ${y2}" stroke="${col}" stroke-width="1.6" fill="none" marker-end="url(#l9a)"/>`;
  const curve = (x1, y1, x2, y2, col) =>
    `<path d="M ${x1} ${y1} C ${x1} ${(y1 + y2) / 2}, ${x2 + 20} ${y1}, ${x2 + 20} ${y2 - 2}" stroke="${col}" stroke-width="1.6" fill="none" marker-end="url(#l9a)"/>`;
  const node = (x, yy, val, { fill = "var(--card)", stroke = "var(--ink-2)", dash = false, nul = false } = {}) =>
    `<rect x="${x}" y="${yy}" width="${nw}" height="${nh}" rx="5" fill="${fill}" stroke="${stroke}" stroke-width="1.4" ${dash ? 'stroke-dasharray="4 3"' : ""}/>
     <line x1="${x + 44}" y1="${yy}" x2="${x + 44}" y2="${yy + nh}" stroke="${stroke}" stroke-width="1.2"/>
     <text x="${x + 22}" y="${yy + 22}" font-size="14" font-weight="600" text-anchor="middle" fill="var(--ink)">${esc(val)}</text>
     ${nul ? `<text x="${x + 57}" y="${yy + 21}" font-size="8.5" text-anchor="middle" fill="var(--stone)">null</text>` : `<circle cx="${x + 57}" cy="${yy + nh / 2}" r="3" fill="${stroke}"/>`}`;
  let g = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="linked-list stack"><defs><marker id="l9a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="var(--ink-2)"/></marker></defs>`;
  // header
  g += node(x0, y, "", { fill: "var(--paper)", dash: true, nul: n === 0 });
  g += `<text x="${x0 + 35}" y="${y + nh + 16}" font-size="10" text-anchor="middle" fill="var(--stone)">header</text>`;
  g += `<text x="${x0 + 35}" y="${y - 8}" font-size="11" font-weight="600" text-anchor="middle" fill="var(--teal)">head</text>`;
  if (n) g += arrow(x0 + 57, y + nh / 2, X(0), y + nh / 2, s.headChanged ? "var(--amber)" : "var(--ink-2)");
  s.list.forEach((v, k) => {
    const hl = s.hl === k;
    g += node(X(k), y, v, { fill: hl ? "var(--mark)" : k === 0 && s.fresh ? "var(--teal-soft)" : "var(--card)", stroke: hl ? "var(--amber)" : k === 0 ? "var(--teal)" : "var(--ink-2)", nul: k === n - 1 });
    if (k < n - 1) g += arrow(X(k) + 57, y + nh / 2, X(k + 1), y + nh / 2);
  });
  if (n) g += `<text x="${X(0) + 35}" y="${y + nh + 16}" font-size="11" font-weight="600" text-anchor="middle" fill="var(--teal)">top</text>`;
  // pending node above (tmpNode on push, firstNode on pop)
  const p = s.tmp || s.gone;
  if (p) {
    const px = X(0) + (s.gone ? -10 : 0), py = 18;
    const linked = s.tmp ? s.tmp.linked : true;   // a new node's next starts as null
    g += node(px, py, p.val ?? "", { fill: s.gone ? "var(--red-soft)" : "var(--teal-soft)", stroke: s.gone ? "var(--red)" : "var(--teal)", nul: !linked || n === 0 });
    g += `<text x="${px + nw + 8}" y="${py + 21}" font-size="11" font-weight="600" fill="${s.gone ? "var(--red)" : "var(--teal)"}">${s.gone ? "firstNode" : "tmpNode"}</text>`;
    if (linked && n) g += curve(px + 57, py + nh / 2 + 3, X(0), y, s.tmp && s.tmp.justLinked ? "var(--amber)" : "var(--ink-2)");
  }
  return g + "</svg>";
}

function traceLinked(ops) {
  const list = [], log = [], snaps = [];
  let size = 0;
  const s = (cur, line, msg, extra = {}) => snaps.push({ cur, line, msg, list: list.slice(), log: log.slice(), size, ...extra });
  s(-1, 0, "An empty stack: just the header node, whose <code>next</code> is <code>null</code>.");
  ops.forEach((o, k) => {
    if (o.op === "push") {
      const x = o.val;
      s(k, 2, `<code>push(${esc(x)})</code>: make a new, empty node.`, { tmp: { val: "", linked: false } });
      s(k, 3, `Store ${esc(x)} in it.`, { tmp: { val: x, linked: false } });
      s(k, 4, list.length ? `The new node points to the old top, ${esc(list[0])}. Nothing in the stack has changed yet.` : "The new node points to the old top, which is <code>null</code>: the stack was empty.", { tmp: { val: x, linked: true, justLinked: true } });
      list.unshift(x);
      s(k, 5, `The header now points to the new node: ${esc(x)} is the top.`, { headChanged: true, fresh: true });
      size++;
      s(k, 6, `<code>size</code> = ${size}. Four assignments, whatever the size: O(1).`, { fresh: true });
    } else if (o.op === "pop") {
      s(k, 10, `<code>pop()</code>: is the stack empty? ${list.length ? "No." : "Yes."}`);
      if (!list.length) { log.push("pop() -> null"); s(k, 11, "Underflow: return <code>null</code>.", { msgCls: "bad" }); return; }
      s(k, 13, `<code>firstNode</code> is the top node, ${esc(list[0])}.`, { hl: 0 });
      const v = list.shift();
      s(k, 14, `The header skips it and points to ${list.length ? esc(list[0]) : "<code>null</code>"}. The old node is unlinked.`, { gone: { val: v }, headChanged: true });
      size--;
      s(k, 15, `<code>size</code> = ${size}.`, { gone: { val: v } });
      log.push(`pop() -> ${v}`);
      s(k, 16, `Return <b>${esc(v)}</b>. Nothing refers to its node any more, so the garbage collector reclaims it.`, { msgCls: "good" });
    } else {
      s(k, 20, `<code>top()</code>: is the stack empty? ${list.length ? "No." : "Yes."}`);
      if (!list.length) { log.push("top() -> null"); s(k, 21, "Empty: return <code>null</code>.", { msgCls: "bad" }); return; }
      log.push(`top() -> ${list[0]}`);
      s(k, 23, `Return <b>${esc(list[0])}</b>, the element of <code>head.next</code>. Nothing is unlinked.`, { hl: 0, msgCls: "good" });
    }
  });
  return snaps;
}

const LINKED_OPS = "push 11, push 22, push 33, top, pop, pop";

function demoLinked(el, { mini = false } = {}) {
  let ops = parseOps(mini ? "push 11, push 22, push 33, pop, pop, pop" : LINKED_OPS);
  stepPlayer(el, {
    mini, layout: "below",
    code: CODE.linkedOps,
    build: () => traceLinked(ops),
    render: (s) => mini ? `<div class="svgbox">${linkedSVG(s)}</div>`
      : `${opsChips(ops, s.cur)}<div class="svgbox">${linkedSVG(s)}</div>
        <div class="stats"><div class="stat"><small>size</small><b>${s.size}</b></div><div class="stat"><small>isEmpty()</small><b>${s.list.length === 0}</b></div>
        <div class="stat" style="grid-column:span 2"><small>results</small><b style="font-size:13px">${esc(s.log.slice(-3).join(" · ")) || "—"}</b></div></div>`,
    extraControls: `<label>operations <input type="text" class="ll-ops" value="${LINKED_OPS}" style="width:280px"></label>`,
    onMount(root, rebuild) {
      if (mini) return;
      root.querySelector(".ll-ops").onchange = (e) => { ops = parseOps(e.target.value, ops); e.target.value = opsText(ops); rebuild(); };
    },
  });
}

// ---------- Chapter 3: the array stack (fixed, as in the slides, or growing) ----------

function traceArray(ops, mode, asked) {
  const MIN = mode === "fixed" ? 5 : 4;
  let cap = mode === "fixed" ? Math.max(asked, MIN) : MIN;
  let arr = Array(cap).fill(null);
  let top = -1, copies = 0;
  const log = [], snaps = [];
  const s = (cur, line, msg, extra = {}) => snaps.push({ cur, line, msg, arr: arr.slice(), top, cap, copies, log: log.slice(), ...extra });
  s(-1, 0, mode === "fixed"
    ? (asked < MIN ? `<code>new ArrayStack&lt;&gt;(${asked})</code>: ${asked} &lt; MIN_STACK_SIZE, so the array gets <b>${cap}</b> cells. <code>topOfStack = -1</code>: empty.` : `<code>new ArrayStack&lt;&gt;(${asked})</code>: an array of ${cap} cells, <code>topOfStack = -1</code>.`)
    : "<code>new GrowingArrayStack&lt;&gt;()</code>: 4 cells, <code>topOfStack = -1</code>.");
  ops.forEach((o, k) => {
    if (mode === "fixed") {
      if (o.op === "push") {
        const full = top === cap - 1;
        s(k, 2, `<code>push(${esc(o.val)})</code>: is it full? <code>topOfStack == array.length - 1</code> → ${top} == ${cap - 1}: ${full ? "<b>yes</b>" : "no"}.`);
        if (full) { log.push(`push(${o.val}) -> false`); s(k, 3, "Overflow: return <code>false</code>. Nothing is stored and <code>topOfStack</code> does not move.", { msgCls: "bad" }); return; }
        top++; arr[top] = o.val;
        s(k, 5, `<code>++topOfStack</code> moves up to ${top} <em>first</em>, then <code>array[${top}] = ${esc(o.val)}</code>. The stack now holds ${top + 1} element${top ? "s" : ""}.`, { hl: top });
        log.push(`push(${o.val}) -> true`);
        s(k, 6, "Return <code>true</code>.", { msgCls: "good" });
      } else if (o.op === "pop") {
        s(k, 10, `<code>pop()</code>: is it empty (<code>topOfStack == -1</code>)? ${top === -1 ? "Yes." : "No."}`);
        if (top === -1) { log.push("pop() -> null"); s(k, 11, "Underflow: return <code>null</code>.", { msgCls: "bad" }); return; }
        const x = arr[top];
        s(k, 13, `<code>x = array[${top}]</code> = ${esc(x)}.`, { hl: top });
        arr[top] = null; top--;
        s(k, 14, `Clear cell ${top + 1}, then <code>topOfStack--</code> → ${top}.`, { clr: top + 1 });
        log.push(`pop() -> ${x}`);
        s(k, 15, `Return <b>${esc(x)}</b>.`, { msgCls: "good" });
      } else {
        s(k, 19, `<code>top()</code>: is it empty? ${top === -1 ? "Yes." : "No."}`);
        if (top === -1) { log.push("top() -> null"); s(k, 20, "Return <code>null</code>.", { msgCls: "bad" }); return; }
        log.push(`top() -> ${arr[top]}`);
        s(k, 22, `Return <code>array[${top}]</code> = <b>${esc(arr[top])}</b>. Nothing moves.`, { hl: top, msgCls: "good" });
      }
      return;
    }
    // growing
    if (o.op === "push") {
      const full = top === cap - 1;
      s(k, 2, `<code>push(${esc(o.val)})</code>: full? ${top} == ${cap - 1}: ${full ? "<b>yes</b>" : "no"}.`);
      if (full) {
        copies += cap;
        const old = cap;
        cap *= 2;
        arr = arr.concat(Array(old).fill(null));
        s(k, 3, `Full: <code>resize(${cap})</code> makes a new array of ${cap} cells and copies the ${old} elements. Total copies so far: ${copies}.`, { msgCls: "bad", grew: true });
      }
      top++; arr[top] = o.val;
      log.push(`push(${o.val})`);
      s(k, 5, `<code>array[++topOfStack] = ${esc(o.val)}</code>: <code>topOfStack</code> = ${top}.`, { hl: top, msgCls: "good" });
    } else if (o.op === "pop") {
      s(k, 9, `<code>pop()</code>: empty? ${top === -1 ? "Yes." : "No."}`);
      if (top === -1) { log.push("pop() -> null"); s(k, 10, "Return <code>null</code>.", { msgCls: "bad" }); return; }
      const x = arr[top];
      s(k, 12, `<code>x = array[${top}]</code> = ${esc(x)}.`, { hl: top });
      arr[top] = null; top--;
      s(k, 13, `Clear the cell; <code>topOfStack</code> = ${top}.`, { clr: top + 1 });
      const size = top + 1;
      const shrink = cap > MIN && size === cap / 4;
      s(k, 15, `<code>size = ${size}</code>. Shrink if <code>array.length &gt; 4</code> and size == ${cap}/4 = ${cap / 4}: ${shrink ? "<b>yes</b>" : "no"}.`);
      if (shrink) {
        copies += size;
        cap /= 2;
        arr = arr.slice(0, cap);
        s(k, 16, `<code>resize(${cap})</code>: a quarter full, so halve the array and copy ${size} element${size === 1 ? "" : "s"}.`, { msgCls: "bad" });
      }
      log.push(`pop() -> ${x}`);
      s(k, 18, `Return <b>${esc(x)}</b>.`, { msgCls: "good" });
    } else {
      s(k, 0, "<code>GrowingArrayStack</code> in the notes has no <code>top()</code>; this operation is skipped.");
    }
  });
  return snaps;
}

function arrayCells(s) {
  return `<div class="cells l9-cells">` + s.arr.map((v, k) => {
    let cls = "cell";
    if (k <= s.top) cls += " fill";
    if (s.hl === k) cls += " hl";
    if (s.clr === k) cls += " clr";
    return `<div class="cellcol"><div class="ptr">${k === s.top ? "top" : ""}</div><div class="${cls}">${v === null ? "" : esc(v)}</div><div class="cellidx">${k}</div></div>`;
  }).join("") + `</div>`;
}

const ARRAY_OPS = "push 1, push 2, push 3, top, pop, push 4, push 5, push 6, push 7";
const GROW_OPS = "push 1 2 3 4 5 6 7 8 9, pop, pop, pop, pop, pop, pop, pop";

function demoArray(el, { mini = false } = {}) {
  let mode = "fixed", asked = 4;
  let ops = parseOps(mini ? "push 1, push 2, push 3, pop, pop, pop" : ARRAY_OPS);
  stepPlayer(el, {
    mini, layout: "below",
    code: () => (mode === "fixed" ? CODE.arrayOps : CODE.growingOps),
    build: () => traceArray(ops, mode, asked),
    render: (s) => mini ? arrayCells(s)
      : `${opsChips(ops, s.cur)}${arrayCells(s)}
        <div class="stats"><div class="stat"><small>topOfStack</small><b>${s.top}</b></div><div class="stat"><small>size = top + 1</small><b>${s.top + 1}</b></div>
        <div class="stat ${s.grew ? "bad" : ""}"><small>capacity</small><b>${s.cap}</b></div>
        ${mode === "fixed" ? `<div class="stat"><small>last result</small><b style="font-size:13px">${esc(s.log[s.log.length - 1] || "—")}</b></div>` : `<div class="stat"><small>elements copied</small><b>${s.copies}</b></div>`}</div>`,
    extraControls: `<select class="ar-mode"><option value="fixed">ArrayStack (fixed, slides)</option><option value="grow">GrowingArrayStack (doubling)</option></select>
      <label class="ar-capl">maxElements <input type="number" class="ar-cap" min="1" max="10" value="${asked}"></label>
      <label>operations <input type="text" class="ar-ops" value="${ARRAY_OPS}" style="width:260px"></label>`,
    onMount(root, rebuild) {
      if (mini) return;
      const q = (x) => root.querySelector(x);
      q(".ar-mode").onchange = (e) => {
        mode = e.target.value;
        q(".ar-capl").style.display = mode === "fixed" ? "" : "none";
        ops = parseOps(mode === "fixed" ? ARRAY_OPS : GROW_OPS);
        q(".ar-ops").value = opsText(ops);
        rebuild();
      };
      q(".ar-cap").onchange = (e) => { asked = Math.min(10, Math.max(1, Math.trunc(+e.target.value) || 1)); e.target.value = asked; rebuild(); };
      q(".ar-ops").onchange = (e) => { ops = parseOps(e.target.value, ops); e.target.value = opsText(ops); rebuild(); };
    },
  });
}

// Copies made by n pushes into a doubling array that starts at 4 cells.
function demoGrowth(el) {
  el.innerHTML = `<div class="controls" style="margin-top:0"><label>number of pushes n = <b class="gr-v mono"></b></label>
    <input type="range" class="gr-n" min="1" max="200" value="17" style="width:240px"></div>
    <div class="bars gr-bars"></div><p class="hint gr-hint"></p>`;
  const $ = (q) => el.querySelector(q);
  function render() {
    const n = +$(".gr-n").value;
    let cap = 4, dbl = 0, one = 0;
    for (let k = 1; k <= n; k++) { if (k - 1 === cap) { dbl += cap; cap *= 2; } }
    let c1 = 4;
    for (let k = 1; k <= n; k++) { if (k - 1 === c1) { one += c1; c1 += 1; } }
    const max = Math.max(dbl, one, 2 * n, 1);
    $(".gr-v").textContent = n;
    $(".gr-bars").innerHTML = [["double when full", dbl, ""], ["grow by one cell", one, "red"], ["2n (bound)", 2 * n, "amber"]]
      .map(([k, v, c]) => `<div class="bar"><span>${k}</span><div class="track"><div class="fill ${c}" style="width:${Math.max(0.5, (100 * v) / max)}%"></div></div><span class="v">${v}</span></div>`).join("");
    $(".gr-hint").innerHTML = `Element copies made by ${n} pushes, starting from 4 cells. Doubling stays below 2n: amortised O(1) per push. Growing by one cell copies about n²/2 elements: O(n) per push.`;
  }
  $(".gr-n").oninput = render;
  render();
}

// ---------- Chapter 4: balanced symbols ----------

const OPENERS = "([{", CLOSERS = ")]}";

function traceBalanced(text) {
  const st = [], snaps = [];
  const s = (i, line, msg, extra = {}) => snaps.push({ i, line, msg, items: st.slice(), ...extra });
  s(-1, 2, "Start with an empty stack. Read the text from left to right; characters that are not brackets are skipped.");
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (OPENERS.includes(c)) {
      st.push(c);
      s(i, 6, `<code>${esc(c)}</code> is an opening symbol: push it.`, { newTop: true });
    } else if (CLOSERS.includes(c)) {
      if (!st.length) { s(i, 9, `<code>${esc(c)}</code> is a closing symbol, but the stack is <b>empty</b>: nothing to close. Return <b>false</b>.`, { msgCls: "bad", bad: true, verdict: false }); return snaps; }
      const open = st.pop();
      const ok = OPENERS.indexOf(open) === CLOSERS.indexOf(c);
      s(i, 11, `<code>${esc(c)}</code> is a closing symbol: pop <code>${esc(open)}</code>.`, { popped: open, pair: `${open} ${c}` });
      if (!ok) { s(i, 13, `<code>${esc(open)}</code> and <code>${esc(c)}</code> do <b>not</b> match. Return <b>false</b> immediately.`, { msgCls: "bad", bad: true, popped: open, verdict: false }); return snaps; }
      s(i, 12, `<code>${esc(open)} ${esc(c)}</code> match. Carry on.`, { msgCls: "good", popped: open, matched: true });
    }
  }
  const ok = st.length === 0;
  s(text.length, 17, ok ? "End of the text and the stack is empty: return <b>true</b>, balanced." : `End of the text, but ${st.length} opening symbol${st.length > 1 ? "s are" : " is"} never closed: return <b>false</b>.`, { msgCls: ok ? "good" : "bad", verdict: ok });
  return snaps;
}

function balancedText(text, s) {
  let h = "";
  for (let k = 0; k < text.length; k++) {
    const c = text[k];
    const sym = OPENERS.includes(c) || CLOSERS.includes(c);
    let cls = sym ? "sym" : "";
    if (k < s.i) cls += " done";
    if (k === s.i) cls += s.bad ? " bad" : " cur";
    h += cls.trim() ? `<span class="${cls.trim()}">${esc(c)}</span>` : esc(c);
  }
  return `<div class="l9-text">${h || "<span class='meta'>(empty text)</span>"}</div>`;
}

const BAL_PRESETS = ["( { [ ] } )", "{ ( ] [ ] ) }", "( ) [ [ ] { }", "( ) { ( [ ] ) } ]", "( [ ) ]", "[ ( ) ] { ( } )",
  "int sum = 0;\nfor (int i = 0; i < n; i++) {\n    sum += array[i];\n}\nreturn sum;"];

function demoBalanced(el, { mini = false } = {}) {
  let text = BAL_PRESETS[0];
  stepPlayer(el, {
    mini, layout: "side",
    code: CODE.isBalanced,
    build: () => traceBalanced(text),
    render: (s) => `${balancedText(text, s)}<div style="margin-top:10px">${stackCol(s.items, { newTop: s.newTop })}</div>
      <div class="l9-chips" style="margin-top:6px">${s.popped ? `<span class="l9-chip ${s.matched ? "good" : s.bad ? "bad" : "out"}">popped ${esc(s.popped)}</span>` : ""}
      ${s.verdict !== undefined ? `<span class="l9-chip ${s.verdict ? "good" : "bad"}">isBalanced = ${s.verdict}</span>` : ""}</div>`,
    extraControls: `<select class="bl-pre">${BAL_PRESETS.map((p, k) => `<option value="${k}">${k === BAL_PRESETS.length - 1 ? "C code example" : esc(p)}</option>`).join("")}</select>
      <label>text <input type="text" class="bl-t" value="${esc(text)}" style="width:200px"></label>`,
    onMount(root, rebuild) {
      if (mini) return;
      const q = (x) => root.querySelector(x);
      q(".bl-pre").onchange = (e) => { text = BAL_PRESETS[+e.target.value]; q(".bl-t").value = text.replace(/\n/g, " "); rebuild(); };
      q(".bl-t").onchange = (e) => { text = e.target.value.slice(0, 80); rebuild(); };
    },
  });
}

// ---------- Chapter 5: infix -> expression tree -> postfix ----------

function parseInfix(infix) {
  const tokens = infix.replace(/([()+*/-])/g, " $1 ").trim().split(/\s+/);
  let pos = 0, id = 0;
  const mk = (token, left = null, right = null) => ({ token, left, right, id: id++ });
  function expression() {
    let e = term();
    while (pos < tokens.length && (tokens[pos] === "+" || tokens[pos] === "-")) { const op = tokens[pos++]; e = mk(op, e, term()); }
    return e;
  }
  function term() {
    let e = factor();
    while (pos < tokens.length && (tokens[pos] === "*" || tokens[pos] === "/")) { const op = tokens[pos++]; e = mk(op, e, factor()); }
    return e;
  }
  function factor() {
    if (pos >= tokens.length) throw new Error("the expression ends too early");
    const t = tokens[pos++];
    if (t === "(") { const e = expression(); pos++; return e; }
    if ("()+-*/".includes(t)) throw new Error(`an operand was expected, not "${t}"`);
    return mk(t);
  }
  return expression();
}

function infixOf(e, outer = true) {
  if (!e.left) return e.token;
  const s = `${infixOf(e.left, false)} ${e.token} ${infixOf(e.right, false)}`;
  return outer ? s : `(${s})`;
}

function postfixOf(e) { return e.left ? `${postfixOf(e.left)} ${postfixOf(e.right)} ${e.token}` : e.token; }

function buildDerive(infix) {
  const tree = parseInfix(infix);
  const events = [];
  function walk(e) {
    const node = { id: e.id, label: e.token, kids: [] };
    events.push({ type: "enter", id: e.id, line: 2 });
    if (!e.left) {
      events.push({ type: "out", text: `postfix(${e.token}) = "${e.token}"`, line: 3 });
      events.push({ type: "exit", id: e.id, line: 3 });
      return { node, p: e.token };
    }
    const a = walk(e.left); node.kids.push(a.node);
    const b = walk(e.right); node.kids.push(b.node);
    const p = `${a.p} ${b.p} ${e.token}`;
    events.push({ type: "out", text: `postfix(${infixOf(e)}) = "${p}"`, line: 5 });
    events.push({ type: "exit", id: e.id, line: 5 });
    return { node, p };
  }
  return { root: walk(tree).node, events };
}

const INFIX_PRESETS = ["7 / (2 + 3) * 4", "2 * (3 + 2 * 4)", "(6 / 2 - 3) + (4 * 2)", "a / b - c + d * e - a * c", "8 - 3 - 2", "2 + 3 * 4"];

function demoDerive(el) {
  let infix = INFIX_PRESETS[0];
  makeTreePlayer(el, {
    width: 720, rowH: 56, nodeW: 44, fontSize: 14,
    code: CODE.postfixRule,
    outLabel: "returned strings, in order",
    build: () => {
      try { return buildDerive(infix); } catch (err) {
        infix = INFIX_PRESETS[0];
        el.querySelector(".dv-t").value = infix;
        el.querySelector(".dv-err").textContent = `Could not parse that (${err.message}); back to the first example.`;
        return buildDerive(infix);
      }
    },
    stats: (s) => [["calls so far", s.calls], ["stack depth", s.stack.length], ["postfix", postfixOf(parseInfix(infix))]],
    extraControls: `<select class="dv-pre">${INFIX_PRESETS.map((p) => `<option>${esc(p)}</option>`).join("")}</select>
      <label>infix <input type="text" class="dv-t" value="${esc(infix)}" style="width:190px"></label><span class="dv-err meta" style="color:var(--red)"></span>`,
    onMount(root, rebuild) {
      root.querySelector(".dv-pre").onchange = (e) => { infix = e.target.value; root.querySelector(".dv-t").value = infix; root.querySelector(".dv-err").textContent = ""; rebuild(); };
      root.querySelector(".dv-t").onchange = (e) => { infix = e.target.value.slice(0, 60); root.querySelector(".dv-err").textContent = ""; rebuild(); };
    },
  });
}

// ---------- Chapter 5: evaluating postfix ----------

// Java int arithmetic: wrap to 32 bits, integer division rounds towards zero.
function applyInt(op, l, r) {
  if (op === "+") return (l + r) | 0;
  if (op === "-") return (l - r) | 0;
  if (op === "*") return Math.imul(l, r);
  if (r === 0) throw new Error("ArithmeticException: / by zero");
  return Math.trunc(l / r) | 0;
}

function parseJavaInt(t) {
  if (!/^[+-]?\d+$/.test(t)) return null;
  const v = Number(t);
  return v >= -2147483648 && v <= 2147483647 ? v : null;
}

function traceEval(expr) {
  const tokens = expr.trim().split(/\s+/);
  const st = [], snaps = [];
  const s = (i, line, msg, extra = {}) => snaps.push({ i, line, msg, items: st.slice(), ...extra });
  s(-1, 2, "Start with an empty stack and scan the tokens from left to right.");
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (["+", "-", "*", "/"].includes(t)) {
      const right = st.length ? st.pop() : null;
      s(i, 5, `Operator <code>${t}</code>: pop the <b>right</b> operand: ${right === null ? "<code>null</code> (empty stack)" : right}.`, { right });
      const left = st.length ? st.pop() : null;
      s(i, 6, `Pop the <b>left</b> operand: ${left === null ? "<code>null</code>" : left}.`, { right, left });
      if (left === null) {
        s(i, 8, `Not enough operands for <code>${t}</code>: <code>IllegalArgumentException: missing operand for ${t}</code>.`, { msgCls: "bad", bad: true, err: true });
        return snaps;
      }
      let r;
      try { r = applyInt(t, left, right); } catch (err) {
        s(i, 10, `${left} ${t} ${right}: <code>${err.message}</code>.`, { msgCls: "bad", bad: true, err: true, right, left });
        return snaps;
      }
      st.push(r);
      s(i, 10, `Push ${left} ${t} ${right} = <b>${r}</b>${t === "/" && left % right ? " (integer division)" : ""}.`, { newTop: true, calc: `${left} ${t} ${right} = ${r}` });
    } else {
      const v = parseJavaInt(t);
      if (v === null) {
        s(i, 12, `<code>Integer.parseInt("${esc(t)}")</code> fails: <code>NumberFormatException</code>. This evaluator only takes integers.`, { msgCls: "bad", bad: true, err: true });
        return snaps;
      }
      st.push(v);
      s(i, 12, `Operand ${v}: push it.`, { newTop: true });
    }
  }
  const result = st.length ? st.pop() : null;
  s(tokens.length, 15, `End of the expression: pop the result, ${result === null ? "<code>null</code>" : result}.`, { result });
  if (result === null || st.length) {
    s(tokens.length, 17, `${result === null ? "Nothing was on the stack" : `${st.length} value${st.length > 1 ? "s are" : " is"} still on the stack`}: <code>IllegalArgumentException: not a single expression</code>.`, { msgCls: "bad", err: true, result });
    return snaps;
  }
  s(tokens.length, 19, `The stack is empty again: return <b>${result}</b>.`, { msgCls: "good", result, done: true });
  return snaps;
}

const EVAL_PRESETS = ["6 2 / 3 - 4 2 * +", "2 3 2 4 * + *", "7 2 3 + / 4 *", "5 1 2 + 4 * + 3 -", "8 2 -", "3 +", "3 4", "4 0 /"];

function demoEval(el, { mini = false } = {}) {
  let expr = EVAL_PRESETS[0];
  stepPlayer(el, {
    mini, layout: "side",
    code: CODE.evaluate,
    build: () => traceEval(expr),
    render: (s) => {
      const toks = expr.trim().split(/\s+/);
      return `<div class="l9-toks">${toks.map((t, k) => `<span class="l9-tok ${k < s.i ? "done" : ""} ${k === s.i ? (s.bad ? "bad" : "cur") : ""}">${esc(t)}</span>`).join("")}</div>
        <div style="margin-top:10px">${stackCol(s.items, { newTop: s.newTop })}</div>
        <div class="l9-chips" style="margin-top:6px">${s.right !== undefined ? `<span class="l9-chip out">right = ${s.right}</span>` : ""}${s.left !== undefined ? `<span class="l9-chip out">left = ${s.left}</span>` : ""}
        ${s.calc ? `<span class="l9-chip good">${s.calc}</span>` : ""}${s.done ? `<span class="l9-chip good">result ${s.result}</span>` : ""}${s.err ? `<span class="l9-chip bad">exception</span>` : ""}</div>`;
    },
    extraControls: `<select class="ev-pre">${EVAL_PRESETS.map((p) => `<option>${esc(p)}</option>`).join("")}</select>
      <label>postfix <input type="text" class="ev-t" value="${esc(expr)}" style="width:190px"></label>`,
    onMount(root, rebuild) {
      if (mini) return;
      root.querySelector(".ev-pre").onchange = (e) => { expr = e.target.value; root.querySelector(".ev-t").value = expr; rebuild(); };
      root.querySelector(".ev-t").onchange = (e) => { expr = e.target.value.trim().slice(0, 80) || EVAL_PRESETS[0]; e.target.value = expr; rebuild(); };
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
  lifo: (el) => demoLifo(el),
  lifoMini: (el) => demoLifo(el, { mini: true }),
  callStack: (el) => demoCallStack(el),
  linked: (el) => demoLinked(el),
  linkedMini: (el) => demoLinked(el, { mini: true }),
  array: (el) => demoArray(el),
  arrayMini: (el) => demoArray(el, { mini: true }),
  growth: (el) => demoGrowth(el),
  balanced: (el) => demoBalanced(el),
  balancedMini: (el) => demoBalanced(el, { mini: true }),
  derive: (el) => demoDerive(el),
  evalPostfix: (el) => demoEval(el),
  evalMini: (el) => demoEval(el, { mini: true }),
  quiz: (el) => demoQuiz(el, QUIZ),
};
