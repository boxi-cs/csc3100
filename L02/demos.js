// Interactive demos for Lecture 2. CODE and OUT are copied from notes/L02-java-basics.md (checked
// by tools/check.py); the JS twins below replay what the Java does, step by step.

const CODE = {
  welcome: "public class Welcome {\n    public static void main(String[] args) {\n        System.out.println(\"Welcome to Java!\");\n    }\n}",
  keywordAsNameBad: "public class KeywordAsName {\n    public static void main(String[] args) {\n        String this = \"Hello World!\";    // \"this\" is a keyword: does not compile\n        System.out.println(this);\n    }\n}",
  primitiveRanges: "public class PrimitiveRanges {\n    public static void main(String[] args) {\n        System.out.println(\"byte:   \" + Byte.MIN_VALUE + \" to \" + Byte.MAX_VALUE);\n        System.out.println(\"short:  \" + Short.MIN_VALUE + \" to \" + Short.MAX_VALUE);\n        System.out.println(\"int:    \" + Integer.MIN_VALUE + \" to \" + Integer.MAX_VALUE);\n        System.out.println(\"long:   \" + Long.MIN_VALUE + \" to \" + Long.MAX_VALUE);\n        System.out.println(\"char:   \" + (int) Character.MIN_VALUE + \" to \" + (int) Character.MAX_VALUE);\n        System.out.println(\"double: largest \" + Double.MAX_VALUE);\n\n        int big = Integer.MAX_VALUE;\n        System.out.println(\"Integer.MAX_VALUE + 1 = \" + (big + 1));   // overflow wraps around\n        byte b = 127;\n        b++;\n        System.out.println(\"byte 127, then ++ : \" + b);\n        System.out.println(\"0.1 + 0.2 = \" + (0.1 + 0.2));            // binary fractions are inexact\n    }\n}",
  varExample: "public class VarExample {\n    public static void main(String[] args) {\n        int age = 25;                  // integer variable\n        String name = \"CSC3100\";       // String variable\n        double salary = 50000.50;      // double variable\n        char grade = 'h';              // character variable\n\n        System.out.println(\"Age: \" + age);\n        System.out.println(\"Name: \" + name);\n        System.out.println(\"Salary: \" + salary);\n        System.out.println(\"Character: \" + grade);\n    }\n}",
  guru99Bad: "class Guru99 {\n    static int a = 1;      // static variable: in the class, with static\n    int data = 99;         // instance variable: in the class, without static\n    void method() {\n        int b = 90;        // local variable: inside a method\n    }\n}",
  localVariables: "public class LocalVariables {\n    public static void main(String[] args) {\n        int x = 10;                        // local to main\n        String message = \"Hello, world!\";  // also local to main\n        System.out.println(\"x = \" + x);\n        System.out.println(\"message = \" + message);\n        if (x > 5) {\n            String result = \"x is greater than 5\";   // local to the if block\n            System.out.println(result);\n        }\n        // System.out.println(result);   // error: cannot find symbol -- result is out of scope\n    }\n}",
  staticVariables: "public class StaticVariables {\n    static String course = \"CSC3100\";   // one copy, shared by the whole class\n\n    public static void main(String[] args) {\n        System.out.println(\"Course is: \" + StaticVariables.course);\n        StaticVariables.course = \"CSC3100 Data Structures\";\n        System.out.println(\"Course is: \" + course);   // inside the class, the short name works\n    }\n}",
  instanceVariables: "public class InstanceVariables {\n    public String name;   // instance variable, set by the constructor\n    public int i;         // instance variable, never set: default value 0\n\n    public InstanceVariables() {\n        this.name = \"Ada\";\n    }\n\n    public static void main(String[] args) {\n        InstanceVariables obj = new InstanceVariables();   // create an object\n        System.out.println(\"Name is: \" + obj.name);\n        System.out.println(\"Default value for int is \" + obj.i);\n    }\n}",
  student: "class Student {\n    static int count = 0;   // static: one copy for the class\n    String name;            // instance: one copy per object\n\n    Student(String name) {\n        this.name = name;\n        count++;            // every new Student increases the shared counter\n    }\n\n    String describe() {\n        String temp = name + \" is student \" + count;   // local: gone when describe returns\n        return temp;\n    }\n}",
  variableKinds: "public class VariableKinds {\n    public static void main(String[] args) {\n        Student a = new Student(\"Ann\");\n        System.out.println(a.describe());\n        Student b = new Student(\"Bob\");\n        System.out.println(b.describe());\n        System.out.println(a.describe());\n        System.out.println(\"Student.count = \" + Student.count);\n    }\n}",
  ifElse: "public class IfElse {\n    public static void main(String[] args) {\n        int i = 10;\n        if (i < 15) {\n            System.out.println(\"i is smaller than 15\");\n        } else {\n            System.out.println(\"i is greater than or equal to 15\");\n        }\n\n        int score = 15;\n        if (score > 15) {\n            System.out.println(score + \" is greater than 15\");\n        } else if (score == 15) {\n            System.out.println(score + \" is equal to 15\");\n        } else {\n            System.out.println(score + \" is smaller than 15\");\n        }\n    }\n}",
  logicalOperators: "public class LogicalOperators {\n    public static void main(String[] args) {\n        boolean x = true;\n        boolean y = false;\n        System.out.println(\"x && y: \" + (x && y));\n        System.out.println(\"x || y: \" + (x || y));\n        System.out.println(\"!x: \" + (!x));\n\n        String s = null;\n        // && stops as soon as the answer is known: s.length() is never called when s is null.\n        if (s != null && s.length() > 0) {\n            System.out.println(\"s is not empty\");\n        } else {\n            System.out.println(\"s is null or empty\");\n        }\n    }\n}",
  whileExp: "public class WhileExp {\n    public static void main(String[] args) {\n        double sum = 0.0;\n        double term = 1.0;    // the current term, 1/(k-1)!\n        int k = 1;\n        while (term >= 0.0001) {\n            sum += term;      // same as sum = sum + term;\n            term = term / k;  // 1/(k-1)!  becomes  1/k!\n            k++;              // same as k = k + 1;\n        }\n        System.out.println(\"exp(1) = \" + sum);\n        System.out.println(\"terms added: \" + (k - 1));\n        System.out.println(\"Math.E = \" + Math.E);\n    }\n}",
  forHarmonic: "public class ForHarmonic {\n    public static void main(String[] args) {\n        double sum = 0.0;\n        for (int i = 1; i <= 100; i++) {   // i = 1, 2, ..., 100\n            sum += 1.0 / i;                // 1.0, not 1: 1 / i would be integer division\n        }\n        System.out.println(\"1 + 1/2 + 1/3 + ... + 1/100 = \" + sum);\n    }\n}",
  breakContinue: "public class BreakContinue {\n    public static void main(String[] args) {\n        for (int i = 1; i <= 10; i++) {\n            if (i % 3 == 0) {\n                continue;      // skip multiples of 3\n            }\n            if (i > 7) {\n                break;         // stop the loop completely\n            }\n            System.out.print(i + \" \");\n        }\n        System.out.println();\n    }\n}",
  turtle: "class Turtle {\n    private boolean penDown;   // fields: one copy per Turtle object\n    protected int x, y;\n\n    public Turtle(int initX, int initY) {   // constructor\n        x = initX;\n        y = initY;\n        penDown = false;\n    }\n\n    public void jumpTo(int newX, int newY) {   // general method, no result\n        x = newX;\n        y = newY;\n    }\n\n    public int getX() {                        // general method, returns an int\n        return x;\n    }\n\n    public int getY() {\n        return y;\n    }\n}",
  turtleDemo: "public class TurtleDemo {\n    public static void main(String[] args) {\n        Turtle t;                       // a variable that can refer to a Turtle; no object yet\n        t = new Turtle(100, 100);       // create the object, run the constructor\n        int a = t.getX();               // call a method that returns a value\n        System.out.println(\"a = \" + a);\n        t.jumpTo(300, 200);             // call a method that changes the object\n        System.out.println(\"t is at (\" + t.getX() + \", \" + t.getY() + \")\");\n\n        Turtle u = t;                   // copies the reference, not the turtle\n        u.jumpTo(5, 5);\n        System.out.println(\"t is at (\" + t.getX() + \", \" + t.getY() + \")\");\n    }\n}",
  person: "class Person {\n    private String name;\n    private int age;\n\n    public Person(String n, int m) {\n        name = n;\n        age = m;\n    }\n\n    public String getName() {\n        return name;\n    }\n\n    public int getAge() {\n        return age;\n    }\n\n    public void show() {\n        System.out.println(name + \"\\n\" + age);\n    }\n}",
  constructorDemo: "public class ConstructorDemo {\n    public static void main(String[] args) {\n        Person z = new Person(\"zhangsan\", 3);\n        z.show();\n        System.out.println(z.getName() + \" is \" + z.getAge());\n    }\n}",
  natural: "import java.io.IOException;\n\nclass Natural {\n    // Return the natural number written in text, e.g. \"21\" -> 21.\n    static int parse(String text) throws IOException {\n        if (text.isEmpty()) {\n            throw new IOException(\"bad natural number: empty\");\n        }\n        int value = 0;\n        for (int i = 0; i < text.length(); i++) {\n            char ch = text.charAt(i);\n            if (ch < '0' || ch > '9') {\n                throw new IOException(\"bad natural number: \" + text);\n            }\n            value = value * 10 + (ch - '0');   // '7' - '0' is 7\n        }\n        return value;\n    }\n}",
  catchDemo: "import java.io.IOException;\n\npublic class CatchDemo {\n    public static void main(String[] args) {\n        String[] inputs = {\"21\", \"4x2\"};\n        for (String input : inputs) {\n            int m, n;\n            try {\n                n = Natural.parse(input);\n                m = n * 2;              // skipped if parse throws\n            } catch (IOException e) {\n                System.out.println(\"caught: \" + e.getMessage());\n                n = 1;                  // the input was wrong: use 1 as default\n                m = 2;\n            } finally {\n                System.out.println(\"finally runs for \\\"\" + input + \"\\\"\");\n            }\n            System.out.println(\"n = \" + n + \", m = \" + m);\n        }\n    }\n}",
  commonExceptions: "public class CommonExceptions {\n    public static void main(String[] args) {\n        int[] data = new int[3];\n        String s = null;\n        try {\n            data[3] = 1;\n        } catch (ArrayIndexOutOfBoundsException e) {\n            System.out.println(e);\n        }\n        try {\n            System.out.println(s.length());\n        } catch (NullPointerException e) {\n            System.out.println(\"NullPointerException\");\n        }\n        try {\n            System.out.println(10 / (data.length - 3));\n        } catch (ArithmeticException e) {\n            System.out.println(e);\n        }\n        System.out.println(10.0 / 0);   // no exception for double: the result is Infinity\n    }\n}",
  uncaught: "public class Uncaught {\n    public static void main(String[] args) {\n        int[] data = {4, 8, 15};\n        System.out.println(\"before\");\n        System.out.println(data[data.length]);   // the last index is length - 1\n        System.out.println(\"after\");             // never reached\n    }\n}",
  arrayBasics: "public class ArrayBasics {\n    public static void main(String[] args) {\n        int[] someInts;                // declaration: a reference to an int array\n        someInts = new int[5];         // initialisation: 5 ints, all 0\n        for (int i = 0; i < someInts.length; i++) {   // indices 0 .. length - 1\n            someInts[i] = i * i;\n        }\n        for (int i = 0; i < someInts.length; i++) {\n            System.out.print(someInts[i] + \" \");\n        }\n        System.out.println();\n\n        Turtle[] turtleFarm = new Turtle[3];   // 3 references, all null: no Turtle yet\n        System.out.println(\"turtleFarm[0] = \" + turtleFarm[0]);\n        turtleFarm[0] = new Turtle(1, 2);      // now element 0 refers to a Turtle\n        System.out.println(\"turtleFarm[0].getX() = \" + turtleFarm[0].getX());\n\n        int[] primes = {2, 3, 5, 7};           // declaration and initialisation together\n        System.out.println(\"primes has \" + primes.length + \" elements, last \" + primes[primes.length - 1]);\n    }\n}",
  sumPairs: "import java.io.*;\nimport java.nio.file.Files;\n\npublic class SumPairs {\n    public static void main(String[] args) {\n        try {\n            File dir = Files.createTempDirectory(\"csc3100\").toFile();\n            File in = new File(dir, \"inputInfo.txt\");\n            File out = new File(dir, \"outputInfo.txt\");\n            try (FileWriter w = new FileWriter(in)) {\n                w.write(\"1 3\\n2 4\\n5 6\\n\");\n            }\n\n            BufferedReader reader = new BufferedReader(new FileReader(in));\n            BufferedWriter writer = new BufferedWriter(new FileWriter(out));\n            String line;\n            while ((line = reader.readLine()) != null) {   // null at the end of the file\n                String[] parts = line.split(\" \");\n                int a = Integer.parseInt(parts[0]);\n                int b = Integer.parseInt(parts[1]);\n                writer.write(String.valueOf(a + b));\n                writer.newLine();\n            }\n            writer.close();                                // flushes and closes\n            reader.close();\n\n            BufferedReader check = new BufferedReader(new FileReader(out));\n            while ((line = check.readLine()) != null) {\n                System.out.println(line);\n            }\n            check.close();\n            in.delete();\n            out.delete();\n            dir.delete();\n        } catch (IOException e) {\n            System.out.println(\"something wrong: \" + e);\n        }\n    }\n}",
  stringDemo: "public class StringDemo {\n    public static void main(String[] args) {\n        char[] letters = {'R', 'O', 'S', 'E'};\n        String fromChars = new String(letters);   // a String built from a char array\n        String s = \"CSC3100\";\n        s.concat(\" Data Structure\");              // returns a new string, which is thrown away\n        System.out.println(\"fromChars: \" + fromChars);\n        System.out.println(\"s: \" + s);\n        System.out.println(s.concat(\" Data Structure\"));\n        s = s.concat(\" Data Structure\");          // keep the new string\n        System.out.println(\"s: \" + s);\n\n        System.out.println(s.length() + \" \" + s.charAt(0) + \" \" + s.indexOf(\"Data\") + \" \" + s.substring(8, 12));\n\n        String a = \"hello\";\n        String b = new String(\"hello\");\n        System.out.println(\"a == b: \" + (a == b));            // two different objects\n        System.out.println(\"a.equals(b): \" + a.equals(b));    // same characters\n    }\n}",
  printDemo: "public class PrintDemo {\n    public static void main(String[] args) {\n        System.out.print(\"I would like \");\n        System.out.println(\"to live in a tree\");\n        System.out.println(\"or else I get cramp\");\n\n        int a;\n        a = 6 * 7;\n        System.out.println(\"6 * 7 = \" + a);\n        System.out.println(\"1 + 2 = \" + 1 + 2);       // left to right: \"1 + 2 = 1\" then \"2\"\n        System.out.println(\"1 + 2 = \" + (1 + 2));\n        System.out.printf(\"pi is about %.3f%n\", Math.PI);\n    }\n}",
  casting: "public class Casting {\n    public static void main(String[] args) {\n        double radians = 1.0;\n        int degrees = (int) (radians * 180 / 3.141592653);\n        System.out.println(\"degrees = \" + degrees);\n\n        int n = 7;\n        double d = n;                      // int -> double: automatic\n        System.out.println(\"d = \" + d);\n        System.out.println((int) 3.99 + \" \" + (int) -3.99 + \" \" + Math.round(3.99));\n        System.out.println(7 / 2 + \" \" + 7 / 2.0 + \" \" + (double) 7 / 2);\n        System.out.println((int) 'A' + \" \" + (char) 66 + \" \" + (char) ('a' + 2));\n        System.out.println((byte) 200);    // narrowing an int keeps only the low 8 bits\n    }\n}",
  arrayListDemo: "import java.util.ArrayList;\n\npublic class ArrayListDemo {\n    public static void main(String[] args) {\n        ArrayList<String> names = new ArrayList<>();   // the element type goes in < >\n        names.add(\"Ann\");\n        names.add(\"Bob\");\n        names.add(\"Cy\");\n        names.add(1, \"Dee\");                // insert at index 1; later elements shift right\n        System.out.println(names + \" size \" + names.size());\n        System.out.println(\"names.get(2) = \" + names.get(2));\n        names.remove(\"Bob\");                // remove by value\n        names.remove(0);                    // remove by index\n        System.out.println(names + \" size \" + names.size());\n\n        ArrayList<Integer> nums = new ArrayList<>();   // Integer, not int\n        for (int i = 10; i <= 50; i += 10) {\n            nums.add(i);\n        }\n        nums.remove(1);                     // an int argument means the INDEX: removes 20\n        nums.remove(Integer.valueOf(40));   // an Integer object means the VALUE: removes 40\n        System.out.println(nums);\n    }\n}",
  itemWrong: "class ItemWrong {\n    String name;\n\n    ItemWrong(String name) {\n        name = name;          // assigns the parameter to itself; the field stays null\n    }\n}",
  item: "class Item {\n    String name;\n\n    Item(String name) {\n        this.name = name;     // this.name is the field, name is the parameter\n    }\n}",
  thisDemo: "public class ThisDemo {\n    public static void main(String[] args) {\n        ItemWrong w = new ItemWrong(\"car\");\n        Item r = new Item(\"car\");\n        System.out.println(w.name);\n        System.out.println(r.name);\n    }\n}",
  fibonacciLoop: "public class FibonacciLoop {\n    public static void main(String[] args) {\n        int n1 = 0, n2 = 1, n3;\n        int count = 10;\n        System.out.print(n1 + \" \" + n2);        // the first two numbers\n        for (int i = 2; i < count; i++) {       // starts at 2: two numbers are already printed\n            n3 = n1 + n2;\n            System.out.print(\" \" + n3);\n            n1 = n2;\n            n2 = n3;\n        }\n        System.out.println();\n    }\n}",
  fibonacciRecursive: "public class FibonacciRecursive {\n    static int n1 = 0, n2 = 1, n3 = 0;\n\n    static void printFibonacci(int count) {\n        if (count > 0) {\n            n3 = n1 + n2;\n            n1 = n2;\n            n2 = n3;\n            System.out.print(\" \" + n3);\n            printFibonacci(count - 1);     // print the remaining count - 1 numbers\n        }\n    }\n\n    public static void main(String[] args) {\n        int count = 10;\n        System.out.print(n1 + \" \" + n2);\n        printFibonacci(count - 2);         // two numbers are already printed\n        System.out.println();\n    }\n}",
  gcd: "public class Gcd {\n    static int gcdByBruteForce(int n1, int n2) {\n        int gcd = 1;\n        for (int i = 1; i <= n1 && i <= n2; i++) {\n            if (n1 % i == 0 && n2 % i == 0) {\n                gcd = i;\n            }\n        }\n        return gcd;\n    }\n\n    static int gcdByEuclid(int n1, int n2) {\n        if (n2 == 0) {\n            return n1;\n        }\n        return gcdByEuclid(n2, n1 % n2);\n    }\n\n    public static void main(String[] args) {\n        System.out.println(\"GCD of 15 and 20 is: \" + gcdByBruteForce(15, 20));\n        System.out.println(\"GCD of 7 and 5 is: \" + gcdByBruteForce(7, 5));\n        System.out.println(\"GCD of 15 and 20 is: \" + gcdByEuclid(15, 20));\n        System.out.println(\"GCD of 1071 and 462 is: \" + gcdByEuclid(1071, 462));\n    }\n}",
  primeCheck: "public class PrimeCheck {\n    static boolean isPrime(int n) {\n        if (n < 2) {\n            return false;               // 0, 1 and negative numbers are not prime\n        }\n        for (int i = 2; i <= n / 2; i++) {\n            if (n % i == 0) {\n                return false;           // found a divisor: stop at once\n            }\n        }\n        return true;\n    }\n\n    public static void main(String[] args) {\n        int[] tests = {0, 1, 2, 3, 4, 17, 21, 97};\n        for (int n : tests) {\n            System.out.println(n + (isPrime(n) ? \" is prime number\" : \" is not prime number\"));\n        }\n    }\n}",
  palindromeNumber: "public class PalindromeNumber {\n    static boolean isPalindrome(int n) {\n        int temp = n;          // keep the original\n        int reversed = 0;\n        while (n > 0) {\n            int r = n % 10;                 // last digit\n            reversed = reversed * 10 + r;   // append it to the reversed number\n            n = n / 10;                     // drop it\n        }\n        return temp == reversed;\n    }\n\n    public static void main(String[] args) {\n        int[] tests = {454, 34543, 123, 10};\n        for (int n : tests) {\n            System.out.println(n + (isPalindrome(n) ? \" palindrome number\" : \" not palindrome\"));\n        }\n    }\n}",
  palindromeString: "import java.util.Scanner;\n\npublic class PalindromeString {\n    public static void main(String[] args) {\n        Scanner in = new Scanner(System.in);\n        System.out.println(\"Enter a string/number to check if it is a palindrome\");\n        String original = in.nextLine();\n        String reverse = \"\";\n        for (int i = original.length() - 1; i >= 0; i--) {\n            reverse = reverse + original.charAt(i);\n        }\n        if (original.equals(reverse)) {\n            System.out.println(\"Entered string/number is a palindrome.\");\n        } else {\n            System.out.println(\"Entered string/number isn't a palindrome.\");\n        }\n    }\n}",
  createObject: "public class CreateObject {\n    void show() {\n        System.out.println(\"Welcome to CSC3100\");\n    }\n\n    public static void main(String[] args) {\n        CreateObject obj = new CreateObject();   // create an object with new\n        obj.show();                              // call a method on it\n    }\n}",
  asciiValues: "public class AsciiValues {\n    public static void main(String[] args) {\n        char ch1 = 'a';\n        char ch2 = 'b';\n        int code1 = ch1;              // way 1: assign the char to an int (automatic widening)\n        int code2 = (int) ch2;        // way 2: an explicit cast\n        System.out.println(\"The ASCII value of \" + ch1 + \" is: \" + code1);\n        System.out.println(\"The ASCII value of \" + ch2 + \" is: \" + code2);\n        System.out.println(\"The character with code 65 is: \" + (char) 65);\n        System.out.println(\"'7' - '0' = \" + ('7' - '0'));\n    }\n}",
  countCharacters: "public class CountCharacters {\n    public static void main(String[] args) {\n        String text = \"The best of both worlds\";\n        int count = 0;\n        for (int i = 0; i < text.length(); i++) {\n            if (text.charAt(i) != ' ') {     // single quotes: a char\n                count++;\n            }\n        }\n        System.out.println(\"Total number of characters in a string: \" + count);\n    }\n}",
  countPunctuation: "public class CountPunctuation {\n    public static void main(String[] args) {\n        String str = \"He said, 'The mailman loves you.' I heard it with my own ears.\";\n        int count = 0;\n        for (int i = 0; i < str.length(); i++) {\n            char c = str.charAt(i);\n            if (c == '!' || c == ',' || c == ';' || c == '.' || c == '?'\n                    || c == '-' || c == '\\'' || c == '\\\"' || c == ':') {\n                count++;\n            }\n        }\n        System.out.println(\"The number of punctuations exists in the string is: \" + count);\n    }\n}",
  changeCase: "public class ChangeCase {\n    public static void main(String[] args) {\n        String str1 = \"Great Power\";\n        StringBuilder newStr = new StringBuilder(str1);\n        for (int i = 0; i < str1.length(); i++) {\n            char c = str1.charAt(i);\n            if (Character.isLowerCase(c)) {\n                newStr.setCharAt(i, Character.toUpperCase(c));   // lower -> upper\n            } else if (Character.isUpperCase(c)) {\n                newStr.setCharAt(i, Character.toLowerCase(c));   // upper -> lower\n            }\n        }\n        System.out.println(\"String after case conversion: \" + newStr);\n    }\n}",
  stringRotation: "public class StringRotation {\n    static boolean isRotation(String str1, String str2) {\n        if (str1.length() != str2.length()) {\n            return false;\n        }\n        String doubled = str1.concat(str1);\n        return doubled.indexOf(str2) != -1;     // -1 means \"not found\"\n    }\n\n    public static void main(String[] args) {\n        System.out.println(isRotation(\"abcde\", \"deabc\"));\n        System.out.println(isRotation(\"abcde\", \"abced\"));\n        System.out.println(isRotation(\"abcde\", \"abcdeabcde\"));\n    }\n}",
  fileCreate: "import java.io.*;\nimport java.nio.file.Files;\n\npublic class FileCreate {\n    public static void main(String[] args) {\n        try {\n            File dir = Files.createTempDirectory(\"csc3100\").toFile();\n            File file = new File(dir, \"javaFile123.txt\");\n            System.out.println(\"exists before: \" + file.exists());\n            for (int k = 0; k < 2; k++) {\n                if (file.createNewFile()) {\n                    System.out.println(\"New File is created!\");\n                } else {\n                    System.out.println(\"File already exists.\");\n                }\n            }\n            System.out.println(\"name: \" + file.getName() + \", absolute: \" + file.isAbsolute()\n                    + \", length: \" + file.length() + \" bytes\");\n            file.delete();\n            dir.delete();\n        } catch (IOException e) {\n            e.printStackTrace();\n        }\n    }\n}",
  fileList: "import java.io.*;\nimport java.nio.file.Files;\nimport java.util.Arrays;\n\npublic class FileList {\n    public static void main(String[] args) throws IOException {\n        File dir = Files.createTempDirectory(\"csc3100\").toFile();\n        String[] names = {\"notes.txt\", \"data.csv\", \"a.java\"};\n        for (String name : names) {\n            try (FileWriter w = new FileWriter(new File(dir, name))) {\n                w.write(\"x\".repeat(name.length()));     // a file of name.length() bytes\n            }\n        }\n\n        File[] files = dir.listFiles();\n        Arrays.sort(files);                              // the order of listFiles is not defined\n        for (File file : files) {\n            System.out.println(file.getName() + \" Can Write: \" + file.canWrite()\n                    + \" Is Hidden: \" + file.isHidden() + \" Length: \" + file.length() + \" bytes\");\n        }\n\n        for (File file : files) {\n            file.delete();\n        }\n        dir.delete();\n    }\n}",
  byteStreams: "import java.io.*;\nimport java.nio.file.Files;\n\npublic class ByteStreams {\n    public static void main(String[] args) {\n        try {\n            File file = Files.createTempFile(\"testout\", \".txt\").toFile();\n\n            FileOutputStream fout = new FileOutputStream(file);\n            fout.write(65);                                   // one byte: 65 is 'A'\n            fout.close();\n            System.out.println(\"after write(65): \" + file.length() + \" byte\");\n\n            fout = new FileOutputStream(file);                // opening again overwrites\n            byte[] b = \"Welcome to CSC3100.\".getBytes();      // string -> byte array\n            fout.write(b);\n            fout.close();\n            System.out.println(\"success...\");\n\n            FileInputStream fin = new FileInputStream(file);\n            int first = fin.read();                           // one byte, as an int\n            System.out.println(\"first byte: \" + first + \" = '\" + (char) first + \"'\");\n            int i;\n            while ((i = fin.read()) != -1) {                  // -1 marks the end of the file\n                System.out.print((char) i);\n            }\n            System.out.println();\n            fin.close();\n            file.delete();\n        } catch (IOException e) {\n            System.out.println(e);\n        }\n    }\n}",
  charStreams: "import java.io.*;\nimport java.nio.file.Files;\n\npublic class CharStreams {\n    public static void main(String[] args) throws IOException {\n        File file = Files.createTempFile(\"testout\", \".txt\").toFile();\n\n        FileWriter fw = new FileWriter(file);\n        fw.write(\"Welcome to CSC3100.\");\n        fw.close();\n        System.out.println(\"Success...\");\n\n        FileReader fr = new FileReader(file);\n        int i;\n        while ((i = fr.read()) != -1) {\n            System.out.print((char) i);\n        }\n        System.out.println();\n        fr.close();\n\n        try (FileWriter w = new FileWriter(file, true)) {   // true: append; closed automatically\n            w.write(\" Bye.\");\n        }\n        try (BufferedReader r = new BufferedReader(new FileReader(file))) {\n            System.out.println(r.readLine());\n        }\n        file.delete();\n    }\n}",
  average: "public class Average {\n    public static void main(String[] args) {\n        int[] marks = {70, 85, 90};\n        int sum = 0;\n        for (int i = 0; i < marks.length; i++) {\n            sum += marks[i];\n        }\n        System.out.println(\"average = \" + (double) sum / marks.length);\n    }\n}",
  exercise2: "public class Exercise2 {\n    static int calls = 0;\n    int id;\n\n    Exercise2() {\n        calls++;\n        id = calls;\n    }\n\n    public static void main(String[] args) {\n        Exercise2 a = new Exercise2();\n        Exercise2 b = new Exercise2();\n        Exercise2 c = a;\n        c.id = 10;\n        System.out.println(a.id + \" \" + b.id + \" \" + c.id + \" \" + calls);\n        String s = \"data\";\n        s.toUpperCase();\n        System.out.println(s + \" \" + (7 / 2) + \" \" + (char) ('A' + 3));\n    }\n}",
  exercise3: "public class Exercise3 {\n    static void printFibonacci(int a, int b, int count) {\n        if (count > 0) {\n            int c = a + b;\n            System.out.print(\" \" + c);\n            printFibonacci(b, c, count - 1);\n        }\n    }\n\n    static long fibonacci(int n) {\n        long previous = 0, current = 1;     // fibonacci(0), fibonacci(1)\n        if (n == 0) {\n            return 0;\n        }\n        for (int i = 2; i <= n; i++) {\n            long next = previous + current;\n            previous = current;\n            current = next;\n        }\n        return current;\n    }\n\n    public static void main(String[] args) {\n        System.out.print(0 + \" \" + 1);\n        printFibonacci(0, 1, 8);\n        System.out.println();\n        System.out.println(\"fibonacci(50) = \" + fibonacci(50));\n    }\n}",
  bankAccount: "class BankAccount {\n    private double balance;\n\n    BankAccount(double balance) {\n        this.balance = balance;\n    }\n\n    void deposit(double amount) {\n        balance += amount;\n    }\n\n    void withdraw(double amount) {\n        if (amount > balance) {\n            throw new IllegalArgumentException(\"insufficient funds: \" + balance + \" < \" + amount);\n        }\n        balance -= amount;\n    }\n\n    double getBalance() {\n        return balance;\n    }\n}",
  bankTest: "public class BankTest {\n    public static void main(String[] args) {\n        BankAccount acc = new BankAccount(100);\n        acc.deposit(50);\n        acc.withdraw(30);\n        System.out.println(\"balance = \" + acc.getBalance());\n        try {\n            acc.withdraw(500);\n        } catch (IllegalArgumentException e) {\n            System.out.println(\"refused: \" + e.getMessage());\n        }\n        System.out.println(\"balance = \" + acc.getBalance());\n    }\n}",
  exercise5: "public class Exercise5 {\n    static int countVowels(String s) {\n        int count = 0;\n        for (int i = 0; i < s.length(); i++) {\n            char c = Character.toLowerCase(s.charAt(i));\n            if (\"aeiou\".indexOf(c) != -1) {\n                count++;\n            }\n        }\n        return count;\n    }\n\n    static String reverseWords(String s) {\n        String[] words = s.split(\" \");\n        StringBuilder sb = new StringBuilder();\n        for (int i = words.length - 1; i >= 0; i--) {\n            sb.append(words[i]);\n            if (i > 0) {\n                sb.append(\" \");\n            }\n        }\n        return sb.toString();\n    }\n\n    public static void main(String[] args) {\n        System.out.println(countVowels(\"Data Structures\"));\n        System.out.println(reverseWords(\"data structures are fun\"));\n    }\n}",
  exercise6: "public class Exercise6 {\n    static boolean isPrime(int n) {\n        if (n < 2) {\n            return false;\n        }\n        for (int i = 2; i * i <= n; i++) {\n            if (n % i == 0) {\n                return false;\n            }\n        }\n        return true;\n    }\n\n    public static void main(String[] args) {\n        int count = 0;\n        for (int n = 0; n < 100; n++) {\n            if (isPrime(n)) {\n                count++;\n            }\n        }\n        System.out.println(count + \" primes below 100\");\n        System.out.println(isPrime(1_000_003));\n    }\n}",
  wordCount: "import java.io.*;\nimport java.nio.file.Files;\n\npublic class WordCount {\n    public static void main(String[] args) throws IOException {\n        File file = Files.createTempFile(\"words\", \".txt\").toFile();\n        try (BufferedWriter w = new BufferedWriter(new FileWriter(file))) {\n            w.write(\"Arrays have a fixed length.\");\n            w.newLine();\n            w.write(\"An ArrayList grows.\");\n            w.newLine();\n            w.write(\"Strings are immutable.\");\n            w.newLine();\n        }\n\n        int lines = 0, words = 0, chars = 0;\n        try (BufferedReader r = new BufferedReader(new FileReader(file))) {\n            String line;\n            while ((line = r.readLine()) != null) {\n                lines++;\n                chars += line.length();\n                if (!line.isBlank()) {\n                    words += line.trim().split(\"\\\\s+\").length;   // split at runs of spaces\n                }\n            }\n        }\n        System.out.println(lines + \" lines, \" + words + \" words, \" + chars + \" characters\");\n        file.delete();\n    }\n}",
};

