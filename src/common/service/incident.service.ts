import { Incident } from '../../interface/incident.types';
import { Incident as IncidentModel } from '../../models/incident';

class IncidentService {
  async create(
    incidentData: Omit<Incident, 'id' | 'createdDate' | 'updatedDate'>,
  ): Promise<Incident> {
    const { title, description, status, severity, createdBy, updatedBy } = incidentData;

    const incident = IncidentModel.build({
      title,
      description,
      status,
      severity,
      createdBy,
      updatedBy,
    });
    await incident.save();

    return incident;
  }

  async getById(id: string): Promise<Incident | null> {
    const incident = await IncidentModel.findById(id);
    return incident;
  }

  async list(userId: string, page: number = 1, limit: number = 10): Promise<Incident[]> {
    const skip = (page - 1) * limit;
    const incidents = await IncidentModel.find({ createdBy: userId })
      .skip(skip)
      .limit(limit)
      .sort({ createdDate: -1 });
    return incidents;
  }

  async listAll(page: number = 1, limit: number = 10): Promise<Incident[]> {
    const skip = (page - 1) * limit;
    const incidents = await IncidentModel.find().skip(skip).limit(limit).sort({ createdDate: -1 });
    return incidents;
  }

  async update(id: string, updateData: Partial<Incident>): Promise<Incident | null> {
    const incident = await IncidentModel.findByIdAndUpdate(id, updateData, { new: true });
    return incident;
  }

  async delete(id: string): Promise<void> {
    await IncidentModel.findByIdAndDelete(id);
  }

  async isOwner(userId: string, incidentId: string): Promise<boolean> {
    const incident = await IncidentModel.findById(incidentId);
    if (!incident) {
      return false;
    }
    return incident.createdBy.toString() === userId;
  }
}

// ✅ Singleton instance
const incidentService = new IncidentService();

export default incidentService;

// ✅ Export the instance type for TS
export type IncidentServiceType = InstanceType<typeof IncidentService>;
