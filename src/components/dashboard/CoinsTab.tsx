"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Coins,
  Plus,
  Minus,
  Wallet,
  History,
  Zap,
  ShoppingCart,
  Crown,
  Gift,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface CoinTransaction {
  id: string;
  amount: number;
  type: "PURCHASE" | "SPEND" | "BONUS";
  description: string;
  createdAt: string;
}

export default function CoinsTab() {
  const router = useRouter();
  const [coinBalance, setCoinBalance] = useState<number>(0);
  const [selectedAmount, setSelectedAmount] = useState<number>(100);
  const [coinPrice] = useState<number>(0.1); // 0.10 SAR per coin
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState<CoinTransaction[]>([]);
  const [isLoadingBalance, setIsLoadingBalance] = useState(true);

  // Quick selection amounts
  const quickAmounts = [100, 500, 1000, 2000, 5000];

  useEffect(() => {
    fetchCoinBalance();
    fetchTransactions();
  }, []);

  const fetchCoinBalance = async () => {
    try {
      const response = await fetch("/api/coins/balance");
      const data = await response.json();
      if (data.success) {
        setCoinBalance(data.balance);
      }
    } catch (error) {
      console.error("خطأ في جلب رصيد الكوينز:", error);
    } finally {
      setIsLoadingBalance(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await fetch("/api/coins/transactions?limit=10");
      const data = await response.json();
      if (data.success) {
        setTransactions(data.transactions);
      }
    } catch (error) {
      console.error("خطأ في جلب المعاملات:", error);
    }
  };

  const handleAmountChange = (value: number) => {
    if (value >= 50 && value <= 5000) {
      setSelectedAmount(value);
    }
  };

  const incrementAmount = () => {
    const newAmount = selectedAmount + 50;
    if (newAmount <= 5000) {
      setSelectedAmount(newAmount);
    }
  };

  const decrementAmount = () => {
    const newAmount = selectedAmount - 50;
    if (newAmount >= 50) {
      setSelectedAmount(newAmount);
    }
  };

  const calculateTotal = () => {
    return (selectedAmount * coinPrice).toFixed(2);
  };

  const addToCart = async () => {
    try {
      setIsLoading(true);

      // Create coin product for cart
      const coinProduct = {
        title: `${selectedAmount} كوين`,
        description: `باقة ${selectedAmount} كوين لاستخدام مولد المحتوى بالذكاء الاصطناعي - رقمي`,
        price: parseFloat(calculateTotal()),
        image: '/api/placeholder/64/64',
        category: 'Digital Currency',
        features: JSON.stringify(['منتج رقمي', 'كوينز', 'فوري', `coinAmount:${selectedAmount}`]),
        isActive: true
      };

      // إضافة المنتج مباشرة عبر API بدلاً من localStorage
      const response = await fetch('/api/cart', {
        method: 'PUT', // استخدام PUT للإضافة المباشرة
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          coinAmount: selectedAmount,
          quantity: 1 
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(
          `تم إضافة ${selectedAmount} كوين إلى السلة بقيمة ${calculateTotal()} ريال!`,
          {
            description: "يمكنك الآن إتمام عملية الشراء من السلة",
            action: {
              label: "عرض السلة",
              onClick: () => router.push("/cart"),
            },
          }
        );
        
        // تحديث السلة في الواجهة
        window.dispatchEvent(new CustomEvent('cartUpdated'));
      } else {
        throw new Error(data.error || "فشل في إضافة الكوينز للسلة");
      }
    } catch (error) {
      console.error("خطأ في إضافة الكوينز للسلة:", error);
      toast.error(`حدث خطأ أثناء إضافة الكوينز للسلة: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "PURCHASE":
        return <Plus className="h-4 w-4 text-green-600" />;
      case "SPEND":
        return <Minus className="h-4 w-4 text-red-600" />;
      case "BONUS":
        return <Gift className="h-4 w-4 text-purple-600" />;
      default:
        return <Coins className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 via-orange-400 to-amber-500 mb-4 shadow-lg">
          <Coins className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          إدارة الكوينز
        </h1>
        <p className="text-gray-600">
          اشتري الكوينز واستخدمها لإنشاء محتوى ذكي بالذكاء الاصطناعي
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Current Balance */}
        <Card className="lg:col-span-1">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
              <Wallet className="h-5 w-5 text-blue-600" />
              <span>رصيدك الحالي</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            {isLoadingBalance ? (
              <div className="animate-pulse">
                <div className="h-12 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-20 mx-auto"></div>
              </div>
            ) : (
              <>
                <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 mb-2">
                  {coinBalance.toLocaleString()}
                </div>
                <p className="text-gray-600">كوين متاح</p>
                {coinBalance > 0 && (
                  <Badge variant="outline" className="mt-2">
                    <Crown className="h-3 w-3 ml-1" />
                    عضو مميز
                  </Badge>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Purchase Coins */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
              <ShoppingCart className="h-5 w-5 text-green-600" />
              <span>شراء الكوينز</span>
            </CardTitle>
            <p className="text-sm text-gray-600">
              اختر عدد الكوينز التي تريد شراءها (السعر: {coinPrice} ريال لكل كوين)
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Amount Selection */}
            <div className="space-y-4">
              <Label htmlFor="coin-amount" className="text-base font-medium">
                عدد الكوينز
              </Label>
              
              {/* Quick Selection Buttons */}
              <div className="grid grid-cols-5 gap-2 mb-4">
                {quickAmounts.map((amount) => (
                  <Button
                    key={amount}
                    variant={selectedAmount === amount ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedAmount(amount)}
                    className="text-xs"
                  >
                    {amount}
                  </Button>
                ))}
              </div>

              {/* Manual Input with +/- buttons */}
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={decrementAmount}
                  disabled={selectedAmount <= 50}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                
                <Input
                  id="coin-amount"
                  type="number"
                  value={selectedAmount}
                  onChange={(e) => handleAmountChange(parseInt(e.target.value) || 50)}
                  min={50}
                  max={5000}
                  step={50}
                  className="text-center font-semibold"
                />
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={incrementAmount}
                  disabled={selectedAmount >= 5000}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <p className="text-xs text-gray-500 text-center">
                الحد الأدنى: 50 كوين | الحد الأقصى: 5000 كوين
              </p>
            </div>

            {/* Price Calculation */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700">عدد الكوينز:</span>
                <span className="font-semibold">{selectedAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700">سعر الكوين الواحد:</span>
                <span className="font-semibold">{coinPrice} ريال</span>
              </div>
              <hr className="my-2 border-yellow-200" />
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">المجموع:</span>
                <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-orange-600">
                  {calculateTotal()} ريال
                </span>
              </div>
            </div>

            {/* Add to Cart Button */}
            <Button
              onClick={addToCart}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold py-3 rounded-lg shadow-lg transform transition hover:scale-105"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>جاري الإضافة...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <ShoppingCart className="h-5 w-5" />
                  <span>إضافة إلى السلة</span>
                  <Zap className="h-4 w-4" />
                </div>
              )}
            </Button>

            <p className="text-xs text-center text-gray-500">
              💡 ستتم إضافة الكوينز لرصيدك فور إتمام عملية الدفع
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
            <History className="h-5 w-5 text-purple-600" />
            <span>سجل المعاملات</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <History className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-500">لا توجد معاملات بعد</p>
              <p className="text-sm text-gray-400">
                ستظهر هنا جميع معاملات الكوينز الخاصة بك
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white">
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {transaction.description}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(transaction.createdAt).toLocaleDateString('ar-SA')}
                      </p>
                    </div>
                  </div>
                  <div className="text-left">
                    <p
                      className={`font-semibold ${
                        transaction.type === "PURCHASE" || transaction.type === "BONUS"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaction.type === "PURCHASE" || transaction.type === "BONUS" ? "+" : "-"}
                      {transaction.amount.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">كوين</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 