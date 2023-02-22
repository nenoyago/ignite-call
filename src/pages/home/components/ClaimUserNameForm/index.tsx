import { Button, Text, TextInput } from '@neno-ignite-ui/react';
import { ArrowRight } from 'phosphor-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormAnnotation } from './styles';
import { useRouter } from 'next/router';

const claimUserNameFormSchema = z.object({
  username: z
    .string()
    .min(3, {
      message: 'Mínimo de 3 caracteres'
    })
    .max(20, {
      message: 'Máximo de 20 caracteres'
    })
    .regex(/^([a-z\\-]+)$/i, {
      message: 'Somente letras e hífens'
    })
    .transform((username) => username.toLowerCase())
});

type ClaimUserNameFormData = z.infer<typeof claimUserNameFormSchema>;

export function ClaimUserNameForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ClaimUserNameFormData>({
    resolver: zodResolver(claimUserNameFormSchema)
  });

  const router = useRouter();

  async function handleClaimUserName(data: ClaimUserNameFormData) {
    const { username } = data;

    await router.push(`/register?username=${username}`);
  }

  return (
    <>
      <Form as="form" onSubmit={handleSubmit(handleClaimUserName)}>
        <TextInput
          size="sm"
          prefix="ignite.com/"
          placeholder="seu-usuário"
          {...register('username')}
        />
        <Button size="sm" type="submit" disabled={isSubmitting}>
          Reservar
          <ArrowRight />
        </Button>
      </Form>
      <FormAnnotation hasError={!!errors.username}>
        <Text size="sm">
          {errors.username
            ? errors.username.message
            : 'Digite o nome do usuário desejado'}
        </Text>
      </FormAnnotation>
    </>
  );
}
