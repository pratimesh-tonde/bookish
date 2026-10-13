export const isValidPincode = (value = "") => /^[1-9][0-9]{5}$/.test(value.trim());

export const isValidPhone = (value = "") => /^[6-9]\d{9}$/.test(value.trim());