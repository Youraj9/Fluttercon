# Topic 1.2: JSON payloads

## What it is and why it matters

JSON is a text format used to exchange structured data. It is language-independent, so a TypeScript server and a Dart client can agree on the same transaction representation without sharing runtime objects.

## How it works internally

The server serializes an object to UTF-8 JSON text and labels it with `Content-Type: application/json`. Flutter receives bytes, decodes the text, parses JSON into dynamic Dart values, and maps those values into typed models. Parsing is a trust boundary: server responses can be malformed, missing fields, or contain values outside expected ranges.

## Minimal example

Node.js / Express / TypeScript:

```ts
type Transaction = {
  id: string;
  amountMinor: number;
  currency: string;
  note: string | null;
};

const transaction: Transaction = {
  id: "txn_123",
  amountMinor: 1299,
  currency: "USD",
  note: "Coffee",
};

res.type("application/json").json({ data: transaction });
```

Flutter / Dart:

```dart
class Transaction {
  const Transaction({
    required this.id,
    required this.amountMinor,
    required this.currency,
    this.note,
  });

  final String id;
  final int amountMinor;
  final String currency;
  final String? note;

  factory Transaction.fromJson(Map<String, dynamic> json) => Transaction(
        id: json['id'] as String,
        amountMinor: json['amountMinor'] as int,
        currency: json['currency'] as String,
        note: json['note'] as String?,
      );
}
```

## Common mistakes and best practices

- Avoid floating-point money values. Represent money as integer minor units (for example, cents) plus a currency.
- Distinguish a missing field from an explicitly `null` field when the contract gives them different meanings.
- Don't pass `dynamic` through the app; parse at the API boundary into typed models.
- Use ISO 8601 timestamps with an explicit timezone, typically UTC.
- Treat enum values and server-provided fields as untrusted; plan how clients handle unknown values.
- In production, generate serialization code for larger models (for example, `json_serializable`) and validate incoming server data.

## Hands-on task

Define a transaction JSON shape with `id`, `amountMinor`, `currency`, `occurredAt`, and nullable `note`. Return it from Express, parse it into a Dart model, and display the amount and note. Add a test for a missing required field.

## Interview questions

1. Why is integer minor-unit representation safer than a floating-point amount?
2. What are the risks of mapping parsed JSON directly to `dynamic` throughout a Flutter app?
3. How should an older client handle a new optional field or enum value?
