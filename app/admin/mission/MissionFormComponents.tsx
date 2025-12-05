'use client'
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2 } from 'lucide-react';
import type {
  HeroSection,
  HeroImage,
  MissionVisionItem,
  BeliefItem,

  TechnologyItem,

} from './types';

interface HeroFormProps {
  hero: HeroSection;
  onHeroChange: (field: keyof HeroSection, value: string) => void;
  onHeroImageChange: (id: number, value: string) => void;
  onAddHeroImage: () => void;
  onDeleteHeroImage: (id: number) => void;
}

// Extract image item to separate component to avoid hook violations
function HeroImageItem({
  img,

}: {
  img: HeroImage;
  idx: number;
  onHeroImageChange: (id: number, value: string) => void;
  onDeleteHeroImage: (id: number) => void;
}) {
  const previewUrl = img.url;

  return (
    <div className="p-4 bg-[var(--color-card)] rounded-lg space-y-3 border border-[var(--color-border)]">
     
    </div>
  );
}

export function HeroForm({
  hero,
  onHeroChange,
 
}: HeroFormProps) {
  return (
    <>
      <Card className="bg-[var(--color-card)] border-[var(--color-border)]">
        <CardHeader>
          <CardTitle className="text-[var(--color-foreground)]">Hero Section</CardTitle>
          <CardDescription className="text-[var(--color-muted-foreground)]">Edit about us hero content</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-[var(--color-muted-foreground)]">Section Title</label>
            <Input
              value={hero.title}
              onChange={(e) => onHeroChange('title', e.target.value)}
              className="mt-2 bg-[var(--color-input)] border-[var(--color-border)] text-[var(--color-foreground)] placeholder-[var(--color-muted-foreground)]"
              placeholder="Section title"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-[var(--color-muted-foreground)]">Main Title</label>
            <Input
              value={hero.mainTitle}
              onChange={(e) => onHeroChange('mainTitle', e.target.value)}
              className="mt-2 bg-[var(--color-input)] border-[var(--color-border)] text-[var(--color-foreground)] placeholder-[var(--color-muted-foreground)]"
              placeholder="Main title"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-[var(--color-muted-foreground)]">Description</label>
            <Textarea
              value={hero.description}
              onChange={(e) => onHeroChange('description', e.target.value)}
              className="mt-2 bg-[var(--color-input)] border-[var(--color-border)] text-[var(--color-foreground)] placeholder-[var(--color-muted-foreground)] min-h-[120px]"
              placeholder="Hero description"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-[var(--color-muted-foreground)]">CTA Button Text</label>
            <Input
              value={hero.cta}
              onChange={(e) => onHeroChange('cta', e.target.value)}
              className="mt-2 bg-[var(--color-input)] border-[var(--color-border)] text-[var(--color-foreground)] placeholder-[var(--color-muted-foreground)]"
              placeholder="CTA text"
              required
            />
          </div>
        </CardContent>
      </Card>

    
    </>
  );
}

interface MissionVisionFormProps {
  missionTitle?: string;
  missionDescription?: string;
  visionTitle?: string;
  visionDescription?: string;
  missionVision: MissionVisionItem[];
  onMissionChange: (id: number, field: keyof MissionVisionItem | 'description', value: string) => void;
  onSetMissionTitle: (value: string) => void;
  onSetMissionDescription: (value: string) => void;
  onSetVisionTitle?: (value: string) => void;
  onSetVisionDescription?: (value: string) => void;
}

