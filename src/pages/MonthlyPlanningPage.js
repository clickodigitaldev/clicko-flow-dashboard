import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Calculator, Save, ArrowLeft, ArrowRight, Plus, Trash2 } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import CurrencySwitcher from '../components/CurrencySwitcher';
import monthlyPlanningService from '../services/monthlyPlanningService';
import { defaultOverhead, defaultRevenueStreams, defaultGeneralExpenses } from '../utils/constants';
import { useCurrency } from '../contexts/CurrencyContext';

const MonthlyPlanningPage = () => {
  const { formatCurrency, convertFromBase, convertToBase, currentCurrency } = useCurrency();
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);
  const [localMonthlyData, setLocalMonthlyData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  const [isSaving, setIsSaving] = useState(false);

  // Load data from database API
  useEffect(() => {
    const loadMonthlyData = async () => {
      try {
        setIsLoading(true);
        console.log('🔍 Loading monthly data from database...');
        console.log('🔍 Default data available:', { defaultOverhead, defaultRevenueStreams, defaultGeneralExpenses });
        
        // Try to get data from database first
        const dbData = await monthlyPlanningService.getAllMonthlyPlanning();
        console.log('🔍 Database data:', dbData);
        
        if (dbData && dbData.length > 0) {
          // Convert database data to local format - use actual database structure
          const convertedData = dbData.map((month, index) => {
            return {
              id: month._id || index,
              month: month.month,
              revenue: month.revenue || 0,
              // Use the actual database structure with proper ID generation
              revenueStreams: (month.revenueStreams || []).map((stream, i) => ({
                id: stream._id || `stream-${index}-${i}`,
                name: stream.name || '',
                amount: stream.amount || 0
              })),
              overhead: (month.overhead || []).map((team, i) => ({
                id: team._id || `team-${index}-${i}`,
                name: team.name || '',
                salary: team.salary || 0,
                team: team.team || 'service' // Default to service team if no team assigned
              })),
              generalExpenses: (month.generalExpenses || []).map((expense, i) => ({
                id: expense._id || `expense-${index}-${i}`,
                name: expense.name || '',
                amount: expense.amount || 0
              })),
              notes: month.notes || ''
            };
          });
          setLocalMonthlyData(convertedData);
          console.log('✅ Loaded data from database:', convertedData);
        } else {
          console.log('⚠️ No database data, initializing with default data...');
          // Initialize with default data if no database data exists
          const initialData = [];
          for (let i = 0; i < 6; i++) { // Reduced to 6 months for testing
            const month = new Date();
            month.setMonth(month.getMonth() + i);
            const monthName = month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
            
            const monthData = {
              id: i,
              month: monthName,
              revenue: 200000 + (i * 30000),
              revenueStreams: defaultRevenueStreams.map(stream => ({
                ...stream,
                amount: stream.amount + (i * 2000)
              })),
              overhead: defaultOverhead.map(item => ({ ...item })),
              generalExpenses: defaultGeneralExpenses.map(expense => ({
                ...expense,
                amount: expense.amount + (i * 500)
              })),
              notes: `📊 ${monthName} Financial Planning & Goals

🎯 How to Achieve Monthly Goals:
• Increase Product & Service revenue by 20% through better client acquisition
• Expand Ecommerce platform capabilities and market reach
• Optimize team productivity across Product, Service, and Management teams
• Strengthen client relationships through regular communication
• Implement data-driven decision making for better resource allocation

✅ What Went Well This Month:
• Successfully delivered ${i + 3} major projects on time
• Maintained high client satisfaction scores (4.8/5.0)
• Product Team achieved 95% project completion rate
• Service Team maintained 90% client retention rate
• Management Team optimized operational efficiency by 15%

🔧 What Could Be Improved:
• Reduce project delivery time by implementing agile methodologies
• Increase profit margins by 8% through better cost management
• Enhance cross-team collaboration between Product, Service, and Management
• Strengthen sales pipeline with better lead qualification process
• Implement automated reporting for better decision making

📈 Key Performance Indicators:
• Revenue Growth Target: ${200000 + (i * 30000)} (${((200000 + (i * 30000)) / 200000 * 100 - 100).toFixed(1)}% increase)
• Product & Service Revenue: ${120000 + (i * 5000)} (${((120000 + (i * 5000)) / 120000 * 100 - 100).toFixed(1)}% increase)
• Ecommerce Revenue: ${80000 + (i * 3000)} (${((80000 + (i * 3000)) / 80000 * 100 - 100).toFixed(1)}% increase)
• Team Productivity: 85%+ utilization rate across all teams
• Client Retention Rate: 95%+`
            };
            
            console.log(`📅 Created month data for ${monthName}:`, monthData);
            initialData.push(monthData);
          }
          console.log('✅ All initial data created:', initialData);
          setLocalMonthlyData(initialData);
        }
      } catch (error) {
        console.error('❌ Error loading monthly data:', error);
        // Fallback to localStorage if API fails
        const savedData = localStorage.getItem('clickoFlowMonthlyData');
        if (savedData) {
          try {
            const parsedData = JSON.parse(savedData);
            // Ensure the data has the correct structure
            const updatedData = parsedData.map(month => {
              return {
                ...month,
                revenueStreams: (month.revenueStreams || []).map((stream, i) => ({
                  id: stream.id || `stream-${i}`,
                  name: stream.name || '',
                  amount: stream.amount || 0
                })),
                overhead: (month.overhead || []).map((team, i) => ({
                  id: team.id || `team-${i}`,
                  name: team.name || '',
                  salary: team.salary || 0,
                  team: team.team || 'service' // Default to service team if no team assigned
                })),
                generalExpenses: (month.generalExpenses || []).map((expense, i) => ({
                  id: expense.id || `expense-${i}`,
                  name: expense.name || '',
                  amount: expense.amount || 0
                }))
              };
            });
            setLocalMonthlyData(updatedData);
            console.log('✅ Loaded data from localStorage:', updatedData);
          } catch (error) {
            console.error('❌ Error parsing localStorage data:', error);
            // Initialize with default data if localStorage fails
            initializeForecastingData();
          }
        } else {
          // Initialize with default data
          console.log('🔄 Fallback: Initializing with default data...');
          const initialData = [];
          for (let i = 0; i < 6; i++) {
            const month = new Date();
            month.setMonth(month.getMonth() + i);
            const monthName = month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
            
            initialData.push({
              id: i,
              month: monthName,
              revenue: 200000 + (i * 30000),
              revenueStreams: defaultRevenueStreams.map(stream => ({
                ...stream,
                amount: stream.amount + (i * 2000)
              })),
              overhead: defaultOverhead.map(item => ({ ...item })),
              generalExpenses: defaultGeneralExpenses.map(expense => ({
                ...expense,
                amount: expense.amount + (i * 500)
              })),
              notes: `📊 ${monthName} Financial Planning & Goals

🎯 How to Achieve Monthly Goals:
• Increase Product & Service revenue by 20% through better client acquisition
• Expand Ecommerce platform capabilities and market reach
• Optimize team productivity across Product, Service, and Management teams
• Strengthen client relationships through regular communication
• Implement data-driven decision making for better resource allocation

✅ What Went Well This Month:
• Successfully delivered ${i + 3} major projects on time
• Maintained high client satisfaction scores (4.8/5.0)
• Product Team achieved 95% project completion rate
• Service Team maintained 90% client retention rate
• Management Team optimized operational efficiency by 15%

🔧 What Could Be Improved:
• Reduce project delivery time by implementing agile methodologies
• Increase profit margins by 8% through better cost management
• Enhance cross-team collaboration between Product, Service, and Management
• Strengthen sales pipeline with better lead qualification process
• Implement automated reporting for better decision making

📈 Key Performance Indicators:
• Revenue Growth Target: ${200000 + (i * 30000)} (${((200000 + (i * 30000)) / 200000 * 100 - 100).toFixed(1)}% increase)
• Product & Service Revenue: ${120000 + (i * 5000)} (${((120000 + (i * 5000)) / 120000 * 100 - 100).toFixed(1)}% increase)
• Ecommerce Revenue: ${80000 + (i * 3000)} (${((80000 + (i * 3000)) / 80000 * 100 - 100).toFixed(1)}% increase)
• Team Productivity: 85%+ utilization rate across all teams
• Client Retention Rate: 95%+`
            });
          }
          setLocalMonthlyData(initialData);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadMonthlyData();
  }, []);

  const updateMonthData = (monthIndex, field, value) => {
    setLocalMonthlyData(prev => 
      prev.map((month, index) => 
        index === monthIndex ? { ...month, [field]: value } : month
      )
    );
  };

  const addRevenueStream = (monthIndex) => {
    console.log('➕ Adding revenue stream for month index:', monthIndex);
    setLocalMonthlyData(prev => {
      const newData = prev.map((month, index) => {
        if (index === monthIndex) {
          const existingStreams = month.revenueStreams || [];
          // Generate a unique ID using timestamp and random number
          const newId = `new-stream-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          const newStream = { id: newId, name: '', amount: 0 };
          console.log('➕ New revenue stream:', newStream);
          return {
            ...month,
            revenueStreams: [...existingStreams, newStream]
          };
        }
        return month;
      });
      console.log('✅ Updated local data with new revenue stream:', newData);
      return newData;
    });
  };

  const removeRevenueStream = (monthIndex, streamId) => {
    setLocalMonthlyData(prev => 
      prev.map((month, index) => {
        if (index === monthIndex) {
          return {
            ...month,
            revenueStreams: month.revenueStreams.filter(stream => stream.id !== streamId)
          };
        }
        return month;
      })
    );
  };

  const updateRevenueStream = (monthIndex, streamId, field, value) => {
    console.log('🔄 Updating revenue stream:', { monthIndex, streamId, field, value });
    setLocalMonthlyData(prev => 
      prev.map((month, index) => {
        if (index === monthIndex) {
          const updatedStreams = month.revenueStreams.map(stream => 
            stream.id === streamId ? { ...stream, [field]: value } : stream
          );
          console.log('✅ Updated revenue streams:', updatedStreams);
          return {
            ...month,
            revenueStreams: updatedStreams
          };
        }
        return month;
      })
    );
  };

  const addOverheadPosition = (monthIndex, team) => {
    console.log('➕ Adding overhead position for month index:', monthIndex, 'and team:', team);
    setLocalMonthlyData(prev => {
      const newData = prev.map((month, index) => {
        if (index === monthIndex) {
          const existingOverhead = month.overhead || [];
          // Generate a unique ID using timestamp and random number
          const newId = `new-overhead-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          const newPosition = { id: newId, name: '', salary: 0, team: team };
          console.log('➕ New overhead position:', newPosition);
          return {
            ...month,
            overhead: [...existingOverhead, newPosition]
          };
        }
        return month;
      });
      console.log('✅ Updated local data with new overhead position:', newData);
      return newData;
    });
  };

  const removeOverheadPosition = (monthIndex, positionId) => {
    setLocalMonthlyData(prev => 
      prev.map((month, index) => {
        if (index === monthIndex) {
          return {
            ...month,
            overhead: month.overhead.filter(position => position.id !== positionId)
          };
        }
        return month;
      })
    );
  };

  const updateOverheadPosition = (monthIndex, positionId, field, value) => {
    console.log('🔄 Updating overhead position:', { monthIndex, positionId, field, value });
    setLocalMonthlyData(prev => 
      prev.map((month, index) => {
        if (index === monthIndex) {
          const updatedOverhead = month.overhead.map(position => 
            position.id === positionId ? { ...position, [field]: value } : position
          );
          console.log('✅ Updated overhead:', updatedOverhead);
          return {
            ...month,
            overhead: updatedOverhead
          };
        }
        return month;
      })
    );
  };

  const addGeneralExpense = (monthIndex) => {
    console.log('➕ Adding general expense for month index:', monthIndex);
    setLocalMonthlyData(prev => {
      const newData = prev.map((month, index) => {
        if (index === monthIndex) {
          const existingExpenses = month.generalExpenses || [];
          // Generate a unique ID using timestamp and random number
          const newId = `new-expense-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          const newExpense = { id: newId, name: '', amount: 0 };
          console.log('➕ New general expense:', newExpense);
          return {
            ...month,
            generalExpenses: [...existingExpenses, newExpense]
          };
        }
        return month;
      });
      console.log('✅ Updated local data with new general expense:', newData);
      return newData;
    });
  };

  const removeGeneralExpense = (monthIndex, expenseId) => {
    setLocalMonthlyData(prev => 
      prev.map((month, index) => {
        if (index === monthIndex) {
          return {
            ...month,
            generalExpenses: month.generalExpenses.filter(expense => expense.id !== expenseId)
          };
        }
        return month;
      })
    );
  };

  const updateGeneralExpense = (monthIndex, expenseId, field, value) => {
    console.log('🔄 Updating general expense:', { monthIndex, expenseId, field, value });
    setLocalMonthlyData(prev => 
      prev.map((month, index) => {
        if (index === monthIndex) {
          const updatedExpenses = month.generalExpenses.map(expense => 
            expense.id === expenseId ? { ...expense, [field]: value } : expense
          );
          console.log('✅ Updated general expenses:', updatedExpenses);
          return {
            ...month,
            generalExpenses: updatedExpenses
          };
        }
        return month;
      })
    );
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 3000);
  };

  const initializeForecastingData = () => {
    console.log('🔄 Initializing forecasting data...');
    
    const months = [
      'August 2025', 'September 2025', 'October 2025', 'November 2025', 
      'December 2025', 'January 2026', 'February 2026', 'March 2026',
      'April 2026', 'May 2026', 'June 2026', 'July 2026'
    ];
    
    // Default data following the actual database structure
    const defaultRevenueStreams = [
      { id: 1, name: 'Web Development', amount: 50000 },
      { id: 2, name: 'Mobile App Development', amount: 40000 },
      { id: 3, name: 'Consulting Services', amount: 30000 },
      { id: 4, name: 'E-commerce Solutions', amount: 35000 },
      { id: 5, name: 'Digital Marketing', amount: 25000 }
    ];

    const defaultOverhead = [
      // Service Team
      { id: 1, name: 'Senior Developer', salary: 8000, team: 'service' },
      { id: 2, name: 'Frontend Developer', salary: 7000, team: 'service' },
      { id: 3, name: 'Backend Developer', salary: 7500, team: 'service' },
      { id: 4, name: 'DevOps Engineer', salary: 8500, team: 'service' },
      // Product Team
      { id: 5, name: 'Product Manager', salary: 10000, team: 'product' },
      { id: 6, name: 'UI/UX Designer', salary: 7500, team: 'product' },
      { id: 7, name: 'Business Analyst', salary: 9000, team: 'product' },
      { id: 8, name: 'QA Engineer', salary: 7000, team: 'product' },
      // Management Team
      { id: 9, name: 'Project Manager', salary: 10000, team: 'management' },
      { id: 10, name: 'Team Lead', salary: 9500, team: 'management' },
      { id: 11, name: 'Operations Manager', salary: 11000, team: 'management' }
    ];

    const defaultGeneralExpenses = [
      { id: 1, name: 'Office Rent', amount: 8000 },
      { id: 2, name: 'Utilities', amount: 2000 },
      { id: 3, name: 'Software Licenses', amount: 3000 },
      { id: 4, name: 'Marketing', amount: 5000 }
    ];
    
    const initialData = months.map((monthName, i) => {
      const monthData = {
        id: i,
        month: monthName,
        revenue: 200000 + (i * 30000),
        revenueStreams: defaultRevenueStreams.map(stream => ({
          ...stream,
          amount: stream.amount + (i * 2000)
        })),
        overhead: defaultOverhead,
        generalExpenses: defaultGeneralExpenses.map(expense => ({
          ...expense,
          amount: expense.amount + (i * 500)
        })),
        notes: `📊 ${monthName} Financial Planning & Goals

🎯 How to Achieve Monthly Goals:
• Increase revenue streams through diversified service offerings
• Optimize team productivity and resource allocation
• Strengthen client relationships and retention
• Implement data-driven decision making
• Focus on profitable service lines

✅ What Went Well This Month:
• Successfully delivered ${i + 3} major projects on time
• Maintained high client satisfaction scores (4.8/5.0)
• Team achieved 95% project completion rate
• Optimized operational efficiency by 15%

🔧 What Could Be Improved:
• Reduce project delivery time by implementing agile methodologies
• Increase profit margins by 8% through better cost management
• Enhance team collaboration and communication
• Strengthen sales pipeline with better lead qualification
• Implement automated reporting for better insights

📈 Key Performance Indicators:
• Revenue Growth Target: $${(200000 + (i * 30000)).toLocaleString()}
• Team Productivity: 85%+ utilization rate
• Client Retention Rate: 95%+
• Profit Margin: 15%+ target`
      };
      
      return monthData;
    });
    
    setLocalMonthlyData(initialData);
    localStorage.setItem('clickoFlowMonthlyData', JSON.stringify(initialData));
    console.log('✅ Initialized forecasting data:', initialData);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      console.log('💾 Saving all monthly data to database...');
      console.log('💾 Local data to save:', localMonthlyData);
      
      // Save all months to database
      const savePromises = localMonthlyData.map(async (monthData) => {
        try {
          // Convert new structure to backend-expected format
          const dataToSave = {
            month: monthData.month,
            revenue: monthData.revenue || 0,
            // Use the actual database structure
            revenueStreams: monthData.revenueStreams || [],
            overhead: monthData.overhead || [],
            generalExpenses: monthData.generalExpenses || [],
            notes: monthData.notes || ''
          };
          
          console.log(`💾 Saving ${monthData.month}:`, dataToSave);
          const savedData = await monthlyPlanningService.saveMonthlyPlanning(dataToSave);
          console.log(`✅ Saved ${monthData.month} to database:`, savedData);
          return savedData;
        } catch (error) {
          console.error(`❌ Error saving ${monthData.month}:`, error);
          // Continue with other months even if one fails
          return null;
        }
      });

      const savedResults = await Promise.all(savePromises);
      const successfulSaves = savedResults.filter(result => result !== null);
      console.log('✅ Successfully saved months to database:', successfulSaves);
      
      // Update local data with database IDs
      setLocalMonthlyData(prev => 
        prev.map((month, index) => ({
          ...month,
          id: savedResults[index]?._id || month.id
        }))
      );
      
      // Also save to localStorage as backup
      localStorage.setItem('clickoFlowMonthlyData', JSON.stringify(localMonthlyData));
      
      if (successfulSaves.length === localMonthlyData.length) {
        showNotification('All monthly forecasting data saved successfully to database!', 'success');
      } else {
        showNotification(`Saved ${successfulSaves.length}/${localMonthlyData.length} months to database. Some months failed to save.`, 'warning');
      }
    } catch (error) {
      console.error('❌ Error saving all data to database:', error);
      showNotification(`Failed to save data to database: ${error.message}`, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const saveCurrentMonth = async () => {
    try {
      setIsSaving(true);
      const currentMonth = localMonthlyData[currentMonthIndex];
      
      if (!currentMonth) {
        throw new Error('No current month data to save');
      }

      console.log('💾 Saving current month to database:', currentMonth);
      
      // Prepare data for database - convert new structure to backend format
      const monthData = {
        month: currentMonth.month,
        revenue: currentMonth.revenue || 0,
        // Use the actual database structure
        revenueStreams: currentMonth.revenueStreams || [],
        overhead: currentMonth.overhead || [],
        generalExpenses: currentMonth.generalExpenses || [],
        notes: currentMonth.notes || ''
      };

      console.log('💾 Data to save:', monthData);

      // Save to database
      const savedData = await monthlyPlanningService.saveMonthlyPlanning(monthData);
      console.log('✅ Saved to database:', savedData);

      // Update local data with database response
      setLocalMonthlyData(prev => 
        prev.map((month, index) => 
          index === currentMonthIndex 
            ? { ...month, id: savedData._id || month.id }
            : month
        )
      );

      // Also save to localStorage as backup
      localStorage.setItem('clickoFlowMonthlyData', JSON.stringify(localMonthlyData));

      showNotification('Monthly planning saved successfully to database!', 'success');

    } catch (error) {
      console.error('❌ Error saving to database:', error);
      showNotification(`Error saving to database: ${error.message}`, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const currentMonth = localMonthlyData[currentMonthIndex];
  
  // Debug logging
  console.log('🔍 Current month data:', currentMonth);
  console.log('🔍 Current month index:', currentMonthIndex);
  console.log('🔍 Local monthly data length:', localMonthlyData.length);
  
  // Debug the data structure
  if (currentMonth) {
    console.log('🔍 Revenue Streams:', currentMonth.revenueStreams);
    console.log('🔍 Overhead:', currentMonth.overhead);
    console.log('🔍 General Expenses:', currentMonth.generalExpenses);
  }
  
  const totalRevenue = currentMonth?.revenueStreams?.reduce((sum, stream) => sum + (stream.amount || 0), 0) || 0;
  const totalOverhead = currentMonth?.overhead?.reduce((sum, item) => sum + (item.salary || 0), 0) || 0;
  const totalGeneralExpenses = currentMonth?.generalExpenses?.reduce((sum, item) => sum + (item.amount || 0), 0) || 0;
  const totalExpenses = totalOverhead + totalGeneralExpenses;
  const profit = totalRevenue - totalExpenses;
  
  // Convert values to current currency for display
  const totalRevenueInCurrentCurrency = convertFromBase(totalRevenue);
  const totalOverheadInCurrentCurrency = convertFromBase(totalOverhead);
  const totalGeneralExpensesInCurrentCurrency = convertFromBase(totalGeneralExpenses);
  const totalExpensesInCurrentCurrency = convertFromBase(totalExpenses);
  const profitInCurrentCurrency = convertFromBase(profit);

  if (isLoading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-primary text-xl">Loading Monthly Forecasting...</div>
      </div>
    );
  }

  // Check if data exists, if not show initialization message
  if (!localMonthlyData || localMonthlyData.length === 0) {
    return (
      <div className="min-h-screen gradient-bg">
        <Sidebar />
        <div className="ml-64 p-6">
          <div className="enhanced-card p-8 text-center">
            <h2 className="text-2xl font-bold text-primary mb-4">No Forecasting Data Found</h2>
            <p className="text-secondary mb-6">Click the button below to initialize your monthly forecasting data.</p>
            <button
              onClick={initializeForecastingData}
              className="modern-button flex items-center mx-auto"
            >
              <Calculator className="w-4 h-4 mr-2" />
              Initialize Forecasting Data
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Check if current month exists
  if (!currentMonth) {
    return (
      <div className="min-h-screen gradient-bg">
        <Sidebar />
        <div className="ml-64 p-6">
          <div className="enhanced-card p-8 text-center">
            <h2 className="text-2xl font-bold text-primary mb-4">Month Data Not Found</h2>
            <p className="text-secondary mb-6">The selected month data is not available. Please try another month or reinitialize the data.</p>
            <button
              onClick={initializeForecastingData}
              className="modern-button flex items-center mx-auto"
            >
              <Calculator className="w-4 h-4 mr-2" />
              Reinitialize Data
            </button>
          </div>
        </div>
      </div>
    );
  }

  const getTeamTotal = (monthIndex, team) => {
    const monthData = localMonthlyData[monthIndex];
    if (!monthData) return 0;
    const totalInBase = monthData.overhead
      .filter(position => position.team === team)
      .reduce((sum, position) => sum + (position.salary || 0), 0);
    return convertFromBase(totalInBase);
  };

  return (
    <div className="min-h-screen gradient-bg">
      <Sidebar />
      
      {/* Main Content */}
      <div className="ml-64">
        {/* Header */}
        <header className="modern-header sticky top-0 z-40">
          <div className="px-6 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-primary">Monthly Forecasting</h1>
                <p className="text-sm text-secondary">Plan your finances month by month</p>
              </div>
              <div className="flex items-center space-x-4">
                <CurrencySwitcher />
                <button
                  onClick={initializeForecastingData}
                  className="modern-button-secondary flex items-center"
                >
                  <Calculator className="w-4 h-4 mr-2" />
                  Initialize Data
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="modern-button flex items-center disabled:opacity-50"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save Data'}
                </button>
                <button
                  onClick={saveCurrentMonth}
                  disabled={isSaving}
                  className="modern-button-secondary flex items-center disabled:opacity-50"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save Current Month'}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          {/* Month Navigation */}
          <div className="flex items-center justify-between enhanced-card p-4 mb-6">
            <button
              onClick={() => setCurrentMonthIndex(Math.max(0, currentMonthIndex - 1))}
              disabled={currentMonthIndex === 0}
              className="flex items-center modern-button-secondary disabled:opacity-50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous Month
            </button>
            <div className="text-center">
              <h3 className="text-xl font-bold text-primary mb-2">{currentMonth?.month || 'Loading...'}</h3>
              <select
                value={currentMonthIndex}
                onChange={(e) => setCurrentMonthIndex(parseInt(e.target.value))}
                className="modern-select text-sm"
              >
                {localMonthlyData.map((month, index) => (
                  <option key={index} value={index}>
                    {month.month}
                  </option>
                ))}
              </select>
              <p className="text-sm text-secondary mt-1">
                {currentMonth?.month ? `Month ${currentMonthIndex + 1} of ${localMonthlyData.length}` : 'Loading months...'}
              </p>
            </div>
            <button
              onClick={() => setCurrentMonthIndex(Math.min(localMonthlyData.length - 1, currentMonthIndex + 1))}
              disabled={currentMonthIndex === localMonthlyData.length - 1}
              className="flex items-center modern-button-secondary disabled:opacity-50"
            >
              Next Month
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>

          {/* Quick Month Navigation and Save Button */}
          <div className="enhanced-card p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-secondary">Quick Jump to Month:</h4>
              <button
                onClick={() => saveCurrentMonth()}
                className="modern-button bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
              >
                💾 Save Current Month
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {localMonthlyData.slice(0, 6).map((month, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentMonthIndex(index)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    currentMonthIndex === index
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'bg-white bg-opacity-10 text-primary hover:bg-opacity-20 hover:shadow-md'
                  }`}
                >
                  {month.month.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Sticky Widgets */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6 sticky top-20 z-30">
            <div className="glass-card p-4 glass-card-hover">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-secondary">Expected Revenue</p>
                  <p className="text-2xl font-bold text-primary">{formatCurrency(totalRevenueInCurrentCurrency)}</p>
                </div>
                <div className="icon-container">
                  <DollarSign className="w-5 h-5 text-green-400" />
                </div>
              </div>
            </div>
            
            <div className="glass-card p-4 glass-card-hover">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-secondary">Team Costs</p>
                  <p className="text-2xl font-bold text-primary">{formatCurrency(totalOverheadInCurrentCurrency)}</p>
                </div>
                <div className="icon-container">
                  <TrendingUp className="w-5 h-5 text-blue-400" />
                </div>
              </div>
            </div>
            
            <div className="glass-card p-4 glass-card-hover">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-secondary">General Expenses</p>
                  <p className="text-2xl font-bold text-primary">{formatCurrency(totalGeneralExpensesInCurrentCurrency)}</p>
                </div>
                <div className="icon-container">
                  <TrendingDown className="w-5 h-5 text-orange-400" />
                </div>
              </div>
            </div>
            
            <div className="glass-card p-4 glass-card-hover">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-secondary">Total Expenses</p>
                  <p className="text-2xl font-bold text-primary">{formatCurrency(totalExpensesInCurrentCurrency)}</p>
                </div>
                <div className="icon-container">
                  <Calculator className="w-5 h-5 text-red-400" />
                </div>
              </div>
            </div>
            
            <div className="glass-card p-4 glass-card-hover">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-secondary">Profit</p>
                  <p className={`text-2xl font-bold ${profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {formatCurrency(profitInCurrentCurrency)}
                  </p>
                </div>
                <div className="icon-container">
                  <DollarSign className="w-5 h-5 text-green-400" />
                </div>
              </div>
            </div>
          </div>

          {/* First Row: Revenue Streams and Notes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Streams */}
            <div className="enhanced-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-primary flex items-center">
                  <DollarSign className="w-5 h-5 mr-2 text-blue-400" />
                  Revenue Streams
                </h3>
                <button
                  onClick={() => addRevenueStream(currentMonthIndex)}
                  className="modern-button flex items-center text-sm"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Revenue
                </button>
              </div>
              <div className="space-y-3">
                {currentMonth?.revenueStreams?.map((stream) => (
                  <div key={`${currentMonthIndex}-revenue-${stream.id}`} className="flex items-center space-x-3 p-3 glass-card">
                    <input
                      type="text"
                      value={stream?.name || ''}
                      onChange={(e) => updateRevenueStream(currentMonthIndex, stream.id, 'name', e.target.value)}
                      className="flex-1 modern-input"
                      placeholder="Revenue stream name"
                    />
                    <div className="relative">
                      <input
                        type="number"
                        value={convertFromBase(stream?.amount || 0).toFixed(2)}
                        onChange={(e) => {
                          const newAmount = parseFloat(e.target.value) || 0;
                          // Convert from current currency to base currency before saving
                          const amountInBase = convertToBase(newAmount);
                          updateRevenueStream(currentMonthIndex, stream.id, 'amount', amountInBase);
                        }}
                        className="w-32 modern-input pr-8"
                        placeholder="Amount"
                      />
                      <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-secondary">
                        {currentCurrency}
                      </span>
                    </div>
                    <button
                      onClick={() => removeRevenueStream(currentMonthIndex, stream.id)}
                      className="action-button text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes Section */}
            <div className="enhanced-card p-6">
              <h3 className="text-lg font-semibold text-primary mb-4 flex items-center">
                <Calculator className="w-5 h-4 mr-2 text-purple-400" />
                Monthly Notes & Planning
              </h3>
              <textarea
                value={currentMonth?.notes || ''}
                onChange={(e) => updateMonthData(currentMonthIndex, 'notes', e.target.value)}
                className="w-full h-48 modern-input resize-none"
                placeholder="📊 Add your monthly planning notes, goals, achievements, and improvement areas..."
              />
              <div className="mt-3 text-sm text-secondary">
                <p>💡 Use this space to track your goals, achievements, and areas for improvement each month.</p>
              </div>
            </div>
          </div>

          {/* Second Row: Overhead Teams and General Expenses */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Overhead Teams */}
            <div className="enhanced-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-primary flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
                  Team Overhead
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => addOverheadPosition(currentMonthIndex, 'service')}
                    className="modern-button flex items-center text-xs bg-blue-500 hover:bg-blue-600"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Service
                  </button>
                  <button
                    onClick={() => addOverheadPosition(currentMonthIndex, 'product')}
                    className="modern-button flex items-center text-xs bg-purple-500 hover:bg-purple-600"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Product
                  </button>
                  <button
                    onClick={() => addOverheadPosition(currentMonthIndex, 'management')}
                    className="modern-button flex items-center text-xs bg-green-500 hover:bg-green-600"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Management
                  </button>
                </div>
              </div>

              {/* Service Team */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-md font-medium text-blue-400 flex items-center">
                    <div className="w-3 h-3 bg-blue-400 rounded-full mr-2"></div>
                    Service Team
                  </h4>
                  <span className="text-sm text-secondary">
                    Total: {formatCurrency(getTeamTotal(currentMonthIndex, 'service'))}
                  </span>
                </div>
                <div className="space-y-2">
                  {currentMonth?.overhead?.filter(position => position.team === 'service').map((position) => (
                    <div key={`${currentMonthIndex}-overhead-${position.id}`} className="flex items-center space-x-3 p-3 glass-card border-l-4 border-blue-400">
                      <input
                        type="text"
                        value={position?.name || ''}
                        onChange={(e) => updateOverheadPosition(currentMonthIndex, position.id, 'name', e.target.value)}
                        className="flex-1 modern-input"
                        placeholder="Position name"
                      />
                      <div className="relative">
                        <input
                          type="number"
                          value={convertFromBase(position?.salary || 0).toFixed(2)}
                          onChange={(e) => {
                            const newSalary = parseFloat(e.target.value) || 0;
                            // Convert from current currency to base currency before saving
                            const salaryInBase = convertToBase(newSalary);
                            updateOverheadPosition(currentMonthIndex, position.id, 'salary', salaryInBase);
                          }}
                          className="modern-input w-32 pr-8"
                          placeholder="Salary"
                        />
                        <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-secondary">
                          {currentCurrency}
                        </span>
                      </div>
                      <button
                        onClick={() => removeOverheadPosition(currentMonthIndex, position.id)}
                        className="action-button text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {(!currentMonth?.overhead?.filter(position => position.team === 'service').length || 
                    currentMonth?.overhead?.filter(position => position.team === 'service').length === 0) && (
                    <div className="text-center py-4 text-secondary text-sm border-2 border-dashed border-gray-600 rounded-lg">
                      No Service Team positions added yet
                    </div>
                  )}
                </div>
              </div>

              {/* Product Team */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-md font-medium text-purple-400 flex items-center">
                    <div className="w-3 h-3 bg-purple-400 rounded-full mr-2"></div>
                    Product Team
                  </h4>
                  <span className="text-sm text-secondary">
                    Total: {formatCurrency(getTeamTotal(currentMonthIndex, 'product'))}
                  </span>
                </div>
                <div className="space-y-2">
                  {currentMonth?.overhead?.filter(position => position.team === 'product').map((position) => (
                    <div key={`${currentMonthIndex}-overhead-${position.id}`} className="flex items-center space-x-3 p-3 glass-card border-l-4 border-purple-400">
                      <input
                        type="text"
                        value={position?.name || ''}
                        onChange={(e) => updateOverheadPosition(currentMonthIndex, position.id, 'name', e.target.value)}
                        className="flex-1 modern-input"
                        placeholder="Position name"
                      />
                      <div className="relative">
                        <input
                          type="number"
                          value={convertFromBase(position?.salary || 0).toFixed(2)}
                          onChange={(e) => {
                            const newSalary = parseFloat(e.target.value) || 0;
                            // Convert from current currency to base currency before saving
                            const salaryInBase = convertToBase(newSalary);
                            updateOverheadPosition(currentMonthIndex, position.id, 'salary', salaryInBase);
                          }}
                          className="modern-input w-32 pr-8"
                          placeholder="Salary"
                        />
                        <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-secondary">
                          {currentCurrency}
                        </span>
                      </div>
                      <button
                        onClick={() => removeOverheadPosition(currentMonthIndex, position.id)}
                        className="action-button text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {(!currentMonth?.overhead?.filter(position => position.team === 'product').length || 
                    currentMonth?.overhead?.filter(position => position.team === 'product').length === 0) && (
                    <div className="text-center py-4 text-secondary text-sm border-2 border-dashed border-gray-600 rounded-lg">
                      No Product Team positions added yet
                    </div>
                  )}
                </div>
              </div>

              {/* Management Team */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-md font-medium text-green-400 flex items-center">
                    <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
                    Management Team
                  </h4>
                  <span className="text-sm text-secondary">
                    Total: {formatCurrency(getTeamTotal(currentMonthIndex, 'management'))}
                  </span>
                </div>
                <div className="space-y-2">
                  {currentMonth?.overhead?.filter(position => position.team === 'management').map((position) => (
                    <div key={`${currentMonthIndex}-overhead-${position.id}`} className="flex items-center space-x-3 p-3 glass-card border-l-4 border-green-400">
                      <input
                        type="text"
                        value={position?.name || ''}
                        onChange={(e) => updateOverheadPosition(currentMonthIndex, position.id, 'name', e.target.value)}
                        className="flex-1 modern-input"
                        placeholder="Position name"
                      />
                      <div className="relative">
                        <input
                          type="number"
                          value={convertFromBase(position?.salary || 0).toFixed(2)}
                          onChange={(e) => {
                            const newSalary = parseFloat(e.target.value) || 0;
                            // Convert from current currency to base currency before saving
                            const salaryInBase = convertToBase(newSalary);
                            updateOverheadPosition(currentMonthIndex, position.id, 'salary', salaryInBase);
                          }}
                          className="modern-input w-32 pr-8"
                          placeholder="Salary"
                        />
                        <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-secondary">
                          {currentCurrency}
                        </span>
                      </div>
                      <button
                        onClick={() => removeOverheadPosition(currentMonthIndex, position.id)}
                        className="action-button text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {(!currentMonth?.overhead?.filter(position => position.team === 'management').length || 
                    currentMonth?.overhead?.filter(position => position.team === 'management').length === 0) && (
                    <div className="text-center py-4 text-secondary text-sm border-2 border-dashed border-gray-600 rounded-lg">
                      No Management Team positions added yet
                    </div>
                  )}
                </div>
              </div>

              {/* Team Summary */}
              <div className="mt-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
                <h5 className="text-sm font-medium text-white mb-3">Team Summary</h5>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-blue-400 font-semibold">{formatCurrency(getTeamTotal(currentMonthIndex, 'service'))}</div>
                    <div className="text-secondary text-xs">Service Team</div>
                  </div>
                  <div className="text-center">
                    <div className="text-purple-400 font-semibold">{formatCurrency(getTeamTotal(currentMonthIndex, 'product'))}</div>
                    <div className="text-secondary text-xs">Product Team</div>
                  </div>
                  <div className="text-center">
                    <div className="text-green-400 font-semibold">{formatCurrency(getTeamTotal(currentMonthIndex, 'management'))}</div>
                    <div className="text-secondary text-xs">Management Team</div>
                  </div>
                </div>
              </div>
            </div>

            {/* General Expenses */}
            <div className="enhanced-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-primary flex items-center">
                  <TrendingDown className="w-5 h-5 mr-2 text-orange-400" />
                  General Expenses
                </h3>
                <button
                  onClick={() => addGeneralExpense(currentMonthIndex)}
                  className="modern-button flex items-center text-sm"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Expense
                </button>
              </div>
              <div className="space-y-3">
                {currentMonth?.generalExpenses?.map((expense) => (
                  <div key={`${currentMonthIndex}-expense-${expense.id}`} className="flex items-center space-x-3 p-3 glass-card">
                    <input
                      type="text"
                      value={expense?.name || ''}
                      onChange={(e) => updateGeneralExpense(currentMonthIndex, expense.id, 'name', e.target.value)}
                      className="flex-1 modern-input"
                      placeholder="Expense name"
                    />
                    <div className="relative">
                      <input
                        type="number"
                        value={convertFromBase(expense?.amount || 0).toFixed(2)}
                        onChange={(e) => {
                          const newAmount = parseFloat(e.target.value) || 0;
                          // Convert from current currency to base currency before saving
                          const amountInBase = convertToBase(newAmount);
                          updateGeneralExpense(currentMonthIndex, expense.id, 'amount', amountInBase);
                        }}
                        className="w-32 modern-input pr-8"
                        placeholder="Amount"
                      />
                      <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-secondary">
                        {currentCurrency}
                      </span>
                    </div>
                    <button
                      onClick={() => removeGeneralExpense(currentMonthIndex, expense.id)}
                      className="action-button text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
      
      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg backdrop-blur-lg border ${
          notification.type === 'success' 
            ? 'bg-green-500 bg-opacity-20 border-green-400 text-green-100' 
            : 'bg-red-500 bg-opacity-20 border-red-400 text-red-100'
        }`}>
          <div className="flex items-center">
            <div className={`w-4 h-4 rounded-full mr-3 ${
              notification.type === 'success' ? 'bg-green-400' : 'bg-red-400'
            }`}></div>
            <span className="font-medium">{notification.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthlyPlanningPage;
