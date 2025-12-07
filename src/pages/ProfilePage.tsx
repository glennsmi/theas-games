
import { useState, useEffect } from 'react'
import { auth } from '../config/firebase'
import { updateProfile } from 'firebase/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Avatar, { genConfig, AvatarFullConfig } from 'react-nice-avatar'
import { Loader2, RefreshCw, Save, ChevronDown, ChevronUp, X } from 'lucide-react'

// Options for avatar customization
const hairStyles = ["normal", "thick", "mohawk", "womanLong", "womanShort"]
const hatStyles = ["none", "beanie", "turban"]
const eyeStyles = ["circle", "oval", "smile"]
const glassesStyles = ["none", "round", "square"]
const mouthStyles = ["laugh", "smile", "peace"]
const shirtStyles = ["hoody", "short", "polo"]
const noseStyles = ["short", "long", "round"]
const earSizes = ["small", "big"]
const sexOptions = ["man", "woman"]

const defaultBgColors = [
  "#ffffff", // White
  "#f3f4f6", // Gray
  "#fca5a5", // Light Red
  "#fdba74", // Light Orange
  "#fde047", // Light Yellow
  "#86efac", // Light Green
  "#5eead4", // Teal
  "#93c5fd", // Light Blue
  "#a5b4fc", // Indigo
  "#d8b4fe", // Purple
  "#f9a8d4", // Pink
  "#cca788", // Brown
]

const underwaterItems = [
  { id: "none", label: "None", icon: "🚫" },
  { id: "trident", label: "Trident", icon: "🔱" },
  { id: "snorkel", label: "Snorkel", icon: "🤿" },
  { id: "surfboard", label: "Surfboard", icon: "🏄" },
  { id: "fish", label: "Fish Friend", icon: "🐠" },
  { id: "shark", label: "Shark Friend", icon: "🦈" },
  { id: "shell", label: "Sea Shell", icon: "🐚" },
  { id: "anchor", label: "Anchor", icon: "⚓" },
  { id: "starfish", label: "Starfish", icon: "⭐" },
  { id: "crab", label: "Crab", icon: "🦀" },
]

// Extended config interface to include our custom props
interface AvatarAccessory {
  id: string; // unique instance id
  itemId: string; // type of item (trident, fish, etc)
  x: number;
  y: number;
  size: number;
  zIndex: number;
}

interface CustomAvatarConfig extends AvatarFullConfig {
  accessories?: AvatarAccessory[];
  // Deprecated single item fields (kept for migration/fallback)
  underwaterItem?: string;
  itemPosition?: { x: number; y: number };
  itemSize?: number;
}

