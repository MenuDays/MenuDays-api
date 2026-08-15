import { PrismaClient, Prisma } from '@prisma/client';
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
  latitud: new Prisma.Decimal("-2.8953"),
  longitud: new Prisma.Decimal("-78.9963"),
  provincia_id: mapaProvincias.get("Azuay")!,

},

{
  nombre: "Camilo Ponce Enríquez",
  latitud: new Prisma.Decimal("-3.06199"),
  longitud: new Prisma.Decimal("-79.74583"),
  provincia_id: mapaProvincias.get("Azuay")!,

},

{
  nombre: "Chordeleg",
  latitud: new Prisma.Decimal("-2.92285"),
  longitud: new Prisma.Decimal("-78.77533"),
  provincia_id: mapaProvincias.get("Azuay")!,

},

{
  nombre: "El Pan",
  latitud: new Prisma.Decimal("-2.78779"),
  longitud: new Prisma.Decimal("-78.66956"),
  provincia_id: mapaProvincias.get("Azuay")!,

},

{
  nombre: "Girón",
  latitud: new Prisma.Decimal("-3.16042"),
  longitud: new Prisma.Decimal("-79.14752"),
  provincia_id: mapaProvincias.get("Azuay")!,

},

{
  nombre: "Guachapala",
  latitud: new Prisma.Decimal("-2.77246"),
  longitud: new Prisma.Decimal("-78.71252"),
  provincia_id: mapaProvincias.get("Azuay")!,

},

{
  nombre: "Gualaceo",
  latitud: new Prisma.Decimal("-2.89418"),
  longitud: new Prisma.Decimal("-78.77907"),
  provincia_id: mapaProvincias.get("Azuay")!,

},

{
  nombre: "Nabón",
  latitud: new Prisma.Decimal("-3.33875"),
  longitud: new Prisma.Decimal("-79.06572"),
  provincia_id: mapaProvincias.get("Azuay")!,

},

{
  nombre: "Oña",
  latitud: new Prisma.Decimal("-3.469817"),
  longitud: new Prisma.Decimal("-79.154306"),
  provincia_id: mapaProvincias.get("Azuay")!,
},

{
  nombre: "Paute",
  latitud: new Prisma.Decimal("-2.77957"),
  longitud: new Prisma.Decimal("-78.76155"),
  provincia_id: mapaProvincias.get("Azuay")!,

},

{
  nombre: "Pucará",
  latitud: new Prisma.Decimal("-3.2157"),
  longitud: new Prisma.Decimal("-79.4688"),
  provincia_id: mapaProvincias.get("Azuay")!,

},

{
  nombre: "San Fernando",
  latitud: new Prisma.Decimal("-3.14733"),
  longitud: new Prisma.Decimal("-79.25201"),
  provincia_id: mapaProvincias.get("Azuay")!,

},

{
  nombre: "Santa Isabel",
  latitud: new Prisma.Decimal("-3.27471"),
  longitud: new Prisma.Decimal("-79.31475"),
  provincia_id: mapaProvincias.get("Azuay")!,

},

{
  nombre: "Sevilla de Oro",
  latitud: new Prisma.Decimal("-2.80279"),
  longitud: new Prisma.Decimal("-78.65403"),
  provincia_id: mapaProvincias.get("Azuay")!,

},

{
  nombre: "Sígsig",
  latitud: new Prisma.Decimal("-3.052590"),
  longitud: new Prisma.Decimal("-78.793590"),
  provincia_id: mapaProvincias.get("Azuay")!,
},



    // ===========================
// BOLÍVAR
// ===========================

{
  nombre: "Guaranda",
  latitud: new Prisma.Decimal("-1.59106"),
  longitud: new Prisma.Decimal("-78.99903"),
  provincia_id: mapaProvincias.get("Bolívar")!,

},

{
  nombre: "Caluma",
  latitud: new Prisma.Decimal("-1.63085"),
  longitud: new Prisma.Decimal("-79.25729"),
  provincia_id: mapaProvincias.get("Bolívar")!,

},

{
  nombre: "Chillanes",
  latitud: new Prisma.Decimal("-1.9429"),
  longitud: new Prisma.Decimal("-79.06646"),
  provincia_id: mapaProvincias.get("Bolívar")!,

},

{
  nombre: "Chimbo",
  latitud: new Prisma.Decimal("-1.68338"),
  longitud: new Prisma.Decimal("-79.02576"),
  provincia_id: mapaProvincias.get("Bolívar")!,
},

{
  nombre: "Echeandía",
  latitud: new Prisma.Decimal("-1.43208"),
  longitud: new Prisma.Decimal("-79.28018"),
  provincia_id: mapaProvincias.get("Bolívar")!,

},

{
  nombre: "Las Naves",
  latitud: new Prisma.Decimal("-1.28584"),
  longitud: new Prisma.Decimal("-79.31473"),
  provincia_id: mapaProvincias.get("Bolívar")!,

},

{
  nombre: "San Miguel",
  latitud: new Prisma.Decimal("-1.04559"),
  longitud: new Prisma.Decimal("-78.59019"),
  provincia_id: mapaProvincias.get("Bolívar")!,

},


    // ===========================
// CAÑAR
// ===========================

{
  nombre: "Azogues",
  latitud: new Prisma.Decimal("-2.73982"),
  longitud: new Prisma.Decimal("-78.84561"),
  provincia_id: mapaProvincias.get("Cañar")!,

},

{
  nombre: "Biblián",
  latitud: new Prisma.Decimal("-2.71343"),
  longitud: new Prisma.Decimal("-78.88976"),
  provincia_id: mapaProvincias.get("Cañar")!,

},

{
  nombre: "Cañar",
  latitud: new Prisma.Decimal("-2.55941"),
  longitud: new Prisma.Decimal("-78.93808"),
  provincia_id: mapaProvincias.get("Cañar")!,

},

{
  nombre: "Déleg",
  latitud: new Prisma.Decimal("-2.7725"),
  longitud: new Prisma.Decimal("-78.91913"),
  provincia_id: mapaProvincias.get("Cañar")!,

},

{
  nombre: "El Tambo",
  latitud: new Prisma.Decimal("0.499"),
  longitud: new Prisma.Decimal("-77.99145"),
  provincia_id: mapaProvincias.get("Cañar")!,

},

{
  nombre: "La Troncal",
  latitud: new Prisma.Decimal("-2.42466"),
  longitud: new Prisma.Decimal("-79.34159"),
  provincia_id: mapaProvincias.get("Cañar")!,

},

