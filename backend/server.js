import app from './src/app.js';
import { connectDB } from './src/config/db.js';
import { env } from './src/config/env.js';
import State from './src/models/State.js';
import { seedDatabase } from './src/seed/seedData.js';

const startServer = async () => {
  const { isInMemory } = await connectDB();

  const existingStates = await State.countDocuments();
  if (existingStates === 0) {
    console.log(
      `[Server] Database is empty (inMemory=${isInMemory}). Running initial demo seed...`
    );
    const seedResult = await seedDatabase({ clearExisting: false });
    console.log('[Server] Auto-seeded demo data:', seedResult);
  }

  app.listen(env.port, '0.0.0.0', () => {
    console.log(
      `[Server] Panchayat Weather Downscaling API listening on http://0.0.0.0:${env.port}`
    );
  });
};

startServer();
