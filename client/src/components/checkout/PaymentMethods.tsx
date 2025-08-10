import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { 
  CreditCard, 
  Smartphone, 
  Wallet,
  Lock,
  CheckCircle
} from "lucide-react";

interface PaymentMethodsProps {
  selectedMethod: string;
  onMethodChange: (method: string) => void;
  onPaymentComplete: (paymentData: any) => void;
  total: number;
}

const PaymentMethods: React.FC<PaymentMethodsProps> = ({
  selectedMethod,
  onMethodChange,
  onPaymentComplete,
  total,
}) => {
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const paymentMethods = [
    {
      id: "card",
      name: "Credit/Debit Card",
      icon: <CreditCard className="h-5 w-5" />,
      description: "Visa, Mastercard, American Express",
      popular: true,
    },
    {
      id: "paypal",
      name: "PayPal",
      icon: <Wallet className="h-5 w-5" />,
      description: "Pay with your PayPal account",
      popular: false,
    },
    {
      id: "apple_pay",
      name: "Apple Pay",
      icon: <Smartphone className="h-5 w-5" />,
      description: "Touch ID or Face ID",
      popular: false,
    },
    {
      id: "google_pay",
      name: "Google Pay",
      icon: <Smartphone className="h-5 w-5" />,
      description: "Pay with Google",
      popular: false,
    },
  ];

  const handleCardInputChange = (field: string, value: string) => {
    setCardDetails(prev => ({ ...prev, [field]: value }));
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const paymentData = {
      method: selectedMethod,
      amount: total,
      currency: "USD",
      status: "completed",
      transactionId: `txn_${Date.now()}`,
      ...(selectedMethod === "card" && { cardLast4: cardDetails.number.slice(-4) }),
    };
    
    setIsProcessing(false);
    onPaymentComplete(paymentData);
  };

  const isCardValid = () => {
    return cardDetails.number.replace(/\s/g, '').length >= 16 &&
           cardDetails.expiry.length >= 5 &&
           cardDetails.cvv.length >= 3 &&
           cardDetails.name.length >= 2;
  };

  const canProceed = () => {
    if (selectedMethod === "card") {
      return isCardValid();
    }
    return selectedMethod !== "";
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Payment Method
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={selectedMethod} onValueChange={onMethodChange}>
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <div key={method.id} className="flex items-center space-x-3">
                  <RadioGroupItem value={method.id} id={method.id} />
                  <Label 
                    htmlFor={method.id} 
                    className="flex-1 flex items-center justify-between cursor-pointer p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      {method.icon}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{method.name}</span>
                          {method.popular && (
                            <Badge variant="secondary" className="text-xs">
                              Popular
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{method.description}</p>
                      </div>
                    </div>
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Card Details Form */}
      {selectedMethod === "card" && (
        <Card>
          <CardHeader>
            <CardTitle>Card Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={cardDetails.number}
                onChange={(e) => handleCardInputChange("number", formatCardNumber(e.target.value))}
                maxLength={19}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input
                  id="expiry"
                  placeholder="MM/YY"
                  value={cardDetails.expiry}
                  onChange={(e) => handleCardInputChange("expiry", formatExpiry(e.target.value))}
                  maxLength={5}
                />
              </div>
              <div>
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  value={cardDetails.cvv}
                  onChange={(e) => handleCardInputChange("cvv", e.target.value.replace(/\D/g, ''))}
                  maxLength={4}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="cardName">Cardholder Name</Label>
              <Input
                id="cardName"
                placeholder="John Doe"
                value={cardDetails.name}
                onChange={(e) => handleCardInputChange("name", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Other Payment Method Info */}
      {selectedMethod === "paypal" && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Wallet className="h-12 w-12 mx-auto mb-4 text-blue-600" />
              <h3 className="text-lg font-medium mb-2">PayPal Payment</h3>
              <p className="text-gray-600 mb-4">
                You will be redirected to PayPal to complete your payment securely.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {(selectedMethod === "apple_pay" || selectedMethod === "google_pay") && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Smartphone className="h-12 w-12 mx-auto mb-4 text-gray-600" />
              <h3 className="text-lg font-medium mb-2">
                {selectedMethod === "apple_pay" ? "Apple Pay" : "Google Pay"}
              </h3>
              <p className="text-gray-600 mb-4">
                Use your {selectedMethod === "apple_pay" ? "Touch ID, Face ID, or passcode" : "fingerprint or PIN"} to pay.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment Button */}
      <Button
        onClick={handlePayment}
        disabled={!canProceed() || isProcessing}
        className="w-full py-6 text-lg font-medium"
        size="lg"
      >
        {isProcessing ? (
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            Processing Payment...
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Pay ${total.toFixed(2)}
          </div>
        )}
      </Button>

      {/* Security Notice */}
      <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
        <CheckCircle className="h-4 w-4" />
        <span>Your payment information is secure and encrypted</span>
      </div>
    </div>
  );
};

export default PaymentMethods;
