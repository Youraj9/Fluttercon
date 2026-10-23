# Flutter development checklist

Use this during implementation and code review. The examples focus on layout constraints, including the common case of a `Row` inside a `Column`.

## Layout and constraints

- [ ] Check the constraints passed from parent to child: Flutter layout is a one-pass negotiation where constraints go down, sizes go up, and parents position children.
- [ ] Give horizontal children a finite width when their content can grow. A `Row` in a bounded `Column` normally receives the available width, but a long text child can still overflow unless it is constrained.
- [ ] Use `Expanded` or `Flexible` to divide the finite horizontal space in a `Row`.
- [ ] Use `SingleChildScrollView`/`ListView` for content that can exceed the available height; don't expect a `Column` to scroll.
- [ ] Avoid `Expanded`/`Flexible` in a scrollable's unbounded main axis unless you deliberately constrain that axis.
- [ ] Use `LayoutBuilder` when a component must adapt to its actual parent constraints; use `MediaQuery` for whole-window concerns, not as a substitute for local constraints.

Example: a row inside a column, with a finite row width and ellipsized text:

```dart
Column(
  crossAxisAlignment: CrossAxisAlignment.stretch,
  children: [
    Row(
      children: [
        const Icon(Icons.receipt_long),
        const SizedBox(width: 8),
        Expanded(
          child: Text(
            transaction.merchant,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
        ),
        Text(transaction.formattedAmount),
      ],
    ),
  ],
)
```

`crossAxisAlignment.stretch` gives the `Column` children its bounded width; `Expanded` lets the merchant text consume only the remaining width after the icon and amount. This assumes the `Column` itself is under a parent that supplies finite width. If it isn't, constrain it or use a suitable `LayoutBuilder`/`SizedBox`.

## Widgets, state, and context

- [ ] Keep `build` fast and free of side effects; initiate I/O from a lifecycle/state layer, not repeatedly from `build`.
- [ ] Use `const` constructors for immutable subtrees where possible.
- [ ] Put state at the lowest common ancestor that needs to read or change it; separate transient UI state from app/server state.
- [ ] Use `BuildContext` only while its element is mounted; after `await`, check `context.mounted` before navigation, dialogs, or snackbars.
- [ ] Add keys when identity matters (reorderable/stateful lists, tests, preserving state across moves), not as a blanket optimization.

## Backend integration and data

- [ ] Keep HTTP calls outside widgets, behind a repository/client boundary.
- [ ] Use typed models at the JSON boundary; represent money in integer minor units with an explicit currency.
- [ ] Model loading, success, empty, and failure states; distinguish server errors from offline/timeouts.
- [ ] Never hardcode credentials or trust client-side validation as security.
- [ ] Set request timeouts and avoid retrying non-idempotent requests without an idempotency strategy.

## Review before merging

- [ ] Check narrow screens, large text scale, long merchant names, empty states, and loading/error states.
- [ ] Confirm layouts have no unbounded-flex exceptions or overflow warnings.
- [ ] Check semantics labels, contrast, touch target size, and keyboard/focus behavior where relevant.
- [ ] Add tests for the changed behavior and run formatter, analyzer, and relevant tests.
- [ ] Confirm API field names, nullability, status codes, and error handling match the contract.

## Do / don't quick list

**Do:** reason from parent constraints; constrain flexible `Row` children; use `Expanded` where remaining space is intended; test edge-sized content.

**Don't:** assume `Row` automatically wraps; assume every `Column` has a finite width; use fixed screen widths for reusable components; hide overflow warnings without deciding how the content should adapt.
