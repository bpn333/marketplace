import { Card, CardContent, Typography, Grid, Box, Avatar } from '@mui/material';

function Items({ items }) {
    return (
        <Grid container spacing={3} sx={{
            padding: 3,
            justifyContent: 'center'
        }}>
            {items.map((item) => (
                <Grid item key={item.id} xs={6} md={3}>
                    <Card>
                        <CardContent sx={{
                            p: 3
                        }}>
                            <img src={item.photo} alt={item.name} style={{ maxWidth: '100%', height: 'auto', marginTop: '10px' }} />
                            <Typography variant="h5" component="div">
                                {item.name}
                            </Typography>
                            <Typography color="text.secondary">
                                Price: {item.price} /-
                            </Typography>
                            <Typography variant="body2" component="div">
                                {item.description.slice(0, 10)}
                            </Typography>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                p: 2
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
