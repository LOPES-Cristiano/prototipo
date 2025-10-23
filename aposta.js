
const games = {
    megasena: {
        name: 'Mega-Sena',
        icon: '🎯',
        totalNumbers: 60,
        minNumbers: 6,
        maxNumbers: 15,
        basePrice: 6.00,
        prices: {
            6: 6.00,
            7: 42.00,
            8: 168.00,
            9: 504.00,
            10: 1260.00,
            11: 2772.00,
            12: 5544.00,
            13: 10296.00,
            14: 18018.00,
            15: 30030.00
        },
        instructions: 'Marque de 6 a 15 números entre os 60 disponíveis. Sorteios às quartas e sábados!'
    },
    lotofacil: {
        name: 'Lotofácil',
        icon: '🍀',
        totalNumbers: 25,
        minNumbers: 15,
        maxNumbers: 20,
        basePrice: 3.50,
        prices: {
            15: 3.50,
            16: 56.00,
            17: 476.00,
            18: 2856.00,
            19: 13566.00,
            20: 54264.00
        },
        instructions: 'Marque de 15 a 20 números entre os 25 disponíveis. A mais fácil de ganhar!'
    },
    quina: {
        name: 'Quina',
        icon: '⭐',
        totalNumbers: 80,
        minNumbers: 5,
        maxNumbers: 15,
        basePrice: 3.00,
        prices: {
            5: 3.00,
            6: 18.00,
            7: 63.00,
            8: 180.00,
            9: 450.00,
            10: 990.00,
            11: 1980.00,
            12: 3780.00,
            13: 6930.00,
            14: 12012.00,
            15: 19998.00
        },
        instructions: 'Marque de 5 a 15 números entre os 80 disponíveis. Sorteios todos os dias!'
    },
    diasorte: {
        name: 'Dia de Sorte',
        icon: '🌟',
        totalNumbers: 31,
        minNumbers: 7,
        maxNumbers: 15,
        basePrice: 2.50,
        prices: {
            7: 2.50,
            8: 20.00,
            9: 90.00,
            10: 315.00,
            11: 945.00,
            12: 2520.00,
            13: 6300.00,
            14: 14700.00,
            15: 32032.50
        },
        instructions: 'Marque de 7 a 15 números e escolha o mês da sorte. Sorteios às terças, quintas e sábados!'
    },
    duplasena: {
        name: 'Dupla Sena',
        icon: '🎰',
        totalNumbers: 50,
        minNumbers: 6,
        maxNumbers: 15,
        basePrice: 3.00,
        prices: {
            6: 3.00,
            7: 21.00,
            8: 84.00,
            9: 252.00,
            10: 630.00,
            11: 1386.00,
            12: 2772.00,
            13: 5148.00,
            14: 9009.00,
            15: 15015.00
        },
        instructions: 'Marque de 6 a 15 números. Dois sorteios por concurso, dobra suas chances!'
    },
    lotomania: {
        name: 'Lotomania',
        icon: '🎲',
        totalNumbers: 100,
        minNumbers: 50,
        maxNumbers: 50,
        basePrice: 3.00,
        prices: {
            50: 3.00
        },
        instructions: 'Marque exatamente 50 números entre os 100 disponíveis!'
    },
    supersete: {
        name: 'Super Sete',
        icon: '7️⃣',
        totalNumbers: 10,
        minNumbers: 7,
        maxNumbers: 21,
        basePrice: 3.00,
        prices: {
            7: 3.00,
            14: 6.00,
            21: 9.00
        },
        instructions: 'Escolha 1 número por coluna (7 colunas). Sorteios às segundas, quartas e sextas!'
    },
    timemania: {
        name: 'Timemania',
        icon: '⚽',
        totalNumbers: 80,
        minNumbers: 10,
        maxNumbers: 10,
        basePrice: 3.50,
        prices: {
            10: 3.50
        },
        instructions: 'Marque 10 números e escolha seu time do coração!'
    },
    loteca: {
        name: 'Loteca',
        icon: '🏆',
        totalNumbers: 14,
        minNumbers: 14,
        maxNumbers: 14,
        basePrice: 4.00,
        prices: {
            14: 4.00
        },
        instructions: 'Palpite os resultados dos 14 jogos: Coluna 1 (vitória mandante), Coluna do Meio (empate) ou Coluna 2 (vitória visitante)!'
    },
    maismilionaria: {
        name: '+Milionária',
        icon: '💎',
        totalNumbers: 50,
        minNumbers: 6,
        maxNumbers: 12,
        basePrice: 6.00,
        prices: {
            6: 6.00,
            7: 42.00,
            8: 168.00,
            9: 504.00,
            10: 1260.00,
            11: 2772.00,
            12: 5544.00
        },
        instructions: 'Marque de 6 a 12 números + 2 a 6 trevos da sorte. Prêmio mínimo de R$ 10 milhões!'
    }
};


let currentGame = 'megasena';
let selectedNumbers = [];
let cart = [];
let cartIdCounter = 1;


document.addEventListener('DOMContentLoaded', function() {
    selectGame('megasena');
    updateCart();
});


