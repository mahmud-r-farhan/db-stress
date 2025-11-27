# **db-stress cli tool**

A CLI tool to stress-test databases (MongoDB, PostgreSQL, MySQL) or APIs with dummy data inserts. Generates realistic dummy data using Faker.js and inserts it in batches for efficiency, letting you test DB or API performance under load.

----------

## **Features**

-   Supports **MongoDB**, **PostgreSQL**, and **MySQL** direct database testing.
    
-   Supports **API testing** via POST requests.
    
-   Batch processing to handle large data volumes without memory issues (default batch size: 1000).
    
-   Configurable concurrency for API mode (default: 10).
    
-   Auto-creates collections/tables if missing:
    
    -   MongoDB: `testdb.dummy`
        
    -   PostgreSQL: `users` table
    
    -   MySQL: `users` table
        
-   Realistic dummy data schema: `{ username, name, address, email, phone, created_at }`
    
-   Detailed metrics (`--metrics` flag) including p95 and p99 latency.
    
-   Fully interactive prompts or non-interactive mode via flags.
    
-   Progress logging during operations.
    
-   Supports up to **100,000 entries** with input validation.
    

----------

## **Installation**

```bash
npm install -g db-stress

```

----------

## **Usage**

Run interactively:

```bash
db-stress

```

Or non-interactively with flags:

### **Flags**

| Flag                     | Description                                         |                                           |
| ------------------------ | --------------------------------------------------- | ----------------------------------------- |
| `--mode <db `or` api>`                                               | Test mode (required for non-interactive). |
| `--db-type <mongo, pg, mysql>`                                                | Database type (for `db` mode).            |
| `--uri <string>`         | Database connection string.        |                                           |
| `--url <string>`         | API endpoint URL (must accept POST JSON body).      |                                           |
| `--amount <number>`      | Number of entries (1–100000).                       |                                           |
| `--batch-size <number>`  | Batch size for inserts/requests (default: 1000).    |                                           |
| `--concurrency <number>` | Max concurrent requests for API mode (default: 10). |                                           |
| `--metrics`              | Enable detailed metrics reporting.                     |                                           |
| `--help`                 | Show help.                                          |                                           |
| `--version`              | Show version.                                       |                                           |



----------

## **Sample Commands**

### **1. MongoDB Direct Test**

```bash
db-stress --mode db --db-type mongo --uri mongodb://localhost:27017 --amount 10000 --batch-size 2000 --metrics

```

### **2. PostgreSQL Direct Test**

```bash
db-stress --mode db --db-type pg --uri postgres://postgres:password@localhost:5432/testdb --amount 50000 --metrics

```

### **3. MySQL Direct Test**

```bash
db-stress --mode db --db-type mysql --uri mysql://user:password@localhost:3306/testdb --amount 50000 --metrics
```

### **4. API Test**

```bash
db-stress --mode api --url http://localhost:3000/users --amount 1000 --concurrency 5

```

----------

## **Metrics**

The tool reports:
- Total duration
- Success/Failed count
- Average latency
- p95 and p99 latency
- Rate (requests/sec)

----------

## **Schema**

The tool generates the following schema using Faker.js:

```json
{
  "username": "internet.userName",
  "name": "person.fullName",
  "address": "location.streetAddress",
  "email": "internet.email",
  "phone": "phone.number",
  "createdAt": "ISO Date"
}
```

----------


## **Performance & Scaling**

-   MongoDB (local):
    
    -   10k inserts ~5–15s
        
    -   50k inserts ~20–60s
        
    -   100k inserts ~40–120s
        
-   PostgreSQL (local):
    
    -   10k ~10–30s
        
    -   50k ~40–90s
        
    -   100k ~1–3 min
        
-   API: Depends on backend/network; concurrency 10 ~1–5s per 1000 requests.
    
-   **Tips:** For >100k entries, increase Node heap (`--max-old-space-size=4096`) and use cloud DB if needed.
    

----------

## **Recommended Setup**

-   **Local Dev:** Mongo/Postgres via Docker
    
-   **API Backend:** Express server with rate limiter & DB integration
    
-   **Production Testing:** Staged DB replicas, monitor with Prometheus for metrics
    

----------

## **Real-World Use Cases**

1.  Populate Dev/QA databases quickly
    
2.  Test API throughput & backend performance
    
3.  Validate batch insert logic
    
4.  CI/CD smoke testing
    
5.  Teaching/demo tool for workshops
    
6.  Preload cache or trigger indexing
    

----------

## **Limitations**

-   Not suitable for:
    
    -   Enterprise-grade benchmarking
        
    -   Distributed load testing
        
    -   Realistic traffic simulation
        
    -   Network stress testing >500–1000 req/sec
        
    -   Accurate DB bottleneck analysis
        

> Focus: Developer/QA lightweight load generator, not production-grade load testing.
