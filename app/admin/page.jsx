'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, uploadFile } from '@/lib/supabase';
import {
  LogOut, Loader2, Plus, Trash2, Save, Image as ImageIcon,
  LayoutGrid, Users, Settings as SettingsIcon, Inbox, Check, Pencil, X
} from 'lucide-react';

const TABS = [
  { key: 'projects', label: '工程案例', icon: LayoutGrid },
  { key: 'team', label: '星級團隊', icon: Users },
  { key: 'settings', label: '網站設定', icon: SettingsIcon },
  { key: 'inquiries', label: '查詢名單', icon: Inbox },
];

export default function AdminPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState('projects');

  // 檢查登入狀態
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) router.replace('/admin/login');
      else setReady(true);
    });
  }, [router]);

  async function logout() {
    await supabase.auth.signOut();
    router.replace('/admin/login');
  }

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-slate-400" size={28} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 頂部 */}
      <header className="bg-slate-900 text-white px-4 sm:px-6 py-4 flex items-center justify-between">
        <h1 className="font-bold text-lg">管理後台</h1>
        <button
          onClick={logout}
          className="flex items-center gap-1.5 text-sm bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition"
        >
          <LogOut size={16} /> 登出
        </button>
      </header>

      {/* 分頁 */}
      <nav className="bg-white border-b border-slate-200 px-2 sm:px-6 flex gap-1 overflow-x-auto">
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition ${
                active
                  ? 'border-slate-900 text-slate-900'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <Icon size={16} /> {t.label}
            </button>
          );
        })}
      </nav>

      <main className="p-4 sm:p-6 max-w-5xl mx-auto">
        {tab === 'projects' && <ProjectsTab />}
        {tab === 'team' && <TeamTab />}
        {tab === 'settings' && <SettingsTab />}
        {tab === 'inquiries' && <InquiriesTab />}
      </main>
    </div>
  );
}