{
  nombre: "Suscal",
  latitud: new Prisma.Decimal("-2.43728"),
  longitud: new Prisma.Decimal("-79.05172"),
  provincia_id: mapaProvincias.get("Cañar")!,

},


    // ===========================
// CARCHI
// ===========================

{
  nombre: "Tulcán",
  latitud: new Prisma.Decimal("0.8124"),
  longitud: new Prisma.Decimal("-77.71709"),
  provincia_id: mapaProvincias.get("Carchi")!,

},

{
  nombre: "Bolívar",
  latitud: new Prisma.Decimal("0.44604"),
  longitud: new Prisma.Decimal("-80.04376"),
  provincia_id: mapaProvincias.get("Carchi")!,

},

{
  nombre: "Espejo",
  latitud: new Prisma.Decimal("0.62279"),
  longitud: new Prisma.Decimal("-77.94068"),
  provincia_id: mapaProvincias.get("Carchi")!,
},

{
  nombre: "Mira",
  latitud: new Prisma.Decimal("0.55069"),
  longitud: new Prisma.Decimal("-78.04034"),
  provincia_id: mapaProvincias.get("Carchi")!,

},

{
  nombre: "Montúfar",
  latitud: new Prisma.Decimal("0.59691"),
  longitud: new Prisma.Decimal("-77.84016"),
  provincia_id: mapaProvincias.get("Carchi")!,
},

{
  nombre: "San Pedro de Huaca",
  latitud: new Prisma.Decimal("0.60582"),
  longitud: new Prisma.Decimal("-77.72882"),
  provincia_id: mapaProvincias.get("Carchi")!,
},



    // ===========================
// CHIMBORAZO
// ===========================

{
  nombre: "Riobamba",
  latitud: new Prisma.Decimal("-1.66506"),
  longitud: new Prisma.Decimal("-78.65887"),
  provincia_id: mapaProvincias.get("Chimborazo")!,

},

{
  nombre: "Alausí",
  latitud: new Prisma.Decimal("-2.20128"),
  longitud: new Prisma.Decimal("-78.84781"),
  provincia_id: mapaProvincias.get("Chimborazo")!,

},

{
  nombre: "Chambo",
  latitud: new Prisma.Decimal("-1.73101"),
  longitud: new Prisma.Decimal("-78.59672"),
  provincia_id: mapaProvincias.get("Chimborazo")!,

},

{
  nombre: "Chunchi",
  latitud: new Prisma.Decimal("-2.28971"),
  longitud: new Prisma.Decimal("-78.91987"),
  provincia_id: mapaProvincias.get("Chimborazo")!,

},

{
  nombre: "Colta",
  latitud: new Prisma.Decimal("-1.74034"),
  longitud: new Prisma.Decimal("-78.75343"),
  provincia_id: mapaProvincias.get("Chimborazo")!,
},

{
  nombre: "Cumandá",
  latitud: new Prisma.Decimal("-2.20497"),
  longitud: new Prisma.Decimal("-79.1358"),
  provincia_id: mapaProvincias.get("Chimborazo")!,

},

{
  nombre: "Guamote",
  latitud: new Prisma.Decimal("-1.93499"),
  longitud: new Prisma.Decimal("-78.71043"),
  provincia_id: mapaProvincias.get("Chimborazo")!,

},

{
  nombre: "Guano",
  latitud: new Prisma.Decimal("-1.60689"),
  longitud: new Prisma.Decimal("-78.63726"),
  provincia_id: mapaProvincias.get("Chimborazo")!,

},

{
  nombre: "Pallatanga",
  latitud: new Prisma.Decimal("-1.99856"),
  longitud: new Prisma.Decimal("-78.96629"),
  provincia_id: mapaProvincias.get("Chimborazo")!,

},

{
  nombre: "Penipe",
  latitud: new Prisma.Decimal("-1.56592"),
  longitud: new Prisma.Decimal("-78.53159"),
  provincia_id: mapaProvincias.get("Chimborazo")!,

},



    // ===========================
// COTOPAXI
// ===========================

{
  nombre: "Latacunga",
  latitud: new Prisma.Decimal("-0.93424"),
  longitud: new Prisma.Decimal("-78.6152"),
  provincia_id: mapaProvincias.get("Cotopaxi")!,

},

{
  nombre: "La Maná",
  latitud: new Prisma.Decimal("-0.94096"),
  longitud: new Prisma.Decimal("-79.22655"),
  provincia_id: mapaProvincias.get("Cotopaxi")!,

},

{
  nombre: "Pangua",
  latitud: new Prisma.Decimal("-1.1388"),
  longitud: new Prisma.Decimal("-79.05463"),
  provincia_id: mapaProvincias.get("Cotopaxi")!,

},

{
  nombre: "Pujilí",
  latitud: new Prisma.Decimal("-0.95759"),
  longitud: new Prisma.Decimal("-78.69636"),
  provincia_id: mapaProvincias.get("Cotopaxi")!,

},

{
  nombre: "Salcedo",
  latitud: new Prisma.Decimal("-1.04347"),
  longitud: new Prisma.Decimal("-78.59063"),
  provincia_id: mapaProvincias.get("Cotopaxi")!,
},

{
  nombre: "Saquisilí",
  latitud: new Prisma.Decimal("-0.8399"),
  longitud: new Prisma.Decimal("-78.667"),
  provincia_id: mapaProvincias.get("Cotopaxi")!,

},

{
  nombre: "Sigchos",
  latitud: new Prisma.Decimal("-0.7047"),
  longitud: new Prisma.Decimal("-78.88868"),
  provincia_id: mapaProvincias.get("Cotopaxi")!,

},


// ===========================
// EL ORO
// ===========================

{
  nombre: "Machala",
  latitud: new Prisma.Decimal("-3.25886"),
  longitud: new Prisma.Decimal("-79.95876"),
  provincia_id: mapaProvincias.get("El Oro")!,

},

{
  nombre: "Arenillas",
  latitud: new Prisma.Decimal("-3.55399"),
  longitud: new Prisma.Decimal("-80.06682"),
  provincia_id: mapaProvincias.get("El Oro")!,

},

{
  nombre: "Atahualpa",
  latitud: new Prisma.Decimal("-2.31277"),
  longitud: new Prisma.Decimal("-80.77316"),
  provincia_id: mapaProvincias.get("El Oro")!,

},

{
  nombre: "Balsas",
  latitud: new Prisma.Decimal("-3.76146"),
  longitud: new Prisma.Decimal("-79.82422"),
  provincia_id: mapaProvincias.get("El Oro")!,

},

