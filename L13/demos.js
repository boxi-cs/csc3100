// Interactive demos for Lecture 13. CODE and OUT are generated from notes/L13-trees.md (checked by
// tools/check.py); the JS twins below replay what the Java does, step by step.
// ---- generated from notes/L13-trees.md: code panels and real outputs (do not edit by hand) ----
const CODE = {
 "TreeNode": "import java.util.ArrayList;\nimport java.util.List;\n\nclass TreeNode {\n    String element;\n    TreeNode parent;                       // null for the root\n    List<TreeNode> children = new ArrayList<>();\n\n    TreeNode(String element) {\n        this.element = element;\n    }\n\n    TreeNode addChild(String element) {\n        TreeNode child = new TreeNode(element);\n        child.parent = this;\n        children.add(child);\n        return child;\n    }\n\n    boolean isLeaf() {\n        return children.isEmpty();\n    }\n\n    int depth() {                          // edges on the path up to the root\n        return parent == null ? 0 : 1 + parent.depth();\n    }\n\n    int height() {                         // edges on the longest path down to a leaf\n        int h = 0;\n        for (TreeNode c : children) {\n            h = Math.max(h, 1 + c.height());\n        }\n        return h;\n    }\n\n    int size() {                           // number of nodes in this subtree\n        int n = 1;\n        for (TreeNode c : children) {\n            n += c.size();\n        }\n        return n;\n    }\n\n    List<String> pathFromRoot() {\n        List<String> path = parent == null ? new ArrayList<>() : parent.pathFromRoot();\n        path.add(element);\n        return path;\n    }\n}",
 "TreeTerms": "public class TreeTerms {\n    static void describe(TreeNode v) {\n        System.out.printf(\"%-9s depth %d  height %d  %-8s path %s%n\", v.element, v.depth(),\n                v.height(), v.isLeaf() ? \"leaf\" : \"internal\", v.pathFromRoot());\n        for (TreeNode c : v.children) {\n            describe(c);\n        }\n    }\n\n    static int edges(TreeNode v) {\n        int e = v.children.size();\n        for (TreeNode c : v.children) {\n            e += edges(c);\n        }\n        return e;\n    }\n\n    public static void main(String[] args) {\n        TreeNode organism = new TreeNode(\"Organism\");\n        organism.addChild(\"Plant\");\n        TreeNode animal = organism.addChild(\"Animal\");\n        animal.addChild(\"Mammal\");\n        animal.addChild(\"Fish\");\n        describe(organism);\n        System.out.println(organism.size() + \" nodes, \" + edges(organism) + \" edges\");\n\n        TreeNode a = new TreeNode(\"A\");\n        TreeNode b = a.addChild(\"B\");\n        TreeNode c = a.addChild(\"C\");\n        b.addChild(\"D\");\n        b.addChild(\"E\");\n        TreeNode g = c.addChild(\"F\").addChild(\"G\");\n        g.addChild(\"H\");\n        g.addChild(\"I\");\n        System.out.println();\n        describe(a);\n        System.out.println(\"height of the tree = \" + a.height());\n    }\n}",
 "BinaryNode": "class BinaryNode<E> {\n    E element;\n    BinaryNode<E> parent;\n    BinaryNode<E> leftChild;\n    BinaryNode<E> rightChild;\n\n    BinaryNode(E element) {\n        this.element = element;\n    }\n}",
 "BinaryTree": "class BinaryTree {\n    static <E> BinaryNode<E> create() {\n        return null;\n    }\n\n    static <E> boolean isEmpty(BinaryNode<E> t) {\n        return t == null;\n    }\n\n    static <E> BinaryNode<E> makeBT(BinaryNode<E> t1, E element, BinaryNode<E> t2) {\n        BinaryNode<E> rootNode = new BinaryNode<>(element);\n        rootNode.parent = null;\n        rootNode.leftChild = t1;\n        rootNode.rightChild = t2;\n        if (t1 != null) {\n            t1.parent = rootNode;\n        }\n        if (t2 != null) {\n            t2.parent = rootNode;\n        }\n        return rootNode;\n    }\n\n    static <E> BinaryNode<E> leftChild(BinaryNode<E> t) {\n        if (t == null) {\n            throw new IllegalStateException(\"empty tree\");\n        }\n        return t.leftChild;\n    }\n\n    static <E> BinaryNode<E> rightChild(BinaryNode<E> t) {\n        if (t == null) {\n            throw new IllegalStateException(\"empty tree\");\n        }\n        return t.rightChild;\n    }\n\n    static <E> E data(BinaryNode<E> t) {\n        if (t == null) {\n            throw new IllegalStateException(\"empty tree\");\n        }\n        return t.element;\n    }\n\n    // Helpers used later in these notes.\n    static <E> BinaryNode<E> leaf(E element) {\n        return makeBT(null, element, null);\n    }\n\n    static int size(BinaryNode<?> t) {\n        return t == null ? 0 : 1 + size(t.leftChild) + size(t.rightChild);\n    }\n\n    static int height(BinaryNode<?> t) {           // the empty tree has height -1\n        return t == null ? -1 : 1 + Math.max(height(t.leftChild), height(t.rightChild));\n    }\n\n    static boolean isFull(BinaryNode<?> t) {\n        if (t == null) {\n            return true;\n        }\n        if ((t.leftChild == null) != (t.rightChild == null)) {\n            return false;                          // exactly one child\n        }\n        return isFull(t.leftChild) && isFull(t.rightChild);\n    }\n}",
 "MakeBTDemo": "public class MakeBTDemo {\n    public static void main(String[] args) {\n        BinaryNode<String> e = BinaryTree.leaf(\"E\");\n        BinaryNode<String> b = BinaryTree.makeBT(e, \"B\", null);\n        BinaryNode<String> d = BinaryTree.makeBT(null, \"D\", BinaryTree.leaf(\"I\"));\n        BinaryNode<String> t = BinaryTree.makeBT(b, \"A\", d);\n\n        System.out.println(\"root: \" + BinaryTree.data(t));\n        System.out.println(\"left child of the root: \" + BinaryTree.data(BinaryTree.leftChild(t)));\n        System.out.println(\"right child of D: \" + BinaryTree.data(BinaryTree.rightChild(d)));\n        System.out.println(\"parent of E: \" + e.parent.element + \", grandparent: \" + e.parent.parent.element);\n        System.out.println(\"size \" + BinaryTree.size(t) + \", height \" + BinaryTree.height(t));\n        System.out.println(\"right subtree of B is empty: \" + BinaryTree.isEmpty(BinaryTree.rightChild(b)));\n\n        BinaryNode<String> empty = BinaryTree.create();\n        try {\n            BinaryTree.data(empty);\n        } catch (IllegalStateException ex) {\n            System.out.println(\"data(empty tree): \" + ex.getMessage());\n        }\n    }\n}",
 "TreeText": "class TreeText {\n    private final String text;\n    private int pos = 0;\n\n    private TreeText(String text) {\n        this.text = text.replace(\" \", \"\");\n    }\n\n    // tree = \"\" | label | label \"(\" tree \",\" tree \")\"\n    static BinaryNode<String> parse(String text) {\n        TreeText p = new TreeText(text);\n        BinaryNode<String> t = p.tree();\n        if (p.pos != p.text.length()) {\n            throw new IllegalArgumentException(\"unexpected '\" + p.text.charAt(p.pos) + \"'\");\n        }\n        return t;\n    }\n\n    private BinaryNode<String> tree() {\n        int start = pos;\n        while (pos < text.length() && \"(),\".indexOf(text.charAt(pos)) < 0) {\n            pos++;\n        }\n        if (pos == start) {\n            return null;                                // empty subtree\n        }\n        String label = text.substring(start, pos);\n        BinaryNode<String> left = null;\n        BinaryNode<String> right = null;\n        if (pos < text.length() && text.charAt(pos) == '(') {\n            pos++;\n            left = tree();\n            expect(',');\n            right = tree();\n            expect(')');\n        }\n        return BinaryTree.makeBT(left, label, right);\n    }\n\n    private void expect(char c) {\n        if (pos >= text.length() || text.charAt(pos) != c) {\n            throw new IllegalArgumentException(\"expected '\" + c + \"' at position \" + pos);\n        }\n        pos++;\n    }\n\n    static String format(BinaryNode<?> t) {\n        if (t == null) {\n            return \"\";\n        }\n        if (t.leftChild == null && t.rightChild == null) {\n            return String.valueOf(t.element);\n        }\n        return t.element + \"(\" + format(t.leftChild) + \",\" + format(t.rightChild) + \")\";\n    }\n}",
 "TreeTextDemo": "public class TreeTextDemo {\n    public static void main(String[] args) {\n        BinaryNode<String> t = TreeText.parse(\"A(B(E,),D(,I))\");\n        System.out.println(TreeText.format(t));\n        System.out.println(\"left child of B: \" + t.leftChild.leftChild.element);\n        System.out.println(\"size \" + BinaryTree.size(t) + \", height \" + BinaryTree.height(t)\n                + \", full \" + BinaryTree.isFull(t));\n    }\n}",
 "ArrayTree": "class ArrayTree {\n    static int parent(int i) {\n        return i / 2;\n    }\n\n    static int left(int i) {\n        return 2 * i;\n    }\n\n    static int right(int i) {\n        return 2 * i + 1;\n    }\n\n    // The largest ID used by the subtree t whose root has ID id (0 if t is empty).\n    static int maxId(BinaryNode<?> t, int id) {\n        if (t == null) {\n            return 0;\n        }\n        return Math.max(id, Math.max(maxId(t.leftChild, left(id)), maxId(t.rightChild, right(id))));\n    }\n\n    // a[i] holds the element of the node with ID i; a[0] and missing nodes are null.\n    static String[] toArray(BinaryNode<String> root) {\n        String[] a = new String[maxId(root, 1) + 1];\n        fill(root, 1, a);\n        return a;\n    }\n\n    private static void fill(BinaryNode<String> t, int id, String[] a) {\n        if (t != null) {\n            a[id] = t.element;\n            fill(t.leftChild, left(id), a);\n            fill(t.rightChild, right(id), a);\n        }\n    }\n\n    static BinaryNode<String> fromArray(String[] a, int id) {\n        if (id >= a.length || a[id] == null) {\n            return null;\n        }\n        return BinaryTree.makeBT(fromArray(a, left(id)), a[id], fromArray(a, right(id)));\n    }\n\n    static String show(String[] a) {\n        StringBuilder sb = new StringBuilder();\n        for (int i = 1; i < a.length; i++) {\n            sb.append(i == 1 ? \"\" : \" \").append(\"[\").append(i).append(\"]\")\n              .append(a[i] == null ? \"-\" : a[i]);\n        }\n        return sb.toString();\n    }\n\n    // Complete means: the n nodes use exactly the IDs 1..n.\n    static boolean isComplete(BinaryNode<?> t) {\n        return maxId(t, 1) == BinaryTree.size(t);\n    }\n}",
 "ArrayDemo": "public class ArrayDemo {\n    public static void main(String[] args) {\n        String[] complete = ArrayTree.toArray(TreeText.parse(\"A(B(D,E),C)\"));\n        System.out.println(ArrayTree.show(complete));\n        System.out.println(\"parent of 5: \" + complete[ArrayTree.parent(5)]\n                + \", children of 2: \" + complete[ArrayTree.left(2)] + \" \" + complete[ArrayTree.right(2)]);\n\n        String[] gaps = ArrayTree.toArray(TreeText.parse(\"A(B(E(K,L),),D(H,I))\"));\n        System.out.println(ArrayTree.show(gaps));\n\n        BinaryNode<String> back = ArrayTree.fromArray(gaps, 1);\n        System.out.println(\"rebuilt: \" + TreeText.format(back));\n    }\n}",
 "ArrayPractice": "public class ArrayPractice {\n    public static void main(String[] args) {\n        System.out.println(\"T1: \" + ArrayTree.show(ArrayTree.toArray(TreeText.parse(\"A(B(C,),)\"))));\n        System.out.println(\"T2: \" + ArrayTree.show(ArrayTree.toArray(TreeText.parse(\"A(B(,D),C(,E))\"))));\n    }\n}",
 "Skewed": "public class Skewed {\n    public static void main(String[] args) {\n        String chain = \"\";\n        for (int n = 1; n <= 6; n++) {\n            chain = n == 1 ? \"N\" : \"N(,\" + chain + \")\";      // add a new root above the chain\n            BinaryNode<String> t = TreeText.parse(chain);\n            System.out.println(n + \" nodes need \" + (ArrayTree.maxId(t, 1)) + \" slots\");\n        }\n    }\n}",
 "ShapeCheck": "public class ShapeCheck {\n    public static void main(String[] args) {\n        String[] trees = {\"1(2(6,4),3(,5))\", \"1(2,3(6,4))\", \"1(2(6,),3)\", \"1(2(6,4),3)\"};\n        for (String s : trees) {\n            BinaryNode<String> t = TreeText.parse(s);\n            System.out.printf(\"%-16s n=%d  maxId=%-2d full=%-5b complete=%b%n\", s, BinaryTree.size(t),\n                    ArrayTree.maxId(t, 1), BinaryTree.isFull(t), ArrayTree.isComplete(t));\n        }\n    }\n}",
 "Traversals": "import java.util.ArrayList;\nimport java.util.List;\n\nclass Traversals {\n    static <E> void preorder(BinaryNode<E> x, List<E> visited) {\n        if (x != null) {\n            visited.add(x.element);                 // visit the node\n            preorder(x.leftChild, visited);\n            preorder(x.rightChild, visited);\n        }\n    }\n\n    static <E> void inorder(BinaryNode<E> x, List<E> visited) {\n        if (x != null) {\n            inorder(x.leftChild, visited);\n            visited.add(x.element);                 // visit the node\n            inorder(x.rightChild, visited);\n        }\n    }\n\n    static <E> void postorder(BinaryNode<E> x, List<E> visited) {\n        if (x != null) {\n            postorder(x.leftChild, visited);\n            postorder(x.rightChild, visited);\n            visited.add(x.element);                 // visit the node\n        }\n    }\n\n    static <E> List<E> preorder(BinaryNode<E> root) {\n        List<E> visited = new ArrayList<>();\n        preorder(root, visited);\n        return visited;\n    }\n\n    static <E> List<E> inorder(BinaryNode<E> root) {\n        List<E> visited = new ArrayList<>();\n        inorder(root, visited);\n        return visited;\n    }\n\n    static <E> List<E> postorder(BinaryNode<E> root) {\n        List<E> visited = new ArrayList<>();\n        postorder(root, visited);\n        return visited;\n    }\n}",
 "TraversalDemo": "public class TraversalDemo {\n    public static void main(String[] args) {\n        BinaryNode<String> t = TreeText.parse(\"8(3(2,5),7(,9))\");\n        System.out.println(\"preorder  \" + Traversals.preorder(t));\n        System.out.println(\"inorder   \" + Traversals.inorder(t));\n        System.out.println(\"postorder \" + Traversals.postorder(t));\n\n        BinaryNode<String> s = TreeText.parse(\"A(B(D,),C(E(,G),F(H,I)))\");\n        System.out.println(\"preorder  \" + Traversals.preorder(s));\n    }\n}",
 "CountCalls": "public class CountCalls {\n    static int calls = 0;\n\n    static void preorderCounting(BinaryNode<String> x) {\n        calls++;\n        if (x != null) {\n            preorderCounting(x.leftChild);\n            preorderCounting(x.rightChild);\n        }\n    }\n\n    public static void main(String[] args) {\n        for (String s : new String[] {\"8(3(2,5),7(,9))\", \"A(B(D,),C(E(,G),F(H,I)))\", \"A\"}) {\n            calls = 0;\n            BinaryNode<String> t = TreeText.parse(s);\n            preorderCounting(t);\n            System.out.println(BinaryTree.size(t) + \" nodes: \" + calls + \" calls\");\n        }\n    }\n}",
 "TraversalExercise": "public class TraversalExercise {\n    public static void main(String[] args) {\n        BinaryNode<String> t = TreeText.parse(\"3(9,20(15,7))\");\n        System.out.println(\"preorder  = \" + Traversals.preorder(t));\n        System.out.println(\"inorder   = \" + Traversals.inorder(t));\n        System.out.println(\"postorder = \" + Traversals.postorder(t));\n    }\n}",
 "ExpressionTree": "public class ExpressionTree {\n    public static void main(String[] args) {\n        BinaryNode<String> t = TreeText.parse(\"+(-(/(+(A,B),*(C,D)),*(E,-(F,G))),H)\");\n        System.out.println(\"preorder  \" + String.join(\"\", Traversals.preorder(t)));\n        System.out.println(\"inorder   \" + String.join(\"\", Traversals.inorder(t)));\n        System.out.println(\"postorder \" + String.join(\"\", Traversals.postorder(t)));\n    }\n}",
 "PostfixTable": "public class PostfixTable {\n    public static void main(String[] args) {\n        // ((a / b) - c + (d * e)) - (a * c)\n        BinaryNode<String> t = TreeText.parse(\"-(+(-(/(a,b),c),*(d,e)),*(a,c))\");\n        System.out.println(String.join(\" \", Traversals.postorder(t)));\n    }\n}",
 "Expressions": "import java.util.ArrayList;\nimport java.util.List;\n\nclass Expressions {\n    static int apply(String op, int left, int right) {\n        switch (op) {\n            case \"+\": return left + right;\n            case \"-\": return left - right;\n            case \"*\": return left * right;\n            case \"/\": return left / right;\n            default: throw new IllegalArgumentException(\"unknown operator \" + op);\n        }\n    }\n\n    static boolean isOperator(String token) {\n        return token.equals(\"+\") || token.equals(\"-\") || token.equals(\"*\") || token.equals(\"/\");\n    }\n\n    // Evaluate a postfix expression whose tokens are separated by spaces.\n    static int evalPostfix(String postfix, boolean trace) {\n        List<Integer> stack = new ArrayList<>();          // the top is the last element\n        for (String token : postfix.trim().split(\"\\\\s+\")) {\n            if (isOperator(token)) {\n                int right = stack.remove(stack.size() - 1);\n                int left = stack.remove(stack.size() - 1);\n                int result = apply(token, left, right);\n                stack.add(result);\n                if (trace) {\n                    System.out.printf(\"%-3s %d %s %d = %-4d stack %s%n\", token, left, token, right, result, stack);\n                }\n            } else {\n                stack.add(Integer.parseInt(token));\n                if (trace) {\n                    System.out.printf(\"%-3s push %-9s stack %s%n\", token, token, stack);\n                }\n            }\n        }\n        if (stack.size() != 1) {\n            throw new IllegalArgumentException(\"not a valid postfix expression\");\n        }\n        return stack.get(0);\n    }\n\n    // Evaluate an expression tree: postorder (operands first, then the operator).\n    static int evaluate(BinaryNode<String> t) {\n        if (t.leftChild == null && t.rightChild == null) {\n            return Integer.parseInt(t.element);\n        }\n        int left = evaluate(t.leftChild);\n        int right = evaluate(t.rightChild);\n        return apply(t.element, left, right);\n    }\n\n    // Fully parenthesised infix: inorder, with brackets around every operator node.\n    static String infix(BinaryNode<String> t) {\n        if (t.leftChild == null && t.rightChild == null) {\n            return t.element;\n        }\n        return \"(\" + infix(t.leftChild) + \" \" + t.element + \" \" + infix(t.rightChild) + \")\";\n    }\n}",
 "PostfixTrace": "public class PostfixTrace {\n    public static void main(String[] args) {\n        int value = Expressions.evalPostfix(\"2 3 2 4 * + *\", true);\n        System.out.println(\"value = \" + value);\n    }\n}",
 "EvaluateTree": "public class EvaluateTree {\n    public static void main(String[] args) {\n        BinaryNode<String> t = TreeText.parse(\"*(2,+(3,*(2,4)))\");\n        System.out.println(Expressions.infix(t) + \" = \" + Expressions.evaluate(t));\n        String postfix = String.join(\" \", Traversals.postorder(t));\n        System.out.println(\"postfix \" + postfix + \" = \" + Expressions.evalPostfix(postfix, false));\n\n        BinaryNode<String> big = TreeText.parse(\"+(-(/(+(A,B),*(C,D)),*(E,-(F,G))),H)\");\n        System.out.println(Expressions.infix(big));\n    }\n}",
 "Rebuild": "import java.util.ArrayList;\nimport java.util.HashMap;\nimport java.util.List;\nimport java.util.Map;\n\nclass Rebuild {\n    private static <E> Map<E, Integer> positions(List<E> inorder) {\n        Map<E, Integer> where = new HashMap<>();\n        for (int k = 0; k < inorder.size(); k++) {\n            if (where.put(inorder.get(k), k) != null) {\n                throw new IllegalArgumentException(\"duplicate value \" + inorder.get(k));\n            }\n        }\n        return where;\n    }\n\n    static <E> BinaryNode<E> fromPreIn(List<E> preorder, List<E> inorder) {\n        if (preorder.size() != inorder.size()) {\n            throw new IllegalArgumentException(\"the sequences have different lengths\");\n        }\n        return preIn(preorder, 0, 0, inorder.size(), positions(inorder));\n    }\n\n    // The subtree whose preorder is preorder[p .. p+n-1] and inorder is inorder[i .. i+n-1].\n    private static <E> BinaryNode<E> preIn(List<E> preorder, int p, int i, int n, Map<E, Integer> where) {\n        if (n == 0) {\n            return null;\n        }\n        E rootValue = preorder.get(p);                       // the first in preorder is the root\n        Integer r = where.get(rootValue);\n        if (r == null || r < i || r >= i + n) {\n            throw new IllegalArgumentException(\"no such tree (\" + rootValue + \")\");\n        }\n        int leftSize = r - i;                                // nodes left of the root in inorder\n        BinaryNode<E> left = preIn(preorder, p + 1, i, leftSize, where);\n        BinaryNode<E> right = preIn(preorder, p + 1 + leftSize, r + 1, n - 1 - leftSize, where);\n        return BinaryTree.makeBT(left, rootValue, right);\n    }\n\n    static <E> BinaryNode<E> fromInPost(List<E> inorder, List<E> postorder) {\n        if (postorder.size() != inorder.size()) {\n            throw new IllegalArgumentException(\"the sequences have different lengths\");\n        }\n        return inPost(postorder, 0, 0, inorder.size(), positions(inorder));\n    }\n\n    // The subtree whose postorder is postorder[q .. q+n-1] and inorder is inorder[i .. i+n-1].\n    private static <E> BinaryNode<E> inPost(List<E> postorder, int q, int i, int n, Map<E, Integer> where) {\n        if (n == 0) {\n            return null;\n        }\n        E rootValue = postorder.get(q + n - 1);              // the last in postorder is the root\n        Integer r = where.get(rootValue);\n        if (r == null || r < i || r >= i + n) {\n            throw new IllegalArgumentException(\"no such tree (\" + rootValue + \")\");\n        }\n        int leftSize = r - i;\n        BinaryNode<E> left = inPost(postorder, q, i, leftSize, where);\n        BinaryNode<E> right = inPost(postorder, q + leftSize, r + 1, n - 1 - leftSize, where);\n        return BinaryTree.makeBT(left, rootValue, right);\n    }\n\n    static List<String> letters(String s) {                  // \"A B C\" or \"ABC\" -> [A, B, C]\n        List<String> out = new ArrayList<>();\n        for (char c : s.replace(\" \", \"\").toCharArray()) {\n            out.add(String.valueOf(c));\n        }\n        return out;\n    }\n}",
 "RebuildDemo": "import java.util.List;\n\npublic class RebuildDemo {\n    public static void main(String[] args) {\n        BinaryNode<String> t = Rebuild.fromPreIn(Rebuild.letters(\"ABCDEXZUTY\"), Rebuild.letters(\"DCEBAUZTXY\"));\n        System.out.println(TreeText.format(t));\n        System.out.println(\"postorder \" + String.join(\"\", Traversals.postorder(t)));\n\n        BinaryNode<Integer> u = Rebuild.fromPreIn(List.of(3, 9, 20, 15, 7), List.of(9, 3, 15, 20, 7));\n        System.out.println(TreeText.format(u));\n\n        BinaryNode<String> w = Rebuild.fromInPost(Rebuild.letters(\"DCEBAUZTXY\"), Rebuild.letters(\"DECBUTZYXA\"));\n        System.out.println(TreeText.format(w));\n    }\n}",
 "PrePostAmbiguity": "import java.util.ArrayList;\nimport java.util.List;\n\npublic class PrePostAmbiguity {\n    // Every binary tree whose preorder is pre[p .. p+n-1].\n    static List<BinaryNode<String>> treesWithPreorder(List<String> pre, int p, int n) {\n        List<BinaryNode<String>> result = new ArrayList<>();\n        if (n == 0) {\n            result.add(null);\n            return result;\n        }\n        for (int k = 0; k < n; k++) {                      // k nodes in the left subtree\n            for (BinaryNode<String> left : treesWithPreorder(pre, p + 1, k)) {\n                for (BinaryNode<String> right : treesWithPreorder(pre, p + 1 + k, n - 1 - k)) {\n                    result.add(BinaryTree.makeBT(copy(left), pre.get(p), copy(right)));\n                }\n            }\n        }\n        return result;\n    }\n\n    static BinaryNode<String> copy(BinaryNode<String> t) {   // makeBT re-parents, so copy shared subtrees\n        return t == null ? null : BinaryTree.makeBT(copy(t.leftChild), t.element, copy(t.rightChild));\n    }\n\n    public static void main(String[] args) {\n        List<String> pre = Rebuild.letters(\"ABC\");\n        List<BinaryNode<String>> all = treesWithPreorder(pre, 0, pre.size());\n        System.out.println(all.size() + \" binary trees have preorder ABC\");\n        for (BinaryNode<String> t : all) {\n            if (String.join(\"\", Traversals.postorder(t)).equals(\"CBA\")) {\n                System.out.println(\"  postorder CBA: \" + TreeText.format(t));\n            }\n        }\n    }\n}",
 "Duplicates": "import java.util.List;\n\npublic class Duplicates {\n    public static void main(String[] args) {\n        try {\n            Rebuild.fromPreIn(List.of(1, 1), List.of(1, 1));\n        } catch (IllegalArgumentException e) {\n            System.out.println(\"refused: \" + e.getMessage());\n        }\n        try {\n            Rebuild.fromPreIn(Rebuild.letters(\"ABC\"), Rebuild.letters(\"CAD\"));\n        } catch (IllegalArgumentException e) {\n            System.out.println(\"refused: \" + e.getMessage());\n        }\n    }\n}",
 "CheckAnswers": "public class CheckAnswers {\n    public static void main(String[] args) {\n        BinaryNode<String> t = TreeText.parse(\"A(B(D,E),C(,F(G(H,I),)))\");\n        System.out.println(\"height of C: \" + BinaryTree.height(t.rightChild));\n        BinaryNode<String> s = TreeText.parse(\"1(2(4,5),3(6,))\");\n        System.out.println(\"full \" + BinaryTree.isFull(s) + \", complete \" + ArrayTree.isComplete(s));\n        System.out.println(\"value \" + Expressions.evalPostfix(\"5 1 2 + 4 * + 3 -\", false));\n    }\n}",
 "Exercise1": "public class Exercise1 {\n    public static void main(String[] args) {\n        BinaryNode<String> t = TreeText.parse(\"A(B(C(D,E),),X(Z(U,T),Y))\");\n        System.out.println(\"preorder  \" + String.join(\" \", Traversals.preorder(t)));\n        System.out.println(\"inorder   \" + String.join(\" \", Traversals.inorder(t)));\n        System.out.println(\"postorder \" + String.join(\" \", Traversals.postorder(t)));\n    }\n}",
 "Exercise2": "public class Exercise2 {\n    public static void main(String[] args) {\n        BinaryNode<String> t = TreeText.parse(\"1(2(,4(8,)),3(5,))\");\n        System.out.println(ArrayTree.show(ArrayTree.toArray(t)));\n        System.out.println(\"complete \" + ArrayTree.isComplete(t));\n    }\n}",
 "Exercise3": "import java.util.List;\n\npublic class Exercise3 {\n    public static void main(String[] args) {\n        BinaryNode<Integer> t = Rebuild.fromInPost(List.of(4, 2, 5, 1, 6, 3), List.of(4, 5, 2, 6, 3, 1));\n        System.out.println(TreeText.format(t) + \"  preorder \" + Traversals.preorder(t));\n    }\n}",
 "Exercise4": "public class Exercise4 {\n    static int countLeaves(BinaryNode<?> t) {\n        if (t == null) {\n            return 0;\n        }\n        if (t.leftChild == null && t.rightChild == null) {\n            return 1;\n        }\n        return countLeaves(t.leftChild) + countLeaves(t.rightChild);\n    }\n\n    public static void main(String[] args) {\n        for (String s : new String[] {\"1(2(6,4),3(,5))\", \"1(2,3(6,4))\", \"1(2(6,),3)\", \"1(2(6,4),3)\"}) {\n            BinaryNode<String> t = TreeText.parse(s);\n            int leaves = countLeaves(t);\n            System.out.println(s + \": \" + leaves + \" leaves, \" + (BinaryTree.size(t) - leaves) + \" internal\");\n        }\n    }\n}",
 "Exercise5": "public class Exercise5 {\n    static <E> BinaryNode<E> mirror(BinaryNode<E> t) {\n        if (t == null) {\n            return null;\n        }\n        return BinaryTree.makeBT(mirror(t.rightChild), t.element, mirror(t.leftChild));\n    }\n\n    public static void main(String[] args) {\n        BinaryNode<String> t = TreeText.parse(\"8(3(2,5),7(,9))\");\n        BinaryNode<String> m = mirror(t);\n        System.out.println(TreeText.format(m));\n        System.out.println(\"preorder of mirror \" + Traversals.preorder(m));\n        System.out.println(\"postorder of t     \" + Traversals.postorder(t));\n    }\n}",
 "Exercise6": "public class Exercise6 {\n    static <E> int depthOf(BinaryNode<E> t, E x) {\n        if (t == null) {\n            return -1;\n        }\n        if (t.element.equals(x)) {\n            return 0;\n        }\n        int d = depthOf(t.leftChild, x);\n        if (d < 0) {\n            d = depthOf(t.rightChild, x);\n        }\n        return d < 0 ? -1 : d + 1;\n    }\n\n    public static void main(String[] args) {\n        BinaryNode<String> t = TreeText.parse(\"A(B(D,E),C(,F(G(H,I),)))\");\n        for (String x : new String[] {\"A\", \"E\", \"H\", \"Q\"}) {\n            System.out.println(x + \": \" + depthOf(t, x));\n        }\n    }\n}",
 "Exercise7": "import java.util.ArrayDeque;\nimport java.util.ArrayList;\nimport java.util.List;\nimport java.util.Queue;\n\npublic class Exercise7 {\n    static <E> List<E> levelOrder(BinaryNode<E> root) {\n        List<E> visited = new ArrayList<>();\n        Queue<BinaryNode<E>> queue = new ArrayDeque<>();\n        if (root != null) {\n            queue.add(root);\n        }\n        while (!queue.isEmpty()) {\n            BinaryNode<E> x = queue.remove();\n            visited.add(x.element);\n            if (x.leftChild != null) {\n                queue.add(x.leftChild);\n            }\n            if (x.rightChild != null) {\n                queue.add(x.rightChild);\n            }\n        }\n        return visited;\n    }\n\n    public static void main(String[] args) {\n        System.out.println(levelOrder(TreeText.parse(\"8(3(2,5),7(,9))\")));\n        System.out.println(levelOrder(TreeText.parse(\"A(B(E(K,L),),D(H,I))\")));\n    }\n}",
 "Exercise8": "import java.util.ArrayList;\nimport java.util.List;\n\npublic class Exercise8 {\n    static BinaryNode<String> fromPostfix(String postfix) {\n        List<BinaryNode<String>> stack = new ArrayList<>();\n        for (String token : postfix.trim().split(\"\\\\s+\")) {\n            if (Expressions.isOperator(token)) {\n                BinaryNode<String> right = stack.remove(stack.size() - 1);\n                BinaryNode<String> left = stack.remove(stack.size() - 1);\n                stack.add(BinaryTree.makeBT(left, token, right));\n            } else {\n                stack.add(BinaryTree.leaf(token));\n            }\n        }\n        return stack.get(0);\n    }\n\n    public static void main(String[] args) {\n        BinaryNode<String> t = fromPostfix(\"A B + C D * / E F G - * - H +\");\n        System.out.println(Expressions.infix(t));\n        System.out.println(TreeText.format(t));\n    }\n}",
 "depthHeight": "int depth() {                          // edges on the path up to the root\n    return parent == null ? 0 : 1 + parent.depth();\n}\n\nint height() {                         // edges on the longest path down to a leaf\n    int h = 0;\n    for (TreeNode c : children) {\n        h = Math.max(h, 1 + c.height());\n    }\n    return h;\n}",
 "makeBT": "static <E> BinaryNode<E> makeBT(BinaryNode<E> t1, E element, BinaryNode<E> t2) {\n    BinaryNode<E> rootNode = new BinaryNode<>(element);\n    rootNode.parent = null;\n    rootNode.leftChild = t1;\n    rootNode.rightChild = t2;\n    if (t1 != null) {\n        t1.parent = rootNode;\n    }\n    if (t2 != null) {\n        t2.parent = rootNode;\n    }\n    return rootNode;\n}",
 "isFull": "static boolean isFull(BinaryNode<?> t) {\n    if (t == null) {\n        return true;\n    }\n    if ((t.leftChild == null) != (t.rightChild == null)) {\n        return false;                          // exactly one child\n    }\n    return isFull(t.leftChild) && isFull(t.rightChild);\n}",
 "arrayIndex": "static int parent(int i) {\n    return i / 2;\n}\n\nstatic int left(int i) {\n    return 2 * i;\n}\n\nstatic int right(int i) {\n    return 2 * i + 1;\n}",
 "isComplete": "// Complete means: the n nodes use exactly the IDs 1..n.\nstatic boolean isComplete(BinaryNode<?> t) {\n    return maxId(t, 1) == BinaryTree.size(t);\n}",
 "preorder": "static <E> void preorder(BinaryNode<E> x, List<E> visited) {\n    if (x != null) {\n        visited.add(x.element);                 // visit the node\n        preorder(x.leftChild, visited);\n        preorder(x.rightChild, visited);\n    }\n}",
 "inorder": "static <E> void inorder(BinaryNode<E> x, List<E> visited) {\n    if (x != null) {\n        inorder(x.leftChild, visited);\n        visited.add(x.element);                 // visit the node\n        inorder(x.rightChild, visited);\n    }\n}",
 "postorder": "static <E> void postorder(BinaryNode<E> x, List<E> visited) {\n    if (x != null) {\n        postorder(x.leftChild, visited);\n        postorder(x.rightChild, visited);\n        visited.add(x.element);                 // visit the node\n    }\n}",
 "evalPostfix": "// Evaluate a postfix expression whose tokens are separated by spaces.\nstatic int evalPostfix(String postfix, boolean trace) {\n    List<Integer> stack = new ArrayList<>();          // the top is the last element\n    for (String token : postfix.trim().split(\"\\\\s+\")) {\n        if (isOperator(token)) {\n            int right = stack.remove(stack.size() - 1);\n            int left = stack.remove(stack.size() - 1);\n            int result = apply(token, left, right);\n            stack.add(result);\n            if (trace) {\n                System.out.printf(\"%-3s %d %s %d = %-4d stack %s%n\", token, left, token, right, result, stack);\n            }\n        } else {\n            stack.add(Integer.parseInt(token));\n            if (trace) {\n                System.out.printf(\"%-3s push %-9s stack %s%n\", token, token, stack);\n            }\n        }\n    }\n    if (stack.size() != 1) {\n        throw new IllegalArgumentException(\"not a valid postfix expression\");\n    }\n    return stack.get(0);\n}",
 "evaluate": "// Evaluate an expression tree: postorder (operands first, then the operator).\nstatic int evaluate(BinaryNode<String> t) {\n    if (t.leftChild == null && t.rightChild == null) {\n        return Integer.parseInt(t.element);\n    }\n    int left = evaluate(t.leftChild);\n    int right = evaluate(t.rightChild);\n    return apply(t.element, left, right);\n}",
 "preIn": "// The subtree whose preorder is preorder[p .. p+n-1] and inorder is inorder[i .. i+n-1].\nprivate static <E> BinaryNode<E> preIn(List<E> preorder, int p, int i, int n, Map<E, Integer> where) {\n    if (n == 0) {\n        return null;\n    }\n    E rootValue = preorder.get(p);                       // the first in preorder is the root\n    Integer r = where.get(rootValue);\n    if (r == null || r < i || r >= i + n) {\n        throw new IllegalArgumentException(\"no such tree (\" + rootValue + \")\");\n    }\n    int leftSize = r - i;                                // nodes left of the root in inorder\n    BinaryNode<E> left = preIn(preorder, p + 1, i, leftSize, where);\n    BinaryNode<E> right = preIn(preorder, p + 1 + leftSize, r + 1, n - 1 - leftSize, where);\n    return BinaryTree.makeBT(left, rootValue, right);\n}",
 "inPost": "// The subtree whose postorder is postorder[q .. q+n-1] and inorder is inorder[i .. i+n-1].\nprivate static <E> BinaryNode<E> inPost(List<E> postorder, int q, int i, int n, Map<E, Integer> where) {\n    if (n == 0) {\n        return null;\n    }\n    E rootValue = postorder.get(q + n - 1);              // the last in postorder is the root\n    Integer r = where.get(rootValue);\n    if (r == null || r < i || r >= i + n) {\n        throw new IllegalArgumentException(\"no such tree (\" + rootValue + \")\");\n    }\n    int leftSize = r - i;\n    BinaryNode<E> left = inPost(postorder, q, i, leftSize, where);\n    BinaryNode<E> right = inPost(postorder, q + leftSize, r + 1, n - 1 - leftSize, where);\n    return BinaryTree.makeBT(left, rootValue, right);\n}"
};

