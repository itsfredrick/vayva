const BASE_URL = 'https://vayva.ng';
export default function robots() {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/checkout', '/cart', '/account', '/api/*'],
        },
        sitemap: `${BASE_URL}/sitemap.xml`,
    };
}
