import React, { createContext, useContext, useEffect, useReducer, useState } from 'react';

const AppContext = createContext(null);

const runtimeConfig = typeof window !== 'undefined' ? window.__APP_CONFIG__ || {} : {};
export const API_URL = runtimeConfig.REACT_APP_API_URL || process.env.REACT_APP_API_URL || 'http://localhost:4000';

function readStorage(key, fallback) {
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : fallback;
}

const initialState = {
  user: readStorage('health_user', null),
  profile: readStorage('health_profile', null),
  steps: readStorage('health_steps', []),
  water: readStorage('health_water', []),
  weight: readStorage('health_weight', []),
};

function todayKey() {
  return new Date().toISOString().split('T')[0];
}

function reducer(state, action) {
  switch (action.type) {
    case 'HYDRATE_STATE':
      return { ...state, ...action.payload };
    case 'LOGIN':
      return { ...state, user: action.payload };
    case 'LOGOUT':
      return { ...state, user: null };
    case 'SET_PROFILE':
      return { ...state, profile: action.payload };
    case 'SET_STEPS':
      return { ...state, steps: action.payload };
    case 'SET_WATER':
      return { ...state, water: action.payload };
    case 'SET_WEIGHT':
      return { ...state, weight: action.payload };
    case 'ADD_STEPS': {
      const today = todayKey();
      const existing = state.steps.find(item => item.date === today);
      const nextSteps = existing
        ? state.steps.map(item => (item.date === today ? { ...item, count: action.payload } : item))
        : [...state.steps, { date: today, count: action.payload }];
      return { ...state, steps: nextSteps };
    }
    case 'ADD_WATER': {
      const today = todayKey();
      const existing = state.water.find(item => item.date === today);
      const nextWater = existing
        ? state.water.map(item => (
            item.date === today
              ? {
                  ...item,
                  amount: item.amount + action.payload,
                  logs: [...(item.logs || []), { time: new Date().toISOString(), amount: action.payload }],
                }
              : item
          ))
        : [
            ...state.water,
            { date: today, amount: action.payload, logs: [{ time: new Date().toISOString(), amount: action.payload }] },
          ];
      return { ...state, water: nextWater };
    }
    case 'RESET_WATER': {
      const today = todayKey();
      const hasToday = state.water.some(item => item.date === today);
      const nextWater = hasToday
        ? state.water.map(item => (item.date === today ? { ...item, amount: 0, logs: [] } : item))
        : [...state.water, { date: today, amount: 0, logs: [] }];
      return { ...state, water: nextWater };
    }
    case 'ADD_WEIGHT': {
      const today = todayKey();
      const existing = state.weight.find(item => item.date === today);
      const nextWeight = existing
        ? state.weight.map(item => (item.date === today ? { ...item, value: action.payload } : item))
        : [...state.weight, { date: today, value: action.payload }];
      return { ...state, weight: nextWeight };
    }
    default:
      return state;
  }
}

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json') ? await response.json() : null;

  if (!response.ok) {
    throw new Error(payload?.message || 'Request failed');
  }

  return payload;
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isBootstrapping, setIsBootstrapping] = useState(
    !initialState.profile &&
      initialState.steps.length === 0 &&
      initialState.water.length === 0 &&
      initialState.weight.length === 0
  );

  useEffect(() => {
    if (!isBootstrapping) return undefined;

    let mounted = true;

    async function bootstrapDemoData() {
      try {
        const data = await request('/api/demo-state');
        if (!mounted) return;

        dispatch({
          type: 'HYDRATE_STATE',
          payload: {
            user: initialState.user,
            profile: data.profile || null,
            steps: data.steps || [],
            water: data.water || [],
            weight: data.weight || [],
          },
        });
      } catch (error) {
        console.error('Bootstrap demo data failed:', error);
      } finally {
        if (mounted) setIsBootstrapping(false);
      }
    }

    bootstrapDemoData();

    return () => {
      mounted = false;
    };
  }, [isBootstrapping]);

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

  const actions = {
    async login(email, password) {
      const data = await request('/api/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      dispatch({
        type: 'HYDRATE_STATE',
        payload: {
          user: data.user,
          profile: data.profile,
          steps: data.steps || [],
          water: data.water || [],
          weight: data.weight || [],
        },
      });

      return data;
    },

    async register(payload) {
      const data = await request('/api/register', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      dispatch({
        type: 'HYDRATE_STATE',
        payload: {
          user: data.user,
          profile: data.profile,
          steps: data.steps || [],
          water: data.water || [],
          weight: data.weight || [],
        },
      });

      return data;
    },

    logout() {
      dispatch({ type: 'LOGOUT' });
    },

    async saveProfile(profilePatch) {
      const profile = await request('/api/profile', {
        method: 'PUT',
        body: JSON.stringify(profilePatch),
      });
      dispatch({ type: 'SET_PROFILE', payload: profile });
      if (state.user && (profile.name || profile.email)) {
        dispatch({
          type: 'LOGIN',
          payload: {
            ...state.user,
            name: profile.name || state.user.name,
            email: profile.email || state.user.email,
          },
        });
      }
      return profile;
    },

    async addWater(amount) {
      const water = await request('/api/water', {
        method: 'POST',
        body: JSON.stringify({ amount }),
      });
      dispatch({ type: 'SET_WATER', payload: water });
      return water;
    },

    async resetWater() {
      const water = await request('/api/water/reset', {
        method: 'POST',
      });
      dispatch({ type: 'SET_WATER', payload: water });
      return water;
    },
  };

  return (
    <AppContext.Provider value={{ state, dispatch, actions, isBootstrapping }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
