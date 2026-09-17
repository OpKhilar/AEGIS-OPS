import { EMERGENCY_SYSTEM_PROMPT } from '../data/emergencySystemPrompt.js';
import { matchFirstAidGuide } from '../utils/firstAidMatcher.js';

// Storage key for custom user-supplied Gemini API key
const STORAGE_API_KEY = 'aegis_gemini_api_key';
const STORAGE_OFFLINE_SIM = 'aegis_offline_simulation';

class AiTriageService {
  constructor() {
    this.customApiKey = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_API_KEY) || '' : '';
    this.isOfflineSimulated = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_OFFLINE_SIM) === 'true' : false;
  }

  getApiKey() {
    return this.customApiKey || import.meta.env.VITE_GEMINI_API_KEY || '';
  }

  setApiKey(key) {
    this.customApiKey = (key || '').trim();
    if (typeof window !== 'undefined') {
      if (this.customApiKey) {
        localStorage.setItem(STORAGE_API_KEY, this.customApiKey);
      } else {
        localStorage.removeItem(STORAGE_API_KEY);
      }
    }
  }

  hasApiKey() {
    return Boolean(this.getApiKey());
  }

  isSimulatedOffline() {
    return this.isOfflineSimulated;
  }

  setSimulatedOffline(status) {
    this.isOfflineSimulated = Boolean(status);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_OFFLINE_SIM, String(this.isOfflineSimulated));
    }
  }

  /**
   * Returns true if actual browser is offline or simulated offline mode is active
   */
  isOffline() {
    if (this.isOfflineSimulated) return true;
    if (typeof navigator !== 'undefined' && !navigator.onLine) return true;
    return false;
  }

  /**
   * Primary dispatch for triage query.
   * Seamlessly tries API route / Gemini API first, but instantly fails over
   * to the local pre-loaded Markdown guides on any network drop or error.
   */
  async streamTriageResponse({
    messages,
    onChunk,
    onComplete,
    onError
  }) {
    const latestMessage = messages[messages.length - 1]?.content || '';

    // 1. Check Offline status first: zero-latency static guide fallback
    if (this.isOffline()) {
      return this.serveLocalFallback(latestMessage, 'Offline Mesh Mode: Network Disconnected', onChunk, onComplete);
    }

    const apiKey = this.getApiKey();

    // 2. If online and has /api/chat or Gemini API Key, attempt live AI stream
    try {
      // First attempt: call local Vite /api/chat endpoint
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages,
          apiKey,
          system: EMERGENCY_SYSTEM_PROMPT
        })
      });

      if (response.ok) {
        // Read response stream
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullText = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          fullText += chunk;
          if (onChunk) onChunk(chunk, fullText);
        }

        if (onComplete) {
          onComplete({
            text: fullText,
            isFallback: false,
            source: 'gemini-live',
            triageLevel: this.extractTriageLevel(fullText)
          });
        }
        return;
      }

      // If /api/chat returned 404 or 500, check if we have direct Gemini API Key to call Google directly
      if (apiKey) {
        await this.callDirectGeminiApi(latestMessage, apiKey, onChunk, onComplete);
        return;
      }

      // If no API key or endpoint not answering with 200, engage fallback
      throw new Error(`AI service endpoint responded with status ${response.status}`);
    } catch (err) {
      console.warn('Live AI connection failed. Engaging local emergency protocol fallback:', err.message);
      if (onError) onError(err);
      
      // 3. Resilient Fallback: Serve pre-loaded static Markdown guide
      return this.serveLocalFallback(
        latestMessage,
        `Network Fallback Active (${err.message || 'API Unreachable'})`,
        onChunk,
        onComplete
      );
    }
  }

  /**
   * Direct Google Gemini API call (client-side fallback for static PWA deployments)
   */
  async callDirectGeminiApi(userPrompt, apiKey, onChunk, onComplete) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: userPrompt }]
          }
        ],
        systemInstruction: {
          parts: [{ text: EMERGENCY_SYSTEM_PROMPT }]
        },
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 1024
        }
      })
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error?.message || `Gemini API error: ${res.statusText}`);
    }

    const data = await res.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    if (!generatedText) {
      throw new Error('Empty response received from Gemini API');
    }

    // Deliver smoothly
    if (onChunk) onChunk(generatedText, generatedText);
    if (onComplete) {
      onComplete({
        text: generatedText,
        isFallback: false,
        source: 'gemini-direct',
        triageLevel: this.extractTriageLevel(generatedText)
      });
    }
  }

  /**
   * Serves static pre-loaded Markdown guide when network or API fails
   */
  serveLocalFallback(query, reason, onChunk, onComplete) {
    const match = matchFirstAidGuide(query);
    
    let fallbackText = '';
    if (match.guide) {
      fallbackText = `> [!NOTE]\n> **AEGIS OFFLINE PROTOCOL SERVED**\n> Source: Verified Local First-Aid Cache (${reason})\n\n` + match.markdown;
    } else {
      fallbackText = `> [!WARNING]\n> **OFFLINE MESH ACTIVE**\n> Source: Emergency Protocol Index (${reason})\n\n` + match.markdown;
    }

    // Stream out chunks progressively for smooth visual feedback
    const chunkSize = 60;
    let currentIdx = 0;
    let accumulated = '';

    const streamInterval = setInterval(() => {
      if (currentIdx >= fallbackText.length) {
        clearInterval(streamInterval);
        if (onComplete) {
          onComplete({
            text: fallbackText,
            isFallback: true,
            source: 'local-protocol',
            guide: match.guide,
            triageLevel: match.guide?.triageLevel || '🟡 YELLOW - LOCAL PROTOCOL'
          });
        }
        return;
      }

      const nextChunk = fallbackText.slice(currentIdx, currentIdx + chunkSize);
      accumulated += nextChunk;
      currentIdx += chunkSize;
      if (onChunk) onChunk(nextChunk, accumulated);
    }, 15);
  }

  extractTriageLevel(text = '') {
    if (text.includes('RED') || text.includes('🔴')) return '🔴 RED - CRITICAL';
    if (text.includes('YELLOW') || text.includes('🟡')) return '🟡 YELLOW - URGENT';
    if (text.includes('GREEN') || text.includes('🟢')) return '🟢 GREEN - MINOR';
    return '🟡 YELLOW - ADVISORY';
  }
}

export const aiTriageService = new AiTriageService();
