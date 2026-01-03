import { projectId, publicAnonKey } from '../../../utils/supabase/info';
import { Car } from '../data/mockData';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-00031d07`;

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${publicAnonKey}`,
};

// ==================== VEHICLES ====================

export async function fetchVehicles(): Promise<Car[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/vehicles`, { headers });
    const data = await response.json();
    
    if (data.success) {
      return data.data;
    } else {
      console.error('Failed to fetch vehicles:', data.error);
      return [];
    }
  } catch (error) {
    console.error('Error fetching vehicles from database:', error);
    return [];
  }
}

export async function createVehicle(vehicle: Partial<Car>): Promise<Car | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/vehicles`, {
      method: 'POST',
      headers,
      body: JSON.stringify(vehicle),
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('Vehicle created successfully:', data.data);
      return data.data;
    } else {
      console.error('Failed to create vehicle:', data.error);
      return null;
    }
  } catch (error) {
    console.error('Error creating vehicle in database:', error);
    return null;
  }
}

export async function updateVehicle(id: string, updates: Partial<Car>): Promise<Car | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/vehicles/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(updates),
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('Vehicle updated successfully:', data.data);
      return data.data;
    } else {
      console.error('Failed to update vehicle:', data.error);
      return null;
    }
  } catch (error) {
    console.error('Error updating vehicle in database:', error);
    return null;
  }
}

export async function deleteVehicle(id: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/vehicles/${id}`, {
      method: 'DELETE',
      headers,
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('Vehicle deleted successfully');
      return true;
    } else {
      console.error('Failed to delete vehicle:', data.error);
      return false;
    }
  } catch (error) {
    console.error('Error deleting vehicle from database:', error);
    return false;
  }
}

// ==================== LOANS ====================

export async function fetchLoans() {
  try {
    const response = await fetch(`${API_BASE_URL}/loans`, { headers });
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching loans:', error);
    return [];
  }
}

export async function createLoan(loan: any) {
  try {
    const response = await fetch(`${API_BASE_URL}/loans`, {
      method: 'POST',
      headers,
      body: JSON.stringify(loan),
    });
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error creating loan:', error);
    return null;
  }
}

export async function updateLoan(id: string, updates: any) {
  try {
    const response = await fetch(`${API_BASE_URL}/loans/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(updates),
    });
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error updating loan:', error);
    return null;
  }
}

// ==================== CLEANING JOBS ====================

export async function fetchCleaningJobs() {
  try {
    const response = await fetch(`${API_BASE_URL}/cleaning`, { headers });
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching cleaning jobs:', error);
    return [];
  }
}

export async function createCleaningJob(job: any) {
  try {
    const response = await fetch(`${API_BASE_URL}/cleaning`, {
      method: 'POST',
      headers,
      body: JSON.stringify(job),
    });
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error creating cleaning job:', error);
    return null;
  }
}

export async function updateCleaningJob(id: string, updates: any) {
  try {
    const response = await fetch(`${API_BASE_URL}/cleaning/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(updates),
    });
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error updating cleaning job:', error);
    return null;
  }
}

export async function deleteCleaningJob(id: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/cleaning/${id}`, {
      method: 'DELETE',
      headers,
    });
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Error deleting cleaning job:', error);
    return false;
  }
}

// ==================== HOLD ITEMS ====================

export async function fetchHoldItems() {
  try {
    const response = await fetch(`${API_BASE_URL}/holds`, { headers });
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching hold items:', error);
    return [];
  }
}

export async function createHoldItem(hold: any) {
  try {
    const response = await fetch(`${API_BASE_URL}/holds`, {
      method: 'POST',
      headers,
      body: JSON.stringify(hold),
    });
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error creating hold item:', error);
    return null;
  }
}

export async function deleteHoldItem(id: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/holds/${id}`, {
      method: 'DELETE',
      headers,
    });
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Error deleting hold item:', error);
    return false;
  }
}