/* ============ 工程案例 ============ */
function ProjectsTab() {
  const [categories, setCategories] = useState([]);
  const [newCat, setNewCat] = useState('');
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);

  // 新增表單
  const [f, setF] = useState({ category: '', title: '', youtube_url: '', sort_order: 0 });
  const [beforeFile, setBeforeFile] = useState(null);
  const [afterFile, setAfterFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [designFile, setDesignFile] = useState(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const { data: cats } = await supabase.from('categories').select('*').order('sort_order');
    const catNames = (cats || []).map((c) => c.name);
    setCategories(catNames);
    if (catNames.length && !f.category) setF((x) => ({ ...x, category: catNames[0] }));

    const { data: projs } = await supabase.from('projects').select('*').order('sort_order');
    setList(projs || []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function addCat() {
    if (!newCat.trim()) return;
    const { error } = await supabase.from('categories').insert({ name: newCat.trim(), sort_order: categories.length });
    if (error) return alert(error.message);
    setNewCat('');
    load();
  }
  async function removeCat(name) {
    if (!confirm(`刪除分類「${name}」？`)) return;
    await supabase.from('categories').delete().eq('name', name);
    load();
  }

  async function add() {
    if (!f.title) return alert('請填標題');
    setSaving(true);
    try {
      let before_url = '', after_url = '', video_url = '', design_url = '';
      if (beforeFile) before_url = await uploadFile('project-photos', beforeFile);
      if (afterFile) after_url = await uploadFile('project-photos', afterFile);
      if (videoFile) video_url = await uploadFile('project-photos', videoFile);
      if (designFile) design_url = await uploadFile('project-photos', designFile);

      const { error } = await supabase.from('projects').insert({
        category: f.category, title: f.title, youtube_url: f.youtube_url,
        sort_order: f.sort_order, before_url, after_url, video_url, design_url,
      });
      if (error) throw error;
      setF({ category: categories[0] || '', title: '', youtube_url: '', sort_order: 0 });
      setBeforeFile(null); setAfterFile(null); setVideoFile(null); setDesignFile(null);
      load();
    } catch (e) { alert('出錯：' + e.message); }
    setSaving(false);
  }

  async function remove(id) {
    if (!confirm('確定刪除？')) return;
    await supabase.from('projects').delete().eq('id', id);
    load();
  }

  return (
    <div className="space-y-6">
      {/* ===== 管理分類 ===== */}
      <div className="bg-white rounded-2xl shadow-sm p-5">
        <h2 className="font-bold text-slate-800 mb-4">管理分類</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map((c) => (
            <span key={c} className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full text-sm">
              {c}
              <button onClick={() => removeCat(c)} className="text-slate-400 hover:text-red-500"><Trash2 size={14} /></button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input value={newCat} onChange={(e) => setNewCat(e.target.value)} placeholder="新分類名稱"
            className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm" />
          <button onClick={addCat} className="flex items-center gap-1 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-slate-800">
            <Plus size={16} /> 加分類
          </button>
        </div>
      </div>

      {/* ===== 新增工程案例 ===== */}
      <div className="bg-white rounded-2xl shadow-sm p-5">
        <h2 className="font-bold text-slate-800 mb-4">新增工程案例</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <select value={f.category} onChange={(e) => setF({ ...f, category: e.target.value })}
            className="px-3 py-2 rounded-lg border border-slate-200 text-sm">
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <input placeholder="案例標題" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })}
            className="px-3 py-2 rounded-lg border border-slate-200 text-sm" />

          <label className="flex items-center gap-2 text-sm text-slate-600 border border-dashed border-slate-300 rounded-lg px-3 py-2 cursor-pointer">
            <ImageIcon size={16} /> {beforeFile ? beforeFile.name : '裝修前相片'}
            <input type="file" accept="image/*" className="hidden" onChange={(e) => setBeforeFile(e.target.files[0])} />
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-600 border border-dashed border-slate-300 rounded-lg px-3 py-2 cursor-pointer">
            <ImageIcon size={16} /> {afterFile ? afterFile.name : '裝修後相片'}
            <input type="file" accept="image/*" className="hidden" onChange={(e) => setAfterFile(e.target.files[0])} />
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-600 border border-dashed border-slate-300 rounded-lg px-3 py-2 cursor-pointer">
            <ImageIcon size={16} /> {videoFile ? videoFile.name : '上載影片（MP4）'}
            <input type="file" accept="video/*" className="hidden" onChange={(e) => setVideoFile(e.target.files[0])} />
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-600 border border-dashed border-slate-300 rounded-lg px-3 py-2 cursor-pointer">
            <ImageIcon size={16} /> {designFile ? designFile.name : '3D Design 圖'}
            <input type="file" accept="image/*" className="hidden" onChange={(e) => setDesignFile(e.target.files[0])} />
          </label>

          <input placeholder="YouTube 連結（例：https://youtu.be/xxxx）" value={f.youtube_url}
            onChange={(e) => setF({ ...f, youtube_url: e.target.value })}
            className="px-3 py-2 rounded-lg border border-slate-200 text-sm sm:col-span-2" />
          <input type="number" value={f.sort_order}
            onChange={(e) => setF({ ...f, sort_order: parseInt(e.target.value) || 0 })}
            className="px-3 py-2 rounded-lg border border-slate-200 text-sm" />
        </div>
        <button onClick={add} disabled={saving}
          className="mt-4 flex items-center gap-1.5 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-slate-800 disabled:opacity-60">
          {saving ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />} 新增案例
        </button>
      </div>

      {/* ===== 案例列表 ===== */}
      {loading ? <Loader2 className="animate-spin text-slate-400" /> : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map((p) => (
            editId === p.id
              ? <ProjectEditCard key={p.id} p={p} categories={categories}
                  onDone={() => { setEditId(null); load(); }}
                  onCancel={() => setEditId(null)} />
              : (
                <div key={p.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="grid grid-cols-2 gap-0.5 bg-slate-100 aspect-video">
                    {p.before_url ? <img src={p.before_url} alt="" className="w-full h-full object-cover" /> : <div className="flex items-center justify-center text-xs text-slate-300">前</div>}
                    {p.after_url ? <img src={p.after_url} alt="" className="w-full h-full object-cover" /> : <div className="flex items-center justify-center text-xs text-slate-300">後</div>}
                  </div>
                  <div className="p-3 flex items-center justify-between">
                    <div>
                      <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded">{p.category}</span>
                      <p className="font-medium text-slate-800 text-sm mt-1">{p.title}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => setEditId(p.id)} className="text-slate-400 hover:text-slate-700"><Pencil size={16} /></button>
                      <button onClick={() => remove(p.id)} className="text-red-400 hover:text-red-600"><Trash2 size={16} /></button>
                    </div>
                  </div>
                </div>
              )
          ))}
          {list.length === 0 && <p className="text-slate-400 text-sm">未有案例</p>}
        </div>
      )}
    </div>
   ); 
}
/* ============ 星級團隊 ============ */
function TeamTab() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', role: '', bio: '', sort_order: 0 });
  const [imgFile, setImgFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState(null); // 正在編輯緊邊個

  async function load() {
    setLoading(true);
    const { data } = await supabase.from('team').select('*').order('sort_order');
    setList(data || []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function add() {
    if (!form.name) return alert('請填名');
    setSaving(true);
    try {
      let img_url = null;
      if (imgFile) img_url = await uploadFile('team-photos', imgFile);
      const { error } = await supabase.from('team').insert({ ...form, img_url });
      if (error) throw error;
      setForm({ name: '', role: '', bio: '', sort_order: 0 });
      setImgFile(null);
      await load();
    } catch (e) { alert('出錯：' + e.message); }
    setSaving(false);
  }

  async function remove(id) {
    if (!confirm('確定刪除？')) return;
    await supabase.from('team').delete().eq('id', id);
    load();
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-5 space-y-4">
        <h2 className="font-semibold text-slate-800">新增星級團隊</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <input placeholder="姓名" value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="px-3 py-2 rounded-lg border border-slate-200" />
          <input placeholder="職位 / 專業" value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="px-3 py-2 rounded-lg border border-slate-200" />
          <input placeholder="簡介（例：18年經驗）" value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            className="px-3 py-2 rounded-lg border border-slate-200" />
          <input type="number" placeholder="排序" value={form.sort_order}
            onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
            className="px-3 py-2 rounded-lg border border-slate-200" />
          <label className="flex items-center gap-2 text-sm text-slate-600 border border-dashed border-slate-300 rounded-lg px-3 py-2 cursor-pointer sm:col-span-2">
            <ImageIcon size={16} /> {imgFile ? imgFile.name : '團隊相片'}
            <input type="file" accept="image/*" className="hidden"
              onChange={(e) => setImgFile(e.target.files[0])} />
          </label>
        </div>
        <button onClick={add} disabled={saving}
          className="flex items-center gap-1.5 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-slate-800 disabled:opacity-60">
          {saving ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />} 新增成員
        </button>
      </div>

      {loading ? <Loader2 className="animate-spin text-slate-400" /> : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map((m) => (
            editId === m.id
              ? <MemberEditCard key={m.id} m={m}
                  onDone={() => { setEditId(null); load(); }}
                  onCancel={() => setEditId(null)} />
              : (
                <div key={m.id} className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-slate-100 overflow-hidden shrink-0">
                    {m.img_url ? <img src={m.img_url} alt="" className="w-full h-full object-cover" /> :
                      <div className="w-full h-full flex items-center justify-center text-slate-300"><Users size={20} /></div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-800 text-sm truncate">{m.name}</p>
                    <p className="text-xs text-slate-500 truncate">{m.role}</p>
                    <p className="text-xs text-slate-400 truncate">{m.bio}</p>
                  </div>
                  <div className="flex flex-col gap-2 shrink-0">
                    <button onClick={() => setEditId(m.id)} className="text-slate-400 hover:text-slate-700">
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => remove(m.id)} className="text-red-400 hover:text-red-600">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              )
          ))}
        </div>
      )}
    </div>
  );
}

