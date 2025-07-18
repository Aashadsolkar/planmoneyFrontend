export default function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          extensions: ['.tsx', '.ts', '.js', '.json', '.jsx'],
          alias: {
            '@components': './components',
            '@hooks': './hooks',
            '@utils': './utils',
            '@api': './api',
            '@store': './store',
            '@constants': './constants',
            '@types': './types',
            '@context': './context',
          },
        },
      ],
    ],
  };
}
