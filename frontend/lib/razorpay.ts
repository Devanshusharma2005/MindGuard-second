export const RAZORPAY_PLANS = {
  PRO: {
    name: 'Pro Plan',
    amount: 1900, // Amount in paise (₹19)
    currency: 'INR',
    description: 'MindGuard Pro Subscription'
  }
};

export const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
}; 