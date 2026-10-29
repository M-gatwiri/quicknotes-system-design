# QuickNotes API Design

## Overview

QuickNotes is a small browser application for creating, viewing, and deleting notes. This document defines a REST API contract for a future QuickNotes service and records the narrower API currently used by the demo.

## Base URL and format

The proposed service base URL is `https://api.quicknotes.example/v1`; `/notes` paths below are relative to it. Requests and successful JSON responses use `Content-Type: application/json`. The current frontend instead calls `https://jsonplaceholder.typicode.com/posts` directly.

## Endpoints

| Method | Path | Description | Success |
|---|---|---|---|
| GET | `/notes` | List the authenticated user's notes; supports pagination. | 200 OK |
| GET | `/notes/{noteId}` | Retrieve one note owned by the authenticated user. | 200 OK |
| POST | `/notes` | Create a note. | 201 Created |
| PUT | `/notes/{noteId}` | Replace all writable fields of a note. | 200 OK |
| PATCH | `/notes/{noteId}` | Update only supplied writable fields. | 200 OK |
| DELETE | `/notes/{noteId}` | Delete a note. | 204 No Content |

`noteId` is an opaque identifier. A production implementation should scope every lookup and mutation to the authenticated user's identity.

## Examples

### List notes

`GET /v1/notes?limit=2&cursor=eyJpZCI6IjEwIn0`

```json
{
  "data": [
    {"id":"note_101","title":"Shopping list","body":"Tea and bread","createdAt":"2026-10-29T08:15:00Z","updatedAt":"2026-10-29T08:15:00Z"},
    {"id":"note_102","title":"Project idea","body":"Sketch the first version","createdAt":"2026-10-28T16:40:00Z","updatedAt":"2026-10-28T16:40:00Z"}
  ],
  "page": {"limit":2,"nextCursor":"eyJpZCI6IjEwMiJ9","hasMore":true}
}
```

### Create a note

`POST /v1/notes`

```json
{"title":"Meeting notes","body":"Review milestones on Friday."}
```

Response (`201 Created`, with `Location: /v1/notes/note_103`):

```json
{"id":"note_103","title":"Meeting notes","body":"Review milestones on Friday.","createdAt":"2026-10-29T09:00:00Z","updatedAt":"2026-10-29T09:00:00Z"}
```

### Replace a note

`PUT /v1/notes/note_103`

```json
{"title":"Friday meeting","body":"Review milestones and owners."}
```

Returns `200 OK` with the complete updated note representation. PUT supplies all writable fields; omitted required fields fail validation.

### Partially update a note

`PATCH /v1/notes/note_103`

```json
{"title":"Friday planning"}
```

Returns `200 OK` with the complete updated note. Only supplied fields change; an empty patch is rejected.

### Delete a note

`DELETE /v1/notes/note_103`

Returns `204 No Content` with an empty response body.

## Status codes

| Code | Meaning |
|---|---|
| 200 | Request succeeded and a response representation is returned. |
| 201 | Resource created successfully; response identifies the new resource. |
| 204 | Request succeeded with no response body, commonly deletion. |
| 400 | Malformed JSON, invalid fields, or invalid query parameters. |
| 401 | Authentication is missing or invalid. |
| 403 | Authenticated caller lacks permission for the operation. |
| 404 | Resource does not exist or is not visible to this caller. |
| 500 | Unexpected server failure; response must not expose internals. |

Example error response:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The request contains invalid fields.",
    "details": [{"field":"title","issue":"must contain 1 to 100 characters"}],
    "requestId": "req_7f12a9"
  }
}
```

## Validation rules

- `title` is required, trimmed, non-empty, and at most 100 characters.
- `body` is optional and has a documented service limit (for example, 20,000 characters).
- Reject unsupported fields, invalid JSON, and oversized request bodies with `400` or `413` as appropriate.
- Validate path identifiers and pagination bounds. Apply the same rules on the server even where the browser also validates.

## Authentication and authorization

The current demo has no login or access control; its placeholder `userId` is fixed to `1`. A production API should authenticate with a secure session or short-lived access token over TLS. Authorization must check note ownership on every read, update, and delete; do not trust a client-supplied owner ID. Use `401` for absent/invalid credentials and `403` for authenticated but disallowed actions (or `404` to avoid disclosing another user's resource).

## Pagination, security, and errors

Use bounded cursor pagination with a default and maximum page size, stable ordering, and a next cursor; avoid unbounded full-table responses. Enforce TLS, request size and rate limits, secure cookie/token handling, input validation, parameterized database queries, and restrictive CORS. Return consistent machine-readable errors with request IDs, avoid secrets and stack traces in client responses, and log diagnostic context safely. Clients should handle network errors and non-2xx responses without assuming every response has JSON.

## Reusable JavaScript request function

The current `request(url, options = {})` helper wraps `fetch`, checks `response.ok`, throws an error for unsuccessful HTTP statuses, then parses the body as JSON. This keeps transport and status handling shared by GET, POST, and DELETE calls. A production-ready helper should account for empty `204` responses, parse structured error bodies when available, attach authentication safely, and distinguish network failures from HTTP errors.

## Implemented behavior and proposed behavior

| Capability | Current frontend demo | Proposed API/system |
|---|---|---|
| List notes | GET JSONPlaceholder posts, limited to 10. | `GET /notes`, owned records, cursor pagination. |
| Create note | POST title/body and fixed `userId: 1`. | Authenticated `POST /notes`, persistent database write. |
| Delete note | DELETE placeholder post. | Ownership-checked persistent deletion. |
| Replace / partial update | Not implemented. | PUT and PATCH contracts above. |
| Authentication / custom backend | Not implemented. | Required production concerns described above. |

JSONPlaceholder simulates POST and DELETE responses; those operations do not permanently persist the created or deleted posts. The frontend validates a non-empty title with a 100-character maximum and shows loading, success, and error status messages.
