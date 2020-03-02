module.exports = [
	// Add support for native node modules
	{
		test: /\.node$/,
		use: 'node-loader'
	},
	{
		test: /\.(m?js|node)$/,
		parser: { amd: false },
		use: {
			loader: '@marshallofsound/webpack-asset-relocator-loader',
			options: {
				outputAssetBase: 'native_modules'
			}
		}
	},
	{
		test: /\.tsx?$/,
		exclude: /(node_modules|\.webpack)/,
		use: {
			loader: 'ts-loader',
			options: {
				transpileOnly: true
			}
		}
	},
	{
		test: /\.module\.s(a|c)ss$/,
		loader: [
			'style-loader',
			{
				loader: 'css-loader',
				options: {
					modules: true,
					sourceMap: true
				}
			},
			{
				loader: 'sass-loader',
				options: {
					sourceMap: true
				}
			}
		]
	},
	{
		test: /\.s(a|c)ss$/,
		exclude: /\.module.(s(a|c)ss)$/,
		loader: [
			'style-loader',
			'css-loader',
			{
				loader: 'sass-loader',
				options: {
					sourceMap: true
				}
			}
		]
	}
];
