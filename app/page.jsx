'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import {
  Phone, MessageCircle, Mail, MapPin, Clock,
  ShieldCheck, ArrowRight, Menu, X, ZoomIn,
  UserCheck, Handshake, ClipboardList, ChevronDown,
  Home, Wrench, Building2, Clock3
} from 'lucide-react';

/** 每位團隊可提供嘅服務（簡短） */
const TEAM_SERVICES = {
  1: ['全屋室內設計', '3D 效果圖', '物料配色'],
  2: ['水電改裝', '燈制配置', '冷氣排水'],
  3: ['批盪泥水', '油漆翻新', '磁磚工程'],
  4: ['微水泥牆地', '特色飾面', '翻新塗層'],
  5: ['玻璃隔斷', '不銹鋼欄杆', '訂造五金'],
  6: ['打拆清運', '垃圾處理', '結構清拆'],
  7: ['智能家居', '系統整合', '場景控制'],
  8: ['棚架搭建', '冷氣安裝', '外牆支援'],
};

/** 查詢表單：8 大服務主題（fallback，優先用 team.role） */
const DEFAULT_TOPICS = [
  '住宅室內設計',
  '水電工程',
  '泥水油漆',
  '微水泥總代理',
  '不銹鋼玻璃工程',
  '清拆工程',
  '物聯網系統',
  '棚架及冷氣工程',
];

/** 表單顯示用：將職位名轉成服務主題 */
const TOPIC_ALIASES = {
  首席室內設計師: '住宅室內設計',
};

const FAQ_ITEMS = [
  {
    q: '你哋同一般裝修平台有咩分別？',
    a: 'GoodBuild 唔係公開大量公司嘅配對平台。只介紹認識、信得過嘅 8 個星級團隊，寧願少而精，方便跟進質素同溝通。',
  },
  {
    q: '如何取得報價？',
    a: '室內設計、物聯網系統等，需要約時間見面，充分了解需求同詳細講解後先報價。清拆、搭棚、工程維護、泥水翻新等，一般可先憑相片／短片提供初步報價；如有需要，師傅再到場觀察後先作正式報價。',
  },
  {
    q: '點解只介紹 8 個星級團隊？',
    a: '每個團隊都係 GoodBuild 合作多年的友好合作伙伴，默契十足，值得信賴推介嘅對象。',
  },
  {
    q: '介紹之後會點樣跟進？',
    a: '了解需求後對口介紹合適團隊報價；有需要可約睇手工。開工後如有溝通問題，亦可協助協調。',
  },
  {
    q: '一定要用你哋介紹嘅團隊嗎？',
    a: '唔使。你可以先傾、先比較；覺得合適先至決定。',
  },
  {
    q: '提交之後幾耐有人覆？',
    a: '多數一個工作天內會聯絡你，實際視乎個案複雜程度。',
  },
];

