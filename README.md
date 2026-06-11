# DevFlow AI 🚀
An automated, full-stack AI platform that analyzes complex GitHub issue threads, uses context-aware directory trees to locate target modules, generates AST-validated code patches, and deploys upstream cross-repository Pull Requests in a single click.

[🔗 Live Production Demo App Link](https://devflow-ai-lovat.vercel.app/)

## 🏗️ Architectural Highlights
* **RAG-lite Context Mapping:** Contextually injects flat-file directory structures directly into runtime model windows to isolate targeted routing configurations conversational style.
* **Abstract Syntax Tree (AST) Guardrails:** Protects source dependencies by passing LLM code layers through an `Esprima` compiler check, programmatically penalizing lexical and semantic failures.
* **Dynamic GitOps Orchestration:** Authenticates users via temporary personal tokens to securely fork target environments, manage branching states, commit code strings, and deploy upstream pull requests.

## 🛠️ DevOps CI/CD Pipeline
This project enforces zero-downtime automated deployment:
* **Continuous Integration (CI):** GitHub Actions automatically trigger on push events to run cross-environment dependency checks, isolate version mismatches, and run syntax health gates.
* **Continuous Deployment (CD):** Pushes are programmatically distributed to decoupled Vercel edge networks and Render application containers via secured webhooks.
