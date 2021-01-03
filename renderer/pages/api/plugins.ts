import { NextApiRequest, NextApiResponse } from 'next';
import { pluginsGet } from '@studiorack/core';

export default async (_: NextApiRequest, res: NextApiResponse) => {
  const plugins = await pluginsGet();
  res.status(200).json(plugins);
};