{
  nombre: "Chilla",
  latitud: new Prisma.Decimal("-3.4581"),
  longitud: new Prisma.Decimal("-79.58122"),
  provincia_id: mapaProvincias.get("El Oro")!,

},

{
  nombre: "El Guabo",
  latitud: new Prisma.Decimal("-4.19192"),
  longitud: new Prisma.Decimal("-80.19309"),
  provincia_id: mapaProvincias.get("El Oro")!,

},

{
  nombre: "Huaquillas",
  latitud: new Prisma.Decimal("-3.47523"),
  longitud: new Prisma.Decimal("-80.23084"),
  provincia_id: mapaProvincias.get("El Oro")!,

},

{
  nombre: "Las Lajas",
  latitud: new Prisma.Decimal("-4.18333"),
  longitud: new Prisma.Decimal("-80.15"),
  provincia_id: mapaProvincias.get("El Oro")!,

},

{
  nombre: "Marcabelí",
  latitud: new Prisma.Decimal("-3.7839"),
  longitud: new Prisma.Decimal("-79.91227"),
  provincia_id: mapaProvincias.get("El Oro")!,

},

{
  nombre: "Pasaje",
  latitud: new Prisma.Decimal("-3.32561"),
  longitud: new Prisma.Decimal("-79.80697"),
  provincia_id: mapaProvincias.get("El Oro")!,

},

{
  nombre: "Piñas",
  latitud: new Prisma.Decimal("-3.68017"),
  longitud: new Prisma.Decimal("-79.68169"),
  provincia_id: mapaProvincias.get("El Oro")!,

},

{
  nombre: "Portovelo",
  latitud: new Prisma.Decimal("-3.71601"),
  longitud: new Prisma.Decimal("-79.61893"),
  provincia_id: mapaProvincias.get("El Oro")!,

},

{
  nombre: "Santa Rosa",
  latitud: new Prisma.Decimal("-0.30952"),
  longitud: new Prisma.Decimal("-77.78614"),
  provincia_id: mapaProvincias.get("El Oro")!,

},

{
  nombre: "Zaruma",
  latitud: new Prisma.Decimal("-3.69227"),
  longitud: new Prisma.Decimal("-79.61254"),
  provincia_id: mapaProvincias.get("El Oro")!,

},


    // ===========================
// ESMERALDAS
// ===========================

{
  nombre: "Esmeraldas",
  latitud: new Prisma.Decimal("-3.33333"),
  longitud: new Prisma.Decimal("-79.4"),
  provincia_id: mapaProvincias.get("Esmeraldas")!,

},

{
  nombre: "Atacames",
  latitud: new Prisma.Decimal("0.86903"),
  longitud: new Prisma.Decimal("-79.84806"),
  provincia_id: mapaProvincias.get("Esmeraldas")!,

},

{
  nombre: "Eloy Alfaro",
  latitud: new Prisma.Decimal("-2.16919"),
  longitud: new Prisma.Decimal("-79.83987"),
  provincia_id: mapaProvincias.get("Esmeraldas")!,

},

{
  nombre: "Muisne",
  latitud: new Prisma.Decimal("0.61045"),
  longitud: new Prisma.Decimal("-80.0186"),
  provincia_id: mapaProvincias.get("Esmeraldas")!,

},

{
  nombre: "Quinindé",
  latitud: new Prisma.Decimal("0.32779"),
  longitud: new Prisma.Decimal("-79.46583"),
  provincia_id: mapaProvincias.get("Esmeraldas")!,
},

{
  nombre: "Rioverde",
  latitud: new Prisma.Decimal("1.06235"),
  longitud: new Prisma.Decimal("-79.39945"),
  provincia_id: mapaProvincias.get("Esmeraldas")!,
},

{
  nombre: "San Lorenzo",
  latitud: new Prisma.Decimal("-2.53681"),
  longitud: new Prisma.Decimal("-79.77743"),
  provincia_id: mapaProvincias.get("Esmeraldas")!,

},



    // ===========================
// GALÁPAGOS
// ===========================

{
  nombre: "San Cristóbal",
  latitud: new Prisma.Decimal("-2.82913"),
  longitud: new Prisma.Decimal("-78.83869"),
  provincia_id: mapaProvincias.get("Galápagos")!,

},

{
  nombre: "Isabela",
  latitud: new Prisma.Decimal("-0.95542"),
  longitud: new Prisma.Decimal("-90.96654"),
  provincia_id: mapaProvincias.get("Galápagos")!,
},

{
  nombre: "Santa Cruz",
  latitud: new Prisma.Decimal("-1.24812"),
  longitud: new Prisma.Decimal("-78.55382"),
  provincia_id: mapaProvincias.get("Galápagos")!,

},



    // ===========================
// GUAYAS
// ===========================

{
  nombre: "Guayaquil",
  latitud: new Prisma.Decimal("-2.19616"),
  longitud: new Prisma.Decimal("-79.88621"),
  provincia_id: mapaProvincias.get("Guayas")!,

},

{
  nombre: "Alfredo Baquerizo Moreno (Jujan)",
  latitud: new Prisma.Decimal("-1.56121"),
  longitud: new Prisma.Decimal("-79.53361"),
  provincia_id: mapaProvincias.get("Guayas")!,
},

{
  nombre: "Balao",
  latitud: new Prisma.Decimal("-2.9106"),
  longitud: new Prisma.Decimal("-79.81505"),
  provincia_id: mapaProvincias.get("Guayas")!,

},

{
  nombre: "Balzar",
  latitud: new Prisma.Decimal("-1.36553"),
  longitud: new Prisma.Decimal("-79.90507"),
  provincia_id: mapaProvincias.get("Guayas")!,

},

{
  nombre: "Colimes",
  latitud: new Prisma.Decimal("-1.54566"),
  longitud: new Prisma.Decimal("-80.01158"),
  provincia_id: mapaProvincias.get("Guayas")!,

},

{
  nombre: "Daule",
  latitud: new Prisma.Decimal("-1.86032"),
  longitud: new Prisma.Decimal("-79.97683"),
  provincia_id: mapaProvincias.get("Guayas")!,

},

{
  nombre: "Durán",
  latitud: new Prisma.Decimal("-2.17452"),
  longitud: new Prisma.Decimal("-79.83195"),
  provincia_id: mapaProvincias.get("Guayas")!,
},

{
  nombre: "El Empalme",
  latitud: new Prisma.Decimal("-1.04491"),
  longitud: new Prisma.Decimal("-79.6384"),
  provincia_id: mapaProvincias.get("Guayas")!,

},

