-- ==============================================================================
-- ResQBharat EMERGENCY RESPONSE SYSTEM - SUPABASE DATABASE SCHEMA
-- ==============================================================================

-- 1. Enable UUID extension if not already present
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- Table 1: INCIDENTS
-- Tracks active emergency situations (fires, floods, hazmat, medical, etc.)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.incidents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    type TEXT NOT NULL,                  -- 'fire', 'flood', 'hazmat', 'medical', 'power', etc.
    severity TEXT NOT NULL DEFAULT 'critical', -- 'critical', 'warning', 'advisory'
    lat DOUBLE PRECISION NOT NULL,
    long DOUBLE PRECISION NOT NULL,
    address TEXT,
    description TEXT,
    casualties TEXT,
    status TEXT NOT NULL DEFAULT 'active', -- 'active', 'contained', 'resolved'
    radius_meters INTEGER DEFAULT 350,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for geographical lookups and status filtering
CREATE INDEX IF NOT EXISTS idx_incidents_coords ON public.incidents (lat, long);
CREATE INDEX IF NOT EXISTS idx_incidents_status ON public.incidents (status);

-- ------------------------------------------------------------------------------
-- Table 2: USER_STATUS
-- Tracks citizen safety check-ins, triage requests, and emergency beacons
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_status (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,               -- Auth UUID or anonymous client identifier
    status_type TEXT NOT NULL,           -- 'SAFE', 'NEED_AID', 'CRITICAL'
    location TEXT NOT NULL,              -- Textual address / landmark description
    lat DOUBLE PRECISION,                -- GPS latitude
    long DOUBLE PRECISION,               -- GPS longitude
    status_message TEXT,                 -- Notes, medical urgency, or supply needs
    headcount INTEGER DEFAULT 1,         -- Number of people with the user
    contact_phone TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_status_type ON public.user_status (status_type);
CREATE INDEX IF NOT EXISTS idx_user_status_coords ON public.user_status (lat, long);

-- ------------------------------------------------------------------------------
-- Table 3: RESOURCES
-- Tracks emergency shelters, medical trauma centers, and volunteer coordination hubs
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type TEXT NOT NULL,                  -- 'shelter', 'medical_center', 'volunteer_hub'
    lat DOUBLE PRECISION NOT NULL,
    long DOUBLE PRECISION NOT NULL,
    address TEXT NOT NULL,
    capacity_current INTEGER DEFAULT 0,
    capacity_max INTEGER DEFAULT 100,
    contact_info TEXT NOT NULL,          -- Emergency phone number, radio channel, or coordinator
    services JSONB DEFAULT '[]'::jsonb,  -- e.g. ["Hot Meals", "Cots", "Trauma ICU", "Clean Water"]
    status TEXT NOT NULL DEFAULT 'OPEN', -- 'OPEN', 'NEAR_CAPACITY', 'FULL', 'STANDBY'
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_resources_type ON public.resources (type);
CREATE INDEX IF NOT EXISTS idx_resources_coords ON public.resources (lat, long);

-- ------------------------------------------------------------------------------
-- Row Level Security (RLS) Configuration
-- For emergency response applications, read access is public for situational awareness,
-- and write access is enabled for incident logging and citizen check-ins.
-- ------------------------------------------------------------------------------
ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

-- Allow public read access to all three tables
CREATE POLICY "Public can view incidents" ON public.incidents FOR SELECT USING (true);
CREATE POLICY "Public can insert incidents" ON public.incidents FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can update incidents" ON public.incidents FOR UPDATE USING (true);

CREATE POLICY "Public can view user_status" ON public.user_status FOR SELECT USING (true);
CREATE POLICY "Public can insert user_status" ON public.user_status FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can view resources" ON public.resources FOR SELECT USING (true);
CREATE POLICY "Public can insert/update resources" ON public.resources FOR ALL USING (true);

-- Enable Supabase Realtime for incidents and user_status
ALTER PUBLICATION supabase_realtime ADD TABLE public.incidents;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_status;
ALTER PUBLICATION supabase_realtime ADD TABLE public.resources;

-- ------------------------------------------------------------------------------
-- Seed Realistic Data for Testing & Demonstration (San Francisco Metro Area)
-- ------------------------------------------------------------------------------

-- Seed Incidents
INSERT INTO public.incidents (title, type, severity, lat, long, address, description, casualties, status, radius_meters)
VALUES
    (
        '4-Alarm Commercial Structure Fire',
        'fire',
        'critical',
        37.7833,
        -122.4167,
        '450 Mission St, Financial District',
        'Heavy black smoke billowing from upper floors. Fire crews conducting interior suppression and roof ventilation.',
        '3 Injured / Evacuating Floors 4-7',
        'active',
        400
    ),
    (
        'Flash Flood & Submerged Vehicles',
        'flood',
        'critical',
        37.7680,
        -122.4280,
        'Mission St & 16th St Incline Underpass',
        'Storm surge drain backup causing rapid inundation. Water rescue zodiac deployment requested.',
        '2 Trapped in SUV / Water Rising 4ft',
        'active',
        500
    ),
    (
        'Ammonia Tanker Vapor Leak',
        'hazmat',
        'warning',
        37.7550,
        -122.3920,
        'Pier 80 Industrial Terminal',
        'Slow vapor plume drifting northeast toward bay waters. Hazmat perimeter established with air sampling drones.',
        '0 Reported / 800m Exclusion Perimeter',
        'active',
        650
    ),
    (
        'Multi-Vehicle Pileup w/ Mass Trauma',
        'medical',
        'critical',
        37.7950,
        -122.3980,
        'Embarcadero Southbound Ramp',
        'Highway pileup involving municipal bus. Medevac LZ cleared at adjacent surface lot.',
        '6 Critical / Triage Tag Red: 2, Yellow: 4',
        'active',
        350
    )
ON CONFLICT DO NOTHING;

-- Seed Resources (Shelters, Medical Centers, Volunteer Hubs)
INSERT INTO public.resources (name, type, lat, long, address, capacity_current, capacity_max, contact_info, services, status)
VALUES
    -- Shelters
    (
        'Civic Center Emergency Shelter',
        'shelter',
        37.7795,
        -122.4178,
        '99 Grove St, Civic Center',
        384,
        500,
        '+1 (555) 911-3001 (Radio TAC-8)',
        '["Cots & Blankets", "Hot Meals", "Emergency Generators", "Pet Area"]'::jsonb,
        'OPEN'
    ),
    (
        'Lincoln Park Fieldhouse Refuge',
        'shelter',
        37.7850,
        -122.4350,
        '300 34th Ave, Outer Richmond',
        142,
        350,
        '+1 (555) 911-3002',
        '["Dry Cots", "Potable Water Station", "Satellite Wi-Fi", "Baby Supplies"]'::jsonb,
        'OPEN'
    ),

    -- Medical Centers
    (
        'Zuckerberg Trauma & Emergency Hospital',
        'medical_center',
        37.7555,
        -122.4055,
        '1001 Potrero Ave, Potrero Hill',
        42,
        60,
        '+1 (555) 206-8000 (EMS Hotline)',
        '["Level 1 Trauma Center", "Burn ICU", "Helipad LZ", "Blood Bank"]'::jsonb,
        'OPEN'
    ),
    (
        'UCSF Emergency Clinical Triage Hub',
        'medical_center',
        37.7631,
        -122.4580,
        '505 Parnassus Ave, Inner Sunset',
        18,
        35,
        '+1 (555) 476-1000',
        '["Decontamination Ward", "Rapid Toxicology", "Pediatric Triage"]'::jsonb,
        'OPEN'
    ),

    -- Volunteer Contact & Supply Points
    (
        'SoMa Volunteer Relief & Staging Depot',
        'volunteer_hub',
        37.7770,
        -122.4040,
        '550 Brannan St, SoMa',
        85,
        150,
        'Volunteer Coord. Capt. Diaz: +1 (555) 839-4401 (V-NET 14)',
        '["Sandbag Distribution", "First Aid Volunteers", "Food Delivery Vans", "HAM Radio Base"]'::jsonb,
        'OPEN'
    ),
    (
        'Mission District Community Volunteer Base',
        'volunteer_hub',
        37.7590,
        -122.4180,
        '2868 Mission St, Mission District',
        40,
        80,
        'Coordinator Sarah Vance: +1 (555) 839-4402',
        '["Bilingual Translators", "Elderly Escort Teams", "Mobile Charging"]'::jsonb,
        'OPEN'
    )
ON CONFLICT DO NOTHING;

-- Seed User Status Sample Check-ins
INSERT INTO public.user_status (user_id, status_type, location, lat, long, status_message, headcount, contact_phone)
VALUES
    (
        'USR-8821',
        'SAFE',
        'Civic Center North Plaza',
        37.7798,
        -122.4185,
        'Group sheltered safely on ground floor. Have water and power.',
        3,
        '+1 (555) 302-1199'
    ),
    (
        'USR-8822',
        'NEED_AID',
        '16th & Valencia 2nd Floor',
        37.7645,
        -122.4215,
        'Power is out. Need drinking water and diabetic insulin storage.',
        2,
        '+1 (555) 491-8833'
    )
ON CONFLICT DO NOTHING;
