import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import * as db from "./database.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-00031d07/health", (c) => {
  return c.json({ status: "ok" });
});

// ==================== VEHICLE ENDPOINTS ====================

// Get all vehicles
app.get("/make-server-00031d07/vehicles", async (c) => {
  try {
    const vehicles = await db.getAllVehicles();
    return c.json({ success: true, data: vehicles });
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get single vehicle
app.get("/make-server-00031d07/vehicles/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const vehicle = await db.getVehicle(id);
    
    if (!vehicle) {
      return c.json({ success: false, error: 'Vehicle not found' }, 404);
    }
    
    return c.json({ success: true, data: vehicle });
  } catch (error) {
    console.error('Error fetching vehicle:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Create vehicle
app.post("/make-server-00031d07/vehicles", async (c) => {
  try {
    const body = await c.req.json();
    const vehicle = await db.createVehicle(body);
    return c.json({ success: true, data: vehicle }, 201);
  } catch (error) {
    console.error('Error creating vehicle:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Update vehicle
app.put("/make-server-00031d07/vehicles/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const vehicle = await db.updateVehicle(id, body);
    
    if (!vehicle) {
      return c.json({ success: false, error: 'Vehicle not found' }, 404);
    }
    
    return c.json({ success: true, data: vehicle });
  } catch (error) {
    console.error('Error updating vehicle:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Delete vehicle
app.delete("/make-server-00031d07/vehicles/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const success = await db.deleteVehicle(id);
    
    if (!success) {
      return c.json({ success: false, error: 'Vehicle not found' }, 404);
    }
    
    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting vehicle:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ==================== LOAN ENDPOINTS ====================

app.get("/make-server-00031d07/loans", async (c) => {
  try {
    const loans = await db.getAllLoans();
    return c.json({ success: true, data: loans });
  } catch (error) {
    console.error('Error fetching loans:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.post("/make-server-00031d07/loans", async (c) => {
  try {
    const body = await c.req.json();
    const loan = await db.createLoan(body);
    return c.json({ success: true, data: loan }, 201);
  } catch (error) {
    console.error('Error creating loan:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.put("/make-server-00031d07/loans/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const loan = await db.updateLoan(id, body);
    
    if (!loan) {
      return c.json({ success: false, error: 'Loan not found' }, 404);
    }
    
    return c.json({ success: true, data: loan });
  } catch (error) {
    console.error('Error updating loan:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ==================== CLEANING JOB ENDPOINTS ====================

app.get("/make-server-00031d07/cleaning", async (c) => {
  try {
    const jobs = await db.getAllCleaningJobs();
    return c.json({ success: true, data: jobs });
  } catch (error) {
    console.error('Error fetching cleaning jobs:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.post("/make-server-00031d07/cleaning", async (c) => {
  try {
    const body = await c.req.json();
    const job = await db.createCleaningJob(body);
    return c.json({ success: true, data: job }, 201);
  } catch (error) {
    console.error('Error creating cleaning job:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.put("/make-server-00031d07/cleaning/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const job = await db.updateCleaningJob(id, body);
    
    if (!job) {
      return c.json({ success: false, error: 'Cleaning job not found' }, 404);
    }
    
    return c.json({ success: true, data: job });
  } catch (error) {
    console.error('Error updating cleaning job:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.delete("/make-server-00031d07/cleaning/:id", async (c) => {
  try {
    const id = c.req.param('id');
    await db.deleteCleaningJob(id);
    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting cleaning job:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ==================== HOLD ITEM ENDPOINTS ====================

app.get("/make-server-00031d07/holds", async (c) => {
  try {
    const holds = await db.getAllHoldItems();
    return c.json({ success: true, data: holds });
  } catch (error) {
    console.error('Error fetching hold items:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.post("/make-server-00031d07/holds", async (c) => {
  try {
    const body = await c.req.json();
    const hold = await db.createHoldItem(body);
    return c.json({ success: true, data: hold }, 201);
  } catch (error) {
    console.error('Error creating hold item:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.delete("/make-server-00031d07/holds/:id", async (c) => {
  try {
    const id = c.req.param('id');
    await db.deleteHoldItem(id);
    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting hold item:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ==================== GPS TRACKING ENDPOINTS ====================

// Update location for active loan
app.post("/make-server-00031d07/tracking/update", async (c) => {
  try {
    const body = await c.req.json();
    const { loanId, location, carRego, customerName } = body;

    if (!loanId || !location) {
      return c.json({ success: false, error: 'Missing required fields' }, 400);
    }

    // Get existing tracking data
    const existingData = await kv.get(`tracking:${loanId}`);
    
    let trackingData;
    if (existingData) {
      trackingData = existingData;
      trackingData.locations.push(location);
      trackingData.lastUpdate = location.timestamp;
    } else {
      // Create new tracking record
      trackingData = {
        loanId,
        carRego,
        customerName,
        startTime: location.timestamp,
        lastUpdate: location.timestamp,
        locations: [location],
        active: true,
      };
    }

    await kv.set(`tracking:${loanId}`, trackingData);
    
    // Also maintain an active tracking index
    const activeLoanIds = await kv.get('tracking:active') || [];
    if (!activeLoanIds.includes(loanId)) {
      activeLoanIds.push(loanId);
      await kv.set('tracking:active', activeLoanIds);
    }

    return c.json({ success: true });
  } catch (error) {
    console.error('Error updating location:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// End tracking for a loan
app.post("/make-server-00031d07/tracking/end", async (c) => {
  try {
    const body = await c.req.json();
    const { loanId } = body;

    if (!loanId) {
      return c.json({ success: false, error: 'Missing loanId' }, 400);
    }

    // Mark tracking as inactive
    const trackingData = await kv.get(`tracking:${loanId}`);
    if (trackingData) {
      trackingData.active = false;
      trackingData.endTime = new Date().toISOString();
      await kv.set(`tracking:${loanId}`, trackingData);
    }

    // Remove from active index
    const activeLoanIds = await kv.get('tracking:active') || [];
    const updatedIds = activeLoanIds.filter((id: string) => id !== loanId);
    await kv.set('tracking:active', updatedIds);

    return c.json({ success: true });
  } catch (error) {
    console.error('Error ending tracking:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get all active tracked vehicles
app.get("/make-server-00031d07/tracking/active", async (c) => {
  try {
    const activeLoanIds = await kv.get('tracking:active') || [];
    const trackingData = [];

    for (const loanId of activeLoanIds) {
      const data = await kv.get(`tracking:${loanId}`);
      if (data && data.active) {
        trackingData.push(data);
      }
    }

    return c.json({ success: true, data: trackingData });
  } catch (error) {
    console.error('Error fetching active tracking:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get tracking data for a specific loan
app.get("/make-server-00031d07/tracking/:loanId", async (c) => {
  try {
    const loanId = c.req.param('loanId');
    const trackingData = await kv.get(`tracking:${loanId}`);

    if (!trackingData) {
      return c.json({ success: false, error: 'Tracking data not found' }, 404);
    }

    return c.json({ success: true, data: trackingData });
  } catch (error) {
    console.error('Error fetching tracking data:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

Deno.serve(app.fetch);