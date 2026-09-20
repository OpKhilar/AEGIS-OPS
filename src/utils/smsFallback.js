/**
 * Emergency Cellular SMS Fallback Utility for ResQBharat SOS Dispatch.
 * If navigator.onLine is false or network requests time out, this utility generates
 * an encoded SMS URI (sms:+91112?body=LAT,LONG,STATUS) and automatically opens
 * the user's native device messaging app to dispatch the distress alert via cellular SMS.
 */

import { REGION } from '../config/region';

export const DEFAULT_EMERGENCY_SMS_NUMBER = typeof import.meta !== 'undefined' && import.meta.env?.VITE_EMERGENCY_SMS_NUMBER
  ? import.meta.env.VITE_EMERGENCY_SMS_NUMBER
  : REGION.smsFallbackNumber;

export const DEFAULT_SOS_TIMEOUT_MS = 4000;

/**
 * Builds the encoded emergency SMS URI in the required format:
 * sms:+1234567890?body=LAT,LONG,STATUS
 *
 * @param {Object} options
 * @param {number|string} options.lat - Latitude
 * @param {number|string} options.lng - Longitude
 * @param {string} options.status - Emergency status (e.g. CRITICAL, SOS, SUPPLIES)
 * @param {string} [options.phoneNumber] - Destination emergency responder phone number
 * @returns {string} Encoded SMS URI
 */
export function buildEmergencySmsUri({
  lat = REGION.center[0],
  lng = REGION.center[1],
  status = 'CRITICAL',
  phoneNumber = DEFAULT_EMERGENCY_SMS_NUMBER
}) {
  const cleanLat = Number(lat).toFixed(4);
  const cleanLng = Number(lng).toFixed(4);
  const cleanStatus = (status || 'CRITICAL').toUpperCase().trim();

  // Encoded body: LAT,LONG,STATUS
  const rawBody = `${cleanLat},${cleanLng},${cleanStatus}`;
  const encodedBody = encodeURIComponent(rawBody);

  return `sms:${phoneNumber}?body=${encodedBody}`;
}

/**
 * Automatically launches the user's native device messaging app with the encoded SMS.
 *
 * @param {string} smsUri - The pre-built sms: URI
 * @returns {boolean} True if dispatch succeeded in browser context
 */
export function openDeviceMessagingApp(smsUri) {
  if (typeof window === 'undefined') return false;

  try {
    // Attempt anchor dispatch first (prevents aggressive popup/navigation blockers)
    const link = document.createElement('a');
    link.href = smsUri;
    link.target = '_self';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  } catch (err) {
    console.warn('Anchor link trigger failed, falling back to window.location:', err);
    try {
      window.location.href = smsUri;
      return true;
    } catch (e) {
      console.error('Failed to trigger native SMS application:', e);
      return false;
    }
  }
}

/**
 * Direct trigger for cellular SMS fallback alert.
 * Encodes body and opens native device messenger.
 */
export function triggerSmsFallback({
  lat = REGION.center[0],
  lng = REGION.center[1],
  status = 'CRITICAL',
  phoneNumber = DEFAULT_EMERGENCY_SMS_NUMBER
}) {
  const smsUri = buildEmergencySmsUri({ lat, lng, status, phoneNumber });
  console.warn(`[SMS Fallback] Triggering cellular dispatch via native messenger: ${smsUri}`);
  const opened = openDeviceMessagingApp(smsUri);

  return {
    uri: smsUri,
    opened,
    lat,
    lng,
    status,
    timestamp: Date.now()
  };
}

/**
 * High-reliability SOS execution wrapper with offline detection & timeout fallback.
 *
 * 1. If navigator.onLine is false: Immediately triggers cellular SMS fallback.
 * 2. If online: Executes submitFn with a strict timeout guard (default 4000ms).
 * 3. If request times out or rejects: Automatically triggers cellular SMS fallback.
 *
 * @param {Object} options
 * @param {Function} options.submitFn - Async network submission function
 * @param {Object} options.payload - SOS beacon / report data containing coordinates & status
 * @param {string} [options.phoneNumber] - Emergency responder phone number
 * @param {number} [options.timeoutMs] - Timeout in milliseconds before triggering SMS fallback
 * @param {Function} [options.onSmsTriggered] - Callback fired when SMS fallback executes
 * @returns {Promise<{ success: boolean, smsFallback: boolean, uri?: string, reason?: string, data?: any }>}
 */
export async function executeSosWithSmsFallback({
  submitFn,
  payload,
  phoneNumber = DEFAULT_EMERGENCY_SMS_NUMBER,
  timeoutMs = DEFAULT_SOS_TIMEOUT_MS,
  onSmsTriggered = null
}) {
  const lat = payload.coordinates?.[0] ?? payload.lat ?? REGION.center[0];
  const lng = payload.coordinates?.[1] ?? payload.long ?? payload.lng ?? REGION.center[1];
  const status = payload.status || 'CRITICAL';

  const triggerAndNotify = (reason) => {
    const result = triggerSmsFallback({ lat, lng, status, phoneNumber });
    if (onSmsTriggered) {
      onSmsTriggered({ reason, ...result });
    }
    return {
      success: false,
      smsFallback: true,
      uri: result.uri,
      reason,
      payload
    };
  };

  // 1. Immediate offline check: zero latency SMS dispatch
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    return triggerAndNotify('offline');
  }

  // 2. Online request with strict timeout protection
  try {
    let timeoutHandle;
    const timeoutPromise = new Promise((_, reject) => {
      timeoutHandle = setTimeout(() => {
        reject(new Error('TIMEOUT'));
      }, timeoutMs);
    });

    const networkPromise = Promise.resolve(submitFn(payload));
    const response = await Promise.race([networkPromise, timeoutPromise]);
    clearTimeout(timeoutHandle);

    // If server responded with an error object
    if (response?.error) {
      throw response.error;
    }

    return {
      success: true,
      smsFallback: false,
      data: response
    };
  } catch (err) {
    const reason = err?.message === 'TIMEOUT' ? 'timeout' : 'request_failed';
    console.warn(`SOS dispatch network failed (${reason}). Falling back to cellular SMS.`);
    return triggerAndNotify(reason);
  }
}
