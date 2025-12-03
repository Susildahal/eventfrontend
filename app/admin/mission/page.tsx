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

interface HeroImage {
  id: number;
  url: string;
}

interface HeroSection {
  title: string;
  mainTitle: string;
  description: string;
  cta: string;
  images: HeroImage[];
}

interface MissionVisionItem {
  id: number;
  type: 'mission' | 'vision';
  title: string;
  description: string;
  missiondescription?: string;

}

interface BeliefItem {
  id: number;
  icon: string;
  title: string;
  description: string;
}

interface MethodItem {
  id: number;
  number: string;
  title: string;
  description: string;
}

interface SustainabilityItem {
  id: number;
  icon: string;
  title: string;
  description: string;
}

interface TechPoint {
  id: number;
  point: string;
}

interface TechnologyItem {
  id: number;
  icon: string;
  title: string;
  description: string;
  points: TechPoint[];
}

interface BudgetItem {
  id: number;
  icon: string;
  title: string;
  description: string;
  details: string;
}

interface Sections {
  hero: HeroSection;
  missionVision: MissionVisionItem[];
  missionTitle?: string;
  missionDescription?: string;
  whatWeBelieve: BeliefItem[];
  theOcMethod: MethodItem[];
  sustainability: SustainabilityItem[];
  technology: TechnologyItem[];
  budgets: BudgetItem[];
  whatWeBelieveTitle?: string;
  theOcMethodTitle?: string;
  sustainabilityTitle?: string;
  budgetsTitle?: string;
}

