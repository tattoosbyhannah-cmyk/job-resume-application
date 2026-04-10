// Loads the current user's profile + experience + education + role
// templates + companies from Firestore once and exposes them via context.
// Reduces redundant fetches across wizard steps and dashboard.

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import {
  getProfile,
  listExperience,
  listEducation,
  listRoleTemplates,
  listCompanies,
} from '../lib/firestore'

const ProfileContext = createContext({
  profile: null,
  experience: [],
  education: [],
  roleTemplates: [],
  companies: [],
  loading: true,
  reload: () => {},
})

export function ProfileProvider({ children }) {
  const { user, loading: authLoading } = useAuth()
  const [profile, setProfile] = useState(null)
  const [experience, setExperience] = useState([])
  const [education, setEducation] = useState([])
  const [roleTemplates, setRoleTemplates] = useState([])
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    if (!user) {
      setProfile(null)
      setExperience([])
      setEducation([])
      setRoleTemplates([])
      setCompanies([])
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const [p, exp, edu, rts, cos] = await Promise.all([
        getProfile(user.uid),
        listExperience(user.uid),
        listEducation(user.uid),
        listRoleTemplates(user.uid),
        listCompanies(user.uid),
      ])
      setProfile(p)
      setExperience(exp)
      setEducation(edu)
      setRoleTemplates(rts)
      setCompanies(cos)
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[profile] load failed', err)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (!authLoading) load()
  }, [authLoading, load])

  return (
    <ProfileContext.Provider
      value={{
        profile,
        experience,
        education,
        roleTemplates,
        companies,
        loading,
        reload: load,
      }}
    >
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfile() {
  return useContext(ProfileContext)
}
