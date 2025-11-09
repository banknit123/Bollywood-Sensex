import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import Header from '../components/Header';

const PortfolioPage = ({ user, onLogout }) => {
  const [portfolio, setPortfolio] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPortfolioData();
  }, []);

  const fetchPortfolioData = async () => {
    const token = localStorage.getItem('token');

    try {
      const [portfolioRes, transactionsRes] = await Promise.all([
        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/portfolio`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/transactions`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (portfolioRes.ok) {
        const portfolioData = await portfolioRes.json();
        setPortfolio(portfolioData);
      }

      if (transactionsRes.ok) {
        const transactionsData = await transactionsRes.json();
        setTransactions(transactionsData);
      }
    } catch (error) {
      console.error('Error fetching portfolio:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header user={user} onLogout={onLogout} currentPage="portfolio" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Portfolio</h1>
            <p className="text-slate-600">Track your movie investments</p>
          </div>
          <Button variant="outline" onClick={fetchPortfolioData}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        <Tabs defaultValue="holdings" className="space-y-6">
          <TabsList>
            <TabsTrigger value="holdings" data-testid="holdings-tab">Holdings</TabsTrigger>
            <TabsTrigger value="transactions" data-testid="transactions-tab">Transactions</TabsTrigger>
          </TabsList>

          <TabsContent value="holdings">
            <Card>
              <CardHeader>
                <CardTitle>Current Holdings</CardTitle>
              </CardHeader>
              <CardContent>
                {portfolio?.portfolio && portfolio.portfolio.length > 0 ? (
                  <div className="space-y-4">
                    {portfolio.portfolio.map((holding, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg" data-testid={`portfolio-holding-${index}`}>
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-900">{holding.movie_symbol}</h4>
                          <p className="text-sm text-slate-600">{holding.movie_title}</p>
                        </div>
                        <div className="text-right mr-8">
                          <p className="font-medium text-slate-900">Qty: {holding.quantity}</p>
                          <p className="text-sm text-slate-600">Avg: ₹{holding.avg_price}</p>
                        </div>
                        <div className="text-right mr-8">
                          <p className="font-bold text-slate-900">₹{holding.current_price}</p>
                          <p className="text-sm text-slate-600">Current</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-slate-900">₹{holding.current_value.toLocaleString('en-IN')}</p>
                          <p className={`text-sm ${holding.pl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {holding.pl >= 0 ? '+' : ''}₹{Math.abs(holding.pl).toFixed(2)} ({holding.pl_percent.toFixed(2)}%)
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-600">No holdings yet</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
              </CardHeader>
              <CardContent>
                {transactions && transactions.length > 0 ? (
                  <div className="space-y-3">
                    {transactions.map((transaction, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg" data-testid={`transaction-${index}`}>
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
                          <p className="text-xs text-slate-500">{new Date(transaction.timestamp).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-600">No transactions yet</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PortfolioPage;
