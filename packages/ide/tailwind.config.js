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
                'gray-bd3': '#F3F3F3',
                'gray-bg': '#F8F8F8',
                'gray-role': '#D9D9D9',
                'gray-chat': '#414040',
                'gray-ph': '#7A7A7A',
                'gray-node': '#979797',
                'gray-end': '#F1F1F1',
                'black-bg': '#161817',
                'teal-node': '#4BA65B',
            },
            spacing: {
                'full-menu': '316px',
                'mini-menu': '78px',
                'chat': '508px',
            },
            boxShadow: {
                'chat': '0px 4px 6px 2px rgba(214, 214, 214, 0.25)',
                'node': '0px 1px 4px rgba(174, 174, 174, 0.25)',
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