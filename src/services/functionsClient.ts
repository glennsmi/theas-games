import { getApp, initializeApp } from 'firebase/app'
import { getFunctions, httpsCallable, connectFunctionsEmulator, Functions } from 'firebase/functions'
import { firebaseConfig, useEmulator, emulatorConfig } from '@/config/firebase'
import type { ApiResponse, PaginatedResponse } from '@shared/types/common'
import type { User, CreateUser, UpdateUser, PaginationParams } from '@shared/schemas/user'

// Initialize Firebase app
const app = (() => {
  try { 
    return getApp() 
  } catch { 
    return initializeApp(firebaseConfig) 
  }
})()

// Initialize Functions with emulator connection
let functionsInstance: Functions

// Track if emulator connection has been attempted
let emulatorConnected = false

function initializeFunctions(): Functions {
  if (useEmulator && !emulatorConnected) {
    try {
      // For emulator, use default region first
      const functions = getFunctions(app)
      connectFunctionsEmulator(functions, emulatorConfig.functions.host, emulatorConfig.functions.port)
      emulatorConnected = true
      console.log('✅ Connected to functions emulator at', `${emulatorConfig.functions.host}:${emulatorConfig.functions.port}`)
      console.log('📊 Using project ID:', app.options.projectId)
      console.log('🌍 Emulator will handle region routing to europe-west2')
      return functions
    } catch (error) {
      console.warn('❌ Failed to connect to functions emulator:', error)
      emulatorConnected = true // Prevent retry
      return getFunctions(app, 'europe-west2')
    }
  } else if (useEmulator && emulatorConnected) {
    // Already connected, just return functions instance (no region needed for emulator)
    return getFunctions(app)
  } else {
    // Production - use europe-west2 region
    console.log('🌍 Using production functions in europe-west2')
    return getFunctions(app, 'europe-west2')
  }
}

// Initialize functions instance
functionsInstance = initializeFunctions()

export async function callHelloWorld(): Promise<ApiResponse<{ message: string }>> {
  const fn = httpsCallable(functionsInstance, 'helloWorld')
  const res = await fn()
  return res.data as ApiResponse<{ message: string }>
}

export async function callGetUsers(params: Pick<PaginationParams, 'page' | 'limit'>): Promise<PaginatedResponse<User>> {
  const fn = httpsCallable(functionsInstance, 'getUsers')
  const res = await fn(params)
  return res.data as PaginatedResponse<User>
}

export async function callCreateUser(payload: CreateUser): Promise<ApiResponse<User>> {
  const fn = httpsCallable(functionsInstance, 'createUser')
  const res = await fn(payload)
  return res.data as ApiResponse<User>
}

export async function callGetCurrentUser(): Promise<ApiResponse<User>> {
  const fn = httpsCallable(functionsInstance, 'getCurrentUser')
  const res = await fn()
  return res.data as ApiResponse<User>
}

export async function callUpdateUser(payload: UpdateUser): Promise<ApiResponse<User>> {
  const fn = httpsCallable(functionsInstance, 'updateUser')
  const res = await fn(payload)
  return res.data as ApiResponse<User>
}


