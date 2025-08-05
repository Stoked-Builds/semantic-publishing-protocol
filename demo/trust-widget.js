// Trust Widget for Semantic Publishing Protocol Endorsement Demo
class TrustWidget {
    static init() {
        this.loadStories();
        this.setupEventListeners();
    }
    
    static async loadStories() {
        try {
            // Load our sample stories
            const stories = await Promise.all([
                this.loadStory('story1-ai-regulation.json'),
                this.loadStory('story2-climate-tech.json')
            ]);
            
            this.renderStories(stories);
        } catch (error) {
            console.error('Error loading stories:', error);
            this.renderErrorState();
        }
    }
    
    static async loadStory(filename) {
        try {
            const response = await fetch(filename);
            if (!response.ok) {
                throw new Error(`Failed to load ${filename}`);
            }
            return await response.json();
        } catch (error) {
            console.warn(`Loading fallback data for ${filename}:`, error);
            return this.getFallbackStory(filename);
        }
    }
    
    static getFallbackStory(filename) {
        const stories = {
            'story1-ai-regulation.json': {
                "id": "ai-regulation-breakthrough",
                "title": "Breakthrough AI Regulation Framework Adopted by Global Coalition",
                "summary": "Major tech companies and governments agree on comprehensive AI safety standards that balance innovation with public protection.",
                "topics": [
                    {"id": "technology", "label": "Technology"},
                    {"id": "policy", "label": "Policy"},
                    {"id": "ai-safety", "label": "AI Safety"}
                ],
                "tags": ["ai", "regulation", "policy", "safety"],
                "lang": "en",
                "date": "2025-01-15",
                "version": "1.0.0",
                "digest": "a1b2c3d4e5f6789012345",
                "author": {
                    "name": "Dr. Sarah Chen",
                    "id": "did:example:sarah-chen-tech-policy",
                    "uri": "https://tech-policy.org/authors/sarah-chen"
                },
                "publisher": {
                    "name": "Tech Policy Today",
                    "id": "did:example:tech-policy-today",
                    "uri": "https://tech-policy.org"
                },
                "source": "Global AI Safety Coalition",
                "license": "CC-BY-4.0",
                "canonical": "https://tech-policy.org/stories/ai-regulation-breakthrough",
                "endorsements": [
                    {
                        "endorser": {
                            "name": "Alice (Trusted AI Expert)",
                            "id": "did:example:alice-ai-expert",
                            "uri": "https://ai-experts.org/alice"
                        },
                        "date": "2025-01-15",
                        "verdict": "accurate",
                        "confidence": 0.95,
                        "type": "fact-check",
                        "evidence": ["verified-sources", "expert-consultation"],
                        "signature": "alice-signature-placeholder"
                    },
                    {
                        "endorser": {
                            "name": "TechWatch Verification",
                            "id": "did:example:techwatch-verification",
                            "uri": "https://techwatch.org"
                        },
                        "date": "2025-01-15",
                        "verdict": "reliable",
                        "confidence": 0.88,
                        "type": "source-verification",
                        "evidence": ["coalition-documents", "official-statements"],
                        "signature": "techwatch-signature-placeholder"
                    }
                ],
                "archived": false
            },
            'story2-climate-tech.json': {
                "id": "climate-tech-investment",
                "title": "Revolutionary Carbon Capture Technology Receives $2B Investment",
                "summary": "New atmospheric carbon capture system promises to remove CO2 at unprecedented scale and efficiency, backed by major climate fund.",
                "topics": [
                    {"id": "climate", "label": "Climate"},
                    {"id": "technology", "label": "Technology"},
                    {"id": "investment", "label": "Investment"}
                ],
                "tags": ["climate", "carbon-capture", "investment", "green-tech"],
                "lang": "en",
                "date": "2025-01-14",
                "version": "1.0.0",
                "digest": "f6e5d4c3b2a1098765432",
                "author": {
                    "name": "Maria Rodriguez",
                    "id": "did:example:maria-climate-reporter",
                    "uri": "https://climate-news.net/authors/maria-rodriguez"
                },
                "publisher": {
                    "name": "Climate News Network",
                    "id": "did:example:climate-news-network",
                    "uri": "https://climate-news.net"
                },
                "source": "GreenTech Solutions Inc.",
                "license": "CC-BY-4.0",
                "canonical": "https://climate-news.net/stories/carbon-capture-investment",
                "endorsements": [
                    {
                        "endorser": {
                            "name": "Alice (Trusted AI Expert)", 
                            "id": "did:example:alice-ai-expert",
                            "uri": "https://ai-experts.org/alice"
                        },
                        "date": "2025-01-14",
                        "verdict": "verified",
                        "confidence": 0.92,
                        "type": "technical-review",
                        "evidence": ["patent-filings", "scientific-papers"],
                        "signature": "alice-signature-placeholder-2"
                    },
                    {
                        "endorser": {
                            "name": "Climate Science Collective",
                            "id": "did:example:climate-science-collective",
                            "uri": "https://climate-science.org"
                        },
                        "date": "2025-01-14",
                        "verdict": "promising",
                        "confidence": 0.85,
                        "type": "peer-review",
                        "evidence": ["expert-panel", "technical-analysis"],
                        "signature": "climate-collective-signature"
                    }
                ],
                "archived": false
            }
        };
        
        return stories[filename] || null;
    }
    
