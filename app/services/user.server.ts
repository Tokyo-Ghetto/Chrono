import { pool } from "~/db/index.server";
import type { UserSettings } from "~/types/user";

export async function createUser(
  userId: string,
  firstName: string,
  lastName: string,
  email: string
) {
  const client = await pool.connect();
  try {
    const query = `
      INSERT INTO users (user_id, first_name, last_name, email)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (user_id) 
      DO UPDATE SET
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        email = EXCLUDED.email
      RETURNING *;
    `;

    const result = await client.query(query, [
      userId,
      firstName,
      lastName,
      email,
    ]);
    return result.rows[0];
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  } finally {
    client.release();
  }
}

export async function getUser(userId: string) {
  const client = await pool.connect();
  try {
    const query = `
      SELECT * FROM users
      WHERE user_id = $1;
    `;

    const result = await client.query(query, [userId]);
    return result.rows[0] || null;
  } catch (error) {
    console.error("Error getting user:", error);
    throw error;
  } finally {
    client.release();
  }
}

export async function getUserSettings(
  userId: string
): Promise<UserSettings | null> {
  const client = await pool.connect();
  try {
    const result = await client.query(
      "SELECT settings FROM users WHERE user_id = $1",
      [userId]
    );
    return result.rows[0]?.settings || null;
  } catch (error) {
    console.error("Error fetching user settings:", error);
    return null;
  } finally {
    client.release();
  }
}

export async function updateUserSettings(
  userId: string,
  settings: Partial<UserSettings>
) {
  const client = await pool.connect();
  try {
    const currentSettings = await getUserSettings(userId);

    // Merge existing settings with new settings
    const updatedSettings = {
      ...currentSettings,
      ...settings,
    };

    await client.query("UPDATE users SET settings = $1 WHERE user_id = $2", [
      updatedSettings,
      userId,
    ]);

    return updatedSettings;
  } catch (error) {
    console.error("Error updating user settings:", error);
    throw error;
  } finally {
    client.release();
  }
}
