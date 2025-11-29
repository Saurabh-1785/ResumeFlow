import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const VerifyEmail = () => {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const { verifyEmail } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await verifyEmail(email, otp);
            navigate('/dashboard');
        } catch (err) {
            setError(err);
        }
    };

    if (!email) {
        return <div className="text-center mt-20">No email provided. Please register first.</div>;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-gray-900 p-4">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-200 dark:border-gray-700">
                <h2 className="text-3xl font-bold text-center mb-6 text-yellow-800 dark:text-yellow-500">Verify Email</h2>
                <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
                    We sent an OTP to <strong>{email}</strong>
                </p>

                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 dark:text-gray-300 mb-1">Enter OTP</label>
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 outline-none text-center tracking-widest text-2xl"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-yellow-800 hover:bg-yellow-900 text-white font-bold rounded-lg transition-colors"
                    >
                        Verify
                    </button>
                </form>
            </div>
        </div>
    );
};

export default VerifyEmail;
