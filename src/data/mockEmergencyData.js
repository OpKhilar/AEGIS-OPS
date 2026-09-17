export const INITIAL_INCIDENTS = [
  {
    id: 'INC-8092',
    title: '4-Alarm Commercial Structure Fire',
    type: 'fire',
    severity: 'critical',
    location: [37.7833, -122.4167],
    address: '450 Mission St, Financial District',
    reportedAt: '12 mins ago',
    timestamp: Date.now() - 12 * 60 * 1000,
    status: 'active',
    casualties: '3 Injured / Evacuating Floors 4-7',
    description: 'Heavy black smoke billowing from upper floors. Fire crews conducting interior suppression and roof ventilation.',
    assignedResponders: ['ENG-14', 'RESCUE-9'],
    radius: 400
  },
  {
    id: 'INC-8094',
    title: 'Flash Flood & Submerged Vehicles',
    type: 'flood',
    severity: 'critical',
    location: [37.7680, -122.4280],
    address: 'Mission St & 16th St Incline Underpass',
    reportedAt: '24 mins ago',
    timestamp: Date.now() - 24 * 60 * 1000,
    status: 'active',
    casualties: '2 Trapped in SUV / Water Rising 4ft',
    description: 'Storm surge drain backup causing rapid inundation. Water rescue zodiac deployment requested.',
    assignedResponders: ['BOAT-01'],
    radius: 500
  },
  {
    id: 'INC-8095',
    title: 'Ammonia Tanker Vapor Leak',
    type: 'hazmat',
    severity: 'warning',
    location: [37.7550, -122.3920],
    address: 'Pier 80 Industrial Terminal',
    reportedAt: '38 mins ago',
    timestamp: Date.now() - 38 * 60 * 1000,
    status: 'active',
    casualties: '0 Reported / 800m Exclusion Perimeter',
    description: 'Slow vapor plume drifting northeast toward bay waters. Hazmat perimeter established with air sampling drones.',
    assignedResponders: ['HAZMAT-7'],
    radius: 650
  },
  {
    id: 'INC-8096',
    title: 'Multi-Vehicle Pileup w/ Mass Trauma',
    type: 'medical',
    severity: 'critical',
    location: [37.7950, -122.3980],
    address: 'Embarcadero Southbound Ramp',
    reportedAt: '45 mins ago',
    timestamp: Date.now() - 45 * 60 * 1000,
    status: 'active',
    casualties: '6 Critical / Triage Tag Red: 2, Yellow: 4',
    description: 'Highway pileup involving municipal bus. Medevac LZ cleared at adjacent surface lot.',
    assignedResponders: ['MEDEVAC-2', 'AMB-10'],
    radius: 350
  }
];

