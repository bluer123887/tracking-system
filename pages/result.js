import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function Result() {
  const router = useRouter();
  const { code } = router.query;

  const [progress, setProgress] = useState(0);
  const [valid, setValid] = useState(true);
  const [loading, setLoading] = useState(true);

  // ✅ 固定物流信息：2026-04-21 到 2026-05-06，最终显示到北京海关
  const timeline = [
    {
      time: "6 Mai 2026 – Douane de Pékin",
      status: "L’envoi est en cours de traitement douanier auprès des autorités compétentes."
    },
    {
      time: "5 Mai 2026 – Arrivée à Pékin (Chine)",
      status: "L’envoi est arrivé dans le pays de destination via l’aéroport international de Pékin."
    },
    {
      time: "3 Mai 2026 – Transit en Asie centrale",
      status: "L’envoi est en transit dans un centre logistique intermédiaire en Asie centrale."
    },
    {
      time: "1 Mai 2026 – Transport aérien international",
      status: "L’envoi est en cours de transport vers l’Asie via une liaison aérienne internationale."
    },
    {
      time: "30 Avril 2026 – Francfort (Allemagne)",
      status: "L’envoi est arrivé au hub logistique européen pour transit international."
    },
    {
      time: "29 Avril 2026 – Roissy Charles-de-Gaulle (CDG)",
      status: "L’envoi est prêt pour l’expédition internationale après tri et contrôle."
    },
    {
      time: "28 Avril 2026 – Centre de tri de Paris",
      status: "L’envoi est en cours de traitement dans le centre logistique national."
    },
    {
      time: "27 Avril 2026 – Plateforme logistique d’Île-de-France",
      status: "L’envoi a été acheminé vers une plateforme logistique régionale."
    },
    {
      time: "25 Avril 2026 – Paris (France)",
      status: "L’envoi est en cours de préparation pour son acheminement international."
    },
    {
      time: "24 Avril 2026 – Paris (France)",
      status: "L’envoi a été enregistré dans le système de suivi."
    },
    {
      time: "22 Avril 2026 – Paris (France)",
      status: "L’envoi a été pris en charge par le service postal."
    },
    {
      time: "21 Avril 2026 – Paris (France)",
      status: "L’expéditeur a déposé l’envoi."
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
              marginRight: 15
            }}></div>

            <div style={{ width: "100%" }}>
              <div style={{ fontWeight: 600 }}>
                {item.time}
              </div>

              <div style={{ color: "#666", marginTop: 5 }}>
                {item.status}
              </div>

              {i === 0 && (
                <div style={{
                  marginTop: 10,
                  background: "#f5f6f8",
                  padding: 12,
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  color: "#0055A4"
                }}>
                  <img src="/robot.png" style={{ width: 24 }} />
                  Aide
                </div>
              )}
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}
