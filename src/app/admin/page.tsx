"use client";

import { useState, useEffect, useCallback } from "react";

/* ═══════════════════════════════════════════════════
   Admin Panel - UniStation
   ═══════════════════════════════════════════════════ */

const PASSWORD = ""; // Will be set on login

type ConfigData = {
  stats?: any[];
  universities?: any[];
  basicPackage?: any;
  additionalPackage?: any;
  registration?: any;
  faqs?: any[];
};

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
  const [rawJson, setRawJson] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/config");
      const json = await res.json();
      setData(json);
      setRawJson(JSON.stringify(json, null, 2));
    } catch {
      setError("فشل تحميل البيانات");
    }
    setLoading(false);
  }, []);

  const handleLogin = () => {
    if (!password) return;
    setPassword(password);
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
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": password,
        },
        body: JSON.stringify({ key, value }),
      });
      if (!res.ok) {
        setError("فشل الحفظ - تأكد من صحة البيانات");
        return;
      }
      setSavedKey(key);
      setTimeout(() => setSavedKey(null), 2000);
      fetchData();
    } catch {
      setError("خطأ في الاتصال");
    }
    setSaving(false);
  };

  const saveRawJson = async () => {
    try {
      const parsed = JSON.parse(rawJson);
      for (const [key, value] of Object.entries(parsed)) {
        await saveKey(key, value);
      }
    } catch {
      setError("JSON غير صالح");
    }
  };

  const tabs = [
    { id: "stats", label: "الأرقام" },
    { id: "universities", label: "الجامعات" },
    { id: "basicPackage", label: "الباقة الأساسية" },
    { id: "additionalPackage", label: "خدمة المرافقة" },
    { id: "registration", label: "التسجيل" },
    { id: "faqs", label: "الأسئلة الشائعة" },
    { id: "raw", label: "JSON خام" },
  ];

  /* ─── Login Screen ─── */
  if (!loggedIn) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#28143c", fontFamily: "Cairo, sans-serif" }}>
        <div style={{ background: "white", borderRadius: 16, padding: "48px 40px", width: 380, textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔐</div>
          <h1 style={{ color: "#28143c", fontSize: 24, fontWeight: 700, marginBottom: 8 }}>UniStation Admin</h1>
          <p style={{ color: "#666", fontSize: 14, marginBottom: 24 }}>أدخل كلمة المرور للوصول</p>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
            placeholder="كلمة المرور"
            style={{ width: "100%", padding: "12px 16px", border: "2px solid #e5e7eb", borderRadius: 10, fontSize: 16, outline: "none", boxSizing: "border-box", marginBottom: 16 }}
          />
          {loginError && <p style={{ color: "#e11d48", fontSize: 13, marginBottom: 12 }}>{loginError}</p>}
          <button
            onClick={handleLogin}
            style={{ width: "100%", padding: 12, background: "#f0b414", color: "#28143c", border: "none", borderRadius: 10, fontSize: 16, fontWeight: 700, cursor: "pointer" }}
          >
            دخول
          </button>
        </div>
      </div>
    );
  }

  /* ─── Admin Dashboard ─── */
  return (
    <div style={{ minHeight: "100vh", background: "#f3f4f6", fontFamily: "Cairo, sans-serif" }}>
      {/* Header */}
      <div style={{ background: "#28143c", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 24 }}>⚙️</span>
          <h1 style={{ color: "white", fontSize: 20, fontWeight: 700, margin: 0 }}>UniStation Admin</h1>
        </div>
        <button onClick={fetchData} style={{ padding: "8px 16px", background: "#f0b414", color: "#28143c", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer" }}>
          🔄 تحديث
        </button>
      </div>

      {/* Tabs */}
      <div style={{ background: "white", borderBottom: "1px solid #e5e7eb", display: "flex", overflowX: "auto", padding: "0 16px" }}>
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{ padding: "12px 20px", border: "none", borderBottom: activeTab === t.id ? "3px solid #f0b414" : "3px solid transparent", background: "none", color: activeTab === t.id ? "#28143c" : "#666", fontWeight: activeTab === t.id ? 700 : 400, cursor: "pointer", whiteSpace: "nowrap", fontSize: 14 }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ maxWidth: 900, margin: "24px auto", padding: "0 16px" }}>
        {/* Status messages */}
        {error && (
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#991b1b", padding: 12, borderRadius: 10, marginBottom: 16, fontSize: 14 }}>
            ❌ {error}
            <button onClick={() => setError("")} style={{ float: "left", border: "none", background: "none", cursor: "pointer", fontSize: 16 }}>✕</button>
          </div>
        )}
        {savedKey && (
          <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#166534", padding: 12, borderRadius: 10, marginBottom: 16, fontSize: 14 }}>
            ✅ تم حفظ {savedKey} بنجاح
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: "center", padding: 60, color: "#666" }}>⏳ جاري التحميل...</div>
        ) : activeTab === "raw" ? (
          /* Raw JSON Editor */
          <div>
            <div style={{ background: "white", borderRadius: 12, padding: 20, border: "1px solid #e5e7eb" }}>
              <h3 style={{ margin: "0 0 12px 0", color: "#28143c" }}>تعديل JSON مباشر</h3>
              <textarea
                value={rawJson}
                onChange={e => setRawJson(e.target.value)}
                style={{ width: "100%", height: 500, fontFamily: "monospace", fontSize: 13, border: "1px solid #e5e7eb", borderRadius: 8, padding: 12, resize: "vertical", boxSizing: "border-box", direction: "ltr" }}
              />
              <button
                onClick={saveRawJson}
                disabled={saving}
                style={{ marginTop: 12, padding: "10px 24px", background: saving ? "#d1d5db" : "#f0b414", color: "#28143c", border: "none", borderRadius: 8, fontWeight: 700, cursor: saving ? "not-allowed" : "pointer", fontSize: 14 }}
              >
                {saving ? "⏳ جاري الحفظ..." : "💾 حفظ الكل"}
              </button>
            </div>
          </div>
        ) : (
          /* Form Editor */
          <div style={{ background: "white", borderRadius: 12, padding: 24, border: "1px solid #e5e7eb" }}>
            <FormEditor
              tab={activeTab}
              data={data}
              saving={saving}
              onSave={(key, value) => saveKey(key, value)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Form Editor Component ─── */
function FormEditor({ tab, data, saving, onSave }: {
  tab: string; data: ConfigData; saving: boolean;
  onSave: (key: string, value: any) => void;
}) {
  const key = tab;
  const value = data[key as keyof ConfigData];

  if (!value) return <p style={{ color: "#666" }}>لا توجد بيانات</p>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h3 style={{ margin: 0, color: "#28143c", fontSize: 18 }}>تعديل: {tab}</h3>
        <button
          onClick={() => onSave(key, value)}
          disabled={saving}
          style={{ padding: "8px 20px", background: saving ? "#d1d5db" : "#f0b414", color: "#28143c", border: "none", borderRadius: 8, fontWeight: 700, cursor: saving ? "not-allowed" : "pointer", fontSize: 13 }}
        >
          {saving ? "⏳..." : "💾 حفظ"}
        </button>
      </div>
      <textarea
        value={JSON.stringify(value, null, 2)}
        onChange={e => {
          try {
            const parsed = JSON.parse(e.target.value);
            onSave(key, parsed);
          } catch {
            // Don't save invalid JSON, just let user edit
          }
        }}
        style={{ width: "100%", height: 450, fontFamily: "monospace", fontSize: 13, border: "1px solid #e5e7eb", borderRadius: 8, padding: 12, resize: "vertical", boxSizing: "border-box", direction: "ltr" }}
      />
    </div>
  );
}
