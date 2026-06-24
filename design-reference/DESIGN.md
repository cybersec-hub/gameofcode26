---
name: Clinical Precision
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#45464d'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#712ae2'
  on-secondary: '#ffffff'
  secondary-container: '#8a4cfc'
  on-secondary-container: '#fffbff'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#001f26'
  on-tertiary-container: '#0090a9'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#eaddff'
  secondary-fixed-dim: '#d2bbff'
  on-secondary-fixed: '#25005a'
  on-secondary-fixed-variant: '#5a00c6'
  tertiary-fixed: '#acedff'
  tertiary-fixed-dim: '#4cd7f6'
  on-tertiary-fixed: '#001f26'
  on-tertiary-fixed-variant: '#004e5c'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style
The design system is engineered for a high-fidelity healthcare technology environment, blending the authoritative structure of enterprise consulting with the fluid innovation of an AI startup. The brand personality is **composed, intelligent, and vigilant**. It avoids the sterile coldness of traditional medical software by utilizing a "Humanist-Tech" aesthetic—merging precise data visualization with soft, approachable interface elements.

The visual direction utilizes **Soft Glassmorphism**. This approach uses translucency and backdrop blurs to create a sense of depth and lightness, suggesting that the AI "floats" above the data to provide insights. The emotional response is one of reassurance and clarity, ensuring users feel they are in a safe, professional, and technologically advanced space for wellbeing.

## Colors
The palette is rooted in **Trustworthy Healthcare Tones**, prioritizing stability and high-contrast accessibility.

*   **Primary (Deep Navy):** Used for core branding, navigation backgrounds, and high-emphasis text. It provides the "anchor" for the professional aesthetic.
*   **Secondary (Soft Lavender):** Used for supportive elements and secondary actions, adding a calming, humanist touch to the clinical interface.
*   **Accent (Vibrant Cyan):** Reserved specifically for **AI-powered features** and interventions. This "electric" tone signals technological intelligence.
*   **System Colors:** Success (Emerald 600), Warning (Amber 500), and Error (Rose 600) follow standard WCAG AA accessibility ratios against the neutral background.
*   **Surfaces:** Backgrounds utilize a soft-tinted white (`#F8FAFC`) to reduce eye strain compared to pure white, while keeping the interface feeling "medical-grade" clean.

## Typography
This design system utilizes **Inter** exclusively to achieve a systematic, utilitarian, and highly legible look. The typography relies on tight tracking for headlines to create a modern "Stripe-like" editorial feel, while body text maintains generous leading for readability in health-related contexts.

Large display sizes scale down specifically for mobile to ensure clinical data and alerts remain within the viewport without excessive scrolling. Weights are used strategically: **Bold (700)** for primary hierarchy, **Medium (500)** for interactive labels, and **Regular (400)** for long-form health content.

## Layout & Spacing
The layout follows a **Fluid Grid System** with a strict 4px baseline rhythm. 

*   **Desktop:** 12-column grid with 24px gutters. Content is centered with a max-width of 1280px to maintain readability on ultra-wide monitors.
*   **Tablet:** 8-column grid with 24px gutters and 32px side margins.
*   **Mobile:** 4-column grid with 16px gutters and 16px side margins.

Vertical rhythm is managed through a "Stack" system (`stack-sm`, `md`, `lg`) to ensure consistent breathing room between content blocks. Components like glassmorphic cards should utilize `stack-md` for internal padding to maintain a premium, spacious feel.

## Elevation & Depth
Depth is expressed through **Glassmorphic Layering** rather than traditional heavy shadows. 

1.  **Base Layer:** The soft-tinted background (`#F8FAFC`).
2.  **Card Layer:** Semi-transparent white (`rgba(255, 255, 255, 0.7)`) with a `backdrop-filter: blur(12px)`. These cards use a 1px solid border (`rgba(255, 255, 255, 0.5)`) on the top/left and a slightly darker border on the bottom/right to simulate a physical edge.
3.  **Floating Layer:** Used for modals and AI tooltips. These utilize a diffused ambient shadow: `0 20px 25px -5px rgba(15, 23, 42, 0.1)`.

This hierarchy ensures that AI interventions (the "floating" layer) feel more urgent and accessible than the underlying historical data.

## Shapes
The shape language is defined by **Large, Modern Radii**. 

*   **Standard Components:** Buttons and input fields use `0.5rem` (8px) for a professional but soft feel.
*   **Containers:** Cards and large layout sections use `rounded-lg` (16px) or `rounded-xl` (24px) to emphasize the modern startup aesthetic.
*   **AI Elements:** Elements specifically generated by the AI (like insight chips) may use pill-shaping to distinguish them from standard system data.

## Components
*   **Buttons:** Primary buttons use a solid Deep Navy fill with white text. Secondary buttons use a Lavender tint with 10% opacity and Secondary-color text. AI-action buttons use a Cyan-to-Blue linear gradient.
*   **Glass Cards:** The signature component. Always includes a subtle internal padding of 24px and the defined backdrop blur.
*   **Chips:** Used for health metrics (e.g., "Stable," "Action Required"). Use a high-saturation background at 10% opacity with 100% opacity text for the label.
*   **Input Fields:** Ghost-style borders (1px solid `#E2E8F0`) that transition to a 2px Cyan border on focus, signaling the AI is "listening" or processing the input.
*   **Lists:** Data-heavy lists should use "Zebra-striping" with very low-contrast fills (`#F1F5F9`) instead of borders to keep the UI clean.
*   **Progress Bars:** Thin, high-precision bars using the Cyan accent to show health progression or AI analysis completion.