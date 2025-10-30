export function required(value, msg = "Campo requerido") {
  return value ? null : msg;
}

export function minLength(value = "", len = 6, msg) {
  return value.length >= len ? null : (msg || `Mínimo ${len} caracteres`);
}

export function phoneMx(value = "", msg = "Teléfono inválido") {
  const clean = value.replace(/\D/g, "");
  return clean.length >= 10 ? null : msg;
}
