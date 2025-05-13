// update.ts
import type { TStyle } from '@wowjob/ui'
import { logDev } from '../../log'
import { supabaseServer } from 'supabase/server'
import type { GenericSchema } from '@supabase/supabase-js/dist/module/lib/types'

export const dbUpdate = async <T>({
  table,
  id,
  data,
}: {
  table: string
  id: number
  data: T
}): Promise<{
  data?: T
  message: string | string[]
  title: string
  theme: TStyle['theme']
}> => {
  const supabase = await supabaseServer<GenericSchema>()

  try {
    const { data: updated, error } = await supabase
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
