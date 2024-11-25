document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('creditCardForm');
  const formSection = document.getElementById('formSection');
  const successSection = document.getElementById('successSection');
  const cardName = document.getElementById('cardName');
  const cardNumber = document.getElementById('cardNumber');
  const expMonth = document.getElementById('expMonth');
  const expYear = document.getElementById('expYear');
  const cvc = document.getElementById('cvc');

  // Elementos de exibição do cartão
  const cardNumberDisplay = document.getElementById('cardNumberDisplay');
  const cardNameDisplay = document.getElementById('cardNameDisplay');
  const cardExpiryDisplay = document.getElementById('cardExpiryDisplay');
  const cardCvcDisplay = document.getElementById('cardCvcDisplay');

  // Formatação do número do cartão
  cardNumber.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 0) {
      value = value.match(/.{1,4}/g).join(' ');
    }
    e.target.value = value;
    cardNumberDisplay.textContent = value || '0000 0000 0000 0000';
    validateCardNumber();
  });

  // Atualização em tempo real do nome
  cardName.addEventListener('input', function(e) {
    cardNameDisplay.textContent = e.target.value || 'Jane Appleseed';
  });

  // Limitar quantidade de dígitos para mês e ano
  expMonth.addEventListener('input', function(e) {
    if (e.target.value.length > 2) {
      e.target.value = e.target.value.slice(0, 2);
    }
    updateExpiry();
  });

  expYear.addEventListener('input', function(e) {
    if (e.target.value.length > 2) {
      e.target.value = e.target.value.slice(0, 2);
    }
    updateExpiry();
  });

  // Atualização em tempo real da data de expiração
  function updateExpiry() {
    const month = expMonth.value.padStart(2, '0');
    const year = expYear.value.padStart(2, '0');
    cardExpiryDisplay.textContent = `${month}/${year}`;
  }

  // Limitar quantidade de dígitos para CVC e atualizar display
  cvc.addEventListener('input', function(e) {
    if (e.target.value.length > 3) {
      e.target.value = e.target.value.slice(0, 3);
    }
    cardCvcDisplay.textContent = e.target.value || '000';
  });

  function validateCardNumber() {
    const value = cardNumber.value.replace(/\s/g, '');
    const isValid = /^\d{16}$/.test(value);
    
    if (!value) {
      showError(cardNumber, 'numberError', "Can't be blank");
      return false;
    } else if (!isValid) {
      showError(cardNumber, 'numberError', 'Invalid card code');
      return false;
    }
    hideError(cardNumber, 'numberError');
    return true;
  }

  function validateName() {
    if (!cardName.value.trim()) {
      showError(cardName, 'nameError', "Can't be blank");
      return false;
    }
    hideError(cardName, 'nameError');
    return true;
  }

  function validateExpiry() {
    const month = expMonth.value;
    const year = expYear.value;
    
    if (!month || !year) {
      showError(expMonth, 'dateError', "Can't be blank");
      expMonth.classList.add('error');
      expYear.classList.add('error');
      return false;
    }
    
    const monthNum = parseInt(month);
    const yearNum = parseInt(year);
    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;

    if (monthNum < 1 || monthNum > 12) {
      showError(expMonth, 'dateError', 'Invalid month');
      return false;
    }

    if (yearNum < currentYear || (yearNum === currentYear && monthNum < currentMonth)) {
      showError(expYear, 'dateError', 'Card expired');
      return false;
    }

    hideError(expMonth, 'dateError');
    expMonth.classList.remove('error');
    expYear.classList.remove('error');
    return true;
  }

  function validateCVC() {
    const value = cvc.value;
    if (!value) {
      showError(cvc, 'cvcError', "Can't be blank");
      return false;
    }
    if (!/^\d{3}$/.test(value)) {
      showError(cvc, 'cvcError', 'Wrong format');
      return false;
    }
    hideError(cvc, 'cvcError');
    return true;
  }

  // Evento de submit do formulário
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const isNameValid = validateName();
    const isCardNumberValid = validateCardNumber();
    const isExpiryValid = validateExpiry();
    const isCVCValid = validateCVC();

    if (isNameValid && isCardNumberValid && isExpiryValid && isCVCValid) {
      formSection.style.display = 'none';
      successSection.style.display = 'flex';
    }
  });

  // Validação em tempo real
  cardName.addEventListener('blur', validateName);
  cardNumber.addEventListener('blur', validateCardNumber);
  expMonth.addEventListener('blur', validateExpiry);
  expYear.addEventListener('blur', validateExpiry);
  cvc.addEventListener('blur', validateCVC);

  function showError(input, errorId, message) {
    input.classList.add('error');
    const errorElement = document.getElementById(errorId);
    errorElement.textContent = message;
    errorElement.style.display = 'block';
  }

  function hideError(input, errorId) {
    input.classList.remove('error');
    document.getElementById(errorId).style.display = 'none';
  }

  // Função para resetar o formulário
  window.resetForm = function() {
    form.reset();
    cardNumberDisplay.textContent = '0000 0000 0000 0000';
    cardNameDisplay.textContent = 'Jane Appleseed';
    cardExpiryDisplay.textContent = '00/00';
    cardCvcDisplay.textContent = '000';
    
    const inputs = form.querySelectorAll('input');
    inputs.forEach(input => input.classList.remove('error'));
    const errors = form.querySelectorAll('.error-message');
    errors.forEach(error => error.style.display = 'none');
    successSection.style.display = 'none';
    formSection.style.display = 'block';
  };
});