const OUT = {
 "TreeTerms": "Organism  depth 0  height 2  internal path [Organism]\nPlant     depth 1  height 0  leaf     path [Organism, Plant]\nAnimal    depth 1  height 1  internal path [Organism, Animal]\nMammal    depth 2  height 0  leaf     path [Organism, Animal, Mammal]\nFish      depth 2  height 0  leaf     path [Organism, Animal, Fish]\n5 nodes, 4 edges\n\nA         depth 0  height 4  internal path [A]\nB         depth 1  height 1  internal path [A, B]\nD         depth 2  height 0  leaf     path [A, B, D]\nE         depth 2  height 0  leaf     path [A, B, E]\nC         depth 1  height 3  internal path [A, C]\nF         depth 2  height 2  internal path [A, C, F]\nG         depth 3  height 1  internal path [A, C, F, G]\nH         depth 4  height 0  leaf     path [A, C, F, G, H]\nI         depth 4  height 0  leaf     path [A, C, F, G, I]\nheight of the tree = 4",
 "MakeBTDemo": "root: A\nleft child of the root: B\nright child of D: I\nparent of E: B, grandparent: A\nsize 5, height 2\nright subtree of B is empty: true\ndata(empty tree): empty tree",
 "TreeTextDemo": "A(B(E,),D(,I))\nleft child of B: E\nsize 5, height 2, full false",
 "ArrayDemo": "[1]A [2]B [3]C [4]D [5]E\nparent of 5: B, children of 2: D E\n[1]A [2]B [3]D [4]E [5]- [6]H [7]I [8]K [9]L\nrebuilt: A(B(E(K,L),),D(H,I))",
 "ArrayPractice": "T1: [1]A [2]B [3]- [4]C\nT2: [1]A [2]B [3]C [4]- [5]D [6]- [7]E",
 "Skewed": "1 nodes need 1 slots\n2 nodes need 3 slots\n3 nodes need 7 slots\n4 nodes need 15 slots\n5 nodes need 31 slots\n6 nodes need 63 slots",
 "ShapeCheck": "1(2(6,4),3(,5))  n=6  maxId=7  full=false complete=false\n1(2,3(6,4))      n=5  maxId=7  full=true  complete=false\n1(2(6,),3)       n=4  maxId=4  full=false complete=true\n1(2(6,4),3)      n=5  maxId=5  full=true  complete=true",
 "TraversalDemo": "preorder  [8, 3, 2, 5, 7, 9]\ninorder   [2, 3, 5, 8, 7, 9]\npostorder [2, 5, 3, 9, 7, 8]\npreorder  [A, B, D, C, E, G, F, H, I]",
 "CountCalls": "6 nodes: 13 calls\n9 nodes: 19 calls\n1 nodes: 3 calls",
 "TraversalExercise": "preorder  = [3, 9, 20, 15, 7]\ninorder   = [9, 3, 15, 20, 7]\npostorder = [9, 15, 7, 20, 3]",
 "ExpressionTree": "preorder  +-/+AB*CD*E-FGH\ninorder   A+B/C*D-E*F-G+H\npostorder AB+CD*/EFG-*-H+",
 "PostfixTable": "a b / c - d e * + a c * -",
 "PostfixTrace": "2   push 2         stack [2]\n3   push 3         stack [2, 3]\n2   push 2         stack [2, 3, 2]\n4   push 4         stack [2, 3, 2, 4]\n*   2 * 4 = 8    stack [2, 3, 8]\n+   3 + 8 = 11   stack [2, 11]\n*   2 * 11 = 22   stack [22]\nvalue = 22",
 "EvaluateTree": "(2 * (3 + (2 * 4))) = 22\npostfix 2 3 2 4 * + * = 22\n((((A + B) / (C * D)) - (E * (F - G))) + H)",
 "RebuildDemo": "A(B(C(D,E),),X(Z(U,T),Y))\npostorder DECBUTZYXA\n3(9,20(15,7))\nA(B(C(D,E),),X(Z(U,T),Y))",
 "PrePostAmbiguity": "5 binary trees have preorder ABC\n  postorder CBA: A(,B(,C))\n  postorder CBA: A(,B(C,))\n  postorder CBA: A(B(,C),)\n  postorder CBA: A(B(C,),)",
 "Duplicates": "refused: duplicate value 1\nrefused: no such tree (B)",
 "CheckAnswers": "height of C: 3\nfull false, complete true\nvalue 14",
 "Exercise1": "preorder  A B C D E X Z U T Y\ninorder   D C E B A U Z T X Y\npostorder D E C B U T Z Y X A",
 "Exercise2": "[1]1 [2]2 [3]3 [4]- [5]4 [6]5 [7]- [8]- [9]- [10]8\ncomplete false",
 "Exercise3": "1(2(4,5),3(6,))  preorder [1, 2, 4, 5, 3, 6]",
 "Exercise4": "1(2(6,4),3(,5)): 3 leaves, 3 internal\n1(2,3(6,4)): 3 leaves, 2 internal\n1(2(6,),3): 2 leaves, 2 internal\n1(2(6,4),3): 3 leaves, 2 internal",
 "Exercise5": "8(7(9,),3(5,2))\npreorder of mirror [8, 7, 9, 3, 5, 2]\npostorder of t     [2, 5, 3, 9, 7, 8]",
 "Exercise6": "A: 0\nE: 2\nH: 4\nQ: -1",
 "Exercise7": "[8, 3, 7, 2, 5, 9]\n[A, B, D, E, H, I, K, L]",
 "Exercise8": "((((A + B) / (C * D)) - (E * (F - G))) + H)\n+(-(/(+(A,B),*(C,D)),*(E,-(F,G))),H)"
};
// ---- end generated ----

