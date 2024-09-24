export default {
  plugins: {
    'postcss-import': {},
    '@csstools/postcss-global-data': {
      files: ['./src/app/styles/vars.css'],
    },
    'postcss-mixins': {
      mixinsFiles: ['./src/app/styles/mixins.css'],
    },
    'postcss-nested': {},
    'autoprefixer': {},
    'cssnano': {},
    'postcss-preset-env': {
      stage: 0,
      features: {
        'custom-media-queries': true,
        'custom-properties': true,
        'custom-selectors': true,
      },
    },
  },
}
