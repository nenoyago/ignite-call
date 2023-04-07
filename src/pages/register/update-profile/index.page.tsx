import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '@lib/axios';
import {
  Avatar,
  Button,
  Heading,
  MultiStep,
  Text,
  TextArea
} from '@neno-ignite-ui/react';
import { buildNextAuthOptions } from '@pages/api/auth/[...nextauth].api';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { ArrowRight } from 'phosphor-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Container, Header } from '../styles';
import { ProfileBox, FormAnnotation, FormError } from './styles';
import { NextSeo } from 'next-seo';

const updateProfileFormSchema = z.object({
  bio: z.string().min(3, { message: 'Mínimo de 3 caracteres' }).max(240, {
    message: 'Máximo de 240 caracteres'
  })
});

type UpdateProfileFormData = z.infer<typeof updateProfileFormSchema>;

export default function UpdateProfile() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileFormSchema)
  });

  const router = useRouter();
  const session = useSession();

  async function handleUpdateProfile(data: UpdateProfileFormData) {
    const { bio } = data;

    try {
      await api.put('/users/profile', {
        bio
      });
      await router.push(`/schedule/${session.data?.user.username}`);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <NextSeo title="Atualize seu perfil | Ignite Call" noindex />
      <Container>
        <Header>
          <Heading as="strong">Bem-vindo ao Ignite Call!</Heading>
          <Text>Por último, uma breve descrição e uma foto de perfil.</Text>

          <MultiStep size={4} currentStep={4} />

          <ProfileBox as="form" onSubmit={handleSubmit(handleUpdateProfile)}>
            <label>
              <Text size="sm">Foto de perfil</Text>
              <Avatar
                src={session.data?.user.avatar_url}
                alt={session.data?.user.name}
                referrerPolicy="no-referrer"
              />
            </label>

            <label>
              <Text size="sm">Sobre você</Text>
              <TextArea {...register('bio')} />
              {errors.bio ? (
                <FormError size="sm">{errors.bio.message}</FormError>
              ) : (
                <FormAnnotation size="sm">
                  Fale um pouco sobre você. Isto será exibido em sua página
                  pessoal.
                </FormAnnotation>
              )}
            </label>

            <Button type="submit" disabled={isSubmitting}>
              Finalizar
              <ArrowRight />
            </Button>
          </ProfileBox>
        </Header>
      </Container>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getServerSession(
    req,
    res,
    buildNextAuthOptions(req, res)
  );

  return {
    props: {
      session
    }
  };
};
