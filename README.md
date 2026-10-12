# Hashmetrik

**A marketing agency website, client portal, and team workspace in one application.**

Hashmetrik helps a PR and digital-marketing agency manage the journey from a visitor's first enquiry to client onboarding, project delivery, approvals, and reporting.

The public website introduces the agency. Behind sign-in, clients review their work, staff manage delivery, and administrators run the business. The frontend and backend live in the same Next.js project.

## Start here

| I want to… | Read this |
| --- | --- |
| Understand the project and run it locally | This README |
| Understand every technology, route, integration, and deployment step | [Technical guide](docs/technical-guide.md) |
| Understand the database tables, fields, and relationships | [Database guide](docs/database-schema.md) |
| Connect Neon, email, Google Sheets, or the assistant | [Backend setup](docs/backend-setup.md) |
| Understand the product and visual design | [Product](PRODUCT.md) · [Design](DESIGN.md) |
| Configure search indexing | [SEO and Search Console](docs/seo-search-console.md) |

The diagrams use Mermaid, which GitHub renders directly. Read the technical guide and database guide after this overview; you do not need to understand every table before starting the app.

## What the application does

| Area | Who uses it | Main features |
| --- | --- | --- |
| Public website | Visitors | Agency information, services, enquiries, consultation requests, articles, AI assistant |
| Account dashboard | Registered users | Profile, consultation requests, enquiry history, notifications |
| Client portal | Activated clients | Services, projects, milestones, deliverable approvals, comments, content calendar, KPI reports |
| Team workspace | Agency staff | Assigned-client queues, project delivery, milestones, deliverables, calendar planning, KPI entry |
| Admin workspace | Administrators | Leads, consultations, accounts, client activation, staff assignments, projects, CMS, assistant settings/history, audit records |

**Example:** A business sends an enquiry, creates an account, and is activated by an administrator. The team opens a project, shares a design link, and requests approval. The client reviews it in their dashboard and either approves it or leaves feedback. The team records monthly results in the same application.

```mermaid
flowchart LR
    Visitor[Visitor] --> Enquiry[Send an enquiry]
    Enquiry --> Lead[Lead in the admin CRM]
    Lead --> Onboarding[Consultation and client activation]
    Onboarding --> Project[Team creates a project]
    Project --> Work[Share deliverables]
    Work --> Review[Client reviews the work]
    Review --> Reports[Track monthly results]
```

## Technology at a glance

Versions below come from the committed `package-lock.json`.

| Part | Technology | Plain-English purpose |
| --- | --- | --- |
| Application | Next.js 16.2.12 + React 19.2.4 | Builds pages and runs server-side application logic |
| Language | TypeScript 5.9.3 | Adds type checking to JavaScript |
| Styling | Tailwind CSS 4.3.3 + custom CSS | Controls layout, colours, typography, and responsive styles |
| Animation | GSAP 3.15.0 + Motion 12.43.0 | Powers animated interactions |
| Database | PostgreSQL; Neon is the documented hosted option | Stores accounts, leads, projects, and other records |
| Database access | Prisma 7.9.1 + PostgreSQL adapter | Queries the database and manages schema migrations |
| Sign-in | jose 6.2.7 + bcryptjs 3.0.3 | Signs session cookies and hashes passwords |
| Email | Nodemailer 9.0.5 over SMTP | Sends new-lead notifications |
| AI assistant | Groq API | Answers questions using agency information |
| Spreadsheet copy | Google Sheets API | Copies enquiries to a shared spreadsheet |
| Checks | Node test runner, ESLint, TypeScript | Tests logic and checks code quality |
| Hosting | Vercel or a Node.js server | Runs the website and its backend |

See the [complete stack and architecture](docs/technical-guide.md#technology-stack) for supporting packages and how the parts connect.

## Run locally

### 1. Install the prerequisites

- **Node.js 24 LTS** and npm.
- **Git** to clone the repository.
- **PostgreSQL**, either locally or through [Neon](https://neon.tech/).
- Optional integration accounts: Groq, an SMTP provider, and a Google service account. You can configure these later.

### 2. Download and install

```bash
git clone https://github.com/hashmetrik/Hashmetrik.git
cd Hashmetrik
npm ci
cp .env.example .env
```

On Windows without a Unix-style shell, copy `.env.example` to `.env` using your editor or file manager.

### 3. Configure the database and sign-in

Edit `.env` and set `DATABASE_URL`, `SESSION_SECRET`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD`. Use a password of at least 12 characters.

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
```

For local PostgreSQL, a connection string can look like this:

```dotenv
DATABASE_URL="postgresql://postgres:dev@localhost:5432/hashmetrik"
```

An optional Docker database:

```bash
docker run --name hashmetrik-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=dev \
  -e POSTGRES_DB=hashmetrik \
  -p 127.0.0.1:5432:5432 \
  -v hashmetrik-pgdata:/var/lib/postgresql/data \
  -d postgres:17
```

Keep `.env` private; Git ignores it.

### 4. Create the tables and initial account

```bash
npm run db:generate
npm run db:deploy
npm run db:seed
```

These commands generate Prisma's client, apply committed migrations, and seed the six agency services plus the administrator. Without `ADMIN_EMAIL` and `ADMIN_PASSWORD`, the seed creates only the services. Re-running the seed with an existing email resets that account's password, makes it an administrator, and clears its suspension.

### 5. Start the application

```bash
npm run dev
```

Open [localhost:3000](http://localhost:3000). Sign in as the seeded administrator at `/admin/login`. Public signup is at `/signup`; ordinary sign-in is at `/login`.

## Everyday commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Start development |
| `npm run dev:clean` | Remove the Next.js development cache and restart |
| `npm test` | Run logic tests |
| `npm run typecheck` | Check TypeScript |
| `npm run lint` | Run ESLint |
| `npm run build` | Generate Prisma client and build production output |
| `npm start` | Run the production build |
| `npm run db:generate` | Regenerate Prisma client |
| `npm run db:deploy` | Apply existing migrations |
| `npm run db:migrate -- --name describe_change` | Create a migration during development |
| `npm run db:seed` | Seed services and optionally the administrator |
| `npm run db:studio` | Open Prisma Studio |

## Where things live

```text
Hashmetrik/
├── app/                 Pages, server actions, and assistant API
│   ├── (site)/          Public marketing pages
│   ├── (app)/           Sign-in, dashboards, client portal, team workspace
│   ├── (admin)/         Admin pages and admin sign-in
│   └── api/assistant/   Assistant HTTP endpoint
├── components/          Reusable UI and forms
├── lib/                 Database access, validation, auth, integrations, content
├── prisma/              Schema, migrations, and seed script
├── public/              Public images, video, and icons
├── tests/               Node-based logic tests
├── docs/                Setup, architecture, database, and project notes
├── proxy.ts             Session checks and redirects
├── .env.example         Environment variable template
└── package.json         Dependencies and commands
```

## Current boundaries

Deliverables are links to files stored elsewhere. KPI values are entered manually. The calendar plans posts and records approvals; it does not publish to social networks. Self-service password reset, file uploads, automated ad-platform reporting, and email beyond lead notifications are not implemented.

Read the [technical guide](docs/technical-guide.md) for architecture, access rules, environment variables, deployment, troubleshooting, and known limitations. Read the [database guide](docs/database-schema.md) for the schema in plain English.

## Contributing and ownership

Read [AGENTS.md](AGENTS.md) before changing application code. Run relevant checks, and update documentation whenever routes, environment variables, dependencies, or database models change.

There is currently no license file in the repository. Do not assume an open-source license from the repository's visibility.
