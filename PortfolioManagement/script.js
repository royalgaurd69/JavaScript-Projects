// App State and Constants
const MOCK_API_KEY = 'demo-api-key';
const POPULAR_STOCKS = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'JPM'];
const RECOMMENDATION_SECTORS = {
    'Technology': ['AAPL', 'MSFT', 'GOOGL', 'META', 'NVDA'],
    'E-Commerce': ['AMZN', 'SHOP', 'ETSY', 'BABA'],
    'Electric Vehicles': ['TSLA', 'NIO', 'RIVN', 'LCID'],
    'Financial': ['JPM', 'BAC', 'GS', 'V', 'MA'],
    'Healthcare': ['JNJ', 'PFE', 'MRNA', 'UNH']
};

// Theme-related constants
const THEME = {
    positiveColor: '#2e7d32', // Forest green
    negativeColor: '#c62828', // Red
    chartColors: [
        '#2e7d32', // Primary Green
        '#1b5e20', // Dark Green
        '#60ad5e', // Light Green
        '#4caf50', // Medium Green
        '#81c784', // Pale Green
        '#005005'  // Extra Dark Green
    ]
};

let currentUser = null;
let stockPrices = {};
let stockHistory = {}; // For chart data

// Utility Functions
function encryptData(data) {
    // Simple Base64 encoding for demo purposes
    return btoa(JSON.stringify(data));
}

function decryptData(encrypted) {
    // Simple Base64 decoding for demo purposes
    try {
        return JSON.parse(atob(encrypted));
    } catch (e) {
        console.error('Error decrypting data:', e);
        return null;
    }
}

function saveUserData(userData) {
    const encryptedData = encryptData(userData);
    localStorage.setItem(`user_${userData.username}`, encryptedData);
}

function getUserData(username) {
    const encryptedData = localStorage.getItem(`user_${username}`);
    if (!encryptedData) return null;
    return decryptData(encryptedData);
}

function formatCurrency(amount) {
    return parseFloat(amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

function showMessage(elementId, message, type) {
    const messageElement = document.getElementById(elementId);
    messageElement.className = `message ${type}`;
    messageElement.textContent = message;
    messageElement.style.display = 'block';

    // Add animation class
    messageElement.classList.add('message-animate');

    // Auto-hide message after 5 seconds
    setTimeout(() => {
        messageElement.classList.remove('message-animate');
        setTimeout(() => {
            messageElement.style.display = 'none';
        }, 300);
    }, 5000);
}

// Navigation and Page Control
function showPage(pageId) {
    // Add fade-out effect to current page
    const currentPage = document.querySelector('.page.active');
    if (currentPage) {
        currentPage.classList.add('fade-out');
        setTimeout(() => {
            currentPage.classList.remove('active', 'fade-out');
            activateNewPage(pageId);
        }, 300);
    } else {
        activateNewPage(pageId);
    }
}

function activateNewPage(pageId) {
    const newPage = document.getElementById(pageId);
    newPage.classList.add('active', 'fade-in');

    // Remove animation class after animation completes
    setTimeout(() => {
        newPage.classList.remove('fade-in');
    }, 300);

    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('data-page') === pageId) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Handle special page initialization
    if (pageId === 'dashboard') {
        fetchStockPrices();
        updateBalanceDisplay();
        generateMockStockChart('portfolioValueChart');
    } else if (pageId === 'portfolio') {
        updatePortfolio();
    } else if (pageId === 'recommendations') {
        loadRecommendations();
    }
}

function checkAuth() {
    const loggedInUser = localStorage.getItem('currentUser');
    if (loggedInUser) {
        const username = decryptData(loggedInUser);
        currentUser = getUserData(username);

        if (!currentUser) {
            logout();
            return false;
        }

        document.getElementById('userWelcome').textContent = currentUser.username;
        return true;
    }
    return false;
}

function logout() {
    localStorage.removeItem('currentUser');
    currentUser = null;
    showPage('landing');
}

// Mock API Functions (for demo purposes)
function getMockStockPrice(symbol) {
    // Generate consistent price based on symbol string
    const basePrice = symbol
        .split('')
        .reduce((acc, char) => acc + char.charCodeAt(0), 0) % 1000 + 50;

    // Add some random fluctuation
    const fluctuation = (Math.random() - 0.5) * 10;
    return parseFloat((basePrice + fluctuation).toFixed(2));
}

function getPercentChange() {
    // Random percentage change between -3% and +3%
    return (Math.random() * 6 - 3).toFixed(2);
}

function generateMockHistoricalData(symbol, days = 30) {
    const basePrice = getMockStockPrice(symbol);
    const data = [];

    // Generate historical data with a general trend
    let currentPrice = basePrice * 0.9; // Start 10% lower
    const trend = Math.random() > 0.5 ? 1 : -1; // Random trend direction

    const today = new Date();

    for (let i = days; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);

        // Add some volatility to the price
        const change = (Math.random() * 0.03) * trend;
        currentPrice = currentPrice * (1 + change);

        data.push({
            date: date.toISOString().split('T')[0],
            price: parseFloat(currentPrice.toFixed(2))
        });
    }

    return data;
}

