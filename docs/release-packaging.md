# Release Packaging Guidelines

This guide explains how to prepare a clean, public ZIP archive for each release of the Semantic Publishing Protocol.

To ensure no private or system metadata is included in public releases, follow these steps when creating a ZIP archive for distribution:

---

## 1. Exclude the `.git/` Folder
- Never include the `.git/` directory in any distributed or published ZIP archive.
- If you have already created a ZIP, remove `.git/` from the archive before sharing.

## 2. Exclude System and Metadata Files
- Exclude files such as `.DS_Store`, `__MACOSX/`, `Thumbs.db`, and any other OS-generated metadata.

## 3. Recommended Manual Zipping Process

From the project root, run:

```sh
zip -r spp-release.zip . \
  -x '*.git*' \
  -x '*.DS_Store' \
  -x '__MACOSX/*' \
  -x 'Thumbs.db' \
  -x 'ehthumbs.db' \
  -x 'Desktop.ini' \
  -x '*.Spotlight-V100' \
  -x '*.Trashes'
```

## 4. Using a `.zipignore` (if supported by your tooling)
- Create a `.zipignore` file with the following entries:
  ```
  .git/
  .DS_Store
  __MACOSX/
  Thumbs.db
  ehthumbs.db
  Desktop.ini
  *.Spotlight-V100
  *.Trashes
  ```
- Ensure your packaging tool respects `.zipignore`.

## 5. Automation
- If you use a packaging script, add exclusion rules for `.git/` and all system files.

---

**Note:** Never remove the `.git/` directory from your local project—only from distributed or public archives.

---

_This process helps protect project history, privacy, and ensures clean, professional releases._
