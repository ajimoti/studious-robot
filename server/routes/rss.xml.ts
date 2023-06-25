import { serverQueryContent } from "#content/server";
import { Feed } from "feed";

export default defineEventHandler(async (event) => {
    const docs = await serverQueryContent(event)
        .where({ listed: { $ne: false } })
        .sort({ date: -1 })
        .find();

    const now = new Date();

    const feed = new Feed({
        title: "John Ibukun Ajimoti",
        description:
            "I am John, a software developer currently making life easier with tech.",
        id: "https://ajimoti.co",
        link: "https://ajimoti.co",
        favicon: "https://ajimoti.co/favicon.ico",
        copyright: `All rights reserved ${now.getFullYear()}, Eventually coding`,
        generator: "https://github.com/jpmonette/feed",
    });
    docs.forEach((post) => {
        if (post._path !== "/resources/resources") {
            const path = post._path?.replace("/articles", "");

            feed.addItem({
                title: post.title ?? "-",
                id: "https://ajimoti.co" + path,
                link: "https://ajimoti.co" + path,
                description: post.description,
                date: new Date(post.date),
                // image: post.img
            });
        }
    });

    event.res.setHeader("content-type", "text/xml");
    return feed.rss2();
});
