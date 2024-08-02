/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@douyinfe/semi-ui', '@douyinfe/semi-icons', '@douyinfe/semi-illustrations'],
  images: {
    dangerouslyAllowSVG: true,
  },
};

export default nextConfig;
