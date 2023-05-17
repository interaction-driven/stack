/** @type {import('tailwindcss').Config} */

import formPlugin from '@tailwindcss/forms';
const defaultTheme = require('tailwindcss/defaultTheme');

export default {
    content: [
        "./index.html",
        "./graph.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'gray-nor': '#696969',
                'gray-sel': '#0E0E0E',
                'gray-bd1': '#F0F0F0',
                'gray-bd2': '#F2F2F2',
                'gray-bg': '#F8F8F8',
                'gray-chat': '#414040',
                'gray-ph': '#7A7A7A',
                'black-bg': '#161817',
            },
            spacing: {
                'full-menu': '316px',
                'mini-menu': '78px',
                'chat': '508px',
            },
            boxShadow: {
                'chat': '0px 4px 6px 2px rgba(214, 214, 214, 0.25)'
            },
            fontFamily: {
                sans: ['Inter', ...defaultTheme.fontFamily.sans],
            },
        },
    },
    plugins: [
        formPlugin,
    ],
};