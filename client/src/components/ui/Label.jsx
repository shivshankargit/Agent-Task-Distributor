import React from 'react';

/**
 * A reusable, styled label component.
 */
export default function Label({ htmlFor, children, className = '', ...props }) {
    return (
        <label
            // Links the label to a specific input field
            htmlFor={htmlFor}
            
            // Merges default styles with any custom classes passed in via props
            className={`block text-sm font-medium text-gray-700 ${className}`}
            
            // Spreads any other props onto the label element
            {...props}
        >
            {/* Renders the content passed inside the label (e.g., the label text) */}
            {children}
        </label>
    );
}