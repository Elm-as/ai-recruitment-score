interface ExtractedSection {
  skills: string[]
  experience: string[]
  education: string[]
  profile: string[]
  languages: string[]
  certifications: string[]
  projects: string[]
  achievements: string[]
  other: string[]
}

function extractKeyInformation(text: string): ExtractedSection {
  const sections: ExtractedSection = {
    skills: [],
    experience: [],
    education: [],
    profile: [],
    languages: [],
    certifications: [],
    projects: [],
    achievements: [],
    other: []
  }
  
  const skillKeywords = /\b(compétence|skill|technolog|langage|language|framework|tool|outil|maîtrise|expertise|programming|développement|development|stack|api|database|frontend|backend|fullstack)/i
  const experienceKeywords = /\b(expérience|experience|poste|position|travail|work|emploi|job|mission|années|years|depuis|since|responsable|responsible|manager|développeur|developer|engineer|ingénieur)/i
  const educationKeywords = /\b(formation|education|diplôme|degree|université|university|école|school|étude|master|licence|bachelor|bac|phd|doctorat|ingénieur)/i
  const profileKeywords = /\b(profil|profile|résumé|summary|objectif|objective|about|à propos|présentation|introduction|passionné|passionate)/i
  const languageKeywords = /\b(langue|language|anglais|english|français|french|espagnol|spanish|bilingue|bilingual|courant|fluent|natif|native)/i
  const certificationKeywords = /\b(certification|certified|certificate|diplôme|award|prix|distinction|accréditation|accredited)/i
  const projectKeywords = /\b(projet|project|réalisation|achievement|développé|developed|créé|created|construit|built|application|site|plateforme|platform|système|system)/i
  const achievementKeywords = /\b(réussite|success|amélioration|improvement|augmentation|increase|réduction|reduction|optimisation|optimization|résultat|result|impact|performance)/i
  
  const lines = text.split(/[\n\r]+|\.(?=\s+[A-Z])/)
  
  for (const line of lines) {
    const trimmedLine = line.trim()
    if (trimmedLine.length < 15) continue
    
    const lowercaseLine = trimmedLine.toLowerCase()
    
    if (skillKeywords.test(lowercaseLine)) {
      sections.skills.push(trimmedLine)
    }
    if (experienceKeywords.test(lowercaseLine)) {
      sections.experience.push(trimmedLine)
    }
    if (educationKeywords.test(lowercaseLine)) {
      sections.education.push(trimmedLine)
    }
    if (profileKeywords.test(lowercaseLine)) {
      sections.profile.push(trimmedLine)
    }
    if (languageKeywords.test(lowercaseLine)) {
      sections.languages.push(trimmedLine)
    }
    if (certificationKeywords.test(lowercaseLine)) {
      sections.certifications.push(trimmedLine)
    }
    if (projectKeywords.test(lowercaseLine)) {
      sections.projects.push(trimmedLine)
    }
    if (achievementKeywords.test(lowercaseLine)) {
      sections.achievements.push(trimmedLine)
    }
  }
  
  return sections
}

function buildStructuredSummary(sections: ExtractedSection): string {
  let summary = ''
  
  if (sections.profile.length > 0) {
    summary += 'PROFIL: ' + sections.profile.slice(0, 3).join('. ') + '\n\n'
  }
  
  if (sections.skills.length > 0) {
    summary += 'COMPÉTENCES: ' + sections.skills.slice(0, 25).join('. ') + '\n\n'
  }
  
  if (sections.experience.length > 0) {
    summary += 'EXPÉRIENCE: ' + sections.experience.slice(0, 20).join('. ') + '\n\n'
  }
  
  if (sections.projects.length > 0) {
    summary += 'PROJETS: ' + sections.projects.slice(0, 15).join('. ') + '\n\n'
  }
  
  if (sections.achievements.length > 0) {
    summary += 'RÉALISATIONS: ' + sections.achievements.slice(0, 10).join('. ') + '\n\n'
  }
  
  if (sections.education.length > 0) {
    summary += 'FORMATION: ' + sections.education.slice(0, 8).join('. ') + '\n\n'
  }
  
  if (sections.certifications.length > 0) {
    summary += 'CERTIFICATIONS: ' + sections.certifications.slice(0, 8).join('. ') + '\n\n'
  }
  
  if (sections.languages.length > 0) {
    summary += 'LANGUES: ' + sections.languages.slice(0, 5).join('. ') + '\n\n'
  }
  
  return summary.trim()
}

export function optimizeTextForAnalysis(text: string, maxTokens: number = 4500): string {
  const cleanedText = text
    .replace(/\s+/g, ' ')
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
    .trim()
  
  const words = cleanedText.split(/\s+/)
  const estimatedTokens = Math.ceil(words.length * 1.3)
  
  if (estimatedTokens <= maxTokens) {
    return cleanedText
  }
  
  const sections = extractKeyInformation(cleanedText)
  const structuredSummary = buildStructuredSummary(sections)
  
  const summaryWords = structuredSummary.split(/\s+/)
  const summaryTokens = Math.ceil(summaryWords.length * 1.3)
  
  if (summaryTokens <= maxTokens) {
    return structuredSummary
  }
  
  const maxWords = Math.floor(maxTokens / 1.3)
  const truncatedWords = summaryWords.slice(0, maxWords)
  return truncatedWords.join(' ')
}

