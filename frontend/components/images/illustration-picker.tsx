"use client";

import * as React from "react";

import { AIBrain } from "./ai-brain";
import { CyberLock } from "./cyber-lock";
import { CodeTerminal } from "./code-terminal";
import { GlobeNetwork } from "./globe-network";
import { DNASpiral } from "./dna-spiral";
import { QuantumOrbit } from "./quantum-orbit";
import { QuantumWave } from "./quantum-wave";
import { RoboArm } from "./robo-arm";
import { TelescopeStars } from "./telescope-stars";
import { PlanetOrbit } from "./planet-orbit";
import { PhoneHand } from "./phone-hand";
import { CodeBrackets } from "./code-brackets";
import { GitBranch } from "./git-branch";
import { BrainNeural } from "./brain-neural";
import { ChartBars } from "./chart-bars";
import { Microscope } from "./microscope";
import { GameController } from "./game-controller";
import { F1Racing } from "./f1-racing";
import { Palette } from "./palette";
import { Briefcase } from "./briefcase";
import { Shield } from "./shield";
import { DollarCoin } from "./dollar-coin";
import { GraduationCap } from "./graduation-cap";
import { AnchorShip } from "./anchor-ship";
import { HandshakeDeal } from "./handshake-deal";
import { LightbulbIdea } from "./lightbulb-idea";
import { BlueprintDiagram } from "./blueprint-diagram";

type IllustrationComponent = React.ComponentType<{ className?: string }>;
type IllustrationMap = Record<string, IllustrationComponent>;

const ILLUSTRATIONS: IllustrationMap = {
  "ai-brain": AIBrain,
  "cyber-lock": CyberLock,
  "code-terminal": CodeTerminal,
  "globe-network": GlobeNetwork,
  "dna-spiral": DNASpiral,
  "quantum-orbit": QuantumOrbit,
  "quantum-wave": QuantumWave,
  "robo-arm": RoboArm,
  "telescope-stars": TelescopeStars,
  "planet-orbit": PlanetOrbit,
  "phone-hand": PhoneHand,
  "code-brackets": CodeBrackets,
  "git-branch": GitBranch,
  "brain-neural": BrainNeural,
  "chart-bars": ChartBars,
  microscope: Microscope,
  "game-controller": GameController,
  "f1-racing": F1Racing,
  palette: Palette,
  briefcase: Briefcase,
  shield: Shield,
  "dollar-coin": DollarCoin,
  "graduation-cap": GraduationCap,
  "anchor-ship": AnchorShip,
  "handshake-deal": HandshakeDeal,
  "lightbulb-idea": LightbulbIdea,
};

