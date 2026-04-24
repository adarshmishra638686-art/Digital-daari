import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { parse as parseCookie } from "cookie";
import { CMS_ADMIN_COOKIE_NAME } from "@shared/const";
import { ENV } from "./env";
import { sdk } from "./sdk";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    // Authentication is optional for public procedures.
    user = null;
  }

  if (!user) {
    const cookieHeader = opts.req.headers.cookie ?? "";
    const cookies = parseCookie(cookieHeader);
    const cmsCookieValue = cookies[CMS_ADMIN_COOKIE_NAME];

    if (cmsCookieValue && cmsCookieValue === ENV.cmsAdminPassword) {
      user = {
        id: -1,
        openId: "cms-temp-admin",
        name: "CMS Admin",
        email: ENV.cmsAdminEmail,
        loginMethod: "cms-temp",
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignedIn: new Date(),
      };
    }
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
