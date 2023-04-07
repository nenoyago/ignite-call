import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Heading,
  MultiStep,
  Text,
  TextInput
} from '@neno-ignite-ui/react';
import { AxiosError } from 'axios';
import { api } from 'lib/axios';
import { useRouter } from 'next/router';
import { ArrowRight } from 'phosphor-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Container, Form, FormError, Header } from './styles';
import { NextSeo } from 'next-seo';
import { toast } from '@lib/toast';

const registerFormSchema = z.object({
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
    .transform((username) => username.toLowerCase()),
  name: z.string().min(3, { message: 'Mínimo de 3 caracteres' }).max(40, {
    message: 'Máximo de 40 caracteres'
  })
});

type RegisterFormData = z.infer<typeof registerFormSchema>;

export default function Register() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema)
  });

  const router = useRouter();

  useEffect(() => {
    if (router.query?.username) {
      setValue('username', String(router.query.username));
    }
  }, [router.query?.username, setValue]);

  async function handleRegister(data: RegisterFormData) {
    const { username, name } = data;

    try {
      await api.post('/users', {
        username,
        name
      });

      await router.push('/register/connect-calendar');
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data?.message) {
        toast.error(error.response.data.message);
      }
      console.error(error);
    }
  }

  return (
    <>
      <NextSeo title="Crie uma conta | Ignite Call" />
      <Container>
        <Header>
          <Heading as="strong">Bem-vindo ao Ignite Call!</Heading>
          <Text>
            Precisamos de algumas informações para criar seu perfil! Ah, você
            pode editar essas informações depois.
          </Text>

          <MultiStep size={4} currentStep={1} />

          <Form as="form" onSubmit={handleSubmit(handleRegister)}>
            <label>
              <Text size="sm">Nome de usuário</Text>
              <TextInput
                prefix="ignite.com/"
                placeholder="seu-usuário"
                {...register('username')}
              />

              {errors.username && (
                <FormError size="sm">{errors.username.message}</FormError>
              )}
            </label>

            <label>
              <Text size="sm">Nome completo</Text>
              <TextInput placeholder="Seu nome" {...register('name')} />
              {errors.name && (
                <FormError size="sm">{errors.name.message}</FormError>
              )}
            </label>

            <Button type="submit" disabled={isSubmitting}>
              Próximo passo
              <ArrowRight />
            </Button>
          </Form>
        </Header>
      </Container>
    </>
  );
}
