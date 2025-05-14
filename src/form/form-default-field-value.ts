import type { TJSONForm } from '@wowjob/ui'

export function setFormDefaultFieldValue<T extends Record<string, unknown>>(
  formDataStructure: TJSONForm['formStructure'],
  defaultValueMap?: T
): TJSONForm['formStructure'] {
  if (defaultValueMap) {
    const fs = structuredClone(formDataStructure)

    for (const key of fs.list) {
      if (key in fs.data) {
        fs.data[key].defaultValue = defaultValueMap[key]
      }
    }

    return fs
  }

  return formDataStructure
}