function generateMockStockChart(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // For demo, we'll generate a simple SVG chart placeholder
    const svgWidth = container.clientWidth;
    const svgHeight = 200;

    let points = '';
    for (let i = 0; i < 10; i++) {
        const x = i * (svgWidth / 10);
        const y = 100 + Math.sin(i / 1.5) * 50 + Math.random() * 30;
        points += `${x},${y} `;
    }

    container.innerHTML = `
        <svg width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}">
            <path d="M0,${svgHeight} L0,100 ${points} ${svgWidth},120 ${svgWidth},${svgHeight}Z" 
                  fill="${THEME.chartColors[0]}40" />
            <path d="M0,100 ${points} ${svgWidth},120" 
                  stroke="${THEME.chartColors[0]}" 
                  stroke-width="2" 
                  fill="none" />
            <text x="10" y="30" fill="${THEME.chartColors[1]}" font-weight="bold">Portfolio Value</text>
            <text x="${svgWidth - 100}" y="30" fill="${THEME.positiveColor}" font-weight="bold">+8.45%</text>
        </svg>
    `;
}

async function fetchStockPrice(symbol) {
    // In a real app, this would call an actual API
    return new Promise(resolve => {
        setTimeout(() => {
            const price = getMockStockPrice(symbol);
            resolve(price);
        }, 300);
    });
}

async function fetchStockPrices() {
    const pricesContainer = document.getElementById('livePrices');
    pricesContainer.innerHTML = '<div class="loading"></div>';

    // Mock API call to get stock prices for popular stocks
    try {
        // Process each stock with a slight delay to simulate real API
        let html = '';

        for (const symbol of POPULAR_STOCKS) {
            const price = await fetchStockPrice(symbol);
            const percentChange = getPercentChange();
            stockPrices[symbol] = price;

            const changeClass = parseFloat(percentChange) >= 0 ? 'positive-change' : 'negative-change';
            const changeSymbol = parseFloat(percentChange) >= 0 ? '+' : '';
            const arrowIcon = parseFloat(percentChange) >= 0 ? '↑' : '↓';

            html += `
                <div class="price-card" onclick="fillBuyForm('${symbol}', ${price})">
                    <div class="stock-symbol">${symbol}</div>
                    <div class="stock-price">$${formatCurrency(price)}</div>
                    <div class="stock-change ${changeClass}">${arrowIcon} ${changeSymbol}${percentChange}%</div>
                </div>
            `;
        }

        pricesContainer.innerHTML = html;
    } catch (error) {
        pricesContainer.innerHTML = '<p>Error loading stock prices. Please try again later.</p>';
        console.error('Error fetching stock prices:', error);
    }
}

// Portfolio Management Functions
function updateBalanceDisplay() {
    if (currentUser) {
        document.getElementById('availableBalance').textContent = formatCurrency(currentUser.balance);
    }
}

async function searchStock() {
    const symbol = document.getElementById('stockSearchInput').value.trim().toUpperCase();
    const resultContainer = document.getElementById('stockSearchResult');

    if (!symbol) {
        showMessage('stockSearchResult', 'Please enter a stock symbol', 'error');
        return;
    }

    resultContainer.innerHTML = '<div class="loading"></div>';

    try {
        const price = await fetchStockPrice(symbol);
        stockPrices[symbol] = price;

        // Generate mock historical data for this stock
        stockHistory[symbol] = generateMockHistoricalData(symbol);

        resultContainer.innerHTML = `
            <div class="search-result-card">
                <div class="search-result-header">
                    <h4>${symbol}</h4>
                    <span class="current-price">$${formatCurrency(price)}</span>
                </div>
                <div class="stock-chart" id="stockChart_${symbol}"></div>
                <div class="search-result-footer">
                    <button class="btn" onclick="fillBuyForm('${symbol}', ${price})">Buy Now</button>
                </div>
            </div>
        `;

        // Generate a mini chart for this stock
        generateStockMiniChart(`stockChart_${symbol}`, symbol);

    } catch (error) {
        resultContainer.innerHTML = '<p class="message error">Error fetching stock price. Please try again.</p>';
        console.error('Error searching stock:', error);
    }
}

