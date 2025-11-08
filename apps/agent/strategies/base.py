from abc import ABC, abstractmethod
from typing import Dict, List, Any, Optional
import pandas as pd


class BaseStrategy(ABC):
    """
    Base class for all trading strategies.
    
    All strategies must implement the abstract methods.
    """

    def __init__(self, params: Optional[Dict[str, Any]] = None):
        """
        Initialize strategy with parameters.
        
        Args:
            params: Strategy-specific parameters
        """
        self.params = params or {}
        self.state = {}

    @abstractmethod
    def on_candle(self, candle: Dict[str, Any], state: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Called on each new candle.
        
        Args:
            candle: Candle data (timestamp, open, high, low, close, volume)
            state: Current strategy state
            
        Returns:
            List of order dictionaries to execute
        """
        pass

    @abstractmethod
    def get_params(self) -> Dict[str, Any]:
        """
        Get strategy parameters.
        
        Returns:
            Dictionary of parameters
        """
        pass

    @abstractmethod
    def serialize_state(self) -> Dict[str, Any]:
        """
        Serialize strategy state for persistence.
        
        Returns:
            Serializable state dictionary
        """
        pass

    def load_state(self, state: Dict[str, Any]) -> None:
        """
        Load strategy state from persistence.
        
        Args:
            state: State dictionary to load
        """
        self.state = state

    def reset(self) -> None:
        """Reset strategy state."""
        self.state = {}
