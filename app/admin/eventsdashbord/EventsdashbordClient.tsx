"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, Save, Upload ,ArrowLeft } from 'lucide-react';
import axiosInstance from '@/app/config/axiosInstance';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

interface HeroContent {
  title: string;
  description: string;
}
interface Hero {
  title: string;
  subtitle: string;
  description: string;
  contents: HeroContent[];
  image: File | string | null;
}

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

interface Sections {
  hero: Hero;
  faqs: FAQItem[];
}

export default function EventsdashbordClient() {
 const searchParams = useSearchParams();
  const id = searchParams?.get('id')
  console.log('query id:', id)

  const [data ,setData]=useState<any>(null);
  const [eventdata ,seteventData]=useState(null);
  const [isebit , setIsebit] = useState(false);
  const [editid , seteditid] = useState<any>(null);
  const router = useRouter();
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
    faqs: [
      { id: 1, question: '', answer: '' },
    ]
  });

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('hero');
  const [imageError, setImageError] = useState<string | null>(null);
  const [imageSuccess, setImageSuccess] = useState<string | null>(null);

  const compressImage = (file: File, maxSizeKB = 500): Promise<File> => {
    return new Promise((resolve, reject) => {
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
          const maxDimension = 1200;
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
          ctx.drawImage(img, 0, 0, newWidth, newHeight);
          const compressWithQuality = (quality: number): void => {
            canvas.toBlob(
              (blob) => {
                if (!blob) {
                  reject(new Error('Could not create blob'));
                  return;
                }
                const sizeKB = blob.size / 1024;
                if (sizeKB <= maxSizeKB || quality <= 0.5) {
                  const compressedFile = new File(
                    [blob],
                    file.name.replace(/\.[^/.]+$/, "") + '_compressed.jpg',
                    { type: 'image/jpeg', lastModified: Date.now() }
                  );
                  resolve(compressedFile);
                } else {
                  compressWithQuality(quality - 0.1);
                }
              },
              'image/jpeg',
              quality
            );
          };
          compressWithQuality(0.8);
        };
        img.onerror = () => reject(new Error('Failed to load image'));
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
    });
  };

  const validateAndCompressImage = async (file: File): Promise<File> => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      throw new Error('Please upload JPEG, PNG, GIF, or WebP images only.');
    }
    const maxInitialSizeMB = 10;
    if (file.size > maxInitialSizeMB * 1024 * 1024) {
      throw new Error(`Image too large! Maximum upload size is ${maxInitialSizeMB}MB.`);
    }
    return await compressImage(file, 500);
  };

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
      const originalSizeKB = Math.round(file.size / 1024);
      const compressedSizeKB = Math.round(compressedFile.size / 1024);
      setImageSuccess(`✓ Image compressed from ${originalSizeKB}KB to ${compressedSizeKB}KB`);
      setTimeout(() => setImageSuccess(null), 4000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to process image';
      setImageError(`❌ ${errorMessage}`);
      e.target.value = '';
    }
  };

  const validateAllImages = (): boolean => {
    const errors: string[] = [];
    if (sections.hero.image && typeof sections.hero.image !== 'string') {
      const sizeKB = Math.round(sections.hero.image.size / 1024);
      if (sizeKB > 500) {
        errors.push(`Hero image is ${sizeKB}KB (must be under 500KB)`);
      }
    }
    if (errors.length > 0) {
      setImageError(errors.join('\n'));
      return false;
    }
    return true;
  };

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

  const handleSubmit = async () => {
    if (!validateAllImages()) {
      return;
    }
    setLoading(true);
    setImageError(null);
    try {
      const formData = new FormData();
      formData.append('hero[title]', sections.hero.title);
      formData.append('hero[subtitle]', sections.hero.subtitle);
      formData.append('hero[description]', sections.hero.description);
      formData.append('hero[contents]', JSON.stringify(sections.hero.contents));
      if (sections.hero.image) {
        formData.append('hero[image]', sections.hero.image);
      }
      formData.append('eventsid[id]', id || '');
      formData.append('eventsid[name]', data?.name || '');
      formData.append('faqs', JSON.stringify(sections.faqs));
      const response = await (isebit
        ? axiosInstance.put(`/eventsdashboard/${editid}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          })

        : axiosInstance.post('/eventsdashboard', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          })
      );
      if (response.status === 400) {
        fetchData();
      
       

      } else {
     
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error submitting form.');
    } finally {
      setLoading(false);
    }
  };

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
      if (response.status === 404){
        setIsebit(false);
     

      }


      seteventData(fetchedData);
      if (fetchedData && fetchedData.length > 0) {
        setIsebit(true);
        const eventData = fetchedData[0];
        seteditid(eventData._id);
        setSections({
          hero: {
            title: eventData.hero?.title || '',
            subtitle: eventData.hero?.subtitle || '',
            description: eventData.hero?.description || '',
            contents: eventData.hero?.contents || [],
            image: eventData.hero?.image || null
          },
          faqs: eventData.faqs || []
        });
      } else {
        setIsebit(false);
        seteditid(null);
        setSections({
          hero: { title: '', subtitle: '', description: '', contents: [{ title: '', description: '' }], image: null },
          faqs: [{ id: 1, question: '', answer: '' }]
        });
      }
    } catch (error) {
      console.error('Error fetching birthday data:', error);
      setIsebit(false);
      seteditid(null);
      setSections({ hero: { title: '', subtitle: '', description: '', contents: [{ title: '', description: '' }], image: null }, faqs: [{ id: 1, question: '', answer: '' }] });
    }
  }

   useEffect(() => {
    fetchData();
    getdata();
  }, [id]);

  useEffect(() => {
    console.log("editid:", editid);
  }, [editid]);

  return (
    <div className="min-h-screen">
      <div className="mx-auto">
        <div className="mb-8 flex items-center gap-4">
          <ArrowLeft className='h-5 w-5 cursor-pointer text-[#7A5E39]' onClick={() => router.back()} />
          <div className=' flex flex-col'>
          <h1 className="text-2xl font-bold mb-2">{data?.name || 'Event'} Events </h1>
          <p className="text-gray-600 dark:text-gray-400">Events of the Century - {data?.name || 'Event'} Content Management</p>
        </div>
        </div>

        <div>
          <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val)} className="w-full">
            <TabsList className="grid w-full grid-cols-2 border border-gray-200 dark:border-gray-700">
              <TabsTrigger value="hero">Hero</TabsTrigger>
              <TabsTrigger value="faqs">FAQs</TabsTrigger>
            </TabsList>

            <TabsContent value="hero" className="space-y-6 mt-6">
              <div className=" ">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white">Hero Section</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">Edit hero content and image. </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Main Title</label>
                      <Input value={sections.hero.title} onChange={(e) => setSections(prev => ({ ...prev, hero: { ...prev.hero, title: e.target.value } }))} className="mt-2  placeholder-gray-500" placeholder="Main title" required />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Subtitle</label>
                      <Input value={sections.hero.subtitle} onChange={(e) => setSections(prev => ({ ...prev, hero: { ...prev.hero, subtitle: e.target.value } }))} className="mt-2  placeholder-gray-500" placeholder="Subtitle" required />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Description</label>
                      <Textarea value={sections.hero.description} onChange={(e) => setSections(prev => ({ ...prev, hero: { ...prev.hero, description: e.target.value } }))} className="mt-2  placeholder-gray-500 min-h-[100px]" placeholder="Description" required />
                    </div>
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-3 block">Hero Image</label>
                      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 hover:border-amber-400 transition-colors">
                        <div className="flex flex-col items-center gap-3">
                          <div className="text-4xl">🖼️</div>
                          <label className="cursor-pointer">
                            <span className="text-sm font-medium text-amber-600 hover:text-amber-700">Click to upload image (JPEG, PNG, GIF, WebP)</span>
                            <input type="file" accept="image/jpeg,image/jpg,image/png,image/gif,image/webp" onChange={handleHeroImageUpload} className="hidden" />
                          </label>
                          <p className="text-xs text-gray-500">Max 10MB upload •</p>
                          {sections.hero.image && (<p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Current: {getImageSizeInfo(sections.hero.image)}</p>)}
                        </div>
                      </div>
                      {sections.hero.image && (
                        <div className="mt-4">
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Preview:</p>
                          <img src={typeof sections.hero.image === 'string' ? sections.hero.image : URL.createObjectURL(sections.hero.image)} alt="Hero preview" className="w-full h-64 object-cover rounded-lg border border-gray-200 dark:border-gray-700" />
                        </div>
                      )}
                    </div>
                  </div>

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
                              <Input value={item.title} onChange={(e) => handleHeroContentChange(index, 'title', e.target.value)} className=" placeholder-gray-500" placeholder="Title" required />
                              <Textarea value={item.description} onChange={(e) => handleHeroContentChange(index, 'description', e.target.value)} className=" placeholder-gray-500 min-h-[80px]" placeholder="Description" required />
                            </div>
                            <Button onClick={() => deleteHeroContent(index)} size="sm" variant="destructive"><Trash2 className="w-4 h-4" /></Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </div>
            </TabsContent>

            <TabsContent value="faqs" className="space-y-6 mt-6">
              <div className="">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-gray-900 dark:text-white">FAQs</CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">Manage frequently asked questions</CardDescription>
                  </div>
                  <Button onClick={addFaq} size="sm" className="bg-amber-600 hover:bg-amber-700"><Plus className="w-4 h-4 mr-2" />Add FAQ</Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {sections.faqs.map((item) => (
                    <div key={item.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-3 border border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 space-y-3">
                          <Input value={item.question} onChange={(e) => handleFaqChange(item.id, 'question', e.target.value)} className=" placeholder-gray-500" placeholder="Question" required />
                          <Textarea value={item.answer} onChange={(e) => handleFaqChange(item.id, 'answer', e.target.value)} className=" placeholder-gray-500 min-h-[80px]" placeholder="Answer" required />
                        </div>
                        <Button onClick={() => deleteFaq(item.id)} size="sm" variant="destructive" className="ml-3"><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-8 flex justify-end gap-4">
            <Button onClick={handleSubmit} disabled={loading} className=""><Save className="w-4 h-4 mr-2" />{loading ? 'Submitting...' : 'Submit Changes'}</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