export function MissionVisionForm({
  missionTitle,
  missionDescription,
  visionTitle,
  visionDescription,
  missionVision,
  onMissionChange,
  onSetMissionTitle,
  onSetMissionDescription
  , onSetVisionTitle, onSetVisionDescription
}: MissionVisionFormProps) {
  return (
    <Card className="bg-[var(--color-card)] border-[var(--color-border)]">
      <CardHeader>
        <CardTitle className="text-[var(--color-foreground)]">Mission & Vision</CardTitle>
        <CardDescription className="text-[var(--color-muted-foreground)]">Edit company mission statement</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium text-[var(--color-muted-foreground)]">Mission / Vision Title</label>
          <Input
            value={missionTitle}
            onChange={(e) => onSetMissionTitle(e.target.value)}
            className="mt-2 bg-[var(--color-input)] border-[var(--color-border)] text-[var(--color-foreground)] placeholder-[var(--color-muted-foreground)]"
            placeholder="Section title (e.g., Mission & Vision)"
          />
        </div>

   

        <div>
          <label className="text-sm font-medium text-[var(--color-muted-foreground)]">Mission  Text</label>
          <Textarea
            value={missionDescription}
            onChange={(e) => onSetMissionDescription(e.target.value)}
            className="mt-2 bg-[var(--color-input)] border-[var(--color-border)] text-[var(--color-foreground)] placeholder-[var(--color-muted-foreground)] min-h-[120px]"
            placeholder="Write the mission and vision here"
          />
        </div>
            <div>
              <label className="text-sm font-medium text-[var(--color-muted-foreground)]">Vision Text</label>
              <Textarea
                value={visionDescription}
                onChange={(e) => onSetVisionDescription?.(e.target.value)}
                className="mt-2 bg-[var(--color-input)] border-[var(--color-border)] text-[var(--color-foreground)] placeholder-[var(--color-muted-foreground)] min-h-[120px]"
                placeholder="Write the vision here"
              />
            </div>
        {missionVision.map((item) => (
          <div key={item.id} className="p-4 bg-[var(--color-card)] rounded-lg space-y-3 border border-[var(--color-border)]">
            <Input
              value={item.title}
              onChange={(e) => onMissionChange(item.id, 'title', e.target.value)}
              className="bg-[var(--color-input)] border-[var(--color-border)] text-[var(--color-foreground)] placeholder-[var(--color-muted-foreground)]"
              placeholder="Title (e.g., Our Mission)"
              required
            />
            <Textarea
              value={item.description}
              onChange={(e) => onMissionChange(item.id, 'description', e.target.value)}
              className="bg-[var(--color-input)] border-[var(--color-border)] text-[var(--color-foreground)] placeholder-[var(--color-muted-foreground)] min-h-[100px]"
              placeholder="Mission description"
              required
            />
            
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

interface BeliefsFormProps {
  whatWeBelieveTitle?: string;
  whatWeBelieve: BeliefItem[];
  onBeliefChange: (id: number, field: keyof BeliefItem, value: string) => void;
  onAddBelief: () => void;
  onDeleteBelief: (id: number) => void;
  onSetBelieveTitle: (value: string) => void;
}

export function BeliefsForm({
  whatWeBelieveTitle,
  whatWeBelieve,
  onBeliefChange,
  onAddBelief,
  onDeleteBelief,
  onSetBelieveTitle
}: BeliefsFormProps) {
  return (
    <Card className="bg-[var(--color-card)] border-[var(--color-border)]">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-[var(--color-foreground)]">What We Believe</CardTitle>
          <CardDescription className="text-[var(--color-muted-foreground)]">Manage company values and beliefs</CardDescription>
        </div>
        <Button onClick={onAddBelief} size="sm" className="bg-amber-600 hover:bg-amber-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Belief
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <label className="text-sm font-medium text-[var(--color-muted-foreground)]">Section Title</label>
        <Input
          value={whatWeBelieveTitle ?? ''}
          onChange={(e) => onSetBelieveTitle(e.target.value)}
          className="mt-2 bg-[var(--color-input)] border-[var(--color-border)] text-[var(--color-foreground)] placeholder-[var(--color-muted-foreground)]"
          placeholder="Section title (e.g., What We Believe)"
        />
        {whatWeBelieve.map((item) => (
          <div key={item.id} className="p-4 bg-[var(--color-card)] rounded-lg space-y-3 border border-[var(--color-border)]">
            <div className="flex justify-between items-start">
              <div className="flex-1 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    value={item.icon}
                    onChange={(e) => onBeliefChange(item.id, 'icon', e.target.value)}
                    className="bg-[var(--color-input)] border-[var(--color-border)] text-[var(--color-foreground)] placeholder-[var(--color-muted-foreground)]"
                    placeholder="Icon emoji"
                    maxLength={2}
                    required
                  />
                  <Input
                    value={item.title}
                    onChange={(e) => onBeliefChange(item.id, 'title', e.target.value)}
                    className="bg-[var(--color-input)] border-[var(--color-border)] text-[var(--color-foreground)] placeholder-[var(--color-muted-foreground)]"
                    placeholder="Belief title"
                    required
                  />
                </div>
                <Textarea
                  value={item.description}
                  onChange={(e) => onBeliefChange(item.id, 'description', e.target.value)}
                  className="bg-[var(--color-input)] border-[var(--color-border)] text-[var(--color-foreground)] placeholder-[var(--color-muted-foreground)] min-h-[70px]"
                  placeholder="Belief description"
                  required
                />
              </div>
              <Button
                onClick={() => onDeleteBelief(item.id)}
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
  );
}

interface TechnologyFormProps {
  technologyTitle?: string;
  technology: TechnologyItem[];
  onTechnologyItemChange: (techId: number, field: 'icon' | 'title' | 'description', value: string) => void;
  onTechnologyPointChange: (techId: number, pointId: number, value: string) => void;
  onAddTechnologyItem: () => void;
  onDeleteTechnologyItem: (techId: number) => void;
  onAddTechnologyPoint: (techId: number) => void;
  onDeleteTechnologyPoint: (techId: number, pointId: number) => void;
  onSetTechnologyTitle: (value: string) => void;
}

export function TechnologyForm({
  technologyTitle,
  technology,
  onTechnologyItemChange,
  onTechnologyPointChange,
  onAddTechnologyItem,
  onDeleteTechnologyItem,
  onAddTechnologyPoint,
  onDeleteTechnologyPoint,
  onSetTechnologyTitle
}: TechnologyFormProps) {
  return (
    <Card className="bg-[var(--color-card)] border-[var(--color-border)]">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-[var(--color-foreground)]">Technology & Tools</CardTitle>
          <CardDescription className="text-[var(--color-muted-foreground)]">Manage technology section</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 flex flex-col">
        <div>
          <label className="text-sm font-medium text-[var(--color-muted-foreground)]">Section Title</label>
          <Input
            value={technologyTitle ?? ''}
            onChange={(e) => onSetTechnologyTitle(e.target.value)}
            className="mt-2 bg-[var(--color-input)] border-[var(--color-border)] text-[var(--color-foreground)] placeholder-[var(--color-muted-foreground)]"
            placeholder="Section title (e.g., Technology & Tools)"
          />
        </div>
        <div className="flex justify-between items-center mb-4">
          <label className="text-sm font-medium text-[var(--color-muted-foreground)]">Technology Items</label>
          <Button onClick={onAddTechnologyItem} size="sm" className="bg-amber-600 hover:bg-amber-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Technology Item
          </Button>
        </div>

        {technology.map((tech) => (
          <div key={tech.id} className="p-4 bg-[var(--color-card)] rounded-lg space-y-3 border border-[var(--color-border)]">
            <div className="flex justify-between items-start">
              <div className="flex-1 space-y-3">
                <div className="grid grid-cols-3 gap-3">
                  <Input
                    value={tech.icon}
                    onChange={(e) => onTechnologyItemChange(tech.id, 'icon', e.target.value)}
                    className="bg-[var(--color-input)] border-[var(--color-border)] text-[var(--color-foreground)] placeholder-[var(--color-muted-foreground)]"
                    placeholder="Icon emoji"
                    maxLength={2}
                  />
                  <Input
                    value={tech.title}
                    onChange={(e) => onTechnologyItemChange(tech.id, 'title', e.target.value)}
                    className="bg-[var(--color-input)] border-[var(--color-border)] text-[var(--color-foreground)] placeholder-[var(--color-muted-foreground)] col-span-2"
                    placeholder="Title"
                  />
                </div>

                <Textarea
                  value={tech.description}
                  onChange={(e) => onTechnologyItemChange(tech.id, 'description', e.target.value)}
                  className="bg-[var(--color-input)] border-[var(--color-border)] text-[var(--color-foreground)] placeholder-[var(--color-muted-foreground)] min-h-[80px]"
                  placeholder="Description"
                />

                <div className="pt-4 border-t border-[var(--color-border)]">
                  <div className="flex justify-between items-center mb-4">
                    <label className="text-sm font-medium text-[var(--color-muted-foreground)]">Key Points</label>
                    <Button onClick={() => onAddTechnologyPoint(tech.id)} size="sm" className="bg-amber-600 hover:bg-amber-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Point
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {(tech.points ?? []).map((pt: any) => (
                      <div key={pt.id} className="flex justify-between items-start gap-3 p-3 bg-[var(--color-card)] rounded-lg border border-[var(--color-border)]">
                        <Input
                          value={pt.point}
                          onChange={(e) => onTechnologyPointChange(tech.id, pt.id, e.target.value)}
                          className="flex-1 bg-[var(--color-input)] border-[var(--color-border)] text-[var(--color-foreground)] placeholder-[var(--color-muted-foreground)]"
                          placeholder="Key point"
                          required
                        />
                        <Button
                          onClick={() => onDeleteTechnologyPoint(tech.id, pt.id)}
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
                <Button onClick={() => onDeleteTechnologyItem(tech.id)} size="sm" variant="destructive">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