// ---------- styles for this lecture's widgets (injected once) ----------

(function injectStyle() {
  if (document.getElementById("l13-style")) return;
  const st = document.createElement("style");
  st.id = "l13-style";
  st.textContent = `
  .l13-two { display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr); gap: 14px; align-items: start; }
  .l13-two pre.code { margin: 0; font-size: 12.5px; }
  .l13-cells { display: flex; flex-wrap: wrap; gap: 4px; margin: 6px 0; }
  .l13-cell { min-width: 34px; padding: 0 4px; height: 34px; display: grid; place-items: center; border: 1px solid var(--line);
    border-radius: 6px; background: var(--card); font: 600 14px var(--mono); position: relative; transition: all .2s; }
  .l13-cellwrap { display: flex; flex-direction: column; align-items: center; gap: 1px; }
  .l13-cellwrap small { font: 10px var(--mono); color: var(--stone); }
  .l13-cell.empty { color: var(--stone); background: var(--paper-2); border-style: dashed; }
  .l13-cell.dim { opacity: .3; }
  .l13-cell.cur { background: var(--mark); border-color: var(--amber); box-shadow: 0 0 0 1px var(--amber); }
  .l13-cell.par { background: var(--teal-soft); border-color: var(--teal); }
  .l13-cell.kid { background: var(--green-soft); border-color: var(--green); }
  .l13-cell.lft { background: var(--teal-soft); border-color: var(--teal); }
  .l13-cell.rgt { background: var(--green-soft); border-color: var(--green); }
  .l13-cell.done { opacity: .45; }
  .l13-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
  .l13-row > b { font: 600 12px var(--mono); color: var(--stone); min-width: 74px; }
  .l13-stack { display: flex; flex-direction: column-reverse; gap: 4px; min-height: 170px; justify-content: flex-start;
    background: var(--paper-2); border-radius: 10px; padding: 8px; }
  .l13-stack .l13-cell { width: 100%; }
  .l13-info { display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 8px; margin-top: 10px; }
  .l13-info .stat b { font-size: 14px; word-break: break-word; }
  .l13-verdict { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
  .l13-badge { font: 600 12px var(--mono); padding: 4px 9px; border-radius: 6px; background: var(--card-2); }
  .l13-badge.yes { background: var(--green-soft); color: var(--green); }
  .l13-badge.no { background: var(--red-soft); color: var(--red); }
  .l13-out { font: 13px var(--mono); margin-top: 8px; padding: 6px 10px; background: var(--code-bg); border: 1px solid var(--line); border-radius: 8px; overflow-x: auto; white-space: nowrap; }
  .l13-fig { margin: 14px 0; }
  .l13-fig .svgbox { max-width: 560px; margin: 0 auto; }
  .l13-fig figcaption { text-align: center; font-size: 13px; color: var(--stone); margin-top: 6px; }
  .l13-figrow { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px; margin: 14px 0; }
  .l13-figrow figure { margin: 0; }
  .l13-figrow figcaption { text-align: center; font-size: 12.5px; color: var(--ink-2); margin-top: 4px; }
  .controls input.l13-wide { width: 260px; max-width: 100%; font-family: var(--mono); }
  .l13-svg svg .clickable { cursor: pointer; }
  @media (max-width: 900px) { .l13-two { grid-template-columns: minmax(0, 1fr); } }
  @media (max-width: 600px) { .l13-cell { min-width: 28px; height: 30px; font-size: 12px; } .l13-stack { min-height: 120px; } }
  `;
  document.head.appendChild(st);
})();

