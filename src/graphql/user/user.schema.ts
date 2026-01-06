export const userTypeDefs = `
  type User {
    id: ID!
    name: String!
    email: String!
    userType: String!
    createdAt: String!
  }

  type Query {
    user(id: ID!): User
    users: [User!]!
  }
`;
