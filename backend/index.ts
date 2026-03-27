import 'dotenv/config'; 
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg'; 
import pg from 'pg'; 

const app = express();

// --- 1. CONFIGURATION PRISMA ---
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

app.use(cors());
app.use(express.json());

// --- 2. AUTHENTIFICATION ---

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
            password: data.password 
          }
        }
      }
    });
    res.status(201).json(result);
  } catch (error) {
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
    if (!user || user.password !== password) return res.status(401).json({ error: "Identifiants incorrects" });
    res.json({ firstName: user.firstName, companyName: user.company.name, email: user.email });
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// --- 3. STATUTS & DASHBOARD ---

app.get('/api/company-status', async (req, res) => {
  const { email } = req.query;
  try {
    const user = await prisma.user.findUnique({
      where: { email: String(email).toLowerCase() },
      include: { company: true }
    });
    if (!user) return res.status(404).json({ error: "Non trouvé" });

    res.json({
      companyName: user.company.name,
      pack: user.company.pack,
      // Statut BC1 : Validé si un pack a été choisi
      isBc1Valid: !!user.company.pack, 
      // Statut BC2 : Validé si logisticsData contient quelque chose ou si le statut est VALIDATED
      isBc2Valid: user.company.bc2Status === "VALIDATED" || user.company.bc2Status === "SIGNED"
    });
  } catch (error) {
    res.status(500).json({ error: "Erreur statut" });
  }
});

// --- 4. RÉCUPÉRATION DES DÉTAILS (HISTORIQUE) ---

app.get('/api/company-details', async (req, res) => {
  const { email } = req.query;
  try {
    const user = await prisma.user.findUnique({
      where: { email: String(email).toLowerCase() },
      include: { company: true } // Crucial : inclut logisticsData pour l'historique
    });

    if (!user) return res.status(404).json({ error: "Utilisateur introuvable" });

    res.json({ 
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        jobTitle: user.jobTitle
      },
      company: user.company 
    });
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// --- 5. SAUVEGARDE DES BONS DE COMMANDE ---

// Sauvegarde BC1 (Stand)
app.post('/api/save-bc1', async (req, res) => {
  const { email, pack, surface, totalHT, options } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });

    await prisma.company.update({
      where: { id: user.companyId },
      data: { pack, surface, totalHT, options, bc1Status: "VALIDATED" }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Erreur sauvegarde BC1" });
  }
});

// Sauvegarde BC2 (Logistique)
app.post('/api/save-bc2', async (req, res) => {
  const { email, logisticsData, totalHT } = req.body;
  
  console.log("📥 Sauvegarde BC2 demandée pour :", email);

  try {
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });

    await prisma.company.update({
      where: { id: user.companyId },
      data: {
        logisticsData: logisticsData, // Reçoit le tableau [{name, qty, price...}]
        bc2TotalHT: totalHT,
        bc2Status: "VALIDATED"
      }
    });

    console.log("✅ BC2 enregistré !");
    res.json({ success: true });
  } catch (error) {
    console.error("🔥 Erreur Prisma BC2 :", error instanceof Error ? error.message : String(error));
    res.status(500).json({ error: "Erreur lors de la sauvegarde du BC2" });
  }
});

// --- 6. DÉMARRAGE ---
const PORT = 3001; 
app.listen(PORT, () => {
  console.log(`🚀 SERVEUR ESTP ACTIF : http://localhost:${PORT}`);
});