import type { TJSONForm } from '@wowjob/ui'

export function setFormDefaultFieldValue<
  T extends Partial<
    Record<string, string | number | readonly string[] | undefined>
  >
>(
  formDataStructure: TJSONForm['formStructure'],
  defaultValueMap?: T
): TJSONForm['formStructure'] {
  if (!defaultValueMap) return formDataStructure

  const fs = structuredClone(formDataStructure)

  for (const key of fs.list) {
    if (key in fs.data) {
      const field = fs.data[key]
      if (field?.defaultValue !== undefined) {
        const val = defaultValueMap[key]
        // TS knows val is string|number|string[]|undefined
        if (val !== undefined) {
          field.defaultValue = val
        }
      }
    }
  }

  return fs
}
