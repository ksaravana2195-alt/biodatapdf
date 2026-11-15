// Form schema + sample data. Preview, form and PDF are all generated from this one place.

export const SECTIONS = [
	{ id: 'personal', title: 'Personal Details', tab: 'Personal', icon: '👤' },
	{ id: 'faith', title: 'Religious & Astrological Details', tab: 'Faith', icon: '🕉️' },
	{ id: 'career', title: 'Education & Career', tab: 'Career', icon: '🎓' },
	{ id: 'family', title: 'Family Details', tab: 'Family', icon: '👨‍👩‍👦' },
	{ id: 'contact', title: 'Contact Details', tab: 'Contact', icon: '📞' },
	{ id: 'about', title: 'About & Expectations', tab: 'About', icon: '💍' },
];

// key, label, section, optional: type ('select' | 'textarea'), options, wide
export const FIELDS = [
	{ k: 'name', label: 'Full Name', sec: 'header' },
	{ k: 'gender', label: 'Biodata For', sec: 'header', type: 'select', options: ['Male', 'Female'] },
	{ k: 'greeting', label: 'Blessing line (top of biodata, optional)', sec: 'header', wide: true, hint: 'Leave empty to use the template’s default blessing' },

	{ k: 'dob', label: 'Date of Birth', sec: 'personal' },
	{ k: 'tob', label: 'Time of Birth', sec: 'personal' },
	{ k: 'pob', label: 'Place of Birth', sec: 'personal' },
	{ k: 'height', label: 'Height', sec: 'personal' },
	{ k: 'complexion', label: 'Complexion', sec: 'personal' },
	{ k: 'blood', label: 'Blood Group', sec: 'personal' },
	{ k: 'marital', label: 'Marital Status', sec: 'personal' },
	{ k: 'tongue', label: 'Mother Tongue', sec: 'personal' },
	{ k: 'diet', label: 'Diet', sec: 'personal' },

	{ k: 'religion', label: 'Religion', sec: 'faith' },
	{ k: 'caste', label: 'Caste / Community', sec: 'faith' },
	{ k: 'sect', label: 'Sect', sec: 'faith' },
	{ k: 'gotra', label: 'Gotra / Gothram', sec: 'faith' },
	{ k: 'rashi', label: 'Rashi / Moon Sign', sec: 'faith' },
	{ k: 'nakshatra', label: 'Nakshatra', sec: 'faith' },
	{ k: 'manglik', label: 'Manglik Status', sec: 'faith' },
	{ k: 'practice', label: 'Religious Practice', sec: 'faith' },

	{ k: 'education', label: 'Highest Qualification', sec: 'career' },
	{ k: 'college', label: 'College / University', sec: 'career' },
	{ k: 'occupation', label: 'Occupation', sec: 'career' },
	{ k: 'company', label: 'Company / Business', sec: 'career' },
	{ k: 'workLocation', label: 'Work Location', sec: 'career' },
	{ k: 'income', label: 'Annual Income', sec: 'career' },

	{ k: 'father', label: 'Father’s Details', sec: 'family' },
	{ k: 'mother', label: 'Mother’s Details', sec: 'family' },
	{ k: 'siblings', label: 'Siblings', sec: 'family' },
	{ k: 'familyValues', label: 'Family Status', sec: 'family' },
	{ k: 'native', label: 'Native Place', sec: 'family' },
	{ k: 'maternal', label: 'Maternal Uncle (Mama) / Maternal Family', sec: 'family' },

	{ k: 'contactPerson', label: 'Contact Person', sec: 'contact' },
	{ k: 'phone', label: 'Mobile / WhatsApp', sec: 'contact' },
	{ k: 'email', label: 'Email', sec: 'contact' },
	{ k: 'address', label: 'Address', sec: 'contact', wide: true },

	{ k: 'hobbies', label: 'Hobbies & Interests', sec: 'about', wide: true },
	{ k: 'about', label: 'About Me', sec: 'about', type: 'textarea', wide: true },
	{ k: 'expectations', label: 'Partner Expectations', sec: 'about', type: 'textarea', wide: true },
];

