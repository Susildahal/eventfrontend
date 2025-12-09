"use client";
import React, { useState, Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Plus, Trash2, Save ,ArrowLeft } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import axiosInstance from '@/app/config/axiosInstance';
import {RefreshCcw} from 'lucide-react';
import { toast } from "react-hot-toast";
import { Spinner } from '@/components/ui/spinner';

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
interface ServiceTypeData { 
  _id?: string;
  id?: string | number;
  name: string;
  createdAt?: Date;
}

function ServicePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams?.get('id')
  console.log('query id:', id)
  const [sections, setSections] = useState<Sections>({
    hero: {
      title: '',
      mainTitle: '',
      subtitle: '',
      image: 'https://images.unsplash.com/photo-1519671482677-504be0ffec60?w=600&h=400',
      criteria: [
        { id: 1, label: '', description: '' },
       
      ]
    },
    beverageProgram: [
      { id: 1, icon: '', label: '', description: '' },

    ],
    addOns: [
      { id: 1, title: '', description: '' },
    
    ],
    timeline: [
      { id: 1, step: '1', title: '', duration: '' },

    ]
  });

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('hero');
  const [existingId, setExistingId] = useState<string | null>(null)
  const [data , setData] = useState<any>([])
  const [heroFile, setHeroFile] = useState<File | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement | null>(null)
  const previewUrl = React.useMemo(() => {
    if (heroFile) return URL.createObjectURL(heroFile)
    return sections.hero?.image || ''
  }, [heroFile, sections.hero?.image])

  React.useEffect(() => {
    // revoke object URL when heroFile changes/unmount
    return () => {
      if (heroFile) {
        try { URL.revokeObjectURL(previewUrl) } catch (e) { /* ignore */ }
      }
    }
  }, [heroFile, previewUrl])

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(`/servicetypes/${id}`);
        setData(response.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [id]);


  const handleHeroChange = (field: keyof Hero, value: string) => {
    setSections(prev => ({
      ...prev,
      hero: { ...prev.hero, [field]: value }
    }));
  };

  const handleHeroFileChange = (f: File | null) => {
    setHeroFile(f)
    // if a file is chosen, clear the URL field (but keep it if user clears file)
    if (f) {
      setSections(prev => ({ ...prev, hero: { ...prev.hero, image: '' } }))
    }
  }

  const handleCriteriaChange = (id: number, field: keyof CriteriaItem, value: string) => {
    setSections(prev => ({
      ...prev,
      hero: {
        ...prev.hero,
        criteria: prev.hero?.criteria.map(item =>
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
      const apiPath = '/api/servicedashboard'
      // include the selected service-type id in the payload so backend can associate
      const bodyToSend: any = { ...sections }
      if (id) bodyToSend.serviceid = { id }

      // If user picked a local file, send multipart/form-data with JSON payload in 'data' key
      let res: Response
      if (heroFile) {
       
        const form = new FormData()
        const jsonPayload = { ...bodyToSend }
        if (jsonPayload?.hero) {
          const { image, ...restHero } = jsonPayload.hero
          jsonPayload.hero = restHero
        }
        form.append('data', JSON.stringify(jsonPayload))
        // append file under nested key 'hero.image' so backend receives binary
        form.append('hero.image', heroFile)

        res = await fetch(existingId ? `${apiPath}?id=${existingId}` : apiPath, {
          method: existingId ? 'PUT' : 'POST',
          body: form,
        })
      } else {
        res = await fetch(existingId ? `${apiPath}?id=${existingId}` : apiPath, {
          method: existingId ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bodyToSend),
        })
      }

      if (res.ok) {
       toast.success('Content saved successfully!');
        const data = await res.json().catch(() => null)
        // if backend returned created/updated resource with id, store it
        if (data && (data._id || data.id)) setExistingId(data._id || data.id)
      } else {
        const text = await res.text().catch(() => '')
        console.error('Save failed', res.status, text);
        toast.error('Error saving content..');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error submitting form.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch existing servicedashboard data on mount
  React.useEffect(() => {
    let mounted = true
    const controller = new AbortController()
    const load = async () => {
      try {
        let fetchUrl = '/api/servicedashboard'
        if (id) {
          fetchUrl = `/api/servicedashboard?serviceid=${encodeURIComponent(id)}`
        } else if (existingId) {
          fetchUrl = `/api/servicedashboard?id=${encodeURIComponent(existingId)}`
        }
        const res = await fetch(fetchUrl, { signal: controller.signal })
        if (!res.ok) return
        const data = await res.json()
       
      
        let payload: any = null
        if (Array.isArray(data)) {
          payload = data[0] ?? null
        } else if (data?.data !== undefined) {
          if (Array.isArray(data.data)) payload = data.data[0] ?? null
          else payload = data.data
        } else {
          payload = data
        }
        if (!mounted || !payload) return
        console.debug('servicedashboard payload:', payload)

       
        const heroFromPayload = payload.hero ?? payload
        const payloadCriteria = heroFromPayload?.criteria ?? payload.criteria ?? []

        setSections((prev) => {
          const mergedHero = { ...prev.hero, ...(heroFromPayload ?? {}) }
          // Ensure criteria is an array
          mergedHero.criteria = Array.isArray(payloadCriteria) ? payloadCriteria : prev.hero.criteria

          return {
            ...prev,
            hero: mergedHero,
            beverageProgram: payload.beverageProgram ?? prev.beverageProgram,
            addOns: payload.addOns ?? prev.addOns,
            timeline: payload.timeline ?? prev.timeline,
          }
        })

        // Determine existing id (top-level or inside heroFromPayload)
        setExistingId(payload._id || payload.id || heroFromPayload._id || heroFromPayload.id || null)
      } catch (e) {
        if ((e as any)?.name === 'AbortError') return
        console.error('Failed to load servicedashboard', e)
      }
    }
    // reset existingId when id changes so we fetch the right record
    if (id) setExistingId(null)
    load()
    return () => {
      mounted = false
      controller.abort()
    }
  }, [id])

  if(loading){
    return(
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className="w-12 h-12  " />
      </div>
    ) 
  }

  return (
    <div className="min-h-screen ">
      <div className=" ">
        <div className="mb-8 flex justify-between items-center">
          <div className=' flex items-center gap-4'>
            <ArrowLeft className='h-5 w-5 cursor-pointer mb-2' onClick={() => router.back()} />
              <div className=' flex flex-col'>
          <h1 className="text-2xl font-bold mb-2 capitalize">{data.name || 'NA'}</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage the content of the {data.name || 'NA'} - Content Management</p><span className=''> </span>
          </div>
          </div>

          <div>  <RefreshCcw height={20} className='cursor-pointer'  onClick={()=>{window.location.reload()}} width={20}/></div>
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
                    <div className="mt-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Hero Image</label>
                      <div className="mt-2 flex items-start gap-4">
                        <div className="w-48 h-32 rounded-md border border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex items-center justify-center overflow-hidden relative">
                          {previewUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={previewUrl} alt="Hero preview" className="w-full h-full object-cover" />
                          ) : (
                            <div className="text-center p-2 text-sm text-gray-500">No image</div>
                          )}
                          {heroFile && (
                            <Button
                              size="sm"
                              value="hero-file"
                              variant="destructive"
                              onClick={() => {
                                handleHeroFileChange(null)
                                // keep previous URL blank
                                if (fileInputRef.current) fileInputRef.current.value = ''
                              }}
                              className="absolute top-2 right-2"
                            >
                              Remove
                            </Button>
                          )}
                        </div>

                        <div className="flex flex-col gap-2">
                          <input
                            ref={fileInputRef}
                            id="hero-file"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleHeroFileChange(e.target.files?.[0] ?? null)}
                          />
                          <Button onClick={() => fileInputRef.current?.click()} className="bg-amber-600 hover:bg-amber-700 text-white" value="hero-file">
                            Choose Image
                          </Button>
                          <p className="text-xs text-gray-500">Or paste an image URL above</p>
                          {heroFile && <p className="text-sm text-gray-600 dark:text-gray-400">Selected: {heroFile.name}</p>}
                        </div>
                      </div>
                    </div>
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
                  {(sections.hero?.criteria ?? []).map((item) => (
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
                  {(sections.beverageProgram ?? []).map((item) => (
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
                  {(sections.addOns ?? []).map((item) => (
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
                  {(sections.timeline ?? []).map((item) => (
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

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ServicePage />
    </Suspense>
  );
}