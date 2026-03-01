import React, { useState } from 'react'
import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useApp } from '@/context/AppContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    LayoutDashboard,
    Grid3X3,
    Receipt,
    LogOut,
    Menu,
    X,
    CircleDot,
    ChevronRight,
    Users,
    Check,
    UserCog,
} from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'

const navItems = [
    { path: '/tables', label: 'Tables', icon: Grid3X3, description: 'Gérer les tables de billard' },
    { path: '/bills', label: 'Factures', icon: Receipt, description: 'Voir & gérer les factures' },
    { path: '/players', label: 'Joueurs', icon: Users, description: 'Gérer les joueurs' },
    { path: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard, description: 'Analytiques & statistiques' },
]

export default function Layout() {
    const { user, logout } = useAuth()
    const { settings, changeHourlyRate } = useApp()
    const location = useLocation()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [editingRate, setEditingRate] = useState(false)
    const [rateValue, setRateValue] = useState(settings.hourlyRate.toString())
    const [editProfileOpen, setEditProfileOpen] = useState(false)
    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        newPassword: '',
        confirmPassword: '',
    })
    const [profileLoading, setProfileLoading] = useState(false)
    const [profileError, setProfileError] = useState('')
    const [profileSuccess, setProfileSuccess] = useState('')

    const currentPage = navItems.find(item => location.pathname.startsWith(item.path))

    const handleRateDoubleClick = () => {
        setRateValue(settings.hourlyRate.toString())
        setEditingRate(true)
    }

    const handleRateSave = () => {
        const newRate = parseFloat(rateValue)
        if (!isNaN(newRate) && newRate > 0) {
            changeHourlyRate(newRate)
        }
        setEditingRate(false)
    }

    const handleRateKeyDown = (e) => {
        if (e.key === 'Enter') handleRateSave()
        if (e.key === 'Escape') setEditingRate(false)
    }

    const handleEditProfile = () => {
        setProfileData({
            name: user?.name || '',
            email: user?.email || '',
            newPassword: '',
            confirmPassword: '',
        })
        setProfileError('')
        setProfileSuccess('')
        setEditProfileOpen(true)
    }

    const handleSaveProfile = async () => {
        setProfileError('')
        setProfileSuccess('')
        setProfileLoading(true)

        try {
            console.log('👤 [PROFILE] Updating profile...')
            
            // Validate passwords match if provided
            if (profileData.newPassword || profileData.confirmPassword) {
                if (profileData.newPassword !== profileData.confirmPassword) {
                    setProfileError('Les mots de passe ne correspondent pas')
                    setProfileLoading(false)
                    return
                }
                if (profileData.newPassword.length < 6) {
                    setProfileError('Le mot de passe doit contenir au moins 6 caractères')
                    setProfileLoading(false)
                    return
                }
            }

            // Update user data
            const updates = {}
            if (profileData.email !== user?.email) {
                updates.email = profileData.email
            }
            if (profileData.newPassword) {
                updates.password = profileData.newPassword
            }
            if (profileData.name !== user?.name) {
                updates.data = { name: profileData.name }
            }

            if (Object.keys(updates).length > 0) {
                const { error } = await supabase.auth.updateUser(updates)
                
                if (error) {
                    console.error('❌ [PROFILE] Update failed:', error.message)
                    setProfileError(error.message)
                    setProfileLoading(false)
                    return
                }
                
                console.log('✅ [PROFILE] Profile updated successfully')
                setProfileSuccess('Profil mis à jour avec succès!')
                
                // Close dialog after 1.5 seconds
                setTimeout(() => {
                    setEditProfileOpen(false)
                    setProfileSuccess('')
                }, 1500)
            } else {
                setProfileError('Aucune modification détectée')
            }
        } catch (error) {
            console.error('❌ [PROFILE] Error:', error)
            setProfileError('Une erreur est survenue')
        }
        
        setProfileLoading(false)
    }

    return (
        <div className="min-h-screen flex pool-bg">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
        fixed inset-y-0 left-0 z-50
        w-72 bg-card/95 backdrop-blur-xl border-r border-border/50
        flex flex-col h-screen overflow-hidden
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
                {/* Logo */}
                <div className="p-6 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden logo-container">
                            <img src="/src/images/sademlogo.png" alt="Break Gaming Logo" className="w-full h-full object-cover logo-spin" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold gradient-text">Break Gaming</h1>
                            <p className="text-xs text-muted-foreground">Système de gestion</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <Separator className="opacity-50 shrink-0" />

                {/* Navigation - takes available space but doesn't scroll */}
                <nav className="flex-1 p-4 space-y-1 overflow-hidden">
                    {navItems.map(item => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={() => setSidebarOpen(false)}
                            className={({ isActive }) => `
                group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                ${isActive
                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 glow-emerald'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                                }
              `}
                        >
                            <item.icon className="w-5 h-5 shrink-0" />
                            <div className="flex-1">
                                <div>{item.label}</div>
                                <div className="text-xs opacity-60 mt-0.5">{item.description}</div>
                            </div>
                            <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-50 transition-opacity" />
                        </NavLink>
                    ))}
                </nav>

                {/* Bottom section: Rate + User — always pinned at bottom */}
                <div className="shrink-0 mt-auto">
                    {/* Rate info */}
                    <div className="px-4 pb-3">
                        <div
                            className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-4 cursor-pointer select-none"
                            onDoubleClick={handleRateDoubleClick}
                            title="Double-cliquez pour modifier le tarif"
                        >
                            <div className="text-xs text-muted-foreground mb-1">Tarif horaire</div>
                            {editingRate ? (
                                <div className="flex items-center gap-2">
                                    <Input
                                        type="number"
                                        value={rateValue}
                                        onChange={(e) => setRateValue(e.target.value)}
                                        onKeyDown={handleRateKeyDown}
                                        onBlur={handleRateSave}
                                        className="h-8 bg-background/50 text-lg font-bold text-emerald-400 font-mono-timer w-20"
                                        autoFocus
                                        min="1"
                                        step="0.5"
                                    />
                                    <span className="text-sm text-muted-foreground">TND/h</span>
                                    <Button size="sm" variant="ghost" onClick={handleRateSave} className="h-8 w-8 p-0 text-emerald-400">
                                        <Check className="w-4 h-4" />
                                    </Button>
                                </div>
                            ) : (
                                <div className="text-2xl font-bold text-emerald-400 font-mono-timer">
                                    {settings.hourlyRate} <span className="text-sm font-normal text-muted-foreground">TND/h</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <Separator className="opacity-50" />

                    {/* User */}
                    <div className="p-4">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-accent/50 transition-colors">
                                    <Avatar className="h-9 w-9 border border-emerald-500/20">
                                        <AvatarFallback className="bg-emerald-500/10 text-emerald-400 text-sm font-semibold">
                                            {user?.name?.charAt(0) || 'A'}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 text-left">
                                        <div className="text-sm font-medium">{user?.name || 'Admin'}</div>
                                        <div className="text-xs text-muted-foreground">Administrateur</div>
                                    </div>
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={handleEditProfile}
                                    className="cursor-pointer"
                                >
                                    <UserCog className="w-4 h-4 mr-2" />
                                    Modifier le profil
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={logout}
                                    className="text-red-400 focus:text-red-400 cursor-pointer"
                                >
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Déconnexion
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </aside>

            {/* Edit Profile Dialog */}
            <Dialog open={editProfileOpen} onOpenChange={setEditProfileOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Modifier le profil</DialogTitle>
                        <DialogDescription>
                            Mettez à jour vos informations de compte
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="profile-name">Nom</Label>
                            <Input
                                id="profile-name"
                                value={profileData.name}
                                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                placeholder="Votre nom"
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="profile-email">Email</Label>
                            <Input
                                id="profile-email"
                                type="email"
                                value={profileData.email}
                                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                placeholder="votre@email.com"
                            />
                        </div>
                        
                        <Separator />
                        
                        <div className="space-y-2">
                            <Label htmlFor="profile-password">Nouveau mot de passe (optionnel)</Label>
                            <Input
                                id="profile-password"
                                type="password"
                                value={profileData.newPassword}
                                onChange={(e) => setProfileData({ ...profileData, newPassword: e.target.value })}
                                placeholder="Laisser vide pour ne pas changer"
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="profile-confirm">Confirmer le mot de passe</Label>
                            <Input
                                id="profile-confirm"
                                type="password"
                                value={profileData.confirmPassword}
                                onChange={(e) => setProfileData({ ...profileData, confirmPassword: e.target.value })}
                                placeholder="Confirmer le nouveau mot de passe"
                            />
                        </div>
                        
                        {profileError && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-3 py-2 rounded-lg">
                                {profileError}
                            </div>
                        )}
                        
                        {profileSuccess && (
                            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm px-3 py-2 rounded-lg">
                                {profileSuccess}
                            </div>
                        )}
                    </div>
                    
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setEditProfileOpen(false)}
                            disabled={profileLoading}
                        >
                            Annuler
                        </Button>
                        <Button
                            onClick={handleSaveProfile}
                            disabled={profileLoading}
                            className="bg-emerald-600 hover:bg-emerald-700"
                        >
                            {profileLoading ? 'Enregistrement...' : 'Enregistrer'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Main content */}
            <div className="flex-1 flex flex-col min-h-screen lg:ml-72">
                {/* Top bar */}
                <header className="sticky top-0 z-30 border-b border-border/50 bg-background/80 backdrop-blur-xl">
                    <div className="flex items-center justify-between px-4 lg:px-8 h-16">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <Menu className="w-5 h-5" />
                            </button>
                            <div>
                                <h2 className="text-lg font-semibold">{currentPage?.label || 'Break Gaming'}</h2>
                                <p className="text-xs text-muted-foreground hidden sm:block">{currentPage?.description}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground bg-card/50 px-3 py-1.5 rounded-full border border-border/50">
                                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                Système en ligne
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 p-4 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
