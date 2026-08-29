from dataclasses import dataclass
from typing import Iterable, Dict, Any


@dataclass
class BacktestResult:
    starting_cash: float
    ending_cash: float
    total_return_pct: float
    trades: int
    wins: int
    losses: int


class BacktestEngine:
    def __init__(self, starting_cash: float = 100_000.0, commission_bps: float = 5.0, slippage_bps: float = 5.0):
        self.starting_cash = starting_cash
        self.commission_bps = commission_bps
        self.slippage_bps = slippage_bps

    def run(self, trades: Iterable[Dict[str, Any]]) -> BacktestResult:
        cash = self.starting_cash
        wins = 0
        losses = 0
        count = 0
        round_trip_cost_pct = 2 * (self.commission_bps + self.slippage_bps) / 100.0

        for trade in trades:
            gross_return_pct = float(trade.get("return_pct", 0.0))
            net_return_pct = gross_return_pct - round_trip_cost_pct
            cash *= 1 + (net_return_pct / 100.0)
            count += 1
            if net_return_pct > 0:
                wins += 1
            elif net_return_pct < 0:
                losses += 1

        total_return_pct = ((cash / self.starting_cash) - 1) * 100 if self.starting_cash else 0.0
        return BacktestResult(self.starting_cash, cash, total_return_pct, count, wins, losses)
