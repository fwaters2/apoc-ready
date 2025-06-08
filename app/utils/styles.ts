import { SCENARIOS } from "../constants/scenarios";

/**
 * Generates CSS variables for all scenarios from consolidated data
 * Returns a CSS string that can be injected into the document
 */
export function generateScenarioCSS(): string {
  let css = ':root {\n';
  
  // Generate CSS variables for each scenario
  SCENARIOS.forEach(scenario => {
    const { id, theme } = scenario;
    css += `  --${id}-primary: ${theme.colors.primary};\n`;
    css += `  --${id}-secondary: ${theme.colors.secondary};\n`;
    css += `  --${id}-accent: ${theme.colors.accent};\n`;
    css += `  --${id}-text: ${theme.colors.text};\n`;
    css += `  --${id}-highlight: ${theme.colors.highlight};\n`;
  });
  
  css += '}\n\n';
  
  // Generate theme classes for each scenario
  SCENARIOS.forEach(scenario => {
    const { id } = scenario;
    css += `.theme-${id} {\n`;
    css += `  --theme-primary: var(--${id}-primary);\n`;
    css += `  --theme-secondary: var(--${id}-secondary);\n`;
    css += `  --theme-accent: var(--${id}-accent);\n`;
    css += `  --theme-text: var(--${id}-text);\n`;
    css += `  --theme-highlight: var(--${id}-highlight);\n`;
    css += '}\n\n';
  });
  
  return css;
}

/**
 * Injects scenario CSS variables into the document head
 * Should be called once when the app loads
 */
export function injectScenarioStyles(): void {
  // Remove existing dynamically generated styles
  const existingStyle = document.getElementById('dynamic-scenario-styles');
  if (existingStyle) {
    existingStyle.remove();
  }
  
  // Generate the CSS
  const cssContent = generateScenarioCSS();
  console.log('🎨 Generated scenario CSS:', cssContent);
  
  // Create and inject new styles
  const style = document.createElement('style');
  style.id = 'dynamic-scenario-styles';
  style.textContent = cssContent;
  document.head.appendChild(style);
  
  console.log('✅ Dynamic scenario styles injected');
}

/**
 * Gets the CSS variables for a specific scenario
 * Useful for inline styles or CSS-in-JS
 */
export function getScenarioColors(scenarioId: string) {
  const scenario = SCENARIOS.find(s => s.id === scenarioId);
  if (!scenario) return null;
  
  return {
    primary: scenario.theme.colors.primary,
    secondary: scenario.theme.colors.secondary,
    accent: scenario.theme.colors.accent,
    text: scenario.theme.colors.text,
    highlight: scenario.theme.colors.highlight,
  };
}

/**
 * Generates CSS custom properties object for React inline styles
 * Can be spread into a style prop: style={{...getScenarioCustomProperties(scenarioId)}}
 */
export function getScenarioCustomProperties(scenarioId: string): Record<string, string> {
  const colors = getScenarioColors(scenarioId);
  if (!colors) return {};
  
  return {
    '--theme-primary': colors.primary,
    '--theme-secondary': colors.secondary,
    '--theme-accent': colors.accent,
    '--theme-text': colors.text,
    '--theme-highlight': colors.highlight,
  } as Record<string, string>;
} 