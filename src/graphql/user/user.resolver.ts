export const userResolvers = {
  Query: {
    user: async (_: any, { id }: { id: string }, ctx: any) => {
      const doc = await ctx.services.userService.getById(id);

      if (!doc) return null;

      return {
        id: doc.id,
        name: doc.name,
        email: doc.email,
        userType: doc.userType,
        createdAt: doc.createdDate.toISOString(), // createdDate → createdAt
      };
    },

    users: async (_: any, __: any, ctx: any) => {
      const docs = await ctx.services.userService.getAll();

      return docs.map((doc: any) => ({
        id: doc.id,
        name: doc.name,
        email: doc.email,
        userType: doc.userType,
        createdAt: doc.createdDate.toISOString(),
      }));
    },
  },
};
