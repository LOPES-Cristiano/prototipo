/**
 * Liga dos Milionários - Loterias System
 * JavaScript para funcionalidades da página de loterias
 */


const loteriasData = {
    'mega-sena': {
        name: 'Mega-Sena',
        price: 6.00,
        minNumbers: 6,
        maxNumbers: 15,
        totalNumbers: 60,
        drawDays: ['Quarta-feira', 'Sábado'],
        bolaoMinValue: 15.00,
        bolaoMinQuotas: 2,
        bolaoMaxQuotas: 100,
        prizes: ['Sena (6 números)', 'Quina (5 números)', 'Quadra (4 números)']
    },
    'lotofacil': {
        name: 'Lotofácil',
        price: 3.50,
        minNumbers: 15,
        maxNumbers: 20,
        totalNumbers: 25,
        drawDays: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
        bolaoMinValue: 14.00,
        bolaoMinQuotas: 2,
        bolaoMaxQuotas: 100,
        prizes: ['15 acertos', '14 acertos', '13 acertos', '12 acertos', '11 acertos']
    },
    'quina': {
        name: 'Quina',
        price: 3.00,
        minNumbers: 5,
        maxNumbers: 15,
        totalNumbers: 80,
        drawDays: ['Todos os dias'],
        bolaoMinValue: 12.00,
        bolaoMinQuotas: 2,
        bolaoMaxQuotas: 50,
        prizes: ['Quina (5 números)', 'Quadra (4 números)', 'Terno (3 números)', 'Duque (2 números)']
    },
    'diasorte': {
        name: 'Dia de Sorte',
        price: 2.50,
        minNumbers: 7,
        maxNumbers: 15,
        totalNumbers: 31,
        drawDays: ['Terça-feira', 'Quinta-feira', 'Sábado'],
        bolaoMinValue: 10.00,
        bolaoMinQuotas: 2,
        bolaoMaxQuotas: 50,
        prizes: ['7 acertos', '6 acertos', '5 acertos', '4 acertos', 'Mês da Sorte']
    },
    'duplasena': {
        name: 'Dupla Sena',
        price: 3.00,
        minNumbers: 6,
        maxNumbers: 15,
        totalNumbers: 50,
        drawDays: ['Terça-feira', 'Quinta-feira', 'Sábado'],
        bolaoMinValue: 12.00,
        bolaoMinQuotas: 2,
        bolaoMaxQuotas: 100,
        prizes: ['Sena (6 números)', 'Quina (5 números)', 'Quadra (4 números)', 'Terno (3 números)']
    },
    'lotomania': {
        name: 'Lotomania',
        price: 3.00,
        minNumbers: 50,
        maxNumbers: 50,
        totalNumbers: 100,
        drawDays: ['Terça-feira', 'Sexta-feira'],
        bolaoMinValue: 12.00,
        bolaoMinQuotas: 2,
        bolaoMaxQuotas: 100,
        prizes: ['20 acertos', '19 acertos', '18 acertos', '17 acertos', '16 acertos', '15 acertos', '0 acertos']
    },
    'supersete': {
        name: 'Super Sete',
        price: 3.00,
        minNumbers: 7,
        maxNumbers: 7,
        totalNumbers: 7,
        drawDays: ['Segunda-feira', 'Quarta-feira', 'Sexta-feira'],
        bolaoMinValue: 15.00,
        bolaoMinQuotas: 2,
        bolaoMaxQuotas: 50,
        prizes: ['7 acertos', '6 acertos', '5 acertos', '4 acertos', '3 acertos']
    },
    'timemania': {
        name: 'Timemania',
        price: 3.50,
        minNumbers: 10,
        maxNumbers: 10,
        totalNumbers: 80,
        drawDays: ['Terça-feira', 'Quinta-feira', 'Sábado'],
        bolaoMinValue: 14.00,
        bolaoMinQuotas: 2,
        bolaoMaxQuotas: 50,
        prizes: ['7 acertos', '6 acertos', '5 acertos', '4 acertos', '3 acertos', 'Time do Coração']
    },
    'loteca': {
        name: 'Loteca',
        price: 4.00,
        minNumbers: 14,
        maxNumbers: 14,
        totalNumbers: 14,
        drawDays: ['Sábado'],
        bolaoMinValue: 20.00,
        bolaoMinQuotas: 2,
        bolaoMaxQuotas: 50,
        prizes: ['14 acertos', '13 acertos', '12 acertos']
    },
    'maismilionaria': {
        name: '+Milionária',
        price: 6.00,
        minNumbers: 6,
        maxNumbers: 12,
        totalNumbers: 50,
        drawDays: ['Quarta-feira', 'Sábado'],
        bolaoMinValue: 18.00,
        bolaoMinQuotas: 2,
        bolaoMaxQuotas: 100,
        prizes: ['6 números + 2 trevos', '6 números + 1 trevo', '6 números', '5 números + 2 trevos', 'e mais...']
    }
};


