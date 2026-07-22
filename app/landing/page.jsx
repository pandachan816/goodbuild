'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import {
  ArrowRight,
  CheckCircle2,
  MessageCircle,
  Phone,
  ShieldCheck,
  FileText,
  HardHat,
  Star,
} from 'lucide-react';

/** 廣告頁示範案例（金額／工期為參考示範，可按真實項目再調） */
const SHOWCASE_CASES = [
  {
    title: '500呎單位 全屋翻新',
    days: '90日',
    price: '約 $320,000',
    items: ['廚房重做', '全屋水電', '訂製傢私'],
  },
  {
    title: '400呎單位 廚房＋浴室',
    days: '45日',
    price: '約 $180,000',
    items: ['廚櫃重做', '浴室翻新', '泥水油漆'],
  },
  {
    title: '商舖裝修',
    days: '30日',
    price: '約 $250,000',
    items: ['間隔改建', '水電燈飾', '門面裝修'],
  },
  {
    title: '舊樓局部翻新',
    days: '60日',
    price: '約 $220,000',
    items: ['清拆改建', '全屋油漆', '水電更新'],
  },
];

const FLOW_STEPS = [
  { n: '01', t: '免費上門睇位', d: '實地了解單位同需求' },
  { n: '02', t: '3日內出詳細報價', d: '範圍同金額一次講清楚' },
  { n: '03', t: '簽約後排期', d: '確認後安排開工' },
  { n: '04', t: '專人監工每日跟進', d: '進度透明，有事即覆' },
  { n: '05', t: '驗收交樓', d: '完工驗收，售後有保障' },
];

const TRUST_POINTS = [
  { icon: FileText, t: '公司註冊', d: '正規註冊公司，資料可查' },
  { icon: HardHat, t: '勞工保險', d: '工程人員有勞保保障' },
  { icon: ShieldCheck, t: '第三者責任保險', d: '施工期間有責任保障' },
  { icon: Star, t: '真實客戶評語', d: '完工客戶親身回饋' },
];

