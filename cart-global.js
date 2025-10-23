




class GlobalCart {
    constructor() {
        this.cart = this.loadCart();
        this.init();
    }

    init() {
        
        this.createFloatingCart();
        
        this.updateCartBadge();
        
        this.attachEvents();
    }

    createFloatingCart() {
        
        const floatingBtn = document.createElement('div');
        floatingBtn.className = 'floating-cart-btn';
        floatingBtn.id = 'floatingCartBtn';
        floatingBtn.innerHTML = `
            <i class="fas fa-shopping-cart"></i>
            <span class="floating-cart-badge" id="floatingCartBadge">0</span>
        `;
        document.body.appendChild(floatingBtn);

        
        const modal = document.createElement('div');
        modal.className = 'floating-cart-modal';
        modal.id = 'floatingCartModal';
        modal.innerHTML = `
            <div class="floating-cart-content">
                <div class="floating-cart-header">
                    <h3><i class="fas fa-shopping-cart"></i> Meu Carrinho</h3>
                    <button class="floating-cart-close" id="closeCartModal">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="floating-cart-items" id="floatingCartItems">
                    <div class="floating-cart-empty">
                        <i class="fas fa-shopping-basket"></i>
                        <p>Seu carrinho está vazio</p>
                        <p style="font-size: 0.9rem;">Adicione apostas para começar</p>
                    </div>
                </div>
                <div class="floating-cart-footer" id="floatingCartFooter" style="display: none;">
                    <div class="floating-cart-total">
                        <span>Total:</span>
                        <span id="floatingCartTotal">R$ 0,00</span>
                    </div>
                    <div class="floating-cart-actions">
                        <button class="btn btn-secondary btn-large" onclick="globalCart.clearCart()">
                            <i class="fas fa-trash"></i> Limpar
                        </button>
                        <a href="checkout.html" class="btn btn-primary btn-large">
                            <i class="fas fa-check"></i> Finalizar
                        </a>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    attachEvents() {
        
        document.getElementById('floatingCartBtn').addEventListener('click', () => {
            this.openCartModal();
        });

        
        document.getElementById('closeCartModal').addEventListener('click', () => {
            this.closeCartModal();
        });

        
        document.getElementById('floatingCartModal').addEventListener('click', (e) => {
            if (e.target.id === 'floatingCartModal') {
                this.closeCartModal();
            }
        });
    }

    openCartModal() {
        document.getElementById('floatingCartModal').classList.add('active');
        this.renderCart();
    }

    closeCartModal() {
        document.getElementById('floatingCartModal').classList.remove('active');
    }

    addItem(item) {
        
        this.cart.push({
            id: Date.now(),
            ...item
        });
        this.saveCart();
        this.updateCartBadge();
        this.showNotification('Aposta adicionada ao carrinho!');
    }

    removeItem(id) {
        this.cart = this.cart.filter(item => item.id !== id);
        this.saveCart();
        this.updateCartBadge();
        this.renderCart();
    }

    clearCart() {
        if (confirm('Deseja limpar todo o carrinho?')) {
            this.cart = [];
            this.saveCart();
            this.updateCartBadge();
            this.renderCart();
        }
    }

    getCart() {
        return this.cart;
    }

    getTotal() {
        return this.cart.reduce((sum, item) => sum + item.price, 0);
    }

    saveCart() {
        
        const checkoutFormat = this.cart.map(item => ({
            game: item.game,
            numbers: item.numbers,
            price: item.price
        }));
        localStorage.setItem('loteriCart', JSON.stringify(checkoutFormat));
        
        localStorage.setItem('lotericaCart', JSON.stringify(this.cart));
    }

    loadCart() {
        const saved = localStorage.getItem('lotericaCart');
        return saved ? JSON.parse(saved) : [];
    }

    updateCartBadge() {
        const badge = document.getElementById('floatingCartBadge');
        if (badge) {
            badge.textContent = this.cart.length;
            badge.style.display = this.cart.length > 0 ? 'flex' : 'none';
        }
    }

    renderCart() {
        const itemsContainer = document.getElementById('floatingCartItems');
        const footer = document.getElementById('floatingCartFooter');
        const totalElement = document.getElementById('floatingCartTotal');

        if (this.cart.length === 0) {
            itemsContainer.innerHTML = `
                <div class="floating-cart-empty">
                    <i class="fas fa-shopping-basket"></i>
                    <p>Seu carrinho está vazio</p>
                    <p style="font-size: 0.9rem;">Adicione apostas para começar</p>
                </div>
            `;
            footer.style.display = 'none';
        } else {
            itemsContainer.innerHTML = this.cart.map(item => `
                <div class="floating-cart-item">
                    <div class="floating-cart-item-info">
                        <h4>${item.game}</h4>
                        <p>Números: ${item.numbers.join(', ')}</p>
                    </div>
                    <div style="display: flex; align-items: center;">
                        <span class="floating-cart-item-price">R$ ${item.price.toFixed(2).replace('.', ',')}</span>
                        <button class="floating-cart-item-remove" onclick="globalCart.removeItem(${item.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `).join('');
            
            footer.style.display = 'block';
            totalElement.textContent = `R$ ${this.getTotal().toFixed(2).replace('.', ',')}`;
        }
    }

    showNotification(message) {
        
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 2rem;
            right: 2rem;
            background: linear-gradient(135deg, var(--gold), #B8860B);
            color: #000;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            font-weight: 700;
            box-shadow: 0 4px 20px rgba(212, 175, 55, 0.4);
            z-index: 99999;
            animation: slideInRight 0.3s ease;
        `;
        notification.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }
}


let globalCart;
document.addEventListener('DOMContentLoaded', () => {
    globalCart = new GlobalCart();
});


if (!document.getElementById('cart-animations')) {
    const style = document.createElement('style');
    style.id = 'cart-animations';
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}
