import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://ctygupgtlawlgcikmkqz.supabase.co'
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'your-anon-key-here'

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Debug: Log Supabase configuration
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Anon Key:', supabaseAnonKey ? 'Set' : 'Not set');

// Database table names
export const TABLES = {
  CVS: 'cvs',
  USERS: 'users',
  TEMPLATES: 'templates'
}

// CV operations
export const cvService = {
  // Get all CVs for a user
  async getCVs(userId) {
    const { data, error } = await supabase
      .from(TABLES.CVS)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Get a specific CV by ID
  async getCV(cvId) {
    const { data, error } = await supabase
      .from(TABLES.CVS)
      .select('*')
      .eq('id', cvId)
      .single()
    
    if (error) throw error
    return data
  },

  // Create a new CV
  async createCV(cvData) {
    const { data, error } = await supabase
      .from(TABLES.CVS)
      .insert([cvData])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Update an existing CV
  async updateCV(cvId, cvData) {
    const { data, error } = await supabase
      .from(TABLES.CVS)
      .update(cvData)
      .eq('id', cvId)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Delete a CV
  async deleteCV(cvId) {
    const { error } = await supabase
      .from(TABLES.CVS)
      .delete()
      .eq('id', cvId)
    
    if (error) throw error
  },

  // Search CVs by name, title, or company
  async searchCVs(userId, searchTerm) {
    const { data, error } = await supabase
      .from(TABLES.CVS)
      .select('*')
      .eq('user_id', userId)
      .or(`name.ilike.%${searchTerm}%,title.ilike.%${searchTerm}%,company.ilike.%${searchTerm}%`)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }
}

// Authentication operations
export const authService = {
  // Sign up a new user
  async signUp(email, password, userData = {}) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })
    
    if (error) throw error
    return data
  },

  // Sign in an existing user
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) throw error
    return data
  },

  // Sign out current user
  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  // Get current user
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  },

  // Listen to auth state changes
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback)
  }
}

// Storage operations for CV files
export const storageService = {
  // Upload CV PDF
  async uploadCVPDF(userId, cvId, file) {
    const fileName = `cv-${cvId}-${Date.now()}.pdf`
    const filePath = `${userId}/${fileName}`
    
    const { data, error } = await supabase.storage
      .from('cv-files')
      .upload(filePath, file)
    
    if (error) throw error
    return data
  },

  // Get CV PDF download URL
  async getCVPDFUrl(userId, fileName) {
    const { data, error } = await supabase.storage
      .from('cv-files')
      .createSignedUrl(`${userId}/${fileName}`, 3600) // 1 hour expiry
    
    if (error) throw error
    return data.signedUrl
  },

  // Delete CV PDF
  async deleteCVPDF(userId, fileName) {
    const { error } = await supabase.storage
      .from('cv-files')
      .remove([`${userId}/${fileName}`])
    
    if (error) throw error
  }
}

// Template operations
export const templateService = {
  // Get all available templates
  async getTemplates() {
    const { data, error } = await supabase
      .from(TABLES.TEMPLATES)
      .select('*')
      .order('name')
    
    if (error) throw error
    return data
  },

  // Get a specific template
  async getTemplate(templateId) {
    const { data, error } = await supabase
      .from(TABLES.TEMPLATES)
      .select('*')
      .eq('id', templateId)
      .single()
    
    if (error) throw error
    return data
  }
}

export default supabase
