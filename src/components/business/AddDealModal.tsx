import { useState } from 'react';
import type { FormEvent } from 'react';
import Modal from '../ui/Modal';
import FormSelect from '../ui/FormSelect';
import { UAEBanks } from '../../data/bankData';
import type { Deal, DealStage } from '../../types/database';

interface AddDealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (deal: Omit<Deal, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  initialData?: Deal | null;
}

const STAGES: DealStage[] = ['Application Processing', 'Verification Needed', 'Activation Needed', 'Completed', 'Unsuccessful'];

export default function AddDealModal({ isOpen, onClose, onSave, initialData }: AddDealModalProps) {
  const[formData, setFormData] = useState({
    lead_id: initialData?.lead_id || null,
    stage: initialData?.stage || 'Application Processing' as DealStage,
    application_number: initialData?.application_number || '',
    bpm_id_number: initialData?.bpm_id_number || '',
    dob: initialData?.dob || '',
    nationality: initialData?.nationality || '',
    emirates_id: initialData?.emirates_id || '',
    passport_number: initialData?.passport_number || '',
    salary_bank: initialData?.salary_bank || '',
    aecb_score: initialData?.aecb_score || '',
    professional_email: initialData?.professional_email || '',
    iban_number: initialData?.iban_number || '',
    company_landline: initialData?.company_landline || '',
    company_website: initialData?.company_website || '',
    submitted_date: initialData?.submitted_date || new Date().toISOString().split('T')[0],
    completed_date: initialData?.completed_date || null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSave({
        ...formData,
        application_number: formData.application_number || null,
        bpm_id_number: formData.bpm_id_number || null,
        dob: formData.dob || null,
        nationality: formData.nationality || null,
        emirates_id: formData.emirates_id || null,
        passport_number: formData.passport_number || null,
        salary_bank: formData.salary_bank || null,
        aecb_score: formData.aecb_score || null,
        professional_email: formData.professional_email || null,
        iban_number: formData.iban_number || null,
        company_landline: formData.company_landline || null,
        company_website: formData.company_website || null,
        submitted_date: formData.submitted_date || null,
      });
      onClose();
    } catch (error) {
      console.error('Error saving deal:', error);
      alert('Failed to save deal. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Edit Deal' : 'Add New Deal'} size="lg">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Stage */}
          <FormSelect
            label="Stage"
            value={formData.stage}
            onChange={(value) => setFormData({ ...formData, stage: value as DealStage })}
            options={STAGES}
            required
          />

          {/* Application Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Application Number</label>
            <input
              type="text"
              value={formData.application_number}
              onChange={(e) => setFormData({ ...formData, application_number: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* BPM ID Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">BPM ID Number</label>
            <input
              type="text"
              value={formData.bpm_id_number}
              onChange={(e) => setFormData({ ...formData, bpm_id_number: e.target.value })}
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

          {/* Professional Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Professional Email</label>
            <input
              type="email"
              value={formData.professional_email}
              onChange={(e) => setFormData({ ...formData, professional_email: e.target.value })}
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

          {/* Submitted Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Submitted Date</label>
            <input
              type="date"
              value={formData.submitted_date || ''}
              onChange={(e) => setFormData({ ...formData, submitted_date: e.target.value })}
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
            {isSubmitting ? 'Saving...' : initialData ? 'Update Deal' : 'Add Deal'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
