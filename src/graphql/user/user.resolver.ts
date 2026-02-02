import { authorizeUserAccess, Action } from '../../common/auth/auth';
import { IFormattedIncident, IIncident } from '../incident/incident.resolver';

export interface IUser {
  id: string;
  name: string;
  email: string;
  userType: string;
  auth0Id: string;
  createdDate: Date;
  incidents: IIncident[];
}

export interface IFormattedUser {
  id: string;
  name: string;
  email: string;
  userType: string;
  auth0Id: string;
  createdAt: string;
  incidents: IFormattedIncident[];
}

const formatUser = (doc: IUser): IFormattedUser => ({
  id: doc.id,
  name: doc.name,
  email: doc.email,
  userType: doc.userType,
  auth0Id: doc.auth0Id,
  createdAt: doc.createdDate.toISOString(),
  incidents: doc.incidents.map((incident) => ({
    id: incident.id,
    title: incident.title,
    description: incident.description,
    status: incident.status,
    severity: incident.severity,
    createdBy: incident.createdBy,
    updatedBy: incident.updatedBy,
    createdDate: incident.createdDate.toISOString(),
    updatedDate: incident.updatedDate ? incident.updatedDate.toISOString() : undefined,
  })),
});

export const userResolvers = {
  Query: {
    user: async (_: any, { id }: { id: string }, ctx: any) => {
      const authResult = await authorizeUserAccess(
        ctx.user,
        'READ' as Action,
        id,
        ctx.services.userService,
      );

      if (!authResult.allowed) {
        throw new Error(authResult.message);
      }

      const doc = await ctx.services.userService.getById(id);

      if (!doc) return null;

      return formatUser(doc);
    },

    users: async (_: any, { page, limit }: { page?: number; limit?: number }, ctx: any) => {
      const authResult = await authorizeUserAccess(ctx.user, 'READALL' as Action);

      if (!authResult.allowed) {
        throw new Error(authResult.message);
      }

      const pageNum = page || 1;
      const limitNum = limit || 10;

      const docs = await ctx.services.userService.getAll(pageNum, limitNum);

      return docs.map((doc: any) => formatUser(doc));
    },

    myDetails: async (_: any, __: any, ctx: any) => {
      const authResult = await authorizeUserAccess(
        ctx.user,
        'READ' as Action,
        ctx.user?.id,
        ctx.services.userService,
      );

      if (!authResult.allowed) {
        throw new Error(authResult.message);
      }

      const doc = await ctx.services.userService.getById(ctx.user.id);

      if (!doc) {
        throw new Error('User not found');
      }

      return formatUser(doc);
    },
  },

  Mutation: {
    createUser: async (
      _: any,
      {
        name,
        email,
        userType,
        auth0Id,
      }: { name: string; email: string; userType: string; auth0Id: string },
      ctx: any,
    ) => {
      const authResult = await authorizeUserAccess(ctx.user, 'CREATE' as Action);

      if (!authResult.allowed) {
        throw new Error(authResult.message);
      }

      let updatedBy: string = ctx.user?.id;

      const doc = await ctx.services.userService.create({
        name,
        email,
        userType,
        auth0Id,
        updatedBy,
      });

      return formatUser(doc);
    },

    updateUser: async (
      _: any,
      { id, name, userType }: { id: string; name?: string; email?: string; userType?: string },
      ctx: any,
    ) => {
      const authResult = await authorizeUserAccess(
        ctx.user,
        'UPDATE' as Action,
        id,
        ctx.services.userService,
      );

      if (!authResult.allowed) {
        throw new Error(authResult.message);
      }

      const updateData: any = {};
      if (name !== undefined) updateData.name = name;
      if (userType !== undefined) updateData.userType = userType;

      updateData.updatedBy = ctx.user?.id;

      const doc = await ctx.services.userService.update(id, updateData);

      if (!doc) return null;

      return formatUser(doc);
    },

    deleteUser: async (_: any, { id }: { id: string }, ctx: any) => {
      const authResult = await authorizeUserAccess(
        ctx.user,
        'DELETE' as Action,
        id,
        ctx.services.userService,
      );

      if (!authResult.allowed) {
        throw new Error(authResult.message);
      }

      await ctx.services.userService.delete(id);
      return true;
    },
  },
};
