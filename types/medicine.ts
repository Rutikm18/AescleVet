export interface Medicine {
  id: string
  name: string
  category: string
  mrp: number
  quantity: number
  expiryDate: string
  purchaseDate: string
  totalPriceInvested: number
  manufacturer?: string
  batchNumber?: string
  description?: string
  usageCount?: number // Track how often medicine is used
  lastUsed?: string // Last usage date
}

export interface MedicineCategory {
  id: string
  name: string
}

export const VETERINARY_MEDICINE_CATEGORIES = [
  'Other',
  'Antibiotics',
  'Pain Relief & Anti-inflammatory',
  'Vitamins & Supplements',
  'Deworming',
  'Flea & Tick Control',
  'Wound Care',
  'Eye & Ear Care',
  'Respiratory',
  'Digestive',
  'Cardiovascular',
  'Dermatology',
  'Hormonal',
  'Vaccines',
  'Anesthesia',
]

export const VETERINARY_MEDICINES_DATABASE = [
  // Antibiotics
  'Amoxicillin', 'Amoxicillin-Clavulanate', 'Cephalexin', 'Enrofloxacin', 'Metronidazole',
  'Doxycycline', 'Clindamycin', 'Trimethoprim-Sulfa', 'Azithromycin', 'Ciprofloxacin',
  
  // Pain Relief
  'Carprofen', 'Meloxicam', 'Firocoxib', 'Gabapentin', 'Tramadol', 'Buprenorphine',
  'Morphine', 'Aspirin', 'Acetaminophen',
  
  // Deworming
  'Fenbendazole', 'Pyrantel Pamoate', 'Praziquantel', 'Ivermectin', 'Milbemycin',
  'Selamectin', 'Moxidectin',
  
  // Flea & Tick
  'Fipronil', 'Imidacloprid', 'Fluralaner', 'Afoxolaner', 'Sarolaner', 'Spinosad',
  'Nitenpyram', 'Lufenuron',
  
  // Vitamins & Supplements
  'Multivitamin', 'Vitamin B Complex', 'Vitamin E', 'Calcium', 'Phosphorus',
  'Omega-3 Fatty Acids', 'Probiotics', 'Glucosamine', 'Chondroitin',
  
  // Wound Care
  'Chlorhexidine', 'Povidone-Iodine', 'Silver Sulfadiazine', 'Triple Antibiotic Ointment',
  'Hydrogen Peroxide', 'Saline Solution',
  
  // Eye & Ear
  'Gentamicin Eye Drops', 'Tobramycin Eye Drops', 'Ciprofloxacin Eye Drops',
  'Ear Cleaner', 'Otomax', 'Tresaderm',
  
  // Respiratory
  'Theophylline', 'Terbutaline', 'Aminophylline', 'Albuterol',
  
  // Digestive
  'Metoclopramide', 'Ondansetron', 'Famotidine', 'Omeprazole', 'Sucralfate',
  'Lactulose', 'Metronidazole',
  
  // Cardiovascular
  'Enalapril', 'Benazepril', 'Furosemide', 'Digoxin', 'Atenolol', 'Diltiazem',
  
  // Dermatology
  'Ketoconazole', 'Miconazole', 'Chlorhexidine Shampoo', 'Hydrocortisone',
  'Prednisolone', 'Cyclosporine',
  
  // Hormonal
  'Insulin', 'Levothyroxine', 'Prednisone', 'Prednisolone', 'Deslorelin',
  
  // Vaccines
  'DHPP', 'Rabies', 'Bordetella', 'Lyme', 'Leptospirosis', 'Canine Influenza',
  
  // Anesthesia
  'Isoflurane', 'Sevoflurane', 'Propofol', 'Ketamine', 'Dexmedetomidine',
  
  // Other Common
  'Diphenhydramine', 'Loperamide', 'Kaolin-Pectin', 'Activated Charcoal',
  'Atropine', 'Epinephrine', 'Diazepam', 'Phenobarbital'
]
