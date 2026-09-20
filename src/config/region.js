/**
 * Region configuration — single source of truth for localization.
 * The UI reads everything geographic/administrative from here:
 * map center, emergency numbers, region labels, fallback contacts.
 * Swap this object to deploy ResQBharat for a different region.
 */
export const REGION = {
  id: 'in-mumbai',
  country: 'India',
  city: 'Mumbai',
  label: 'MUMBAI COMMAND • INDIA',

  // Map defaults (South–Central Mumbai, Colaba → Sion)
  center: [18.975, 72.845],
  defaultZoom: 12,
  minZoom: 10,
  maxZoom: 18,

  // Emergency infrastructure (India) — all UI emergency-dial actions read from here
  emergencyNumbers: {
    unified: '112',    // national all-in-one emergency number (police/fire/medical)
    ambulance: '108',  // medical / ambulance dispatch
    fire: '101'        // fire brigade
  },
  smsFallbackNumber: '+91112',     // short-code used by the offline SMS fallback

  // Attribution shown in the footer
  attribution: 'BMC • MUMBAI FIRE BRIGADE • NDMA'
};

export default REGION;
