import _ from 'lodash'

type Props = PropsWithChildren & {
  error: any
  path: string
  className?: string
}

const ErrorWrapper = ({ children, error, path, className }: Props) => {
  const message = _.get(error, path)

  return (
    <div className={className}>
      {children}
      {message && <p className="mt-2 text-xs text-red-600">{message}</p>}
    </div>
  )
}

export default ErrorWrapper
