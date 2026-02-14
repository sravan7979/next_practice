# Fix: "next is not a function" (Mongoose + Next.js)

## Symptom

API response:

```json
{
  "message": "Unable to save the event",
  "error": "next is not a function"
}
```

## Root cause

In Mongoose v8/v9, middleware (hooks) can be written in **two** styles:

1) **Callback style**

```ts
schema.pre("save", function (next) {
  // ...
  next();
});
```

2) **Promise/async style**

```ts
schema.pre("save", async function () {
  // ...
  // throw to fail
});
```

If you accidentally mix the styles (for example, an `async function (next)` and then calling `next()`), Mongoose can treat the hook as promise-based and **not provide a callback**, leading to runtime errors like:

- `next is not a function`

This commonly shows up while calling `Model.create()` because `create()` triggers `save()` under the hood.

## Fix applied in this repo

- Converted hooks to **promise/async style** (no `next` parameter, no `next()` call)
- When validation fails inside a hook, the hook now **throws** an error

Files updated:

- `database/event.model.ts` (removed `next()` callback usage)
- `database/booking.model.ts` (removed `next()` callback usage, throws validation errors)

## How to verify

1) Start dev server

```bash
npm run dev
```

2) Hit the DB test route

```bash
curl -s http://localhost:3000/api/test-db | jq
```

3) Create an event (use `x-www-form-urlencoded` or `form-data` unless you update the API to accept JSON)

## Related notes

- Next.js App Router route handlers (`app/api/**/route.ts`) do **not** use Express middleware signatures like `(req, res, next)`.
- If you see errors around response helpers, ensure `NextResponse.json(body, { status })` is called with **only two arguments**.
