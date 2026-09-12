import type { VehicleType } from '@/lib/vehicle-types';

type VehicleCatalog = Record<string, readonly string[]>;

/**
 * Broad U.S.-market make/model suggestions for the listing and search flows.
 * Sellers can still type uncommon, vintage, specialty, or newly released models.
 */
export const vehicleCatalog: Record<VehicleType, VehicleCatalog> = {
  car: {
    Acura: ['ADX', 'Integra', 'TLX', 'ZDX', 'RDX', 'MDX'],
    'Alfa Romeo': ['Giulia', 'Stelvio', 'Tonale'],
    'Aston Martin': ['DB12', 'DBX', 'Vanquish', 'Vantage'],
    Audi: [
      'A3', 'A5', 'A6', 'A6 allroad', 'A6 e-tron', 'A8', 'e-tron GT',
      'Q3', 'Q4 e-tron', 'Q5', 'Q6 e-tron', 'Q7', 'Q8', 'Q8 e-tron',
      'RS 3', 'RS 5', 'RS 6 Avant', 'RS 7', 'S3', 'S5', 'S6', 'S7', 'S8',
      'SQ5', 'SQ7', 'SQ8',
    ],
    Bentley: ['Bentayga', 'Continental GT', 'Flying Spur'],
    BMW: [
      '2 Series', '3 Series', '4 Series', '5 Series', '7 Series', '8 Series',
      'i4', 'i5', 'i7', 'iX', 'M2', 'M3', 'M4', 'M5', 'M8', 'X1', 'X2',
      'X3', 'X4', 'X5', 'X6', 'X7', 'XM', 'Z4',
    ],
    Buick: ['Enclave', 'Encore GX', 'Envision', 'Envista'],
    Cadillac: [
      'Celestiq', 'CT4', 'CT5', 'Escalade', 'Escalade IQ', 'Lyriq', 'Optiq',
      'Vistiq', 'XT4', 'XT5', 'XT6',
    ],
    Chevrolet: [
      'Blazer', 'Blazer EV', 'Bolt EV', 'Bolt EUV', 'Colorado', 'Corvette',
      'Equinox', 'Equinox EV', 'Express', 'Malibu', 'Silverado 1500',
      'Silverado 2500HD', 'Silverado 3500HD', 'Silverado EV', 'Suburban',
      'Tahoe', 'Trailblazer', 'Traverse', 'Trax',
    ],
    Chrysler: ['Pacifica', 'Voyager'],
    Dodge: ['Charger', 'Durango', 'Hornet'],
    Ferrari: ['12Cilindri', '296 GTB', '296 GTS', 'Amalfi', 'Purosangue', 'Roma Spider', 'SF90'],
    Fiat: ['500e'],
    Ford: [
      'Bronco', 'Bronco Sport', 'E-Transit', 'Escape', 'Expedition', 'Explorer',
      'F-150', 'F-150 Lightning', 'F-250 Super Duty', 'F-350 Super Duty',
      'Maverick', 'Mustang', 'Mustang Mach-E', 'Ranger', 'Transit',
    ],
    Genesis: ['G70', 'G80', 'G90', 'GV60', 'GV70', 'GV80'],
    GMC: [
      'Acadia', 'Canyon', 'Hummer EV Pickup', 'Hummer EV SUV', 'Savana',
      'Sierra 1500', 'Sierra 2500HD', 'Sierra 3500HD', 'Terrain', 'Yukon',
    ],
    Honda: ['Accord', 'Civic', 'CR-V', 'HR-V', 'Odyssey', 'Passport', 'Pilot', 'Prelude', 'Prologue', 'Ridgeline'],
    Hyundai: [
      'Elantra', 'Ioniq 5', 'Ioniq 6', 'Ioniq 9', 'Kona', 'Nexo', 'Palisade',
      'Santa Cruz', 'Santa Fe', 'Sonata', 'Tucson', 'Venue',
    ],
    INEOS: ['Grenadier', 'Quartermaster'],
    Infiniti: ['QX50', 'QX55', 'QX60', 'QX80'],
    Jaguar: ['E-PACE', 'F-PACE', 'F-TYPE', 'I-PACE'],
    Jeep: ['Cherokee', 'Compass', 'Gladiator', 'Grand Cherokee', 'Grand Wagoneer', 'Recon', 'Renegade', 'Wagoneer', 'Wagoneer S', 'Wrangler'],
    Karma: ['Gyesera', 'Revero'],
    Kia: ['Carnival', 'EV4', 'EV6', 'EV9', 'K4', 'K5', 'Niro', 'Seltos', 'Sorento', 'Soul', 'Sportage', 'Telluride'],
    Lamborghini: ['Revuelto', 'Temerario', 'Urus'],
    'Land Rover': ['Defender', 'Discovery', 'Discovery Sport', 'Range Rover', 'Range Rover Evoque', 'Range Rover Sport', 'Range Rover Velar'],
    Lexus: ['ES', 'GX', 'IS', 'LC', 'LS', 'LX', 'NX', 'RC', 'RX', 'RZ', 'TX', 'UX'],
    Lincoln: ['Aviator', 'Corsair', 'Nautilus', 'Navigator'],
    Lotus: ['Eletre', 'Emeya', 'Emira'],
    Lucid: ['Air', 'Gravity'],
    Maserati: ['GranCabrio', 'GranTurismo', 'Grecale', 'MC20'],
    Mazda: ['Mazda3', 'CX-30', 'CX-5', 'CX-50', 'CX-70', 'CX-90', 'MX-5 Miata'],
    McLaren: ['Artura', 'GTS', '750S', 'W1'],
    'Mercedes-Benz': [
      'AMG GT', 'C-Class', 'CLA', 'CLE', 'E-Class', 'EQB', 'EQE Sedan',
      'EQE SUV', 'EQS Sedan', 'EQS SUV', 'G-Class', 'GLA', 'GLB', 'GLC',
      'GLE', 'GLS', 'S-Class', 'SL Roadster',
    ],
    MINI: ['Aceman', 'Cooper 2 Door', 'Cooper 4 Door', 'Cooper Convertible', 'Countryman'],
    Mitsubishi: ['Eclipse Cross', 'Outlander', 'Outlander PHEV', 'Outlander Sport'],
    Nissan: ['Altima', 'Ariya', 'Armada', 'Frontier', 'Kicks', 'Leaf', 'Murano', 'Pathfinder', 'Rogue', 'Sentra', 'Versa', 'Z'],
    Polestar: ['Polestar 2', 'Polestar 3', 'Polestar 4'],
    Porsche: ['718 Boxster', '718 Cayman', '911', 'Cayenne', 'Macan', 'Panamera', 'Taycan'],
    Ram: ['1500', '2500', '3500', 'ProMaster', 'ProMaster EV'],
    Rivian: ['R1S', 'R1T'],
    'Rolls-Royce': ['Cullinan', 'Ghost', 'Phantom', 'Spectre'],
    Subaru: ['Ascent', 'BRZ', 'Crosstrek', 'Forester', 'Impreza', 'Legacy', 'Outback', 'Solterra', 'Trailseeker', 'WRX'],
    Tesla: ['Cybertruck', 'Model 3', 'Model S', 'Model X', 'Model Y'],
    Toyota: [
      '4Runner', 'bZ', 'Camry', 'Corolla', 'Corolla Cross', 'Crown',
      'Crown Signia', 'GR86', 'GR Corolla', 'Grand Highlander', 'Highlander',
      'Land Cruiser', 'Mirai', 'Prius', 'RAV4', 'Sequoia', 'Sienna', 'Supra',
      'Tacoma', 'Tundra',
    ],
    VinFast: ['VF 8', 'VF 9'],
    Volkswagen: ['Atlas', 'Atlas Cross Sport', 'Golf GTI', 'Golf R', 'ID.4', 'ID. Buzz', 'Jetta', 'Taos', 'Tiguan'],
    Volvo: ['EC40', 'EX30', 'EX40', 'EX90', 'S60', 'S90', 'V60', 'V90', 'XC40', 'XC60', 'XC90'],
  },
  motorcycle: {
    Aprilia: ['RS 457', 'RS 660', 'RSV4', 'Tuareg 660', 'Tuono 660', 'Tuono V4'],
    BMW: ['C 400 GT', 'CE 02', 'CE 04', 'F 800 GS', 'F 900 GS', 'F 900 R', 'G 310 GS', 'G 310 R', 'K 1600 GT', 'M 1000 RR', 'R 12', 'R 1300 GS', 'R 18', 'S 1000 RR'],
    'Can-Am': ['Canyon', 'Ryker', 'Spyder F3', 'Spyder RT'],
    CFMOTO: ['Papio CL', '300NK', '300SS', '450CL-C', '450MT', '450NK', '450SS', '650 Adventura', '700CL-X', '800MT', '800NK', '675SS'],
    Ducati: ['DesertX', 'Diavel V4', 'Hypermotard', 'Monster', 'Multistrada V2', 'Multistrada V4', 'Panigale V2', 'Panigale V4', 'Scrambler', 'Streetfighter V2', 'Streetfighter V4'],
    'Harley-Davidson': ['Breakout', 'CVO Road Glide', 'CVO Street Glide', 'Fat Boy', 'Heritage Classic', 'Low Rider S', 'Nightster', 'Pan America', 'Road Glide', 'Road King', 'Sport Glide', 'Street Bob', 'Street Glide', 'Ultra Limited'],
    Honda: ['Africa Twin', 'CB300R', 'CB500F', 'CB650R', 'CB1000R', 'CBR300R', 'CBR500R', 'CBR600RR', 'CBR1000RR', 'CRF300L', 'Fury', 'Gold Wing', 'Grom', 'NC750X', 'NT1100', 'Rebel 300', 'Rebel 500', 'Rebel 1100', 'Shadow', 'Transalp', 'Trail125'],
    Husqvarna: ['Norden 901', 'Svartpilen 401', 'Svartpilen 801', 'Vitpilen 401', '701 Enduro', '701 Supermoto'],
    Indian: ['Challenger', 'Chief', 'Chieftain', 'FTR', 'Pursuit', 'Roadmaster', 'Scout', 'Sport Chief', 'Springfield'],
    Kawasaki: ['Eliminator', 'KLX230', 'KLX300', 'KLR650', 'Ninja 400', 'Ninja 500', 'Ninja 650', 'Ninja 1100SX', 'Ninja ZX-4R', 'Ninja ZX-6R', 'Ninja ZX-10R', 'Versys 650', 'Versys 1100', 'Vulcan S', 'W800', 'Z500', 'Z650', 'Z900'],
    KTM: ['RC 390', '390 Adventure', '390 Duke', '690 Enduro R', '790 Duke', '890 Adventure', '990 Duke', '1290 Super Adventure', '1390 Super Duke R'],
    LiveWire: ['Del Mar', 'S2 Alpinista', 'LiveWire ONE'],
    'Moto Guzzi': ['Stelvio', 'V7', 'V85 TT', 'V100 Mandello'],
    'MV Agusta': ['Brutale', 'Dragster', 'Enduro Veloce', 'F3', 'Rush', 'Superveloce', 'Turismo Veloce'],
    'Royal Enfield': ['Bear 650', 'Bullet 350', 'Classic 350', 'Continental GT 650', 'Guerrilla 450', 'Himalayan', 'Hunter 350', 'Interceptor 650', 'Meteor 350', 'Shotgun 650', 'Super Meteor 650'],
    Suzuki: ['Boulevard C50', 'Boulevard M109R', 'DR-Z4S', 'DR650S', 'GSX-8R', 'GSX-8S', 'GSX-R600', 'GSX-R750', 'GSX-R1000R', 'GSX-S1000', 'Hayabusa', 'Katana', 'V-Strom 650', 'V-Strom 800', 'V-Strom 1050'],
    Triumph: ['Bonneville Bobber', 'Bonneville T100', 'Bonneville T120', 'Daytona 660', 'Rocket 3', 'Scrambler 400 X', 'Scrambler 900', 'Scrambler 1200', 'Speed 400', 'Speed Triple 1200', 'Street Triple 765', 'Tiger 660', 'Tiger 900', 'Tiger 1200', 'Trident 660'],
    Vespa: ['GTS', 'GTV', 'Primavera', 'Sprint', 'Elettrica'],
    Yamaha: ['Bolt R-Spec', 'MT-03', 'MT-07', 'MT-09', 'MT-10', 'Tenere 700', 'Tracer 9', 'TW200', 'V Star 250', 'XSR700', 'XSR900', 'YZF-R3', 'YZF-R7', 'YZF-R9', 'YZF-R1'],
    Zero: ['DS', 'DSR', 'FX', 'FXE', 'S', 'SR/F', 'SR/S', 'XE', 'XB'],
  },
  boat: {
    Alumacraft: ['Competitor', 'Classic', 'Escape', 'Voyageur'],
    Axis: ['A20', 'A22', 'A24', 'T22', 'T23', 'T250'],
    BassCat: ['Bobcat', 'Caracal', 'Cougar', 'Eyra', 'Jaguar', 'Pantera'],
    Bayliner: ['Element E16', 'Element E18', 'Element M19', 'Element M20', 'VR4', 'VR5', 'VR6'],
    Bennington: ['L Series', 'Q Series', 'R Series', 'S Series'],
    'Boston Whaler': ['Montauk', 'Dauntless', 'Vantage', 'Outrage', 'Realm', 'Conquest'],
    Chaparral: ['SSi', 'SSX', 'OSX', 'SURF'],
    Cobalt: ['R Series', 'A Series', 'CS Series', 'Surf Series'],
    Crestliner: ['XF', 'MX', 'XFC', 'Fish Hawk', 'Commander', 'Rally'],
    Crownline: ['E Series', 'LPX', 'SS Series', 'Surf Series'],
    Duckworth: ['Advantage', 'Navigator', 'Offshore', 'Pacific Navigator'],
    Formula: ['Bowrider', 'Crossover Bowrider', 'Super Sport Crossover'],
    'Grady-White': ['Fisherman', 'Freedom', 'Canyon', 'Coastal Explorer', 'Express'],
    Harris: ['Breeze', 'Cruiser', 'Grand Mariner', 'Solstice'],
    'Heyday': ['H20', 'H22', 'WT-2DC', 'WT-Surf'],
    Hurricane: ['SunDeck', 'SunDeck Sport', 'Center Console'],
    'Jeanneau': ['NC', 'Leader', 'Sun Odyssey', 'Merry Fisher'],
    Lowe: ['Fishing Machine', 'Stinger', 'Roughneck', 'Skorpion', 'Deck Series', 'Pontoon'],
    Lund: ['Adventure', 'Alaskan', 'Fury', 'Impact', 'Pro-V', 'Renegade', 'Tyee'],
    Malibu: ['Wakesetter 20 VTX', 'Wakesetter 21 LX', 'Wakesetter 22 LSV', 'Wakesetter 23 LSV', 'Wakesetter 24 MXZ', 'M242'],
    MasterCraft: ['NXT20', 'NXT22', 'NXT24', 'XT22', 'XT23', 'X24', 'X26'],
    Monterey: ['M Series', 'Super Sport', 'Outboard', 'Sport Yacht'],
    Nautique: ['Super Air Nautique G-Series', 'Super Air Nautique GS-Series', 'Super Air Nautique Paragon', 'Ski Nautique'],
    'Nitro': ['Z17', 'Z18', 'Z19', 'Z20', 'Z21'],
    'Parker': ['Center Console', 'Sport Cabin', 'Dual Console'],
    'Pursuit': ['Center Console', 'Dual Console', 'Sport', 'Offshore'],
    'Regal': ['LX', 'LS', 'Surf', 'XO', 'SAV', 'Fly'],
    'Robalo': ['Center Console', 'Cayman', 'Dual Console', 'Explorer'],
    'Sea Ray': ['SPX', 'SDX', 'SLX', 'Sundancer'],
    'Sea-Doo': ['Switch Cruise', 'Switch Sport', 'Switch Fish'],
    'Starcraft': ['SVX', 'MDX', 'CX', 'EX', 'MX'],
    'Sun Tracker': ['Bass Buggy', 'Fishin Barge', 'Party Barge'],
    'Supra': ['SA', 'SE', 'SL', 'SV'],
    'Tahoe': ['T16', 'T18', 'T21', '215 Xi', '210 Si'],
    'Tracker': ['Bass Tracker Classic', 'Pro Team', 'Targa', 'Grizzly'],
    'Yamaha Boats': ['AR Series', 'SX Series', '252 Series', '255 Series', '275 Series'],
  },
  atv_utv: {
    'Arctic Cat': ['Alterra 300', 'Alterra 600', 'Alterra 800', 'Prowler', 'Wildcat XX'],
    'Can-Am': ['Defender', 'Maverick R', 'Maverick X3', 'Outlander', 'Renegade', 'Commander'],
    CFMOTO: ['CForce 400', 'CForce 500', 'CForce 600', 'CForce 800', 'CForce 1000', 'UForce 600', 'UForce 1000', 'ZForce 800', 'ZForce 950'],
    Honda: ['FourTrax Foreman', 'FourTrax Rancher', 'FourTrax Recon', 'FourTrax Rincon', 'Pioneer 500', 'Pioneer 700', 'Pioneer 1000', 'Talon 1000'],
    Hisun: ['Forge', 'Sector', 'Strike', 'Tactic'],
    Kawasaki: ['Brute Force 300', 'Brute Force 450', 'Brute Force 750', 'KFX50', 'KFX90', 'Mule PRO-DX', 'Mule PRO-FX', 'Mule SX', 'Ridge', 'Teryx', 'Teryx KRX'],
    Kayo: ['Bull', 'Fox', 'Jackal', 'Predator'],
    Kubota: ['Sidekick', 'RTV-X', 'RTV-XG850', 'RTV520'],
    Massimo: ['Buck', 'T-Boss', 'Warrior'],
    Polaris: ['General', 'Ranger', 'RZR', 'Scrambler', 'Sportsman', 'Youth'],
    'Segway Powersports': ['Fugleman', 'Snarler', 'Super Villain', 'Villain', 'UT10'],
    SSR: ['Bison', 'SRU', 'U Series'],
    Suzuki: ['KingQuad 400', 'KingQuad 500', 'KingQuad 750', 'QuadSport Z50', 'QuadSport Z90'],
    Yamaha: ['Grizzly', 'Kodiak 450', 'Kodiak 700', 'Raptor 700', 'Viking', 'Wolverine', 'YFZ450R', 'YXZ1000R'],
  },
  rv_camper: {
    Airstream: ['Basecamp', 'Bambi', 'Caravel', 'Classic', 'Flying Cloud', 'Globetrotter', 'Interstate', 'Rangeline', 'Trade Wind'],
    'Alliance RV': ['Avenue', 'Benchmark', 'Delta', 'Paradigm', 'Valor'],
    'American Coach': ['American Dream', 'American Eagle', 'American Tradition'],
    Coachmen: ['Adrenaline', 'Apex', 'Catalina', 'Chaparral', 'Freedom Express', 'Leprechaun', 'Mirada', 'Nova', 'Prism'],
    CrossRoads: ['Cameo', 'Hampton', 'Redwood', 'Sunset Trail', 'Zinger'],
    'Cruiser RV': ['Avenir', 'Hitch', 'Radiance', 'Shadow Cruiser', 'Stryker'],
    Dutchmen: ['Astoria', 'Aspen Trail', 'Colorado', 'Kodiak', 'Voltage', 'Yukon'],
    Dynamax: ['DynaQuest', 'Europa', 'Force', 'Isata', 'Rev'],
    'East to West': ['Ahara', 'Alta', 'Blackthorn', 'Entrada', 'Tandara'],
    Entegra: ['Accolade', 'Anthem', 'Aspire', 'Coach', 'Cornerstone', 'Esteem', 'Ethos', 'Odyssey'],
    Fleetwood: ['Bounder', 'Discovery', 'Flex', 'Fortis', 'Frontier', 'Insight', 'Palisade'],
    'Forest River': ['Berkshire', 'Cardinal', 'Cherokee', 'Flagstaff', 'Georgetown', 'No Boundaries', 'Rockwood', 'Salem', 'Sandpiper', 'Surveyor', 'Wildwood'],
    'Grand Design': ['Imagine', 'Influence', 'Lineage', 'Momentum', 'Reflection', 'Solitude', 'Transcend'],
    'Gulf Stream': ['Ameri-Lite', 'BT Cruiser', 'Conquest', 'Friendship', 'Innsbruck', 'Vintage Cruiser'],
    Heartland: ['Bighorn', 'Cortes', 'Cyclone', 'Mallard', 'Milestone', 'North Trail', 'Prowler', 'Sundance'],
    'Holiday Rambler': ['Admiral', 'Armada', 'Eclipse', 'Invicta', 'Nautica', 'Vacationer'],
    Jayco: ['Alante', 'Eagle', 'Greyhawk', 'Jay Feather', 'Jay Flight', 'Melbourne', 'North Point', 'Pinnacle', 'Precept', 'Redhawk', 'Seneca', 'Seismic', 'Swift'],
    Keystone: ['Alpine', 'Arcadia', 'Avalanche', 'Bullet', 'Cougar', 'Fuzion', 'Hideout', 'Montana', 'Outback', 'Passport', 'Raptor', 'Springdale'],
    KZ: ['Connect', 'Durango', 'Escape', 'Sportsmen', 'Sportster', 'Venom'],
    Lance: ['Enduro', 'Travel Trailer', 'Truck Camper'],
    'Leisure Travel Vans': ['Unity', 'Wonder'],
    Newmar: ['Bay Star', 'Canyon Star', 'Dutch Star', 'Essex', 'King Aire', 'London Aire', 'New Aire', 'Super Star', 'Ventana'],
    Nexus: ['Bentley', 'Ghost', 'Phantom', 'Rebel', 'Triumph', 'Verona', 'Viper', 'Wraith'],
    nuCamp: ['Avia', 'Cirrus', 'TAB', 'TAG'],
    'Oliver Travel Trailers': ['Legacy Elite', 'Legacy Elite II'],
    Palomino: ['Columbus', 'PaloMini', 'Puma', 'Real-Lite', 'Revolve', 'River Ranch', 'SolAire'],
    'Pleasure-Way': ['Ascent', 'Ontour', 'Plateau', 'Rekona', 'Tofino'],
    Renegade: ['Classic', 'Explorer', 'Ikon', 'Valencia', 'Verona', 'Vienna', 'XL'],
    Roadtrek: ['Chase', 'Pivot', 'Play', 'Slumber'],
    'Storyteller Overland': ['Beast Mode', 'Classic Mode', 'Dark Mode', 'Hilt', 'Stealth Mode'],
    Tiffin: ['Allegro Bay', 'Allegro Bus', 'Allegro Breeze', 'Byway', 'Open Road Allegro', 'Phaeton', 'Wayfarer', 'Zephyr'],
    Thor: ['A.C.E.', 'Compass', 'Dazzle', 'Delano', 'Geneva', 'Hurricane', 'Magnitude', 'Miramar', 'Palazzo', 'Sanctuary', 'Sequence', 'Tellaro', 'Tranquility'],
    Venture: ['Sonic', 'SportTrek', 'Stratus'],
    Winnebago: ['Access', 'Adventurer', 'EKKO', 'Forza', 'Journey', 'Micro Minnie', 'Minnie', 'Navion', 'Revel', 'Solís', 'Spirit', 'Travato', 'Vista'],
  },
  trailer: {
    Aluma: ['Utility', 'Car Hauler', 'Equipment', 'Motorcycle', 'Snowmobile'],
    'ATC Trailers': ['Game Changer', 'Plā 350', 'Rōm 200', 'Stō 350'],
    'Big Tex': ['Utility', 'Landscape', 'Car Hauler', 'Equipment', 'Dump', 'Gooseneck'],
    Bravo: ['Scout', 'Star', 'Hero', 'Silver Star', 'Icon'],
    'Bri-Mar': ['Dump', 'Equipment', 'Utility', 'Car Hauler'],
    'Carry-On': ['Utility', 'Enclosed Cargo', 'Car Hauler', 'Dump'],
    'Continental Cargo': ['Cargo', 'Car Hauler', 'Living Quarters', 'Motorcycle'],
    CornPro: ['Dump', 'Equipment', 'Horse', 'Livestock', 'Utility'],
    'Diamond C': ['Car Hauler', 'Dump', 'Equipment', 'Gooseneck', 'Utility'],
    Featherlite: ['Car Trailer', 'Horse Trailer', 'Livestock Trailer', 'Recreational Trailer'],
    Felling: ['Deck-Over', 'Drop-Deck', 'Equipment', 'Utility'],
    Haulmark: ['ALX', 'Edge', 'Grizzly', 'Passport', 'Transport'],
    Homesteader: ['Challenger', 'Champion', 'Hercules', 'Intrepid', 'Patriot'],
    'Iron Bull': ['Dump', 'Equipment', 'Gooseneck', 'Utility'],
    Interstate: ['LoadRunner', 'Pro Series', 'Victory'],
    Karavan: ['Boat', 'Jet Ski', 'Pontoon', 'Snowmobile', 'Utility'],
    Kaufman: ['Car Hauler', 'Dump', 'Equipment', 'Gooseneck', 'Utility'],
    'Load Rite': ['Boat', 'Jet Ski', 'Pontoon', 'Snowmobile'],
    LOOK: ['Element', 'Everlite', 'ST DLX', 'Vision'],
    'Mission Trailers': ['All-Sport', 'Car Hauler', 'Cargo', 'Deckover', 'Open Utility', 'Snowmobile'],
    'Pace American': ['Cargo Sport', 'Journey', 'Outback', 'Shadow GT'],
    PJ: ['Car Hauler', 'Deckover', 'Dump', 'Equipment', 'Gooseneck', 'Utility'],
    'Sundowner': ['Cargo', 'Living Quarters', 'Race', 'Toy Hauler', 'Horse'],
    'Sure-Trac': ['Car Hauler', 'Deckover', 'Dump', 'Equipment', 'Landscape', 'Tube Top'],
    Triton: ['ATV', 'Cargo', 'Jet Ski', 'Motorcycle', 'Pontoon', 'Snowmobile', 'Utility'],
    'United Trailers': ['Cargo', 'Car Hauler', 'Concession', 'Race', 'Stacker'],
    'Wells Cargo': ['FastTrac', 'MotorTrac', 'Road Force', 'SportTrac', 'Wagon'],
  },
  snowmobile: {
    Alpina: ['Sherpa', 'Superclass'],
    'Arctic Cat': ['Blast', 'Catalyst', 'M 858', 'Norseman', 'Pantera', 'Riot', 'ZR'],
    Lynx: ['Brutal', 'Commander', 'Rave', 'Shredder', 'Xterrain'],
    Polaris: ['650 Indy', '850 Indy', 'Boost', 'Patriot 9R', 'Pro RMK', 'RMK Khaos', 'Switchback Assault', 'Titan', 'Voyageur'],
    'Ski-Doo': ['Backcountry', 'Expedition', 'Freeride', 'Grand Touring', 'MXZ', 'Renegade', 'Summit', 'Tundra'],
    Taiga: ['Ekko', 'Nomad'],
    Yamaha: ['Mountain Max', 'Sidewinder', 'Snowscoot', 'SnoScoot', 'Transporter', 'Venom'],
  },
  personal_watercraft: {
    Belassi: ['Burrasca'],
    Kawasaki: ['Jet Ski STX 160', 'Jet Ski Ultra 160', 'Jet Ski Ultra 310', 'Jet Ski SX-R 160'],
    Krash: ['Footrocket', 'Predator', 'Reaper'],
    'Sea-Doo': ['Explorer Pro', 'FishPro Apex', 'FishPro Sport', 'GTI', 'GTI SE', 'GTR', 'GTX', 'RXP-X', 'RXT-X', 'Spark', 'Spark Trixx', 'Wake Pro'],
    Taiga: ['Orca Carbon', 'Orca Performance'],
    Yamaha: ['JetBlaster', 'SuperJet', 'WaveRunner EX', 'WaveRunner FX', 'WaveRunner GP', 'WaveRunner VX'],
  },
};

function normalized(value: string) {
  return value.trim().toLocaleLowerCase();
}

function uniqueSorted(values: Iterable<string>) {
  return [...new Set([...values].filter(Boolean))].sort((left, right) =>
    left.localeCompare(right),
  );
}

export function catalogMakes(type?: VehicleType) {
  const catalogs = type
    ? [vehicleCatalog[type]]
    : (Object.values(vehicleCatalog) as VehicleCatalog[]);
  return uniqueSorted(catalogs.flatMap((catalog) => Object.keys(catalog)));
}

export function catalogModels(type: VehicleType | undefined, make: string) {
  if (!make.trim()) return [];
  const catalogs = type
    ? [vehicleCatalog[type]]
    : (Object.values(vehicleCatalog) as VehicleCatalog[]);
  const makeKey = normalized(make);
  return uniqueSorted(
    catalogs.flatMap((catalog) =>
      Object.entries(catalog)
        .filter(([catalogMake]) => normalized(catalogMake) === makeKey)
        .flatMap(([, models]) => [...models]),
    ),
  );
}

export function modelYearOptions() {
  const latest = new Date().getFullYear() + 1;
  return Array.from({ length: latest - 1899 }, (_, index) =>
    String(latest - index),
  );
}
