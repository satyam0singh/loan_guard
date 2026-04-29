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
    const content = modal.querySelector('.modal-content');

    modal.classList.remove('hidden');
    content.style.transform = 'scale(0.8) translateY(20px)';
    content.style.opacity = '0';
    
    // Trigger reflow for animation
    setTimeout(() => {
        content.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        content.style.transform = 'scale(1) translateY(0)';
        content.style.opacity = '1';
    }, 10);

    if (status === 'Eligible') {
        icon.innerHTML = '✨';
        icon.style.color = 'var(--success)';
        title.innerText = 'Congratulations!';
        message.innerText = `Great news, ${name}! Our AI analysis indicates a high probability of loan eligibility. You're on your way!`;
    } else {
        icon.innerHTML = '⚠️';
        icon.style.color = 'var(--danger)';
        title.innerText = 'Assessment Complete';
        message.innerText = `We appreciate your interest, ${name}. Currently, your profile doesn't meet the eligibility criteria for this loan.`;
    }
}

function closeModal() {
    document.getElementById('resultModal').classList.add('hidden');
    document.getElementById('loanForm').reset();
}