export default function HomePage() {
  const [projects, setProjects] = useState([]);
  const [team, setTeam] = useState([]);
  const [settings, setSettings] = useState({});
  const [cat, setCat] = useState('全部');
  const [menuOpen, setMenuOpen] = useState(false);
  const [zoom, setZoom] = useState(null);
  const [categories, setCategories] = useState([]);
  const [serviceType, setServiceType] = useState('match');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const [{ data: p }, { data: t }, { data: s }, { data: c }] = await Promise.all([
        supabase.from('projects').select('*').order('sort_order'),
        supabase.from('team').select('*').order('sort_order'),
        supabase.from('settings').select('*'),
        supabase.from('categories').select('*').order('sort_order'),
      ]);
      setProjects(p || []);
      setTeam(t || []);
      setCategories(c || []);
      const map = {};
      (s || []).forEach((r) => (map[r.key] = r.value));
      setSettings(map);
      setReady(true);
    })();
  }, []);

  const cats = ['全部', ...categories.map((c) => c.name)];
  const filtered = cat === '全部' ? projects : projects.filter((p) => p.category === cat);
  const brand = settings.company_name || '';

  const nav = [
    { label: '星級團隊', id: 'team' },
    { label: '點樣運作', id: 'flow' },
    { label: '工程案例', id: 'projects' },
    { label: '常見問題', id: 'faq' },
    { label: '立即查詢', id: 'quote' },
  ];

  function go(id) {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  function goQuote(type) {
    setServiceType(type);
    setMenuOpen(false);
    setTimeout(() => {
      document.getElementById('quote')?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  }

  return (
    <div className="bg-[var(--background)] text-stone-900">
      <header className="sticky top-0 z-50 bg-stone-950/95 backdrop-blur text-white border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="font-display font-bold tracking-wide text-left min-h-[1.25rem]">
            {ready ? (brand || 'Good Build') : '\u00A0'}
          </button>
          <nav className="hidden md:flex gap-5 text-sm">
            {nav.map((n) => (
              <button key={n.id} onClick={() => go(n.id)} className="hover:text-amber-400 transition">
                {n.label}
              </button>
            ))}
          </nav>
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="選單">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        {menuOpen && (
          <nav className="md:hidden bg-stone-900 px-4 py-2 flex flex-col border-t border-white/10">
            {nav.map((n) => (
              <button key={n.id} onClick={() => go(n.id)} className="py-2.5 text-left text-sm hover:text-amber-400">
                {n.label}
              </button>
            ))}
          </nav>
        )}
      </header>

      <section className="relative min-h-[88vh] flex items-center text-white overflow-hidden bg-stone-950">
        <div
          className="absolute inset-0 anim-glow"
          style={{
            backgroundImage:
              'radial-gradient(ellipse 80% 60% at 15% 20%, rgba(217,119,6,0.28) 0%, transparent 55%), radial-gradient(ellipse 70% 50% at 85% 75%, rgba(120,113,108,0.35) 0%, transparent 50%), linear-gradient(165deg, #0c0a09 0%, #1c1917 45%, #292524 100%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(-12deg, transparent, transparent 2px, rgba(255,255,255,0.4) 2px, rgba(255,255,255,0.4) 3px)',
          }}
        />
        <div className="relative max-w-6xl mx-auto px-4 py-20 sm:py-28 w-full text-center">
          {settings.logo_url ? (
            <img
              src={settings.logo_url}
              alt={brand || 'Logo'}
              className="h-48 sm:h-72 w-auto object-contain mx-auto mb-6 mix-blend-screen anim-fade-up"
            />
          ) : ready ? (
            <p className="font-display text-4xl sm:text-6xl font-extrabold tracking-tight mb-4 anim-fade-up">
              {brand || 'Good Build'}
            </p>
          ) : (
            <div className="h-48 sm:h-72 mb-6" aria-hidden />
          )}
          <p className="text-amber-400 font-medium tracking-[0.2em] text-xs sm:text-sm mb-5 anim-fade-up-delay-1">
            {ready ? (settings.slogan || '私人推薦 · 工種對口 · 跟進到完工') : '\u00A0'}
          </p>
          <h1 className="font-display text-3xl sm:text-5xl font-bold leading-tight max-w-3xl mx-auto anim-fade-up-delay-1">
            介紹信得過嘅
            <br className="sm:hidden" />
            <span className="text-amber-400">星級團隊</span>
            做你嘅裝修
          </h1>
          <p className="mt-5 text-stone-300 max-w-xl mx-auto text-sm sm:text-base anim-fade-up-delay-2">
            8 個專業團隊——按工種對口，全程有人跟進。報價重要，但搵對人先至係關鍵。
          </p>
          <div className="mt-9 flex flex-wrap gap-3 justify-center anim-fade-up-delay-2">
            <button
              onClick={() => goQuote('match')}
              className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold px-6 py-3.5 rounded-lg flex items-center gap-2 transition shadow-lg shadow-amber-900/30"
            >
              介紹星級團隊 <ArrowRight size={18} />
            </button>
            <button
              onClick={() => go('team')}
              className="border border-white/35 hover:bg-white/10 px-6 py-3.5 rounded-lg transition"
            >
              先睇團隊
            </button>
          </div>
        </div>
      </section>

      {/* ===== 點解搵我哋 ===== */}
      <section id="about" className="max-w-6xl mx-auto px-4 py-16 sm:py-20">
        <div className="text-center mb-10">
          <h2 className="font-display text-2xl sm:text-3xl font-bold">唔係亂配公司，係私人推薦</h2>
          <p className="text-stone-500 mt-2 text-sm sm:text-base">
            同公開配對平台唔同：我哋以人為本，少而精，跟到完工。
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
          {[
            { icon: Handshake, t: '熟人背書', d: '每個團隊都係認識、有信心推介嘅對象。' },
            { icon: UserCheck, t: '工種對口', d: '全屋、局部、水電泥水傢俬——按需要介紹，唔亂配。' },
            { icon: ShieldCheck, t: '跟進到完工', d: '唔止介紹完就散；開工後有需要可協助溝通協調。' },
            { icon: ClipboardList, t: '真實案例', d: '完工相、前後對比，睇得到手工再決定。' },
          ].map((c, i) => {
            const Icon = c.icon;
            return (
              <div key={i} className="text-center sm:text-left">
                <div className="w-11 h-11 rounded-full bg-stone-900 flex items-center justify-center mb-4 mx-auto sm:mx-0">
                  <Icon className="text-amber-400" size={20} />
                </div>
                <h3 className="font-display font-bold text-lg">{c.t}</h3>
                <p className="text-stone-500 text-sm mt-2 leading-relaxed">{c.d}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ===== 咩人需要幫手 ===== */}
      <section className="bg-stone-100/80 py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="font-display text-2xl sm:text-3xl font-bold">邊類客人需要我哋幫手？</h2>
            <p className="text-stone-500 mt-2 text-sm sm:text-base">
              如果你係以下其中一種，我哋可以幫到你。
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
            {[
              { icon: Home, t: '第一次裝修', d: '唔知邊個信得過，想有人幫忙對口介紹靠譜團隊。' },
              { icon: Wrench, t: '局部／單一工種', d: '只要清拆、水電、泥水、搭棚等，需要專門團隊處理。' },
              { icon: Building2, t: '住宅・商鋪・工商廈', d: '唔同物業類型都想搵對口專業，一次講清楚需求。' },
              { icon: Clock3, t: '忙到冇時間逐間問', d: '唔想自己冷呼叫好多間；想有人跟進到報價同開工。' },
            ].map((c, i) => {
              const Icon = c.icon;
              return (
                <div key={i} className="text-center sm:text-left">
                  <div className="w-11 h-11 rounded-full bg-stone-900 flex items-center justify-center mb-4 mx-auto sm:mx-0">
                    <Icon className="text-amber-400" size={20} />
                  </div>
                  <h3 className="font-display font-bold text-lg">{c.t}</h3>
                  <p className="text-stone-500 text-sm mt-2 leading-relaxed">{c.d}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== 星級團隊（主軸，提前） ===== */}
      <section id="team" className="bg-stone-950 text-white py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="font-display text-2xl sm:text-3xl font-bold">星級團隊</h2>
            <p className="text-stone-400 mt-2">只介紹認識、信得過嘅團隊——每項專長同可提供服務如下</p>
          </div>
          {team.length === 0 ? (
            <p className="text-center text-stone-500">暫未載入團隊資料</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
              {team.map((m) => {
                const services = TEAM_SERVICES[m.id] || [];
                return (
                  <div key={m.id} className="group text-center flex flex-col">
                    <div className="w-full aspect-[3/4] bg-stone-800 overflow-hidden mb-3">
                      {m.img_url ? (
                        <img
                          src={m.img_url}
                          alt={m.name}
                          className="w-full h-full object-cover object-[center_20%] transition duration-500 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-600 text-5xl font-display font-bold">
                          {m.name?.[0]}
                        </div>
                      )}
                    </div>
                    <p className="font-semibold">{m.name}</p>
                    <p className="text-sm text-amber-400">{m.role}</p>
                    {m.bio && <p className="text-xs text-stone-500 mt-1">{m.bio}</p>}
                    {services.length > 0 && (
                      <ul className="mt-3 space-y-1 text-left border-t border-white/10 pt-3 flex-1">
                        {services.map((s) => (
                          <li key={s} className="text-xs text-stone-400 flex gap-1.5 leading-snug">
                            <span className="text-amber-500/80 shrink-0">·</span>
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          <div className="text-center mt-10">
            <button
              onClick={() => goQuote('match')}
              className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold px-6 py-3 rounded-lg inline-flex items-center gap-2 transition"
            >
              馬上取得報價 <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* ===== 點樣運作 ===== */}
      <section id="flow" className="max-w-6xl mx-auto px-4 py-16 sm:py-20">
        <div className="text-center mb-12">
          <h2 className="font-display text-2xl sm:text-3xl font-bold">點樣運作</h2>
          <p className="text-stone-500 mt-2">四步完成，清楚簡單</p>
        </div>
        <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { n: '01', t: '講低你嘅需要', d: '填表或 WhatsApp，說明單位、範圍同期望。' },
            { n: '02', t: '對口介紹團隊', d: '按工種同個案，介紹合適星級團隊。' },
            { n: '03', t: '報價／睇手工', d: '安排報價；有需要可約完工單位睇手工。' },
            { n: '04', t: '跟進到完工', d: '決定合作後，有需要可協助溝通協調。' },
          ].map((s) => (
            <li key={s.n} className="relative">
              <span className="font-display text-4xl font-extrabold text-amber-500/30">{s.n}</span>
              <h3 className="font-display font-bold text-lg mt-1">{s.t}</h3>
              <p className="text-stone-500 text-sm mt-2 leading-relaxed">{s.d}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ===== 工程案例 ===== */}
      <section id="projects" className="py-16 sm:py-20 bg-stone-100/80">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="font-display text-2xl sm:text-3xl font-bold">工程案例</h2>
            <p className="text-stone-500 mt-2">星級團隊完工實例（拉動睇前後對比）</p>
          </div>

          <div className="flex justify-center gap-2 mb-8 flex-wrap">
            {cats.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`px-4 py-1.5 text-sm transition ${
                  cat === c
                    ? 'bg-stone-900 text-white'
                    : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <p className="text-center text-stone-400">暫未有案例</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((p) => (
                <ProjectCard key={p.id} p={p} onZoom={() => setZoom(p)} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section id="faq" className="max-w-3xl mx-auto px-4 py-16 sm:py-20">
        <div className="text-center mb-10">
          <h2 className="font-display text-2xl sm:text-3xl font-bold">常見問題</h2>
          <p className="text-stone-500 mt-2">關於私人推薦同跟進</p>
        </div>
        <div className="space-y-2">
          {FAQ_ITEMS.map((item, i) => (
            <FaqItem key={i} q={item.q} a={item.a} />
          ))}
        </div>
      </section>

      <QuoteForm
        serviceType={serviceType}
        setServiceType={setServiceType}
        whatsapp={settings.whatsapp}
        topics={
          team.length
            ? team.map((m) => TOPIC_ALIASES[m.role] || m.role).filter(Boolean)
            : DEFAULT_TOPICS
        }
      />

      <footer className="bg-stone-950 text-stone-300 pt-14 pb-8">
        <div className="max-w-6xl mx-auto px-4 grid sm:grid-cols-3 gap-8">
          <div>
            <h3 className="font-display text-white font-bold text-lg">{ready ? (brand || 'Good Build') : '\u00A0'}</h3>
            <p className="text-sm mt-2 text-stone-400">
              {ready ? (settings.slogan || '私人推薦星級團隊，跟進到完工。') : '\u00A0'}
            </p>
            {settings.license_no && (
              <p className="text-xs mt-3 text-stone-500">牌照號碼：{settings.license_no}</p>
            )}
          </div>
          <div className="space-y-2 text-sm">
            {settings.phone && (
              <p className="flex items-center gap-2">
                <Phone size={15} className="text-amber-400" /> {settings.phone}
              </p>
            )}
            {settings.whatsapp && (
              <p className="flex items-center gap-2">
                <MessageCircle size={15} className="text-amber-400" /> {settings.whatsapp}
              </p>
            )}
            {settings.email && (
              <p className="flex items-center gap-2">
                <Mail size={15} className="text-amber-400" /> {settings.email}
              </p>
            )}
            {settings.address && (
              <p className="flex items-center gap-2">
                <MapPin size={15} className="text-amber-400" /> {settings.address}
              </p>
            )}
            {settings.business_hour && (
              <p className="flex items-center gap-2">
                <Clock size={15} className="text-amber-400" /> {settings.business_hour}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-2 text-sm">
            {settings.facebook && (
              <a href={settings.facebook} className="hover:text-amber-400">Facebook</a>
            )}
            {settings.instagram && (
              <a href={settings.instagram} className="hover:text-amber-400">Instagram</a>
            )}
            {settings.youtube && (
              <a href={settings.youtube} className="hover:text-amber-400">YouTube</a>
            )}
            <button onClick={() => go('quote')} className="text-left hover:text-amber-400 mt-2">
              立即查詢
            </button>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 mt-10 pt-6 border-t border-white/10 text-center text-xs text-stone-500">
          © {new Date().getFullYear()} {ready ? (brand || 'Good Build') : ''}. All rights reserved.
        </div>
      </footer>

      {zoom && <Lightbox p={zoom} onClose={() => setZoom(null)} />}
    </div>
  );
}

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white border border-stone-200">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-3 px-4 py-4 text-left"
      >
        <span className="font-medium text-sm sm:text-base">{q}</span>
        <ChevronDown
          size={18}
          className={`shrink-0 text-stone-400 transition ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="px-4 pb-4 text-sm text-stone-600 leading-relaxed border-t border-stone-100 pt-3">
          {a}
        </div>
      )}
    </div>
  );
}

function ProjectCard({ p, onZoom }) {
  const [pos, setPos] = useState(50);
  const hasBoth = p.before_url && p.after_url;
  const singleImg = p.after_url || p.before_url;
  const ytId = getYoutubeId(p.youtube_url);
  const ytThumb = ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : null;
  const youtubeOnly = !hasBoth && !singleImg && !!ytThumb;

  return (
    <div className="bg-white border border-stone-200 overflow-hidden shadow-sm">
      <div
        className={`relative aspect-video bg-stone-100 select-none ${youtubeOnly ? 'cursor-pointer' : ''}`}
        onClick={youtubeOnly ? onZoom : undefined}
        role={youtubeOnly ? 'button' : undefined}
        tabIndex={youtubeOnly ? 0 : undefined}
        onKeyDown={youtubeOnly ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onZoom(); } } : undefined}
      >
        {hasBoth ? (
          <>
            <img src={p.after_url} alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
              <img
                src={p.before_url}
                alt=""
                className="w-full h-full object-cover"
                style={{ width: `${100 / (pos / 100)}%`, maxWidth: 'none' }}
              />
            </div>
            <div className="absolute top-0 bottom-0 w-0.5 bg-white shadow" style={{ left: `${pos}%` }} />
            <span className="absolute top-2 left-2 text-xs bg-black/50 text-white px-2 py-0.5">前</span>
            <span className="absolute top-2 right-2 text-xs bg-amber-500 text-stone-900 px-2 py-0.5">後</span>
            <input
              type="range"
              min="0"
              max="100"
              value={pos}
              onChange={(e) => setPos(e.target.value)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize"
            />
          </>
        ) : singleImg ? (
          <img src={singleImg} alt="" className="w-full h-full object-cover" />
        ) : ytThumb ? (
          <>
            <img src={ytThumb} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition">
              <div className="w-14 h-10 bg-red-600 rounded-lg flex items-center justify-center shadow-lg">
                <div className="w-0 h-0 border-y-8 border-y-transparent border-l-[14px] border-l-white ml-1" />
              </div>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-stone-300 text-sm">無圖片</div>
        )}

        {ytId && !youtubeOnly && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onZoom(); }}
            className="absolute bottom-2 left-2 z-10 bg-red-600 hover:bg-red-500 text-white text-xs font-medium px-2.5 py-1.5 rounded-lg transition"
          >
            播放影片
          </button>
        )}

        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onZoom(); }}
          className="absolute bottom-2 right-2 z-10 bg-black/60 hover:bg-black/80 text-white p-1.5 rounded-lg transition"
          title="放大檢視"
        >
          <ZoomIn size={18} />
        </button>
      </div>
      <div className="p-4">
        <span className="text-xs bg-stone-100 text-stone-500 px-2 py-0.5">{p.category}</span>
        <h3 className="font-semibold mt-2">{p.title}</h3>
        {ytId && <p className="text-xs text-stone-400 mt-1">含 YouTube 影片 · 撳相播放</p>}
      </div>
    </div>
  );
}

function Lightbox({ p, onClose }) {
  const [pos, setPos] = useState(50);
  const hasBoth = p.before_url && p.after_url;
  const singleImg = p.after_url || p.before_url;
  const ytId = getYoutubeId(p.youtube_url);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] bg-black/85 flex flex-col items-center justify-center p-4 overflow-y-auto"
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition"
      >
        <X size={24} />
      </button>

      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-4xl space-y-4">
        {hasBoth ? (
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden select-none">
            <img src={p.after_url} alt="" className="absolute inset-0 w-full h-full object-contain" />
            <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
              <img
                src={p.before_url}
                alt=""
                className="h-full object-contain"
                style={{ width: `${100 / (pos / 100)}%`, maxWidth: 'none' }}
              />
            </div>
            <div className="absolute top-0 bottom-0 w-0.5 bg-white shadow" style={{ left: `${pos}%` }} />
            <span className="absolute top-3 left-3 text-sm bg-black/60 text-white px-3 py-1 rounded">前</span>
            <span className="absolute top-3 right-3 text-sm bg-amber-500 text-stone-900 px-3 py-1 rounded">後</span>
            <input
              type="range"
              min="0"
              max="100"
              value={pos}
              onChange={(e) => setPos(e.target.value)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize"
            />
          </div>
        ) : singleImg ? (
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
            <img src={singleImg} alt="" className="w-full h-full object-contain" />
          </div>
        ) : null}

        {ytId && (
          <div className="aspect-video rounded-lg overflow-hidden bg-black">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`}
              title="YouTube video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        )}

        {p.video_url && <video src={p.video_url} controls className="w-full rounded-lg bg-black" />}

        {p.design_url && (
          <div>
            <p className="text-white text-sm mb-1">3D 設計圖</p>
            <img src={p.design_url} alt="3D Design" className="w-full rounded-lg" />
          </div>
        )}

        <div className="text-center text-white">
          <span className="text-xs bg-white/15 px-2 py-0.5 rounded">{p.category}</span>
          <h3 className="font-semibold text-lg mt-2">{p.title}</h3>
          {hasBoth && <p className="text-stone-400 text-sm mt-1">← 拉動睇前後對比 →</p>}
        </div>
      </div>
    </div>
  );
}

function QuoteForm({ serviceType, setServiceType, whatsapp, topics = DEFAULT_TOPICS }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [area, setArea] = useState('');
  const [topic, setTopic] = useState('');
  const [notes, setNotes] = useState('');

  const waDigits = (whatsapp || '').replace(/\D/g, '');
  const waNumber = waDigits
    ? (waDigits.startsWith('852') ? waDigits : `852${waDigits}`)
    : '';

  function buildWaMessage() {
    const intent =
      serviceType === 'general'
        ? '想一般查詢。'
        : '想取得團隊工程報價。';
    return [
      '你好，',
      intent,
      propertyType ? `物業類型：${propertyType}` : '',
      topic ? `服務主題：${topic}` : '',
      name ? `稱呼：${name}` : '',
      phone ? `電話：${phone}` : '',
      area ? `面積：${area}` : '',
      notes ? `補充：${notes}` : '',
    ]
      .filter(Boolean)
      .join('\n');
  }

  function openWhatsApp(e) {
    e.preventDefault();
    if (!propertyType) {
      alert('請先選擇物業類型');
      return;
    }
    if (!topic) {
      alert('請先選擇服務主題');
      return;
    }
    if (!waNumber) {
      alert('暫時未設定 WhatsApp 號碼，請稍後再試或直接致電聯絡。');
      return;
    }
    const href = `https://wa.me/${waNumber}?text=${encodeURIComponent(buildWaMessage())}`;
    window.open(href, '_blank', 'noopener,noreferrer');
  }

  return (
    <section id="quote" className="bg-stone-900 text-white py-16 sm:py-24">
      <div className="max-w-xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="font-display text-2xl sm:text-3xl font-bold">立即查詢</h2>
          <p className="text-stone-300 mt-2 text-sm sm:text-base">
            填好資料，一按即用 WhatsApp 聯絡我哋
          </p>
        </div>

        <form onSubmit={openWhatsApp} className="bg-white/10 rounded-2xl p-6 sm:p-8 space-y-4">
          <div className="space-y-2">
            {[
              { value: 'match', label: '團隊工程報價' },
              { value: 'general', label: '一般查詢' },
            ].map((opt) => (
              <label
                key={opt.value}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition border ${
                  serviceType === opt.value
                    ? 'bg-amber-500/20 border-amber-400 text-white'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <input
                  type="radio"
                  name="service_type"
                  value={opt.value}
                  checked={serviceType === opt.value}
                  onChange={() => setServiceType(opt.value)}
                  className="accent-amber-500"
                />
                <span className="text-sm">{opt.label}</span>
              </label>
            ))}
          </div>

          <div>
            <label className="text-sm text-stone-300">稱呼</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="例：陳生／李小姐"
              className="w-full mt-1 px-4 py-3 rounded-lg bg-white/90 text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>
          <div>
            <label className="text-sm text-stone-300">聯絡電話</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              type="tel"
              placeholder="例：9123 4567"
              className="w-full mt-1 px-4 py-3 rounded-lg bg-white/90 text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>
          <div>
            <label className="text-sm text-stone-300">物業類型 *</label>
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              required
              className="w-full mt-1 px-4 py-3 rounded-lg bg-white/90 text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              <option value="">請選擇</option>
              <option value="住宅">住宅</option>
              <option value="工商廈">工商廈</option>
              <option value="店鋪">店鋪</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-stone-300">服務主題 *</label>
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              required
              className="w-full mt-1 px-4 py-3 rounded-lg bg-white/90 text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              <option value="">請選擇相關服務</option>
              {topics.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
              <option value="全屋一條龍／多項工程">全屋一條龍／多項工程</option>
              <option value="未確定／想你建議">未確定／想你建議</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-stone-300">單位面積</label>
            <select
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="w-full mt-1 px-4 py-3 rounded-lg bg-white/90 text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              <option value="">請選擇</option>
              <option>300 呎以下</option>
              <option>300 - 500 呎</option>
              <option>500 - 800 呎</option>
              <option>800 呎以上</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-stone-300">需求摘要（選填）</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="例：新樓入伙、想做全屋裝修連傢俬"
              className="w-full mt-1 px-4 py-3 rounded-lg bg-white/90 text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-y"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-semibold py-3.5 rounded-lg flex items-center justify-center gap-2 transition"
          >
            <MessageCircle size={20} />
            用 WhatsApp 查詢
          </button>

          <p className="text-xs text-stone-400 text-center">
            會開啟 WhatsApp，並自動填好你嘅查詢內容。報價單檔案可喺對話中直接傳送。
          </p>
        </form>
      </div>
    </section>
  );
}

function getYoutubeId(url) {
  if (!url) return null;
  try {
    const u = new URL(url.trim());
    if (u.hostname.includes('youtu.be')) {
      const id = u.pathname.split('/').filter(Boolean)[0];
      return id && /^[\w-]{11}$/.test(id) ? id : null;
    }
    if (u.hostname.includes('youtube.com')) {
      const v = u.searchParams.get('v');
      if (v && /^[\w-]{11}$/.test(v)) return v;
      const parts = u.pathname.split('/').filter(Boolean);
      // /embed/ID or /shorts/ID or /live/ID
      if (parts[0] && ['embed', 'shorts', 'live'].includes(parts[0]) && /^[\w-]{11}$/.test(parts[1] || '')) {
        return parts[1];
      }
    }
  } catch {
    // fall through
  }
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/))([\w-]{11})/);
  return m ? m[1] : null;
}
