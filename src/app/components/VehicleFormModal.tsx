import React, { useState, useEffect } from 'react';
import { X, Car } from 'lucide-react';
import { Car as CarType } from '../data/mockData';

interface VehicleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (vehicle: Partial<CarType>) => void;
  vehicle?: CarType;
  mode: 'create' | 'edit';
}

const colorOptions = [
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Black', hex: '#000000' },
  { name: 'Silver', hex: '#C0C0C0' },
  { name: 'Grey', hex: '#808080' },
  { name: 'Red', hex: '#DC143C' },
  { name: 'Blue', hex: '#4169E1' },
  { name: 'Green', hex: '#228B22' },
  { name: 'Yellow', hex: '#FFD700' },
];

const statusOptions: CarType['status'][] = ['available', 'out', 'hold', 'service', 'cleaning'];

export function VehicleFormModal({ isOpen, onClose, onSave, vehicle, mode }: VehicleFormModalProps) {
  const [formData, setFormData] = useState<Partial<CarType>>({
    rego: '',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    color: 'White',
    colorHex: '#FFFFFF',
    bay: '',
    status: 'available',
    regoExpiry: '',
    vin: '',
    odometer: 0,
    fuelType: 'Petrol',
    transmission: 'Automatic',
  });

  useEffect(() => {
    if (vehicle && mode === 'edit') {
      setFormData(vehicle);
    } else {
      setFormData({
        rego: '',
        make: '',
        model: '',
        year: new Date().getFullYear(),
        color: 'White',
        colorHex: '#FFFFFF',
        bay: '',
        status: 'available',
        regoExpiry: '',
        vin: '',
        odometer: 0,
        fuelType: 'Petrol',
        transmission: 'Automatic',
      });
    }
  }, [vehicle, mode, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleColorChange = (colorName: string, colorHex: string) => {
    setFormData({ ...formData, color: colorName, colorHex });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB] bg-gradient-to-r from-[#F8F9FA] to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#3B82F6] to-[#2563EB] rounded-lg flex items-center justify-center">
              <Car className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[#1A1A1D]">
                {mode === 'create' ? 'Add New Vehicle' : 'Edit Vehicle'}
              </h2>
              <p className="text-xs text-[#6B7280]">
                {mode === 'create' ? 'Create a new vehicle in the fleet' : 'Update vehicle information'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[#F8F9FA] transition-colors"
          >
            <X className="w-5 h-5 text-[#6B7280]" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="px-6 py-6 space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-sm font-semibold text-[#1A1A1D] mb-3">Basic Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#6B7280] mb-1.5">
                    Registration Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.rego}
                    onChange={(e) => setFormData({ ...formData, rego: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 bg-white border border-[#E5E7EB] rounded-lg text-sm font-mono text-[#1A1A1D] focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F620] transition-all"
                    placeholder="ABC-123"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#6B7280] mb-1.5">
                    Bay Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.bay}
                    onChange={(e) => setFormData({ ...formData, bay: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#E5E7EB] rounded-lg text-sm text-[#1A1A1D] focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F620] transition-all"
                    placeholder="Bay 1"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#6B7280] mb-1.5">
                    Make *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.make}
                    onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#E5E7EB] rounded-lg text-sm text-[#1A1A1D] focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F620] transition-all"
                    placeholder="Toyota"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#6B7280] mb-1.5">
                    Model *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#E5E7EB] rounded-lg text-sm text-[#1A1A1D] focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F620] transition-all"
                    placeholder="Camry"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#6B7280] mb-1.5">
                    Year *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 bg-white border border-[#E5E7EB] rounded-lg text-sm text-[#1A1A1D] focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F620] transition-all"
                    min="1990"
                    max={new Date().getFullYear() + 1}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#6B7280] mb-1.5">
                    Status *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as CarType['status'] })}
                    className="w-full px-3 py-2 bg-white border border-[#E5E7EB] rounded-lg text-sm text-[#1A1A1D] focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F620] transition-all"
                  >
                    {statusOptions.map(status => (
                      <option key={status} value={status} className="capitalize">
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <h3 className="text-sm font-semibold text-[#1A1A1D] mb-3">Color</h3>
              <div className="grid grid-cols-4 gap-2">
                {colorOptions.map((colorOption) => (
                  <button
                    key={colorOption.name}
                    type="button"
                    onClick={() => handleColorChange(colorOption.name, colorOption.hex)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all ${
                      formData.color === colorOption.name
                        ? 'border-[#3B82F6] bg-[#3B82F620]'
                        : 'border-[#E5E7EB] hover:border-[#9CA3AF]'
                    }`}
                  >
                    <span
                      className="w-4 h-4 rounded-full border-2 border-[#E5E7EB]"
                      style={{ backgroundColor: colorOption.hex }}
                    />
                    <span className="text-xs font-medium text-[#1A1A1D]">{colorOption.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Vehicle Details */}
            <div>
              <h3 className="text-sm font-semibold text-[#1A1A1D] mb-3">Vehicle Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#6B7280] mb-1.5">
                    VIN Number
                  </label>
                  <input
                    type="text"
                    value={formData.vin || ''}
                    onChange={(e) => setFormData({ ...formData, vin: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#E5E7EB] rounded-lg text-sm font-mono text-[#1A1A1D] focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F620] transition-all"
                    placeholder="1HGBH41JXMN109186"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#6B7280] mb-1.5">
                    Odometer (km)
                  </label>
                  <input
                    type="number"
                    value={formData.odometer || 0}
                    onChange={(e) => setFormData({ ...formData, odometer: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 bg-white border border-[#E5E7EB] rounded-lg text-sm text-[#1A1A1D] focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F620] transition-all"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#6B7280] mb-1.5">
                    Fuel Type
                  </label>
                  <select
                    value={formData.fuelType || 'Petrol'}
                    onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#E5E7EB] rounded-lg text-sm text-[#1A1A1D] focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F620] transition-all"
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Electric">Electric</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#6B7280] mb-1.5">
                    Transmission
                  </label>
                  <select
                    value={formData.transmission || 'Automatic'}
                    onChange={(e) => setFormData({ ...formData, transmission: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#E5E7EB] rounded-lg text-sm text-[#1A1A1D] focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F620] transition-all"
                  >
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-medium text-[#6B7280] mb-1.5">
                    Registration Expiry *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.regoExpiry}
                    onChange={(e) => setFormData({ ...formData, regoExpiry: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#E5E7EB] rounded-lg text-sm text-[#1A1A1D] focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F620] transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#E5E7EB] bg-[#F8F9FA]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-[#6B7280] hover:text-[#1A1A1D] hover:bg-white rounded-lg border border-[#E5E7EB] transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-[#3B82F6] hover:bg-[#2563EB] rounded-lg shadow-sm transition-all"
            >
              {mode === 'create' ? 'Create Vehicle' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
