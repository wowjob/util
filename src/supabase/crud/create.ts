// create.ts
import type { TStyle } from '@wowjob/ui'
import { logDev } from '../../log'
import { supabaseServer } from 'supabase/server'
import type { GenericSchema } from '@supabase/supabase-js/dist/module/lib/types'

export const dbCreate = async <T>({
  data,
  table,
}: {
  table: string
  data: T
}): Promise<{
  redirect?: string
  message: string | string[]
  title: string
  theme: TStyle['theme']
}> => {
  const supabase = await supabaseServer<GenericSchema>()

  const { id, ...rest } = data as any

  try {
    const { error } = await supabase.from(table).insert(rest).select()

    if (error) {
      logDev({ log: [error, id], name: `dbCreate error db for ${table}` })

      return {
        message: [`Failed to create ${table}`, error.message],
        title: 'Error',
        theme: 'error' as TStyle['theme'],
      }
    }

    return {
      redirect: `/${table}`,
      message: `${table} created successfully!`,
      title: 'Success',
      theme: 'success' as TStyle['theme'],
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
