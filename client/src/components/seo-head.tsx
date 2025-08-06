import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  canonicalUrl?: string;
  schema?: Record<string, any>;
}

export default function SEOHead({
  title,
  description,
  keywords,
  ogTitle,
  ogDescription, 
  ogImage = '/images/voltservers-og-image.jpg',
  ogType = 'website',
  twitterTitle,
  twitterDescription,
  canonicalUrl,
  schema
}: SEOProps) {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Helper function to update or create meta tags
    const updateMetaTag = (name: string, content: string, property?: boolean) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let element = document.querySelector(selector) as HTMLMetaElement;
      
      if (!element) {
        element = document.createElement('meta');
        if (property) {
          element.setAttribute('property', name);
        } else {
          element.setAttribute('name', name);
        }
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Update basic meta tags
    updateMetaTag('description', description);
    if (keywords) updateMetaTag('keywords', keywords);

    // Update Open Graph tags
    updateMetaTag('og:title', ogTitle || title, true);
    updateMetaTag('og:description', ogDescription || description, true);
    updateMetaTag('og:image', ogImage, true);
    updateMetaTag('og:type', ogType, true);
    updateMetaTag('og:site_name', 'VoltServers', true);
    
    // Update Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', twitterTitle || ogTitle || title);
    updateMetaTag('twitter:description', twitterDescription || ogDescription || description);
    updateMetaTag('twitter:image', ogImage);

    // Update canonical URL if provided
    if (canonicalUrl) {
      let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.setAttribute('href', canonicalUrl);
    }

    // Add structured data if provided
    if (schema) {
      let schemaScript = document.querySelector('script[type="application/ld+json"]');
      if (schemaScript) {
        schemaScript.remove();
      }
      
      schemaScript = document.createElement('script');
      schemaScript.setAttribute('type', 'application/ld+json');
      schemaScript.textContent = JSON.stringify(schema);
      document.head.appendChild(schemaScript);
    }

    // Cleanup function to remove dynamic meta tags when component unmounts
    return () => {
      // Note: We don't remove meta tags on unmount as they might be needed
      // for the next page that loads. The next page will update them anyway.
    };
  }, [title, description, keywords, ogTitle, ogDescription, ogImage, ogType, 
      twitterTitle, twitterDescription, canonicalUrl, schema]);

  return null; // This component doesn't render anything
}