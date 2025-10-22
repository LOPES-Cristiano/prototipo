// Carregar carrinho do localStorage
let cart = [];

// Máscaras de input
document.getElementById('cpf')?.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        e.target.value = value;
    }
});

document.getElementById('telefone')?.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
        value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
        value = value.replace(/(\d)(\d{4})$/, '$1-$2');
        e.target.value = value;
    }
});

document.getElementById('cardNumber')?.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length <= 16) {
        value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
        e.target.value = value;
        
        // Detectar bandeira do cartão
        detectCardBrand(value.replace(/\s/g, ''));
        
        // Atualizar cartão visual
        updateCardDisplay('number', value || '●●●● ●●●● ●●●● ●●●●');
    }
});

document.getElementById('cardName')?.addEventListener('input', function(e) {
    updateCardDisplay('name', e.target.value.toUpperCase() || 'SEU NOME');
});

// Detectar bandeira do cartão
function detectCardBrand(cardNumber) {
    const cardNumberInput = document.getElementById('cardNumber');
    let brand = '';
    let brandIcon = '';
    
    // Remover classes anteriores
    cardNumberInput.classList.remove('visa', 'mastercard', 'amex');
    
    if (!cardNumber || cardNumber.length < 4) {
        updateCardBrandDisplay('');
        return;
    }
    
    // Padrões das bandeiras (apenas Visa, Mastercard e Amex)
    if (/^4/.test(cardNumber)) {
        brand = 'VISA';
        brandIcon = '💳';
        cardNumberInput.classList.add('visa');
    } else if (/^5[1-5]/.test(cardNumber)) {
        brand = 'MASTERCARD';
        brandIcon = '💳';
        cardNumberInput.classList.add('mastercard');
    } else if (/^3[47]/.test(cardNumber)) {
        brand = 'AMEX';
        brandIcon = '💳';
        cardNumberInput.classList.add('amex');
    }
    
    updateCardBrandDisplay(brand, brandIcon);
}

// Atualizar exibição da bandeira
function updateCardBrandDisplay(brand, icon = '') {
    let brandDisplay = document.getElementById('cardBrandDisplay');
    
    if (!brandDisplay) {
        // Criar elemento se não existe
        brandDisplay = document.createElement('div');
        brandDisplay.id = 'cardBrandDisplay';
        brandDisplay.className = 'card-brand-display';
        
        const cardNumberGroup = document.getElementById('cardNumber').closest('.form-group');
        cardNumberGroup.style.position = 'relative';
        cardNumberGroup.appendChild(brandDisplay);
    }
    
    if (brand) {
        // Mapear bandeira para imagem (apenas Visa, Mastercard e Amex)
        const brandImages = {
            'VISA': 'visa.png',
            'MASTERCARD': 'mastercard.png',
            'AMEX': 'americanexpress.png'
        };
        
        const imageSrc = brandImages[brand];
        if (imageSrc) {
            brandDisplay.innerHTML = `<img src="${imageSrc}" alt="${brand}" class="brand-logo-img">`;
        } else {
            brandDisplay.innerHTML = `<span class="brand-icon">${icon}</span>`;
        }
        brandDisplay.style.display = 'flex';
    } else {
        brandDisplay.style.display = 'none';
    }
}

document.getElementById('cardExpiry')?.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) {
        value = value.replace(/(\d{2})(\d)/, '$1/$2');
        e.target.value = value;
        updateCardDisplay('expiry', value || '00/00');
    }
});

document.getElementById('cardCvv')?.addEventListener('input', function(e) {
    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 3);
    updateCardDisplay('cvv', e.target.value || '***');
});

// Flip card quando focar no CVV
document.getElementById('cardCvv')?.addEventListener('focus', function() {
    document.getElementById('flipCard')?.classList.add('flipped');
});

document.getElementById('cardCvv')?.addEventListener('blur', function() {
    document.getElementById('flipCard')?.classList.remove('flipped');
});

