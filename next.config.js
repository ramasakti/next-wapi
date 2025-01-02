/** @type {import('next').NextConfig} */
const path = require('path')

const nextConfig = {
	reactStrictMode: true,
	webpack: (config) => {
		config.resolve.alias['@'] = path.resolve(__dirname, '.');
		return config;
	},
	images: {
		remotePatterns: [
			{
				protocol: 'http',
				hostname: 'localhost',
				port: '8080',
				pathname: '/upload'
			},
			{
				protocol: 'https',
				hostname: 'i.ibb.co.com',
				port: '',
				pathname: '/**',
			},
		],
	},
}

module.exports = nextConfig