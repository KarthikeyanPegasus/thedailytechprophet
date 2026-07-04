"use client";

import { motion } from "framer-motion";

type DiagramType =
  | "gpu-architecture"
  | "neural-network"
  | "database-schema"
  | "cloud-infrastructure"
  | "rocket-engine"
  | "programming-flowchart";

interface BlueprintDiagramProps {
  type: DiagramType;
  title?: string;
  className?: string;
}

export function BlueprintDiagram({ type, title, className = "" }: BlueprintDiagramProps) {
  return (
    <div className={`blueprint-diagram ${className}`} data-title={title ?? type.replace(/-/g, " ")}>
      <svg viewBox="0 0 300 200" preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "100%", display: "block" }}>
        {type === "gpu-architecture" && <GPUArchitecture />}
        {type === "neural-network" && <NeuralNetworkDiagram />}
        {type === "database-schema" && <DatabaseSchema />}
        {type === "cloud-infrastructure" && <CloudInfrastructure />}
        {type === "rocket-engine" && <RocketEngine />}
        {type === "programming-flowchart" && <ProgrammingFlowchart />}
      </svg>
    </div>
  );
}

/* === GPU Architecture — die layout with SM clusters === */
function GPUArchitecture() {
  const smClusters = Array.from({ length: 12 }, (_, i) => ({
    x: 20 + (i % 6) * 44,
    y: 50 + Math.floor(i / 6) * 55,
  }));

  return (
    <>
      {/* Die outline */}
      <rect x="10" y="30" width="280" height="150" className="blueprint-line" strokeWidth="1.5" />
      {/* Memory controller */}
      <rect x="10" y="170" width="280" height="14" className="blueprint-line" fill="none" strokeWidth="0.5" />
      <text x="150" y="180" textAnchor="middle" className="blueprint-label">MEMORY CONTROLLER</text>
      {/* SM clusters */}
      {smClusters.map((sm, i) => (
        <g key={i}>
          <rect x={sm.x} y={sm.y} width="38" height="45" className="blueprint-line" fill="none" strokeWidth="0.4" />
          <line x1={sm.x + 19} y1={sm.y} x2={sm.x + 19} y2={sm.y + 45} className="blueprint-line" strokeWidth="0.2" />
          <line x1={sm.x} y1={sm.y + 22} x2={sm.x + 38} y2={sm.y + 22} className="blueprint-line" strokeWidth="0.2" />
          <motion.rect
            x={sm.x + 2} y={sm.y + 2} width="34" height="6"
            fill="var(--color-gold)" opacity="0.08"
            animate={{ opacity: [0.05, 0.15, 0.05] }}
            transition={{ duration: 6, repeat: Infinity, delay: i * 0.3 }}
          />
        </g>
      ))}
      {/* Labels */}
      <text x="150" y="24" textAnchor="middle" className="blueprint-label">GPU DIE — 12 SM CLUSTERS</text>
      <text x="35" y="44" className="blueprint-label" fontSize="3">SM0</text>
      <text x="79" y="44" className="blueprint-label" fontSize="3">SM1</text>
      <text x="123" y="44" className="blueprint-label" fontSize="3">SM2</text>
      {/* Interconnect */}
      <line x1="10" y1="100" x2="290" y2="100" className="blueprint-line" strokeDasharray="2 2" strokeWidth="0.3" opacity="0.3" />
      <text x="150" y="98" textAnchor="middle" className="blueprint-label" fontSize="3">↔ NVLINK ↔</text>
    </>
  );
}

