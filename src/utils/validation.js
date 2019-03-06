export const namePwdValidation = (username, password, pwdConfirm) => {
  const errors = {};
  if (!username) errors.username = 'Username is required';

  if (!password) errors.password = 'Password is required';

  if (pwdConfirm !== undefined && pwdConfirm !== password)
    errors.pwdConfirm = 'Passwords do Not match';

  return errors;
};
