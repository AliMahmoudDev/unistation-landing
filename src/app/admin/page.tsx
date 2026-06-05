"use client";

import { useState, useEffect, useCallback } from "react";

/* ═══════════════════════════════════════════════════
   Admin Panel - UniStation (Easy Forms)
   ═══════════════════════════════════════════════════ */

type ConfigData = Record<string, any>;

/* ─── Shared Styles ─── */
const S = {
  input: {
    width: "100%", padding: "10px 14px", border: "2px solid #e5e7eb", borderRadius: 10,
    fontSize: 14, outline: "none", boxSizing: "border-box" as const, fontFamily: "Cairo, sans-serif",
    transition: "border-color 0.2s", background: "#fff",
  },
  label: { display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 },
  textarea: {
    width: "100%", padding: "10px 14px", border: "2px solid #e5e7eb", borderRadius: 10,
    fontSize: 14, outline: "none", boxSizing: "border-box" as const, fontFamily: "Cairo, sans-serif",
    resize: "vertical" as const, minHeight: 80,
  },
  card: { background: "#fff", borderRadius: 12, padding: 20, border: "1px solid #e5e7eb", marginBottom: 16 },
  sectionTitle: { color: "#28143c", fontSize: 16, fontWeight: 700, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 },
  saveBtn: (saving: boolean) => ({
    padding: "10px 24px", background: saving ? "#d1d5db" : "#f0b414", color: "#28143c",
    border: "none", borderRadius: 10, fontWeight: 700, cursor: saving ? "not-allowed" : "pointer",
    fontSize: 14, fontFamily: "Cairo, sans-serif",
  }),
  deleteBtn: {
    padding: "6px 12px", background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca",
    borderRadius: 8, fontSize: 12, cursor: "pointer", fontWeight: 600, fontFamily: "Cairo, sans-serif",
  },
  addBtn: {
    padding: "10px 20px", background: "#eff6ff", color: "#2563eb", border: "2px dashed #bfdbfe",
    borderRadius: 10, fontSize: 14, cursor: "pointer", fontWeight: 600, fontFamily: "Cairo, sans-serif",
    width: "100%", textAlign: "center" as const,
  },
};

/* ─── Reusable Input Components ─── */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div style={{ marginBottom: 14 }}>
    <label style={S.label}>{label}</label>
    {children}
  </div>;
}

function TextInput({ value, onChange, placeholder, dir = "rtl" }: {
  value: string; onChange: (v: string) => void; placeholder?: string; dir?: string;
}) {
  return <input type="text" value={value} onChange={e => onChange(e.target.value)}
    placeholder={placeholder} dir={dir}
    onFocus={e => e.currentTarget.style.borderColor = "#f0b414"}
    onBlur={e => e.currentTarget.style.borderColor = "#e5e7eb"}
    style={S.input} />;
}

function TextArea({ value, onChange, placeholder, rows = 3 }: {
  value: string; onChange: (v: string) => void; placeholder?: string; rows?: number;
}) {
  return <textarea value={value} onChange={e => onChange(e.target.value)}
    placeholder={placeholder} rows={rows}
    onFocus={e => e.currentTarget.style.borderColor = "#f0b414"}
    onBlur={e => e.currentTarget.style.borderColor = "#e5e7eb"}
    style={{ ...S.textarea, minHeight: rows * 30 }} />;
}

function NumberInput({ value, onChange, min = 0, step = 1 }: {
  value: number; onChange: (v: number) => void; min?: number; step?: number;
}) {
  return <input type="number" value={value} onChange={e => onChange(parseFloat(e.target.value) || 0)}
    min={min} step={step} dir="ltr"
    onFocus={e => e.currentTarget.style.borderColor = "#f0b414"}
    onBlur={e => e.currentTarget.style.borderColor = "#e5e7eb"}
    style={S.input} />;
}

