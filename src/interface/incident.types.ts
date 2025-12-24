import { ObjectId } from 'mongodb';

export type IncidentStatus = 'Open' | 'InProgress' | 'Resolved' | 'Closed';
export type IncidentSeverity = 'Low' | 'Medium' | 'High' | 'Critical';

export interface Incident {
  title: string;
  description: string;
  status: IncidentStatus;
  severity: IncidentSeverity;
  createdBy: ObjectId;
  createdDate?: Date;
  updatedDate?: Date;
}

export interface IncidentAttrs extends Incident {}
