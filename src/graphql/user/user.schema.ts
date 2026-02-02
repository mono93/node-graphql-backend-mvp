export const userTypeDefs = `
  type User {
    id: ID!
    name: String!
    email: String!
    userType: String!
    auth0Id: String!
    createdAt: String!
    incidents: [Incident!]!
  }

  type Query {
    user(id: ID!): User
    users(page: Int, limit: Int): [User!]!
    myDetails: User!
  }

  type Mutation {
    createUser(name: String!, email: String!, userType: String!, auth0Id: String!): User!
    updateUser(id: ID!, name: String, email: String, userType: String): User
    deleteUser(id: ID!): Boolean!
  }
`;