/* ===== 單個案例編輯卡 ===== */
function ProjectEditCard({ p, categories, onDone, onCancel }) {
  const [f, setF] = useState({
    category: p.category || categories[0] || '',
    title: p.title || '',
    sort_order: p.sort_order || 0,
    youtube_url: p.youtube_url || '',
    before_url: p.before_url || '',
    after_url: p.after_url || '',
    video_url: p.video_url || '',
    design_url: p.design_url || '',
  });
  const [beforeFile, setBeforeFile] = useState(null);
  const [afterFile, setAfterFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [designFile, setDesignFile] = useState(null);
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!f.title) return alert('請填標題');
    setSaving(true);
    try {
      let { before_url, after_url, video_url, design_url } = f;
      if (beforeFile) before_url = await uploadFile('project-photos', beforeFile);
      if (afterFile) after_url = await uploadFile('project-photos', afterFile);
      if (videoFile) video_url = await uploadFile('project-photos', videoFile);
      if (designFile) design_url = await uploadFile('project-photos', designFile);

      const { error } = await supabase.from('projects').update({
        category: f.category, title: f.title, sort_order: f.sort_order,
        youtube_url: f.youtube_url, before_url, after_url, video_url, design_url,
      }).eq('id', p.id);
      if (error) throw error;
      onDone();
    } catch (e) { alert('出錯：' + e.message); }
    setSaving(false);
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 space-y-3 ring-2 ring-slate-900/10 sm:col-span-2 lg:col-span-3">
      <h3 className="font-semibold text-slate-800 text-sm">編輯案例</h3>
      <div className="grid sm:grid-cols-2 gap-3">
        <select value={f.category} onChange={(e) => setF({ ...f, category: e.target.value })}
          className="px-3 py-2 rounded-lg border border-slate-200 text-sm">
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <input placeholder="案例標題" value={f.title}
          onChange={(e) => setF({ ...f, title: e.target.value })}
          className="px-3 py-2 rounded-lg border border-slate-200 text-sm" />

        <label className="flex items-center gap-2 text-sm text-slate-600 border border-dashed border-slate-300 rounded-lg px-3 py-2 cursor-pointer">
          <ImageIcon size={16} /> {beforeFile ? beforeFile.name : (f.before_url ? '更換裝修前相' : '裝修前相片')}
          <input type="file" accept="image/*" className="hidden" onChange={(e) => setBeforeFile(e.target.files[0])} />
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-600 border border-dashed border-slate-300 rounded-lg px-3 py-2 cursor-pointer">
          <ImageIcon size={16} /> {afterFile ? afterFile.name : (f.after_url ? '更換裝修後相' : '裝修後相片')}
          <input type="file" accept="image/*" className="hidden" onChange={(e) => setAfterFile(e.target.files[0])} />
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-600 border border-dashed border-slate-300 rounded-lg px-3 py-2 cursor-pointer">
          <ImageIcon size={16} /> {videoFile ? videoFile.name : (f.video_url ? '更換影片' : '上載影片（MP4）')}
          <input type="file" accept="video/*" className="hidden" onChange={(e) => setVideoFile(e.target.files[0])} />
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-600 border border-dashed border-slate-300 rounded-lg px-3 py-2 cursor-pointer">
          <ImageIcon size={16} /> {designFile ? designFile.name : (f.design_url ? '更換 3D 圖' : '3D Design 圖')}
          <input type="file" accept="image/*" className="hidden" onChange={(e) => setDesignFile(e.target.files[0])} />
        </label>

        <input placeholder="YouTube 連結" value={f.youtube_url}
          onChange={(e) => setF({ ...f, youtube_url: e.target.value })}
          className="px-3 py-2 rounded-lg border border-slate-200 text-sm sm:col-span-2" />
        <input type="number" placeholder="排序" value={f.sort_order}
          onChange={(e) => setF({ ...f, sort_order: parseInt(e.target.value) || 0 })}
          className="px-3 py-2 rounded-lg border border-slate-200 text-sm" />
      </div>
      <div className="flex gap-2">
        <button onClick={save} disabled={saving}
          className="flex-1 flex items-center justify-center gap-1.5 bg-slate-900 text-white px-3 py-2 rounded-lg text-sm hover:bg-slate-800 disabled:opacity-60">
          {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} 儲存
        </button>
        <button onClick={onCancel}
          className="flex items-center justify-center gap-1.5 bg-slate-100 text-slate-600 px-3 py-2 rounded-lg text-sm hover:bg-slate-200">
          <X size={16} /> 取消
        </button>
      </div>
    </div>
  );
}



