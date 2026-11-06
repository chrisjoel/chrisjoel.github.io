import type { NextConfig } from "next";

// "export" builds plain static files into /out, which GitHub Pages and nginx can serve.
const nextConfig: NextConfig = { output: "export", images: { unoptimized: true } };
export default nextConfig;
