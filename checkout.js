
let cart = [];


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
        
        
        detectCardBrand(value.replace(/\s/g, ''));
        
        
        updateCardDisplay('number', value || '●●●● ●●●● ●●●● ●●●●');
    }
});

document.getElementById('cardName')?.addEventListener('input', function(e) {
    updateCardDisplay('name', e.target.value.toUpperCase() || 'SEU NOME');
});


function detectCardBrand(cardNumber) {
    const cardNumberInput = document.getElementById('cardNumber');
    let brand = '';
    let brandIcon = '';
    
    
    cardNumberInput.classList.remove('visa', 'mastercard', 'amex');
    
    if (!cardNumber || cardNumber.length < 4) {
        updateCardBrandDisplay('');
        return;
    }
    
    
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


function updateCardBrandDisplay(brand, icon = '') {
    let brandDisplay = document.getElementById('cardBrandDisplay');
    
    if (!brandDisplay) {
        
        brandDisplay = document.createElement('div');
        brandDisplay.id = 'cardBrandDisplay';
        brandDisplay.className = 'card-brand-display';
        
        const cardNumberGroup = document.getElementById('cardNumber').closest('.form-group');
        cardNumberGroup.style.position = 'relative';
        cardNumberGroup.appendChild(brandDisplay);
    }
    
    if (brand) {
        
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


document.getElementById('cardCvv')?.addEventListener('focus', function() {
    document.getElementById('flipCard')?.classList.add('flipped');
});

document.getElementById('cardCvv')?.addEventListener('blur', function() {
    document.getElementById('flipCard')?.classList.remove('flipped');
});


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


document.querySelectorAll('input[name="payment"]').forEach(radio => {
    radio.addEventListener('change', function() {
        const cardDetails = document.getElementById('cardDetails');
        const installmentsGroup = document.getElementById('installmentsGroup');
        
        if (this.value === 'credito') {
            cardDetails.style.display = 'block';
            installmentsGroup.style.display = 'block';
            
            document.getElementById('cardNumber').required = true;
            document.getElementById('cardName').required = true;
            document.getElementById('cardExpiry').required = true;
            document.getElementById('cardCvv').required = true;
        } else if (this.value === 'debito') {
            cardDetails.style.display = 'block';
            installmentsGroup.style.display = 'none';
            
            document.getElementById('cardNumber').required = true;
            document.getElementById('cardName').required = true;
            document.getElementById('cardExpiry').required = true;
            document.getElementById('cardCvv').required = true;
        } else {
            cardDetails.style.display = 'none';
            installmentsGroup.style.display = 'none';
            
            document.getElementById('cardNumber').required = false;
            document.getElementById('cardName').required = false;
            document.getElementById('cardExpiry').required = false;
            document.getElementById('cardCvv').required = false;
        }
    });
});


function loadCart() {
    const savedCart = localStorage.getItem('loteriCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    } else {
        cart = [];
        
        showNotification('Seu carrinho está vazio. Adicione apostas primeiro!', 'warning');
    }
    displayCartSummary();
}


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
    
    
    const cpf = document.getElementById('cpf').value.replace(/\D/g, '');
    if (cpf.length !== 11) {
        showNotification('CPF inválido!', 'error');
        return false;
    }
    
    
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


function finalizePurchase() {
    if (!validateForm()) {
        return;
    }
    
    
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
    
    
    const btn = document.querySelector('.btn-primary');
    const originalText = btn.textContent;
    btn.textContent = 'Processando...';
    btn.disabled = true;
    
    setTimeout(() => {
        
        const orderNumber = 'LP' + Date.now().toString().slice(-8);
        
        
        const orders = JSON.parse(localStorage.getItem('loteriOrders') || '[]');
        orders.push({
            orderNumber: orderNumber,
            ...formData
        });
        localStorage.setItem('loteriOrders', JSON.stringify(orders));
        
        
        localStorage.removeItem('loteriCart');
        
        
        localStorage.setItem('lastOrder', orderNumber);
        window.location.href = 'sucesso.html';
    }, 2000);
}


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


function updateCardVisualBrand() {
    const cardFront = document.querySelector('.flip-card-front');
    const cardNumber = document.getElementById('cardNumber')?.value.replace(/\D/g, '') || '';
    const brandLogo = document.getElementById('cardBrandLogo');
    
    if (!cardFront) return;
    
    
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
    
    
    const brandNameEl = document.getElementById('cardBrandName');
    if (brandNameEl) {
        brandNameEl.textContent = brandName;
    }
    
    
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


document.addEventListener('DOMContentLoaded', function() {
    loadCart();
    
    
    const cardNumberInput = document.getElementById('cardNumber');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', updateCardVisualBrand);
    }
});
