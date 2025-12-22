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
interface Sections {
  hero: Hero;
 
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

  });

  const [loading, setLoading] = useState(false);
  const [existingId, setExistingId] = useState<string | null>(null)
  const [data , setData] = useState<any>([])
  const [heroFile, setHeroFile] = useState<File | null>(null)
  const [activeTab, setActiveTab] = useState<string>('hero');
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

  // --- Criteria Management Functions ---
  const addCriteria = () => {
    setSections(prev => ({
      ...prev,
      hero: {
        ...prev.hero,
        criteria: [
          ...prev.hero.criteria,
          {
            id:
              prev.hero.criteria.length > 0
                ? Math.max(...prev.hero.criteria.map((c) => c.id)) + 1
                : 1,
            label: '',
            description: '',
          },
        ],
      },
    }));
  };

  const handleCriteriaChange = (id: number, field: 'label' | 'description', value: string) => {
    setSections(prev => ({
      ...prev,
      hero: {
        ...prev.hero,
        criteria: prev.hero.criteria.map((item) =>
          item.id === id ? { ...item, [field]: value } : item
        ),
      },
    }));
  };

  const deleteCriteria = (id: number) => {
    setSections(prev => ({
      ...prev,
      hero: {
        ...prev.hero,
        criteria: prev.hero.criteria.filter((item) => item.id !== id),
      },
    }));
  };


  const handleSubmit = async () => {
    setLoading(true);
    try {
      const apiPath = '/servicedashboard'
      const bodyToSend: any = { ...sections }
      if (id) {
        bodyToSend.serviceid = { 
          id: id,
          name: data?.name || ''
        }
      }

      // If user picked a local file, send multipart/form-data with JSON payload in 'data' key
      let res
      if (heroFile) {

        const form = new FormData()
        // Append hero fields individually so backend can parse multipart fields
        if (bodyToSend?.hero) {
          const heroPayload = bodyToSend.hero
          form.append('hero[mainTitle]', heroPayload.mainTitle || '')
          form.append('hero[title]', heroPayload.title || '')
          form.append('hero[subtitle]', heroPayload.subtitle || '')
          // criteria is an array; send as JSON string
          try {
            form.append('hero[criteria]', JSON.stringify(heroPayload.criteria || []))
          } catch (e) {
            form.append('hero[criteria]', '[]')
          }
        }

        // Append service id and name
        if (bodyToSend?.serviceid) {
          form.append('serviceid[id]', String(bodyToSend.serviceid.id || ''))
          form.append('serviceid[name]', String(bodyToSend.serviceid.name || ''))
        }

        // Append any other top-level keys as JSON under `data` (optional)
        const topLevel = { ...bodyToSend }
        delete topLevel.hero
        delete topLevel.serviceid
        form.append('data', JSON.stringify(topLevel))

        // append file under bracket-style key so backend receives binary like other pages
        form.append('hero[image]', heroFile, heroFile.name)

        if (existingId) {
          res = await axiosInstance.put(`${apiPath}/${existingId}`, form, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
        } else {
          res = await axiosInstance.post(apiPath, form, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
        }
      } else {
        if (existingId) {
          res = await axiosInstance.put(`${apiPath}/${existingId}`, bodyToSend, {
            headers: { 'Content-Type': 'application/json' }
          })
        } else {
          res = await axiosInstance.post(apiPath, bodyToSend, {
            headers: { 'Content-Type': 'application/json' }
          })
        }
      }

      if (res.status >= 200 && res.status < 300) {
        const data = res.data
        // if backend returned created/updated resource with id, store it
        if (data && (data._id || data.id)) setExistingId(data._id || data.id)
      } else {
        console.error('Save failed', res.status, res.data);
      }
    } catch (error) {
      console.error('Error:', error);
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
        let fetchUrl = '/servicedashboard'
        if (id) {
          fetchUrl = `/servicedashboard?serviceid=${encodeURIComponent(id)}`
        } else if (existingId) {
          fetchUrl = `/servicedashboard?id=${encodeURIComponent(existingId)}`
        }
        const res = await axiosInstance.get(fetchUrl, { signal: controller.signal })
        const data = res.data
       
      
        let payload: any = null
        if (Array.isArray(data)) {
          payload = data[0] ?? null
        } else if (data?.data !== undefined) {
          if (Array.isArray(data.data)) payload = data.data[0] ?? null
          else payload = data.data
        } else {
          payload = data
        }
        
        if (!mounted) return;
        
        if (!payload) {
          // Reset to initial empty state if no data found
          setExistingId(null);
          setSections({
            hero: {
              title: '',
              mainTitle: '',
              subtitle: '',
              image: 'https://images.unsplash.com/photo-1519671482677-504be0ffec60?w=600&h=400',
              criteria: [
                { id: 1, label: '', description: '' },
              ]
            },
          });
          return;
        }
        
        console.debug('servicedashboard payload:', payload);

        const heroFromPayload = payload.hero ?? payload;
        const payloadCriteria = heroFromPayload?.criteria ?? payload.criteria ?? [];
        setSections((prev) => {
          const mergedHero = { ...prev.hero, ...(heroFromPayload ?? {}) };
          mergedHero.criteria = Array.isArray(payloadCriteria) ? payloadCriteria : prev.hero.criteria;
          return { ...prev, hero: mergedHero };
        });
        // Determine existing id (top-level or inside heroFromPayload)
        setExistingId(payload._id || payload.id || heroFromPayload._id || heroFromPayload.id || null);
      } catch (e) {
        if ((e as any)?.name === 'AbortError') return;
        console.error('Failed to load servicedashboard', e);
        // Reset to initial empty state on error
        if (mounted) {
          setExistingId(null);
          setSections({
            hero: {
              title: '',
              mainTitle: '',
              subtitle: '',
              image: 'https://images.unsplash.com/photo-1519671482677-504be0ffec60?w=600&h=400',
              criteria: [
                { id: 1, label: '', description: '' },
              ]
            },
          });
        }
      }
    };
    // reset existingId when id changes so we fetch the right record
    if (id) setExistingId(null);
    load();
    return () => {
      mounted = false;
      controller.abort();
    };
  }, [id]);

  // if(loading){
  //   return(
  //     <div className="flex items-center justify-center min-h-screen">
  //       <Spinner className="w-12 h-12  " />
  //     </div>
  //   ) 
  // }

  return (
    <div className="min-h-screen ">
      <div className=" ">
        <div className="mb-8 flex justify-between items-center">
          <div className=' flex items-center gap-4'>
            <ArrowLeft className='h-5 w-5 cursor-pointer mb-2 text-[#7A5E39]' onClick={() => router.back()} />
              <div className=' flex flex-col'>
          <h1 className="text-2xl font-bold mb-2 capitalize">{data.name || 'NA'}</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage the content of the {data.name || 'NA'} - Content Management</p><span className=''> </span>
          </div>
          </div>

          <div>  <RefreshCcw height={20} className='cursor-pointer'  onClick={()=>{window.location.reload()}} width={20}/></div>
        </div>
  
        <div>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
              <TabsTrigger value="hero">Hero</TabsTrigger>
              <TabsTrigger value="criteria">Criteria</TabsTrigger>
            </TabsList>

            {/* HERO SECTION */}
            <TabsContent value="hero" className="space-y-6 mt-6">
              <div className=" p-4">
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
                      className="mt-2 placeholder-gray-500"
                      placeholder="Main title"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-200"> Title</label>
                    <Input
                      value={sections.hero.title}
                      onChange={(e) => handleHeroChange('title', e.target.value)}
                      className="mt-2  placeholder-gray-500"
                      placeholder="Main title"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Subtitle/Description</label>
                    <Textarea
                      value={sections.hero.subtitle}
                      onChange={(e) => handleHeroChange('subtitle', e.target.value)}
                      className="mt-2placeholder-gray-500 min-h-[120px]"
                      placeholder="Hero subtitle"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Hero Image URL</label>
                    <Input
                      value={sections.hero.image}
                      onChange={(e) => handleHeroChange('image', e.target.value)}
                      className="mt-2 placeholder-gray-500"
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
              </div>
            </TabsContent>

            {/* CRITERIA SECTION */}
            <TabsContent value="criteria" className="space-y-6 mt-6">
              <div className="">
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
                            className="placeholder-gray-500"
                            placeholder="Label"
                            required
                          />
                          <Textarea
                            value={item.description}
                            onChange={(e) => handleCriteriaChange(item.id, 'description', e.target.value)}
                            className="placeholder-gray-500 min-h-[80px]"
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
              </div>
            </TabsContent>

       

         

         
          </Tabs>

          <div className="mt-8 flex justify-end gap-4">
            <Button 
              onClick={handleSubmit} 
              disabled={loading}
              className=""
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