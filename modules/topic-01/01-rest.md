# Topic 1.1: REST between Flutter and Node.js

## What it is and why it matters

REST is a way to expose resources over HTTP. In our expense tracker, a transaction is a resource: Flutter can request `GET /api/v1/transactions` or create one with `POST /api/v1/transactions`. A clear resource-oriented API lets the mobile app and backend evolve independently.

## How it works internally

Flutter creates an HTTP request with a method, URL, headers, and optionally a body. Express routes the request by method and path, runs middleware, invokes a handler, and sends an HTTP response. The response includes a status, headers, and usually a JSON body. HTTP is stateless: each request must carry the information the server needs, such as an access token.

## Minimal example

Node.js / Express / TypeScript:

```ts
import express from "express";

const app = express();
app.use(express.json());

app.get("/api/v1/transactions", (_req, res) => {
  res.status(200).json({ data: [] });
});

app.post("/api/v1/transactions", (req, res) => {
  res.status(201).json({ data: req.body });
});
```

Flutter / Dart using `package:http`:

```dart
final response = await http.get(
  Uri.parse('$baseUrl/api/v1/transactions'),
  headers: {'Accept': 'application/json'},
);
if (response.statusCode != 200) {
  throw Exception('Could not load transactions');
}
```

## Common mistakes and best practices

- Don't use `GET` to change server state; use the method that describes the operation.
- Don't put secrets or personal data in URLs; URLs are commonly logged.
- Use resource nouns and a consistent prefix/version, such as `/api/v1/transactions`.
- Keep request/response shapes consistent and set timeouts in the client.
- Never assume a network request succeeds; surface loading, empty, and error states in Flutter.

## Hands-on task

Add `GET /api/v1/transactions` and `POST /api/v1/transactions` endpoints. Call the GET endpoint from a Flutter repository and render the returned transactions. For now, in-memory data is enough; validate the request body before accepting a new transaction.

## Interview questions

1. What makes an API resource-oriented, and how would you model expense categories?
2. Why is HTTP considered stateless, and how can an API authenticate each request?
3. When should an API use `POST` rather than `PUT` or `PATCH`?