function Checkbox({ checked, onChange, label }: {
  checked: boolean; onChange: (v: boolean) => void; label: string;
}) {
  return <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 14 }}>
    <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)}
      style={{ width: 18, height: 18, accentColor: "#f0b414" }} />
    {label}
  </label>;
}

function EditableList({ items, onChange, label, addLabel }: {
  items: string[]; onChange: (items: string[]) => void; label: string; addLabel: string;
}) {
  const update = (i: number, v: string) => {
    const next = [...items];
    next[i] = v;
    onChange(next);
  };
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));
  const add = () => onChange([...items, ""]);
  return <div>
    <label style={S.label}>{label}</label>
    {items.map((item, i) => (
      <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center" }}>
        <input type="text" value={item} onChange={e => update(i, e.target.value)}
          placeholder={`${label} ${i + 1}`}
          onFocus={e => e.currentTarget.style.borderColor = "#f0b414"}
          onBlur={e => e.currentTarget.style.borderColor = "#e5e7eb"}
          style={{ ...S.input, flex: 1 }} />
        <button onClick={() => remove(i)} style={S.deleteBtn}>حذف</button>
      </div>
    ))}
    <button onClick={add} style={S.addBtn}>+ {addLabel}</button>
  </div>;
}

/* ─── Tab Content Components ─── */

function StatsEditor({ data, onChange }: { data: any[]; onChange: (d: any[]) => void }) {
  const update = (i: number, field: string, value: any) => {
    const next = [...data];
    next[i] = { ...next[i], [field]: value };
    onChange(next);
  };
  return <div>
    {data.map((stat, i) => (
      <div key={i} style={S.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <span style={{ fontWeight: 700, color: "#28143c" }}>الرقم {i + 1}</span>
          <button onClick={() => onChange(data.filter((_, idx) => idx !== i))} style={S.deleteBtn}>حذف</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12 }}>
          <Field label="القيمة (الرقم)">
            <NumberInput value={stat.target || 0} onChange={v => update(i, "target", v)} step={0.1} />
          </Field>
          <Field label="قبل الرقم">
            <TextInput value={stat.prefix || ""} onChange={v => update(i, "prefix", v)} placeholder="مثل +" />
          </Field>
          <Field label="بعد الرقم">
            <TextInput value={stat.suffix || ""} onChange={v => update(i, "suffix", v)} placeholder="مثل %" />
          </Field>
          <Field label="العنوان">
            <TextInput value={stat.label || ""} onChange={v => update(i, "label", v)} placeholder="جامعات معتمدة" />
          </Field>
        </div>
      </div>
    ))}
    <button onClick={() => onChange([...data, { target: 0, prefix: "", suffix: "", label: "" }])} style={S.addBtn}>
      + إضافة رقم جديد
    </button>
  </div>;
}

