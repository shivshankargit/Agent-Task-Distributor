import React from 'react';

export default function Card({ title, description, children, className = '' }) {
    return (
        <div className={`bg-white rounded-xl shadow-lg ${className}`}>
            {/* Card Header (only shows if title is provided) */}
            {title && (
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
                    {description && (
                        <p className="mt-1 text-sm text-gray-600">{description}</p>
                    )}
                </div>
            )}

            {/* Card Body */}
            <div className="p-6">
                {children}
            </div>
        </div>
    );
}