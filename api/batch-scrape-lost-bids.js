import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// All 57+ lost bid Gazette URLs
const lostBidUrls = [
  "https://gazette.gov.mv/iulaan/383803",
  "https://gazette.gov.mv/iulaan/383540",
  "https://gazette.gov.mv/iulaan/385034",
  "https://gazette.gov.mv/iulaan/385028",
  "https://gazette.gov.mv/iulaan/383938",
  "https://gazette.gov.mv/iulaan/383100",
  "https://gazette.gov.mv/iulaan/383425",
  "https://gazette.gov.mv/iulaan/383491",
  "https://gazette.gov.mv/iulaan/382353",
  "https://gazette.gov.mv/iulaan/383371",
  "https://gazette.gov.mv/iulaan/383363",
  "https://gazette.gov.mv/iulaan/383546",
  "https://gazette.gov.mv/iulaan/383755",
  "https://gazette.gov.mv/iulaan/383744",
  "https://gazette.gov.mv/iulaan/384252",
  "https://gazette.gov.mv/iulaan/384253",
  "https://gazette.gov.mv/iulaan/384254",
  "https://gazette.gov.mv/iulaan/384255",
  "https://gazette.gov.mv/iulaan/383628",
  "https://gazette.gov.mv/iulaan/383800",
  "https://gazette.gov.mv/iulaan/383827",
  "https://gazette.gov.mv/iulaan/383310",
  "https://gazette.gov.mv/iulaan/383000",
  "https://gazette.gov.mv/iulaan/383042",
  "https://gazette.gov.mv/iulaan/383372",
  "https://gazette.gov.mv/iulaan/384673",
  "https://gazette.gov.mv/iulaan/384736",
  "https://gazette.gov.mv/iulaan/384553",
  "https://gazette.gov.mv/iulaan/384190",
  "https://gazette.gov.mv/iulaan/384573",
  "https://gazette.gov.mv/iulaan/383582",
  "https://gazette.gov.mv/iulaan/383053",
  "https://gazette.gov.mv/iulaan/383435",
  "https://gazette.gov.mv/iulaan/384047",
  "https://gazette.gov.mv/iulaan/384048",
  "https://gazette.gov.mv/iulaan/383370",
  "https://gazette.gov.mv/iulaan/384043",
  "https://gazette.gov.mv/iulaan/384241",
  "https://gazette.gov.mv/iulaan/384248",
  "https://gazette.gov.mv/iulaan/382823",
  "https://gazette.gov.mv/iulaan/382890",
  "https://gazette.gov.mv/iulaan/382962",
  "https://gazette.gov.mv/iulaan/382635",
  "https://gazette.gov.mv/iulaan/383112",
  "https://gazette.gov.mv/iulaan/383648",
  "https://gazette.gov.mv/iulaan/382750",
  "https://gazette.gov.mv/iulaan/383047",
  "https://gazette.gov.mv/iulaan/382154",
  "https://gazette.gov.mv/iulaan/382752",
  "https://gazette.gov.mv/iulaan/382429",
  "https://gazette.gov.mv/iulaan/382341",
  "https://gazette.gov.mv/iulaan/382730",
  "https://gazette.gov.mv/iulaan/382379",
  "https://gazette.gov.mv/iulaan/382297",
  "https://gazette.gov.mv/iulaan/382958",
  "https://gazette.gov.mv/iulaan/380188",
  "https://gazette.gov.mv/iulaan/382717",
  "https://gazette.gov.mv/iulaan/382686",
  "https://gazette.gov.mv/iulaan/381032",
  "https://gazette.gov.mv/iulaan/381073",
  "https://gazette.gov.mv/iulaan/382250",
  "https://gazette.gov.mv/iulaan/381063",
  "https://storage.googleapis.com/gazette.gov.mv/docs/iulaan/269387.pdf",
  "https://gazette.gov.mv/iulaan/380147",
  "https://gazette.gov.mv/iulaan/379887",
  "https://gazette.gov.mv/iulaan/380923",
  "https://gazette.gov.mv/iulaan/380919",
  "https://gazette.gov.mv/iulaan/380019",
  "https://gazette.gov.mv/iulaan/379759",
  "https://gazette.gov.mv/iulaan/380241",
  "https://gazette.gov.mv/iulaan/380202",
  "https://gazette.gov.mv/iulaan/379742",
  "https://gazette.gov.mv/iulaan/379432",
  "https://gazette.gov.mv/iulaan/377980",
  "https://gazette.gov.mv/iulaan/379740",
  "https://gazette.gov.mv/iulaan/379253",
  "https://gazette.gov.mv/iulaan/379323",
  "https://gazette.gov.mv/iulaan/379577",
  "https://gazette.gov.mv/iulaan/379772",
  "https://gazette.gov.mv/iulaan/379976",
  "https://gazette.gov.mv/iulaan/379942",
  "https://gazette.gov.mv/iulaan/373289",
  "https://gazette.gov.mv/iulaan/378980",
  "https://gazette.gov.mv/iulaan/379520",
  "https://gazette.gov.mv/iulaan/378938",
  "https://gazette.gov.mv/iulaan/378999",
  "https://gazette.gov.mv/iulaan/379009",
  "https://gazette.gov.mv/iulaan/379107",
  "https://gazette.gov.mv/iulaan/379600",
  "https://gazette.gov.mv/iulaan/378865",
  "https://gazette.gov.mv/iulaan/378902",
  "https://gazette.gov.mv/iulaan/379739",
  "https://gazette.gov.mv/iulaan/379428",
  "https://gazette.gov.mv/iulaan/378937",
  "https://gazette.gov.mv/iulaan/379071",
  "https://gazette.gov.mv/iulaan/379547",
  "https://gazette.gov.mv/iulaan/378677",
  "https://gazette.gov.mv/iulaan/378344",
  "https://gazette.gov.mv/iulaan/378506",
  "https://gazette.gov.mv/iulaan/378787",
  "https://gazette.gov.mv/iulaan/377047",
  "https://gazette.gov.mv/iulaan/376771",
  "https://gazette.gov.mv/iulaan/377601",
  "https://gazette.gov.mv/iulaan/377725",
  "https://gazette.gov.mv/iulaan/377682",
  "https://gazette.gov.mv/iulaan/377914",
  "https://gazette.gov.mv/iulaan/376992",
  "https://gazette.gov.mv/iulaan/377709",
  "https://gazette.gov.mv/iulaan/378155",
  "https://gazette.gov.mv/iulaan/378158",
  "https://gazette.gov.mv/iulaan/377599",
  "https://gazette.gov.mv/iulaan/377253",
  "https://gazette.gov.mv/iulaan/377603",
  "https://gazette.gov.mv/iulaan/378172",
  "https://gazette.gov.mv/iulaan/377947",
  "https://gazette.gov.mv/iulaan/377655",
  "https://gazette.gov.mv/iulaan/377626",
  "https://gazette.gov.mv/iulaan/377823",
  "https://gazette.gov.mv/iulaan/376991",
  "https://gazette.gov.mv/iulaan/377429",
  "https://gazette.gov.mv/iulaan/377908",
  "https://gazette.gov.mv/iulaan/377083",
  "https://gazette.gov.mv/iulaan/377427",
  "https://gazette.gov.mv/iulaan/377307",
  "https://gazette.gov.mv/iulaan/377910",
  "https://gazette.gov.mv/iulaan/377620",
  "https://gazette.gov.mv/iulaan/376138",
  "https://gazette.gov.mv/iulaan/376863",
  "https://gazette.gov.mv/iulaan/376731",
  "https://gazette.gov.mv/iulaan/377045",
  "https://gazette.gov.mv/iulaan/377408",
  "https://gazette.gov.mv/iulaan/376291",
  "https://gazette.gov.mv/iulaan/376224",
  "https://gazette.gov.mv/iulaan/376632",
  "https://gazette.gov.mv/iulaan/376233",
  "https://gazette.gov.mv/iulaan/376950",
  "https://gazette.gov.mv/iulaan/377259",
  "https://gazette.gov.mv/iulaan/376417",
  "https://gazette.gov.mv/iulaan/375437",
  "https://gazette.gov.mv/iulaan/376576",
  "https://gazette.gov.mv/iulaan/375021",
  "https://gazette.gov.mv/iulaan/375735",
  "https://gazette.gov.mv/iulaan/376763",
  "https://gazette.gov.mv/iulaan/375757",
  "https://gazette.gov.mv/iulaan/375798",
  "https://gazette.gov.mv/iulaan/374597",
  "https://gazette.gov.mv/iulaan/375612",
  "https://gazette.gov.mv/iulaan/375189",
  "https://gazette.gov.mv/iulaan/373772",
  "https://gazette.gov.mv/iulaan/375721",
  "https://gazette.gov.mv/iulaan/375733",
  "https://gazette.gov.mv/iulaan/375018",
  "https://gazette.gov.mv/iulaan/375020",
  "https://gazette.gov.mv/iulaan/375787",
  "https://gazette.gov.mv/iulaan/375788",
  "https://gazette.gov.mv/iulaan/375822",
  "https://gazette.gov.mv/iulaan/374896",
  "https://gazette.gov.mv/iulaan/375201",
  "https://gazette.gov.mv/iulaan/373628",
  "https://gazette.gov.mv/iulaan/374772",
  "https://gazette.gov.mv/iulaan/375464",
  "https://gazette.gov.mv/iulaan/378786",
  "https://gazette.gov.mv/iulaan/379815",
  "https://gazette.gov.mv/iulaan/380113",
  "https://gazette.gov.mv/iulaan/382197",
  "https://gazette.gov.mv/iulaan/382307"
];

