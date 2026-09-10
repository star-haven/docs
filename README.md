# Star Haven Documentation

Built with [Astro Starlight](https://starlight.astro.build/) and available at https://docs.starhaven.dev.

## Preview

```shell
nix develop --command npm run dev
```

## Where the content lives

Most pages come from the manuals in the projects they document, and are synced into `src/content/docs/` at build time:

| Section | Source |
| --- | --- |
| [Developing Mods](https://docs.starhaven.dev/papermario-dx/) | [`manual/`](https://github.com/bates64/papermario-dx/tree/main/manual) in papermario-dx |
| [Star Rod Classic](https://docs.starhaven.dev/star-rod-classic/) | [`manual/`](https://github.com/z64a/star-rod-classic/tree/main/manual) in star-rod-classic |

Edit those pages in their own repository — a copy in `src/content/docs/` is overwritten on the next build. This repository owns the home page, the [Playing Mods](https://docs.starhaven.dev/play/) page, and the site itself.

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
