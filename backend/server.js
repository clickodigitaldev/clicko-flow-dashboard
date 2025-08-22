require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'clickoflow',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Database connected successfully');
  }
});

// Routes

// Monthly Planning Routes
app.get('/api/monthly-planning', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        mp.*,
        json_agg(
          json_build_object(
            'id', mo.id,
            'name', mo.position_name,
            'salary', mo.salary
          )
        ) FILTER (WHERE mo.id IS NOT NULL) as overhead,
        json_agg(
          json_build_object(
            'id', me.id,
            'name', me.expense_name,
            'amount', me.amount,
            'category', me.category
          )
        ) FILTER (WHERE me.id IS NOT NULL) as general_expenses
      FROM monthly_planning mp
      LEFT JOIN monthly_overhead mo ON mp.id = mo.monthly_planning_id
      LEFT JOIN monthly_expenses me ON mp.id = me.monthly_planning_id
      WHERE mp.user_id = $1
      GROUP BY mp.id
      ORDER BY mp.month_index
    `, [1]); // For now, hardcoded user_id = 1

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching monthly planning:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/monthly-planning', async (req, res) => {
  const { monthYear, monthIndex, revenue, breakEven, notes, overhead, generalExpenses } = req.body;
  
  try {
    // Start transaction
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Insert or update monthly planning
      const planningResult = await client.query(`
        INSERT INTO monthly_planning (user_id, month_year, month_index, revenue, break_even, notes)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (user_id, month_year) 
        DO UPDATE SET 
          revenue = EXCLUDED.revenue,
          break_even = EXCLUDED.break_even,
          notes = EXCLUDED.notes,
          updated_at = CURRENT_TIMESTAMP
        RETURNING id
      `, [1, monthYear, monthIndex, revenue, breakEven, notes]);
      
      const planningId = planningResult.rows[0].id;
      
      // Delete existing overhead and expenses
      await client.query('DELETE FROM monthly_overhead WHERE monthly_planning_id = $1', [planningId]);
      await client.query('DELETE FROM monthly_expenses WHERE monthly_planning_id = $1', [planningId]);
      
      // Insert overhead
      if (overhead && overhead.length > 0) {
        for (const position of overhead) {
          await client.query(`
            INSERT INTO monthly_overhead (monthly_planning_id, position_name, salary)
            VALUES ($1, $2, $3)
          `, [planningId, position.name, position.salary]);
        }
      }
      
      // Insert expenses
      if (generalExpenses && generalExpenses.length > 0) {
        for (const expense of generalExpenses) {
          await client.query(`
            INSERT INTO monthly_expenses (monthly_planning_id, expense_name, amount, category)
            VALUES ($1, $2, $3, $4)
          `, [planningId, expense.name, expense.amount, expense.category || 'General']);
        }
      }
      
      await client.query('COMMIT');
      res.json({ success: true, id: planningId });
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
    
  } catch (error) {
    console.error('Error saving monthly planning:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Projects Routes
app.get('/api/projects', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM projects 
      WHERE user_id = $1 
      ORDER BY created_at DESC
    `, [1]); // For now, hardcoded user_id = 1

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/projects', async (req, res) => {
  const {
    projectId,
    clientName,
    projectTitle,
    description,
    totalAmount,
    depositPaid,
    depositDate,
    expectedCompletion,
    status,
    priority,
    monthOfPayment,
    paymentTerms,
    clientEmail,
    clientPhone,
    projectManager,
    tags
  } = req.body;
  
  try {
    const result = await pool.query(`
      INSERT INTO projects (
        user_id, project_id, client_name, project_title, description, 
        total_amount, deposit_paid, deposit_date, expected_completion, 
        status, priority, month_of_payment, payment_terms, client_email, 
        client_phone, project_manager, tags
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      RETURNING *
    `, [
      1, projectId, clientName, projectTitle, description, totalAmount,
      depositPaid, depositDate, expectedCompletion, status, priority,
      monthOfPayment, paymentTerms, clientEmail, clientPhone, projectManager, tags
    ]);

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/projects/:id', async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  
  try {
    const fields = Object.keys(updateData).map((key, index) => `${key} = $${index + 2}`).join(', ');
    const values = Object.values(updateData);
    
    const result = await pool.query(`
      UPDATE projects 
      SET ${fields}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND user_id = $${values.length + 2}
      RETURNING *
    `, [id, ...values, 1]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/projects/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await pool.query(`
      DELETE FROM projects 
      WHERE id = $1 AND user_id = $2
      RETURNING id
    `, [id, 1]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Dashboard Summary Routes
app.get('/api/dashboard/summary', async (req, res) => {
  try {
    // Get monthly summary
    const monthlySummary = await pool.query(`
      SELECT * FROM monthly_summary 
      WHERE month_year = $1
    `, [req.query.month || 'August 2025']);

    // Get project summary
    const projectSummary = await pool.query(`
      SELECT * FROM project_summary 
      WHERE month_of_payment = $1
    `, [req.query.month || 'August 2025']);

    // Get projects for current month
    const projects = await pool.query(`
      SELECT * FROM projects 
      WHERE user_id = $1 AND month_of_payment = $2
      ORDER BY expected_completion
    `, [1, req.query.month || 'August 2025']);

    res.json({
      monthlySummary: monthlySummary.rows[0] || {},
      projectSummary: projectSummary.rows[0] || {},
      projects: projects.rows
    });
  } catch (error) {
    console.error('Error fetching dashboard summary:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
