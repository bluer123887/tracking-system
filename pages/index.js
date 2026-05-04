import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function Search() {
  const [tracking, setTracking] = useState("");
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState("fr");
  const [error, setError] = useState("");

  const router = useRouter();

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
    <>
      <div className="page">

        <div className="top-yellow" />

        {/* Header */}
        <header className="header">
          <div className="logo-wrap">
            <img src="/logo.png" className="logo" />
          </div>

          <div className="header-actions">
            <div>Accès rapides</div>
            <div>Particulier ▼</div>
            <div>?</div>
            <div>👤</div>
            <div>🛒</div>
          </div>
        </header>

        {/* 菜单 */}
        <nav className="menu">
          {["Le courrier", "Le colis", "Le transfert de courrier", "Les services", "Tous nos produits"].map(i => (
            <div key={i} className="menu-item">
              {i} ▼
            </div>
          ))}
        </nav>

        {/* 绿色广告 */}
        <section className="green-ad">
          <div className="green-inner">
            <div className="ad-left">
              <span className="ad-small">LES JOURS</span>
              <span className="ad-box">DÉMÉNAGEMENT</span>
            </div>

            <div className="ad-center">
              DÉCOUVREZ TOUTES NOS OFFRES QUI DÉMÉNAGENT
            </div>

            <div className="ad-button">
              J&apos;en profite →
            </div>
          </div>
        </section>

        {/* 主体 */}
        <main className="main">

          {/* 标题 */}
          <div className="title">
            <img src="/track-icon.png" className="title-icon" />
            <span>{t.title}</span>
          </div>

          {/* 查询卡 */}
          <section className="search-card">

            <div className="desc">
              {t.desc}
            </div>

            <div className={error ? "search-box error-border" : "search-box"}>
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
                className="input"
              />

              <button
                onClick={handleSearch}
                disabled={loading}
                className="search-button"
              >
                <span>{t.button}</span>
                <img src="/search.png" className="search-icon" />
              </button>
            </div>

            {loading && (
              <div className="loading">
                {t.loading}
              </div>
            )}

            {error && (
              <div className="error-text">
                {error}
              </div>
            )}

            {/* 类型区域 */}
            <div className="type-area">
              <div className="type-title">
                Several types of tracking are taken into account
              </div>

              <div className="type-list">
                <div className="type-item">
                  <img src="/colissimo.png" />
                  <span>colissimo</span>
                </div>

                <div className="type-item">
                  <img src="/chronopost.png" />
                  <span>chronopost</span>
                </div>

                <div className="type-item">
                  <img src="/courrier.png" />
                  <span>courrier</span>
                </div>
              </div>

              <div className="help">
                <img src="/robot.png" />
                <span>{t.help}</span>
              </div>
            </div>

          </section>

          {/* 语言切换 */}
          <div className="language">
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
            >
              <option value="fr">Français</option>
              <option value="en">English</option>
              <option value="de">Deutsch</option>
            </select>
          </div>

        </main>
      </div>

      <style jsx>{`
        .page {
          min-height: 100vh;
          background: #f5f5f5;
          font-family: Montserrat, Arial, Helvetica, sans-serif;
          overflow-x: hidden;
        }

        .top-yellow {
          height: 5px;
          background: #ffcc00;
        }

        .header {
          background: white;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 42px;
          box-sizing: border-box;
          border-bottom: 1px solid #eee;
        }

        .logo-wrap {
          display: flex;
          align-items: center;
          min-width: 160px;
        }

        .logo {
          height: 42px;
          object-fit: contain;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 24px;
          font-size: 15px;
          font-weight: 600;
          white-space: nowrap;
        }

        .menu {
          background: white;
          display: flex;
          align-items: center;
          gap: 36px;
          padding: 14px 42px;
          box-sizing: border-box;
          font-size: 16px;
          font-weight: 500;
          border-bottom: 1px solid #eee;
        }

        .menu-item {
          white-space: nowrap;
        }

        .green-ad {
          width: 100%;
          background: #0f8f3a;
        }

        .green-inner {
          max-width: 1200px;
          margin: 0 auto;
          height: 76px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 42px;
          box-sizing: border-box;
        }

        .ad-left {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          min-width: 220px;
        }

        .ad-small {
          color: white;
          font-size: 18px;
          line-height: 1.1;
          font-weight: 900;
          letter-spacing: 0.3px;
        }

        .ad-box {
          margin-top: 5px;
          background: white;
          color: #0f8f3a;
          font-size: 18px;
          line-height: 1.1;
          font-weight: 900;
          padding: 4px 10px;
          letter-spacing: 0.2px;
        }

        .ad-center {
          flex: 1;
          text-align: center;
          color: white;
          font-size: 22px;
          font-weight: 900;
          letter-spacing: 0.4px;
          line-height: 1.15;
        }

        .ad-button {
          background: white;
          color: #0f8f3a;
          border-radius: 24px;
          padding: 9px 22px;
          font-weight: 800;
          font-size: 15px;
          white-space: nowrap;
          margin-left: 30px;
        }

        .main {
          max-width: 900px;
          margin: 72px auto 0;
          padding: 0 20px 50px;
          box-sizing: border-box;
        }

        .title {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          font-size: 36px;
          line-height: 1.2;
          font-weight: 700;
          color: #333;
          text-align: center;
        }

        .title-icon {
          width: 38px;
          flex-shrink: 0;
        }

        .search-card {
          background: white;
          margin-top: 32px;
          padding: 30px;
          border-radius: 12px;
          border-top: 5px solid #ffcc00;
          box-sizing: border-box;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }

        .desc {
          text-align: center;
          margin-bottom: 22px;
          font-size: 17px;
          font-weight: 500;
        }

        .search-box {
          display: flex;
          border: 2px solid #d0d5dd;
          border-radius: 12px;
          overflow: hidden;
          height: 58px;
          box-sizing: border-box;
          background: white;
        }

        .error-border {
          border-color: #d93025;
        }

        .input {
          flex: 1;
          min-width: 0;
          padding: 0 16px;
          border: none;
          outline: none;
          font-size: 16px;
          font-family: inherit;
        }

        .search-button {
          width: 168px;
          border: none;
          background: #0b3d91;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 11px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          font-family: inherit;
        }

        .search-button:disabled {
          opacity: 0.75;
          cursor: not-allowed;
        }

        .search-icon {
          width: 18px;
          height: 18px;
          object-fit: contain;
        }

        .loading {
          margin-top: 16px;
          text-align: center;
          font-weight: 600;
          color: #333;
        }

        .error-text {
          color: #d93025;
          margin-top: 15px;
          text-align: center;
          font-size: 14px;
          font-weight: 500;
        }

        .type-area {
          margin-top: 28px;
          background: #f0f2f5;
          padding: 20px;
          border-radius: 10px;
          text-align: center;
          box-sizing: border-box;
        }

        .type-title {
          margin-bottom: 13px;
          font-size: 14px;
          color: #555;
          font-weight: 600;
        }

        .type-list {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 38px;
          flex-wrap: wrap;
        }

        .type-item {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 15px;
          font-weight: 600;
        }

        .type-item img {
          height: 20px;
          object-fit: contain;
        }

        .help {
          margin-top: 18px;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 7px;
          font-size: 16px;
          font-weight: 600;
        }

        .help img {
          width: 22px;
        }

        .language {
          margin-top: 42px;
          text-align: center;
        }

        .language select {
          padding: 10px 18px;
          border-radius: 24px;
          border: 1px solid #ccc;
          background: white;
          font-size: 15px;
          font-family: inherit;
        }

        @media (max-width: 768px) {
          .header {
            padding: 12px 14px;
            align-items: flex-start;
            gap: 10px;
          }

          .logo-wrap {
            min-width: auto;
          }

          .logo {
            height: 34px;
          }

          .header-actions {
            gap: 12px;
            font-size: 13px;
            flex-wrap: wrap;
            justify-content: flex-end;
          }

          .menu {
            padding: 14px;
            gap: 22px;
            overflow-x: auto;
            font-size: 15px;
            -webkit-overflow-scrolling: touch;
          }

          .menu::-webkit-scrollbar {
            display: none;
          }

          .green-inner {
            height: auto;
            min-height: 80px;
            padding: 12px 14px;
            gap: 12px;
          }

          .ad-left {
            min-width: 125px;
          }

          .ad-small {
            font-size: 15px;
          }

          .ad-box {
            font-size: 15px;
            padding: 4px 7px;
          }

          .ad-center {
            font-size: 16px;
            line-height: 1.2;
          }

          .ad-button {
            font-size: 13px;
            padding: 8px 13px;
            margin-left: 0;
          }

          .main {
            margin-top: 46px;
            padding: 0 14px 42px;
          }

          .title {
            font-size: 30px;
            justify-content: flex-start;
            text-align: left;
            gap: 12px;
            line-height: 1.15;
          }

          .title-icon {
            width: 32px;
          }

          .search-card {
            margin-top: 28px;
            padding: 24px 18px;
            border-radius: 14px;
          }

          .desc {
            font-size: 16px;
            line-height: 1.35;
            margin-bottom: 22px;
          }

          .search-box {
            height: 56px;
          }

          .input {
            font-size: 15px;
            padding: 0 12px;
          }

          .search-button {
            width: 150px;
            font-size: 14px;
            padding: 0 14px;
          }

          .type-area {
            padding: 20px 14px;
          }

          .type-list {
            gap: 20px;
          }

          .type-item {
            font-size: 15px;
          }
        }

        @media (max-width: 480px) {
          .header {
            display: block;
          }

          .logo-wrap {
            margin-bottom: 12px;
          }

          .logo {
            height: 30px;
          }

          .header-actions {
            display: grid;
            grid-template-columns: repeat(4, auto);
            justify-content: start;
            gap: 10px 16px;
            font-size: 12px;
          }

          .menu {
            padding: 12px 14px;
            gap: 20px;
            font-size: 15px;
          }

          .green-inner {
            display: grid;
            grid-template-columns: 1fr auto;
            grid-template-areas:
              "left button"
              "center center";
            align-items: center;
          }

          .ad-left {
            grid-area: left;
          }

          .ad-center {
            grid-area: center;
            text-align: left;
            font-size: 15px;
            margin-top: 6px;
          }

          .ad-button {
            grid-area: button;
            font-size: 13px;
            padding: 8px 13px;
          }

          .main {
            margin-top: 42px;
            padding: 0 14px 38px;
          }

          .title {
            font-size: 29px;
            line-height: 1.14;
          }

          .search-card {
            padding: 22px 16px;
          }

          .search-box {
            height: auto;
            display: flex;
          }

          .input {
            height: 54px;
          }

          .search-button {
            width: 136px;
            min-width: 136px;
            height: 54px;
            font-size: 13px;
            gap: 8px;
          }

          .search-icon {
            width: 17px;
            height: 17px;
          }

          .type-area {
            margin-top: 26px;
            padding: 18px 12px;
          }

          .type-title {
            font-size: 14px;
            line-height: 1.35;
          }

          .type-list {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 10px;
          }

          .type-item {
            justify-content: center;
            font-size: 13px;
            gap: 5px;
          }

          .type-item img {
            height: 18px;
          }

          .help {
            margin-top: 18px;
            font-size: 15px;
          }

          .language {
            margin-top: 36px;
          }
        }

        @media (max-width: 375px) {
          .title {
            font-size: 26px;
          }

          .search-button {
            width: 120px;
            min-width: 120px;
          }

          .search-button span {
            display: none;
          }

          .search-icon {
            width: 22px;
            height: 22px;
          }

          .type-list {
            grid-template-columns: 1fr;
            gap: 12px;
          }
        }
      `}</style>
    </>
  );
}
