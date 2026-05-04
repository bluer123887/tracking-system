import { useEffect, useState } from "react";

export default function Admin() {
  const [allowedCode, setAllowedCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/tracking")
      .then((res) => res.json())
      .then((data) => {
        setAllowedCode(data.allowedCode || "EW150183168FR");
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        alert("Erreur de chargement.");
      });
  }, []);

  const saveCode = async () => {
    if (!allowedCode.trim()) {
      alert("Veuillez saisir un numéro de suivi.");
      return;
    }

    setSaving(true);

    const res = await fetch("/api/tracking", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        allowedCode: allowedCode.trim(),
      }),
    });

    setSaving(false);

    if (res.ok) {
      alert("Numéro enregistré !");
    } else {
      alert("Erreur lors de l'enregistrement.");
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 40, fontFamily: "Arial" }}>
        Chargement...
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: 600,
        margin: "60px auto",
        padding: 30,
        fontFamily: "Arial",
        background: "#f5f5f5",
        borderRadius: 16,
      }}
    >
      <h2>Admin — Numéro de suivi autorisé</h2>

      <p style={{ color: "#666" }}>
        Seul ce numéro pourra afficher le résultat de suivi.
      </p>

      <input
        value={allowedCode}
        onChange={(e) => setAllowedCode(e.target.value)}
        placeholder="EW150183168FR"
        style={{
          width: "100%",
          padding: 14,
          fontSize: 18,
          border: "1px solid #ccc",
          borderRadius: 10,
          marginTop: 20,
          boxSizing: "border-box",
        }}
      />

      <button
        onClick={saveCode}
        disabled={saving}
        style={{
          width: "100%",
          marginTop: 20,
          padding: 14,
          background: "#0b3d91",
          color: "white",
          border: "none",
          borderRadius: 10,
          fontSize: 16,
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        {saving ? "Enregistrement..." : "Enregistrer"}
      </button>
    </div>
  );
}
