import React from 'react';

const TemplateSelector = ({ onSelect }) => {
    const templates = [
        {
            id: 'standard',
            name: 'Standard',
            description: 'Clean, professional, and versatile. The default choice for most industries.',
            color: 'bg-gray-100',
            borderColor: 'border-gray-200'
        },
        {
            id: 'elegant',
            name: 'Elegant',
            description: 'Classic serif typography with centered headers. Perfect for traditional fields.',
            color: 'bg-stone-100',
            borderColor: 'border-stone-300'
        },
        {
            id: 'modern',
            name: 'Modern',
            description: 'Bold, sans-serif design with distinct sections. Optimized for ATS and tech roles.',
            color: 'bg-blue-50',
            borderColor: 'border-blue-200'
        }
    ];

    return (
        <div className="w-full max-w-5xl mx-auto mt-12 px-4 animate-fadeIn">
            <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-200 mb-8">
                Choose Your Style
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {templates.map((template) => (
                    <button
                        key={template.id}
                        onClick={() => onSelect(template.id)}
                        className={`group relative flex flex-col h-full overflow-hidden rounded-2xl border-2 ${template.borderColor} bg-white dark:bg-gray-800 hover:border-yellow-500 dark:hover:border-yellow-500 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 text-left`}
                    >
                        {/* Preview Area Placeholder */}
                        <div className={`h-48 w-full ${template.color} dark:bg-gray-700 flex items-center justify-center relative overflow-hidden`}>
                            {/* Abstract representation of the resume style */}
                            <div className="w-32 h-40 bg-white shadow-sm transform group-hover:scale-105 transition-transform duration-500 p-2 flex flex-col gap-1">
                                {/* Header */}
                                <div className={`w-full h-4 ${template.id === 'elegant' ? 'bg-gray-800 mx-auto w-3/4' : 'bg-gray-800'} rounded-sm opacity-20`}></div>
                                <div className={`w-full h-2 ${template.id === 'elegant' ? 'bg-gray-400 mx-auto w-1/2' : 'bg-gray-400 w-2/3'} rounded-sm opacity-20 mb-2`}></div>

                                {/* Body Lines */}
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="flex flex-col gap-1 mb-1">
                                        <div className={`w-full h-1.5 ${template.id === 'modern' ? 'bg-blue-900/20' : 'bg-gray-300'} rounded-sm w-1/3`}></div>
                                        <div className="w-full h-1 bg-gray-200 rounded-sm"></div>
                                        <div className="w-full h-1 bg-gray-200 rounded-sm"></div>
                                    </div>
                                ))}
                            </div>

                            {/* Overlay on hover */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                        </div>

                        {/* Content */}
                        <div className="p-6 flex flex-col flex-grow">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-yellow-700 dark:group-hover:text-yellow-500 transition-colors">
                                {template.name}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300 flex-grow">
                                {template.description}
                            </p>

                            <div className="mt-4 flex items-center text-yellow-700 dark:text-yellow-500 font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                                Select Template
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m-4-4h18" />
                                </svg>
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default TemplateSelector;
