"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";

/* ═══════════════════════════════════════════════════
   Admin Panel - UniStation (Easy Forms)
   ═══════════════════════════════════════════════════ */

type ConfigData = Record<string, any>;

/* ─── Session Management (7-day persist) ─── */
const SESSION_KEY = "unistation_admin_session";
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

function saveSession(password: string) {
  const session = { pw: password, ts: Date.now() };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

function loadSession(): string | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    if (Date.now() - session.ts > SESSION_DURATION) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return session.pw;
  } catch {
    return null;
  }
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

/* ─── Responsive Hook ─── */
function useIsMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const fn = () => setMobile(window.innerWidth < 640);
    fn();
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return mobile;
}

/* ─── Confirmation Dialog ─── */
function ConfirmDialog({ message, onConfirm, onCancel }: {
  message: string; onConfirm: () => void; onCancel: () => void;
}) {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "rgba(0,0,0,0.5)", display: "flex",
      alignItems: "center", justifyContent: "center", padding: 20,
      fontFamily: "Cairo, sans-serif", direction: "rtl",
    }}>
      <div style={{
        background: "#fff", borderRadius: 16, padding: 28,
        maxWidth: 400, width: "100%", boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
        animation: "fadeIn 0.15s ease-out",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <div style={{
            width: 44, height: 44, borderRadius: "50%",
            background: "#fef2f2", display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: 22, flexShrink: 0,
          }}>⚠️</div>
          <h3 style={{ margin: 0, color: "#28143c", fontSize: 17, fontWeight: 700 }}>تأكيد الحذف</h3>
        </div>
        <p style={{ color: "#555", fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>{message}</p>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-start" }}>
          <button onClick={onConfirm} style={{
            padding: "10px 22px", background: "#dc2626", color: "white",
            border: "none", borderRadius: 10, fontWeight: 700,
            cursor: "pointer", fontSize: 14, fontFamily: "Cairo, sans-serif",
          }}>نعم، احذف</button>
          <button onClick={onCancel} style={{
            padding: "10px 22px", background: "#f3f4f6", color: "#374151",
            border: "1px solid #e5e7eb", borderRadius: 10, fontWeight: 600,
            cursor: "pointer", fontSize: 14, fontFamily: "Cairo, sans-serif",
          }}>إلغاء</button>
        </div>
      </div>
    </div>
  );
}

/* ─── CSS Animation ─── */
const CSS_ANIM = `
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
@keyframes slideUp {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes toastIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
.admin-tab-scroll::-webkit-scrollbar { height: 3px; }
.admin-tab-scroll::-webkit-scrollbar-thumb { background: #f0b414; border-radius: 10px; }
@media (max-width: 640px) {
  .admin-grid-2, .admin-grid-3, .admin-grid-4 { grid-template-columns: 1fr !important; }
}
`;

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
  saveBtn: (saving: boolean) => ({
    padding: "10px 24px", background: saving ? "#d1d5db" : "#f0b414", color: "#28143c",
    border: "none", borderRadius: 10, fontWeight: 700, cursor: saving ? "not-allowed" : "pointer",
    fontSize: 14, fontFamily: "Cairo, sans-serif",
  }),
  deleteBtn: {
    padding: "6px 12px", background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca",
    borderRadius: 8, fontSize: 12, cursor: "pointer", fontWeight: 600, fontFamily: "Cairo, sans-serif",
    whiteSpace: "nowrap" as const,
  },
  addBtn: {
    padding: "10px 20px", background: "#eff6ff", color: "#2563eb", border: "2px dashed #bfdbfe",
    borderRadius: 10, fontSize: 14, cursor: "pointer", fontWeight: 600, fontFamily: "Cairo, sans-serif",
    width: "100%", textAlign: "center" as const,
  },
  undoBtn: {
    padding: "8px 16px", background: "#fef3c7", color: "#92400e", border: "1px solid #fde68a",
    borderRadius: 10, fontWeight: 600, cursor: "pointer", fontSize: 13, fontFamily: "Cairo, sans-serif",
    display: "flex", alignItems: "center", gap: 6,
  },
};

/* ─── Delete Context — lets any child ask for confirmation ─── */
export const DeleteContext = React.createContext({
  confirm: (_msg: string) => new Promise<boolean>(() => false),
});

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

/* ─── Helper: responsive grid class ─── */
function Grid2({ children }: { children: React.ReactNode }) {
  return <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }} className="admin-grid-2">{children}</div>;
}
function Grid3({ children }: { children: React.ReactNode }) {
  return <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }} className="admin-grid-3">{children}</div>;
}
function Grid4({ children }: { children: React.ReactNode }) {
  return <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12 }} className="admin-grid-4">{children}</div>;
}

