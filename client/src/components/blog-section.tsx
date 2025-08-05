import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, ArrowRight, BookOpen } from "lucide-react";
import { Link } from "wouter";
import type { BlogPost } from "@shared/schema";

export default function BlogSection() {
  const { data: blogPosts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ['/api/blog'],
  });

  if (isLoading) {
    return (
      <section className="py-20 bg-gaming-black-light">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Latest <span className="text-gaming-green">News</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gaming-black-lighter rounded-xl overflow-hidden animate-pulse">
                <div className="w-full h-48 bg-gaming-black" />
                <div className="p-6">
                  <div className="h-4 bg-gaming-black rounded mb-4" />
                  <div className="h-6 bg-gaming-black rounded mb-4" />
                  <div className="h-3 bg-gaming-black rounded mb-4" />
                  <div className="h-8 bg-gaming-black rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gaming-black-light">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Latest <span className="text-gaming-green">News</span>
          </h2>
          <p className="text-xl text-gaming-gray max-w-3xl mx-auto">
            Stay updated with the latest gaming server trends, optimization tips, and platform updates from our expert team.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts?.slice(0, 3).map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`}>
              <Card className="group bg-gaming-black-lighter border-gaming-black-lighter hover:shadow-xl hover:shadow-gaming-green/20 transition-all duration-300 hover:-translate-y-2 overflow-hidden cursor-pointer">
                <div className="relative">
                  <img 
                    src={post.imageUrl || '/images/blog/server-optimization.svg'} 
                    alt={post.title} 
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/images/blog/server-optimization.svg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gaming-green/0 group-hover:bg-gaming-green/10 transition-colors duration-300" />
                  <div className="absolute top-4 left-4">
                    {post.tags.slice(0, 2).map((tag, index) => (
                      <Badge key={index} className="bg-gaming-green text-gaming-black mr-2 mb-2">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 text-sm text-gaming-gray mb-4">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(post.publishedAt).toLocaleDateString()}
                        {post.updatedAt && new Date(post.updatedAt).getTime() !== new Date(post.publishedAt).getTime() && (
                          <span className="text-gaming-blue ml-2">(Updated: {new Date(post.updatedAt).toLocaleDateString()})</span>
                        )}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>{post.author}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gaming-white mb-3 line-clamp-2">
                    {post.title}
                  </h3>
                  
                  <p className="text-gaming-gray mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <Button 
                    variant="ghost" 
                    className="p-0 text-gaming-green hover:text-gaming-green-dark group-hover:translate-x-2 transition-transform duration-300"
                  >
                    Read More <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button 
            variant="outline"
            className="border-2 border-gaming-green text-gaming-green hover:bg-gaming-green hover:text-gaming-black"
          >
            <BookOpen className="mr-2 h-4 w-4" />
            View All Articles
          </Button>
        </div>
      </div>
    </section>
  );
}