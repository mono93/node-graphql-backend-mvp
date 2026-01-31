import mongoose from 'mongoose';
import { IncidentAttrs } from '../interface/incident.types';

interface IncidentDocument extends mongoose.Document, IncidentAttrs {}

/**
 * An interface that describes the properties
 * that an Incident Model has
 */
interface IncidentModel extends mongoose.Model<IncidentDocument> {
  build(attrs: IncidentAttrs): IncidentDocument;
}

const incidentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['Open', 'InProgress', 'Resolved', 'Closed'],
      default: 'Open',
      required: true,
    },
    severity: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    createdDate: {
      type: Date,
      default: Date.now,
    },
    updatedDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: {
      transform(doc, ret: any) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  },
);

incidentSchema.statics.build = (attrs: IncidentAttrs) => {
  return new Incident(attrs);
};

const Incident = mongoose.model<IncidentDocument, IncidentModel>('Incident', incidentSchema);

export { Incident };
