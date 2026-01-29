# Macroeconomics Interactive Study Tool

An interactive web-based study platform for learning macroeconomics concepts. Created by Dr. Ian Helfrich for economics students, tutoring, and self-study.

## 🎯 What is This?

This tool helps you **learn macroeconomics through practice**. It includes:

- **Interactive Calculators** - Hands-on tools for GDP measurement, business cycles, inflation, interest rates, savings, and more
- **Live Economic Data** - Connect to real-time APIs to see theory in action (optional)
- **Sample Data Built-In** - All calculators work offline with example data
- **Visual Learning** - Charts and graphs update as you change values
- **Comprehensive Guide** - See [COURSE_GUIDE.md](COURSE_GUIDE.md) for detailed explanations of all concepts

## 🚀 Quick Start

### Option 1: Open Directly (Easiest)
Just open `index.html` in your web browser. All calculators work immediately with built-in sample data.

### Option 2: Local Server (Recommended for Best Experience)
```bash
# Using Python 3
python3 -m http.server 8080

# Then open your browser to:
# http://localhost:8080
```

### Option 3: GitHub Pages (Public Hosting)
1. Push this repo to GitHub
2. Go to Settings → Pages
3. Select "Deploy from main branch"
4. Your site will be live at `https://yourusername.github.io/reponame`

## 📚 What You Can Learn

### Core Calculators Include:

1. **Business Cycle Compass** - Visualize economic phases (expansion, peak, contraction, trough)
2. **GDP Transaction Classifier** - Understand which economic activities count in C, I, G, or NX
3. **National Accounts Lab** - Calculate GDP three ways: value-added, income, and expenditure
4. **Chocolate Bar Economy** - Learn nominal vs. real GDP, deflators, and inflation
5. **Production Function** - Explore how technology, capital, and labor drive output
6. **Interest Rate Transmission** - See how Fed rate changes affect investment and consumption
7. **Savings Calculator** - Compute private, public, and national savings
8. **Long-Run Growth Tracker** - Analyze 20-year average growth rates

### Live Economic Indicators:
- **Inflation Glidepath** - CPI and Core PCE trends
- **Labor Tightness** - Unemployment and wage growth
- **Growth & Demand** - Real GDP, retail sales, PMI
- **Rates & Curve** - Fed funds rate, 2-year and 10-year Treasury yields

## 📖 How to Use This Tool

### For Students:
1. Start with the **Comprehensive Course Guide** ([COURSE_GUIDE.md](COURSE_GUIDE.md)) to understand concepts
2. Use the **Interactive Calculators** to practice problems
3. Experiment with different values to see how relationships work
4. Check your understanding with the **Economic Assessment** section

### For Tutors:
1. Share the link with your students (works on any device)
2. Walk through calculators during tutoring sessions
3. Assign specific scenarios for students to explore
4. Use the Course Guide as a reference document

### For Self-Study:
1. Read explanations in the Course Guide
2. Work through each calculator systematically
3. Try the "Scenario Toggles" to see what-if analysis
4. Connect to live data (optional) to analyze current economic conditions

## 🔌 Connecting Live Data (Optional)

**Note:** This is completely optional! All calculators work with built-in sample data.

If you want to analyze real-time economic data:

1. Click **"Connect APIs"** in the top right
2. Enter your API details:
   - **Base URL**: Your data source (e.g., FRED API, custom endpoint)
   - **API Key**: Optional authentication
   - **Headers**: Optional custom headers
3. The tool automatically normalizes common API formats (FRED, World Bank, custom JSON)

**Data Privacy:** All API credentials are stored locally in your browser only. Nothing is sent to external servers except your configured API endpoints.

## 📁 File Structure

```
.
├── index.html              # Main application page
├── styles.css              # Visual styling
├── app.js                  # Application logic and calculators
├── COURSE_GUIDE.md         # Comprehensive concept explanations
├── README.md               # This file
├── PS2_2.pdf              # Sample problem set
├── data/
│   ├── sources.js         # Economic indicator definitions
│   └── mock.js            # Built-in sample data
└── assets/                # Optional images and media
```

