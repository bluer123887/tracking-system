import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function Result() {
  const router = useRouter();
  const { code } = router.query;

  const [progress, setProgress] = useState(0);
  const [valid, setValid] = useState(true);
  const [loading, setLoading] = useState(true);

  // ✅ 固定物流信息：2026-04-27 到 2026-05-10，最终显示北京海关处理后转入配送
 const timeline = [
  {
    time: "9 Mai 2026 – 11:38:52 – Contrôle douanier",
    status:
      "Simulation de suivi : l’envoi a été sélectionné pour un contrôle douanier aléatoire. Conformément aux procédures de vérification, le destinataire est invité à se présenter au service indiqué afin de compléter le contrôle et de procéder au retrait de l’envoi après validation.",
    location: "ZONE DE CONTRÔLE DOUANIER – CHINE"
  },
  {
    time: "9 Mai 2026 – 09:24:17 – Contrôle douanier",
    status:
      "Simulation de suivi : l’envoi reste sous contrôle douanier. Une vérification complémentaire est requise avant toute poursuite du traitement. Le destinataire pourra être invité à fournir les informations nécessaires ou à se présenter pour vérification.",
    location: "ZONE DE CONTRÔLE DOUANIER – CHINE"
  },
  {
    time: "30 Avril 2026 – 16:40:55 – Contrôle douanier",
    status:
      "L’envoi est entré dans une procédure de contrôle douanier. Une vérification complémentaire peut être nécessaire avant la poursuite du traitement.",
    location: "ZONE DE CONTRÔLE DOUANIER – CHINE"
  },
  {
    time: "30 Avril 2026 – 09:18:26 – Arrivée au centre de contrôle",
    status:
      "L’envoi a été orienté vers un centre de contrôle pour examen administratif.",
    location: "CENTRE DE CONTRÔLE INTERNATIONAL"
  },
  {
    time: "29 Avril 2026 – 21:13:26 – Roissy Charles-de-Gaulle (CDG)",
    status:
      "L’envoi est prêt pour l’expédition internationale après tri et contrôle.",
    location: "ROISSY CHARLES-DE-GAULLE – FRANCE"
  },
  {
    time: "28 Avril 2026 – 18:24:09 – Centre de tri de Paris",
    status:
      "L’envoi est en cours de traitement dans le centre logistique national.",
    location: "CENTRE DE TRI DE PARIS – FRANCE"
  },
  {
    time: "27 Avril 2026 – 13:58:41 – Plateforme logistique d’Île-de-France",
    status:
      "L’envoi a été acheminé vers une plateforme logistique régionale.",
    location: "ÎLE-DE-FRANCE – FRANCE"
  },
  {
    time: "27 Avril 2026 – 09:42:13 – Paris (France)",
    status:
      "L’envoi a été pris en charge par le service postal pour son acheminement international.",
    location: "PARIS – FRANCE"
  },
  {
    time: "27 Avril 2026 – 08:16:27 – Paris (France)",
    status:
      "L’expéditeur a déposé l’envoi.",
    location: "PARIS – FRANCE"
  }
];


  // ✅ 单号验证（只允许后台设置的单号）
  useEffect(() => {
    if (!code) return;

    fetch("/api/tracking")
      .then(res => res.json())
      .then(cfg => {
        if (code !== cfg.allowedCode) {
          setValid(false);
        }
        setLoading(false);
      })
      .catch(() => {
        setValid(false);
        setLoading(false);
      });
  }, [code]);

  // ✅ 圆环动画 0 → 95%
  useEffect(() => {
    let val = 0;
    const timer = setInterval(() => {
      val += 1;
      setProgress(val);
      if (val >= 95) clearInterval(timer);
    }, 15);

    return () => clearInterval(timer);
  }, []);

  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  // ❌ 非法单号
  if (!loading && !valid) {
    return (
      <div style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Montserrat"
      }}>
        <h2>Aucun résultat pour ce numéro de suivi.</h2>
      </div>
    );
  }

  // ⏳ 加载中
  if (loading) {
    return (
      <div style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        Chargement...
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: 420,
      margin: "auto",
      background: "#f5f5f5",
      minHeight: "100vh",
      fontFamily: "'Montserrat','Helvetica Neue',Arial,sans-serif",
      paddingBottom: 40
    }}>

      {/* 标题 */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: 15,
        fontWeight: 600,
        fontSize: 18
      }}>
        <img src="/envelope.png" style={{ width: 44 }} />
        Envoi international avec suivi
      </div>

      {/* 单号 */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "0 10px",
        alignItems: "center"
      }}>
        <div style={{ fontWeight: 600 }}>
          N° {code}
        </div>

        <div style={{
          border: "1px solid #ddd",
          borderRadius: 14,
          padding: "10px 16px",
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: "#fafafa"
        }}>
          <img src="/pen.png" style={{ width: 18 }} />
          Renommer
        </div>
      </div>

      {/* 提示 */}
      <div style={{
        background: "white",
        margin: 10,
        padding: 15,
        borderRadius: 12,
        borderTop: "4px solid #ffcc00",
        textAlign: "center",
        color: "#666"
      }}>
        Votre envoi sera livré à votre adresse.
      </div>

      {/* 状态卡 */}
      <div style={{
        background: "white",
        margin: 10,
        padding: 20,
        borderRadius: 16,
        display: "flex",
        gap: 20,
        alignItems: "center"
      }}>

        <div style={{ position: "relative", width: 100, height: 100 }}>
          <svg width="100" height="100">
            <circle cx="50" cy="50" r={radius} stroke="#eee" strokeWidth="8" fill="none"/>
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="#0055A4"
              strokeWidth="8"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              style={{
                transform: "rotate(-90deg)",
                transformOrigin: "50% 50%",
                transition: "0.3s linear"
              }}
            />
          </svg>

          <img
            src="/truck.png"
            style={{
              position: "absolute",
              width: 48,
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)"
            }}
          />
        </div>

        <div style={{
          fontWeight: 600,
          fontSize: 16,
          lineHeight: 1.4
        }}>
          Il est en cours de transport vers votre site de distribution.
        </div>
      </div>

      {/* 时间轴 */}
      <div style={{
        position: "relative",
        marginLeft: 30,
        marginTop: 20
      }}>

        <div style={{
          position: "absolute",
          left: 5,
          top: 0,
          bottom: 0,
          width: 2,
          background: "#ccc"
        }}></div>

        {timeline.map((item, i) => (
          <div key={i} style={{ display: "flex", marginBottom: 30 }}>
            <div style={{
              width: 12,
              height: 12,
              background: "#ffcc00",
              borderRadius: "50%",
              marginRight: 15,
              flexShrink: 0
            }}></div>

            <div style={{ width: "100%" }}>
              <div style={{ fontWeight: 600 }}>
                {item.time}
              </div>

              <div style={{ color: "#666", marginTop: 5, lineHeight: 1.35 }}>
                {item.status}
              </div>

              <div style={{
                color: "#999",
                marginTop: 6,
                fontSize: 13,
                lineHeight: 1.35,
                fontWeight: 500
              }}>
                {item.location}
              </div>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}
