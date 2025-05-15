// get.ts
import type { TStyle } from '@wowjob/ui'
import { logDev } from '../../log'
import type { GenericSchema } from '@supabase/supabase-js/dist/module/lib/types'
import type { TDBProcess } from '../../type'
import { supabaseServiceRole } from '../service'
import { supabaseServer } from '../server'

export const dbGet = async <T>({
  table,
  id,
  dbProcess = 'server',
}: {
  table: string
  id: number
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
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      logDev({ log: error, name: `dbGet error db for ${table}` })

      return {
        message: [`Failed to fetch ${table}#${id}`, error.message],
        title: 'Error',
        theme: 'error',
      }
    }

    return {
      data: data as T,
      message: `${table}#${id} fetched successfully.`,
      title: 'Success',
      theme: 'success',
    }
  } catch (err: any) {
    logDev({ log: err, name: `dbGet exception for ${table}` })

    return {
      message: [`An exception occurred fetching ${table}#${id}`, err.message],
      title: 'Error',
      theme: 'error',
    }
  }
}
