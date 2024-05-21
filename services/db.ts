import { Condition, MongoClient, ObjectId, ServerApiVersion } from 'mongodb';
import { logger } from '@qelos/plugin-play';

const uri = process.env.MONGODB_URL || 'mongodb://localhost/events-manager';

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
export const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  }
);

export interface EventDoc {
  title: string;
  scheduledTo: Date;
  description: string;
  location: {
    lat: number;
    lng: number;
    description: string;
  }
  tags: string[];
}

type Doc<T> = Omit<T, '_id'> & {
  _id?: Condition<ObjectId> | string;
}

export const collections = {
  events: client.db().collection<Doc<EventDoc>>('events'),
}

async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db().command({ ping: 1 });

    await collections.events.createIndex({ user: 1 });

    logger.log('Pinged your deployment. You successfully connected to MongoDB!');
  } finally {

  }
}

run().catch(process.exit);
