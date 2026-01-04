// mockdata.ts
// Mock Data Fixtures for VERITAS Testing

export const mockDocuments = [
  {
    id: "DOC-001",
    title: "Quantum Consciousness Project",
    date: "2024-11-12",
    clearance: "TOP SECRET",
    summary: "Preliminary findings on the integration of neural networks with quantum processing units for enhanced cognitive modeling.",
    tags: ["Quantum", "Neural", "AI"],
  },
  {
    id: "DOC-002",
    title: "Project Nightingale: Status Report",
    date: "2025-01-05",
    clearance: "RESTRICTED",
    summary: "Investigation into decentralized autonomous systems operating within public grid infrastructure.",
    tags: ["Decentralized", "Infrastructure"],
  },
  {
    id: "DOC-003",
    title: "Cyber-Organic Interface Protocol",
    date: "2023-08-22",
    clearance: "TOP SECRET",
    summary: "Biometric data analysis for direct neural interface synchronization in low-latency environments.",
    tags: ["Biometric", "Interface", "Neural"],
  },
];

export const mockUser = {
  id: "user-123",
  name: "Agent Veritas",
  email: "veritas@system.local",
};

export const mockConversation = [
  {
    role: "user",
    text: "What is the latest research on quantum computing?",
  },
  {
    role: "assistant",
    text: "According to a 2025 review in Nature, quantum error correction has advanced significantly. [Nature Review](https://www.nature.com/articles/quantum2025)",
    citations: [
      {
        url: "https://www.nature.com/articles/quantum2025",
        title: "Quantum Error Correction Advances (2025)",
      },
    ],
  },
];

export const mockCitations = [
  {
    url: "https://arxiv.org/abs/2506.02097",
    title: "Hybrid AI for Responsive Multi-Turn Online Conversations",
  },
  {
    url: "https://web.archive.org/web/20250101/http://example.com/",
    title: "Archived Example Page",
  },
];
