from dataclasses import dataclass


@dataclass
class Signal:
    action: str
    expected_return_pct: float
    confidence: float
    reason: str


class SignalEngine:
    def __init__(self, min_confidence: float = 0.70, min_expected_return_pct: float = 0.20):
        self.min_confidence = min_confidence
        self.min_expected_return_pct = min_expected_return_pct

    def decide(self, expected_return_pct: float, confidence: float) -> Signal:
        if confidence < self.min_confidence:
            return Signal("HOLD", expected_return_pct, confidence, "Confidence below threshold")
        if expected_return_pct >= self.min_expected_return_pct:
            return Signal("BUY", expected_return_pct, confidence, "Positive expected return with sufficient confidence")
        if expected_return_pct <= -self.min_expected_return_pct:
            return Signal("SELL", expected_return_pct, confidence, "Negative expected return with sufficient confidence")
        return Signal("HOLD", expected_return_pct, confidence, "Expected return too small after noise allowance")
