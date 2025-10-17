export function countWords(str) {
  if (!str || typeof str !== 'string') {
    return 0;
  }

  const trimmedStr = str.trim();
  
  if (trimmedStr === "") {
    return 0;
  }
  
  return trimmedStr.split(/\s+/).length;
}

export function analyzeEmail(text) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const textLower = text.toLowerCase();

      const analysisResults = {
        score: 0,
        reasons: []
      };

      analyzeKeywords(textLower, analysisResults);
      analyzeGenericGreetings(textLower, analysisResults);
      analyzeLinks(text, analysisResults);

      resolve(analysisResults);
    }, 1000);
  })
}

export function getVerdictDetails(score) {
  if (score === null || score === undefined) return null;

  let verdictDetails = {};

  if (score >= 5) {
    // High Risk State
    verdictDetails = {
      text: 'High Risk',
      textColor: 'text-red-500',
      bgColor: 'bg-red-500',
      scoreText: '5+',
      paragraph: 'This email shows multiple, strong indicators of a phishing attempt. Extreme caution is advised.'
    };
  } else if (score >= 2) {
    // Suspicious State (Range 2-4)
    verdictDetails = {
      text: 'Suspicious',
      textColor: 'text-orange-500',
      bgColor: 'bg-orange-500',
      scoreText: score,
      paragraph: 'This email contains several elements commonly found in phishing scams. Please verify the sender and links carefully.'
    };
  } else {
    // Looks Safe State (Range 0-1)
    verdictDetails = {
      text: 'Looks Safe',
      textColor: 'text-green-500',
      bgColor: 'bg-green-500',
      scoreText: score,
      paragraph: 'Our analysis did not find any common phishing indicators. However, always remain cautious.'
    };
  }

  return verdictDetails;
}

function analyzeKeywords(textLower, results) {
  const keywords = [
    "urgent", "action required", "verify", "suspended", "locked", "confirm",
    "password", "username", "account", "login", "security", "important",
    "invoice", "payment", "unauthorized", "suspicious"
  ];

  keywords.forEach(keyword => {
    if (textLower.includes(keyword)) {
      results.score += 1;
      results.reasons.push(`Detected high-risk keyword: '${keyword}'`);
    }
  });
}

function analyzeGenericGreetings(textLower, results) {
  const genericGreetings = ["dear customer", "dear user", "valued customer", "dear client"];
    
  genericGreetings.forEach(greeting => {
    if (textLower.includes(greeting)) {
      results.score += 1;
      results.reasons.push(`Detected a generic greeting: '${greeting}'`);
    }
  });
}

function analyzeLinks(text, results) {
  const linkRegex = /<a\s+(?:[^>]*?\s+)?href="([^"]*)"[^>]*>(.*?)<\/a>/gi;
  let match;
  
  while ((match = linkRegex.exec(text)) !== null) {
    const href = match[1]; 
    const visibleText = match[2].replace(/<[^>]*>/g, '').trim(); 

    try {
      const url = new URL(href);
      const domain = url.hostname; 
      
      if (visibleText.includes('.') && !visibleText.toLowerCase().includes(domain.replace('www.', ''))) {
        results.score += 3; 
        results.reasons.push(`Found a misleading link. Text says '${visibleText}' but goes to '${domain}'.`);
      }

      const shorteners = ["bit.ly", "tinyurl.com", "t.co", "goo.gl"];
      if (shorteners.some(shortener => domain.includes(shortener))) {
        results.score += 2; 
        results.reasons.push(`Found a link using a URL shortener: '${domain}'`);
      }

    } catch (err) {
      console.log(`Could not parse URL from href: ${href}`);
    }
  }
}