import React, { useState } from 'react';
import axios from 'axios';

const FinancialDashboard = () => {
    const [income, setIncome] = useState(0);
    const [expenses, setExpenses] = useState(0);
    const [savings, setSavings] = useState(0);
    const [advice, setAdvice] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const financialData = { income, expenses, savings };
        
        try {
            const response = await axios.post('http://localhost:5000/api/financial-data', financialData);
            setAdvice(response.data.advice);
        } catch (err) {
            console.error("Error submitting data", err);
        }
    };

    return (
        <div>
            <h2>Financial Dashboard</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Income:
                    <input type="number" value={income} onChange={(e) => setIncome(e.target.value)} required />
                </label>
                <br />
                <label>
                    Expenses:
                    <input type="number" value={expenses} onChange={(e) => setExpenses(e.target.value)} required />
                </label>
                <br />
                <label>
                    Savings:
                    <input type="number" value={savings} onChange={(e) => setSavings(e.target.value)} required />
                </label>
                <br />
                <button type="submit">Submit</button>
            </form>
            {advice && <div><h3>Financial Advice:</h3><p>{advice}</p></div>}
        </div>
    );
};

export default FinancialDashboard;
