import React, { createContext, useContext, useReducer, useEffect } from 'react';

const AppContext = createContext(null);

const initialState = {
  user: JSON.parse(localStorage.getItem('health_user')) || null,
  profile: JSON.parse(localStorage.getItem('health_profile')) || null,
  steps: JSON.parse(localStorage.getItem('health_steps')) || [],
  water: JSON.parse(localStorage.getItem('health_water')) || [],
  weight: JSON.parse(localStorage.getItem('health_weight')) || [],
};

function reducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload };
    case 'LOGOUT':
      return { ...state, user: null };
    case 'SET_PROFILE':
      return { ...state, profile: action.payload };
    case 'ADD_STEPS': {
      const today = new Date().toISOString().split('T')[0];
      const existing = state.steps.find(s => s.date === today);
      let updated;
      if (existing) {
        updated = state.steps.map(s => s.date === today ? { ...s, count: action.payload } : s);
      } else {
        updated = [...state.steps, { date: today, count: action.payload }];
      }
      return { ...state, steps: updated };
    }
    case 'ADD_WATER': {
      const today = new Date().toISOString().split('T')[0];
      const existing = state.water.find(w => w.date === today);
      let updated;
      if (existing) {
        updated = state.water.map(w => w.date === today
          ? { ...w, amount: w.amount + action.payload, logs: [...(w.logs || []), { time: new Date().toISOString(), amount: action.payload }] }
          : w
        );
      } else {
        updated = [...state.water, { date: today, amount: action.payload, logs: [{ time: new Date().toISOString(), amount: action.payload }] }];
      }
      return { ...state, water: updated };
    }
    case 'RESET_WATER': {
      const today = new Date().toISOString().split('T')[0];
      const updated = state.water.map(w => w.date === today ? { ...w, amount: 0, logs: [] } : w);
      return { ...state, water: updated };
    }
    case 'ADD_WEIGHT': {
      const today = new Date().toISOString().split('T')[0];
      const existing = state.weight.find(w => w.date === today);
      let updated;
      if (existing) {
        updated = state.weight.map(w => w.date === today ? { ...w, value: action.payload } : w);
      } else {
        updated = [...state.weight, { date: today, value: action.payload }];
      }
      return { ...state, weight: updated };
    }
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (state.user) localStorage.setItem('health_user', JSON.stringify(state.user));
    else localStorage.removeItem('health_user');
  }, [state.user]);

  useEffect(() => {
    if (state.profile) localStorage.setItem('health_profile', JSON.stringify(state.profile));
  }, [state.profile]);

  useEffect(() => {
    localStorage.setItem('health_steps', JSON.stringify(state.steps));
  }, [state.steps]);

  useEffect(() => {
    localStorage.setItem('health_water', JSON.stringify(state.water));
  }, [state.water]);

  useEffect(() => {
    localStorage.setItem('health_weight', JSON.stringify(state.weight));
  }, [state.weight]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
