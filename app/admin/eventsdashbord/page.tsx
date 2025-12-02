"use client";
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Plus, Trash2, Save } from 'lucide-react';

// Types for sections
interface Hero {
  title: string;
  subtitle: string;
  image: string;
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
  description: string;
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
  const [sections, setSections] = useState<Sections>({
    hero: {
      title: 'Magical Birthday Events',
      subtitle: 'From sunset rooftop cocktails in Sutters to a candle-lit private dinner in Rosario, we curate birthday celebrations that feel entirely bespoke. From spontaneity you think. Entertainment, lasting real-time catering, Chip pages for speeches, and photography that look.',
      image: 'https://images.unsplash.com/photo-1519671482677-504be0ffec60?w=600&h=400'
    },
    services: [
      { id: 1, icon: '📍', title: 'Venue Sourcing', description: 'Rooftops, waterfront spaces, private villas, hidden gems (Gold Coast & surrounds)' },
      { id: 2, icon: '🎂', title: 'Catering', description: 'Catering cakes, chef stations, all-seven cuisines, late-night snacks.' },
      { id: 3, icon: '🎵', title: 'Audio & Visuals', description: 'DJs, repeat mixes, ambient lighting, LED moments, live performers.' },
      { id: 4, icon: '✨', title: 'Style & Design', description: 'Concepting, mood boards, tablescapes, signage, lighting, ice-sculptures.' },
      { id: 5, icon: '🌸', title: 'Floral & Decor', description: 'Creative table arrangements, sculptural pieces, photo-worthy backdrops.' },
      { id: 6, icon: '📸', title: 'Photography', description: 'Documentary-style coverage, portrait will-outs, highlight reels.' }
    ],
    concepts: [
      { id: 1, icon: '⚜️', title: 'Golden Hour Rooftop', description: 'Sunset celebration with premium drinks' },
      { id: 2, icon: '🍽️', title: 'Private Villa Dinner', description: 'Exclusive fine dining experience' },
      { id: 3, icon: '🍸', title: 'After-Dark Lounge', description: 'Late night celebration venue' }
    ],
    timeline: [
      { id: 1, step: '1', title: 'Arrival & Drinks', description: 'Guests arrive, welcome drinks served' },
      { id: 2, step: '2', title: 'Welcome Toast', description: 'Host opens celebration moment' },
      { id: 3, step: '3', title: 'Dance Floor', description: 'Music and dancing for guests' }
    ],
    faqs: [
      { id: 1, question: 'How far in advance should I book?', answer: 'We recommend booking 6-8 weeks in advance to ensure availability.' },
      { id: 2, question: 'Do you organise cakes and entertainment?', answer: 'Yes, we coordinate all entertainment and catering elements.' },
      { id: 3, question: 'Can you work in my home or Airbnb?', answer: 'Absolutely, we work at private residences and Airbnb properties.' },
      { id: 4, question: 'What about noise and neighbours?', answer: 'We manage noise levels and coordinate with neighbors in advance.' },
      { id: 5, question: 'Can I add a surprise element?', answer: 'Yes, we love creating surprise moments for birthday celebrants.' },
      { id: 6, question: 'Do you provide bar service?', answer: 'Yes, we provide full bar service with professional bartenders.' },
      { id: 7, question: 'What happens if it rains?', answer: 'We have contingency plans and backup indoor venues available.' },
      { id: 8, question: 'Accessibility considerations?', answer: 'We ensure all venues and services are accessible to all guests.' }
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
      concepts: [...prev.concepts, { id: Date.now(), icon: '✨', title: '', description: '' }]
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

  const handleSubmit = async () => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/birthday/update', {
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
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Birthday Events - Admin Dashboard</h1>
          <p className="text-gray-400">Events of the Century - Birthday Content Management</p>
        </div>

        <div>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-6 bg-gray-900 border border-gray-700">
              <TabsTrigger value="hero">Hero</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="concepts">Concepts</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="faqs">FAQs</TabsTrigger>
            </TabsList>

            {/* HERO SECTION */}
            <TabsContent value="hero" className="space-y-6 mt-6">
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Hero Section</CardTitle>
                  <CardDescription className="text-gray-400">Edit main headline and introduction</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-200">Main Title</label>
                    <Input
                      value={sections.hero.title}
                      onChange={(e) => handleHeroChange('title', e.target.value)}
                      className="mt-2 bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                      placeholder="Main title"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-200">Subtitle/Description</label>
                    <Textarea
                      value={sections.hero.subtitle}
                      onChange={(e) => handleHeroChange('subtitle', e.target.value)}
                      className="mt-2 bg-gray-800 border-gray-700 text-white placeholder-gray-500 min-h-[120px]"
                      placeholder="Hero subtitle"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-200">Hero Image URL</label>
                    <Input
                      value={sections.hero.image}
                      onChange={(e) => handleHeroChange('image', e.target.value)}
                      className="mt-2 bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                      placeholder="Image URL"
                      required
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* SERVICES SECTION */}
            <TabsContent value="services" className="space-y-6 mt-6">
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-white">What We Handle</CardTitle>
                    <CardDescription className="text-gray-400">Manage birthday event services</CardDescription>
                  </div>
                  <Button onClick={addService} size="sm" className="bg-amber-600 hover:bg-amber-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Service
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {sections.services.map((item) => (
                    <div key={item.id} className="p-4 bg-gray-800 rounded-lg space-y-3 border border-gray-700">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <Input
                              value={item.icon}
                              onChange={(e) => handleServicesChange(item.id, 'icon', e.target.value)}
                              className="bg-gray-700 border-gray-600 text-white placeholder-gray-500"
                              placeholder="Icon emoji"
                              maxLength={2}
                              required
                            />
                            <Input
                              value={item.title}
                              onChange={(e) => handleServicesChange(item.id, 'title', e.target.value)}
                              className="bg-gray-700 border-gray-600 text-white placeholder-gray-500"
                              placeholder="Service title"
                              required
                            />
                          </div>
                          <Textarea
                            value={item.description}
                            onChange={(e) => handleServicesChange(item.id, 'description', e.target.value)}
                            className="bg-gray-700 border-gray-600 text-white placeholder-gray-500 min-h-[70px]"
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
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-white">Signature Birthday Concepts</CardTitle>
                    <CardDescription className="text-gray-400">Manage birthday event concepts</CardDescription>
                  </div>
                  <Button onClick={addConcept} size="sm" className="bg-amber-600 hover:bg-amber-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Concept
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {sections.concepts.map((item) => (
                    <div key={item.id} className="p-4 bg-gray-800 rounded-lg space-y-3 border border-gray-700">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <Input
                              value={item.icon}
                              onChange={(e) => handleConceptsChange(item.id, 'icon', e.target.value)}
                              className="bg-gray-700 border-gray-600 text-white placeholder-gray-500"
                              placeholder="Icon emoji"
                              maxLength={2}
                              required
                            />
                            <Input
                              value={item.title}
                              onChange={(e) => handleConceptsChange(item.id, 'title', e.target.value)}
                              className="bg-gray-700 border-gray-600 text-white placeholder-gray-500"
                              placeholder="Concept title"
                              required
                            />
                          </div>
                          <Textarea
                            value={item.description}
                            onChange={(e) => handleConceptsChange(item.id, 'description', e.target.value)}
                            className="bg-gray-700 border-gray-600 text-white placeholder-gray-500 min-h-[70px]"
                            placeholder="Concept description"
                            required
                          />
                        </div>
                        <Button
                          onClick={() => deleteConcept(item.id)}
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

            {/* TIMELINE SECTION */}
            <TabsContent value="timeline" className="space-y-6 mt-6">
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-white">Event Timeline</CardTitle>
                    <CardDescription className="text-gray-400">Manage event timeline steps</CardDescription>
                  </div>
                  <Button onClick={addTimeline} size="sm" className="bg-amber-600 hover:bg-amber-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Step
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {sections.timeline.map((item) => (
                    <div key={item.id} className="p-4 bg-gray-800 rounded-lg space-y-3 border border-gray-700">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 space-y-3">
                          <div className="grid grid-cols-3 gap-3">
                            <Input
                              value={item.step}
                              onChange={(e) => handleTimelineChange(item.id, 'step', e.target.value)}
                              className="bg-gray-700 border-gray-600 text-white placeholder-gray-500"
                              placeholder="Step number"
                              required
                            />
                            <Input
                              value={item.title}
                              onChange={(e) => handleTimelineChange(item.id, 'title', e.target.value)}
                              className="bg-gray-700 border-gray-600 text-white placeholder-gray-500 col-span-2"
                              placeholder="Step title"
                              required
                            />
                          </div>
                          <Textarea
                            value={item.description}
                            onChange={(e) => handleTimelineChange(item.id, 'description', e.target.value)}
                            className="bg-gray-700 border-gray-600 text-white placeholder-gray-500 min-h-[70px]"
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
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-white">FAQs</CardTitle>
                    <CardDescription className="text-gray-400">Manage frequently asked questions</CardDescription>
                  </div>
                  <Button onClick={addFaq} size="sm" className="bg-amber-600 hover:bg-amber-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add FAQ
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {sections.faqs.map((item) => (
                    <div key={item.id} className="p-4 bg-gray-800 rounded-lg space-y-3 border border-gray-700">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 space-y-3">
                          <Input
                            value={item.question}
                            onChange={(e) => handleFaqChange(item.id, 'question', e.target.value)}
                            className="bg-gray-700 border-gray-600 text-white placeholder-gray-500"
                            placeholder="Question"
                            required
                          />
                          <Textarea
                            value={item.answer}
                            onChange={(e) => handleFaqChange(item.id, 'answer', e.target.value)}
                            className="bg-gray-700 border-gray-600 text-white placeholder-gray-500 min-h-[80px]"
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