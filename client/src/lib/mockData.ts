export interface Document {
  id: string;
  title: string;
  date: string;
  clearance: "TOP SECRET" | "RESTRICTED" | "DECLASSIFIED";
  summary: string;
  tags: string[];
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

export const terminalResponses = [
  "Accessing secure node...",
  "Decryption in progress...",
  "Bypassing firewall...",
  "Truth found.",
  "Warning: Clearance level insufficient for full download.",
  "Retrieving fragmented data...",
];
