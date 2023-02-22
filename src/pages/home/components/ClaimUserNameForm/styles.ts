import { Box, styled, Text } from '@neno-ignite-ui/react';

export const Form = styled(Box, {
  display: 'grid',
  gridTemplateColumns: '1fr auto',
  gap: '$2',
  marginTop: '$4',
  padding: '$4',

  '@media(max-width: 600px)': {
    gridTemplateColumns: '1fr'
  }
});

export const FormAnnotation = styled('div', {
  marginTop: '$2',

  variants: {
    hasError: {
      true: {
        [`${Text}`]: {
          color: '$danger'
        }
      },
      false: {
        [`${Text}`]: {
          color: '$gray400'
        }
      }
    }
  },

  defaultVariants: {
    hasError: false
  }
});