export default function AdsLandingPage() {
  const [settings, setSettings] = useState({});
  const [projects, setProjects] = useState([]);
  const [ready, setReady] = useState(false);
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    (async () => {
      const [{ data: s }, { data: p }] = await Promise.all([
        supabase.from('settings').select('*'),
        supabase.from('projects').select('*').order('sort_order').limit(5),
      ]);
      const map = {};
      (s || []).forEach((r) => (map[r.key] = r.value));
      setSettings(map);
      setProjects(p || []);
      setReady(true);
    })();
  }, []);

  const brand = settings.company_name || 'GOODBUILD';
  const waDigits = (settings.whatsapp || '').replace(/\D/g, '');
  const waNumber = waDigits
    ? waDigits.startsWith('852')
      ? waDigits
      : `852${waDigits}`
    : '';

  function waHref(text) {
    if (!waNumber) return null;
    return `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`;
  }

  function openWhatsApp(preset) {
    const href = waHref(preset);
    if (!href) {
      alert('暫時未設定 WhatsApp 號碼，請稍後再試或直接致電聯絡。');
      return;
    }
    window.open(href, '_blank', 'noopener,noreferrer');
  }

  function submitCallback(e) {
    e.preventDefault();
    if (!phone.trim()) {
      alert('請留低聯絡電話');
      return;
    }
    openWhatsApp(
      [
        '你好，我想預約免費上門睇位報價。',
        name.trim() ? `稱呼：${name.trim()}` : '',
        `電話：${phone.trim()}`,
        '來源：Google 廣告 Landing Page',
      ]
        .filter(Boolean)
        .join('\n')
    );
  }

  function goCta() {
    document.getElementById('cta')?.scrollIntoView({ behavior: 'smooth' });
  }

  const cases = SHOWCASE_CASES.map((c, i) => {
    const p = projects[i];
    return {
      ...c,
      before: p?.before_url,
      after: p?.after_url || p?.before_url,
      liveTitle: p?.title,
    };
  });

  return (
    <div className="bg-[var(--background)] text-stone-900 min-h-screen">
      <header className="sticky top-0 z-50 bg-stone-950/95 backdrop-blur text-white border-b border-white/5">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="font-display font-bold tracking-wide">
            {ready ? brand : '\u00A0'}
          </span>
          <button
            type="button"
            onClick={() =>
              openWhatsApp('你好，我想查詢裝修報價／預約免費上門睇位。')
            }
            className="bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold px-3.5 py-2 rounded-lg inline-flex items-center gap-1.5 transition"
          >
            <MessageCircle size={16} />
            WhatsApp
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative text-white overflow-hidden bg-stone-950">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(ellipse 80% 60% at 20% 20%, rgba(217,119,6,0.3) 0%, transparent 55%), linear-gradient(165deg, #0c0a09 0%, #1c1917 50%, #292524 100%)',
          }}
        />
        <div className="relative max-w-5xl mx-auto px-4 py-16 sm:py-24 text-center">
          {settings.logo_url && (
            <img
              src={settings.logo_url}
              alt={brand}
              className="h-20 sm:h-28 w-auto object-contain mx-auto mb-6 mix-blend-screen"
            />
          )}
          <p className="text-amber-400 text-xs sm:text-sm tracking-[0.2em] font-medium mb-4">
            透明報價 · 準時交付 · 專人監工
          </p>
          <h1 className="font-display text-3xl sm:text-5xl font-bold leading-tight">
            香港專業裝修公司
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-stone-200">
            免費上門睇位及詳細報價
          </p>
          <p className="mt-4 text-sm text-stone-400 max-w-lg mx-auto">
            住宅全屋翻新｜廚房浴室｜公屋／居屋｜商舖裝修
          </p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <button
              type="button"
              onClick={goCta}
              className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold px-6 py-3.5 rounded-lg inline-flex items-center gap-2 transition shadow-lg shadow-amber-900/30"
            >
              立即預約免費報價 <ArrowRight size={18} />
            </button>
            <button
              type="button"
              onClick={() =>
                openWhatsApp('你好，我想 WhatsApp 查詢裝修報價。')
              }
              className="border border-white/35 hover:bg-white/10 px-6 py-3.5 rounded-lg inline-flex items-center gap-2 transition"
            >
              <MessageCircle size={18} />
              立即 WhatsApp
            </button>
          </div>
        </div>
      </section>

      {/* Section 1: 前後對比案例 */}
      <section className="max-w-5xl mx-auto px-4 py-14 sm:py-20">
        <div className="text-center mb-10">
          <h2 className="font-display text-2xl sm:text-3xl font-bold">真實工程前後對比</h2>
          <p className="text-stone-500 mt-2 text-sm sm:text-base">
            睇清楚範圍、工期同參考金額，再決定
          </p>
        </div>
        <div className="grid sm:grid-cols-2 gap-6">
          {cases.map((c) => (
            <article
              key={c.title}
              className="border border-stone-200 bg-white overflow-hidden shadow-sm"
            >
              <div className="aspect-video bg-stone-100 relative">
                {c.before && c.after && c.before !== c.after ? (
                  <div className="absolute inset-0 grid grid-cols-2">
                    <div className="relative overflow-hidden border-r border-white">
                      <img src={c.before} alt="" className="w-full h-full object-cover" />
                      <span className="absolute top-2 left-2 text-xs bg-black/55 text-white px-2 py-0.5">
                        前
                      </span>
                    </div>
                    <div className="relative overflow-hidden">
                      <img src={c.after} alt="" className="w-full h-full object-cover" />
                      <span className="absolute top-2 right-2 text-xs bg-amber-500 text-stone-900 px-2 py-0.5">
                        後
                      </span>
                    </div>
                  </div>
                ) : c.after ? (
                  <img src={c.after} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-stone-400 text-sm">
                    案例相片可於後台上傳
                  </div>
                )}
              </div>
              <div className="p-5">
                <h3 className="font-display font-bold text-lg">【{c.title}】</h3>
                {c.liveTitle && (
                  <p className="text-xs text-stone-400 mt-1">實例：{c.liveTitle}</p>
                )}
                <p className="text-sm text-stone-600 mt-3">
                  工程期：{c.days}
                  <br />
                  工程金額：{c.price}
                </p>
                <ul className="mt-3 space-y-1.5">
                  {c.items.map((item) => (
                    <li key={item} className="text-sm text-stone-700 flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-amber-600 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={goCta}
                  className="mt-5 w-full bg-stone-900 hover:bg-stone-800 text-white font-semibold py-2.5 rounded-lg inline-flex items-center justify-center gap-2 transition text-sm"
                >
                  立即預約免費報價 <ArrowRight size={16} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Section 2: 流程 */}
      <section className="bg-stone-100/80 py-14 sm:py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="font-display text-2xl sm:text-3xl font-bold">簡單五步，安心開工</h2>
            <p className="text-stone-500 mt-2 text-sm">由睇位到交樓，全程有人跟</p>
          </div>
          <ol className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {FLOW_STEPS.map((s) => (
              <li key={s.n}>
                <span className="font-display text-3xl font-extrabold text-amber-500/35">
                  {s.n}
                </span>
                <h3 className="font-display font-bold mt-1">{s.t}</h3>
                <p className="text-stone-500 text-sm mt-1.5">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Section 3: 信任 */}
      <section className="max-w-5xl mx-auto px-4 py-14 sm:py-20">
        <div className="text-center mb-10">
          <h2 className="font-display text-2xl sm:text-3xl font-bold">信任元素</h2>
          <p className="text-stone-500 mt-2 text-sm">正規公司 · 保險齊備 · 真實口碑</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TRUST_POINTS.map((t) => {
            const Icon = t.icon;
            return (
              <div key={t.t} className="text-center sm:text-left">
                <div className="w-11 h-11 rounded-full bg-stone-900 flex items-center justify-center mb-3 mx-auto sm:mx-0">
                  <Icon className="text-amber-400" size={20} />
                </div>
                <h3 className="font-display font-bold">{t.t}</h3>
                <p className="text-stone-500 text-sm mt-1.5">{t.d}</p>
              </div>
            );
          })}
        </div>
        {settings.license_no && (
          <p className="text-center text-xs text-stone-500 mt-8">
            公司註冊／牌照號碼：{settings.license_no}
          </p>
        )}
      </section>

      {/* CTA */}
      <section id="cta" className="bg-stone-900 text-white py-14 sm:py-20">
        <div className="max-w-xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="font-display text-2xl sm:text-3xl font-bold">立即預約免費報價</h2>
            <p className="text-stone-300 mt-2 text-sm sm:text-base">
              WhatsApp 查詢，或留低電話一個工作天內聯絡
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              openWhatsApp(
                '你好，我想立即 WhatsApp 查詢裝修報價／預約免費上門睇位。\n來源：Google 廣告 Landing Page'
              )
            }
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-semibold py-3.5 rounded-lg flex items-center justify-center gap-2 transition mb-6"
          >
            <MessageCircle size={20} />
            立即 WhatsApp 查詢
          </button>

          <div className="relative text-center text-stone-500 text-xs mb-6">
            <span className="bg-stone-900 px-3 relative z-10">或</span>
            <div className="absolute left-0 right-0 top-1/2 border-t border-white/10" />
          </div>

          <form onSubmit={submitCallback} className="bg-white/10 rounded-2xl p-6 space-y-4">
            <div>
              <label className="text-sm text-stone-300">稱呼（選填）</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                placeholder="例：陳生／李小姐"
                className="w-full mt-1 px-4 py-3 rounded-lg bg-white/90 text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
            <div>
              <label className="text-sm text-stone-300">聯絡電話 *</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                type="tel"
                required
                placeholder="例：9123 4567"
                className="w-full mt-1 px-4 py-3 rounded-lg bg-white/90 text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold py-3.5 rounded-lg flex items-center justify-center gap-2 transition"
            >
              <Phone size={18} />
              留低電話 · 一個工作天內聯絡
            </button>
            <p className="text-xs text-stone-400 text-center">
              提交後會開啟 WhatsApp，方便我哋即時確認你嘅聯絡方式。
            </p>
          </form>

          {settings.phone && (
            <p className="text-center text-sm text-stone-400 mt-6 flex items-center justify-center gap-2">
              <Phone size={14} className="text-amber-400" />
              亦可致電 {settings.phone}
            </p>
          )}
        </div>
      </section>

      <footer className="bg-stone-950 text-stone-500 py-6 text-center text-xs">
        <p>
          © {new Date().getFullYear()} {ready ? brand : ''} · Google 廣告專用頁
        </p>
        <a href="/" className="hover:text-amber-400 mt-2 inline-block">
          返回主頁
        </a>
      </footer>
    </div>
  );
}
