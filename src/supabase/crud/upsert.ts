// upsert.ts
import type { TStyle } from '@wowjob/ui'
import { logDev } from '../../log'
import type { GenericSchema } from '@supabase/supabase-js/dist/module/lib/types'
import type { TDBProcess } from '../../type'
import { supabaseServiceRole } from '../service'
import { supabaseServer } from '../server'

export const dbUpsertByKey = async <T>({
  table,
  key,
  value,
  data,
  dbProcess = 'server',
  schema = 'public',
}: {
  table: string
  key: string
  schema?: any
  value: string | number
  data: T
  dbProcess?: TDBProcess
}): Promise<{
  data?: T
  message: string | string[]
  title: string
  theme: TStyle['theme']
}> => {
  const supabase =
    dbProcess === 'build'
      ? await supabaseServiceRole<GenericSchema>()
      : await supabaseServer<GenericSchema>()

  try {
    // merge the lookup key/value into the payload,
    // so .upsert knows which column to conflict on
    const payload = { ...data, [key]: value }

    const { data: out, error } = await supabase
      .schema(schema)
      .from(table)
      .upsert(payload, { onConflict: key })
      .select()
      .single()

    if (error) {
      logDev({ log: error, name: `dbUpsertByKey error for ${table}` })
      return {
        message: [
          `Failed to upsert into ${table} by ${key}=${value}`,
          error.message,
        ],
        title: 'Error',
        theme: 'error',
      }
    }

    return {
      data: out as T,
      message: `Upserted ${table}.${key}=${value} successfully.`,
      title: 'Success',
      theme: 'success',
    }
  } catch (err: any) {
    logDev({ log: err, name: `dbUpsertByKey exception for ${table}` })
    return {
      message: [
        `An exception occurred upserting into ${table} by ${key}=${value}`,
        err.message,
      ],
      title: 'Error',
      theme: 'error',
    }
  }
}
