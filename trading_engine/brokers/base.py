from abc import ABC, abstractmethod


class BrokerAdapter(ABC):
    @abstractmethod
    def get_quote(self, symbol: str) -> dict:
        raise NotImplementedError

    @abstractmethod
    def place_order(self, symbol: str, side: str, quantity: int, order_type: str = "MARKET") -> dict:
        raise NotImplementedError


class LiveTradingDisabled(RuntimeError):
    pass
