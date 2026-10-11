const validateLogin = (data) => {
  if (!data.email || typeof data.email !== 'string' || !data.email.trim()) {
    return { error: 'Email address is required.' };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email.trim())) {
    return { error: 'Please enter a valid email address.' };
  }
  if (!data.password || typeof data.password !== 'string') {
    return { error: 'Password is required.' };
  }
  return { error: null };
};

const validateRegister = (data) => {
  if (!data.name || typeof data.name !== 'string' || !data.name.trim()) {
    return { error: 'Full name is required.' };
  }
  const loginCheck = validateLogin(data);
  if (loginCheck.error) return loginCheck;

  if (data.password.length < 6) {
    return { error: 'Password must be at least 6 characters long.' };
  }
  if (data.role && !['Employee', 'Director', 'Accounts'].includes(data.role)) {
    return { error: 'Role must be Employee, Director, or Accounts.' };
  }
  return { error: null };
};

module.exports = { validateLogin, validateRegister };
