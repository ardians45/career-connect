import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '@/lib/auth-client';
import { db } from '@/lib/db';
import { savedRecommendation } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Since this is an API route, we need to handle the session differently
    // For this specific use case, we'll handle the authentication in the client side
    // and make this route work with server actions instead
    
    res.status(405).json({ message: 'Use server actions instead' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}