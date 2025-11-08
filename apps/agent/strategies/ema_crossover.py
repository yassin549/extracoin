from typing import Dict, List, Any
import pandas as pd
import numpy as np
from .base import BaseStrategy


class EMACrossoverStrategy(BaseStrategy):
    """
    Simple EMA Crossover Strategy (20/50 EMA).
    
    Generates BUY signal when fast EMA crosses above slow EMA.
    Generates SELL signal when fast EMA crosses below slow EMA.
    """

    def __init__(self, params: Dict[str, Any] = None):
        """
        Initialize EMA Crossover strategy.
        
        Default params:
            fast_period: 20
            slow_period: 50
            position_size: 0.1 (10% of account)
        """
        default_params = {
            "fast_period": 20,
            "slow_period": 50,
            "position_size": 0.1,
        }
        super().__init__(params or default_params)
        
        self.price_history = []
        self.fast_ema = None
        self.slow_ema = None
        self.position = None  # None, 'long', or 'short'

    def calculate_ema(self, prices: List[float], period: int) -> float:
        """Calculate Exponential Moving Average."""
        if len(prices) < period:
            return None
        
        df = pd.Series(prices)
        ema = df.ewm(span=period, adjust=False).mean().iloc[-1]
        return ema

    def on_candle(self, candle: Dict[str, Any], state: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Process new candle and generate trading signals.
        
        Args:
            candle: Current candle data
            state: Strategy state
            
        Returns:
            List of orders to execute
        """
        close_price = candle["close"]
        self.price_history.append(close_price)
        
        # Keep only necessary history
        max_period = max(self.params["fast_period"], self.params["slow_period"])
        if len(self.price_history) > max_period * 2:
            self.price_history = self.price_history[-max_period * 2 :]
        
        # Calculate EMAs
        prev_fast_ema = self.fast_ema
        prev_slow_ema = self.slow_ema
        
        self.fast_ema = self.calculate_ema(self.price_history, self.params["fast_period"])
        self.slow_ema = self.calculate_ema(self.price_history, self.params["slow_period"])
        
        # Not enough data yet
        if self.fast_ema is None or self.slow_ema is None:
            return []
        
        if prev_fast_ema is None or prev_slow_ema is None:
            return []
        
        orders = []
        
        # Check for crossover
        # Bullish crossover: fast EMA crosses above slow EMA
        if prev_fast_ema <= prev_slow_ema and self.fast_ema > self.slow_ema:
            if self.position != "long":
                orders.append(
                    {
                        "type": "market",
                        "side": "buy",
                        "size": self.params["position_size"],
                        "reason": f"EMA{self.params['fast_period']} crossed above EMA{self.params['slow_period']}",
                        "indicators": {
                            "fast_ema": self.fast_ema,
                            "slow_ema": self.slow_ema,
                        },
                    }
                )
                self.position = "long"
        
        # Bearish crossover: fast EMA crosses below slow EMA
        elif prev_fast_ema >= prev_slow_ema and self.fast_ema < self.slow_ema:
            if self.position != "short":
                orders.append(
                    {
                        "type": "market",
                        "side": "sell",
                        "size": self.params["position_size"],
                        "reason": f"EMA{self.params['fast_period']} crossed below EMA{self.params['slow_period']}",
                        "indicators": {
                            "fast_ema": self.fast_ema,
                            "slow_ema": self.slow_ema,
                        },
                    }
                )
                self.position = "short"
        
        return orders

    def get_params(self) -> Dict[str, Any]:
        """Get strategy parameters."""
        return self.params

    def serialize_state(self) -> Dict[str, Any]:
        """Serialize strategy state."""
        return {
            "price_history": self.price_history,
            "fast_ema": self.fast_ema,
            "slow_ema": self.slow_ema,
            "position": self.position,
        }

    def load_state(self, state: Dict[str, Any]) -> None:
        """Load strategy state."""
        self.price_history = state.get("price_history", [])
        self.fast_ema = state.get("fast_ema")
        self.slow_ema = state.get("slow_ema")
        self.position = state.get("position")
