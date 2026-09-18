import { REGION } from '../config/region';

/**
 * Demo/seed dataset — Mumbai, India.
 * All coordinates, names, contacts and places are India-based.
 * Consumed by services/emergencyService.js as the offline/fallback layer.
 */

export const INITIAL_INCIDENTS = [
  {
    id: 'INC-8092',
    title: '4-Alarm Commercial Structure Fire',
    type: 'fire',
    severity: 'critical',
    location: [18.9500, 72.8350],
    address: 'Nariman Point Business District',
    reportedAt: '12 mins ago',
    timestamp: Date.now() - 12 * 60 * 1000,
    status: 'active',
    casualties: '3 Injured / Evacuating Floors 4-7',
    description: 'Heavy black smoke billowing from upper floors. Mumbai Fire Brigade conducting interior suppression and roof ventilation.',
    assignedResponders: ['ENG-14', 'RESCUE-9'],
    radius: 400
  },
  {
    id: 'INC-8094',
    title: 'Flash Flood & Submerged Vehicles',
    type: 'flood',
    severity: 'critical',
    location: [18.9680, 72.8280],
    address: 'Hindmata Junction Underpass, Parel',
    reportedAt: '24 mins ago',
    timestamp: Date.now() - 24 * 60 * 1000,
    status: 'active',
    casualties: '2 Trapped in SUV / Water Rising 4ft',
    description: 'Monsoon drain backup causing rapid inundation. Water rescue boat deployment requested.',
    assignedResponders: ['BOAT-01'],
    radius: 500
  },
  {
    id: 'INC-8095',
    title: 'Ammonia Tanker Vapor Leak',
    type: 'hazmat',
    severity: 'warning',
    location: [18.9350, 72.8420],
    address: 'Wadala Truck Terminal',
    reportedAt: '38 mins ago',
    timestamp: Date.now() - 38 * 60 * 1000,
    status: 'active',
    casualties: '0 Reported / 800m Exclusion Perimeter',
    description: 'Slow vapor plume drifting northeast toward the harbour. Hazmat perimeter established with air sampling drones.',
    assignedResponders: ['HAZMAT-7'],
    radius: 650
  },
  {
    id: 'INC-8096',
    title: 'Multi-Vehicle Pileup w/ Mass Trauma',
    type: 'medical',
    severity: 'critical',
    location: [18.9250, 72.8330],
    address: 'Eastern Express Highway Slip Road',
    reportedAt: '45 mins ago',
    timestamp: Date.now() - 45 * 60 * 1000,
    status: 'active',
    casualties: '6 Critical / Triage Tag Red: 2, Yellow: 4',
    description: 'Highway pileup involving a BEST bus. Medevac LZ cleared at adjacent service lane.',
    assignedResponders: ['MEDEVAC-2', 'AMB-10'],
    radius: 350
  }
];

