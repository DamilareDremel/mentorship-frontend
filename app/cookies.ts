import { createCookie } from "@remix-run/node";

export const tokenCookie = createCookie("token", {
  path: "/",
  httpOnly: false, // you might have set this true, then you can't read it client-side
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
});
