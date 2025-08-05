import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Book,
  FileText,
  Video,
  Code,
  MessageCircle,
  Star,
  Clock,
  User,
  ArrowRight,
  Filter,
  BookOpen,
  Lightbulb,
  Wrench,
  AlertCircle,
  CheckCircle2
} from "lucide-react";

export default function ProfessionalKnowledgeBase() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Topics', icon: <Book className="w-4 h-4" />, count: 156 },
    { id: 'getting-started', name: 'Getting Started', icon: <Lightbulb className="w-4 h-4" />, count: 24 },
    { id: 'server-management', name: 'Server Management', icon: <Wrench className="w-4 h-4" />, count: 45 },
    { id: 'troubleshooting', name: 'Troubleshooting', icon: <AlertCircle className="w-4 h-4" />, count: 32 },
    { id: 'api-docs', name: 'API Documentation', icon: <Code className="w-4 h-4" />, count: 28 },
    { id: 'tutorials', name: 'Tutorials', icon: <Video className="w-4 h-4" />, count: 27 }
  ];

  const popularArticles = [
    {
      id: 1,
      title: "How to Set Up Your First Minecraft Server",
      description: "Complete guide to deploying a Minecraft server with mods and plugins",
      category: "Getting Started",
      readTime: "5 min",
      rating: 4.9,
      views: 12500,
      type: "tutorial",
      isNew: true
    },
    {
      id: 2,
      title: "Advanced Server Performance Optimization",
      description: "Maximize your server performance with these proven techniques",
      category: "Server Management",
      readTime: "8 min",
      rating: 4.8,
      views: 8200,
      type: "guide",
      isNew: false
    },
    {
      id: 3,
      title: "Troubleshooting Server Connection Issues",
      description: "Step-by-step solutions for common connectivity problems",
      category: "Troubleshooting",
      readTime: "6 min",
      rating: 4.7,
      views: 9800,
      type: "troubleshooting",
      isNew: false
    },
    {
      id: 4,
      title: "Using the GameHost Pro API",
      description: "Complete API reference with examples and best practices",
      category: "API Documentation",
      readTime: "12 min",
      rating: 4.9,
      views: 5600,
      type: "documentation",
      isNew: true
    },
    {
      id: 5,
      title: "Setting Up Automatic Backups",
      description: "Protect your server data with automated backup solutions",
      category: "Server Management",
      readTime: "4 min",
      rating: 4.8,
      views: 7300,
      type: "tutorial",
      isNew: false
    },
    {
      id: 6,
      title: "DDoS Protection Configuration",
      description: "Configure advanced DDoS protection for your servers",
      category: "Security",
      readTime: "7 min",
      rating: 4.9,
      views: 4200,
      type: "guide",
      isNew: true
    }
  ];

  const quickStartGuides = [
    {
      title: "Deploy Your First Server",
      description: "Get up and running in under 5 minutes",
      steps: 4,
      duration: "5 min",
      difficulty: "Beginner"
    },
    {
      title: "Configure Server Settings",
      description: "Customize your server for optimal performance",
      steps: 6,
      duration: "10 min",
      difficulty: "Intermediate"
    },
    {
      title: "Set Up Monitoring",
      description: "Monitor server health and performance",
      steps: 5,
      duration: "8 min",
      difficulty: "Intermediate"
    }
  ];

  const getArticleIcon = (type: string) => {
    switch (type) {
      case 'tutorial': return <Video className="w-5 h-5 text-blue-400" />;
      case 'guide': return <BookOpen className="w-5 h-5 text-gaming-green" />;
      case 'troubleshooting': return <AlertCircle className="w-5 h-5 text-orange-400" />;
      case 'documentation': return <Code className="w-5 h-5 text-purple-400" />;
      default: return <FileText className="w-5 h-5 text-gaming-gray" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Intermediate': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Advanced': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gaming-green/20 text-gaming-green border-gaming-green/30';
    }
  };

  return (
    <div className="min-h-screen bg-gaming-black">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-gaming">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold text-gaming-white mb-6">
              Knowledge <span className="text-gaming-green">Base</span>
            </h1>
            <p className="text-xl text-gaming-gray mb-8">
              Find answers, guides, and resources to get the most out of your game servers
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gaming-gray w-5 h-5" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for guides, tutorials, or troubleshooting..."
                className="pl-12 pr-20 py-4 text-lg bg-gaming-dark border-gaming-green/30 text-gaming-white rounded-xl"
              />
              <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gaming-green hover:bg-gaming-green-dark text-gaming-black">
                Search
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-gaming-dark border-gaming-green/20 sticky top-8">
              <CardHeader>
                <CardTitle className="text-gaming-white flex items-center">
                  <Filter className="w-5 h-5 mr-2" />
                  Categories
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors flex items-center justify-between ${
                      selectedCategory === category.id
                        ? 'bg-gaming-green/20 text-gaming-green border border-gaming-green/30'
                        : 'hover:bg-gaming-black-lighter text-gaming-gray hover:text-gaming-white'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      {category.icon}
                      <span>{category.name}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {category.count}
                    </Badge>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Quick Start Guides */}
            <section>
              <h2 className="text-2xl font-bold text-gaming-white mb-6 flex items-center">
                <Lightbulb className="w-6 h-6 text-gaming-green mr-3" />
                Quick Start Guides
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {quickStartGuides.map((guide, index) => (
                  <Card key={index} className="bg-gaming-dark border-gaming-green/20 hover:border-gaming-green/40 transition-all group cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <CheckCircle2 className="w-6 h-6 text-gaming-green flex-shrink-0 mt-1" />
                        <Badge className={getDifficultyColor(guide.difficulty)}>
                          {guide.difficulty}
                        </Badge>
                      </div>
                      <h3 className="text-gaming-white font-semibold text-lg mb-2 group-hover:text-gaming-green transition-colors">
                        {guide.title}
                      </h3>
                      <p className="text-gaming-gray text-sm mb-4">{guide.description}</p>
                      <div className="flex items-center justify-between text-sm text-gaming-gray">
                        <span>{guide.steps} steps</span>
                        <span>{guide.duration}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Popular Articles */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gaming-white flex items-center">
                  <Star className="w-6 h-6 text-gaming-green mr-3" />
                  Popular Articles
                </h2>
                <Button variant="outline" className="border-gaming-green/30 text-gaming-green">
                  View All
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
              
              <div className="grid gap-6">
                {popularArticles.map((article) => (
                  <Card key={article.id} className="bg-gaming-dark border-gaming-green/20 hover:border-gaming-green/40 transition-all group cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          {getArticleIcon(article.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-gaming-white font-semibold text-lg group-hover:text-gaming-green transition-colors">
                              {article.title}
                            </h3>
                            {article.isNew && (
                              <Badge className="bg-gaming-green/20 text-gaming-green border-gaming-green/30 text-xs">
                                New
                              </Badge>
                            )}
                          </div>
                          <p className="text-gaming-gray mb-3">{article.description}</p>
                          <div className="flex items-center space-x-6 text-sm text-gaming-gray">
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{article.readTime}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 fill-gaming-green text-gaming-green" />
                              <span>{article.rating}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <User className="w-4 h-4" />
                              <span>{article.views.toLocaleString()} views</span>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {article.category}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Help Section */}
            <Card className="bg-gradient-to-r from-gaming-green/10 to-gaming-green/5 border-gaming-green/20">
              <CardContent className="p-8 text-center">
                <MessageCircle className="w-12 h-12 text-gaming-green mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gaming-white mb-2">
                  Can't Find What You're Looking For?
                </h3>
                <p className="text-gaming-gray mb-6 max-w-2xl mx-auto">
                  Our support team is here to help. Get in touch and we'll provide personalized assistance for your specific needs.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button className="bg-gaming-green hover:bg-gaming-green-dark text-gaming-black">
                    Contact Support
                  </Button>
                  <Button variant="outline" className="border-gaming-green/30 text-gaming-green">
                    Request Tutorial
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}