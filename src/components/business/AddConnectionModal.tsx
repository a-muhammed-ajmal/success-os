import { useState } from 'react';
import type { FormEvent } from 'react';
import Modal from '../ui/Modal';
import FormSelect from '../ui/FormSelect';
import { UAEBanks } from '../../data/bankData';
import type { Connection, UAEEmirate, EmploymentStatus, GenderType } from '../../types/database';

interface AddConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (connection: Omit<Connection, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  initialData?: Connection | null;
}

const EMIRATES: UAEEmirate[] = ['Abu Dhabi', 'Dubai', 'Sharjah', 'Ajman', 'Umm Al Quwain', 'Ras Al Khaimah', 'Fujairah'];
const EMPLOYMENT_STATUSES: EmploymentStatus[] = ['Salaried', 'Self-Employed'];
const GENDERS: GenderType[] = ['Male', 'Female', 'Other'];

export default function AddConnectionModal({ isOpen, onClose, onSave, initialData }: AddConnectionModalProps) {
  const [formData, setFormData] = useState({
    full_name: initialData?.full_name || '',
    dob: initialData?.dob || '',
    gender: (initialData?.gender || '') as GenderType | '',
    nationality: initialData?.nationality || '',
    passport_number: initialData?.passport_number || '',
    emirates_id: initialData?.emirates_id || '',
    mobile_number: initialData?.mobile_number || '',
    whatsapp_number: initialData?.whatsapp_number || '',
    email: initialData?.email || '',
    location: (initialData?.location || '') as UAEEmirate | '',
    employment_status: (initialData?.employment_status || '') as EmploymentStatus | '',
    company_name: initialData?.company_name || '',
    company_website: initialData?.company_website || '',
    company_landline: initialData?.company_landline || '',
    work_email: initialData?.work_email || '',
    designation: initialData?.designation || '',
    monthly_salary: initialData?.monthly_salary || 0,
    salary_bank: initialData?.salary_bank || '',
    aecb_score: initialData?.aecb_score || '',
    iban_number: initialData?.iban_number || '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSave({
        ...formData,
        dob: formData.dob || null,
        gender: formData.gender || null,
        nationality: formData.nationality || null,
        passport_number: formData.passport_number || null,
        emirates_id: formData.emirates_id || null,
        mobile_number: formData.mobile_number || null,
        whatsapp_number: formData.whatsapp_number || null,
        email: formData.email || null,
        location: formData.location || null,
        employment_status: formData.employment_status || null,
        company_name: formData.company_name || null,
        company_website: formData.company_website || null,
        company_landline: formData.company_landline || null,
        work_email: formData.work_email || null,
        designation: formData.designation || null,
        monthly_salary: formData.monthly_salary || null,
        salary_bank: formData.salary_bank || null,
        aecb_score: formData.aecb_score || null,
        iban_number: formData.iban_number || null,
      });
      onClose();
    } catch (error) {
      console.error('Error saving connection:', error);
      alert('Failed to save connection. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Edit Connection' : 'Add New Connection'} size="lg">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Full Name */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
            <input
              type="date"
              value={formData.dob}
              onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Gender */}
          <FormSelect
            label="Gender"
            value={formData.gender}
            onChange={(value) => setFormData({ ...formData, gender: value as GenderType })}
            options={GENDERS}
            placeholder="Select Gender"
          />

          {/* Nationality */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
            <input
              type="text"
              value={formData.nationality}
              onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Passport Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Passport Number</label>
            <input
              type="text"
              value={formData.passport_number}
              onChange={(e) => setFormData({ ...formData, passport_number: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Emirates ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Emirates ID</label>
            <input
              type="text"
              value={formData.emirates_id}
              onChange={(e) => setFormData({ ...formData, emirates_id: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
            <input
              type="tel"
              value={formData.mobile_number}
              onChange={(e) => setFormData({ ...formData, mobile_number: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* WhatsApp Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
            <input
              type="tel"
              value={formData.whatsapp_number}
              onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Location */}
          <FormSelect
            label="Location (Emirate)"
            value={formData.location}
            onChange={(value) => setFormData({ ...formData, location: value as UAEEmirate })}
            options={EMIRATES}
            placeholder="Select Emirate"
          />

          {/* Employment Status */}
          <FormSelect
            label="Employment Status"
            value={formData.employment_status}
            onChange={(value) => setFormData({ ...formData, employment_status: value as EmploymentStatus })}
            options={EMPLOYMENT_STATUSES}
            placeholder="Select Status"
          />

          {/* Company Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
            <input
              type="text"
              value={formData.company_name}
              onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Company Website */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company Website</label>
            <input
              type="url"
              value={formData.company_website}
              onChange={(e) => setFormData({ ...formData, company_website: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Company Landline */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company Landline</label>
            <input
              type="tel"
              value={formData.company_landline}
              onChange={(e) => setFormData({ ...formData, company_landline: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Work Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Work Email</label>
            <input
              type="email"
              value={formData.work_email}
              onChange={(e) => setFormData({ ...formData, work_email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Designation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
            <input
              type="text"
              value={formData.designation}
              onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Monthly Salary */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Salary (AED)</label>
            <input
              type="number"
              value={formData.monthly_salary}
              onChange={(e) => setFormData({ ...formData, monthly_salary: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Salary Bank */}
          <FormSelect
            label="Salary Bank"
            value={formData.salary_bank || ''}
            onChange={(value) => setFormData({ ...formData, salary_bank: value })}
            options={UAEBanks}
            placeholder="Select Bank"
          />

          {/* AECB Score */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">AECB Score</label>
            <input
              type="text"
              value={formData.aecb_score}
              onChange={(e) => setFormData({ ...formData, aecb_score: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* IBAN Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">IBAN Number</label>
            <input
              type="text"
              value={formData.iban_number}
              onChange={(e) => setFormData({ ...formData, iban_number: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : initialData ? 'Update Connection' : 'Add Connection'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
