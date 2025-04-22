'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check, Loader2, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';

const features = {
  free: [
    '5 AI therapy sessions per month',
    'Basic mood tracking',
    'Standard questionnaires',
    'Community support',
    'Email support'
  ],
  pro: [
    'Unlimited AI therapy sessions',
    'Advanced mood analytics',
    '24/7 Priority support',
    'Personalized therapy plans',
    'Custom questionnaires',
    'Progress tracking',
    'Meditation library access',
    'Journal prompts',
    'Crisis support resources'
  ]
};

export default function PricingPage() {
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem('token') || localStorage.getItem('mindguard_token');
    const userId = localStorage.getItem('mindguard_user_id');
    setIsAuthenticated(!!token && !!userId);
  }, []);

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      document.body.appendChild(script);
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
    });
  };

  const handleSubscribe = async () => {
    try {
      if (!isAuthenticated) {
        toast({
          title: 'Authentication Required',
          description: 'Please log in to upgrade to Pro',
          variant: 'destructive',
        });
        router.push('/login');
        return;
      }

      setLoading(true);

      // Load Razorpay SDK
      const isLoaded = await loadRazorpay();
      if (!isLoaded) {
        throw new Error('Razorpay SDK failed to load');
      }

      // Create order
      const token = localStorage.getItem('token') || localStorage.getItem('mindguard_token');
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      console.log('Order created:', data);

      if (data.error) {
        throw new Error(data.error);
      }

      // Initialize Razorpay payment
      const options = {
        key: data.keyId, // Using the key from the server response
        amount: data.amount,
        currency: data.currency,
        name: 'MindGuard',
        description: 'Pro Plan Subscription',
        order_id: data.orderId,
        handler: function(response: any) {
          console.log('Payment successful:', response);
          toast({
            title: 'Success',
            description: 'Payment completed successfully!',
          });
          router.push('/');
        },
        prefill: {
          name: localStorage.getItem('username') || '',
          email: localStorage.getItem('email') || '',
        },
        theme: {
          color: '#0F172A'
        }
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.on('payment.failed', function(response: any) {
        console.error('Payment failed:', response.error);
        toast({
          title: 'Payment Failed',
          description: response.error.description,
          variant: 'destructive',
        });
      });

      razorpay.open();
    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to start payment process',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-16">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 text-transparent bg-clip-text">
            Choose Your Mental Health Journey
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Start with our free plan or unlock unlimited access to all features with MindGuard Pro
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <Card className="p-8 hover:shadow-lg transition-shadow duration-300">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-2">Free Plan</h2>
              <p className="text-muted-foreground">Perfect for getting started</p>
              <div className="mt-4">
                <span className="text-4xl font-bold">₹0</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </div>

            <ul className="space-y-4 mb-8">
              {features.free.map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Button 
              className="w-full text-lg h-12" 
              variant="outline"
              onClick={() => router.push('/signup')}
            >
              Get Started
            </Button>
          </Card>

          {/* Pro Plan */}
          <Card className="p-8 relative border-primary/50 hover:shadow-lg transition-shadow duration-300 bg-gradient-to-b from-background to-primary/5">
            <div className="absolute -top-3 right-4 bg-primary text-primary-foreground px-4 py-1 text-sm rounded-full font-medium flex items-center gap-1">
              <Sparkles className="h-4 w-4" />
              Most Popular
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-2">Pro Plan</h2>
              <p className="text-muted-foreground">For unlimited access</p>
              <div className="mt-4">
                <span className="text-4xl font-bold">₹99</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </div>

            <ul className="space-y-4 mb-8">
              {features.pro.map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>




            <Button 
              className="w-full text-lg h-12 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
              onClick={handleSubscribe}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                'Upgrade to Pro'
              )}
            </Button>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto text-left grid gap-6">
            <div>
              <h3 className="font-semibold mb-2">What happens after I upgrade?</h3>
              <p className="text-muted-foreground">After upgrading, you'll immediately get access to all Pro features. Your account will be upgraded instantly after successful payment.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Can I cancel anytime?</h3>
              <p className="text-muted-foreground">Yes, you can cancel your subscription at any time. You'll continue to have Pro access until the end of your billing period.</p>
            </div>
          </div>
        </div>

        {/* Contact Support */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground">
            Have questions? Contact our support team at{' '}
            <a href="mailto:support@mindguard.com" className="text-primary hover:underline">
              support@mindguard.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
} 