import mysql from 'mysql2/promise'

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

export const executeQuery = async (query: string, params: any[] = []) => {
  // Check if database is configured
  if (!process.env.DB_HOST && !process.env.DATABASE_URL) {
    console.warn('No database configuration found. Returning empty results.')
    return []
  }

  const connection = getConnection()
  try {
    // Try using query() instead of execute() to avoid prepared statement issues
    const [results] = await connection.query(query, params)
    return results
  } catch (error) {
    console.error('Database query error:', error)
    // In production, return empty results instead of crashing
    if (process.env.NODE_ENV === 'production') {
      console.warn('Database connection failed, returning empty results')
      return []
    }
    throw error
  }
}

export const executeTransaction = async (queries: Array<{ query: string; params: any[] }>) => {
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