{
  nombre: "El Triunfo",
  latitud: new Prisma.Decimal("-2.31667"),
  longitud: new Prisma.Decimal("-80.4"),
  provincia_id: mapaProvincias.get("Guayas")!,

},

{
  nombre: "General Antonio Elizalde (Bucay)",
  latitud: new Prisma.Decimal("-2.22369"),
  longitud: new Prisma.Decimal("-79.14277"),
  provincia_id: mapaProvincias.get("Guayas")!,
},

{
  nombre: "Isidro Ayora",
  latitud: new Prisma.Decimal("-1.88048"),
  longitud: new Prisma.Decimal("-80.14509"),
  provincia_id: mapaProvincias.get("Guayas")!,

},

{
  nombre: "Lomas de Sargentillo",
  latitud: new Prisma.Decimal("-1.88082"),
  longitud: new Prisma.Decimal("-80.08354"),
  provincia_id: mapaProvincias.get("Guayas")!,

},

{
  nombre: "Marcelino Maridueña",
  latitud: new Prisma.Decimal("-2.20917"),
  longitud: new Prisma.Decimal("-79.43278"),
  provincia_id: mapaProvincias.get("Guayas")!,
},
{
  nombre: "Milagro",
  latitud: new Prisma.Decimal("-3.27854"),
  longitud: new Prisma.Decimal("-78.63428"),
  provincia_id: mapaProvincias.get("Guayas")!,

},

{
  nombre: "Naranjal",
  latitud: new Prisma.Decimal("-2.67638"),
  longitud: new Prisma.Decimal("-79.61735"),
  provincia_id: mapaProvincias.get("Guayas")!,

},

{
  nombre: "Naranjito",
  latitud: new Prisma.Decimal("-2.17071"),
  longitud: new Prisma.Decimal("-79.465"),
  provincia_id: mapaProvincias.get("Guayas")!,

},

{
  nombre: "Nobol",
  latitud: new Prisma.Decimal("-1.91667"),
  longitud: new Prisma.Decimal("-80.01667"),
  provincia_id: mapaProvincias.get("Guayas")!,

},

{
  nombre: "Palestina",
  latitud: new Prisma.Decimal("-3.66501"),
  longitud: new Prisma.Decimal("-79.59631"),
  provincia_id: mapaProvincias.get("Guayas")!,

},

{
  nombre: "Pedro Carbo",
  latitud: new Prisma.Decimal("-1.81619"),
  longitud: new Prisma.Decimal("-80.23431"),
  provincia_id: mapaProvincias.get("Guayas")!,

},

{
  nombre: "Playas",
  latitud: new Prisma.Decimal("-2.63199"),
  longitud: new Prisma.Decimal("-80.38808"),
  provincia_id: mapaProvincias.get("Guayas")!,

},

{
  nombre: "Salitre",
  latitud: new Prisma.Decimal("-1.81766"),
  longitud: new Prisma.Decimal("-79.81647"),
  provincia_id: mapaProvincias.get("Guayas")!,
},

{
  nombre: "Samborondón",
  latitud: new Prisma.Decimal("-1.96071"),
  longitud: new Prisma.Decimal("-79.72566"),
  provincia_id: mapaProvincias.get("Guayas")!,

},

{
  nombre: "Santa Lucía",
  latitud: new Prisma.Decimal("-4.11667"),
  longitud: new Prisma.Decimal("-79.2"),
  provincia_id: mapaProvincias.get("Guayas")!,

},

{
  nombre: "Simón Bolívar",
  latitud: new Prisma.Decimal("-2.24015"),
  longitud: new Prisma.Decimal("-79.60878"),
  provincia_id: mapaProvincias.get("Guayas")!,

},

{
  nombre: "Yaguachi",
  latitud: new Prisma.Decimal("-3.84982"),
  longitud: new Prisma.Decimal("-79.612"),
  provincia_id: mapaProvincias.get("Guayas")!,

},


    // ===========================
// IMBABURA
// ===========================

{
  nombre: "Ibarra",
  latitud: new Prisma.Decimal("0.34881"),
  longitud: new Prisma.Decimal("-78.12462"),
  provincia_id: mapaProvincias.get("Imbabura")!,

},

{
  nombre: "Antonio Ante",
  latitud: new Prisma.Decimal("0.33247"),
  longitud: new Prisma.Decimal("-78.21371"),
  provincia_id: mapaProvincias.get("Imbabura")!,
},

{
  nombre: "Cotacachi",
  latitud: new Prisma.Decimal("0.29947"),
  longitud: new Prisma.Decimal("-78.26565"),
  provincia_id: mapaProvincias.get("Imbabura")!,

},

{
  nombre: "Otavalo",
  latitud: new Prisma.Decimal("0.23457"),
  longitud: new Prisma.Decimal("-78.26248"),
  provincia_id: mapaProvincias.get("Imbabura")!,

},

{
  nombre: "Pimampiro",
  latitud: new Prisma.Decimal("0.39093"),
  longitud: new Prisma.Decimal("-77.94094"),
  provincia_id: mapaProvincias.get("Imbabura")!,

},

{
  nombre: "San Miguel de Urcuquí",
  latitud: new Prisma.Decimal("0.39973"),
  longitud: new Prisma.Decimal("-78.19695"),
  provincia_id: mapaProvincias.get("Imbabura")!,
},

// ===========================
// LOJA
// ===========================

{
  nombre: "Loja",
  latitud: new Prisma.Decimal("-3.99313"),
  longitud: new Prisma.Decimal("-79.20422"),
  provincia_id: mapaProvincias.get("Loja")!,

},

{
  nombre: "Calvas",
  latitud: new Prisma.Decimal("0.11518"),
  longitud: new Prisma.Decimal("-78.99069"),
  provincia_id: mapaProvincias.get("Loja")!,

},

{
  nombre: "Catamayo",
  latitud: new Prisma.Decimal("-3.98661"),
  longitud: new Prisma.Decimal("-79.35763"),
  provincia_id: mapaProvincias.get("Loja")!,

},

{
  nombre: "Celica",
  latitud: new Prisma.Decimal("-4.10304"),
  longitud: new Prisma.Decimal("-79.95598"),
  provincia_id: mapaProvincias.get("Loja")!,

},

{
  nombre: "Chaguarpamba",
  latitud: new Prisma.Decimal("-3.87776"),
  longitud: new Prisma.Decimal("-79.64455"),
  provincia_id: mapaProvincias.get("Loja")!,

},

{
  nombre: "Espíndola",
  latitud: new Prisma.Decimal("-4.29759"),
  longitud: new Prisma.Decimal("-79.42684"),
  provincia_id: mapaProvincias.get("Loja")!,
},

