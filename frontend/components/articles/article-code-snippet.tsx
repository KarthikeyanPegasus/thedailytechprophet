"use client";

import type { Article } from "@/types";

interface ArticleCodeSnippetProps {
  article: Article;
}

export function ArticleCodeSnippet({ article }: ArticleCodeSnippetProps) {
  const snippet = getSnippet(article);

  return (
    <div className="vintage-card bg-ink/5">
      <h3 className="font-display text-lg font-bold text-ink mb-3 border-b border-[var(--border-color)] pb-2">
        Engineer’s Note
      </h3>
      <p className="font-body text-xs text-ink-soft italic mb-3">{snippet.description}</p>
      <pre className="font-mono text-xs text-gold overflow-x-auto p-2 bg-ink/80 rounded-sm">
        {snippet.code}
      </pre>
    </div>
  );
}

function getSnippet(article: Article): { description: string; code: string } {
  const text = [...article.categories, ...article.tags, article.title].join(" ").toLowerCase();
  const cats = article.categories;

  if (matches(text, ["python", "cpython", "jit"])) {
    return {
      description: "Reproduce the benchmark locally:",
      code: `python -m venv venv
source venv/bin/activate
pip install pyperformance
python -m pyperformance run -o results.json`,
    };
  }

  if (matches(text, ["rust", "cargo", "memory-safety"])) {
    return {
      description: "Add the crate to your project:",
      code: `cargo new prophet-demo
cd prophet-demo
cargo add tokio serde
cargo run`,
    };
  }

  if (matches(text, ["typescript", "types", "type arithmetic"])) {
    return {
      description: "A small type-level experiment:",
      code: `type Add<A extends number, B extends number> =
  [A, B] extends [infer X, infer Y]
    ? X & Y extends never
      ? A | B
      : never
    : never;

type Result = Add<2, 3>;`,
    };
  }

  if (matches(text, ["go", "golang", "generics"])) {
    return {
      description: "Try the new type-set constraints:",
      code: `package main

type Number interface {
    ~int | ~float64
}

func Sum[T Number](a, b T) T {
    return a + b
}

func main() {
    println(Sum(2, 3))
}`,
    };
  }

  if (matches(text, ["linux", "kernel", "scheduler"])) {
    return {
      description: "Check the current scheduler policy:",
      code: `cat /sys/kernel/debug/sched/debug
tune2fs -l /dev/sda1 | grep "Scheduler"
sysctl kernel.sched_*`,
    };
  }

  if (matches(text, ["docker", "kubernetes", "k8s", "wasm", "devops"])) {
    return {
      description: "Spin up a local cluster:",
      code: `kind create cluster --name prophet
cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: Pod
metadata:
  name: wasm-demo
spec:
  containers:
  - name: app
    image: ghcr.io/prophet/wasm:latest
EOF`,
    };
  }

  if (matches(text, ["cybersecurity", "openssl", "vulnerability", "zero-day"])) {
    return {
      description: "Check your OpenSSL version:",
      code: `openssl version -a
nmap --script ssl-enum-ciphers -p 443 example.com
cat /etc/ssl/certs/ca-certificates.crt | wc -l`,
    };
  }

  if (matches(text, ["cybersecurity", "passkeys", "authentication"])) {
    return {
      description: "Generate a test passkey credential:",
      code: `# Requires a WebAuthn-compatible browser
navigator.credentials.create({
  publicKey: {
    challenge: new Uint8Array(32),
    rp: { name: "Prophet Demo" },
    user: { id: new Uint8Array(8), name: "reader", displayName: "Reader" },
    pubKeyCredParams: [{ alg: -7, type: "public-key" }]
  }
});`,
    };
  }

  if (matches(text, ["ai", "llm", "gpt", "openai", "claude", "model"])) {
    return {
      description: "Call the model API from your terminal:",
      code: `curl https://api.openai.com/v1/chat/completions \\
  -H "Authorization: Bearer $OPENAI_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gpt-5",
    "messages": [{"role": "user", "content": "Summarize this article"}]
  }'`,
    };
  }

  if (matches(text, ["space", "spacex", "starship", "nasa"])) {
    return {
      description: "Estimate orbital velocity at 400 km altitude:",
      code: `import math
G = 6.674e-11      # m^3 kg^-1 s^-2
M = 5.972e24       # kg
r = 6_771_000      # Earth radius + 400 km
v = math.sqrt(G * M / r)
print(f"{v:.0f} m/s")  # ≈ 7,668 m/s`,
    };
  }

  if (matches(text, ["apple", "swift", "ios"])) {
    return {
      description: "A minimal SwiftUI view to test the chip:",
      code: `import SwiftUI

struct ContentView: View {
    var body: some View {
        Text("Neural Engine: \(MLEngine.status)")
            .font(.headline)
    }
}`,
    };
  }

  if (matches(text, ["android", "google", "pixel"])) {
    return {
      description: "Enable desktop mode over ADB:",
      code: `adb shell settings put global force_desktop_mode_on_external_displays 1
adb shell am start -a android.intent.action.MAIN -d "prophet://desktop"`,
    };
  }

  if (matches(text, ["cloud", "aws", "lambda", "serverless"])) {
    return {
      description: "Deploy a one-minute Lambda:",
      code: `aws lambda create-function \\
  --function-name prophet-warm \\
  --runtime python3.12 \\
  --handler index.handler \\
  --zip-file fileb://function.zip \\
  --role arn:aws:iam::123456789012:role/lambda-role`,
    };
  }

  if (matches(text, ["cloud", "cloudflare", "ai gateway"])) {
    return {
      description: "Route requests through the gateway:",
      code: `curl https://gateway.ai.cloudflare.com/v1/... \\
  -H "Content-Type: application/json" \\
  -d '{"model":"gpt-5","messages":[{"role":"user","content":"hello"}]}'`,
    };
  }

  if (matches(text, ["quantum", "qubits", "ibm", "google quantum"])) {
    return {
      description: "A tiny Qiskit circuit to run locally:",
      code: `from qiskit import QuantumCircuit, transpile
from qiskit_aer import AerSimulator

qc = QuantumCircuit(2)
qc.h(0)
qc.cx(0, 1)
qc.measure_all()

sim = AerSimulator()
job = sim.run(transpile(qc, sim))
print(job.result().get_counts())`,
    };
  }

  if (matches(text, ["gaming", "steam deck", "valve"])) {
    return {
      description: "Check GPU performance on the device:",
      code: `gamescope --mangoapp -- vulkaninfo | grep deviceName
steamos-readonly disable
sudo pacman -Syu mesa-utils`,
    };
  }

  if (matches(text, ["design", "figma", "design-to-code"])) {
    return {
      description: "Export a component from Figma via CLI:",
      code: `npx figma-cli export \\
  --file ABc123 \\
  --node 42:99 \\
  --format react \\
  --out ./components`,
    };
  }

  if (matches(text, ["open-source", "github", "copilot"])) {
    return {
      description: "Clone and inspect the inference engine:",
      code: `git clone https://github.com/prophet/monza.git
 cd monza
 go build ./...
 ./monza --model gpt-5 --port 8080`,
    };
  }

  if (matches(text, ["startups", "stripe", "atlas"])) {
    return {
      description: "Create a company via the Stripe Atlas API:",
      code: `stripe atlas create-company \\
  --name "Prophet Industries" \\
  --state delaware \\
  --company-type c-corporation`,
    };
  }

  if (matches(text, ["career", "hiring", "interview"])) {
    return {
      description: "A quick system-design checklist:",
      code: `1. Requirements (functional / non-functional)
2. Capacity estimates (QPS, storage, bandwidth)
3. API design & data model
4. High-level architecture
5. Deep dive: caching, DB, scaling
6. Trade-offs & failure modes`,
    };
  }

  // Default: terminal tip
  return {
    description: "A useful terminal shortcut for the reader:",
    code: `# Search command history
Ctrl + R

# Re-run the last command with sudo
sudo !!

# Copy last command to clipboard
fc -ln -1 | pbcopy`,
  };
}

function matches(text: string, keywords: string[]): boolean {
  return keywords.some((kw) => text.includes(kw));
}
