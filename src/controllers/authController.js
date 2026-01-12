exports.login = async (req, res) => {
  res.json({
    success: true,
    message: 'Login successful',
    user: { id: 1, name: 'Test User' }
  });
};

exports.register = async (req, res) => {
  res.json({
    success: true,
    message: 'Registration successful'
  });
};