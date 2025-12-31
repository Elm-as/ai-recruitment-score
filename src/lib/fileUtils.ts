export async function extractTextFromPDF(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = async (e) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer
        const uint8Array = new Uint8Array(arrayBuffer)
        
        let text = ''
        for (let i = 0; i < uint8Array.length; i++) {
          const char = String.fromCharCode(uint8Array[i])
          if (char.match(/[\x20-\x7E\n\r\t]/)) {
            text += char
          }
        }
        
        const cleaned = text
          .replace(/[^\x20-\x7E\n\r\tÀ-ÿ]/g, ' ')
          .replace(/\s+/g, ' ')
          .replace(/\(.*?\)/g, '')
          .replace(/<<.*?>>/g, '')
          .replace(/\/\w+/g, '')
          .trim()
        
        if (cleaned.length < 50) {
          reject(new Error('Le fichier PDF semble vide ou illisible'))
          return
        }
        
        resolve(cleaned)
      } catch (error) {
        reject(new Error('Erreur lors de l\'extraction du texte du PDF'))
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
        
        const scripts = doc.querySelectorAll('script, style, noscript')
        scripts.forEach(el => el.remove())
        
        const text = doc.body.textContent || doc.body.innerText || ''
        const cleaned = text
          .replace(/\s+/g, ' ')
          .replace(/\n+/g, '\n')
          .trim()
        
        if (cleaned.length < 50) {
          reject(new Error('Le fichier HTML semble vide ou illisible'))
          return
        }
        
        resolve(cleaned)
      } catch (error) {
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
