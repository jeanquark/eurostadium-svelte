--------------------------
--      Seed data       --
--------------------------
INSERT INTO
    teams (
        api_football_id,
        api_football_venue_id,
        api_football_league_id,
        name,
        code,
        founded,
        is_active
    )
VALUES
    /* Switzerland */
    (
        551,
        1530,
        207,
        'FC Basel 1893',
        'BAS',
        1893,
        true
    ),
    (
        565,
        10500,
        207,
        'BSC Young Boys',
        'YOU',
        1898,
        true
    ),
    (606, 19807, 207, 'FC Lugano', 'LUG', 1908, true),
    (644, 1537, 207, 'FC Luzern', 'LUZ', 1901, true),
    (783, 1533, 207, 'FC Zurich', 'ZUR', 1896, true),
    (
        1011,
        1543,
        207,
        'FC ST. Gallen',
        'GAL',
        1879,
        true
    ),
    (1012, 1544, 208, 'FC Thun', 'THU', 1898, true),
    (
        1013,
        1533,
        207,
        'Grasshoppers',
        'GRA',
        1886,
        true
    ),
    (1014, 11917, 207, 'Lausanne', 'LAU', 1896, true),
    (
        2180,
        1547,
        207,
        'FC Winterthur',
        'WIN',
        1896,
        true
    ),
    (
        2184,
        1541,
        207,
        'Servette FC',
        'SER',
        1890,
        true
    ),
    (
        4269,
        1535,
        208,
        'Stade Lausanne-Ouchy',
        'STA',
        1535,
        true
    ),
    (
        6653,
        4859,
        207,
        'Yverdon Sport',
        'YVE',
        1948,
        true
    ),
    (630, 1542, 207, 'FC Sion', 'SIO', 1909, true),
    (660, 1545, 208, 'FC Vaduz', 'VAD', 1932, true),
    (
        1015,
        1538,
        208,
        'Neuchatel Xamax FC',
        'XAM',
        1970,
        true
    ),
    (2177, 1531, 208, 'FC Aarau', 'AAR', 1902, true),
    (
        2179,
        19218,
        208,
        'FC WIL 1900',
        'WIL',
        1900,
        true
    ),
    (
        2182,
        20337,
        208,
        'FC Schaffhausen',
        'SCH',
        1896,
        true
    ),
    (6616, 4830, 208, 'Bellinzona', NULL, 1904, true),
    (
        6646,
        3264,
        208,
        'Stade Nyonnais',
        'STA',
        1905,
        true
    ),
    (12699, 19808, 208, 'Baden', 'BAD', NULL, true),
    /* France */
    (79, 19207, 61, 'Lille', 'LIL', 1944, true),
    (80, 666, 61, 'Lyon', 'LYO', 1950, true),
    (81, 12678, 61, 'Marseille', 'MAR', 1899, true),
    (82, 20107, 61, 'Montpellier', 'MON', 1974, true),
    (83, 662, 61, 'Nantes', 'NAN', 1943, true),
    (84, 663, 61, 'Nice', 'NIC', 1904, true),
    (
        85,
        671,
        61,
        'Paris Saint Germain',
        'PAR',
        1970,
        true
    ),
    (91, 20470, 61, 'Monaco', 'MON', 1919, true),
    (93, 674, 61, 'Reims', 'REI', 1909, true),
    (94, 680, 61, 'Rennes', 'REN', 1901, true),
    (95, 681, 61, 'Strasbourg', 'STR', 1906, true),
    (96, 682, 61, 'Toulouse', 'TOU', 1937, true),
    (97, 656, 61, 'Lorient', 'LOR', 1926, true),
    (99, 644, 61, 'Clermont Foot', 'CLE', 1990, true),
    (
        106,
        641,
        61,
        'Stade Brestois 29',
        'BRE',
        1950,
        true
    ),
    (111, 652, 61, 'LE Havre', 'HAV', 1872, true),
    (112, 658, 61, 'Metz', 'MET', 1932, true),
    (116, 654, 61, 'Lens', 'LEN', 1906, true),
    (
        1063,
        676,
        61,
        'Saint Etienne',
        'ETI',
        1920,
        true
    ),
    (77, 634, 61, 'Angers', 'ANG', 1919, true),
    (78, 638, 62, 'Bordeaux', 'BOR', 1881, true),
    (87, 633, 62, 'Amiens', 'AMI', 1901, true),
    (88, 642, 62, 'Caen', 'CAE', 1897, true),
    (90, 650, 62, 'Guingamp', 'GUI', 1912, true),
    (98, 632, 62, 'Ajaccio', 'AJA', 1910, true),
    (101, 649, 62, 'Grenoble', 'GRE', 1917, true),
    (105, 686, 62, 'Valenciennes', 'VAL', 1913, true),
    (108, 636, 62, 'Auxerre', 'AUX', 1905, true),
    (110, 684, 62, 'Estac Troyes', 'TRO', 1986, true),
    (114, 12585, 62, 'Paris FC', 'PAR', 1969, true),
    (431, 672, 62, 'Quevilly', 'QUE', 1902, true),
    (433, 651, 62, 'Laval', 'LAV', 1902, true),
    (1297, 11898, 62, 'PAU', 'PAU', 1904, true),
    (1300, 641, 62, 'Concarneau', 'CON', 1911, true),
    (1301, 675, 62, 'Rodez', 'ROD', 1929, true),
    (1304, 646, 62, 'Dunkerque', 'DUN', NULL, true),
    (1305, 1977, 62, 'Bastia', 'BAS', 1905, true),
    (3012, 1979, 62, 'Annecy', NULL, 1927, true),
    /* Germany */
    (
        157,
        20732,
        78,
        'Bayern Munich',
        'BAY',
        1900,
        true
    ),
    (
        165,
        20733,
        78,
        'Borussia Dortmund',
        'DOR',
        1909,
        true
    ),
    (
        158,
        20735,
        78,
        'Fortuna Dusseldorf',
        'DUS',
        1895,
        true
    ),
    (160, 12717, 78, 'SC Freiburg', 'FRE', 1904, true),
    (161, 752, 78, 'VfL Wolfsburg', 'WOL', 1945, true),
    (162, 755, 78, 'Werder Bremen', 'WER', 1899, true),
    (
        163,
        20471,
        78,
        'Borussia Monchengladbach',
        'MOE',
        1900,
        true
    ),
    (
        164,
        11899,
        78,
        'FSV Mainz 05',
        'MAI',
        1905,
        true
    ),
    (
        167,
        724,
        78,
        '1899 Hoffenheim',
        'HOF',
        1899,
        true
    ),
    (
        168,
        699,
        78,
        'Bayer Leverkusen',
        'BAY',
        1904,
        true
    ),
    (
        169,
        20734,
        78,
        'Eintracht Frankfurt',
        'EIN',
        1899,
        true
    ),
    (170, 698, 78, 'FC Augsburg', 'AUG', 1907, true),
    (
        172,
        20739,
        78,
        'VfB Stuttgart',
        'STU',
        1893,
        true
    ),
    (173, 20737, 78, 'RB Leipzig', 'LEI', 2009, true),
    (176, 751, 78, 'Vfl Bochum', 'BOC', 1848, true),
    (180, 723, 78, 'FC Heidenheim', 'HEI', 1946, true),
    (
        181,
        705,
        78,
        'SV Darmstadt 98',
        'DAR',
        1898,
        true
    ),
    (182, 748, 78, 'Union Berlin', 'UNI', 1966, true),
    (192, 20736, 79, '1.FC Köln', 'KOL', 1948, true),
    (159, 694, 79, 'Hertha Berlin', 'HER', 1892, true),
    (166, 18858, 79, 'Hannover 96', 'HAN', 1896, true),
    (171, 713, 79, 'FC Nurnberg', 'NUR', 1900, true),
    (
        174,
        20738,
        79,
        'FC Schalke 04',
        'SCH',
        1904,
        true
    ),
    (175, 720, 79, 'Hamburger SV', 'HAM', 1887, true),
    (
        177,
        10490,
        79,
        'Jahn Regensburg',
        'REG',
        2000,
        true
    ),
    (
        178,
        718,
        79,
        'SpVgg Greuther Furth',
        'GRE',
        1903,
        true
    ),
    (179, 733, 79, 'FC Magdeburg', 'MAG', 1965, true),
    (
        185,
        18622,
        79,
        'SC Paderborn 07',
        'PAD',
        1907,
        true
    ),
    (186, 745, 79, 'FC St. Pauli', 'PAU', 1910, true),
    (191, 725, 79, 'Holstein Kiel', 'HOL', 1900, true),
    (
        744,
        708,
        79,
        'Eintracht Braunschweig',
        'BRA',
        1895,
        true
    ),
    (
        745,
        728,
        79,
        'FC Kaiserslautern',
        'KAI',
        1900,
        true
    ),
    (
        785,
        11900,
        79,
        'Karlsruher SC',
        'KAR',
        1898,
        true
    ),
    (1319, 753, 79, 'SV Wehen', 'WEH', 1926, true),
    (
        1321,
        722,
        79,
        'Hansa Rostock',
        'HAN',
        1965,
        true
    ),
    (
        1324,
        735,
        79,
        'VfL Osnabruck',
        'OSN',
        1899,
        true
    ),
    (
        1660,
        710,
        79,
        'SV Elversberg',
        'ELV',
        1907,
        true
    );