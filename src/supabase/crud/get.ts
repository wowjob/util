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
  select,
  schema = 'public',
}: {
  table: string
  id: number
  dbProcess?: TDBProcess
  select?: string | string[]
  schema?: string
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

  const tableFieldSelector = Array.isArray(select)
    ? select.join(',')
    : select || '*'

  try {
    const { data, error } = await supabase
      .from(`${schema}.${table}`)
      .select(tableFieldSelector)
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

export const dbGetBy = async <T>({
  table,
  filterMap,
  dbProcess = 'server',
  multiple = false,
}: {
  table: string
  filterMap: Record<string, string | number>
  dbProcess?: TDBProcess
  multiple?: boolean
}): Promise<{
  data?: T | T[]
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
    Object.entries(filterMap).forEach(([key, value]) => {
      query = query.eq(key, value)
    })

    const { data, error } = multiple ? await query : await query.single()

    if (error) {
      logDev({ log: error, name: `dbGetBy error db for ${table}` })

      return {
        message: [
          `Failed to fetch ${table} by ${JSON.stringify(filterMap)}`,
          error.message,
        ],
        title: 'Error',
        theme: 'error',
      }
    }

    return {
      data: multiple ? (data as T[]) : (data as T),
      message: `${table} fetched successfully by ${JSON.stringify(filterMap)}.`,
      title: 'Success',
      theme: 'success',
    }
  } catch (err: any) {
    logDev({ log: err, name: `dbGetBy exception for ${table}` })

    return {
      message: [
        `An exception occurred fetching ${table} by ${JSON.stringify(
          filterMap
        )}`,
        err.message,
      ],
      title: 'Error',
      theme: 'error',
    }
  }
}
