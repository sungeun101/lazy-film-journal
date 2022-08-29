/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "i.ytimg.com",
      "m.media-amazon.com",
      "imdb-api.com",
      "www.themoviedb.org",
    ],
  },
};

module.exports = nextConfig;
