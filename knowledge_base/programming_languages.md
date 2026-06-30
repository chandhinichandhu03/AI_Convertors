# Programming Languages & Code Transpilation Reference

This guide covers coding paradigms, transpilation principles, compile-time differences, and syntax maps for modern languages.

## 1. Programming Paradigms & Languages
* **Compiled (Static)**: C, C++, Rust, Go, Swift, Java (Bytecode), Kotlin, Scala. These languages check types and memory constraints at compile time, leading to high execution speeds.
* **Interpreted (Dynamic)**: Python, JavaScript, PHP, Ruby, Perl, Lua. Types are resolved at runtime, allowing rapid prototyping but lower peak numerical performance.
* **Multi-paradigm**: TypeScript (compiled to JavaScript), C#, Objective-C.

## 2. Transpilation Constraints & Rules
When translating code (e.g. Java to Python or C++ to Go), preserving semantics is critical:
* **Variables & Scope**: Map block-scoped variables correctly (e.g., `let`/`const` in TypeScript, local variables in Python).
* **Exception Handling**: Map `try-catch-finally` to `try-except-finally`.
* **Classes & OOP**: Map inheritance, construct signatures (e.g., `__init__` in Python, constructors in Java), and method access modifiers (private/public).
* **Memory Management**: Handle pointer management when translating from languages with manual control (like C/C++) to garbage-collected languages (like Java/Go), or safe-referencing languages (like Rust's borrow checker).

## 3. Database SQL Dialects
* **PostgreSQL / SQLite / MySQL**: Use standard SQL queries with minor differences in syntax (e.g., SQLite lacks full outer joins, MySQL uses backticks, PostgreSQL uses double quotes).
* **Oracle / SQL Server**: Support advanced stored procedures (PL/SQL and T-SQL), CTE limits, and window partitioning functions.
* **NoSQL (MongoDB)**: Maps structured document collections using key-value or query filter matrices (e.g. `db.collection.find()`).