/* ===== 單個成員編輯卡 ===== */
function MemberEditCard({ m, onDone, onCancel }) {
  const [f, setF] = useState({
    name: m.name || '', role: m.role || '', bio: m.bio || '',
    sort_order: m.sort_order || 0, img_url: m.img_url || '',
  });
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!f.name) return alert('請填名');
    setSaving(true);
    try {
      let img_url = f.img_url;
      if (file) img_url = await uploadFile('team-photos', file);
      const { error } = await supabase.from('team').update({
        name: f.name, role: f.role, bio: f.bio,
        sort_order: f.sort_order, img_url,
      }).eq('id', m.id);
      if (error) throw error;
      onDone();
    } catch (e) { alert('出錯：' + e.message); }
    setSaving(false);
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 space-y-3 ring-2 ring-slate-900/10">
      <div className="flex items-center gap-3">
        <div className="w-14 h-14 rounded-full bg-slate-100 overflow-hidden shrink-0">
          {(file ? URL.createObjectURL(file) : f.img_url)
            ? <img src={file ? URL.createObjectURL(file) : f.img_url} alt="" className="w-full h-full object-cover" />
            : <div className="w-full h-full flex items-center justify-center text-slate-300"><Users size={20} /></div>}
        </div>
        <label className="flex-1 flex items-center gap-2 text-xs text-slate-600 border border-dashed border-slate-300 rounded-lg px-2 py-2 cursor-pointer">
          <ImageIcon size={14} /> {file ? file.name : '更換相片'}
          <input type="file" accept="image/*" className="hidden"
            onChange={(e) => setFile(e.target.files[0])} />
        </label>
      </div>
      <input placeholder="姓名" value={f.name}
        onChange={(e) => setF({ ...f, name: e.target.value })}
        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" />
      <input placeholder="職位 / 專業" value={f.role}
        onChange={(e) => setF({ ...f, role: e.target.value })}
        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" />
      <input placeholder="簡介" value={f.bio}
        onChange={(e) => setF({ ...f, bio: e.target.value })}
        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" />
      <input type="number" placeholder="排序" value={f.sort_order}
        onChange={(e) => setF({ ...f, sort_order: parseInt(e.target.value) || 0 })}
        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" />
      <div className="flex gap-2">
        <button onClick={save} disabled={saving}
          className="flex-1 flex items-center justify-center gap-1.5 bg-slate-900 text-white px-3 py-2 rounded-lg text-sm hover:bg-slate-800 disabled:opacity-60">
          {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} 儲存
        </button>
        <button onClick={onCancel}
          className="flex items-center justify-center gap-1.5 bg-slate-100 text-slate-600 px-3 py-2 rounded-lg text-sm hover:bg-slate-200">
          <X size={16} /> 取消
        </button>
      </div>
    </div>
  );
}