const OUT = {
  welcome: "Welcome to Java!",
  primitiveRanges: "byte:   -128 to 127\nshort:  -32768 to 32767\nint:    -2147483648 to 2147483647\nlong:   -9223372036854775808 to 9223372036854775807\nchar:   0 to 65535\ndouble: largest 1.7976931348623157E308\nInteger.MAX_VALUE + 1 = -2147483648\nbyte 127, then ++ : -128\n0.1 + 0.2 = 0.30000000000000004",
  varExample: "Age: 25\nName: CSC3100\nSalary: 50000.5\nCharacter: h",
  localVariables: "x = 10\nmessage = Hello, world!\nx is greater than 5",
  staticVariables: "Course is: CSC3100\nCourse is: CSC3100 Data Structures",
  instanceVariables: "Name is: Ada\nDefault value for int is 0",
  variableKinds: "Ann is student 1\nBob is student 2\nAnn is student 2\nStudent.count = 2",
  ifElse: "i is smaller than 15\n15 is equal to 15",
  logicalOperators: "x && y: false\nx || y: true\n!x: false\ns is null or empty",
  whileExp: "exp(1) = 2.7182539682539684\nterms added: 8\nMath.E = 2.718281828459045",
  forHarmonic: "1 + 1/2 + 1/3 + ... + 1/100 = 5.187377517639621",
  breakContinue: "1 2 4 5 7 ",
  turtleDemo: "a = 100\nt is at (300, 200)\nt is at (5, 5)",
  constructorDemo: "zhangsan\n3\nzhangsan is 3",
  catchDemo: "finally runs for \"21\"\nn = 21, m = 42\ncaught: bad natural number: 4x2\nfinally runs for \"4x2\"\nn = 1, m = 2",
  commonExceptions: "java.lang.ArrayIndexOutOfBoundsException: Index 3 out of bounds for length 3\nNullPointerException\njava.lang.ArithmeticException: / by zero\nInfinity",
  uncaught: "before",
  arrayBasics: "0 1 4 9 16 \nturtleFarm[0] = null\nturtleFarm[0].getX() = 1\nprimes has 4 elements, last 7",
  sumPairs: "4\n6\n11",
  stringDemo: "fromChars: ROSE\ns: CSC3100\nCSC3100 Data Structure\ns: CSC3100 Data Structure\n22 C 8 Data\na == b: false\na.equals(b): true",
  printDemo: "I would like to live in a tree\nor else I get cramp\n6 * 7 = 42\n1 + 2 = 12\n1 + 2 = 3\npi is about 3.142",
  casting: "degrees = 57\nd = 7.0\n3 -3 4\n3 3.5 3.5\n65 B c\n-56",
  arrayListDemo: "[Ann, Dee, Bob, Cy] size 4\nnames.get(2) = Bob\n[Dee, Cy] size 2\n[10, 30, 50]",
  thisDemo: "null\ncar",
  fibonacciLoop: "0 1 1 2 3 5 8 13 21 34",
  fibonacciRecursive: "0 1 1 2 3 5 8 13 21 34",
  gcd: "GCD of 15 and 20 is: 5\nGCD of 7 and 5 is: 1\nGCD of 15 and 20 is: 5\nGCD of 1071 and 462 is: 21",
  primeCheck: "0 is not prime number\n1 is not prime number\n2 is prime number\n3 is prime number\n4 is not prime number\n17 is prime number\n21 is not prime number\n97 is prime number",
  palindromeNumber: "454 palindrome number\n34543 palindrome number\n123 not palindrome\n10 not palindrome",
  palindromeString: "Enter a string/number to check if it is a palindrome\nEntered string/number is a palindrome.",
  createObject: "Welcome to CSC3100",
  asciiValues: "The ASCII value of a is: 97\nThe ASCII value of b is: 98\nThe character with code 65 is: A\n'7' - '0' = 7",
  countCharacters: "Total number of characters in a string: 19",
  countPunctuation: "The number of punctuations exists in the string is: 5",
  changeCase: "String after case conversion: gREAT pOWER",
  stringRotation: "true\nfalse\nfalse",
  fileCreate: "exists before: false\nNew File is created!\nFile already exists.\nname: javaFile123.txt, absolute: true, length: 0 bytes",
  fileList: "a.java Can Write: true Is Hidden: false Length: 6 bytes\ndata.csv Can Write: true Is Hidden: false Length: 8 bytes\nnotes.txt Can Write: true Is Hidden: false Length: 9 bytes",
  byteStreams: "after write(65): 1 byte\nsuccess...\nfirst byte: 87 = 'W'\nelcome to CSC3100.",
  charStreams: "Success...\nWelcome to CSC3100.\nWelcome to CSC3100. Bye.",
  average: "average = 81.66666666666667",
  exercise2: "10 2 10 2\ndata 3 D",
  exercise3: "0 1 1 2 3 5 8 13 21 34\nfibonacci(50) = 12586269025",
  bankTest: "balance = 120.0\nrefused: insufficient funds: 120.0 < 500.0\nbalance = 120.0",
  exercise5: "5\nfun are structures data",
  exercise6: "25 primes below 100\ntrue",
  wordCount: "3 lines, 11 words, 68 characters",
};