// ---------- binary trees in JS (twins of TreeText, Traversals) ----------

// Same grammar as TreeText.parse: tree = "" | label | label "(" tree "," tree ")".
function parseTree(text) {
  const s = String(text).replace(/ /g, "");
  let pos = 0;
  function expect(c) {
    if (pos >= s.length || s[pos] !== c) throw new Error(`expected '${c}' at position ${pos}`);
    pos++;
  }
  function tree() {
    const start = pos;
    while (pos < s.length && !"(),".includes(s[pos])) pos++;
    if (pos === start) return null;
    const label = s.slice(start, pos);
    let left = null, right = null;
    if (pos < s.length && s[pos] === "(") {
      pos++;
      left = tree();
      expect(",");
      right = tree();
      expect(")");
    }
    return { label, left, right };
  }
  const t = tree();
  if (pos !== s.length) throw new Error(`unexpected '${s[pos]}'`);
  return t;
}

function formatTree(t) {
  if (!t) return "";
  if (!t.left && !t.right) return t.label;
  return `${t.label}(${formatTree(t.left)},${formatTree(t.right)})`;
}

// Give every node its array ID, depth, parent and inorder index; returns the nodes in preorder.
function annotate(root) {
  const nodes = [];
  let k = 0;
  (function walk(n, id, d, parent) {
    if (!n) return;
    n.id = id; n.depth = d; n.parent = parent;
    nodes.push(n);
    walk(n.left, 2 * id, d + 1, n);
    n.ix = k++;
    walk(n.right, 2 * id + 1, d + 1, n);
  })(root, 1, 0, null);
  return nodes;
}

function orderOf(root, order) {
  const out = [];
  (function walk(x) {
    if (!x) return;
    if (order === "preorder") out.push(x);
    walk(x.left);
    if (order === "inorder") out.push(x);
    walk(x.right);
    if (order === "postorder") out.push(x);
  })(root);
  return out;
}

const ARROW_DEFS = `<defs>
  <marker id="l13-al" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="var(--teal)"/></marker>
  <marker id="l13-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="var(--amber)"/></marker>
  <marker id="l13-ap" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="var(--stone)"/></marker></defs>`;