export const INITIAL_RESOURCES = [
  // 1. Emergency Shelters
  {
    id: 'RES-SHL-01',
    name: 'Civic Center Emergency Shelter',
    type: 'shelter',
    location: [37.7795, -122.4178],
    address: '99 Grove St, Civic Center',
    capacityCurrent: 384,
    capacityMax: 500,
    contact: '+1 (555) 911-3001',
    services: ['Emergency Cots', 'Hot Food Service', 'Backup Generator', 'Pet Kennels'],
    status: 'OPEN'
  },
  {
    id: 'RES-SHL-02',
    name: 'Lincoln Park Fieldhouse Refuge',
    type: 'shelter',
    location: [37.7850, -122.4350],
    address: '300 34th Ave, Outer Richmond',
    capacityCurrent: 142,
    capacityMax: 350,
    contact: '+1 (555) 911-3002',
    services: ['Cots & Blankets', 'Potable Water Tank', 'Satellite Wi-Fi', 'Infant Care'],
    status: 'OPEN'
  },
  {
    id: 'RES-SHL-03',
    name: 'Mission Cultural Evac Station',
    type: 'shelter',
    location: [37.7600, -122.4190],
    address: '2868 Mission St, Mission District',
    capacityCurrent: 290,
    capacityMax: 300,
    contact: '+1 (555) 911-3003',
    services: ['Warm Clothing', 'Hygiene Kits', 'Bilingual Support'],
    status: 'NEAR_CAPACITY'
  },

  // 2. Medical Centers & Urgent Triage
  {
    id: 'RES-MED-01',
    name: 'Zuckerberg Trauma & Emergency Hospital',
    type: 'medical_center',
    location: [37.7555, -122.4055],
    address: '1001 Potrero Ave, Potrero Hill',
    capacityCurrent: 42,
    capacityMax: 60,
    contact: '+1 (555) 206-8000 (EMS Desk)',
    services: ['Level 1 Trauma Unit', 'Burn Care ICU', 'Helipad LZ', 'Blood Bank'],
    status: 'OPEN'
  },
  {
    id: 'RES-MED-02',
    name: 'UCSF Emergency Clinical Triage Hub',
    type: 'medical_center',
    location: [37.7631, -122.4580],
    address: '505 Parnassus Ave, Inner Sunset',
    capacityCurrent: 18,
    capacityMax: 35,
    contact: '+1 (555) 476-1000',
    services: ['Rapid Decontamination', 'Toxicology Screening', 'Pediatric Trauma'],
    status: 'OPEN'
  },

  // 3. Volunteer Contact & Staging Hubs
  {
    id: 'RES-VOL-01',
    name: 'SoMa Volunteer Relief & Staging Depot',
    type: 'volunteer_hub',
    location: [37.7770, -122.4040],
    address: '550 Brannan St, SoMa',
    capacityCurrent: 85,
    capacityMax: 150,
    contact: 'Volunteer Coord. Capt. Diaz: +1 (555) 839-4401 (V-NET 14)',
    services: ['Sandbag Distribution', 'First Aid Volunteers', 'Food Delivery Vans', 'HAM Radio'],
    status: 'OPEN'
  },
  {
    id: 'RES-VOL-02',
    name: 'Mission District Community Volunteer Base',
    type: 'volunteer_hub',
    location: [37.7590, -122.4180],
    address: '2868 Mission St, Mission District',
    capacityCurrent: 40,
    capacityMax: 80,
    contact: 'Coordinator Sarah Vance: +1 (555) 839-4402',
    services: ['Bilingual Translators', 'Elderly Escort Teams', 'Mobile Device Charging'],
    status: 'OPEN'
  }
];

export const INITIAL_RESPONDERS = [
  {
    id: 'ENG-14',
    name: 'Engine 14 "Centurion"',
    unitType: 'Fire & Rescue',
    status: 'ON SCENE',
    location: [37.7840, -122.4155],
    assignedIncidentId: 'INC-8092',
    radioChannel: 'TAC-FIRE 4 (154.28 MHz)',
    crewCount: 5,
    leadOfficer: 'Capt. Marcus Vance',
    fuelBattery: '88%',
    equipment: ['1500 GPM Pump', 'Thermal Camera', 'Forcible Entry Kit']
  },
  {
    id: 'MEDEVAC-2',
    name: 'Air Ambulance Sky-2',
    unitType: 'Critical Care Flight',
    status: 'EN ROUTE',
    location: [37.7980, -122.3910],
    assignedIncidentId: 'INC-8096',
    radioChannel: 'MED-AIR 1 (123.05 MHz)',
    crewCount: 3,
    leadOfficer: 'Dr. Elena Rossi, Flight Surg.',
    fuelBattery: '65%',
    equipment: ['Blood Bank Cooler', 'Dual Ventilators', 'Ultrasonic Triage']
  },
  {
    id: 'HAZMAT-7',
    name: 'HazMat Heavy 7',
    unitType: 'CBRN Containment',
    status: 'ON SCENE',
    location: [37.7540, -122.3940],
    assignedIncidentId: 'INC-8095',
    radioChannel: 'HAZ-OPS 9 (460.12 MHz)',
    crewCount: 6,
    leadOfficer: 'Chief Specialist Thorne',
    fuelBattery: '92%',
    equipment: ['Level A Encapsulated Suits', 'Gas Spectrometer', 'Decon Basin']
  },
  {
    id: 'BOAT-01',
    name: 'Swiftwater Rescue Zodiac 1',
    unitType: 'Marine & Flood Ops',
    status: 'EN ROUTE',
    location: [37.7660, -122.4250],
    assignedIncidentId: 'INC-8094',
    radioChannel: 'WATER-TAC 2 (156.80 MHz)',
    crewCount: 4,
    leadOfficer: 'Lt. Jason Chen',
    fuelBattery: '78%',
    equipment: ['Rigid Inflatable', 'Drysuits', 'High-Angle Rope System']
  },
  {
    id: 'RESCUE-9',
    name: 'Heavy Rescue Squad 9',
    unitType: 'Structural Search',
    status: 'ON SCENE',
    location: [37.7825, -122.4175],
    assignedIncidentId: 'INC-8092',
    radioChannel: 'TAC-FIRE 4 (154.28 MHz)',
    crewCount: 4,
    leadOfficer: 'Sgt. Rachel Adams',
    fuelBattery: '81%',
    equipment: ['Acoustic Search Sensors', 'Hydraulic Spreaders', 'Air Shoring']
  }
];