/* ============ 網站設定 ============ */
function SettingsTab() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Logo
  const [logoUrl, setLogoUrl] = useState('');
  const [logoUploading, setLogoUploading] = useState(false);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from('settings').select('*').order('key');
    const all = data || [];
    setRows(all.filter((r) => r.key !== 'project_categories' && r.key !== 'logo_url'));
    setLogoUrl(all.find((r) => r.key === 'logo_url')?.value || '');
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  // 通用：寫入一個 setting（唔存在就新增）
  async function upsertSetting(key, value) {
    const { data } = await supabase.from('settings').select('key').eq('key', key).maybeSingle();
    if (data) {
      await supabase.from('settings').update({ value }).eq('key', key);
    } else {
      await supabase.from('settings').insert({ key, value });
    }
  }

  async function onLogoPick(e) {
    const file = e.target.files[0];
    if (!file) return;
    setLogoUploading(true);
    try {
      const url = await uploadFile('project-photos', file); // 如用 site-assets 就改呢度
      setLogoUrl(url);
      await upsertSetting('logo_url', url);
    } catch (err) { alert('上載失敗：' + err.message); }
    setLogoUploading(false);
  }

  async function removeLogo() {
    if (!confirm('確定刪除 Logo？')) return;
    setLogoUrl('');
    await upsertSetting('logo_url', '');
  }

  async function saveAll() {
    setSaving(true);
    for (const r of rows) {
      await supabase.from('settings').update({ value: r.value }).eq('key', r.key);
    }
    setSaving(false);
    alert('已儲存');
  }

  const LABELS = {
    company_name: '公司名稱', slogan: '標語', phone: '電話', whatsapp: 'WhatsApp',
    email: 'Email', address: '地址', business_hour: '營業時間',
    license_no: '牌照號碼', facebook: 'Facebook', instagram: 'Instagram', youtube: 'YouTube',
  };

  if (loading) return <Loader2 className="animate-spin text-slate-400" />;

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Logo 設定 */}
      <div className="bg-white rounded-xl shadow-sm p-5 space-y-4">
        <h2 className="font-semibold text-slate-800">公司 Logo</h2>
        <div className="flex items-center gap-4">
          <div className="w-40 h-20 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden shrink-0">
            {logoUrl
              ? <img src={logoUrl} alt="logo" className="max-w-full max-h-full object-contain" />
              : <span className="text-xs text-slate-400">未有 Logo</span>}
          </div>
          <div className="flex gap-2">
            <label className="flex items-center gap-1.5 text-sm bg-slate-700 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-slate-800">
              {logoUploading ? <Loader2 className="animate-spin" size={16} /> : <ImageIcon size={16} />}
              {logoUrl ? '更換' : '上載'}
              <input type="file" accept="image/*" className="hidden" onChange={onLogoPick} disabled={logoUploading} />
            </label>
            {logoUrl && (
              <button onClick={removeLogo}
                className="flex items-center gap-1.5 text-sm bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100">
                <Trash2 size={16} /> 刪除
              </button>
            )}
          </div>
        </div>
        <p className="text-xs text-slate-400">建議 PNG 透明底，闊度約 300–600px。</p>
      </div>

      {/* 其他設定 */}
      <div className="bg-white rounded-xl shadow-sm p-5 space-y-4">
        <h2 className="font-semibold text-slate-800">網站 / Footer 設定</h2>
        <div className="space-y-3">
          {rows.map((r, i) => (
            <div key={r.key} className="grid grid-cols-3 gap-3 items-center">
              <label className="text-sm text-slate-500">{LABELS[r.key] || r.key}</label>
              <input
                value={r.value || ''}
                onChange={(e) => {
                  const copy = [...rows];
                  copy[i] = { ...r, value: e.target.value };
                  setRows(copy);
                }}
                className="col-span-2 px-3 py-2 rounded-lg border border-slate-200"
              />
            </div>
          ))}
        </div>
        <button onClick={saveAll} disabled={saving}
          className="flex items-center gap-1.5 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-slate-800 disabled:opacity-60">
          {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} 儲存全部
        </button>
      </div>
    </div>
  );
}

