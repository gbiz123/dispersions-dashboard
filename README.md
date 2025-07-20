# Dispersions Dashboard

## Purpose
This dashboard provides a clean user interface for dispersion modeling programs produced by the EPA.
The programs are AERMOD, AERSCREEN, and AERSURFACE.
Each module is accessible by clicking "AERMOD", "AERSCREEN", or "AERSURFACE" on the dashboard
Other programs such as AERMET will be introduced gradually.

## Phases
This project is separated into phase 1 and phase 2. 
Phase 1 is mostly rework of the current UI, and getting the basic functionality working.
Phase 2 involves introducing new functionality and building out the rest of the SaaS app.

# Phase 1
Phase 1 will consist mainly of fixing issues with the current implementation, and building a functional product.

## Dispersions API
- Dispersions API: The API that executes the programs and lets the user fetch their results
- API is described in dispersions-api.openapi.json
- TODO: Import the OpenAPI schema into https://wiremock.org/ to create a mock API

## User Details API
- User Details API: The API that stores user details such as subscription plan, teammates, etc
- API is described in user-details.openapi.json
- TODO: Import the OpenAPI schema into https://wiremock.org/ to create a mock API

## Problems with Dispersions API integration
- Data model (POST bodies) do not reflect the information expected by the API
- Information on dashboard is all dummy data, and does not pull from the API
- TODO: Get dashboard data pulling from dispersions-api and user-details API
- TODO: Properly integrate each module with dispersions-api to execute the programs

## Problems with state
- State and context is handled poorly, mixing useState with useContext
- Improper handling of state causes user data to be lost when clicking between tabs with an module
- This issue has already been fixed in the AERSCREEN module
- Needs to be fixed in AERMOD and AERSURFACE modules as well
- TODO: Stop using "useState" to manage the state of the formData - just use the formData provided by the custom "useRunContext" hook.

## Inconsistencies in UI design between modules
- There are minor inconsistencies in UI layout switching from tab to tab, taking away from cohesiveness
- This has already been fixed in AERSCREEN module.
- TODO: Apply the same UI in the AERSCREEN module to the AERMOD and AERSURFACE modules.

## No integration testing
- Currently, there is no integration testing for the UI
- TODO: Write integration tests in your preferred framework (puppeteer, playwright, etc)

# Phase 2
Phase 1 will consist of building around the functionality to create an entire SaaS platform.

## Developing requirements
While you are working on Phase 1, I will be building the backend to prepare for Phase 2.
We will revisit these requirements when Phase 1 is done and the backend is more built out.

## Documentation
- Will need a UI for documentation and how to use the product
- Although their product is more built-out than outs, this site is good inspiration for our documentation: https://developers.arcgis.com/documentation/
- TODO (GREG): I will need to write documentation for the modules

## Input visualization
Air quality modeling is geospatial in nature. 
Therefore, we need to visualize our inputs and outputs on maps and in 3d spaces.
- TODO: Change AERSCREEN location inputs in Terrain section from UTM to Lat/Lon
- TODO: AERSCREEN Terrain section - X/Y coordinates should be selectable on embedded Google Map in lat/long
- TODO: Allow user to select a single point for emission source location
- TODO: Allow user to select a bounding box for the entire study area
- TODO (GREG): Auto-convert lat/lon coordinates to UTM on backend
- TODO (GREG): Pass bounding box to API to pull all intersecting NED TIFF files into study

## AERMOD visualization
- AERMOD makes heavy use of geospatial inputs which will need to be visualizad
- Source locations
- Receptor grids
- Buildings
- Terrain

## Landing page and product pages
- Need an overall landing page for Dispersions.net
- It should link to individual product pages describing each module (AERMOD, AERSCREEN, AERSURFACE, etc)
- Need individual product pages for each module
- TODO (GREG): Get UI designs for landing and product pages

## Purchase flow
- Pricing page
- Purchase UI
- Purchase API integration
- User details API integration
- TODO (GREG): Build purchase API
- TODO (GREG): Find UI designs for purchase flow

## Blog
- Blog homepage
- Blog pages
- Blog API integration
- TODO (GREG): Find UI designs for blog

## Navbar
- Need a navbar for all these pages
- Should have logo, links, call to action, etc

## Dead links on dashboard
- "Upgrade Plan" button in subscription section of dashboard does nothing
- "Help & Documentation" link does nothing
