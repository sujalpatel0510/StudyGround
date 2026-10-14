# Introduction to Python Programming

## Chapter 1: Variables and Data Types

### 1.1 What are Variables?
A variable in Python is a named reference to a value stored in memory. Unlike languages such as Java or C++, Python uses dynamic typing — you do not need to declare a variable's type before assigning a value.

```python
name = "Alice"      # str
age = 25            # int
height = 5.6        # float
is_student = True   # bool
```

### 1.2 Numeric Types
Python supports three numeric types:
- **int**: Whole numbers like `42`, `-7`, `0`
- **float**: Decimal numbers like `3.14`, `-0.001`
- **complex**: Complex numbers like `3+4j`

Arithmetic operations include addition (`+`), subtraction (`-`), multiplication (`*`), division (`/`), floor division (`//`), modulus (`%`), and exponentiation (`**`).

```python
result = 17 // 5    # Floor division → 3
remainder = 17 % 5  # Modulus → 2
power = 2 ** 10     # Exponentiation → 1024
```

### 1.3 Strings
Strings are immutable sequences of characters. They can be created with single quotes, double quotes, or triple quotes for multi-line strings.

Key string methods:
- `upper()`, `lower()` — case conversion
- `strip()` — remove whitespace
- `split(delimiter)` — split into a list
- `join(iterable)` — join elements with separator
- `replace(old, new)` — substitute substrings
- `find(sub)` — returns index of first occurrence, or -1

**f-strings** (formatted string literals) are the recommended way to embed expressions:
```python
name = "Alice"
greeting = f"Hello, {name}! You are {2024 - 1999} years old."
```

### 1.4 Type Conversion
Use built-in functions to convert between types:
```python
int("42")       # str → int: 42
float("3.14")   # str → float: 3.14
str(100)        # int → str: "100"
bool(0)         # int → bool: False
bool("hello")   # str → bool: True
```

---

## Chapter 2: Control Flow

### 2.1 Conditional Statements
Python uses `if`, `elif`, and `else` for branching. Indentation (4 spaces by convention) defines code blocks.

```python
score = 85
if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
else:
    grade = "F"
```

### 2.2 Comparison and Logical Operators
- Comparison: `==`, `!=`, `<`, `>`, `<=`, `>=`
- Logical: `and`, `or`, `not`
- Identity: `is`, `is not`
- Membership: `in`, `not in`

```python
x = 15
if x > 10 and x < 20:
    print("x is between 10 and 20")

fruits = ["apple", "banana", "cherry"]
if "banana" in fruits:
    print("We have bananas!")
```

### 2.3 Loops

#### For Loops
For loops iterate over sequences (lists, strings, ranges, etc.):
```python
# Iterate over a list
for fruit in ["apple", "banana", "cherry"]:
    print(fruit)

# range(start, stop, step)
for i in range(0, 10, 2):
    print(i)  # 0, 2, 4, 6, 8
```

#### While Loops
While loops repeat as long as a condition is true:
```python
count = 0
while count < 5:
    print(count)
    count += 1
```

#### Break, Continue, and Else
- `break` — exit the loop immediately
- `continue` — skip to the next iteration
- `else` on a loop — executes when the loop finishes without `break`

```python
for n in range(2, 20):
    for d in range(2, n):
        if n % d == 0:
            break
    else:
        print(f"{n} is prime")
```

---

## Chapter 3: Data Structures

### 3.1 Lists
Lists are ordered, mutable collections. They can hold mixed types.

```python
numbers = [1, 2, 3, 4, 5]
numbers.append(6)          # Add to end → [1,2,3,4,5,6]
numbers.insert(0, 0)       # Insert at index → [0,1,2,3,4,5,6]
numbers.pop()              # Remove last → [0,1,2,3,4,5]
numbers.remove(3)          # Remove first occurrence of 3
numbers.sort(reverse=True) # Sort descending
```

**List comprehensions** provide concise syntax:
```python
squares = [x**2 for x in range(10)]           # [0, 1, 4, 9, ..., 81]
evens = [x for x in range(20) if x % 2 == 0]  # [0, 2, 4, ..., 18]
```

**Slicing**: `list[start:stop:step]`
```python
nums = [0, 1, 2, 3, 4, 5]
nums[1:4]     # [1, 2, 3]
nums[::2]     # [0, 2, 4]
nums[::-1]    # [5, 4, 3, 2, 1, 0] — reversed
```

### 3.2 Dictionaries
Dictionaries store key-value pairs with O(1) average lookup time.

```python
student = {
    "name": "Alice",
    "age": 20,
    "courses": ["CS101", "MATH201"]
}
student["gpa"] = 3.8          # Add new key
name = student.get("name")    # Safe access
student.pop("age")            # Remove key

# Iteration
for key, value in student.items():
    print(f"{key}: {value}")
```

**Dictionary comprehensions**:
```python
word_lengths = {word: len(word) for word in ["hello", "world", "python"]}
# {'hello': 5, 'world': 5, 'python': 6}
```

### 3.3 Tuples
Tuples are immutable ordered sequences. They are hashable and can be used as dictionary keys.

```python
point = (3, 4)
x, y = point        # Tuple unpacking
distance = (x**2 + y**2) ** 0.5
```

### 3.4 Sets
Sets are unordered collections of unique elements. They support mathematical set operations.