// ---------- helpers ----------

// Line number (1-based) of the nth line of code containing s.
function lineOf(code, s, nth = 1) {
  const ls = code.split("\n");
  let c = 0;
  for (let k = 0; k < ls.length; k++) if (ls[k].includes(s) && ++c === nth) return k + 1;
  return 0;
}

// Java's Double.toString for the values these demos print.
function jd(x) {
  if (!Number.isFinite(x)) return Number.isNaN(x) ? "NaN" : x > 0 ? "Infinity" : "-Infinity";
  const a = Math.abs(x);
  if (a === 0 || (a >= 1e-3 && a < 1e7)) return Number.isInteger(x) ? x.toFixed(1) : String(x);
  let [m, e] = x.toExponential().split("e");
  if (!m.includes(".")) m += ".0";
  return `${m}E${+e}`;
}
const q = (s) => `"${s}"`;
const ref = (id) => (id == null ? "null" : `→ #${id}`);

(function injectL02Style() {
  if (document.getElementById("l02-style")) return;
  const st = document.createElement("style");
  st.id = "l02-style";
  st.textContent = `
  .l2-heap { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.5fr); gap: 10px; margin: 0 0 12px; }
  .l2-col { background: var(--paper-2); border-radius: 10px; padding: 10px; min-height: 70px; min-width: 0; }
  .l2-col > small { font: 500 11px var(--mono); color: var(--stone); display: block; margin-bottom: 6px; }
  .l2-var { display: flex; justify-content: space-between; gap: 8px; font: 13px var(--mono); padding: 5px 8px; border: 1px solid var(--line); border-radius: 7px; background: var(--card); margin-bottom: 5px; overflow-wrap: anywhere; }
  .l2-objs { display: flex; flex-wrap: wrap; gap: 6px; }
  .l2-obj { border: 1px solid var(--line); border-radius: 8px; background: var(--card); padding: 6px 9px; font: 13px var(--mono); min-width: 0; overflow-wrap: anywhere; }
  .l2-obj > b { color: var(--teal); display: block; font-size: 12px; }
  .l2-var.hl, .l2-obj.hl { border-color: var(--amber); background: var(--mark); }
  .l2-obj.dead { opacity: 0.4; border-style: dashed; }
  .l2-r { color: var(--teal); font-weight: 600; }
  .l2-stages { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; justify-content: center; margin-bottom: 10px; }
  .l2-stage { border: 1px solid var(--line); border-radius: 9px; padding: 8px 10px; background: var(--card); font: 600 12.5px var(--mono); text-align: center; min-width: 84px; }
  .l2-stage small { display: block; font-weight: 400; color: var(--stone); font-size: 11px; }
  .l2-stage.on { border-color: var(--amber); background: var(--mark); }
  .l2-stage.bad { border-color: var(--red); background: var(--red-soft); color: var(--red); }
  .l2-stage.done { border-color: var(--teal); }
  .l2-arrow { color: var(--stone); font: 14px var(--mono); }
  .l2-panel { background: var(--paper-2); border-radius: 10px; padding: 10px; min-height: 120px; }
  .l2-panel pre.code { margin: 0; }
  .l2-chips { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; margin-top: 8px; }
  .l2-chip { border: 1px solid var(--teal); border-radius: 999px; padding: 4px 12px; font: 12px var(--mono); background: var(--teal-soft); }
  .l2-bits { display: flex; gap: 3px; justify-content: center; flex-wrap: wrap; margin: 8px 0; }
  .l2-bit { width: 40px; display: flex; flex-direction: column; align-items: center; gap: 2px; }
  .l2-bit span { width: 36px; height: 38px; display: grid; place-items: center; border: 1px solid var(--line); border-radius: 6px; font: 600 16px var(--mono); background: var(--card); }
  .l2-bit.one span { background: var(--teal-soft); border-color: var(--teal); }
  .l2-bit.sign span { box-shadow: inset 0 -3px 0 var(--amber); }
  .l2-bit small { font: 10px var(--mono); color: var(--stone); }
  .l2-scroll { overflow-x: auto; }
  .l2-scroll table { border-collapse: collapse; font: 12.5px var(--mono); margin: 0 auto; }
  .l2-scroll td, .l2-scroll th { border: 1px solid var(--line); padding: 4px 8px; text-align: right; }
  .l2-scroll th { background: var(--card-2); }
  .l2-scroll tr.hl td { background: var(--mark); }
  .cell.l2-cap { opacity: 0.45; border-style: dashed; }
  .cell.l2-new { background: var(--teal-soft); border-color: var(--teal); }
  .cell.l2-sm { width: 30px; height: 34px; font-size: 13px; }
  .l2-big { font: 600 22px var(--mono); text-align: center; margin: 6px 0; }
  @media (max-width: 600px) {
    .l2-heap { grid-template-columns: minmax(0, 1fr); }
    .l2-bit { width: 32px; } .l2-bit span { width: 30px; height: 32px; font-size: 14px; }
    .l2-stage { min-width: 0; padding: 6px 8px; }
    .cell.l2-sm { width: 26px; height: 30px; font-size: 12px; }
  }`;
  document.head.appendChild(st);
})();

