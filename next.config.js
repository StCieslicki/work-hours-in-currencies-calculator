/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            {
                source: '/calculator',
                destination: '/',
                permanent: false
            }
        ]
    }
}

module.exports = nextConfig
