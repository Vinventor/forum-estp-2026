import 'dotenv/config'; 
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg'; 
import pg from 'pg'; 

const app = express();

// --- 1. CONFIGURATION PRISMA (Postgres via pg-pool) ---
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// --- 2. CONFIGURATION CORS ---
app.use(cors({
  origin: [
    "https://forum-estp-2026.vercel.app", // Ton URL Vercel
    "http://localhost:3000"                // Localhost pour tes tests
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// Route de test (Health Check)
app.get('/', (req, res) => {
  res.send('🚀 Serveur Forum ESTP 2026 opérationnel (Admin/Sales/User).');
});

// --- 3. AUTHENTIFICATION ---

app.post('/api/register', async (req, res) => {
  try {
    const data = req.body;
    const result = await prisma.company.create({
      data: {
        name: data.companyName,
        siren: data.siren,
        address: data.address,
        billingName: data.billingName,
        billingAddress: data.billingAddress,
        users: { 
          create: {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email.toLowerCase(),
            phone: data.userPhone,
            jobTitle: data.jobTitle,
            password: data.password,
            role: "USER" // Rôle par défaut à l'inscription
          }
        }
      }
    });
    res.status(201).json(result);
  } catch (error) {
    console.error("Erreur Inscription:", error);
    res.status(500).json({ error: "Échec de l'inscription" });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { company: true } 
    });

    if (!user || user.password !== password) {
      return res.status(401).json({ error: "Identifiants incorrects" });
    }

    // On renvoie l'ID et le RÔLE pour le Frontend
    res.json({ 
      id: user.id,
      firstName: user.firstName, 
      companyName: user.company?.name || "Espace Staff", 
      email: user.email,
      role: user.role // ADMIN, SALES ou USER
    });
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// --- 4. ESPACE GESTION (ADMIN & COMMERCIAUX) ---

app.get('/api/admin/companies', async (req, res) => {
  const { userId, role } = req.query;

  try {
    let companies;

    if (role === 'ADMIN') {
      // Le Super Admin voit absolument tout le monde
      companies = await prisma.company.findMany({
        include: { users: { select: { firstName: true, email: true } } },
        orderBy: { name: 'asc' }
      });
    } else if (role === 'SALES') {
      // Le commercial ne voit que les entreprises dont il est le responsable (salesId)
      companies = await prisma.company.findMany({
        where: { salesId: parseInt(userId) },
        include: { users: { select: { firstName: true, email: true } } },
        orderBy: { name: 'asc' }
      });
    } else {
      return res.status(403).json({ error: "Accès refusé" });
    }

    res.json(companies);
  } catch (error) {
    console.error("Erreur Admin Fetch:", error);
    res.status(500).json({ error: "Erreur lors de la récupération" });
  }
});

// --- 5. ROUTES EXPOSANTS (STATUTS & DÉTAILS) ---

app.get('/api/company-status', async (req, res) => {
  const { email } = req.query;
  try {
    const user = await prisma.user.findUnique({
      where: { email: String(email).toLowerCase() },
      include: { company: true }
    });
    if (!user || !user.company) return res.status(404).json({ error: "Non trouvé" });

    res.json({
      companyName: user.company.name,
      pack: user.company.pack,
      isBc1Valid: !!user.company.pack, 
      isBc2Valid: user.company.bc2Status === "VALIDATED" || user.company.bc2Status === "SIGNED"
    });
  } catch (error) {
    res.status(500).json({ error: "Erreur statut" });
  }
});

app.get('/api/company-details', async (req, res) => {
  const { email } = req.query;
  try {
    const user = await prisma.user.findUnique({
      where: { email: String(email).toLowerCase() },
      include: { company: true }
    });
    if (!user) return res.status(404).json({ error: "Introuvable" });
    res.json({ user, company: user.company });
  } catch (error) {
    res.status(500).json({ error: "Erreur détails" });
  }
});

// --- 6. SAUVEGARDE DES BONS DE COMMANDE ---

app.post('/api/save-bc1', async (req, res) => {
  const { email, pack, surface, totalHT, options } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user) return res.status(404).json({ error: "User non trouvé" });

    await prisma.company.update({
      where: { id: user.companyId },
      data: { pack, surface, totalHT, options, bc1Status: "VALIDATED" }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Erreur BC1" });
  }
});

app.post('/api/save-bc2', async (req, res) => {
  const { email, logisticsData, totalHT } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user) return res.status(404).json({ error: "User non trouvé" });

    await prisma.company.update({
      where: { id: user.companyId },
      data: { logisticsData, bc2TotalHT: totalHT, bc2Status: "VALIDATED" }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Erreur BC2" });
  }
});

// --- 7. DÉMARRAGE ---
const PORT = process.env.PORT || 3001; 
app.listen(PORT, () => {
  console.log(`🚀 SERVEUR ESTP PRÊT SUR LE PORT : ${PORT}`);
});
