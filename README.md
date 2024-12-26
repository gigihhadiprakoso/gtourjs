# GTourJS

**GTourJS** is a lightweight JavaScript library that helps you create interactive guides for new users. With this library, you can highlight important elements in your app and provide hints or descriptions that help users understand the function of each element.

---

## Installation

### Via CDN (jsDelivr)

Add the following script in the `<head>` section or before the closing `<body>` tag:

```html
<script src="https://cdn.jsdelivr.net/gh/gigihhadiprakoso/gtourjs@release/gtour.min.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/gigihhadiprakoso/gtourjs@release/gtour.min.css">
```

---

## Usage

### 1. Initialize Library

Add script inside of `<script>` section

```javascript
const tour = new gtourJS()
```

### 2. Create Stages

Create stages with title and description of each element you want to explain to your users

```javascript
tour.queue([
    {
        elem: "#title",
        position: "bottom",
        title: "Hi, welcome to my quick tour about my website",
        description: "This tour will help you to understand the use of the website in a quick and easy way. I hope you enjoy it"
    }
]);
```

### 3. Run It

Don't forget to run through the steps once you've defined them.

```javascript
tour.run();
```

---

## Browser Support

This library support following modern browser:

- Chrome
- Firefox
- Edge
- Safari (still a test run)

---

## Contributing

Contributions are welcome! Please fork this repository and submit a pull request for any enhancements or bug fixes.

---

## Questions or Feedback

If you have any questions or need help, feel free to contact us via [issues](https://github.com/gigihhadiprakoso/gtourjs/issues).
