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
      title: "Suivre un courrier ou un colis :",
      placeholder: "Renseignez votre ou vos numéros de suivi",
      button: "Suivre votre envoi",
      error: "Aucun résultat pour ce numéro de suivi.",
      empty: "Veuillez saisir un numéro de suivi.",
      server: "Erreur serveur. Veuillez réessayer plus tard.",
      loading: "Chargement..."
    },
    en: {
      title: "Track a letter or parcel:",
      placeholder: "Enter your tracking number",
      button: "Track your shipment",
      error: "No result found for this tracking number.",
      empty: "Please enter a tracking number.",
      server: "Server error. Please try again later.",
      loading: "Loading..."
    },
    de: {
      title: "Sendung verfolgen:",
      placeholder: "Sendungsnummer eingeben",
      button: "Sendung verfolgen",
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
        <header className="mobile-header">
          <div className="header-inner">
            <img
              src="/mobile-logo-menu.png"
              className="logo-menu"
              alt="menu"
            />

            <img
              src="/mobile-actions.png"
              className="action-icons"
              alt="actions"
            />
          </div>
        </header>

        <main className="content">
          <section className="promo-wrap">
            <img
              src="/mobile-promos.png"
              className="promo-image"
              alt="promotions"
            />
          </section>

          <section className="tracking-card">
            <h1>{t.title}</h1>

            <textarea
              value={tracking}
              onChange={(e) => {
                setTracking(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSearch();
                }
              }}
              placeholder={t.placeholder}
              className={error ? "tracking-input input-error" : "tracking-input"}
            />

            <button
              onClick={handleSearch}
              disabled={loading}
              className="track-button"
            >
              {loading ? t.loading : t.button}
            </button>

            {error && (
              <div className="error-text">
                {error}
              </div>
            )}
          </section>

          <section className="services-wrap">
            <img
              src="/mobile-services.png"
              className="services-image"
              alt="services"
            />
          </section>

          <div className="language">
            <select value={lang} onChange={(e) => setLang(e.target.value)}>
              <option value="fr">Français</option>
              <option value="en">English</option>
              <option value="de">Deutsch</option>
            </select>
          </div>
        </main>
      </div>

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .page {
          min-height: 100vh;
          background: #f7f7f7;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
          overflow-x: hidden;
          padding-bottom: 36px;
        }

        .mobile-header {
          background: #ffffff;
          border-bottom: 1px solid #dedede;
          height: 86px;
          display: flex;
          align-items: center;
          width: 100%;
        }

        .header-inner {
          width: 100%;
          padding: 0 22px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .logo-menu {
          width: 178px;
          height: auto;
          display: block;
          object-fit: contain;
        }

        .action-icons {
          width: 218px;
          height: auto;
          display: block;
          object-fit: contain;
        }

        .content {
          width: 100%;
          max-width: 430px;
          margin: 0 auto;
          background: #ffffff;
          min-height: calc(100vh - 86px);
        }

        .promo-wrap {
          padding: 18px 18px 0;
          background: #ffffff;
        }

        .promo-image {
          width: 100%;
          height: auto;
          display: block;
          object-fit: contain;
          border-radius: 0;
        }

        .tracking-card {
          margin: 48px 18px 0;
          padding: 36px 22px 28px;
          background: #ffffff;
          border-radius: 0 0 14px 14px;
          box-shadow: 0 5px 22px rgba(0, 0, 0, 0.12);
        }

        .tracking-card h1 {
          margin: 0 0 30px;
          color: #0055a4;
          font-size: 32px;
          line-height: 1.18;
          font-weight: 800;
          letter-spacing: -0.4px;
        }

        .tracking-input {
          width: 100%;
          height: 112px;
          resize: none;
          border: 1.6px solid #333333;
          border-radius: 13px;
          outline: none;
          padding: 21px 19px;
          color: #333333;
          font-family: inherit;
          font-size: 26px;
          line-height: 1.25;
          background: #ffffff;
        }

        .tracking-input::placeholder {
          color: #6c6c6c;
        }

        .input-error {
          border-color: #d93025;
        }

        .track-button {
          width: 100%;
          height: 72px;
          margin-top: 28px;
          border: none;
          border-radius: 12px;
          background: #ffcc00;
          color: #333333;
          font-family: inherit;
          font-size: 25px;
          font-weight: 800;
          cursor: pointer;
        }

        .track-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .error-text {
          margin-top: 16px;
          color: #d93025;
          text-align: center;
          font-size: 15px;
          font-weight: 600;
          line-height: 1.4;
        }

        .services-wrap {
          padding: 48px 18px 0;
          background: #ffffff;
        }

        .services-image {
          width: 100%;
          height: auto;
          display: block;
          object-fit: contain;
        }

        .language {
          padding: 34px 0 10px;
          text-align: center;
          background: #ffffff;
        }

        .language select {
          padding: 10px 18px;
          border-radius: 24px;
          border: 1px solid #cccccc;
          background: white;
          font-size: 15px;
          font-family: inherit;
        }

        @media (min-width: 431px) {
          .page {
            background: #eeeeee;
          }

          .mobile-header {
            max-width: 430px;
            margin: 0 auto;
          }

          .content {
            box-shadow: 0 0 0 1px #dddddd;
          }
        }

        @media (max-width: 420px) {
          .mobile-header {
            height: 80px;
          }

          .header-inner {
            padding: 0 18px;
          }

          .logo-menu {
            width: 158px;
          }

          .action-icons {
            width: 190px;
          }

          .promo-wrap {
            padding: 16px 16px 0;
          }

          .tracking-card {
            margin: 44px 18px 0;
            padding: 34px 22px 28px;
          }

          .tracking-card h1 {
            font-size: 30px;
            margin-bottom: 28px;
          }

          .tracking-input {
            height: 104px;
            font-size: 24px;
            padding: 19px 18px;
          }

          .track-button {
            height: 68px;
            font-size: 23px;
          }

          .services-wrap {
            padding: 46px 18px 0;
          }
        }

        @media (max-width: 390px) {
          .logo-menu {
            width: 146px;
          }

          .action-icons {
            width: 176px;
          }

          .tracking-card h1 {
            font-size: 28px;
          }

          .tracking-input {
            font-size: 22px;
          }

          .track-button {
            font-size: 21px;
          }
        }

        @media (max-width: 360px) {
          .header-inner {
            padding: 0 14px;
          }

          .logo-menu {
            width: 132px;
          }

          .action-icons {
            width: 156px;
          }

          .tracking-card {
            margin: 38px 14px 0;
            padding: 30px 18px 26px;
          }

          .tracking-card h1 {
            font-size: 25px;
          }

          .tracking-input {
            height: 96px;
            font-size: 20px;
          }

          .track-button {
            height: 62px;
            font-size: 19px;
          }

          .promo-wrap,
          .services-wrap {
            padding-left: 14px;
            padding-right: 14px;
          }
        }
      `}</style>
    </>
  );
}
