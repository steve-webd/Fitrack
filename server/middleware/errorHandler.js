// Central error handler: turns database and parsing errors into clear JSON messages.
module.exports = (err, req, res, next) => {
  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: Object.values(err.errors).map((e) => e.message).join(', ') });
  }
  if (err.name === 'CastError') return res.status(400).json({ message: 'Invalid id or value' });
  if (err.code === 11000) return res.status(400).json({ message: 'An account with this email already exists' });
  if (err.type === 'entity.parse.failed') return res.status(400).json({ message: 'Request body is not valid JSON' });
  console.error(err);
  res.status(500).json({ message: 'Something went wrong on the server' });
};