// Stack (locals of main) + static area + heap objects. h = {vars, statics, objs, hl}
function heapHTML(h) {
  if (!h) return "";
  const v = (h.vars || []).map(([k, val]) => `<div class="l2-var${h.hl === k ? " hl" : ""}"><span>${esc(k)}</span><span class="${String(val).startsWith("→") ? "l2-r" : ""}">${esc(val)}</span></div>`).join("") || `<div class="counter">(no variables yet)</div>`;
  const s = (h.statics || []).map(([k, val]) => `<div class="l2-var${h.hl === k ? " hl" : ""}"><span>${esc(k)}</span><span>${esc(val)}</span></div>`).join("");
  const o = (h.objs || []).map((ob) => `<div class="l2-obj${ob.dead ? " dead" : ""}${h.hl === "#" + ob.id ? " hl" : ""}"><b>#${ob.id} ${esc(ob.cls)}${ob.dead ? " · unreachable" : ""}</b>${ob.fields.map(([k, val]) => `${esc(k)} = <span class="${String(val).startsWith("→") ? "l2-r" : ""}">${esc(val)}</span>`).join("<br>")}</div>`).join("");
  return `<div class="l2-heap"><div class="l2-col"><small>variables of main (stack)</small>${v}</div>
    <div class="l2-col">${s ? `<small>static variables (one per class)</small>${s}` : ""}<small>heap (objects)</small><div class="l2-objs">${o || `<span class="counter">(empty)</span>`}</div></div></div>`;
}

// A small step player for demos that are not call stacks. build() -> snaps; render(snap, i) -> html.
function simpleStepper(el, opts) {
  const mini = !!opts.mini;
  el.innerHTML = `<div class="ss-view"></div>${mini ? "" : `<div class="msg ss-msg"></div><div class="controls">
      <button class="cbtn ss-reset">⟲ Reset</button><button class="cbtn ss-back">◀ Back</button>
      <button class="cbtn ss-step on">Step ▶</button><button class="cbtn ss-play">Play</button>
      ${opts.extraControls || ""}<span class="spacer"></span><span class="counter ss-count"></span></div>`}`;
  const $ = (s) => el.querySelector(s);
  let snaps = [], i = 0, timer = null;
  function render() {
    const s = snaps[i];
    $(".ss-view").innerHTML = opts.render(s, i, mini);
    if (mini) return;
    $(".ss-msg").innerHTML = s.msg || "";
    $(".ss-msg").className = "msg ss-msg " + (s.msgCls || "");
    $(".ss-count").textContent = `step ${i + 1} / ${snaps.length}`;
    $(".ss-back").disabled = $(".ss-reset").disabled = i === 0;
    $(".ss-step").disabled = i === snaps.length - 1;
  }
  function stop() { clearInterval(timer); timer = null; if (!mini) $(".ss-play").textContent = "Play"; }
  function play() {
    if (timer) return stop();
    if (i === snaps.length - 1) i = 0;
    if (!mini) $(".ss-play").textContent = "Pause";
    timer = setInterval(() => {
      if (i < snaps.length - 1) i++; else if (mini) i = 0; else return stop();
      render();
    }, mini ? 1300 : 900);
  }
  function rebuild() { stop(); snaps = opts.build(); i = 0; render(); }
  if (!mini) {
    $(".ss-reset").onclick = () => { stop(); i = 0; render(); };
    $(".ss-back").onclick = () => { stop(); if (i) i--; render(); };
    $(".ss-step").onclick = () => { stop(); if (i < snaps.length - 1) i++; render(); };
    $(".ss-play").onclick = play;
    el.tabIndex = 0;
    el.addEventListener("keydown", (e) => {
      if (["INPUT", "SELECT", "TEXTAREA"].includes(e.target.tagName)) return;
      if (e.key === "ArrowRight") { e.preventDefault(); $(".ss-step").click(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); $(".ss-back").click(); }
    });
  }
  if (opts.onMount) opts.onMount(el, rebuild);
  rebuild();
  if (mini) play();
}

// ---------- 1. from source to output ----------

const BYTECODE = `public static void main(java.lang.String[]);
  Code:
     0: getstatic     #7    // Field java/lang/System.out
     3: ldc           #13   // String Welcome to Java!
     5: invokevirtual #15   // Method java/io/PrintStream.println
     8: return`;
const TYPO_ERROR = `Welcome.java:1: error: class, interface, annotation type, enum, record, method or field expected
Public class Welcome {
^
1 error`;

