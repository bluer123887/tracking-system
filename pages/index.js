import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function Search() {
  const [tracking, setTracking] = useState("");
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState("fr");
  const [error, setError] = useState("");

  const router = useRouter();

  // 自动识别语言
  useEffect(() => {
    const l = navigator.language.toLowerCase();
    if (l.includes("de")) setLang("de");
    else if (l.includes("en")) setLang("en");
    else setLang("fr");
  }, []);

  const text = {
    fr: {
      title: "Suivre une lettre ou un colis",
      desc: "Renseignez un ou plusieurs numéro(s) de suivi ou d'avis de passage",
      button: "Rechercher",
      help: "Aide",
      error: "Aucun résultat pour ce numéro de suivi.",
      empty: "Veuillez saisir un numéro de suivi.",
      server: "Erreur serveur. Veuillez réessayer plus tard.",
      loading: "Chargement..."
    },
    en: {
      title: "Track a letter or parcel",
      desc: "Enter one or more tracking numbers",
      button: "Search",
      help: "Help",
      error: "No result found for this tracking number.",
      empty: "Please enter a tracking number.",
      server: "Server error. Please try again later.",
      loading: "Loading..."
    },
    de: {
      title: "Sendung verfolgen",
      desc: "Sendungsnummer eingeben",
      button: "Suchen",
      help: "Hilfe",
      error: "Keine Sendung gefunden.",
      empty: "Bitte geben Sie eine Sendungsnummer ein.",
      server: "Serverfehler. Bitte versuchen Sie es später erneut.",
      loading: "Wird geladen..."
    }
  };

  const t = text[lang];

  // ✅ 升级后的核心逻辑：通过后台/API校验单号
  const handleSearch = async () => {
    const cleanTracking = tracking.trim();

    setError("");

    if (!cleanTracking) {
      setError(t.empty);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/tracking?code=${encodeURIComponent(cleanTracking)}`);

      setTimeout(() => {
        if (res.ok) {
          router.push(`/result?code=${encodeURIComponent(cleanTracking)}`);
        } else {
          setError(t.error);
        }

        setLoading(false);
      }, 800);
    } catch (e) {
      setError(t.server);
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: "Montserrat, Arial", background: "#f5f5f5" }}>

      {/* 顶部黄条 */}
      <div style={{ height: 5, background: "#ffcc00" }} />

      {/* Header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "10px 40px",
        background: "white"
      }}>
        <img src="/logo.png" style={{ height: 42 }} />

        <div style={{ display: "flex", gap: 20 }}>
          <div>Accès rapides</div>
          <div>Particulier ▼</div>
          <div>❓</div>
          <div>👤</div>
          <div>🛒</div>
        </div>
      </div>

      {/* 菜单 */}
      <div style={{
        display: "flex",
        gap: 30,
        padding: "12px 40px",
        background: "white"
      }}>
        {["Le courrier", "Le colis", "Le transfert de courrier", "Les services", "Tous nos produits"].map(i => (
          <div key={i}>{i} ▼</div>
        ))}
      </div>

      {/* 绿色广告 */}
      <div style={{ width: "100%", background: "#0f8f3a" }}>
        <div style={{
          maxWidth: 1200,
          margin: "0 auto",
          height: 70,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}>

          <div style={{
            marginLeft: 40,
            display: "flex",
            flexDirection: "column"
          }}>
            <span style={{ fontSize: 16, fontWeight: 800, color: "white" }}>
              LES JOURS
            </span>

            <span style={{
              background: "white",
              color: "#0f8f3a",
              padding: "3px 8px",
              fontWeight: 800,
              marginTop: 4
            }}>
              DÉMÉNAGEMENT
            </span>
          </div>

          <div style={{
            fontSize: 20,
            fontWeight: 800,
            color: "white"
          }}>
            DÉCOUVREZ TOUTES NOS OFFRES QUI DÉMÉNAGENT
          </div>

          <div style={{
            marginRight: 40,
            background: "white",
            color: "#0f8f3a",
            padding: "8px 18px",
            borderRadius: 22,
            fontWeight: 600
          }}>
            J'en profite →
          </div>

        </div>
      </div>

      {/* 主体 */}
      <div style={{
        maxWidth: 900,
        margin: "70px auto 0"
      }}>

        {/* 标题 */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 12,
          fontSize: 34,
          fontWeight: 600,
          color: "#333"
        }}>
          <img src="/track-icon.png" style={{ width: 34 }} />
          {t.title}
        </div>

        {/* 查询卡 */}
        <div style={{
          background: "white",
          marginTop: 30,
          padding: 30,
          borderRadius: 12,
          borderTop: "4px solid #ffcc00"
        }}>

          <div style={{ textAlign: "center", marginBottom: 20 }}>
            {t.desc}
          </div>

          <div style={{
            display: "flex",
            border: error ? "2px solid #d93025" : "2px solid #d0d5dd",
            borderRadius: 12,
            overflow: "hidden"
          }}>
            <input
              value={tracking}
              onChange={(e) => {
                setTracking(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
              style={{
                flex: 1,
                padding: 15,
                border: "none",
                outline: "none"
              }}
            />

            <button
              onClick={handleSearch}
              disabled={loading}
              style={{
                background: "#0b3d91",
                color: "white",
                padding: "0 26px",
                display: "flex",
                alignItems: "center",
                gap: 10,
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.75 : 1
              }}
            >
              {t.button}
              <img src="/search.png" style={{ width: 16 }} />
            </button>
          </div>

          {/* 加载 */}
          {loading && (
            <div style={{ textAlign: "center", marginTop: 15 }}>
              {t.loading}
            </div>
          )}

          {/* 错误提示 */}
          {error && (
            <div style={{
              color: "#d93025",
              marginTop: 15,
              textAlign: "center",
              fontSize: 14
            }}>
              {error}
            </div>
          )}

          {/* 类型区域 */}
          <div style={{
            marginTop: 25,
            background: "#f0f2f5",
            padding: 20,
            borderRadius: 10,
            textAlign: "center"
          }}>
            <div style={{
              marginBottom: 12,
              fontSize: 14,
              color: "#555"
            }}>
              Several types of tracking are taken into account
            </div>

            <div style={{
              display: "flex",
              justifyContent: "center",
              gap: 40,
              alignItems: "center"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <img src="/colissimo.png" style={{ height: 20 }} />
                colissimo
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <img src="/chronopost.png" style={{ height: 20 }} />
                chronopost
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <img src="/courrier.png" style={{ height: 20 }} />
                courrier
              </div>
            </div>

            <div style={{
              marginTop: 15,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 6
            }}>
              <img src="/robot.png" style={{ width: 20 }} />
              {t.help}
            </div>
          </div>

        </div>

        {/* 语言切换 */}
        <div style={{
          marginTop: 40,
          textAlign: "center"
        }}>
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            style={{
              padding: 10,
              borderRadius: 20,
              border: "1px solid #ccc"
            }}
          >
            <option value="fr">Français</option>
            <option value="en">English</option>
            <option value="de">Deutsch</option>
          </select>
        </div>

      </div>
    </div>
  );
}
