/** @type {import('tailwindcss').Config} */

import formPlugin from '@tailwindcss/forms'

export default {
    content: [
        "./index.html",
        "./graph.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {},
    },
    plugins: [
        formPlugin,
    ],
}