function demoPipeline(el, { mini = false } = {}) {
  let typo = false;
  const STAGES = [["Welcome.java", "source"], ["javac", "compiler"], ["Welcome.class", "bytecode"], ["java", "JVM"], ["console", "output"]];
  const typoSrc = CODE.welcome.replace("public class", "Public class");
  function build() {
    const s = [];
    if (typo) {
      s.push({ act: 0, src: typoSrc, msg: "You type the program and save it as <code>Welcome.java</code>. Look closely at the first word." });
      s.push({ act: 1, err: true, msg: "<code>javac Welcome.java</code>: <code>Public</code> is not a keyword, so the compiler stops with a <b>compile-time error</b>. No <code>.class</code> file is written.", msgCls: "bad" });
      s.push({ act: 0, src: CODE.welcome, msg: "Back to the source: change <code>Public</code> to <code>public</code> and save again." });
    } else {
      s.push({ act: 0, src: CODE.welcome, msg: "You write the source code and save it as <code>Welcome.java</code>: the file name must match the public class." });
    }
    s.push({ act: 1, msg: "<code>javac Welcome.java</code>: the compiler checks spelling, syntax and types, and translates the class into bytecode." });
    s.push({ act: 2, msg: "No errors, so <code>Welcome.class</code> appears: JVM instructions, the same on every computer. (<code>javap -c Welcome</code> shows them.)" });
    s.push({ act: 3, msg: "<code>java Welcome</code>: the JVM loads the class and calls <code>main</code>. Each operating system has its own JVM; the <code>.class</code> file is the same." });
    s.push({ act: 4, msg: "The program prints its line. Compile once, run on any JVM.", msgCls: "good" });
    return s;
  }
  simpleStepper(el, {
    mini, build,
    extraControls: `<select class="pp-v"><option value="ok">correct source</option><option value="typo">source with a typo (Public)</option></select>`,
    onMount(root, rebuild) { if (!mini) root.querySelector(".pp-v").onchange = (e) => { typo = e.target.value === "typo"; rebuild(); }; },
    render(s) {
      const st = STAGES.map(([a, b], k) => {
        let cls = "l2-stage";
        if (k === s.act) cls += s.err ? " bad" : " on"; else if (k < s.act) cls += " done";
        return `<div class="${cls}">${a}<small>${b}</small></div>`;
      }).join(`<span class="l2-arrow">→</span>`);
      let panel = "";
      if (s.act === 0) panel = codeBlock(mini ? s.src : s.src);
      else if (s.act === 1) panel = s.err ? codeBlock(TYPO_ERROR, "out") : codeBlock("$ javac Welcome.java", "shell");
      else if (s.act === 2) panel = codeBlock(BYTECODE, "out");
      else if (s.act === 3) panel = codeBlock("$ java Welcome", "shell") + `<div class="l2-chips"><span class="l2-chip">JVM for macOS</span><span class="l2-chip">JVM for Windows</span><span class="l2-chip">JVM for Linux</span></div>`;
      else panel = codeBlock(OUT.welcome, "out");
      return `<div class="l2-stages">${st}</div><div class="l2-panel">${panel}</div>`;
    },
  });
}

// ---------- 2. bits of a byte ----------

function demoByteBits(el) {
  let v = 127;
  el.innerHTML = `<div class="l2-bits bb-bits"></div><div class="l2-big bb-val"></div><div class="msg bb-msg"></div>
    <div class="controls"><button class="cbtn bb-op" data-d="-1">b--</button><button class="cbtn on bb-op" data-d="1">b++</button>
    <button class="cbtn bb-op" data-d="50">b += 50</button><button class="cbtn bb-op" data-d="-50">b -= 50</button>
    <label>set b = <input type="number" class="bb-in" min="-128" max="127" value="${v}"></label></div>`;
  const $ = (s) => el.querySelector(s);
  const wrap = (x) => ((((x + 128) % 256) + 256) % 256) - 128;
  function render(msg = "", cls = "") {
    const u = v & 0xff;
    $(".bb-bits").innerHTML = [...Array(8)].map((_, k) => {
      const bit = (u >> (7 - k)) & 1;
      const w = k === 0 ? "−128" : String(2 ** (7 - k));
      return `<div class="l2-bit${bit ? " one" : ""}${k === 0 ? " sign" : ""}"><span>${bit}</span><small>${w}</small></div>`;
    }).join("");
    const parts = [...Array(8)].map((_, k) => ((u >> (7 - k)) & 1 ? (k === 0 ? -128 : 2 ** (7 - k)) : 0)).filter(Boolean);
    $(".bb-val").textContent = `byte b = ${v}`;
    $(".bb-msg").innerHTML = msg || `${parts.length ? parts.join(" + ").replace(/\+ -/g, "− ") : "0"} = <b>${v}</b>. The leftmost bit is worth <b>−128</b>, the others +64 … +1.`;
    $(".bb-msg").className = "msg bb-msg " + cls;
    $(".bb-in").value = v;
  }
  el.querySelectorAll(".bb-op").forEach((b) => {
    b.onclick = () => {
      const d = +b.dataset.d, old = v, raw = v + d;
      v = wrap(raw);
      if (raw !== v) render(`${old} ${d > 0 ? "+" : "−"} ${Math.abs(d)} = ${raw} does not fit in 8 bits. Java keeps the low 8 bits: <b>${v}</b>. No error, no warning: <b>overflow</b>.`, "bad");
      else render();
    };
  });
  $(".bb-in").onchange = (e) => { v = wrap(Math.trunc(+e.target.value || 0)); render(); };
  render();
}

// ---------- 3. scope of local variables ----------

function traceScope() {
  const C = CODE.localVariables, t = new Tracer();
  const f = t.push("main", {});
  t.snap(lineOf(C, "public static void main"), "<code>main</code> starts with an empty frame: no local variables yet.");
  f.vars.x = 10; t.snap(lineOf(C, "int x = 10"), "<code>int x = 10;</code> creates the local variable <code>x</code>.");
  f.vars.message = q("Hello, world!"); t.snap(lineOf(C, "String message"), "<code>message</code> is created. (Strictly, it holds a reference to a String object.)");
  t.out.push("x = 10"); t.snap(lineOf(C, "\"x = \""), "Print <code>x</code>.");
  t.out.push("message = Hello, world!"); t.snap(lineOf(C, "\"message = \""), "Print <code>message</code>.");
  t.snap(lineOf(C, "if (x > 5)"), "<code>x > 5</code> is true: enter the block.");
  f.vars.result = q("x is greater than 5"); t.snap(lineOf(C, "String result"), "<code>result</code> is declared <b>inside the block</b>: its scope is this block only.");
  t.out.push("x is greater than 5"); t.snap(lineOf(C, "println(result)"), "Inside the block, <code>result</code> can be used.");
  delete f.vars.result; t.snap(lineOf(C, "}", 1), "The block ends: <code>result</code> is destroyed. Using it below would be <code>error: cannot find symbol</code>.", "bad");
  f.status = "returns"; f.cls = "ret";
  t.snap(lineOf(C, "}", 2), "<code>main</code> ends; its frame and all its local variables disappear.", "good");
  return t.snaps;
}

function demoScope(el, { mini = false } = {}) {
  makeStepper(el, { mini, showConsole: true, code: CODE.localVariables, build: traceScope, stackLabel: "frame of main" });
}

// ---------- 4. local, static and instance ----------

function traceVariableKinds() {
  const C = CODE.variableKinds, t = new Tracer();
  const f = t.push("main", {});
  let count = 0;
  const objs = [];
  const H = (hl) => ({ vars: Object.entries(f.vars), statics: [["Student.count", count]], objs: objs.map((o) => ({ ...o, fields: o.fields.map((x) => x.slice()) })), hl });
  t.snap(lineOf(C, "public static void main"), "Before any object exists, the class is loaded and its static <code>count = 0</code> is created: one copy for the whole class.", "", H("Student.count"));
  const mk = (name, v, id) => {
    count++;
    objs.push({ id, cls: "Student", fields: [["name", q(name)]] });
    f.vars[v] = ref(id);
    t.snap(lineOf(C, `new Student("${name}")`), `<code>new Student("${name}")</code> creates object #${id} with its <b>own</b> <code>name</code>; the constructor runs <code>count++</code> on the <b>shared</b> counter, now ${count}.`, "", H("#" + id));
  };
  const desc = (v, id, nth) => {
    const name = objs.find((o) => o.id === id).fields[0][1].slice(1, -1);
    const s = `${name} is student ${count}`;
    const g = t.push(`${v}.describe()`, { temp: q(s) });
    g.status = `returns ${q(s)}`; g.cls = "ret";
    t.snap(lineOf(C, `${v}.describe()`, nth), `Inside <code>describe</code>, the <b>local</b> variable <code>temp</code> lives in its own frame. It reads this object's <code>name</code> and the shared <code>count</code>.`, "", H("Student.count"));
    t.pop();
    t.out.push(s);
    t.snap(lineOf(C, `${v}.describe()`, nth), `<code>describe</code> returned; <code>temp</code> is gone. Printed: <code>${s}</code>.`, "", H(null));
  };
  mk("Ann", "a", 1); desc("a", 1, 1);
  mk("Bob", "b", 2); desc("b", 2, 1);
  desc("a", 1, 2);
  t.out.push(`Student.count = ${count}`);
  t.snap(lineOf(C, "Student.count"), `Two objects, two <code>name</code>s, but one <code>count</code> = ${count}.`, "good", H("Student.count"));
  return t.snaps;
}

function demoVariableKinds(el, { mini = false } = {}) {
  makeStepper(el, { mini, showConsole: true, code: CODE.variableKinds, build: traceVariableKinds, renderExtra: (s) => heapHTML(s.extra) });
}

// ---------- 5. loops ----------

function traceWhile(eps) {
  const C = CODE.whileExp.replace("0.0001", String(eps)), t = new Tracer();
  const f = t.push("main", {});
  let sum = 0.0, term = 1.0, k = 1;
  const sync = () => { f.vars = { sum: jd(sum), term: jd(term), k }; };
  sync(); t.snap(lineOf(C, "int k = 1"), "Start: <code>sum = 0</code>, <code>term = 1</code> (that is 1/0!), <code>k = 1</code>.");
  let guard = 0;
  while (term >= eps && guard++ < 60) {
    t.snap(lineOf(C, "while ("), `<code>term >= ${eps}</code>? ${jd(term)} — yes, run the body.`);
    sum += term; sync(); t.snap(lineOf(C, "sum += term"), `Add the term: <code>sum = ${jd(sum)}</code>.`);
    term = term / k; sync(); t.snap(lineOf(C, "term = term / k"), `Next term: divide by k = ${k}. <code>term = ${jd(term)}</code>.`);
    k++; sync(); t.snap(lineOf(C, "k++"), `<code>k = ${k}</code>.`);
  }
  t.snap(lineOf(C, "while ("), `<code>term >= ${eps}</code>? ${jd(term)} — <b>no</b>: the loop stops.`, "good");
  t.out.push(`exp(1) = ${jd(sum)}`); t.snap(lineOf(C, "\"exp(1) = \""), "Print the sum.");
  t.out.push(`terms added: ${k - 1}`); t.snap(lineOf(C, "terms added"), `${k - 1} terms were added.`);
  t.out.push(`Math.E = ${jd(Math.E)}`); t.snap(lineOf(C, "Math.E"), "Compare with the exact value.", "good");
  return { code: C, snaps: t.snaps };
}

function traceFor(n) {
  const C = CODE.forHarmonic.replace("i <= 100", `i <= ${n}`).replace("1/100", `1/${n}`), t = new Tracer();
  const f = t.push("main", {});
  let sum = 0.0;
  f.vars = { sum: jd(sum) };
  t.snap(lineOf(C, "double sum"), "<code>sum = 0.0</code>.");
  for (let i = 1; i <= n; i++) {
    f.vars = { sum: jd(sum), i };
    t.snap(lineOf(C, "for ("), i === 1 ? "Initialisation <code>i = 1</code>, then the test <code>i <= " + n + "</code>: true." : `Update <code>i++</code> → ${i}; test <code>i <= ${n}</code>: true.`);
    sum += 1.0 / i;
    f.vars = { sum: jd(sum), i };
    t.snap(lineOf(C, "sum += 1.0 / i"), `<code>sum += 1.0 / ${i}</code> → ${jd(sum)}`);
  }
  f.vars = { sum: jd(sum), i: n + 1 };
  t.snap(lineOf(C, "for ("), `<code>i = ${n + 1}</code>: the test fails, the loop ends. (<code>i</code> is local to the loop and disappears now.)`, "good");
  t.out.push(`1 + 1/2 + 1/3 + ... + 1/${n} = ${jd(sum)}`);
  t.snap(lineOf(C, "println"), "Print the sum.", "good");
  return { code: C, snaps: t.snaps };
}

function traceBreak() {
  const C = CODE.breakContinue, t = new Tracer();
  const f = t.push("main", {});
  const line = [];
  for (let i = 1; i <= 10; i++) {
    f.vars = { i };
    t.snap(lineOf(C, "for ("), `<code>i = ${i}</code>.`);
    if (i % 3 === 0) { t.snap(lineOf(C, "continue"), `${i} % 3 == 0: <code>continue</code> skips the rest of the body.`, "bad"); continue; }
    t.snap(lineOf(C, "if (i % 3"), `${i} % 3 = ${i % 3}: no skip.`);
    if (i > 7) { t.snap(lineOf(C, "break"), `${i} > 7: <code>break</code> leaves the loop at once.`, "bad"); break; }
    line.push(i);
    t.out = [line.join(" ") + " "];
    t.snap(lineOf(C, "System.out.print("), `Print ${i}.`);
  }
  t.out = [OUT.breakContinue];
  t.snap(lineOf(C, "println()"), "After the loop: end the line.", "good");
  return { code: C, snaps: t.snaps };
}

