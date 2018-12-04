export default (webpackConfig) => {
  return {
    ...webpackConfig,
    resolve: {
      alias: {
        src: `${__dirname}/src`,
        components: 'src/components',
        utils: 'src/utils',
        routes: 'src/routes',
        layouts: 'src/layouts',
      },
    },
  };
};
