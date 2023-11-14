## Getting Started

Requirements:
- Node.js (at least v16.14)
- PNPM
- Docker

To successfully run the project, follow the instructions:
- clone the project
- install dependencies
- make sure that Docker Desktop is runnning
- run: `COMPOSE_DOCKER_CLI_BUILD=1 DOCKER_BUILDKIT=1 docker compose build` 
- run: `docker compose up`
- open [http://localhost:3001](http://localhost:3001) with your browser to see the result

Note, you might need to update your Docker preferences: https://stackoverflow.com/questions/45122459/mounts-denied-the-paths-are-not-shared-from-os-x-and-are-not-known-to-docke

For better experience, using Next.js is highly recommended:
- clone the project
- install dependencies
- run: `pnpm run build` 
- run: `pnpm run start`
- open [http://localhost:3000](http://localhost:3000) with your browser to see the result

## Reasoning

When preparing to solve the task, I divided the problem into 3 smaller parts/subproblems with their own challenges:

1. Data fetching:
- storing large quantities of data
- data fetching from 3 different APIs
- different responses from different APIs that need to be combined together for seamless implementation to UI
- error handling - what if one of the requests fails?

2. Data sorting:
- data coming from different APIs can have different sorting methods
- not every API had each of the required sorting types/fields in response available
- how to effectively sort large lists of data
- how to sort by keyword when it's not always available?

3. Performance:
- efficient data management and storing
- complexity of sorting operations

## Improvements

While my goal was to create a fully functioning application, I acknowledge that there are things that could have been done better, so I came up with a list of possible improvements:

- for performance and smoother user experience, React server components features should be used more 
- instead of useState for filtering articles, saving filters’ state in url parameters could greatly benefit users (persisting and shareable with saved preferences)
- for performance optimization, React Query pagination would be a useful tool when working with thousands of articles
- API keys shouldn't be shared anywhere in the repository
- storing data with indexedDB instead of relying on local/session storage
- sorting articles is not as performant as it could be - could explore algorithmic sorting possibilities
