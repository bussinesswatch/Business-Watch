const { readFileSync, writeFileSync } = require('fs');
const { join } = require('path');
const https = require('https');
const http = require('http');

// Read existing working_file.json to get URLs
const workingFilePath = join(__dirname, '../data/working_file.json');
const existingData = JSON.parse(readFileSync(workingFilePath, 'utf8'));

// Extract URLs from existing data
const workingUrls = existingData.tenders.map(t => t.gazette_url).filter(url => url);

console.log(`Found ${workingUrls.length} URLs to scrape from working_file.json`);

// Extract ID from URL
function extractId(url) {
  const match = url.match(/(\d+)/);
  return match ? match[1] : 'unknown';
}

// Fetch URL content
function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5'
      },
      timeout: 15000
    }, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Status: ${res.statusCode}`));
        return;
      }
      
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    });
    
    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Timeout'));
    });
  });
}

// Scrape a single tender with FULL details like lost_bids scraper
async function scrapeTender(url, index) {
  const tenderId = extractId(url);
  console.log(`[${index + 1}/${workingUrls.length}] Scraping ${tenderId}...`);
  
  try {
    const html = await fetchUrl(url);
    
    // Extract title from h1
    let title = '';
    const titleMatch = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    if (titleMatch) {
      title = titleMatch[1].replace(/<[^>]+>/g, '').trim();
    }
    
    // Try to find Dhivehi title (often in h2 or with Dhivehi characters)
    let titleDhivehi = '';
    const dhivehiMatch = html.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i);
    if (dhivehiMatch && /[ހ-ޱ]/.test(dhivehiMatch[1])) {
      titleDhivehi = dhivehiMatch[1].replace(/<[^>]+>/g, '').trim();
    }
    
    // Extract authority - look for ministry/department patterns
    let authority = '';
    const authorityPatterns = [
      /Ministry[^<]*/i,
      /Department[^<]*/i,
      /Agency[^<]*/i,
      /Authority[^<]*/i,
      /Corporation[^<]*/i,
      /Service[^<]*/i,
      /Hospital[^<]*/i,
      /School[^<]*/i,
      /Council[^<]*/i,
      /Commission[^<]*/i,
      /Office[^<]*/i,
      /އިސްލާހު[^<]*/
    ];
    for (const pattern of authorityPatterns) {
      const match = html.match(pattern);
      if (match) {
        authority = match[0].replace(/<[^>]+>/g, '').trim().substring(0, 150);
        if (authority.length > 5) break;
      }
    }
    
    // Extract all dates with various formats
    const dateMatches = html.match(/\d{1,2}[\/\.-]\d{1,2}[\/\.-]\d{2,4}/g) || [];
    const isoDateMatches = html.match(/\d{4}-\d{2}-\d{2}/g) || [];
    
    // Extract times
    const timeMatches = html.match(/\d{1,2}:\d{2}/g) || [];
    
    // Extract email
    const emailMatch = html.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const contactEmail = emailMatch ? emailMatch[0] : '';
    
    // Extract phone numbers
    const phoneMatches = html.match(/\+?\d[\d\s-]{6,}/g) || [];
    const contactPhones = [...new Set(phoneMatches)].slice(0, 3);
    
    // Extract info sheet URL
    let infoSheetUrl = '';
    const infoSheetMatch = html.match(/https:\/\/storage\.googleapis\.com\/gazette\.gov\.mv[^\s"'<>]+/);
    if (infoSheetMatch) {
      infoSheetUrl = infoSheetMatch[0];
    }
    
    // Extract bid security/performance guarantee
    let bidSecurity = '';
    const bidSecurityMatch = html.match(/(?:bid security|bank guarantee)[^<]*/i);
    if (bidSecurityMatch) {
      bidSecurity = bidSecurityMatch[0].replace(/<[^>]+>/g, '').trim().substring(0, 100);
    }
    
    let performanceGuarantee = '';
    const perfMatch = html.match(/(?:performance guarantee|performance bond)[^<]*/i);
    if (perfMatch) {
      performanceGuarantee = perfMatch[0].replace(/<[^>]+>/g, '').trim().substring(0, 100);
    }
    
    // Extract funding source
    let funding = '';
    const fundingMatch = html.match(/(?:funded by|financed by|budget|grant)[^<]*/i);
    if (fundingMatch) {
      funding = fundingMatch[0].replace(/<[^>]+>/g, '').trim().substring(0, 100);
    }
    
    // Extract project name
    let project = '';
    const projectMatch = html.match(/(?:project name|project title|development project)[^<]*/i);
    if (projectMatch) {
      project = projectMatch[0].replace(/<[^>]+>/g, '').trim().substring(0, 100);
    }
    
    // Extract eligibility
    let eligibility = '';
    const eligibilityMatch = html.match(/(?:eligible|eligibility criteria|who can apply)[^<]*/i);
    if (eligibilityMatch) {
      eligibility = eligibilityMatch[0].replace(/<[^>]+>/g, '').trim().substring(0, 200);
    }
    
    // Determine category from content
    let category = 'Other';
    const categoryMap = {
      'IT': ['computer', 'software', 'hardware', 'network', 'IT', 'system', 'server', 'laptop', 'desktop', 'monitor', 'tablet', 'switch', 'ram', 'pc', 'ups'],
      'Construction': ['construction', 'building', 'civil', 'infrastructure', 'road', 'bridge', 'flood', 'coastal', 'harbor', 'jetty'],
      'Medical': ['medical', 'hospital', 'health', 'pharmaceutical', 'medicine', 'scan', 'doppler', 'echocardiography', 'equipment'],
      'Office Supplies': ['office', 'stationery', 'furniture', 'chair', 'desk', 'cabinet', 'cupboard'],
      'Vehicle': ['vehicle', 'car', 'bus', 'truck', 'transport', 'motorcycle', 'ambulance', 'boat'],
      'Consultancy': ['consultancy', 'consultant', 'service', 'advisory', 'study', 'survey'],
      'Electrical': ['electrical', 'generator', 'wiring', 'power', 'cable', 'stelco', 'electric'],
      'Printing': ['printing', 'press', 'banner', 'brochure', 'publication', 'book'],
      'Catering': ['catering', 'food', 'meal', 'restaurant', 'canteen'],
      'Security': ['security', 'cctv', 'camera', 'alarm', 'surveillance'],
      'Safety': ['safety', 'gloves', 'helmet', 'ppe', 'protective'],
      'Machinery': ['machinery', 'equipment', 'machines', 'tools'],
      'Agriculture': ['agriculture', 'farm', 'crop', 'fertilizer', 'seeds'],
      'Education': ['school', 'education', 'training', 'student', 'learning'],
      'Sports': ['sports', 'gym', 'fitness', 'playground'],
      'Awards': ['award', 'trophy', 'medal', 'certificate'],
      'Apparel': ['uniform', 'clothing', 'apparel', 'fabric', 'textile']
    };
    
    const lowerHtml = html.toLowerCase();
    const lowerTitle = title.toLowerCase();
    for (const [cat, keywords] of Object.entries(categoryMap)) {
      if (keywords.some(k => lowerHtml.includes(k) || lowerTitle.includes(k))) {
        category = cat;
        break;
      }
    }
    
    // Extract requirements/quantities from content
    const requirements = {};
    const quantityMatches = html.match(/(\d+)\s*(?:units?|pcs?|sets?|packages?|lot)/gi) || [];
    
    // Parse dates properly
    const submissionDeadline = isoDateMatches[0] || dateMatches[0] || '';
    const bidOpeningDate = isoDateMatches[1] || dateMatches[1] || '';
    const registrationDeadline = isoDateMatches[2] || dateMatches[2] || '';
    
    // Parse times
    const submissionTime = timeMatches[0] || '';
    const bidOpeningTime = timeMatches[1] || '';
    
    return {
      id: tenderId,
      gazette_id: tenderId,
      title: title || existingData.tenders.find(t => t.id === tenderId)?.title || `Tender ${tenderId}`,
      title_dhivehi: titleDhivehi || existingData.tenders.find(t => t.id === tenderId)?.title_dhivehi || '',
      authority: authority || existingData.tenders.find(t => t.id === tenderId)?.authority || '',
      category: category,
      tender_no: tenderId,
      requirements: requirements,
      submission_deadline: submissionDeadline,
      submission_time: submissionTime,
      bid_opening_date: bidOpeningDate,
      bid_opening_time: bidOpeningTime,
      registration_deadline: registrationDeadline,
      registration_time: '',
      bid_submission: '',
      bid_time: '',
      clarification_deadline: '',
      clarification_time: '',
      pre_bid_meeting: '',
      contact_email: contactEmail || existingData.tenders.find(t => t.id === tenderId)?.contact_email || '',
      contact_phones: contactPhones,
      contact_name: '',
      gazette_url: url,
      info_sheet_url: infoSheetUrl || existingData.tenders.find(t => t.id === tenderId)?.info_sheet_url || '',
      portal: 'gazette.gov.mv',
      eligibility: eligibility,
      bid_security: bidSecurity,
      performance_guarantee: performanceGuarantee,
      funding: funding,
      project: project,
      lots: null,
      status: 'Open',
      result: 'Pending',
      bid_amount: existingData.tenders.find(t => t.id === tenderId)?.bid_amount || null,
      cost_estimate: existingData.tenders.find(t => t.id === tenderId)?.cost_estimate || '',
      profit_margin: '',
      documents: [],
      notes: `Working tender scraped from ${url}`,
      scraped_at: new Date().toISOString()
    };
    
  } catch (error) {
    console.log(`  ⚠️ Error: ${error.message}`);
    
    // Return existing data on error
    const existing = existingData.tenders.find(t => t.id === tenderId);
    if (existing) {
      return {
        ...existing,
        notes: `Partial data - fetch error: ${error.message}`,
        scraped_at: new Date().toISOString(),
        error: error.message
      };
    }
    
    return {
      id: tenderId,
      gazette_id: tenderId,
      title: `Tender ${tenderId} (Fetch Failed)`,
      gazette_url: url,
      status: 'Open',
      result: 'Pending',
      scraped_at: new Date().toISOString(),
      error: error.message
    };
  }
}

// Save progress
function saveProgress(tenders) {
  const data = {
    metadata: {
      total_tenders: tenders.length,
      last_updated: new Date().toISOString(),
      source: 'gazette.gov.mv',
      type: 'Working Tenders',
      description: 'Active/Upcoming tender data with full details - re-scraped'
    },
    tenders: tenders
  };
  
  writeFileSync(workingFilePath, JSON.stringify(data, null, 2));
  console.log(`💾 Saved ${tenders.length} tenders to working_file.json`);
}

// Main scraping function
async function main() {
  console.log('='.repeat(70));
  console.log('Re-scraping Working Tenders from Gazette.gov.mv');
  console.log('='.repeat(70));
  console.log(`Total URLs: ${workingUrls.length}`);
  console.log('');
  
  const results = [];
  const startTime = Date.now();
  
  for (let i = 0; i < workingUrls.length; i++) {
    const url = workingUrls[i];
    const tender = await scrapeTender(url, i);
    results.push(tender);
    
    // Save progress every 5 items
    if ((i + 1) % 5 === 0) {
      saveProgress(results);
    }
    
    // Small delay to be respectful
    if (i < workingUrls.length - 1) {
      await new Promise(r => setTimeout(r, 500));
    }
  }
  
  // Final save
  saveProgress(results);
  
  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  const successful = results.filter(r => !r.error).length;
  const failed = results.filter(r => r.error).length;
  
  console.log('\n' + '='.repeat(70));
  console.log('Scraping Complete!');
  console.log('='.repeat(70));
  console.log(`Total: ${results.length}`);
  console.log(`Successful: ${successful}`);
  console.log(`Failed: ${failed}`);
  console.log(`Duration: ${duration}s`);
  console.log(`Output: data/working_file.json`);
  console.log('='.repeat(70));
}

// Run
main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