// Draw a binary tree. opt.layout: "inorder" (x = inorder index) or "id" (x from the array ID).
// opt.style(n) -> {fill, stroke, sw, op, color}; opt.edge(child) -> {stroke, sw, dash, op};
// opt.below(n) -> small text under the node; opt.tag(n) -> small text at the upper right.
function treeSVG(root, opt = {}) {
  const W = opt.width || 640, rowH = opt.rowH || 58;
  if (!root) return `<svg viewBox="0 0 ${W} 60"><text x="${W / 2}" y="34" text-anchor="middle" font-size="13" fill="var(--stone)">(empty tree)</text></svg>`;
  const nodes = annotate(root);
  const maxD = Math.max(...nodes.map((n) => n.depth));
  const layout = opt.layout || "inorder";
  const slots = layout === "id" ? 2 ** maxD : nodes.length;
  const slotW = W / slots;
  const r = Math.max(7, Math.min(opt.r || 18, slotW / 2 - 2));
  const fs = Math.max(8, Math.min(14, r * 0.8));
  const cx = (n) => layout === "id" ? ((n.id - 2 ** n.depth) + 0.5) * (W / 2 ** n.depth) : (n.ix + 0.5) * slotW;
  const cy = (n) => 22 + n.depth * rowH;
  const H = 22 + maxD * rowH + r + (opt.below ? 26 : 12);
  let g = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="binary tree">`;
  nodes.forEach((n) => [n.left, n.right].forEach((k) => {
    if (!k) return;
    const e = opt.edge ? opt.edge(k) || {} : {};
    g += `<line x1="${cx(n)}" y1="${cy(n) + r}" x2="${cx(k)}" y2="${cy(k) - r}" stroke="${e.stroke || "var(--ink-2)"}" stroke-width="${e.sw || 1.4}" opacity="${e.op ?? 1}"${e.dash ? ` stroke-dasharray="${e.dash}"` : ""}/>`;
  }));
  nodes.forEach((n, k) => {
    const s = opt.style ? opt.style(n) || {} : {};
    g += `<g opacity="${s.op ?? 1}" data-k="${k}"${opt.clickable ? ` class="clickable"` : ""}><circle cx="${cx(n)}" cy="${cy(n)}" r="${r}" fill="${s.fill || "var(--card)"}" stroke="${s.stroke || "var(--ink-2)"}" stroke-width="${s.sw || 1.4}"/>`;
    const lab = n.label.length > 3 && r < 22 ? n.label.slice(0, 3) : n.label;
    g += `<text x="${cx(n)}" y="${cy(n) + fs * 0.36}" text-anchor="middle" font-size="${n.label.length > 2 ? fs * 0.8 : fs}" font-weight="600" fill="${s.color || "var(--ink)"}">${esc(lab)}</text></g>`;
    if (opt.tag) {
      const t = opt.tag(n);
      if (t !== "" && t != null) g += `<text x="${cx(n) + r + 2}" y="${cy(n) - r + 6}" font-size="${Math.max(8, fs * 0.7)}" fill="var(--red)">${esc(t)}</text>`;
    }
    if (opt.below) {
      const b = opt.below(n);
      if (b !== "" && b != null) g += `<text x="${cx(n)}" y="${cy(n) + r + 14}" text-anchor="middle" font-size="11" font-weight="600" fill="var(--green)">${esc(b)}</text>`;
    }
  });
  return g + "</svg>";
}

// A static figure for the chapter text.
function figTree(text, caption = "", opt = {}) {
  return `<figure class="l13-fig"><div class="svgbox">${treeSVG(parseTree(text), { width: opt.width || 520, rowH: 54, ...opt })}</div>${caption ? `<figcaption>${caption}</figcaption>` : ""}</figure>`;
}

function figRow(items) {
  return `<div class="l13-figrow">${items.map(([text, cap]) =>
    `<figure><div class="svgbox">${treeSVG(parseTree(text), { width: 220, rowH: 50, r: 15, layout: "id" })}</div><figcaption>${cap}</figcaption></figure>`).join("")}</div>`;
}

// ---------- a generic step player (svg/html view + optional code panel) ----------

// opts: build() -> snaps [{line, msg, msgCls, ...}], render(snap) -> html, code (string | fn),
//       top (html above), extraControls, onMount(el, rebuild), mini, interval.
function makePlayer(el, opts) {
  const mini = !!opts.mini;
  const hasCode = !!opts.code && !mini;
  el.innerHTML = `${opts.top && !mini ? opts.top : ""}
    ${hasCode ? `<div class="l13-two"><div class="pl-view l13-svg"></div><div class="pl-code"></div></div>` : `<div class="pl-view l13-svg"></div>`}
    ${mini ? "" : `<div class="msg pl-msg"></div><div class="controls">
      <button class="cbtn pl-reset" title="Back to the start">⟲ Reset</button>
      <button class="cbtn pl-back" title="Step back (←)">◀ Back</button>
      <button class="cbtn pl-step on" title="Step (→)">Step ▶</button>
      <button class="cbtn pl-play">Play</button>
      ${opts.extraControls || ""}
      <span class="spacer"></span><span class="counter pl-count"></span></div>`}`;
  const $ = (q) => el.querySelector(q);
  let snaps = [], i = 0, timer = null, codeLines = [];
  function render() {
    const s = snaps[i];
    $(".pl-view").innerHTML = opts.render(s, i);
    if (opts.afterRender) opts.afterRender(el, s, i, (k) => { stop(); i = k; render(); });
    if (hasCode) codeLines.forEach((ln, k) => ln.classList.toggle("hl", k + 1 === s.line));
    if (mini) return;
    $(".pl-msg").innerHTML = s.msg || "";
    $(".pl-msg").className = "msg pl-msg " + (s.msgCls || "");
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
    }, opts.interval || (mini ? 900 : 750));
  }
  function rebuild() {
    stop();
    if (hasCode) {
      $(".pl-code").innerHTML = codeBlock(typeof opts.code === "function" ? opts.code() : opts.code);
      codeLines = [...el.querySelectorAll(".pl-code .ln")];
    }
    snaps = opts.build();
    i = 0;
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
  if (opts.onMount) opts.onMount(el, rebuild);
  rebuild();
  if (mini) play();
  return { rebuild };
}

const cellsRow = (label, cells) => `<div class="l13-row"><b>${label}</b><div class="l13-cells">${cells}</div></div>`;
const cell = (v, cls = "", idx = null) => idx == null
  ? `<div class="l13-cell ${cls}">${esc(v)}</div>`
  : `<div class="l13-cellwrap"><div class="l13-cell ${cls}">${esc(v)}</div><small>[${idx}]</small></div>`;

// ---------- Demo 1: tree vocabulary (general trees) ----------

const GENERAL_TREES = {
  organism: ["Organism", [["Plant"], ["Animal", [["Mammal"], ["Fish"]]]]],
  tall: ["A", [["B", [["D"], ["E"]]], ["C", [["F", [["G", [["H"], ["I"]]]]]]]]],
};

function buildGeneral(spec, parent = null) {
  const n = { label: spec[0], parent, kids: [] };
  n.kids = (spec[1] || []).map((s) => buildGeneral(s, n));
  return n;
}
const gDepth = (n) => n.parent ? 1 + gDepth(n.parent) : 0;
const gHeight = (n) => n.kids.reduce((h, c) => Math.max(h, 1 + gHeight(c)), 0);
const gPath = (n) => n.parent ? [...gPath(n.parent), n] : [n];
const gPre = (n) => [n, ...n.kids.flatMap(gPre)];

function demoTerms(el, { mini = false } = {}) {
  let which = "tall";
  let root, nodes;
  function setTree() {
    root = buildGeneral(GENERAL_TREES[which]);
    nodes = gPre(root);
    layoutTree(root);
  }
  setTree();
  function render(s) {
    const sel = nodes[s.k];
    const path = new Set(gPath(sel));
    const W = 640, rowH = 64, maxD = Math.max(...nodes.map((n) => n.depth));
    const slots = Math.max(...nodes.map((n) => n.x)) + 1;
    const slotW = W / slots, bw = Math.min(86, slotW - 6);
    const cx = (n) => (n.x + 0.5) * slotW, cy = (n) => 24 + n.depth * rowH;
    let g = `<svg viewBox="0 0 ${W} ${36 + maxD * rowH + 24}" role="img" aria-label="tree">`;
    nodes.forEach((n) => n.kids.forEach((c) => {
      const on = path.has(c);
      g += `<line x1="${cx(n)}" y1="${cy(n) + 13}" x2="${cx(c)}" y2="${cy(c) - 13}" stroke="${on ? "var(--amber)" : "var(--line)"}" stroke-width="${on ? 3 : 1.5}"/>`;
    }));
    nodes.forEach((n, k) => {
      const isSel = n === sel, isPar = n === sel.parent, isKid = sel.kids.includes(n);
      const isSib = sel.parent && n.parent === sel.parent && !isSel;
      const fill = isSel ? "var(--mark)" : isPar ? "var(--teal-soft)" : isKid ? "var(--green-soft)" : "var(--card)";
      const stroke = isSel ? "var(--amber)" : isPar ? "var(--teal)" : isKid ? "var(--green)" : isSib ? "var(--ink-2)" : "var(--line)";
      g += `<g class="clickable" data-k="${k}"><rect x="${cx(n) - bw / 2}" y="${cy(n) - 13}" width="${bw}" height="26" rx="6" fill="${fill}" stroke="${stroke}" stroke-width="${isSel ? 2.4 : 1.4}"${isSib ? ` stroke-dasharray="4 3"` : ""}/>`;
      g += `<text x="${cx(n)}" y="${cy(n) + 4}" text-anchor="middle" font-size="${bw < 70 ? 10 : 12}" fill="var(--ink)">${esc(n.label)}</text></g>`;
      if (!n.kids.length) g += `<text x="${cx(n)}" y="${cy(n) + 26}" text-anchor="middle" font-size="9" fill="var(--stone)">leaf</text>`;
    });
    g += "</svg>";
    if (mini) return `<div class="svgbox">${g}</div><div class="l13-out">${esc(sel.label)}: depth ${gDepth(sel)}, height ${gHeight(sel)}</div>`;
    const sibs = sel.parent ? sel.parent.kids.filter((x) => x !== sel).map((x) => x.label) : [];
    const stat = (k, v) => `<div class="stat"><small>${k}</small><b>${esc(v)}</b></div>`;
    return `<div class="svgbox">${g}</div><div class="l13-info">
      ${stat("depth", gDepth(sel))}${stat("height", gHeight(sel))}${stat("kind", sel.kids.length ? "internal" : "leaf")}
      ${stat("parent", sel.parent ? sel.parent.label : "— (root)")}${stat("children", sel.kids.map((x) => x.label).join(", ") || "none")}
      ${stat("siblings", sibs.join(", ") || "none")}${stat("path from root", "[" + gPath(sel).map((x) => x.label).join(", ") + "]")}</div>`;
  }
  return makePlayer(el, {
    mini, interval: 1300,
    extraControls: `<label>tree <select class="tm-tree"><option value="tall">A … I (height 4)</option><option value="organism">Organism</option></select></label>`,
    build: () => nodes.map((n, k) => {
      const d = gDepth(n), h = gHeight(n);
      return { k, msg: `<b>${esc(n.label)}</b>: depth ${d} (the path from the root has ${d} edge${d === 1 ? "" : "s"}), height ${h}${h ? ` (longest path down to a leaf has ${h} edge${h === 1 ? "" : "s"})` : " (a leaf)"}. Amber edges: the unique path from the root. Click any node.` };
    }),
    render,
    afterRender: (root_, s, i, jump) => {
      root_.querySelectorAll(".pl-view g.clickable").forEach((gEl) => { gEl.onclick = () => jump(+gEl.dataset.k); });
    },
    onMount: (root_, rebuild) => {
      const sel = root_.querySelector(".tm-tree");
      if (sel) { sel.value = which; sel.onchange = () => { which = sel.value; setTree(); rebuild(); }; }
    },
  });
}

// ---------- Demo 2: full / complete shapes (IDs 1..31) ----------

const SHAPE_PRESETS = {
  a: [1, 2, 3, 4, 5, 7], b: [1, 2, 3, 6, 7], c: [1, 2, 3, 4], d: [1, 2, 3, 4, 5],
  perfect: [1, 2, 3, 4, 5, 6, 7], skewed: [1, 2, 4, 8], single: [1],
};

function shapeTree(ids) {
  const set = new Set(ids);
  const make = (id) => set.has(id) ? { label: String(id), left: make(2 * id), right: make(2 * id + 1) } : null;
  return make(1);
}

function shapeFacts(ids) {
  const set = new Set(ids);
  const n = set.size, maxId = n ? Math.max(...set) : 0;
  const oneChild = [...set].filter((id) => set.has(2 * id) !== set.has(2 * id + 1)).sort((x, y) => x - y);
  const leaves = [...set].filter((id) => !set.has(2 * id) && !set.has(2 * id + 1)).length;
  let firstGap = null;
  for (let k = 1; k <= maxId; k++) if (!set.has(k)) { firstGap = k; break; }
  const height = n ? Math.floor(Math.log2(maxId)) : -1;
  return { n, maxId, oneChild, leaves, firstGap, height, full: oneChild.length === 0, complete: maxId === n };
}

function demoShapes(el, { mini = false } = {}) {
  let ids = new Set(SHAPE_PRESETS.a);
  const presetOrder = ["a", "b", "c", "d"];
  function svg(s) {
    const W = 640, rowH = 56, maxD = 4;
    const cx = (id) => { const d = Math.floor(Math.log2(id)); return ((id - 2 ** d) + 0.5) * (W / 2 ** d); };
    const cy = (id) => 22 + Math.floor(Math.log2(id)) * rowH;
    const facts = shapeFacts([...ids]);
    let g = `<svg viewBox="0 0 ${W} ${22 + maxD * rowH + 24}" role="img" aria-label="binary tree shape">`;
    for (let id = 2; id < 32; id++) if (ids.has(id)) g += `<line x1="${cx(id >> 1)}" y1="${cy(id >> 1) + 14}" x2="${cx(id)}" y2="${cy(id) - 14}" stroke="var(--ink-2)" stroke-width="1.4"/>`;
    for (let id = 1; id < 32; id++) {
      const has = ids.has(id);
      const addable = !has && (id === 1 || ids.has(id >> 1));
      if (!has && !addable) continue;
      if (!has) {
        if (mini) continue;
        const gap = s && s.scan === id;
        g += `<g class="clickable" data-id="${id}"><circle cx="${cx(id)}" cy="${cy(id)}" r="12" fill="${gap ? "var(--red-soft)" : "transparent"}" stroke="${gap ? "var(--red)" : "var(--line)"}" stroke-dasharray="3 3"/><text x="${cx(id)}" y="${cy(id) + 4}" text-anchor="middle" font-size="10" fill="var(--stone)">+</text></g>`;
        continue;
      }
      const isScan = s && s.scan === id;
      const bad = facts.oneChild.includes(id);
      g += `<g class="clickable" data-id="${id}"><circle cx="${cx(id)}" cy="${cy(id)}" r="15" fill="${isScan ? "var(--mark)" : "var(--card)"}" stroke="${isScan ? "var(--amber)" : bad ? "var(--red)" : "var(--ink-2)"}" stroke-width="${isScan || bad ? 2.2 : 1.4}"/><text x="${cx(id)}" y="${cy(id) + 4}" text-anchor="middle" font-size="12" font-weight="600" fill="var(--ink)">${id}</text></g>`;
    }
    return g + "</svg>";
  }
  function verdict() {
    const f = shapeFacts([...ids]);
    const b = (ok, txt) => `<span class="l13-badge ${ok ? "yes" : "no"}">${ok ? "✓" : "✗"} ${txt}</span>`;
    return `<div class="l13-verdict"><span class="l13-badge">n = ${f.n}</span><span class="l13-badge">height ${f.height}</span><span class="l13-badge">leaves ${f.leaves}</span>${b(f.full, "full")}${b(f.complete, "complete")}${b(f.full && f.complete && f.n === 2 ** (f.height + 1) - 1, "perfect")}</div>`;
  }
  return makePlayer(el, {
    mini, interval: 1700,
    extraControls: mini ? "" : `<label>preset <select class="sh-pre"><option value="a">(a)</option><option value="b">(b)</option><option value="c">(c)</option><option value="d">(d)</option><option value="perfect">perfect, height 2</option><option value="skewed">skewed</option><option value="single">one node</option></select></label>`,
    build: () => {
      if (mini) return presetOrder.map((p) => ({ preset: p }));
      const f = shapeFacts([...ids]);
      const snaps = [{ msg: `Click a <b>+</b> to add a child, click a node to remove it (and everything below it). Then step: we scan the IDs 1, 2, 3, … level by level.` }];
      for (let id = 1; id <= f.maxId; id++) {
        if (ids.has(id)) {
          const kids = [ids.has(2 * id), ids.has(2 * id + 1)].filter(Boolean).length;
          snaps.push({ scan: id, msg: `ID ${id}: a node with ${kids} child${kids === 1 ? "" : "ren"}${kids === 1 ? " — <b>so the tree is not full</b>" : ""}.`, msgCls: kids === 1 ? "bad" : "" });
        } else {
          snaps.push({ scan: id, msg: `ID ${id}: <b>empty</b>, but the tree has a node with a larger ID (${f.maxId}). A gap before the last node means <b>not complete</b>.`, msgCls: "bad" });
        }
      }
      snaps.push({ msg: f.n === 0 ? "The empty tree." : `${f.n} nodes, largest ID ${f.maxId}. ${f.complete ? "No gaps: <b>complete</b>." : `First gap at ID ${f.firstGap}: <b>not complete</b>.`} ${f.full ? "No node has exactly one child: <b>full</b>." : `Node${f.oneChild.length > 1 ? "s" : ""} ${f.oneChild.join(", ")} ha${f.oneChild.length > 1 ? "ve" : "s"} one child: <b>not full</b>.`}`, msgCls: f.full && f.complete ? "good" : "" });
      return snaps;
    },
    render: (s) => {
      if (mini) { ids = new Set(SHAPE_PRESETS[s.preset]); return `<div class="svgbox">${svg(null)}</div>${verdict()}`; }
      return `<div class="svgbox">${svg(s)}</div>${verdict()}`;
    },
    afterRender: (root_, s, i) => {
      if (mini) return;
      root_.querySelectorAll(".pl-view g.clickable").forEach((gEl) => {
        gEl.onclick = () => {
          const id = +gEl.dataset.id;
          if (ids.has(id)) { for (const x of [...ids]) { let y = x; while (y > id) y >>= 1; if (y === id) ids.delete(x); } }
          else ids.add(id);
          root_._rebuild();
        };
      });
    },
    onMount: (root_, rebuild) => {
      root_._rebuild = rebuild;
      const sel = root_.querySelector(".sh-pre");
      if (sel) sel.onchange = () => { ids = new Set(SHAPE_PRESETS[sel.value]); rebuild(); };
    },
  });
}

// ---------- Demo 3: makeBT links the nodes ----------

// Positions are those of the finished tree A(B(E,),D(,I)).
const MAKEBT_POS = { A: [320, 30], B: [180, 105], D: [460, 105], E: [100, 180], I: [540, 180] };

function demoMakeBT(el) {
  const t = new Tracer();
  const state = {};                      // label -> {left, right, parent}
  const snap = (line, msg, cls = "", focus = null) => t.snap(line, msg, cls, { state: JSON.parse(JSON.stringify(state)), focus });
  const main = t.push("main", {});
  function makeBT(t1, e, t2, call) {
    const f = t.push(`makeBT(${t1 || "null"}, "${e}", ${t2 || "null"})`, { t1: t1 || "null", element: `"${e}"`, t2: t2 || "null" });
    snap(1, `Call <code>${call}</code>.`, "", e);
    state[e] = { left: null, right: null, parent: null };
    f.vars.rootNode = e;
    snap(2, `Allocate a new node holding <b>${e}</b>. All its links start as <code>null</code>.`, "", e);
    snap(3, "<code>rootNode.parent = null</code>: a new root has no parent (yet).", "", e);
    state[e].left = t1;
    snap(4, t1 ? `Left link → the subtree rooted at <b>${t1}</b>.` : "Left subtree is empty: the link stays <code>null</code>.", "", e);
    state[e].right = t2;
    snap(5, t2 ? `Right link → the subtree rooted at <b>${t2}</b>.` : "Right subtree is empty: the link stays <code>null</code>.", "", e);
    snap(6, `Is <code>t1</code> non-empty? ${t1 ? "Yes." : "No, skip."}`, "", e);
    if (t1) { state[t1].parent = e; snap(7, `<code>t1.parent = rootNode</code>: <b>${t1}</b> now points up to <b>${e}</b> (dashed arrow).`, "", t1); }
    snap(9, `Is <code>t2</code> non-empty? ${t2 ? "Yes." : "No, skip."}`, "", e);
    if (t2) { state[t2].parent = e; snap(10, `<code>t2.parent = rootNode</code>: <b>${t2}</b> now points up to <b>${e}</b>.`, "", t2); }
    f.status = `returns ${e}`; f.cls = "ret";
    snap(12, `Return the new root <b>${e}</b>. Constant work: no loops, no recursion.`, "good", e);
    t.pop();
    return e;
  }
  snap(0, "Build <code>A(B(E,),D(,I))</code> bottom-up: subtrees first, then a root on top of them.");
  main.vars.e = makeBT(null, "E", null, "BinaryTree.leaf(\"E\")</code> = <code>makeBT(null, \"E\", null)");
  main.vars.b = makeBT("E", "B", null, "makeBT(e, \"B\", null)");
  makeBT(null, "I", null, "BinaryTree.leaf(\"I\")");
  main.vars.d = makeBT(null, "D", "I", "makeBT(null, \"D\", leaf(\"I\"))");
  main.vars.t = makeBT("B", "A", "D", "makeBT(b, \"A\", d)");
  snap(0, "Done. Every child link has a matching parent link, and only the root <b>A</b> has <code>parent == null</code>.", "good");
  const snaps = t.snaps;

  function draw(ex) {
    const st = ex.state;
    const P = MAKEBT_POS;
    let g = `<svg viewBox="0 0 640 215" role="img" aria-label="linked nodes">${ARROW_DEFS}`;
    const seg = (a, b, r = 19) => {
      const [x1, y1] = P[a], [x2, y2] = P[b];
      const d = Math.hypot(x2 - x1, y2 - y1);
      return [x1 + (x2 - x1) * r / d, y1 + (y2 - y1) * r / d, x2 - (x2 - x1) * r / d, y2 - (y2 - y1) * r / d];
    };
    Object.entries(st).forEach(([k, v]) => {
      if (v.left) { const [a, b, c, d] = seg(k, v.left); g += `<line x1="${a - 4}" y1="${b}" x2="${c - 4}" y2="${d}" stroke="var(--teal)" stroke-width="2" marker-end="url(#l13-al)"/>`; }
      if (v.right) { const [a, b, c, d] = seg(k, v.right); g += `<line x1="${a + 4}" y1="${b}" x2="${c + 4}" y2="${d}" stroke="var(--amber)" stroke-width="2" marker-end="url(#l13-ar)"/>`; }
      if (v.parent) { const [a, b, c, d] = seg(k, v.parent); g += `<line x1="${a + 7}" y1="${b - 4}" x2="${c + 7}" y2="${d - 4}" stroke="var(--stone)" stroke-width="1.5" stroke-dasharray="4 3" marker-end="url(#l13-ap)"/>`; }
    });
    Object.keys(st).forEach((k) => {
      const [x, y] = P[k], f = ex.focus === k;
      g += `<circle cx="${x}" cy="${y}" r="18" fill="${f ? "var(--mark)" : "var(--card)"}" stroke="${f ? "var(--amber)" : "var(--ink-2)"}" stroke-width="${f ? 2.4 : 1.4}"/><text x="${x}" y="${y + 5}" text-anchor="middle" font-size="14" font-weight="600" fill="var(--ink)">${k}</text>`;
      if (!st[k].parent) g += `<text x="${x}" y="${y - 23}" text-anchor="middle" font-size="9" fill="var(--stone)">parent = null</text>`;
    });
    g += `<text x="8" y="208" font-size="10" fill="var(--teal)">→ leftChild</text><text x="90" y="208" font-size="10" fill="var(--amber)">→ rightChild</text><text x="180" y="208" font-size="10" fill="var(--stone)">⇢ parent</text></svg>`;
    return `<div class="svgbox">${g}</div>`;
  }
  return makeStepper(el, { code: CODE.makeBT, build: () => snaps, renderExtra: (s) => draw(s.extra), stackLabel: "call stack" });
}

// ---------- Demo 4: array representation ----------

const ARRAY_PRESETS = {
  "A(B(D,E),C)": "complete, 5 nodes",
  "A(B(E(K,L),),D(H,I))": "with a gap",
  "A(B(C,),)": "T1: left chain",
  "A(B(,D),C(,E))": "T2",
  "N(,N(,N(,N)))": "skewed right",
};

function demoArray(el, { mini = false } = {}) {
  let text = "A(B(E(K,L),),D(H,I))";
  let root = null, err = "", nodes = [], byId = {}, maxId = 0;
  function setTree() {
    err = "";
    try { root = parseTree(text); } catch (e) { root = null; err = e.message; }
    nodes = root ? annotate(root) : [];
    byId = {}; nodes.forEach((n) => { byId[n.id] = n; });
    maxId = nodes.length ? Math.max(...nodes.map((n) => n.id)) : 0;
    if (maxId > 63) { err = `the largest ID is ${maxId}: too deep for this demo (keep the height ≤ 5)`; root = null; nodes = []; byId = {}; maxId = 0; }
  }
  setTree();
  function render(s) {
    if (err) return `<div class="msg bad">${esc(err)}</div>`;
    const i = s.i;
    const role = (id) => id === i ? "cur" : i && id === (i >> 1) ? "par" : i && (id === 2 * i || id === 2 * i + 1) ? "kid" : "";
    const sv = treeSVG(root, { layout: "id", width: 640, rowH: 54, r: 17, tag: (n) => n.id,
      style: (n) => { const r = role(n.id); return r === "cur" ? { fill: "var(--mark)", stroke: "var(--amber)", sw: 2.4 } : r === "par" ? { fill: "var(--teal-soft)", stroke: "var(--teal)" } : r === "kid" ? { fill: "var(--green-soft)", stroke: "var(--green)" } : {}; } });
    let cells = "";
    const upto = mini ? maxId : Math.max(maxId, i ? Math.min(2 * i + 1, 63) : 0);
    for (let id = 1; id <= upto; id++) cells += cell(byId[id] ? byId[id].label : "–", (byId[id] ? "" : "empty ") + role(id), id);
    return `<div class="svgbox">${sv}</div>${cellsRow("a[ ]", cells)}`;
  }
  return makePlayer(el, {
    mini, code: CODE.arrayIndex, interval: 1100,
    extraControls: `<label>tree <select class="ar-pre">${Object.entries(ARRAY_PRESETS).map(([k, v]) => `<option value="${k}">${v}</option>`).join("")}</select></label>
      <label><input type="text" class="ar-text l13-wide" value="${text}" aria-label="tree text"></label>`,
    build: () => {
      if (err) return [{ i: 0, msg: esc(err), msgCls: "bad" }];
      const snaps = [{ i: 0, msg: `${nodes.length} nodes, largest ID ${maxId}: the array needs slots 1 … ${maxId}${maxId > nodes.length ? `, ${maxId - nodes.length} of them empty` : ", no gaps"}. Step through the IDs.` }];
      for (let id = 1; id <= maxId; id++) {
        const n = byId[id];
        if (!n) { snaps.push({ i: id, line: 0, msg: `a[${id}] is empty: there is no node at this position.` }); continue; }
        const p = id > 1 ? `parent ⌊${id}/2⌋ = ${id >> 1} (${byId[id >> 1].label})` : "the root: no parent";
        const kid = (c, side) => byId[c] ? `${side} child ${c} (${byId[c].label})` : `${side} child would be ${c}: none`;
        snaps.push({ i: id, line: id > 1 ? 2 : 6, msg: `a[${id}] = <b>${esc(n.label)}</b>. ${p}; ${kid(2 * id, "left")}; ${kid(2 * id + 1, "right")}.` });
      }
      return snaps;
    },
    render,
    onMount: (root_, rebuild) => {
      const sel = root_.querySelector(".ar-pre"), inp = root_.querySelector(".ar-text");
      if (!sel) return;
      sel.value = text;
      sel.onchange = () => { text = inp.value = sel.value; setTree(); rebuild(); };
      inp.onchange = () => { text = inp.value; setTree(); rebuild(); };
    },
  });
}

// ---------- Demo 5: traversals with the call stack ----------

const TRAVERSE_LINES = {
  preorder: { check: 2, visit: 3, left: 4, right: 5, end: 7, steps: ["visit", "left", "right"] },
  inorder: { check: 2, left: 3, visit: 4, right: 5, end: 7, steps: ["left", "visit", "right"] },
  postorder: { check: 2, left: 3, right: 4, visit: 5, end: 7, steps: ["left", "right", "visit"] },
};
const TREE_PRESETS = {
  "8(3(2,5),7(,9))": "8 3 7 (slides)",
  "A(B(D,),C(E(,G),F(H,I)))": "A … I",
  "3(9,20(15,7))": "3 9 20",
  "+(-(/(+(A,B),*(C,D)),*(E,-(F,G))),H)": "expression",
};

function traceTraversal(root, order, skipNull = false) {
  annotate(root);
  const L = TRAVERSE_LINES[order];
  const t = new Tracer();
  const visited = [];
  const stackIds = [];
  const ex = (cur) => ({ cur, visited: visited.slice(), stack: stackIds.slice() });
  const out = () => { t.out = ["[" + visited.map((n) => n.label).join(", ") + "]"]; };
  out();
  function walk(x) {
    const f = t.push(`${order}(${x ? x.label : "null"})`, {});
    if (x) stackIds.push(x);
    if (x || !skipNull) t.snap(L.check, x ? `New call on the subtree rooted at <b>${esc(x.label)}</b>.` : "A call on an <b>empty</b> subtree: <code>x == null</code>, so it does nothing and returns.", "", ex(x));
    if (x) {
      for (const step of L.steps) {
        if (step === "visit") {
          visited.push(x);
          out();
          f.status = `visited ${x.label}`;
          t.snap(L.visit, `Visit <b>${esc(x.label)}</b> (number ${visited.length}).`, "good", ex(x));
        } else {
          const kid = step === "left" ? x.left : x.right;
          f.status = `waiting: ${step} subtree`;
          if (!skipNull || kid) t.snap(L[step], `Traverse the ${step} subtree of <b>${esc(x.label)}</b>${kid ? "" : " (empty)"}.`, "", ex(x));
          walk(kid);
        }
      }
      f.status = "returns"; f.cls = "ret";
      t.snap(L.end, `Subtree <b>${esc(x.label)}</b> is finished; its frame is popped.`, "", ex(x));
      stackIds.pop();
    }
    t.pop();
  }
  walk(root);
  t.snap(0, `Done: ${order} = <b>[${visited.map((n) => esc(n.label)).join(", ")}]</b>.`, "good", ex(null));
  return t.snaps;
}

function traverseView(root, extra, order) {
  const num = new Map(extra.visited.map((n, k) => [n, k + 1]));
  const onStack = new Set(extra.stack);
  const sv = treeSVG(root, { width: 600, rowH: 56, below: (n) => num.has(n) ? `#${num.get(n)}` : "",
    style: (n) => n === extra.cur ? { fill: "var(--mark)", stroke: "var(--amber)", sw: 2.6 } : num.has(n) ? { fill: "var(--green-soft)", stroke: "var(--green)" } : onStack.has(n) ? { fill: "var(--teal-soft)", stroke: "var(--teal)" } : {},
    edge: (k) => onStack.has(k) ? { stroke: "var(--teal)", sw: 2.2 } : {} });
  return `<div class="svgbox">${sv}</div><div class="l13-out">${order}: [${extra.visited.map((n) => esc(n.label)).join(", ")}]</div>`;
}

