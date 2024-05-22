const axios = require('axios');
const cheerio = require('cheerio');
const utils = require('./utils');
const Product = require('../models/product');

const mapCategories = {
  'Painel Solar': 1,
  'Estrutura Solar': 2,
  'Controlador de Carga': 3,
  'Inversor': 4,
  'Inversor Off-Grid': 4,
  'Inversor Solar On-Grid': 4,
  'Inversor Drive Bomba Solar': 4,
  'Ferramentas': 5,
  'Fontes Carregadoras': 6,
  'Baterias': 6,
  'Kit Energia Solar': 7,
  'Kit Energia Solar On-grid': 7,
  'Kit Energia Solar Off-grid': 7,
  'Cabos e Conectores': 8,
  'Disjuntor': 9,
  'Stringbox e Proteções': 10,
  'Eletrificador Solar': 14,
  'Variedades': 14,
  'Bombeamento Solar Profissional': 15,
  'Bomba Solar': 15,
  'Kit Bomba Solar': 15,
};

function scrape() {
    
}

module.exports = {
  scrape,
};