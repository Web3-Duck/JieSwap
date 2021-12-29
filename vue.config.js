const path = require('path');
module.exports = {
    publicPath: './', //配置本地引用目录文件,如不配置，默认为`/`
    pluginOptions: {
        'style-resources-loader': {
            preProcessor: 'less',
            patterns: [path.resolve(__dirname, './src/assets/css/mixin.less')],
        },
    },
    css: {
        loaderOptions: {
            less: {
                // 若 less-loader 版本小于 6.0，请移除 lessOptions 这一级，直接配置选项。
                modifyVars: {
                    hack: `true; @import "${path.join(__dirname, './src/assets/css/vant.less')}"`,
                },
            },
        },
    },
};