## 🎓 Course Integration

This tool was designed to complement **Econ 205: Principles of Macroeconomics** but works for any macro course. The calculators cover standard topics including:

- Measuring GDP (three approaches)
- Nominal vs. Real GDP and price indices
- Business cycles and phases
- Production functions and growth accounting
- Savings-investment identity
- Monetary policy transmission
- Real-time economic indicator interpretation

## 🛠️ Customization

### Update Voice/Persona:
Click "Edit voice + photo" to customize:
- Instructor name and title
- Tagline and voice line
- Upload a portrait photo

### Adjust Signal Weights:
In the "Signal Lab" section, adjust how much each indicator affects the overall Macro Score.

### Scenario Analysis:
Toggle economic scenarios to see impacts:
- Oil shock (+inflation, -growth)
- Policy cut (-inflation, +growth)
- Credit tightening (-growth, +risk)
- Demand surge (+growth, +inflation)

## 🔧 For Developers

### Tech Stack:
- **Frontend Only** - Pure HTML/CSS/JavaScript (ES6 modules)
- **Charts** - Chart.js for visualizations
- **No Build Step** - Works directly in browser
- **No Dependencies** - Except Chart.js CDN

### Data Format:
The tool normalizes time-series data in these formats:
```javascript
// Simple array
[{ date: "2024-01-01", value: 2.5 }, ...]

// FRED-style
{ observations: [{ date, value }, ...] }

// Nested
{ series: [{ date, value }, ...] }
{ data: [{ date, value }, ...] }
```

### Live Data on GitHub Pages (Local APIs)
GitHub Pages is static, so it **cannot reach APIs running only on your Mac**. Use one of these:

**Option A — Publish snapshots from your Mac (works today)**
1. Copy the example config: `scripts/publish_config.example.json` → `scripts/publish_config.json`
2. Update `base_url`, headers, and endpoints.
3. Run:
   ```bash
   python3 scripts/publish_live_data.py
   git add data/live
   git commit -m "Update live data"
   git push
   ```
4. The site will auto-read `data/live/*.json` on GitHub Pages.

To automate, add a cron job that runs the script and pushes every X minutes.

**Option B — Deploy APIs publicly (best long-term)**
Host the API on a public service (Fly/Render/Railway/Cloudflare Workers) and set the Base URL in the site’s **Connect APIs** drawer.  
Make sure CORS allows your Pages domain (e.g., `https://ihelfrich.github.io`).

### Adding New Indicators:
Edit `data/sources.js` to add your own economic indicators.

## 📝 Pedagogical Approach

This tool emphasizes:
- **Active Learning** - Students manipulate values to see effects
- **Multiple Representations** - Formulas, tables, and charts together
- **Immediate Feedback** - Results update instantly
- **Real-World Connection** - Optional live data integration
- **Conceptual Understanding** - Not just computation, but interpretation

## 🤝 Contributing

Found a bug or have a suggestion?
- Open an issue on GitHub
- Submit a pull request
- Email Dr. Helfrich with feedback

## 📜 License

This educational tool is provided for academic use. Feel free to adapt for your own courses.

## 👨‍🏫 About the Creator

**Dr. Ian Helfrich**
- Ph.D. in Economics, Georgia Tech
- Specialization: International trade, geospatial economics
- Teaching: Economics, econometrics, and data science courses
- Focus: Making economics accessible through interactive tools

## 🆘 Troubleshooting

**Calculators not updating?**
- Make sure JavaScript is enabled in your browser
- Try refreshing the page

**Charts not displaying?**
- Check that Chart.js CDN is loading (internet connection required)
- Open browser console (F12) to check for errors

**Live data not connecting?**
- Verify your API URL and credentials
- Check that your API returns JSON in a supported format
- The tool works perfectly fine with built-in sample data if APIs aren't available

**Need Help?**
See the [Comprehensive Course Guide](COURSE_GUIDE.md) for detailed explanations of every concept and calculator.

---

**Ready to learn? Open `index.html` and start exploring!** 🚀
