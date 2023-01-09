path = require('node:path');

module.exports = {
  packagerConfig: {
    icon: path.join(__dirname, '/assets/icons/icon.ico'),
    ignore: [
      'src-electron',
      'src-renderer',
      '.editorconfig',
      '.eslintignore',
      '.eslintrc.yml',
      '.gitattributes',
      '.gitignore',
      '.prettierrc.yml',
      'README.md',
      'tsconfig.base.json',
      'tsconfig.electron.json',
      'tsconfig.renderer.json',
    ],
  },
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'electron_quick_start',
        setupIcon: path.join(__dirname, './assets/icons/icon.ico'),
        iconUrl: path.join(__dirname, './assets/icons/icon.ico'),
      },
    },
  ],
};
