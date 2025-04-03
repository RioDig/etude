/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      transparent: "transparent",
      white: "#FFFFFF",
      black: "#000000",
      blue: {
        900: "#0D47A1",
        800: "#0F56BD",
        700: "#1066D8",
        600: "#1877EE",
        500: "#338AF1",
        400: "#4E9DF3",
        300: "#69AEF5",
        200: "#84BFF7",
        100: "#A0CFF9",
        50: "#BBDEFB",
      },
      mono: {
        950: "#2D2D2D",
        900: "#515151",
        800: "#727272",
        700: "#909090",
        600: "#AAAAAA",
        500: "#C1C1C1",
        400: "#D4D4D4",
        300: "#E3E3E3",
        200: "#EFEFEF",
        100: "#F8F8F8",
        50: "#FDFDFD",
        25: "#FFFFFF",
      },
      purple: {
        900: "#281B5F",
        800: "#382584",
        700: "#492EA9",
        600: "#5C3ACB",
        500: "#7C5ED6",
        400: "#9B83E0",
        300: "#B9A7EA",
        200: "#D8CCF3",
        100: "#F5F2FC",
      },
      red: {
        900: "#5B2B2B",
        800: "#803232",
        700: "#A83535",
        600: "#CE3B3B",
        500: "#DF5656",
        400: "#EC7474",
        300: "#F69696",
        200: "#FCBBBB",
        100: "#FFE4E4",
      },
      green: {
        900: "#10291D",
        800: "#1D4F34",
        700: "#297748",
        600: "#359F57",
        500: "#43C464",
        400: "#68D37D",
        300: "#8EE099",
        200: "#B6ECB9",
        100: "#DEF7DE",
      },
      yellow: {
        900: "#794100",
        800: "#A55D00",
        700: "#D17C00",
        600: "#FD9D00",
        500: "#FFB42A",
        400: "#FFC856",
        300: "#FFDA82",
        200: "#FFE9AE",
        100: "#FFF6DA",
      },
    },
    fontFamily: {
      sansSerif: ['Inter', 'sans-serif'],
    },
    // Обновленная типографика на основе дизайн-системы из Figma
    fontSize: {
      // Heading styles
      'h1': ['32px', {
        lineHeight: '100%',
        fontWeight: 600, // SemiBold
      }],
      'h2': ['24px', {
        lineHeight: '140%',
        fontWeight: 600, // SemiBold
      }],
      'h2-regular': ['24px', {
        lineHeight: '140%',
        fontWeight: 400, // Regular
      }],

      // Body styles
      'b1': ['20px', {
        lineHeight: '130%',
        fontWeight: 500, // Medium
      }],
      'b2': ['18px', {
        lineHeight: '130%',
        fontWeight: 500, // Medium
      }],
      'b2-regular': ['18px', {
        lineHeight: '130%',
        fontWeight: 400, // Regular
      }],
      'b3-semibold': ['16px', {
        lineHeight: '130%',
        fontWeight: 600, // SemiBold
      }],
      'b3': ['16px', {
        lineHeight: '130%',
        fontWeight: 500, // Medium
      }],
      'b3-regular': ['16px', {
        lineHeight: '130%',
        fontWeight: 400, // Regular
      }],
      'b4-semibold': ['14px', {
        lineHeight: '130%',
        fontWeight: 600, // SemiBold
      }],
      'b4': ['14px', {
        lineHeight: '130%',
        fontWeight: 500, // Medium
      }],
      'b4-regular': ['14px', {
        lineHeight: '130%',
        fontWeight: 400, // Regular
      }],
      'b4-light': ['14px', {
        lineHeight: '130%',
        fontWeight: 300, // Light
      }],
      'b5': ['12px', {
        lineHeight: '130%',
        fontWeight: 400, // Regular
      }],
    },
    extend: {
      // Добавляем custom тени для компонента Hint
      boxShadow: {
        'hint': '0px 0px 13px 0px rgba(0, 0, 0, 0.06)',
      },
      // Добавляем специфические размеры для компонентов
      height: {
        'tag-md': '26px',
        'tag-sm': '22px',
      },
      // Добавляем специфичные z-индексы
      zIndex: {
        'hint': '50',
      },
      // Добавляем transition durations для Hint
      transitionDuration: {
        '100': '100ms',
      },
      // Добавляем спейсинги специфические для компонентов
      spacing: {
        '6-hint': '6px', // border-radius для Hint
      },
      // Определение специфических opacity значений
      opacity: {
        '5': '0.05',  // для tag background
        '20': '0.20', // для tag border
      },
      animation: {
        'hint-appear': 'hintAppear 100ms ease',
        'hint-disappear': 'hintDisappear 100ms ease',
      },
      keyframes: {
        hintAppear: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        hintDisappear: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
      },
    },
  },
  variants: {
    extend: {
      textDecoration: ['focus-visible'],
      opacity: ['disabled'],
      cursor: ['disabled'],
      pointerEvents: ['disabled'],
    }
  },
  plugins: [],
};
