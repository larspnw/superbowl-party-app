import React, { useState, useEffect } from 'react';
import { Category, AppState, Card } from './types';
import { apiService } from './services/api';
import Header from './components/Header';
import CategoryGrid from './components/CategoryGrid';
import AddCardForm from './components/AddCardForm';
import StatusBanner from './components/StatusBanner';
import DeployInstructions from './components/DeployInstructions';
import PreMadeCouples from './components/PreMadeCouples';
import CategoryPicker from './components/CategoryPicker';
import EditCardModal from './components/EditCardModal';
import './styles/index.css';

const APP_VERSION = '1.0.4';

function App() {
  const [state, setState] = useState<AppState>({
    categories: [],
    loading: true,
    error: null,
    backendReady: false
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [pendingCard, setPendingCard] = useState<Card | null>(null);

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
    // Show category picker modal
    setPendingCard(card);
  };

  const handleCategorySelect = async (categoryId: string, dishName: string, allergies: string) => {
    if (!pendingCard) return;
    
    try {
      await apiService.createCard({
        couple_name: pendingCard.couple_name,
        dish_name: dishName,
        dietary_restrictions: allergies,
        category_id: categoryId
      });
      await loadCategories();
    } catch (error) {
      console.error('Error assigning pre-made couple:', error);
      alert(error instanceof Error ? error.message : 'Failed to add dish');
    } finally {
      setPendingCard(null);
    }
  };

  const [editingCard, setEditingCard] = useState<Card | null>(null);

  const handleCardClick = async (card: Card) => {
    // Open edit modal for existing card
    setEditingCard(card);
  };

  const handleCardUpdate = async (dishName: string, allergies: string) => {
    if (!editingCard) return;
    
    try {
      await apiService.updateCard(editingCard.id, { 
        dish_name: dishName,
        dietary_restrictions: allergies 
      });
      await loadCategories();
    } catch (error) {
      console.error('Error updating card:', error);
      alert(error instanceof Error ? error.message : 'Failed to update dish');
    } finally {
      setEditingCard(null);
    }
  };

  const handleDragEnd = async (cardId: string, newCategoryId: string, cardData?: any) => {
    try {
      // Check if this is a pre-made card (not yet in backend)
      if (cardId.startsWith('pre-') && cardData) {
        // Auto-assign to the drop target category - no picker needed
        await apiService.createCard({
          couple_name: cardData.couple_name,
          dish_name: cardData.dish_name || 'TBD',
          dietary_restrictions: cardData.dietary_restrictions || '',
          category_id: newCategoryId
        });
      } else {
        // Move existing card
        await apiService.updateCardCategory(cardId, newCategoryId);
      }
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
            onCardClick={handleCardClick}
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

          {pendingCard && (
            <CategoryPicker
              coupleName={pendingCard.couple_name}
              currentDish={pendingCard.dish_name}
              currentAllergies={pendingCard.dietary_restrictions}
              onSelect={handleCategorySelect}
              onCancel={() => setPendingCard(null)}
            />
          )}

          {editingCard && (
            <EditCardModal
              card={editingCard}
              onSave={handleCardUpdate}
              onCancel={() => setEditingCard(null)}
            />
          )}
        </>
      )}

      <div className="version-footer">v{APP_VERSION}</div>
    </div>
  );
}

export default App;