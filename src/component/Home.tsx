import React, { useEffect, useState } from 'react';

const Home: React.FC = () => {
    const [amount, setAmount] = useState<number | ''>(1); // Use '' instead of undefined
    const [convertedAmount, setConvertedAmount] = useState<string>('');
    const [fromCurrency, setFromCurrency] = useState<string>('INR');
    const [toCurrency, setToCurrency] = useState<string>('USD');
    const [rate, setRate] = useState<Record<string, number>>({});
    const [currencies, setCurrencies] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const API_KEY = import.meta.env.VITE_API_KEY;

    useEffect(() => {
        const fetchRates = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${fromCurrency}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setRate(data.conversion_rates);
                setCurrencies(Object.keys(data.conversion_rates)); // Set available currencies
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchRates();
    }, [fromCurrency]);

    const handleConvert = () => {
        if (amount !== '' && rate[toCurrency] !== undefined) {
            const result = Number(amount) * rate[toCurrency];
            setConvertedAmount(result.toFixed(2));
        } else {
            setConvertedAmount('0.0');
        }
    };

    const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setAmount(value === '' ? '' : Number(value)); // Handle empty string and convert to number
    };

    const handleFromCurrencyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setFromCurrency(event.target.value);
    };

    const handleToCurrencyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setToCurrency(event.target.value);
    };

    return (
        <div className='main-div min-h-screen'>
            {/* heading */}
            <div>
                <h1 className="text-4xl font-bold text-center">Currency Converter</h1>
            </div>

            <div className="flex flex-col gap-y-6 mx-auto justify-center items-center mt-11">
                <div>
                    <label htmlFor="price">Enter Amount: </label>
                    <input
                        type="number"
                        name="price"
                        className="border p-1 border-black rounded-xl ml-1"
                        value={amount}
                        onChange={handleAmountChange}
                    />
                </div>

                {/* Convert from option dropdown */}
                <div>
                    <label>Convert From:</label>
                    <select
                        className="border p-1 border-black w-[190px] ml-2 rounded-xl"
                        value={fromCurrency}
                        onChange={handleFromCurrencyChange}
                    >
                        {currencies.map(currency => (
                            <option key={currency} value={currency}>
                                {currency}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Convert to option dropdown */}
                <div>
                    <label>Convert To:</label>
                    <select
                        className="border border-blackp-1 w-[190px] ml-7 rounded-xl"
                        value={toCurrency}
                        onChange={handleToCurrencyChange}
                    >
                        {currencies.map(currency => (
                            <option key={currency} value={currency}>
                                {currency}
                            </option>
                        ))}
                    </select>
                    <br />
                </div>

                <div>
                    <label htmlFor="convertedAmount">Converted Amount: </label>
                    <input
                        type="text"
                        name="convertedAmount"
                        className="border border-black p-1 rounded-xl ml-1 w-[150px]"
                        value={convertedAmount}
                        readOnly
                    />
                </div>

                <div>
                    <button
                        className="border border-black px-[80px] py-[8px] mt-9 font-bold rounded-md"
                        onClick={handleConvert}
                        disabled={loading}
                    >
                        {loading ? 'Converting...' : 'Convert'}
                    </button>
                </div>

                {error && <div className="text-red-500 mt-2">{error}</div>}
            </div>
        </div>
    );
};

export default Home;
