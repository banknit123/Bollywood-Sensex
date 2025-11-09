import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import Header from '../components/Header';

const MarketPage = ({ user, onLogout }) => {
  const [marketData, setMarketData] = useState({ gainers: [], losers: [], volume_leaders: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMarketData();
    const interval = setInterval(fetchMarketData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchMarketData = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/market/trending`);
      if (response.ok) {
        const data = await response.json();
        setMarketData(data);
      }
    } catch (error) {
      console.error('Error fetching market data:', error);
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
      <Header user={user} onLogout={onLogout} currentPage="market" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Market Overview</h1>
          <p className="text-slate-600">Live market data and trending movies</p>
        </div>

        <Tabs defaultValue="gainers" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="gainers" data-testid="gainers-tab">Top Gainers</TabsTrigger>
            <TabsTrigger value="losers" data-testid="losers-tab">Top Losers</TabsTrigger>
            <TabsTrigger value="volume" data-testid="volume-tab">Volume</TabsTrigger>
          </TabsList>

          <TabsContent value="gainers">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                  Top Gainers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {marketData.gainers.map((movie, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow" data-testid={`gainer-${index}`}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold text-slate-900">{movie.symbol}</h3>
                            <p className="text-sm text-slate-600 truncate">{movie.title}</p>
                          </div>
                          <TrendingUp className="w-5 h-5 text-green-500" />
                        </div>
                        <div className="flex justify-between items-end">
                          <div>
                            <p className="text-2xl font-bold text-slate-900">₹{movie.current_price}</p>
                            <p className="text-sm text-green-600">+{movie.change} (+{movie.change_percent}%)</p>
                          </div>
                          <Badge variant="secondary" className="text-xs">Vol: {movie.volume}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="losers">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingDown className="w-5 h-5 mr-2 text-red-600" />
                  Top Losers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {marketData.losers.map((movie, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow" data-testid={`loser-${index}`}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold text-slate-900">{movie.symbol}</h3>
                            <p className="text-sm text-slate-600 truncate">{movie.title}</p>
                          </div>
                          <TrendingDown className="w-5 h-5 text-red-500" />
                        </div>
                        <div className="flex justify-between items-end">
                          <div>
                            <p className="text-2xl font-bold text-slate-900">₹{movie.current_price}</p>
                            <p className="text-sm text-red-600">{movie.change} ({movie.change_percent}%)</p>
                          </div>
                          <Badge variant="secondary" className="text-xs">Vol: {movie.volume}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="volume">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-blue-600" />
                  Volume Leaders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {marketData.volume_leaders.map((movie, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow" data-testid={`volume-leader-${index}`}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold text-slate-900">{movie.symbol}</h3>
                            <p className="text-sm text-slate-600 truncate">{movie.title}</p>
                          </div>
                          <Activity className="w-5 h-5 text-blue-500" />
                        </div>
                        <div className="flex justify-between items-end">
                          <div>
                            <p className="text-2xl font-bold text-slate-900">₹{movie.current_price}</p>
                            <p className={`text-sm ${movie.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {movie.change >= 0 ? '+' : ''}{movie.change} ({movie.change_percent}%)
                            </p>
                          </div>
                          <Badge className="text-xs bg-blue-100 text-blue-800">Vol: {movie.volume}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );};export default MarketPage;