export const INITIAL_USER_STATUSES = [
  {
    id: 'USR-8821',
    status: 'SAFE',
    location: 'Civic Center North Plaza',
    coordinates: [37.7798, -122.4185],
    statusMessage: 'Group sheltered safely on ground floor. Have water and power.',
    headcount: 3,
    phone: '+1 (555) 302-1199',
    timestamp: Date.now() - 15 * 60 * 1000
  }
];

export const INITIAL_ALERTS = [
  {
    id: 'ALT-1001',
    severity: 'critical',
    source: 'EAS BROADCAST',
    title: 'EVACUATION ORDER: Blocks 400-500 Mission St',
    message: 'Mandatory structural evacuation due to 4-alarm fire. Avoid Financial District transit corridors.',
    timestamp: 'Just now',
    time: Date.now() - 30 * 1000,
    zone: 'Sector 4-B'
  },
  {
    id: 'ALT-1002',
    severity: 'critical',
    source: 'EMS FLIGHT DESK',
    title: 'Medevac Sky-2 En Route to Embarcadero LZ',
    message: 'Landing zone secured at lot 14. Keep emergency lanes clear for 4 incoming paramedic rigs.',
    timestamp: '4m ago',
    time: Date.now() - 4 * 60 * 1000,
    zone: 'Downtown Waterfront'
  },
  {
    id: 'ALT-1003',
    severity: 'warning',
    source: 'HAZMAT COMMAND',
    title: 'Vapor Containment Buffer: Pier 80 Terminal',
    message: 'Shelter in place for residents within 500 meters downwind of Pier 80. Close all HVAC intakes.',
    timestamp: '14m ago',
    time: Date.now() - 14 * 60 * 1000,
    zone: 'Industrial Bay'
  },
  {
    id: 'ALT-1004',
    severity: 'warning',
    source: 'HYDROLOGY SENSOR',
    title: 'Rapid Water Rise: Mission & 16th St Incline',
    message: 'Flash flooding has reached 4.2 feet. Swiftwater boat unit 01 deployed for vehicle rescues.',
    timestamp: '22m ago',
    time: Date.now() - 22 * 60 * 1000,
    zone: 'Mission Corridor'
  }
];

export const BROADCAST_TICKERS = [
  '🚨 CRITICAL: 4-Alarm Fire at 450 Mission St - Avoid Sector 4-B',
  '🌊 FLASH FLOOD WARNING: Mission & 16th St underpass impassable',
  '⚠️ HAZMAT ADVISORY: Pier 80 Vapor Perimeter in effect - Close windows',
  '🚁 MEDEVAC ACTIVE: Embarcadero Highway corridor reserved for air triage',
  '🛡️ SHELTER UPDATE: Civic Center & Lincoln Park open with medical staff'
];