// Which "faith" rows appear (and with which labels) for each religion family
export const FAITH_SETS = {
	hindu: { title: 'Religious & Astrological Details', keys: ['religion', 'caste', 'gotra', 'rashi', 'nakshatra', 'manglik'], labels: {} },
	muslim: { title: 'Religious Details', keys: ['religion', 'sect', 'caste', 'practice'], labels: { sect: 'Sect', caste: 'Biradari / Community', practice: 'Religious Practice' } },
	christian: { title: 'Faith Details', keys: ['religion', 'sect', 'caste', 'practice'], labels: { sect: 'Denomination', caste: 'Community', practice: 'Church / Parish' } },
	sikh: { title: 'Religious Details', keys: ['religion', 'caste', 'gotra', 'practice'], labels: { caste: 'Caste / Community', gotra: 'Gotra', practice: 'Amritdhari / Keshdhari' } },
	jain: { title: 'Religious Details', keys: ['religion', 'sect', 'caste', 'gotra', 'rashi', 'nakshatra'], labels: { sect: 'Sect (Shwetambar / Digambar)', caste: 'Community' } },
	buddhist: { title: 'Religious Details', keys: ['religion', 'sect', 'caste', 'practice'], labels: { sect: 'School / Tradition', practice: 'Religious Practice' } },
};

export function faithSetFor(religionFamily) {
	return FAITH_SETS[religionFamily] || FAITH_SETS.hindu;
}

const BASE = {
	name: 'Aarav Devendra Sharma', gender: 'Male', greeting: '',
	dob: '14-08-1996', tob: '06:45 AM', pob: 'Jaipur, Rajasthan', height: '5\'11" (180 cm)', complexion: 'Fair', blood: 'B+ Positive',
	marital: 'Never Married', tongue: 'Hindi / English', diet: 'Vegetarian',
	religion: 'Hindu', caste: 'Brahmin', sect: '', gotra: 'Bharadwaj', rashi: 'Vrishabha (Taurus)', nakshatra: 'Rohini', manglik: 'No (Non-Manglik)', practice: '',
	education: 'B.Tech in Computer Science & MS Data Science', college: 'Columbia University, New York', occupation: 'Senior Machine Learning Engineer',
	company: 'Microsoft Corporation', workLocation: 'Bangalore / Hybrid', income: '₹ 48,00,000 per annum',
	father: 'Mr. Devendra Sharma (Retd. Govt. Officer)', mother: 'Mrs. Sunita Sharma (Homemaker)', siblings: '1 Younger Sister (Married)', familyValues: 'Upper Middle Class, Moderate',
	native: 'Jaipur, Rajasthan', maternal: 'Mr. Rajesh Joshi, Udaipur',
	contactPerson: 'Self / Father', phone: '+91 98765 43210', email: 'aarav.sharma@example.com', address: 'C-14, Surya Nagar, Tonk Road, Jaipur, Rajasthan - 302015',
	hobbies: 'Travelling, Cricket, Photography, Reading', about: 'Down-to-earth, ambitious and family-oriented. I value honesty, respect and a balance between modern thinking and traditional roots.',
	expectations: 'Looking for an educated, caring and family-oriented partner with good moral values who can balance career and family life.',
};

const BRIDE = {
	name: 'Ananya Ramesh Kumar', gender: 'Female', dob: '22-05-1998', tob: '09:20 AM', pob: 'Pune, Maharashtra', height: '5\'4" (163 cm)', complexion: 'Wheatish Fair', blood: 'O+ Positive',
	rashi: 'Mithuna (Gemini)', nakshatra: 'Ardra', manglik: 'No (Non-Manglik)', caste: 'Brahmin', gotra: 'Kashyap',
	education: 'M.Des (Product Design)', college: 'NID, Ahmedabad', occupation: 'Senior Product Designer', company: 'Google India', workLocation: 'Bangalore', income: '₹ 36,00,000 per annum',
	father: 'Mr. Ramesh Kumar (Businessman)', mother: 'Mrs. Lata Kumar (Teacher)', siblings: '1 Elder Brother (Married)', native: 'Pune, Maharashtra', maternal: 'Mr. Anil Deshpande, Nashik',
	phone: '+91 98200 12345', email: 'ananya.kumar@example.com', address: 'B-402, Green Heights, Baner Road, Pune, Maharashtra - 411045',
	hobbies: 'Painting, Classical Dance, Cooking, Travelling', about: 'Creative, caring and independent. I love art, good food and meaningful conversations, and I respect both career and family.',
	expectations: 'Seeking a well-settled, understanding and respectful life partner with a positive outlook and strong family values.',
};

