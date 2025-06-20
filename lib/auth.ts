import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { executeQuery } from './db'
import { User } from '@/types'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key'

export interface AuthUser {
  id: number
  email: string
  name?: string
  is_verified: boolean
}

export class AuthService {
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12)
  }

  static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword)
  }

  static generateToken(user: AuthUser): string {
    return jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        name: user.name,
        is_verified: user.is_verified 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    )
  }

  static verifyToken(token: string): AuthUser | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any
      return {
        id: decoded.id,
        email: decoded.email,
        name: decoded.name,
        is_verified: decoded.is_verified
      }
    } catch (error) {
      return null
    }
  }

  static async createUser(email: string, password: string, name?: string): Promise<AuthUser> {
    const hashedPassword = await this.hashPassword(password)
    const verificationToken = this.generateVerificationToken()

    const result = await executeQuery(
      `INSERT INTO users (email, password_hash, name, verification_token) VALUES (?, ?, ?, ?)`,
      [email, hashedPassword, name || null, verificationToken]
    ) as any

    return {
      id: result.insertId,
      email,
      name,
      is_verified: false
    }
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    const users = await executeQuery(
      `SELECT * FROM users WHERE email = ?`,
      [email]
    ) as User[]

    return users[0] || null
  }

  static async getUserById(id: number): Promise<User | null> {
    const users = await executeQuery(
      `SELECT * FROM users WHERE id = ?`,
      [id]
    ) as User[]

    return users[0] || null
  }

  static async authenticateUser(email: string, password: string): Promise<AuthUser | null> {
    const user = await this.getUserByEmail(email)
    if (!user) return null

    const isValidPassword = await this.verifyPassword(password, user.password_hash)
    if (!isValidPassword) return null

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      is_verified: user.is_verified
    }
  }

  static async createGoogleUser(email: string, name: string, googleId: string): Promise<AuthUser> {
    const result = await executeQuery(
      `INSERT INTO users (email, password_hash, name, google_id, is_verified) VALUES (?, '', ?, ?, 1)`,
      [email, name, googleId]
    ) as any

    return {
      id: result.insertId,
      email,
      name,
      is_verified: true
    }
  }

  static async getUserByGoogleId(googleId: string): Promise<User | null> {
    const users = await executeQuery(
      `SELECT * FROM users WHERE google_id = ?`,
      [googleId]
    ) as User[]

    return users[0] || null
  }

  static generateVerificationToken(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15)
  }

  static async verifyUserEmail(token: string): Promise<boolean> {
    const result = await executeQuery(
      `UPDATE users SET is_verified = 1, verification_token = NULL WHERE verification_token = ?`,
      [token]
    ) as any

    return result.affectedRows > 0
  }

  static async updateUserPassword(userId: number, newPassword: string): Promise<boolean> {
    const hashedPassword = await this.hashPassword(newPassword)
    
    const result = await executeQuery(
      `UPDATE users SET password_hash = ? WHERE id = ?`,
      [hashedPassword, userId]
    ) as any

    return result.affectedRows > 0
  }

  static async deleteUser(userId: number): Promise<boolean> {
    const result = await executeQuery(
      `DELETE FROM users WHERE id = ?`,
      [userId]
    ) as any

    return result.affectedRows > 0
  }

  static async exportUserData(userId: number): Promise<any> {
    const [user, favorites, ratings] = await Promise.all([
      this.getUserById(userId),
      executeQuery(`
        SELECT r.title, r.slug, uf.created_at 
        FROM user_favorites uf 
        JOIN recipes r ON uf.recipe_id = r.id 
        WHERE uf.user_id = ?
      `, [userId]),
      executeQuery(`
        SELECT r.title, r.slug, rr.rating, rr.created_at 
        FROM recipe_ratings rr 
        JOIN recipes r ON rr.recipe_id = r.id 
        WHERE rr.user_id = ?
      `, [userId])
    ])

    return {
      user: {
        email: user?.email,
        name: user?.name,
        created_at: user?.created_at
      },
      favorites,
      ratings,
      exported_at: new Date().toISOString()
    }
  }
}