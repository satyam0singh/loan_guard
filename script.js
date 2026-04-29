document.getElementById('loanForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submitBtn');
    const loader = document.getElementById('loader');
    const btnText = submitBtn.querySelector('span');
    
    // UI state: Loading
    btnText.style.opacity = '0.5';
    loader.style.display = 'block';
    submitBtn.disabled = true;

    const formData = {
        name: document.getElementById('name').value,
        age: document.getElementById('age').value,
        income: document.getElementById('income').value,
        loan_amount: document.getElementById('loan_amount').value,
        credit_score: document.getElementById('credit_score').value,
        employment_years: document.getElementById('employment_years').value,
        education: document.getElementById('education').value,
        housing: document.getElementById('housing').value
    };

    try {
        const response = await fetch('http://127.0.0.1:5000/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();
        
        if (response.ok) {
            showResult(result.status, formData.name);
        } else {
            alert('Error: ' + (result.error || 'Something went wrong'));
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Could not connect to the server. Please make sure the Flask app is running.');
    } finally {
        // UI state: Reset
        btnText.style.opacity = '1';
        loader.style.display = 'none';
        submitBtn.disabled = false;
    }
});

function showResult(status, name) {
    const modal = document.getElementById('resultModal');
    const icon = document.getElementById('resultIcon');
    const title = document.getElementById('resultTitle');
    const message = document.getElementById('resultMessage');

    modal.classList.remove('hidden');

    if (status === 'Eligible') {
        icon.innerHTML = '✅';
        icon.style.color = '#10b981';
        title.innerText = 'Congratulations!';
        message.innerText = `Great news, ${name}! Based on our AI analysis, you are highly likely to be eligible for this loan.`;
    } else {
        icon.innerHTML = '❌';
        icon.style.color = '#ef4444';
        title.innerText = 'Application Declined';
        message.innerText = `We're sorry, ${name}. Based on the current risk assessment, you are not eligible for this loan at this time.`;
    }
}

function closeModal() {
    document.getElementById('resultModal').classList.add('hidden');
    document.getElementById('loanForm').reset();
}