// Religion specific overrides so the demo of each religion's templates looks authentic
const RELIGION_SAMPLES = {
	muslim: {
		male: { name: 'Mohammad Aarif Khan', pob: 'Hyderabad, Telangana', tongue: 'Urdu / English', religion: 'Islam', sect: 'Sunni', caste: 'Pathan', practice: 'Prays 5 times daily', father: 'Mr. Abdul Rahman Khan (Businessman)', mother: 'Mrs. Shabana Khan (Homemaker)', native: 'Hyderabad, Telangana', maternal: '', diet: 'Non-Vegetarian (Halal)', address: 'Flat 12, Tolichowki, Hyderabad, Telangana - 500008', phone: '+91 99890 11223', email: 'aarif.khan@example.com', expectations: 'Looking for a practising, educated and kind-hearted partner from a respectable Muslim family.' },
		female: { name: 'Ayesha Fatima Siddiqui', pob: 'Lucknow, Uttar Pradesh', tongue: 'Urdu / English', religion: 'Islam', sect: 'Sunni', caste: 'Siddiqui', practice: 'Prays 5 times daily', father: 'Mr. Imran Siddiqui (Professor)', mother: 'Mrs. Nazia Siddiqui (Homemaker)', native: 'Lucknow, Uttar Pradesh', maternal: '', diet: 'Non-Vegetarian (Halal)', address: 'House 45, Hazratganj, Lucknow, Uttar Pradesh - 226001', phone: '+91 98390 44556', email: 'ayesha.siddiqui@example.com', expectations: 'Seeking a pious, well-educated and understanding partner with good family values.' },
	},
	christian: {
		male: { name: 'Joseph Mathew Thomas', pob: 'Kochi, Kerala', tongue: 'Malayalam / English', religion: 'Christian', sect: 'Syrian Catholic', caste: 'Syrian Christian', practice: 'St. Mary’s Church, Kochi', father: 'Mr. Mathew Thomas (Retd. Bank Manager)', mother: 'Mrs. Mary Mathew (Teacher)', native: 'Kochi, Kerala', maternal: '', diet: 'Non-Vegetarian', address: 'Thomas Villa, Edappally, Kochi, Kerala - 682024', phone: '+91 98470 12345', email: 'joseph.thomas@example.com', expectations: 'Looking for a God-fearing, caring and well-educated partner.' },
		female: { name: 'Merin Elizabeth Joseph', pob: 'Kottayam, Kerala', tongue: 'Malayalam / English', religion: 'Christian', sect: 'Syrian Catholic', caste: 'Syrian Christian', practice: 'St. George Church, Kottayam', father: 'Mr. Joseph Varghese (Businessman)', mother: 'Mrs. Elizabeth Joseph (Nurse)', native: 'Kottayam, Kerala', maternal: '', diet: 'Non-Vegetarian', address: 'Varghese House, Nagampadam, Kottayam, Kerala - 686001', phone: '+91 94470 98765', email: 'merin.joseph@example.com', expectations: 'Seeking a God-fearing, loving and settled partner from a good Christian family.' },
	},
	sikh: {
		male: { name: 'Harpreet Singh Gill', pob: 'Amritsar, Punjab', tongue: 'Punjabi / English', religion: 'Sikh', caste: 'Jatt Sikh', gotra: 'Gill', practice: 'Keshdhari', father: 'S. Gurmeet Singh Gill (Farmer & Businessman)', mother: 'Sardarni Jasbir Kaur (Homemaker)', native: 'Amritsar, Punjab', maternal: '', diet: 'Non-Vegetarian', address: 'House 21, Model Town, Amritsar, Punjab - 143001', phone: '+91 98720 11223', email: 'harpreet.gill@example.com', expectations: 'Looking for an educated, family-oriented partner from a respectable Sikh family.' },
		female: { name: 'Simran Kaur Dhillon', pob: 'Ludhiana, Punjab', tongue: 'Punjabi / English', religion: 'Sikh', caste: 'Jatt Sikh', gotra: 'Dhillon', practice: 'Keshdhari', father: 'S. Balwinder Singh Dhillon (Businessman)', mother: 'Sardarni Harjit Kaur (Teacher)', native: 'Ludhiana, Punjab', maternal: '', diet: 'Vegetarian', address: 'SCO 14, Sarabha Nagar, Ludhiana, Punjab - 141001', phone: '+91 98150 44556', email: 'simran.dhillon@example.com', expectations: 'Seeking a well-educated, caring and settled partner with strong family values.' },
	},
	jain: {
		male: { name: 'Rishabh Mahendra Jain', pob: 'Indore, Madhya Pradesh', tongue: 'Hindi / Gujarati', religion: 'Jain', sect: 'Shwetambar', caste: 'Oswal', gotra: 'Kasliwal', rashi: 'Simha (Leo)', nakshatra: 'Magha', diet: 'Strict Vegetarian (No root vegetables)', father: 'Mr. Mahendra Jain (Textile Businessman)', mother: 'Mrs. Kamla Jain (Homemaker)', native: 'Indore, Madhya Pradesh', maternal: '', address: '12, Palasia Square, Indore, Madhya Pradesh - 452001', phone: '+91 98260 11223', email: 'rishabh.jain@example.com', expectations: 'Looking for a well-educated, religious-minded Jain partner.' },
		female: { name: 'Priyanka Sunil Jain', pob: 'Surat, Gujarat', tongue: 'Gujarati / Hindi', religion: 'Jain', sect: 'Digambar', caste: 'Agarwal Jain', gotra: 'Goyal', rashi: 'Kanya (Virgo)', nakshatra: 'Hasta', diet: 'Strict Vegetarian (No root vegetables)', father: 'Mr. Sunil Jain (Diamond Trader)', mother: 'Mrs. Neeta Jain (Homemaker)', native: 'Surat, Gujarat', maternal: '', address: 'A-501, Vesu Heights, Surat, Gujarat - 395007', phone: '+91 98250 44556', email: 'priyanka.jain@example.com', expectations: 'Seeking a well-settled, vegetarian and family-minded Jain partner.' },
	},
	buddhist: {
		male: { name: 'Siddharth Rahul Gaikwad', pob: 'Nagpur, Maharashtra', tongue: 'Marathi / Hindi', religion: 'Buddhist', sect: 'Theravada', caste: 'Navayana Buddhist', practice: 'Follows Buddha Dhamma', father: 'Mr. Rahul Gaikwad (Govt. Engineer)', mother: 'Mrs. Savita Gaikwad (Teacher)', native: 'Nagpur, Maharashtra', maternal: '', address: 'Plot 8, Dhammachakra Nagar, Nagpur, Maharashtra - 440017', phone: '+91 98220 11223', email: 'siddharth.gaikwad@example.com', expectations: 'Looking for an educated, progressive and kind-hearted partner.' },
		female: { name: 'Yashodhara Milind Kamble', pob: 'Aurangabad, Maharashtra', tongue: 'Marathi / Hindi', religion: 'Buddhist', sect: 'Theravada', caste: 'Navayana Buddhist', practice: 'Follows Buddha Dhamma', father: 'Mr. Milind Kamble (Professor)', mother: 'Mrs. Rekha Kamble (Homemaker)', native: 'Aurangabad, Maharashtra', maternal: '', address: 'Flat 3, Buddha Vihar Road, Aurangabad, Maharashtra - 431001', phone: '+91 98230 44556', email: 'yashodhara.kamble@example.com', expectations: 'Seeking an educated, understanding and progressive partner.' },
	},
};

export function sampleFor(religionFamily, gender = 'Male') {
	const base = { ...BASE, ...(gender === 'Female' ? BRIDE : {}) };
	const o = RELIGION_SAMPLES[religionFamily]?.[gender === 'Female' ? 'female' : 'male'];
	const out = o ? { ...base, ...o } : base;
	if (o) {
		['gotra', 'rashi', 'nakshatra', 'manglik'].forEach((k) => {
			if (!(k in o)) out[k] = religionFamily === 'jain' ? out[k] : '';
		});
		if (religionFamily !== 'jain') out.manglik = '';
	}
	out.gender = gender;
	return out;
}

export function ageFromDob(dob) {
	const m = /^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/.exec((dob || '').trim());
	if (!m) return null;
	const d = new Date(+m[3], +m[2] - 1, +m[1]);
	if (isNaN(d)) return null;
	const now = new Date();
	let age = now.getFullYear() - d.getFullYear();
	const pm = now.getMonth() - d.getMonth();
	if (pm < 0 || (pm === 0 && now.getDate() < d.getDate())) age--;
	return age > 15 && age < 80 ? age : null;
}
