import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/*/student/",
          "/*/teacher/",
          "/*/premium/",
          "/*/subscription/",
          "/*/login",
          "/*/register",
          "/*/password-recovery",
          "/*/forgot-password",
          "/*/profile",
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
