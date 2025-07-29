import { Component } from 'react';
import { Box, Typography, Button, useTheme } from '@mui/material';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="100vh"
          bgcolor="#F6A09E"
          p={4}
        >
          <Typography
            variant="h4"
            color="#FDF8CE"
            fontFamily="Stolzl"
            textAlign="center"
            mb={2}
          >
            Oops! Something went wrong
          </Typography>
          <Typography
            variant="body1"
            color="#FDF8CE"
            fontFamily="Stolzl"
            textAlign="center"
            mb={4}
          >
            We're sorry for the inconvenience. Please try refreshing the page.
          </Typography>
          <Button
            variant="contained"
            onClick={() => window.location.reload()}
            sx={{
              bgcolor: '#FDF8CE',
              color: '#F6A09E',
              fontFamily: 'Stolzl',
              '&:hover': {
                bgcolor: '#B5D782',
              }
            }}
          >
            Refresh Page
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
