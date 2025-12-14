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

export const mockDocuments: Document[] = [
  {
    id: "DOC-001",
    title: "Project Blue Book - Appendix B",
    date: "1952-11-04",
    clearance: "TOP SECRET",
    summary: "Unexplained aerial phenomena observed over Washington D.C. restricted airspace. Radar confirmation correlates with visual sightings.",
    tags: ["UAP", "MILITARY", "RADAR"],
  },
  {
    id: "DOC-002",
    title: "Operation Midnight Climax",
    date: "1963-04-12",
    clearance: "DECLASSIFIED",
    summary: "Subproject 68 experiments involving the administration of psychoactive substances to unwitting subjects in safehouses.",
    tags: ["MKULTRA", "CIA", "EXPERIMENT"],
  },
  {
    id: "DOC-003",
    title: "The Antikythera Transmission",
    date: "1901-05-17",
    clearance: "RESTRICTED",
    summary: "Wait, the mechanism wasn't just a calculator. New analysis suggests it was a receiver for a signal originating from [REDACTED].",
    tags: ["ARCHAEOLOGY", "SIGNAL", "ANOMALY"],
  },
  {
    id: "DOC-004",
    title: "Vatican Archives: Shelf 11B",
    date: "1452-08-22",
    clearance: "TOP SECRET",
    summary: "Correspondence regarding the 'visitors' who gifted the maps used by Piri Reis. The source of the cartography remains unknown to modern science.",
    tags: ["HISTORY", "VATICAN", "CARTOGRAPHY"],
  },
  {
    id: "DOC-005",
    title: "Signal 6WOW-B",
    date: "1977-08-15",
    clearance: "RESTRICTED",
    summary: "The full 72-second signal contained a modulated data stream. Decryption attempts have yielded a star map pointing to Proxima Centauri.",
    tags: ["SETI", "SPACE", "SIGNAL"],
  },
  {
    id: "DOC-006",
    title: "Deep Sea Anomaly 88",
    date: "2011-06-19",
    clearance: "TOP SECRET",
    summary: "Sonar readings from the Baltic Sea anomaly indicate a hollow metallic structure with active electromagnetic output.",
    tags: ["OCEAN", "ANOMALY", "STRUCTURE"],
  },
];

export const complexResponses: TerminalResponse[] = [
  {
    text: "Scanning Sector 7G... Pattern match found in deep archival storage. The narrative you know is incomplete. Records indicate a parallel technological development track suppressed in 1954.",
    depth_level: "DEEP",
    sources: [
      {
        type: "document",
        title: "The Greada Treaty",
        date: "1954-02-20",
        confidence: 85,
        snippet: "Agreement terms regarding technology transfer in exchange for biological sampling rights..."
      },
      {
        type: "leak",
        title: "Majestic-12 Briefing",
        confidence: 92,
        snippet: "Top Secret Eyes Only. The recovery of the craft at Aztec, NM confirmed extraterrestrial origin."
      }
    ]
  },
  {
    text: "Accessing the Vault. Warning: Cognitive hazard detected. The data suggests human civilization is cyclical, not linear. We are currently in the 6th iteration.",
    depth_level: "VAULT",
    sources: [
      {
        type: "document",
        title: "Göbekli Tepe Geoscans",
        date: "2019-09-12",
        confidence: 98,
        snippet: "Ground penetrating radar reveals structures dating back 12,000+ years, showing advanced masonry unknown to hunter-gatherers."
      },
      {
        type: "intercept",
        title: "Sumerian Tablet Translation #442",
        confidence: 76,
        snippet: "Those who came from heaven to earth... they engineered the workers for the gold mines."
      }
    ]
  },
  {
    text: "Tracing financial flows through shell companies in the Caymans. Connection established between [REDACTED] Corporation and global weather modification patents.",
    depth_level: "DARK",
    sources: [
      {
        type: "link",
        title: "Patent US-20250044A",
        date: "2023-11-01",
        confidence: 100,
        snippet: "Method for atmospheric ionization and storm steering using orbital arrays."
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
