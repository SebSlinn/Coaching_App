// App.jsx — Refactored: Modularized with screens and state hooks

import { useState } from "react";
import { ClassifierScreen } from "./screens/ClassifierScreen";
import { AthleteSetupScreen } from "./screens/AthleteSetupScreen";
import { SetBuilderScreen } from "./screens/SetBuilderScreen";
import { colors, styles } from "./styles/theme";

export default function App() {
  const [tab, setTab] = useState("classifier");
  
  // App-level state needed by multiple screens
  const [poolDisplay, setPoolDisplay] = useState("25SC"); // 50LC | 25SC | 25Y
  const [activeAthlete, setActiveAthlete] = useState(null);
  const [editingBlock, setEditingBlock] = useState(null);
  
  // Session builder state
  const [session, setSession] = useState({
    title: "",
    groups: [
      { id: "g1", label: "Warm Up",  blocks: [] },
      { id: "g2", label: "Main Set", blocks: [] },
    ]
  });
  const [activeGroup, setActiveGroup] = useState("g1");

  // Session builder helpers
  function sbId() { return "x" + Date.now() + Math.random().toString(36).slice(2,6); }
  function sbNewLine(defaults) {
    return { id: sbId(), qty: "1", dist: "", stroke: "FS", modifier: "Full",
             intensity: "A2", target: "", turnaround: "", note: "", type: "swim",
             poolType: poolDisplay, ...defaults };
  }
  function sbNewBlock(defaults) {
    return { id: sbId(), repeats: "1", label: "", children: [], ...defaults };
  }
  function sbCommitBlock(block) {
    setSession(s => {
      const updatedGroups = s.groups.map(g => 
        g.id === activeGroup 
          ? { ...g, blocks: [...g.blocks, block] }
          : g
      );
      return { ...s, groups: updatedGroups };
    });
  }

  function coachNote(result) {
    // TODO: implement coaching note generation
    return null;
  }

  const tabs = [
    { v: "classifier", l: "Classifier" },
    { v: "setup", l: "Athlete Setup" },
    { v: "builder", l: "Set Builder" },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: colors.dark,
        color: colors.text,
        fontFamily: "monospace",
        padding: "16px 12px",
      }}
    >
      {/* Header */}
      <div style={{ maxWidth: 620, margin: "0 auto 0 auto", marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: colors.textMuted, letterSpacing: "0.15em", marginBottom: 2 }}>
          ELLESMERE PORT ASC
        </div>
        <div style={{ fontSize: 18, fontWeight: 900, letterSpacing: "0.04em" }}>
          SWIM ZONE CLASSIFIER
        </div>
        <div
          style={{
            fontSize: 9,
            color: colors.textMuted,
            marginTop: 2,
            letterSpacing: "0.08em",
          }}
        >
          SWEETENHAM ENERGY ZONE MODEL · v5
        </div>
      </div>

      <div style={{ maxWidth: 620, margin: "0 auto" }}>
        {/* Tab Bar */}
        <div
          style={{
            display: "flex",
            gap: 0,
            marginBottom: 16,
            border: `1px solid ${colors.border}`,
            borderRadius: 8,
            overflow: "hidden",
          }}
        >
          {tabs.map((t) => (
            <button
              key={t.v}
              onClick={() => setTab(t.v)}
              style={{
                flex: 1,
                padding: "9px 0",
                cursor: "pointer",
                border: "none",
                background:
                  tab === t.v ? "rgba(255,255,255,0.10)" : "transparent",
                color: tab === t.v ? colors.text : colors.textMuted,
                fontFamily: "monospace",
                fontSize: 11,
                fontWeight: tab === t.v ? 700 : 400,
                letterSpacing: "0.06em",
              }}
            >
              {t.l}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {tab === "classifier" && <ClassifierScreen />}
        {tab === "setup" && <AthleteSetupScreen />}
        {tab === "builder" && <SetBuilderScreen />}
      </div>

      {/* Global Styles */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
        input:focus,
        select:focus {
          border-color: rgba(255, 255, 255, 0.3) !important;
        }
        option {
          background: #1a1a28;
        }
        @media print {
          body {
            background: #fff !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
