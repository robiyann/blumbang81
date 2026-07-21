// src/lib/sheets/client.ts
import { google } from "googleapis";

const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID ?? "";
const SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ?? "";
const PRIVATE_KEY = (process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY ?? "").replace(/\\n/g, "\n");

/**
 * Creates an authenticated Google Sheets API client using a Service Account.
 * Credentials are read from environment variables.
 */
function getAuthClient() {
  if (!SERVICE_ACCOUNT_EMAIL || !PRIVATE_KEY) {
    throw new Error(
      "Google Sheets credentials missing. Set GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY."
    );
  }
  return new google.auth.GoogleAuth({
    credentials: {
      client_email: SERVICE_ACCOUNT_EMAIL,
      private_key: PRIVATE_KEY,
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

/**
 * Fetch values from a named range or sheet tab in the configured spreadsheet.
 * Returns rows as string[][] — caller is responsible for mapping to domain types.
 */
export async function fetchSheetRange(range: string): Promise<string[][]> {
  if (!SPREADSHEET_ID) {
    console.warn("[sheets] GOOGLE_SHEETS_SPREADSHEET_ID not set — returning empty data.");
    return [];
  }

  try {
    const auth = getAuthClient();
    const sheets = google.sheets({ version: "v4", auth });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range,
    });

    const rows = response.data.values as string[][] | null | undefined;
    // Skip the header row (index 0)
    return rows?.slice(1) ?? [];
  } catch (error) {
    console.error(`[sheets] Failed to fetch range "${range}":`, error);
    throw error; // Re-throw to allow repositories to handle fallback correctly
  }
}

/**
 * Overwrite the entire tab in Google Sheets.
 * Clears the range first, then writes the headers and values.
 */
export async function overwriteSheet(range: string, values: string[][]): Promise<boolean> {
  if (!SPREADSHEET_ID) {
    console.warn("[sheets] GOOGLE_SHEETS_SPREADSHEET_ID not set — cannot overwrite data.");
    return false;
  }

  try {
    const auth = getAuthClient();
    const sheets = google.sheets({ version: "v4", auth });

    const tabName = range.split("!")[0];

    // 1. Clear the existing sheet tab range
    await sheets.spreadsheets.values.clear({
      spreadsheetId: SPREADSHEET_ID,
      range: `${tabName}!A1:Z500`,
    });

    // 2. Write the new headers and rows
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${tabName}!A1`,
      valueInputOption: "RAW",
      requestBody: {
        values,
      },
    });

    return true;
  } catch (error) {
    console.error(`[sheets] Failed to overwrite sheet tab "${range}":`, error);
    return false;
  }
}
