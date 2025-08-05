# Endorsement UX Demo

This demo showcases the Semantic Publishing Protocol's endorsement system with an interactive trust badge overlay and trust chain visualization.

## Features

- **Two Sample Stories**: AI regulation and climate technology news with realistic metadata
- **DID-based Endorsements**: Each endorser has a unique decentralized identifier (DID)
- **Trust Badge Overlay**: Visual indicators showing the number of endorsements
- **Trust Chain Visualization**: Hover popup showing "You → Alice → Story" breadcrumb trail
- **Confidence Scores**: Transparency through endorser confidence ratings
- **Interactive UI**: Responsive design with hover states and popups

## Demo Structure

- `index.html` - Main demo page with responsive layout
- `trust-widget.js` - JavaScript widget handling trust badge interactions
- `story1-ai-regulation.json` - Sample semantic.json for AI regulation story
- `story2-climate-tech.json` - Sample semantic.json for climate technology story

## Usage

1. Open `index.html` in a web browser
2. Hover over the green trust badges to see endorsement details
3. View the trust chain showing how you're connected to each story through trusted agents
4. See confidence scores and endorser information in the popup

## Technical Implementation

The demo uses vanilla JavaScript and follows the established Semantic Publishing Protocol schema structure:

- Stories include standard metadata (title, author, publisher, date)
- Endorsements follow schema.org Endorsement format
- DIDs used for decentralized identity of endorsers
- Trust calculation based on confidence scores from endorsers

## Schema Compliance

All semantic.json files follow the SPP schema at `/schema/semantic.json` with proper endorsement structure including:

- DID-based endorser identification
- Confidence scoring (0.0-1.0)
- Evidence links for transparency
- Digital signature placeholders (for demo purposes)
- Structured verdict types (accurate, verified, promising, etc.)