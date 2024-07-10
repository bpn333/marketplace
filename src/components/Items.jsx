import { Card, CardContent, Typography, Grid, Box, Avatar } from '@mui/material';

function Items({ items }) {
    return (
        <Grid container spacing={3} sx={{
            p: 3
        }}>
            {items.map((item) => (
                <Grid item key={item.id} xs={12} sm={6} md={3} sx={{ cursor: 'pointer' }} onClick={() => window.location.href = '/item/' + item.id}>
                    <Card>
                        <CardContent sx={{
                            p: 2
                        }}>
                            <img src={item.photo} alt={item.name} style={{ maxWidth: '100%', height: 'auto' }} />
                            <Typography variant="h5" component="div" sx={{
                                fontFamily: 'cursive'
                            }}>
                                {item.name}
                            </Typography>
                            <Typography color="text.secondary" sx={{
                                color: 'lime',
                                textAlign: 'right',
                                fontFamily: 'fantasy',
                                letterSpacing: '2px'
                            }}>
                                {item.price} /-
                            </Typography>
                            <Typography variant="body2" component="div" sx={{
                                fontFamily: 'cursive'
                            }}>
                                {item.description.slice(0, 10)}
                            </Typography>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                pt: 1
                            }}>
                                <span>
                                    <Avatar src={item.owner_img} sx={{ width: 40, height: 40, display: 'inline-flex' }} />
                                    <Typography variant="body2" color="text.primary" sx={{
                                        textAlign: 'center'
                                    }}>
                                        {item.owner_name}
                                    </Typography>
                                </span>
                                <span>
                                    <Typography variant="body2" color="text.secondary">
                                        {item.date.split('T')[0]}
                                    </Typography>
                                    <Typography variant="body2" color="text.primary">
                                        {item.date.split('T')[1].split('.')[0]}
                                    </Typography>
                                </span>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
}

export default Items;