const KEYWORD_RULES: { pattern: RegExp; key: keyof typeof ILLUSTRATIONS }[] = [
  // Quantum
  { pattern: /quantum\s*wave|qubit|superposition|entanglement|wave\s*function/, key: "quantum-wave" },
  { pattern: /quantum|atomic\s*physics|particle\s*physics|hadron|quark|spin\b/, key: "quantum-orbit" },

  // Security
  { pattern: /virus|malware|exploit|breach|hacked|password\s*leak|phishing|ransomware|firewall|encryption|vulnerab|cve-|zero.day/, key: "cyber-lock" },
  { pattern: /safety|protection|insurance|secure|safety|defen[cs]e/, key: "shield" },

  // AI / ML
  { pattern: /\bai\b|artificial\s*intelligence|machine\s*learning|\bllm\b|chatgpt|\bgpt\b|claude|copilot|gemini|neural\s*network|generative|deep\s*learning|stable\s*diffusion|inference|train(ing|ed)\s*model|transformer|diffusion/, key: "ai-brain" },

  // Brain / neuroscience
  { pattern: /neuroscien|cognitive|psychology|consciousness|brain\b|memory\b/, key: "brain-neural" },

  // Code / programming
  { pattern: /terminal|bash|zsh|fish|cli\b|command\s*line|shell\s*script|repl/, key: "code-terminal" },
  { pattern: /github|\bgit\b|merge\s*conflict|commit|pull\s*request|repository|version\s*control|\bbranching\b/, key: "git-branch" },
  { pattern: /code|programming|developer|coding|software|engineer|\breact\b|\btypescript\b|javascript|\brust\b|\bgo\s*lang\b|python|c\+\+|frontend|backend|web\s*dev|compiler|runtime|kubernetes|\bk8s\b/, key: "code-brackets" },

  // Network / web
  { pattern: /internet|network|cdn|\bhttp\b|\bdns\b|domain|server|cloud\s*computing|aws|azure|gcp|distributed|edge\s*computing|datacenter|web\b/, key: "globe-network" },

  // Biology / DNA
  { pattern: /\bdna\b|gene|genetic|genome|biotech|crispr|cloning|mutation|sequencing|biology/, key: "dna-spiral" },

  // Robotics
  { pattern: /robot|robotics|automation|actuator|mechanical\s*arm|cobot/, key: "robo-arm" },

  // Astronomy
  { pattern: /telescope|observatory|hubble|james\s*webb|jwst|stargazing/, key: "telescope-stars" },
  { pattern: /planet|solar|exoplanet|jupiter|mars\b|venus\b|saturn\b|mercury\b|neptune\b|uranus\b|solar\s*system|comet|asteroid|nebula|black\s*hole|cosmos|galaxy/, key: "planet-orbit" },

  // Mobile
  { pattern: /mobile|\bphone\b|smartphone|\bapp\b|\bios\b|android|tablet|wearable|smartwatch/, key: "phone-hand" },

  // Charts / data
  { pattern: /chart|analytics|\bdata\b|graph\b|statistic|dashboard|visualization|big\s*data/, key: "chart-bars" },

  // Lab
  { pattern: /microscope|laboratory|\blab\b|experiment|chemistry|physics|particle\s*accelerator/, key: "microscope" },

  // Gaming
  { pattern: /game|console|gaming|playstation|\bxbox\b|nintendo|steam|video\s*game|esport|nintendo/, key: "game-controller" },

  // Racing
  { pattern: /racing|\bf1\b|formula\s*1|motorsport|nascar|drift|grand\s*prix/, key: "f1-racing" },

  // Art / design
  { pattern: /art\b|design|creative|illustration|graphic\s*design|portfolio|designer|figma|sketch|adobe/, key: "palette" },

  // Jobs / business
  { pattern: /jobs|hiring|career|employment|recruit|work\b|freelance|remote\s*work|hiring\s*spree|layoff/, key: "briefcase" },

  // Finance / crypto
  { pattern: /bitcoin|ethereum|crypto|blockchain|\bnft\b|web3|token|defi|coin\b/, key: "dollar-coin" },
  { pattern: /finance|stock|market|trading|economic|\bipo\b|invest|fund|valuation|startup\s*valuation|nasdaq|nyse|wall\s*street|dow\s*jones|s&p|treasury|inflation|interest\s*rate/, key: "dollar-coin" },

  // Education
  { pattern: /graduation|education|learning|degree|university|college|\bstudent\b|mooc|\bcourse\b|tutorial|certificate|bootcamp/, key: "graduation-cap" },

  // Startup
  { pattern: /startup|founder|entrepreneur|\blaunch\b|seed\s*fund|series\s*[a-f]|venture\s*capital|yc\b|y\s*combinator/, key: "anchor-ship" },

  // Partnership
  { pattern: /partnership|deal\b|merger|acquisition|contract|agreement|acquire|acquired|joins\s*forces/, key: "handshake-deal" },

  // Idea / innovation
  { pattern: /idea|innovation|invention|breakthrough|inventor|new\s*approach|paradigm\s*shift/, key: "lightbulb-idea" },

  // Circuit / hardware (fallback to existing)
  { pattern: /circuit|chip|semiconductor|hardware|pulse|electric|signal|wireless|\b5g\b|\b6g\b/, key: "cyber-lock" },

  // Blueprint diagrams — technical articles
  { pattern: /gpu\s*arch|gpu\s*die|nvidia|rtx|gpgpu|cuda\s*core|tensor\s*core/, key: "blueprint-gpu" },
  { pattern: /neural\s*network\s*arch|deep\s*learning\s*model|transformer\s*arch|attention\s*mechanism/, key: "blueprint-neural" },
  { pattern: /database\s*schema|sql\s*schema|table\s*structure|relational\s*model|postgres|mysql|mongodb/, key: "blueprint-database" },
  { pattern: /cloud\s*infrastructure|kubernetes\s*cluster|microservice|service\s*mesh|load\s*balanc|distributed\s*system/, key: "blueprint-cloud" },
  { pattern: /rocket\s*engine|raptor\s*engine|merlin\s*engine|combustion\s*chamber|nozzle\s*design/, key: "blueprint-rocket" },
  { pattern: /flowchart|algorithm\s*design|control\s*flow|state\s*machine|decision\s*tree/, key: "blueprint-flowchart" },
];