{
  nombre: "Gonzanamá",
  latitud: new Prisma.Decimal("-4.23081"),
  longitud: new Prisma.Decimal("-79.43545"),
  provincia_id: mapaProvincias.get("Loja")!,

},

{
  nombre: "Macará",
  latitud: new Prisma.Decimal("-4.38184"),
  longitud: new Prisma.Decimal("-79.94521"),
  provincia_id: mapaProvincias.get("Loja")!,

},

{
  nombre: "Olmedo",
  latitud: new Prisma.Decimal("-3.93435"),
  longitud: new Prisma.Decimal("-79.64646"),
  provincia_id: mapaProvincias.get("Loja")!,

},

{
  nombre: "Paltas",
  latitud: new Prisma.Decimal("-3.21667"),
  longitud: new Prisma.Decimal("-79.18333"),
  provincia_id: mapaProvincias.get("Loja")!,

},

{
  nombre: "Pindal",
  latitud: new Prisma.Decimal("-4.1143"),
  longitud: new Prisma.Decimal("-80.10679"),
  provincia_id: mapaProvincias.get("Loja")!,

},

{
  nombre: "Puyango",
  latitud: new Prisma.Decimal("-3.88191"),
  longitud: new Prisma.Decimal("-80.08022"),
  provincia_id: mapaProvincias.get("Loja")!,

},

{
  nombre: "Quilanga",
  latitud: new Prisma.Decimal("-4.29656"),
  longitud: new Prisma.Decimal("-79.40227"),
  provincia_id: mapaProvincias.get("Loja")!,

},

{
  nombre: "Saraguro",
  latitud: new Prisma.Decimal("-3.62459"),
  longitud: new Prisma.Decimal("-79.23919"),
  provincia_id: mapaProvincias.get("Loja")!,

},

{
  nombre: "Sozoranga",
  latitud: new Prisma.Decimal("-4.32767"),
  longitud: new Prisma.Decimal("-79.79082"),
  provincia_id: mapaProvincias.get("Loja")!,

},

{
  nombre: "Zapotillo",
  latitud: new Prisma.Decimal("-4.38745"),
  longitud: new Prisma.Decimal("-80.24411"),
  provincia_id: mapaProvincias.get("Loja")!,

},


// ===========================
// LOS RÍOS
// ===========================

{
  nombre: "Babahoyo",
  latitud: new Prisma.Decimal("-1.80493"),
  longitud: new Prisma.Decimal("-79.52492"),
  provincia_id: mapaProvincias.get("Los Ríos")!,

},

{
  nombre: "Baba",
  latitud: new Prisma.Decimal("-1.78443"),
  longitud: new Prisma.Decimal("-79.6787"),
  provincia_id: mapaProvincias.get("Los Ríos")!,

},

{
  nombre: "Buena Fe",
  latitud: new Prisma.Decimal("-2.26851"),
  longitud: new Prisma.Decimal("-79.60795"),
  provincia_id: mapaProvincias.get("Los Ríos")!,

},

{
  nombre: "Mocache",
  latitud: new Prisma.Decimal("-1.18891"),
  longitud: new Prisma.Decimal("-79.50619"),
  provincia_id: mapaProvincias.get("Los Ríos")!,

},

{
  nombre: "Montalvo",
  latitud: new Prisma.Decimal("-2.26667"),
  longitud: new Prisma.Decimal("-80.65"),
  provincia_id: mapaProvincias.get("Los Ríos")!,

},

{
  nombre: "Palenque",
  latitud: new Prisma.Decimal("-3.37779"),
  longitud: new Prisma.Decimal("-79.7732"),
  provincia_id: mapaProvincias.get("Los Ríos")!,

},

{
  nombre: "Puebloviejo",
  latitud: new Prisma.Decimal("-3.9"),
  longitud: new Prisma.Decimal("-79.41667"),
  provincia_id: mapaProvincias.get("Los Ríos")!,

},

{
  nombre: "Quevedo",
  latitud: new Prisma.Decimal("-1.02881"),
  longitud: new Prisma.Decimal("-79.46264"),
  provincia_id: mapaProvincias.get("Los Ríos")!,

},

{
  nombre: "Quinsaloma",
  latitud: new Prisma.Decimal("-1.20601"),
  longitud: new Prisma.Decimal("-79.31383"),
  provincia_id: mapaProvincias.get("Los Ríos")!,

},

{
  nombre: "Urdaneta",
  latitud: new Prisma.Decimal("-3.60534"),
  longitud: new Prisma.Decimal("-79.21076"),
  provincia_id: mapaProvincias.get("Los Ríos")!,

},

{
  nombre: "Valencia",
  latitud: new Prisma.Decimal("-1.36667"),
  longitud: new Prisma.Decimal("-78.33333"),
  provincia_id: mapaProvincias.get("Los Ríos")!,

},

{
  nombre: "Ventanas",
  latitud: new Prisma.Decimal("-3.43333"),
  longitud: new Prisma.Decimal("-79.58333"),
  provincia_id: mapaProvincias.get("Los Ríos")!,

},

{
  nombre: "Vinces",
  latitud: new Prisma.Decimal("-1.55637"),
  longitud: new Prisma.Decimal("-79.75249"),
  provincia_id: mapaProvincias.get("Los Ríos")!,

},



    // ===========================
// MANABÍ
// ===========================

{
  nombre: "Portoviejo",
  latitud: new Prisma.Decimal("-1.05764"),
  longitud: new Prisma.Decimal("-80.45145"),
  provincia_id: mapaProvincias.get("Manabí")!,

},

{
  nombre: "24 de Mayo",
  latitud: new Prisma.Decimal("-1.31477"),
  longitud: new Prisma.Decimal("-80.41856"),
  provincia_id: mapaProvincias.get("Manabí")!,
},

{
  nombre: "Bolívar",
  latitud: new Prisma.Decimal("0.44604"),
  longitud: new Prisma.Decimal("-80.04376"),
  provincia_id: mapaProvincias.get("Manabí")!,

},

{
  nombre: "Chone",
  latitud: new Prisma.Decimal("-0.6985"),
  longitud: new Prisma.Decimal("-80.0925"),
  provincia_id: mapaProvincias.get("Manabí")!,

},

{
  nombre: "El Carmen",
  latitud: new Prisma.Decimal("-0.11569"),
  longitud: new Prisma.Decimal("-78.44519"),
  provincia_id: mapaProvincias.get("Manabí")!,

},

