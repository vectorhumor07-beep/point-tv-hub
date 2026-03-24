import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Check, Star, Zap, Crown, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SubscriptionPage = () => {
  const { language } = useApp();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<3 | 6 | 12>(12);

  const plans = [
    {
      months: 3 as const,
      price: 29.99,
      monthlyPrice: 9.99,
      icon: Zap,
      label: language === 'tr' ? '3 Aylık' : '3 Months',
      features: language === 'tr'
        ? ['HD Kalite', '1 Ekran', '44+ Kanal', 'Temel Destek']
        : ['HD Quality', '1 Screen', '44+ Channels', 'Basic Support'],
      color: 'from-blue-500 to-cyan-500',
      popular: false,
    },
    {
      months: 6 as const,
      price: 49.99,
      monthlyPrice: 8.33,
      icon: Star,
      label: language === 'tr' ? '6 Aylık' : '6 Months',
      features: language === 'tr'
        ? ['Full HD Kalite', '2 Ekran', '44+ Kanal', 'Öncelikli Destek', 'Catch-Up TV']
        : ['Full HD Quality', '2 Screens', '44+ Channels', 'Priority Support', 'Catch-Up TV'],
      color: 'from-primary to-yellow-400',
      popular: true,
    },
    {
      months: 12 as const,
      price: 79.99,
      monthlyPrice: 6.66,
      icon: Crown,
      label: language === 'tr' ? '12 Aylık' : '12 Months',
      features: language === 'tr'
        ? ['4K Ultra HD', '4 Ekran', '44+ Kanal', '7/24 VIP Destek', 'Catch-Up TV', 'Multi-Screen', 'VOD Kütüphanesi']
        : ['4K Ultra HD', '4 Screens', '44+ Channels', '24/7 VIP Support', 'Catch-Up TV', 'Multi-Screen', 'VOD Library'],
      color: 'from-purple-500 to-pink-500',
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen pt-20 pb-12 px-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-5 h-5" /> {language === 'tr' ? 'Geri' : 'Back'}
      </button>

      <div className="text-center mb-12">
        <h1 className="font-display text-4xl font-bold mb-3">
          {language === 'tr' ? 'Abonelik Planları' : 'Subscription Plans'}
        </h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          {language === 'tr'
            ? 'Size uygun planı seçin ve hemen izlemeye başlayın'
            : 'Choose the perfect plan and start watching today'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {plans.map(plan => {
          const Icon = plan.icon;
          const isSelected = selected === plan.months;
          return (
            <div
              key={plan.months}
              onClick={() => setSelected(plan.months)}
              className={`relative glass-card p-6 cursor-pointer transition-all duration-300 ${
                isSelected ? 'ring-2 ring-primary scale-105 glow-accent' : 'hover:scale-102'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                  {language === 'tr' ? 'En Popüler' : 'Most Popular'}
                </div>
              )}

              <div className="text-center pt-2">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${plan.color} mx-auto mb-4 flex items-center justify-center`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-display text-xl font-bold mb-1">{plan.label}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-display font-bold text-primary">${plan.price}</span>
                  <span className="text-muted-foreground text-sm ml-1">/ {plan.months} {language === 'tr' ? 'ay' : 'mo'}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-6">
                  ${plan.monthlyPrice}/{language === 'tr' ? 'ay' : 'mo'}
                </p>
              </div>

              <div className="space-y-3 mb-6">
                {plan.features.map((feat, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-primary flex-shrink-0" />
                    {feat}
                  </div>
                ))}
              </div>

              <button
                className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${
                  isSelected
                    ? 'bg-primary text-primary-foreground glow-accent'
                    : 'bg-secondary text-foreground hover:bg-secondary/80'
                }`}
              >
                {isSelected
                  ? (language === 'tr' ? 'Seçildi ✓' : 'Selected ✓')
                  : (language === 'tr' ? 'Planı Seç' : 'Select Plan')}
              </button>
            </div>
          );
        })}
      </div>

      <div className="text-center mt-10">
        <button className="px-10 py-4 rounded-xl bg-primary text-primary-foreground font-bold text-lg hover:opacity-90 transition-all glow-accent">
          {language === 'tr' ? 'Şimdi Abone Ol' : 'Subscribe Now'}
        </button>
        <p className="text-xs text-muted-foreground mt-3">
          {language === 'tr' ? 'İstediğiniz zaman iptal edebilirsiniz' : 'Cancel anytime, no commitment'}
        </p>
      </div>
    </div>
  );
};

export default SubscriptionPage;