/* === Neural Network — layered perceptron with cross-hatching === */
function NeuralNetworkDiagram() {
  const layers = [
    { x: 40, count: 4, label: "INPUT" },
    { x: 120, count: 6, label: "HIDDEN L1" },
    { x: 200, count: 6, label: "HIDDEN L2" },
    { x: 270, count: 3, label: "OUTPUT" },
  ];

  const nodes = layers.map((layer) =>
    Array.from({ length: layer.count }, (_, i) => ({
      x: layer.x,
      y: 50 + (i / (layer.count - 1)) * 100,
    }))
  );

  return (
    <>
      {/* Layer labels */}
      {layers.map((layer, i) => (
        <text key={i} x={layer.x} y="40" textAnchor="middle" className="blueprint-label" fontSize="3.5">{layer.label}</text>
      ))}
      {/* Connections */}
      {nodes.slice(0, -1).map((layer, li) =>
        layer.map((node, ni) =>
          nodes[li + 1].map((nextNode, nni) => (
            <motion.line
              key={`${li}-${ni}-${nni}`}
              x1={node.x} y1={node.y}
              x2={nextNode.x} y2={nextNode.y}
              stroke="var(--color-gold)" strokeWidth="0.3"
              opacity="0.1"
              animate={{ opacity: [0.05, 0.2, 0.05] }}
              transition={{ duration: 6, repeat: Infinity, delay: (li + ni + nni) * 0.2 }}
            />
          ))
        )
      )}
      {/* Nodes */}
      {nodes.map((layer, li) =>
        layer.map((node, ni) => (
          <motion.circle
            key={`${li}-${ni}`}
            cx={node.x} cy={node.y}
            r="4"
            fill="none"
            stroke="var(--color-ink-soft)" strokeWidth="0.5"
            animate={{ r: [3.5, 5, 3.5] }}
            transition={{ duration: 6, repeat: Infinity, delay: (li + ni) * 0.3 }}
          />
        ))
      )}
      {/* Cross-hatching fill for nodes */}
      {nodes.map((layer, li) =>
        layer.map((node, ni) => (
          <g key={`hatch-${li}-${ni}`}>
            <line x1={node.x - 2} y1={node.y - 2} x2={node.x + 2} y2={node.y + 2} stroke="var(--color-ink-faded)" strokeWidth="0.2" opacity="0.3" />
            <line x1={node.x - 2} y1={node.y + 2} x2={node.x + 2} y2={node.y - 2} stroke="var(--color-ink-faded)" strokeWidth="0.2" opacity="0.3" />
          </g>
        ))
      )}
      <text x="150" y="190" textAnchor="middle" className="blueprint-label">MULTILAYER PERCEPTRON · 4-6-6-3</text>
    </>
  );
}