function demoTraverse(el, { tree = "8(3(2,5),7(,9))", order = "preorder", mini = false } = {}) {
  let text = tree, root = parseTree(text), err = "";
  if (mini) {
    return makePlayer(el, {
      mini: true, interval: 700,
      build: () => traceTraversal(parseTree(text), order, true).filter((s, k, a) => k === 0 || s.extra.cur !== a[k - 1].extra.cur || s.extra.visited.length !== a[k - 1].extra.visited.length),
      render: (s) => traverseView(root, s.extra, order),
    });
  }
  return makeStepper(el, {
    code: () => CODE[order],
    build: () => {
      if (err) { const t = new Tracer(); t.snap(0, esc(err), "bad", { cur: null, visited: [], stack: [] }); return t.snaps; }
      return traceTraversal(root, order);
    },
    renderExtra: (s) => err ? "" : traverseView(root, s.extra, order),
    showConsole: false,
    extraControls: `<label>order <select class="tv-order"><option>preorder</option><option>inorder</option><option>postorder</option></select></label>
      <label>tree <select class="tv-pre">${Object.entries(TREE_PRESETS).map(([k, v]) => `<option value="${k}">${v}</option>`).join("")}</select></label>
      <label><input type="text" class="tv-text l13-wide" value="${text}" aria-label="tree text"></label>`,
    onMount: (root_, rebuild) => {
      const o = root_.querySelector(".tv-order"), p = root_.querySelector(".tv-pre"), inp = root_.querySelector(".tv-text");
      o.value = order; p.value = text;
      const set = (v) => { text = v; try { root = parseTree(v); err = root ? "" : "empty tree: nothing to traverse"; } catch (e) { err = e.message; } rebuild(); };
      o.onchange = () => { order = o.value; rebuild(); };
      p.onchange = () => { inp.value = p.value; set(p.value); };
      inp.onchange = () => set(inp.value);
    },
  });
}

