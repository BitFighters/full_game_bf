export const HATHORA_CONFIG = {
  DEV_KEY: "",
  V2_URL: "https://api.hathora.dev/rooms/v2/",
  BASE_URL: "https://api.hathora.dev/",
  APPLICATION_ID: process.env.NODE_ENV ? "app-57400936-1df1-40c4-895e-bb4f015b9e91" : "app-87d8f31f-cb2c-43ae-a312-a0f085ecdf16",
  APPLICATION_WEB2_ID: process.env.NODE_ENV ? "app-103e4c78-39f3-4b05-9ff8-85673bd7613d" : "app-2855732a-96eb-496a-89a8-93357e345137",
  // APPLICATION_WEB2_ID: "app-2855732a-96eb-496a-89a8-93357e345137",
  VALID_REGIONS: [
    {
      name: "Mumbai",
      code_name: "India"
    },
    {
      name: "Washington_DC",
      code_name: "US_East"
    }
  ],
}