```python
a = {1, 2, 3, 4}
b = {3, 4, 5, 6}
a | b    # Union: {1, 2, 3, 4, 5, 6}
a & b    # Intersection: {3, 4}
a - b    # Difference: {1, 2}
a ^ b    # Symmetric difference: {1, 2, 5, 6}
```

---

## Chapter 4: Functions

### 4.1 Defining Functions
Functions are defined with the `def` keyword. They support default arguments, keyword arguments, and variable-length arguments.

```python
def greet(name, greeting="Hello"):
    """Return a personalized greeting string."""
    return f"{greeting}, {name}!"

result = greet("Alice")               # "Hello, Alice!"
result = greet("Bob", greeting="Hi")  # "Hi, Bob!"
```

### 4.2 *args and **kwargs
- `*args` collects positional arguments into a tuple
- `**kwargs` collects keyword arguments into a dictionary

```python
def summarize(*args, **kwargs):
    print(f"Positional: {args}")
    print(f"Keyword: {kwargs}")

summarize(1, 2, 3, name="Alice", age=25)
# Positional: (1, 2, 3)
# Keyword: {'name': 'Alice', 'age': 25}
```

### 4.3 Lambda Functions
Lambda functions are anonymous, single-expression functions:
```python
square = lambda x: x ** 2
sorted_words = sorted(["banana", "apple", "cherry"], key=lambda w: len(w))
```

### 4.4 Scope and Closures
Python follows the LEGB rule for variable scope: **Local → Enclosing → Global → Built-in**.

```python
def outer():
    x = 10          # Enclosing scope
    def inner():
        return x * 2  # Accesses enclosing variable
    return inner

closure = outer()
print(closure())    # 20
```

### 4.5 Decorators
A decorator is a function that takes another function and extends its behavior:
```python
def timer(func):
    import time
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        print(f"{func.__name__} took {time.time() - start:.4f}s")
        return result
    return wrapper

@timer
def slow_function():
    import time
    time.sleep(1)
    return "done"
```

---

## Chapter 5: Object-Oriented Programming

### 5.1 Classes and Objects
A class defines a blueprint for objects. The `__init__` method initializes instance attributes.

```python
class Student:
    def __init__(self, name, student_id, gpa=0.0):
        self.name = name
        self.student_id = student_id
        self.gpa = gpa
        self.courses = []

    def enroll(self, course):
        self.courses.append(course)
        return f"{self.name} enrolled in {course}"

    def __str__(self):
        return f"Student({self.name}, GPA: {self.gpa})"

alice = Student("Alice", "S001", 3.8)
alice.enroll("CS101")
```

### 5.2 Inheritance
A child class inherits attributes and methods from a parent class:
```python
class GradStudent(Student):
    def __init__(self, name, student_id, gpa, thesis_topic):
        super().__init__(name, student_id, gpa)
        self.thesis_topic = thesis_topic

    def defend_thesis(self):
        if self.gpa >= 3.5:
            return f"{self.name} successfully defended: {self.thesis_topic}"
        return f"{self.name} needs more preparation"
```

### 5.3 Encapsulation
Use naming conventions to indicate access levels:
- `public_attr` — accessible everywhere
- `_protected_attr` — internal use (convention only)
- `__private_attr` — name-mangled to `_ClassName__private_attr`

### 5.4 Polymorphism
Different classes can implement the same method interface:
```python
class Dog:
    def speak(self): return "Woof!"

class Cat:
    def speak(self): return "Meow!"

for animal in [Dog(), Cat()]:
    print(animal.speak())  # Woof! then Meow!
```

---

## Chapter 6: Error Handling

### 6.1 Try-Except Blocks
```python
try:
    result = 10 / 0
except ZeroDivisionError as e:
    print(f"Error: {e}")
except (TypeError, ValueError) as e:
    print(f"Type/Value error: {e}")
else:
    print("No errors occurred")
finally:
    print("This always executes")
```

### 6.2 Raising Exceptions
```python
def validate_age(age):
    if not isinstance(age, int):
        raise TypeError("Age must be an integer")
    if age < 0 or age > 150:
        raise ValueError(f"Age {age} is not realistic")
    return True
```

### 6.3 Custom Exceptions
```python
class InsufficientFundsError(Exception):
    def __init__(self, balance, amount):
        self.balance = balance
        self.amount = amount
        super().__init__(f"Cannot withdraw ${amount}. Balance: ${balance}")
```

---

## Chapter 7: File I/O

### 7.1 Reading Files
```python
# Read entire file
with open("data.txt", "r") as f:
    content = f.read()

# Read line by line (memory efficient)
with open("data.txt", "r") as f:
    for line in f:
        print(line.strip())
```

### 7.2 Writing Files
```python
# Write (overwrites)
with open("output.txt", "w") as f:
    f.write("Hello, World!\n")

# Append
with open("output.txt", "a") as f:
    f.write("Another line\n")
```

### 7.3 Working with CSV
```python
import csv

# Reading CSV
with open("students.csv", "r") as f:
    reader = csv.DictReader(f)
    for row in reader:
        print(row["name"], row["grade"])

# Writing CSV
with open("output.csv", "w", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=["name", "grade"])
    writer.writeheader()
    writer.writerow({"name": "Alice", "grade": "A"})
```

### 7.4 JSON
```python
import json

# Parse JSON string
data = json.loads('{"name": "Alice", "age": 25}')

# Read JSON file
with open("config.json") as f:
    config = json.load(f)

# Write JSON file
with open("output.json", "w") as f:
    json.dump(data, f, indent=2)
```
