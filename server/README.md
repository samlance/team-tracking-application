# Backend Server

## Setup

```
cd server
npm install
```

## Run in development

```
npm run dev
```

## Run in production

```
npm start
```

## API Endpoints

- `GET    /api/items`         - List all items
- `GET    /api/items/:id`     - Get item by id
- `POST   /api/items`         - Create new item (JSON: { name, description })
- `PUT    /api/items/:id`     - Update item (JSON: { name, description })
- `DELETE /api/items/:id`     - Delete item 