import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard/",
          "/api/",
          "/auth/",
          "/_next/",
          "/admin/",
        ],
      },
    ],
    sitemap: "https://webjoz.com/sitemap.xml",
  };
}
