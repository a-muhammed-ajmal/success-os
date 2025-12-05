import { useState } from 'react';
import Modal from '../ui/Modal';
import { Edit, Trash2, Copy, ArrowRight } from 'lucide-react';
import type { Lead } from '../../types/database';

interface LeadDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead | null;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onConvertToDeal: () => void;
}

export default function LeadDetailModal({
  isOpen,
  onClose,
  lead,
  onEdit,
  onDelete,
  onDuplicate,
  onConvertToDeal,
}: LeadDetailModalProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!lead) return null;

  const handleDelete = () => {
    onDelete();
    setShowDeleteConfirm(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Lead Details" size="lg">
      <div className="space-y-6">
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 pb-4 border-b">
          <button
            onClick={onEdit}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm"
          >
            <Edit className="w-4 h-4" />
            Edit
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
          <button
            onClick={onDuplicate}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors text-sm"
          >
            <Copy className="w-4 h-4" />
            Duplicate
          </button>
          <button
            onClick={onConvertToDeal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm"
          >
            <ArrowRight className="w-4 h-4" />
            Convert to Deal
          </button>
        </div>

        {/* Delete Confirmation */}
        {showDeleteConfirm && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800 mb-3">
              Are you sure you want to delete this lead? This action cannot be undone.
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleDelete}
                className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Lead Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoField label="Full Name" value={lead.full_name} />
          <InfoField label="Status" value={lead.status} badge />
          <InfoField label="Company" value={lead.company_name} />
          <InfoField label="Designation" value={lead.designation} />
          <InfoField label="Mobile" value={lead.mobile_number} />
          <InfoField label="WhatsApp" value={lead.whatsapp_number} />
          <InfoField label="Email" value={lead.email} />
          <InfoField label="Location" value={lead.location} />
          <InfoField label="Source" value={lead.source} />
          <InfoField label="Bank" value={lead.bank_name} />
          <InfoField label="Product Type" value={lead.product_type} />
          {lead.conditional_product && (
            <InfoField label="Specific Product" value={lead.conditional_product} />
          )}
          <InfoField label="Salary" value={lead.salary_amount ? `AED ${lead.salary_amount.toLocaleString()}` : null} />
          <InfoField label="Salary Variation" value={lead.has_salary_variation ? 'Yes' : 'No'} />
          <InfoField label="Has Credit Card" value={lead.has_current_credit_card ? 'Yes' : 'No'} />
          {lead.has_current_credit_card && (
            <>
              <InfoField
                label="Credit Card Age"
                value={`${lead.credit_card_age_years || 0} years, ${lead.credit_card_age_months || 0} months`}
              />
              <InfoField
                label="Total Credit Limit"
                value={lead.total_credit_limit ? `AED ${lead.total_credit_limit.toLocaleString()}` : null}
              />
            </>
          )}
        </div>

        {/* Metadata */}
        <div className="pt-4 border-t text-xs text-gray-500">
          <p>Created: {new Date(lead.created_at).toLocaleString()}</p>
          <p>Updated: {new Date(lead.updated_at).toLocaleString()}</p>
        </div>
      </div>
    </Modal>
  );
}

function InfoField({ label, value, badge }: { label: string; value: string | null | undefined; badge?: boolean }) {
  return (
    <div>
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      {badge && value ? (
        <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-sm font-medium rounded">
          {value}
        </span>
      ) : (
        <p className="text-sm font-medium text-gray-900">{value || 'N/A'}</p>
      )}
    </div>
  );
}
