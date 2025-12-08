
'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle2, Trash2, Plus, Edit2, Facebook, Twitter, Instagram, Linkedin, Youtube, Github, Globe, Link, Mail } from 'lucide-react';
import axiosInstance from '../../config/axiosInstance'
import Header from '@/dashbord/common/Header';

export default function SiteSettings() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);

  const defaultForm = {
    siteName: '',
    siteDescription: '',
    phone: '',
    email: '',
    address: '',
    socialMedia: [{ name: '', url: '', icon: '' }],
  };

  const [formData, setFormData] = useState(defaultForm);

  // Fetch existing settings from backend on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setFetchingData(true)
        const res = await axiosInstance.get('/settings')
        const data = res.data?.data ?? res.data ?? null
        if (data) {
          const socialArray = data.socialMedia
            ? Object.entries(data.socialMedia).map(([name, value]) => {
                // value might be a string (legacy) or an object { url, icon }
                if (typeof value === 'string') {
                  return { name: value, url: value, icon: '' }
                }
                const objValue = value as { name?: string; url?: string; icon?: string };
                return { name: objValue?.name ?? name, url: objValue?.url ?? '', icon: objValue?.icon ?? '' }
              })
            : [{ name: '', url: '', icon: '' }]

          setFormData({
            siteName: data.siteName || '',
            siteDescription: data.siteDescription || '',
            phone: data.phone || '',
            email: data.email || '',
            address: data.address || '',
            socialMedia: socialArray.length ? socialArray : [{ name: '', url: '', icon: '' }],
          })
          setIsEditing(true)
        }
      } catch (err) {
        console.error('Error fetching settings from backend:', err)
      } finally {
        setFetchingData(false)
      }
    }

    fetchSettings()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setSuccess(false);
  };

  const handleSocialMediaChange = (index: number, field: 'name' | 'url', value: string) => {
    const newSocialMedia = [...formData.socialMedia];
    newSocialMedia[index][field] = value;
    setFormData(prev => ({
      ...prev,
      socialMedia: newSocialMedia
    }));
    setSuccess(false);
  };

  const handleSocialMediaIconChange = (index: number, icon: string) => {
    const newSocialMedia = [...formData.socialMedia];
    newSocialMedia[index].icon = icon;
    setFormData(prev => ({
      ...prev,
      socialMedia: newSocialMedia
    }));
    setSuccess(false);
  };

  const getIconComponent = (name?: string) => {
    if (!name) return Link
    switch ((name || '').toLowerCase()) {
      case 'facebook':
        return Facebook
      case 'twitter':
        return Twitter
      case 'instagram':
        return Instagram
      case 'linkedin':
      case 'linkdin':
      case 'linkedIn':
        return Linkedin
      case 'youtube':
        return Youtube
      case 'github':
        return Github
      case 'globe':
        return Globe
      case 'mail':
      case 'email':
        return Mail
      case 'link':
      default:
        return Link
    }
  }

  const addSocialMedia = () => {
    setFormData(prev => ({
      ...prev,
      socialMedia: [...prev.socialMedia, { name: '', url: '', icon: '' }]
    }));
  };

  const removeSocialMedia = (index: number) => {
    setFormData(prev => ({
      ...prev,
      socialMedia: prev.socialMedia.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Convert social media array to key-value pairs (object)
      // Build socialMedia object mapping name -> { url, icon }
      const socialMediaObj: Record<string, { name: string; url: string; icon?: string }> = {};
      formData.socialMedia.forEach(item => {
        if (item.name && item.url) {
          socialMediaObj[item.name] = { name: item.name, url: item.url, icon: item.icon || undefined };
        }
      });

      // Save to backend via axios
      const settingsObj = {
        siteName: formData.siteName,
        siteDescription: formData.siteDescription,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        socialMedia: socialMediaObj,
        updatedAt: new Date().toISOString(),
      }

      // Use POST for create or PUT for update if your backend supports it.
      if (isEditing) {
        await axiosInstance.put('/settings', settingsObj)
      } else {
        await axiosInstance.post('/settings', settingsObj)
      }

      setSuccess(true)
      setIsEditing(true)
      setTimeout(() => setSuccess(false), 5000)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save settings. Make sure Firebase is configured.';
      setError(errorMessage);
      console.error('Error saving settings:', err);
    } finally {
      setLoading(false);
    }
  };



  return (
    <>
    <Header title="Site Settings" titledesc={isEditing ? 'Edit your website information and social media links' : 'Create your website information and social media links'} />
      <div className="bg-white dark:bg-gray-900 text-gray-900  dark:text-white">
      <div className=" mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Site Settings</CardTitle>
                <CardDescription>
                  {isEditing ? 'Edit your website information and social media links' : 'Create your website information and social media links'}
                </CardDescription>
              </div>
         
            </div>
          </CardHeader>
          <CardContent>
            {fetchingData ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <p className="mt-4 text-gray-600">Loading settings...</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Success Message */}
                {success && (
                  <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <span className="text-green-800">Settings saved successfully!</span>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <span className="text-red-800">{error}</span>
                  </div>
                )}

                {/* Basic Information - 2 columns on laptop */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Basic Information</h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="siteName">Site Name *</Label>
                      <Input
                        id="siteName"
                        name="siteName"
                        type="text"
                        value={formData.siteName}
                        onChange={handleChange}
                        placeholder="Enter your site name"
                        required
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="siteDescription">Site Description</Label>
                      <Input
                        id="siteDescription"
                        name="siteDescription"
                        type="text"
                        value={formData.siteDescription}
                        onChange={handleChange}
                        placeholder="Brief description of your site"
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="contact@example.com"
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+1 (555) 000-0000"
                        className="mt-2"
                      />
                    </div>

                    <div className="lg:col-span-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        name="address"
                        type="text"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Your business address"
                        className="mt-2"
                      />
                    </div>
                  </div>
                </div>

                {/* Social Media Links - Key Value */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Social Media</h3>
                    <Button
                      type="button"
                      onClick={addSocialMedia}
                      variant="outline"
                      size="sm"
                      className="gap-1"
                    >
                      <Plus className="w-4 h-4" />
                      Add Social Media
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {formData.socialMedia.map((social, index) => (
                      <div key={index} className="grid grid-cols-1 lg:grid-cols-2 gap-3 items-end">
                        <div>
                          <Label htmlFor={`social-name-${index}`}>Platform Name</Label>
                          <Input
                            id={`social-name-${index}`}
                            type="text"
                            value={social.name}
                            onChange={(e) => handleSocialMediaChange(index, 'name', e.target.value)}
                            placeholder="e.g., Facebook, Twitter, Instagram"
                            className="mt-2"
                          />
                        </div>

                        <div>
                          <Label htmlFor={`social-url-${index}`}>URL & Icon</Label>
                          <div className="flex gap-3 mt-2 items-center">
                            {/* Icon preview */}
                            <div className="flex-shrink-0">
                              <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                {(() => {
                                  const Icon = getIconComponent(social.icon)
                                  return <Icon className="w-5 h-5 text-gray-600 dark:text-gray-200" />
                                })()}
                              </div>
                            </div>

                            {/* URL input */}
                            <Input
                              id={`social-url-${index}`}
                              type="url"
                              value={social.url}
                              onChange={(e) => handleSocialMediaChange(index, 'url', e.target.value)}
                              placeholder="https://example.com/profile"
                              className="flex-1"
                            />

                            {/* Icon select (compact) */}
                            <div className="flex flex-col">
                              <Label className="sr-only" htmlFor={`social-icon-${index}`}>Icon</Label>
                              <select
                                id={`social-icon-${index}`}
                                value={social.icon ?? ''}
                                onChange={(e) => handleSocialMediaIconChange(index, e.target.value)}
                                className="rounded-md border border-gray-200 bg-white text-gray-900 px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                title="Choose an icon"
                              >
                                <option value="">Icon</option>
                                <option value="Facebook">Facebook</option>
                                <option value="Twitter">Twitter</option>
                                <option value="Instagram">Instagram</option>
                                <option value="Linkedin">Linkedin</option>
                                <option value="Youtube">Youtube</option>
                                <option value="Github">Github</option>
                                <option value="Globe">Globe</option>
                                <option value="Link">Link</option>
                                <option value="Mail">Mail</option>
                              </select>
                              
                            </div>

                            {/* Remove button */}
                            {formData.socialMedia.length > 1 && (
                              <Button
                                type="button"
                                onClick={() => removeSocialMedia(index)}
                                variant="destructive"
                                size="icon"
                                className="ml-1"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit"
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? 'Saving...' : (isEditing ? 'Update Settings' : 'Save Settings')}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
    </>
  );
}
