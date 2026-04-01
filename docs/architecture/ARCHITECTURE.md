# Architecture Overview

## Design Goals

- Clean separation of concerns
- Scalable module boundaries
- Testability and maintainability
- Production-grade API practices

## Backend Layering

`Route -> Controller -> Service -> Repository -> Database`

### Responsibilities

- `Route`: endpoint registration and middleware chain
- `Controller`: request parsing and HTTP response mapping
- `Service`: business logic and transaction orchestration
- `Repository`: direct database interaction
- `Database`: persistence and constraints

## Core Modules

- `auth`
- `products`
- `customers`
- `sales`
- `reports`

## Transaction-Critical Flow

Sales creation must execute in one database transaction to guarantee consistency across:

- `Sales`
- `SaleItems`
- `Products` stock updates
- `Customers` total purchase updates
