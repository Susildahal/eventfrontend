'use client'
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, Save, ArrowLeft } from 'lucide-react';
import axiosInstance from '@/app/config/axiosInstance';
import { toast } from 'react-hot-toast';
import { HeroForm, MissionVisionForm} from './MissionFormComponents';
import type { Sections, HeroSection, MissionVisionItem, BeliefItem, MethodItem, SustainabilityItem, TechnologyItem, BudgetItem } from './types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
export default function AboutUsAdminDashboard() {
  const router = useRouter();
  const [sections, setSections] = useState<Sections>({
    hero: {
      title: '',
      mainTitle: '',
      description: '',
      cta: 'Our Story',
      images: [] as { id: number; url: string }[]
    },
    missionVision: [],        // Added to satisfy Sections type
    missionTitle: '',
    missionDescription: '',
    visionTitle: '',
    visionDescription: '',
    whatWeBelieve: [],
    theOcMethod: [],
    sustainability: [],
    technology: [],
    budgets: []
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'hero' | 'mission'>('hero');
  const [hasData, setHasData] = useState<boolean>(false);
  const [aboutId, setAboutId] = useState<string | number | null>(null);
  // removed heroFiles state – images are URL-only now

  // Fetch initial data from backend
  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const res = await axiosInstance.get('/about');
        let data = res.data?.data ?? res.data;

        // Handle array response from backend (takes first item)
        if (Array.isArray(data) && data.length > 0) {
          data = data[0];
        }

        if (data && typeof data === 'object') {
          // Flatten hero object if it exists as nested structure
          const processedData = { ...data };
          if (data.hero && typeof data.hero === 'object') {
            processedData.hero = {
              title: data.hero.title || data.title || 'About Us',
              mainTitle: data.hero.mainTitle || data.mainTitle || '',
              description: data.hero.description || '',
              cta: data.cta || 'Our Story',
              images: data.images || data.hero.images || []
            };
          }

       

          setSections(prev => ({ ...prev, ...processedData }));
          // Capture id from response for PUT requests (use _id for MongoDB)
          const id = data._id ?? data.id ?? null;
          console.log('Fetched about data:', { id, hasData: !!id, dataKeys: Object.keys(data) });
          if (id) setAboutId(id);
          setHasData(!!id);
        }
      } catch (error: any) {
        // silently fail - use default state
        console.warn('Failed to fetch about data:', error.message);
        setHasData(false);
      }
    };
    fetchAboutData();
  }, []);

  // Hero Section Handlers
  const handleHeroChange = (field: keyof HeroSection, value: string) => {
    setSections(prev => ({
      ...prev,
      hero: { ...prev.hero, [field]: value }
    }));
  };

  const handleHeroImageChange = (id: number, value: string) => {
    setSections(prev => ({
      ...prev,
      hero: {
        ...prev.hero,
        images: prev.hero.images.map(img =>
          img.id === id ? { ...img, url: value } : img
        )
      }
    }));
  };

  const addHeroImage = () => {
    setSections(prev => ({
      ...prev,
      hero: {
        ...prev.hero,
        images: [...prev.hero.images, { id: Date.now(), url: '' }]
      }
    }));
  };

  const deleteHeroImage = (id: number) => {
    setSections(prev => ({
      ...prev,
      hero: {
        ...prev.hero,
        images: prev.hero.images.filter(img => img.id !== id)
      }
    }));
  };

  // Mission Vision Handlers
  const handleMissionChange = (id: number, field: keyof MissionVisionItem | 'description', value: string) => {
    setSections(prev => ({
      ...prev,
      missionVision: prev.missionVision.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };


  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Send data as JSON only - no file uploads
      const sectionsCopy: any = { ...sections };
      const heroImages = Array.isArray(sections.hero?.images) ? sections.hero.images : [];
      sectionsCopy.hero = { ...sections.hero, images: heroImages };

      // Use axiosInstance to send directly to backend API
      const endpoint = hasData && aboutId ? `/about/${aboutId}` : '/about';
      const method = hasData ? 'put' : 'post';

      console.log('Submit details:', {
        hasData,
        aboutId,
        endpoint,
        method,
        currentImageCount: heroImages.length
      });

      const response = await axiosInstance[method](endpoint, sectionsCopy, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Response:', response.data);

      const result = response.data?.data ?? response.data;
      const normalized = Array.isArray(result) ? result[0] : result;

      if (normalized) {
        const returnedId = normalized._id ?? normalized.id ?? aboutId;
        if (returnedId) setAboutId(returnedId);
        setHasData(true);
        toast.success(`About Us content ${hasData ? 'updated' : 'created'} successfully!`);
      }
    } catch (error: any) {
      console.error('Error:', error);
      console.error('Error response:', error.response?.data);
      const msg = error.response?.data?.message || error.message || 'Error submitting form';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="mx-auto ">
        <div className="mb-8 flex justify-between items-center">
          <div className='  justify-center items-center flex gap-4'>
           <ArrowLeft className='cursor-pointer' onClick={() => router.back()} />
            <div className='flex flex-col'>
              <h1 className="text-2xl font-bold text-[var(--color-foreground)] mb-2">About Us - Admin Dashboard</h1>
              <p className="text-[var(--color-muted-foreground)]">Events of the Century - About Us Content Management</p>
            </div>
          </div>

          <div className="mb-6 flex justify-end">
           <Link href="/admin/aboutimage"><Button> Add Image </Button></Link>
          </div>
        </div>
        <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as 'hero' | 'mission')} className="w-full">
          <TabsList className="grid w-full grid-cols-7 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
            <TabsTrigger value="hero">Hero</TabsTrigger>
            <TabsTrigger value="mission">Mission & Vision</TabsTrigger>
       
          </TabsList>

          {/* HERO SECTION */}
          <TabsContent value="hero" className="space-y-6 mt-6">
            <HeroForm
              hero={sections.hero}
              onHeroChange={handleHeroChange}
              onHeroImageChange={handleHeroImageChange}
              onAddHeroImage={addHeroImage}
              onDeleteHeroImage={deleteHeroImage}
            />
          </TabsContent>

          {/* MISSION VISION */}
          <TabsContent value="mission" className="space-y-6 mt-6">
            <MissionVisionForm
              missionTitle={sections.missionTitle}
              missionDescription={sections.missionDescription}
              missionVision={sections.missionVision}
              visionDescription={sections.visionDescription}
              onMissionChange={handleMissionChange}
              onSetMissionTitle={(value) => setSections(prev => ({ ...prev, missionTitle: value }))}
              onSetMissionDescription={(value) => setSections(prev => ({ ...prev, missionDescription: value }))}
              onSetVisionDescription={(value) => setSections(prev => ({ ...prev, visionDescription: value }))}
            />
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
  );
}
