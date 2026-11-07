export function validateBody(schema) { return (req, res, next) => { const parsed = schema.safeParse(req.body); if (!parsed.success) {
    res.status(400).json({ message: parsed.error.issues.map(x => x.message).join(' ') });
    return;
} req.body = parsed.data; next(); }; }
