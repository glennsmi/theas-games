import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth } from '@/config/firebase'
import { updateChild } from '@/services/parentService'
import { getUserSubscription, isPremiumSubscription } from '@/services/subscriptionService'
import { ChildProfile } from '@shared/schemas/child'
import { Button } from '@/components/ui/button'
import { Loader2, ArrowLeft, Check, Save, User, Lock } from 'lucide-react'
import { toast } from 'sonner'
import { useChild } from '@/context/ChildContext'

// Predefined colors for the character
const CHARACTER_COLORS = [
  { name: 'Original', value: 0xFFFFFF, hex: '#FFFFFF' },
  { name: 'Ocean Blue', value: 0x00BFFF, hex: '#00BFFF' },
  { name: 'Coral Red', value: 0xFF7F50, hex: '#FF7F50' },
  { name: 'Seaweed Green', value: 0x3CB371, hex: '#3CB371' },
  { name: 'Pearl Pink', value: 0xFFC0CB, hex: '#FFC0CB' },
  { name: 'Golden Sand', value: 0xFFD700, hex: '#FFD700' },
  { name: 'Deep Purple', value: 0x9370DB, hex: '#9370DB' },
]

export default function CharacterCreationPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [hasAccess, setHasAccess] = useState(false)
  const { childrenProfiles, activeChildId, setActiveChildId, refreshChildren } = useChild()
  
  const [selectedChildId, setSelectedChildId] = useState<string | null>(activeChildId)
  
  // Character state
  const [selectedColor, setSelectedColor] = useState(CHARACTER_COLORS[0])
  
  // Canvas ref for preview
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Check premium access
  useEffect(() => {
    const checkAccess = async () => {
      if (!auth.currentUser) {
        navigate('/subscription')
        return
      }
      
      const subscription = await getUserSubscription(auth.currentUser.uid)
      if (isPremiumSubscription(subscription)) {
        setHasAccess(true)
        setLoading(false)
      } else {
        navigate('/subscription')
      }
    }
    checkAccess()
  }, [navigate])

  // Load config whenever selected child or profiles change
  useEffect(() => {
    if (!auth.currentUser || !hasAccess) {
      return
    }

    // If we have an active child ID, prioritize that
    if (activeChildId) {
      if (selectedChildId !== activeChildId) {
        setSelectedChildId(activeChildId)
      }
      const child = childrenProfiles.find(c => c.id === activeChildId)
      if (child) {
        loadChildConfig(child)
      }
    } else if (childrenProfiles.length > 0 && !selectedChildId) {
       // Default to first if none selected
       const firstChild = childrenProfiles[0]
       setSelectedChildId(firstChild.id)
       loadChildConfig(firstChild)
    }
  }, [navigate, activeChildId, childrenProfiles, hasAccess])

  const loadChildConfig = (child: ChildProfile) => {
    let colorToSet = CHARACTER_COLORS[0] // Default to Original

    if (child.avatarConfig) {
      try {
        const config = JSON.parse(child.avatarConfig)
        // Check if tint is defined and valid
        if (config.tint !== undefined) {
          const foundColor = CHARACTER_COLORS.find(c => c.value === config.tint)
          if (foundColor) {
            colorToSet = foundColor
          }
        }
      } catch (e) {
        console.error('Failed to parse avatar config', e)
      }
    }
    
    setSelectedColor(colorToSet)
  }

  const handleChildSelect = (childId: string) => {
    setSelectedChildId(childId)
    // Also update global active child so context stays in sync
    setActiveChildId(childId)
    
    const child = childrenProfiles.find(c => c.id === childId)
    if (child) {
      loadChildConfig(child)
    }
  }

  const handleSave = async () => {
    if (!selectedChildId || !auth.currentUser) return

    setSaving(true)
    try {
      const config = {
        tint: selectedColor.value
      }
      
      await updateChild(auth.currentUser.uid, selectedChildId, {
        avatarConfig: JSON.stringify(config)
      })
      
      // Refresh context to ensure all components get the new data
      await refreshChildren()
      
      toast.success('Character saved successfully!')
      navigate('/')
    } catch (error) {
      console.error('Error saving character:', error)
      toast.error('Failed to save character.')
    } finally {
      setSaving(false)
    }
  }

  // Draw preview
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = new Image()
    img.src = '/thea-mermaid-logo-transparent.png'
    
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Draw image
      const scale = Math.min(canvas.width / img.width, canvas.height / img.height) * 0.8
      const x = (canvas.width - img.width * scale) / 2
      const y = (canvas.height - img.height * scale) / 2
      
      // 1. Draw original image
      ctx.globalCompositeOperation = 'source-over'
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale)
      
      // 2. Tinting
      if (selectedColor.value !== 0xFFFFFF) {
        // Reset and redraw for multiply effect (matches Phaser's tint better)
        ctx.globalCompositeOperation = 'source-over'
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale)
        
        ctx.globalCompositeOperation = 'multiply'
        ctx.fillStyle = selectedColor.hex
        ctx.fillRect(x, y, img.width * scale, img.height * scale)
        
        // Mask the rectangle to the image alpha
        ctx.globalCompositeOperation = 'destination-in'
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale)
      }
      
      // Reset composite op
      ctx.globalCompositeOperation = 'source-over'
    }
  }, [selectedColor])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-sky-50">
        <Loader2 className="w-8 h-8 animate-spin text-[#40B5A8]" />
        <p className="mt-4 text-slate-600">Checking access...</p>
      </div>
    )
  }

  // If no access (shouldn't happen as we redirect, but safety check)
  if (!hasAccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-sky-50">
        <Lock className="w-16 h-16 text-medium-purple mb-4" />
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Premium Feature</h2>
        <p className="text-slate-600 mb-6">Subscribe to unlock Character Creator!</p>
        <Button onClick={() => navigate('/subscription')} className="bg-medium-purple hover:bg-deep-purple">
          View Plans
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-sky-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-slate-800">Character Creator</h1>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column: Preview */}
          <div className="bg-white rounded-2xl p-8 shadow-lg flex flex-col items-center justify-center min-h-[400px]">
             <div className="relative w-full aspect-square max-w-sm flex items-center justify-center bg-blue-50 rounded-xl overflow-hidden border-2 border-blue-100">
               {/* Background decoration */}
               <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-200 via-transparent to-transparent"></div>
               
               <canvas 
                 ref={canvasRef} 
                 width={400} 
                 height={400}
                 className="relative z-10 w-full h-full object-contain"
               />
             </div>
             <p className="mt-4 text-slate-500 text-sm">Preview</p>
          </div>

          {/* Right Column: Controls */}
          <div className="space-y-6">
            {/* Child Selector */}
            {childrenProfiles.length > 0 && (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <label className="block text-sm font-medium text-slate-700 mb-3">Select Child Profile</label>
                <div className="flex flex-wrap gap-2">
                  {childrenProfiles.map(child => (
                    <button
                      key={child.id}
                      onClick={() => handleChildSelect(child.id)}
                      className={`
                        flex items-center gap-2 px-4 py-2 rounded-full transition-all
                        ${selectedChildId === child.id 
                          ? 'bg-[#40B5A8] text-white shadow-md' 
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}
                      `}
                    >
                      <User className="w-4 h-4" />
                      {child.displayName}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selector */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <label className="block text-sm font-medium text-slate-700 mb-3">Choose Color</label>
              <div className="grid grid-cols-4 gap-3">
                {CHARACTER_COLORS.map(color => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color)}
                    className={`
                      relative group p-1 rounded-full border-2 transition-all
                      ${selectedColor.value === color.value 
                        ? 'border-slate-800 scale-110' 
                        : 'border-transparent hover:scale-105'}
                    `}
                    title={color.name}
                  >
                    <div 
                      className="w-12 h-12 rounded-full shadow-sm"
                      style={{ backgroundColor: color.hex }}
                    />
                    {selectedColor.value === color.value && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Check className={`w-6 h-6 ${color.hex === '#FFFFFF' ? 'text-slate-800' : 'text-white'}`} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
              <p className="mt-3 text-center text-sm font-medium text-slate-600">
                {selectedColor.name}
              </p>
            </div>

            {/* Save Button */}
            <Button 
              size="lg" 
              className="w-full text-lg gap-2"
              onClick={handleSave}
              disabled={saving || !selectedChildId}
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              Save Character
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