function calculateBetPrice(lottery, numNumbers) {
    const data = loteriasData[lottery];
    if (!data) return 0;
    
    
    if (data.minNumbers === data.maxNumbers) {
        return data.price;
    }
    
    
    const combinations = factorial(numNumbers) / (factorial(data.minNumbers) * factorial(numNumbers - data.minNumbers));
    return data.price * combinations;
}


function factorial(n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}


function calculateBolaoPrice(lottery, numNumbers, numQuotas) {
    const totalPrice = calculateBetPrice(lottery, numNumbers);
    const pricePerQuota = totalPrice / numQuotas;
    return {
        total: totalPrice.toFixed(2),
        perQuota: pricePerQuota.toFixed(2),
        quotas: numQuotas
    };
}


function generateRandomNumbers(lottery) {
    const data = loteriasData[lottery];
    if (!data) return [];
    
    const numbers = [];
    while (numbers.length < data.minNumbers) {
        const num = Math.floor(Math.random() * data.totalNumbers) + 1;
        if (!numbers.includes(num)) {
            numbers.push(num);
        }
    }
    return numbers.sort((a, b) => a - b);
}


function validateBet(lottery, selectedNumbers) {
    const data = loteriasData[lottery];
    if (!data) return { valid: false, message: 'Loteria inválida' };
    
    if (selectedNumbers.length < data.minNumbers) {
        return {
            valid: false,
            message: `Selecione pelo menos ${data.minNumbers} números`
        };
    }
    
    if (selectedNumbers.length > data.maxNumbers) {
        return {
            valid: false,
            message: `Selecione no máximo ${data.maxNumbers} números`
        };
    }
    
    const invalidNumbers = selectedNumbers.filter(n => n < 1 || n > data.totalNumbers);
    if (invalidNumbers.length > 0) {
        return {
            valid: false,
            message: `Números inválidos: ${invalidNumbers.join(', ')}`
        };
    }
    
    return {
        valid: true,
        message: 'Aposta válida',
        price: calculateBetPrice(lottery, selectedNumbers.length)
    };
}


function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}


function getLotteryInfo(lottery) {
    return loteriasData[lottery] || null;
}


function calculateOdds(lottery, numNumbers) {
    const data = loteriasData[lottery];
    if (!data) return 0;
    
    
    const totalCombinations = factorial(data.totalNumbers) / 
        (factorial(data.minNumbers) * factorial(data.totalNumbers - data.minNumbers));
    
    const selectedCombinations = factorial(numNumbers) / 
        (factorial(data.minNumbers) * factorial(numNumbers - data.minNumbers));
    
    return (selectedCombinations / totalCombinations * 100).toFixed(6);
}


window.LoteriasSystem = {
    data: loteriasData,
    calculateBetPrice,
    calculateBolaoPrice,
    generateRandomNumbers,
    validateBet,
    formatCurrency,
    getLotteryInfo,
    calculateOdds
};


console.log('🎰 Sistema de Loterias carregado com sucesso!');
console.log('📊 Modalidades disponíveis:', Object.keys(loteriasData).length);