// ---------- Demo 6: evaluating postfix with a stack ----------

// Twin of Expressions.evalPostfix (int arithmetic, division truncates like Java).
function tracePostfix(expr) {
  const tokens = expr.trim().split(/\s+/).filter(Boolean);
  const stack = [];
  const snaps = [];
  const s = (k, line, msg, cls = "", vars = {}) => snaps.push({ k, line, msg, msgCls: cls, stack: stack.slice(), tokens, vars });
  s(-1, 3, "Start with an empty stack. Read the tokens from left to right.");
  for (let k = 0; k < tokens.length; k++) {
    const tok = tokens[k];
    if (["+", "-", "*", "/"].includes(tok)) {
      if (stack.length < 2) { s(k, 6, `Operator <b>${tok}</b> needs two operands but the stack has ${stack.length}: not a valid postfix expression (Java throws here).`, "bad"); return snaps; }
      const right = stack.pop();
      s(k, 6, `Operator <b>${tok}</b>: pop the <b>right</b> operand, ${right}.`, "", { right });
      const left = stack.pop();
      s(k, 7, `Pop the <b>left</b> operand, ${left}.`, "", { left, right });
      if (tok === "/" && right === 0) { s(k, 8, "Division by zero: Java throws <code>ArithmeticException</code>.", "bad", { left, right }); return snaps; }
      const result = tok === "+" ? left + right : tok === "-" ? left - right : tok === "*" ? left * right : Math.trunc(left / right);
      stack.push(result);
      s(k, 9, `${left} ${tok} ${right} = <b>${result}</b>; push it.`, "", { left, right, result });
    } else if (/^[+-]?\d+$/.test(tok)) {
      stack.push(parseInt(tok, 10));
      s(k, 14, `Operand <b>${tok}</b>: push it.`);
    } else {
      s(k, 14, `<b>${esc(tok)}</b> is neither a number nor an operator: Java's <code>parseInt</code> throws.`, "bad");
      return snaps;
    }
  }
  if (stack.length !== 1) s(tokens.length, 20, `The stack ends with ${stack.length} values instead of 1: not a valid postfix expression.`, "bad");
  else s(tokens.length, 23, `One value left: the answer is <b>${stack[0]}</b>.`, "good");
  return snaps;
}

function postfixView(sn) {
  const toks = sn.tokens.map((t, k) => cell(t, k === sn.k ? "cur" : k < sn.k ? "done" : "")).join("");
  const st = sn.stack.map((v, k) => cell(v, k === sn.stack.length - 1 ? "par" : "")).join("");
  const vars = Object.entries(sn.vars).map(([k, v]) => `<div class="stat"><small>${k}</small><b>${v}</b></div>`).join("");
  return `${cellsRow("tokens", toks)}<div class="l13-two" style="margin-top:8px"><div><small class="counter">stack (top at the top)</small><div class="l13-stack">${st}</div></div><div class="l13-info" style="margin-top:0">${vars}</div></div>`;
}

function demoPostfix(el, { mini = false } = {}) {
  let expr = "2 3 2 4 * + *";
  return makePlayer(el, {
    mini, code: CODE.evalPostfix, interval: 900,
    extraControls: `<label>postfix <input type="text" class="pf-text l13-wide" value="${expr}" aria-label="postfix expression"></label>
      <label><select class="pf-pre"><option value="2 3 2 4 * + *">2 3 2 4 * + *</option><option value="2 3 4 * +">2 3 4 * +</option><option value="2 3 + 4 *">2 3 + 4 *</option><option value="8 2 -">8 2 -</option><option value="5 1 2 + 4 * + 3 -">5 1 2 + 4 * + 3 -</option><option value="7 2 /">7 2 /</option><option value="1 +">1 + (invalid)</option></select></label>`,
    build: () => tracePostfix(expr),
    render: (s) => mini ? `${postfixView(s)}<div class="l13-out">${s.msg.replace(/<[^>]+>/g, "")}</div>` : postfixView(s),
    onMount: (root_, rebuild) => {
      const inp = root_.querySelector(".pf-text"), sel = root_.querySelector(".pf-pre");
      if (!inp) return;
      inp.onchange = () => { expr = inp.value; rebuild(); };
      sel.onchange = () => { expr = inp.value = sel.value; rebuild(); };
    },
  });
}