export default function ProfilePage() {
  const user = auth.currentUser
  const [displayName, setDisplayName] = useState(user?.displayName || '')
  const [avatarConfig, setAvatarConfig] = useState<CustomAvatarConfig>(genConfig())
  const [activeSection, setActiveSection] = useState<string>('style');


  // State for dragging/interacting
  const [selectedAccessoryId, setSelectedAccessoryId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [itemStart, setItemStart] = useState({ x: 0, y: 0 })

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    if (user?.displayName) {
      setDisplayName(user.displayName)
    }
    if (user?.photoURL && user.photoURL.startsWith('{')) {
      try {
        const parsed = JSON.parse(user.photoURL);
        // Migration: If using old single-item format, convert to accessories array
        if (parsed.underwaterItem && parsed.underwaterItem !== 'none' && (!parsed.accessories || parsed.accessories.length === 0)) {
          parsed.accessories = [{
            id: 'legacy-item',
            itemId: parsed.underwaterItem,
            x: parsed.itemPosition?.x || 0,
            y: parsed.itemPosition?.y || 0,
            size: parsed.itemSize || 40,
            zIndex: 10 // default to front
          }];
        }
        setAvatarConfig(parsed)
      } catch (e) {
        // invalid json, keep default
      }
    }
  }, [user])

  const handleRandomize = () => {
    setAvatarConfig(genConfig())
  }

  const handleConfigChange = (key: keyof CustomAvatarConfig, value: any) => {
    setAvatarConfig(prev => {
      const updates: any = { [key]: value };
      // If changing hair color, ensure random is off so it shows
      if (key === 'hairColor') {
        updates.hairColorRandom = false;
      }
      return { ...prev, ...updates };
    })
  }

  // Accessory Drag Handlers
  const handleMouseDown = (e: React.MouseEvent, accessoryId: string) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent triggering other things
    const accessory = avatarConfig.accessories?.find(a => a.id === accessoryId);
    if (!accessory) return;

    setSelectedAccessoryId(accessoryId);
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setItemStart({ x: accessory.x, y: accessory.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !selectedAccessoryId) return;

    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;

    setAvatarConfig(prev => {
      const newAccessories = prev.accessories?.map(acc => {
        if (acc.id === selectedAccessoryId) {
          return { ...acc, x: itemStart.x + dx, y: itemStart.y + dy };
        }
        return acc;
      }) || [];
      return { ...prev, accessories: newAccessories };
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleAddAccessory = (itemId: string) => {
    if (itemId === 'none') {
      // Clear all accessories
      setAvatarConfig(prev => ({ ...prev, accessories: [] }));
      setSelectedAccessoryId(null);
      return;
    }

    // Allow multiple items (removed existence check)

    const newAccessory: AvatarAccessory = {
      id: Date.now().toString(), // simple unique id
      itemId,
      x: 0,
      y: 0,
      size: 40,
      zIndex: 10 // default front
    };

    setAvatarConfig(prev => ({
      ...prev,
      accessories: [...(prev.accessories || []), newAccessory]
    }));
    setSelectedAccessoryId(newAccessory.id);
  };

  const handleUpdateSize = (newSize: number) => {
    if (!selectedAccessoryId) return;
    setAvatarConfig(prev => ({
      ...prev,
      accessories: prev.accessories?.map(acc =>
        acc.id === selectedAccessoryId ? { ...acc, size: newSize } : acc
      )
    }));
  };


  // Helper to delete specific item (for the X button)
  const handleDeleteItem = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setAvatarConfig(prev => ({
      ...prev,
      accessories: prev.accessories?.filter(a => a.id !== id)
    }));
    if (selectedAccessoryId === id) {
      setSelectedAccessoryId(null);
    }
  };

  // Add global mouse up listener for robustness
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
    }
  }, [isDragging]);

  const handleSave = async () => {
    if (!user) return
    setLoading(true)
    setMessage(null)

    try {
      await updateProfile(user, {
        displayName: displayName,
        photoURL: JSON.stringify(avatarConfig)
      })

      // Reload the user to get updated data
      await user.reload()

      setMessage({ type: 'success', text: 'Profile updated successfully!' })

      // Force a small delay then reload to update header with new avatar
      setTimeout(() => {
        window.location.reload()
      }, 500)
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update profile.' })
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Please sign in to view settings.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-dark-navy mb-8">Settings</h1>

      <div className="flex flex-col gap-8">
        {/* Profile Details */}
        <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-white/50 w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-dark-navy">Profile Details</CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={user.email || ''} disabled className="bg-gray-50" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Display Name</Label>
                <Input
                  id="name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Enter your name"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Avatar Creator */}
        <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-white/50">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-[280px,1fr] gap-8">
              {/* Left Column - Title and Preview */}
              <div className="flex flex-col gap-6">
                <div>
                  <h2 className="text-xl font-bold text-dark-navy">Avatar Creator</h2>
                  <p className="text-sm text-gray-500 mt-1">Design your unique look</p>
                </div>

                <div className="flex flex-col items-center gap-6">
                  {/* Avatar preview with proper overflow handling */}
                  <div className="relative w-40 h-40" style={{ isolation: 'isolate' }}>
                    <div
                      className="absolute inset-0 rounded-full border-4 border-white shadow-xl select-none overflow-visible"
                      onMouseMove={handleMouseMove}
                      onMouseLeave={handleMouseUp}
                    >
                      {/* Background layer - furthest back */}
                      <div className="absolute inset-0 rounded-full bg-light-teal/20" style={{ zIndex: 0 }} />

                      {/* Render Back Accessories (zIndex < 0) -behind avatar but in front of background */}
                      {avatarConfig.accessories?.filter(acc => (acc.zIndex || 0) < 0).map((acc) => (
                        <div
                          key={acc.id}
                          className={`absolute cursor-move filter drop-shadow-md transition-filter ${selectedAccessoryId === acc.id ? 'brightness-110 drop-shadow-lg' : ''}`}
                          style={{
                            left: '50%',
                            top: '50%',
                            transform: `translate(-50%, -50%) translate(${acc.x}px, ${acc.y}px)`,
                            fontSize: `${acc.size}px`,
                            cursor: isDragging && selectedAccessoryId === acc.id ? 'grabbing' : 'grab',
                            border: selectedAccessoryId === acc.id ? '2px dashed rgba(0,0,0,0.3)' : 'none',
                            borderRadius: '50%',
                            padding: '2px',
                            zIndex: 5 // Behind avatar but in front of background
                          }}
                          onMouseDown={(e) => handleMouseDown(e, acc.id)}
                        >
                          {underwaterItems.find(i => i.id === acc.itemId)?.icon}
                          {selectedAccessoryId === acc.id && (
                            <button
                              onClick={(e) => handleDeleteItem(e, acc.id)}
                              className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-0.5 shadow-sm hover:bg-red-600 transition-colors w-5 h-5 flex items-center justify-center"
                              style={{ zIndex: 100 }}
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      ))}

                      {/* Avatar - middle layer */}
                      <div className="absolute inset-0 overflow-hidden rounded-full" style={{ zIndex: 10 }}>
                        <Avatar className="w-full h-full" {...avatarConfig} />
                      </div>

                      {/* Render Front Accessories (zIndex >= 0) - in front of avatar */}
                      {avatarConfig.accessories?.filter(acc => (acc.zIndex || 0) >= 0).map((acc) => (
                        <div
                          key={acc.id}
                          className={`absolute cursor-move filter drop-shadow-md transition-filter ${selectedAccessoryId === acc.id ? 'brightness-110 drop-shadow-lg' : ''}`}
                          style={{
                            left: '50%',
                            top: '50%',
                            transform: `translate(-50%, -50%) translate(${acc.x}px, ${acc.y}px)`,
                            fontSize: `${acc.size}px`,
                            cursor: isDragging && selectedAccessoryId === acc.id ? 'grabbing' : 'grab',
                            border: selectedAccessoryId === acc.id ? '2px dashed rgba(0,0,0,0.3)' : 'none',
                            borderRadius: '50%',
                            padding: '2px',
                            zIndex: 20 // In front of avatar
                          }}
                          onMouseDown={(e) => handleMouseDown(e, acc.id)}
                        >
                          {underwaterItems.find(i => i.id === acc.itemId)?.icon}
                          {selectedAccessoryId === acc.id && (
                            <button
                              onClick={(e) => handleDeleteItem(e, acc.id)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 shadow-sm hover:bg-red-600 transition-colors w-5 h-5 flex items-center justify-center"
                              style={{ zIndex: 100 }}
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    onClick={handleRandomize}
                    className="flex items-center gap-2 w-full max-w-[200px]"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Randomize
                  </Button>
                </div>
              </div>

              {/* Right Column - All Customization Options with Accordions */}
              <div className="max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">

                {/* Style Section */}
                <div className="border border-gray-200 rounded-lg mb-4 overflow-hidden">
                  <button
                    className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                    onClick={() => setActiveSection(activeSection === 'style' ? '' : 'style')}
                  >
                    <span className="font-semibold text-dark-navy">Style</span>
                    {activeSection === 'style' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>

                  {activeSection === 'style' && (
                    <div className="p-4 bg-white border-t border-gray-100">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Gender</Label>
                          <select
                            className="w-full p-2 rounded-md border border-input bg-background text-sm"
                            value={avatarConfig.sex}
                            onChange={(e) => handleConfigChange('sex', e.target.value)}
                          >
                            {sexOptions.map(s => <option key={s} value={s}>{s === 'man' ? 'Boy' : 'Girl'}</option>)}
                          </select>
                        </div>

                        <div className="space-y-2">
                          <Label>Hair Style</Label>
                          <select
                            className="w-full p-2 rounded-md border border-input bg-background text-sm"
                            value={avatarConfig.hairStyle}
                            onChange={(e) => handleConfigChange('hairStyle', e.target.value)}
                          >
                            {hairStyles.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>

                        <div className="space-y-2">
                          <Label>Hat Style</Label>
                          <select
                            className="w-full p-2 rounded-md border border-input bg-background text-sm"
                            value={avatarConfig.hatStyle}
                            onChange={(e) => handleConfigChange('hatStyle', e.target.value)}
                          >
                            {hatStyles.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>

                        <div className="space-y-2">
                          <Label>Glasses</Label>
                          <select
                            className="w-full p-2 rounded-md border border-input bg-background text-sm"
                            value={avatarConfig.glassesStyle}
                            onChange={(e) => handleConfigChange('glassesStyle', e.target.value)}
                          >
                            {glassesStyles.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>

                        <div className="space-y-2">
                          <Label>Shirt</Label>
                          <select
                            className="w-full p-2 rounded-md border border-input bg-background text-sm"
                            value={avatarConfig.shirtStyle}
                            onChange={(e) => handleConfigChange('shirtStyle', e.target.value)}
                          >
                            {shirtStyles.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Face Section */}
                <div className="border border-gray-200 rounded-lg mb-4 overflow-hidden">
                  <button
                    className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                    onClick={() => setActiveSection(activeSection === 'face' ? '' : 'face')}
                  >
                    <span className="font-semibold text-dark-navy">Face</span>
                    {activeSection === 'face' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>

                  {activeSection === 'face' && (
                    <div className="p-4 bg-white border-t border-gray-100">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Eyes</Label>
                          <select
                            className="w-full p-2 rounded-md border border-input bg-background text-sm"
                            value={avatarConfig.eyeStyle}
                            onChange={(e) => handleConfigChange('eyeStyle', e.target.value)}
                          >
                            {eyeStyles.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>

                        <div className="space-y-2">
                          <Label>Mouth</Label>
                          <select
                            className="w-full p-2 rounded-md border border-input bg-background text-sm"
                            value={avatarConfig.mouthStyle}
                            onChange={(e) => handleConfigChange('mouthStyle', e.target.value)}
                          >
                            {mouthStyles.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>

                        <div className="space-y-2">
                          <Label>Nose</Label>
                          <select
                            className="w-full p-2 rounded-md border border-input bg-background text-sm"
                            value={avatarConfig.noseStyle}
                            onChange={(e) => handleConfigChange('noseStyle', e.target.value)}
                          >
                            {noseStyles.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>

                        <div className="space-y-2">
                          <Label>Ears</Label>
                          <select
                            className="w-full p-2 rounded-md border border-input bg-background text-sm"
                            value={avatarConfig.earSize}
                            onChange={(e) => handleConfigChange('earSize', e.target.value)}
                          >
                            {earSizes.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Colors Section */}
                <div className="border border-gray-200 rounded-lg mb-4 overflow-hidden">
                  <button
                    className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                    onClick={() => setActiveSection(activeSection === 'colors' ? '' : 'colors')}
                  >
                    <span className="font-semibold text-dark-navy">Colors</span>
                    {activeSection === 'colors' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>

                  {activeSection === 'colors' && (
                    <div className="p-4 bg-white border-t border-gray-100">
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                          <Label>Skin Color</Label>
                          <Input
                            type="color"
                            className="w-full h-10 p-1 cursor-pointer"
                            value={avatarConfig.faceColor || "#F9C9B6"}
                            onChange={(e) => handleConfigChange('faceColor', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Hair Color</Label>
                          <Input
                            type="color"
                            className="w-full h-10 p-1 cursor-pointer"
                            value={avatarConfig.hairColor || "#000000"}
                            onChange={(e) => handleConfigChange('hairColor', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Hat Color</Label>
                          <Input
                            type="color"
                            className="w-full h-10 p-1 cursor-pointer"
                            value={avatarConfig.hatColor || "#000000"}
                            onChange={(e) => handleConfigChange('hatColor', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Shirt Color</Label>
                          <Input
                            type="color"
                            className="w-full h-10 p-1 cursor-pointer"
                            value={avatarConfig.shirtColor || "#ffffff"}
                            onChange={(e) => handleConfigChange('shirtColor', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Background Section */}
                <div className="border border-gray-200 rounded-lg mb-4 overflow-hidden">
                  <button
                    className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                    onClick={() => setActiveSection(activeSection === 'background' ? '' : 'background')}
                  >
                    <span className="font-semibold text-dark-navy">Background</span>
                    {activeSection === 'background' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>

                  {activeSection === 'background' && (
                    <div className="p-4 bg-white border-t border-gray-100">
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="space-y-1">
                            <Label>Custom</Label>
                            <Input
                              type="color"
                              className="w-16 h-10 p-1 cursor-pointer"
                              value={avatarConfig.bgColor || "#ffffff"}
                              onChange={(e) => handleConfigChange('bgColor', e.target.value)}
                            />
                          </div>
                          <div className="flex-1">
                            <Label className="mb-2 block">Quick Select</Label>
                            <div className="flex flex-wrap gap-2">
                              {defaultBgColors.map(c => (
                                <button
                                  key={c}
                                  className={`w-8 h-8 rounded-full border border-gray-200 focus:outline-none focus:ring-2 ring-offset-2 ring-blue-500 transition-transform hover:scale-110 ${avatarConfig.bgColor === c ? 'ring-2 ring-blue-500 scale-110' : ''}`}
                                  style={{ backgroundColor: c }}
                                  onClick={() => handleConfigChange('bgColor', c)}
                                  type="button"
                                  title={c}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Accessories Section */}
                <div className="border border-gray-200 rounded-lg mb-4 overflow-hidden">
                  <button
                    className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                    onClick={() => setActiveSection(activeSection === 'gear' ? '' : 'gear')}
                  >
                    <span className="font-semibold text-dark-navy">Underwater Gear 🌊</span>
                    {activeSection === 'gear' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>

                  {activeSection === 'gear' && (
                    <div className="p-4 bg-white border-t border-gray-100">
                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                        {underwaterItems.map((item) => {
                          const isSelected = avatarConfig.accessories?.some(a => a.itemId === item.id && a.id === selectedAccessoryId);

                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => handleAddAccessory(item.id)}
                              className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all ${isSelected
                                ? 'bg-light-teal/30 border-medium-teal ring-2 ring-medium-teal/20'
                                : 'border-transparent hover:bg-gray-50'
                                }`}
                              title={item.id === 'none' ? "Clear All" : "Add Item"}
                            >
                              <span className="text-2xl mb-1">{item.icon}</span>
                              <span className="text-xs text-center text-gray-600 line-clamp-1">{item.label}</span>
                            </button>
                          )
                        })}
                      </div>

                      {/* Always visible Item Controls */}
                      <div className={`mt-4 border-t pt-4 border-gray-100 transition-opacity duration-200 ${selectedAccessoryId ? 'opacity-100' : 'opacity-50 grayscale'}`}>
                        <div className="flex items-center justify-between mb-2">
                          <Label className="text-sm font-medium">Selected Item Controls</Label>
                          {!selectedAccessoryId && <span className="text-xs text-gray-400">Select an item to edit</span>}
                        </div>

                        <div className="space-y-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
                          {/* Size Control */}
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs text-gray-500">
                              <span>Size</span>
                              <span>{selectedAccessoryId ? (avatarConfig.accessories?.find(a => a.id === selectedAccessoryId)?.size || 40) : '--'}px</span>
                            </div>
                            <input
                              type="range"
                              min="20"
                              max="120"
                              disabled={!selectedAccessoryId}
                              value={selectedAccessoryId ? (avatarConfig.accessories?.find(a => a.id === selectedAccessoryId)?.size || 40) : 40}
                              onChange={(e) => handleUpdateSize(parseInt(e.target.value))}
                              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-medium-teal disabled:cursor-not-allowed"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 flex flex-col items-end gap-4">
        {message && (
          <div className={`text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
            {message.text}
          </div>
        )}
        <Button
          onClick={handleSave}
          disabled={loading}
          size="lg"
          className="bg-medium-teal hover:bg-light-teal text-white w-full md:w-auto"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving Changes...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Settings
            </>
          )}
        </Button>
      </div>
    </div >
  )
}
