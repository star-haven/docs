# Star Haven Documentation

This is an [mdBook](https://rust-lang.github.io/mdBook/) that can be accessed at https://docs.starhaven.dev.

## Preview

```shell
mdbook serve
```

## Writing style

### Diataxis

[Diataxis](https://diataxis.fr/) is a framework for thinking about and doing documentation.

Diátaxis identifies four distinct needs, and four corresponding forms of documentation:

- Tutorials (learning)
- How-to guides (goals)
- Technical reference (information)
- Explanation (understanding)

![](https://diataxis.fr/_images/diataxis.png)

When someone lands on https://docs.starhaven.dev, we should quickly guide them to the right place.

#### For everything except a tutorial

Keep in mind that the reader is probably looking for a solution to a problem. They don't want to read a novel. They want to get in, get the information they need, and get out.

### Accessibility

- Use alt text for images
- Keep tables simple
  - Never merge cells
  - Never use nested tables
- [Use headings to structure content](#use-descriptive-headings-and-put-them-in-the-right-order)

### Top-down structure

Most important information at the top, least important at the bottom.

Immediately assure the reader they're in the right place.

### Use descriptive headings and put them in the right order

To allow the reader to quickly scan the page and find the information they need.

### Avoid "I"

Use "we" instead. Even better, use the imperative mood.

### Be creative

Technical writing should be (mildly) fun! You may occasionally want to reference pop culture, or use a meme. Just don't overdo it.

### Be concise

Don't use 10 words when 5 will do.
