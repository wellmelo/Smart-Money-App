if (!isNewTransaction()) {
    const uid = getTransactionUid();
    findTransactionByUid(uid);
}

function getTransactionUid() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('uid');
}

function isNewTransaction() {
    return getTransactionUid() ? false : true;
}

function logout() {
    firebase
        .auth()
        .signOut()
        .then(() => {
            window.location.href = '/';
        })
        .catch(() => {
            alert('Erro ao fazer logout');
        });
}

function findTransactionByUid(uid) {
    showLoading();

    transactionService
        .findById(uid)
        .then((transaction) => {
            hideLoading();
            if (transaction) {
                fillTransactionScreen(transaction);
                toggleSaveButtonDisable();
            } else {
                alert('Documento nao encontrado');
                window.location.href = '/pages/home';
            }
        })
        .catch(() => {
            hideLoading();
            alert('Erro ao recuperar documento');
            window.location.href = '/pages/home';
        });
}

function fillTransactionScreen(transaction) {
    if (transaction.type == 'expense') {
        form.typeExpense().checked = true;
    } else {
        form.typeIncome().checked = true;
    }

    form.date().value = transaction.date;
    form.currency().value = transaction.money.currency;
    form.value().value = transaction.money.value;
    form.transactionType().value = transaction.transactionType;

    if (transaction.description) {
        form.description().value = transaction.description;
    }
}

function saveTransaction() {
    const transaction = createTransaction();

    if (isNewTransaction()) {
        save(transaction);
    } else {
        update(transaction);
    }
}

function save(transaction) {
    showLoading();

    transactionService
        .save(transaction)
        .then(() => {
            hideLoading();
            window.location.href = '/pages/home';
        })
        .catch(() => {
            hideLoading();
            alert('Erro ao salvar transaçao');
        });
}

function cancelTransaction() {
    window.location.href = '/pages/home';
}

function update(transaction) {
    showLoading();
    transactionService
        .update(transaction)
        .then(() => {
            hideLoading();
            window.location.href = '/pages/home';
        })
        .catch(() => {
            hideLoading();
            alert('Erro ao atualizar transaçao');
        });
}

function createTransaction() {
    return {
        type: form.typeExpense().checked ? 'expense' : 'income',
        date: form.date().value,
        money: {
            currency: form.currency().value,
            value: parseFloat(form.value().value),
        },
        transactionType: form.transactionType().value,
        description: form.description().value,
        user: {
            uid: firebase.auth().currentUser.uid,
        },
    };
}

function onChangeDate() {
    const date = form.date().value;
    form.dateRequiredError().style.display = !date ? 'block' : 'none';

    toggleSaveButtonDisable();
}

function onChangeValue() {
    const value = form.value().value;
    form.valueRequiredError().style.display = !value ? 'block' : 'none';

    form.valueLessOrEqualToZeroError().style.display =
        value <= 0 ? 'block' : 'none';

    toggleSaveButtonDisable();
}

function onChangeTransactionType() {
    const transactionType = form.transactionType().value;
    form.transactionTypeRequiredError().style.display = !transactionType
        ? 'block'
        : 'none';

    toggleSaveButtonDisable();
}

function toggleSaveButtonDisable() {
    form.saveButton().disabled = !isFormValid();
}

function isFormValid() {
    const date = form.date().value;
    if (!date) {
        return false;
    }

    const value = form.value().value;
    if (!value || value <= 0) {
        return false;
    }

    const transactionType = form.transactionType().value;
    if (!transactionType) {
        return false;
    }

    return true;
}

const form = {
    currency: () => document.getElementById('currency'),
    date: () => document.getElementById('date'),
    description: () => document.getElementById('description'),
    dateRequiredError: () => document.getElementById('date-required-error'),
    saveButton: () => document.getElementById('save-button'),
    transactionType: () => document.getElementById('transaction-type'),
    transactionTypeRequiredError: () =>
        document.getElementById('transaction-type-required-error'),
    typeExpense: () => document.getElementById('expense'),
    typeIncome: () => document.getElementById('income'),
    value: () => document.getElementById('value'),
    valueRequiredError: () => document.getElementById('value-required-error'),
    valueLessOrEqualToZeroError: () =>
        document.getElementById('value-less-or-equal-to-zero-error'),
};

/*
// Obtém os elementos do DOM
const expenseRadio = document.getElementById('expense');
const incomeRadio = document.getElementById('income');
const expenseSelect = document.getElementById('expense-select');
const incomeSelect = document.getElementById('income-select');

// Função para ocultar o select não selecionado
function hideUnselectedSelect() {
    if (expenseRadio.checked) {
        incomeSelect.style.display = 'none'; // Oculta o select de receita
    } else if (incomeRadio.checked) {
        expenseSelect.style.display = 'none'; // Oculta o select de despesa
    }
}

// Ovinte de evento para monitorar as alterações nos botões de rádio
expenseRadio.addEventListener('change', function () {
    expenseSelect.style.display = 'block'; // Exibe o select de despesa
    incomeSelect.style.display = 'none'; // Oculta o select de receita
});

incomeRadio.addEventListener('change', function () {
    expenseSelect.style.display = 'none'; // Oculta o select de despesa
    incomeSelect.style.display = 'block'; // Exibe o select de receita
});

// Oculta o select não selecionado ao carregar a página
hideUnselectedSelect();
*/
