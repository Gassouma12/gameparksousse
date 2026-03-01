import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import {
  getBills, addBill, markBillAsPaid, deleteBill,
  getTableStates, saveTableState, clearTableState,
  getSettings, updateSettings, seedDemoData,
  getPlayers, addPlayer as storageAddPlayer, updatePlayer as storageUpdatePlayer, deletePlayer as storageDeletePlayer,
  getTableNames, saveTableName,
} from '@/lib/storage'
import { generateId, calculatePrice } from '@/lib/utils'

const AppContext = createContext(null)

const TABLE_COUNT = 4

function createInitialTables() {
  const savedStates = getTableStates()
  // We'll load names async, so start with defaults
  return Array.from({ length: TABLE_COUNT }, (_, i) => {
    const id = i + 1
    const saved = savedStates[id]
    if (saved && saved.active) {
      const elapsedSinceSave = Math.floor((Date.now() - saved.lastSavedAt) / 1000)
      return {
        id,
        name: `Table ${id}`, // Will be updated from Supabase
        active: true,
        startTime: saved.startTime,
        elapsed: saved.elapsed + elapsedSinceSave,
      }
    }
    return {
      id,
      name: `Table ${id}`,
      active: false,
      startTime: null,
      elapsed: 0,
    }
  })
}

export function AppProvider({ children }) {
  const [tables, setTables] = useState(createInitialTables)
  const [bills, setBills] = useState([])
  const [settings, setSettings] = useState({
    hourlyRate: 10,
    currency: 'TND',
    clubName: 'Break Gaming',
    tableCount: 4,
  })
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(true)
  const intervalRefs = useRef({})

  // Initial data load
  useEffect(() => {
    async function loadData() {
      try {
        console.log('🔄 [APPCONTEXT] Loading initial data...')
        
        // Load all data in parallel
        const [billsData, settingsData, playersData, tableNamesData] = await Promise.all([
          getBills(),
          getSettings(),
          getPlayers(),
          getTableNames(),
        ])

        setBills(billsData)
        setSettings(settingsData)
        setPlayers(playersData)

        // Update table names
        setTables(prev => prev.map(t => ({
          ...t,
          name: tableNamesData[t.id] || t.name,
        })))

        setLoading(false)
      } catch (error) {
        console.error('Error loading data:', error)
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Refresh bills from storage
  const refreshBills = useCallback(async () => {
    const data = await getBills()
    setBills(data)
  }, [])

  // Refresh players from storage
  const refreshPlayers = useCallback(async () => {
    const data = await getPlayers()
    setPlayers(data)
  }, [])

  // Timer logic
  useEffect(() => {
    tables.forEach(table => {
      if (table.active && !intervalRefs.current[table.id]) {
        intervalRefs.current[table.id] = setInterval(() => {
          setTables(prev => prev.map(t =>
            t.id === table.id ? { ...t, elapsed: t.elapsed + 1 } : t
          ))
        }, 1000)
      } else if (!table.active && intervalRefs.current[table.id]) {
        clearInterval(intervalRefs.current[table.id])
        delete intervalRefs.current[table.id]
      }
    })

    return () => { }
  }, [tables.map(t => t.active).join(',')])

  // Save active table states periodically
  useEffect(() => {
    const saveInterval = setInterval(() => {
      tables.forEach(table => {
        if (table.active) {
          saveTableState(table.id, {
            active: true,
            startTime: table.startTime,
            elapsed: table.elapsed,
            lastSavedAt: Date.now(),
          })
        }
      })
    }, 5000)

    return () => clearInterval(saveInterval)
  }, [tables])

  const startTable = useCallback((tableId) => {
    const now = new Date().toISOString()
    setTables(prev => prev.map(t =>
      t.id === tableId
        ? { ...t, active: true, startTime: now, elapsed: 0 }
        : t
    ))
    saveTableState(tableId, {
      active: true,
      startTime: now,
      elapsed: 0,
      lastSavedAt: Date.now(),
    })
  }, [])

  const stopTable = useCallback((tableId) => {
    const table = tables.find(t => t.id === tableId)
    if (!table) return null

    if (intervalRefs.current[tableId]) {
      clearInterval(intervalRefs.current[tableId])
      delete intervalRefs.current[tableId]
    }

    const sessionInfo = {
      tableNumber: tableId,
      startTime: table.startTime,
      endTime: new Date().toISOString(),
      duration: table.elapsed,
      price: calculatePrice(table.elapsed, settings.hourlyRate),
    }

    setTables(prev => prev.map(t =>
      t.id === tableId
        ? { ...t, active: false, startTime: null, elapsed: 0 }
        : t
    ))
    clearTableState(tableId)

    return sessionInfo
  }, [tables, settings.hourlyRate])

  const renameTable = useCallback(async (tableId, newName) => {
    setTables(prev => prev.map(t =>
      t.id === tableId ? { ...t, name: newName } : t
    ))
    await saveTableName(tableId, newName)
  }, [])

  const changeHourlyRate = useCallback(async (newRate) => {
    const updated = await updateSettings({ hourlyRate: newRate })
    if (updated) {
      setSettings(updated)
    }
  }, [])

  const createBill = useCallback(async (sessionInfo, playerName) => {
    const bill = {
      id: generateId(),
      ...sessionInfo,
      playerName,
      paid: false,
      paidAt: null,
      createdAt: new Date().toISOString(),
    }
    await addBill(bill)
    await refreshBills()
    return bill
  }, [refreshBills])

  const payBill = useCallback(async (billId) => {
    await markBillAsPaid(billId)
    await refreshBills()
  }, [refreshBills])

  const removeBill = useCallback(async (billId) => {
    await deleteBill(billId)
    await refreshBills()
  }, [refreshBills])

  // Player management
  const addNewPlayer = useCallback(async (playerData) => {
    const player = {
      id: generateId(),
      ...playerData,
      createdAt: new Date().toISOString(),
    }
    await storageAddPlayer(player)
    await refreshPlayers()
    return player
  }, [refreshPlayers])

  const editPlayer = useCallback(async (playerId, updates) => {
    await storageUpdatePlayer(playerId, updates)
    await refreshPlayers()
  }, [refreshPlayers])

  const removePlayer = useCallback(async (playerId) => {
    await storageDeletePlayer(playerId)
    await refreshPlayers()
  }, [refreshPlayers])

  // Refresh all data (for DB operations)
  const refreshData = useCallback(async () => {
    console.log('🔄 [APPCONTEXT] Refreshing all data...')
    const [billsData, playersData] = await Promise.all([
      getBills(),
      getPlayers(),
    ])
    setBills(billsData)
    setPlayers(playersData)
    console.log('✅ [APPCONTEXT] Data refreshed')
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pool-bg">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Chargement des données...</p>
        </div>
      </div>
    )
  }

  return (
    <AppContext.Provider value={{
      tables,
      bills,
      settings,
      players,
      startTable,
      stopTable,
      renameTable,
      changeHourlyRate,
      createBill,
      payBill,
      removeBill,
      refreshBills,
      refreshData,
      addNewPlayer,
      editPlayer,
      removePlayer,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