function EditableList({ items, onChange, label, addLabel }: {
  items: string[]; onChange: (items: string[]) => void; label: string; addLabel: string;
}) {
  const { confirm } = React.useContext(DeleteContext);
  const update = (i: number, v: string) => { const next = [...items]; next[i] = v; onChange(next); };
  const remove = async (i: number) => {
    const ok = await confirm(`هل أنت متأكد من حذف "${items[i] || "هذا العنصر"}"؟`);
    if (ok) onChange(items.filter((_, idx) => idx !== i));
  };
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
  const { confirm } = React.useContext(DeleteContext);
  const remove = async (i: number) => {
    const ok = await confirm(`هل تريد حذف الرقم "${data[i]?.label || data[i]?.target || ""}"؟ لا يمكن التراجع بعد الحذف.`);
    if (ok) onChange(data.filter((_, idx) => idx !== i));
  };
  const update = (i: number, field: string, value: any) => {
    const next = [...data]; next[i] = { ...next[i], [field]: value }; onChange(next);
  };
  return <div>
    {data.map((stat, i) => (
      <div key={i} style={S.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <span style={{ fontWeight: 700, color: "#28143c" }}>الرقم {i + 1}</span>
          <button onClick={() => remove(i)} style={S.deleteBtn}>حذف</button>
        </div>
        <Grid4>
          <Field label="القيمة"><NumberInput value={stat.target || 0} onChange={v => update(i, "target", v)} step={0.1} /></Field>
          <Field label="قبل الرقم"><TextInput value={stat.prefix || ""} onChange={v => update(i, "prefix", v)} placeholder="مثل +" /></Field>
          <Field label="بعد الرقم"><TextInput value={stat.suffix || ""} onChange={v => update(i, "suffix", v)} placeholder="مثل %" /></Field>
          <Field label="العنوان"><TextInput value={stat.label || ""} onChange={v => update(i, "label", v)} placeholder="جامعات معتمدة" /></Field>
        </Grid4>
      </div>
    ))}
    <button onClick={() => onChange([...data, { target: 0, prefix: "", suffix: "", label: "" }])} style={S.addBtn}>
      + إضافة رقم جديد
    </button>
  </div>;
}

function UniversitiesEditor({ data, onChange }: { data: any[]; onChange: (d: any[]) => void }) {
  const { confirm } = React.useContext(DeleteContext);
  const removeUni = async (i: number) => {
    const ok = await confirm(`هل تريد حذف جامعة "${data[i]?.nameAr || data[i]?.name || ""}"؟\nجميع بياناتها ستُحذف نهائياً.`);
    if (ok) onChange(data.filter((_, idx) => idx !== i));
  };
  const update = (i: number, field: string, value: any) => {
    const next = [...data]; next[i] = { ...next[i], [field]: value }; onChange(next);
  };
  const updateFeature = (i: number, fi: number, v: string) => {
    const next = [...data]; const features = [...next[i].features];
    features[fi] = v; next[i] = { ...next[i], features }; onChange(next);
  };
  const removeFeature = async (i: number, fi: number) => {
    const ok = await confirm(`حذف ميزة "${data[i]?.features?.[fi] || ""}"؟`);
    if (ok) {
      const next = [...data];
      next[i] = { ...next[i], features: next[i].features.filter((_: any, idx: number) => idx !== fi) };
      onChange(next);
    }
  };
  const addFeature = (i: number) => {
    const next = [...data]; next[i] = { ...next[i], features: [...(next[i].features || []), ""] }; onChange(next);
  };
  return <div>
    {data.map((uni, i) => (
      <div key={i} style={{ ...S.card, borderRight: uni.highlight ? "4px solid #f0b414" : "1px solid #e5e7eb" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <span style={{ fontWeight: 700, color: "#28143c", fontSize: 15 }}>
            #{uni.rank || i + 1} — {uni.nameAr || uni.name}
          </span>
          <button onClick={() => removeUni(i)} style={S.deleteBtn}>حذف</button>
        </div>
        <Grid3>
          <Field label="الاسم بالإنجليزي"><TextInput value={uni.name || ""} onChange={v => update(i, "name", v)} dir="ltr" placeholder="University Name" /></Field>
          <Field label="الاسم بالعربي"><TextInput value={uni.nameAr || ""} onChange={v => update(i, "nameAr", v)} placeholder="اسم الجامعة" /></Field>
          <Field label="الاختصار"><TextInput value={uni.abbr || ""} onChange={v => update(i, "abbr", v)} dir="ltr" placeholder="TSMU" /></Field>
        </Grid3>
        <Grid3>
          <Field label="الرسوم"><TextInput value={uni.fee || ""} onChange={v => update(i, "fee", v)} dir="ltr" placeholder="$8,000" /></Field>
          <Field label="النوع"><TextInput value={uni.type || ""} onChange={v => update(i, "type", v)} placeholder="حكومية / خاصة" /></Field>
          <Field label="الترتيب"><NumberInput value={uni.rank || i + 1} onChange={v => update(i, "rank", v)} /></Field>
        </Grid3>
        <Field label="الوصف"><TextArea value={uni.desc || ""} onChange={v => update(i, "desc", v)} rows={2} placeholder="وصف الجامعة..." /></Field>
        <Checkbox checked={!!uni.highlight} onChange={v => update(i, "highlight", v)} label="تمييز الجامعة (إظهارها بشكل مميز)" />
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

function PackageEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  const { confirm } = React.useContext(DeleteContext);
  const update = (field: string, value: any) => onChange({ ...data, [field]: value });

  const updateInstallment = (i: number, field: string, v: string) => {
    const next = [...(data.installments || [])]; next[i] = { ...next[i], [field]: v }; update("installments", next);
  };
  const removeInstallment = async (i: number) => {
    const ok = await confirm(`هل تريد حذف "${data.installments?.[i]?.label || "الدفعة " + (i + 1)}"؟`);
    if (ok) update("installments", (data.installments || []).filter((_: any, idx: number) => idx !== i));
  };
  const addInstallment = () => update("installments", [...(data.installments || []), { label: "", amount: "", note: "" }]);

  return <div>
    <Grid2>
      <Field label="العنوان"><TextInput value={data.title || ""} onChange={v => update("title", v)} /></Field>
      <Field label="شارة التميز"><TextInput value={data.badge || ""} onChange={v => update("badge", v)} placeholder="أفضل قيمة" /></Field>
    </Grid2>
    <Field label="الوصف"><TextArea value={data.description || ""} onChange={v => update("description", v)} rows={2} /></Field>
    {data.totalPrice !== undefined && (
      <Grid2>
        <Field label="السعر الإجمالي"><TextInput value={data.totalPrice || ""} onChange={v => update("totalPrice", v)} dir="ltr" placeholder="5,800" /></Field>
        <Field label="العملة"><TextInput value={data.currency || ""} onChange={v => update("currency", v)} placeholder="درهم" /></Field>
      </Grid2>
    )}
    {data.priceNote !== undefined && (
      <Field label="ملاحظة السعر"><TextInput value={data.priceNote || ""} onChange={v => update("priceNote", v)} /></Field>
    )}
    {data.installments && (
      <div style={{ marginTop: 12 }}>
        <label style={{ ...S.label, fontSize: 15, color: "#28143c" }}>الدفعات</label>
        {(data.installments || []).map((inst: any, i: number) => (
          <div key={i} style={S.card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontWeight: 600, color: "#28143c" }}>الدفعة {i + 1}</span>
              <button onClick={() => removeInstallment(i)} style={S.deleteBtn}>حذف</button>
            </div>
            <Grid2>
              <Field label="اسم الدفعة"><TextInput value={inst.label || ""} onChange={v => updateInstallment(i, "label", v)} /></Field>
              <Field label="المبلغ"><TextInput value={inst.amount || ""} onChange={v => updateInstallment(i, "amount", v)} dir="ltr" /></Field>
            </Grid2>
            <Field label="ملاحظة"><TextInput value={inst.note || ""} onChange={v => updateInstallment(i, "note", v)} /></Field>
          </div>
        ))}
        <button onClick={addInstallment} style={{ ...S.addBtn, marginTop: 8 }}>+ إضافة دفعة</button>
      </div>
    )}
    {data.note !== undefined && (
      <Field label="ملاحظة"><TextArea value={data.note || ""} onChange={v => update("note", v)} rows={2} /></Field>
    )}
    <EditableList items={data.services || []} onChange={v => update("services", v)} label="الخدمات" addLabel="إضافة خدمة" />
  </div>;
}

function RegistrationEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  const { confirm } = React.useContext(DeleteContext);
  const update = (field: string, value: any) => onChange({ ...data, [field]: value });

  const updateDoc = (i: number, field: string, v: string) => {
    const next = [...(data.docs || [])]; next[i] = { ...next[i], [field]: v }; update("docs", next);
  };
  const removeDoc = async (i: number) => {
    const ok = await confirm(`هل تريد حذف المستند "${data.docs?.[i]?.title || "المستند " + (i + 1)}"؟`);
    if (ok) update("docs", (data.docs || []).filter((_: any, idx: number) => idx !== i));
  };
  const addDoc = () => update("docs", [...(data.docs || []), { title: "", desc: "" }]);

  return <div>
    <Field label="العنوان"><TextInput value={data.title || ""} onChange={v => update("title", v)} /></Field>
    <Field label="الوصف"><TextArea value={data.description || ""} onChange={v => update("description", v)} rows={2} /></Field>
    <label style={{ ...S.label, fontSize: 15, color: "#28143c", marginTop: 12 }}>المستندات المطلوبة</label>
    {(data.docs || []).map((doc: any, i: number) => (
      <div key={i} style={S.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <span style={{ fontWeight: 600, color: "#28143c" }}>المستند {i + 1}</span>
          <button onClick={() => removeDoc(i)} style={S.deleteBtn}>حذف</button>
        </div>
        <Grid2>
          <Field label="اسم المستند"><TextInput value={doc.title || ""} onChange={v => updateDoc(i, "title", v)} /></Field>
          <Field label="الوصف"><TextInput value={doc.desc || ""} onChange={v => updateDoc(i, "desc", v)} /></Field>
        </Grid2>
      </div>
    ))}
    <button onClick={addDoc} style={S.addBtn}>+ إضافة مستند</button>
  </div>;
}

function FaqsEditor({ data, onChange }: { data: any[]; onChange: (d: any[]) => void }) {
  const { confirm } = React.useContext(DeleteContext);
  const updateQ = (i: number, v: string) => { const next = [...data]; next[i] = { ...next[i], q: v }; onChange(next); };
  const updateA = (i: number, v: string) => { const next = [...data]; next[i] = { ...next[i], a: v }; onChange(next); };
  const remove = async (i: number) => {
    const ok = await confirm(`هل تريد حذف السؤال "${data[i]?.q || "السؤال " + (i + 1)}"؟`);
    if (ok) onChange(data.filter((_, idx) => idx !== i));
  };
  const add = () => onChange([...data, { q: "", a: "" }]);
  return <div>
    {data.map((faq, i) => (
      <div key={i} style={S.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <span style={{ fontWeight: 700, color: "#f0b414", fontSize: 14 }}>السؤال {i + 1}</span>
          <button onClick={() => remove(i)} style={S.deleteBtn}>حذف</button>
        </div>
        <Field label="السؤال"><TextInput value={faq.q || ""} onChange={v => updateQ(i, v)} placeholder="اكتب السؤال هنا..." /></Field>
        <Field label="الإجابة"><TextArea value={faq.a || ""} onChange={v => updateA(i, v)} rows={3} placeholder="اكتب الإجابة هنا..." /></Field>
      </div>
    ))}
    <button onClick={add} style={S.addBtn}>+ إضافة سؤال جديد</button>
  </div>;
}

function HeroEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  const update = (field: string, value: any) => onChange({ ...data, [field]: value });
  return <div>
    <Grid2>
      <Field label="الشارة (Badge)"><TextInput value={data.badge || ""} onChange={v => update("badge", v)} /></Field>
      <Field label="السطر الأول من العنوان"><TextInput value={data.title1 || ""} onChange={v => update("title1", v)} /></Field>
    </Grid2>
    <Field label="السطر الثاني من العنوان (الكلمة المميزة)"><TextInput value={data.title2 || ""} onChange={v => update("title2", v)} /></Field>
    <Field label="الوصف"><TextArea value={data.description || ""} onChange={v => update("description", v)} rows={3} /></Field>
    <Grid2>
      <Field label="نص الزر الأساسي"><TextInput value={data.ctaPrimary || ""} onChange={v => update("ctaPrimary", v)} /></Field>
      <Field label="نص الزر الثانوي"><TextInput value={data.ctaSecondary || ""} onChange={v => update("ctaSecondary", v)} /></Field>
    </Grid2>
  </div>;
}

function ContactEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  const update = (field: string, value: any) => onChange({ ...data, [field]: value });
  return <div>
    <Grid2>
      <Field label="رقم الواتساب"><TextInput value={data.whatsapp || ""} onChange={v => update("whatsapp", v)} dir="ltr" placeholder="+971..." /></Field>
      <Field label="رابط الواتساب"><TextInput value={data.whatsappLink || ""} onChange={v => update("whatsappLink", v)} dir="ltr" /></Field>
    </Grid2>
    <Grid2>
      <Field label="البريد الإلكتروني"><TextInput value={data.email || ""} onChange={v => update("email", v)} dir="ltr" placeholder="info@unistation.org" /></Field>
      <Field label="رقم الهاتف"><TextInput value={data.phone || ""} onChange={v => update("phone", v)} dir="ltr" placeholder="+971 52..." /></Field>
    </Grid2>
    <Field label="رابط الانستجرام"><TextInput value={data.social?.instagram || ""} onChange={v => update("social", { ...data.social, instagram: v })} dir="ltr" /></Field>
  </div>;
}

/* ═══════════════════════════════════════════════════
   Main Admin Page
   ═══════════════════════════════════════════════════ */

export default function AdminPage() {
  const isMobile = useIsMobile();
  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [data, setData] = useState<ConfigData>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedKey, setSavedKey] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("stats");

  /* ─── Undo / Snapshot ─── */
  const snapshotsRef = useRef<Record<string, any>>({});
  const [hasUndo, setHasUndo] = useState(false);

  const saveSnapshot = useCallback(() => {
    const tabMap: Record<string, string> = {
      stats: "stats", universities: "universities", basicPackage: "basicPackage",
      additionalPackage: "additionalPackage", registration: "registration",
      faqs: "faqs", hero: "hero", contact: "site",
    };
    const key = tabMap[activeTab];
    if (key && data[key]) {
      snapshotsRef.current[key] = JSON.parse(JSON.stringify(data[key]));
      setHasUndo(true);
    }
  }, [activeTab, data]);

  const handleUndo = () => {
    const tabMap: Record<string, string> = {
      stats: "stats", universities: "universities", basicPackage: "basicPackage",
      additionalPackage: "additionalPackage", registration: "registration",
      faqs: "faqs", hero: "hero", contact: "site",
    };
    const key = tabMap[activeTab];
    if (key && snapshotsRef.current[key]) {
      setData(prev => ({ ...prev, [key]: snapshotsRef.current[key] }));
      setHasUndo(false);
    }
  };

  /* ─── Confirmation Dialog State ─── */
  const [confirmState, setConfirmState] = useState<{
    message: string; resolve: (v: boolean) => void;
  } | null>(null);

  const confirmDelete = useCallback((msg: string): Promise<boolean> => {
    return new Promise(resolve => {
      setConfirmState({ message: msg, resolve });
    });
  }, []);

  const handleConfirm = () => {
    if (confirmState) confirmState.resolve(true);
    setConfirmState(null);
  };
  const handleCancelConfirm = () => {
    if (confirmState) confirmState.resolve(false);
    setConfirmState(null);
  };

  /* ─── Data Fetching ─── */
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("api/config");
      const json = await res.json();
      setData(json);
    } catch { setError("فشل تحميل البيانات"); }
    setLoading(false);
  }, []);

  /* ─── Session: check on mount ─── */
  useEffect(() => {
    const saved = loadSession();
    if (saved) {
      setPassword(saved);
      setLoggedIn(true);
    }
  }, []);

  /* ─── After login, fetch data ─── */
  useEffect(() => {
    if (loggedIn) fetchData();
  }, [loggedIn, fetchData]);

  /* ─── Save snapshot when tab changes ─── */
  useEffect(() => {
    if (loggedIn && data && Object.keys(data).length > 0) saveSnapshot();
  }, [activeTab]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ─── Login Handler ─── */
  const handleLogin = async () => {
    if (!password) return;
    try {
      const res = await fetch("api/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json", "x-admin-password": password },
        body: JSON.stringify({ key: "_ping", value: true }),
      });
      if (res.status === 401) { setLoginError("كلمة المرور غير صحيحة"); return; }
    } catch { /* allow local dev */ }
    setLoginError("");
    saveSession(password);
    setLoggedIn(true);
  };

  const handleLogout = () => {
    clearSession();
    setLoggedIn(false);
    setPassword("");
    setData({});
  };

  const saveKey = async (key: string, value: any) => {
    setSaving(true); setSavedKey(null); setError("");
    try {
      const res = await fetch("api/config", {
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
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#28143c", fontFamily: "Cairo, sans-serif", direction: "rtl", padding: 20 }}>
        <div style={{ background: "white", borderRadius: 20, padding: "40px 32px", width: "100%", maxWidth: 400, textAlign: "center", boxShadow: "0 25px 50px rgba(0,0,0,0.3)" }}>
          <div style={{ width: 70, height: 70, background: "linear-gradient(135deg, #28143c, #3d1f5e)", borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 32 }}>⚙️</div>
          <h1 style={{ color: "#28143c", fontSize: 24, fontWeight: 800, marginBottom: 6 }}>UniStation Admin</h1>
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
    <DeleteContext.Provider value={{ confirm: confirmDelete }}>
      <style dangerouslySetInnerHTML={{ __html: CSS_ANIM }} />

      {/* Confirmation Dialog */}
      {confirmState && (
        <ConfirmDialog message={confirmState.message} onConfirm={handleConfirm} onCancel={handleCancelConfirm} />
      )}

      <div style={{ minHeight: "100vh", background: "#f8f9fa", fontFamily: "Cairo, sans-serif", direction: "rtl" }}>
        {/* Header */}
        <div style={{
          background: "linear-gradient(135deg, #28143c, #3d1f5e)",
          padding: isMobile ? "12px 16px" : "14px 24px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: 8,
          boxShadow: "0 4px 15px rgba(40,20,60,0.3)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
            <div style={{ width: 34, height: 34, background: "rgba(255,255,255,0.15)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, flexShrink: 0 }}>⚙️</div>
            <h1 style={{ color: "white", fontSize: isMobile ? 15 : 18, fontWeight: 700, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              لوحة التحكم
            </h1>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button onClick={fetchData} disabled={loading}
              style={{ padding: "7px 14px", background: "rgba(255,255,255,0.15)", color: "white", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 8, fontWeight: 600, cursor: "pointer", fontSize: 12, fontFamily: "Cairo, sans-serif" }}>
              {loading ? "⏳" : "🔄"}
              {!isMobile && " تحديث"}
            </button>
            <button onClick={handleLogout}
              style={{ padding: "7px 14px", background: "rgba(255,255,255,0.1)", color: "#fca5a5", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, fontWeight: 600, cursor: "pointer", fontSize: 12, fontFamily: "Cairo, sans-serif" }}>
              🚪 {!isMobile && "خروج"}
            </button>
            <a href="/landing-page"
              style={{ padding: "7px 14px", background: "#f0b414", color: "#28143c", border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer", fontSize: 12, textDecoration: "none", fontFamily: "Cairo, sans-serif" }}>
              👁️ {!isMobile && "عرض الموقع"}
            </a>
          </div>
        </div>

        {/* Tabs */}
        <div className="admin-tab-scroll" style={{ background: "white", borderBottom: "1px solid #e5e7eb", display: "flex", overflowX: "auto", padding: "0 12px" }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              style={{
                padding: isMobile ? "10px 14px" : "12px 18px", border: "none",
                borderBottom: activeTab === t.id ? "3px solid #f0b414" : "3px solid transparent",
                background: activeTab === t.id ? "#fffbeb" : "none",
                color: activeTab === t.id ? "#28143c" : "#888",
                fontWeight: activeTab === t.id ? 700 : 500,
                cursor: "pointer", whiteSpace: "nowrap",
                fontSize: isMobile ? 12 : 13,
                fontFamily: "Cairo, sans-serif", transition: "all 0.2s",
              }}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ maxWidth: 950, margin: isMobile ? "16px auto" : "24px auto", padding: "0 12px" }}>
          {/* Status messages */}
          {error && (
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#991b1b", padding: isMobile ? 12 : 14, borderRadius: 12, marginBottom: 16, fontSize: 14, display: "flex", justifyContent: "space-between", alignItems: "center", animation: "toastIn 0.2s ease-out" }}>
              <span>❌ {error}</span>
              <button onClick={() => setError("")} style={{ border: "none", background: "none", cursor: "pointer", fontSize: 18, color: "#991b1b", padding: 4 }}>✕</button>
            </div>
          )}
          {savedKey && (
            <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#166534", padding: isMobile ? 12 : 14, borderRadius: 12, marginBottom: 16, fontSize: 14, animation: "toastIn 0.2s ease-out" }}>
              ✅ تم الحفظ بنجاح!
            </div>
          )}

          {loading ? (
            <div style={{ textAlign: "center", padding: 80, color: "#888", fontSize: 16 }}>⏳ جاري تحميل البيانات...</div>
          ) : (
            <div>
              {/* Action buttons row */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
                {hasUndo && (
                  <button onClick={handleUndo} style={S.undoBtn}>
                    ↩️ تراجع عن التعديلات
                  </button>
                )}
                {!hasUndo && <div />}
                <button onClick={handleSaveTab} disabled={saving} style={S.saveBtn(saving)}>
                  {saving ? "⏳ جاري الحفظ..." : "💾 حفظ التعديلات"}
                </button>
              </div>

              {/* Tab Content */}
              <div style={{ background: "white", borderRadius: 14, padding: isMobile ? 16 : 24, border: "1px solid #e5e7eb", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", animation: "slideUp 0.2s ease-out" }}>
                {activeTab === "stats" && <StatsEditor data={data.stats || []} onChange={v => updateTabData(v)} />}
                {activeTab === "universities" && <UniversitiesEditor data={data.universities || []} onChange={v => updateTabData(v)} />}
                {activeTab === "hero" && <HeroEditor data={data.hero || {}} onChange={v => updateTabData(v)} />}
                {activeTab === "contact" && <ContactEditor data={data.site || {}} onChange={v => updateTabData(v)} />}
                {activeTab === "basicPackage" && <PackageEditor data={data.basicPackage || {}} onChange={v => updateTabData(v)} />}
                {activeTab === "additionalPackage" && <PackageEditor data={data.additionalPackage || {}} onChange={v => updateTabData(v)} />}
                {activeTab === "registration" && <RegistrationEditor data={data.registration || {}} onChange={v => updateTabData(v)} />}
                {activeTab === "faqs" && <FaqsEditor data={data.faqs || []} onChange={v => updateTabData(v)} />}
              </div>

              {/* Bottom Save */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16, flexWrap: "wrap", gap: 8 }}>
                {hasUndo && (
                  <button onClick={handleUndo} style={S.undoBtn}>
                    ↩️ تراجع عن التعديلات
                  </button>
                )}
                {!hasUndo && <div />}
                <button onClick={handleSaveTab} disabled={saving} style={S.saveBtn(saving)}>
                  {saving ? "⏳ جاري الحفظ..." : "💾 حفظ التعديلات"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DeleteContext.Provider>
  );
}