function generateStockMiniChart(containerId, symbol) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const data = stockHistory[symbol];
    if (!data) return;

    const svgWidth = container.clientWidth;
    const svgHeight = 100;

    // Find min and max values
    const prices = data.map(d => d.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice;

    // Generate path
    let points = '';
    data.forEach((d, i) => {
        const x = i * (svgWidth / (data.length - 1));
        const y = svgHeight - ((d.price - minPrice) / priceRange) * svgHeight * 0.8;
        points += `${x},${y} `;
    });

    // Determine if trend is positive
    const isPositive = data[data.length - 1].price >= data[0].price;
    const pathColor = isPositive ? THEME.positiveColor : THEME.negativeColor;

    container.innerHTML = `
        <svg width="100%" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}">
            <path d="M0,${svgHeight} ${points} ${svgWidth},${svgHeight}Z" 
                  fill="${pathColor}20" />
            <path d="${points}" 
                  stroke="${pathColor}" 
                  stroke-width="2" 
                  fill="none" />
        </svg>
    `;
}

function fillBuyForm(symbol, price) {
    document.getElementById('buySymbol').value = symbol;
    calculateEstimatedCost();

    // Scroll to buy form
    document.querySelector('.buy-form').scrollIntoView({ behavior: 'smooth' });
}

function calculateEstimatedCost() {
    const symbol = document.getElementById('buySymbol').value.trim().toUpperCase();
    const quantity = parseInt(document.getElementById('buyQuantity').value) || 0;

    if (symbol && quantity > 0) {
        if (!stockPrices[symbol]) {
            // Fetch price if not already in cache
            fetchStockPrice(symbol).then(price => {
                stockPrices[symbol] = price;
                const total = price * quantity;
                document.getElementById('estimatedCost').value = `$${formatCurrency(total)}`;
            });
        } else {
            const total = stockPrices[symbol] * quantity;
            document.getElementById('estimatedCost').value = `$${formatCurrency(total)}`;
        }
    } else {
        document.getElementById('estimatedCost').value = '$0.00';
    }
}

async function buyStock(e) {
    e.preventDefault();

    const symbol = document.getElementById('buySymbol').value.trim().toUpperCase();
    const quantity = parseInt(document.getElementById('buyQuantity').value) || 0;

    if (!symbol || quantity <= 0) {
        showMessage('stockSearchResult', 'Please enter a valid symbol and quantity', 'error');
        return;
    }

    try {
        // Add loading indicator to button
        const buyButton = e.target.querySelector('button[type="submit"]');
        const originalButtonText = buyButton.innerHTML;
        buyButton.innerHTML = '<span class="spinner"></span> Processing...';
        buyButton.disabled = true;

        // Ensure we have the latest price
        const price = await fetchStockPrice(symbol);
        stockPrices[symbol] = price;

        const totalCost = price * quantity;

        if (totalCost > currentUser.balance) {
            showMessage('stockSearchResult', 'Insufficient funds for this purchase', 'error');
            buyButton.innerHTML = originalButtonText;
            buyButton.disabled = false;
            return;
        }

        // Update user's portfolio
        if (!currentUser.portfolio[symbol]) {
            currentUser.portfolio[symbol] = {
                quantity: quantity,
                averagePrice: price
            };
        } else {
            // Calculate new average price
            const currentQuantity = currentUser.portfolio[symbol].quantity;
            const currentAvgPrice = currentUser.portfolio[symbol].averagePrice;
            const newTotalQuantity = currentQuantity + quantity;
            const newAvgPrice = ((currentQuantity * currentAvgPrice) + (quantity * price)) / newTotalQuantity;

            currentUser.portfolio[symbol].quantity = newTotalQuantity;
            currentUser.portfolio[symbol].averagePrice = newAvgPrice;
        }

        // Update balance
        currentUser.balance -= totalCost;

        // Save updated user data
        saveUserData(currentUser);
        updateBalanceDisplay();

        // Restore button
        buyButton.innerHTML = originalButtonText;
        buyButton.disabled = false;

        // Show success message with animation
        showMessage('stockSearchResult', `Successfully purchased ${quantity} shares of ${symbol}`, 'success');

        // Reset form
        document.getElementById('buyStockForm').reset();
        document.getElementById('estimatedCost').value = '';

    } catch (error) {
        showMessage('stockSearchResult', 'Error processing your purchase. Please try again.', 'error');
        console.error('Error buying stock:', error);
    }
}

