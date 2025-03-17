import dotenv from "dotenv";
dotenv.config();

export default async function getToken() {
  const myHeaders = new Headers();
  myHeaders.append("accept", "application/json");
  myHeaders.append("content-type", "application/x-www-form-urlencoded");

  const urlencoded = new URLSearchParams();
  urlencoded.append("grant_type", "refresh_token");
  urlencoded.append("client_id", process.env.CLIENT_iD);
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
    console.log(result.access_token);
    return result.access_token;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

getToken().catch(error => console.error('erro que foi obtido:',error))

setInterval(async () => {
  try{
    console.log('gerando token...');
    await getToken();
  }catch(error){
    console.error('erro obtido ao tentar regerar token:', error);
  } 
}, 5 * 60 * 60 * 1000); // 5 horas para cada regeracao de token