import dotenv from "dotenv";
import getToken from "./api_refresh.js";
import fetch from 'node-fetch'
import fs from 'fs/promises'
dotenv.config();

export default async function getItems(seller_id){
  const access_token = await getToken();
  if(!access_token) {
    console.error('erro ao obter token')
    return;
  }
  let todositems = [];
  let offset = 0;
  let limit = 50;
  let total = null;

  console.log('Buscando items...')

 try {
  do{
    const url = `https://api.mercadolibre.com/sites/MLB/search?seller_id=${seller_id}&offset=${offset}&limit=${limit}`;
    const response =  await fetch(url, {
      method: 'GET',
      headers: {authorization: `Bearer ${access_token}`}
    })
    const data = await response.json();
    if(!total){
      total = data.paging.total;
      console.log(`Total de items encontrados: ${total}`)

    }
    todositems = todositems.concat(data.results);
    offset += limit;
    console.log(`Todos os items: ${todositems.length}/ ${total}`)
  }while(todositems.length < total);
    return todositems
  }catch(error){
    console.error('Erro ao buscar item do vendedord:', error);
  }
}
getItems(process.env.SELLER_ID)

async function saveitems(){
  const items = await getItems(process.env.SELLER_ID)
  const arquivoJSON = 'Biblioteca_dos_produtos.json'
  try{ 
    await fs.writeFile(arquivoJSON, JSON.stringify(items,null,2))
    console.log(`biblioteca salva em ${arquivoJSON} `)
  } catch (error){
     console.error('Erro ao salvar biblioteca:', error)
  }
}
saveitems()