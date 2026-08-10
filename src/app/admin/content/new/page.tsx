'use client';

import { useState } from 'react';
import { createInsight } from '../../../../../actions/insights';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Loader2, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NewPostPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    coverImage: '/insights/1.jpg',
    category: 'Technology',
    readTime: '5 min read',
    published: false
  });

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as any;
    
    if (name === 'title' && !formData.slug) {
      setFormData(prev => ({ ...prev, title: value, slug: generateSlug(value) }));
    } else if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async (published: boolean) => {
    if (!formData.title || !formData.content) {
      alert('Title and content are required.');
      return;
    }

    setSaving(true);
    const res = await createInsight({ ...formData, published });
    setSaving(false);

    if (res.success) {
      router.push('/admin/content');
    } else {
      alert(res.error || 'Failed to save post');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/content">
            <Button variant="ghost" size="icon" className="hover:bg-white/10 text-white/60 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Create New Post</h1>
            <p className="text-white/40 text-sm">Write your next insight in Markdown</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={() => handleSave(false)} 
            disabled={saving}
            className="border-white/10 hover:bg-white/10 bg-transparent text-white"
          >
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save Draft
          </Button>
          <Button 
            onClick={() => handleSave(true)} 
            disabled={saving}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
          >
            Publish Now
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 space-y-6">
          <Card className="bg-white/5 border-white/10 p-6">
            <input 
              name="title"
              value={formData.title}
              onChange={handleChange}
              type="text" 
              placeholder="Post Title..." 
              className="w-full bg-transparent text-4xl font-bold text-white placeholder:text-white/20 focus:outline-none mb-6"
            />
            
            <textarea 
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Write your content here... (Markdown supported)"
              className="w-full h-[600px] bg-transparent text-white/80 placeholder:text-white/20 focus:outline-none resize-none font-mono text-sm leading-relaxed"
            />
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-white/5 border-white/10 p-6 space-y-6">
            <h3 className="font-semibold text-white uppercase text-xs tracking-wider">Post Details</h3>
            
            <div className="space-y-2">
              <label className="text-xs text-white/60">Slug (URL)</label>
              <input 
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                type="text" 
                className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-white/60">Excerpt</label>
              <textarea 
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                rows={3} 
                className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-white/60">Category</label>
              <select 
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary appearance-none"
              >
                <option value="Technology">Technology</option>
                <option value="Business">Business</option>
                <option value="AI Automation">AI Automation</option>
                <option value="Design">Design</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-white/60">Read Time</label>
              <input 
                name="readTime"
                value={formData.readTime}
                onChange={handleChange}
                type="text" 
                className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs text-white/60">Cover Image URL</label>
              <div className="flex gap-2">
                <input 
                  name="coverImage"
                  value={formData.coverImage}
                  onChange={handleChange}
                  type="text" 
                  className="flex-1 bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
