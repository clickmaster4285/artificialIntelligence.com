import type { NextConfig } from "next";

const isProduction = process.env.NODE_ENV === "production";

// React's development runtime reconstructs call stacks with eval().
// Production builds do not, so the production policy leaves it out.
const scriptSrc = isProduction
  ? "script-src 'self' 'unsafe-inline'"
  : "script-src 'self' 'unsafe-inline' 'unsafe-eval'";

const contentSecurityPolicy = [
  "default-src 'self'",
  scriptSrc,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "media-src 'self' blob:",
  "connect-src 'self' https://crm.clickmasters.pk",
  "worker-src 'self' blob:",
  "frame-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
].join("; ");

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: isProduction
      ? `${contentSecurityPolicy}; upgrade-insecure-requests`
      : contentSecurityPolicy,
  },
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), payment=(), usb=(), accelerometer=(), gyroscope=(), magnetometer=(), browsing-topics=()",
  },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
];

// Chrome honours HSTS delivered over http://localhost, which would pin the dev
// server to HTTPS and break local development.
if (isProduction) {
  securityHeaders.push({
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  });
}

const legacySections: { source: string; destination: string }[] = [
  { source: "/contact-us", destination: "/contact" },
  { source: "/privacy-policy", destination: "/privacy" },
  { source: "/software-solutions", destination: "/work" },
  { source: "/artificial-intelligence-ai", destination: "/ai-development" },
  { source: "/machine-learning-ml", destination: "/ai-development" },
  { source: "/nlp-computer-vision", destination: "/ai-development" },
  { source: "/case-studies", destination: "/work" },
  { source: "/projects", destination: "/work" },
  { source: "/solutions", destination: "/work" },
  { source: "/software-development", destination: "/work" },
  { source: "/web-development", destination: "/work" },
  { source: "/mobile-development", destination: "/work" },
  { source: "/design-ui-ux", destination: "/work" },
  { source: "/data-services", destination: "/work" },
  { source: "/cloud-and-devops", destination: "/work" },
  { source: "/testing-and-qa", destination: "/process" },
  { source: "/faq", destination: "/contact" },
];

const legacyRedirects = legacySections.flatMap(({ source, destination }) => [
  { source, destination, permanent: true },
  { source: `${source}/`, destination, permanent: true },
  { source: `${source}/:path*`, destination, permanent: true },
]);

const nextConfig: NextConfig = {
  async redirects() {
    return [
      ...legacyRedirects,
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "www.clickmastersartificialintelligencecompany.co.uk",
          },
        ],
        destination:
          "https://clickmastersartificialintelligencecompany.co.uk/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "www.clickmastersartificialintelligencecompany.com",
          },
        ],
        destination:
          "https://clickmastersartificialintelligencecompany.com/:path*",
        permanent: true,
      },
    ];
  },
  images: {
    // Cap the optimizer at 1080px. The default set includes 3840, and crawlers
    // download that largest src even when the photo is shown around 480px.
    deviceSizes: [640, 750, 828, 1080],
    imageSizes: [48, 64, 96, 128, 256, 384],
    qualities: [60, 75],
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
