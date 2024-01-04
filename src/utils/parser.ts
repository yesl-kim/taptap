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
