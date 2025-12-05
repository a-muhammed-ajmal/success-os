import { useState } from 'react';
import Modal from '../ui/Modal';
import { Edit, Trash2, Copy } from 'lucide-react';
import type { Connection } from '../../types/database';

interface ConnectionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  connection: Connection | null;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

export default function ConnectionDetailModal({
  isOpen,
  onClose,
  connection,
  onEdit,
  onDelete,
  onDuplicate,
}: ConnectionDetailModalProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!connection) return null;

  const handleDelete = () => {
    onDelete();
    setShowDeleteConfirm(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Connection Details" size="lg">
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
        </div>

        {/* Delete Confirmation */}
        {showDeleteConfirm && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800 mb-3">
              Are you sure you want to delete this connection? This action cannot be undone.
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

{/* Connection Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2 pb-2 border-b">
            <h4 className="font-semibold text-gray-900">Personal Information</h4>
          </div>
          <InfoField label="Full Name" value={connection.full_name} />
          <InfoField label="Date of Birth" value={connection.dob} />
          <InfoField label="Gender" value={connection.gender} />
          <InfoField label="Nationality" value={connection.nationality} />
          <InfoField label="Passport Number" value={connection.passport_number} />
          <InfoField label="Emirates ID" value={connection.emirates_id} />

          <div className="md:col-span-2 pt-2 border-t">
            <h4 className="font-semibold text-gray-900 mb-2">Contact Information</h4>
          </div>
          <InfoField label="Mobile" value={connection.mobile_number} />
          <InfoField label="WhatsApp" value={connection.whatsapp_number} />
          <InfoField label="Email" value={connection.email} />
          <InfoField label="Location" value={connection.location} />

          <div className="md:col-span-2 pt-2 border-t">
            <h4 className="font-semibold text-gray-900 mb-2">Employment Information</h4>
          </div>
          <InfoField label="Employment Status" value={connection.employment_status} />
          <InfoField label="Company Name" value={connection.company_name} />
          <InfoField label="Designation" value={connection.designation} />
          <InfoField label="Company Website" value={connection.company_website} />
          <InfoField label="Company Landline" value={connection.company_landline} />
          <InfoField label="Work Email" value={connection.work_email} />

          <div className="md:col-span-2 pt-2 border-t">
            <h4 className="font-semibold text-gray-900 mb-2">Financial Information</h4>
          </div>
          <InfoField
            label="Monthly Salary"
            value={connection.monthly_salary ? `AED ${connection.monthly_salary.toLocaleString()}` : null}
          />
          <InfoField label="Salary Bank" value={connection.salary_bank} />
          <InfoField label="AECB Score" value={connection.aecb_score} />
          <InfoField label="IBAN Number" value={connection.iban_number} />
        </div>

        {/* Metadata */}
        <div className="pt-4 border-t text-xs text-gray-500">
          <p>Created: {new Date(connection.created_at).toLocaleString()}</p>
          <p>Updated: {new Date(connection.updated_at).toLocaleString()}</p>
        </div>
      </div>
    </Modal>
  );
}

function InfoField({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-sm font-medium text-gray-900">{value || 'N/A'}</p>
    </div>
  );
}
