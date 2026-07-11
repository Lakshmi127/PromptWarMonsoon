# MonsoonGuard AI

GenAI-Powered Global Monsoon Preparedness Platform - A full-stack web application that uses Generative AI to provide personalized, multilingual monsoon preparedness guidance to individuals, families, and communities worldwide.

## 🌧️ Features

- **Personalized Preparedness Plans** - AI generates custom plans based on family composition, disabilities, pets, medical needs, housing type, and budget
- **Weather-Aware Guidance** - Live weather data for any location worldwide with monsoon risk scoring (Low / Moderate / High / Extreme)
- **Emergency Checklists** - Dynamic, AI-generated checklists per user profile with progress tracking
- **Travel Advisories** - Route safety analysis using AI with real-time road/flight advisories
- **Multilingual Assistance** - Full UI translation via Gemini supporting 100+ languages
- **Real-Time Alerts** - Web Push Notifications for severe weather with location-based alerts
- **Community Hub** - Local shelter finder, emergency contact directory, and community resources
- **Offline Mode** - Service Worker caches all core assets for offline functionality

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Vanilla HTML5 + CSS3 + JavaScript (ES2024 modules) |
| **AI Engine** | Google Gemini 1.5 Flash API (via REST) |
| **Weather Data** | Open-Meteo API (free, global) |
| **Geolocation** | Browser Geolocation API + OpenCage Geocoder |
| **Translation** | Gemini natively (prompt-based) + stored phrase banks |
| **Alerts** | Web Push API + Service Worker |
| **Storage** | IndexedDB (local, private) |
| **Maps** | Leaflet.js + OpenStreetMap tiles |

## 📋 Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (for development)
- Optional: Gemini API key for real AI features

## 🛠️ Installation

### 1. Clone or Download

```bash
git clone <repository-url>
cd Monsoon
```

### 2. Serve the Application

The application requires a web server to run properly due to ES modules and service worker restrictions.

#### Option A: Using Python

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

#### Option B: Using Node.js

```bash
npx http-server -p 8000
```

#### Option C: Using VS Code Live Server

1. Install the "Live Server" extension
2. Right-click on `index.html`
3. Select "Open with Live Server"

### 3. Access the Application

Open your browser and navigate to:
```
http://localhost:8000
```

## 🔑 Configuration

### Gemini API Key (Optional)

The app works in demo mode without an API key. To enable real AI features:

1. Open the application
2. Click the profile icon (top right)
3. Enter your Gemini API key in the "Gemini API Key" field
4. Save your profile

**Get a free API key:** https://makersuite.google.com/app/apikey

### Location Services

The app will request location permission to provide:
- Local weather data
- Nearby shelters
- Location-specific alerts

You can deny permission and manually enter a location.

## 📱 PWA Installation

### Desktop (Chrome/Edge)

1. Open the application in Chrome or Edge
2. Click the install icon in the address bar
3. Follow the prompts

### Mobile (Android/iOS)

1. Open the application in Chrome (Android) or Safari (iOS)
2. Tap "Add to Home Screen" from the browser menu
3. Confirm installation

## 🌐 Supported Languages

The app supports 8 languages with full UI translations:

- English (en)
- हिन्दी (Hindi - hi)
- বাংলা (Bengali - bn)
- Español (Spanish - es)
- Português (Portuguese - pt)
- 日本語 (Japanese - ja)
- 中文 (Chinese - zh)
- العربية (Arabic - ar)

Additional languages can be translated dynamically using the AI engine.

## 📁 Project Structure

```
Monsoon/
├── index.html                  # Main SPA shell
├── manifest.json              # PWA manifest
├── service-worker.js         # PWA offline support
├── css/
│   ├── main.css              # Design system, tokens, animations
│   ├── components.css        # Reusable component styles
│   └── responsive.css        # Mobile-first breakpoints
├── js/
│   ├── app.js                # Main app controller, router
│   ├── ai-engine.js          # Gemini API integration
│   ├── weather.js            # Open-Meteo API + data processing
│   ├── geolocation.js        # Location services
│   ├── alerts.js             # Push notification system
│   ├── storage.js            # IndexedDB wrapper
│   ├── i18n.js              # Internationalization engine
│   ├── maps.js              # Leaflet map integration
│   ├── checklist.js          # Interactive checklist engine
│   └── pdf-export.js         # PDF generation
└── assets/
    ├── icons/                # SVG icons
    └── images/              # Generated images
```

## 🔧 Development

### Adding New Features

1. Create a new view in `index.html`
2. Add navigation button in the header
3. Create corresponding JavaScript module in `js/`
4. Add styles in `css/components.css`
5. Update the router in `js/app.js`

### Modifying AI Prompts

Edit the prompt builders in `js/ai-engine.js`:
- `buildPreparednessPrompt()`
- `buildChatPrompt()`
- `buildTravelPrompt()`
- `buildChecklistPrompt()`

### Adding New Languages

1. Add translations to `js/i18n.js` in the `getPhraseBanks()` method
2. Add language code to the supported languages list
3. Test RTL support for Arabic and other RTL languages

## 🧪 Testing

### Manual Testing Checklist

- [ ] Test location detection on different devices
- [ ] Verify weather data loads correctly
- [ ] Test all 4 language groups (Latin, Devanagari, Arabic, CJK)
- [ ] Test offline mode by disabling network
- [ ] Test on mobile viewport (375px)
- [ ] Verify all ARIA roles and keyboard navigation
- [ ] Test PWA installation on desktop and mobile
- [ ] Verify push notifications (requires HTTPS)
- [ ] Test PDF export functionality
- [ ] Verify checklist persistence across sessions

### Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

## 🔒 Privacy & Security

- **No Backend Required** - All data stays on your device
- **IndexedDB Storage** - Personal data stored locally
- **API Key Storage** - API keys stored in session storage only
- **HTTPS Required** - For geolocation and push notifications
- **No Tracking** - No analytics or tracking implemented

## 🌍 API Usage

### Open-Meteo API (Weather)
- Free, no API key required
- Rate limit: 1000 calls/day
- Documentation: https://open-meteo.com/

### Gemini API (AI)
- Free tier available
- Rate limit: 15 requests/minute
- Documentation: https://ai.google.dev/

### OpenStreetMap Nominatim (Geocoding)
- Free, no API key required
- Rate limit: 1 request/second
- Documentation: https://nominatim.openstreetmap.org/

## 🐛 Troubleshooting

### Weather Not Loading
- Check internet connection
- Verify location permission is granted
- Try refreshing the page

### AI Features Not Working
- Verify API key is entered correctly
- Check API key has not expired
- Try demo mode (remove API key)

### PWA Not Installing
- Ensure serving over HTTPS (or localhost)
- Check browser supports PWA installation
- Clear browser cache and try again

### Service Worker Issues
- Open DevTools > Application > Service Workers
- Click "Unregister" to clear old service worker
- Refresh the page

## 📄 License

This project is open source and available for personal and educational use.

## 🤝 Contributing

Contributions are welcome! Areas for improvement:
- Additional language translations
- More comprehensive checklist items
- Enhanced weather visualizations
- Additional map layers
- Voice output for AI responses

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review browser console for errors
3. Verify all prerequisites are met

## 🎯 Roadmap

Future enhancements:
- [ ] Native mobile apps (React Native)
- [ ] Community forum integration
- [ ] Real-time collaboration features
- [ ] Advanced weather prediction models
- [ ] Integration with local emergency services
- [ ] Offline-first AI responses

---

**Built with ❤️ for global monsoon preparedness**
