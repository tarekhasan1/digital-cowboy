'use client';

import { useState, useEffect } from 'react';
import { getInsights, deleteInsight, InsightPost } from '../../../../actions/insights';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { FileText, Plus, Trash2, Edit } from 'lucide-react';
import Link from 'next/link';

export default function AdminContentPage() {
  const [posts, setPosts] = useState<InsightPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    const res = await getInsights(false);
    if (res.success && res.posts) {
      setPosts(res.posts as InsightPost[]);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) return;
    
    const res = await deleteInsight(id);
    if (res.success) {
      setPosts(posts.filter(p => p.id !== id));
    } else {
      alert('Failed to delete post.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 h-[calc(100vh-80px)] overflow-y-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <FileText className="w-8 h-8 text-primary" />
            Content Management
          </h1>
          <p className="text-white/60">Manage your Insights and Blog articles.</p>
        </div>
        <Link href="/admin/content/new">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold">
            <Plus className="w-4 h-4 mr-2" />
            New Post
          </Button>
        </Link>
      </div>

      <Card className="bg-white/5 border-white/10 p-6 overflow-hidden">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full bg-white/10 rounded-xl" />)}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 text-white/50 border border-dashed border-white/20 rounded-xl">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>No posts published yet.</p>
            <Link href="/admin/content/new" className="text-primary mt-2 inline-block hover:underline">
              Create your first post
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map(post => (
              <div key={post.id} className="flex items-center justify-between p-4 bg-black/20 border border-white/5 rounded-xl hover:bg-white/5 transition-colors">
                <div>
                  <h3 className="font-semibold text-lg text-white mb-1">{post.title}</h3>
                  <div className="flex items-center gap-3 text-sm text-white/40">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-bold ${
                      post.published ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {post.published ? 'Published' : 'Draft'}
                    </span>
                    <span>•</span>
                    <span>{post.category}</span>
                    <span>•</span>
                    <span>{new Date(post.createdAt!).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" className="hover:bg-white/10 hover:text-white text-white/60" onClick={() => alert('Editing coming soon, use the new post page for now or implement edit routing!')}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="hover:bg-red-500/20 hover:text-red-400 text-white/60" onClick={() => handleDelete(post.id!)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