{
  nombre: "Flavio Alfaro",
  latitud: new Prisma.Decimal("-0.40501"),
  longitud: new Prisma.Decimal("-79.90468"),
  provincia_id: mapaProvincias.get("Manabí")!,

},

{
  nombre: "Jama",
  latitud: new Prisma.Decimal("-0.9"),
  longitud: new Prisma.Decimal("-79.68333"),
  provincia_id: mapaProvincias.get("Manabí")!,

},

{
  nombre: "Jaramijó",
  latitud: new Prisma.Decimal("-0.94886"),
  longitud: new Prisma.Decimal("-80.63806"),
  provincia_id: mapaProvincias.get("Manabí")!,

},

{
  nombre: "Jipijapa",
  latitud: new Prisma.Decimal("-1.34841"),
  longitud: new Prisma.Decimal("-80.57913"),
  provincia_id: mapaProvincias.get("Manabí")!,

},

{
  nombre: "Junín",
  latitud: new Prisma.Decimal("-1.56667"),
  longitud: new Prisma.Decimal("-79.93333"),
  provincia_id: mapaProvincias.get("Manabí")!,

},

{
  nombre: "Manta",
  latitud: new Prisma.Decimal("-0.94937"),
  longitud: new Prisma.Decimal("-80.73137"),
  provincia_id: mapaProvincias.get("Manabí")!,

},

{
  nombre: "Montecristi",
  latitud: new Prisma.Decimal("-1.04576"),
  longitud: new Prisma.Decimal("-80.65889"),
  provincia_id: mapaProvincias.get("Manabí")!,

},

{
  nombre: "Olmedo",
  latitud: new Prisma.Decimal("-3.93435"),
  longitud: new Prisma.Decimal("-79.64646"),
  provincia_id: mapaProvincias.get("Manabí")!,

},

{
  nombre: "Paján",
  latitud: new Prisma.Decimal("-1.55266"),
  longitud: new Prisma.Decimal("-80.42846"),
  provincia_id: mapaProvincias.get("Manabí")!,

},

{
  nombre: "Pedernales",
  latitud: new Prisma.Decimal("0.07168"),
  longitud: new Prisma.Decimal("-80.05216"),
  provincia_id: mapaProvincias.get("Manabí")!,

},

{
  nombre: "Pichincha",
  latitud: new Prisma.Decimal("-4.47"),
  longitud: new Prisma.Decimal("-80.41214"),
  provincia_id: mapaProvincias.get("Manabí")!,

},

{
  nombre: "Puerto López",
  latitud: new Prisma.Decimal("-1.55873"),
  longitud: new Prisma.Decimal("-80.80931"),
  provincia_id: mapaProvincias.get("Manabí")!,

},

{
  nombre: "Rocafuerte",
  latitud: new Prisma.Decimal("-2.17089"),
  longitud: new Prisma.Decimal("-79.33205"),
  provincia_id: mapaProvincias.get("Manabí")!,

},

{
  nombre: "San Vicente",
  latitud: new Prisma.Decimal("-4.38593"),
  longitud: new Prisma.Decimal("-79.68257"),
  provincia_id: mapaProvincias.get("Manabí")!,

},

{
  nombre: "Santa Ana",
  latitud: new Prisma.Decimal("-4.22919"),
  longitud: new Prisma.Decimal("-79.2726"),
  provincia_id: mapaProvincias.get("Manabí")!,

},

{
  nombre: "Sucre",
  latitud: new Prisma.Decimal("-2.37083"),
  longitud: new Prisma.Decimal("-80.46657"),
  provincia_id: mapaProvincias.get("Manabí")!,

},

{
  nombre: "Tosagua",
  latitud: new Prisma.Decimal("-0.78585"),
  longitud: new Prisma.Decimal("-80.2346"),
  provincia_id: mapaProvincias.get("Manabí")!,

},


    // ===========================
// MORONA SANTIAGO
// ===========================

{
  nombre: "Morona",
  latitud: new Prisma.Decimal("-2.88784"),
  longitud: new Prisma.Decimal("-77.69028"),
  provincia_id: mapaProvincias.get("Morona Santiago")!,

},

{
  nombre: "Gualaquiza",
  latitud: new Prisma.Decimal("-3.40352"),
  longitud: new Prisma.Decimal("-78.58148"),
  provincia_id: mapaProvincias.get("Morona Santiago")!,

},

{
  nombre: "Huamboya",
  latitud: new Prisma.Decimal("-1.8"),
  longitud: new Prisma.Decimal("-78.25"),
  provincia_id: mapaProvincias.get("Morona Santiago")!,

},

{
  nombre: "Limón Indanza",
  latitud: new Prisma.Decimal("-3.00086"),
  longitud: new Prisma.Decimal("-78.44974"),
  provincia_id: mapaProvincias.get("Morona Santiago")!,
},

{
  nombre: "Logroño",
  latitud: new Prisma.Decimal("-2.61677"),
  longitud: new Prisma.Decimal("-78.20898"),
  provincia_id: mapaProvincias.get("Morona Santiago")!,

},

{
  nombre: "Pablo Sexto",
  latitud: new Prisma.Decimal("-2.88056"),
  longitud: new Prisma.Decimal("-78.72694"),
  provincia_id: mapaProvincias.get("Morona Santiago")!,
},

{
  nombre: "Palora",
  latitud: new Prisma.Decimal("-1.70087"),
  longitud: new Prisma.Decimal("-77.96609"),
  provincia_id: mapaProvincias.get("Morona Santiago")!,

},

{
  nombre: "San Juan Bosco",
  latitud: new Prisma.Decimal("-3.11905"),
  longitud: new Prisma.Decimal("-78.53089"),
  provincia_id: mapaProvincias.get("Morona Santiago")!,

},

{
  nombre: "Santiago",
  latitud: new Prisma.Decimal("-3.7938"),
  longitud: new Prisma.Decimal("-79.28192"),
  provincia_id: mapaProvincias.get("Morona Santiago")!,

},

{
  nombre: "Sucúa",
  latitud: new Prisma.Decimal("-2.45737"),
  longitud: new Prisma.Decimal("-78.17102"),
  provincia_id: mapaProvincias.get("Morona Santiago")!,

},

{
  nombre: "Taisha",
  latitud: new Prisma.Decimal("-2.33965"),
  longitud: new Prisma.Decimal("-77.46031"),
  provincia_id: mapaProvincias.get("Morona Santiago")!,

},

{
  nombre: "Tiwintza",
  latitud: new Prisma.Decimal("-2.32486"),
  longitud: new Prisma.Decimal("-78.07164"),
  provincia_id: mapaProvincias.get("Morona Santiago")!,
},


    // ===========================
