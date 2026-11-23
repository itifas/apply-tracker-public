const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

/** @type {import('next').NextConfig} */
const nextConfig = isDemo
	? {
			// Static demo: plain HTML/JS files, data stored in the browser.
			output: "export",
			trailingSlash: true,
			images: { unoptimized: true },
			basePath: process.env.NEXT_PUBLIC_BASE_PATH || undefined,
		}
	: {};

export default nextConfig;
