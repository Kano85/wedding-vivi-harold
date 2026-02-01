'use client';

import { createGlobalStyle } from 'styled-components';
import { weddingConfig } from '../config/wedding-config';

const watermarkId = weddingConfig.meta._jwk_watermark_id || 'JWK-NonCommercial';

/**
 * @license
 * Wedding invitation template
 * Copyright (c) 2025 Jawon Koo
 * License: CC BY-NC-ND 4.0
 * Attribution-NonCommercial-NoDerivatives
 * https://creativecommons.org/licenses/by-nc-nd/4.0/deed.ko
 * 
 * This code is for non-commercial use only.
 * Commercial use may result in legal action.
 * ID: ${watermarkId}
 */

export const GlobalStyle = createGlobalStyle`
  /* Styles applied before font loading */
  @font-face {
    font-family: 'MaruBuri';
    src: url('/fonts/MaruBuri-ExtraLight.ttf') format('truetype');
    font-weight: 200;
    font-style: normal;
    font-display: block; /* Hide text until fonts load */
  }
  
  @font-face {
    font-family: 'MaruBuri';
    src: url('/fonts/MaruBuri-Light.ttf') format('truetype');
    font-weight: 300;
    font-style: normal;
    font-display: block;
  }
  
  @font-face {
    font-family: 'MaruBuri';
    src: url('/fonts/MaruBuri-Regular.ttf') format('truetype');
    font-weight: 400;
    font-style: normal;
    font-display: block;
  }
  
  @font-face {
    font-family: 'MaruBuri';
    src: url('/fonts/MaruBuri-SemiBold.ttf') format('truetype');
    font-weight: 600;
    font-style: normal;
    font-display: block;
  }
  
  @font-face {
    font-family: 'MaruBuri';
    src: url('/fonts/MaruBuri-Bold.ttf') format('truetype');
    font-weight: 700;
    font-style: normal;
    font-display: block;
  }

  @font-face {
    font-family: 'PlayfairDisplay';
    src: url('/fonts/PlayfairDisplay-Italic.ttf') format('truetype');
    font-weight: normal;
    font-style: italic;
    font-display: block;
  }
  
  /* Prevent layout shift when fonts load */
  html, body {
    visibility: visible;
    opacity: 1;
    font-size: 16px;
  }
  
  body {
    font-family: 'MaruBuri', 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif;
    color: #333333;
    margin: 0;
    padding: 0;
    line-height: 1.6;
  }

  body::after {
    content: "${watermarkId}";
    position: fixed;
    bottom: -100px;
    right: -100px;
    opacity: 0.01;
    font-size: 8px;
    transform: rotate(-45deg);
    pointer-events: none;
    z-index: -1000;
    color: rgba(0, 0, 0, 0.02);
    user-select: none;
  }
  
  .jwk-watermark {
    position: absolute;
    opacity: 0.01;
    font-size: 1px;
    color: rgba(255, 255, 255, 0.01);
    pointer-events: none;
    user-select: none;
    z-index: -9999;
  }
  
  .wedding-container {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' opacity='0.01'%3E%3Ctext x='0' y='20' fill='rgba(0,0,0,0.03)'%3EJWK-TEMPLATE%3C/text%3E%3C/svg%3E");
  }

  :root {
    --primary-color: #F8F6F2;
    --secondary-color: #D4B996; 
    --text-dark: #333333;
    --text-medium: #666666;
    --text-light: #999999;
    --jwk-id: "${watermarkId}";
  }
`; 
