"use client"

import type React from "react"
import { useState, useMemo } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { HelpCircle } from "lucide-react"
import Select from "react-select"
import { useLanguage } from "@/components/language-provider"

type Nationality = {
  value: string
  label: string
}

const nationalityOptionsES: Nationality[] = [
  { value: "", label: "-- Seleccione Nacionalidad --" },
  { value: "AF", label: "AFGANISTÁN" },
  { value: "AL", label: "ALBANIA" },
  { value: "DE", label: "ALEMANIA" },
  { value: "AD", label: "ANDORRA" },
  { value: "AO", label: "ANGOLA" },
  { value: "AI", label: "ANGUILA" },
  { value: "AQ", label: "ANTÁRTIDA" },
  { value: "AG", label: "ANTIGUA Y BARBUDA" },
  { value: "SA", label: "ARABIA SAUDITA" },
  { value: "DZ", label: "ARGELIA" },
  { value: "AR", label: "ARGENTINA" },
  { value: "AM", label: "ARMENIA" },
  { value: "AW", label: "ARUBA" },
  { value: "AU", label: "AUSTRALIA" },
  { value: "AT", label: "AUSTRIA" },
  { value: "AZ", label: "AZERBAIYÁN" },
  { value: "BS", label: "BAHAMAS" },
  { value: "BD", label: "BANGLADÉS" },
  { value: "BB", label: "BARBADOS" },
  { value: "BH", label: "BARÉIN" },
  { value: "BE", label: "BÉLGICA" },
  { value: "BZ", label: "BELICE" },
  { value: "BJ", label: "BENÍN" },
  { value: "BM", label: "BERMUDAS" },
  { value: "BY", label: "BIELORRUSIA" },
  { value: "BO", label: "BOLIVIA" },
  { value: "BA", label: "BOSNIA Y HERZEGOVINA" },
  { value: "BW", label: "BOTSUANA" },
  { value: "BR", label: "BRASIL" },
  { value: "BN", label: "BRUNÉI" },
  { value: "BG", label: "BULGARIA" },
  { value: "BF", label: "BURKINA FASO" },
  { value: "BI", label: "BURUNDI" },
  { value: "BT", label: "BUTÁN" },
  { value: "CV", label: "CABO VERDE" },
  { value: "KH", label: "CAMBOYA" },
  { value: "CM", label: "CAMERÚN" },
  { value: "CA", label: "CANADÁ" },
  { value: "TD", label: "CHAD" },
  { value: "CL", label: "CHILE" },
  { value: "CN", label: "CHINA" },
  { value: "CY", label: "CHIPRE" },
  { value: "VA", label: "CIUDAD DEL VATICANO" },
  { value: "CO", label: "COLOMBIA" },
  { value: "KM", label: "COMORAS" },
  { value: "CG", label: "CONGO" },
  { value: "KP", label: "COREA DEL NORTE" },
  { value: "KR", label: "COREA DEL SUR" },
  { value: "CI", label: "COSTA DE MARFIL" },
  { value: "CR", label: "COSTA RICA" },
  { value: "HR", label: "CROACIA" },
  { value: "CU", label: "CUBA" },
  { value: "CW", label: "CURAZAO" },
  { value: "DK", label: "DINAMARCA" },
  { value: "DM", label: "DOMINICA" },
  { value: "EC", label: "ECUADOR" },
  { value: "EG", label: "EGIPTO" },
  { value: "SV", label: "EL SALVADOR" },
  { value: "AE", label: "EMIRATOS ÁRABES UNIDOS" },
  { value: "ER", label: "ERITREA" },
  { value: "SK", label: "ESLOVAQUIA" },
  { value: "SI", label: "ESLOVENIA" },
  { value: "ES", label: "ESPAÑA" },
  { value: "US", label: "ESTADOS UNIDOS" },
  { value: "EE", label: "ESTONIA" },
  { value: "ET", label: "ETIOPÍA" },
  { value: "PH", label: "FILIPINAS" },
  { value: "FI", label: "FINLANDIA" },
  { value: "FJ", label: "FIYI" },
  { value: "FR", label: "FRANCIA" },
  { value: "GA", label: "GABÓN" },
  { value: "GM", label: "GAMBIA" },
  { value: "GE", label: "GEORGIA" },
  { value: "GH", label: "GHANA" },
  { value: "GI", label: "GIBRALTAR" },
  { value: "GD", label: "GRANADA" },
  { value: "GR", label: "GRECIA" },
  { value: "GL", label: "GROENLANDIA" },
  { value: "GP", label: "GUADALUPE" },
  { value: "GU", label: "GUAM" },
  { value: "GT", label: "GUATEMALA" },
  { value: "GF", label: "GUAYANA FRANCESA" },
  { value: "GG", label: "GUERNSEY" },
  { value: "GN", label: "GUINEA" },
  { value: "GQ", label: "GUINEA ECUATORIAL" },
  { value: "GW", label: "GUINEA-BISÁU" },
  { value: "GY", label: "GUYANA" },
  { value: "HT", label: "HAITÍ" },
  { value: "HN", label: "HONDURAS" },
  { value: "HK", label: "HONG KONG" },
  { value: "HU", label: "HUNGRÍA" },
  { value: "IN", label: "INDIA" },
  { value: "ID", label: "INDONESIA" },
  { value: "IR", label: "IRÁN" },
  { value: "IQ", label: "IRAK" },
  { value: "IE", label: "IRLANDA" },
  { value: "BV", label: "ISLA BOUVET" },
  { value: "IM", label: "ISLA DE MAN" },
  { value: "CX", label: "ISLA DE NAVIDAD" },
  { value: "NF", label: "ISLA NORFOLK" },
  { value: "IS", label: "ISLANDIA" },
  { value: "BM_ISLANDS", label: "ISLAS BERMUDAS" },
  { value: "KY", label: "ISLAS CAIMÁN" },
  { value: "CC", label: "ISLAS COCOS (KEELING)" },
  { value: "CK", label: "ISLAS COOK" },
  { value: "FO", label: "ISLAS FEROE" },
  { value: "GS", label: "ISLAS GEORGIAS DEL SUR Y SANDWICH DEL SUR" },
  { value: "HM", label: "ISLAS HEARD Y MCDONALD" },
  { value: "FK", label: "ISLAS MALVINAS" },
  { value: "MP", label: "ISLAS MARIANAS DEL NORTE" },
  { value: "MH", label: "ISLAS MARSHALL" },
  { value: "PN", label: "ISLAS PITCAIRN" },
  { value: "SB", label: "ISLAS SALOMÓN" },
  { value: "TC", label: "ISLAS TURCAS Y CAICOS" },
  { value: "UM", label: "ISLAS ULTRAMARINAS MENORES DE ESTADOS UNIDOS" },
  { value: "VG", label: "ISLAS VÍRGENES BRITÁNICAS" },
  { value: "VI", label: "ISLAS VÍRGENES DE LOS ESTADOS UNIDOS" },
  { value: "IL", label: "ISRAEL" },
  { value: "IT", label: "ITALIA" },
  { value: "JM", label: "JAMAICA" },
  { value: "JP", label: "JAPÓN" },
  { value: "JE", label: "JERSEY" },
  { value: "JO", label: "JORDANIA" },
  { value: "KZ", label: "KAZAJISTÁN" },
  { value: "KE", label: "KENIA" },
  { value: "KG", label: "KIRGUISTÁN" },
  { value: "KI", label: "KIRIBATI" },
  { value: "KW", label: "KUWAIT" },
  { value: "LA", label: "LAOS" },
  { value: "LS", label: "LESOTO" },
  { value: "LV", label: "LETONIA" },
  { value: "LB", label: "LÍBANO" },
  { value: "LR", label: "LIBERIA" },
  { value: "LY", label: "LIBIA" },
  { value: "LI", label: "LIECHTENSTEIN" },
  { value: "LT", label: "LITUANIA" },
  { value: "LU", label: "LUXEMBURGO" },
  { value: "MO", label: "MACAO" },
  { value: "MK", label: "MACEDONIA DEL NORTE" },
  { value: "MG", label: "MADAGASCAR" },
  { value: "MY", label: "MALASIA" },
  { value: "MW", label: "MALAUI" },
  { value: "MV", label: "MALDIVAS" },
  { value: "ML", label: "MALÍ" },
  { value: "MT", label: "MALTA" },
  { value: "MA", label: "MARRUECOS" },
  { value: "MQ", label: "MARTINICA" },
  { value: "MU", label: "MAURICIO" },
  { value: "MR", label: "MAURITANIA" },
  { value: "YT", label: "MAYOTTE" },
  { value: "MX", label: "MÉXICO" },
  { value: "FM", label: "MICRONESIA" },
  { value: "MD", label: "MOLDAVIA" },
  { value: "MC", label: "MÓNACO" },
  { value: "MN", label: "MONGOLIA" },
  { value: "ME", label: "MONTENEGRO" },
  { value: "MS", label: "MONTSERRAT" },
  { value: "MZ", label: "MOZAMBIQUE" },
  { value: "MM", label: "MYANMAR" },
  { value: "NA", label: "NAMIBIA" },
  { value: "NR", label: "NAURU" },
  { value: "NP", label: "NEPAL" },
  { value: "NI", label: "NICARAGUA" },
  { value: "NE", label: "NÍGER" },
  { value: "NG", label: "NIGERIA" },
  { value: "NU", label: "NIUE" },
  { value: "NO", label: "NORUEGA" },
  { value: "NC", label: "NUEVA CALEDONIA" },
  { value: "NZ", label: "NUEVA ZELANDA" },
  { value: "OM", label: "OMÁN" },
  { value: "NL", label: "PAÍSES BAJOS" },
  { value: "PK", label: "PAKISTÁN" },
  { value: "PW", label: "PALAOS" },
  { value: "PS", label: "PALESTINA" },
  { value: "PA", label: "PANAMÁ" },
  { value: "PG", label: "PAPÚA NUEVA GUINEA" },
  { value: "PY", label: "PARAGUAY" },
  { value: "PE", label: "PERÚ" },
  { value: "PF", label: "POLINESIA FRANCESA" },
  { value: "PL", label: "POLONIA" },
  { value: "PT", label: "PORTUGAL" },
  { value: "PR", label: "PUERTO RICO" },
  { value: "QA", label: "QATAR" },
  { value: "GB", label: "REINO UNIDO" },
  { value: "CF", label: "REPÚBLICA CENTROAFRICANA" },
  { value: "CZ", label: "REPÚBLICA CHECA" },
  { value: "CD", label: "REPÚBLICA DEMOCRÁTICA DEL CONGO" },
  { value: "DO", label: "REPÚBLICA DOMINICANA" },
  { value: "RE", label: "REUNIÓN" },
  { value: "RW", label: "RUANDA" },
  { value: "RO", label: "RUMANÍA" },
  { value: "RU", label: "RUSIA" },
  { value: "EH", label: "SAHARA OCCIDENTAL" },
  { value: "WS", label: "SAMOA" },
  { value: "AS", label: "SAMOA AMERICANA" },
  { value: "BL", label: "SAN BARTOLOMÉ" },
  { value: "KN", label: "SAN CRISTÓBAL Y NIEVES" },
  { value: "SM", label: "SAN MARINO" },
  { value: "MF", label: "SAN MARTÍN" },
  { value: "PM", label: "SAN PEDRO Y MIQUELÓN" },
  { value: "VC", label: "SAN VICENTE Y LAS GRANADINAS" },
  { value: "SH", label: "SANTA ELENA, ASCENSIÓN Y TRISTÁN DE ACUÑA" },
  { value: "LC", label: "SANTA LUCÍA" },
  { value: "ST", label: "SANTO TOMÉ Y PRÍNCIPE" },
  { value: "SN", label: "SENEGAL" },
  { value: "RS", label: "SERBIA" },
  { value: "SC", label: "SEYCHELLES" },
  { value: "SL", label: "SIERRA LEONA" },
  { value: "SG", label: "SINGAPUR" },
  { value: "SX", label: "SINT MAARTEN" },
  { value: "SY", label: "SIRIA" },
  { value: "SO", label: "SOMALIA" },
  { value: "LK", label: "SRI LANKA" },
  { value: "SZ", label: "SUAZILANDIA" },
  { value: "ZA", label: "SUDÁFRICA" },
  { value: "SD", label: "SUDÁN" },
  { value: "SS", label: "SUDÁN DEL SUR" },
  { value: "SE", label: "SUECIA" },
  { value: "CH", label: "SUIZA" },
  { value: "SR", label: "SURINAM" },
  { value: "SJ", label: "SVALBARD Y JAN MAYEN" },
  { value: "TH", label: "TAILANDIA" },
  { value: "TW", label: "TAIWÁN" },
  { value: "TZ", label: "TANZANIA" },
  { value: "TJ", label: "TAYIKISTÁN" },
  { value: "IO", label: "TERRITORIO BRITÁNICO DEL OCÉANO ÍNDICO" },
  { value: "TF", label: "TERRITORIOS AUSTRALES FRANCESES" },
  { value: "TL", label: "TIMOR ORIENTAL" },
  { value: "TG", label: "TOGO" },
  { value: "TK", label: "TOKELAU" },
  { value: "TO", label: "TONGA" },
  { value: "TT", label: "TRINIDAD Y TOBAGO" },
  { value: "TN", label: "TÚNEZ" },
  { value: "TM", label: "TURKMENISTÁN" },
  { value: "TR", label: "TURQUÍA" },
  { value: "TV", label: "TUVALU" },
  { value: "UA", label: "UCRANIA" },
  { value: "UG", label: "UGANDA" },
  { value: "UY", label: "URUGUAY" },
  { value: "UZ", label: "UZBEKISTÁN" },
  { value: "VU", label: "VANUATU" },
  { value: "VE", label: "VENEZUELA" },
  { value: "VN", label: "VIETNAM" },
  { value: "WF", label: "WALLIS Y FUTUNA" },
  { value: "YE", label: "YEMEN" },
  { value: "DJ", label: "YIBUTI" },
  { value: "ZM", label: "ZAMBIA" },
  { value: "ZW", label: "ZIMBABUE" }
]

