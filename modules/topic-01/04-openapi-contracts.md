# Topic 1.4: API contracts and OpenAPI

## What it is and why it matters

An API contract defines the endpoints, inputs, outputs, status codes, and error formats that both teams agree to. OpenAPI is a machine-readable specification for HTTP APIs. For a mobile app, the contract is especially important because users may keep older app versions installed long after a backend deploy.

## How it works internally

The team writes an OpenAPI document describing routes and schemas. It can be reviewed, linted, used to generate documentation and client/server types, and tested against implementations. The document does not make a server correct by itself: tests and runtime validation must keep implementation behavior aligned with the contract.

## Minimal example

OpenAPI YAML:

```yaml
openapi: 3.0.3
info:
  title: Expense Tracker API
  version: 1.0.0
paths:
  /api/v1/transactions:
    get:
      responses:
        "200":
          description: Transactions loaded
          content:
            application/json:
              schema:
                type: object
                required: [data]
                properties:
                  data:
                    type: array
                    items:
                      $ref: "#/components/schemas/Transaction"
components:
  schemas:
    Transaction:
      type: object
      required: [id, amountMinor, currency]
      properties:
        id: { type: string }
        amountMinor: { type: integer }
        currency: { type: string, minLength: 3, maxLength: 3 }
        note: { type: string, nullable: true }
```

Node.js / Express / TypeScript handler shape:

```ts
type TransactionDto = {
  id: string;
  amountMinor: number;
  currency: string;
  note?: string | null;
};

app.get("/api/v1/transactions", (_req, res) => {
  const data: TransactionDto[] = [];
  res.status(200).json({ data });
});
```

Flutter client boundary:

```dart
Future<List<Transaction>> getTransactions() async {
  final response = await client.get(
    Uri.parse('$baseUrl/api/v1/transactions'),
    headers: {'Accept': 'application/json'},
  );
  if (response.statusCode != 200) {
    throw ApiException.fromResponse(response);
  }
  final body = jsonDecode(response.body) as Map<String, dynamic>;
  return (body['data'] as List<dynamic>)
      .map((item) => Transaction.fromJson(item as Map<String, dynamic>))
      .toList();
}
```

## Common mistakes and best practices

- Treat the contract as shared source-of-truth; review changes with backend and mobile together.
- Document success and error responses, nullability, date formats, pagination, and authentication—not only endpoint names.
- Prefer additive, backward-compatible changes; avoid renaming/removing fields used by released clients.
- Validate requests on the server even if the Flutter UI already validates them.
- Add contract/integration tests; generated types do not replace runtime validation or behavior tests.
- Keep API versioning purposeful. Don't create a new version for every additive field.

## Hands-on task

Write an OpenAPI definition for listing and creating expense transactions, including request validation, success responses, and the shared error format. Add an Express integration test and a Flutter repository test that verify the implementation matches the contract.

## Interview questions

1. What problems does OpenAPI solve beyond generating endpoint documentation?
2. Which API changes are backward-compatible for already released mobile clients?
3. Why do generated client types not remove the need for server-side validation?
