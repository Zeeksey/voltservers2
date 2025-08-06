import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from '@tanstack/react-query';

interface NewsletterFormData {
  email: string;
}

export default function NewsletterSubscription() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const subscribeToNewsletter = useMutation({
    mutationFn: async (data: NewsletterFormData) => {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to subscribe');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Success!",
        description: data.message || "Successfully subscribed to status updates!",
      });
      setEmail("");
    },
    onError: (error: Error) => {
      toast({
        title: "Subscription Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }
    
    subscribeToNewsletter.mutate({ email });
  };

  return (
    <section className="py-20 bg-gradient-gaming">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold text-gaming-white mb-4">
          Stay Updated
        </h2>
        <p className="text-xl text-gaming-gray mb-8">
          Get notified about service updates and maintenance windows.
        </p>
        
        <div className="max-w-md mx-auto mb-8">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gaming-black-lighter border-gaming-green/30 text-gaming-white placeholder:text-gaming-gray"
              disabled={subscribeToNewsletter.isPending}
            />
            <Button 
              type="submit"
              className="bg-gaming-green hover:bg-gaming-green/90 text-black font-semibold"
              disabled={subscribeToNewsletter.isPending}
            >
              {subscribeToNewsletter.isPending ? "Subscribing..." : "Subscribe"}
            </Button>
          </form>
        </div>
        
        <div className="flex justify-center gap-4">
          <Button 
            size="lg" 
            variant="outline"
            className="border-gaming-green text-gaming-green hover:bg-gaming-green hover:text-gaming-black"
            asChild
          >
            <a href="https://discord.gg/voltservers" target="_blank" rel="noopener noreferrer">
              Join Discord
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}