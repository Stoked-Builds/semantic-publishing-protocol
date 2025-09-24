#!/usr/bin/env node

/**
 * SPP Agent Demo
 * 
 * A runnable example demonstrating how AI agents can parse and use
 * Semantic Publishing Protocol drop metadata.
 * 
 * Usage: node examples/agent-demo.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class SPPAgentDemo {
  constructor() {
    this.identity = {
      agent_id: "agent:demo.v1",
      type: "content-analyzer",
      version: "1.0.0",
      purpose: "Demonstrate SPP metadata parsing and trust scoring",
      permissions: ["read", "analyze", "score"]
    };
    
    console.log('🤖 SPP Agent Demo Initialized');
    console.log(`Agent ID: ${this.identity.agent_id}`);
    console.log(`Purpose: ${this.identity.purpose}\n`);
  }

  async run() {
    try {
      console.log('📄 === SPP Agent Usage Demonstration ===\n');
      
      // Step 1: Load and analyze site configuration
      console.log('Step 1: Parsing site.config.json');
      const siteConfig = await this.loadSiteConfig();
      const siteAnalysis = this.analyzeSiteConfig(siteConfig);
      this.displaySiteAnalysis(siteAnalysis);
      
      // Step 2: Process publication metadata
      console.log('\nStep 2: Processing publication metadata');
      const publications = await this.loadPublications();
      
      for (const pub of publications) {
        console.log(`\n📰 Analyzing: ${pub.path}`);
        const metadata = pub.metadata;
        
        // Validate metadata structure
        const validation = this.validateMetadata(metadata);
        console.log(`   ✅ Structure Valid: ${validation.valid} (${validation.format})`);
        if (!validation.valid) {
          console.log(`   ❌ Errors: ${validation.errors.join(', ')}`);
          continue;
        }
        
        // Extract key information
        const info = this.extractContentInfo(metadata);
        console.log(`   📝 Title: ${info.title}`);
        console.log(`   👤 Author: ${info.author.name} (${info.author.type})`);
        console.log(`   🏢 Publisher: ${info.publisher.name}`);
        console.log(`   📅 Published: ${info.publishedDate}`);
        console.log(`   🏷️  Keywords: ${info.keywords.join(', ')}`);
        
        // Calculate trust score
        const trustScore = this.calculateTrustScore(metadata, siteConfig);
        console.log(`   🔍 Trust Score: ${trustScore.toFixed(3)}`);
        
        // Make content decision
        const decision = this.makeContentDecision(trustScore);
        console.log(`   📊 Decision: ${decision.action.toUpperCase()}`);
        console.log(`   💭 Reason: ${decision.reason}`);
        
        if (decision.warning) {
          console.log(`   ⚠️  Warning: ${decision.warning}`);
        }
      }
      
      // Step 3: Demonstrate content request patterns
      console.log('\n\nStep 3: Content Request Patterns');
      this.demonstrateRequestPatterns();
      
      console.log('\n✅ Demo completed successfully!');
      console.log('\nFor more information, see: docs/agent.md');
      
    } catch (error) {
      console.error('❌ Demo failed:', error.message);
      process.exit(1);
    }
  }

  async loadSiteConfig() {
    const configPath = path.join(__dirname, 'stoked.dev', 'site.config.json');
    try {
      const content = fs.readFileSync(configPath, 'utf8');
      return JSON.parse(content);
    } catch (error) {
      console.warn('⚠️  Could not load site.config.json, using mock data');
      return this.getMockSiteConfig();
    }
  }

  async loadPublications() {
    const publications = [];
    const pubsDir = path.join(__dirname, 'stoked.dev', 'pubs');
    
    try {
      const dirs = fs.readdirSync(pubsDir);
      
      for (const dir of dirs) {
        const metaPath = path.join(pubsDir, dir, 'meta.jsonld');
        if (fs.existsSync(metaPath)) {
          const content = fs.readFileSync(metaPath, 'utf8');
          publications.push({
            path: `pubs/${dir}/meta.jsonld`,
            metadata: JSON.parse(content)
          });
        }
      }
    } catch (error) {
      console.warn('⚠️  Could not load publications from pubs directory');
    }
    
    // Also load JSON-LD example
    try {
      const jsonLdPath = path.join(__dirname, 'json-ld-example.jsonld');
      if (fs.existsSync(jsonLdPath)) {
        const content = fs.readFileSync(jsonLdPath, 'utf8');
        publications.push({
          path: 'json-ld-example.jsonld',
          metadata: JSON.parse(content)
        });
      }
    } catch (error) {
      console.warn('⚠️  Could not load JSON-LD example');
    }
    
    // Use mock data if no publications found
    if (publications.length === 0) {
      console.warn('⚠️  No publications found, using mock data');
      publications.push({
        path: 'mock/meta.jsonld',
        metadata: this.getMockMetadata()
      });
    }
    
    return publications;
  }

  analyzeSiteConfig(config) {
    // Handle topics from different possible locations
    let topics = [];
    if (config.topics) {
      topics = Array.isArray(config.topics) ? config.topics : [];
    } else if (config.siteMetadata?.topics) {
      topics = Array.isArray(config.siteMetadata.topics) ? config.siteMetadata.topics : [];
    }
    
    return {
      name: config.publisher?.name || config.siteMetadata?.name || 'Unknown',
      publisherType: config.publisher?.organizationType || 'unknown',
      protocolVersion: config.protocolVersion,
      trustLevel: this.assessPublisherTrust(config),
      topics: topics,
      articlesCount: config.stories?.length || 0
    };
  }

  assessPublisherTrust(config) {
    let trust = 'basic';
    
    if (config.trustSettings?.verificationLevel === 'verified') {
      trust = 'verified';
    } else if (config.trustSettings?.verificationLevel === 'premium') {
      trust = 'premium';
    }
    
    return trust;
  }

  displaySiteAnalysis(analysis) {
    console.log(`   🏢 Publisher: ${analysis.name}`);
    console.log(`   📋 Type: ${analysis.publisherType}`);
    console.log(`   🔢 Protocol Version: ${analysis.protocolVersion}`);
    console.log(`   🔐 Trust Level: ${analysis.trustLevel}`);
    console.log(`   📚 Topics: ${analysis.topics.join(', ') || 'None specified'}`);
    console.log(`   📰 Articles: ${analysis.articlesCount}`);
  }

  validateMetadata(metadata) {
    const errors = [];
    
    // Check for JSON-LD structure first
    const isJsonLD = metadata['@context'] && metadata['@type'];
    
    if (isJsonLD) {
      // JSON-LD validation
      if (!metadata['@context']) errors.push('Missing @context');
      if (!metadata['@type']) errors.push('Missing @type');
      if (!metadata.name) errors.push('Missing name/title');
      if (!metadata.datePublished) errors.push('Missing datePublished');
      if (!metadata.protocolVersion) errors.push('Missing protocolVersion');
    } else {
      // Custom SPP format validation (legacy)
      if (!metadata.protocolVersion) errors.push('Missing protocolVersion');
      if (!metadata.id && !metadata.title) errors.push('Missing id or title');
    }
    
    return {
      valid: errors.length === 0,
      errors,
      format: isJsonLD ? 'JSON-LD' : 'SPP-Custom'
    };
  }

  extractContentInfo(metadata) {
    // Handle both JSON-LD and custom SPP formats
    const isJsonLD = metadata['@context'] && metadata['@type'];
    
    if (isJsonLD) {
      return {
        title: metadata.name || 'Untitled',
        description: metadata.description || '',
        publishedDate: metadata.datePublished ? new Date(metadata.datePublished).toLocaleDateString() : 'Unknown',
        author: {
          name: metadata.author?.name || 'Unknown Author',
          type: metadata.author?.['@type'] || 'Unknown',
          url: metadata.author?.url || null
        },
        publisher: {
          name: metadata.publisher?.name || 'Unknown Publisher',
          type: metadata.publisher?.['@type'] || 'Unknown',
          url: metadata.publisher?.url || null
        },
        keywords: Array.isArray(metadata.keywords) ? metadata.keywords : [],
        license: metadata.license || null,
        url: metadata.url || null
      };
    } else {
      // Custom SPP format
      return {
        title: metadata.title || metadata.id || 'Untitled',
        description: metadata.summary || '',
        publishedDate: metadata.date ? new Date(metadata.date).toLocaleDateString() : 'Unknown',
        author: {
          name: metadata.author?.name || 'Unknown Author',
          type: 'Person',
          url: metadata.author?.uri || null
        },
        publisher: {
          name: metadata.publisher?.name || 'Unknown Publisher',
          type: 'Organization',
          url: metadata.publisher?.uri || null
        },
        keywords: Array.isArray(metadata.tags) ? metadata.tags : [],
        license: metadata.license || null,
        url: metadata.canonical || null
      };
    }
  }

  calculateTrustScore(metadata, siteConfig) {
    let score = 0.5; // Base neutral score
    
    // Publisher verification level (0.0 - 0.3)
    const verificationBonus = {
      'none': 0.0,
      'basic': 0.1,
      'verified': 0.2,
      'premium': 0.3
    };
    const trustLevel = this.assessPublisherTrust(siteConfig);
    score += verificationBonus[trustLevel] || 0.0;
    
    // Author information completeness (0.0 - 0.2)
    if (metadata.author?.url) score += 0.1;
    if (metadata.author?.['@type'] === 'Person') score += 0.05;
    if (metadata.author?.name && metadata.author.name !== 'Unknown Author') score += 0.05;
    
    // Content freshness (0.0 - 0.1)
    if (metadata.datePublished) {
      const ageHours = (Date.now() - new Date(metadata.datePublished)) / (1000 * 60 * 60);
      if (ageHours < 24) score += 0.1;
      else if (ageHours < 168) score += 0.05; // Within a week
    }
    
    // License clarity (0.0 - 0.05)
    if (metadata.license?.includes('CC-')) score += 0.05;
    
    // Content richness (0.0 - 0.1)
    if (metadata.description && metadata.description.length > 50) score += 0.03;
    if (Array.isArray(metadata.keywords) && metadata.keywords.length > 0) score += 0.03;
    if (metadata.url) score += 0.02;
    if (metadata.inLanguage) score += 0.02;
    
    return Math.min(score, 1.0);
  }

  makeContentDecision(trustScore) {
    if (trustScore >= 0.8) {
      return {
        action: 'highlight',
        reason: 'High trust content - prominently display',
        styling: 'featured',
        priority: 'high'
      };
    } else if (trustScore >= 0.6) {
      return {
        action: 'display',
        reason: 'Trusted content - normal display',
        styling: 'normal',
        priority: 'medium'
      };
    } else if (trustScore >= 0.3) {
      return {
        action: 'display_with_warning',
        reason: 'Mixed trust signals - show with caution',
        styling: 'warning',
        priority: 'low',
        warning: 'This content has mixed trust signals. Verify before sharing.'
      };
    } else {
      return {
        action: 'suppress',
        reason: 'Low trust content - minimize or hide',
        styling: 'suppressed',
        priority: 'none',
        warning: 'This content has low trust signals and may be unreliable.'
      };
    }
  }

  demonstrateRequestPatterns() {
    console.log('🌐 Typical Agent Request Flow:');
    console.log('');
    console.log('1. 🔍 Discovery:');
    console.log('   GET /.well-known/spp.json');
    console.log('   → Retrieve site configuration and capabilities');
    console.log('');
    console.log('2. 📡 Feed Request:');
    console.log('   GET /feed.json');
    console.log('   → Get list of available content with metadata URLs');
    console.log('');
    console.log('3. 📄 Metadata Request:');
    console.log('   GET /pubs/article-123/meta.jsonld');
    console.log('   → Fetch rich semantic metadata for specific content');
    console.log('');
    console.log('4. 📖 Content Request (optional):');
    console.log('   GET /content/article-123.json');
    console.log('   → Retrieve full structured content if needed');
    console.log('');
    console.log('Request Headers:');
    console.log('   Accept: application/ld+json, application/json');
    console.log('   User-Agent: SPP-Agent/1.0');
    console.log('   SPP-Agent-ID: agent:demo.v1');
  }

  getMockSiteConfig() {
    return {
      "protocolVersion": "1.0.0",
      "siteMetadata": {
        "name": "Demo Tech News",
        "url": "https://demo.example.com",
        "description": "Technology news and analysis",
        "publisher": {
          "name": "Demo Publishing Corp",
          "organizationType": "company"
        },
        "topics": ["technology", "AI", "web3"]
      },
      "trustSettings": {
        "verificationLevel": "verified",
        "allowEndorsements": true
      },
      "stories": []
    };
  }

  getMockMetadata() {
    return {
      "@context": "https://schema.org",
      "@type": "Article",
      "name": "The Future of AI Agents in Content Discovery",
      "description": "Exploring how AI agents will revolutionize how we discover and consume digital content through semantic protocols.",
      "datePublished": "2025-01-28T10:00:00Z",
      "protocolVersion": "1.0.0",
      "author": {
        "@type": "Person",
        "name": "Alex Thompson",
        "url": "https://demo.example.com/authors/alex-thompson"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Demo Tech News",
        "url": "https://demo.example.com"
      },
      "keywords": ["AI", "agents", "semantic web", "content discovery"],
      "license": "CC-BY-4.0",
      "url": "https://demo.example.com/articles/future-ai-agents",
      "inLanguage": "en"
    };
  }
}

// Run the demo
if (import.meta.url === `file://${process.argv[1]}`) {
  const demo = new SPPAgentDemo();
  demo.run().catch(console.error);
}

export default SPPAgentDemo;