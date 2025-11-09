import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { TrendingUp, TrendingDown, Plus, Minus, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import Header from '../components/Header';

const TradingPage = ({ user, onLogout }) => {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [tradeAction, setTradeAction] = useState('buy');
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  useEffect(() => {
    fetchMovies();
    const interval = setInterval(fetchMovies, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/movies`);
      if (response.ok) {
        const data = await response.json();
        setMovies(data);
        if (!selectedMovie && data.length > 0) {
          setSelectedMovie(data[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedMovie || quantity < 1) {
      toast.error('Please enter a valid quantity');
      return;
    }

    setIsPlacingOrder(true);
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/trade/order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          movie_id: selectedMovie.id,
          action: tradeAction,
          quantity: parseInt(quantity),
          order_type: 'market'
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`${tradeAction.toUpperCase()} order placed successfully!`);
        setQuantity(1);
        fetchMovies();
        window.location.reload(); // Refresh to update balance
      } else {
        toast.error(data.detail || 'Failed to place order');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const totalCost = selectedMovie ? selectedMovie.current_price * quantity : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-600">Loading movies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header user={user} onLogout={onLogout} currentPage="trading" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Trading Desk</h1>
          <p className="text-slate-600">Buy and sell Bollywood movie stocks</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Trading Panel */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 border-2 border-orange-100">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Trading Panel
                  <Badge className="bg-green-100 text-green-800">Live</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Select Movie</Label>
                  <Select
                    value={selectedMovie?.id}
                    onValueChange={(value) => {
                      const movie = movies.find(m => m.id === value);
                      setSelectedMovie(movie);
                    }}
                  >
                    <SelectTrigger data-testid="movie-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {movies.map((movie) => (
                        <SelectItem key={movie.id} value={movie.id}>
                          {movie.symbol} - {movie.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedMovie && (
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-slate-600">Current Price</span>
                      <span className="text-lg font-bold" data-testid="current-price">₹{selectedMovie.current_price}</span>
                    </div>
                    <div className={`text-sm ${selectedMovie.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {selectedMovie.change >= 0 ? '+' : ''}₹{selectedMovie.change} ({selectedMovie.change_percent}%)
                    </div>
                  </div>
                )}

                <Tabs value={tradeAction} onValueChange={setTradeAction} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="buy" data-testid="buy-tab" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
                      Buy
                    </TabsTrigger>
                    <TabsTrigger value="sell" data-testid="sell-tab" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
                      Sell
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                <div className="space-y-2">
                  <Label>Quantity</Label>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      data-testid="decrease-quantity"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <Input
                      type="number"
                      data-testid="quantity-input"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="text-center"
                      min="1"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      data-testid="increase-quantity"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Total Cost</span>
                    <span className="font-medium" data-testid="total-cost">₹{totalCost.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>

                <Button
                  onClick={handlePlaceOrder}
                  disabled={isPlacingOrder}
                  data-testid="place-order-btn"
                  className={`w-full h-11 ${
                    tradeAction === 'buy'
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {isPlacingOrder ? 'Placing Order...' : `${tradeAction === 'buy' ? 'Buy' : 'Sell'} ${selectedMovie?.symbol}`}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Movies List */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Available Movies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {movies.map((movie) => (
                    <Card
                      key={movie.id}
                      data-testid={`movie-card-${movie.symbol}`}
                      className="hover:shadow-lg transition-all cursor-pointer border-2 border-transparent hover:border-orange-200"
                      onClick={() => setSelectedMovie(movie)}
                    >
                      <div className="aspect-[3/4] relative overflow-hidden rounded-t-lg">
                        {movie.poster ? (
                          <img
                            src={movie.poster}
                            alt={movie.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-orange-100 to-green-100 flex items-center justify-center">
                            <span className="text-4xl font-bold text-slate-400">{movie.symbol}</span>
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-bold text-slate-900 mb-1">{movie.symbol}</h3>
                        <p className="text-sm text-slate-600 mb-3 truncate">{movie.title}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold text-slate-900">₹{movie.current_price}</span>
                          <span className={`text-sm flex items-center ${movie.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {movie.change >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                            {movie.change_percent}%
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingPage;
