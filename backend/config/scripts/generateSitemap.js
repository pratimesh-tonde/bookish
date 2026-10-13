// Generates frontend/public/sitemap.xml with every static route PLUS a real
// route for every book in the database. This is used by search engines to

require("dotenv").config();
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Book = require("../models/Book");

// Change this to your real deployed domain before deploying, or set it in your .env file as SITE_URL
const SITE_URL = process.env.SITE_URL || "https://www.example.com";

const staticRoutes = [
  { path: "/", priority: "1.0", changefreq: "daily" },
  { path: "/books", priority: "0.9", changefreq: "daily" },
  { path: "/login", priority: "0.3", changefreq: "yearly" },
  { path: "/signup", priority: "0.3", changefreq: "yearly" },
  { path: "/privacy", priority: "0.2", changefreq: "yearly" },
  { path: "/terms", priority: "0.2", changefreq: "yearly" },
];

const generate = async () => {
  await connectDB();

  const books = await Book.find().select("_id updatedAt");

  const urlEntries = [
    ...staticRoutes.map(
      (r) => `  <url>
    <loc>${SITE_URL}${r.path}</loc>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`
    ),
    ...books.map(
      (b) => `  <url>
    <loc>${SITE_URL}/books/${b._id}</loc>
    <lastmod>${b.updatedAt.toISOString().split("T")[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`
    ),
  ].join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>
`;

  const outPath = path.join(__dirname, "../../frontend/public/sitemap.xml");
  fs.writeFileSync(outPath, xml);
  console.log(`Sitemap written to ${outPath} with ${staticRoutes.length + books.length} URLs`);

  await mongoose.connection.close();
  process.exit(0);
};

generate().catch((err) => {
  console.error("Could not generate sitemap:", err);
  process.exit(1);
});