// Function to extract ID from URL
function extractId(url) {
  const match = url.match(/\/iulaan\/(\d+)/);
  return match ? match[1] : null;
}

// Function to scrape a single tender page
async function scrapeTender(url) {
  try {
    console.log(`Scraping: ${url}`);
    
    // Fetch the page
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const html = await response.text();
    
    // Extract data using regex patterns
    const titleMatch = html.match(/<h1[^>]*>([^<]*)<\/h1>/i) || html.match(/<title>([^<]*)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : 'Unknown Title';
    
    // Try to extract more details
    const authorityMatch = html.match(/(?:Ministry|Agency|Office|Department|Corporation)[^<]*/i);
    const authority = authorityMatch ? authorityMatch[0].trim() : '';
    
    // Extract dates
    const dateMatches = html.match(/\d{1,2}[\/\.-]\d{1,2}[\/\.-]\d{2,4}/g) || [];
    
    // Extract email
    const emailMatch = html.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const contactEmail = emailMatch ? emailMatch[0] : '';
    
    // Extract phone
    const phoneMatch = html.match(/\+?\d[\d\s-]{7,}/);
    const contactPhone = phoneMatch ? phoneMatch[0].trim() : '';
    
    // Extract category from content
    let category = 'Other';
    const categoryKeywords = {
      'IT': ['computer', 'software', 'hardware', 'network', 'IT'],
      'Construction': ['construction', 'building', 'civil', 'infrastructure'],
      'Medical': ['medical', 'hospital', 'health', 'pharmaceutical'],
      'Office Supplies': ['office', 'stationery', 'furniture'],
      'Vehicle': ['vehicle', 'car', 'bus', 'truck', 'transport'],
      'Consultancy': ['consultancy', 'consultant', 'service']
    };
    
    const lowerHtml = html.toLowerCase();
    for (const [cat, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some(k => lowerHtml.includes(k))) {
        category = cat;
        break;
      }
    }
    
    const tenderId = extractId(url);
    
    return {
      id: tenderId,
      gazette_id: tenderId,
      title: title,
      title_dhivehi: '',
      authority: authority,
      category: category,
      tender_no: tenderId,
      gazette_url: url,
      info_sheet_url: '',
      portal: 'gazette.gov.mv',
      submission_deadline: dateMatches[0] || '',
      bid_opening_date: dateMatches[1] || '',
      contact_email: contactEmail,
      contact_phones: contactPhone ? [contactPhone] : [],
      contact_name: '',
      bid_security: '',
      performance_guarantee: '',
      funding: '',
      project: '',
      lots: null,
      eligibility: '',
      status: 'Closed',
      result: 'Lost',
      created_at: new Date().toISOString(),
      scraped_at: new Date().toISOString()
    };
    
  } catch (error) {
    console.error(`Error scraping ${url}:`, error.message);
    
    // Return basic data even on error
    const tenderId = extractId(url);
    return {
      id: tenderId,
      gazette_id: tenderId,
      title: `Tender ${tenderId}`,
      title_dhivehi: '',
      authority: '',
      category: 'Other',
      tender_no: tenderId,
      gazette_url: url,
      info_sheet_url: '',
      portal: 'gazette.gov.mv',
      submission_deadline: '',
      bid_opening_date: '',
      contact_email: '',
      contact_phones: [],
      contact_name: '',
      bid_security: '',
      performance_guarantee: '',
      funding: '',
      project: '',
      lots: null,
      eligibility: '',
      status: 'Closed',
      result: 'Lost',
      created_at: new Date().toISOString(),
      scraped_at: new Date().toISOString(),
      error: error.message
    };
  }
}

// Batch scrape with delay to avoid rate limiting
async function batchScrape(urls, delay = 1000) {
  const results = [];
  
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    console.log(`\n[${i + 1}/${urls.length}] Processing ${url}`);
    
    const tender = await scrapeTender(url);
    results.push(tender);
    
    // Save progress every 10 items
    if ((i + 1) % 10 === 0) {
      saveProgress(results);
      console.log(`💾 Progress saved: ${results.length} tenders`);
    }
    
    // Delay between requests
    if (i < urls.length - 1) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  return results;
}

// Save progress to file
function saveProgress(tenders) {
  const lostBidsPath = join(__dirname, '../data/lost_bids.json');
  const data = {
    metadata: {
      total_tenders: tenders.length,
      last_updated: new Date().toISOString(),
      source: 'gazette.gov.mv - lost bids',
      description: 'Scraped from lost bid Gazette URLs'
    },
    tenders: tenders
  };
  
  writeFileSync(lostBidsPath, JSON.stringify(data, null, 2));
}

// Main function
async function main() {
  console.log('='.repeat(60));
  console.log('Batch Scraping Lost Bids from Gazette.gov.mv');
  console.log('='.repeat(60));
  console.log(`Total URLs to scrape: ${lostBidUrls.length}`);
  console.log('');
  
  const startTime = Date.now();
  
  try {
    const tenders = await batchScrape(lostBidUrls, 500);
    
    // Final save
    saveProgress(tenders);
    
    const duration = (Date.now() - startTime) / 1000;
    
    console.log('\n' + '='.repeat(60));
    console.log('Scraping Complete!');
    console.log('='.repeat(60));
    console.log(`Total scraped: ${tenders.length}`);
    console.log(`Successful: ${tenders.filter(t => !t.error).length}`);
    console.log(`Failed: ${tenders.filter(t => t.error).length}`);
    console.log(`Duration: ${duration.toFixed(1)} seconds`);
    console.log(`Output: data/lost_bids.json`);
    console.log('='.repeat(60));
    
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { lostBidUrls, scrapeTender, batchScrape };
