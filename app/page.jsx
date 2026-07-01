'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import {
  Phone, MessageCircle, Mail, MapPin, Clock, ShieldCheck,
  Hammer, Sparkles, Loader2, CheckCircle2, ArrowRight, Menu, X, ZoomIn,
  UserCheck, CalendarCheck, LifeBuoy
} from 'lucide-react';
export default function HomePage() {
  const [projects, setProjects] = useState([]);
  const [team, setTeam] = useState([]);
  const [settings, setSettings] = useState({});
  const [cat, setCat] = useState('全部');
  const [menuOpen, setMenuOpen] = useState(false);
  const [zoom, setZoom] = useState(null); // ← 新增：放大檢視
  const [categories, setCategories] = useState([]);

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
    })();
  }, []);

 const cats = ['全部', ...categories.map((c) => c.name)];
  const filtered = cat === '全部' ? projects : projects.filter((p) => p.category === cat);

  const nav = [
    { label: '關於我們', id: 'about' },
    { label: '工程案例', id: 'projects' },
    { label: '專業團隊', id: 'team' },
    { label: '免費報價', id: 'quote' },
  ];

  function go(id) {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <div className="bg-white text-slate-800">
      {/* ===== 導覽列 ===== */}
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur text-white">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <span className="font-bold tracking-wide">{settings.company_name || 'PRIME BUILD'}</span>
          <nav className="hidden md:flex gap-6 text-sm">
            {nav.map((n) => (
              <button key={n.id} onClick={() => go(n.id)} className="hover:text-amber-400 transition">
                {n.label}
              </button>
            ))}
          </nav>
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        {menuOpen && (
          <nav className="md:hidden bg-slate-800 px-4 py-2 flex flex-col">
            {nav.map((n) => (
              <button key={n.id} onClick={() => go(n.id)} className="py-2 text-left text-sm hover:text-amber-400">
                {n.label}
              </button>
            ))}
          </nav>
        )}
      </header>

      {/* ===== Hero ===== */}
      <section className="relative bg-black text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, #f59e0b 0%, transparent 40%), radial-gradient(circle at 80% 70%, #38bdf8 0%, transparent 40%)' }} />
        <div className="relative max-w-6xl mx-auto px-4 py-24 sm:py-32 text-center">
          {settings.logo_url && (
  <img
    src={settings.logo_url}
    alt={settings.company_name || 'Logo'}
    className="h-60 sm:h-76 w-auto object-contain mx-auto mb-6 mix-blend-screen"
  />
)}
          <p className="text-amber-400 font-medium tracking-widest text-sm mb-4">
            {settings.slogan || '細節成就品質 · 專業鑄就信任'}
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold leading-tight">
            專業一條龍<br className="sm:hidden" />工程裝修團隊
          </h1>
          <p className="mt-5 text-slate-300 max-w-xl mx-auto">
            由設計、水電、泥水到傢私訂製，8大專業範疇一站式服務，為你打造理想空間。
          </p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <button onClick={() => go('quote')}
              className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold px-6 py-3 rounded-lg flex items-center gap-2 transition">
              免費報價 <ArrowRight size={18} />
            </button>
            <button onClick={() => go('projects')}
              className="border border-white/30 hover:bg-white/10 px-6 py-3 rounded-lg transition">
              工程案例
            </button>
          </div>
        </div>
      </section>

      {/* ===== 關於 / 賣點 ===== */}
      <section id="about" className="max-w-6xl mx-auto px-4 py-16 sm:py-24">
        <div className="grid sm:grid-cols-3 gap-6">
          {[
  { icon: ShieldCheck, t: '信心保證', d: '正規牌照、清晰報價、工程進度透明。' },
  { icon: Hammer, t: '一條龍施工', d: '八大專業範疇自家團隊，隨時候命。' },
  { icon: Sparkles, t: '注重細節', d: '由微水泥到不銹鋼玻璃，每個細節都做到位。' },
  { icon: UserCheck, t: '專業團隊監工', d: '專人項目跟進，全程監督施工質量，確保進度準時、標準一致。' },
  { icon: CalendarCheck, t: '準時交付', d: '嚴格工程時間管理，清晰排期，減少延誤。' },
  { icon: LifeBuoy, t: '完善售後跟進', d: '工程完成後持續支援，保養維修有保障，無後顧之憂。' },
].map((c, i) => {
            const Icon = c.icon;
            return (
              <div key={i} className="bg-slate-50 rounded-2xl p-6 hover:shadow-md transition">
                <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center mb-4">
                  <Icon className="text-amber-400" size={22} />
                </div>
                <h3 className="font-bold text-lg">{c.t}</h3>
                <p className="text-slate-500 text-sm mt-2">{c.d}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ===== 工程案例 ===== */}
      <section id="projects" className="bg-slate-50 py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold">工程案例</h2>
            <p className="text-slate-500 mt-2">拉動下方相片，睇裝修前後對比（按 🔍 放大）</p>
          </div>

          <div className="flex justify-center gap-2 mb-8 flex-wrap">
            {cats.map((c) => (
              <button key={c} onClick={() => setCat(c)}
                className={`px-4 py-1.5 rounded-full text-sm transition ${
                  cat === c ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'
                }`}>
                {c}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <p className="text-center text-slate-400">暫未有案例</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((p) => <ProjectCard key={p.id} p={p} onZoom={() => setZoom(p)} />)}
            </div>
          )}
        </div>
      </section>

      {/* ===== 團隊 ===== */}
      <section id="team" className="max-w-6xl mx-auto px-4 py-16 sm:py-24">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold">專業團隊</h2>
          <p className="text-slate-500 mt-2">各範疇資深師傅，經驗豐富</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {team.map((m) => (
            <div key={m.id} className="bg-slate-50 rounded-2xl overflow-hidden text-center hover:shadow-md transition">
              {/* 打直長方形大相 */}
              <div className="w-full aspect-[3/4] bg-slate-200 overflow-hidden">
                {m.img_url
                  ? <img src={m.img_url} alt={m.name} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center text-slate-300 text-6xl font-bold">{m.name?.[0]}</div>}
              </div>
              <div className="p-4">
                <p className="font-semibold text-slate-800">{m.name}</p>
                <p className="text-sm text-amber-600">{m.role}</p>
                {m.bio && <p className="text-xs text-slate-400 mt-1">{m.bio}</p>}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== 免費報價表單 ===== */}
      <QuoteForm />

      {/* ===== Footer ===== */}
      <footer className="bg-slate-900 text-slate-300 pt-14 pb-8">
        <div className="max-w-6xl mx-auto px-4 grid sm:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white font-bold text-lg">{settings.company_name || 'PRIME BUILD'}</h3>
            <p className="text-sm mt-2 text-slate-400">{settings.slogan}</p>
            {settings.license_no && <p className="text-xs mt-3 text-slate-500">牌照號碼：{settings.license_no}</p>}
          </div>
          <div className="space-y-2 text-sm">
            {settings.phone && <p className="flex items-center gap-2"><Phone size={15} className="text-amber-400" /> {settings.phone}</p>}
            {settings.whatsapp && <p className="flex items-center gap-2"><MessageCircle size={15} className="text-amber-400" /> {settings.whatsapp}</p>}
            {settings.email && <p className="flex items-center gap-2"><Mail size={15} className="text-amber-400" /> {settings.email}</p>}
            {settings.address && <p className="flex items-center gap-2"><MapPin size={15} className="text-amber-400" /> {settings.address}</p>}
            {settings.business_hour && <p className="flex items-center gap-2"><Clock size={15} className="text-amber-400" /> {settings.business_hour}</p>}
          </div>
          <div className="flex flex-col gap-2 text-sm">
            {settings.facebook && <a href={settings.facebook} className="hover:text-amber-400">Facebook</a>}
            {settings.instagram && <a href={settings.instagram} className="hover:text-amber-400">Instagram</a>}
            {settings.youtube && <a href={settings.youtube} className="hover:text-amber-400">YouTube</a>}
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 mt-10 pt-6 border-t border-white/10 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} {settings.company_name || 'PRIME BUILD'}. All rights reserved.
        </div>
      </footer>

      {/* ===== 放大檢視 Lightbox ===== */}
      {zoom && <Lightbox p={zoom} onClose={() => setZoom(null)} />}
    </div>
  );
}

/* ===== 前後對比卡（可拉動滑桿） ===== */
function ProjectCard({ p, onZoom }) {
  const [pos, setPos] = useState(50);
  const hasBoth = p.before_url && p.after_url;
  const singleImg = p.after_url || p.before_url;
  const ytId = getYoutubeId(p.youtube_url);
  const ytThumb = ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : null;

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="relative aspect-video bg-slate-100 select-none">
        {hasBoth ? (
          <>
            <img src={p.after_url} alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
              <img src={p.before_url} alt="" className="w-full h-full object-cover"
                style={{ width: `${100 / (pos / 100)}%`, maxWidth: 'none' }} />
            </div>
            <div className="absolute top-0 bottom-0 w-0.5 bg-white shadow" style={{ left: `${pos}%` }} />
            <span className="absolute top-2 left-2 text-xs bg-black/50 text-white px-2 py-0.5 rounded">前</span>
            <span className="absolute top-2 right-2 text-xs bg-amber-500 text-slate-900 px-2 py-0.5 rounded">後</span>
            <input type="range" min="0" max="100" value={pos}
              onChange={(e) => setPos(e.target.value)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize" />
          </>
        ) : singleImg ? (
          <img src={singleImg} alt="" className="w-full h-full object-cover" />
        ) : ytThumb ? (
          <>
            <img src={ytThumb} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-14 h-10 bg-red-600 rounded-lg flex items-center justify-center shadow-lg">
                <div className="w-0 h-0 border-y-8 border-y-transparent border-l-[14px] border-l-white ml-1" />
              </div>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300 text-sm">無圖片</div>
        )}

        {/* 放大按鈕 */}
        <button
          onClick={onZoom}
          className="absolute bottom-2 right-2 z-10 bg-black/60 hover:bg-black/80 text-white p-1.5 rounded-lg transition"
          title="放大檢視"
        >
          <ZoomIn size={18} />
        </button>
      </div>
      <div className="p-4">
        <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded">{p.category}</span>
        <h3 className="font-semibold mt-2">{p.title}</h3>
      </div>
    </div>
  );
}

/* ===== 放大檢視 Lightbox ===== */
function Lightbox({ p, onClose }) {
  const [pos, setPos] = useState(50);
  const hasBoth = p.before_url && p.after_url;
  const singleImg = p.after_url || p.before_url;
  const ytId = getYoutubeId(p.youtube_url);

  return (
    <div onClick={onClose}
      className="fixed inset-0 z-[100] bg-black/85 flex flex-col items-center justify-center p-4 overflow-y-auto">
      <button onClick={onClose}
        className="absolute top-4 right-4 text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition">
        <X size={24} />
      </button>

      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-4xl space-y-4">
        {/* 前後對比圖：只喺有相先顯示 */}
        {hasBoth ? (
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden select-none">
            <img src={p.after_url} alt="" className="absolute inset-0 w-full h-full object-contain" />
            <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
              <img src={p.before_url} alt="" className="h-full object-contain"
                style={{ width: `${100 / (pos / 100)}%`, maxWidth: 'none' }} />
            </div>
            <div className="absolute top-0 bottom-0 w-0.5 bg-white shadow" style={{ left: `${pos}%` }} />
            <span className="absolute top-3 left-3 text-sm bg-black/60 text-white px-3 py-1 rounded">前</span>
            <span className="absolute top-3 right-3 text-sm bg-amber-500 text-slate-900 px-3 py-1 rounded">後</span>
            <input type="range" min="0" max="100" value={pos}
              onChange={(e) => setPos(e.target.value)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize" />
          </div>
        ) : singleImg ? (
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
            <img src={singleImg} alt="" className="w-full h-full object-contain" />
          </div>
        ) : null}

        {/* 🎬 YouTube 影片 */}
        {ytId && (
          <div className="aspect-video rounded-lg overflow-hidden bg-black">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${ytId}`}
              title="YouTube video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}

        {/* 📹 上載影片 MP4 */}
        {p.video_url && (
          <video src={p.video_url} controls className="w-full rounded-lg bg-black" />
        )}

        {/* 🎨 3D Design 圖 */}
        {p.design_url && (
          <div>
            <p className="text-white text-sm mb-1">🎨 3D 設計圖</p>
            <img src={p.design_url} alt="3D Design" className="w-full rounded-lg" />
          </div>
        )}

        <div className="text-center text-white">
          <span className="text-xs bg-white/15 px-2 py-0.5 rounded">{p.category}</span>
          <h3 className="font-semibold text-lg mt-2">{p.title}</h3>
          {hasBoth && <p className="text-slate-400 text-sm mt-1">← 拉動睇前後對比 →</p>}
        </div>
      </div>
    </div>
  );
}
/* ===== 免費報價表單 ===== */
function QuoteForm() {
  const [phone, setPhone] = useState('');
  const [area, setArea] = useState('');
  const [state, setState] = useState('idle'); // idle | sending | done

  async function submit(e) {
    e.preventDefault();
    if (!phone) return;
    setState('sending');
    const { error } = await supabase.from('inquiries').insert({ phone, area });
    setState(error ? 'idle' : 'done');
    if (error) alert('提交失敗，請稍後再試');
  }

  return (
    <section id="quote" className="bg-slate-900 text-white py-16 sm:py-24">
      <div className="max-w-xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold">免費報價</h2>
          <p className="text-slate-300 mt-2">留低電話，專人一個工作天內聯絡你</p>
        </div>

        {state === 'done' ? (
          <div className="bg-white/10 rounded-2xl p-8 text-center">
            <CheckCircle2 className="text-amber-400 mx-auto mb-3" size={40} />
            <p className="font-semibold text-lg">已收到你嘅查詢！</p>
            <p className="text-slate-300 text-sm mt-1">我哋會盡快同你聯絡。</p>
          </div>
        ) : (
          <form onSubmit={submit} className="bg-white/10 rounded-2xl p-6 sm:p-8 space-y-4">
            <div>
              <label className="text-sm text-slate-300">聯絡電話 *</label>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} required
                type="tel" placeholder="例：9123 4567"
                className="w-full mt-1 px-4 py-3 rounded-lg bg-white/90 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400" />
            </div>
            <div>
              <label className="text-sm text-slate-300">單位面積</label>
              <select value={area} onChange={(e) => setArea(e.target.value)}
                className="w-full mt-1 px-4 py-3 rounded-lg bg-white/90 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400">
                <option value="">請選擇</option>
                <option>300 呎以下</option>
                <option>300 - 500 呎</option>
                <option>500 - 800 呎</option>
                <option>800 呎以上</option>
              </select>
            </div>
            <button type="submit" disabled={state === 'sending'}
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition disabled:opacity-60">
              {state === 'sending' && <Loader2 className="animate-spin" size={18} />}
              {state === 'sending' ? '提交中...' : '立即獲取報價'}
            </button>
            <p className="text-xs text-slate-400 text-center">提交即表示同意我哋透過電話聯絡你</p>
          </form>
        )}
      </div>
    </section>
  );
}
/* ===== 從 YouTube 連結抽出影片 ID ===== */
function getYoutubeId(url) {
  if (!url) return null;
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/);
  return m ? m[1] : null;
}