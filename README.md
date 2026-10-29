# QuickNotes — REST API Client and System Design

## Project Overview

QuickNotes is a learning project demonstrating how a browser application makes REST API requests and how a software system can be described through API, data-model, and architecture documentation. The current application is a frontend demonstration backed by JSONPlaceholder; the production database and infrastructure described in the design documents are proposals, not deployed services.

## Features

- Load up to 10 notes with an HTTP GET request.
- Create a note with an HTTP POST request.
- Delete a note with an HTTP DELETE request.
- Validate that a title is provided and is no longer than 100 characters.
- Show loading states while requests are in progress.
- Display success and error messages for user actions.
- Disable relevant buttons while requests are in progress to avoid duplicate submissions.

## Technologies Used

- HTML5
- CSS3
- JavaScript
- Fetch API
- JSONPlaceholder
- Git
- GitHub

## Project Structure

```text
quicknotes-system-design/
├── docs/
│   ├── api-design.md
│   ├── architecture.md
│   └── data-model.md
├── api.js
├── index.html
├── README.md
└── style.css
```

## How to Run the Project

1. Open the project folder on your computer.
2. Open `index.html` directly in a web browser, or open the folder in Visual Studio Code and launch `index.html` with the Live Server extension.
3. Select **Load notes** or submit the form to use the API.

An internet connection is required for requests to JSONPlaceholder. The page itself is static and has no package installation or build step.

## API Behavior and Limitations

The browser sends requests to `https://jsonplaceholder.typicode.com/posts`. It loads a maximum of 10 posts, sends new titles and bodies with POST, and sends DELETE requests for individual posts. JSONPlaceholder is a demonstration API: its simulated POST and DELETE operations return responses but do not permanently persist the created or deleted posts. The frontend also associates created posts with the fixed demo `userId` value `1`.

The implemented application includes GET, POST, and DELETE, title validation, request progress states, and success/error status messages. PUT and PATCH, authentication, a custom backend, and persistent storage are not implemented. The API, relational schema, and infrastructure in the documentation describe a proposed production design, not current application features.

## Documentation

- [API design](docs/api-design.md)
- [Data model](docs/data-model.md)
- [System architecture](docs/architecture.md)

## What I Learned

- REST methods communicate different operations: GET retrieves data, POST submits a new resource, and DELETE requests removal. A successful response from a demo API does not necessarily mean the change was saved permanently.
- Asynchronous JavaScript with `async`/`await` and Fetch API allows the interface to show progress while requests run, handle unsuccessful HTTP responses, and display useful status messages.
- Relational modeling uses primary keys, foreign keys, constraints, and junction tables to represent ownership and many-to-many relationships such as notes and tags.
- System architecture requires reasoning about traffic, storage, scaling, caching, reliability, and trade-offs in addition to designing endpoints.

## Future Improvements

Possible future enhancements include a persistent backend service, integration with a production database, user authentication and authorization, and automated tests for frontend behavior and API interactions.
