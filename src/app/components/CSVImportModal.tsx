import React, { useState, useRef } from 'react';
import { X, Upload, FileText, AlertCircle, CheckCircle, Download } from 'lucide-react';
import { Car } from '../data/mockData';
import { Button } from './Button';

interface CSVImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (vehicles: Partial<Car>[]) => void;
}

interface ImportError {
  row: number;
  field: string;
  message: string;
}

const colorMap: Record<string, string> = {
  'white': '#FFFFFF',
  'black': '#000000',
  'silver': '#C0C0C0',
  'grey': '#808080',
  'gray': '#808080',
  'red': '#DC143C',
  'blue': '#4169E1',
  'green': '#228B22',
  'yellow': '#FFD700',
};

export function CSVImportModal({ isOpen, onClose, onImport }: CSVImportModalProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [parsedVehicles, setParsedVehicles] = useState<Partial<Car>[]>([]);
  const [errors, setErrors] = useState<ImportError[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'text/csv') {
      processFile(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      parseCSV(text);
    };
    reader.readAsText(file);
  };

  const parseCSV = (text: string) => {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length < 2) {
      setErrors([{ row: 0, field: 'file', message: 'CSV file is empty or has no data rows' }]);
      return;
    }

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const vehicles: Partial<Car>[] = [];
    const newErrors: ImportError[] = [];

    // Validate headers
    const requiredHeaders = ['rego', 'make', 'model', 'year', 'color', 'regoexpiry'];
    const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
    if (missingHeaders.length > 0) {
      newErrors.push({
        row: 0,
        field: 'headers',
        message: `Missing required columns: ${missingHeaders.join(', ')}`
      });
      setErrors(newErrors);
      return;
    }

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const vehicle: Partial<Car> = {};

      headers.forEach((header, index) => {
        const value = values[index] || '';
        
        switch (header) {
          case 'rego':
            if (!value) {
              newErrors.push({ row: i, field: 'rego', message: 'Registration is required' });
            }
            vehicle.rego = value.toUpperCase();
            break;
          
          case 'make':
            if (!value) {
              newErrors.push({ row: i, field: 'make', message: 'Make is required' });
            }
            vehicle.make = value;
            break;
          
          case 'model':
            if (!value) {
              newErrors.push({ row: i, field: 'model', message: 'Model is required' });
            }
            vehicle.model = value;
            break;
          
          case 'year':
            const year = parseInt(value);
            if (isNaN(year) || year < 1900 || year > new Date().getFullYear() + 1) {
              newErrors.push({ row: i, field: 'year', message: 'Invalid year' });
            }
            vehicle.year = year;
            break;
          
          case 'color':
            const colorLower = value.toLowerCase();
            vehicle.color = value;
            vehicle.colorHex = colorMap[colorLower] || '#FFFFFF';
            break;
          
          case 'regoexpiry':
            const date = new Date(value);
            if (isNaN(date.getTime())) {
              newErrors.push({ row: i, field: 'regoExpiry', message: 'Invalid date format (use YYYY-MM-DD)' });
            }
            vehicle.regoExpiry = value;
            break;
          
          case 'bay':
            vehicle.bay = value || undefined;
            break;
          
          case 'vin':
            vehicle.vin = value || undefined;
            break;
          
          case 'odometer':
            const odometer = parseInt(value);
            if (!isNaN(odometer)) {
              vehicle.odometer = odometer;
            }
            break;
          
          case 'fueltype':
            vehicle.fuelType = value || 'Petrol';
            break;
          
          case 'transmission':
            vehicle.transmission = value || 'Automatic';
            break;
          
          case 'status':
            const status = value.toLowerCase() as Car['status'];
            if (['available', 'out', 'hold', 'service', 'cleaning'].includes(status)) {
              vehicle.status = status;
            } else {
              vehicle.status = 'available';
            }
            break;
        }
      });

      // Set defaults
      if (!vehicle.status) vehicle.status = 'available';
      if (!vehicle.fuelType) vehicle.fuelType = 'Petrol';
      if (!vehicle.transmission) vehicle.transmission = 'Automatic';

      vehicles.push(vehicle);
    }

    setParsedVehicles(vehicles);
    setErrors(newErrors);
  };

  const handleImport = () => {
    if (parsedVehicles.length > 0 && errors.length === 0) {
      onImport(parsedVehicles);
      handleClose();
    }
  };

  const handleClose = () => {
    setParsedVehicles([]);
    setErrors([]);
    setFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  const downloadTemplate = () => {
    const headers = 'rego,make,model,year,color,regoExpiry,bay,vin,odometer,fuelType,transmission,status';
    const example = 'ABC123,Toyota,Camry,2023,White,2026-12-31,Bay 1,JT2BF18K0X0123456,45000,Petrol,Automatic,available';
    const csv = `${headers}\n${example}`;
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vehicle_import_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#F97066] to-[#FDA29B] px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                <Upload className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-white">Import Vehicles from CSV</h2>
                <p className="text-white/80 text-sm mt-1">Upload a CSV file to add multiple vehicles at once</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="space-y-6">
            {/* Download Template */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-[#212529] mb-1">First time importing?</h4>
                  <p className="text-sm text-[#495057] mb-3">
                    Download our CSV template to ensure your data is formatted correctly.
                  </p>
                  <button
                    onClick={downloadTemplate}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    <Download className="w-4 h-4" />
                    Download Template
                  </button>
                </div>
              </div>
            </div>

            {/* Upload Area */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
                isDragging
                  ? 'border-[#F97066] bg-[#FFF5F5]'
                  : 'border-[#DEE2E6] hover:border-[#ADB5BD]'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Upload className="w-12 h-12 text-[#ADB5BD] mx-auto mb-4" />
              <p className="text-lg font-medium text-[#212529] mb-2">
                {fileName || 'Drop your CSV file here'}
              </p>
              <p className="text-sm text-[#6C757D] mb-4">
                or click to browse
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-2 bg-[#F97066] text-white rounded-lg hover:bg-[#F85F53] transition-colors font-medium"
              >
                Select File
              </button>
            </div>

            {/* Errors */}
            {errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <div className="flex items-start gap-3 mb-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-red-900 mb-2">
                      Found {errors.length} error{errors.length !== 1 ? 's' : ''}
                    </h4>
                    <div className="space-y-1">
                      {errors.slice(0, 10).map((error, index) => (
                        <div key={index} className="text-sm text-red-800">
                          <span className="font-medium">Row {error.row}:</span> {error.message}
                        </div>
                      ))}
                      {errors.length > 10 && (
                        <div className="text-sm text-red-800 mt-2 font-medium">
                          ... and {errors.length - 10} more errors
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Preview */}
            {parsedVehicles.length > 0 && errors.length === 0 && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <div className="flex items-start gap-3 mb-4">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-green-900 mb-1">
                      Ready to import {parsedVehicles.length} vehicle{parsedVehicles.length !== 1 ? 's' : ''}
                    </h4>
                    <p className="text-sm text-green-800">
                      All data validated successfully
                    </p>
                  </div>
                </div>

                {/* Preview Table */}
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-green-200">
                        <th className="text-left py-2 px-3 font-semibold text-green-900">Rego</th>
                        <th className="text-left py-2 px-3 font-semibold text-green-900">Make</th>
                        <th className="text-left py-2 px-3 font-semibold text-green-900">Model</th>
                        <th className="text-left py-2 px-3 font-semibold text-green-900">Year</th>
                        <th className="text-left py-2 px-3 font-semibold text-green-900">Color</th>
                        <th className="text-left py-2 px-3 font-semibold text-green-900">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parsedVehicles.slice(0, 5).map((vehicle, index) => (
                        <tr key={index} className="border-b border-green-100">
                          <td className="py-2 px-3 font-mono text-green-900">{vehicle.rego}</td>
                          <td className="py-2 px-3 text-green-900">{vehicle.make}</td>
                          <td className="py-2 px-3 text-green-900">{vehicle.model}</td>
                          <td className="py-2 px-3 text-green-900">{vehicle.year}</td>
                          <td className="py-2 px-3">
                            <div className="flex items-center gap-2">
                              <span className="w-3 h-3 rounded border border-green-300" style={{ backgroundColor: vehicle.colorHex }} />
                              <span className="text-green-900">{vehicle.color}</span>
                            </div>
                          </td>
                          <td className="py-2 px-3 text-green-900 capitalize">{vehicle.status}</td>
                        </tr>
                      ))}
                      {parsedVehicles.length > 5 && (
                        <tr>
                          <td colSpan={6} className="py-2 px-3 text-center text-green-800 font-medium">
                            ... and {parsedVehicles.length - 5} more vehicles
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* CSV Format Guide */}
            <div className="bg-[#F8F9FA] border border-[#DEE2E6] rounded-xl p-6">
              <h4 className="font-semibold text-[#212529] mb-3">CSV Format Requirements</h4>
              <div className="space-y-2 text-sm text-[#495057]">
                <div className="flex items-start gap-2">
                  <span className="text-[#F97066] mt-1">•</span>
                  <div>
                    <span className="font-medium">Required columns:</span> rego, make, model, year, color, regoExpiry
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#F97066] mt-1">•</span>
                  <div>
                    <span className="font-medium">Optional columns:</span> bay, vin, odometer, fuelType, transmission, status
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#F97066] mt-1">•</span>
                  <div>
                    <span className="font-medium">Date format:</span> YYYY-MM-DD (e.g., 2026-12-31)
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#F97066] mt-1">•</span>
                  <div>
                    <span className="font-medium">Status values:</span> available, out, hold, service, cleaning
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#F97066] mt-1">•</span>
                  <div>
                    <span className="font-medium">Color names:</span> White, Black, Silver, Grey, Red, Blue, Green, Yellow
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-[#DEE2E6] px-8 py-4 bg-[#F8F9FA]">
          <div className="flex items-center justify-between">
            <button
              onClick={handleClose}
              className="px-6 py-2 text-[#6C757D] hover:text-[#495057] font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleImport}
              disabled={parsedVehicles.length === 0 || errors.length > 0}
              className="px-6 py-2 bg-[#F97066] text-white rounded-lg hover:bg-[#F85F53] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Import {parsedVehicles.length > 0 ? `${parsedVehicles.length} Vehicle${parsedVehicles.length !== 1 ? 's' : ''}` : 'Vehicles'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
