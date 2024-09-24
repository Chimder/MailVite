module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {},
            },
          },
        ],
        type: 'css/auto',
      },
    ],
  },
}
