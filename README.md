# EnergyGrid Data Aggregator

This project is a client application that fetches telemetry data for 500 solar inverters from a mock EnergyGrid API while respecting strict API constraints like rate limiting, batching, and request signing.

---

## Problem Statement

The EnergyGrid API enforces the following rules:

- **Rate Limit:** 1 request per second (strict)
- **Batch Size:** Maximum 10 device serial numbers per request
- **Security:** Each request must include a valid MD5-based signature
- **Total Devices:** 500 solar inverters

The goal is to fetch data for all devices **reliably and safely**, without violating these constraints, and aggregate the results into a single report.

---

## Approach

1. **Serial Number Generation**
   - Generated 500 dummy serial numbers:  
     `SN-000` to `SN-499`

2. **Batching**
   - Split the 500 serial numbers into batches of 10  
   - Total API calls = 50

3. **Rate Limiting**
   - Ensured only **one request is sent per second**
   - Requests are sent sequentially to avoid `429 Too Many Requests`

4. **Request Signing**
   - For every request:
     - Generated a timestamp
     - Created a signature using:  
       `MD5(url + token + timestamp)`
     - Sent both as request headers

5. **Error Handling & Retries**
   - If a request fails (e.g. `429` or network issue):
     - Retry up to 3 times with a delay
     - Prevents crashes and infinite retries

6. **Aggregation**
   - Combined results from all batches into a single array

---

## Project Structure

project-root/
├── mock-api/              ← interviewer code (server)
└── energygrid-client/     ← my code (client)

energygrid-client/
│
├── src/
│ ├── apiClient.js # Handles signed API requests
│ ├── rateLimiter.js # Ensures 1 request per second
│ ├── aggregator.js # Batching, retries, aggregation
│ └── index.js # Application entry point
│
└── package.json


---

## Prerequisites

- Node.js v14 or higher
- npm
- Mock API server running locally

---

## How to Run

### 1. Start the Mock API Server

```bash
cd mock-api
npm install
npm start
```

### You should see below in terminal-1
```
⚡ EnergyGrid Mock API running on port 3000
Constraints: 1 req/sec, Max 10 items/batch
```

### 2. Run the Client Application

### In a new terminal:

```
cd energygrid-client
npm start
```

### Expected output:
```
Request 1/50
Request 2/50
...
Request 50/50
DONE
Total devices fetched: 500
```

