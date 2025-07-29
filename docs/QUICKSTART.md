# QUICKSTART: Semantic Publishing Protocol Walkthrough

Welcome! This guide walks you through a complete example of how a document flows through the Semantic Publishing Protocol (SPP), from submission to output, including all key system components.

---

## 1. Walkthrough Summary

We'll submit a simple article as JSON, match it to a ProcessingTemplate, process it with a Processor, and see the resulting output and job status update. This example shows how SPP enables structured, trusted, and automated publishing.

---

## 2. Sample Submission

Suppose an author wants to publish an article. The submission might look like this:

```json
{
  "title": "The Future of Open Publishing",
  "author": "Jane Doe",
  "content": "Open standards are transforming the web...",
  "tags": ["open web", "publishing", "standards"],
  "submitted_at": "2025-07-28T10:00:00Z"
}
```

---

## 3. ProcessingTemplate Example

A ProcessingTemplate defines how to interpret and validate submissions. Here’s a simple template for articles:

```json
{
  "template_id": "article-v1",
  "fields": {
    "title": {"type": "string", "required": true},
    "author": {"type": "string", "required": true},
    "content": {"type": "string", "required": true},
    "tags": {"type": "array", "items": "string", "required": false}
  },
  "confidence_threshold": 0.95
}
```

- **Field mappings** ensure the submission matches the expected structure.
- **Confidence threshold** sets the minimum validation score for acceptance.

---

## 4. What the Processor Does

The Processor:
- Validates the submission against the template (checks required fields, types)
- Calculates a confidence score (e.g., 0.98)
- Enriches metadata (e.g., adds a unique ID, timestamps)
- Prepares the output for publishing

---

## 5. Output JSON

After processing, the output might look like:

```json
{
  "id": "spp://article/123456",
  "title": "The Future of Open Publishing",
  "author": "Jane Doe",
  "content": "Open standards are transforming the web...",
  "tags": ["open web", "publishing", "standards"],
  "submitted_at": "2025-07-28T10:00:00Z",
  "processed_at": "2025-07-28T10:01:00Z",
  "template_id": "article-v1",
  "confidence": 0.98,
  "status": "succeeded"
}
```

---

## 6. Service Bus Message Update

The system sends a message to the Service Bus to update job status:

```json
{
  "job_id": "job-7890",
  "status": "succeeded",
  "output_ref": "spp://article/123456",
  "timestamp": "2025-07-28T10:01:00Z"
}
```

- **Job status** can be `succeeded`, `failed`, or `escalated`.
- **output_ref** points to the published content.

---

## 7. Recap

This walkthrough shows how SPP:
- Accepts structured submissions
- Validates and enriches them via templates and processors
- Publishes trusted, machine-readable content
- Updates job status for transparency and automation

Explore the repo for more templates, processors, and advanced flows!

---

## Validating Your SPS Files

You can validate `.sps.md` files for compliance using the Python validator in [`tools/validate.py`](../tools/README.md).

Example:

```sh
python tools/validate.py examples/example-01.sps.md
```

See [`tools/README.md`](../tools/README.md) for details.
