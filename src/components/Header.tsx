import React, { useState } from 'react';
import { useFarm } from '../context/FarmContext';
import { t, translateDistrict, translateNotification } from '../translations';
import {
  Sprout,
  Bell,
  Bot,
  Activity,
  Menu,
  X,
  CloudRain,
  Check,
  ExternalLink,
  ChevronDown,
  MapPin,
  Languages,
  Mic,
} from 'lucide-react';

interface HeaderProps {
  onToggleSidebar: () => void;
  isMobileMenuOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, isMobileMenuOpen }) => {
  const {
    demoMode,
    setDemoMode,
    autoSimulateSensors,
    setAutoSimulateSensors,
    unreadCount,
    notifications,
    markAsRead,
    markAllAsRead,
    setActiveTab,
    setIsChatOpen,
    farmData,
    setIsLocationModalOpen,
    selectedDistrict,
    isLocationLoading,
    preferredLanguage,
    setPreferredLanguage,
  } = useFarm();

  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const isMl = preferredLanguage === 'ml';

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-emerald-100/80 px-4 lg:px-7 py-3 flex items-center justify-between shadow-xs">
      {/* Left: Mobile hamburger & Brand */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 text-emerald-900 hover:bg-emerald-50 rounded-lg transition-colors"
          aria-label={isMl ? 'മെനു തുറക്കുക' : 'Toggle Navigation Menu'}
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-sm shadow-emerald-200">
            <Sprout className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-emerald-950 font-['Outfit']">
                {isMl ? 'ഡാർത്തി AI' : 'DARTHI AI'}
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100/80 text-emerald-800 border border-emerald-200">
                {isMl ? 'കേരള ഹൈടെക് കാർഷിക പ്ലാറ്റ്‌ഫോം' : 'Kerala Precision Ag'}
              </span>
            </div>
            <p className="text-[11px] text-emerald-800/80 font-medium hidden md:block">
              {isMl ? 'കൃത്യതയോടെ പ്രവചിക്കുക • വിള സംരക്ഷിക്കുക • ലാഭം നേടുക' : 'Predict. Protect. Prosper.'}
            </p>
          </div>
        </div>
      </div>

      {/* Center: Interactive Kerala Location Switcher Pill */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        <button
          onClick={() => setIsLocationModalOpen(true)}
          disabled={isLocationLoading}
          className="group flex items-center gap-2 px-3 py-1.5 bg-emerald-50/80 hover:bg-emerald-100/80 border border-emerald-200 rounded-full text-xs text-emerald-900 transition shadow-2xs cursor-pointer active:scale-98"
          title={isMl ? 'കേരള ലൊക്കേഷൻ മാറ്റുക (ജില്ലകൾ, താലൂക്കുകൾ, ജിപിഎസ്)' : 'Click to change Kerala Location (Districts, Taluks, GPS)'}
        >
          <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
            <MapPin className={`w-3 h-3 ${isLocationLoading ? 'animate-bounce' : ''}`} />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-emerald-950 max-w-[120px] sm:max-w-[200px] truncate">
              {isMl && farmData.malayalamDistrict ? `${farmData.location.split(',')[0]} (${farmData.malayalamDistrict})` : farmData.location}
            </span>
            {farmData.malayalamDistrict && !isMl && (
              <span className="text-[10px] font-semibold bg-emerald-200/70 text-emerald-800 px-1.5 py-0.2 rounded hidden sm:inline">
                {farmData.malayalamDistrict}
              </span>
            )}
          </div>
          <span className="text-[11px] font-semibold text-emerald-700 underline decoration-emerald-400 group-hover:text-emerald-900 ml-0.5">
            {t('changeLocation', preferredLanguage)}
          </span>
        </button>

        {/* Live Weather Probability Badge */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-50/70 border border-blue-100 rounded-full text-xs text-blue-900">
          <CloudRain className="w-3.5 h-3.5 text-blue-600" />
          <span className="font-semibold">{farmData.rainfallProbability}%</span>
          <span className="text-blue-700 text-[11px]">{t('rainChance', preferredLanguage)}</span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Demo Mode Pill */}
        <div className="flex items-center">
          <button
            onClick={() => setDemoMode(!demoMode)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
              demoMode
                ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                : 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
            }`}
            title={isMl ? 'ഡെമോ ഡാറ്റയും ലൈവ് IoT യും തമ്മിൽ മാറ്റുക' : 'Click to toggle Demo Mode vs Live Hardware Feed'}
          >
            <span className={`w-2 h-2 rounded-full ${demoMode ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
            <span>{isMl ? (demoMode ? 'ഡെമോ ഡാറ്റ' : 'ലൈവ് IoT') : (demoMode ? 'Demo Data' : 'Live IoT')}</span>
          </button>
        </div>

        {/* Live IoT Sensor Status */}
        <button
          onClick={() => setAutoSimulateSensors(!autoSimulateSensors)}
          className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
            autoSimulateSensors
              ? 'bg-teal-50 text-teal-800 border-teal-300'
              : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
          }`}
          title={isMl ? 'IoT സെൻസർ സിമുലേഷൻ മാറ്റുക' : 'Toggle automatic IoT sensor data stream simulation'}
        >
          <Activity className={`w-3.5 h-3.5 ${autoSimulateSensors ? 'text-teal-600 animate-spin' : 'text-gray-500'}`} />
          <span>{isMl ? (autoSimulateSensors ? 'IoT സ്ട്രീമിംഗ്' : 'സെൻസറുകൾ സജീവം') : (autoSimulateSensors ? 'IoT Streaming' : 'Sensors Ready')}</span>
        </button>

        {/* Notifications Bell with Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            className="relative p-2 rounded-lg text-emerald-900 hover:bg-emerald-50 transition-colors"
            aria-label={t('notifications', preferredLanguage)}
          >
            <Bell className="w-5 h-5 text-emerald-800" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifMenu && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-emerald-100 py-3 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 pb-2 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm text-gray-900">{t('notifications', preferredLanguage)}</h3>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      {unreadCount} {isMl ? 'പുതിയത്' : 'new'}
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-emerald-700 hover:text-emerald-900 font-medium cursor-pointer"
                  >
                    {t('markAllRead', preferredLanguage)}
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-gray-50 px-2 py-1">
                {notifications.slice(0, 4).map((notif) => {
                  const localized = translateNotification(notif, preferredLanguage);
                  return (
                    <div
                      key={notif.id}
                      onClick={() => {
                        markAsRead(notif.id);
                        setActiveTab('notifications');
                        setShowNotifMenu(false);
                      }}
                      className={`p-2.5 rounded-xl cursor-pointer hover:bg-emerald-50/70 transition-colors ${
                        !notif.read ? 'bg-emerald-50/40' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-medium text-xs text-gray-900 leading-tight">
                          {localized.title}
                        </p>
                        <span className="text-[10px] text-gray-600 shrink-0">{localized.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-gray-600 line-clamp-2 mt-1">
                        {localized.message}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="px-4 pt-2 border-t border-gray-100">
                <button
                  onClick={() => {
                    setActiveTab('notifications');
                    setShowNotifMenu(false);
                  }}
                  className="w-full text-center text-xs text-emerald-700 font-semibold hover:underline py-1 flex items-center justify-center gap-1 cursor-pointer"
                >
                  {t('viewAllAlerts', preferredLanguage)}
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bilingual Language Switcher (English / മലയാളം) */}
        <div className="flex items-center rounded-xl bg-gray-100/90 p-0.5 border border-gray-200 shadow-2xs">
          <button
            onClick={() => setPreferredLanguage('en')}
            className={`px-2 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              preferredLanguage === 'en'
                ? 'bg-white text-emerald-950 shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            title="Communicate in English"
          >
            EN
          </button>
          <button
            onClick={() => setPreferredLanguage('ml')}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
              preferredLanguage === 'ml'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            title="മലയാളത്തിൽ ആശയവിനിമയം നടത്തുക"
          >
            <span>മലയാളം</span>
          </button>
        </div>

        {/* DARTHI AI Floating Assistant quick launch */}
        <button
          onClick={() => setIsChatOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white text-xs font-semibold shadow-xs hover:shadow-md hover:from-emerald-700 hover:to-teal-700 transition-all active:scale-95 cursor-pointer group"
          title={isMl ? 'ഡാർത്തി AI സഹായി തുറക്കുക' : 'Open DARTHI AI Voice & Farming Assistant'}
        >
          <Bot className="w-4 h-4" />
          <span className="hidden sm:inline">
            {t('askDarthiAI', preferredLanguage)}
          </span>
          <span className="sm:hidden">{isMl ? 'AI' : 'AI'}</span>
          <span className="flex items-center gap-0.5 bg-white/20 px-1.5 py-0.5 rounded text-[10px] text-amber-200 group-hover:bg-amber-400 group-hover:text-emerald-950 transition-colors">
            <Mic className="w-3 h-3 text-amber-300 group-hover:text-emerald-950" />
            <span className="hidden md:inline font-bold">{isMl ? 'ശബ്ദം' : 'Voice'}</span>
          </span>
        </button>
      </div>
    </header>
  );
};
