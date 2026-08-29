from dataclasses import dataclass, field
from typing import List


@dataclass
class PaperOrder:
    symbol: str
    side: str
    quantity: int
    price: float


@dataclass
class PaperPortfolio:
    cash: float
    orders: List[PaperOrder] = field(default_factory=list)

    def execute(self, order: PaperOrder) -> None:
        value = order.quantity * order.price
        if order.side.upper() == "BUY":
            if value > self.cash:
                raise ValueError("Insufficient paper cash")
            self.cash -= value
        elif order.side.upper() == "SELL":
            self.cash += value
        else:
            raise ValueError("side must be BUY or SELL")
        self.orders.append(order)