function demoLoops(el, { mini = false } = {}) {
  let kind = "while", eps = 0.0001, n = 100, cur = traceWhile(eps);
  const make = () => (kind === "while" ? traceWhile(eps) : kind === "for" ? traceFor(n) : traceBreak());
  makeStepper(el, {
    mini, showConsole: true, stackLabel: "frame of main",
    code: () => cur.code,
    build: () => cur.snaps,
    extraControls: `<select class="lp-k"><option value="while">while: e = 1 + 1/1! + 1/2! + …</option><option value="for">for: 1 + 1/2 + … + 1/n</option><option value="brk">break and continue</option></select>
      <label class="lp-p">stop below <select class="lp-e"><option>0.01</option><option>0.001</option><option selected>0.0001</option><option>0.000001</option></select></label>`,
    onMount(root, rebuild) {
      if (mini) return;
      const lab = root.querySelector(".lp-p");
      const setLabel = () => {
        lab.innerHTML = kind === "while" ? `stop below <select class="lp-e">${["0.01", "0.001", "0.0001", "0.000001"].map((x) => `<option${+x === eps ? " selected" : ""}>${x}</option>`).join("")}</select>`
          : kind === "for" ? `n <input type="number" class="lp-n" min="1" max="100" value="${n}">` : "";
        const e = root.querySelector(".lp-e"), nn = root.querySelector(".lp-n");
        if (e) e.onchange = (ev) => { eps = +ev.target.value; cur = make(); rebuild(); };
        if (nn) nn.onchange = (ev) => { n = Math.min(100, Math.max(1, Math.trunc(+ev.target.value || 1))); ev.target.value = n; cur = make(); rebuild(); };
      };
      root.querySelector(".lp-k").onchange = (e) => { kind = e.target.value; cur = make(); setLabel(); rebuild(); };
      setLabel();
    },
  });
}

// ---------- 6. objects and references ----------

function traceTurtle() {
  const C = CODE.turtleDemo, t = new Tracer();
  const f = t.push("main", {});
  const objs = [];
  const H = (hl) => ({ vars: Object.entries(f.vars), objs: objs.map((o) => ({ ...o, fields: o.fields.map((x) => x.slice()) })), hl });
  const tur = () => objs[0];
  const set = (x, y) => { tur().fields = [["penDown", "false"], ["x", x], ["y", y]]; };
  f.vars.t = "null"; t.snap(lineOf(C, "Turtle t;"), "<code>Turtle t;</code> makes a variable that <em>can</em> refer to a Turtle. There is no turtle yet: <code>t</code> is <code>null</code>.", "", H("t"));
  objs.push({ id: 1, cls: "Turtle", fields: [["penDown", "false"], ["x", 0], ["y", 0]] });
  t.snap(lineOf(C, "new Turtle(100, 100)"), "<code>new</code> allocates a Turtle on the heap; its fields start at their default values.", "", H("#1"));
  const g = t.push("Turtle(100, 100)", { initX: 100, initY: 100 });
  set(100, 100); g.status = "constructor: x = initX; y = initY; penDown = false";
  t.snap(lineOf(C, "new Turtle(100, 100)"), "The <b>constructor</b> runs in its own frame and fills in the fields.", "", H("#1"));
  t.pop(); f.vars.t = ref(1);
  t.snap(lineOf(C, "new Turtle(100, 100)"), "<code>new</code> returns a reference, stored in <code>t</code>.", "", H("t"));
  f.vars.a = 100; t.snap(lineOf(C, "int a = t.getX()"), "<code>t.getX()</code> follows the reference and returns the field <code>x</code>: 100.", "", H("a"));
  t.out.push("a = 100"); t.snap(lineOf(C, "\"a = \""), "Print <code>a</code>.", "", H(null));
  set(300, 200); t.snap(lineOf(C, "t.jumpTo(300, 200)"), "<code>t.jumpTo(300, 200)</code> changes the object's fields.", "", H("#1"));
  t.out.push("t is at (300, 200)"); t.snap(lineOf(C, "\"t is at (\"", 1), "Print the position.", "", H(null));
  f.vars.u = ref(1); t.snap(lineOf(C, "Turtle u = t"), "<code>Turtle u = t;</code> copies the <b>reference</b>. Still only one turtle, now with two names.", "", H("u"));
  set(5, 5); t.snap(lineOf(C, "u.jumpTo(5, 5)"), "Moving the turtle through <code>u</code>…", "", H("#1"));
  t.out.push("t is at (5, 5)"); t.snap(lineOf(C, "\"t is at (\"", 2), "…moves the turtle <code>t</code> refers to: it is the same object.", "good", H("t"));
  return t.snaps;
}

function demoObjects(el, { mini = false } = {}) {
  makeStepper(el, { mini, showConsole: true, code: CODE.turtleDemo, build: traceTurtle, renderExtra: (s) => heapHTML(s.extra) });
}

// ---------- 7. this ----------

function traceThis(right) {
  const C = right ? CODE.item : CODE.itemWrong, cls = right ? "Item" : "ItemWrong", t = new Tracer();
  const objs = [{ id: 1, cls, fields: [["name", "null"]] }];
  const H = (hl, vars) => ({ vars, objs: objs.map((o) => ({ ...o, fields: o.fields.map((x) => x.slice()) })), hl });
  t.push("main", {});
  const g = t.push(`${cls}("car")`, { name: q("car"), this: ref(1) });
  t.snap(lineOf(C, `${cls}(String name)`), `<code>new ${cls}("car")</code> creates object #1 (field <code>name</code> = null) and calls the constructor. Its frame has the parameter <code>name</code> and the hidden reference <code>this</code> → #1.`, "", H("#1", [["w", "(being built)"]]));
  if (right) {
    objs[0].fields = [["name", q("car")]];
    t.snap(lineOf(C, "this.name = name"), "<code>this.name</code> is the field of object #1; <code>name</code> is the parameter. The field gets <code>\"car\"</code>.", "good", H("#1", [["r", "(being built)"]]));
  } else {
    g.status = "name = name: parameter := parameter";
    t.snap(lineOf(C, "name = name"), "Inside the constructor the parameter <code>name</code> <b>shadows</b> the field: both sides mean the parameter. It is assigned to itself, and the field is untouched.", "bad", H("#1", [["w", "(being built)"]]));
  }
  t.pop();
  t.out.push(right ? "car" : "null");
  t.snap(0, right ? "Printing <code>r.name</code> gives <b>car</b>." : "Printing <code>w.name</code> gives <b>null</b>: the field was never set.", right ? "good" : "bad", H(null, [[right ? "r" : "w", ref(1)]]));
  return t.snaps;
}

function demoThis(el) {
  let right = false;
  makeStepper(el, {
    showConsole: true, code: () => (right ? CODE.item : CODE.itemWrong), build: () => traceThis(right),
    renderExtra: (s) => heapHTML(s.extra),
    extraControls: `<select class="th-k"><option value="w">ItemWrong: name = name</option><option value="r">Item: this.name = name</option></select>`,
    onMount(root, rebuild) { root.querySelector(".th-k").onchange = (e) => { right = e.target.value === "r"; rebuild(); }; },
  });
}

// ---------- 8. exceptions ----------

function traceCatch(inputs) {
  const C = CODE.catchDemo, t = new Tracer();
  const f = t.push("main", {});
  for (const input of inputs) {
    f.vars = { input: q(input), n: "?", m: "?" };
    t.snap(lineOf(C, "for (String input"), `Next input: <code>"${esc(input)}"</code>. <code>n</code> and <code>m</code> are declared but not yet assigned.`);
    t.snap(lineOf(C, "try {"), "Enter the <code>try</code> block.");
    const g = t.push(`Natural.parse("${input}")`, { value: 0 });
    let value = 0, err = null;
    if (input.length === 0) err = "bad natural number: empty";
    for (let i = 0; i < input.length && !err; i++) {
      const ch = input[i];
      if (ch < "0" || ch > "9") { err = "bad natural number: " + input; g.vars = { i, ch: `'${ch}'`, value }; break; }
      value = (Math.imul(value, 10) + (ch.charCodeAt(0) - 48)) | 0;
      g.vars = { i, ch: `'${ch}'`, value };
      g.status = `digit: value = value * 10 + ${ch}`;
      t.snap(lineOf(C, "Natural.parse"), `<code>parse</code> reads <code>'${esc(ch)}'</code>: a digit, so <code>value</code> becomes ${value}.`);
    }
    if (err) {
      g.status = `throw new IOException("${err}")`; g.cls = "err";
      t.snap(lineOf(C, "Natural.parse"), `<code>parse</code> finds ${input.length ? `<code>'${esc(g.vars.ch.slice(1, -1))}'</code>, not a digit` : "an empty string"}, and <b>throws</b>. The method stops at once.`, "bad");
      t.pop();
      t.snap(lineOf(C, "m = n * 2"), "The rest of the <code>try</code> block (<code>m = n * 2</code>) is <b>skipped</b>.", "bad");
      t.out.push("caught: " + err);
      t.snap(lineOf(C, "caught: "), "The matching <code>catch (IOException e)</code> block runs and prints the message.");
      f.vars.n = 1; f.vars.m = 2;
      t.snap(lineOf(C, "m = 2;"), "The catch block sets the defaults <code>n = 1</code>, <code>m = 2</code>.");
    } else {
      g.status = `returns ${value}`; g.cls = "ret";
      t.snap(lineOf(C, "Natural.parse"), `<code>parse</code> returns ${value}.`, "good");
      t.pop();
      f.vars.n = value;
      const m = Math.imul(value, 2);
      f.vars.m = m;
      t.snap(lineOf(C, "m = n * 2"), `No exception: <code>m = n * 2 = ${m}</code>. The catch block is skipped.`, "good");
    }
    t.out.push(`finally runs for "${input}"`);
    t.snap(lineOf(C, "finally runs"), "The <code>finally</code> block runs in <b>both</b> cases.");
    t.out.push(`n = ${f.vars.n}, m = ${f.vars.m}`);
    t.snap(lineOf(C, "\"n = \""), "After the try statement, the program carries on normally.");
  }
  t.snap(0, "Done. The bad input did not crash the program: the exception was caught and handled.", "good");
  return t.snaps;
}

function demoCatch(el) {
  let inputs = ["21", "4x2"];
  makeStepper(el, {
    showConsole: true, code: CODE.catchDemo, build: () => traceCatch(inputs),
    extraControls: `<label>inputs <input type="text" class="ex-in" value="21, 4x2" style="width:140px"></label>`,
    onMount(root, rebuild) {
      root.querySelector(".ex-in").onchange = (e) => {
        inputs = e.target.value.split(",").map((s) => s.trim()).slice(0, 4);
        if (!inputs.length) inputs = ["21"];
        rebuild();
      };
    },
  });
}

// ---------- 9. ArrayList growth ----------

