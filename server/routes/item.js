import express from 'express';
const router = express.Router();

let items = [];
let nextId = 1;

// Get all items
router.get('/', (req, res) => {
  res.json(items);
});

// Get single item
router.get('/:id', (req, res) => {
  const item = items.find(i => i.id === parseInt(req.params.id));
  if (!item) return res.status(404).json({ message: 'Item not found' });
  res.json(item);
});

// Create item
router.post('/', (req, res) => {
  const { name, description } = req.body;
  const newItem = { id: nextId++, name, description };
  items.push(newItem);
  res.status(201).json(newItem);
});

// Update item
router.put('/:id', (req, res) => {
  const item = items.find(i => i.id === parseInt(req.params.id));
  if (!item) return res.status(404).json({ message: 'Item not found' });
  const { name, description } = req.body;
  item.name = name ?? item.name;
  item.description = description ?? item.description;
  res.json(item);
});

// Delete item
router.delete('/:id', (req, res) => {
  const index = items.findIndex(i => i.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: 'Item not found' });
  items.splice(index, 1);
  res.status(204).end();
});

export default router; 