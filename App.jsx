import React, { useState, useEffect, useMemo } from 'react';
import { Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Bar } from 'recharts';
import { TrendingUp, TrendingDown, Search, Bell, Settings, Activity, AlertCircle, Zap, ArrowUpRight, ArrowDownRight, BarChart3 } from 'lucide-react';

export default function StockForecastApp() {
  const [selectedStock, setSelectedStock] = useState('RELIANCE');
  const [timeframe, setTimeframe] = useState('1D');
  const [showPrediction, setShowPrediction] = useState(true);
  const [stockData, setStockData] = useState([]);
  const [activeTab, setActiveTab] = useState('sensex');
  const [chartType, setChartType] = useState('line');
  const [indicators, setIndicators] = useState({ 
    ma: true, 
    ema: false, 
    rsi: true, 
    bollinger: false
  });

  const [nifty50Stocks, setNifty50Stocks] = useState([
    { symbol: 'RELIANCE', name: 'Reliance Industries', price: 2456.75, change: 32.50, changePercent: 1.34 },
    { symbol: 'TCS', name: 'Tata Consultancy Services', price: 3542.80, change: -15.30, changePercent: -0.43 },
    { symbol: 'HDFCBANK', name: 'HDFC Bank', price: 1678.45, change: 21.75, changePercent: 1.31 },
    { symbol: 'INFY', name: 'Infosys', price: 1456.90, change: 18.60, changePercent: 1.29 },
    { symbol: 'ICICIBANK', name: 'ICICI Bank', price: 1089.35, change: -8.45, changePercent: -0.77 },
    { symbol: 'HINDUNILVR', name: 'Hindustan Unilever', price: 2387.60, change: 12.30, changePercent: 0.52 },
    { symbol: 'ITC', name: 'ITC Limited', price: 456.80, change: 5.60, changePercent: 1.24 },
    { symbol: 'SBIN', name: 'State Bank of India', price: 623.45, change: -4.20, changePercent: -0.67 },
    { symbol: 'BHARTIARTL', name: 'Bharti Airtel', price: 1234.50, change: 28.90, changePercent: 2.40 },
    { symbol: 'LT', name: 'Larsen & Toubro', price: 3456.75, change: 45.30, changePercent: 1.33 }
  ]);

  const [sensexStocks, setSensexStocks] = useState([
    { symbol: 'RELIANCE', name: 'Reliance Industries', price: 2456.75, change: 32.50, changePercent: 1.34 },
    { symbol: 'TCS', name: 'Tata Consultancy Services', price: 3542.80, change: -15.30, changePercent: -0.43 },
    { symbol: 'HDFCBANK', name: 'HDFC Bank', price: 1678.45, change: 21.75, changePercent: 1.31 },
    { symbol: 'INFY', name: 'Infosys', price: 1456.90, change: 18.60, changePercent: 1.29 },
    { symbol: 'ICICIBANK', name: 'ICICI Bank', price: 1089.35, change: -8.45, changePercent: -0.77 },
    { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank', price: 1789.60, change: 15.80, changePercent: 0.89 },
    { symbol: 'HINDUNILVR', name: 'Hindustan Unilever', price: 2387.60, change: 12.30, changePercent: 0.52 },
    { symbol: 'ITC', name: 'ITC Limited', price: 456.80, change: 5.60, changePercent: 1.24 },
    { symbol: 'SBIN', name: 'State Bank of India', price: 623.45, change: -4.20, changePercent: -0.67 },
    { symbol: 'BHARTIARTL', name: 'Bharti Airtel', price: 1234.50, change: 28.90, changePercent: 2.40 }
  ]);

  const [indexData, setIndexData] = useState({
    nifty: { value: 19674.25, change: 145.30, changePercent: 0.74 },
    sensex: { value: 65953.48, change: 234.12, changePercent: 0.36 }
  });

  const stocks = activeTab === 'nifty' ? nifty50Stocks : sensexStocks;
  const currentStock = stocks.find(s => s.symbol === selectedStock) || stocks[0];

  // Real-time price updates every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setNifty50Stocks(prev => prev.map(stock => {
        const volatility = 0.002;
        const change = (Math.random() - 0.5) * stock.price * volatility;
        const newPrice = stock.price + change;
        const newChange = stock.change + change;
        const newChangePercent = (newChange / (newPrice - newChange)) * 100;
        
        return {
          ...stock,
          price: parseFloat(newPrice.toFixed(2)),
          change: parseFloat(newChange.toFixed(2)),
          changePercent: parseFloat(newChangePercent.toFixed(2))
        };
      }));

      setSensexStocks(prev => prev.map(stock => {
        const volatility = 0.002;
        const change = (Math.random() - 0.5) * stock.price * volatility;
        const newPrice = stock.price + change;
        const newChange = stock.change + change;
        const newChangePercent = (newChange / (newPrice - newChange)) * 100;
        
        return {
          ...stock,
          price: parseFloat(newPrice.toFixed(2)),
          change: parseFloat(newChange.toFixed(2)),
          changePercent: parseFloat(newChangePercent.toFixed(2))
        };
      }));

      setIndexData(prev => ({
        nifty: {
          value: parseFloat((prev.nifty.value + (Math.random() - 0.5) * 10).toFixed(2)),
          change: parseFloat((prev.nifty.change + (Math.random() - 0.5) * 2).toFixed(2)),
          changePercent: parseFloat((prev.nifty.changePercent + (Math.random() - 0.5) * 0.05).toFixed(2))
        },
        sensex: {
          value: parseFloat((prev.sensex.value + (Math.random() - 0.5) * 20).toFixed(2)),
          change: parseFloat((prev.sensex.change + (Math.random() - 0.5) * 3).toFixed(2)),
          changePercent: parseFloat((prev.sensex.changePercent + (Math.random() - 0.5) * 0.05).toFixed(2))
        }
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const calculateRSI = (prices, period = 14) => {
    if (prices.length < period) return 50;
    let gains = 0;
    let losses = 0;
    
    for (let i = prices.length - period; i < prices.length; i++) {
      const change = prices[i] - prices[i - 1];
      if (change > 0) gains += change;
      else losses -= change;
    }
    
    const avgGain = gains / period;
    const avgLoss = losses / period;
    const rs = avgGain / (avgLoss || 0.01);
    return 100 - (100 / (1 + rs));
  };

  // Generate initial historical data
  useEffect(() => {
    const generateData = () => {
      const data = [];
      const basePrice = currentStock.price;
      const days = timeframe === '1D' ? 390 : timeframe === '1W' ? 35 : timeframe === '1M' ? 30 : 365;
      const interval = timeframe === '1D' ? 'min' : 'day';
      const prices = [];
      
      for (let i = days; i >= 0; i--) {
        const variance = (Math.random() - 0.5) * (basePrice * 0.015);
        const trend = (days - i) * 0.008;
        const price = basePrice + variance + trend;
        prices.push(price);
        
        const volume = Math.floor(Math.random() * 5000000) + 1000000;
        const rsi = calculateRSI(prices);
        
        const ma20 = prices.length >= 20 ? prices.slice(-20).reduce((a, b) => a + b) / 20 : price;
        const ma50 = prices.length >= 50 ? prices.slice(-50).reduce((a, b) => a + b) / 50 : price;
        
        const sma = ma20;
        const variance20 = prices.length >= 20 ? prices.slice(-20).reduce((sum, p) => sum + Math.pow(p - sma, 2), 0) / 20 : 0;
        const stdDev = Math.sqrt(variance20);
        const upperBand = sma + (2 * stdDev);
        const lowerBand = sma - (2 * stdDev);
        
        const volatility = basePrice * 0.005;
        const open = price + (Math.random() - 0.5) * volatility;
        const close = price;
        const high = Math.max(open, close) + Math.random() * volatility * 0.5;
        const low = Math.min(open, close) - Math.random() * volatility * 0.5;
        
        data.push({
          time: interval === 'min' ? `${Math.floor((390 - i) / 60)}:${((390 - i) % 60).toString().padStart(2, '0')}` : `Day ${days - i}`,
          price: parseFloat(price.toFixed(2)),
          open: parseFloat(open.toFixed(2)),
          high: parseFloat(high.toFixed(2)),
          low: parseFloat(low.toFixed(2)),
          close: parseFloat(close.toFixed(2)),
          volume: volume,
          ma20: parseFloat(ma20.toFixed(2)),
          ma50: parseFloat(ma50.toFixed(2)),
          ema: parseFloat((price * 0.99).toFixed(2)),
          rsi: parseFloat(rsi.toFixed(2)),
          upperBand: parseFloat(upperBand.toFixed(2)),
          lowerBand: parseFloat(lowerBand.toFixed(2))
        });
      }

      // Add prediction
      if (showPrediction) {
        const lastPrice = data[data.length - 1].price;
        const trendDirection = currentStock.change >= 0 ? 1 : -1;
        for (let i = 1; i <= 15; i++) {
          const predictedPrice = lastPrice * (1 + (trendDirection * 0.001 * i) + (Math.random() * 0.005 - 0.0025));
          data.push({
            time: interval === 'min' ? `+${i}min` : `+${i}d`,
            price: null,
            predicted: parseFloat(predictedPrice.toFixed(2)),
            volume: 0,
            isPrediction: true
          });
        }
      }

      return data;
    };

    setStockData(generateData());
  }, [selectedStock, timeframe, showPrediction, currentStock.price, currentStock.change]);

  // Real-time chart updates (only for 1D timeframe)
  useEffect(() => {
    if (timeframe !== '1D') return;

    const interval = setInterval(() => {
      setStockData(prev => {
        const filteredData = prev.filter(d => !d.isPrediction);
        if (filteredData.length === 0) return prev;

        const lastPoint = filteredData[filteredData.length - 1];
        const newPrice = lastPoint.price + (Math.random() - 0.5) * currentStock.price * 0.001;
        const volatility = currentStock.price * 0.002;
        
        const open = newPrice + (Math.random() - 0.5) * volatility;
        const close = newPrice;
        const high = Math.max(open, close) + Math.random() * volatility * 0.5;
        const low = Math.min(open, close) - Math.random() * volatility * 0.5;
        
        const newPoint = {
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
          price: parseFloat(newPrice.toFixed(2)),
          open: parseFloat(open.toFixed(2)),
          high: parseFloat(high.toFixed(2)),
          low: parseFloat(low.toFixed(2)),
          close: parseFloat(close.toFixed(2)),
          volume: Math.floor(Math.random() * 5000000) + 1000000,
          ma20: lastPoint.ma20,
          ma50: lastPoint.ma50,
          ema: lastPoint.ema,
          rsi: lastPoint.rsi
        };

        const updatedData = [...filteredData.slice(-100), newPoint];

        // Add live prediction
        if (showPrediction) {
          const trendDirection = currentStock.change >= 0 ? 1 : -1;
          for (let i = 1; i <= 15; i++) {
            const predictedPrice = newPrice * (1 + (trendDirection * 0.001 * i) + (Math.random() * 0.005 - 0.0025));
            updatedData.push({
              time: `+${i}min`,
              price: null,
              predicted: parseFloat(predictedPrice.toFixed(2)),
              volume: 0,
              isPrediction: true
            });
          }
        }

        return updatedData;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [timeframe, currentStock.price, currentStock.change, showPrediction]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-xl">
          <p className="text-gray-400 text-xs mb-2">{data.time}</p>
          {data.isPrediction ? (
            <p className="text-purple-400 font-semibold">Predicted: ₹{data.predicted}</p>
          ) : chartType === 'candle' ? (
            <>
              <p className="text-white font-semibold text-xs mb-1">OHLC Data:</p>
              <p className="text-blue-400 text-xs">Open: ₹{data.open}</p>
              <p className="text-green-400 text-xs">High: ₹{data.high}</p>
              <p className="text-red-400 text-xs">Low: ₹{data.low}</p>
              <p className="text-white text-xs">Close: ₹{data.close}</p>
            </>
          ) : (
            <>
              <p className="text-white font-semibold">Price: ₹{data.price}</p>
              {data.high && <p className="text-green-400 text-xs">High: ₹{data.high}</p>}
              {data.low && <p className="text-red-400 text-xs">Low: ₹{data.low}</p>}
            </>
          )}
        </div>
      );
    }
    return null;
  };

  const stats = useMemo(() => {
    if (stockData.length === 0) return { high: 0, low: 0, avg: 0, volatility: 0, rsi: 50, trend: 'neutral' };
    const realData = stockData.filter(d => !d.isPrediction && d.price);
    const prices = realData.map(d => d.price);
    const high = Math.max(...prices);
    const low = Math.min(...prices);
    const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
    const volatility = ((high - low) / avg * 100).toFixed(2);
    const lastRSI = realData[realData.length - 1]?.rsi || 50;
    
    let trend = 'neutral';
    if (prices[prices.length - 1] > prices[0]) trend = 'bullish';
    else if (prices[prices.length - 1] < prices[0]) trend = 'bearish';
    
    return { high, low, avg, volatility, rsi: lastRSI, trend };
  }, [stockData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
      <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                  Indian Stock Pro
                </span>
              </div>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search Indian stocks..."
                  className="bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 w-64 focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>

              <div className="flex items-center gap-4 bg-gray-800/50 rounded-lg px-3 py-2">
                <div className="text-center">
                  <div className="text-xs text-gray-400">NIFTY 50</div>
                  <div className={`font-bold text-sm ${indexData.nifty.changePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {indexData.nifty.value.toFixed(2)} {indexData.nifty.changePercent >= 0 ? '▲' : '▼'} {Math.abs(indexData.nifty.changePercent).toFixed(2)}%
                  </div>
                </div>
                <div className="w-px h-8 bg-gray-700"></div>
                <div className="text-center">
                  <div className="text-xs text-gray-400">SENSEX</div>
                  <div className={`font-bold text-sm ${indexData.sensex.changePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {indexData.sensex.value.toFixed(2)} {indexData.sensex.changePercent >= 0 ? '▲' : '▼'} {Math.abs(indexData.sensex.changePercent).toFixed(2)}%
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center font-semibold">
                IN
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-3 space-y-4">
            <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-5">
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setActiveTab('nifty')}
                  className={`flex-1 py-2 rounded-lg font-semibold text-sm transition-all ${
                    activeTab === 'nifty' ? 'bg-orange-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  NIFTY 50
                </button>
                <button
                  onClick={() => setActiveTab('sensex')}
                  className={`flex-1 py-2 rounded-lg font-semibold text-sm transition-all ${
                    activeTab === 'sensex' ? 'bg-orange-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  SENSEX
                </button>
              </div>
              <h3 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wide">Top Stocks</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {stocks.map(stock => (
                  <button
                    key={stock.symbol}
                    onClick={() => setSelectedStock(stock.symbol)}
                    className={`w-full p-3 rounded-xl transition-all ${
                      selectedStock === stock.symbol
                        ? 'bg-orange-600/20 border border-orange-500/50'
                        : 'bg-gray-800/50 border border-gray-700/50 hover:bg-gray-800'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <div className="font-bold text-left">{stock.symbol}</div>
                        <div className="text-xs text-gray-500 text-left truncate max-w-32">{stock.name}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">₹{stock.price.toFixed(2)}</div>
                        <div className={`text-xs flex items-center gap-1 justify-end ${
                          stock.change >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {stock.change >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                          {Math.abs(stock.changePercent).toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wide flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                Technical Indicators
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">RSI (14)</span>
                  <span className={`font-bold text-sm ${
                    stats.rsi > 70 ? 'text-red-400' : stats.rsi < 30 ? 'text-green-400' : 'text-yellow-400'
                  }`}>
                    {stats.rsi.toFixed(0)} {stats.rsi > 70 ? 'Overbought' : stats.rsi < 30 ? 'Oversold' : 'Neutral'}
                  </span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all ${
                      stats.rsi > 70 ? 'bg-red-500' : stats.rsi < 30 ? 'bg-green-500' : 'bg-yellow-500'
                    }`}
                    style={{ width: `${stats.rsi}%` }}
                  ></div>
                </div>
                
                <div className="pt-3 border-t border-gray-800">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">Market Trend</span>
                    <span className={`font-bold text-sm flex items-center gap-1 ${
                      stats.trend === 'bullish' ? 'text-green-400' : stats.trend === 'bearish' ? 'text-red-400' : 'text-gray-400'
                    }`}>
                      {stats.trend === 'bullish' && <TrendingUp className="w-4 h-4" />}
                      {stats.trend === 'bearish' && <TrendingDown className="w-4 h-4" />}
                      {stats.trend.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-800">
                  <div className="text-sm text-gray-400 mb-2">Day Stats</div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <div className="text-xs text-gray-500">High</div>
                      <div className="text-green-400 font-semibold text-sm">₹{stats.high.toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Low</div>
                      <div className="text-red-400 font-semibold text-sm">₹{stats.low.toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Avg</div>
                      <div className="text-blue-400 font-semibold text-sm">₹{stats.avg.toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Volatility</div>
                      <div className="text-purple-400 font-semibold text-sm">{stats.volatility}%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-600/20 to-red-600/20 backdrop-blur-xl border border-orange-500/30 rounded-2xl p-5">
              <AlertCircle className="w-8 h-8 text-orange-400 mb-3" />
              <h3 className="font-bold mb-2">AI Market Analysis</h3>
              <p className="text-sm text-gray-300 mb-3">
                {stats.trend === 'bullish' 
                  ? 'Strong bullish momentum detected. Good time for long positions.' 
                  : stats.trend === 'bearish'
                  ? 'Bearish pressure observed. Consider defensive strategies.'
                  : 'Market consolidating. Wait for clear direction.'}
              </p>
              <div className="flex items-center justify-between text-xs">
                <span className="text-orange-400">Confidence: 89%</span>
                <span className="text-gray-400">Live Updates ●</span>
              </div>
            </div>
          </div>

          <div className="col-span-9 space-y-4">
            <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-6">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h2 className="text-3xl font-bold">{currentStock.symbol}</h2>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        currentStock.change >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {currentStock.change >= 0 ? '+' : ''}₹{currentStock.change.toFixed(2)} ({currentStock.changePercent.toFixed(2)}%)
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm">{currentStock.name}</p>
                  </div>
                  <div className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                    ₹{currentStock.price.toFixed(2)}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex bg-gray-800 rounded-lg p-1 gap-1">
                    <button
                      onClick={() => setChartType('line')}
                      className={`px-3 py-2 rounded-md text-sm font-semibold transition-all flex items-center gap-2 ${
                        chartType === 'line' ? 'bg-orange-600 text-white' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      <Activity className="w-4 h-4" />
                      Line
                    </button>
                    <button
                      onClick={() => setChartType('candle')}
                      className={`px-3 py-2 rounded-md text-sm font-semibold transition-all flex items-center gap-2 ${
                        chartType === 'candle' ? 'bg-orange-600 text-white' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      <BarChart3 className="w-4 h-4" />
                      Candles
                    </button>
                  </div>

                  <div className="flex bg-gray-800 rounded-lg p-1">
                    {['1D', '1W', '1M', '1Y'].map(tf => (
                      <button
                        key={tf}
                        onClick={() => setTimeframe(tf)}
                        className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${
                          timeframe === tf ? 'bg-orange-600 text-white' : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        {tf}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setShowPrediction(!showPrediction)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                      showPrediction ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    <Zap className="w-4 h-4" />
                    AI Forecast
                  </button>
                </div>
              </div>

              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === 'line' ? (
                    <ComposedChart data={stockData}>
                      <defs>
                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                      <XAxis 
                        dataKey="time" 
                        stroke="#6b7280" 
                        tick={{ fill: '#9ca3af', fontSize: 11 }}
                        interval="preserveStartEnd"
                      />
                      <YAxis 
                        stroke="#6b7280" 
                        tick={{ fill: '#9ca3af', fontSize: 11 }}
                        domain={['auto', 'auto']}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Area 
                        type="monotone" 
                        dataKey="price" 
                        stroke="#f97316" 
                        strokeWidth={2.5}
                        fill="url(#colorPrice)" 
                      />
                      {indicators.ma && (
                        <>
                          <Line 
                            type="monotone" 
                            dataKey="ma20" 
                            stroke="#3b82f6" 
                            strokeWidth={1.5}
                            dot={false}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="ma50" 
                            stroke="#8b5cf6" 
                            strokeWidth={1.5}
                            dot={false}
                            strokeDasharray="5 5"
                          />
                        </>
                      )}
                      {indicators.ema && (
                        <Line 
                          type="monotone" 
                          dataKey="ema" 
                          stroke="#10b981" 
                          strokeWidth={1.5}
                          dot={false}
                          strokeDasharray="3 3"
                        />
                      )}
                      {indicators.bollinger && (
                        <>
                          <Line 
                            type="monotone" 
                            dataKey="upperBand" 
                            stroke="#ef4444" 
                            strokeWidth={1}
                            dot={false}
                            strokeDasharray="2 2"
                          />
                          <Line 
                            type="monotone" 
                            dataKey="lowerBand" 
                            stroke="#22c55e" 
                            strokeWidth={1}
                            dot={false}
                            strokeDasharray="2 2"
                          />
                        </>
                      )}
                      {showPrediction && (
                        <Line 
                          type="monotone" 
                          dataKey="predicted" 
                          stroke="#a855f7" 
                          strokeWidth={2.5}
                          dot={false}
                          strokeDasharray="5 5"
                        />
                      )}
                    </ComposedChart>
                  ) : (
                    <ComposedChart data={stockData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                      <XAxis 
                        dataKey="time" 
                        stroke="#6b7280" 
                        tick={{ fill: '#9ca3af', fontSize: 11 }}
                        interval="preserveStartEnd"
                      />
                      <YAxis 
                        stroke="#6b7280" 
                        tick={{ fill: '#9ca3af', fontSize: 11 }}
                        domain={['auto', 'auto']}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar 
                        dataKey={(data) => [data.low, data.high, data.open, data.close]}
                        shape={(props) => {
                          const { x, y, width, height, payload } = props;
                          if (!payload || payload.isPrediction) return null;
                          
                          const { low, high, open, close } = payload;
                          if (!low || !high || !open || !close) return null;
                          
                          const isGreen = close > open;
                          const color = isGreen ? '#22c55e' : '#ef4444';
                          
                          const chartHeight = height;
                          const yMin = y;
                          const priceRange = high - low;
                          
                          if (priceRange === 0) return null;
                          
                          const wickX = x + width / 2;
                          const highY = yMin;
                          const lowY = yMin + chartHeight;
                          const openY = yMin + chartHeight * ((high - open) / priceRange);
                          const closeY = yMin + chartHeight * ((high - close) / priceRange);
                          
                          const bodyTop = Math.min(openY, closeY);
                          const bodyHeight = Math.abs(closeY - openY);
                          const bodyWidth = Math.max(width * 0.6, 2);
                          
                          return (
                            <g>
                              <line
                                x1={wickX}
                                y1={highY}
                                x2={wickX}
                                y2={lowY}
                                stroke={color}
                                strokeWidth={1}
                              />
                              <rect
                                x={x + (width - bodyWidth) / 2}
                                y={bodyTop}
                                width={bodyWidth}
                                height={Math.max(bodyHeight, 1)}
                                fill={color}
                                stroke={color}
                              />
                            </g>
                          );
                        }}
                      />
                      {indicators.ma && (
                        <>
                          <Line 
                            type="monotone" 
                            dataKey="ma20" 
                            stroke="#3b82f6" 
                            strokeWidth={1.5}
                            dot={false}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="ma50" 
                            stroke="#8b5cf6" 
                            strokeWidth={1.5}
                            dot={false}
                            strokeDasharray="5 5"
                          />
                        </>
                      )}
                      {indicators.ema && (
                        <Line 
                          type="monotone" 
                          dataKey="ema" 
                          stroke="#10b981" 
                          strokeWidth={1.5}
                          dot={false}
                          strokeDasharray="3 3"
                        />
                      )}
                      {showPrediction && (
                        <Line 
                          type="monotone" 
                          dataKey="predicted" 
                          stroke="#a855f7" 
                          strokeWidth={2.5}
                          dot={false}
                          strokeDasharray="5 5"
                        />
                      )}
                    </ComposedChart>
                  )}
                </ResponsiveContainer>
              </div>

              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-800 flex-wrap">
                <button
                  onClick={() => setIndicators(prev => ({ ...prev, ma: !prev.ma }))}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium ${
                    indicators.ma ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'bg-gray-800 text-gray-400'
                  }`}
                >
                  <div className="w-3 h-0.5 bg-blue-500"></div>
                  Moving Average
                </button>
                <button
                  onClick={() => setIndicators(prev => ({ ...prev, ema: !prev.ema }))}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium ${
                    indicators.ema ? 'bg-green-600/20 text-green-400 border border-green-500/30' : 'bg-gray-800 text-gray-400'
                  }`}
                >
                  <div className="w-3 h-0.5 bg-green-500"></div>
                  EMA
                </button>
                <button
                  onClick={() => setIndicators(prev => ({ ...prev, bollinger: !prev.bollinger }))}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium ${
                    indicators.bollinger ? 'bg-red-600/20 text-red-400 border border-red-500/30' : 'bg-gray-800 text-gray-400'
                  }`}
                >
                  <div className="w-3 h-0.5 bg-red-500"></div>
                  Bollinger Bands
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}