import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/context/AuthContext'
import { AppProvider } from '@/context/AppContext'
import { TooltipProvider } from '@/components/ui/tooltip'
import Layout from '@/components/Layout'
import Login from '@/pages/Login'
import Tables from '@/pages/Tables'
import Bills from '@/pages/Bills'
import Dashboard from '@/pages/Dashboard'
import Players from '@/pages/Players'

function ProtectedRoute({ children }) {
    const { user, loading } = useAuth()

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center pool-bg">
                <div className="text-center">
                    <div className="w-12 h-12 border-3 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">Chargement...</p>
                </div>
            </div>
        )
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }

    return children
}

function PublicRoute({ children }) {
    const { user, loading } = useAuth()

    if (loading) return null

    if (user) {
        return <Navigate to="/tables" replace />
    }

    return children
}

function AppRoutes() {
    return (
        <Routes>
            <Route
                path="/login"
                element={
                    <PublicRoute>
                        <Login />
                    </PublicRoute>
                }
            />
            <Route
                element={
                    <ProtectedRoute>
                        <AppProvider>
                            <Layout />
                        </AppProvider>
                    </ProtectedRoute>
                }
            >
                <Route path="/tables" element={<Tables />} />
                <Route path="/bills" element={<Bills />} />
                <Route path="/players" element={<Players />} />
                <Route path="/dashboard" element={<Dashboard />} />
            </Route>
            <Route path="*" element={<Navigate to="/tables" replace />} />
        </Routes>
    )
}

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <TooltipProvider>
                    <AppRoutes />
                </TooltipProvider>
            </AuthProvider>
        </BrowserRouter>
    )
}
