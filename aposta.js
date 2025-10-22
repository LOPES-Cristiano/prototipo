// Configurações dos jogos
const games = {
    megasena: {
        name: 'Mega-Sena',
        icon: '🎯',
        totalNumbers: 60,
        minNumbers: 6,
        maxNumbers: 15,
        basePrice: 5.00,
        prices: {
            6: 5.00,
            7: 35.00,
            8: 140.00,
            9: 420.00,
            10: 1050.00,
            11: 2310.00,
            12: 4620.00,
            13: 8580.00,
            14: 15015.00,
            15: 25025.00
        },
        instructions: 'Marque de 6 a 15 números entre os 60 disponíveis abaixo. Quanto mais números marcar, maior o valor da aposta e suas chances de ganhar!'
    },
    lotofacil: {
        name: 'Lotofácil',
        icon: '🍀',
        totalNumbers: 25,
        minNumbers: 15,
        maxNumbers: 20,
        basePrice: 3.00,
        prices: {
            15: 3.00,
            16: 48.00,
            17: 408.00,
            18: 2448.00,
            19: 11628.00,
            20: 46512.00
        },
        instructions: 'Marque de 15 a 20 números entre os 25 disponíveis. A Lotofácil é a mais fácil de ganhar!'
    },
    quina: {
        name: 'Quina',
        icon: '⭐',
        totalNumbers: 80,
        minNumbers: 5,
        maxNumbers: 15,
        basePrice: 2.50,
        prices: {
            5: 2.50,
            6: 15.00,
            7: 52.50,
            8: 150.00,
            9: 375.00,
            10: 825.00,
            11: 1650.00,
            12: 3150.00,
            13: 5775.00,
            14: 10010.00,
            15: 16665.00
        },
        instructions: 'Marque de 5 a 15 números entre os 80 disponíveis. Sorteios todos os dias!'
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
        instructions: 'Marque exatamente 50 números entre os 100 disponíveis. Você ganha acertando 0, 15, 16, 17, 18, 19 ou 20 números!'
    }
};

// Estado da aplicação
let currentGame = 'megasena';
let selectedNumbers = [];
let cart = [];
let cartIdCounter = 1;

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    selectGame('megasena');
    updateCart();
});

// Selecionar jogo
function selectGame(gameName) {
    currentGame = gameName;
    const game = games[gameName];
    
    // Atualizar botões de jogo
    document.querySelectorAll('.game-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.closest('.game-btn').classList.add('active');
    
    // Limpar números selecionados
    selectedNumbers = [];
    
    // Atualizar interface
    document.getElementById('currentGameTitle').textContent = game.name;
    document.getElementById('gameRules').textContent = `Escolha de ${game.minNumbers} a ${game.maxNumbers} números`;
    document.getElementById('gamePrice').textContent = `A partir de R$ ${game.basePrice.toFixed(2)}`;
    document.getElementById('gameInstructions').textContent = game.instructions;
    document.getElementById('maxNumbers').textContent = game.maxNumbers;
    
    // Gerar grade de números
    generateNumbersGrid(game.totalNumbers);
    
    // Atualizar contadores
    updateCounters();
}

// Gerar grade de números
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

// Toggle número
function toggleNumber(number) {
    const game = games[currentGame];
    const index = selectedNumbers.indexOf(number);
    
    if (index > -1) {
        // Desmarcar
        selectedNumbers.splice(index, 1);
    } else {
        // Verificar se já atingiu o máximo
        if (selectedNumbers.length >= game.maxNumbers) {
            alert(`Você pode marcar no máximo ${game.maxNumbers} números neste jogo.`);
            return;
        }
        // Marcar
        selectedNumbers.push(number);
    }
    
    // Ordenar números
    selectedNumbers.sort((a, b) => a - b);
    
    // Atualizar visual
    updateNumbersVisual();
    updateCounters();
}

// Atualizar visual dos números
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

// Atualizar contadores
function updateCounters() {
    const game = games[currentGame];
    const count = selectedNumbers.length;
    
    document.getElementById('selectedCount').textContent = count;
    
    // Calcular valor
    let value = 0;
    if (count >= game.minNumbers && count <= game.maxNumbers) {
        value = game.prices[count] || 0;
    }
    
    document.getElementById('betValue').textContent = `R$ ${value.toFixed(2)}`;
    
    // Atualizar botão e texto de ajuda
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

// Surpresinha - selecionar números aleatórios
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

// Limpar números
function clearNumbers() {
    selectedNumbers = [];
    updateNumbersVisual();
    updateCounters();
}

// Adicionar ao carrinho
function addToCart() {
    const game = games[currentGame];
    const count = selectedNumbers.length;
    
    if (count < game.minNumbers || count > game.maxNumbers) {
        alert('Selecione a quantidade correta de números!');
        return;
    }
    
    const bet = {
        id: cartIdCounter++,
        game: currentGame,
        gameName: game.name,
        icon: game.icon,
        numbers: [...selectedNumbers],
        quantity: count,
        price: game.prices[count]
    };
    
    cart.push(bet);
    
    // Limpar seleção
    clearNumbers();
    
    // Atualizar carrinho
    updateCart();
    
    // Feedback visual
    showNotification('Aposta adicionada ao carrinho!');
}

// Atualizar carrinho
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
    
    // Renderizar itens
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
    
    // Atualizar totais
    const total = cart.reduce((sum, bet) => sum + bet.price, 0);
    cartCount.textContent = cart.length;
    cartTotal.textContent = `R$ ${total.toFixed(2)}`;
    checkoutBtn.disabled = false;
}

// Remover do carrinho
function removeFromCart(betId) {
    cart = cart.filter(bet => bet.id !== betId);
    updateCart();
    showNotification('Aposta removida do carrinho');
}

// Ir para checkout
function goToCheckout() {
    if (cart.length === 0) {
        alert('Adicione apostas ao carrinho primeiro!');
        return;
    }
    
    // Salvar carrinho no localStorage (formato compatível com checkout)
    const checkoutCart = cart.map(bet => ({
        game: bet.gameName,
        numbers: bet.numbers,
        price: bet.price
    }));
    localStorage.setItem('loteriCart', JSON.stringify(checkoutCart));
    
    // Redirecionar para página de checkout
    window.location.href = 'checkout.html';
}

// Notificação
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
