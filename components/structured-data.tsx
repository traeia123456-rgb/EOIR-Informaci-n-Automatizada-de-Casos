"use client"

export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "GovernmentOrganization",
        "@id": "https://www.acis-eoir-justice.org/#organization",
        "name": "Executive Office for Immigration Review",
        "alternateName": "EOIR",
        "url": "https://www.acis-eoir-justice.org",
        "logo": "https://www.acis-eoir-justice.org/logo512.png",
        "description": "Sistema de Información Automatizada de Casos de Inmigración del Tribunal de Inmigración de Estados Unidos",
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "customer service",
          "availableLanguage": ["Spanish", "English"]
        }
      },
      {
        "@type": "WebSite",
        "@id": "https://www.acis-eoir-justice.org/#website",
        "url": "https://www.acis-eoir-justice.org",
        "name": "EOIR - Sistema de Información Automatizada de Casos",
        "description": "Consulta información sobre casos de inmigración en el sistema EOIR",
        "publisher": {
          "@id": "https://www.acis-eoir-justice.org/#organization"
        },
        "inLanguage": ["es", "en"],
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://www.acis-eoir-justice.org/case-information?registration={search_term_string}"
          },
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "WebPage",
        "@id": "https://www.acis-eoir-justice.org/#webpage",
        "url": "https://www.acis-eoir-justice.org",
        "name": "Consulta de Casos de Inmigración EOIR",
        "isPartOf": {
          "@id": "https://www.acis-eoir-justice.org/#website"
        },
        "about": {
          "@id": "https://www.acis-eoir-justice.org/#organization"
        },
        "description": "Consulta el estado de tu caso de inmigración usando tu número de registro (A-Number). Sistema oficial de información automatizada EOIR.",
        "inLanguage": ["es", "en"]
      }
    ]
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
