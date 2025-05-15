// list.ts
import type { TStyle } from '@wowjob/ui'
import { logDev } from 'log'
import { supabaseServer } from 'supabase/server'
import type { GenericSchema } from '@supabase/supabase-js/dist/module/lib/types'
import { supabaseServiceRole } from 'supabase/service'
import type { TDBProcess } from '../../type'

export const dbList = async <T>({
  table,
  limit = 6,
  dbProcess = 'server',
}: {
  table: string
  limit?: number
  dbProcess?: TDBProcess
}): Promise<{
  data?: T[]
  message: string | string[]
  title: string
  theme: TStyle['theme']
}> => {
  const supabase =
    dbProcess === 'build'
      ? await supabaseServiceRole<GenericSchema>()
      : await supabaseServer<GenericSchema>()

  try {
    let query = supabase.from(table).select('*')

    if (limit) {
      query = query.limit(limit)
    }

    const { data, error } = await query

    logDev({ log: data, name: `dbList DATAAAA db for ${table}` })

    if (error) {
      logDev({ log: error, name: `dbList error db for ${table}` })

      return {
        message: [`Failed to list from ${table}`, error.message],
        title: 'Error',
        theme: 'error' as TStyle['theme'],
        data: [],
      }
    }

    return {
      data: (data || []) as T[],
      message: `Successfully listed from ${table}`,
      title: 'Success',
      theme: 'success' as TStyle['theme'],
    }
  } catch (error) {
    logDev({ log: error, name: `listItem error for ${table}` })

    return {
      message: [
        `An error occurred while listing from ${table}`,
        (error as Error).message,
      ],
      title: 'Error',
      theme: 'error' as TStyle['theme'],
      data: [],
    }
  }
}
