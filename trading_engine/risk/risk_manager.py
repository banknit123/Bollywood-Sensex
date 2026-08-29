from dataclasses import dataclass


@dataclass
class RiskDecision:
    allowed: bool
    reason: str
    max_order_value: float


class RiskManager:
    def __init__(self, max_position_pct: float = 10.0, max_daily_loss_pct: float = 2.0):
        self.max_position_pct = max_position_pct
        self.max_daily_loss_pct = max_daily_loss_pct

    def evaluate(self, equity: float, daily_pnl: float, requested_order_value: float) -> RiskDecision:
        if equity <= 0:
            return RiskDecision(False, "Non-positive account equity", 0.0)

        daily_loss_limit = equity * (self.max_daily_loss_pct / 100.0)
        if daily_pnl <= -daily_loss_limit:
            return RiskDecision(False, "Daily loss limit reached", 0.0)

        max_order_value = equity * (self.max_position_pct / 100.0)
        if requested_order_value > max_order_value:
            return RiskDecision(False, "Requested order exceeds position limit", max_order_value)

        return RiskDecision(True, "Allowed", max_order_value)