// NAPO
// ===========================

{
  nombre: "Tena",
  latitud: new Prisma.Decimal("-0.9961"),
  longitud: new Prisma.Decimal("-77.81315"),
  provincia_id: mapaProvincias.get("Napo")!,

},

{
  nombre: "Archidona",
  latitud: new Prisma.Decimal("-0.9095"),
  longitud: new Prisma.Decimal("-77.80772"),
  provincia_id: mapaProvincias.get("Napo")!,

},

{
  nombre: "Carlos Julio Arosemena Tola",
  latitud: new Prisma.Decimal("-1.16608"),
  longitud: new Prisma.Decimal("-77.85533"),
  provincia_id: mapaProvincias.get("Napo")!,

},

{
  nombre: "El Chaco",
  latitud: new Prisma.Decimal("-0.33904"),
  longitud: new Prisma.Decimal("-77.81115"),
  provincia_id: mapaProvincias.get("Napo")!,

},

{
  nombre: "Quijos",
  latitud: new Prisma.Decimal("-0.46126"),
  longitud: new Prisma.Decimal("-77.88956"),
  provincia_id: mapaProvincias.get("Napo")!,
},



    // ===========================
// ORELLANA
// ===========================

{
  nombre: "Francisco de Orellana",
  latitud: new Prisma.Decimal("-0.1567"),
  longitud: new Prisma.Decimal("-79.07925"),
  provincia_id: mapaProvincias.get("Orellana")!,

},

{
  nombre: "Aguarico",
  latitud: new Prisma.Decimal("-0.28333"),
  longitud: new Prisma.Decimal("-75.86667"),
  provincia_id: mapaProvincias.get("Orellana")!,

},

{
  nombre: "La Joya de los Sachas",
  latitud: new Prisma.Decimal("-0.29394"),
  longitud: new Prisma.Decimal("-76.85573"),
  provincia_id: mapaProvincias.get("Orellana")!,

},

{
  nombre: "Loreto",
  latitud: new Prisma.Decimal("-0.69243"),
  longitud: new Prisma.Decimal("-77.31115"),
  provincia_id: mapaProvincias.get("Orellana")!,

},



    // ===========================
// PASTAZA
// ===========================

{
  nombre: "Pastaza",
  latitud: new Prisma.Decimal("0.02563"),
  longitud: new Prisma.Decimal("-77.17655"),
  provincia_id: mapaProvincias.get("Pastaza")!,

},

{
  nombre: "Arajuno",
  latitud: new Prisma.Decimal("-1.23302"),
  longitud: new Prisma.Decimal("-77.6875"),
  provincia_id: mapaProvincias.get("Pastaza")!,

},

{
  nombre: "Mera",
  latitud: new Prisma.Decimal("-1.46053"),
  longitud: new Prisma.Decimal("-78.11348"),
  provincia_id: mapaProvincias.get("Pastaza")!,

},

{
  nombre: "Santa Clara",
  latitud: new Prisma.Decimal("-1.76667"),
  longitud: new Prisma.Decimal("-80"),
  provincia_id: mapaProvincias.get("Pastaza")!,

},



    // ===========================
// PICHINCHA
// ===========================

{
  nombre: "Quito",
  latitud: new Prisma.Decimal("-0.22985"),
  longitud: new Prisma.Decimal("-78.52495"),
  provincia_id: mapaProvincias.get("Pichincha")!,

},

{
  nombre: "Cayambe",
  latitud: new Prisma.Decimal("0.04103"),
  longitud: new Prisma.Decimal("-78.14636"),
  provincia_id: mapaProvincias.get("Pichincha")!,

},

{
  nombre: "Mejía",
  latitud: new Prisma.Decimal("-0.51011"),
  longitud: new Prisma.Decimal("-78.56712"),
  provincia_id: mapaProvincias.get("Pichincha")!,
},

{
  nombre: "Pedro Moncayo",
  latitud: new Prisma.Decimal("0.03989"),
  longitud: new Prisma.Decimal("-78.14528"),
  provincia_id: mapaProvincias.get("Pichincha")!,
},

{
  nombre: "Pedro Vicente Maldonado",
  latitud: new Prisma.Decimal("0.08527"),
  longitud: new Prisma.Decimal("-79.05095"),
  provincia_id: mapaProvincias.get("Pichincha")!,

},

{
  nombre: "Puerto Quito",
  latitud: new Prisma.Decimal("0.12783"),
  longitud: new Prisma.Decimal("-79.21261"),
  provincia_id: mapaProvincias.get("Pichincha")!,

},

{
  nombre: "Rumiñahui",
  latitud: new Prisma.Decimal("-0.33405"),
  longitud: new Prisma.Decimal("-78.45217"),
  provincia_id: mapaProvincias.get("Pichincha")!,
},

{
  nombre: "San Miguel de los Bancos",
  latitud: new Prisma.Decimal("0.02882"),
  longitud: new Prisma.Decimal("-78.89449"),
  provincia_id: mapaProvincias.get("Pichincha")!,
},



    // ===========================
// SANTA ELENA
// ===========================

{
  nombre: "Santa Elena",
  latitud: new Prisma.Decimal("-2.22652"),
  longitud: new Prisma.Decimal("-80.85807"),
  provincia_id: mapaProvincias.get("Santa Elena")!,

},

{
  nombre: "La Libertad",
  latitud: new Prisma.Decimal("-0.28275"),
  longitud: new Prisma.Decimal("-78.58264"),
  provincia_id: mapaProvincias.get("Santa Elena")!,

},

{
  nombre: "Salinas",
  latitud: new Prisma.Decimal("-3.38333"),
  longitud: new Prisma.Decimal("-80.31667"),
  provincia_id: mapaProvincias.get("Santa Elena")!,

},



    // ===========================
// SANTO DOMINGO DE LOS TSÁCHILAS
// ===========================

{
  nombre: "Santo Domingo",
  latitud: new Prisma.Decimal("-2.48697"),
  longitud: new Prisma.Decimal("-80.2923"),
  provincia_id: mapaProvincias.get("Santo Domingo de los Tsáchilas")!,

},

{
  nombre: "La Concordia",
  latitud: new Prisma.Decimal("1.02122"),
  longitud: new Prisma.Decimal("-79.01906"),
  provincia_id: mapaProvincias.get("Santo Domingo de los Tsáchilas")!,

},


// ===========================
// SUCUMBÍOS
// ===========================

{
  nombre: "Lago Agrio",
  latitud: new Prisma.Decimal("0.08615"),
  longitud: new Prisma.Decimal("-76.87203"),
  provincia_id: mapaProvincias.get("Sucumbíos")!,

},

