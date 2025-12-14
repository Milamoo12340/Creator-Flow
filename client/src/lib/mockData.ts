import { EvidenceSource } from "@/components/EvidenceCard";

export interface Document {
  id: string;
  title: string;
  date: string;
  clearance: "TOP SECRET" | "RESTRICTED" | "DECLASSIFIED";
  summary: string;
  tags: string[];
}

export interface TerminalResponse {
  text: string;
  sources?: EvidenceSource[];
  depth_level: "SURFACE" | "DEEP" | "DARK" | "VAULT";
}

// REAL DATA SOURCES - VERIFIED ARCHIVES

export const mockDocuments: Document[] = [
  {
    id: "CIA-MKULTRA-190",
    title: "Project MKUltra: Subproject 68",
    date: "1957-06-01",
    clearance: "DECLASSIFIED",
    summary: "Dr. Ewen Cameron's experiments at the Allan Memorial Institute in Montreal. Subjects underwent 'depatterning' via drug-induced comas and electroconvulsive therapy to wipe memories and reprogram behavior.",
    tags: ["MKULTRA", "CIA", "MIND CONTROL"],
  },
  {
    id: "DOD-NORTHWOODS-62",
    title: "Operation Northwoods Memorandum",
    date: "1962-03-13",
    clearance: "DECLASSIFIED",
    summary: "Proposal by the Joint Chiefs of Staff to stage false flag terrorist attacks on US soil—including hijacking planes and bombing Miami—to justify military intervention in Cuba. Rejected by JFK.",
    tags: ["FALSE FLAG", "JCS", "CUBA"],
  },
  {
    id: "NSA-ECHELON-88",
    title: "Project ECHELON / Five Eyes",
    date: "1988-08-12",
    clearance: "RESTRICTED",
    summary: "Global signals intelligence network operated by the US, UK, Canada, Australia, and NZ. Capable of intercepting satellite, radio, and internet communications worldwide for industrial and political espionage.",
    tags: ["SURVEILLANCE", "NSA", "SIGINT"],
  },
  {
    id: "USAF-BLUEBOOK-14",
    title: "Project Blue Book: Special Report 14",
    date: "1955-05-05",
    clearance: "DECLASSIFIED",
    summary: "Statistical analysis of 3,200 UFO reports. While 69% were identified, 22% remained 'Unknown' even after rigorous analysis. The 'Unknowns' consistently showed higher maneuvers and speeds than known aircraft.",
    tags: ["UAP", "USAF", "AERIAL"],
  },
  {
    id: "CIA-STARGATE-95",
    title: "Project Stargate: Grill Flame",
    date: "1984-01-01",
    clearance: "DECLASSIFIED",
    summary: "Defense Intelligence Agency program investigating 'remote viewing' for espionage. Psychics like Ingo Swann were tasked with visualizing Soviet submarine bases and Martian coordinates. Program ran for 20+ years.",
    tags: ["PSI", "REMOTE VIEWING", "DIA"],
  },
  {
    id: "FBI-COINTELPRO-71",
    title: "COINTELPRO: Black Nationalist Hate Groups",
    date: "1967-08-25",
    clearance: "DECLASSIFIED",
    summary: "FBI directive to 'expose, disrupt, misdirect, discredit, or otherwise neutralize' domestic political organizations. Tactics included psychological warfare, harassment, and framing leaders like MLK Jr.",
    tags: ["FBI", "SURVEILLANCE", "DOMESTIC"],
  },
];

export const complexResponses: TerminalResponse[] = [
  {
    text: "Accessing The Black Vault archives... Retrieving file: CICADA 3301. Status: UNSOLVED. A cryptographic recruitment tool emerging in 2012. Techniques involved steganography, PGP encryption, and physical QR codes in 14 global cities. The 'winners' were inducted into a private darknet cell.",
    depth_level: "DEEP",
    sources: [
      {
        type: "link",
        title: "4chan Archive /x/ 2012",
        date: "2012-01-04",
        confidence: 100,
        snippet: "Message: 'We are looking for highly intelligent individuals. To find them, we have devised a test.'"
      },
      {
        type: "leak",
        title: "Leaked Winner's Email",
        date: "2013-02-15",
        confidence: 85,
        snippet: "We want the best, not the followers. You have done well."
      }
    ]
  },
  {
    text: "Querying Archaeological Anomaly Database... Subject: ANTIKYTHERA MECHANISM. Dated 150-100 BCE. X-ray tomography reveals 30+ bronze gears capable of predicting eclipses and tracking the Olympiad cycle. This level of miniaturization and complexity disappears from the historical record for over 1,000 years.",
    depth_level: "DEEP",
    sources: [
      {
        type: "document",
        title: "Nature Journal Vol. 444",
        date: "2006-11-30",
        confidence: 99,
        snippet: "The mechanism computed the position of the moon, its phases, and variable velocity using an epicyclic gear train."
      }
    ]
  },
  {
    text: "Scanning for 'The Havana Syndrome'. 2016-Present. US diplomats in Cuba and China reported acute auditory symptoms and brain injury. Initial denial. Later studies by National Academies suggest 'directed, pulsed radio frequency energy' as the most plausible cause.",
    depth_level: "DARK",
    sources: [
      {
        type: "document",
        title: "National Academies Report",
        date: "2020-12-05",
        confidence: 92,
        snippet: "Directed pulsed RF energy appears to be the most plausible mechanism in explaining these cases."
      },
      {
        type: "intercept",
        title: "Moscow Signal History",
        date: "1953-1976",
        confidence: 88,
        snippet: "Precedent: US Embassy in Moscow was bombarded with low-level microwaves for decades."
      }
    ]
  },
  {
    text: "Accessing Operation PAPERCLIP personnel files. 1945-1959. 1,600+ German scientists recruited by JIOA to work in the US. Wernher von Braun (SS-Sturmbannführer) became the architect of the Saturn V rocket. Past war crimes were expunged from the record to bypass Truman's anti-Nazi order.",
    depth_level: "VAULT",
    sources: [
      {
        type: "document",
        title: "JIOA Dossier: Von Braun",
        date: "1947-09-12",
        confidence: 100,
        snippet: "Subject is essential to guided missile program. Recommendation: Security clearance granted despite affiliation."
      },
      {
        type: "document",
        title: "V2 Rocket Production Reports",
        date: "1944-01-01",
        confidence: 100,
        snippet: "Utilized slave labor from Dora-Mittelbau concentration camp."
      }
    ]
  },
  {
    text: "Retrieving 'The Bloop' spectrograph. 1997. NOAA hydrophones detected an ultra-low frequency sound in the South Pacific. The profile matched that of a living creature but was several times louder than the loudest known animal, the blue whale. Source triangulation: 50° S 100° W.",
    depth_level: "SURFACE",
    sources: [
      {
        type: "document",
        title: "NOAA Vents Program",
        date: "1997-06-15",
        confidence: 95,
        snippet: "Sound profile resembles 'biological' origin but scale is unprecedented. Officially classified as 'icequake' years later, but debate remains."
      }
    ]
  }
];

export const terminalResponses = [
  "Accessing secure node...",
  "Decryption in progress...",
  "Bypassing firewall...",
  "Truth found.",
  "Warning: Clearance level insufficient for full download.",
  "Retrieving fragmented data...",
];
