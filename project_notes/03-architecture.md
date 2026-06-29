# 03-architecture   
  
  
# System Architecture  
  
## Suggested Stack  
  
Frontend:  
  
Next.js  
TypeScript  
Tailwind CSS  
  
  
Backend:  
Next.js API  
  
Reason:  
Good AI ecosystem  
  
  
Database:  
  
Convex   
  
  
AI:  
  
Google AI API  
  
Embeddings:  
pgvector  
  
  
Background jobs:  
  
Celery / Redis  
  
  
---  
  
## Architecture  
  
Frontend  
 |  
 |  
API Server  
 |  
 +---- Convex  
 |  
 +---- AI Service  
 |  
 +---- Job Collector  
  
  
---  
  
## Components  
  
## Web App  
  
Responsibilities:  
  
- authentication  
- dashboards  
- progress tracking  
  
  
## API  
  
Responsibilities:  
  
- users  
- jobs  
- analysis  
  
  
## AI Pipeline  
  
Responsibilities:  
  
- extract skills  
- compare skills  
- generate plans  
  
  
## Job Collector  
  
Responsibilities:  
  
- import job descriptions  
- normalize data  