{
  nombre: "Cascales",
  latitud: new Prisma.Decimal("0.04238"),
  longitud: new Prisma.Decimal("-77.14083"),
  provincia_id: mapaProvincias.get("Sucumbíos")!,
},

{
  nombre: "Cuyabeno",
  latitud: new Prisma.Decimal("-0.26501"),
  longitud: new Prisma.Decimal("-75.89186"),
  provincia_id: mapaProvincias.get("Sucumbíos")!,

},

{
  nombre: "Gonzalo Pizarro",
  latitud: new Prisma.Decimal("-0.55"),
  longitud: new Prisma.Decimal("-77.43333"),
  provincia_id: mapaProvincias.get("Sucumbíos")!,

},

{
  nombre: "Putumayo",
  latitud: new Prisma.Decimal("0.59318"),
  longitud: new Prisma.Decimal("-75.40742"),
  provincia_id: mapaProvincias.get("Sucumbíos")!,
},

{
  nombre: "Shushufindi",
  latitud: new Prisma.Decimal("-0.29097"),
  longitud: new Prisma.Decimal("-76.40826"),
  provincia_id: mapaProvincias.get("Sucumbíos")!,

},

{
  nombre: "Sucumbíos",
  latitud: new Prisma.Decimal("0.45262"),
  longitud: new Prisma.Decimal("-77.54685"),
  provincia_id: mapaProvincias.get("Sucumbíos")!,
},



   // ===========================
// TUNGURAHUA
// ===========================

{
  nombre: "Ambato",
  latitud: new Prisma.Decimal("-1.24908"),
  longitud: new Prisma.Decimal("-78.61675"),
  provincia_id: mapaProvincias.get("Tungurahua")!,

},

{
  nombre: "Baños de Agua Santa",
  latitud: new Prisma.Decimal("-1.39699"),
  longitud: new Prisma.Decimal("-78.42471"),
  provincia_id: mapaProvincias.get("Tungurahua")!,
},

{
  nombre: "Cevallos",
  latitud: new Prisma.Decimal("-1.35496"),
  longitud: new Prisma.Decimal("-78.6164"),
  provincia_id: mapaProvincias.get("Tungurahua")!,

},

{
  nombre: "Mocha",
  latitud: new Prisma.Decimal("-1.4191"),
  longitud: new Prisma.Decimal("-78.66202"),
  provincia_id: mapaProvincias.get("Tungurahua")!,

},

{
  nombre: "Patate",
  latitud: new Prisma.Decimal("-1.31215"),
  longitud: new Prisma.Decimal("-78.508"),
  provincia_id: mapaProvincias.get("Tungurahua")!,

},

{
  nombre: "Pelileo",
  latitud: new Prisma.Decimal("-1.33057"),
  longitud: new Prisma.Decimal("-78.54523"),
  provincia_id: mapaProvincias.get("Tungurahua")!,

},

{
  nombre: "Píllaro",
  latitud: new Prisma.Decimal("-1.17381"),
  longitud: new Prisma.Decimal("-78.55092"),
  provincia_id: mapaProvincias.get("Tungurahua")!,

},

{
  nombre: "Quero",
  latitud: new Prisma.Decimal("-1.38068"),
  longitud: new Prisma.Decimal("-78.6083"),
  provincia_id: mapaProvincias.get("Tungurahua")!,

},

{
  nombre: "Tisaleo",
  latitud: new Prisma.Decimal("-1.34891"),
  longitud: new Prisma.Decimal("-78.66931"),
  provincia_id: mapaProvincias.get("Tungurahua")!,

},



    // ===========================
// ZAMORA CHINCHIPE
// ===========================

{
  nombre: "Zamora",
  latitud: new Prisma.Decimal("-4.06446"),
  longitud: new Prisma.Decimal("-78.95123"),
  provincia_id: mapaProvincias.get("Zamora Chinchipe")!,

},

{
  nombre: "Centinela del Cóndor",
  latitud: new Prisma.Decimal("-3.44874"),
  longitud: new Prisma.Decimal("-78.81695"),
  provincia_id: mapaProvincias.get("Zamora Chinchipe")!,
},

{
  nombre: "Chinchipe",
  latitud: new Prisma.Decimal("-2.19951"),
  longitud: new Prisma.Decimal("-80.9822"),
  provincia_id: mapaProvincias.get("Zamora Chinchipe")!,

},

{
  nombre: "El Pangui",
  latitud: new Prisma.Decimal("-3.62575"),
  longitud: new Prisma.Decimal("-78.58836"),
  provincia_id: mapaProvincias.get("Zamora Chinchipe")!,

},

{
  nombre: "Nangaritza",
  latitud: new Prisma.Decimal("-4.18634"),
  longitud: new Prisma.Decimal("-78.61189"),
  provincia_id: mapaProvincias.get("Zamora Chinchipe")!,
},

{
  nombre: "Palanda",
  latitud: new Prisma.Decimal("-4.64953"),
  longitud: new Prisma.Decimal("-79.1323"),
  provincia_id: mapaProvincias.get("Zamora Chinchipe")!,

},

{
  nombre: "Paquisha",
  latitud: new Prisma.Decimal("-3.93391"),
  longitud: new Prisma.Decimal("-78.67562"),
  provincia_id: mapaProvincias.get("Zamora Chinchipe")!,

},

{
  nombre: "Yacuambi",
  latitud: new Prisma.Decimal("-3.93333"),
  longitud: new Prisma.Decimal("-78.85"),
  provincia_id: mapaProvincias.get("Zamora Chinchipe")!,

},

{
  nombre: "Yantzaza",
  latitud: new Prisma.Decimal("-3.83299"),
  longitud: new Prisma.Decimal("-78.76122"),
  provincia_id: mapaProvincias.get("Zamora Chinchipe")!,

},

  ];

console.log("Insertando/actualizando ciudades...");

for (const ciudad of ciudades) {
  await prisma.ciudades.upsert({
    where: {
      nombre_provincia_id: {
        nombre: ciudad.nombre,
        provincia_id: ciudad.provincia_id,
      },
    },
    update: {
      latitud: ciudad.latitud,
      longitud: ciudad.longitud,
    },
    create: {
      nombre: ciudad.nombre,
      provincia_id: ciudad.provincia_id,
      latitud: ciudad.latitud,
      longitud: ciudad.longitud,
    },
  });
}

console.log("✅ Ciudades sembradas/actualizadas (idempotente, sin duplicados gracias al constraint único nombre+provincia_id).");
}