# SF Neighborhood New Tab

A Chrome extension that replaces your new tab page with an interactive map of San Francisco neighborhoods.

## Features

- **Interactive Map**: Displays SF neighborhoods with a random one highlighted on each new tab
- **Two Map Types**:
  - Local Neighborhoods (117 detailed community neighborhoods)
  - Analysis Neighborhoods (37 larger areas used for city reporting)
- **Quiz Mode**: Test your knowledge of SF neighborhoods with accuracy tracking
- **Customizable Shortcuts**: Add up to 5 quick-access links with favicon support
  - Supports multiple URLs per shortcut (semicolon-separated)
- **Theme Support**: Light, Dark, or System (follows OS preference)

## Installation

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions`
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked" and select the `SFNewTab` folder
5. Open a new tab to see the extension

## Data Sources

### Local Neighborhoods (117 neighborhoods)
- **Source**: SF Chronicle's sf-shapefiles repository
- **Dataset**: SF 311 Neighborhoods
- **URL**: https://github.com/sfchronicle/sf-shapefiles
- **Description**: Neighborhood boundaries used by SF 311 services

### Analysis Neighborhoods (37 neighborhoods)
- **Source**: Code for America / Click That Hood
- **Dataset**: San Francisco Analysis Neighborhoods (derived from DataSF)
- **URL**: https://github.com/codeforamerica/click_that_hood
- **Original Source**: https://data.sfgov.org/Geographic-Locations-and-Boundaries/Analysis-Neighborhoods/p5b7-5n3h
- **Description**: Created by the Department of Public Health and Mayor's Office of Housing and Community Development by grouping 2010 Census tracts for consistent demographic and socioeconomic reporting

## Built With

This extension was built with [Claude](https://claude.ai), Anthropic's AI assistant.

## License

MIT
