# Informe Ejecutivo: Análisis de Conversación Digital Electoral (Colombia 2026)

## 1. Introducción y Objetivo
El presente análisis busca identificar las principales conversaciones que se desarrollan alrededor de **Iván Cepeda** y **Abelardo de la Espriella**, dos figuras que representan visiones políticas marcadamente diferentes y que generan altos niveles de interacción en el ecosistema digital colombiano.

**Objetivos del informe:**
*   Analizar narrativas, tendencias y cuestionamientos frecuentes.
*   Identificar oportunidades y riesgos reputacionales.
*   Aportar una visión general del posicionamiento digital de ambos actores.

---

## 2. Análisis de Actor: Iván Cepeda
*Narrativa: Trayectoria ideológica, derechos humanos y defensa de la paz.*

### A. Percepción y Ejes Centrales
*   **Percepción Positiva:** Figura coherente en memoria histórica, justicia social y legitimidad en sectores progresistas.
*   **Críticas y Negatividad:** Asociación con el proceso de paz, continuidad ideológica de Gustavo Petro y cuestionamientos sobre seguridad/orden público.
*   **Ejes Centrales:** Confrontación con el uribismo, retos en la captura del voto de centro y necesidad de mayor conexión con preocupaciones ciudadanas cotidianas.

### B. Estrategia Digital
*   **Hashtags:**
    *   *Marca:* #IvánCepeda, #IvánCepeda2026, #DerechosHumanos, #MemoriaYVerdad.
    *   *Coyuntura/Genéricos:* #Colombia, #Elecciones2026, #PazTotal, #Empleo.
*   **Prioridad de Canales:**
    *   **X (Twitter):** Sala de prensa y debate político en tiempo real.
    *   **Instagram/TikTok:** Storytelling, territorio y cercanía visual.
    *   **Facebook:** Movilización regional (segmento >35 años).
    *   **YouTube:** Archivo histórico y discursos de alta credibilidad.

### C. Riesgos y Señalamientos
*   Asociación ideológica con las FARC y el chavismo.
*   Cuestionamientos por presunta manipulación de testigos y uso judicial de la política.
*   Críticas por ausentismo legislativo y falta de experiencia ejecutiva.

---

## 3. Análisis de Actor: Abelardo de la Espriella
*Narrativa: "Mano dura", autoridad, ruptura con la política tradicional.*

### A. Percepción y Ejes Centrales
*   **Percepción Positiva:** Figura de autoridad, ruptura con élites y sólida trayectoria jurídica.
*   **Críticas y Negatividad:** Perfil confrontacional que profundiza la polarización, dudas sobre independencia política y falta de experiencia administrativa.
*   **Ejes Centrales:** Derecha fuerte, autoridad y seguridad; alto desempeño en opinión directa.

### B. Estrategia Digital
*   **Hashtags:**
    *   *Marca:* #AbelardoDeLaEspriella, #DeLaEspriella, #SinCorrectismo.
    *   *Temáticos/Viral:* #Libertad, #EstadoDeDerecho, #LibreMercado, #Viral, #TikTok.
*   **Prioridad de Canales:**
    *   **TikTok:** Crecimiento masivo con micro-explicaciones.
    *   **X (Twitter) e Instagram:** Opinión rápida y carruseles explicativos legales.
    *   **YouTube:** Profundidad y autoridad jurídica.

### C. Riesgos y Señalamientos
*   Historial de representación jurídica de personajes cuestionables (Caso DMG, entorno Alex Saab).
*   Señalamientos por discurso "ultraderechista" y tono agresivo/polarizante.
*   Cuestionamientos por exceso de protagonismo mediático y falta de experiencia administrativa.

---

## 4. Síntesis Comparativa: Competencia y Estrategia

| Dimensión | Iván Cepeda | Abelardo de la Espriella |
| :--- | :--- | :--- |
| **Arquetipo** | Defensor de Derechos Humanos / Progresista | Abogado mediático / Derecha liberal-conservadora |
| **Punto fuerte** | Coherencia histórica | Autoridad y confrontación |
| **Reto principal** | Evitar ser percibido como "continuidad" | Superar la imagen de "figura mediática vs política" |
| **Red clave** | X (debate) / TikTok (cercanía) | TikTok (masividad) / X (opinión) |

### Recomendaciones Estratégicas
---

## 5. Alineación Técnica y Operativa
Este proyecto ha sido diseñado como una herramienta de inteligencia estratégica para operacionalizar y visualizar los hallazgos descritos en este informe. A continuación, se detalla cómo los componentes técnicos se alinean con la estrategia:

### A. Estructuración de Datos (`/lib/data/`)
*   **Propósito:** La base de datos (candidateData, sentimentData, narrativaData, reputationData) traduce la información cualitativa del análisis (puntos de dolor, fortalezas, ejes temáticos) en estructuras de datos procesables para el monitoreo en tiempo real.

### B. Dashboard de Monitoreo (`/components/dashboard/`)
*   **PresidentialComparison.tsx:** Materializa la tabla de síntesis comparativa, permitiendo visualizar los arquetipos y retos de cada candidato.
*   **ReputationRisk.tsx:** Ejecuta el monitoreo de los "Señalamientos Negativos" detectados, permitiendo una gestión de riesgos proactiva.
*   **NarrativeRadar.tsx & AIInsights.tsx:** Visualizan el posicionamiento de las narrativas respecto a los ejes temáticos definidos (e.g., seguridad vs DD.HH.).

### C. Visualización Territorial (`/components/map/`)
*   **MapContainer.tsx:** Responde a la necesidad estratégica de medir la movilización regional y el impacto de las narrativas en los diferentes departamentos colombianos, fundamental para el enfoque hiper-local recomendado.

### Resumen de Sinergia
| Hallazgo Estratégico | Componente Técnico de Soporte |
| :--- | :--- |
| **Ejes Temáticos** | `lib/data/` (Estructura de datos) |
| **Riesgos Reputacionales** | `ReputationRisk.tsx` |
| **Comparativa de Candidatos** | `PresidentialComparison.tsx` |
| **Territorialidad** | `MapContainer.tsx` (Mapa interactivo) |