export interface IllustrationArticle {
  title?: string;
  category?: string;
  tags?: string[] | string;
  source?: string;
}

function pickIllustration(article: IllustrationArticle | null | undefined): keyof typeof ILLUSTRATIONS {
  if (!article) return "ai-brain";
  const tags = Array.isArray(article.tags) ? article.tags : (typeof article.tags === "string" ? [article.tags] : []);
  const haystack = [
    article.title ?? "",
    article.category ?? "",
    ...tags,
    article.source ?? "",
  ]
    .join(" ")
    .toLowerCase();

  for (const { pattern, key } of KEYWORD_RULES) {
    if (pattern.test(haystack)) return key;
  }
  return "ai-brain";
}

const BLUEPRINT_MAP: Record<string, { type: "gpu-architecture" | "neural-network" | "database-schema" | "cloud-infrastructure" | "rocket-engine" | "programming-flowchart"; title: string }> = {
  "blueprint-gpu": { type: "gpu-architecture", title: "GPU Architecture" },
  "blueprint-neural": { type: "neural-network", title: "Neural Network" },
  "blueprint-database": { type: "database-schema", title: "Database Schema" },
  "blueprint-cloud": { type: "cloud-infrastructure", title: "Cloud Infrastructure" },
  "blueprint-rocket": { type: "rocket-engine", title: "Rocket Engine" },
  "blueprint-flowchart": { type: "programming-flowchart", title: "Programming Flowchart" },
};

export interface LivingIllustrationProps {
  article?: IllustrationArticle | null;
  imageUrl?: string | null;
  className?: string;
  alt?: string;
}

export function LivingIllustration({ article, imageUrl, className, alt }: LivingIllustrationProps) {
  const key = pickIllustration(article);
  const [imgError, setImgError] = React.useState(false);

  // Try to render the article image first, with ink-illustration filter
  if (imageUrl && !imgError) {
    return (
      <div className="ink-illustration ink-illustration-frame" style={{ width: "100%", height: "100%", position: "relative" }}>
        <img
          src={imageUrl}
          alt={alt ?? article?.title ?? "Illustration"}
          className={className}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          loading="lazy"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  // Blueprint diagrams render differently
  if (key.startsWith("blueprint-")) {
    const bp = BLUEPRINT_MAP[key];
    if (bp) {
      return (
        <div className="ink-illustration" style={{ width: "100%", height: "100%", position: "relative" }}>
          <BlueprintDiagram type={bp.type} title={bp.title} className="w-full h-full" />
        </div>
      );
    }
  }

  // Fallback: SVG illustration
  const Component = ILLUSTRATIONS[key] ?? AIBrain;
  return (
    <div className="ink-illustration" style={{ width: "100%", height: "100%", position: "relative" }}>
      <Component className="w-full h-full" />
    </div>
  );
}

export { ILLUSTRATIONS, KEYWORD_RULES };
export default LivingIllustration;