/* ============ 查詢名單 ============ */
const SERVICE_TYPE_LABELS = {
  match: '團隊工程報價',
  general: '一般查詢',
};

function InquiriesTab() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from('inquiries').select('*').order('created_at', { ascending: false });
    setList(data || []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function toggle(id, current) {
    await supabase.from('inquiries').update({ followed_up: !current }).eq('id', id);
    load();
  }

  if (loading) return <Loader2 className="animate-spin text-slate-400" />;

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
      <table className="w-full text-sm min-w-[720px]">
        <thead className="bg-slate-50 text-slate-500 text-left">
          <tr>
            <th className="px-4 py-3">時間</th>
            <th className="px-4 py-3">服務類型</th>
            <th className="px-4 py-3">服務主題</th>
            <th className="px-4 py-3">稱呼</th>
            <th className="px-4 py-3">電話</th>
            <th className="px-4 py-3">面積</th>
            <th className="px-4 py-3">備註</th>
            <th className="px-4 py-3">狀態</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {list.map((q) => (
            <tr key={q.id}>
              <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{new Date(q.created_at).toLocaleString('zh-HK')}</td>
              <td className="px-4 py-3 text-slate-700">
                {SERVICE_TYPE_LABELS[q.service_type] || q.service_type || '-'}
              </td>
              <td className="px-4 py-3 text-slate-700 whitespace-nowrap">{q.topic || '-'}</td>
              <td className="px-4 py-3 text-slate-700">{q.name || '-'}</td>
              <td className="px-4 py-3 font-medium text-slate-800">{q.phone}</td>
              <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{q.area || '-'}</td>
              <td className="px-4 py-3 text-slate-500 max-w-[200px] truncate" title={q.notes || ''}>
                {q.notes || '-'}
              </td>
              <td className="px-4 py-3">
                <button onClick={() => toggle(q.id, q.followed_up)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs ${
                    q.followed_up ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                  {q.followed_up ? <><Check size={13} /> 已跟進</> : '待跟進'}
                </button>
              </td>
            </tr>
          ))}
          {list.length === 0 && (
            <tr><td colSpan={8} className="px-4 py-8 text-center text-slate-400">未有查詢</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}