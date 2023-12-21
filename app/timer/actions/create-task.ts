'use server'

export const createTask = async (data: FormData) => {
  console.log('createTask: ', data)
  console.log(data.get('category[id]'))
}
