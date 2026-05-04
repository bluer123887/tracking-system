let allowedCode = "EW150183168FR";

export default function handler(req, res) {
  if (req.method === "GET") {
    const { code } = req.query;

    // 后台读取当前允许查询的单号
    if (!code) {
      return res.status(200).json({
        allowedCode
      });
    }

    // 用户查询单号
    if (code === allowedCode) {
      return res.status(200).json({
        success: true,
        allowedCode
      });
    }

    return res.status(404).json({
      error: "Aucun résultat pour ce numéro de suivi."
    });
  }

  if (req.method === "POST") {
    const { allowedCode: newCode } = req.body;

    if (!newCode) {
      return res.status(400).json({
        error: "Le numéro de suivi est requis."
      });
    }

    allowedCode = newCode.trim();

    return res.status(200).json({
      success: true,
      allowedCode
    });
  }

  return res.status(405).json({
    error: "Méthode non autorisée."
  });
}