// Atualizar display do cartão visual
function updateCardDisplay(field, value) {
    const displays = {
        number: document.getElementById('cardNumberDisplay'),
        name: document.getElementById('cardNameDisplay'),
        expiry: document.getElementById('cardExpiryDisplay'),
        cvv: document.getElementById('cardCvvDisplay')
    };
    
    if (displays[field]) {
        displays[field].textContent = value;
    }
}

// Controlar exibição dos campos de cartão
document.querySelectorAll('input[name="payment"]').forEach(radio => {
    radio.addEventListener('change', function() {
        const cardDetails = document.getElementById('cardDetails');
        const installmentsGroup = document.getElementById('installmentsGroup');
        
        if (this.value === 'credito') {
            cardDetails.style.display = 'block';
            installmentsGroup.style.display = 'block';
            // Tornar campos obrigatórios
            document.getElementById('cardNumber').required = true;
            document.getElementById('cardName').required = true;
            document.getElementById('cardExpiry').required = true;
            document.getElementById('cardCvv').required = true;
        } else if (this.value === 'debito') {
            cardDetails.style.display = 'block';
            installmentsGroup.style.display = 'none';
            // Tornar campos obrigatórios
            document.getElementById('cardNumber').required = true;
            document.getElementById('cardName').required = true;
            document.getElementById('cardExpiry').required = true;
            document.getElementById('cardCvv').required = true;
        } else {
            cardDetails.style.display = 'none';
            installmentsGroup.style.display = 'none';
            // Remover obrigatoriedade
            document.getElementById('cardNumber').required = false;
            document.getElementById('cardName').required = false;
            document.getElementById('cardExpiry').required = false;
            document.getElementById('cardCvv').required = false;
        }
    });
});

// Carregar e exibir itens do carrinho
function loadCart() {
    const savedCart = localStorage.getItem('loteriCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    } else {
        cart = [];
        // Mostrar aviso mas permitir continuar
        showNotification('Seu carrinho está vazio. Adicione apostas primeiro!', 'warning');
    }
    displayCartSummary();
}

// Exibir resumo do carrinho
function displayCartSummary() {
    const summaryItems = document.getElementById('summaryItems');
    const subtotalEl = document.getElementById('subtotal');
    const totalEl = document.getElementById('total');
    
    if (cart.length === 0) {
        summaryItems.innerHTML = '<p class="empty-cart">Carrinho vazio</p>';
        subtotalEl.textContent = 'R$ 0,00';
        totalEl.textContent = 'R$ 0,00';
        return;
    }
    
    let html = '';
    let subtotal = 0;
    
    cart.forEach((item, index) => {
        subtotal += item.price;
        html += `
            <div class="summary-item">
                <div class="summary-item-header">
                    <h4>${item.game}</h4>
                    <span class="item-price">R$ ${item.price.toFixed(2).replace('.', ',')}</span>
                </div>
                <div class="summary-item-numbers">
                    <strong>Números:</strong> ${item.numbers.sort((a, b) => a - b).join(', ')}
                </div>
                <div class="summary-item-info">
                    ${item.numbers.length} ${item.numbers.length === 1 ? 'número' : 'números'} selecionado${item.numbers.length === 1 ? '' : 's'}
                </div>
            </div>
        `;
    });
    
    summaryItems.innerHTML = html;
    subtotalEl.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
    totalEl.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
}

// Validar formulário
function validateForm() {
    const form = document.getElementById('checkoutForm');
    const termsAccept = document.getElementById('termsAccept');
    
    if (!form.checkValidity()) {
        form.reportValidity();
        return false;
    }
    
    if (!termsAccept.checked) {
        showNotification('Você precisa aceitar os termos e condições!', 'error');
        return false;
    }
    
    // Validar CPF (validação simples)
    const cpf = document.getElementById('cpf').value.replace(/\D/g, '');
    if (cpf.length !== 11) {
        showNotification('CPF inválido!', 'error');
        return false;
    }
    
    // Validar campos de cartão se necessário
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
    if (paymentMethod === 'credito' || paymentMethod === 'debito') {
        const cardNumber = document.getElementById('cardNumber').value.replace(/\D/g, '');
        const cardExpiry = document.getElementById('cardExpiry').value;
        const cardCvv = document.getElementById('cardCvv').value;
        
        if (cardNumber.length !== 16) {
            showNotification('Número do cartão inválido!', 'error');
            return false;
        }
        
        if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
            showNotification('Data de validade inválida!', 'error');
            return false;
        }
        
        if (cardCvv.length !== 3) {
            showNotification('CVV inválido!', 'error');
            return false;
        }
    }
    
    return true;
}