async function updatePortfolio() {
    if (!currentUser) return;

    const portfolioTable = document.getElementById('portfolioTable');
    const totalValueElement = document.getElementById('totalPortfolioValue');

    // Add loading indicator
    portfolioTable.innerHTML = '<tr><td colspan="5"><div class="loading"></div></td></tr>';

    const portfolio = currentUser.portfolio;
    const symbols = Object.keys(portfolio);

    if (symbols.length === 0) {
        document.getElementById('portfolioContent').innerHTML =
            '<div class="empty-portfolio"><p>You don\'t have any stocks in your portfolio yet.</p>' +
            '<button class="btn" onclick="showPage(\'dashboard\')">Start Trading</button></div>';
        totalValueElement.textContent = '0.00';
        return;
    }

    // Clear previous data
    portfolioTable.innerHTML = '';

    let totalPortfolioValue = 0;

    // Update prices for all stocks in portfolio
    for (const symbol of symbols) {
        const price = await fetchStockPrice(symbol);
        stockPrices[symbol] = price;

        const item = portfolio[symbol];
        const quantity = item.quantity;
        const avgPrice = item.averagePrice;
        const totalValue = price * quantity;
        const profitLoss = price - avgPrice;
        const profitLossPercent = ((price / avgPrice) - 1) * 100;

        totalPortfolioValue += totalValue;

        const row = document.createElement('tr');
        row.className = profitLoss >= 0 ? 'profit' : 'loss';

        row.innerHTML = `
            <td><strong>${symbol}</strong></td>
            <td>${quantity}</td>
            <td>$${formatCurrency(price)}</td>
            <td>$${formatCurrency(totalValue)}</td>
            <td>
                <div class="pl-indicator ${profitLoss >= 0 ? 'positive-change' : 'negative-change'}">
                    ${profitLoss >= 0 ? '↑' : '↓'} ${profitLoss >= 0 ? '+' : ''}${profitLossPercent.toFixed(2)}%
                </div>
                <button class="btn btn-sell" onclick="openSellModal('${symbol}', ${quantity}, ${price})">Sell</button>
            </td>
        `;

        portfolioTable.appendChild(row);
    }

    totalValueElement.textContent = formatCurrency(totalPortfolioValue);
}

function openSellModal(symbol, quantity, price) {
    document.getElementById('sellSymbol').value = symbol;
    document.getElementById('sellCurrentQuantity').value = quantity;
    document.getElementById('sellCurrentPrice').value = `$${formatCurrency(price)}`;
    document.getElementById('sellQuantity').value = 1;
    document.getElementById('sellQuantity').max = quantity;
    updateSellTotal();

    // Show modal with animation
    const modal = document.getElementById('sellModal');
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.querySelector('.modal-content').classList.add('active');
    }, 10);
}

function updateSellTotal() {
    const symbol = document.getElementById('sellSymbol').value;
    const quantity = parseInt(document.getElementById('sellQuantity').value) || 0;
    const price = stockPrices[symbol] || 0;

    document.getElementById('sellTotal').value = `$${formatCurrency(price * quantity)}`;
}

