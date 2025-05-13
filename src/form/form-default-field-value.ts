import type { TJSONForm } from '@wowjob/ui'

export function setFormDefaultFieldValue<T extends Record<string, unknown>>(
  formDataStructure: TJSONForm['formStructure'],
  defaultValueMap?: T
): TJSONForm['formStructure'] {
  if (defaultValueMap) {
    const fs = structuredClone(formDataStructure)

    const dataMap = fs.data as Record<
      string,
      {
        defaultValue?: string | number | readonly string[] | undefined | boolean
      }
    >

    for (const key of Object.keys(defaultValueMap) as string[]) {
      if (key in dataMap) {
        const value = defaultValueMap[key]
        if (
          value === null ||
          (typeof value !== 'string' &&
            typeof value !== 'number' &&
            !(
              Array.isArray(value) &&
              value.every((item) => typeof item === 'string')
            ))
        ) {
          continue
        }
        dataMap[key].defaultValue = value as string | number | readonly string[]
      }
    }

    return fs
  }

  return formDataStructure
}
