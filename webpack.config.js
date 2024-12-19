const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
    optimization: {
        minimize: true,
        minimizer: [
            '...', // Để các plugin khác như TerserPlugin hoạt động bình thường
            new CssMinimizerPlugin({
                minimizerOptions: {
                    preset: [
                        'default',
                        {
                            discardComments: { removeAll: true }, // Xóa toàn bộ comment
                            normalizeUrl: false, // Ngăn chặn lỗi xử lý URL
                        },
                    ],
                },
            }),
        ],
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            url: false, // Vẫn giữ `url: false`
                        },
                    },
                ],
            },
        ],
    },
};