// ---------- Demo 7: rebuilding from preorder + inorder (or inorder + postorder) ----------

function tokens(s) {
  const t = String(s).trim();
  if (/[\s,]/.test(t)) return t.split(/[\s,]+/).filter(Boolean);
  return [...t];
}

// Twin of Rebuild.preIn / Rebuild.inPost. Records which part of each sequence a call works on.
function traceRebuild(first, inorder, mode) {
  const t = new Tracer();
  const placed = [];                         // {label, ix (inorder index), depth, parent ix, done}
  const seqName = mode === "preIn" ? "preorder" : "postorder";
  const ex = (seg) => ({ seg, placed: placed.map((p) => ({ ...p })) });
  if (first.length !== inorder.length) { t.snap(0, "The sequences have different lengths.", "bad", ex(null)); return { snaps: t.snaps, ok: false }; }
  const where = new Map();
  for (let k = 0; k < inorder.length; k++) {
    if (where.has(inorder[k])) { t.snap(0, `Duplicate value <b>${esc(inorder[k])}</b>: the method needs distinct elements.`, "bad", ex(null)); return { snaps: t.snaps, ok: false }; }
    where.set(inorder[k], k);
  }
  let ok = true;
  function build(p, i, n, depth, parentIx) {
    const f = t.push(`${mode}(${mode === "preIn" ? "p" : "q"}=${p}, i=${i}, n=${n})`, {});
    const seg = { p, i, n, r: null };
    if (n === 0) { t.snap(3, "Empty segment (<code>n == 0</code>): an empty subtree, return <code>null</code>.", "", ex(seg)); t.pop(); return null; }
    const rootValue = mode === "preIn" ? first[p] : first[p + n - 1];
    t.snap(6, `The ${mode === "preIn" ? "first" : "last"} element of this ${seqName} segment is the root: <b>${esc(rootValue)}</b>.`, "", ex(seg));
    const r = where.get(rootValue);
    if (r === undefined || r < i || r >= i + n) {
      t.snap(9, `<b>${esc(rootValue)}</b> is not inside the matching inorder segment: no tree has these two sequences.`, "bad", ex(seg));
      ok = false; t.pop(); throw new Error("bad");
    }
    seg.r = r;
    const leftSize = r - i;
    placed.push({ label: rootValue, ix: r, depth, parentIx, done: false });
    f.vars = { root: rootValue, r, leftSize };
    t.snap(11, `In the inorder, <b>${esc(rootValue)}</b> is at position ${r}: ${leftSize} node${leftSize === 1 ? "" : "s"} on its left, ${n - 1 - leftSize} on its right.`, "", ex(seg));
    f.status = "waiting: left subtree";
    t.snap(12, "Rebuild the left subtree from the left parts.", "", ex(seg));
    build(mode === "preIn" ? p + 1 : p, i, leftSize, depth + 1, r);
    f.status = "waiting: right subtree";
    t.snap(13, "Rebuild the right subtree from the right parts.", "", ex(seg));
    build(mode === "preIn" ? p + 1 + leftSize : p + leftSize, r + 1, n - 1 - leftSize, depth + 1, r);
    placed.find((x) => x.ix === r).done = true;
    f.status = `returns ${rootValue}`; f.cls = "ret";
    t.snap(14, `<code>makeBT(left, ${esc(rootValue)}, right)</code>: the subtree rooted at <b>${esc(rootValue)}</b> is complete.`, "good", ex(seg));
    t.pop();
    return rootValue;
  }
  try { build(0, 0, inorder.length, 0, null); } catch (e) { return { snaps: t.snaps, ok: false }; }
  t.snap(0, "Done: every element has been placed exactly once.", "good", ex(null));
  return { snaps: t.snaps, ok };
}

function rebuildView(first, inorder, mode, extra, mini = false) {
  const seg = extra.seg;
  const n = inorder.length;
  const roleFirst = (k) => {
    if (!seg || seg.n === 0) return seg ? "dim" : "";
    const lo = seg.p, hi = seg.p + seg.n - 1;
    if (k < lo || k > hi) return "dim";
    const rootK = mode === "preIn" ? lo : hi;
    if (k === rootK) return "cur";
    if (seg.r == null) return "";
    const ls = seg.r - seg.i;
    const leftLo = mode === "preIn" ? lo + 1 : lo;
    return k < leftLo + ls ? "lft" : "rgt";
  };
  const roleIn = (k) => {
    if (!seg || seg.n === 0) return seg ? "dim" : "";
    if (k < seg.i || k >= seg.i + seg.n) return "dim";
    if (seg.r == null) return "";
    return k === seg.r ? "cur" : k < seg.r ? "lft" : "rgt";
  };
  const rows = mode === "preIn"
    ? cellsRow("preorder", first.map((v, k) => cell(v, roleFirst(k))).join("")) + cellsRow("inorder", inorder.map((v, k) => cell(v, roleIn(k))).join(""))
    : cellsRow("inorder", inorder.map((v, k) => cell(v, roleIn(k))).join("")) + cellsRow("postorder", first.map((v, k) => cell(v, roleFirst(k))).join(""));
  // Tree: x = inorder index, y = depth (the final layout, known as soon as a root is placed).
  const W = 600, rowH = 52, slotW = W / Math.max(n, 1), r = Math.max(8, Math.min(17, slotW / 2 - 2));
  const maxD = Math.max(0, ...extra.placed.map((p) => p.depth));
  const cx = (ix) => (ix + 0.5) * slotW, cy = (d) => 20 + d * rowH;
  let g = `<svg viewBox="0 0 ${W} ${Math.max(4, maxD + 1) * rowH}" role="img" aria-label="tree being rebuilt">`;
  const byIx = new Map(extra.placed.map((p) => [p.ix, p]));
  extra.placed.forEach((p) => { if (p.parentIx != null) { const q = byIx.get(p.parentIx); g += `<line x1="${cx(q.ix)}" y1="${cy(q.depth) + r}" x2="${cx(p.ix)}" y2="${cy(p.depth) - r}" stroke="var(--ink-2)" stroke-width="1.4"/>`; } });
  extra.placed.forEach((p) => {
    const cur = seg && seg.r === p.ix;
    g += `<circle cx="${cx(p.ix)}" cy="${cy(p.depth)}" r="${r}" fill="${cur ? "var(--mark)" : p.done ? "var(--green-soft)" : "var(--teal-soft)"}" stroke="${cur ? "var(--amber)" : p.done ? "var(--green)" : "var(--teal)"}" stroke-width="${cur ? 2.4 : 1.4}"/><text x="${cx(p.ix)}" y="${cy(p.depth) + 4}" text-anchor="middle" font-size="${Math.min(13, r * 0.8)}" font-weight="600" fill="var(--ink)">${esc(p.label)}</text>`;
  });
  g += "</svg>";
  return `${rows}<div class="svgbox" style="margin-top:8px">${g}</div>`;
}

function demoRebuild(el, { mini = false } = {}) {
  let mode = "preIn";
  let firstText = "A B C D E X Z U T Y", inText = "D C E B A U Z T X Y";
  const POST = "D E C B U T Z Y X A";
  let first = tokens(firstText), inorder = tokens(inText);
  if (mini) {
    return makePlayer(el, {
      mini: true, interval: 1000,
      build: () => traceRebuild(first, inorder, mode).snaps.filter((s) => s.line !== 3 && s.line !== 12 && s.line !== 13),
      render: (s) => rebuildView(first, inorder, mode, s.extra, true),
    });
  }
  return makeStepper(el, {
    code: () => mode === "preIn" ? CODE.preIn : CODE.inPost,
    build: () => traceRebuild(first, inorder, mode).snaps,
    renderExtra: (s) => rebuildView(first, inorder, mode, s.extra),
    stackLabel: "call stack",
    extraControls: `<label><select class="rb-mode"><option value="preIn">preorder + inorder</option><option value="inPost">inorder + postorder</option></select></label>
      <label><span class="rb-l1">preorder</span> <input type="text" class="rb-first l13-wide" value="${firstText}"></label>
      <label>inorder <input type="text" class="rb-in l13-wide" value="${inText}"></label>`,
    onMount: (root_, rebuild) => {
      const m = root_.querySelector(".rb-mode"), f = root_.querySelector(".rb-first"), i = root_.querySelector(".rb-in"), l1 = root_.querySelector(".rb-l1");
      const set = () => { first = tokens(f.value); inorder = tokens(i.value); rebuild(); };
      m.onchange = () => {
        mode = m.value;
        l1.textContent = mode === "preIn" ? "preorder" : "postorder";
        if (i.value.trim() === inText) f.value = mode === "preIn" ? firstText : POST;
        set();
      };
      f.onchange = set; i.onchange = set;
    },
  });
}

// ---------- Demo 8: preorder + postorder are ambiguous ----------

// Twin of PrePostAmbiguity.treesWithPreorder (same order of results).
function treesWithPreorder(pre, p, n) {
  if (n === 0) return [null];
  const out = [];
  for (let k = 0; k < n; k++) {
    for (const left of treesWithPreorder(pre, p + 1, k)) {
      for (const right of treesWithPreorder(pre, p + 1 + k, n - 1 - k)) out.push({ label: pre[p], left, right });
    }
  }
  return out;
}

function demoPrePost(el) {
  let preText = "ABC", postText = "CBA";
  return makePlayer(el, {
    extraControls: `<label>preorder <input type="text" class="pp-pre l13-wide" style="width:140px" value="${preText}"></label><label>postorder <input type="text" class="pp-post l13-wide" style="width:140px" value="${postText}"></label>`,
    build: () => {
      const pre = tokens(preText), post = tokens(postText);
      if (pre.length > 8) return [{ msg: "Use at most 8 nodes (there are 4862 binary trees with 9 nodes).", msgCls: "bad" }];
      const all = treesWithPreorder(pre, 0, pre.length);
      const match = all.filter((t) => orderOf(t, "postorder").map((x) => x.label).join(" ") === post.join(" "));
      if (!match.length) return [{ msg: `${all.length} binary trees have this preorder, but none of them has this postorder.`, msgCls: "bad" }];
      return match.map((t, k) => ({ t, msg: `Tree ${k + 1} of ${match.length} with preorder ${esc(pre.join(" "))} and postorder ${esc(post.join(" "))} (out of ${all.length} trees with this preorder): <code>${esc(formatTree(t))}</code>. Amber nodes have exactly one child — left or right, the two sequences cannot tell.`, msgCls: match.length === 1 ? "good" : "" }));
    },
    render: (s) => s.t ? `<div class="svgbox">${treeSVG(s.t, { width: 520, rowH: 54, layout: "id", style: (n) => (!n.left) !== (!n.right) ? { fill: "var(--mark)", stroke: "var(--amber)", sw: 2 } : {} })}</div>` : "",
    onMount: (root_, rebuild) => {
      const a = root_.querySelector(".pp-pre"), b = root_.querySelector(".pp-post");
      a.onchange = () => { preText = a.value; rebuild(); };
      b.onchange = () => { postText = b.value; rebuild(); };
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
  terms: (el) => demoTerms(el),
  termsMini: (el) => demoTerms(el, { mini: true }),
  shapes: (el) => demoShapes(el),
  shapesMini: (el) => demoShapes(el, { mini: true }),
  makeBT: (el) => demoMakeBT(el),
  arrayRep: (el) => demoArray(el),
  arrayMini: (el) => demoArray(el, { mini: true }),
  traverse: (el) => demoTraverse(el),
  traverseMini: (el) => demoTraverse(el, { mini: true }),
  traverseExpr: (el) => demoTraverse(el, { tree: "+(-(/(+(A,B),*(C,D)),*(E,-(F,G))),H)", order: "postorder" }),
  postfix: (el) => demoPostfix(el),
  postfixMini: (el) => demoPostfix(el, { mini: true }),
  rebuild: (el) => demoRebuild(el),
  rebuildMini: (el) => demoRebuild(el, { mini: true }),
  prePost: (el) => demoPrePost(el),
  quiz: (el) => demoQuiz(el, QUIZ),
};
