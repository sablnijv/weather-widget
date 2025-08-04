# Cozy Weather App

A warm and soft styled weather application that displays current weather conditions and forecasts using the OpenWeatherMap API.

## Features

- Current weather display with temperature, description, and conditions
- 5-day weather forecast
- Search functionality for any city worldwide
- Automatic location detection (with user permission)
- Responsive design that works on mobile and desktop
- Warm, soft color scheme with gradient backgrounds
- Light and Dark theme support

## Integration Guide

The weather app is now available as a modular widget that can be easily integrated into any website or application.

### Files Included

1. `weather-widget.js` - The main widget component
2. `weather-widget.css` - The widget styles
3. `integration-example.html` - Example of how to integrate the widget
4. `theme-example.html` - Example showing both light and dark themes

### How to Integrate

1. Copy the widget files to your project:
   ```
   weather-widget.js
   weather-widget.css
   ```

2. Include the CSS and JavaScript files in your HTML:
   ```html
   <!-- Include the weather widget CSS -->
   <link rel="stylesheet" href="weather-widget.css">
   
   <!-- Include the weather widget JavaScript -->
   <script src="weather-widget.js"></script>
   ```

3. Create a container element for the widget:
   ```html
   <div id="weather-container"></div>
   ```

4. Initialize the widget with JavaScript:
   ```html
   <script>
       document.addEventListener('DOMContentLoaded', function() {
           const weatherWidget = new WeatherWidget('weather-container', {
               apiKey: 'YOUR_API_KEY', // Optional: your own API key
               defaultCity: 'London',  // Optional: default city
               units: 'metric',        // Optional: 'metric' or 'imperial'
               theme: 'light'          // Optional: 'light' or 'dark'
           });
       });
   </script>
   ```

### Options

The widget accepts the following options:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `apiKey` | string | Demo key | Your OpenWeatherMap API key |
| `defaultCity` | string | 'London' | Default city to display |
| `units` | string | 'metric' | Units for temperature ('metric' or 'imperial') |
| `enableGeolocation` | boolean | true | Enable/disable geolocation |
| `theme` | string | 'light' | Widget theme ('light' or 'dark') |

### Changing Theme Dynamically

You can change the theme after initialization using the `setTheme` method:

```javascript
// Change to dark theme
weatherWidget.setTheme('dark');

// Change to light theme
weatherWidget.setTheme('light');
```

### Example

See `integration-example.html` for a complete working example.
See `theme-example.html` for examples of both light and dark themes.

## Customization

To use your own API key:

1. Sign up for a free API key at [OpenWeatherMap](https://openweathermap.org/api)
2. Pass it as an option when initializing the widget:
   ```javascript
   const weatherWidget = new WeatherWidget('weather-container', {
       apiKey: 'your_api_key_here'
   });
   ```

## File Structure

```
.
├── index.html (original version)
├── style.css (original version)
├── script.js (original version)
├── weather-widget.js (modular widget component)
├── weather-widget.css (widget styles with light/dark themes)
├── integration-example.html (integration example)
├── theme-example.html (theme example)
└── README.md
```

## Browser Support

This widget works in all modern browsers that support:
- Fetch API
- ES6 JavaScript features
- CSS3 features (gradients, animations, flexbox, grid, CSS variables)

## Notes

- The widget uses a demo API key which may have rate limits
- For production use, please register for your own free API key at OpenWeatherMap
- The widget requires an internet connection to fetch weather data
- All styling is self-contained and will not affect other elements on your page
- The dark theme uses CSS variables for easy customization