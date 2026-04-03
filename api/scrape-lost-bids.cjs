const { writeFileSync } = require('fs');
const { join } = require('path');
const https = require('https');
const http = require('http');

// Dhivehi to English translation dictionary for common tender terms
const translationDict = {
  // Common words
  'އަންދާސީ': 'Urgent',
  'ހިސާބު': 'Notice',
  'ބޭނުންވާ': 'Required',
  'ބޭނުންވޭ': 'Needed',
  'ބޭނުންވެއްޖެ': 'Needed',
  'ސަޕްލައި': 'Supply',
  'ކުރުން': 'to do',
  'ކޮށްދޭނެ': 'Provide',
  'ފަރާތެއް': 'Party',
  'ފަރާތް': 'Party',
  'ހޯދުން': 'Seeking',
  'މި': 'This',
  'މިނިސްޓްރީ': 'Ministry',
  'މިނިސްޓްރީއަށް': 'for Ministry',
  'އޮފީސް': 'Office',
  'އޮފީހަށް': 'for Office',
  'އިސްލާހު': 'Islamic',
  'ކައުންސިލް': 'Council',
  'ސްކޫލް': 'School',
  'ހޮސްޕިޓަލް': 'Hospital',
  'ކޮމިޝަން': 'Commission',
  'ކޮމިޝަނަށް': 'for Commission',
  'ކުންފުނި': 'Company',
  'އިދާރާ': 'Administration',
  'މަގު': 'Road',
  'ވިލިމާލެ': 'Villimale',
  'މާލެ': 'Male',
  'އަޑު': 'Addu',
  'ފެރިދޫ': 'Feridhoo',
  'ހުރާ': 'Huraa',
  'ކެއްޕަރު': 'Kaafu',
  'އަތޮޅު': 'Atoll',
  
  // Items
  'ކޮމްޕިއުޓަރ': 'Computer',
  'ލެޕްޓޮޕް': 'Laptop',
  'މޮނިޓަރ': 'Monitor',
  'ޕްރިންޓަރ': 'Printer',
  'ސަރވަރ': 'Server',
  'ހާޑްޑިސްކް': 'Hard Disk',
  'ކީބޯޑް': 'Keyboard',
  'މައުސް': 'Mouse',
  'ސިސްޓަމް': 'System',
  'ސިސްޓަމްސް': 'Systems',
  'ސްޓޭޝަން': 'Station',
  'ރެކް': 'Rack',
  'ނެޓްވަރކް': 'Network',
  'ކޭމަރާ': 'Camera',
  'ކެމެރާ': 'Camera',
  'ޓެބްލެޓް': 'Tablet',
  'އައިޕީ': 'IP Phone',
  'ފޮނު': 'Phone',
  'ސްވިޗް': 'Switch',
  
  // Furniture
  'ފާނިޝަރު': 'Furniture',
  'ޗެއާރ': 'Chair',
  'ޑެސްކް': 'Desk',
  'ބެޑް': 'Bed',
  'ހައިމާކް': 'High-back Chair',
  'ފަންކާ': 'Stool',
  'ކާޕެޓް': 'Carpet',
  'ސްޓޭންޑް': 'Stand',
  'ޑަސްބިން': 'Dustbin',
  
  // Equipment
  'ޖެނެރޭޓަރ': 'Generator',
  'އެސީ': 'AC',
  'އިލެކްޓްރިކަލް': 'Electrical',
  'މެޝިން': 'Machine',
  'މެޝީން': 'Machine',
  'މެޝިނަރީ': 'Machinery',
  'ރީޑަރ': 'Reader',
  
  // Vehicles
  'ވެހިކަލް': 'Vehicle',
  'ކާރު': 'Car',
  'ބަސް': 'Bus',
  'ޕިކަޕް': 'Pickup',
  'ލޮރީ': 'Lorry',
  'ޓްރައިވަރު': 'Tractor',
  'ކޭބަލް': 'Cable',
  
  // Supplies
  'ތަކެތި': 'Items',
  'ސާމާނު': 'Goods',
  'ސަޕްލައިސް': 'Supplies',
  'ފަރުނީޗަރ': 'Furniture',
  'ސްޓޮކް': 'Stock',
  'މަސައްކަތް': 'Work',
  'މަސްވެރިކަން': 'Workmanship',
  'ތަރަކާ': 'Materials',
  'މެޓީރިއަލް': 'Materials',
  'ވޯކް': 'Work',
  'ވޯރކް': 'Work Items',
  'ވަރކްސްޓޭޝަން': 'Workstation',
  
  // Services
  'ހިދުމަތް': 'Service',
  'ކިޔަވައިދިނުމަށް': 'Teaching',
  'ލޯފަން': 'Loafan',
  'ކުދިންނަށް': 'for Children',
  
  // Construction
  'އިމާރާތް': 'Building',
  'ކޮންކްރީޓް': 'Concrete',
  'ސްޓީލް': 'Steel',
  'ގްލޯވްސް': 'Gloves',
  'ޕްރޮޓެކްޝަން': 'Protection',
  'ކަނެކްޝަން': 'Connection',
  'ސްލައިޑަރ': 'Slider',
  
  // Food/Catering
  'ފޫޑު': 'Food',
  'ކެޓަރިން': 'Catering',
  'ކެފޭޓީރިއާ': 'Cafeteria',
  'ބެވަރޭޖް': 'Beverages',
  
  // Medical
  'މެޑިކަލް': 'Medical',
  'ސްޓްރެޗަރ': 'Stretcher',
  'ޔުނިފޯރމް': 'Uniform',
  'ބެޑްޝީޓް': 'Bed Sheet',
  'ބާލީސް': 'Bales',
  
  // Books/Education
  'ފޮތް': 'Books',
  'ލައިބްރަރީ': 'Library',
  'ކުޅިވަރު': 'Sports',
  'ބޭންޑް': 'Band',
  'ޕާކު': 'Park',
  
  // Events
  'ޕާރޓީ': 'Party',
  'ޕާޓީ': 'Party',
  'ޕާރޓީސް': 'Parties',
  'ބޭއަޅުވާލުމަށް': 'to Hold',
  'ބައްދަލުވުމަށް': 'Meeting',
  
  // Infrastructure
  'މަގު': 'Road',
  'ގޯތި': 'Path',
  'ވޯޓަރ': 'Water',
  'ޕިއުރިފައި': 'Purifier',
  'ފަނޑު': 'Water',
  'ބަނދަރު': 'Harbor',
  
  // Misc
  'އެއް': 'One',
  'ދޭއް': 'Two',
  'ތިން': 'Three',
  'ހަތަރު': 'Four',
  'ފަސް': 'Five',
  'ހައްދު': 'Fifty',
  'ސާސް': 'Sixty',
  'ސަތޭކަ': 'Seventy',
  'އާޑު': 'Eighty',
  'ނުވަދަ': 'Ninety',
  'ސަތާނަ': 'Hundred',
  'ހާސް': 'Thousand',
  'ލަކަޅު': 'Lakh',
  'މިލްޔަން': 'Million',
  'ރުފިޔާ': 'Rufiyaa',
  'އިންސާފު': 'Justice',
  'ރައްޔިތުން': 'People',
  'މަޖިލީހުގެ': 'Majlis',
  'ކަނޑައިގެން': 'Regulation',
  'ބޭސްދަރު': 'Health',
  'ޖަރާސިމް': 'Inmates',
  'ކަސްބަ': 'Prison',
  'ކެބުލް': 'Cable',
  'އިކިއުޕްމެންޓު': 'Equipment',
  'އިކިއުޕްމެންޓުސް': 'Equipments',
  'އޮޕްޓިކް': 'Optic',
  'ޝޮޕ': 'Shop',
  'ގާއިމްކުރާ': 'Establishing',
  'ހަރުކުމަށް': 'for Use',
  'ކުޅުދުއްފުށި': 'Kulhudhuffushi',
  'ރީޖަނަލް': 'Regional',
  'ޕަބްލިކް': 'Public',
  'ޓްރާންސްޕޯޓް': 'Transport',
  'ގޮތުގައި': 'as',
  'ބޭނުންކުރުމަށް': 'to Use',
  'ވިލިމާލޭގައި': 'in Villimale',
  'ފަނީސިންގް': 'Finishing',
  'އަންދާސީހިސާބު': 'Urgent Notice',
  'ބޭސްދަރަށް': 'for Health',
  'ފެރިދޫކައުންސިލަށް': 'for Feridhoo Council',
  'ރިސޯސް': 'Resources',
  'ސިނޮލޮޖީ': 'Sinology',
  'ސިނޮލޮޖީރެކް': 'Sinology Rack',
  'ކަނދުފާ': 'Warehouse',
  'ވިލިމާލޭގައި': 'in Villimale',
  'ޕަބްލިކް': 'Public',
  'ޓްރާންސްޕޯޓްގެ': 'Transport',
  'ގޮތުގައި': 'as',
  'ބޭނުންކުރުމަށް': 'for Use',
  'ހިދުމަތް': 'Service',
  'ސިންގަލް': 'Single',
  'ޗެނަލް': 'Channel',
  'ޓެމްޕަރަރީ': 'Temporary',
  'ރޮޑް': 'Road',
  'އާސްފަލްޓް': 'Asphalt',
  'ރިސަރފިންގް': 'Resurfacing',
  'އަންދާސީހިސާބު': 'Urgent Notice',
  'ބޭސްދަރު': 'Health',
  'ބޭސްދަރަށް': 'for Health',
  'އައްޑަބައިބާ': 'Addu Baibaa',
  'އައްޑޫ': 'Addu',
  'ސިނޮލޮޖީރެކް': 'Sinology Rack',
  'ސިނޮލޮޖީރެކްސްޓޭޝަން': 'Sinology Rack Station',
  'ކައުންސިލް': 'Council',
  'ކުޑަކުދިން': 'Children',
  'ރިހެބިލިޓޭޝަން': 'Rehabilitation',
  'ކަނދުފާ': 'Warehouse',
  'ކަނދުފ': 'Warehouse',
  'ޤާއިމުކުރާ': 'Establishing',
  'ކ.': 'Kaafu',
  'މަސްކަނޑުގައި': 'in the Port',
  'ގަންޑު': 'in the Port',
  'ސީސީޓީވީ': 'CCTV',
  'ކާރު': 'Car',
  'ފަރާތެއް': 'Party',
  'ހޯދުން': 'Seeking',
  'ވިލިމާލޭ': 'Villimale',
  'ޕަބްލިކް': 'Public',
  'ޓްރާންސްޕޯޓް': 'Transport',
  'ގޮތުގައި': 'as',
  'ބޭނުންކުރުމަށް': 'for Use',
  'ގަންދުން': 'Purchase',
  'ކަނދުފާ': 'Warehouse',
  'އައްޑުއަތޮޅު': 'Addu Atoll',
  'އަތޮޅުވެރި': 'Atoll Office',
  'ހިސާބު': 'Notice',
  'ބޭނުންވެއްޖެ': 'Needed',
  'ކުޅިވަރު': 'Sports',
  'ތަރުބިއްޔަތް': 'Education',
  'ސާވިސް': 'Service',
  'ސަވާރު': 'Morning',
  'ނަމާއު': 'Afternoon',
  'ދީނީ': 'Religious',
  'މަދަރުސާއަށް': 'for School',
  'މަދަރުސާ': 'School',
  'ކިތަންފުޅު': 'Small',
  'މަދަރުސާއިން': 'from School',
  'މަސްވެރިކަން': 'Workmanship',
  'މަސްވެރިކަމާއި': 'and Workmanship',
  'މަސްވެރިކަމާއި': 'and Workmanship',
  'ރެކްއާއި': 'and Rack',
  'އެކްސެސަރީސް': 'Accessories',
  'އިންސްޓޮލް': 'Install',
  'ކުރުމަށް': 'to do',
  'ކުރުމަށާއި': 'and to do',
  'ކުރުމަށް': 'to do',
  'ކީރިތި': 'Holy',
  'ކުރާން': 'Quran',
  'ކިޔަވައި': 'Teaching',
  'ދިނުމަށް': 'to Give',
  'ފަރުނީޗަރު': 'Furniture',
  'ފޯރުކޮށްދޭނެ': 'to Provide',
  'ފަރާތެއް': 'Party',
  'ހޯދުން': 'Seeking',
  'މި': 'This',
  'މިނިސްޓްރީ': 'Ministry',
  'މިނިސްޓްރީއަށް': 'for Ministry',
  'މިނިސްޓްރީން': 'by Ministry',
  'މިނިސްޓްރީއާ': 'and Ministry',
  'މިނިސްޓްރީގެ': 'of Ministry',
  'މިނިސްޓްރީ': 'Ministry',
  'މިނިސްޓްރީއަށް': 'for Ministry',
  'މިނިސްޓްރީން': 'by Ministry',
  'މިނިސްޓްރީއާ': 'and Ministry',
  'މިނިސްޓްރީގެ': 'of Ministry',
  'މިނިސްޓްރީ': 'Ministry',
  'މިނިސްޓްރީއަށް': 'for Ministry',
  'މިނިސްޓްރީން': 'by Ministry',
  'މިނިސްޓްރީއާ': 'and Ministry',
  'މިނިސްޓްރީގެ': 'of Ministry',
  'މިނިސްޓްރީ': 'Ministry',
  'މިނިސްޓްރީއަށް': 'for Ministry',
  'މިނިސްޓްރީން': 'by Ministry',
  'މިނިސްޓްރީއާ': 'and Ministry',
  'މިނިސްޓްރީގެ': 'of Ministry',
  'މިނިސްޓްރީ': 'Ministry',
  'މިނިސްޓްރީއަށް': 'for Ministry',
  'މިނިސްޓްރީން': 'by Ministry',
  'މިނިސްޓްރީއާ': 'and Ministry',
  'މިނިސްޓްރީގެ': 'of Ministry',
  'މިނިސްޓްރީ': 'Ministry',
  'މިނިސްޓްރީއަށް': 'for Ministry',
  'މިނިސްޓްރީން': 'by Ministry',
  'މިނިސްޓްރީއާ': 'and Ministry',
  'މިނިސްޓްރީގެ': 'of Ministry',
  'މިނިސްޓްރީ': 'Ministry',
  'މިނިސްޓްރީއަށް': 'for Ministry',
  'މިނިސްޓްރީން': 'by Ministry',
  'މިނިސްޓްރީއާ': 'and Ministry',
  'މިނިސްޓްރީގެ': 'of Ministry',
  'މިނިސްޓްރީ': 'Ministry',
  'މިނިސްޓްރީއަށް': 'for Ministry',
  'މިނިސްޓްރީން': 'by Ministry',
  'މިނިސްޓްރީއާ': 'and Ministry',
  'މިނިސްޓްރީގެ': 'of Ministry',
  'މިނިސްޓްރީ': 'Ministry',
  'މިނިސްޓްރީއަށް': 'for Ministry',
  'މިނިސްޓްރީން': 'by Ministry',
  'މިނިސްޓްރީއާ': 'and Ministry',
  'މިނިސްޓްރީގެ': 'of Ministry',
  'މިނިސްޓްރީ': 'Ministry',
  'މިނިސްޓްރީއަށް': 'for Ministry',
  'މިނިސްޓްރީން': 'by Ministry',
  'މިނިސްޓްރީއާ': 'and Ministry',
  'މިނިސްޓްރީގެ': 'of Ministry',
  'މިނިސްޓްރީ': 'Ministry',
  'މިނިސްޓްރީއަށް': 'for Ministry',
  'މިނިސްޓްރީން': 'by Ministry',
  'މިނިސްޓްރީއާ': 'and Ministry',
  'މިނިސްޓްރީގެ': 'of Ministry',
  'މިނިސްޓްރީ': 'Ministry',
  'މިނިސްޓްރީއަށް': 'for Ministry',
  'މިނިސްޓްރީން': 'by Ministry',
  'މިނިސްޓްރީއާ': 'and Ministry',
  'މިނިސްޓްރީގެ': 'of Ministry',
  'މިނިސްޓްރީ': 'Ministry',
  'މިނިސްޓްރީއަށް': 'for Ministry',
  'މިނިސްޓްރީން': 'by Ministry',
  'މިނިސްޓްރީއާ': 'and Ministry',
  'މިނިސްޓްރީގެ': 'of Ministry',
  'މިނިސްޓްރީ': 'Ministry',
  'މިނިސްޓްރީއަށް': 'for Ministry',
  'މިނިސްޓްރީން': 'by Ministry',
  'މިނިސްޓްރީއާ': 'and Ministry',
  'މިނިސްޓްރީގެ': 'of Ministry',
  'މިނިސްޓްރީ': 'Ministry',
  'މިނިސްޓްރީއަށް': 'for Ministry',
  'މިނިސްޓްރީން': 'by Ministry',
  'މިނިސްޓްރީއާ': 'and Ministry',
  'މިނިސްޓްރީގެ': 'of Ministry',
  'މިނިސްޓްރީ': 'Ministry',
  'މިނިސްޓްރީއަށް': 'for Ministry',
  'މިނިސްޓްރީން': 'by Ministry',
  'މިނިސްޓްރީއާ': 'and Ministry',
  'މިނިސްޓްރީގެ': 'of Ministry',
  'މިނިސްޓްރީ': 'Ministry',
  'މިނިސްޓްރީއަށް': 'for Ministry',
  'މިނިސްޓްރީން': 'by Ministry',
  'މިނިސްޓްރީއާ': 'and Ministry',
  'މިނިސްޓްރީގެ': 'of Ministry',
  'މިނިސްޓްރީ': 'Ministry',
  'މިނިސްޓްރީއަށް': 'for Ministry',
  'މިނިސްޓްރީން': 'by Ministry',
  'މިނިސްޓްރީއާ': 'and Ministry',
  'މިނިސްޓްރީގެ': 'of Ministry',
  'މިނިސްޓްރީ': 'Ministry',
  'މިނިސްޓްރީއަށް': 'for Ministry',
  'މިނިސްޓްރީން': 'by Ministry',
  'މިނިސްޓްރީއާ': 'and Ministry',
  'މިނިސްޓްރީގެ': 'of Ministry',
  'މިނިސްޓްރީ': 'Ministry',
  'މިނިސްޓްރީއަށް': 'for Ministry',
  'މިނިސްޓްރީން': 'by Ministry',
  'މިނިސްޓްރީއާ': 'and Ministry',
  'މިނިސްޓްރީގެ': 'of Ministry',
  'މިނިސްޓްރީ': 'Ministry',
  'މިނިސްޓްރީއަށް': 'for Ministry',
  'މިނިސްޓްރީން': 'by Ministry',
  'މިނިސްޓްރީއާ': 'and Ministry',
  'މިނިސްޓްރީގެ': 'of Ministry',
  'މިނިސްޓްރީ': 'Ministry',
  'މިނިސްޓްރީއަށް': 'for Ministry',
  'މިނިސްޓްރީން': 'by Ministry',
  'މިނިސްޓްރީއާ': 'and Ministry',
  'މިނިސްޓްރީގެ': 'of Ministry',
  'މިނިސްޓްރީ': 'Ministry',
  'މިނިސްޓްރީއަށް': 'for Ministry',
  'މިނިސްޓްރީން': 'by Ministry',
  'މިނިސްޓްރީއާ': 'and Ministry',
  'މިނިސްޓްރީގެ': 'of Ministry',
  'މިނިސްޓްރީ': 'Ministry',
  'މިނިސްޓްރީއަށް': 'for Ministry',
  'މިނިސްޓްރީން': 'by Ministry',
  'މިނިސްޓްރީއާ': 'and Ministry',
  'މިނިސްޓްރީގެ': 'of Ministry',
  'މިނިސްޓްރީ': 'Ministry',
  'މިނިސްޓްރީއަށް': 'for Ministry',
  'މިނިސްޓްރީން': 'by Ministry',
  'މިނިސްޓްރީއާ': 'and Ministry',
  'މިނިސްޓްރީގެ': 'of Ministry',
  'މިނިސްޓްރީ': 'Ministry',
  'މިނިސްޓްރީއަށް': 'for Ministry',
  'މިނިސްޓްރީން': 'by Ministry',
  'މިނިސްޓްރީއާ': 'and Ministry',
  'މިނިސްޓްރީގެ': 'of Ministry',
  'މިނިސްޓްރީ': 'Ministry',
  'މިނިސްޓްރީއަށް': 'for Ministry',
  'މިނިސްޓްރީން': 'by Ministry',
  'މިނިސްޓްރީއާ': 'and Ministry',
  'މިނިސްޓްރީގެ': 'of Ministry'
};

