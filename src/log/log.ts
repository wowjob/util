export const logDev = ({
  log,
  name,
}: {
  log: unknown | unknown[]
  name: string
}) => {
  if (process.env.NODE_ENV === 'development') {
    console.log()
    console.log(`***** ${name} START *****`)

    const logList = Array.isArray(log) ? log : [log]
    for (const value of logList) {
      console.log(value)
    }
    console.log(`***** ${name} END *****`)
    console.log()
  }
}
