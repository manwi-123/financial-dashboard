const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/financialDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.error("Failed to connect to MongoDB", err));

// Financial Data Schema
const financialSchema = new mongoose.Schema({
    income: { type: Number, required: true, min: 0 },
    expenses: { type: Number, required: true, min: 0 },
    savings: { type: Number, required: true, min: 0 },
});

const FinancialData = mongoose.model('FinancialData', financialSchema);
// POST: Store financial data and generate advice
app.post('/api/financial-data', async (req, res) => {
    const { income, expenses, savings } = req.body;

    // Basic algorithm for financial advice
    let advice = '';

    if (savings < 0.1 * income) {
        advice += "Your savings are less than 10% of your income. Consider saving more.\n";
    }
    
    if (expenses > 0.8 * income) {
        advice += "Your expenses exceed 80% of your income. Try cutting down on discretionary spending.\n";
    }

    if (!advice) advice = "You're in good financial shape!";

    try {
        const financialData = new FinancialData({ income, expenses, savings });
        await financialData.save();
        res.json({ financialData, advice });
    } catch (err) {
        res.status(500).send("Error saving financial data: " + err.message);
    }
});

// GET: Retrieve user financial data and advice
app.get('/api/financial-data/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const financialData = await FinancialData.findById(id);
        if (!financialData) return res.status(404).send("Financial data not found.");

        res.json(financialData);
    } catch (err) {
        res.status(500).send("Error retrieving financial data: " + err.message);
    }
});

// Start the server
const port = 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
