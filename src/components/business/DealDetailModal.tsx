import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import { Edit, Trash2, Copy, ArrowRight } from 'lucide-react';
import type { Deal } from '../../types/database';
import { getLeadById } from '../../services/leadsService';

interface DealDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  deal: Deal | null;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onConvertToConnection: () => void;
}

export default function DealDetailModal({
  isOpen,
  onClose,
  deal,
  onEdit,
  onDelete,
  onDuplicate,
  onConvertToConnection,
}: DealDetailModalProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [leadData, setLeadData] = useState<any>(null);

  useEffect(() => {
    if (deal?.lead_id) {
      getLeadById(deal.lead_id).then(setLeadData);
    }
  }, [deal]);

  if (!deal) return null;

  const handleDelete = () => {
    onDelete();
    setShowDeleteConfirm(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Deal Details" size="lg">
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
            onClick={onConvertToConnection}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm"
          >
            <ArrowRight className="w-4 h-4" />
            Convert to Connection
          </button>
        </div>

        {/* Delete Confirmation */}
        {showDeleteConfirm && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800 mb-3">
              Are you sure you want to delete this deal? This action cannot be undone.
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

        {/* Deal Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoField label="Stage" value={deal.stage} badge />
          <InfoField label="Application Number" value={deal.application_number} />
          <InfoField label="BPM ID Number" value={deal.bpm_id_number} />

          {leadData && (
            <>
              <div className="md:col-span-2 pt-2 border-t">
                <h4 className="font-semibold text-gray-900 mb-2">Lead Information</h4>
              </div>
              <InfoField label="Full Name" value={leadData.full_name} />
              <InfoField label="Company" value={leadData.company_name} />
              <InfoField label="Mobile" value={leadData.mobile_number} />
              <InfoField label="Email" value={leadData.email} />
            </>
          )}

          <div className="md:col-span-2 pt-2 border-t">
            <h4 className="font-semibold text-gray-900 mb-2">Personal Details</h4>
          </div>
          <InfoField label="Date of Birth" value={deal.dob} />
          <InfoField label="Nationality" value={deal.nationality} />
          <InfoField label="Emirates ID" value={deal.emirates_id} />
          <InfoField label="Passport Number" value={deal.passport_number} />

          <div className="md:col-span-2 pt-2 border-t">
            <h4 className="font-semibold text-gray-900 mb-2">Banking & Financial</h4>
          </div>
          <InfoField label="Salary Bank" value={deal.salary_bank} />
          <InfoField label="AECB Score" value={deal.aecb_score} />
          <InfoField label="IBAN Number" value={deal.iban_number} />
          <InfoField label="Professional Email" value={deal.professional_email} />

          <div className="md:col-span-2 pt-2 border-t">
            <h4 className="font-semibold text-gray-900 mb-2">Company Details</h4>
          </div>
          <InfoField label="Company Landline" value={deal.company_landline} />
          <InfoField label="Company Website" value={deal.company_website} />

          <div className="md:col-span-2 pt-2 border-t">
            <h4 className="font-semibold text-gray-900 mb-2">Timeline</h4>
          </div>
          <InfoField label="Submitted Date" value={deal.submitted_date} />
          <InfoField label="Completed Date" value={deal.completed_date} />
        </div>

        {/* Metadata */}
        <div className="pt-4 border-t text-xs text-gray-500">
          <p>Created: {new Date(deal.created_at).toLocaleString()}</p>
          <p>Updated: {new Date(deal.updated_at).toLocaleString()}</p>
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
