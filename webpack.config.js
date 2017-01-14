
module.exports = {
    entry: './public/app.jsx',
    output: {
        path: __dirname,
        filename: './client/js/bundle.js'
    },
    resolve: {
        root: __dirname,
        alias: {
          Stocks        : 'public/components/StocksComponent.jsx',
          NewStock      : 'public/components/NewStockComponent.jsx',
          StockInfo     : 'public/components/StockInfoComponent.jsx',
          ChartSettings : 'public/components/ChartSettingsComponent.jsx',
          StocksChart   : 'public/components/StocksChartComponent.jsx',
          CustomDatePicker: 'public/components/CustomDatePickerComponent.jsx'
        },
        extensions: ['','.js','.jsx']
    },
    module: {
        loaders: [
            {
                test: /\.js|.jsx?$/,
                exclude: /(node_modules)/,
                loader: "babel-loader",
                query:
                  {
                    presets:["react", "es2015", "stage-0"]
                  },
                plugins: ["transform-es2015-modules-simple-commonjs"]
            }
        ]
    }
};
