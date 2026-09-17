import React from 'react';
import { useFarm } from '../context/FarmContext';
import { t, translateCrop } from '../translations';
import {
  LayoutDashboard,
  TestTube2,
  CloudSun,
  Sparkles,
  CheckCircle2,
  Droplets,
  Sprout,
  ShieldAlert,
  HeartPulse,
  TrendingUp,
  Bell,
  Settings,
  X,
  MapPin,
  Bot,
  Mic,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  id: string;
  label: string;
  mlLabel: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { activeTab, setActiveTab, unreadCount, farmData, preferredLanguage, setIsChatOpen } = useFarm();

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', mlLabel: 'ഡാഷ്‌ബോർഡ്', icon: LayoutDashboard },
    { id: 'soil', label: 'Soil Analysis', mlLabel: 'മണ്ണ് പരിശോധന', icon: TestTube2 },
    { id: 'weather', label: 'Weather Intelligence', mlLabel: 'കാലാവസ്ഥ', icon: CloudSun },
    { id: 'recommendation', label: 'Crop Recommendation', mlLabel: 'വിള നിർദ്ദേശം', icon: Sparkles },
    { id: 'feasibility', label: 'Crop Feasibility', mlLabel: 'വിള അനുയോജ്യത', icon: CheckCircle2 },
    { id: 'irrigation', label: 'Smart Irrigation', mlLabel: 'നനയ്ക്കൽ (ഇറിഗേഷൻ)', icon: Droplets },
    { id: 'fertilizer', label: 'Fertilizer Recommendation', mlLabel: 'വളപ്രയോഗം', icon: Sprout },
    { id: 'disease', label: 'Disease Risk', mlLabel: 'രോഗ സാധ്യത', icon: ShieldAlert },
    { id: 'health', label: 'Crop Health', mlLabel: 'വിള ആരോഗ്യം', icon: HeartPulse },
    { id: 'market', label: 'Profit & Market Analysis', mlLabel: 'മാർക്കറ്റ് & വിപണി വില', icon: TrendingUp },
    {
      id: 'notifications',
      label: 'Notifications',
      mlLabel: 'അറിയിപ്പുകൾ',
      icon: Bell,
      badge: unreadCount > 0 ? `${unreadCount}` : undefined,
      badgeColor: 'bg-amber-500 text-white',
    },
    { id: 'settings', label: 'Settings & Sensors', mlLabel: 'ക്രമീകരണങ്ങൾ', icon: Settings },
  ];

  const handleSelectTab = (id: string) => {
    setActiveTab(id);
    onClose();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-emerald-100 flex flex-col transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Mobile Header with close button */}
        <div className="flex items-center justify-between p-4 lg:hidden border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-sm">
              D
            </div>
            <div>
              <span className="font-bold text-sm text-gray-900">
                {preferredLanguage === 'ml' ? 'ഡാർത്തി AI' : 'DARTHI AI'}
              </span>
              <p className="text-[10px] text-gray-500">
                {preferredLanguage === 'ml' ? 'മെനു' : 'Navigation Menu'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Launch DARTHI AI Assistant with Voice */}
        <div className="px-3 pt-3 pb-1">
          <button
            onClick={() => {
              setIsChatOpen(true);
              onClose();
            }}
            className="w-full flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white shadow-sm hover:shadow-md hover:scale-[1.01] transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/25">
                <Bot className="w-4 h-4 text-emerald-100 group-hover:scale-110 transition-transform" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold leading-tight flex items-center gap-1.5">
                  {preferredLanguage === 'ml' ? 'ഡാർത്തി AI' : 'DARTHI AI'}
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                </p>
                <p className="text-[10px] text-emerald-100/80">
                  {preferredLanguage === 'ml' ? 'ശബ്ദ സഹായി & ചാറ്റ്' : 'Voice Assistant & Chat'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 bg-white/15 px-2 py-1 rounded-lg text-[10px] font-semibold border border-white/20 group-hover:bg-amber-400 group-hover:text-emerald-950 transition-colors">
              <Mic className="w-3 h-3 text-amber-300 group-hover:text-emerald-950" />
              <span>{preferredLanguage === 'ml' ? 'സംസാരിക്കൂ' : 'Speak'}</span>
            </div>
          </button>
        </div>

        {/* Section title */}
        <div className="px-5 pt-3 pb-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-900/60">
            {t('farmingIntelligence', preferredLanguage)}
          </p>
        </div>

        {/* Nav Items List */}
        <nav className="flex-1 overflow-y-auto px-3 py-1 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-700 text-white font-semibold shadow-xs shadow-emerald-200'
                    : 'text-gray-700 hover:bg-emerald-50/80 hover:text-emerald-950'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-white' : 'text-emerald-700'
                    }`}
                  />
                  <span className="truncate">
                    {preferredLanguage === 'ml' ? item.mlLabel : item.label}
                  </span>
                </div>
                {item.badge && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      item.badgeColor || 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Farmer Profile Footer */}
        <div className="p-4 border-t border-emerald-100/80 bg-emerald-50/40 m-3 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              AK
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-gray-900 truncate">
                {preferredLanguage === 'ml' ? 'ഗ്രീൻ ഏക്കർ താഴ്‌വര' : 'Green Acre Valley'}
              </p>
              <div className="flex items-center gap-1 text-[11px] text-gray-500 truncate">
                <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                <span className="truncate">
                  {preferredLanguage === 'ml' && farmData.malayalamDistrict
                    ? farmData.malayalamDistrict
                    : farmData.location.split(',')[0]}
                </span>
              </div>
              <p className="text-[10px] text-emerald-700 font-medium">
                {farmData.farmSize} {preferredLanguage === 'ml' ? 'ഏക്കർ' : 'Acres'} • {translateCrop(farmData.currentCrop, preferredLanguage)}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