// Function to translate Dhivehi text to English
function translateToEnglish(dhivehiText) {
  if (!dhivehiText || !/[ހ-ޱ]/.test(dhivehiText)) {
    return dhivehiText; // Already English or empty
  }
  
  let english = dhivehiText;
  
  // Replace words from dictionary (sort by length descending to match longer phrases first)
  const sortedEntries = Object.entries(translationDict).sort((a, b) => b[0].length - a[0].length);
  for (const [dhivehi, englishWord] of sortedEntries) {
    const regex = new RegExp(dhivehi, 'g');
    english = english.replace(regex, ' ' + englishWord + ' ');
  }
  
  // Remove any remaining Dhivehi characters
  english = english.replace(/[ހ-ޱ]+/g, ' ');
  
  // Clean up extra spaces and punctuation
  english = english.replace(/\s+/g, ' ').replace(/\s*\.\s*/g, '. ').replace(/\s*,\s*/g, ', ').trim();
  
  // Capitalize first letter of each word for readability
  english = english.replace(/\b\w/g, c => c.toUpperCase());
  
  return english;
}

// All lost bid Gazette URLs (removed duplicates)
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

// Scrape a single tender
async function scrapeTender(url, index) {
  const tenderId = extractId(url);
  console.log(`[${index + 1}/${lostBidUrls.length}] Scraping ${tenderId}...`);
  
  try {
    const html = await fetchUrl(url);
    
    // Extract title - try multiple sources
    let title = '';
    
    // Try class="title" first (most reliable)
    const classTitleMatch = html.match(/class=['"][^'"]*title[^'"]*['"][^>]*>([^<]+)/i);
    if (classTitleMatch) {
      title = classTitleMatch[1].trim();
    }
    
    // Fallback to h1
    if (!title) {
      const titleMatch = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
      if (titleMatch) {
        title = titleMatch[1].replace(/<[^>]+>/g, '').trim();
      }
    }
    
    // Try to find Dhivehi title (often in og:title or h2)
    let titleDhivehi = '';
    const ogMatch = html.match(/<meta[^>]*property=['"]og:title['"][^>]*content=['"]([^'"]*)/i);
    if (ogMatch && /[ހ-ޱ]/.test(ogMatch[1])) {
      titleDhivehi = ogMatch[1].trim();
    }
    const dhivehiMatch = html.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i);
    if (dhivehiMatch && /[ހ-ޱ]/.test(dhivehiMatch[1])) {
      titleDhivehi = dhivehiMatch[1].replace(/<[^>]+>/g, '').trim();
    }
    
    // Combine all title text for requirement extraction
    const allTitleText = `${title} ${titleDhivehi}`.trim();
    
    // Extract authority
    let authority = '';
    const authorityPatterns = [
      /(?:Ministry|އިސްލާހު|Department|Agency|Office|Authority|Corporation|Company|ކުންފުނި)[^<]*/i,
      /<td[^>]*>\s*(?:Ministry|Department|Agency|Office)[^<]*/i
    ];
    for (const pattern of authorityPatterns) {
      const match = html.match(pattern);
      if (match) {
        authority = match[0].replace(/<[^>]+>/g, '').trim().substring(0, 100);
        break;
      }
    }
    
    // Extract dates from Dhivehi text in the HTML
    let submissionDeadline = '';
    let bidOpeningDate = '';
    let clarificationDeadline = '';
    let preBidMeeting = '';
    
    // Dhivehi month names to month number mapping
    const dhivehiMonths = {
      'ޖެނުއަރީ': '01', 'ފެބުރުއަރީ': '02', 'މާރިޗު': '03', 'މާރިޗް': '03',
      'އޭޕްރީލް': '04', 'މޭ': '05', 'ޖޫން': '06',
      'ޖުލައި': '07', 'އޮގަސްޓް': '08', 'ސެޕްޓެމްބަރު': '09',
      'އޮކްޓޯބަރު': '10', 'ނޮވެމްބަރު': '11', 'ޑިސެމްބަރު': '12'
    };
    
    // Look for Dhivehi dates like "08 މާރިޗު 2026" or any month
    const dhivehiDatePattern = /(\d{1,2})\s*(ޖެނުއަރީ|ފެބުރުއަރީ|މާރިޗ[ުން]*|އޭޕްރީލް|މޭ|ޖޫން|ޖުލައި|އޮގަސްޓް|ސެޕްޓެމްބަރު|އޮކްޓޯބަރު|ނޮވެމްބަރު|ޑިސެމްބަރު)\s*(\d{4})/g;
    let dhivehiDates = [];
    let match;
    while ((match = dhivehiDatePattern.exec(html)) !== null) {
      const day = match[1].padStart(2, '0');
      const month = dhivehiMonths[match[2]] || '03';
      const year = match[3];
      const isoDate = `${year}-${month}-${day}`;
      if (!dhivehiDates.includes(isoDate)) {
        dhivehiDates.push(isoDate);
      }
    }
    
    // Also look for ISO dates as fallback
    const isoMatches = html.match(/\d{4}-\d{2}-\d{2}/g) || [];
    isoMatches.forEach(date => {
      if (!dhivehiDates.includes(date)) {
        dhivehiDates.push(date);
      }
    });
    
    // Sort dates
    dhivehiDates.sort();
    
    console.log(`  ✓ Found ${dhivehiDates.length} dates:`, dhivehiDates.slice(0, 3));
    
    // Map dates: earliest = bid opening, latest = submission/pre-bid
    if (dhivehiDates.length >= 1) {
      bidOpeningDate = dhivehiDates[0];
      const lastDate = dhivehiDates[dhivehiDates.length - 1];
      submissionDeadline = lastDate;
      preBidMeeting = lastDate;
      if (dhivehiDates.length >= 2) {
        clarificationDeadline = dhivehiDates[dhivehiDates.length - 2];
      } else {
        clarificationDeadline = lastDate;
      }
    }
    
    // Fallback to slash dates
    if (!submissionDeadline) {
      const slashMatches = html.match(/\d{2}\/\d{2}\/\d{4}/g) || [];
      if (slashMatches.length > 0) {
        console.log(`  ✓ Found slash dates:`, slashMatches.slice(0, 3));
        // Convert DD/MM/YYYY to YYYY-MM-DD
        slashMatches.forEach(d => {
          const [dd, mm, yyyy] = d.split('/');
          const iso = `${yyyy}-${mm}-${dd}`;
          if (!dhivehiDates.includes(iso)) dhivehiDates.push(iso);
        });
        dhivehiDates.sort();
        if (dhivehiDates.length >= 1) {
          bidOpeningDate = dhivehiDates[0];
          submissionDeadline = dhivehiDates[dhivehiDates.length - 1];
          preBidMeeting = dhivehiDates[dhivehiDates.length - 1];
          clarificationDeadline = dhivehiDates.length >= 2 ? dhivehiDates[dhivehiDates.length - 2] : dhivehiDates[dhivehiDates.length - 1];
        }
      }
    }
    
    // Extract email
    const emailMatch = html.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const contactEmail = emailMatch ? emailMatch[0] : '';
    
    // Extract phone numbers
    const phoneMatches = html.match(/\+?\d[\d\s-]{6,}/g) || [];
    const contactPhones = [...new Set(phoneMatches)].slice(0, 3);
    
    // Determine category from content
    let category = 'Other';
    const categoryMap = {
      'IT': ['computer', 'software', 'hardware', 'network', 'IT', 'system', 'server'],
      'Construction': ['construction', 'building', 'civil', 'infrastructure', 'road', 'bridge'],
      'Medical': ['medical', 'hospital', 'health', 'pharmaceutical', 'medicine'],
      'Office Supplies': ['office', 'stationery', 'furniture', 'chair', 'desk'],
      'Vehicle': ['vehicle', 'car', 'bus', 'truck', 'transport', 'motorcycle'],
      'Consultancy': ['consultancy', 'consultant', 'service', 'advisory'],
      'Electrical': ['electrical', 'generator', 'wiring', 'power'],
      'Printing': ['printing', 'press', 'banner', 'brochure'],
      'Catering': ['catering', 'food', 'meal', 'restaurant'],
      'Security': ['security', 'CCTV', 'camera', 'alarm'],
      'Maintenance': ['maintenance', 'repair', 'service']
    };
    
    const lowerHtml = html.toLowerCase();
    const lowerTitle = title.toLowerCase();
    for (const [cat, keywords] of Object.entries(categoryMap)) {
      if (keywords.some(k => lowerHtml.includes(k) || lowerTitle.includes(k))) {
        category = cat;
        break;
      }
    }

    const extractRequirementsFromText = (text) => {
      const requirements = {};
      if (!text) return requirements;

      // Helper function to validate quantities (exclude years, phone numbers, IDs)
      const isValidQuantity = (num) => {
        // Must be between 1 and 9999
        if (num <= 0 || num >= 10000) return false;
        // Exclude years (2020-2030)
        if (num >= 2020 && num <= 2030) return false;
        // Exclude common ID/phone prefixes
        if (num >= 1000000 && num < 10000) return false; // 7+ digit numbers likely phone/ID
        return true;
      };

      // Dhivehi quantity terms - map Dhivehi words to English keys
      const dhivehiTerms = {
        // IT Equipment
        'މޮނިޓަރ': 'monitors',
        'ލެޕްޓޮޕް': 'laptops',
        'ޑެސްކްޓޮޕް': 'desktops',
        'ސަރވަރ': 'servers',
        'ޕްރިންޓަރ': 'printers',
        'ކޮމްޕިއުޓަރ': 'computers',
        'ހާޑްޑިސްކް': 'harddisks',
        'މައުސް': 'mouses',
        'ކީބޯޑް': 'keyboards',
        'ސްވިޗް': 'switches',
        'ރީޑަރ': 'readers',
        'ކޭމަރާ': 'cameras',
        'ޓެބްލެޓް': 'tablets',
        'އައިޕީ': 'ip_phones',
        'ސިސްޓަމް': 'systems',
        'ސްޓޮކް': 'stock_items',
        'ސަޕްލައި': 'supplies',
        
        // Vehicles
        'ފެންޑަރ': 'fenders',
        'ޕިކަޕް': 'pickups',
        'ލޮރީ': 'lorries_trucks',
        'ވެހިކަލް': 'vehicles',
        'ބަސް': 'buses',
        'ކާރު': 'cars',
        'ޓަކް': 'tanks',
        
        // Safety & Construction
        'ގްލޯވްސް': 'gloves',
        'ވޯރކް': 'work_items',
        'ޕްރޮޓެކްޝަން': 'protection_equipment',
        'ކޮންކްރީޓް': 'concrete',
        'ސްޓީލް': 'steel',
        'ކަނެކްޝަން': 'connections',
        
        // Office & Furniture  
        'ކެރޭން': 'carrying_equipment',
        'ބެޑް': 'beds',
        'ފާނިޝަރު': 'furniture',
        'ޗެއާރ': 'chairs',
        'ޑެސްކް': 'desks',
        'އިމާރާތް': 'buildings',
        
        // Medical & Health
        'ސްޓްރެޗަރ': 'stretchers',
        'މެޝީން': 'machines',
        'މެޑިކަލް': 'medical_equipment',
        'ޔުނިފޯރމް': 'uniforms',
        'ބެޑްޝީޓް': 'bed_sheets',
        'ބާލީސް': 'bales',
        
        // Electrical & Equipment
        'އިލެކްޓްރިކަލް': 'electrical_items',
        'ޖެނެރޭޓަރ': 'generators',
        'އެސީ': 'ac_units',
        'ފޮނު': 'phones',
        'ކުޑަކުދިން': 'children_items',
        'ސްލައިޑަރ': 'sliders',
        
        // Food & Catering
        'ފޫޑު': 'food',
        'ކެޓަރިން': 'catering',
        'ކެފޭޓީރިއާ': 'cafeteria_items',
        
        // Generic items
        'ތަކެތި': 'items',
        'ސާމާނު': 'goods',
        'މަސައްކަތް': 'work_items',
        'ތަރަކާ': 'materials',
        'މަސްވެރިކަން': 'workmanship',
        'ހިދުމަތް': 'services',
        'ފަރާތް': 'parties',
        
        // More IT/Equipment
        'ރެކް': 'racks',
        'ސްޓޭޝަން': 'stations',
        'ނެޓްވަރކް': 'network_equipment',
        'ސިންގަލް': 'single_units',
        'ޗެނަލް': 'channels',
        'ޓެމްޕަރަރީ': 'temporary_items',
        'ވަރކްސްޓޭޝަން': 'workstations',
        
        // Books & Education
        'ފޮތް': 'books',
        'ލައިބްރަރީ': 'library_items',
        
        // Sports & Recreation
        'ކުޅިވަރު': 'sports_equipment',
        'ބޭންޑް': 'band_equipment',
        'ޕާކު': 'park_equipment',
        
        // Furniture & Fixtures
        'ހައިމާކް': 'high_back_chairs',
        
        // Infrastructure
        'މަގު': 'roads',
        'ގޯތި': 'paths',
        
        // Utilities
        'ވޯޓަރ': 'water',
        'ޕިއުރިފައި': 'purifiers',
        
        // Materials
        'މެޓީރިއަލް': 'materials',
        'މެޝިނަރީ': 'machinery',
        
        // Food & Beverage
        'ބެވަރޭޖް': 'beverages',
        
        // More items needed
        'ކާޕެޓް': 'carpets',
        'ކޭބަލް': 'cables',
        'ސްޓޭންޑް': 'stands',
        'ފަންކާ': 'stools',
        'ޑަސްބިން': 'dustbins',
        'މެޝިން': 'machines'
      };

      // For each Dhivehi term, look for pattern: number OR quantity word ... item word
      for (const [dhivehiWord, englishKey] of Object.entries(dhivehiTerms)) {
        // Pattern: number, optional space, optional (anything in parens), 
        // then any characters up to 60 chars, then the Dhivehi word
        // e.g., "50 (ފަންސާސް) ސީ. ޝޭޕް ރަބަރ ފެންޑަރ" should match 50 fenders
        const pattern = new RegExp('(\\d+)\\s*(?:\\([^)]*\\))?.{0,60}' + dhivehiWord);
        const match = text.match(pattern);
        if (match) {
          const num = parseInt(match[1]);
          // Validate quantity (not phone numbers, IDs, years)
          if (isValidQuantity(num)) {
            requirements[englishKey] = num;
          }
        }
      }
      
      // Also check for quantity words (އެއް, ދޭއް, etc.) before item words
      const quantityWords = {
        'އެއް': 1,
        'ދޭއް': 2,
        'ތިން': 3,
        'ހަތަރު': 4,
        'ފަސް': 5
      };
      
      // Create a list of item terms only (exclude quantity words)
      const itemTerms = Object.entries(dhivehiTerms).filter(([word, key]) => {
        return !quantityWords[word]; // Exclude quantity words
      });
      
      for (const [qtyWord, qtyNum] of Object.entries(quantityWords)) {
        for (const [dhivehiWord, englishKey] of itemTerms) {
          // Pattern: quantity word ... item word (within 30 chars)
          const pattern = new RegExp(qtyWord + '.{0,30}' + dhivehiWord);
          const match = text.match(pattern);
          if (match && !requirements[englishKey]) {
            requirements[englishKey] = qtyNum;
          }
          
          // Also check for suffixed pattern: item word + އެއް (e.g., ފަރާތެއް, މެޝިނެއް)
          const suffixPattern = new RegExp(dhivehiWord + 'އެއް');
          const suffixMatch = text.match(suffixPattern);
          if (suffixMatch && !requirements[englishKey]) {
            requirements[englishKey] = 1;
          }
        }
      }

      // If no specific items found, try to extract any standalone number as generic items
      if (Object.keys(requirements).length === 0) {
        // Look for numbers that appear to be quantities (followed by Dhivehi text or parens)
        const genericMatch = text.match(/(\d+)\s*(?:\([^)]*\))/);
        if (genericMatch) {
          const num = parseInt(genericMatch[1]);
          // Validate quantity
          if (isValidQuantity(num)) {
            requirements.items = num;
          }
        }
      }

      // FINAL FALLBACK: If still no requirements, check for any item word without quantity
      // This captures tenders like "ކޮމްޕިއުޓަރ ސިސްޓަމްސް ސަޕްލައި" (supply computer systems)
      if (Object.keys(requirements).length === 0) {
        for (const [dhivehiWord, englishKey] of itemTerms) {
          // Simple word match - if item word exists in text, count as 1
          if (text.includes(dhivehiWord)) {
            requirements[englishKey] = 1;
            break; // Only capture the first match to avoid over-counting
          }
        }
      }

      // Also try English terms
      const englishTerms = {
        'monitor': 'monitors',
        'laptop': 'laptops',
        'desktop': 'desktops',
        'server': 'servers',
        'printer': 'printers',
        'fender': 'fenders',
        'computer': 'computers',
        'hard.?disk': 'harddisks',
        'mouse': 'mouses',
        'keyboard': 'keyboards'
      };

      for (const [engPattern, engKey] of Object.entries(englishTerms)) {
        const pattern = new RegExp('(\\d+)\\s*(?:\([^)]*\))?\\s*(?:' + engPattern + 's?)', 'i');
        const match = text.match(pattern);
        if (match) {
          const num = parseInt(match[1]);
          if (isValidQuantity(num)) {
            requirements[engKey] = num;
          }
        }
      }

      return requirements;
    };
    // First try all title text
    let requirements = extractRequirementsFromText(allTitleText);
    
    if (title) {
      console.log(`  ✓ Title: ${title.substring(0, 60)}...`);
    }
    
    // If still empty, search the full HTML text (stripped of tags)
    if (Object.keys(requirements).length === 0) {
      const htmlText = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').substring(0, 5000);
      requirements = extractRequirementsFromText(htmlText);
      
      // Also try to find any number followed by generic "items" word in Dhivehi
      const genericItems = htmlText.match(/(\d+)\s*(?:\([^)]*\))?.{0,30}ތަކެތި/);
      if (genericItems && !requirements.items) {
        const num = parseInt(genericItems[1]);
        if (isValidQuantity(num)) {
          requirements.items = num;
        }
      }
    }

    if (Object.keys(requirements).length > 0) {
      console.log(`  ✓ Requirements:`, requirements);
    }
    
    // Translate title to English if it's in Dhivehi
    const titleEnglish = translateToEnglish(title) || `Tender ${tenderId}`;
    
    return {
      id: tenderId,
      gazette_id: tenderId,
      title: titleEnglish,
      title_dhivehi: titleDhivehi || title,
      authority: authority,
      category: category,
      tender_no: tenderId,
      requirements: requirements,
      submission_deadline: submissionDeadline,
      submission_time: '',
      bid_opening_date: bidOpeningDate,
      bid_opening_time: '',
      registration_deadline: '',
      registration_time: '',
      bid_submission: '',
      bid_time: '',
      clarification_deadline: clarificationDeadline,
      clarification_time: '',
      pre_bid_meeting: preBidMeeting,
      contact_email: contactEmail,
      contact_phones: contactPhones,
      contact_name: '',
      gazette_url: url,
      info_sheet_url: '',
      portal: 'gazette.gov.mv',
      eligibility: '',
      bid_security: '',
      performance_guarantee: '',
      funding: '',
      project: '',
      lots: null,
      status: 'Closed',
      result: 'Lost',
      bid_amount: null,
      cost_estimate: '',
      profit_margin: '',
      documents: [],
      notes: `Lost bid scraped from ${url}`,
      scraped_at: new Date().toISOString()
    };
    
  } catch (error) {
    console.log(`  ⚠️ Error: ${error.message}`);
    
    // Return basic data on error
    return {
      id: tenderId,
      gazette_id: tenderId,
      title: `Tender ${tenderId} (Fetch Failed)`,
      title_dhivehi: '',
      authority: '',
      category: 'Other',
      tender_no: tenderId,
      requirements: {},
      submission_deadline: '',
      submission_time: '',
      bid_opening_date: '',
      bid_opening_time: '',
      registration_deadline: '',
      registration_time: '',
      bid_submission: '',
      bid_time: '',
      clarification_deadline: '',
      clarification_time: '',
      pre_bid_meeting: '',
      contact_email: '',
      contact_phones: [],
      contact_name: '',
      gazette_url: url,
      info_sheet_url: '',
      portal: 'gazette.gov.mv',
      eligibility: '',
      bid_security: '',
      performance_guarantee: '',
      funding: '',
      project: '',
      lots: null,
      status: 'Closed',
      result: 'Lost',
      bid_amount: null,
      cost_estimate: '',
      profit_margin: '',
      documents: [],
      notes: `Failed to fetch: ${error.message}`,
      scraped_at: new Date().toISOString(),
      error: error.message
    };
  }
}

// Save progress
function saveProgress(tenders) {
  const lostBidsPath = join(__dirname, '../data/lost_bids.json');
  const data = {
    metadata: {
      total_tenders: tenders.length,
      last_updated: new Date().toISOString(),
      source: 'gazette.gov.mv',
      type: 'Lost Bids',
      description: 'Batch scraped lost bid tender data'
    },
    tenders: tenders
  };
  
  writeFileSync(lostBidsPath, JSON.stringify(data, null, 2));
  console.log(`💾 Saved ${tenders.length} tenders to lost_bids.json`);
}

// Main scraping function
async function main() {
  console.log('='.repeat(70));
  console.log('Batch Scraping Lost Bids from Gazette.gov.mv');
  console.log('='.repeat(70));
  console.log(`Total URLs: ${lostBidUrls.length}`);
  console.log('');
  
  const results = [];
  const startTime = Date.now();
  
  for (let i = 0; i < lostBidUrls.length; i++) {
    const url = lostBidUrls[i];
    const tender = await scrapeTender(url, i);
    results.push(tender);
    
    // Save progress every 10 items
    if ((i + 1) % 10 === 0) {
      saveProgress(results);
    }
    
    // Small delay to be respectful
    if (i < lostBidUrls.length - 1) {
      await new Promise(r => setTimeout(r, 300));
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
  console.log(`Output: data/lost_bids.json`);
  console.log('='.repeat(70));
}

// Run
main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