function UniversitiesEditor({ data, onChange }: { data: any[]; onChange: (d: any[]) => void }) {
  const update = (i: number, field: string, value: any) => {
    const next = [...data];
    next[i] = { ...next[i], [field]: value };
    onChange(next);
  };
  const updateFeature = (i: number, fi: number, v: string) => {
    const next = [...data];
    const features = [...next[i].features];
    features[fi] = v;
    next[i] = { ...next[i], features };
    onChange(next);
  };
  const addFeature = (i: number) => {
    const next = [...data];
    next[i] = { ...next[i], features: [...(next[i].features || []), ""] };
    onChange(next);
  };
  const removeFeature = (i: number, fi: number) => {
    const next = [...data];
    next[i] = { ...next[i], features: next[i].features.filter((_: any, idx: number) => idx !== fi) };
    onChange(next);
  };
  return <div>
    {data.map((uni, i) => (
      <div key={i} style={{ ...S.card, borderLeft: uni.highlight ? "4px solid #f0b414" : "1px solid #e5e7eb" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <span style={{ fontWeight: 700, color: "#28143c", fontSize: 15 }}>
            #{uni.rank || i + 1} — {uni.nameAr || uni.name}
          </span>
          <button onClick={() => onChange(data.filter((_, idx) => idx !== i))} style={S.deleteBtn}>حذف</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          <Field label="الاسم بالإنجليزي">
            <TextInput value={uni.name || ""} onChange={v => update(i, "name", v)} dir="ltr" placeholder="University Name" />
          </Field>
          <Field label="الاسم بالعربي">
            <TextInput value={uni.nameAr || ""} onChange={v => update(i, "nameAr", v)} placeholder="اسم الجامعة" />
          </Field>
          <Field label="الاختصار">
            <TextInput value={uni.abbr || ""} onChange={v => update(i, "abbr", v)} dir="ltr" placeholder="TSMU" />
          </Field>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          <Field label="الرسوم">
            <TextInput value={uni.fee || ""} onChange={v => update(i, "fee", v)} dir="ltr" placeholder="$8,000" />
          </Field>
          <Field label="النوع">
            <TextInput value={uni.type || ""} onChange={v => update(i, "type", v)} placeholder="حكومية / خاصة" />
          </Field>
          <Field label="الترتيب">
            <NumberInput value={uni.rank || i + 1} onChange={v => update(i, "rank", v)} />
          </Field>
        </div>
        <Field label="الوصف">
          <TextArea value={uni.desc || ""} onChange={v => update(i, "desc", v)} rows={2} placeholder="وصف الجامعة..." />
        </Field>
        <Checkbox checked={!!uni.highlight} onChange={v => update(i, "highlight", v)} label="تمييز الجامعة (إظهارها بشكل مميز)" />
        {/* Features */}
        <div style={{ marginTop: 14 }}>
          <label style={S.label}>المميزات</label>
          {(uni.features || []).map((f: string, fi: number) => (
            <div key={fi} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center" }}>
              <input type="text" value={f} onChange={e => updateFeature(i, fi, e.target.value)}
                placeholder={`ميزة ${fi + 1}`}
                onFocus={e => e.currentTarget.style.borderColor = "#f0b414"}
                onBlur={e => e.currentTarget.style.borderColor = "#e5e7eb"}
                style={{ ...S.input, flex: 1 }} />
              <button onClick={() => removeFeature(i, fi)} style={S.deleteBtn}>✕</button>
            </div>
          ))}
          <button onClick={() => addFeature(i)} style={{ ...S.addBtn, marginTop: 4 }}>+ إضافة ميزة</button>
        </div>
      </div>
    ))}
    <button onClick={() => onChange([...data, { rank: data.length + 1, name: "", nameAr: "", abbr: "", fee: "", type: "", desc: "", features: [], highlight: false }])} style={S.addBtn}>
      + إضافة جامعة جديدة
    </button>
  </div>;
}

function PackageEditor({ data, onChange, title }: { data: any; onChange: (d: any) => void; title: string }) {
  const update = (field: string, value: any) => onChange({ ...data, [field]: value });

  const updateInstallment = (i: number, field: string, v: string) => {
    const next = [...(data.installments || [])];
    next[i] = { ...next[i], [field]: v };
    update("installments", next);
  };
  const removeInstallment = (i: number) => update("installments", (data.installments || []).filter((_: any, idx: number) => idx !== i));
  const addInstallment = () => update("installments", [...(data.installments || []), { label: "", amount: "", note: "" }]);

  return <div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
      <Field label="العنوان">
        <TextInput value={data.title || ""} onChange={v => update("title", v)} />
      </Field>
      <Field label="شارة التميز">
        <TextInput value={data.badge || ""} onChange={v => update("badge", v)} placeholder="أفضل قيمة" />
      </Field>
    </div>
    <Field label="الوصف">
      <TextArea value={data.description || ""} onChange={v => update("description", v)} rows={2} />
    </Field>
    {data.totalPrice !== undefined && (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Field label="السعر الإجمالي">
          <TextInput value={data.totalPrice || ""} onChange={v => update("totalPrice", v)} dir="ltr" placeholder="5,800" />
        </Field>
        <Field label="العملة">
          <TextInput value={data.currency || ""} onChange={v => update("currency", v)} placeholder="درهم" />
        </Field>
      </div>
    )}
    {data.priceNote && (
      <Field label="ملاحظة السعر">
        <TextInput value={data.priceNote || ""} onChange={v => update("priceNote", v)} />
      </Field>
    )}
    {/* Installments */}
    {data.installments && (
      <div style={{ marginTop: 12 }}>
        <label style={{ ...S.label, fontSize: 15, color: "#28143c" }}>الدفعات</label>
        {(data.installments || []).map((inst: any, i: number) => (
          <div key={i} style={S.card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontWeight: 600, color: "#28143c" }}>الدفعة {i + 1}</span>
              <button onClick={() => removeInstallment(i)} style={S.deleteBtn}>حذف</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Field label="اسم الدفعة">
                <TextInput value={inst.label || ""} onChange={v => updateInstallment(i, "label", v)} />
              </Field>
              <Field label="المبلغ">
                <TextInput value={inst.amount || ""} onChange={v => updateInstallment(i, "amount", v)} dir="ltr" />
              </Field>
            </div>
            <Field label="ملاحظة">
              <TextInput value={inst.note || ""} onChange={v => updateInstallment(i, "note", v)} />
            </Field>
          </div>
        ))}
        <button onClick={addInstallment} style={{ ...S.addBtn, marginTop: 8 }}>+ إضافة دفعة</button>
      </div>
    )}
    {data.note && (
      <Field label="ملاحظة">
        <TextArea value={data.note || ""} onChange={v => update("note", v)} rows={2} />
      </Field>
    )}
    {/* Services */}
    <EditableList items={data.services || []} onChange={v => update("services", v)}
      label="الخدمات" addLabel="إضافة خدمة" />
  </div>;
}

function RegistrationEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  const update = (field: string, value: any) => onChange({ ...data, [field]: value });

  const updateDoc = (i: number, field: string, v: string) => {
    const next = [...(data.docs || [])];
    next[i] = { ...next[i], [field]: v };
    update("docs", next);
  };
  const removeDoc = (i: number) => update("docs", (data.docs || []).filter((_: any, idx: number) => idx !== i));
  const addDoc = () => update("docs", [...(data.docs || []), { title: "", desc: "" }]);

  return <div>
    <Field label="العنوان">
      <TextInput value={data.title || ""} onChange={v => update("title", v)} />
    </Field>
    <Field label="الوصف">
      <TextArea value={data.description || ""} onChange={v => update("description", v)} rows={2} />
    </Field>
    <label style={{ ...S.label, fontSize: 15, color: "#28143c", marginTop: 12 }}>المستندات المطلوبة</label>
    {(data.docs || []).map((doc: any, i: number) => (
      <div key={i} style={S.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <span style={{ fontWeight: 600, color: "#28143c" }}>المستند {i + 1}</span>
          <button onClick={() => removeDoc(i)} style={S.deleteBtn}>حذف</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label="اسم المستند">
            <TextInput value={doc.title || ""} onChange={v => updateDoc(i, "title", v)} />
          </Field>
          <Field label="الوصف">
            <TextInput value={doc.desc || ""} onChange={v => updateDoc(i, "desc", v)} />
          </Field>
        </div>
      </div>
    ))}
    <button onClick={addDoc} style={S.addBtn}>+ إضافة مستند</button>
  </div>;
}

function FaqsEditor({ data, onChange }: { data: any[]; onChange: (d: any[]) => void }) {
  const updateQ = (i: number, v: string) => {
    const next = [...data];
    next[i] = { ...next[i], q: v };
    onChange(next);
  };
  const updateA = (i: number, v: string) => {
    const next = [...data];
    next[i] = { ...next[i], a: v };
    onChange(next);
  };
  const remove = (i: number) => onChange(data.filter((_, idx) => idx !== i));
  const add = () => onChange([...data, { q: "", a: "" }]);

  return <div>
    {data.map((faq, i) => (
      <div key={i} style={S.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <span style={{ fontWeight: 700, color: "#f0b414", fontSize: 14 }}>السؤال {i + 1}</span>
          <button onClick={() => remove(i)} style={S.deleteBtn}>حذف</button>
        </div>
        <Field label="السؤال">
          <TextInput value={faq.q || ""} onChange={v => updateQ(i, v)} placeholder="اكتب السؤال هنا..." />
        </Field>
        <Field label="الإجابة">
          <TextArea value={faq.a || ""} onChange={v => updateA(i, v)} rows={3} placeholder="اكتب الإجابة هنا..." />
        </Field>
      </div>
    ))}
    <button onClick={add} style={S.addBtn}>+ إضافة سؤال جديد</button>
  </div>;
}

function HeroEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  const update = (field: string, value: any) => onChange({ ...data, [field]: value });
  return <div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
      <Field label="الشارة (Badge)">
        <TextInput value={data.badge || ""} onChange={v => update("badge", v)} />
      </Field>
      <Field label="السطر الأول من العنوان">
        <TextInput value={data.title1 || ""} onChange={v => update("title1", v)} />
      </Field>
    </div>
    <Field label="السطر الثاني من العنوان (الكلمة المميزة)">
      <TextInput value={data.title2 || ""} onChange={v => update("title2", v)} />
    </Field>
    <Field label="الوصف">
      <TextArea value={data.description || ""} onChange={v => update("description", v)} rows={3} />
    </Field>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
      <Field label="نص الزر الأساسي">
        <TextInput value={data.ctaPrimary || ""} onChange={v => update("ctaPrimary", v)} />
      </Field>
      <Field label="نص الزر الثانوي">
        <TextInput value={data.ctaSecondary || ""} onChange={v => update("ctaSecondary", v)} />
      </Field>
    </div>
  </div>;
}

function ContactEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  const update = (field: string, value: any) => onChange({ ...data, [field]: value });
  return <div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
      <Field label="رقم الواتساب">
        <TextInput value={data.whatsapp || ""} onChange={v => update("whatsapp", v)} dir="ltr" placeholder="+971..." />
      </Field>
      <Field label="رابط الواتساب">
        <TextInput value={data.whatsappLink || ""} onChange={v => update("whatsappLink", v)} dir="ltr" />
      </Field>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
      <Field label="البريد الإلكتروني">
        <TextInput value={data.email || ""} onChange={v => update("email", v)} dir="ltr" placeholder="info@unistation.org" />
      </Field>
      <Field label="رقم الهاتف">
        <TextInput value={data.phone || ""} onChange={v => update("phone", v)} dir="ltr" placeholder="+971 52..." />
      </Field>
    </div>
    <Field label="رابط الانستجرام">
      <TextInput value={data.social?.instagram || ""} onChange={v => update("social", { ...data.social, instagram: v })} dir="ltr" />
    </Field>
  </div>;
}

