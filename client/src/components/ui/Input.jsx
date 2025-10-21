import React from 'react';

/**
 * A reusable, styled input component.
 */
export default function Input({ className = '', ...props }) {
    return (
        <input
            // Merges default styles with any custom classes passed in via props
            className={`w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${className}`}
            
            // Spreads any other props (e.g., type, placeholder, value, onChange) onto the input element
            {...props}
        />
    );
}