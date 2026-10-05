# 🚀 TaskMatrix — Sprint 15: Feature Complete (Full CRUD & Data Analytics)

![Sprint 15 Status](https://img.shields.io/badge/Sprint-15_Feature_Complete-emerald?style=for-the-badge)
![Track](https://img.shields.io/badge/Track-A:_Frontend_Specialist-blue?style=for-the-badge)
![Next.js 14](https://img.shields.io/badge/Next.js-14_App_Router-black?style=for-the-badge)
![Analytics](https://img.shields.io/badge/Visualization-Recharts_Engine-purple?style=for-the-badge)

## 📌 Executive Summary
Sprint 15 delivers the **Feature Complete** CRUD architecture and dynamic data visualization engine for **TaskMatrix** — an enterprise-grade Agile Project Management System. Users can register/login, create tasks, edit task attributes, safely delete tasks, filter tasks by priority/title, and view real-time task analytics.

---

## 🌐 Live Application & Links
- 🚀 **Live Website (Vercel)**: [https://prodesk-capstone-taskmatrix-sprint-one.vercel.app](https://prodesk-capstone-taskmatrix-sprint-one.vercel.app)
- 📦 **GitHub Repository**: [https://github.com/shashank113333/prodesk-capstone-taskmatrix-Sprint-15](https://github.com/shashank113333/prodesk-capstone-taskmatrix-Sprint-15)
- 📝 **AI Compliance Log**: Refer to `Prompts.md` for architectural decision logs.

---

## 🔑 Evaluator & System Administrator Credentials

Below are the pre-seeded credentials for evaluators and reviewers to test all RBAC roles, CRUD operations, and Admin User Accounts Management:

| Role Name | Agile Designation | Email Address | Default Password | Permissions / Capabilities |
| :--- | :--- | :--- | :--- | :--- |
| **System Administrator** | Master System Admin | `shashankv@gmail.com` | `1234` | **Full Admin Control**: All BaaS CRUD, Task Deletions, Recharts Analytics, Accounts DB Directory, Timed Account Suspensions (1h/24h/7d/30d/Perm), Role Editor |


## 🏗️ Technical Architecture & Tech Stack

| Layer | Technology / Tool | Operational Rationale |
| :--- | :--- | :--- |
| **Framework** | Next.js 14 (App Router) | Server-driven routing & edge performance |
| **Language** | TypeScript | Strict typing for Task payloads & store definitions |
| **Styling** | Tailwind CSS | Modern dark-mode utility-first UI design |
| **State Management** | Zustand | Global auth & task state management with persistence |
| **Analytics Engine** | Recharts | Dynamic Bar & Pie charts driven by `.reduce()` aggregated metrics |
| **Icons** | Lucide React | Enterprise UI iconography |

---

## 🔑 Key Features Implemented (Sprint 15 Deliverables)

### 1. Create & Read Operations (Phase 1 - P0)
- **Data Hydration (Read)**: Automatically fetches and hydrates task state associated with authenticated user email upon `/dashboard` route access.
- **Payload Injection (Create)**: "+ Add New Task" modal allows injection of new task payloads into cloud state and instantly updates DOM.

### 2. Update & Delete Operations (Phase 2 - P1)
- **State Mutation (Update)**: Edit modal allows modifying Task title, description, status (`To Do`, `In Progress`, `In Review`, `Done`), priority, and due date.
- **Safety Destruction (Delete)**: Integrated a safety confirmation modal (`DeleteConfirmModal`) before permanently purging task entities from local state.

### 3. Data Analytics & Visualization (Phase 3 - P2)
- **Data Aggregation**: Custom JavaScript `.reduce()` utility functions parse task objects into column status and priority distribution metrics.
- **Visualization Engine**: Dynamic Recharts Bar Chart and metric summary panels on dashboard.

---

## 🛠️ Local Development Setup

```bash
# 1. Clone the repository
git clone https://github.com/shashank113333/prodesk-capstone-taskmatrix-Sprint-15.git

# 2. Navigate to project directory
cd prodesk-capstone-taskmatrix-Sprint-15

# 3. Install dependencies
npm install

# 4. Launch development server
npm run dev