/* === Database Schema — tables with columns and relations === */
function DatabaseSchema() {
  const tables = [
    { x: 20, y: 40, name: "USERS", cols: ["id", "name", "email"] },
    { x: 120, y: 40, name: "POSTS", cols: ["id", "title", "user_id"] },
    { x: 220, y: 40, name: "COMMENTS", cols: ["id", "text", "post_id"] },
  ];

  return (
    <>
      {tables.map((t, i) => (
        <g key={i}>
          {/* Table outline */}
          <rect x={t.x} y={t.y} width="80" height={20 + t.cols.length * 12} className="blueprint-line" fill="none" strokeWidth="0.5" />
          {/* Header */}
          <rect x={t.x} y={t.y} width="80" height="14" fill="var(--color-gold)" opacity="0.08" stroke="var(--color-ink-soft)" strokeWidth="0.4" />
          <text x={t.x + 40} y={t.y + 10} textAnchor="middle" className="blueprint-label" fontSize="4" fontWeight="bold">{t.name}</text>
          {/* Columns */}
          {t.cols.map((col, ci) => (
            <g key={ci}>
              <line x1={t.x} y1={t.y + 14 + (ci + 1) * 12} x2={t.x + 80} y2={t.y + 14 + (ci + 1) * 12} className="blueprint-line" strokeWidth="0.2" />
              <text x={t.x + 4} y={t.y + 12 + (ci + 1) * 12} className="blueprint-label" fontSize="3">{col}</text>
            </g>
          ))}
        </g>
      ))}
      {/* Relations */}
      <motion.path
        d="M100 60 Q 110 50, 120 60" fill="none" stroke="var(--color-gold)" strokeWidth="0.4" opacity="0.4"
        animate={{ opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.path
        d="M200 60 Q 210 50, 220 60" fill="none" stroke="var(--color-gold)" strokeWidth="0.4" opacity="0.4"
        animate={{ opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 6, repeat: Infinity, delay: 1 }}
      />
      {/* Cardinality marks */}
      <text x="108" y="56" className="blueprint-label" fontSize="3">1:N</text>
      <text x="208" y="56" className="blueprint-label" fontSize="3">1:N</text>
      <text x="150" y="190" textAnchor="middle" className="blueprint-label">RELATIONAL SCHEMA · 3 TABLES</text>
    </>
  );
}

/* === Cloud Infrastructure — servers, load balancer, clients === */
function CloudInfrastructure() {
  return (
    <>
      {/* Clients */}
      {[20, 55, 90].map((x, i) => (
        <g key={i}>
          <rect x={x} y="35" width="25" height="15" className="blueprint-line" fill="none" strokeWidth="0.4" />
          <text x={x + 12} y="44" textAnchor="middle" className="blueprint-label" fontSize="3">CLIENT{i + 1}</text>
          <motion.line x1={x + 12} y1="50" x2="150" y2="70" stroke="var(--color-gold)" strokeWidth="0.3" opacity="0.15"
            animate={{ opacity: [0.1, 0.3, 0.1] }} transition={{ duration: 6, repeat: Infinity, delay: i * 0.5 }}
          />
        </g>
      ))}
      {/* Load balancer */}
      <rect x="120" y="65" width="60" height="15" className="blueprint-line" fill="var(--color-gold)" fillOpacity="0.05" strokeWidth="0.5" />
      <text x="150" y="75" textAnchor="middle" className="blueprint-label" fontSize="3.5" fontWeight="bold">LOAD BALANCER</text>
      {/* Connections to servers */}
      {[70, 130, 190, 250].map((x, i) => (
        <motion.line key={i} x1="150" y1="80" x2={x + 15} y2="105" stroke="var(--color-gold)" strokeWidth="0.3" opacity="0.15"
          animate={{ opacity: [0.1, 0.25, 0.1] }} transition={{ duration: 6, repeat: Infinity, delay: i * 0.4 }}
        />
      ))}
      {/* Servers */}
      {[70, 130, 190, 250].map((x, i) => (
        <g key={i}>
          <rect x={x} y="100" width="30" height="50" className="blueprint-line" fill="none" strokeWidth="0.4" />
          {/* Server racks */}
          {[0, 1, 2].map((r) => (
            <g key={r}>
              <line x1={x + 2} y1={105 + r * 15} x2={x + 28} y2={105 + r * 15} className="blueprint-line" strokeWidth="0.2" />
              <motion.circle cx={x + 5} cy={110 + r * 15} r="1" fill="var(--color-gold)"
                animate={{ opacity: [0.3, 0.8, 0.3] }} transition={{ duration: 5, repeat: Infinity, delay: (i + r) * 0.3 }}
              />
            </g>
          ))}
          <text x={x + 15} y="162" textAnchor="middle" className="blueprint-label" fontSize="3">SRV{i + 1}</text>
        </g>
      ))}
      {/* Database */}
      <ellipse cx="150" cy="180" rx="20" ry="8" className="blueprint-line" fill="none" strokeWidth="0.4" />
      <text x="150" y="183" textAnchor="middle" className="blueprint-label" fontSize="3">DATABASE</text>
      <text x="150" y="22" textAnchor="middle" className="blueprint-label">CLOUD TOPOLOGY · 4 NODES</text>
    </>
  );
}

/* === Rocket Engine — cross-section with combustion chamber === */
function RocketEngine() {
  return (
    <>
      {/* Engine bell outline */}
      <path d="M 130 30 L 120 50 L 120 100 L 100 150 L 100 175 L 200 175 L 200 150 L 180 100 L 180 50 L 170 30 Z"
        className="blueprint-line" fill="none" strokeWidth="0.6" />
      {/* Combustion chamber */}
      <rect x="120" y="50" width="60" height="30" className="blueprint-line" fill="var(--color-gold)" fillOpacity="0.04" strokeWidth="0.4" />
      <text x="150" y="68" textAnchor="middle" className="blueprint-label" fontSize="3">COMBUSTION</text>
      <text x="150" y="74" textAnchor="middle" className="blueprint-label" fontSize="3">CHAMBER</text>
      {/* Injector plate */}
      <line x1="120" y1="50" x2="180" y2="50" className="blueprint-line" strokeWidth="0.6" />
      {Array.from({ length: 8 }, (_, i) => (
        <circle key={i} cx={124 + i * 8} cy="50" r="1" fill="none" stroke="var(--color-ink-soft)" strokeWidth="0.3" />
      ))}
      {/* Nozzle walls */}
      <line x1="120" y1="80" x2="100" y2="150" className="blueprint-line" strokeWidth="0.3" strokeDasharray="2 1" />
      <line x1="180" y1="80" x2="200" y2="150" className="blueprint-line" strokeWidth="0.3" strokeDasharray="2 1" />
      {/* Fuel lines */}
      <path d="M 100 40 L 120 45" className="blueprint-line" strokeWidth="0.4" />
      <path d="M 200 40 L 180 45" className="blueprint-line" strokeWidth="0.4" />
      <text x="95" y="38" textAnchor="middle" className="blueprint-label" fontSize="3">FUEL</text>
      <text x="205" y="38" textAnchor="middle" className="blueprint-label" fontSize="3">LOX</text>
      {/* Exhaust plume */}
      <motion.path
        d="M 100 175 Q 150 195, 200 175 L 200 175 L 100 175 Z"
        fill="var(--color-gold)" opacity="0.03"
        animate={{ opacity: [0.02, 0.06, 0.02], d: [
          "M 100 175 Q 150 195, 200 175 L 200 175 L 100 175 Z",
          "M 100 175 Q 150 205, 200 175 L 200 175 L 100 175 Z",
          "M 100 175 Q 150 195, 200 175 L 200 175 L 100 175 Z",
        ] }}
        transition={{ duration: 5, repeat: Infinity }}
      />
      {/* Cross-hatching on bell walls */}
      {[85, 95, 105, 115, 125, 135, 145].map((y, i) => (
        <line key={i} x1={110 + (y - 80) * 0.4} y1={y} x2={190 - (y - 80) * 0.4} y2={y} stroke="var(--color-ink-faded)" strokeWidth="0.15" opacity="0.2" />
      ))}
      {/* Labels */}
      <text x="50" y="50" className="blueprint-label" fontSize="3">INJECTOR</text>
      <line x1="55" y1="50" x2="118" y2="50" className="blueprint-line" strokeWidth="0.2" strokeDasharray="1 1" />
      <text x="150" y="22" textAnchor="middle" className="blueprint-label">ROCKET ENGINE · CROSS-SECTION</text>
    </>
  );
}

/* === Programming Flowchart — decision boxes and arrows === */
function ProgrammingFlowchart() {
  return (
    <>
      {/* Start */}
      <ellipse cx="150" cy="35" rx="25" ry="10" className="blueprint-line" fill="none" strokeWidth="0.5" />
      <text x="150" y="38" textAnchor="middle" className="blueprint-label" fontSize="3.5">START</text>
      {/* Arrow down */}
      <line x1="150" y1="45" x2="150" y2="55" className="blueprint-line" strokeWidth="0.4" />
      <polygon points="148,55 152,55 150,59" fill="var(--color-ink-soft)" opacity="0.5" />
      {/* Input box */}
      <rect x="110" y="60" width="80" height="18" className="blueprint-line" fill="none" strokeWidth="0.4" />
      <text x="150" y="71" textAnchor="middle" className="blueprint-label" fontSize="3">READ INPUT</text>
      {/* Arrow down */}
      <line x1="150" y1="78" x2="150" y2="88" className="blueprint-line" strokeWidth="0.4" />
      <polygon points="148,88 152,88 150,92" fill="var(--color-ink-soft)" opacity="0.5" />
      {/* Decision diamond */}
      <path d="M 150 93 L 180 110 L 150 127 L 120 110 Z" className="blueprint-line" fill="none" strokeWidth="0.5" />
      <text x="150" y="112" textAnchor="middle" className="blueprint-label" fontSize="3">VALID?</text>
      {/* Yes branch */}
      <line x1="120" y1="110" x2="80" y2="110" className="blueprint-line" strokeWidth="0.4" />
      <text x="100" y="106" textAnchor="middle" className="blueprint-label" fontSize="3">YES</text>
      <rect x="35" y="100" width="45" height="20" className="blueprint-line" fill="none" strokeWidth="0.4" />
      <text x="57" y="112" textAnchor="middle" className="blueprint-label" fontSize="3">PROCESS</text>
      {/* No branch */}
      <line x1="180" y1="110" x2="220" y2="110" className="blueprint-line" strokeWidth="0.4" />
      <text x="200" y="106" textAnchor="middle" className="blueprint-label" fontSize="3">NO</text>
      <rect x="220" y="100" width="45" height="20" className="blueprint-line" fill="none" strokeWidth="0.4" />
      <text x="242" y="112" textAnchor="middle" className="blueprint-label" fontSize="3">ERROR</text>
      {/* Merge arrows to output */}
      <motion.line x1="57" y1="120" x2="57" y2="140" stroke="var(--color-gold)" strokeWidth="0.3" opacity="0.2"
        animate={{ opacity: [0.15, 0.35, 0.15] }} transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.line x1="242" y1="120" x2="242" y2="140" stroke="var(--color-gold)" strokeWidth="0.3" opacity="0.2"
        animate={{ opacity: [0.15, 0.35, 0.15] }} transition={{ duration: 6, repeat: Infinity, delay: 1 }}
      />
      {/* Output */}
      <rect x="110" y="140" width="80" height="18" className="blueprint-line" fill="none" strokeWidth="0.4" />
      <text x="150" y="151" textAnchor="middle" className="blueprint-label" fontSize="3">WRITE OUTPUT</text>
      {/* Arrow to end */}
      <line x1="150" y1="158" x2="150" y2="168" className="blueprint-line" strokeWidth="0.4" />
      <polygon points="148,168 152,168 150,172" fill="var(--color-ink-soft)" opacity="0.5" />
      {/* End */}
      <ellipse cx="150" cy="178" rx="25" ry="8" className="blueprint-line" fill="none" strokeWidth="0.5" />
      <text x="150" y="181" textAnchor="middle" className="blueprint-label" fontSize="3.5">END</text>
    </>
  );
}