function closeSellModal() {
    const modal = document.getElementById('sellModal');
    const modalContent = modal.querySelector('.modal-content');

    modalContent.classList.remove('active');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

async function sellStock(e) {
    e.preventDefault();

    const symbol = document.getElementById('sellSymbol').value;
    const quantity = parseInt(document.getElementById('sellQuantity').value) || 0;
    const price = stockPrices[symbol];

    if (!symbol || quantity <= 0 || !price) {
        showMessage('portfolioMessage', 'Invalid sell order', 'error');
        closeSellModal();
        return;
    }

    const currentQuantity = currentUser.portfolio[symbol].quantity;

    if (quantity > currentQuantity) {
        showMessage('portfolioMessage', 'You cannot sell more shares than you own', 'error');
        closeSellModal();
        return;
    }

    const sellValue = price * quantity;

    // Add loading indicator to button
    const sellButton = e.target.querySelector('button[type="submit"]');
    const originalButtonText = sellButton.innerHTML;
    sellButton.innerHTML = '<span class="spinner"></span> Processing...';
    sellButton.disabled = true;

    // Update portfolio
    if (quantity === currentQuantity) {
        // Sell all shares
        delete currentUser.portfolio[symbol];
    } else {
        // Sell partial position
        currentUser.portfolio[symbol].quantity -= quantity;
    }

    // Update balance
    currentUser.balance += sellValue;

    // Save updated user data
    saveUserData(currentUser);

    // Restore button
    sellButton.innerHTML = originalButtonText;
    sellButton.disabled = false;

    // Close modal and update UI
    closeSellModal();
    updatePortfolio();
    showMessage('portfolioMessage', `Successfully sold ${quantity} shares of ${symbol} for $${formatCurrency(sellValue)}`, 'success');
}

async function loadRecommendations() {
    const recommendationsContainer = document.getElementById('recommendationsContent');
    recommendationsContainer.innerHTML = '<div class="loading"></div>';

    try {
        let html = '';

        // Generate recommendations based on sectors
        for (const [sector, stocks] of Object.entries(RECOMMENDATION_SECTORS)) {
            // Pick a random stock from this sector
            const randomIndex = Math.floor(Math.random() * stocks.length);
            const symbol = stocks[randomIndex];

            // Get the latest price
            const price = await fetchStockPrice(symbol);
            stockPrices[symbol] = price;

            // Generate mock historical data for chart
            if (!stockHistory[symbol]) {
                stockHistory[symbol] = generateMockHistoricalData(symbol);
            }

            const percentChange = getPercentChange();
            const changeClass = parseFloat(percentChange) >= 0 ? 'positive-change' : 'negative-change';
            const changeSymbol = parseFloat(percentChange) >= 0 ? '+' : '';
            const trendArrow = parseFloat(percentChange) >= 0 ? '↑' : '↓';

            html += `
                <div class="recommendation-card">
                    <div class="recommendation-header">
                        <h3>${sector}</h3>
                        <span class="sector-trend ${changeClass}">${trendArrow} ${changeSymbol}${percentChange}%</span>
                    </div>
                    <div class="recommendation-body">
                        <div class="stock-info">
                            <h4>${symbol}</h4>
                            <p class="price">$${formatCurrency(price)}</p>
                        </div>
                        <div class="stock-mini-chart" id="recChart_${symbol}"></div>
                        <p>This ${sector} stock shows strong potential based on recent market trends and technical indicators.</p>
                    </div>
                    <div class="recommendation-footer">
                        <button class="btn" onclick="fillBuyForm('${symbol}', ${price})">Buy Now</button>
                        <button class="btn btn-secondary" onclick="showPage('dashboard')">View Details</button>
                    </div>
                </div>
            `;
        }

        recommendationsContainer.innerHTML = html;

        // Generate mini charts for each recommendation
        for (const [sector, stocks] of Object.entries(RECOMMENDATION_SECTORS)) {
            const randomIndex = Math.floor(Math.random() * stocks.length);
            const symbol = stocks[randomIndex];

            if (document.getElementById(`recChart_${symbol}`)) {
                generateStockMiniChart(`recChart_${symbol}`, symbol);
            }
        }

    } catch (error) {
        recommendationsContainer.innerHTML = '<p>Error loading recommendations. Please try again later.</p>';
        console.error('Error loading recommendations:', error);
    }
}

// Event Listeners and Initialization
document.addEventListener('DOMContentLoaded', () => {
    // Add theme CSS class to body
    document.body.classList.add('green-theme');

    // Navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = link.getAttribute('data-page');
            if (checkAuth()) {
                showPage(pageId);
            } else {
                showPage('login');
            }
        });
    });

    // Mobile menu toggle
    document.getElementById('hamburger').addEventListener('click', () => {
        document.getElementById('navLinks').classList.toggle('active');
    });

    // Auth navigation
    document.getElementById('goToLoginBtn').addEventListener('click', () => showPage('login'));
    document.getElementById('goToSignupBtn').addEventListener('click', () => showPage('signup'));
    document.getElementById('switchToSignup').addEventListener('click', (e) => {
        e.preventDefault();
        showPage('signup');
    });
    document.getElementById('switchToLogin').addEventListener('click', (e) => {
        e.preventDefault();
        showPage('login');
    });

    // Logout button
    document.getElementById('logoutBtn').addEventListener('click', (e) => {
        e.preventDefault();
        logout();
    });

    // Login form
    document.getElementById('loginForm').addEventListener('submit', (e) => {
        e.preventDefault();

        const username = document.getElementById('loginUsername').value.trim();
        const password = document.getElementById('loginPassword').value;

        if (!username || !password) {
            showMessage('loginMessage', 'Please enter both username and password', 'error');
            return;
        }

        const userData = getUserData(username);

        if (!userData || userData.password !== password) {
            showMessage('loginMessage', 'Invalid username or password', 'error');
            return;
        }

        // Add loading spinner to button
        const loginButton = e.target.querySelector('button[type="submit"]');
        const originalButtonText = loginButton.innerHTML;
        loginButton.innerHTML = '<span class="spinner"></span> Logging in...';
        loginButton.disabled = true;

        // Simulate login delay
        setTimeout(() => {
            // Login successful
            currentUser = userData;
            localStorage.setItem('currentUser', encryptData(username));
            document.getElementById('userWelcome').textContent = username;

            // Restore button
            loginButton.innerHTML = originalButtonText;
            loginButton.disabled = false;

            // Clear form
            document.getElementById('loginForm').reset();

            // Navigate to dashboard
            showPage('dashboard');
        }, 800);
    });

    // Signup form
    document.getElementById('signupForm').addEventListener('submit', (e) => {
        e.preventDefault();

        const username = document.getElementById('signupUsername').value.trim();
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('signupConfirmPassword').value;
        const initialBalance = parseFloat(document.getElementById('initialBalance').value) || 10000;

        if (!username || !password) {
            showMessage('signupMessage', 'Please enter username and password', 'error');
            return;
        }

        if (password !== confirmPassword) {
            showMessage('signupMessage', 'Passwords do not match', 'error');
            return;
        }

        // Check if user already exists
        if (getUserData(username)) {
            showMessage('signupMessage', 'Username already exists', 'error');
            return;
        }

        // Add loading spinner to button
        const signupButton = e.target.querySelector('button[type="submit"]');
        const originalButtonText = signupButton.innerHTML;
        signupButton.innerHTML = '<span class="spinner"></span> Creating account...';
        signupButton.disabled = true;

        // Simulate signup delay
        setTimeout(() => {
            // Create new user
            const newUser = {
                username,
                password,
                balance: initialBalance,
                portfolio: {}
            };

            saveUserData(newUser);

            // Auto login
            currentUser = newUser;
            localStorage.setItem('currentUser', encryptData(username));
            document.getElementById('userWelcome').textContent = username;

            // Restore button
            signupButton.innerHTML = originalButtonText;
            signupButton.disabled = false;

            // Clear form
            document.getElementById('signupForm').reset();

            // Navigate to dashboard
            showPage('dashboard');
            showMessage('stockSearchResult', 'Account created successfully! Welcome to Portfolio Management.', 'success');
        }, 1000);
    });

    // Stock search
    document.getElementById('stockSearchBtn').addEventListener('click', searchStock);
    document.getElementById('stockSearchInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            searchStock();
        }
    });

    // Buy form calculation
    document.getElementById('buyQuantity').addEventListener('input', calculateEstimatedCost);
    document.getElementById('buySymbol').addEventListener('input', calculateEstimatedCost);

    // Buy stock form
    document.getElementById('buyStockForm').addEventListener('submit', buyStock);

    // Sell modal events
    document.querySelector('.close').addEventListener('click', closeSellModal);
    document.getElementById('cancelSell').addEventListener('click', closeSellModal);
    document.getElementById('sellQuantity').addEventListener('input', updateSellTotal);
    document.getElementById('sellStockForm').addEventListener('submit', sellStock);

    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        const modal = document.getElementById('sellModal');
        if (e.target === modal) {
            closeSellModal();
        }
    });

    // Check if user is already logged in
    if (checkAuth()) {
        showPage('dashboard');
    }
});

// Global Functions (to be called from HTML)
window.fillBuyForm = fillBuyForm;
window.openSellModal = openSellModal;
window.showPage = showPage;