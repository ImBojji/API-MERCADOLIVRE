import dotenv from "dotenv";
dotenv.config();
import getToken from "./api_refresh.js";

const a = getToken.access_token 

async function getItems(x) {
const myHeaders = new Headers();
myHeaders.append("Authorization", "Bearer $ACCESS_TOKEN");

const requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow"
};

fetch("https://api.mercadolibre.com/sites/$SITE_ID/search?category=$CATEGORY_ID", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
} 
getItems(a)