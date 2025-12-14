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
  related_topic_id?: string; // Links to a TieredTopic
  next_depth?: "DEEP" | "DARK" | "VAULT"; // Suggests there is more to dig
}

export interface TieredTopic {
  id: string;
  topic: string;
  layers: {
    SURFACE: TerminalResponse;
    DEEP: TerminalResponse;
    DARK: TerminalResponse;
    VAULT: TerminalResponse;
  };
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

export const tieredTopics: Record<string, TieredTopic> = {
  mkultra: {
    id: "mkultra",
    topic: "Project MKUltra",
    layers: {
      SURFACE: {
        text: "Project MKUltra was a CIA mind control program initiated in 1953. It used substances like LSD to interrogate subjects and modify behavior. Officially halted in 1973.",
        depth_level: "SURFACE",
        next_depth: "DEEP",
        sources: [{ type: "document", title: "Senate Church Committee Report", date: "1975", confidence: 100, snippet: "CIA engaged in extensive testing... on unwitting human subjects." }]
      },
      DEEP: {
        text: "Digging deeper... Subproject 68 was funded via a front organization, the 'Society for the Investigation of Human Ecology'. Dr. Ewen Cameron at McGill University used 'psychic driving'—playing looped tape messages to patients in drug-induced comas for weeks.",
        depth_level: "DEEP",
        next_depth: "DARK",
        sources: [{ type: "document", title: "CIA Financial Records: Subproject 68", date: "1957", confidence: 100, snippet: "Funding approved for Dr. Cameron's depatterning research." }]
      },
      DARK: {
        text: "Tracing the cover-up. In 1973, CIA Director Richard Helms ordered the destruction of all MKUltra files. What we know comes from a single cache of 20,000 documents misfiled in a financial records center. The true scope of the 'terminal' experiments remains unknown.",
        depth_level: "DARK",
        next_depth: "VAULT",
        sources: [{ type: "leak", title: "Helms Destruction Order", date: "1973", confidence: 95, snippet: "Destroy all biological and chemical control records." }]
      },
      VAULT: {
        text: "ACCESSING VAULT... Connection to Operation PAPERCLIP. Nazi doctors recruited by the US advised on interrogation techniques. Evidence suggests continuation of research under different code names (MONARCH, ARTICHOKE) well into the 1980s using non-chemical means (frequency, trauma).",
        depth_level: "VAULT",
        sources: [{ type: "intercept", title: "Project ARTICHOKE Memo", date: "1951", confidence: 85, snippet: "Can we get control of an individual to the point where he will do our bidding against his will?" }]
      }
    }
  },
  uap: {
    id: "uap",
    topic: "Unidentified Aerial Phenomena",
    layers: {
      SURFACE: {
        text: "The US Government investigated UFOs under Project Blue Book (1952-1969). They concluded most were natural phenomena, but 701 cases remained 'Unidentified'. In 2017, the NYT revealed the existence of AATIP.",
        depth_level: "SURFACE",
        next_depth: "DEEP",
        sources: [{ type: "link", title: "NYT: Glowing Auras and Black Money", date: "2017", confidence: 100 }]
      },
      DEEP: {
        text: "Decrypting AATIP files... The 'Advanced Aerospace Threat Identification Program' wasn't just looking at lights. They commissioned 38 technical papers (DIRDs) on 'warp drives', 'invisibility cloaking', and 'traversable wormholes' authored by defense contractors.",
        depth_level: "DEEP",
        next_depth: "DARK",
        sources: [{ type: "document", title: "DIRD: Warp Drive, Dark Energy", date: "2010", confidence: 100 }]
      },
      DARK: {
        text: "Analyzing the 'Wilson-Davis Memo'. 2002. Admiral Thomas Wilson (J-2) was allegedly denied access to a buried Special Access Program (SAP) holding 'off-world vehicles not made by human hands'. The corporate contractor running it has no oversight.",
        depth_level: "DARK",
        next_depth: "VAULT",
        sources: [{ type: "leak", title: "Wilson-Davis Transcript", date: "2002", confidence: 80, snippet: "They said they were the gatekeepers... I was angry." }]
      },
      VAULT: {
        text: "VAULT UNLOCKED. The 'Program' exists outside standard executive branch control. Retrievals of non-human biologics and craft have occurred since Magenta, Italy (1933). The technology is sequestered to maintain energy dominance.",
        depth_level: "VAULT",
        sources: [{ type: "intercept", title: "Grusch Testimony / ICIG Complaint", date: "2023", confidence: 90 }]
      }
    }
  },
  surveillance: {
    id: "surveillance",
    topic: "Global Surveillance",
    layers: {
      SURFACE: {
        text: "Edward Snowden revealed in 2013 that the NSA collects metadata on millions of Americans via the PRISM program, partnering with major tech companies.",
        depth_level: "SURFACE",
        next_depth: "DEEP",
        sources: [{ type: "document", title: "Guardian: NSA Files", date: "2013", confidence: 100 }]
      },
      DEEP: {
        text: "Digging into infrastructure. Room 641A. In 2006, technician Mark Klein revealed AT&T had installed a splitter at its San Francisco hub, copying ALL internet traffic directly to the NSA. This hardware backdoor exists at major internet exchanges.",
        depth_level: "DEEP",
        next_depth: "DARK",
        sources: [{ type: "leak", title: "Klein Declaration", date: "2006", confidence: 100, snippet: "Beam splitter installed in secure room." }]
      },
      DARK: {
        text: "Project ECHELON / Five Eyes. It's not just terror. The network has been used for industrial espionage (e.g., spying on Airbus for Boeing, Japanese trade talks). They can remotely activate microphones on mobile devices even when 'off'.",
        depth_level: "DARK",
        next_depth: "VAULT",
        sources: [{ type: "document", title: "European Parliament Report on ECHELON", date: "2001", confidence: 95 }]
      },
      VAULT: {
        text: "VAULT ACCESS: 'Sentient' Program. The NRO/NSA move beyond passive collection to active 'behavioral prediction' and 'synthetic environment' creation. Systems designed to shape perception of reality through algorithmic manipulation of information flow at the packet level.",
        depth_level: "VAULT",
        sources: [{ type: "leak", title: "NRO 'Sentient' Briefing", date: "2019", confidence: 75 }]
      }
    }
  }
};

export const complexResponses: TerminalResponse[] = [
  // Fallback responses if no topic matches
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
