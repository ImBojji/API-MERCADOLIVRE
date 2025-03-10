export default async function handler(req, res) {
  const myHeaders = new Headers();
  myHeaders.append("accept", "application/json");
  myHeaders.append("content-type", "application/x-www-form-urlencoded");

  const urlencoded = new URLSearchParams();
  urlencoded.append("grant_type", "refresh_token");
  urlencoded.append("client_id", process.env.CLIENT_ID);
  urlencoded.append("client_secret", process.env.CLIENT_SECRET);
  urlencoded.append("refresh_token", process.env.REFRESH_TOKEN);

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: urlencoded,
    redirect: "follow"
  };

  try {
    const response = await fetch("https://api.mercadolibre.com/oauth/token", requestOptions);
    const result = await response.json();
    console.log("Novo token:", result);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Erro ao atualizar token:", error);
    return res.status(500).json({ error: "Erro ao atualizar token" });
  }
}