/* ═══════════════════════════════════════════════════
   Main Admin Page
   ═══════════════════════════════════════════════════ */

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [data, setData] = useState<ConfigData>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedKey, setSavedKey] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("stats");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/config");
      const json = await res.json();
      setData(json);
    } catch {
      setError("فشل تحميل البيانات");
    }
    setLoading(false);
  }, []);

  const handleLogin = async () => {
    if (!password) return;
    // Verify password against server
    try {
      const res = await fetch("/api/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json", "x-admin-password": password },
        body: JSON.stringify({ key: "_ping", value: true }),
      });
      if (res.status === 401) {
        setLoginError("كلمة المرور غير صحيحة");
        return;
      }
    } catch {
      // If server unreachable, still allow login (for local dev)
    }
    setLoginError("");
    setLoggedIn(true);
    fetchData();
  };

  const saveKey = async (key: string, value: any) => {
    setSaving(true);
    setSavedKey(null);
    setError("");
    try {
      const res = await fetch("/api/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json", "x-admin-password": password },
        body: JSON.stringify({ key, value }),
      });
      if (!res.ok) { setError("فشل الحفظ"); return; }
      setSavedKey(key);
      setTimeout(() => setSavedKey(null), 3000);
    } catch { setError("خطأ في الاتصال"); }
    setSaving(false);
  };

  const handleSaveTab = () => {
    const tabMap: Record<string, string> = {
      stats: "stats", universities: "universities", basicPackage: "basicPackage",
      additionalPackage: "additionalPackage", registration: "registration",
      faqs: "faqs", hero: "hero", contact: "site",
    };
    const key = tabMap[activeTab];
    if (key && data[key]) saveKey(key, data[key]);
  };

  const updateTabData = (value: any) => {
    const tabMap: Record<string, string> = {
      stats: "stats", universities: "universities", basicPackage: "basicPackage",
      additionalPackage: "additionalPackage", registration: "registration",
      faqs: "faqs", hero: "hero", contact: "site",
    };
    const key = tabMap[activeTab];
    if (key) setData(prev => ({ ...prev, [key]: value }));
  };

  const tabs = [
    { id: "stats", label: "الأرقام", icon: "📊" },
    { id: "universities", label: "الجامعات", icon: "🎓" },
    { id: "hero", label: "الهيرو", icon: "🖼️" },
    { id: "contact", label: "بيانات التواصل", icon: "📞" },
    { id: "basicPackage", label: "الباقة الأساسية", icon: "📦" },
    { id: "additionalPackage", label: "خدمة المرافقة", icon: "✈️" },
    { id: "registration", label: "التسجيل", icon: "📋" },
    { id: "faqs", label: "الأسئلة الشائعة", icon: "❓" },
  ];

  /* ─── Login Screen ─── */
  if (!loggedIn) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#28143c", fontFamily: "Cairo, sans-serif", direction: "rtl" }}>
        <div style={{ background: "white", borderRadius: 20, padding: "48px 40px", width: 400, textAlign: "center", boxShadow: "0 25px 50px rgba(0,0,0,0.3)" }}>
          <div style={{ width: 70, height: 70, background: "linear-gradient(135deg, #28143c, #3d1f5e)", borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 32 }}>⚙️</div>
          <h1 style={{ color: "#28143c", fontSize: 26, fontWeight: 800, marginBottom: 6 }}>UniStation Admin</h1>
          <p style={{ color: "#888", fontSize: 14, marginBottom: 28 }}>أدخل كلمة المرور للوصول إلى لوحة التحكم</p>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
            placeholder="كلمة المرور"
            onFocus={e => e.currentTarget.style.borderColor = "#f0b414"}
            onBlur={e => e.currentTarget.style.borderColor = "#e5e7eb"}
            style={{ width: "100%", padding: "14px 18px", border: "2px solid #e5e7eb", borderRadius: 12, fontSize: 16, outline: "none", boxSizing: "border-box", marginBottom: 16, fontFamily: "Cairo, sans-serif" }}
          />
          {loginError && <p style={{ color: "#e11d48", fontSize: 13, marginBottom: 14 }}>{loginError}</p>}
          <button
            onClick={handleLogin}
            style={{ width: "100%", padding: 14, background: "linear-gradient(135deg, #f0b414, #e5a710)", color: "#28143c", border: "none", borderRadius: 12, fontSize: 17, fontWeight: 800, cursor: "pointer", fontFamily: "Cairo, sans-serif", boxShadow: "0 4px 15px rgba(240,180,20,0.4)" }}
          >
            دخول
          </button>
        </div>
      </div>
    );
  }

  /* ─── Admin Dashboard ─── */
  return (
    <div style={{ minHeight: "100vh", background: "#f8f9fa", fontFamily: "Cairo, sans-serif", direction: "rtl" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #28143c, #3d1f5e)", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 4px 15px rgba(40,20,60,0.3)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, background: "rgba(255,255,255,0.15)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>⚙️</div>
          <h1 style={{ color: "white", fontSize: 18, fontWeight: 700, margin: 0 }}>لوحة التحكم — UniStation</h1>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={fetchData} disabled={loading}
            style={{ padding: "8px 16px", background: "rgba(255,255,255,0.15)", color: "white", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 8, fontWeight: 600, cursor: "pointer", fontSize: 13 }}>
            {loading ? "⏳..." : "🔄 تحديث"}
          </button>
          <a href="/" style={{ padding: "8px 16px", background: "#f0b414", color: "#28143c", border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer", fontSize: 13, textDecoration: "none" }}>
            👁️ عرض الموقع
          </a>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: "white", borderBottom: "1px solid #e5e7eb", display: "flex", overflowX: "auto", padding: "0 16px" }}>
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              padding: "12px 18px", border: "none",
              borderBottom: activeTab === t.id ? "3px solid #f0b414" : "3px solid transparent",
              background: activeTab === t.id ? "#fffbeb" : "none",
              color: activeTab === t.id ? "#28143c" : "#888",
              fontWeight: activeTab === t.id ? 700 : 500,
              cursor: "pointer", whiteSpace: "nowrap", fontSize: 13,
              fontFamily: "Cairo, sans-serif", transition: "all 0.2s",
            }}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ maxWidth: 950, margin: "24px auto", padding: "0 16px" }}>
        {/* Status messages */}
        {error && (
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#991b1b", padding: 14, borderRadius: 12, marginBottom: 16, fontSize: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>❌ {error}</span>
            <button onClick={() => setError("")} style={{ border: "none", background: "none", cursor: "pointer", fontSize: 18, color: "#991b1b" }}>✕</button>
          </div>
        )}
        {savedKey && (
          <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#166534", padding: 14, borderRadius: 12, marginBottom: 16, fontSize: 14 }}>
            ✅ تم الحفظ بنجاح!
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: "center", padding: 80, color: "#888", fontSize: 16 }}>⏳ جاري تحميل البيانات...</div>
        ) : (
          <div>
            {/* Save button */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
              <button onClick={handleSaveTab} disabled={saving} style={S.saveBtn(saving)}>
                {saving ? "⏳ جاري الحفظ..." : "💾 حفظ التعديلات"}
              </button>
            </div>

            {/* Tab Content */}
            <div style={{ background: "white", borderRadius: 14, padding: 24, border: "1px solid #e5e7eb", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
              {activeTab === "stats" && (
                <StatsEditor data={data.stats || []} onChange={v => updateTabData(v)} />
              )}
              {activeTab === "universities" && (
                <UniversitiesEditor data={data.universities || []} onChange={v => updateTabData(v)} />
              )}
              {activeTab === "hero" && (
                <HeroEditor data={data.hero || {}} onChange={v => updateTabData(v)} />
              )}
              {activeTab === "contact" && (
                <ContactEditor data={data.site || {}} onChange={v => updateTabData(v)} />
              )}
              {activeTab === "basicPackage" && (
                <PackageEditor data={data.basicPackage || {}} onChange={v => updateTabData(v)} title="الباقة الأساسية" />
              )}
              {activeTab === "additionalPackage" && (
                <PackageEditor data={data.additionalPackage || {}} onChange={v => updateTabData(v)} title="خدمة المرافقة" />
              )}
              {activeTab === "registration" && (
                <RegistrationEditor data={data.registration || {}} onChange={v => updateTabData(v)} />
              )}
              {activeTab === "faqs" && (
                <FaqsEditor data={data.faqs || []} onChange={v => updateTabData(v)} />
              )}
            </div>

            {/* Bottom Save */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
              <button onClick={handleSaveTab} disabled={saving} style={S.saveBtn(saving)}>
                {saving ? "⏳ جاري الحفظ..." : "💾 حفظ التعديلات"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
