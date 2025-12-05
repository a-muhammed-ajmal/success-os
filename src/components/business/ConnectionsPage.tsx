import { useState, useEffect } from 'react';
import SearchBar from '../ui/SearchBar';
import ConnectionCard from './ConnectionCard';
import AddConnectionModal from './AddConnectionModal';
import ConnectionDetailModal from './ConnectionDetailModal';
import { getConnections, createConnection, updateConnection, deleteConnection, duplicateConnection } from '../../services/connectionsService';
import type { Connection } from '../../types/database';

export default function ConnectionsPage() {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedConnection, setSelectedConnection] = useState<Connection | null>(null);
  const [editingConnection, setEditingConnection] = useState<Connection | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConnections();
  }, []);

  const loadConnections = async () => {
    setLoading(true);
    try {
      const data = await getConnections();
      setConnections(data);
    } catch (error) {
      console.error('Error loading connections:', error);
      alert('Failed to load connections. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddConnection = async (connectionData: Omit<Connection, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (editingConnection) {
      await updateConnection(editingConnection.id, connectionData);
      setEditingConnection(null);
    } else {
      await createConnection(connectionData);
    }
    await loadConnections();
    setShowAddModal(false);
  };

  const handleEdit = () => {
    setEditingConnection(selectedConnection);
    setShowDetailModal(false);
    setShowAddModal(true);
  };

  const handleDelete = async () => {
    if (selectedConnection) {
      await deleteConnection(selectedConnection.id);
      await loadConnections();
    }
  };

  const handleDuplicate = async () => {
    if (selectedConnection) {
      await duplicateConnection(selectedConnection.id);
      await loadConnections();
      setShowDetailModal(false);
    }
  };

  const filterConnections = (connectionsArray: Connection[]) => {
    if (!searchQuery) return connectionsArray;
    return connectionsArray.filter(conn =>
      conn.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conn.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conn.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading connections...</p>
      </div>
    );
  }

  return (
    <div>
      <SearchBar
        placeholder="Search connections..."
        onSearch={setSearchQuery}
        onAdd={() => {
          setEditingConnection(null);
          setShowAddModal(true);
        }}
        addButtonText="Add Connection"
      />

      {/* Connections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filterConnections(connections).map((connection) => (
          <ConnectionCard
            key={connection.id}
            connection={connection}
            onClick={() => {
              setSelectedConnection(connection);
              setShowDetailModal(true);
            }}
          />
        ))}
      </div>

      {filterConnections(connections).length === 0 && (
        <div className="text-center py-12 text-gray-400">
          {searchQuery ? 'No connections found' : 'No connections yet. Add your first connection!'}
        </div>
      )}

      {/* Modals */}
      <AddConnectionModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditingConnection(null);
        }}
        onSave={handleAddConnection}
        initialData={editingConnection}
      />

      <ConnectionDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        connection={selectedConnection}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onDuplicate={handleDuplicate}
      />
    </div>
  );
}
