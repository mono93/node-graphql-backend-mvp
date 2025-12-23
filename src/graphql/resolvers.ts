const resolvers = {
  Query: {
    hello: () => 'Hello from GraphQL Server!',
    user: (_: unknown, args: { id: string }) => ({
      id: args.id,
      name: 'John Doe',
      email: 'john@example.com',
    }),
  },
};

export { resolvers };
