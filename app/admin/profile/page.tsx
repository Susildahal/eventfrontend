'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff, Loader2, User, Upload } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import axiosInstance from '@/app/config/axiosInstance'
import Header from '../../../dashbord/common/Header'
import { useRouter } from 'next/navigation'
import { AppDispatch, RootState } from '@/app/redux/store'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProfile, updateProfile, updatePassword } from '@/app/redux/slices/profileSlicer'


export default function ProfilePage() {
  const dispatch = useDispatch<AppDispatch>()
  const { data: user, loading: reduxLoading } = useSelector((state: RootState) => state.profile)
  
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null)
  const [activeTab, setActiveTab] = useState('details')

  
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    role: '',
    status: true,
    profilePicture: '',
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const router = useRouter()

  // Fetch profile on component mount
  useEffect(() => {
    if (!user) {
      dispatch(fetchProfile())
    }
  }, [dispatch, user])

  // Update local state when user data changes
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: user?.address || '',
        role: user?.role || 'user',
        status: user?.status ?? true,
        profilePicture: user?.profilePicture || '',
      })

      // Handle profile picture display
      if (user?.profilePicture) {
        if (user.profilePicture.startsWith('data:')) {
          setProfileImage(user.profilePicture)
        } else if (user.profilePicture.startsWith('http')) {
          setProfileImage(user.profilePicture)
        } else {
          setProfileImage(`data:image/jpeg;base64,${user.profilePicture}`)
        }
      }
    }
  }, [user])

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfileData(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, name: 'Please select a valid image file' }))
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, name: 'Image size should be less than 5MB' }))
      return
    }

    try {
      // Store the file for upload
      setProfileImageFile(file)
      
      // Create preview URL
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setProfileImage(event.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    } catch (err) {
      console.error('Error processing image:', err)
      setErrors(prev => ({ ...prev, name: 'Failed to process image' }))
    }
  }

  const validateProfileForm = () => {
    let isValid = true
    const newErrors = { ...errors }

    if (!profileData.name.trim()) {
      newErrors.name = 'Name is required'
      isValid = false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!profileData.email) {
      newErrors.email = 'Email is required'
      isValid = false
    } else if (!emailRegex.test(profileData.email)) {
      newErrors.email = 'Please enter a valid email address'
      isValid = false
    }

    if (!profileData.phone.trim()) {
      newErrors.phone = 'Phone is required'
      isValid = false
    }

    if (!profileData.address.trim()) {
      newErrors.address = 'Address is required'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const validatePasswordForm = () => {
    let isValid = true
    const newErrors = { ...errors }

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Current password is required'
      isValid = false
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required'
      isValid = false
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'New password must be at least 6 characters'
      isValid = false
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateProfileForm()) return

    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('name', profileData.name)
      formData.append('email', profileData.email)
      formData.append('phone', profileData.phone)
      formData.append('address', profileData.address)

      // Include profile picture if it was uploaded
      if (profileImageFile) {
        formData.append('profilePicture', profileImageFile, profileImageFile.name)
      }

      // Dispatch Redux action
      const resultAction = await dispatch(updateProfile({ 
        userId: user?._id || '', 
        formData 
      }))

      if (updateProfile.fulfilled.match(resultAction)) {
        const updatedUser = resultAction.payload
        
        // Update profile image from server response
        if (updatedUser?.profilePicture) {
          if (updatedUser.profilePicture.startsWith('data:')) {
            setProfileImage(updatedUser.profilePicture)
          } else if (updatedUser.profilePicture.startsWith('http')) {
            setProfileImage(updatedUser.profilePicture)
          } else {
            setProfileImage(`data:image/jpeg;base64,${updatedUser.profilePicture}`)
          }
        }
        
        setProfileImageFile(null)
      } else {
        const errorMessage = resultAction.payload as string || 'Failed to update profile'
        setErrors(prev => ({ ...prev, name: errorMessage }))
      }
    } catch (error: any) {
      console.error('Profile update error:', error)
      const errorMessage = error.response?.data?.message || 'Failed to update profile'
      setErrors(prev => ({ ...prev, name: errorMessage }))
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validatePasswordForm()) return

    setLoading(true)

    try {
      const payload = {
        oldPassword: passwordData.currentPassword,
        password: passwordData.newPassword,
      }

      // Dispatch Redux action for password update
      const resultAction = await dispatch(updatePassword({
        userId: user?._id || '',
        passwordData: payload
      }))

      if (updatePassword.fulfilled.match(resultAction)) {
        // Clear password fields on success
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        })
        setErrors({
          name: '',
          email: '',
          phone: '',
          address: '',
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        })
      } else {
        const errorMessage = resultAction.payload as string || 'Failed to update password'
        setErrors(prev => ({ ...prev, currentPassword: errorMessage }))
      }
    } catch (error: any) {
      console.error('Password update error:', error)
      const errorMessage = error.response?.data?.message || 'Failed to update password'
      setErrors(prev => ({ ...prev, currentPassword: errorMessage }))
    } finally {
      setLoading(false)
    }
  }

  if (!user || reduxLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <>
      <Header title="Profile Settings" titledesc="Manage your profile" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="container max-w-2xl mx-auto "
      >
        <div className="w-full border-[rgb(190,149,69)] p-6 border-[1px] hover:border-[rgb(190,149,69)] rounded-lg shadow-sm ">
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 overflow-hidden">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="User avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="h-12 w-12 text-primary" />
                )}
              </div>
              <label
                htmlFor="profile-upload"
                className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer hover:bg-primary/90 transition-colors"
              >
                <Upload className="h-4 w-4" />
                <input
                  id="profile-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
            <div className="text-center mt-4">
              <CardTitle className="text-2xl font-bold capitalize">
                {profileData.name}
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                {profileData.email}
              </CardDescription>
            </div>
          </div>

          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="password">Change Password</TabsTrigger>
              </TabsList>

              {/* Details Tab */}
              <TabsContent value="details" className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={profileData.name}
                      onChange={handleProfileChange}
                      required
                      className={`transition-all duration-200 focus:ring-2 focus:ring-primary ${
                        errors.name ? 'border-red-500' : ''
                      }`}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500">{errors.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      required
                      className={`transition-all duration-200 focus:ring-2 focus:ring-primary ${
                        errors.email ? 'border-red-500' : ''
                      }`}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500">{errors.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={profileData.phone}
                      onChange={handleProfileChange}
                      required
                      className={`transition-all duration-200 focus:ring-2 focus:ring-primary ${
                        errors.phone ? 'border-red-500' : ''
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-sm text-red-500">{errors.phone}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      name="address"
                      type="text"
                      value={profileData.address}
                      onChange={handleProfileChange}
                      required
                      className={`transition-all duration-200 focus:ring-2 focus:ring-primary ${
                        errors.address ? 'border-red-500' : ''
                      }`}
                    />
                    {errors.address && (
                      <p className="text-sm text-red-500">{errors.address}</p>
                    )}
                  </div>

                  <div className="pt-4 flex gap-4">
                    <Button
                      onClick={handleProfileSubmit}
                      className="w-[50%] "
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        'Update Details'
                      )}
                    </Button>
                    <Button
                      onClick={() => router.back()}
                      type="button"
                      variant="outline"
                      className="w-[50%]"
                    >
                      Back
                    </Button>
                  </div>
                </div>
              </TabsContent>

              {/* Password Tab */}
              <TabsContent value="password" className="space-y-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <Label className="text-lg font-semibold">Change Password</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowPassword(!showPassword)}
                      className="flex items-center gap-2"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                      {showPassword ? 'Hide Passwords' : 'Show Passwords'}
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      name="currentPassword"
                      type={showPassword ? 'text' : 'password'}
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      placeholder='**********'
                      required
                      className={`transition-all duration-200 focus:ring-2 focus:ring-primary ${
                        errors.currentPassword ? 'border-red-500' : ''
                      }`}
                    />
                    {errors.currentPassword && (
                      <p className="text-sm text-red-500">
                        {errors.currentPassword}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type={showPassword ? 'text' : 'password'}
                      placeholder='**********'
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      minLength={6}
                      required
                      className={`transition-all duration-200 focus:ring-2 focus:ring-primary ${
                        errors.newPassword ? 'border-red-500' : ''
                      }`}
                    />
                    {errors.newPassword && (
                      <p className="text-sm text-red-500">{errors.newPassword}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder='**********'
                      minLength={6}
                      required
                      className={`transition-all duration-200 focus:ring-2 focus:ring-primary ${
                        errors.confirmPassword ? 'border-red-500' : ''
                      }`}
                    />
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-500">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>

                  <div className="pt-4 flex gap-4">
                    <Button
                      onClick={handlePasswordSubmit}
                      className="w-[50%]  bg-[#7a5E39] hover:bg-[#6b4a2f] active:bg-[#5b3b24] transition-colors"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        'Update Password'
                      )}
                    </Button>
                    <Button
                      onClick={() => router.back()}
                      type="button"
                      variant="outline"
                      className="w-[50%]"
                    >
                      Back
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </div>
      </motion.div>
    </>
  )
}