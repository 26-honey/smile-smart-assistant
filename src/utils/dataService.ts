
import Papa from 'papaparse';
import FAQsData from '@/assets/FAQs.csv?raw';
import DoctorsData from '@/assets/Doctors.csv?raw';
import HospitalsData from '@/assets/Hospitals.csv?raw';
import InsuranceData from '@/assets/Insurance.csv?raw';

// Parse CSV data
export const parseCSV = (csvString: string) => {
  const result = Papa.parse(csvString, {
    header: true,
    skipEmptyLines: true
  });
  return result.data;
};

// Exported data objects
export const FAQs = parseCSV(FAQsData);
export const Doctors = parseCSV(DoctorsData);
export const Hospitals = parseCSV(HospitalsData);
export const Insurance = parseCSV(InsuranceData);

// Convert all objects to embeddings-friendly strings
export const getFAQsText = () => {
  return FAQs.map(faq => 
    `Question: ${faq.Question}\nAnswer: ${faq.Answer}`
  ).join('\n\n');
};

export const getDoctorsText = () => {
  return Doctors.map(doc => 
    `Doctor: ${doc['First Name']} ${doc['Last Name']}, Specialization: ${doc.Specialization}, Available: ${doc.days_available}`
  ).join('\n\n');
};

export const getHospitalsText = () => {
  return Hospitals.map(hospital => 
    `Hospital: ${hospital.hospital_name}, Location: ${hospital.branch_location}, Address: ${hospital.address}, Hours: ${hospital.open_hours}, Urgent Care: ${hospital.urgent_care}`
  ).join('\n\n');
};

export const getInsuranceText = () => {
  return Insurance.map(ins => 
    `Provider: ${ins['insurance provider Name']}, Type: ${ins.coverage_type}, Status: ${ins.insurance_status}`
  ).join('\n\n');
};

// For appointment scheduling
export const getDoctorsBySpecialty = (specialty: string) => {
  return Doctors.filter(doc => 
    doc.Specialization.toLowerCase() === specialty.toLowerCase()
  ).map(doc => `Dr. ${doc['First Name']} ${doc['Last Name']}`);
};

export const getAvailableDays = (doctorName: string) => {
  const nameParts = doctorName.replace('Dr. ', '').split(' ');
  const doctor = Doctors.find(doc => 
    doc['First Name'] === nameParts[0] && doc['Last Name'] === nameParts[1]
  );
  return doctor ? doctor.days_available.split(',') : [];
};

export const checkInsuranceValidity = (insuranceProvider: string) => {
  const validInsurances = Insurance.filter(ins => 
    ins['insurance provider Name'].toLowerCase() === insuranceProvider.toLowerCase() && 
    ins.insurance_status === 'Yes'
  );
  return validInsurances.length > 0;
};
