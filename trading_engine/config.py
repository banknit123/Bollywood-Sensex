from dataclasses import dataclass


@dataclass(frozen=True)
class TradingConfig:
    initial_cash: float = 100_000.0
    commission_bps: float = 5.0
    slippage_bps: float = 5.0
    max_position_pct: float = 10.0
    max_daily_loss_pct: float = 2.0
    min_signal_confidence: float = 0.70
    live_trading_enabled: bool = False


CONFIG = TradingConfig()
