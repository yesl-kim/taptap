type Props = {
  message?: string
}

const FieldError = ({ message }: Props) => {
  if (!message) return null

  return <p className="text-xs text-red-600">{message}</p>
}

export default FieldError
