from .base import BrokerAdapter, LiveTradingDisabled


class KotakNeoBroker(BrokerAdapter):
    """Placeholder adapter. Live order placement is intentionally disabled."""

    def __init__(self, client=None, live_trading_enabled: bool = False):
        self.client = client
        self.live_trading_enabled = live_trading_enabled

    def get_quote(self, symbol: str) -> dict:
        if self.client is None:
            raise RuntimeError("Kotak Neo client is not configured")
        raise NotImplementedError("Wire quote retrieval after broker credentials/API are configured")

    def place_order(self, symbol: str, side: str, quantity: int, order_type: str = "MARKET") -> dict:
        if not self.live_trading_enabled:
            raise LiveTradingDisabled("Live trading is disabled. Complete backtest and paper-trading validation first.")
        if self.client is None:
            raise RuntimeError("Kotak Neo client is not configured")
        raise NotImplementedError("Live broker order routing has not been enabled")
