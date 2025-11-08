from setuptools import setup, find_packages

setup(
    name="tunicoin-agent",
    version="1.0.0",
    description="AI Trading Agent for Tunicoin Platform",
    author="Tunicoin Team",
    packages=find_packages(),
    install_requires=[
        "pandas>=2.2.0",
        "numpy>=2.0.0",
        "scipy>=1.14.0",
        "scikit-learn>=1.5.0",
        "python-dateutil>=2.9.0",
        "pytz>=2024.0",
    ],
    python_requires=">=3.11",
    classifiers=[
        "Development Status :: 4 - Beta",
        "Intended Audience :: Developers",
        "Programming Language :: Python :: 3.11",
    ],
)
