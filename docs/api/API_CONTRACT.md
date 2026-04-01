# API Contract (Draft)

Base URL (dev): `http://localhost:4000/api/v1`

## Auth

- `POST /register`
- `POST /login`

## Products

- `GET /products`
- `POST /products`
- `PUT /products/:id`
- `DELETE /products/:id`

## Customers

- `GET /customers`
- `POST /customers`

## Sales

- `POST /sales`
- `GET /sales`
- `GET /sales/:id`

## Reports

- `GET /reports/daily`
- `GET /reports/monthly`

## Response Standard

Success shape:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

Error shape:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": []
}
```
