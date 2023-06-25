import { serverQueryContent } from "#content/server";
import { SitemapStream, streamToPromise } from "sitemap";
export default defineEventHandler(async (event) => {
    const docs = await serverQueryContent(event)
        .where({ listed: { $ne: false } })
        .find();
    const sitemap = new SitemapStream({
        hostname: "https://ajimoti.co",
    });
    for (const doc of docs) {
        if (doc._path !== "/resources/resources") {
            sitemap.write({
                url: doc._path?.replace("/articles", ""),
            });
        }
    }
    sitemap.write({
        url: "/resources",
    });
    sitemap.end();
    return streamToPromise(sitemap);
});
