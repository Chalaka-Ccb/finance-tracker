// Get, create, update, delete transactions. All routes are protected by the authenticate middleware which validates the JWT and attaches req.user = { id, email }.
export async function getTransactions(req, res, next) {
  try {
    const { from, to, category_id, type } = req.query;
    const filters = { from, to, category_id, type };
    const data = await transactionService.findAll(req.user.id, filters);
    res.json(data);
  } catch (err) {
    next(err);
  }
}
// Get a single transaction by ID, ensuring it belongs to the authenticated user.
export async function getTransactionById(req, res, next) {
  try {
    const data = await transactionService.findById(req.user.id, req.params.id);
    res.json(data);
  } catch (err) {
    next(err);
  }
}
// Create a new transaction for the authenticated user. Expects { amount, date, category_id, type, description } in the request body.
export async function createTransaction(req, res, next) {
  try {
    const data = await transactionService.create(req.user.id, req.body);
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
}
// Update an existing transaction by ID, ensuring it belongs to the authenticated user. Expects { amount, date, category_id, type, description } in the request body.
export async function updateTransaction(req, res, next) {
  try {
    const data = await transactionService.update(req.user.id, req.params.id, req.body);
    res.json(data);
  } catch (err) {
    next(err);
  }
}
// Delete a transaction by ID, ensuring it belongs to the authenticated user.
export async function deleteTransaction(req, res, next) {
  try {
    await transactionService.remove(req.user.id, req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}