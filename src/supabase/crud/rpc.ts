// rpc.ts
import type { TStyle } from '@wowjob/ui'
import { supabaseServer } from 'supabase/server'
import type { GenericSchema } from '@supabase/supabase-js/dist/module/lib/types'
import { supabaseServiceRole } from 'supabase/service'
import type { TDBProcess } from '../../type'
import { logDev } from 'log'

export type TRpcResult<T> = {
  data?: T
  message: string | string[]
  title: string
  theme: TStyle['theme']
}

/**
 * Call any Postgres function via RPC.
 * @param fn     the function name (e.g. 'select_by_list_json')
 * @param paramList the object of arguments to pass to the function
 */
export const dbRpc = async <T = unknown>({
  fn,
  paramMap = {},
  dbProcess = 'server',
}: {
  fn: string
  paramMap: Record<string, unknown>
  dbProcess?: TDBProcess
}): Promise<TRpcResult<T>> => {
  // in prod use service role if you need to bypass RLS,
  // otherwise you can stick with supabaseServer() to respect the user's cookie
  const supabase =
    dbProcess === 'build'
      ? await supabaseServiceRole<GenericSchema>()
      : await supabaseServer<GenericSchema>()

  try {
    const { data, error } = await supabase.rpc(fn, paramMap)

    if (error) {
      logDev({ log: error, name: `dbRpc error calling ${fn}` })
      return {
        message: [`RPC ${fn} failed`, error.message],
        title: 'Error',
        theme: 'error',
      }
    }

    return {
      data: data as T,
      message: `RPC ${fn} succeeded`,
      title: 'Success',
      theme: 'success',
    }
  } catch (err: any) {
    logDev({ log: err, name: `dbRpc exception for ${fn}` })

    return {
      message: [`RPC ${fn} exception`, err.message],
      title: 'Error',
      theme: 'error',
    }
  }
}
