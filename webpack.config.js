const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')//清理文件或文件夹插件
const  UglifyJSPlugin  = require( "uglifyjs-webpack-plugin" );
const path = require('path');

module.exports = {
    entry:"./src/index.tsx",//编译时的入口文件
    output: {//指定项目编译完时的输出文件
        path: path.resolve(__dirname, 'dist'),
        filename: "bundle.js"//编译完后的名字
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']//自动补齐文件后缀
    },
    optimization: {
        minimizer: [
        ]
    },
    module: {
        rules: [{//配置loader
            test: /\.tsx?$/,
            loader: 'awesome-typescript-loader',
            exclude: /node_modules/
        },
            {
        test: /\.css$/,
        use:['style-loader','css-loader']}
        ]
    },
    // 配置本地开发指令
    devtool: process.env.NODE_ENV === 'production' ? false : 'inline-source-map',//调试定位到代码
    devServer: {
        contentBase: './dist',//基于哪个文件夹做为根目录运行
        publicPath: '/dist',
        stats: 'errors-only',//启动本地服务后在控制台打印那些信息
        compress: false,//是否启动压缩
        host: 'localhost',
        port: 8889//端口
    },

    plugins: [//配置插件
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: ['./dist']//需要清理的路径
        }),
        new HtmlWebpackPlugin({
            template: './public/index.html'//编译时使用那个html文件为模板来编译
        })
    ]
}
