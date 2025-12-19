
'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, CheckCircle2, Trash2, Plus, Save, Facebook, Twitter, Instagram, Linkedin, Youtube, Github, Globe, Link, Mail } from 'lucide-react';
import { IoLogoTiktok } from "react-icons/io5";
import Header from '@/dashbord/common/Header';
import { Spinner } from '@/components/ui/spinner';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/app/redux/store';
import { fetchSiteSettings, updateSiteSettings, createSiteSettings } from '@/app/redux/slices/siteSettingsSlice';

export default function SiteSettings() {
  const dispatch = useDispatch<AppDispatch>();
  const { data: siteData, loading: reduxLoading } = useSelector((state: RootState) => state.siteSettings);
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  interface SocialMedia {
    name: string;
    url: string;
    icon?: string;
  }

  interface SiteSettingsForm {
    siteName: string;
    siteDescription: string;  
    phone: string;
    email: string;
    address: string;
    bookingEmail: string;
    socialMedia: SocialMedia[];
  }

  const defaultForm: SiteSettingsForm = {
    siteName: '',
    siteDescription: '',
    phone: '',
    email: '',
    address: '',
    bookingEmail: '',
    socialMedia: [{ name: '', url: '', icon: '' }],
  };

  const [formData, setFormData] = useState<SiteSettingsForm>(defaultForm);

  // Fetch existing settings from Redux on mount
  useEffect(() => {
    dispatch(fetchSiteSettings());
  }, [dispatch]);

  // Update form data when Redux state changes
  useEffect(() => {
    if (siteData) {
      const socialArray = siteData.socialMedia
        ? Object.entries(siteData.socialMedia).map(([name, value]) => {
            return { 
              name: value?.name ?? name, 
              url: value?.url ?? '', 
              icon: value?.icon ?? '' 
            }
          })
        : [{ name: '', url: '', icon: '' }]

      setFormData({
        siteName: siteData.siteName || '',
        siteDescription: siteData.siteDescription || '',
        phone: siteData.phone || '',
        email: siteData.email || '',
        address: siteData.address || '',
        bookingEmail: siteData.bookingEmail || '',
        socialMedia: socialArray.length ? socialArray : [{ name: '', url: '', icon: '' }],
      })
      setIsEditing(true)
    }
  }, [siteData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      case 'facebook': return Facebook
      case 'twitter': return Twitter
      case 'instagram': return Instagram
      case 'linkedin':
      case 'linkdin':
      case 'linkedin': return Linkedin
      case 'youtube': return Youtube
      case 'github': return Github
      case 'globe': return Globe
      case 'mail':
      case 'email': return Mail
      case 'link': return Link
      case 'tiktok': return IoLogoTiktok
      default: return Link
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
      const socialMediaObj: Record<string, { name: string; url: string; icon?: string }> = {};
      formData.socialMedia.forEach(item => {
        if (item.name && item.url) {
          socialMediaObj[item.name] = { name: item.name, url: item.url, icon: item.icon || undefined };
        }
      });

      const settingsObj = {
        siteName: formData.siteName,
        siteDescription: formData.siteDescription,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        socialMedia: socialMediaObj,
        updatedAt: new Date().toISOString(),
        bookingEmail: formData.bookingEmail,
      }

      if (isEditing) {
        await dispatch(updateSiteSettings(settingsObj)).unwrap();
      } else {
        await dispatch(createSiteSettings(settingsObj)).unwrap();
      }

      setSuccess(true)
      setIsEditing(true)
      setTimeout(() => setSuccess(false), 5000)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save settings.';
      setError(errorMessage);
      console.error('Error saving settings:', err);
    } finally {
      setLoading(false);
    }
  };

  if (reduxLoading && !siteData) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-10">
      <Header 
        title="Site Settings" 
        titledesc="Manage your website's general information and social media presence." 
      />

      <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto">
        {/* Status Messages */}
        {success && (
          <div className="flex items-center gap-2 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 rounded-lg animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
            <span className="text-green-800 dark:text-green-300 font-medium">Settings saved successfully!</span>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 rounded-lg animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <span className="text-red-800 dark:text-red-300 font-medium">{error}</span>
          </div>
        )}

        {/* General Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>General Information</CardTitle>
            <CardDescription>
              Basic details about your website and business contact information.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="siteName">Site Name <span className="text-red-500">*</span></Label>
                <Input
                  id="siteName"
                  name="siteName"
                  value={formData.siteName}
                  onChange={handleChange}
                  placeholder="e.g. My Awesome Events"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="email">Contact Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="contact@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bookingEmail">Booking Notification Email</Label>
                <Input
                  id="bookingEmail"
                  name="bookingEmail"
                  type="email"
                  value={formData.bookingEmail}
                  onChange={handleChange}
                  placeholder="bookings@example.com"
                />
                <p className="text-xs text-muted-foreground">
                  Notifications for new bookings will be sent here.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="siteDescription">Site Description</Label>
              <Textarea
                id="siteDescription"
                name="siteDescription"
                value={formData.siteDescription}
                onChange={handleChange}
                placeholder="A brief description of your business..."
                className="resize-none min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Physical Address</Label>
              <Textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="123 Event Street, City, Country"
                className="resize-none min-h-[80px]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Social Media Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div className="space-y-1">
              <CardTitle>Social Media</CardTitle>
              <CardDescription>
                Connect your social media profiles.
              </CardDescription>
            </div>
            <Button
              type="button"
              onClick={addSocialMedia}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Platform
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {formData.socialMedia.length === 0 && (
              <div className="text-center py-8 text-muted-foreground text-sm border-2 border-dashed rounded-lg">
                No social media profiles added yet.
              </div>
            )}
            
            {formData.socialMedia.map((social, index) => (
              <div key={index} className="group relative grid grid-cols-1 md:grid-cols-12 gap-4 items-start p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
                {/* Platform Name */}
                <div className="md:col-span-3 space-y-2">
                  <Label htmlFor={`social-name-${index}`} className="text-xs text-muted-foreground">Platform</Label>
                  <Input
                    id={`social-name-${index}`}
                    value={social.name}
                    onChange={(e) => handleSocialMediaChange(index, 'name', e.target.value)}
                    placeholder="e.g. Facebook"
                  />
                </div>

                {/* Icon Selector */}
                <div className="md:col-span-3 space-y-2">
                  <Label className="text-xs text-muted-foreground">Icon</Label>
                  <div className="flex gap-2">
                    <div className="flex-shrink-0 w-10 h-10 rounded-md border bg-background flex items-center justify-center">
                      {(() => {
                        const Icon = getIconComponent(social.icon)
                        return <Icon className="w-5 h-5 text-muted-foreground" />
                      })()}
                    </div>
                    <Select
                      value={social.icon || ''}
                      onValueChange={(value) => handleSocialMediaIconChange(index, value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Icon" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Facebook">Facebook</SelectItem>
                        <SelectItem value="Twitter">Twitter</SelectItem>
                        <SelectItem value="Instagram">Instagram</SelectItem>
                        <SelectItem value="Linkedin">Linkedin</SelectItem>
                        <SelectItem value="Youtube">Youtube</SelectItem>
                        <SelectItem value="Github">Github</SelectItem>
                        <SelectItem value="TikTok">TikTok</SelectItem>
                        <SelectItem value="Globe">Globe</SelectItem>
                        <SelectItem value="Mail">Mail</SelectItem>
                        <SelectItem value="Link">Link</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* URL */}
                <div className="md:col-span-5 space-y-2">
                  <Label htmlFor={`social-url-${index}`} className="text-xs text-muted-foreground">Profile URL</Label>
                  <Input
                    id={`social-url-${index}`}
                    value={social.url}
                    onChange={(e) => handleSocialMediaChange(index, 'url', e.target.value)}
                    placeholder="https://..."
                  />
                </div>

                {/* Delete Button */}
                <div className="md:col-span-1 flex justify-end pt-8 md:pt-8">
                  <Button
                    type="button"
                    onClick={() => removeSocialMedia(index)}
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive"
                    disabled={formData.socialMedia.length <= 1 && !social.name && !social.url}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Submit Action */}
        <div className="flex justify-end pt-4">
          <Button 
            type="submit" 
            disabled={loading}
            size="lg"
            className="min-w-[150px]"
          >
            {loading ? (
              <>
                <Spinner className="mr-2 h-4 w-4" /> Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" /> Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
