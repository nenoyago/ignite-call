import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Text, TextArea, TextInput } from '@neno-ignite-ui/react';
import { CalendarBlank, Clock } from 'phosphor-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { ConfirmForm, FormActions, FormError, FormHeader } from './styles';
import dayjs from 'dayjs';
import { api } from '@lib/axios';
import { useRouter } from 'next/router';

const confirmFormSchema = z.object({
  name: z
    .string()
    .min(3, {
      message: 'Nome deve ter no mínimo 3 caracteres'
    })
    .max(100, {
      message: 'Nome deve ter no máximo 100 caracteres'
    }),
  email: z.string().email({
    message: 'E-mail inválido'
  }),
  observations: z.string().nullable()
});

type ConfirmFormData = z.infer<typeof confirmFormSchema>;

type ConfirmStepProps = {
  schedulingDate: Date;
  onCancelConfirmation: () => void;
};

export function ConfirmStep({
  schedulingDate,
  onCancelConfirmation
}: ConfirmStepProps) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors }
  } = useForm<ConfirmFormData>({
    resolver: zodResolver(confirmFormSchema)
  });

  const router = useRouter();
  const username = String(router.query.username);

  async function handleConfirmScheduling(data: ConfirmFormData) {
    try {
      const { name, email, observations } = data;

      await api.post(`/users/${username}/schedule`, {
        name,
        email,
        observations,
        date: schedulingDate
      });

      onCancelConfirmation();
    } catch (error) {
      console.error(error);
    }
  }

  const describedDate = dayjs(schedulingDate).format('DD[ de ]MMMM[ de ]YYYY');
  const describedTime = dayjs(schedulingDate).format('HH:mm[h]');

  return (
    <ConfirmForm as="form" onSubmit={handleSubmit(handleConfirmScheduling)}>
      <FormHeader>
        <Text>
          <CalendarBlank />
          {describedDate}
        </Text>
        <Text>
          <Clock />
          {describedTime}
        </Text>
      </FormHeader>

      <label>
        <Text size="sm">Nome completo</Text>
        <TextInput placeholder="Seu nome" {...register('name')} />
        {errors.name && <FormError size="sm">{errors.name.message}</FormError>}
      </label>

      <label>
        <Text size="sm">Endereço de e-mail</Text>
        <TextInput placeholder="jonhdoe@example.com" {...register('email')} />
        {errors.email && (
          <FormError size="sm">{errors.email.message}</FormError>
        )}
      </label>

      <label>
        <Text size="sm">Observações</Text>
        <TextArea {...register('observations')} />
      </label>

      <FormActions>
        <Button type="button" variant="tertiary" onClick={onCancelConfirmation}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          Confirmar
        </Button>
      </FormActions>
    </ConfirmForm>
  );
}
