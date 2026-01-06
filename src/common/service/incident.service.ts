class IncidentService {}

// ✅ Singleton instance
const incidentService = new IncidentService();

export default incidentService;

// ✅ Export the instance type for TS
export type IncidentServiceType = InstanceType<typeof IncidentService>;
