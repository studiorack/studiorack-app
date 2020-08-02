import { NextApiRequest, NextApiResponse } from 'next'
import { getPlugins } from '../../lib/plugins'

export default async (_: NextApiRequest, res: NextApiResponse) => {
  const plugins = await getPlugins()
  res.status(200).json(plugins)
}
