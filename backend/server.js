const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const PORT = Number(process.env.PORT || 4000);
const DB_PATH = path.join(__dirname, 'data', 'db.json');

function readDb() {
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
}

function writeDb(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.end(JSON.stringify(payload));
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', chunk => {
      raw += chunk;
    });
    req.on('end', () => {
      if (!raw) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(raw));
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', reject);
  });
}

function getToday() {
  return new Date().toISOString().split('T')[0];
}

function upsertByDate(collection, key, nextValue) {
  const index = collection.findIndex(item => item.date === key);
  if (index >= 0) {
    collection[index] = { ...collection[index], ...nextValue };
  } else {
    collection.push({ date: key, ...nextValue });
  }
  return collection;
}

function buildSessionPayload(db, user) {
  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    profile: db.profile,
    steps: db.steps,
    water: db.water,
    weight: db.weight,
  };
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;

  if (req.method === 'OPTIONS') {
    sendJson(res, 204, {});
    return;
  }

  try {
    if (req.method === 'GET' && pathname === '/health') {
      sendJson(res, 200, { status: 'ok', service: 'healthy-app-backend' });
      return;
    }

    if (req.method === 'GET' && pathname === '/api/demo-state') {
      const db = readDb();
      sendJson(res, 200, db);
      return;
    }

    if (req.method === 'POST' && pathname === '/api/login') {
      const body = await parseBody(req);
      const db = readDb();
      const user = db.users.find(
        item => item.email === body.email && item.password === body.password
      );

      if (!user) {
        sendJson(res, 401, { message: 'Invalid credentials' });
        return;
      }

      sendJson(res, 200, buildSessionPayload(db, user));
      return;
    }

    if (req.method === 'POST' && pathname === '/api/register') {
      const body = await parseBody(req);
      const db = readDb();

      if (!body.email || !body.password) {
        sendJson(res, 400, { message: 'Email and password are required' });
        return;
      }

      if (db.users.some(item => item.email === body.email)) {
        sendJson(res, 409, { message: 'Email already exists' });
        return;
      }

      const nextUser = {
        id: Date.now(),
        name: body.name || body.email.split('@')[0],
        email: body.email,
        password: body.password,
      };

      db.users.push(nextUser);
      db.user = {
        id: nextUser.id,
        name: nextUser.name,
        email: nextUser.email,
      };
      db.profile = {
        ...db.profile,
        name: nextUser.name,
        email: nextUser.email,
      };

      writeDb(db);
      sendJson(res, 201, buildSessionPayload(db, nextUser));
      return;
    }

    if (req.method === 'PUT' && pathname === '/api/profile') {
      const body = await parseBody(req);
      const db = readDb();
      db.profile = { ...db.profile, ...body };
      if (body.name || body.email) {
        db.user = {
          ...db.user,
          name: body.name || db.user.name,
          email: body.email || db.user.email,
        };
        db.users = db.users.map(item => (
          item.id === db.user.id
            ? {
                ...item,
                name: db.user.name,
                email: db.user.email,
              }
            : item
        ));
      }
      writeDb(db);
      sendJson(res, 200, db.profile);
      return;
    }

    if (req.method === 'PUT' && pathname === '/api/steps/today') {
      const body = await parseBody(req);
      const db = readDb();
      const count = Number(body.count);

      if (!Number.isFinite(count) || count < 0) {
        sendJson(res, 400, { message: 'count must be a positive number' });
        return;
      }

      db.steps = upsertByDate(db.steps, getToday(), { count });
      writeDb(db);
      sendJson(res, 200, db.steps);
      return;
    }

    if (req.method === 'POST' && pathname === '/api/water') {
      const body = await parseBody(req);
      const db = readDb();
      const amount = Number(body.amount);

      if (!Number.isFinite(amount) || amount <= 0) {
        sendJson(res, 400, { message: 'amount must be greater than 0' });
        return;
      }

      const today = getToday();
      const existing = db.water.find(item => item.date === today);

      if (existing) {
        existing.amount += amount;
        existing.logs = [...(existing.logs || []), { time: new Date().toISOString(), amount }];
      } else {
        db.water.push({
          date: today,
          amount,
          logs: [{ time: new Date().toISOString(), amount }],
        });
      }

      writeDb(db);
      sendJson(res, 200, db.water);
      return;
    }

    if (req.method === 'POST' && pathname === '/api/water/reset') {
      const db = readDb();
      const today = getToday();
      const existing = db.water.find(item => item.date === today);

      if (existing) {
        existing.amount = 0;
        existing.logs = [];
      } else {
        db.water.push({ date: today, amount: 0, logs: [] });
      }

      writeDb(db);
      sendJson(res, 200, db.water);
      return;
    }

    if (req.method === 'PUT' && pathname === '/api/weight/today') {
      const body = await parseBody(req);
      const db = readDb();
      const value = Number(body.value);

      if (!Number.isFinite(value) || value <= 0) {
        sendJson(res, 400, { message: 'value must be greater than 0' });
        return;
      }

      db.weight = upsertByDate(db.weight, getToday(), { value });
      writeDb(db);
      sendJson(res, 200, db.weight);
      return;
    }

    sendJson(res, 404, { message: 'Not found' });
  } catch (error) {
    sendJson(res, 500, {
      message: 'Internal server error',
      detail: error.message,
    });
  }
});

server.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