export const INITIAL_RESOURCES = [
  // 1. Emergency Shelters
  {
    id: 'RES-SHL-01',
    name: 'Azad Maidan Emergency Shelter',
    type: 'shelter',
    location: [18.9450, 72.8380],
    address: 'Azad Maidan, Dhobi Talao',
    capacityCurrent: 384,
    capacityMax: 500,
    contact: '+91 22 2262 5001',
    services: ['Emergency Cots', 'Hot Food Service', 'Backup Generator', 'Pet Kennels'],
    status: 'OPEN'
  },
  {
    id: 'RES-SHL-02',
    name: 'Shivaji Park Community Refuge',
    type: 'shelter',
    location: [18.9800, 72.8380],
    address: 'Shivaji Park, Dadar West',
    capacityCurrent: 142,
    capacityMax: 350,
    contact: '+91 22 2445 2002',
    services: ['Cots & Blankets', 'Potable Water Tank', 'Satellite Wi-Fi', 'Infant Care'],
    status: 'OPEN'
  },
  {
    id: 'RES-SHL-03',
    name: 'Parel Mills Evac Station',
    type: 'shelter',
    location: [18.9700, 72.8400],
    address: 'Kamala Mills Compound, Lower Parel',
    capacityCurrent: 290,
    capacityMax: 300,
    contact: '+91 22 2490 8003',
    services: ['Warm Clothing', 'Hygiene Kits', 'Marathi-Hindi Support'],
    status: 'NEAR_CAPACITY'
  },

  // 2. Medical Centers & Urgent Triage
  {
    id: 'RES-MED-01',
    name: 'KEM Hospital Trauma & Emergency Hub',
    type: 'medical_center',
    location: [18.9920, 72.8460],
    address: 'Acharya Donde Marg, Parel',
    capacityCurrent: 42,
    capacityMax: 60,
    contact: '+91 22 2410 7000 (EMS Desk)',
    services: ['Level 1 Trauma Unit', 'Burn Care ICU', 'Helipad LZ', 'Blood Bank'],
    status: 'OPEN'
  },
  {
    id: 'RES-MED-02',
    name: 'Sion Hospital Emergency Triage Wing',
    type: 'medical_center',
    location: [19.0400, 72.8650],
    address: 'Sion West',
    capacityCurrent: 18,
    capacityMax: 35,
    contact: '+91 22 2407 5000',
    services: ['Rapid Decontamination', 'Toxicology Screening', 'Pediatric Trauma'],
    status: 'OPEN'
  },

  // 3. Volunteer Contact & Staging Hubs
  {
    id: 'RES-VOL-01',
    name: 'Parel Volunteer Relief & Staging Depot',
    type: 'volunteer_hub',
    location: [18.9770, 72.8440],
    address: 'Ganpatrao Kadam Marg, Dadar East',
    capacityCurrent: 85,
    capacityMax: 150,
    contact: 'Volunteer Coord. Capt. Deshmukh: +91 98200 44001 (V-NET 14)',
    services: ['Sandbag Distribution', 'First Aid Volunteers', 'Food Delivery Vans', 'HAM Radio'],
    status: 'OPEN'
  },
  {
    id: 'RES-VOL-02',
    name: 'Dadar Community Volunteer Base',
    type: 'volunteer_hub',
    location: [18.9790, 72.8420],
    address: 'Ranade Road, Dadar West',
    capacityCurrent: 40,
    capacityMax: 80,
    contact: 'Coordinator Priya Joshi: +91 98200 44002',
    services: ['Marathi Translators', 'Elderly Escort Teams', 'Mobile Device Charging'],
    status: 'OPEN'
  }
];

export const INITIAL_RESPONDERS = [
  {
    id: 'ENG-14',
    name: 'Fire Engine 14 "Vayu"',
    unitType: 'Fire & Rescue',
    status: 'ON SCENE',
    location: [18.9490, 72.8355],
    assignedIncidentId: 'INC-8092',
    radioChannel: 'MFB-TAC 4 (154.28 MHz)',
    crewCount: 5,
    leadOfficer: 'Capt. Vikram Rane',
    fuelBattery: '88%',
    equipment: ['1500 GPM Pump', 'Thermal Camera', 'Forcible Entry Kit']
  },
  {
    id: 'MEDEVAC-2',
    name: 'Air Ambulance Sky-2',
    unitType: 'Critical Care Flight',
    status: 'EN ROUTE',
    location: [18.9080, 72.8410],
    assignedIncidentId: 'INC-8096',
    radioChannel: 'MED-AIR 1 (123.05 MHz)',
    crewCount: 3,
    leadOfficer: 'Dr. Anjali Deshpande, Flight Surg.',
    fuelBattery: '65%',
    equipment: ['Blood Bank Cooler', 'Dual Ventilators', 'Ultrasonic Triage']
  },
  {
    id: 'HAZMAT-7',
    name: 'HazMat Heavy 7',
    unitType: 'CBRN Containment',
    status: 'ON SCENE',
    location: [18.9355, 72.8430],
    assignedIncidentId: 'INC-8095',
    radioChannel: 'HAZ-OPS 9 (460.12 MHz)',
    crewCount: 6,
    leadOfficer: 'Chief Specialist Kulkarni',
    fuelBattery: '92%',
    equipment: ['Level A Encapsulated Suits', 'Gas Spectrometer', 'Decon Basin']
  },
  {
    id: 'BOAT-01',
    name: 'Swiftwater Rescue Boat 1',
    unitType: 'Marine & Flood Ops',
    status: 'EN ROUTE',
    location: [18.9660, 72.8290],
    assignedIncidentId: 'INC-8094',
    radioChannel: 'WATER-TAC 2 (156.80 MHz)',
    crewCount: 4,
    leadOfficer: 'Lt. Sameer Pawar',
    fuelBattery: '78%',
    equipment: ['Rigid Inflatable', 'Drysuits', 'High-Angle Rope System']
  },
  {
    id: 'RESCUE-9',
    name: 'Heavy Rescue Squad 9',
    unitType: 'Structural Search',
    status: 'ON SCENE',
    location: [18.9505, 72.8345],
    assignedIncidentId: 'INC-8092',
    radioChannel: 'MFB-TAC 4 (154.28 MHz)',
    crewCount: 4,
    leadOfficer: 'Sgt. Meera Iyer',
    fuelBattery: '81%',
    equipment: ['Acoustic Search Sensors', 'Hydraulic Spreaders', 'Air Shoring']
  }
];

