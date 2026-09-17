import React, { useState } from 'react';
import { useFarm } from '../../context/FarmContext';
import { t } from '../../translations';
import { NotificationItem } from '../../types';
import {
  Bell,
  Check,
  Trash2,
  Filter,
  CloudRain,
  Droplets,
  Sprout,
  ShieldAlert,
  TrendingUp,
  AlertCircle,
  Plus,
} from 'lucide-react';

export const NotificationsView: React.FC = () => {
  const {
    notifications,
    markAsRead,
    markAllAsRead,
    dismissNotification,
    addNotification,
    unreadCount,
    setActiveTab,
    preferredLanguage,
  } = useFarm();
  const isMl = preferredLanguage === 'ml';

  const [activeFilter, setActiveFilter] = useState<string>('all');

  const categories = [
    { id: 'all', label: isMl ? 'എല്ലാ അറിയിപ്പുകളും' : 'All Alerts' },
    { id: 'weather', label: isMl ? 'കാലാവസ്ഥ' : 'Weather', icon: CloudRain },
    { id: 'irrigation', label: isMl ? 'ജലസേചനം' : 'Irrigation', icon: Droplets },
    { id: 'fertilizer', label: isMl ? 'വളപ്രയോഗം' : 'Fertilizer', icon: Sprout },
    { id: 'disease', label: isMl ? 'രോഗസാധ്യത' : 'Disease Risk', icon: ShieldAlert },
    { id: 'market', label: isMl ? 'വിപണി വില' : 'Market Prices', icon: TrendingUp },
  ];

  const filteredNotifications = notifications.filter((item) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'weather' && (item.category === 'weather' || item.category === 'rain')) return true;
    return item.category === activeFilter;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'weather':
      case 'rain':
        return <CloudRain className="w-5 h-5 text-blue-600" />;
      case 'irrigation':
        return <Droplets className="w-5 h-5 text-teal-600" />;
      case 'fertilizer':
        return <Sprout className="w-5 h-5 text-emerald-600" />;
      case 'disease':
        return <ShieldAlert className="w-5 h-5 text-amber-600" />;
      case 'market':
        return <TrendingUp className="w-5 h-5 text-purple-600" />;
      default:
        return <Bell className="w-5 h-5 text-emerald-600" />;
    }
  };

  const translateNotification = (notif: NotificationItem) => {
    if (!isMl) return { title: notif.title, message: notif.message, timestamp: notif.timestamp };
    switch (notif.id) {
      case 'notif-1':
        return {
          title: 'കേരള GKMS കാർഷിക അലേർട്ട്: നാളെ കനത്ത മഴ സാധ്യത',
          message: '75-85% മഴയ്ക്ക് സാധ്യതയുണ്ടെന്ന് പ്രാദേശിക കാലാവസ്ഥാ കേന്ദ്രം പ്രവചിക്കുന്നു. ഇലകളിൽ തളിക്കുന്ന മരുന്നുകൾ മാറ്റിവെക്കുക, ചാലുകളിലെ തടസ്സങ്ങൾ നീക്കുക.',
          timestamp: '15 മിനിറ്റ് മുൻപ്',
        };
      case 'notif-2':
        return {
          title: 'ദ്രുതവാട്ടം & അഴുകൽ രോഗ നിരീക്ഷണം',
          message: 'കൂടിയ ഈർപ്പവും (>80%) തണുത്ത ഇലകളും കുരുമുളകിൽ ദ്രുതവാട്ടത്തിനും കുമിൾ രോഗങ്ങൾക്കും കാരണമാകാം.',
          timestamp: '1 മണിക്കൂർ മുൻപ്',
        };
      case 'notif-3':
        return {
          title: 'സ്മാർട്ട് ഈർപ്പ സന്തുലിതാവസ്ഥ: നന മാറ്റിവെക്കുക',
          message: 'മണ്ണിലെ ഈർപ്പം 48% ഉണ്ട്, മഴയ്ക്ക് സാധ്യതയുള്ളതിനാൽ വേരുകൾക്ക് ആവശ്യമായ വെള്ളം സ്വാഭാവികമായി ലഭിക്കും.',
          timestamp: '2 മണിക്കൂർ മുൻപ്',
        };
      case 'notif-4':
        return {
          title: 'KAU സോയിൽ ഹെൽത്ത് കാർഡ്: അമ്ലതയും ഫോസ്ഫറസ് ലഭ്യതയും',
          message: 'അമ്ലഗുണമുള്ള മണ്ണ് (pH 5.4) ഫോസ്ഫറസ് ലഭ്യത കുറയ്ക്കും. ഏക്കറിന് 250 കി.ഗ്രാം ഡോളോമൈറ്റും കമ്പോസ്റ്റും ചേർക്കുക.',
          timestamp: 'ഇന്നലെ',
        };
      case 'notif-5':
        return {
          title: 'കേരള ചന്തവില കുതിപ്പ്: കുരുമുളകിനും ഏലത്തിനും ഉയർന്ന വില',
          message: 'സുൽത്താൻ ബത്തേരിയിൽ MG-1 കുരുമുളക് വില ക്വിന്റലിന് ₹67,200 ആയി ഉയർന്നു (+3.4%). കയറ്റുമതി ആവശ്യക്കാർ വർദ്ധിച്ചു.',
          timestamp: 'ഇന്നലെ',
        };
      default:
        return { title: notif.title, message: notif.message, timestamp: notif.timestamp };
    }
  };

  const handleSimulateAlert = () => {
    const sampleAlerts = isMl
      ? [
          {
            title: 'ശക്തമായ കാറ്റ് മുന്നറിയിപ്പ്',
            message: 'വയനാടൻ താഴ്‌വരയിൽ മണിക്കൂറിൽ 25 കിലോമീറ്ററിലധികം വേഗതയുള്ള കാറ്റ് രേഖപ്പെടുത്തി. പന്തലുകൾ ഉടൻ ഉറപ്പിക്കുക.',
            category: 'weather' as const,
            priority: 'high' as const,
            read: false,
            actionUrl: 'weather',
          },
          {
            title: 'വിപണി വില വർദ്ധനവ്: തക്കാളി ക്വിന്റലിന് ₹150 കൂടി',
            message: 'മൊത്തവ്യാപാര കേന്ദ്രങ്ങളിൽ വരവ് കുറഞ്ഞതോടെ വില ഉയർന്നു. ഉത്പന്നങ്ങൾ വിപണിയിലെത്തിക്കാൻ നല്ല സമയം.',
            category: 'market' as const,
            priority: 'medium' as const,
            read: false,
            actionUrl: 'market',
          },
          {
            title: 'മണ്ണിലെ ഈർപ്പം കുറയുന്നു',
            message: 'ബ്ലോക്ക് ബിയിലെ സെൻസർ 30%-ൽ താഴെ രേഖപ്പെടുത്തി. ഡ്രിപ്പ് എമിറ്ററുകൾ പരിശോധിക്കുക.',
            category: 'irrigation' as const,
            priority: 'medium' as const,
            read: false,
            actionUrl: 'irrigation',
          },
        ]
      : [
          {
            title: 'Sudden Wind Gust Advisory',
            message: 'Wind speeds exceeding 25 km/h recorded in Wayanad valley. Secure crop trellises immediately.',
            category: 'weather' as const,
            priority: 'high' as const,
            read: false,
            actionUrl: 'weather',
          },
          {
            title: 'Mandi Rate Spike: Tomato up ₹150/qtl',
            message: 'Wholesale buyers reporting lower arrivals at APMC. Good window to load crates.',
            category: 'market' as const,
            priority: 'medium' as const,
            read: false,
            actionUrl: 'market',
          },
          {
            title: 'Soil Moisture Nearing Lower Threshold',
            message: 'Sensor 1 in Block B dropped below 30%. Verify drip dripper emitters.',
            category: 'irrigation' as const,
            priority: 'medium' as const,
            read: false,
            actionUrl: 'irrigation',
          },
        ];

    const random = sampleAlerts[Math.floor(Math.random() * sampleAlerts.length)];
    addNotification(random);
  };

  const getPriorityLabel = (priority?: string) => {
    if (!isMl) return `${priority || 'normal'} priority`;
    switch (priority) {
      case 'high': return 'ഉയർന്ന മുൻഗണന';
      case 'medium': return 'ഇടത്തരം മുൻഗണന';
      case 'low': return 'കുറഞ്ഞ മുൻഗണന';
      default: return 'സാധാരണ';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-5 rounded-3xl border border-emerald-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight font-['Outfit'] flex items-center gap-2">
            <Bell className="w-6 h-6 text-emerald-600" />
            {isMl ? 'കർഷക അറിയിപ്പുകളും സ്മാർട്ട് അലേർട്ടുകളും' : 'Farmer Notifications & Smart Alerts'}
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            {isMl
              ? 'മഴ, ജലസേചനം, രോഗസാധ്യത, വിപണി വില വർദ്ധനവ് എന്നിവയെക്കുറിച്ചുള്ള തത്സമയ മുന്നറിയിപ്പുകൾ.'
              : 'Real-time advisory alerts regarding rainfall, irrigation schedules, disease risks, and price spikes.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 transition-colors cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{isMl ? 'എല്ലാം വായിച്ചതായി അടയാളപ്പെടുത്തുക' : 'Mark All as Read'}</span>
            </button>
          )}
          <button
            onClick={handleSimulateAlert}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-800 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isMl ? 'ടെസ്റ്റ് അലേർട്ട് സൃഷ്ടിക്കുക' : 'Simulate Live Alert'}</span>
          </button>
        </div>
      </div>

      {/* Category filter tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveFilter(cat.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeFilter === cat.id
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-emerald-50 hover:text-emerald-950'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-emerald-100 text-center space-y-2">
            <Check className="w-8 h-8 text-emerald-600 mx-auto" />
            <h3 className="font-bold text-gray-800 text-base">
              {isMl ? 'പുതിയ അറിയിപ്പുകളൊന്നുമില്ല!' : 'All Caught Up!'}
            </h3>
            <p className="text-xs text-gray-500">
              {isMl ? 'ഈ വിഭാഗത്തിൽ പുതിയ മുന്നറിയിപ്പുകൾ ലഭ്യമല്ല.' : 'No active alerts in this category.'}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notif) => {
            const translated = translateNotification(notif);
            return (
              <div
                key={notif.id}
                className={`bg-white p-4 sm:p-5 rounded-3xl border transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-4 ${
                  !notif.read
                    ? 'border-emerald-300 ring-2 ring-emerald-400/20 shadow-xs'
                    : 'border-gray-150 shadow-2xs opacity-85'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                    {getCategoryIcon(notif.category)}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-bold text-gray-900">{translated.title}</h3>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                      )}
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          notif.priority === 'high'
                            ? 'bg-rose-100 text-rose-800'
                            : notif.priority === 'medium'
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {getPriorityLabel(notif.priority)}
                      </span>
                      <span className="text-[11px] text-gray-400 font-medium">
                        {translated.timestamp}
                      </span>
                    </div>

                    <p className="text-xs text-gray-700 leading-relaxed max-w-3xl">
                      {translated.message}
                    </p>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0 pt-2 sm:pt-0">
                  {notif.actionUrl && (
                    <button
                      onClick={() => {
                        markAsRead(notif.id);
                        setActiveTab(notif.actionUrl!);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      {isMl ? 'തുറക്കുക' : 'Open View'}
                    </button>
                  )}

                  {!notif.read && (
                    <button
                      onClick={() => markAsRead(notif.id)}
                      className="p-1.5 text-gray-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                      title={isMl ? 'വായിച്ചതായി അടയാളപ്പെടുത്തുക' : 'Mark as read'}
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    onClick={() => dismissNotification(notif.id)}
                    className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title={isMl ? 'ഒഴിവാക്കുക' : 'Dismiss notification'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
