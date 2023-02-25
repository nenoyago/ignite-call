import { prisma } from '@lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { buildNextAuthOptions } from '../auth/[...nextauth].api';

const timeIntervalsBodySchema = z.object({
  bio: z.string().min(3, { message: 'Mínimo de 3 caracteres' }).max(240, {
    message: 'Máximo de 240 caracteres'
  })
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'PUT') {
    return res.status(405).end();
  }

  const session = await getServerSession(
    req,
    res,
    buildNextAuthOptions(req, res)
  );

  if (!session) {
    return res.status(401).end();
  }

  const { bio } = timeIntervalsBodySchema.parse(req.body);

  await prisma.user.update({
    where: {
      id: session.user.id
    },
    data: {
      bio
    }
  });

  return res.status(204).end();
}