export const INITIAL_USER_STATUSES = [
  {
    id: 'USR-8821',
    status: 'SAFE',
    location: 'Azad Maidan North Plaza',
    coordinates: [18.9455, 72.8385],
    statusMessage: 'Group sheltered safely on ground floor. Have water and power.',
    headcount: 3,
    phone: '+91 98200 31199',
    timestamp: Date.now() - 15 * 60 * 1000
  }
];

export const INITIAL_ALERTS = [
  {
    id: 'ALT-1001',
    severity: 'critical',
    source: 'NDMA BROADCAST',
    title: 'EVACUATION ORDER: Nariman Point Blocks 4-5',
    message: 'Mandatory structural evacuation due to 4-alarm fire. Avoid Fort business district transit corridors.',
    timestamp: 'Just now',
    time: Date.now() - 30 * 1000,
    zone: 'Sector 4-B'
  },
  {
    id: 'ALT-1002',
    severity: 'critical',
    source: 'EMS FLIGHT DESK',
    title: 'Medevac Sky-2 En Route to Eastern Highway LZ',
    message: 'Landing zone secured at service lane 14. Keep emergency lanes clear for 4 incoming paramedic rigs.',
    timestamp: '4m ago',
    time: Date.now() - 4 * 60 * 1000,
    zone: 'Wadala Corridor'
  },
  {
    id: 'ALT-1003',
    severity: 'warning',
    source: 'HAZMAT COMMAND',
    title: 'Vapor Containment Buffer: Wadala Truck Terminal',
    message: 'Shelter in place for residents within 500 meters downwind of Wadala. Close all HVAC intakes.',
    timestamp: '14m ago',
    time: Date.now() - 14 * 60 * 1000,
    zone: 'Wadala East'
  },
  {
    id: 'ALT-1004',
    severity: 'warning',
    source: 'HYDROLOGY SENSOR',
    title: 'Rapid Water Rise: Hindmata Junction Underpass',
    message: 'Flash flooding has reached 4.2 feet. Swiftwater boat unit 01 deployed for vehicle rescues.',
    timestamp: '22m ago',
    time: Date.now() - 22 * 60 * 1000,
    zone: 'Parel Corridor'
  }
];

export const BROADCAST_TICKERS = [
  `🚨 CRITICAL: 4-Alarm Fire at Nariman Point - Avoid Sector 4-B`,
  `🌊 FLASH FLOOD WARNING: Hindmata underpass impassable`,
  '⚠️ HAZMAT ADVISORY: Wadala Vapor Perimeter in effect - Close windows',
  '🚁 MEDEVAC ACTIVE: Eastern Express Highway corridor reserved for air triage',
  '🛡️ SHELTER UPDATE: Azad Maidan & Shivaji Park open with medical staff'
];

export { REGION };
