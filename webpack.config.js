module.exports = {
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            url: false, // Tắt xử lý URL để tránh lỗi với các đường dẫn chứa '/'
                        },
                    },
                ],
            },
        ],
    },
};