function extractTextWithBetterEncoding(uint8Array: Uint8Array): string {
  const decoder = new TextDecoder('utf-8', { fatal: false })
  let text = decoder.decode(uint8Array)
  
  if (!text || text.length < 50) {
    const asciiText: string[] = []
    for (let i = 0; i < uint8Array.length; i++) {
      const byte = uint8Array[i]
      if ((byte >= 32 && byte <= 126) || byte === 10 || byte === 13 || byte === 9 || (byte >= 192 && byte <= 255)) {
        asciiText.push(String.fromCharCode(byte))
      }
    }
    text = asciiText.join('')
  }
  
  return text
}

function cleanPDFText(rawText: string): string {
  let text = rawText
    .replace(/stream[\s\S]*?endstream/gi, '')
    .replace(/obj[\s\S]*?endobj/gi, '')
    .replace(/<<[\s\S]*?>>/g, '')
    .replace(/\/[A-Z][a-zA-Z0-9]*/g, '')
    .replace(/\[[\d\s.]+\]/g, '')
    .replace(/\(([^()]+)\)/g, '$1')
    .replace(/\d{10,}/g, '')
    .replace(/[^\x20-\x7EÀ-ÿ\n\r\t]/g, ' ')
  
  text = text
    .split(/[\n\r]+/)
    .map(line => line.trim())
    .filter(line => {
      if (line.length < 2) return false
      if (/^[\d\s\-_.]+$/.test(line)) return false
      if (/^[A-Z]{10,}$/.test(line)) return false
      return true
    })
    .join('\n')
  
  text = text.replace(/\s+/g, ' ').trim()
  
  const sentences = text.split(/(?<=[.!?])\s+/)
  const meaningfulSentences = sentences.filter(s => {
    const words = s.split(/\s+/)
    return words.length >= 3 && /[a-zA-ZÀ-ÿ]{3,}/.test(s)
  })
  
  return meaningfulSentences.join(' ')
}

export async function extractTextFromPDF(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = async (e) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer
        const uint8Array = new Uint8Array(arrayBuffer)
        
        const rawText = extractTextWithBetterEncoding(uint8Array)
        
        if (!rawText || rawText.length < 30) {
          reject(new Error('Le fichier PDF semble vide ou illisible. Assurez-vous qu\'il contient du texte extractible.'))
          return
        }
        
        const cleaned = cleanPDFText(rawText)
        
        if (cleaned.length < 50) {
          reject(new Error('Le contenu extrait du PDF est trop court. Le fichier pourrait être protégé ou contenir uniquement des images.'))
          return
        }
        
        console.log(`PDF text extracted: ${cleaned.length} characters`)
        
        const optimized = optimizeTextForAnalysis(cleaned)
        
        console.log(`PDF text optimized: ${optimized.length} characters`)
        
        resolve(optimized)
      } catch (error) {
        console.error('PDF extraction error:', error)
        reject(new Error('Erreur lors de l\'extraction du texte du PDF. Le fichier pourrait être corrompu ou protégé.'))
      }
    }
    
    reader.onerror = () => {
      reject(new Error('Erreur lors de la lecture du fichier'))
    }
    
    reader.readAsArrayBuffer(file)
  })
}

export async function extractTextFromHTML(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      try {
        const html = e.target?.result as string
        const parser = new DOMParser()
        const doc = parser.parseFromString(html, 'text/html')
        
        const scripts = doc.querySelectorAll('script, style, noscript, iframe, link, meta')
        scripts.forEach(el => el.remove())
        
        const mainContent = doc.querySelector('main, article, .content, #content, body') || doc.body
        
        const text = mainContent.textContent || ''
        
        const cleaned = text
          .replace(/\s+/g, ' ')
          .replace(/\n+/g, '\n')
          .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, '')
          .trim()
        
        if (cleaned.length < 50) {
          reject(new Error('Le fichier HTML semble vide ou illisible'))
          return
        }
        
        console.log(`HTML text extracted: ${cleaned.length} characters`)
        
        const optimized = optimizeTextForAnalysis(cleaned)
        
        console.log(`HTML text optimized: ${optimized.length} characters`)
        
        resolve(optimized)
      } catch (error) {
        console.error('HTML extraction error:', error)
        reject(new Error('Erreur lors de l\'extraction du texte du HTML'))
      }
    }
    
    reader.onerror = () => {
      reject(new Error('Erreur lors de la lecture du fichier'))
    }
    
    reader.readAsText(file)
  })
}

export async function extractTextFromFile(file: File): Promise<{ text: string; fileType: 'pdf' | 'html' }> {
  const fileType = file.type
  const fileName = file.name.toLowerCase()
  
  if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
    const text = await extractTextFromPDF(file)
    return { text, fileType: 'pdf' }
  } else if (fileType === 'text/html' || fileName.endsWith('.html') || fileName.endsWith('.htm')) {
    const text = await extractTextFromHTML(file)
    return { text, fileType: 'html' }
  } else {
    throw new Error('Format de fichier non supporté. Utilisez PDF ou HTML uniquement.')
  }
}

export function validateFileSize(file: File, maxSizeMB: number = 5): boolean {
  const maxBytes = maxSizeMB * 1024 * 1024
  return file.size <= maxBytes
}
