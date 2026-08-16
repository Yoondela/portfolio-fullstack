# ADR-002: PostgreSQL

## Status
Accepted

## Context
Persistent, relational storage is required for Projects, Features, and Screenshots with constraints, explicit ordering, timestamps, and publication state. Type safety and migrations are desired.

## Decision
Use PostgreSQL as the relational database for v1.

## Alternatives Considered
- SQLite (simpler local dev, limited concurrency)
- MySQL (similar capabilities but different ecosystem)
- NoSQL stores (not suitable for relational model and constraints)

## Tradeoffs
Gains: robust relational features, strong schema/migration support, proven production reliability. Costs: requires a managed or self-hosted DB, connection pooling considerations, and deployment configuration complexity compared to file-based stores.

## Consequences
Design schema with migrations and appropriate constraints/indexes. Plan for connection pooling in production and document provisioning/deployment choices. (Missing details: production hosting provider and pooling strategy to be decided during deployment planning.)
