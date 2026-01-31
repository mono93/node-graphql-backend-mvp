export const incidentTypeDefs = `
  type Incident {
    id: ID!
    title: String!
    description: String!
    status: String!
    severity: String!
    createdBy: ID!
    createdDate: String!
    updatedDate: String
  }

  type Query {
    incident(id: ID!): Incident
    incidents(page: Int, limit: Int): [Incident!]!
    myIncidents(page: Int, limit: Int): [Incident!]!
  }

  type Mutation {
    createIncident(title: String!, description: String!, severity: String!): Incident!
    updateIncident(id: ID!, title: String, description: String, status: String, severity: String): Incident
    deleteIncident(id: ID!): Boolean!
  }
`;