function demoArrayList(el) {
  let data = [], cap = 0, copies = 0, next = 1, lastNew = -1;
  el.innerHTML = `<div class="ar-cells"></div><div class="stats ar-stats"></div><div class="msg ar-msg"></div>
    <div class="controls"><button class="cbtn on ar-add">add(x)</button><button class="cbtn ar-add5">add × 5</button><button class="cbtn ar-ins">add(0, x)</button>
    <button class="cbtn ar-rm0">remove(0)</button><button class="cbtn ar-trim">trimToSize()</button><button class="cbtn ar-reset">⟲ new ArrayList&lt;&gt;()</button></div>`;
  const $ = (s) => el.querySelector(s);
  function grow() {
    const old = cap;
    cap = cap === 0 ? 10 : cap + (cap >> 1);
    copies += data.length;
    return old === 0 ? "First add: the empty <code>ArrayList</code> allocates an array of capacity <b>10</b>." :
      `The array (capacity ${old}) is full. A new array of capacity ${old} + ${old}/2 = <b>${cap}</b> is created and all <b>${data.length}</b> elements are copied into it.`;
  }
  function render(msg, cls = "") {
    const cells = [];
    for (let k = 0; k < Math.max(cap, 1); k++) {
      if (cap === 0) { cells.push(`<div class="cellcol"><div class="cell l2-cap">–</div><div class="cellidx">no array</div></div>`); break; }
      const used = k < data.length;
      cells.push(`<div class="cellcol"><div class="cell l2-sm${used ? "" : " l2-cap"}${k === lastNew ? " l2-new" : ""}">${used ? data[k] : ""}</div><div class="cellidx">${k}</div></div>`);
    }
    $(".ar-cells").innerHTML = `<div class="cells">${cells.join("")}</div>`;
    $(".ar-stats").innerHTML = `<div class="stat"><small>size()</small><b>${data.length}</b></div><div class="stat"><small>capacity</small><b>${cap}</b></div><div class="stat"><small>elements copied so far</small><b>${copies}</b></div>`;
    $(".ar-msg").innerHTML = msg; $(".ar-msg").className = "msg ar-msg " + cls;
  }
  function add(atFront) {
    let msg = "";
    if (data.length === cap) msg = grow() + " ";
    const x = next++;
    if (atFront) { msg += `<code>add(0, ${x})</code>: every element shifts one place right (${data.length} moves), then ${x} goes into index 0.`; data.unshift(x); lastNew = 0; }
    else { msg += `<code>add(${x})</code>: ${x} goes into index ${data.length}.`; data.push(x); lastNew = data.length - 1; }
    return msg;
  }
  $(".ar-add").onclick = () => { const m = add(false); render(m, m.includes("full") ? "bad" : ""); };
  $(".ar-add5").onclick = () => { let m = ""; for (let k = 0; k < 5; k++) { const s = add(false); if (s.includes("capacity")) m = s; } render(m || "Added five elements.", m.includes("full") ? "bad" : ""); };
  $(".ar-ins").onclick = () => { const m = add(true); render(m, m.includes("full") ? "bad" : ""); };
  $(".ar-rm0").onclick = () => {
    if (!data.length) return render("The list is empty: <code>remove(0)</code> would throw <code>IndexOutOfBoundsException</code>.", "bad");
    const x = data.shift(); lastNew = -1;
    render(`<code>remove(0)</code> removes ${x}; the other ${data.length} elements shift left. <code>size()</code> drops, but the <b>capacity stays ${cap}</b>: the array does not shrink.`);
  };
  $(".ar-trim").onclick = () => { cap = data.length; lastNew = -1; copies += data.length; render(`<code>trimToSize()</code> copies the ${data.length} elements into an array of exactly that length. Capacity is now ${cap}.`); };
  $(".ar-reset").onclick = () => { data = []; cap = 0; copies = 0; next = 1; lastNew = -1; render("A new, empty <code>ArrayList</code>: size 0, and no array allocated yet (capacity 0). Press <b>add(x)</b>."); };
  $(".ar-reset").onclick();
}

// ---------- 10. immutable strings ----------

function traceStrings() {
  const C = CODE.stringDemo, t = new Tracer();
  const f = t.push("main", {});
  const objs = [];
  const H = (hl) => ({ vars: Object.entries(f.vars), objs: objs.map((o) => ({ ...o, fields: o.fields.slice() })), hl });
  const str = (id, s) => objs.push({ id, cls: "String", fields: [["", q(s)]].map(([, v]) => ["value", v]) });
  f.vars.letters = ref(1); objs.push({ id: 1, cls: "char[]", fields: [["", "{'R','O','S','E'}"]].map(([, v]) => ["[0..3]", v]) });
  t.snap(lineOf(C, "char[] letters"), "An array of four <code>char</code>s.", "", H("letters"));
  str(2, "ROSE"); f.vars.fromChars = ref(2);
  t.snap(lineOf(C, "new String(letters)"), "A new String object built from the characters.", "", H("fromChars"));
  str(3, "CSC3100"); f.vars.s = ref(3);
  t.snap(lineOf(C, "String s = "), "<code>s</code> refers to the String <code>\"CSC3100\"</code>.", "", H("s"));
  str(4, "CSC3100 Data Structure"); objs[3].dead = true;
  t.snap(lineOf(C, "s.concat(\" Data Structure\");"), "<code>concat</code> does <b>not</b> change #3. It builds a <b>new</b> String #4 and returns it, but nobody stores the result: #4 is unreachable at once.", "bad", H("#4"));
  t.out.push("fromChars: ROSE"); t.snap(lineOf(C, "\"fromChars: \""), "Print.", "", H(null));
  t.out.push("s: CSC3100"); t.snap(lineOf(C, "\"s: \"", 1), "<code>s</code> still refers to #3, unchanged: strings are <b>immutable</b>.", "", H("s"));
  str(5, "CSC3100 Data Structure"); objs[4].dead = true;
  t.out.push("CSC3100 Data Structure"); t.snap(lineOf(C, "System.out.println(s.concat"), "Another new String #5, printed and then dropped.", "", H("#5"));
  str(6, "CSC3100 Data Structure"); objs[2].dead = true; f.vars.s = ref(6);
  t.snap(lineOf(C, "s = s.concat"), "This time the new String is <b>assigned</b> to <code>s</code>. The old <code>\"CSC3100\"</code> (#3) is now unreachable; the garbage collector will free it.", "good", H("s"));
  t.out.push("s: CSC3100 Data Structure"); t.snap(lineOf(C, "\"s: \"", 2), "Now <code>s</code> shows the longer text.", "good", H(null));
  return t.snaps;
}

function demoStrings(el, { mini = false } = {}) {
  makeStepper(el, { mini, showConsole: true, code: CODE.stringDemo, build: traceStrings, renderExtra: (s) => heapHTML(s.extra) });
}

// ---------- 11. casting lab ----------

function demoCasting(el) {
  el.innerHTML = `<div class="controls" style="margin-top:0"><label>double x = <input type="text" class="cl-x" value="3.99" style="width:110px"></label>
    <button class="cbtn" data-x="-3.99">−3.99</button><button class="cbtn" data-x="57.29577951">57.3</button><button class="cbtn" data-x="200.5">200.5</button><button class="cbtn" data-x="65.7">65.7</button><button class="cbtn" data-x="3e10">3e10</button></div>
    <div class="l2-scroll cl-t" style="margin-top:10px"></div><p class="hint cl-h"></p>`;
  const $ = (s) => el.querySelector(s);
  const toInt = (x) => (Number.isNaN(x) ? 0 : x >= 2147483647 ? 2147483647 : x <= -2147483648 ? -2147483648 : Math.trunc(x));
  function render() {
    const x = parseFloat($(".cl-x").value);
    if (!Number.isFinite(x)) { $(".cl-t").innerHTML = ""; $(".cl-h").textContent = "Type a number."; return; }
    const i = toInt(x);
    const b = (i << 24) >> 24;
    const c = i & 0xffff;
    const rows = [
      ["(int) x", i, "truncates towards zero; clamps to the int range"],
      ["Math.round(x)", Math.floor(x + 0.5), "rounds to the nearest whole number (a long)"],
      ["(byte) (int) x", b, "keeps only the low 8 bits of the int"],
      ["(char) (int) x", c >= 32 && c < 127 ? `'${String.fromCharCode(c)}'` : `code ${c}`, "keeps the low 16 bits, read as a character"],
      ["(int) x / 2", Math.trunc(i / 2), "int / int: integer division"],
      ["x / 2", jd(x / 2), "double division"],
    ];
    $(".cl-t").innerHTML = `<table><tr><th>expression</th><th>value</th><th style="text-align:left">why</th></tr>${rows.map((r) => `<tr><td>${r[0]}</td><td>${esc(r[1])}</td><td style="text-align:left">${r[2]}</td></tr>`).join("")}</table>`;
    $(".cl-h").innerHTML = `Narrowing (<code>double → int → byte/char</code>) needs a cast because information can be lost: here ${x === i ? "nothing is lost" : `the fraction ${x > 2147483647 || x < -2147483648 ? "and the size" : ""} of ${x} is lost`}.`;
  }
  $(".cl-x").oninput = render;
  el.querySelectorAll("[data-x]").forEach((b) => { b.onclick = () => { $(".cl-x").value = b.dataset.x; render(); }; });
  render();
}

// ---------- 12. Euclid's algorithm ----------

function traceEuclid(a, b) {
  const C = CODE.gcd, t = new Tracer();
  const base = lineOf(C, "if (n2 == 0)"), rec = lineOf(C, "return gcdByEuclid");
  function g(n1, n2) {
    const f = t.push(`gcdByEuclid(${n1}, ${n2})`, { n1, n2 });
    t.snap(lineOf(C, "static int gcdByEuclid"), `New call with <code>n1 = ${n1}</code>, <code>n2 = ${n2}</code>.`, "", { n1, n2 });
    if (n2 === 0) {
      f.status = `returns ${n1}`; f.cls = "ret";
      t.snap(base + 1, `<code>n2 == 0</code>: the answer is <code>n1 = ${n1}</code>.`, "good", { n1, n2 });
      t.pop(); return n1;
    }
    f.status = `waiting: gcdByEuclid(${n2}, ${n1 % n2})`;
    t.snap(rec, `${n1} % ${n2} = ${n1 % n2}. gcd(${n1}, ${n2}) = gcd(${n2}, ${n1 % n2}).`, "", { n1, n2 });
    const r = g(n2, n1 % n2);
    f.status = `returns ${r}`; f.cls = "ret";
    t.snap(rec, `The answer ${r} is passed straight back.`, "good", { n1, n2 });
    t.pop(); return r;
  }
  const r = g(a, b);
  const brute = Math.min(a, b);
  t.snap(0, `gcd(${a}, ${b}) = <b>${r}</b>. Euclid needed ${t.snaps.filter((s) => s.msg.startsWith("New call")).length} calls; the brute-force loop would test ${brute.toLocaleString("en")} candidates.`, "good", null);
  return t.snaps;
}

function demoGcd(el, { mini = false } = {}) {
  let a = 1071, b = 462;
  makeStepper(el, {
    mini, code: CODE.gcd, build: () => traceEuclid(a, b),
    renderExtra: (s) => (s.extra && !mini ? `<div class="l2-big">gcd(${s.extra.n1}, ${s.extra.n2})</div>` : ""),
    extraControls: `<label>a <input type="number" class="gc-a" value="${a}" min="0"></label><label>b <input type="number" class="gc-b" value="${b}" min="0"></label>`,
    onMount(root, rebuild) {
      if (mini) return;
      const rd = () => {
        a = Math.max(0, Math.min(1e9, Math.trunc(+root.querySelector(".gc-a").value || 0)));
        b = Math.max(0, Math.min(1e9, Math.trunc(+root.querySelector(".gc-b").value || 0)));
        root.querySelector(".gc-a").value = a; root.querySelector(".gc-b").value = b; rebuild();
      };
      root.querySelector(".gc-a").onchange = rd; root.querySelector(".gc-b").onchange = rd;
    },
  });
}

// ---------- 13. primes and palindromes ----------

function tracePrime(n) {
  const C = CODE.primeCheck, t = new Tracer();
  t.push("main", { n });
  const f = t.push(`isPrime(${n})`, { n });
  t.snap(lineOf(C, "static boolean isPrime"), `Is ${n} prime?`);
  if (n < 2) { f.status = "returns false"; f.cls = "ret"; t.snap(lineOf(C, "return false;", 1), `${n} < 2: not prime by definition.`, "bad"); return t.snaps; }
  let i = 2;
  for (; i <= Math.trunc(n / 2); i++) {
    f.vars = { n, i, "n % i": n % i };
    t.snap(lineOf(C, "if (n % i == 0)"), `Try i = ${i}: ${n} % ${i} = ${n % i}.${n % i ? "" : " Zero!"}`, n % i ? "" : "bad");
    if (n % i === 0) { f.status = "returns false"; f.cls = "ret"; t.snap(lineOf(C, "return false;", 2), `${i} divides ${n}, so ${n} is <b>not prime</b>. Stop at once.`, "bad"); return t.snaps; }
  }
  f.vars = { n, i };
  f.status = "returns true"; f.cls = "ret";
  t.snap(lineOf(C, "return true"), `No divisor between 2 and ${Math.trunc(n / 2)}: ${n} <b>is prime</b>. (${i - 2} divisions; stopping at √${n} ≈ ${Math.floor(Math.sqrt(n))} would need only ${Math.max(0, Math.floor(Math.sqrt(n)) - 1)}.)`, "good");
  return t.snaps;
}

