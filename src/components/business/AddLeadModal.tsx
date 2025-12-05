import { useState } from 'react';
import type { FormEvent } from 'react';
import Modal from '../ui/Modal';
import FormSelect from '../ui/FormSelect';
import FormToggle from '../ui/FormToggle';
import { UAEBanks, EIBCreditCards, isEmiratesIslamicBank } from '../../data/bankData';
import type { Lead, UAEEmirate, LeadSource, LeadProductType, LeadStatus } from '../../types/database';

interface AddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (lead: Omit<Lead, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  initialData?: Lead | null;
}

const EMIRATES: UAEEmirate[] = ['Abu Dhabi', 'Dubai', 'Sharjah', 'Ajman', 'Umm Al Quwain', 'Ras Al Khaimah', 'Fujairah'];
const SOURCES: LeadSource[] = ['Existing Connection', 'Social Media', 'LinkedIn', 'Cold Calling', 'Referral', 'Website', 'Other'];
const PRODUCT_TYPES: LeadProductType[] = ['Credit Card', 'Personal Loan', 'Auto Loan', 'Account Opening', 'Other'];
const STATUSES: LeadStatus[] = ['New Lead', 'Qualified Lead', 'Appointment Booked'];

export default function AddLeadModal({ isOpen, onClose, onSave, initialData }: AddLeadModalProps) {
  const [formData, setFormData] = useState({
    full_name: initialData?.full_name || '',
    company_name: initialData?.company_name || '',
    designation: initialData?.designation || '',
    mobile_number: initialData?.mobile_number || '',
    whatsapp_number: initialData?.whatsapp_number || '',
    email: initialData?.email || '',
    location: (initialData?.location || '') as UAEEmirate | '',
    source: (initialData?.source || '') as LeadSource | '',
    bank_name: initialData?.bank_name || '',
    product_type: (initialData?.product_type || '') as LeadProductType | '',
    conditional_product: initialData?.conditional_product || null,
    salary_amount: initialData?.salary_amount || 0,
    has_salary_variation: initialData?.has_salary_variation || false,
    has_current_credit_card: initialData?.has_current_credit_card || false,
    credit_card_age_years: initialData?.credit_card_age_years || 0,
    credit_card_age_months: initialData?.credit_card_age_months || 0,
    total_credit_limit: initialData?.total_credit_limit || 0,
    status: (initialData?.status || 'New Lead') as LeadStatus,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if EIB credit card product dropdown should show
  const showEIBProducts = isEmiratesIslamicBank(formData.bank_name) && formData.product_type === 'Credit Card';

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSave({
        ...formData,
        location: formData.location || null,
        source: formData.source || null,
        product_type: formData.product_type || null,
        company_name: formData.company_name || null,
        designation: formData.designation || null,
        mobile_number: formData.mobile_number || null,
        whatsapp_number: formData.whatsapp_number || null,
        email: formData.email || null,
        bank_name: formData.bank_name || null,
        salary_amount: formData.salary_amount || null,
        credit_card_age_years: formData.has_current_credit_card ? formData.credit_card_age_years : null,
        credit_card_age_months: formData.has_current_credit_card ? formData.credit_card_age_months : null,
        total_credit_limit: formData.has_current_credit_card ? formData.total_credit_limit : null,
      });
      onClose();
    } catch (error) {
      console.error('Error saving lead:', error);
      alert('Failed to save lead. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Lead' : 'Add New Lead'}
      size="lg"
    >
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
          <div className="md:col-span-2">
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

          {/* Source */}
          <FormSelect
            label="Source"
            value={formData.source}
            onChange={(value) => setFormData({ ...formData, source: value as LeadSource })}
            options={SOURCES}
            placeholder="Select Source"
          />

          {/* Bank */}
          <FormSelect
            label="Bank"
            value={formData.bank_name || ''}
            onChange={(value) => setFormData({ ...formData, bank_name: value })}
            options={UAEBanks}
            placeholder="Select Bank"
          />

          {/* Product Type */}
          <FormSelect
            label="Product Type"
            value={formData.product_type}
            onChange={(value) => setFormData({ ...formData, product_type: value as LeadProductType, conditional_product: null })}
            options={PRODUCT_TYPES}
            placeholder="Select Product Type"
          />

          {/* Conditional EIB Credit Card Products */}
          {showEIBProducts && (
            <div className="md:col-span-2">
              <FormSelect
                label="Emirates Islamic Bank Credit Card"
                value={formData.conditional_product || ''}
                onChange={(value) => setFormData({ ...formData, conditional_product: value })}
                options={EIBCreditCards}
                placeholder="Select Credit Card Product"
              />
            </div>
          )}

          {/* Salary Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Salary Amount (AED)</label>
            <input
              type="number"
              value={formData.salary_amount}
              onChange={(e) => setFormData({ ...formData, salary_amount: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Status */}
          <FormSelect
            label="Status"
            value={formData.status}
            onChange={(value) => setFormData({ ...formData, status: value as LeadStatus })}
            options={STATUSES}
            required
          />

          {/* Salary Variation Toggle */}
          <div className="md:col-span-2">
            <FormToggle
              label="Salary Variation in Last 3 Months?"
              enabled={formData.has_salary_variation}
              onChange={(value) => setFormData({ ...formData, has_salary_variation: value })}
            />
            {formData.has_salary_variation && (
              <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800 font-medium">
                  ⚠️ Caution: Please provide the last three months' salary payslips.
                </p>
              </div>
            )}
          </div>

          {/* Current Credit Card Toggle */}
          <div className="md:col-span-2">
            <FormToggle
              label="Currently Using Any Credit Cards?"
              enabled={formData.has_current_credit_card}
              onChange={(value) => setFormData({ ...formData, has_current_credit_card: value })}
            />
            {formData.has_current_credit_card && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Years</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.credit_card_age_years}
                    onChange={(e) => setFormData({ ...formData, credit_card_age_years: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Months</label>
                  <input
                    type="number"
                    min="0"
                    max="11"
                    value={formData.credit_card_age_months}
                    onChange={(e) => setFormData({ ...formData, credit_card_age_months: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Credit Limit (AED)</label>
                  <input
                    type="number"
                    value={formData.total_credit_limit}
                    onChange={(e) => setFormData({ ...formData, total_credit_limit: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            )}
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
            {isSubmitting ? 'Saving...' : initialData ? 'Update Lead' : 'Add Lead'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
