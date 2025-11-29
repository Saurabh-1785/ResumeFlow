import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import TemplateSelector from '../components/TemplateSelector';

const Home = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleTemplateSelect = (templateId) => {
        if (user) {
            navigate('/dashboard', { state: { templateId } });
        } else {
            navigate('/login', { state: { from: '/dashboard', templateId } });
        }
    };

    return (
        <div className="min-h-screen bg-stone-50 dark:bg-gray-900 transition-colors duration-500 font-sans selection:bg-yellow-200 dark:selection:bg-yellow-900 flex flex-col items-center justify-center p-4">
            {/* Decorative backgrounds */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-yellow-200/20 dark:bg-yellow-900/10 blur-[100px] animate-pulse" style={{ animationDuration: '8s' }} />
                <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] rounded-full bg-blue-200/20 dark:bg-blue-900/10 blur-[100px] animate-pulse" style={{ animationDuration: '10s' }} />
            </div>

            <div className="relative flex flex-col items-center justify-center max-w-4xl mx-auto text-center z-10 animate-fadeIn mt-20">
                <div className="mb-12 relative">
                    <div className="absolute -inset-4 bg-yellow-500/20 dark:bg-yellow-500/10 rounded-full blur-3xl opacity-50 animate-pulse"></div>
                    <h1 className="relative text-[clamp(3.5rem,8vw,6rem)] font-abril text-yellow-800 dark:text-yellow-500 mb-6 font-bold tracking-tight leading-none drop-shadow-sm">
                        ResumeFlow
                    </h1>
                </div>

                <p className="text-[clamp(1.25rem,2.5vw,1.75rem)] font-sans font-light text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed mb-12">
                    Craft a professional, ATS-optimized resume in minutes with the power of AI.
                    <span className="block mt-2 font-medium text-yellow-800 dark:text-yellow-500">Simple. Smart. Effective.</span>
                </p>

                <Link
                    to={user ? "/dashboard" : "/register"}
                    className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-300 bg-yellow-800 dark:bg-yellow-600 rounded-full hover:bg-yellow-900 dark:hover:bg-yellow-500 hover:scale-105 shadow-xl hover:shadow-2xl hover:shadow-yellow-900/30"
                >
                    <span className="mr-2">Get Started</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 group-hover:translate-x-1 transition-transform">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                </Link>

                <div className="mt-8">
                    <Link to="/login" className="text-yellow-800 dark:text-yellow-500 hover:underline">Already have an account? Sign In</Link>
                </div>

                <div className="mt-16 w-full">
                    <TemplateSelector onSelect={handleTemplateSelect} />
                </div>
            </div>
        </div>
    );
};

export default Home;
