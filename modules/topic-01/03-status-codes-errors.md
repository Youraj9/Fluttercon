# Topic 1.3: HTTP status codes and error responses

## What it is and why it matters

An HTTP status code communicates the outcome of a request. Consistent status codes and a predictable error body let Flutter distinguish validation errors, missing resources, authentication failures, and server failures.

## How it works internally

Express chooses the status and response body; the HTTP client receives both. A response in the 2xx range indicates success, 4xx usually indicates a client/request issue, and 5xx indicates a server-side failure. A network failure has no HTTP response at all and must be handled separately from an HTTP error.

## Minimal example

Node.js / Express / TypeScript:

```ts
app.post("/api/v1/transactions", (req, res) => {
  if (typeof req.body.amountMinor !== "number" || req.body.amountMinor <= 0) {
    return res.status(400).json({
      error: { code: "INVALID_AMOUNT", message: "Amount must be positive" },
    });
  }

  return res.status(201).json({ data: { id: "txn_123" } });
});
```

Flutter / Dart:

```dart
final response = await client.post(uri, body: jsonEncode(payload));
if (response.statusCode == 201) {
  return Transaction.fromJson(jsonDecode(response.body)['data']);
}
if (response.statusCode == 400) {
  throw const FormatException('Check the transaction details');
}
throw Exception('Request failed (${response.statusCode})');
```

## Common mistakes and best practices

- Use `201 Created` after creating a resource, `400 Bad Request` for invalid input, `401` for missing/invalid authentication, `403` for insufficient permission, `404` when not found, and `500` for unexpected server errors.
- Don't return `200` with an error hidden in the JSON body.
- Keep error codes stable for client logic; messages are for humans and may change or be localized.
- Don't leak stack traces, SQL errors, tokens, or other sensitive internals to clients.
- Handle timeouts, DNS failures, and offline mode as transport errors, not HTTP status codes.
- Don't automatically retry non-idempotent writes; a retry could create a duplicate payment or expense.

## Hands-on task

Return a consistent `{ "error": { "code": "...", "message": "..." } }` shape for invalid transaction input and unknown transaction IDs. In Flutter, map the error code to a user-friendly message and show a distinct offline/network error.

## Interview questions

1. What is the difference between `401` and `403`?
2. How should a Flutter app distinguish an HTTP error from a network failure?
3. Why can blindly retrying a `POST` create duplicate records?
