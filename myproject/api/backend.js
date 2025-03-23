import dotenv from "dotenv";
import getToken from "./api_refresh.js";
import fetch from 'node-fetch'
import moongoose from 'mongoose';
import mongoose from "mongoose";
dotenv.config();

async function mongodbacess(){
  moongoose.connect(process.env.HOST)
  .then(() => console.log('Conectado ao banco de dados'))
  .catch((error)=> console.error('Erro ao conectar ao banco de dados:', error))
}

export default async function getItems(seller_id){
  await mongodbacess();
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

const ProductSchema = new mongoose.Schema({
  title: String,
  id: String,
  permalink: String,
  category_id: String,
  price: Number,
  original_price: Number,
  sale_price: {
    amount: Number,
    conditions: {
      start_time: Date,
      end_time: Date,
    },
    metadata:{
      promotion_id: String,
      campaign_discount_percentage: Number,
      campaign_end_date: Date,
    },
  },
},
{strict: true})


async function saveitems(){
  const item = await getItems(process.env.SELLER_ID)
 
  const Product = mongoose.model('Product', ProductSchema);

  Product.insertMany(item)
   .then(()=> {
    console.log('Items salvos!!')
    mongoose.connection.close();
   })
   .catch((error) => console.error('Erro ao salvar items:', error))
}
saveitems()