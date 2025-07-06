import mysql, { RowDataPacket } from 'mysql2/promise'

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || '',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
}

let pool: mysql.Pool

export const getConnection = () => {
  if (!pool) {
    pool = mysql.createPool(dbConfig)
  }
  return pool
}

export const executeQuery = async (query: string, params: (string | number)[] = []): Promise<RowDataPacket[]> => {
  // Check if database is configured
  if (!process.env.DB_HOST && !process.env.DATABASE_URL) {
    return []
  }

  const connection = getConnection()
  try {
    // Try using query() instead of execute() to avoid prepared statement issues
    const [results] = await connection.query(query, params)
    // Ensure we return an array - results could be RowDataPacket[] or other types
    return Array.isArray(results) ? results as RowDataPacket[] : []
  } catch (error) {
    // In production, return empty results instead of crashing
    if (process.env.NODE_ENV === 'production') {
      return []
    }
    throw error
  }
}

export const executeTransaction = async (queries: Array<{ query: string; params: (string | number)[] }>) => {
  const connection = await getConnection().getConnection()
  try {
    await connection.beginTransaction()
    
    const results = []
    for (const { query, params } of queries) {
      const [result] = await connection.execute(query, params)
      results.push(result)
    }
    
    await connection.commit()
    return results
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    connection.release()
  }
}