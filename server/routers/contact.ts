import { z } from "zod";
import { adminProcedure, publicProcedure, router } from "../_core/trpc";
import { createContactLead, listContactLeads } from "../db";

const createLeadSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(1, "Phone number is required"),
  email: z.string().email("Please enter a valid email address"),
  service: z.string().min(1, "Service is required"),
  message: z.string().optional(),
});

export const contactRouter = router({
  submit: publicProcedure
    .input(createLeadSchema)
    .mutation(async ({ input }) => {
      const lead = await createContactLead({
        ...input,
        message: input.message?.trim() || null,
      });

      return lead;
    }),

  list: adminProcedure
    .input(
      z.object({
        limit: z.number().default(20),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input }) => {
      return listContactLeads(input.limit, input.offset);
    }),
});