'use client'
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import type {
  HeroSection,
  HeroImage,
  MissionVisionItem,
  BeliefItem,

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


  return (
    <div className="p-4  rounded-lg space-y-3 border border-[var(--color-border)]">
     
    </div>
  );
}

export function HeroForm({
  hero,
  onHeroChange,
 
}: HeroFormProps) {
  return (
    <>
      <Card className=" border-[var(--color-border)]">
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
              className="mt-2 border-[var(--color-border)] text-[var(--color-foreground)] placeholder-[var(--color-muted-foreground)]"
              placeholder="Section title"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-[var(--color-muted-foreground)]">Main Title</label>
            <Input
              value={hero.mainTitle}
              onChange={(e) => onHeroChange('mainTitle', e.target.value)}
              className="mt-2 border-[var(--color-border)] text-[var(--color-foreground)] placeholder-[var(--color-muted-foreground)]"
              placeholder="Main title"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-[var(--color-muted-foreground)]">Description</label>
            <Textarea
              value={hero.description}
              onChange={(e) => onHeroChange('description', e.target.value)}
              className="mt-2 border-[var(--color-border)] text-[var(--color-foreground)] placeholder-[var(--color-muted-foreground)] min-h-[120px]"
              placeholder="Hero description"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-[var(--color-muted-foreground)]">CTA Button Text</label>
            <Input
              value={hero.cta}
              onChange={(e) => onHeroChange('cta', e.target.value)}
              className="mt-2 border-[var(--color-border)] text-[var(--color-foreground)] placeholder-[var(--color-muted-foreground)]"
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
  onSetMissionTitle,
  onSetMissionDescription,
  onSetVisionTitle,
  onSetVisionDescription
}: MissionVisionFormProps) {
  return (
    <Card className=" border-[var(--color-border)]">
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
            className="mt-2 border-[var(--color-border)] text-[var(--color-foreground)] placeholder-[var(--color-muted-foreground)]"
            placeholder="Section title (e.g., Mission & Vision)"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-[var(--color-muted-foreground)]">Mission  Text</label>
          <Textarea
            value={missionDescription}
            onChange={(e) => onSetMissionDescription(e.target.value)}
            className="mt-2 border-[var(--color-border)] text-[var(--color-foreground)] placeholder-[var(--color-muted-foreground)] min-h-[120px]"
            placeholder="Write the mission here"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-[var(--color-muted-foreground)]">Vision Text</label>
          <Textarea
            value={visionDescription}
            onChange={(e) => onSetVisionDescription?.(e.target.value)}
            className="mt-2 border-[var(--color-border)] text-[var(--color-foreground)] placeholder-[var(--color-muted-foreground)] min-h-[120px]"
            placeholder="Write the vision here"
          />
        </div>
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

}: BeliefsFormProps) {

}

