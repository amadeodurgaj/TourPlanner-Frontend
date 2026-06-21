import { useState, useCallback } from 'react';

interface ValidationRule<T> {
  validate: (value: T) => boolean;
  message: string;
}

export function useFormValidation<T extends Record<string, any>>(
  rules: Partial<Record<keyof T, ValidationRule<T[keyof T]>[]>>
) {
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const validateField = useCallback((name: keyof T, value: T[keyof T]) => {
    const fieldRules = rules[name];
    if (!fieldRules) return true;

    for (const rule of fieldRules) {
      if (!rule.validate(value)) {
        setErrors(prev => ({ ...prev, [name]: rule.message }));
        return false;
      }
    }

    setErrors(prev => ({ ...prev, [name]: undefined }));
    return true;
  }, [rules]);

  const validateAll = useCallback((values: T) => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    let isValid = true;

    for (const [name, fieldRules] of Object.entries(rules)) {
      for (const rule of fieldRules as ValidationRule<any>[]) {
        if (!rule.validate(values[name as keyof T])) {
          newErrors[name as keyof T] = rule.message;
          isValid = false;
          break;
        }
      }
    }

    setErrors(newErrors);
    setTouched(Object.keys(values).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
    return isValid;
  }, [rules]);

  return { errors, touched, validateField, validateAll, setTouched };
}