export default function AboutUsAdminDashboard() {
  const [sections, setSections] = useState<Sections>({
    hero: {
      title: '',
      mainTitle: '',
      description: '',
      cta: 'Our Story',
      images: [
        // { id: 1, url: 'https://images.unsplash.com/photo-1519671482677-504be0ffec60?w=300&h=400' },
        // { id: 2, url: 'https://images.unsplash.com/photo-1519671482677-504be0ffec60?w=300&h=400' },
        // { id: 3, url: 'https://images.unsplash.com/photo-1519671482677-504be0ffec60?w=300&h=400' },
        // { id: 4, url: 'https://images.unsplash.com/photo-1519671482677-504be0ffec60?w=300&h=400' },
        // { id: 5, url: 'https://images.unsplash.com/photo-1519671482677-504be0ffec60?w=300&h=400' }
      ]
    },
    missionVision: [
    //   { id: 1, type: 'mission', title: 'Our Mission', description: 'To redefine event planning by creating deeply personal, flawlessly executed experiences that reflect the unique essence of every client.' },
    //   { id: 2, type: 'vision', title: 'Our Vision', description: 'A world where every celebration is a reflection of personal identity, where logistics fade away and moments shine.' }
    ],
    // missionTitle: 'Mission & Vision',
    // missionDescription: 'Our mission is to redefine event planning by creating deeply personal, flawlessly executed experiences that reflect the unique essence of every client. Our vision is a world where every celebration is a reflection of personal identity, where logistics fade away and moments shine.',
    whatWeBelieve: [
    //   { id: 1, icon: '✨', title: 'Personal Over Typical', description: 'We ditch the cookie-cutter approach. Your event tells your story.' },
    //   { id: 2, icon: '🎯', title: 'Flow Before Clutter', description: 'Seamless logistics create space for joy and connection.' },
    //   { id: 3, icon: '🌟', title: 'Memorable Is Non-Negotiable', description: 'Every detail is designed to be talked about for years.' },
    //   { id: 4, icon: '💫', title: 'Details Are Everything', description: 'Nothing is too small or too specific for our attention.' }
    ],
    theOcMethod: [
    //   { id: 1, number: '01', title: 'Discovery', description: 'Understanding your vision, values, and the story you want to tell.' },
    //   { id: 2, number: '02', title: 'Design', description: 'Crafting a bespoke concept that brings your vision to life.' },
    //   { id: 3, number: '03', title: 'Curation', description: 'Sourcing the best venues, vendors, and experiences.' },
    //   { id: 4, number: '04', title: 'Execution', description: 'Managing every detail with precision and grace.' },
    //   { id: 5, number: '05', title: 'Experience', description: 'Delivering an unforgettable moment that exceeds expectations.' },
    //   { id: 6, number: '06', title: 'Afterglow', description: 'Following up to capture memories and celebrate the impact.' }
    ],
    theOcMethodTitle: '',
    sustainability: [
    //   { id: 1, icon: '♻️', title: 'Eco-Conscious Events', description: 'We prioritize sustainable practices without compromising elegance.' },
    //   { id: 2, icon: '🌱', title: 'Ethical Partnerships', description: 'We work with vendors who share our values and commitments.' },
    //   { id: 3, icon: '❤️', title: 'Social Responsibility', description: 'Giving back and creating positive community impact.' }
    ],
    sustainabilityTitle: 'Sustainability',
    whatWeBelieveTitle: 'What We Believe',
    budgetsTitle: 'Budgets',
    technology: [
      {
        id: 1,
        icon: '🔧',
        title: '',
        description: '',
        points: [
        //   { id: 1, point: 'Real-time collaboration and updates' },
        // //   { id: 2, point: 'Integrated vendor management system' },
        //   { id: 3, point: 'Custom event dashboards and timelines' }
        ]
      }
    ],
    budgets: [
    //   { id: 1, icon: '💰', title: 'Private Events', description: 'Intimate gatherings with bespoke experiences. Starting from $5,000.', details: 'Perfect for intimate celebrations and private gatherings. Fully customized experiences tailored to your vision.' },
    //   { id: 2, icon: '🎉', title: 'Brand Launches', description: 'Make a statement with an unforgettable launch event. Starting from $25,000.', details: 'Bold, impactful events designed to make your brand memorable and create lasting impressions.' },
    //   { id: 3, icon: '🍾', title: 'Both Options', description: 'Flexible packages tailored to your budget and vision. Starting from $10,000.', details: 'Custom solutions that blend luxury with flexibility to match your exact needs and timeline.' }
    ]
  });

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('hero');
  const [hasData, setHasData] = useState(false);
  const [aboutId, setAboutId] = useState<string | number | null>(null);

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
          if (id) setAboutId(id);
          setHasData(true);
        }
      } catch (error: any) {
        // silently fail - use default state
        console.warn('Failed to fetch about data:', error.message);
        setHasData(false);
      }
    };
    fetchAboutData();
  }, []);

  // Hero Section
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

  // Mission Vision
  const handleMissionChange = (id: number, field: keyof MissionVisionItem | 'description', value: string) => {
    setSections(prev => ({
      ...prev,
      missionVision: prev.missionVision.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  // What We Believe
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

  // OC Method
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

  // Sustainability
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

  // Technology (now supports multiple technology items, each with its own key points)
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

  // Budgets
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

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Include _id in payload when updating so proxy can route to /about/:id
      const payload = hasData ? { ...sections, _id: aboutId } : sections;
      
      const res = hasData
        ? await axiosInstance.put(`/about/${aboutId}`, payload)
        : await axiosInstance.post('/about', payload);
      
      // Handle both { data: {...} } and direct object responses
      let result = res.data?.data ?? res.data;
      if (Array.isArray(result)) {
        result = result[0];
      }
      
      if (result) {
        // Capture _id from response for subsequent updates (MongoDB uses _id)
        const returnedId = result._id ?? result.id ?? aboutId;
        if (returnedId) setAboutId(returnedId);
        setHasData(true);
        toast.success(`About Us content ${hasData ? 'updated' : 'created'} successfully!`);
      } else {
        toast.error('Error saving content. Please try again.');
      }
    } catch (error: any) {
      console.error('Error:', error);
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
            <TabsTrigger value="mission">Mission And Vision</TabsTrigger>
            <TabsTrigger value="beliefs">Beliefs</TabsTrigger>
            <TabsTrigger value="method">OC Method</TabsTrigger>
            <TabsTrigger value="sustainability">Sustainability</TabsTrigger>
            <TabsTrigger value="technology">Technology</TabsTrigger>
            <TabsTrigger value="budgets">Budgets</TabsTrigger>
          </TabsList>

          {/* HERO SECTION */}
          <TabsContent value="hero" className="space-y-6 mt-6">
            <Card className="bg-[var(--color-card)] border-[var(--color-border)]">
              <CardHeader>
                <CardTitle className="text-[var(--color-foreground)]">Hero Section</CardTitle>
                <CardDescription className="text-[var(--color-muted-foreground)]">Edit about us hero content</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-[var(--color-muted-foreground)]">Section Title</label>
                  <Input
                    value={sections.hero.title}
                    onChange={(e) => handleHeroChange('title', e.target.value)}
                    className="mt-2 bg-[var(--color-input)] border-[var(--color-border)] text-[var(--color-foreground)] placeholder-[var(--color-muted-foreground)]"
                    placeholder="Section title"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-[var(--color-muted-foreground)]">Main Title</label>
                  <Input
                    value={sections.hero.mainTitle}
                    onChange={(e) => handleHeroChange('mainTitle', e.target.value)}
                    className="mt-2 bg-[var(--color-input)] border-[var(--color-border)] text-[var(--color-foreground)] placeholder-[var(--color-muted-foreground)]"
                    placeholder="Main title"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-[var(--color-muted-foreground)]">Description</label>
                  <Textarea
                    value={sections.hero.description}
                    onChange={(e) => handleHeroChange('description', e.target.value)}
                    className="mt-2 bg-[var(--color-input)] border-[var(--color-border)] text-[var(--color-foreground)] placeholder-[var(--color-muted-foreground)] min-h-[120px]"
                    placeholder="Hero description"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-[var(--color-muted-foreground)]">CTA Button Text</label>
                  <Input
                    value={sections.hero.cta}
                    onChange={(e) => handleHeroChange('cta', e.target.value)}
                    className="mt-2 bg-[var(--color-input)] border-[var(--color-border)] text-[var(--color-foreground)] placeholder-[var(--color-muted-foreground)]"
                    placeholder="CTA text"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[var(--color-card)] border-[var(--color-border)]">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-[var(--color-foreground)]">Gallery Images</CardTitle>
                  <CardDescription className="text-[var(--color-muted-foreground)]">Manage hero gallery images</CardDescription>
                </div>
                <Button onClick={addHeroImage} size="sm" className="bg-amber-600 hover:bg-amber-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Image
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {sections.hero.images.map((img, idx) => (
                  <div key={img.id} className="p-4 bg-[var(--color-card)] rounded-lg space-y-3 border border-[var(--color-border)]">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 space-y-3">
                        <label className="text-sm font-medium text-[var(--color-muted-foreground)]">Image {idx + 1} URL</label>
                        <Input
                          value={img.url}
                          onChange={(e) => handleHeroImageChange(img.id, e.target.value)}
                          className="bg-[var(--color-input)] border-[var(--color-border)] text-[var(--color-foreground)] placeholder-[var(--color-muted-foreground)]"
                          placeholder="Image URL"
                          required
                        />
                      </div>
                      <Button
                        onClick={() => deleteHeroImage(img.id)}
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

          {/* MISSION VISION */}
          <TabsContent value="mission" className="space-y-6 mt-6">
            <Card className="bg-[var(--color-card)] border-[var(--color-border)]">
              <CardHeader>
                <CardTitle className="text-[var(--color-foreground)]">Mission & Vision</CardTitle>
                <CardDescription className="text-[var(--color-muted-foreground)]">Edit company mission statement</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-[var(--color-muted-foreground)]">Mission / Vision Title</label>
                  <Input
                    value={sections.missionTitle}
                    onChange={(e) => setSections(prev => ({ ...prev, missionTitle: e.target.value }))}
                    className="mt-2 bg-[var(--color-input)] border-[var(--color-border)] text-[var(--color-foreground)] placeholder-[var(--color-muted-foreground)]"
                    placeholder="Section title (e.g., Mission & Vision)"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-[var(--color-muted-foreground)]">Mission / Vision Text</label>
                  <Textarea
                    value={sections.missionDescription}
                    onChange={(e) => setSections(prev => ({ ...prev, missionDescription: e.target.value }))}
                    className="mt-2 bg-[var(--color-input)] border-[var(--color-border)] text-[var(--color-foreground)] placeholder-[var(--color-muted-foreground)] min-h-[120px]"
                    placeholder="Write the mission and vision here"
                  />
                </div>
                {sections.missionVision.map((item) => (
                  <div key={item.id} className="p-4 bg-[var(--color-card)] rounded-lg space-y-3 border border-[var(--color-border)]">
                    <Input
                      value={item.title}
                      onChange={(e) => handleMissionChange(item.id, 'title', e.target.value)}
                      className="bg-[var(--color-input)] border-[var(--color-border)] text-[var(--color-foreground)] placeholder-[var(--color-muted-foreground)]"
                      placeholder="Title (e.g., Our Mission)"
                      required
                    />
                    <Textarea
                      value={item.description}
                      onChange={(e) => handleMissionChange(item.id, 'description', e.target.value)}
                      className="bg-[var(--color-input)] border-[var(--color-border)] text-[var(--color-foreground)] placeholder-[var(--color-muted-foreground)] min-h-[100px]"
                      placeholder="Mission description"
                      required
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* WHAT WE BELIEVE */}
          <TabsContent value="beliefs" className="space-y-6 mt-6">
            <Card className="bg-[var(--color-card)] border-[var(--color-border)]">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-[var(--color-foreground)]">What We Believe</CardTitle>
                  <CardDescription className="text-[var(--color-muted-foreground)]">Manage company values and beliefs</CardDescription>
                </div>
                <Button onClick={addBelief} size="sm" className="bg-amber-600 hover:bg-amber-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Belief
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <label className="text-sm font-medium text-[var(--color-muted-foreground)]">Section Title</label>
                <Input
                  value={sections.whatWeBelieveTitle ?? ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSections(prev => ({ ...prev, whatWeBelieveTitle: e.target.value }))}
                  className="mt-2 bg-[var(--color-input)] border-[var(--color-border)] text-[var(--color-foreground)] placeholder-[var(--color-muted-foreground)]"
                  placeholder="Section title (e.g., What We Believe)"
                />
                {sections.whatWeBelieve.map((item) => (
                  <div key={item.id} className="p-4 bg-[var(--color-card)] rounded-lg space-y-3 border border-[var(--color-border)]">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <Input
                            value={item.icon}
                            onChange={(e) => handleBeliefChange(item.id, 'icon', e.target.value)}
                            className="bg-[var(--color-input)] border-[var(--color-border)] text-[var(--color-foreground)] placeholder-[var(--color-muted-foreground)]"
                            placeholder="Icon emoji"
                            maxLength={2}
                            required
                          />
                          <Input
                            value={item.title}
                            onChange={(e) => handleBeliefChange(item.id, 'title', e.target.value)}
                            className="bg-[var(--color-input)] border-[var(--color-border)] text-[var(--color-foreground)] placeholder-[var(--color-muted-foreground)]"
                            placeholder="Belief title"
                            required
                          />
                        </div>
                        <Textarea
                          value={item.description}
                          onChange={(e) => handleBeliefChange(item.id, 'description', e.target.value)}
                          className="bg-[var(--color-input)] border-[var(--color-border)] text-[var(--color-foreground)] placeholder-[var(--color-muted-foreground)] min-h-[70px]"
                          placeholder="Belief description"
                          required
                        />
                      </div>
                      <Button
                        onClick={() => deleteBelief(item.id)}
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

          {/* OC METHOD */}
          <TabsContent value="method" className="space-y-6 mt-6">
            <Card className=" flex flex-col  justify-center bg-[var(--color-card)] border-[var(--color-border)]">
              <CardHeader className="flex flex-row items-center  justify-between">
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
                  value={sections.sustainabilityTitle ?? ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSections(prev => ({ ...prev, sustainabilityTitle: e.target.value }))}
                  className="mt-2 bg-[var(--color-input)] border-[var(--color-border)] text-[var(--color-foreground)] placeholder-[var(--color-muted-foreground)]"
                  placeholder="Section title (e.g., Sustainability)"
                />
                {sections.theOcMethod.map((item) => (
                  <div key={item.id} className="p-4 bg-[var(--color-card)] rounded-lg space-y-3 border border-[var(--color-border)]">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 space-y-3">
                        <div className="grid grid-cols-3 gap-3">
                          <Input
                            value={item.number}
                            onChange={(e) => handleMethodChange(item.id, 'number', e.target.value)}
                            className="bg-[var(--color-input)] border-[var(--color-border)] text-[var(--color-foreground)] placeholder-[var(--color-muted-foreground)]"
                            placeholder="Number (01-06)"
                            required
                          />
                          <Input
                            value={item.title}
                            onChange={(e) => handleMethodChange(item.id, 'title', e.target.value)}
                            className="bg-[var(--color-input)] border-[var(--color-border)] text-[var(--color-foreground)] placeholder-[var(--color-muted-foreground)] col-span-2"
                            placeholder="Step title"
                            required
                          />
                        </div>
                        <Textarea
                          value={item.description}
                          onChange={(e) => handleMethodChange(item.id, 'description', e.target.value)}
                          className="bg-[var(--color-input)] border-[var(--color-border)] text-[var(--color-foreground)] placeholder-[var(--color-muted-foreground)] min-h-[70px]"
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
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSections(prev => ({ ...prev, sustainabilityTitle: e.target.value }))}
                  className="mt-2 bg-[var(--color-input)] border-[var(--color-border)] text-[var(--color-foreground)] placeholder-[var(--color-muted-foreground)]"
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
                            className="bg-[var(--color-input)] border-[var(--color-border)] text-[var(--color-foreground)] placeholder-[var(--color-muted-foreground)]"
                            placeholder="Icon emoji"
                            maxLength={2}
                            required
                          />
                          <Input
                            value={item.title}
                            onChange={(e) => handleSustainabilityChange(item.id, 'title', e.target.value)}
                            className="bg-[var(--color-input)] border-[var(--color-border)] text-[var(--color-foreground)] placeholder-[var(--color-muted-foreground)]"
                            placeholder="Initiative title"
                            required
                          />
                        </div>
                        <Textarea
                          value={item.description}
                          onChange={(e) => handleSustainabilityChange(item.id, 'description', e.target.value)}
                          className="bg-[var(--color-input)] border-[var(--color-border)] text-[var(--color-foreground)] placeholder-[var(--color-muted-foreground)] min-h-[70px]"
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
            <Card className="bg-[var(--color-card)] border-[var(--color-border)]">
              <CardHeader>
                <CardTitle className="text-[var(--color-foreground)]">Technology & Tools</CardTitle>
                <CardDescription className="text-[var(--color-muted-foreground)]">Manage technology section</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <label className="text-sm font-medium text-[var(--color-muted-foreground)]">Technology Items</label>
                  <Button onClick={addTechnologyItem} size="sm" className="bg-amber-600 hover:bg-amber-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Technology Item
                  </Button>
                </div>

                {sections.technology.map((tech) => (
                  <div key={tech.id} className="p-4 bg-[var(--color-card)] rounded-lg space-y-3 border border-[var(--color-border)]">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 space-y-3">
                        <div className="grid grid-cols-3 gap-3">
                          <Input
                            value={tech.icon}
                            onChange={(e) => handleTechnologyItemChange(tech.id, 'icon', e.target.value)}
                            className="bg-[var(--color-input)] border-[var(--color-border)] text-[var(--color-foreground)] placeholder-[var(--color-muted-foreground)]"
                            placeholder="Icon emoji"
                            maxLength={2}
                          />
                          <Input
                            value={tech.title}
                            onChange={(e) => handleTechnologyItemChange(tech.id, 'title', e.target.value)}
                            className="bg-[var(--color-input)] border-[var(--color-border)] text-[var(--color-foreground)] placeholder-[var(--color-muted-foreground)] col-span-2"
                            placeholder="Title"
                          />
                        </div>

                        <Textarea
                          value={tech.description}
                          onChange={(e) => handleTechnologyItemChange(tech.id, 'description', e.target.value)}
                          className="bg-[var(--color-input)] border-[var(--color-border)] text-[var(--color-foreground)] placeholder-[var(--color-muted-foreground)] min-h-[80px]"
                          placeholder="Description"
                        />

                        <div className="pt-4 border-t border-[var(--color-border)]">
                          <div className="flex justify-between items-center mb-4">
                            <label className="text-sm font-medium text-[var(--color-muted-foreground)]">Key Points</label>
                            <Button onClick={() => addTechnologyPoint(tech.id)} size="sm" className="bg-amber-600 hover:bg-amber-700">
                              <Plus className="w-4 h-4 mr-2" />
                              Add Point
                            </Button>
                          </div>

                          <div className="space-y-3">
                            {(tech.points ?? []).map((pt) => (
                              <div key={pt.id} className="flex justify-between items-start gap-3 p-3 bg-[var(--color-card)] rounded-lg border border-[var(--color-border)]">
                                <Input
                                  value={pt.point}
                                  onChange={(e) => handleTechnologyPointChange(tech.id, pt.id, e.target.value)}
                                  className="flex-1 bg-[var(--color-input)] border-[var(--color-border)] text-[var(--color-foreground)] placeholder-[var(--color-muted-foreground)]"
                                  placeholder="Key point"
                                  required
                                />
                                <Button
                                  onClick={() => deleteTechnologyPoint(tech.id, pt.id)}
                                  size="sm"
                                  variant="destructive"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="ml-3">
                        <Button onClick={() => deleteTechnologyItem(tech.id)} size="sm" variant="destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* BUDGETS & TIMELINES */}
          <TabsContent value="budgets" className="space-y-6 mt-6">
            <Card className="bg-[var(--color-card)] border-[var(--color-border)]">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-[var(--color-foreground)]">Budgets & Timelines</CardTitle>
                  <CardDescription className="text-[var(--color-muted-foreground)]">Manage budget packages</CardDescription>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                  <label className="text-sm font-medium text-[var(--color-muted-foreground)]">Section Title</label>
                <Input
                  value={sections.budgetsTitle ?? ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSections(prev => ({ ...prev, budgetsTitle: e.target.value }))}
                  className="mt-2 bg-[var(--color-input)] border-[var(--color-border)] text-[var(--color-foreground)] placeholder-[var(--color-muted-foreground)]"
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
                            className="bg-[var(--color-input)] border-[var(--color-border)] text-[var(--color-foreground)] placeholder-[var(--color-muted-foreground)]"
                            placeholder="Icon emoji"
                            maxLength={2}
                            required
                          />
                          <Input
                            value={item.title}
                            onChange={(e) => handleBudgetChange(item.id, 'title', e.target.value)}
                            className="bg-[var(--color-input)] border-[var(--color-border)] text-[var(--color-foreground)] placeholder-[var(--color-muted-foreground)]"
                            placeholder="Package title"
                            required
                          />
                        </div>
                        <Textarea
                          value={item.description}
                          onChange={(e) => handleBudgetChange(item.id, 'description', e.target.value)}
                          className="bg-[var(--color-input)] border-[var(--color-border)] text-[var(--color-foreground)] placeholder-[var(--color-muted-foreground)] min-h-[70px]"
                          placeholder="Package description (short)"
                          required
                        />
                        <Textarea
                          value={item.details}
                          onChange={(e) => handleBudgetChange(item.id, 'details', e.target.value)}
                          className="bg-[var(--color-input)] border-[var(--color-border)] text-[var(--color-foreground)] placeholder-[var(--color-muted-foreground)] min-h-[70px]"
                          placeholder="Package details (full description)"
                          required
                        />
                      </div>
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

