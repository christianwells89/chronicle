/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  // Outputs a standalone javascript bundle that can be run directly with node, rather than doing
  // `yarn start`, in order to keep the image size down
  output: 'standalone',
};
