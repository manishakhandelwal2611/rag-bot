import React, { createContext, useState, useEffect, type Dispatch, type SetStateAction} from "react"
import { getChatHistory } from "../api/chatApi"
import { parseJwt } from "../utils/tokenUtils"

type UserType = {
  token?: string
  email?: string
  name?: string
  picture?: string
} | null

type AuthContextType = {
  user: UserType
  setUser: Dispatch<SetStateAction<UserType>>
  setToken: (token: string) => void
  logout: () => void
  fetchHistory: (userId:string) => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [history, setHistory] = useState<any[]>([])
  const [user, setUser] = useState<UserType>(null)

  // Persist user (including token) to localStorage on change
  useEffect(() => {
     const token = localStorage.getItem("chat_user")
    if (token) {
      setToken(token)
    }
  }, [])

  const setToken = (token: string) => {
    if (!token) {
      localStorage.removeItem("chat_user")
      setUser(null)
      return
    }
    const decoded = parseJwt(token)
    if (decoded?.email) {
      localStorage.setItem("chat_user", token)
      setUser({
        token,
        email: decoded.email,
        name: decoded.name || "",
        picture: decoded.picture || "",
      })
    } else {
      // Invalid token case
      localStorage.removeItem("chat_user")
      setUser(null)
    }
  }
  const logout = () => {
    localStorage.removeItem("chat_user")
    setUser(null)
  }

  const fetchHistory = async (userId:string) => {
    try {
      const chatHistory = await getChatHistory(userId);
      setHistory(chatHistory.data)
    } catch (error) {
      console.error("Failed to fetch chat history", error)
      setHistory([])
    }
  }

  return (
    <AuthContext.Provider value={{ user, setUser, logout, fetchHistory, setToken }}>
      {children}
    </AuthContext.Provider>
  )
}
