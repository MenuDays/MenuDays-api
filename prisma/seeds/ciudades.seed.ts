import { PrismaClient } from '@prisma/client';

export async function seedCiudades(prisma: PrismaClient) {
  console.log('Cargando ciudades de Ecuador...');

  const provincias = await prisma.provincias.findMany();

  const mapaProvincias = new Map(
    provincias.map((provincia) => [provincia.nombre, provincia.id]),
  );

  const ciudades = [

    // ===========================
// AZUAY
// ===========================

{
  nombre: "Cuenca",
  provincia_id: mapaProvincias.get("Azuay")!,
},

{
  nombre: "Camilo Ponce Enríquez",
  provincia_id: mapaProvincias.get("Azuay")!,
},

{
  nombre: "Chordeleg",
  provincia_id: mapaProvincias.get("Azuay")!,
},

{
  nombre: "El Pan",
  provincia_id: mapaProvincias.get("Azuay")!,
},

{
  nombre: "Girón",
  provincia_id: mapaProvincias.get("Azuay")!,
},

{
  nombre: "Guachapala",
  provincia_id: mapaProvincias.get("Azuay")!,
},

{
  nombre: "Gualaceo",
  provincia_id: mapaProvincias.get("Azuay")!,
},

{
  nombre: "Nabón",
  provincia_id: mapaProvincias.get("Azuay")!,
},

{
  nombre: "Oña",
  provincia_id: mapaProvincias.get("Azuay")!,
},

{
  nombre: "Paute",
  provincia_id: mapaProvincias.get("Azuay")!,
},

{
  nombre: "Pucará",
  provincia_id: mapaProvincias.get("Azuay")!,
},

{
  nombre: "San Fernando",
  provincia_id: mapaProvincias.get("Azuay")!,
},

{
  nombre: "Santa Isabel",
  provincia_id: mapaProvincias.get("Azuay")!,
},

{
  nombre: "Sevilla de Oro",
  provincia_id: mapaProvincias.get("Azuay")!,
},

{
  nombre: "Sígsig",
  provincia_id: mapaProvincias.get("Azuay")!,
},



    // ===========================
// BOLÍVAR
// ===========================

{
  nombre: "Guaranda",
  provincia_id: mapaProvincias.get("Bolívar")!,
},

{
  nombre: "Caluma",
  provincia_id: mapaProvincias.get("Bolívar")!,
},

{
  nombre: "Chillanes",
  provincia_id: mapaProvincias.get("Bolívar")!,
},

{
  nombre: "Chimbo",
  provincia_id: mapaProvincias.get("Bolívar")!,
},

{
  nombre: "Echeandía",
  provincia_id: mapaProvincias.get("Bolívar")!,
},

{
  nombre: "Las Naves",
  provincia_id: mapaProvincias.get("Bolívar")!,
},

{
  nombre: "San Miguel",
  provincia_id: mapaProvincias.get("Bolívar")!,
},


    // ===========================
// CAÑAR
// ===========================

{
  nombre: "Azogues",
  provincia_id: mapaProvincias.get("Cañar")!,
},

{
  nombre: "Biblián",
  provincia_id: mapaProvincias.get("Cañar")!,
},

{
  nombre: "Cañar",
  provincia_id: mapaProvincias.get("Cañar")!,
},

{
  nombre: "Déleg",
  provincia_id: mapaProvincias.get("Cañar")!,
},

{
  nombre: "El Tambo",
  provincia_id: mapaProvincias.get("Cañar")!,
},

{
  nombre: "La Troncal",
  provincia_id: mapaProvincias.get("Cañar")!,
},

{
  nombre: "Suscal",
  provincia_id: mapaProvincias.get("Cañar")!,
},


    // ===========================
// CARCHI
// ===========================

{
  nombre: "Tulcán",
  provincia_id: mapaProvincias.get("Carchi")!,
},

{
  nombre: "Bolívar",
  provincia_id: mapaProvincias.get("Carchi")!,
},

{
  nombre: "Espejo",
  provincia_id: mapaProvincias.get("Carchi")!,
},

{
  nombre: "Mira",
  provincia_id: mapaProvincias.get("Carchi")!,
},

{
  nombre: "Montúfar",
  provincia_id: mapaProvincias.get("Carchi")!,
},

{
  nombre: "San Pedro de Huaca",
  provincia_id: mapaProvincias.get("Carchi")!,
},



    // ===========================
// CHIMBORAZO
// ===========================

{
  nombre: "Riobamba",
  provincia_id: mapaProvincias.get("Chimborazo")!,
},

{
  nombre: "Alausí",
  provincia_id: mapaProvincias.get("Chimborazo")!,
},

{
  nombre: "Chambo",
  provincia_id: mapaProvincias.get("Chimborazo")!,
},

{
  nombre: "Chunchi",
  provincia_id: mapaProvincias.get("Chimborazo")!,
},

{
  nombre: "Colta",
  provincia_id: mapaProvincias.get("Chimborazo")!,
},

{
  nombre: "Cumandá",
  provincia_id: mapaProvincias.get("Chimborazo")!,
},

{
  nombre: "Guamote",
  provincia_id: mapaProvincias.get("Chimborazo")!,
},

{
  nombre: "Guano",
  provincia_id: mapaProvincias.get("Chimborazo")!,
},

{
  nombre: "Pallatanga",
  provincia_id: mapaProvincias.get("Chimborazo")!,
},

{
  nombre: "Penipe",
  provincia_id: mapaProvincias.get("Chimborazo")!,
},



    // ===========================
// COTOPAXI
// ===========================

{
  nombre: "Latacunga",
  provincia_id: mapaProvincias.get("Cotopaxi")!,
},

{
  nombre: "La Maná",
  provincia_id: mapaProvincias.get("Cotopaxi")!,
},

{
  nombre: "Pangua",
  provincia_id: mapaProvincias.get("Cotopaxi")!,
},

{
  nombre: "Pujilí",
  provincia_id: mapaProvincias.get("Cotopaxi")!,
},

{
  nombre: "Salcedo",
  provincia_id: mapaProvincias.get("Cotopaxi")!,
},

{
  nombre: "Saquisilí",
  provincia_id: mapaProvincias.get("Cotopaxi")!,
},

{
  nombre: "Sigchos",
  provincia_id: mapaProvincias.get("Cotopaxi")!,
},


// ===========================
// EL ORO
// ===========================

{
  nombre: "Machala",
  provincia_id: mapaProvincias.get("El Oro")!,
},

{
  nombre: "Arenillas",
  provincia_id: mapaProvincias.get("El Oro")!,
},

{
  nombre: "Atahualpa",
  provincia_id: mapaProvincias.get("El Oro")!,
},

{
  nombre: "Balsas",
  provincia_id: mapaProvincias.get("El Oro")!,
},

{
  nombre: "Chilla",
  provincia_id: mapaProvincias.get("El Oro")!,
},

{
  nombre: "El Guabo",
  provincia_id: mapaProvincias.get("El Oro")!,
},

{
  nombre: "Huaquillas",
  provincia_id: mapaProvincias.get("El Oro")!,
},

{
  nombre: "Las Lajas",
  provincia_id: mapaProvincias.get("El Oro")!,
},

{
  nombre: "Marcabelí",
  provincia_id: mapaProvincias.get("El Oro")!,
},

{
  nombre: "Pasaje",
  provincia_id: mapaProvincias.get("El Oro")!,
},

{
  nombre: "Piñas",
  provincia_id: mapaProvincias.get("El Oro")!,
},

{
  nombre: "Portovelo",
  provincia_id: mapaProvincias.get("El Oro")!,
},

{
  nombre: "Santa Rosa",
  provincia_id: mapaProvincias.get("El Oro")!,
},

{
  nombre: "Zaruma",
  provincia_id: mapaProvincias.get("El Oro")!,
},


    // ===========================
// ESMERALDAS
// ===========================

{
  nombre: "Esmeraldas",
  provincia_id: mapaProvincias.get("Esmeraldas")!,
},

{
  nombre: "Atacames",
  provincia_id: mapaProvincias.get("Esmeraldas")!,
},

{
  nombre: "Eloy Alfaro",
  provincia_id: mapaProvincias.get("Esmeraldas")!,
},

{
  nombre: "Muisne",
  provincia_id: mapaProvincias.get("Esmeraldas")!,
},

{
  nombre: "Quinindé",
  provincia_id: mapaProvincias.get("Esmeraldas")!,
},

{
  nombre: "Rioverde",
  provincia_id: mapaProvincias.get("Esmeraldas")!,
},

{
  nombre: "San Lorenzo",
  provincia_id: mapaProvincias.get("Esmeraldas")!,
},



    // ===========================
// GALÁPAGOS
// ===========================

{
  nombre: "San Cristóbal",
  provincia_id: mapaProvincias.get("Galápagos")!,
},

{
  nombre: "Isabela",
  provincia_id: mapaProvincias.get("Galápagos")!,
},

{
  nombre: "Santa Cruz",
  provincia_id: mapaProvincias.get("Galápagos")!,
},



    // ===========================
// GUAYAS
// ===========================

{
  nombre: "Guayaquil",
  provincia_id: mapaProvincias.get("Guayas")!,
},

{
  nombre: "Alfredo Baquerizo Moreno (Jujan)",
  provincia_id: mapaProvincias.get("Guayas")!,
},

{
  nombre: "Balao",
  provincia_id: mapaProvincias.get("Guayas")!,
},

{
  nombre: "Balzar",
  provincia_id: mapaProvincias.get("Guayas")!,
},

{
  nombre: "Colimes",
  provincia_id: mapaProvincias.get("Guayas")!,
},

{
  nombre: "Daule",
  provincia_id: mapaProvincias.get("Guayas")!,
},

{
  nombre: "Durán",
  provincia_id: mapaProvincias.get("Guayas")!,
},

{
  nombre: "El Empalme",
  provincia_id: mapaProvincias.get("Guayas")!,
},

{
  nombre: "El Triunfo",
  provincia_id: mapaProvincias.get("Guayas")!,
},

{
  nombre: "General Antonio Elizalde (Bucay)",
  provincia_id: mapaProvincias.get("Guayas")!,
},

{
  nombre: "Isidro Ayora",
  provincia_id: mapaProvincias.get("Guayas")!,
},

{
  nombre: "Lomas de Sargentillo",
  provincia_id: mapaProvincias.get("Guayas")!,
},

{
  nombre: "Marcelino Maridueña",
  provincia_id: mapaProvincias.get("Guayas")!,
},

{
  nombre: "Milagro",
  provincia_id: mapaProvincias.get("Guayas")!,
},

{
  nombre: "Naranjal",
  provincia_id: mapaProvincias.get("Guayas")!,
},

{
  nombre: "Naranjito",
  provincia_id: mapaProvincias.get("Guayas")!,
},

{
  nombre: "Nobol",
  provincia_id: mapaProvincias.get("Guayas")!,
},

{
  nombre: "Palestina",
  provincia_id: mapaProvincias.get("Guayas")!,
},

{
  nombre: "Pedro Carbo",
  provincia_id: mapaProvincias.get("Guayas")!,
},

{
  nombre: "Playas",
  provincia_id: mapaProvincias.get("Guayas")!,
},

{
  nombre: "Salitre",
  provincia_id: mapaProvincias.get("Guayas")!,
},

{
  nombre: "Samborondón",
  provincia_id: mapaProvincias.get("Guayas")!,
},

{
  nombre: "Santa Lucía",
  provincia_id: mapaProvincias.get("Guayas")!,
},

{
  nombre: "Simón Bolívar",
  provincia_id: mapaProvincias.get("Guayas")!,
},

{
  nombre: "Yaguachi",
  provincia_id: mapaProvincias.get("Guayas")!,
},


    // ===========================
// IMBABURA
// ===========================

{
  nombre: "Ibarra",
  provincia_id: mapaProvincias.get("Imbabura")!,
},

{
  nombre: "Antonio Ante",
  provincia_id: mapaProvincias.get("Imbabura")!,
},

{
  nombre: "Cotacachi",
  provincia_id: mapaProvincias.get("Imbabura")!,
},

{
  nombre: "Otavalo",
  provincia_id: mapaProvincias.get("Imbabura")!,
},

{
  nombre: "Pimampiro",
  provincia_id: mapaProvincias.get("Imbabura")!,
},

{
  nombre: "San Miguel de Urcuquí",
  provincia_id: mapaProvincias.get("Imbabura")!,
},

// ===========================
// LOJA
// ===========================

{
  nombre: "Loja",
  provincia_id: mapaProvincias.get("Loja")!,
},

{
  nombre: "Calvas",
  provincia_id: mapaProvincias.get("Loja")!,
},

{
  nombre: "Catamayo",
  provincia_id: mapaProvincias.get("Loja")!,
},

{
  nombre: "Celica",
  provincia_id: mapaProvincias.get("Loja")!,
},

{
  nombre: "Chaguarpamba",
  provincia_id: mapaProvincias.get("Loja")!,
},

{
  nombre: "Espíndola",
  provincia_id: mapaProvincias.get("Loja")!,
},

{
  nombre: "Gonzanamá",
  provincia_id: mapaProvincias.get("Loja")!,
},

{
  nombre: "Macará",
  provincia_id: mapaProvincias.get("Loja")!,
},

{
  nombre: "Olmedo",
  provincia_id: mapaProvincias.get("Loja")!,
},

{
  nombre: "Paltas",
  provincia_id: mapaProvincias.get("Loja")!,
},

{
  nombre: "Pindal",
  provincia_id: mapaProvincias.get("Loja")!,
},

{
  nombre: "Puyango",
  provincia_id: mapaProvincias.get("Loja")!,
},

{
  nombre: "Quilanga",
  provincia_id: mapaProvincias.get("Loja")!,
},

{
  nombre: "Saraguro",
  provincia_id: mapaProvincias.get("Loja")!,
},

{
  nombre: "Sozoranga",
  provincia_id: mapaProvincias.get("Loja")!,
},

{
  nombre: "Zapotillo",
  provincia_id: mapaProvincias.get("Loja")!,
},


// ===========================
// LOS RÍOS
// ===========================

{
  nombre: "Babahoyo",
  provincia_id: mapaProvincias.get("Los Ríos")!,
},

{
  nombre: "Baba",
  provincia_id: mapaProvincias.get("Los Ríos")!,
},

{
  nombre: "Buena Fe",
  provincia_id: mapaProvincias.get("Los Ríos")!,
},

{
  nombre: "Mocache",
  provincia_id: mapaProvincias.get("Los Ríos")!,
},

{
  nombre: "Montalvo",
  provincia_id: mapaProvincias.get("Los Ríos")!,
},

{
  nombre: "Palenque",
  provincia_id: mapaProvincias.get("Los Ríos")!,
},

{
  nombre: "Puebloviejo",
  provincia_id: mapaProvincias.get("Los Ríos")!,
},

{
  nombre: "Quevedo",
  provincia_id: mapaProvincias.get("Los Ríos")!,
},

{
  nombre: "Quinsaloma",
  provincia_id: mapaProvincias.get("Los Ríos")!,
},

{
  nombre: "Urdaneta",
  provincia_id: mapaProvincias.get("Los Ríos")!,
},

{
  nombre: "Valencia",
  provincia_id: mapaProvincias.get("Los Ríos")!,
},

{
  nombre: "Ventanas",
  provincia_id: mapaProvincias.get("Los Ríos")!,
},

{
  nombre: "Vinces",
  provincia_id: mapaProvincias.get("Los Ríos")!,
},



    // ===========================
// MANABÍ
// ===========================

{
  nombre: "Portoviejo",
  provincia_id: mapaProvincias.get("Manabí")!,
},

{
  nombre: "24 de Mayo",
  provincia_id: mapaProvincias.get("Manabí")!,
},

{
  nombre: "Bolívar",
  provincia_id: mapaProvincias.get("Manabí")!,
},

{
  nombre: "Chone",
  provincia_id: mapaProvincias.get("Manabí")!,
},

{
  nombre: "El Carmen",
  provincia_id: mapaProvincias.get("Manabí")!,
},

{
  nombre: "Flavio Alfaro",
  provincia_id: mapaProvincias.get("Manabí")!,
},

{
  nombre: "Jama",
  provincia_id: mapaProvincias.get("Manabí")!,
},

{
  nombre: "Jaramijó",
  provincia_id: mapaProvincias.get("Manabí")!,
},

{
  nombre: "Jipijapa",
  provincia_id: mapaProvincias.get("Manabí")!,
},

{
  nombre: "Junín",
  provincia_id: mapaProvincias.get("Manabí")!,
},

{
  nombre: "Manta",
  provincia_id: mapaProvincias.get("Manabí")!,
},

{
  nombre: "Montecristi",
  provincia_id: mapaProvincias.get("Manabí")!,
},

{
  nombre: "Olmedo",
  provincia_id: mapaProvincias.get("Manabí")!,
},

{
  nombre: "Paján",
  provincia_id: mapaProvincias.get("Manabí")!,
},

{
  nombre: "Pedernales",
  provincia_id: mapaProvincias.get("Manabí")!,
},

{
  nombre: "Pichincha",
  provincia_id: mapaProvincias.get("Manabí")!,
},

{
  nombre: "Puerto López",
  provincia_id: mapaProvincias.get("Manabí")!,
},

{
  nombre: "Rocafuerte",
  provincia_id: mapaProvincias.get("Manabí")!,
},

{
  nombre: "San Vicente",
  provincia_id: mapaProvincias.get("Manabí")!,
},

{
  nombre: "Santa Ana",
  provincia_id: mapaProvincias.get("Manabí")!,
},

{
  nombre: "Sucre",
  provincia_id: mapaProvincias.get("Manabí")!,
},

{
  nombre: "Tosagua",
  provincia_id: mapaProvincias.get("Manabí")!,
},


    // ===========================
// MORONA SANTIAGO
// ===========================

{
  nombre: "Morona",
  provincia_id: mapaProvincias.get("Morona Santiago")!,
},

{
  nombre: "Gualaquiza",
  provincia_id: mapaProvincias.get("Morona Santiago")!,
},

{
  nombre: "Huamboya",
  provincia_id: mapaProvincias.get("Morona Santiago")!,
},

{
  nombre: "Limón Indanza",
  provincia_id: mapaProvincias.get("Morona Santiago")!,
},

{
  nombre: "Logroño",
  provincia_id: mapaProvincias.get("Morona Santiago")!,
},

{
  nombre: "Pablo Sexto",
  provincia_id: mapaProvincias.get("Morona Santiago")!,
},

{
  nombre: "Palora",
  provincia_id: mapaProvincias.get("Morona Santiago")!,
},

{
  nombre: "San Juan Bosco",
  provincia_id: mapaProvincias.get("Morona Santiago")!,
},

{
  nombre: "Santiago",
  provincia_id: mapaProvincias.get("Morona Santiago")!,
},

{
  nombre: "Sucúa",
  provincia_id: mapaProvincias.get("Morona Santiago")!,
},

{
  nombre: "Taisha",
  provincia_id: mapaProvincias.get("Morona Santiago")!,
},

{
  nombre: "Tiwintza",
  provincia_id: mapaProvincias.get("Morona Santiago")!,
},


    // ===========================
// NAPO
// ===========================

{
  nombre: "Tena",
  provincia_id: mapaProvincias.get("Napo")!,
},

{
  nombre: "Archidona",
  provincia_id: mapaProvincias.get("Napo")!,
},

{
  nombre: "Carlos Julio Arosemena Tola",
  provincia_id: mapaProvincias.get("Napo")!,
},

{
  nombre: "El Chaco",
  provincia_id: mapaProvincias.get("Napo")!,
},

{
  nombre: "Quijos",
  provincia_id: mapaProvincias.get("Napo")!,
},



    // ===========================
// ORELLANA
// ===========================

{
  nombre: "Francisco de Orellana",
  provincia_id: mapaProvincias.get("Orellana")!,
},

{
  nombre: "Aguarico",
  provincia_id: mapaProvincias.get("Orellana")!,
},

{
  nombre: "La Joya de los Sachas",
  provincia_id: mapaProvincias.get("Orellana")!,
},

{
  nombre: "Loreto",
  provincia_id: mapaProvincias.get("Orellana")!,
},



    // ===========================
// PASTAZA
// ===========================

{
  nombre: "Pastaza",
  provincia_id: mapaProvincias.get("Pastaza")!,
},

{
  nombre: "Arajuno",
  provincia_id: mapaProvincias.get("Pastaza")!,
},

{
  nombre: "Mera",
  provincia_id: mapaProvincias.get("Pastaza")!,
},

{
  nombre: "Santa Clara",
  provincia_id: mapaProvincias.get("Pastaza")!,
},



    // ===========================
// PICHINCHA
// ===========================

{
  nombre: "Quito",
  provincia_id: mapaProvincias.get("Pichincha")!,
},

{
  nombre: "Cayambe",
  provincia_id: mapaProvincias.get("Pichincha")!,
},

{
  nombre: "Mejía",
  provincia_id: mapaProvincias.get("Pichincha")!,
},

{
  nombre: "Pedro Moncayo",
  provincia_id: mapaProvincias.get("Pichincha")!,
},

{
  nombre: "Pedro Vicente Maldonado",
  provincia_id: mapaProvincias.get("Pichincha")!,
},

{
  nombre: "Puerto Quito",
  provincia_id: mapaProvincias.get("Pichincha")!,
},

{
  nombre: "Rumiñahui",
  provincia_id: mapaProvincias.get("Pichincha")!,
},

{
  nombre: "San Miguel de los Bancos",
  provincia_id: mapaProvincias.get("Pichincha")!,
},



    // ===========================
// SANTA ELENA
// ===========================

{
  nombre: "Santa Elena",
  provincia_id: mapaProvincias.get("Santa Elena")!,
},

{
  nombre: "La Libertad",
  provincia_id: mapaProvincias.get("Santa Elena")!,
},

{
  nombre: "Salinas",
  provincia_id: mapaProvincias.get("Santa Elena")!,
},



    // ===========================
// SANTO DOMINGO DE LOS TSÁCHILAS
// ===========================

{
  nombre: "Santo Domingo",
  provincia_id: mapaProvincias.get("Santo Domingo de los Tsáchilas")!,
},

{
  nombre: "La Concordia",
  provincia_id: mapaProvincias.get("Santo Domingo de los Tsáchilas")!,
},


// ===========================
// SUCUMBÍOS
// ===========================

{
  nombre: "Lago Agrio",
  provincia_id: mapaProvincias.get("Sucumbíos")!,
},

{
  nombre: "Cascales",
  provincia_id: mapaProvincias.get("Sucumbíos")!,
},

{
  nombre: "Cuyabeno",
  provincia_id: mapaProvincias.get("Sucumbíos")!,
},

{
  nombre: "Gonzalo Pizarro",
  provincia_id: mapaProvincias.get("Sucumbíos")!,
},

{
  nombre: "Putumayo",
  provincia_id: mapaProvincias.get("Sucumbíos")!,
},

{
  nombre: "Shushufindi",
  provincia_id: mapaProvincias.get("Sucumbíos")!,
},

{
  nombre: "Sucumbíos",
  provincia_id: mapaProvincias.get("Sucumbíos")!,
},



   // ===========================
// TUNGURAHUA
// ===========================

{
  nombre: "Ambato",
  provincia_id: mapaProvincias.get("Tungurahua")!,
},

{
  nombre: "Baños de Agua Santa",
  provincia_id: mapaProvincias.get("Tungurahua")!,
},

{
  nombre: "Cevallos",
  provincia_id: mapaProvincias.get("Tungurahua")!,
},

{
  nombre: "Mocha",
  provincia_id: mapaProvincias.get("Tungurahua")!,
},

{
  nombre: "Patate",
  provincia_id: mapaProvincias.get("Tungurahua")!,
},

{
  nombre: "Pelileo",
  provincia_id: mapaProvincias.get("Tungurahua")!,
},

{
  nombre: "Píllaro",
  provincia_id: mapaProvincias.get("Tungurahua")!,
},

{
  nombre: "Quero",
  provincia_id: mapaProvincias.get("Tungurahua")!,
},

{
  nombre: "Tisaleo",
  provincia_id: mapaProvincias.get("Tungurahua")!,
},



    // ===========================
// ZAMORA CHINCHIPE
// ===========================

{
  nombre: "Zamora",
  provincia_id: mapaProvincias.get("Zamora Chinchipe")!,
},

{
  nombre: "Centinela del Cóndor",
  provincia_id: mapaProvincias.get("Zamora Chinchipe")!,
},

{
  nombre: "Chinchipe",
  provincia_id: mapaProvincias.get("Zamora Chinchipe")!,
},

{
  nombre: "El Pangui",
  provincia_id: mapaProvincias.get("Zamora Chinchipe")!,
},

{
  nombre: "Nangaritza",
  provincia_id: mapaProvincias.get("Zamora Chinchipe")!,
},

{
  nombre: "Palanda",
  provincia_id: mapaProvincias.get("Zamora Chinchipe")!,
},

{
  nombre: "Paquisha",
  provincia_id: mapaProvincias.get("Zamora Chinchipe")!,
},

{
  nombre: "Yacuambi",
  provincia_id: mapaProvincias.get("Zamora Chinchipe")!,
},

{
  nombre: "Yantzaza",
  provincia_id: mapaProvincias.get("Zamora Chinchipe")!,
},

  ];

  await prisma.ciudades.createMany({
    data: ciudades,
    skipDuplicates: true,
  });

  console.log(`✅ ${ciudades.length} ciudades cargadas.`);
}