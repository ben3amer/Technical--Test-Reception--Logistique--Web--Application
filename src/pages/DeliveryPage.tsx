import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { getDelivery, receiveCarton, receivePallet, receiveProduct, unreceiveProduct } from '../api/delivery';
import type { ReceptionStatus } from '../types/delivery';

const statusColor = (status: ReceptionStatus) => {
  if (status === 'Received') return 'success';
  if (status === 'PartiallyReceived') return 'warning';
  return 'default';
};

const statusLabel = (status: ReceptionStatus) => {
  if (status === 'Received') return 'Reçu';
  if (status === 'PartiallyReceived') return 'Partiel';
  return 'Non reçu';
};

interface Props {
  orderId: string;
}

export default function DeliveryPage({ orderId }: Props) {
  const queryClient = useQueryClient();

  const { data: delivery, isLoading, isError } = useQuery({
    queryKey: ['delivery', orderId],
    queryFn: () => getDelivery(orderId),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['delivery', orderId] });

  const palletMutation = useMutation({ mutationFn: (palletId: string) => receivePallet(orderId, palletId), onSuccess: invalidate });
  const cartonMutation = useMutation({ mutationFn: ({ palletId, cartonId }: { palletId: string; cartonId: string }) => receiveCarton(orderId, palletId, cartonId), onSuccess: invalidate });
  const productReceive = useMutation({ mutationFn: ({ palletId, cartonId, ref }: { palletId: string; cartonId: string; ref: string }) => receiveProduct(orderId, palletId, cartonId, ref), onSuccess: invalidate });
  const productUnreceive = useMutation({ mutationFn: ({ palletId, cartonId, ref }: { palletId: string; cartonId: string; ref: string }) => unreceiveProduct(orderId, palletId, cartonId, ref), onSuccess: invalidate });

  if (isLoading) return <Box display="flex" justifyContent="center" mt={8}><CircularProgress /></Box>;
  if (isError || !delivery) return <Typography color="error" mt={4} textAlign="center">Erreur de chargement de la commande.</Typography>;

  const progress = delivery.progress.totalItems > 0
    ? (delivery.progress.receivedItems / delivery.progress.totalItems) * 100
    : 0;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="h5">Commande {delivery.orderId}</Typography>
          <Chip label={statusLabel(delivery.status)} color={statusColor(delivery.status)} />
        </Box>
        <Typography variant="body2" color="text.secondary" mb={1}>
          {delivery.progress.receivedItems} / {delivery.progress.totalItems} articles reçus
        </Typography>
        <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4 }} />
      </Paper>

      {delivery.pallets.map((pallet) => (
        <Accordion key={pallet.id} defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box display="flex" alignItems="center" gap={2} width="100%">
              <Typography fontWeight={600}>Palette {pallet.id}</Typography>
              <Chip size="small" label={statusLabel(pallet.status)} color={statusColor(pallet.status)} />
              <Box ml="auto" mr={2}>
                <Button size="small" variant="outlined" disabled={pallet.status === 'Received'}
                  onClick={(e) => { e.stopPropagation(); palletMutation.mutate(pallet.id); }}>
                  Tout recevoir
                </Button>
              </Box>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            {pallet.cartons.map((carton) => (
              <Box key={carton.id} mb={2}>
                <Box display="flex" alignItems="center" gap={2} mb={1}>
                  <Typography variant="subtitle2">Carton {carton.id}</Typography>
                  <Chip size="small" label={statusLabel(carton.status)} color={statusColor(carton.status)} />
                  <Button size="small" variant="outlined" disabled={carton.status === 'Received'}
                    onClick={() => cartonMutation.mutate({ palletId: pallet.id, cartonId: carton.id })}>
                    Tout recevoir
                  </Button>
                </Box>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Réf</TableCell>
                      <TableCell>Nom</TableCell>
                      <TableCell>Couleur</TableCell>
                      <TableCell>Taille</TableCell>
                      <TableCell>Attendu</TableCell>
                      <TableCell>Reçu</TableCell>
                      <TableCell>Statut</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {carton.products.map((product) => (
                      <TableRow key={product.ref}>
                        <TableCell>{product.ref}</TableCell>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.color}</TableCell>
                        <TableCell>{product.size}</TableCell>
                        <TableCell>{product.expectedQuantity}</TableCell>
                        <TableCell>{product.receivedQuantity}</TableCell>
                        <TableCell><Chip size="small" label={statusLabel(product.status)} color={statusColor(product.status)} /></TableCell>
                        <TableCell>
                          {product.status !== 'Received'
                            ? <Button size="small" variant="contained" color="success"
                                onClick={() => productReceive.mutate({ palletId: pallet.id, cartonId: carton.id, ref: product.ref })}>
                                Recevoir
                              </Button>
                            : <Button size="small" variant="outlined" color="error"
                                onClick={() => productUnreceive.mutate({ palletId: pallet.id, cartonId: carton.id, ref: product.ref })}>
                                Annuler
                              </Button>
                          }
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            ))}
          </AccordionDetails>
        </Accordion>
      ))}
    </Container>
  );
}
