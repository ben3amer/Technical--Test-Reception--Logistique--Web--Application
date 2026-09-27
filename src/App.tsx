import { useState } from 'react';
import {
  AppBar,
  Box,
  Button,
  Container,
  InputAdornment,
  Paper,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import SearchIcon from '@mui/icons-material/Search';
import DeliveryPage from './pages/DeliveryPage';

export default function App() {
  const [input, setInput] = useState('');
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);

  const search = () => { if (input.trim()) setActiveOrderId(input.trim()); };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f0f2f5' }}>
      <AppBar position="static" elevation={0} sx={{ bgcolor: '#1a237e' }}>
        <Toolbar>
          <WarehouseIcon sx={{ mr: 1.5, fontSize: 28 }} />
          <Typography variant="h6" fontWeight={700} letterSpacing={0.5}>
            Réception Logistique
          </Typography>
          {activeOrderId && (
            <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <TextField
                size="small"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && search()}
                placeholder="Autre commande..."
                slotProps={{
                  input: {
                    startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: 'white', fontSize: 18 }} /></InputAdornment>,
                    sx: { color: 'white', '& fieldset': { borderColor: 'rgba(255,255,255,0.4)' }, '&:hover fieldset': { borderColor: 'white' } },
                  }
                }}
                sx={{ width: 220 }}
              />
              <Button variant="outlined" size="small" onClick={search}
                sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)', '&:hover': { borderColor: 'white' } }}>
                Rechercher
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {!activeOrderId ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '70vh' }}>
            <Paper elevation={0} sx={{ p: 5, width: 440, borderRadius: 3, border: '1px solid #e0e0e0', textAlign: 'center' }}>
              <WarehouseIcon sx={{ fontSize: 56, color: '#1a237e', mb: 2 }} />
              <Typography variant="h5" fontWeight={700} mb={0.5}>
                Contrôle de réception
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={4}>
                Saisissez un numéro de commande pour accéder à la réception
              </Typography>
              <TextField
                label="Numéro de commande"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && search()}
                placeholder="ex: CMD-2026"
                fullWidth
                autoFocus
                slotProps={{
                  input: {
                    startAdornment: <InputAdornment position="start"><SearchIcon color="action" /></InputAdornment>,
                  }
                }}
                sx={{ mb: 2 }}
              />
              <Button variant="contained" fullWidth size="large" onClick={search}
                sx={{ bgcolor: '#1a237e', '&:hover': { bgcolor: '#283593' }, py: 1.4, fontWeight: 600 }}>
                Accéder à la commande
              </Button>
            </Paper>
          </Box>
        ) : (
          <DeliveryPage orderId={activeOrderId} onReset={() => { setActiveOrderId(null); setInput(''); }} />
        )}
      </Container>
    </Box>
  );
}
