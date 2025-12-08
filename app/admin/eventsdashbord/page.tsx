"use client";
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, Save, Upload } from 'lucide-react';
import axiosInstance from '@/app/config/axiosInstance';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

interface HeroContent {
  title: string;
  description: string;
}
interface Hero {
  title: string;
  subtitle: string;
  description: string;
  contents: HeroContent[];
  image: File | string | null; // Can be File for new upload or string URL for existing
  
}

interface ServiceItem {
  id: number;
  icon: string;
  title: string;
  description: string;
}

interface ConceptItem {
  id: number;
  icon: string;
  title: string;
  image: File | string | null; // Can be File for new upload or string URL for existing
}

interface TimelineItem {
  id: number;
  step: string;
  title: string;
  description: string;
}

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

interface Sections {
  hero: Hero;
  services: ServiceItem[];
  concepts: ConceptItem[];
  timeline: TimelineItem[];
  faqs: FAQItem[];
}

export default function BirthdayAdminDashboard() {
 const searchParams = useSearchParams();
  const id = searchParams?.get('id')
  console.log('query id:', id)

  const [data ,setData]=useState<any>(null);
  const [eventdata ,seteventData]=useState(null);
  const [isebit , setIsebit] = useState(false);
  const [editid , seteditid] = useState<any>(null);
  console.log("editid:", editid)
  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(`/eventtypes/${id}`);
      setData(response.data.data);
      
    } catch (error) {
      console.error('Error fetching birthday data:', error);
    }
  };
 
  const [sections, setSections] = useState<Sections>({
    hero: {
      title: '',
      subtitle: '',
      description: '',
      contents: [
        { title: '', description: '' },
     
      ],
      image: null
    },
    services: [
      { id: 1, icon: '📍', title: '', description: '' },

    ],
    concepts: [
      { id: 1, icon: '⚜️', title: '', image: null },
    ],
    timeline: [
      { id: 1, step: '1', title: '', description: '' },
  
    ],
    faqs: [
      { id: 1, question: '', answer: '' },

    ]
  });

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('hero');
  const [imageError, setImageError] = useState<string | null>(null);
  const [imageSuccess, setImageSuccess] = useState<string | null>(null);
 

  // Helper to compress image to under 500KB
  const compressImage = (file: File, maxSizeKB = 500): Promise<File> => {
    return new Promise((resolve, reject) => {
      // If file is already under limit, return as is
      if (file.size <= maxSizeKB * 1024) {
        resolve(file);
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Calculate new dimensions to reduce size
          const maxDimension = 1200; // Maximum width or height
          let scaleFactor = 1;
          
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              scaleFactor = maxDimension / width;
            } else {
              scaleFactor = maxDimension / height;
            }
          }
          
          const newWidth = Math.floor(width * scaleFactor);
          const newHeight = Math.floor(height * scaleFactor);
          
          canvas.width = newWidth;
          canvas.height = newHeight;
          
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Could not get canvas context'));
            return;
          }
          
          // Draw image with new dimensions
          ctx.drawImage(img, 0, 0, newWidth, newHeight);
          
          // Compress with quality adjustment
          const compressWithQuality = (quality: number): void => {
            canvas.toBlob(
              (blob) => {
                if (!blob) {
                  reject(new Error('Could not create blob'));
                  return;
                }
                
                const sizeKB = blob.size / 1024;
                
                if (sizeKB <= maxSizeKB || quality <= 0.5) {
                  // Create new compressed file
                  const compressedFile = new File(
                    [blob],
                    file.name.replace(/\.[^/.]+$/, "") + '_compressed.jpg', // Change extension to .jpg for better compression
                    { type: 'image/jpeg', lastModified: Date.now() }
                  );
                  resolve(compressedFile);
                } else {
                  // Reduce quality and try again
                  compressWithQuality(quality - 0.1);
                }
              },
              'image/jpeg',
              quality
            );
          };
          
          // Start with 0.8 quality (80%)
          compressWithQuality(0.8);
        };
        
        img.onerror = () => reject(new Error('Failed to load image'));
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
    });
  };

  // Validate and compress image
  const validateAndCompressImage = async (file: File): Promise<File> => {
    // Check file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      throw new Error('Please upload JPEG, PNG, GIF, or WebP images only.');
    }
    
    // Check initial size (limit to 10MB upload)
    const maxInitialSizeMB = 10;
    if (file.size > maxInitialSizeMB * 1024 * 1024) {
      throw new Error(`Image too large! Maximum upload size is ${maxInitialSizeMB}MB.`);
    }
    
    // Compress image to under 500KB
    return await compressImage(file, 500);
  };

  // Handle hero image upload with compression
  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setImageError(null);
    setImageSuccess(null);
    
    try {
      const compressedFile = await validateAndCompressImage(file);
      
      setSections(prev => ({
        ...prev,
        hero: {
          ...prev.hero,
          image: compressedFile
        }
      }));
      
      // Show success message with size info
      const originalSizeKB = Math.round(file.size / 1024);
      const compressedSizeKB = Math.round(compressedFile.size / 1024);
      setImageSuccess(`✓ Image compressed from ${originalSizeKB}KB to ${compressedSizeKB}KB`);
      
      // Clear success message after 4 seconds
      setTimeout(() => setImageSuccess(null), 4000);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to process image';
      setImageError(`❌ ${errorMessage}`);
      
      // Clear input
      e.target.value = '';
    }
  };

  // Handle concept image upload with compression
  const handleConceptImageUpload = async (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setImageError(null);
    setImageSuccess(null);
    
    try {
      const compressedFile = await validateAndCompressImage(file);
      
      setSections(prev => ({
        ...prev,
        concepts: prev.concepts.map(item =>
          item.id === id ? { ...item, image: compressedFile } : item
        )
      }));
      
      // Show success message with size info
      const originalSizeKB = Math.round(file.size / 1024);
      const compressedSizeKB = Math.round(compressedFile.size / 1024);
      setImageSuccess(`✓ Image compressed from ${originalSizeKB}KB to ${compressedSizeKB}KB`);
      
      // Clear success message after 4 seconds
      setTimeout(() => setImageSuccess(null), 4000);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to process image';
      setImageError(`❌ ${errorMessage}`);
      
      // Clear input
      e.target.value = '';
    }
  };

  // Validate all images before submit
  const validateAllImages = (): boolean => {
    const errors: string[] = [];
    
    // Check hero image (only if it's a File object, not a URL string)
    if (sections.hero.image && typeof sections.hero.image !== 'string') {
      const sizeKB = Math.round(sections.hero.image.size / 1024);
      if (sizeKB > 500) {
        errors.push(`Hero image is ${sizeKB}KB (must be under 500KB)`);
      }
    }
    
    // Check concept images (only if they're File objects, not URL strings)
    sections.concepts.forEach((concept, index) => {
      if (concept.image && typeof concept.image !== 'string') {
        const sizeKB = Math.round(concept.image.size / 1024);
        if (sizeKB > 500) {
          errors.push(`Concept "${concept.title}" image is ${sizeKB}KB (must be under 500KB)`);
        }
      }
    });
    
    if (errors.length > 0) {
      setImageError(errors.join('\n'));
      return false;
    }
    
    return true;
  };

  // Other handler functions remain the same...
  const handleHeroContentChange = (index: number, field: keyof HeroContent, value: string) => {
    setSections(prev => ({
      ...prev,
      hero: {
        ...prev.hero,
        contents: prev.hero.contents.map((item, i) =>
          i === index ? { ...item, [field]: value } : item
        )
      }
    }));
  };

  const addHeroContent = () => {
    setSections(prev => ({
      ...prev,
      hero: {
        ...prev.hero,
        contents: [...prev.hero.contents, { title: '', description: '' }]
      }
    }));
  };

  const deleteHeroContent = (index: number) => {
    setSections(prev => ({
      ...prev,
      hero: {
        ...prev.hero,
        contents: prev.hero.contents.filter((_, i) => i !== index)
      }
    }));
  };

  const handleServicesChange = (id: number, field: keyof ServiceItem, value: string) => {
    setSections(prev => ({
      ...prev,
      services: prev.services.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  const addService = () => {
    setSections(prev => ({
      ...prev,
      services: [...prev.services, { id: Date.now(), icon: '✨', title: '', description: '' }]
    }));
  };

  const deleteService = (id: number) => {
    setSections(prev => ({
      ...prev,
      services: prev.services.filter(item => item.id !== id)
    }));
  };

  const handleConceptsChange = (id: number, field: keyof ConceptItem, value: string) => {
    setSections(prev => ({
      ...prev,
      concepts: prev.concepts.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  const addConcept = () => {
    setSections(prev => ({
      ...prev,
      concepts: [...prev.concepts, { id: Date.now(), icon: '✨', title: '', image: null }]
    }));
  };

  const deleteConcept = (id: number) => {
    setSections(prev => ({
      ...prev,
      concepts: prev.concepts.filter(item => item.id !== id)
    }));
  };

  const handleTimelineChange = (id: number, field: keyof TimelineItem, value: string) => {
    setSections(prev => ({
      ...prev,
      timeline: prev.timeline.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  const addTimeline = () => {
    setSections(prev => ({
      ...prev,
      timeline: [...prev.timeline, { id: Date.now(), step: '', title: '', description: '' }]
    }));
  };

  const deleteTimeline = (id: number) => {
    setSections(prev => ({
      ...prev,
      timeline: prev.timeline.filter(item => item.id !== id)
    }));
  };

  const handleFaqChange = (id: number, field: keyof FAQItem, value: string) => {
    setSections(prev => ({
      ...prev,
      faqs: prev.faqs.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  const addFaq = () => {
    setSections(prev => ({
      ...prev,
      faqs: [...prev.faqs, { id: Date.now(), question: '', answer: '' }]
    }));
  };

  const deleteFaq = (id: number) => {
    setSections(prev => ({
      ...prev,
      faqs: prev.faqs.filter(item => item.id !== id)
    }));
  };

  // Helper function to convert File to base64
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result as string;
        resolve(base64String);
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = async () => {
    // Validate images before submit
    if (!validateAllImages()) {
      return;
    }
    
    setLoading(true);
    setImageError(null);
    
    try {
      // Create FormData for binary file upload
      const formData = new FormData();
      
      // Add hero data
      formData.append('hero[title]', sections.hero.title);
      formData.append('hero[subtitle]', sections.hero.subtitle);
      formData.append('hero[description]', sections.hero.description);
      formData.append('hero[contents]', JSON.stringify(sections.hero.contents));
      if (sections.hero.image) {
        formData.append('hero[image]', sections.hero.image);
      }
      
      // Add events id
      formData.append('eventsid[id]', id || '');
      formData.append('eventsid[name]', data?.name || '');
      
      // Add services
      formData.append('services', JSON.stringify(sections.services));
      
      // Add concepts with images
      sections.concepts.forEach((concept, index) => {
        formData.append(`concepts[${index}][id]`, concept.id.toString());
        formData.append(`concepts[${index}][icon]`, concept.icon);
        formData.append(`concepts[${index}][title]`, concept.title);
        if (concept.image) {
          formData.append(`concepts[${index}][image]`, concept.image);
        }
      });
      
      // Add timeline and faqs
      formData.append('timeline', JSON.stringify(sections.timeline));
      formData.append('faqs', JSON.stringify(sections.faqs));

      // Send as multipart/form-data
      const response = await (isebit
        ? axiosInstance.put(`/eventsdashboard/${editid}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
        : axiosInstance.post('/eventsdashboard', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
      );

      if (response.status === 200) {
        alert('Content updated successfully!');
      } else {
        alert('Error updating content. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error submitting form. Please check console.');
    } finally {
      setLoading(false);
    }
  };

  // Show current image size info
  const getImageSizeInfo = (file: File | string | null): string => {
    if (!file) return 'No image selected';
    if (typeof file === 'string') return 'Existing image';
    const sizeKB = Math.round(file.size / 1024);
    return `${sizeKB}KB ${sizeKB > 500 ? '(⚠️ Above 500KB limit)' : '(✓ Under 500KB)'}`;
  };

  const getdata=async()=>{
    try {
      const response = await axiosInstance.get(`/eventsdashboard/${id}`);
      const fetchedData = response.data.data;
      seteventData(fetchedData);
      
      if (fetchedData && fetchedData.length > 0) {
        setIsebit(true);
        const eventData = fetchedData[0];
        seteditid(eventData._id);
        
        // Populate form with fetched data
        setSections({
          hero: {
            title: eventData.hero?.title || '',
            subtitle: eventData.hero?.subtitle || '',
            description: eventData.hero?.description || '',
            contents: eventData.hero?.contents || [],
            image: eventData.hero?.image || null // Set image URL from server
          },
          services: eventData.services || [],
          concepts: eventData.concepts?.map((c: any) => ({
            ...c,
            image: c.image || null // Set image URL from server
          })) || [],
          timeline: eventData.timeline || [],
          faqs: eventData.faqs || []
        });
      }
    } catch (error) {
      console.error('Error fetching birthday data:', error);
    }
  }

   useEffect(() => {
    fetchData();
    getdata();
    
  }, [id]);

  // Log editid whenever it changes
  useEffect(() => {
    console.log("editid:", editid);
  }, [editid]);


  return (
    <div className="min-h-screen">
      <div className="mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">{data?.name || 'Event'} Events </h1>
          <p className="text-gray-600 dark:text-gray-400">Events of the Century - {data?.name || 'Event'} Content Management</p>
        
        </div>

     

        <div>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
              <TabsTrigger value="hero">Hero</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="concepts">Concepts</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="faqs">FAQs</TabsTrigger>
            </TabsList>

            {/* HERO SECTION */}
            <TabsContent value="hero" className="space-y-6 mt-6">
              <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white">Hero Section</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Edit hero content and image. 
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Hero Title, Subtitle, Description */}
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Main Title</label>
                      <Input
                        value={sections.hero.title}
                        onChange={(e) => setSections(prev => ({
                          ...prev,
                          hero: { ...prev.hero, title: e.target.value }
                        }))}
                        className="mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
                        placeholder="Main title"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Subtitle</label>
                      <Input
                        value={sections.hero.subtitle}
                        onChange={(e) => setSections(prev => ({
                          ...prev,
                          hero: { ...prev.hero, subtitle: e.target.value }
                        }))}
                        className="mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
                        placeholder="Subtitle"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Description</label>
                      <Textarea
                        value={sections.hero.description}
                        onChange={(e) => setSections(prev => ({
                          ...prev,
                          hero: { ...prev.hero, description: e.target.value }
                        }))}
                        className="mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-500 min-h-[100px]"
                        placeholder="Description"
                        required
                      />
                    </div>
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    {/* Hero Image Upload */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-3 block">
                        Hero Image (Max 500KB)
                      </label>
                      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 hover:border-amber-400 transition-colors">
                        <div className="flex flex-col items-center gap-3">
                          <div className="text-4xl">🖼️</div>
                          <label className="cursor-pointer">
                            <span className="text-sm font-medium text-amber-600 hover:text-amber-700">
                              Click to upload image (JPEG, PNG, GIF, WebP)
                            </span>
                            <input
                              type="file"
                              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                              onChange={handleHeroImageUpload}
                              className="hidden"
                            />
                          </label>
                          <p className="text-xs text-gray-500">
                            Max 10MB upload • Automatically compressed to under 500KB
                          </p>
                          {sections.hero.image && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                              Current: {getImageSizeInfo(sections.hero.image)}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      {/* Image Preview */}
                      {sections.hero.image && (
                        <div className="mt-4">
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Preview:</p>
                          <img
                            src={typeof sections.hero.image === 'string' ? sections.hero.image : URL.createObjectURL(sections.hero.image)}
                            alt="Hero preview"
                            className="w-full h-64 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Hero Contents */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">Hero Content</h3>
                      <Button onClick={addHeroContent} size="sm" className="bg-amber-600 hover:bg-amber-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Content
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      {sections.hero.contents.map((item, index) => (
                        <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-3 border border-gray-200 dark:border-gray-700">
                          <div className="flex justify-between items-start gap-3">
                            <div className="flex-1 space-y-3">
                              <Input
                                value={item.title}
                                onChange={(e) => handleHeroContentChange(index, 'title', e.target.value)}
                                className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500"
                                placeholder="Title"
                                required
                              />
                              <Textarea
                                value={item.description}
                                onChange={(e) => handleHeroContentChange(index, 'description', e.target.value)}
                                className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 min-h-[80px]"
                                placeholder="Description"
                                required
                              />
                            </div>
                            <Button
                              onClick={() => deleteHeroContent(index)}
                              size="sm"
                              variant="destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* SERVICES SECTION */}
            <TabsContent value="services" className="space-y-6 mt-6">
              <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-gray-900 dark:text-white">What We Handle</CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">Manage birthday event services</CardDescription>
                  </div>
                  <Button onClick={addService} size="sm" className="bg-amber-600 hover:bg-amber-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Service
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {sections.services.map((item) => (
                    <div key={item.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-3 border border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <Input
                              value={item.icon}
                              onChange={(e) => handleServicesChange(item.id, 'icon', e.target.value)}
                              className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500"
                              placeholder="Icon emoji"
                              maxLength={2}
                              required
                            />
                            <Input
                              value={item.title}
                              onChange={(e) => handleServicesChange(item.id, 'title', e.target.value)}
                              className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500"
                              placeholder="Service title"
                              required
                            />
                          </div>
                          <Textarea
                            value={item.description}
                            onChange={(e) => handleServicesChange(item.id, 'description', e.target.value)}
                            className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 min-h-[70px]"
                            placeholder="Service description"
                            required
                          />
                        </div>
                        <Button
                          onClick={() => deleteService(item.id)}
                          size="sm"
                          variant="destructive"
                          className="ml-3"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* CONCEPTS SECTION */}
            <TabsContent value="concepts" className="space-y-6 mt-6">
              <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-gray-900 dark:text-white">Signature Birthday Concepts</CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">
                      Manage birthday event concepts. Images are automatically compressed to under 500KB.
                    </CardDescription>
                  </div>
                  <Button onClick={addConcept} size="sm" className="bg-amber-600 hover:bg-amber-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Concept
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {sections.concepts.map((item) => (
                    <div key={item.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-3 border border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between items-start gap-3">
                        <div className="flex-1 space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <Input
                              value={item.icon}
                              onChange={(e) => handleConceptsChange(item.id, 'icon', e.target.value)}
                              className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500"
                              placeholder="Icon emoji"
                              maxLength={2}
                              required
                            />
                            <Input
                              value={item.title}
                              onChange={(e) => handleConceptsChange(item.id, 'title', e.target.value)}
                              className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500"
                              placeholder="Concept title"
                              required
                            />
                          </div>

                          {/* Image Upload for Concept */}
                          <div className="space-y-2">
                            <label className="text-xs font-medium text-gray-700 dark:text-gray-200">
                              Concept Image (Max 500KB)
                            </label>
                            <label className="flex flex-col items-center gap-2 p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                              <Upload className="w-6 h-6 text-gray-400" />
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                Click to upload image
                              </span>
                              <span className="text-xs text-gray-500">
                                JPEG, PNG, GIF, WebP • Max 10MB
                              </span>
                              <input
                                type="file"
                                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                                onChange={(e) => handleConceptImageUpload(item.id, e)}
                                className="hidden"
                              />
                            </label>
                            
                            {item.image && (
                              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                Current: {getImageSizeInfo(item.image)}
                              </p>
                            )}
                          </div>

                          {/* Image Preview */}
                          {item.image && (
                            <div className="mt-3">
                              <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Preview:</p>
                              <img
                                src={typeof item.image === 'string' ? item.image : URL.createObjectURL(item.image)}
                                alt={item.title}
                                className="w-full h-48 object-cover rounded border border-gray-200 dark:border-gray-700"
                              />
                            </div>
                          )}
                        </div>
                        <Button
                          onClick={() => deleteConcept(item.id)}
                          size="sm"
                          variant="destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* TIMELINE SECTION */}
            <TabsContent value="timeline" className="space-y-6 mt-6">
              <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-gray-900 dark:text-white">Event Timeline</CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">Manage event timeline steps</CardDescription>
                  </div>
                  <Button onClick={addTimeline} size="sm" className="bg-amber-600 hover:bg-amber-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Step
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {sections.timeline.map((item) => (
                    <div key={item.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-3 border border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 space-y-3">
                          <div className="grid grid-cols-3 gap-3">
                            <Input
                              value={item.step}
                              onChange={(e) => handleTimelineChange(item.id, 'step', e.target.value)}
                              className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500"
                              placeholder="Step number"
                              required
                            />
                            <Input
                              value={item.title}
                              onChange={(e) => handleTimelineChange(item.id, 'title', e.target.value)}
                              className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 col-span-2"
                              placeholder="Step title"
                              required
                            />
                          </div>
                          <Textarea
                            value={item.description}
                            onChange={(e) => handleTimelineChange(item.id, 'description', e.target.value)}
                            className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 min-h-[70px]"
                            placeholder="Step description"
                            required
                          />
                        </div>
                        <Button
                          onClick={() => deleteTimeline(item.id)}
                          size="sm"
                          variant="destructive"
                          className="ml-3"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* FAQs SECTION */}
            <TabsContent value="faqs" className="space-y-6 mt-6">
              <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-gray-900 dark:text-white">FAQs</CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">Manage frequently asked questions</CardDescription>
                  </div>
                  <Button onClick={addFaq} size="sm" className="bg-amber-600 hover:bg-amber-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add FAQ
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {sections.faqs.map((item) => (
                    <div key={item.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-3 border border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 space-y-3">
                          <Input
                            value={item.question}
                            onChange={(e) => handleFaqChange(item.id, 'question', e.target.value)}
                            className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500"
                            placeholder="Question"
                            required
                          />
                          <Textarea
                            value={item.answer}
                            onChange={(e) => handleFaqChange(item.id, 'answer', e.target.value)}
                            className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 min-h-[80px]"
                            placeholder="Answer"
                            required
                          />
                        </div>
                        <Button
                          onClick={() => deleteFaq(item.id)}
                          size="sm"
                          variant="destructive"
                          className="ml-3"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mt-8 flex justify-end gap-4">
            <Button 
              onClick={handleSubmit} 
              disabled={loading}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Submitting...' : 'Submit Changes'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}