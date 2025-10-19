import { useState, useEffect } from 'react'
import { useSupabase } from './SupabaseProvider'
import { supabase } from './supabase'

// Custom hook for authentication
export const useAuth = () => {
  const { user, session, loading, signUp, signIn, signOut } = useSupabase()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    setIsAuthenticated(!!user)
  }, [user])

  return {
    user,
    session,
    loading,
    isAuthenticated,
    signUp,
    signIn,
    signOut
  }
}

// Custom hook for CV operations
export const useCVs = () => {
  const { user } = useSupabase()
  const [cvs, setCvs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch CVs for current user (lightweight version for list display)
  const fetchCVs = async () => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)
      // Only select essential fields for fast loading
      const { data, error } = await supabase
        .from('cvs')
        .select(`
          id,
          name,
          title,
          company,
          created_at,
          updated_at,
          cv_data
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setCvs(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Fetch complete CV data when needed (for editing)
  const fetchCompleteCV = async (cvId) => {
    if (!user) return null

    try {
      const { data, error } = await supabase
        .from('cvs')
        .select('*')
        .eq('id', cvId)
        .eq('user_id', user.id)
        .single()
      
      if (error) throw error
      return data
    } catch (err) {
      console.error('Error fetching complete CV:', err)
      throw err
    }
  }

  // Create new CV
  const createCV = async (cvData) => {
    if (!user) throw new Error('User not authenticated')

    try {
      setLoading(true)
      setError(null)
      const { data, error } = await supabase
        .from('cvs')
        .insert([{
          ...cvData,
          user_id: user.id,
          created_at: new Date().toISOString()
        }])
        .select()
        .single()
      
      if (error) throw error
      setCvs(prev => [data, ...prev])
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Update existing CV
  const updateCV = async (cvId, cvData) => {
    try {
      setLoading(true)
      setError(null)
      const { data, error } = await supabase
        .from('cvs')
        .update(cvData)
        .eq('id', cvId)
        .select()
        .single()
      
      if (error) throw error
      setCvs(prev => prev.map(cv => cv.id === cvId ? data : cv))
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Delete CV
  const deleteCV = async (cvId) => {
    try {
      setLoading(true)
      setError(null)
      const { error } = await supabase
        .from('cvs')
        .delete()
        .eq('id', cvId)
      
      if (error) throw error
      setCvs(prev => prev.filter(cv => cv.id !== cvId))
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Search CVs (lightweight version)
  const searchCVs = async (searchTerm) => {
    if (!user) return []

    try {
      setLoading(true)
      setError(null)
      // Only select essential fields for fast search
      const { data, error } = await supabase
        .from('cvs')
        .select(`
          id,
          name,
          title,
          company,
          created_at,
          updated_at,
          cv_data
        `)
        .eq('user_id', user.id)
        .or(`name.ilike.%${searchTerm}%,title.ilike.%${searchTerm}%,company.ilike.%${searchTerm}%`)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data || []
    } catch (err) {
      setError(err.message)
      return []
    } finally {
      setLoading(false)
    }
  }

  // Auto-fetch CVs when user changes
  useEffect(() => {
    if (user) {
      fetchCVs()
    } else {
      setCvs([])
    }
  }, [user])

  return {
    cvs,
    loading,
    error,
    fetchCVs,
    fetchCompleteCV,
    createCV,
    updateCV,
    deleteCV,
    searchCVs
  }
}

export default useAuth
