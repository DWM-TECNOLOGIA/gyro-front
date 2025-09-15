export const serialize = function (obj) {
  const str = []

  const serializeParam = (key, value) => {
    if (value === null || value === undefined) {
      return
    }

    if (Array.isArray(value)) {
      // Se for um array, adicione cada elemento com a mesma chave
      value.forEach((item) => {
        str.push(encodeURIComponent(key) + '=' + encodeURIComponent(item))
      })
    } else if (typeof value === 'object') {
      // Se for um objeto, serialize cada propriedade com notação de colchetes
      Object.entries(value).forEach(([subKey, subValue]) => {
        str.push(encodeURIComponent(`${key}[${subKey}]`) + '=' + encodeURIComponent(subValue))
      })
    } else {
      // Para valores simples, serialize normalmente
      str.push(encodeURIComponent(key) + '=' + encodeURIComponent(value))
    }
  }

  // Itera sobre as propriedades do objeto principal
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      serializeParam(key, obj[key])
    }
  }

  return str.length ? `?${str.join('&')}` : ''
}
