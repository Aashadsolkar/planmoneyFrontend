import { validationRules } from './validationRules';

export const validateField = (field, value) => {
  
  const rules = validationRules[field];
  if (!rules) return null;

  for (let i = 0; i < rules.length; i++) {
    const { rule, message } = rules[i];
    if (!rule(value)) return message;
  }

  return null;
};

export const validateForm = (formData, isRegistor) => {
  const errors = {};
  for (const key in formData) {
    const error = validateField(key, formData[key]);
    if (error) errors[key] = error;
  }

  if(isRegistor){
    // Check if password and confirm password match
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
  }
  return errors;
};