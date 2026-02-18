/** @type {import('next').NextConfig} */
const nextConfig = {
    // Enable image domains if needed for Google profile pictures
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
            },
        ],
    },
};

export default nextConfig;
