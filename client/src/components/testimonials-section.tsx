import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Quote } from "lucide-react";

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: "Alex Chen",
      role: "Minecraft Server Owner",
      server: "SkyBlock Network",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
      quote: "GameHost Pro has been incredible for our network. Zero downtime in 6 months, and their support team responds within minutes. Our players love the performance!"
    },
    {
      name: "Sarah Miller",
      role: "Community Manager",
      server: "Rust Survival Hub",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
      quote: "The instant setup feature saved us hours. We went from planning to live server in under 5 minutes. The DDoS protection has kept us online through everything."
    },
    {
      name: "Marcus Johnson",
      role: "Esports Team Owner",
      server: "Competitive CS2",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
      quote: "For competitive gaming, every millisecond matters. GameHost Pro's global network gives us sub-20ms latency worldwide. Our tournaments run flawlessly."
    }
  ];

  return (
    <section className="py-20 bg-gaming-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            What Our <span className="text-gaming-green">Community</span> Says
          </h2>
          <p className="text-xl text-gaming-gray max-w-3xl mx-auto">
            Join thousands of satisfied server owners who trust GameHost Pro for their gaming infrastructure.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-gaming-black-lighter border border-gaming-gray/20 hover:border-gaming-green/30 transition-colors duration-300">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <Quote className="text-gaming-green text-2xl mr-3" />
                  <div className="flex">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="text-gaming-green fill-current w-5 h-5" />
                    ))}
                  </div>
                </div>
                
                <p className="text-gaming-gray mb-6 leading-relaxed">
                  "{testimonial.quote}"
                </p>
                
                <div className="flex items-center">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4 object-cover"
                  />
                  <div>
                    <div className="font-semibold text-gaming-white">{testimonial.name}</div>
                    <div className="text-gaming-gray text-sm">{testimonial.role}</div>
                    <Badge variant="secondary" className="mt-1 bg-gaming-green/10 text-gaming-green">
                      {testimonial.server}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}