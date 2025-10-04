# Contributing to DSA-Patterns-and-Problems 🚀

First off, thank you for considering contributing! Your help makes this repository better for everyone preparing for coding interviews. 💻✨

---

## **Table of Contents**

- [How to Contribute](#how-to-contribute)
- [Project Structure](#project-structure)
- [Guidelines](#guidelines)
- [Adding a New Problem](#adding-a-new-problem)
- [Reporting Issues](#reporting-issues)
- [Code of Conduct](#code-of-conduct)

---

## **How to Contribute**

1. **Fork** the repository.
2. **Clone** your forked repo to your local machine:

```bash
git clone https://github.com/<your-username>/DSA-Patterns-and-Problems.git
```

3. Create a branch for your feature or fix:

```
git checkout -b feature/your-feature-name
```

4. Make your changes (HTML, CSS, JS, or add new problem pages).
5. Commit your changes with a descriptive message:

```
git commit -m "Add new array problem: Sliding Window Maximum"
```

6. Push your branch:

```
git push origin feature/your-feature-name
```

7.Open a Pull Request to the main repository.

## Project Structure

```
DSA-Patterns-and-Problems/
│
├── index.html          # Home page
├── About.html          # About page
├── Contact.html        # Contact page
├── Arrays/             # Array topics
│   ├── index.html
│   ├── TwoSum/
│   └── ...
│   └── AllArrayProblems.css #CSS for all araay question patterns
├── LinkedList/
├── StackQueue/
├── Strings/
├── Recursion/
├── BinarySearch/
├── Heap/
├── BinaryTrees/
├── BST/
├── Graphs/
├── DP/
├── Tries/
└── index.css           # Main CSS
└── about.css           # About Page CSS
└── contact.css           # Contact Page CSS

```

Each topic folder contains separate HTML pages for each problem with approaches explained (Brute, Better, Optimal) along with pseudo-code and complexity.

<hr>

## Guidelines

1. Make sure your HTML/CSS matches the existing style and formatting.
2. Use proper semantic HTML.
3. Add time and space complexity for every problem.
4. Ensure all links in navbar point to correct pages.
5. For JavaScript-based interactivity, keep code modular and clean.
6. Use Google Material Icons for consistent design.

## Adding a New Problem

1. Create a folder inside the relevant topic (e.g., Arrays/SlidingWindowMaximum/).
2. Add the HTML page: SlidingWindowMaximum.html.
3. Use the existing problem page template:
   Problem Statement
   Example(s)
   Approach 1: Brute Force
   Approach 2: Better
   Approach 3: Optimal
4. You may create your own custom css file if required under same folder
5. Pseudo-code + Time & Space Complexity
6. Link it in the topic index page (e.g., Arrays/index.html).

## Reporting Issues

If you find a bug, missing content, or a broken link, please create an issue with a clear description.

## Code of Conduct

Be respectful, kind, and professional. All contributions must follow a positive and inclusive approach.

## Thank You! 🙏

Your contribution helps learners worldwide master DSA and FAANG patterns. Happy Coding! 💻💡
