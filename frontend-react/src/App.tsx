import React, { useState, useEffect } from 'react';
import { Category, AppState } from './types';
import { apiService } from './services/api';
import Header from './components/Header';
import CategoryGrid from './components/CategoryGrid';
import AddCardForm from './components/AddCardForm';
import StatusBanner from './components/StatusBanner';
import DeployInstructions from './components/DeployInstructions';
import PreMadeCouples from './components/PreMadeCouples';
import './styles/index.css';

function App() {
  const [state, setState] = useState<AppState>({
    categories: [],
    loading: true,
    error: null,
    backendReady: false
  });

  const [showAddForm, setShowAddForm] = useState(false);

  // Check backend health
  useEffect(() => {
    checkBackendHealth();
  }, []);

  // Load categories if backend is ready
  useEffect(() => {
    if (state.backendReady) {
      loadCategories();
    }
  }, [state.backendReady]);

  // Poll for updates
  useEffect(() => {
    if (!state.backendReady) return;

    const interval = setInterval(() => {
      loadCategories();
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, [state.backendReady]);

  const checkBackendHealth = async () => {
    try {
      const isHealthy = await apiService.healthCheck();
      setState(prev => ({ ...prev, backendReady: isHealthy, loading: !isHealthy }));
      
      if (!isHealthy) {
        setState(prev => ({ ...prev, error: 'Backend not deployed yet' }));
      }
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        backendReady: false, 
        loading: false,
        error: 'Cannot connect to backend'
      }));
    }
  };

  const loadCategories = async () => {
    try {
      const categories = await apiService.getCategories();
      setState(prev => ({ 
        ...prev, 
        categories,
        loading: false,
        error: null 
      }));
    } catch (error) {
      console.error('Error loading categories:', error);
      setState(prev => ({ 
        ...prev, 
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }));
    }
  };

  const handleAddCard = async (cardData: any) => {
    try {
      await apiService.createCard(cardData);
      await loadCategories();
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding card:', error);
      alert(error instanceof Error ? error.message : 'Failed to add dish');
    }
  };

  const handleAssignPreMadeCouple = async (card: Card) => {
    // This will be called when a pre-made couple is dropped on a category
    const categoryId = prompt(`Which category for ${card.couple_name}? (appetizers/sides/main/desserts)`);
    if (categoryId && ['appetizers', 'sides', 'main', 'desserts'].includes(categoryId)) {
      try {
        await apiService.createCard({
          ...card,
          category_id: categoryId
        });
        await loadCategories();
      } catch (error) {
        console.error('Error assigning pre-made couple:', error);
      }
    }
  };

  const handleDragEnd = async (cardId: string, newCategoryId: string) => {
    try {
      await apiService.updateCardCategory(cardId, newCategoryId);
      await loadCategories();
    } catch (error) {
      console.error('Error moving card:', error);
      alert(error instanceof Error ? error.message : 'Failed to move dish');
    }
  };

  return (
    <div className="app">
      <Header />
      
      <StatusBanner 
        backendReady={state.backendReady}
        loading={state.loading}
        error={state.error}
      />

      {!state.backendReady && !state.loading && (
        <DeployInstructions onRetry={checkBackendHealth} />
      )}

      {state.backendReady && (
        <>
          <PreMadeCouples onAssignCouple={handleAssignPreMadeCouple} />
          
          <CategoryGrid 
            categories={state.categories}
            onDragEnd={handleDragEnd}
          />
          
          <div className="add-button-container">
            <button 
              className="add-card-btn main-add-btn"
              onClick={() => setShowAddForm(true)}
            >
              + Add New Dish
            </button>
          </div>
          
          {showAddForm && (
            <AddCardForm 
              categories={state.categories}
              onAddCard={handleAddCard}
              onClose={() => setShowAddForm(false)}
            />
          )}
        </>
      )}
    </div>
  );
}

export default App;