const nationalityOptionsEN: Nationality[] = [
  { value: "", label: "-- Select Nationality --" },
  { value: "AF", label: "AFGHANISTAN" },
  { value: "AL", label: "ALBANIA" },
  { value: "DE", label: "GERMANY" },
  { value: "AD", label: "ANDORRA" },
  { value: "AO", label: "ANGOLA" },
  { value: "AI", label: "ANGUILLA" },
  { value: "AQ", label: "ANTARCTICA" },
  { value: "AG", label: "ANTIGUA AND BARBUDA" },
  { value: "SA", label: "SAUDI ARABIA" },
  { value: "DZ", label: "ALGERIA" },
  { value: "AR", label: "ARGENTINA" },
  { value: "AM", label: "ARMENIA" },
  { value: "AW", label: "ARUBA" },
  { value: "AU", label: "AUSTRALIA" },
  { value: "AT", label: "AUSTRIA" },
  { value: "AZ", label: "AZERBAIJAN" },
  { value: "BS", label: "BAHAMAS" },
  { value: "BD", label: "BANGLADESH" },
  { value: "BB", label: "BARBADOS" },
  { value: "BH", label: "BAHRAIN" },
  { value: "BE", label: "BELGIUM" },
  { value: "BZ", label: "BELIZE" },
  { value: "BJ", label: "BENIN" },
  { value: "BM", label: "BERMUDA" },
  { value: "BY", label: "BELARUS" },
  { value: "BO", label: "BOLIVIA" },
  { value: "BA", label: "BOSNIA AND HERZEGOVINA" },
  { value: "BW", label: "BOTSWANA" },
  { value: "BR", label: "BRAZIL" },
  { value: "BN", label: "BRUNEI" },
  { value: "BG", label: "BULGARIA" },
  { value: "BF", label: "BURKINA FASO" },
  { value: "BI", label: "BURUNDI" },
  { value: "BT", label: "BHUTAN" },
  { value: "CV", label: "CAPE VERDE" },
  { value: "KH", label: "CAMBODIA" },
  { value: "CM", label: "CAMEROON" },
  { value: "CA", label: "CANADA" },
  { value: "TD", label: "CHAD" },
  { value: "CL", label: "CHILE" },
  { value: "CN", label: "CHINA" },
  { value: "CY", label: "CYPRUS" },
  { value: "VA", label: "VATICAN CITY" },
  { value: "CO", label: "COLOMBIA" },
  { value: "KM", label: "COMOROS" },
  { value: "CG", label: "CONGO" },
  { value: "KP", label: "NORTH KOREA" },
  { value: "KR", label: "SOUTH KOREA" },
  { value: "CI", label: "IVORY COAST" },
  { value: "CR", label: "COSTA RICA" },
  { value: "HR", label: "CROATIA" },
  { value: "CU", label: "CUBA" },
  { value: "CW", label: "CURAÇAO" },
  { value: "DK", label: "DENMARK" },
  { value: "DM", label: "DOMINICA" },
  { value: "EC", label: "ECUADOR" },
  { value: "EG", label: "EGYPT" },
  { value: "SV", label: "EL SALVADOR" },
  { value: "AE", label: "UNITED ARAB EMIRATES" },
  { value: "ER", label: "ERITREA" },
  { value: "SK", label: "SLOVAKIA" },
  { value: "SI", label: "SLOVENIA" },
  { value: "ES", label: "SPAIN" },
  { value: "US", label: "UNITED STATES" },
  { value: "EE", label: "ESTONIA" },
  { value: "ET", label: "ETHIOPIA" },
  { value: "PH", label: "PHILIPPINES" },
  { value: "FI", label: "FINLAND" },
  { value: "FJ", label: "FIJI" },
  { value: "FR", label: "FRANCE" },
  { value: "GA", label: "GABON" },
  { value: "GM", label: "GAMBIA" },
  { value: "GE", label: "GEORGIA" },
  { value: "GH", label: "GHANA" },
  { value: "GI", label: "GIBRALTAR" },
  { value: "GD", label: "GRENADA" },
  { value: "GR", label: "GREECE" },
  { value: "GL", label: "GREENLAND" },
  { value: "GP", label: "GUADELOUPE" },
  { value: "GU", label: "GUAM" },
  { value: "GT", label: "GUATEMALA" },
  { value: "GF", label: "FRENCH GUIANA" },
  { value: "GG", label: "GUERNSEY" },
  { value: "GN", label: "GUINEA" },
  { value: "GQ", label: "EQUATORIAL GUINEA" },
  { value: "GW", label: "GUINEA-BISSAU" },
  { value: "GY", label: "GUYANA" },
  { value: "HT", label: "HAITI" },
  { value: "HN", label: "HONDURAS" },
  { value: "HK", label: "HONG KONG" },
  { value: "HU", label: "HUNGARY" },
  { value: "IN", label: "INDIA" },
  { value: "ID", label: "INDONESIA" },
  { value: "IR", label: "IRAN" },
  { value: "IQ", label: "IRAQ" },
  { value: "IE", label: "IRELAND" },
  { value: "BV", label: "BOUVET ISLAND" },
  { value: "IM", label: "ISLE OF MAN" },
  { value: "CX", label: "CHRISTMAS ISLAND" },
  { value: "NF", label: "NORFOLK ISLAND" },
  { value: "IS", label: "ICELAND" },
  { value: "BM_ISLANDS", label: "BERMUDA ISLANDS" },
  { value: "KY", label: "CAYMAN ISLANDS" },
  { value: "CC", label: "COCOS (KEELING) ISLANDS" },
  { value: "CK", label: "COOK ISLANDS" },
  { value: "FO", label: "FAROE ISLANDS" },
  { value: "GS", label: "SOUTH GEORGIA AND THE SOUTH SANDWICH ISLANDS" },
  { value: "HM", label: "HEARD ISLAND AND MCDONALD ISLANDS" },
  { value: "FK", label: "FALKLAND ISLANDS" },
  { value: "MP", label: "NORTHERN MARIANA ISLANDS" },
  { value: "MH", label: "MARSHALL ISLANDS" },
  { value: "PN", label: "PITCAIRN ISLANDS" },
  { value: "SB", label: "SOLOMON ISLANDS" },
  { value: "TC", label: "TURKS AND CAICOS ISLANDS" },
  { value: "UM", label: "UNITED STATES MINOR OUTLYING ISLANDS" },
  { value: "VG", label: "BRITISH VIRGIN ISLANDS" },
  { value: "VI", label: "U.S. VIRGIN ISLANDS" },
  { value: "IL", label: "ISRAEL" },
  { value: "IT", label: "ITALY" },
  { value: "JM", label: "JAMAICA" },
  { value: "JP", label: "JAPAN" },
  { value: "JE", label: "JERSEY" },
  { value: "JO", label: "JORDAN" },
  { value: "KZ", label: "KAZAKHSTAN" },
  { value: "KE", label: "KENYA" },
  { value: "KG", label: "KYRGYZSTAN" },
  { value: "KI", label: "KIRIBATI" },
  { value: "KW", label: "KUWAIT" },
  { value: "LA", label: "LAOS" },
  { value: "LS", label: "LESOTHO" },
  { value: "LV", label: "LATVIA" },
  { value: "LB", label: "LEBANON" },
  { value: "LR", label: "LIBERIA" },
  { value: "LY", label: "LIBYA" },
  { value: "LI", label: "LIECHTENSTEIN" },
  { value: "LT", label: "LITHUANIA" },
  { value: "LU", label: "LUXEMBOURG" },
  { value: "MO", label: "MACAO" },
  { value: "MK", label: "NORTH MACEDONIA" },
  { value: "MG", label: "MADAGASCAR" },
  { value: "MY", label: "MALAYSIA" },
  { value: "MW", label: "MALAWI" },
  { value: "MV", label: "MALDIVES" },
  { value: "ML", label: "MALI" },
  { value: "MT", label: "MALTA" },
  { value: "MA", label: "MOROCCO" },
  { value: "MQ", label: "MARTINIQUE" },
  { value: "MU", label: "MAURITIUS" },
  { value: "MR", label: "MAURITANIA" },
  { value: "YT", label: "MAYOTTE" },
  { value: "MX", label: "MEXICO" },
  { value: "FM", label: "MICRONESIA" },
  { value: "MD", label: "MOLDOVA" },
  { value: "MC", label: "MONACO" },
  { value: "MN", label: "MONGOLIA" },
  { value: "ME", label: "MONTENEGRO" },
  { value: "MS", label: "MONTSERRAT" },
  { value: "MZ", label: "MOZAMBIQUE" },
  { value: "MM", label: "MYANMAR" },
  { value: "NA", label: "NAMIBIA" },
  { value: "NR", label: "NAURU" },
  { value: "NP", label: "NEPAL" },
  { value: "NI", label: "NICARAGUA" },
  { value: "NE", label: "NIGER" },
  { value: "NG", label: "NIGERIA" },
  { value: "NU", label: "NIUE" },
  { value: "NO", label: "NORWAY" },
  { value: "NC", label: "NEW CALEDONIA" },
  { value: "NZ", label: "NEW ZEALAND" },
  { value: "OM", label: "OMAN" },
  { value: "NL", label: "NETHERLANDS" },
  { value: "PK", label: "PAKISTAN" },
  { value: "PW", label: "PALAU" },
  { value: "PS", label: "PALESTINE" },
  { value: "PA", label: "PANAMA" },
  { value: "PG", label: "PAPUA NEW GUINEA" },
  { value: "PY", label: "PARAGUAY" },
  { value: "PE", label: "PERU" },
  { value: "PF", label: "FRENCH POLYNESIA" },
  { value: "PL", label: "POLAND" },
  { value: "PT", label: "PORTUGAL" },
  { value: "PR", label: "PUERTO RICO" },
  { value: "QA", label: "QATAR" },
  { value: "GB", label: "UNITED KINGDOM" },
  { value: "CF", label: "CENTRAL AFRICAN REPUBLIC" },
  { value: "CZ", label: "CZECH REPUBLIC" },
  { value: "CD", label: "DEMOCRATIC REPUBLIC OF THE CONGO" },
  { value: "DO", label: "DOMINICAN REPUBLIC" },
  { value: "RE", label: "RÉUNION" },
  { value: "RW", label: "RWANDA" },
  { value: "RO", label: "ROMANIA" },
  { value: "RU", label: "RUSSIA" },
  { value: "EH", label: "WESTERN SAHARA" },
  { value: "WS", label: "SAMOA" },
  { value: "AS", label: "AMERICAN SAMOA" },
  { value: "BL", label: "SAINT BARTHÉLEMY" },
  { value: "KN", label: "SAINT KITTS AND NEVIS" },
  { value: "SM", label: "SAN MARINO" },
  { value: "MF", label: "SAINT MARTIN" },
  { value: "PM", label: "SAINT PIERRE AND MIQUELON" },
  { value: "VC", label: "SAINT VINCENT AND THE GRENADINES" },
  { value: "SH", label: "SAINT HELENA, ASCENSION AND TRISTAN DA CUNHA" },
  { value: "LC", label: "SAINT LUCIA" },
  { value: "ST", label: "SAO TOME AND PRINCIPE" },
  { value: "SN", label: "SENEGAL" },
  { value: "RS", label: "SERBIA" },
  { value: "SC", label: "SEYCHELLES" },
  { value: "SL", label: "SIERRA LEONE" },
  { value: "SG", label: "SINGAPORE" },
  { value: "SX", label: "SINT MAARTEN" },
  { value: "SY", label: "SYRIA" },
  { value: "SO", label: "SOMALIA" },
  { value: "LK", label: "SRI LANKA" },
  { value: "SZ", label: "ESWATINI" },
  { value: "ZA", label: "SOUTH AFRICA" },
  { value: "SD", label: "SUDAN" },
  { value: "SS", label: "SOUTH SUDAN" },
  { value: "SE", label: "SWEDEN" },
  { value: "CH", label: "SWITZERLAND" },
  { value: "SR", label: "SURINAME" },
  { value: "SJ", label: "SVALBARD AND JAN MAYEN" },
  { value: "TH", label: "THAILAND" },
  { value: "TW", label: "TAIWAN" },
  { value: "TZ", label: "TANZANIA" },
  { value: "TJ", label: "TAJIKISTAN" },
  { value: "IO", label: "BRITISH INDIAN OCEAN TERRITORY" },
  { value: "TF", label: "FRENCH SOUTHERN TERRITORIES" },
  { value: "TL", label: "EAST TIMOR" },
  { value: "TG", label: "TOGO" },
  { value: "TK", label: "TOKELAU" },
  { value: "TO", label: "TONGA" },
  { value: "TT", label: "TRINIDAD AND TOBAGO" },
  { value: "TN", label: "TUNISIA" },
  { value: "TM", label: "TURKMENISTAN" },
  { value: "TR", label: "TURKEY" },
  { value: "TV", label: "TUVALU" },
  { value: "UA", label: "UKRAINE" },
  { value: "UG", label: "UGANDA" },
  { value: "UY", label: "URUGUAY" },
  { value: "UZ", label: "UZBEKISTAN" },
  { value: "VU", label: "VANUATU" },
  { value: "VE", label: "VENEZUELA" },
  { value: "VN", label: "VIETNAM" },
  { value: "WF", label: "WALLIS AND FUTUNA" },
  { value: "YE", label: "YEMEN" },
  { value: "DJ", label: "DJIBOUTI" },
  { value: "ZM", label: "ZAMBIA" },
  { value: "ZW", label: "ZIMBABWE" }
]

