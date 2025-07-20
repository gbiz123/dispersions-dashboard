# Dispersions Dashboard

## Purpose
This dashboard provides a clean user interface for dispersion modeling programs produced by the EPA.
The programs are AERMOD, AERSCREEN, and AERSURFACE.
Each module is accessible by clicking "AERMOD", "AERSCREEN", or "AERSURFACE" on the dashboard
Other programs such as AERMET will be introduced gradually.

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

## Add input and form data for NO2 module
- The "NO2 Chemistry" section is missing
- TODO: Add section in AERSCREEN module for NO2 chemistry

## No integration testing
- Currently, there is no integration testing for the UI
- TODO: Write integration tests in your preferred framework (puppeteer, playwright, etc)

## Go back and edit run from previous inputs
- Users should be able to click the "edit run button"
- The module form will be opened with the inputs populated to the previous run
- TODO (GREG): Implement the api route to return inputs by run id

## Parse messages
- Each run mat have warning or error messages attached to it
- Error message should show up red in the results section
- Warning messages should show up yellow in the results section

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
- TODO (GREG): Develop pricing strategy
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

## After submitting run, there should be a server-side validation process (Maybe nice to have but not critical)
- TODO (GREG): Add a "PENDING", "READY", "INVALID" state for RunStatus
- TODO (GREG): When run data is initially submitted, validate by setting "RUNORNOT NOT"
- TODO (GREG): "PENDING" is submitted but not yet validated. READY is submitted and validated. INVALID is submitted and resulted in fatal errors at setup.
- TODO (GREG): Create POST route to start a run that is in READY state
- TODO: Add a "Submit for validation" button in the Run section, and a "Start run" button that call the aforementioned API routes
- TODO: If error messages are present, fetch the errors and display them to the user. Do not allow to start the run
- TODO: If warning messages are present, display them to the user.
