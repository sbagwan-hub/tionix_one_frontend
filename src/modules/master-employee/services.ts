import axiosClient from '@/lib/axios';
import { EmployeeRecord, EmployeeFilterParams } from './types';

// Mock DB helper
const LOCAL_STORAGE_KEY = 'master_employees_data';

const getLocalEmployees = (): EmployeeRecord[] => {
  if (typeof window === 'undefined') return [];
  const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!saved) {
    // Initial sample data
    const initial: EmployeeRecord[] = [
      {
        pk_emp_id: 1,
        emp_code: 'EMP001',
        fk_tit_id: 1,
        employee: 'Vijay Kumar',
        doj: '2026-01-15',
        dob: '1990-05-10',
        male: true,
        married: true,
        p_address: 'Flat 402, Shiv Towers, Mumbai',
        n_address: 'Village Post Office, Rajasthan',
        fk_dep_id: 1,
        fk_deg_id: 1,
        account_no: '987654321098',
        pf_no: 'MH/12345/67890',
        esic_no: '31234567890001001',
        pan_no: 'ABCDE1234F',
        blood_grp: 'O+',
        wp: 'Head Office',
        aadhar: '123456789012',
        username: 'vijay.k',
        question: 'What is your favorite food?',
        answer: 'Biryani',
        messaging: true,
        geolocation: true,
        type: 'Office Staff',
        att_type: true,
        police: 'Mulund Police Station',
        add_police: 'Mulund West, Mumbai',
        cont_police: '022-25641234',
        personality1: 'Ramesh Shah',
        p1_address: 'Mulund, Mumbai',
        p1_contact: '9820098200',
        personality2: 'Suresh Patil',
        p2_address: 'Thane',
        p2_contact: '9819998199',
        sb: true,
        rtgs: 'HDFC0000085',
        s_address: 'Mulund, Mumbai',
        fk_acct_id: 1,
        inform_pf: false,
        inform_esic: false,
        last_status: 'Active',
        date_time_stamp: new Date().toISOString(),
        contacts: [
          { id: '1', type: 'Phone', detail: '9876543210' },
          { id: '2', type: 'E-Mail', detail: 'vijay.k@tionix.com' }
        ],
        relatives: [
          { id: '1', relative_name: 'Sita Kumar', relationship: 'Spouse', marital_status: 'Married', dob: '1993-08-12', qualification: 'Graduate', occupation: 'Homemaker' }
        ],
        licenses: [
          { id: '1', certificate_name: 'Driving License', has_original: true, valid_until: '2035-12-31' }
        ]
      }
    ];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }
  try {
    return JSON.parse(saved);
  } catch {
    return [];
  }
};

const saveLocalEmployees = (list: EmployeeRecord[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
  }
};

export const masterEmployeeApi = {
  list: async (params?: EmployeeFilterParams): Promise<{ data: EmployeeRecord[]; total: number }> => {
    // Return local database or simulate api
    let list = getLocalEmployees();

    if (params?.employee) {
      const q = params.employee.toLowerCase();
      list = list.filter((emp) => emp.employee.toLowerCase().includes(q));
    }
    if (params?.emp_code) {
      const q = params.emp_code.toLowerCase();
      list = list.filter((emp) => emp.emp_code.toLowerCase().includes(q));
    }

    return {
      data: list,
      total: list.length,
    };
  },

  create: async (data: Omit<EmployeeRecord, 'pk_emp_id'>): Promise<EmployeeRecord> => {
    const list = getLocalEmployees();
    const newId = list.length > 0 ? Math.max(...list.map((e) => e.pk_emp_id)) + 1 : 1;
    const newRecord: EmployeeRecord = {
      ...data,
      pk_emp_id: newId,
      date_time_stamp: new Date().toISOString(),
    };
    list.push(newRecord);
    saveLocalEmployees(list);
    return newRecord;
  },

  update: async (id: number, data: Partial<EmployeeRecord>): Promise<EmployeeRecord> => {
    const list = getLocalEmployees();
    const idx = list.findIndex((e) => e.pk_emp_id === id);
    if (idx === -1) throw new Error('Employee not found');
    const updated = {
      ...list[idx],
      ...data,
      date_time_stamp: new Date().toISOString(),
    };
    list[idx] = updated;
    saveLocalEmployees(list);
    return updated;
  },

  remove: async (id: number): Promise<void> => {
    const list = getLocalEmployees();
    const filtered = list.filter((e) => e.pk_emp_id !== id);
    saveLocalEmployees(filtered);
  },
};
