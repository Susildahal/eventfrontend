'use client'
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, Save } from 'lucide-react';
import axiosInstance from '@/app/config/axiosInstance';
import { toast } from 'react-hot-toast';
import { HeroForm, MissionVisionForm, BeliefsForm, TechnologyForm } from './MissionFormComponents';
import type { Sections, HeroSection, MissionVisionItem, BeliefItem, MethodItem, SustainabilityItem, TechnologyItem, BudgetItem } from './types';

export default function AboutUsAdminDashboard() {
  const [sections, setSections] = useState<Sections>({
    hero: {
      title: '',
      mainTitle: '',
      description: '',
      cta: 'Our Story',
      images: []
    },
    missionVision: [],
    whatWeBelieve: [],
    theOcMethod: [],
    theOcMethodTitle: '',
    sustainability: [],
    sustainabilityTitle: 'Sustainability',
    whatWeBelieveTitle: 'What We Believe',
    technologyTitle: 'Technology & Tools',
    budgetsTitle: 'Budgets',
    technology: [
      {
        id: 1,
        icon: '🔧',
        title: '',
        description: '',
        points: []
      }
    ],
    budgets: [
      {
        id: 1,
        icon: '🎪',
        title: 'Private Events',
        description: 'Lead Time: 4 to 8 weeks',
        details: 'Designed for elegance and intimacy with flexible scaling options.'
      }
    ]
      ,
      missionTitle: '',
      missionDescription: '',
      visionTitle: '',
      visionDescription: ''
  });

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('hero');
  const [hasData, setHasData] = useState(false);
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
          
          // Ensure technology items have points array
          if (Array.isArray(processedData.technology)) {
            processedData.technology = processedData.technology.map((tech: any) => ({
              ...tech,
              points: Array.isArray(tech.points) ? tech.points : []
            }));
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

  // What We Believe Handlers
  const handleBeliefChange = (id: number, field: keyof BeliefItem, value: string) => {
    setSections(prev => ({
      ...prev,
      whatWeBelieve: prev.whatWeBelieve.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  const addBelief = () => {
    setSections(prev => ({
      ...prev,
      whatWeBelieve: [...prev.whatWeBelieve, { id: Date.now(), icon: '✨', title: '', description: '' }]
    }));
  };

  const deleteBelief = (id: number) => {
    setSections(prev => ({
      ...prev,
      whatWeBelieve: prev.whatWeBelieve.filter(item => item.id !== id)
    }));
  };

  // OC Method Handlers
  const handleMethodChange = (id: number, field: keyof MethodItem, value: string) => {
    setSections(prev => ({
      ...prev,
      theOcMethod: prev.theOcMethod.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  const addMethod = () => {
    setSections(prev => ({
      ...prev,
      theOcMethod: [...prev.theOcMethod, { id: Date.now(), number: '', title: '', description: '' }]
    }));
  };

  const deleteMethod = (id: number) => {
    setSections(prev => ({
      ...prev,
      theOcMethod: prev.theOcMethod.filter(item => item.id !== id)
    }));
  };

  // Sustainability Handlers
  const handleSustainabilityChange = (id: number, field: keyof SustainabilityItem, value: string) => {
    setSections(prev => ({
      ...prev,
      sustainability: prev.sustainability.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  const addSustainability = () => {
    setSections(prev => ({
      ...prev,
      sustainability: [...prev.sustainability, { id: Date.now(), icon: '♻️', title: '', description: '' }]
    }));
  };

  const deleteSustainability = (id: number) => {
    setSections(prev => ({
      ...prev,
      sustainability: prev.sustainability.filter(item => item.id !== id)
    }));
  };

  // Technology Handlers
  const handleTechnologyItemChange = (techId: number, field: 'icon' | 'title' | 'description', value: string) => {
    setSections(prev => ({
      ...prev,
      technology: prev.technology.map(t => t.id === techId ? { ...t, [field]: value } : t)
    }));
  };

  const handleTechnologyPointChange = (techId: number, pointId: number, value: string) => {
    setSections(prev => ({
      ...prev,
      technology: prev.technology.map(t =>
        t.id === techId
          ? { ...t, points: t.points.map(p => p.id === pointId ? { ...p, point: value } : p) }
          : t
      )
    }));
  };

  const addTechnologyItem = () => {
    setSections(prev => ({
      ...prev,
      technology: [...prev.technology, { id: Date.now(), icon: '', title: '', description: '', points: [{ id: Date.now() + 1, point: '' }] }]
    }));
  };

  const deleteTechnologyItem = (techId: number) => {
    setSections(prev => ({
      ...prev,
      technology: prev.technology.filter(t => t.id !== techId)
    }));
  };

  const addTechnologyPoint = (techId: number) => {
    setSections(prev => ({
      ...prev,
      technology: prev.technology.map(t =>
        t.id === techId ? { ...t, points: [...t.points, { id: Date.now(), point: '' }] } : t
      )
    }));
  };

  const deleteTechnologyPoint = (techId: number, pointId: number) => {
    setSections(prev => ({
      ...prev,
      technology: prev.technology.map(t =>
        t.id === techId ? { ...t, points: t.points.filter(p => p.id !== pointId) } : t
      )
    }));
  };

  // Budgets Handlers
  const handleBudgetChange = (id: number, field: keyof BudgetItem, value: string) => {
    setSections(prev => ({
      ...prev,
      budgets: prev.budgets.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  const deleteBudget = (id: number) => {
    setSections(prev => ({
      ...prev,
      budgets: prev.budgets.filter(item => item.id !== id)
    }));
  };

  const addBudget = () => {
    setSections(prev => ({
      ...prev,
      budgets: [...prev.budgets, { id: Date.now(), icon: '🎉', title: '', description: '', details: '' }]
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
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[var(--color-foreground)] mb-2">About Us - Admin Dashboard</h1>
          <p className="text-[var(--color-muted-foreground)]">Events of the Century - About Us Content Management</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-7 bg-[var(--color-card)] border-[var(--color-border)] overflow-x-auto">
            <TabsTrigger value="hero">Hero</TabsTrigger>
            <TabsTrigger value="mission">Mission & Vision</TabsTrigger>
            <TabsTrigger value="beliefs">Beliefs</TabsTrigger>
            <TabsTrigger value="method">OC Method</TabsTrigger>
            <TabsTrigger value="sustainability">Sustainability</TabsTrigger>
            <TabsTrigger value="technology">Technology</TabsTrigger>
            <TabsTrigger value="budgets">Budgets</TabsTrigger>
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

          {/* WHAT WE BELIEVE */}
          <TabsContent value="beliefs" className="space-y-6 mt-6">
            <BeliefsForm
              whatWeBelieveTitle={sections.whatWeBelieveTitle}
              whatWeBelieve={sections.whatWeBelieve}
              onBeliefChange={handleBeliefChange}
              onAddBelief={addBelief}
              onDeleteBelief={deleteBelief}
              onSetBelieveTitle={(value) => setSections(prev => ({ ...prev, whatWeBelieveTitle: value }))}
            />
          </TabsContent>

          {/* OC METHOD */}
          <TabsContent value="method" className="space-y-6 mt-6">
            <Card className="flex flex-col justify-center bg-[var(--color-card)] border-[var(--color-border)]">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-[var(--color-foreground)]">The OC Method</CardTitle>
                  <CardDescription className="text-[var(--color-muted-foreground)]">Manage methodology steps</CardDescription>
                </div>
                <Button onClick={addMethod} size="sm" className="bg-amber-600 hover:bg-amber-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Step
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <label className="text-sm font-medium text-[var(--color-muted-foreground)]">Section Title</label>
                <Input
                  value={sections.theOcMethodTitle ?? ''}
                  onChange={(e) => setSections(prev => ({ ...prev, theOcMethodTitle: e.target.value }))}
                  className="mt-2 border-[var(--color-border)] text-[var(--color-foreground)] placeholder-[var(--color-muted-foreground)]"
                  placeholder="Section title (e.g., The OC Method)"
                />
                {sections.theOcMethod.map((item) => (
                  <div key={item.id} className="p-4 bg-[var(--color-card)] rounded-lg space-y-3 border border-[var(--color-border)]">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 space-y-3">
                        <div className="grid grid-cols-3 gap-3">
                          <Input
                            value={item.number}
                            onChange={(e) => handleMethodChange(item.id, 'number', e.target.value)}
                            className="border-[var(--color-border)] text-[var(--color-foreground)] placeholder-[var(--color-muted-foreground)]"
                            placeholder="Number (01-06)"
                            required
                          />
                          <Input
                            value={item.title}
                            onChange={(e) => handleMethodChange(item.id, 'title', e.target.value)}
                            className="border-[var(--color-border)] text-[var(--color-foreground)] placeholder-[var(--color-muted-foreground)] col-span-2"
                            placeholder="Step title"
                            required
                          />
                        </div>
                        <Textarea
                          value={item.description}
                          onChange={(e) => handleMethodChange(item.id, 'description', e.target.value)}
                          className="border-[var(--color-border)] text-[var(--color-foreground)] placeholder-[var(--color-muted-foreground)] min-h-[70px]"
                          placeholder="Step description"
                          required
                        />
                      </div>
                      <Button
                        onClick={() => deleteMethod(item.id)}
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

          {/* SUSTAINABILITY */}
          <TabsContent value="sustainability" className="space-y-6 mt-6">
            <Card className="bg-[var(--color-card)] border-[var(--color-border)]">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-[var(--color-foreground)]">Sustainability & Respect</CardTitle>
                  <CardDescription className="text-[var(--color-muted-foreground)]">Manage sustainability initiatives</CardDescription>
                </div>
                <Button onClick={addSustainability} size="sm" className="bg-amber-600 hover:bg-amber-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Initiative
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <label className="text-sm font-medium text-[var(--color-muted-foreground)]">Section Title</label>
                <Input
                  value={sections.sustainabilityTitle ?? ''}
                  onChange={(e) => setSections(prev => ({ ...prev, sustainabilityTitle: e.target.value }))}
                  className="mt-2 border-[var(--color-border)] text-[var(--color-foreground)] placeholder-[var(--color-muted-foreground)]"
                  placeholder="Section title (e.g., Sustainability)"
                />
                {sections.sustainability.map((item) => (
                  <div key={item.id} className="p-4 bg-[var(--color-card)] rounded-lg space-y-3 border border-[var(--color-border)]">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <Input
                            value={item.icon}
                            onChange={(e) => handleSustainabilityChange(item.id, 'icon', e.target.value)}
                            className="border-[var(--color-border)] text-[var(--color-foreground)] placeholder-[var(--color-muted-foreground)]"
                            placeholder="Icon emoji"
                            maxLength={2}
                            required
                          />
                          <Input
                            value={item.title}
                            onChange={(e) => handleSustainabilityChange(item.id, 'title', e.target.value)}
                            className="border-[var(--color-border)] text-[var(--color-foreground)] placeholder-[var(--color-muted-foreground)]"
                            placeholder="Initiative title"
                            required
                          />
                        </div>
                        <Textarea
                          value={item.description}
                          onChange={(e) => handleSustainabilityChange(item.id, 'description', e.target.value)}
                          className="border-[var(--color-border)] text-[var(--color-foreground)] placeholder-[var(--color-muted-foreground)] min-h-[70px]"
                          placeholder="Initiative description"
                          required
                        />
                      </div>
                      <Button
                        onClick={() => deleteSustainability(item.id)}
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

          {/* TECHNOLOGY */}
          <TabsContent value="technology" className="space-y-6 mt-6">
            <TechnologyForm
              technologyTitle={sections.technologyTitle}
              technology={sections.technology}
              onTechnologyItemChange={handleTechnologyItemChange}
              onTechnologyPointChange={handleTechnologyPointChange}
              onAddTechnologyItem={addTechnologyItem}
              onDeleteTechnologyItem={deleteTechnologyItem}
              onAddTechnologyPoint={addTechnologyPoint}
              onDeleteTechnologyPoint={deleteTechnologyPoint}
              onSetTechnologyTitle={(value) => setSections(prev => ({ ...prev, technologyTitle: value }))}
            />
          </TabsContent>

          {/* BUDGETS & TIMELINES */}
          <TabsContent value="budgets" className="space-y-6 mt-6">
            <Card className="bg-[var(--color-card)] border-[var(--color-border)]">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-[var(--color-foreground)]">Budgets & Timelines</CardTitle>
                  <CardDescription className="text-[var(--color-muted-foreground)]">Manage budget packages</CardDescription>
                </div>
                <Button onClick={addBudget} size="sm" className="bg-amber-600 hover:bg-amber-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Budget Item
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <label className="text-sm font-medium text-[var(--color-muted-foreground)]">Section Title</label>
                <Input
                  value={sections.budgetsTitle ?? ''}
                  onChange={(e) => setSections(prev => ({ ...prev, budgetsTitle: e.target.value }))}
                  className="mt-2 border-[var(--color-border)] text-[var(--color-foreground)] placeholder-[var(--color-muted-foreground)]"
                  placeholder="Section title (e.g., Budgets)"
                />
                {sections.budgets.map((item) => (
                  <div key={item.id} className="p-4 bg-[var(--color-card)] rounded-lg space-y-3 border border-[var(--color-border)]">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <Input
                            value={item.icon}
                            onChange={(e) => handleBudgetChange(item.id, 'icon', e.target.value)}
                            className="border-[var(--color-border)] text-[var(--color-foreground)] placeholder-[var(--color-muted-foreground)]"
                            placeholder="Icon emoji"
                            maxLength={2}
                            required
                          />
                          <Input
                            value={item.title}
                            onChange={(e) => handleBudgetChange(item.id, 'title', e.target.value)}
                            className="border-[var(--color-border)] text-[var(--color-foreground)] placeholder-[var(--color-muted-foreground)]"
                            placeholder="Package title"
                            required
                          />
                        </div>
                        <Textarea
                          value={item.description}
                          onChange={(e) => handleBudgetChange(item.id, 'description', e.target.value)}
                          className="border-[var(--color-border)] text-[var(--color-foreground)] placeholder-[var(--color-muted-foreground)] min-h-[70px]"
                          placeholder="Package description (short)"
                          required
                        />
                        <Textarea
                          value={item.details}
                          onChange={(e) => handleBudgetChange(item.id, 'details', e.target.value)}
                          className="border-[var(--color-border)] text-[var(--color-foreground)] placeholder-[var(--color-muted-foreground)] min-h-[70px]"
                          placeholder="Package details (full description)"
                          required
                        />
                      </div>
                      <Button
                        onClick={() => deleteBudget(item.id)}
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
  );
}
