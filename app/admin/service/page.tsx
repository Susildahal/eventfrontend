"use client";
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Plus, Trash2, Save } from 'lucide-react';

// Types
interface CriteriaItem {
  id: number;
  label: string;
  description: string;
}

interface Hero {
  mainTitle: string;
  title: string;
  subtitle: string;
  image: string;
  criteria: CriteriaItem[];
}

interface BeverageItem {
  id: number;
  icon: string;
  label: string;
  description: string;
}

interface AddOnItem {
  id: number;
  title: string;
  description: string;
}

interface TimelineItem {
  id: number;
  step: string;
  title: string;
  duration: string;
}

interface Sections {
  hero: Hero;
  beverageProgram: BeverageItem[];
  addOns: AddOnItem[];
  timeline: TimelineItem[];
}

export default function Page () {
  const [sections, setSections] = useState<Sections>({
    hero: {
      title: 'Venue Sourcing Made Effortless',
      mainTitle: 'Venue Sourcing Made Effortless',
      subtitle: 'From waterfront rooftops and private villas to galleries, warehouses, and resort ballrooms, we source venues that match your brief, budget, and vibe—then negotiate the best terms and iron-clad logistics so bump-to-bump-out runs smooth.',
      image: 'https://images.unsplash.com/photo-1519671482677-504be0ffec60?w=600&h=400',
      criteria: [
        { id: 1, label: 'Hard Criteria', description: 'Guest count, formal (cocktail/buffet, accessibility, noise limits, technical requirements' },
        { id: 2, label: 'Curated Shortlist', description: 'Location ideas, venue specs, capacities, floor plans, photos, imagery' },
        { id: 3, label: 'Site Visits & Holds', description: 'Hosted walk-throughs, soft holds on preferred dates, options on spaces' },
        { id: 4, label: 'Layout & Flow', description: 'Draft floor plans, guest journey, bars, signage, accessible seating, green rooms' }
      ]
    },
    beverageProgram: [
      { id: 1, icon: '🏢', label: 'Rooftops', description: 'High-altitude venue with stunning city views' },
      { id: 2, icon: '🏖️', label: 'Beach clubs & lawn terraces', description: 'Open-air seaside and garden spaces' },
      { id: 3, icon: '🏠', label: 'Private homes/villas', description: 'Exclusive residential properties' },
      { id: 4, icon: '🛍️', label: 'Boutique bars', description: 'Intimate upscale bar venues' },
      { id: 5, icon: '🎨', label: 'Galleries & studios', description: 'Creative artistic spaces' },
      { id: 6, icon: '🏭', label: 'Warehouses', description: 'Industrial loft spaces' },
      { id: 7, icon: '🏨', label: 'Hotel ballrooms', description: 'Professional hotel event spaces' },
      { id: 8, icon: '🌳', label: 'Garden estates', description: 'Outdoor garden venues' }
    ],
    addOns: [
      { id: 1, title: 'Guest transfers & valet', description: 'Seamless guest arrivals with premium transfers' },
      { id: 2, title: 'Accommodation blocks', description: 'Curated stays for comfort and convenience' },
      { id: 3, title: 'Security & crowd flow', description: 'Discrete, professional and perfectly coordinated' },
      { id: 4, title: 'Wayfinding signage', description: 'Elegant direction options designed for clarity' },
      { id: 5, title: 'Cloak & green rooms', description: 'Thoughtfully crafted for comfort and ease' }
    ],
    timeline: [
      { id: 1, step: '1', title: 'Discovery', duration: '48 hrs' },
      { id: 2, step: '2', title: 'Shortlist', duration: '3-5 days' },
      { id: 3, step: '3', title: 'Site Tours & Holds', duration: '1 week' },
      { id: 4, step: '4', title: 'Contracting', duration: '2-5 days' },
      { id: 5, step: '5', title: 'Floor Plan & Run Sheet', duration: '1-2 weeks' }
    ]
  });

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('hero');

  const handleHeroChange = (field: keyof Hero, value: string) => {
    setSections(prev => ({
      ...prev,
      hero: { ...prev.hero, [field]: value }
    }));
  };

  const handleCriteriaChange = (id: number, field: keyof CriteriaItem, value: string) => {
    setSections(prev => ({
      ...prev,
      hero: {
        ...prev.hero,
        criteria: prev.hero.criteria.map(item =>
          item.id === id ? { ...item, [field]: value } : item
        )
      }
    }));
  };

  const addCriteria = () => {
    setSections(prev => ({
      ...prev,
      hero: {
        ...prev.hero,
        criteria: [...prev.hero.criteria, { id: Date.now(), label: '', description: '' }]
      }
    }));
  };

  const deleteCriteria = (id: number) => {
    setSections(prev => ({
      ...prev,
      hero: {
        ...prev.hero,
        criteria: prev.hero.criteria.filter(item => item.id !== id)
      }
    }));
  };

  const handleBeverageChange = (id: number, field: keyof BeverageItem, value: string) => {
    setSections(prev => ({
      ...prev,
      beverageProgram: prev.beverageProgram.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  const addBeverageItem = () => {
    setSections(prev => ({
      ...prev,
      beverageProgram: [...prev.beverageProgram, { id: Date.now(), icon: '📌', label: '', description: '' }]
    }));
  };

  const deleteBeverageItem = (id: number) => {
    setSections(prev => ({
      ...prev,
      beverageProgram: prev.beverageProgram.filter(item => item.id !== id)
    }));
  };

  const handleAddOnChange = (id: number, field: keyof AddOnItem, value: string) => {
    setSections(prev => ({
      ...prev,
      addOns: prev.addOns.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  const addAddOnItem = () => {
    setSections(prev => ({
      ...prev,
      addOns: [...prev.addOns, { id: Date.now(), title: '', description: '' }]
    }));
  };

  const deleteAddOnItem = (id: number) => {
    setSections(prev => ({
      ...prev,
      addOns: prev.addOns.filter(item => item.id !== id)
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

  const addTimelineItem = () => {
    setSections(prev => ({
      ...prev,
      timeline: [...prev.timeline, { id: Date.now(), step: '', title: '', duration: '' }]
    }));
  };

  const deleteTimelineItem = (id: number) => {
    setSections(prev => ({
      ...prev,
      timeline: prev.timeline.filter(item => item.id !== id)
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    try {
      // Replace with your actual API endpoint
      const response = await fetch('/api/content/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sections)
      });

      if (response.ok) {
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

  return (
    <div className="min-h-screen p-8 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Events of the Century - Content Management</p>
        </div>

        <div>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
              <TabsTrigger value="hero">Hero</TabsTrigger>
              <TabsTrigger value="criteria">Criteria</TabsTrigger>
              <TabsTrigger value="beverage">Beverage Program</TabsTrigger>
              <TabsTrigger value="addons">Add-Ons</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
            </TabsList>

            {/* HERO SECTION */}
            <TabsContent value="hero" className="space-y-6 mt-6">
              <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white">Hero Section</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">Edit main headline and introduction</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">

                       <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-200">  Main Title</label>
                    <Input
                      value={sections.hero.mainTitle}
                      onChange={(e) => handleHeroChange('mainTitle', e.target.value)}
                      className="mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
                      placeholder="Main title"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-200"> Title</label>
                    <Input
                      value={sections.hero.title}
                      onChange={(e) => handleHeroChange('title', e.target.value)}
                      className="mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
                      placeholder="Main title"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Subtitle/Description</label>
                    <Textarea
                      value={sections.hero.subtitle}
                      onChange={(e) => handleHeroChange('subtitle', e.target.value)}
                      className="mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-500 min-h-[120px]"
                      placeholder="Hero subtitle"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Hero Image URL</label>
                    <Input
                      value={sections.hero.image}
                      onChange={(e) => handleHeroChange('image', e.target.value)}
                      className="mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
                      placeholder="Image URL"
                      required
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* CRITERIA SECTION */}
            <TabsContent value="criteria" className="space-y-6 mt-6">
              <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-gray-900 dark:text-white">Criteria Items</CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">Manage hard criteria and process steps</CardDescription>
                  </div>
                  <Button onClick={addCriteria} size="sm" className="bg-amber-600 hover:bg-amber-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Item
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {sections.hero.criteria.map((item) => (
                    <div key={item.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-3 border border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 space-y-3">
                          <Input
                            value={item.label}
                            onChange={(e) => handleCriteriaChange(item.id, 'label', e.target.value)}
                            className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500"
                            placeholder="Label"
                            required
                          />
                          <Textarea
                            value={item.description}
                            onChange={(e) => handleCriteriaChange(item.id, 'description', e.target.value)}
                            className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 min-h-[80px]"
                            placeholder="Description"
                            required
                          />
                        </div>
                        <Button
                          onClick={() => deleteCriteria(item.id)}
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

            {/* BEVERAGE PROGRAM */}
            <TabsContent value="beverage" className="space-y-6 mt-6">
              <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-gray-900 dark:text-white">Beverage Program Venues</CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">Manage venue types in beverage program</CardDescription>
                  </div>
                  <Button onClick={addBeverageItem} size="sm" className="bg-amber-600 hover:bg-amber-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Venue
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {sections.beverageProgram.map((item) => (
                    <div key={item.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-3 border border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <Input
                              value={item.icon}
                              onChange={(e) => handleBeverageChange(item.id, 'icon', e.target.value)}
                              className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500"
                              placeholder="Icon emoji"
                              maxLength={2}
                              required
                            />
                            <Input
                              value={item.label}
                              onChange={(e) => handleBeverageChange(item.id, 'label', e.target.value)}
                              className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500"
                              placeholder="Venue label"
                              required
                            />
                          </div>
                          <Textarea
                            value={item.description}
                            onChange={(e) => handleBeverageChange(item.id, 'description', e.target.value)}
                            className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 min-h-[70px]"
                            placeholder="Description"
                            required
                          />
                        </div>
                        <Button
                          onClick={() => deleteBeverageItem(item.id)}
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

            {/* ADD-ONS */}
            <TabsContent value="addons" className="space-y-6 mt-6">
              <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-gray-900 dark:text-white">Add-On Services</CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">Manage additional event services</CardDescription>
                  </div>
                  <Button onClick={addAddOnItem} size="sm" className="bg-amber-600 hover:bg-amber-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Service
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {sections.addOns.map((item) => (
                    <div key={item.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-3 border border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 space-y-3">
                          <Input
                            value={item.title}
                            onChange={(e) => handleAddOnChange(item.id, 'title', e.target.value)}
                            className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500"
                            placeholder="Service title"
                            required
                          />
                          <Textarea
                            value={item.description}
                            onChange={(e) => handleAddOnChange(item.id, 'description', e.target.value)}
                            className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 min-h-[70px]"
                            placeholder="Service description"
                            required
                          />
                        </div>
                        <Button
                          onClick={() => deleteAddOnItem(item.id)}
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

            {/* TIMELINE */}
            <TabsContent value="timeline" className="space-y-6 mt-6">
              <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-gray-900 dark:text-white">Process Timeline</CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">Manage typical timeline steps</CardDescription>
                  </div>
                  <Button onClick={addTimelineItem} size="sm" className="bg-amber-600 hover:bg-amber-700">
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
                          <Input
                            value={item.duration}
                            onChange={(e) => handleTimelineChange(item.id, 'duration', e.target.value)}
                            className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500"
                            placeholder="Duration (e.g., 48 hrs)"
                            required
                          />
                        </div>
                        <Button
                          onClick={() => deleteTimelineItem(item.id)}
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