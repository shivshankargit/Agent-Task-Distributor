import React from 'react';

export default function Button({
    children,
    type = 'button',
    variant = 'primary',
    className = '',
    ...props
}) {

    // Define base styles
    const baseStyle = "w-full px-4 py-2 text-lg font-semibold rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2";

    // Define variant styles
    const styles = {
        primary: "text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
        secondary: "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:ring-blue-500"
    };

    return (
        <button
            type={type}
            className={`${baseStyle} ${styles[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}