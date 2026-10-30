# Fintech expense tracker learning monorepo

An interactive learning website and monorepo scaffold for building one application across two independently deployable components:

- `backend/`: Node.js + Express + TypeScript + PostgreSQL API.
- `flutter_app/`: Flutter mobile client.
- `modules/`: one set of learning notes per concept/module.
- `index.html`, `styles.css`, and `app.js`: searchable learning guide with light, dark, and system display modes.
- The guide includes a Flutter cheat sheet, development and release reminders, editor shortcuts, and a layout-focused code review checklist.

## Open the learning website

Open `index.html` directly in a browser, or serve the workspace locally:

```powershell
python -m http.server 8000
```

Then visit `http://localhost:8000`. The site is static and has no package installation step.

## Learning workflow

Complete one topic at a time. Each concept note includes what/why, internals, minimal backend and Flutter examples, common mistakes, a task, and interview questions. Implement each task in both components where applicable, test it, then commit that module's work.

## Topic 1: Flutter talks to a backend

Start with [REST](modules/topic-01/01-rest.md), [JSON](modules/topic-01/02-json.md), [HTTP status codes and errors](modules/topic-01/03-status-codes-errors.md), and [API contracts with OpenAPI](modules/topic-01/04-openapi-contracts.md). Use the [Flutter development checklist](modules/topic-01/developing-flutter-checklist.md) while building and reviewing UI.
