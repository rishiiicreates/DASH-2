import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  order_id: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
}

interface UseRazorpayReturn {
  isLoaded: boolean;
  isError: boolean;
  initPayment: (options: RazorpayOptions) => Promise<string>;
}

export function useRazorpay(): UseRazorpayReturn {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const { toast } = useToast();
  
  // Load Razorpay script on mount
  useEffect(() => {
    if ((window as any).Razorpay) {
      setIsLoaded(true);
      return;
    }
    
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    
    script.onload = () => {
      setIsLoaded(true);
    };
    
    script.onerror = () => {
      setIsError(true);
      toast({
        title: "Error",
        description: "Failed to load Razorpay. Please try again later.",
        variant: "destructive"
      });
    };
    
    document.body.appendChild(script);
    
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [toast]);
  
  const initPayment = async (options: RazorpayOptions): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!isLoaded) {
        reject(new Error("Razorpay not loaded yet"));
        return;
      }
      
      try {
        const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_key';
        const razorpay = new (window as any).Razorpay({
          ...options,
          key: razorpayKey,
          handler: function(response: any) {
            resolve(response.razorpay_payment_id);
          },
        });
        
        razorpay.on('payment.failed', function(response: any) {
          reject(new Error(response.error.description));
        });
        
        razorpay.open();
      } catch (error) {
        reject(error);
      }
    });
  };
  
  return {
    isLoaded,
    isError,
    initPayment
  };
}