function selectGame(gameName) {
    currentGame = gameName;
    const game = games[gameName];
    
    
    document.querySelectorAll('.game-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.closest('.game-btn').classList.add('active');
    
    
    selectedNumbers = [];
    
    
    document.getElementById('currentGameTitle').textContent = game.name;
    document.getElementById('gameRules').textContent = `Escolha de ${game.minNumbers} a ${game.maxNumbers} números`;
    document.getElementById('gamePrice').textContent = `A partir de R$ ${game.basePrice.toFixed(2)}`;
    document.getElementById('gameInstructions').textContent = game.instructions;
    document.getElementById('maxNumbers').textContent = game.maxNumbers;
    
    
    generateNumbersGrid(game.totalNumbers);
    
    
    updateCounters();
}


function generateNumbersGrid(total) {
    const grid = document.getElementById('numbersGrid');
    grid.innerHTML = '';
    
    for (let i = 1; i <= total; i++) {
        const numberBtn = document.createElement('button');
        numberBtn.className = 'number-btn';
        numberBtn.textContent = i.toString().padStart(2, '0');
        numberBtn.onclick = () => toggleNumber(i);
        grid.appendChild(numberBtn);
    }
}


function toggleNumber(number) {
    const game = games[currentGame];
    const index = selectedNumbers.indexOf(number);
    
    if (index > -1) {
        
        selectedNumbers.splice(index, 1);
    } else {
        
        if (selectedNumbers.length >= game.maxNumbers) {
            alert(`Você pode marcar no máximo ${game.maxNumbers} números neste jogo.`);
            return;
        }
        
        selectedNumbers.push(number);
    }
    
    
    selectedNumbers.sort((a, b) => a - b);
    
    
    updateNumbersVisual();
    updateCounters();
}


function updateNumbersVisual() {
    document.querySelectorAll('.number-btn').forEach((btn, index) => {
        const number = index + 1;
        if (selectedNumbers.includes(number)) {
            btn.classList.add('selected');
        } else {
            btn.classList.remove('selected');
        }
    });
}


function updateCounters() {
    const game = games[currentGame];
    const count = selectedNumbers.length;
    
    document.getElementById('selectedCount').textContent = count;
    
    
    let value = 0;
    if (count >= game.minNumbers && count <= game.maxNumbers) {
        value = game.prices[count] || 0;
    }
    
    document.getElementById('betValue').textContent = `R$ ${value.toFixed(2)}`;
    
    
    const addBtn = document.getElementById('addToCartBtn');
    const helperText = document.getElementById('helperText');
    
    if (count >= game.minNumbers && count <= game.maxNumbers) {
        addBtn.disabled = false;
        helperText.textContent = `✓ Aposta válida! Valor: R$ ${value.toFixed(2)}`;
        helperText.style.color = '#2ecc71';
    } else if (count < game.minNumbers) {
        addBtn.disabled = true;
        helperText.textContent = `Selecione ao menos ${game.minNumbers} números para continuar`;
        helperText.style.color = '#e74c3c';
    } else {
        addBtn.disabled = true;
        helperText.textContent = `Você já atingiu o máximo de ${game.maxNumbers} números`;
        helperText.style.color = '#e74c3c';
    }
}


function surpresinha() {
    const game = games[currentGame];
    selectedNumbers = [];
    
    while (selectedNumbers.length < game.minNumbers) {
        const randomNum = Math.floor(Math.random() * game.totalNumbers) + 1;
        if (!selectedNumbers.includes(randomNum)) {
            selectedNumbers.push(randomNum);
        }
    }
    
    selectedNumbers.sort((a, b) => a - b);
    updateNumbersVisual();
    updateCounters();
}


function clearNumbers() {
    selectedNumbers = [];
    updateNumbersVisual();
    updateCounters();
}


function addToCart() {
    const game = games[currentGame];
    const count = selectedNumbers.length;
    
    if (count < game.minNumbers || count > game.maxNumbers) {
        alert('Selecione a quantidade correta de números!');
        return;
    }
    
    const bet = {
        id: cartIdCounter++,
        game: game.name,
        gameName: game.name,
        icon: game.icon,
        numbers: [...selectedNumbers],
        quantity: count,
        price: game.prices[count]
    };
    
    cart.push(bet);
    
    
    if (typeof globalCart !== 'undefined') {
        globalCart.addItem({
            game: game.name,
            numbers: [...selectedNumbers],
            price: game.prices[count]
        });
    }
    
    
    clearNumbers();
    
    
    updateCart();
}


function updateCart() {
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const cartTotal = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="cart-empty">
                <p>Seu carrinho está vazio</p>
                <p class="cart-empty-small">Adicione apostas para continuar</p>
            </div>
        `;
        cartCount.textContent = '0';
        cartTotal.textContent = 'R$ 0,00';
        checkoutBtn.disabled = true;
        return;
    }
    
    
    cartItems.innerHTML = cart.map(bet => `
        <div class="cart-item">
            <div class="cart-item-header">
                <span class="cart-item-icon">${bet.icon}</span>
                <span class="cart-item-name">${bet.gameName}</span>
                <button class="cart-item-remove" onclick="removeFromCart(${bet.id})">×</button>
            </div>
            <div class="cart-item-numbers">
                ${bet.numbers.map(n => `<span>${n.toString().padStart(2, '0')}</span>`).join(' ')}
            </div>
            <div class="cart-item-price">R$ ${bet.price.toFixed(2)}</div>
        </div>
    `).join('');
    
    
    const total = cart.reduce((sum, bet) => sum + bet.price, 0);
    cartCount.textContent = cart.length;
    cartTotal.textContent = `R$ ${total.toFixed(2)}`;
    checkoutBtn.disabled = false;
}


function removeFromCart(betId) {
    cart = cart.filter(bet => bet.id !== betId);
    updateCart();
    showNotification('Aposta removida do carrinho');
}


function goToCheckout() {
    if (cart.length === 0) {
        alert('Adicione apostas ao carrinho primeiro!');
        return;
    }
    
    
    const checkoutCart = cart.map(bet => ({
        game: bet.gameName,
        numbers: bet.numbers,
        price: bet.price
    }));
    localStorage.setItem('loteriCart', JSON.stringify(checkoutCart));
    
    
    window.location.href = 'checkout.html';
}


function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}
