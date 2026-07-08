import { COOKIE_NAME } from "@shared/const";
import { CMS_ADMIN_COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { blogRouter } from "./routers/blog";
import { mediaRouter } from "./routers/media";
import { categoriesRouter } from "./routers/categories";
import { contactRouter } from "./routers/contact";
import { z } from "zod";
import { ENV, ENV_FLAGS } from "./_core/env";

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    adminLogin: publicProcedure
      .input(
        z.object({
          email: z.string().email(),
          password: z.string().min(1),
        })
      )
      .mutation(({ ctx, input }) => {
        if (!ENV_FLAGS.isCmsAdminConfigured) {
          return {
            success: false,
            message: "Admin login is not configured on the server",
          } as const;
        }

        const emailMatches =
          input.email.trim().toLowerCase() === ENV.cmsAdminEmail.toLowerCase();
        const passwordMatches = input.password === ENV.cmsAdminPassword;

        if (!emailMatches || !passwordMatches) {
          return {
            success: false,
            message: "Invalid admin email or password",
          } as const;
        }

        ctx.res.cookie(CMS_ADMIN_COOKIE_NAME, ENV.cmsAdminPassword, {
          httpOnly: true,
          path: "/",
          sameSite: "lax",
          secure: ENV.isProduction,
          maxAge: 1000 * 60 * 60 * 12,
        });

        return {
          success: true,
        } as const;
      }),
    adminLogout: publicProcedure.mutation(({ ctx }) => {
      ctx.res.clearCookie(CMS_ADMIN_COOKIE_NAME, {
        httpOnly: true,
        path: "/",
        sameSite: "lax",
        secure: ENV.isProduction,
        maxAge: -1,
      });

      return {
        success: true,
      } as const;
    }),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      ctx.res.clearCookie(CMS_ADMIN_COOKIE_NAME, {
        httpOnly: true,
        path: "/",
        sameSite: "lax",
        secure: ENV.isProduction,
        maxAge: -1,
      });
      return {
        success: true,
      } as const;
    }),
  }),

  blog: blogRouter,
  media: mediaRouter,
  categories: categoriesRouter,
  contact: contactRouter,
});

export type AppRouter = typeof appRouter;
