import { google } from 'googleapis';

export interface BikeRow {
  id: string;
  status: 'Active' | 'Inactive';
  brand: string;
  user: string;
}

function getGoogleAuth() {
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  if (!privateKey || !clientEmail) throw new Error('Missing Google Auth ENV');

  return new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
}

// Получение всех велосипедов из таблицы "Bike Database"
export async function getBikes(): Promise<BikeRow[]> {
  const auth = getGoogleAuth();
  const sheets = google.sheets({ version: 'v4', auth });
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEETS_ID!,
      range: 'Bike Database!B3:E', // B: ID, C: Status, D: Brand, E: User
    });
    const rows = response.data.values || [];
    // row = [id, status, brand, user]
    return rows.map((row): BikeRow => ({
      id: row[0] ?? '',
      status: (row[1] ?? 'Inactive') as 'Active' | 'Inactive',
      brand: row[2] ?? '',
      user: row[3] ?? '',
    }));
  } catch (error) {
    console.error('Ошибка при чтении из Google Sheets:', error);
    throw error;
  }
}

// Обновление велосипеда (по id)
export async function updateBike(
  id: string,
  data: Partial<Pick<BikeRow, 'status' | 'user'>>
): Promise<void> {
  const auth = getGoogleAuth();
  const sheets = google.sheets({ version: 'v4', auth });

  // Получаем все байки, чтобы узнать индекс строки
  const allBikes = await getBikes();
  const rowIndex = allBikes.findIndex(bike => bike.id === id);
  if (rowIndex === -1) throw new Error('Bike not found');

  // Формируем обновляемую строку
  const target = { ...allBikes[rowIndex], ...data };
  // В таблице первая строка с данными начинается с B3, значит строка = rowIndex + 3
  const updateRange = `Bike Database!B${rowIndex + 3}:E${rowIndex + 3}`;

  try {
    await sheets.spreadsheets.values.update({
      spreadsheetId: process.env.SHEETS_ID!,
      range: updateRange,
      valueInputOption: 'RAW',
      requestBody: {
        // [id, status, brand, user]
        values: [[target.id, target.status, target.brand, target.user]],
      },
    });
  } catch (error) {
    console.error('Ошибка при обновлении Google Sheets:', error);
    throw error;
  }
}

// Добавление записи в логи (Date, Status, ID, Brand, User)
export async function appendLog(log: {
  date: string;
  status: string;
  id: string | number;
  brand: string;
  user: string;
}) {
  const auth = getGoogleAuth();
  const sheets = google.sheets({ version: 'v4', auth });
  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SHEETS_ID!,
      range: 'Logs!A2:E',
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        // [date, status, id, brand, user]
        values: [
          [log.date, log.status, log.id, log.brand, log.user],
        ],
      },
    });
  } catch (error) {
    console.error('Ошибка при добавлении лога в Google Sheets:', error);
    throw error;
  }
}
