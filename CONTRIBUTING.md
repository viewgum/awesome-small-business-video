# Contributing

Suggest a resource with a pull request or an issue. An entry is accepted when:

- It is the publisher's own page: the app maker, the regulator, the library or the tool itself. No blogs, listicles, courses,
  affiliate pages or paid placements.
- It is free to read and useful to a small business making short vertical videos.
- Its description says only what the page itself says, in plain words, starts with a capital letter and ends with a period.
- It is added to `sources.json` with the publisher, the day you read it and words copied from the page that support the
  description.

Format, in the right section of README.md:

```
- [Page title](https://example.com/page) - What it is, in one sentence.
```

`node test.mjs` checks the format, that every link has a source with a quote, and the copy rules. CI also checks that every link
answers, once a month and on every change; a site that refuses scripted requests is listed in `.github/workflows/links.yml` and
noted in `sources.json`.
