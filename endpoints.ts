import { createCrud } from '@qelos/plugin-play'
import { collections, EventDoc } from './services/db';
import { ObjectId } from 'mongodb';

const events = collections.events;

createCrud<EventDoc>({
  display: {
    name: 'event'
  },
  verify: async (req) => {
    return true;
  },
  readOne: (_id, { tenantPayload }) => events.findOne({ _id: new ObjectId(_id), tenant: tenantPayload.sub }),
  createOne: async (body, { user, tenantPayload }) => {
    const data: any = { ...body, user: user._id, tenant: tenantPayload.sub };
    const res = await events.insertOne(data);
    data._id = res.insertedId;
    return data;
  },
  readMany: async (query, { tenantPayload }) => {
    const dbQuery: any = { tenant: tenantPayload.sub };
    if (query.tags) {
      dbQuery.tags = query.tags
    }
    return events.find({ tenant: tenantPayload.sub }).toArray()
  },
  updateOne: async (_id, body: EventDoc, { user, tenantPayload }) => {
    await events.updateOne({
      _id: new ObjectId(_id),
      user: user._id,
      tenant: tenantPayload.sub
    }, { $set: body })
    return {
      ...body,
      _id
    };
  },
  deleteOne: async (_id, { user, tenantPayload }) => {
    const item = await events.findOne({
      _id: new ObjectId(_id),
      user: user._id,
      tenant: tenantPayload.sub
    })
    await events.deleteOne({
      _id: new ObjectId(_id),
      user: user._id,
      tenant: tenantPayload.sub
    });
    return item
  },
  schema: {
    title: {
      type: String,
      public: true
    },
    scheduledTo: {
      type: Date,
      public: true
    },
    description: {
      type: String,
      public: true
    },
    location: {
      type: {
        lat: Number,
        lng: Number,
        description: String
      },
      public: true
    },
    tags: {
      type: [String],
      public: true
    }
  },
  screens: {
    create: {
      structure: `
      <EditHeader>
        Create the event here
      </EditHeader>
      <FormRowGroup>
        <FormInput v-model="row.title" title="Title" />
        <FormInput v-model="row.description" title="Description" />
      </FormRowGroup>
      `
    },
    edit: {},
    list: {},
    view: {}
  }
})