export function RegistrationForm() {
  const { t, lang } = useLanguage()
  const [selectedNationality, setSelectedNationality] = useState<Nationality | null>(null)
  const [digits, setDigits] = useState<string[]>(Array(9).fill(""))
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const nationalityOptions = useMemo(() => lang === "en" ? nationalityOptionsEN : nationalityOptionsES, [lang])

  const handleDigitChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newDigits = [...digits]
      newDigits[index] = value
      setDigits(newDigits)

      // Auto-focus next input
      if (value && index < 8) {
        const nextInput = document.getElementById(`digit-${index + 1}`)
        nextInput?.focus()
      }
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      const prevInput = document.getElementById(`digit-${index - 1}`)
      prevInput?.focus()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!selectedNationality) {
      setError(t("error_select_nationality"))
      return
    }

    const registrationNumber = digits.join("")

    // Validate that all 9 digits are filled
    if (registrationNumber.length !== 9) {
      setError(t("form_error_digits"))
      return
    }

    setIsLoading(true)

    try {
      // Redirect to case information page with both registration number and nationality
      router.push(`/case-information?registration=${registrationNumber}&nationality=${selectedNationality.value}`)
    } catch (error) {
      setError(t("form_error_generic"))
      setIsLoading(false)
    }
  }

  return (
    <div className="px-8 py-16 flex items-center justify-center min-h-full">
      <div className="bg-white rounded-lg p-6 sm:p-8 w-full max-w-md">
        <h3 className="text-xl font-semibold text-slate-900 mb-6 text-center">
          {t("form_title")}
        </h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-3">
              <label className="text-sm font-medium text-slate-700">{t("form_label")}</label>
              <span className="text-red-500 text-sm">*{t("required")}</span>
              <button type="button" className="text-blue-600 hover:text-blue-800">
                <HelpCircle className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-blue-600 mb-4">
              <button type="button" className="underline">
                {t("what_is_a_number")}
              </button>
            </div>

            <div className="grid grid-cols-9 gap-1 mb-6 px-2 w-full">
              {digits.map((digit, index) => (
                <input
                  key={index}
                  id={`digit-${index}`}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={digit}
                  onChange={(e) => handleDigitChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-7 h-9 sm:w-8 sm:h-10 md:w-9 md:h-11 border-2 border-gray-300 rounded text-center text-xs sm:text-sm font-semibold focus:border-blue-500 focus:outline-none transition-colors"
                  maxLength={1}
                  disabled={isLoading}
                  autoComplete="off"
                />
              ))}
            </div>

            <fieldset className="my-8">
              <div className="flex flex-wrap justify-between md:text-base text-sm mb-4">
                <div>
                  <span className="font-bold">{t("nationality")}</span>
                  <span className="text-red italic">*{t("required")}</span>
                </div>
                <div className="flex flex-nowrap">
                  <Image
                    src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMC4yODEiIGhlaWdodD0iMjAuMjgxIiB2aWV3Qm94PSIwIDAgMjAuMjgxIDIwLjI4MSI+DQogIDxwYXRoIGlkPSJJY29uX2F3ZXNvbWUtcXVlc3Rpb24tY2lyY2xlIiBkYXRhLW5hbWU9Ikljb24gYXdlc29tZS1xdWVzdGlvbi1jaXJjbGUiIGQ9Ik0yMC44NDMsMTAuN0ExMC4xNCwxMC4xNCwwLDEsMSwxMC43LjU2MywxMC4xNCwxMC4xNCwwLDAsMSwyMC44NDMsMTAuN1pNMTAuOTc1LDMuOTE1QTUuMyw1LjMsMCwwLDAsNi4yMDksNi41MjJhLjQ5MS40OTEsMCwwLDAsLjExMS42NjVMNy43MzksOC4yNjNhLjQ5MS40OTEsMCwwLDAsLjY4MS0uMDg3Yy43My0uOTI2LDEuMjMxLTEuNDY0LDIuMzQzLTEuNDY0LjgzNSwwLDEuODY5LjUzOCwxLjg2OSwxLjM0OCwwLC42MTItLjUwNi45MjctMS4zMywxLjM4OS0uOTYyLjUzOS0yLjIzNSwxLjIxLTIuMjM1LDIuODg5VjEyLjVhLjQ5MS40OTEsMCwwLDAsLjQ5MS40OTFoMi4yOWEuNDkxLjQ5MSwwLDAsMCwuNDkxLS40OTF2LS4wNTVjMC0xLjE2NCwzLjQtMS4yMTIsMy40LTQuMzYxQzE1Ljc0LDUuNzE0LDEzLjI4LDMuOTE1LDEwLjk3NSwzLjkxNVpNMTAuNywxNC4wNTZhMS44ODEsMS44ODEsMCwxLDAsMS44ODEsMS44ODFBMS44ODMsMS44ODMsMCwwLDAsMTAuNywxNC4wNTZaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMC41NjMgLTAuNTYzKSIgZmlsbD0iIzA3NjRiZCIvPg0KPC9zdmc+DQo="
                    width={20}
                    height={20}
                    className="mr-1 md:mr-2"
                    alt="Question icon"
                  />
                  <button type="button" className="cursor-pointer italic text-blue whitespace-nowrap">
                    {t("what_is_nationality")}
                  </button>
                </div>
              </div>
              <Select
                options={nationalityOptions}
                value={selectedNationality}
                onChange={(option) => setSelectedNationality(option)}
                placeholder={t("select_nationality")}
                className="mb-6"
                required
                // Estabilizar IDs generados por react-select para evitar
                // mismatches de SSR/CSR en Next.js
                instanceId="registration-nationality-select"
                inputId="registration-nationality-input"
                styles={{
                  control: (base) => ({
                    ...base,
                    minHeight: '42px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '0.375rem',
                    boxShadow: 'none',
                    '&:hover': {
                      borderColor: '#3b82f6'
                    }
                  }),
                  menu: (base) => ({
                    ...base,
                    marginTop: '0',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    border: '1px solid #e5e7eb'
                  }),
                  menuList: (base) => ({
                    ...base,
                    padding: '0',
                    maxHeight: '200px'
                  }),
                  placeholder: (base) => ({
                    ...base,
                    color: '#6b7280',
                    fontSize: '0.875rem'
                  }),
                  option: (base, state) => ({
                    ...base,
                    padding: '8px 12px',
                    backgroundColor: state.isSelected ? '#3b82f6' : 'white',
                    color: state.isSelected ? 'white' : '#374151',
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: state.isSelected ? '#3b82f6' : '#f3f4f6'
                    }
                  })
                }}
                classNames={{
                  control: () => 'border-2 border-gray-200 hover:border-blue-500 transition-colors',
                  placeholder: () => 'text-gray-500 text-sm',
                  input: () => 'text-sm',
                  option: () => 'text-sm'
                }}
              />
            </fieldset>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">{error}</div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded font-semibold hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {isLoading ? t("searching") : t("search")}
            </button>

            {/* Legal Disclaimer */}
            <div className="mt-4 p-3 bg-blue-50 border-l-4 border-blue-500 text-xs text-slate-700 leading-relaxed">
              <p className="font-semibold text-blue-900 mb-1">ℹ️ Info</p>
              <p>{t("info_notice")}</p>
            </div>
            </div>
          </form>
        </div>
      </div>
    )
}