function tracePalindrome(n0) {
  const C = CODE.palindromeNumber, t = new Tracer();
  t.push("main", {});
  const f = t.push(`isPalindrome(${n0})`, { n: n0 });
  let n = n0, rev = 0;
  f.vars = { n, temp: n0, reversed: 0 };
  t.snap(lineOf(C, "int reversed = 0"), `Keep a copy: <code>temp = ${n0}</code>.`);
  while (n > 0) {
    const r = n % 10;
    f.vars = { n, temp: n0, reversed: rev, r };
    t.snap(lineOf(C, "int r = n % 10"), `Last digit: ${n} % 10 = <b>${r}</b>.`);
    rev = rev * 10 + r;
    f.vars = { n, temp: n0, reversed: rev, r };
    t.snap(lineOf(C, "reversed = reversed * 10 + r"), `Append it: reversed = ${rev}.`);
    n = Math.trunc(n / 10);
    f.vars = { n, temp: n0, reversed: rev, r };
    t.snap(lineOf(C, "n = n / 10"), `Drop it: n = ${n}.`);
  }
  const ok = rev === n0;
  f.status = `returns ${ok}`; f.cls = "ret";
  t.snap(lineOf(C, "return temp == reversed"), `${n0} ${ok ? "==" : "!="} ${rev}: ${ok ? "a palindrome" : "not a palindrome"}.`, ok ? "good" : "bad");
  return t.snaps;
}

function demoNumberLoops(el) {
  let kind = "prime", n = 97;
  makeStepper(el, {
    code: () => (kind === "prime" ? CODE.primeCheck : CODE.palindromeNumber),
    build: () => (kind === "prime" ? tracePrime(n) : tracePalindrome(n)),
    extraControls: `<select class="nl-k"><option value="prime">isPrime(n)</option><option value="pal">isPalindrome(n)</option></select>
      <label>n <input type="number" class="nl-n" value="${n}" min="0" max="99999"></label>`,
    onMount(root, rebuild) {
      root.querySelector(".nl-k").onchange = (e) => { kind = e.target.value; n = kind === "prime" ? 97 : 34543; root.querySelector(".nl-n").value = n; rebuild(); };
      root.querySelector(".nl-n").onchange = (e) => { n = Math.max(0, Math.min(99999, Math.trunc(+e.target.value || 0))); e.target.value = n; rebuild(); };
    },
  });
}

// ---------- 14. scanning a string ----------

const PUNCT = "!,;.?-'\":";

function buildScan(kind, text) {
  const snaps = [];
  if (kind === "count") {
    let count = 0;
    for (let i = 0; i < text.length; i++) {
      const c = text[i], hit = c !== " ";
      if (hit) count++;
      snaps.push({ i, hits: hit, count, msg: `<code>charAt(${i})</code> = '${esc(c)}': ${hit ? "not a space, count it" : "a space, skip it"}. count = ${count}.` });
    }
    snaps.push({ i: -1, count, msg: `Total number of characters in a string: <b>${count}</b>`, msgCls: "good" });
  } else if (kind === "punct") {
    let count = 0;
    for (let i = 0; i < text.length; i++) {
      const c = text[i], hit = PUNCT.includes(c);
      if (hit) count++;
      snaps.push({ i, hits: hit, count, msg: `'${esc(c)}' ${hit ? "<b>is</b> punctuation" : "is not punctuation"}. count = ${count}.` });
    }
    snaps.push({ i: -1, count, msg: `The number of punctuations exists in the string is: <b>${count}</b>`, msgCls: "good" });
  } else {
    const out = text.split("");
    for (let i = 0; i < text.length; i++) {
      const c = text[i], lo = c !== c.toUpperCase(), up = c !== c.toLowerCase();
      if (lo) out[i] = c.toUpperCase(); else if (up) out[i] = c.toLowerCase();
      snaps.push({ i, hits: lo || up, out: out.join(""), msg: `'${esc(c)}' is ${lo ? `lower case → setCharAt(${i}, '${out[i]}')` : up ? `upper case → setCharAt(${i}, '${out[i]}')` : "neither: unchanged"}.` });
    }
    snaps.push({ i: -1, out: out.join(""), msg: `String after case conversion: <b>${esc(out.join(""))}</b>`, msgCls: "good" });
  }
  return snaps;
}

function demoScan(el) {
  const DEF = { count: "The best of both worlds", punct: "He said, 'The mailman loves you.' I heard it with my own ears.", swap: "Great Power" };
  let kind = "count", text = DEF.count;
  simpleStepper(el, {
    build: () => buildScan(kind, text),
    extraControls: `<select class="sc-k"><option value="count">count non-spaces</option><option value="punct">count punctuation</option><option value="swap">swap case</option></select>
      <label>text <input type="text" class="sc-t" value="${esc(text)}" style="width:190px"></label>`,
    onMount(root, rebuild) {
      root.querySelector(".sc-k").onchange = (e) => { kind = e.target.value; text = DEF[kind]; root.querySelector(".sc-t").value = text; rebuild(); };
      root.querySelector(".sc-t").onchange = (e) => { text = e.target.value.slice(0, 80) || "a"; e.target.value = text; rebuild(); };
    },
    render(s) {
      const cells = text.split("").map((c, k) => {
        let cls = "cell l2-sm";
        if (k === s.i) cls += s.hits ? " found" : " mid";
        else if (s.i >= 0 && k > s.i) cls += " out";
        return `<div class="cellcol"><div class="ptr">${k === s.i ? "i" : ""}</div><div class="${cls}">${c === " " ? "␣" : esc(c)}</div><div class="cellidx">${k}</div></div>`;
      }).join("");
      const stat = kind === "swap" ? `<div class="stat"><small>newStr</small><b style="font-size:14px">${esc(s.out)}</b></div>` : `<div class="stat"><small>count</small><b>${s.count}</b></div>`;
      return `<div class="cells">${cells}</div><div class="stats"><div class="stat"><small>i</small><b>${s.i < 0 ? text.length + " (done)" : s.i}</b></div>${stat}</div>`;
    },
  });
}

function demoRotation(el) {
  el.innerHTML = `<div class="controls" style="margin-top:0"><label>str1 <input type="text" class="ro-a" value="abcde" style="width:110px"></label>
    <label>str2 <input type="text" class="ro-b" value="deabc" style="width:110px"></label></div><div class="ro-v"></div><div class="msg ro-m"></div>`;
  const $ = (s) => el.querySelector(s);
  function render() {
    const a = $(".ro-a").value.slice(0, 20), b = $(".ro-b").value.slice(0, 20);
    if (a.length !== b.length) {
      $(".ro-v").innerHTML = "";
      $(".ro-m").innerHTML = `Lengths ${a.length} and ${b.length} differ: <b>not a rotation</b> (no search needed).`; $(".ro-m").className = "msg ro-m bad"; return;
    }
    const d = a + a, at = d.indexOf(b);
    $(".ro-v").innerHTML = `<div class="cells">${d.split("").map((c, k) => `<div class="cellcol"><div class="cell l2-sm${at >= 0 && k >= at && k < at + b.length ? " found" : k >= a.length ? " out" : ""}">${esc(c)}</div><div class="cellidx">${k}</div></div>`).join("")}</div>`;
    $(".ro-m").innerHTML = at >= 0 ? `<code>str1.concat(str1)</code> contains <code>"${esc(b)}"</code> at index ${at}: <b>a rotation</b> (move the first ${at} characters to the end).` : `<code>indexOf</code> returns −1: <b>not a rotation</b>.`;
    $(".ro-m").className = "msg ro-m " + (at >= 0 ? "good" : "bad");
  }
  $(".ro-a").oninput = render; $(".ro-b").oninput = render;
  render();
}

// ---------- 15. reading a byte stream ----------

function demoFileRead(el, { mini = false } = {}) {
  let text = "Welcome to CSC3100.";
  simpleStepper(el, {
    mini,
    build() {
      const bytes = [...new TextEncoder().encode(text)].slice(0, 60);
      const snaps = [{ pos: -1, out: "", bytes, msg: `<code>new FileInputStream(file)</code> opens the file: ${bytes.length} bytes, read from the start.` }];
      let out = "";
      for (let k = 0; k < bytes.length; k++) {
        out += String.fromCharCode(bytes[k]);
        snaps.push({ pos: k, out, bytes, msg: `<code>read()</code> returns <b>${bytes[k]}</b>; <code>(char) ${bytes[k]}</code> is '${esc(String.fromCharCode(bytes[k]))}'.${bytes[k] > 127 ? " A byte above 127 is part of a multi-byte UTF-8 character: casting one byte to <code>char</code> gives the wrong letter. Use a <code>FileReader</code> for text." : ""}`, msgCls: bytes[k] > 127 ? "bad" : "" });
      }
      snaps.push({ pos: bytes.length, out, bytes, end: true, msg: "<code>read()</code> returns <b>−1</b>: end of file. The loop <code>while ((i = fin.read()) != -1)</code> stops.", msgCls: "good" });
      return snaps;
    },
    extraControls: `<label>file contents <input type="text" class="fr-t" value="${text}" style="width:180px"></label>`,
    onMount(root, rebuild) { if (!mini) root.querySelector(".fr-t").onchange = (e) => { text = e.target.value || "A"; rebuild(); }; },
    render(s) {
      const cells = s.bytes.map((b, k) => `<div class="cellcol"><div class="ptr">${k === s.pos ? "read" : ""}</div><div class="cell l2-sm${k === s.pos ? " mid" : k < s.pos ? " out" : ""}" style="font-size:11px">${b}</div><div class="cellidx">${b >= 32 && b < 127 ? esc(String.fromCharCode(b)) : "·"}</div></div>`).join("") +
        `<div class="cellcol"><div class="ptr">${s.end ? "read" : ""}</div><div class="cell l2-sm${s.end ? " found" : ""}" style="font-size:11px">−1</div><div class="cellidx">EOF</div></div>`;
      return `<div class="cells">${cells}</div>${mini ? "" : `<div class="console">${esc(s.out)}</div>`}`;
    },
  });
}

// ---------- quiz ----------

function demoQuiz(el, questions) {
  el.innerHTML = `<div class="quiz">` + questions.map((qq, k) => `<div class="card q" data-k="${k}">
      <p><b>Q${k + 1}.</b> ${qq.q}</p>${qq.code ? codeBlock(qq.code) : ""}
      <div class="opts">${qq.opts.map((o, j) => `<button class="opt" data-j="${j}">${o}</button>`).join("")}</div>
      <div class="explain">${qq.why}</div></div>`).join("") + `<p class="score"></p></div>`;
  let right = 0, done = 0;
  el.querySelectorAll(".q").forEach((qe) => {
    const qq = questions[+qe.dataset.k];
    qe.querySelectorAll(".opt").forEach((b) => {
      b.onclick = () => {
        const j = +b.dataset.j;
        qe.querySelectorAll(".opt").forEach((x) => { x.disabled = true; });
        qe.querySelectorAll(".opt")[qq.a].classList.add("right");
        if (j !== qq.a) b.classList.add("wrong"); else right++;
        qe.classList.add("done");
        done++;
        el.querySelector(".score").textContent = `${right} / ${done} correct` + (done === questions.length ? (right === questions.length ? " — all right!" : " — reread the sections you missed.") : "");
      };
    });
  });
}

// Demo registry: data-demo="name" in chapters.js mounts DEMOS[name].
const DEMOS = {
  pipeline: (el) => demoPipeline(el),
  pipelineMini: (el) => demoPipeline(el, { mini: true }),
  byteBits: (el) => demoByteBits(el),
  scope: (el) => demoScope(el),
  scopeMini: (el) => demoScope(el, { mini: true }),
  variableKinds: (el) => demoVariableKinds(el),
  variableKindsMini: (el) => demoVariableKinds(el, { mini: true }),
  loops: (el) => demoLoops(el),
  loopsMini: (el) => demoLoops(el, { mini: true }),
  objects: (el) => demoObjects(el),
  objectsMini: (el) => demoObjects(el, { mini: true }),
  thisDemo: (el) => demoThis(el),
  catchDemo: (el) => demoCatch(el),
  arrayList: (el) => demoArrayList(el),
  strings: (el) => demoStrings(el),
  stringsMini: (el) => demoStrings(el, { mini: true }),
  casting: (el) => demoCasting(el),
  gcd: (el) => demoGcd(el),
  gcdMini: (el) => demoGcd(el, { mini: true }),
  numberLoops: (el) => demoNumberLoops(el),
  scan: (el) => demoScan(el),
  rotation: (el) => demoRotation(el),
  fileRead: (el) => demoFileRead(el),
  fileReadMini: (el) => demoFileRead(el, { mini: true }),
  quiz: (el) => demoQuiz(el, QUIZ),
};
