export const nestedValue = (path: string, obj: any) => {
  const names = path.split('.')
  let result = obj
  for (const name of names) {
    if (!result) {
      return result
    }

    result = result[name]
  }
  return result
}

export const generateGuid = () => {
  const S4 = () =>
    (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
  return (
    S4() +
    S4() +
    '-' +
    S4() +
    '-' +
    S4() +
    '-' +
    S4() +
    '-' +
    S4() +
    S4() +
    S4()
  )
}
