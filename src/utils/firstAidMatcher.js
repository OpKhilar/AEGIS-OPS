import { FIRST_AID_GUIDES } from '../data/firstAidGuides.js';

/**
 * Normalizes text for scoring (lowercase, removes punctuation)
 */
function tokenize(text = '') {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(token => token.length > 1);
}

/**
 * Matches a user query to the best pre-loaded first-aid guide.
 * Returns { guide, score, isIndex: boolean }
 */
export function matchFirstAidGuide(query = '') {
  if (!query || typeof query !== 'string') {
    return {
      guide: null,
      isIndex: true,
      markdown: generateIndexMarkdown()
    };
  }

  const queryLower = query.toLowerCase().trim();
  const queryTokens = tokenize(query);

  if (queryTokens.length === 0) {
    return {
      guide: null,
      isIndex: true,
      markdown: generateIndexMarkdown()
    };
  }

  // Check for direct index / list requests
  const indexKeywords = ['index', 'list', 'menu', 'all', 'protocols', 'guides', 'help me', 'options'];
  if (indexKeywords.some(k => queryLower === k || queryLower === `show ${k}`)) {
    return {
      guide: null,
      isIndex: true,
      markdown: generateIndexMarkdown()
    };
  }

  let bestMatch = null;
  let highestScore = 0;

  for (const guide of FIRST_AID_GUIDES) {
    let score = 0;

    // 1. Exact ID or Title matches (super high priority)
    if (queryLower.includes(guide.id) || queryLower.includes(guide.title.toLowerCase())) {
      score += 100;
    }

    // 2. Keyword matches
    const matchedKeywords = guide.keywords.filter(keyword => {
      const kLower = keyword.toLowerCase();
      // Check if keyword is in query or query has word matching keyword
      return queryLower.includes(kLower) || queryTokens.includes(kLower);
    });

    score += matchedKeywords.length * 20;

    // 3. Token overlap with guide title
    const titleTokens = tokenize(guide.title);
    for (const qt of queryTokens) {
      if (titleTokens.includes(qt)) {
        score += 15;
      }
    }

    // 4. Token overlap with summary
    const summaryTokens = tokenize(guide.summary);
    for (const qt of queryTokens) {
      if (summaryTokens.includes(qt)) {
        score += 5;
      }
    }

    if (score > highestScore) {
      highestScore = score;
      bestMatch = guide;
    }
  }

  // Threshold: if score is at least 15, we consider it a confident match
  if (bestMatch && highestScore >= 15) {
    return {
      guide: bestMatch,
      score: highestScore,
      isIndex: false,
      markdown: bestMatch.markdown,
      title: bestMatch.title,
      triageLevel: bestMatch.triageLevel
    };
  }

  // Otherwise, return nearest match if any, or provide the comprehensive emergency index
  return {
    guide: null,
    isIndex: true,
    score: highestScore,
    markdown: generateIndexMarkdown(query)
  };
}

/**
 * Generates an emergency index markdown table for quick offline navigation
 */
export function generateIndexMarkdown(unmatchedQuery = '') {
  let header = `### 📋 AEGIS-MEDIC OFFLINE FIRST-AID DIRECTORY\n\n`;
  if (unmatchedQuery) {
    header += `> [!NOTE]\n> No exact offline match for **"${unmatchedQuery}"**. Here are the verified local emergency triage protocols stored in cache:\n\n`;
  } else {
    header += `> [!TIP]\n> Network offline or disconnected. All protocols below are stored locally in your browser memory:\n\n`;
  }

  const redGuides = FIRST_AID_GUIDES.filter(g => g.triageLevel.includes('RED'));
  const yellowGuides = FIRST_AID_GUIDES.filter(g => !g.triageLevel.includes('RED'));

  let body = `#### 🔴 IMMEDIATE / LIFE-THREATENING PROTOCOLS\n`;
  redGuides.forEach(g => {
    body += `- **${g.title}** \`[${g.keywords.slice(0, 3).join(', ')}]\`\n  _${g.summary}_\n`;
  });

  body += `\n#### 🟡 URGENT / STABILIZATION PROTOCOLS\n`;
  yellowGuides.forEach(g => {
    body += `- **${g.title}** \`[${g.keywords.slice(0, 3).join(', ')}]\`\n  _${g.summary}_\n`;
  });

  body += `\n\n*Type any keyword above (e.g., "CPR", "Bleeding", "Burns", "Choking", "Snake") or click a quick-action button below to instantly load the full step-by-step triage guide.*`;

  return header + body;
}

/**
 * Returns all guides for dropdown or direct selection
 */
export function getAllFirstAidGuides() {
  return FIRST_AID_GUIDES;
}

/**
 * Finds a guide by its unique id
 */
export function getGuideById(id) {
  return FIRST_AID_GUIDES.find(g => g.id === id);
}
