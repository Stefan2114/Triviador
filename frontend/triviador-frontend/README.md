# Question Manager App

## 🚀 Project Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Run the development server

```bash
npm run dev
```

The app will start at `http://localhost:5173`

---

## ✨ Features

### ✅ Add New Questions

- Fill in the form with question details (text, category, type, correct and wrong answers).
- Supports two categories: **Math** and **Football**.
- Supports two types: **Open-ended** and **Multiple choice**.
- Validates that the question and correct answer fields are not empty.

### ✅ Display Questions

- Dynamically lists all added questions.
- Shows category, type, and correct answer.
- For multiple-choice questions, it also displays the wrong answers.

---

## 🛠️ Improvements & Enhancements

- ✅ Input validation for empty fields
- ✅ Supports multiple question types
- ✅ Dynamic UI updates without refresh

---

## 🧪 How to Test

1. **Add Open-ended Question:**

   - Example: "What is 8 \* 7?", category: `math`, type: `open-ended`, correct answer: `56`

2. **Add Multiple Choice Question:**

   - Example: "Who won the FIFA World Cup in 2018?", category: `football`, type: `multiple-choice`, correct answer: `France`, wrong answers: `Brazil`, `Spain`, `Germany`

3. **Check the List:** Ensure all added questions appear correctly.

---

Happy coding! 🚀
