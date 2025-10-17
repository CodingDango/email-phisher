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

export function getVerdictDetails(score) {
  if (score === null || score === undefined) return null;

  let verdictDetails;

    if (score >= 10) {
      verdictDetails = {
        text: 'Critical Risk',
        textColor: 'text-red-600',
        bgColor: 'bg-red-600',
        scoreText: '10+',
        paragraph: 'This email exhibits multiple, severe signs of a malicious phishing attack. Do not click any links or download attachments.'
      };
    } else if (score >= 5) {
      verdictDetails = {
        text: 'High Risk',
        textColor: 'text-red-500',
        bgColor: 'bg-red-500',
        scoreText: `${score}`, // Show the actual score
        paragraph: 'This email shows strong indicators of a phishing attempt. Extreme caution is advised.'
      };
    } else if (score >= 2) { // Changed from >= 2 to catch any single issue
      verdictDetails = {
        text: 'Suspicious',
        textColor: 'text-orange-400',
        bgColor: 'bg-orange-400',
        scoreText: `${score}`, // Show the actual score
        paragraph: 'This email contains elements commonly found in phishing scams. Please verify the sender and links carefully.'
      };
    } else { // This will now only trigger for a score of 0
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

// replyTo can be null. analyzeSender handles this.
export function analyzeEmail(fromHeader, replyTo, body) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const bodyLower = body.toLowerCase();

      const results = {
        score: 0,
        reasons: []
      };

      analyzeKeywords(bodyLower, results);
      analyzeGenericGreetings(bodyLower, results);
      analyzeLinks(bodyLower, results);
      analyzeSender(fromHeader, replyTo, results)

      resolve(results);
    }, 1000);
  })
}

function analyzeSender(fromHeader, replyToHeader, results) {
  const fromRegex = /(.*?)<(.*)>/;
  const match = fromHeader.match(fromRegex);

  if (match) {
    const displayName = match[1].toLowerCase().trim();
    const fromEmail = match[2].toLowerCase();
    
    const trustedNames = ["paypal", "microsoft", "google", "amazon", "apple"];

    if (trustedNames.some(name => displayName.includes(name)) && 
        !trustedNames.some(name => fromEmail.includes(name))) {
      results.score += 5; // High score!
      results.reasons.push(`Potential sender spoofing. Display name is '${displayName}' but email is from '${fromEmail}'.`);
    }
  }

  if (replyToHeader) {
    const fromAddress = match ? match[2] : fromHeader; 
    if (replyToHeader && replyToHeader.toLowerCase() !== fromAddress.toLowerCase()) {
      results.score += 3;
      results.reasons.push(`'Reply-To' address ('${replyToHeader}') does not match 'From' address ('${fromAddress}').`);
    }
  }
}

function analyzeKeywords(textLower, results) {
  const keywords = [
    "urgent", "action required", "verify", "suspended", "locked", "confirm",
    "password", "username", "account", "login", "security", "important",
    "invoice", "payment", "unauthorized", "suspicious"
  ];

  let keywordScore = 0; 
  let foundKeywords = [];

  keywords.forEach(keyword => {
    if (textLower.includes(keyword)) {
      keywordScore += 1;
      foundKeywords.push(keyword);
    }
  });

  if (keywordScore > 0) {
    results.score += 1; 
    results.reasons.push(`Detected high-risk keywords: '${foundKeywords.join(', ')}'`);
  }
}

function analyzeGenericGreetings(textLower, results) {
  const genericGreetings = ["dear customer", "dear user", "valued customer", "dear client"];
  let foundGreeting = false;
  let foundText = "";

  genericGreetings.forEach(greeting => {
    if (textLower.includes(greeting)) {
      foundGreeting = true;
      foundText = greeting; 
    }
  });

  if (foundGreeting) {
    results.score += 1;
    results.reasons.push(`Detected a generic greeting: '${foundText}'`);
  }
}

function runCommonUrlChecks(url, results) {
  const domain = url.hostname.replace('www.', '');

  const shorteners = ["bit.ly", "tinyurl.com", "t.co", "goo.gl"];
  if (shorteners.some(shortener => domain.includes(shortener))) {
    results.score += 2; 
    results.reasons.push(`Link uses a URL shortener: '${domain}'`);
  }

  const ipRegex = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
  if (ipRegex.test(domain)) {
    results.score += 3;
    results.reasons.push(`Link points directly to an IP address: '${domain}'`);
  }
  
  if (url.username || url.password) {
    results.score += 5;
    results.reasons.push(`Link contains embedded username/password.`);
  }

  const suspiciousExtensions = [".zip", ".exe", ".scr", ".js", ".vbs", ".rar"];
  if (suspiciousExtensions.some(ext => url.pathname.toLowerCase().endsWith(ext))) {
    results.score += 4;
    results.reasons.push(`Link points to a suspicious file download: '${url.pathname}'`);
  }
}

function analyzeLinks(text, results) {
  const htmlLinkRegex = /<a\s+(?:[^>]*?\s+)?href="([^"]*)"[^>]*>(.*?)<\/a>/gi;
  let htmlMatch;
  let foundHtmlLinks = false;
  
  while ((htmlMatch = htmlLinkRegex.exec(text)) !== null) {
    foundHtmlLinks = true;
    const href = htmlMatch[1]; 
    const visibleText = htmlMatch[2].replace(/<[^>]*>/g, '').trim(); 

    try {
      const url = new URL(href);
      const linkDomain = url.hostname.replace('www.', '');

      // --- THE NEW, SMARTER MISLEADING LINK CHECK ---
      // 1. Use a regex to find a domain-like pattern in the visible text.
      const textDomainMatch = visibleText.toLowerCase().match(/([a-z0-9]+(?:-[a-z0-9]+)*\.)+[a-z]{2,}/);
      
      if (textDomainMatch) {
        const textDomain = textDomainMatch[0];
        // 2. THE KEY: Check if the link's domain ENDS WITH the text's domain.
        // This allows subdomains like "click.spotify.com" to match "spotify.com".
        if (!linkDomain.endsWith(textDomain)) {
          results.score += 3; 
          results.reasons.push(`Misleading link. Text mentions '${textDomain}' but goes to '${linkDomain}'.`);
        }
      }
      
      // 3. Run all the other standard checks on the URL.
      runCommonUrlChecks(url, results);

    } catch (err) {
      results.score += 1;
      results.reasons.push(`Found a malformed or un-parsable link tag: '${href}'`);
    }
  }

  // --- STRATEGY 2: The Plain Text Fallback ---
  // If no <a> tags were found, scan for raw URLs instead.
  if (!foundHtmlLinks) {
    const plainTextLinkRegex = /(https?:\/\/[^\s"'<>]+)/gi;
    let plainMatch;

    while ((plainMatch = plainTextLinkRegex.exec(text)) !== null) {
      const href = plainMatch[0];

      try {
        const url = new URL(href);
        // We can't check for misleading text, but we can run all our other checks!
        runCommonUrlChecks(url, results);
      } catch (err) {
        // This is less severe for plain text, so no score increase.
        console.warn(`Could not parse plain text URL: ${href}`);
      }
    }
  }
}