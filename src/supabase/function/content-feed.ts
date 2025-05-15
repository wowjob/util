// feed.ts
import type { TStyle } from '@wowjob/ui'
import { logDev } from '../../log'
import type { GenericSchema } from '@supabase/supabase-js/dist/module/lib/types'
import { supabaseServiceRole } from '../service'
import { supabaseServer } from '../server'
import type { TDBProcess } from '../../type'

type TFeedRow = {
  id: number
  title: string
  description: string
  slug: string
  updated_at: string
  source_table: string
}

export const dbContentFeed = async ({
  tableList,
  limit = 6,
  dbProcess = 'server',
}: {
  tableList: string[] // e.g. ['category','tag','content']
  limit?: number
  dbProcess?: TDBProcess
}): Promise<{
  data?: TFeedRow[]
  message: string | string[]
  title: string
  theme: TStyle['theme']
}> => {
  const supabase =
    dbProcess === 'build'
      ? await supabaseServiceRole<GenericSchema>()
      : await supabaseServer<GenericSchema>()

  try {
    const { data, error } = await supabase.rpc('content_feed', {
      list: tableList,
      p_limit: limit,
    })

    logDev({ log: data, name: `dbFeed DATA for ${tableList.join(',')}` })

    if (error) {
      logDev({ log: error, name: `dbFeed error for ${tableList.join(',')}` })
      return {
        message: [`Failed to fetch feed`, error.message],
        title: 'Error',
        theme: 'error',
        data: [],
      }
    }

    return {
      data: (data as TFeedRow[]) || [],
      message: `Successfully fetched feed`,
      title: 'Success',
      theme: 'success',
    }
  } catch (err) {
    logDev({ log: err, name: `dbFeed exception` })
    return {
      message: [
        `An error occurred while fetching feed`,
        (err as Error).message,
      ],
      title: 'Error',
      theme: 'error',
      data: [],
    }
  }
}
