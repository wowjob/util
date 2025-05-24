// remove.ts
import type { TStyle } from '@wowjob/ui'
import { logDev } from '../../log'
import type { GenericSchema } from '@supabase/supabase-js/dist/module/lib/types'
import type { TDBProcess } from '../../type'
import { supabaseServiceRole } from '../service'
import { supabaseServer } from '../server'

export const dbRemove = async ({
  table,
  id,
  dbProcess = 'server',
  schema = 'public',
}: {
  table: string
  schema?: any
  id: number | string
  dbProcess?: TDBProcess
}): Promise<{
  message: string | string[]
  title: string
  theme: TStyle['theme']
  redirect?: string
}> => {
  const supabase =
    dbProcess === 'build'
      ? await supabaseServiceRole<GenericSchema>()
      : await supabaseServer<GenericSchema>()

  try {
    const { error } = await supabase
      .schema(schema)
      .from(table)
      .delete()
      .eq('id', id)

    if (error) {
      logDev({ log: error, name: `dbRemove error db for ${table}` })
      return {
        message: [`Failed to delete ${table}#${id}`, error.message],
        title: 'Error',
        theme: 'error',
      }
    }

    return {
      message: `${table}#${id} deleted successfully.`,
      title: 'Success',
      theme: 'success',
      redirect: `/${table}`,
    }
  } catch (err: any) {
    logDev({ log: err, name: `dbRemove exception for ${table}` })

    return {
      message: [`An exception occurred deleting ${table}#${id}`, err.message],
      title: 'Error',
      theme: 'error',
    }
  }
}
