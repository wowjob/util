// update.ts
import type { TStyle } from '@wowjob/ui'
import { logDev } from '../../log'
import type { GenericSchema } from '@supabase/supabase-js/dist/module/lib/types'
import type { TDBProcess } from '../../type'
import { supabaseServiceRole } from '../service'
import { supabaseServer } from '../server'

export const dbUpdate = async <T>({
  table,
  id,
  data,
  dbProcess = 'server',
  schema = 'public',
}: {
  table: string
  schema?: any
  id: number | string
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
    const { data: updated, error } = await supabase
      .schema(schema)
      .from(table)
      .update(data)
      .eq('id', id)
      .select()

    if (error) {
      logDev({ log: error, name: `dbUpdate error db for ${table}` })
      return {
        message: [`Failed to update ${table}#${id}`, error.message],
        title: 'Error',
        theme: 'error',
      }
    }

    return {
      data: updated as T,
      message: `${table}#${id} updated successfully.`,
      title: 'Success',
      theme: 'success',
    }
  } catch (err: any) {
    logDev({ log: err, name: `dbUpdate exception for ${table}` })

    return {
      message: [`An exception occurred updating ${table}#${id}`, err.message],
      title: 'Error',
      theme: 'error',
    }
  }
}
