import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Wallet,
  Activity,
  LogOut,
  RefreshCw,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { toast } from 'sonner';
import Header from '../components/Header';

const DashboardPage = ({ user, onLogout }) => {
  const [portfolio, setPortfolio] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    if (!isRefreshing) setIsLoading(true);
    const token = localStorage.getItem('token');

    try {
      const [portfolioRes, transactionsRes, trendingRes] = await Promise.all([
        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/portfolio`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/transactions?limit=5`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/market/trending`)
      ]);

      if (portfolioRes.ok) {
        const portfolioData = await portfolioRes.json();
        setPortfolio(portfolioData);
      }

      if (transactionsRes.ok) {
        const transactionsData = await transactionsRes.json();
        setTransactions(transactionsData);
      }

      if (trendingRes.ok) {
        const trendingData = await trendingRes.json();
        setTrendingMovies(trendingData.gainers.slice(0, 5));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchDashboardData();
    toast.success('Dashboard refreshed');
  };

  if (isLoading && !portfolio) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const totalPL = portfolio?.total_pl || 0;
  const totalPLPercent = portfolio?.total_value ? ((portfolio.total_pl / (portfolio.total_value - portfolio.total_pl)) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-50">
      <Header user={user} onLogout={onLogout} currentPage="dashboard" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-slate-600">Here's your portfolio overview</p>
          </div>
          <Button
            data-testid="refresh-btn"
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Portfolio Value */}
          <Card className="border-2 border-orange-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-slate-600">Total Portfolio</h3>
                <Wallet className="w-5 h-5 text-orange-600" />
              </div>
              <p className="text-3xl font-bold text-slate-900" data-testid="total-portfolio">
                ₹{portfolio?.total_value?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) || '0.00'}
              </p>
              <div className={`flex items-center mt-2 text-sm ${totalPL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {totalPL >= 0 ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
                <span>₹{Math.abs(totalPL).toLocaleString('en-IN')} ({totalPLPercent >= 0 ? '+' : ''}{totalPLPercent.toFixed(2)}%)</span>
              </div>
            </CardContent>
          </Card>

          {/* Available Cash */}
          <Card className="border-2 border-green-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-slate-600">Available Cash</h3>
                <Activity className="w-5 h-5 text-green-700" />
              </div>
              <p className="text-3xl font-bold text-slate-900" data-testid="available-cash">
                ₹{portfolio?.balance?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) || '100,000.00'}
              </p>
              <p className="text-sm text-slate-500 mt-2">Ready to invest</p>
            </CardContent>
          </Card>

          {/* Total P&L */}
          <Card className={`border-2 ${totalPL >= 0 ? 'border-green-200' : 'border-red-200'}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-slate-600">Total P&L</h3>
                {totalPL >= 0 ? <TrendingUp className="w-5 h-5 text-green-600" /> : <TrendingDown className="w-5 h-5 text-red-600" />}
              </div>
              <p className={`text-3xl font-bold ${totalPL >= 0 ? 'text-green-600' : 'text-red-600'}`} data-testid="total-pl">
                {totalPL >= 0 ? '+' : ''}₹{Math.abs(totalPL).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </p>
              <p className={`text-sm mt-2 ${totalPL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {totalPLPercent >= 0 ? '+' : ''}{totalPLPercent.toFixed(2)}% overall
              </p>
            </CardContent>
          </Card>

          {/* Holdings */}
          <Card className="border-2 border-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-slate-600">Holdings</h3>
                <BarChart3 className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-3xl font-bold text-slate-900" data-testid="holdings-count">
                {portfolio?.portfolio?.length || 0}
              </p>
              <p className="text-sm text-slate-500 mt-2">Movie stocks</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Current Holdings */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Current Holdings</CardTitle>
                  <Link to="/portfolio" data-testid="view-all-holdings">
                    <Button variant="outline" size="sm">View All</Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {portfolio?.portfolio && portfolio.portfolio.length > 0 ? (
                  <div className="space-y-4">
                    {portfolio.portfolio.slice(0, 5).map((holding, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors" data-testid={`holding-item-${index}`}>
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-900">{holding.movie_symbol}</h4>
                          <p className="text-sm text-slate-600">{holding.movie_title}</p>
                        </div>
                        <div className="text-right mr-6">
                          <p className="font-medium text-slate-900">Qty: {holding.quantity}</p>
                          <p className="text-sm text-slate-600">Avg: ₹{holding.avg_price}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-slate-900">₹{holding.current_value.toLocaleString('en-IN')}</p>
                          <p className={`text-sm ${holding.pl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {holding.pl >= 0 ? '+' : ''}₹{Math.abs(holding.pl).toFixed(2)} ({holding.pl_percent >= 0 ? '+' : ''}{holding.pl_percent.toFixed(2)}%)
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <BarChart3 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-600 mb-4">You haven't invested yet</p>
                    <Link to="/trading" data-testid="start-trading-btn">
                      <Button style={{ background: 'linear-gradient(135deg, #FF9933 0%, #138808 100%)' }}>
                        Start Trading
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Transactions */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                {transactions && transactions.length > 0 ? (
                  <div className="space-y-3">
                    {transactions.map((transaction, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg" data-testid={`transaction-item-${index}`}>
                        <div className="flex items-center space-x-3">
                          <Badge className={transaction.type === 'BUY' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                            {transaction.type}
                          </Badge>
                          <div>
                            <p className="font-medium text-slate-900">{transaction.movie_symbol}</p>
                            <p className="text-sm text-slate-600">{transaction.quantity} shares @ ₹{transaction.price}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-slate-900">₹{transaction.amount.toLocaleString('en-IN')}</p>
                          <p className="text-xs text-slate-500">{new Date(transaction.timestamp).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-slate-600">No transactions yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Trending Movies */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Trending Movies</CardTitle>
              </CardHeader>
              <CardContent>
                {trendingMovies && trendingMovies.length > 0 ? (
                  <div className="space-y-3">
                    {trendingMovies.map((movie, index) => (
                      <div key={index} className="p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer" data-testid={`trending-movie-${index}`}>
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="font-semibold text-slate-900">{movie.symbol}</h4>
                          <TrendingUp className="w-4 h-4 text-green-600" />
                        </div>
                        <p className="text-sm text-slate-600 mb-2">{movie.title}</p>
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-slate-900">₹{movie.current_price}</span>
                          <span className="text-sm text-green-600">+{movie.change_percent}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-slate-600">Loading trending movies...</p>
                  </div>
                )}
                <Link to="/market" data-testid="view-market-btn">
                  <Button variant="outline" className="w-full mt-4">
                    View Market
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="mt-6" style={{ background: 'linear-gradient(135deg, #FF9933 0%, #138808 100%)' }}>
              <CardContent className="p-6 text-white">
                <h3 className="text-xl font-bold mb-2">Start Trading</h3>
                <p className="text-white/90 mb-4">Explore movies and build your portfolio</p>
                <Link to="/trading" data-testid="quick-trade-btn">
                  <Button className="w-full bg-white text-orange-600 hover:bg-slate-50">
                    Go to Trading
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
