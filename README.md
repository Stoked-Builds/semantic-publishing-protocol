# Semantic Publishing Protocol (SPP)

> The web didn’t die. It was smothered.  
> We’re taking the air back.

---

> [🚀 Get Started](docs/QUICKSTART.md) — Build your first semantic artifact  
> [⚡ Read the Manifesto](MANIFESTO.md) — Why we're building this

---

Every day, more of the open web is being swallowed by walled gardens, algorithmic sludge, and AI engines that strip-mine meaning but give nothing back.

Creators lose traffic. Publishers lose revenue. Readers lose context.  
And the web becomes a shallow pool of recycled noise — increasingly unreadable, unfollowable, and untrustworthy.

**SPP is a new publishing standard for a very different future.**  
It lets content be discovered, reconstructed, trusted, and *understood* — by both humans and machines — without sacrificing ownership, context, or provenance.

---

## 🧠 What It Actually Does

SPP is a decentralised, AI-native content protocol that turns passive web pages into active, intelligent, and self-defending artifacts. It makes your content:

- 🧠 **Machine-readable** — ready to be reconstructed and reused by any AI, without guessing
- 🔐 **Owner-verifiable** — no more scraping, no more theft; attribution is built in
- 🧭 **Context-aware** — agents know where, when, and why something was published
- 🤝 **Endorseable & trustable** — with signals from real humans, not black-box algorithms

It’s RSS with a brain. JSON-LD with attitude. ActivityPub that actually works.

---

## 🔓 What This Unlocks

SPP isn’t just a spec. It’s a rebellion in structured form.

**For Creators & Publishers:**  
Your content becomes a live, verifiable data stream. AI agents can subscribe, remix it (with credit), and even pay you — no more platform middlemen. You own the whole journey.

**For Developers & AI Engineers:**  
Stop scraping brittle HTML. Stop reverse-engineering meaning. With SPP, you get clean, structured truth you can build on — whether you're feeding LLMs, powering dashboards, or creating agentic assistants.

**For Everyone Else:**  
This is the way back to a web that works for us. A web where trust is built in, credit flows to the source, and discovery is driven by *meaning*, not manipulation.

> Stop begging platforms for scraps. Start owning the conversation.

---

## 🧠 Micro-Example: How It Feels

Instead of publishing a messy HTML page and hoping an AI interprets it right, you publish this:

```json
{
  "claim": "The current interest rate is 5.25%",
  "source": "entity:federal-reserve-announcement-123",
  "published_at": "2025-08-07T14:00:00Z"
}
```

Now any AI agent can subscribe to your feed and *know*, with certainty and provenance, what the interest rate is.  
No scraping. No guessing. Just truth.

---

## ⏳ Why This Matters Now

We’re at a fork in the road.

The open web is collapsing into a graveyard of dead links, ghost-town blogs, and SEO-choked clickbait.  
Platforms throttle external links. AI models regurgitate without credit. Search is broken. Social is worse.  
You feel it every time you publish something meaningful — and it vanishes into the void.

**SPP is the counter-move.**  
It lets content carry its own meaning, provenance, and context — wherever it goes.

We can either keep patching the broken system...  
Or we can teach the web to speak for itself — semantically, contextually, and unambiguously.

> The future of the web doesn’t need a new platform.  
> It needs a protocol.

---

## 🛠️ What’s in This Repo?

- 📘 **Canonical Specs** – `/specs`
- 🧪 **Working Examples** – `/examples`
- 📤 **Publishing Flows** – `/flows`
- 📚 **Visual Docs & Diagrams** – `/docs`

Start here: [QUICKSTART.md](docs/QUICKSTART.md)  
Browse all specs: [spec-index.md](docs/spec-index.md)

---

## 🚀 Version: `v0.2.2`

- JSON Schemas
- Consent & trust models
- Agent reconstruction logic
- End-to-end publishing flows

Full changelog: [CHANGELOG.md](docs/changelog.md)

---

## Versioning

SPP follows [Semantic Versioning 2.0.0](https://semver.org/) to ensure predictable updates and backward compatibility.

### Protocol Version

All SPP metadata includes a `protocolVersion` field that indicates which version of the protocol the content follows:

```json
{
  "protocolVersion": "1.0.0",
  "id": "example-content",
  "title": "Example Content"
}
```

### Version Format

- **MAJOR**: Incremented for breaking changes that require content updates
- **MINOR**: Incremented for backward-compatible feature additions
- **PATCH**: Incremented for backward-compatible bug fixes

### Compatibility

- Content published with protocol version `1.x.x` will remain compatible within the `1.x` series
- Agents and validators should gracefully handle minor version differences
- Major version changes may require content migration or updates

---

## 📦 Installation

Install the Dope Drop Protocol CLI globally to get started:

```bash
npm install -g dope-drop-protocol
```

This will give you access to the `dope-drop` command from anywhere on your system.

### Quick Start

1. **Initialize a new semantic project:**
   ```bash
   dope-drop init
   ```
   This creates a `semantic.json` template file with all required fields.

2. **Edit your content:**
   Open `semantic.json` and customize it with your content details, author information, and content body.

3. **Validate your semantic file:**
   ```bash
   dope-drop validate semantic.json
   ```
   Or validate all semantic files in the current directory:
   ```bash
   dope-drop validate
   ```

### Commands

- **`dope-drop init [options]`** - Initialize a new semantic publishing project
  - `-o, --output <file>` - Output file name (default: semantic.json)

- **`dope-drop validate [files...]`** - Validate semantic publishing protocol files
  - `-s, --schema-dir <dir>` - Custom schema directory path
  - `-v, --verbose` - Verbose output with detailed validation reports
  - `--extensions-only` - Only check extensions, skip schema validation

### Examples

```bash
# Create a new semantic content file
dope-drop init -o my-article.json

# Validate specific files
dope-drop validate article1.json article2.json

# Validate with verbose output
dope-drop validate semantic.json --verbose

# Validate all common semantic files in current directory
dope-drop validate
```

---

## 🛠️ Developer Tools

### Drop Scaffold Generator

Create new drop sites with schema-compliant metadata using the `dope-drop` CLI:

```bash
# Create a new blog site
dope-drop init mysite --type blog

# Create a new zine site  
dope-drop init myzine --type zine

# Create a new recipes site
dope-drop init myrecipes --type recipes
```

This will create:
- `<sitename>/site.config.json` with valid site metadata
- `<sitename>/pubs/first/meta.jsonld` with schema-compliant publication metadata
- Directory structure ready for content publishing

The generated files pass validation and include starter content appropriate for each site type.

### Validation CLI

Use the built-in validation tool to check your drop metadata files against their JSON Schemas:

```bash
# Validate all site.config.json and pubs/**/meta.jsonld files
npm run validate

# Or run directly
node scripts/validate.js

# Validate specific files
node scripts/validate.js path/to/site.config.json path/to/meta.jsonld
```

The validator will:
- ✅ Print "All files pass validation" on success (exit code 0)
- ❌ Print "Validation failed" with detailed error information on failure (exit code 1)
- Show schema keyword, data path, and error message for each validation error

Works cross-platform (macOS/Linux/Windows) and is suitable for CI/CD pipelines.

---

## 🤝 Join the Mission

Want to help fix the future of web publishing?  
Start with [CONTRIBUTING.md](CONTRIBUTING.md) and [GOVERNANCE.md](GOVERNANCE.md)

---

> **I taught the Web to speak.**  
> Now it won’t shut up.