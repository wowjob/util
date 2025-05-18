// create.ts
import type { TStyle } from '@wowjob/ui'
import { logDev } from '../../log'
import type { GenericSchema } from '@supabase/supabase-js/dist/module/lib/types'
import type { TDBProcess } from '../../type'
import { supabaseServiceRole } from '../service'
import { supabaseServer } from '../server'

export const dbCreate = async <T>({
  data,
  table,
  dbProcess = 'server',
}: {
  table: string
  data: T
  dbProcess?: TDBProcess
}): Promise<{
  redirect?: string
  message: string | string[]
  title: string
  theme: TStyle['theme']
  data?: T
}> => {
  const supabase =
    dbProcess === 'build'
      ? await supabaseServiceRole<GenericSchema>()
      : await supabaseServer<GenericSchema>()

  const { id, ...rest } = data as any

  try {
    const { error, data } = await supabase
      .from(table)
      .insert(rest)
      .select()
      .single()

    if (error) {
      logDev({ log: [error, id], name: `dbCreate error db for ${table}` })

      return {
        message: [`Failed to create ${table}`, error.message],
        title: 'Error',
        theme: 'error' as TStyle['theme'],
      }
    }

    logDev({ log: data, name: `createItem success for ${table}` })

    return {
      redirect: `/${table}`,
      message: `${table} created successfully!`,
      title: 'Success',
      theme: 'success' as TStyle['theme'],
      data,
    }
  } catch (error) {
    logDev({ log: error, name: `createItem error for ${table}` })

    return {
      message: [
        `An error occurred while creating ${table}`,
        (error as Error).message,
      ],
      title: 'Error',
      theme: 'error' as TStyle['theme'],
    }
  }
}
