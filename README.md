# aerscreen-react-ui

A modern React-based web interface for the AERSCREEN air quality modeling tool. This application provides a user-friendly way to set up, run, and visualize AERSCREEN models.

## Features

- **Complete AERSCREEN Form Interface**: Easily input all parameters required for AERSCREEN runs
- **Interactive Sections**:
  - Stack Data (source parameters)
  - Building Data (downwash parameters)
  - Meteorological Data (MAKEMET)
  - Terrain Data
  - Debug Options
- **Results Visualization**: View model outputs in an easy-to-understand format
- **Form Validation**: Ensures all inputs meet AERSCREEN requirements
- **Responsive Design**: Works on desktop and tablet devices

## Getting Started

### Prerequisites

- Node.js (v14 or newer)
- npm (v6 or newer)

### Installation

1. Clone this repository :
    git clone https://github.com/your-username/aerscreen-app.git cd aerscreen-app

2. Install dependencies : 
    npm install

3. Start the development server :
    npm start

4. Open [http://localhost:3000](http://localhost:3000) to view the application

## Usage

1. Navigate through the form sections using the tabs at the top
2. Fill in the required information for your AERSCREEN run
3. Submit the form to process your AERSCREEN calculation
4. View the results in the visualization section

## API Integration

This application connects to an AERSCREEN backend API. By default, it's configured to use a mock API provided by WireMock for development and testing purposes.

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App configuration

## Project Structure

- `/src` - Source code
  - `/components` - React components
 - `/charts` - Data visualization components
 - `/forms` - Form input components
 - `Layout.tsx` - Main application layout
 - `Navigation.tsx` - Navigation sidebar
 - `SectionContainer.tsx` - Container for form sections
  - `/context` - React context providers
 - `RunContext.tsx` - Run state management
  - `/hooks` - Custom React hooks
 - `usePolling.ts` - Data polling hook
 - `useRunState.ts` - Run state hook
  - `/pages` - Page layouts
 - `TestPage.tsx` - API testing page
  - `/sections` - Form sections
 - `StackData.tsx` - Stack parameters form
 - `BuildingData.tsx` - Building configuration form
 - `MakemetData.tsx` - Meteorological data form
 - `TerrainData.tsx` - Terrain analysis form
 - `DiscreteReceptors.tsx` - Receptor locations form
 - `OtherInputs.tsx` - Additional parameters form
 - `Fumigation.tsx` - Fumigation settings form
 - `Debug.tsx` - Debug options form
 - `Results.tsx` - Results visualization
  - `/services` - API services
 - `api.ts` - API client
 - `resultService.ts` - Results handling
 - `runService.ts` - Run management
  - `/types` - TypeScript type definitions
 - `api.ts` - API types
 - `enums.ts` - Enumeration types
 - `models.ts` - Data models
  - `/utils` - Utility functions
  - `App.tsx` - Main application component
  - `config.ts` - Application configuration
- `/public` - Static assets
- `/sample-data` - Example JSON data for testing

## Technologies Used

- React
- TypeScript
- Tailwind CSS
- React Hook Form
- Axios

## License

[MIT License](LICENSE)

## Acknowledgments

- AERSCREEN is developed by the U.S. Environmental Protection Agency
- This interface is designed to simplify access to AERSCREEN's capabilities

