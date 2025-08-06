import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, User, Clock } from "lucide-react";
import Navigation from "@/components/navigation";
import PromoBanner from "@/components/promo-banner";
import Footer from "@/components/footer";
import SEOHead from "@/components/seo-head";
import { BlogPost } from "@shared/schema";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';

export default function BlogPostPage() {
  const [match, params] = useRoute("/blog/:slug");
  const slug = params?.slug;

  const { data: post, isLoading } = useQuery<BlogPost>({
    queryKey: ["/api/blog", slug],
    queryFn: async () => {
      const response = await fetch(`/api/blog/${slug}`);
      if (!response.ok) throw new Error("Blog post not found");
      return response.json();
    },
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gaming-black">
        <PromoBanner />
        <Navigation />
        <div className="container mx-auto px-4 py-16">
          <div className="flex justify-center items-center h-64">
            <div className="text-gaming-green">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gaming-black">
        <PromoBanner />
        <Navigation />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gaming-white mb-4">Blog Post Not Found</h1>
            <p className="text-gaming-gray mb-8">The blog post you're looking for doesn't exist.</p>
            <Link href="/">
              <Button className="bg-gaming-green hover:bg-gaming-green-dark text-gaming-black">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const blogPostSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.excerpt,
    "image": post.imageUrl,
    "author": {
      "@type": "Person",
      "name": post.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "VoltServers",
      "logo": "https://voltservers.com/logo.png"
    },
    "datePublished": post.publishedAt || new Date().toISOString(),
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://voltservers.com/blog/${post.slug}`
    }
  };

  return (
    <div className="min-h-screen bg-gaming-black">
      <SEOHead
        title={`${post.title} - VoltServers Blog`}
        description={post.excerpt}
        keywords={`gaming, server hosting, ${post.tags?.join(', ')}, tutorial, guide`}
        ogTitle={post.title}
        ogDescription={post.excerpt}
        ogType="article"
        ogImage={post.imageUrl}
        canonicalUrl={`https://voltservers.com/blog/${post.slug}`}
        schema={blogPostSchema}
      />
      
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={post.title} />
      <meta name="twitter:description" content={post.excerpt} />
      <meta name="twitter:image" content={post.imageUrl} />
      
      <PromoBanner />
      <Navigation />
      
      <article className="py-16">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <div className="mb-8">
            <Link href="/">
              <Button variant="ghost" className="text-gaming-green hover:text-gaming-green-dark">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>

          {/* Hero Image */}
          <div className="mb-8">
            <img 
              src={post.imageUrl || "/images/blog/minecraft-setup.svg"} 
              alt={post.title}
              className="w-full h-96 object-cover rounded-lg"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/images/blog/minecraft-setup.svg";
              }}
            />
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="bg-gaming-green/20 text-gaming-green">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-4xl lg:text-5xl font-bold text-gaming-white mb-6">
              {post.title}
            </h1>

            {/* Excerpt */}
            <p className="text-xl text-gaming-gray mb-8 leading-relaxed">
              {post.excerpt}
            </p>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 mb-12 pb-6 border-b border-gaming-black-lighter">
              <div className="flex items-center gap-2 text-gaming-gray">
                <User className="w-4 h-4" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2 text-gaming-gray">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(post.publishedAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                  {post.updatedAt && new Date(post.updatedAt).getTime() !== new Date(post.publishedAt).getTime() && (
                    <span className="text-gaming-blue ml-2 block text-sm">
                      Updated: {new Date(post.updatedAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                  )}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gaming-gray">
                <Clock className="w-4 h-4" />
                <span>{Math.ceil(post.content.length / 1000)} min read</span>
              </div>
            </div>

            {/* Content */}
            <div className="prose prose-lg prose-invert max-w-none blog-content">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                components={{
                  h1: ({node, ...props}) => <h1 className="text-4xl font-bold text-gaming-white mt-8 mb-6" {...props} />,
                  h2: ({node, ...props}) => <h2 className="text-3xl font-bold text-gaming-white mt-8 mb-4" {...props} />,
                  h3: ({node, ...props}) => <h3 className="text-2xl font-semibold text-gaming-white mt-6 mb-3" {...props} />,
                  h4: ({node, ...props}) => <h4 className="text-xl font-semibold text-gaming-white mt-4 mb-2" {...props} />,
                  p: ({node, ...props}) => <p className="mb-4 text-gaming-gray leading-relaxed" {...props} />,
                  strong: ({node, ...props}) => <strong className="font-bold text-gaming-white" {...props} />,
                  em: ({node, ...props}) => <em className="italic text-gaming-white" {...props} />,
                  code: ({node, ...props}) => <code className="bg-gaming-black-lighter text-gaming-green px-2 py-1 rounded text-sm font-mono" {...props} />,
                  pre: ({node, ...props}) => <pre className="bg-gaming-black-lighter rounded-lg p-4 overflow-x-auto mb-4" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc list-inside mb-4 text-gaming-gray space-y-2" {...props} />,
                  ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-4 text-gaming-gray space-y-2" {...props} />,
                  li: ({node, ...props}) => <li className="text-gaming-gray" {...props} />,
                  blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-gaming-green pl-4 italic text-gaming-gray bg-gaming-black-lighter p-4 rounded-r-lg mb-4" {...props} />,
                  a: ({node, ...props}) => <a className="text-gaming-green hover:text-gaming-green-light underline" {...props} />,
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>

            {/* Call to Action */}
            <div className="mt-16 p-8 bg-gaming-black-light rounded-lg text-center">
              <h3 className="text-2xl font-bold text-gaming-white mb-4">
                Ready to Start Your Game Server?
              </h3>
              <p className="text-gaming-gray mb-6">
                Get your server online in minutes with our premium hosting platform.
              </p>
              <Button 
                size="lg" 
                className="bg-gaming-green hover:bg-gaming-green-dark text-gaming-black font-semibold"
              >
                Get Started Today
              </Button>
            </div>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
}