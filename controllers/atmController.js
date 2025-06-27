export function procesarRetiro(monto, modo) {
  if (!Number.isInteger(monto) || monto <= 0 || monto % 100 !== 0) {
    return { error: '❌ El monto debe ser un número entero positivo y múltiplo de 100.' };
  }

  const modos = {
    eficiente: [1000, 500, 200, 100],
    '100-500': [500, 100],
    '200-1000': [1000, 200]
  };

  const denominaciones = modos[modo];
  if (!denominaciones) {
    return { error: '❌ Modo de dispensación inválido.' };
  }

  let restante = monto;
  const distribucion = {};
  for (let valor of denominaciones) {
    const cantidad = Math.floor(restante / valor);
    if (cantidad > 0) distribucion[valor] = cantidad;
    restante %= valor;
  }

  if (restante !== 0) {
    return { error: `❌ No se puede dispensar ${monto} con las denominaciones seleccionadas.` };
  }

  return {
    exito: true,
    monto,
    modo,
    distribucion,
    mensaje: `Se han entregado ${Object.values(distribucion).reduce((a, b) => a + b)} papeleta(s).`
  };
}