// Finalizar compra
function finalizePurchase() {
    if (!validateForm()) {
        return;
    }
    
    // Coletar dados do formulário
    const formData = {
        nome: document.getElementById('nome').value,
        cpf: document.getElementById('cpf').value,
        email: document.getElementById('email').value,
        telefone: document.getElementById('telefone').value,
        endereco: document.getElementById('endereco').value,
        cidade: document.getElementById('cidade').value,
        estado: document.getElementById('estado').value,
        paymentMethod: document.querySelector('input[name="payment"]:checked').value,
        cart: cart,
        total: cart.reduce((sum, item) => sum + item.price, 0),
        date: new Date().toISOString()
    };
    
    // Simular processamento
    const btn = document.querySelector('.btn-primary');
    const originalText = btn.textContent;
    btn.textContent = 'Processando...';
    btn.disabled = true;
    
    setTimeout(() => {
        // Gerar número de pedido
        const orderNumber = 'LP' + Date.now().toString().slice(-8);
        
        // Salvar pedido no localStorage
        const orders = JSON.parse(localStorage.getItem('loteriOrders') || '[]');
        orders.push({
            orderNumber: orderNumber,
            ...formData
        });
        localStorage.setItem('loteriOrders', JSON.stringify(orders));
        
        // Limpar carrinho
        localStorage.removeItem('loteriCart');
        
        // Redirecionar para página de sucesso
        localStorage.setItem('lastOrder', orderNumber);
        window.location.href = 'sucesso.html';
    }, 2000);
}

// Notificações
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Atualizar bandeira do cartão visual
function updateCardVisualBrand() {
    const cardFront = document.querySelector('.flip-card-front');
    const cardNumber = document.getElementById('cardNumber')?.value.replace(/\D/g, '') || '';
    const brandLogo = document.getElementById('cardBrandLogo');
    
    if (!cardFront) return;
    
    // Remover todas as classes de bandeira
    cardFront.classList.remove('visa', 'mastercard', 'amex');
    
    let brandName = 'CARTÃO';
    let brandClass = '';
    let logoSrc = '';
    
    if (cardNumber.length >= 4) {
        if (/^4/.test(cardNumber)) {
            brandName = 'VISA';
            brandClass = 'visa';
            logoSrc = 'visa.png';
        } else if (/^5[1-5]/.test(cardNumber)) {
            brandName = 'MASTERCARD';
            brandClass = 'mastercard';
            logoSrc = 'mastercard.png';
        } else if (/^3[47]/.test(cardNumber)) {
            brandName = 'AMEX';
            brandClass = 'amex';
            logoSrc = 'americanexpress.png';
        }
        
        if (brandClass) {
            cardFront.classList.add(brandClass);
        }
    }
    
    // Atualizar nome da bandeira
    const brandNameEl = document.getElementById('cardBrandName');
    if (brandNameEl) {
        brandNameEl.textContent = brandName;
    }
    
    // Atualizar logo da bandeira
    if (brandLogo) {
        if (logoSrc) {
            brandLogo.src = logoSrc;
            brandLogo.alt = brandName;
            brandLogo.style.display = 'block';
        } else {
            brandLogo.style.display = 'none';
            brandLogo.src = '';
        }
    }
}

// Inicializar ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
    loadCart();
    
    // Adicionar listener para atualizar brand do cartão visual
    const cardNumberInput = document.getElementById('cardNumber');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', updateCardVisualBrand);
    }
});
