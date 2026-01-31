import { authorizeIncidentAccess, Action } from '../../common/auth/auth';

export interface IIncident {
  id: string;
  title: string;
  description: string;
  status: string;
  severity: string;
  createdBy: string;
  createdDate: Date;
  updatedDate?: Date;
}

export interface IFormattedIncident {
  id: string;
  title: string;
  description: string;
  status: string;
  severity: string;
  createdBy: string;
  createdDate: string;
  updatedDate: string | undefined;
}

const formatIncident = (doc: IIncident): IFormattedIncident => ({
  id: doc.id,
  title: doc.title,
  description: doc.description,
  status: doc.status,
  severity: doc.severity,
  createdBy: doc.createdBy,
  createdDate: doc.createdDate.toISOString(),
  updatedDate: doc.updatedDate ? doc.updatedDate.toISOString() : undefined,
});

export const incidentResolvers = {
  Query: {
    incident: async (_: any, { id }: { id: string }, ctx: any) => {
      const authResult = await authorizeIncidentAccess(
        ctx.user,
        'READ' as Action,
        id,
        ctx.services.incidentService,
      );

      if (!authResult.allowed) {
        throw new Error(authResult.message);
      }

      const doc = await ctx.services.incidentService.getById(id);

      if (!doc) return null;

      return formatIncident(doc);
    },

    incidents: async (_: any, { page, limit }: { page?: number; limit?: number }, ctx: any) => {
      const authResult = await authorizeIncidentAccess(ctx.user, 'READ' as Action);

      if (!authResult.allowed) {
        throw new Error(authResult.message);
      }

      const pageNum = page || 1;
      const limitNum = limit || 10;

      const docs = await ctx.services.incidentService.listAll(pageNum, limitNum);

      return docs.map((doc: any) => formatIncident(doc));
    },

    myIncidents: async (_: any, { page, limit }: { page?: number; limit?: number }, ctx: any) => {
      if (!ctx.user) {
        throw new Error('Unauthenticated');
      }

      const pageNum = page || 1;
      const limitNum = limit || 10;

      const docs = await ctx.services.incidentService.list(ctx.user.id, pageNum, limitNum);

      return docs.map((doc: any) => formatIncident(doc));
    },
  },

  Mutation: {
    createIncident: async (
      _: any,
      { title, description, severity }: { title: string; description: string; severity: string },
      ctx: any,
    ) => {
      const authResult = await authorizeIncidentAccess(ctx.user, 'CREATE' as Action);

      if (!authResult.allowed) {
        throw new Error(authResult.message);
      }

      if (!ctx.user) {
        throw new Error('Unauthenticated');
      }

      const doc = await ctx.services.incidentService.create({
        title,
        description,
        severity,
        status: 'Open',
        createdBy: ctx.user.id,
      });

      return formatIncident(doc);
    },

    updateIncident: async (
      _: any,
      {
        id,
        title,
        description,
        status,
        severity,
      }: { id: string; title?: string; description?: string; status?: string; severity?: string },
      ctx: any,
    ) => {
      const authResult = await authorizeIncidentAccess(
        ctx.user,
        'UPDATE' as Action,
        id,
        ctx.services.incidentService,
      );

      if (!authResult.allowed) {
        throw new Error(authResult.message);
      }

      const updateData: any = {};
      if (title !== undefined) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      if (status !== undefined) updateData.status = status;
      if (severity !== undefined) updateData.severity = severity;
      updateData.updatedDate = new Date();

      const doc = await ctx.services.incidentService.update(id, updateData);

      if (!doc) return null;

      return formatIncident(doc);
    },

    deleteIncident: async (_: any, { id }: { id: string }, ctx: any) => {
      const authResult = await authorizeIncidentAccess(
        ctx.user,
        'DELETE' as Action,
        id,
        ctx.services.incidentService,
      );

      if (!authResult.allowed) {
        throw new Error(authResult.message);
      }

      await ctx.services.incidentService.delete(id);
      return true;
    },
  },
};