    static renderStories(stories) {
        const container = document.getElementById('stories-container');
        container.innerHTML = stories.map((story, index) => this.renderStoryCard(story, index)).join('');
    }
    
    static renderStoryCard(story, index) {
        const trustLevel = this.calculateTrustLevel(story.endorsements);
        const trustCount = story.endorsements.length;
        
        return `
            <div class="story-card" data-story-id="${story.id}">
                <div class="trust-badge ${trustLevel.class}" data-story-index="${index}">
                    <svg class="trust-icon" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9L10,17Z"/>
                    </svg>
                    ${trustCount} endorsement${trustCount !== 1 ? 's' : ''}
                </div>
                
                <div class="trust-popup" id="popup-${index}">
                    <div class="trust-chain">
                        <h4>Trust Chain:</h4>
                        <div class="breadcrumb">
                            <span class="breadcrumb-item">You</span>
                            <span class="breadcrumb-arrow">→</span>
                            <span class="breadcrumb-item">Alice</span>
                            <span class="breadcrumb-arrow">→</span>
                            <span class="breadcrumb-item">Story</span>
                        </div>
                    </div>
                    
                    <div class="endorsers">
                        <h4>Trusted Endorsers:</h4>
                        ${story.endorsements.map(endorsement => `
                            <div class="endorser">
                                <span class="endorser-name">${endorsement.endorser.name}</span>
                                <span class="confidence">${Math.round(endorsement.confidence * 100)}%</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="story-header">
                    <h3 class="story-title">${story.title}</h3>
                    <div class="story-meta">
                        By ${story.author.name} • ${story.date} • ${story.publisher.name}
                    </div>
                </div>
                
                <div class="story-content">
                    <p class="story-summary">${story.summary}</p>
                    <div class="story-tags">
                        ${story.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                </div>
            </div>
        `;
    }
    
    static calculateTrustLevel(endorsements) {
        if (!endorsements || endorsements.length === 0) {
            return { class: 'no-trust', level: 0 };
        }
        
        const avgConfidence = endorsements.reduce((sum, e) => sum + e.confidence, 0) / endorsements.length;
        
        if (avgConfidence >= 0.9) {
            return { class: 'high-trust', level: 'high' };
        } else if (avgConfidence >= 0.75) {
            return { class: 'medium-trust', level: 'medium' };
        } else {
            return { class: 'low-trust', level: 'low' };
        }
    }
    
    static setupEventListeners() {
        // Handle trust badge hover events
        document.addEventListener('mouseenter', (e) => {
            const badge = this.findClosest(e.target, '.trust-badge');
            if (badge) {
                const storyIndex = badge.dataset.storyIndex;
                const popup = document.getElementById(`popup-${storyIndex}`);
                if (popup) {
                    popup.classList.add('visible');
                }
            }
        }, true);
        
        document.addEventListener('mouseleave', (e) => {
            const badge = this.findClosest(e.target, '.trust-badge');
            if (badge) {
                const storyIndex = badge.dataset.storyIndex;
                const popup = document.getElementById(`popup-${storyIndex}`);
                if (popup) {
                    popup.classList.remove('visible');
                }
            }
        }, true);
        
        // Hide popups when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.findClosest(e.target, '.trust-badge') && !this.findClosest(e.target, '.trust-popup')) {
                document.querySelectorAll('.trust-popup').forEach(popup => {
                    popup.classList.remove('visible');
                });
            }
        });
    }
    
    static findClosest(element, selector) {
        // Polyfill for Element.closest() for better browser compatibility
        if (element.closest) {
            return element.closest(selector);
        }
        
        let el = element;
        while (el && el.nodeType === 1) {
            if (el.matches && el.matches(selector)) {
                return el;
            }
            el = el.parentElement;
        }
        return null;
    }
    
    static renderErrorState() {
        const container = document.getElementById('stories-container');
        container.innerHTML = `
            <div class="story-card">
                <div class="story-header">
                    <h3 class="story-title">Demo Loading...</h3>
                    <div class="story-meta">Loading sample stories with endorsements</div>
                </div>
            </div>
        `;
    }
}

// Export for use in other modules if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TrustWidget;
}