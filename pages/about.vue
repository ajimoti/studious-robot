<template>
    <div>
        <keep-alive>
            <HeroSection>
                <template #content>
                    <img
                        :src="siteMetaInfo.author_image"
                        loading="lazy"
                        alt="me"
                        class="shadow-xl md:h-60 md:w-60 h-40 w-40 rounded-full hover:shadow-amber-700 hover:-translate-y-1 hover:shadow-2xl transition-all mr-10"
                    />
                </template>
            </HeroSection>
        </keep-alive>

        <div class="mt-10 w-full p-4 text-center bg-white sm:p-8">
            <h5 class="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
                Hi, I'm John Ajimoti Ibukunoluwa
            </h5>
            <p
                class="mb-5 text-base text-gray-500 sm:text-lg dark:text-gray-400"
            >
                I am a senior software developer with over 5 years of experience
                in building and deploying large-scale software applications. <br />
                Over the years, I have worked on several softwares for different industries, <br />
                ranging from hospitality to real estate, and finance.
            </p>
            <!-- <div
                class="items-center justify-center space-y-4 flex space-y-0 space-x-4"
            >
                <a
                    href="https://www.buymeacoffee.com/hlassiege"
                    target="_blank"
                    class="hover:-backdrop-hue-rotate-30 hover:-translate-y-1 transition-all"
                    ><img
                        src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
                        alt="Buy Me A Coffee"
                        style="
                            height: 60px !important;
                            width: 217px !important;
                        "
                /></a>
            </div> -->
        </div>
        <hr />

        <div class="px-4 mx-auto sm:px-6 xl:px-0 mt-10">
            <TimeLine />
        </div>
    </div>
</template>

<script setup lang="ts">
import HeroSection from "../components/HeroSection.vue";
import siteMetaInfo from "../data/siteMetaData";

useHead({
    title: "About | " + siteMetaInfo.title,
    meta: [
        {
            hid: "description",
            name: "description",
            content: "About me",
        },
        {
            hid: "og:description",
            name: "og:description",
            content: "About me",
        },
        { hid: "og:type", name: "og:type", content: "article" },
        { hid: "og:title", name: "og:title", content: "About me" },
        {
            hid: "og:url",
            name: "og:url",
            content: "https://ajimoti.com/about",
        },
        {
            hid: "og:image",
            name: "og:image",
            content: siteMetaInfo.author_image,
        },
        { name: "og:image:alt", content: siteMetaInfo.author_image },
        { name: "twitter:text:title", content: "About me" },
        {
            name: "twitter:image",
            content: siteMetaInfo.author_image,
        },
        { name: "twitter:card", content: "summary" },
    ],
    link: [{ rel: "canonical", href: "https://ajimoti.com/about" }],
});
</script>

<style lang="scss" scoped>
.clip-ellipse {
    clip-path: ellipse(60% 100% at 50% 0%);
    @apply bg-white;
    height: 100px;
    width: 100%;
}
</style>
