import { connectDB, disconnectDB } from '../config/db.js';
import { seedDatabase } from './seedData.js';

const runSeed = async () => {
  try {
    await connectDB();
    console.log('[Seed] Populating database with realistic agro-meteorological demo data...');
    const summary = await seedDatabase({ clearExisting: true });
    console.log('[Seed] Completed successfully:', summary);
    await disconnectDB();
    process.exit(0);
  } catch (error) {
    console.error('[Seed] Failed:', error);
    process.exit(1);
  }
};

runSeed();
